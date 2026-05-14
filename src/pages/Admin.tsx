import { useLeads } from '../hooks/useLeads';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';

export default function Admin() {
  const { leads } = useLeads();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 🔒 ONLY ADMIN ACCESS
  if (user.role !== "admin") {
    return (
      <div className="p-6 text-center text-red-500 font-bold">
        Access Denied
      </div>
    );
  }

  // 🔥 AGENT PERFORMANCE LOGIC
  const agentMap: any = {};

  leads.forEach((l) => {
    const agent = l.agentName || "Unassigned";

    if (!agentMap[agent]) {
      agentMap[agent] = {
        name: agent,
        total: 0,
        done: 0
      };
    }

    agentMap[agent].total += 1;

    if (l.status === "Done") {
      agentMap[agent].done += 1;
    }
  });

  const agentData: any[] = Object.values(agentMap);

  // 🔥 TOP AGENT
  const topAgent = agentData.sort((a, b) => {
    const rateA = a.total ? a.done / a.total : 0;
    const rateB = b.total ? b.done / b.total : 0;
    return rateB - rateA;
  })[0];

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* 🔥 SUMMARY */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <p className="text-xs text-gray-400">Total Agents</p>
        <h2 className="text-xl font-bold">{agentData.length}</h2>
      </div>

      {/* 🔥 TOP AGENT */}
      {topAgent && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl mb-4 flex items-center gap-3">
          <Trophy className="text-emerald-600" />
          <div>
            <p className="text-xs text-gray-500">Top Performer</p>
            <p className="font-bold text-gray-800">{topAgent.name}</p>
          </div>
        </div>
      )}

      {/* AGENTS */}
      <div className="space-y-3">

        {agentData.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No agent data yet
          </div>
        ) : (
          agentData.map((a: any) => {
            const rate = a.total ? Math.round((a.done / a.total) * 100) : 0;

            return (
              <div key={a.name} className="bg-white p-4 rounded-xl shadow">

                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{a.name}</span>
                  <span className="text-sm text-gray-500">{rate}%</span>
                </div>

                <div className="w-full bg-gray-100 h-2 rounded-full">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${rate}%` }}
                  />
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  {a.done} / {a.total} converted
                </div>

              </div>
            );
          })
        )}

      </div>

    </div>
  );
}