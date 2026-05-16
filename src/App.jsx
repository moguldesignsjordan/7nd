import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar    from './components/Sidebar'
import BottomNav  from './components/BottomNav'
import Dashboard    from './pages/Dashboard'
import DailyPlan    from './pages/DailyPlan'
import CheckIn      from './pages/CheckIn'
import Doctors      from './pages/Doctors'
import Alerts       from './pages/Alerts'
import Meals        from './pages/Meals'
import Sleep        from './pages/Sleep'
import NitricOxide  from './pages/NitricOxide'
import Biohacking   from './pages/Biohacking'
import Profile      from './pages/Profile'
import Onboarding   from './pages/Onboarding'

export default function App() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/*" element={<AppShell />} />
    </Routes>
  )
}

function AppShell() {
  return (
    <div className="app-shell">
      {/* Desktop sidebar — hidden on mobile via CSS */}
      <Sidebar />

      {/* Main content */}
      <div className="app-main">
        <Routes>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/plan"       element={<DailyPlan />} />
          <Route path="/checkin"    element={<CheckIn />} />
          <Route path="/doctors"    element={<Doctors />} />
          <Route path="/alerts"     element={<Alerts />} />
          <Route path="/meals"      element={<Meals />} />
          <Route path="/sleep"      element={<Sleep />} />
          <Route path="/no-score"   element={<NitricOxide />} />
          <Route path="/biohacking" element={<Biohacking />} />
          <Route path="/profile"    element={<Profile />} />
        </Routes>
      </div>

      {/* Mobile bottom nav — hidden on desktop via CSS */}
      <BottomNav />
    </div>
  )
}