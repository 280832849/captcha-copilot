# 验证码自动处理技能

## 项目介绍

验证码自动处理技能是一个功能强大的验证码识别与处理工具库，支持12种常见的验证码类型。该项目包含完整的 Python 后端求解框架和 React 前端展示页面，为开发者提供一站式的验证码自动处理解决方案。

### 项目特点

- 🎯 支持 12 种主流验证码类型
- 🤖 基于 OCR 和计算机视觉技术
- 🌐 提供可视化前端界面进行测试和演示
- 🔌 模块化设计，易于扩展和集成
- 📚 完整的 API 文档和使用示例

## 快速开始指南

### 环境要求

- Python 3.8 或更高版本
- Node.js 16 或更高版本
- macOS 10.14 或更高版本（推荐）

### 快速安装

1. **克隆或下载项目**
```bash
cd /Users/wang/Documents/各种验证码skills
```

2. **安装 Python 依赖**
详细安装说明请参考 [INSTALL.md](./INSTALL.md)
```bash
pip install -r requirements-full.txt
```

3. **启动前端开发服务器**
```bash
npm install
npm run dev
```

## 支持的 12 种验证码类型列表

| 序号 | 验证码类型 | 类型标识 | 难度 |
|------|-----------|---------|------|
| 1 | 图像验证码 | image | 简单 |
| 2 | 滑动验证码 | slider | 中等 |
| 3 | 点选验证码 | click | 中等 |
| 4 | 文字顺序验证码 | word_order | 中等 |
| 5 | 空间验证码 | spatial | 困难 |
| 6 | 旋转验证码 | rotate | 困难 |
| 7 | 滑动还原验证码 | slide_restore | 困难 |
| 8 | 行为验证码 | behavior | 困难 |
| 9 | 文本验证码 | text | 简单 |
| 10 | 音频验证码 | audio | 中等 |
| 11 | 短信验证码 | sms | 简单 |
| 12 | 数学验证码 | math | 简单 |

## 每种验证码类型的简要说明

### 1. 图像验证码 (image)
传统的字符验证码，通过 OCR 技术识别图片中的文字内容。支持本地 Tesseract OCR 和远程 API 两种识别方式。

### 2. 滑动验证码 (slider)
常见的拼图滑动验证码，通过计算机视觉技术检测缺口位置，计算滑动距离，并可生成模拟人类操作的滑动轨迹。

### 3. 点选验证码 (click)
要求按顺序点击图片中特定文字或物体的验证码，需要识别目标并定位坐标。

### 4. 文字顺序验证码 (word_order)
将打乱顺序的文字或成语按正确顺序排列的验证码类型。

### 5. 空间验证码 (spatial)
基于空间感知的验证码，通常要求识别物体的空间位置关系或进行3D空间判断。

### 6. 旋转验证码 (rotate)
需要将图片旋转到正确角度的验证码，检测图片的旋转角度并进行校正。

### 7. 滑动还原验证码 (slide_restore)
将被分割打乱的图片通过滑动还原成原图的验证码类型。

### 8. 行为验证码 (behavior)
基于用户行为分析的验证码，通过模拟人类操作行为来通过验证。

### 9. 文本验证码 (text)
直接显示文本问题的验证码，需要理解问题并给出正确答案。

### 10. 音频验证码 (audio)
通过语音播放验证码内容，需要进行语音识别来获取验证码信息。

### 11. 短信验证码 (sms)
通过手机短信接收的验证码，用于处理短信验证码的接收和提取。

### 12. 数学验证码 (math)
包含数学计算题的验证码，需要识别题目并计算出正确答案。

## 安装说明

详细的安装和配置说明请参考 [INSTALL.md](./INSTALL.md) 文件。

## 基本使用示例

### Python 后端使用示例

```python
from captcha_solver import CaptchaSolver

# 初始化求解器
solver = CaptchaSolver()

# 获取支持的验证码类型
print("支持的验证码类型:", solver.get_supported_types())

# 示例1: 解决图像验证码
try:
    result = solver.solve_captcha(
        "image",
        image_path="path/to/captcha.png",
        config={
            "solver_type": "tesseract",
            "tesseract_config": "--psm 8 --oem 3"
        }
    )
    print(f"图像验证码识别结果: {result}")
except Exception as e:
    print(f"识别失败: {e}")

# 示例2: 解决滑动验证码
try:
    distance = solver.solve_captcha(
        "slider",
        bg_image_path="path/to/background.png",
        slider_image_path="path/to/slider.png"
    )
    print(f"滑动距离: {distance}")
except Exception as e:
    print(f"求解失败: {e}")
```

