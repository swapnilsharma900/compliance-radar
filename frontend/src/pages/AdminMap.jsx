import React from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminMap = () => {
  const navigate = useNavigate();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h1 className="page-title">Rajasthan Compliance Map</h1>
      
      <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#e2e8f0', borderRadius: 'var(--radius-lg)' }}>
        {/* Pseudo Map Background */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ color: 'var(--text-secondary)', opacity: 0.5, fontSize: '3rem', letterSpacing: '0.5rem' }}>RAJASTHAN</h2>
        </div>

        {/* Normal Factory Pin (Green) */}
        <div style={{ position: 'absolute', top: '30%', left: '40%', transform: 'translate(-50%, -50%)', cursor: 'pointer' }}>
          <MapPin size={32} color="var(--accent-success)" fill="white" />
          <div style={{ backgroundColor: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', marginTop: '4px', boxShadow: 'var(--shadow-sm)', fontWeight: 'bold' }}>
            Jaipur Textiles
          </div>
        </div>

        {/* Alert Factory Pin (Red) with 500m Circle */}
        <div 
          onClick={() => navigate('/alert-detail')}
          style={{ position: 'absolute', top: '55%', left: '60%', transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 10 }}
        >
          {/* 500m Red Circle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '150px',
            height: '150px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
            pointerEvents: 'none'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <MapPin size={40} color="var(--accent-danger)" fill="white" />
          </div>
          
          <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--accent-danger)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', marginTop: '4px', boxShadow: 'var(--shadow-md)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            Pali Dyeing Unit A (ALERT)
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default AdminMap;
