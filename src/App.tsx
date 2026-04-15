import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import CaptchaDetail from './pages/CaptchaDetail'
import ApiDoc from './pages/ApiDoc'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/captcha/:type" element={<CaptchaDetail />} />
            <Route path="/api" element={<ApiDoc />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App