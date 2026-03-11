import { useEffect, useState } from "react";

interface MaintenanceTask {
  id: number;
  pump_id: number;
  description: string;
  status: string;
  due_date: string | null;
  created_at: string | null;
}

interface Pump {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

const Maintenance = () => {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchData = async () => {
    try {
      const [taskRes, pumpRes] = await Promise.all([
        fetch("/api/maintenance/", { headers }),
        fetch("/api/pumps/", { headers }),
      ]);
      const taskData: MaintenanceTask[] = await taskRes.json();
      const pumpData: Pump[] = await pumpRes.json();
      setTasks(taskData);
      setPumps(pumpData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkCompleted = async (taskId: number) => {
    try {
      const res = await fetch(`/api/maintenance/${taskId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: "Completed" }),
      });
      if (!res.ok) throw new Error("Failed to update");
      await fetchData();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const getPumpName = (pumpId: number) => {
    return pumps.find((p) => p.id === pumpId)?.name ?? `Pump #${pumpId}`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const statusStyles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  if (loading) return <p className="p-6 text-gray-500">Loading maintenance schedule...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Maintenance Schedule</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Task ID</th>
              <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Pump</th>
              <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-mono text-sm text-gray-500">
                    #{String(task.id).padStart(3, "0")}
                  </td>
                  <td className="p-4 font-medium text-gray-800">
                    {getPumpName(task.pump_id)}
                  </td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs">
                    {task.description}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {formatDate(task.due_date)}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[task.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {task.status !== "Completed" ? (
                      <button
                        onClick={() => handleMarkCompleted(task.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm transition"
                      >
                        Mark Completed
                      </button>
                    ) : (
                      <span className="text-green-500 text-sm font-semibold">✓ Done</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No maintenance tasks found
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