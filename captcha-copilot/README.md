# captcha-copilot Skill

## 功能概述

AI Copilot for CAPTCHA — 当自动化被验证码卡住时，自动识别并处理，让工作流继续。这是一个专为 AI 设计的验证码辅助处理 Skill，当 AI 在合法自动化流程中遇到验证码阻碍时，会自动调用此技能来解决问题，实现丝滑的自动化体验。

### 支持的验证码类型

- ✅ 传统图形验证码
- ✅ 滑动验证码
- ✅ 点选式验证码
- ✅ 语序点选验证码
- ✅ 空间推理验证码
- ✅ 旋转验证码
- ✅ 滑动还原验证码
- ✅ 行为验证码
- ✅ 图文识别验证码
- ✅ 语音验证码
- ✅ 数学运算验证码

## 安装方法

### 方法 1: 直接安装

1. 下载本技能的完整文件夹 `captcha-copilot`
2. 将文件夹复制到 Trae 的 skills 目录中
   - macOS: `~/Library/Trae/skills/`
   - Windows: `%APPDATA%\Trae\skills\`
   - Linux: `~/.trae/skills/`
3. 重启 Trae 应用

### 方法 2: 通过 Git 克隆

```bash
git clone https://github.com/yourusername/captcha-copilot.git ~/Library/Trae/skills/captcha-copilot
```

## 自动触发配置

本技能已配置为自动触发模式，当 AI 遇到以下情况时会自动调用：

- 检测到"遇到验证码"、"验证码卡住"等关键词
- 识别到验证码相关的描述
- 检测到具体的验证码类型（如"滑动验证码"、"图形验证码"等）

触发阈值设置为 0.7，确保在相关场景下能够准确触发。

## 调用方式

### 自动调用

当 AI 遇到验证码问题时，会自动检测并调用此技能，无需用户手动触发。

### 手动调用

您也可以通过以下自然语言指令手动调用：

- "帮我处理这个图片验证码"
- "识别这个滑动验证码"
- "解决这个点选式验证码"
- "处理这个数学运算验证码"
- "生成验证码处理代码"

## 配置要求

### 必需依赖

```bash
pip install selenium requests opencv-python numpy pillow
```

### 可选依赖（增强功能）

```bash
pip install baidu-aip pytesseract playwright undetected-chromedriver
```

### API 密钥配置

对于高级功能（如 OCR 识别、语音识别），需要配置相应的 API 密钥：

1. 创建 `.env` 文件
2. 填写以下配置：

```env
# 百度OCR
BAIDU_APP_ID=your_app_id
BAIDU_API_KEY=your_api_key
BAIDU_SECRET_KEY=your_secret_key

# 验证码处理服务
EZCAPTCHA_API_KEY=your_key
```

## 使用场景

本技能设计用于以下合法自动化场景：

1. **数据采集**：在合法的数据采集过程中遇到的验证码
2. **自动化测试**：在自动化测试流程中需要处理的验证码
3. **系统集成**：在系统集成过程中遇到的验证码验证
4. **个人自动化**：个人用户在合法使用网站服务时遇到的验证码

## 使用示例

### 示例 1: 处理图形验证码

```python
from captcha_solver import solve_captcha

# 处理图形验证码
result = solve_captcha('image', image_path='captcha.png')
print(f"识别结果: {result}")
```

### 示例 2: 处理滑动验证码

```python
from captcha_solver import CaptchaSolver
from selenium import webdriver

driver = webdriver.Chrome()
driver.get('https://example.com/login')

solver = CaptchaSolver()
# 处理滑动验证码
solver.solve_captcha('slider', 
                   driver=driver,
                   slider_selector='.slider',
                   bg_selector='.bg')
```

### 示例 3: 完整的自动化流程

```python
from captcha_solver import CaptchaSolver
from selenium import webdriver

driver = webdriver.Chrome()
driver.get('https://example.com/login')

solver = CaptchaSolver()

# 填写用户名密码
driver.find_element('id', 'username').send_keys('user123')
driver.find_element('id', 'password').send_keys('pass123')

# 处理验证码
try:
    # 尝试识别验证码类型并处理
    code = solver.solve_captcha('image', 
                             driver=driver,
                             image_selector='#captcha-img')
    driver.find_element('id', 'captcha-input').send_keys(code)
except Exception as e:
    print(f"验证码处理失败: {e}")

# 提交表单
driver.find_element('id', 'login-button').click()
```

## 技术原理

1. **验证码类型识别**：通过分析页面结构、图片特征、提示文字等识别验证码类型
2. **解决方案选择**：根据验证码类型选择最合适的处理方法
3. **处理执行**：执行相应的处理逻辑（OCR识别、滑块轨迹生成、点击坐标计算等）
4. **结果反馈**：返回处理结果或执行相应操作

## 最佳实践

1. **模拟人类行为**：添加适当的延迟和随机操作，避免被识别为自动化程序
2. **错误处理**：实现重试机制，处理识别失败的情况
3. **服务降级**：当第三方服务不可用时，自动切换到备用方案
4. **定期更新**：随着验证码技术的发展，定期更新处理方法

## 注意事项

1. **合法性**：确保使用本技能的行为符合法律法规和网站服务条款
2. **道德性**：不要将本技能用于恶意攻击或滥用网站资源
3. **性能**：根据实际需求选择合适的处理方案，平衡速度和准确性
4. **成本**：使用第三方服务时，注意API调用成本

## 故障排除

### 常见问题

1. **验证码识别失败**
   - 检查图片质量，确保清晰可见
   - 尝试不同的OCR引擎或验证码处理服务
   - 调整图像处理参数

2. **被网站识别为自动化程序**
   - 增加操作间隔，模拟人类行为
   - 使用代理IP
   - 更换浏览器指纹
   - 使用undetected-chromedriver

3. **依赖安装失败**
   - 确保Python版本 ≥ 3.7
   - 使用管理员权限安装
   - 检查网络连接

## 版本更新

### v1.0.0
- 初始版本
- 支持 11 种验证码类型
- 自动触发功能
- 完整的 Python 处理库

## 联系方式

如有问题或建议，请通过以下方式联系：

- Email: support@trae.ai
- GitHub: https://github.com/trae-ai/captcha-copilot

---

**注**：本技能仅用于合法自动化场景，请勿用于任何恶意行为。