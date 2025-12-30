// src/pages/Maintenance.tsx

const Maintenance = () => {
  const maintenanceData = [
    { pump: "Pump A", action: "Oil Change", date: "2025-12-01", status: "Completed" },
    { pump: "Pump B", action: "Filter Replacement", date: "2025-12-10", status: "Pending" },
    { pump: "Pump C", action: "Valve Check", date: "2025-11-20", status: "Completed" },
    { pump: "Pump D", action: "Pressure Calibration", date: "2025-12-15", status: "Pending" },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Maintenance Schedule</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Pump</th>
              <th className="p-3">Action</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceData.map((item, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{item.pump}</td>
                <td className="p-3">{item.action}</td>
                <td className="p-3">{item.date}</td>
                <td className={`p-3 font-semibold ${item.status === "Completed" ? "text-green-600" : "text-yellow-600"}`}>
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Maintenance
