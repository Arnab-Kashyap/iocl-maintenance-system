// src/pages/Reports.tsx

const Reports = () => {
  const reportSummary = [
    { metric: "Total Pumps", value: 12 },
    { metric: "Active Pumps", value: 8 },
    { metric: "Pumps Under Maintenance", value: 3 },
    { metric: "Offline Pumps", value: 1 },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Reports Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportSummary.map((report, idx) => (
          <div key={idx} className="p-6 bg-blue-500 rounded shadow text-white">
            <h3 className="text-sm font-semibold">{report.metric}</h3>
            <p className="text-2xl font-bold mt-2">{report.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Reports
