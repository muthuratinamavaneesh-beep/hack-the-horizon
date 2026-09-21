import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HackathonProvider } from './context/HackathonContext';

// Pages
import PublicPortal from './pages/PublicPortal';
import Schedule from './pages/Schedule';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSchedule from './pages/admin/AdminSchedule';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';

function App() {
  return (
    <HackathonProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicPortal />} />
          <Route path="/schedule" element={<Schedule />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="schedule" element={<AdminSchedule />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
          </Route>
        </Routes>
      </Router>
    </HackathonProvider>
  );
}

export default App;
