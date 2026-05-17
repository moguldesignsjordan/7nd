/**
 * 7ND — Home Dashboard (Redesigned)
 * Clean, grounded health dashboard following brand guidelines.
 * Linen background, warm-stone borders, Playfair + DM Sans typography.
 */

import { useState, useEffect, useCallback } from 'react';

/* ── Brand Tokens ─────────────────────────────────────────────── */
const C = {
  forestDeep:  '#2C3A1E',
  livingGreen: '#5A7A28',
  sageGlow:    '#A8BC72',
  springLeaf:  '#C8D98A',
  meadowMist:  '#E8F0C8',
  solarGold:   '#D4A842',
  wheatLight:  '#E8C875',
  richEarth:   '#8B5E3C',
  linen:       '#F7F4EE',
  parchment:   '#F0EBD8',
  warmStone:   '#E2DAC8',
  driftwood:   '#6B6449',
  bark:        '#2C2A1E',
};

const font = {
  display: '"Playfair Display", Georgia, serif',
  body:    '"DM Sans", system-ui, sans-serif',
};

/* ── Weather codes (WMO) ──────────────────────────────────────── */
const getWeatherDesc = (code) => {
  if (code == null) return 'Syncing…';
  const map = {
    0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
    45:'Fog',48:'Rime fog',51:'Light drizzle',53:'Moderate drizzle',
    55:'Dense drizzle',61:'Slight rain',63:'Moderate rain',65:'Heavy rain',
    71:'Slight snow',73:'Moderate snow',75:'Heavy snow',95:'Thunderstorm',
    96:'Thunderstorm + hail',99:'Heavy thunderstorm',
  };
  return map[code] || 'Varied conditions';
};

/* ── Doctor pillar colors ─────────────────────────────────────── */
const DOCTORS = {
  sun:      { emoji:'☀️', label:'Sun',      bg:'#FFF8E0', border:'#E8C875', text:'#8B5E3C', ring:'#D4A842' },
  air:      { emoji:'🌬️', label:'Air',      bg:'#E8F4F0', border:'#80C4AA', text:'#2A6050', ring:'#80C4AA' },
  exercise: { emoji:'🏃', label:'Exercise', bg:'#F5EDDE', border:'#C4956A', text:'#6B3C10', ring:'#C4956A' },
  sleep:    { emoji:'😴', label:'Sleep',    bg:'#EDE8F5', border:'#A89ACC', text:'#4A3880', ring:'#A89ACC' },
};

const READINESS = {
  green:  { label:'Thrive',  dot:'#5A7A28', bg:'#EAF3DE', border:'#A8BC72', text:'#3A5020' },
  yellow: { label:'Sustain', dot:'#D4A842', bg:'#FFF8E0', border:'#E8C875', text:'#7A5010' },
  red:    { label:'Restore', dot:'#C4573A', bg:'#FAF0EC', border:'#D4956A', text:'#7A2C10' },
};

