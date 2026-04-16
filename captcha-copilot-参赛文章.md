# 【Code with SOLO】用 TRAE SOLO 开发 captcha-copilot 技能，让 AI 自动化流程不再被验证码卡住

## 摘要
使用 TRAE SOLO 开发了 captcha-copilot 技能，定位为"AI Copilot for CAPTCHA"，当自动化被验证码卡住时，自动识别并处理，让工作流继续。支持 11 种常见验证码类型，实现 AI 遇到验证码时自动处理，大幅提升自动化流程的成功率，解决了 AI 在合法自动化过程中的验证码阻碍问题。

**项目地址**：https://github.com/280832849/captcha-copilot

## 背景
作为一名产品经理，我经常需要设计和优化自动化流程，以提高团队的工作效率。在实际工作中，验证码是一个常见的技术障碍，传统的验证码处理方案要么需要人工干预，要么识别率低，严重影响了自动化流程的效率和稳定性。我希望开发一个能让 AI 自动处理验证码的解决方案，实现真正的端到端自动化，为产品设计提供更好的技术支持。

## 实践过程

### 1. 任务拆解
- 分析验证码在自动化流程中的阻碍场景
- 设计用户友好的技能架构和触发机制
- 规划支持的验证码类型和处理方案
- 优化自然语言交互方式，确保 AI 能轻松调用
- 确保项目定位符合平台规范和伦理要求

### 2. SOLO 能力应用
- **需求分析**：利用 SOLO 分析自动化流程中验证码的痛点
- **方案设计**：设计符合产品逻辑的验证码处理流程
- **技术咨询**：获取验证码处理的最佳实践和技术方案
- **文档生成**：创建用户友好的技能文档和使用指南

### 3. 关键实现步骤
1. **产品架构设计**：
   - 设计标准的 TRAE Skill 结构
   - 配置智能自动触发机制（trigger.json）
   - 编写详细的技能文档（SKILL.md）

2. **用户场景规划**：
   - 识别 11 种常见验证码类型的处理场景
   - 设计符合用户行为的处理流程
   - 集成第三方服务以提升处理效果

3. **交互体验优化**：
   - 设置智能关键词和模式匹配
   - 配置合适的触发阈值，确保准确触发
   - 优化自然语言调用示例，适合 AI 理解和使用

4. **合规性设计**：
   - 采用"captcha-copilot"作为项目名称
   - 定位为"AI Copilot for CAPTCHA"，强调辅助自动化而非破解
   - 明确合法使用场景，符合平台规范和伦理要求

### 4. 遇到的挑战与解决方案
- **挑战**：验证码类型多样，用户场景复杂
  **解决方案**：采用模块化设计，为每种验证码类型提供专门的处理逻辑，确保覆盖各种用户场景

- **挑战**：AI 调用的自然语言交互体验
  **解决方案**：优化技能文档中的调用示例，使用简洁明了的指令格式，确保 AI 能轻松理解和调用

- **挑战**：平台规范和伦理合规性
  **解决方案**：调整项目定位和描述，避免使用敏感词汇，强调合法使用场景，确保符合平台规范和伦理要求

## 成果展示

### 项目访问
**GitHub 仓库**：https://github.com/280832849/captcha-copilot

您可以直接访问上述地址，克隆或下载项目进行体验。

