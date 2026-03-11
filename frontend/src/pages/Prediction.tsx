import { useState } from "react"

interface PredictionResult {
  failure_prediction: number
  failure_probability: number
  message: string
}

export default function Prediction() {
  const [form, setForm] = useState({
    usage_hours: "",
    temperature: "",
    vibration: "",
    breakdown_count: "",
  })
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/prediction/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          usage_hours: parseFloat(form.usage_hours),
          temperature: parseFloat(form.temperature),
          vibration: parseFloat(form.vibration),
          breakdown_count: parseInt(form.breakdown_count),
        }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data: PredictionResult = await res.json()
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Prediction failed")
    } finally {
      setLoading(false)
    }
  }

  const isHighRisk = result?.failure_prediction === 1
  const pct = result ? Math.round(result.failure_probability * 100) : 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">ML Failure Prediction</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Enter pump sensor data to predict failure risk using AI
        </p>
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── Input Form ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-1">Pump Sensor Input</h2>
          <p className="text-sm text-gray-400 mb-5">Enter the current readings from the pump sensors</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">

              {/* Usage Hours */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Usage Hours
                </label>
                <div className="relative">
                  <input
                    type="number" name="usage_hours" value={form.usage_hours}
                    onChange={handleChange} placeholder="e.g. 1500" required min="0"
                    className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400">hrs</span>
                </div>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Temperature
                </label>
                <div className="relative">
                  <input
                    type="number" name="temperature" value={form.temperature}
                    onChange={handleChange} placeholder="e.g. 75" required min="0"
                    className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400">°C</span>
                </div>
              </div>

              {/* Vibration */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Vibration Level
                </label>
                <div className="relative">
                  <input
                    type="number" name="vibration" value={form.vibration}
                    onChange={handleChange} placeholder="e.g. 4.2" required min="0" step="0.1"
                    className="w-full px-3 py-2.5 pr-14 rounded-lg border border-gray-200 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400">mm/s</span>
                </div>
              </div>

              {/* Breakdown Count */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Prev. Breakdowns
                </label>
                <input
                  type="number" name="breakdown_count" value={form.breakdown_count}
                  onChange={handleChange} placeholder="e.g. 2" required min="0"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-all duration-150"
            >
              {loading ? "Analyzing..." : "Run Prediction"}
            </button>
          </form>
        </div>

        {/* ── Result Panel ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-1">Prediction Result</h2>
          <p className="text-sm text-gray-400 mb-5">AI-powered failure risk assessment</p>

          {/* Empty state */}
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">Enter sensor values and click<br /><strong className="text-gray-600">Run Prediction</strong></p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-10 h-10 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin mb-3" />
              <p className="text-sm text-gray-400">Analyzing pump data...</p>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="space-y-4">

              {/* Risk badge */}
              <div className={`rounded-xl p-4 border-2 ${isHighRisk ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isHighRisk ? "bg-red-100" : "bg-green-100"}`}>
                    {isHighRisk ? (
                      <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${isHighRisk ? "text-red-500" : "text-green-500"}`}>
                      {isHighRisk ? "High Risk" : "Low Risk"}
                    </p>
                    <p className={`text-base font-bold ${isHighRisk ? "text-red-700" : "text-green-700"}`}>
                      {isHighRisk ? "Failure Likely" : "Normal Operation"}
                    </p>
                  </div>
                </div>
                <p className={`text-sm ${isHighRisk ? "text-red-600" : "text-green-600"}`}>
                  {result.message}
                </p>
              </div>

              {/* Probability bar */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600">Failure Probability</span>
                  <span className={`text-xl font-bold ${isHighRisk ? "text-red-600" : "text-green-600"}`}>{pct}%</span>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${pct > 70 ? "bg-red-500" : pct > 40 ? "bg-yellow-500" : "bg-green-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>Low Risk</span>
                  <span>High Risk</span>
                </div>
              </div>

              {/* Input summary */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Input Summary</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Usage Hours", value: `${form.usage_hours} hrs` },
                    { label: "Temperature", value: `${form.temperature}°C` },
                    { label: "Vibration", value: `${form.vibration} mm/s` },
                    { label: "Breakdowns", value: form.breakdown_count },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                      <p className="text-[11px] text-gray-400">{label}</p>
                      <p className="text-sm font-semibold text-gray-700">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}