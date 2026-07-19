import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StudentsLandingPage } from './StudentsBrutalism';
import { EventsPage } from './EventsBrutalism';
import * as z from 'zod';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';

// Banner Configuration (Set enabled: true to display banner at top of all pages)
export const BANNER_CONFIG = {
  enabled: true,
  text: "📅 Next Live Event: 'Product Masterclass' on Monday, July 27 at 8:00 PM IST",
  ctaText: "Register Now ➜"
};

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(() => {
    if (!BANNER_CONFIG.enabled) return false;
    return localStorage.getItem('stepsmart_banner_dismissed') !== 'true';
  });
  const navigate = useNavigate();

  if (!visible) return null;

  const handleDismiss = () => {
    localStorage.setItem('stepsmart_banner_dismissed', 'true');
    setVisible(false);
  };

  return (
    <div className="w-full bg-[#FFF3A7] border-b-[3px] border-[#111111] py-2 px-6 flex items-center justify-between text-[#111111] z-50 select-none relative font-bold text-xs sm:text-sm">
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <span>{BANNER_CONFIG.text}</span>
        <button 
          onClick={() => {
            navigate('/events');
          }}
          className="bg-[#188ab2] text-white border-2 border-[#111111] px-3 py-0.5 font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_0px_rgba(17,17,17,1)] transition-all cursor-pointer inline-block"
        >
          {BANNER_CONFIG.ctaText}
        </button>
      </div>
      <button 
        onClick={handleDismiss}
        className="p-1 hover:bg-[#111111]/10 rounded border-2 border-transparent active:border-[#111111] transition-all ml-4"
        aria-label="Dismiss Banner"
      >
        <X className="h-4 w-4 text-[#111111]" />
      </button>
    </div>
  );
}
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
  MessageSquare,
  GraduationCap,
  BookOpen,
  Trophy,
  Share,
  Brain,
  HeartHandshake
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
export const db = app ? getFirestore(app) : null;
// @ts-ignore
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'stepsmart-prod';

