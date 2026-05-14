import { Lead } from '../types';

const STORAGE_KEY = 'leadpilot_leads';
const CONFIG_KEY = 'leadpilot_config';

export const LeadService = {

  /* -------- GET GAS URL -------- */
  getGasUrl(): string {
    const config = localStorage.getItem(CONFIG_KEY);
    if (config) {
      try {
        return JSON.parse(config).gasUrl || '';
      } catch {
        return '';
      }
    }
    return import.meta.env.VITE_GAS_SCRIPT_URL || '';
  },

  /* -------- SET GAS URL -------- */
  setGasUrl(url: string) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify({ gasUrl: url }));
  },

  /* -------- FETCH LEADS (MASTER SOURCE = SHEET) -------- */
  async fetchLeads(): Promise<Lead[]> {
    const url = this.getGasUrl();

    if (!url) {
      console.warn('No GAS URL configured');
      return this.getLocalLeads();
    }

    try {
      const response = await fetch(`${url}?action=getLeads`);
      const data = await response.json();

      if (data && data.leads) {
        this.saveLocalLeads(data.leads); // cache only
        return data.leads;
      }

      return this.getLocalLeads();
    } catch (error) {
      console.error('Error fetching leads:', error);
      return this.getLocalLeads();
    }
  },

  /* -------- ADD LEAD (FIXED - NO DUPLICATE) -------- */
  async addLead(lead: Lead): Promise<boolean> {
    const url = this.getGasUrl();

    if (!url) {
      console.warn("No GAS URL");
      return false;
    }

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // keep this for GAS
        body: JSON.stringify({
          action: 'addLead',
          lead: lead
        }),
      });

      return true;

    } catch (error) {
      console.error('Error adding lead:', error);
      return false;
    }
  },

  /* -------- UPDATE LEAD -------- */
  async updateLead(lead: Lead): Promise<boolean> {

    // update local cache
    const leads = this.getLocalLeads();
    const index = leads.findIndex(
      l => (l.id || l.timestamp) === (lead.id || lead.timestamp)
    );

    if (index !== -1) {
      leads[index] = lead;
      this.saveLocalLeads([...leads]);
    }

    const url = this.getGasUrl();
    if (!url) return true;

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'updateLead',
          lead: lead
        }),
      });

      return true;

    } catch (error) {
      console.error('Error updating lead:', error);
      return false;
    }
  },

  /* -------- DELETE LEAD -------- */
  async deleteLead(id: string): Promise<boolean> {

    const leads = this.getLocalLeads();
    const newLeads = leads.filter(
      l => (l.id || l.timestamp) !== id
    );
    this.saveLocalLeads(newLeads);

    const url = this.getGasUrl();
    if (!url) return true;

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'deleteLead',
          id
        }),
      });

      return true;

    } catch (error) {
      console.error('Error deleting lead:', error);
      return false;
    }
  },

  /* -------- LOCAL STORAGE -------- */
  getLocalLeads(): Lead[] {
    const leads = localStorage.getItem(STORAGE_KEY);
    return leads ? JSON.parse(leads) : [];
  },

  saveLocalLeads(leads: Lead[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  },
};