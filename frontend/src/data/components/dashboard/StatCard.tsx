type StatCardProps = {
  title: string
  value: number | string
  color?: string
}

const StatCard = ({ title, value, color = "text-gray-800" }: StatCardProps) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <p className="text-gray-500">{title}</p>
      <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
    </div>
  )
}

export default StatCard
