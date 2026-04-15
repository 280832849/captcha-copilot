from .image_captcha import ImageCaptchaSolver
from .slider_captcha import SliderCaptchaSolver
from .click_captcha import ClickCaptchaSolver
from .word_order_captcha import WordOrderCaptchaSolver
from .spatial_captcha import SpatialCaptchaSolver
from .rotate_captcha import RotateCaptchaSolver
from .slide_restore_captcha import SlideRestoreCaptchaSolver
from .behavior_captcha import BehaviorCaptchaSolver
from .text_captcha import TextCaptchaSolver
from .audio_captcha import AudioCaptchaSolver
from .math_captcha import MathCaptchaSolver

__all__ = [
    'ImageCaptchaSolver',
    'SliderCaptchaSolver',
    'ClickCaptchaSolver',
    'WordOrderCaptchaSolver',
    'SpatialCaptchaSolver',
    'RotateCaptchaSolver',
    'SlideRestoreCaptchaSolver',
    'BehaviorCaptchaSolver',
    'TextCaptchaSolver',
    'AudioCaptchaSolver',
    'MathCaptchaSolver',
]
