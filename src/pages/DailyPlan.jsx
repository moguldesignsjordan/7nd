export default function DailyPlan() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-linen)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      gap: 14,
      textAlign: 'center',
    }}>
      <span style={{ fontSize: 52 }}>🗓️</span>
      <span style={{
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--color-driftwood)',
        fontFamily: 'var(--font-sans)',
      }}>
        Your day
      </span>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 30,
        fontWeight: 400,
        color: 'var(--color-forest-deep)',
        lineHeight: 1.2,
      }}>
        Circadian Daily Plan
      </h1>
      <p style={{
        fontSize: 14,
        color: 'var(--color-driftwood)',
        maxWidth: 260,
        lineHeight: 1.7,
        fontFamily: 'var(--font-sans)',
      }}>
        A time-blocked schedule built around your biology, location, and readiness
      </p>
    </div>
  )
}