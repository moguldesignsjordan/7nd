/**
 * 7ND — Home Dashboard (Fully Responsive)
 * ──────────────────────────────────────────────────────────────────
 * RESPONSIVE RULE: inline `style` is ONLY for brand colors/fonts.
 * ALL layout, spacing, sizing, visibility → Tailwind `className`.
 * Inline styles override classes at every breakpoint — mixing kills
 * responsive behavior.
 *
 * Breakpoints:
 *   default  = mobile (< 768px) — single column, bottom nav
 *   md       = tablet (768–1023px) — 2-col grids, no bottom nav
 *   lg       = desktop (1024+) — wider spacing, larger ring
 * ──────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from 'react';

// ─── Brand (inline style only — these never change per breakpoint) ─────────

const C = {
  forestDeep:  '#2C3A1E',
  livingGreen: '#5A7A28',
  sageGlow:    '#A8BC72',
  springLeaf:  '#C8D98A',
  solarGold:   '#D4A842',
  wheatLight:  '#E8C875',
  linen:       '#F7F4EE',
  parchment:   '#F0EBD8',
  warmStone:   '#E2DAC8',
  driftwood:   '#6B6449',
  bark:        '#2C2A1E',
};

const DOCTORS = {
  sun:      { emoji: '☀️', label: 'Sun',      bg: '#FFF8E0', border: '#E8C875', text: '#8B5E3C' },
  water:    { emoji: '💧', label: 'Water',    bg: '#E6F4FB', border: '#7EC8E3', text: '#2A6080' },
  air:      { emoji: '🌬️', label: 'Air',      bg: '#E8F4F0', border: '#80C4AA', text: '#2A6050' },
  diet:     { emoji: '🥗', label: 'Diet',     bg: '#EAF3DE', border: '#A8BC72', text: '#3A5020' },
  exercise: { emoji: '🏃', label: 'Exercise', bg: '#F5EDDE', border: '#C4956A', text: '#6B3C10' },
  sleep:    { emoji: '😴', label: 'Sleep',    bg: '#EDE8F5', border: '#A89ACC', text: '#4A3880' },
  stress:   { emoji: '🧠', label: 'Stress',   bg: '#F5EBE8', border: '#D4956A', text: '#7A2C10' },
};

const READINESS = {
  green:  { label: 'Thrive',  dot: '#5A7A28', bg: '#EAF3DE', border: '#A8BC72', text: '#3A5020', ring: '#5A7A28' },
  yellow: { label: 'Sustain', dot: '#D4A842', bg: '#FFF8E0', border: '#E8C875', text: '#7A5010', ring: '#D4A842' },
  red:    { label: 'Restore', dot: '#C4573A', bg: '#FAF0EC', border: '#D4956A', text: '#7A2C10', ring: '#C4573A' },
};

// ─── Personal scores ──────────────────────────────────────────────────────────

function buildScores(env) {
  const w = env?.weather, air = env?.air;
  const uv = w?.uv_index ?? 0;
  const gotSun = true;
  const hum = w?.relative_humidity_2m ?? 60;
  const aqi = air?.us_aqi ?? 50;
  const humPen = hum > 70 ? Math.round((hum - 60) * 0.6) : 0;
  return {
    sun:      { score: uv > 2 ? Math.min(95, 50 + uv * 7) : (gotSun ? 65 : 32), note: uv > 0 ? `UV ${uv.toFixed(1)} — get outside` : (gotSun ? 'Morning light ✓ — no UV now' : 'No sun today') },
    water:    { score: 81, note: '52/64 oz — 12 oz remaining' },
    air:      { score: aqi<=50?95:aqi<=100?72:aqi<=150?48:25, note: `AQI ${aqi} — ${aqi<=50?'ideal for outdoor breathing':'limit outdoor exertion'}` },
    diet:     { score: 64, note: '2/3 meals · 3 NO-supporting foods' },
    exercise: { score: 66, note: '35/45 min movement today' },
    sleep:    { score: Math.min(95, Math.round((6.5/8)*85) - humPen), note: `6.5h last night${humPen>0?` · humidity −${humPen}`:''}` },
    stress:   { score: 65, note: 'Self-reported: moderate' },
  };
}

function deriveReadiness(d) {
  const avg = Object.values(d).reduce((a,x)=>a+x.score,0)/7;
  return avg>=72?{tier:'green',score:Math.round(avg)}:avg>=50?{tier:'yellow',score:Math.round(avg)}:{tier:'red',score:Math.round(avg)};
}

function uvLabel(v){if(v==null)return'—';if(v<=.5)return'No UV';if(v<=2)return'Low';if(v<=5)return'Moderate';if(v<=7)return'High';if(v<=10)return'Very High';return'Extreme';}
function aqiLabel(v){if(v==null)return'—';if(v<=50)return'Good';if(v<=100)return'Moderate';return'Unhealthy';}
function humLabel(v){if(v==null)return'—';if(v<25)return'Dry';if(v<=60)return'Optimal';if(v<=75)return'Elevated';return'High';}

// ─── Readiness ring ───────────────────────────────────────────────────────────

function ReadinessRing({ score, tier, size }) {
  const rs = READINESS[tier];
  const sw = 8, r = (size - sw) / 2, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={rs.ring} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={`${(score/100)*circ} ${circ}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition:'stroke-dasharray 1.4s cubic-bezier(.22,1,.36,1)', filter:`drop-shadow(0 0 10px ${rs.ring}55)` }}
        />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontFamily:'"Playfair Display",serif', fontSize:size*0.3, fontWeight:600, color:'#F0EBD8', lineHeight:1 }}>{score}</div>
        <div style={{ fontSize:9, fontWeight:500, letterSpacing:'.14em', textTransform:'uppercase', color:rs.ring, marginTop:4 }}>{rs.label}</div>
      </div>
    </div>
  );
}

// ─── Sun arc ──────────────────────────────────────────────────────────────────

function SunArc({ sunrise, sunset, now }) {
  const VW=400,VH=115,cx=VW/2,cy=VH+10,r=VW/2-24,sx=cx-r,ex=cx+r,al=Math.PI*r;
  const isDay=now>=sunrise&&now<=sunset;
  const dp=Math.max(0,Math.min(1,(now-sunrise)/(sunset-sunrise)));
  const sX=cx-r*Math.cos(dp*Math.PI),sY=cy-r*Math.sin(dp*Math.PI);
  let nsr=new Date(sunrise);if(nsr<=now)nsr.setDate(nsr.getDate()+1);
  const pss=now<sunrise?new Date(sunset.getTime()-864e5):sunset;
  const np=Math.max(0,Math.min(1,(now-pss)/(nsr-pss)));
  const mX=cx-r*Math.cos((1-np)*Math.PI),mY=cy-r*Math.sin((1-np)*Math.PI);
  const ml=Math.max(0,Math.round((nsr-now)/6e4));
  const fmt=d=>d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  const dH=Math.round((sunset-sunrise)/36e5),dM=Math.round(((sunset-sunrise)%36e5)/6e4);
  return (
    <svg viewBox={`0 0 ${VW} ${VH+34}`} width="100%" style={{display:'block'}}>
      <path d={`M${sx} ${cy}A${r} ${r} 0 0 1${ex} ${cy}`} fill="none" stroke={C.warmStone} strokeWidth="2" strokeDasharray="4 8"/>
      {isDay?(<>{dp>.01&&<path d={`M${sx} ${cy}A${r} ${r} 0 0 1${ex} ${cy}`} fill="none" stroke={C.solarGold} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${al*dp} ${al}`}/>}<circle cx={sX} cy={sY} r={16} fill={C.solarGold} opacity=".12"/><circle cx={sX} cy={sY} r={8} fill={C.solarGold}/><circle cx={sX} cy={sY} r={8} fill="none" stroke={C.wheatLight} strokeWidth="1.5"/></>)
      :(<><path d={`M${sx} ${cy}A${r} ${r} 0 0 1${ex} ${cy}`} fill="none" stroke={C.solarGold} strokeWidth="1.5" opacity=".2"/><circle cx={mX} cy={mY} r={10} fill="#8FA0A8"/><circle cx={mX+5} cy={mY-3} r={8} fill={C.parchment}/><rect x={cx-76} y={cy-r*.52-14} width="152" height="26" rx="13" fill={C.warmStone} opacity=".6"/><text x={cx} y={cy-r*.52+4} textAnchor="middle" fontSize="11" fontWeight="500" fill={C.driftwood} fontFamily="DM Sans,sans-serif">Sunrise in {Math.floor(ml/60)}h {ml%60}m</text></>)}
      <line x1={sx-6} y1={cy} x2={ex+6} y2={cy} stroke={C.warmStone} strokeWidth="1"/>
      <text x={sx} y={cy+18} fontSize="10" fill={C.driftwood} fontFamily="DM Sans,sans-serif">{fmt(sunrise)}</text>
      <text x={cx} y={cy+18} textAnchor="middle" fontSize="10" fill="#8A7F5C" fontFamily="DM Sans,sans-serif">{dH}h {dM}m daylight</text>
      <text x={ex} y={cy+18} fontSize="10" fill={C.driftwood} fontFamily="DM Sans,sans-serif" textAnchor="end">{fmt(sunset)}</text>
    </svg>
  );
}

// ─── Doctor insight row ───────────────────────────────────────────────────────

function DoctorInsight({ id, score, note }) {
  const d = DOCTORS[id], warn = score < 50;
  return (
    <div className="flex items-center gap-3.5 p-3.5 rounded-[14px]"
      style={{ background:warn?d.bg:C.parchment, border:`1px solid ${warn?d.border:C.warmStone}` }}>
      <span className="text-[22px] shrink-0">{d.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-[13px] font-medium" style={{color:C.bark}}>{d.label}</span>
          <span className="text-[13px] font-semibold" style={{color:warn?d.text:score>=75?C.livingGreen:C.driftwood}}>{score}</span>
        </div>
        <div className="text-xs leading-snug" style={{color:C.driftwood}}>{note}</div>
      </div>
    </div>
  );
}

// ─── Env chip ─────────────────────────────────────────────────────────────────

function EnvChip({ icon, value, label }) {
  return (
    <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-full"
      style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)' }}>
      <span className="text-sm">{icon}</span>
      <div>
        <div className="text-[13px] font-medium leading-none" style={{color:'#F0EBD8'}}>{value}</div>
        <div className="text-[9px]" style={{color:C.sageGlow}}>{label}</div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [env,      setEnv]      = useState(null);
  const [envPhase, setEnvPhase] = useState('loading');
  const [location, setLocation] = useState(null);
  const [coaching, setCoaching] = useState(null);
  const [now,      setNow]      = useState(new Date());

  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),6e4);return()=>clearInterval(t);},[]);

  const reverseGeo = useCallback(async(lat,lon)=>{
    try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto&forecast_days=1`);const d=await r.json();setLocation(d.timezone?.split('/').pop()?.replace(/_/g,' ')||`${lat.toFixed(1)}°, ${lon.toFixed(1)}°`);}
    catch{setLocation(`${lat.toFixed(1)}°, ${lon.toFixed(1)}°`);}
  },[]);

  useEffect(()=>{
    if(!navigator.geolocation){setEnvPhase('error');return;}
    navigator.geolocation.getCurrentPosition(async({coords:{latitude:lat,longitude:lon}})=>{
      reverseGeo(lat,lon);
      try{
        const[wr,ar,sr]=await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,uv_index,apparent_temperature&timezone=auto&temperature_unit=fahrenheit`),
          fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5&timezone=auto`),
          fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`),
        ]);
        const[w,a,s]=await Promise.all([wr.json(),ar.json(),sr.json()]);
        setEnv({weather:w.current,air:a.current,sunTimes:{sunrise:new Date(s.results.sunrise),sunset:new Date(s.results.sunset)}});
        setEnvPhase('ready');
      }catch{setEnvPhase('error');}
    },()=>setEnvPhase('error'),{timeout:10_000});
  },[reverseGeo]);

  const doctors = buildScores(env);
  const {tier,score:rScore} = deriveReadiness(doctors);
  const rs=READINESS[tier], w=env?.weather, air=env?.air;
  const isDay = env?.sunTimes?(now>=env.sunTimes.sunrise&&now<=env.sunTimes.sunset):true;

  useEffect(()=>{
    if(envPhase!=='ready'||!env)return;
    const isNight=!isDay;
    const ds=Object.entries(doctors).map(([k,v])=>`${k}:${v.score}`).join(',');
    (async()=>{try{
      const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:400,
          system:'You are 7ND health coach. See personal scores + live environment. Grounded, specific, warm. Mention a biological mechanism. Nature-first. One clear action. 2–3 sentences. Return ONLY JSON: {"doctor":"sun|water|air|diet|exercise|sleep|stress","insight":"...","action":"..."}',
          messages:[{role:'user',content:`Scores:${ds}. UV ${w?.uv_index},AQI ${air?.us_aqi},${Math.round(w?.temperature_2m)}°F,${w?.relative_humidity_2m}% humidity.${isNight?' Night—recovery focus.':' Daytime.'}`}]})});
      const d=await r.json();
      setCoaching(JSON.parse((d.content?.[0]?.text??'{}').replace(/```json|```/g,'').trim()));
    }catch{
      setCoaching({doctor:isNight?'sleep':'sun',
        insight:isNight?`Your deepest cellular repair happens between 10 PM–2 AM, when growth hormone peaks. At ${w?.relative_humidity_2m}% humidity, cooling your room is critical — humid air reduces thermoregulation during slow-wave sleep.`
        :`UV at ${w?.uv_index?.toFixed(1)} means your skin can produce nitric oxide via photolysis right now. Even 10 minutes of morning light sets your circadian clock for the next 14 hours.`,
        action:isNight?'Cool your room to 65–68°F and block all light sources now.':'Get outside for 10 minutes of natural light before 9 AM.'});
    }})();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[envPhase]);

  const sorted = Object.entries(doctors).sort(([,a],[,b])=>a.score-b.score);
  const issues = sorted.filter(([,d])=>d.score<70).slice(0,4);
  const wins   = sorted.filter(([,d])=>d.score>=75).reverse().slice(0,3);
  const greeting = now.getHours()<12?'Good morning':now.getHours()<18?'Good afternoon':'Good evening';
  const dateStr = now.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
  const timeStr = now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  const cDoc = coaching?(DOCTORS[coaching.doctor]||DOCTORS.sun):null;

  return (
    <>
      <style>{`
        @keyframes nd-spin{to{transform:rotate(360deg)}}
        @keyframes nd-pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes nd-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .nd-up{animation:nd-up .45s cubic-bezier(.22,1,.36,1) both}
        .nd-d1{animation-delay:.06s}.nd-d2{animation-delay:.12s}
        .nd-d3{animation-delay:.18s}.nd-d4{animation-delay:.24s}
      `}</style>

      {/*
        ROOT CONTAINER
        ─ mobile:  max-w-[430px] centered, bottom padding for nav
        ─ md:      full width, no bottom padding
        ─ lg:      full width, more breathing room
        NO inline maxWidth — that's what was breaking it
      */}
      <div
        className="
          max-w-[430px] mx-auto pb-20
          md:max-w-full md:mx-0 md:pb-0
          lg:max-w-full
        "
        style={{ fontFamily:'"DM Sans",sans-serif', background:C.linen, minHeight:'100vh' }}
      >

        {/* ═══════════════ HERO ═══════════════ */}
        <div className="relative overflow-hidden px-5 pt-5 pb-7 md:px-10 md:pt-8 md:pb-10 lg:px-14 lg:pt-10 lg:pb-12"
          style={{ background:C.forestDeep }}>

          {/* Glow */}
          <div className="absolute -top-16 -right-16 w-60 h-60 md:w-80 md:h-80 rounded-full pointer-events-none"
            style={{ background:`radial-gradient(circle,${rs.ring}1A 0%,transparent 70%)` }}/>

          {/* Top — location + time */}
          <div className="nd-up flex justify-between items-center mb-4 md:mb-6">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">📍</span>
              <span className="text-[13px] md:text-sm font-medium" style={{color:C.springLeaf}}>
                {location||'Locating…'}
              </span>
            </div>
            <span className="text-xs md:text-sm" style={{color:'#6A7C50'}}>{dateStr} · {timeStr}</span>
          </div>

          {/* Greeting + ring + env chips */}
          <div className="nd-up nd-d1 flex justify-between items-center gap-5 md:gap-10">
            <div className="flex-1 min-w-0">
              {/* Greeting */}
              <div className="mb-2 md:mb-3 text-2xl md:text-3xl lg:text-4xl"
                style={{fontFamily:'"Playfair Display",serif',color:'#F0EBD8',lineHeight:1.2}}>
                {greeting}.
              </div>

              {/* Readiness badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 md:mb-5"
                style={{background:rs.bg,border:`1px solid ${rs.border}`}}>
                <span className="w-2 h-2 rounded-full block" style={{background:rs.dot}}/>
                <span className="text-[10px] md:text-xs font-medium tracking-wider uppercase" style={{color:rs.text}}>
                  {rs.label} · {rScore}/100
                </span>
              </div>

              {/* Env chips */}
              {envPhase==='ready'&&w?(
                <div className="nd-up nd-d2 flex flex-wrap gap-2">
                  <EnvChip icon="☀️" value={w.uv_index?.toFixed(1)??'—'} label={uvLabel(w.uv_index)}/>
                  <EnvChip icon="🌬️" value={air?.us_aqi??'—'} label={aqiLabel(air?.us_aqi)}/>
                  <EnvChip icon="🌡️" value={`${Math.round(w.temperature_2m)}°F`} label={`${w.relative_humidity_2m}% · ${humLabel(w.relative_humidity_2m)}`}/>
                </div>
              ):(
                <div className="flex gap-2 flex-wrap">
                  {['UV','AQI','Temp'].map(l=>(
                    <div key={l} className="px-3 py-1.5 rounded-full text-xs"
                      style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'#6A7C50',animation:'nd-pulse 2s infinite'}}>
                      {l} —
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ring — three sizes for three breakpoints */}
            <div className="md:hidden">
              <ReadinessRing score={rScore} tier={tier} size={108}/>
            </div>
            <div className="hidden md:block lg:hidden">
              <ReadinessRing score={rScore} tier={tier} size={148}/>
            </div>
            <div className="hidden lg:block">
              <ReadinessRing score={rScore} tier={tier} size={172}/>
            </div>
          </div>
        </div>

        {/* ═══════════════ CONTENT ═══════════════ */}
        <div className="px-4 pt-5 md:px-10 md:pt-8 lg:px-14 lg:pt-10 flex flex-col gap-4 md:gap-5 lg:gap-6">

          {/*
            ── TOP ROW: Coaching + Doctor Insights ──
            Mobile:  stacked
            md:      coaching left (60%), doctors right (40%)
            lg:      same ratio, more room
          */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">

            {/* Coaching — spans 3/5 on desktop */}
            <div className="md:col-span-3">
              {coaching&&cDoc?(
                <div className="nd-up nd-d2 rounded-[18px] p-5 md:p-6 lg:p-8 h-full"
                  style={{background:cDoc.bg,border:`1px solid ${cDoc.border}`}}>
                  <div className="text-[9px] md:text-[10px] font-medium tracking-[.16em] uppercase mb-3"
                    style={{color:cDoc.text}}>
                    {cDoc.emoji} Right Now · {cDoc.label} Doctor
                  </div>
                  <p className="text-sm md:text-[15px] leading-[1.8] mb-4" style={{color:C.bark}}>
                    {coaching.insight}
                  </p>
                  <div className="flex items-start gap-2.5 p-3 md:p-4 rounded-xl"
                    style={{background:'rgba(255,255,255,.55)',border:`1px solid ${cDoc.border}`}}>
                    <span className="text-sm shrink-0 mt-0.5" style={{color:cDoc.text}}>→</span>
                    <span className="text-[13px] md:text-sm font-medium leading-snug" style={{color:cDoc.text}}>
                      {coaching.action}
                    </span>
                  </div>
                </div>
              ):(
                <div className="rounded-[18px] p-5 h-full" style={{background:C.parchment,border:`1px solid ${C.warmStone}`}}>
                  <div className="text-xs" style={{color:C.driftwood,animation:'nd-pulse 2s infinite'}}>Loading coaching…</div>
                </div>
              )}
            </div>

            {/* Doctor insights — spans 2/5 on desktop */}
            <div className="nd-up nd-d3 md:col-span-2 flex flex-col gap-3">
              {issues.length>0&&(
                <div>
                  <div className="text-[9px] md:text-[10px] font-medium tracking-[.18em] uppercase mb-2" style={{color:C.driftwood}}>Needs Attention</div>
                  <div className="flex flex-col gap-2">
                    {issues.map(([id,d])=><DoctorInsight key={id} id={id} score={d.score} note={d.note}/>)}
                  </div>
                </div>
              )}
              {wins.length>0&&(
                <div>
                  <div className="text-[9px] md:text-[10px] font-medium tracking-[.18em] uppercase mb-2" style={{color:C.driftwood}}>Looking Good</div>
                  <div className="flex flex-col gap-2">
                    {wins.map(([id,d])=><DoctorInsight key={id} id={id} score={d.score} note={d.note}/>)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/*
            ── BOTTOM ROW: Solar + NO Score ──
            Mobile:  stacked
            md:      side by side
          */}
          <div className="nd-up nd-d4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* Solar */}
            {env?.sunTimes&&(
              <div className="rounded-[18px] p-4 md:p-5 lg:p-6"
                style={{background:C.parchment,border:`1px solid ${C.warmStone}`}}>
                <div className="text-[9px] md:text-[10px] font-medium tracking-[.18em] uppercase mb-2" style={{color:C.driftwood}}>
                  {isDay?'☀️':'🌙'} Solar Window
                </div>
                <SunArc sunrise={env.sunTimes.sunrise} sunset={env.sunTimes.sunset} now={now}/>
              </div>
            )}

            {/* NO score */}
            <div className="rounded-[18px] p-4 md:p-5 lg:p-6"
              style={{background:C.parchment,border:`1px solid ${C.warmStone}`}}>
              <div className="flex justify-between items-center mb-2.5">
                <div className="text-[9px] md:text-[10px] font-medium tracking-[.18em] uppercase" style={{color:C.driftwood}}>🧬 Nitric Oxide</div>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:22,color:C.bark}}>
                  68<span className="text-xs" style={{color:C.driftwood}}>/100</span>
                </div>
              </div>
              <div className="rounded-full overflow-hidden mb-3" style={{height:6,background:C.warmStone}}>
                <div className="h-full rounded-full" style={{width:'68%',background:C.solarGold,transition:'width 1.2s cubic-bezier(.22,1,.36,1)'}}/>
              </div>
              <div className="text-xs md:text-[13px] leading-relaxed" style={{color:C.driftwood}}>
                Morning sun + nasal breathing + leafy greens are your NO levers today.
              </div>
            </div>
          </div>

          {/* ── Check-in CTA ── */}
          <div className="nd-up nd-d4 rounded-[18px] flex justify-between items-center px-5 py-4 md:px-6 md:py-5"
            style={{background:C.forestDeep}}>
            <div>
              <div className="text-[10px] md:text-xs font-medium tracking-[.16em] uppercase mb-1" style={{color:C.sageGlow}}>
                {now.getHours()<12?'Morning':now.getHours()<18?'Midday':'Evening'} Check-in
              </div>
              <div className="text-[15px] md:text-base" style={{fontFamily:'"Playfair Display",serif',color:'#F0EBD8'}}>
                Update your scores
              </div>
            </div>
            <button className="rounded-xl text-sm font-medium cursor-pointer min-w-[44px] min-h-[44px]"
              style={{background:C.livingGreen,color:'#F0EBD8',border:'none',padding:'12px 20px',fontFamily:'"DM Sans",sans-serif'}}>
              Start →
            </button>
          </div>

          {/* Attribution */}
          <div className="flex gap-2 flex-wrap opacity-70 pb-4 md:pb-8">
            {['Open-Meteo · Weather','Open-Meteo · AQI','Sunrise-Sunset.org'].map(s=>(
              <div key={s} className="text-[9px] px-2.5 py-1 rounded-full"
                style={{color:'#8A7F5C',background:C.parchment,border:`1px solid ${C.warmStone}`}}>{s}</div>
            ))}
          </div>
        </div>

        {/*
          ═══════════════ BOTTOM NAV ═══════════════
          MOBILE ONLY — hidden on md+ where sidebar handles navigation
        */}
        <div className="
          fixed bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-around
          md:hidden
        " style={{
          maxWidth:430, background:'rgba(247,244,238,0.92)', backdropFilter:'blur(16px)',
          borderTop:`1px solid ${C.warmStone}`,
          padding:'10px 0 max(8px, env(safe-area-inset-bottom))',
        }}>
          {[
            {icon:'🏠',label:'Home',active:true},
            {icon:'📋',label:'Plan',active:false},
            {icon:'✓',label:'Check In',active:false},
            {icon:'🍽️',label:'Meals',active:false},
            {icon:'👤',label:'Profile',active:false},
          ].map(t=>(
            <button key={t.label} className="flex flex-col items-center gap-0.5 border-none cursor-pointer bg-transparent min-w-[44px] min-h-[44px] p-1.5">
              <span className="text-lg" style={{opacity:t.active?1:.4}}>{t.icon}</span>
              <span className="text-[9px]" style={{fontWeight:t.active?600:400,color:t.active?C.livingGreen:C.driftwood}}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}