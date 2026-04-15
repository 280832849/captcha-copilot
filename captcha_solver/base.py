from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from .logger import get_logger
from .exceptions import CaptchaProcessingError


class BaseCaptchaSolver(ABC):
    CAPTCHA_TYPE: str = "base"
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = get_logger(f"{self.__class__.__module__}.{self.__class__.__name__}")
    
    @abstractmethod
    def solve(self, **kwargs) -> Any:
        pass
    
    def validate_input(self, **kwargs) -> None:
        pass
    
    def _raise_processing_error(self, message: str) -> None:
        self.logger.error(message)
        raise CaptchaProcessingError(message)
