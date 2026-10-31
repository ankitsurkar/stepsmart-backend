import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, ArrowRight, Sparkles, Check, Compass, ShieldCheck } from 'lucide-react';

interface HeroEditorialProps {
  onSelectPath?: (path: 'new-to-pm' | 'need-offer') => void;
  onOpenBrochure?: () => void;
}

export function HeroEditorial({ onSelectPath, onOpenBrochure }: HeroEditorialProps) {
  const [activeModule, setActiveModule] = useState<'none' | 'new-to-pm' | 'need-offer'>('none');

  const smoothEase = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-20 bg-[#FBF9F5] text-[#16171A] overflow-hidden border-b border-stone-200/90">
      
      {/* 1. WARM ATMOSPHERIC LIGHTING & ARCHITECTURAL GRID */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft amber dawn glow at the top */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-b from-[#F5E6CC]/40 via-[#F3EFE6]/30 to-transparent rounded-full blur-[110px]" />
        
        {/* Editorial architectural grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #16171A 1px, transparent 1px),
              linear-gradient(to bottom, #16171A 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        
        {/* 1. TOP EYEBROW PILL (Refined Literary Badge) */}
        <div className="flex justify-center mb-5 md:mb-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/90 border border-stone-300/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
            </span>
            <span className="font-mono text-xs font-medium tracking-[0.05em] text-stone-700 uppercase">
              ★ LIVE 8-WEEK PM FELLOWSHIP
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-stone-600 text-xs font-medium">
              Reviewed 1:1 by Working PMs
            </span>
            <span className="text-stone-300">·</span>
            <span className="font-mono text-[11px] font-medium tracking-[0.05em] text-amber-700">
              30 SEATS
            </span>
          </motion.div>
        </div>

        {/* 2. THE EDITORIAL HEADLINE (Harmonized Weights: SemiBold 600 Sans + Taller Instrument Serif) */}
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.03em] text-[#16171A] leading-[1.1] mb-4"
          >
            StepSmart – your step into <br />
            <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative mt-1 underline underline-offset-[10px] decoration-amber-500/80 decoration-skip-ink">
              product management.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: smoothEase }}
            className="text-base sm:text-lg md:text-xl text-[#475569] leading-[1.6] max-w-2xl mx-auto font-normal"
          >
            Finish 8 weeks with a <strong className="font-bold text-[#0F172A]">real project</strong>, a <strong className="font-bold text-[#0F172A]">PM resume</strong>, and interview practice. Live classes on Wednesday, Saturday, and Sunday. Reviewed 1:1 by working PMs at <strong className="font-bold text-[#0F172A]">Microsoft and Mastercard</strong>. Capped at <strong className="font-bold text-[#0F172A]">30 seats</strong>.
          </motion.p>
        </div>

        {/* 3. THE PERSONA PATH SELECTOR (Harmonized Equal Height & Alignment) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: smoothEase }}
          className="max-w-5xl mx-auto mb-8 md:mb-10"
        >
          <div className="text-center mb-5 sm:mb-6">
            <span className="text-stone-500 text-sm font-medium mr-2">
              Not sure which one is yours?
            </span>
            <span className="font-editorial italic font-normal text-stone-900 text-lg border-b border-stone-400/80 pb-0.5">
              Pick what sounds like you
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            
            {/* Card 01: "I'm new to PM" (Deep Ink Obsidian Contrast Card) */}
            <motion.button
              type="button"
              onClick={() => {
                setActiveModule('new-to-pm');
                onSelectPath?.('new-to-pm');
              }}
              whileHover={{ 
                y: -4,
                boxShadow: "0 20px 36px -10px rgba(22, 23, 26, 0.22)" 
              }}
              whileTap={{ scale: 0.98 }}
              className="text-left p-6 sm:p-7 rounded-2xl bg-[#16171A] text-white shadow-lg shadow-stone-900/10 cursor-pointer group flex flex-col justify-between border border-stone-800 transition-all relative overflow-hidden h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    I’m new to PM
                  </h3>
                  <ArrowRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
                <p className="text-xs sm:text-sm text-stone-300 font-normal leading-relaxed">
                  I can’t yet structure an RCA, product design or metrics answer on my own
                </p>
              </div>
            </motion.button>

            {/* Card 02: "I know PM and need the offer" (Pristine Warm Ivory Card) */}
            <motion.button
              type="button"
              onClick={() => {
                setActiveModule('need-offer');
                onSelectPath?.('need-offer');
              }}
              whileHover={{ 
                y: -4,
                boxShadow: "0 20px 36px -10px rgba(25, 20, 15, 0.08)",
                borderColor: "#A8A29E" 
              }}
              whileTap={{ scale: 0.98 }}
              className="text-left p-6 sm:p-7 rounded-2xl bg-white text-stone-900 shadow-md shadow-stone-200/50 cursor-pointer group flex flex-col justify-between border border-stone-200/90 transition-all relative overflow-hidden h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-stone-950 transition-colors">
                    I know PM and need the offer
                  </h3>
                  <ArrowRight className="w-5 h-5 text-stone-600 group-hover:text-stone-950 group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
                <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                  I get the concepts. I need a portfolio, a profile and interview practice
                </p>
              </div>
            </motion.button>

          </div>

          {/* Auxiliary Brochure Download Link */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={onOpenBrochure}
              className="text-xs font-semibold text-stone-500 hover:text-stone-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-700" />
              <span className="underline underline-offset-4">
                Looking for the 8-week syllabus? Download Full Brochure PDF
              </span>
              <span>➜</span>
            </button>
          </div>

        </motion.div>

        {/* 4. SPEC BAR (Strict 3-Row Catalogue Rhythm: Label -> Value -> Muted Subtext) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: smoothEase }}
          className="w-full max-w-5xl mx-auto rounded-2xl bg-white border border-stone-200/90 p-6 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-stone-100"
        >
          {/* Column 1: NEXT COHORT */}
          <div className="flex flex-col justify-center">
            <span className="font-mono text-[10px] text-stone-400 uppercase tracking-widest mb-1 font-medium">
              NEXT COHORT
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-stone-900 font-bold text-sm tracking-tight whitespace-nowrap">
                ADMISSION LIVE
              </span>
            </div>
            <span className="text-stone-500 text-[11px] mt-0.5 font-medium">
              Next Batch: 1st June
            </span>
          </div>

          {/* Column 2: SCHEDULE */}
          <div className="flex flex-col justify-center pt-4 lg:pt-0 lg:pl-6">
            <span className="font-mono text-[10px] text-stone-400 uppercase tracking-widest mb-1 font-medium">
              SCHEDULE
            </span>
            <span className="text-stone-900 font-bold text-sm tracking-tight whitespace-nowrap">
              WED, SAT &amp; SUN
            </span>
            <span className="text-stone-500 text-[11px] mt-0.5 font-medium">
              6 live hours weekly
            </span>
          </div>

          {/* Column 3: BATCH SIZE */}
          <div className="flex flex-col justify-center pt-4 lg:pt-0 lg:pl-6">
            <span className="font-mono text-[10px] text-stone-400 uppercase tracking-widest mb-1 font-medium">
              BATCH SIZE
            </span>
            <span className="text-stone-900 font-bold text-sm tracking-tight whitespace-nowrap">
              30 SEATS MAX
            </span>
            <span className="text-stone-500 text-[11px] mt-0.5 font-medium">
              Strict Cap · No Extensions
            </span>
          </div>

          {/* Column 4: MENTORS */}
          <div className="flex flex-col justify-center pt-4 lg:pt-0 lg:pl-6">
            <span className="font-mono text-[10px] text-stone-400 uppercase tracking-widest mb-1 font-medium">
              MENTORS
            </span>
            <span className="text-stone-900 font-bold text-sm tracking-tight whitespace-nowrap">
              MSFT &amp; MASTERCARD
            </span>
            <span className="text-stone-500 text-[11px] mt-0.5 font-medium">
              Direct 1:1 Reviews
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
export default HeroEditorial;
