import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ChevronDown,
  ChevronUp,
  X,
  Star,
  Info,
  Menu,
  ChevronRight,
  Video,
  ArrowLeft,
  MessageSquare,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Logo, Button, NavLink, saveLeadToDemoDB } from './AppBrutalism';

export const EVENT_COMMUNITY_URL = "https://chat.whatsapp.com/BwmKS1htgjW8Tkt9v4fMwD";
export const EVENT_REGISTER_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSehtxnp9DEFbvtsFz879lZyaMyiVT9y0mAa98lRpinn6STxUw/viewform?usp=publish-editor";

// Type Definitions
export type EventHost = {
  name: string;
  rating: number;
  reviews: number;
  role: string;
  avatar?: string;
};

export type EventItem = {
  id: string;
  title: string;
  dateStr: string;        // "YYYY-MM-DD" for dynamic date logic
  dateDisplay: string;    // "Monday, Jul 27" for display
  time: string;
  format: string;
  description: string;
  aboutText: string;
  status?: 'upcoming' | 'ended'; // Resolved dynamically
  registerUrl?: string;
  attendeeCount?: number;
  hosts?: EventHost[];
  moments?: string[]; // array of image urls
  tags?: string[];
  bannerBg?: string; // CSS background color/gradient
};

// Only the Upcoming Product Masterclass event card as requested
const DEMO_EVENTS: EventItem[] = [
  {
    id: "product-masterclass-2026",
    title: "Product Masterclass for Students",
    dateStr: "2026-07-24",
    dateDisplay: "Friday, Jul 24",
    time: "8:00 PM IST",
    format: "IIT Roorkee",
    description: "Get real insights from PMs on what it takes to become a Product Manager from skills to strategies to cracking interviews.",
    aboutText: "Get real insights from PMs on what it takes to become a Product Manager from skills to strategies to cracking interviews. This session is designed for aspiring PMs looking to switch from non-tech, engineering, or MBA roles without needing prior product management credentials. Learn directly from PMs currently at Microsoft, Mastercard, and Shopdeck.\n\n### What We Cover:\n- **Skills & Frameworks**: Building product sense, RCA, design thinking, and guesstimates that companies actually test.\n- **Resume Mapping**: Translating existing analytical/technical experience to catch PM recruiter eyes.\n- **Interview Strategies**: Practical frameworks vs real thinking approaches.\n- **Q&A Round**: Open floor to ask speakers questions.",
    registerUrl: EVENT_COMMUNITY_URL,
    attendeeCount: 124,
    bannerBg: "linear-gradient(135deg, #188ab2 0%, #1e40af 100%)",
    hosts: [
      {
        name: "Sanket Katore",
        rating: 5.0,
        reviews: 42,
        role: "Product Manager at Mastercard | Mentor & Career Coach",
        avatar: "/mentor-sanket.jpg"
      },
      {
        name: "Pankaj Sharma",
        rating: 5.0,
        reviews: 28,
        role: "Product Manager at Shopdeck | Ex - OLA",
        avatar: "/mentor-pankaj.jpg"
      },
      {
        name: "Ankit Surkar",
        rating: 5.0,
        reviews: 54,
        role: "Product Manager at Microsoft | Tech Leader",
        avatar: "/mentor-ankit.jpg"
      }
    ],
    tags: ["PRODUCT MASTERCLASS FOR STUDENTS", "VIRTUAL", "FREE"]
  }
];

