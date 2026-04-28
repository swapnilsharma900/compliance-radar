import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminMap from './pages/AdminMap';
import AlertDetail from './pages/AlertDetail';
import SensorLive from './pages/SensorLive';
import CitizenDashboard from './pages/CitizenDashboard';
import InspectorView from './pages/InspectorView';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/citizen" element={<CitizenDashboard />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminMap />} />
        <Route path="alert-detail" element={<AlertDetail />} />
        <Route path="sensor-live" element={<SensorLive />} />
        <Route path="inspector-view" element={<InspectorView />} />
      </Route>
    </Routes>
  );
};

export default App;
