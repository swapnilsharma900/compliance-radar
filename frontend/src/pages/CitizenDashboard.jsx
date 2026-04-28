import React, { useState } from 'react';
import { Camera, MapPin, UploadCloud, Award, CheckCircle } from 'lucide-react';

const CitizenDashboard = () => {
  const [step, setStep] = useState(1); // 1: Default, 2: Form, 3: Success

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto', 
      height: '100vh', 
      backgroundColor: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Mobile Header */}
      <header style={{ 
        backgroundColor: 'var(--accent-primary)', 
        color: 'white', 
        padding: '1.5rem 1rem 1rem', 
        textAlign: 'center',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Saaf Rajasthan</h2>
        <p style={{ opacity: 0.8, fontSize: '0.875rem' }}>Citizen Portal</p>
        
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.2)', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '20px',
          marginTop: '1rem'
        }}>
          <Award size={16} /> <span>120 Saaf Points</span>
        </div>
      </header>

      {/* Mobile Content */}
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
        
        {step === 1 && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <img src="https://via.placeholder.com/150/e2e8f0/64748b?text=Map+View" alt="Map" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
              <p className="text-secondary" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Nearby Incidents: 0</p>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.25rem', borderRadius: '50px', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Camera /> Report Karo
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>New Report</h3>
            
            <div className="form-group">
              <label className="form-label">Location</label>
              <div className="input-with-icon">
                <MapPin size={18} className="input-icon" />
                <input type="text" className="form-input has-icon" defaultValue="Pali Industrial Area" readOnly />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Upload Photo</label>
              <div style={{ 
                border: '2px dashed var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                padding: '2rem', 
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0,0.02)',
                cursor: 'pointer'
              }}>
                <UploadCloud size={32} color="var(--text-secondary)" style={{ margin: '0 auto 0.5rem' }} />
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Tap to take a photo of pollution</p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea className="form-input" rows="3" placeholder="What do you see?"></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)}>Submit</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <CheckCircle size={64} color="var(--accent-success)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ color: 'var(--accent-success)', marginBottom: '0.5rem' }}>Report Submitted!</h2>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>Thank you for keeping Rajasthan clean.</p>
            
            <div style={{ 
              backgroundColor: 'rgba(99, 102, 241, 0.1)', 
              color: 'var(--accent-primary)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              marginBottom: '3rem'
            }}>
              <Award /> +50 Saaf Points
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Admin ke map pe blue pin aa gaya hai.
            </p>

            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setStep(1)}>
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
