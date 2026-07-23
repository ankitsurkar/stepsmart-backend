import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  Download, 
  Search, 
  Plus, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  X, 
  Menu, 
  Users, 
  Share2, 
  ExternalLink, 
  Clock, 
  Tag, 
  FolderArchive, 
  Wrench, 
  GraduationCap, 
  Laptop,
  Check,
  Upload,
  Info
} from 'lucide-react';
import { Logo, Button, NavLink, AnnouncementBanner, saveLeadToDemoDB } from './AppBrutalism';

export const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/BwmKS1htgjW8Tkt9v4fMwD";

export type ResourceItem = {
  id: string;
  title: string;
  category: string; // "Templates" | "Frameworks" | "Interview Guides" | "Case Studies" | "Cheat Sheets"
  type: string;     // "PRD & Specs" | "PDF Guide" | "Playbook" | "Deck Template" | "Cheatsheet"
  format: string;   // "PDF", "Notion", "Figma", "Excel", "Doc"
  description: string;
  aboutText: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  downloadUrl?: string;
  fileSize?: string;
  pageCount?: string;
  readTime?: string;
  tags?: string[];
  bannerBg?: string;
  featured?: boolean;
  downloadCount?: number;
  createdAt?: string;
  whatIsInside?: string[];
};

const LOCAL_STORAGE_KEY = 'pmx_custom_resources';

