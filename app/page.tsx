"use client";

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/components/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Countdown from '@/components/Countdown';
import RegistrationForm from '@/components/RegistrationForm';
import GeminiAssistant from '@/components/GeminiAssistant';
import Image from 'next/image';

const EventPage = () => {
    const { t } = useLanguage();
    const [isRegistered, setIsRegistered] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [scrolled, setScrolled] = useState(false);

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
                {/* Background Ambient */}
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
                        <a
                            href={t.register.whatsapp_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-5 bg-[#25D366] text-white hover:bg-[#128C7E] rounded-full font-bold tracking-[0.2em] text-sm shadow-xl transition-all duration-300 uppercase transform hover:scale-[1.02] flex items-center justify-center gap-3"
                        >
                            <i className="fa-brands fa-whatsapp text-xl"></i>
                            {t.register.whatsapp_btn}
                        </a>
                        <button
                            onClick={() => setIsRegistered(false)}
                            className="w-full py-5 bg-white text-stone-900 hover:bg-gold hover:text-white rounded-full font-bold tracking-[0.2em] text-sm shadow-xl transition-all duration-300 uppercase transform hover:scale-[1.02]"
                        >
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

            {/* Navigation (Simple Overlay) */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-stone-900/90 backdrop-blur-md py-4 border-b border-white/5' : 'py-8 bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="text-white font-serif italic text-xl md:text-2xl font-bold tracking-wider flex items-center gap-2">
                        <span>{t.nav.brand_first} <span className="text-gold">{t.nav.brand_second}</span></span>
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
                {/* Background Image with Slow Pan */}
                <div className="absolute inset-0 z-0 select-none">
                    <Image
                        src="/wealth-bg.jpg"
                        alt="Background Layout"
                        fill
                        sizes="100vw"
                        className="object-cover opacity-60 animate-slow-pan"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900"></div>
                    <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay"></div>
                </div>



                <div className="relative z-10 max-w-7xl w-full mx-auto grid lg:grid-cols-12 gap-16 items-center">
                    {/* Hero Content */}
                    <div className="lg:col-span-7 text-center lg:text-left space-y-10 animate-fade-in">
                        <div className="inline-flex items-center gap-3 border border-white/10 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-gold font-bold tracking-[0.2em] text-[10px] uppercase">{t.hero.tag}</span>
                        </div>

                        <h1 className="text-fluid-3xl md:text-fluid-4xl font-medium text-white leading-[1.05] serif tracking-tight">
                            {t.hero.title_prefix} <br />
                            <span className="italic text-gold relative">
                                {t.hero.title_highlight}
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-gold opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </span>
                            {t.hero.title_suffix && <br />} {t.hero.title_suffix}
                        </h1>

                        <p className="text-lg md:text-xl text-stone-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                            {t.hero.subtitle}
                        </p>

                        <div className="flex flex-col md:flex-row gap-8 items-center justify-center lg:justify-start pt-4 text-white/80">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-full border border-white/10">
                                    <i className="fa-regular fa-calendar text-gold"></i>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase tracking-widest opacity-60">{t.hero.date_label}</p>
                                    <p className="font-serif">{t.hero.date_val}</p>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-full border border-white/10">
                                    <i className="fa-regular fa-clock text-gold"></i>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase tracking-widest opacity-60">{t.hero.time_label}</p>
                                    <p className="font-serif">{t.hero.time_val}</p>
                                </div>
                            </div>
                        </div>

                        {/* Location - Clickable to Google Maps */}
                        <a
                            href="https://www.google.com/maps/dir//Igreja+Crist%C3%A3+dos+Resgatados+de+Deus,+Igreja+da+Cidade,+Luanda,+35RW%2BWH3,+Luanda/@-8.8535324,13.2841045,12z"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-4 pt-2 text-white/80 group hover:text-white transition-colors"
                        >
                            <div className="p-3 bg-white/5 rounded-full border border-white/10 group-hover:border-gold/50 transition-colors">
                                <i className="fa-solid fa-location-dot text-gold"></i>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest opacity-60">{t.hero.location_label}</p>
                                <p className="font-serif group-hover:underline decoration-gold underline-offset-4">{t.hero.location_val}</p>
                            </div>
                        </a>

                        <div className="pt-6">
                            <Countdown />
                        </div>
                    </div>

                    {/* Registration Card */}
                    <div id="register" className="lg:col-span-5 bg-stone-900/60 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-black/50 animate-fade-in-up [animation-delay:0.3s] relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-serif italic text-white mb-2">{t.register.title}</h3>
                            <p className="text-stone-400 text-xs mb-8 uppercase tracking-widest">{t.register.subtitle}</p>
                            <RegistrationForm onSuccess={() => setIsRegistered(true)} />
                            <p className="text-center text-stone-500 text-[10px] mt-6">
                                <i className="fa-solid fa-lock mr-2"></i>
                                {t.register.security}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                    <i className="fa-solid fa-chevron-down text-white/50 text-xl"></i>
                </div>
            </section>

            {/* Curriculum Section */}
            <section className="py-32 px-4 bg-stone-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-24 max-w-3xl mx-auto">
                        <span className="text-gold text-xs font-bold tracking-[0.4em] uppercase block mb-6">{t.curriculum.pill}</span>
                        <h2 className="text-fluid-2xl md:text-fluid-3xl font-medium text-stone-900 serif leading-tight mb-6">
                            {t.curriculum.title_prefix} <span className="italic text-stone-400">{t.curriculum.title_highlight}</span>
                        </h2>
                        <p className="text-stone-500 text-lg font-light leading-relaxed">
                            {t.curriculum.subtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {t.curriculum.items.map((item, idx) => (
                            <div key={idx} className="group relative bg-white p-10 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-[0_20px_40px_rgba(200,160,89,0.15)] hover:border-gold/30 transition-all duration-500 hover:-translate-y-2">
                                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mb-8 text-2xl text-stone-300 group-hover:text-gold group-hover:bg-gold/10 transition-colors duration-500">
                                    <i className={`fa-solid ${item.icon}`}></i>
                                </div>
                                <h3 className="text-2xl font-bold text-stone-800 mb-4 serif italic group-hover:text-gold-dark transition-colors">{item.title}</h3>
                                <p className="text-stone-500 font-light leading-relaxed text-sm mb-6">{item.description}</p>
                                <div className="w-8 h-[1px] bg-stone-200 group-hover:bg-gold group-hover:w-full transition-all duration-700"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Host Section (Dark Mode) */}
            <section className="py-32 px-4 bg-stone-900 text-white relative border-y border-white/5">
                <div className="bg-noise absolute inset-0 opacity-5"></div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="absolute inset-0 bg-gold/20 rounded-full transform rotate-3 group-hover:rotate-2 transition-transform duration-700 blur-xl"></div>
                        <div className="relative flex justify-center items-center p-12">
                            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] animate-fade-in">
                                <Image
                                    src="/rccg-logo.png"
                                    alt={t.host.name_last}
                                    fill
                                    sizes="(max-width: 768px) 300px, 400px"
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 space-y-10">
                        <div>
                            <span className="text-gold font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">{t.host.role}</span>
                            <h2 className="text-5xl md:text-7xl font-medium serif leading-none">{t.host.name_first} <br /><span className="italic text-stone-500">{t.host.name_last}</span></h2>
                        </div>

                        <blockquote className="border-l-2 border-gold/50 pl-6 py-2">
                            <p className="text-2xl text-stone-200 font-light italic serif leading-relaxed">
                                &quot;{t.host.quote}&quot;
                            </p>
                        </blockquote>

                        <div className="space-y-6 text-stone-400 font-light leading-relaxed text-lg">
                            <p>{t.host.bio}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                            <div>
                                <p className="text-3xl font-bold text-white serif">{t.host.stat_val}</p>
                                <p className="text-[10px] text-stone-500 font-bold tracking-[0.2em] uppercase mt-1">{t.host.stat_label}</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white serif">{t.host.stat_val2}</p>
                                <p className="text-[10px] text-stone-500 font-bold tracking-[0.2em] uppercase mt-1">{t.host.stat_label2}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof (Ticker Style) */}
            <section className="py-32 px-4 bg-champagne overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-medium text-stone-900 serif italic">{t.testimonials.title}</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {t.testimonials.items.map((tr, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-stone-100/50 hover:border-gold/30 hover:scale-[1.02] transition-all duration-300">
                                <div className="flex gap-1 mb-6 text-gold text-[10px]">
                                    {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                                </div>
                                <p className="text-stone-600 font-light italic mb-8 text-sm leading-relaxed">&quot;{tr.content}&quot;</p>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all">
                                        <Image src={tr.image} alt={tr.name} fill sizes="48px" className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-stone-900 text-sm">{tr.name}</p>
                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{tr.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-32 px-4 bg-white">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-medium text-stone-900 mb-16 text-center serif italic">{t.faq.title}</h2>
                    <div className="space-y-4">
                        {t.faq.items.map((item, idx) => (
                            <div key={idx} className="border border-stone-100 rounded-2xl overflow-hidden hover:border-gold/30 transition-colors bg-stone-50/50">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                    className="w-full flex justify-between items-center p-6 text-left"
                                >
                                    <span className="font-medium text-stone-800 tracking-wide text-sm">{item.question}</span>
                                    <div className={`w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center transition-all duration-300 ${activeFaq === idx ? 'bg-gold border-gold text-white rotate-180' : 'text-stone-400'}`}>
                                        <i className="fa-solid fa-chevron-down text-xs"></i>
                                    </div>
                                </button>
                                <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${activeFaq === idx ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                    <div className="overflow-hidden">
                                        <div className="p-6 pt-0 text-stone-500 font-light text-sm leading-relaxed border-t border-stone-100/50">
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 px-4 bg-stone-900 relative overflow-hidden text-center">
                <div className="absolute inset-0 select-none opacity-30">
                    <Image
                        src="/wealth-bg.jpg"
                        alt="Background"
                        fill
                        sizes="100vw"
                        className="object-cover blur-sm"
                    />
                </div>
                <div className="absolute inset-0 bg-stone-900/80"></div>
                <div className="bg-noise absolute inset-0 opacity-10"></div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-12">
                    <span className="text-gold font-bold tracking-[0.5em] text-[10px] uppercase">{t.final_cta.tag}</span>
                    <h2 className="text-fluid-3xl md:text-fluid-4xl font-medium text-white serif leading-tight">
                        {t.final_cta.title_prefix} <br /><span className="italic text-gold">{t.final_cta.title_highlight}</span>
                    </h2>
                    <p className="text-stone-400 font-light text-xl max-w-xl mx-auto leading-relaxed">
                        {t.final_cta.subtitle}
                    </p>
                    <button
                        onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-16 py-6 bg-white text-stone-900 rounded-full font-bold text-sm tracking-[0.3em] shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-gold hover:text-white hover:shadow-[0_20px_40px_rgba(197,160,89,0.4)] hover:scale-105 transition-all uppercase"
                    >
                        {t.final_cta.btn}
                    </button>

                    <div className="pt-12 flex justify-center items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Faux Logos */}
                        <div className="text-white text-xl font-serif italic font-bold">Forbes</div>
                        <div className="text-white text-xl font-serif font-bold">WIRED</div>
                        <div className="text-white text-xl font-serif italic">The Wall Street Journal</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-stone-950 text-stone-400 py-20 px-4 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <h3 className="text-white text-2xl font-bold serif italic tracking-wide">{t.nav.brand_first} <span className="text-gold">{t.nav.brand_second}</span></h3>
                            <p className="text-xs leading-relaxed max-w-xs font-light text-stone-500">
                                {t.footer.desc}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-[0.3em]">{t.footer.col_legal}</h4>
                            <ul className="text-xs space-y-4 font-light hover:text-white">
                                <li><a href="#" className="hover:text-gold transition-colors">{t.footer.link_confidentiality}</a></li>
                                <li><a href="#" className="hover:text-gold transition-colors">{t.footer.link_privacy}</a></li>
                                <li><a href="#" className="hover:text-gold transition-colors">{t.footer.link_terms}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-[0.3em]">{t.footer.col_connect}</h4>
                            <div className="flex gap-6">
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-white transition-all"><i className="fa-brands fa-instagram"></i></a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-white transition-all"><i className="fa-brands fa-linkedin-in"></i></a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-white transition-all"><i className="fa-brands fa-twitter"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium tracking-widest uppercase text-stone-600">
                        <p>{t.footer.rights}</p>
                        <p className="">{t.footer.tagline}</p>
                    </div>
                </div>
            </footer>

            {/* Sticky Mobile CTA - Thumb Zone focus */}
            {!isRegistered && (
                <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full px-6 transition-all duration-300 animate-fade-in-up">
                    <button
                        onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full py-5 bg-gold text-stone-900 rounded-full font-bold text-xs tracking-[0.3em] shadow-[0_15px_30px_rgba(197,160,89,0.4)] border border-white/20 active:scale-95 transition-all uppercase"
                    >
                        {t.nav.cta}
                    </button>
                </div>
            )}
        </div>
    );
};


export default function Home() {
    return (
        <LanguageProvider>
            <EventPage />
        </LanguageProvider>
    );
}
