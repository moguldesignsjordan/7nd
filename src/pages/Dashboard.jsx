/**
 * 7ND — Home Dashboard + AI Doctor Chat
 * Clean health dashboard with a bottom-anchored AI doctor chat panel.
 * Quick notes, free-form chat, and context-aware coaching.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

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

/* ── Weather codes ────────────────────────────────────────────── */
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

/* ── Quick note chips ─────────────────────────────────────────── */
const QUICK_NOTES = [
  { label:'Slept well',        icon:'😴', prompt:'I slept really well last night.' },
  { label:'Restless sleep',    icon:'🌙', prompt:'I had a restless night and feel tired.' },
  { label:'Feeling energized', icon:'⚡', prompt:'I feel really energized today.' },
  { label:'Low energy',        icon:'😔', prompt:'My energy is low today.' },
  { label:'Went outside',      icon:'🌿', prompt:'I just spent time outside in the sun.' },
  { label:'Headache',          icon:'🤕', prompt:'I have a headache right now.' },
  { label:'Good workout',      icon:'🏃', prompt:'I had a great workout today.' },
  { label:'Feeling stressed',  icon:'🧠', prompt:'I am feeling stressed today.' },
];

/* ── Scoring helpers ──────────────────────────────────────────── */
function scoreUV(uv) {
  if (uv == null) return { score:0, label:'…', tip:'Syncing satellite data…' };
  if (uv <= 0.5)  return { score:32, label:'No UV',    tip:'Minimal D3 window. Morning light still anchors your circadian clock.' };
  if (uv <= 2)    return { score:52, label:'Low',       tip:'Low nitric oxide stimulus. Any outdoor time beats none.' };
  if (uv <= 5)    return { score:82, label:'Moderate',  tip:'Good window for vitamin D and nitric oxide production.' };
  if (uv <= 7)    return { score:95, label:'High',      tip:'Prime solar window. 15–20 min maximises NO production.' };
  if (uv <= 10)   return { score:70, label:'Very High', tip:'Limit midday exposure. Morning is optimal.' };
  return            { score:38, label:'Extreme',  tip:'Seek shade. Keep exposure short and early morning only.' };
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
   UI SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function ScoreRing({ score, color, size=52, delay=0 }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120 + delay);
    return () => clearTimeout(t);
  }, [delay]);
  const sw = 4.5, r = (size - sw * 2) / 2, circ = 2 * Math.PI * r;
  const filled = mounted && score ? (score / 100) * circ : 0;
  return (
    <svg width={size} height={size} style={{ flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.warmStone} strokeWidth={sw} opacity="0.35"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition:'stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}/>
      <text x={size/2} y={size/2+4.5} textAnchor="middle" fontSize="13" fontWeight="600"
        fill={score ? C.bark : C.warmStone} fontFamily={font.body}>{score || '—'}</text>
    </svg>
  );
}