export const DEMO_RESOURCES: ResourceItem[] = [
  {
    id: "prd-master-template",
    title: "StepSmart Complete PRD Master Template",
    category: "Templates",
    type: "PRD & Specs",
    format: "Notion & PDF",
    description: "Industry-grade Product Requirement Document template used by Microsoft and Tier-1 Tech PMs. Includes problem statement, user stories, success metrics, and edge cases.",
    aboutText: `## StepSmart PRD Master Template

Writing clear, robust Product Requirement Documents (PRDs) is the core superpower of high-performing Product Managers. This master template is modeled after PRD standards used at Microsoft, Mastercard, and top scale-ups.

### What Makes a Great PRD?
- **Clarity over Complexity**: Focus on defining the problem space before jumping into technical solutions.
- **Measurable Impact**: Clear KPI trees connecting feature release to business outcomes.
- **Zero Ambiguity**: Edge-case handling, system dependency mapping, and explicit scope boundaries.

### Template Sections Included:
1. **Executive Summary & Business Justification** (Why now? What business metric does this move?)
2. **User Personas & Pain Point Context** (Who are we solving for?)
3. **User Stories & Acceptance Criteria** (Given / When / Then specifications)
4. **Technical & API Dependency Mapping** (Data contracts, backend triggers)
5. **Success Metrics & Analytics Events** (Mixpanel/Amplitude tracking plan)
6. **Out-of-Scope & Non-Goals** (Explicit guardrails to prevent scope creep)`,
    authorName: "Ankit Surkar",
    authorRole: "Product Manager 2 @ Microsoft",
    authorAvatar: "/mentor-ankit.jpg",
    downloadUrl: "/PM-X-FirstStep-Brochure.pdf",
    fileSize: "2.4 MB",
    pageCount: "12 Pages",
    readTime: "15 min read",
    tags: ["PRD", "NOTION TEMPLATE", "PRODUCT SPECS", "FEATURE DESIGN"],
    bannerBg: "linear-gradient(135deg, #188ab2 0%, #0e4e66 100%)",
    featured: true,
    downloadCount: 482,
    createdAt: "2026-07-01",
    whatIsInside: [
      "Ready-to-use Notion PRD workspace duplicate link",
      "PDF printable reference specification guide",
      "Mixpanel & Amplitude telemetry tracking plan table",
      "RICE feature prioritization scoring calculator"
    ]
  },
  {
    id: "pm-interview-cheatsheet",
    title: "50+ PM Interview Questions & Framework Answers",
    category: "Interview Guides",
    type: "Interview Guide",
    format: "PDF Guide",
    description: "Exhaustive collection of real Product Sense, RCA (Root Cause Analysis), Guesstimate, and Behavioral interview questions with structured answer frameworks.",
    aboutText: `## PM Interview Crack Kit

Cracking Product Management interviews requires structure, clear articulation, and product intuition. This guide breaks down 50+ real questions asked in Google, Microsoft, Flipkart, and Swiggy interviews.

### Core Categories Covered:
- **Product Design & Sense**: "Design an elevator for the elderly", "Improve Spotify for student podcast listeners".
- **Root Cause Analysis (RCA)**: "Uber rides dropped by 12% in Mumbai. How would you debug this?", "Swiggy cart abandonments spiked yesterday."
- **Guesstimates**: "Estimate the monthly revenue of airport lounges in India", "Estimate daily WhatsApp messages sent in Delhi."
- **Behavioral & Leadership**: "Tell me about a time you disagreed with engineering on a feature deadline."

### How to Use This Guide:
1. Master the 4-step Product Design Framework (User -> Pain Points -> Solutions -> Prioritization -> Metrics).
2. Practice out loud with peer case buddies using the structured model answers provided.`,
    authorName: "Sanket Katore",
    authorRole: "Senior PM @ Mastercard",
    authorAvatar: "/mentor-sanket.jpg",
    downloadUrl: "/PM-X-FirstStep-Brochure.pdf",
    fileSize: "4.1 MB",
    pageCount: "35 Pages",
    readTime: "25 min read",
    tags: ["INTERVIEW PREP", "PRODUCT SENSE", "RCA", "GUESSTIMATES"],
    bannerBg: "linear-gradient(135deg, #d97706 0%, #92400e 100%)",
    featured: true,
    downloadCount: 890,
    createdAt: "2026-07-05",
    whatIsInside: [
      "50+ Real interview case questions with transcript answers",
      "RCA debugging flowchart for metric drops",
      "Guesstimate estimation cheatsheet with India & Global baseline numbers",
      "STAR framework behavioral story mapping guide"
    ]
  },
  {
    id: "metrics-kpi-playbook",
    title: "Product Metrics & KPI Tree Playbook",
    category: "Frameworks",
    type: "Playbook",
    format: "PDF & Sheet",
    description: "Step-by-step playbook for constructing defensible KPI trees, defining North Star metrics, measuring unit economics, and analyzing retention cohorts.",
    aboutText: `## Product Metrics & KPI Tree Construction

Great PMs measure what matters. This playbook teaches you how to map high-level business goals down to feature-level telemetry metrics without getting overwhelmed by vanity metrics.

### Key Topics Included:
- **North Star Metric Selection**: How to pick a single metric that balances user value and business profitability.
- **KPI Tree Decomposition**: Breaking down Retention, Activation, Acquisition, and Monetization into sub-metrics.
- **Unit Economics Essentials**: LTV, CAC, Payback Period, Churn Rate, and Expansion ARR calculations.
- **Cohort & Retention Analysis**: Interpreting D1, D7, and D30 retention curves.`,
    authorName: "Pankaj Sharma",
    authorRole: "Senior PM @ Shopdeck",
    authorAvatar: "/mentor-pankaj.jpg",
    downloadUrl: "/PM-X-Accelerator-Brochure.pdf",
    fileSize: "3.2 MB",
    pageCount: "20 Pages",
    readTime: "20 min read",
    tags: ["METRICS", "KPI TREE", "UNIT ECONOMICS", "RETENTION"],
    bannerBg: "linear-gradient(135deg, #059669 0%, #064e3b 100%)",
    featured: false,
    downloadCount: 310,
    createdAt: "2026-07-10",
    whatIsInside: [
      "Visual KPI Tree diagrams for B2B SaaS, E-commerce, and FinTech",
      "LTV/CAC and Retention Curve calculation templates",
      "Funnel conversion drop-off audit checklist",
      "A/B testing sample size & statistical significance guide"
    ]
  },
  {
    id: "product-strategy-roadmap",
    title: "0-to-1 Product Strategy & Roadmap Deck",
    category: "Templates",
    type: "Deck Template",
    format: "Figma & Slides",
    description: "Executive-ready presentation deck template for pitching product vision, quarterly roadmaps, TAM sizing, and Go-to-Market strategies.",
    aboutText: `## 0-to-1 Product Strategy Deck

Whether pitching to stakeholders, leadership, or interview panels, your pitch deck must convey strategy, clarity, and execution confidence.

### Deck Outline Included:
- **Problem Statement & Opportunity Space**
- **TAM / SAM / SOM Market Sizing**
- **Competitive Advantage & Defensible Moats**
- **3-Horizon Product Roadmap (Now / Next / Later)**
- **Go-to-Market (GTM) Launch Strategy**`,
    authorName: "StepSmart Mentors",
    authorRole: "Microsoft & Mastercard Mentors",
    authorAvatar: "/stepsmart-logo.png",
    downloadUrl: "/PM-X-Accelerator-Brochure.pdf",
    fileSize: "5.8 MB",
    pageCount: "18 Slides",
    readTime: "10 min read",
    tags: ["ROADMAP", "STRATEGY", "PITCH DECK", "GTM"],
    bannerBg: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
    featured: false,
    downloadCount: 620,
    createdAt: "2026-07-12",
    whatIsInside: [
      "18 Custom customizable brutalist presentation slide templates",
      "TAM/SAM/SOM market sizing calculator slides",
      "Quarterly Roadmap visual timelines (Now / Next / Later)",
      "Competitive benchmarking grid layout"
    ]
  },
  {
    id: "rca-guesstimates-kit",
    title: "Root Cause Analysis (RCA) & Problem Solving Kit",
    category: "Case Studies",
    type: "Problem Kit",
    format: "PDF Guide",
    description: "Master RCA interview rounds with step-by-step formulas to isolate technical glitches, UX friction, external factors, and algorithm changes.",
    aboutText: `## RCA & Problem Solving Masterkit

Root Cause Analysis (RCA) is one of the most critical elimination rounds in PM hiring. Interviewers check whether you systematically isolate variables or guess randomly.

### The 5-Step RCA Debugging Framework:
1. **Clarify the Metric & Scope**: Confirm definition, time window, region, and platform (iOS/Android/Web).
2. **Internal vs External Check**: Was there a code deployment? Was there a regional holiday or competitor launch?
3. **Funnel Segmentation**: Break down by user segment, acquisition channel, device OS, and app version.
4. **Isolate the Root Cause**: Identify whether it's a technical bug, supply deficit, UX failure, or fraud.
5. **Mitigation & Long-term Fix**: Immediate rollback/hotfix + permanent monitoring alert.`,
    authorName: "Sanket Katore",
    authorRole: "Senior PM @ Mastercard",
    authorAvatar: "/mentor-sanket.jpg",
    downloadUrl: "/PM-X-FirstStep-Brochure.pdf",
    fileSize: "1.9 MB",
    pageCount: "14 Pages",
    readTime: "12 min read",
    tags: ["RCA", "DEBUGGING", "ANALYTICS", "PROBLEM SOLVING"],
    bannerBg: "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)",
    featured: false,
    downloadCount: 275,
    createdAt: "2026-07-15",
    whatIsInside: [
      "Diagnostic decision tree for revenue & conversion drops",
      "10 Mock RCA interview transcripts with feedback notes",
      "System health telemetry dashboard setup guide"
    ]
  },
  {
    id: "ai-pm-handbook",
    title: "AI PM Technical & System Architecture Handbook",
    category: "Cheat Sheets",
    type: "Technical Guide",
    format: "PDF & Doc",
    description: "Essential technical depth guide for PMs building AI-native applications. Covers LLMs, RAG, vector databases, API latency, and prompt evaluations.",
    aboutText: `## AI Product Manager's Handbook

As AI becomes integral to modern software, PMs must understand system architecture, latency trade-offs, token costs, and evaluation frameworks.

### What Every AI PM Must Know:
- **LLM Basics & Token Economics**: Understanding context windows, token pricing, and latency vs accuracy trade-offs.
- **RAG Architecture**: Retrieval-Augmented Generation pipeline (Embeddings -> Vector DB -> Context Injection -> LLM).
- **Evaluation & Guardrails**: Measuring Hallucination rates, ROUGE/BLEU scores, and safety filters.
- **Prompt Engineering for PMs**: Few-shot prompting, system instructions, and structured JSON output schema enforcement.`,
    authorName: "Ankit Surkar",
    authorRole: "Product Manager 2 @ Microsoft (AI Lead)",
    authorAvatar: "/mentor-ankit.jpg",
    downloadUrl: "/PM-X-Accelerator-Brochure.pdf",
    fileSize: "3.8 MB",
    pageCount: "22 Pages",
    readTime: "18 min read",
    tags: ["AI PM", "SYSTEM DESIGN", "LLM", "RAG", "TECHNICAL"],
    bannerBg: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
    featured: true,
    downloadCount: 710,
    createdAt: "2026-07-18",
    whatIsInside: [
      "Visual AI & RAG system architecture diagram",
      "Token cost calculator spreadsheet for LLM API budgeting",
      "AI model evaluation criteria matrix (Accuracy, Latency, Cost)",
      "Sample JSON schemas for structured LLM API responses"
    ]
  }
];

