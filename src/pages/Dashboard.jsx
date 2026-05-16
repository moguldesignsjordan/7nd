import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DOCTOR_COLORS, READINESS_STATES } from '../lib/brand'
import {
  mockUser, mockEnvironment, mockDoctors,
  mockReadiness, mockNOScore, mockAlerts,
} from '../lib/mockData'

// ── Animation keyframes injected once ─────────────────────────────────────────
const KEYFRAMES = `
  @keyframes nd-fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes nd-fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes nd-scaleIn  { from { opacity:0; transform:scale(0.86); } to { opacity:1; transform:scale(1); } }
  @keyframes nd-float    { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-5px); } }
  @keyframes nd-pulse    { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(0.94); } }
  @keyframes nd-barGrow  { from { width:0%; } to { width:var(--bar-w,72%); } }
  @keyframes nd-slideLeft  { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes nd-slideRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }

  .nd-nav-item { display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; opacity:0.4; transition:opacity 0.15s ease; }
  .nd-nav-item.active { opacity:1; }
  .nd-nav-item:hover  { opacity:0.72; }
  .nd-nav-item.active .nd-nav-dot { opacity:1 !important; }

  .nd-sidebar-item { display:flex; align-items:center; gap:12px; padding:11px 24px; cursor:pointer; color:#6A7C50; transition:background 0.15s ease, color 0.15s ease, padding-left 0.15s ease; text-decoration:none; }
  .nd-sidebar-item:hover { background:rgba(90,122,40,0.1); color:var(--color-sage-glow); }
  .nd-sidebar-item.active { background:rgba(90,122,40,0.18); color:var(--color-spring-leaf); border-left:3px solid var(--color-living-green); padding-left:21px; }

  .nd-action-btn:hover { background:#EAF3DE !important; border-color:var(--color-sage-glow) !important; transform:translateY(-2px); box-shadow:0 6px 22px rgba(44,42,30,0.1); }
  .nd-action-btn:active { transform:scale(0.97) !important; }
  .nd-env-chip:hover { transform:translateY(-2px); }
  .nd-doc-pill:hover { transform:translateY(-3px) !important; box-shadow:0 8px 20px rgba(44,42,30,0.13) !important; }

  @media (max-width: 899px) { .nd-desktop { display:none !important; } }
  @media (min-width: 900px) { .nd-mobile  { display:none !important; } }

  @media (min-width: 900px) {
    .nd-doctor-grid { grid-template-columns: repeat(4,1fr) !important; gap:10px !important; }
    body { background:#1E2A12; }
  }
  @media (max-width: 899px) {
    .nd-doctor-grid { grid-template-columns: repeat(7,1fr) !important; gap:5px !important; }
  }
`

