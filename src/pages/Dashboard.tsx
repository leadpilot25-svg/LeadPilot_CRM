import { Search, Plus, Calendar, UserPlus, RefreshCcw, CheckCircle, MessageCircle, Phone, Mail, Send } from 'lucide-react';

export default function Dashboard() {
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* HEADER */}
      <div className="bg-[#00b37e] text-white p-4 pt-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-lg">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">LeadPilot</h1>
              <p className="text-xs opacity-90">Smart Lead Manager</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button className="bg-white/20 p-2 px-4 rounded-full text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Admin
             </button>
             <button className="bg-white text-[#00b37e] p-2 px-4 rounded-full text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add
             </button>
          </div>
        </div>
        <p className="text-xs font-medium opacity-80 pl-1">{date}</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {[
          { label: 'TASKS TODAY', value: '1', color: 'text-slate-800' },
          { label: 'OVERDUE', value: '0', color: 'text-red-500' },
          { label: 'TOTAL LEADS', value: '5', color: 'text-slate-800' },
          { label: 'UPCOMING', value: '1', color: 'text-slate-800' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-4xl font-bold mb-1">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* SEARCH & FILTERS */}
      <div className="px-4 mb-4">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search leads..." 
            className="w-full bg-white py-4 pl-12 pr-4 rounded-2xl shadow-sm border border-slate-100 focus:outline-[#00b37e]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['All', 'Today', 'Overdue', 'Upcoming', 'Done'].map((filter, i) => (
            <button key={filter} className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-[#00b37e] text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* RECENT LEADS */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-slate-800 mb-3">Recent Leads</h2>
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
           <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg">A</div>
              <div>
                 <h3 className="text-xl font-bold text-slate-800">Aru T</h3>
                 <p className="text-sm text-slate-400 mb-1">No details</p>
                 <p className="text-xs text-slate-500 font-medium">+7736037807 • <Calendar className="inline w-3 h-3" /> 14 May 2026</p>
              </div>
           </div>

           {/* ACTIONS */}
           <div className="grid grid-cols-2 gap-3 mb-4">
              <button className="bg-[#f0fff4] text-[#00b37e] py-4 rounded-xl font-bold flex items-center justify-center gap-2"><MessageCircle className="w-5 h-5" /> WhatsApp</button>
              <button className="bg-[#f0f7ff] text-[#3182ce] py-4 rounded-xl font-bold flex items-center justify-center gap-2"><Phone className="w-5 h-5" /> Call</button>
              <button className="bg-[#fffcf0] text-[#d69e2e] py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-sm uppercase">SMS</button>
              <button className="bg-[#faf5ff] text-[#805ad5] py-4 rounded-xl font-bold flex items-center justify-center gap-2"><Mail className="w-5 h-5" /> Email</button>
           </div>

           <button className="w-full bg-[#00b37e] text-white py-4 rounded-xl font-bold mb-3 flex items-center justify-center gap-2">Update After Call</button>
           <button className="w-full bg-[#71716a] text-white py-4 rounded-xl font-bold opacity-80">Mark as Done</button>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center shadow-2xl">
        <div className="flex flex-col items-center gap-1 text-[#00b37e]">
           <Calendar className="w-6 h-6 text-[#00b37e]" />
           <span className="text-[10px] font-bold uppercase">Today</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
           <UserPlus className="w-6 h-6" />
           <span className="text-[10px] font-bold uppercase">New</span>
        </div>
        <div className="bg-[#00b37e] p-3 rounded-2xl -mt-12 shadow-lg shadow-[#00b37e]/40">
           <Plus className="w-7 h-7 text-white" />
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
           <RefreshCcw className="w-6 h-6" />
           <span className="text-[10px] font-bold uppercase">Refresh</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
           <CheckCircle className="w-6 h-6" />
           <span className="text-[10px] font-bold uppercase">Done</span>
        </div>
      </div>
    </div>
  );
}
