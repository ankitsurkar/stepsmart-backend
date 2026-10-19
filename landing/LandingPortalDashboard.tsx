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
  ArrowRight,
  Calendar,
  Send,
  MessageSquare,
  Award,
  Video,
  FileText,
  Users,
  AlertCircle,
  Check,
  RotateCcw,
  Eye,
  Zap,
  Bookmark
} from 'lucide-react';

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

export interface GymQuestion {
  date: string;
  type: 'quiz' | 'text';
  text: string;
  options?: string[] | null;
  correctIndex?: number | null;
  correctAnswer?: string | null;
  explanation?: string | null;
  category?: string;
}

interface CourseModule {
  week: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  topics: string[];
  lessons: { title: string; duration: string; isLive: boolean }[];
}

export const ACCELERATOR_MODULES: CourseModule[] = [
  {
    week: "Week 0",
    title: "Profile Repositioning & PM Mindset Transition",
    category: "Foundation",
    duration: "3 hrs",
    description: "Translate your engineering, consulting, or analytics background into a compelling Product Management story.",
    topics: ["Resume rewriting for PM roles", "LinkedIn profile positioning", "Framing past achievements as product impact"],
    lessons: [
      { title: "Repositioning Your Background into Product Language", duration: "45 mins", isLive: false },
      { title: "High-Signal PM Resume Deep Dive & Live Edits", duration: "60 mins", isLive: true },
      { title: "LinkedIn Storytelling & Cold Outreach Strategy", duration: "45 mins", isLive: false }
    ]
  },
  {
    week: "Week 1",
    title: "Product Fundamentals & Problem vs. Solution Space",
    category: "Product Sense",
    duration: "4 hrs",
    description: "Learn how senior PMs distinguish user pain points from superficial feature requests and map customer journeys.",
    topics: ["Problem space discovery", "Jobs to be Done (JTBD) framework", "User personas & journey mapping"],
    lessons: [
      { title: "Problem Definition: Why 80% of Features Fail", duration: "50 mins", isLive: true },
      { title: "Applying JTBD to Real Consumer Apps (Swiggy / Spotify)", duration: "60 mins", isLive: false },
      { title: "Mapping Customer Pain Points to Value Propositions", duration: "45 mins", isLive: false }
    ]
  },
  {
    week: "Week 2",
    title: "User Research, Discovery & Market Validation",
    category: "Discovery",
    duration: "4 hrs",
    description: "Conduct high-signal user interviews without asking leading questions. Synthesize user quotes into actionable themes.",
    topics: ["Mom Test principles", "Competitor matrix breakdown", "TAM / SAM / SOM market sizing"],
    lessons: [
      { title: "Unbiased User Discovery: The Mom Test in Practice", duration: "55 mins", isLive: true },
      { title: "Competitive Moats & Positioning Analysis", duration: "50 mins", isLive: false },
      { title: "Market Sizing & Opportunity Trees", duration: "40 mins", isLive: false }
    ]
  },
  {
    week: "Week 3",
    title: "Product Strategy, Moats & Business Growth Loops",
    category: "Strategy",
    duration: "4.5 hrs",
    description: "Build sustainable competitive advantages, examine network effects, and model product-led growth (PLG) loops.",
    topics: ["Hamilton Helmer's 7 Powers", "Retention curves & cohort decay", "Monetization & unit economics"],
    lessons: [
      { title: "7 Powers: Building Sustainable Competitive Moats", duration: "65 mins", isLive: true },
      { title: "Cohort Analysis & Healthy Retention Curves", duration: "55 mins", isLive: false },
      { title: "Growth Loops vs Traditional Funnels", duration: "45 mins", isLive: false }
    ]
  },
  {
    week: "Week 4",
    title: "Metrics, North Star & Root Cause Analysis (RCA)",
    category: "Analytics",
    duration: "5 hrs",
    description: "Master the metrics that drive product decisions. Structure end-to-end RCAs for real drops in conversion or revenue.",
    topics: ["North Star vs Guardrail metrics", "AARRR pirate metrics", "Live 7-step RCA diagnostic framework"],
    lessons: [
      { title: "Choosing the Right North Star & Guardrail Metrics", duration: "60 mins", isLive: true },
      { title: "7-Step Root Cause Analysis Framework (Live Case)", duration: "75 mins", isLive: true },
      { title: "A/B Testing, Experimentation & Statistical Significance", duration: "50 mins", isLive: false }
    ]
  },
  {
    week: "Week 5",
    title: "PRD Writing & Technical Architecture for PMs",
    category: "Execution",
    duration: "5 hrs",
    description: "Draft production-grade PRDs ready for engineering handoff. Understand APIs, system design, and database relationships.",
    topics: ["Industry-standard PRD templates", "User stories & acceptance criteria", "System architecture & APIs for non-engineers"],
    lessons: [
      { title: "Writing a Production-Grade PRD (Line-by-Line Review)", duration: "70 mins", isLive: true },
      { title: "APIs, Webhooks & Microservices Explained for PMs", duration: "60 mins", isLive: false },
      { title: "Sprint Planning & Engineering Trade-Off Discussions", duration: "45 mins", isLive: false }
    ]
  },
  {
    week: "Week 6",
    title: "Product Mock Interviews, Referral Loops & Offer Negotiation",
    category: "Career Launch",
    duration: "6 hrs",
    description: "Crack the toughest PM interview rounds: Product Sense, Analytical RCA, Behavioral, and System Architecture.",
    topics: ["1:1 mock interviews with Senior PMs", "Curated referral introductions", "Compensation benchmarking & negotiation"],
    lessons: [
      { title: "Cracking Product Sense Interviews (Live Demo)", duration: "75 mins", isLive: true },
      { title: "Behavioral & Leadership Stories (SAR Framework)", duration: "60 mins", isLive: false },
      { title: "Offer Evaluation & Salary Negotiation Tactics", duration: "45 mins", isLive: true }
    ]
  }
];

