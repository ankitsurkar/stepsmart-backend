import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, ArrowRight, ArrowDown, MessageCircle, ShieldCheck, Clock, Users, Sparkles } from 'lucide-react';

const smoothEase = [0.16, 1, 0.3, 1] as const;

interface PricingEditorialProps {
  countdownText: string;
  onEnroll: (plan: string, amount: number) => void;
}

// --- SECTION 13: WHAT YOU GET, STACKED (PRICING & MODULAR) ---
export function PricingEditorial({ countdownText, onEnroll }: PricingEditorialProps) {
  // Main Cohort 1:1 Mentoring Add-on state
  const [includeMentoring, setIncludeMentoring] = useState(false);

  // Modular Unbundling state (Pre-select BUILD by default so section is active at rest)
  const [selectedBuild, setSelectedBuild] = useState(true);
  const [selectedPractice, setSelectedPractice] = useState(false);
  const [selected1to1, setSelected1to1] = useState(false);

  const isEarlyBird = true; // matches production logic
  const baseFullPrice = isEarlyBird ? 15000 : 20000;
  const cohortTotal = baseFullPrice + (includeMentoring ? 5000 : 0);

  // Dynamic modular calculations
  let modularTotal = 0;
  if (selectedBuild) modularTotal += 5000;
  if (selectedPractice) modularTotal += 5000;
  if (selected1to1) modularTotal += 5000;

  const modularLabels: string[] = [];
  if (selectedBuild) modularLabels.push('Build');
  if (selectedPractice) modularLabels.push('Practice');
  if (selected1to1) modularLabels.push('1:1 Mentoring');
  const modularLabel = modularLabels.join(' + ');

  return (
    <section id="pricing" className="py-12 md:py-16 bg-white border-b border-stone-200/90 scroll-mt-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px] font-medium tracking-[0.05em] uppercase mb-2"
          >
            TUITION &amp; DELIVERABLES
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
            className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#16171A] mb-2.5"
          >
            What you get,{' '}
            <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative underline underline-offset-[8px] decoration-amber-500/80 decoration-skip-ink">
              stacked.
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
            className="text-[#475569] text-sm sm:text-base leading-relaxed font-normal"
          >
            Everything is live and mentor-led. Nothing here is a pre-recorded video cemetery.
          </motion.p>
        </div>

        {/* 2-Column Split: Deliverables Stack (60%) + Checkout Admission Ticket (40%) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25, ease: smoothEase }}
          className="bg-white border border-stone-200/90 rounded-3xl shadow-sm overflow-hidden text-left grid grid-cols-1 lg:grid-cols-12 mb-10"
        >
          {/* Left Column (60% ~ 7 cols): The 4 Deliverables Rows */}
          <div className="lg:col-span-7 flex flex-col justify-between divide-y divide-stone-200/80 bg-white">
            {/* 01 Learn */}
            <div className="p-5 sm:p-6 hover:bg-stone-50/50 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    01 //
                  </span>
                  <span className="text-[#16171A] font-bold text-sm sm:text-base">
                    Learn
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-semibold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded tracking-wide uppercase">
                    WED · 16H
                  </span>
                  <span className="font-mono font-bold text-stone-900 text-sm sm:text-base">
                    ₹10,000
                  </span>
                </div>
              </div>
              <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed">
                8 live classes (16 hrs, Wednesday), pre-recorded foundation modules, and recording of every class.
              </p>
            </div>

            {/* 02 Build */}
            <div className="p-5 sm:p-6 hover:bg-stone-50/50 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    02 //
                  </span>
                  <span className="text-[#16171A] font-bold text-sm sm:text-base">
                    Build
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-semibold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded tracking-wide uppercase">
                    SUN · 16H
                  </span>
                  <span className="font-mono font-bold text-stone-900 text-sm sm:text-base">
                    ₹5,000
                  </span>
                </div>
              </div>
              <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed">
                8 live classes (16 hrs, Sunday), one real project from teardown to prototype, and weekly graded assignments.
              </p>
            </div>

            {/* 03 Practice */}
            <div className="p-5 sm:p-6 hover:bg-stone-50/50 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    03 //
                  </span>
                  <span className="text-[#16171A] font-bold text-sm sm:text-base">
                    Practice
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-semibold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded tracking-wide uppercase">
                    SAT · 16H
                  </span>
                  <span className="font-mono font-bold text-stone-900 text-sm sm:text-base">
                    ₹5,000
                  </span>
                </div>
              </div>
              <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed">
                8 live classes (16 hrs, Saturday), interview question banks, mock rounds, and Daily PM Gym.
              </p>
            </div>

            {/* 04 Career & Support */}
            <div className="p-5 sm:p-6 hover:bg-stone-50/50 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    04 //
                  </span>
                  <span className="text-[#16171A] font-bold text-sm sm:text-base">
                    Career &amp; Support
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-semibold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded tracking-wide uppercase">
                    INCLUDED
                  </span>
                </div>
              </div>
              <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed">
                1:1 Resume &amp; LinkedIn teardown, 3-month job board access, completion certificate, and 24/7 chat support.
              </p>
            </div>

            {/* Left Footnote Strip */}
            <div className="bg-[#FAF8F5] px-5 sm:px-6 py-3.5 flex items-center justify-between mt-auto border-t border-stone-200/80">
              <span className="font-mono text-[11px] text-stone-500 font-medium">
                TOTAL SEPARATE VALUE
              </span>
              <span className="font-mono text-sm text-stone-400 line-through font-bold">
                ₹20,000
              </span>
            </div>
          </div>

          {/* Right Column (40% ~ 5 cols): Admission Ticket Checkout Card */}
          <div className="lg:col-span-5 bg-[#16171A] text-white p-6 sm:p-7 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-stone-800 relative">
            <div>
              {/* Ticket Eyebrow & Save Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-mono text-[10px] sm:text-[10.5px] font-bold text-amber-400 uppercase tracking-wider">
                  FULL 8-WEEK FELLOWSHIP
                </span>
                <span className="font-mono text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  SAVE ₹5,000
                </span>
              </div>

              {/* Price Block */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-xs text-stone-400 line-through">
                    ₹{includeMentoring ? '25,000' : '20,000'}
                  </span>
                  <span className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    ₹{cohortTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/70 border border-amber-800/80 text-amber-300 font-mono text-[10px] sm:text-[10.5px] font-medium tracking-wide uppercase">
                  <span>⚡ EARLY BIRD ENDS TODAY, 31 OCT</span>
                </div>
              </div>

              {/* Add 1:1 Mentoring Upsell Inside Ticket */}
              <div
                onClick={() => setIncludeMentoring(!includeMentoring)}
                className={`p-3 rounded-xl border transition-all cursor-pointer select-none mb-4 ${
                  includeMentoring 
                    ? 'bg-amber-950/50 border-amber-500/80 ring-1 ring-amber-500/40 text-white' 
                    : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                    includeMentoring ? 'bg-amber-500 text-stone-950' : 'border border-stone-600 bg-stone-900'
                  }`}>
                    {includeMentoring ? '✓' : ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                      <span>Add 1:1 Mentoring</span>
                      <span className="font-mono text-amber-400">+₹5,000</span>
                    </div>
                    <p className="text-stone-400 text-[10.5px] leading-snug">
                      5 dedicated private sessions with Microsoft &amp; Mastercard PMs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cohort Seat Capacity Progress Meter (Fills vertical gap & adds urgency) */}
              <div className="bg-stone-900/90 border border-stone-800/90 rounded-xl p-3 mb-5">
                <div className="flex items-center justify-between text-[10px] sm:text-[10.5px] font-mono mb-2">
                  <span className="text-stone-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    BATCH 02 CAPACITY
                  </span>
                  <span className="text-amber-400 font-bold">
                    23 / 30 SEATS FILLED (76%)
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500" 
                    style={{ width: '76.6%' }}
                  />
                </div>
              </div>
            </div>

            <div>
              {/* Full-width Ticket CTA Button */}
              <button
                onClick={() => onEnroll(`full-cohort${includeMentoring ? '-with-mentoring' : ''}`, cohortTotal)}
                className="w-full py-3.5 px-5 font-mono font-bold text-xs sm:text-sm uppercase bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group mb-3"
              >
                <span>RESERVE MY SEAT FOR ₹{cohortTotal.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="text-center">
                <p className="text-[10.5px] font-mono text-stone-400 font-medium">
                  One-time payment · GST included · Strictly 30 seats
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Centered Pill Divider Bridge */}
        <div className="relative my-10 md:my-12 text-center max-w-5xl mx-auto">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-dashed border-stone-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 font-mono text-[11px] font-bold text-stone-500 uppercase tracking-widest select-none">
              ─── OR CHOOSE A MODULAR TRACK ───
            </span>
          </div>
        </div>

        {/* MODULAR UNBUNDLING (Only need one piece?) */}
        <div id="modular" className="scroll-mt-20 max-w-5xl mx-auto text-center">
          
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#16171A] mb-2">
            Only need{' '}
            <span className="font-editorial italic font-normal text-stone-900 text-[1.1em] tracking-normal inline-block relative underline underline-offset-[6px] decoration-amber-500/80 decoration-skip-ink">
              one piece?
            </span>
          </h3>

          <p className="text-xs sm:text-sm font-normal text-[#475569] max-w-lg mx-auto mb-6 sm:mb-8 leading-relaxed">
            ₹5,000 each, no early bird. 20 seats across both tracks. Class recordings and chat support included, no certificate.
          </p>

          {/* Two Modular Options Side-by-Side */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 text-left mb-4">
            
            {/* BUILD Card */}
            <div
              onClick={() => setSelectedBuild(!selectedBuild)}
              className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                selectedBuild 
                  ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-300/40 shadow-sm' 
                  : 'bg-white border-stone-200/90 hover:border-stone-300 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg sm:text-xl font-bold tracking-tight text-[#16171A]">
                      BUILD
                    </h4>
                    <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded tracking-wide uppercase">
                      PROJECT TRACK
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-lg text-[#16171A]">
                      ₹5,000
                    </span>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center font-bold text-xs transition-colors ${
                      selectedBuild ? 'bg-[#16171A] text-white border-[#16171A]' : 'bg-white border-stone-300 text-transparent'
                    }`}>
                      {selectedBuild ? '✓' : ''}
                    </div>
                  </div>
                </div>

                <span className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  8 LIVE SUNDAY CLASSES · 16 HRS
                </span>

                <p className="text-xs sm:text-[13px] font-normal text-[#475569] leading-relaxed">
                  Build one real project from teardown to prototype, with weekly graded assignments and mentor review.
                </p>
              </div>
            </div>

            {/* PRACTICE Card */}
            <div
              onClick={() => setSelectedPractice(!selectedPractice)}
              className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                selectedPractice 
                  ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-300/40 shadow-sm' 
                  : 'bg-white border-stone-200/90 hover:border-stone-300 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg sm:text-xl font-bold tracking-tight text-[#16171A]">
                      PRACTICE
                    </h4>
                    <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded tracking-wide uppercase">
                      INTERVIEW TRACK
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-lg text-[#16171A]">
                      ₹5,000
                    </span>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center font-bold text-xs transition-colors ${
                      selectedPractice ? 'bg-[#16171A] text-white border-[#16171A]' : 'bg-white border-stone-300 text-transparent'
                    }`}>
                      {selectedPractice ? '✓' : ''}
                    </div>
                  </div>
                </div>

                <span className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  8 LIVE SATURDAY CLASSES · 16 HRS
                </span>

                <p className="text-xs sm:text-[13px] font-normal text-[#475569] leading-relaxed">
                  Mock interview rounds, Daily PM Gym, your switch story, and comprehensive question banks.
                </p>
              </div>
            </div>
          </div>

          {/* 1:1 Mentoring Add-on Full-Width Row */}
          <div
            onClick={() => setSelected1to1(!selected1to1)}
            className={`p-4 sm:p-4.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer text-left transition-all select-none mb-6 ${
              selected1to1 
                ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-300/40 shadow-2xs' 
                : 'bg-white border-stone-200/90 hover:border-stone-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                selected1to1 ? 'bg-[#16171A] text-white border-[#16171A]' : 'bg-white border-stone-300 text-transparent'
              }`}>
                {selected1to1 ? '✓' : ''}
              </div>
              <div className="text-xs sm:text-[13px] font-medium text-[#16171A] leading-snug">
                <span>Add 1:1 Mentoring: </span>
                <strong className="text-stone-900">5 dedicated private sessions with Microsoft &amp; Mastercard PMs</strong>
                <span className="text-stone-500 block text-[11px] mt-0.5">Available with any modular track. Limited seats.</span>
              </div>
            </div>
            <span className="font-mono font-bold text-base text-[#16171A] shrink-0">
              +₹5,000
            </span>
          </div>

          {/* Dynamic Modular CTA Button */}
          <div className="text-center">
            {modularTotal > 0 ? (
              <button
                onClick={() => onEnroll(`modular-${modularLabels.join('-')}`, modularTotal)}
                className="w-full sm:w-auto px-8 py-3.5 font-mono font-bold uppercase text-xs sm:text-sm bg-[#16171A] hover:bg-black text-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2 group"
              >
                <span>ENROLL IN {modularLabel.toUpperCase()} FOR ₹{modularTotal.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 font-mono font-semibold uppercase text-xs sm:text-sm border-2 border-stone-300 bg-stone-50 text-stone-500 rounded-xl cursor-default select-none transition-colors"
              >
                SELECT BUILD OR PRACTICE ABOVE TO ENROLL
              </button>
            )}
          </div>

          {/* Navigation Back Link */}
          <div className="mt-5 text-center">
            <a
              href="#pricing"
              className="text-xs font-mono font-medium text-stone-500 hover:text-stone-900 underline cursor-pointer inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Looking for the full 8-week cohort instead? Jump to full cohort details &amp; tuition ↑</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}

// --- SECTION 14: SMALL BATCHES, BY CHOICE ---
export function SmallBatchesEditorial() {
  return (
    <section className="py-12 md:py-16 bg-[#FAF8F5] border-b border-stone-200/90 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px] font-medium tracking-[0.05em] uppercase mb-2"
        >
          COHORT INTEGRITY
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
          className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#16171A] mb-2"
        >
          Small batches,{' '}
          <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative underline underline-offset-[8px] decoration-amber-500/80 decoration-skip-ink">
            by choice.
          </span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
          className="text-[#475569] text-sm sm:text-base leading-[1.6] font-normal mb-6 max-w-lg mx-auto"
        >
          We cap every batch on purpose, so every single project gets real 1:1 mentor feedback.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25, ease: smoothEase }}
          className="bg-white border border-stone-200/90 rounded-3xl p-8 sm:p-12 shadow-sm max-w-2xl mx-auto"
        >
          {/* Architectural Minimal Bar Chart */}
          <div className="h-44 border-b border-stone-200 flex items-end justify-center gap-6 sm:gap-12 px-4 pb-0">
            <div className="flex-1 max-w-[80px] flex flex-col justify-end h-full text-center">
              <span className="font-mono text-xs font-semibold text-stone-500 mb-1">6</span>
              <div className="bg-stone-300 rounded-t-lg transition-all" style={{ height: '20%' }} />
            </div>
            <div className="flex-1 max-w-[80px] flex flex-col justify-end h-full text-center">
              <span className="font-mono text-xs font-semibold text-stone-500 mb-1">6</span>
              <div className="bg-stone-300 rounded-t-lg transition-all" style={{ height: '20%' }} />
            </div>
            <div className="flex-1 max-w-[80px] flex flex-col justify-end h-full text-center">
              <span className="font-mono text-xs font-semibold text-stone-500 mb-1">15</span>
              <div className="bg-stone-400 rounded-t-lg transition-all" style={{ height: '50%' }} />
            </div>
            <div className="flex-1 max-w-[80px] flex flex-col justify-end h-full text-center">
              <span className="font-mono text-xs font-bold text-amber-900 mb-1">30 (MAX)</span>
              <div className="bg-amber-400 border border-amber-500/80 rounded-t-lg transition-all flex items-center justify-center shadow-xs" style={{ height: '100%' }} />
            </div>
          </div>

          {/* Labels Row */}
          <div className="flex justify-center gap-6 sm:gap-12 px-4 pt-3 font-mono font-medium text-xs sm:text-sm text-stone-600">
            <span className="flex-1 max-w-[80px] text-center">Batch 1</span>
            <span className="flex-1 max-w-[80px] text-center">Batch 2</span>
            <span className="flex-1 max-w-[80px] text-center">Batch 3</span>
            <span className="flex-1 max-w-[80px] text-center font-bold text-amber-900">Next batch</span>
          </div>

          <p className="font-medium text-[#475569] mt-8 text-xs sm:text-sm">
            Students per batch. Next batch: <strong>30 seats, not one more.</strong>
          </p>
        </motion.div>

      </div>
    </section>
  );
}

// --- SECTION 15: HOW TO JOIN ---
export function HowToJoinEditorial() {
  const steps = [
    {
      num: "01",
      sla: "~2 MINS",
      slaColor: "bg-[#FEF3C7] text-[#92400E] border-amber-300/80",
      title: "Select Track & Apply",
      desc: "Choose the Full 8-Week Fellowship (or a modular track) above and submit your brief background form.",
      footer: (
        <a
          href="#pricing"
          className="font-mono text-[10px] font-bold text-amber-900 hover:text-amber-700 tracking-wider uppercase flex items-center justify-between group transition-colors whitespace-nowrap"
        >
          <span>STEP 01 // APPLY FORM</span>
          <span className="group-hover:-translate-y-0.5 transition-transform font-bold text-xs ml-1">↑</span>
        </a>
      )
    },
    {
      num: "02",
      sla: "SAME DAY",
      slaColor: "bg-[#FEF3C7] text-[#92400E] border-amber-300/80",
      title: "WhatsApp Alignment",
      desc: "Quick 1:1 chat with our team over WhatsApp to align on your current background and PM transition goals.",
      footer: (
        <div className="font-mono text-[10px] font-bold text-stone-600 tracking-wider uppercase flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span>STEP 02 // 1:1 SCREENING</span>
        </div>
      )
    },
    {
      num: "03",
      sla: "WITHIN 24 HRS",
      slaColor: "bg-[#FEF3C7] text-[#92400E] border-amber-300/80",
      title: "Get Admission Decision",
      desc: "We confirm cohort readiness over WhatsApp and share your admission offer and seat reservation link.",
      footer: (
        <span className="font-mono text-[10px] font-bold text-stone-600 tracking-wider uppercase block whitespace-nowrap">
          STEP 03 // SEAT OFFER
        </span>
      )
    },
    {
      num: "04",
      sla: "DAY 01",
      slaColor: "bg-[#DCFCE7] text-[#166534] border-emerald-300/80",
      title: "Kickoff & Alumni",
      desc: "Get onboarded on WhatsApp before classes begin, unlock pre-work, and join the alumni & 90-day job board network.",
      footer: (
        <span className="font-mono text-[10px] font-bold text-emerald-800 tracking-wider uppercase block whitespace-nowrap">
          STEP 04 // COHORT ACCESS
        </span>
      )
    }
  ];

  return (
    <section id="admissions" className="py-12 md:py-16 bg-white border-b border-stone-200/90 relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px] font-medium tracking-[0.05em] uppercase mb-2"
          >
            ADMISSIONS PIPELINE
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
            className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#16171A] mb-2.5"
          >
            How to{' '}
            <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative underline underline-offset-[8px] decoration-amber-500/80 decoration-skip-ink">
              join?
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
            className="text-[#475569] text-sm sm:text-base leading-relaxed font-normal"
          >
            No automated rejection algorithms. We screen for alignment at every step to ensure cohort quality.
          </motion.p>
        </div>

        {/* 4-Column Connected Pipeline Grid */}
        <div className="relative">
          {/* Subtle Horizontal Dashed Line Connector Running Behind the Cards */}
          <div 
            className="hidden lg:block absolute top-[44px] left-10 right-10 h-0 border-t border-dashed border-[#D6D0C4] z-0 pointer-events-none" 
            aria-hidden="true" 
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch relative z-10">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: smoothEase }}
                className="bg-[#FAF8F3] border border-[#E6E1D6] rounded-2xl p-6 sm:p-6.5 flex flex-col justify-between h-full relative shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div>
                  {/* Top Row: Step Number & Time/SLA Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="font-mono text-xl font-bold text-amber-900">
                      {step.num}
                    </span>
                    <span className={`font-mono text-[10px] font-bold border px-2 py-0.5 rounded tracking-wide uppercase ${step.slaColor}`}>
                      {step.sla}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base sm:text-[17px] text-[#16171A] mb-2 tracking-tight">
                    {step.title}
                  </h3>

                  {/* Body Copy */}
                  <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed font-normal mb-6">
                    {step.desc}
                  </p>
                </div>
                
                {/* Fixed Bottom Footer Strip Pinned with mt-auto */}
                <div className="mt-auto pt-4 border-t border-[#ECE7DC]">
                  {step.footer}
                </div>

                {/* Static Inter-card Connector Arrow */}
                {i < 3 && (
                  <div 
                    className="hidden lg:flex absolute -right-[26px] top-[28px] w-7 h-7 rounded-full bg-white border border-[#D6D0C4] items-center justify-center text-[10px] text-stone-500 font-bold z-20 shadow-2xs pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Unified Bottom Action Bar / Ticket Stub */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25, ease: smoothEase }}
          className="mt-8 p-5 sm:p-6 px-6 sm:px-8 rounded-2xl bg-[#F3EFE6] border border-[#E5DEC9] flex flex-col lg:flex-row items-center justify-between gap-5 max-w-6xl mx-auto shadow-2xs"
        >
          {/* Left Side: Structured 2 Lines */}
          <div className="flex items-center gap-3.5 text-left w-full lg:w-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <h4 className="font-bold text-[#16171A] text-sm sm:text-base leading-snug">
                Have a question about cohort fit before applying?
              </h4>
              <p className="text-[#475569] text-xs sm:text-[12.5px] font-normal leading-normal mt-0.5 whitespace-normal xl:whitespace-nowrap">
                Direct WhatsApp access to our admissions team • Replies in under 3 hours • Zero commitment.
              </p>
            </div>
          </div>

          {/* Right Side: Vertical Divider + Dual-CTA Buttons */}
          <div className="flex items-center gap-3.5 w-full lg:w-auto shrink-0 justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-[#DFD9CC]/60">
            {/* Dedicated Vertical Perforation / Divider on Desktop */}
            <div className="hidden lg:block w-[1px] h-9 bg-[#DFD9CC] shrink-0 mr-1" aria-hidden="true" />

            <a
              href="https://wa.me/message/GH5C7YLAYIEHN1"
              target="_blank"
              rel="noreferrer"
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 bg-[#16171A] hover:bg-black text-white px-5 py-2.5 font-mono font-medium text-xs uppercase rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chat on WhatsApp →</span>
            </a>
            <a
              href="#pricing"
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Choose Track Above ↑</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// --- SECTION 16: QUESTIONS, ANSWERED (FAQ) ---
export function FaqEditorial() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can I do this with a full-time job?",
      a: "Yes. Live classes are on Wednesday, Saturday and Sunday, and every class is recorded. Plan for about 6 live hours a week plus assignments. Timings are shared when you enrol."
    },
    {
      q: "I have no PM experience. Is this for me?",
      a: "Yes. Learn is built for beginners, and Build creates the evidence your resume is missing."
    },
    {
      q: "Will I get a job?",
      a: "We can’t promise one, and nobody honest can. You get a real project, a PM resume and LinkedIn, interview practice and a job board to apply from."
    },
    {
      q: "What if I miss a class?",
      a: "Every live class is recorded and available to you."
    },
    {
      q: "Do PMs need to code?",
      a: "No. PMs need technical fluency, not coding. Week 7 covers APIs and system design."
    },
    {
      q: "How do I pay?",
      a: "One-time payment, GST included. No EMI."
    },
    {
      q: "What do Build or Practice buyers get?",
      a: "The 8 live classes for that piece, recordings, PM Gym, chat doubt support and the job board for 3 months. No certificate."
    },
    {
      q: "When does it start?",
      a: "Classes are Wednesday, Saturday and Sunday, starting in November. We confirm exact dates when you enrol."
    }
  ];

  return (
    <section id="faq" className="py-12 md:py-16 bg-[#FAF8F5] border-b border-stone-200/90 scroll-mt-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px] font-medium tracking-[0.05em] uppercase mb-2"
          >
            TRANSPARENCY &amp; DETAILS
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
            className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#16171A]"
          >
            Questions,{' '}
            <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative underline underline-offset-[8px] decoration-amber-500/80 decoration-skip-ink">
              answered.
            </span>
          </motion.h2>
        </div>

        {/* Editorial Single-Line Separator Accordion */}
        <div className="border-t border-b border-stone-300/80 divide-y divide-stone-200/80 text-left bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div key={idx} className="transition-colors hover:bg-stone-50/50">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-5 px-6 sm:px-8 flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-4 flex-1 pr-4">
                    <span className="font-mono text-xs font-bold text-amber-800 shrink-0">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span className="font-bold text-base sm:text-lg text-[#16171A] group-hover:text-amber-900 transition-colors tracking-tight">
                      {faq.q}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-stone-500 stroke-[2] shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: smoothEase }}
                      className="overflow-hidden bg-[#FAF8F5]/60 border-t border-stone-200/60"
                    >
                      <div className="py-4 px-6 sm:px-8 pl-12 sm:pl-16 font-normal text-xs sm:text-sm text-[#475569] leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

function StepSmartLogoIcon({ className = "w-6 h-6 shrink-0" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top-Left Shell & Cutout Step - Charcoal */}
      <path 
        d="M 41.6 0.7 L 44.0 0.7 L 46.6 1.6 L 76.7 20.1 L 70.0 26.8 L 45.5 11.9 L 43.4 10.9 L 41.7 11.0 L 11.5 29.4 L 10.7 31.5 L 10.7 51.0 L 13.4 48.4 L 22.0 39.4 L 23.0 39.0 L 25.3 39.5 L 28.3 42.7 L 28.8 44.0 L 28.3 46.0 L 6.7 67.6 L 4.1 68.3 L 2.6 67.4 L 1.6 66.0 L 1.4 27.9 L 2.5 24.4 L 6.0 21.4 L 38.9 1.6 L 41.6 0.7 Z" 
        fill="#141413" 
      />
      {/* Middle Step Bar - Charcoal */}
      <path 
        d="M 45.7 34.2 L 48.0 34.7 L 51.2 38.1 L 51.8 39.1 L 51.2 41.4 L 15.3 78.5 L 14.0 79.0 L 11.7 78.4 L 8.5 75.1 L 8.1 74.1 L 8.5 72.1 L 43.8 35.5 L 45.7 34.2 Z" 
        fill="#141413" 
      />
      {/* Bottom-Right Shell & Ascending Arrow - Warm Amber Accent */}
      <path 
        d="M 97.7 10.1 L 98.6 10.2 L 99.0 11.2 L 96.9 25.8 L 95.5 26.0 L 92.6 24.1 L 36.3 82.5 L 44.4 87.4 L 46.7 87.1 L 76.8 67.9 L 78.2 65.4 L 78.2 46.3 L 87.0 37.2 L 87.2 58.8 L 87.0 69.2 L 86.1 71.9 L 84.8 73.6 L 47.6 97.4 L 45.1 97.7 L 43.0 97.2 L 26.2 86.9 L 24.7 85.1 L 24.5 82.0 L 85.8 17.8 L 86.2 17.2 L 83.7 14.5 L 84.2 13.2 L 97.7 10.1 Z" 
        fill="#D97706" 
      />
    </svg>
  );
}

// --- SECTION 17: FINAL CONVERSION & EDITORIAL FOOTER ---
interface FooterEditorialProps {
  countdownText: string;
  onOpenBrochure: () => void;
  onEnroll: () => void;
}

export function FooterEditorial({ countdownText, onOpenBrochure, onEnroll }: FooterEditorialProps) {
  // Extract time string (e.g. "0d 8h 56m" or "2d 6h 19m") from countdownText
  const timeMatch = countdownText.match(/(\d+d\s+\d+h\s+\d+m|\d+d\s*:\s*\d+h\s*:\s*\d+m)/i);

  return (
    <>
      {/* FINAL CONVERSION CARD */}
      <section className="py-12 md:py-16 bg-white border-b border-stone-200/90 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center relative z-10">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="rounded-3xl bg-[#16171A] text-white p-8 sm:p-12 text-center shadow-xl shadow-stone-900/10 overflow-hidden relative border border-stone-800"
          >
            {/* Ambient amber glow */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            <span className="font-mono text-[10px] uppercase font-semibold tracking-[0.05em] text-amber-300 block mb-2.5">
              ADMISSION DEADLINE APPROACHING
            </span>

            <h2 className="text-3xl sm:text-5xl font-semibold text-white mb-3 leading-tight tracking-tight">
              Your seat, your project,{' '}
              <span className="font-editorial italic font-normal text-amber-300 text-[1.1em]">
                your evidence.
              </span>
            </h2>

            {/* Countdown / Urgency Subtitle with Warm Amber Pill */}
            {timeMatch ? (
              <div className="text-xs sm:text-sm font-mono text-stone-300 mb-6 max-w-lg mx-auto flex items-center justify-center flex-wrap gap-1.5">
                <span>Early bird ₹15,000 ends in</span>
                <span className="bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/30 px-2.5 py-0.5 rounded font-mono font-bold shadow-2xs">
                  {timeMatch[0]}
                </span>
                <span>· Then ₹20,000</span>
              </div>
            ) : (
              <p className="text-xs sm:text-sm font-mono text-stone-300 mb-6 max-w-md mx-auto">
                {countdownText}
              </p>
            )}

            {/* Dual CTAs: Signature Warm Amber Button + Outline Brochure Button with ArrowDown */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
              <button
                onClick={onEnroll}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 font-mono font-bold text-xs sm:text-sm uppercase bg-[#F59E0B] hover:bg-[#D97706] text-[#141413] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2 group"
              >
                <span>Reserve Seat for ₹15,000</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={onOpenBrochure}
                className="w-full sm:w-auto px-7 sm:px-8 py-4 font-mono font-medium text-xs sm:text-sm uppercase border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-2 group"
              >
                <ArrowDown className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors" />
                <span>Download Brochure PDF</span>
              </button>
            </div>

            <p className="text-[11px] font-mono text-stone-400 mt-5">
              Strictly capped at 30 seats per cohort · Evaluated by working PMs
            </p>
          </motion.div>

        </div>
      </section>

      {/* EDITORIAL SWISS COLOPHON FOOTER (WITHOUT BACKGROUND WATERMARK) */}
      <footer className="bg-[#FAF8F5] pt-12 pb-10 text-stone-600 border-t border-[#E6E1D6] relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          
          {/* Top Row: Brand Dossier + Navigation Links */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-[#E6E1D6]">
            {/* Left Column: Brand Dossier */}
            <div className="max-w-md text-left">
              <div className="flex items-center gap-3">
                <StepSmartLogoIcon className="w-6 h-6 shrink-0" />
                <span className="font-sans font-bold text-lg text-stone-900 tracking-tight">
                  StepSmart
                </span>
                <span className="text-stone-300">|</span>
                <span className="font-mono text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  PM-X FELLOWSHIP
                </span>
              </div>
              <p className="font-sans text-xs text-[#57534E] leading-relaxed mt-2.5">
                Practitioner-led product management fellowship. Built and critiqued by senior PMs from Microsoft &amp; Mastercard.
              </p>
            </div>

            {/* Right Column: Navigation Links + Smooth Back to Top */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs">
              <a href="#system" className="text-stone-600 hover:text-stone-950 transition-colors">Cohort</a>
              <a href="#curriculum" className="text-stone-600 hover:text-stone-950 transition-colors">Curriculum</a>
              <a href="#mentors" className="text-stone-600 hover:text-stone-950 transition-colors">Mentors</a>
              <a href="#pricing" className="text-stone-600 hover:text-stone-950 transition-colors">Tuition</a>
              <a href="#faq" className="text-stone-600 hover:text-stone-950 transition-colors">FAQ</a>
              <a 
                href="https://wa.me/message/GH5C7YLAYIEHN1" 
                target="_blank" 
                rel="noreferrer" 
                className="text-amber-800 hover:text-amber-950 font-bold transition-colors inline-flex items-center gap-1"
              >
                <span>WhatsApp Admissions</span>
              </a>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-stone-500 hover:text-stone-950 transition-colors inline-flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>↑ Back to top</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Legal & Telemetry Strip */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] text-stone-500">
            {/* Left: Copyright + Privacy + Terms + Refund Policy */}
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-1 text-center md:text-left">
              <span>© {new Date().getFullYear()} StepSmart. All rights reserved.</span>
              <div className="flex items-center gap-2 text-stone-400">
                <span className="hidden sm:inline">·</span>
                <a href="/privacy" className="hover:text-stone-900 underline transition-colors">Privacy Policy</a>
                <span>·</span>
                <a href="/terms" className="hover:text-stone-900 underline transition-colors">Terms</a>
                <span>·</span>
                <a href="/refund" className="hover:text-stone-900 underline transition-colors">Refund Policy</a>
              </div>
            </div>

            {/* Right: Telemetry & Honest Sign-off */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                BATCH 02 ADMISSIONS OPEN — 23/30 SEATS FILLED
              </span>
              <span className="text-stone-400 text-[10.5px]">
                No placement guarantee. Structured preparation &amp; verifiable proof of work.
              </span>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
