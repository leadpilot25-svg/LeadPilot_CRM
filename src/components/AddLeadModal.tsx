import { useState } from 'react';
import { Lead } from '../types';
import { X, User, Phone, Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddProps {
  onClose: () => void;
  onSave: (lead: Lead) => void;
}

export function AddLeadModal({ onClose, onSave }: AddProps) {

  // 🔥 SIMPLE USER (FIXED)
  const currentUser = localStorage.getItem("user") || "admin";
  const mode = localStorage.getItem("mode") || "solo";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState<Partial<Lead>>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    propType: '',
    budget: '',
    location: '',
    remarks: '',
    status: 'New',
    followUp: new Date().toISOString().split('T')[0],
    source: 'Website',

    // 🔥 AUTO ASSIGN
    agentName: currentUser,
  });

  const agents = ["Agent A", "Agent B"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage("Saving...");

    try {

      const leadData = {
        ...formData,
        timestamp: new Date().toISOString(),
        callDone: 'No',
        status: 'New',

        // 🔥 FINAL ASSIGN LOGIC
        agentName:
          mode === "solo"
            ? "admin"
            : currentUser === "admin"
              ? formData.agentName || "Unassigned"
              : currentUser,
      };

      await fetch("https://script.google.com/macros/s/AKfycbwkNhVGI9Te8mJ4ik6_NtVKfC1rywyxd-ETs3VWVg1Th3fijCj-604BMYb4OwNEOfODPA/exec", {
        method: "POST",
        body: JSON.stringify({
          action: "addLead",
          lead: leadData
        })
      });

      setMessage("Lead added successfully ✅");

      onSave(leadData as Lead);

      setTimeout(() => {
        onClose();
      }, 800);

    } catch (err) {
      setMessage("Failed to save. Try again ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40"
        />

        <motion.div 
          initial={{ translateY: '100%' }}
          animate={{ translateY: 0 }}
          exit={{ translateY: '100%' }}
          className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        >

          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-black">Add New Lead</h2>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <Input label="First Name" icon={User} value={formData.firstName}
              onChange={v => setFormData({ ...formData, firstName: v })} required />

            <Input label="Phone" icon={Phone} value={formData.phone}
              onChange={v => setFormData({ ...formData, phone: v })} required />

            <Input label="Email" icon={Mail} value={formData.email}
              onChange={v => setFormData({ ...formData, email: v })} />

            <Input label="Location" icon={MapPin} value={formData.location}
              onChange={v => setFormData({ ...formData, location: v })} />

            {/* 🔥 ADMIN CAN ASSIGN */}
            {mode === "team" && currentUser === "admin" && (
              <div>
                <label className="text-xs text-gray-400">Assign Agent</label>
                <select
                  value={formData.agentName}
                  onChange={e => setFormData({ ...formData, agentName: e.target.value })}
                  className="w-full bg-gray-50 border rounded-xl py-3 px-4"
                >
                  <option value="">Assign</option>
                  {agents.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            )}

            {/* FOLLOW UP */}
            <input
              type="date"
              value={formData.followUp}
              onChange={e => setFormData({ ...formData, followUp: e.target.value })}
              className="w-full bg-gray-50 border rounded-xl py-3 px-4"
            />

            {/* 🔥 BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#059669] text-white py-3 rounded-xl font-bold active:scale-95"
            >
              {loading ? "Saving..." : "Create Lead"}
            </button>

            {/* 🔥 MESSAGE */}
            {message && (
              <p className="text-center text-sm mt-2 text-gray-500">
                {message}
              </p>
            )}

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* INPUT */
function Input({ label, icon: Icon, value, onChange, required = false }: any) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <div className="flex items-center bg-gray-50 border rounded-xl px-3">
        <Icon size={16} className="text-gray-400" />
        <input
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          required={required}
          className="w-full p-3 bg-transparent outline-none"
        />
      </div>
    </div>
  );
}