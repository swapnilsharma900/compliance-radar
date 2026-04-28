import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye } from 'lucide-react';

const Units = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch units from /api/units
    const fetchUnits = async () => {
      try {
        const response = await fetch('/api/units', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUnits(data);
        } else {
          // Mock data for display if API fails
          setUnits([
            { id: 1, name: 'Steel Works Corp', industryType: 'Manufacturing', district: 'North District', complianceScore: 92 },
            { id: 2, name: 'ChemCo Industries', industryType: 'Chemical', district: 'East District', complianceScore: 65 },
            { id: 3, name: 'Green Energy Plant', industryType: 'Power', district: 'South District', complianceScore: 98 },
          ]);
        }
      } catch (error) {
        console.error("Error fetching units:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Industrial Units</h1>
        <button className="btn-primary">Add New Unit</button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem', gap: '1rem' }}>
          <div className="input-with-icon" style={{ flex: 1, maxWidth: '400px' }}>
            <Search size={18} className="input-icon" style={{ left: '1rem', position: 'absolute', color: 'var(--text-secondary)' }} />
            <input type="text" className="form-input" placeholder="Search units by name or district..." style={{ paddingLeft: '2.75rem' }} />
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Industry Type</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>District</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Compliance Score</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{unit.name}</td>
                  <td style={{ padding: '1rem' }}>{unit.industryType}</td>
                  <td style={{ padding: '1rem' }}>{unit.district}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${unit.complianceScore >= 80 ? 'success' : unit.complianceScore >= 60 ? 'warning' : 'danger'}`}>
                      {unit.complianceScore}%
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button className="icon-btn" style={{ width: '32px', height: '32px' }}><Eye size={16} /></button>
                  </td>
                </tr>
              ))}
              {units.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No units found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Units;
