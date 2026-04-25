import { useState, useEffect, useCallback } from 'react'
import { reportApi } from '../api/api'
import { useAuth } from '../context/AuthContext'
import { Leaf, Plus, CheckCircle, Clock, MapPin, Star, LogOut, Camera } from 'lucide-react'

const ISSUE_TYPES = ['WATER', 'AIR', 'WASTE']

const badge = (type) => ({
  WATER: { bg:'#dbeafe', color:'#1d4ed8', label:'💧 Water' },
  AIR:   { bg:'#fef9c3', color:'#854d0e', label:'💨 Air' },
  WASTE: { bg:'#fce7f3', color:'#be185d', label:'🗑️ Waste' },
}[type] || { bg:'#f3f4f6', color:'#374151', label: type })

const statusBadge = (s) => ({
  SUBMITTED: { bg:'#fef9c3', color:'#854d0e', label:'⏳ Pending' },
  RESOLVED:  { bg:'#dcfce7', color:'#166534', label:'✅ Resolved' },
}[s] || { bg:'#f3f4f6', color:'#374151', label: s })

export default function CitizenDashboard() {
  const { user, logout }         = useAuth()
  const [tab, setTab]            = useState('report')
  const [reports, setReports]    = useState([])
  const [points, setPoints]      = useState(0)
  const [loading, setLoading]    = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]    = useState('')
  const [error, setError]        = useState('')
  const [form, setForm]          = useState({ issueType:'WATER', lat:'', lon:'', photoLink:'' })
  const [locating, setLocating]  = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [rpts, pts] = await Promise.all([reportApi.mine(), reportApi.points()])
      setReports(rpts)
      setPoints(pts)
    } catch { /* handled by interceptor */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const getLocation = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({ ...f, lat: pos.coords.latitude.toFixed(6), lon: pos.coords.longitude.toFixed(6) }))
        setLocating(false)
      },
      () => { setError('Could not get location. Please enter manually.'); setLocating(false) }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      await reportApi.submit({
        issueType: form.issueType,
        lat: parseFloat(form.lat),
        lon: parseFloat(form.lon),
        photoLink: form.photoLink || null
      })
      setSuccess('Report submitted! +50 SaafPoints earned 🌱')
      setForm({ issueType:'WATER', lat:'', lon:'', photoLink:'' })
      loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed')
    } finally { setSubmitting(false) }
  }

  const resolved = reports.filter(r => r.status === 'RESOLVED').length

  return (
    <div style={{ minHeight:'100vh', background:'#f0fdf4' }}>
      {/* Header */}
      <header style={{ background:'#16a34a', color:'#fff', padding:'1rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <Leaf size={22} />
          <span style={{ fontWeight:700, fontSize:'1.1rem' }}>SaafSaathi</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <span style={{ fontSize:'0.85rem', opacity:0.9 }}>{user?.fullName}</span>
          <button onClick={logout} style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'#fff', padding:'0.4rem 0.75rem', borderRadius:'0.4rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.85rem' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'1.5rem 1rem' }}>
        {/* Stats strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem', marginBottom:'1.5rem' }}>
          {[
            { icon:<Star size={20} color="#16a34a"/>, label:'SaafPoints', value: points },
            { icon:<CheckCircle size={20} color="#16a34a"/>, label:'Resolved', value: resolved },
            { icon:<Clock size={20} color="#f59e0b"/>, label:'Pending', value: reports.length - resolved },
          ].map(s => (
            <div key={s.label} style={{ background:'#fff', borderRadius:'0.75rem', padding:'1rem', textAlign:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'0.25rem' }}>{s.icon}</div>
              <div style={{ fontSize:'1.5rem', fontWeight:700, color:'#111' }}>{s.value}</div>
              <div style={{ fontSize:'0.75rem', color:'#6b7280' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem' }}>
          {['report','history'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:'0.6rem 1.25rem', borderRadius:'2rem', border:'none', cursor:'pointer', fontWeight:600, fontSize:'0.875rem',
              background: tab===t ? '#16a34a' : '#fff', color: tab===t ? '#fff' : '#374151',
              boxShadow: tab===t ? 'none' : '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              {t === 'report' ? '📍 New Report' : '📋 My Reports'}
            </button>
          ))}
        </div>

        {/* Report Form */}
        {tab === 'report' && (
          <div style={{ background:'#fff', borderRadius:'1rem', padding:'1.5rem', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize:'1.1rem', fontWeight:700, marginBottom:'1.25rem', color:'#111' }}>Report Pollution</h2>

            {success && <div style={{ background:'#dcfce7', border:'1px solid #86efac', borderRadius:'0.5rem', padding:'0.75rem', color:'#166534', marginBottom:'1rem', fontSize:'0.9rem' }}>{success}</div>}
            {error   && <div style={{ background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:'0.5rem', padding:'0.75rem', color:'#dc2626', marginBottom:'1rem', fontSize:'0.9rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <label style={{ display:'block', fontSize:'0.8rem', fontWeight:600, color:'#374151', marginBottom:'0.4rem' }}>Issue Type</label>
              <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem' }}>
                {ISSUE_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({...f, issueType:t}))} style={{
                    flex:1, padding:'0.65rem', borderRadius:'0.5rem', border:'2px solid',
                    borderColor: form.issueType===t ? '#16a34a' : '#e5e7eb',
                    background: form.issueType===t ? '#f0fdf4' : '#fff',
                    fontWeight:600, fontSize:'0.8rem', cursor:'pointer', color: form.issueType===t ? '#16a34a' : '#374151'
                  }}>
                    {badge(t).label}
                  </button>
                ))}
              </div>

              <label style={{ display:'block', fontSize:'0.8rem', fontWeight:600, color:'#374151', marginBottom:'0.4rem' }}>Location</label>
              <button type="button" onClick={getLocation} disabled={locating} style={{
                width:'100%', padding:'0.75rem', border:'2px dashed #86efac', borderRadius:'0.5rem',
                background:'#f0fdf4', color:'#16a34a', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', marginBottom:'0.75rem'
              }}>
                <MapPin size={16} /> {locating ? 'Getting location...' : 'Use My Current Location'}
              </button>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'1.25rem' }}>
                <div>
                  <label style={{ display:'block', fontSize:'0.75rem', color:'#6b7280', marginBottom:'0.25rem' }}>Latitude</label>
                  <input style={{ width:'100%', padding:'0.65rem', border:'1.5px solid #d1fae5', borderRadius:'0.5rem', fontSize:'0.9rem' }}
                    placeholder="25.7711" value={form.lat} onChange={e => setForm(f=>({...f,lat:e.target.value}))} required />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'0.75rem', color:'#6b7280', marginBottom:'0.25rem' }}>Longitude</label>
                  <input style={{ width:'100%', padding:'0.65rem', border:'1.5px solid #d1fae5', borderRadius:'0.5rem', fontSize:'0.9rem' }}
                    placeholder="73.3234" value={form.lon} onChange={e => setForm(f=>({...f,lon:e.target.value}))} required />
                </div>
              </div>

              <label style={{ display:'block', fontSize:'0.8rem', fontWeight:600, color:'#374151', marginBottom:'0.4rem' }}>Photo URL (optional)</label>
              <input style={{ width:'100%', padding:'0.75rem', border:'1.5px solid #d1fae5', borderRadius:'0.5rem', fontSize:'0.9rem', marginBottom:'1.25rem' }}
                placeholder="https://..." value={form.photoLink} onChange={e => setForm(f=>({...f,photoLink:e.target.value}))} />

              <button type="submit" disabled={submitting} style={{
                width:'100%', padding:'0.9rem', background:'#16a34a', color:'#fff', border:'none',
                borderRadius:'0.5rem', fontWeight:700, fontSize:'1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem'
              }}>
                <Plus size={18} /> {submitting ? 'Submitting...' : 'Submit Report (+50 pts)'}
              </button>
            </form>
          </div>
        )}

        {/* History */}
        {tab === 'history' && (
          <div>
            {loading ? (
              <div style={{ textAlign:'center', padding:'3rem', color:'#6b7280' }}>Loading...</div>
            ) : reports.length === 0 ? (
              <div style={{ textAlign:'center', padding:'3rem', color:'#6b7280' }}>
                <Leaf size={40} color="#d1fae5" style={{ margin:'0 auto 1rem' }} />
                <p>No reports yet. Be the first to report!</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {reports.map(r => {
                  const ib = badge(r.issueType)
                  const sb = statusBadge(r.status)
                  return (
                    <div key={r.id} style={{ background:'#fff', borderRadius:'0.75rem', padding:'1rem 1.25rem', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
                        <span style={{ background:ib.bg, color:ib.color, padding:'0.25rem 0.6rem', borderRadius:'1rem', fontSize:'0.75rem', fontWeight:600 }}>{ib.label}</span>
                        <span style={{ background:sb.bg, color:sb.color, padding:'0.25rem 0.6rem', borderRadius:'1rem', fontSize:'0.75rem', fontWeight:600 }}>{sb.label}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.8rem', color:'#6b7280', marginBottom:'0.25rem' }}>
                        <MapPin size={12} /> {r.lat?.toFixed(4)}, {r.lon?.toFixed(4)}
                      </div>
                      <div style={{ fontSize:'0.75rem', color:'#9ca3af' }}>{new Date(r.submittedAt).toLocaleString()}</div>
                      <div style={{ marginTop:'0.5rem', fontSize:'0.8rem', color:'#16a34a', fontWeight:600 }}>+{r.saafPoints} pts</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
