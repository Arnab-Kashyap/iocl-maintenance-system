// src/components/dashboard/PumpCard.tsx

import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface PumpCardProps {
  title: string
  value: number
  color?: string
  percentage?: number // Add percentage prop for level indicator
  trend?: "up" | "down" | "stable" // Optional trend indicator
  icon?: React.ReactNode
}

const PumpCard = ({ 
  title, 
  value, 
  color = "bg-gray-500", 
  percentage = 75,
  trend = "stable",
  icon
}: PumpCardProps) => {
  
  // Extract gradient colors from the color prop
  const getGradientClass = () => {
    if (color.includes("blue")) return "from-blue-500 to-blue-600"
    if (color.includes("green")) return "from-green-500 to-green-600"
    if (color.includes("yellow") || color.includes("amber")) return "from-amber-500 to-amber-600"
    if (color.includes("red")) return "from-red-500 to-red-600"
    return "from-gray-500 to-gray-600"
  }

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="w-4 h-4" />
    if (trend === "down") return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (trend === "up") return "text-green-500"
    if (trend === "down") return "text-red-500"
    return "text-gray-400"
  }

  const gradient = getGradientClass()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      {/* Top Color Bar */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`}></div>
      
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</h3>
          {icon && (
            <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-10`}>
              {icon}
            </div>
          )}
        </div>

        {/* Value Section */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className={`text-4xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
              {value}
            </p>
            <div className={`flex items-center gap-1 mt-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-xs font-medium">
                {trend === "up" ? "+12%" : trend === "down" ? "-5%" : "No change"}
              </span>
            </div>
          </div>
          
          {/* Circular Progress Indicator */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - percentage / 100)}`}
                className={`${gradient.replace('from-', 'text-').replace(' to-', '').split(' ')[0]} transition-all duration-500`}
                strokeLinecap="round"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-bold ${gradient.replace('from-', 'text-').replace(' to-', '').split(' ')[0]}`}>
                {percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute top-0 right-0 w-2 h-full bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>Capacity</span>
          <span className="font-semibold">{percentage}% Used</span>
        </div>
      </div>
    </div>
  )
}

export default PumpCard