export default function Dashboard() {
  const navigate = useNavigate()
  const readiness  = READINESS_STATES[mockReadiness.status]
  const unread     = mockAlerts.filter(a => !a.read).length
  const [activeNav, setActiveNav] = useState('home')
  const pillsRef   = useRef(null)
  const dPillsRef  = useRef(null)
  const dScoreRef  = useRef(null)
  const mScoreRef  = useRef(null)
  const noScoreRef = useRef(null)
  const hrvRef     = useRef(null)

  /* Inject keyframes once */
  useEffect(() => {
    if (document.getElementById('nd-keyframes')) return
    const style = document.createElement('style')
    style.id = 'nd-keyframes'
    style.textContent = KEYFRAMES
    document.head.appendChild(style)
  }, [])

  /* Counter animation helper */
  const animateCount = (el, target, delay, duration) => {
    if (!el) return
    const start = performance.now() + delay
    const tick = (ts) => {
      if (ts < start) { requestAnimationFrame(tick); return }
      const p    = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      el.textContent = Math.round(ease * target)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  /* Stagger doctor pills */
  const staggerPills = (container, startDelay) => {
    if (!container) return
    const pills = container.querySelectorAll('.nd-doc-pill')
    pills.forEach((p, i) => {
      p.style.opacity = '0'
      setTimeout(() => {
        p.style.animation = 'nd-fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) forwards'
      }, startDelay + i * 75)
    })
  }

  /* HRV mini-bars (desktop) */
  const buildHRV = (container) => {
    if (!container || container.dataset.built) return
    container.dataset.built = '1'
    const data   = [62,58,71,65,74,70,78]
    const colors = ['#A8BC72','#A8BC72','#C8D98A','#A8BC72','#C8D98A','#A8BC72','#5A7A28']
    const maxVal = Math.max(...data)
    data.forEach((v, i) => {
      const bar = document.createElement('div')
      bar.style.cssText = `flex:1; border-radius:4px 4px 0 0; background:${colors[i]}; height:0%; min-height:6px; transition:height 0.6s cubic-bezier(0.34,1.2,0.64,1); transition-delay:${i * 80}ms;`
      container.appendChild(bar)
      setTimeout(() => { bar.style.height = ((v / maxVal) * 100) + '%' }, 100)
    })
  }

  useEffect(() => {
    animateCount(dScoreRef.current,  mockReadiness.score, 700,  1300)
    animateCount(mScoreRef.current,  mockReadiness.score, 600,  1200)
    animateCount(noScoreRef.current, mockNOScore.score,   1900, 900)
    staggerPills(pillsRef.current,   900)
    staggerPills(dPillsRef.current,  950)
    buildHRV(hrvRef.current)
  }, [])

  const S = styles // shorthand

  return (
    <>
      {/* ═══════ DESKTOP ═══════ */}
      <div className="nd-desktop" style={S.desktopShell}>

        {/* Sidebar */}
        <aside style={S.sidebar}>
          <div style={S.sidebarLogo}>
            <span style={S.logoNum}>7</span>
            <span style={S.logoNd}>ND</span>
          </div>

          <NavLabel>Main</NavLabel>
          <SidebarItem icon="ti-home"          label="Dashboard"  active onClick={() => navigate('/')} />
          <SidebarItem icon="ti-calendar-time" label="Daily Plan" onClick={() => navigate('/plan')} />
          <SidebarItem icon="ti-check-circle"  label="Check In"   onClick={() => navigate('/checkin')} />
          <SidebarItem icon="ti-salad"         label="Meals"      onClick={() => navigate('/meals')} />

          <NavLabel style={{ marginTop: 20 }}>Recovery</NavLabel>
          <SidebarItem icon="ti-moon"  label="Sleep"      onClick={() => navigate('/sleep')} />
          <SidebarItem icon="ti-dna"   label="Biohacking" onClick={() => navigate('/biohacking')} />
          <SidebarItem icon="ti-bell"  label="Alerts"     onClick={() => navigate('/alerts')}
            badge={unread > 0 ? unread : null} />

          <div style={{ flex: 1 }} />

          {/* Week stats */}
          <div style={S.sidebarStats}>
            <p style={S.sidebarStatLabel}>This week</p>
            {[
              { name: 'Avg Readiness', val: '78' },
              { name: 'Green days',    val: '5 / 7' },
              { name: 'NO trend',      val: '↑ +6', gold: true },
            ].map(({ name, val, gold }) => (
              <div key={name} style={S.sidebarStatRow}>
                <span style={S.sidebarStatName}>{name}</span>
                <span style={{ ...S.sidebarStatVal, ...(gold && { color: 'var(--color-solar-gold)' }) }}>{val}</span>
              </div>
            ))}
          </div>

          <SidebarItem icon="ti-user" label="Profile" onClick={() => navigate('/profile')} />
        </aside>

        {/* Main area */}
        <div style={S.mainArea}>

          {/* Top bar */}
          <div style={S.topbar}>
            <p style={S.topbarGreeting}>
              Good morning, <em style={{ fontStyle: 'italic' }}>{mockUser.name}</em>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={S.topbarDate}>
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <div style={S.topbarAvatar}>{mockUser.name?.[0] ?? 'A'}</div>
            </div>
          </div>

          {/* Scrollable content */}
          <div style={S.contentScroll}>

            {/* Alert strip */}
            {unread > 0 && (
              <div style={{ ...S.alertStrip, animation: 'nd-fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s both' }}>
                <i className="ti ti-sun" style={{ fontSize: 16, color: 'var(--color-solar-gold)', flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: '#7A5010', lineHeight: 1.55 }}>
                  <strong>UV window open.</strong> Index at {mockEnvironment.uvIndex} now — peak exposure before 11am adds ~18 pts to your NO score.
                </p>
              </div>
            )}

            {/* Hero */}
            <div style={{ ...S.desktopHero, animation: 'nd-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both' }}>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at 80% 20%, rgba(122,154,58,0.2) 0%, transparent 60%), radial-gradient(ellipse at 20% 90%, rgba(212,168,66,0.1) 0%, transparent 55%)' }} />

              {/* Ring */}
              <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0,
                animation: 'nd-scaleIn 0.7s cubic-bezier(0.34,1.4,0.64,1) 0.3s both' }}>
                <DesktopRing score={mockReadiness.score} status={mockReadiness.status} scoreRef={dScoreRef} />
              </div>

              {/* Hero copy */}
              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A7A40', marginBottom: 10 }}>
                  Today's biological state
                </p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, color: 'var(--color-parchment)', lineHeight: 1.2, marginBottom: 14,
                  animation: 'nd-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.5s both' }}>
                  Your body is<br /><em style={{ color: 'var(--color-spring-leaf)' }}>primed to {readiness.label.toLowerCase()}.</em>
                </h2>
                <p style={{ fontSize: 13, color: '#7A9A50', lineHeight: 1.7, maxWidth: 360,
                  animation: 'nd-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.65s both' }}>
                  {mockReadiness.coachMessage ?? 'HRV recovered overnight, UV conditions are optimal, and your circadian anchor is holding from five consecutive mornings of sun exposure.'}
                </p>
                <div style={{ marginTop: 20, animation: 'nd-fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.8s both' }}>
                  <ReadinessBadgePill state={mockReadiness.status} />
                </div>
              </div>
            </div>

            {/* 3-column grid */}
            <div style={S.desktopGrid}>

              {/* Col 1 — 7 Doctors + HRV */}
              <div style={S.dCard}>
                <SectionHeader title="The Seven Doctors" action="See all" onAction={() => navigate('/doctors')} />
                <div ref={dPillsRef} className="nd-doctor-grid" style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                  {mockDoctors.map(doctor => <DocPill key={doctor.id} doctor={doctor} onClick={() => navigate('/doctors')} desktop />)}
                </div>
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-driftwood)', marginBottom: 10 }}>HRV · 7-day</p>
                  <div ref={hrvRef} style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }} />
                </div>
              </div>

              {/* Col 2 — NO Score + Environment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={S.dCard}>
                  <SectionHeader title="Nitric Oxide Score" action="Details" onAction={() => navigate('/no-score')} />
                  <NOScoreBody noScoreRef={noScoreRef} desktop />
                </div>
                <div style={S.dCard}>
                  <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-driftwood)', marginBottom: 14 }}>
                    Environment · {mockUser.location}
                  </p>
                  <EnvGrid desktop />
                </div>
              </div>

              {/* Col 3 — Coach + Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ ...S.dCard, background: '#EAF3DE', borderColor: 'var(--color-sage-glow)' }}>
                  <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-living-green)', marginBottom: 8 }}>
                    ☀️ Morning Coaching
                  </p>
                  <p style={{ fontSize: 13, color: '#3A5020', lineHeight: 1.68 }}>
                    {mockReadiness.coachMessage ?? 'Strong HRV overnight. Your nervous system recovered well — push your training today. UV peaks at 11am, get outside before noon to lock in your circadian anchor.'}
                  </p>
                </div>
                <div style={S.dCard}>
                  <SectionHeader title="Today's Actions" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14 }}>
                    <ActionBtn emoji="📋" label="Check In"   sub="Morning · 2 min"  delay="0s"   onClick={() => navigate('/checkin')} />
                    <ActionBtn emoji="🗓️" label="Daily Plan" sub="Time-blocked"     delay="0.4s" onClick={() => navigate('/plan')} />
                    <ActionBtn emoji="📸" label="Log Meal"   sub="Photo analysis"   delay="0.8s" onClick={() => navigate('/meals')} />
                    <ActionBtn emoji="🧬" label="Biohacking" sub="Recovery tools"   delay="1.2s" onClick={() => navigate('/biohacking')} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ═══════ MOBILE ═══════ */}
      <div className="nd-mobile" style={{ background: 'var(--color-linen)', minHeight: '100vh', maxWidth: 430, margin: '0 auto', overflowX: 'hidden' }}>

        {/* Header */}
        <div style={{ background: 'var(--color-forest-deep)', padding: '18px 22px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'nd-fadeIn 0.4s ease both' }}>
          <Logo />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6A7C50' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <button onClick={() => navigate('/alerts')} style={{ background: 'rgba(200,217,138,0.1)', border: '1px solid rgba(200,217,138,0.18)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <i className="ti ti-bell" style={{ fontSize: 16, color: 'var(--color-spring-leaf)' }} />
              {unread > 0 && <span style={{ position: 'absolute', top: 7, right: 7, width: 6, height: 6, borderRadius: '50%', background: 'var(--readiness-red)' }} />}
            </button>
          </div>
        </div>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(170deg, var(--color-forest-deep) 0%, #3D5228 100%)', padding: '28px 20px 38px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,154,58,0.16) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <MobileRing score={mockReadiness.score} status={mockReadiness.status} scoreRef={mScoreRef} />
          <div style={{ marginTop: 16, animation: 'nd-fadeUp 0.5s ease 1s both' }}>
            <ReadinessBadgePill state={mockReadiness.status} />
          </div>
        </div>

        {/* Coach card overlapping hero */}
        <div style={{ margin: '-16px 18px 0', position: 'relative', zIndex: 2, animation: 'nd-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.8s both' }}>
          <div style={{ background: '#EAF3DE', border: '1px solid var(--color-sage-glow)', borderRadius: 16, padding: '15px 17px' }}>
            <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-living-green)', marginBottom: 7 }}>
              ☀️ Morning Coaching
            </p>
            <p style={{ fontSize: 13, color: '#3A5020', lineHeight: 1.65 }}>
              {mockReadiness.coachMessage ?? 'Strong HRV overnight. Your nervous system recovered well — push your training today. UV peaks at 11am, get outside before noon.'}
            </p>
          </div>
        </div>

        {/* 7 Doctors */}
        <div style={{ padding: '0 18px', marginTop: 26 }}>
          <SectionHeader title="The Seven Doctors" action="See all" onAction={() => navigate('/doctors')} />
          <div ref={pillsRef} className="nd-doctor-grid" style={{ display: 'grid', marginTop: 12 }}>
            {mockDoctors.map(doctor => <DocPill key={doctor.id} doctor={doctor} onClick={() => navigate('/doctors')} />)}
          </div>
        </div>

        {/* NO Score */}
        <div style={{ padding: '0 18px', marginTop: 22 }}>
          <SectionHeader title="Nitric Oxide Score" action="Details" onAction={() => navigate('/no-score')} />
          <div style={{ marginTop: 12 }}>
            <NOScoreBody noScoreRef={noScoreRef} />
          </div>
        </div>

        {/* Environment */}
        <div style={{ padding: '0 18px', marginTop: 22 }}>
          <p style={{ fontSize: 8.5, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-driftwood)', marginBottom: 11 }}>
            Environment · {mockUser.location}
          </p>
          <EnvGrid />
        </div>

        {/* Quick Actions */}
        <div style={{ padding: '0 18px', marginTop: 20 }}>
          <SectionHeader title="Today's Actions" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginTop: 12, paddingBottom: 100 }}>
            <ActionBtn emoji="📋" label="Check In"   sub="Morning · 2 min"  delay="0s"   onClick={() => navigate('/checkin')} />
            <ActionBtn emoji="🗓️" label="Daily Plan" sub="Time-blocked"     delay="0.4s" onClick={() => navigate('/plan')} />
            <ActionBtn emoji="📸" label="Log Meal"   sub="Photo analysis"   delay="0.8s" onClick={() => navigate('/meals')} />
            <ActionBtn emoji="🧬" label="Biohacking" sub="Recovery tools"   delay="1.2s" onClick={() => navigate('/biohacking')} />
          </div>
        </div>

        {/* Bottom Nav */}
        <nav style={{ background: 'var(--color-forest-deep)', padding: '12px 22px 18px', display: 'flex', justifyContent: 'space-around', position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 430, margin: '0 auto', zIndex: 100, borderTop: '1px solid rgba(90,122,40,0.14)', animation: 'nd-fadeIn 0.4s ease 1s both' }}>
          {[
            { id: 'home',   icon: 'ti-home',          label: 'Home',    to: '/' },
            { id: 'plan',   icon: 'ti-calendar-time', label: 'Plan',    to: '/plan' },
            { id: 'meals',  icon: 'ti-salad',          label: 'Meals',   to: '/meals' },
            { id: 'sleep',  icon: 'ti-moon',           label: 'Sleep',   to: '/sleep' },
            { id: 'profile',icon: 'ti-user',           label: 'Profile', to: '/profile' },
          ].map(({ id, icon, label, to }) => (
            <div key={id} className={`nd-nav-item${activeNav === id ? ' active' : ''}`}
              onClick={() => { setActiveNav(id); navigate(to) }}>
              <i className={`ti ${icon}`} style={{ fontSize: 17, color: activeNav === id ? 'var(--color-sage-glow)' : '#6A7C50', transition: 'color 0.15s' }} />
              <div className="nd-nav-dot" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-living-green)', opacity: 0, transition: 'opacity 0.2s', marginTop: -1 }} />
              <span style={{ fontSize: 8, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-sage-glow)' }}>{label}</span>
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'baseline', gap: 3 }}>
      <span style={{ fontSize: 26, fontWeight: 600, color: 'var(--color-spring-leaf)', lineHeight: 1 }}>7</span>
      <span style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--color-sage-glow)' }}>ND</span>
    </div>
  )
}

