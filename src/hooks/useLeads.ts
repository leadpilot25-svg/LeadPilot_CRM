import { Lead } from '../types';
import { LeadService } from '../services/leadService';
import { useState, useEffect } from 'react';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const mode = localStorage.getItem("app_mode") || "solo";

  const refreshLeads = async () => {
    setLoading(true);
    try {
      const data = await LeadService.fetchLeads();

      let filtered = data;

      // 🔥 TEAM MODE FILTER
      if (mode === "team") {
        if (user.role === "agent") {
          filtered = data.filter(
            l =>
              (l.agentName || "")
                .toLowerCase()
                .trim() === user.name.toLowerCase().trim()
          );
        }
      }

      setLeads(filtered);

    } catch (err) {
      setError('Failed to fetch leads');
      setLeads(LeadService.getLocalLeads());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLeads();
  }, []);

  /* 🔥 ADD LEAD (NO AUTO ASSIGN) */
  const addLead = async (lead: Lead) => {
    const today = new Date().toISOString().split('T')[0];

    let followUp = lead.followUp || today;
    let status = 'New';

    if (followUp === today) status = 'Today';
    else if (followUp > today) status = 'Upcoming';
    else if (followUp < today) status = 'Overdue';

    const newLead: Lead = {
      ...lead,
      followUp,
      status,

      // ✅ CLEAN LOGIC
      agentName:
        mode === "team"
          ? (user.role === "agent"
              ? user.name   // agent creates → assign to self
              : "")         // admin creates → NO ASSIGN
          : (user.name || "Me"),
    };

    await LeadService.addLead(newLead);
    await refreshLeads();
  };

  /* 🔥 UPDATE LEAD */
  const updateLead = async (lead: Lead) => {
    const today = new Date().toISOString().split('T')[0];

    let status = lead.status || 'New';

    if (status !== "Done") {
      if (lead.followUp === today) status = 'Today';
      else if (lead.followUp > today) status = 'Upcoming';
      else if (lead.followUp < today) status = 'Overdue';
    }

    const updatedLead: Lead = {
      ...lead,
      status,
    };

    await LeadService.updateLead(updatedLead);
    await refreshLeads();
  };

  return { leads, loading, error, refreshLeads, addLead, updateLead };
}