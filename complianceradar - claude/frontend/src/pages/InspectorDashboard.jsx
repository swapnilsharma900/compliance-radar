import { useState, useEffect, useCallback } from 'react'
import { alertApi, fusionApi, reportApi, unitApi } from '../api/api'
import { useAuth } from '../context/AuthContext'
import { Leaf, Zap, AlertTriangle, CheckCircle, Building2, LogOut, RefreshCw } from 'lucide-react'

const levelStyle = (l) => l === 'RED'
  ? { bg:'#fef2f2', color:'#dc2626', border:'#fca5a5' }
  : { bg:'#fefce8', color:'#d97706', border:'#fde68a' }

export default function InspectorDashboard() {
  const { user, logout }            = useAuth()
  const [tab, setTab]               = useState('alerts')
  const [alerts, setAlerts]         = useState([])
  const [reports, setReports]       = useState([])
  const [units, setUnits]           = useState([])
  const [loading, setLoading]       = useState(false)
  const [fusionResult, setFusionResult] = useState(null)
  const [triggering, setTriggering] = useState(false)

  const loadAlerts  = useCallback(async () => { setAlerts(await alertApi.all()) }, [])
  const loadReports = useCallback(async () => { setReports(await reportApi.all()) }, [])
  const loadUnits   = useCallback(async () => { setUnits(await unitApi.all()) }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([loadAlerts(), loadReports(), loadUnits()]).finally(() => setLoading(false))
  }, [loadAlerts, loadReports, loadUnits])

  const triggerFusion = async () => {
    setTriggering(true)
    setFusionResult(null)
    try {
      const result = await fusionApi.trigger()
      setFusionResult(result)
      loadAlerts()
      loadUnits()
    } catch (err) {
      setFusionResult({ message: err.response?.data?.message || 'Fusion failed', alertsCreated: -1 })
    } finally { setTriggering(false) }
  }

  const resolveAlert = async (id) => {
    await alertApi.resolve(id)
    loadAlerts()
  }

  const resolveReport = async (id) => {
    await reportApi.resolve(id)
    loadReports()
  }

  const openAlerts  = alerts.filter(a => a.status === 'OPEN')
  const redAlerts   = openAlerts.filter(a => a.alertLevel === 'RED')

  const TABS = [
    { id:'alerts',  label:`🚨 Alerts (${openAlerts.length})` },
    { id:'reports', label:`📋 Reports (${reports.filter(r=>r.status==='SUBMITTED').length})` },
    { id:'units',   label:'🏭 Units' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc' }}>
      {/* Header */}
      <header style={{ background:'#1e3a5f', color:'#fff', padding:'1rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <Leaf size={22} />
          <div>
            <div style={{ fontWeight:700, fontSize:'1rem' }}>ComplianceRadar</div>
            <div style={{ fontSize:'0.75rem', opacity:0.7 }}>{user?.role} · {user?.district}</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <span style={{ fontSize:'0.85rem', opacity:0.85 }}>{user?.fullName}</span>
          <button onClick={logout} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', padding:'0.4rem 0.75rem', borderRadius:'0.4rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.8rem' }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'1.5rem 1rem' }}>
        {/* Fusion Engine card */}
        <div style={{ background: redAlerts.length > 0 ? '#fef2f2' : '#f0fdf4', border:`2px solid ${redAlerts.length > 0 ? '#fca5a5' : '#86efac'}`, borderRadius:'1rem', padding:'1.25rem 1.5rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:700, fontSize:'1.05rem', color: redAlerts.length > 0 ? '#dc2626' : '#16a34a' }}>
              <Zap size={20} /> Fusion Engine
            </div>
            <div style={{ fontSize:'0.85rem', color:'#6b7280', marginTop:'0.25rem' }}>
              {redAlerts.length > 0 ? `⚠️ ${redAlerts.length} RED alert(s) require immediate action` : 'All layers nominal. Ready for next scan.'}
            </div>
            {fusionResult && (
              <div style={{ marginTop:'0.5rem', fontSize:'0.85rem', color: fusionResult.alertsCreated > 0 ? '#dc2626' : '#16a34a', fontWeight:600 }}>
                {fusionResult.message}
              </div>
            )}
          </div>
          <button onClick={triggerFusion} disabled={triggering} style={{
            padding:'0.75rem 1.5rem', background:'#1e3a5f', color:'#fff', border:'none',
            borderRadius:'0.6rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.9rem'
          }}>
            {triggering ? <><RefreshCw size={16} style={{ animation:'spin 1s linear infinite' }} /> Scanning...</> : <><Zap size={16} /> Trigger Fusion</>}
          </button>
        </div>

        {/* Summary row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem', marginBottom:'1.5rem' }}>
          {[
            { icon:<AlertTriangle size={20} color="#dc2626"/>, label:'RED Alerts', value: redAlerts.length, bg:'#fef2f2' },
            { icon:<AlertTriangle size={20} color="#d97706"/>, label:'YELLOW Alerts', value: openAlerts.filter(a=>a.alertLevel==='YELLOW').length, bg:'#fefce8' },
            { icon:<Building2 size={20} color="#1d4ed8"/>, label:'Low Compliance', value: units.filter(u=>u.complianceScore<70).length, bg:'#eff6ff' },
          ].map(s => (
            <div key={s.label} style={{ background:s.bg, borderRadius:'0.75rem', padding:'1rem', textAlign:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'0.25rem' }}>{s.icon}</div>
              <div style={{ fontSize:'1.6rem', fontWeight:700, color:'#111' }}>{s.value}</div>
              <div style={{ fontSize:'0.75rem', color:'#6b7280' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:'0.6rem 1.1rem', borderRadius:'2rem', border:'none', cursor:'pointer', fontWeight:600, fontSize:'0.85rem',
              background: tab===t.id ? '#1e3a5f' : '#fff', color: tab===t.id ? '#fff' : '#374151',
              boxShadow: tab===t.id ? 'none' : '0 1px 3px rgba(0,0,0,0.08)'
            }}>{t.label}</button>
          ))}
        </div>

        {/* Alerts Tab */}
        {tab === 'alerts' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {loading ? <div style={{ textAlign:'center', padding:'2rem', color:'#6b7280' }}>Loading...</div>
            : alerts.length === 0 ? <div style={{ textAlign:'center', padding:'3rem', color:'#6b7280' }}>No alerts found. Trigger the Fusion Engine to scan.</div>
            : alerts.map(a => {
              const ls = levelStyle(a.alertLevel)
              return (
                <div key={a.id} style={{ background:'#fff', borderRadius:'0.75rem', padding:'1.1rem 1.25rem', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', borderLeft:`4px solid ${ls.border}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.5rem' }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.35rem' }}>
                        <span style={{ background:ls.bg, color:ls.color, padding:'0.2rem 0.6rem', borderRadius:'1rem', fontSize:'0.75rem', fontWeight:700 }}>
                          {a.alertLevel === 'RED' ? '🔴' : '🟡'} {a.alertLevel}
                        </span>
                        <span style={{ fontWeight:700, color:'#111', fontSize:'0.95rem' }}>{a.unitName}</span>
                      </div>
                      <div style={{ fontSize:'0.8rem', color:'#6b7280' }}>
                        📍 {a.district} · 🔗 {a.triggerSource} · 👤 {a.assignedToName || 'Unassigned'}
                      </div>
                      <div style={{ fontSize:'0.75rem', color:'#9ca3af', marginTop:'0.2rem' }}>
                        {new Date(a.createdAt).toLocaleString()}
                      </div>
                    </div>
                    {a.status === 'OPEN' && (
                      <button onClick={() => resolveAlert(a.id)} style={{
                        padding:'0.5rem 1rem', background:'#16a34a', color:'#fff', border:'none',
                        borderRadius:'0.5rem', fontWeight:600, fontSize:'0.8rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem'
                      }}>
                        <CheckCircle size={14} /> Resolve
                      </button>
                    )}
                    {a.status === 'RESOLVED' && <span style={{ color:'#16a34a', fontWeight:600, fontSize:'0.85rem' }}>✅ Resolved</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Reports Tab */}
        {tab === 'reports' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {reports.length === 0 ? <div style={{ textAlign:'center', padding:'3rem', color:'#6b7280' }}>No citizen reports yet.</div>
            : reports.map(r => (
              <div key={r.id} style={{ background:'#fff', borderRadius:'0.75rem', padding:'1rem 1.25rem', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.5rem' }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:'0.9rem', marginBottom:'0.25rem' }}>{r.issueType} — {r.userName}</div>
                  <div style={{ fontSize:'0.8rem', color:'#6b7280' }}>📍 {r.lat?.toFixed(4)}, {r.lon?.toFixed(4)} · {new Date(r.submittedAt).toLocaleDateString()}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                  <span style={{ padding:'0.25rem 0.65rem', borderRadius:'1rem', fontSize:'0.75rem', fontWeight:600,
                    background: r.status==='RESOLVED' ? '#dcfce7' : '#fefce8',
                    color: r.status==='RESOLVED' ? '#166534' : '#854d0e'
                  }}>{r.status}</span>
                  {r.status === 'SUBMITTED' && (
                    <button onClick={() => resolveReport(r.id)} style={{ padding:'0.4rem 0.85rem', background:'#16a34a', color:'#fff', border:'none', borderRadius:'0.4rem', fontWeight:600, fontSize:'0.8rem', cursor:'pointer' }}>
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Units Tab */}
        {tab === 'units' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {units.sort((a,b) => a.complianceScore - b.complianceScore).map(u => (
              <div key={u.id} style={{ background:'#fff', borderRadius:'0.75rem', padding:'1rem 1.25rem', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.5rem' }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:'0.95rem', marginBottom:'0.2rem' }}>{u.name}</div>
                  <div style={{ fontSize:'0.8rem', color:'#6b7280' }}>📍 {u.district} · {u.lat?.toFixed(4)}, {u.lon?.toFixed(4)}</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{
                    fontSize:'1.4rem', fontWeight:700,
                    color: u.complianceScore >= 70 ? '#16a34a' : u.complianceScore >= 40 ? '#d97706' : '#dc2626'
                  }}>{u.complianceScore}</div>
                  <div style={{ fontSize:'0.7rem', color:'#9ca3af' }}>Compliance</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
