import { useState, useEffect } from 'react';
import { LeadService } from '../services/leadService';
import { Settings as SettingsIcon, Link2, Save, Trash2, ArrowLeft, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [gasUrl, setGasUrl] = useState('');
  const navigate = useNavigate();

  // 🔥 APP MODE STATE
  const [mode, setMode] = useState("solo");

  useEffect(() => {
    setGasUrl(LeadService.getGasUrl());

    // 🔥 LOAD MODE
    const savedMode = localStorage.getItem("app_mode") || "solo";
    setMode(savedMode);
  }, []);

  const handleSave = () => {
    LeadService.setGasUrl(gasUrl);
    alert('Settings saved successfully!');
    navigate('/');
  };

  // 🔥 TOGGLE MODE
  const handleToggleMode = () => {
    const newMode = mode === "solo" ? "team" : "solo";
    setMode(newMode);
    localStorage.setItem("app_mode", newMode);
    alert(`Switched to ${newMode.toUpperCase()} mode`);
  };

  const handleClearLocal = () => {
    if (confirm('Are you sure you want to clear all local data?')) {
      localStorage.removeItem('leadpilot_leads');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-[#059669] text-white p-6 pb-12">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 opacity-80">
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-3xl font-black">Settings</h1>
        <p className="text-emerald-100 text-sm">Configure your CRM</p>
      </div>

      <div className="px-4 -mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl space-y-6">

          {/* 🔥 TEAM MODE TOGGLE */}
          <div className="bg-gray-50 p-4 rounded-xl border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700">App Mode</p>
                <p className="text-xs text-gray-400">
                  Switch between Solo and Team usage
                </p>
              </div>

              <button
                onClick={handleToggleMode}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Users size={14} />
                {mode === "solo" ? "Switch to Team" : "Switch to Solo"}
              </button>
            </div>

            <p className="text-[11px] text-gray-500 mt-2">
              Current Mode: <b>{mode.toUpperCase()}</b>
            </p>
          </div>

          {/* GOOGLE SCRIPT */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
              Google Apps Script URL
            </label>

            <div className="relative">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                value={gasUrl}
                onChange={e => setGasUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full bg-gray-50 border rounded-xl py-4 pl-12 pr-4"
              />
            </div>
          </div>

          {/* SAVE */}
          <button
            onClick={handleSave}
            className="w-full bg-[#059669] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Save size={20} /> SAVE
          </button>

          {/* CLEAR */}
          <button
            onClick={handleClearLocal}
            className="w-full bg-red-50 text-red-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border"
          >
            <Trash2 size={18} /> CLEAR LOCAL CACHE
          </button>

        </div>
      </div>
    </div>
  );
}