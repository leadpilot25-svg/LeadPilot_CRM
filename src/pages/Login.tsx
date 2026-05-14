import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {

    if (!username || !password) {
      alert("Enter username & password");
      return;
    }

    const uname = username.toLowerCase().trim();

    // 👑 ADMIN
    if (uname === 'admin' && password === '1234') {
      localStorage.setItem("user", "admin");
      navigate('/', { replace: true });
      return;
    }

    // 👥 AGENTS
    if (uname === 'agent1' && password === '1234') {
      localStorage.setItem("user", "Agent A");
      navigate('/', { replace: true });
      return;
    }

    if (uname === 'agent2' && password === '1234') {
      localStorage.setItem("user", "Agent B");
      navigate('/', { replace: true });
      return;
    }

    // ❌ INVALID
    alert("Invalid credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          LeadPilot Login
        </h2>

        {/* USERNAME */}
        <div className="mb-4">
          <label className="text-xs text-gray-400">Username</label>
          <div className="flex items-center bg-gray-50 border rounded-xl px-3">
            <User size={16} className="text-gray-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-transparent outline-none"
              placeholder="Enter username"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="text-xs text-gray-400">Password</label>
          <div className="flex items-center bg-gray-50 border rounded-xl px-3">
            <Lock size={16} className="text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-transparent outline-none"
              placeholder="Enter password"
            />
          </div>
        </div>

        {/* LOGIN */}
        <button
          onClick={handleLogin}
          className="w-full bg-[#059669] text-white py-3 rounded-xl font-bold active:scale-95 transition-all"
        >
          Login
        </button>

        {/* DEMO INFO */}
        <p className="text-xs text-gray-400 text-center mt-4">
          Admin: admin / 1234 <br />
          Agent A: agent1 / 1234 <br />
          Agent B: agent2 / 1234
        </p>

      </div>
    </div>
  );
}