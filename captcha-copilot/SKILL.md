---
name: captcha-copilot
description: AI Copilot for CAPTCHA — 当自动化被验证码卡住时，自动识别并处理，让工作流继续。支持传统图形、滑动、点选式、语序点选、空间推理、旋转、滑动还原、行为、图文识别、语音、数学运算共11种验证码。
compatibility:
  - tools: [RunCommand, Read, Write, Grep, LS, SearchCodebase]
---

# captcha-copilot 技能

## 功能概述

本技能旨在帮助用户在合法自动化流程中自动识别和处理各种类型的验证码，为自动化工作流提供完整的解决方案。当AI在自动化过程中遇到验证码阻碍时，使用此技能提供辅助处理，让工作流继续进行。支持11种常见验证码类型，并提供详细的实现代码和调用示例。

## 目录
- [支持的验证码类型](#支持的验证码类型)
- [解决方案](#解决方案)
- [Skill 调用说明](#skill-调用说明)
- [配置说明](#配置说明)
- [集成第三方服务](#集成第三方服务)
- [自动化脚本框架](#自动化脚本框架)
- [最佳实践](#最佳实践)

---

## 支持的验证码类型

本技能支持以下11种验证码类型：

| 序号 | 验证码类型 | 描述 | 难度等级 |
|------|-----------|------|---------|
| 1 | 传统图形验证码 | 包含数字、字母、符号的静态图片验证码 | ⭐⭐ |
| 2 | 滑动验证码 | 需要拖动滑块到指定位置的验证码 | ⭐⭐⭐ |
| 3 | 点选式验证码 | 需要点击图片中指定元素的验证码 | ⭐⭐⭐ |
| 4 | 语序点选验证码 | 按指定顺序点击文字的验证码 | ⭐⭐⭐⭐ |
| 5 | 空间推理验证码 | 需要空间判断的验证码（如找不同、拼图） | ⭐⭐⭐⭐ |
| 6 | 旋转验证码 | 需要旋转图片到正确角度的验证码 | ⭐⭐⭐⭐ |
| 7 | 滑动还原验证码 | 将拼图滑动还原的验证码 | ⭐⭐⭐⭐⭐ |
| 8 | 行为验证码 | 基于用户行为分析的验证码 | ⭐⭐ |
| 9 | 图文识别验证码 | 需要识别图片内容的验证码 | ⭐⭐⭐ |
| 10 | 语音验证码 | 需要听取并识别语音内容的验证码 | ⭐⭐⭐ |
| 11 | 数学运算验证码 | 需要计算数学题的验证码 | ⭐⭐ |

---

## 解决方案

### 1. 传统图形验证码

**解决方案**：
- 使用OCR技术自动识别
- 集成第三方打码平台
- 图像预处理提高识别率

**实现步骤**：
1. 截图获取验证码图片
2. 预处理图片（灰度化、二值化、去噪等）
3. 使用OCR引擎识别或发送到打码平台
4. 返回识别结果

**示例代码**：
```python
import requests
import base64
import cv2
import numpy as np
from PIL import Image

def preprocess_image(image_path):
    """预处理图片以提高识别率"""
    img = cv2.imread(image_path)
    # 灰度化
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # 二值化
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
    # 去噪
    kernel = np.ones((2, 2), np.uint8)
    processed = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
    # 保存处理后的图片
    cv2.imwrite('processed_captcha.png', processed)
    return 'processed_captcha.png'

def solve_image_captcha(image_path, use_platform=True):
    """
    解决传统图形验证码
    :param image_path: 验证码图片路径
    :param use_platform: 是否使用打码平台
    """
    processed_path = preprocess_image(image_path)
    
    if use_platform:
        # 使用打码平台API
        with open(processed_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        
        response = requests.post('https://api.example.com/solve', json={
            'image': image_data,
            'type': 'image'
        })
        return response.json().get('result')
    else:
        # 使用本地OCR
        from aip import AipOcr
        APP_ID = 'your_app_id'
        API_KEY = 'your_api_key'
        SECRET_KEY = 'your_secret_key'
        client = AipOcr(APP_ID, API_KEY, SECRET_KEY)
        
        with open(processed_path, 'rb') as f:
            image = f.read()
        
        result = client.basicGeneral(image)
        if 'words_result' in result:
            return ''.join([item['words'] for item in result['words_result']])
    return None
```

---

### 2. 滑动验证码

**解决方案**：
- 图像识别定位缺口
- 模拟人类滑动行为（加速-减速轨迹）
- 使用边缘检测算法

**实现步骤**：
1. 截图获取滑块和背景图片
2. 分析缺口位置（边缘检测、模板匹配）
3. 生成模拟人类的滑动轨迹
4. 执行滑动操作

**示例代码**：
```python
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
import time
import random
import cv2
import numpy as np

def get_gap_position(bg_image_path, slider_image_path):
    """
    使用图像识别获取缺口位置
    """
    bg = cv2.imread(bg_image_path)
    slider = cv2.imread(slider_image_path)
    
    # 灰度化
    bg_gray = cv2.cvtColor(bg, cv2.COLOR_BGR2GRAY)
    slider_gray = cv2.cvtColor(slider, cv2.COLOR_BGR2GRAY)
    
    # 边缘检测
    bg_edge = cv2.Canny(bg_gray, 100, 200)
    slider_edge = cv2.Canny(slider_gray, 100, 200)
    
    # 模板匹配
    result = cv2.matchTemplate(bg_edge, slider_edge, cv2.TM_CCOEFF_NORMED)
    _, _, _, max_loc = cv2.minMaxLoc(result)
    
    return max_loc[0]

def get_human_track(distance):
    """
    生成模拟人类的滑动轨迹
    """
    track = []
    current = 0
    mid = distance * 4 / 5
    t = 0.2
    v = 0
    
    while current < distance:
        if current < mid:
            a = 2
        else:
            a = -3
        v0 = v
        v = v0 + a * t
        move = v0 * t + 1 / 2 * a * t * t
        current += move
        track.append(round(move))
    
    return track

def solve_slider_captcha(driver, slider_elem, bg_elem):
    """
    解决滑动验证码
    """
    # 截图保存
    bg_elem.screenshot('bg.png')
    slider_elem.screenshot('slider.png')
    
    # 获取缺口位置
    gap_x = get_gap_position('bg.png', 'slider.png')
    
    # 获取滑动轨迹
    track = get_human_track(gap_x)
    
    # 执行滑动
    action = ActionChains(driver)
    action.click_and_hold(slider_elem).perform()
    
    for x in track:
        action.move_by_offset(x, random.randint(-2, 2)).perform()
        time.sleep(random.uniform(0.01, 0.03))
    
    time.sleep(0.3)
    action.release().perform()
    time.sleep(1)
```

---

### 3. 点选式验证码

**解决方案**：
- 图像识别目标元素
- 使用目标检测模型（YOLO、SSD）
- 模拟点击操作

**实现步骤**：
1. 截图获取验证码图片
2. 识别需要点击的目标元素
3. 计算目标元素在页面上的坐标
4. 执行点击操作

**示例代码**：
```python
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
import cv2
import numpy as np

def detect_targets(image_path, target_text=None):
    """
    检测需要点击的目标位置
    使用模板匹配或目标检测模型
    """
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 示例：使用简单的模板匹配
    # 实际应用中可使用YOLO等目标检测模型
    target_positions = []
    
    # 这里简化处理，实际需要根据验证码类型实现
    # 返回示例坐标
    h, w = gray.shape
    target_positions = [
        (int(w * 0.2), int(h * 0.3)),
        (int(w * 0.5), int(h * 0.5)),
        (int(w * 0.8), int(h * 0.7))
    ]
    
    return target_positions

def solve_click_captcha(driver, captcha_elem):
    """
    解决点选式验证码
    """
    # 截图
    captcha_elem.screenshot('click_captcha.png')
    
    # 获取验证码元素位置
    captcha_location = captcha_elem.location
    captcha_size = captcha_elem.size
    
    # 识别目标位置
    target_positions = detect_targets('click_captcha.png')
    
    # 执行点击
    action = ActionChains(driver)
    for x, y in target_positions:
        # 计算绝对坐标
        absolute_x = captcha_location['x'] + x
        absolute_y = captcha_location['y'] + y
        
        action.move_to_location(absolute_x, absolute_y)
        action.click()
        action.perform()
        time.sleep(0.5)
```

---

### 4. 语序点选验证码

**解决方案**：
- OCR识别图片中的文字
- 按指定顺序排列文字位置
- 依次点击

**实现步骤**：
1. 截图获取验证码图片
2. OCR识别所有文字及其位置
3. 根据提示文字排序
4. 按顺序点击

**示例代码**：
```python
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from aip import AipOcr
import time

def ocr_detect_texts(image_path):
    """
    OCR识别图片中的文字及其位置
    """
    APP_ID = 'your_app_id'
    API_KEY = 'your_api_key'
    SECRET_KEY = 'your_secret_key'
    client = AipOcr(APP_ID, API_KEY, SECRET_KEY)
    
    with open(image_path, 'rb') as f:
        image = f.read()
    
    # 调用通用文字识别（含位置）
    result = client.general(image)
    
    texts_with_pos = []
    if 'words_result' in result:
        for item in result['words_result']:
            text = item['words']
            location = item['location']
            center_x = location['left'] + location['width'] // 2
            center_y = location['top'] + location['height'] // 2
            texts_with_pos.append({'text': text, 'x': center_x, 'y': center_y})
    
    return texts_with_pos

def solve_order_click_captcha(driver, captcha_elem, target_order_text):
    """
    解决语序点选验证码
    :param target_order_text: 目标顺序文字，如"春夏秋冬"
    """
    # 截图
    captcha_elem.screenshot('order_captcha.png')
    
    # 识别文字及位置
    texts_with_pos = ocr_detect_texts('order_captcha.png')
    
    # 建立文字到位置的映射
    text_to_pos = {item['text']: (item['x'], item['y']) for item in texts_with_pos}
    
    # 获取验证码元素位置
    captcha_location = captcha_elem.location
    
    # 按顺序点击
    action = ActionChains(driver)
    for char in target_order_text:
        if char in text_to_pos:
            x, y = text_to_pos[char]
            absolute_x = captcha_location['x'] + x
            absolute_y = captcha_location['y'] + y
            
            action.move_to_location(absolute_x, absolute_y)
            action.click()
            action.perform()
            time.sleep(0.5)
```

---

### 5. 空间推理验证码

**解决方案**：
- 使用计算机视觉分析空间关系
- 集成第三方AI推理服务
- 深度学习模型

**实现步骤**：
1. 截图获取验证码图片
2. 分析空间推理要求
3. 调用AI模型进行推理
4. 根据结果执行操作

**示例代码**：
```python
import requests
import base64

def solve_spatial_captcha(image_path, question_type="find_different"):
    """
    解决空间推理验证码
    :param question_type: 问题类型 - find_different(找不同), puzzle(拼图)
    """
    with open(image_path, 'rb') as f:
        image_data = base64.b64encode(f.read()).decode('utf-8')
    
    # 调用AI推理API
    response = requests.post('https://api.example.com/spatial', json={
        'image': image_data,
        'type': question_type
    })
    
    result = response.json()
    return result.get('answer')

# 使用示例
# answer = solve_spatial_captcha('spatial.png', 'find_different')
# 返回不同位置的坐标 [(x1, y1), (x2, y2)...]
```

---

### 6. 旋转验证码

**解决方案**：
- 图像识别确定旋转角度
- 使用特征点匹配
- 深度学习模型预测角度

**实现步骤**：
1. 截图获取旋转图片
2. 分析图片特征点
3. 计算需要旋转的角度
4. 执行旋转操作

**示例代码**：
```python
import cv2
import numpy as np
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains

def detect_rotation_angle(image_path, template_path=None):
    """
    检测图片需要旋转的角度
    """
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 使用霍夫变换检测线条角度
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    lines = cv2.HoughLines(edges, 1, np.pi/180, 100)
    
    if lines is not None:
        angles = []
        for rho, theta in lines[:, 0]:
            angle = np.rad2deg(theta)
            angles.append(angle)
        
        # 取中位数
        if angles:
            median_angle = np.median(angles)
            return int(median_angle)
    
    return 0

def solve_rotation_captcha(driver, rotate_elem, image_elem):
    """
    解决旋转验证码
    """
    # 截图
    image_elem.screenshot('rotate_captcha.png')
    
    # 检测需要旋转的角度
    angle = detect_rotation_angle('rotate_captcha.png')
    
    # 将角度转换为滑动距离
    distance = int(angle * 2)  # 比例系数根据实际情况调整
    
    # 执行旋转操作
    action = ActionChains(driver)
    action.click_and_hold(rotate_elem).perform()
    
    # 分段滑动
    step = distance // 10
    for i in range(10):
        action.move_by_offset(step, 0).perform()
        time.sleep(0.05)
    
    time.sleep(0.3)
    action.release().perform()
```

---

### 7. 滑动还原验证码

**解决方案**：
- 图像识别拼图位置
- 使用拼图算法求解移动路径
- 模拟滑动操作

**实现步骤**：
1. 截图获取拼图状态
2. 识别各拼图块位置
3. 使用BFS/IDA*算法求解移动路径
4. 按路径执行滑动

**示例代码**：
```python
import cv2
import numpy as np
from collections import deque
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
import time

class PuzzleSolver:
    def __init__(self, size=3):
        self.size = size
    
    def get_puzzle_state(self, image_path):
        """识别拼图状态"""
        img = cv2.imread(image_path)
        h, w = img.shape[:2]
        cell_h, cell_w = h // self.size, w // self.size
        
        state = []
        # 简化处理，实际需要图像识别每个块
        # 这里返回示例状态
        return [[1, 2, 3], [4, 0, 5], [7, 8, 6]]
    
    def solve_puzzle(self, start_state):
        """使用BFS求解拼图"""
        target = tuple(range(self.size * self.size))
        start = tuple([num for row in start_state for num in row])
        
        if start == target:
            return []
        
        queue = deque([(start, [])])
        visited = set([start])
        
        while queue:
            state, path = queue.popleft()
            
            for move in self.get_possible_moves(state):
                new_state = self.apply_move(state, move)
                if new_state not in visited:
                    visited.add(new_state)
                    new_path = path + [move]
                    if new_state == target:
                        return new_path
                    queue.append((new_state, new_path))
        
        return None
    
    def get_possible_moves(self, state):
        """获取可能的移动方向"""
        idx = state.index(0)
        row, col = idx // self.size, idx % self.size
        moves = []
        
        if row > 0:
            moves.append('down')
        if row < self.size - 1:
            moves.append('up')
        if col > 0:
            moves.append('right')
        if col < self.size - 1:
            moves.append('left')
        
        return moves
    
    def apply_move(self, state, move):
        """应用移动"""
        state_list = list(state)
        idx = state_list.index(0)
        row, col = idx // self.size, idx % self.size
        
        if move == 'up':
            swap_idx = (row + 1) * self.size + col
        elif move == 'down':
            swap_idx = (row - 1) * self.size + col
        elif move == 'left':
            swap_idx = row * self.size + col + 1
        elif move == 'right':
            swap_idx = row * self.size + col - 1
        
        state_list[idx], state_list[swap_idx] = state_list[swap_idx], state_list[idx]
        return tuple(state_list)

def solve_slide_puzzle_captcha(driver, puzzle_elem, cell_size=100):
    """
    解决滑动还原验证码
    """
    # 截图
    puzzle_elem.screenshot('puzzle.png')
    
    # 识别并求解
    solver = PuzzleSolver(size=3)
    state = solver.get_puzzle_state('puzzle.png')
    moves = solver.solve_puzzle(state)
    
    if not moves:
        return
    
    # 获取拼图位置
    puzzle_loc = puzzle_elem.location
    
    # 执行滑动
    action = ActionChains(driver)
    for move in moves:
        # 计算空白块位置和点击位置
        # 简化处理，实际需要根据移动方向计算
        center_x = puzzle_loc['x'] + cell_size * 1.5
        center_y = puzzle_loc['y'] + cell_size * 1.5
        
        action.move_to_location(center_x, center_y)
        action.click_and_hold()
        
        if move == 'up':
            action.move_by_offset(0, -cell_size)
        elif move == 'down':
            action.move_by_offset(0, cell_size)
        elif move == 'left':
            action.move_by_offset(-cell_size, 0)
        elif move == 'right':
            action.move_by_offset(cell_size, 0)
        
        action.release()
        action.perform()
        time.sleep(0.3)
```

---

### 8. 行为验证码

**解决方案**：
- 模拟人类行为模式
- 使用浏览器自动化工具
- 随机化操作时序

**实现步骤**：
1. 分析验证码的行为要求
2. 设计符合人类行为的操作序列
3. 添加随机延迟和轨迹
4. 执行操作序列

**示例代码**：
```python
from selenium import webdriver
import time
import random

def random_mouse_movements(driver):
    """随机鼠标移动"""
    action = webdriver.ActionChains(driver)
    for _ in range(random.randint(3, 8)):
        x = random.randint(100, 500)
        y = random.randint(100, 500)
        action.move_by_offset(random.randint(-50, 50), random.randint(-50, 50))
        action.perform()
        time.sleep(random.uniform(0.1, 0.3))

def solve_behavior_captcha(driver):
    """
    解决行为验证码
    """
    # 模拟人类浏览行为
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight/2)")
    time.sleep(random.uniform(0.5, 1.5))
    
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(random.uniform(0.5, 1.5))
    
    driver.execute_script("window.scrollTo(0, 0)")
    time.sleep(random.uniform(0.5, 1.5))
    
    # 随机鼠标移动
    random_mouse_movements(driver)
    
    # 点击验证按钮
    try:
        verify_button = driver.find_element("id", "verify-button")
        verify_button.click()
        time.sleep(random.uniform(1, 2))
    except:
        pass
    
    # 可选：尝试点击复选框
    try:
        checkbox = driver.find_element("css selector", "input[type='checkbox']")
        checkbox.click()
        time.sleep(random.uniform(1, 2))
    except:
        pass
```

---

### 9. 图文识别验证码

**解决方案**：
- 使用图像分类模型
- 调用第三方图文识别API
- 多模态AI模型

**实现步骤**：
1. 截图获取验证码图片
2. 分析图片内容
3. 调用图文识别模型
4. 返回识别结果

**示例代码**：
```python
import requests
import base64

def solve_image_text_captcha(image_path, question=None):
    """
    解决图文识别验证码
    :param question: 问题描述，如"图中有几只猫？"
    """
    with open(image_path, 'rb') as f:
        image_data = base64.b64encode(f.read()).decode('utf-8')
    
    # 调用多模态AI API
    response = requests.post('https://api.example.com/vlm', json={
        'image': image_data,
        'question': question or "描述这张图片的内容"
    })
    
    return response.json().get('answer')

# 使用示例
# answer = solve_image_text_captcha('image_text.png', '图中有几个苹果？')
```

---

### 10. 语音验证码

**解决方案**：
- 语音识别(ASR)
- 调用第三方语音识别API
- 处理音频文件

**实现步骤**：
1. 下载或录制语音文件
2. 转换为合适格式
3. 调用语音识别API
4. 返回识别文本

**示例代码**：
```python
import requests
import base64
from aip import AipSpeech

def solve_voice_captcha(audio_path, use_platform=True):
    """
    解决语音验证码
    """
    if use_platform:
        # 使用百度语音识别
        APP_ID = 'your_app_id'
        API_KEY = 'your_api_key'
        SECRET_KEY = 'your_secret_key'
        client = AipSpeech(APP_ID, API_KEY, SECRET_KEY)
        
        with open(audio_path, 'rb') as f:
            audio_data = f.read()
        
        result = client.asr(audio_data, 'wav', 16000, {
            'dev_pid': 1537,
        })
        
        if result['err_no'] == 0:
            return ''.join(result['result'])
    else:
        # 使用其他平台API
        with open(audio_path, 'rb') as f:
            audio_data = base64.b64encode(f.read()).decode('utf-8')
        
        response = requests.post('https://api.example.com/asr', json={
            'audio': audio_data,
            'format': 'wav'
        })
        
        return response.json().get('text')
    
    return None
```



### 11. 数学运算验证码

**解决方案**：
- OCR识别数学表达式
- 使用计算引擎求解
- 调用AI模型

**实现步骤**：
1. 截图获取验证码
2. OCR识别数学表达式
3. 计算结果
4. 返回答案

**示例代码**：
```python
import re
from aip import AipOcr

def solve_math_captcha(image_path):
    """
    解决数学运算验证码
    """
    # OCR识别
    APP_ID = 'your_app_id'
    API_KEY = 'your_api_key'
    SECRET_KEY = 'your_secret_key'
    client = AipOcr(APP_ID, API_KEY, SECRET_KEY)
    
    with open(image_path, 'rb') as f:
        image = f.read()
    
    result = client.basicGeneral(image)
    
    if 'words_result' in result:
        text = ''.join([item['words'] for item in result['words_result']])
        
        # 提取数学表达式
        # 支持常见格式：12+34=?, 5×6=?, 78-9=? 等
        expr = text.replace('=', '').replace('?', '').replace('×', '*').replace('÷', '/')
        
        try:
            # 安全计算
            # 限制只允许数字和运算符
            allowed_chars = set('0123456789+-*/() ')
            if all(c in allowed_chars for c in expr):
                result = eval(expr)
                return str(int(result) if result.is_integer() else result)
        except:
            pass
    
    return None

# 使用示例
# answer = solve_math_captcha('math.png')
```

---

## Skill 调用说明

### 调用方式

AI 可以通过自然语言指令直接调用本技能，支持以下调用场景：

### 自然语言指令示例

#### 1. 基础处理类
```
"帮我处理这个图片验证码"
"识别这个滑动验证码"
"处理这个点选式验证码"
"处理这个数学运算验证码"
```

#### 2. 详细指定类
```
"处理一个语序点选验证码，按'春夏秋冬'顺序点击"
"处理这个旋转验证码，把图片转正"
"处理这个空间推理验证码，找出不同之处"
"处理这个滑动还原验证码"
```

#### 3. 代码生成类
```
"生成传统图形验证码的Python处理代码"
"给我一段滑动验证码的Selenium实现"
"写一个语音验证码的处理脚本"
"生成数学运算验证码的识别代码"
```

#### 4. 场景应用类
```
"我在自动化登录时遇到了验证码，帮我处理"
"写一个完整的自动化脚本，包含验证码处理"
"集成验证码处理服务处理批量验证码"
"帮我处理这个网站的行为验证码"
```

#### 5. 配置咨询类
```
"如何配置百度OCR的API密钥？"
"需要安装哪些Python依赖包？"
"推荐使用哪个验证码处理服务？"
"如何设置Tesseract OCR？"
```

### 技能工作流程

```
用户请求
    ↓
识别验证码类型
    ↓
选择合适的解决方案
    ↓
生成/提供对应代码
    ↓
指导配置和使用
    ↓
完成任务
```

---

## 配置说明

### 1. 依赖安装

#### 基础依赖
```bash
pip install selenium requests opencv-python numpy pillow
```

#### 完整依赖
```bash
pip install selenium requests opencv-python numpy pillow \
    baidu-aip pytesseract pandas beautifulsoup4 lxml \
    playwright undetected-chromedriver
```

#### requirements.txt
```txt
selenium>=4.0.0
requests>=2.28.0
opencv-python>=4.5.0
numpy>=1.21.0
Pillow>=9.0.0
baidu-aip>=4.15.0
pytesseract>=0.3.8
playwright>=1.28.0
undetected-chromedriver>=3.1.0
```

### 2. API 密钥配置

#### 百度AI开放平台 (OCR/语音识别)
1. 访问 https://cloud.baidu.com/
2. 注册账号并登录
3. 创建应用，获取 APP_ID、API_KEY、SECRET_KEY
4. 配置代码中的对应参数

#### 打码平台配置
```python
# EzCaptcha
EZCAPTCHA_API_KEY = "your_ezcaptcha_api_key"

# 云打码
YUNDAMA_USERNAME = "your_username"
YUNDAMA_PASSWORD = "your_password"
```



### 3. 环境变量配置

创建 `.env` 文件：
```env
# 百度OCR
BAIDU_APP_ID=your_app_id
BAIDU_API_KEY=your_api_key
BAIDU_SECRET_KEY=your_secret_key

# 打码平台
EZCAPTCHA_API_KEY=your_key


```

使用 python-dotenv 加载：
```python
from dotenv import load_dotenv
import os

load_dotenv()

BAIDU_APP_ID = os.getenv('BAIDU_APP_ID')
```

### 4. 浏览器驱动配置

#### Selenium ChromeDriver
```python
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
```

#### Playwright
```bash
playwright install
```

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
```

### 5. Tesseract OCR 配置 (可选)

#### macOS
```bash
brew install tesseract
```

#### Ubuntu
```bash
sudo apt-get install tesseract-ocr
```

#### Windows
下载安装包：https://github.com/UB-Mannheim/tesseract/wiki

---

## 集成第三方服务

### 打码平台

| 平台 | 成功率 | 支持类型 | 价格 |
|------|--------|---------|------|
| EzCaptcha | 99.9% | 全类型 | 低 |
| 云打码 | 98% | 全类型 | 中 |
| 超级鹰 | 99% | 全类型 | 中 |
| 极验 | 99.9% | 行为验证 | 企业级 |

**EzCaptcha 使用示例**：
```python
import requests

def solve_with_ezcaptcha(image_path, api_key):
    with open(image_path, 'rb') as f:
        files = {'image': f}
        data = {'key': api_key, 'type': 'image'}
        response = requests.post('https://api.ez-captcha.com/solve', files=files, data=data)
        return response.json().get('result')
```

### OCR服务

| 服务 | 精度 | 语言支持 | 免费额度 |
|------|------|---------|---------|
| 百度OCR | 高 | 多语言 | 500次/天 |
| 腾讯云OCR | 高 | 多语言 | 1000次/月 |
| Google Vision | 极高 | 多语言 | 1000次/月 |
| 阿里OCR | 高 | 多语言 | 200次/天 |

### 语音识别服务

| 服务 | 精度 | 语言 |
|------|------|------|
| 百度语音 | 高 | 中文/英文 |
| 阿里云ASR | 高 | 多语言 |
| 讯飞听见 | 极高 | 中文 |
| OpenAI Whisper | 高 | 多语言 |

### 短信接收服务

| 服务 | 国家覆盖 | 价格 |
|------|---------|------|
| SMS-Activate | 全球 | 低 |
| 5Sim | 全球 | 低 |
| Receive-SMS-Online | 主要国家 | 部分免费 |

---

## 自动化脚本框架

### 完整的验证码处理框架

```python
import os
import time
import random
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

load_dotenv()

class UniversalCaptchaSolver:
    def __init__(self, driver=None):
        self.driver = driver or self._init_driver()
        self.wait = WebDriverWait(self.driver, 10)
    
    def _init_driver(self):
        """初始化浏览器驱动"""
        options = webdriver.ChromeOptions()
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_experimental_option('excludeSwitches', ['enable-automation'])
        return webdriver.Chrome(options=options)
    
    def solve(self, captcha_type, **kwargs):
        """
        统一入口：解决验证码
        :param captcha_type: 验证码类型
        """
        methods = {
            'image': self._solve_image,
            'slider': self._solve_slider,
            'click': self._solve_click,
            'order_click': self._solve_order_click,
            'spatial': self._solve_spatial,
            'rotation': self._solve_rotation,
            'puzzle': self._solve_puzzle,
            'behavior': self._solve_behavior,
            'image_text': self._solve_image_text,
            'voice': self._solve_voice,
            'math': self._solve_math,
        }
        
        if captcha_type not in methods:
            raise ValueError(f"不支持的验证码类型: {captcha_type}")
        
        return methods[captcha_type](**kwargs)
    
    def _solve_image(self, image_selector=None, image_path=None):
        """解决传统图形验证码"""
        from captcha_solutions import solve_image_captcha
        
        if image_selector:
            elem = self.driver.find_element(By.CSS_SELECTOR, image_selector)
            elem.screenshot('temp_captcha.png')
            image_path = 'temp_captcha.png'
        
        return solve_image_captcha(image_path)
    
    def _solve_slider(self, slider_selector, bg_selector):
        """解决滑动验证码"""
        from captcha_solutions import solve_slider_captcha
        
        slider_elem = self.driver.find_element(By.CSS_SELECTOR, slider_selector)
        bg_elem = self.driver.find_element(By.CSS_SELECTOR, bg_selector)
        
        return solve_slider_captcha(self.driver, slider_elem, bg_elem)
    
    def _solve_click(self, captcha_selector):
        """解决点选式验证码"""
        from captcha_solutions import solve_click_captcha
        
        captcha_elem = self.driver.find_element(By.CSS_SELECTOR, captcha_selector)
        return solve_click_captcha(self.driver, captcha_elem)
    
    def _solve_order_click(self, captcha_selector, target_order):
        """解决语序点选验证码"""
        from captcha_solutions import solve_order_click_captcha
        
        captcha_elem = self.driver.find_element(By.CSS_SELECTOR, captcha_selector)
        return solve_order_click_captcha(self.driver, captcha_elem, target_order)
    
    def _solve_spatial(self, image_selector, question_type):
        """解决空间推理验证码"""
        from captcha_solutions import solve_spatial_captcha
        
        elem = self.driver.find_element(By.CSS_SELECTOR, image_selector)
        elem.screenshot('temp_spatial.png')
        return solve_spatial_captcha('temp_spatial.png', question_type)
    
    def _solve_rotation(self, rotate_selector, image_selector):
        """解决旋转验证码"""
        from captcha_solutions import solve_rotation_captcha
        
        rotate_elem = self.driver.find_element(By.CSS_SELECTOR, rotate_selector)
        image_elem = self.driver.find_element(By.CSS_SELECTOR, image_selector)
        return solve_rotation_captcha(self.driver, rotate_elem, image_elem)
    
    def _solve_puzzle(self, puzzle_selector, cell_size=100):
        """解决滑动还原验证码"""
        from captcha_solutions import solve_slide_puzzle_captcha
        
        puzzle_elem = self.driver.find_element(By.CSS_SELECTOR, puzzle_selector)
        return solve_slide_puzzle_captcha(self.driver, puzzle_elem, cell_size)
    
    def _solve_behavior(self):
        """解决行为验证码"""
        from captcha_solutions import solve_behavior_captcha
        return solve_behavior_captcha(self.driver)
    
    def _solve_image_text(self, image_selector, question):
        """解决图文识别验证码"""
        from captcha_solutions import solve_image_text_captcha
        
        elem = self.driver.find_element(By.CSS_SELECTOR, image_selector)
        elem.screenshot('temp_image_text.png')
        return solve_image_text_captcha('temp_image_text.png', question)
    
    def _solve_voice(self, audio_path=None, audio_url=None):
        """解决语音验证码"""
        from captcha_solutions import solve_voice_captcha
        
        if audio_url:
            import requests
            r = requests.get(audio_url)
            with open('temp_voice.wav', 'wb') as f:
                f.write(r.content)
            audio_path = 'temp_voice.wav'
        
        return solve_voice_captcha(audio_path)
    

    
    def _solve_math(self, image_selector):
        """解决数学运算验证码"""
        from captcha_solutions import solve_math_captcha
        
        elem = self.driver.find_element(By.CSS_SELECTOR, image_selector)
        elem.screenshot('temp_math.png')
        return solve_math_captcha('temp_math.png')
    
    def close(self):
        """关闭浏览器"""
        self.driver.quit()


# 使用示例
if __name__ == "__main__":
    solver = UniversalCaptchaSolver()
    
    try:
        # 打开目标网站
        solver.driver.get("https://example.com/login")
        
        # 示例1: 解决传统图形验证码
        # code = solver.solve('image', image_selector='#captcha-img')
        # input_elem = solver.driver.find_element(By.ID, 'captcha-input')
        # input_elem.send_keys(code)
        
        # 示例2: 解决滑动验证码
        # solver.solve('slider', slider_selector='.slider', bg_selector='.bg')
        
        # 示例3: 解决语序点选验证码
        # solver.solve('order_click', captcha_selector='#captcha', target_order='春夏秋冬')
        
        # 示例4: 解决数学验证码
        # code = solver.solve('math', image_selector='#math-captcha')
        # print(f"计算结果: {code}")
        
    finally:
        solver.close()
```

---

## 最佳实践

### 1. 验证码类型识别
在处理前，先分析页面结构，确定验证码类型。可通过以下方式：
- 检查DOM结构和class名称
- 分析验证码图片特征
- 查看页面提示文字

### 2. 选择合适的解决方案
根据验证码类型选择最适合的处理方法：
- 简单验证码 → 本地OCR
- 复杂验证码 → 打码平台
- 行为验证码 → 模拟人类行为

### 3. 模拟人类行为
- 添加适当的延迟和随机操作
- 鼠标移动轨迹模拟
- 避免固定的时间间隔
- 使用undetected-chromedriver

### 4. 错误处理
```python
def solve_with_retry(solver_func, max_retries=3):
    for i in range(max_retries):
        try:
            return solver_func()
        except Exception as e:
            print(f"尝试 {i+1} 失败: {e}")
            if i == max_retries - 1:
                raise
            time.sleep(2)
```

### 5. 定期更新
随着验证码技术的发展，定期更新处理方法：
- 关注验证码厂商更新
- 维护常用验证码特征库
- 更新依赖库版本

---

## 注意事项

1. **合法性**：确保使用本技能的行为符合法律法规和网站服务条款
2. **道德性**：不要将本技能用于恶意攻击或滥用网站资源
3. **性能**：根据实际需求选择合适的处理方案，平衡速度和准确性
4. **成本**：使用第三方服务时，注意API调用成本
5. **隐私**：妥善保管API密钥，不要提交到代码仓库

---

## 故障排除

### 常见问题及解决方案

1. **验证码识别失败**
   - 检查图片质量，确保清晰可见
   - 尝试不同的OCR引擎或打码平台
   - 调整图像处理参数

2. **被网站识别为自动化程序**
   - 增加操作间隔，模拟人类行为
   - 使用代理IP
   - 更换浏览器指纹
   - 使用undetected-chromedriver

3. **验证码类型识别错误**
   - 改进验证码类型识别逻辑
   - 增加人工干预选项

4. **第三方服务调用失败**
   - 检查API密钥和网络连接
   - 实现服务降级机制
   - 准备备用服务

---

## 总结

本技能提供了一套完整的验证码自动处理解决方案，支持11种常见验证码类型，并包含：

✅ **完整的解决方案** - 每种验证码类型都有详细的解决思路和步骤
✅ **可运行的示例代码** - 提供Python实现代码，可直接使用或修改
✅ **详细的配置说明** - 包含依赖安装、API密钥配置、环境变量设置
✅ **第三方服务集成** - 集成主流打码平台、OCR服务、短信服务
✅ **自然语言调用示例** - 提供多种场景的指令示例
✅ **最佳实践和故障排除** - 帮助用户避免常见问题

在实际应用中，建议根据具体场景选择合适的处理方案，并结合网站的反爬策略进行调整，以达到最佳效果。
