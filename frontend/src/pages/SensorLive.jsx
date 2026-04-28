import React, { useState, useEffect, useRef } from 'react';
import { Terminal, AlertTriangle, Activity } from 'lucide-react';

const SensorLive = () => {
  const [isAlert, setIsAlert] = useState(false);
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom of logs
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
      
      let newLog;
      if (isAlert) {
        // Danger readings
        const tds = 2800 + Math.floor(Math.random() * 100); // around 2847
        const ph = (4.0 + Math.random() * 0.4).toFixed(1); // around 4.2
        newLog = `[${timestamp}] CRITICAL: WN-PALI-01 | TDS: ${tds} ppm | pH: ${ph} | STATUS: DANGER`;
      } else {
        // Normal readings
        const tds = 400 + Math.floor(Math.random() * 100); // around 450
        const ph = (7.0 + Math.random() * 0.4).toFixed(1); // around 7.2
        newLog = `[${timestamp}] INFO: WN-PALI-01 | TDS: ${tds} ppm | pH: ${ph} | STATUS: NORMAL`;
      }

      setLogs(prev => [...prev.slice(-20), newLog]); // Keep last 20 logs
    }, 1500);

    return () => clearInterval(interval);
  }, [isAlert]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity /> Live Sensor Terminal
        </h1>
        
        <button 
          onClick={() => setIsAlert(!isAlert)}
          className="btn-primary" 
          style={{ backgroundColor: isAlert ? 'var(--accent-success)' : 'var(--accent-danger)' }}
        >
          {isAlert ? 'Restore Normal State' : 'Trigger Alert (Simulate Leak)'}
        </button>
      </div>

      <div className="grid-cards" style={{ gridTemplateColumns: '2fr 1fr', flex: 1, gap: '1.5rem', minHeight: 0 }}>
        {/* Terminal Window */}
        <div style={{ 
          backgroundColor: '#000', 
          color: '#0f0', 
          fontFamily: 'monospace', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-lg)',
          overflowY: 'auto',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#888' }}>
            <Terminal size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> WN-PALI-01 IoT Gateway Connected...
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ 
                color: log.includes('CRITICAL') ? '#ff4444' : '#00ff00',
                marginBottom: '4px',
                fontWeight: log.includes('CRITICAL') ? 'bold' : 'normal'
              }}>
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Live Status Map/Indicator */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem' }}>Map Status Sync</h3>
          
          <div style={{ 
            flex: 1, 
            backgroundColor: '#e2e8f0', 
            borderRadius: 'var(--radius-md)', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.5s ease'
          }}>
             <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: isAlert ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                border: `2px solid ${isAlert ? 'rgba(239, 68, 68, 0.8)' : 'rgba(16, 185, 129, 0.8)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: isAlert ? 'pulse 1s infinite' : 'none'
             }}>
                <AlertTriangle size={40} color={isAlert ? 'var(--accent-danger)' : 'var(--accent-success)'} />
             </div>
             <p style={{ position: 'absolute', bottom: '1rem', fontWeight: 'bold', color: isAlert ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
               {isAlert ? 'MAP AUTO-RED TRIGGERED' : 'MAP NORMAL (GREEN)'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorLive;
