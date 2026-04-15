from typing import Any, List, Optional, Tuple
from ..base import BaseCaptchaSolver


class SlideRestoreCaptchaSolver(BaseCaptchaSolver):
    CAPTCHA_TYPE: str = "slide_restore"
    
    def __init__(self, config: Optional[dict] = None):
        super().__init__(config)
        self.algorithm = self.config.get("algorithm", "astar")
        self.max_moves = self.config.get("max_moves", 100)
        self.allow_rotate = self.config.get("allow_rotate", False)
    
    def solve(self, image_path: Optional[str] = None, size: int = 3, **kwargs) -> List[str]:
        self.validate_input(image_path=image_path)
        self.logger.info(f"Solving slide restore captcha: {image_path}, size: {size}")
        self.logger.info(f"Config - algorithm: {self.algorithm}, max_moves: {self.max_moves}, allow_rotate: {self.allow_rotate}")
        
        moves = []
        
        self.logger.info(f"Slide restore captcha solved, moves: {moves}")
        return moves
    
    def validate_input(self, image_path: Optional[str] = None, **kwargs) -> None:
        if not image_path:
            self._raise_processing_error("image_path must be provided")
    
    def _split_into_tiles(self, image_path: str, size: int) -> List[Tuple]:
        self.logger.debug(f"Splitting image into {size}x{size} tiles")
        return []
    
    def _find_solution(self, tiles: List[Tuple]) -> List[str]:
        self.logger.debug(f"Finding solution using {self.algorithm} algorithm")
        return []
