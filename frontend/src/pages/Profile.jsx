import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Award, Calendar, Shield, Zap, TrendingUp, Edit2, Map as MapIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="flex-center" style={{ height: '100%' }}><div className="loader"></div></div>;
  if (error) return <div className="flex-center" style={{ height: '100%', color: 'var(--accent-danger)' }}>Error: {error}</div>;

  const formatDate = (dateData) => {
    if (!dateData) return 'N/A';
    try {
      let date;
      if (Array.isArray(dateData)) {
        // Handle Spring Boot LocalDateTime array: [YYYY, MM, DD, HH, mm, ss]
        const [year, month, day, hour, minute] = dateData;
        date = new Date(year, month - 1, day, hour || 0, minute || 0);
      } else {
        date = new Date(dateData);
      }
      
      if (isNaN(date.getTime())) return 'N/A';

      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (err) {
      console.error("Date formatting error:", err);
      return 'N/A';
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>My Profile</h1>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Edit2 size={16} /> Edit Profile
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Column - Avatar and Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--accent-primary)', 
              color: 'white', 
              fontSize: '3rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
              border: '4px solid white'
            }}>
              {profile?.fullName?.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ marginBottom: '0.25rem' }}>{profile?.fullName}</h2>
            <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>{profile?.role}</p>
            
            <div className="badge primary" style={{ padding: '0.5rem 1rem', borderRadius: '20px' }}>
              {profile?.district}, Rajasthan
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="#f59e0b" /> Saaf Progress
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="flex-between">
                <span className="text-secondary">Saaf Points</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>{profile?.saafPoints || 0}</span>
              </div>
              <div className="flex-between">
                <span className="text-secondary">Weekly Streak</span>
                <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{profile?.streakDays || 0} Days</span>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ height: '8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', backgroundColor: 'var(--accent-primary)' }}></div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
                  Level 4 • 250 points to Level 5
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Account Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                    <Mail size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Email Address</p>
                    <p style={{ fontWeight: 500, margin: 0 }}>{profile?.email}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                    <Phone size={20} color="var(--accent-success)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Phone Number</p>
                    <p style={{ fontWeight: 500, margin: 0 }}>{profile?.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
                    <Shield size={20} color="#f59e0b" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>User Role</p>
                    <p style={{ fontWeight: 500, margin: 0 }}>{profile?.role}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                    <Calendar size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Member Since</p>
                    <p style={{ fontWeight: 500, margin: 0 }}>{profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Location Details</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                <MapPin size={20} color="var(--accent-danger)" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Assigned District</p>
                <p style={{ fontWeight: 500, margin: 0 }}>{profile?.district}, Rajasthan State</p>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, textAlign: 'center' }}>
                <MapIcon size={14} style={{ marginRight: '0.5rem' }} /> 
                View your jurisdiction on the main dashboard map.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Award size={32} color="var(--accent-primary)" />
              <div>
                <p style={{ fontWeight: 'bold', margin: 0 }}>Compliance Hero</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Top 5% in {profile?.district}</p>
              </div>
            </div>
            <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <TrendingUp size={32} color="var(--accent-success)" />
              <div>
                <p style={{ fontWeight: 'bold', margin: 0 }}>Impact Score</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>98/100 Efficiency</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
