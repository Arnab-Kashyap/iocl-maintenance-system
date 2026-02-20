// src/pages/TechnicianDashboard.tsx

import React, { useState } from "react"
import {
  LayoutDashboard,
  Wrench,
  ClipboardList,
  LogOut,
  Bell,
  User,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Gauge,
  Activity,
  MapPin,
  Calendar,
  Zap,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type PumpStatus = "Active" | "Maintenance" | "Offline"
type Priority = "Low" | "Medium" | "High"
type TaskStatus = "Pending" | "In Progress" | "Completed"
type NavItem = "dashboard" | "my-pumps" | "maintenance-tasks"

interface Pump {
  id: string
  name: string
  location: string
  status: PumpStatus
  pressure: string
  lastService: string
}

interface Task {
  id: string
  pumpName: string
  issue: string
  priority: Priority
  status: TaskStatus
}

// ─── Data ────────────────────────────────────────────────────────────────────

const assignedPumps: Pump[] = [
  { id: "1", name: "Pump A", location: "Sector 1", status: "Active",      pressure: "120 PSI", lastService: "2025-12-01" },
  { id: "2", name: "Pump B", location: "Sector 3", status: "Maintenance", pressure: "—",       lastService: "2025-11-20" },
  { id: "3", name: "Pump C", location: "Sector 5", status: "Offline",     pressure: "—",       lastService: "2025-10-15" },
  { id: "4", name: "Pump D", location: "Sector 2", status: "Active",      pressure: "110 PSI", lastService: "2025-12-10" },
]

const initialTasks: Task[] = [
  { id: "t1", pumpName: "Pump B", issue: "Seal replacement required",      priority: "High",   status: "In Progress" },
  { id: "t2", pumpName: "Pump C", issue: "Motor overheating detected",     priority: "High",   status: "Pending"     },
  { id: "t3", pumpName: "Pump A", issue: "Routine lubrication check",      priority: "Low",    status: "Pending"     },
  { id: "t4", pumpName: "Pump D", issue: "Pressure gauge calibration",     priority: "Medium", status: "Completed"   },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusStyles: Record<PumpStatus, string> = {
  Active:      "bg-green-100 text-green-800 border-green-200",
  Maintenance: "bg-amber-100 text-amber-800 border-amber-200",
  Offline:     "bg-red-100  text-red-800  border-red-200",
}

const statusDot: Record<PumpStatus, string> = {
  Active:      "bg-green-500",
  Maintenance: "bg-amber-500",
  Offline:     "bg-red-500",
}

const priorityStyles: Record<Priority, string> = {
  Low:    "bg-gray-100  text-gray-700  border-gray-200",
  Medium: "bg-blue-100  text-blue-700  border-blue-200",
  High:   "bg-red-100   text-red-700   border-red-200",
}

const taskStatusStyles: Record<TaskStatus, string> = {
  Pending:     "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100  text-blue-700",
  Completed:   "bg-green-100 text-green-700",
}

const taskStatusIcon: Record<TaskStatus, React.ReactNode> = {
  Pending:       <Clock className="w-3.5 h-3.5" />,
  "In Progress": <Activity className="w-3.5 h-3.5" />,
  Completed:     <CheckCircle2 className="w-3.5 h-3.5" />,
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SummaryCard = ({
  title, value, icon: Icon, color, textColor, bgColor, sub,
}: {
  title: string; value: number; icon: React.ElementType;
  color: string; textColor: string; bgColor: string; sub: string;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`${bgColor} p-3 rounded-xl`}>
      <Icon className={`w-6 h-6 ${textColor}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500 truncate">{title}</p>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
    <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${color}`} />
  </div>
)

const PumpStatusCard = ({
  pump, onUpdateStatus,
}: {
  pump: Pump; onUpdateStatus: (id: string) => void;
}) => (
  <div className="group bg-gradient-to-br from-gray-50 to-white p-5 border border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-300 transition-all duration-200">
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${statusDot[pump.status]} ring-2 ring-offset-1 ${
          pump.status === "Active" ? "ring-green-200" : pump.status === "Maintenance" ? "ring-amber-200" : "ring-red-200"
        }`} />
        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
          {pump.name}
        </h3>
      </div>
      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusStyles[pump.status]}`}>
        {pump.status}
      </span>
    </div>

    {/* Details */}
    <div className="space-y-2 text-sm mb-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Location</span>
        <span className="font-medium text-gray-700">{pump.location}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Last Service</span>
        <span className="font-medium text-gray-700">{pump.lastService}</span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-gray-400 flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> Pressure</span>
        <span className={`font-bold ${pump.pressure === "—" ? "text-gray-300" : "text-blue-600"}`}>
          {pump.pressure}
        </span>
      </div>
    </div>

    {/* Action */}
    <button
      onClick={() => onUpdateStatus(pump.id)}
      className="w-full py-2 px-4 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-sm font-semibold border border-blue-200 hover:border-blue-600 transition-all duration-200 flex items-center justify-center gap-1.5"
    >
      <Wrench className="w-3.5 h-3.5" />
      Update Status
    </button>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────

const TechnicianDashboard = () => {
  const [activeNav, setActiveNav] = useState<NavItem>("dashboard")
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [pumps, setPumps] = useState<Pump[]>(assignedPumps)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Derived stats
  const activePumps     = pumps.filter(p => p.status === "Active").length
  const activeTasks     = tasks.filter(t => t.status !== "Completed").length
  const pendingMaint    = tasks.filter(t => t.priority === "High" && t.status !== "Completed").length

  const handleMarkComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "Completed" } : t))
  }

  const handleUpdateStatus = (id: string) => {
    // Cycle: Active → Maintenance → Offline → Active
    const cycle: PumpStatus[] = ["Active", "Maintenance", "Offline"]
    setPumps(prev => prev.map(p => {
      if (p.id !== id) return p
      const next = cycle[(cycle.indexOf(p.status) + 1) % cycle.length]
      return { ...p, status: next, pressure: next === "Active" ? "115 PSI" : "—" }
    }))
  }

  const navItems: { id: NavItem; label: string; icon: React.ElementType }[] = [
    { id: "dashboard",         label: "Dashboard",         icon: LayoutDashboard },
    { id: "my-pumps",          label: "My Pumps",          icon: Gauge           },
    { id: "maintenance-tasks", label: "Maintenance Tasks", icon: ClipboardList   },
  ]

  const pageTitle: Record<NavItem, string> = {
    "dashboard":         "Dashboard",
    "my-pumps":          "My Assigned Pumps",
    "maintenance-tasks": "Maintenance Tasks",
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm flex-shrink-0`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-bold text-gray-800 text-sm leading-tight">PumpMonitor</p>
              <p className="text-xs text-blue-500 font-medium">Technician Portal</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeNav === id
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
              {sidebarOpen && activeNav === id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all"
          >
            <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Top Navbar ── */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{pageTitle[activeNav]}</h1>
            <p className="text-xs text-gray-400">Industrial Pump Monitoring System</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200" />

            {/* User */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-700 leading-tight">John Carter</p>
                <p className="text-xs text-gray-400">Technician</p>
              </div>
            </div>

            {/* Logout */}
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 font-medium transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 max-w-7xl mx-auto">

            {/* ── Summary Cards (always visible) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <SummaryCard
                title="Assigned Pumps"
                value={pumps.length}
                icon={Gauge}
                color="from-blue-500 to-blue-700"
                textColor="text-blue-600"
                bgColor="bg-blue-50"
                sub={`${activePumps} currently active`}
              />
              <SummaryCard
                title="Active Tasks"
                value={activeTasks}
                icon={ClipboardList}
                color="from-amber-500 to-amber-600"
                textColor="text-amber-600"
                bgColor="bg-amber-50"
                sub="Requires your attention"
              />
              <SummaryCard
                title="Pending Maintenance"
                value={pendingMaint}
                icon={AlertCircle}
                color="from-red-500 to-red-600"
                textColor="text-red-600"
                bgColor="bg-red-50"
                sub="High-priority issues"
              />
            </div>

            {/* ── My Assigned Pumps ── */}
            {(activeNav === "dashboard" || activeNav === "my-pumps") && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">My Assigned Pumps</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Your current pump assignments</p>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                    {pumps.length} pumps
                  </span>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {pumps.map(pump => (
                      <PumpStatusCard key={pump.id} pump={pump} onUpdateStatus={handleUpdateStatus} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── Maintenance Tasks ── */}
            {(activeNav === "dashboard" || activeNav === "maintenance-tasks") && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Maintenance Tasks</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Track and resolve assigned issues</p>
                  </div>
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                    {tasks.filter(t => t.status !== "Completed").length} open
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {["Pump Name", "Issue Description", "Priority", "Status", "Action"].map(col => (
                          <th key={col} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {tasks.map(task => (
                        <tr key={task.id} className={`hover:bg-gray-50 transition-colors ${task.status === "Completed" ? "opacity-60" : ""}`}>
                          <td className="px-6 py-4 font-semibold text-gray-800">{task.pumpName}</td>
                          <td className="px-6 py-4 text-gray-600 max-w-xs">{task.issue}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityStyles[task.priority]}`}>
                              {task.priority === "High" && <AlertCircle className="w-3 h-3" />}
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${taskStatusStyles[task.status]}`}>
                              {taskStatusIcon[task.status]}
                              {task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {task.status !== "Completed" ? (
                              <button
                                onClick={() => handleMarkComplete(task.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-600 text-green-700 hover:text-white text-xs font-semibold border border-green-200 hover:border-green-600 transition-all duration-200"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Mark Complete
                              </button>
                            ) : (
                              <span className="flex items-center gap-1 text-green-500 text-xs font-medium">
                                <CheckCircle2 className="w-4 h-4" /> Done
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}

export default TechnicianDashboard