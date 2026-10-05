import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Flame, 
  ArrowRight
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
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Minimal Neobrutalist Admissions Card (Inspired by NextLeap Reference) */}
      <div className="relative bg-white border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] text-left select-none overflow-hidden">
        
        {/* Card Header */}
        <div className="p-5 sm:p-6 border-b-[3px] border-[#111111] bg-white">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="bg-[#C6F6D5] text-green-900 border-2 border-[#111111] px-2.5 py-0.5 font-black text-[10px] sm:text-[11px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {config.badgeText || "APPLICATIONS OPEN 🟢"}
            </span>
            <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-black text-[10px] sm:text-[11px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] rotate-[-1deg]">
              {config.batchNumber || "BATCH #04"}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight leading-tight">
            {config.batchName || "PM-X ACCELERATOR"}
          </h3>
          <p className="text-xs font-bold text-slate-500 mt-1">
            {config.programTrack || "Working Professionals & Career Switchers"}
          </p>
        </div>

        {/* Card Body: Cohort Date & Pricing */}
        <div className="p-5 sm:p-6 space-y-4 bg-white">
          {/* Cohort starts on & Duration */}
          <div className="grid grid-cols-2 gap-3 pb-4 border-b-2 border-slate-100">
            <div>
              <span className="text-[11px] font-black uppercase text-slate-500 block mb-0.5">
                Cohort starts on
              </span>
              <span className="text-sm sm:text-base font-black text-[#111111] flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#188ab2] shrink-0" />
                {config.startDate || "15 Nov 2026"}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-slate-500 block mb-0.5">
                Duration
              </span>
              <span className="text-sm sm:text-base font-black text-[#111111] flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#188ab2] shrink-0" />
                {config.duration || "6 Weeks Live"}
              </span>
            </div>
          </div>

          {/* Cost / Investment with crossed out original price and discounted price */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                Cohort Fee
              </span>
              <span className="bg-[#FFF3A7] text-[#111111] border border-[#111111] px-2 py-0.5 font-black text-[10px] uppercase shadow-[1px_1px_0px_0px_rgba(17,17,17,1)] rotate-[-1deg]">
                SAVE ₹5,000
              </span>
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight">
                {config.discountedPrice || "₹14,999"}
              </span>
              <span className="text-base sm:text-lg font-extrabold text-slate-400 line-through decoration-red-500 decoration-2">
                {config.originalPrice || "₹19,999"}
              </span>
            </div>

            {/* Urgency & Seats indicator */}
            <div className="mt-2.5 flex items-center justify-between">
              <span className="inline-block bg-[#FEE2E2] text-red-900 border border-red-300 font-black text-[10px] px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]">
                🔥 {config.urgencyTag || "Only 7 Seats Remaining"}
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {config.seatsFilled || 18}/{config.seatsTotal || 25} Seats Claimed
              </span>
            </div>

            {/* Compact seat progress bar */}
            <div className="w-full h-2 bg-slate-100 border border-[#111111] overflow-hidden mt-2">
              <div 
                className="h-full bg-[#188ab2] transition-all duration-500"
                style={{ width: `${percentageFilled}%` }}
              />
            </div>
          </div>

          {/* Mentors Preview Bar */}
          <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-500">Mentored by PMs at:</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black px-1.5 py-0.5 bg-slate-100 border border-[#111111]">Microsoft</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 bg-slate-100 border border-[#111111]">Mastercard</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 bg-slate-100 border border-[#111111]">ShopDeck</span>
            </div>
          </div>
        </div>

        {/* Contrast Action Footer matching screenshot */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t-[3px] border-[#111111] space-y-2 text-center">
          <button
            onClick={handleCtaClick}
            className="w-full py-4 px-6 font-black text-sm uppercase border-[3px] border-[#111111] bg-[#188ab2] text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:bg-[#0f6f8f] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>{config.ctaText || "Enrol Now"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-[11px] font-bold text-slate-500">
            {config.earlyBirdNote || "⚡ Rolling Vetting • Direct 1:1 Mentor Matching"}
          </p>
        </div>

      </div>
    </div>
  );
}
