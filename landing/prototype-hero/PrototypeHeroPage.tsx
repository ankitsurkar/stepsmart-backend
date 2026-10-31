import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Check, Sparkles, ArrowRight, ShieldCheck, MessageCircle, X } from 'lucide-react';

import { HeroEditorial } from './HeroEditorial';
import { 
  TransitionStoriesEditorial, 
  StuckReframeEditorial, 
  PillarSystemEditorial 
} from './SectionsEditorial';
import {
  WalkAwayEditorial,
  CurriculumEditorial,
  WhyDifferentEditorial
} from './CurriculumEditorial';
import {
  MentorsEditorial,
  TestimonialsEditorial,
  FitAssessmentEditorial
} from './SocialProofEditorial';
import {
  PricingEditorial,
  SmallBatchesEditorial,
  HowToJoinEditorial,
  FaqEditorial,
  FooterEditorial
} from './PricingAndFaqEditorial';

export function PrototypeHeroPage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [brochureSuccess, setBrochureSuccess] = useState(false);

  // Enrollment checkout modal state
  const [enrollModal, setEnrollModal] = useState<{ isOpen: boolean; plan: string; amount: number } | null>(null);

  // Early-bird countdown state
  const [countdownText, setCountdownText] = useState('Early bird ₹15,000 ends in 2d 6h 19m · Then ₹20,000');

  useEffect(() => {
    const end = new Date('2026-10-31T23:59:59+05:30').getTime();
    const updateCountdown = () => {
      const left = end - Date.now();
      if (left > 0) {
        const days = Math.floor(left / (1000 * 60 * 60 * 24));
        const hours = Math.floor((left % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((left % (1000 * 60 * 60)) / (1000 * 60));
        setCountdownText(`Early bird ₹15,000 ends in ${days}d ${hours}h ${mins}m · Then ₹20,000`);
      } else {
        setCountdownText('Seats strictly capped at 30 · Standard tuition applies');
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBrochureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBrochureSuccess(true);
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/PM-X-Accelerator-Brochure.pdf';
      link.download = 'PM-X-Accelerator-Brochure.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 400);
  };

  const handleEnroll = (plan: string, amount: number) => {
    setEnrollModal({ isOpen: true, plan, amount });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#16171A] font-sans selection:bg-amber-200/50 selection:text-stone-900">
      
      {/* 0. PROTOTYPE NOTICE BAR */}
      <div className="bg-[#16171A] text-white px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-3">
          <span className="bg-amber-400 text-black px-2 py-0.5 rounded font-bold text-[10px] tracking-wide">
            DIRECTION 2 PROTOTYPE
          </span>
          <span className="text-stone-300">Prisma / Zenith Editorial Prestige</span>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="/" 
            className="text-amber-300 hover:text-amber-200 font-bold inline-flex items-center gap-1 transition-colors"
          >
            <span>View Current Live Site ➜</span>
          </a>
        </div>
      </div>

      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <aside 
        aria-label="Announcement Banner" 
        className="sticky top-0 z-50 w-full bg-[#16171A] text-white text-xs py-2.5 px-4 font-mono border-b border-stone-800"
      >
        <div className="container mx-auto max-w-7xl flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 text-[10px] uppercase inline-flex items-center gap-1.5 font-medium tracking-[0.05em] rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ADMISSION LIVE
            </span>
            <span className="text-stone-300 text-xs sm:text-sm font-medium">
              {countdownText}
            </span>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('pricing');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white hover:bg-stone-100 text-[#16171A] px-4 py-1.5 text-xs uppercase font-mono font-medium tracking-[0.05em] rounded transition-all cursor-pointer shadow-sm"
          >
            Reserve Seat ➜
          </button>
        </div>
      </aside>

      {/* 2. HEADER / NAVBAR */}
      <header className="w-full bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/90 relative z-40">
        <div className="container mx-auto px-6 h-20 max-w-7xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 select-none">
            <img 
              src="/stepsmart-logo.webp" 
              alt="StepSmart Logo" 
              className="w-8 h-8 object-contain"
              width="32" 
              height="32" 
            />
            <span className="font-extrabold text-2xl tracking-tight text-[#16171A]">
              StepSmart
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#system" className="hover:text-stone-900 transition-colors">Cohort</a>
            <a href="#curriculum" className="hover:text-stone-900 transition-colors">Curriculum</a>
            <a href="#mentors" className="hover:text-stone-900 transition-colors">Mentors</a>
            <a href="#outcomes" className="hover:text-stone-900 transition-colors">Outcomes</a>
            <a href="#pricing" className="hover:text-stone-900 transition-colors">Tuition</a>
            <a href="#faq" className="hover:text-stone-900 transition-colors">FAQ</a>
            <a 
              href="/learn" 
              className="border border-stone-300 px-4 py-1.5 rounded-full text-stone-700 hover:text-stone-900 hover:bg-white transition-all text-xs font-semibold"
            >
              Login
            </a>
            <button 
              onClick={() => {
                const el = document.getElementById('pricing');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#16171A] hover:bg-black text-white px-5 py-2 uppercase font-mono font-medium text-xs tracking-[0.05em] rounded-full shadow-md transition-all cursor-pointer"
            >
              Reserve Seat ➜
            </button>
          </nav>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <HeroEditorial 
        onSelectPath={(path) => {
          setSelectedPath(path);
          const target = document.getElementById(path === 'new-to-pm' ? 'pricing' : 'modular');
          target?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenBrochure={() => {
          setBrochureSuccess(false);
          setIsBrochureModalOpen(true);
        }}
      />

      {/* 4. THE 3 TRANSITION STORIES */}
      <TransitionStoriesEditorial />

      {/* 5. WHY MOST PEOPLE STAY STUCK & THE REFRAME */}
      <StuckReframeEditorial />

      {/* 6. THE 4-PILLAR SYSTEM (Learn · Build · Practice · Career) */}
      <PillarSystemEditorial />

      {/* 7. WHAT YOU'LL WALK AWAY WITH */}
      <WalkAwayEditorial />

      {/* 8. THE 8-WEEK CURRICULUM */}
      <CurriculumEditorial 
        onOpenBrochure={() => {
          setBrochureSuccess(false);
          setIsBrochureModalOpen(true);
        }}
      />

      {/* 9. WHY THIS IS DIFFERENT */}
      <WhyDifferentEditorial />

      {/* 10. LEARN FROM WORKING PMS (MENTORS) */}
      <MentorsEditorial />

      {/* 11. REAL PEOPLE. REAL TRANSITIONS. (TESTIMONIALS) */}
      <TestimonialsEditorial />

      {/* 12. IS PM-X FOR YOU? (FIT ASSESSMENT) */}
      <FitAssessmentEditorial />

      {/* 13. WHAT YOU GET, STACKED (PRICING & MODULAR) */}
      <PricingEditorial 
        countdownText={countdownText}
        onEnroll={handleEnroll}
      />

      {/* 14. SMALL BATCHES, BY CHOICE */}
      <SmallBatchesEditorial />

      {/* 15. HOW TO JOIN */}
      <HowToJoinEditorial />

      {/* 16. QUESTIONS, ANSWERED (FAQ) */}
      <FaqEditorial />

      {/* 17. FINAL CONVERSION & EDITORIAL FOOTER */}
      <FooterEditorial 
        countdownText={countdownText}
        onOpenBrochure={() => {
          setBrochureSuccess(false);
          setIsBrochureModalOpen(true);
        }}
        onEnroll={() => handleEnroll('full-cohort', 15000)}
      />

      {/* MODAL 1: BROCHURE POPUP MODAL (Editorial Design) */}
      <AnimatePresence>
        {isBrochureModalOpen && (
          <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-white border border-stone-200/90 rounded-3xl p-7 sm:p-9 shadow-2xl relative"
            >
              <button
                onClick={() => setIsBrochureModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 text-sm font-mono transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>

              {brochureSuccess ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                    <Check className="w-7 h-7 text-amber-800 stroke-[2.5]" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">
                    Brochure on its way!
                  </h3>
                  <p className="text-sm text-stone-600 mb-6">
                    Your PM-X Accelerator Brochure download has started automatically.
                  </p>
                  <button
                    onClick={() => setIsBrochureModalOpen(false)}
                    className="w-full py-3 rounded-full bg-[#16171A] text-white font-mono font-bold text-xs uppercase"
                  >
                    Back to Prototype
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-6 text-left">
                    <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 font-mono text-[10px] text-amber-800 uppercase tracking-widest inline-block mb-3 font-semibold">
                      OFFICIAL 8-WEEK SYLLABUS
                    </span>
                    <h3 className="text-2xl font-bold text-stone-900 mb-2 tracking-tight">
                      Download Full Curriculum Brochure
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      Instant access to the complete timetable, project deliverables, and mentor review rubric.
                    </p>
                  </div>

                  <form onSubmit={handleBrochureSubmit} className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-stone-700 uppercase mb-1">
                        Full Name *
                      </label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Rahul Sharma" 
                        className="w-full p-3.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 font-sans" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-stone-700 uppercase mb-1">
                        Email Address *
                      </label>
                      <input 
                        type="email" 
                        required 
                        placeholder="e.g. rahul@example.com" 
                        className="w-full p-3.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 font-sans" 
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-[#16171A] hover:bg-black text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer mt-2 flex items-center justify-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Curriculum PDF ➜</span>
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ENROLLMENT CHECKOUT CONFIRMATION */}
      <AnimatePresence>
        {enrollModal?.isOpen && (
          <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-white border border-stone-200/90 rounded-3xl p-7 sm:p-9 shadow-2xl relative text-left"
            >
              <button
                onClick={() => setEnrollModal(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 text-sm font-mono transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 font-mono text-[10px] font-bold uppercase tracking-wide">
                  COHORT ADMISSION
                </span>
                <span className="font-mono text-xs text-stone-500">
                  30 SEATS STRICT CAP
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[#16171A] mb-2 tracking-tight">
                Complete Your Enrollment
              </h3>

              <div className="my-5 p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs uppercase text-stone-600 font-bold">Selected Track</span>
                  <span className="font-bold text-stone-900 text-sm capitalize">
                    {enrollModal.plan.replace(/-/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-stone-200/80">
                  <span className="font-mono text-xs uppercase text-stone-600 font-bold">Total Tuition</span>
                  <span className="font-mono font-bold text-xl text-stone-900">
                    ₹{enrollModal.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed mb-6">
                To guarantee 1:1 mentor bandwidth, each cohort is strictly capped. Connect directly with the StepSmart admissions team on WhatsApp to verify alignment and finalize your seat.
              </p>

              <div className="space-y-3">
                <a
                  href={`https://wa.me/message/GH5C7YLAYIEHN1?text=Hi%20StepSmart!%20I%20want%20to%20reserve%20my%20seat%20for%20the%20PM-X%20Accelerator%20(${encodeURIComponent(enrollModal.plan)})%20for%20₹${enrollModal.amount}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full bg-[#16171A] hover:bg-black text-white font-mono font-medium text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Confirm on WhatsApp ➜</span>
                </a>
                <button
                  onClick={() => setEnrollModal(null)}
                  className="w-full py-3 rounded-full border border-stone-300 text-stone-600 hover:text-stone-900 text-xs font-mono font-medium uppercase transition-colors cursor-pointer"
                >
                  Continue Reviewing Prototype
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default PrototypeHeroPage;
