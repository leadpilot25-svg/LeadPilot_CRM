export interface Lead {
  id?: string; // We'll generate or use timestamp
  timestamp: string;
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp: string;
  email: string;
  bs: 'Buyer' | 'Seller' | '';
  propType: string;
  budget: string;
  source: string;
  location: string;
  remarks: string;
  status: 'New' | 'Upcoming' | 'Done' | string;
  followUp: string; // ISO date string
  callDone: 'Yes' | 'No' | '';
  callResult: string;
  propValue: string;
  commission: string;
  expComm: string;
  priority: 'Hot' | 'Warm' | 'Cold' | '';
  urgency: string;
  quickChat: string;
  agentEmail: string;
  agentName: string;
}

export type LeadStatus = 'New' | 'Upcoming' | 'Done' | 'All';
export type TaskCategory = 'Overdue' | 'Today' | 'Soon' | 'Total';