function DesktopRing({ score, status, scoreRef }) {
  const r    = READINESS_STATES[status]
  const rad  = 85
  const circ = 2 * Math.PI * rad
  return (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <svg width={200} height={200} viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="100" cy="100" r={rad} fill="none" stroke="rgba(200,217,138,0.1)" strokeWidth="11" />
        <circle cx="100" cy="100" r={rad} fill="none" stroke={r.dot} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ}
          style={{ filter: `drop-shadow(0 0 10px ${r.dot}88)`,
            animation: `nd-ringFill-${status} 1.5s cubic-bezier(0.34,1.2,0.64,1) 0.6s forwards` }}
        />
        <style>{`
          @keyframes nd-ringFill-${status} {
            from { stroke-dashoffset: ${circ}; }
            to   { stroke-dashoffset: ${circ - (score / 100) * circ}; }
          }
        `}</style>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'nd-fadeIn 0.5s ease 1.3s both' }}>
        <span ref={scoreRef} style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 600, color: 'var(--color-spring-leaf)', lineHeight: 1 }}>0</span>
        <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6A7C50', marginTop: 5 }}>Readiness</span>
      </div>
    </div>
  )
}

function MobileRing({ score, status, scoreRef }) {
  const r    = READINESS_STATES[status]
  const rad  = 65
  const circ = 2 * Math.PI * rad
  return (
    <div style={{ position: 'relative', width: 170, height: 170, animation: 'nd-scaleIn 0.7s cubic-bezier(0.34,1.4,0.64,1) 0.2s both' }}>
      <svg width={170} height={170} viewBox="0 0 170 170" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="85" cy="85" r={rad} fill="none" stroke="rgba(200,217,138,0.1)" strokeWidth="9" />
        <circle cx="85" cy="85" r={rad} fill="none" stroke={r.dot} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ}
          style={{ filter: `drop-shadow(0 0 8px ${r.dot}88)`,
            animation: `nd-ringFillM-${status} 1.4s cubic-bezier(0.34,1.2,0.64,1) 0.5s forwards` }}
        />
        <style>{`
          @keyframes nd-ringFillM-${status} {
            from { stroke-dashoffset: ${circ}; }
            to   { stroke-dashoffset: ${circ - (score / 100) * circ}; }
          }
        `}</style>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'nd-fadeIn 0.5s ease 1.1s both' }}>
        <span ref={scoreRef} style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 600, color: 'var(--color-spring-leaf)', lineHeight: 1 }}>0</span>
        <span style={{ fontSize: 8.5, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6A7C50', marginTop: 4 }}>Readiness</span>
      </div>
    </div>
  )
}