export function ResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Upload Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [newResource, setNewResource] = useState({
    title: '',
    category: 'Templates',
    type: 'PRD & Specs',
    format: 'PDF',
    description: '',
    aboutText: '',
    authorName: '',
    authorRole: '',
    downloadUrl: '',
    whatIsInsideText: ''
  });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeResourceId = searchParams.get('id');

  // Load resources from localStorage + DEMO_RESOURCES
  useEffect(() => {
    const loadResources = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const customItems: ResourceItem[] = stored ? JSON.parse(stored) : [];
        const combined = [...customItems, ...DEMO_RESOURCES.filter(d => !customItems.some(c => c.id === d.id))];
        setResources(combined);
      } catch (e) {
        setResources(DEMO_RESOURCES);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, []);

  const categories = ["All", "Templates", "Frameworks", "Interview Guides", "Case Studies", "Cheat Sheets"];

  // Filter resources
  const filteredResources = resources.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // Find active resource details
  const activeResource = resources.find(r => r.id === activeResourceId);

  const handleOpenResource = (id: string) => {
    setSearchParams({ id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseResource = () => {
    searchParams.delete('id');
    setSearchParams(searchParams);
  };

  const handleDownloadTrigger = (resource: ResourceItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Save lead/analytics trigger
    saveLeadToDemoDB({
      fullName: "Resource Downloader",
      email: "resource_download@stepsmart.net",
      phone: "+91 9900000000",
      intent: "resource_download",
      resourceTitle: resource.title
    });

    const url = resource.downloadUrl || "/PM-X-FirstStep-Brochure.pdf";
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Upload Resource Handler
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title.trim() || !newResource.description.trim()) {
      return;
    }

    const insideList = newResource.whatIsInsideText
      ? newResource.whatIsInsideText.split('\n').filter(line => line.trim() !== '')
      : [
          "Complete downloadable framework and guide",
          "Step-by-step execution roadmap",
          "Mentored case examples and breakdown"
        ];

    const createdItem: ResourceItem = {
      id: `custom-res-${Date.now()}`,
      title: newResource.title,
      category: newResource.category,
      type: newResource.type || "Guide",
      format: newResource.format || "PDF",
      description: newResource.description,
      aboutText: newResource.aboutText || `## ${newResource.title}\n\n${newResource.description}\n\n### Key Highlights\n- **Structured Framework**: Designed for quick application in PM projects.\n- **Practical Insights**: Clear, actionable takeaways for product teams.`,
      authorName: newResource.authorName || "StepSmart Community",
      authorRole: newResource.authorRole || "Product Management Mentor",
      authorAvatar: "/stepsmart-logo.png",
      downloadUrl: newResource.downloadUrl || "/PM-X-FirstStep-Brochure.pdf",
      fileSize: "2.5 MB",
      pageCount: "10 Pages",
      readTime: "10 min read",
      tags: [newResource.category.toUpperCase(), newResource.type.toUpperCase(), "COMMUNITY RESOURCE"],
      bannerBg: "linear-gradient(135deg, #188ab2 0%, #111111 100%)",
      downloadCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
      whatIsInside: insideList
    };

    const updated = [createdItem, ...resources];
    setResources(updated);

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const customItems: ResourceItem[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([createdItem, ...customItems]));
    } catch (err) {
      console.error("Failed to store custom resource", err);
    }

    setShowUploadModal(false);
    setNewResource({
      title: '',
      category: 'Templates',
      type: 'PRD & Specs',
      format: 'PDF',
      description: '',
      aboutText: '',
      authorName: '',
      authorRole: '',
      downloadUrl: '',
      whatIsInsideText: ''
    });

    // Automatically open the detail view of the newly uploaded resource!
    handleOpenResource(createdItem.id);
  };

  const parseMarkdown = (text: string) => {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-extrabold mt-6 mb-2 text-[#111111]">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-extrabold mt-8 mb-3 border-b-2 border-[#111111] pb-1 text-[#111111]">$1</h2>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold">$1</strong>');
    html = html.replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc font-bold text-slate-700">$1</li>');
    html = html.replace(/\n\n/g, '</p><p class="mb-4 text-[#111111] leading-relaxed text-sm font-bold">');
    html = '<p class="mb-4 text-[#111111] leading-relaxed text-sm font-bold">' + html + '</p>';
    html = html.replace(/<p class=".*?"><\/p>/g, '');
    return html;
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
              <NavLink href="/#who-is-it-for">Who is it for?</NavLink>
              <NavLink href="https://wa.me/919920803517?text=Hi%2C%20I%27m%20interested%20in%20PM-X%20%E2%80%94%20here%27s%20my%20background%3A" target="_blank" rel="noreferrer">Chat 1:1</NavLink>
              <NavLink href="/#mentors">Mentors</NavLink>
              <Link to="/events" className="font-extrabold text-sm text-[#111111] hover:text-[#188ab2] transition-colors">Events</Link>
              <Link to="/blog" className="font-extrabold text-sm text-[#111111] hover:text-[#188ab2] transition-colors">Blog</Link>
              <Link to="/resources" className="relative px-3 py-1.5 text-[#111111] font-extrabold text-sm select-none">
                <span className="relative z-10">Resources</span>
                <span className="absolute left-0 right-0 bottom-[-2px] h-1.5 bg-[#FFF3A7] z-0"></span>
              </Link>
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
          <div className="md:hidden w-full bg-[#FFFFFF] border-b-[3px] border-[#111111] p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
            <a href="/#who-is-it-for" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Who is it for?</a>
            <a href="https://wa.me/919920803517?text=Hi%2C%20I%27m%20interested%20in%20PM-X%20%E2%80%94%20here%27s%20my%20background%3A" target="_blank" rel="noreferrer" className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Chat 1:1</a>
            <a href="/#mentors" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Mentors</a>
            <Link to="/events" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Events</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Blog</Link>
            <Link to="/resources" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200 text-[#188ab2]">Resources</Link>
            <a href="/learn" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-6 py-2.5 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] font-extrabold transition-all">Login</a>
            <Button variant="primary" className="w-full" onClick={() => { setIsMenuOpen(false); navigate('/#enroll'); }}>Apply Now</Button>
          </div>
        )}
      </div>

      {/* Resource Detail View */}
      {activeResource ? (
        <div className="pt-36 pb-20 bg-[#FFFFFF]">
          <div className="container mx-auto px-6 max-w-5xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6 select-none">
              <Link to="/" className="hover:text-[#111111]">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/resources" onClick={handleCloseResource} className="hover:text-[#111111]">Resources</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#111111] truncate max-w-xs">{activeResource.title}</span>
            </div>

            {/* Back Button */}
            <button 
              onClick={handleCloseResource}
              className="inline-flex items-center gap-2 text-[#188ab2] font-extrabold hover:underline underline-offset-4 decoration-2 mb-8 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all resources
            </button>

            {/* Title Header */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-3 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] select-none">
                {activeResource.category}
              </span>
              <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-3 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] select-none">
                {activeResource.format}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-[#111111] leading-tight mb-8">
              {activeResource.title}
            </h1>

            {/* Main 2-Column Detail Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left Column: Cover preview, Author, Highlights, Content */}
              <div className="lg:col-span-2 space-y-8 text-left">
                {/* Visual Cover Box */}
                <div 
                  className="w-full aspect-video border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-center items-center p-8 text-white text-center"
                  style={{ background: activeResource.bannerBg || 'linear-gradient(135deg, #188ab2 0%, #111111 100%)' }}
                >
                  <div className="w-16 h-16 bg-[#FFF3A7] border-[3px] border-[#111111] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] mb-4 rotate-[-2deg]">
                    <FileText className="h-8 w-8 text-[#111111]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black leading-tight uppercase max-w-lg mb-2">
                    {activeResource.title}
                  </h2>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    StepSmart Verified PM Resource • {activeResource.format}
                  </p>
                </div>

                {/* Author Info Card */}
                <div className="bg-white border-[3px] border-[#111111] p-5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full border-2 border-[#111111] bg-[#FFF3A7] overflow-hidden flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] shrink-0">
                    {activeResource.authorAvatar ? (
                      <img src={activeResource.authorAvatar} alt={activeResource.authorName} className="w-full h-full object-cover object-top" />
                    ) : (
                      activeResource.authorName[0]
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-[#111111]">{activeResource.authorName}</span>
                      <span className="bg-[#188ab2] text-white border border-[#111111] text-[9px] font-extrabold px-2 py-0.5 uppercase">VERIFIED PM</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">{activeResource.authorRole}</p>
                  </div>
                </div>

                {/* What's Inside Checklist */}
                {activeResource.whatIsInside && activeResource.whatIsInside.length > 0 && (
                  <div className="bg-[#FFF3A7]/30 border-[3px] border-[#111111] p-6 shadow-[5px_5px_0px_0px_rgba(17,17,17,1)] space-y-3">
                    <h3 className="text-base font-black uppercase text-[#111111] tracking-wider border-b-2 border-[#111111]/20 pb-2">
                      What's Inside This Resource:
                    </h3>
                    <ul className="space-y-2.5">
                      {activeResource.whatIsInside.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs font-bold text-[#111111]">
                          <span className="w-5 h-5 bg-[#188ab2] text-white border border-[#111111] rounded-full flex items-center justify-center text-[10px] shrink-0 font-black">
                            ✓
                          </span>
                          <span className="mt-0.5">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Detailed Overview Markdown/HTML */}
                <div className="border-t-2 border-[#111111]/10 pt-6">
                  <h3 className="text-xl font-black mb-4">Detailed Overview</h3>
                  <div 
                    className="prose prose-slate max-w-none text-sm text-[#111111] leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(activeResource.aboutText) }}
                  />
                </div>

              </div>

              {/* Right Column: Sticky Download & Metadata Card */}
              <div className="space-y-6 text-left">
                <div className="bg-white border-[3px] border-[#111111] p-6 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] sticky top-28 space-y-6">
                  
                  {/* File Metadata */}
                  <div className="space-y-3 border-b-2 border-[#111111]/10 pb-6">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Resource Specifications</h4>
                    
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Format:</span>
                      <span className="font-extrabold text-[#111111]">{activeResource.format}</span>
                    </div>

                    {activeResource.fileSize && (
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500">File Size:</span>
                        <span className="font-extrabold text-[#111111]">{activeResource.fileSize}</span>
                      </div>
                    )}

                    {activeResource.pageCount && (
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500">Length:</span>
                        <span className="font-extrabold text-[#111111]">{activeResource.pageCount}</span>
                      </div>
                    )}

                    {activeResource.readTime && (
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500">Estimated Time:</span>
                        <span className="font-extrabold text-[#111111]">{activeResource.readTime}</span>
                      </div>
                    )}

                    {activeResource.downloadCount && (
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500">Downloads:</span>
                        <span className="font-extrabold text-[#188ab2]">{activeResource.downloadCount}+ PMs</span>
                      </div>
                    )}
                  </div>

                  {/* Primary CTA Buttons */}
                  <div className="space-y-3">
                    <Button 
                      variant="primary" 
                      onClick={() => handleDownloadTrigger(activeResource)}
                      className="w-full py-4 font-extrabold text-sm uppercase shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" /> Download Resource ➜
                    </Button>

                    <a 
                      href={WHATSAPP_COMMUNITY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block text-center bg-white text-[#111111] border-[3px] border-[#111111] py-3.5 px-4 font-extrabold text-xs uppercase shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:bg-slate-50 transition-all select-none cursor-pointer"
                    >
                      Join PM Community ➜
                    </a>
                  </div>

                  {/* Tags */}
                  {activeResource.tags && (
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-extrabold uppercase text-slate-400 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {activeResource.tags.map((t, idx) => (
                          <span key={idx} className="bg-slate-100 border border-[#111111] text-[#111111] text-[9px] font-bold px-2 py-0.5">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* Regular Resource Listing Page */
        <>
          {/* Hero Section */}
          <section className="pt-40 pb-16 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
            <div className="container mx-auto px-6 max-w-5xl text-center">
              <div className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-6 py-2 font-extrabold text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none mb-6 rotate-[-1deg]">
                StepSmart Knowledge Hub
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-[#111111] leading-tight">
                Product Management{' '}
                <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                  Resources & Kits
                </span>
              </h1>
              <p className="text-lg md:text-xl text-[#111111] max-w-2xl mx-auto leading-relaxed font-bold mb-10">
                Curated PRD templates, interview cheat sheets, KPI frameworks, and strategic pitch decks built by Microsoft and Mastercard PMs.
              </p>

              {/* Upload Resource Trigger CTA */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button 
                  variant="primary" 
                  onClick={() => setShowUploadModal(true)}
                  className="px-8 py-4 font-extrabold text-base uppercase shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" /> Upload / Share Resource
                </Button>
                <a 
                  href={WHATSAPP_COMMUNITY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-white text-[#111111] border-[3px] border-[#111111] font-extrabold text-base uppercase shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:bg-[#FFF3A7] transition-all select-none cursor-pointer"
                >
                  Join PM Community ➜
                </a>
              </div>
            </div>
          </section>

          {/* Search & Category Filter Section */}
          <section className="py-8 bg-[#F8FAFC] border-b-[3px] border-[#111111]">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                
                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start select-none">
                  {categories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 text-xs font-black uppercase border-[2.5px] border-[#111111] transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#188ab2] text-white shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] translate-x-[-1px] translate-y-[-1px]'
                          : 'bg-white text-[#111111] hover:bg-[#FFF3A7] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search templates, PRDs, RCA..."
                    className="w-full pl-10 pr-4 py-2.5 border-[3px] border-[#111111] bg-white font-bold text-xs outline-none focus:shadow-[3px_3px_0px_0px_rgba(24,138,178,1)] transition-all placeholder-[#111111]/50"
                  />
                  <Search className="h-4 w-4 text-[#111111] absolute left-3.5 top-3" />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')} 
                      className="absolute right-3 top-3 text-xs font-black text-slate-400 hover:text-[#111111]"
                    >
                      ✕
                    </button>
                  )}
                </div>

              </div>
            </div>
          </section>

          {/* Main Resource Cards Grid */}
          <main className="py-16 bg-[#FFFFFF]">
            <div className="container mx-auto px-6 max-w-6xl">
              
              {loading ? (
                <div className="flex justify-center py-16">
                  <span className="text-lg font-bold">Loading resources...</span>
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="border-[3px] border-[#111111] p-12 text-center bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] max-w-xl mx-auto">
                  <Info className="h-10 w-10 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-xl font-extrabold text-[#111111] mb-2">No matching resources found</h3>
                  <p className="text-sm font-bold text-slate-500 mb-6">Try clearing your search query or uploading a new resource.</p>
                  <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredResources.map((resource) => (
                    <div 
                      key={resource.id}
                      onClick={() => handleOpenResource(resource.id)}
                      className="bg-white border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2.5px] hover:translate-y-[-2.5px] hover:shadow-[8.5px_8.5px_0px_0px_rgba(17,17,17,1)] transition-all flex flex-col justify-between cursor-pointer text-left select-none group"
                    >
                      <div>
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-[#111111]/10">
                          <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                            {resource.category}
                          </span>
                          <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-2.5 py-0.5 font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                            {resource.format}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-black text-[#111111] mb-3 leading-snug group-hover:text-[#188ab2] transition-colors">
                          {resource.title}
                        </h3>

                        {/* Short Description */}
                        <p className="text-xs font-bold text-slate-600 leading-relaxed mb-6 line-clamp-3">
                          {resource.description}
                        </p>

                        {/* Author Info */}
                        <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3 border-2 border-[#111111]">
                          <div className="w-8 h-8 rounded-full border border-[#111111] bg-[#FFF3A7] overflow-hidden shrink-0 flex items-center justify-center font-black text-xs">
                            {resource.authorAvatar ? (
                              <img src={resource.authorAvatar} alt={resource.authorName} className="w-full h-full object-cover object-top" />
                            ) : (
                              resource.authorName[0]
                            )}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-black text-[#111111] truncate">{resource.authorName}</p>
                            <p className="text-[10px] font-bold text-slate-400 truncate">{resource.authorRole}</p>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-4 border-t-2 border-[#111111]/10 flex items-center gap-3">
                        <Button 
                          variant="primary" 
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleOpenResource(resource.id); }}
                          className="flex-1 py-2.5 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]"
                        >
                          View Details ➜
                        </Button>
                        <button 
                          onClick={(e) => handleDownloadTrigger(resource, e)}
                          title="Download Resource"
                          className="p-2.5 bg-white border-2 border-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-[#FFF3A7] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                        >
                          <Download className="h-4 w-4 text-[#111111]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </main>
        </>
      )}

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-[#111111]/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl border-[4px] border-[#111111] bg-white p-8 shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] text-left my-8">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 bg-[#FFF3A7] border-2 border-[#111111] p-1.5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-[#188ab2] hover:text-white transition-colors"
            >
              <X className="h-5 w-5 text-[#111111]" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFF3A7] border-2 border-[#111111] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                <Upload className="h-5 w-5 text-[#111111]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#111111]">Upload New Resource</h3>
                <p className="text-xs font-bold text-slate-500">Share your PRD template, case study, or cheatsheet with the PM community.</p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#111111] mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  placeholder="e.g. B2B SaaS Launch Checklist & PRD"
                  className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold text-xs outline-none focus:shadow-[3px_3px_0px_0px_rgba(24,138,178,1)] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#111111] mb-1">Category</label>
                  <select
                    value={newResource.category}
                    onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                    className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold text-xs outline-none focus:shadow-[3px_3px_0px_0px_rgba(24,138,178,1)] transition-all"
                  >
                    <option value="Templates">Templates</option>
                    <option value="Frameworks">Frameworks</option>
                    <option value="Interview Guides">Interview Guides</option>
                    <option value="Case Studies">Case Studies</option>
                    <option value="Cheat Sheets">Cheat Sheets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#111111] mb-1">Format</label>
                  <input
                    type="text"
                    value={newResource.format}
                    onChange={(e) => setNewResource({ ...newResource, format: e.target.value })}
                    placeholder="e.g. PDF, Notion, Figma"
                    className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold text-xs outline-none focus:shadow-[3px_3px_0px_0px_rgba(24,138,178,1)] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#111111] mb-1">Your Name</label>
                  <input
                    type="text"
                    value={newResource.authorName}
                    onChange={(e) => setNewResource({ ...newResource, authorName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold text-xs outline-none focus:shadow-[3px_3px_0px_0px_rgba(24,138,178,1)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#111111] mb-1">Your Role / Company</label>
                  <input
                    type="text"
                    value={newResource.authorRole}
                    onChange={(e) => setNewResource({ ...newResource, authorRole: e.target.value })}
                    placeholder="e.g. Associate PM @ Swiggy"
                    className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold text-xs outline-none focus:shadow-[3px_3px_0px_0px_rgba(24,138,178,1)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#111111] mb-1">Short Card Description *</label>
                <textarea
                  required
                  rows={2}
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  placeholder="Brief 2-sentence summary shown on the resource card..."
                  className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold text-xs outline-none focus:shadow-[3px_3px_0px_0px_rgba(24,138,178,1)] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#111111] mb-1">What's Inside (One per line)</label>
                <textarea
                  rows={3}
                  value={newResource.whatIsInsideText}
                  onChange={(e) => setNewResource({ ...newResource, whatIsInsideText: e.target.value })}
                  placeholder="Key takeaway 1&#10;Key takeaway 2&#10;Key takeaway 3"
                  className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold text-xs outline-none focus:shadow-[3px_3px_0px_0px_rgba(24,138,178,1)] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#111111] mb-1">Detailed Content & Overview (Markdown allowed)</label>
                <textarea
                  rows={4}
                  value={newResource.aboutText}
                  onChange={(e) => setNewResource({ ...newResource, aboutText: e.target.value })}
                  placeholder="Detailed breakdown of sections, formulas, instructions..."
                  className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold text-xs outline-none focus:shadow-[3px_3px_0px_0px_rgba(24,138,178,1)] transition-all"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full py-4 text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px]"
                >
                  Publish & View Resource Details ➜
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#FFFFFF] py-12 border-t-[3px] border-[#111111]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 mb-16 text-left">
            <div className="col-span-1">
              <Logo toHome={true} />
              <p className="text-[#111111] text-sm leading-relaxed max-w-xs mt-8 font-bold">
                PM-X Knowledge Hub. Download verified PRD specifications, interview guides, and frameworks.
              </p>
            </div>
            <div>
              <h4 className="font-extrabold text-[#111111] mb-6">Quick Links</h4>
              <ul className="space-y-4 text-[#111111] text-sm font-bold">
                <li><Link to="/professionals" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Professionals Page</Link></li>
                <li><Link to="/students" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Students Page</Link></li>
                <li><Link to="/events" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Events</Link></li>
                <li><Link to="/blog" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Blog</Link></li>
                <li><Link to="/resources" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4 text-[#188ab2]">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold text-[#111111] mb-6">Join Our Community</h4>
              <p className="text-[#111111] text-sm mb-6 leading-relaxed font-bold">
                Get real-time feedback on your PRDs and practice mock cases with mentors and peers.
              </p>
              <a 
                href={WHATSAPP_COMMUNITY_URL} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#188ab2] font-extrabold hover:underline underline-offset-4 decoration-2 decoration-[#188ab2]"
              >
                Join the WhatsApp Community <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="pt-12 border-t-[3px] border-[#111111] flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[#111111] text-[10px] font-bold uppercase tracking-widest">© 2026 StepSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