### 快捷函数使用

```python
from captcha_solver import solve_captcha

# 直接调用快捷函数
result = solve_captcha(
    "image",
    image_path="captcha.png",
    config={"solver_type": "tesseract"}
)
```

## 项目结构说明

```
各种验证码skills/
├── captcha_solver/              # Python 验证码求解核心模块
│   ├── __init__.py
│   ├── base.py                  # 基础求解器类
│   ├── solver.py                # 主求解器入口
│   ├── exceptions.py            # 自定义异常
│   ├── logger.py                # 日志模块
│   └── solvers/                 # 各种验证码求解器实现
│       ├── image_captcha.py     # 图像验证码
│       ├── slider_captcha.py    # 滑动验证码
│       ├── click_captcha.py     # 点选验证码
│       ├── word_order_captcha.py
│       ├── spatial_captcha.py
│       ├── rotate_captcha.py
│       ├── slide_restore_captcha.py
│       ├── behavior_captcha.py
│       ├── text_captcha.py
│       ├── audio_captcha.py
│       ├── sms_captcha.py
│       └── math_captcha.py
├── src/                         # React 前端源代码
│   ├── components/              # React 组件
│   │   ├── captcha/             # 验证码相关组件
│   │   └── layout/              # 布局组件
│   ├── pages/                   # 页面组件
│   ├── hooks/                   # 自定义 Hooks
│   ├── lib/                     # 工具库
│   ├── App.tsx                  # 主应用组件
│   └── main.tsx                 # 应用入口
├── public/                      # 静态资源
├── 验证码自动处理/              # 技能相关文档
│   ├── SKILL.md
│   └── test_captcha_solver.py
├── .trae/                       # 项目文档
│   ├── documents/
│   │   ├── 产品需求文档.md
│   │   └── 技术架构文档.md
│   └── specs/
├── requirements.txt             # Python 基础依赖
├── requirements-full.txt        # Python 完整依赖
├── requirements-ocr.txt         # OCR 相关依赖
├── requirements-browser.txt     # 浏览器自动化依赖
├── INSTALL.md                   # 详细安装说明
├── package.json                 # Node.js 依赖配置
├── vite.config.ts               # Vite 配置
├── tailwind.config.js           # Tailwind CSS 配置
├── tsconfig.json                # TypeScript 配置
└── README.md                    # 项目说明（本文件）
```

## 常见问题解答

### Q1: Tesseract OCR 识别准确率不高怎么办？

A: 可以尝试以下方法提高识别率：
1. 调整图像预处理参数（灰度化、去噪、对比度等）
2. 根据验证码特点调整 Tesseract 的配置参数
3. 使用专门训练的 Tesseract 模型
4. 考虑使用第三方 OCR API 服务

### Q2: 滑动验证码检测到的位置不准确？

A: 可以尝试调整以下参数：
- 提高匹配阈值 `threshold`
- 调整高斯模糊核大小 `gaussian_kernel`
- 修改 Canny 边缘检测参数 `canny_low` 和 `canny_high`

### Q3: 如何添加新的验证码类型支持？

A: 继承 `BaseCaptchaSolver` 类，实现 `solve` 方法，并设置 `CAPTCHA_TYPE` 类属性。然后在 `captcha_solver/solvers/__init__.py` 和 `captcha_solver/solver.py` 中注册新的求解器。

### Q4: 前端页面如何启动？

A: 在项目根目录执行：
```bash
npm install
npm run dev
```
然后在浏览器中打开显示的本地地址。

### Q5: 支持 Windows 或 Linux 系统吗？

A: 核心 Python 库支持跨平台，但安装步骤可能略有不同。前端界面完全跨平台。详细安装说明请参考 [INSTALL.md](./INSTALL.md)。

## 许可证和免责声明

### 许可证

本项目仅供学习和研究使用。

### 免责声明

**重要提醒：请合法使用本工具**

1. 本项目仅用于学习、研究和安全测试目的
2. 请勿将本工具用于任何非法用途
3. 使用本工具时，请遵守相关法律法规和网站服务条款
4. 仅在您拥有合法权限的系统或网站上使用本工具
5. 开发者不对任何滥用本工具的行为负责
6. 使用本工具所产生的一切后果由使用者自行承担

### 合法使用建议

- ✅ 用于学习验证码识别技术
- ✅ 用于测试自己网站的验证码安全性
- ✅ 用于自动化测试（需获得网站授权）
- ❌ 用于恶意攻击或破坏
- ❌ 用于非法获取他人账号
- ❌ 用于批量注册或刷单

---

**请合理、合法地使用本项目，共同维护良好的网络环境。**
