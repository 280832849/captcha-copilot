from typing import Any, List, Optional, Tuple, Dict, Union
import io
import requests
from PIL import Image, ImageFilter
import numpy as np
from ..base import BaseCaptchaSolver
from ..exceptions import CaptchaProcessingError, CaptchaRecognitionError, ConfigurationError


class SpatialCaptchaSolver(BaseCaptchaSolver):
    CAPTCHA_TYPE: str = "spatial"
    
    def __init__(self, config: Optional[dict] = None):
        super().__init__(config)
        self._validate_config()
    
    def _validate_config(self) -> None:
        solver_type = self.config.get("solver_type", "api")
        if solver_type not in ["api", "template", "custom"]:
            raise ConfigurationError(f"Unsupported solver type: {solver_type}. Use 'api', 'template' or 'custom'.")
        
        if solver_type == "api":
            api_url = self.config.get("api_url")
            if not api_url:
                self.logger.warning("api_url not provided for API solver type. Will use placeholder for initialization.")
    
    def solve(self, image_path: Optional[str] = None, image_data: Optional[bytes] = None, 
              question_type: str = "find_different", question: Optional[str] = None, **kwargs) -> Union[Tuple[int, int], List[Tuple[int, int]]]:
        self.validate_input(image_path=image_path, image_data=image_data)
        self.logger.info(f"Solving spatial captcha: {image_path or 'image_data provided'}, type: {question_type}")
        
        try:
            image = self._load_image(image_path, image_data)
            preprocessed_image = self._preprocess_image(image)
            
            solver_type = self.config.get("solver_type", "api")
            if solver_type == "api":
                result = self._solve_with_api(preprocessed_image, question_type, question)
            elif solver_type == "template":
                result = self._solve_with_template(preprocessed_image, question_type, kwargs.get("template_images", []))
            else:
                result = self._solve_with_custom(preprocessed_image, question_type, kwargs.get("custom_solver"))
            
            self.logger.info(f"Spatial captcha solved: {result}")
            return result
        
        except Exception as e:
            self.logger.error(f"Failed to solve spatial captcha: {str(e)}")
            raise CaptchaRecognitionError(f"Failed to solve spatial captcha: {str(e)}")
    
    def _load_image(self, image_path: Optional[str] = None, image_data: Optional[bytes] = None) -> Image.Image:
        if image_path:
            return Image.open(image_path)
        elif image_data:
            return Image.open(io.BytesIO(image_data))
        else:
            raise CaptchaProcessingError("Either image_path or image_data must be provided")
    
    def _preprocess_image(self, image: Image.Image) -> Image.Image:
        preprocess_config = self.config.get("preprocess", {})
        
        processed_image = image.copy()
        
        if preprocess_config.get("grayscale", False):
            processed_image = processed_image.convert("L")
        
        if preprocess_config.get("denoise", True):
            processed_image = processed_image.filter(ImageFilter.MedianFilter())
        
        if preprocess_config.get("threshold", None):
            threshold = preprocess_config["threshold"]
            processed_image = processed_image.point(lambda p: p > threshold and 255 or 0)
        
        if preprocess_config.get("contrast", 1.0) != 1.0:
            from PIL import ImageEnhance
            enhancer = ImageEnhance.Contrast(processed_image)
            processed_image = enhancer.enhance(preprocess_config["contrast"])
        
        if preprocess_config.get("sharpness", 1.0) != 1.0:
            from PIL import ImageEnhance
            enhancer = ImageEnhance.Sharpness(processed_image)
            processed_image = enhancer.enhance(preprocess_config["sharpness"])
        
        return processed_image
    
    def _solve_with_api(self, image: Image.Image, question_type: str, question: Optional[str] = None) -> Union[Tuple[int, int], List[Tuple[int, int]]]:
        api_url = self.config["api_url"]
        api_key = self.config.get("api_key")
        api_timeout = self.config.get("api_timeout", 30)
        
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format="PNG")
        img_byte_arr = img_byte_arr.getvalue()
        
        headers = {}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        
        files = {"image": ("captcha.png", img_byte_arr, "image/png")}
        data = {"question_type": question_type}
        if question:
            data["question"] = question
        
        try:
            response = requests.post(api_url, files=files, data=data, headers=headers, timeout=api_timeout)
            response.raise_for_status()
            
            response_data = response.json()
            result_field = self.config.get("api_result_field", "result")
            result = response_data.get(result_field)
            
            if result is None:
                raise CaptchaRecognitionError("API returned empty result")
            
            if isinstance(result, list):
                return [(int(p[0]), int(p[1])) for p in result]
            else:
                return (int(result[0]), int(result[1]))
        
        except requests.exceptions.RequestException as e:
            raise CaptchaRecognitionError(f"API request failed: {str(e)}")
        except ValueError as e:
            raise CaptchaRecognitionError(f"Failed to parse API response: {str(e)}")
    
    def _solve_with_template(self, image: Image.Image, question_type: str, template_images: List[Image.Image]) -> Union[Tuple[int, int], List[Tuple[int, int]]]:
        if not template_images:
            raise ConfigurationError("template_images must be provided for template solver type")
        
        try:
            import cv2
        except ImportError:
            raise ConfigurationError("opencv-python is not installed. Please install it with 'pip install opencv-python'")
        
        image_np = np.array(image)
        if len(image_np.shape) == 3:
            image_gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
        else:
            image_gray = image_np
        
        positions = []
        threshold = self.config.get("template_threshold", 0.8)
        
        for template_img in template_images:
            template_np = np.array(template_img)
            if len(template_np.shape) == 3:
                template_gray = cv2.cvtColor(template_np, cv2.COLOR_RGB2GRAY)
            else:
                template_gray = template_np
            
            result = cv2.matchTemplate(image_gray, template_gray, cv2.TM_CCOEFF_NORMED)
            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
            
            if max_val >= threshold:
                h, w = template_gray.shape
                center_x = max_loc[0] + w // 2
                center_y = max_loc[1] + h // 2
                positions.append((center_x, center_y))
        
        if question_type == "find_different":
            if positions:
                return positions[0]
            raise CaptchaRecognitionError("No different element found")
        else:
            return positions
    
    def _solve_with_custom(self, image: Image.Image, question_type: str, custom_solver=None) -> Union[Tuple[int, int], List[Tuple[int, int]]]:
        if not custom_solver:
            raise ConfigurationError("custom_solver must be provided for custom solver type")
        
        try:
            return custom_solver(image, question_type)
        except Exception as e:
            raise CaptchaRecognitionError(f"Custom solver failed: {str(e)}")
    
    def _find_different_by_color(self, image: Image.Image) -> Optional[Tuple[int, int]]:
        try:
            import cv2
        except ImportError:
            raise ConfigurationError("opencv-python is not installed. Please install it with 'pip install opencv-python'")
        
        image_np = np.array(image)
        if len(image_np.shape) == 3:
            hsv = cv2.cvtColor(image_np, cv2.COLOR_RGB2HSV)
        else:
            hsv = image_np
        
        h, w = hsv.shape[:2]
        hist_h = cv2.calcHist([hsv], [0], None, [180], [0, 180])
        
        dominant_h = np.argmax(hist_h)
        
        mask = cv2.inRange(hsv[:, :, 0], dominant_h - 10, dominant_h + 10)
        inverse_mask = cv2.bitwise_not(mask)
        
        contours, _ = cv2.findContours(inverse_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            largest_contour = max(contours, key=cv2.contourArea)
            M = cv2.moments(largest_contour)
            if M["m00"] != 0:
                cx = int(M["m10"] / M["m00"])
                cy = int(M["m01"] / M["m00"])
                return (cx, cy)
        
        return None
    
    def execute_click(self, browser, result: Union[Tuple[int, int], List[Tuple[int, int]]], 
                      captcha_element=None, offset_x: int = 0, offset_y: int = 0) -> None:
        positions = [result] if isinstance(result, tuple) else result
        
        if hasattr(browser, 'execute_script'):
            self._execute_with_selenium(browser, positions, captcha_element, offset_x, offset_y)
        elif hasattr(browser, 'page'):
            self._execute_with_playwright(browser, positions, captcha_element, offset_x, offset_y)
        else:
            raise CaptchaProcessingError("Unsupported browser automation tool")
    
    def _execute_with_selenium(self, driver, positions: List[Tuple[int, int]], captcha_element=None, offset_x: int = 0, offset_y: int = 0) -> None:
        from selenium.webdriver.common.action_chains import ActionChains
        
        actions = ActionChains(driver)
        
        if captcha_element:
            location = captcha_element.location
            size = captcha_element.size
            base_x = location['x'] + offset_x
            base_y = location['y'] + offset_y
        else:
            base_x = offset_x
            base_y = offset_y
        
        for x, y in positions:
            actions.move_to_element_with_offset(captcha_element if captcha_element else driver.find_element_by_tag_name('body'), 
                                                base_x + x, base_y + y)
            actions.click()
            actions.pause(0.1)
        
        actions.perform()
    
    def _execute_with_playwright(self, page, positions: List[Tuple[int, int]], captcha_element=None, offset_x: int = 0, offset_y: int = 0) -> None:
        if captcha_element:
            bounding_box = captcha_element.bounding_box()
            base_x = bounding_box['x'] + offset_x if bounding_box else offset_x
            base_y = bounding_box['y'] + offset_y if bounding_box else offset_y
        else:
            base_x = offset_x
            base_y = offset_y
        
        for x, y in positions:
            page.click(position={'x': base_x + x, 'y': base_y + y})
            page.wait_for_timeout(100)
    
    def validate_input(self, image_path: Optional[str] = None, image_data: Optional[bytes] = None, **kwargs) -> None:
        if not image_path and not image_data:
            self._raise_processing_error("Either image_path or image_data must be provided")
