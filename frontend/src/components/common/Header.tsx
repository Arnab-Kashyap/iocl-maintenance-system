// src/components/common/Header.tsx

import { Bell, Search, User, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// ── Read logged-in user from localStorage ─────────────────────────────────────

interface StoredUser {
  name: string;
  role: string;
}

function getUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const ROLE_CONFIG: Record<string, { title: string; subtitle: string; displayRole: string }> = {
  admin: {
    title: "Admin Dashboard",
    subtitle: "Welcome back, monitor your systems",
    displayRole: "Administrator",
  },
  technician: {
    title: "Technician Dashboard",
    subtitle: "View and manage your assigned maintenance tasks",
    displayRole: "Technician",
  },
};

function getRoleConfig(role: string) {
  return ROLE_CONFIG[role] ?? { title: "Dashboard", subtitle: "Welcome back", displayRole: role };
}

// ── Component ─────────────────────────────────────────────────────────────────

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()

  // CHANGE 1: read user + config dynamically
  const user = getUser()
  const config = getRoleConfig(user?.role ?? "")

  // CHANGE 2: logout clears localStorage and redirects
  function handleLogout() {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.href = "/"  // hard redirect — clears React state + route cache
  }

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Left Section - Title & Search */}
        <div className="flex items-center space-x-6 flex-1">
          <div>
            {/* CHANGE 3: dynamic title + subtitle */}
            <h2 className="text-2xl font-bold text-gray-800">{config.title}</h2>
            <p className="text-sm text-gray-500">{config.subtitle}</p>
          </div>
          
          {/* Search Bar — unchanged */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-4 py-2 w-96 border border-gray-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search pumps, maintenance records..."
              className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 flex-1"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications — unchanged */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">Pump B requires maintenance</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">Pressure alert on Sector 5</p>
                    <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings — unchanged */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* Divider — unchanged */}
          <div className="w-px h-8 bg-gray-200"></div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              {/* CHANGE 4: dynamic name + role label */}
              <p className="text-sm font-semibold text-gray-800">{user?.name ?? "User"}</p>
              <p className="text-xs text-gray-500">{config.displayRole}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Logout Button — now calls handleLogout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header