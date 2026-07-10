import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
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
  LogOut,
  Wrench,
  FolderArchive,
  MessageSquare
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

const Logo = () => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <a 
      href="#" 
      onClick={handleClick} 
      className="flex items-center gap-3 select-none cursor-pointer"
    >
      {/* Blue tilted square matching the stepsmarter branding with Neobrutalism shadow */}
      <div className="w-8 h-8 bg-[#188ab2] border-[3px] border-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] rotate-[-6deg]"></div>
      <span className="font-extrabold text-2xl tracking-tight text-[#111111]">StepSmart</span>
    </a>
  );
};

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

const NavLink = ({ href, children, target, rel }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative px-3 py-1.5 text-[#111111] font-extrabold text-sm select-none cursor-pointer"
    >
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        className="absolute left-0 right-0 bottom-[-2px] w-full h-3 pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 5,10 C 35,14 65,14 95,10"
          stroke="#FFF3A7"
          strokeWidth="4.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: isHovered ? 0 : 100,
            transition: 'stroke-dashoffset 0.25s ease-in-out',
          }}
        />
      </svg>
    </a>
  );
};

const Button = ({ children, className, variant = "primary", isLoading, ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-2.5 font-extrabold border-[3px] border-[#111111] focus:outline-none disabled:opacity-50 transition-all duration-100 select-none cursor-pointer";
  const variants: any = {
    primary: "bg-[#188ab2] text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]",
    secondary: "bg-[#FFF3A7] text-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]",
    outline: "bg-[#FFFFFF] text-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#111111]" />}
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

  const handleMobileLinkClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#111111] selection:bg-[#188ab2]/30">
      <nav className="fixed top-0 z-50 w-full bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-sm font-extrabold text-[#111111]">
            <NavLink href="#who-is-it-for">Who is it for?</NavLink>
            <NavLink href="https://calendly.com/sanket-stepsmart" target="_blank" rel="noreferrer">Book 1:1</NavLink>
            <NavLink href="#mentors">Mentors</NavLink>
            <a href="/auth" className="ml-2 px-5 py-2 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all select-none font-extrabold">Login</a>
            <Button variant="primary" onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}>
              Apply Now
            </Button>
          </div>
          <button className="md:hidden p-2 border-[3px] border-[#111111] bg-[#FFFFFF]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6 text-[#111111]" /> : <Menu className="h-6 w-6 text-[#111111]" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 w-full bg-[#FFFFFF] border-b-[3px] border-[#111111] z-40 p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
          <a href="#who-is-it-for" onClick={(e) => handleMobileLinkClick(e, 'who-is-it-for')} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Who is it for?</a>
          <a href="https://calendly.com/sanket-stepsmart" target="_blank" rel="noreferrer" className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Book 1:1</a>
          <a href="#mentors" onClick={(e) => handleMobileLinkClick(e, 'mentors')} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Mentors</a>
          <a href="/auth" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-6 py-2.5 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] font-extrabold transition-all">Login</a>
          <Button variant="primary" className="w-full" onClick={() => { setIsMenuOpen(false); handleActionClick('enroll'); }}>Apply Now</Button>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-[1.2] text-[#111111]">
            Break into{' '}
            <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-1 rotate-[-1.5deg] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] select-none">
              Product Management
            </span>{' '}
            without an MBA or IIT tag
          </h1>
          <p className="text-lg md:text-xl text-[#111111] mb-12 max-w-3xl mx-auto leading-relaxed font-bold">
            For engineers and professionals who are ready to make the switch. Lead with identity and outcome, not just a certificate.
          </p>
          <div className="flex flex-col items-center gap-6 mb-16">
            <Button 
              variant="primary" 
              className="px-12 py-5 text-xl font-extrabold shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]"
              onClick={() => handleActionClick('enroll')}
            >
              Apply for PM-X accelerator
            </Button>
            <button 
              onClick={() => handleActionClick('brochure')}
              className="text-[#111111] text-sm font-extrabold underline underline-offset-4 decoration-[#188ab2] decoration-[3px] hover:text-[#188ab2] transition-colors"
            >
              Not sure yet? Download the curriculum first.
            </button>
          </div>

          <div className="relative w-full max-w-5xl mx-auto border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] bg-white">
            <img 
              src="/hero_image.png" 
              alt="PM-X Accelerator — Product Management course outcomes and student success stories" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section id="who-is-it-for" className="py-24 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-[#111111] mb-4">Who is this for?</h2>
            <p className="text-lg font-bold text-[#111111]">The PM-X Accelerator is designed for builders ready to take the next step in their career.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                label: "Software Engineers", 
                desc: "Technical minds wanting to move from 'how to build' to 'what to build'.", 
                icon: <Users className="h-8 w-8 text-[#111111]" />,
                iconTilt: "rotate-[3deg]",
                tag: "Technical background",
                tagTilt: "rotate-[-1.5deg]"
              },
              { 
                label: "Aspiring PMs", 
                desc: "Non-PM professionals looking for a structured, real-world entry path.", 
                icon: <CheckCircle2 className="h-8 w-8 text-[#111111]" />,
                iconTilt: "rotate-[-2deg]",
                tag: "Career switcher",
                tagTilt: "rotate-[2deg]"
              },
              { 
                label: "Business Analysts", 
                desc: "Analysts wanting to own the product lifecycle and drive strategy.", 
                icon: <Briefcase className="h-8 w-8 text-[#111111]" />,
                iconTilt: "rotate-[4deg]",
                tag: "Strategy-minded",
                tagTilt: "rotate-[-2deg]"
              },
              { 
                label: "Recent Graduates", 
                desc: "Hungry talent wanting to bypass the 'lack of experience' trap.", 
                icon: <Calendar className="h-8 w-8 text-[#111111]" />,
                iconTilt: "rotate-[-3deg]",
                tag: "Entry-level",
                tagTilt: "rotate-[1.5deg]"
              }
            ].map((box, i) => (
              <div 
                key={i} 
                className="bg-[#FFFFFF] p-8 border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-between transition-all duration-100 select-none group cursor-pointer"
              >
                <div>
                  {/* Icon wrapper with custom alternating tilt */}
                  <div className={`w-14 h-14 bg-[#188ab2] border-[3px] border-[#111111] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] mb-6 transition-transform duration-100 ${box.iconTilt}`}>
                    {box.icon}
                  </div>
                  
                  <h3 className="font-extrabold text-xl text-[#111111] mb-1">{box.label}</h3>
                  
                  {/* Rotated pill style credential/stamped tag */}
                  <div className="mb-4 inline-block">
                    <span className={`inline-block bg-[#FFF3A7] text-[#111111] border-[2px] border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none ${box.tagTilt}`}>
                      {box.tag}
                    </span>
                  </div>

                  <p className="text-[#111111] text-xs leading-relaxed font-bold mt-2">{box.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Batch Details Section */}
      <section id="batch-details" className="py-24 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
              Every batch is{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                one more step
              </span>
            </h2>
            <p className="text-lg font-bold text-slate-500 mt-4">Small by design. Personally vetted, every time.</p>
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-4 max-w-2xl mx-auto gap-3 md:gap-6 items-end mt-12 mb-8">
            {/* Batch 1 */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] md:text-xs font-extrabold text-[#111111] mb-2 uppercase tracking-wider">Batch 1</span>
              <div className="w-full bg-[#10b981] border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] h-24 md:h-28 flex items-center justify-center rounded-none select-none">
                <span className="text-white text-xl md:text-2xl font-extrabold">✓</span>
              </div>
            </div>

            {/* Batch 2 */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] md:text-xs font-extrabold text-[#111111] mb-2 uppercase tracking-wider">Batch 2</span>
              <div className="w-full bg-[#10b981] border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] h-32 md:h-36 flex items-center justify-center rounded-none select-none">
                <span className="text-white text-xl md:text-2xl font-extrabold">✓</span>
              </div>
            </div>

            {/* Batch 3 */}
            <div className="flex flex-col items-center relative">
              <div className="absolute -top-7 bg-[#111111] text-[#FFF3A7] border-[2px] border-[#111111] px-1.5 py-0.5 font-extrabold text-[8px] md:text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none whitespace-nowrap">
                OPEN NOW
              </div>
              <span className="text-[10px] md:text-xs font-extrabold text-[#111111] mb-2 uppercase tracking-wider">Batch 3</span>
              <div className="w-full bg-[#188ab2] border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] h-40 md:h-44 flex flex-col items-center justify-center rounded-none select-none relative">
                <div className="text-center text-white">
                  <div className="text-xl md:text-2xl font-extrabold">03</div>
                  <div className="text-[8px] md:text-[10px] font-extrabold tracking-wider uppercase">BATCH 3</div>
                </div>
              </div>
            </div>

            {/* Batch 4 */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] md:text-xs font-extrabold text-slate-400 mb-2 uppercase tracking-wider">Batch 4</span>
              <div className="w-full border-[3px] border-dashed border-slate-300 h-48 md:h-52 flex items-center justify-center rounded-none select-none">
                <span className="text-slate-400 font-extrabold text-xs md:text-sm uppercase tracking-wider">TBD</span>
              </div>
            </div>
          </div>

          <hr className="border-t-[3px] border-[#111111] my-12" />

          {/* Callouts */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border-[3px] border-[#111111] p-8 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] select-none">
              <p className="text-base font-bold text-[#111111] leading-relaxed">
                <strong>1 batch completed, 1 batch ongoing.</strong> 50+ professionals transitioned into PM roles.
              </p>
            </div>

            <div className="bg-[#FFF3A7] border-[3px] border-[#111111] p-8 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] select-none">
              <p className="text-base font-bold text-[#111111] leading-relaxed">
                <strong>Batch 3 is open</strong> — 12-18 seats, personally vetted on a 30 min call.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section id="mentors" className="py-24 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <h2 className="text-4xl font-extrabold mb-16 text-[#111111]">Learn from Professionals</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Sanket */}
            <div className="bg-[#FFFFFF] border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-8 relative flex flex-col md:flex-row items-center md:items-start gap-8 text-left">
              {/* Headshot in circle with black border */}
              <div className="w-28 h-28 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
                <img
                  src={sanketPhotoSrc}
                  alt="Sanket, Senior Product Manager at Mastercard, PM mentor at StepSmart"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              <div className="flex-1">
                {/* Rotated tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    PM @ Mastercard
                  </span>
                  <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    100+ Mentored
                  </span>
                </div>
                
                <h3 className="text-2xl font-extrabold text-[#111111] mb-1">Sanket</h3>
                <p className="text-[#188ab2] text-xs font-extrabold uppercase tracking-widest mb-4">Senior PM - Mastercard</p>
                <p className="text-sm font-bold text-[#111111] leading-relaxed">
                  Successfully mentored 100+ professionals into high-growth PM roles. Expert in behavioral interviews and product sense frameworks, with deep specialization in scaling fintech products for the global market.
                </p>
              </div>
            </div>

            {/* Ankit */}
            <div className="bg-[#FFFFFF] border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-8 relative flex flex-col md:flex-row items-center md:items-start gap-8 text-left">
              {/* Headshot in circle with black border */}
              <div className="w-28 h-28 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
                <img
                  src={ankitPhotoSrc}
                  alt="Ankit, Product Manager at Microsoft, PM mentor at StepSmart"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              <div className="flex-1">
                {/* Rotated tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    PM 2 @ Microsoft
                  </span>
                  <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    AI Specialist
                  </span>
                </div>
                
                <h3 className="text-2xl font-extrabold text-[#111111] mb-1">Ankit</h3>
                <p className="text-[#188ab2] text-xs font-extrabold uppercase tracking-widest mb-4">Product Manager 2 - Microsoft</p>
                <p className="text-sm font-bold text-[#111111] leading-relaxed">
                  Leads enterprise-grade AI product development at Microsoft. Expert at turning ambiguity into clarity for complex product strategy, with a focus on scaling AI-native products from 0 to 1.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-24 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
              Cohort{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                Curriculum
              </span>
            </h2>
            <p className="text-lg font-bold text-[#111111] mt-4">Three core phases focused on hands-on PM skills.</p>
          </div>

          <div className="flex flex-col gap-8">
            {[
              {
                title: "Product Fundamentals, Systems Thinking",
                tag: "Technical",
                dotColor: "bg-[#188ab2]",
                desc: "Learn to build modern software products from first principles. Master systems thinking, database structure, APIs, system dependency logic, client-server dynamics, and technical specifications most PMs skip."
              },
              {
                title: "Business Viability, Unit Economics, Market Research",
                tag: "Business Strategy",
                dotColor: "bg-amber-500",
                desc: "Understand CAC, LTV, subscriber churn, payback periods, bottom-up TAM modeling, competitor benchmarking, defensible moat strategies, pricing logic, and GTM (Go-to-Market) loops."
              },
              {
                title: "User Research, Segmentation, User Value",
                tag: "User Centricity",
                dotColor: "bg-red-500",
                desc: "Design detailed user personas and behavioral segment profiles. Conduct qualitative research interviews, quantitative user surveys, user journey mapping, and value proposition canvas validation."
              }
            ].map((topic, i) => (
              <div 
                key={i} 
                className="bg-white border-[3px] border-[#111111] p-8 md:p-10 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all duration-100 flex flex-col justify-between relative rounded-[16px] select-none"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-xl md:text-2xl font-extrabold text-[#111111]">
                    {topic.title}
                  </h3>
                  {/* Tag Pill with dot */}
                  <div className="inline-flex items-center gap-2 border-2 border-[#111111] bg-white px-3.5 py-1 rounded-full text-xs font-extrabold shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] shrink-0 self-start md:self-center">
                    <span className={`w-2.5 h-2.5 rounded-full ${topic.dotColor} border border-[#111111]`}></span>
                    <span className="text-[#111111]">{topic.tag}</span>
                  </div>
                </div>

                {/* Description One-Liner */}
                <p className="text-xs md:text-sm font-bold text-[#111111] leading-relaxed mt-4">
                  {topic.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Download Brochure callout */}
          <div className="text-center mt-12 bg-white border-[3px] border-[#111111] p-8 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] rounded-[16px] select-none">
            <p className="text-sm md:text-base font-extrabold text-[#111111] mb-6">
              There are more than three phases in the full curriculum. We only show the first 3 phases here.
            </p>
            <Button 
              variant="secondary" 
              onClick={() => handleActionClick('brochure')}
            >
              Download Full Curriculum Brochure ➜
            </Button>
          </div>
        </div>
      </section>

      {/* Beyond the Curriculum Section */}
      <section className="py-24 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
              Beyond the{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                Curriculum
              </span>
            </h2>
            <p className="text-lg font-bold text-[#111111]">What else is included — no extra cost, no fine print.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Resume Transformation",
                desc: "Live sessions to translate your previous experience into PM terms.",
                icon: <FileText className="h-5 w-5 text-white" />
              },
              {
                title: "Mock Interview Bank",
                desc: "Access to a library of 50+ real cases from top tech firms.",
                icon: <FolderArchive className="h-5 w-5 text-white" />
              },
              {
                title: "The PM Toolstack",
                desc: "Master industry-standard tools like Figma, Mixpanel, Jira, and OpenAI APIs.",
                icon: <Wrench className="h-5 w-5 text-white" />
              },
              {
                title: "Community for Life",
                desc: "Permanent access to the StepSmart WhatsApp inner circle and alumni.",
                icon: <MessageSquare className="h-5 w-5 text-white" />
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white border-[3px] border-[#111111] p-6 pt-12 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all duration-100 flex flex-col justify-between rounded-none relative select-none h-64"
              >
                {/* Icon Badge */}
                <div className="absolute -top-5 left-6 bg-[#188ab2] text-white border-[3px] border-[#111111] w-10 h-10 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#111111] mb-3">{item.title}</h3>
                  <p className="text-xs font-bold leading-relaxed text-[#111111]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Join Section */}
      <section className="py-24 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
              How to{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                Join the Tribe
              </span>
            </h2>
            <p className="text-lg font-bold text-[#111111] mt-4">No automated gateways, no automated rejections. We screen for alignment at every step.</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-8 items-stretch">
            {[
              {
                num: "01",
                title: "Apply Now",
                desc: "Fill out the quick enrollment form below to register your intent.",
                shadow: "shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]",
                tilt: "rotate-[-1deg]"
              },
              {
                num: "02",
                title: "Book Vetting 1:1",
                desc: "Schedule a talk with the mentors to align goals and ensure fit.",
                shadow: "shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]",
                tilt: "rotate-[2deg]",
                action: (
                  <div className="mt-4">
                    <a
                      href="https://calendly.com/sanket-stepsmart"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-[#188ab2] text-white border-2 border-[#111111] px-3 py-1 font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2.5px_2.5px_0px_0px_rgba(17,17,17,1)] transition-all cursor-pointer select-none"
                    >
                      Book Call ➜
                    </a>
                    <div className="mt-3 inline-block bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2 py-0.5 font-extrabold text-[9px] uppercase rotate-[-2deg] shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]">
                      ⚡ 30 min / no commitment
                    </div>
                  </div>
                )
              },
              {
                num: "03",
                title: "Get Decision",
                desc: "Get an email confirmation on application status and next steps.",
                shadow: "shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]",
                tilt: "rotate-[-1.5deg]"
              },
              {
                num: "04",
                title: "Batch Starts",
                desc: "Secure your cohort slot. Onboarding starts on June 1st.",
                shadow: "shadow-[6px_4px_0px_0px_rgba(17,17,17,1)]",
                tilt: "rotate-[1deg]"
              },
              {
                num: "05",
                title: "Lifetime Access",
                desc: "Join our active alumni network across 90+ global companies.",
                shadow: "shadow-[4px_6px_0px_0px_rgba(17,17,17,1)]",
                tilt: "rotate-[-2deg]"
              }
            ].map((step, i) => (
              <div 
                key={i} 
                className={`bg-white border-[3px] border-[#111111] p-6 pt-10 ${step.shadow} flex flex-col justify-between h-full relative hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all duration-100 select-none`}
              >
                {/* Number Badge */}
                <div className={`absolute -top-4 -left-4 bg-[#188ab2] text-white border-[3px] border-[#111111] w-9 h-9 flex items-center justify-center font-extrabold text-sm shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] ${step.tilt}`}>
                  {step.num}
                </div>
                
                <div>
                  <h3 className="font-extrabold text-lg text-[#111111] mb-2">{step.title}</h3>
                  <p className="text-xs text-[#111111] leading-relaxed font-bold">{step.desc}</p>
                </div>
                
                {step.action && step.action}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof of Progress */}
      <section className="py-24 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-16 text-[#111111]">Proof of Progress</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
            {[
              { 
                name: "Nishtha", 
                role: "Product Management Mentee", 
                photo: "/student-nishtha.png",
                altText: "Nishtha, Product Management Course graduate outcome",
                shadow: "shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]",
                avatarTilt: "rotate-[-3deg]",
                text: (
                  <span>
                    Ankit helped me break down vague case studies into actionable chunks helping me{' '}
                    <span className="bg-[#FFF3A7] border-2 border-[#111111] px-1.5 py-0.5 text-[#111111] font-extrabold inline-block rotate-[-1.5deg] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] select-none">
                      land the PM job
                    </span>
                  </span>
                )
              },
              { 
                name: "Gauri", 
                role: "PM-X Accelerator Student", 
                photo: "/student-gauri.png",
                altText: "Gauri, Product Management Course graduate outcome",
                shadow: "shadow-[8px_4px_0px_0px_rgba(17,17,17,1)]",
                avatarTilt: "rotate-[4deg]",
                text: (
                  <span>
                    The PM-X course helped me to{' '}
                    <span className="bg-[#FFF3A7] border-2 border-[#111111] px-1.5 py-0.5 text-[#111111] font-extrabold inline-block rotate-[2deg] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] select-none">
                      land the PM job
                    </span>
                    . A must take course for aspiring PM's. It is well structured and curated.
                  </span>
                )
              },
              { 
                name: "Riya", 
                role: "Product Strategy Mentee", 
                photo: "/student-riya.png",
                altText: "Riya, Product Management Course graduate outcome",
                shadow: "shadow-[4px_8px_0px_0px_rgba(17,17,17,1)]",
                avatarTilt: "rotate-[-2deg]",
                text: (
                  <span>
                    Sanket has helped me in structure my thoughts, such that now I am prepared for any interview{' '}
                    <span className="bg-[#FFF3A7] border-2 border-[#111111] px-1.5 py-0.5 text-[#111111] font-extrabold inline-block rotate-[-1deg] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] select-none">
                      confidently
                    </span>
                  </span>
                )
              }
            ].map((t, i) => (
              <div 
                key={i} 
                className={`bg-[#FFFFFF] p-10 border-[3px] border-[#111111] ${t.shadow} relative flex flex-col justify-between select-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all duration-100`}
              >
                <Quote className="text-[#188ab2]/15 h-16 w-16 absolute top-4 right-4" />
                <div className="mb-8 relative z-10">
                  <div className="text-xs font-extrabold text-[#188ab2] uppercase tracking-widest mb-3">{t.role}</div>
                  <p className="text-[#111111] leading-relaxed text-lg font-bold">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Real headshot instead of initials */}
                  <div className={`w-10 h-10 rounded-full border-2 border-[#111111] overflow-hidden shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] shrink-0 bg-white ${t.avatarTilt}`}>
                    <img 
                      src={t.photo} 
                      alt={t.altText} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="font-extrabold text-[#111111]">{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
              Frequently Asked{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                Questions
              </span>
            </h2>
            <p className="text-lg font-bold text-[#111111] mt-4">Got questions? We've got answers.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Do I need an MBA or an IIT degree to join or break into PM?",
                a: "Absolutely not. The best product managers come from diverse backgrounds like software engineering, analytics, marketing, or design. We screen for logic, user empathy, and problem-solving, not pedigree."
              },
              {
                q: "How is the PM-X Accelerator different from other product management courses?",
                a: "Most courses are passive video modules. StepSmart is a live career accelerator. Every session is taught live by PMs from Microsoft and Mastercard. You build real product specifications (PRDs) and do live mock interviews."
              },
              {
                q: "What is the commitment required for this course?",
                a: "You'll need to dedicate 4-6 hours per week for live sessions and hands-on case studies. The curriculum is structured to fit around your working hours."
              },
              {
                q: "Do we get lifetime access to the resources and community?",
                a: "Yes! Once you enroll, you join our WhatsApp Inner Circle and get lifetime access to our PM interview banks, toolstacks, templates, and active alumni network."
              },
              {
                q: "Is there job placement assistance?",
                a: "We offer complete resume transformation workshops, case study portfolio construction, and direct referrals to top-tier companies through our mentors and alumni network."
              }
            ].map((faq, i) => (
              <details 
                key={i} 
                className="group border-[3px] border-[#111111] bg-white p-6 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] [&_summary::-webkit-details-marker]:hidden open:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] open:translate-x-[2px] open:translate-y-[2px] transition-all duration-100 rounded-none select-none"
              >
                <summary className="flex items-center justify-between font-extrabold text-base md:text-lg cursor-pointer text-[#111111] list-none">
                  <span>{faq.q}</span>
                  <span className="transition group-open:rotate-180 font-bold text-xl shrink-0 ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-xs md:text-sm font-bold leading-relaxed text-[#111111] border-t-2 border-[#111111]/10 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Enroll Form Section */}
      <section id="enroll" className="py-24 bg-[#FFFFFF] relative border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-[#111111]">Ready to Start Your Journey?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <button
              onClick={() => handleActionClick('brochure')}
              className={`flex flex-col items-center p-10 bg-white border-[3px] transition-all duration-100 ${
                formIntent === 'brochure'
                  ? 'border-[#188ab2] shadow-[6px_6px_0px_0px_rgba(24,138,178,1)] translate-x-[-2px] translate-y-[-2px]'
                  : 'border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]'
              }`}
            >
              <Download className={`h-10 w-10 mb-4 ${formIntent === 'brochure' ? 'text-[#188ab2]' : 'text-[#111111]'}`} />
              <h3 className="text-xl font-extrabold mb-2 text-[#111111]">Download Accelerator Brochure</h3>
              <p className="text-[#111111] text-sm font-bold">Get the curriculum and roadmap details.</p>
            </button>
            <button
              onClick={() => handleActionClick('enroll')}
              className={`flex flex-col items-center p-10 bg-white border-[3px] transition-all duration-100 ${
                formIntent === 'enroll'
                  ? 'border-[#188ab2] shadow-[6px_6px_0px_0px_rgba(24,138,178,1)] translate-x-[-2px] translate-y-[-2px]'
                  : 'border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]'
              }`}
            >
              <Briefcase className={`h-10 w-10 mb-4 ${formIntent === 'enroll' ? 'text-[#188ab2]' : 'text-[#111111]'}`} />
              <h3 className="text-xl font-extrabold mb-2 text-[#111111]">Enroll for PM-X Accelerator</h3>
              <p className="text-[#111111] text-sm font-bold">Register for the next batch or masterclass.</p>
            </button>
          </div>

          <div id="form-container" className="max-w-xl mx-auto bg-white border-[3px] border-[#111111] p-8 md:p-12 text-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] scroll-mt-24">
            {enrollmentStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="bg-[#FFFFFF] border-[3px] border-[#111111] text-green-600 w-16 h-16 flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                  <CheckCircle2 className="h-8 w-8 text-[#188ab2]" />
                </div>
                <h3 className="text-3xl font-extrabold mb-4">{formIntent === 'brochure' ? "Brochure Ready!" : "Enrollment Submitted!"}</h3>
                <p className="text-[#111111] mb-8 font-bold">
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
                    <input 
                      {...register("fullName")} 
                      placeholder="Full Name" 
                      className="w-full px-5 py-4 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(24,138,178,1)] transition-all placeholder-[#111111]/60" 
                    />
                    {errors.fullName && <p className="text-red-500 text-xs font-bold mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <input 
                      {...register("email")} 
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full px-5 py-4 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(24,138,178,1)] transition-all placeholder-[#111111]/60" 
                    />
                    {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <input 
                      {...register("phone")} 
                      placeholder="WhatsApp Number" 
                      className="w-full px-5 py-4 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(24,138,178,1)] transition-all placeholder-[#111111]/60" 
                    />
                    {errors.phone && <p className="text-red-500 text-xs font-bold mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
                <Button type="submit" className="w-full py-5 text-xl font-extrabold" isLoading={enrollmentStatus === 'loading'}>
                  {formIntent === 'brochure' ? 'Get Brochure Now' : 'Join Accelerator Batch'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FFFFFF] py-20 border-t-[3px] border-[#111111]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 mb-16 text-left">
            <div className="col-span-1">
              <Logo />
              <p className="text-[#111111] text-sm leading-relaxed max-w-xs mt-8 font-bold">
                Helping engineers and non-PMs break into Product Management without an MBA or IIT tag. Expert mentorship and real-world outcomes.
              </p>
            </div>
            <div>
              <h4 className="font-extrabold text-[#111111] mb-6">Quick Links</h4>
              <ul className="space-y-4 text-[#111111] text-sm font-bold">
                <li><a href="#who-is-it-for" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Who is it for?</a></li>
                <li><a href="#batch-details" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Batch Details</a></li>
                <li><a href="#mentors" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Mentors</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold text-[#111111] mb-6">Join Our Community</h4>
              <p className="text-[#111111] text-sm mb-6 leading-relaxed font-bold">
                Stay updated with free resources, case study deep-dives, and networking opportunities.
              </p>
              <a 
                href="https://chat.whatsapp.com/BCeLjXhQHrxFxOlxkb7DPc" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#188ab2] font-extrabold hover:underline underline-offset-4 decoration-2 decoration-[#188ab2]"
              >
                Join the WhatsApp Community <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="pt-12 border-t-[3px] border-[#111111] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-6 text-[#111111]">
              <a href="mailto:administrator@stepsmart.net" className="hover:text-[#188ab2] transition-colors"><Mail /></a>
            </div>
            <p className="text-[#111111] text-[10px] font-extrabold uppercase tracking-widest">© 2026 StepSmart. All rights reserved.</p>
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
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-8">
        <Logo />
        <h1 className="text-2xl font-extrabold text-[#111111] text-center mt-8 mb-2">
          {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </h1>
        <p className="text-[#111111] text-sm text-center mb-8 font-bold">
          {mode === 'signup' ? 'Sign up to access the PM-X learner dashboard.' : 'Login to continue learning.'}
        </p>

        <form className="space-y-4" onSubmit={handleSubmitAuth}>
          {mode === 'signup' && (
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(24,138,178,1)] transition-all placeholder-[#111111]/60"
            />
          )}
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(24,138,178,1)] transition-all placeholder-[#111111]/60"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(24,138,178,1)] transition-all placeholder-[#111111]/60"
          />

          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

          <Button type="submit" className="w-full py-3" variant="primary">
            {mode === 'signup' ? 'Sign Up' : 'Login'}
          </Button>
        </form>

        <div className="text-center mt-6 text-sm text-[#111111] font-bold">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="text-[#188ab2] font-extrabold hover:underline"
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
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111]">
      <header className="bg-white border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="text-sm font-extrabold hidden md:inline">
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
        <h1 className="text-3xl font-extrabold text-[#111111] mb-8">PM-X Learning Dashboard</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { id: 'lectures', label: 'Video Lectures', icon: <PlayCircle className="h-5 w-5 mb-2" /> },
            { id: 'resources', label: 'Resources', icon: <FileText className="h-5 w-5 mb-2" /> },
            { id: 'assignments', label: 'Assignments', icon: <ClipboardList className="h-5 w-5 mb-2" /> },
            { id: 'calendar', label: 'Calendar', icon: <CalendarDays className="h-5 w-5 mb-2" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`border-[3px] border-[#111111] p-4 text-left transition-all duration-100 select-none ${
                activeTab === tab.id
                  ? 'bg-[#188ab2] text-white shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] translate-x-[2px] translate-y-[2px]'
                  : 'bg-white text-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]'
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.icon}
              <p className="font-extrabold">{tab.label}</p>
            </button>
          ))}
        </div>

        <div className="bg-white border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] min-h-[300px]">
          {activeTab === 'lectures' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['PM Fundamentals', 'Case Study Walkthrough', 'Product Strategy in Practice'].map((item) => (
                <div key={item} className="bg-[#FFFFFF] border-[3px] border-[#111111] p-5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                  <p className="font-extrabold text-[#111111] mb-2">{item}</p>
                  <p className="text-sm text-[#111111] font-bold">Recorded session available</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="grid md:grid-cols-2 gap-4">
              {['PRD Template', 'Go-to-Market Checklist', 'PM Interview Framework'].map((item) => (
                <div key={item} className="bg-[#FFFFFF] border-[3px] border-[#111111] p-5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                  <p className="font-extrabold text-[#111111] mb-2">{item}</p>
                  <p className="text-sm text-[#111111] font-bold">Downloadable study material</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-4">
              {['Week 1: Problem Discovery Exercise', 'Week 2: User Story Writing', 'Week 3: Metrics Definition'].map((item) => (
                <div key={item} className="bg-[#FFFFFF] border-[3px] border-[#111111] p-5 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                  <p className="font-extrabold text-[#111111]">{item}</p>
                  <span className="text-xs font-extrabold uppercase tracking-wide text-[#111111] bg-[#FFF3A7] border-2 border-[#111111] px-3 py-1 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">Pending</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-4">
              {[
                { title: 'Live Mentorship Session', date: 'Saturday, 6:00 PM' },
                { title: 'Mock Interview Practice', date: 'Tuesday, 8:00 PM' },
                { title: 'Doubt Clearing AMA', date: 'Thursday, 7:30 PM' }
              ].map((item) => (
                <div key={item.title} className="bg-[#FFFFFF] border-[3px] border-[#111111] p-5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                  <p className="font-extrabold text-[#111111]">{item.title}</p>
                  <p className="text-sm text-[#111111] mt-1 font-bold">{item.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
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
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