function ReadinessBadgePill({ state }) {
  const s = READINESS_STATES[state]
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(168,188,114,0.35)', background: 'rgba(90,122,40,0.16)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, boxShadow: `0 0 0 3px ${s.dot}33`, animation: 'nd-pulse 2.6s ease-in-out 1.5s infinite', display: 'block' }} />
      <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--color-sage-glow)' }}>{s.label}</span>
    </div>
  )
}

function DocPill({ doctor, onClick, desktop }) {
  const c = DOCTOR_COLORS[doctor.id]
  const pad = desktop ? '14px 8px' : '9px 3px'
  return (
    <div className="nd-doc-pill" onClick={onClick}
      style={{ borderRadius: 12, border: `1px solid ${c.border}`, background: c.bg, padding: pad, textAlign: 'center', cursor: 'pointer', opacity: 0, transition: 'transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s ease' }}>
      <span style={{ display: 'block', fontSize: desktop ? 20 : 16, marginBottom: desktop ? 7 : 5 }}>{c.emoji}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, display: 'block', fontSize: desktop ? 16 : 12, color: c.text }}>{doctor.score}</span>
      <span style={{ fontSize: desktop ? 8 : 7, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginTop: desktop ? 3 : 2, color: c.text, opacity: 0.8 }}>{c.label}</span>
    </div>
  )
}

