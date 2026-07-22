import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  Download,
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
  Cpu,
  Flag,
  UserCheck,
  Clock,
  Dumbbell
} from 'lucide-react';
import {
  Logo,
  Button,
  NavLink,
  scrollToSection,
  db,
  appId,
  enrollmentSchema,
  saveLeadToDemoDB,
  sanketPhotoSrc,
  ankitPhotoSrc,
  pankajPhotoSrc,
  brochurePdfSrc,
  studentBrochurePdfSrc,
  startBrochureDownload,
  AnnouncementBanner
} from './AppBrutalism';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const roadmapSteps = [
  {
    step: "01",
    phase: "shortlisted",
    title: "Optimizing your Student background as PM",
    bullets: [
      "Craft your resume for getting shortlisted",
      "Create a compelling Portfolio"
    ],
    Icon: FileText
  },
  {
    step: "02",
    phase: "shortlisted",
    title: "Understanding PM",
    bullets: [
      "Learn fundamentals",
      "Build your PM skills through live classes"
    ],
    Icon: BookOpen
  },
  {
    step: "03",
    phase: "shortlisted",
    title: "Build Tech Understanding",
    bullets: [
      "Tech Basics",
      "AI fluency"
    ],
    Icon: Cpu
  },
  {
    step: "04",
    phase: "shortlisted",
    title: "Create compelling Stories",
    bullets: [
      "Case Practice with Deck Creation",
      "Behavioural Interview Story crafting"
    ],
    Icon: MessageSquare
  },
  {
    step: "05",
    phase: "interview",
    title: "Ace your interviews",
    bullets: [
      "Developing Product Sense",
      "Product Interview Preparation"
    ],
    Icon: Target
  },
  {
    step: "06",
    phase: "interview",
    title: "Practice. Practice. Practice",
    bullets: [
      "Doubt Solving Sessions",
      "Continuous Feedback",
      "Mock interview with Peers"
    ],
    Icon: Users
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
        startBrochureDownload(true);
      }, 1000);
      return;
    }
  };

  const onSubmit = async (data: any) => {
    setEnrollmentStatus('loading');
    saveLeadToDemoDB({ ...data, cohortTrack: 'PM-X First Step (Students)' });

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
            masterclassId: data.intent === 'brochure' ? 'pm-x-brochure-student' : 'pm-x-first-step-student',
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
    scrollToSection('student-form-container');
  };

  const handleMobileLinkClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    scrollToSection(targetId);
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
              <NavLink href="#curriculum">Curriculum</NavLink>
              <NavLink to="/events">Events</NavLink>
              <NavLink to="/blog">Blog</NavLink>
              <a href="/learn" className="ml-2 px-5 py-2 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all select-none font-extrabold">Login</a>
              <Button variant="primary" className="px-5 py-2 text-sm" onClick={() => scrollToSection('enroll-student')}>
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
            <a href="#curriculum" onClick={(e) => handleMobileLinkClick(e, 'curriculum')} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Curriculum</a>
            <Link to="/events" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Events</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Blog</Link>
            <a href="/learn" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-6 py-2.5 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] font-extrabold transition-all">Login</a>
            <Button variant="primary" className="w-full px-5 py-2 text-sm" onClick={() => { setIsMenuOpen(false); handleActionClick('enroll'); }}>Apply Now</Button>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-8 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 text-center max-w-[1600px]">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 w-full max-w-[1500px] mx-auto select-none mb-12">
            {[
              { src: "/student-comic-1.jpg", alt: "Placement season anxiety" },
              { src: "/student-comic-2.jpg", alt: "Conflicting advice from peers" },
              { src: "/student-comic-3.jpg", alt: "Unstructured prep confusion" },
              { src: "/student-comic-4.jpg", alt: "Discovering structured PM-X path" },
              { src: "/student-comic-5.jpg", alt: "Placement ready success" }
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
      <section id="why-speedup" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111] scroll-mt-[77px]">
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
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-14 h-14 bg-[#188ab2] border-[3px] border-[#111111] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-transform duration-100 ${box.iconTilt}`}>
                      {box.icon}
                    </div>
                    
                    <span className={`inline-block bg-[#FFF3A7] text-[#111111] border-[2px] border-[#111111] px-2.5 py-1 font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none ${box.tagTilt}`}>
                      {box.tag}
                    </span>
                  </div>
                  
                  <h3 className="font-extrabold text-xl text-[#111111] mb-2">{box.label}</h3>

                  <p className="text-[#111111] text-xs leading-relaxed font-bold">{box.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Founder's Message Card */}
          <div className="mt-12 bg-[#FFF3A7] border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-6 md:p-8 text-left">
            {/* Rotated tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-[#FFFFFF] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[-1deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                A Note From Our Founders
              </span>
              <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[1.5deg] inline-block shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                Why We Built PM-X First Step
              </span>
            </div>

            <p className="text-[#111111] text-sm md:text-base font-bold leading-relaxed">
              "We've each been through the exact confusion students face when trying to break into PM — no structured starting point, unclear resources, and no easy way to validate if they're even on the right track. As alumni who've made that transition ourselves, we wanted to bring back what we wish we'd had — a clear, structured session before placement season hits, rather than students piecing it together last-minute from scattered YouTube videos and casebooks."
            </p>

            <div className="mt-4 pt-3 border-t-2 border-[#111111]/20 flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#111111] uppercase tracking-wider">
                — StepSmart Founders & PM Mentors
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cohort Perks / Student Benefits */}
      <section id="student-benefits" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111] scroll-mt-[77px]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] uppercase">
              Our{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                Offerings
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 select-none">
            {[
              {
                title: "Product Sense",
                desc: "Build core PM thinking for RCA, design, and guesstimates. Master logic and problem-solving without memorizing frameworks.",
                icon: <Lightbulb className="h-6 w-6 text-[#127193]" />
              },
              {
                title: "Your Structured Roadmap",
                desc: "Get a week-by-week plan mapped to your placement timeline. Know exactly what to focus on from August to final shortlists.",
                icon: <Compass className="h-6 w-6 text-[#127193]" />
              },
              {
                title: "Resume Crafting",
                desc: "Translate your technical or analytical background into a resume that PM recruiters and screeners actually want to shortlist.",
                icon: <FileText className="h-6 w-6 text-[#127193]" />
              },
              {
                title: "Portfolio Building",
                desc: "Build a credible portfolio of product artifacts, case studies, and PRDs to prove your hands-on PM skills to recruiters.",
                icon: <BookOpen className="h-6 w-6 text-[#127193]" />
              },
              {
                title: "Interview Preparation",
                desc: "Develop a natural problem-solving approach. Practice interactive case-solving until reasoning is second nature.",
                icon: <Target className="h-6 w-6 text-[#127193]" />
              },
              {
                title: "Mock & Mentor Interviews",
                desc: "Conduct realistic mock interviews with seasoned PMs from Microsoft and Mastercard to get direct, actionable feedback.",
                icon: <Trophy className="h-6 w-6 text-[#127193]" />
              },
              {
                title: "Peer Community",
                desc: "Get matched with motivated peers across top IITs and IIMs to practice case interviews and stay accountable.",
                icon: <Users className="h-6 w-6 text-[#127193]" />
              },
              {
                title: "Ongoing Support Through the Season",
                desc: "Enjoy direct, active support from mentors for surprise interview rounds and last-minute placement application checks.",
                icon: <Calendar className="h-6 w-6 text-[#127193]" />
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex gap-5 items-start text-left"
              >
                <div className="shrink-0 w-12 h-12 rounded-full border-2 border-[#111111] bg-[#FFF3A7] flex items-center justify-center">
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
      </section>



      {/* Roadmap */}
      <section id="roadmap" className="py-10 md:py-12 bg-[#FFFFFF] border-b-[3px] border-[#111111] scroll-mt-[77px]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-8 max-w-3xl mx-auto relative">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mb-2">
              Your Step-by-Step{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-3 py-0.5 rotate-[-1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                PM Placement Roadmap
              </span>
            </h2>
            <p className="text-sm md:text-base font-bold text-[#111111]">From optimizing your student background to cracking final product interviews.</p>
          </div>

          {/* Desktop Staircase Roadmap View */}
          <div className="hidden lg:block pt-20 pb-2">
            <div className="relative">
              
              {/* Individual Step Cards Grid with Increasing Column Heights */}
              <div className="grid grid-cols-6 gap-3 lg:gap-4 items-end relative">
                {roadmapSteps.map((step, idx) => {
                  // Ascending heights for rising staircase columns with comfortable bullet spacing
                  const stepHeights = ['h-[260px]', 'h-[290px]', 'h-[320px]', 'h-[350px]', 'h-[380px]', 'h-[410px]'];
                  const cardHeightClass = stepHeights[idx] || 'h-[300px]';

                  return (
                    <div key={idx} className="flex flex-col justify-end relative group select-none">
                      {/* Top Start Student Mascot Image & Badge */}
                      {idx === 0 && (
                        <div className="absolute -top-32 left-0 right-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                          <img 
                            src="/student-mascot.png" 
                            alt="Student mascot" 
                            className="h-28 w-auto object-contain"
                          />
                          <span className="bg-[#FFF3A7] text-[#111111] border-[2px] border-[#111111] px-2.5 py-0.5 font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] flex items-center gap-1 select-none mt-1">
                            <GraduationCap className="h-3.5 w-3.5 text-[#111111]" />
                            <span>Start Here</span>
                          </span>
                        </div>
                      )}

                      {/* Single Top PM Offer Flag for Step 06 */}
                      {idx === 5 && (
                        <div className="absolute -top-9 left-0 right-0 flex justify-center z-20">
                          <span className="bg-[#188ab2] text-white border-[2px] border-[#111111] px-2.5 py-0.5 font-black text-[11px] uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] flex items-center gap-1.5 select-none">
                            <Flag className="h-3.5 w-3.5 fill-white" />
                            <span>PM OFFER 🚩</span>
                          </span>
                        </div>
                      )}

                      {/* Individual Step Card */}
                      <div className={`w-full ${cardHeightClass} bg-white border-[3px] border-[#111111] shadow-[5px_5px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_rgba(17,17,17,1)] transition-all duration-150 flex flex-col overflow-hidden`}>
                        {/* Step Cap Header */}
                        <div className="bg-[#188ab2] text-white border-b-[3px] border-[#111111] py-1.5 px-2 text-center shrink-0 flex items-center justify-center">
                          <span className="font-black text-lg tracking-wider">{step.step}</span>
                        </div>

                        {/* Step Card Body */}
                        <div className="p-3 flex-1 flex flex-col justify-between bg-white overflow-hidden">
                          <div>
                            {/* Step Icon */}
                            <div className="w-9 h-9 mx-auto bg-[#FFF3A7] border-[2px] border-[#111111] flex items-center justify-center rounded-lg mb-2 shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] transition-transform group-hover:rotate-[-4deg]">
                              <step.Icon className="h-4.5 w-4.5 text-[#111111]" />
                            </div>

                            {/* Title */}
                            <h3 className="font-extrabold text-[11px] md:text-[12px] text-[#188ab2] text-center mb-2.5 leading-snug min-h-[30px] flex items-center justify-center border-b-2 border-[#111111]/10 pb-1.5">
                              {step.title}
                            </h3>

                            {/* Bullets with Comfortable Vertical Spacing */}
                            <ul className="space-y-2.5 text-[#111111]">
                              {step.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-1.5 text-[10.5px] md:text-[11px] font-bold leading-tight">
                                  <span className="text-[#188ab2] font-black select-none">•</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Mobile & Tablet View */}
          <div className="lg:hidden flex flex-col gap-6 max-w-lg mx-auto pt-4">
            {roadmapSteps.map((step, idx) => (
              <div key={idx} className="bg-white border-[3px] border-[#111111] p-5 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] relative">
                {idx === 5 && (
                  <div className="absolute -top-4 right-4 bg-[#188ab2] text-white border-[2px] border-[#111111] px-2.5 py-0.5 font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] flex items-center gap-1 select-none">
                    <Flag className="h-3 w-3 fill-white" />
                    <span>PM OFFER</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-b-2 border-[#111111]/10 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#188ab2] text-white font-black text-sm px-2.5 py-0.5 border-[2px] border-[#111111]">
                      {step.step}
                    </span>
                    <h3 className="font-extrabold text-base text-[#188ab2]">{step.title}</h3>
                  </div>
                  <step.Icon className="h-5 w-5 text-[#188ab2] shrink-0" />
                </div>
                <ul className="space-y-2">
                  {step.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-xs font-bold text-[#111111]">
                      <span className="text-[#188ab2] font-black">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Student Curriculum Section */}
      <section id="curriculum" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111] scroll-mt-[77px]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
              Student{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                Curriculum
              </span>
            </h2>
            <p className="text-lg font-bold text-[#111111] mt-4">
              Core curriculum focused on product thinking and problem space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch select-none text-left">
            {[
              {
                week: "WEEK 1",
                title: "Product Thinking",
                tag: "Foundations",
                modules: [
                  {
                    heading: "Product Lifecycle",
                    bullets: ["Systems Thinking", "Problem Space vs Solution Space"]
                  },
                  {
                    heading: "Business Models",
                    bullets: ["KPI Tree", "Segmentation", "Impact Mapping"]
                  }
                ]
              },
              {
                week: "WEEK 2",
                title: "Problem Space",
                tag: "User Research",
                modules: [
                  {
                    heading: "Building User Empathy",
                    bullets: ["User Personas", "Customer Journey Maps", "Hypothesis Building"]
                  },
                  {
                    heading: "User Research",
                    bullets: ["Surveys", "Interviews", "Framing your problem"]
                  }
                ]
              }
            ].map((topic, i) => (
              <div 
                key={i} 
                className="bg-white border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  {/* Top Week Pill & Header */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b-[3px] border-[#111111]">
                    <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-3 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                      {topic.week}
                    </span>
                    <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                      {topic.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-[#111111] mb-6">
                    {topic.title}
                  </h3>

                  {/* Modules Content */}
                  <div className="space-y-6">
                    {topic.modules.map((mod, mIdx) => (
                      <div key={mIdx} className="bg-[#FFF3A7]/20 border-2 border-[#111111] p-4 shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]">
                        <h4 className="font-extrabold text-sm text-[#111111] mb-3 pb-1.5 border-b-2 border-[#111111]/15">
                          {mod.heading}
                        </h4>
                        <ul className="space-y-2 text-xs font-extrabold text-[#111111]">
                          {mod.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2 leading-snug">
                              <span className="text-[#188ab2] font-black select-none">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* 3rd Card: Download Full Curriculum Brochure */}
            <div className="bg-[#FFF3A7] border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] transition-all duration-150 flex flex-col justify-between">
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b-[3px] border-[#111111]">
                  <span className="bg-[#111111] text-[#FFF3A7] border-2 border-[#111111] px-3 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                    FULL ROADMAP
                  </span>
                  <span className="bg-white text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                    6+ WEEKS
                  </span>
                </div>

                <h3 className="text-2xl font-black text-[#111111] mb-4">
                  Full Curriculum
                </h3>

                <p className="text-xs md:text-sm font-extrabold text-[#111111] leading-relaxed mb-6">
                  Get the complete student roadmap with advanced case studies, portfolio projects, live PRD specifications, and mock interviews.
                </p>
              </div>

              <Button 
                variant="primary" 
                className="w-full text-sm font-extrabold py-3.5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]"
                onClick={() => handleActionClick('brochure')}
              >
                Download Full Curriculum ➜
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule Section */}
      <section id="weekly-schedule" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111] scroll-mt-[77px]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] uppercase">
              Weekly{' '}
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[-1.5deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                Schedule
              </span>
            </h2>
            <p className="text-lg font-bold text-slate-500 mt-4 max-w-2xl mx-auto">A structured path to building consistent PM skills.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 select-none">
            {[
              {
                day: "WED",
                type: "Live Class",
                time: "1.5 Hours",
                sub: "Instructor led",
                icon: <Laptop className="h-6 w-6 text-[#127193]" />
              },
              {
                day: "SAT",
                type: "Activity Class",
                time: "1.5 Hours",
                sub: "Instructor led",
                icon: <Users className="h-6 w-6 text-[#127193]" />
              },
              {
                day: "SUN",
                type: "Live Class",
                time: "1.5 Hours",
                sub: "Instructor led",
                icon: <Laptop className="h-6 w-6 text-[#127193]" />
              },
              {
                day: "TUE",
                type: "Doubt Hours",
                time: "1 Hour",
                sub: "Mentor led",
                icon: <UserCheck className="h-6 w-6 text-[#127193]" />
              },
              {
                day: "DAILY",
                type: "PM Gym",
                time: "5 min",
                sub: "Self paced",
                icon: <Dumbbell className="h-6 w-6 text-[#127193]" />
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-[#FFFFFF] border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6 flex flex-col justify-between items-start text-left relative overflow-hidden"
              >
                <div className="w-full">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-black uppercase text-[#127193] border-b-[3px] border-[#FFF3A7] pb-0.5">
                      {item.day}
                    </span>
                    <div className="w-10 h-10 rounded-full border-[2.5px] border-[#111111] bg-[#FFF3A7] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-[#111111] mb-1">{item.type}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{item.sub}</p>
                </div>
                <div className="bg-[#e0f2fe] border-2 border-[#111111] px-2.5 py-1 flex items-center gap-1.5 w-full justify-center">
                  <Clock className="h-3.5 w-3.5 text-[#111111]" />
                  <span className="text-xs font-extrabold text-[#111111] uppercase tracking-wide">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="student-faq" className="py-16 bg-[#FFFFFF] border-b-[3px] border-[#111111] scroll-mt-[77px]">
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
      <section id="enroll-student" className="py-16 bg-[#FFFFFF] relative border-b-[3px] border-[#111111] scroll-mt-[77px]">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-[#111111]">Ready to Start Your Journey?</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <button
              onClick={() => handleActionClick('brochure')}
              className={`flex flex-col items-center p-10 bg-white border-[3px] transition-all duration-100 ${
                formIntent === 'brochure'
                  ? 'border-[#188ab2] shadow-[6px_6px_0px_0px_rgba(24,138,178,1)] translate-x-[-2px] translate-y-[-2px]'
                  : 'border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]'
              }`}
            >
              <Download className={`h-10 w-10 mb-4 ${formIntent === 'brochure' ? 'text-[#188ab2]' : 'text-[#111111]'}`} />
              <h3 className="text-xl font-extrabold mb-2 text-[#111111]">Download First Step Brochure</h3>
              <p className="text-[#111111] text-sm font-bold">Get the student curriculum and roadmap details.</p>
            </button>
            <button
              onClick={() => handleActionClick('enroll')}
              className={`flex flex-col items-center p-10 bg-white border-[3px] transition-all duration-100 ${
                formIntent === 'enroll'
                  ? 'border-[#188ab2] shadow-[6px_6px_0px_0px_rgba(24,138,178,1)] translate-x-[-2px] translate-y-[-2px]'
                  : 'border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]'
              }`}
            >
              <Briefcase className={`h-10 w-10 mb-4 ${formIntent === 'enroll' ? 'text-[#188ab2]' : 'text-[#111111]'}`} />
              <h3 className="text-xl font-extrabold mb-2 text-[#111111]">Enroll for PM-X First Step</h3>
              <p className="text-[#111111] text-sm font-bold">Register for the next student batch or masterclass.</p>
            </button>
          </div>

          <div id="student-form-container" className="max-w-xl mx-auto bg-white border-[3px] border-[#111111] p-8 md:p-12 text-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] scroll-mt-[77px]">
            {enrollmentStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="bg-[#FFFFFF] border-[3px] border-[#111111] text-green-600 w-16 h-16 flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                  <CheckCircle2 className="h-8 w-8 text-[#188ab2]" />
                </div>
                <h3 className="text-3xl font-extrabold mb-4">{formIntent === 'brochure' ? "Brochure Ready!" : "Enrollment Submitted!"}</h3>
                <p className="text-[#111111] mb-8 font-bold">
                  {formIntent === 'brochure'
                    ? "Your PM-X First Step Brochure download has started automatically."
                    : "We have received your application. Expect a response on your vetting call status within 24 hours."}
                </p>
                {formIntent === 'brochure' && (
                  <Button
                    variant="outline"
                    className="w-full mb-4 font-extrabold"
                    onClick={() => startBrochureDownload(true)}
                  >
                    Click here if download didn't start ➜
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full font-extrabold"
                  onClick={() => setEnrollmentStatus('idle')}
                >
                  Back
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
                <input type="hidden" {...register("intent")} />
                <div className="space-y-4">
                  <div>
                    <input 
                      {...register("fullName")} 
                      placeholder="Full Name" 
                      className="w-full px-5 py-4 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(24,138,178,1)] transition-all placeholder-[#111111]/60 text-sm" 
                    />
                    {errors.fullName && <p className="text-red-500 text-xs font-bold mt-1 uppercase">{errors.fullName.message as string}</p>}
                  </div>
                  <div>
                    <input 
                      {...register("email")} 
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full px-5 py-4 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(24,138,178,1)] transition-all placeholder-[#111111]/60 text-sm" 
                    />
                    {errors.email && <p className="text-red-500 text-xs font-bold mt-1 uppercase">{errors.email.message as string}</p>}
                  </div>
                  <div>
                    <input 
                      {...register("phone")} 
                      placeholder="WhatsApp Number" 
                      className="w-full px-5 py-4 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(24,138,178,1)] transition-all placeholder-[#111111]/60 text-sm" 
                    />
                    {errors.phone && <p className="text-red-500 text-xs font-bold mt-1 uppercase">{errors.phone.message as string}</p>}
                  </div>
                </div>

                {enrollmentStatus === 'error' && (
                  <p className="text-red-500 text-xs font-extrabold uppercase text-center">Submission failed. Please try again.</p>
                )}

                <Button type="submit" className="w-full py-5 text-xl font-extrabold shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]" isLoading={enrollmentStatus === 'loading'}>
                  {formIntent === 'brochure' ? 'Get Brochure Now' : 'Join First Step Student Batch'}
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
                <li><a href="#mentors" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Mentors</a></li>
                <li><a href="#curriculum" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Curriculum</a></li>
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
