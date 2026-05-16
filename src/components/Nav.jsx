import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Home',     Icon: HomeIcon },
  { to: '/plan',      label: 'Plan',     Icon: PlanIcon },
  { to: '/checkin',   label: 'Check In', Icon: CheckIcon },
  { to: '/doctors',   label: 'Doctors',  Icon: DoctorsIcon },
  { to: '/profile',   label: 'Profile',  Icon: ProfileIcon },
]

export default function Nav() {
  return (
    <nav className="bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      background: 'var(--color-forest-deep)',
      borderTop: '1px solid rgba(168, 188, 114, 0.15)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '10px 0 12px',
      zIndex: 100,
    }}>
      {navItems.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4,
              padding: '4px 14px',
              transition: 'opacity var(--duration-micro) var(--ease-default)',
            }}>
              <Icon active={isActive} />
              <span style={{
                fontSize: 10, fontWeight: 500, letterSpacing: '0.05em',
                fontFamily: 'var(--font-sans)',
                color: isActive ? 'var(--color-spring-leaf)' : 'var(--color-sage-glow)',
                opacity: isActive ? 1 : 0.55,
                transition: 'color var(--duration-micro)',
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

const activeColor  = 'var(--color-spring-leaf)'
const inactiveColor = 'var(--color-sage-glow)'
const iconStyle = (active) => ({
  color: active ? activeColor : inactiveColor,
  opacity: active ? 1 : 0.5,
  transition: 'color var(--duration-micro)',
})

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={iconStyle(active)}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  )
}
function PlanIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      style={iconStyle(active)}>
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth="2"/>
    </svg>
  )
}
function CheckIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={iconStyle(active)}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  )
}
function DoctorsIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      style={iconStyle(active)}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )
}
function ProfileIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      style={iconStyle(active)}>
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7"/>
    </svg>
  )
}