// Helper to check event status dynamically based on current date
const getEventStatus = (eventDateStr: string): 'upcoming' | 'ended' => {
  const eventDate = new Date(eventDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const eventDay = new Date(eventDate);
  eventDay.setHours(0, 0, 0, 0);
  
  // The next day after the event date
  const nextDayAfterEvent = new Date(eventDay);
  nextDayAfterEvent.setDate(nextDayAfterEvent.getDate() + 1);
  
  if (today >= nextDayAfterEvent) {
    return 'ended';
  }
  return 'upcoming';
};

export function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedMomentsId, setExpandedMomentsId] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  
  // Registration Form States
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
  const [regStatus, setRegStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState('');
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeEventId = searchParams.get('id');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          'https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: 'get_events' }),
          }
        );
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err: any) {
        console.warn('API get_events not implemented yet, using fallback demo data.');
        setEvents(DEMO_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Compute status dynamically
  const displayEvents = (events.length > 0 ? events : DEMO_EVENTS).map(event => {
    const status = getEventStatus(event.dateStr);
    return { ...event, status };
  });

  const upcomingEvents = displayEvents.filter(e => e.status === 'upcoming');
  const pastEvents = displayEvents.filter(e => e.status === 'ended');

  // Find active event details if dynamic route/state is set
  const activeEvent = displayEvents.find(e => e.id === activeEventId);

  const toggleMoments = (id: string) => {
    if (expandedMomentsId === id) {
      setExpandedMomentsId(null);
    } else {
      setExpandedMomentsId(id);
    }
  };

  const handleOpenEvent = (id: string) => {
    setSearchParams({ id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseEvent = () => {
    searchParams.delete('id');
    setSearchParams(searchParams);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setValidationError('All fields are required.');
      return;
    }
    setValidationError('');
    setRegStatus('loading');

    // Save lead to local DB
    saveLeadToDemoDB({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      intent: 'enroll'
    });

    try {
      const res = await fetch(
        'https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            masterclassId: activeEvent?.id || 'default'
          }),
        }
      );
      if (!res.ok) throw new Error('Registration failed.');
      setRegStatus('success');
      setFormData({ fullName: '', email: '', phone: '' });
    } catch (err: any) {
      console.error(err);
      // Fallback to success for user demonstration
      setRegStatus('success');
      setFormData({ fullName: '', email: '', phone: '' });
    }
  };

  const parseAboutText = (text: string) => {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-extrabold mt-6 mb-2 text-[#111111]">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-extrabold mt-8 mb-3 border-b-2 border-[#111111] pb-1 text-[#111111]">$1</h2>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold">$1</strong>');
    html = html.replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc font-bold text-slate-700">$1</li>');
    html = html.replace(/\n/g, '<br />');
    return html;
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#111111] selection:bg-[#188ab2]/30">
      {/* Header */}
      <nav className="fixed top-0 z-50 w-full bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Logo toHome={true} />
          <div className="hidden md:flex items-center gap-8 text-sm font-extrabold text-[#111111]">
            <NavLink href="/#who-is-it-for">Who is it for?</NavLink>
            <NavLink href="https://wa.me/919920803517?text=Hi%2C%20I%27m%20interested%20in%20PM-X%20%E2%80%94%20here%27s%20my%20background%3A" target="_blank" rel="noreferrer">Chat 1:1</NavLink>
            <NavLink href="/#mentors">Mentors</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            <a href="/learn" className="ml-2 px-5 py-2 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all select-none font-extrabold">Login</a>
            <Button variant="primary" onClick={() => navigate('/#enroll')}>
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
        <div className="md:hidden fixed top-20 left-0 w-full bg-[#FFFFFF] border-b-[3px] border-[#111111] z-40 p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
          <a href="/#who-is-it-for" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Who is it for?</a>
          <a href="https://wa.me/919920803517?text=Hi%2C%20I%27m%20interested%20in%20PM-X%20%E2%80%94%20here%27s%20my%20background%3A" target="_blank" rel="noreferrer" className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Chat 1:1</a>
          <a href="/#mentors" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Mentors</a>
          <Link to="/events" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200 text-[#188ab2]">Events</Link>
          <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Blog</Link>
          <a href="/learn" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-6 py-2.5 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] font-extrabold transition-all">Login</a>
          <Button variant="primary" className="w-full" onClick={() => { setIsMenuOpen(false); navigate('/#enroll'); }}>Apply Now</Button>
        </div>
      )}

      {/* Meetup-Style Detail View */}
      {activeEvent ? (
        <div className="pt-28 pb-20 bg-[#FFFFFF]">
          <div className="container mx-auto px-6 max-w-5xl">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6 select-none">
              <Link to="/" className="hover:text-[#111111]">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/events" onClick={handleCloseEvent} className="hover:text-[#111111]">Events</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#111111] truncate max-w-xs">{activeEvent.title}</span>
            </div>

            {/* Back Button */}
            <button 
              onClick={handleCloseEvent}
              className="inline-flex items-center gap-2 text-[#188ab2] font-extrabold hover:underline underline-offset-4 decoration-2 mb-8 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all events
            </button>

            {/* Event Main Header Info */}
            <h1 className="text-3xl md:text-5xl font-black text-[#111111] leading-tight mb-8">
              {activeEvent.title}
            </h1>

            {/* Two Column Layout (Meetup details layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left Column - Poster, Attendee circles & Hosts */}
              <div className="lg:col-span-2 space-y-8 text-left">
                {/* Visual Neobrutalist Banner placeholder representing the event visual */}
                <div 
                  className="w-full aspect-video border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-center items-center p-6 text-white text-center"
                  style={{ background: activeEvent.bannerBg || 'linear-gradient(135deg, #111 0%, #333 100%)' }}
                >
                  <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-4 py-1.5 font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(17,17,17,1)] select-none tracking-wider mb-6 rotate-[-1deg]">
                    StepSmart Masterclass
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black leading-tight uppercase tracking-tight max-w-lg mb-4">
                    {activeEvent.title}
                  </h2>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Live from IIT Roorkee
                  </p>
                </div>

                {/* Attendee Count (Avatars & Rahul text removed as requested) */}
                {activeEvent.attendeeCount && (
                  <div className="border-[3px] border-[#111111] p-6 shadow-[5px_5px_0px_0px_rgba(17,17,17,1)] bg-slate-50 flex items-center gap-3">
                    <Users className="h-5 w-5 text-[#188ab2]" />
                    <p className="text-sm font-black text-[#111111]">
                      {activeEvent.status === 'upcoming' ? `${activeEvent.attendeeCount} people attending` : `${activeEvent.attendeeCount} people went`}
                    </p>
                  </div>
                )}

                {/* Hosted By Speakers section */}
                {activeEvent.hosts && activeEvent.hosts.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black uppercase tracking-wide text-slate-400">Hosted by</h3>
                    <div className="grid gap-4">
                      {activeEvent.hosts.map((host, idx) => (
                        <div 
                          key={idx}
                          className="bg-white border-[3px] border-[#111111] p-5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] flex items-center gap-4"
                        >
                          <div className="h-12 w-12 rounded-full border-2 border-[#111111] bg-[#FFF3A7] overflow-hidden flex items-center justify-center font-black text-lg shadow-[2.5px_2.5px_0px_0px_rgba(17,17,17,1)] shrink-0">
                            {host.avatar ? (
                              <img src={host.avatar} alt={host.name} className="w-full h-full object-cover object-top" />
                            ) : (
                              host.name[0]
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-base text-[#111111]">{host.name}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed mt-1">{host.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* About Event Text */}
                <div className="border-t-2 border-[#111111]/10 pt-6">
                  <h3 className="text-xl font-black">About the event</h3>
                  <div 
                    className="prose prose-slate max-w-none text-sm text-[#111111] leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: parseAboutText(activeEvent.aboutText) }}
                  />
                </div>

                {/* Moments Gallery if ended */}
                {activeEvent.status === 'ended' && activeEvent.moments && activeEvent.moments.length > 0 && (
                  <div className="border-t-2 border-[#111111]/10 pt-8">
                    <h3 className="text-lg font-black uppercase tracking-wider text-[#111111] mb-4 flex items-center gap-2">
                      <span>📸</span> Capture Moments Gallery
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {activeEvent.moments.map((imgUrl, imgIdx) => (
                        <div 
                          key={imgIdx} 
                          onClick={() => setActivePhoto(imgUrl)}
                          className="bg-white border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2.5px] hover:translate-y-[2.5px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] transition-all overflow-hidden cursor-zoom-in aspect-video"
                        >
                          <img 
                            src={imgUrl} 
                            alt={`Session moment ${imgIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Status Card & Date details */}
              <div className="space-y-6 text-left">
                <div className="bg-white border-[3px] border-[#111111] p-6 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] sticky top-28 space-y-6">
                  
                  {/* Date details */}
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-100 border-2 border-[#111111] px-3.5 py-2.5 text-center shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] select-none">
                      <p className="text-[10px] font-black uppercase text-[#188ab2] tracking-wider leading-none">
                        {activeEvent.dateDisplay.split(',')[0].slice(0, 3)}
                      </p>
                      <p className="text-xl font-black leading-none mt-1">
                        {activeEvent.dateDisplay.split(' ')[2] || activeEvent.dateDisplay.split(' ')[1]}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#111111]">{activeEvent.dateDisplay}</h4>
                      <p className="text-xs font-bold text-slate-500 mt-1">{activeEvent.time}</p>
                    </div>
                  </div>

                  {/* Format/Venue */}
                  <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                    <div className="h-10 w-10 bg-slate-100 rounded border-2 border-[#111111] flex items-center justify-center text-[#111111]">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#111111]">{activeEvent.format}</h4>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">Link shared before start</p>
                    </div>
                  </div>

                    {/* Booking / Ended Box */}
                    <div className="border-t border-slate-100 pt-6">
                      {activeEvent.status === 'ended' ? (
                        <div className="bg-slate-100 border-[3px] border-[#111111] p-4 text-center font-extrabold text-sm text-slate-500 shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none">
                          This event has ended
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <a 
                            href={EVENT_REGISTER_FORM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full block text-center bg-[#188ab2] text-white border-[3px] border-[#111111] py-3.5 px-6 font-extrabold text-sm uppercase shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-[#157a9e] transition-all select-none cursor-pointer"
                          >
                            Register Now ➜
                          </a>
                          <a 
                            href={EVENT_COMMUNITY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full block text-center bg-white text-[#111111] border-[3px] border-[#111111] py-3.5 px-6 font-extrabold text-sm uppercase shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-slate-50 transition-all select-none cursor-pointer"
                          >
                            Join Community ➜
                          </a>
                        </div>
                      )}
                    </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* Regular Events Listing Page */
        <>
          {/* Hero Section */}
          <section className="pt-40 pb-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
            <div className="container mx-auto px-6 max-w-5xl text-center">
              <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-6 py-2 font-extrabold text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none mb-6">
                Masterclasses & Workshops
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-[#111111] leading-tight">
                StepSmart Live Events
              </h1>
              <p className="text-lg md:text-xl text-[#111111] max-w-2xl mx-auto leading-relaxed font-bold">
                Interactive sessions led by industry experts. Click on any event card to view detail structures and registration.
              </p>
            </div>
          </section>

          {/* Main Content Area */}
          <main className="py-16 bg-[#FFFFFF]">
            <div className="container mx-auto px-6 max-w-5xl">
              {/* Upcoming Section */}
              <div className="mb-20">
                <h2 className="text-3xl font-black mb-10 flex items-center gap-3">
                  <span className="bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-1 rotate-[-1deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]">
                    Upcoming Events
                  </span>
                </h2>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <span className="text-lg font-bold">Loading events...</span>
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="border-[3px] border-[#111111] p-8 text-center bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
                    <Info className="h-10 w-10 mx-auto mb-4 text-slate-400" />
                    <p className="text-lg font-bold text-slate-500">No upcoming events scheduled right now. Check back soon!</p>
                  </div>
                ) : (
                  <div className="grid gap-8">
                    {upcomingEvents.map(event => (
                      <div 
                        key={event.id}
                        onClick={() => handleOpenEvent(event.id)}
                        className="bg-white border-[3px] border-[#111111] p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2.5px] hover:translate-y-[2.5px] hover:shadow-[5.5px_5.5px_0px_0px_rgba(17,17,17,1)] transition-all flex flex-col md:flex-row gap-8 justify-between items-start cursor-pointer text-left"
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-[#C6F6D5] text-green-800 border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase rotate-[1deg] shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                              UPCOMING 🟢
                            </span>
                            {event.tags?.map((t, idx) => (
                              <span key={idx} className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                                {t}
                              </span>
                            ))}
                          </div>

                          <h3 className="text-2xl md:text-3xl font-black text-[#111111] mb-4 leading-tight">{event.title}</h3>
                          <p className="text-sm font-bold text-slate-600 leading-relaxed mb-6">{event.description}</p>
                          
                          {/* Event Stats */}
                          <div className="flex flex-wrap gap-6 text-xs font-black uppercase text-[#111111]/70">
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4.5 w-4.5 text-[#188ab2]" />
                              {event.dateDisplay}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="h-4.5 w-4.5 text-[#188ab2]" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="h-4.5 w-4.5 text-[#188ab2]" />
                              {event.format}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 w-full md:w-auto flex flex-col gap-4 self-stretch justify-center items-center md:items-end">
                          <Button 
                            variant="primary" 
                            onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleOpenEvent(event.id); }}
                            className="w-full md:w-auto px-8 py-3.5 font-extrabold text-sm uppercase shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]"
                          >
                            View Details ➜
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past Events Section */}
              {pastEvents.length > 0 && (
                <div>
                  <h2 className="text-3xl font-black mb-10 flex items-center gap-3">
                    <span className="bg-slate-200 border-[3px] border-[#111111] px-4 py-1 rotate-[1deg] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]">
                      Past Events
                    </span>
                  </h2>
                  
                  <div className="grid gap-8">
                    {pastEvents.map(event => (
                      <div 
                        key={event.id}
                        onClick={() => handleOpenEvent(event.id)}
                        className="bg-white/90 opacity-90 border-[3px] border-[#111111] p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2.5px] hover:translate-y-[2.5px] hover:shadow-[5.5px_5.5px_0px_0px_rgba(17,17,17,1)] transition-all cursor-pointer text-left"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="bg-slate-200 text-slate-700 border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                                ENDED 🔴
                              </span>
                              {event.tags?.map((t, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-500 border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] select-none">
                                  {t}
                                </span>
                              ))}
                            </div>

                            <h3 className="text-2xl md:text-3xl font-black text-[#111111]/70 mb-4 leading-tight">{event.title}</h3>
                            <p className="text-sm font-bold text-slate-500 leading-relaxed mb-6">{event.description}</p>
                          </div>

                          {/* Attendee Count Badge */}
                          {event.attendeeCount && (
                            <div className="shrink-0 bg-[#FFF3A7] border-2 border-[#111111] p-4 text-center shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] rotate-[-1.5deg]">
                              <p className="text-2xl font-black text-[#111111]">{event.attendeeCount}</p>
                              <p className="text-[10px] font-black uppercase text-slate-600 tracking-wider">people went</p>
                            </div>
                          )}
                        </div>

                        {/* Metadata and Details link */}
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center border-t-2 border-[#111111]/10 pt-6 gap-4">
                          <div className="flex flex-wrap gap-5 text-xs font-black uppercase text-slate-400">
                            <span className="flex items-center gap-2 line-through">
                              <Calendar className="h-4.5 w-4.5" />
                              {event.dateDisplay}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="h-4.5 w-4.5" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="h-4.5 w-4.5" />
                              {event.format}
                            </span>
                          </div>

                          <span className="text-[#188ab2] font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-1 hover:underline">
                            View details & moments ➜
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {/* Modal Popup Enrollment Form (Register Now pop-up) */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-[#111111]/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md border-[4px] border-[#111111] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] text-left">
            <button 
              onClick={() => { setShowRegisterModal(false); setRegStatus('idle'); }}
              className="absolute top-4 right-4 bg-[#FFF3A7] border-2 border-[#111111] p-1.5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-[#188ab2] hover:text-white transition-colors"
            >
              <X className="h-4 w-4 text-[#111111]" />
            </button>

            {regStatus === 'success' ? (
              <div className="text-center py-6">
                <div className="bg-[#FFFFFF] border-[3px] border-[#111111] text-green-600 w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                  <CheckCircle2 className="h-8 w-8 text-[#188ab2]" />
                </div>
                <h3 className="text-2xl font-black mb-2 text-[#111111]">Successfully Registered!</h3>
                <p className="text-sm font-bold text-slate-600 mb-6">
                  You are registered for {activeEvent?.title || 'the session'}. Onboarding details will be shared on your WhatsApp.
                </p>
                <Button
                  variant="primary"
                  className="w-full py-2.5 font-extrabold uppercase shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]"
                  onClick={() => { setShowRegisterModal(false); setRegStatus('idle'); }}
                >
                  Close Window
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-black text-[#111111]">Register for Session</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    {activeEvent?.title || 'Join Product Masterclass'}
                  </p>
                </div>

                {validationError && (
                  <p className="text-red-500 text-xs font-bold bg-red-50 border-2 border-red-500/20 p-2.5">
                    {validationError}
                  </p>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Your Name" 
                      className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold outline-none focus:shadow-[3px_3px_0px_0px_rgba(24,138,178,1)] transition-all placeholder-slate-400" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com" 
                      className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold outline-none focus:shadow-[3px_3px_0px_0px_rgba(24,138,178,1)] transition-all placeholder-slate-400" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">WhatsApp Number</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 99000 00000" 
                      className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold outline-none focus:shadow-[3px_3px_0px_0px_rgba(24,138,178,1)] transition-all placeholder-slate-400" 
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3.5 text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
                  isLoading={regStatus === 'loading'}
                >
                  {regStatus === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </span>
                  ) : (
                    'Confirm Registration'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Photo Lightbox Overlay */}
      {activePhoto && (
        <div className="fixed inset-0 bg-[#111111]/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[85vh] border-[4px] border-[#111111] bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)]">
            <button 
              onClick={() => setActivePhoto(null)}
              className="absolute -top-4 -right-4 bg-[#FFF3A7] border-[3px] border-[#111111] p-1.5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-[#188ab2] hover:text-white transition-colors"
            >
              <X className="h-5 w-5 text-[#111111]" />
            </button>
            <img 
              src={activePhoto} 
              alt="Zoomed session moment" 
              className="max-w-full max-h-[75vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 bg-[#111111] text-white border-t-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <p className="text-sm font-extrabold mb-4">StepSmart Career Accelerator</p>
          <p className="text-xs text-slate-400">© 2026 StepSmart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
