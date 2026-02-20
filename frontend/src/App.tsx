// src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import DashboardLayout from "./layouts/DashboardLayout"
import AdminDashboard from "./pages/AdminDashboard"
import TechnicianDashboard from "./pages/TechnicianDashboard"
import Pumps from "./pages/Pumps"
import Maintenance from "./pages/Maintenance"
import Reports from "./pages/Reports"

function App() {
  return (
    <BrowserRouter>
      <Routes>
    
        <Route path="/" element={<Login />} />

       
        <Route element={<DashboardLayout />}>
         
          <Route path="/dashboard" element={<AdminDashboard />} />

      
          <Route
            path="/technician-dashboard"
            element={<TechnicianDashboard />}
          />


          <Route path="/pumps" element={<Pumps />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
