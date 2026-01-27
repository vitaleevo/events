
export interface FormData {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
}

export interface LearnItem {
  title: string;
  description: string;
  icon: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
}

// Added Subscription interface to store and manage masterclass registration leads
export interface Subscription {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  timestamp: number;
}
