from typing import Any, Optional, Union
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


class ImageCaptchaSolver(BaseCaptchaSolver):
    CAPTCHA_TYPE: str = "image"
    
    def __init__(self, config: Optional[dict] = None):
        super().__init__(config)
        self._validate_config()
        self._initialize_ocr_engine()
    
    def _validate_config(self) -> None:
        solver_type = self.config.get("solver_type", "tesseract")
        if solver_type not in ["tesseract", "api"]:
            raise ConfigurationError(f"Unsupported solver type: {solver_type}. Use 'tesseract' or 'api'.")
        
        if solver_type == "tesseract" and pytesseract is None:
            self.logger.warning("pytesseract not installed. Tesseract OCR will not be available.")
        
        if solver_type == "api":
            api_url = self.config.get("api_url")
            if not api_url:
                raise ConfigurationError("api_url must be provided for API solver type")
    
    def _initialize_ocr_engine(self) -> None:
        if pytesseract is not None:
            tesseract_path = self.config.get("tesseract_path")
            if tesseract_path:
                pytesseract.pytesseract.tesseract_cmd = tesseract_path
    
    def solve(self, image_path: Optional[str] = None, image_data: Optional[bytes] = None, **kwargs) -> str:
        self.validate_input(image_path=image_path, image_data=image_data)
        self.logger.info(f"Solving image captcha: {image_path or 'image_data provided'}")
        
        try:
            image = self._load_image(image_path, image_data)
            preprocessed_image = self._preprocess_image(image)
            
            solver_type = self.config.get("solver_type", "tesseract")
            if solver_type == "tesseract":
                result = self._solve_with_tesseract(preprocessed_image)
            else:
                result = self._solve_with_api(preprocessed_image)
            
            self.logger.info(f"Image captcha solved: {result}")
            return result
        
        except Exception as e:
            self.logger.error(f"Failed to solve image captcha: {str(e)}")
            raise CaptchaRecognitionError(f"Failed to solve image captcha: {str(e)}")
    
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
    
    def _solve_with_tesseract(self, image: Image.Image) -> str:
        if pytesseract is None:
            raise ConfigurationError("pytesseract is not installed. Please install it with 'pip install pytesseract'")
        
        tesseract_config = self.config.get("tesseract_config", "--psm 8 --oem 3")
        lang = self.config.get("tesseract_lang", "eng")
        
        try:
            result = pytesseract.image_to_string(image, lang=lang, config=tesseract_config)
            result = result.strip()
            return result
        except Exception as e:
            raise CaptchaRecognitionError(f"Tesseract OCR failed: {str(e)}")
    
    def _solve_with_api(self, image: Image.Image) -> str:
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
        
        try:
            response = requests.post(api_url, files=files, headers=headers, timeout=api_timeout)
            response.raise_for_status()
            
            response_data = response.json()
            result_field = self.config.get("api_result_field", "result")
            result = response_data.get(result_field, "")
            
            if not result:
                raise CaptchaRecognitionError("API returned empty result")
            
            return str(result)
        except requests.exceptions.RequestException as e:
            raise CaptchaRecognitionError(f"API request failed: {str(e)}")
        except ValueError as e:
            raise CaptchaRecognitionError(f"Failed to parse API response: {str(e)}")
    
    def validate_input(self, image_path: Optional[str] = None, image_data: Optional[bytes] = None, **kwargs) -> None:
        if not image_path and not image_data:
            self._raise_processing_error("Either image_path or image_data must be provided")
