import { useLeads } from '../hooks/useLeads';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Target, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

export default function Stats() {
  const { leads } = useLeads();
  const navigate = useNavigate();

  const hotLeads = leads.filter(l => l.priority === 'Hot').length;
  const totalLeads = leads.length;

  const priorityData = [
    { name: 'Hot', value: hotLeads, color: '#ef4444' },
    { name: 'Warm', value: leads.filter(l => l.priority === 'Warm').length, color: '#f59e0b' },
    { name: 'Cold', value: leads.filter(l => l.priority === 'Cold').length, color: '#3b82f6' },
  ].filter(d => d.value > 0);

  const statusData = [
    { name: 'New', value: leads.filter(l => l.status === 'New').length },
    { name: 'Upcoming', value: leads.filter(l => l.status === 'Upcoming').length },
    { name: 'Done', value: leads.filter(l => l.status === 'Done').length },
  ];

  // 🔥 CLEAN AGENT PERFORMANCE LOGIC
  const agentMap: any = {};
  let unassignedCount = 0;

  leads.forEach((l) => {
    const raw = (l.agentName || "").trim();
    const agent = raw.toLowerCase();

    // ❌ REMOVE BAD VALUES
    if (!agent) {
      unassignedCount++;
      return;
    }

    if (agent === "admin") return;
    if (agent === "agent") return;

    if (agent === "unassigned") {
      unassignedCount++;
      return;
    }

    // ✅ VALID AGENT
    if (!agentMap[agent]) {
      agentMap[agent] = {
        name: raw, // preserve original case
        total: 0,
        done: 0,
      };
    }

    agentMap[agent].total += 1;

    if ((l.status || "").toLowerCase() === "done") {
      agentMap[agent].done += 1;
    }
  });

  const agentData = Object.values(agentMap).map((a: any) => ({
    name: a.name,
    total: a.total,
    conversion: a.total
      ? Math.round((a.done / a.total) * 100)
      : 0,
  }));

  // 🔥 SORT TOP PERFORMERS FIRST
  agentData.sort((a: any, b: any) => b.conversion - a.conversion);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      {/* HEADER */}
      <div className="bg-[#059669] text-white p-4 sticky top-0 z-50 shadow">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-2 flex items-center gap-2 opacity-90"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <h1 className="text-2xl font-black">Performance</h1>
        <p className="text-emerald-100 text-xs">Real-time pipeline analytics</p>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">

        {/* TOP CARDS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-5 shadow border">
            <div className="text-2xl font-black text-gray-800">{totalLeads}</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total Leads</p>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow border">
            <div className="text-2xl font-black text-gray-800">{hotLeads}</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Hot Leads</p>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white rounded-3xl p-6 shadow border">
          <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <Target size={16} /> Lead Priority
          </h3>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={priorityData} dataKey="value" innerRadius={60} outerRadius={80}>
                  {priorityData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* STATUS CHART */}
        <div className="bg-white rounded-3xl p-6 shadow border">
          <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <TrendingUp size={16} /> Status Overview
          </h3>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={statusData}>
                <XAxis dataKey="name" fontSize={10} />
                <Tooltip />
                <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔥 AGENT PERFORMANCE */}
        <div className="bg-white rounded-3xl p-6 shadow border">
          <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <Users size={16} /> Agent Performance
          </h3>

          <div className="space-y-3">

            {agentData.map((a: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-sm border-b pb-2">

                <div>
                  <p className="font-semibold text-gray-800">{a.name}</p>
                  <p className="text-xs text-gray-400">
                    {a.total} leads handled
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-emerald-600 font-bold">
                    {a.conversion}%
                  </p>
                  <p className="text-[10px] text-gray-400">
                    conversion
                  </p>
                </div>

              </div>
            ))}

            {/* OPTIONAL UNASSIGNED */}
            {unassignedCount > 0 && (
              <div className="flex justify-between text-xs text-gray-500 pt-2">
                <span>Unassigned</span>
                <span>{unassignedCount} leads</span>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}