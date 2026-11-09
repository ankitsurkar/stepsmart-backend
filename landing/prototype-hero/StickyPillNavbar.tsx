import React, { useState, useEffect } from 'react';

export function StickyPillNavbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('cohort');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Show compact pill navbar when scrolled down (scrollY > 100px)
      setIsVisible(scrollY > 100);

      // Top scroll progress hairline
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = (scrollY / docHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Scroll-Spy with IntersectionObserver
    // Matching 5 core sections: Cohort, Curriculum, Mentors, Pricing, FAQ
    const sectionMap: { [key: string]: string } = {
      system: 'cohort',
      blueprint: 'cohort',
      curriculum: 'curriculum',
      mentors: 'mentors',
      tuition: 'pricing',
      pricing: 'pricing',
      faq: 'faq',
    };

    const targetIds = ['blueprint', 'system', 'curriculum', 'mentors', 'tuition', 'pricing', 'faq'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && sectionMap[entry.target.id]) {
            setActiveSection(sectionMap[entry.target.id]);
          }
        });
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0.1,
      }
    );

    targetIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (key: string) => {
    // Map key to section id
    const idMap: { [key: string]: string } = {
      cohort: 'blueprint',
      curriculum: 'curriculum',
      mentors: 'mentors',
      pricing: 'tuition',
      faq: 'faq',
    };
    const targetId = idMap[key] || key;
    const el = document.getElementById(targetId) || document.getElementById(key);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(key);
    }
  };

  const navItems = [
    { key: 'cohort', label: 'Cohort' },
    { key: 'curriculum', label: 'Curriculum' },
    { key: 'mentors', label: 'Mentors' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'faq', label: 'FAQ' },
  ];

  return (
    <>
      {/* Top Reading Progress Hairline */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-[#F59E0B] z-50 transition-all duration-75 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* State 2: On Scroll (scrollY > 100px) — Compact 5-Link Floating Pill */}
      <nav
        aria-label="Floating Section Navigation"
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
          isVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-12 opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-fit max-w-[calc(100vw-1.5rem)] mx-auto px-1 sm:px-2 py-1 sm:py-1.5 rounded-full bg-[#FAF8F3]/95 backdrop-blur-md border border-[#E2DDD2] shadow-sm flex items-center gap-0.5 sm:gap-1 select-none overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => scrollTo(item.key)}
                className={`px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono transition-all cursor-pointer select-none whitespace-nowrap ${
                  isActive
                    ? 'bg-[#EBE6DC] text-[#141413] font-semibold shadow-2xs'
                    : 'text-[#6E6A63] hover:text-[#141413]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default StickyPillNavbar;
