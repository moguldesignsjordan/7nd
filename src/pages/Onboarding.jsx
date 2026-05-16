import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GOALS = [
  { id: 'performance', emoji: '🏆', label: 'Peak Performance', desc: 'Optimize energy, focus, and output' },
  { id: 'longevity',   emoji: '🌿', label: 'Longevity',        desc: 'Slow aging, protect long-term health' },
  { id: 'recovery',    emoji: '🔄', label: 'Recovery',         desc: 'Heal, reduce inflammation, restore' },
  { id: 'sleep',       emoji: '😴', label: 'Better Sleep',     desc: 'Deep sleep, consistent rhythms' },
]

const WAKE_TIMES  = ['5:00 AM','5:30 AM','6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM']
const BED_TIMES   = ['8:30 PM','9:00 PM','9:30 PM','10:00 PM','10:30 PM','11:00 PM','11:30 PM','12:00 AM']
const CLIMATES    = [
  { id: 'tropical',    emoji: '🌴', label: 'Tropical' },
  { id: 'temperate',   emoji: '🌤️', label: 'Temperate' },
  { id: 'arid',        emoji: '🏜️', label: 'Arid / Desert' },
  { id: 'cold',        emoji: '❄️',  label: 'Cold / Nordic' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    name: '',
    goal: '',
    wake: '6:30 AM',
    bed: '10:30 PM',
    location: '',
    climate: '',
  })

  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)
  const set  = (key, val) => setData(d => ({ ...d, [key]: val }))

  const steps = [
    <StepWelcome    data={data} set={set} onNext={next} />,
    <StepGoal       data={data} set={set} onNext={next} onBack={back} />,
    <StepSleep      data={data} set={set} onNext={next} onBack={back} />,
    <StepLocation   data={data} set={set} onNext={next} onBack={back} />,
    <StepReady      data={data} onFinish={() => navigate('/dashboard')} />,
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-linen)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Progress bar */}
      {step > 0 && step < 4 && (
        <div style={{ padding: '52px 24px 0' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= step
                  ? 'var(--color-living-green)'
                  : 'var(--color-warm-stone)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        </div>
      )}

      <div style={{ flex: 1 }}>
        {steps[step]}
      </div>
    </div>
  )
}

// ── Step 0: Welcome ──────────────────────────────────────────────────────────
function StepWelcome({ data, set, onNext }) {
  return (
    <div style={{ padding: '80px 28px 40px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 56, display: 'block', marginBottom: 24 }}>🌿</span>
        <p className="text-label" style={{ marginBottom: 12 }}>Seven Natural Doctors</p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400,
          color: 'var(--color-forest-deep)', lineHeight: 1.15, marginBottom: 16,
        }}>
          Align with<br /><em>your nature</em>
        </h1>
        <p style={{
          fontSize: 15, color: 'var(--color-driftwood)',
          lineHeight: 1.7, fontFamily: 'var(--font-sans)', marginBottom: 40,
        }}>
          Your health on any given day is a function of your environment — not just your choices. Let's build your biological blueprint.
        </p>

        <label style={{ display: 'block', marginBottom: 8 }}>
          <span className="text-label">Your first name</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Jordan"
          value={data.name}
          onChange={e => set('name', e.target.value)}
          style={{
            width: '100%', padding: '14px 16px',
            background: 'var(--color-parchment)',
            border: '1px solid var(--color-warm-stone)',
            borderRadius: 12, fontSize: 16,
            fontFamily: 'var(--font-sans)',
            color: 'var(--color-bark)',
            outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-living-green)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-warm-stone)'}
        />
      </div>

      <PrimaryButton
        label="Begin →"
        disabled={!data.name.trim()}
        onClick={onNext}
      />
    </div>
  )
}

