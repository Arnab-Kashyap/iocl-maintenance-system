// src/layouts/DashboardLayout.tsx

import { Outlet } from "react-router-dom"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import Sidebar from "../components/common/Sidebar"

const DashboardLayout = () => {
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
    </div>
  )
}

export default DashboardLayout