import React from 'react'
import { useNavigate } from 'react-router-dom'
import CaptchaPlaceholder from './CaptchaPlaceholder'

interface CaptchaCardProps {
  id: string
  name: string
  description: string
  color: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const CaptchaCard: React.FC<CaptchaCardProps> = ({ id, name, description, color, difficulty }) => {
  const navigate = useNavigate()

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success/20 text-success'
      case 'medium':
        return 'bg-warning/20 text-warning'
      case 'hard':
        return 'bg-danger/20 text-danger'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getShortName = () => {
    const shortNames: Record<string, string> = {
      '传统图形验证码': 'IMAGE',
      '滑动验证码': 'SLIDER',
      '点选式验证码': 'CLICK',
      '行为验证码': 'BEHAVIOR',
      '图文识别验证码': 'TEXT',
      '语音验证码': 'AUDIO',
    }
    return shortNames[name] || 'CAPTCHA'
  }

  const handleClick = () => {
    navigate(`/captcha/${id}`)
  }

  return (
    <div className="captcha-card" onClick={handleClick}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <CaptchaPlaceholder 
            type={getShortName()}
            text={getShortName()}
            color={color}
            width={128}
            height={128}
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor()}`}>
          {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}
        </span>
      </div>
    </div>
  )
}

export default CaptchaCard