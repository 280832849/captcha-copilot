from typing import Any, Optional
from ..base import BaseCaptchaSolver


class TextCaptchaSolver(BaseCaptchaSolver):
    CAPTCHA_TYPE: str = "text"
    
    def __init__(self, config: Optional[dict] = None):
        super().__init__(config)
        self.language = self.config.get("language", "zh")
        self.ocr_engine = self.config.get("ocr_engine", "tesseract")
        self.max_length = self.config.get("max_length", 6)
        self.allowed_chars = self.config.get("allowed_chars", None)
        self.case_sensitive = self.config.get("case_sensitive", False)
    
    def solve(self, image_path: Optional[str] = None, question: Optional[str] = None, **kwargs) -> str:
        self.validate_input(image_path=image_path, question=question)
        self.logger.info(f"Solving text captcha: {image_path}, question: {question}")
        self.logger.info(f"Config - language: {self.language}, ocr_engine: {self.ocr_engine}")
        
        result = ""
        
        self.logger.info(f"Text captcha solved: {result}")
        return result
    
    def validate_input(self, image_path: Optional[str] = None, question: Optional[str] = None, **kwargs) -> None:
        if not image_path and not question:
            self._raise_processing_error("Either image_path or question must be provided")
    
    def _preprocess_image_for_ocr(self, image_path: str):
        self.logger.debug(f"Preprocessing image for OCR: {image_path}")
        pass
    
    def _extract_text(self, image) -> str:
        self.logger.debug("Extracting text from image")
        return ""
    
    def _filter_result(self, text: str) -> str:
        self.logger.debug(f"Filtering result: {text}")
        return text
