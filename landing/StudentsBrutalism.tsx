import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Mail,
  Loader2,
  Menu,
  X,
  Calendar,
  Briefcase,
  Users,
  ExternalLink,
  FileText,
  FolderArchive,
  Wrench,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Trophy,
  Sparkles,
  TrendingUp,
  Compass,
  Lightbulb,
  Laptop,
  Target,
  Cpu
} from 'lucide-react';
import {
  Logo,
  Button,
  NavLink,
  db,
  appId,
  enrollmentSchema,
  saveLeadToDemoDB,
  sanketPhotoSrc,
  ankitPhotoSrc,
  pankajPhotoSrc,
  brochurePdfSrc,
  startBrochureDownload,
  AnnouncementBanner
} from './AppBrutalism';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const roadmapSteps = [
  {
    title: "PM Intro & Skills Mapping",
    desc: "Week in Life of a PM, Intro to Mentors, PM Interviews",
    Icon: Sparkles
  },
  {
    title: "Product Fundamentals",
    desc: "Systems Thinking, Context Understanding, Tech Stack Basics",
    Icon: BookOpen
  },
  {
    title: "Business & Market Viability",
    desc: "Unit Economics, Market Research, Guesstimate frameworks",
    Icon: TrendingUp
  },
  {
    title: "User Research & Segmentation",
    desc: "Segmentation, User Value, Root Cause Analysis (RCA)",
    Icon: Users
  },
  {
    title: "Personas & Customer Journeys",
    desc: "Customer Journeys, Research Synthesis, Product Design",
    Icon: Compass
  },
  {
    title: "Solution Space & Ideation",
    desc: "Prioritization matrices, Solution Space, Product Strategy",
    Icon: Lightbulb
  },
  {
    title: "Tech Architectures & UX/UI",
    desc: "Go-To-Market (GTM) Strategy, UX/UI layouts, Prototyping",
    Icon: Laptop
  },
  {
    title: "Metrics & Data Analytics",
    desc: "Data Driven Decisions, A/B Testing, Product Metrics",
    Icon: Target
  },
  {
    title: "AI PM Fundamentals",
    desc: "Prompt Engineering, RAG architectures, LLM fine-tuning",
    Icon: Cpu
  },
  {
    title: "Portfolio & Placement Prep",
    desc: "Resume / PRD Portfolio reviews, Mock Interviews, Referrals",
    Icon: Trophy,
    bg: "bg-[#FFF3A7]"
  }
];

