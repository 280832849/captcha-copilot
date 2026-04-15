from typing import Any, List, Optional, Tuple, Dict, Union
import io
import requests
from PIL import Image, ImageFilter
import numpy as np
try:
    import pytesseract
except ImportError:
    pytesseract = None
from ..base import BaseCaptchaSolver
from ..exceptions import CaptchaProcessingError, CaptchaRecognitionError, ConfigurationError


class ClickCaptchaSolver(BaseCaptchaSolver):
    CAPTCHA_TYPE: str = "click"
    
    def __init__(self, config: Optional[dict] = None):
        super().__init__(config)
        self._validate_config()
        self._initialize_ocr_engine()
    
    def _validate_config(self) -> None:
        solver_type = self.config.get("solver_type", "tesseract")
        if solver_type not in ["tesseract", "api", "template"]:
            raise ConfigurationError(f"Unsupported solver type: {solver_type}. Use 'tesseract', 'api' or 'template'.")
        
        if solver_type == "tesseract" and pytesseract is None:
            self.logger.warning("pytesseract not installed. Tesseract OCR will not be available.")
        
        if solver_type == "api":
            api_url = self.config.get("api_url")
            if not api_url:
                self.logger.warning("api_url not provided for API solver type. Will use placeholder for initialization.")
    
    def _initialize_ocr_engine(self) -> None:
        if pytesseract is not None:
            tesseract_path = self.config.get("tesseract_path")
            if tesseract_path:
                pytesseract.pytesseract.tesseract_cmd = tesseract_path
    
    def solve(self, image_path: Optional[str] = None, image_data: Optional[bytes] = None, 
              target_text: Optional[str] = None, **kwargs) -> List[Tuple[int, int]]:
        self.validate_input(image_path=image_path, image_data=image_data, target_text=target_text)
        self.logger.info(f"Solving click captcha: {image_path or 'image_data provided'}, target: {target_text}")
        
        try:
            image = self._load_image(image_path, image_data)
            preprocessed_image = self._preprocess_image(image)
            
            solver_type = self.config.get("solver_type", "tesseract")
            if solver_type == "tesseract":
                positions = self._solve_with_tesseract(preprocessed_image, target_text)
            elif solver_type == "api":
                positions = self._solve_with_api(preprocessed_image, target_text)
            else:
                positions = self._solve_with_template(preprocessed_image, target_text, kwargs.get("template_images", []))
            
            self.logger.info(f"Click captcha solved, positions: {positions}")
            return positions
        
        except Exception as e:
            self.logger.error(f"Failed to solve click captcha: {str(e)}")
            raise CaptchaRecognitionError(f"Failed to solve click captcha: {str(e)}")
    
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
        
        if preprocess_config.get("grayscale", True):
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
    
    def _solve_with_tesseract(self, image: Image.Image, target_text: str) -> List[Tuple[int, int]]:
        if pytesseract is None:
            raise ConfigurationError("pytesseract is not installed. Please install it with 'pip install pytesseract'")
        
        tesseract_config = self.config.get("tesseract_config", "--psm 11 --oem 3")
        lang = self.config.get("tesseract_lang", "chi_sim+eng")
        
        try:
            data = pytesseract.image_to_data(image, lang=lang, config=tesseract_config, output_type=pytesseract.Output.DICT)
            
            positions = []
            target_chars = list(target_text)
            found_chars = []
            
            n_boxes = len(data['text'])
            for i in range(n_boxes):
                if int(data['conf'][i]) > self.config.get("confidence_threshold", 60):
                    text = data['text'][i].strip()
                    if text:
                        for char in text:
                            if char in target_chars and char not in found_chars:
                                x = data['left'][i]
                                y = data['top'][i]
                                w = data['width'][i]
                                h = data['height'][i]
                                center_x = x + w // 2
                                center_y = y + h // 2
                                positions.append((center_x, center_y))
                                found_chars.append(char)
                                if len(found_chars) == len(target_chars):
                                    break
                        if len(found_chars) == len(target_chars):
                            break
            
            if len(positions) < len(target_chars):
                self.logger.warning(f"Only found {len(positions)} of {len(target_chars)} target characters")
            
            return positions
        
        except Exception as e:
            raise CaptchaRecognitionError(f"Tesseract OCR failed: {str(e)}")
    
    def _solve_with_api(self, image: Image.Image, target_text: str) -> List[Tuple[int, int]]:
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
        data = {"target_text": target_text}
        
        try:
            response = requests.post(api_url, files=files, data=data, headers=headers, timeout=api_timeout)
            response.raise_for_status()
            
            response_data = response.json()
            positions_field = self.config.get("api_positions_field", "positions")
            positions = response_data.get(positions_field, [])
            
            if not positions:
                raise CaptchaRecognitionError("API returned empty positions")
            
            return [(int(p[0]), int(p[1])) for p in positions]
        
        except requests.exceptions.RequestException as e:
            raise CaptchaRecognitionError(f"API request failed: {str(e)}")
        except ValueError as e:
            raise CaptchaRecognitionError(f"Failed to parse API response: {str(e)}")
    
    def _solve_with_template(self, image: Image.Image, target_text: str, template_images: List[Image.Image]) -> List[Tuple[int, int]]:
        if not template_images:
            raise ConfigurationError("template_images must be provided for template solver type")
        
        positions = []
        image_np = np.array(image)
        
        for template_img in template_images:
            template_np = np.array(template_img)
            result = self._template_match(image_np, template_np)
            
            if result:
                positions.append(result)
        
        return positions
    
    def _template_match(self, image_np: np.ndarray, template_np: np.ndarray) -> Optional[Tuple[int, int]]:
        try:
            import cv2
            result = cv2.matchTemplate(image_np, template_np, cv2.TM_CCOEFF_NORMED)
            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
            
            threshold = self.config.get("template_threshold", 0.8)
            if max_val >= threshold:
                h, w = template_np.shape[:2]
                center_x = max_loc[0] + w // 2
                center_y = max_loc[1] + h // 2
                return (center_x, center_y)
            
            return None
        
        except ImportError:
            raise ConfigurationError("opencv-python is not installed. Please install it with 'pip install opencv-python'")
    
    def execute_click(self, browser, positions: List[Tuple[int, int]], captcha_element=None, offset_x: int = 0, offset_y: int = 0) -> None:
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
    
    def validate_input(self, image_path: Optional[str] = None, image_data: Optional[bytes] = None, 
                       target_text: Optional[str] = None, **kwargs) -> None:
        if not image_path and not image_data:
            self._raise_processing_error("Either image_path or image_data must be provided")
        if not target_text:
            self._raise_processing_error("target_text must be provided")
