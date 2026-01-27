
import React, { useState } from 'react';
import { FormData, Subscription } from '../types';

interface RegistrationFormProps {
  onSuccess: () => void;
  className?: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, className = "" }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', consent: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate a premium validation process and persist the lead for the Backoffice
    setTimeout(() => {
      // Create a subscription record to be read by the Backoffice component
      const newLead: Subscription = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        status: 'Pending',
        timestamp: Date.now()
      };

      // Persist the new lead to localStorage
      const existingLeads = JSON.parse(localStorage.getItem('vance_leads') || '[]');
      localStorage.setItem('vance_leads', JSON.stringify([...existingLeads, newLead]));

      setLoading(false);
      onSuccess();
    }, 1500);
  };

  const inputClasses = "w-full px-0 py-3 bg-transparent border-b border-stone-200 focus:border-gold outline-none transition-colors placeholder:text-stone-300 text-stone-800";

  return (
    <div className={`bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 ${className}`}>
      <h3 className="text-3xl font-bold text-stone-900 mb-2 serif italic">Reserve Your Invite</h3>
      <p className="text-stone-500 mb-10 text-sm tracking-wide">Enter your details to receive an exclusive access link.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Your Name</label>
          <input required type="text" placeholder="Full name" className={inputClasses} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Private Email</label>
          <input required type="email" placeholder="email@address.com" className={inputClasses} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Phone Number</label>
          <input type="tel" placeholder="+1 (555) 000-0000" className={inputClasses} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
        </div>
        
        <div className="flex items-start gap-4">
          <input id="consent" type="checkbox" className="mt-1 h-4 w-4 accent-gold cursor-pointer" checked={formData.consent} onChange={(e) => setFormData({...formData, consent: e.target.checked})} />
          <label htmlFor="consent" className="text-[11px] text-stone-400 leading-snug cursor-pointer">
            I understand this is an exclusive event and agree to the privacy terms.
          </label>
        </div>

        <button
          disabled={loading || !formData.consent}
          type="submit"
          className={`w-full py-5 bg-gold-gradient text-white rounded-full font-semibold text-sm tracking-[0.2em] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 uppercase`}
        >
          {loading ? 'Validating Access...' : 'REQUEST ACCESS NOW'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
