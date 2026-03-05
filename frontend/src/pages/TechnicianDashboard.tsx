import { useState, useEffect, ReactNode } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type TaskStatus = "Pending" | "In Progress" | "Completed";

interface MaintenanceTask {
  id: number;
  pump_id: string;
  description: string;
  status: TaskStatus;
  due_date: string;
  created_at: string;
}

const TASK_STATUSES: TaskStatus[] = ["Pending", "In Progress", "Completed"];
const filterOptions: Array<"All" | TaskStatus> = ["All", "Pending", "In Progress", "Completed"];

// ── Helper: format ISO date ───────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Status Badge ──────────────────────────────────────────────────────────────

const statusBadgeStyles: Record<TaskStatus, { pill: string; dot: string }> = {
  Pending: {
    pill: "bg-yellow-50 text-yellow-700 border border-yellow-300",
    dot: "bg-yellow-500",
  },
  "In Progress": {
    pill: "bg-blue-50 text-blue-700 border border-blue-300",
    dot: "bg-blue-500",
  },
  Completed: {
    pill: "bg-green-50 text-green-700 border border-green-300",
    dot: "bg-green-500",
  },
};

function StatusBadge({ status }: { status: TaskStatus }) {
  const styles = statusBadgeStyles[status] ?? {
    pill: "bg-gray-100 text-gray-600 border border-gray-300",
    dot: "bg-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {status}
    </span>
  );
}

// ── Status select border colors ───────────────────────────────────────────────

const statusSelectStyles: Record<TaskStatus, string> = {
  Pending: "border-yellow-400 text-yellow-600",
  "In Progress": "border-blue-400 text-blue-600",
  Completed: "border-green-400 text-green-600",
};

// ── Summary Card ──────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  count: number;
  pct: number;
  colorClass: string;
  ringColor: string;
  iconPath: ReactNode;
  change?: string;
  changeType?: "up" | "neutral" | "down";
}

function SummaryCard({
  label, count, pct, colorClass, ringColor, iconPath, change, changeType = "neutral",
}: SummaryCardProps) {
  const changeColor =
    changeType === "up" ? "text-green-500" : changeType === "down" ? "text-red-500" : "text-gray-400";
  const circumference = 2 * Math.PI * 26;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 ${colorClass} p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{label}</span>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            {iconPath}
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-4xl leading-none text-gray-800">{count}</div>
          {change && <p className={`text-xs mt-2 ${changeColor}`}>{change}</p>}
        </div>
        <div className="relative w-16 h-16">
          <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="32" cy="32" r="26" fill="none"
              stroke={ringColor} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-gray-700">
            {pct}%
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: ringColor }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-gray-400">
          <span>Capacity</span>
          <span>{pct}% Used</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TechnicianDashboard() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [activeFilter, setActiveFilter] = useState<"All" | TaskStatus>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // ── Fetch tasks from backend ────────────────────────────────────────────────
  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/maintenance");
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data: MaintenanceTask[] = await res.json();
        setTasks(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  // ── Update task status via backend ─────────────────────────────────────────
  async function handleStatusChange(id: number, newStatus: TaskStatus) {
    setUpdatingId(id);
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    try {
      const res = await fetch(`/api/maintenance/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const updated: MaintenanceTask = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: unknown) {
      console.error(err);
      // Revert on failure — re-fetch to restore truth
      try {
        const res = await fetch("/api/maintenance");
        if (res.ok) setTasks(await res.json());
      } catch {
        // silently ignore re-fetch error
      }
    } finally {
      setUpdatingId(null);
    }
  }

  // ── Derived counts ──────────────────────────────────────────────────────────
  const total = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;

  const filteredTasks: MaintenanceTask[] =
    activeFilter === "All" ? tasks : tasks.filter((t) => t.status === activeFilter);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Technician Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          View and manage your assigned maintenance tasks
        </p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <SummaryCard
          label="Total Assigned" count={total}
          pct={100} colorClass="border-t-blue-500" ringColor="#3b82f6"
          change="— All tasks" changeType="neutral"
          iconPath={<><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>}
        />
        <SummaryCard
          label="In Progress" count={inProgress}
          pct={total ? Math.round((inProgress / total) * 100) : 0}
          colorClass="border-t-green-500" ringColor="#22c55e"
          change="Active tasks" changeType="up"
          iconPath={<><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></>}
        />
        <SummaryCard
          label="Pending" count={pending}
          pct={total ? Math.round((pending / total) * 100) : 0}
          colorClass="border-t-yellow-500" ringColor="#f59e0b"
          change="Awaiting action" changeType="neutral"
          iconPath={<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>}
        />
        <SummaryCard
          label="Completed" count={completed}
          pct={total ? Math.round((completed / total) * 100) : 0}
          colorClass="border-t-purple-500" ringColor="#8b5cf6"
          change="Tasks resolved" changeType="up"
          iconPath={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>}
        />
      </div>

      {/* ── Task List ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">My Assigned Tasks</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Update status for each maintenance task below
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
                  activeFilter === f
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Error states */}
        {loading && (
          <div className="px-6 py-12 text-center text-sm text-gray-400 animate-pulse">
            Loading tasks…
          </div>
        )}
        {!loading && error && (
          <div className="px-6 py-12 text-center text-sm text-red-500">
            ⚠ {error}
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {["Task ID", "Pump ID", "Issue Description", "Due Date", "Status", "Action"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                      No tasks found for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors duration-100"
                    >
                      {/* Task ID */}
                      <td className="px-5 py-4 text-sm font-mono text-gray-500">
                        #{String(task.id).padStart(3, "0")}
                      </td>

                      {/* Pump ID */}
                      <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                        {task.pump_id}
                      </td>

                      {/* Issue / Description */}
                      <td className="px-5 py-4 text-sm text-gray-700 max-w-xs">
                        {task.description}
                      </td>

                      {/* Due Date */}
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(task.due_date)}
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4">
                        <StatusBadge status={task.status} />
                      </td>

                      {/* Action — status selector */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={task.status}
                            disabled={updatingId === task.id}
                            onChange={(e) =>
                              handleStatusChange(task.id, e.target.value as TaskStatus)
                            }
                            className={`appearance-none px-3 py-1.5 pr-7 rounded-lg border text-sm font-medium bg-white outline-none cursor-pointer focus:ring-2 focus:ring-orange-300 transition-all disabled:opacity-50 ${
                              statusSelectStyles[task.status] ?? "border-gray-300 text-gray-600"
                            }`}
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 8px center",
                            }}
                          >
                            {TASK_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>

                          {updatingId === task.id && (
                            <svg
                              className="w-4 h-4 text-orange-400 animate-spin"
                              viewBox="0 0 24 24" fill="none"
                            >
                              <circle cx="12" cy="12" r="10" stroke="#fdba74" strokeWidth="4" />
                              <path d="M22 12a10 10 0 0 0-10-10" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}