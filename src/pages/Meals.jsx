export default function Meals() {
  return <StubPage emoji="📸" eyebrow="Nutrition" title="Meal Tracker" desc="Photo upload, Claude meal analysis, and nitric oxide food tracking" />
}

function StubPage({ emoji, title, desc, eyebrow }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-linen)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: 14, textAlign: 'center' }}>
      <span style={{ fontSize: 52 }}>{emoji}</span>
      {eyebrow && <span className="text-label">{eyebrow}</span>}
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 400, color: 'var(--color-forest-deep)', lineHeight: 1.2 }}>{title}</h1>
      <p style={{ fontSize: 14, color: 'var(--color-driftwood)', maxWidth: 260, lineHeight: 1.7, fontFamily: 'var(--font-sans)' }}>{desc}</p>
      <div style={{ marginTop: 8, padding: '5px 14px', background: 'var(--color-parchment)', border: '1px solid var(--color-warm-stone)', borderRadius: 20, fontSize: 11, color: 'var(--color-driftwood)', fontFamily: 'var(--font-sans)', letterSpacing: '0.08em' }}>Coming soon</div>
    </div>
  )
}