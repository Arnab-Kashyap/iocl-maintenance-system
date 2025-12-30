// src/pages/Login.tsx

import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Lock, Mail, Eye, EyeOff, Shield, Activity } from "lucide-react"

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      navigate("/dashboard")
    }, 800)
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Left Side - Branding with Logo Blend */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        {/* Large Blended Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <img 
            src="/src/assets/logo.png" 
            alt="IOCL Background" 
            className="w-2/3 h-auto object-contain blur-sm"
          />
        </div>

        {/* Gradient Overlays for Blend Effect */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gray-900 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-4 mb-12">
            <img 
              src="/src/assets/logo.png" 
              alt="IOCL Logo" 
              className="h-16 w-auto object-contain"
            />
            <div>
              <h1 className="text-4xl font-bold text-white">IOCL</h1>
              <p className="text-gray-400 text-sm">Maintenance System</p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Advanced Pump<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Monitoring System
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-lg">
            Real-time monitoring and maintenance management for industrial pump operations
          </p>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4 group">
              <div className="w-12 h-12 bg-gray-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-gray-700 group-hover:border-orange-500 transition-all">
                <Activity className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Real-Time Monitoring</h3>
                <p className="text-sm text-gray-400">Track all pump operations with live data updates</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 group">
              <div className="w-12 h-12 bg-gray-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-gray-700 group-hover:border-orange-500 transition-all">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Predictive Maintenance</h3>
                <p className="text-sm text-gray-400">AI-powered scheduling and maintenance alerts</p>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <span className="text-sm text-gray-400">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <img 
              src="/src/assets/logo.png" 
              alt="IOCL Logo" 
              className="h-16 w-auto object-contain mb-4"
            />
            <h1 className="text-2xl font-bold text-white">IOCL System</h1>
            <p className="text-gray-400 text-sm">Maintenance Portal</p>
          </div>

          {/* Login Card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400">Sign in to access your dashboard</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Admin ID Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Admin ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your admin ID"
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-orange-500 hover:text-orange-400">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Need help? <a href="#" className="text-orange-500 hover:text-orange-400 font-medium">Contact Support</a>
              </p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-center text-sm text-gray-500 mt-6">
            © 2025 IOCL Maintenance Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login