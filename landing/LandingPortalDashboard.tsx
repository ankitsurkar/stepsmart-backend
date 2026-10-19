import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Briefcase,
  ClipboardList,
  HelpCircle,
  FolderArchive,
  Clock,
  User,
  LogOut,
  Lock,
  Flame,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Calendar,
  Send,
  MessageSquare,
  Award,
  Video,
  FileText,
  Users
} from 'lucide-react';
import { PmGymBrutalism } from './PmGymBrutalism';

export const WHATSAPP_BUSINESS_URL = "https://wa.me/message/GH5C7YLAYIEHN1";

export type PortalTab =
  | 'dashboard'
  | 'courses'
  | 'jobs'
  | 'assignments'
  | 'interviews'
  | 'resources'
  | 'sessions'
  | 'profile';

export type CohortTrack = 'accelerator' | 'first-step';

interface CourseModule {
  week: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  topics: string[];
}

export const ACCELERATOR_MODULES: CourseModule[] = [
  {
    week: "Week 0",
    title: "Profile Repositioning & PM Mindset Transition",
    category: "Foundation",
    duration: "3 hrs",
    description: "Translate your engineering, consulting, or analytics background into a compelling Product Management story.",
    topics: ["Resume rewriting for PM roles", "LinkedIn optimization", "Framing past achievements as product impact"]
  },
  {
    week: "Week 1",
    title: "Product Fundamentals & Problem vs. Solution Space",
    category: "Product Sense",
    duration: "4 hrs",
    description: "Learn how senior PMs distinguish user pain points from superficial feature requests and map customer journeys.",
    topics: ["Problem space discovery", "Jobs to be Done (JTBD)", "User personas & journey mapping"]
  },
  {
    week: "Week 2",
    title: "User Research & Market Validation",
    category: "Discovery",
    duration: "4 hrs",
    description: "Conduct high-signal user interviews without asking leading questions. Synthesize user quotes into actionable themes.",
    topics: ["Mom Test principles", "Competitor matrix breakdown", "TAM/SAM/SOM sizing"]
  },
  {
    week: "Week 3",
    title: "Product Strategy, Moats & Business Growth",
    category: "Strategy",
    duration: "4.5 hrs",
    description: "Build sustainable competitive advantages, examine network effects, and model product-led growth (PLG) loops.",
    topics: ["Hamilton Helmer's 7 Powers", "Retention curves & cohorts", "Monetization & pricing models"]
  },
  {
    week: "Week 4",
    title: "Metrics, North Star & Root Cause Analysis (RCA)",
    category: "Analytics",
    duration: "5 hrs",
    description: "Master the metrics that drive product decisions. Structure end-to-end RCAs for real drops in conversion or revenue.",
    topics: ["North Star vs Guardrail metrics", "AARRR pirate metrics", "Live 7-step RCA framework"]
  },
  {
    week: "Week 5",
    title: "PRD Writing & Technical Architecture for PMs",
    category: "Execution",
    duration: "4.5 hrs",
    description: "Write production-ready PRDs that engineers love. Understand APIs, caching, data schemas, and edge case specifications.",
    topics: ["PRD templates & epics", "REST vs GraphQL", "Database schemas & latency trade-offs"]
  },
  {
    week: "Week 6",
    title: "Agile Execution & Stakeholder Management",
    category: "Operations",
    duration: "4 hrs",
    description: "Run sprint planning, manage trade-offs between tech debt and feature launches, and say 'no' effectively.",
    topics: ["Sprint cadences", "Backlog grooming with RICE", "Managing designer & engineering dynamics"]
  },
  {
    week: "Week 7",
    title: "Go-To-Market (GTM) Strategy & Product Launches",
    category: "GTM",
    duration: "4 hrs",
    description: "Plan zero-to-one launches, create positioning playbooks, run beta pilots, and instrument A/B experiments.",
    topics: ["Feature flags & rollouts", "GTM positioning statements", "Launch checklists"]
  },
  {
    week: "Week 8",
    title: "Behavioral & Leadership Rounds for PMs",
    category: "Interviews",
    duration: "4.5 hrs",
    description: "Structure high-scoring STAR answers on stakeholder conflict, failure, product pivots, and cross-functional leadership.",
    topics: ["STAR methodology", "Influence without authority", "Mastercard & Microsoft loop breakdowns"]
  }
];

