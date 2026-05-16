import { useNavigate } from 'react-router-dom'
import { DOCTOR_COLORS, READINESS_STATES } from '../lib/brand'
import {
  mockUser, mockEnvironment, mockDoctors,
  mockReadiness, mockNOScore, mockAlerts,
} from '../lib/mockData'

export default function Dashboard() {
  const navigate = useNavigate()
  const readiness = READINESS_STATES[mockReadiness.status]
  const unread = mockAlerts.filter(a => !a.read).length

  return (
    <div style={{ background: 'var(--color-linen)', minHeight: '100vh' }}>
      {/* ── Top header bar ── */}
      <div style={{
        background: 'var(--color-forest-deep)',
        padding: '28px 32px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 90% 0%, rgba(200,217,138,0.07) 0%, transparent 55%)',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>
          <div>
            <p style={{
              fontSize: 10, fontWeight: 500, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--color-sage-glow)',
              fontFamily: 'var(--font-sans)', marginBottom: 6,
            }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400,
              color: 'var(--color-spring-leaf)', lineHeight: 1.2,
            }}>
              Good morning, <em style={{ color: 'var(--color-meadow-mist)' }}>{mockUser.name}</em>
            </h1>
            <p style={{ marginTop: 8, fontSize: 12, fontFamily: 'var(--font-sans)', color: 'var(--color-sage-glow)' }}>
              📍 {mockUser.location} · ☀️ UV {mockEnvironment.uvIndex} · AQI {mockEnvironment.aqi}
            </p>
          </div>
          <button onClick={() => navigate('/alerts')} style={{
            background: 'rgba(200,217,138,0.1)',
            border: '1px solid rgba(200,217,138,0.2)',
            borderRadius: 12, width: 44, height: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-spring-leaf)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            {unread > 0 && (
              <span style={{ position: 'absolute', top: 9, right: 9, width: 7, height: 7, borderRadius: '50%', background: 'var(--readiness-red)' }} />
            )}
          </button>
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 40px' }}>

        {/* Desktop: 2-column layout. Mobile: single column */}
        <div className="dashboard-grid">

          {/* ── LEFT COLUMN ── */}
          <div className="dashboard-left">

            {/* Readiness card */}
            <div className="card fade-up-1" onClick={() => navigate('/doctors')} style={{
              padding: '20px 24px', marginBottom: 16,
              border: `1px solid ${readiness.border}`,
              background: readiness.bg, cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <ReadinessRing score={mockReadiness.score} status={mockReadiness.status} />
                <div style={{ flex: 1 }}>
                  <p className="text-label" style={{ color: readiness.text, marginBottom: 6 }}>Today's Readiness</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, color: readiness.ring, lineHeight: 1 }}>
                      {mockReadiness.score}
                    </span>
                    <ReadinessBadge state={mockReadiness.status} />
                  </div>
                  <p style={{ fontSize: 13, color: readiness.text, lineHeight: 1.5, fontFamily: 'var(--font-sans)' }}>
                    Diet and hydration are pulling you down. Push <em>moderate intensity</em> today.
                  </p>
                </div>
              </div>
            </div>

            {/* Environment strip */}
            <div className="fade-up-2" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'UV Index',    value: mockEnvironment.uvIndex.toFixed(1), emoji: '☀️',  color: 'var(--color-solar-gold)' },
                { label: 'Air Quality', value: mockEnvironment.aqi,                emoji: '🌿',  color: 'var(--color-living-green)' },
                { label: 'Temp',        value: `${mockEnvironment.temp}°F`,        emoji: '🌤️', color: 'var(--color-clay-warm)' },
                { label: 'Daylight',    value: '13h 21m',                          emoji: '🌅',  color: 'var(--color-driftwood)' },
              ].map(item => (
                <div key={item.label} className="card" style={{ flex: 1, padding: '12px 8px', textAlign: 'center' }}>
                  <span style={{ fontSize: 18, display: 'block', marginBottom: 4 }}>{item.emoji}</span>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 15, color: item.color, lineHeight: 1 }}>{item.value}</p>
                  <p style={{ fontSize: 9, color: 'var(--color-driftwood)', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>{item.label}</p>
                </div>
              ))}
            </div>

            {/* 7 Doctors */}
            <SectionHeader title="7 Doctors" action="See all" onAction={() => navigate('/doctors')} />
            <div className="fade-up-3 doctors-grid" style={{ marginTop: 10, marginBottom: 20 }}>
              {mockDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} onClick={() => navigate('/doctors')} />
              ))}
            </div>

            {/* Quick Actions */}
            <SectionHeader title="Quick actions" />
            <div className="fade-up-5" style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              {[
                { label: 'Check In',   emoji: '✅', to: '/checkin', bg: 'var(--color-meadow-mist)',  border: 'var(--color-sage-glow)' },
                { label: 'Log Meal',   emoji: '🥗', to: '/meals',   bg: 'var(--color-morning-sand)', border: 'var(--color-wheat-light)' },
                { label: 'Daily Plan', emoji: '🗓️', to: '/plan',    bg: 'var(--color-parchment)',    border: 'var(--color-warm-stone)' },
                { label: 'Sleep',      emoji: '😴', to: '/sleep',   bg: 'var(--color-parchment)',    border: 'var(--color-warm-stone)' },
              ].map(({ label, emoji, to, bg, border }) => (
                <button key={label} onClick={() => navigate(to)} style={{
                  flex: 1, background: bg, border: `1px solid ${border}`,
                  borderRadius: 14, padding: '14px 6px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 20 }}>{emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-sans)', color: 'var(--color-bark)' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN (desktop only) ── */}
          <div className="dashboard-right">

            {/* NO Score */}
            <SectionHeader title="Nitric Oxide Score" action="Details" onAction={() => navigate('/no-score')} />
            <div className="card fade-up-4" onClick={() => navigate('/no-score')} style={{ padding: '18px 20px', marginTop: 10, marginBottom: 20, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 600, color: 'var(--color-living-green)' }}>
                    {mockNOScore.score}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--color-driftwood)', marginLeft: 4 }}>/100</span>
                </div>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-sans)', fontWeight: 500, color: 'var(--color-living-green)', background: 'var(--color-meadow-mist)', padding: '3px 10px', borderRadius: 20 }}>
                  {mockNOScore.trend}
                </span>
              </div>
              <div style={{ height: 5, background: 'var(--color-warm-stone)', borderRadius: 3, overflow: 'hidden', marginBottom: 14 }}>
                <div style={{ height: '100%', width: `${mockNOScore.score}%`, background: 'linear-gradient(90deg, var(--color-sage-glow), var(--color-living-green))', borderRadius: 3 }} />
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {mockNOScore.contributors.map(c => {
                  const dc = DOCTOR_COLORS[c.id]
                  return (
                    <span key={c.label} style={{
                      fontSize: 11, padding: '3px 9px', borderRadius: 20,
                      fontFamily: 'var(--font-sans)', fontWeight: 500,
                      background: c.impact > 0 ? 'var(--color-meadow-mist)' : 'var(--readiness-red-light)',
                      color: c.impact > 0 ? 'var(--color-living-green)' : 'var(--readiness-red)',
                      border: `1px solid ${c.impact > 0 ? 'var(--color-sage-glow)' : 'var(--readiness-red-border)'}`,
                    }}>
                      {dc?.emoji} {c.impact > 0 ? '+' : ''}{c.impact}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Today's alerts */}
            <SectionHeader title="Alerts" action="See all" onAction={() => navigate('/alerts')} />
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockAlerts.map(alert => (
                <div key={alert.id} className="card" style={{
                  padding: '12px 16px',
                  borderLeft: `3px solid ${alert.urgency === 'high' ? 'var(--readiness-red)' : alert.urgency === 'medium' ? 'var(--color-solar-gold)' : 'var(--color-sage-glow)'}`,
                  opacity: alert.read ? 0.6 : 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-bark)', fontFamily: 'var(--font-sans)', lineHeight: 1.3 }}>
                      {alert.title}
                    </p>
                    <span style={{ fontSize: 10, color: 'var(--color-driftwood)', fontFamily: 'var(--font-sans)', marginLeft: 8, flexShrink: 0 }}>
                      {alert.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Responsive grid styles */}
      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        .dashboard-right { display: none; }

        .doctors-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @media (min-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr 340px;
            gap: 32px;
          }
          .dashboard-right { display: block; }
        }

        @media (min-width: 1280px) {
          .doctors-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
      `}</style>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ReadinessRing({ score, status }) {
  const r = READINESS_STATES[status]
  const radius = 32
  const circ = 2 * Math.PI * radius
  const offset = circ - (score / 100) * circ
  return (
    <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
      <svg width={80} height={80} viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="40" cy="40" r={radius} fill="none" stroke={r.border} strokeWidth="5" />
        <circle cx="40" cy="40" r={radius} fill="none" stroke={r.ring} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.4,0.64,1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: r.ring, lineHeight: 1 }}>{score}</span>
      </div>
    </div>
  )
}

function ReadinessBadge({ state }) {
  const s = READINESS_STATES[state]
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.6)', border: `1px solid ${s.border}` }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.text, fontFamily: 'var(--font-sans)' }}>{s.label}</span>
    </div>
  )
}

function DoctorCard({ doctor, onClick }) {
  const c = DOCTOR_COLORS[doctor.id]
  return (
    <div className="card" onClick={onClick} style={{ padding: '12px', cursor: 'pointer', border: `1px solid ${c.border}`, background: c.bg }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <span style={{ fontSize: 20 }}>{c.emoji}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: c.text }}>{doctor.score}</span>
      </div>
      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-bark)', marginBottom: 5, fontFamily: 'var(--font-sans)' }}>{c.label}</p>
      <div style={{ height: 3, background: 'var(--color-warm-stone)', borderRadius: 2, overflow: 'hidden', marginBottom: 7 }}>
        <div style={{ height: '100%', width: `${doctor.score}%`, background: c.pill, borderRadius: 2 }} />
      </div>
      <p style={{ fontSize: 11, color: 'var(--color-driftwood)', lineHeight: 1.4, fontFamily: 'var(--font-sans)' }}>{doctor.nextAction}</p>
    </div>
  )
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span className="text-label">{title}</span>
      {action && (
        <button onClick={onAction} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--color-living-green)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
          {action} →
        </button>
      )}
    </div>
  )
}