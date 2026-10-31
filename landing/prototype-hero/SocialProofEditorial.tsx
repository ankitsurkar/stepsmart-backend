import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Check, X, Shield, Sparkles, Code2, BarChart3, Compass } from 'lucide-react';

const smoothEase = [0.16, 1, 0.3, 1] as const;

// --- LOGOS FOR SECTION 10 ---
function MastercardLogo() {
  return (
    <svg className="w-5 h-3.5 shrink-0" viewBox="0 0 36 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#EB001B" />
      <circle cx="24" cy="12" r="11" fill="#F79E1B" fillOpacity="0.95" />
      <path d="M18 4.75a11 11 0 0 0-4.64 7.25 11 11 0 0 0 4.64 7.25 11 11 0 0 0 4.64-7.25A11 11 0 0 0 18 4.75z" fill="#FF5F00" />
    </svg>
  );
}

function MicrosoftLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
      <rect x="0" y="0" width="7" height="7" fill="#F25022" />
      <rect x="9" y="0" width="7" height="7" fill="#7FBA00" />
      <rect x="0" y="9" width="7" height="7" fill="#00A4EF" />
      <rect x="9" y="9" width="7" height="7" fill="#FFB900" />
    </svg>
  );
}

// --- SECTION 10: LEARN FROM WORKING PMS (MENTORS) ---
export function MentorsEditorial() {
  const mentors = [
    {
      name: "Sanket Katore",
      role: "SENIOR PM · MASTERCARD",
      company: "Mastercard",
      img: "/mentor-sanket.webp",
      linkedin: "https://www.linkedin.com/in/sanketkumar-katore/",
      bio: "Expert in behavioral interviews and product sense frameworks, with deep specialization in scaling fintech products for the global market.",
      cohortRole: "LEADS // Live FinTech Teardowns & Behavioral Loops"
    },
    {
      name: "Ankit Surkar",
      role: "PM 2 · MICROSOFT",
      company: "Microsoft",
      img: "/mentor-ankit.webp",
      linkedin: "https://www.linkedin.com/in/ankit-surkar/",
      bio: "Leads enterprise-grade AI product development at Microsoft. Expert at turning ambiguity into clarity for complex product strategy, with a focus on scaling AI-native products from 0 to 1.",
      cohortRole: "LEADS // 0-to-1 AI Specs, PRDs & Capstone Defense"
    }
  ];

  return (
    <section id="mentors" className="py-12 md:py-16 bg-[#FAF8F5] border-b border-stone-200/90 scroll-mt-20 relative overflow-hidden">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px] font-medium tracking-[0.05em] uppercase mb-2"
          >
            PRACTITIONER-LED FACULTY
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
            className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#16171A] mb-3"
          >
            Learn from{' '}
            <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative underline underline-offset-[8px] decoration-amber-500/80 decoration-skip-ink">
              working PMs.
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
            className="text-[#475569] text-sm sm:text-base leading-[1.6] font-normal"
          >
            No full-time course instructors or outdated lecture slides. Every session and project critique is run directly by senior PMs currently shipping at tier-1 tech companies.
          </motion.p>
        </div>

        {/* Outer Relative Wrapper for 2-Card Grid + Floating Margin Annotations */}
        <div className="relative max-w-4xl mx-auto">

          {/* Left Margin Note (Sanket) - Desktop XL+ */}
          <div className="hidden xl:block absolute -left-[205px] 2xl:-left-[225px] top-1/2 -translate-y-1/2 w-[190px] z-20 pointer-events-none select-none">
            <div className="flex flex-col items-end rotate-[-4deg]">
              <p className="font-handwriting text-[21px] font-bold text-rose-800 leading-[1.25] text-right">
                <span className="block">“Don’t just list features—</span>
                <span className="block">show me the</span>
                <span className="relative inline-block text-rose-950 whitespace-nowrap my-0.5">
                  payment drop-off funnel!”
                  <svg className="absolute -bottom-1 left-0 w-full h-2.5 overflow-visible" viewBox="0 0 170 10" fill="none">
                    <motion.path
                      d="M 2 5 C 45 3, 90 7, 130 4 C 150 3, 165 6, 170 4"
                      stroke="#DC2626"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.45, ease: "easeInOut" }}
                    />
                  </svg>
                </span>
              </p>

              {/* Hand-drawn curved arrow (↷) pointing right into Sanket's card */}
              <div className="flex items-center gap-1.5 mt-2 self-end">
                <span className="font-mono text-[9.5px] font-semibold text-rose-700/80 tracking-tight whitespace-nowrap">
                  — Sanket (Sunday PRD Teardown)
                </span>
                <svg className="w-8 h-6 text-[#DC2626] overflow-visible shrink-0" viewBox="0 0 32 24" fill="none">
                  <motion.path
                    d="M 4 18 C 6 8, 16 4, 26 8"
                    stroke="#DC2626"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                  />
                  <motion.path
                    d="M 20 4 L 28 8 L 22 13"
                    stroke="#DC2626"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.85, ease: "easeOut" }}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Margin Note (Ankit) - Desktop XL+ */}
          <div className="hidden xl:block absolute -right-[205px] 2xl:-right-[225px] top-1/2 -translate-y-1/2 w-[190px] z-20 pointer-events-none select-none">
            <div className="flex flex-col items-start rotate-[4deg]">
              <p className="font-handwriting text-[21px] font-bold text-rose-800 leading-[1.25] text-left">
                <span className="block">“Why does this need AI?</span>
                <span className="relative inline-block text-rose-950 whitespace-nowrap my-0.5">
                  Define latency vs. accuracy
                  <svg className="absolute -bottom-1 left-0 w-full h-2.5 overflow-visible" viewBox="0 0 190 10" fill="none">
                    <motion.path
                      d="M 2 5 C 45 3, 95 7, 145 4 C 165 3, 180 6, 188 4"
                      stroke="#DC2626"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.45, ease: "easeInOut" }}
                    />
                  </svg>
                </span>
                <span className="block">trade-off first.”</span>
              </p>

              {/* Hand-drawn curved arrow (↶) pointing left into Ankit's card */}
              <div className="flex items-center gap-1.5 mt-2 self-start">
                <svg className="w-8 h-6 text-[#DC2626] overflow-visible shrink-0" viewBox="0 0 32 24" fill="none">
                  <motion.path
                    d="M 28 18 C 26 8, 16 4, 6 8"
                    stroke="#DC2626"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                  />
                  <motion.path
                    d="M 12 4 L 4 8 L 10 13"
                    stroke="#DC2626"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.85, ease: "easeOut" }}
                  />
                </svg>
                <span className="font-mono text-[9.5px] font-semibold text-rose-700/80 tracking-tight whitespace-nowrap">
                  — Ankit (Saturday Mock Loop)
                </span>
              </div>
            </div>
          </div>

          {/* 2-Column Monograph Mentor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {mentors.map((mentor, idx) => {
              const isSanket = mentor.company === "Mastercard";
              return (
                <div key={mentor.name} className="flex flex-col h-full">
                  {/* Main Mentor Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: idx * 0.15, ease: smoothEase }}
                    whileHover={{ y: -4 }}
                    className="relative bg-white border border-stone-200/90 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden h-full"
                  >
                    {/* Upper Dossier Content */}
                    <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Header: Photo, Name, Single-line Role Badge & LinkedIn */}
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <div className="flex items-center gap-4 sm:gap-5">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#E5E0D8] bg-stone-100 shadow-xs shrink-0">
                              <img 
                                src={mentor.img} 
                                alt={mentor.name} 
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#16171A]">
                                {mentor.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-stone-800 bg-stone-100/90 border border-stone-200 px-2.5 py-1 rounded-md tracking-wide uppercase shadow-2xs whitespace-nowrap w-fit shrink-0">
                                  {isSanket ? <MastercardLogo /> : <MicrosoftLogo />}
                                  <span>{mentor.role}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <a
                            href={mentor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-[#0077B5] hover:text-white text-stone-600 flex items-center justify-center transition-all shrink-0 border border-stone-200/80 shadow-2xs hover:shadow-xs group"
                            aria-label={`${mentor.name} LinkedIn Profile`}
                          >
                            <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                            </svg>
                          </a>
                        </div>

                        {/* Bio */}
                        <p className="text-[#475569] text-sm sm:text-base leading-relaxed font-normal">
                          {mentor.bio}
                        </p>
                      </div>
                    </div>

                    {/* Recessed Cohort Role Footer Strip */}
                    <div className="bg-[#FAF6EE] border-t border-[#ECE8DF] px-6 sm:px-7 py-3 mt-auto rounded-b-3xl flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="font-mono text-[10px] sm:text-[10.5px] font-semibold text-stone-700 tracking-wide uppercase whitespace-nowrap">
                        {mentor.cohortRole}
                      </span>
                    </div>
                  </motion.div>

                  {/* Mobile & Tablet Fallback: Raw ink underneath card without boxes (xl:hidden) */}
                  <div className="xl:hidden block mt-3 px-2">
                    {isSanket ? (
                      <div className="flex flex-col items-start rotate-[-1deg]">
                        <p className="font-handwriting text-lg sm:text-xl font-bold text-rose-800 leading-snug">
                          “Don’t just list features—show me the{' '}
                          <span className="relative inline-block text-rose-950">
                            payment drop-off funnel!
                            <svg className="absolute -bottom-1 left-0 w-full h-2 overflow-visible" viewBox="0 0 170 10" fill="none">
                              <motion.path
                                d="M 2 5 C 45 3, 90 7, 130 4 C 150 3, 165 6, 170 4"
                                stroke="#DC2626"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
                              />
                            </svg>
                          </span>”
                        </p>
                        <span className="font-mono text-[9.5px] font-semibold text-rose-700/80 tracking-tight mt-0.5">
                          — Sanket (Sunday PRD Teardown)
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start rotate-[1deg]">
                        <p className="font-handwriting text-lg sm:text-xl font-bold text-rose-800 leading-snug">
                          “Why does this need AI? Define{' '}
                          <span className="relative inline-block text-rose-950">
                            latency vs. accuracy
                            <svg className="absolute -bottom-1 left-0 w-full h-2 overflow-visible" viewBox="0 0 150 10" fill="none">
                              <motion.path
                                d="M 2 5 C 35 3, 75 7, 115 4 C 135 3, 145 6, 150 4"
                                stroke="#DC2626"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
                              />
                            </svg>
                          </span>
                          {' '}trade-off first.”
                        </p>
                        <span className="font-mono text-[9.5px] font-semibold text-rose-700/80 tracking-tight mt-0.5">
                          — Ankit (Saturday Mock Loop)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

// --- SECTION 11: REAL PEOPLE. REAL TRANSITIONS (TESTIMONIALS) ---
function AlumniCompanyLogo({ company, name }: { company: string; name: string }) {
  if (company === "ACKO") {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#5E2BFF] text-white flex items-center justify-center shrink-0 shadow-2xs border border-[#4F1CE6] select-none">
        <span className="font-extrabold text-[12px] tracking-tight lowercase font-sans">
          acko
        </span>
      </div>
    );
  }
  if (company === "Surepass") {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shrink-0 shadow-2xs border border-slate-700 select-none">
        <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>
    );
  }
  if (company === "American Express") {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#006FCF] text-white flex items-center justify-center shrink-0 shadow-2xs border border-[#0058A8] select-none">
        <span className="font-extrabold text-[9.5px] tracking-tight uppercase font-sans leading-none text-center">
          AMEX
        </span>
      </div>
    );
  }
  // Editorial tinted monogram for Gauri T. (Career Pivot)
  return (
    <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] text-[#1A1917] border border-[#E2DCD0] flex items-center justify-center shrink-0 shadow-2xs select-none">
      <span className="font-mono font-bold text-xs tracking-wider">
        GT
      </span>
    </div>
  );
}

export function TestimonialsEditorial() {
  const testimonials = [
    {
      name: "Triya",
      role: "Business Analyst → PM @ ACKO",
      pathTag: "ANALYST → PM",
      company: "ACKO",
      quotePrefix: "“PM-X gave me the ",
      punchline: "clarity and confidence I needed",
      quoteSuffix: " to make the transition.”"
    },
    {
      name: "Nishant",
      role: "Student → APM Intern @ Surepass",
      pathTag: "STUDENT → APM",
      company: "Surepass",
      quotePrefix: "“From zero interview calls to ",
      punchline: "landing a PM internship in under a month.”",
      quoteSuffix: ""
    },
    {
      name: "Gauri T.",
      role: "Operations / Tech → Product Manager",
      pathTag: "CAREER PIVOT",
      company: "Career Pivot",
      quotePrefix: "“Watching peers articulate product thinking ",
      punchline: "made me believe I could become a PM.”",
      quoteSuffix: ""
    },
    {
      name: "Nishtha",
      role: "Software Engineer → PM @ American Express",
      pathTag: "TECH → PM",
      company: "American Express",
      quotePrefix: "“PM-X helped me ",
      punchline: "break overwhelming case studies into clear, actionable chunks.”",
      quoteSuffix: ""
    }
  ];

  return (
    <section id="outcomes" className="py-12 md:py-16 bg-white border-b border-stone-200/90 scroll-mt-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px] font-medium tracking-[0.05em] uppercase mb-2"
          >
            PROVEN TRACK RECORD
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
            className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#16171A]"
          >
            Real people.{' '}
            <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative underline underline-offset-[8px] decoration-amber-500/80 decoration-skip-ink">
              Real transitions.
            </span>
          </motion.h2>
        </div>

        {/* 4-Column Monograph Testimonial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.12, ease: smoothEase }}
              whileHover={{ y: -5 }}
              className="bg-[#FAF8F5] border border-stone-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full"
            >
              <div>
                {/* Header: Solo Pathway Tag on Top-Left */}
                <div className="mb-4">
                  <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 rounded tracking-wide uppercase shadow-2xs">
                    {item.pathTag}
                  </span>
                </div>

                {/* Quote with Highlighted Punchline (Instrument Serif Italic preserved) */}
                <p className="font-editorial italic text-lg sm:text-[19px] text-[#16171A] leading-[1.5] mb-6 font-normal">
                  {item.quotePrefix}
                  <span className="bg-[#FEF3C7] text-stone-950 px-1 py-0.5 rounded-xs border-b border-amber-300/90 inline">
                    {item.punchline}
                  </span>
                  {item.quoteSuffix}
                </p>
              </div>

              {/* Author Footer: Company Logo + Full Trajectory */}
              <div className="pt-4 border-t border-stone-200/80 flex items-center gap-3">
                <AlumniCompanyLogo company={item.company} name={item.name} />
                <div className="min-w-0 flex-1">
                  <b className="block text-[#16171A] text-sm font-bold tracking-tight">
                    {item.name}
                  </b>
                  <span className="text-stone-500 font-medium text-xs leading-snug block mt-0.5">
                    {item.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

// --- SECTION 12: IS PM-X FOR YOU? (APPLICANT QUALIFICATION & READINESS) ---
export function FitAssessmentEditorial() {
  const archetypes = [
    {
      tag: "01 // TECH → PM",
      title: "SDEs & Tech Leads",
      headline: 'You ship code every day, now you want to own the "Why" and the roadmap.',
      shift: "Translate technical systems into user metrics, business levers, and product strategy.",
      icon: Code2
    },
    {
      tag: "02 // DATA & OPS → PM",
      title: "Analysts, QA & Operations",
      headline: 'You solve data or process problems, but recruiters bucket you as "support".',
      shift: "Graduate with a full-stack PRD, clickable prototype, and product sense rubric scores.",
      icon: BarChart3
    },
    {
      tag: "03 // ZERO-TO-ONE → PM",
      title: "Grads & Founders",
      headline: "You have raw hustle, and want tier-1 PM mentorship without a ₹25L MBA.",
      shift: "Build undeniable proof-of-work evaluated directly by Microsoft and Mastercard PMs.",
      icon: Compass
    }
  ];

  const readinessCriteria = [
    {
      title: "6+ Hrs/Wk Live",
      dealbreaker: "✕ No passive 2x-speed watchers"
    },
    {
      title: "Learn by Building",
      dealbreaker: "✕ Won't skip weekly deliverables"
    },
    {
      title: "1:1 Rubric Critique",
      dealbreaker: "✕ No participation shortcuts"
    },
    {
      title: "Proof Over Promises",
      dealbreaker: "✕ No fake placement guarantees"
    }
  ];

  const [checkedItems, setCheckedItems] = React.useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true
  });

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const allChecked = checkedCount === readinessCriteria.length;

  return (
    <section id="qualification" className="py-10 md:py-14 bg-[#FAF8F5] border-b border-stone-200/90 relative overflow-hidden scroll-mt-20">
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
            APPLICANT QUALIFICATION
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
            className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#16171A] mb-2.5"
          >
            Is PM-X{' '}
            <span className="font-editorial italic font-normal text-stone-900 text-[1.12em] tracking-normal inline-block relative underline underline-offset-[8px] decoration-amber-500/80 decoration-skip-ink">
              for you?
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
            className="text-[#475569] text-sm sm:text-base leading-relaxed font-normal"
          >
            The 30 seats in each cohort are capped to ensure direct 1:1 mentor critique. See where your background fits and verify your cohort readiness below.
          </motion.p>
        </div>

        {/* PART 1: 3 Career Archetype Cards (Tightened & Level) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch mb-5">
          {archetypes.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.12, ease: smoothEase }}
                whileHover={{ y: -4 }}
                className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-5.5 shadow-xs hover:shadow-md transition-all flex flex-col h-full"
              >
                <div className="flex flex-col">
                  {/* Top Tag & Icon */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 rounded tracking-wide uppercase shadow-2xs">
                      {item.tag}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#16171A] mb-1.5 whitespace-nowrap">
                    {item.title}
                  </h3>

                  {/* Relatable Headline */}
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                    {item.headline}
                  </p>
                </div>

                {/* The Career Shift Box Pinned with mt-auto */}
                <div className="mt-auto pt-3 border-t border-stone-200/80 bg-[#FAF8F5] -mx-5 -mb-5 p-3.5 sm:p-4 rounded-b-2xl min-h-[76px] flex flex-col justify-center">
                  <span className="font-mono text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-0.5">
                    THE CAREER SHIFT //
                  </span>
                  <p className="text-[#16171A] text-xs font-semibold leading-snug">
                    {item.shift}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* PART 2: Interactive Admission Protocol Checklist (Compact 1-Row 4-Column Strip) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: smoothEase }}
          className="bg-[#FAF6EE] border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs"
        >
          {/* Header Strip with Live Counter Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-[#ECE8DF]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span className="font-mono text-[11px] sm:text-xs font-bold text-stone-900 tracking-[0.05em] uppercase">
                COHORT ADMISSION PROTOCOL // CLICK TO VERIFY YOUR READINESS
              </span>
            </div>
            
            <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-mono text-[11px] font-bold transition-all shadow-2xs whitespace-nowrap self-start sm:self-auto ${
              allChecked 
                ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' 
                : 'bg-amber-100/90 text-amber-950 border border-amber-300'
            }`}>
              {allChecked ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                  <span>4 / 4 CRITERIA MET — QUALIFIED TO APPLY</span>
                </>
              ) : (
                <span>{checkedCount} / 4 MET — {readinessCriteria.length - checkedCount} MORE TO QUALIFY</span>
              )}
            </div>
          </div>

          {/* 4-Column Horizontal Compact Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3.5">
            {readinessCriteria.map((item, idx) => {
              const isChecked = !!checkedItems[idx];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }))}
                  className={`rounded-xl p-3 sm:p-3.5 border text-left transition-all flex flex-col justify-between cursor-pointer group select-none min-h-[76px] ${
                    isChecked 
                      ? 'bg-white border-stone-300/90 shadow-2xs hover:shadow-xs' 
                      : 'bg-[#F5F2EB]/60 border-stone-200/80 opacity-75'
                  }`}
                >
                  {/* Top: Bold Title + Checkbox */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-[#16171A] text-[13px] sm:text-[13.5px] leading-tight">
                      {item.title}
                    </span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all ${
                      isChecked 
                        ? 'bg-[#16171A] text-white shadow-2xs' 
                        : 'border border-stone-300 bg-white group-hover:border-stone-400'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Red Dealbreaker Subtext */}
                  <span className="font-mono text-[9.5px] sm:text-[10px] tracking-tight text-rose-700 leading-tight block whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.dealbreaker}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Status Footer */}
          <div className="mt-3.5 pt-3 border-t border-[#ECE8DF] flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <span className="font-mono text-[10.5px] text-stone-500 font-medium">
              ⚡ 30 SEATS PER COHORT // APPLICATIONS EVALUATED ON READINESS &amp; DRIVE
            </span>
            <a
              href="#pricing"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-stone-900 hover:text-amber-700 transition-colors uppercase tracking-wider"
            >
              <span>RESERVE YOUR SEAT →</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
