"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Countdown from '@/components/Countdown';
import RegistrationForm from '@/components/RegistrationForm';
import GeminiAssistant from '@/components/GeminiAssistant';
import Image from 'next/image';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const EventPage = () => {
    const { t, language } = useLanguage();
    const [isRegistered, setIsRegistered] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Fetch Event Data from Convex (Primary source for event details)
    // We try the slug "masterclass-2026", but in production we fallback to the first active event found
    const eventBySlug = useQuery(api.events.getEventBySlug, { slug: "masterclass-2026" });
    const activeEvent = useQuery(api.events.getActiveEvent);

    // Resilience: use slug if found, or any active event, otherwise null
    const event = eventBySlug !== undefined ? (eventBySlug || activeEvent) : undefined;

    // Convex Content Management - Real-time updates for texts
    const remoteHero = useQuery(api.content.getContent, { key: "hero" });
    const remoteCurriculum = useQuery(api.content.getContent, { key: "curriculum" });

    // Fallback logic for content
    const hero = remoteHero?.data || t.hero;
    const curriculum = remoteCurriculum?.data || t.curriculum;

    // Fully dynamic fields from Event Management
    const displayTitle = event?.title || hero.title_prefix;
    const displayDescription = event?.description || hero.subtitle;
    const displayLocation = event?.location || hero.location_val;
    const displayDate = event?.date ? new Date(event.date + 'T12:00:00').toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : hero.date_val;
    const displayTime = event?.time || hero.time_val;

    // Parallax & Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isRegistered) {
        return (
            <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4 bg-noise relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/10 via-stone-900 to-stone-900 opacity-50"></div>
                <div className="max-w-xl w-full bg-stone-800/50 backdrop-blur-xl p-12 rounded-[3rem] shadow-[0_0_50px_rgba(197,160,89,0.1)] border border-gold/20 text-center animate-fade-in relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold-dark text-stone-900 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl shadow-lg shadow-gold/20">
                        <i className="fa-solid fa-check"></i>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 serif italic">{t.register.success_title}</h1>
                    <p className="text-stone-300 mb-10 leading-relaxed font-light text-lg whitespace-pre-line">
                        {t.register.success_msg}
                    </p>
                    <div className="flex flex-col gap-4">
                        <a href={t.register.whatsapp_url} target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-[#25D366] text-white hover:bg-[#128C7E] rounded-full font-bold tracking-[0.2em] text-sm shadow-xl transition-all duration-300 uppercase transform hover:scale-[1.02] flex items-center justify-center gap-3">
                            <i className="fa-brands fa-whatsapp text-xl"></i>
                            {t.register.whatsapp_btn}
                        </a>
                        <button onClick={() => setIsRegistered(false)} className="w-full py-5 bg-white text-stone-900 hover:bg-gold hover:text-white rounded-full font-bold tracking-[0.2em] text-sm shadow-xl transition-all duration-300 uppercase transform hover:scale-[1.02]">
                            {t.register.back_btn}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-champagne font-sans selection:bg-gold selection:text-white">
            <GeminiAssistant />

            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-stone-900/90 backdrop-blur-md py-4 border-b border-white/5' : 'py-8 bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="relative w-32 md:w-48 h-10">
                            <Image src="/wealthsprings-logo-white.png" alt="WealthSprings Accelerator" fill className="object-contain" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <button onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })} className="hidden md:block px-6 py-2 border border-white/20 rounded-full text-white text-xs tracking-[0.2em] hover:bg-gold hover:border-gold transition-all uppercase">
                            {t.nav.cta}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center py-32 px-4 overflow-hidden bg-stone-900">
                <div className="absolute inset-0 z-0 select-none">
                    <Image src="/wealth-bg.jpg" alt="Background Layout" fill sizes="100vw" className="object-cover opacity-60 animate-slow-pan" priority />
                    <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900"></div>
                </div>

                <div className="relative z-10 max-w-7xl w-full mx-auto grid lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-7 text-center lg:text-left space-y-10 animate-fade-in">
                        <div className="inline-flex items-center gap-3 border border-white/10 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-gold font-bold tracking-[0.2em] text-[10px] uppercase">{hero.tag}</span>
                        </div>

                        <h1 className="text-fluid-3xl md:text-fluid-4xl font-medium text-white leading-[1.05] serif tracking-tight">
                            {displayTitle} <br />
                            <span className="italic text-gold relative">
                                {hero.title_highlight}
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-gold opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </span>
                            {hero.title_suffix && <><br /> {hero.title_suffix}</>}
                        </h1>

                        <p className="text-lg md:text-xl text-stone-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                            {displayDescription}
                        </p>

                        <div className="flex flex-col md:flex-row gap-8 items-center justify-center lg:justify-start pt-4 text-white/80">
                            <div className="flex items-center gap-4">
                                <i className="fa-regular fa-calendar text-gold text-2xl"></i>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase tracking-widest opacity-60">{t.hero.date_label}</p>
                                    <p className="font-serif">{displayDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <i className="fa-regular fa-clock text-gold text-2xl"></i>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase tracking-widest opacity-60">{t.hero.time_label}</p>
                                    <p className="font-serif">{displayTime}</p>
                                </div>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-4 pt-2 text-white/80 group hover:text-white transition-colors">
                            <i className="fa-solid fa-location-dot text-gold text-2xl"></i>
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest opacity-60">{t.hero.location_label}</p>
                                <p className="font-serif">{displayLocation}</p>
                            </div>
                        </div>
                        <div className="pt-6"><Countdown /></div>
                    </div>

                    <div id="register" className="lg:col-span-5 bg-stone-900/60 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative group overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-serif italic text-white mb-2">{t.register.title}</h3>
                            <p className="text-stone-400 text-xs mb-8 uppercase tracking-widest">{t.register.subtitle}</p>
                            <RegistrationForm eventId={event?._id} onSuccess={() => setIsRegistered(true)} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Curriculum Section */}
            <section className="py-32 px-4 bg-stone-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-24 max-w-3xl mx-auto">
                        <span className="text-gold text-xs font-bold tracking-[0.4em] uppercase block mb-6">{curriculum.pill}</span>
                        <h2 className="text-fluid-2xl md:text-fluid-3xl font-medium text-stone-900 serif leading-tight mb-6">
                            {curriculum.title_prefix} <span className="italic text-stone-400">{curriculum.title_highlight}</span>
                        </h2>
                        <p className="text-stone-500 text-lg font-light leading-relaxed">
                            {curriculum.subtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {curriculum.items.map((item: any, idx: number) => (
                            <div key={idx} className="group relative bg-white p-10 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mb-8 text-2xl text-stone-300 group-hover:text-gold group-hover:bg-gold/10 transition-colors duration-500">
                                    <i className={`fa-solid ${item.icon}`}></i>
                                </div>
                                <h3 className="text-2xl font-bold text-stone-800 mb-4 serif italic group-hover:text-gold-dark transition-colors">{item.title}</h3>
                                <p className="text-stone-500 font-light leading-relaxed text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Host Section */}
            <section className="py-32 px-4 bg-stone-900 text-white relative border-y border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto rounded-full overflow-hidden border-4 border-gold">
                            <Image src="/marcus-banjo-updated.png" alt="Marcus Banjo" fill className="object-cover" />
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 space-y-10">
                        <span className="text-gold font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">{t.host.role}</span>
                        <h2 className="text-5xl md:text-7xl font-medium serif leading-none">{t.host.name_first} <br /><span className="italic text-stone-500">{t.host.name_last}</span></h2>
                        <blockquote className="border-l-2 border-gold/50 pl-6 py-2">
                            <p className="text-2xl text-stone-200 font-light italic serif leading-relaxed">&quot;{t.host.quote}&quot;</p>
                        </blockquote>
                        <p className="text-stone-400 font-light leading-relaxed text-lg">{t.host.bio}</p>
                    </div>
                </div>
            </section>

            {/* FAQ and Footer */}
            <footer className="bg-stone-950 text-stone-400 py-20 px-4 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <div className="relative w-48 h-12">
                                <Image src="/wealthsprings-logo-white.png" alt="WealthSprings Accelerator" fill className="object-contain object-left" />
                            </div>
                            <p className="text-xs leading-relaxed max-w-xs font-light text-stone-500">{t.footer.desc}</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-[0.3em] font-sans">{t.footer.col_legal}</h4>
                            <ul className="text-xs space-y-4 font-light">
                                <li><a href="#" className="hover:text-gold transition-colors">{t.footer.link_privacy}</a></li>
                                <li><a href="#" className="hover:text-gold transition-colors">{t.footer.link_terms}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium tracking-widest uppercase text-stone-600">
                        <p>{t.footer.rights}</p>
                        <p>{t.footer.tagline}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default function Home() {
    return (
        <EventPage />
    );
}
