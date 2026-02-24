// src/pages/Reports.tsx
import { useEffect, useState } from "react";

interface Pump {
  id: number;
  name: string;
  status: string;
  last_maintenance_date: string | null;
}

const Reports = () => {
  const [pumps, setPumps] = useState<Pump[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/pumps", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then((data: Pump[]) => setPumps(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  // Calculate stats dynamically
  const totalPumps = pumps.length;
  const activePumps = pumps.filter(p => p.status === "Active" || p.status === "working").length;
  const underMaintenance = pumps.filter(p => p.status === "Inactive" || p.status !== "working").length;
  const offlinePumps = pumps.filter(p => p.status === "Offline").length;

  const reportSummary = [
    { metric: "Total Pumps", value: totalPumps },
    { metric: "Active Pumps", value: activePumps },
    { metric: "Pumps Under Maintenance", value: underMaintenance },
    { metric: "Offline Pumps", value: offlinePumps },
  ];

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
  );
};

export default Reports;