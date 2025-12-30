import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute requiredRole="dashboard">
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/pos" element={
          <ProtectedRoute requiredRole="pos">
            <Layout><POS /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/inventory" element={
          <ProtectedRoute requiredRole="inventory">
            <Layout><Inventory /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/reports" element={
          <ProtectedRoute requiredRole="reports">
            <Layout><Reports /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute requiredRole="settings">
            <Layout><Settings /></Layout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
