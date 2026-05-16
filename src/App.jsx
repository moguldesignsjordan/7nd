import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar    from './components/Sidebar'
import BottomNav  from './components/BottomNav'
import Auth         from './pages/Auth'
import Onboarding   from './pages/Onboarding'
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

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth"       element={<PublicRoute><Auth /></PublicRoute>} />
        <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
        <Route path="/*"          element={<PrivateRoute><AppShell /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  )
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
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
      <BottomNav />
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-forest-deep)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 600, color: 'var(--color-spring-leaf)' }}>7</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontStyle: 'italic', color: 'var(--color-sage-glow)' }}>ND</span>
      </div>
      <div style={{
        width: 32, height: 3, borderRadius: 2,
        background: 'var(--color-sage-glow)',
        animation: 'pulse 1.2s ease-in-out infinite',
      }} />
      <style>{`@keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
    </div>
  )
}