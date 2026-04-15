import random
import time
from typing import Any, List, Optional, Tuple, Union

try:
    import cv2
    import numpy as np
    OPENCV_AVAILABLE = True
except ImportError:
    cv2 = None
    np = None
    OPENCV_AVAILABLE = False

from ..base import BaseCaptchaSolver
from ..exceptions import ConfigurationError


class SliderCaptchaSolver(BaseCaptchaSolver):
    CAPTCHA_TYPE: str = "slider"
    
    def __init__(self, config: Optional[dict] = None):
        super().__init__(config)
        self.threshold = self.config.get("threshold", 0.7)
        self.gaussian_kernel = self.config.get("gaussian_kernel", (5, 5))
        self.canny_low = self.config.get("canny_low", 50)
        self.canny_high = self.config.get("canny_high", 150)
    
    def solve(self, bg_image_path: Optional[str] = None, slider_image_path: Optional[str] = None, **kwargs) -> int:
        self.validate_input(bg_image_path=bg_image_path, slider_image_path=slider_image_path)
        self.logger.info(f"Solving slider captcha: bg={bg_image_path}, slider={slider_image_path}")
        
        distance = self.detect_gap_position(bg_image_path, slider_image_path)
        
        self.logger.info(f"Slider captcha solved, distance: {distance}")
        return distance
    
    def validate_input(self, bg_image_path: Optional[str] = None, slider_image_path: Optional[str] = None, **kwargs) -> None:
        if not bg_image_path or not slider_image_path:
            self._raise_processing_error("Both bg_image_path and slider_image_path must be provided")
    
    def detect_gap_position(self, bg_image_path: str, slider_image_path: str) -> int:
        if not OPENCV_AVAILABLE:
            raise ConfigurationError("OpenCV is not installed. Please install it with 'pip install opencv-python'")
        
        bg_img = cv2.imread(bg_image_path)
        slider_img = cv2.imread(slider_image_path)
        
        if bg_img is None or slider_img is None:
            self._raise_processing_error("Failed to read images")
        
        bg_gray = cv2.cvtColor(bg_img, cv2.COLOR_BGR2GRAY)
        slider_gray = cv2.cvtColor(slider_img, cv2.COLOR_BGR2GRAY)
        
        bg_blur = cv2.GaussianBlur(bg_gray, self.gaussian_kernel, 0)
        slider_blur = cv2.GaussianBlur(slider_gray, self.gaussian_kernel, 0)
        
        bg_edges = cv2.Canny(bg_blur, self.canny_low, self.canny_high)
        slider_edges = cv2.Canny(slider_blur, self.canny_low, self.canny_high)
        
        result = cv2.matchTemplate(bg_edges, slider_edges, cv2.TM_CCOEFF_NORMED)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
        
        if max_val < self.threshold:
            self.logger.warning(f"Match confidence {max_val:.2f} below threshold {self.threshold}")
        
        return max_loc[0]
    
    def generate_slide_track(self, distance: int, start_x: int = 0, start_y: int = 0) -> List[Tuple[int, int, float]]:
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
            move = v0 * t + 0.5 * a * t * t
            current += move
            
            offset_x = round(move)
            offset_y = self._get_random_y_offset()
            
            track.append((start_x + offset_x, start_y + offset_y, t))
            
            start_x += offset_x
            start_y += offset_y
        
        track.append((start_x + (distance - current), start_y, 0.1))
        
        track = self._add_random_jitter(track)
        
        return track
    
    def _get_random_y_offset(self) -> int:
        return random.randint(-2, 2)
    
    def _add_random_jitter(self, track: List[Tuple[int, int, float]]) -> List[Tuple[int, int, float]]:
        jittered_track = []
        for i, (x, y, t) in enumerate(track):
            if i > 0 and i < len(track) - 1:
                jitter_x = random.randint(-1, 1)
                jitter_y = random.randint(-1, 1)
                jitter_t = random.uniform(-0.02, 0.02)
                jittered_track.append((x + jitter_x, y + jitter_y, max(0.01, t + jitter_t)))
            else:
                jittered_track.append((x, y, t))
        return jittered_track
    
    def slide_with_selenium(self, driver, slider_element, distance: int) -> None:
        from selenium.webdriver import ActionChains
        
        track = self.generate_slide_track(distance)
        
        ActionChains(driver).click_and_hold(slider_element).perform()
        time.sleep(0.2)
        
        for x, y, t in track:
            ActionChains(driver).move_by_offset(x, y).perform()
            time.sleep(t)
        
        ActionChains(driver).release().perform()
    
    def slide_with_playwright(self, page, slider_selector: str, distance: int) -> None:
        track = self.generate_slide_track(distance)
        
        bounding_box = page.locator(slider_selector).bounding_box()
        if not bounding_box:
            self._raise_processing_error("Failed to get slider bounding box")
        
        start_x = bounding_box["x"] + bounding_box["width"] / 2
        start_y = bounding_box["y"] + bounding_box["height"] / 2
        
        page.mouse.move(start_x, start_y)
        page.mouse.down()
        time.sleep(0.2)
        
        current_x = start_x
        current_y = start_y
        
        for x, y, t in track:
            current_x += x
            current_y += y
            page.mouse.move(current_x, current_y)
            time.sleep(t)
        
        page.mouse.up()
