import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/api'
import { useAuth } from '../context/AuthContext'
import { Leaf, LogIn } from 'lucide-react'

const styles = {
  page:    { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', padding:'1rem' },
  card:    { background:'#fff', borderRadius:'1rem', padding:'2.5rem', width:'100%', maxWidth:'420px', boxShadow:'0 10px 40px rgba(0,0,0,0.08)' },
  logo:    { display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'2rem', justifyContent:'center' },
  logoText:{ fontSize:'1.5rem', fontWeight:700, color:'#16a34a' },
  title:   { textAlign:'center', fontSize:'1.25rem', fontWeight:600, color:'#111', marginBottom:'0.25rem' },
  sub:     { textAlign:'center', fontSize:'0.875rem', color:'#6b7280', marginBottom:'2rem' },
  label:   { display:'block', fontSize:'0.8rem', fontWeight:600, color:'#374151', marginBottom:'0.4rem' },
  input:   { width:'100%', padding:'0.75rem 1rem', borderRadius:'0.5rem', border:'1.5px solid #d1fae5', fontSize:'0.95rem', outline:'none', marginBottom:'1.25rem', transition:'border-color 0.2s' },
  btn:     { width:'100%', padding:'0.85rem', background:'#16a34a', color:'#fff', border:'none', borderRadius:'0.5rem', fontWeight:700, fontSize:'1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' },
  error:   { background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:'0.5rem', padding:'0.75rem', color:'#dc2626', fontSize:'0.875rem', marginBottom:'1rem' },
  link:    { display:'block', textAlign:'center', marginTop:'1.5rem', fontSize:'0.875rem', color:'#6b7280' },
}

export default function LoginPage() {
  const [form, setForm]     = useState({ email:'', password:'' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login }           = useAuth()
  const navigate            = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authApi.login(form)
      login(data)
      // Route by role
      if (data.role === 'CITIZEN') navigate('/citizen')
      else navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <Leaf size={32} color="#16a34a" />
          <span style={styles.logoText}>SaafSaathi</span>
        </div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.sub}>Sign in to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            required
          />
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            required
          />
          <button style={styles.btn} type="submit" disabled={loading}>
            <LogIn size={18} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <span style={styles.link}>
          New citizen? <Link to="/register" style={{color:'#16a34a', fontWeight:600}}>Register here</Link>
        </span>

        <div style={{marginTop:'1.5rem', background:'#f0fdf4', borderRadius:'0.5rem', padding:'0.75rem', fontSize:'0.78rem', color:'#6b7280'}}>
          <strong>Demo accounts (password: password123)</strong><br/>
          Admin: admin@rspcb.gov.in<br/>
          Inspector: inspector1@rspcb.gov.in<br/>
          Citizen: citizen1@saaf.in
        </div>
      </div>
    </div>
  )
}
