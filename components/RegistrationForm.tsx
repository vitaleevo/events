"use client";

import React, { useState } from 'react';
import { FormData } from '@/lib/types';
import { useLanguage } from './LanguageContext';

interface RegistrationFormProps {
  onSuccess: () => void;
  className?: string; // Kept for compatibility but mostly unused
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  /* Updated to use context */
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', consent: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Registration failed');
      }

      onSuccess();
    } catch (err) {
      setError(t.form.error);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-0 py-3 bg-transparent border-b border-white/20 focus:border-gold outline-none transition-all duration-300 placeholder:text-stone-500 text-white font-light focus:pl-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="group">
        <label className="text-[9px] uppercase tracking-widest text-gold font-bold block mb-1 opacity-70 group-hover:opacity-100 transition-opacity">{t.form.name_label}</label>
        <input required type="text" placeholder={t.form.name_placeholder} className={inputClasses} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      </div>
      <div className="group">
        <label className="text-[9px] uppercase tracking-widest text-gold font-bold block mb-1 opacity-70 group-hover:opacity-100 transition-opacity">{t.form.email_label}</label>
        <input required type="email" placeholder={t.form.email_placeholder} className={inputClasses} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      </div>
      <div className="group">
        <label className="text-[9px] uppercase tracking-widest text-gold font-bold block mb-1 opacity-70 group-hover:opacity-100 transition-opacity">{t.form.phone_label}</label>
        <input type="tel" placeholder={t.form.phone_placeholder} className={inputClasses} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
      </div>

      <div className="flex items-start gap-4 pt-2">
        <div className="relative flex items-center pt-1">
          <input id="consent" type="checkbox" className="peer h-6 w-6 appearance-none border border-stone-500 rounded-md checked:bg-gold checked:border-gold transition-all cursor-pointer shadow-inner" checked={formData.consent} onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} />
          <i className="fa-solid fa-check text-stone-900 text-xs absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none"></i>
        </div>
        <label htmlFor="consent" className="text-[12px] text-stone-400 leading-relaxed cursor-pointer hover:text-stone-300 transition-colors py-1">
          {t.form.consent_pre} <a href="#" className="underline decoration-stone-600 hover:decoration-gold underline-offset-4">{t.form.consent_link}</a> {t.form.consent_post}
        </label>
      </div>


      {error && <p className="text-red-400 text-xs bg-red-400/10 p-2 rounded">{error}</p>}

      <button
        disabled={loading || !formData.consent}
        type="submit"
        className="w-full py-4 mt-2 bg-white text-stone-900 rounded-full font-bold text-xs tracking-[0.2em] shadow-lg hover:bg-gold hover:text-white hover:shadow-gold/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 uppercase"
      >
        {loading ? t.form.processing : t.form.submit_btn}
      </button>
    </form>
  );
};

export default RegistrationForm;
