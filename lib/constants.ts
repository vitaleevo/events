
import { LearnItem, FAQItem, Testimonial } from './types';

export const EVENT_DATE = new Date('2026-02-14T10:00:00');

export const LEARN_ITEMS: LearnItem[] = [
  {
    title: "Winning Financial Mindset",
    description: "Reprogram your mind to attract abundance and eliminate scarcity patterns.",
    icon: "fa-brain"
  },
  {
    title: "5 Pillars of Intelligence",
    description: "Master the core fundamentals that every successful investor must know.",
    icon: "fa-columns"
  },
  {
    title: "Wealth Creation Strategies",
    description: "Practical methods to multiply your net worth and compound your wealth.",
    icon: "fa-chart-line"
  },
  {
    title: "Smart Money Management",
    description: "Organize your finances and plug the leaks in your monthly budget.",
    icon: "fa-wallet"
  },
  {
    title: "Investing for Beginners",
    description: "Where to start, how to evaluate risks, and common mistakes to avoid.",
    icon: "fa-seedling"
  },
  {
    title: "Passive Income Streams",
    description: "Create automated income sources that work for you while you sleep.",
    icon: "fa-money-bill-trend-up"
  },
  {
    title: "Personal Action Plan",
    description: "A customized framework to implement your learning immediately.",
    icon: "fa-list-check"
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Is this masterclass really free?",
    answer: "Yes, 100%. We believe financial education should be accessible. There is no cost to attend the live training on February 14th."
  },
  {
    question: "Do I need previous financial knowledge?",
    answer: "Not at all. We designed this to take you from the basics to advanced strategies in a clear, step-by-step manner."
  },
  {
    question: "Will I receive a certificate?",
    answer: "Yes, all live participants will receive a digital Certificate of Completion to showcase their commitment to financial growth."
  },
  {
    question: "How long is the training?",
    answer: "The session lasts approximately 120 minutes, including a dedicated Q&A section at the end."
  },
  {
    question: "How do I access the event?",
    answer: "After registration, you'll receive a unique access link via email and WhatsApp. We recommend joining from a computer for the best experience."
  },
  {
    question: "What if I can't attend live?",
    answer: "While live attendance is recommended for the bonuses and Q&A, a limited 48-hour replay will be sent to registered users."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Jenkins",
    role: "Small Business Owner",
    content: "This training completely shifted how I view my business profits. I went from living month-to-month to building a solid investment portfolio in just 6 months.",
    image: "https://picsum.photos/id/64/200/200"
  },
  {
    name: "Mark Thompson",
    role: "Software Engineer",
    content: "The passive income strategies shared in this masterclass are pure gold. I've already started my first real estate investment trust thanks to these lessons.",
    image: "https://picsum.photos/id/91/200/200"
  },
  {
    name: "Elena Rodriguez",
    role: "Freelancer",
    content: "Finally, someone who explains finance without the confusing jargon. I feel empowered and for the first time, in total control of my future.",
    image: "https://picsum.photos/id/65/200/200"
  }
];
