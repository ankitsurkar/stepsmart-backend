import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ChevronDown, Download, Check, Sparkles, FileText, ArrowRight, Layers, Target, Compass, Award, ShieldCheck, Lock } from 'lucide-react';

const smoothEase = [0.16, 1, 0.3, 1] as const;

// --- DOSSIER COLLAGE: LAYERED ARTIFACT STACK WITH PARALLAX FAN-OUT ---
function FolderDossierStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Layer 1 (Back PRD): fans out to top-left (-3deg -> -6deg)
  const rotate1 = useTransform(scrollYProgress, [0, 1], [-2, -6]);
  const x1 = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -10]);

  // Layer 2 (Middle Dark UI): fans out to top-right (+2deg -> +5.5deg)
  const rotate2 = useTransform(scrollYProgress, [0, 1], [2, 5.5]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 14]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -6]);

  // Layer 3 (Front Gold Seal): drops down slightly to reveal underlayers
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const scale3 = useTransform(scrollYProgress, [0, 1], [1, 1.02]);

  return (
    <div ref={containerRef} className="relative w-full pt-4 pb-4 hidden lg:block select-none pointer-events-none">
      {/* Soft warm desk shadow background */}
      <div className="absolute inset-0 bg-stone-200/40 rounded-3xl blur-2xl -z-10 transform scale-90" />

      <div className="relative h-[360px] w-full max-w-[350px]">
        {/* Layer 1: Back Card - Miniature PRD Document */}
        <motion.div
          style={{ rotate: rotate1, x: x1, y: y1 }}
          className="absolute top-0 left-1 w-[310px] bg-white border border-stone-200/90 rounded-2xl p-4 shadow-[0_12px_24px_-6px_rgba(0,0,0,0.07)] font-mono z-10"
        >
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-stone-200 text-[9px] text-stone-500 font-bold uppercase tracking-wider">
            <span>DOC: PRD_CHECKOUT_V2.1</span>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              MERGED
            </span>
          </div>
          
          <div className="space-y-1.5 mb-3">
            <div className="text-[11px] font-bold text-stone-900 font-sans truncate">
              1-Click UPI Intent &amp; Drop-off Recovery
            </div>
            <div className="h-1.5 bg-stone-100 rounded w-full" />
            <div className="h-1.5 bg-stone-100 rounded w-4/5" />
            <div className="h-1.5 bg-stone-100 rounded w-2/3" />
          </div>

          <div className="pt-2 border-t border-dashed border-stone-200 flex items-center justify-between">
            <span className="text-[9px] text-stone-400">IMPACT: +14% CONV</span>
            {/* Red Mentor Stamp */}
            <span className="px-2 py-0.5 rounded border border-rose-600 bg-rose-50/90 text-rose-700 font-bold text-[8.5px] uppercase tracking-wider rotate-[-4deg] shadow-2xs">
              APPROVED // MASTERCARD PM
            </span>
          </div>
        </motion.div>

        {/* Layer 2: Middle Card - Dark-Mode ATS Score & Metrics (Shifted down by 28px so 1-Click Drop-off is un-obscured) */}
        <motion.div
          style={{ rotate: rotate2, x: x2, y: y2 }}
          className="absolute top-[92px] left-8 w-[295px] bg-[#16171A] text-white border border-stone-800 rounded-2xl p-4 shadow-[0_18px_32px_-6px_rgba(0,0,0,0.25)] font-mono z-20"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[9px] text-stone-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-stone-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              RECRUITER SCAN
            </span>
            <span className="text-stone-400">ATS AUDIT</span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[10px] text-stone-400 uppercase">Match Score</span>
            <span className="text-lg font-bold text-emerald-400 font-sans tracking-tight">
              94 / 100
            </span>
          </div>

          {/* Mini Sparkline Trend Bars */}
          <div className="h-6 w-full flex items-end gap-1 mb-2 px-1 py-0.5 bg-white/5 rounded">
            <div className="flex-1 bg-emerald-500/40 rounded-t h-[30%]" />
            <div className="flex-1 bg-emerald-500/50 rounded-t h-[45%]" />
            <div className="flex-1 bg-emerald-500/60 rounded-t h-[40%]" />
            <div className="flex-1 bg-emerald-500/70 rounded-t h-[65%]" />
            <div className="flex-1 bg-emerald-500/80 rounded-t h-[80%]" />
            <div className="flex-1 bg-emerald-400 rounded-t h-[95%]" />
          </div>

          <div className="flex items-center justify-between text-[8px] text-stone-400">
            <span>PM KEYWORD DENSITY: 98%</span>
            <span className="text-emerald-400 font-bold">SHORTLIST READY ✓</span>
          </div>
        </motion.div>

        {/* Layer 3: Front Badge - Rubric-Backed Graduation Seal Stub (Shifted down by 44px) */}
        <motion.div
          style={{ y: y3, scale: scale3 }}
          className="absolute top-[188px] left-4 w-[295px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 border border-amber-500/80 rounded-xl p-3.5 shadow-[0_12px_24px_-4px_rgba(217,119,6,0.3)] font-mono z-30"
        >
          <div className="flex items-center justify-between border-b border-amber-900/15 pb-1.5 mb-1.5">
            <span className="text-[9.5px] font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-950" />
              RUBRIC-BACKED SEAL
            </span>
            <span className="text-[8px] font-bold bg-amber-900/15 text-amber-950 px-1.5 py-0.5 rounded">
              VERIFIED
            </span>
          </div>

          <div className="text-[11px] font-bold font-sans text-amber-950 leading-tight mb-1">
            Microsoft &amp; Mastercard PM Evaluation Committee
          </div>

          <div className="flex items-center justify-between text-[8px] text-amber-900/80 font-bold tracking-wider pt-1 border-t border-dashed border-amber-900/20">
            <span>CREDENTIAL: PASS</span>
            <span>CAPSTONE DEFENSE: 100%</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- SECTION 7: WHAT YOU'LL WALK AWAY WITH ---
export function WalkAwayEditorial() {
  const outcomes = [
    {
      num: "01",
      title: "Real-World Case Portfolio",
      desc: "An end-to-end product teardown, market validation, user research, data analysis, PRD, and a clickable prototype built from scratch.",
      tag: "FULL-STACK CAPSTONE",
      detail: "Tested against real customer friction — not a hypothetical classroom exercise."
    },
    {
      num: "02",
      title: "Recruiter-Vetted Case Study",
      desc: "A mentor-reviewed case study with rubric feedback that you can directly submit to hiring managers and recruiters as undeniable proof of competence.",
      tag: "HIRING MANAGER RUBRIC",
      detail: "Evaluated by PMs from Microsoft and Mastercard using hiring committee rubrics."
    },
    {
      num: "03",
      title: "PM-Positioned Resume & LinkedIn",
      desc: "A fully overhauled resume and LinkedIn profile engineered to translate your prior engineering, data, or operations background into executive product strategy.",
      tag: "POSITIONING REWRITE",
      detail: "Translates technical tasks into user metrics, business levers, and strategy narratives."
    },
    {
      num: "04",
      title: "Interview War-Chest",
      desc: "Scripted and tested frameworks for behavioral rounds, product sense, root cause analysis, estimation, and your personalized 'Why I'm switching' story.",
      tag: "FRAMEWORKS & SCRIPTS",
      detail: "Master RCA drills, market estimations, and craft an airtight pivot story."
    },
    {
      num: "05",
      title: "Verified Credential & Job Pipeline",
      desc: "A verified completion certificate based on evaluated assignment scores, plus 3 full months of access to our active PM hiring job board.",
      tag: "VERIFIED CREDENTIAL",
      detail: "Requires passing graded milestone reviews. Includes 90 days of vetted PM openings."
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-white border-b border-stone-200/90 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
          
          {/* Left Column: Sticky Editorial Heading & The Folder Stack / Dossier Collage */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px] font-medium tracking-[0.05em] uppercase mb-2.5"
            >
              05 CONCRETE DELIVERABLES
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
              className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-[#16171A] leading-tight mb-3"
            >
              What you’ll{' '}
              <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative underline underline-offset-[8px] decoration-amber-500/80 decoration-skip-ink">
                walk away with.
              </span>
            </motion.h2>

            {/* The "Folder Stack / Dossier" Collage (Zero Hover Needed — Parallax Fan-Out Visual Candy) */}
            <FolderDossierStack />
          </div>

          {/* Right Column: 5 Deliverable Cards (Clean, Static & Uniform) */}
          <div className="lg:col-span-7 space-y-3.5">
            {outcomes.map((item, idx) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: smoothEase }}
                whileHover={{ y: -3 }}
                className="bg-white border border-stone-200/90 hover:border-stone-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  {/* Number Badge */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 bg-stone-100 text-stone-600 border border-stone-200">
                    {item.num}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1.5 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-bold text-[#16171A] tracking-tight">
                        {item.title}
                      </h3>
                      <span className="font-mono text-[10px] font-semibold text-amber-900 bg-amber-100/80 border border-amber-300/80 px-2 py-0.5 rounded tracking-wider uppercase">
                        {item.tag}
                      </span>
                    </div>

                    <p className="text-sm text-[#475569] leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

// --- SECTION 8: THE 8 WEEKS, WEEK BY WEEK CURRICULUM ---
interface CurriculumEditorialProps {
  onOpenBrochure: () => void;
}

export function CurriculumEditorial({ onOpenBrochure }: CurriculumEditorialProps) {
  const [openWeek, setOpenWeek] = useState<number | null>(1);

  const syllabus = [
    { 
      week: 1, 
      num: "01",
      title: "Mindset & Teardown", 
      subtitle: "Product thinking mindset, live teardown & strengths storytelling",
      badge: "LIVE APP TEARDOWN",
      badgeClass: "bg-stone-100 text-stone-800 border-stone-200",
      learn: "Product thinking mindset, core heuristics, and PM problem discovery", 
      build: "Live product teardown of real-world fintech & consumer apps", 
      practice: "Strengths storytelling & user insight interview questions" 
    },
    { 
      week: 2, 
      num: "02",
      title: "Market Research & Sizing", 
      subtitle: "Business viability, TAM estimation & root cause analysis",
      badge: "GRADED MILESTONE",
      badgeClass: "bg-amber-100 text-amber-950 border-amber-300/80",
      learn: "Business viability, competitor intelligence, and market research", 
      build: "Complete market sizing deck & opportunity assessment", 
      practice: "Root cause analysis (RCA) live mock drills" 
    },
    { 
      week: 3, 
      num: "03",
      title: "User Research & JTBD", 
      subtitle: "Primary research, segmentation, journey maps & estimation",
      badge: "USER INTERVIEW SCRIPT",
      badgeClass: "bg-emerald-50 text-emerald-900 border-emerald-300/80",
      learn: "Primary user interviews, segmentation, JTBD, journey maps", 
      build: "End-to-end user persona & friction-point mapping deliverable", 
      practice: "Market sizing, estimation & executive stakeholder communication" 
    }
  ];

  return (
    <section id="curriculum" className="py-12 md:py-16 bg-[#FAF8F5] border-b border-stone-200/90 scroll-mt-20 relative overflow-hidden">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px] font-medium tracking-[0.05em] uppercase mb-2"
          >
            SYLLABUS &amp; TIMETABLE
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
            className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#16171A] mb-2"
          >
            The 8 weeks,{' '}
            <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative underline underline-offset-[8px] decoration-amber-500/80 decoration-skip-ink">
              week by week.
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
            className="text-[#475569] text-sm sm:text-base leading-[1.6] font-normal"
          >
            Wednesday learn, Sunday build, Saturday practice.
          </motion.p>
        </div>

        {/* Centered Editorial Monograph Container (Optimized ~840px for rapid scanning) */}
        <div className="relative max-w-[840px] mx-auto">
          
          {/* Side-Margin Accent 1: Top-Left Phase 01 Discovery Blueprint Stamp with (──•) Leader Line */}
          <div className="hidden xl:flex items-center absolute -left-[200px] top-6 select-none z-10 pointer-events-none">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-dashed border-[#D6D0C4] text-[10px] font-mono font-bold text-stone-700 shadow-2xs rotate-[-1.5deg]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>PHASE 01 // DISCOVERY</span>
              </div>
              <span className="text-[9px] font-mono text-stone-400 mt-0.5 text-right">
                Weeks 01–03
              </span>
            </div>

            {/* Horizontal dashed leader line (──•) pointing directly into Row 01 */}
            <div className="flex items-center w-7 ml-2">
              <div className="w-full border-t border-dashed border-amber-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 -ml-1 shrink-0" />
            </div>
          </div>

          {/* Side-Margin Accent 2: Bottom-Right Brochure Preview Stamp with (•──) Leader Line */}
          <div className="hidden xl:flex items-center absolute -right-[204px] bottom-6 select-none z-10 pointer-events-none">
            {/* Horizontal dashed leader line (•──) pointing from the card edge to the badge */}
            <div className="flex items-center w-7 mr-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 -mr-1 shrink-0" />
              <div className="w-full border-t border-dashed border-amber-400" />
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-dashed border-[#D6D0C4] shadow-xs rotate-[1.5deg] max-w-[155px]">
              <div className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold text-amber-950 uppercase mb-0.5">
                <FileText className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>PDF · 14 PAGES</span>
              </div>
              <p className="text-[9px] font-mono text-stone-600 leading-snug">
                Full rubrics &amp; mentor list
              </p>
              <span className="text-[8.5px] font-mono text-amber-800 font-bold uppercase tracking-wider block mt-1">
                Full 8 Weeks Inside
              </span>
            </div>
          </div>

          {/* The Unified 8-Week Syllabus & Brochure Monograph Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
            className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden divide-y divide-stone-200/80 text-left"
          >
            {/* Live Interactive Accordion Rows (Weeks 01–03) */}
            {syllabus.map((w) => {
              const isOpen = openWeek === w.week;

              return (
                <div key={w.week} className="transition-colors hover:bg-stone-50/50">
                  <button
                    type="button"
                    onClick={() => setOpenWeek(isOpen ? null : w.week)}
                    className="w-full py-5 sm:py-6 px-5 sm:px-8 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0 pr-4">
                      {/* Naked Numeric Monospace Indicator */}
                      <span className="font-mono font-bold text-base sm:text-lg text-amber-700 shrink-0 tracking-wider w-8">
                        {w.num}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-base sm:text-lg font-bold text-[#16171A] group-hover:text-amber-800 transition-colors tracking-tight">
                            {w.title}
                          </span>
                          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded uppercase tracking-wider border ${w.badgeClass}`}>
                            {w.badge}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-500 truncate mt-1 font-normal">
                          {w.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono font-medium text-stone-400 uppercase hidden sm:inline">
                        {isOpen ? 'Close' : 'View Syllabus'}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-stone-500 stroke-[2]" />
                      </motion.div>
                    </div>
                  </button>

                  {/* Expanded 3-Card Grid: Full Width Alignment (No Left Void Under Number) */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: smoothEase }}
                        className="overflow-hidden bg-[#FAF8F5]/80 border-t border-stone-200/60"
                      >
                        <div className="p-5 sm:p-6 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs sm:text-sm">
                          <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between">
                            <div>
                              <b className="text-amber-900 block mb-1.5 font-mono font-bold text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Learn · Wednesday (2h)
                              </b>
                              <span className="text-[#475569] leading-relaxed block text-xs font-normal">{w.learn}</span>
                            </div>
                          </div>
                          <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between">
                            <div>
                              <b className="text-stone-900 block mb-1.5 font-mono font-bold text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                                Build · Sunday (2h)
                              </b>
                              <span className="text-[#475569] leading-relaxed block text-xs font-normal">{w.build}</span>
                            </div>
                          </div>
                          <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between">
                            <div>
                              <b className="text-emerald-900 block mb-1.5 font-mono font-bold text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Practice · Saturday (2h)
                              </b>
                              <span className="text-[#475569] leading-relaxed block text-xs font-normal">{w.practice}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Row 4: Locked Weeks 04–08 Teaser Row */}
            <div 
              onClick={onOpenBrochure}
              className="transition-all bg-[#FAF8F5]/50 hover:bg-amber-50/50 cursor-pointer group relative"
            >
              <button
                type="button"
                className="w-full py-5 sm:py-6 px-5 sm:px-8 flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0 pr-4">
                  {/* Vertical Range 04 ↓ 08 Stack: Preserves exact w-8 alignment with 01, 02, 03 */}
                  <div className="w-8 shrink-0 flex flex-col items-center justify-center font-mono font-bold text-xs text-stone-500 group-hover:text-amber-800 transition-colors leading-none gap-0.5 select-none py-0.5">
                    <span>04</span>
                    <span className="text-[9px] text-amber-500 leading-none">↓</span>
                    <span>08</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-bold text-[#16171A] group-hover:text-amber-900 transition-colors tracking-tight">
                        Product Strategy, PRDs, AI Prototyping &amp; Mock Loops
                      </span>
                      <span className="bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-mono font-semibold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                        5 MORE WEEKS
                      </span>
                      <span className="bg-amber-100 text-amber-950 border border-amber-300/80 text-[10px] font-mono font-semibold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                        CAPSTONE DEFENSE
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal leading-relaxed">
                      Clickable prototype, API architecture, behavioral mocks &amp; 1:1 defense with Microsoft &amp; Mastercard PMs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono font-bold text-amber-800 uppercase hidden sm:inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Unlock in Syllabus</span>
                    <span>→</span>
                  </span>
                  <span className="sm:hidden text-amber-700">
                    <Lock className="w-4 h-4" />
                  </span>
                </div>
              </button>
            </div>

            {/* Integrated Brochure Unlock Footer Bar */}
            <div 
              onClick={onOpenBrochure}
              className="bg-gradient-to-r from-stone-50 via-amber-50/60 to-stone-50 border-t border-amber-200/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group select-none transition-colors hover:from-amber-100/60 hover:to-amber-50"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#16171A] group-hover:bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs transition-colors">
                  <Download className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm sm:text-base font-bold text-[#16171A] tracking-tight group-hover:text-amber-950 transition-colors">
                      Want the full 8-week syllabus?
                    </h4>
                    <span className="text-[10px] font-mono font-bold tracking-[0.05em] text-amber-950 bg-amber-200/80 border border-amber-300 px-2 py-0.5 rounded uppercase">
                      WEEKS 01–08 · PDF TIMETABLE
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 truncate mt-0.5 font-normal">
                    Data analysis, PRD specs, clickable prototypes, system APIs, and capstone rubrics.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center self-start sm:self-auto">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16171A] group-hover:bg-amber-600 text-white text-xs font-mono font-medium tracking-[0.05em] uppercase rounded-xl shadow-md transition-all pointer-events-none"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Get Full Brochure ➜</span>
                </button>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}

// --- SECTION 9: WHY THIS IS DIFFERENT ---
export function WhyDifferentEditorial() {
  const comparisons = [
    {
      dimension: "01 // COHORT DENSITY",
      pmxTitle: "Small batch, 30 seats",
      pmxDesc: "Strictly capped · Real 1:1 mentor feedback on every project",
      othersTag: "01 // MASS WEBINAR",
      othersTitle: "Hundreds of students",
      othersDesc: "Mass cohorts of 200–500 · Lost in Zoom chat of 400"
    },
    {
      dimension: "02 // LEARNING MODE",
      pmxTitle: "24 live classes, 48 live hours",
      pmxDesc: "16h Learn + 16h Build + 16h Practice · Wednesday, Saturday & Sunday",
      othersTag: "02 // PASSIVE VOD",
      othersTitle: "Videos only",
      othersDesc: "Pre-recorded VOD graveyard · <8% average completion rate"
    },
    {
      dimension: "03 // PORTFOLIO OUTPUT",
      pmxTitle: "Real production project portfolios",
      pmxDesc: "Teardown to tested PRD & prototype with Mastercard & Microsoft PMs",
      othersTag: "03 // CLONED TEMPLATE",
      othersTitle: "Generic templates",
      othersDesc: "Re-used Spotify/Swiggy clones recruiters reject on sight"
    },
    {
      dimension: "04 // INTERVIEW PREP",
      pmxTitle: "Live practice classes & question banks",
      pmxDesc: "Live unscripted mock loops, RCA drills & daily PM Gym",
      othersTag: "04 // ZERO FEEDBACK",
      othersTitle: "No mock interviews",
      othersDesc: "Passive framework lists · Zero live pressure testing"
    },
    {
      dimension: "05 // POST-COHORT",
      pmxTitle: "Chat doubt support & 3 months of job board",
      pmxDesc: "Active doubt channel during cohort + 90-day curated PM job board access",
      othersTag: "05 // ZERO SUPPORT",
      othersTitle: "Support ends at payment",
      othersDesc: "Access expires at checkout · Zero placement or referral network"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-white border-b border-stone-200/90 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Centered Heading */}
        <div className="text-center mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px] font-medium tracking-[0.05em] uppercase mb-2"
          >
            THE STRUCTURAL CONTRAST
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
            className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#16171A]"
          >
            Why this is{' '}
            <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative underline underline-offset-[8px] decoration-amber-500/80 decoration-skip-ink">
              different.
            </span>
          </motion.h2>
        </div>

        {/* Wide Split Comparison Deck (max-w-5xl, Zero Floating Side Notes) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
          className="relative w-full max-w-5xl mx-auto text-left rounded-3xl bg-[#F5F3EF] border border-stone-200/90 shadow-sm overflow-hidden"
        >
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch border-b border-stone-200">
            
            {/* Left Column Header: PM-X by StepSmart (Elevated Warm White) */}
            <div className="py-5 px-6 sm:px-8 bg-white flex items-center justify-between border-t-2 border-t-amber-500 md:border-r border-stone-200 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.05em] text-[#16171A] uppercase">
                  PM-X BY STEPSMART
                </span>
              </div>
              <span className="bg-amber-100 text-amber-950 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded uppercase tracking-wider border border-amber-300">
                VERIFIED FORMAT
              </span>
            </div>

            {/* Right Column Header: Most PM Courses (Recessed Muted Gray) */}
            <div className="py-5 px-6 sm:px-8 bg-[#EFECE6] flex items-center justify-between">
              <span className="text-xs sm:text-sm font-mono font-medium tracking-[0.05em] text-stone-500 uppercase">
                MOST PM COURSES
              </span>
              <span className="bg-stone-200/80 text-stone-600 text-[10px] font-mono font-medium px-2.5 py-0.5 rounded uppercase tracking-wider">
                PASSIVE FORMAT
              </span>
            </div>
          </div>

          {/* Paired Comparison Rows with Symmetrical Monospace Eyebrow Badges */}
          <div className="divide-y divide-stone-200/80">
            {comparisons.map((item, idx) => (
              <div 
                key={idx} 
                className="grid grid-cols-1 md:grid-cols-2 items-stretch transition-colors group"
              >
                {/* Left Column: PM-X by StepSmart (Pure White, Elevated) */}
                <div className="py-5 sm:py-6 px-6 sm:px-8 bg-white md:border-r border-stone-200 flex items-start gap-3.5 group-hover:bg-amber-50/20 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-100/70 border border-amber-300/70 px-2 py-0.5 rounded tracking-wider uppercase inline-block mb-1.5">
                      {item.dimension}
                    </span>
                    <b className="text-base sm:text-lg font-bold text-[#16171A] block leading-snug">
                      {item.pmxTitle}
                    </b>
                    <span className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed block mt-1">
                      {item.pmxDesc}
                    </span>
                  </div>
                </div>

                {/* Right Column: Most PM Courses (Recessed Muted Gray with Soft Translucent Strikethrough) */}
                <div className="py-5 sm:py-6 px-6 sm:px-8 bg-[#F5F3EF] flex items-start gap-3.5 group-hover:bg-[#EFECE6] transition-colors">
                  <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-rose-500 font-bold text-xs">✕</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] font-medium text-stone-500 bg-stone-200/60 border border-stone-300/60 px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-1.5">
                      {item.othersTag}
                    </span>
                    <span className="text-base sm:text-lg font-medium text-stone-600 block leading-snug line-through decoration-stone-400/50 decoration-1">
                      {item.othersTitle}
                    </span>
                    <span className="text-xs sm:text-sm text-stone-400 font-normal leading-relaxed block mt-1">
                      {item.othersDesc}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* High-Impact Integrated Bottom-Line Outcome Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch border-t-2 border-stone-200">
            
            {/* Left Column Outcome (PM-X) */}
            <div className="p-5 sm:p-6 bg-[#16171A] text-white md:border-r border-stone-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-amber-300 block mb-0.5">
                    PM-X OUTCOME
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-white leading-tight">
                    Shortlist-Ready Portfolio + 1:1 Microsoft/Mastercard Sign-off
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">
                SHORTLISTED
              </span>
            </div>

            {/* Right Column Outcome (Industry Average) */}
            <div className="p-5 sm:p-6 bg-[#EFECE6] text-stone-700 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <span className="text-rose-600 font-bold text-sm">✕</span>
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-rose-700 block mb-0.5">
                    INDUSTRY AVERAGE
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-stone-600 leading-tight">
                    Unwatched VODs + Generic Certificate Rejected by ATS
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded bg-rose-100 text-rose-700 border border-rose-200 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">
                GHOSTED
              </span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
