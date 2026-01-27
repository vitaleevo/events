
import React, { useState } from 'react';
import { LEARN_ITEMS, FAQ_ITEMS, TESTIMONIALS } from './constants';
import Countdown from './components/Countdown';
import RegistrationForm from './components/RegistrationForm';
import GeminiAssistant from './components/GeminiAssistant';

const App: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-champagne flex flex-col items-center justify-center p-4">
        <div className="max-w-xl bg-white p-12 rounded-[3rem] shadow-2xl border border-gold/10 text-center animate-fade-in">
          <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-8 text-2xl">
            <i className="fa-solid fa-check"></i>
          </div>
          <h1 className="text-4xl font-bold text-stone-900 mb-6 serif italic">Access Granted</h1>
          <p className="text-stone-600 mb-10 leading-relaxed">
            Your registration for the 2025 Wealth Masterclass is confirmed. Check your inbox for the private itinerary.
          </p>
          <button 
            onClick={() => setIsRegistered(false)}
            className="w-full py-4 bg-gold-gradient text-white rounded-full font-bold tracking-widest text-sm shadow-lg hover:shadow-gold/20 transition-all uppercase"
          >
            Return to Presentation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <GeminiAssistant />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden bg-champagne">
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-gold/5 to-transparent rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-gold/5 to-transparent rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="inline-block border-b border-gold/50 pb-2">
              <span className="text-gold font-bold tracking-[0.3em] text-[10px] uppercase">By Invitation Only • Live Masterclass</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-stone-900 leading-[1.1] serif">
              Mastering the Art of <span className="italic text-gold">Wealth</span>
            </h1>
            
            <p className="text-lg md:text-xl text-stone-500 font-light leading-relaxed max-w-xl">
              An exclusive training session on financial intelligence, wealth architecture, and the philosophy of abundance.
            </p>

            <div className="flex flex-wrap gap-8 text-stone-700 text-sm font-medium tracking-wide">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1px] bg-gold"></span>
                FEBRUARY 14, 2025
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1px] bg-gold"></span>
                7:00 PM GMT
              </div>
            </div>

            <Countdown />
          </div>

          <div>
            <RegistrationForm onSuccess={() => setIsRegistered(true)} />
          </div>
        </div>
      </section>

      {/* Learning Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-gold text-xs font-bold tracking-[0.4em] uppercase block mb-4">Curriculum</span>
            <h2 className="text-4xl md:text-5xl font-medium text-stone-900 serif italic">The Pillars of Intelligence</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
            {LEARN_ITEMS.map((item, idx) => (
              <div key={idx} className="group text-center">
                <div className="mb-8 inline-block text-gold/30 group-hover:text-gold transition-colors duration-500">
                  <i className={`fa-solid ${item.icon} text-3xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-4 serif italic tracking-wide">{item.title}</h3>
                <p className="text-stone-500 font-light leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="py-32 px-4 bg-champagne border-y border-stone-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="w-full md:w-1/2">
            <div className="relative p-4 border border-gold/20 rounded-[2rem]">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000" 
                alt="Mentor" 
                className="w-full h-[600px] rounded-[1.5rem] object-cover filter contrast-[1.1] grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-2xl shadow-xl border border-stone-100 hidden md:block">
                <p className="text-3xl font-bold text-gold serif italic">15+</p>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Years of Excellence</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-8">
            <span className="text-gold font-bold tracking-[0.4em] text-[10px] uppercase">Meet Your Host</span>
            <h2 className="text-5xl font-medium text-stone-900 serif">Dr. Jonathan Vance</h2>
            <p className="text-xl text-stone-500 font-light italic serif leading-relaxed">
              "True wealth is not a number, but a state of absolute freedom and strategic clarity."
            </p>
            <div className="space-y-6 text-stone-600 font-light leading-relaxed">
              <p>A distinguished financial strategist and author, Dr. Vance has dedicated his career to demystifying the corridors of global wealth for those ready to enter them.</p>
              <p>His methodologies combine modern market analytics with timeless financial wisdom, creating a framework that has transformed the portfolios of over 50,000 students globally.</p>
            </div>
            <div className="pt-8 flex gap-12">
              <div className="text-center">
                <p className="text-2xl font-bold text-stone-900 serif">50k</p>
                <p className="text-[9px] text-stone-400 font-bold tracking-[0.2em] uppercase">Alumni</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-stone-900 serif">120</p>
                <p className="text-[9px] text-stone-400 font-bold tracking-[0.2em] uppercase">Keynotes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-medium text-stone-900 serif italic">Whispers of Success</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-champagne/30 p-10 rounded-3xl border border-stone-50 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <p className="text-stone-600 font-light italic mb-10 text-sm leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-gold/20" />
                  <div>
                    <p className="font-bold text-stone-900 text-xs tracking-wide">{t.name}</p>
                    <p className="text-[10px] text-gold font-medium uppercase tracking-widest mt-1">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-4 bg-champagne">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-medium text-stone-900 mb-16 text-center serif italic">Frequently Discussed</h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="group">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center py-6 text-left border-b border-stone-200 group-hover:border-gold transition-colors"
                >
                  <span className="font-medium text-stone-800 tracking-wide text-sm">{item.question}</span>
                  <i className={`fa-solid fa-plus text-[10px] text-gold transition-transform duration-500 ${activeFaq === idx ? 'rotate-45' : ''}`}></i>
                </button>
                {activeFaq === idx && (
                  <div className="py-6 text-stone-500 font-light text-sm animate-fade-in leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-4 bg-white relative">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <span className="text-gold font-bold tracking-[0.5em] text-[10px] uppercase">The Final Call</span>
          <h2 className="text-5xl md:text-7xl font-medium text-stone-900 serif leading-tight">Your New <span className="italic text-gold">Life</span> Awaits.</h2>
          <p className="text-stone-500 font-light text-lg max-w-xl mx-auto leading-relaxed">
            Excellence is a choice. Secure your place among those who understand the true geometry of wealth.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-12 py-6 bg-gold-gradient text-white rounded-full font-bold text-sm tracking-[0.3em] shadow-[0_20px_40px_rgba(197,160,89,0.3)] hover:scale-105 transition-all uppercase"
          >
            REQUEST YOUR INVITE
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-50 text-stone-400 py-20 px-4 border-t border-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <h3 className="text-stone-900 text-xl font-bold serif italic tracking-wide">Vance Wealth Institute</h3>
              <p className="text-xs leading-relaxed max-w-xs font-light">
                Redefining financial education through exclusive mentorship and advanced strategic frameworks.
              </p>
            </div>
            <div>
              <h4 className="text-stone-900 font-bold mb-6 uppercase text-[9px] tracking-[0.3em]">Legal</h4>
              <ul className="text-xs space-y-4 font-light">
                <li><a href="#" className="hover:text-gold transition-colors">Confidentiality Agreement</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Privacy Charter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-stone-900 font-bold mb-6 uppercase text-[9px] tracking-[0.3em]">Follow</h4>
              <div className="flex gap-6">
                <a href="#" className="hover:text-gold transition-all"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" className="hover:text-gold transition-all"><i className="fa-brands fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium tracking-widest uppercase">
            <p>© 2025 Vance Wealth Institute.</p>
            <p className="text-stone-300">Quiet Luxury In Financial Education</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