/* ── Scoring helpers ──────────────────────────────────────────── */
function scoreUV(uv) {
  if (uv == null) return { score:0, label:'…', tip:'Syncing satellite data…' };
  if (uv <= 0.5)  return { score:32, label:'No UV',     tip:'Minimal D3 window. Morning light still anchors your circadian clock.' };
  if (uv <= 2)    return { score:52, label:'Low',        tip:'Low nitric oxide stimulus. Any outdoor time beats none.' };
  if (uv <= 5)    return { score:82, label:'Moderate',   tip:'Good window for vitamin D and nitric oxide production.' };
  if (uv <= 7)    return { score:95, label:'High',       tip:'Prime solar window. 15–20 min maximises NO production.' };
  if (uv <= 10)   return { score:70, label:'Very High',  tip:'Limit midday exposure. Morning is optimal.' };
  return            { score:38, label:'Extreme',   tip:'Seek shade. Keep exposure short and early morning only.' };
}
function scoreAQI(aqi) {
  if (aqi == null) return { score:0, label:'…', tip:'Sampling air quality…' };
  if (aqi <= 50)   return { score:95, label:'Good',       tip:'Ideal for outdoor nasal breathing and aerobic work.' };
  if (aqi <= 100)  return { score:72, label:'Moderate',   tip:'Fine for most. Sensitive groups: limit prolonged exertion.' };
  if (aqi <= 150)  return { score:48, label:'Unhealthy*', tip:'Use air purifier indoors. Limit high-intensity movement.' };
  if (aqi <= 200)  return { score:25, label:'Unhealthy',  tip:'Stay indoors. Air filtration is your biological priority.' };
  return            { score:10, label:'Hazardous',  tip:'Indoor-only day. Critical red alert.' };
}
function scoreHumidity(h) {
  if (h == null) return { score:0, label:'…', tip:'Measuring saturation…' };
  if (h < 25)    return { score:48, label:'Dry',      tip:'Strains respiratory mucosa. Hydrate and use a humidifier.' };
  if (h <= 60)   return { score:90, label:'Optimal',  tip:'Ideal humidity range for respiratory health and sleep.' };
  if (h <= 75)   return { score:65, label:'Elevated', tip:'Slightly high. Prioritise airflow tonight.' };
  return          { score:40, label:'High',     tip:'Heavy air reduces aerobic efficiency. Adjust intensity.' };
}
function scoreTemp(t) {
  if (t == null) return { score:0, label:'…', tip:'Reading thermals…' };
  if (t < 45)    return { score:55, label:'Cold',    tip:'Reduces nasal breathing efficiency. Warm up gradually.' };
  if (t <= 80)   return { score:88, label:'Optimal', tip:'Near-ideal conditions for outdoor movement and NO production.' };
  if (t <= 90)   return { score:70, label:'Warm',    tip:'Good conditions. Front-load hydration now.' };
  return          { score:50, label:'Hot',     tip:'Heat raises cardiac load. Shift exercise indoors or early morning.' };
}
function deriveReadiness(uvS, aqiS, humS) {
  if (!uvS || !aqiS || !humS) return null;
  const avg = (uvS + aqiS * 1.2 + humS * 0.8) / 3;
  return avg >= 68 ? 'green' : avg >= 45 ? 'yellow' : 'red';
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ── Score Ring ────────────────────────────────────────────────── */
function ScoreRing({ score, color, size = 52, delay = 0 }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120 + delay);
    return () => clearTimeout(t);
  }, [delay]);

  const strokeW = 4.5;
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const filled = mounted && score ? (score / 100) * circ : 0;

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={C.warmStone} strokeWidth={strokeW} opacity="0.35" />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={strokeW}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
      <text x={size/2} y={size/2 + 4.5} textAnchor="middle"
        fontSize="13" fontWeight="600"
        fill={score ? C.bark : C.warmStone}
        fontFamily={font.body}>
        {score || '—'}
      </text>
    </svg>
  );
}

