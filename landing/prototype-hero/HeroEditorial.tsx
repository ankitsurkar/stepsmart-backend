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
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Soft amber dawn glow at the top */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-b from-[#F5E6CC]/40 via-[#F3EFE6]/30 to-transparent rounded-full blur-[110px]" />

        {/* Soft, uniform architectural grid lines with radial vignette mask */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #16171A 1px, transparent 1px),
              linear-gradient(to bottom, #16171A 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 40%, transparent 100%)'
          }}
        />

        {/* Swap 5: Subtle static warm ambient wash behind the center text */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(50% 45% at 50% 38%, rgba(245, 158, 11, 0.08) 0%, transparent 100%)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        
        {/* 1. TOP EYEBROW PILL (Swap 3: Emerald Live Dot + Soft Warm Amber 30 Seats Fill) */}
        <div className="flex justify-center mb-5 md:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: smoothEase }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/95 border border-stone-300/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span className="font-mono text-xs font-semibold tracking-[0.05em] text-stone-800 uppercase">
              LIVE 8-WEEK PM FELLOWSHIP
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-stone-600 text-xs font-medium inline-flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#0284C7] stroke-[2.5]" />
              Reviewed 1:1 by Working PMs
            </span>
            <span className="text-stone-300">·</span>
            <span className="font-mono text-[11px] font-semibold tracking-[0.05em] bg-[#FEF3C7] text-[#92400E] px-2.5 py-0.5 rounded-full">
              30 SEATS
            </span>
          </motion.div>
        </div>

        {/* 2. THE EDITORIAL HEADLINE (Harmonized Weights: SemiBold 600 Sans + Taller Instrument Serif) */}
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.03em] text-[#16171A] leading-[1.1] mb-4">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: smoothEase }}
              className="inline-block"
            >
              StepSmart – your step into
            </motion.span>
            <br />
            <motion.span 
              initial={{ opacity: 0, y: 10, skewX: -4 }}
              animate={{ opacity: 1, y: 0, skewX: 0 }}
              transition={{ duration: 0.4, delay: 0.25, ease: smoothEase }}
              className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative mt-1"
            >
              <span 
                className="relative z-10"
                style={{
                  paintOrder: 'stroke fill',
                  WebkitTextStroke: '5px #FBF9F5',
                }}
              >
                product management.
              </span>
              {/* Static Organic Warm Amber SVG Marker Stroke */}
              <svg 
                viewBox="0 0 340 18" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-2.5 left-0 w-full h-[14px] pointer-events-none overflow-visible z-0"
                preserveAspectRatio="none"
              >
                <path 
                  d="M 3 13 C 70 6, 210 5, 337 10"
                  stroke="#F59E0B"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.95"
                />
              </svg>
            </motion.span>
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: smoothEase }}
            className="text-base sm:text-lg md:text-xl text-[#475569] leading-[1.6] max-w-2xl mx-auto font-normal"
          >
            Finish 8 weeks with a <strong className="font-bold text-[#0F172A]">real project</strong>, a <strong className="font-bold text-[#0F172A]">PM resume</strong>, and interview practice. Live classes on Wednesday, Saturday, and Sunday. Reviewed 1:1 by working PMs at{' '}
            <span className="inline-flex items-center gap-1 font-bold text-[#0F172A] whitespace-nowrap">
              <svg className="w-3.5 h-3.5 inline-block shrink-0 -translate-y-[1px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="6.5" height="6.5" fill="#F25022" />
                <rect x="8.5" y="1" width="6.5" height="6.5" fill="#7FBA00" />
                <rect x="1" y="8.5" width="6.5" height="6.5" fill="#00A4EF" />
                <rect x="8.5" y="8.5" width="6.5" height="6.5" fill="#FFB900" />
              </svg>
              Microsoft
            </span>{' '}
            and{' '}
            <span className="inline-flex items-center gap-1 font-bold text-[#0F172A] whitespace-nowrap">
              <svg className="w-[18px] h-[12px] inline-block shrink-0 -translate-y-[1px]" viewBox="0 0 24 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="8" r="7" fill="#EB001B" />
                <circle cx="17" cy="8" r="7" fill="#F79E1B" fillOpacity="0.9" />
                <path d="M12 3.25C13.25 4.5 14 6.15 14 8C14 9.85 13.25 11.5 12 12.75C10.75 11.5 10 9.85 10 8C10 6.15 10.75 4.5 12 3.25Z" fill="#FF5F00" />
              </svg>
              Mastercard
            </span>
            . Capped at <strong className="font-bold text-[#0F172A]">30 seats</strong>.
          </motion.p>
        </div>

        {/* 3. THE PERSONA PATH SELECTOR (Harmonized Equal Height & Alignment, Clean Margins) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: smoothEase }}
          className="max-w-4xl lg:max-w-[890px] mx-auto mb-8 md:mb-10"
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
            
            {/* Card 01: "I'm new to PM" (Swap 4: Deep Ink Obsidian + Amber Pill & Amber Circle Arrow) */}
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
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-[#FBBF24] uppercase">
                    01 // FOUNDATION TRACK
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-[#141413] flex items-center justify-center shrink-0 group-hover:bg-[#FBBF24] group-hover:scale-105 transition-all shadow-sm">
                    <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
                  I’m new to PM
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-normal leading-relaxed">
                  I can’t yet structure an RCA, product design or metrics answer on my own
                </p>
              </div>
            </motion.button>

            {/* Card 02: "I know PM and need the offer" (Swap 4: Warm Sand #F5F1E8 + Charcoal Pill & Charcoal Circle Arrow) */}
            <motion.button
              type="button"
              onClick={() => {
                setActiveModule('need-offer');
                onSelectPath?.('need-offer');
              }}
              whileHover={{ 
                y: -4,
                boxShadow: "0 20px 36px -10px rgba(25, 20, 15, 0.08)",
                borderColor: "#C9C2B5" 
              }}
              whileTap={{ scale: 0.98 }}
              className="text-left p-6 sm:p-7 rounded-2xl bg-[#F5F1E8] text-stone-900 shadow-md shadow-stone-200/50 cursor-pointer group flex flex-col justify-between border border-[#E2DDD2] transition-all relative overflow-hidden h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-stone-600 uppercase">
                    02 // ACCELERATED TRACK
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#141413] text-white flex items-center justify-center shrink-0 group-hover:bg-stone-800 group-hover:scale-105 transition-all shadow-sm">
                    <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141413] mb-2">
                  I know PM and need the offer
                </h3>
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
          className="w-full max-w-4xl lg:max-w-[890px] mx-auto rounded-2xl bg-white border border-stone-200/90 p-6 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-stone-100"
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
