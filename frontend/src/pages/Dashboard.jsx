import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, Factory, Users } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUnits: 0,
    openAlerts: 0,
    recentReports: 0,
    complianceRate: 0
  });

  useEffect(() => {
    // In a real app, you'd fetch this from the backend
    // Fetching data from multiple endpoints or a specific dashboard endpoint
    const fetchDashboardData = async () => {
      try {
        // Mocked response
        setStats({
          totalUnits: 124,
          openAlerts: 18,
          recentReports: 45,
          complianceRate: 85
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data");
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Units', value: stats.totalUnits, icon: <Factory size={24} />, color: 'var(--accent-primary)' },
    { title: 'Open Alerts', value: stats.openAlerts, icon: <AlertCircle size={24} />, color: 'var(--accent-danger)' },
    { title: 'Citizen Reports', value: stats.recentReports, icon: <Users size={24} />, color: 'var(--accent-warning)' },
    { title: 'Compliance Rate', value: `${stats.complianceRate}%`, icon: <Activity size={24} />, color: 'var(--accent-success)' },
  ];

  return (
    <div>
      <h1 className="page-title">Dashboard Overview</h1>
      
      <div className="grid-cards" style={{ marginBottom: '2rem' }}>
        {statCards.map((stat, index) => (
          <div key={index} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              backgroundColor: `${stat.color}20`, 
              color: stat.color,
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{stat.title}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-cards" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Recent Alerts</h3>
          <p className="text-secondary">No recent alerts found.</p>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button className="btn-secondary" style={{ textAlign: 'left' }}>Register New Unit</button>
            <button className="btn-secondary" style={{ textAlign: 'left' }}>Generate Report</button>
            <button className="btn-secondary" style={{ textAlign: 'left' }}>Trigger Satellite Scan</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
