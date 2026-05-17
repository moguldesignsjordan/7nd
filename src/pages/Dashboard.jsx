/**
 * 7ND — Unified Home Dashboard
 * ──────────────────────────────────────────────────────────────────────────
 * Personal readiness + live environment blended into one screen.
 *
 * Personal data:   mock (Phase 3 will replace with Prisma + real check-ins)
 * Environment:     live — Open-Meteo (UV, AQI, weather) + Sunrise-Sunset.org
 * AI coaching:     Claude API — context includes both personal + env data
 *
 * Place at: src/pages/index.jsx  (or Dashboard.jsx — whatever your router uses)
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from 'react';

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  forestDeep:  '#2C3A1E',
  livingGreen: '#5A7A28',
  sageGlow:    '#A8BC72',
  springLeaf:  '#C8D98A',
  solarGold:   '#D4A842',
  wheatLight:  '#E8C875',
  richEarth:   '#8B5E3C',
  linen:       '#F7F4EE',
  parchment:   '#F0EBD8',
  warmStone:   '#E2DAC8',
  driftwood:   '#6B6449',
  bark:        '#2C2A1E',
};

const READINESS_STATES = {
  green:  { label: 'Thrive',  dot: '#5A7A28', bg: '#EAF3DE', border: '#A8BC72', text: '#3A5020', ring: '#5A7A28' },
  yellow: { label: 'Sustain', dot: '#D4A842', bg: '#FFF8E0', border: '#E8C875', text: '#7A5010', ring: '#D4A842' },
  red:    { label: 'Restore', dot: '#C4573A', bg: '#FAF0EC', border: '#D4956A', text: '#7A2C10', ring: '#C4573A' },
};

const DOCTORS_META = {
  sun:      { emoji: '☀️', label: 'Sun',      bg: '#FFF8E0', border: '#E8C875', text: '#8B5E3C', ring: '#D4A842' },
  water:    { emoji: '💧', label: 'Water',    bg: '#E6F4FB', border: '#7EC8E3', text: '#2A6080', ring: '#7EC8E3' },
  air:      { emoji: '🌬️', label: 'Air',      bg: '#E8F4F0', border: '#80C4AA', text: '#2A6050', ring: '#80C4AA' },
  diet:     { emoji: '🥗', label: 'Diet',     bg: '#EAF3DE', border: '#A8BC72', text: '#3A5020', ring: '#A8BC72' },
  exercise: { emoji: '🏃', label: 'Exercise', bg: '#F5EDDE', border: '#C4956A', text: '#6B3C10', ring: '#C4956A' },
  sleep:    { emoji: '😴', label: 'Sleep',    bg: '#EDE8F5', border: '#A89ACC', text: '#4A3880', ring: '#A89ACC' },
  stress:   { emoji: '🧠', label: 'Stress',   bg: '#F5EBE8', border: '#D4956A', text: '#7A2C10', ring: '#D4956A' },
};

// ─── Mock personal data (Phase 3: replace with real check-in + DB scores) ────
const MOCK_PERSONAL = {
  name:       'Alex',
  noScore:    68,
  checkedIn:  false,
  doctors: {
    sun:      { score: 32 },   // will be overridden by live UV if env loads
    water:    { score: 74 },
    air:      { score: 88 },   // will be overridden by live AQI
    diet:     { score: 65 },
    exercise: { score: 80 },
    sleep:    { score: 55 },   // will be overridden by live humidity
    stress:   { score: 70 },
  },
};

// ─── Environment scoring ──────────────────────────────────────────────────────
function uvToSunScore(uv) {
  if (uv == null) return null;
  if (uv <= 0.5) return 32;
  if (uv <= 2)   return 52;
  if (uv <= 5)   return 82;
  if (uv <= 7)   return 95;
  if (uv <= 10)  return 70;
  return 38;
}
function aqiToAirScore(aqi) {
  if (aqi == null) return null;
  if (aqi <= 50)  return 95;
  if (aqi <= 100) return 72;
  if (aqi <= 150) return 48;
  if (aqi <= 200) return 25;
  return 10;
}
function humToSleepScore(h) {
  if (h == null) return null;
  if (h < 25)   return 48;
  if (h <= 60)  return 90;
  if (h <= 75)  return 65;
  return 40;
}
function uvLabel(uv) {
  if (uv == null) return '—';
  if (uv <= 0.5) return 'No UV'; if (uv <= 2) return 'Low'; if (uv <= 5) return 'Moderate';
  if (uv <= 7)   return 'High';  if (uv <= 10) return 'Very High'; return 'Extreme';
}
function aqiLabel(aqi) {
  if (aqi == null) return '—';
  if (aqi <= 50)  return 'Good'; if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy*'; if (aqi <= 200) return 'Unhealthy';
  return 'Hazardous';
}
function humLabel(h) {
  if (h == null) return '—';
  if (h < 25) return 'Dry'; if (h <= 60) return 'Optimal'; if (h <= 75) return 'Elevated'; return 'High';
}
function tmpLabel(t) {
  if (t == null) return '—';
  if (t < 45) return 'Cold'; if (t <= 80) return 'Optimal'; if (t <= 90) return 'Warm'; return 'Hot';
}

function deriveReadiness(doctors) {
  const vals = Object.values(doctors).map(d => d.score);
  const avg  = vals.reduce((a, b) => a + b, 0) / vals.length;
  if (avg >= 72) return 'green';
  if (avg >= 50) return 'yellow';
  return 'red';
}

// ─── Readiness ring ───────────────────────────────────────────────────────────
function ReadinessRing({ score, tier, size = 140 }) {
  const rs   = READINESS_STATES[tier];
  const sw   = 10;
  const r    = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={sw} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={rs.ring} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.22,1,0.36,1)', filter: `drop-shadow(0 0 8px ${rs.ring}66)` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: size * 0.28, fontWeight: 600, color: '#F0EBD8', lineHeight: 1 }}>
          {score}
        </div>
        <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: rs.ring, marginTop: 4 }}>
          {rs.label}
        </div>
      </div>
    </div>
  );
}

// ─── Solar arc — responsive, day + night ──────────────────────────────────────
function SunArc({ sunrise, sunset, now }) {
  const VW = 480, VH = 130;
  const cx = VW / 2, cy = VH + 12, r = VW / 2 - 30;
  const sx = cx - r, ex = cx + r, arcLen = Math.PI * r;
  const isDay    = now >= sunrise && now <= sunset;
  const dayProg  = Math.max(0, Math.min(1, (now - sunrise) / (sunset - sunrise)));
  const sunX     = cx - r * Math.cos(dayProg * Math.PI);
  const sunY     = cy - r * Math.sin(dayProg * Math.PI);
  let nextSunrise = new Date(sunrise);
  if (nextSunrise <= now) nextSunrise.setDate(nextSunrise.getDate() + 1);
  const prevSunset  = now < sunrise ? new Date(sunset.getTime() - 86_400_000) : sunset;
  const nightProg   = Math.max(0, Math.min(1, (now - prevSunset) / (nextSunrise - prevSunset)));
  const moonX = cx - r * Math.cos((1 - nightProg) * Math.PI);
  const moonY = cy - r * Math.sin((1 - nightProg) * Math.PI);
  const minsLeft = Math.max(0, Math.round((nextSunrise - now) / 60_000));
  const fmt = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <svg viewBox={`0 0 ${VW} ${VH + 38}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <path d={`M ${sx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${cy}`} fill="none" stroke={C.warmStone} strokeWidth="2.5" strokeDasharray="5 9" />
      {isDay ? (
        <>
          {dayProg > 0.01 && <path d={`M ${sx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${cy}`} fill="none" stroke={C.solarGold} strokeWidth="3.5" strokeLinecap="round" strokeDasharray={`${arcLen * dayProg} ${arcLen}`} />}
          <circle cx={sunX} cy={sunY} r={20} fill={C.solarGold} opacity="0.13" />
          <circle cx={sunX} cy={sunY} r={10} fill={C.solarGold} />
          <circle cx={sunX} cy={sunY} r={10} fill="none" stroke={C.wheatLight} strokeWidth="2" />
        </>
      ) : (
        <>
          <path d={`M ${sx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${cy}`} fill="none" stroke={C.solarGold} strokeWidth="2" opacity="0.2" />
          <circle cx={moonX} cy={moonY} r={12} fill="#8FA0A8" />
          <circle cx={moonX + 6} cy={moonY - 3} r={10} fill={C.parchment} />
          <rect x={cx - 90} y={cy - r * 0.52 - 17} width="180" height="30" rx="15" fill={C.warmStone} opacity="0.65" />
          <text x={cx} y={cy - r * 0.52 + 4} textAnchor="middle" fontSize="11" fontWeight="500" fill={C.driftwood} fontFamily="DM Sans,sans-serif">
            Sunrise en {Math.floor(minsLeft / 60)}h {minsLeft % 60}m
          </text>
        </>
      )}
      <line x1={sx - 8} y1={cy} x2={ex + 8} y2={cy} stroke={C.warmStone} strokeWidth="1" />
      <text x={sx} y={cy + 22} fontSize="10" fill={C.driftwood} fontFamily="DM Sans,sans-serif">{fmt(sunrise)}</text>
      <text x={ex} y={cy + 22} fontSize="10" fill={C.driftwood} fontFamily="DM Sans,sans-serif" textAnchor="end">{fmt(sunset)}</text>
    </svg>
  );
}

// ─── Doctor pill ──────────────────────────────────────────────────────────────
function DoctorPill({ id, score, envBadge }) {
  const m  = DOCTORS_META[id];
  const r  = 18, circ = 2 * Math.PI * r, fill = (score / 100) * circ;
  return (
    <div style={{
      background: m.bg, border: `1px solid ${m.border}`, borderRadius: 14,
      padding: '12px 8px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 6, position: 'relative',
    }}>
      {/* Live env indicator dot */}
      {envBadge && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          width: 6, height: 6, borderRadius: '50%', background: C.livingGreen,
        }} title="Live data" />
      )}
      <span style={{ fontSize: 20 }}>{m.emoji}</span>
      <svg width={42} height={42}>
        <circle cx={21} cy={21} r={r} fill="none" stroke={m.border} strokeWidth="4" />
        <circle cx={21} cy={21} r={r} fill="none" stroke={m.ring} strokeWidth="4"
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 21 21)"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1)' }}
        />
        <text x="21" y="25" textAnchor="middle" fontSize="11" fontWeight="500" fill={C.bark} fontFamily="DM Sans,sans-serif">{score}</text>
      </svg>
      <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: m.text }}>
        {m.label}
      </div>
    </div>
  );
}

