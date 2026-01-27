
import React, { useState, useEffect } from 'react';
import { EVENT_DATE } from '../constants';

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = EVENT_DATE.getTime() - now;
      if (distance < 0) { clearInterval(timer); return; }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center mx-3 md:mx-6">
      <div className="text-3xl md:text-5xl font-light text-stone-800 serif italic">
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] mt-1 text-gold font-medium">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center lg:justify-start mt-10 animate-fade-in border-l border-gold/30 pl-6">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

export default Countdown;
