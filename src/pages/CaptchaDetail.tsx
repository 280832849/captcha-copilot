import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Play, Pause, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import CaptchaWithProcessing from '../components/captcha/CaptchaWithProcessing'

const CaptchaDetail: React.FC = () => {
  const { type } = useParams<{ type: string }>()
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [result, setResult] = useState<{ success: boolean; result: string; time: number; error?: string } | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(10)
  const [clickedItems, setClickedItems] = useState<number[]>([])
  const [captchaCode, setCaptchaCode] = useState('')
  const [rotateAngle, setRotateAngle] = useState(90)
  const [slidePieces, setSlidePieces] = useState<{ x: number; y: number }[]>([])

  const captchaTypes = {
    image: {
      name: '传统图形验证码',
      description: '包含数字、字母、符号的静态图片验证码',
      color: '#165DFF',
    },
    slider: {
      name: '滑动验证码',
      description: '需要拖动滑块到指定位置的验证码',
      color: '#00B42A',
    },
    click: {
      name: '点选式验证码',
      description: '需要点击图片中指定元素的验证码',
      color: '#FF7D00',
    },
    word_order: {
      name: '语序点选验证码',
      description: '需要将词语排列成通顺句子的验证码',
      color: '#F53F3F',
    },
    spatial: {
      name: '空间推理验证码',
      description: '需要判断空间位置关系的验证码',
      color: '#722ED1',
    },
    rotate: {
      name: '旋转验证码',
      description: '需要旋转图片到正确方向的验证码',
      color: '#14C9C9',
    },
    slide_restore: {
      name: '滑动还原验证码',
      description: '需要滑动方块还原拼图的验证码',
      color: '#FF4D4F',
    },
    behavior: {
      name: '行为验证码',
      description: '基于用户行为分析的验证码',
      color: '#52C41A',
    },
    text: {
      name: '图文识别验证码',
      description: '需要识别图片内容的验证码',
      color: '#722ED1',
    },
    audio: {
      name: '语音验证码',
      description: '需要听音频并输入验证码的验证码',
      color: '#14C9C9',
    },
    sms: {
      name: '短信验证码',
      description: '通过短信发送验证码的验证方式',
      color: '#1890FF',
    },
    math: {
      name: '数学运算验证码',
      description: '需要计算数学题答案的验证码',
      color: '#FA8C16',
    },
  }

  const currentCaptcha = captchaTypes[type as keyof typeof captchaTypes]

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    setResult(null)
  }

  const getShortName = () => {
    const shortNames: Record<string, string> = {
      '传统图形验证码': 'IMAGE',
      '滑动验证码': 'SLIDER',
      '点选式验证码': 'CLICK',
      '语序点选验证码': 'WORD_ORDER',
      '空间推理验证码': 'SPATIAL',
      '旋转验证码': 'ROTATE',
      '滑动还原验证码': 'SLIDE_RESTORE',
      '行为验证码': 'BEHAVIOR',
      '图文识别验证码': 'TEXT',
      '语音验证码': 'AUDIO',
      '短信验证码': 'SMS',
      '数学运算验证码': 'MATH',
    }
    return currentCaptcha ? shortNames[currentCaptcha.name] || 'CAPTCHA' : 'CAPTCHA'
  }

  // 生成随机验证码
  useEffect(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaCode(code)
  }, [refreshKey])

  const processSteps = {
    image: [
      '正在截取验证码图片...',
      '正在预处理图片（灰度化、二值化）...',
      '正在OCR识别验证码内容...',
      '识别完成！'
    ],
    slider: [
      '正在分析缺口位置...',
      '正在计算滑动轨迹...',
      '正在执行滑动操作...',
      '验证完成！'
    ],
    click: [
      '正在识别目标元素...',
      '正在计算点击坐标...',
      '正在执行点击操作...',
      '验证完成！'
    ],
    word_order: [
      '正在识别词语内容...',
      '正在分析语义关系...',
      '正在排列词语顺序...',
      '验证完成！'
    ],
    spatial: [
      '正在分析空间结构...',
      '正在判断位置关系...',
      '正在生成答案...',
      '识别完成！'
    ],
    rotate: [
      '正在分析图片方向...',
      '正在计算旋转角度...',
      '正在执行旋转操作...',
      '验证完成！'
    ],
    slide_restore: [
      '正在分析拼图状态...',
      '正在规划移动路径...',
      '正在执行滑动操作...',
      '验证完成！'
    ],
    behavior: [
      '正在分析行为要求...',
      '正在模拟人类行为...',
      '正在执行操作序列...',
      '验证完成！'
    ],
    text: [
      '正在分析图片内容...',
      '正在识别场景元素...',
      '正在生成答案...',
      '识别完成！'
    ],
    audio: [
      '正在获取音频文件...',
      '正在进行语音识别...',
      '正在识别验证码内容...',
      '识别完成！'
    ],
    sms: [
      '正在获取短信验证码...',
      '正在解析验证码内容...',
      '正在输入验证码...',
      '验证完成！'
    ],
    math: [
      '正在识别数学表达式...',
      '正在进行数学计算...',
      '正在选择正确答案...',
      '验证完成！'
    ],
  }

  const handleTest = async () => {
    setIsProcessing(true)
    setResult(null)
    setProcessingStep(0)
    setClickedItems([])
    setSliderPosition(10)
    setRotateAngle(90)
    setSlidePieces([])

    const steps = processSteps[type as keyof typeof processSteps] || processSteps.image

    try {
      const startTime = Date.now()

      // 传统图形验证码处理
      if (type === 'image') {
        for (let i = 0; i < steps.length; i++) {
          setProcessingStep(i + 1)
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }
      
      // 滑动验证码处理
      else if (type === 'slider') {
        for (let i = 0; i < steps.length; i++) {
          setProcessingStep(i + 1)
          if (i === 2) {
            for (let pos = 10; pos <= 60; pos += 2) {
              setSliderPosition(pos)
              await new Promise((resolve) => setTimeout(resolve, 30))
            }
          } else {
            await new Promise((resolve) => setTimeout(resolve, 400))
          }
        }
      }
      
      // 点选式验证码处理
      else if (type === 'click') {
        for (let i = 0; i < steps.length; i++) {
          setProcessingStep(i + 1)
          if (i === 2) {
            const targets = [0, 5, 7]
            for (const target of targets) {
              setClickedItems(prev => [...prev, target])
              await new Promise((resolve) => setTimeout(resolve, 400))
            }
          } else {
            await new Promise((resolve) => setTimeout(resolve, 400))
          }
        }
      }
      
      // 语序点选验证码处理
      else if (type === 'word_order') {
        for (let i = 0; i < steps.length; i++) {
          setProcessingStep(i + 1)
          if (i === 2) {
            const targets = [0, 1, 2, 3]
            for (const target of targets) {
              setClickedItems(prev => [...prev, target])
              await new Promise((resolve) => setTimeout(resolve, 350))
            }
          } else {
            await new Promise((resolve) => setTimeout(resolve, 400))
          }
        }
      }
      
      // 旋转验证码处理
      else if (type === 'rotate') {
        for (let i = 0; i < steps.length; i++) {
          setProcessingStep(i + 1)
          if (i === 2) {
            for (let angle = 90; angle >= 0; angle -= 5) {
              setRotateAngle(angle)
              await new Promise((resolve) => setTimeout(resolve, 40))
            }
          } else {
            await new Promise((resolve) => setTimeout(resolve, 400))
          }
        }
      }
      
      // 其他验证码处理
      else {
        for (let i = 0; i < steps.length; i++) {
          setProcessingStep(i + 1)
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }

      const endTime = Date.now()
      const resultMap: Record<string, string> = {
        image: captchaCode,
        text: '奶牛',
        spatial: '左上方',
        math: '42',
        sms: '5821',
      }
      setResult({
        success: true,
        result: resultMap[type as keyof typeof resultMap] || '验证成功',
        time: endTime - startTime,
      })
    } catch (error) {
      setResult({
        success: false,
        result: '',
        time: 0,
        error: '处理失败，请重试',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAudioToggle = () => {
    setAudioPlaying(!audioPlaying)
    // 这里可以添加音频播放逻辑
  }

  if (!currentCaptcha) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">验证码类型不存在</h1>
        <Link to="/" className="btn btn-primary">
          返回首页
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link to="/" className="btn btn-secondary flex items-center space-x-2 mr-4">
          <ArrowLeft className="h-4 w-4" />
          <span>返回首页</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">{currentCaptcha.name}</h1>
      </div>

      <div className="card mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">验证码描述</h2>
          <p className="text-gray-600">{currentCaptcha.description}</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <CaptchaWithProcessing 
              key={refreshKey}
              type={getShortName()}
              text={captchaCode}
              color={currentCaptcha.color}
              width={300}
              height={150}
              isProcessing={isProcessing}
              sliderPosition={sliderPosition}
              clickedItems={clickedItems}
              rotateAngle={rotateAngle}
              slidePieces={slidePieces}
            />
            {type === 'audio' && !isProcessing && (
              <button 
                onClick={handleAudioToggle}
                className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md text-primary"
              >
                {audioPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </button>
            )}
          </div>

          {/* 处理步骤显示 */}
          {(isProcessing || result) && (
            <div className="w-full max-w-md mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-success" />
                处理进度
              </h3>
              <div className="space-y-2">
                {(processSteps[type as keyof typeof processSteps] || processSteps.image).map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center p-3 rounded-lg transition-all ${
                      index < processingStep ? 'bg-success/10 text-success' : 
                      index === processingStep ? 'bg-primary/10 text-primary' : 
                      'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <div className="mr-3">
                      {index < processingStep ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : index === processingStep ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-current" />
                      )}
                    </div>
                    <span className="flex-1">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button 
              onClick={handleRefresh}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>刷新验证码</span>
            </button>
            <button 
              onClick={handleTest}
              className="btn btn-primary flex items-center space-x-2"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </>
              ) : (
                <span>测试处理</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className={`card ${result.success ? 'result-success' : 'result-error'}`}>
          <h2 className="text-xl font-semibold mb-2">处理结果</h2>
          {result.success ? (
            <>
              <p className="mb-2">识别结果: <span className="font-mono">{result.result}</span></p>
              <p>处理时间: {result.time} 毫秒</p>
            </>
          ) : (
            <p>{result.error}</p>
          )}
        </div>
      )}

      <div className="mt-8 card">
        <h2 className="text-xl font-semibold mb-4">处理方法</h2>
        <div className="space-y-4">
          {type === 'image' && (
            <>
              <p>1. 截图获取验证码图片</p>
              <p>2. 预处理图片（灰度化、二值化等）</p>
              <p>3. 使用OCR引擎识别或发送到打码平台</p>
              <p>4. 返回识别结果</p>
            </>
          )}
          {type === 'slider' && (
            <>
              <p>1. 截图获取滑块和背景图片</p>
              <p>2. 分析缺口位置</p>
              <p>3. 生成模拟人类的滑动轨迹</p>
              <p>4. 执行滑动操作</p>
            </>
          )}
          {type === 'click' && (
            <>
              <p>1. 截图获取验证码图片</p>
              <p>2. 识别需要点击的目标元素</p>
              <p>3. 计算目标元素在页面上的坐标</p>
              <p>4. 按顺序执行点击操作</p>
            </>
          )}
          {type === 'word_order' && (
            <>
              <p>1. 识别所有词语内容</p>
              <p>2. 分析语义关系和语法结构</p>
              <p>3. 按正确顺序排列词语</p>
              <p>4. 执行点击确认</p>
            </>
          )}
          {type === 'spatial' && (
            <>
              <p>1. 分析空间结构和元素位置</p>
              <p>2. 判断元素之间的相对位置关系</p>
              <p>3. 生成正确答案</p>
              <p>4. 返回识别结果</p>
            </>
          )}
          {type === 'rotate' && (
            <>
              <p>1. 分析图片当前方向</p>
              <p>2. 计算需要旋转的角度</p>
              <p>3. 执行旋转操作</p>
              <p>4. 验证完成</p>
            </>
          )}
          {type === 'slide_restore' && (
            <>
              <p>1. 分析当前拼图状态</p>
              <p>2. 规划最优移动路径</p>
              <p>3. 逐步滑动方块还原拼图</p>
              <p>4. 验证完成</p>
            </>
          )}
          {type === 'behavior' && (
            <>
              <p>1. 分析验证码的行为要求</p>
              <p>2. 设计符合人类行为的操作序列</p>
              <p>3. 执行操作序列</p>
            </>
          )}
          {type === 'text' && (
            <>
              <p>1. 截图获取验证码图片</p>
              <p>2. 使用图像识别技术识别图片内容</p>
              <p>3. 返回识别结果</p>
            </>
          )}
          {type === 'audio' && (
            <>
              <p>1. 获取音频文件</p>
              <p>2. 使用语音识别技术识别音频内容</p>
              <p>3. 返回识别结果</p>
            </>
          )}
          {type === 'sms' && (
            <>
              <p>1. 监听或获取短信内容</p>
              <p>2. 提取短信中的验证码</p>
              <p>3. 自动输入验证码</p>
              <p>4. 提交验证</p>
            </>
          )}
          {type === 'math' && (
            <>
              <p>1. 识别数学表达式</p>
              <p>2. 进行数学计算</p>
              <p>3. 选择或输入正确答案</p>
              <p>4. 提交验证</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CaptchaDetail