export function StudentsLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState('idle');
  const [formIntent, setFormIntent] = useState('enroll');
  const navigate = useNavigate();


  useEffect(() => {
    const trackVisit = async () => {
      try {
        if (db) {
          const analyticsRef = collection(db, 'artifacts', appId, 'public', 'data', 'analytics');
          await addDoc(analyticsRef, {
            page: 'students_landing_page',
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent
          });
        }
      } catch (e) {
        console.error("Analytics failed", e);
      }
    };
    trackVisit();
  }, []);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: { intent: 'enroll' }
  });

  const completeLeadSubmission = (intent: string) => {
    setEnrollmentStatus('success');
    if (intent === 'brochure') {
      setTimeout(() => {
        startBrochureDownload();
      }, 1000);
      return;
    }
  };

  const onSubmit = async (data: any) => {
    setEnrollmentStatus('loading');
    saveLeadToDemoDB(data);

    try {
      const res = await fetch(
        'https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.fullName,
            email: data.email,
            phone: data.phone,
            masterclassId: 'pm-x-speedup-students',
          }),
        }
      );

      if (!res.ok) throw new Error('Enrollment failed');
      completeLeadSubmission(data.intent);
    } catch (err) {
      setEnrollmentStatus('error');
    }
  };

  const handleActionClick = (intent: string) => {
    setFormIntent(intent);
    setValue('intent', intent as any);
    const element = document.getElementById('student-form-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMobileLinkClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#111111] selection:bg-[#188ab2]/30">
      {/* Navbar Wrapper */}
      <div className="fixed top-0 z-50 w-full flex flex-col">
        <AnnouncementBanner />
        <nav className="w-full bg-[#FFFFFF] border-b-[3px] border-[#111111]">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Logo toHome={true} />
            <div className="hidden md:flex items-center gap-8 text-sm font-extrabold text-[#111111]">
              <NavLink href="#why-speedup">Why First Step?</NavLink>
              <NavLink href="#student-benefits">Cohort Perks</NavLink>
              <NavLink href="#mentors">Mentors</NavLink>
              <Link to="/events" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Events</Link>
              <Link to="/blog" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Blog</Link>
              <a href="/learn" className="ml-2 px-5 py-2 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all select-none font-extrabold">Login</a>
              <Button variant="primary" className="px-5 py-2 text-sm" onClick={() => document.getElementById('enroll-student')?.scrollIntoView({ behavior: 'smooth' })}>
                Apply Now
              </Button>
            </div>
            <button className="md:hidden p-2 border-[3px] border-[#111111] bg-[#FFFFFF]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6 text-[#111111]" /> : <Menu className="h-6 w-6 text-[#111111]" />}
            </button>
          </div>
        </nav>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden w-full bg-[#FFFFFF] border-b-[3px] border-[#111111] p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
            <a href="#why-speedup" onClick={(e) => handleMobileLinkClick(e, 'why-speedup')} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Why First Step?</a>
            <a href="#student-benefits" onClick={(e) => handleMobileLinkClick(e, 'student-benefits')} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Cohort Perks</a>
            <a href="#mentors" onClick={(e) => handleMobileLinkClick(e, 'mentors')} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Mentors</a>
            <Link to="/events" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Events</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Blog</Link>
            <a href="/learn" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-6 py-2.5 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] font-extrabold transition-all">Login</a>
            <Button variant="primary" className="w-full px-5 py-2 text-sm" onClick={() => { setIsMenuOpen(false); handleActionClick('enroll'); }}>Apply Now</Button>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-8 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          {/* Badge for Student Edition */}
          <div className="mb-6 inline-block">
            <span className="bg-[#FFF3A7] text-[#111111] border-[3px] border-[#111111] px-4 py-1.5 font-extrabold text-xs md:text-sm uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] rotate-[-1deg] inline-flex items-center gap-2 select-none">
              <GraduationCap className="h-4 w-4" /> PM-X First Step - The placement edition
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-12 leading-[1.2] text-[#111111]">
            Go From "will I even get shortlisted" to{' '}
            <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-1 rotate-[1.5deg] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] select-none">
              PM placement-ready
            </span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto select-none mb-12">
            {[
              { src: "/student-comic-1.jpg", alt: "Placement prep confusion" },
              { src: "/student-comic-2.jpg", alt: "Mock interviews & case books" },
              { src: "/student-comic-3.jpg", alt: "Discovering PM-X First Step masterclass" }
            ].map((img, idx) => (
              <div 
                key={idx} 
                className="bg-white border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all duration-100 overflow-hidden"
              >
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6 mb-4">
            <Button 
              variant="primary" 
              className="px-12 py-5 text-xl font-extrabold shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]"
              onClick={() => handleActionClick('enroll')}
            >
              Apply for PM-X First Step
            </Button>
            <button 
              onClick={() => handleActionClick('brochure')}
              className="text-[#111111] text-sm font-extrabold underline underline-offset-4 decoration-[#188ab2] decoration-[3px] hover:text-[#188ab2] transition-colors"
            >
              Want to see the student roadmap? Download curriculum.
            </button>
          </div>
        </div>
      </section>

      {/* Why SpeedUp / Who is it for */}
      <section id="why-speedup" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-[#111111] mb-4">Who is PM-X First Step for?</h2>
            <p className="text-lg font-bold text-[#111111]">Tailored exclusively for ambitious college students seeking non-engineering roles.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                label: "Final-Year Students", 
                desc: "Secure high-paying APM offers before graduation.", 
                icon: <GraduationCap className="h-8 w-8 text-[#111111]" />,
                iconTilt: "rotate-[3deg]",
                tag: "Placement Prep",
                tagTilt: "rotate-[-1.5deg]"
              },
              { 
                label: "Pre-Final Year Students", 
                desc: "Crack elite summer product management internships.", 
                icon: <Calendar className="h-8 w-8 text-[#111111]" />,
                iconTilt: "rotate-[-2deg]",
                tag: "Internship Prep",
                tagTilt: "rotate-[2deg]"
              },
              { 
                label: "Recent Graduates", 
                desc: "Bypass the 'need experience to get experience' loop.", 
                icon: <Trophy className="h-8 w-8 text-[#111111]" />,
                iconTilt: "rotate-[-3deg]",
                tag: "Zero Experience",
                tagTilt: "rotate-[1.5deg]"
              }
            ].map((box, i) => (
              <div 
                key={i} 
                className="bg-[#FFFFFF] p-8 border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-between transition-all duration-100 select-none group cursor-pointer"
              >
                <div>
                  <div className={`w-14 h-14 bg-[#188ab2] border-[3px] border-[#111111] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] mb-6 transition-transform duration-100 ${box.iconTilt}`}>
                    {box.icon}
                  </div>
                  
                  <h3 className="font-extrabold text-xl text-[#111111] mb-1">{box.label}</h3>
                  
                  <div className="mb-4 inline-block">
                    <span className={`inline-block bg-[#FFF3A7] text-[#111111] border-[2px] border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none ${box.tagTilt}`}>
                      {box.tag}
                    </span>
                  </div>

                  <p className="text-[#111111] text-xs leading-relaxed font-bold mt-2">{box.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cohort Perks / Student Benefits */}
      <section id="student-benefits" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 items-start text-left">
            {/* Left Sticky Column */}
            <div className="md:w-1/3 md:sticky md:top-28">
              <h2 className="text-4xl md:text-5xl font-black text-[#111111] mb-6 leading-tight">
                <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                  Offerings
                </span>
              </h2>
              <p className="text-lg font-bold text-slate-500 leading-relaxed">
                "PM is a competitive path we won't pretend otherwise. What we can do is make sure you're prepping the right way, so when your shot comes, you're actually ready for it."
              </p>
            </div>

            {/* Right List Column (No outer boxes) */}
            <div className="md:w-2/3 flex flex-col gap-10 select-none">
              {[
                {
                  title: "Product Sense",
                  desc: "Build the underlying thinking — RCA, product design, guesstimates — that every case, deck, and interview round is actually testing. Not frameworks to memorize, but a way of thinking you can apply to anything thrown at you.",
                  icon: <Lightbulb className="h-6 w-6 text-[#188ab2]" />
                },
                {
                  title: "Resume Crafting",
                  desc: "Map your existing skills — technical, analytical, whatever your background — to what PM recruiters are actually screening for. No generic templates, no overloading with things you don't understand.",
                  icon: <FileText className="h-6 w-6 text-[#188ab2]" />
                },
                {
                  title: "Portfolio Building",
                  desc: "Turn \"I have no real experience\" into a credible portfolio of product artifacts — case studies, project breakdowns, decks — that give you something concrete to point to in interviews and PORs.",
                  icon: <BookOpen className="h-6 w-6 text-[#188ab2]" />
                },
                {
                  title: "Interview Preparation",
                  desc: "Go in with an approach, not just a framework. We work through your reasoning process across RCA, product design, and guesstimates until it's second nature — not a script you recite.",
                  icon: <Target className="h-6 w-6 text-[#188ab2]" />
                },
                {
                  title: "Mock & Mentor Interviews",
                  desc: "Practice the actual placement process, not a watered-down version of it. Real mocks, real feedback, from people who've been on both sides of the table.",
                  icon: <Trophy className="h-6 w-6 text-[#188ab2]" />
                },
                {
                  title: "Peer Community",
                  desc: "Case-ing alone is hard. Get matched with a peer group across IITs and IIMs to practice with, get real-time feedback from, and stay accountable through placement season.",
                  icon: <Users className="h-6 w-6 text-[#188ab2]" />
                },
                {
                  title: "Ongoing Support Through the Season",
                  desc: "Not just prep before placements start — direct access to mentors when a surprise round hits, an application question comes up, or you just need a gut-check mid-season.",
                  icon: <Calendar className="h-6 w-6 text-[#188ab2]" />
                }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex gap-6 items-start pb-8 border-b-2 border-[#111111]/10 last:border-b-0"
                >
                  <div className="shrink-0 w-12 h-12 bg-[#FFF3A7] border-[3px] border-[#111111] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#111111] mb-2">{item.title}</h3>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Roadmap */}
      <section id="roadmap" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <style>{`
          .roadmap-scrollbar::-webkit-scrollbar {
            height: 12px;
          }
          .roadmap-scrollbar::-webkit-scrollbar-track {
            background: #FFFFFF;
            border: 3px solid #111111;
          }
          .roadmap-scrollbar::-webkit-scrollbar-thumb {
            background: #188ab2;
            border: 3px solid #111111;
          }
        `}</style>

        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto relative">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
              Your{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[-1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                10-Week PM Roadmap
              </span>
            </h2>
            <p className="text-lg font-bold text-[#111111] mb-6">A step-by-step journey to become a confident and interview-ready Product Manager.</p>
          </div>

          {/* Desktop Scrollable Winding Roadmap */}
          <div className="hidden lg:block overflow-x-auto pb-12 pt-6 roadmap-scrollbar">
            <div className="relative w-[1540px] h-[600px] mx-auto select-none">
              {/* SVG Winding Road Background */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Road Shadow */}
                <path
                  d="M 50,290 C 80,290 100,200 130,200 C 200,200 210,380 270,380 C 330,380 350,200 410,200 C 470,200 490,380 550,380 C 610,380 630,200 690,200 C 750,200 770,380 830,380 C 890,380 910,200 970,200 C 1030,200 1050,380 1110,380 C 1170,380 1190,200 1250,200 C 1310,200 1330,380 1390,380 C 1440,380 1460,290 1510,290"
                  fill="none"
                  stroke="#111111"
                  strokeWidth="28"
                  strokeLinecap="round"
                />
                {/* Road Fill */}
                <path
                  d="M 50,290 C 80,290 100,200 130,200 C 200,200 210,380 270,380 C 330,380 350,200 410,200 C 470,200 490,380 550,380 C 610,380 630,200 690,200 C 750,200 770,380 830,380 C 890,380 910,200 970,200 C 1030,200 1050,380 1110,380 C 1170,380 1190,200 1250,200 C 1310,200 1330,380 1390,380 C 1440,380 1460,290 1510,290"
                  fill="none"
                  stroke="#188ab2"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Dashed Center Stripe */}
                <path
                  d="M 50,290 C 80,290 100,200 130,200 C 200,200 210,380 270,380 C 330,380 350,200 410,200 C 470,200 490,380 550,380 C 610,380 630,200 690,200 C 750,200 770,380 830,380 C 890,380 910,200 970,200 C 1030,200 1050,380 1110,380 C 1170,380 1190,200 1250,200 C 1310,200 1330,380 1390,380 C 1440,380 1460,290 1510,290"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeDasharray="10,12"
                  strokeLinecap="round"
                />
              </svg>

              {/* Steps rendering */}
              {roadmapSteps.map((step, idx) => {
                const isTop = idx % 2 === 0;
                const x = 130 + idx * 140;
                const yRoad = isTop ? 200 : 380;
                
                // Connecting lines from card to road
                const lineStyle = isTop 
                  ? { left: `${x}px`, top: `160px`, height: `40px` }
                  : { left: `${x}px`, top: `380px`, height: `60px` };

                return (
                  <React.Fragment key={idx}>
                    {/* Vertical Connector Line */}
                    <div 
                      className="absolute border-l-[3px] border-dashed border-[#111111] w-0 -translate-x-1/2 pointer-events-none"
                      style={lineStyle}
                    />
                    
                    {/* Map Pin on the road */}
                    <div 
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center bg-white border-[3px] border-[#111111] rounded-full w-8 h-8 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
                      style={{ left: `${x}px`, top: `${yRoad}px` }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-[#188ab2]" />
                    </div>

                    {/* Step Card */}
                    <div 
                      className={`absolute -translate-x-1/2 w-[220px] h-[160px] bg-white border-[3px] border-[#111111] p-4 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-50%] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] transition-all duration-100 flex flex-col justify-between ${step.bg || ''}`}
                      style={{ 
                        left: `${x}px`, 
                        top: isTop ? '0px' : '440px'
                      }}
                    >
                      {/* Week Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-[#188ab2] tracking-wider">WEEK {idx.toString().padStart(2, '0')}</span>
                        {step.Icon && <step.Icon className="h-4.5 w-4.5 text-[#111111]" />}
                      </div>
                      
                      <h3 className="font-extrabold text-[13px] text-[#111111] border-b-2 border-[#111111]/10 pb-1.5 mb-1.5 leading-tight">{step.title}</h3>
                      <p className="text-[10px] font-bold text-[#111111]/70 leading-relaxed line-clamp-3">{step.desc}</p>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Mobile/Tablet: Vertical timeline */}
          <div className="lg:hidden flex flex-col gap-12 max-w-md mx-auto pt-6">
            {roadmapSteps.map((step, idx) => (
              <div key={idx} className="flex gap-6 relative select-none">
                {/* Timeline connector and node */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="bg-white border-[3px] border-[#111111] rounded-full w-10 h-10 flex items-center justify-center font-extrabold text-sm shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] z-10">
                    {idx.toString().padStart(2, '0')}
                  </div>
                  {idx < roadmapSteps.length - 1 && (
                    <div className="w-0 border-l-[3px] border-dashed border-[#111111] grow mt-2 min-h-[60px]" />
                  )}
                </div>

                {/* Content Card */}
                <div className={`grow bg-white border-[3px] border-[#111111] p-5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] rotate-[-0.5deg] ${step.bg || ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase text-[#188ab2] tracking-wider">WEEK {idx.toString().padStart(2, '0')}</span>
                    {step.Icon && <step.Icon className="h-5 w-5 text-[#111111]" />}
                  </div>
                  <h3 className="font-extrabold text-base text-[#111111] border-b-2 border-[#111111]/10 pb-2 mb-2 leading-tight">{step.title}</h3>
                  <p className="text-xs font-bold text-[#111111]/70 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Mentors / Learn from Professionals */}
      <section id="mentors" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 text-center max-w-6xl">
          <h2 className="text-4xl font-extrabold mb-16 text-[#111111]">Learn from Professionals</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Sanket */}
            <div className="bg-[#FFFFFF] border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-6 relative flex flex-col gap-6">
              {/* Headshot in circle with black border */}
              <div className="w-24 h-24 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
                <img
                  src={sanketPhotoSrc}
                  alt="Sanket, Senior Product Manager at Mastercard, PM mentor at StepSmart"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              <div className="flex-1">
                {/* Rotated tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    PM @ Mastercard
                  </span>
                  <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    100+ Mentored
                  </span>
                </div>
                
                <h3 className="text-2xl font-extrabold text-[#111111] mb-1">Sanket</h3>
                <p className="text-[#188ab2] text-xs font-extrabold uppercase tracking-widest mb-4">Senior PM - Mastercard</p>
                <p className="text-sm font-bold text-[#111111] leading-relaxed">
                  Successfully mentored 100+ professionals into high-growth PM roles. Expert in behavioral interviews and product sense frameworks, with deep specialization in scaling fintech products for the global market.
                </p>
              </div>
            </div>

            {/* Ankit */}
            <div className="bg-[#FFFFFF] border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-6 relative flex flex-col gap-6">
              {/* Headshot in circle with black border */}
              <div className="w-24 h-24 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
                <img
                  src={ankitPhotoSrc}
                  alt="Ankit, Product Manager at Microsoft, PM mentor at StepSmart"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              <div className="flex-1">
                {/* Rotated tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    PM 2 @ Microsoft
                  </span>
                  <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    AI Specialist
                  </span>
                </div>
                
                <h3 className="text-2xl font-extrabold text-[#111111] mb-1">Ankit</h3>
                <p className="text-[#188ab2] text-xs font-extrabold uppercase tracking-widest mb-4">Product Manager 2 - Microsoft</p>
                <p className="text-sm font-bold text-[#111111] leading-relaxed">
                  Leads enterprise-grade AI product development at Microsoft. Expert at turning ambiguity into clarity for complex product strategy, with a focus on scaling AI-native products from 0 to 1.
                </p>
              </div>
            </div>

            {/* Pankaj */}
            <div className="bg-[#FFFFFF] border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-6 relative flex flex-col gap-6">
              {/* Headshot in circle with black border */}
              <div className="w-24 h-24 rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] overflow-hidden shrink-0 bg-white">
                <img
                  src={pankajPhotoSrc}
                  alt="Pankaj, Senior Product Manager at ShopDeck, PM mentor at StepSmart"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              <div className="flex-1">
                {/* Rotated tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[2deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    SENIOR PM @ SHOPDECK
                  </span>
                  <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                    B2B + B2C
                  </span>
                </div>
                
                <h3 className="text-2xl font-extrabold text-[#111111] mb-1">Pankaj</h3>
                <p className="text-[#188ab2] text-xs font-extrabold uppercase tracking-widest mb-4">SENIOR PRODUCT MANAGER - SHOPDECK</p>
                <p className="text-sm font-bold text-[#111111] leading-relaxed">
                  Owns merchant-experience, profitability, and logistics at ShopDeck, with 5+ years across SaaS, e-commerce, and mobility. Expert at turning business challenges into revenue-generating solutions for both B2B and B2C.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="student-faq" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
              Frequently Asked{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                Questions
              </span>
            </h2>
            <p className="text-lg font-bold text-[#111111] mt-4">Got questions? We've got answers.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "I have 0 corporate experience. Can I realistically become a PM?",
                a: "Absolutely. Tech giants and startups run specific Associate Product Manager (APM) cohorts and internships for fresh grads. The key is proving you can think like a PM, which you do by building a portfolio of live Product Requirement Documents (PRDs)."
              },
              {
                q: "How does PM-X First Step help with campus or off-campus placements?",
                a: "Instead of a generic resume, you'll finish the program with 3 live product case studies. Adding links to real specifications you designed separates you from 99% of other engineering/business students."
              },
              {
                q: "What is the weekly commitment?",
                a: "Around 4-6 hours. Live sessions are held on weekends, and assignments are structured around your college class hours to avoid interference with midterms or final exams."
              },
              {
                q: "Do you offer placement or internship referrals?",
                a: "Yes. Our active inner circle features mentors and alumni working in top-tier companies. Verified graduates who finish all 3 PRD specifications get direct referrals to startups hiring APM interns."
              }
            ].map((faq, i) => (
              <details 
                key={i} 
                className="group border-[3px] border-[#111111] bg-white p-6 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] [&_summary::-webkit-details-marker]:hidden open:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] open:translate-x-[2px] open:translate-y-[2px] transition-all duration-100 rounded-none select-none"
              >
                <summary className="flex items-center justify-between font-extrabold text-base md:text-lg cursor-pointer text-[#111111] list-none">
                  <span>{faq.q}</span>
                  <span className="transition group-open:rotate-180 font-bold text-xl shrink-0 ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-xs md:text-sm font-bold leading-relaxed text-[#111111] border-t-2 border-[#111111]/10 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form / Call to action */}
      <section id="enroll-student" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div id="student-form-container" className="container mx-auto px-6 max-w-xl">
          <div className="bg-[#FFFFFF] border-[3px] border-[#111111] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
            <h2 className="text-3xl font-extrabold mb-2 text-[#111111] text-center">Join Student Cohort</h2>
            <p className="text-sm font-bold text-slate-500 mb-8 text-center uppercase tracking-wider">PM-X First Step Registration</p>
            
            {enrollmentStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#10b981] border-[3px] border-[#111111] rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] mb-6">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#111111] mb-4">Application Submitted!</h3>
                <p className="text-sm font-bold text-[#111111] leading-relaxed mb-6">
                  {formIntent === 'brochure' 
                    ? "Thank you! Your roadmap brochure download will start automatically in a second."
                    : "We have received your application. Expect a response on your vetting call status within 24 hours."
                  }
                </p>
                {formIntent === 'brochure' && (
                  <Button variant="outline" className="w-full" onClick={startBrochureDownload}>
                    Click here if download didn't start
                  </Button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-extrabold uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="w-full px-4 py-3 border-[3px] border-[#111111] text-sm font-extrabold shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all"
                    placeholder="Enter your name"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs font-extrabold mt-1.5 uppercase">{errors.fullName.message as string}</p>}
                </div>

                <div>
                  <label className="block text-sm font-extrabold uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 border-[3px] border-[#111111] text-sm font-extrabold shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-xs font-extrabold mt-1.5 uppercase">{errors.email.message as string}</p>}
                </div>

                <div>
                  <label className="block text-sm font-extrabold uppercase mb-2">Phone Number</label>
                  <input
                    type="text"
                    {...register('phone')}
                    className="w-full px-4 py-3 border-[3px] border-[#111111] text-sm font-extrabold shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-xs font-extrabold mt-1.5 uppercase">{errors.phone.message as string}</p>}
                </div>

                {enrollmentStatus === 'error' && (
                  <p className="text-red-500 text-xs font-extrabold uppercase text-center">Submission failed. Please try again.</p>
                )}

                <Button 
                  type="submit" 
                  variant={formIntent === 'enroll' ? 'primary' : 'secondary'}
                  className="w-full py-4 text-base shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]"
                  isLoading={enrollmentStatus === 'loading'}
                >
                  {formIntent === 'enroll' ? 'Submit Enrollment Application' : 'Download PM-X Brochure'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FFFFFF] py-12 border-t-[3px] border-[#111111]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 mb-16 text-left">
            <div className="col-span-1">
              <Logo toHome={true} />
              <p className="text-[#111111] text-sm leading-relaxed max-w-xs mt-8 font-bold">
                PM-X First Step Cohort for college students. Learn from Microsoft and Mastercard mentors.
              </p>
            </div>
            <div>
              <h4 className="font-extrabold text-[#111111] mb-6">Quick Links</h4>
              <ul className="space-y-4 text-[#111111] text-sm font-bold">
                <li><a href="/#who-is-it-for" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Professional Page</a></li>
                <li><a href="#why-speedup" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Why First Step?</a></li>
                <li><a href="#student-benefits" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Cohort Perks</a></li>
                <li><Link to="/blog" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold text-[#111111] mb-6">Join Our Community</h4>
              <p className="text-[#111111] text-sm mb-6 leading-relaxed font-bold">
                Stay updated with free resources, case study deep-dives, and networking opportunities.
              </p>
              <a 
                href="https://chat.whatsapp.com/BCeLjXhQHrxFxOlxkb7DPc" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#188ab2] font-extrabold hover:underline underline-offset-4 decoration-2 decoration-[#188ab2]"
              >
                Join the WhatsApp Community <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="pt-12 border-t-[3px] border-[#111111] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-6 text-[#111111]">
              <a href="mailto:administrator@stepsmart.net" className="hover:text-[#188ab2] transition-colors"><Mail /></a>
            </div>
            <p className="text-[#111111] text-[10px] font-bold uppercase tracking-widest">© 2026 StepSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
