"use client";

import React from 'react';
import { useLanguage } from './LanguageContext';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-1 border border-white/20 rounded-full p-1 bg-stone-900/50 backdrop-blur-sm">
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest transition-all ${language === 'en'
                        ? 'bg-gold text-stone-900 shadow-lg'
                        : 'text-stone-400 hover:text-white'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('pt')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest transition-all ${language === 'pt'
                        ? 'bg-gold text-stone-900 shadow-lg'
                        : 'text-stone-400 hover:text-white'
                    }`}
            >
                PT
            </button>
        </div>
    );
};

export default LanguageSwitcher;