export const FIRST_STEP_MODULES: CourseModule[] = [
  {
    week: "Week 1",
    title: "Breaking Down the APM Campus Placement Process",
    category: "Campus Strategy",
    duration: "3 hrs",
    description: "Understand shortlisting criteria, deck assignments, and interview rounds for top companies hiring at premier colleges.",
    topics: ["APM hiring rubric", "Shortlist mechanics", "Past year placement trends"]
  },
  {
    week: "Week 2",
    title: "Product Design & GTM Case Study Frameworks",
    category: "Case Studies",
    duration: "4 hrs",
    description: "Solve popular campus product design questions (e.g. Design an ATM for the blind, Design Netflix for kids).",
    topics: ["CIRCLES framework", "User segmentation", "Prioritization matrices"]
  },
  {
    week: "Week 3",
    title: "Guesstimates & Analytical Problem Solving",
    category: "Analytics",
    duration: "4 hrs",
    description: "Master market sizing and guesstimates step-by-step with sanity checks and top-down vs bottom-up approaches.",
    topics: ["Population filtering", "Supply-side vs demand-side", "Revenue estimation formulas"]
  },
  {
    week: "Week 4",
    title: "Root Cause Analysis (RCA) & Product Metrics",
    category: "Execution",
    duration: "4 hrs",
    description: "Solve real-world diagnostic problems: 'Blinkit 10-min delivery failure rates rose 8%' — locate root causes systematically.",
    topics: ["Funnel drop-off diagnosis", "Internal vs external factor trees", "Metrics guardrails"]
  },
  {
    week: "Week 5",
    title: "Deck Assignments & Portfolio PRD Construction",
    category: "Assignments",
    duration: "4.5 hrs",
    description: "Build an end-to-end Product Teardown and PRD presentation deck that wins shortlists for campus hiring rounds.",
    topics: ["10-slide deck structure", "Visual wireframing", "Presenting to PM panels"]
  },
  {
    week: "Week 6",
    title: "Mock Interview Loops & Live Placement Preparation",
    category: "Placement Loops",
    duration: "4 hrs",
    description: "Live 1:1 peer and mentor mock rounds simulating real final interview panel rounds with instant actionable feedback.",
    topics: ["Behavioral questions", "Live whiteboard sense checks", "Negotiating APM offers"]
  }
];

interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  ctc: string;
  batch: string;
  tags: string[];
}

export const SAMPLE_PM_JOBS: JobItem[] = [
  {
    id: "job-1",
    title: "Associate Product Manager (APM)",
    company: "Swiggy",
    location: "Bengaluru, India",
    ctc: "₹18 – 24 LPA",
    batch: "2024 / 2025 / 2026",
    tags: ["Hyperlocal", "Logistics", "Consumer Tech"]
  },
  {
    id: "job-2",
    title: "Product Manager 1 — Growth & Checkout",
    company: "Razorpay",
    location: "Bengaluru (Hybrid)",
    ctc: "₹22 – 30 LPA",
    batch: "0 - 2 yrs exp",
    tags: ["Fintech", "Payment Gateways", "APIs"]
  },
  {
    id: "job-3",
    title: "Associate Product Manager",
    company: "Flipkart",
    location: "Bengaluru, India",
    ctc: "₹20 – 28 LPA",
    batch: "Campus & Lateral",
    tags: ["E-Commerce", "Search & Discovery"]
  },
  {
    id: "job-4",
    title: "Product Analyst / APM",
    company: "Zomato & Blinkit",
    location: "Gurugram, India",
    ctc: "₹18 – 26 LPA",
    batch: "Immediate",
    tags: ["Quick Commerce", "Funnels & RCA"]
  },
  {
    id: "job-5",
    title: "Product Manager — Core Platform",
    company: "CRED",
    location: "Bengaluru, India",
    ctc: "₹24 – 32 LPA",
    batch: "1 - 3 yrs exp",
    tags: ["Rewards", "Fintech", "High Scale"]
  },
  {
    id: "job-6",
    title: "Associate Product Manager (GTM)",
    company: "Meesho",
    location: "Bengaluru, India",
    ctc: "₹18 – 25 LPA",
    batch: "Open",
    tags: ["Social Commerce", "Tier 2/3 Markets"]
  }
];

