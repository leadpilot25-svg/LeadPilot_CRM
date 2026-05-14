import { useState } from 'react';
import { Lead } from '../types';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface UpdateProps {
  lead: Lead;
  onClose: () => void;
  onSave: (lead: Lead) => void;
}

export function UpdateLeadModal({ lead, onClose, onSave }: UpdateProps) {

  const [formData, setFormData] = useState({
    callResult: lead.callResult || '',
    remarks: lead.remarks || '',
    callDone: lead.callDone || 'No',
    followUp: lead.followUp || '',
    markDone: lead.status === 'Done',
    doneReason: (lead as any).doneReason || '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (formData.callDone === 'Yes' && !formData.callResult) {
      setError('Call Result is required if call is done');
      return;
    }

    if (formData.markDone && !formData.doneReason) {
      setError('Please select a reason to close');
      return;
    }

    setError('');
    setLoading(true);
    setMessage("Saving...");

    const today = new Date().toISOString().split('T')[0];

    let status = lead.status || 'New';

    if (formData.markDone) {
      status = 'Done';
    } else {
      if (formData.followUp) {
        if (formData.followUp === today) status = 'Today';
        else if (formData.followUp > today) status = 'Upcoming';
        else if (formData.followUp < today) status = 'Overdue';
      }
    }

    try {

      const updatedLead = {
        ...lead,
        ...formData,
        status,
        doneReason: formData.markDone ? formData.doneReason : '',
      };

      onSave(updatedLead as any);

      setMessage("Lead updated successfully ✅");

      setTimeout(() => {
        onClose();
      }, 700);

    } catch (err) {
      setMessage("Failed to update ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ translateY: '100%' }}
          animate={{ translateY: 0 }}
          exit={{ translateY: '100%' }}
          className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
        >

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-800">
              Update After Call
            </h2>
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* CALL DONE */}
            <div>
              <label className="text-xs font-bold text-gray-400 mb-2 block">
                Call Done?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['No', 'Yes'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, callDone: opt })}
                    className={cn(
                      "py-3 rounded-xl font-bold border",
                      formData.callDone === opt
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-gray-500"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* CALL RESULT */}
            <div>
              <label className="text-xs font-bold text-gray-400 mb-2 block">
                Call Result
              </label>
              <select
                value={formData.callResult}
                onChange={(e) => setFormData({ ...formData, callResult: e.target.value })}
                className="w-full bg-gray-50 border rounded-xl p-3"
              >
                <option value="">Select Result...</option>
                <option value="Not Answered">Not Answered</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Call Back Later">Call Back Later</option>
                <option value="Meeting Scheduled">Meeting Scheduled</option>
              </select>
            </div>

            {/* REMARKS */}
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full border rounded-xl p-3"
              placeholder="Write notes..."
            />

            {/* FOLLOW UP */}
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
              <input
                type="date"
                value={formData.followUp}
                onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
                className="w-full border rounded-xl py-3 pl-10"
              />
            </div>

            {/* DONE + REASON */}
            <div className="border rounded-xl p-3">
              <label className="text-xs font-bold text-gray-400 mb-2 block">
                Close Lead?
              </label>

              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={formData.markDone}
                  onChange={(e) => setFormData({ ...formData, markDone: e.target.checked })}
                />
                <span className="text-sm font-semibold">Mark as Done</span>
              </div>

              {formData.markDone && (
                <select
                  value={formData.doneReason}
                  onChange={(e) => setFormData({ ...formData, doneReason: e.target.value })}
                  className="w-full bg-gray-50 border rounded-xl p-3"
                >
                  <option value="">Select reason...</option>
                  <option value="Closed Deal">Closed Deal</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="No Response">No Response</option>
                </select>
              )}
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            {/* SAVE BUTTON */}
            <button
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold active:scale-95"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            {/* MESSAGE */}
            {message && (
              <p className="text-center text-sm text-gray-500">
                {message}
              </p>
            )}

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}