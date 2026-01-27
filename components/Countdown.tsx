"use client";
import React, { useState, useEffect } from 'react';
import { EVENT_DATE } from '@/lib/constants';
import { useLanguage } from './LanguageContext';

const Countdown: React.FC = () => {
  /* Updated to calculate immediately */
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const distance = EVENT_DATE.getTime() - now;
    if (distance < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
  };

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    /* Update immediately on mount */
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* Updated to use context */
  const { t } = useLanguage();
  const TimeUnit = ({ value, labelKey }: { value: number, labelKey: keyof typeof t.countdown }) => (
    <div className="flex flex-col items-center mx-4 md:mx-6 group cursor-default">
      <div className="text-fluid-xl md:text-fluid-2xl font-light text-white serif italic group-hover:text-gold transition-colors duration-500">
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-[10px] md:text-[8px] uppercase tracking-[0.3em] mt-2 text-stone-400 font-medium group-hover:text-white transition-colors">
        {t.countdown[labelKey]}
      </span>
    </div>
  );


  return (
    <div className="flex justify-center lg:justify-start pt-8 border-t border-white/10 lg:border-none lg:pt-0">
      <TimeUnit value={timeLeft.days} labelKey="days" />
      <div className="h-12 w-px bg-white/10 mx-2 my-auto hidden md:block"></div>
      <TimeUnit value={timeLeft.hours} labelKey="hours" />
      <div className="h-12 w-px bg-white/10 mx-2 my-auto hidden md:block"></div>
      <TimeUnit value={timeLeft.minutes} labelKey="minutes" />
      <div className="h-12 w-px bg-white/10 mx-2 my-auto hidden md:block"></div>
      <TimeUnit value={timeLeft.seconds} labelKey="seconds" />
    </div>
  );
};

export default Countdown;
