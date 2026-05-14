import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { LeadCard } from '../components/LeadCard';
import { useLeads } from '../hooks/useLeads';
import { Search, Loader2 } from 'lucide-react';
import { Lead } from '../types';
import { cn } from '../lib/utils';
import { UpdateLeadModal } from '../components/UpdateLeadModal';
import { AddLeadModal } from '../components/AddLeadModal';

export default function Dashboard() {
  const { leads, loading, refreshLeads, updateLead, addLead } = useLeads();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 🔥 MODE + USER
  const mode = localStorage.getItem("mode") || "solo";
  const currentUser = localStorage.getItem("user") || "admin";

  const filterParam = searchParams.get('filter') || 'All';
  const today = new Date().toISOString().split('T')[0];

  const setFilter = (filter: string) => {
    setSearchParams({ filter });
  };

  /* MODE SWITCH BUTTON */
  const switchMode = () => {
    const newMode = mode === "solo" ? "team" : "solo";
    localStorage.setItem("mode", newMode);
    window.location.reload();
  };

  /* SELECT */
  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  /* BULK ASSIGN */
  const bulkAssign = (agent: string) => {
    leads.forEach(lead => {
      if (selectedIds.includes(lead.id)) {
        updateLead({ ...lead, agentName: agent });
      }
    });

    setSelectedIds([]);
    alert(`Assigned to ${agent}`);
  };

  /* STATS */
  const stats = useMemo(() => ({
    overdue: leads.filter(l => l.followUp && l.followUp < today && l.status !== 'Done').length,
    today: leads.filter(l => l.followUp === today && l.status !== 'Done').length,
    upcoming: leads.filter(l => l.followUp && l.followUp > today && l.status !== 'Done').length,
    done: leads.filter(l => l.status === 'Done').length,
    total: leads.length,
  }), [leads]);

  /* ALERT */
  const todayLeads = useMemo(() => {
    return leads.filter(l => l.followUp === today && l.status !== 'Done');
  }, [leads]);

  useEffect(() => {
    const shown = localStorage.getItem("followup_alert_date");

    if (todayLeads.length > 0 && shown !== today) {
      setTimeout(() => {
        alert(`🔔 You have ${todayLeads.length} follow-ups today`);
      }, 500);

      localStorage.setItem("followup_alert_date", today);
    }
  }, [todayLeads]);

  /* FILTER */
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // 🔥 SOLO vs TEAM FILTER
    if (mode === "team") {
      result = result.filter(
        l => (l.agentName || "").toLowerCase() === currentUser.toLowerCase()
      );
    }

    // REMOVE FAKE ADMIN
    result = result.filter(
      l => (l.firstName || "").toLowerCase().trim() !== "admin"
    );

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l =>
        (l.firstName?.toLowerCase() || '').includes(q) ||
        (l.lastName?.toLowerCase() || '').includes(q) ||
        (l.phone || '').includes(q)
      );
    }

    if (filterParam === 'Today') {
      result = result.filter(l => l.followUp === today && l.status !== 'Done');
    }

    if (filterParam === 'Overdue') {
      result = result.filter(l => l.followUp && l.followUp < today && l.status !== 'Done');
    }

    if (filterParam === 'Upcoming') {
      result = result.filter(l => l.followUp && l.followUp > today && l.status !== 'Done');
    }

    if (filterParam === 'Done') {
      result = result.filter(l => l.status === 'Done');
    }

    return result;
  }, [leads, searchQuery, filterParam, mode, currentUser]);

  return (
    <div className="h-screen flex flex-col bg-[#f5f7fb]">

      <Header onAddLead={() => setIsAddModalOpen(true)} />

      {/* 🔥 MODE SWITCH */}
      <div className="px-3 mt-2">
        <button
          onClick={switchMode}
          className="bg-gray-200 px-3 py-1 rounded text-xs"
        >
          Switch to {mode === "solo" ? "Team" : "Solo"}
        </button>
      </div>

      {/* BULK BAR */}
      {selectedIds.length > 0 && (
        <div className="mx-3 mt-2 bg-white p-3 rounded-xl shadow flex justify-between items-center">
          <span className="text-sm font-semibold">
            {selectedIds.length} selected
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => bulkAssign("Agent A")}
              className="bg-emerald-500 text-white px-3 py-1 rounded text-xs"
            >
              Assign A
            </button>

            <button
              onClick={() => bulkAssign("Agent B")}
              className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
            >
              Assign B
            </button>
          </div>
        </div>
      )}

      {/* LEADS */}
      <div className="flex-1 overflow-y-auto px-3 pt-2 pb-24">

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" />
          </div>
        ) : filteredLeads.length > 0 ? (
          filteredLeads.map((lead, idx) => (

            <div key={idx} className="mb-3 space-y-2">

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(lead.id)}
                  onChange={() => toggleSelect(lead.id)}
                />

                <span className="text-sm font-medium text-gray-700">
                  {lead.firstName || "No Name"}
                  <span className="text-xs text-gray-400 ml-2">
                    ({lead.agentName || "Unassigned"})
                  </span>
                </span>
              </div>

              <LeadCard 
                lead={lead} 
                onUpdate={setSelectedLead} 
              />

            </div>

          ))
        ) : (
          <div className="text-center py-20 text-gray-500">
            No leads found
          </div>
        )}

      </div>

      <BottomNav onRefresh={refreshLeads} />

      {selectedLead && (
        <UpdateLeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSave={updateLead}
        />
      )}

      {isAddModalOpen && (
        <AddLeadModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={addLead}
        />
      )}

    </div>
  );
}