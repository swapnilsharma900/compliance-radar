import React from 'react';
import { AlertTriangle, Satellite, Send, Activity, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AlertDetail = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} className="btn-secondary" style={{ marginBottom: '1.5rem' }}>&larr; Back to Map</button>
      
      <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--accent-danger)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '2rem' }}>
              <AlertTriangle size={32} />
              Pali Textile Dyeing Unit A
            </h1>
            <p className="text-secondary" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPinIcon size={16} /> District: Pali, Rajasthan | ID: b1000000-...0001
            </p>
          </div>
          <span className="badge danger" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>CRITICAL ALERT</span>
        </div>

        <div className="grid-cards" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '2rem' }}>
          {/* Sensor Data */}
          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Activity size={20} color="var(--accent-danger)" /> Live Sensor Reading
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span className="text-secondary">TDS (Total Dissolved Solids)</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-danger)', fontSize: '1.25rem' }}>2847 ppm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">pH Level</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-danger)', fontSize: '1.25rem' }}>4.2</span>
              </div>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--accent-danger)', fontWeight: 'bold' }}>
              ⚠️ Both parameters are at DANGER LEVEL.
            </p>
          </div>

          {/* Satellite Verification */}
          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(99, 102, 241, 0.05)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Satellite size={20} color="var(--accent-primary)" /> Satellite Verification
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Satellite size={32} color="#94a3b8" />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Anomaly Detected</h4>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                  Satellite ne bhi flag kiya. Thermal & optical signatures indicate untreated effluent discharge into nearby river bed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={18} /> View History
          </button>
          <button className="btn-primary" style={{ backgroundColor: 'var(--accent-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>
            <Send size={20} /> Inspector Send
          </button>
        </div>
      </div>
    </div>
  );
};

const MapPinIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

export default AlertDetail;
