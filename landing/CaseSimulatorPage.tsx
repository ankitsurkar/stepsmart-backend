import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calculator,
  ArrowRight,
  Layers,
  ArrowLeft,
  Check,
  Zap,
  Info
} from 'lucide-react';

interface CaseData {
  id: string;
  badge: string;
  title: string;
  casePrompt: string;
  clarifyingPrompt: string;
  interviewerData: Array<{ label: string; value: string }>;
  otherRequestedInfo: string;
  rubric: {
    dimensions: Array<{
      id: string;
      label: string;
      keywords: string[];
      whatWorkedSnippet: string;
      blindspotSnippet: string;
      isCritical: boolean;
    }>;
  };
  sampleQuestions: {
    excellent: string;
    partial: string;
  };
  referenceCalculation: {
    frameworkTitle: string;
    steps: Array<{ title: string; math: string; explanation: string }>;
    finalAnswer: string;
    sanityCheck: string;
  };
}

const CASES: Record<string, CaseData> = {
  ram_setu: {
    id: 'ram_setu',
    badge: 'ANCIENT GUESSTIMATE • PRODUCT DISCOVERY',
    title: 'Ram Setu Stone Estimation',
    casePrompt:
      'King Rama’s Vanara Sena reaches the southern coast of Dhanushkodi. Across the tumultuous Palk Strait lies Lanka, 48 km away. To march an army of millions and heavy supply carts across the ocean, the master architects Nila and Nal must construct a floating stone causeway (Ram Setu). You are appointed Chief Estimation PM for the royal engineering corps.',
    clarifyingPrompt: 'What clarifying questions would you ask before your analysis?',
    interviewerData: [
      {
        label: 'Causeway Span / Distance',
        value: 'Approximately 48 kilometers (~30 miles) across the Palk Strait from Dhanushkodi to Talaimannar.'
      },
      {
        label: 'Causeway Width',
        value: '30 meters wide (designed to safely accommodate 10 vanara infantry ranks + heavy siege chariots marching abreast).'
      },
      {
        label: 'Ocean Depth & Seabed Topography',
        value: 'Average water depth along the natural limestone shoal is 3.0 meters. The bridge surface must rise 0.5 meters above high tide (total causeway height from seabed = 3.5 meters).'
      },
      {
        label: 'Stone Unit Dimensions',
        value: 'Natural boulders cut from the Gandhamadana mountain range average roughly 1.0 m × 1.0 m × 1.0 m (unit volume = 1.0 m³ each).'
      },
      {
        label: 'Packing Density & Void Porosity',
        value: 'Natural irregular interlocking boulders leave roughly 20% interstitial voids / water pockets (effective stone volume ratio = 80%).'
      }
    ],
    otherRequestedInfo:
      'If you asked about anything not listed above (e.g. tides variation, rock density, specific gravity of floating pumice stones), it is not in the case yet. Make a reasonable assumption, state it, and keep going.',
    rubric: {
      dimensions: [
        {
          id: 'span',
          label: 'Causeway Length / Distance',
          keywords: ['length', 'distance', 'span', 'far', 'km', 'kilometer', 'long', 'across'],
          whatWorkedSnippet: 'You identified the macro spatial dimension by probing the total length across the ocean.',
          blindspotSnippet: 'You did not clarify the total distance of the causeway across the Palk Strait.',
          isCritical: true
        },
        {
          id: 'width',
          label: 'Causeway Width / Lanes',
          keywords: ['width', 'wide', 'breadth', 'lanes', 'army', 'march', 'size of bridge', 'cross section'],
          whatWorkedSnippet: 'Smart PM instinct to interrogate bridge width based on traffic and throughput requirements.',
          blindspotSnippet: 'You overlooked cross-sectional width. A bridge designed for single-file troops vs 10 ranks with supply wagons differs by 10x in volume.',
          isCritical: true
        },
        {
          id: 'depth',
          label: 'Water Depth / Submerged Foundation',
          keywords: ['depth', 'deep', 'height', 'water', 'seabed', 'sea level', 'tide', 'ocean floor', 'submerged'],
          whatWorkedSnippet: 'Outstanding 3D spatial modeling: you recognized that in marine engineering, the majority of volume sits submerged below the surface.',
          blindspotSnippet: 'Your setup was flat (2D length × width) and completely missed water depth. Without depth, you cannot calculate the 3D volume of the causeway foundation.',
          isCritical: true
        },
        {
          id: 'stone_size',
          label: 'Boulder / Stone Unit Size',
          keywords: ['stone', 'boulder', 'rock', 'size', 'dimension', 'volume of stone', 'cubic', 'meter'],
          whatWorkedSnippet: 'You accurately recognized that unit stone volume serves as the denominator for the estimation formula.',
          blindspotSnippet: 'You asked about the bridge but forgot to clarify stone dimensions. A boulder of 0.1 m³ vs 1 m³ changes the answer by an entire order of magnitude.',
          isCritical: true
        },
        {
          id: 'porosity',
          label: 'Packing Voids / Porosity',
          keywords: ['gap', 'void', 'space', 'porosity', 'packing', 'interlock', 'fit', 'density', 'air'],
          whatWorkedSnippet: 'Advanced engineering rigor: you questioned interlocking gaps and packing porosity instead of assuming 100% solid stone block density.',
          blindspotSnippet: 'You assumed the bridge is a solid concrete slab. Natural irregular boulders leave 15–25% interstitial gaps, which significantly reduces total stone requirements.',
          isCritical: false
        }
      ]
    },
    sampleQuestions: {
      excellent:
        '1. What is the total length/span of the causeway from India to Lanka?\n2. How wide must the bridge be to accommodate the army?\n3. What is the average water depth of the Palk Strait along this path?\n4. What are the typical dimensions or volume of an individual stone?\n5. Are stones placed with mortar or stacked naturally with void gaps?',
      partial:
        '1. How long is the bridge?\n2. What is the deadline to build it?\n3. How many vanaras are working on the construction?'
    },
    referenceCalculation: {
      frameworkTitle: 'Volume Decomposition Framework (Macro-to-Micro)',
      steps: [
        {
          title: '1. Gross Causeway Volume (L × W × H)',
          math: '48,000 m (Length) × 30 m (Width) × 3.5 m (Depth + Freeboard) = 5,040,000 m³',
          explanation:
            'Convert 48 km into 48,000 meters. The height comprises 3m submerged foundation to the seabed + 0.5m clearance above high tide.'
        },
        {
          title: '2. Deduct Void Porosity (Interlocking Gaps)',
          math: '5,040,000 m³ × (1 - 0.20 Packing Voids) = 4,032,000 m³ of solid stone',
          explanation:
            'Irregular boulders do not pack with 100% efficiency. Deducting 20% void space prevents overestimating the stone quarrying requirement.'
        },
        {
          title: '3. Total Stone Count Calculation',
          math: '4,032,000 m³ ÷ 1.0 m³ per stone = 4,032,000 stones (~4.03 Million Boulders)',
          explanation:
            'Dividing total required solid volume by unit stone volume gives the exact count required.'
        }
      ],
      finalAnswer: '≈ 4.0 Million Stones (4,032,000 boulders)',
      sanityCheck:
        'Reality Sanity Check: If 10,000 Vanaras work concurrently and each places 1 stone every 5 minutes (12 stones/hr × 10 hrs = 120 stones/day/worker = 1.2M stones/day), the causeway can be completed in approximately 3.4 days. This closely aligns with the Valmiki Ramayana account of a 5-day rapid construction!'
    }
  },

  urbanbrew: {
    id: 'urbanbrew',
    badge: 'PROFITABILITY CASE • CONSULTING & PM INTERVIEW',
    title: 'UrbanBrew Profitability Drop',
    casePrompt:
      'UrbanBrew, a regional coffee chain with 85 stores, saw EBITDA drop from $24M in 2023 to $12M in 2024 while revenue grew from $100M to $120M. The CEO wants to know the main cause and what actions can quickly improve profitability.',
    clarifyingPrompt: 'What clarifying questions would you ask before your analysis?',
    interviewerData: [
      {
        label: 'Revenue & Volume Growth',
        value: 'Revenue grew 20% ($100M to $120M) driven primarily by adding 25 new stores (store count increased from 60 to 85). Same-store sales (organic growth) were flat (+1%).'
      },
      {
        label: 'Cost of Goods Sold (COGS)',
        value: 'Coffee bean & dairy wholesale prices were stable; COGS rose proportionally from $25M to $30M (constant at 25% of revenue).'
      },
      {
        label: 'Labor & Operating Expenses (The Leak)',
        value: 'Store-level wages and manager overtime surged from $38M to $62M (from 38% to 51.6% of revenue) due to aggressive rush-hour overstaffing in newly opened suburban locations.'
      },
      {
        label: 'Rent & Overhead',
        value: 'Fixed store leases and headquarters administrative SG&A increased moderately from $13M to $16M in line with store expansion.'
      }
    ],
    otherRequestedInfo:
      'If you asked about anything not listed above (e.g. competitor actions, marketing ad spend, customer demographics), it is not in the case yet. Make a reasonable assumption, state it, and keep going.',
    rubric: {
      dimensions: [
        {
          id: 'revenue_drivers',
          label: 'Revenue Composition (Price vs Volume vs Expansion)',
          keywords: ['revenue', 'growth', 'price', 'volume', 'new stores', 'same store', 'organic', 'pricing'],
          whatWorkedSnippet: 'You identified a key financial metric to interrogate by asking about the nature of revenue growth.',
          blindspotSnippet: 'You did not break down revenue growth into same-store sales vs new store expansion.',
          isCritical: true
        },
        {
          id: 'cogs',
          label: 'Cost of Goods Sold (Ingredients & Packaging)',
          keywords: ['cogs', 'beans', 'milk', 'supplier', 'raw material', 'ingredients', 'cost of goods'],
          whatWorkedSnippet: 'You correctly investigated whether supply chain inflation or commodity coffee prices squeezed gross margins.',
          blindspotSnippet: 'You missed checking gross margins and ingredient unit costs.',
          isCritical: false
        },
        {
          id: 'labor',
          label: 'Labor Costs & Store Staffing',
          keywords: ['labor', 'wages', 'staff', 'employee', 'overtime', 'headcount', 'hourly', 'salary'],
          whatWorkedSnippet: 'Superb instinct: labor is consistently the largest variable operating cost in retail and food service.',
          blindspotSnippet: 'Your setup was too narrow and missed major cost categories like store labor and hourly overtime.',
          isCritical: true
        },
        {
          id: 'store_footprint',
          label: 'Store Footprint & Unit Economics',
          keywords: ['store', 'location', 'rent', 'lease', 'expansion', 'footprint', 'capex'],
          whatWorkedSnippet: 'You asked about store footprint and geographic rollout cadence.',
          blindspotSnippet: 'You did not probe store count or unit economics across new vs mature locations.',
          isCritical: false
        }
      ]
    },
    sampleQuestions: {
      excellent:
        '1. Did revenue growth come from higher prices, increased customer visits, or opening new stores?\n2. How have our main variable cost buckets changed—specifically labor and coffee bean COGS?\n3. Are all 85 stores experiencing the EBITDA decline, or is it concentrated in new locations?\n4. What is our target timeline and hurdle rate for EBITDA recovery?',
      partial:
        '1. Why did revenue increase?\n2. Did competitors lower their coffee prices?\n3. Can we launch a loyalty app?'
    },
    referenceCalculation: {
      frameworkTitle: 'Profit Tree Diagnostic (EBITDA = Revenue - COGS - Labor - SG&A)',
      steps: [
        {
          title: '1. Revenue Decomposition ($100M ➔ $120M, +$20M)',
          math: 'Existing 60 stores: $100M flat. New 25 stores: $20M added ($800k/store avg).',
          explanation: 'Top-line growth was entirely inorganic expansion, not product demand surge.'
        },
        {
          title: '2. Operating Cost Explosion ($76M ➔ $108M, +$32M)',
          math: 'Labor increased by +$24M ($38M ➔ $62M), while COGS grew +$5M and SG&A grew +$3M.',
          explanation:
            'Labor cost consumed 75% of the total expense increase, driven by inefficient scheduling in new stores.'
        },
        {
          title: '3. Strategic Fix & Quick Margin Recovery',
          math: 'Re-align labor-to-revenue ratio from 51.6% back to 40% = +$14M EBITDA recovered.',
          explanation:
            'Shift from fixed shifts to dynamic demand scheduling during non-peak afternoon hours.'
        }
      ],
      finalAnswer: 'Primary Root Cause: Inefficient Store Labor & Overtime in New Locations',
      sanityCheck:
        'Executive Recommendation: Freeze suburban new-store store expansion for 2 quarters; implement algorithmic shift scheduling to trim labor by 8-10 points; recover EBITDA to $22M+ within 180 days.'
    }
  }
};

