import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  Activity,
  UserCog,
  Wrench,
} from "lucide-react"
import logo from "../assets/logo.png"

type Role = "admin" | "technician"

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role>("admin")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      // Save role (for future route protection)
      localStorage.setItem("role", selectedRole)
      localStorage.setItem("isAuthenticated", "true")

      // Navigate based on role
      if (selectedRole === "admin") {
        navigate("/admin-dashboard")
      } else {
        navigate("/technician-dashboard")
      }
    }, 800)
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Blurred Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <img
            src={logo}
            alt="IOCL Background"
            className="w-2/3 h-auto object-contain blur-sm"
          />
        </div>

        {/* Gradient Fade */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-gray-900 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gray-900 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          
          <div className="flex items-center space-x-4 mb-12">
            <img
              src={logo}
              alt="IOCL Logo"
              className="h-16 w-auto object-contain"
            />
            <div>
              <h1 className="text-4xl font-bold">IOCL</h1>
              <p className="text-gray-400 text-sm">Maintenance System</p>
            </div>
          </div>

          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Advanced Pump <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Monitoring System
            </span>
          </h2>

          <p className="text-gray-400 text-lg mb-12 max-w-lg">
            Real-time monitoring and maintenance management for industrial pump operations
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
                <Activity className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Real-Time Monitoring</h3>
                <p className="text-sm text-gray-400">
                  Track all pump operations with live data updates
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Predictive Maintenance</h3>
                <p className="text-sm text-gray-400">
                  AI-powered scheduling and maintenance alerts
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">
                All Systems Operational
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-900">
        <div className="w-full max-w-md">

          <div className="lg:hidden flex flex-col items-center mb-8">
            <img
              src={logo}
              alt="IOCL Logo"
              className="h-16 w-auto object-contain mb-4"
            />
            <h1 className="text-2xl font-bold text-white">IOCL System</h1>
            <p className="text-gray-400 text-sm">Maintenance Portal</p>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400">
                Sign in to access your dashboard
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>

              {/* ROLE SELECTOR */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Login As
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("admin")}
                    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-all ${
                      selectedRole === "admin"
                        ? "border-orange-500 bg-orange-500/10 text-orange-400"
                        : "border-gray-600 bg-gray-900 text-gray-400"
                    }`}
                  >
                    <UserCog className="w-4 h-4" />
                    <span>Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("technician")}
                    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-all ${
                      selectedRole === "technician"
                        ? "border-orange-500 bg-orange-500/10 text-orange-400"
                        : "border-gray-600 bg-gray-900 text-gray-400"
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Technician</span>
                  </button>
                </div>
              </div>

              {/* ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  {selectedRole === "admin" ? "Admin ID" : "Technician ID"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder={`Enter your ${
                      selectedRole === "admin" ? "admin" : "technician"
                    } ID`}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {isLoading
                  ? "Signing in..."
                  : `Sign In as ${
                      selectedRole === "admin" ? "Admin" : "Technician"
                    }`}
              </button>

            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            © 2025 IOCL Maintenance Portal
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
