import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, CheckCircle2, X, Check, Compass, Layers, ShieldCheck, Clock, Calendar, Sparkles, FileText, CornerDownRight, ArrowRight } from 'lucide-react';

const smoothEase = [0.16, 1, 0.3, 1] as const;

// --- SECTION 4: THE 3 TRANSITION STORIES ---
export function TransitionStoriesEditorial() {
  const stories = [
    {
      id: '01',
      path: 'PATH: OPERATIONS / QA / BA → PM',
      img: '/hero-slide-1.webp',
      alt: 'Operations / QA / BA to PM career transition'
    },
    {
      id: '02',
      path: 'PATH: SDE / TECH LEAD → PM',
      img: '/hero-slide-2.webp',
      alt: 'SDE / Tech Lead to PM career transition'
    },
    {
      id: '03',
      path: 'PATH: UNDERGRADUATE → APM',
      img: '/hero-slide-3.webp',
      alt: 'Undergraduate to APM career transition'
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-white border-b border-stone-200/90 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px] font-medium tracking-[0.05em] uppercase mb-2.5"
          >
            THE TRANSITION STORIES
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-[#16171A] leading-tight"
          >
            There is no single formula for entering{' '}
            <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative underline underline-offset-[8px] decoration-amber-500/80 decoration-skip-ink">
              product.
            </span>
          </motion.h2>
        </div>

        {/* 3 Editorial Cards: Full Image Banners with Zero Text Clipping + Highlighted Warm Pathway Pill */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: smoothEase }}
              whileHover={{ y: -5 }}
              className="group bg-[#FAF8F5] border border-stone-200/90 rounded-2xl p-4 shadow-[0_12px_30px_-8px_rgba(25,20,15,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(25,20,15,0.08)] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Full Aspect-Ratio Image Container (1024x536): No left clipping of text or graphics */}
                <div className="w-full aspect-[1024/536] rounded-xl overflow-hidden border border-stone-200/80 bg-stone-100 relative shadow-sm">
                  <img
                    src={story.img}
                    alt={story.alt}
                    className="w-full h-full object-contain sm:object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                </div>
              </div>

              {/* Highlighted Warmer Pathway Pill (Easy Scanning & High Contrast) */}
              <div className="pt-4 mt-3 flex items-center justify-between border-t border-stone-200/80">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-950 border border-amber-300/70 font-mono text-[11px] font-medium tracking-[0.05em] uppercase shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  {story.path}
                </span>
                <span className="w-7 h-7 rounded-full bg-stone-100 group-hover:bg-[#16171A] group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-colors" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

// --- SECTION 5: WHY MOST PEOPLE STAY STUCK & THE REFRAME (With Margin Notes & Interactive Fixes) ---
export function StuckReframeEditorial() {
  const [activeBox, setActiveBox] = useState<number | null>(null);

  const painPoints = [
    {
      id: 0,
      problem: "You’ve watched the videos and read the casebooks, and nothing is sticking.",
      fixTitle: "The StepSmart Fix: Live Build Sprints",
      fixDesc: "Passive consumption fails. You solve live unscripted prompts every Wednesday & Saturday with Microsoft PMs. You don't memorize frameworks—you build intuition.",
      bulletTag: "SOLVE > MEMORIZE"
    },
    {
      id: 1,
      problem: "Your resume says analyst or engineer. Recruiters can’t see PM.",
      fixTitle: "The StepSmart Fix: Impact-First Metric Rewrite",
      fixDesc: "Line-by-line 1:1 teardown. We translate technical tasks into user metrics, conversion funnels, and revenue impact recruiters recognize instantly.",
      bulletTag: "IMPACT > TASKS"
    },
    {
      id: 2,
      problem: "You’re worried about “faking it.”",
      fixTitle: "The StepSmart Fix: Verifiable Proof of Work",
      fixDesc: "Zero faking needed. You graduate with a tested capstone PRD, architecture spec, and recorded mock interview transcripts proving real competence.",
      bulletTag: "PROOF > PEDIGREE"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-[#FAF8F5] border-b border-stone-200/90 relative overflow-hidden">
      
      {/* Structural Architectural Guide Rails (1px dashed lines running down the edges) */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none px-4 sm:px-6 lg:px-8">
        <div className="w-full h-full border-l border-r border-dashed border-stone-300/60 hidden xl:block" />
      </div>

      {/* Blueprint Grid Texture Background */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #16171A 1px, transparent 1px),
            linear-gradient(to bottom, #16171A 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px] font-medium tracking-[0.05em] uppercase mb-2"
          >
            THE BOTTLENECK DIAGNOSTIC
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#16171A]"
          >
            Why most people stay{' '}
            <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative underline underline-offset-[8px] decoration-amber-500/80 decoration-skip-ink">
              stuck.
            </span>
          </motion.h2>
        </div>

        {/* 3-COLUMN ARCHITECTURAL WORKBOOK LAYOUT (Left Margin Notes + Center Cards + Right Margin Notes) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 xl:gap-8 items-start relative mb-8">
          
          {/* ================= LEFT MARGIN (DIFFERENTIATED TINTED PAPER CARDS) ================= */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-12 pt-2 select-none">
            
            {/* Artifact 1: The "Passive Learning Trap" Sticky Tab Stack (Next to Box 0) */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: smoothEase }}
                className={`p-4 rounded-xl bg-[#FAF7F0]/95 border border-dashed transition-all duration-300 transform scale-[0.94] rotate-[-1.5deg] cursor-pointer origin-right ${
                  activeBox === 0 
                    ? 'border-amber-400 ring-2 ring-amber-300/50 shadow-md opacity-100 rotate-[-0.5deg]' 
                    : activeBox !== null 
                      ? 'border-[#D6D0C4] opacity-55' 
                      : 'border-[#D6D0C4] opacity-85 hover:opacity-100 hover:border-stone-400'
                }`}
                onClick={() => setActiveBox(activeBox === 0 ? null : 0)}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/80 text-[10px] font-mono text-stone-500 font-medium">
                  <span>24 TABS OPEN</span>
                  <span className="text-rose-600 font-bold uppercase">PASSIVE TRAP</span>
                </div>
                <ul className="space-y-1.5 text-[11px] font-mono text-stone-600 leading-tight">
                  <li className="truncate">📄 Cracking_PM_Interview.pdf</li>
                  <li className="truncate">🔄 CIRCLES_Framework_Notes</li>
                  <li className="truncate">▶ YouTube Case Mocks (2x)</li>
                </ul>
                <div className="mt-3 pt-2 border-t border-stone-200/80 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded border border-rose-600/80 bg-rose-50 text-rose-700 font-mono font-bold text-[9px] uppercase tracking-wider">
                    [ 0% RETAINED ]
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">#Diagnostic</span>
                </div>
              </motion.div>

              {/* Dashed Leader Line (Connecting to Center Row 0) */}
              <div className={`hidden lg:flex items-center absolute -right-6 top-1/2 -translate-y-1/2 w-6 transition-opacity duration-300 pointer-events-none ${
                activeBox === 0 ? 'opacity-100' : 'opacity-40'
              }`}>
                <div className="w-full border-t-2 border-dashed border-amber-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 -ml-1 shrink-0" />
              </div>
            </div>

            {/* Artifact 3: "Evidence vs. Certificates" Schematic Stamp (Next to Box 2) */}
            <div className="relative pt-12">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
                className={`p-4 rounded-xl bg-[#FAF7F0]/95 border border-dashed transition-all duration-300 transform scale-[0.94] rotate-[-1.5deg] select-none origin-right cursor-pointer ${
                  activeBox === 2 
                    ? 'border-amber-400 ring-2 ring-amber-300/50 shadow-md opacity-100 rotate-[-0.5deg]' 
                    : activeBox !== null 
                      ? 'border-[#D6D0C4] opacity-55' 
                      : 'border-[#D6D0C4] opacity-85 hover:opacity-100 hover:border-stone-400'
                }`}
                onClick={() => setActiveBox(activeBox === 2 ? null : 2)}
              >
                <div className="text-[10px] font-mono font-medium tracking-[0.05em] text-stone-500 uppercase mb-2">
                  OUTPUT SCHEMATIC // PROOF
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2 rounded bg-white/70 border border-stone-200 text-stone-500 flex items-center justify-between">
                    <span>Unverified Video Course</span>
                    <span className="text-rose-500 font-bold">✕</span>
                  </div>
                  <div className="p-2 rounded bg-amber-50/90 border border-amber-300 text-amber-950 font-semibold flex items-center justify-between shadow-xs">
                    <span>Tested PRD + Prototype</span>
                    <span className="text-emerald-600 font-bold">✓</span>
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-mono font-medium tracking-[0.05em] text-stone-500 text-center uppercase">
                  VERIFIABLE ARTIFACTS ONLY
                </div>
              </motion.div>

              {/* Dashed Leader Line (Connecting to Center Row 2) */}
              <div className={`hidden lg:flex items-center absolute -right-6 top-1/2 -translate-y-1/2 w-6 transition-opacity duration-300 pointer-events-none ${
                activeBox === 2 ? 'opacity-100' : 'opacity-40'
              }`}>
                <div className="w-full border-t-2 border-dashed border-amber-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 -ml-1 shrink-0" />
              </div>
            </div>

          </div>

          {/* ================= CENTER COLUMN (THE 3 PRIMARY SOLID-WHITE INTERACTIVE CARDS) ================= */}
          <div className="lg:col-span-6 w-full max-w-2xl mx-auto space-y-4">
            
            {painPoints.map((item) => {
              const isActive = activeBox === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: item.id * 0.1, ease: smoothEase }}
                  onMouseEnter={() => setActiveBox(item.id)}
                  onClick={() => setActiveBox(isActive ? null : item.id)}
                  className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-sm transition-all cursor-pointer relative overflow-hidden ${
                    isActive 
                      ? 'border-amber-400 ring-2 ring-amber-300/40 shadow-md' 
                      : 'border-stone-200/90 hover:border-stone-300'
                  }`}
                >
                  {/* Card Header Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      {/* Morphing Icon: Red ✕ -> Green ✓ */}
                      <motion.div 
                        animate={{ 
                          scale: isActive ? 1.05 : 1,
                          backgroundColor: isActive ? '#ECFDF5' : '#FFF1F2',
                          borderColor: isActive ? '#A7F3D0' : '#FECDD3'
                        }}
                        className="w-7 h-7 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                      >
                        {isActive ? (
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        ) : (
                          <X className="w-4 h-4 text-rose-500 stroke-[2.5]" />
                        )}
                      </motion.div>
                      
                      <div>
                        <p className={`text-sm sm:text-base font-medium leading-relaxed transition-colors ${
                          isActive ? 'text-stone-900 font-semibold' : 'text-stone-700'
                        }`}>
                          {item.problem}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Prompt Pill */}
                    <div className="shrink-0 pt-0.5">
                      <span className={`font-mono text-[10px] font-medium tracking-[0.05em] px-2 py-0.5 rounded transition-all ${
                        isActive 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                      }`}>
                        {isActive ? 'THE FIX ✓' : 'HOVER TO FIX →'}
                      </span>
                    </div>
                  </div>

                  {/* Expandable "The StepSmart Fix" Drawer (Zero Text Clipping) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: smoothEase }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-amber-200/80 bg-amber-50/70 rounded-xl px-5 py-4">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="font-mono text-[10px] font-bold text-amber-900 uppercase tracking-widest">
                              {item.fixTitle}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 font-mono text-[9px] font-bold">
                              {item.bulletTag}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                            {item.fixDesc}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

          </div>

          {/* ================= RIGHT MARGIN (DIFFERENTIATED TINTED PAPER CARDS) ================= */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-10 pt-16 select-none">
            
            {/* Artifact 2: The "Recruiter 6-Second Scan" Mini-Resume Sketch (Next to Box 1) */}
            <div className="relative">
              {/* Dashed Leader Line (Connecting to Center Row 1) */}
              <div className={`hidden lg:flex items-center absolute -left-6 top-1/2 -translate-y-1/2 w-6 transition-opacity duration-300 pointer-events-none ${
                activeBox === 1 ? 'opacity-100' : 'opacity-40'
              }`}>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 -mr-1 shrink-0" />
                <div className="w-full border-t-2 border-dashed border-amber-400" />
              </div>

              <motion.div
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15, ease: smoothEase }}
                className={`p-4 rounded-xl bg-[#FAF7F0]/95 border border-dashed transition-all duration-300 transform scale-[0.94] rotate-[1.5deg] cursor-pointer origin-left ${
                  activeBox === 1 
                    ? 'border-amber-400 ring-2 ring-amber-300/50 shadow-md opacity-100 rotate-[0.5deg]' 
                    : activeBox !== null 
                      ? 'border-[#D6D0C4] opacity-55' 
                      : 'border-[#D6D0C4] opacity-85 hover:opacity-100 hover:border-stone-400'
                }`}
                onClick={() => setActiveBox(activeBox === 1 ? null : 1)}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/80 text-[10px] font-mono text-stone-500 font-medium">
                  <span>RECRUITER 6-SEC SCAN</span>
                  <span className="text-amber-800 font-bold">RESUME CRITIQUE</span>
                </div>
                
                {/* Strike-Through Bullet */}
                <div className="mb-2 text-[11px] font-mono text-stone-400 line-through decoration-rose-500 decoration-2 leading-tight">
                  "Built backend APIs in Node.js and improved query speeds by 20%."
                </div>

                {/* Mentor Comment Bubble */}
                <div className="p-2 rounded bg-rose-50/80 border border-rose-200 text-[10px] font-mono text-rose-800 leading-tight mb-3">
                  ← Reads like an SDE, not a PM. Where is user adoption &amp; business metrics?
                </div>

                {/* Corrected PM Impact Bullet */}
                <div className="p-2 rounded bg-emerald-50/90 border border-emerald-200 text-[11px] font-mono text-emerald-950 font-medium leading-tight">
                  ✓ "Spearheaded checkout API migration → reduced drop-off 14%, driving ₹42L incremental GMV."
                </div>
              </motion.div>
            </div>

          </div>

        </div>

        {/* The Signature Reframe Statement (Aligned to 2XL Center Column) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
          className="relative max-w-2xl mx-auto rounded-3xl bg-[#16171A] text-white p-6 sm:p-8 text-center shadow-xl shadow-stone-900/10 overflow-hidden border border-stone-800"
        >
          {/* Subtle warm amber ambient crown */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <span className="font-mono text-[10px] uppercase font-medium tracking-[0.05em] text-amber-300 block mb-2.5">
            THE STEPSMART REFRAME
          </span>
          <p className="font-editorial italic text-2xl sm:text-3xl md:text-4xl font-normal leading-snug tracking-tight text-white mb-3">
            “You don’t lack experience. <br />
            You lack <span className="text-amber-400 not-italic font-sans font-bold">evidence.</span>”
          </p>
          <div className="pt-3.5 border-t border-white/10 text-xs font-mono font-medium tracking-[0.05em] text-stone-400 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>PROOF OF WORK OVER PASSIVE CERTIFICATES</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// --- SECTION 6: THE 4-PILLAR SYSTEM (Learn · Build · Practice · Career) ---
export function PillarSystemEditorial() {
  const pillars = [
    {
      num: '01',
      name: 'LEARN',
      badge: 'Start here',
      itemsCount: '03 items',
      schedule: 'Wednesday Live · 16 hrs',
      scheduleBg: 'bg-stone-100 text-stone-800 border-stone-200',
      points: [
        { title: 'Pre-recorded PM modules', desc: 'Core concepts and frameworks, at your pace.' },
        { title: '8 live Learn classes', desc: 'Wednesday, 16 live hours.' },
        { title: 'Recording of every class', desc: 'Miss one, catch up within hours.' }
      ]
    },
    {
      num: '02',
      name: 'BUILD',
      badge: null,
      itemsCount: '03 items',
      schedule: 'Sunday Live · 16 hrs',
      scheduleBg: 'bg-stone-100 text-stone-800 border-stone-200',
      points: [
        { title: '8 live Build classes', desc: 'Sunday, 16 live hours.' },
        { title: 'One real project', desc: 'Teardown to prototype, with mentor review.' },
        { title: 'Graded assignments', desc: 'Real deliverables, rubric feedback.' }
      ]
    },
    {
      num: '03',
      name: 'PRACTICE',
      badge: null,
      itemsCount: '03 items',
      schedule: 'Saturday Live · 16 hrs',
      scheduleBg: 'bg-stone-100 text-stone-800 border-stone-200',
      points: [
        { title: '8 live Practice classes', desc: 'Saturday, 16 live hours, with mock rounds.' },
        { title: 'Interview question banks', desc: 'Product design, RCA, metrics, behavioural.' },
        { title: 'Daily PM Gym', desc: 'A bite-sized product question every day.' }
      ]
    },
    {
      num: '04',
      name: 'CAREER',
      badge: null,
      itemsCount: '03 items',
      schedule: 'Transition-Ready',
      scheduleBg: 'bg-amber-100 text-amber-950 border-amber-200',
      points: [
        { title: 'Job board access', desc: 'Fresh PM roles, free for 3 months after cohort.' },
        { title: '1:1 Resume & LinkedIn Teardown', desc: 'Rewritten for PM shortlists, ATS filters, and recruiter scans.' },
        { title: 'Completion certificate', desc: 'For verified attendance and assignment scores.' }
      ]
    }
  ];

  return (
    <section id="system" className="py-12 md:py-16 bg-white border-b border-stone-200/90 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 font-mono text-[11px] font-medium tracking-[0.05em] uppercase mb-2"
          >
            THE 8-WEEK BLUEPRINT
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
            className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#16171A] mb-2"
          >
            Learn. Build. Practice.{' '}
            <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative underline underline-offset-[8px] decoration-amber-500/80 decoration-skip-ink">
              Career.
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
            className="text-[#475569] text-sm sm:text-base leading-[1.6] font-normal"
          >
            One system, 8 weeks, 6 live hours a week. Chat doubt support runs through all four steps.
          </motion.p>
        </div>

        {/* Clean, Architectural 4-Column Monograph Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch relative">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.12, ease: smoothEase }}
              whileHover={{ y: -5 }}
              className="group bg-[#FAF8F5] border border-stone-200/90 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 transition-all flex flex-col justify-between h-full p-6 relative"
            >
              {/* Connected Pipeline Arrow (Desktop Indicator on Steps 01, 02, 03) */}
              {idx < 3 && (
                <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white border border-stone-200 text-stone-400 group-hover:text-amber-600 group-hover:border-amber-300 items-center justify-center font-mono text-xs shadow-2xs transition-colors pointer-events-none">
                  →
                </div>
              )}

              <div>
                {/* Monograph Top Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-5">
                  <span className="font-mono text-2xl font-bold text-stone-400 group-hover:text-amber-600 transition-colors">
                    {pillar.num}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    {pillar.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-900 border border-amber-300 font-bold uppercase">
                        {pillar.badge}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-white text-stone-600 border border-stone-200 font-medium tracking-[0.05em]">
                      {pillar.itemsCount}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-[#16171A] mb-4">
                  {pillar.name}
                </h3>

                {/* Pillar Items */}
                <ul className="space-y-4">
                  {pillar.points.map((pt, pIdx) => (
                    <li key={pIdx} className="pt-3 border-t border-stone-200/80 first:border-0 first:pt-0">
                      <b className="text-[#0F172A] text-sm block mb-0.5 font-bold">
                        {pt.title}
                      </b>
                      <span className="text-[#475569] text-xs sm:text-sm font-normal leading-[1.6] block">
                        {pt.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Schedule Badge */}
              <div className={`mt-6 p-2.5 rounded-lg border text-center font-mono font-medium text-xs tracking-[0.05em] uppercase ${pillar.scheduleBg}`}>
                {pillar.schedule}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
