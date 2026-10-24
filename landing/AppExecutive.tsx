import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  Calendar,
  Clock,
  Check,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Flame,
  FileText,
  Download,
  Share2
} from 'lucide-react';
import { getStoredBatchConfig, type BatchConfig } from './batchConfig';
import { startBrochureDownload, saveLeadToDemoDB } from './AppBrutalism';

export function AppExecutive() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openWeek, setOpenWeek] = useState<number | null>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [batchConfig, setBatchConfig] = useState<BatchConfig>(() => getStoredBatchConfig());

  // Interactive modular checkboxes from attached HTML
  const [selectedBuild, setSelectedBuild] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState(false);
  const [selected1to1, setSelected1to1] = useState(false);

  // Early-bird countdown state
  const [countdownText, setCountdownText] = useState('Early bird: ₹15,000 until 31 October');
  const [isEarlyBird, setIsEarlyBird] = useState(true);

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
    const end = new Date('2026-10-31T23:59:59+05:30').getTime();
    const updateCountdown = () => {
      const left = end - Date.now();
      if (left > 0) {
        setIsEarlyBird(true);
        const d = Math.floor(left / 864e5);
        const h = Math.floor((left % 864e5) / 36e5);
        const m = Math.floor((left % 36e5) / 6e4);
        setCountdownText(`Early bird ₹15,000 ends in ${d}d ${h}h ${m}m · Then ₹20,000`);
      } else {
        setIsEarlyBird(false);
        setCountdownText('Seats strictly capped at 30 · Standard tuition applies');
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 30000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Modular selection calculation
  const modularItemCount = (selectedBuild ? 1 : 0) + (selectedPractice ? 1 : 0);
  const modularTotal = (modularItemCount * 5000) + (selected1to1 ? 5000 : 0);
  const modularLabel = [
    selectedBuild ? 'Build' : '',
    selectedPractice ? 'Practice' : '',
    selected1to1 ? '1:1 Mentoring' : ''
  ].filter(Boolean).join(' + ');

  const handleModularEnroll = () => {
    const intent = `Hi, I want to enroll for modular PM-X: ${modularLabel} (₹${modularTotal.toLocaleString('en-IN')})`;
    window.open(`https://wa.me/message/GH5C7YLAYIEHN1?text=${encodeURIComponent(intent)}`, '_blank', 'noopener,noreferrer');
  };

  const handleMainEnroll = () => {
    const intent = `Hi, I want to reserve my seat for the full PM-X Accelerator cohort (₹${isEarlyBird ? '15,000' : '20,000'})`;
    window.open(`https://wa.me/message/GH5C7YLAYIEHN1?text=${encodeURIComponent(intent)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#111111] font-sans selection:bg-[#FFF3A7] selection:text-[#111111] font-medium">
      
      {/* 1. TOP ANNOUNCEMENT TICKER (Neobrutalist Yellow Banner) */}
      <aside aria-label="Announcement Banner" className="sticky top-0 z-50 w-full bg-[#FFF3A7] border-b-2 border-[#111111] text-xs py-2 px-4 font-black">
        <div className="container mx-auto max-w-7xl flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2 py-0.5 text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] inline-flex items-center gap-1.5 font-black">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ADDMISSION LIVE
            </span>
            <span className="text-[#111111] font-black text-xs sm:text-sm">
              {countdownText}
            </span>
          </div>
          <button
            onClick={() => scrollToSection('pricing')}
            className="bg-[#188ab2] hover:bg-[#0f6f8f] text-white border-2 border-[#111111] px-3.5 py-1 text-xs uppercase font-black shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
          >
            Reserve Seat ➜
          </button>
        </div>
      </aside>

      {/* 2. NEOBRUTALIST NAVBAR */}
      <header className="w-full bg-[#FDFCF7] border-b-2 border-[#111111] relative z-40">
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
            <span className="font-black text-2xl tracking-tight text-[#111111]">
              StepSmart
            </span>
          </Link>

          {/* Clean Desktop Navigation Anchors */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-extrabold text-[#111111]">
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
            <button onClick={() => scrollToSection('faq')} className="hover:text-[#188ab2] transition-colors cursor-pointer font-extrabold">
              FAQ
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/auth"
              className="px-5 py-2 border-2 border-[#111111] text-[#111111] hover:bg-[#FFF3A7] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(17,17,17,1)] transition-all font-extrabold text-sm"
            >
              Login
            </Link>
            <button
              onClick={() => scrollToSection('pricing')}
              className="px-6 py-2.5 font-black border-2 border-[#111111] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[3.5px_3.5px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] transition-all text-sm uppercase cursor-pointer"
            >
              Reserve Seat ➜
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 border-2 border-[#111111] bg-white shadow-[2.5px_2.5px_0px_0px_rgba(17,17,17,1)]"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-[#111111]" /> : <Menu className="w-6 h-6 text-[#111111]" />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <div className="md:hidden w-full bg-[#FDFCF7] border-b-2 border-[#111111] p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
            <button onClick={() => scrollToSection('system')} className="text-left font-black text-lg py-2 border-b-2 border-[#111111]/20">
              Cohort
            </button>
            <button onClick={() => scrollToSection('curriculum')} className="text-left font-black text-lg py-2 border-b-2 border-[#111111]/20">
              Curriculum (8 Weeks)
            </button>
            <button onClick={() => scrollToSection('mentors')} className="text-left font-black text-lg py-2 border-b-2 border-[#111111]/20">
              Mentors
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-left font-black text-lg py-2 border-b-2 border-[#111111]/20">
              Pricing
            </button>
            <button onClick={() => scrollToSection('faq')} className="text-left font-black text-lg py-2 border-b-2 border-[#111111]/20">
              FAQ
            </button>
            <div className="flex flex-col gap-3 pt-3">
              <button
                onClick={() => scrollToSection('pricing')}
                className="w-full py-3.5 border-2 border-[#111111] bg-[#188ab2] text-white font-black text-sm uppercase shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]"
              >
                Reserve Seat ➜
              </button>
              <Link
                to="/auth"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-2.5 border-2 border-[#111111] bg-white text-[#111111] text-center font-black text-sm shadow-[2.5px_2.5px_0px_0px_rgba(17,17,17,1)]"
              >
                Learner Login
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* 3. HERO SECTION (Our Main Page Hero with Modular Unbundling) */}
        <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-[#FDFCF7] border-b-2 border-[#111111]">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            
            {/* Top Eyebrow Sticker (Clean white surface to fix Yellow Fatigue) */}
            <div className="inline-block mb-6">
              <span className="bg-white border-2 border-[#111111] px-4 py-1.5 font-mono font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] inline-block tracking-wider select-none">
                ★ LIVE 8-WEEK PM FELLOWSHIP · REVIEWED BY WORKING PMS
              </span>
            </div>

            {/* Signature Neobrutalism Headline with Focused Yellow Highlighter */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.12] text-[#111111]">
              Stepsmart - your step to{' '}
              <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-4 py-1 rotate-[-1.5deg] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] select-none">
                product management
              </span>
            </h1>

            {/* Dual-Weight Subhead */}
            <p className="text-base md:text-lg text-[#111111]/85 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Finish 8 weeks with a <strong className="font-black text-[#111111]">real project</strong>, a <strong className="font-black text-[#111111]">PM resume</strong>, and interview practice. Live classes on Wednesday, Saturday, and Sunday. Reviewed 1:1 by working PMs at Microsoft and Mastercard. Capped at 30 seats.
            </p>

            {/* Hero Interactive Path Selector (No Black Box: Blue & White Neobrutalist Buttons) */}
            <div className="mb-12 max-w-4xl mx-auto text-left">
              <h3 className="text-center text-lg sm:text-xl font-black text-[#111111] mb-6 tracking-tight">
                Not sure which one is yours?{' '}
                <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-2.5 py-0.5 rotate-[1deg] shadow-[2px_2px_0px_0px_#111111]">
                  Pick what sounds like you
                </span>
              </h3>

              <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
                {/* Button 1: Blue Button (Like Reserve Seat) -> Takes to Full Stack Pricing */}
                <button
                  type="button"
                  onClick={() => scrollToSection('pricing')}
                  className="w-full text-left p-6 sm:p-7 border-2 border-[#111111] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#111111] transition-all cursor-pointer group flex flex-col justify-between select-none"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl sm:text-2xl font-black text-white group-hover:text-[#FFF3A7] transition-colors">
                        I’m new to PM
                      </span>
                      <span className="text-white text-base font-black group-hover:translate-x-1 transition-transform">
                        ➜
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed">
                      I can’t yet structure an RCA, product design or metrics answer on my own
                    </p>
                  </div>
                </button>

                {/* Button 2: White Button (Like Brochure) -> Takes to Modular One Piece */}
                <button
                  type="button"
                  onClick={() => scrollToSection('modular')}
                  className="w-full text-left p-6 sm:p-7 border-2 border-[#111111] bg-white hover:bg-slate-50 text-[#111111] shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#111111] transition-all cursor-pointer group flex flex-col justify-between select-none"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl sm:text-2xl font-black text-[#111111] group-hover:text-[#188ab2] transition-colors">
                        I know PM and need the offer
                      </span>
                      <span className="text-[#111111] text-base font-black group-hover:translate-x-1 transition-transform">
                        ➜
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#111111]/80 font-medium leading-relaxed">
                      I get the concepts. I need a portfolio, a profile and interview practice
                    </p>
                  </div>
                </button>
              </div>

              {/* Auxiliary Brochure Download Link */}
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setBrochureFormStatus('idle');
                    setIsBrochureModalOpen(true);
                  }}
                  className="text-xs font-bold text-[#111111]/75 hover:text-[#188ab2] underline cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Looking for the 8-week syllabus? Download Full Brochure PDF ➜</span>
                </button>
              </div>
            </div>

            {/* Spec Bar (2px borders, tactile shadow) */}
            <div className="bg-[#e6f1fb] border-2 border-[#111111] p-4 shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-black uppercase text-[#111111]">
              <div>
                <span className="text-[#111111] opacity-75 block text-[10px] font-black">NEXT COHORT</span>
                <span className="text-[#111111] font-black">ADDMISSION LIVE</span>
              </div>
              <div>
                <span className="text-[#111111] opacity-75 block text-[10px] font-black">SCHEDULE</span>
                <span className="text-[#111111] font-black">WED, SAT &amp; SUN</span>
              </div>
              <div>
                <span className="text-[#111111] opacity-75 block text-[10px] font-black">BATCH SIZE</span>
                <span className="text-[#188ab2] font-black">30 SEATS MAX</span>
              </div>
              <div>
                <span className="text-[#111111] opacity-75 block text-[10px] font-black">MENTORS</span>
                <span className="text-[#111111] font-black">MSFT &amp; MASTERCARD</span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. THE 3 TRANSITION PATHWAYS (FIG 0.1, 0.2, 0.3 In Neobrutalism) */}
        <section className="py-20 bg-slate-50 border-b-2 border-[#111111]">
          <div className="container mx-auto px-6 max-w-7xl">
            
            <div className="text-center mb-16">
              <span className="bg-white border-2 border-[#111111] px-3.5 py-1 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#111111] rotate-[-1deg] inline-block mb-3">
                THE TRANSITION STORIES
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-[#111111] tracking-tight">
                There is no single formula for entering product.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* FIG 0.1 */}
              <div className="bg-white border-2 border-[#111111] p-6 shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-mono font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_#111111]">
                      FIG 0.1 // NON-TECH
                    </span>
                  </div>
                  <div className="w-full aspect-[16/10] border-2 border-[#111111] overflow-hidden mb-6 bg-slate-100 shadow-[2px_2px_0px_0px_#111111]">
                    <img
                      src="/hero-slide-1.webp"
                      alt="Non-tech to PM"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-black text-[#111111] mb-3 leading-snug">
                    "I switched into PM with zero product experience. No CS degree. No MBA."
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#111111]/85 leading-relaxed mb-6">
                    For business analysts, operations leads, and consultants. We break down how to translate your domain knowledge into executive product strategy without ₹25L+ MBA debt.
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-slate-100 text-[11px] font-black uppercase text-[#188ab2]">
                  PATH: OPERATIONS / QA / BA → PM
                </div>
              </div>

              {/* FIG 0.2 */}
              <div className="bg-white border-2 border-[#111111] p-6 shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#e0f2fe] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-mono font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_#111111]">
                      FIG 0.2 // TECH &amp; SDE
                    </span>
                  </div>
                  <div className="w-full aspect-[16/10] border-2 border-[#111111] overflow-hidden mb-6 bg-slate-100 shadow-[2px_2px_0px_0px_#111111]">
                    <img
                      src="/hero-slide-2.webp"
                      alt="Engineer to PM"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-black text-[#111111] mb-3 leading-snug">
                    "I took the conventional but not so conventional path from an SDE to MBA to PM."
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#111111]/85 leading-relaxed mb-6">
                    For software developers, tech leads, and data engineers. Learn to bridge technical architecture with user empathy, unit economics, and roadmap prioritisation.
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-slate-100 text-[11px] font-black uppercase text-[#188ab2]">
                  PATH: SDE / TECH LEAD → PM
                </div>
              </div>

              {/* FIG 0.3 */}
              <div className="bg-white border-2 border-[#111111] p-6 shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#fef08a] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-mono font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_#111111]">
                      FIG 0.3 // CAMPUS
                    </span>
                  </div>
                  <div className="w-full aspect-[16/10] border-2 border-[#111111] overflow-hidden mb-6 bg-slate-100 shadow-[2px_2px_0px_0px_#111111]">
                    <img
                      src="/hero-slide-3.webp"
                      alt="College to PM"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-black text-[#111111] mb-3 leading-snug">
                    "No experience. No roadmap. Just a college grad who became a PM."
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#111111]/85 leading-relaxed mb-6">
                    For final-year undergrads targeting campus placements. Build real proof-of-work portfolio deliverables that cut through the noise in APM and Analyst hiring drives.
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-slate-100 text-[11px] font-black uppercase text-[#188ab2]">
                  PATH: UNDERGRADUATE → APM
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 5. WHY MOST PEOPLE STAY STUCK & THE REFRAME (From Attached HTML) */}
        <section className="py-20 bg-white border-b-2 border-[#111111]">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            
            <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-8 tracking-tight">
              Why most people stay{' '}
              <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-3.5 py-0.5 rotate-[-1.5deg] shadow-[3px_3px_0px_0px_#111111]">
                stuck
              </span>
            </h2>

            <div className="space-y-4 max-w-xl mx-auto text-left mb-10">
              <div className="bg-white border-2 border-[#111111] p-4 shadow-[3px_3px_0px_0px_#111111] font-semibold text-sm text-[#111111]/90 flex items-start gap-3">
                <span className="text-red-600 font-black text-lg leading-none">✗</span>
                <span>You’ve watched the videos and read the casebooks, and nothing is sticking.</span>
              </div>
              <div className="bg-white border-2 border-[#111111] p-4 shadow-[3px_3px_0px_0px_#111111] font-semibold text-sm text-[#111111]/90 flex items-start gap-3">
                <span className="text-red-600 font-black text-lg leading-none">✗</span>
                <span>Your resume says analyst or engineer. Recruiters can’t see PM.</span>
              </div>
              <div className="bg-white border-2 border-[#111111] p-4 shadow-[3px_3px_0px_0px_#111111] font-semibold text-sm text-[#111111]/90 flex items-start gap-3">
                <span className="text-red-600 font-black text-lg leading-none">✗</span>
                <span>You’re worried about “faking it.”</span>
              </div>
            </div>

            {/* The Signature Reframe Box */}
            <div className="bg-[#FFF3A7] border-2 border-[#111111] p-6 text-center font-black text-xl md:text-2xl text-[#111111] max-w-xl mx-auto shadow-[5px_5px_0px_0px_#111111] rotate-[-1deg]">
              You don’t lack experience. You lack evidence.
            </div>

          </div>
        </section>

        {/* 6. THE 4-PILLAR SYSTEM (Learn · Build · Practise · Career) */}
        <section id="system" className="py-14 md:py-18 bg-slate-50 border-b-[3px] border-[#111111] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-7xl">
            
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-3">
                Learn. Build. Practise.{' '}
                <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-3.5 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]">
                  Career.
                </span>
              </h2>
              <p className="text-base font-bold text-[#111111] max-w-lg mx-auto">
                One system, 8 weeks, 6 live hours a week. Chat doubt support runs through all four steps.
              </p>
            </div>

            {/* Clean, Uniform 4-Column Grid with Equal Height and Perfect Alignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              
              {/* Pillar 01: LEARN */}
              <div className="bg-white border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-between h-full">
                <div>
                  <div className="p-3 bg-[#188ab2] text-white border-b-[3px] border-[#111111] font-mono font-black flex items-center justify-between">
                    <span className="text-base tracking-wider">01</span>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-1.5 py-0.5 text-[10px] font-black uppercase">
                        Start here
                      </span>
                      <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-1.5 py-0.5 text-[10px] font-black">
                        03 items
                      </span>
                    </div>
                  </div>
                  <h3 className="font-mono font-black text-xl text-[#111111] p-4 pb-2 tracking-wider">LEARN</h3>
                  <ul className="p-4 pt-0 space-y-3 font-bold text-xs sm:text-sm text-[#111111] flex-1">
                    <li className="pt-2 border-t-2 border-slate-100">
                      <b className="text-[#111111] text-sm block mb-0.5 font-black">Pre-recorded PM modules</b>
                      Core concepts and frameworks, at your pace.
                    </li>
                    <li className="pt-2 border-t-2 border-slate-100">
                      <b className="text-[#111111] text-sm block mb-0.5 font-black">8 live Learn classes</b>
                      Wednesday, 16 live hours.
                    </li>
                    <li className="pt-2 border-t-2 border-slate-100">
                      <b className="text-[#111111] text-sm block mb-0.5 font-black">Recording of every class</b>
                      Miss one, catch up within hours.
                    </li>
                  </ul>
                </div>
                <div className="m-4 mt-auto border-[3px] border-[#111111] bg-[#e6f1fb] p-2.5 text-center font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] text-[#111111]">
                  Wednesday Live · 16 hrs
                </div>
              </div>

              {/* Pillar 02: BUILD */}
              <div className="bg-white border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-between h-full">
                <div>
                  <div className="p-3 bg-[#188ab2] text-white border-b-[3px] border-[#111111] font-mono font-black flex items-center justify-between">
                    <span className="text-base tracking-wider">02</span>
                    <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-1.5 py-0.5 text-[10px] font-black">
                      03 items
                    </span>
                  </div>
                  <h3 className="font-mono font-black text-xl text-[#111111] p-4 pb-2 tracking-wider">BUILD</h3>
                  <ul className="p-4 pt-0 space-y-3 font-bold text-xs sm:text-sm text-[#111111] flex-1">
                    <li className="pt-2 border-t-2 border-slate-100">
                      <b className="text-[#111111] text-sm block mb-0.5 font-black">8 live Build classes</b>
                      Sunday, 16 live hours.
                    </li>
                    <li className="pt-2 border-t-2 border-slate-100">
                      <b className="text-[#111111] text-sm block mb-0.5 font-black">One real project</b>
                      Teardown to prototype, with mentor review.
                    </li>
                    <li className="pt-2 border-t-2 border-slate-100">
                      <b className="text-[#111111] text-sm block mb-0.5 font-black">Graded assignments</b>
                      Real deliverables, rubric feedback.
                    </li>
                  </ul>
                </div>
                <div className="m-4 mt-auto border-[3px] border-[#111111] bg-[#e6f1fb] p-2.5 text-center font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] text-[#111111]">
                  Sunday Live · 16 hrs
                </div>
              </div>

              {/* Pillar 03: PRACTISE */}
              <div className="bg-white border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-between h-full">
                <div>
                  <div className="p-3 bg-[#188ab2] text-white border-b-[3px] border-[#111111] font-mono font-black flex items-center justify-between">
                    <span className="text-base tracking-wider">03</span>
                    <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-1.5 py-0.5 text-[10px] font-black">
                      03 items
                    </span>
                  </div>
                  <h3 className="font-mono font-black text-xl text-[#111111] p-4 pb-2 tracking-wider">PRACTISE</h3>
                  <ul className="p-4 pt-0 space-y-3 font-bold text-xs sm:text-sm text-[#111111] flex-1">
                    <li className="pt-2 border-t-2 border-slate-100">
                      <b className="text-[#111111] text-sm block mb-0.5 font-black">8 live Practice classes</b>
                      Saturday, 16 live hours, with mock rounds.
                    </li>
                    <li className="pt-2 border-t-2 border-slate-100">
                      <b className="text-[#111111] text-sm block mb-0.5 font-black">Interview question banks</b>
                      Product design, RCA, metrics, behavioural.
                    </li>
                    <li className="pt-2 border-t-2 border-slate-100">
                      <b className="text-[#111111] text-sm block mb-0.5 font-black">Daily PM Gym</b>
                      A bite-sized product question every day.
                    </li>
                  </ul>
                </div>
                <div className="m-4 mt-auto border-[3px] border-[#111111] bg-[#e6f1fb] p-2.5 text-center font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] text-[#111111]">
                  Saturday Live · 16 hrs
                </div>
              </div>

              {/* Pillar 04: CAREER */}
              <div className="bg-white border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-between h-full">
                <div>
                  <div className="p-3 bg-[#188ab2] text-white border-b-[3px] border-[#111111] font-mono font-black flex items-center justify-between">
                    <span className="text-base tracking-wider">04</span>
                    <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-1.5 py-0.5 text-[10px] font-black">
                      02 items
                    </span>
                  </div>
                  <h3 className="font-mono font-black text-xl text-[#111111] p-4 pb-2 tracking-wider">CAREER</h3>
                  <ul className="p-4 pt-0 space-y-3 font-bold text-xs sm:text-sm text-[#111111] flex-1">
                    <li className="pt-2 border-t-2 border-slate-100">
                      <b className="text-[#111111] text-sm block mb-0.5 font-black">Job board access</b>
                      Fresh PM roles, free for 3 months after cohort.
                    </li>
                    <li className="pt-2 border-t-2 border-slate-100">
                      <b className="text-[#111111] text-sm block mb-0.5 font-black">Completion certificate</b>
                      For verified attendance and assignment scores.
                    </li>
                  </ul>
                </div>
                <div className="m-4 mt-auto border-[3px] border-[#111111] bg-[#C6F6D5] p-2.5 text-center font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] text-green-950">
                  Transition-Ready
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 7. WHAT YOU'LL WALK AWAY WITH */}
        <section className="py-20 bg-white border-b-2 border-[#111111]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Left Column: Pure Floating Title Anchor */}
              <div className="lg:col-span-5 lg:sticky lg:top-36 text-left">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight leading-[1.15]">
                  What you’ll{' '}
                  <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-3.5 py-0.5 rotate-[1.5deg] shadow-[2.5px_2.5px_0px_0px_#111111]">
                    walk away with.
                  </span>
                </h2>
              </div>

              {/* Right Column: 5 Core Outcomes with High-Energy ✦ Markers */}
              <div className="lg:col-span-7 space-y-8 sm:space-y-10 text-left">
                {[
                  {
                    num: "01",
                    title: "Real-World Case Portfolio",
                    desc: "An end-to-end product teardown, market validation, user research, data analysis, PRD, and a clickable prototype built from scratch."
                  },
                  {
                    num: "02",
                    title: "Recruiter-Vetted Case Study",
                    desc: "A mentor-reviewed case study with rubric feedback that you can directly submit to hiring managers and recruiters as undeniable proof of competence."
                  },
                  {
                    num: "03",
                    title: "PM-Positioned Resume & LinkedIn",
                    desc: "A fully overhauled resume and LinkedIn profile engineered to translate your prior engineering, data, or operations background into executive product strategy."
                  },
                  {
                    num: "04",
                    title: "Interview War-Chest",
                    desc: "Scripted and tested frameworks for behavioral rounds, product sense, root cause analysis, estimation, and your personalized 'Why I'm switching' story."
                  },
                  {
                    num: "05",
                    title: "Verified Credential & Job Pipeline",
                    desc: "A verified completion certificate based on evaluated assignment scores, plus 3 full months of access to our active PM hiring job board."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 sm:gap-6 group">
                    {/* Number Badge */}
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#188ab2] text-white flex items-center justify-center font-mono font-black text-xs sm:text-sm shrink-0 mt-0.5 border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111]">
                      {item.num}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-black text-[#111111] tracking-tight group-hover:text-[#188ab2] transition-colors mb-1 flex items-center gap-2">
                        <span className="text-[#188ab2] text-xs font-black select-none">✦</span>
                        <span>{item.title}</span>
                      </h3>
                      <p className="text-sm font-medium text-[#111111]/80 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* 8. THE 8 WEEKS, WEEK BY WEEK */}
        <section id="curriculum" className="py-20 bg-slate-50 border-b-2 border-[#111111] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-4xl">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-3 tracking-tight">
                The 8 weeks,{' '}
                <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-3.5 py-0.5 rotate-[-1.5deg] shadow-[2.5px_2.5px_0px_0px_#111111]">
                  week by week
                </span>
              </h2>
              <p className="text-base font-medium text-[#111111]/80">
                Wednesday learn, Sunday build, Saturday practise.
              </p>
            </div>

            {/* Minimal Editorial Single-Line Separator Layout with Naked Numeric Headings */}
            <div className="border-t border-b border-[#111111]/20 divide-y divide-[#111111]/20 text-left bg-transparent">
              {[
                { 
                  week: 1, 
                  num: "01",
                  title: "Mindset & Teardown", 
                  subtitle: "Product thinking mindset, live teardown & strengths storytelling",
                  isGraded: false, 
                  learn: "Product thinking mindset, core heuristics, and PM problem discovery", 
                  build: "Live product teardown of real-world fintech & consumer apps", 
                  practice: "Strengths storytelling & user insight interview questions" 
                },
                { 
                  week: 2, 
                  num: "02",
                  title: "Market Research & Sizing", 
                  subtitle: "Business viability, TAM estimation & root cause analysis",
                  isGraded: true, 
                  learn: "Business viability, competitor intelligence, and market research", 
                  build: "Complete market sizing deck & opportunity assessment", 
                  practice: "Root cause analysis (RCA) live mock drills" 
                },
                { 
                  week: 3, 
                  num: "03",
                  title: "User Research & JTBD", 
                  subtitle: "Primary research, segmentation, journey maps & estimation",
                  isGraded: false, 
                  learn: "Primary user interviews, segmentation, JTBD, journey maps", 
                  build: "End-to-end user persona & friction-point mapping deliverable", 
                  practice: "Market sizing, estimation & executive stakeholder communication" 
                }
              ].map(w => {
                const isOpen = openWeek === w.week;
                return (
                  <div key={w.week} className="transition-colors hover:bg-black/[0.02]">
                    <button
                      onClick={() => setOpenWeek(isOpen ? null : w.week)}
                      className="w-full py-5 sm:py-6 px-1 sm:px-2 flex items-center justify-between text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0 pr-4">
                        {/* Naked Numeric Headings (01, 02) */}
                        <span className="font-mono font-black text-lg sm:text-xl text-[#188ab2] shrink-0 tracking-wider w-8 sm:w-10">
                          {w.num}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-lg sm:text-xl font-black text-[#111111] group-hover:text-[#188ab2] transition-colors tracking-tight">
                              {w.title}
                            </span>
                            {w.isGraded && (
                              <span className="bg-[#FFF3A7] text-[#111111] border border-[#111111] text-[10px] font-mono font-black px-2 py-0.5 uppercase">
                                GRADED
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-[#111111]/70 truncate mt-0.5">
                            {w.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-mono font-bold text-[#111111]/50 uppercase hidden sm:inline">
                          {isOpen ? 'Close' : 'View Syllabus'}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-[#111111] stroke-[2.5] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#188ab2]' : ''}`} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="pb-6 pt-1 px-1 sm:px-2 pl-12 sm:pl-15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm font-medium text-[#111111]/85 border-t border-[#111111]/10 mt-1">
                        <div className="p-3 bg-white/90 border-l-2 border-[#188ab2]">
                          <b className="text-[#111111] block mb-1 font-black text-xs uppercase tracking-wide">Learn · Wednesday</b>
                          <span className="text-[#111111]/80">{w.learn}</span>
                        </div>
                        <div className="p-3 bg-white/90 border-l-2 border-[#111111]">
                          <b className="text-[#111111] block mb-1 font-black text-xs uppercase tracking-wide">Build · Sunday</b>
                          <span className="text-[#111111]/80">{w.build}</span>
                        </div>
                        <div className="p-3 bg-white/90 border-l-2 border-[#FFF3A7]">
                          <b className="text-[#111111] block mb-1 font-black text-xs uppercase tracking-wide">Practise · Saturday</b>
                          <span className="text-[#111111]/80">{w.practice}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Minimal Apple-Style Curriculum Brochure Unlock Bar */}
            <div
              onClick={() => {
                setBrochureFormStatus('idle');
                setIsBrochureModalOpen(true);
              }}
              className="mt-8 bg-white border-2 border-[#111111] p-4 sm:p-5 shadow-[3px_3px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#111111] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group select-none"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#188ab2]/10 border border-[#188ab2] text-[#188ab2] flex items-center justify-center shrink-0 group-hover:bg-[#188ab2] group-hover:text-white transition-colors">
                  <Download className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm sm:text-base font-black text-[#111111] tracking-tight">
                      Want the full 8-week syllabus?
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-[#188ab2] uppercase bg-[#e0f2fe] border border-[#188ab2]/30 px-1.5 py-0.5">
                      WEEKS 04–08 · PDF
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#111111]/70 truncate mt-0.5">
                    Data analysis, PRD, prototype, APIs, system design, and AI mock rubrics.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center self-start sm:self-auto">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#188ab2] group-hover:bg-[#0f6f8f] text-white text-xs font-black uppercase border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111] group-hover:shadow-[3px_3px_0px_0px_#111111] transition-all pointer-events-none"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Get Full Brochure ➜</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* 9. WHY THIS IS DIFFERENT (Matching Is PM-X For You Layout: Left Card with ✓, Right Canvas with ✕) */}
        <section className="py-20 bg-white border-b-2 border-[#111111]">
          <div className="container mx-auto px-6 max-w-5xl">
            
            {/* Centered Heading */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-3 tracking-tight">
                Why this is{' '}
                <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-3.5 py-0.5 rotate-[1.5deg] shadow-[2.5px_2.5px_0px_0px_#111111]">
                  different.
                </span>
              </h2>
            </div>

            {/* Seamless Side-by-Side Comparison Container */}
            <div className="relative max-w-5xl mx-auto text-left">
              {/* Soft Slate Card for Left Column (PM-X by StepSmart) */}
              <div className="hidden md:block absolute top-0 bottom-0 left-0 w-1/2 bg-slate-50 rounded-2xl shadow-sm border border-black/5 pointer-events-none" />

              <div className="relative z-10 py-4 sm:py-6">
                {/* Header Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-2">
                  <div className="py-4 sm:py-5 px-6 sm:px-10 border-b border-[#111111]/10 flex items-center justify-between">
                    <span className="text-xs font-mono font-black tracking-widest text-[#111111] uppercase">
                      PM-X BY STEPSMART
                    </span>
                    <span className="bg-[#FFF3A7] text-[#111111] text-[10px] font-mono font-black px-2 py-0.5 uppercase tracking-wider border border-[#111111]/20">
                      PROVEN
                    </span>
                  </div>
                  <div className="py-4 sm:py-5 px-4 sm:px-8 border-b border-[#111111]/15">
                    <span className="text-xs font-mono font-black tracking-widest text-[#111111]/65 uppercase block">
                      MOST PM COURSES
                    </span>
                  </div>
                </div>

                {/* Paired Rows: Generous Vertical Spacing & Guaranteed Horizontal Alignment */}
                {[
                  {
                    pmx: "Small batch, 30 seats",
                    others: "Hundreds of students"
                  },
                  {
                    pmx: "24 live classes, 48 live hours",
                    others: "Videos only"
                  },
                  {
                    pmx: "Real production project portfolios",
                    others: "Generic templates"
                  },
                  {
                    pmx: "Live practice classes & question banks",
                    others: "No mock interviews"
                  },
                  {
                    pmx: "Chat doubt support & 3 months of job board",
                    others: "Support ends at payment"
                  }
                ].map((item, idx, arr) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 items-center">
                    {/* Left Column: PM-X by StepSmart (Inside White Card with ✓) */}
                    <div className="py-6 sm:py-7 px-6 sm:px-10 text-sm sm:text-base font-bold text-[#111111] flex items-center gap-4">
                      <span className="text-[#188ab2] font-black text-base shrink-0">✓</span>
                      <span>{item.pmx}</span>
                    </div>
                    {/* Right Column: Most PM Courses (Canvas with Hairline Divider with ✕) */}
                    <div className={`py-6 sm:py-7 px-4 sm:px-8 text-sm sm:text-base font-bold text-[#111111]/70 flex items-center gap-4 ${idx !== arr.length - 1 ? 'border-b border-[#111111]/10' : ''}`}>
                      <span className="text-red-500 font-black text-base shrink-0">✕</span>
                      <span>{item.others}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 10. LEARN FROM WORKING PMS (Mentors) */}
        <section id="mentors" className="py-20 bg-slate-50 border-b-2 border-[#111111] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-5xl">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-3 tracking-tight">
                Learn from{' '}
                <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-3.5 py-0.5 rotate-[-1deg] shadow-[2.5px_2.5px_0px_0px_#111111]">
                  working PMs
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              
              {/* Sanket */}
              <div className="bg-white border-2 border-[#111111] p-8 shadow-[5px_5px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#111111] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full border-2 border-[#111111] overflow-hidden bg-[#188ab2] shadow-[2.5px_2.5px_0px_0px_#111111] shrink-0">
                      <img src="/mentor-sanket.webp" alt="Sanket" className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#111111]">Sanket</h3>
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
                  <p className="font-medium text-sm text-[#111111]/85 leading-relaxed">
                    Expert in behavioral interviews and product sense frameworks, with deep specialization in scaling fintech products for the global market.
                  </p>
                </div>
              </div>

              {/* Ankit */}
              <div className="bg-white border-2 border-[#111111] p-8 shadow-[5px_5px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#111111] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full border-2 border-[#111111] overflow-hidden bg-[#188ab2] shadow-[2.5px_2.5px_0px_0px_#111111] shrink-0">
                      <img src="/mentor-ankit.webp" alt="Ankit" className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#111111]">Ankit</h3>
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
                  <p className="font-medium text-sm text-[#111111]/85 leading-relaxed">
                    Leads enterprise-grade AI product development at Microsoft. Expert at turning ambiguity into clarity for complex product strategy, with a focus on scaling AI-native products from 0 to 1.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 11. REAL PEOPLE. REAL TRANSITIONS. (From Attached HTML) */}
        <section id="outcomes" className="py-20 bg-white border-b-2 border-[#111111] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-7xl">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-3 tracking-tight">
                Real people.{' '}
                <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-3.5 py-0.5 rotate-[1.5deg] shadow-[2.5px_2.5px_0px_0px_#111111]">
                  Real transitions.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              
              {/* Triya */}
              <div className="bg-white border-2 border-[#111111] p-6 shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#188ab2] text-white border-2 border-[#111111] grid place-items-center font-black text-lg mb-4 shadow-[2px_2px_0px_0px_#111111]">
                    T
                  </div>
                  <p className="font-medium text-sm text-[#111111]/90 leading-relaxed mb-6 italic">
                    “PM-X gave me the clarity and confidence I needed to make the transition.”
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-slate-100">
                  <b className="block text-[#111111] text-sm font-black">Triya</b>
                  <small className="text-[#111111]/70 font-medium text-xs block">Business Analyst → PM at ACKO</small>
                </div>
              </div>

              {/* Nishant */}
              <div className="bg-white border-2 border-[#111111] p-6 shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#188ab2] text-white border-2 border-[#111111] grid place-items-center font-black text-lg mb-4 shadow-[2px_2px_0px_0px_#111111]">
                    N
                  </div>
                  <p className="font-medium text-sm text-[#111111]/90 leading-relaxed mb-6 italic">
                    “From zero interview calls to landing a PM internship in under a month.”
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-slate-100">
                  <b className="block text-[#111111] text-sm font-black">Nishant</b>
                  <small className="text-[#111111]/70 font-medium text-xs block">Student → APM Intern, Surepass</small>
                </div>
              </div>

              {/* Gauri T. */}
              <div className="bg-white border-2 border-[#111111] p-6 shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#188ab2] text-white border-2 border-[#111111] grid place-items-center font-black text-lg mb-4 shadow-[2px_2px_0px_0px_#111111]">
                    G
                  </div>
                  <p className="font-medium text-sm text-[#111111]/90 leading-relaxed mb-6 italic">
                    “Watching peers articulate product thinking made me believe I could become a PM.”
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-slate-100">
                  <b className="block text-[#111111] text-sm font-black">Gauri T.</b>
                  <small className="text-[#111111]/70 font-medium text-xs block">Product Manager</small>
                </div>
              </div>

              {/* Nishtha */}
              <div className="bg-white border-2 border-[#111111] p-6 shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#188ab2] text-white border-2 border-[#111111] grid place-items-center font-black text-lg mb-4 shadow-[2px_2px_0px_0px_#111111]">
                    N
                  </div>
                  <p className="font-medium text-sm text-[#111111]/90 leading-relaxed mb-6 italic">
                    “PM-X helped me break overwhelming case studies into clear, actionable chunks.”
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-slate-100">
                  <b className="block text-[#111111] text-sm font-black">Nishtha</b>
                  <small className="text-[#111111]/70 font-medium text-xs block">Product Manager, Amex</small>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 12. IS PM-X FOR YOU? (Seamless Paired-Row Comparison - Guaranteed Side-by-Side Alignment) */}
        <section className="py-20 bg-slate-50 border-b-2 border-[#111111]">
          <div className="container mx-auto px-6 max-w-5xl">
            
            {/* Centered Heading */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-3 tracking-tight">
                Is PM-X{' '}
                <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-3.5 py-0.5 rotate-[1.5deg] shadow-[2.5px_2.5px_0px_0px_#111111]">
                  for you?
                </span>
              </h2>
            </div>

            {/* Seamless Side-by-Side Comparison Container */}
            <div className="relative max-w-5xl mx-auto text-left">
              {/* Soft neutral background card for the left column */}
              <div className="hidden md:block absolute top-0 bottom-0 left-0 w-1/2 bg-white rounded-2xl shadow-sm border border-black/5 pointer-events-none" />

              <div className="relative z-10 py-4 sm:py-6">
                {/* Header Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-2">
                  <div className="py-4 sm:py-5 px-6 sm:px-10 border-b border-[#111111]/10 flex items-center justify-between">
                    <span className="text-xs font-mono font-black tracking-widest text-[#111111] uppercase">
                      THIS IS FOR YOU IF
                    </span>
                    <span className="bg-[#FFF3A7] text-[#111111] text-[10px] font-mono font-black px-2 py-0.5 uppercase tracking-wider border border-[#111111]/20">
                      IDEAL FIT
                    </span>
                  </div>
                  <div className="py-4 sm:py-5 px-4 sm:px-8 border-b border-[#111111]/15">
                    <span className="text-xs font-mono font-black tracking-widest text-[#111111]/65 uppercase block">
                      THIS ISN’T FOR YOU IF
                    </span>
                  </div>
                </div>

                {/* Paired Rows: Generous Vertical Spacing & Guaranteed Horizontal Alignment */}
                {[
                  {
                    left: "You want to move into product management",
                    right: "You’re looking for a shortcut"
                  },
                  {
                    left: "You want mentorship, not just content",
                    right: "You want passive learning"
                  },
                  {
                    left: "You’re ready to learn by doing",
                    right: "You won’t do the assignments"
                  },
                  {
                    left: "You can give about 6 live hours a week plus assignments",
                    right: "You want a placement guarantee. We don’t offer one, just structured preparation."
                  }
                ].map((item, idx, arr) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 items-start">
                    {/* Left Column (Inside Soft Card, Generous Spacing) */}
                    <div className="py-6 sm:py-7 px-6 sm:px-10 text-sm sm:text-base font-bold text-[#111111] flex items-start gap-4">
                      <span className="text-[#188ab2] font-black text-base shrink-0 mt-0.5">✓</span>
                      <span>{item.left}</span>
                    </div>
                    {/* Right Column (Canvas with Hairline Divider, Generous Spacing) */}
                    <div className={`py-6 sm:py-7 px-4 sm:px-8 text-sm sm:text-base font-bold text-[#111111]/70 flex items-start gap-4 ${idx !== arr.length - 1 ? 'border-b border-[#111111]/10' : ''}`}>
                      <span className="text-red-500 font-black text-base shrink-0 mt-0.5">✕</span>
                      <span>{item.right}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 13. WHAT YOU GET, STACKED (Full Cohort Pricing from Attached HTML) */}
        <section id="pricing" className="py-20 bg-white border-b-2 border-[#111111] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            
            <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-3 tracking-tight">
              What you get,{' '}
              <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-3.5 py-0.5 rotate-[1.5deg] shadow-[2.5px_2.5px_0px_0px_#111111]">
                stacked
              </span>
            </h2>
            <p className="text-base font-medium text-[#111111]/80 mb-12">
              Everything is live and mentor-led. Nothing here is a video library.
            </p>

            {/* Stacked Value Breakdown Table */}
            <div className="bg-white border-2 border-[#111111] shadow-[6px_6px_0px_0px_#111111] overflow-hidden text-left mb-6">
              <div className="divide-y-2 border-slate-100 text-xs sm:text-sm text-[#111111]">
                <div className="flex justify-between items-center p-5 sm:p-6">
                  <div>
                    <b className="text-[#111111] block text-base font-black">Learn</b>
                    <span className="text-[#111111]/75 text-xs font-medium">8 live classes (16 hrs, Wednesday), pre-recorded modules, assignments, PM Gym</span>
                  </div>
                  <span className="font-mono font-black text-[#111111] text-base">₹10,000</span>
                </div>

                <div className="flex justify-between items-center p-5 sm:p-6">
                  <div>
                    <b className="text-[#111111] block text-base font-black">Build</b>
                    <span className="text-[#111111]/75 text-xs font-medium">8 live classes (16 hrs, Sunday), one real project, resume and LinkedIn</span>
                  </div>
                  <span className="font-mono font-black text-[#111111] text-base">₹5,000</span>
                </div>

                <div className="flex justify-between items-center p-5 sm:p-6">
                  <div>
                    <b className="text-[#111111] block text-base font-black">Practice</b>
                    <span className="text-[#111111]/75 text-xs font-medium">8 live classes (16 hrs, Saturday), interview question banks, mock rounds</span>
                  </div>
                  <span className="font-mono font-black text-[#111111] text-base">₹5,000</span>
                </div>

                <div className="flex justify-between items-center p-5 sm:p-6">
                  <div>
                    <b className="text-[#111111] block text-base font-black">Career and support</b>
                    <span className="text-[#111111]/75 text-xs font-medium">Job board for 3 months, certificate, class recordings, chat doubt support</span>
                  </div>
                  <span className="font-mono font-black text-[#188ab2] text-xs uppercase bg-[#e0f2fe] border-2 border-[#111111] px-2 py-0.5">
                    Included
                  </span>
                </div>

                <div className="flex justify-between items-center p-5 sm:p-6 bg-slate-50">
                  <span className="text-[#111111] font-black">Bought separately</span>
                  <span className="font-mono font-bold text-slate-400 line-through">₹20,000</span>
                </div>

                <div className="flex justify-between items-center p-6 bg-[#e6f1fb] border-t-2 border-[#111111]">
                  <div>
                    <b className="text-[#111111] text-lg sm:text-xl block font-black">Your price</b>
                    <span className="text-[#188ab2] text-xs font-mono font-black uppercase">Early bird until 31 October</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-slate-400 line-through font-bold block font-mono">₹20,000</span>
                    <span className="text-3xl font-mono font-black text-[#111111]">
                      {isEarlyBird ? '₹15,000' : '₹20,000'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 text-center border-t-2 border-[#111111] bg-white">
                <button
                  onClick={handleMainEnroll}
                  className="w-full sm:w-auto px-12 py-5 font-black text-base sm:text-lg uppercase border-2 border-[#111111] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#111111] transition-all cursor-pointer"
                >
                  Reserve my seat for {isEarlyBird ? '₹15,000' : '₹20,000'} ➜
                </button>
                <p className="text-xs font-bold text-[#111111]/80 mt-4">
                  One-time payment, GST included, no EMI. 30 seats strictly capped.
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => scrollToSection('modular')}
                    className="text-xs font-black text-[#188ab2] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Only need Build or Practice? Choose modular options below ⬇</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ONLY NEED ONE PIECE? (Image 1: Modular Unbundling Section) */}
            <div id="modular" className="mt-16 pt-12 border-t-2 border-dashed border-[#111111]/30 scroll-mt-20">
              
              {/* Header Pill */}
              <div className="inline-block mb-4">
                <span className="bg-white border-2 border-[#111111] px-4 py-1 font-mono font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#111111] inline-block select-none">
                  MODULAR UNBUNDLING
                </span>
              </div>

              {/* Title with Signature Yellow Highlighter Box */}
              <h3 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight mb-3">
                Only need{' '}
                <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-3.5 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_#111111] select-none">
                  one piece?
                </span>
              </h3>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm font-semibold text-[#111111]/80 max-w-xl mx-auto mb-10 leading-relaxed">
                ₹5,000 each, no early bird. 20 seats across both. PM Gym and class recordings included, no certificate.
              </p>

              {/* Two Modular Options Side-by-Side */}
              <div className="grid md:grid-cols-2 gap-6 text-left">
                {/* BUILD Card */}
                <div
                  onClick={() => setSelectedBuild(!selectedBuild)}
                  className={`bg-white border-2 border-[#111111] p-6 sm:p-7 shadow-[5px_5px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#111111] transition-all cursor-pointer flex flex-col justify-between select-none ${
                    selectedBuild ? 'ring-2 ring-[#188ab2] bg-sky-50/40' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl sm:text-2xl font-black tracking-tight text-[#111111]">
                        BUILD
                      </h4>
                      <div className={`w-7 h-7 border-2 border-[#111111] flex items-center justify-center font-black transition-colors ${
                        selectedBuild ? 'bg-[#188ab2] text-white' : 'bg-white'
                      }`}>
                        {selectedBuild ? '✓' : ''}
                      </div>
                    </div>

                    <div className="font-mono font-black text-2xl text-[#188ab2] mb-3">
                      ₹5,000
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-[#111111]/80 leading-relaxed">
                      8 live Sunday classes (16 hrs). Build one real project from teardown to prototype, with mentor review, plus your resume and LinkedIn.
                    </p>
                  </div>
                </div>

                {/* PRACTICE Card */}
                <div
                  onClick={() => setSelectedPractice(!selectedPractice)}
                  className={`bg-white border-2 border-[#111111] p-6 sm:p-7 shadow-[5px_5px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#111111] transition-all cursor-pointer flex flex-col justify-between select-none ${
                    selectedPractice ? 'ring-2 ring-[#188ab2] bg-sky-50/40' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl sm:text-2xl font-black tracking-tight text-[#111111]">
                        PRACTICE
                      </h4>
                      <div className={`w-7 h-7 border-2 border-[#111111] flex items-center justify-center font-black transition-colors ${
                        selectedPractice ? 'bg-[#188ab2] text-white' : 'bg-white'
                      }`}>
                        {selectedPractice ? '✓' : ''}
                      </div>
                    </div>

                    <div className="font-mono font-black text-2xl text-[#188ab2] mb-3">
                      ₹5,000
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-[#111111]/80 leading-relaxed">
                      8 live Saturday classes (16 hrs). Mock rounds, your switch story, and interview question banks.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1:1 Mentoring Add-on Full-Width Row */}
              <div
                onClick={() => setSelected1to1(!selected1to1)}
                className={`mt-6 bg-white border-2 border-[#111111] p-4 sm:p-5 shadow-[4px_4px_0px_0px_#111111] flex items-center gap-3 sm:gap-4 cursor-pointer text-left hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] transition-all select-none ${
                  selected1to1 ? 'ring-2 ring-[#188ab2] bg-sky-50/40' : ''
                }`}
              >
                <div className={`w-6 h-6 border-2 border-[#111111] flex items-center justify-center font-black shrink-0 transition-colors ${
                  selected1to1 ? 'bg-[#188ab2] text-white' : 'bg-white'
                }`}>
                  {selected1to1 ? '✓' : ''}
                </div>
                <div className="flex-1 text-xs sm:text-sm font-bold text-[#111111]">
                  Add 1:1 mentoring: 5 dedicated private sessions for ₹5,000. Limited seats, with any option.
                </div>
              </div>

              {/* Dynamic Modular CTA Button */}
              <div className="mt-8">
                {modularTotal > 0 ? (
                  <button
                    onClick={handleModularEnroll}
                    className="w-full sm:w-auto px-10 py-4 font-black uppercase text-xs sm:text-sm border-2 border-[#111111] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#111111] transition-all cursor-pointer"
                  >
                    Enroll in {modularLabel} for ₹{modularTotal.toLocaleString('en-IN')} ➜
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full sm:w-auto px-10 py-4 font-black uppercase text-xs sm:text-sm border-2 border-[#111111]/30 bg-[#F1F3F5] text-[#111111]/40 shadow-[4px_4px_0px_0px_#111111]/20 cursor-not-allowed select-none"
                  >
                    SELECT BUILD OR PRACTICE ABOVE TO CONTINUE
                  </button>
                )}
              </div>

              {/* Navigation Back Link */}
              <div className="mt-6">
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-xs sm:text-sm font-bold text-[#111111] underline hover:text-[#188ab2] cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Looking for the full 8-week cohort instead? Jump to full cohort details & pricing ↑</span>
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 14. SMALL BATCHES, BY CHOICE (Moved Here Right Before How to Join As Requested) */}
        <section className="py-20 bg-slate-50 border-b-2 border-[#111111]">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            
            <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-3 tracking-tight">
              Small batches,{' '}
              <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-3.5 py-0.5 rotate-[1.5deg] shadow-[2.5px_2.5px_0px_0px_#111111]">
                by choice
              </span>
            </h2>
            <p className="text-base font-medium text-[#111111]/80 mb-12 max-w-lg mx-auto">
              We cap every batch on purpose, so every project gets real 1:1 mentor feedback.
            </p>

            <div className="bg-white border-2 border-[#111111] p-8 shadow-[5px_5px_0px_0px_#111111]">
              {/* Bar Chart Matching Attached HTML */}
              <div className="h-48 border-b-2 border-[#111111] flex items-end justify-center gap-6 sm:gap-12 px-4 pb-0">
                <div className="flex-1 max-w-[100px] flex flex-col justify-end h-full text-center">
                  <div className="bg-[#188ab2] text-white border-2 border-[#111111] font-mono font-black text-sm py-1 shadow-[2px_2px_0px_0px_#111111]" style={{ height: '20%' }}>
                    6
                  </div>
                </div>
                <div className="flex-1 max-w-[100px] flex flex-col justify-end h-full text-center">
                  <div className="bg-[#188ab2] text-white border-2 border-[#111111] font-mono font-black text-sm py-1 shadow-[2px_2px_0px_0px_#111111]" style={{ height: '20%' }}>
                    6
                  </div>
                </div>
                <div className="flex-1 max-w-[100px] flex flex-col justify-end h-full text-center">
                  <div className="bg-[#188ab2] text-white border-2 border-[#111111] font-mono font-black text-sm py-1 shadow-[2px_2px_0px_0px_#111111]" style={{ height: '50%' }}>
                    15
                  </div>
                </div>
                <div className="flex-1 max-w-[100px] flex flex-col justify-end h-full text-center">
                  <div className="bg-[#FFF3A7] text-[#111111] border-2 border-dashed border-[#111111] font-mono font-black text-xs sm:text-sm py-1 shadow-[2px_2px_0px_0px_#111111] flex items-center justify-center" style={{ height: '100%' }}>
                    30 (MAX)
                  </div>
                </div>
              </div>

              {/* Labels Row */}
              <div className="flex justify-center gap-6 sm:gap-12 px-4 pt-3 font-mono font-black text-xs sm:text-sm text-[#111111]">
                <span className="flex-1 max-w-[100px] text-center">Batch 1</span>
                <span className="flex-1 max-w-[100px] text-center">Batch 2</span>
                <span className="flex-1 max-w-[100px] text-center">Batch 3</span>
                <span className="flex-1 max-w-[100px] text-center text-[#188ab2]">Next batch</span>
              </div>

              <p className="font-bold text-[#111111]/85 mt-8 text-sm">
                Students per batch. Next batch: 30 seats, not one more.
              </p>
            </div>

          </div>
        </section>

        {/* 15. HOW TO JOIN (Exact Live Site Neobrutalist Design Matching Image 1) */}
        <section className="py-20 bg-white border-b-2 border-[#111111]">
          <div className="container mx-auto px-6 max-w-7xl">
            
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-[#111111] mb-4 tracking-tight">
                How to{' '}
                <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[2.5px_2.5px_0px_0px_#111111] select-none">
                  join?
                </span>
              </h2>
              <p className="text-base sm:text-lg font-medium text-[#111111]/80 mt-4">
                No automated gateways, no automated rejections. We screen for alignment at every step.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-8 items-stretch text-left mt-8">
              {[
                {
                  num: "01",
                  title: "Apply Online",
                  desc: "Choose a cohort track and complete your application form.",
                  shadow: "shadow-[4px_4px_0px_0px_#111111]",
                  tilt: "rotate-[-1deg]"
                },
                {
                  num: "02",
                  title: "Message Us on WhatsApp",
                  desc: "Drop us a message with your background and goals.",
                  shadow: "shadow-[4px_4px_0px_0px_#111111]",
                  tilt: "rotate-[2deg]",
                  action: (
                    <div className="mt-4">
                      <a
                        href="https://wa.me/message/GH5C7YLAYIEHN1"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block bg-[#188ab2] text-white border-2 border-[#111111] px-3 py-1 font-mono font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_0px_#111111] transition-all cursor-pointer select-none"
                      >
                        CHAT WITH US →
                      </a>
                      <div className="mt-3 inline-block bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2 py-0.5 font-mono font-bold text-[8px] uppercase rotate-[-2deg] shadow-[1px_1px_0px_0px_#111111]">
                        REPLIES WITHIN A FEW HOURS / NO COMMITMENT
                      </div>
                    </div>
                  )
                },
                {
                  num: "03",
                  title: "Get Decision",
                  desc: "We confirm fit over WhatsApp and follow up with your application status and next steps.",
                  shadow: "shadow-[4px_4px_0px_0px_#111111]",
                  tilt: "rotate-[-1.5deg]"
                },
                {
                  num: "04",
                  title: "Batch Starts",
                  desc: "Secure your slot. Onboarding details are shared over WhatsApp before the cohort begins.",
                  shadow: "shadow-[4px_4px_0px_0px_#111111]",
                  tilt: "rotate-[1deg]"
                },
                {
                  num: "05",
                  title: "Lifetime Access",
                  desc: "Join our active alumni network",
                  shadow: "shadow-[4px_4px_0px_0px_#111111]",
                  tilt: "rotate-[-2deg]"
                }
              ].map((step, i) => (
                <div 
                  key={i} 
                  className={`bg-white border-2 border-[#111111] p-6 pt-10 ${step.shadow} flex flex-col justify-between h-full relative hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] transition-all duration-100 select-none`}
                >
                  {/* Number Badge (Tilted Floating Block Exactly Matching Image 1) */}
                  <div className={`absolute -top-3.5 -left-3.5 bg-[#188ab2] text-white border-2 border-[#111111] w-8 h-8 flex items-center justify-center font-mono font-black text-xs shadow-[2px_2px_0px_0px_#111111] ${step.tilt}`}>
                    {step.num}
                  </div>
                  
                  <div>
                    <h3 className="font-black text-lg text-[#111111] mb-2">{step.title}</h3>
                    <p className="text-xs text-[#111111]/80 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                  
                  {step.action && step.action}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 16. QUESTIONS, ANSWERED (The 8 FAQs from Attached HTML) */}
        <section id="faq" className="py-20 bg-slate-50 border-b-2 border-[#111111] scroll-mt-20">
          <div className="container mx-auto px-6 max-w-4xl">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-3 tracking-tight">
                Questions,{' '}
                <span className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-3.5 py-0.5 rotate-[-1deg] shadow-[2.5px_2.5px_0px_0px_#111111]">
                  answered
                </span>
              </h2>
            </div>

            {/* Minimal Editorial Single-Line Separator Layout for FAQs */}
            <div className="border-t border-b border-[#111111]/30 divide-y divide-[#111111]/30 text-left bg-transparent">
              {[
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
              ].map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="transition-colors hover:bg-black/[0.02]">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full py-5 px-1 sm:px-3 flex items-center justify-between text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 flex-1 pr-4">
                        <span className="font-mono text-xs font-black text-[#188ab2] shrink-0">
                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <span className="font-black text-base sm:text-lg text-[#111111] group-hover:text-[#188ab2] transition-colors tracking-tight">
                          {faq.q}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-[#111111] stroke-[2.5] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#188ab2]' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="pb-6 pt-1 px-1 sm:px-3 pl-8 sm:pl-10 font-medium text-xs sm:text-sm text-[#111111]/85 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* 17. FINAL CONVERSION CARD (From Attached HTML) */}
        <section className="py-20 bg-white border-b-2 border-[#111111]">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            
            <div className="bg-[#FFF3A7] border-2 border-[#111111] p-10 sm:p-14 shadow-[6px_6px_0px_0px_#111111] text-center">
              <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-2 leading-tight tracking-tight">
                Your seat, your project,{' '}
                <span className="underline decoration-[#188ab2] decoration-[4px]">your price</span>
              </h2>
              <p className="text-base font-black text-[#111111] mb-8 font-mono">
                {countdownText}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <button
                  onClick={handleMainEnroll}
                  className="w-full sm:w-auto px-10 py-5 font-black text-base sm:text-lg uppercase border-2 border-[#111111] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#111111] transition-all cursor-pointer"
                >
                  Reserve my seat for {isEarlyBird ? '₹15,000' : '₹20,000'} ➜
                </button>
                <a
                  href="https://wa.me/message/GH5C7YLAYIEHN1"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-8 py-5 font-black text-base sm:text-lg uppercase border-2 border-[#111111] bg-white hover:bg-[#fef08a] text-[#111111] shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#111111] transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>Talk to us on WhatsApp</span>
                </a>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-[#111111]/20">
                <button
                  onClick={() => {
                    setBrochureFormStatus('idle');
                    setIsBrochureModalOpen(true);
                  }}
                  className="font-black text-sm text-[#111111] underline hover:text-[#188ab2] transition-colors cursor-pointer inline-flex items-center gap-2"
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
      <footer className="bg-white py-12 text-center text-xs font-bold text-[#111111]/80">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-4">
            <span className="font-black text-[#111111] text-sm">StepSmart Fellowship</span> · admin@stepsmart.net · stepsmart.net
          </div>
          <div>No placement guarantee. Structured preparation &amp; verifiable proof of work.</div>
        </div>
      </footer>

      {/* 20. POP-UP BROCHURE MODAL */}
      {isBrochureModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#111111]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border-2 border-[#111111] p-6 sm:p-8 shadow-[8px_8px_0px_0px_#111111] relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsBrochureModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 border-2 border-[#111111] bg-white hover:bg-[#FFF3A7] flex items-center justify-center font-black text-base shadow-[2px_2px_0px_0px_#111111] cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            {brochureFormStatus === 'success' ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#C6F6D5] border-2 border-[#111111] flex items-center justify-center mx-auto mb-5 shadow-[3px_3px_0px_0px_#111111]">
                  <Check className="w-9 h-9 text-green-800 stroke-[3]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#111111] mb-2 tracking-tight">
                  Brochure on its way!
                </h3>
                <p className="text-sm font-medium text-[#111111]/85 mb-6">
                  Your PM-X Accelerator Brochure download has started automatically.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => startBrochureDownload(false)}
                    className="w-full py-3.5 border-2 border-[#111111] bg-[#FFF3A7] font-black text-sm uppercase shadow-[3px_3px_0px_0px_#111111] hover:bg-[#ffe566] transition-colors cursor-pointer"
                  >
                    Click here if download didn't start ➜
                  </button>
                  <button
                    onClick={() => setIsBrochureModalOpen(false)}
                    className="w-full py-2.5 border-2 border-[#111111] bg-white font-black text-xs uppercase shadow-[2px_2px_0px_0px_#111111] hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 text-left">
                  <span className="bg-[#FFF3A7] border-2 border-[#111111] px-3 py-0.5 text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_#111111] rotate-[-1deg] inline-block mb-3">
                    ★ OFFICIAL SYLLABUS
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#111111] mb-2 leading-tight tracking-tight">
                    Download Full 8-Week Brochure
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#111111]/80 leading-relaxed">
                    Get instant access to the complete week-by-week timetable, real project deliverables, live class schedule, and mentor review rubric.
                  </p>
                </div>

                <form onSubmit={handleBrochureSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-mono font-black text-[#111111] uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={brochureFormData.name}
                      onChange={(e) => setBrochureFormData({ ...brochureFormData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-3 border-2 border-[#111111] font-medium text-sm bg-white shadow-[2px_2px_0px_0px_#111111] focus:outline-none focus:bg-amber-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-black text-[#111111] uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={brochureFormData.email}
                      onChange={(e) => setBrochureFormData({ ...brochureFormData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full p-3 border-2 border-[#111111] font-medium text-sm bg-white shadow-[2px_2px_0px_0px_#111111] focus:outline-none focus:bg-amber-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-black text-[#111111] uppercase mb-1">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={brochureFormData.phone}
                      onChange={(e) => setBrochureFormData({ ...brochureFormData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full p-3 border-2 border-[#111111] font-medium text-sm bg-white shadow-[2px_2px_0px_0px_#111111] focus:outline-none focus:bg-amber-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-black text-[#111111] uppercase mb-1">
                      Current Background
                    </label>
                    <select
                      value={brochureFormData.currentRole}
                      onChange={(e) => setBrochureFormData({ ...brochureFormData, currentRole: e.target.value })}
                      className="w-full p-3 border-2 border-[#111111] font-medium text-sm bg-white shadow-[2px_2px_0px_0px_#111111] focus:outline-none"
                    >
                      <option value="Software Engineer / Developer">Software Engineer / Developer</option>
                      <option value="Business Analyst / Consultant">Business Analyst / Consultant</option>
                      <option value="QA / Operations / Product Operations">QA / Operations / Product Operations</option>
                      <option value="Undergraduate / Postgrad Student">Undergraduate / Postgrad Student</option>
                      <option value="Other">Other Role</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={brochureFormStatus === 'loading'}
                    className="w-full py-4 border-2 border-[#111111] bg-[#188ab2] hover:bg-[#0f6f8f] text-white font-black text-sm uppercase shadow-[3px_3px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>{brochureFormStatus === 'loading' ? 'Preparing Download...' : 'Download Curriculum PDF ➜'}</span>
                  </button>

                  <p className="text-[11px] font-medium text-[#111111]/70 text-center mt-2">
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
