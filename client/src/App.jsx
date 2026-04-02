import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import BriefBuilder from './pages/brief-builder';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/brief-builder" element={<BriefBuilder />} />
        <Route path="/settings" element={<Settings />} />
        {/* Redirect common routes to canonical paths */}
        <Route path="/brief" element={<Navigate to="/brief-builder" replace />} />
        {/* Redirect unknown routes to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
