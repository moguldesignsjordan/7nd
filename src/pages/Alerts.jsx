export default function Alerts() {
  return <StubPage emoji="🔔" eyebrow="Notifications" title="Alerts" desc="Urgency-tiered coaching alerts tied to your biology" />
}

function StubPage({ emoji, title, desc, eyebrow }) {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-linen)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', gap: 14, textAlign: 'center',
    }}>
      <span style={{ fontSize: 52 }}>{emoji}</span>
      {eyebrow && <span className="text-label">{eyebrow}</span>}
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 400, color: 'var(--color-forest-deep)' }}>
        {title}
      </h1>
      <p style={{ fontSize: 14, color: 'var(--color-driftwood)', maxWidth: 260, lineHeight: 1.7 }}>{desc}</p>
    </div>
  )
}