// src/pages/PumpDetail.tsx

import TimelineCard from "../components/dashboard/TimelineCard"
import type { TimelineCardProps } from "../components/dashboard/TimelineCard"
import { useParams } from "react-router-dom"

const PumpDetail = () => {
  const { id } = useParams()  // URL param
  const pumpName = id || "Pump A"

  // Sample pump info
  const pump = {
    name: pumpName,
    status: "Active",
    location: "Sector 5",
  }

  // Sample timeline
  const timeline: TimelineCardProps[] = [
    { date: "2025-12-01", action: "Oil Change", status: "Completed" },
    { date: "2025-12-10", action: "Filter Replacement", status: "Pending" },
  ]

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">{pump.name} Details</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p><strong>Status:</strong> {pump.status}</p>
        <p><strong>Location:</strong> {pump.location}</p>
      </div>

      <h3 className="text-xl font-semibold mb-2">Maintenance Timeline</h3>
      <div className="space-y-2">
        {timeline.map((item, index) => (
          <TimelineCard key={index} {...item} />
        ))}
      </div>
    </div>
  )
}

export default PumpDetail