/* ── Sun Arc ──────────────────────────────────────────────────── */
function SunArc({ sunrise, sunset, now }) {
  if (!sunrise || !sunset) {
    return (
      <div style={{ height: 120, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:C.driftwood, opacity:0.6, fontFamily:font.body }}>
          Calculating trajectory…
        </span>
      </div>
    );
  }

  const VW = 440, VH = 130, cx = VW/2, cy = VH + 10, r = VW/2 - 28;
  const sx = cx - r, ex = cx + r, arcLen = Math.PI * r;
  const isDay = now >= sunrise && now <= sunset;
  const dayProg = Math.max(0, Math.min(1, (now - sunrise) / (sunset - sunrise)));
  const sunX = cx - r * Math.cos(dayProg * Math.PI);
  const sunY = cy - r * Math.sin(dayProg * Math.PI);

  let nextSR = new Date(sunrise);
  if (nextSR <= now) nextSR.setDate(nextSR.getDate() + 1);
  const prevSS = now < sunrise ? new Date(sunset.getTime() - 864e5) : sunset;
  const nightProg = Math.max(0, Math.min(1, (now - prevSS) / (nextSR - prevSS)));
  const moonProg = 1 - nightProg;
  const moonX = cx - r * Math.cos(moonProg * Math.PI);
  const moonY = cy - r * Math.sin(moonProg * Math.PI);
  const minsLeft = Math.max(0, Math.round((nextSR - now) / 6e4));
  const fmt = d => d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });

  return (
    <svg viewBox={`0 0 ${VW} ${VH + 36}`} width="100%" style={{ display:'block', overflow:'visible' }}>
      {/* arc track */}
      <path d={`M ${sx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${cy}`}
        fill="none" stroke={C.warmStone} strokeWidth="2" strokeDasharray="4 8" opacity="0.55" />

      {isDay ? (
        <>
          {dayProg > 0.01 && (
            <path d={`M ${sx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${cy}`}
              fill="none" stroke={C.solarGold} strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${arcLen * dayProg} ${arcLen}`}
              style={{ filter:'drop-shadow(0 0 3px rgba(212,168,66,0.3))' }} />
          )}
          <circle cx={sunX} cy={sunY} r={20} fill={C.solarGold} opacity="0.08">
            <animate attributeName="r" values="18;24;18" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx={sunX} cy={sunY} r={10} fill={C.solarGold}
            style={{ filter:'drop-shadow(0 0 5px rgba(212,168,66,0.45))' }} />
          <circle cx={sunX} cy={sunY} r={10} fill="none" stroke={C.wheatLight} strokeWidth="1.5" />
        </>
      ) : (
        <>
          <path d={`M ${sx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${cy}`}
            fill="none" stroke={C.solarGold} strokeWidth="1.5" opacity="0.15" />
          <circle cx={moonX} cy={moonY} r={10} fill="#8FA0A8" />
          <circle cx={moonX+5} cy={moonY-2.5} r={8} fill={C.parchment} />
          <text x={cx} y={cy - r*0.48} textAnchor="middle"
            fontSize="11" fontWeight="500" fill={C.driftwood} fontFamily={font.body}>
            Next sunrise in {Math.floor(minsLeft/60)}h {minsLeft%60}m
          </text>
        </>
      )}

      {/* horizon line */}
      <line x1={sx-8} y1={cy} x2={ex+8} y2={cy} stroke={C.warmStone} strokeWidth="1" opacity="0.5" />
      <text x={sx} y={cy+20} fontSize="10" fill={C.driftwood} fontFamily={font.body}>{fmt(sunrise)}</text>
      <text x={ex} y={cy+20} fontSize="10" fill={C.driftwood} fontFamily={font.body} textAnchor="end">{fmt(sunset)}</text>
    </svg>
  );
}

/* ── Readiness Badge ──────────────────────────────────────────── */
function ReadinessBadge({ tier }) {
  if (!tier) return null;
  const s = READINESS[tier];
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'6px 14px', borderRadius:20,
      background:s.bg, border:`1px solid ${s.border}`,
    }}>
      <span style={{
        width:7, height:7, borderRadius:'50%', display:'block', flexShrink:0,
        background:s.dot, boxShadow:`0 0 6px ${s.dot}66`,
      }} />
      <span style={{
        fontSize:10, fontWeight:600, letterSpacing:'0.14em',
        textTransform:'uppercase', color:s.text, fontFamily:font.body,
      }}>{s.label}</span>
    </div>
  );
}

/* ── Environment Card ─────────────────────────────────────────── */
function EnvCard({ doctor, label, value, info, delay = 0 }) {
  const d = DOCTORS[doctor];
  return (
    <div style={{
      background:d.bg, border:`1px solid ${d.border}`,
      borderRadius:20, padding:'18px 16px',
      display:'flex', flexDirection:'column', gap:10,
      opacity:0, animation:`ndUp 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms forwards`,
    }}>
      {/* label row */}
      <div style={{
        fontSize:10, fontWeight:600, letterSpacing:'0.14em',
        textTransform:'uppercase', color:d.text, fontFamily:font.body,
        whiteSpace:'nowrap',
      }}>
        {d.emoji} {label}
      </div>

      {/* value + ring row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:font.display, fontSize:26, color:C.bark, lineHeight:1 }}>
          {value}
        </div>
        <ScoreRing score={info.score} color={d.ring} delay={delay + 200} />
      </div>

      {/* status + tip */}
      <div>
        <div style={{ fontSize:12, fontWeight:600, color:d.text, marginBottom:2, fontFamily:font.body }}>{info.label}</div>
        <div style={{ fontSize:11, lineHeight:1.45, color:C.driftwood, fontFamily:font.body }}>{info.tip}</div>
      </div>
    </div>
  );
}

/* ── Coaching Card ────────────────────────────────────────────── */
function CoachCard({ coaching }) {
  if (!coaching) {
    return (
      <div style={{
        height:120, display:'flex', alignItems:'center', justifyContent:'center',
        background:C.parchment, border:`1px dashed ${C.warmStone}`,
        borderRadius:20, opacity:0,
        animation:'ndUp 0.65s cubic-bezier(0.16,1,0.3,1) 500ms forwards',
      }}>
        <span style={{ fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:C.driftwood, fontFamily:font.body }}>
          Analyzing biometrics…
        </span>
      </div>
    );
  }
  const d = DOCTORS[coaching.doctor] || DOCTORS.sun;
  return (
    <div style={{
      background:d.bg, border:`1px solid ${d.border}`,
      borderRadius:20, padding:'20px 22px',
      opacity:0, animation:'ndUp 0.65s cubic-bezier(0.16,1,0.3,1) 500ms forwards',
    }}>
      <div style={{
        fontSize:10, fontWeight:600, letterSpacing:'0.15em',
        textTransform:'uppercase', color:d.text, marginBottom:14, fontFamily:font.body,
      }}>
        {d.emoji} {d.label} Coaching
      </div>
      <p style={{
        fontSize:15, lineHeight:1.65, color:C.bark, margin:'0 0 16px',
        fontFamily:font.body, fontWeight:400,
      }}>
        {coaching.insight}
      </p>
      <div style={{
        display:'flex', alignItems:'flex-start', gap:12,
        padding:'14px 16px', borderRadius:14,
        background:'rgba(255,255,255,0.65)', border:'1px solid rgba(255,255,255,0.8)',
      }}>
        <span style={{ fontSize:14, color:d.text, flexShrink:0, marginTop:1 }}>→</span>
        <span style={{ fontSize:13, fontWeight:600, lineHeight:1.45, color:d.text, fontFamily:font.body }}>
          {coaching.action}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [phase,    setPhase]    = useState('locating');
  const [location, setLocation] = useState('Locating…');
  const [weather,  setWeather]  = useState(null);
  const [airData,  setAirData]  = useState(null);
  const [sunTimes, setSunTimes] = useState(null);
  const [coaching, setCoaching] = useState(null);
  const [error,    setError]    = useState('');
  const [now,      setNow]      = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  /* coaching derivation */
  const fetchCoaching = useCallback(({ uv, aqi, temp, humidity, isNight }) => {
    setCoaching(isNight ? {
      doctor: 'sleep',
      insight: `Cellular repair peaks between 10 PM and 2 AM. Humidity at ${humidity}% ${humidity > 60 ? 'is elevated — heavy air fragments sleep architecture.' : 'is in a good range for deep sleep'}.`,
      action: 'Cool your room to 65–68 °F and eliminate all ambient light.',
    } : {
      doctor: 'sun',
      insight: `Morning light is your circadian anchor. Air quality at ${aqi} AQI means ${aqi <= 50 ? 'outdoor nasal breathing is ideal right now' : 'moderate your outdoor intensity today'}.`,
      action: 'Get outside within 30 minutes of waking for 10+ minutes of natural light.',
    });
  }, []);

  /* data fetch */
  const fetchData = useCallback(async (lat, lon, isFallback = false) => {
    setPhase('fetching');
    try {
      const [wR, aR, sR, locR] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,uv_index,apparent_temperature,weathercode&timezone=auto&temperature_unit=fahrenheit`),
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5&timezone=auto`),
        fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`),
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`),
      ]);
      if (!wR.ok || !aR.ok || !sR.ok) throw new Error('API sync failed');
      const [w, a, s, loc] = await Promise.all([wR.json(), aR.json(), sR.json(), locR.json()]);
      const sr = new Date(s.results.sunrise), ss = new Date(s.results.sunset);
      const isNight = new Date() < sr || new Date() > ss;

      setLocation(isFallback ? 'Headland, AL' : (loc.city || loc.locality || loc.principalSubdivision || 'Your Area'));
      setWeather(w.current);
      setAirData(a.current);
      setSunTimes({ sunrise: sr, sunset: ss });
      setPhase('ready');
      fetchCoaching({
        uv: w.current.uv_index, aqi: a.current.us_aqi,
        temp: Math.round(w.current.temperature_2m),
        humidity: w.current.relative_humidity_2m, isNight,
      });
    } catch {
      setError('Using cached data due to network restrictions.');
      setPhase('error');
    }
  }, [fetchCoaching]);

  useEffect(() => {
    const FB_LAT = 31.3504, FB_LON = -85.3432;
    if (!navigator.geolocation) {
      setError('Geolocation not supported. Using local hub.');
      fetchData(FB_LAT, FB_LON, true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => fetchData(pos.coords.latitude, pos.coords.longitude, false),
      () => { setError('Location blocked. Defaulting to Headland, AL.'); fetchData(FB_LAT, FB_LON, true); },
      { timeout: 8000 },
    );
  }, [fetchData]);

  /* derived scores */
  const uvInfo  = scoreUV(weather?.uv_index);
  const aqInfo  = scoreAQI(airData?.us_aqi);
  const humInfo = scoreHumidity(weather?.relative_humidity_2m);
  const tmpInfo = scoreTemp(weather?.temperature_2m);
  const readiness = weather && airData ? deriveReadiness(uvInfo.score, aqInfo.score, humInfo.score) : null;
  const isDay = sunTimes ? (now >= sunTimes.sunrise && now <= sunTimes.sunset) : true;

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @keyframes ndUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div style={{
        width:'100%', minHeight:'100vh',
        fontFamily:font.body, background:C.linen,
        display:'flex', flexDirection:'column', paddingBottom:120,
      }}>

        {/* ═══ HEADER ═══ */}
        <div style={{
          background:C.forestDeep,
          borderRadius:'0 0 28px 28px',
          padding:'16px 24px 28px',
          boxShadow:'0 8px 24px -8px rgba(44,58,30,0.25)',
          position:'relative', zIndex:10,
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:12 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <span style={{
                fontSize:10, fontWeight:600, letterSpacing:'0.18em',
                textTransform:'uppercase', color:C.sageGlow, fontFamily:font.body,
              }}>
                {location.toUpperCase()}
              </span>
              <div style={{
                fontFamily:font.display, fontSize:30, fontWeight:400,
                color:C.parchment, lineHeight:1.1,
              }}>
                {getWeatherDesc(weather?.weathercode)}
              </div>
            </div>
            <ReadinessBadge tier={readiness} />
          </div>
        </div>

        {/* ═══ BODY ═══ */}
        <div style={{
          padding:'24px 20px 0',
          maxWidth:960, width:'100%', margin:'0 auto',
          display:'flex', flexDirection:'column', gap:16,
        }}>

          {/* error banner */}
          {error && (
            <div style={{
              fontSize:11, fontWeight:500, padding:'10px 16px',
              borderRadius:14, color:C.richEarth,
              background:'rgba(232,200,117,0.15)', border:'1px solid rgba(232,200,117,0.35)',
              fontFamily:font.body,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── Solar Window Card ── */}
          <div style={{
            background:C.parchment, border:`1px solid ${C.warmStone}`,
            borderRadius:20, padding:'22px 20px 16px',
            opacity:0, animation:'ndUp 0.65s cubic-bezier(0.16,1,0.3,1) 60ms forwards',
          }}>
            <div style={{
              fontSize:10, fontWeight:600, letterSpacing:'0.16em',
              textTransform:'uppercase', color:C.driftwood, marginBottom:12, fontFamily:font.body,
            }}>
              {isDay ? '☀️' : '🌙'} Solar Circadian Rhythm
            </div>
            <SunArc sunrise={sunTimes?.sunrise} sunset={sunTimes?.sunset} now={now} />
          </div>

          {/* ── Signal Cards Grid ── */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',
            gap:14,
          }}>
            <EnvCard doctor="sun"      label="UV Index"    value={weather?.uv_index != null ? weather.uv_index.toFixed(1) : '—'} info={uvInfo}  delay={120} />
            <EnvCard doctor="air"      label="Air Quality" value={airData?.us_aqi  != null ? String(airData.us_aqi) : '—'}      info={aqInfo}  delay={200} />
            <EnvCard doctor="exercise" label="Temperature" value={weather?.temperature_2m != null ? `${Math.round(weather.temperature_2m)}°F` : '—'} info={tmpInfo} delay={280} />
            <EnvCard doctor="sleep"    label="Humidity"    value={weather?.relative_humidity_2m != null ? `${weather.relative_humidity_2m}%` : '—'}   info={humInfo} delay={360} />
          </div>

          {/* ── Coaching ── */}
          <CoachCard coaching={coaching} />
        </div>
      </div>
    </>
  );
}