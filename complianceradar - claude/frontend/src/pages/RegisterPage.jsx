import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/api'
import { useAuth } from '../context/AuthContext'
import { Leaf, UserPlus } from 'lucide-react'

const s = {
  page:  { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', padding:'1rem' },
  card:  { background:'#fff', borderRadius:'1rem', padding:'2.5rem', width:'100%', maxWidth:'440px', boxShadow:'0 10px 40px rgba(0,0,0,0.08)' },
  logo:  { display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem', justifyContent:'center' },
  label: { display:'block', fontSize:'0.8rem', fontWeight:600, color:'#374151', marginBottom:'0.4rem' },
  input: { width:'100%', padding:'0.75rem 1rem', borderRadius:'0.5rem', border:'1.5px solid #d1fae5', fontSize:'0.95rem', outline:'none', marginBottom:'1rem' },
  btn:   { width:'100%', padding:'0.85rem', background:'#16a34a', color:'#fff', border:'none', borderRadius:'0.5rem', fontWeight:700, fontSize:'1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' },
  error: { background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:'0.5rem', padding:'0.75rem', color:'#dc2626', fontSize:'0.875rem', marginBottom:'1rem' },
}

const DISTRICTS = ['Ajmer','Alwar','Banswara','Baran','Barmer','Bharatpur','Bhilwara','Bikaner','Bundi','Chittorgarh','Churu','Dausa','Dholpur','Dungarpur','Ganganagar','Hanumangarh','Jaipur','Jaisalmer','Jalore','Jhalawar','Jhunjhunu','Jodhpur','Karauli','Kota','Nagaur','Pali','Pratapgarh','Rajsamand','Sawai Madhopur','Sikar','Sirohi','Tonk','Udaipur']

export default function RegisterPage() {
  const [form, setForm]       = useState({ fullName:'', email:'', password:'', phoneNumber:'', district:'' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authApi.register(form)
      login(data)
      navigate('/citizen')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <Leaf size={32} color="#16a34a" />
          <span style={{ fontSize:'1.5rem', fontWeight:700, color:'#16a34a' }}>SaafSaathi</span>
        </div>
        <h1 style={{ textAlign:'center', fontSize:'1.2rem', fontWeight:700, marginBottom:'0.25rem' }}>Join as a Citizen</h1>
        <p style={{ textAlign:'center', fontSize:'0.875rem', color:'#6b7280', marginBottom:'1.5rem' }}>Report pollution. Earn SaafPoints. Make a difference.</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} placeholder="Ramesh Kumar" value={form.fullName} onChange={f('fullName')} required />

          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="you@example.com" value={form.email} onChange={f('email')} required />

          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="Min. 6 characters" value={form.password} onChange={f('password')} required minLength={6} />

          <label style={s.label}>Phone Number</label>
          <input style={s.input} placeholder="9414XXXXXX" value={form.phoneNumber} onChange={f('phoneNumber')} />

          <label style={s.label}>District</label>
          <select style={{...s.input, background:'#fff'}} value={form.district} onChange={f('district')} required>
            <option value="">Select your district</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <button style={s.btn} type="submit" disabled={loading}>
            <UserPlus size={18} />
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.25rem', fontSize:'0.875rem', color:'#6b7280' }}>
          Already have an account? <Link to="/login" style={{ color:'#16a34a', fontWeight:600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
