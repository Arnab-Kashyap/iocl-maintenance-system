import { useEffect, useState } from "react"
import { Activity, AlertTriangle, Power, Gauge } from "lucide-react"
import PumpCard from "../components/dashboard/PumpCard"
import { useNavigate } from "react-router-dom"

interface Pump {
  id: number
  name: string
  status: string
  last_maintenance_date: string | null
}

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [pumps, setPumps] = useState<Pump[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")

    // If no token → redirect to login
    if (!token) {
      navigate("/")
      return
    }

    fetch("http://127.0.0.1:8000/pumps", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized")
        }
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPumps(data)
        } else {
          setPumps([])
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [navigate])

  const total = pumps.length
  const active = pumps.filter((p) => p.status === "Active").length
  const maintenance = pumps.filter((p) => p.status === "Maintenance").length
  const offline = pumps.filter((p) => p.status === "Offline").length

  const stats = [
    {
      title: "Total Pumps",
      value: total,
      icon: Gauge,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      percentage: 100,
      trend: "stable" as const,
    },
    {
      title: "Active Pumps",
      value: active,
      icon: Activity,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
      percentage: total ? Math.round((active / total) * 100) : 0,
      trend: "up" as const,
    },
    {
      title: "Under Maintenance",
      value: maintenance,
      icon: AlertTriangle,
      color: "from-amber-500 to-amber-600",
      textColor: "text-amber-600",
      percentage: total ? Math.round((maintenance / total) * 100) : 0,
      trend: "stable" as const,
    },
    {
      title: "Offline Pumps",
      value: offline,
      icon: Power,
      color: "from-red-500 to-red-600",
      textColor: "text-red-600",
      percentage: total ? Math.round((offline / total) * 100) : 0,
      trend: "down" as const,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Maintenance":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Offline":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return <div className="p-6 text-white">Loading dashboard...</div>
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

      {/* Pump Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Pump Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Monitor all pump operations in real-time
          </p>
        </div>

        <div className="p-6">
          {pumps.length === 0 ? (
            <p className="text-gray-500">No pumps available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pumps.map((pump) => (
                <div
                  key={pump.id}
                  className="group bg-gradient-to-br from-gray-50 to-white p-5 border border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                      {pump.name}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                        pump.status
                      )}`}
                    >
                      {pump.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">
                        Last Maintenance:
                      </span>
                      <span className="font-medium text-gray-700">
                        {pump.last_maintenance_date
                          ? new Date(
                              pump.last_maintenance_date
                            ).toLocaleDateString()
                          : "Not Available"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard