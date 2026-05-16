import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard',  label: 'Home',          Icon: HomeIcon },
  { to: '/plan',       label: 'Daily Plan',    Icon: PlanIcon },
  { to: '/checkin',    label: 'Check In',      Icon: CheckIcon },
  { to: '/doctors',    label: '7 Doctors',     Icon: DoctorsIcon },
  { to: '/alerts',     label: 'Alerts',        Icon: BellIcon },
  { to: '/meals',      label: 'Meals',         Icon: MealsIcon },
  { to: '/sleep',      label: 'Sleep',         Icon: SleepIcon },
  { to: '/no-score',   label: 'Nitric Oxide',  Icon: NOIcon },
  { to: '/biohacking', label: 'Biohacking',    Icon: BiohackIcon },
  { to: '/profile',    label: 'Profile',       Icon: ProfileIcon },
]

export default function Sidebar() {
  return (
    <aside className="app-sidebar" style={{
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'var(--color-forest-deep)',
      borderRight: '1px solid rgba(168,188,114,0.12)',
      flexDirection: 'column',
      zIndex: 50,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(168,188,114,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 32,
            fontWeight: 600, color: 'var(--color-spring-leaf)',
            letterSpacing: '-0.02em',
          }}>7</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 16,
            fontStyle: 'italic', fontWeight: 400,
            color: 'var(--color-sage-glow)',
          }}>ND</span>
        </div>
        <p style={{
          fontSize: 10, color: 'var(--color-sage-glow)',
          fontFamily: 'var(--font-sans)', letterSpacing: '0.12em',
          marginTop: 2, opacity: 0.7,
        }}>
          Seven Natural Doctors
        </p>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 12px' }}>
        {navItems.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10,
                background: isActive ? 'rgba(168,188,114,0.15)' : 'transparent',
                transition: 'background var(--duration-micro)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(168,188,114,0.07)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon active={isActive} />
                <span style={{
                  fontSize: 13, fontFamily: 'var(--font-sans)', fontWeight: isActive ? 500 : 400,
                  color: isActive ? 'var(--color-spring-leaf)' : 'var(--color-sage-glow)',
                  opacity: isActive ? 1 : 0.7,
                  transition: 'color var(--duration-micro)',
                }}>
                  {label}
                </span>
                {isActive && (
                  <div style={{
                    marginLeft: 'auto', width: 4, height: 4,
                    borderRadius: '50%', background: 'var(--color-sage-glow)',
                  }} />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid rgba(168,188,114,0.1)',
      }}>
        <p style={{ fontSize: 10, color: 'var(--color-sage-glow)', opacity: 0.4, fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}>
          Align with your nature
        </p>
      </div>
    </aside>
  )
}

// ── Icons ────────────────────────────────────────────────────────────────────
const ic = (active) => ({
  color: active ? 'var(--color-spring-leaf)' : 'var(--color-sage-glow)',
  opacity: active ? 1 : 0.65,
  flexShrink: 0,
})

function HomeIcon({ active }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={ic(active)}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
}
function PlanIcon({ active }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={ic(active)}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth="2"/></svg>
}
function CheckIcon({ active }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={ic(active)}><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
}
function DoctorsIcon({ active }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={ic(active)}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
}
function BellIcon({ active }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={ic(active)}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
}
function MealsIcon({ active }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={ic(active)}><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/></svg>
}
function SleepIcon({ active }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={ic(active)}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
}
function NOIcon({ active }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={ic(active)}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
}
function BiohackIcon({ active }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={ic(active)}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
}
function ProfileIcon({ active }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={ic(active)}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7"/></svg>
}