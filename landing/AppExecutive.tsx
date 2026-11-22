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

  // Interactive modular checkboxes: Interview Module (8 wks), Profile Enhancer (4 wks) + 1:1 mentoring
  const [selectedInterview, setSelectedInterview] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(false);
  const [selected1to1, setSelected1to1] = useState(false);

  // Countdown / Offer state
  const [countdownTimer, setCountdownTimer] = useState('04d 12h 30m 00s');
  const [isEarlyBird, setIsEarlyBird] = useState(false);

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
      cohortTrack: 'The AI PM Cohort (Brochure Download)'
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
            cohortTrack: 'The AI PM Cohort (Brochure Download)',
            masterclassId: 'pm-x-ai-pm-brochure',
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

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Modular selection calculation (₹7,000 per standalone module)
  const modularItemCount = (selectedInterview ? 1 : 0) + (selectedProfile ? 1 : 0);
  const modularTotal = (modularItemCount * 7000) + (selected1to1 ? 5000 : 0);
  const modularLabel = [
    selectedInterview ? 'Interview Module (₹7,000)' : '',
    selectedProfile ? 'Profile Enhancer (₹7,000)' : '',
    selected1to1 ? '1:1 Mentoring (₹5,000)' : ''
  ].filter(Boolean).join(' + ');

  const handleModularEnroll = () => {
    const intent = `Hi, I want to enroll for modular PM-X: ${modularLabel} (₹${modularTotal.toLocaleString('en-IN')})`;
    window.open(`https://wa.me/message/GH5C7YLAYIEHN1?text=${encodeURIComponent(intent)}`, '_blank', 'noopener,noreferrer');
  };

  const handleMainEnroll = () => {
    const intent = `Hi, I want to apply for The AI PM Cohort (₹30,000 for 12 weeks including Interview & Profile modules with Learn Module Free)`;
    window.open(`https://wa.me/message/GH5C7YLAYIEHN1?text=${encodeURIComponent(intent)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#141413] font-sans selection:bg-[#FFF3A7] selection:text-[#141413] font-medium">
      
      {/* 1. TOP ANNOUNCEMENT TICKER (Soft Neo-Brutalist Banner) */}
      <aside aria-label="Announcement Banner" className="sticky top-0 z-50 w-full bg-[#FEF08A] border-b-2 border-[#141413] text-xs py-2 px-4 font-black">
        <div className="container mx-auto max-w-7xl flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#188ab2] text-white rounded-full border-2 border-[#141413] px-2.5 py-0.5 text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_#141413] inline-flex items-center gap-1.5 font-black shrink-0">
              THE AI PM COHORT
            </span>
            <span className="text-[#141413] font-black text-xs sm:text-sm">
              Modules ₹7,000 each · The AI PM Cohort ₹30,000 · Starts 1st Dec · Capped at 15 Seats
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
                ★ THE AI PM COHORT · 12 WEEKS · ONE REAL AI PRODUCT · STARTS 1ST DEC · CAPPED AT 15 SEATS
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
                    CAPPED AT 15 SEATS · 12 WEEKS
                  </span>
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-[#141413]/85 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              You are an experienced professional who works around AI and wants to build with it. Your mandate for 12 weeks: <strong className="font-black text-[#141413]">pick one real problem from your own work</strong> and <strong className="font-black text-[#141413]">ship an AI product that solves it</strong>.
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
                <span>Download Brochure (PDF)</span>
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
                <span>Cohort Starts 1st Dec · Strictly capped at 15 seats · Joining by conversation</span>
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
                <span className="text-[#141413] opacity-75 block text-[10px] font-black">DURATION</span>
                <span className="text-[#141413] font-black">12 WEEKS LIVE</span>
              </div>
              <div>
                <span className="text-[#141413] opacity-75 block text-[10px] font-black">BATCH SIZE</span>
                <span className="text-[#188ab2] font-black">CAPPED AT 15 SEATS</span>
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
                Three modules, built around{' '}
                <span className="inline-block bg-[#FEF08A] border-2 border-[#141413] rounded-xl px-3.5 py-0.5 rotate-[1.5deg] shadow-[0px_3px_0px_0px_#141413] select-none">
                  what recruiters look for
                </span>
              </h2>
              <p className="text-base sm:text-lg font-bold text-[#141413]/85 max-w-2xl mx-auto leading-relaxed">
                The flagship AI PM Cohort includes all modules. Or enroll standalone in Interview Module (first 8 weeks) or Profile Enhancer (last 4 weeks).
              </p>
            </div>

            {/* The Modules Layout: Top Card = AI PM Flagship; Bottom Row = Interview Module + Profile Enhancer Side-by-Side */}
            <div className="max-w-5xl mx-auto mb-12 flex flex-col gap-6">
              
              {/* 1. TOP HERO CARD: THE AI PM MODULE (Flagship · 12 Weeks · ₹30,000) */}
              <div className="bg-[#FFFDF5] rounded-3xl border-2 sm:border-[2.5px] border-[#141413] shadow-[0px_6px_0px_0px_#141413] p-6 sm:p-8 hover:-translate-y-0.5 hover:shadow-[0px_9px_0px_0px_#141413] transition-all relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-[#188ab2] text-white rounded-full border-2 border-[#141413] px-3.5 py-1 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                      FLAGSHIP MODULE · 12 WEEKS LIVE
                    </span>
                    <span className="bg-[#FEF08A] text-[#141413] rounded-full border-2 border-[#141413] px-3 py-1 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                      STARTS 1ST DEC
                    </span>
                    <span className="bg-[#A7F3D0] text-emerald-950 rounded-full border-2 border-[#141413] px-3 py-1 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                      CAPPED AT 15 SEATS
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono font-black text-3xl sm:text-4xl text-[#188ab2]">
                      ₹30,000
                    </span>
                    <span className="font-mono font-bold text-xs text-[#141413]/70 uppercase">
                      (ALL MODULES INCLUDED)
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-black text-2xl sm:text-3xl text-[#141413] tracking-tight mb-2">
                    The AI PM Cohort
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-[#188ab2]">
                    12 weeks. One real AI product. Built from your own domain. Capped at 15 seats · Joining by conversation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-[#141413]/15 mb-6">
                  <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-[#141413]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">✦</span>
                      <span><strong>One real AI product</strong> built from a real problem in your own work domain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">✦</span>
                      <span><strong>AI PRD and 20-case test set</strong> demonstrating how you think, not just what you built</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">✦</span>
                      <span><strong>Portfolio case study &amp; LinkedIn story</strong> ready to present in interviews</span>
                    </li>
                  </ul>
                  <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-[#141413]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">✦</span>
                      <span><strong>Explain AI behavior</strong> with clarity to engineers, leadership &amp; interviewers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#188ab2] font-black mt-0.5">✦</span>
                      <span><strong>Full mock interview loop</strong> run directly on your own AI product (3 1:1 checkpoints: Weeks 4, 8, 12)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-black mt-0.5">✦</span>
                      <span><strong>All modules included:</strong> Interview Module (8 Wks) + Profile Enhancer (4 Wks) + Learn Library</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-[#141413] bg-[#FEF08A] p-4 flex flex-wrap items-center justify-between gap-3 shadow-[0px_2px_0px_0px_#141413]">
                  <div className="text-xs font-black text-[#141413]">
                    YOU LEAVE WITH: A working AI product + AI PRD + 20-case test set + 3 1:1 Checkpoints + All modules included.
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                    <button
                      onClick={() => scrollToSection('pricing')}
                      className="px-5 py-2 rounded-full bg-[#188ab2] text-white border-2 border-[#141413] text-xs font-black uppercase font-mono shadow-[0px_3px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_5px_0px_0px_#141413] transition-all cursor-pointer shrink-0"
                    >
                      Apply for AI PM (₹30,000) ➜
                    </button>
                    <button
                      onClick={() => {
                        setBrochureFormStatus('idle');
                        setIsBrochureModalOpen(true);
                      }}
                      className="px-5 py-2 rounded-full bg-white hover:bg-slate-50 text-[#141413] border-2 border-[#141413] text-xs font-black uppercase font-mono shadow-[0px_3px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_5px_0px_0px_#141413] transition-all cursor-pointer shrink-0 inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Brochure (PDF)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. SIDE BY SIDE ROW BELOW AI PM: INTERVIEW MODULE & PROFILE ENHANCER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Module 2: Interview Module (First 8 Weeks · ₹7,000) */}
                <div className="bg-white rounded-3xl border-2 border-[#141413] shadow-[0px_5px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_#141413] transition-all overflow-hidden p-6 sm:p-7">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-[#D1FAE5] text-emerald-950 rounded-full border-2 border-[#141413] px-3 py-0.5 text-[11px] font-mono font-black uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                        FIRST 8 WEEKS (W1–W8)
                      </span>
                      <span className="font-mono font-black text-2xl text-[#141413]">
                        ₹7,000
                      </span>
                    </div>

                    <h3 className="font-mono font-black text-2xl text-[#141413] tracking-tight mb-1">
                      Interview Module
                    </h3>
                    <p className="text-xs font-bold text-[#188ab2] mb-4">
                      Practise out loud and get feedback under real interview pressure.
                    </p>

                    <div className="pt-3 border-t-2 border-[#141413]/10 mb-4">
                      <div className="font-mono font-black text-[11px] uppercase text-[#141413] mb-2">
                        WHAT THIS MODULE DELIVERS:
                      </div>
                      <ul className="space-y-2 font-bold text-xs sm:text-sm text-[#141413]">
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span><strong>8 live Saturday sessions:</strong> Out-loud practice with immediate mentor critique</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span><strong>Product sense &amp; design:</strong> Clarifying questions, user journeys, trade-offs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span><strong>Root cause analysis (RCA):</strong> Metric drops diagnosis and debugging frameworks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span><strong>Analytics &amp; estimation:</strong> Guesstimates, funnels, and retention modeling</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span><strong>Behavioral storytelling:</strong> Leadership, conflict, and decision frameworks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-700 font-black mt-0.5">✦</span>
                          <span><strong>2 live 1:1 mock interviews</strong> with written scorecard &amp; rubrics</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-[#141413]/10 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono font-bold text-[#141413]/70">
                      Included in AI PM Cohort, or standalone at ₹7,000
                    </span>
                    <button
                      onClick={() => {
                        setSelectedInterview(true);
                        scrollToSection('modular');
                      }}
                      className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-[#141413] border-2 border-[#141413] text-xs font-black uppercase font-mono shadow-[0px_2px_0px_0px_#141413] cursor-pointer shrink-0"
                    >
                      Enroll for ₹7k ➜
                    </button>
                  </div>
                </div>

                {/* Module 3: Profile Enhancer (Last 4 Weeks · ₹7,000) */}
                <div className="bg-white rounded-3xl border-2 border-[#141413] shadow-[0px_5px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_#141413] transition-all overflow-hidden p-6 sm:p-7">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-[#BAE6FD] text-sky-950 rounded-full border-2 border-[#141413] px-3 py-0.5 text-[11px] font-mono font-black uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                        LAST 4 WEEKS (W9–W12)
                      </span>
                      <span className="font-mono font-black text-2xl text-[#141413]">
                        ₹7,000
                      </span>
                    </div>

                    <h3 className="font-mono font-black text-2xl text-[#141413] tracking-tight mb-1">
                      Profile Enhancer
                    </h3>
                    <p className="text-xs font-bold text-[#188ab2] mb-4">
                      Make your prior experience read like a PM's and unlock high-intent referrals.
                    </p>

                    <div className="pt-3 border-t-2 border-[#141413]/10 mb-4">
                      <div className="font-mono font-black text-[11px] uppercase text-[#141413] mb-2">
                        WHAT THIS MODULE DELIVERS:
                      </div>
                      <ul className="space-y-2 font-bold text-xs sm:text-sm text-[#141413]">
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span><strong>4 live interactive sessions:</strong> Detailed profile reconstruction &amp; positioning</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span><strong>Map work to PM competencies:</strong> Translate analytics, ops, engineering to PM impact</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span><strong>Resume rewrite:</strong> Line-by-line makeover highlighting quantifiable metrics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span><strong>LinkedIn profile overhaul:</strong> Headline, summary, proof points, and recruiter discovery</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span><strong>Portfolio defense pack:</strong> How to walk interviewers through your case studies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-700 font-black mt-0.5">✦</span>
                          <span><strong>StepSmart PM Job Board:</strong> 3 months complimentary access to daily curated PM openings</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-[#141413]/10 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono font-bold text-[#141413]/70">
                      Included in AI PM Cohort, or standalone at ₹7,000
                    </span>
                    <button
                      onClick={() => {
                        setSelectedProfile(true);
                        scrollToSection('modular');
                      }}
                      className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-[#141413] border-2 border-[#141413] text-xs font-black uppercase font-mono shadow-[0px_2px_0px_0px_#141413] cursor-pointer shrink-0"
                    >
                      Enroll for ₹7k ➜
                    </button>
                  </div>
                </div>

              </div>

              {/* Free Learn Library Banner */}
              <div className="bg-white rounded-2xl border-2 border-[#141413] p-4 sm:p-5 shadow-[0px_3px_0px_0px_#141413] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[#A7F3D0] text-emerald-950 rounded-full border-2 border-[#141413] px-3 py-1 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                    LEARN MODULE · INCLUDED FREE
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#141413]">
                    Self-paced library behind the live tracks: Recorded lectures · Question bank · Case resources · Company-wise guides · PM Gym. Not sold separately.
                  </span>
                </div>
              </div>

            </div>

            {/* Single-module note */}
            <div className="max-w-5xl mx-auto mb-10">
              <div className="bg-[#FEF08A] rounded-2xl border-2 border-[#141413] p-4 sm:p-5 text-center font-bold text-xs sm:text-sm text-[#141413] shadow-[0px_4px_0px_0px_#141413]">
                <span className="font-mono font-black uppercase text-xs bg-white rounded-full px-3 py-1 border-2 border-[#141413] mr-2 inline-block mb-1 sm:mb-0 shadow-[0px_1.5px_0px_0px_#141413]">
                  SINGLE-MODULE NOTE
                </span>
                Buying one module? You join the same live group for that module and can add the other modules later at ₹7,000.
              </div>
            </div>

            {/* NEW BLOCK: HOW THE MODULES FIT TOGETHER (SIMPLE GRAPHIC) */}
            <div className="bg-white rounded-3xl border-2 border-[#141413] p-6 sm:p-10 shadow-[0px_6px_0px_0px_#141413] text-left max-w-5xl mx-auto">
              
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="bg-[#FEF08A] rounded-full border-2 border-[#141413] px-3.5 py-1 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#141413] rotate-[-1deg] inline-block select-none">
                  COHORT TIMELINE · STARTS 1ST DEC
                </span>
                <span className="font-mono font-black text-xs uppercase text-[#188ab2] bg-[#e0f2fe] rounded-full border-2 border-[#141413] px-3 py-1 shadow-[0px_1.5px_0px_0px_#141413]">
                  12 Weeks · The AI PM Track + Parallel Modules
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#141413] tracking-tight mb-3">
                Your path through the Accelerator
              </h3>
              
              <p className="text-xs sm:text-sm md:text-base font-bold text-[#141413]/85 max-w-3xl mb-8 leading-relaxed">
                The flagship AI PM track runs continuously across all 12 weeks: shipping one deliverable every week from Problem Brief to Demo Day. Running parallel below: the Interview Module takes the first 8 weeks (W1–W8), and the Profile Enhancer takes the last 4 weeks (W9–W12).
              </p>

              {/* TIMELINE CONTAINER (12-WEEK ROADMAP + PARALLEL TRACKS) */}
              <div className="rounded-2xl border-2 border-[#141413] bg-slate-50 p-4 sm:p-6 shadow-[0px_4px_0px_0px_#141413] space-y-6">
                
                {/* LANE 1: THE 12-WEEK AI PM TRACK */}
                <div className="bg-white rounded-xl border-2 border-[#141413] p-4 sm:p-5 shadow-[0px_3px_0px_0px_#141413]">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-2 border-b-2 border-[#141413]/10">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#188ab2] text-white rounded-full border border-[#141413] px-3 py-0.5 font-mono font-black text-xs uppercase">
                        LANE 1: FLAGSHIP
                      </span>
                      <h4 className="font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-[#141413]">
                        The 12-Week AI PM Track · 1 Deliverable Every Week
                      </h4>
                    </div>
                    <span className="font-mono font-bold text-[10px] text-[#188ab2] uppercase bg-[#e0f2fe] px-2.5 py-0.5 rounded-full border border-[#141413]">
                      3 Dedicated 1:1 Checkpoints (W4, W8, W12)
                    </span>
                  </div>

                  {/* 12-Week Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-left">
                    {[
                      { wk: "01", name: "Problem Brief", tag: "Problem space", star: false },
                      { wk: "02", name: "AI Brief", tag: "Problem space", star: false },
                      { wk: "03", name: "Behaviour Log", tag: "How AI behaves", star: false },
                      { wk: "04", name: "Prototype v1", tag: "1:1 Checkpoint #1", star: true },
                      { wk: "05", name: "Test Set (20)", tag: "Trustworthy AI", star: false },
                      { wk: "06", name: "Agent Sketch", tag: "Trustworthy AI", star: false },
                      { wk: "07", name: "Safety Plan", tag: "Trustworthy AI", star: false },
                      { wk: "08", name: "AI PRD", tag: "1:1 Checkpoint #2", star: true },
                      { wk: "09", name: "Build Sprint", tag: "Ship to 3 users", star: false },
                      { wk: "10", name: "Launch Plan", tag: "Cost & Telemetry", star: false },
                      { wk: "11", name: "Proof Pack", tag: "Portfolio & Story", star: false },
                      { wk: "12", name: "Demo Day & Mocks", tag: "1:1 Checkpoint #3", star: true },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border-2 border-[#141413] flex flex-col justify-between ${
                          item.star ? 'bg-[#FEF08A] shadow-[0px_2px_0px_0px_#141413]' : 'bg-[#f8fafc]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-black text-[10px] text-[#141413]">
                              W{item.wk}
                            </span>
                            {item.star && <span className="text-amber-800 text-[10px] font-black">★ 1:1</span>}
                          </div>
                          <div className="font-black text-xs text-[#141413] leading-tight mb-1">
                            {item.name}
                          </div>
                        </div>
                        <div className="text-[9px] font-mono font-bold text-[#141413]/70 uppercase truncate">
                          {item.tag}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LANE 2: PARALLEL TRACKS RUNNING BELOW THE AI PM MODULE */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#141413] text-white rounded-full border border-[#141413] px-3 py-0.5 font-mono font-black text-xs uppercase">
                      LANE 2: PARALLEL MODULES
                    </span>
                    <span className="font-mono font-bold text-xs text-[#141413]/80 uppercase">
                      Running alongside AI PM · First 8 weeks Interview, last 4 weeks Profile
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* First 8 Weeks: Interview Module (8 cols) */}
                    <div className="md:col-span-8 bg-[#D1FAE5] rounded-xl border-2 border-[#141413] p-4 flex flex-col justify-between shadow-[0px_3px_0px_0px_#141413]">
                      <div>
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                          <span className="font-mono font-black text-xs uppercase text-emerald-950 bg-white px-2.5 py-0.5 rounded-full border border-[#141413]">
                            FIRST 8 WEEKS (WEEKS 1 TO 8)
                          </span>
                          <span className="font-mono font-black text-xs text-emerald-900">
                            INTERVIEW MODULE · ₹7,000 OR INCLUDED
                          </span>
                        </div>
                        <h4 className="font-black text-base text-[#141413] mb-1">
                          Live Out-Loud Mock Practice &amp; Case Drills
                        </h4>
                        <p className="text-xs font-bold text-[#141413]/85 mb-2 leading-relaxed">
                          8 Saturday sessions covering clarifying questions, product sense, root cause analysis (RCA), metrics drop diagnosis, market sizing &amp; behavioral stories under pressure.
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[#141413]/20 flex items-center justify-between text-[11px] font-mono font-black text-emerald-950">
                        <span>✦ 2 Live 1:1 Mock Interviews (Weeks 4 &amp; 8)</span>
                        <span>Out-Loud Practice ✓</span>
                      </div>
                    </div>

                    {/* Last 4 Weeks: Profile Enhancer (4 cols) */}
                    <div className="md:col-span-4 bg-[#BAE6FD] rounded-xl border-2 border-[#141413] p-4 flex flex-col justify-between shadow-[0px_3px_0px_0px_#141413]">
                      <div>
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                          <span className="font-mono font-black text-xs uppercase text-sky-950 bg-white px-2.5 py-0.5 rounded-full border border-[#141413]">
                            LAST 4 WEEKS (W9–W12)
                          </span>
                          <span className="font-mono font-black text-xs text-sky-900">
                            PROFILE · ₹7,000
                          </span>
                        </div>
                        <h4 className="font-black text-base text-[#141413] mb-1">
                          Resume Rewrite &amp; LinkedIn
                        </h4>
                        <p className="text-xs font-bold text-[#141413]/85 mb-2 leading-relaxed">
                          4 live sessions: Map previous experience to PM competencies, rewrite resume, overhaul LinkedIn, and portfolio defense prep.
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[#141413]/20 text-[11px] font-mono font-black text-sky-950">
                        ✦ 3 Months StepSmart Job Board Access
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: 15 Seats & Schedule */}
                <div className="bg-[#FEF08A] rounded-xl border-2 border-[#141413] p-3 flex flex-wrap items-center justify-between gap-3 shadow-[0px_2px_0px_0px_#141413]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-xs text-[#141413] uppercase flex items-center gap-1.5">
                      <span>💬</span>
                      <span>DAILY PM GYM + WHATSAPP MENTOR SUPPORT + PERMANENT LEARN LIBRARY</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono font-bold text-[#141413]">
                    <span>📅 12 Weeks</span>
                    <span>•</span>
                    <span>🎥 Live Build Sessions</span>
                    <span>•</span>
                    <span>📄 1 Real AI Product</span>
                    <span>•</span>
                    <span>🎯 Capped at 15 Seats</span>
                  </div>
                </div>

              </div>

              {/* Start Date Confirmation Banner */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-[#141413]/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs sm:text-sm font-extrabold text-[#141413]">
                    Cohort Starts <span className="bg-[#FEF08A] rounded-md px-2 py-0.5 border border-[#141413] font-mono font-black">1st December 2026</span> · Strictly capped to 15 seats · Joining by conversation
                  </span>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => {
                      setBrochureFormStatus('idle');
                      setIsBrochureModalOpen(true);
                    }}
                    className="px-5 py-2 rounded-full bg-white hover:bg-slate-50 text-[#141413] border-2 border-[#141413] text-xs font-black uppercase font-mono shadow-[0px_3px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_5px_0px_0px_#141413] transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Brochure (PDF)</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="px-5 py-2 rounded-full bg-[#188ab2] text-white border-2 border-[#141413] text-xs font-black uppercase font-mono shadow-[0px_3px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_5px_0px_0px_#141413] transition-all cursor-pointer"
                  >
                    Reserve AI PM for ₹30,000 ➜
                  </button>
                </div>
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
              We don’t promise an unrealistic job guarantee. We promise proof you can defend in any interview.
            </p>

            {/* 5 Deliverables matching brochure */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left items-stretch">
              {[
                {
                  num: "01",
                  badgeBg: "bg-[#FEF08A]",
                  title: "A working AI product, built on your own domain",
                  desc: "A deployed, functioning product solving a real workflow problem from your company or industry, not a toy tutorial project."
                },
                {
                  num: "02",
                  badgeBg: "bg-[#BAE6FD]",
                  title: "An AI PRD and a 20-case test set",
                  desc: "Shows how you think, not just what you built. Evaluates edge cases, hallucinations, model drift, and approval guardrails."
                },
                {
                  num: "03",
                  badgeBg: "bg-[#FED7AA]",
                  title: "Portfolio case study & LinkedIn story",
                  desc: "A structured, production-grade proof pack and interview-tested narrative ready to present to hiring managers."
                },
                {
                  num: "04",
                  badgeBg: "bg-[#A7F3D0]",
                  title: "A plain way to explain AI behavior",
                  desc: "Speak with absolute authority on prompts, embeddings, guardrails, latency, and unit economics to engineers, leadership, and recruiters."
                },
                {
                  num: "05",
                  badgeBg: "bg-[#E9D5FF]",
                  title: "Full mock interview loop on your product",
                  desc: "Stress-tested across 3 dedicated 1:1 mentor checkpoints with Senior PMs from Microsoft and Mastercard before you step into real loops."
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative bg-slate-50 text-[#141413] rounded-2xl border-2 border-[#141413] p-6 pt-8 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#141413] transition-all flex flex-col justify-between"
                >
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
                <span>🎓 5 Verifiable AI PM Deliverables</span>
                <span className="text-[#188ab2]">· Zero Fluff</span>
              </div>
            </div>

          </div>
        </section>

        {/* 9. WHO THIS IS FOR / WHO THIS IS NOT FOR */}
        <section id="who-it-is-for" className="py-20 bg-slate-50 border-b-2 border-[#141413] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-5xl">
            
            <div className="text-center mb-14">
              <span className="bg-[#FEF08A] rounded-full border-2 border-[#141413] px-4 py-1 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#141413] rotate-[-1deg] inline-block mb-3 select-none">
                FIT &amp; COMMITMENT
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-[#141413] mb-3 tracking-tight">
                Is this{' '}
                <span className="inline-block bg-[#FEF08A] border-2 border-[#141413] rounded-xl px-3.5 py-0.5 rotate-[1.5deg] shadow-[0px_3px_0px_0px_#141413]">
                  for you?
                </span>
              </h2>
            </div>

            <div className="relative max-w-5xl mx-auto text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                
                {/* Left Card: Who this is for */}
                <div className="relative bg-[#DCFCE7] rounded-3xl border-2 border-[#141413] p-7 sm:p-9 shadow-[0px_6px_0px_0px_#141413] flex flex-col justify-between">
                  <div className="absolute -top-5 -right-3 sm:-right-4 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#F97316] text-white border-2 border-[#141413] shadow-[0px_3px_0px_0px_#141413] flex flex-col items-center justify-center text-center rotate-12 leading-tight p-1 select-none z-10">
                    <span className="text-[9px] font-black uppercase tracking-wider">IDEAL</span>
                    <span className="text-[11px] font-black uppercase">FIT ★</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-[#141413]/15">
                      <h3 className="text-xl sm:text-2xl font-black text-[#141413]">
                        This is for you if
                      </h3>
                      <span className="bg-white text-emerald-950 text-xs font-mono font-black px-3 py-1 rounded-full uppercase tracking-wider border-2 border-[#141413] shadow-[0px_1.5px_0px_0px_#141413]">
                        QUALIFIED
                      </span>
                    </div>

                    <ul className="space-y-4">
                      {[
                        "You are an analyst, QA, BA, product owner, program, data, risk or tech role",
                        "You use AI at work and want to explain it with confidence",
                        "You want to move toward product or AI product work",
                        "You can give about 6 hours a week and build every week"
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
                    Requires domain context and genuine readiness to build every week.
                  </div>
                </div>

                {/* Right Card: Who this is not for */}
                <div className="relative bg-[#FFF1F2] rounded-3xl border-2 border-[#141413] p-7 sm:p-9 shadow-[0px_6px_0px_0px_#141413] flex flex-col justify-between">
                  <div className="absolute -top-5 -right-3 sm:-right-4 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-rose-500 text-white border-2 border-[#141413] shadow-[0px_3px_0px_0px_#141413] flex flex-col items-center justify-center text-center -rotate-12 leading-tight p-1 select-none z-10">
                    <span className="text-[9px] font-black uppercase tracking-wider">NOT A</span>
                    <span className="text-[11px] font-black uppercase">FIT ✕</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-[#141413]/15">
                      <h3 className="text-xl sm:text-2xl font-black text-[#141413]">
                        This is not for you if
                      </h3>
                      <span className="bg-white text-rose-950 text-xs font-mono font-black px-3 py-1 rounded-full uppercase tracking-wider border-2 border-[#141413] shadow-[0px_1.5px_0px_0px_#141413]">
                        SKIP IF
                      </span>
                    </div>

                    <ul className="space-y-4">
                      {[
                        "You are a student or fresher with no working experience",
                        "You want to learn to code AI systems from scratch",
                        "You want an unrealistic job guarantee",
                        "You would rather passively watch videos than build"
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
                    We focus on rigorous, live execution — not passive shortcut promises.
                  </div>
                </div>

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

            {/* Main Pricing Layout: Top Card = AI PM Cohort; Side by Side Below = Interview Module & Profile Enhancer */}
            <div className="max-w-5xl mx-auto mb-10 flex flex-col gap-6 text-left">
              
              {/* TOP HERO CARD: THE AI PM COHORT (ALL-INCLUSIVE FLAGSHIP) */}
              <div className="bg-[#FFFDF5] rounded-3xl border-2 sm:border-[2.5px] border-[#141413] p-7 sm:p-9 shadow-[0px_8px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_11px_0px_0px_#141413] transition-all relative">
                
                {/* Popular Badge Top Right */}
                <div className="absolute -top-3.5 right-6 bg-[#FEF08A] rounded-full border-2 border-[#141413] px-3.5 py-0.5 font-mono font-black text-[11px] uppercase shadow-[0px_2px_0px_0px_#141413] rotate-[1.5deg]">
                  BEST VALUE · ALL MODULES INCLUDED
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#188ab2] text-white rounded-full border-2 border-[#141413] px-3.5 py-1 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                        FLAGSHIP · 12 WEEKS LIVE
                      </span>
                      <span className="bg-[#A7F3D0] text-emerald-950 rounded-full border-2 border-[#141413] px-3 py-1 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                        STARTS 1ST DEC · CAPPED AT 15 SEATS
                      </span>
                    </div>
                    <span className="text-xs font-mono font-black text-emerald-700 uppercase">
                      JOINING BY CONVERSATION
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-[#141413] mb-2 tracking-tight">
                    The AI PM Cohort
                  </h3>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono font-black text-4xl sm:text-5xl text-[#188ab2]">
                      ₹30,000
                    </span>
                    <span className="font-mono font-bold text-slate-500 text-sm">
                      (All-Inclusive for 12 Weeks)
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-[#141413]/85 mb-4 leading-snug">
                    12 weeks. One real AI product built from your own domain. Full access to the AI PM Track, Interview Module (Weeks 1–8), Profile Enhancer (Weeks 9–12), 3 1:1 checkpoints, and permanent Learn Library.
                  </p>

                  <div className="border-t-2 border-[#141413]/15 pt-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm font-bold text-[#141413]">
                      <ul className="space-y-2.5">
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-600 font-black mt-0.5">✓</span>
                          <span><strong>One real AI product</strong> built from your own domain and shipped to real users</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-600 font-black mt-0.5">✓</span>
                          <span><strong>AI PRD and 20-case test set</strong> to prove evaluation, safety guardrails &amp; thinking</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-600 font-black mt-0.5">✓</span>
                          <span><strong>3 dedicated 1:1 mentor checkpoints</strong> (Weeks 4, 8, 12) with MSFT &amp; Mastercard PMs</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-600 font-black mt-0.5">✓</span>
                          <span><strong>Full mock interview loop</strong> run directly on your own product build</span>
                        </li>
                      </ul>
                      <ul className="space-y-2.5">
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-600 font-black mt-0.5">✓</span>
                          <span><strong>Interview Module included:</strong> First 8 weeks of live out-loud mock practice + 2 live 1:1 mocks</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-600 font-black mt-0.5">✓</span>
                          <span><strong>Profile Enhancer included:</strong> Last 4 weeks of resume rewrite, LinkedIn overhaul &amp; portfolio pack</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-600 font-black mt-0.5">✓</span>
                          <span><strong>Learn Module free:</strong> Recorded lectures, question bank, case resources, and PM Gym</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-600 font-black mt-0.5">✓</span>
                          <span><strong>StepSmart PM Job Board access</strong> free for 3 months</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-[#141413]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={handleMainEnroll}
                    className="w-full sm:w-auto px-8 py-4 bg-[#188ab2] hover:bg-[#0f6f8f] text-white rounded-full border-2 border-[#141413] font-black text-sm uppercase shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#141413] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-center block"
                  >
                    Reserve AI PM for ₹30,000 ➜
                  </button>
                  <p className="text-[11px] font-bold text-[#188ab2] text-center sm:text-right">
                    Apply for 15-min alignment call · ₹1,000 seat-hold adjusted in fee
                  </p>
                </div>
              </div>

              {/* SIDE BY SIDE ROW BELOW AI PM: INTERVIEW MODULE & PROFILE ENHANCER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Standalone Interview Module Card */}
                <div className="bg-white rounded-3xl border-2 border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_9px_0px_0px_#141413] transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-[#D1FAE5] text-emerald-950 rounded-full border-2 border-[#141413] px-3.5 py-1 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                        FIRST 8 WEEKS (W1–W8)
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                        STANDALONE MODULE
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#141413] mb-1 tracking-tight">
                      Interview Module
                    </h3>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-mono font-black text-4xl text-[#141413]">
                        ₹7,000
                      </span>
                      <span className="font-mono font-bold text-slate-500 text-xs">
                        (or included with AI PM)
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#188ab2] mb-4 leading-snug">
                      8 live Saturday sessions + out-loud mock drills. Clarifying questions, product sense, RCA, metrics drop, estimation &amp; behavioral stories under pressure.
                    </p>

                    <div className="border-t-2 border-[#141413]/15 pt-4 mb-6">
                      <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-[#141413]">
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span>8 live Saturday out-loud practice rounds with immediate critique</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span>Product sense, root cause analysis (RCA), and metric drop diagnosis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span>Market sizing, guesstimates, and behavioral storytelling frameworks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-700 font-black mt-0.5">✦</span>
                          <span><strong>2 live 1:1 mock interviews</strong> with detailed written scorecard &amp; rubrics</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-[#141413]/15">
                    <button
                      onClick={() => {
                        setSelectedInterview(true);
                        scrollToSection('modular');
                      }}
                      className="w-full py-3.5 bg-white hover:bg-slate-50 text-[#141413] rounded-full border-2 border-[#141413] font-black text-sm uppercase shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#141413] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-center block"
                    >
                      Reserve Interview Module (₹7,000) ➜
                    </button>
                    <p className="text-[11px] font-bold text-[#141413]/70 text-center mt-2">
                      Join the live cohort for weeks 1–8 · Can add Profile Enhancer later at ₹7,000
                    </p>
                  </div>
                </div>

                {/* Standalone Profile Enhancer Card */}
                <div className="bg-white rounded-3xl border-2 border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0px_9px_0px_0px_#141413] transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-[#BAE6FD] text-sky-950 rounded-full border-2 border-[#141413] px-3.5 py-1 font-mono font-black text-xs uppercase shadow-[0px_1.5px_0px_0px_#141413]">
                        LAST 4 WEEKS (W9–W12)
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                        STANDALONE MODULE
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#141413] mb-1 tracking-tight">
                      Profile Enhancer
                    </h3>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-mono font-black text-4xl text-[#141413]">
                        ₹7,000
                      </span>
                      <span className="font-mono font-bold text-slate-500 text-xs">
                        (or included with AI PM)
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#188ab2] mb-4 leading-snug">
                      4 live sessions on profile reconstruction. Map prior experience to PM competencies, line-by-line resume rewrite, LinkedIn makeover &amp; StepSmart job board.
                    </p>

                    <div className="border-t-2 border-[#141413]/15 pt-4 mb-6">
                      <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-[#141413]">
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span>4 live sessions: Translate tech/analyst/ops work into PM signals</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span>Complete PM resume rewrite emphasizing quantifiable business outcomes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#188ab2] font-black mt-0.5">•</span>
                          <span>LinkedIn profile overhaul &amp; personal transition narrative</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-700 font-black mt-0.5">✦</span>
                          <span><strong>StepSmart PM Job Board:</strong> 3 months free access to daily curated PM roles</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-[#141413]/15">
                    <button
                      onClick={() => {
                        setSelectedProfile(true);
                        scrollToSection('modular');
                      }}
                      className="w-full py-3.5 bg-white hover:bg-slate-50 text-[#141413] rounded-full border-2 border-[#141413] font-black text-sm uppercase shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#141413] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-center block"
                    >
                      Reserve Profile Enhancer (₹7,000) ➜
                    </button>
                    <p className="text-[11px] font-bold text-[#141413]/70 text-center mt-2">
                      Join the live cohort for weeks 9–12 · Can add Interview Module later at ₹7,000
                    </p>
                  </div>
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
                Module ₹7,000 each. Live cohorts with 1:1 mentor feedback. PM Gym and session recordings included.
              </p>

              {/* Two Modular Options Side-by-Side */}
              <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
                {/* Module 1: Interview Module Card */}
                <div
                  onClick={() => setSelectedInterview(!selectedInterview)}
                  className={`bg-white rounded-2xl border-2 border-[#141413] p-6 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_7px_0px_0px_#141413] transition-all cursor-pointer flex flex-col justify-between select-none ${
                    selectedInterview ? 'ring-2 ring-[#188ab2] bg-sky-50/50' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-black tracking-tight text-[#141413]">
                        MOD 1: INTERVIEW MODULE
                      </h4>
                      <div className={`w-6 h-6 rounded-md border-2 border-[#141413] flex items-center justify-center font-black transition-colors ${
                        selectedInterview ? 'bg-[#188ab2] text-white' : 'bg-white'
                      }`}>
                        {selectedInterview ? '✓' : ''}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-mono font-black text-2xl text-[#188ab2]">
                        ₹7,000
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                        (FIRST 8 WEEKS)
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#141413]/80 leading-relaxed">
                      8 live Saturday sessions + 2 live mock interviews with 1:1 feedback. Product sense, clarifying questions, RCA, metrics drops, and behavioral stories under pressure.
                    </p>
                  </div>
                </div>

                {/* Module 2: Profile Enhancer Card */}
                <div
                  onClick={() => setSelectedProfile(!selectedProfile)}
                  className={`bg-white rounded-2xl border-2 border-[#141413] p-6 shadow-[0px_4px_0px_0px_#141413] hover:-translate-y-1 hover:shadow-[0px_7px_0px_0px_#141413] transition-all cursor-pointer flex flex-col justify-between select-none ${
                    selectedProfile ? 'ring-2 ring-[#188ab2] bg-sky-50/50' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-black tracking-tight text-[#141413]">
                        MOD 2: PROFILE ENHANCER
                      </h4>
                      <div className={`w-6 h-6 rounded-md border-2 border-[#141413] flex items-center justify-center font-black transition-colors ${
                        selectedProfile ? 'bg-[#188ab2] text-white' : 'bg-white'
                      }`}>
                        {selectedProfile ? '✓' : ''}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-mono font-black text-2xl text-[#188ab2]">
                        ₹7,000
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                        (LAST 4 WEEKS)
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#141413]/80 leading-relaxed">
                      4 live sessions. Map prior experience to PM competencies, line-by-line resume rewrite, LinkedIn overhaul, portfolio defense pack, and 3 months PM job board access.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1:1 Mentoring Add-on Full-Width Row */}
              <div
                onClick={() => setSelected1to1(!selected1to1)}
                className={`mt-6 max-w-4xl mx-auto bg-white rounded-2xl border-2 border-[#141413] p-4 sm:p-5 shadow-[0px_4px_0px_0px_#141413] flex items-center gap-3 sm:gap-4 cursor-pointer text-left hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#141413] transition-all select-none ${
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
                    SELECT INTERVIEW OR PROFILE ABOVE TO CONTINUE
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
                    Download Full 12-Week AI PM Brochure
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#141413]/80 leading-relaxed">
                    Get instant access to the complete 12-week roadmap, real AI product deliverables, interview module, profile enhancer, and mentor review rubric.
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