// --- Form Validation Schema ---
export const enrollmentSchema = z.object({
  fullName: z.string().min(2, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Invalid phone number." }),
  intent: z.enum(["brochure", "enroll"]),
});

const logoSrc = "/stepsmart-logo.png";
export const sanketPhotoSrc = "/mentor-sanket.jpg";
export const ankitPhotoSrc = "/mentor-ankit.jpg";
export const pankajPhotoSrc = "/mentor-pankaj.jpg";
export const brochurePdfSrc = "/PM-X-Accelerator-Brochure.pdf";
const demoLeadsKey = "pmx_demo_leads";
const demoUsersKey = "pmx_demo_users";
const demoSessionKey = "pmx_demo_auth_session";

type DemoUser = {
  fullName: string;
  email: string;
  password: string;
};

type DashboardTab = 'lectures' | 'resources' | 'assignments' | 'calendar';

export const Logo = ({ toHome }: { toHome?: boolean }) => {
  const navigate = useNavigate();
  const handleClick = (e: React.MouseEvent) => {
    if (toHome) {
      e.preventDefault();
      navigate('/');
      window.scrollTo({ top: 0 });
    } else {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <a 
      href="/" 
      onClick={handleClick} 
      className="flex items-center gap-3 select-none cursor-pointer"
    >
      <img src="/stepsmart-logo.png" alt="StepSmart Logo" className="w-8 h-8 object-contain" />
      <span className="font-extrabold text-2xl tracking-tight text-[#111111]">StepSmart</span>
    </a>
  );
};


export const startBrochureDownload = () => {
  const link = document.createElement('a');
  link.href = brochurePdfSrc;
  link.download = 'PM-X-Accelerator-Brochure.pdf';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const saveLeadToDemoDB = (lead: any) => {
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

export const getDemoUsers = (): DemoUser[] => {
  try {
    const stored = localStorage.getItem(demoUsersKey);
    if (!stored) {
      const defaultUsers = [
        {
          fullName: "Demo Admin",
          email: "admin@stepsmart.net",
          password: "password"
        },
        {
          fullName: "Demo Student",
          email: "student@stepsmart.net",
          password: "password"
        }
      ];
      localStorage.setItem(demoUsersKey, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

export const saveDemoUsers = (users: DemoUser[]) => {
  localStorage.setItem(demoUsersKey, JSON.stringify(users));
};

export const getDemoSession = () => localStorage.getItem(demoSessionKey);

export const setDemoSession = (email: string | null) => {
  if (email) {
    localStorage.setItem(demoSessionKey, email);
    return;
  }
  localStorage.removeItem(demoSessionKey);
};

export const NavLink = ({ href, children, target, rel }: any) => {
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

export const Button = ({ children, className, variant = "primary", isLoading, ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-2.5 font-extrabold border-[3px] border-[#111111] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0f6f8f]/40 disabled:opacity-50 transition-all duration-100 select-none cursor-pointer";
  const variants: any = {
    primary: "bg-[#0f6f8f] text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:bg-[#188ab2] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]",
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

function ProfessionalsLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState('idle');
  const [formIntent, setFormIntent] = useState('enroll');
  const navigate = useNavigate();
  const userType = 'professional';

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
            masterclassId: userType === 'professional' ? 'pm-x-accelerator' : 'pm-x-speedup-students',
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
      <div className="fixed top-0 z-50 w-full flex flex-col">
        <AnnouncementBanner />
        <nav className="w-full bg-[#FFFFFF] border-b-[3px] border-[#111111]">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Logo toHome={true} />
            <div className="hidden md:flex items-center gap-8 text-sm font-extrabold text-[#111111]">
              <NavLink href="#who-is-it-for">Who is it for?</NavLink>
              <NavLink href="#curriculum">Cohort Perks</NavLink>
              <Link to="/events" className="font-extrabold text-sm text-[#111111] hover:text-[#188ab2] transition-colors">Events</Link>
              <NavLink href="/blog">Blog</NavLink>
              <a href="/learn" className="ml-2 px-5 py-2 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all select-none font-extrabold">Login</a>
              <Button variant="primary" className="px-5 py-2 text-sm" onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}>
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
          <div className="md:hidden w-full bg-[#FFFFFF] border-b-[3px] border-[#111111] p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
            <a href="#who-is-it-for" onClick={(e) => handleMobileLinkClick(e, 'who-is-it-for')} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Who is it for?</a>
            <a href="#curriculum" onClick={(e) => handleMobileLinkClick(e, 'curriculum')} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Cohort Perks</a>
            <Link to="/events" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Events</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Blog</Link>
            <a href="/learn" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-6 py-2.5 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] font-extrabold transition-all">Login</a>
            <Button variant="primary" className="w-full px-5 py-2 text-sm" onClick={() => { setIsMenuOpen(false); handleActionClick('enroll'); }}>Apply Now</Button>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-8 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
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
              src="/hero_image.jpg" 
              alt="PM-X Accelerator — Product Management course outcomes and student success stories" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section id="who-is-it-for" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-[#111111] mb-4">
              {userType === 'professional' ? "Who is this for?" : "Who is PM-X First Step for?"}
            </h2>
            <p className="text-lg font-bold text-[#111111]">
              {userType === 'professional' 
                ? "The PM-X Accelerator is designed for builders ready to take the next step in their career." 
                : "Tailored exclusively for ambitious college students seeking non-engineering roles."}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(userType === 'professional' ? [
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
            ] : [
              { 
                label: "Final-Year Students", 
                desc: "Secure high-paying APM offers before graduation.", 
                icon: <GraduationCap className="h-8 w-8 text-[#111111]" />,
                iconTilt: "rotate-[3deg]",
                tag: "Placement Prep",
                tagTilt: "rotate-[-1.5deg]"
              },
              { 
                label: "Pre-Final Year Students", 
                desc: "Crack elite summer product management internships.", 
                icon: <Calendar className="h-8 w-8 text-[#111111]" />,
                iconTilt: "rotate-[-2deg]",
                tag: "Internship Prep",
                tagTilt: "rotate-[2deg]"
              },
              { 
                label: "Non-CS Students", 
                desc: "Switch from core engineering, design, or commerce to tech roles.", 
                icon: <BookOpen className="h-8 w-8 text-[#111111]" />,
                iconTilt: "rotate-[4deg]",
                tag: "Stream Agnostic",
                tagTilt: "rotate-[-2deg]"
              },
              { 
                label: "Recent Graduates", 
                desc: "Bypass the 'need experience to get experience' loop.", 
                icon: <Trophy className="h-8 w-8 text-[#111111]" />,
                iconTilt: "rotate-[-3deg]",
                tag: "Zero Experience",
                tagTilt: "rotate-[1.5deg]"
              }
            ]).map((box, i) => (
              <div 
                key={i} 
                className={`p-8 border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-between transition-all duration-100 select-none group cursor-pointer ${['bg-white', 'bg-[var(--surface-blue)]', 'bg-[var(--surface-mint)]', 'bg-[var(--surface-lavender)]'][i]}`}
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

      {userType === 'professional' ? (
        /* Batch Details Section */
        <section id="batch-details" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
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
      ) : (
        <>
          {/* Cohort Perks / Student Benefits */}
          <section id="student-benefits" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="mb-16 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
                  Student{' '}
                  <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                    Exclusive Perks
                  </span>
                </h2>
                <p className="text-lg font-bold text-[#111111]">Everything you need to compete with MBA candidates as a college student.</p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                {[
                  {
                    title: "Portfolio Building",
                    desc: "Build 3 industry-grade PRDs to prove your product thinking on your resume.",
                    icon: <FileText className="h-5 w-5 text-white" />
                  },
                  {
                    title: "Mock Placement Drives",
                    desc: "Live mock rounds simulating startup APM tests & case interviews.",
                    icon: <FolderArchive className="h-5 w-5 text-white" />
                  },
                  {
                    title: "Tool Mastery",
                    desc: "Hands-on experience with Jira, Figma, Mixpanel, and AI prototyping tools.",
                    icon: <Wrench className="h-5 w-5 text-white" />
                  },
                  {
                    title: "Referrals & Network",
                    desc: "Get referred by our mentors directly into startups hiring freshers.",
                    icon: <MessageSquare className="h-5 w-5 text-white" />
                  }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border-[3px] border-[#111111] p-6 pt-12 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all duration-100 flex flex-col justify-between rounded-none relative select-none h-64"
                  >
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

          {/* Testimonials */}
          <section className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
            <div className="container mx-auto px-6 text-center max-w-5xl">
              <h2 className="text-4xl font-extrabold mb-4 text-[#111111]">Student Success Stories</h2>
              <p className="text-lg font-bold text-slate-500 mb-16">How college freshers broke into PM roles right out of campus.</p>
              <div className="grid md:grid-cols-2 gap-10">
                {/* Student 1 */}
                <div className="bg-[var(--surface-peach)] border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-8 relative flex flex-col md:flex-row items-center md:items-start gap-8 text-left">
                  <div className="w-28 h-28 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center font-extrabold text-3xl">
                    A
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                        APM @ Razorpay
                      </span>
                      <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                        Ex-Intern @ Groww
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-[#111111] mb-1">Aditya</h3>
                    <p className="text-[#188ab2] text-xs font-extrabold uppercase tracking-widest mb-4">APM - Razorpay</p>
                    <p className="text-sm font-bold text-[#111111] leading-relaxed">
                      "I had zero corporate experience. PM-X First Step helped me design a PRD portfolio that stood out in APM selection rounds. The structured case mock sessions were an absolute lifesaver!"
                    </p>
                  </div>
                </div>

                {/* Student 2 */}
                <div className="bg-[var(--surface-lavender)] border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-8 relative flex flex-col md:flex-row items-center md:items-start gap-8 text-left">
                  <div className="w-28 h-28 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center font-extrabold text-3xl">
                    N
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                        APM @ Zepto
                      </span>
                      <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                        B.Tech Graduate
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-[#111111] mb-1">Neha</h3>
                    <p className="text-[#188ab2] text-xs font-extrabold uppercase tracking-widest mb-4">APM - Zepto</p>
                    <p className="text-sm font-bold text-[#111111] leading-relaxed">
                      "I was confused between standard coding placements and PM roles. This cohort gave me the exact frameworks I needed to build product strategy and transition directly after graduation."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Mentors */}
      <section id="mentors" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 text-center max-w-6xl">
          {userType === 'professional' ? (
            <>
              <h2 className="text-4xl font-extrabold mb-16 text-[#111111]">Learn from Professionals</h2>
              <div className="grid md:grid-cols-3 gap-8 text-left">
                {/* Sanket */}
                <div className="bg-[#FFFFFF] border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-6 relative flex flex-col gap-6">
                  {/* Headshot in circle with black border */}
                  <div className="w-24 h-24 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
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
                        50+ Mentored
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-extrabold text-[#111111] mb-1">Sanket</h3>
                    <p className="text-[#188ab2] text-xs font-extrabold uppercase tracking-widest mb-4">
                      <a 
                        href="https://www.linkedin.com/in/sanketkumar-katore/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline inline-flex items-center gap-1.5"
                      >
                        Senior PM - Mastercard
                        <svg className="h-3.5 w-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                      </a>
                    </p>
                    <p className="text-sm font-bold text-[#111111] leading-relaxed">
                      Expert in behavioral interviews and product sense frameworks, with deep specialization in scaling fintech products for the global market.
                    </p>
                  </div>
                </div>

                {/* Ankit */}
                <div className="bg-[#FFFFFF] border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-6 relative flex flex-col gap-6">
                  {/* Headshot in circle with black border */}
                  <div className="w-24 h-24 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
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
                    <p className="text-[#188ab2] text-xs font-extrabold uppercase tracking-widest mb-4">
                      <a 
                        href="https://www.linkedin.com/in/ankit-surkar/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline inline-flex items-center gap-1.5"
                      >
                        Product Manager 2 - Microsoft
                        <svg className="h-3.5 w-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                      </a>
                    </p>
                    <p className="text-sm font-bold text-[#111111] leading-relaxed">
                      Leads enterprise-grade AI product development at Microsoft. Expert at turning ambiguity into clarity for complex product strategy, with a focus on scaling AI-native products from 0 to 1.
                    </p>
                  </div>
                </div>

                {/* Pankaj */}
                <div className="bg-[#FFFFFF] border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-6 relative flex flex-col gap-6">
                  {/* Headshot in circle with black border */}
                  <div className="w-24 h-24 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
                    <img
                      src={pankajPhotoSrc}
                      alt="Pankaj, Senior Product Manager at ShopDeck, PM mentor at StepSmart"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  
                  <div className="flex-1">
                    {/* Rotated tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                        SENIOR PM @ SHOPDECK
                      </span>
                      <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                        B2B + B2C
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-extrabold text-[#111111] mb-1">Pankaj</h3>
                    <p className="text-[#188ab2] text-xs font-extrabold uppercase tracking-widest mb-4">
                      <a 
                        href="https://www.linkedin.com/in/pancage/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline inline-flex items-center gap-1.5"
                      >
                        SENIOR PM - SHOPDECK
                        <svg className="h-3.5 w-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                      </a>
                    </p>
                    <p className="text-sm font-bold text-[#111111] leading-relaxed">
                      Owns merchant-experience, profitability, and logistics at ShopDeck, with 5+ years across SaaS, e-commerce, and mobility. Expert at turning business challenges into revenue-generating solutions for both B2B and B2C.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-extrabold mb-16 text-center text-[#111111]">Meet the Founders & Mentors</h2>
              <div className="flex flex-col gap-16 relative text-left">
                {/* Card 1: Sanket */}
                <div className="sticky top-28 bg-[#FFF3A7] border-[3px] border-[#111111] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] rounded-none rotate-[-1deg] transition-all duration-100 flex flex-col md:flex-row gap-8 items-center min-h-[380px]">
                  <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
                    <img
                      src={sanketPhotoSrc}
                      alt="Sanket, Senior PM at Mastercard"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                        PM @ Mastercard
                      </span>
                      <span className="bg-white text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                        IIT Kanpur Alum
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#111111] mb-4">"I switched into PM with zero product experience. No CS degree. No MBA. Just the right preparation."</h3>
                    <p className="text-base font-bold text-[#111111] leading-relaxed">
                      PM-X is the structured path I wish existed when I was making the switch — behavioural interviews, product sense, and prioritisation frameworks built for career switchers.
                    </p>
                    <p className="text-[#188ab2] font-extrabold text-sm uppercase tracking-wider mt-4">— Sanket, Co-founder & Senior PM @ Mastercard</p>
                  </div>
                </div>

                {/* Card 2: Ankit */}
                <div className="sticky top-36 bg-[#e0f2fe] border-[3px] border-[#111111] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] rounded-none rotate-[1deg] transition-all duration-100 flex flex-col md:flex-row gap-8 items-center min-h-[380px]">
                  <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
                    <img
                      src={ankitPhotoSrc}
                      alt="Ankit, PM 2 @ Microsoft"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                        PM 2 @ Microsoft
                      </span>
                      <span className="bg-white text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                        IIM B Alum
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#111111] mb-4">"I build enterprise AI products at Microsoft. Let me show you how to build real products, not just certificates."</h3>
                    <p className="text-base font-bold text-[#111111] leading-relaxed">
                      An alumnus of IIT Kanpur and IIM Bangalore, I've mentored 500+ aspiring PMs. In PM-X, we focus on technical depth, metrics, PRD portfolios, and systems thinking that hiring managers actually look for.
                    </p>
                    <p className="text-[#188ab2] font-extrabold text-sm uppercase tracking-wider mt-4">— Ankit, Founder & PM 2 @ Microsoft</p>
                  </div>
                </div>

                {/* Card 3: Pankaj */}
                <div className="sticky top-44 bg-[#fed7aa] border-[3px] border-[#111111] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] rounded-none rotate-[-0.5deg] transition-all duration-100 flex flex-col md:flex-row gap-8 items-center min-h-[380px] mb-12">
                  <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
                    <img
                      src={pankajPhotoSrc}
                      alt="Pankaj, Senior PM at ShopDeck"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                        SENIOR PM @ SHOPDECK
                      </span>
                      <span className="bg-white text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                        B2B + B2C
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#111111] mb-4">"I own merchant experience, profitability, and logistics. Let me help you turn business challenges into revenue-generating solutions."</h3>
                    <p className="text-base font-bold text-[#111111] leading-relaxed">
                      Owns merchant-experience, profitability, and logistics at ShopDeck, with 5+ years across SaaS, e-commerce, and mobility. Expert at turning business challenges into revenue-generating solutions for both B2B and B2C.
                    </p>
                    <p className="text-[#188ab2] font-extrabold text-sm uppercase tracking-wider mt-4">— Pankaj, Mentor & Senior PM @ ShopDeck</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
              Cohort{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                Curriculum
              </span>
            </h2>
            <p className="text-lg font-bold text-[#111111] mt-4">
              {userType === 'professional' 
                ? "Three core phases focused on hands-on PM skills." 
                : "Three core phases focused on cracking APM roles, mock cases, and portfolio design."}
            </p>
          </div>

          <div className="flex flex-col border-t-[3px] border-[#111111] select-none text-left">
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
                className="py-12 border-b-[3px] border-[#111111] flex flex-col md:flex-row gap-6 md:gap-16 items-start relative overflow-hidden"
              >
                {/* Large Background / Foreground Staggered Phase Number */}
                <div className="shrink-0 flex md:flex-col items-baseline md:items-start gap-2">
                  <span className="font-black text-6xl md:text-8xl tracking-tighter text-[#111111]/10 leading-none">0{i+1}</span>
                  <span className="font-extrabold text-xs tracking-widest text-[#188ab2] uppercase leading-none md:mt-2">PHASE 0{i+1}</span>
                </div>

                {/* Content Area */}
                <div className="grow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-xl md:text-2xl font-black text-[#111111] leading-tight">
                      {topic.title}
                    </h3>
                    <div className="inline-flex items-center gap-2 border-2 border-[#111111] bg-white px-3 py-0.5 rounded-full text-[10px] font-extrabold shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] shrink-0 self-start sm:self-center">
                      <span className={`w-2 h-2 rounded-full ${topic.dotColor} border border-[#111111]`}></span>
                      <span className="text-[#111111] uppercase tracking-wider">{topic.tag}</span>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-slate-600 leading-relaxed mt-4">
                    {topic.desc}
                  </p>
                </div>
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
      <section className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 items-start text-left">
            {/* Left Sticky Column */}
            <div className="md:w-1/3 md:sticky md:top-28">
              <h2 className="text-4xl md:text-5xl font-black text-[#111111] mb-6 leading-tight">
                Beyond the{' '}
                <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                  Curriculum
                </span>
              </h2>
              <p className="text-lg font-bold text-slate-500">What else is included in your fellowship — zero extra cost, zero fine print.</p>
            </div>

            {/* Right List Column (No outer boxes) */}
            <div className="md:w-2/3 flex flex-col gap-10 select-none">
              {[
                {
                  title: "Resume Transformation",
                  desc: "Live workshops to translate your engineering, design, or analytics background into impact-driven product outcomes. We rewrite your bullets to show ownership.",
                  icon: <FileText className="h-6 w-6 text-[#188ab2]" />
                },
                {
                  title: "Mock Interview Bank",
                  desc: "Access an exhaustive collection of 50+ real PM interview questions and structured model answers from elite tier-1 tech product teams.",
                  icon: <FolderArchive className="h-6 w-6 text-[#188ab2]" />
                },
                {
                  title: "The PM Toolstack",
                  desc: "Master industry-standard design, metrics, tracking, and prototyping tool suites including Figma, Mixpanel, Amplitude, Jira, and AI integration loops.",
                  icon: <Wrench className="h-6 w-6 text-[#188ab2]" />
                },
                {
                  title: "Community for Life",
                  desc: "Permanent access to the private StepSmart Slack channels, networking circles, mock matches, and direct alumni pipeline hubs.",
                  icon: <MessageSquare className="h-6 w-6 text-[#188ab2]" />
                }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex gap-6 items-start pb-8 border-b-2 border-[#111111]/10 last:border-b-0"
                >
                  <div className="shrink-0 w-12 h-12 bg-[#FFF3A7] border-[3px] border-[#111111] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#111111] mb-2">{item.title}</h3>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Join Section */}
      <section className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
              How to{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                join?
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
                title: "Message Us on WhatsApp",
                desc: "Drop us a message with your background and goals.",
                shadow: "shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]",
                tilt: "rotate-[2deg]",
                action: (
                  <div className="mt-4">
                    <a
                      href="https://wa.me/919920803517?text=Hi%2C%20I%27m%20interested%20in%20PM-X%20%E2%80%94%20here%27s%20my%20background%3A"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-[#188ab2] text-white border-2 border-[#111111] px-3 py-1 font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2.5px_2.5px_0px_0px_rgba(17,17,17,1)] transition-all cursor-pointer select-none"
                    >
                      CHAT WITH US →
                    </a>
                    <div className="mt-3 inline-block bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2 py-0.5 font-extrabold text-[8px] uppercase rotate-[-2deg] shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]">
                      REPLIES WITHIN A FEW HOURS / NO COMMITMENT
                    </div>
                  </div>
                )
              },
              {
                num: "03",
                title: "Get Decision",
                desc: "We confirm fit over WhatsApp and follow up with your application status and next steps.",
                shadow: "shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]",
                tilt: "rotate-[-1.5deg]"
              },
              {
                num: "04",
                title: "Batch Starts",
                desc: "Secure your slot. Onboarding details are shared over WhatsApp before the cohort begins.",
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

      {/* Testimonials */}
      <section className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-16 text-[#111111]">Testimonials</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
            {[
              { 
                name: "Nishtha", 
                cohort: "PM-X FIRST STEP", 
                shadow: "shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]",
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
                cohort: "PM-X ACCELERATOR", 
                shadow: "shadow-[8px_4px_0px_0px_rgba(17,17,17,1)]",
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
                cohort: "PM-X FIRST STEP", 
                shadow: "shadow-[4px_8px_0px_0px_rgba(17,17,17,1)]",
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
                <div className="mb-8 relative z-10">
                  <p className="text-[#111111] leading-relaxed text-lg font-bold">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder – swap src once images are ready */}
                  <div className="w-12 h-12 rounded-full border-[3px] border-[#111111] bg-[#F5F5F0] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] flex-shrink-0 overflow-hidden flex items-center justify-center">
                    <span className="text-[#111111] font-extrabold text-base select-none">
                      {t.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-extrabold text-[#111111]">{t.name}</div>
                    <div className="text-[10px] font-black uppercase text-[#188ab2] tracking-wider mt-0.5">{t.cohort}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
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
            {(userType === 'professional' ? [
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
            ] : [
              {
                q: "I have zero corporate experience. Can I still join this student program?",
                a: "Yes, this program is specifically built for students with zero experience. We help you design real PRDs, build tools hands-on, and simulate placements to bridge that gap."
              },
              {
                q: "What roles will this program prepare me for?",
                a: "It prepares you for APM (Associate Product Manager) roles, Product Analyst roles, and Product Management internships at tech companies."
              },
              {
                q: "What is the duration of the student cohort?",
                a: "The program runs for 8 weeks, with structured weekend live sessions, mid-week case evaluations, and interactive placement mock runs."
              },
              {
                q: "How does the referral system work?",
                a: "Our founders and mentors reference top-performing students directly to companies hiring fresh APMs. We also run resume-matching and referral workshops."
              }
            ]).map((faq, i) => (
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
      <section id="enroll" className="py-16 bg-[#FFFFFF] relative border-b-[3px] border-[#111111]">
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
              <h3 className="text-xl font-extrabold mb-2 text-[#111111]">{userType === 'professional' ? "Download Accelerator Brochure" : "Download First Step Brochure"}</h3>
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
              <h3 className="text-xl font-extrabold mb-2 text-[#111111]">{userType === 'professional' ? "Enroll for PM-X Accelerator" : "Enroll for PM-X First Step"}</h3>
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
                  {formIntent === 'brochure' ? 'Get Brochure Now' : (userType === 'professional' ? 'Join Accelerator Batch' : 'Join First Step Student Batch')}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FFFFFF] py-12 border-t-[3px] border-[#111111]">
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
                <li><Link to="/blog" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Blog</Link></li>
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

          {error && (
            <div className="space-y-2">
              <p className="text-red-500 text-sm font-bold">{error}</p>
              {error === 'Invalid email or password.' && (
                <div className="text-xs font-bold bg-[#FFF3A7] border-[3px] border-[#111111] p-3 shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] text-[#111111] leading-relaxed">
                  💡 <span className="underline">Tip</span>: You can Sign Up for a new local account, or log in with these seeded credentials:<br/>
                  • Email: <span className="font-mono bg-white px-1 border border-slate-300">admin@stepsmart.net</span><br/>
                  • Password: <span className="font-mono bg-white px-1 border border-slate-300">password</span>
                </div>
              )}
            </div>
          )}

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

const DEMO_BLOGS = [
  {
    id: "a-new-generation-studies-ai",
    title: "A New Generation Studies AI, Apple's Recipe for On-Device Models, GLM5.2 Tackles Open-Ended Problems",
    description: "The Batch News & Insights: \"Loop engineering\" is a hot buzzphrase after Boris Cherney (Claude Code's creator) and Peter...",
    content: "## Inside Claude Code and Boris Cherney's Design Philosophy\n\n\"Loop engineering\" is a hot buzzphrase after Boris Cherney (Claude Code's creator) and Peter discussed it recently. Loop engineering focuses on iterating on feedback cycles rapidly.\n\n### Apple's Recipe for On-Device Models\nApple's latest research reveals a highly optimized pipeline for running LLMs on-device, leveraging unified memory and model quantization.\n\n### GLM5.2 Tackles Open-Ended Problems\nThe GLM team released version 5.2, setting a new benchmark for open-ended reasoning and code execution capabilities.",
    imageUrl: "/blog-loops.jpg",
    date: "Jun 26, 2026",
    createdAt: "2026-06-26T12:00:00.000Z"
  },
  {
    id: "testing-mythos-and-fable",
    title: "Testing Mythos and Fable, Moving Beyond SWE-bench, Nvidia's Open Contender",
    description: "The Batch AI News and Insights: Over the last two weeks, both the U.S. Government and Anthropic took significant actions that...",
    content: "## Testing Mythos and Fable: The Path to Evaluation\n\nOver the last two weeks, both the U.S. Government and Anthropic took significant actions that highlight how evaluations are moving from research benchmarks to critical safety gates.\n\n### Moving Beyond SWE-bench\nStandard coding benchmarks are no longer sufficient. New evaluation frameworks are testing agents on multi-file changes and long-context logic.",
    imageUrl: "/blog-collab.jpg",
    date: "Jun 19, 2026",
    createdAt: "2026-06-19T12:00:00.000Z"
  },
  {
    id: "mythos-begets-fable",
    title: "Mythos Begets Fable, Cursor's Composer 2.5, Agents Building Agents",
    description: "The Batch AI News and Insights: If you haven't already, I encourage you to experiment with using AI agents not just to chat but to actuall...",
    content: "## Cursor's Composer 2.5: The Future of IDEs\n\nIf you haven't already, I encourage you to experiment with using AI agents not just to chat but to actually build applications.\n\n### Agents Building Agents\nWith the release of Cursor Composer 2.5, multi-file edits are becoming standard. We are entering an era of software creation where the prompt is the blueprint.",
    imageUrl: "/blog-editor.jpg",
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(
          'https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll',
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

    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xl font-extrabold mt-8 mb-3 text-[#111111]">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-extrabold mt-10 mb-4 border-b-[3px] border-[#111111] pb-2 text-[#111111]">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 class="text-3xl md:text-4xl font-extrabold mt-12 mb-6 text-[#111111] leading-tight">$1</h1>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<figure class="my-8 border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden bg-white"><img src="$2" alt="$1" class="max-w-full h-auto mx-auto" /><figcaption class="text-center text-xs font-bold text-[#111111] border-t-2 border-[#111111] py-2 bg-[#FFF3A7]">$1</figcaption></figure>');

    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-[#188ab2] hover:underline font-extrabold">$1</a>');

    html = html.replace(/\n\n/g, '</p><p class="mb-6 text-[#111111] leading-relaxed text-base font-bold">');
    html = '<p class="mb-6 text-[#111111] leading-relaxed text-base font-bold">' + html + '</p>';

    html = html.replace(/<p class=".*?"><\/p>/g, '');

    return html;
  };

  const currentPost = blogId ? displayBlogs.find(b => b.id === blogId) : null;

  // Single Post Detailed Reader View
  if (blogId) {
    if (loading) {
      return (
        <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center pt-20">
          <div className="h-10 w-10 border-[3px] border-[#111111] border-t-[#188ab2] animate-spin mb-4"></div>
          <p className="text-[#111111] font-bold text-sm">Loading post...</p>
        </div>
      );
    }
    
    if (!currentPost) {
      return (
        <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-extrabold text-[#111111] mb-4">Blog post not found</h2>
          <Link to="/blog" className="text-[#188ab2] font-extrabold underline underline-offset-4 decoration-2 decoration-[#188ab2]">Back to all posts</Link>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#111111] selection:bg-[#188ab2]/30">
        <div className="fixed top-0 z-50 w-full flex flex-col">
          <AnnouncementBanner />
          <nav className="w-full bg-[#FFFFFF] border-b-[3px] border-[#111111]">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
              <Logo toHome={true} />
              <div className="hidden md:flex items-center gap-8 text-sm font-extrabold text-[#111111]">
                <NavLink href="/#who-is-it-for">Who is it for?</NavLink>
                <NavLink href="https://wa.me/919920803517?text=Hi%2C%20I%27m%20interested%20in%20PM-X%20%E2%80%94%20here%27s%20my%20background%3A" target="_blank" rel="noreferrer">Chat 1:1</NavLink>
                <NavLink href="/#mentors">Mentors</NavLink>
                <Link to="/events" className="font-extrabold text-sm text-[#111111] hover:text-[#188ab2] transition-colors">Events</Link>
                <Link to="/blog" className="relative px-3 py-1.5 text-[#111111] font-extrabold text-sm select-none">
                  <span className="relative z-10">Blog</span>
                  <span className="absolute left-0 right-0 bottom-[-2px] h-1.5 bg-[#FFF3A7] z-0"></span>
                </Link>
                <a href="/learn" className="ml-2 px-5 py-2 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all select-none font-extrabold">Login</a>
                <Button variant="primary" onClick={() => navigate('/#enroll')}>
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
            <div className="md:hidden w-full bg-[#FFFFFF] border-b-[3px] border-[#111111] p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
              <a href="/#who-is-it-for" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Who is it for?</a>
              <a href="https://wa.me/919920803517?text=Hi%2C%20I%27m%20interested%20in%20PM-X%20%E2%80%94%20here%27s%20my%20background%3A" target="_blank" rel="noreferrer" className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Chat 1:1</a>
              <a href="/#mentors" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Mentors</a>
              <Link to="/events" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Events</Link>
              <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200 text-[#188ab2]">Blog</Link>
              <a href="/learn" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-6 py-2.5 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] font-extrabold transition-all">Login</a>
              <Button variant="primary" className="w-full" onClick={() => { setIsMenuOpen(false); navigate('/#enroll'); }}>Apply Now</Button>
            </div>
          )}
        </div>

        <main className="pt-36 pb-24 bg-[#FFFFFF]">
          <div className="container mx-auto px-6 max-w-3xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-[#188ab2] font-extrabold hover:underline underline-offset-4 decoration-2 decoration-[#188ab2] mb-8">
              <span className="text-lg">←</span> Back to all posts
            </Link>

            <article>
              <header className="mb-10">
                <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] text-xs font-extrabold px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] select-none uppercase tracking-wider mb-6">
                  {currentPost.date}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-[#111111] leading-tight mb-6">
                  {currentPost.title}
                </h1>
                <p className="text-lg text-[#111111] italic leading-relaxed border-l-4 border-[#111111] pl-4 py-1 font-bold">
                  {currentPost.description}
                </p>
              </header>

              {currentPost.imageUrl && (
                <div className="w-full h-80 md:h-[28rem] border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] overflow-hidden mb-12 bg-slate-100">
                  <img
                    src={currentPost.imageUrl}
                    alt={currentPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div 
                className="prose prose-slate max-w-none text-[#111111]"
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
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#111111] selection:bg-[#188ab2]/30">
      <div className="fixed top-0 z-50 w-full flex flex-col">
        <AnnouncementBanner />
        <nav className="w-full bg-[#FFFFFF] border-b-[3px] border-[#111111]">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Logo toHome={true} />
            <div className="hidden md:flex items-center gap-8 text-sm font-extrabold text-[#111111]">
              <NavLink href="/#who-is-it-for">Who is it for?</NavLink>
              <NavLink href="https://wa.me/919920803517?text=Hi%2C%20I%27m%20interested%20in%20PM-X%20%E2%80%94%20here%27s%20my%20background%3A" target="_blank" rel="noreferrer">Chat 1:1</NavLink>
              <NavLink href="/#mentors">Mentors</NavLink>
              <Link to="/events" className="font-extrabold text-sm text-[#111111] hover:text-[#188ab2] transition-colors">Events</Link>
              <Link to="/blog" className="relative px-3 py-1.5 text-[#111111] font-extrabold text-sm select-none">
                <span className="relative z-10">Blog</span>
                <span className="absolute left-0 right-0 bottom-[-2px] h-1.5 bg-[#FFF3A7] z-0"></span>
              </Link>
              <a href="/learn" className="ml-2 px-5 py-2 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all select-none font-extrabold">Login</a>
              <Button variant="primary" onClick={() => navigate('/#enroll')}>
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
          <div className="md:hidden w-full bg-[#FFFFFF] border-b-[3px] border-[#111111] p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
            <a href="/#who-is-it-for" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Who is it for?</a>
            <a href="https://wa.me/919920803517?text=Hi%2C%20I%27m%20interested%20in%20PM-X%20%E2%80%94%20here%27s%20my%20background%3A" target="_blank" rel="noreferrer" className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Chat 1:1</a>
            <a href="/#mentors" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Mentors</a>
            <Link to="/events" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Events</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200 text-[#188ab2]">Blog</Link>
            <a href="/learn" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-6 py-2.5 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] font-extrabold transition-all">Login</a>
            <Button variant="primary" className="w-full" onClick={() => { setIsMenuOpen(false); navigate('/#enroll'); }}>Apply Now</Button>
          </div>
        )}
      </div>

      {/* Blog Hero Section */}
      <section className="pt-40 pb-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-6 py-2 font-extrabold text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none mb-6">
            The StepSmart Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-[#111111] leading-tight">
            Resources & Insights for Aspiring PMs
          </h1>
          <p className="text-lg md:text-xl text-[#111111] max-w-2xl mx-auto leading-relaxed font-bold">
            Guides, case study deep-dives, and actionable frameworks to build your product management career without an MBA.
          </p>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="py-20 bg-[#FFFFFF]">
        <div className="container mx-auto px-6 max-w-6xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-10 w-10 border-[3px] border-[#111111] border-t-[#188ab2] animate-spin mb-4"></div>
              <p className="text-[#111111] font-bold text-sm">Loading insights...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-bold mb-2">{error}</p>
              <button onClick={() => window.location.reload()} className="text-xs text-[#188ab2] font-extrabold underline decoration-2 decoration-[#188ab2]">Retry</button>
            </div>
          ) : displayBlogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 font-bold mb-2">No blog posts available.</p>
              <p className="text-slate-400 text-sm font-bold">Check back later for fresh product strategy content.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.id}`}
                  className="bg-white border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all duration-100 flex flex-col group text-left"
                >
                  <div className="relative w-full h-56 border-b-[3px] border-[#111111] overflow-hidden bg-slate-100">
                    <img
                      src={blog.imageUrl || "/hero_image.png"}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <span className="bg-[#FFF3A7] border-2 border-[#111111] text-xs font-extrabold px-3 py-1 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] inline-block mb-4 uppercase tracking-wider self-start select-none">
                      {blog.date}
                    </span>
                    <h2 className="font-extrabold text-xl text-[#111111] leading-snug mb-3 group-hover:text-[#188ab2] transition-colors line-clamp-3">
                      {blog.title}
                    </h2>
                    <p className="text-[#111111] text-sm leading-relaxed flex-1 line-clamp-4 font-bold">
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
      <footer className="bg-[#FFFFFF] py-12 border-t-[3px] border-[#111111]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 mb-16 text-left">
            <div className="col-span-1">
              <Logo toHome={true} />
              <p className="text-[#111111] text-sm leading-relaxed max-w-xs mt-8 font-bold">
                Helping engineers and non-PMs break into Product Management without an MBA or IIT tag. Expert mentorship and real-world outcomes.
              </p>
            </div>
            <div>
              <h4 className="font-extrabold text-[#111111] mb-6">Quick Links</h4>
              <ul className="space-y-4 text-[#111111] text-sm font-bold">
                <li><a href="/#who-is-it-for" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Who is it for?</a></li>
                <li><a href="/#batch-details" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Batch Details</a></li>
                <li><a href="/#mentors" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Mentors</a></li>
                <li><Link to="/blog" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Blog</Link></li>
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
            <p className="text-[#111111] text-[10px] font-bold uppercase tracking-widest">© 2026 StepSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const HeroCarousel = () => {
  const slides = [
    "/hero-slide-1.jpg",
    "/hero-slide-2.jpg",
    "/hero-slide-3.jpg"
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[240px] md:h-[400px] overflow-hidden select-none flex items-center justify-center">
      {/* Slides Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {slides.map((image, i) => {
          let offset = i - activeIndex;
          if (offset < -1) offset += slides.length;
          if (offset > 1) offset -= slides.length;

          const isActive = offset === 0;
          const isLeft = offset === -1;
          const isRight = offset === 1;

          if (Math.abs(offset) > 1) return null;

          return (
            <div
              key={i}
              className={`absolute transition-all duration-700 ease-in-out w-[75%] md:w-[65%] aspect-video border-[3px] border-[#111111] bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] md:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] overflow-hidden ${
                isActive
                  ? "z-30 scale-100 opacity-100 translate-x-0"
                  : isLeft
                  ? "z-10 scale-75 md:scale-80 opacity-30 -translate-x-[42%] md:-translate-x-[45%] pointer-events-none filter brightness-50"
                  : isRight
                  ? "z-10 scale-75 md:scale-80 opacity-30 translate-x-[42%] md:translate-x-[45%] pointer-events-none filter brightness-50"
                  : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`Outcome slide ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

function PortalPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMobileLinkClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShareTrack = (trackPath: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const btn = e.currentTarget;
    const fullUrl = window.location.origin + trackPath;
    navigator.clipboard.writeText(fullUrl).then(() => {
      const originalContent = btn.innerHTML;
      btn.innerHTML = `<span class="text-green-600 font-extrabold text-[10px] uppercase">Copied!</span>`;
      setTimeout(() => {
        btn.innerHTML = originalContent;
      }, 2000);
    }).catch((err) => {
      console.error("Failed to copy url: ", err);
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#111111] selection:bg-[#188ab2]/30">
      {/* Header */}
      <div className="fixed top-0 z-50 w-full flex flex-col">
        <AnnouncementBanner />
        <nav className="w-full bg-[#FFFFFF] border-b-[3px] border-[#111111]">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Logo />
            <div className="hidden md:flex items-center gap-8 text-sm font-extrabold text-[#111111]">
              <NavLink href="#mentors">Mentors</NavLink>
              <Link to="/events" className="font-extrabold text-sm text-[#111111] hover:text-[#188ab2] transition-colors">Events</Link>
              <NavLink href="/blog">Blog</NavLink>
              <a href="/learn" className="ml-2 px-5 py-2 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all select-none font-extrabold">Login</a>
              <Button variant="primary" onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Cohorts
              </Button>
            </div>
            <button className="md:hidden p-2 border-[3px] border-[#111111] bg-[#FFFFFF]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6 text-[#111111]" /> : <Menu className="h-6 w-6 text-[#111111]" />}
            </button>
          </div>
        </nav>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden w-full bg-[#FFFFFF] border-b-[3px] border-[#111111] p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
            <a href="#mentors" onClick={(e) => handleMobileLinkClick(e, 'mentors')} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Mentors</a>
            <Link to="/events" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Events</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Blog</Link>
            <a href="/learn" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-6 py-2.5 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] font-extrabold transition-all">Login</a>
            <Button variant="primary" className="w-full" onClick={() => { setIsMenuOpen(false); document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore Cohorts</Button>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-8 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-[1.2] text-[#111111]">
            Stepsmart - Your path to{' '}
            <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-1 rotate-[-1.5deg] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] select-none">
              Product Management
            </span>{' '}
            guided by people who walked through it
          </h1>
          <p className="text-lg md:text-xl text-[#111111] mb-12 max-w-3xl mx-auto leading-relaxed font-bold">
            A live, cohort-based programmes where you learn through real case practice, structured feedback, and 1:1 guidance, not another casebook you read alone. Built for students prepping for placements and professionals ready to switch, from any background.
          </p>

          <div className="flex justify-center mb-16">
            <Button 
              variant="primary" 
              className="px-12 py-5 text-xl font-extrabold shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]"
              onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Cohort Programs ➜
            </Button>
          </div>

          {/* Hero Carousel */}
          <HeroCarousel />
        </div>
      </section>

      {/* Program Tracks Section */}
      <section id="programs" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
              Select Your{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                Cohort Track
              </span>
            </h2>
            <p className="text-lg font-bold text-[#111111] mt-4">We offer two distinct, highly specialized tracks tailored to your career stage.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 text-left">
            {/* Card 1: PM-X First Step (Students) */}
            <div className="bg-white border-[3px] border-[#111111] p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] rounded-none transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-between min-h-[350px]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b-2 border-slate-100">
                  <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-xs uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                    6 Weeks
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-[#111111] mb-4 leading-tight">PM-X FIRST STEP</h3>
                <p className="text-sm font-bold text-[#111111] leading-relaxed mb-8">
                  A cohort for final-year students who feel lost switching between random case books and YouTube videos, PM-X First Step is the structured 6-week path from "will I even get shortlisted" to placement-ready built around this season's actual interview process with guidance from expert mentors across industry.
                </p>
              </div>

              <div className="flex items-center justify-between border-t-2 border-slate-100 pt-6">
                <div className="w-12 h-12 rounded-full bg-[#FFF3A7] border-[3px] border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] flex items-center justify-center rotate-[-3deg] select-none shrink-0">
                  <GraduationCap className="w-6 h-6 text-[#111111] stroke-[2.5]" />
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/students"
                    className="inline-flex items-center justify-center px-6 py-2.5 font-extrabold border-[3px] border-[#111111] bg-[#188ab2] text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all duration-100 select-none cursor-pointer text-sm"
                  >
                    EXPLORE PROGRAM ↗
                  </Link>
                  <button
                    onClick={(e) => handleShareTrack("/students", e)}
                    className="border-[3px] border-[#111111] bg-white px-4 py-2.5 hover:bg-[#FFF3A7] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all duration-100 flex items-center justify-center cursor-pointer select-none"
                    title="Share Track Link"
                  >
                    <Share className="w-4 h-4 text-[#111111] stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Accelerator (Professionals) */}
            <div className="bg-white border-[3px] border-[#111111] p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] rounded-none transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-between min-h-[350px]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b-2 border-slate-100">
                  <span className="bg-[#e0f2fe] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-xs uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                    12 Weeks
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-[#111111] mb-4 leading-tight">PM-X ACCELERATOR</h3>
                <p className="text-sm font-bold text-[#111111] leading-relaxed mb-8">
                  A structured path for working professionals looking to break into Product Management built by people who made that switch themselves from data engineering, from unconventional paths and breaks down exactly how to translate your existing experience into a PM story that works.
                </p>
              </div>

              <div className="flex items-center justify-between border-t-2 border-slate-100 pt-6">
                <div className="w-12 h-12 rounded-full bg-[#e0f2fe] border-[3px] border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] flex items-center justify-center rotate-[3deg] select-none shrink-0">
                  <Briefcase className="w-6 h-6 text-[#111111] stroke-[2.5]" />
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/professionals"
                    className="inline-flex items-center justify-center px-6 py-2.5 font-extrabold border-[3px] border-[#111111] bg-[#188ab2] text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all duration-100 select-none cursor-pointer text-sm"
                  >
                    EXPLORE PROGRAM ↗
                  </Link>
                  <button
                    onClick={(e) => handleShareTrack("/professionals", e)}
                    className="border-[3px] border-[#111111] bg-white px-4 py-2.5 hover:bg-[#FFF3A7] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all duration-100 flex items-center justify-center cursor-pointer select-none"
                    title="Share Track Link"
                  >
                    <Share className="w-4 h-4 text-[#111111] stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section id="mentors" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <h2 className="text-4xl font-extrabold mb-16 text-[#111111]">Learn from Professionals</h2>
          <div className="flex flex-col gap-16 relative text-left">
            {/* Card 1: Sanket */}
            <div className="sticky top-28 bg-[#188ab2] border-[3px] border-[#111111] p-8 relative flex flex-col md:flex-row items-center md:items-start gap-8 text-left shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] rounded-none rotate-[-1deg] transition-all duration-100">
              <div className="w-28 h-28 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
                <img
                  src={sanketPhotoSrc}
                  alt="Sanket, Senior Product Manager at Mastercard"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    PM @ Mastercard
                  </span>
                  <span className="bg-white text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    50+ Mentored
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-1">Sanket</h3>
                <p className="text-[#FFF3A7] text-xs font-extrabold uppercase tracking-widest mb-4">
                  <a 
                    href="https://www.linkedin.com/in/sanketkumar-katore/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-center gap-1.5"
                  >
                    Senior PM - Mastercard
                    <svg className="h-3.5 w-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                </p>
                <p className="text-sm font-bold text-slate-100 leading-relaxed">
                  Expert in behavioral interviews and product sense frameworks, with deep specialization in scaling fintech products for the global market.
                </p>
              </div>
            </div>

            {/* Card 2: Ankit */}
            <div className="sticky top-36 bg-[#FFF3A7] border-[3px] border-[#111111] p-8 relative flex flex-col md:flex-row items-center md:items-start gap-8 text-left shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] rounded-none rotate-[1deg] transition-all duration-100">
              <div className="w-28 h-28 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
                <img
                  src={ankitPhotoSrc}
                  alt="Ankit, Product Manager at Microsoft"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    PM 2 @ Microsoft
                  </span>
                  <span className="bg-white text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    AI Specialist
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#111111] mb-1">Ankit</h3>
                <p className="text-[#188ab2] text-xs font-extrabold uppercase tracking-widest mb-4">
                  <a 
                    href="https://www.linkedin.com/in/ankit-surkar/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-center gap-1.5"
                  >
                    Product Manager 2 - Microsoft
                    <svg className="h-3.5 w-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                </p>
                <p className="text-sm font-bold text-[#111111] leading-relaxed">
                  Leads enterprise-grade AI product development at Microsoft. Expert at turning ambiguity into clarity for complex product strategy, with a focus on scaling AI-native products from 0 to 1.
                </p>
              </div>
            </div>

            {/* Card 3: Pankaj */}
            <div className="sticky top-44 bg-[#fed7aa] border-[3px] border-[#111111] p-8 relative flex flex-col md:flex-row items-center md:items-start gap-8 text-left shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] rounded-none rotate-[-0.5deg] transition-all duration-100 mb-12">
              <div className="w-28 h-28 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
                <img
                  src={pankajPhotoSrc}
                  alt="Pankaj, Senior Product Manager at ShopDeck"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    SENIOR PM @ SHOPDECK
                  </span>
                  <span className="bg-white text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    B2B + B2C
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#111111] mb-1">Pankaj</h3>
                <p className="text-[#188ab2] text-xs font-extrabold uppercase tracking-widest mb-4">
                  <a 
                    href="https://www.linkedin.com/in/pancage/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-center gap-1.5"
                  >
                    SENIOR PM - SHOPDECK
                    <svg className="h-3.5 w-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                </p>
                <p className="text-sm font-bold text-[#111111] leading-relaxed">
                  Owns merchant-experience, profitability, and logistics at ShopDeck, with 5+ years across SaaS, e-commerce, and mobility. Expert at turning business challenges into revenue-generating solutions for both B2B and B2C.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Join Section */}
      <section id="how-to-join" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
              How to{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                join?
              </span>
            </h2>
            <p className="text-lg font-bold text-[#111111] mt-4">No automated gateways, no automated rejections. We screen for alignment at every step.</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-8 items-stretch text-left mt-8">
            {[
              {
                num: "01",
                title: "Apply Online",
                desc: "Choose a cohort track and complete your application form.",
                shadow: "shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]",
                tilt: "rotate-[-1deg]"
              },
              {
                num: "02",
                title: "Message Us on WhatsApp",
                desc: "Drop us a message with your background and goals.",
                shadow: "shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]",
                tilt: "rotate-[2deg]",
                action: (
                  <div className="mt-4">
                    <a
                      href="https://wa.me/919920803517?text=Hi%2C%20I%27m%20interested%20in%20PM-X%20%E2%80%94%20here%27s%20my%20background%3A"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-[#188ab2] text-white border-2 border-[#111111] px-3 py-1 font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2.5px_2.5px_0px_0px_rgba(17,17,17,1)] transition-all cursor-pointer select-none"
                    >
                      CHAT WITH US →
                    </a>
                    <div className="mt-3 inline-block bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2 py-0.5 font-extrabold text-[8px] uppercase rotate-[-2deg] shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]">
                      REPLIES WITHIN A FEW HOURS / NO COMMITMENT
                    </div>
                  </div>
                )
              },
              {
                num: "03",
                title: "Get Decision",
                desc: "We confirm fit over WhatsApp and follow up with your application status and next steps.",
                shadow: "shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]",
                tilt: "rotate-[-1.5deg]"
              },
              {
                num: "04",
                title: "Batch Starts",
                desc: "Secure your slot. Onboarding details are shared over WhatsApp before the cohort begins.",
                shadow: "shadow-[6px_4px_0px_0px_rgba(17,17,17,1)]",
                tilt: "rotate-[1deg]"
              },
              {
                num: "05",
                title: "Lifetime Access",
                desc: "Join our active alumni network",
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

      {/* Testimonials */}
      <section className="py-16 bg-[var(--surface-peach)] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-16 text-[#111111]">
            Our Mentees'{' '}
            <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[-1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
              Testimonials
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
            {[
              { 
                name: "Nishtha", 
                cohort: "PM-X FIRST STEP", 
                shadow: "shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]",
                text: (
                  <span>
                    Ankit helped me break down vague case studies into actionable chunks helping me{' '}
                    <span className="bg-[#FFF3A7] border-2 border-[#111111] px-1.5 py-0.5 text-[#111111] font-extrabold inline-block rotate-[-1deg] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] select-none">
                      land the PM job
                    </span>
                  </span>
                )
              },
              { 
                name: "Gauri", 
                cohort: "PM-X ACCELERATOR", 
                shadow: "shadow-[8px_4px_0px_0px_rgba(17,17,17,1)]",
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
                cohort: "PM-X FIRST STEP", 
                shadow: "shadow-[4px_8px_0px_0px_rgba(17,17,17,1)]",
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
                <div className="mb-8 relative z-10">
                  <p className="text-[#111111] leading-relaxed text-lg font-bold">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-[3px] border-[#111111] bg-[#F5F5F0] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] flex-shrink-0 overflow-hidden flex items-center justify-center">
                    <span className="text-[#111111] font-extrabold text-base select-none">
                      {t.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-extrabold text-[#111111]">{t.name}</div>
                    <div className="text-[10px] font-black uppercase text-[#188ab2] tracking-wider mt-0.5">{t.cohort}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FFFFFF] py-12 border-t-[3px] border-[#111111]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 mb-16 text-left">
            <div className="col-span-1">
              <Logo />
              <p className="text-[#111111] text-sm leading-relaxed max-w-xs mt-8 font-bold">
                Helping engineers and college grads launch PM careers. Experienced mentorship and real-world outcomes.
              </p>
            </div>
            <div>
              <h4 className="font-extrabold text-[#111111] mb-6">Quick Links</h4>
              <ul className="space-y-4 text-[#111111] text-sm font-bold">
                <li><Link to="/professionals" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">For Professionals 💼</Link></li>
                <li><Link to="/students" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">For Students 🎓</Link></li>
                <li><a href="#mentors" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Mentors</a></li>
                <li><Link to="/blog" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold text-[#111111] mb-6">Join Our Community</h4>
              <p className="text-[#111111] text-sm mb-6 leading-relaxed font-bold">
                Stay updated with free resources, case study deep-dives, and networking opportunities.
              </p>
            </div>
          </div>
          <hr className="border-t-[3px] border-[#111111] mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#111111] text-[10px] font-bold uppercase tracking-widest">© 2026 StepSmart. All rights reserved.</p>
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

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PortalPage />} />
        <Route path="/professionals" element={<ProfessionalsLandingPage />} />
        <Route path="/students" element={<StudentsLandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:blogId" element={<BlogPage />} />
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
