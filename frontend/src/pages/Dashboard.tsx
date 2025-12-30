// src/pages/Dashboard.tsx

import { Activity, AlertTriangle, Power, Gauge } from "lucide-react"
import PumpCard from "../components/dashboard/PumpCard"

const Dashboard = () => {
  const pumps = [
    { name: "Pump A", status: "Active", location: "Sector 1", lastService: "2025-12-01", pressure: "120 PSI" },
    { name: "Pump B", status: "Maintenance", location: "Sector 3", lastService: "2025-11-20", pressure: "—" },
    { name: "Pump C", status: "Offline", location: "Sector 5", lastService: "2025-10-15", pressure: "—" },
    { name: "Pump D", status: "Active", location: "Sector 2", lastService: "2025-12-10", pressure: "110 PSI" },
  ]

  const total = pumps.length
  const active = pumps.filter(p => p.status === "Active").length
  const maintenance = pumps.filter(p => p.status === "Maintenance").length
  const offline = pumps.filter(p => p.status === "Offline").length

  const stats = [
    { title: "Total Pumps", value: total, icon: Gauge, color: "from-blue-500 to-blue-600", textColor: "text-blue-600", bgColor: "bg-blue-50", percentage: 100, trend: "stable" as const },
    { title: "Active Pumps", value: active, icon: Activity, color: "from-green-500 to-green-600", textColor: "text-green-600", bgColor: "bg-green-50", percentage: 85, trend: "up" as const },
    { title: "Under Maintenance", value: maintenance, icon: AlertTriangle, color: "from-amber-500 to-amber-600", textColor: "text-amber-600", bgColor: "bg-amber-50", percentage: 45, trend: "stable" as const },
    { title: "Offline Pumps", value: offline, icon: Power, color: "from-red-500 to-red-600", textColor: "text-red-600", bgColor: "bg-red-50", percentage: 25, trend: "down" as const },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-200"
      case "Maintenance": return "bg-amber-100 text-amber-800 border-amber-200"
      case "Offline": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <PumpCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              color={stat.color}
              percentage={stat.percentage}
              trend={stat.trend}
              icon={<Icon className={`w-6 h-6 ${stat.textColor}`} />}
            />
          )
        })}
      </div>

      {/* Pump Details Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Pump Details</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor all pump operations in real-time</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pumps.map(pump => (
              <div 
                key={pump.name} 
                className="group bg-gradient-to-br from-gray-50 to-white p-5 border border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                    {pump.name}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(pump.status)}`}>
                    {pump.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium text-gray-700">{pump.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Last Service:</span>
                    <span className="font-medium text-gray-700">{pump.lastService}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-500">Pressure:</span>
                    <span className={`font-bold ${pump.pressure === "—" ? "text-gray-400" : "text-blue-600"}`}>
                      {pump.pressure}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard