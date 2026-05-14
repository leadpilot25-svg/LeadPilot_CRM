import { useState, useEffect } from 'react';
import { Search, Plus, MessageSquare, Phone, Mail, Send, Calendar, CheckCircle, Clock, RefreshCw, BarChart3, User, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [filter, setFilter] = useState('All');
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const stats = [
    { label: 'Tasks Today', value: '1', color: 'text-gray-800' },
    { label: 'Overdue', value: '0', color: 'text-red-500' },
    { label: 'Total Leads', value: '5', color: 'text-gray-800' },
    { label: 'Upcoming', value: '1', color: 'text-gray-800' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* HEADER */}
      <header className="bg-[#00B074] p-6 text-white rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <div className="bg-white p-1 rounded-lg">
                <Send size={20} className="text-[#00B074]" />
              </div>
              LeadPilot
            </h1>
            <p className="text-xs opacity-90">Smart Lead Manager</p>
            <p className="mt-2 text-sm opacity-80">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
             <button onClick={() => window.location.href='/form'} className="bg-white text-[#00B074] px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm active:scale-95 transition-transform">
              <Plus size={20} /> Add
            </button>
            <button onClick={handleLogout} className="text-white/80 p-1 flex items-center gap-1 text-xs">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 -mt-6">
        {/* STATS BENTO */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
            >
              <h2 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h2>
              <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* SEARCH & FILTERS */}
        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-[#00B074] outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Today', 'Overdue', 'Upcoming', 'Done'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-[#00B074] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* LEAD LIST */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">Recent Leads</h3>
          <div className="space-y-4">
            <LeadCard name="Aru T" phone="+7736037807" date="14 May 2026" />
            <LeadCard name="Joth" phone="+7736037807" date="14 May 2026" />
          </div>
        </div>
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)] rounded-t-3xl">
        <NavItem icon={<Calendar />} label="TODAY" active />
        <NavItem icon={<User />} label="NEW" />
        <div className="bg-[#00B074] text-white p-4 rounded-full -mt-12 shadow-xl border-4 border-gray-100 active:scale-90 transition-transform">
          <Plus size={28} />
        </div>
        <NavItem icon={<RefreshCw />} label="REFRESH" />
        <NavItem icon={<CheckCircle />} label="DONE" />
      </nav>
    </div>
  );
}

function LeadCard({ name, phone, date }: any) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xl font-bold">
          {name[0]}
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-800">{name}</h4>
          <p className="text-xs text-gray-400">No details</p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
            <span>{phone}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Calendar size={10}/> {date}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <CommButton icon={<MessageSquare className="text-green-500" />} label="WhatsApp" color="bg-green-50" />
        <CommButton icon={<Phone className="text-blue-500" />} label="Call" color="bg-blue-50" />
        <CommButton icon={<MessageSquare className="text-amber-500" />} label="SMS" color="bg-amber-50" />
        <CommButton icon={<Mail className="text-purple-500" />} label="Email" color="bg-purple-50" />
      </div>

      <button className="w-full bg-[#00B074] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 mb-2 active:opacity-90">
        Update After Call
      </button>
      <button className="w-full bg-gray-600 text-white/90 py-3 rounded-2xl font-medium active:opacity-90">
        Mark as Done
      </button>
    </motion.div>
  );
}

function CommButton({ icon, label, color }: any) {
  return (
    <div className={`${color} p-3 rounded-xl flex items-center gap-3 active:scale-95 transition-transform cursor-pointer`}>
      {icon}
      <span className="text-sm font-bold text-gray-700">{label}</span>
    </div>
  );
}

function NavItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex flex-col items-center gap-1 cursor-pointer ${active ? 'text-[#00B074]' : 'text-gray-300'}`}>
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  );
}
