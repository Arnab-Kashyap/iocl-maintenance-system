import { useEffect, useState } from "react";

interface Pump {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

const statusStyles: Record<string, { pill: string; dot: string; border: string }> = {
  Active: { pill: "bg-green-50 text-green-700", dot: "bg-green-500", border: "border-t-green-500" },
  "Under Maintenance": { pill: "bg-yellow-50 text-yellow-700", dot: "bg-yellow-500", border: "border-t-yellow-500" },
  Offline: { pill: "bg-red-50 text-red-700", dot: "bg-red-500", border: "border-t-red-500" },
}

function getStatus(status: string) {
  return statusStyles[status] ?? { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400", border: "border-t-gray-400" }
}

const Pumps = () => {
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/pumps/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: Pump[]) => { setPumps(data); setLoading(false); })
      .catch(() => { setPumps([]); setLoading(false); });
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading pumps...</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Pumps</h2>
        <p className="text-sm text-gray-500 mt-0.5">Monitor and manage all pump units</p>
      </div>

      {pumps.length === 0 ? (
        <p className="text-gray-500">No pumps found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pumps.map((pump) => {
            const s = getStatus(pump.status)
            return (
              <div
                key={pump.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 ${s.border} p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {pump.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-1">{pump.name}</h3>
                <p className="text-xs text-gray-400 mb-4">
                  ID: #{String(pump.id).padStart(3, "0")} · Added {new Date(pump.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </p>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button className="flex-1 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-500 hover:text-white transition-all duration-150">
                    Edit
                  </button>
                  <button className="flex-1 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all duration-150">
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default Pumps;