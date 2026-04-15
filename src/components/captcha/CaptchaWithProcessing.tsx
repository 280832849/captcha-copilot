import React from 'react'
import { CheckCircle } from 'lucide-react'

interface CaptchaWithProcessingProps {
  type: string
  text: string
  color: string
  width?: number
  height?: number
  isProcessing?: boolean
  sliderPosition?: number
  clickedItems?: number[]
  rotateAngle?: number
  slidePieces?: { x: number; y: number }[]
}

const CaptchaWithProcessing: React.FC<CaptchaWithProcessingProps> = ({ 
  type, 
  text, 
  color, 
  width = 300, 
  height = 150,
  isProcessing = false,
  sliderPosition = 10,
  clickedItems = [],
  rotateAngle = 0,
  slidePieces = []
}) => {
  // 传统图形验证码
  const ImageCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
      <svg className="absolute inset-0" width="100%" height="100%">
        {Array.from({ length: 30 }).map((_, i) => (
          <circle 
            key={i} 
            cx={Math.random() * width} 
            cy={Math.random() * height} 
            r={Math.random() * 3 + 1} 
            fill={color} 
            opacity={0.3}
          />
        ))}
        {Array.from({ length: 3 }).map((_, i) => (
          <line 
            key={`line-${i}`}
            x1={Math.random() * width}
            y1={Math.random() * height}
            x2={Math.random() * width}
            y2={Math.random() * height}
            stroke={color}
            strokeWidth="2"
            opacity={0.4}
          />
        ))}
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex space-x-2">
          {text.split('').map((char, index) => (
            <span 
              key={index}
              className="text-4xl font-bold transform"
              style={{ 
                color: color,
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
                fontFamily: 'Courier New, monospace'
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {isProcessing && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-white font-medium animate-pulse">识别中...</div>
        </div>
      )}
    </div>
  )

  // 滑动拼图验证码
  const SliderCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200" />
      
      <div 
        className="absolute top-1/2 transform -translate-y-1/2"
        style={{ left: '60%' }}
      >
        <div 
          className="w-12 h-12 rounded bg-white"
          style={{ 
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
            clipPath: 'polygon(0 0, 100% 0, 100% 30%, 70% 30%, 70% 0, 30% 0, 30% 30%, 0 30%, 0 70%, 30% 70%, 30% 100%, 70% 100%, 70% 70%, 100% 70%, 100% 30%, 100% 0)'
          }}
        />
      </div>
      
      <div 
        className="absolute top-1/2 transform -translate-y-1/2 shadow-lg transition-all duration-100"
        style={{ left: `${sliderPosition}%` }}
      >
        <div 
          className="w-12 h-12 rounded"
          style={{ 
            backgroundColor: color,
            clipPath: 'polygon(0 0, 100% 0, 100% 30%, 70% 30%, 70% 0, 30% 0, 30% 30%, 0 30%, 0 70%, 30% 70%, 30% 100%, 70% 100%, 70% 70%, 100% 70%, 100% 30%, 100% 0)'
          }}
        />
      </div>
      
      <div className="absolute bottom-4 left-4 right-4 h-8 bg-gray-300 rounded-full relative">
        <div 
          className="absolute top-1 w-10 h-6 rounded-full shadow-md flex items-center justify-center text-white text-xs transition-all duration-100"
          style={{ 
            left: `${(sliderPosition / 100) * (100 - 12)}%`,
            backgroundColor: color 
          }}
        >
          →
        </div>
      </div>
    </div>
  )

  // 文字点选验证码
  const ClickCaptcha = () => {
    const chars = ['春', '夏', '秋', '冬', '风', '花', '雪', '月', '山', '水', '云', '雨']
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
        
        <div className="absolute inset-2 flex flex-wrap items-center justify-center gap-3 p-4">
          {chars.slice(0, 9).map((char, index) => (
            <div 
              key={index}
              className={`w-10 h-10 bg-white rounded flex items-center justify-center text-lg font-medium shadow-sm transition-all cursor-pointer ${
                clickedItems.includes(index) ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
              }`}
            >
              {char}
              {clickedItems.includes(index) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-full text-sm">
          请依次点击：<span style={{ color: color }}>春 花 月</span>
        </div>
      </div>
    )
  }

  // 语序点选验证码
  const WordOrderCaptcha = () => {
    const words = ['人工智能', '改变', '世界', '未来', '科技', '创新']
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100" />
        
        <div className="absolute inset-3 flex flex-wrap items-center justify-center gap-2">
          {words.map((word, index) => (
            <div 
              key={index}
              className={`px-4 py-2 bg-white rounded-full text-sm font-medium shadow-sm transition-all cursor-pointer ${
                clickedItems.includes(index) ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
              }`}
            >
              {word}
              {clickedItems.includes(index) && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-2 left-2 right-2 bg-white/90 px-3 py-2 rounded-lg text-center text-sm">
          请将词语排列成通顺的句子
        </div>
      </div>
    )
  }

  // 空间推理验证码
  const SpatialCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-200" />
      
      <div className="absolute inset-4 flex items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 bg-white rounded shadow-lg flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-dashed border-gray-400 rounded" />
              <div 
                className="absolute w-8 h-8 bg-red-500 rounded-sm"
                style={{ top: '-10px', left: '-10px' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-2 left-2 right-2 bg-white/90 px-3 py-2 rounded-lg text-center text-sm">
        红色方块在虚线框的哪个方向？
      </div>
    </div>
  )

  // 旋转验证码
  const RotateCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-teal-100" />
      
      <div className="absolute inset-4 flex items-center justify-center">
        <div 
          className="w-24 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center transition-transform duration-300"
          style={{ transform: `rotate(${rotateAngle}deg)` }}
        >
          <span className="text-4xl">🏠</span>
        </div>
      </div>
      
      <div className="absolute bottom-2 left-2 right-2 bg-white/90 px-3 py-2 rounded-lg text-center text-sm">
        请将图片旋转到正确方向
      </div>
    </div>
  )

  // 滑动还原验证码
  const SlideRestoreCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-yellow-100" />
      
      <div className="absolute inset-2">
        <div className="grid grid-cols-3 gap-1 h-full">
          {Array.from({ length: 9 }).map((_, index) => {
            const isLast = index === 8
            const piece = slidePieces[index] || { x: 0, y: 0 }
            return (
              <div 
                key={index}
                className={`rounded ${isLast ? 'bg-gray-200' : 'bg-white'} shadow-sm flex items-center justify-center`}
                style={{ 
                  transform: `translate(${piece.x}px, ${piece.y}px)`,
                  transition: 'transform 0.3s ease'
                }}
              >
                {!isLast && (
                  <span className="text-2xl font-bold" style={{ color: color }}>
                    {index + 1}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="absolute bottom-2 left-2 right-2 bg-white/90 px-3 py-2 rounded-lg text-center text-sm">
        请滑动方块还原拼图
      </div>
    </div>
  )

  // 行为验证码
  const BehaviorCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">👆</div>
        <div className="text-gray-600 mb-4">请将滑块拖到最右边</div>
        <div className="w-48 h-8 bg-gray-300 rounded-full relative mx-auto">
          <div 
            className="absolute top-1 w-10 h-6 rounded-full shadow-md flex items-center justify-center text-white text-xs"
            style={{ 
              left: isProcessing ? 'calc(100% - 44px)' : '4px',
              transition: isProcessing ? 'left 0.5s ease-in-out' : 'none',
              backgroundColor: color 
            }}
          >
            {isProcessing ? '✓' : '→'}
          </div>
        </div>
      </div>
    </div>
  )

  // 图文识别验证码
  const TextCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-green-200">
        <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 rounded-full" />
        
        <div className="absolute top-8 left-8">
          <div className="flex">
            <div className="w-8 h-6 bg-white rounded-full" />
            <div className="w-10 h-8 bg-white rounded-full -ml-3 -mt-1" />
            <div className="w-8 h-6 bg-white rounded-full -ml-3" />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-green-300" />
        
        <div className="absolute bottom-1/3 left-8">
          <div className="w-4 h-12 bg-amber-700 mx-auto" />
          <div className="w-16 h-16 bg-green-500 rounded-full -mt-4" />
        </div>
        
        <div className="absolute bottom-1/3 right-12">
          <div className="w-0 h-0 border-l-12 border-r-12 border-b-16 border-l-transparent border-r-transparent border-b-red-500" 
               style={{ borderBottomWidth: '16px', borderLeftWidth: '16px', borderRightWidth: '16px' }} />
          <div className="w-12 h-10 bg-yellow-200 -mt-1" />
        </div>
        
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-4xl">
          🐄
        </div>
      </div>
      
      <div className="absolute bottom-2 left-2 right-2 bg-white/95 px-3 py-2 rounded-lg">
        <div className="text-sm">图中有什么动物？</div>
      </div>

      {isProcessing && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-white font-medium animate-pulse">识别中...</div>
        </div>
      )}
    </div>
  )

  // 语音验证码
  const AudioCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🔊</div>
        <div className="text-gray-600 mb-4">请点击播放验证码语音</div>
        
        <div className="flex items-end justify-center space-x-1 mb-4 h-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="w-2 rounded-t"
              style={{ 
                backgroundColor: color,
                height: `${isProcessing ? 20 + Math.random() * 30 : 20}px`,
                transition: isProcessing ? 'height 0.2s ease-in-out' : 'none'
              }}
            />
          ))}
        </div>
        
        <button 
          className="px-6 py-2 rounded-full text-white font-medium"
          style={{ backgroundColor: color }}
        >
          {isProcessing ? '播放中...' : '播放语音'}
        </button>
      </div>
    </div>
  )

  // 短信验证码
  const SmsCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
      
      <div className="absolute inset-4 flex flex-col items-center justify-center">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">📱</div>
          <div className="text-gray-600 text-sm">验证码已发送到您的手机</div>
        </div>
        
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div 
              key={index}
              className="w-10 h-12 bg-white rounded border-2 border-gray-300 flex items-center justify-center text-xl font-bold"
              style={{ borderColor: isProcessing ? color : '' }}
            >
              {isProcessing && index < 4 ? ['5', '8', '2', '1'][index] : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 数学运算验证码
  const MathCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50" />
      
      <div className="absolute inset-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold mb-4" style={{ color: color }}>
            17 + 25 = ?
          </div>
          <div className="flex space-x-2 justify-center">
            {['32', '42', '41', '38'].map((option, index) => (
              <div 
                key={index}
                className={`w-14 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center font-medium transition-all cursor-pointer ${
                  isProcessing && option === '42' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderCaptcha = () => {
    switch (type) {
      case 'IMAGE':
        return <ImageCaptcha />
      case 'SLIDER':
        return <SliderCaptcha />
      case 'CLICK':
        return <ClickCaptcha />
      case 'WORD_ORDER':
        return <WordOrderCaptcha />
      case 'SPATIAL':
        return <SpatialCaptcha />
      case 'ROTATE':
        return <RotateCaptcha />
      case 'SLIDE_RESTORE':
        return <SlideRestoreCaptcha />
      case 'BEHAVIOR':
        return <BehaviorCaptcha />
      case 'TEXT':
        return <TextCaptcha />
      case 'AUDIO':
        return <AudioCaptcha />
      case 'SMS':
        return <SmsCaptcha />
      case 'MATH':
        return <MathCaptcha />
      default:
        return <ImageCaptcha />
    }
  }

  return (
    <div 
      className="rounded-lg overflow-hidden shadow-inner"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {renderCaptcha()}
    </div>
  )
}

export default CaptchaWithProcessing