import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, Code, Home } from 'lucide-react'

const Navbar: React.FC = () => {
  const location = useLocation()

  const navLinks = [
    { path: '/', label: '首页', icon: Home },
    { path: '/api', label: 'API文档', icon: Code },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-gray-800">验证码展示平台</h1>
          </div>
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link flex items-center space-x-1 ${location.pathname === link.path ? 'active' : ''}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>
          <div className="md:hidden">
            {/* 移动端菜单按钮 */}
            <button className="p-2 rounded-md text-gray-600 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar