from .base import BaseCaptchaSolver
from .exceptions import (
    CaptchaSolverError,
    UnsupportedCaptchaTypeError,
    CaptchaProcessingError,
    CaptchaRecognitionError,
    ConfigurationError,
)
from .logger import get_logger
from .solver import CaptchaSolver, solve_captcha
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

__version__ = "0.1.0"

__all__ = [
    "BaseCaptchaSolver",
    "CaptchaSolverError",
    "UnsupportedCaptchaTypeError",
    "CaptchaProcessingError",
    "CaptchaRecognitionError",
    "ConfigurationError",
    "get_logger",
    "CaptchaSolver",
    "solve_captcha",
    "ImageCaptchaSolver",
    "SliderCaptchaSolver",
    "ClickCaptchaSolver",
    "WordOrderCaptchaSolver",
    "SpatialCaptchaSolver",
    "RotateCaptchaSolver",
    "SlideRestoreCaptchaSolver",
    "BehaviorCaptchaSolver",
    "TextCaptchaSolver",
    "AudioCaptchaSolver",
    "MathCaptchaSolver",
]
