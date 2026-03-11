// src/layouts/DashboardLayout.tsx

import { Outlet, useNavigate } from "react-router-dom"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import Sidebar from "../components/common/Sidebar"

const DashboardLayout = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>

      {/* Floating ML Prediction Button */}
      <button
        onClick={() => navigate("/prediction")}
        title="ML Failure Prediction"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-150"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>
    </div>
  )
}

export default DashboardLayout