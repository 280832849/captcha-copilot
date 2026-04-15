import React from 'react'
import CaptchaCard from '../components/captcha/CaptchaCard'
import { Shield, Code, Zap, CheckCircle } from 'lucide-react'

const Home: React.FC = () => {
  const captchaTypes = [
    {
      id: 'image',
      name: '传统图形验证码',
      description: '包含数字、字母、符号的静态图片验证码',
      color: '#165DFF',
      difficulty: 'easy' as const,
    },
    {
      id: 'slider',
      name: '滑动拼图验证码',
      description: '需要拖动拼图块到缺口位置的验证码',
      color: '#00B42A',
      difficulty: 'medium' as const,
    },
    {
      id: 'click',
      name: '文字点选验证码',
      description: '需要按顺序点击图中指定文字的验证码',
      color: '#FF7D00',
      difficulty: 'medium' as const,
    },
    {
      id: 'word_order',
      name: '语序点选验证码',
      description: '需要按正确顺序点击词语的验证码',
      color: '#F53F3F',
      difficulty: 'hard' as const,
    },
    {
      id: 'spatial',
      name: '空间推理验证码',
      description: '需要判断空间关系的验证码',
      color: '#722ED1',
      difficulty: 'hard' as const,
    },
    {
      id: 'rotate',
      name: '旋转验证码',
      description: '需要将图片旋转到正确角度的验证码',
      color: '#14C9C9',
      difficulty: 'hard' as const,
    },
    {
      id: 'slide_restore',
      name: '滑动还原验证码',
      description: '需要滑动图片还原完整图的验证码',
      color: '#E64340',
      difficulty: 'hard' as const,
    },
    {
      id: 'behavior',
      name: '行为验证码',
      description: '基于用户行为分析的验证码',
      color: '#0FC6C2',
      difficulty: 'medium' as const,
    },
    {
      id: 'text',
      name: '图文识别验证码',
      description: '需要识别图片内容的验证码',
      color: '#9254DE',
      difficulty: 'hard' as const,
    },
    {
      id: 'audio',
      name: '语音验证码',
      description: '需要听音频并输入验证码的验证码',
      color: '#477DFF',
      difficulty: 'medium' as const,
    },
    {
      id: 'sms',
      name: '短信验证码',
      description: '需要手机短信接收验证码',
      color: '#FF7D00',
      difficulty: 'easy' as const,
    },
    {
      id: 'math',
      name: '数学运算验证码',
      description: '需要计算数学表达式的验证码',
      color: '#00B42A',
      difficulty: 'easy' as const,
    },
  ]

  const features = [
    {
      icon: Shield,
      title: '安全可靠',
      description: '支持各种类型的验证码，确保系统安全',
    },
    {
      icon: Code,
      title: '易于集成',
      description: '提供简单的API接口，方便集成到各种系统',
    },
    {
      icon: Zap,
      title: '高效处理',
      description: '快速处理验证码，提高用户体验',
    },
    {
      icon: CheckCircle,
      title: '准确率高',
      description: '采用先进的识别技术，准确率达到99.9%',
    },
  ]

  return (
    <div>
      <section className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">验证码展示平台</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            展示和测试各种类型的验证码，为验证码自动处理技能提供可视化界面
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {captchaTypes.map((captcha) => (
            <CaptchaCard
              key={captcha.id}
              id={captcha.id}
              name={captcha.name}
              description={captcha.description}
              color={captcha.color}
              difficulty={captcha.difficulty}
            />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">核心功能</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            验证码自动处理技能提供多种功能，满足不同场景的需求
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-primary/5 rounded-xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">开始使用</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            选择一个验证码类型，测试自动处理功能，或查看API文档了解如何集成到你的项目中
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/api" className="btn btn-primary">
              查看API文档
            </a>
            <a href="/captcha/image" className="btn btn-secondary">
              测试验证码处理
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home