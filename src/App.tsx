import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Dashboard from './pages/Dashboard';
import PublicForm from './pages/PublicForm';
import Settings from './pages/Settings';
import Stats from './pages/Stats';
import Login from './pages/Login';
import Admin from './pages/Admin';

// 🔒 AUTH CHECK (AI STUDIO VERSION)
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      setIsAuth(!!user);
    } catch {
      setIsAuth(false);
    }
  }, []);

  if (isAuth === null) return <div>Loading...</div>;

  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>

        {/* 🔓 PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<PublicForm />} />
        <Route path="/lead-form" element={<PublicForm />} />

        {/* 🔒 PRIVATE */}
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

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

        {/* ✅ FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}