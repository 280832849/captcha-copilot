import React from 'react'
import { Shield, Github, Twitter, Linkedin } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-gray-800">验证码展示平台</span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>© 2026 验证码展示平台. 保留所有权利.</p>
          <p className="mt-2">本平台用于展示和测试各种类型的验证码，为验证码自动处理技能提供可视化界面。</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer