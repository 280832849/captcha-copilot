from typing import Any, Dict, Optional, Type
from .base import BaseCaptchaSolver
from .exceptions import UnsupportedCaptchaTypeError
from .logger import get_logger
from .solvers import (
    ImageCaptchaSolver,
    SliderCaptchaSolver,
    ClickCaptchaSolver,
    WordOrderCaptchaSolver,
    SpatialCaptchaSolver,
    RotateCaptchaSolver,
    SlideRestoreCaptchaSolver,
    BehaviorCaptchaSolver,
    TextCaptchaSolver,
    AudioCaptchaSolver,
    MathCaptchaSolver,
)


class CaptchaSolver:
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.logger = get_logger(__name__)
        self._solver_map = self._initialize_solvers()
    
    def _initialize_solvers(self) -> Dict[str, Type[BaseCaptchaSolver]]:
        solvers = [
            ImageCaptchaSolver,
            SliderCaptchaSolver,
            ClickCaptchaSolver,
            WordOrderCaptchaSolver,
            SpatialCaptchaSolver,
            RotateCaptchaSolver,
            SlideRestoreCaptchaSolver,
            BehaviorCaptchaSolver,
            TextCaptchaSolver,
            AudioCaptchaSolver,
            MathCaptchaSolver,
        ]
        
        solver_map = {}
        for solver_cls in solvers:
            solver_map[solver_cls.CAPTCHA_TYPE] = solver_cls
        
        return solver_map
    
    def solve_captcha(self, captcha_type: str, **kwargs) -> Any:
        if captcha_type not in self._solver_map:
            self.logger.error(f"Unsupported captcha type: {captcha_type}")
            raise UnsupportedCaptchaTypeError(f"Unsupported captcha type: {captcha_type}")
        
        solver_cls = self._solver_map[captcha_type]
        solver = solver_cls(config=self.config)
        
        self.logger.info(f"Using {solver_cls.__name__} to solve captcha")
        return solver.solve(**kwargs)
    
    def get_supported_types(self) -> list:
        return list(self._solver_map.keys())


def solve_captcha(captcha_type: str, config: Optional[Dict[str, Any]] = None, **kwargs) -> Any:
    solver = CaptchaSolver(config=config)
    return solver.solve_captcha(captcha_type, **kwargs)