function SunArc({ sunrise, sunset, now }) {
  if (!sunrise || !sunset) {
    return (
      <div style={{ height:120, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:C.driftwood, opacity:0.6, fontFamily:font.body }}>Calculating trajectory…</span>
      </div>
    );
  }
  const VW=440, VH=130, cx=VW/2, cy=VH+10, r=VW/2-28;
  const sx=cx-r, ex=cx+r, arcLen=Math.PI*r;
  const isDay=now>=sunrise&&now<=sunset;
  const dayProg=Math.max(0,Math.min(1,(now-sunrise)/(sunset-sunrise)));
  const sunX=cx-r*Math.cos(dayProg*Math.PI), sunY=cy-r*Math.sin(dayProg*Math.PI);
  let nextSR=new Date(sunrise); if(nextSR<=now) nextSR.setDate(nextSR.getDate()+1);
  const prevSS=now<sunrise?new Date(sunset.getTime()-864e5):sunset;
  const nightProg=Math.max(0,Math.min(1,(now-prevSS)/(nextSR-prevSS)));
  const moonX=cx-r*Math.cos((1-nightProg)*Math.PI), moonY=cy-r*Math.sin((1-nightProg)*Math.PI);
  const minsLeft=Math.max(0,Math.round((nextSR-now)/6e4));
  const fmt=d=>d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  return (
    <svg viewBox={`0 0 ${VW} ${VH+36}`} width="100%" style={{ display:'block', overflow:'visible' }}>
      <path d={`M ${sx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${cy}`} fill="none" stroke={C.warmStone} strokeWidth="2" strokeDasharray="4 8" opacity="0.55"/>
      {isDay ? (
        <>
          {dayProg>0.01 && <path d={`M ${sx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${cy}`} fill="none" stroke={C.solarGold} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${arcLen*dayProg} ${arcLen}`} style={{filter:'drop-shadow(0 0 3px rgba(212,168,66,0.3))'}}/>}
          <circle cx={sunX} cy={sunY} r={20} fill={C.solarGold} opacity="0.08"><animate attributeName="r" values="18;24;18" dur="4s" repeatCount="indefinite"/></circle>
          <circle cx={sunX} cy={sunY} r={10} fill={C.solarGold} style={{filter:'drop-shadow(0 0 5px rgba(212,168,66,0.45))'}}/>
          <circle cx={sunX} cy={sunY} r={10} fill="none" stroke={C.wheatLight} strokeWidth="1.5"/>
        </>
      ) : (
        <>
          <path d={`M ${sx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${cy}`} fill="none" stroke={C.solarGold} strokeWidth="1.5" opacity="0.15"/>
          <circle cx={moonX} cy={moonY} r={10} fill="#8FA0A8"/>
          <circle cx={moonX+5} cy={moonY-2.5} r={8} fill={C.parchment}/>
          <text x={cx} y={cy-r*0.48} textAnchor="middle" fontSize="11" fontWeight="500" fill={C.driftwood} fontFamily={font.body}>Next sunrise in {Math.floor(minsLeft/60)}h {minsLeft%60}m</text>
        </>
      )}
      <line x1={sx-8} y1={cy} x2={ex+8} y2={cy} stroke={C.warmStone} strokeWidth="1" opacity="0.5"/>
      <text x={sx} y={cy+20} fontSize="10" fill={C.driftwood} fontFamily={font.body}>{fmt(sunrise)}</text>
      <text x={ex} y={cy+20} fontSize="10" fill={C.driftwood} fontFamily={font.body} textAnchor="end">{fmt(sunset)}</text>
    </svg>
  );
}

function ReadinessBadge({ tier }) {
  if (!tier) return null;
  const s = READINESS[tier];
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:20, background:s.bg, border:`1px solid ${s.border}` }}>
      <span style={{ width:7, height:7, borderRadius:'50%', display:'block', flexShrink:0, background:s.dot, boxShadow:`0 0 6px ${s.dot}66` }}/>
      <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:s.text, fontFamily:font.body }}>{s.label}</span>
    </div>
  );
}

function EnvCard({ doctor, label, value, info, delay=0 }) {
  const d = DOCTORS[doctor];
  return (
    <div style={{ background:d.bg, border:`1px solid ${d.border}`, borderRadius:20, padding:'18px 16px', display:'flex', flexDirection:'column', gap:10, opacity:0, animation:`ndUp 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms forwards` }}>
      <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:d.text, fontFamily:font.body, whiteSpace:'nowrap' }}>{d.emoji} {label}</div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:font.display, fontSize:26, color:C.bark, lineHeight:1 }}>{value}</div>
        <ScoreRing score={info.score} color={d.ring} delay={delay+200}/>
      </div>
      <div>
        <div style={{ fontSize:12, fontWeight:600, color:d.text, marginBottom:2, fontFamily:font.body }}>{info.label}</div>
        <div style={{ fontSize:11, lineHeight:1.45, color:C.driftwood, fontFamily:font.body }}>{info.tip}</div>
      </div>
    </div>
  );
}

function CoachCard({ coaching }) {
  if (!coaching) {
    return (
      <div style={{ height:120, display:'flex', alignItems:'center', justifyContent:'center', background:C.parchment, border:`1px dashed ${C.warmStone}`, borderRadius:20, opacity:0, animation:'ndUp 0.65s cubic-bezier(0.16,1,0.3,1) 500ms forwards' }}>
        <span style={{ fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:C.driftwood, fontFamily:font.body }}>Analyzing biometrics…</span>
      </div>
    );
  }
  const d = DOCTORS[coaching.doctor] || DOCTORS.sun;
  return (
    <div style={{ background:d.bg, border:`1px solid ${d.border}`, borderRadius:20, padding:'20px 22px', opacity:0, animation:'ndUp 0.65s cubic-bezier(0.16,1,0.3,1) 500ms forwards' }}>
      <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase', color:d.text, marginBottom:14, fontFamily:font.body }}>{d.emoji} {d.label} Coaching</div>
      <p style={{ fontSize:15, lineHeight:1.65, color:C.bark, margin:'0 0 16px', fontFamily:font.body }}>{coaching.insight}</p>
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', borderRadius:14, background:'rgba(255,255,255,0.65)', border:'1px solid rgba(255,255,255,0.8)' }}>
        <span style={{ fontSize:14, color:d.text, flexShrink:0, marginTop:1 }}>→</span>
        <span style={{ fontSize:13, fontWeight:600, lineHeight:1.45, color:d.text, fontFamily:font.body }}>{coaching.action}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INLINE AI DOCTOR CHAT
   ═══════════════════════════════════════════════════════════════ */

function buildSystemPrompt(envContext) {
  const { location, weather, airData, readiness, uvInfo, aqInfo, humInfo, tmpInfo } = envContext;
  const time = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  const date = new Date().toLocaleDateString([], { weekday:'long', month:'long', day:'numeric' });
  return `You are the 7ND natural health doctor — a warm, knowledgeable guide grounded in the Seven Natural Doctors framework: Sun, Air, Exercise, Sleep, Water, Diet, and Stress management.

Today's live environment for the user (${location}):
- Date & time: ${date} at ${time}
- Temperature: ${weather?.temperature_2m != null ? `${Math.round(weather.temperature_2m)}°F (${tmpInfo?.label})` : 'unknown'}
- UV Index: ${weather?.uv_index != null ? `${weather.uv_index.toFixed(1)} (${uvInfo?.label}, score ${uvInfo?.score}/100)` : 'unknown'}
- Air Quality AQI: ${airData?.us_aqi != null ? `${airData.us_aqi} (${aqInfo?.label}, score ${aqInfo?.score}/100)` : 'unknown'}
- Humidity: ${weather?.relative_humidity_2m != null ? `${weather.relative_humidity_2m}% (${humInfo?.label}, score ${humInfo?.score}/100)` : 'unknown'}
- Readiness tier: ${readiness ? readiness.toUpperCase() : 'calculating'}

Your personality and rules:
- Warm, honest, and direct — never clinical, never preachy
- Root every response in a specific biological mechanism
- Nature-first: suggest outdoor and behavioral solutions before supplements or biohacking
- Keep responses concise: 2–4 sentences for logged notes, 3–6 sentences for questions
- When the user logs a quick note, acknowledge it warmly and give one biologically-grounded insight tied to their current environment data
- Reference the live environmental data naturally when relevant
- Never give alarming medical diagnoses — you support natural health, not replace doctors
- Plain conversational text only — no markdown, no bullet lists, no headers`;
}



function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const isNote = message.isNote;
  return (
    <div style={{ display:'flex', justifyContent:isUser?'flex-end':'flex-start', marginBottom:12 }}>
      {!isUser && (
        <div style={{ width:30, height:30, borderRadius:'50%', flexShrink:0, background:C.forestDeep, display:'flex', alignItems:'center', justifyContent:'center', marginRight:10, marginTop:2, gap:1 }}>
          <span style={{ fontFamily:font.display, fontSize:13, fontWeight:600, color:C.springLeaf, lineHeight:1 }}>7</span>
          <span style={{ fontFamily:font.display, fontSize:7, fontStyle:'italic', color:C.sageGlow }}>ND</span>
        </div>
      )}
      <div style={{
        maxWidth:'80%',
        padding: isNote ? '9px 14px' : '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
        background: isNote ? C.meadowMist : isUser ? C.forestDeep : '#fff',
        border: isNote
          ? `1px solid ${C.sageGlow}`
          : isUser ? 'none'
          : `1px solid ${C.warmStone}`,
        boxShadow: isUser ? 'none' : '0 1px 4px rgba(44,58,30,0.06)',
      }}>
        {isNote && (
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.livingGreen, marginBottom:5, fontFamily:font.body }}>
            📝 Note logged
          </div>
        )}
        <p style={{ margin:0, fontSize:14, lineHeight:1.6, color: isUser && !isNote ? C.springLeaf : C.bark, fontFamily:font.body }}>
          {message.content}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
      <div style={{ width:30, height:30, borderRadius:'50%', flexShrink:0, background:C.forestDeep, display:'flex', alignItems:'center', justifyContent:'center', gap:1 }}>
        <span style={{ fontFamily:font.display, fontSize:13, fontWeight:600, color:C.springLeaf }}>7</span>
        <span style={{ fontFamily:font.display, fontSize:7, fontStyle:'italic', color:C.sageGlow }}>ND</span>
      </div>
      <div style={{ padding:'12px 16px', borderRadius:'4px 18px 18px 18px', background:'#fff', border:`1px solid ${C.warmStone}`, display:'flex', gap:5, alignItems:'center', boxShadow:'0 1px 4px rgba(44,58,30,0.06)' }}>
        {[0,1,2].map(i => (
          <span key={i} style={{ width:6, height:6, borderRadius:'50%', display:'block', background:C.sageGlow, animation:`typingDot 1.2s ease-in-out ${i*0.22}s infinite` }}/>
        ))}
      </div>
    </div>
  );
}

function InlineDoctorChat({ envContext }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const messagesEndRef           = useRef(null);
  const inputRef                 = useRef(null);

  /* greeting on mount — waits for readiness to resolve */
  const greeted = useRef(false);
  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const tier = envContext.readiness;
    const tierMsg = tier === 'green'
      ? 'Your environment is strong today — ideal conditions to thrive.'
      : tier === 'yellow'
      ? 'Conditions are moderate today. Let\'s make the most of what we have.'
      : tier === 'red'
      ? 'Today is a restoration day. Let\'s work with your environment.'
      : 'Reading your environment now…';
    setMessages([{
      role:'assistant',
      content:`${greeting}. ${tierMsg} How are you feeling today? Tap a quick note or ask me anything.`,
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text, isNote=false) => {
    if (!text.trim() || loading) return;
    const userMsg = { role:'user', content:text, isNote };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          system:buildSystemPrompt(envContext),
          messages:next.map(m => ({ role:m.role, content:m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type==='text')?.text
        || 'Couldn\'t get a response. Please try again.';
      setMessages(prev => [...prev, { role:'assistant', content:reply }]);
    } catch {
      setMessages(prev => [...prev, { role:'assistant', content:'Having trouble connecting. Check your network and try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background:'#fff',
      border:`1px solid ${C.warmStone}`,
      borderRadius:20,
      overflow:'hidden',
      opacity:0,
      animation:'ndUp 0.65s cubic-bezier(0.16,1,0.3,1) 580ms forwards',
      boxShadow:'0 2px 12px rgba(44,58,30,0.07)',
    }}>

      {/* ── Section header ── */}
      <div style={{
        display:'flex', alignItems:'center', gap:10,
        padding:'16px 18px 14px',
        borderBottom:`1px solid ${C.warmStone}`,
        background:C.parchment,
      }}>
        <div style={{ width:32, height:32, borderRadius:'50%', background:C.forestDeep, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, gap:1 }}>
          <span style={{ fontFamily:font.display, fontSize:14, fontWeight:600, color:C.springLeaf }}>7</span>
          <span style={{ fontFamily:font.display, fontSize:8, fontStyle:'italic', color:C.sageGlow }}>ND</span>
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:C.bark, fontFamily:font.body, lineHeight:1.2 }}>AI Doctor</div>
          <div style={{ fontSize:11, color:C.driftwood, fontFamily:font.body, opacity:0.8 }}>
            {loading ? 'Thinking…' : 'Ask anything · log a note'}
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{ padding:'16px 16px 8px', maxHeight:340, overflowY:'auto', scrollbarWidth:'none' }}>
        {messages.map((msg, i) => <ChatBubble key={i} message={msg}/>)}
        {loading && <TypingIndicator/>}
        <div ref={messagesEndRef}/>
      </div>

      {/* ── Quick note chips ── */}
      <div style={{ padding:'4px 14px 10px', display:'flex', gap:7, overflowX:'auto', scrollbarWidth:'none' }}>
        {QUICK_NOTES.map(chip => (
          <button
            key={chip.label}
            onClick={() => sendMessage(chip.prompt, true)}
            disabled={loading}
            style={{
              flexShrink:0, padding:'6px 12px', borderRadius:20,
              border:`1px solid ${C.warmStone}`, background:C.linen,
              cursor:loading?'not-allowed':'pointer', opacity:loading?0.5:1,
              fontSize:11, fontWeight:500, color:C.driftwood,
              fontFamily:font.body, whiteSpace:'nowrap',
              display:'flex', alignItems:'center', gap:5,
              transition:'background 0.12s, border-color 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background=C.warmStone; e.currentTarget.style.borderColor=C.driftwood; }}
            onMouseLeave={e => { e.currentTarget.style.background=C.linen; e.currentTarget.style.borderColor=C.warmStone; }}
          >
            <span>{chip.icon}</span>
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* ── Input row ── */}
      <div style={{ padding:'0 12px 14px', display:'flex', gap:8, alignItems:'flex-end' }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
          }}
          onInput={e => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
          }}
          placeholder="Ask your doctor or add a note…"
          rows={1}
          style={{
            flex:1, resize:'none',
            border:`1.5px solid ${C.warmStone}`,
            borderRadius:16, padding:'11px 15px',
            fontSize:14, lineHeight:1.5, fontFamily:font.body,
            color:C.bark, background:C.linen,
            outline:'none', maxHeight:100,
            overflowY:'auto', scrollbarWidth:'none',
            transition:'border-color 0.15s',
          }}
          onFocus={e  => { e.target.style.borderColor = C.sageGlow; }}
          onBlur={e   => { e.target.style.borderColor = C.warmStone; }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          style={{
            width:42, height:42, borderRadius:'50%', flexShrink:0,
            background: input.trim() && !loading ? C.livingGreen : C.warmStone,
            border:'none',
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'background 0.2s, transform 0.1s',
          }}
          onMouseDown={e => { if (input.trim()) e.currentTarget.style.transform='scale(0.9)'; }}
          onMouseUp={e   => { e.currentTarget.style.transform='scale(1)'; }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5L8 3L13 8.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 3V13" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
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

  const fetchCoaching = useCallback(({ uv, aqi, humidity, isNight }) => {
    setCoaching(isNight ? {
      doctor:'sleep',
      insight:`Cellular repair peaks between 10 PM and 2 AM. Humidity at ${humidity}% ${humidity>60?'is elevated — heavy air fragments sleep architecture.':'is in a good range for deep sleep'}.`,
      action:'Cool your room to 65–68 °F and eliminate all ambient light.',
    } : {
      doctor:'sun',
      insight:`Morning light is your circadian anchor. Air quality at ${aqi} AQI means ${aqi<=50?'outdoor nasal breathing is ideal right now':'moderate your outdoor intensity today'}.`,
      action:'Get outside within 30 minutes of waking for 10+ minutes of natural light.',
    });
  }, []);

  const fetchData = useCallback(async (lat, lon, isFallback=false) => {
    try {
      const [wR,aR,sR,locR] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,uv_index,apparent_temperature,weathercode&timezone=auto&temperature_unit=fahrenheit`),
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5&timezone=auto`),
        fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`),
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`),
      ]);
      if (!wR.ok||!aR.ok||!sR.ok) throw new Error('sync failed');
      const [w,a,s,loc] = await Promise.all([wR.json(),aR.json(),sR.json(),locR.json()]);
      const sr=new Date(s.results.sunrise), ss=new Date(s.results.sunset);
      const isNight=new Date()<sr||new Date()>ss;
      setLocation(isFallback?'Headland, AL':(loc.city||loc.locality||loc.principalSubdivision||'Your Area'));
      setWeather(w.current); setAirData(a.current);
      setSunTimes({ sunrise:sr, sunset:ss });
      fetchCoaching({ uv:w.current.uv_index, aqi:a.current.us_aqi, temp:Math.round(w.current.temperature_2m), humidity:w.current.relative_humidity_2m, isNight });
    } catch { setError('Using cached data due to network restrictions.'); }
  }, [fetchCoaching]);

  useEffect(() => {
    const FB={lat:31.3504,lon:-85.3432};
    if (!navigator.geolocation) { fetchData(FB.lat,FB.lon,true); return; }
    navigator.geolocation.getCurrentPosition(
      p => fetchData(p.coords.latitude,p.coords.longitude),
      () => { setError('Location blocked. Defaulting to Headland, AL.'); fetchData(FB.lat,FB.lon,true); },
      { timeout:8000 },
    );
  }, [fetchData]);

  const uvInfo    = scoreUV(weather?.uv_index);
  const aqInfo    = scoreAQI(airData?.us_aqi);
  const humInfo   = scoreHumidity(weather?.relative_humidity_2m);
  const tmpInfo   = scoreTemp(weather?.temperature_2m);
  const readiness = weather&&airData ? deriveReadiness(uvInfo.score,aqInfo.score,humInfo.score) : null;
  const isDay     = sunTimes ? (now>=sunTimes.sunrise&&now<=sunTimes.sunset) : true;
  const envContext = { location, weather, airData, readiness, uvInfo, aqInfo, humInfo, tmpInfo };

  return (
    <>
      <style>{`
        @keyframes ndUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes typingDot { 0%,60%,100%{opacity:0.3;transform:translateY(0)} 30%{opacity:1;transform:translateY(-3px)} }
      `}</style>

      <div style={{ width:'100%', minHeight:'100vh', fontFamily:font.body, background:C.linen, display:'flex', flexDirection:'column', paddingBottom:100 }}>

        {/* HEADER */}
        <div style={{ background:C.forestDeep, borderRadius:'0 0 28px 28px', padding:'16px 24px 28px', boxShadow:'0 8px 24px -8px rgba(44,58,30,0.25)', position:'relative', zIndex:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:12 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:C.sageGlow, fontFamily:font.body }}>{location.toUpperCase()}</span>
              <div style={{ fontFamily:font.display, fontSize:30, fontWeight:400, color:C.parchment, lineHeight:1.1 }}>{getWeatherDesc(weather?.weathercode)}</div>
            </div>
            <ReadinessBadge tier={readiness}/>
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding:'24px 20px 0', maxWidth:960, width:'100%', margin:'0 auto', display:'flex', flexDirection:'column', gap:16 }}>

          {error && (
            <div style={{ fontSize:11, fontWeight:500, padding:'10px 16px', borderRadius:14, color:C.richEarth, background:'rgba(232,200,117,0.15)', border:'1px solid rgba(232,200,117,0.35)', fontFamily:font.body }}>
              ⚠️ {error}
            </div>
          )}

          {/* Solar arc */}
          <div style={{ background:C.parchment, border:`1px solid ${C.warmStone}`, borderRadius:20, padding:'22px 20px 16px', opacity:0, animation:'ndUp 0.65s cubic-bezier(0.16,1,0.3,1) 60ms forwards' }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.16em', textTransform:'uppercase', color:C.driftwood, marginBottom:12, fontFamily:font.body }}>{isDay?'☀️':'🌙'} Solar Circadian Rhythm</div>
            <SunArc sunrise={sunTimes?.sunrise} sunset={sunTimes?.sunset} now={now}/>
          </div>

          {/* Env cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:14 }}>
            <EnvCard doctor="sun"      label="UV Index"    value={weather?.uv_index!=null?weather.uv_index.toFixed(1):'—'} info={uvInfo}  delay={120}/>
            <EnvCard doctor="air"      label="Air Quality" value={airData?.us_aqi!=null?String(airData.us_aqi):'—'}        info={aqInfo}  delay={200}/>
            <EnvCard doctor="exercise" label="Temperature" value={weather?.temperature_2m!=null?`${Math.round(weather.temperature_2m)}°F`:'—'} info={tmpInfo} delay={280}/>
            <EnvCard doctor="sleep"    label="Humidity"    value={weather?.relative_humidity_2m!=null?`${weather.relative_humidity_2m}%`:'—'}   info={humInfo} delay={360}/>
          </div>

          {/* Coaching */}
          <CoachCard coaching={coaching}/>

          {/* Inline AI Doctor Chat */}
          <InlineDoctorChat envContext={envContext}/>
        </div>
      </div>
    </>
  );
}