import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'
import { createUserProfile } from '../hooks/useFirestore'

export default function Auth() {
  const navigate  = useNavigate()
  const [mode, setMode]       = useState('login')   // 'login' | 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const clearError = () => setError('')

  // ── After auth: check if onboarding done ──────────────────────────────────
  async function handlePostAuth(uid) {
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists() || !snap.data().onboardingComplete) {
      navigate('/onboarding', { replace: true })
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  // ── Email / password ──────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'signup') {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await createUserProfile(user.uid, { name, email })
        navigate('/onboarding', { replace: true })
      } else {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        await handlePostAuth(user.uid)
      }
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  // ── Google ────────────────────────────────────────────────────────────────
  async function handleGoogle() {
    setLoading(true)
    setError('')
    try {
      const { user } = await signInWithPopup(auth, googleProvider)
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (!snap.exists()) {
        await createUserProfile(user.uid, {
          name: user.displayName || '',
          email: user.email,
        })
        navigate('/onboarding', { replace: true })
      } else {
        await handlePostAuth(user.uid)
      }
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--color-forest-deep)',
    }}>
      {/* ── Left panel — branding (desktop only) ── */}
      <div className="auth-brand-panel" style={{
        flex: 1,
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(168,188,114,0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 48 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 600, color: 'var(--color-spring-leaf)', letterSpacing: '-0.02em' }}>7</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontStyle: 'italic', fontWeight: 400, color: 'var(--color-sage-glow)' }}>ND</span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 400,
          color: 'var(--color-spring-leaf)', lineHeight: 1.15, marginBottom: 20,
        }}>
          Align with<br /><em style={{ color: 'var(--color-meadow-mist)' }}>your nature.</em>
        </h2>
        <p style={{
          fontSize: 15, color: 'var(--color-sage-glow)',
          lineHeight: 1.75, maxWidth: 360, opacity: 0.8,
          fontFamily: 'var(--font-sans)',
        }}>
          A circadian health operating system built around the seven biological inputs your body evolved alongside — sun, water, air, diet, exercise, sleep, and stress.
        </p>

        {/* 7 doctor pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 40 }}>
          {['☀️ Sun','💧 Water','🌬️ Air','🥗 Diet','🏃 Exercise','😴 Sleep','🧠 Stress'].map(d => (
            <span key={d} style={{
              padding: '6px 14px', borderRadius: 20,
              background: 'rgba(168,188,114,0.1)',
              border: '1px solid rgba(168,188,114,0.2)',
              fontSize: 12, color: 'var(--color-spring-leaf)',
              fontFamily: 'var(--font-sans)',
            }}>
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        background: 'var(--color-linen)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 40px',
        position: 'relative',
      }}>
        {/* Mobile logo */}
        <div className="auth-mobile-logo" style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 36 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, color: 'var(--color-forest-deep)' }}>7</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontStyle: 'italic', color: 'var(--color-living-green)' }}>ND</span>
        </div>

        <p className="text-label" style={{ marginBottom: 8 }}>
          {isLogin ? 'Welcome back' : 'Get started'}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400,
          color: 'var(--color-forest-deep)', lineHeight: 1.2, marginBottom: 28,
        }}>
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h1>

        {/* Google button */}
        <button onClick={handleGoogle} disabled={loading} style={{
          width: '100%', padding: '12px 16px',
          background: 'var(--color-parchment)',
          border: '1px solid var(--color-warm-stone)',
          borderRadius: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontSize: 14, fontFamily: 'var(--font-sans)', fontWeight: 500,
          color: 'var(--color-bark)',
          marginBottom: 20,
          transition: 'border-color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-sage-glow)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-warm-stone)'}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-warm-stone)' }} />
          <span style={{ fontSize: 11, color: 'var(--color-driftwood)', fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'var(--color-warm-stone)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!isLogin && (
            <Field label="Full name" type="text" value={name}
              onChange={e => { setName(e.target.value); clearError() }}
              placeholder="Jordan Smith" required />
          )}
          <Field label="Email address" type="email" value={email}
            onChange={e => { setEmail(e.target.value); clearError() }}
            placeholder="you@example.com" required />
          <Field label="Password" type="password" value={password}
            onChange={e => { setPassword(e.target.value); clearError() }}
            placeholder={isLogin ? '••••••••' : 'Min. 6 characters'} required />

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'var(--readiness-red-light)',
              border: '1px solid var(--readiness-red-border)',
              borderRadius: 10,
              fontSize: 13, color: 'var(--readiness-red)',
              fontFamily: 'var(--font-sans)',
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px 24px', marginTop: 4,
            background: loading ? 'var(--color-warm-stone)' : 'var(--color-living-green)',
            border: 'none', borderRadius: 12,
            fontSize: 15, fontWeight: 500,
            color: loading ? 'var(--color-driftwood)' : 'var(--color-spring-leaf)',
            fontFamily: 'var(--font-sans)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}>
            {loading ? 'Please wait...' : isLogin ? 'Sign in →' : 'Create account →'}
          </button>
        </form>

        {/* Toggle login/signup */}
        <p style={{
          marginTop: 24, textAlign: 'center',
          fontSize: 13, color: 'var(--color-driftwood)',
          fontFamily: 'var(--font-sans)',
        }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(isLogin ? 'signup' : 'login'); setError('') }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-living-green)', fontWeight: 500,
            fontSize: 13, fontFamily: 'var(--font-sans)',
          }}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        <p style={{
          marginTop: 32, textAlign: 'center',
          fontSize: 11, color: 'var(--color-driftwood)',
          fontFamily: 'var(--font-sans)', lineHeight: 1.6, opacity: 0.7,
        }}>
          By continuing you agree to our Terms of Service<br />and Privacy Policy.
        </p>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          .auth-brand-panel { display: flex !important; }
          .auth-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  )
}

// ── Field component ───────────────────────────────────────────────────────────
function Field({ label, type, value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{
        display: 'block', marginBottom: 6,
        fontSize: 10, fontWeight: 500, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'var(--color-driftwood)',
        fontFamily: 'var(--font-sans)',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '12px 14px',
          background: 'var(--color-parchment)',
          border: `1px solid ${focused ? 'var(--color-living-green)' : 'var(--color-warm-stone)'}`,
          borderRadius: 10, fontSize: 15,
          fontFamily: 'var(--font-sans)',
          color: 'var(--color-bark)',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
      />
    </div>
  )
}

// ── Google icon ───────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

// ── Firebase error messages ────────────────────────────────────────────────────
function friendlyError(code) {
  const map = {
    'auth/user-not-found':       'No account found with this email.',
    'auth/wrong-password':       'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password':        'Password must be at least 6 characters.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/too-many-requests':    'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}