// ─── NO score bar ─────────────────────────────────────────────────────────────
function NOScoreBar({ score }) {
  const color = score >= 70 ? C.livingGreen : score >= 45 ? C.solarGold : '#C4573A';
  return (
    <div style={{ background: C.parchment, border: `1px solid ${C.warmStone}`, borderRadius: 16, padding: '16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.driftwood, marginBottom: 3 }}>
            🧬 Nitric Oxide Score
          </div>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, color: C.bark, lineHeight: 1 }}>
            {score}<span style={{ fontSize: 14, color: C.driftwood }}>/100</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, color: C.driftwood, lineHeight: 1.6, maxWidth: 160 }}>
          {score >= 70 ? 'Blood flow optimised. Keep the sun + movement window open.' :
           score >= 45 ? 'Moderate. Morning light and nasal breathing will lift this.' :
           'Low. Sun, diet, and nasal breathing are your levers today.'}
        </div>
      </div>
      <div style={{ height: 8, background: C.warmStone, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${score}%`, borderRadius: 99, background: color,
          transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)',
        }} />
      </div>
    </div>
  );
}

// ─── Env chip ─────────────────────────────────────────────────────────────────
function EnvChip({ icon, value, label, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      padding: '8px 14px', borderRadius: 99,
      background: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.15)',
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#F0EBD8', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 9, color: color || C.sageGlow, letterSpacing: '0.08em' }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Coaching card ────────────────────────────────────────────────────────────
function CoachCard({ coaching }) {
  const d = DOCTORS_META[coaching.doctor] || DOCTORS_META.sun;
  return (
    <div style={{ background: d.bg, border: `1px solid ${d.border}`, borderRadius: 16, padding: '20px 22px' }}>
      <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: d.text, marginBottom: 12 }}>
        🤖 Coaching · {d.label} Doctor
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.8, color: C.bark, marginBottom: 14 }}>{coaching.insight}</p>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 14px',
        background: 'rgba(255,255,255,0.55)', borderRadius: 10, border: `1px solid ${d.border}`,
      }}>
        <span style={{ fontSize: 13, color: d.text, marginTop: 1, flexShrink: 0 }}>→</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: d.text, lineHeight: 1.55 }}>{coaching.action}</span>
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [env,      setEnv]      = useState(null);   // { weather, air, sunTimes }
  const [envPhase, setEnvPhase] = useState('loading');
  const [coaching, setCoaching] = useState(null);
  const [now,      setNow]      = useState(new Date());

  // Tick clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Merge env scores into doctor scores
  const doctors = { ...MOCK_PERSONAL.doctors };
  if (env?.weather) {
    const uvS  = uvToSunScore(env.weather.uv_index);
    const aqS  = aqiToAirScore(env.air?.us_aqi);
    const humS = humToSleepScore(env.weather.relative_humidity_2m);
    if (uvS  != null) doctors.sun.score   = uvS;
    if (aqS  != null) doctors.air.score   = aqS;
    if (humS != null) doctors.sleep.score = humS;
  }

  const readinessTier  = deriveReadiness(doctors);
  const readinessScore = Math.round(Object.values(doctors).reduce((a, d) => a + d.score, 0) / 7);
  const rs             = READINESS_STATES[readinessTier];
  const isDay          = env?.sunTimes ? (now >= env.sunTimes.sunrise && now <= env.sunTimes.sunset) : true;

  // Fetch env data
  useEffect(() => {
    if (!navigator.geolocation) { setEnvPhase('error'); return; }
    navigator.geolocation.getCurrentPosition(async ({ coords: { latitude: lat, longitude: lon } }) => {
      try {
        const [wRes, aqRes, sunRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,uv_index,apparent_temperature&timezone=auto&temperature_unit=fahrenheit`),
          fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5&timezone=auto`),
          fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`),
        ]);
        const [w, aq, sun] = await Promise.all([wRes.json(), aqRes.json(), sunRes.json()]);
        const envData = {
          weather:  w.current,
          air:      aq.current,
          sunTimes: { sunrise: new Date(sun.results.sunrise), sunset: new Date(sun.results.sunset) },
        };
        setEnv(envData);
        setEnvPhase('ready');
        fetchCoaching(envData, doctors);
      } catch { setEnvPhase('error'); }
    }, () => setEnvPhase('error'), { timeout: 10_000 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCoaching = useCallback(async (envData, docs) => {
    const w       = envData.weather;
    const isNight = new Date() < envData.sunTimes?.sunrise || new Date() > envData.sunTimes?.sunset;
    const docSummary = Object.entries(docs)
      .map(([k, v]) => `${k}: ${v.score}`)
      .join(', ');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 400,
          system: `You are 7ND's health coach. You see BOTH personal scores and live environment. Grounded, specific, warm. Mention a biological mechanism. Nature-first. One clear action. 2–3 sentences. Return ONLY valid JSON: {"doctor":"sun|water|air|diet|exercise|sleep|stress","insight":"...","action":"..."}`,
          messages: [{
            role: 'user',
            content: `Doctor scores: ${docSummary}. Environment: UV ${w?.uv_index} (${uvLabel(w?.uv_index)}), AQI ${envData.air?.us_aqi} (${aqiLabel(envData.air?.us_aqi)}), Temp ${Math.round(w?.temperature_2m)}°F, Humidity ${w?.relative_humidity_2m}%. Time: ${isNight ? 'night' : 'day'}.`,
          }],
        }),
      });
      const data = await res.json();
      setCoaching(JSON.parse((data.content?.[0]?.text ?? '{}').replace(/```json|```/g, '').trim()));
    } catch {
      setCoaching({
        doctor: isNight ? 'sleep' : 'sun',
        insight: isNight
          ? `Your body's deepest recovery window is now. Growth hormone peaks between 10 PM–2 AM and HRV climbs when your sleep environment is right. Humidity at ${envData.weather?.relative_humidity_2m}% ${envData.weather?.relative_humidity_2m > 60 ? 'is elevated — cool, dry air deepens sleep architecture' : 'is in a good range for deep sleep'}.`
          : `Morning light is your first biological lever of the day — it drives the cortisol awakening response and sets your alertness window for the next 14 hours. With AQI at ${envData.air?.us_aqi}, ${envData.air?.us_aqi <= 50 ? 'outdoor nasal breathing is ideal right now' : 'moderate your outdoor intensity today'}.`,
        action: isNight
          ? 'Lower room temp to 65–68°F and eliminate all light before sleeping.'
          : 'Get outside within 30 minutes of waking for 10 minutes of natural light.',
      });
    }
  }, []);

  const w   = env?.weather;
  const air = env?.air;
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <style>{`
        @keyframes nd-spin  { to { transform:rotate(360deg); } }
        @keyframes nd-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes nd-up    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .nd-up  { animation: nd-up .5s cubic-bezier(.22,1,.36,1) both; }
        .nd-u1  { animation-delay:.08s; }
        .nd-u2  { animation-delay:.16s; }
        .nd-u3  { animation-delay:.24s; }
        .nd-u4  { animation-delay:.32s; }
      `}</style>

      <div style={{ fontFamily: '"DM Sans", sans-serif', background: C.linen, minHeight: '100vh' }}>

        {/* ── HERO — dark, personal + env blended ── */}
        <div style={{ background: C.forestDeep, padding: '28px 28px 32px', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle glow orb */}
          <div style={{
            position: 'absolute', top: -80, right: -80,
            width: 300, height: 300, borderRadius: '50%',
            background: `radial-gradient(circle, ${READINESS_STATES[readinessTier].ring}18 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div className="nd-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            {/* Left: greeting + date + env chips */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sageGlow, marginBottom: 6 }}>
                {isDay ? '☀️' : '🌙'} {dateStr}
              </div>
              <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, color: '#F0EBD8', lineHeight: 1.2, marginBottom: 4 }}>
                {greeting}, {MOCK_PERSONAL.name}.
              </div>
              <div style={{ fontSize: 12, color: '#6A7C50', marginBottom: 20 }}>{timeStr}</div>

              {/* Live env chips */}
              {envPhase === 'ready' && w ? (
                <div className="nd-u1" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <EnvChip icon="☀️" value={w.uv_index != null ? w.uv_index.toFixed(1) : '—'} label={uvLabel(w.uv_index)} color={C.wheatLight} />
                  <EnvChip icon="🌬️" value={air?.us_aqi ?? '—'} label={aqiLabel(air?.us_aqi)} />
                  <EnvChip icon="🌡️" value={`${Math.round(w.temperature_2m)}°F`} label={tmpLabel(w.temperature_2m)} />
                  <EnvChip icon="💧" value={`${w.relative_humidity_2m}%`} label={`Humidity · ${humLabel(w.relative_humidity_2m)}`} />
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['UV', 'AQI', 'Temp', 'Humidity'].map(l => (
                    <div key={l} style={{ padding: '8px 14px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 11, color: '#6A7C50', animation: 'nd-pulse 2s infinite' }}>
                      {l} —
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: readiness ring */}
            <div className="nd-u2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <ReadinessRing score={readinessScore} tier={readinessTier} size={148} />
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6A7C50' }}>
                Readiness
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding: '24px 28px 48px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* 7 Doctors — auto-fit, 4 cols mobile → 7 cols desktop */}
          <div className="nd-up nd-u1">
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.driftwood, marginBottom: 10 }}>
              Seven Doctors · Today's Scores
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(76px, 1fr))', gap: 10 }}>
              {Object.entries(doctors).map(([id, d]) => (
                <DoctorPill
                  key={id} id={id} score={d.score}
                  envBadge={envPhase === 'ready' && (id === 'sun' || id === 'air' || id === 'sleep')}
                />
              ))}
            </div>
            {envPhase === 'ready' && (
              <div style={{ marginTop: 8, fontSize: 10, color: C.driftwood, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.livingGreen, display: 'inline-block' }} />
                Sun · Air · Sleep actualizado con datos en vivo
              </div>
            )}
          </div>

          {/* NO Score + Solar Arc — side by side on desktop */}
          <div className="nd-up nd-u2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <NOScoreBar score={MOCK_PERSONAL.noScore} />

            {/* Solar window */}
            <div style={{ background: C.parchment, border: `1px solid ${C.warmStone}`, borderRadius: 16, padding: '16px 20px' }}>
              <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.driftwood, marginBottom: 6 }}>
                {isDay ? '☀️' : '🌙'} Ventana Solar · Ancla Circadiana
              </div>
              {env?.sunTimes ? (
                <>
                  <SunArc sunrise={env.sunTimes.sunrise} sunset={env.sunTimes.sunset} now={now} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <div>
                      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A7F5C', marginBottom: 2 }}>Sunrise</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.bark }}>{env.sunTimes.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A7F5C', marginBottom: 2 }}>Daylight</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.bark }}>
                        {Math.round((env.sunTimes.sunset - env.sunTimes.sunrise) / 3_600_000)}h {Math.round(((env.sunTimes.sunset - env.sunTimes.sunrise) % 3_600_000) / 60_000)}m
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A7F5C', marginBottom: 2 }}>Sunset</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.bark }}>{env.sunTimes.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 12, color: C.driftwood, animation: 'nd-pulse 2s infinite' }}>Cargando datos solares…</div>
                </div>
              )}
            </div>
          </div>

          {/* Coaching — blends personal + env context */}
          <div className="nd-up nd-u3">
            {coaching ? (
              <CoachCard coaching={coaching} />
            ) : (
              <div style={{ background: C.parchment, border: `1px solid ${C.warmStone}`, borderRadius: 16, padding: '20px 22px' }}>
                <div style={{ fontSize: 12, color: C.driftwood, animation: 'nd-pulse 2s infinite' }}>
                  Generando coaching personalizado…
                </div>
              </div>
            )}
          </div>

          {/* Check-in CTA — shown if not checked in yet */}
          {!MOCK_PERSONAL.checkedIn && (
            <div className="nd-up nd-u4" style={{
              background: C.forestDeep, borderRadius: 16,
              padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.sageGlow, marginBottom: 4 }}>
                  Morning Check-in
                </div>
                <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, color: '#F0EBD8' }}>
                  ¿Cómo te sientes hoy?
                </div>
              </div>
              <button
                onClick={() => window.location.href = '/check-in'}
                style={{
                  background: C.livingGreen, color: '#F0EBD8',
                  border: 'none', borderRadius: 10, padding: '10px 18px',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  fontFamily: '"DM Sans", sans-serif',
                }}
              >
                Comenzar →
              </button>
            </div>
          )}

          {/* Attribution */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', opacity: 0.7 }}>
            {['Open-Meteo · Weather & UV', 'Open-Meteo · Air Quality', 'Sunrise-Sunset.org · Solar'].map(s => (
              <div key={s} style={{ fontSize: 9, color: '#8A7F5C', background: C.parchment, border: `1px solid ${C.warmStone}`, borderRadius: 20, padding: '3px 10px' }}>{s}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}