export const FIRST_STEP_MODULES: CourseModule[] = [
  {
    week: "Week 0",
    title: "Introduction to Tech Products & APM Career Paths",
    category: "Foundations",
    duration: "2.5 hrs",
    description: "Understand the roles of PMs, UX designers, and software engineers in tech companies. Set up your learning roadmap.",
    topics: ["What an Associate PM does", "Startup PM vs Big Tech APM", "College student advantage"],
    lessons: [
      { title: "Decoding the APM Role: What Tech Giants Expect", duration: "45 mins", isLive: false },
      { title: "Building a Standout Student Tech Profile", duration: "50 mins", isLive: true }
    ]
  },
  {
    week: "Week 1",
    title: "Breaking Down Everyday Apps (Product Teardowns)",
    category: "Product Sense",
    duration: "3.5 hrs",
    description: "Analyze products like WhatsApp, Zepto, and Instagram like a PM. Identify UI friction and missed monetization opportunities.",
    topics: ["Product teardown frameworks", "UI/UX heuristics (Nielsen Norman)", "User flow diagramming"],
    lessons: [
      { title: "How to Build a High-Signal Product Teardown", duration: "60 mins", isLive: true },
      { title: "Heuristic Evaluations of Popular Consumer Apps", duration: "45 mins", isLive: false }
    ]
  },
  {
    week: "Week 2",
    title: "User Empathy & Problem Validation for Freshers",
    category: "Discovery",
    duration: "3.5 hrs",
    description: "Learn how to talk to real customers, synthesize insights, and build user persona archetypes.",
    topics: ["Student user research methods", "Drafting interview scripts", "Customer empathy maps"],
    lessons: [
      { title: "Running Real Customer Interviews on Campus", duration: "50 mins", isLive: true },
      { title: "Synthesizing Insights into Problem Statements", duration: "45 mins", isLive: false }
    ]
  },
  {
    week: "Week 3",
    title: "Writing Your First PRD & Feature Prototype",
    category: "Execution",
    duration: "4 hrs",
    description: "Write a complete Product Requirement Document for a feature idea and build an interactive Figma prototype.",
    topics: ["PRD templates for APMs", "Feature scoping & MVP definition", "No-code wireframing & prototyping"],
    lessons: [
      { title: "Writing Your First Mini-PRD", duration: "60 mins", isLive: true },
      { title: "Wireframing & Prototyping Essentials for Non-Designers", duration: "55 mins", isLive: false }
    ]
  },
  {
    week: "Week 4",
    title: "Basic Product Metrics & Data Analysis with SQL/Sheets",
    category: "Analytics",
    duration: "4 hrs",
    description: "Understand churn, retention, conversion rates, and run basic queries to answer product health questions.",
    topics: ["Core product KPIs", "Cohort tables in Google Sheets", "Basic SQL queries for PMs"],
    lessons: [
      { title: "Product Analytics 101: DAU, MAU, Churn & CAC", duration: "60 mins", isLive: true },
      { title: "Hands-on SQL for Answering Product Questions", duration: "60 mins", isLive: false }
    ]
  },
  {
    week: "Week 5",
    title: "APM Placement Preparation & Case Competitions",
    category: "Placements",
    duration: "5 hrs",
    description: "Win campus product case competitions and clear campus placement APM hiring tests and panel interviews.",
    topics: ["Winning product case challenges", "Guesstimates & market sizing", "Campus APM interview loops"],
    lessons: [
      { title: "Frameworks for Campus Product Competitions", duration: "65 mins", isLive: true },
      { title: "Guesstimates & Market Sizing Drills", duration: "55 mins", isLive: true }
    ]
  }
];

