import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, Link, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Mail,
  Loader2,
  Menu,
  X,
  Calendar,
  Briefcase,
  Users,
  Quote,
  Download,
  ExternalLink,
  PlayCircle,
  FileText,
  ClipboardList,
  CalendarDays,
  LogOut
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

/**
 * PRODUCTION NOTE:
 * When deploying to Vercel/Netlify, set these in your environment variables.
 * We access them safely here to avoid build warnings in certain environments.
 */
const getEnvVar = (key: string) => {
  try {
    // @ts-ignore - Accessing Vite env safely
    return import.meta.env[key] || "";
  } catch (e) {
    return "";
  }
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID')
};

// Fallback for preview environment (crucial for the current editor)
const getInitialConfig = () => {
  // @ts-ignore
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    // @ts-ignore
    return JSON.parse(__firebase_config);
  }
  return firebaseConfig;
};

const hasFirebaseKeys = (config: Record<string, string>) =>
  Boolean(config.apiKey && config.authDomain && config.projectId);

const initialConfig = getInitialConfig();
const firebaseEnabled = hasFirebaseKeys(initialConfig);
const app = firebaseEnabled ? initializeApp(initialConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
// @ts-ignore
const appId = typeof __app_id !== 'undefined' ? __app_id : 'stepsmart-prod';

// --- Form Validation Schema ---
const enrollmentSchema = z.object({
  fullName: z.string().min(2, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Invalid phone number." }),
  intent: z.enum(["brochure", "enroll"]),
});

const logoSrc = "/stepsmart-logo.png";
const sanketPhotoSrc = "/mentor-sanket.jpg";
const ankitPhotoSrc = "/mentor-ankit.jpg";
const brochurePdfSrc = "/PM-X-Accelerator-Brochure.pdf";
const demoLeadsKey = "pmx_demo_leads";
const demoUsersKey = "pmx_demo_users";
const demoSessionKey = "pmx_demo_auth_session";

type DemoUser = {
  fullName: string;
  email: string;
  password: string;
};

type DashboardTab = 'lectures' | 'resources' | 'assignments' | 'calendar';

const Logo = ({ className = "h-10" }) => (
  <img
    src={logoSrc}
    alt="StepSmart logo"
    className={`${className} w-auto object-contain`}
  />
);

const startBrochureDownload = () => {
  const link = document.createElement('a');
  link.href = brochurePdfSrc;
  link.download = 'PM-X-Accelerator-Brochure.pdf';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const saveLeadToDemoDB = (lead: any) => {
  try {
    const existing = JSON.parse(localStorage.getItem(demoLeadsKey) || "[]");
    const next = [
      ...existing,
      {
        ...lead,
        source: "website-form",
        submittedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(demoLeadsKey, JSON.stringify(next));
    (globalThis as any).__PMX_DEMO_LEADS__ = next;
  } catch (e) {
    console.error("Demo DB write failed", e);
  }
};

const getDemoUsers = (): DemoUser[] => {
  try {
    return JSON.parse(localStorage.getItem(demoUsersKey) || "[]");
  } catch (e) {
    return [];
  }
};

const saveDemoUsers = (users: DemoUser[]) => {
  localStorage.setItem(demoUsersKey, JSON.stringify(users));
};

const getDemoSession = () => localStorage.getItem(demoSessionKey);

const setDemoSession = (email: string | null) => {
  if (email) {
    localStorage.setItem(demoSessionKey, email);
    return;
  }
  localStorage.removeItem(demoSessionKey);
};

const Button = ({ children, className, variant = "primary", isLoading, ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md px-6 py-2.5 font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 active:scale-95";
  const variants: any = {
    primary: "bg-[#188ab2] text-white hover:bg-[#157a9d] shadow-sm",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline: "border border-slate-200 text-slate-600 hover:border-[#188ab2] hover:text-[#188ab2] bg-white shadow-sm"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState('idle');
  const [formIntent, setFormIntent] = useState('enroll');
  const navigate = useNavigate();

  useEffect(() => {
    // Tracking analytics of page visits
    const trackVisit = async () => {
      try {
        if (db) {
          const analyticsRef = collection(db, 'artifacts', appId, 'public', 'data', 'analytics');
          await addDoc(analyticsRef, {
            page: 'landing_page',
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent
          });
        }
      } catch (e) {
        console.error("Analytics failed", e);
      }
    };
    trackVisit();
  }, [db]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: { intent: 'enroll' }
  });

  const completeLeadSubmission = (intent: string) => {
    setEnrollmentStatus('success');
    if (intent === 'brochure') {
      setTimeout(() => {
        startBrochureDownload();
      }, 1000);
      return;
    }
  };

  const onSubmit = async (data: any) => {
    setEnrollmentStatus('loading');
    saveLeadToDemoDB(data);

    try {
      const res = await fetch(
        'https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.fullName,
            email: data.email,
            phone: data.phone,
            masterclassId: 'pm-x-accelerator',
          }),
        }
      );

      if (!res.ok) throw new Error('Enrollment failed');
      completeLeadSubmission(data.intent);
    } catch (err) {
      setEnrollmentStatus('error');
    }
  };

  const handleActionClick = (intent: string) => {
    setFormIntent(intent);
    setValue('intent', intent as any);
    const element = document.getElementById('form-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#188ab2]/10">
      <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo className="h-14" />
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
            <a href="#who-is-it-for" className="hover:text-[#188ab2] transition-colors">Who is it for?</a>
            <a href="https://calendly.com/sanket-stepsmart" target="_blank" rel="noreferrer" className="hover:text-[#188ab2] transition-colors">Book 1:1</a>
            <a href="#mentors" className="hover:text-[#188ab2] transition-colors">Mentors</a>
            <Link to="/blog" className="hover:text-[#188ab2] transition-colors">Blog</Link>
            <a href="/learn" className="px-5 py-2 rounded-full border border-[#188ab2] text-[#188ab2] hover:bg-[#188ab2] hover:text-white transition-colors">Login</a>
            <Button variant="primary" onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}>
              Apply Now
            </Button>
          </div>
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6 text-[#188ab2]" /> : <Menu className="h-6 w-6 text-[#188ab2]" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 w-full bg-white border-b border-slate-100 z-40 p-6 flex flex-col gap-4 shadow-xl animate-fade-in">
          <a href="#who-is-it-for" onClick={() => setIsMenuOpen(false)} className="font-bold">Who is it for?</a>
          <a href="https://calendly.com/sanket-stepsmart" target="_blank" rel="noreferrer" className="font-bold">Book 1:1</a>
          <a href="#mentors" onClick={() => setIsMenuOpen(false)} className="font-bold">Mentors</a>
          <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="font-bold">Blog</Link>
          <a href="/learn" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-6 py-2.5 rounded-md border border-[#188ab2] text-[#188ab2] hover:bg-[#188ab2] hover:text-white transition-colors font-semibold">Login</a>
          <Button variant="primary" onClick={() => { setIsMenuOpen(false); handleActionClick('enroll'); }}>Apply Now</Button>
        </div>
      )}

      {/* Hero Section - High Conversion Headline */}
      <section className="pt-40 pb-20 bg-white">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-slate-900">
            Break into <span className="text-[#188ab2]">Product Management</span> without an MBA or IIT tag
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed">
            For engineers and professionals who are ready to make the switch. Lead with identity and outcome, not just a certificate.
          </p>
          <div className="flex flex-col items-center gap-4 mb-16">
            <Button 
              variant="primary" 
              className="px-12 py-5 text-xl font-bold rounded-full shadow-2xl"
              onClick={() => handleActionClick('enroll')}
            >
              Apply for PM-X Accelerator
            </Button>
            <button 
              onClick={() => handleActionClick('brochure')}
              className="text-slate-400 text-sm font-medium hover:text-[#188ab2] underline underline-offset-4 transition-colors"
            >
              Not sure yet? Download the curriculum first.
            </button>
          </div>

          <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl group">
            <img 
              src="/hero_image.png" 
              alt="PM-X Accelerator Outcomes" 
              className="w-full h-auto object-cover opacity-90"
            />
          </div>
        </div>
      </section>

      <section id="who-is-it-for" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Who is this for?</h2>
            <p className="text-lg text-slate-600">The PM-X Accelerator is designed for builders ready to take the next step in their career.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Software Engineers", desc: "Technical minds wanting to move from 'how to build' to 'what to build'.", icon: <Users className="h-8 w-8" /> },
              { label: "Aspiring PMs", desc: "Non-PM professionals looking for a structured, real-world entry path.", icon: <CheckCircle2 className="h-8 w-8" /> },
              { label: "Business Analysts", desc: "Analysts wanting to own the product lifecycle and drive strategy.", icon: <Briefcase className="h-8 w-8" /> },
              { label: "Recent Graduates", desc: "Hungry talent wanting to bypass the 'lack of experience' trap.", icon: <Calendar className="h-8 w-8" /> }
            ].map((box, i) => (
              <div key={i} className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <div className="text-[#188ab2] mb-6">{box.icon}</div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">{box.label}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{box.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="batch-details" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8">
              <span className="bg-[#188ab2] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">Next Batch: 1st June</span>
            </div>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">The PM-X Accelerator</h2>
                <ul className="space-y-4 mb-10">
                  {[
                    "Live Mentorship with Industry Experts",
                    "Real-world Portfolio Projects",
                    "Mock Interviews & Referrals",
                    "AI-Powered Learning Roadmap"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-[#188ab2]" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest mb-2 text-sm">Join the Next Cohort</p>
                <div className="text-4xl font-bold mb-4">Batch starts 1st June</div>
                <p className="text-slate-400 text-sm mb-8 italic">Limited seats per cohort to maintain 1:1 focus. Apply today to reserve your spot.</p>
                <Button variant="primary" className="w-full py-4 text-lg" onClick={() => handleActionClick('enroll')}>Secure Your Seat</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mentors" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-16 text-slate-900">Learn from Professionals</h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm flex flex-col items-center transition-all hover:scale-[1.02] hover:shadow-xl">
              <div className="w-32 h-32 rounded-full mb-8 border-4 border-white shadow-xl overflow-hidden">
                <img
                  src={sanketPhotoSrc}
                  alt="Sanket"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-slate-900">Sanket</h3>
              <p className="text-[#188ab2] text-sm font-bold uppercase tracking-widest mb-6">Senior Product Manager - Mastercard</p>
              <p className="text-slate-500 leading-relaxed text-left border-t pt-6 w-full">
                Successfully mentored 100+ professionals into high-growth PM roles. Expert in behavioral interviews and product sense frameworks, with deep specialization in scaling fintech products for the global market.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm flex flex-col items-center transition-all hover:scale-[1.02] hover:shadow-xl">
              <div className="w-32 h-32 rounded-full mb-8 border-4 border-white shadow-xl overflow-hidden">
                <img
                  src={ankitPhotoSrc}
                  alt="Ankit"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-slate-900">Ankit</h3>
              <p className="text-[#188ab2] text-sm font-bold uppercase tracking-widest mb-6">Product Manager 2 - Microsoft</p>
              <p className="text-slate-500 leading-relaxed text-left border-t pt-6 w-full">
                Leads enterprise-grade AI product development at Microsoft. Expert at turning ambiguity into clarity for complex product strategy, with a focus on scaling AI-native products from 0 to 1.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-16 text-slate-900">Proof of Progress</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { name: "Nishtha", role: "Product Management Mentee", text: "Ankit helped me break down a vague case studies into actionable chunks helping me land the PM job" },
              { name: "Gauri", role: "PM-X Accelerator Student", text: "The PM-X course helped me to land the PM job. A must take course for aspiring PM's. It is well structured and curated" },
              { name: "Riya", role: "Product Strategy Mentee", text: "Sanket has helped me in structure my thoughts , such that now I am prepared for any interveiw confidently" }
            ].map((t, i) => (
              <div key={i} className="bg-slate-50 p-10 rounded-3xl border border-slate-100 relative group transition-all hover:bg-[#188ab2]/5">
                <Quote className="text-[#188ab2]/10 h-16 w-16 absolute top-4 right-4" />
                <div className="mb-8">
                  <div className="text-xs font-bold text-[#188ab2] uppercase tracking-widest mb-1">{t.role}</div>
                  <p className="text-slate-600 italic leading-relaxed text-lg">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#188ab2]/20 flex items-center justify-center font-bold text-[#188ab2]">
                    {t.name[0]}
                  </div>
                  <div className="font-bold text-slate-900">{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="enroll" className="py-24 bg-slate-900 text-white relative">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Ready to Start Your Journey?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <button
              onClick={() => handleActionClick('brochure')}
              className={`flex flex-col items-center p-10 bg-slate-800 border-2 rounded-3xl transition-all group ${formIntent === 'brochure' ? 'border-[#188ab2]' : 'border-slate-700 hover:border-[#188ab2]/50'}`}
            >
              <Download className={`h-10 w-10 mb-4 group-hover:scale-110 transition-transform ${formIntent === 'brochure' ? 'text-[#188ab2]' : 'text-slate-400'}`} />
              <h3 className="text-xl font-bold mb-2 text-balance">Download Accelerator Brochure</h3>
              <p className="text-slate-400 text-sm">Get the curriculum and roadmap details.</p>
            </button>
            <button
              onClick={() => handleActionClick('enroll')}
              className={`flex flex-col items-center p-10 bg-slate-800 border-2 rounded-3xl transition-all group ${formIntent === 'enroll' ? 'border-[#188ab2]' : 'border-slate-700 hover:border-[#188ab2]/50'}`}
            >
              <Briefcase className={`h-10 w-10 mb-4 group-hover:scale-110 transition-transform ${formIntent === 'enroll' ? 'text-[#188ab2]' : 'text-slate-400'}`} />
              <h3 className="text-xl font-bold mb-2 text-balance">Enroll for PM-X Accelerator</h3>
              <p className="text-slate-400 text-sm">Register for the next batch or masterclass.</p>
            </button>
          </div>

          <div id="form-container" className="max-w-xl mx-auto bg-white rounded-3xl p-8 md:p-12 text-slate-900 shadow-2xl scroll-mt-24">
            {enrollmentStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4">{formIntent === 'brochure' ? "Brochure Ready!" : "Enrollment Submitted!"}</h3>
                <p className="text-slate-600 mb-8">
                  {formIntent === 'brochure'
                    ? "Download started."
                    : "Enrollment saved. You will receive a welcome email shortly."}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setEnrollmentStatus('idle')}
                >
                  Back
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
                <input type="hidden" {...register("intent")} />
                <div className="space-y-4">
                  <div>
                    <input {...register("fullName")} placeholder="Full Name" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#188ab2]" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <input {...register("email")} type="email" placeholder="Email Address" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#188ab2]" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <input {...register("phone")} placeholder="WhatsApp Number" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#188ab2]" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
                <Button type="submit" className="w-full py-5 text-xl font-bold" isLoading={enrollmentStatus === 'loading'}>
                  {formIntent === 'brochure' ? 'Get Brochure Now' : 'Join Accelerator Batch'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 mb-16 text-left">
            <div className="col-span-1">
              <Logo className="h-14 mb-8" />
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Helping engineers and non-PMs break into Product Management without an MBA or IIT tag. Expert mentorship and real-world outcomes.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><a href="#who-is-it-for" className="hover:text-[#188ab2]">Who is it for?</a></li>
                <li><a href="#batch-details" className="hover:text-[#188ab2]">Batch Details</a></li>
                <li><a href="#mentors" className="hover:text-[#188ab2]">Mentors</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Join Our Community</h4>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Stay updated with free resources, case study deep-dives, and networking opportunities.
              </p>
              <a 
                href="https://chat.whatsapp.com/BCeLjXhQHrxFxOlxkb7DPc" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#188ab2] font-bold hover:underline"
              >
                Join the WhatsApp Community <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-200 flex flex-col md:row items-center justify-between gap-6">
            <div className="flex gap-6 text-slate-400">
              <a href="mailto:administrator@stepsmart.net" className="hover:text-[#188ab2] transition-colors"><Mail /></a>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">© 2026 StepSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (getDemoSession()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmitAuth = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    const users = getDemoUsers();

    if (mode === 'signup') {
      if (fullName.trim().length < 2) {
        setError('Please enter your full name.');
        return;
      }

      if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
        setError('Account already exists. Please login.');
        return;
      }

      const nextUsers = [
        ...users,
        {
          fullName: fullName.trim(),
          email: normalizedEmail,
          password: password.trim()
        }
      ];
      saveDemoUsers(nextUsers);
      setDemoSession(normalizedEmail);
      navigate('/dashboard');
      return;
    }

    const matchedUser = users.find(
      (user) => user.email.toLowerCase() === normalizedEmail && user.password === password.trim()
    );

    if (!matchedUser) {
      setError('Invalid email or password.');
      return;
    }

    setDemoSession(matchedUser.email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <Logo className="h-16 mb-8 mx-auto" />
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
          {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </h1>
        <p className="text-slate-500 text-sm text-center mb-8">
          {mode === 'signup' ? 'Sign up to access the PM-X learner dashboard.' : 'Login to continue learning.'}
        </p>

        <form className="space-y-4" onSubmit={handleSubmitAuth}>
          {mode === 'signup' && (
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#188ab2]"
            />
          )}
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#188ab2]"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#188ab2]"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full py-3">
            {mode === 'signup' ? 'Sign Up' : 'Login'}
          </Button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-500">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="text-[#188ab2] font-semibold"
            onClick={() => {
              setError('');
              setMode(mode === 'signup' ? 'login' : 'signup');
            }}
          >
            {mode === 'signup' ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('lectures');
  const sessionEmail = getDemoSession();
  const currentUser = getDemoUsers().find((user) => user.email === sessionEmail);

  useEffect(() => {
    if (!sessionEmail) {
      navigate('/auth', { replace: true });
    }
  }, [sessionEmail, navigate]);

  if (!sessionEmail) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <Logo className="h-14" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden md:inline">
              {currentUser?.fullName ? `Hi, ${currentUser.fullName}` : sessionEmail}
            </span>
            <Button
              variant="outline"
              className="!px-4 !py-2"
              onClick={() => {
                setDemoSession(null);
                navigate('/auth');
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">PM-X Learning Dashboard</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <button
            className={`rounded-xl border px-4 py-3 text-left transition ${activeTab === 'lectures' ? 'border-[#188ab2] bg-[#188ab2]/5 text-[#188ab2]' : 'border-slate-200 bg-white text-slate-600'}`}
            onClick={() => setActiveTab('lectures')}
          >
            <PlayCircle className="h-5 w-5 mb-2" />
            <p className="font-semibold">Video Lectures</p>
          </button>
          <button
            className={`rounded-xl border px-4 py-3 text-left transition ${activeTab === 'resources' ? 'border-[#188ab2] bg-[#188ab2]/5 text-[#188ab2]' : 'border-slate-200 bg-white text-slate-600'}`}
            onClick={() => setActiveTab('resources')}
          >
            <FileText className="h-5 w-5 mb-2" />
            <p className="font-semibold">Resources</p>
          </button>
          <button
            className={`rounded-xl border px-4 py-3 text-left transition ${activeTab === 'assignments' ? 'border-[#188ab2] bg-[#188ab2]/5 text-[#188ab2]' : 'border-slate-200 bg-white text-slate-600'}`}
            onClick={() => setActiveTab('assignments')}
          >
            <ClipboardList className="h-5 w-5 mb-2" />
            <p className="font-semibold">Assignments</p>
          </button>
          <button
            className={`rounded-xl border px-4 py-3 text-left transition ${activeTab === 'calendar' ? 'border-[#188ab2] bg-[#188ab2]/5 text-[#188ab2]' : 'border-slate-200 bg-white text-slate-600'}`}
            onClick={() => setActiveTab('calendar')}
          >
            <CalendarDays className="h-5 w-5 mb-2" />
            <p className="font-semibold">Calendar</p>
          </button>
        </div>

        {activeTab === 'lectures' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['PM Fundamentals', 'Case Study Walkthrough', 'Product Strategy in Practice'].map((item) => (
              <div key={item} className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="font-semibold text-slate-900 mb-2">{item}</p>
                <p className="text-sm text-slate-500">Recorded session available</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="grid md:grid-cols-2 gap-4">
            {['PRD Template', 'Go-to-Market Checklist', 'PM Interview Framework'].map((item) => (
              <div key={item} className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="font-semibold text-slate-900 mb-2">{item}</p>
                <p className="text-sm text-slate-500">Downloadable study material</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-3">
            {['Week 1: Problem Discovery Exercise', 'Week 2: User Story Writing', 'Week 3: Metrics Definition'].map((item) => (
              <div key={item} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
                <p className="font-semibold text-slate-900">{item}</p>
                <span className="text-xs font-bold uppercase tracking-wide text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Pending</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-3">
            {[
              { title: 'Live Mentorship Session', date: 'Saturday, 6:00 PM' },
              { title: 'Mock Interview Practice', date: 'Tuesday, 8:00 PM' },
              { title: 'Doubt Clearing AMA', date: 'Thursday, 7:30 PM' }
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500 mt-1">{item.date}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const DEMO_BLOGS = [
  {
    id: "a-new-generation-studies-ai",
    title: "A New Generation Studies AI, Apple's Recipe for On-Device Models, GLM5.2 Tackles Open-Ended Problems",
    description: "The Batch News & Insights: \"Loop engineering\" is a hot buzzphrase after Boris Cherney (Claude Code's creator) and Peter...",
    content: "## Inside Claude Code and Boris Cherney's Design Philosophy\n\n\"Loop engineering\" is a hot buzzphrase after Boris Cherney (Claude Code's creator) and Peter discussed it recently. Loop engineering focuses on iterating on feedback cycles rapidly.\n\n### Apple's Recipe for On-Device Models\nApple's latest research reveals a highly optimized pipeline for running LLMs on-device, leveraging unified memory and model quantization.\n\n### GLM5.2 Tackles Open-Ended Problems\nThe GLM team released version 5.2, setting a new benchmark for open-ended reasoning and code execution capabilities.",
    imageUrl: "/blog-loops.png",
    date: "Jun 26, 2026",
    createdAt: "2026-06-26T12:00:00.000Z"
  },
  {
    id: "testing-mythos-and-fable",
    title: "Testing Mythos and Fable, Moving Beyond SWE-bench, Nvidia's Open Contender",
    description: "The Batch AI News and Insights: Over the last two weeks, both the U.S. Government and Anthropic took significant actions that...",
    content: "## Testing Mythos and Fable: The Path to Evaluation\n\nOver the last two weeks, both the U.S. Government and Anthropic took significant actions that highlight how evaluations are moving from research benchmarks to critical safety gates.\n\n### Moving Beyond SWE-bench\nStandard coding benchmarks are no longer sufficient. New evaluation frameworks are testing agents on multi-file changes and long-context logic.",
    imageUrl: "/blog-collab.png",
    date: "Jun 19, 2026",
    createdAt: "2026-06-19T12:00:00.000Z"
  },
  {
    id: "mythos-begets-fable",
    title: "Mythos Begets Fable, Cursor's Composer 2.5, Agents Building Agents",
    description: "The Batch AI News and Insights: If you haven't already, I encourage you to experiment with using AI agents not just to chat but to actuall...",
    content: "## Cursor's Composer 2.5: The Future of IDEs\n\nIf you haven't already, I encourage you to experiment with using AI agents not just to chat but to actually build applications.\n\n### Agents Building Agents\nWith the release of Cursor Composer 2.5, multi-file edits are becoming standard. We are entering an era of software creation where the prompt is the blueprint.",
    imageUrl: "/blog-editor.png",
    date: "Jun 12, 2026",
    createdAt: "2026-06-12T12:00:00.000Z"
  }
];

function BlogPage() {
  const { blogId } = useParams();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(
          'https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/track',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: 'get_blogs' }),
          }
        );
        if (!res.ok) throw new Error('Failed to fetch blog posts');
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load blog posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const displayBlogs = [
    ...blogs,
    ...DEMO_BLOGS.filter(demo => !blogs.some(b => b.id === demo.id))
  ];

  const parseMarkdown = (text: string) => {
    if (!text) return '<p class="text-slate-400 italic">No content written yet for this post.</p>';
    
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3 text-slate-800">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 border-b border-slate-100 pb-2 text-slate-900">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-extrabold mt-10 mb-6 text-slate-900 leading-tight">$1</h1>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<figure class="my-8"><img src="$2" alt="$1" class="max-w-full h-auto rounded-2xl mx-auto shadow-md" /><figcaption class="text-center text-xs text-slate-400 mt-2">$1</figcaption></figure>');

    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-[#188ab2] hover:underline font-semibold">$1</a>');

    html = html.replace(/\n\n/g, '</p><p class="mb-5 text-slate-600 leading-relaxed text-base md:text-lg">');
    html = '<p class="mb-5 text-slate-600 leading-relaxed text-base md:text-lg">' + html + '</p>';

    html = html.replace(/<p class=".*?"><\/p>/g, '');

    return html;
  };

  const currentPost = blogId ? displayBlogs.find(b => b.id === blogId) : null;

  // Single Post Detailed Reader View
  if (blogId) {
    if (loading) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-20">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-[#188ab2] rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 text-sm">Loading post...</p>
        </div>
      );
    }
    
    if (!currentPost) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
          <Link to="/blog" className="text-[#188ab2] font-semibold underline">Back to all posts</Link>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#188ab2]/10">
        {/* Immovable Sticky Header */}
        <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <Logo className="h-14" />
            </Link>
            <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
              <a href="/#who-is-it-for" className="hover:text-[#188ab2] transition-colors">Who is it for?</a>
              <a href="https://calendly.com/sanket-stepsmart" target="_blank" rel="noreferrer" className="hover:text-[#188ab2] transition-colors">Book 1:1</a>
              <a href="/#mentors" className="hover:text-[#188ab2] transition-colors">Mentors</a>
              <Link to="/blog" className="text-[#188ab2] transition-colors">Blog</Link>
              <a href="/learn" className="px-5 py-2 rounded-full border border-[#188ab2] text-[#188ab2] hover:bg-[#188ab2] hover:text-white transition-colors">Login</a>
              <a href="/#enroll" className="inline-flex items-center justify-center rounded-md px-6 py-2.5 font-semibold bg-[#188ab2] text-white hover:bg-[#157a9d] shadow-sm transition-all duration-200 active:scale-95">
                Apply Now
              </a>
            </div>
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6 text-[#188ab2]" /> : <Menu className="h-6 w-6 text-[#188ab2]" />}
            </button>
          </div>
        </nav>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden fixed top-20 left-0 w-full bg-white border-b border-slate-100 z-40 p-6 flex flex-col gap-4 shadow-xl animate-fade-in">
            <a href="/#who-is-it-for" onClick={() => setIsMenuOpen(false)} className="font-bold">Who is it for?</a>
            <a href="https://calendly.com/sanket-stepsmart" target="_blank" rel="noreferrer" className="font-bold">Book 1:1</a>
            <a href="/#mentors" onClick={() => setIsMenuOpen(false)} className="font-bold">Mentors</a>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="font-bold text-[#188ab2]">Blog</Link>
            <a href="/learn" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-6 py-2.5 rounded-md border border-[#188ab2] text-[#188ab2] hover:bg-[#188ab2] hover:text-white transition-colors font-semibold">Login</a>
            <a href="/#enroll" onClick={() => setIsMenuOpen(false)} className="w-full text-center inline-flex items-center justify-center rounded-md px-6 py-2.5 font-semibold bg-[#188ab2] text-white hover:bg-[#157a9d] shadow-sm transition-all duration-200 active:scale-95">
              Apply Now
            </a>
          </div>
        )}

        <main className="pt-32 pb-24 bg-white">
          <div className="container mx-auto px-6 max-w-3xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-[#188ab2] font-semibold hover:underline mb-8">
              <span className="text-lg">←</span> Back to all posts
            </Link>

            <article>
              <header className="mb-10">
                <span className="inline-block bg-[#188ab2]/5 text-[#188ab2] font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
                  {currentPost.date}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                  {currentPost.title}
                </h1>
                <p className="text-lg text-slate-500 italic leading-relaxed border-l-4 border-slate-200 pl-4 py-1">
                  {currentPost.description}
                </p>
              </header>

              {currentPost.imageUrl && (
                <div className="w-full h-80 md:h-[28rem] rounded-3xl overflow-hidden mb-12 shadow-md">
                  <img
                    src={currentPost.imageUrl}
                    alt={currentPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(currentPost.content) }}
              />
            </article>
          </div>
        </main>
      </div>
    );
  }

  // Blog Listing View
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#188ab2]/10">
      {/* Immovable Sticky Header */}
      <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo className="h-14" />
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
            <a href="/#who-is-it-for" className="hover:text-[#188ab2] transition-colors">Who is it for?</a>
            <a href="https://calendly.com/sanket-stepsmart" target="_blank" rel="noreferrer" className="hover:text-[#188ab2] transition-colors">Book 1:1</a>
            <a href="/#mentors" className="hover:text-[#188ab2] transition-colors">Mentors</a>
            <Link to="/blog" className="text-[#188ab2] transition-colors">Blog</Link>
            <a href="/learn" className="px-5 py-2 rounded-full border border-[#188ab2] text-[#188ab2] hover:bg-[#188ab2] hover:text-white transition-colors">Login</a>
            <a href="/#enroll" className="inline-flex items-center justify-center rounded-md px-6 py-2.5 font-semibold bg-[#188ab2] text-white hover:bg-[#157a9d] shadow-sm transition-all duration-200 active:scale-95">
              Apply Now
            </a>
          </div>
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6 text-[#188ab2]" /> : <Menu className="h-6 w-6 text-[#188ab2]" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 w-full bg-white border-b border-slate-100 z-40 p-6 flex flex-col gap-4 shadow-xl animate-fade-in">
          <a href="/#who-is-it-for" onClick={() => setIsMenuOpen(false)} className="font-bold">Who is it for?</a>
          <a href="https://calendly.com/sanket-stepsmart" target="_blank" rel="noreferrer" className="font-bold">Book 1:1</a>
          <a href="/#mentors" onClick={() => setIsMenuOpen(false)} className="font-bold">Mentors</a>
          <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="font-bold text-[#188ab2]">Blog</Link>
          <a href="/learn" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-6 py-2.5 rounded-md border border-[#188ab2] text-[#188ab2] hover:bg-[#188ab2] hover:text-white transition-colors font-semibold">Login</a>
          <a href="/#enroll" onClick={() => setIsMenuOpen(false)} className="w-full text-center inline-flex items-center justify-center rounded-md px-6 py-2.5 font-semibold bg-[#188ab2] text-white hover:bg-[#157a9d] shadow-sm transition-all duration-200 active:scale-95">
            Apply Now
          </a>
        </div>
      )}

      {/* Blog Hero Section */}
      <section className="pt-36 pb-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <span className="text-sm font-bold text-[#188ab2] uppercase tracking-widest bg-[#188ab2]/5 px-4 py-1.5 rounded-full inline-block mb-4">
            The StepSmart Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
            Resources & Insights for Aspiring PMs
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Guides, case study deep-dives, and actionable frameworks to build your product management career without an MBA.
          </p>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-10 w-10 border-4 border-slate-200 border-t-[#188ab2] rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 text-sm">Loading insights...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-semibold mb-2">{error}</p>
              <button onClick={() => window.location.reload()} className="text-xs text-[#188ab2] font-semibold underline">Retry</button>
            </div>
          ) : displayBlogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 font-semibold mb-2">No blog posts available.</p>
              <p className="text-slate-400 text-sm">Check back later for fresh product strategy content.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.id}`}
                  className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col group text-left"
                >
                  <div className="relative w-full h-56 overflow-hidden bg-slate-100">
                    <img
                      src={blog.imageUrl || "/hero_image.png"}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <span className="inline-block bg-slate-100 text-slate-500 font-semibold text-xs px-3 py-1 rounded-md mb-4 self-start">
                      {blog.date}
                    </span>
                    <h2 className="font-extrabold text-xl text-slate-900 leading-snug mb-3 group-hover:text-[#188ab2] transition-colors line-clamp-3">
                      {blog.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-4">
                      {blog.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 mb-16 text-left">
            <div className="col-span-1">
              <Logo className="h-14 mb-8" />
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Helping engineers and non-PMs break into Product Management without an MBA or IIT tag. Expert mentorship and real-world outcomes.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><a href="/#who-is-it-for" className="hover:text-[#188ab2]">Who is it for?</a></li>
                <li><a href="/#batch-details" className="hover:text-[#188ab2]">Batch Details</a></li>
                <li><a href="/#mentors" className="hover:text-[#188ab2]">Mentors</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Join Our Community</h4>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Stay updated with free resources, case study deep-dives, and networking opportunities.
              </p>
              <a 
                href="https://chat.whatsapp.com/BCeLjXhQHrxFxOlxkb7DPc" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#188ab2] font-bold hover:underline"
              >
                Join the WhatsApp Community <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-200 flex flex-col md:row items-center justify-between gap-6">
            <div className="flex gap-6 text-slate-400">
              <a href="mailto:administrator@stepsmart.net" className="hover:text-[#188ab2] transition-colors"><Mail /></a>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">© 2026 StepSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!getDemoSession()) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:blogId" element={<BlogPage />} />
        {/* Preserved routes for later use */}
        {/* <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
