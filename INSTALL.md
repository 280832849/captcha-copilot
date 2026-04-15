# 安装说明

本文档详细介绍了如何在 macOS 上安装和配置验证码处理工具所需的依赖。

## 前置要求

- macOS 10.14 或更高版本
- Python 3.8 或更高版本
- Homebrew（包管理器）

## 一、安装 Homebrew（如果尚未安装）

如果您还没有安装 Homebrew，请在终端运行以下命令：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安装完成后，请确保 Homebrew 已添加到 PATH 中：

```bash
echo 'export PATH=/usr/local/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

## 二、安装 Tesseract OCR

Tesseract 是一个开源的 OCR 引擎，用于识别验证码中的文字。

### 使用 Homebrew 安装 Tesseract

```bash
brew install tesseract
```

### 验证 Tesseract 安装

```bash
tesseract --version
```

如果安装成功，您应该能看到类似以下的输出：

```
tesseract 5.3.3
 leptonica 1.82.0
  libgif 5.2.1
  libjpeg 8d (turbo v2.1.4)
  libpng 1.6.39
  libtiff 4.5.0
  zlib 1.2.11
  libwebp 1.3.0
```

### 可选：安装额外的语言包

默认情况下，Tesseract 包含英文支持。如果您需要其他语言的支持，可以安装相应的语言包：

```bash
brew install tesseract-lang
```

## 三、安装 Python 依赖

### 1. （可选）创建虚拟环境

建议在虚拟环境中安装依赖，以避免系统级别的包冲突：

```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. 安装依赖

您可以根据需要选择安装全部依赖或部分依赖：

#### 选项 A：安装全部依赖（推荐）

```bash
pip install -r requirements-full.txt
```

#### 选项 B：仅安装基础依赖

```bash
pip install -r requirements.txt
```

#### 选项 C：安装 OCR 相关依赖

```bash
pip install -r requirements-ocr.txt
```

#### 选项 D：安装浏览器自动化相关依赖

```bash
pip install -r requirements-browser.txt
```

## 四、配置 Playwright 浏览器

如果您安装了 Playwright，需要安装浏览器驱动：

```bash
playwright install
```

这将安装 Chrome、Firefox 和 WebKit 浏览器驱动。

## 五、验证安装

### 1. 验证 Python 依赖

```bash
python3 -c "import dotenv; print('dotenv OK')"
python3 -c "import pytesseract; print('pytesseract OK')"
python3 -c "from PIL import Image; print('Pillow OK')"
python3 -c "import cv2; print('OpenCV OK')"
python3 -c "import numpy; print('NumPy OK')"
python3 -c "from selenium import webdriver; print('Selenium OK')"
python3 -c "from playwright.sync_api import sync_playwright; print('Playwright OK')"
```

### 2. 验证 Tesseract OCR 功能

创建一个简单的测试图片并进行 OCR 识别：

```bash
python3 - <<END
from PIL import Image, ImageDraw, ImageFont
import pytesseract

# 创建一个简单的测试图片
img = Image.new('RGB', (200, 100), color='white')
d = ImageDraw.Draw(img)
d.text((10,10), "Hello World", fill='black')
img.save('test.png')

# 测试 OCR
text = pytesseract.image_to_string(Image.open('test.png'))
print(f"识别结果: {text.strip()}")
END
```

如果一切正常，您应该能看到 "识别结果: Hello World"。

## 六、常见问题

### 问题 1：Tesseract 找不到

如果遇到 `TesseractNotFoundError` 错误，请确保 Tesseract 已正确安装并在 PATH 中。您可以通过以下方式指定 Tesseract 路径：

```python
import pytesseract
pytesseract.pytesseract.tesseract_cmd = '/usr/local/bin/tesseract'
```

### 问题 2：Playwright 浏览器未安装

确保在安装 Playwright 后运行了 `playwright install` 命令。

### 问题 3：OpenCV 导入错误

如果 OpenCV 导入失败，尝试重新安装：

```bash
pip uninstall opencv-python
pip install opencv-python
```

## 七、依赖说明

### 基础依赖
- `logging` - Python 标准库日志模块
- `typing` - Python 类型注解支持
- `dataclasses` - 数据类支持（Python 3.7+）
- `python-dotenv` - 从 .env 文件加载环境变量

### OCR 相关依赖
- `pytesseract` - Tesseract OCR 的 Python 包装器
- `pillow` - Python 图像处理库
- `opencv-python` - OpenCV 计算机视觉库
- `numpy` - 数值计算库

### 浏览器自动化相关依赖
- `selenium` - Web 浏览器自动化工具
- `playwright` - 现代 Web 浏览器自动化框架

## 八、开发环境配置

### 1. 创建 .env 文件

在项目根目录创建 `.env` 文件（可选）：

```bash
cp .env.example .env
```

然后根据您的需求编辑 `.env` 文件。

### 2. 安装开发依赖（可选）

如果您需要参与项目开发，可以安装额外的开发工具：

```bash
pip install pytest black flake8
```

## 九、下一步

安装完成后，您可以：
1. 查看 `README.md` 了解项目的使用方法
2. 运行测试脚本验证功能
3. 开始开发您的验证码处理应用

---

如有问题，请查阅项目文档或提交 Issue。
