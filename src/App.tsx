/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import PublicForm from './pages/PublicForm';
import Settings from './pages/Settings';
import Stats from './pages/Stats';
import Login from './pages/Login';
import Admin from './pages/Admin';

// 🔒 AUTH CHECK
function PrivateRoute({ children }: any) {
  const user = localStorage.getItem("user");

  if (!user) return <Navigate to="/login" />;

  try {
    JSON.parse(user);
    return children;
  } catch {
    return <Navigate to="/login" />;
  }
}

export default function App() {
  return (
    <Router>
      <Routes>

        {/* 🔓 PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<PublicForm />} />
        <Route path="/lead-form" element={<PublicForm />} />

        {/* 🔒 PROTECTED ROUTES */}
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        {/* ✅ SETTINGS (FIXED — NO ADMIN BLOCK) */}
        <Route path="/settings" element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        } />

        <Route path="/stats" element={
          <PrivateRoute>
            <Stats />
          </PrivateRoute>
        } />

        <Route path="/admin" element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        } />

        {/* 🚨 KEEP THIS LAST */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}