export const SAMPLE_PM_JOBS = [
  {
    id: "job-1",
    title: "Associate Product Manager (APM)",
    company: "Zepto",
    location: "Mumbai / Bengaluru, India",
    ctc: "₹16 – 22 LPA",
    batch: "2024 / 2025 / 2026",
    tags: ["Quick Commerce", "Fulfillment", "Fast Track"]
  },
  {
    id: "job-2",
    title: "Product Manager (Growth & Acquisition)",
    company: "Swiggy",
    location: "Bengaluru, India",
    ctc: "₹24 – 32 LPA",
    batch: "Experienced",
    tags: ["Growth Loops", "Retention", "Dineout"]
  },
  {
    id: "job-3",
    title: "Product Manager 1 (Fintech & Credit)",
    company: "CRED",
    location: "Bengaluru, India",
    ctc: "₹28 – 36 LPA",
    batch: "1-3 Yrs Exp",
    tags: ["Fintech", "UPI", "Rewards"]
  },
  {
    id: "job-4",
    title: "Associate Product Manager",
    company: "Razorpay",
    location: "Bengaluru / Hybrid",
    ctc: "₹18 – 24 LPA",
    batch: "Open",
    tags: ["B2B Payments", "API Platform"]
  },
  {
    id: "job-5",
    title: "Product Manager (Core Platform)",
    company: "Groww",
    location: "Bengaluru, India",
    ctc: "₹22 – 30 LPA",
    batch: "Open",
    tags: ["Wealthtech", "Trading", "Scale"]
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

export const FALLBACK_GYM_QUESTIONS: GymQuestion[] = [
  {
    date: "2026-10-19",
    type: "text",
    text: "Recall the PM Framework (Problem → Users → Needs → Solutions → Prioritize → Test → Measure → Risks). For a payments app feature aimed at elderly users, outline 1 key action at each step.",
    options: null,
    correctIndex: null,
    correctAnswer: "Problem: fear of fraud and complex UI. Users: elderly & caregivers. Needs: large text, simple reassurance, biometric login. Solutions: assisted voice payments, caregiver verification. Prioritize by safety and accessibility. Test via small beta. Measure task completion & fraud report reduction. Risks: usability and compliance.",
    explanation: "Problem: fear of fraud and complex flows. Users: elderly plus family caregivers. Needs: simple, accessible, trustworthy. Solutions: large-text mode, one-tap repeat payments, caregiver alerts. Prioritize by impact and usability. Test with an A/B pilot. Measure conversion, drop-off reduction. Risks: value, usability, feasibility.",
    category: "Product Sense & Frameworks"
  },
  {
    date: "2026-10-18",
    type: "quiz",
    text: "\"Users would love the feature, but engineering cannot build it in the allotted sprint timeline.\" Which risk is this?",
    options: [
      "Value risk",
      "Usability risk",
      "Feasibility risk",
      "Business risk"
    ],
    correctIndex: 2,
    correctAnswer: null,
    explanation: "Feasibility risk is whether engineering can build the solution with the available time, skills, and technology. Value = will they buy/use it; Usability = can they figure out how to use it; Business viability = does it work for our business model.",
    category: "Product Discovery & Risks"
  },
  {
    date: "2026-10-17",
    type: "quiz",
    text: "Which prioritization framework calculates priority as (Reach * Impact * Confidence) / Effort?",
    options: [
      "MoSCoW Method",
      "Kano Model",
      "RICE Framework",
      "Value vs Complexity Matrix"
    ],
    correctIndex: 2,
    correctAnswer: null,
    explanation: "RICE stands for Reach, Impact, Confidence, and Effort. It produces an objective numerical score to stack-rank competing feature requests.",
    category: "Backlog Prioritization"
  },
  {
    date: "2026-10-16",
    type: "text",
    text: "Swiggy notices cart abandonment increased by 12% in the past week among repeat customers. What 3 immediate data points would you look at first?",
    options: null,
    correctIndex: null,
    correctAnswer: "1. Delivery fee / surge pricing changes or newly introduced platform fees. 2. Payment gateway failure rates (UPI/cards). 3. Specific restaurant / geo-cluster drop-offs or app update bugs on checkout screen.",
    explanation: "In an RCA (Root Cause Analysis), always check for internal release changes (fees, UI tweaks), system anomalies (payment gateway uptime), and segmentation (device OS, city, order value).",
    category: "Root Cause Analysis (RCA)"
  }
];

const toDateKey = (d: Date): string => {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${dy}`;
};

const getYesterdayDateKey = (todayKey: string): string => {
  try {
    const [y, m, d] = todayKey.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() - 1);
    return toDateKey(dateObj);
  } catch (e) {
    return '';
  }
};

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

  // User session
  const [userEmail, setUserEmail] = useState<string>('learner@stepsmart.net');
  const [userName, setUserName] = useState<string>('Learner');

  // PM Gym state
  const [questions, setQuestions] = useState<GymQuestion[]>(FALLBACK_GYM_QUESTIONS);
  const [loadingGym, setLoadingGym] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [submittingGym, setSubmittingGym] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(1);
  const [showGymModal, setShowGymModal] = useState<boolean>(false);
  const [showYesterdayModal, setShowYesterdayModal] = useState<boolean>(false);
  const [hasSolvedToday, setHasSolvedToday] = useState<boolean>(false);
  const [todayFeedback, setTodayFeedback] = useState<string | null>(null);

  const todayKey = toDateKey(new Date());
  const yesterdayKey = getYesterdayDateKey(todayKey);

  const todayQuestion = questions.find(q => q.date === todayKey) || questions[0];
  const yesterdayQuestion = questions.find(q => q.date === yesterdayKey) || questions[1];

  // Initialize session
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

    // Check today completion
    const savedToday = localStorage.getItem(`pm_gym_landing_completed_${todayKey}`);
    if (savedToday === 'true') {
      setHasSolvedToday(true);
    }
  }, [todayKey]);

  // Fetch real PM Gym questions from public endpoint
  useEffect(() => {
    let isMounted = true;
    const fetchGymData = async () => {
      try {
        const res = await fetch('https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: 'get_pm_gym',
            clientDate: todayKey
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.questions && Array.isArray(data.questions) && data.questions.length > 0) {
            setQuestions(data.questions);
            if (typeof data.streak === 'number' && data.streak > 0) {
              setStreak(data.streak);
            }
          }
        }
      } catch (err) {
        // Fallback to static
      } finally {
        if (isMounted) setLoadingGym(false);
      }
    };

    fetchGymData();
    return () => { isMounted = false; };
  }, [todayKey]);

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

  const handleSubmitGymAnswer = async () => {
    if (!todayQuestion) return;
    if (todayQuestion.type === 'quiz' && selectedOption === null) return;
    if (todayQuestion.type === 'text' && !textAnswer.trim()) return;

    setSubmittingGym(true);
    try {
      const finalAnswer = todayQuestion.type === 'quiz' ? String(selectedOption) : textAnswer.trim();
      await fetch('https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'submit_pm_gym',
          clientDate: todayKey,
          email: userEmail,
          answer: finalAnswer,
          questionDate: todayQuestion.date,
          type: todayQuestion.type
        })
      });

      localStorage.setItem(`pm_gym_landing_completed_${todayKey}`, 'true');
      setHasSolvedToday(true);
      setStreak(prev => prev + 1);

      if (todayQuestion.type === 'quiz') {
        const isCorrect = selectedOption === todayQuestion.correctIndex;
        setTodayFeedback(isCorrect ? "Correct! 🎯 Great product judgment." : "Submitted! Check the breakdown below.");
      } else {
        setTodayFeedback("Answer recorded! 🎉 Your critique has been submitted.");
      }
    } catch (e) {
      localStorage.setItem(`pm_gym_landing_completed_${todayKey}`, 'true');
      setHasSolvedToday(true);
      setTodayFeedback("Answer recorded locally!");
    } finally {
      setSubmittingGym(false);
    }
  };

  const currentModules = selectedCohort === 'accelerator' ? ACCELERATOR_MODULES : FIRST_STEP_MODULES;

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#edf3f8]">
      
      {/* ─── LMS Shell: Sidebar + Main Area ─── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
        
        {/* ─── SIDEBAR: Deep Cyan/Navy LMS Gradient ─── */}
        <aside
          className={`w-72 shrink-0 bg-gradient-to-b from-[#093758] to-[#027A9B] text-white flex flex-col justify-between p-5 z-40 transition-all duration-200 shadow-xl ${
            isMobileNavOpen ? 'fixed inset-0 block bg-[#093758]' : 'hidden lg:flex'
          }`}
        >
          <div className="space-y-6">
            
            {/* Brand Header */}
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center p-1.5 shadow-inner">
                  <img src="/stepsmart-logo.webp" alt="StepSmart" className="h-full w-full object-contain" />
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-tight text-white block leading-tight">StepSmart</span>
                  <span className="text-[11px] font-semibold text-cyan-200 tracking-wider uppercase block">Learner Portal</span>
                </div>
              </Link>

              {isMobileNavOpen && (
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="lg:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Track Switcher (Inside Sidebar) */}
            <div className="bg-white/10 border border-white/15 rounded-xl p-2.5 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200 block mb-1">
                Active Track
              </span>
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value as CohortTrack)}
                className="w-full bg-[#027A9B]/40 hover:bg-[#027A9B]/60 border border-white/25 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white outline-none cursor-pointer"
              >
                <option value="accelerator" className="text-slate-900 bg-white">PM-X Accelerator (Professionals)</option>
                <option value="first-step" className="text-slate-900 bg-white">PM-X First Step (Students)</option>
              </select>
            </div>

            {/* Navigation Stack */}
            <nav className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300/70 px-3 block mb-2">
                Menu
              </span>

              {/* 1. Dashboard / Home */}
              <button
                type="button"
                onClick={() => { setActiveTab('dashboard'); setIsMobileNavOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  activeTab === 'dashboard'
                    ? 'bg-white/20 text-white font-semibold shadow-inner'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {activeTab === 'dashboard' && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-md" />
                )}
                <Home className="h-4 w-4 shrink-0" />
                <span>Home</span>
                <span className="ml-auto text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Flame className="h-3 w-3 fill-slate-950" /> Gym
                </span>
              </button>

              {/* 2. Courses */}
              <button
                type="button"
                onClick={() => { setActiveTab('courses'); setIsMobileNavOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  activeTab === 'courses'
                    ? 'bg-white/20 text-white font-semibold shadow-inner'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {activeTab === 'courses' && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-md" />
                )}
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>Courses</span>
                <span className="ml-auto text-[10px] font-semibold bg-white/15 px-2 py-0.5 rounded-full">
                  6 Wks
                </span>
              </button>

              {/* 3. PM Jobs */}
              <button
                type="button"
                onClick={() => { setActiveTab('jobs'); setIsMobileNavOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  activeTab === 'jobs'
                    ? 'bg-white/20 text-white font-semibold shadow-inner'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {activeTab === 'jobs' && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-md" />
                )}
                <Briefcase className="h-4 w-4 shrink-0" />
                <span>PM Jobs</span>
                <Lock className="h-3.5 w-3.5 ml-auto text-cyan-200/60" />
              </button>

              {/* 4. Assignments */}
              <button
                type="button"
                onClick={() => { setActiveTab('assignments'); setIsMobileNavOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  activeTab === 'assignments'
                    ? 'bg-white/20 text-white font-semibold shadow-inner'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {activeTab === 'assignments' && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-md" />
                )}
                <ClipboardList className="h-4 w-4 shrink-0" />
                <span>Assignments</span>
                <Lock className="h-3.5 w-3.5 ml-auto text-cyan-200/60" />
              </button>

              {/* 5. Interviews */}
              <button
                type="button"
                onClick={() => { setActiveTab('interviews'); setIsMobileNavOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  activeTab === 'interviews'
                    ? 'bg-white/20 text-white font-semibold shadow-inner'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {activeTab === 'interviews' && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-md" />
                )}
                <HelpCircle className="h-4 w-4 shrink-0" />
                <span>Interview</span>
                <Lock className="h-3.5 w-3.5 ml-auto text-cyan-200/60" />
              </button>

              {/* 6. Resources */}
              <button
                type="button"
                onClick={() => { setActiveTab('resources'); setIsMobileNavOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  activeTab === 'resources'
                    ? 'bg-white/20 text-white font-semibold shadow-inner'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {activeTab === 'resources' && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-md" />
                )}
                <FolderArchive className="h-4 w-4 shrink-0" />
                <span>Resources</span>
                <Lock className="h-3.5 w-3.5 ml-auto text-cyan-200/60" />
              </button>

              {/* 7. Sessions */}
              <button
                type="button"
                onClick={() => { setActiveTab('sessions'); setIsMobileNavOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  activeTab === 'sessions'
                    ? 'bg-white/20 text-white font-semibold shadow-inner'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {activeTab === 'sessions' && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-md" />
                )}
                <Clock className="h-4 w-4 shrink-0" />
                <span>Sessions</span>
                <Lock className="h-3.5 w-3.5 ml-auto text-cyan-200/60" />
              </button>

              {/* 8. Profile */}
              <button
                type="button"
                onClick={() => { setActiveTab('profile'); setIsMobileNavOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  activeTab === 'profile'
                    ? 'bg-white/20 text-white font-semibold shadow-inner'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {activeTab === 'profile' && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-md" />
                )}
                <User className="h-4 w-4 shrink-0" />
                <span>Profile</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Footer: Profile Card & Logout */}
          <div className="pt-6 border-t border-white/15 space-y-3">
            <div className="bg-white/10 border border-white/15 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-200/20 text-white border border-white/30 flex items-center justify-center font-bold text-sm shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-xs text-white block truncate">{userName}</span>
                <span className="text-[10px] text-cyan-200/80 block truncate">Portal Explorer</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white/85 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* ─── MAIN CONTENT AREA ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Bar matching LMS Header */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <span className="text-[11px] font-bold text-[#027A9B] uppercase tracking-wider block">
                  Student Dashboard
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
                  Welcome, {userName} 👋
                </h1>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-3">
              {/* WhatsApp Admissions button */}
              <a
                href={getWhatsAppChatUrl("Admissions Guidance")}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full font-semibold text-xs transition-all shadow-2xs"
              >
                <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                <span>Admissions 1:1</span>
              </a>

              {/* Direct LMS Escape Link */}
              <a
                href="/learn"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-full font-semibold text-xs shadow-2xs transition-all"
              >
                <span>Full LMS</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            </div>
          </header>

          {/* Body Canvas */}
          <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
            
            {/* ═════════════════════════════════════════════════════════ */}
            {/* TAB 1: DASHBOARD / HOME (PM GYM UNLOCKED)                 */}
            {/* ═════════════════════════════════════════════════════════ */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* ─── PM GYM BANNER (MATCHING LMS DESIGN) ─── */}
                <div className="bg-gradient-to-r from-[#027A9B] to-[#015D77] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  
                  {/* Subtle Background Glow Circle */}
                  <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center gap-5 text-center md:text-left flex-1 z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                      <Flame className="h-9 w-9 text-amber-300 fill-amber-300 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
                          PM Gym
                        </span>
                        <span className="bg-amber-400 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                          Daily Challenge
                        </span>
                      </div>
                      <p className="text-cyan-100 text-sm leading-relaxed max-w-xl">
                        {loadingGym
                          ? "Loading today's challenge..."
                          : todayQuestion?.text
                            ? todayQuestion.text
                            : "New challenge is ready. Solve it to build product intuition & maintain your streak!"}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Streak */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full md:w-auto">
                    {hasSolvedToday ? (
                      <button
                        type="button"
                        disabled
                        className="w-full sm:w-auto px-6 py-3 bg-white/20 text-white font-bold text-sm rounded-full cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        <span>Completed Today ✓</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowGymModal(true)}
                        className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-[#027A9B] font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap className="h-4 w-4 fill-[#027A9B]" />
                        <span>Solve Today's Challenge</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowYesterdayModal(true)}
                      className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-sm rounded-full transition-all cursor-pointer text-center"
                    >
                      Yesterday's Answer
                    </button>
                  </div>
                </div>

                {/* ─── WEEKLY STREAK & CONSISTENCY CARD ─── */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#027A9B]">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">Weekly Consistency</h4>
                      <p className="text-xs text-slate-500">Every weekday at 9:00 AM IST, a new PM interview challenge unlocks.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                      const isToday = idx === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                      const isDone = isToday ? hasSolvedToday : idx < (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                      return (
                        <div key={day} className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-semibold text-slate-400">{day}</span>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isDone
                                ? 'bg-[#027A9B] text-white shadow-2xs'
                                : isToday
                                  ? 'border-2 border-[#027A9B] text-[#027A9B] bg-cyan-50'
                                  : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {isDone ? '✓' : idx + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ─── ACTIVE COURSE PREVIEW ─── */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-[#027A9B] uppercase tracking-wider">
                        Current Cohort Curriculum
                      </span>
                      <h3 className="text-lg font-bold text-slate-800">
                        {selectedCohort === 'accelerator' ? 'PM-X Accelerator (Working Professionals)' : 'PM-X First Step (College & Placements)'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('courses')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all self-start sm:self-auto cursor-pointer"
                    >
                      View All 6 Weeks ➜
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    {currentModules.slice(0, 2).map((mod) => (
                      <div key={mod.week} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[#027A9B] bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">
                            {mod.week}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{mod.duration}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-800">{mod.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{mod.description}</p>
                        
                        <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Lock className="h-3 w-3" /> Videos Gated
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenUpgrade(`Unlock ${mod.title}`, mod.description)}
                            className="text-[#027A9B] hover:underline cursor-pointer"
                          >
                            Unlock on WhatsApp ➜
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ─── QUICK FEATURE CARDS (JOBS, ASSIGNMENTS, 1:1 MOCKS) ─── */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Jobs card */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-800">PM Job Board</h4>
                      <p className="text-xs text-slate-500">Active hiring roles from Swiggy, Zepto, CRED, and Razorpay.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('jobs')}
                      className="mt-4 text-xs font-semibold text-[#027A9B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore Jobs</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Assignments card */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-800">Case Assignments</h4>
                      <p className="text-xs text-slate-500">Tear down real apps, write PRDs, and get mentor reviews.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('assignments')}
                      className="mt-4 text-xs font-semibold text-[#027A9B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Case Studies</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Interviews card */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                        <HelpCircle className="h-5 w-5" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-800">1:1 Mock Interviews</h4>
                      <p className="text-xs text-slate-500">Live mock practice loops with Senior PMs from Microsoft & Mastercard.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('interviews')}
                      className="mt-4 text-xs font-semibold text-[#027A9B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Mentor Loops</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ═════════════════════════════════════════════════════════ */}
            {/* TAB 2: COURSES                                            */}
            {/* ═════════════════════════════════════════════════════════ */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                
                {/* Course Switcher Header */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#027A9B] uppercase tracking-wider block">
                      Curriculum & Lectures
                    </span>
                    <h2 className="text-xl font-bold text-slate-800">
                      {selectedCohort === 'accelerator' ? 'PM-X Accelerator Program' : 'PM-X First Step Program'}
                    </h2>
                  </div>

                  {/* Course switcher pills */}
                  <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCohort('accelerator')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedCohort === 'accelerator'
                          ? 'bg-[#027A9B] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      PM-X Accelerator
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCohort('first-step')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedCohort === 'first-step'
                          ? 'bg-[#027A9B] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      PM-X First Step
                    </button>
                  </div>
                </div>

                {/* Modules List */}
                <div className="space-y-4">
                  {currentModules.map((module) => (
                    <div
                      key={module.week}
                      className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold bg-cyan-50 text-[#027A9B] border border-cyan-100 px-3 py-1 rounded-full">
                            {module.week}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            {module.category}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {module.duration}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenUpgrade(`Enroll in ${module.title}`, module.description)}
                          className="text-xs font-bold text-[#027A9B] hover:text-[#015D77] flex items-center gap-1 cursor-pointer"
                        >
                          <Lock className="h-3.5 w-3.5" />
                          <span>Unlock Full Module</span>
                        </button>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{module.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{module.description}</p>
                      </div>

                      {/* Key Topics */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {module.topics.map((t) => (
                          <span key={t} className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5">
                            <Check className="h-3 w-3 text-emerald-600" />
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Lesson breakdown (Locked) */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Recorded Lessons & Masterclasses
                        </span>
                        <div className="grid sm:grid-cols-3 gap-2">
                          {module.lessons.map((lesson, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleOpenUpgrade(`Lecture: ${lesson.title}`, "Join the StepSmart cohort to stream all live & recorded lectures with Q&A recordings.")}
                              className="p-3 bg-slate-50/70 hover:bg-cyan-50/40 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Video className="h-4 w-4 text-[#027A9B] shrink-0" />
                                <span className="text-xs font-semibold text-slate-800 truncate">{lesson.title}</span>
                              </div>
                              <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ═════════════════════════════════════════════════════════ */}
            {/* TAB 3: PM JOBS (LOCKED)                                   */}
            {/* ═════════════════════════════════════════════════════════ */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#027A9B] uppercase tracking-wider">
                        Curated Opportunities
                      </span>
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="h-2.5 w-2.5" /> Cohort Referrals Only
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mt-1">PM & APM Open Roles</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Direct hiring partner leads and referrals for StepSmart cohort graduates.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenUpgrade("Job Board Referrals", "Enroll in the cohort to get direct referrals to hiring managers at Swiggy, Zepto, CRED, and Meesho.")}
                    className="px-4 py-2 bg-[#027A9B] hover:bg-[#015D77] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    Unlock Referral Access
                  </button>
                </div>

                <div className="grid gap-3">
                  {SAMPLE_PM_JOBS.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-sm text-[#027A9B] shrink-0">
                          {job.company.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-800">{job.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-semibold text-slate-700">{job.company}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span className="font-semibold text-emerald-600">{job.ctc}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            {job.tags.map((tag) => (
                              <span key={tag} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenUpgrade(`Job Referral: ${job.title} at ${job.company}`, `Apply for ${job.title} at ${job.company} (${job.ctc}) with verified StepSmart cohort referrals.`)}
                        className="px-4 py-2 bg-slate-100 hover:bg-[#027A9B] hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Lock className="h-3 w-3" />
                        <span>Apply via Cohort</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════ */}
            {/* TAB 4: ASSIGNMENTS (LOCKED)                               */}
            {/* ═════════════════════════════════════════════════════════ */}
            {activeTab === 'assignments' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#027A9B] uppercase tracking-wider block">
                      Case Studies & Teardowns
                    </span>
                    <h2 className="text-xl font-bold text-slate-800">PM Practical Assignments</h2>
                    <p className="text-xs text-slate-500 mt-0.5">All cohort submissions receive detailed line-by-line feedback from Microsoft & Mastercard PMs.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenUpgrade("Assignment Reviews", "Get your PRDs, teardowns, and RCAs reviewed line-by-line by Senior PM mentors.")}
                    className="px-4 py-2 bg-[#027A9B] hover:bg-[#015D77] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    Unlock Submissions
                  </button>
                </div>

                <div className="grid gap-4">
                  {[
                    {
                      id: "asg-1",
                      week: "Week 1",
                      title: "Zepto 10-Min Delivery Cart Abandonment RCA",
                      desc: "Identify why repeat users drop off on cart checkout during peak dinner hours and propose 2 testable interventions.",
                      type: "Product Analytics RCA"
                    },
                    {
                      id: "asg-2",
                      week: "Week 3",
                      title: "Spotify India Regional Music Recommendation PRD",
                      desc: "Draft a comprehensive PRD for introducing Bhojpuri & Punjabi hyper-personalized playlists for non-premium listeners.",
                      type: "Full PRD Draft"
                    },
                    {
                      id: "asg-3",
                      week: "Week 5",
                      title: "Uber India Auto Booking Cancellation Reduction",
                      desc: "Model driver acceptance incentives, calculate unit economics, and test a driver-rider chat handshake feature.",
                      type: "Product Strategy & GTM"
                    }
                  ].map((asg) => (
                    <div
                      key={asg.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#027A9B] bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">
                            {asg.week}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {asg.type}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-800">{asg.title}</h4>
                        <p className="text-xs text-slate-600 max-w-2xl">{asg.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenUpgrade(`Assignment: ${asg.title}`, asg.desc)}
                        className="px-4 py-2 bg-slate-100 hover:bg-[#027A9B] hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Lock className="h-3 w-3" />
                        <span>Submit Case</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════ */}
            {/* TAB 5: INTERVIEWS (LOCKED)                                */}
            {/* ═════════════════════════════════════════════════════════ */}
            {activeTab === 'interviews' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#027A9B] uppercase tracking-wider block">
                      1:1 Mentorship
                    </span>
                    <h2 className="text-xl font-bold text-slate-800">Mock Interview Loops</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Practice realistic 45-minute PM interview loops with verified senior industry PMs.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenUpgrade("1:1 Mock Interviews", "Book private mock interview rounds with detailed rubric evaluations & scorecards.")}
                    className="px-4 py-2 bg-[#027A9B] hover:bg-[#015D77] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    Book Mock Slot
                  </button>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Sanket Katore",
                      role: "Product Manager at Mastercard",
                      rounds: "Product Sense & Execution",
                      rating: "5.0 ★ (42 reviews)",
                      avatar: "SK"
                    },
                    {
                      name: "Pankaj Sharma",
                      role: "Product Manager at Shopdeck",
                      rounds: "E-Commerce & Strategy",
                      rating: "5.0 ★ (28 reviews)",
                      avatar: "PS"
                    },
                    {
                      name: "Ankit Surkar",
                      role: "Founder & Ex-Product Lead",
                      rounds: "Resume Repositioning & RCA",
                      rating: "5.0 ★ (50+ reviews)",
                      avatar: "AS"
                    }
                  ].map((m, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center font-bold text-base text-[#027A9B]">
                          {m.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-800">{m.name}</h4>
                          <span className="text-xs text-slate-500 font-medium block">{m.role}</span>
                          <span className="text-xs text-amber-600 font-semibold mt-1 block">{m.rating}</span>
                        </div>
                        <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-600 block text-[11px]">Specialization:</span>
                          <span className="text-slate-800 font-medium">{m.rounds}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenUpgrade(`Mock Loop with ${m.name}`, `Schedule a 45-minute PM interview loop with ${m.name} (${m.role}).`)}
                        className="w-full py-2 bg-slate-100 hover:bg-[#027A9B] hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Lock className="h-3 w-3" />
                        <span>Book 1:1 Slot</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════ */}
            {/* TAB 6: RESOURCES (LOCKED)                                 */}
            {/* ═════════════════════════════════════════════════════════ */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#027A9B] uppercase tracking-wider block">
                      Templates & Toolkits
                    </span>
                    <h2 className="text-xl font-bold text-slate-800">PM Resource Vault</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Production-ready PRD frameworks, Figma UI kits, and interview cheat sheets.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenUpgrade("Resource Vault", "Download high-signal Notion templates, PRD decks, and PM interview cheat sheets.")}
                    className="px-4 py-2 bg-[#027A9B] hover:bg-[#015D77] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    Unlock All Vault Files
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: "Standard Production PRD Template (Notion & Docx)", format: "Notion / Docx", size: "2.4 MB" },
                    { title: "Root Cause Analysis (RCA) 7-Step Diagnostic Canvas", format: "PDF & Miro", size: "1.8 MB" },
                    { title: "PM Metrics Formula Sheet (LTV, CAC, AARRR, Retention)", format: "Cheat Sheet PDF", size: "900 KB" },
                    { title: "Product Teardown Presentation Deck (Zepto & Swiggy)", format: "Google Slides", size: "5.1 MB" }
                  ].map((res, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between gap-4 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#027A9B] flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-800">{res.title}</h4>
                          <span className="text-[11px] text-slate-500 font-medium">{res.format} • {res.size}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenUpgrade(`Resource: ${res.title}`, "Join the StepSmart cohort to download all verified product templates.")}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-[#027A9B] hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Lock className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════ */}
            {/* TAB 7: SESSIONS (LOCKED)                                  */}
            {/* ═════════════════════════════════════════════════════════ */}
            {activeTab === 'sessions' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 text-[#027A9B] flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Peer Practice & Mock Sessions</h2>
                    <p className="text-xs text-slate-500">Pair up with peers across Batch 1 & Batch 2 for live 1:1 case interviews.</p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">How Peer Sessions Work in Cohorts:</span>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Randomized peer pairing twice every week based on your target company tier.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Standardized rubric grading for Product Sense, Execution RCA, and GTM.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Recorded peer feedback shared in your learner dashboard.
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleOpenUpgrade("Peer Practice Sessions", "Unlock automated peer pairing and mock interview practice rooms.")}
                    className="px-5 py-2.5 bg-[#027A9B] hover:bg-[#015D77] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>Unlock Peer Sessions on WhatsApp</span>
                  </button>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════ */}
            {/* TAB 8: PROFILE                                            */}
            {/* ═════════════════════════════════════════════════════════ */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Student Profile & Settings</h2>
                  <p className="text-xs text-slate-500">Manage your portal preferences and cohort enrollment status.</p>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Full Name</span>
                    <span className="font-bold text-slate-800">{userName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Email Address</span>
                    <span className="font-bold text-slate-800">{userEmail}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Access Tier</span>
                    <span className="text-xs font-bold bg-cyan-50 text-[#027A9B] border border-cyan-200 px-2.5 py-0.5 rounded-full">
                      Free PM Gym Active
                    </span>
                  </div>
                </div>

                {/* Direct LMS Access Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Enrolled in Batch 1 / Batch 2?</h4>
                    <p className="text-[11px] text-slate-500">Access full live sessions, assignments, and cohort chat on the LMS.</p>
                  </div>
                  <a
                    href="/learn"
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-all shadow-2xs inline-flex items-center gap-1 shrink-0"
                  >
                    <span>LMS Login</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Log Out of Portal
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenUpgrade("Full Cohort Upgrade", "Upgrade to the full StepSmart cohort to unlock live mentorship, PRD reviews, and referrals.")}
                    className="px-5 py-2.5 bg-[#027A9B] hover:bg-[#015D77] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Upgrade to Full Cohort ➜
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════ */}
      {/* MODAL 1: PM GYM QUIZ / ANSWER MODAL                       */}
      {/* ═════════════════════════════════════════════════════════ */}
      {showGymModal && todayQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500 fill-amber-500" />
                <span className="font-extrabold text-base text-slate-900">PM Gym Challenge</span>
                <span className="text-[11px] font-bold text-[#027A9B] bg-cyan-50 px-2 py-0.5 rounded-full">
                  {todayQuestion.category || "Product Sense"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowGymModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Today's Question
              </span>
              <p className="text-slate-900 font-bold text-base sm:text-lg leading-relaxed">
                {todayQuestion.text}
              </p>
            </div>

            {/* Answer Form (MCQ or Open Text) */}
            {!hasSolvedToday ? (
              todayQuestion.type === 'quiz' && todayQuestion.options ? (
                <div className="space-y-2 pt-2">
                  {todayQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center gap-3 cursor-pointer ${
                        selectedOption === idx
                          ? 'border-[#027A9B] bg-cyan-50/60 text-[#027A9B]'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        selectedOption === idx ? 'bg-[#027A9B] text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={4}
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Type your structured product response here (use bullet points or frameworks)..."
                    className="w-full p-3.5 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#027A9B]/20 focus:border-[#027A9B] transition-all"
                  />
                  <span className="text-[11px] text-slate-400 font-medium block text-right">
                    {textAnswer.trim().length} characters
                  </span>
                </div>
              )
            ) : null}

            {/* Solution & Explanation when completed */}
            {hasSolvedToday && (
              <div className="space-y-4 pt-2">
                {todayFeedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>{todayFeedback}</span>
                  </div>
                )}

                {todayQuestion.explanation && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#027A9B] block">
                      Mentor Explanation & Solution:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {todayQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowGymModal(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>

              {!hasSolvedToday && (
                <button
                  type="button"
                  onClick={handleSubmitGymAnswer}
                  disabled={submittingGym || (todayQuestion.type === 'quiz' ? selectedOption === null : !textAnswer.trim())}
                  className="px-6 py-2.5 bg-[#027A9B] hover:bg-[#015D77] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  {submittingGym ? "Submitting..." : "Submit Answer"}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════ */}
      {/* MODAL 2: YESTERDAY'S PM GYM ANSWER                        */}
      {/* ═════════════════════════════════════════════════════════ */}
      {showYesterdayModal && yesterdayQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900">Yesterday's Gym Solution</span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {yesterdayQuestion.date}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowYesterdayModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#027A9B]">
                Question:
              </span>
              <p className="text-slate-900 font-bold text-sm sm:text-base leading-relaxed">
                {yesterdayQuestion.text}
              </p>
            </div>

            {/* Correct answer display */}
            <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#027A9B] block">
                Verified Answer:
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {yesterdayQuestion.type === 'quiz' && yesterdayQuestion.options && yesterdayQuestion.correctIndex !== null && yesterdayQuestion.correctIndex !== undefined
                  ? `${String.fromCharCode(65 + yesterdayQuestion.correctIndex)}. ${yesterdayQuestion.options[yesterdayQuestion.correctIndex]}`
                  : yesterdayQuestion.correctAnswer || "See explanation below."}
              </p>
            </div>

            {/* Explanation */}
            {yesterdayQuestion.explanation && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Detailed Explanation:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {yesterdayQuestion.explanation}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowYesterdayModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════ */}
      {/* MODAL 3: COHORT UPGRADE / WHATSAPP ADMISSIONS             */}
      {/* ═════════════════════════════════════════════════════════ */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative animate-fadeIn">
            
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-2">
              <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 font-bold text-xs rounded-full">
                🔒 Cohort Exclusive Feature
              </span>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                {upgradeContext.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {upgradeContext.desc}
              </p>
            </div>

            {/* Value checklist */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Included in the StepSmart Cohort:
              </span>
              <ul className="space-y-2 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  Live weekly masterclasses with PMs from Microsoft & Mastercard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  Line-by-line portfolio PRD reviews & teardown grading
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  Direct interview referrals to Swiggy, Zepto, CRED, and Meesho
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  1:1 mentor mock loops with rubric feedback scorecards
                </li>
              </ul>
            </div>

            {/* WhatsApp CTA button */}
            <div className="pt-2 space-y-2">
              <a
                href={getWhatsAppChatUrl(upgradeContext.title)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 fill-white" />
                <span>Chat with Admissions on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Maybe later
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