export function LandingPortalDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PortalTab>('dashboard');
  const [selectedCohort, setSelectedCohort] = useState<CohortTrack>('accelerator');
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [upgradeContext, setUpgradeContext] = useState<{ title: string; desc: string }>({
    title: "Unlock PM-X Accelerator Cohort",
    desc: "Get live classes from Microsoft & Mastercard PMs, personalized resume reviews, and verified interview referrals."
  });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Read student info from session
  const [userEmail, setUserEmail] = useState<string>('learner@stepsmart.net');
  const [userName, setUserName] = useState<string>('Learner');

  useEffect(() => {
    try {
      const email = localStorage.getItem('pmx_demo_auth_session') || localStorage.getItem('stepsmart_portal_session');
      if (email) {
        setUserEmail(email);
        const demoUsers = JSON.parse(localStorage.getItem('pmx_demo_users') || '[]');
        const matched = demoUsers.find((u: any) => u.email === email);
        if (matched && matched.fullName) {
          setUserName(matched.fullName);
        } else {
          const prefix = email.split('@')[0];
          setUserName(prefix.charAt(0).toUpperCase() + prefix.slice(1));
        }
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const handleOpenUpgrade = (title: string, desc: string) => {
    setUpgradeContext({ title, desc });
    setShowUpgradeModal(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('pmx_demo_auth_session');
      localStorage.removeItem('stepsmart_portal_session');
    } catch (e) {
      // Ignored
    }
    navigate('/');
  };

  const getWhatsAppChatUrl = (reason?: string) => {
    const text = reason
      ? `Hi StepSmart Team! I am on the student portal and I want to unlock: "${reason}". Please share enrollment details and next batch dates.`
      : `Hi StepSmart Team! I am exploring the StepSmart portal and want to enroll in the ${selectedCohort === 'accelerator' ? 'PM-X Accelerator' : 'PM-X First Step'} cohort. Could you please share the curriculum and batch details?`;
    return `${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#111111] flex flex-col select-none">
      {/* ─── Top Brand & Navigation Header ─── */}
      <header className="sticky top-0 z-40 bg-white border-b-[3px] border-[#111111] shadow-[0px_4px_0px_0px_rgba(17,17,17,1)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          
          {/* Left Brand & Track Selector */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 border-[2px] border-[#111111] bg-white cursor-pointer"
            >
              {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <img src="/stepsmart-logo.webp" alt="StepSmart" className="h-9 w-auto object-contain" />
              <span className="hidden sm:inline-block font-black text-sm uppercase bg-[#FFF3A7] px-2 py-0.5 border-2 border-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                Portal
              </span>
            </Link>

            {/* Track Switcher Dropdown */}
            <div className="hidden md:flex items-center gap-2 border-[2px] border-[#111111] px-3 py-1 bg-[#F8FAFC]">
              <span className="text-[10px] font-black uppercase text-slate-500">Track:</span>
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value as CohortTrack)}
                className="bg-transparent font-black text-xs text-[#111111] outline-none cursor-pointer"
              >
                <option value="accelerator">PM-X Accelerator (Professionals)</option>
                <option value="first-step">PM-X First Step (Students & Placements)</option>
              </select>
            </div>
          </div>

          {/* Right User Bar & CTA */}
          <div className="flex items-center gap-3">
            {/* Quick WhatsApp Admissions Contact */}
            <a
              href={getWhatsAppChatUrl("Live Admissions")}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF3A7] hover:bg-[#FDE047] text-[#111111] border-[2px] border-[#111111] font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5 text-[#065F46]" />
              <span>Ask Admissions</span>
            </a>

            {/* Profile Dropdown / Logout */}
            <div className="flex items-center gap-2 border-[2px] border-[#111111] p-1.5 bg-white shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
              <div className="w-7 h-7 bg-[#0f6f8f] text-white flex items-center justify-center font-black text-xs border border-[#111111]">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden xl:block text-left pr-2">
                <span className="block text-xs font-black leading-none">{userName}</span>
                <span className="text-[10px] font-bold text-slate-500 leading-none">Free Portal Access</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="p-1 hover:text-red-600 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Body Layout: Sidebar + Main Content ─── */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex items-start">
        
        {/* ─── Left Sidebar Navigation ─── */}
        <aside
          className={`w-64 xl:w-72 shrink-0 bg-white border-r-[3px] border-[#111111] min-h-[calc(100vh-4.5rem)] p-4 space-y-6 text-left select-none transition-all duration-200 z-30 ${
            isMobileNavOpen
              ? 'fixed inset-y-18 left-0 shadow-2xl block bg-white'
              : 'hidden lg:block'
          }`}
        >
          {/* Track Switcher (Mobile) */}
          <div className="md:hidden border-2 border-[#111111] p-2 bg-[#F8FAFC]">
            <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Active Track:</span>
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value as CohortTrack)}
              className="w-full bg-white border border-[#111111] p-1 text-xs font-black"
            >
              <option value="accelerator">PM-X Accelerator</option>
              <option value="first-step">PM-X First Step</option>
            </select>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
              Portal Core
            </span>

            {/* 1. Home / PM Gym (UNLOCKED) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('dashboard');
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 border-[2px] transition-all cursor-pointer font-black text-xs uppercase ${
                activeTab === 'dashboard'
                  ? 'bg-[#0f6f8f] text-white border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] translate-x-[2px]'
                  : 'bg-white text-[#111111] border-transparent hover:border-[#111111] hover:bg-[#FFF3A7]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="h-4 w-4" />
                <span>Home & PM Gym</span>
              </div>
              <span className="bg-[#D1FAE5] text-[#065F46] border border-[#111111] px-1.5 py-0.5 text-[9px] font-black">
                Active
              </span>
            </button>

            {/* 2. Courses (PREVIEW) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('courses');
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 border-[2px] transition-all cursor-pointer font-black text-xs uppercase ${
                activeTab === 'courses'
                  ? 'bg-[#0f6f8f] text-white border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] translate-x-[2px]'
                  : 'bg-white text-[#111111] border-transparent hover:border-[#111111] hover:bg-[#FFF3A7]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-4 w-4" />
                <span>Courses Syllabus</span>
              </div>
              <span className="bg-[#E0F2FE] text-[#0369A1] border border-[#111111] px-1.5 py-0.5 text-[9px] font-black">
                Preview
              </span>
            </button>

            {/* 3. PM Jobs (LOCKED) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('jobs');
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 border-[2px] transition-all cursor-pointer font-black text-xs uppercase ${
                activeTab === 'jobs'
                  ? 'bg-[#0f6f8f] text-white border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] translate-x-[2px]'
                  : 'bg-white text-[#111111] border-transparent hover:border-[#111111] hover:bg-[#FFF3A7]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="h-4 w-4" />
                <span>PM Jobs Board</span>
              </div>
              <Lock className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* 4. Assignments (LOCKED) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('assignments');
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 border-[2px] transition-all cursor-pointer font-black text-xs uppercase ${
                activeTab === 'assignments'
                  ? 'bg-[#0f6f8f] text-white border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] translate-x-[2px]'
                  : 'bg-white text-[#111111] border-transparent hover:border-[#111111] hover:bg-[#FFF3A7]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ClipboardList className="h-4 w-4" />
                <span>Assignments & PRDs</span>
              </div>
              <Lock className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* 5. Mock Interviews (LOCKED) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('interviews');
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 border-[2px] transition-all cursor-pointer font-black text-xs uppercase ${
                activeTab === 'interviews'
                  ? 'bg-[#0f6f8f] text-white border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] translate-x-[2px]'
                  : 'bg-white text-[#111111] border-transparent hover:border-[#111111] hover:bg-[#FFF3A7]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4" />
                <span>Mock Interviews</span>
              </div>
              <Lock className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* 6. Cohort Resources (LOCKED) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('resources');
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 border-[2px] transition-all cursor-pointer font-black text-xs uppercase ${
                activeTab === 'resources'
                  ? 'bg-[#0f6f8f] text-white border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] translate-x-[2px]'
                  : 'bg-white text-[#111111] border-transparent hover:border-[#111111] hover:bg-[#FFF3A7]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderArchive className="h-4 w-4" />
                <span>Cohort Vault</span>
              </div>
              <Lock className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* 7. Peer Sessions (LOCKED) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('sessions');
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 border-[2px] transition-all cursor-pointer font-black text-xs uppercase ${
                activeTab === 'sessions'
                  ? 'bg-[#0f6f8f] text-white border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] translate-x-[2px]'
                  : 'bg-white text-[#111111] border-transparent hover:border-[#111111] hover:bg-[#FFF3A7]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4" />
                <span>Peer Sessions</span>
              </div>
              <Lock className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>

          {/* Upgrade Banner in Sidebar */}
          <div className="border-[3px] border-[#111111] p-4 bg-[#FFF3A7] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-[#111111] text-white text-[9px] font-black px-1.5 py-0.5 uppercase">
                StepSmart Cohorts
              </span>
            </div>
            <h4 className="font-black text-xs uppercase leading-snug">
              Unlock All 8 Weeks & 1:1 Mentorship
            </h4>
            <p className="text-[11px] font-bold text-slate-700 leading-snug">
              Get live weekly classes with Microsoft & Mastercard PMs, peer mock rooms, and direct tech referrals.
            </p>
            <a
              href={getWhatsAppChatUrl("Full Cohort Upgrade")}
              target="_blank"
              rel="noreferrer"
              className="block text-center py-2 bg-[#0f6f8f] hover:bg-[#188ab2] text-white border-[2px] border-[#111111] font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all cursor-pointer"
            >
              Enroll on WhatsApp ➜
            </a>
          </div>
        </aside>

        {/* ─── Main Content Display ─── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          
          {/* TAB 1: HOME (PM GYM + COHORT OVERVIEW) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Learner Greeting & Status Card */}
              <div className="bg-white border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 mb-1">
                    <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 text-[10px] font-black uppercase">
                      Cohort Track: {selectedCohort === 'accelerator' ? 'PM-X Accelerator' : 'PM-X First Step'}
                    </span>
                    <span className="bg-[#E0F2FE] text-[#0369A1] border-2 border-[#111111] px-2 py-0.5 text-[10px] font-black uppercase">
                      Visitor Access
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#111111]">
                    Welcome, <span className="bg-[#FFF3A7] px-2 border border-[#111111]">{userName}</span>!
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-slate-600">
                    Your daily PM Gym is active below. Solve 1 question every day to compound your product intuition.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenUpgrade("Full Cohort Access", "Join the live cohort to unlock all video lectures, 1:1 PRD reviews, and interview referrals.")}
                    className="px-5 py-2.5 bg-[#0f6f8f] hover:bg-[#188ab2] text-white border-[3px] border-[#111111] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                  >
                    Unlock Full Cohort 🔒
                  </button>
                </div>
              </div>

              {/* Central Unlocked Feature: PM Gym */}
              <div className="space-y-3">
                <PmGymBrutalism />
              </div>

              {/* Course Catalog Spotlight & Lock Status */}
              <div className="bg-white border-[3px] border-[#111111] p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#111111] pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      StepSmart Curriculum
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-[#111111]">
                      {selectedCohort === 'accelerator' ? 'PM-X Accelerator Syllabus (8-12 Weeks)' : 'PM-X First Step Placement Track (6 Weeks)'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('courses')}
                    className="self-start sm:self-auto px-4 py-2 bg-[#FFF3A7] border-2 border-[#111111] font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-[#FDE047] cursor-pointer"
                  >
                    View All Modules ➜
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(selectedCohort === 'accelerator' ? ACCELERATOR_MODULES.slice(0, 3) : FIRST_STEP_MODULES.slice(0, 3)).map((mod, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleOpenUpgrade(mod.title, `Unlock the complete ${mod.week} lecture modules and homework reviews on WhatsApp.`)}
                      className="border-[2px] border-[#111111] p-4 bg-[#F8FAFC] hover:bg-white transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-between group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase bg-white border border-[#111111] px-1.5 py-0.5">
                            {mod.week}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5">
                            <Lock className="h-3 w-3" /> Locked
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-[#111111] group-hover:text-[#0f6f8f] transition-colors leading-snug">
                          {mod.title}
                        </h4>
                        <p className="text-xs font-bold text-slate-600 line-clamp-2">
                          {mod.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-black text-[#0f6f8f]">
                        <span>Unlock Module</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSES (FULL SYLLABUS & PREVIEWS) */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-[#FFFFFF] border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 mb-2">
                      <span className="bg-[#FFF3A7] border-2 border-[#111111] px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                        Cohort Curriculum
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#111111]">
                      {selectedCohort === 'accelerator' ? 'PM-X Accelerator (Working Professionals)' : 'PM-X First Step (College Students)'}
                    </h2>
                    <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 max-w-2xl">
                      Every module is taught live by Product Managers from Microsoft, Mastercard, and ShopDeck. Explore the week-by-week roadmap below.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCohort('accelerator')}
                      className={`px-3.5 py-2 border-[2px] border-[#111111] text-xs font-black uppercase transition-all cursor-pointer ${
                        selectedCohort === 'accelerator' ? 'bg-[#0f6f8f] text-white shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]' : 'bg-white'
                      }`}
                    >
                      Accelerator (8-12 Wks)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCohort('first-step')}
                      className={`px-3.5 py-2 border-[2px] border-[#111111] text-xs font-black uppercase transition-all cursor-pointer ${
                        selectedCohort === 'first-step' ? 'bg-[#0f6f8f] text-white shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]' : 'bg-white'
                      }`}
                    >
                      First Step (6 Wks)
                    </button>
                  </div>
                </div>
              </div>

              {/* Module List */}
              <div className="space-y-4">
                {(selectedCohort === 'accelerator' ? ACCELERATOR_MODULES : FIRST_STEP_MODULES).map((mod, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-[3px] border-[#111111] p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#FFF3A7] border-2 border-[#111111] px-2.5 py-0.5 text-xs font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                          {mod.week}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-[#111111]">
                          {mod.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">{mod.duration}</span>
                        <span className="bg-[#F8FAFC] border border-slate-300 text-[10px] font-black uppercase px-2 py-0.5">
                          {mod.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
                      {mod.description}
                    </p>

                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Included in this module:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {mod.topics.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-xs font-bold bg-[#F8FAFC] border border-[#111111] px-2.5 py-1 text-slate-800"
                          >
                            ✓ {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Lock Trigger */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-amber-600" /> Live recorded classes, decks, and assignments are locked for this cohort.
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenUpgrade(mod.title, `Unlock full live classes, PRD teardowns, and assignments for ${mod.week}.`)}
                        className="px-4 py-2 bg-[#0f6f8f] hover:bg-[#188ab2] text-white border-[2px] border-[#111111] font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] cursor-pointer"
                      >
                        Enroll to Unlock Module ➜
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PM JOBS (LOCKED) */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-[#FFF3A7] border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#111111] text-white text-[10px] font-black px-2 py-0.5 uppercase">
                    Cohort Privilege
                  </span>
                  <span className="bg-[#FEE2E2] text-[#991B1B] border border-[#111111] text-[10px] font-black px-2 py-0.5 uppercase">
                    🔒 Direct Referrals Locked
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111111]">
                  StepSmart PM Opportunity Board
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-700 max-w-2xl">
                  We partner directly with high-growth tech startups and unicorns to source verified PM openings with mentor recommendations.
                </p>
              </div>

              {/* Jobs List */}
              <div className="grid md:grid-cols-2 gap-4">
                {SAMPLE_PM_JOBS.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border-[3px] border-[#111111] p-5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-black text-xs text-[#0f6f8f] uppercase bg-[#0f6f8f]/10 border border-[#0f6f8f] px-2 py-0.5">
                          {job.company}
                        </span>
                        <span className="text-xs font-black text-[#065F46] bg-[#D1FAE5] border border-[#065F46] px-2 py-0.5">
                          {job.ctc}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-[#111111]">{job.title}</h4>
                      <p className="text-xs font-bold text-slate-500 mt-1">📍 {job.location} • Batch: {job.batch}</p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-bold bg-[#F8FAFC] border border-slate-300 px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-amber-700 flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Mentor Referral Gated
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenUpgrade(`PM Job Referral: ${job.company}`, `Unlock direct mentor referral and resume submission for ${job.title} at ${job.company}.`)}
                        className="px-3.5 py-1.5 bg-[#0f6f8f] text-white border-[2px] border-[#111111] text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-[#188ab2] cursor-pointer"
                      >
                        Apply via Cohort ➜
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ASSIGNMENTS (LOCKED) */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="bg-white border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] space-y-3">
                <span className="bg-[#FFF3A7] border-2 border-[#111111] px-2.5 py-0.5 text-xs font-black uppercase">
                  Portfolio Assignments
                </span>
                <h2 className="text-2xl font-black text-[#111111]">
                  Weekly PRD Teardowns & Real-World Assignments
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-2xl">
                  Cohort students build 4 full-length portfolio artifacts reviewed line-by-line by working PMs before presenting to hiring panels.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Week 1: Swiggy Instamart Cold Start Discovery", deliverable: "1-Page Problem Statement & JTBD Mapping" },
                  { title: "Week 3: Razorpay Payment Failure RCA Diagnosis", deliverable: "Metric Tree & Diagnostic Decision Matrix" },
                  { title: "Week 5: Full Product Requirements Document (PRD)", deliverable: "Complete Epic, Functional Specs & Edge Cases" },
                  { title: "Week 7: 10-Slide Campus Placement Deck", deliverable: "Competitive Teardown & Strategic Proposal Deck" }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-[3px] border-[#111111] p-5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                        Deliverable: {item.deliverable}
                      </span>
                      <h4 className="text-base font-black text-[#111111]">{item.title}</h4>
                      <span className="text-xs font-bold text-amber-700 flex items-center gap-1 mt-1">
                        <Lock className="h-3 w-3" /> Submissions & Mentor Grading Locked
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenUpgrade(item.title, "Unlock 1:1 rubric feedback and sample winning PRD submissions from enrolled cohort students.")}
                      className="px-4 py-2 bg-[#0f6f8f] hover:bg-[#188ab2] text-white border-[2px] border-[#111111] font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] shrink-0 cursor-pointer"
                    >
                      Unlock Assignment ➜
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MOCK INTERVIEWS (LOCKED) */}
          {activeTab === 'interviews' && (
            <div className="space-y-6">
              <div className="bg-[#FFF3A7] border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] space-y-3">
                <span className="bg-[#111111] text-white px-2.5 py-0.5 text-xs font-black uppercase">
                  1:1 Live Practice
                </span>
                <h2 className="text-2xl font-black text-[#111111]">
                  Mock PM Interviews with Industry Mentors
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-700 max-w-2xl">
                  Simulate high-pressure product design, behavioral, and analytical interviews with working PMs from Microsoft and Mastercard.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { loop: "Product Sense & Design", desc: "Design a new consumer feature from scratch, frame personas, and prioritize tradeoffs." },
                  { loop: "Metrics & Root Cause Analysis", desc: "Solve conversion drops, set North Star metrics, and explain metric trade-offs." },
                  { loop: "Behavioral & Leadership", desc: "STAR framework responses on conflict resolution, saying no to leadership, and past failures." },
                  { loop: "Technical & System Design", desc: "API architecture, database schemas, scaling, and communicating with technical leads." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border-[3px] border-[#111111] p-5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] space-y-3">
                    <h4 className="font-black text-base text-[#111111]">{item.loop}</h4>
                    <p className="text-xs font-bold text-slate-600">{item.desc}</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Cohort Locked
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenUpgrade(`Mock Interview: ${item.loop}`, "Book live 1:1 mock interview slots with working PM mentors.")}
                        className="px-3 py-1.5 bg-[#0f6f8f] text-white border-[2px] border-[#111111] text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] cursor-pointer"
                      >
                        Book via Cohort ➜
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: COHORT RESOURCES (LOCKED VAULT) */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="bg-white border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] space-y-3">
                <span className="bg-[#FFF3A7] border-2 border-[#111111] px-2.5 py-0.5 text-xs font-black uppercase">
                  StepSmart Vault
                </span>
                <h2 className="text-2xl font-black text-[#111111]">
                  Curated PM Interview Banks & Templates
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-2xl">
                  Access 100+ real interview case studies, company question banks, and PRD specifications from Microsoft, Flipkart, and Swiggy.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { name: "StepSmart PRD Master Template (Figma + Notion)", type: "Specification" },
                  { name: "100+ Indian Tech PM Interview Questions Bank", type: "Question Bank" },
                  { name: "Top 25 Product Metrics Cheat Sheet", type: "Framework" },
                  { name: "Winning Campus Placement Slide Decks (IIT/IIM)", type: "Portfolio" },
                  { name: "Behavioral Story Bank Template (STAR)", type: "HR & Leadership" },
                  { name: "Technical PM Cheat Sheet: APIs, Schemas & Microservices", type: "Tech Spec" }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-[3px] border-[#111111] p-5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">{item.type}</span>
                      <h4 className="font-black text-sm text-[#111111]">{item.name}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenUpgrade(item.name, "Download full production-ready templates and verified case study banks.")}
                      className="w-full py-2 bg-[#F8FAFC] hover:bg-[#FFF3A7] border-[2px] border-[#111111] font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="h-3.5 w-3.5 text-slate-600" /> Unlock Resource
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PEER SESSIONS (LOCKED) */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="bg-[#FFF3A7] border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] space-y-3">
                <span className="bg-[#111111] text-white px-2.5 py-0.5 text-xs font-black uppercase">
                  Community Practice
                </span>
                <h2 className="text-2xl font-black text-[#111111]">
                  Peer-to-Peer Mock Practice Pods
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-700 max-w-2xl">
                  Practice live with peers across cohorts. Pair up for mock interview drills, deck teardowns, and accountability pods.
                </p>
              </div>

              <div className="border-[3px] border-[#111111] p-8 text-center bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-[#FFF3A7] border-[3px] border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] rounded-full flex items-center justify-center mx-auto">
                  <Lock className="h-8 w-8 text-[#111111]" />
                </div>
                <h3 className="text-xl font-black text-[#111111]">
                  Peer Scheduling is Exclusive to Enrolled Cohort Students
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-600">
                  Enrolled students schedule 1:1 sessions, receive automated Google Meet links, and collaborate inside their private batch channels.
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenUpgrade("Peer Sessions & Study Pods", "Join the next batch to get access to peer mock study pods.")}
                  className="px-6 py-3 bg-[#0f6f8f] hover:bg-[#188ab2] text-white border-[3px] border-[#111111] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] cursor-pointer"
                >
                  Join Cohort on WhatsApp ➜
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: PROFILE / ACCOUNT */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-white border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] space-y-4">
                <h2 className="text-2xl font-black text-[#111111]">Student Profile</h2>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-500">Full Name</span>
                    <span className="text-sm font-black text-[#111111]">{userName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-500">Email Address</span>
                    <span className="text-sm font-black text-[#111111]">{userEmail}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-500">Access Tier</span>
                    <span className="text-xs font-black bg-[#E0F2FE] text-[#0369A1] border border-[#0284C7] px-2 py-0.5">
                      Portal Free Tier (PM Gym Active)
                    </span>
                  </div>
                  <div className="border border-slate-200 bg-[#F8FAFC] p-3 text-xs flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-slate-700 block">Enrolled in Batch 1 / Batch 2 Cohort?</span>
                      <p className="text-[11px] text-slate-500 font-medium">Access your live cohort lectures, submissions & Zoom calls on the LMS portal.</p>
                    </div>
                    <a
                      href="/learn"
                      className="px-3 py-1.5 border-[2px] border-[#111111] bg-white hover:bg-[#FFF3A7] font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] inline-flex items-center gap-1 shrink-0"
                    >
                      <span>LMS Login</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 border-[2px] border-[#111111] text-xs font-black uppercase text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    Logout of Portal
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenUpgrade("Full Cohort Upgrade", "Upgrade to the full StepSmart cohort to unlock live mentorship, PRD reviews, and referrals.")}
                    className="px-5 py-2.5 bg-[#0f6f8f] hover:bg-[#188ab2] text-white border-[2px] border-[#111111] text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] cursor-pointer"
                  >
                    Upgrade to Cohort ➜
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─── COHORT UPGRADE / WHATSAPP MODAL ─── */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-[#111111]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-[4px] border-[#111111] max-w-lg w-full p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] space-y-6 relative text-left animate-fadeIn">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-1.5 border-[2px] border-[#111111] bg-white hover:bg-[#FFF3A7] transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Badge & Title */}
            <div className="space-y-2">
              <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-3 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] rotate-[-1deg]">
                🔒 Unlock Full Cohort Access
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#111111] leading-tight">
                {upgradeContext.title}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
                {upgradeContext.desc}
              </p>
            </div>

            {/* Key Benefits List */}
            <div className="border-[2px] border-[#111111] p-4 bg-[#F8FAFC] space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                What you get as an enrolled cohort student:
              </span>
              <ul className="space-y-1.5 text-xs font-bold text-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#065F46] shrink-0" /> Live weekly sessions with PMs from Microsoft & Mastercard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#065F46] shrink-0" /> Line-by-line portfolio PRD reviews & teardowns
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#065F46] shrink-0" /> Direct referral access to top tech startups
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#065F46] shrink-0" /> Peer-to-peer study pods & live mock interview loops
                </li>
              </ul>
            </div>

            {/* Primary WhatsApp Action */}
            <div className="space-y-2.5">
              <a
                href={getWhatsAppChatUrl(upgradeContext.title)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 px-6 bg-[#065F46] hover:bg-[#047857] text-white border-[3px] border-[#111111] font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] flex items-center justify-center gap-2 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" /> Chat on WhatsApp to Buy / Enroll ➜
              </a>

              <p className="text-[11px] text-center font-bold text-slate-500">
                Speak directly with admissions • Limited seats per cohort to preserve 1:1 attention
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
