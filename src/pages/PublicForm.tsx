import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, User, Phone, Mail, MapPin, Home, Search, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function PublicForm() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || 'Website';

  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    email: '',
    location: '',
    propType: '',
    budget: '',
    remarks: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage("Saving...");
    setErrorMsg("");

    const leadData = {
      ...formData,
      lastName: '',
      whatsapp: formData.phone,
      bs: '',
      source: source,

      // 🔥 IMPORTANT FIXES
      status: 'New',
      followUp: new Date().toISOString().split('T')[0],
      callDone: 'No',
      callResult: '',
      timestamp: new Date().toISOString(),
      priority: 'Warm',

      agentName: '',        // ✅ EMPTY → allows auto assign later
      agentEmail: '',
    };

    try {
      await fetch("https://script.google.com/macros/s/AKfycbx00VHqJdkznal-Cptd8ketaS_9PcURs_DWMJA-b7EXkIEPPunFX_5uX4rf1OLytiJexA/exec", {
        method: "POST",
        mode: "no-cors", // required for GAS
        body: JSON.stringify({
          action: "addLead",
          lead: leadData
        })
      });

      setMessage("Lead added successfully ✅");
      setSubmitted(true);

    } catch (error) {
      setErrorMsg("Failed to save. Try again ❌");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-xl max-w-sm"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">Success!</h1>
          <p className="text-gray-500 mb-6">Our agent will contact you soon.</p>

          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                firstName: '',
                phone: '',
                email: '',
                location: '',
                propType: '',
                budget: '',
                remarks: '',
              });
              setMessage("");
              setErrorMsg("");
            }}
            className="w-full bg-[#059669] text-white py-4 rounded-xl font-bold"
          >
            Submit Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-12">
      <div className="max-w-lg mx-auto">

        <div className="text-center mb-8 pt-6">
          <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Home className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">LeadPilot</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-xl space-y-4">

          <Input label="Full Name" icon={User} value={formData.firstName} onChange={v => setFormData({ ...formData, firstName: v })} required />
          <Input label="Phone" icon={Phone} value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} required />
          <Input label="Email" icon={Mail} value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
          <Input label="Location" icon={MapPin} value={formData.location} onChange={v => setFormData({ ...formData, location: v })} />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={formData.propType}
              onChange={e => setFormData({ ...formData, propType: e.target.value })}
              className="bg-gray-50 border rounded-xl p-3"
            >
              <option value="">Property</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Land</option>
            </select>

            <Input label="Budget" icon={Search} value={formData.budget} onChange={v => setFormData({ ...formData, budget: v })} />
          </div>

          <textarea
            value={formData.remarks}
            onChange={e => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="Remarks"
            className="w-full bg-gray-50 border rounded-xl p-3"
          />

          {message && <p className="text-center text-green-600">{message}</p>}
          {errorMsg && <p className="text-center text-red-500">{errorMsg}</p>}

          <button type="submit" disabled={loading} className="w-full bg-[#059669] text-white py-4 rounded-xl font-bold">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Submit'}
          </button>

        </form>
      </div>
    </div>
  );
}

function Input({ label, icon: Icon, value, onChange, required }: any) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <div className="flex items-center bg-gray-50 border rounded-xl px-3">
        <Icon size={16} className="text-gray-400" />
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
          className="w-full p-3 bg-transparent outline-none"
        />
      </div>
    </div>
  );
}