import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  Activity,
} from "lucide-react"
import logo from "../assets/logo.png"

type Role = "admin" | "technician"

const Login = () => {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role>("admin")

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new URLSearchParams()
      formData.append("username", username)
      formData.append("password", password)

      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        alert("Invalid credentials")
        setIsLoading(false)
        return
      }

      // ✅ Optional: Validate selected role matches backend role
      if (data.role.toLowerCase() !== selectedRole.toLowerCase()) {
  alert("You selected wrong role for this account")
  setIsLoading(false)
  return
}


      // Save token & role
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("role", data.role)

      // ✅ Correct routing (matches App.tsx)
      if (data.role === "admin") {
        navigate("/dashboard")
      } else if (data.role === "technician") {
        navigate("/technician-dashboard")
      }

    } catch (error) {
      alert("Login failed")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

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

        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <img
            src={logo}
            alt="IOCL Background"
            className="w-2/3 h-auto object-contain blur-sm"
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center space-x-4 mb-12">
            <img src={logo} alt="IOCL Logo" className="h-16 w-auto object-contain" />
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
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-900">
        <div className="w-full max-w-md">
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
                    className={`py-3 rounded-lg border-2 font-semibold text-sm ${
                      selectedRole === "admin"
                        ? "border-orange-500 bg-orange-500/10 text-orange-400"
                        : "border-gray-600 bg-gray-900 text-gray-400"
                    }`}
                  >
                    Admin
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("technician")}
                    className={`py-3 rounded-lg border-2 font-semibold text-sm ${
                      selectedRole === "technician"
                        ? "border-orange-500 bg-orange-500/10 text-orange-400"
                        : "border-gray-600 bg-gray-900 text-gray-400"
                    }`}
                  >
                    Technician
                  </button>
                </div>
              </div>

              {/* USERNAME */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your ID"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-500"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
