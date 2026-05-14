import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, ReactNode } from 'react';

// Import your pages here (Keep your existing imports)
import Dashboard from './pages/Dashboard';
import PublicForm from './pages/PublicForm';
import Settings from './pages/Settings';
import Stats from './pages/Stats';
import Login from './pages/Login';
import Admin from './pages/Admin';

// 🔒 REPAIRED AUTH CHECK
function PrivateRoute({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        setIsAuth(false);
        return;
      }
      JSON.parse(user);
      setIsAuth(true);
    } catch (e) {
      setIsAuth(false);
    }
  }, []);

  // Show nothing or a loader while checking auth (prevents login redirects)
  if (isAuth === null) return null; 
  
  if (!isAuth) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<PublicForm />} />
        <Route path="/lead-form" element={<PublicForm />} />

        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/stats" element={<PrivateRoute><Stats /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