// ── Step 1: Goal ─────────────────────────────────────────────────────────────
function StepGoal({ data, set, onNext, onBack }) {
  return (
    <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', minHeight: '85vh' }}>
      <BackButton onClick={onBack} />
      <div style={{ flex: 1, paddingTop: 16 }}>
        <p className="text-label" style={{ marginBottom: 10 }}>Step 1 of 3</p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400,
          color: 'var(--color-forest-deep)', lineHeight: 1.2, marginBottom: 8,
        }}>
          What's your primary<br />health goal?
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-driftwood)', marginBottom: 28, lineHeight: 1.6 }}>
          This shapes your daily coaching and readiness priorities.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GOALS.map(g => (
            <button key={g.id} onClick={() => set('goal', g.id)} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px',
              background: data.goal === g.id ? 'var(--color-meadow-mist)' : 'var(--color-parchment)',
              border: `1.5px solid ${data.goal === g.id ? 'var(--color-living-green)' : 'var(--color-warm-stone)'}`,
              borderRadius: 14, cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>{g.emoji}</span>
              <div>
                <p style={{
                  fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-sans)',
                  color: data.goal === g.id ? 'var(--color-forest-deep)' : 'var(--color-bark)',
                  marginBottom: 2,
                }}>
                  {g.label}
                </p>
                <p style={{ fontSize: 12, color: 'var(--color-driftwood)', fontFamily: 'var(--font-sans)' }}>
                  {g.desc}
                </p>
              </div>
              {data.goal === g.id && (
                <span style={{ marginLeft: 'auto', color: 'var(--color-living-green)', fontSize: 18 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <PrimaryButton label="Continue →" disabled={!data.goal} onClick={onNext} />
    </div>
  )
}

// ── Step 2: Sleep Window ─────────────────────────────────────────────────────
function StepSleep({ data, set, onNext, onBack }) {
  return (
    <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', minHeight: '85vh' }}>
      <BackButton onClick={onBack} />
      <div style={{ flex: 1, paddingTop: 16 }}>
        <p className="text-label" style={{ marginBottom: 10 }}>Step 2 of 3</p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400,
          color: 'var(--color-forest-deep)', lineHeight: 1.2, marginBottom: 8,
        }}>
          Set your<br />sleep window
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-driftwood)', marginBottom: 28, lineHeight: 1.6 }}>
          Your circadian schedule is anchored to when you wake. Consistency matters more than duration.
        </p>

        {/* Sleep duration indicator */}
        <div style={{
          background: 'var(--color-meadow-mist)',
          border: '1px solid var(--color-sage-glow)',
          borderRadius: 12, padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24,
        }}>
          <span style={{ fontSize: 13, color: 'var(--color-forest-deep)', fontFamily: 'var(--font-sans)' }}>
            😴 Estimated sleep
          </span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 18,
            color: 'var(--color-living-green)', fontWeight: 600,
          }}>
            {calcSleepHours(data.bed, data.wake)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <p className="text-label" style={{ marginBottom: 8 }}>Bedtime</p>
            <select
              value={data.bed}
              onChange={e => set('bed', e.target.value)}
              style={selectStyle}
            >
              {BED_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <p className="text-label" style={{ marginBottom: 8 }}>Wake time</p>
            <select
              value={data.wake}
              onChange={e => set('wake', e.target.value)}
              style={selectStyle}
            >
              {WAKE_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{
          marginTop: 20, padding: '14px 16px',
          background: 'var(--color-parchment)',
          border: '1px solid var(--color-warm-stone)',
          borderRadius: 12,
        }}>
          <p style={{ fontSize: 12, color: 'var(--color-driftwood)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
            🌅 Your morning sunlight window will be set to <strong style={{ color: 'var(--color-forest-deep)' }}>{data.wake}</strong> — the most important circadian anchor of your day.
          </p>
        </div>
      </div>

      <PrimaryButton label="Continue →" onClick={onNext} />
    </div>
  )
}

// ── Step 3: Location ─────────────────────────────────────────────────────────
function StepLocation({ data, set, onNext, onBack }) {
  return (
    <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', minHeight: '85vh' }}>
      <BackButton onClick={onBack} />
      <div style={{ flex: 1, paddingTop: 16 }}>
        <p className="text-label" style={{ marginBottom: 10 }}>Step 3 of 3</p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400,
          color: 'var(--color-forest-deep)', lineHeight: 1.2, marginBottom: 8,
        }}>
          Where do you live?
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-driftwood)', marginBottom: 24, lineHeight: 1.6 }}>
          Your UV index, air quality, and circadian plan adapt to your local environment every day.
        </p>

        <label style={{ display: 'block', marginBottom: 8 }}>
          <span className="text-label">City</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Miami, FL"
          value={data.location}
          onChange={e => set('location', e.target.value)}
          style={{
            width: '100%', padding: '14px 16px',
            background: 'var(--color-parchment)',
            border: '1px solid var(--color-warm-stone)',
            borderRadius: 12, fontSize: 16,
            fontFamily: 'var(--font-sans)',
            color: 'var(--color-bark)',
            outline: 'none', marginBottom: 24,
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-living-green)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-warm-stone)'}
        />

        <p className="text-label" style={{ marginBottom: 12 }}>Climate type</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {CLIMATES.map(c => (
            <button key={c.id} onClick={() => set('climate', c.id)} style={{
              padding: '14px 10px',
              background: data.climate === c.id ? 'var(--color-meadow-mist)' : 'var(--color-parchment)',
              border: `1.5px solid ${data.climate === c.id ? 'var(--color-living-green)' : 'var(--color-warm-stone)'}`,
              borderRadius: 12, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 24 }}>{c.emoji}</span>
              <span style={{
                fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-sans)',
                color: data.climate === c.id ? 'var(--color-forest-deep)' : 'var(--color-bark)',
              }}>
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <PrimaryButton
        label="Build my plan →"
        disabled={!data.location.trim() || !data.climate}
        onClick={onNext}
      />
    </div>
  )
}

// ── Step 4: Ready ────────────────────────────────────────────────────────────
function StepReady({ data, onFinish }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-forest-deep)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 28px', textAlign: 'center',
    }}>
      <span style={{ fontSize: 60, marginBottom: 24 }}>🌅</span>
      <p className="text-label" style={{ color: 'var(--color-sage-glow)', marginBottom: 12 }}>
        You're all set
      </p>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400,
        color: 'var(--color-spring-leaf)', lineHeight: 1.2, marginBottom: 16,
      }}>
        Welcome, <em>{data.name}</em>
      </h1>
      <p style={{
        fontSize: 14, color: 'var(--color-sage-glow)',
        lineHeight: 1.7, maxWidth: 280, marginBottom: 40,
      }}>
        Your biology is your blueprint. Wake at {data.wake}, move with the sun, eat with the seasons.
      </p>

      {/* Summary pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 48 }}>
        {[
          `🎯 ${GOALS.find(g => g.id === data.goal)?.label}`,
          `⏰ Wake ${data.wake}`,
          `📍 ${data.location}`,
        ].map(pill => (
          <span key={pill} style={{
            padding: '6px 14px',
            background: 'rgba(168,188,114,0.15)',
            border: '1px solid rgba(168,188,114,0.3)',
            borderRadius: 20,
            fontSize: 12, color: 'var(--color-spring-leaf)',
            fontFamily: 'var(--font-sans)',
          }}>
            {pill}
          </span>
        ))}
      </div>

      <button onClick={onFinish} style={{
        width: '100%', maxWidth: 320,
        padding: '16px 24px',
        background: 'var(--color-living-green)',
        border: 'none', borderRadius: 14,
        fontSize: 16, fontWeight: 500,
        color: 'var(--color-spring-leaf)',
        fontFamily: 'var(--font-sans)',
        cursor: 'pointer',
        letterSpacing: '0.02em',
      }}>
        Open my dashboard →
      </button>
    </div>
  )
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function PrimaryButton({ label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '16px 24px', marginTop: 24,
      background: disabled ? 'var(--color-warm-stone)' : 'var(--color-living-green)',
      border: 'none', borderRadius: 14,
      fontSize: 15, fontWeight: 500,
      color: disabled ? 'var(--color-driftwood)' : 'var(--color-spring-leaf)',
      fontFamily: 'var(--font-sans)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background 0.2s',
      letterSpacing: '0.02em',
    }}>
      {label}
    </button>
  )
}

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', cursor: 'pointer',
      color: 'var(--color-driftwood)', fontSize: 13,
      fontFamily: 'var(--font-sans)', padding: '0 0 4px',
      display: 'flex', alignItems: 'center', gap: 4,
    }}>
      ← Back
    </button>
  )
}

const selectStyle = {
  width: '100%', padding: '12px 14px',
  background: 'var(--color-parchment)',
  border: '1px solid var(--color-warm-stone)',
  borderRadius: 12, fontSize: 15,
  fontFamily: 'var(--font-sans)',
  color: 'var(--color-bark)',
  outline: 'none', cursor: 'pointer',
}

function calcSleepHours(bed, wake) {
  const toMins = t => {
    const [time, period] = t.split(' ')
    let [h, m] = time.split(':').map(Number)
    if (period === 'PM' && h !== 12) h += 12
    if (period === 'AM' && h === 12) h = 0
    return h * 60 + m
  }
  let diff = toMins(wake) - toMins(bed)
  if (diff < 0) diff += 24 * 60
  const hrs = Math.floor(diff / 60)
  const mins = diff % 60
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
}