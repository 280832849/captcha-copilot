import React, { useState, useEffect } from 'react'

interface CaptchaPlaceholderProps {
  type: string
  text: string
  color: string
  width?: number
  height?: number
}

const CaptchaPlaceholder: React.FC<CaptchaPlaceholderProps> = ({ 
  type, 
  text, 
  color, 
  width = 300, 
  height = 150 
}) => {
  const [captchaCode, setCaptchaCode] = useState('')
  
  useEffect(() => {
    // 生成随机验证码
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaCode(code)
  }, [type])

  // 传统图形验证码
  const ImageCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
      {/* 噪点背景 */}
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
      
      {/* 验证码文字 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex space-x-2">
          {captchaCode.split('').map((char, index) => (
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
    </div>
  )

  // 滑动验证码
  const SliderCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
      {/* 背景图片 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
      
      {/* 拼图缺口 */}
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
      
      {/* 拼图块 */}
      <div 
        className="absolute top-1/2 transform -translate-y-1/2 shadow-lg"
        style={{ left: '10%' }}
      >
        <div 
          className="w-12 h-12 rounded"
          style={{ 
            backgroundColor: color,
            clipPath: 'polygon(0 0, 100% 0, 100% 30%, 70% 30%, 70% 0, 30% 0, 30% 30%, 0 30%, 0 70%, 30% 70%, 30% 100%, 70% 100%, 70% 70%, 100% 70%, 100% 30%, 100% 0)'
          }}
        />
      </div>
      
      {/* 滑块轨道 */}
      <div className="absolute bottom-4 left-4 right-4 h-8 bg-gray-300 rounded-full relative">
        <div 
          className="absolute left-1 top-1 w-10 h-6 rounded-full shadow-md flex items-center justify-center text-white text-xs"
          style={{ backgroundColor: color }}
        >
          →
        </div>
      </div>
    </div>
  )

  // 点选式验证码
  const ClickCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
      {/* 背景图片 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100" />
      
      {/* 可点击的物体 */}
      <div className="absolute inset-0 p-2">
        <div className="grid grid-cols-3 gap-2 h-full">
          {[
            { emoji: '🍎', color: '#EF4444' },
            { emoji: '🍊', color: '#F97316' },
            { emoji: '🍋', color: '#EAB308' },
            { emoji: '🍇', color: '#8B5CF6' },
            { emoji: '🍓', color: '#EC4899' },
            { emoji: '🍑', color: '#FB923C' },
          ].map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg flex items-center justify-center text-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              {item.emoji}
            </div>
          ))}
        </div>
      </div>
      
      {/* 提示文字 */}
      <div className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-full text-sm">
        请点击：<span style={{ color: color }}>🍎 🍓 🍇</span>
      </div>
    </div>
  )

  // 行为验证码
  const BehaviorCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">👆</div>
        <div className="text-gray-600 mb-4">请将滑块拖到最右边</div>
        {/* 滑块 */}
        <div className="w-48 h-8 bg-gray-300 rounded-full relative mx-auto">
          <div 
            className="absolute left-1 top-1 w-10 h-6 rounded-full shadow-md flex items-center justify-center text-white text-xs"
            style={{ backgroundColor: color }}
          >
            →
          </div>
        </div>
      </div>
    </div>
  )

  // 图文识别验证码
  const TextCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
      {/* 图片场景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-green-200">
        {/* 太阳 */}
        <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 rounded-full" />
        
        {/* 云朵 */}
        <div className="absolute top-8 left-8">
          <div className="flex">
            <div className="w-8 h-6 bg-white rounded-full" />
            <div className="w-10 h-8 bg-white rounded-full -ml-3 -mt-1" />
            <div className="w-8 h-6 bg-white rounded-full -ml-3" />
          </div>
        </div>
        
        {/* 地面 */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-green-300" />
        
        {/* 树 */}
        <div className="absolute bottom-1/3 left-8">
          <div className="w-4 h-12 bg-amber-700 mx-auto" />
          <div className="w-16 h-16 bg-green-500 rounded-full -mt-4" />
        </div>
        
        {/* 房子 */}
        <div className="absolute bottom-1/3 right-12">
          <div className="w-0 h-0 border-l-12 border-r-12 border-b-16 border-l-transparent border-r-transparent border-b-red-500" 
               style={{ borderBottomWidth: '16px', borderLeftWidth: '16px', borderRightWidth: '16px' }} />
          <div className="w-12 h-10 bg-yellow-200 -mt-1" />
        </div>
        
        {/* 动物 */}
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-4xl">
          🐄
        </div>
      </div>
      
      {/* 问题 */}
      <div className="absolute bottom-2 left-2 right-2 bg-white/95 px-3 py-2 rounded-lg">
        <div className="text-sm">图中有什么动物？</div>
      </div>
    </div>
  )

  // 语音验证码
  const AudioCaptcha = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🔊</div>
        <div className="text-gray-600 mb-4">请点击播放验证码语音</div>
        
        {/* 音频波形 */}
        <div className="flex items-center justify-center space-x-1 mb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="w-2 rounded-t"
              style={{ 
                backgroundColor: color,
                height: `${20 + Math.random() * 30}px`
              }}
            />
          ))}
        </div>
        
        {/* 播放按钮 */}
        <button 
          className="px-6 py-2 rounded-full text-white font-medium"
          style={{ backgroundColor: color }}
        >
          播放语音
        </button>
      </div>
    </div>
  )

  // 根据类型渲染不同的验证码
  const renderCaptcha = () => {
    switch (type) {
      case 'IMAGE':
        return <ImageCaptcha />
      case 'SLIDER':
        return <SliderCaptcha />
      case 'CLICK':
        return <ClickCaptcha />
      case 'BEHAVIOR':
        return <BehaviorCaptcha />
      case 'TEXT':
        return <TextCaptcha />
      case 'AUDIO':
        return <AudioCaptcha />
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

export default CaptchaPlaceholder