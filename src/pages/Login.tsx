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

    // 🔥 GET CURRENT MODE
    const mode = localStorage.getItem("mode") || "solo";

    // 👑 ADMIN LOGIN
    if (uname === 'admin' && password === '1234') {

      // SAVE SIMPLE USER (IMPORTANT FIX)
      localStorage.setItem("user", "admin");

      navigate('/');
      return;
    }

    // 🔥 AGENT MAPPING
    let agentName = "";

    if (uname === 'agent1') agentName = "Agent A";
    else if (uname === 'agent2') agentName = "Agent B";

    // ❌ INVALID AGENT
    if (!agentName && password === '1234') {
      alert("Invalid agent username (use agent1 or agent2)");
      return;
    }

    // ✅ AGENT LOGIN
    if (agentName && password === '1234') {

      // 🔥 SAVE ONLY NAME (VERY IMPORTANT)
      localStorage.setItem("user", agentName);

      navigate('/');
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

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-[#059669] text-white py-3 rounded-xl font-bold active:scale-95 transition-all"
        >
          Login
        </button>

        {/* INFO */}
        <p className="text-xs text-gray-400 text-center mt-4">
          Admin: admin / 1234 <br />
          Agent A: agent1 / 1234 <br />
          Agent B: agent2 / 1234
        </p>

      </div>
    </div>
  );
}