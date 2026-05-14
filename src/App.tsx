import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, ReactNode } from 'react';

// Import your actual pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PublicForm from './pages/PublicForm';
import Settings from './pages/Settings';
import Stats from './pages/Stats';
import Admin from './pages/Admin';

function PrivateRoute({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setIsAuth(false);
    } else {
      try {
        JSON.parse(user);
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    }
  }, []);

  if (isAuth === null) return null; // Prevents "flashing" login page on refresh
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
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
