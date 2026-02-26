// src/pages/Maintenance.tsx
import { useEffect, useState } from "react";

interface Pump {
  id: number;
  name: string;
  last_maintenance_date: string | null;
  status: string;
}

const Maintenance = () => {
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPumps = async () => {
    try {
      const res = await fetch("http://localhost:8000/pumps", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch pumps");
      }

      const data: Pump[] = await res.json();

      // Show ONLY pumps under maintenance
      const pending = data.filter(
        (p) => p.status.toLowerCase() === "under maintenance"
      );

      setPumps(pending);
    } catch (err) {
      console.error("Error fetching pumps:", err);
      setPumps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPumps();
  }, []);

  const handleMaintain = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:8000/pumps/${id}/maintain`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update pump");
      }

      // Remove from UI instantly
      setPumps((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error updating pump:", err);
    }
  };

  if (loading) {
    return <p>Loading maintenance schedule...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Maintenance Schedule
      </h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Pump</th>
              <th className="p-4">Last Maintenance</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {pumps.length > 0 ? (
              pumps.map((pump) => (
                <tr
                  key={pump.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">
                    {pump.name}
                  </td>

                  <td className="p-4">
                    {pump.last_maintenance_date
                      ? new Date(
                          pump.last_maintenance_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                      {pump.status}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleMaintain(pump.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg transition"
                    >
                      Mark Maintained
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-gray-500"
                >
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