export function CaseSimulatorPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('case') || 'ram_setu';
    } catch {
      return 'ram_setu';
    }
  });

  const [userQuestions, setUserQuestions] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sample = params.get('sample');
      const c = params.get('case') || 'ram_setu';
      const targetCase = CASES[c] || CASES.ram_setu;
      if (sample === 'excellent') return targetCase.sampleQuestions.excellent;
      if (sample === 'partial') return targetCase.sampleQuestions.partial;
      return '';
    } catch {
      return '';
    }
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return Boolean(params.get('submitted') === 'true' || params.get('sample'));
    } catch {
      return false;
    }
  });

  const [isCasePromptOpen, setIsCasePromptOpen] = useState<boolean>(true);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(true);
  const [showReferenceAnswer, setShowReferenceAnswer] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return Boolean(params.get('ref') === 'true');
    } catch {
      return false;
    }
  });
  const [userEstimate, setUserEstimate] = useState<string>('');
  const [evaluatorMode, setEvaluatorMode] = useState<'local' | 'ai'>('local');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('pmx_gemini_api_key') || '');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<{ whatWorked: string; doThisNext: string } | null>(null);

  const currentCase = CASES[selectedCaseId] || CASES.ram_setu;

  // Local evaluation engine analyzing candidate questions against rubric dimensions
  const evaluationResult = useMemo(() => {
    if (!userQuestions.trim()) {
      return {
        whatWorked: 'You entered your clarifying phase.',
        doThisNext: 'Provide at least 2-3 specific dimensions before continuing.',
        scorePct: 0
      };
    }

    const text = userQuestions.toLowerCase();
    const matchedDimensions = currentCase.rubric.dimensions.filter((dim) =>
      dim.keywords.some((kw) => text.includes(kw.toLowerCase()))
    );

    const missedCritical = currentCase.rubric.dimensions.filter(
      (dim) => dim.isCritical && !matchedDimensions.some((m) => m.id === dim.id)
    );

    // Dynamic "WHAT WORKED"
    let whatWorked = '';
    if (matchedDimensions.length === 0) {
      whatWorked =
        'You asked setup questions, demonstrating the correct instinct to clarify before making assumptions.';
    } else {
      const snippets = matchedDimensions.map((m) => m.whatWorkedSnippet);
      whatWorked = snippets.slice(0, 2).join(' Furthermore, ');
    }

    // Dynamic "DO THIS NEXT"
    let doThisNext = '';
    if (missedCritical.length > 0) {
      const missedLabels = missedCritical.map((m) => `"${m.label}"`).join(' and ');
      const snippets = missedCritical.map((m) => m.blindspotSnippet).join(' ');
      doThisNext = `Your setup is too narrow and misses critical constraints like ${missedLabels}. ${snippets} Before calculating, broaden your setup questions to cover both physical volume and packing mechanics.`;
    } else if (matchedDimensions.length >= 4) {
      doThisNext =
        'Excellent, comprehensive setup! You covered all core geometric and material dimensions. Now proceed to formulate the volume equation and plug in the interviewer values.';
    } else {
      doThisNext =
        'Good start. To make your estimation airtight, consider edge cases: Are there void gaps between boulders, or seasonal tidal fluctuations? Formulate your mathematical equation now.';
    }

    const scorePct = Math.round((matchedDimensions.length / currentCase.rubric.dimensions.length) * 100);

    return { whatWorked, doThisNext, scorePct };
  }, [userQuestions, currentCase]);

  const handleCaseChange = (caseId: string) => {
    setSelectedCaseId(caseId);
    setUserQuestions('');
    setIsSubmitted(false);
    setShowReferenceAnswer(false);
    setUserEstimate('');
    setAiFeedback(null);
  };

  const handleLoadSample = (type: 'excellent' | 'partial') => {
    setUserQuestions(currentCase.sampleQuestions[type]);
    setIsSubmitted(false);
    setAiFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestions.trim()) return;
    setIsSubmitted(true);
    setIsFeedbackOpen(true);

    // If AI mode is enabled and user has key, run live Gemini evaluation
    if (evaluatorMode === 'ai' && apiKey.trim()) {
      setIsAiLoading(true);
      try {
        const prompt = `You are a strict, top-tier Product Management & Strategy case interviewer evaluating a candidate's clarifying questions.
Case Prompt: "${currentCase.casePrompt}"
Case Ground Facts: ${JSON.stringify(currentCase.interviewerData)}
Candidate Clarifying Questions:
"${userQuestions}"

Evaluate the candidate's clarifying questions. Output ONLY a valid JSON object in this exact format:
{
  "whatWorked": "1-2 sentences highlighting the smartest metric or boundary condition the candidate asked about.",
  "doThisNext": "1-2 sentences highlighting the biggest blindspot they missed or how to deepen their setup before doing calculations."
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' }
            })
          }
        );

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            if (parsed.whatWorked && parsed.doThisNext) {
              setAiFeedback(parsed);
            }
          }
        }
      } catch (err) {
        console.warn('AI evaluation failed, falling back to local rubric engine', err);
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  const handleRevise = () => {
    setIsSubmitted(false);
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('pmx_gemini_api_key', key);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#141413] font-sans pb-24 selection:bg-[#FFF3A7]">
      {/* ── Top Header / Navbar ────────────────────────────────────────── */}
      <header className="w-full bg-white border-b-[3px] border-[#141413] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/chronicle"
              className="p-1.5 rounded-lg border-2 border-[#141413] hover:bg-[#FEF08A] transition-all shadow-[1.5px_1.5px_0px_0px_#141413]"
              title="Back to Chronicle"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase px-2 py-0.5 rounded bg-[#FEF08A] border border-[#141413]">
                PM LAB
              </span>
              <h1 className="font-black text-base sm:text-lg tracking-tight text-[#141413]">
                Interactive Case Simulator
              </h1>
            </div>
          </div>

          {/* Engine Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 p-1 rounded-lg border border-[#141413]">
              <button
                type="button"
                onClick={() => setEvaluatorMode('local')}
                className={`px-2.5 py-1 rounded text-[11px] font-black transition-all ${
                  evaluatorMode === 'local'
                    ? 'bg-white text-[#141413] shadow-[1px_1px_0px_0px_#141413] border border-[#141413]'
                    : 'text-slate-500 hover:text-black'
                }`}
              >
                ⚡ Smart Rubric (Instant)
              </button>
              <button
                type="button"
                onClick={() => setEvaluatorMode('ai')}
                className={`px-2.5 py-1 rounded text-[11px] font-black transition-all flex items-center gap-1 ${
                  evaluatorMode === 'ai'
                    ? 'bg-[#FEF08A] text-[#141413] shadow-[1px_1px_0px_0px_#141413] border border-[#141413]'
                    : 'text-slate-500 hover:text-black'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                Live AI (Gemini)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Case Tabs & Configuration Banner ─────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Case Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => handleCaseChange('ram_setu')}
            className={`px-4 py-2.5 rounded-xl border-[2.5px] border-[#141413] font-black text-xs sm:text-sm uppercase tracking-wide cursor-pointer transition-all flex items-center gap-2 ${
              selectedCaseId === 'ram_setu'
                ? 'bg-[#FEF08A] shadow-[3px_3px_0px_0px_#141413] translate-y-[-2px]'
                : 'bg-white hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#141413]'
            }`}
          >
            <span>🪨</span>
            <span>Case 1: Ram Setu Guesstimate</span>
          </button>

          <button
            type="button"
            onClick={() => handleCaseChange('urbanbrew')}
            className={`px-4 py-2.5 rounded-xl border-[2.5px] border-[#141413] font-black text-xs sm:text-sm uppercase tracking-wide cursor-pointer transition-all flex items-center gap-2 ${
              selectedCaseId === 'urbanbrew'
                ? 'bg-[#FEF08A] shadow-[3px_3px_0px_0px_#141413] translate-y-[-2px]'
                : 'bg-white hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#141413]'
            }`}
          >
            <span>☕</span>
            <span>Case 2: UrbanBrew (Reference Case)</span>
          </button>
        </div>

        {/* AI Key input banner if in AI mode */}
        {evaluatorMode === 'ai' && (
          <div className="bg-[#FFFDF0] rounded-xl border-2 border-[#141413] p-4 mb-6 shadow-[2px_2px_0px_0px_#141413] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Live Gemini Mode Active:</strong> Paste your Gemini API key below to get real-time dynamic AI hints, or switch back to the built-in Smart Rubric engine.
              </span>
            </div>
            <div className="w-full sm:w-auto flex items-center gap-2">
              <input
                type="password"
                placeholder="Paste Gemini API Key..."
                value={apiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                className="p-1.5 px-3 border border-[#141413] rounded-lg text-xs bg-white w-full sm:w-48"
              />
            </div>
          </div>
        )}

        {/* ── Main Case Card (Matches Reference Image Style) ──────────── */}
        <div className="bg-white rounded-2xl border-[3px] border-[#141413] p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-6">
          {/* 1. Case Prompt Accordion Header */}
          <div className="border-b-2 border-slate-100 pb-5">
            <button
              type="button"
              onClick={() => setIsCasePromptOpen(!isCasePromptOpen)}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  CASE PROMPT
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300">
                  {currentCase.badge}
                </span>
              </div>
              <div className="text-slate-400 group-hover:text-black transition-colors">
                {isCasePromptOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isCasePromptOpen && (
              <p className="mt-3 text-sm sm:text-base font-medium text-slate-800 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
                {currentCase.casePrompt}
              </p>
            )}
          </div>

          {/* 2. Main Question Headline */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#141413] tracking-tight leading-tight">
              {currentCase.clarifyingPrompt}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2">
              Interrogating the right parameters early prevents solving the wrong problem. What missing information do you need?
            </p>
          </div>

          {/* 3. Input Form or Submitted State */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-black uppercase text-[#141413] mb-2">
                  Your Clarifying Questions (Bullet points or paragraph):
                </label>
                <textarea
                  rows={5}
                  value={userQuestions}
                  onChange={(e) => setUserQuestions(e.target.value)}
                  placeholder="e.g.&#10;1. What is the total distance across the Palk Strait?&#10;2. How wide does the causeway need to be?&#10;3. What is the average ocean depth along the route?&#10;4. What are the typical dimensions of a single stone?"
                  className="w-full p-4 rounded-xl border-2 border-[#141413] font-medium text-sm sm:text-base bg-[#FDFCF7] shadow-[2px_2px_0px_0px_#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2] transition-all"
                  required
                />
              </div>

              {/* Sample Quick-fill prompts */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-slate-500">Try testing sample questions:</span>
                  <button
                    type="button"
                    onClick={() => handleLoadSample('excellent')}
                    className="px-2.5 py-1 rounded-lg border border-[#141413] bg-[#D1FAE5] text-[#065F46] font-bold hover:bg-[#A7F3D0] transition-colors cursor-pointer"
                  >
                    ★ Comprehensive Questions
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSample('partial')}
                    className="px-2.5 py-1 rounded-lg border border-[#141413] bg-[#FEF3C7] text-[#92400E] font-bold hover:bg-[#FDE68A] transition-colors cursor-pointer"
                  >
                    ⚠ Narrow / Incomplete
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl border-[2.5px] border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#141413] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Submit Clarifying Questions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* 4. Submitted State: Interviewer Answer Box (Matches Reference Image) */
            <div className="space-y-6 pt-2">
              <div className="bg-[#FAF9F5] rounded-xl border-2 border-[#141413] p-5 sm:p-6 shadow-[2px_2px_0px_0px_#141413]">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-[#141413]">
                    <div className="w-6 h-6 rounded bg-[#141413] text-white flex items-center justify-center">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    INTERVIEWER ANSWER
                  </div>

                  <button
                    type="button"
                    onClick={handleRevise}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg border border-[#141413] bg-white text-xs font-bold text-slate-700 hover:bg-[#FFF3A7] transition-all shadow-[1px_1px_0px_0px_#141413] cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Revise</span>
                  </button>
                </div>

                <p className="text-sm font-bold text-slate-900 mb-3">
                  Here is what the case provides now:
                </p>

                <div className="space-y-2.5 text-xs sm:text-sm text-slate-800 mb-4">
                  {currentCase.interviewerData.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
                      <span className="font-black text-[#188ab2] shrink-0">•</span>
                      <div>
                        <strong className="text-[#141413]">{item.label}:</strong> {item.value}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-start gap-2 bg-amber-50/60 p-3 rounded-lg border border-amber-200 text-slate-700 font-medium">
                    <span className="font-bold text-amber-700 shrink-0">•</span>
                    <div>
                      <strong className="text-amber-900">Other requested information:</strong>{' '}
                      {currentCase.otherRequestedInfo}
                    </div>
                  </div>
                </div>

                {/* Candidate's submitted text preview */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate max-w-md italic">
                    You asked: "{userQuestions.slice(0, 100)}..."
                  </span>
                  <button
                    type="button"
                    onClick={handleRevise}
                    className="text-[#188ab2] font-black underline hover:text-[#0f6f8f]"
                  >
                    Edit your questions
                  </button>
                </div>
              </div>

              {/* 5. Dynamic Feedback Card ("First answer in ^") */}
              <div className="bg-white rounded-xl border-2 border-[#141413] overflow-hidden shadow-[3px_3px_0px_0px_#141413]">
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b-2 border-[#141413] text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-serif italic font-bold text-base sm:text-lg text-[#141413]">
                      First answer in
                    </span>
                    {isAiLoading && (
                      <span className="text-xs font-mono font-bold text-amber-600 animate-pulse flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Analyzing with AI...
                      </span>
                    )}
                  </div>
                  <div>
                    {isFeedbackOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isFeedbackOpen && (
                  <div className="p-5 sm:p-6 space-y-5">
                    {/* WHAT WORKED */}
                    <div>
                      <div className="font-mono text-xs font-black uppercase text-[#059669] tracking-wider mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        WHAT WORKED
                      </div>
                      <p className="text-sm font-medium text-slate-800 leading-relaxed bg-[#F0FDF4] p-3.5 rounded-xl border border-emerald-200">
                        {aiFeedback?.whatWorked || evaluationResult.whatWorked}
                      </p>
                    </div>

                    {/* DO THIS NEXT */}
                    <div>
                      <div className="font-mono text-xs font-black uppercase text-[#D97706] tracking-wider mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        DO THIS NEXT
                      </div>
                      <p className="text-sm font-medium text-slate-800 leading-relaxed bg-[#FFFBEB] p-3.5 rounded-xl border border-amber-200">
                        {aiFeedback?.doThisNext || evaluationResult.doThisNext}
                      </p>
                    </div>

                    {/* Show reference answer dropdown */}
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowReferenceAnswer(!showReferenceAnswer)}
                        className="text-xs sm:text-sm font-bold text-slate-600 hover:text-black flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showReferenceAnswer ? 'Hide reference answer' : 'Show reference answer'}</span>
                        {showReferenceAnswer ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {showReferenceAnswer && (
                        <div className="mt-4 bg-[#FEF08A]/40 rounded-xl border-2 border-[#141413] p-5 shadow-[2px_2px_0px_0px_#141413] space-y-4">
                          <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-[#141413]">
                            <Calculator className="w-4 h-4 text-[#188ab2]" />
                            <span>{currentCase.referenceCalculation.frameworkTitle}</span>
                          </div>

                          <div className="space-y-3">
                            {currentCase.referenceCalculation.steps.map((st, i) => (
                              <div key={i} className="bg-white p-3.5 rounded-lg border border-[#141413]">
                                <div className="font-black text-xs sm:text-sm text-[#141413] mb-1">
                                  {st.title}
                                </div>
                                <div className="font-mono text-xs sm:text-sm font-bold text-[#188ab2] bg-slate-50 p-2 rounded border border-slate-200 mb-1.5">
                                  {st.math}
                                </div>
                                <p className="text-xs text-slate-600 font-medium">{st.explanation}</p>
                              </div>
                            ))}
                          </div>

                          <div className="bg-[#141413] text-white p-4 rounded-xl border-2 border-[#141413] space-y-2">
                            <div className="font-mono text-[11px] font-black uppercase text-[#FEF08A]">
                              ★ Final Calculated Solution:
                            </div>
                            <div className="text-xl sm:text-2xl font-black text-white">
                              {currentCase.referenceCalculation.finalAnswer}
                            </div>
                            <p className="text-xs text-slate-300 font-medium leading-relaxed pt-1">
                              {currentCase.referenceCalculation.sanityCheck}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Optional Step 2: Test Calculation Input */}
              <div className="bg-[#F0FDF4] rounded-xl border-2 border-[#141413] p-5 sm:p-6 shadow-[2px_2px_0px_0px_#141413] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-black text-sm sm:text-base text-[#141413]">
                    Ready to do the math? Enter your final estimate:
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    value={userEstimate}
                    onChange={(e) => setUserEstimate(e.target.value)}
                    placeholder="e.g. 4.0 Million stones or 4,000,000"
                    className="p-3 rounded-lg border-2 border-[#141413] font-mono text-sm bg-white flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowReferenceAnswer(true)}
                    className="px-5 py-3 rounded-lg border-2 border-[#141413] bg-[#059669] hover:bg-[#047857] text-white font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#141413] cursor-pointer"
                  >
                    Compare with Model
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Architectural Explainer Banner ─────────────────────────── */}
        <div className="mt-8 bg-white rounded-2xl border-[2.5px] border-[#141413] p-6 shadow-[3px_3px_0px_0px_#141413] space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-[#188ab2]">
            <Info className="w-4 h-4" />
            <span>How This Guided Experience Evaluates in Production</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            This interactive tab demonstrates the <strong>Hybrid Rubric Architecture</strong>: It dynamically grades open-ended student clarifying questions by mapping semantic intent against dimensional constraints (Geometry, Depth, Unit Size, and Porosity).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <span className="font-black text-slate-900 block mb-1">1. Fast Latency</span>
              <span className="text-slate-600">Zero wait-time with local heuristic fallback.</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <span className="font-black text-slate-900 block mb-1">2. Zero Hallucination</span>
              <span className="text-slate-600">Case parameters strictly bound to the interviewer's reveal.</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <span className="font-black text-slate-900 block mb-1">3. Native LLM Option</span>
              <span className="text-slate-600">Toggle live AI mode anytime to get raw unscripted feedback.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseSimulatorPage;
