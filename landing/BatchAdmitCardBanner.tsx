import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  Flame, 
  ArrowRight, 
  GraduationCap, 
  Sparkles, 
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { getStoredBatchConfig, type BatchConfig } from './batchConfig';

const sanketPhotoSrc = "/mentor-sanket.webp";
const ankitPhotoSrc = "/mentor-ankit.webp";
const pankajPhotoSrc = "/mentor-pankaj.webp";

interface BatchAdmitCardBannerProps {
  variant?: 'main' | 'students' | 'preview';
  onAction?: () => void;
  customConfig?: BatchConfig;
  className?: string;
}

export function BatchAdmitCardBanner({ 
  variant = 'main', 
  onAction,
  customConfig,
  className = ''
}: BatchAdmitCardBannerProps) {
  const navigate = useNavigate();
  const [config, setConfig] = useState<BatchConfig>(() => customConfig || getStoredBatchConfig());

  useEffect(() => {
    if (customConfig) {
      setConfig(customConfig);
      return;
    }
    const handleUpdate = () => {
      setConfig(getStoredBatchConfig());
    };
    window.addEventListener('pmx_batch_updated', handleUpdate);
    return () => window.removeEventListener('pmx_batch_updated', handleUpdate);
  }, [customConfig]);

  if (!config.enabled && variant !== 'preview') {
    return null;
  }

  const handleCtaClick = () => {
    if (onAction) {
      onAction();
      return;
    }

    if (config.ctaTarget.startsWith('#')) {
      const el = document.getElementById(config.ctaTarget.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    if (config.ctaTarget.includes('#')) {
      const [path, hash] = config.ctaTarget.split('#');
      if (window.location.pathname === path) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
    }

    navigate(config.ctaTarget);
  };

  const percentageFilled = Math.min(
    100, 
    Math.round(((config.seatsFilled || 0) / (config.seatsTotal || 25)) * 100)
  );

  return (
    <div className={`w-full max-w-5xl mx-auto my-8 ${className}`}>
      {/* Outer Neobrutalist Ticket Container */}
      <div className="relative bg-white border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] flex flex-col lg:flex-row overflow-hidden text-left">
        
        {/* Left / Main Ticket Body */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between relative bg-white">
          {/* Top Stamp / Badge Row */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Live Admissions Pulsing Indicator */}
                <span className="bg-[#C6F6D5] text-green-900 border-2 border-[#111111] px-2.5 py-0.5 font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {config.badgeText || "APPLICATIONS OPEN 🟢"}
                </span>

                {/* Batch Number Sticker */}
                <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-3 py-0.5 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] rotate-[-1.5deg] select-none">
                  {config.batchNumber || "BATCH #04"}
                </span>
              </div>

              {/* Pass Serial Code */}
              <span className="text-[11px] font-mono font-black uppercase text-slate-400 tracking-wider">
                COHORT PASS // PMX-2026
              </span>
            </div>

            {/* Batch Title & Value Proposition */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#111111] leading-tight mb-2 tracking-tight">
              {config.batchName || "PM-X First Step — Student Placement Edition"}
            </h3>
            <p className="text-sm font-bold text-slate-600 leading-relaxed mb-6">
              A high-touch, live cohort designed to take ambitious candidates from scratch to placement & interview ready through direct 1:1 guidance and real PM frameworks.
            </p>

            {/* Key Cohort Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none mb-6">
              <div className="bg-slate-50 border-2 border-[#111111] p-2.5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                <span className="text-[10px] font-black uppercase text-slate-500 block mb-0.5">Start Date</span>
                <span className="text-xs sm:text-sm font-black text-[#111111] flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#188ab2] shrink-0" />
                  {config.startDate || "15 Nov 2026"}
                </span>
              </div>

              <div className="bg-slate-50 border-2 border-[#111111] p-2.5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                <span className="text-[10px] font-black uppercase text-slate-500 block mb-0.5">Duration</span>
                <span className="text-xs sm:text-sm font-black text-[#111111] flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#188ab2] shrink-0" />
                  {config.duration || "6 Weeks Live"}
                </span>
              </div>

              <div className="bg-slate-50 border-2 border-[#111111] p-2.5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                <span className="text-[10px] font-black uppercase text-slate-500 block mb-0.5">Cohort Cap</span>
                <span className="text-xs sm:text-sm font-black text-[#111111] flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#188ab2] shrink-0" />
                  {config.seatsTotal || 25} Max Seats
                </span>
              </div>

              <div className="bg-slate-50 border-2 border-[#111111] p-2.5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                <span className="text-[10px] font-black uppercase text-slate-500 block mb-0.5">Format</span>
                <span className="text-xs sm:text-sm font-black text-[#111111] flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#188ab2] shrink-0" />
                  Live + 1:1
                </span>
              </div>
            </div>
          </div>

          {/* Mentors Preview Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase text-slate-500">Mentored by PMs at:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="bg-[#FFF3A7] text-[#111111] border border-[#111111] px-2 py-0.5 font-black text-[11px] shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]">
                  Microsoft
                </span>
                <span className="bg-[#FFF3A7] text-[#111111] border border-[#111111] px-2 py-0.5 font-black text-[11px] shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]">
                  Mastercard
                </span>
                <span className="bg-[#FFF3A7] text-[#111111] border border-[#111111] px-2 py-0.5 font-black text-[11px] shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]">
                  ShopDeck
                </span>
              </div>
            </div>

            <div className="flex items-center -space-x-2">
              <img src={sanketPhotoSrc} alt="Sanket Katore" className="h-7 w-7 rounded-full border-2 border-[#111111] object-cover" />
              <img src={ankitPhotoSrc} alt="Ankit Surkar" className="h-7 w-7 rounded-full border-2 border-[#111111] object-cover" />
              <img src={pankajPhotoSrc} alt="Pankaj Sharma" className="h-7 w-7 rounded-full border-2 border-[#111111] object-cover" />
            </div>
          </div>
        </div>

        {/* Perforated Dashed Tear Line with Authentic Ticket Punch Cutouts */}
        <div className="relative flex lg:flex-col items-center justify-center">
          {/* Desktop Vertical Dashed Line */}
          <div className="hidden lg:block h-full w-[3px] border-l-[3px] border-dashed border-[#111111]" />
          {/* Mobile Horizontal Dashed Line */}
          <div className="lg:hidden w-full h-[3px] border-t-[3px] border-dashed border-[#111111]" />

          {/* Desktop Top & Bottom Punch Notches */}
          <div className="hidden lg:block absolute -top-4 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#FFFFFF] border-[3px] border-[#111111] rounded-full z-10" />
          <div className="hidden lg:block absolute -bottom-4 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#FFFFFF] border-[3px] border-[#111111] rounded-full z-10" />

          {/* Mobile Left & Right Punch Notches */}
          <div className="lg:hidden absolute -left-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#FFFFFF] border-[3px] border-[#111111] rounded-full z-10" />
          <div className="lg:hidden absolute -right-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#FFFFFF] border-[3px] border-[#111111] rounded-full z-10" />
        </div>

        {/* Right / Stub Action Card */}
        <div className="lg:w-80 bg-slate-50 p-6 sm:p-8 flex flex-col justify-between items-stretch text-center border-t-[3px] lg:border-t-0 border-[#111111]">
          <div>
            <div className="inline-block bg-[#111111] text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest mb-4 rotate-[1deg]">
              ADMIT ONE CANDIDATE
            </div>

            {/* Seat Availability Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-slate-600 flex items-center gap-1">
                  <Flame className="h-4 w-4 text-amber-500 fill-amber-500" /> Seats Claimed:
                </span>
                <span className="text-[#111111]">
                  {config.seatsFilled || 18} / {config.seatsTotal || 25}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3.5 bg-white border-2 border-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
                <div 
                  className="h-full bg-[#188ab2] transition-all duration-500"
                  style={{ width: `${percentageFilled}%` }}
                />
              </div>

              {/* Urgency Badge */}
              <span className="inline-block bg-[#FEE2E2] text-red-900 border border-red-300 font-black text-[11px] px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]">
                {config.urgencyTag || "Only 7 Seats Remaining"}
              </span>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleCtaClick}
              className="w-full py-4 px-5 font-black text-sm uppercase border-[3px] border-[#111111] bg-[#188ab2] text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:bg-[#0f6f8f] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>{config.ctaText || "Claim Your Cohort Spot"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-[11px] font-bold text-slate-500">
              {config.earlyBirdNote || "⚡ Rolling Vetting • Direct 1:1 Mentor Matching"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
