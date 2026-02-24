// src/pages/Maintenance.tsx
import { useEffect, useState } from "react";

interface Pump {
  id: number;
  name: string;
  last_maintenance_date: string | null;
  status: string;
}

const Maintenance = () => {
  const [maintenancePumps, setMaintenancePumps] = useState<Pump[]>([]);

  useEffect(() => {
    // Fetch all pumps from backend
    fetch("http://localhost:8000/pumps", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then((data: Pump[]) => {
        // Only pumps that need maintenance
        const pending = data.filter(p => p.status !== "working");
        setMaintenancePumps(pending);
      })
      .catch(err => {
        console.error(err);
        setMaintenancePumps([]);
      });
  }, []);

  const handleMaintain = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/pumps/${id}/maintain`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Remove pump from list after marking maintenance
      setMaintenancePumps(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Maintenance Schedule</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Pump</th>
              <th className="p-3">Last Maintenance</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {maintenancePumps.length > 0 ? (
              maintenancePumps.map(pump => (
                <tr key={pump.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{pump.name}</td>
                  <td className="p-3">
                    {pump.last_maintenance_date
                      ? new Date(pump.last_maintenance_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td
                    className={`p-3 font-semibold ${
                      pump.status === "working" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {pump.status}
                  </td>
                  <td className="p-3">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleMaintain(pump.id)}
                    >
                      Mark Maintained
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-3 text-center">
                  No maintenance tasks pending
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Maintenance;