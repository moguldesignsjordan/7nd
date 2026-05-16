import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Home',     Icon: HomeIcon },
  { to: '/plan',      label: 'Plan',     Icon: PlanIcon },
  { to: '/checkin',   label: 'Check In', Icon: CheckIcon },
  { to: '/doctors',   label: 'Doctors',  Icon: DoctorsIcon },
  { to: '/profile',   label: 'Profile',  Icon: ProfileIcon },
]

export default function BottomNav() {
  return (
    <nav className="app-bottom-nav" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--color-forest-deep)',
      borderTop: '1px solid rgba(168,188,114,0.12)',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 0 10px',
      zIndex: 100,
    }}>
      {navItems.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, padding: '2px 16px',
            }}>
              <Icon active={isActive} />
              <span style={{
                fontSize: 10, fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                color: isActive ? 'var(--color-spring-leaf)' : 'var(--color-sage-glow)',
                opacity: isActive ? 1 : 0.55,
              }}>
                {label}
              </span>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

const ic = (active) => ({
  color: active ? 'var(--color-spring-leaf)' : 'var(--color-sage-glow)',
  opacity: active ? 1 : 0.55,
})

function HomeIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={ic(active)}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
}
function PlanIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={ic(active)}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01" strokeWidth="2"/></svg>
}
function CheckIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={ic(active)}><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
}
function DoctorsIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={ic(active)}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
}
function ProfileIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={ic(active)}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7"/></svg>
}