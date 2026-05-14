import { Plus, LogOut, User } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onAddLead: () => void;
}

export function Header({ onAddLead }: HeaderProps) {
  const today = new Date();
  const navigate = useNavigate();

  // 🔥 GET USER
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 🔥 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-3 sticky top-0 z-50 shadow-sm">
      
      <div className="flex justify-between items-center">

        {/* LOGO + BRAND */}
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="logo" 
            className="w-8 h-8 rounded-md bg-white p-1"
          />
          <div>
            <h1 className="text-lg font-bold leading-tight">LeadPilot</h1>
            <p className="text-[11px] opacity-80 leading-tight">
              Smart Lead Manager
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">

          {/* 👤 USER ROLE */}
          {user?.name && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] bg-white/20 px-2 py-1 rounded-md">
              <User size={12} />
              {user.name}
            </div>
          )}

          {/* ➕ ADD BUTTON */}
          <button 
            onClick={onAddLead}
            className="bg-white text-emerald-600 px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
          >
            <Plus size={16} />
            Add
          </button>

          {/* 🔓 LOGOUT */}
          <button
            onClick={handleLogout}
            className="bg-white/20 px-2 py-1.5 rounded-md active:scale-95 transition-all"
          >
            <LogOut size={16} />
          </button>

        </div>

      </div>

      {/* DATE */}
      <p className="text-[11px] opacity-80 mt-1">
        {formatDate(today)}
      </p>

    </div>
  );
}