import React, { useState } from 'react';
import { AlertTriangle, MapPin, CheckCircle, Navigation } from 'lucide-react';

const InspectorView = () => {
  const [completed, setCompleted] = useState(false);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h1 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Inspector Tasks</h1>

      {!completed ? (
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-danger)' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span className="badge danger">CRITICAL ALERT</span>
            <span className="text-secondary" style={{ fontSize: '0.875rem' }}>Assigned: 10 mins ago</span>
          </div>
          
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle color="var(--accent-danger)" size={20} />
            Pali Textile Dyeing Unit A
          </h2>
          
          <p className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <MapPin size={16} /> Pali Industrial Area, Sector 4
          </p>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Reason for Inspection:</p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
              <li>Sensor WN-PALI-01 triggered (TDS: 2847, pH: 4.2)</li>
              <li>Satellite thermal anomaly detected</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <Navigation size={18} /> Navigate
            </button>
            <button 
              onClick={() => setCompleted(true)}
              className="btn-primary" 
              style={{ flex: 2, backgroundColor: 'var(--accent-success)', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
            >
              <CheckCircle size={18} /> Inspection Complete
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <CheckCircle size={48} color="var(--accent-success)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Inspection Logged!</h2>
          <p className="text-secondary" style={{ marginBottom: '2rem' }}>Report has been sent to Admin dashboard.</p>
          <button className="btn-secondary" onClick={() => setCompleted(false)}>View Other Tasks</button>
        </div>
      )}
    </div>
  );
};

export default InspectorView;