### 技能结构
- **captcha-copilot/**
  - SKILL.md - 技能主文档
  - trigger.json - 自动触发配置
  - README.md - 安装和使用指南

### 验证码处理库
- **captcha_solver/**
  - 包含 11 种验证码类型的处理模块
  - 支持各种验证码的识别和处理

### 核心功能
- ✅ 支持 11 种常见验证码类型
- ✅ 自动触发机制，AI 遇到验证码时自动调用
- ✅ 多种调用方式，支持自然语言指令
- ✅ 完整的配置和使用文档
- ✅ 支持第三方服务集成
- ✅ 符合平台规范的项目定位

### 合法使用场景
1. **数据采集**：在合法的数据采集过程中遇到的验证码
2. **自动化测试**：在自动化测试流程中需要处理的验证码
3. **系统集成**：在系统集成过程中遇到的验证码验证
4. **个人自动化**：个人用户在合法使用网站服务时遇到的验证码

## 使用指南

### 1. 安装步骤

#### 步骤 1：下载项目
![下载项目截图](images/01-download-project.png)

访问 GitHub 仓库：https://github.com/280832849/captcha-copilot

您可以通过以下方式获取项目：

**方式一：Git 克隆**
```bash
git clone https://github.com/280832849/captcha-copilot.git
```

**方式二：直接下载**
1. 点击仓库页面的 "Code" 按钮
2. 选择 "Download ZIP"
3. 解压下载的文件

#### 步骤 2：安装到 TRAE Skill
![安装到 TRAE Skill](images/02-copy-to-skills.png)

1. 找到 TRAE skills 目录位置：
   - macOS: `~/Library/Trae/skills/`
   - Windows: `%APPDATA%\Trae\skills\`
   - Linux: `~/.trae/skills/`

2. 将 `captcha-copilot` 文件夹复制到上述目录

3. 重启 TRAE 应用

#### 步骤 3：安装依赖
![安装依赖](images/03-install-dependencies.png)

在终端中执行：
```bash
# 安装基础依赖
pip install selenium requests opencv-python numpy pillow

# 安装完整依赖（可选）
pip install baidu-aip pytesseract playwright undetected-chromedriver
```

### 2. 使用方法

#### 自动调用
![自动调用](images/04-auto-invoke.png)

当您在使用 TRAE AI 时，如果遇到验证码相关问题，captcha-copilot 会自动触发，无需手动操作。

#### 手动调用
您也可以通过以下自然语言指令手动调用：

![手动调用示例](images/05-manual-invoke.png)

- "帮我处理这个图片验证码"
- "识别这个滑动验证码"
- "处理这个数学运算验证码"
- "生成验证码处理代码"

### 3. 配置说明
![配置说明](images/06-env-config.png)

如需使用高级功能（如 OCR 识别），可以配置 API 密钥：

1. 在项目根目录创建 `.env` 文件

2. 填写以下配置：
```env
# 百度OCR
BAIDU_APP_ID=your_app_id
BAIDU_API_KEY=your_api_key
BAIDU_SECRET_KEY=your_secret_key

# 验证码处理服务
EZCAPTCHA_API_KEY=your_key
```

### 4. 代码示例

#### 示例 1：处理图形验证码
![处理图形验证码](images/07-image-captcha.png)

```python
from captcha_solver import solve_captcha

# 处理图形验证码
result = solve_captcha('image', image_path='captcha.png')
print(f"识别结果: {result}")
```

#### 示例 2：处理滑动验证码
![处理滑动验证码](images/08-slider-captcha.png)

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

## 效果与总结

### 效率提升
- 传统验证码处理：需要人工干预或识别率低
- 现在：AI 自动处理，识别率高，无人工干预

### 产品价值
- **自动化流程优化**：实现真正的端到端自动化，无需人工介入，提高工作效率
- **用户体验提升**：AI 助手在遇到验证码时能自主解决，提供更流畅的服务体验
- **团队协作增强**：为技术团队提供标准化的验证码处理方案，减少重复开发
- **合规性保障**：符合平台规范和伦理要求，确保合法使用

### 产品创新
- **用户场景驱动**：基于实际用户场景设计，确保解决方案的实用性
- **智能触发机制**：自动识别验证码场景，提供无缝的用户体验
- **统一处理方案**：为多种验证码类型提供标准化的处理流程
- **自然语言交互**：优化 AI 调用体验，确保指令清晰易懂
- **合规性设计**：符合平台规范和伦理要求的产品定位

### 可扩展性
- **即插即用**：技能可直接安装使用，无需复杂配置
- **模块化设计**：可根据具体场景定制处理逻辑
- **跨平台兼容**：可集成到各种 AI 系统和自动化流程中

通过使用 TRAE SOLO，我不仅快速设计并实现了这个验证码处理技能，还学习了如何从产品经理的角度构建一个符合平台规范的 AI 技能。这个技能的成功开发，展示了如何通过 AI 工具化的方式解决实际工作中的技术难题，为团队的自动化流程提供了有力支持，真正实现了"AI 无限职场"的理念。作为产品经理，我深刻体会到 AI 工具在优化工作流程、提升团队效率方面的巨大潜力。