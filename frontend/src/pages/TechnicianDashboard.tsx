import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Priority = "High" | "Medium" | "Low";
type TaskStatus = "Pending" | "In Progress" | "Completed";

interface Task {
  id: string;
  pump: string;
  location: string;
  issue: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const initialTasks: Task[] = [
  {
    id: "#TK-001",
    pump: "Pump B",
    location: "Sector 3",
    issue: "Bearing overheating – lubrication failure detected",
    priority: "High",
    status: "In Progress",
    dueDate: "2025-12-31",
  },
  {
    id: "#TK-002",
    pump: "Pump C",
    location: "Sector 5",
    issue: "Pump shutdown – power relay fault",
    priority: "High",
    status: "Pending",
    dueDate: "2026-01-03",
  },
  {
    id: "#TK-003",
    pump: "Pump A",
    location: "Sector 1",
    issue: "Pressure gauge calibration required",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-01-07",
  },
  {
    id: "#TK-004",
    pump: "Pump D",
    location: "Sector 2",
    issue: "Seal replacement and pressure test",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-01-05",
  },
  {
    id: "#TK-005",
    pump: "Pump B",
    location: "Sector 3",
    issue: "Vibration sensor replacement",
    priority: "Low",
    status: "Pending",
    dueDate: "2026-01-10",
  },
  {
    id: "#TK-006",
    pump: "Pump A",
    location: "Sector 1",
    issue: "Routine quarterly inspection completed",
    priority: "Low",
    status: "Completed",
    dueDate: "2025-12-28",
  },
];

// ── Helper: style maps ────────────────────────────────────────────────────────

const priorityStyles: Record<Priority, string> = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-yellow-50 text-yellow-600",
  Low: "bg-green-50 text-green-700",
};

const priorityDot: Record<Priority, string> = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

const statusStyles: Record<TaskStatus, string> = {
  Pending: "border-yellow-400 text-yellow-600",
  "In Progress": "border-blue-400 text-blue-600",
  Completed: "border-green-400 text-green-600",
};

const filterOptions: Array<"All" | TaskStatus> = [
  "All",
  "Pending",
  "In Progress",
  "Completed",
];

// ── Summary Card ──────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  count: number;
  pct: number;
  colorClass: string;
  ringColor: string;
  iconPath: React.ReactNode;
  change?: string;
  changeType?: "up" | "neutral" | "down";
}

function SummaryCard({
  label,
  count,
  pct,
  colorClass,
  ringColor,
  iconPath,
  change,
  changeType = "neutral",
}: SummaryCardProps) {
  const changeColor =
    changeType === "up"
      ? "text-green-500"
      : changeType === "down"
      ? "text-red-500"
      : "text-gray-400";

  const circumference = 2 * Math.PI * 26; // r=26
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 ${colorClass} p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          {label}
        </span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass.replace(
            "border-t-4",
            ""
          )} bg-opacity-10`}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            {iconPath}
          </svg>
        </div>
      </div>

      {/* Body */}
      <div className="flex items-center justify-between">
        <div>
          <div className={`font-bold text-4xl leading-none ${colorClass.split(" ")[1] ?? "text-gray-800"}`}>
            {count}
          </div>
          {change && (
            <p className={`text-xs mt-2 ${changeColor}`}>{change}</p>
          )}
        </div>

        {/* Donut */}
        <div className="relative w-16 h-16">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            className="-rotate-90"
          >
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke={ringColor}
              strokeWidth="8"
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

      {/* Progress bar */}
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
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeFilter, setActiveFilter] = useState<"All" | TaskStatus>("All");

  // Derived counts
  const total = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;

  const filteredTasks =
    activeFilter === "All"
      ? tasks
      : tasks.filter((t) => t.status === activeFilter);

  function handleStatusChange(id: string, newStatus: TaskStatus) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  }

  return (
    <div className="space-y-6">

        {/* ── Page Header ── */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Technician Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            View and manage your assigned maintenance tasks
          </p>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <SummaryCard
            label="Total Assigned"
            count={total}
            pct={100}
            colorClass="border-t-blue-500 text-blue-600"
            ringColor="#3b82f6"
            change="— No change"
            changeType="neutral"
            iconPath={
              <>
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </>
            }
          />
          <SummaryCard
            label="In Progress"
            count={inProgress}
            pct={Math.round((inProgress / total) * 100)}
            colorClass="border-t-green-500 text-green-600"
            ringColor="#22c55e"
            change="↑ +1 today"
            changeType="up"
            iconPath={
              <>
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </>
            }
          />
          <SummaryCard
            label="Pending"
            count={pending}
            pct={Math.round((pending / total) * 100)}
            colorClass="border-t-yellow-500 text-yellow-600"
            ringColor="#f59e0b"
            change="— No change"
            changeType="neutral"
            iconPath={
              <>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </>
            }
          />
          <SummaryCard
            label="Completed"
            count={completed}
            pct={Math.round((completed / total) * 100)}
            colorClass="border-t-purple-500 text-purple-600"
            ringColor="#8b5cf6"
            change="↑ +1 this week"
            changeType="up"
            iconPath={
              <>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </>
            }
          />
        </div>

        {/* ── Task List ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                My Assigned Tasks
              </h2>
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {["Task ID", "Pump", "Issue Description", "Priority", "Due Date", "Status", "Action"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-sm text-gray-400"
                    >
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
                        {task.id}
                      </td>

                      {/* Pump */}
                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold text-gray-800">
                          {task.pump}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {task.location}
                        </div>
                      </td>

                      {/* Issue */}
                      <td className="px-5 py-4 text-sm text-gray-700 max-w-xs">
                        {task.issue}
                      </td>

                      {/* Priority */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyles[task.priority]}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${priorityDot[task.priority]}`}
                          />
                          {task.priority}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {task.dueDate}
                      </td>

                      {/* Status select */}
                      <td className="px-5 py-4">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(
                              task.id,
                              e.target.value as TaskStatus
                            )
                          }
                          className={`appearance-none px-3 py-1.5 pr-7 rounded-lg border text-sm font-medium bg-white outline-none cursor-pointer focus:ring-2 focus:ring-orange-300 transition-all ${statusStyles[task.status]}`}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 8px center",
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <button className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-500 hover:text-white transition-all duration-150">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

    </div>
  );
}