"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const GeminiAssistant: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when language loads/changes
  useEffect(() => {
    setMessages([{ role: 'bot', text: t.assistant.welcome }]);
  }, [t]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });

      const data = await res.json();
      const botResponse = data.reply || t.assistant.error_connect;

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: t.assistant.error_generic }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-stone-900 text-gold border border-gold/30 rounded-full shadow-[0_0_30px_rgba(197,160,89,0.3)] flex items-center justify-center hover:scale-105 transition-all hover:bg-gold hover:text-stone-900"
      >
        {isOpen ? <i className="fa-solid fa-xmark text-xl"></i> : <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[320px] md:w-[380px] h-[550px] bg-stone-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-gold/20 flex flex-col overflow-hidden animate-fade-in-up">
          <div className="p-5 bg-gradient-to-r from-stone-900 to-stone-800 border-b border-white/5 flex justify-between items-center">
            <h4 className="font-serif italic text-white flex items-center gap-3 text-lg">
              <i className="fa-solid fa-gem text-gold text-xs"></i>
              {t.assistant.title}
            </h4>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-noise/5">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-xs leading-relaxed ${msg.role === 'user'
                  ? 'bg-gold text-white rounded-2xl rounded-tr-sm shadow-lg'
                  : 'bg-stone-800/80 text-stone-200 border border-white/5 rounded-2xl rounded-tl-sm shadow-sm'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-stone-800/80 border border-white/5 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-stone-900 border-t border-white/10 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.assistant.placeholder}
              className="flex-1 text-xs bg-stone-800/50 border border-white/10 rounded-full px-5 py-3 outline-none focus:border-gold/50 text-white placeholder:text-stone-600 transition-colors"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 bg-gold text-stone-900 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;
