#!/usr/bin/env python3
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from captcha_solver import (
    CaptchaSolver,
    solve_captcha,
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
    SMSCaptchaSolver,
    MathCaptchaSolver,
    UnsupportedCaptchaTypeError,
)


def test_imports():
    print("测试导入成功！")


def test_captcha_solver_class():
    solver = CaptchaSolver()
    print(f"\nCaptchaSolver 类实例化成功！")
    print(f"支持的验证码类型: {solver.get_supported_types()}")


def test_individual_solvers():
    print("\n测试独立 solver 类:")
    
    image_solver = ImageCaptchaSolver()
    print(f"  ImageCaptchaSolver 实例化成功，类型: {image_solver.CAPTCHA_TYPE}")
    
    slider_solver = SliderCaptchaSolver()
    print(f"  SliderCaptchaSolver 实例化成功，类型: {slider_solver.CAPTCHA_TYPE}")
    
    click_solver = ClickCaptchaSolver()
    print(f"  ClickCaptchaSolver 实例化成功，类型: {click_solver.CAPTCHA_TYPE}")
    
    word_order_solver = WordOrderCaptchaSolver()
    print(f"  WordOrderCaptchaSolver 实例化成功，类型: {word_order_solver.CAPTCHA_TYPE}")
    
    spatial_solver = SpatialCaptchaSolver()
    print(f"  SpatialCaptchaSolver 实例化成功，类型: {spatial_solver.CAPTCHA_TYPE}")
    
    rotate_solver = RotateCaptchaSolver()
    print(f"  RotateCaptchaSolver 实例化成功，类型: {rotate_solver.CAPTCHA_TYPE}")
    
    slide_restore_solver = SlideRestoreCaptchaSolver()
    print(f"  SlideRestoreCaptchaSolver 实例化成功，类型: {slide_restore_solver.CAPTCHA_TYPE}")
    
    behavior_solver = BehaviorCaptchaSolver()
    print(f"  BehaviorCaptchaSolver 实例化成功，类型: {behavior_solver.CAPTCHA_TYPE}")
    
    text_solver = TextCaptchaSolver()
    print(f"  TextCaptchaSolver 实例化成功，类型: {text_solver.CAPTCHA_TYPE}")
    
    audio_solver = AudioCaptchaSolver()
    print(f"  AudioCaptchaSolver 实例化成功，类型: {audio_solver.CAPTCHA_TYPE}")
    
    sms_solver = SMSCaptchaSolver()
    print(f"  SMSCaptchaSolver 实例化成功，类型: {sms_solver.CAPTCHA_TYPE}")
    
    math_solver = MathCaptchaSolver()
    print(f"  MathCaptchaSolver 实例化成功，类型: {math_solver.CAPTCHA_TYPE}")


def test_solve_captcha_function():
    print("\n测试 solve_captcha 函数:")
    try:
        result = solve_captcha("image", image_path="test.png")
        print(f"  调用 solve_captcha 成功，结果: {result}")
    except Exception as e:
        print(f"  调用 solve_captcha 时出错: {e}")


def test_unsupported_type():
    print("\n测试不支持的验证码类型:")
    try:
        solve_captcha("invalid_type")
    except UnsupportedCaptchaTypeError as e:
        print(f"  正确抛出 UnsupportedCaptchaTypeError: {e}")


if __name__ == "__main__":
    print("开始测试 captcha_solver 包...\n")
    
    test_imports()
    test_captcha_solver_class()
    test_individual_solvers()
    test_solve_captcha_function()
    test_unsupported_type()
    
    print("\n✅ 所有测试完成！包结构正常。")
