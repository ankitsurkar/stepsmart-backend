import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  Clock,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Flame,
  FileText,
  Download,
  Share2,
  Layers
} from 'lucide-react';
import { getStoredBatchConfig, type BatchConfig } from './batchConfig';
import { startBrochureDownload, saveLeadToDemoDB } from './AppBrutalism';

export function AppExecutive() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [batchConfig, setBatchConfig] = useState<BatchConfig>(() => getStoredBatchConfig());

  // Interactive modular checkboxes for Modules 1, 2, 3 + 1:1 mentoring
  const [selectedMod1, setSelectedMod1] = useState(false);
  const [selectedMod2, setSelectedMod2] = useState(false);
  const [selectedMod3, setSelectedMod3] = useState(false);
  const [selected1to1, setSelected1to1] = useState(false);

  // Diwali offer countdown state
  const [countdownTimer, setCountdownTimer] = useState('04d 12h 30m 00s');
  const [isEarlyBird, setIsEarlyBird] = useState(true);

  // Path picker role state ('ops' | 'swe' | 'analytics' | 'other')
  const [selectedRolePath, setSelectedRolePath] = useState<'ops' | 'swe' | 'analytics' | 'other'>('ops');

  // Brochure Pop-up Modal State
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [brochureFormData, setBrochureFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentRole: 'Software Engineer / Developer',
  });
  const [brochureFormStatus, setBrochureFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brochureFormData.name || !brochureFormData.email || !brochureFormData.phone) return;
    setBrochureFormStatus('loading');

    saveLeadToDemoDB({
      fullName: brochureFormData.name,
      email: brochureFormData.email,
      phone: brochureFormData.phone,
      currentRole: brochureFormData.currentRole,
      cohortTrack: 'PM-X Accelerator (Brochure Download)'
    });

    try {
      const response = await fetch(
        'https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: brochureFormData.name,
            email: brochureFormData.email,
            phone: brochureFormData.phone,
            currentRole: brochureFormData.currentRole,
            source: 'brochure_modal',
            cohortTrack: 'PM-X Accelerator (Brochure Download)',
            masterclassId: 'pm-x-accelerator-brochure',
          }),
        }
      );
      if (!response.ok) {
        console.warn('Backend responded with status:', response.status);
      }
    } catch (err) {
      console.error('Error submitting brochure form to backend:', err);
    }

    setBrochureFormStatus('success');
    setTimeout(() => {
      startBrochureDownload(false);
    }, 400);
  };

  useEffect(() => {
    const handleBatchUpdate = () => setBatchConfig(getStoredBatchConfig());
    window.addEventListener('pmx_batch_updated', handleBatchUpdate);
    return () => window.removeEventListener('pmx_batch_updated', handleBatchUpdate);
  }, []);

  useEffect(() => {
    // Target Diwali offer end date: 5 November 2026 23:59:59 IST
    const targetEnd = new Date('2026-11-05T23:59:59+05:30').getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const left = targetEnd - now;
      if (left <= 0) {
        setIsEarlyBird(false);
        setCountdownTimer('Offer ended');
      } else {
        setIsEarlyBird(true);
        const d = Math.floor(left / 864e5);
        const h = Math.floor((left % 864e5) / 36e5);
        const m = Math.floor((left % 36e5) / 6e4);
        const s = Math.floor((left % 6e4) / 1000);
        const pad = (n: number) => String(n).padStart(2, '0');
        setCountdownTimer(`${pad(d)}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`);
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Modular selection calculation (₹7,000 per live module)
  const modularItemCount = (selectedMod1 ? 1 : 0) + (selectedMod2 ? 1 : 0) + (selectedMod3 ? 1 : 0);
  const modulePrice = isEarlyBird ? 5000 : 7000;
  const modularTotal = (modularItemCount * modulePrice) + (selected1to1 ? 5000 : 0);
  const modularLabel = [
    selectedMod1 ? 'AI Builder (Mod 1)' : '',
    selectedMod2 ? 'Profile Enhancer (Mod 2)' : '',
    selectedMod3 ? 'Interview Practice (Mod 3)' : '',
    selected1to1 ? '1:1 Mentoring' : ''
  ].filter(Boolean).join(' + ');

  const handleModularEnroll = () => {
    const intent = `Hi, I want to enroll for modular PM-X: ${modularLabel} (₹${modularTotal.toLocaleString('en-IN')})`;
    window.open(`https://wa.me/message/GH5C7YLAYIEHN1?text=${encodeURIComponent(intent)}`, '_blank', 'noopener,noreferrer');
  };

  const handleMainEnroll = () => {
    const intent = `Hi, I want to reserve my seat for the full PM-X AI PM Accelerator cohort (₹30,000 including all other modules with Learn Module Free)`;
    window.open(`https://wa.me/message/GH5C7YLAYIEHN1?text=${encodeURIComponent(intent)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#141413] font-sans selection:bg-[#FFF3A7] selection:text-[#141413] font-medium">
      
      {/* 1. TOP ANNOUNCEMENT TICKER (Soft Neo-Brutalist Banner) */}
      <aside aria-label="Announcement Banner" className="sticky top-0 z-50 w-full bg-[#FEF08A] border-b-2 border-[#141413] text-xs py-2 px-4 font-black">
        <div className="container mx-auto max-w-7xl flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#188ab2] text-white rounded-full border-2 border-[#141413] px-2.5 py-0.5 text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_#141413] inline-flex items-center gap-1.5 font-black shrink-0">
              PM-X ACCELERATOR
            </span>
            <span className="text-[#141413] font-black text-xs sm:text-sm">
              Module ₹7,000 each · AI PM ₹30,000 · Cohort Starts 1st Dec
            </span>
          </div>
          <button
            onClick={() => scrollToSection('pricing')}
            className="bg-[#188ab2] hover:bg-[#0f6f8f] text-white rounded-full border-2 border-[#141413] px-4 py-1 text-xs uppercase font-black shadow-[2px_2px_0px_0px_#141413] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#141413] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer inline-flex items-center gap-1 shrink-0"
          >
            <span>See pricing</span>
            <span>→</span>
          </button>
        </div>
      </aside>

      {/* 2. SOFT ARCHITECTURAL NEO-BRUTALIST NAVBAR (Image 5 & 6 Pill Style) */}
      <header className="w-full bg-[#FDFCF7] border-b-2 border-[#141413] relative z-40">
        <div className="container mx-auto px-6 h-20 max-w-7xl flex items-center justify-between">
          
          {/* Brand Wordmark (Clean logo without box, plain StepSmart text) */}
          <Link to="/" className="flex items-center gap-3 select-none">
            <img
              src="/stepsmart-logo.webp"
              alt="StepSmart Logo"
              className="w-8 h-8 object-contain"
              loading="eager"
              width="32"
              height="32"
            />
            <span className="font-black text-2xl tracking-tight text-[#141413]">
              StepSmart
            </span>
          </Link>

          {/* Clean Desktop Navigation Anchors */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-extrabold text-[#141413]">
            <Link
              to="/spinner"
              className="flex items-center gap-1.5 bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#6B21A8] px-3 py-1 rounded-full border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all font-black text-xs uppercase"
            >
              <span>🎡</span>
              <span>Which PM Are You?</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            </Link>
            <button onClick={() => scrollToSection('system')} className="hover:text-[#188ab2] transition-colors cursor-pointer font-extrabold">
              Cohort
            </button>
            <button onClick={() => scrollToSection('curriculum')} className="hover:text-[#188ab2] transition-colors cursor-pointer font-extrabold">
              Curriculum
            </button>
            <button onClick={() => scrollToSection('mentors')} className="hover:text-[#188ab2] transition-colors cursor-pointer font-extrabold">
              Mentors
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-[#188ab2] transition-colors cursor-pointer font-extrabold">
              Pricing
            </button>
            <Link to="/resources" className="hover:text-[#188ab2] transition-colors cursor-pointer font-extrabold">
              Resources
            </Link>
            <Link to="/blog" className="hover:text-[#188ab2] transition-colors cursor-pointer font-extrabold">
              Blog
            </Link>
          </nav>

          {/* Right Action Buttons: Rounded Pill Buttons (Image 5 & 6) */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/learn"
              className="px-5 py-2 rounded-full border-2 border-[#141413] bg-white text-[#141413] hover:bg-[#FEF08A] shadow-[2px_2px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all font-extrabold text-sm"
            >
              Login
            </a>
            <button
              onClick={() => scrollToSection('pricing')}
              className="px-6 py-2.5 rounded-full font-black border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[2.5px_2.5px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-sm uppercase cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Reserve Seat</span>
              <span>➜</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl border-2 border-[#141413] bg-white shadow-[2px_2px_0px_0px_#141413]"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-[#141413]" /> : <Menu className="w-6 h-6 text-[#141413]" />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <div className="md:hidden w-full bg-[#FDFCF7] border-b-2 border-[#141413] p-6 flex flex-col gap-4 shadow-[0px_4px_0px_0px_#141413]">
            <Link
              to="/spinner"
              onClick={() => setIsMenuOpen(false)}
              className="text-left font-black text-lg py-2.5 px-3 rounded-xl border-2 border-[#141413] bg-[#FAF5FF] shadow-[2px_2px_0px_0px_#141413] flex items-center justify-between text-[#6B21A8]"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">🎡</span>
                <span>Which PM Are You?</span>
              </span>
              <span className="text-[10px] font-mono font-black uppercase bg-[#6B21A8] text-white px-2 py-0.5 rounded-full border border-[#141413]">
                Teaser
              </span>
            </Link>
            <button onClick={() => scrollToSection('system')} className="text-left font-black text-lg py-2 border-b-2 border-[#141413]/10">
              Cohort Modules
            </button>
            <button onClick={() => scrollToSection('curriculum')} className="text-left font-black text-lg py-2 border-b-2 border-[#141413]/10">
              Curriculum (8 Weeks)
            </button>
            <button onClick={() => scrollToSection('mentors')} className="text-left font-black text-lg py-2 border-b-2 border-[#141413]/10">
              Mentors
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-left font-black text-lg py-2 border-b-2 border-[#141413]/10">
              Pricing
            </button>
            <Link
              to="/resources"
              onClick={() => setIsMenuOpen(false)}
              className="text-left font-black text-lg py-2 border-b-2 border-[#141413]/10 hover:text-[#188ab2] transition-colors"
            >
              Resources
            </Link>
            <Link
              to="/blog"
              onClick={() => setIsMenuOpen(false)}
              className="text-left font-black text-lg py-2 border-b-2 border-[#141413]/10 hover:text-[#188ab2] transition-colors"
            >
              Blog
            </Link>
            <div className="flex flex-col gap-3 pt-3">
              <button
                onClick={() => scrollToSection('pricing')}
                className="w-full py-3.5 rounded-full border-2 border-[#141413] bg-[#188ab2] text-white font-black text-sm uppercase shadow-[3px_3px_0px_0px_#141413]"
              >
                Reserve Seat ➜
              </button>
              <a
                href="/learn"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-2.5 rounded-full border-2 border-[#141413] bg-white text-[#141413] text-center font-black text-sm shadow-[2px_2px_0px_0px_#141413] block"
              >
                Learner Login
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* 3. HERO SECTION (Exposed Structural Container & Architectural Grid) */}
        <section className="pt-12 pb-20 md:pt-16 md:pb-28 bg-[#FDFCF7] border-b-2 border-[#141413] relative overflow-hidden">
          
          {/* Architectural Blueprint Dot Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.045]"
            style={{
              backgroundImage: 'radial-gradient(#141413 1.25px, transparent 1.25px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
            
            {/* Playful Neo-Brutalist Geometric Shapes (Brought in close to Content, from UI Component Library) */}
            <div className="hidden sm:block absolute top-1 left-2 sm:-left-2 lg:-left-6 pointer-events-none select-none -rotate-12">
              <span className="text-[#F59E0B] text-2xl lg:text-3xl font-black drop-shadow-[2px_2px_0px_#141413]">
                ✦
              </span>
            </div>
            <div className="hidden sm:block absolute top-40 left-3 sm:left-1 lg:-left-2 pointer-events-none select-none">
              <div className="w-[18px] h-[18px] bg-[#A7F3D0] border-2 border-[#141413] rotate-45 shadow-[2px_2px_0px_#141413]" />
            </div>
            <div className="hidden sm:block absolute top-2 right-2 sm:-right-2 lg:-right-6 pointer-events-none select-none">
              <div className="w-[18px] h-[18px] bg-[#FECDD3] border-2 border-[#141413] rotate-12 shadow-[2px_2px_0px_#141413]" />
            </div>
            <div className="hidden sm:block absolute top-44 right-3 sm:right-1 lg:-right-2 pointer-events-none select-none rotate-6">
              <span className="text-[#A855F7] text-2xl lg:text-3xl font-black drop-shadow-[2px_2px_0px_#141413]">
                ✦
              </span>
            </div>

            {/* Top Eyebrow Sticker */}
            <div className="inline-block mb-8">
              <span className="bg-white rounded-full border-2 border-[#141413] px-4 sm:px-5 py-1.5 font-mono font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#141413] inline-flex items-center gap-2 tracking-wider select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ★ PM-X ACCELERATOR · LIVE AND HANDS-ON · GROUPS OF 10-20 · STARTS 1ST DEC
              </span>
            </div>

            {/* Headline Area (Clean 2-line flow, no duplicate avatars) */}
            <div className="relative mb-6 max-w-5xl mx-auto">
              
              {/* Soft Dreamy Radial Mesh Wash behind Headline */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-full max-w-3xl h-72 bg-[radial-gradient(ellipse_at_top,rgba(233,213,255,0.45)_0%,rgba(254,240,138,0.4)_45%,rgba(253,252,247,0)_75%)] pointer-events-none blur-2xl -z-10" />

              {/* Balanced Headline (Clean 2-line flow without duplicate avatars) */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.18] text-[#141413] max-w-5xl mx-auto">
                <span className="inline-block sm:inline">Switching into PM without a PM title?</span>
                <br className="hidden sm:inline" />{' '}
                <span className="inline-block mt-2 sm:mt-2.5">
                  <span className="inline-block rounded-full border-2 border-[#141413] bg-[#FDE047] px-4 sm:px-6 py-1 sm:py-1.5 shadow-[3px_3px_0px_0px_#141413] -rotate-1 font-black text-[#141413] mr-2 align-middle">
                    Build the proof
                  </span>
                  <span className="align-middle">with us.</span>
                  <span className="inline-flex items-center gap-1.5 ml-2.5 px-3 py-1 rounded-full bg-[#FEF08A] border-2 border-[#141413] text-[10px] sm:text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_#141413] rotate-[2deg] align-middle">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    10–20 SEATS · LIVE
                  </span>
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-[#141413]/85 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              You don’t need a PM title to start. You need a <strong className="font-black text-[#141413]">resume that reads like a PM’s</strong>, <strong className="font-black text-[#141413]">projects you can talk through</strong>, and <strong className="font-black text-[#141413]">interview practice</strong>. Do all this in 8 weeks, live, with 10–20 people making the same switch.
            </p>

            {/* 3. High-Converting CTA Action Bar & Micro-Trust Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
              <button
                onClick={() => scrollToSection('pricing')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full font-black border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[4px_4px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#141413] transition-all text-xs sm:text-sm uppercase cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Apply for 1st Dec Cohort</span>
                <span>➜</span>
              </button>
              <button
                onClick={() => {
                  setBrochureFormStatus('idle');
                  setIsBrochureModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full font-black border-2 border-[#141413] bg-white hover:bg-slate-50 text-[#141413] shadow-[3px_3px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-xs sm:text-sm uppercase cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-[#141413]" />
                <span>Download Syllabus PDF</span>
              </button>
            </div>

            {/* Micro-Trust Badge */}
            <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
              <div className="flex items-center -space-x-2">
                <div className="w-7 h-7 rounded-full border-2 border-[#141413] bg-[#FEF08A] font-black text-[11px] grid place-items-center shadow-[1px_1px_0px_0px_#141413]">
                  T
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-[#141413] bg-[#BAE6FD] font-black text-[11px] grid place-items-center shadow-[1px_1px_0px_0px_#141413]">
                  S
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-[#141413] bg-[#E9D5FF] font-black text-[11px] grid place-items-center shadow-[1px_1px_0px_0px_#141413]">
                  R
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#141413] text-xs font-mono font-bold text-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Only 6 seats left for Nov 23 cohort · Small batch of 10–20</span>
              </div>
            </div>

            {/* 4. Unified Bento Showcase Grid: 3 Outcome Cards (Row 1) + Founder Transition Banner (Row 2) */}
            <div className="max-w-5xl mx-auto mb-14 flex flex-col gap-5 text-left">
              
              {/* Row 1: The 3 Outcome Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Outcome 01: Warm Butter Yellow */}
                <div className="bg-[#FEF08A] rounded-2xl border-2 border-[#141413] p-5 sm:p-6 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#141413] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-white border-2 border-[#141413] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#141413]">
                        <FileText className="w-5 h-5 text-[#141413]" />
                      </div>
                      <span className="rounded-full border-2 border-[#141413] bg-[#141413] text-white px-3 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider">
                        OUTCOME 01
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#141413] leading-snug mb-1.5">
                      A PM-ready resume and LinkedIn
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#141413]/80 leading-relaxed">
                      Overhauled to showcase product signals &amp; recruiter-clearing metrics.
                    </p>
                  </div>
                  {/* UI Micro-Preview: ATS Score & Signal Indicator */}
                  <div className="mt-5 pt-3.5 border-t-2 border-[#141413]/15 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border-2 border-[#141413] text-[10px] sm:text-[11px] font-mono font-black text-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ATS Score: 92/100
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#141413]/70 uppercase">
                      Screening ✓
                    </span>
                  </div>
                </div>

                {/* Outcome 02: StepSmart Mint/Cyan */}
                <div className="bg-[#BAE6FD] rounded-2xl border-2 border-[#141413] p-5 sm:p-6 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#141413] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-white border-2 border-[#141413] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#141413]">
                        <Layers className="w-5 h-5 text-[#0284c7]" />
                      </div>
                      <span className="rounded-full border-2 border-[#141413] bg-[#141413] text-white px-3 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider">
                        OUTCOME 02
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#141413] leading-snug mb-1.5">
                      2 portfolio projects you can show
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#141413]/80 leading-relaxed">
                      End-to-end teardowns, PRDs, prototypes &amp; data analysis case studies.
                    </p>
                  </div>
                  {/* UI Micro-Preview: Miniature Capstone Pill Tags */}
                  <div className="mt-5 pt-3.5 border-t-2 border-[#141413]/15 flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-[#141413] text-[10px] font-mono font-black text-[#141413] shadow-[1px_1px_0px_0px_#141413]">
                      Swiggy Teardown
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-[#141413] text-[10px] font-mono font-black text-[#141413] shadow-[1px_1px_0px_0px_#141413]">
                      AI PRD
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-[#141413] text-[10px] font-mono font-black text-[#141413] shadow-[1px_1px_0px_0px_#141413]">
                      SQL Metrics
                    </span>
                  </div>
                </div>

                {/* Outcome 03: Soft Lavender */}
                <div className="bg-[#E9D5FF] rounded-2xl border-2 border-[#141413] p-5 sm:p-6 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#141413] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-white border-2 border-[#141413] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#141413]">
                        <MessageSquare className="w-5 h-5 text-[#7c3aed]" />
                      </div>
                      <span className="rounded-full border-2 border-[#141413] bg-[#141413] text-white px-3 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider">
                        OUTCOME 03
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#141413] leading-snug mb-1.5">
                      Feedback from 2 live mock interviews
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#141413]/80 leading-relaxed">
                      1:1 rubric evaluation across product sense, strategy, RCA &amp; behavioural.
                    </p>
                  </div>
                  {/* UI Micro-Preview: Mini Rubric Score Bar */}
                  <div className="mt-5 pt-3.5 border-t-2 border-[#141413]/15 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border-2 border-[#141413] text-[10px] sm:text-[11px] font-mono font-black text-[#7c3aed] shadow-[1.5px_1.5px_0px_0px_#141413]">
                      Product Sense: 4.8/5 ★
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#141413]/70 uppercase">
                      2 Mock Loops
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Full-Width Founder Transition Banner with Corner Badges (Chorke / GitBrush Style) */}
              <div className="relative mt-3 sm:mt-4">
                {/* Pinned 4-Point Brutalist Star on Top-Left Corner (GitBrush Style) */}
                <div className="absolute -top-3.5 -left-3 sm:-top-4 sm:-left-4 z-20 pointer-events-none select-none">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-[#E9D5FF] drop-shadow-[2px_2px_0px_#141413]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="#141413"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
                  </svg>
                </div>

                {/* Scalloped Yellow Stamp on Top-Right Corner (from Chorke & GitBrush) */}
                <div className="absolute -top-5 -right-3 sm:-top-6 sm:-right-4 z-20 select-none rotate-[6deg] hover:rotate-12 transition-transform">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                    <svg
                      className="absolute inset-0 w-full h-full text-[#FEF08A] drop-shadow-[3px_3px_0px_#141413]"
                      viewBox="0 0 100 100"
                      fill="currentColor"
                      stroke="#141413"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    >
                      <path d="M 39.65 11.36 Q 50.0 1.0 60.35 11.36 Q 74.5 7.56 78.28 21.72 Q 92.44 25.5 88.64 39.65 Q 99.0 50.0 88.64 60.35 Q 92.44 74.5 78.28 78.28 Q 74.5 92.44 60.35 88.64 Q 50.0 99.0 39.65 88.64 Q 25.5 92.44 21.72 78.28 Q 7.56 74.5 11.36 60.35 Q 1.0 50.0 11.36 39.65 Q 7.56 25.5 21.72 21.72 Q 25.5 7.56 39.65 11.36 Z" />
                    </svg>
                    <div className="relative z-10 text-center font-mono font-black text-[#141413] leading-none flex flex-col items-center justify-center px-1">
                      <span className="text-[10px] sm:text-[11px] tracking-tight uppercase">ZERO MBA</span>
                      <span className="text-[9px] sm:text-[10px] text-[#141413]/70 my-0.5">•</span>
                      <span className="text-[10px] sm:text-[11px] tracking-tight uppercase">ZERO CS</span>
                    </div>
                  </div>
                </div>

                {/* The Clean Original Graphic Frame with Exact Same Border-Radius & Shadow */}
                <div className="bg-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] shadow-[0px_4px_0px_0px_#141413] overflow-hidden">
                  <div className="w-full aspect-[1024/536] overflow-hidden bg-[#188ab2]">
                    <img
                      src="/hero-slide-1.webp"
                      alt="PM Switch Story: 'I switched into PM with zero product experience. No CS degree. No MBA. Just the right preparation.'"
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>

            </div>



            {/* Ram Setu Guesstimate Lab Featured Banner */}
            <div className="max-w-4xl mx-auto mb-14 text-left">
              <div className="bg-[#FFFDF5] rounded-2xl border-2 sm:border-[2.5px] border-[#141413] shadow-[0px_6px_0px_0px_#141413] p-6 sm:p-8 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Thumbnail / Image with Architectural Border */}
                  <div className="w-full md:w-56 shrink-0">
                    <div className="relative rounded-xl border-2 border-[#141413] overflow-hidden shadow-[3px_3px_0px_0px_#141413] aspect-[4/3] bg-[#FEF08A]">
                      <img
                        src="/ram_setu_vanaras.jpg"
                        alt="Vanara Army building Ram Setu - Guesstimate Lab"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-[#141413] text-[#FEF08A] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-white">
                        Interactive Case
                      </div>
                    </div>
                  </div>

                  {/* Copy & CTA */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="bg-[#FEF08A] text-[#141413] font-mono text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413] shadow-[1px_1px_0px_0px_#141413]">
                        🪨 GUESSTIMATE LAB
                      </span>
                      <span className="text-xs font-bold text-[#141413]/70">
                        Interactive Estimation Challenge · Instant Scoring
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight mb-2">
                      Ram Setu Causeway: How many stones are needed to cross the ocean?
                    </h3>
                    <p className="text-xs sm:text-sm text-[#141413]/80 leading-relaxed mb-4">
                      Step into the sandals of King Rama’s Chief Estimation PM. Break down the causeway’s 3D physical dimensions, choose whether to ask the royal architects or make educated assumptions, calculate the stone volume, and submit your score to the cohort leaderboard.
                    </p>

                    <div className="flex items-center gap-3">
                      <Link
                        to="/case-simulator"
                        className="px-5 py-2.5 rounded-full font-black border-2 border-[#141413] bg-[#141413] hover:bg-[#262624] text-white shadow-[2.5px_2.5px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-xs sm:text-sm uppercase inline-flex items-center gap-2"
                      >
                        <span>Launch Guesstimate Lab</span>
                        <span>➔</span>
                      </Link>
                      <span className="text-xs text-[#141413]/60 font-semibold hidden sm:inline">
                        6 dimensional breakdown boxes · Live Leaderboard
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Path Picker (Replaces scroll to stories) */}
            <div className="mb-14 max-w-4xl mx-auto text-left">
              <div className="text-center mb-8">
                <span className="bg-[#FEF08A] rounded-full border-2 border-[#141413] px-4 py-1 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#141413] rotate-[-1deg] inline-block mb-3 select-none">
                  PATH PICKER
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-[#141413] tracking-tight">
                  Where are you starting from?
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#141413]/75 mt-2">
                  Select your current background to see your exact gap and recommended modules.
                </p>
              </div>

              {/* 4 Path Options with Rounded Corners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6">
                {/* Option 1: Ops, QA, BA */}
                <button
                  type="button"
                  onClick={() => setSelectedRolePath('ops')}
                  className={`w-full text-left p-5 sm:p-6 rounded-2xl border-2 border-[#141413] transition-all cursor-pointer group flex flex-col justify-between select-none ${
                    selectedRolePath === 'ops'
                      ? 'bg-[#188ab2] text-white shadow-[0px_5px_0px_0px_#141413] translate-y-[-2px]'
                      : 'bg-white hover:bg-slate-50 text-[#141413] shadow-[0px_3px_0px_0px_#141413] active:translate-y-[2px] active:shadow-none'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-base sm:text-lg font-black ${selectedRolePath === 'ops' ? 'text-white' : 'text-[#141413]'}`}>
                        Ops, QA or business analyst
                      </span>
                      <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border ${
                        selectedRolePath === 'ops'
                          ? 'bg-[#FEF08A] text-[#141413] border-[#141413] shadow-[1px_1px_0px_0px_#141413]'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {selectedRolePath === 'ops' ? 'SELECTED ✓' : 'SELECT'}
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm font-medium leading-relaxed italic ${
                      selectedRolePath === 'ops' ? 'text-white/95' : 'text-[#141413]/80'
                    }`}>
                      “I deliver products every day, but my title says otherwise.”
                    </p>
                  </div>
                </button>

                {/* Option 2: Software engineer or tech lead */}
                <button
                  type="button"
                  onClick={() => setSelectedRolePath('swe')}
                  className={`w-full text-left p-5 sm:p-6 rounded-2xl border-2 border-[#141413] transition-all cursor-pointer group flex flex-col justify-between select-none ${
                    selectedRolePath === 'swe'
                      ? 'bg-[#188ab2] text-white shadow-[0px_5px_0px_0px_#141413] translate-y-[-2px]'
                      : 'bg-white hover:bg-slate-50 text-[#141413] shadow-[0px_3px_0px_0px_#141413] active:translate-y-[2px] active:shadow-none'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-base sm:text-lg font-black ${selectedRolePath === 'swe' ? 'text-white' : 'text-[#141413]'}`}>
                        Software engineer or tech lead
                      </span>
                      <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border ${
                        selectedRolePath === 'swe'
                          ? 'bg-[#FEF08A] text-[#141413] border-[#141413] shadow-[1px_1px_0px_0px_#141413]'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {selectedRolePath === 'swe' ? 'SELECTED ✓' : 'SELECT'}
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm font-medium leading-relaxed italic ${
                      selectedRolePath === 'swe' ? 'text-white/95' : 'text-[#141413]/80'
                    }`}>
                      “I build it. I want to own the what and why.”
                    </p>
                  </div>
                </button>

                {/* Option 3: Analytics, marketing or design */}
                <button
                  type="button"
                  onClick={() => setSelectedRolePath('analytics')}
                  className={`w-full text-left p-5 sm:p-6 rounded-2xl border-2 border-[#141413] transition-all cursor-pointer group flex flex-col justify-between select-none ${
                    selectedRolePath === 'analytics'
                      ? 'bg-[#188ab2] text-white shadow-[0px_5px_0px_0px_#141413] translate-y-[-2px]'
                      : 'bg-white hover:bg-slate-50 text-[#141413] shadow-[0px_3px_0px_0px_#141413] active:translate-y-[2px] active:shadow-none'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-base sm:text-lg font-black ${selectedRolePath === 'analytics' ? 'text-white' : 'text-[#141413]'}`}>
                        Analytics, marketing or design
                      </span>
                      <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border ${
                        selectedRolePath === 'analytics'
                          ? 'bg-[#FEF08A] text-[#141413] border-[#141413] shadow-[1px_1px_0px_0px_#141413]'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {selectedRolePath === 'analytics' ? 'SELECTED ✓' : 'SELECT'}
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm font-medium leading-relaxed italic ${
                      selectedRolePath === 'analytics' ? 'text-white/95' : 'text-[#141413]/80'
                    }`}>
                      “I work close to users and data. I need the PM story.”
                    </p>
                  </div>
                </button>

                {/* Option 4: Sales, finance, consulting or something else */}
                <button
                  type="button"
                  onClick={() => setSelectedRolePath('other')}
                  className={`w-full text-left p-5 sm:p-6 rounded-2xl border-2 border-[#141413] transition-all cursor-pointer group flex flex-col justify-between select-none ${
                    selectedRolePath === 'other'
                      ? 'bg-[#188ab2] text-white shadow-[0px_5px_0px_0px_#141413] translate-y-[-2px]'
                      : 'bg-white hover:bg-slate-50 text-[#141413] shadow-[0px_3px_0px_0px_#141413] active:translate-y-[2px] active:shadow-none'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-base sm:text-lg font-black ${selectedRolePath === 'other' ? 'text-white' : 'text-[#141413]'}`}>
                        Sales, finance, consulting or something else
                      </span>
                      <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border ${
                        selectedRolePath === 'other'
                          ? 'bg-[#FEF08A] text-[#141413] border-[#141413] shadow-[1px_1px_0px_0px_#141413]'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {selectedRolePath === 'other' ? 'SELECTED ✓' : 'SELECT'}
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm font-medium leading-relaxed italic ${
                      selectedRolePath === 'other' ? 'text-white/95' : 'text-[#141413]/80'
                    }`}>
                      “I don’t fit a box. Show me how my work maps to PM.”
                    </p>
                  </div>
                </button>
              </div>

              {/* What appears after a choice (In-place Diagnosis & Resolution Card in Rounded 2XL Frame) */}
              <div className="bg-[#FEF08A] rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="bg-white text-[#141413] rounded-full border-2 border-[#141413] px-3.5 py-1 text-xs font-mono font-black uppercase shadow-[1.5px_1.5px_0px_0px_#141413]">
                    ★ YOUR DIAGNOSIS &amp; RECOMMENDED MODULES
                  </span>
                  <span className="text-xs font-black uppercase text-[#188ab2]">
                    {selectedRolePath === 'ops' && 'PATH: OPS / QA / BA → PM'}
                    {selectedRolePath === 'swe' && 'PATH: SDE / TECH LEAD → PM'}
                    {selectedRolePath === 'analytics' && 'PATH: ANALYTICS / MARKETING / DESIGN → PM'}
                    {selectedRolePath === 'other' && 'PATH: GENERAL / CROSS-FUNCTIONAL → PM'}
                  </span>
                </div>

                <div className="text-base sm:text-xl font-black text-[#141413] leading-relaxed mb-6">
                  {selectedRolePath === 'ops' && (
                    <p>
                      Your gap is the label, not the work. <span className="bg-white rounded-lg px-2.5 py-0.5 border-2 border-[#141413] inline-block shadow-[1px_1px_0px_0px_#141413]">Module 1</span> maps what you already do to PM skills; <span className="bg-white rounded-lg px-2.5 py-0.5 border-2 border-[#141413] inline-block shadow-[1px_1px_0px_0px_#141413]">Module 2</span> turns it into two projects.
                    </p>
                  )}
                  {selectedRolePath === 'swe' && (
                    <p>
                      Your gap is showing you can lead with the user and the business case. Start with <span className="bg-white rounded-lg px-2.5 py-0.5 border-2 border-[#141413] inline-block shadow-[1px_1px_0px_0px_#141413]">Module 2</span>; add <span className="bg-white rounded-lg px-2.5 py-0.5 border-2 border-[#141413] inline-block shadow-[1px_1px_0px_0px_#141413]">Module 3</span> for product sense and strategy rounds.
                    </p>
                  )}
                  {selectedRolePath === 'analytics' && (
                    <p>
                      Your gap is telling it as a product story. <span className="bg-white rounded-lg px-2.5 py-0.5 border-2 border-[#141413] inline-block shadow-[1px_1px_0px_0px_#141413]">Module 1</span> builds it; <span className="bg-white rounded-lg px-2.5 py-0.5 border-2 border-[#141413] inline-block shadow-[1px_1px_0px_0px_#141413]">Module 3</span> makes you comfortable saying it out loud.
                    </p>
                  )}
                  {selectedRolePath === 'other' && (
                    <p>
                      Your gap is translation. <span className="bg-white rounded-lg px-2.5 py-0.5 border-2 border-[#141413] inline-block shadow-[1px_1px_0px_0px_#141413]">Module 1</span> shows you how to map your work to PM skills with a real job description in front of you.
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t-2 border-[#141413]/20">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Primary Button */}
                    <button
                      onClick={() => scrollToSection('pricing')}
                      className="px-7 py-3.5 rounded-full bg-[#188ab2] hover:bg-[#0f6f8f] text-white border-2 border-[#141413] font-black text-sm uppercase shadow-[0px_4px_0px_0px_#141413] hover:translate-y-[-1px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer text-center"
                    >
                      Reserve your seat ➜
                    </button>

                    {/* Secondary Button */}
                    <button
                      onClick={() => scrollToSection('system')}
                      className="px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#141413] border-2 border-[#141413] font-black text-sm uppercase shadow-[0px_4px_0px_0px_#141413] hover:translate-y-[-1px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer text-center"
                    >
                      See the programme ➜
                    </button>

                    <button
                      onClick={() => {
                        setBrochureFormStatus('idle');
                        setIsBrochureModalOpen(true);
                      }}
                      className="text-xs font-bold text-[#141413] hover:text-[#188ab2] underline sm:ml-auto inline-flex items-center justify-center gap-1 cursor-pointer py-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Syllabus PDF</span>
                    </button>
                  </div>

                  {/* Line under the buttons */}
                  <p className="text-xs sm:text-sm font-extrabold text-[#141413]/85 mt-3 pt-3 border-t border-[#141413]/15">
                    Module ₹7,000 each · AI PM ₹30,000 · No job guarantee, just the work that gets you ready.
                  </p>
                </div>
              </div>
            </div>

            {/* Spec Bar (Rounded 2XL, tactile shadow) */}
            <div className="bg-[#e6f1fb] rounded-2xl border-2 border-[#141413] p-5 shadow-[0px_4px_0px_0px_#141413] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-black uppercase text-[#141413]">
              <div>
                <span className="text-[#141413] opacity-75 block text-[10px] font-black">NEXT COHORT</span>
                <span className="text-[#141413] font-black">STARTS 1ST DEC</span>
              </div>
              <div>
                <span className="text-[#141413] opacity-75 block text-[10px] font-black">SCHEDULE</span>
                <span className="text-[#141413] font-black">WED, SAT &amp; SUN</span>
              </div>
              <div>
                <span className="text-[#141413] opacity-75 block text-[10px] font-black">BATCH SIZE</span>
                <span className="text-[#188ab2] font-black">10-20 SEATS</span>
              </div>
              <div>
                <span className="text-[#141413] opacity-75 block text-[10px] font-black">MENTORS</span>
                <span className="text-[#141413] font-black">MSFT &amp; MASTERCARD</span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. REAL PEOPLE. REAL TRANSITIONS. (Testimonials) */}
        <section id="outcomes" className="py-20 bg-[#FAF9F5] border-b-2 border-[#141413] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-7xl">
            
            <div className="text-center mb-16">
              <div className="inline-block mb-3">
                <span className="bg-[#FEF08A] rounded-full border-2 border-[#141413] px-4 py-1 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_#141413] rotate-[-1deg] inline-block select-none">
                  TESTIMONIALS
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#141413] mb-3 tracking-tight">
                Real people.{' '}
                <span className="inline-block bg-[#FEF08A] border-2 border-[#141413] rounded-xl px-3.5 py-0.5 rotate-[1.5deg] shadow-[0px_3px_0px_0px_#141413]">
                  Real transitions.
                </span>
              </h2>
              <p className="text-sm sm:text-base font-bold text-[#141413]/75 max-w-xl mx-auto">
                Hear it from people who started where you are. In their own words.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              
              {/* Triya */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] p-6 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#141413] transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#188ab2] text-white border-2 border-[#141413] grid place-items-center font-black text-lg mb-4 shadow-[0px_2px_0px_0px_#141413]">
                    T
                  </div>
                  <p className="font-medium text-sm text-[#141413]/90 leading-relaxed mb-6 italic">
                    “PM-X gave me the clarity and confidence I needed to make the transition.”
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-[#141413]/10">
                  <b className="block text-[#141413] text-sm font-black">Triya</b>
                  <small className="text-[#141413]/70 font-medium text-xs block">Business Analyst → PM at ACKO</small>
                </div>
              </div>

              {/* Nishant */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] p-6 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#141413] transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#188ab2] text-white border-2 border-[#141413] grid place-items-center font-black text-lg mb-4 shadow-[0px_2px_0px_0px_#141413]">
                    N
                  </div>
                  <p className="font-medium text-sm text-[#141413]/90 leading-relaxed mb-6 italic">
                    “From zero interview calls to landing a PM internship in under a month.”
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-[#141413]/10">
                  <b className="block text-[#141413] text-sm font-black">Nishant</b>
                  <small className="text-[#141413]/70 font-medium text-xs block">Student → APM Intern, Surepass</small>
                </div>
              </div>

              {/* Gauri T. */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] p-6 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#141413] transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#188ab2] text-white border-2 border-[#141413] grid place-items-center font-black text-lg mb-4 shadow-[0px_2px_0px_0px_#141413]">
                    G
                  </div>
                  <p className="font-medium text-sm text-[#141413]/90 leading-relaxed mb-6 italic">
                    “Watching peers articulate product thinking made me believe I could become a PM.”
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-[#141413]/10">
                  <b className="block text-[#141413] text-sm font-black">Gauri T.</b>
                  <small className="text-[#141413]/70 font-medium text-xs block">Product Manager</small>
                </div>
              </div>

              {/* Nishtha */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] p-6 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#141413] transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#188ab2] text-white border-2 border-[#141413] grid place-items-center font-black text-lg mb-4 shadow-[0px_2px_0px_0px_#141413]">
                    N
                  </div>
                  <p className="font-medium text-sm text-[#141413]/90 leading-relaxed mb-6 italic">
                    “PM-X helped me break overwhelming case studies into clear, actionable chunks.”
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-[#141413]/10">
                  <b className="block text-[#141413] text-sm font-black">Nishtha</b>
                  <small className="text-[#141413]/70 font-medium text-xs block">Product Manager, Amex</small>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 5. WHY PEOPLE STAY STUCK & THE REFRAME */}
        <section className="py-20 bg-white border-b-2 border-[#141413]">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            
            <div className="inline-block mb-3">
              <span className="bg-[#FEF08A] rounded-full border-2 border-[#141413] px-4 py-1 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#141413] rotate-[-1deg] inline-block select-none">
                THE ROOT CAUSE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#141413] mb-12 tracking-tight">
              Three things keep career switchers{' '}
              <span className="inline-block bg-[#FEF08A] border-2 border-[#141413] rounded-xl px-3.5 py-0.5 rotate-[-1.5deg] shadow-[0px_3px_0px_0px_#141413]">
                stuck
              </span>
            </h2>

            {/* 3 Diagnosis Cards (Soft Architectural Neo-Brutalism) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-10">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] p-6 shadow-[0px_4px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#141413] transition-all">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-rose-100 border-2 border-[#141413] flex items-center justify-center font-black text-rose-800 text-sm mb-4 shadow-[0px_2px_0px_0px_#141413]">
                    01
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#141413] mb-3 leading-snug">
                    You’ve watched the videos and nothing sticks.
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#141413]/85 leading-relaxed">
                    Watching is not practising. Structuring a problem out loud is a habit, and habits need repetition with feedback.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t-2 border-[#141413]/10">
                  <span className="inline-block rounded-full bg-[#D1FAE5] text-emerald-950 border border-[#141413] font-mono font-black text-[11px] px-3 py-0.5 shadow-[0px_1.5px_0px_0px_#141413]">
                    → Fixed in Module 3
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] p-6 shadow-[0px_4px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#141413] transition-all">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-rose-100 border-2 border-[#141413] flex items-center justify-center font-black text-rose-800 text-sm mb-4 shadow-[0px_2px_0px_0px_#141413]">
                    02
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#141413] mb-3 leading-snug">
                    Your resume says analyst, engineer or ops.
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#141413]/85 leading-relaxed">
                    Recruiters scan for PM signals in seconds. If they are not on the page, nobody reads your real work.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t-2 border-[#141413]/10">
                  <span className="inline-block rounded-full bg-[#e0f2fe] text-sky-950 border border-[#141413] font-mono font-black text-[11px] px-3 py-0.5 shadow-[0px_1.5px_0px_0px_#141413]">
                    → Fixed in Module 1
                  </span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] p-6 shadow-[0px_4px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#141413] transition-all">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-rose-100 border-2 border-[#141413] flex items-center justify-center font-black text-rose-800 text-sm mb-4 shadow-[0px_2px_0px_0px_#141413]">
                    03
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#141413] mb-3 leading-snug">
                    You feel like you would be faking it.
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#141413]/85 leading-relaxed">
                    You would not be. You would be showing real work you can honestly talk through.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t-2 border-[#141413]/10">
                  <span className="inline-block rounded-full bg-[#FEF08A] text-[#141413] border border-[#141413] font-mono font-black text-[11px] px-3 py-0.5 shadow-[0px_1.5px_0px_0px_#141413]">
                    → Fixed in Module 2
                  </span>
                </div>
              </div>
            </div>

            {/* Proof line */}
            <div className="max-w-2xl mx-auto mb-8">
              <p className="bg-[#e6f1fb] rounded-xl border-2 border-[#141413] py-3 px-5 font-mono font-bold text-xs sm:text-sm text-[#141413] shadow-[0px_3px_0px_0px_#141413]">
                📊 53% of aspiring PMs in our community say “no PM experience on my resume” is their biggest blocker.{' '}
                <span className="text-slate-600 block sm:inline font-normal text-[11px]">[Source: StepSmart Community Career Survey, n=420]</span>
              </p>
            </div>

            {/* Punch line */}
            <div className="bg-[#FEF08A] rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 text-center font-black text-xl md:text-2xl text-[#141413] max-w-2xl mx-auto shadow-[0px_5px_0px_0px_#141413] rotate-[-0.5deg] mb-8 select-none">
              You don’t lack experience — what you lack is proof recruiters can see.
            </div>

            {/* Bridge to the next section */}
            <p className="text-sm sm:text-base md:text-lg font-bold text-[#141413]/85 max-w-2xl mx-auto leading-relaxed">
              Three gaps decide who gets the interview: how your experience reads, what evidence you can show, and how well you interview. The Accelerator has one module for each.
            </p>

          </div>
        </section>

        {/* 6. MODULES AND HOW THEY FIT */}
        <section id="system" className="py-14 md:py-18 bg-slate-50 border-b-2 border-[#141413] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-7xl">
            
            <div className="text-center mb-10 md:mb-14">
              <div className="inline-block mb-3">
                <span className="bg-[#FEF08A] rounded-full border-2 border-[#141413] px-4 py-1 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#141413] rotate-[-1deg] inline-block select-none">
                  THE ACCELERATOR ARCHITECTURE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#141413] mb-3 tracking-tight">
                Three live modules, built around{' '}
                <span className="inline-block bg-[#FEF08A] border-2 border-[#141413] rounded-xl px-3.5 py-0.5 rotate-[1.5deg] shadow-[0px_3px_0px_0px_#141413] select-none">
                  what recruiters look for
                </span>
              </h2>
              <p className="text-base sm:text-lg font-bold text-[#141413]/85 max-w-2xl mx-auto leading-relaxed">
                Take all three, or start with the one you need most. Every module is live, hands-on and in a group of 10–20.
              </p>
            </div>

            {/* Clean, Uniform 4-Column Grid with Soft Neo-Brutalist Bento styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
              
              {/* Module 1: AI Builder */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] shadow-[0px_5px_0px_0px_#141413] flex flex-col justify-between h-full hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_#141413] transition-all overflow-hidden">
                <div>
                  <div className="p-3.5 bg-[#188ab2] text-white border-b-2 border-[#141413] font-mono font-black flex items-center justify-between">
                    <span className="text-xs sm:text-sm tracking-wider">MODULE 01</span>
                    <span className="bg-[#FEF08A] text-[#141413] rounded-full border-2 border-[#141413] px-2.5 py-0.5 text-[10px] font-black uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                      5 live sessions
                    </span>
                  </div>
                  <div className="p-5 pb-2">
                    <h3 className="font-mono font-black text-xl text-[#141413] tracking-tight mb-1">
                      AI Builder
                    </h3>
                    <p className="text-xs font-bold text-[#188ab2] leading-snug">
                      Build proof you can show.
                    </p>
                  </div>
                  <ul className="p-5 pt-1 space-y-2.5 font-bold text-xs sm:text-sm text-[#141413]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>PRD writing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>Product teardown</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>Market and user research</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>A data analysis project</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>Prototype building</span>
                    </li>
                  </ul>
                </div>
                <div className="m-4 mt-auto rounded-xl border-2 border-[#141413] bg-[#e6f1fb] p-3.5 text-left shadow-[0px_2px_0px_0px_#141413]">
                  <div className="font-mono font-black text-[10px] uppercase text-[#188ab2] mb-0.5">
                    5 LIVE SESSIONS · YOU LEAVE WITH:
                  </div>
                  <p className="text-xs font-black text-[#141413] leading-tight">
                    2 portfolio projects you can show and talk through in interviews.
                  </p>
                </div>
              </div>

              {/* Module 2: Profile Enhancer */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] shadow-[0px_5px_0px_0px_#141413] flex flex-col justify-between h-full hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_#141413] transition-all overflow-hidden">
                <div>
                  <div className="p-3.5 bg-[#188ab2] text-white border-b-2 border-[#141413] font-mono font-black flex items-center justify-between">
                    <span className="text-xs sm:text-sm tracking-wider">MODULE 02</span>
                    <span className="bg-[#FEF08A] text-[#141413] rounded-full border-2 border-[#141413] px-2.5 py-0.5 text-[10px] font-black uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                      5 live sessions
                    </span>
                  </div>
                  <div className="p-5 pb-2">
                    <h3 className="font-mono font-black text-xl text-[#141413] tracking-tight mb-1">
                      Profile Enhancer
                    </h3>
                    <p className="text-xs font-bold text-[#188ab2] leading-snug">
                      Make your experience read like a PM’s.
                    </p>
                  </div>
                  <ul className="p-5 pt-1 space-y-2.5 font-bold text-xs sm:text-sm text-[#141413]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>Map the work you already do to PM skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>Rewrite your resume and overhaul your LinkedIn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>Build your PM story</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>Plan your applications around your profile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>Get access to stepsmart job board [Daily most recent PM jobs across all the portals at your disposle]</span>
                    </li>
                  </ul>
                </div>
                <div className="m-4 mt-auto rounded-xl border-2 border-[#141413] bg-[#fef3c7] p-3.5 text-left shadow-[0px_2px_0px_0px_#141413]">
                  <div className="font-mono font-black text-[10px] uppercase text-amber-900 mb-0.5">
                    5 LIVE SESSIONS · YOU LEAVE WITH:
                  </div>
                  <p className="text-xs font-black text-[#141413] leading-tight">
                    A PM-ready resume, an updated LinkedIn and a target list of companies you should apply for.
                  </p>
                </div>
              </div>

              {/* Module 3: Interview Practice */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] shadow-[0px_5px_0px_0px_#141413] flex flex-col justify-between h-full hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_#141413] transition-all overflow-hidden">
                <div>
                  <div className="p-3.5 bg-[#188ab2] text-white border-b-2 border-[#141413] font-mono font-black flex items-center justify-between">
                    <span className="text-xs sm:text-sm tracking-wider">MODULE 03</span>
                    <span className="bg-[#FEF08A] text-[#141413] rounded-full border-2 border-[#141413] px-2.5 py-0.5 text-[10px] font-black uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                      8 sessions + 2 mocks
                    </span>
                  </div>
                  <div className="p-5 pb-2">
                    <h3 className="font-mono font-black text-xl text-[#141413] tracking-tight mb-1">
                      Interview Practice
                    </h3>
                    <p className="text-xs font-bold text-[#188ab2] leading-snug">
                      Practise out loud and get feedback.
                    </p>
                  </div>
                  <ul className="p-5 pt-1 space-y-2.5 font-bold text-xs sm:text-sm text-[#141413]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>Analytics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>Product sense</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>Product strategy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>Behavioural rounds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">•</span>
                      <span>Root cause analysis (RCA)</span>
                    </li>
                  </ul>
                </div>
                <div className="m-4 mt-auto rounded-xl border-2 border-[#141413] bg-[#D1FAE5] p-3.5 text-left shadow-[0px_2px_0px_0px_#141413]">
                  <div className="font-mono font-black text-[10px] uppercase text-emerald-900 mb-0.5">
                    8 LIVE SESSIONS + 2 MOCKS · YOU LEAVE WITH:
                  </div>
                  <p className="text-xs font-black text-[#141413] leading-tight">
                    1:1 feedback from your 2 live mock interviews.
                  </p>
                </div>
              </div>

              {/* Learn Module (comes free with AI PM) */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] shadow-[0px_5px_0px_0px_#141413] flex flex-col justify-between h-full hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_#141413] transition-all overflow-hidden">
                <div>
                  <div className="p-3.5 bg-[#141413] text-white border-b-2 border-[#141413] font-mono font-black flex items-center justify-between">
                    <span className="text-xs sm:text-sm tracking-wider">LEARN MODULE</span>
                    <span className="bg-[#A7F3D0] text-emerald-950 rounded-full border-2 border-[#141413] px-2.5 py-0.5 text-[10px] font-black uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                      Free with AI PM
                    </span>
                  </div>
                  <div className="p-5 pb-2">
                    <h3 className="font-mono font-black text-xl text-[#141413] tracking-tight mb-1">
                      Learn Module
                    </h3>
                    <p className="text-xs font-bold text-[#141413]/80 leading-snug">
                      Your self-paced library behind the three live modules.
                    </p>
                  </div>
                  <ul className="p-5 pt-1 space-y-2.5 font-bold text-xs sm:text-sm text-[#141413]">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-black mt-0.5">•</span>
                      <span>Recorded lectures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-black mt-0.5">•</span>
                      <span>Question bank</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-black mt-0.5">•</span>
                      <span>Case Resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-black mt-0.5">•</span>
                      <span>Company-wise resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-black mt-0.5">•</span>
                      <span>PM Gym</span>
                    </li>
                  </ul>
                </div>
                <div className="m-4 mt-auto rounded-xl border-2 border-[#141413] bg-[#FEF08A] p-3.5 text-left shadow-[0px_2px_0px_0px_#141413]">
                  <div className="font-mono font-black text-[10px] uppercase text-[#141413] mb-0.5">
                    SELF-PACED LIBRARY · NOT SOLD SEPARATELY
                  </div>
                  <p className="text-xs font-black text-[#141413] leading-tight">
                    Recorded lectures · Question bank · Case Resources · Company-wise resources · PM Gym. Not sold separately.
                  </p>
                </div>
              </div>

            </div>

            {/* Single-module note */}
            <div className="max-w-5xl mx-auto mb-10">
              <div className="bg-[#FEF08A] rounded-2xl border-2 border-[#141413] p-4 sm:p-5 text-center font-bold text-xs sm:text-sm text-[#141413] shadow-[0px_4px_0px_0px_#141413]">
                <span className="font-mono font-black uppercase text-xs bg-white rounded-full px-3 py-1 border-2 border-[#141413] mr-2 inline-block mb-1 sm:mb-0 shadow-[0px_1.5px_0px_0px_#141413]">
                  SINGLE-MODULE NOTE
                </span>
                Buying one module? You join the same live group for that module and can add the others later at 7k.
              </div>
            </div>

            {/* NEW BLOCK: HOW THE MODULES FIT TOGETHER (SIMPLE GRAPHIC) */}
            <div className="bg-white rounded-3xl border-2 border-[#141413] p-6 sm:p-10 shadow-[0px_6px_0px_0px_#141413] text-left max-w-5xl mx-auto">
              
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="bg-[#FEF08A] rounded-full border-2 border-[#141413] px-3.5 py-1 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#141413] rotate-[-1deg] inline-block select-none">
                  COHORT TIMELINE · STARTS 1ST DEC
                </span>
                <span className="font-mono font-black text-xs uppercase text-[#188ab2] bg-[#e0f2fe] rounded-full border-2 border-[#141413] px-3 py-1 shadow-[0px_1.5px_0px_0px_#141413]">
                  8 Weeks · 4-Pillar Proven Methodology
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#141413] tracking-tight mb-3">
                Your path through the Accelerator
              </h3>
              
              <p className="text-xs sm:text-sm md:text-base font-bold text-[#141413]/85 max-w-3xl mb-8 leading-relaxed">
                Four steps. One finished project. An 8-week, mentor-led program designed for professionals who want to break into Product Management. Master product thinking, build a production-grade portfolio, nail interviews, and leverage AI like a modern PM.
              </p>

              {/* TIMELINE CONTAINER (MATCHING BROCHURE 4-PILLAR METHODOLOGY & 8-WEEK STRUCTURE) */}
              <div className="rounded-2xl border-2 border-[#141413] bg-slate-50 p-4 sm:p-6 shadow-[0px_4px_0px_0px_#141413]">
                
                {/* 4 Pillars Grid (Wed Learn, Sun Build, Sat Practice, Post Career) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Step 1: Learn */}
                  <div className="bg-[#e0f2fe] rounded-xl border-2 border-[#141413] p-4 flex flex-col justify-between shadow-[0px_2px_0px_0px_#141413]">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-black text-xs text-[#188ab2] uppercase">01 · STEP 1: LEARN</span>
                        <span className="bg-white rounded-full border border-[#141413] font-mono font-black text-[10px] px-2 py-0.5">WEDNESDAYS</span>
                      </div>
                      <p className="text-xs font-bold text-[#141413] mb-2">
                        8 live classes on product thinking mindset, research, strategy, MVPs, tech basics &amp; AI 101.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#141413]/15 text-[11px] font-black text-[#188ab2]">
                      ✦ Outcome: Talk product like an insider.
                    </div>
                  </div>

                  {/* Step 2: Build */}
                  <div className="bg-[#FEF08A] rounded-xl border-2 border-[#141413] p-4 flex flex-col justify-between shadow-[0px_2px_0px_0px_#141413]">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-black text-xs text-amber-950 uppercase">02 · STEP 2: BUILD</span>
                        <span className="bg-white rounded-full border border-[#141413] font-mono font-black text-[10px] px-2 py-0.5">SUNDAYS</span>
                      </div>
                      <p className="text-xs font-bold text-[#141413] mb-2">
                        Work on one real project start to finish: teardown, market research, user research, PRD &amp; clickable prototype.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#141413]/15 text-[11px] font-black text-amber-900">
                      ✦ Outcome: A documented project case study.
                    </div>
                  </div>

                  {/* Step 3: Practice */}
                  <div className="bg-[#D1FAE5] rounded-xl border-2 border-[#141413] p-4 flex flex-col justify-between shadow-[0px_2px_0px_0px_#141413]">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-black text-xs text-emerald-950 uppercase">03 · STEP 3: PRACTICE</span>
                        <span className="bg-white rounded-full border border-[#141413] font-mono font-black text-[10px] px-2 py-0.5">SATURDAYS</span>
                      </div>
                      <p className="text-xs font-bold text-[#141413] mb-2">
                        Live mock cases, root cause analysis, product design, metrics, estimation &amp; behavioral stories.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#141413]/15 text-[11px] font-black text-emerald-900">
                      ✦ Outcome: Structure answers under pressure.
                    </div>
                  </div>

                  {/* Step 4: Career */}
                  <div className="bg-[#f3e8ff] rounded-xl border-2 border-[#141413] p-4 flex flex-col justify-between shadow-[0px_2px_0px_0px_#141413]">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-black text-xs text-purple-950 uppercase">04 · STEP 4: CAREER</span>
                        <span className="bg-white rounded-full border border-[#141413] font-mono font-black text-[10px] px-2 py-0.5">AFTER COURSE</span>
                      </div>
                      <p className="text-xs font-bold text-[#141413] mb-2">
                        Resume &amp; LinkedIn rebuild around your project + StepSmart PM job board free for 3 months.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#141413]/15 text-[11px] font-black text-purple-900">
                      ✦ Outcome: Proof you can show &amp; roles to apply.
                    </div>
                  </div>
                </div>

                {/* Key Deliverables Checkpoints (Brochure Page 4) */}
                <div className="mb-4 bg-white rounded-xl border-2 border-[#141413] p-4 shadow-[0px_2px_0px_0px_#141413]">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <span className="font-mono font-black text-xs uppercase text-[#141413] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      KEY DELIVERABLES CHECKPOINTS (MENTOR-GRADED)
                    </span>
                    <span className="font-mono font-bold text-[10px] text-[#141413]/70 uppercase">
                      4 Assignments · Verified for Certificate Credit
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-[#141413] bg-[#f8fafc]">
                      <div className="font-mono font-black text-[10px] text-[#188ab2] uppercase">WEEK 2 ★</div>
                      <div className="font-black text-xs text-[#141413]">Market Research</div>
                      <div className="text-[11px] font-medium text-[#141413]/70">Competitor &amp; TAM analysis</div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-[#141413] bg-[#f8fafc]">
                      <div className="font-mono font-black text-[10px] text-[#188ab2] uppercase">WEEK 4 ★</div>
                      <div className="font-black text-xs text-[#141413]">Problem Framing</div>
                      <div className="text-[11px] font-medium text-[#141413]/70">Persona &amp; JTBD validation</div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-[#141413] bg-[#f8fafc]">
                      <div className="font-mono font-black text-[10px] text-[#188ab2] uppercase">WEEK 6 ★</div>
                      <div className="font-black text-xs text-[#141413]">Prototype</div>
                      <div className="text-[11px] font-medium text-[#141413]/70">Clickable user journey flow</div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-[#141413] bg-[#f8fafc]">
                      <div className="font-mono font-black text-[10px] text-[#188ab2] uppercase">WEEK 8 ★</div>
                      <div className="font-black text-xs text-[#141413]">Final Case Study</div>
                      <div className="text-[11px] font-medium text-[#141413]/70">Production-grade PM portfolio</div>
                    </div>
                  </div>
                </div>

                {/* 4 Commitment Metrics + PM Gym Underpinning */}
                <div className="bg-[#FEF08A] rounded-xl border-2 border-[#141413] p-3 flex flex-wrap items-center justify-between gap-3 shadow-[0px_2px_0px_0px_#141413]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-xs text-[#141413] uppercase flex items-center gap-1.5">
                      <span>💬</span>
                      <span>DAILY PM GYM + WHATSAPP DOUBT SUPPORT + LEARN LIBRARY</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono font-bold text-[#141413]">
                    <span>📅 8 Weeks</span>
                    <span>•</span>
                    <span>🎥 24 Live Classes (48 Hrs)</span>
                    <span>•</span>
                    <span>📄 1 Capstone Project</span>
                  </div>
                </div>

              </div>

              {/* Start Date Confirmation Banner */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-[#141413]/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs sm:text-sm font-extrabold text-[#141413]">
                    Cohort Starts <span className="bg-[#FEF08A] rounded-md px-2 py-0.5 border border-[#141413] font-mono font-black">1st December 2026</span> · Strictly capped to 10–20 seats
                  </span>
                </div>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="px-5 py-2 rounded-full bg-[#188ab2] text-white border-2 border-[#141413] text-xs font-black uppercase font-mono shadow-[0px_3px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_5px_0px_0px_#141413] transition-all cursor-pointer"
                >
                  Reserve AI PM for ₹30,000 ➜
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 8. WHAT YOU WALK AWAY WITH */}
        <section id="outcomes" className="py-20 bg-white border-b-2 border-[#141413] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-6xl text-center">
            
            {/* Header */}
            <div className="inline-block mb-3">
              <span className="bg-[#FEF08A] text-[#141413] rounded-full border-2 border-[#141413] px-4 py-1 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#141413] rotate-[-1deg] inline-block select-none">
                WHAT YOU WALK AWAY WITH
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#141413] tracking-tight mb-4">
              What you will have in your{' '}
              <span className="inline-block bg-[#FEF08A] text-[#141413] rounded-xl border-2 border-[#141413] px-3.5 py-0.5 rotate-[1.5deg] shadow-[0px_3px_0px_0px_#141413]">
                hands
              </span>
            </h2>
            <p className="text-sm sm:text-base font-bold text-[#141413]/80 max-w-xl mx-auto mb-14">
              Five tangible, production-grade deliverables recruiters and hiring managers can directly evaluate.
            </p>

            {/* 5 Deliverable Bento Cards with Overlapping Floating Circular Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left items-stretch">
              {[
                {
                  num: "01",
                  badgeBg: "bg-[#FEF08A]",
                  title: "A PM-ready resume and an updated LinkedIn",
                  desc: "Overhauled to showcase product signals, user metrics, and business outcomes that pass recruiter screening."
                },
                {
                  num: "02",
                  badgeBg: "bg-[#BAE6FD]",
                  title: "A target list of companies",
                  desc: "Tailored to your current domain, seniority, and switch goals with active PM openings."
                },
                {
                  num: "03",
                  badgeBg: "bg-[#FED7AA]",
                  title: "2 portfolio projects you can show and talk through",
                  desc: "End-to-end teardowns, PRDs, prototypes, and data analysis deliverables ready for interview rounds."
                },
                {
                  num: "04",
                  badgeBg: "bg-[#A7F3D0]",
                  title: "Feedback from 2 live mock interviews",
                  desc: "1:1 rubric evaluation with actionable notes on product sense, strategy, RCA, and behavioral responses."
                },
                {
                  num: "05",
                  badgeBg: "bg-[#E9D5FF]",
                  title: "With AI PM: the Learn Module",
                  desc: "Recorded lectures, question bank, case and company-wise resources, and daily PM Gym included at no extra cost."
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative bg-slate-50 text-[#141413] rounded-2xl border-2 border-[#141413] p-6 pt-8 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#141413] transition-all flex flex-col justify-between"
                >
                  {/* Floating Circular Badge Overlapping Top-Left */}
                  <div className={`w-10 h-10 rounded-full border-2 border-[#141413] ${item.badgeBg} text-[#141413] flex items-center justify-center font-mono font-black text-xs shadow-[0px_2px_0px_0px_#141413] absolute -top-4 left-6`}>
                    {item.num}
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#141413] tracking-tight mb-2 mt-1 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-[#141413]/80 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Pill */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-2 bg-[#FEF08A] rounded-full border-2 border-[#141413] px-6 py-2.5 shadow-[0px_3px_0px_0px_#141413] font-mono font-black text-xs uppercase text-[#141413] select-none">
                <span>🎓 5 Verifiable Portfolio Assets</span>
                <span className="text-[#188ab2]">· Zero Filler</span>
              </div>
            </div>

          </div>
        </section>

        {/* 9. WHO THIS IS FOR / WHO THIS IS NOT FOR (GitBrush Soft Mint Bento Cards) */}
        <section id="who-it-is-for" className="py-20 bg-slate-50 border-b-2 border-[#141413] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-5xl">
            
            {/* Centered Heading */}
            <div className="text-center mb-14">
              <span className="bg-[#FEF08A] rounded-full border-2 border-[#141413] px-4 py-1 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#141413] rotate-[-1deg] inline-block mb-3 select-none">
                FIT &amp; COMMITMENT
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-[#141413] mb-3 tracking-tight">
                Is PM-X{' '}
                <span className="inline-block bg-[#FEF08A] border-2 border-[#141413] rounded-xl px-3.5 py-0.5 rotate-[1.5deg] shadow-[0px_3px_0px_0px_#141413]">
                  for you?
                </span>
              </h2>
            </div>

            {/* Side-by-Side Comparison Container */}
            <div className="relative max-w-5xl mx-auto text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                
                {/* Left Card: Who this is for (Image 6 GitBrush Soft Mint Bento Card with Floating Stamp) */}
                <div className="relative bg-[#DCFCE7] rounded-3xl border-2 border-[#141413] p-7 sm:p-9 shadow-[0px_6px_0px_0px_#141413] flex flex-col justify-between">
                  {/* Floating Circular Stamp on Top-Right Corner (Image 6 GitBrush) */}
                  <div className="absolute -top-5 -right-3 sm:-right-4 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#F97316] text-white border-2 border-[#141413] shadow-[0px_3px_0px_0px_#141413] flex flex-col items-center justify-center text-center rotate-12 leading-tight p-1 select-none z-10">
                    <span className="text-[9px] font-black uppercase tracking-wider">IDEAL</span>
                    <span className="text-[11px] font-black uppercase">FIT ★</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-[#141413]/15">
                      <h3 className="text-xl sm:text-2xl font-black text-[#141413]">
                        Who this is for
                      </h3>
                      <span className="bg-white text-emerald-950 text-xs font-mono font-black px-3 py-1 rounded-full uppercase tracking-wider border-2 border-[#141413] shadow-[0px_1.5px_0px_0px_#141413]">
                        TARGET
                      </span>
                    </div>

                    <ul className="space-y-4">
                      {[
                        "Working professionals moving into product management",
                        "People with no PM title or PM experience yet",
                        "People ready to do the work, not just watch it"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3.5 text-sm sm:text-base font-bold text-[#141413]">
                          <span className="w-6 h-6 rounded-full bg-[#188ab2] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-[#141413] shadow-[0px_1px_0px_0px_#141413]">
                            ✓
                          </span>
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#141413]/15 text-xs font-bold text-[#188ab2]">
                    Designed specifically for career switchers seeking verifiable product proof.
                  </div>
                </div>

                {/* Right Card: Who this is not for (Soft Rose Bento Card with Floating Stamp) */}
                <div className="relative bg-[#FFF1F2] rounded-3xl border-2 border-[#141413] p-7 sm:p-9 shadow-[0px_6px_0px_0px_#141413] flex flex-col justify-between">
                  {/* Floating Circular Stamp on Top-Right Corner */}
                  <div className="absolute -top-5 -right-3 sm:-right-4 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-rose-500 text-white border-2 border-[#141413] shadow-[0px_3px_0px_0px_#141413] flex flex-col items-center justify-center text-center -rotate-12 leading-tight p-1 select-none z-10">
                    <span className="text-[9px] font-black uppercase tracking-wider">NOT A</span>
                    <span className="text-[11px] font-black uppercase">FIT ✕</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-[#141413]/15">
                      <h3 className="text-xl sm:text-2xl font-black text-[#141413]">
                        Who this is not for
                      </h3>
                      <span className="bg-white text-rose-950 text-xs font-mono font-black px-3 py-1 rounded-full uppercase tracking-wider border-2 border-[#141413] shadow-[0px_1.5px_0px_0px_#141413]">
                        SKIP IF
                      </span>
                    </div>

                    <ul className="space-y-4">
                      {[
                        "Working PMs",
                        "Anyone who only wants job listings",
                        "Anyone expecting a guaranteed job"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3.5 text-sm sm:text-base font-bold text-[#141413]/85">
                          <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-900 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-[#141413]">
                            ✕
                          </span>
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#141413]/15 text-xs font-bold text-[#141413]/70">
                    We focus on rigorous, live execution — not passive shortcut guarantees.
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 10. CURRICULUM: THE 4-PILLAR METHODOLOGY (FROM BROCHURE) */}
        <section id="curriculum" className="py-20 bg-slate-50 border-b-2 border-[#141413] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-5xl">
            
            <div className="text-center mb-16">
              <div className="inline-block mb-3">
                <span className="bg-[#FEF08A] rounded-full border-2 border-[#141413] px-4 py-1 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#141413] rotate-[-1deg] inline-block select-none">
                  THE METHODOLOGY · PROVEN FRAMEWORK
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#141413] mb-3 tracking-tight">
                Four steps.{' '}
                <span className="inline-block bg-[#FEF08A] border-2 border-[#141413] rounded-xl px-3.5 py-0.5 rotate-[-1.5deg] shadow-[0px_3px_0px_0px_#141413]">
                  One finished project.
                </span>
              </h2>
              <p className="text-base font-medium text-[#141413]/80 max-w-2xl mx-auto leading-relaxed">
                A structured, end-to-end curriculum engineered to transform aspiring candidates into credible, interview-ready product managers with proof of execution.
              </p>
            </div>

            {/* 4-Pillar Grid (Brochure Page 3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left items-stretch mb-10">
              
              {/* Step 1: LEARN */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] p-7 shadow-[0px_5px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_#141413] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#e0f2fe] text-[#188ab2] rounded-full border-2 border-[#141413] px-3 py-0.5 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                      WEDNESDAYS
                    </span>
                    <span className="font-mono font-black text-2xl text-[#188ab2]">
                      01
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#141413] mb-2 tracking-tight">
                    Step 1: LEARN
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#141413]/85 mb-4 leading-relaxed">
                    Understand how product teams think. 8 live classes on product thinking, research, strategy, MVPs, AI and tech basics, plus pre-recorded modules.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-[#141413]/80 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-[#188ab2] font-black">•</span>
                      <span>Product thinking mindset &amp; core heuristics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#188ab2] font-black">•</span>
                      <span>Business viability, competitor intelligence &amp; market sizing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#188ab2] font-black">•</span>
                      <span>Tech 101: APIs, system architecture &amp; AI fundamentals (RAG, prompting)</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t-2 border-[#141413]/10 font-bold text-xs text-[#188ab2]">
                  ✦ Outcome: You can talk about product like an insider.
                </div>
              </div>

              {/* Step 2: BUILD */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] p-7 shadow-[0px_5px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_#141413] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#FEF08A] text-amber-950 rounded-full border-2 border-[#141413] px-3 py-0.5 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                      SUNDAYS
                    </span>
                    <span className="font-mono font-black text-2xl text-amber-900">
                      02
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#141413] mb-2 tracking-tight">
                    Step 2: BUILD
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#141413]/85 mb-4 leading-relaxed">
                    Work on one real project, start to finish: teardown, market research, user research, data analysis, PRD and a clickable prototype. A mentor reviews your work.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-[#141413]/80 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-amber-800 font-black">•</span>
                      <span>Product teardowns of real apps &amp; market research deck</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-800 font-black">•</span>
                      <span>User interviews, JTBD friction maps &amp; data analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-800 font-black">•</span>
                      <span>Production PRD document &amp; clickable interactive prototype</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t-2 border-[#141413]/10 font-bold text-xs text-amber-900">
                  ✦ Outcome: A documented project case study.
                </div>
              </div>

              {/* Step 3: PRACTICE */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] p-7 shadow-[0px_5px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_#141413] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#D1FAE5] text-emerald-950 rounded-full border-2 border-[#141413] px-3 py-0.5 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                      SATURDAYS
                    </span>
                    <span className="font-mono font-black text-2xl text-emerald-800">
                      03
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#141413] mb-2 tracking-tight">
                    Step 3: PRACTICE
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#141413]/85 mb-4 leading-relaxed">
                    Mock case interviews, root cause analysis, product design, metrics, estimation, behavioural rounds and stakeholder stories, with question banks to practice on.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-[#141413]/80 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-700 font-black">•</span>
                      <span>Live mock case interviews &amp; clarifying question drills</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-700 font-black">•</span>
                      <span>Root cause analysis (RCA), metrics drops &amp; market sizing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-700 font-black">•</span>
                      <span>GTM strategy, pricing &amp; behavioural storytelling</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t-2 border-[#141413]/10 font-bold text-xs text-emerald-900">
                  ✦ Outcome: You can structure an answer under pressure.
                </div>
              </div>

              {/* Step 4: CAREER */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] p-7 shadow-[0px_5px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_#141413] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#f3e8ff] text-purple-950 rounded-full border-2 border-[#141413] px-3 py-0.5 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                      AFTER THE COURSE
                    </span>
                    <span className="font-mono font-black text-2xl text-purple-900">
                      04
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#141413] mb-2 tracking-tight">
                    Step 4: CAREER
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#141413]/85 mb-4 leading-relaxed">
                    Your resume and LinkedIn are rebuilt around your finished project. You get the StepSmart job board, which collects PM openings from hiring sites, free for 3 months.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-[#141413]/80 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-700 font-black">•</span>
                      <span>Complete PM resume rewrite &amp; LinkedIn profile overhaul</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-700 font-black">•</span>
                      <span>StepSmart job board access for 3 months</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-700 font-black">•</span>
                      <span>Lifetime access to alumni WhatsApp group &amp; referral circles</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t-2 border-[#141413]/10 font-bold text-xs text-purple-900">
                  ✦ Outcome: Proof you can show, and roles to show it for.
                </div>
              </div>

            </div>

            {/* Checkpoints & Routine Box */}
            <div className="bg-white rounded-2xl border-2 border-[#141413] p-6 sm:p-8 shadow-[0px_4px_0px_0px_#141413] mb-8 text-left">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b-2 border-[#141413]/10">
                <div>
                  <span className="font-mono font-black text-xs uppercase text-[#188ab2] block">DELIVERABLES TIMELINE</span>
                  <h4 className="font-black text-base sm:text-lg text-[#141413]">4 Checkpoint Milestones</h4>
                </div>
                <span className="bg-[#FEF08A] rounded-full border border-[#141413] text-[10px] font-mono font-black px-3 py-1 uppercase shadow-[0px_1px_0px_#141413]">
                  All Sessions Recorded &amp; Uploaded Within 4 Hours
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl border-2 border-[#141413] bg-sky-50 shadow-[0px_2px_0px_0px_#141413]">
                  <span className="font-mono font-black text-[10px] text-[#188ab2] block">WEEK 2 · CHECKPOINT 1</span>
                  <div className="font-black text-sm text-[#141413] mt-0.5">Market Research</div>
                  <div className="text-xs text-[#141413]/70 font-medium mt-1">Competitor &amp; TAM analysis deck</div>
                </div>
                <div className="p-3.5 rounded-xl border-2 border-[#141413] bg-amber-50 shadow-[0px_2px_0px_0px_#141413]">
                  <span className="font-mono font-black text-[10px] text-amber-900 block">WEEK 4 · CHECKPOINT 2</span>
                  <div className="font-black text-sm text-[#141413] mt-0.5">Problem Framing</div>
                  <div className="text-xs text-[#141413]/70 font-medium mt-1">Persona &amp; JTBD validation</div>
                </div>
                <div className="p-3.5 rounded-xl border-2 border-[#141413] bg-emerald-50 shadow-[0px_2px_0px_0px_#141413]">
                  <span className="font-mono font-black text-[10px] text-emerald-800 block">WEEK 6 · CHECKPOINT 3</span>
                  <div className="font-black text-sm text-[#141413] mt-0.5">Clickable Prototype</div>
                  <div className="text-xs text-[#141413]/70 font-medium mt-1">Interactive user journey flow</div>
                </div>
                <div className="p-3.5 rounded-xl border-2 border-[#141413] bg-purple-50 shadow-[0px_2px_0px_0px_#141413]">
                  <span className="font-mono font-black text-[10px] text-purple-900 block">WEEK 8 · CHECKPOINT 4</span>
                  <div className="font-black text-sm text-[#141413] mt-0.5">Final Case Study</div>
                  <div className="text-xs text-[#141413]/70 font-medium mt-1">Mentor-reviewed PM portfolio</div>
                </div>
              </div>
            </div>

            {/* Curriculum Brochure Unlock Bar */}
            <div
              onClick={() => {
                setBrochureFormStatus('idle');
                setIsBrochureModalOpen(true);
              }}
              className="bg-white rounded-2xl border-2 border-[#141413] p-4 sm:p-5 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#141413] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group select-none"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#188ab2]/10 border border-[#188ab2] text-[#188ab2] flex items-center justify-center shrink-0 group-hover:bg-[#188ab2] group-hover:text-white transition-colors">
                  <Download className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm sm:text-base font-black text-[#141413] tracking-tight">
                      Want the full 8-week syllabus?
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-[#188ab2] uppercase bg-[#e0f2fe] rounded-full border border-[#188ab2]/30 px-2 py-0.5">
                      BROCHURE PDF
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#141413]/70 truncate mt-0.5">
                    Data analysis, PRD, prototype, APIs, system design, and AI mock rubrics.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center self-start sm:self-auto">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#188ab2] group-hover:bg-[#0f6f8f] text-white text-xs font-black uppercase rounded-full border-2 border-[#141413] shadow-[0px_3px_0px_0px_#141413] group-hover:shadow-[0px_4px_0px_0px_#141413] transition-all pointer-events-none"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Get Full Brochure ➜</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* 11. MEET YOUR INSTRUCTORS (Mentors) */}
        <section id="mentors" className="py-20 bg-white border-b-2 border-[#141413] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-5xl">
            
            <div className="text-center mb-16">
              <span className="bg-[#FEF08A] rounded-full border-2 border-[#141413] px-4 py-1 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#141413] rotate-[-1deg] inline-block mb-3 select-none">
                FACULTY
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-[#141413] mb-3 tracking-tight">
                Meet your{' '}
                <span className="inline-block bg-[#FEF08A] border-2 border-[#141413] rounded-xl px-3.5 py-0.5 rotate-[-1deg] shadow-[0px_3px_0px_0px_#141413]">
                  instructors
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              
              {/* Sanket */}
              <div className="bg-white rounded-3xl border-2 border-[#141413] p-8 shadow-[0px_5px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_#141413] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full border-2 border-[#141413] overflow-hidden bg-[#188ab2] shadow-[0px_3px_0px_0px_#141413] shrink-0">
                      <img src="/mentor-sanket.webp" alt="Sanket" className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#141413]">Sanket</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono font-black text-[#188ab2] text-xs uppercase tracking-wider">
                          SENIOR PM - MASTERCARD
                        </span>
                        <a
                          href="https://www.linkedin.com/in/sanketkumar-katore/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-80 inline-flex items-center"
                          aria-label="Sanket LinkedIn Profile"
                        >
                          <svg className="w-3.5 h-3.5 fill-[#0077B5] shrink-0" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  <p className="font-medium text-sm text-[#141413]/85 leading-relaxed">
                    Expert in behavioral interviews and product sense frameworks, with deep specialization in scaling fintech products for the global market.
                  </p>
                </div>
              </div>

              {/* Ankit */}
              <div className="bg-white rounded-3xl border-2 border-[#141413] p-8 shadow-[0px_5px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_#141413] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full border-2 border-[#141413] overflow-hidden bg-[#188ab2] shadow-[0px_3px_0px_0px_#141413] shrink-0">
                      <img src="/mentor-ankit.webp" alt="Ankit" className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#141413]">Ankit</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono font-black text-[#188ab2] text-xs uppercase tracking-wider">
                          PRODUCT MANAGER 2 - MICROSOFT
                        </span>
                        <a
                          href="https://www.linkedin.com/in/ankit-surkar/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-80 inline-flex items-center"
                          aria-label="Ankit LinkedIn Profile"
                        >
                          <svg className="w-3.5 h-3.5 fill-[#0077B5] shrink-0" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  <p className="font-medium text-sm text-[#141413]/85 leading-relaxed">
                    Leads enterprise-grade AI product development at Microsoft. Expert at turning ambiguity into clarity for complex product strategy, with a focus on scaling AI-native products from 0 to 1.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 12. CHOOSE YOUR PLAN (PRICING) */}
        <section id="pricing" className="py-20 bg-slate-50 border-b-2 border-[#141413] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            
            <div className="inline-block mb-3">
              <span className="bg-[#FEF08A] rounded-full border-2 border-[#141413] px-4 py-1 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#141413] rotate-[-1deg] inline-block select-none">
                TRANSPARENT PRICING · PM-X ACCELERATOR
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-[#141413] mb-3 tracking-tight">
              Choose your{' '}
              <span className="inline-block bg-[#FEF08A] border-2 border-[#141413] rounded-xl px-3.5 py-0.5 rotate-[1.5deg] shadow-[0px_3px_0px_0px_#141413]">
                plan
              </span>
            </h2>
            
            <p className="text-sm sm:text-base font-bold text-[#141413]/80 max-w-xl mx-auto mb-12">
              Module ₹7,000 each · AI PM ₹30,000 · Starts 1st Dec 2026
            </p>

            {/* Two Side-by-Side Pricing Cards: Single Module vs AI PM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left items-stretch mb-10">
              
              {/* Single Module Card */}
              <div className="bg-white rounded-3xl border-2 border-[#141413] p-7 sm:p-9 shadow-[0px_6px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_9px_0px_0px_#141413] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-white text-[#141413] rounded-full border-2 border-[#141413] px-3.5 py-1 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                      One module
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                      FLEXIBLE ENTRY
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-[#141413] mb-2 tracking-tight">
                    Single module
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-mono font-black text-4xl text-[#141413]">
                      ₹7,000
                    </span>
                  </div>

                  <div className="border-t-2 border-[#141413]/15 pt-5 mb-6">
                    <ul className="space-y-3 text-xs sm:text-sm font-bold text-[#141413]">
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#188ab2] font-black mt-0.5">•</span>
                        <span>Pick one: Profile Enhancer, AI Builder or Interview Practice</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#188ab2] font-black mt-0.5">•</span>
                        <span>Live in a group of 10–20</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#188ab2] font-black mt-0.5">•</span>
                        <span>Mentor support on WhatsApp</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#188ab2] font-black mt-0.5">•</span>
                        <span>Add the other modules later at ₹7,000</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-[#141413]/15">
                  <button
                    onClick={() => scrollToSection('modular')}
                    className="w-full py-4 bg-white hover:bg-slate-50 text-[#141413] rounded-full border-2 border-[#141413] font-black text-sm uppercase shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#141413] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-center block"
                  >
                    Reserve a module ➜
                  </button>
                  <p className="text-[11px] font-bold text-[#141413]/70 text-center mt-2.5">
                    Buying one module? You join the same live group for that module and can add the others later at 7k.
                  </p>
                </div>
              </div>

              {/* AI PM Card (Featured - In place of bundle) */}
              <div className="bg-[#FFFDF5] rounded-3xl border-2 sm:border-[2.5px] border-[#141413] p-7 sm:p-9 shadow-[0px_8px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_11px_0px_0px_#141413] transition-all relative">
                
                {/* Popular Badge Top Right */}
                <div className="absolute -top-3.5 right-6 bg-[#FEF08A] rounded-full border-2 border-[#141413] px-3.5 py-0.5 font-mono font-black text-[11px] uppercase shadow-[0px_2px_0px_0px_#141413] rotate-[1.5deg]">
                  BEST VALUE · COMPLETE SWITCH
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#188ab2] text-white rounded-full border-2 border-[#141413] px-3.5 py-1 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                      Learn Module Included
                    </span>
                    <span className="text-xs font-mono font-black text-emerald-700 uppercase">
                      ALL MODULES INCLUDED
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-[#141413] mb-2 tracking-tight">
                    AI PM
                  </h3>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono font-black text-4xl text-[#188ab2]">
                      ₹30,000
                    </span>
                    <span className="font-mono font-bold text-slate-500 text-sm">
                      (All-Inclusive)
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#141413]/85 mb-4 leading-snug">
                    Comprehensive full-stack accelerator including AI Builder, Profile Enhancer, Interview Practice, and dedicated AI PM curriculum.
                  </p>

                  <div className="border-t-2 border-[#141413]/15 pt-5 mb-6">
                    <ul className="space-y-3 text-xs sm:text-sm font-bold text-[#141413]">
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-600 font-black mt-0.5">✓</span>
                        <span>All live modules included: Profile Enhancer, AI Builder, Interview Practice</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-600 font-black mt-0.5">✓</span>
                        <span>AI PM Mastery: AI 101, RAG, Prompting, Fine-Tuning, AI-Assisted PRD &amp; Prototypes</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-600 font-black mt-0.5">✓</span>
                        <span>Learn Module free: recorded lectures, question bank, case and company-wise resources, PM Gym</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-600 font-black mt-0.5">✓</span>
                        <span>2 live mock interviews with 1:1 feedback</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-600 font-black mt-0.5">✓</span>
                        <span>Mentor support on WhatsApp &amp; lifetime alumni network access</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-600 font-black mt-0.5">✓</span>
                        <span>StepSmart PM Job Board access for 3 months</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-[#141413]/15">
                  <button
                    onClick={handleMainEnroll}
                    className="w-full py-4 bg-[#188ab2] hover:bg-[#0f6f8f] text-white rounded-full border-2 border-[#141413] font-black text-sm uppercase shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#141413] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-center block"
                  >
                    Reserve AI PM for ₹30,000 ➜
                  </button>
                  <p className="text-[11px] font-bold text-[#188ab2] text-center mt-2.5">
                    Includes all live cohorts + AI PM specialization + permanent resource library + 2 1:1 mocks
                  </p>
                </div>
              </div>

            </div>

            {/* Under both cards */}
            <div className="bg-white rounded-2xl border-2 border-[#141413] p-6 sm:p-8 shadow-[0px_4px_0px_0px_#141413] text-left max-w-5xl mx-auto mb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#141413]/15">
                
                {/* Payment */}
                <div className="pt-4 md:pt-0 md:px-4 first:pt-0 first:pl-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">💳</span>
                    <h4 className="font-mono font-black text-xs uppercase tracking-wider text-[#141413]">
                      Payment
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#141413]/85 leading-relaxed">
                    UPI only
                  </p>
                </div>

                {/* Refund */}
                <div className="pt-4 md:pt-0 md:px-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">🛡️</span>
                    <h4 className="font-mono font-black text-xs uppercase tracking-wider text-[#141413]">
                      Refund
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#141413]/85 leading-relaxed">
                    If you leave after the first week, receive a complete full refund — no friction, no hassle.
                  </p>
                </div>

                {/* No promises */}
                <div className="pt-4 md:pt-0 md:px-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">🤝</span>
                    <h4 className="font-mono font-black text-xs uppercase tracking-wider text-[#141413]">
                      No promises
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#141413]/85 leading-relaxed">
                    We don’t guarantee a job. We give you the resume, projects and practice that prepare you for interviews.
                  </p>
                </div>

              </div>
            </div>

            {/* 13. ONLY NEED ONE PIECE? (Modular Unbundling Section) */}
            <div id="modular" className="mt-16 pt-12 border-t-2 border-dashed border-[#141413]/30 scroll-mt-20">
              
              {/* Header Pill */}
              <div className="inline-block mb-4">
                <span className="bg-white rounded-full border-2 border-[#141413] px-4 py-1.5 font-mono font-black text-xs uppercase tracking-wider shadow-[0px_2px_0px_0px_#141413] inline-block select-none">
                  {isEarlyBird ? 'MODULAR UNBUNDLING · DIWALI OFFER' : 'MODULAR ENROLLMENT · PM-X ACCELERATOR'}
                </span>
              </div>

              {/* Title with Signature Yellow Highlighter Box */}
              <h3 className="text-3xl sm:text-5xl font-black text-[#141413] tracking-tight mb-3">
                Only need{' '}
                <span className="inline-block bg-[#FEF08A] rounded-xl border-2 border-[#141413] px-3.5 py-0.5 rotate-[1.5deg] shadow-[0px_3px_0px_0px_#141413] select-none">
                  one piece?
                </span>
              </h3>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm font-semibold text-[#141413]/80 max-w-xl mx-auto mb-10 leading-relaxed">
                {isEarlyBird
                  ? 'Diwali Offer: ₹5,000 each (regular ₹7,000). Groups of 8–10. PM Gym and class recordings included, no certificate.'
                  : 'Module ₹7,000 each. Groups of 8–10. PM Gym and class recordings included, no certificate.'}
              </p>

              {/* Three Modular Options Side-by-Side */}
              <div className="grid md:grid-cols-3 gap-6 text-left">
                {/* Module 1: AI Builder Card */}
                <div
                  onClick={() => setSelectedMod1(!selectedMod1)}
                  className={`bg-white rounded-2xl border-2 border-[#141413] p-6 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_7px_0px_0px_#141413] transition-all cursor-pointer flex flex-col justify-between select-none ${
                    selectedMod1 ? 'ring-2 ring-[#188ab2] bg-sky-50/50' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-black tracking-tight text-[#141413]">
                        MOD 1: AI BUILDER
                      </h4>
                      <div className={`w-6 h-6 rounded-md border-2 border-[#141413] flex items-center justify-center font-black transition-colors ${
                        selectedMod1 ? 'bg-[#188ab2] text-white' : 'bg-white'
                      }`}>
                        {selectedMod1 ? '✓' : ''}
                      </div>
                    </div>

                    <div className="font-mono font-black text-2xl text-[#188ab2] mb-2">
                      ₹7,000
                    </div>

                    <p className="text-xs font-medium text-[#141413]/80 leading-relaxed">
                      5 live sessions. PRDs, teardowns, user research, data project, prototype, and modern AI workflows. Leave with 2 portfolio projects.
                    </p>
                  </div>
                </div>

                {/* Module 2: Profile Enhancer Card */}
                <div
                  onClick={() => setSelectedMod2(!selectedMod2)}
                  className={`bg-white rounded-2xl border-2 border-[#141413] p-6 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_7px_0px_0px_#141413] transition-all cursor-pointer flex flex-col justify-between select-none ${
                    selectedMod2 ? 'ring-2 ring-[#188ab2] bg-sky-50/50' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-black tracking-tight text-[#141413]">
                        MOD 2: PROFILE
                      </h4>
                      <div className={`w-6 h-6 rounded-md border-2 border-[#141413] flex items-center justify-center font-black transition-colors ${
                        selectedMod2 ? 'bg-[#188ab2] text-white' : 'bg-white'
                      }`}>
                        {selectedMod2 ? '✓' : ''}
                      </div>
                    </div>

                    <div className="font-mono font-black text-2xl text-[#188ab2] mb-2">
                      {isEarlyBird ? '₹5,000' : '₹7,000'}
                    </div>

                    <p className="text-xs font-medium text-[#141413]/80 leading-relaxed">
                      5 live sessions. Map work to PM skills, resume rewrite, LinkedIn overhaul, story, and daily StepSmart job board access.
                    </p>
                  </div>
                </div>

                {/* Module 3: Interview Practice Card */}
                <div
                  onClick={() => setSelectedMod3(!selectedMod3)}
                  className={`bg-white rounded-2xl border-2 border-[#141413] p-6 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_7px_0px_0px_#141413] transition-all cursor-pointer flex flex-col justify-between select-none ${
                    selectedMod3 ? 'ring-2 ring-[#188ab2] bg-sky-50/50' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-black tracking-tight text-[#141413]">
                        MOD 3: PRACTICE
                      </h4>
                      <div className={`w-6 h-6 rounded-md border-2 border-[#141413] flex items-center justify-center font-black transition-colors ${
                        selectedMod3 ? 'bg-[#188ab2] text-white' : 'bg-white'
                      }`}>
                        {selectedMod3 ? '✓' : ''}
                      </div>
                    </div>

                    <div className="font-mono font-black text-2xl text-[#188ab2] mb-2">
                      {isEarlyBird ? '₹5,000' : '₹7,000'}
                    </div>

                    <p className="text-xs font-medium text-[#141413]/80 leading-relaxed">
                      8 live sessions + 2 live mock interviews with 1:1 feedback. Analytics, product sense, strategy, behavioral rounds, RCA.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1:1 Mentoring Add-on Full-Width Row */}
              <div
                onClick={() => setSelected1to1(!selected1to1)}
                className={`mt-6 bg-white rounded-2xl border-2 border-[#141413] p-4 sm:p-5 shadow-[0px_4px_0px_0px_#141413] flex items-center gap-3 sm:gap-4 cursor-pointer text-left hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#141413] transition-all select-none ${
                  selected1to1 ? 'ring-2 ring-[#188ab2] bg-sky-50/40' : ''
                }`}
              >
                <div className={`w-6 h-6 rounded-md border-2 border-[#141413] flex items-center justify-center font-black shrink-0 transition-colors ${
                  selected1to1 ? 'bg-[#188ab2] text-white' : 'bg-white'
                }`}>
                  {selected1to1 ? '✓' : ''}
                </div>
                <div className="flex-1 text-xs sm:text-sm font-bold text-[#141413]">
                  Add 1:1 mentoring: 5 dedicated private sessions for ₹5,000. Limited seats, with any option.
                </div>
              </div>

              {/* Dynamic Modular CTA Button */}
              <div className="mt-8">
                {modularTotal > 0 ? (
                  <button
                    onClick={handleModularEnroll}
                    className="w-full sm:w-auto px-10 py-4.5 rounded-full font-black uppercase text-xs sm:text-sm border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#141413] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    Enroll in {modularLabel} for ₹{modularTotal.toLocaleString('en-IN')} ➜
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full sm:w-auto px-10 py-4.5 rounded-full font-black uppercase text-xs sm:text-sm border-2 border-[#141413]/30 bg-[#F1F3F5] text-[#141413]/40 shadow-[0px_4px_0px_0px_#141413]/20 cursor-not-allowed select-none"
                  >
                    SELECT BUILD OR PRACTICE ABOVE TO CONTINUE
                  </button>
                )}
              </div>

              {/* Navigation Back Link */}
              <div className="mt-6">
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-xs sm:text-sm font-bold text-[#141413] underline hover:text-[#188ab2] cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Looking for the full AI PM cohort instead? Jump to full cohort details &amp; pricing ↑</span>
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 14. HOW TO JOIN */}
        <section className="py-20 bg-white border-b-2 border-[#141413]">
          <div className="container mx-auto px-6 max-w-7xl">
            
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-[#141413] mb-4 tracking-tight">
                How to{' '}
                <span className="inline-block bg-[#FEF08A] rounded-xl border-2 border-[#141413] px-4 py-0.5 rotate-[1.5deg] shadow-[0px_3px_0px_0px_#141413] select-none">
                  join?
                </span>
              </h2>
              <p className="text-base sm:text-lg font-medium text-[#141413]/80 mt-4">
                No automated gateways, no automated rejections. We screen for alignment at every step.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-8 items-stretch text-left mt-8">
              {[
                {
                  num: "01",
                  title: "Apply Online",
                  desc: "Choose a cohort track and complete your application form.",
                  shadow: "shadow-[0px_4px_0px_0px_#141413]",
                  tilt: "rotate-[-1deg]"
                },
                {
                  num: "02",
                  title: "Message Us on WhatsApp",
                  desc: "Drop us a message with your background and goals.",
                  shadow: "shadow-[0px_4px_0px_0px_#141413]",
                  tilt: "rotate-[2deg]",
                  action: (
                    <div className="mt-4">
                      <a
                        href="https://wa.me/message/GH5C7YLAYIEHN1"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block bg-[#188ab2] text-white rounded-full border-2 border-[#141413] px-4 py-1.5 font-mono font-black text-[10px] uppercase shadow-[0px_2px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_3px_0px_0px_#141413] transition-all cursor-pointer select-none"
                      >
                        CHAT WITH US →
                      </a>
                      <div className="mt-3 inline-block bg-[#FEF08A] text-[#141413] rounded-full border border-[#141413] px-2.5 py-0.5 font-mono font-bold text-[8px] uppercase rotate-[-2deg] shadow-[0px_1px_0px_0px_#141413]">
                        REPLIES WITHIN A FEW HOURS / NO COMMITMENT
                      </div>
                    </div>
                  )
                },
                {
                  num: "03",
                  title: "Get Decision",
                  desc: "We confirm fit over WhatsApp and follow up with your application status and next steps.",
                  shadow: "shadow-[0px_4px_0px_0px_#141413]",
                  tilt: "rotate-[-1.5deg]"
                },
                {
                  num: "04",
                  title: "Batch Starts",
                  desc: "Secure your slot. Onboarding details are shared over WhatsApp before the cohort begins.",
                  shadow: "shadow-[0px_4px_0px_0px_#141413]",
                  tilt: "rotate-[1deg]"
                },
                {
                  num: "05",
                  title: "Lifetime Access",
                  desc: "Join our active alumni network",
                  shadow: "shadow-[0px_4px_0px_0px_#141413]",
                  tilt: "rotate-[-2deg]"
                }
              ].map((step, i) => (
                <div 
                  key={i} 
                  className={`bg-white rounded-2xl border-2 border-[#141413] p-6 pt-10 ${step.shadow} flex flex-col justify-between h-full relative hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#141413] transition-all select-none`}
                >
                  {/* Number Badge */}
                  <div className={`absolute -top-3.5 -left-3.5 bg-[#188ab2] text-white rounded-xl border-2 border-[#141413] w-9 h-9 flex items-center justify-center font-mono font-black text-xs shadow-[0px_2px_0px_0px_#141413] ${step.tilt}`}>
                    {step.num}
                  </div>
                  
                  <div>
                    <h3 className="font-black text-lg text-[#141413] mb-2">{step.title}</h3>
                    <p className="text-xs text-[#141413]/80 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                  
                  {step.action && step.action}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 16. FINAL CONVERSION CARD */}
        <section id="final-cta" className="py-20 bg-white border-b-2 border-[#141413] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            
            <div className="bg-[#FEF08A] rounded-3xl border-2 border-[#141413] p-10 sm:p-14 shadow-[0px_8px_0px_0px_#141413] text-center">
              <h2 className="text-3xl md:text-5xl font-black text-[#141413] mb-3 leading-tight tracking-tight">
                Switching into PM without a PM title?{' '}
                <span className="underline decoration-[#188ab2] decoration-[4px]">Build the proof with us.</span>
              </h2>
              <p className="text-sm sm:text-base font-black text-[#141413] mb-8 font-mono">
                Module ₹7,000 each · AI PM ₹30,000 · Starts 1st Dec
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <button
                  onClick={handleMainEnroll}
                  className="w-full sm:w-auto px-10 py-5 font-black text-base sm:text-lg uppercase rounded-full border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#141413] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Reserve AI PM for ₹30,000 ➜
                </button>
                <a
                  href="https://wa.me/message/GH5C7YLAYIEHN1"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-8 py-5 font-black text-base sm:text-lg uppercase rounded-full border-2 border-[#141413] bg-white hover:bg-slate-50 text-[#141413] shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#141413] active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>Talk to us on WhatsApp</span>
                </a>
              </div>

              {/* Line under the buttons */}
              <p className="text-xs sm:text-sm font-extrabold text-[#141413]/85 mt-6 max-w-xl mx-auto">
                Modules from ₹7,000 · AI PM ₹30,000 including all other modules · No job guarantee, just the work that gets you ready.
              </p>

              <div className="mt-8 pt-6 border-t-2 border-[#141413]/20">
                <button
                  onClick={() => {
                    setBrochureFormStatus('idle');
                    setIsBrochureModalOpen(true);
                  }}
                  className="font-black text-sm text-[#141413] underline hover:text-[#188ab2] transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download the detailed curriculum brochure (PDF)</span>
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* 18. FOOTER */}
      <footer className="bg-white py-12 text-center text-xs font-bold text-[#141413]/80 border-t-2 border-[#141413]/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-center gap-6 mb-4 text-xs font-extrabold text-[#141413] flex-wrap">
            <Link to="/resources" className="hover:text-[#188ab2] transition-colors">Resources</Link>
            <Link to="/spinner" className="hover:text-[#6B21A8] transition-colors">Which PM Are You?</Link>
            <Link to="/blog" className="hover:text-[#188ab2] transition-colors">PM Blog</Link>
            <a href="/learn" className="hover:text-[#188ab2] transition-colors">Student Login</a>
          </div>
          <div className="mb-2">
            <span className="font-black text-[#141413] text-sm">StepSmart Fellowship</span> · admin@stepsmart.net · stepsmart.net
          </div>
          <div>No placement guarantee. Structured preparation &amp; verifiable proof of work.</div>
        </div>
      </footer>

      {/* 19. POP-UP BROCHURE MODAL */}
      {isBrochureModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border-2 border-[#141413] p-6 sm:p-8 shadow-[0px_8px_0px_0px_#141413] relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsBrochureModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full border-2 border-[#141413] bg-white hover:bg-[#FEF08A] flex items-center justify-center font-black text-base shadow-[0px_2px_0px_0px_#141413] cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            {brochureFormStatus === 'success' ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-[#C6F6D5] border-2 border-[#141413] flex items-center justify-center mx-auto mb-5 shadow-[0px_3px_0px_0px_#141413]">
                  <Check className="w-9 h-9 text-green-800 stroke-[3]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#141413] mb-2 tracking-tight">
                  Brochure on its way!
                </h3>
                <p className="text-sm font-medium text-[#141413]/85 mb-6">
                  Your PM-X Accelerator Brochure download has started automatically.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => startBrochureDownload(false)}
                    className="w-full py-3.5 rounded-full border-2 border-[#141413] bg-[#FEF08A] font-black text-sm uppercase shadow-[0px_3px_0px_0px_#141413] hover:bg-[#ffe566] transition-colors cursor-pointer"
                  >
                    Click here if download didn't start ➜
                  </button>
                  <button
                    onClick={() => setIsBrochureModalOpen(false)}
                    className="w-full py-2.5 rounded-full border-2 border-[#141413] bg-white font-black text-xs uppercase shadow-[0px_2px_0px_0px_#141413] hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 text-left">
                  <span className="bg-[#FEF08A] rounded-full border-2 border-[#141413] px-3.5 py-1 text-xs font-mono font-black uppercase shadow-[0px_2px_0px_0px_#141413] rotate-[-1deg] inline-block mb-3">
                    ★ OFFICIAL SYLLABUS
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#141413] mb-2 leading-tight tracking-tight">
                    Download Full 8-Week Brochure
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#141413]/80 leading-relaxed">
                    Get instant access to the complete week-by-week timetable, real project deliverables, live class schedule, and mentor review rubric.
                  </p>
                </div>

                <form onSubmit={handleBrochureSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-mono font-black text-[#141413] uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={brochureFormData.name}
                      onChange={(e) => setBrochureFormData({ ...brochureFormData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-3 rounded-xl border-2 border-[#141413] font-medium text-sm bg-white shadow-[0px_2px_0px_0px_#141413] focus:outline-none focus:bg-amber-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-black text-[#141413] uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={brochureFormData.email}
                      onChange={(e) => setBrochureFormData({ ...brochureFormData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full p-3 rounded-xl border-2 border-[#141413] font-medium text-sm bg-white shadow-[0px_2px_0px_0px_#141413] focus:outline-none focus:bg-amber-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-black text-[#141413] uppercase mb-1">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={brochureFormData.phone}
                      onChange={(e) => setBrochureFormData({ ...brochureFormData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full p-3 rounded-xl border-2 border-[#141413] font-medium text-sm bg-white shadow-[0px_2px_0px_0px_#141413] focus:outline-none focus:bg-amber-50/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={brochureFormStatus === 'loading'}
                    className="w-full py-4 rounded-full border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white font-black text-sm uppercase shadow-[0px_3px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_5px_0px_0px_#141413] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>{brochureFormStatus === 'loading' ? 'Preparing Download...' : 'Download Curriculum PDF ➜'}</span>
                  </button>

                  <p className="text-[11px] font-medium text-[#141413]/70 text-center mt-2">
                    Instant PDF download · No spam guaranteed
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default AppExecutive;