function NOScoreBody({ noScoreRef, desktop }) {
  const barW = `${mockNOScore.score}%`
  return (
    <div style={{ background: '#FFF8E0', border: '1px solid var(--color-wheat-light)', borderRadius: 16, padding: '16px 18px', marginTop: desktop ? 14 : 0, animation: 'nd-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 1.4s both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--color-rich-earth)' }}>Daily NO Score</p>
          <p style={{ fontSize: 10, color: 'var(--color-rich-earth)', marginTop: 2 }}>{mockNOScore.trend}</p>
        </div>
        <span ref={noScoreRef} style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: 'var(--color-solar-gold)', lineHeight: 1 }}>0</span>
      </div>
      <div style={{ height: 8, background: 'rgba(212,168,66,0.14)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ '--bar-w': barW, height: '100%', background: 'linear-gradient(90deg, var(--color-solar-gold), var(--color-wheat-light))', borderRadius: 999, width: 0, animation: 'nd-barGrow 1.3s cubic-bezier(0.34,1.2,0.64,1) 1.8s forwards' }} />
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
        {mockNOScore.contributors.map(c => {
          const dc = DOCTOR_COLORS[c.id]
          return (
            <span key={c.label} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 999, border: '1px solid var(--color-wheat-light)', background: 'rgba(212,168,66,0.14)', color: 'var(--color-rich-earth)' }}>
              {dc?.emoji} {c.label} {c.impact > 0 ? '+' : ''}{c.impact}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function EnvGrid({ desktop }) {
  const items = [
    { label: 'UV Index',    value: mockEnvironment.uvIndex.toFixed(1) },
    { label: 'Air Quality', value: `AQI ${mockEnvironment.aqi}` },
    { label: 'Temp',        value: `${mockEnvironment.temp}°F` },
    { label: 'Sunrise',     value: mockEnvironment.sunrise ?? '6:21' },
  ]
  const cols = desktop ? '1fr 1fr' : 'repeat(4,1fr)'
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: desktop ? 10 : 7, animation: 'nd-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 1.6s both' }}>
      {items.map(({ label, value }) => (
        <div key={label} className="nd-env-chip" style={{ background: 'var(--color-parchment)', border: '1px solid var(--color-warm-stone)', borderRadius: 12, padding: '10px 8px', textAlign: 'center', transition: 'transform 0.18s ease', cursor: 'default' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, color: 'var(--color-bark)', display: 'block' }}>{value}</span>
          <span style={{ fontSize: 8.5, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A7F5C', marginTop: 3, display: 'block' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

function ActionBtn({ emoji, label, sub, delay, onClick }) {
  return (
    <button className="nd-action-btn" onClick={onClick} style={{ background: 'var(--color-parchment)', border: '1px solid var(--color-warm-stone)', borderRadius: 14, padding: '13px 15px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, width: '100%', transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)', animation: `nd-fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${delay} both` }}>
      <span style={{ fontSize: 20, flexShrink: 0, display: 'block', animation: `nd-float 3s ease-in-out ${delay} infinite` }}>{emoji}</span>
      <div>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-bark)', display: 'block' }}>{label}</span>
        <span style={{ fontSize: 10, color: 'var(--color-driftwood)', marginTop: 1 }}>{sub}</span>
      </div>
    </button>
  )
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-driftwood)' }}>{title}</span>
      {action && (
        <button onClick={onAction} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--color-living-green)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
          {action} →
        </button>
      )}
    </div>
  )
}

function NavLabel({ children, style }) {
  return (
    <p style={{ fontSize: 8.5, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4A6030', padding: '0 24px', marginBottom: 6, ...style }}>
      {children}
    </p>
  )
}

function SidebarItem({ icon, label, active, onClick, badge }) {
  return (
    <div className={`nd-sidebar-item${active ? ' active' : ''}`} onClick={onClick}>
      <i className={`ti ${icon}`} style={{ fontSize: 17, flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
      {badge != null && (
        <span style={{ marginLeft: 'auto', background: 'var(--readiness-red)', color: '#fff', fontSize: 10, fontWeight: 500, borderRadius: 999, padding: '1px 6px' }}>{badge}</span>
      )}
    </div>
  )
}

// ── Style objects ──────────────────────────────────────────────────────────────
const styles = {
  desktopShell: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
  },
  sidebar: {
    width: 240,
    flexShrink: 0,
    background: 'var(--color-forest-deep)',
    display: 'flex',
    flexDirection: 'column',
    padding: '28px 0 24px',
    overflowY: 'auto',
    scrollbarWidth: 'none',
    animation: 'nd-slideLeft 0.5s cubic-bezier(0.22,1,0.36,1) both',
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
    padding: '0 24px 32px',
    fontFamily: 'var(--font-display)',
    borderBottom: '1px solid rgba(200,217,138,0.1)',
    marginBottom: 24,
  },
  logoNum:  { fontSize: 30, fontWeight: 600, color: 'var(--color-spring-leaf)' },
  logoNd:   { fontSize: 15, fontStyle: 'italic', color: 'var(--color-sage-glow)' },
  sidebarStats: {
    padding: '16px 20px',
    margin: '16px 16px 0',
    background: 'rgba(90,122,40,0.1)',
    border: '1px solid rgba(168,188,114,0.15)',
    borderRadius: 14,
  },
  sidebarStatLabel: { fontSize: 8.5, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4A6030', marginBottom: 10 },
  sidebarStatRow:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sidebarStatName:  { fontSize: 11, color: '#6A7C50' },
  sidebarStatVal:   { fontSize: 12, fontWeight: 500, color: 'var(--color-sage-glow)' },
  mainArea:   { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'nd-fadeIn 0.4s ease both' },
  topbar:     { background: 'var(--color-linen)', borderBottom: '1px solid var(--color-warm-stone)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, animation: 'nd-fadeIn 0.5s ease 0.1s both' },
  topbarGreeting: { fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--color-bark)' },
  topbarDate:     { fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-driftwood)' },
  topbarAvatar:   { width: 36, height: 36, borderRadius: '50%', background: '#3D5228', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--color-spring-leaf)', cursor: 'pointer' },
  contentScroll:  { flex: 1, overflowY: 'auto', padding: '28px 32px 32px', display: 'flex', flexDirection: 'column', gap: 24 },
  alertStrip:     { background: '#FFF8E0', border: '1px solid var(--color-wheat-light)', borderRadius: 14, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 },
  desktopHero:    { background: 'linear-gradient(135deg, var(--color-forest-deep) 0%, #3D5228 55%, #4A6430 100%)', borderRadius: 24, padding: '36px 40px', display: 'flex', alignItems: 'center', gap: 48, position: 'relative', overflow: 'hidden' },
  desktopGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: 20 },
  dCard:          { background: 'var(--color-parchment)', border: '1px solid var(--color-warm-stone)', borderRadius: 20, padding: '22px 22px' },
}