import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Alert Icon (Red)
const alertIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom Success Icon (Green)
const successIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const AdminMap = () => {
  const navigate = useNavigate();
  const rajasthanCenter = [26.6, 73.8];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h1 className="page-title">Rajasthan Compliance Map</h1>
      
      <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)', minHeight: '500px' }}>
        <MapContainer 
          center={rajasthanCenter} 
          zoom={7} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Jaipur Marker - Normal */}
          <Marker position={[26.9124, 75.7873]} icon={successIcon}>
            <Popup>
              <div style={{ fontWeight: 'bold' }}>Jaipur Textiles</div>
              <div>Status: Compliant</div>
            </Popup>
          </Marker>

          {/* Jodhpur Marker - Normal */}
          <Marker position={[26.2389, 73.0243]} icon={successIcon}>
            <Popup>
              <div style={{ fontWeight: 'bold' }}>Jodhpur Handicrafts</div>
              <div>Status: Compliant</div>
            </Popup>
          </Marker>

          {/* Udaipur Marker - Normal */}
          <Marker position={[24.5854, 73.7125]} icon={successIcon}>
            <Popup>
              <div style={{ fontWeight: 'bold' }}>Udaipur Marble Works</div>
              <div>Status: Compliant</div>
            </Popup>
          </Marker>

          {/* Pali Marker - Alert */}
          <Marker 
            position={[25.7728, 73.3234]} 
            icon={alertIcon}
            eventHandlers={{
              click: () => navigate('/alert-detail'),
            }}
          >
            <Popup>
              <div style={{ fontWeight: 'bold', color: 'var(--accent-danger)' }}>Pali Dyeing Unit A (ALERT)</div>
              <div>Status: Critical Compliance Issue</div>
              <button 
                onClick={() => navigate('/alert-detail')}
                style={{ 
                  marginTop: '8px', 
                  backgroundColor: 'var(--accent-danger)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                View Details
              </button>
            </Popup>
          </Marker>

          {/* Alert Circle for Pali */}
          <Circle
            center={[25.7728, 73.3234]}
            pathOptions={{ 
              color: 'red', 
              fillColor: 'red', 
              fillOpacity: 0.2,
              className: 'pulse-circle' 
            }}
            radius={2000} // 2km radius for visibility on state map
          />
        </MapContainer>
      </div>
      
      <style>{`
        .pulse-circle {
          animation: leaflet-pulse 2s infinite;
        }
        @keyframes leaflet-pulse {
          0% { stroke-width: 2; stroke-opacity: 0.8; fill-opacity: 0.2; }
          50% { stroke-width: 8; stroke-opacity: 0.4; fill-opacity: 0.4; }
          100% { stroke-width: 2; stroke-opacity: 0.8; fill-opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default AdminMap;

