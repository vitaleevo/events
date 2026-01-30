"use client";

import React, { useState, useEffect } from 'react';
import { FormData } from '@/lib/types';
import { useLanguage } from './LanguageContext';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface RegistrationFormProps {
  onSuccess: () => void;
  eventId?: any; // ID of the specific event
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, eventId }) => {
  const { t, language } = useLanguage();
  const createRegistrant = useMutation(api.registrants.createRegistrant);

  // 1. Fetch Event (Try by ID, then Slug, then Get Active)
  const eventById = useQuery(api.events.getEventById, eventId ? { id: eventId } : "skip" as any);
  const eventBySlug = useQuery(api.events.getEventBySlug, !eventId ? { slug: "masterclass-2026" } : "skip" as any);
  const activeEvent = useQuery(api.events.getActiveEvent);

  const event = eventById || eventBySlug || activeEvent;

  // 2. Fetch Registrant Count for this event
  const currentCount = useQuery(api.registrants.getRegistrantCount, event ? { eventId: event._id } : "skip" as any) ?? 0;

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
      await createRegistrant({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        eventId: event?._id,
      });

      onSuccess();
    } catch (err: any) {
      if (err.message?.includes("LIMIT_REACHED")) {
        setError(t.form.limit_reached);
      } else if (err.message?.includes("EVENT_CLOSED")) {
        setError(language === 'pt' ? "As inscrições estão fechadas." : "Registration is closed.");
      } else {
        setError(t.form.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-0 py-3 bg-transparent border-b border-white/20 focus:border-gold outline-none transition-all duration-300 placeholder:text-stone-500 text-white font-light focus:pl-2";

  // --- BUSINESS RULES CHECK ---

  // A. Date Expired Check
  const isExpired = event && new Date(`${event.date}T${event.time || '23:59'}`) < new Date();

  // B. Manual Close Check
  const isClosedManually = event && !event.isOpen;

  // C. Limit Check
  const isLimitReached = event && currentCount >= event.maxRegistrants;

  // D. Event Missing? 
  if (event === undefined) return <div className="p-10 text-center text-stone-500">{t.form.loading_form}</div>;

  // E. Decision: Is Available?
  const isAvailable = event && event.isOpen && !isExpired && !isLimitReached;

  if (!isAvailable) {
    let title = t.form.status_closed_title;
    let message = t.form.status_closed_msg;
    let icon = "fa-calendar-xmark";

    if (isExpired) {
      title = t.form.status_expired_title;
      message = t.form.status_expired_msg;
      icon = "fa-hourglass-end";
    } else if (isLimitReached) {
      title = t.form.status_full_title;
      message = t.form.status_full_msg;
      icon = "fa-users-slash";
    } else if (isClosedManually) {
      title = t.form.status_unavailable_title;
      message = t.form.status_unavailable_msg;
      icon = "fa-lock";
    } else if (!event) {
      title = t.form.status_soon_title;
      message = t.form.status_soon_msg;
      icon = "fa-clock";
    }

    return (
      <div className="p-8 bg-black/40 backdrop-blur-md border border-red-500/20 rounded-[2rem] text-center animate-fade-in shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl border border-red-500/20 shadow-lg shadow-red-500/5">
          <i className={`fa-solid ${icon}`}></i>
        </div>
        <h3 className="text-white font-serif italic text-2xl mb-2">{title}</h3>
        <p className="text-stone-400 text-sm leading-relaxed mb-6">{message}</p>
        <div className="pt-6 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">{t.form.status_footer}</p>
        </div>
      </div>
    );
  }

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
