// src/components/dashboard/TimelineCard.tsx

export interface TimelineCardProps {
  date: string
  action: string
  status: "Completed" | "Pending"
}

const TimelineCard = ({ date, action, status }: TimelineCardProps) => {
  const statusColor = status === "Completed" ? "text-green-600" : "text-yellow-600"

  return (
    <div className="p-4 bg-white rounded shadow flex justify-between items-center">
      <span>{date}</span>
      <span>{action}</span>
      <span className={`font-bold ${statusColor}`}>{status}</span>
    </div>
  )
}

export default TimelineCard
