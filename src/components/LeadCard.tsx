import { useState } from 'react';
import { Phone, MessageCircle, Mail, MessageSquare, PencilLine, Check } from 'lucide-react';
import { Lead } from '../types';
import { cn, formatDate, getStatusColor } from '../lib/utils';

interface LeadCardProps {
  lead: Lead;
  onUpdate: (lead: Lead) => void;
}

export function LeadCard({ lead, onUpdate }: LeadCardProps) {

  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  const handleCall = () => window.open(`tel:${lead.phone}`);
  const handleWhatsApp = () => window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`);
  const handleSMS = () => window.open(`sms:${lead.phone}`);
  const handleEmail = () => window.open(`mailto:${lead.email}`);

  // 🔥 OPEN MODAL
  const handleMarkDone = () => {
    setShowModal(true);
  };

  // 🔥 CONFIRM DONE (FINAL FIX)
  const confirmDone = () => {
    if (!selectedReason) return;

    const updatedLead = {
      ...lead,

      // ✅ MOST IMPORTANT
      status: 'Done',

      // optional fields
      callDone: 'Done',
      doneReason: selectedReason,

      // 🔥 CRITICAL (BACKEND UPDATE NEEDS THIS)
      rowIndex: lead.rowIndex
    };

    onUpdate(updatedLead);

    setShowModal(false);
    setSelectedReason('');
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">

        {/* HEADER */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
            {lead.firstName?.[0]?.toUpperCase() || '?'}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">

              <h3 className="font-bold text-lg text-gray-800">
                {lead.firstName} {lead.lastName}
              </h3>

              {lead.status === 'Done' && (
                <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-md font-bold flex items-center gap-1">
                  <Check size={10} /> DONE
                </span>
              )}

            </div>

            <p className="text-xs text-gray-500 mb-1">
              {lead.propType || 'No details'}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>+{lead.phone}</span>
              <span>•</span>

              <div className={cn("flex items-center gap-1 font-semibold", getStatusColor(lead.followUp))}>
                <Calendar size={12} />
                {formatDate(lead.followUp)}
              </div>
            </div>

            {/* DONE REASON */}
            {lead.status === 'Done' && lead.doneReason && (
              <p className="text-[11px] text-gray-400 mt-1">
                Reason: {lead.doneReason}
              </p>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {lead.status !== 'Done' ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-3">

              <button onClick={handleWhatsApp}
                className="bg-emerald-50 text-emerald-700 py-3 rounded-xl flex items-center justify-start gap-2 px-4 font-semibold">
                <MessageCircle size={16} />
                WhatsApp
              </button>

              <button onClick={handleCall}
                className="bg-blue-50 text-blue-700 py-3 rounded-xl flex items-center justify-start gap-2 px-4 font-semibold">
                <Phone size={16} />
                Call
              </button>

              <button onClick={handleSMS}
                className="bg-yellow-50 text-yellow-700 py-3 rounded-xl flex items-center justify-start gap-2 px-4 font-semibold">
                <MessageSquare size={16} />
                SMS
              </button>

              <button onClick={handleEmail}
                className="bg-purple-50 text-purple-700 py-3 rounded-xl flex items-center justify-start gap-2 px-4 font-semibold">
                <Mail size={16} />
                Email
              </button>

            </div>

            {/* UPDATE */}
            <button
              onClick={() => onUpdate(lead)}
              className="w-full bg-emerald-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold mb-2"
            >
              <PencilLine size={18} />
              Update After Call
            </button>

            {/* DONE BUTTON */}
            <button
              onClick={handleMarkDone}
              className="w-full bg-[#6B6A5E] text-white py-2 rounded-xl text-sm font-semibold"
            >
              Mark as Done
            </button>

          </>
        ) : (
          <div className="text-center text-xs text-gray-400 py-2 font-medium">
            ✔ Lead Closed
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-5 w-[90%] max-w-sm shadow-xl">

            <h3 className="font-bold text-lg mb-3">Select Reason</h3>

            <div className="space-y-2 mb-4">
              {["Closed Deal", "Not Interested", "No Response"].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedReason(r)}
                  className={`w-full py-2 rounded-lg text-sm font-semibold ${
                    selectedReason === r
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDone}
                className="flex-1 py-2 bg-emerald-500 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

/* CALENDAR ICON */
function Calendar({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}