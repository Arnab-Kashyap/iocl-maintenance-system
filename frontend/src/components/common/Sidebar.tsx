import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Gauge, Wrench, FileText, ChevronRight } from "lucide-react"

// ✅ FIXED: Read role correctly
function getUserRole(): string {
  return localStorage.getItem("role") ?? ""
}

// Admin Nav
const adminNavItems = [
  { path: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { path: "/pumps",       label: "Pumps",       icon: Gauge           },
  { path: "/maintenance", label: "Maintenance", icon: Wrench          },
  { path: "/reports",     label: "Reports",     icon: FileText        },
]

// Technician Nav
const technicianNavItems = [
  { path: "/technician-dashboard", label: "Dashboard", icon: LayoutDashboard },
]

const Sidebar = () => {
  const location = useLocation()
  const role = getUserRole()

  const navItems =
    role === "technician" ? technicianNavItems : adminNavItems

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white min-h-screen flex flex-col shadow-xl">

      {/* ── Logo Section (UNCHANGED) ── */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            src="/src/assets/logo.png"
            alt="IOCL Logo"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-white">IOCL System</h1>
            <p className="text-xs text-gray-400">Maintenance Portal</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                ${active
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              {active && <ChevronRight className="w-4 h-4 text-white" />}
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom Section (UNCHANGED) ── */}
      <div className="p-6 border-t border-gray-700">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">System Status</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-white">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar