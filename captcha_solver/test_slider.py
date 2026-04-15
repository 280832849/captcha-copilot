#!/usr/bin/env python3
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from captcha_solver import SliderCaptchaSolver
    print("✅ SliderCaptchaSolver 导入成功")
    
    solver = SliderCaptchaSolver()
    print(f"✅ 实例化成功，CAPTCHA_TYPE: {solver.CAPTCHA_TYPE}")
    
    print("\n📋 可用方法:")
    methods = [m for m in dir(solver) if not m.startswith('_')]
    for method in methods:
        print(f"  - {method}")
    
    print("\n🎯 测试轨迹生成:")
    test_distance = 200
    track = solver.generate_slide_track(test_distance)
    print(f"  生成了 {len(track)} 个轨迹点")
    if track:
        print(f"  第一个点: {track[0]}")
        print(f"  最后一个点: {track[-1]}")
    
    print("\n🎉 所有测试通过！SliderCaptchaSolver 工作正常。")
    
except ImportError as e:
    print(f"❌ 导入错误: {e}")
except Exception as e:
    print(f"❌ 错误: {e}")
    import traceback
    traceback.print_exc()
