import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Check,
  Edit3,
  Copy,
  Split,
  HelpCircle,
  Hash,
  Compass
} from 'lucide-react';

interface RubricDimension {
  id: string;
  label: string;
  keywords: string[];
  whatWorkedSnippet: string;
  blindspotSnippet: string;
  isCritical: boolean;
}

interface CaseDefinition {
  id: string;
  badge: string;
  title: string;
  casePrompt: string;
  clarifyingPrompt: string;
  interviewerData: Array<{ label: string; value: string }>;
  otherRequestedInfo: string;
  rubric: {
    dimensions: RubricDimension[];
  };
  referenceCalculation: {
    frameworkTitle: string;
    steps: Array<{ title: string; math: string; explanation: string }>;
    finalAnswer: string;
    sanityCheck: string;
  };
}

const RAM_SETU_CASE: CaseDefinition = {
  id: 'ram_setu',
  badge: 'ANCIENT GUESSTIMATE • PRODUCT DISCOVERY',
  title: 'Ram Setu Stone Estimation',
  casePrompt:
    'King Rama’s Vanara Sena reaches the southern coast of Dhanushkodi. Across the tumultuous Palk Strait lies Lanka, 48 km away. To march an army of millions and heavy supply carts across the ocean, the master architects Nila and Nal must construct a floating stone causeway (Ram Setu). You are appointed Chief Estimation PM for the royal engineering corps. How many stones will be required to build the Ram Setu?',
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
      label: 'Ocean Depth & Total Causeway Height',
      value: 'Average water depth along the natural limestone shoal is 3.0 meters. The bridge surface must rise 0.5 meters above high tide (total causeway height from seabed = 3.5 meters).'
    },
    {
      label: 'Stone Unit Dimensions',
      value: 'Natural boulders cut from the Gandhamadana mountain range average roughly 1.0 m × 1.0 m × 1.0 m (unit volume = 1.0 m³ each).'
    }
  ],
  otherRequestedInfo:
    'If you asked about anything not listed above (e.g. tidal currents, rock mineral density, specific gravity of floating pumice stones), it is not in the case yet. Make a reasonable assumption, state it, and keep going.',
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
        label: 'Water Depth / Causeway Height',
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
      }
    ]
  },
  referenceCalculation: {
    frameworkTitle: 'Volume Decomposition Framework (Macro-to-Micro)',
    steps: [
      {
        title: '1. Gross Causeway Volume (Length × Width × Height)',
        math: '48,000 m (Length) × 30 m (Width) × 3.5 m (Height) = 5,040,000 m³',
        explanation:
          'Convert 48 km into 48,000 meters. The total height comprises 3.0 m submerged foundation to the seabed + 0.5 m clearance above high tide.'
      },
      {
        title: '2. Total Stone Count Calculation',
        math: '5,040,000 m³ ÷ 1.0 m³ per stone = 5,040,000 stones (~5.04 Million Boulders)',
        explanation:
          'Dividing total required causeway volume by the unit volume of an individual stone (1.0 m³) yields the exact count needed.'
      }
    ],
    finalAnswer: '≈ 5.04 Million Stones (5,040,000 boulders)',
    sanityCheck:
      'Reality Sanity Check: If 10,000 Vanaras work concurrently and each places 1 stone every 5 minutes (12 stones/hr × 10 hrs = 120 stones/day/worker = 1.2M stones/day), the 5.04M stones causeway can be completed in approximately 4.2 days. This closely aligns with the Valmiki Ramayana account of a 5-day rapid construction!'
  }
};

export function CaseSimulatorPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── A/B Test Variant State ──────────────────────────────────────────
  // 'A' = Assumptions & Open Canvas Flow
  // 'B' = Structured Step-by-Step Breakdown (Fill-in-the-boxes)
  const [variant, setVariant] = useState<'A' | 'B'>(() => {
    try {
      const vParam = searchParams.get('variant') || searchParams.get('v');
      if (vParam) {
        const normalized = vParam.toLowerCase();
        if (normalized === 'b' || normalized === 'breakdown' || normalized === 'boxes') return 'B';
        if (normalized === 'a' || normalized === 'open' || normalized === 'canvas') return 'A';
      }
      // Check stored preference or randomly assign 50/50
      const stored = localStorage.getItem('pmx_ram_setu_ab_variant');
      if (stored === 'A' || stored === 'B') return stored;
      const assigned = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem('pmx_ram_setu_ab_variant', assigned);
      return assigned;
    } catch {
      return 'A';
    }
  });

  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Sync variant to URL and localStorage
  const handleSwitchVariant = (newVariant: 'A' | 'B') => {
    setVariant(newVariant);
    try {
      localStorage.setItem('pmx_ram_setu_ab_variant', newVariant);
      const newParams = new URLSearchParams(searchParams);
      newParams.set('v', newVariant.toLowerCase());
      setSearchParams(newParams, { replace: true });
    } catch (e) {
      console.warn('Could not sync search params', e);
    }
  };

  const copyShareableLink = (forVariant: 'A' | 'B') => {
    const origin = window.location.origin;
    const url = `${origin}/case-simulator?v=${forVariant.toLowerCase()}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(forVariant);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // ── Common Case Data ────────────────────────────────────────────────
  const currentCase = RAM_SETU_CASE;
  const [isCasePromptOpen, setIsCasePromptOpen] = useState<boolean>(true);

  // ── VARIANT A STATE (Assumptions & Open Canvas) ─────────────────────
  // Steps in Variant A:
  // 1: Clarifying Questions
  // 2: Your Assumptions
  // 3: Interviewer Guide & Final Answer Canvas
  // 4: Model Reveal & Hints
  const [stepA, setStepA] = useState<1 | 2 | 3 | 4>(() => {
    try {
      const s = parseInt(searchParams.get('step') || '1', 10);
      if (s >= 1 && s <= 4) return s as 1 | 2 | 3 | 4;
      return 1;
    } catch {
      return 1;
    }
  });

  const [userQuestionsA, setUserQuestionsA] = useState<string>('');
  const [userAssumptionsA, setUserAssumptionsA] = useState<string>('');
  const [userCalculationA, setUserCalculationA] = useState<string>('');
  const [userFinalEstimateA, setUserFinalEstimateA] = useState<string>('');

  const [isFeedbackOpenA, setIsFeedbackOpenA] = useState<boolean>(true);
  const [showReferenceAnswerA, setShowReferenceAnswerA] = useState<boolean>(() => {
    try {
      return searchParams.get('ref') === 'true';
    } catch {
      return false;
    }
  });
  const [showSubmittedRecapA, setShowSubmittedRecapA] = useState<boolean>(false);

  // ── VARIANT B STATE (Step-by-Step Breakdown Boxes) ───────────────────
  // Part 1: Length in meters
  // Part 2: Width in meters
  // Part 3: Total Height in meters (water depth + freeboard)
  // Part 4: Total Volume in m³
  // Part 5: Unit Stone Volume in m³
  // Part 6: Total Stones Required
  const [boxInputsB, setBoxInputsB] = useState({
    lengthMeters: '',
    widthMeters: '',
    heightMeters: '',
    totalVolumeM3: '',
    unitStoneM3: '',
    totalStones: ''
  });

  const [isSubmittedB, setIsSubmittedB] = useState<boolean>(() => {
    try {
      return searchParams.get('submitted') === 'true';
    } catch {
      return false;
    }
  });
  const [showReferenceAnswerB, setShowReferenceAnswerB] = useState<boolean>(false);

  // Dynamic rubric result for Variant A
  const evaluationResultA = useMemo(() => {
    const questionsText = userQuestionsA.toLowerCase();
    const assumptionsText = userAssumptionsA.toLowerCase();
    const combinedText = `${questionsText} ${assumptionsText}`;

    const matchedDimensions = currentCase.rubric.dimensions.filter((dim) =>
      dim.keywords.some((kw) => combinedText.includes(kw.toLowerCase()))
    );

    const missedCritical = currentCase.rubric.dimensions.filter(
      (dim) => dim.isCritical && !matchedDimensions.some((m) => m.id === dim.id)
    );

    // Dynamic "WHAT WORKED"
    let whatWorked = '';
    if (matchedDimensions.length === 0) {
      whatWorked =
        'You established your setup and articulated assumptions before viewing the interviewer facts, showing proactive initiative.';
    } else {
      const snippets = matchedDimensions.map((m) => m.whatWorkedSnippet);
      whatWorked = snippets.slice(0, 2).join(' Furthermore, ');
    }

    if (userAssumptionsA.trim()) {
      whatWorked +=
        ' Stating your own baseline assumptions first helped benchmark your mental model against the interviewer’s ground facts.';
    }

    // Check final estimate precision
    const estClean = (userFinalEstimateA + ' ' + userCalculationA).toLowerCase();
    const hasFiveMillion =
      estClean.includes('5.04') ||
      estClean.includes('5,040,000') ||
      estClean.includes('5040000') ||
      estClean.includes('5 million') ||
      estClean.includes('5m') ||
      estClean.includes('50 lakh') ||
      estClean.includes('5 mn');

    if (hasFiveMillion) {
      whatWorked +=
        ' In addition, your final calculated estimate of ~5.04 Million stones hit the mathematical benchmark with exact arithmetic!';
    } else if (userFinalEstimateA.trim()) {
      whatWorked += ` You finalized an estimate of "${userFinalEstimateA}" before reviewing the model answer.`;
    }

    // Dynamic "DO THIS NEXT"
    let doThisNext = '';
    if (missedCritical.length > 0) {
      const missedLabels = missedCritical.map((m) => `"${m.label}"`).join(' and ');
      const snippets = missedCritical.map((m) => m.blindspotSnippet).join(' ');
      doThisNext = `Your setup missed critical dimensions like ${missedLabels}. ${snippets} Remember to always define 3D volume (Length × Width × Height) and divide by individual unit size.`;
    } else if (matchedDimensions.length === currentCase.rubric.dimensions.length) {
      doThisNext =
        'Flawless geometric setup! You accounted for all 4 physical variables: Length, Width, Depth, and Stone Unit Size. In an executive interview, follow up by sanity checking the daily placement rate against army headcount.';
    } else {
      doThisNext =
        'Solid approach. To make your estimation airtight, always check whether the foundation is submerged (adding seabed depth to the volume equation) before presenting to leadership.';
    }

    return { whatWorked, doThisNext };
  }, [userQuestionsA, userAssumptionsA, userCalculationA, userFinalEstimateA, currentCase]);

  // Validation scores for Variant B boxes
  const validationB = useMemo(() => {
    const l = parseFloat(boxInputsB.lengthMeters.replace(/,/g, '').trim());
    const w = parseFloat(boxInputsB.widthMeters.replace(/,/g, '').trim());
    const h = parseFloat(boxInputsB.heightMeters.replace(/,/g, '').trim());
    const v = parseFloat(boxInputsB.totalVolumeM3.replace(/,/g, '').trim());
    const u = parseFloat(boxInputsB.unitStoneM3.replace(/,/g, '').trim());
    const s = parseFloat(boxInputsB.totalStones.replace(/,/g, '').trim());

    const isLengthCorrect = l === 48000;
    const isWidthCorrect = w === 30;
    const isHeightCorrect = h === 3.5 || (h >= 3.0 && h <= 3.5);
    const isVolumeCorrect = v === 5040000 || (l && w && h && Math.abs(v - l * w * h) < 100);
    const isUnitCorrect = u === 1 || u === 1.0;
    const isStonesCorrect = s === 5040000 || (v && u && Math.abs(s - v / u) < 100);

    const filledCount = Object.values(boxInputsB).filter((val) => val.trim() !== '').length;
    const correctCount = [
      isLengthCorrect,
      isWidthCorrect,
      isHeightCorrect,
      isVolumeCorrect,
      isUnitCorrect,
      isStonesCorrect
    ].filter(Boolean).length;

    return {
      isLengthCorrect,
      isWidthCorrect,
      isHeightCorrect,
      isVolumeCorrect,
      isUnitCorrect,
      isStonesCorrect,
      filledCount,
      correctCount
    };
  }, [boxInputsB]);

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#141413] font-sans pb-24 selection:bg-[#FFF3A7]">
      {/* ── Top Header / Navbar ────────────────────────────────────────── */}
      <header className="w-full bg-white border-b-[3px] border-[#141413] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
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
              <h1 className="font-black text-sm sm:text-base tracking-tight text-[#141413] truncate">
                Ram Setu Guesstimate
              </h1>
            </div>
          </div>

          {/* ── A/B Test Switcher in Header ────────────────────────────── */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#FAF9F5] p-1 rounded-xl border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413]">
              <button
                type="button"
                onClick={() => handleSwitchVariant('A')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  variant === 'A'
                    ? 'bg-[#FEF08A] text-[#141413] border border-[#141413] shadow-[1px_1px_0px_0px_#141413]'
                    : 'text-slate-500 hover:text-black'
                }`}
                title="Variant A: Assumptions & Open Canvas Flow"
              >
                <span>Variant A</span>
                <span className="hidden sm:inline ml-1 font-semibold text-[10px] text-slate-600">
                  (Assumptions)
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchVariant('B')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  variant === 'B'
                    ? 'bg-[#FEF08A] text-[#141413] border border-[#141413] shadow-[1px_1px_0px_0px_#141413]'
                    : 'text-slate-500 hover:text-black'
                }`}
                title="Variant B: Fill-in-the-Boxes Breakdown"
              >
                <span>Variant B</span>
                <span className="hidden sm:inline ml-1 font-semibold text-[10px] text-slate-600">
                  (Breakdown Boxes)
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── A/B Test Admin & Shareable Links Bar ──────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <div className="bg-white rounded-xl border-2 border-[#141413] p-3 shadow-[2px_2px_0px_0px_#141413] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#141413] text-white flex items-center justify-center font-black text-[10px]">
              <Split className="w-3 h-3 text-[#FEF08A]" />
            </div>
            <span className="font-bold text-slate-700">
              Active A/B Test:{' '}
              <strong className="text-[#141413]">
                {variant === 'A'
                  ? 'Variant A (Assumptions ➔ Guide ➔ Final Canvas)'
                  : 'Variant B (Structured Fill-in-the-Boxes Breakdown)'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyShareableLink('A')}
              className={`px-2.5 py-1 rounded-lg border border-[#141413] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                copiedLink === 'A' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FAF9F5] hover:bg-[#FEF08A]'
              }`}
            >
              {copiedLink === 'A' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>Copy Link A</span>
            </button>

            <button
              type="button"
              onClick={() => copyShareableLink('B')}
              className={`px-2.5 py-1 rounded-lg border border-[#141413] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                copiedLink === 'B' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FAF9F5] hover:bg-[#FEF08A]'
              }`}
            >
              {copiedLink === 'B' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>Copy Link B</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Container ────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* ============================================================= */}
        {/* VARIANT A: Assumptions -> Interviewer Guide -> Final Canvas  */}
        {/* ============================================================= */}
        {variant === 'A' && (
          <div className="space-y-6">
            {/* Step Progression Stepper for Variant A */}
            <div className="bg-white rounded-xl border-2 border-[#141413] p-2.5 shadow-[2px_2px_0px_0px_#141413] flex items-center justify-between text-xs font-bold overflow-x-auto">
              <button
                type="button"
                onClick={() => setStepA(1)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  stepA === 1
                    ? 'bg-[#FEF08A] text-[#141413] border border-[#141413] font-black shadow-[1px_1px_0px_0px_#141413]'
                    : stepA > 1
                    ? 'text-emerald-700 hover:bg-slate-100'
                    : 'text-slate-400'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
                  stepA > 1 ? 'bg-emerald-600 text-white' : 'bg-[#141413] text-white'
                }`}>
                  {stepA > 1 ? <Check className="w-2.5 h-2.5" /> : '1'}
                </span>
                <span>1. Clarify</span>
              </button>

              <span className="text-slate-300 font-black">➔</span>

              <button
                type="button"
                onClick={() => userQuestionsA.trim() && setStepA(2)}
                disabled={!userQuestionsA.trim()}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  stepA === 2
                    ? 'bg-[#FEF08A] text-[#141413] border border-[#141413] font-black shadow-[1px_1px_0px_0px_#141413]'
                    : stepA > 2
                    ? 'text-emerald-700 hover:bg-slate-100'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
                  stepA > 2 ? 'bg-emerald-600 text-white' : stepA === 2 ? 'bg-[#141413] text-white' : 'bg-slate-300 text-slate-600'
                }`}>
                  {stepA > 2 ? <Check className="w-2.5 h-2.5" /> : '2'}
                </span>
                <span>2. Your Assumptions</span>
              </button>

              <span className="text-slate-300 font-black">➔</span>

              <button
                type="button"
                onClick={() => userAssumptionsA.trim() && setStepA(3)}
                disabled={!userAssumptionsA.trim()}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  stepA === 3
                    ? 'bg-[#FEF08A] text-[#141413] border border-[#141413] font-black shadow-[1px_1px_0px_0px_#141413]'
                    : stepA > 3
                    ? 'text-emerald-700 hover:bg-slate-100'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
                  stepA > 3 ? 'bg-emerald-600 text-white' : stepA === 3 ? 'bg-[#141413] text-white' : 'bg-slate-300 text-slate-600'
                }`}>
                  {stepA > 3 ? <Check className="w-2.5 h-2.5" /> : '3'}
                </span>
                <span>3. Guide & Final Answer</span>
              </button>

              <span className="text-slate-300 font-black">➔</span>

              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  stepA === 4
                    ? 'bg-[#FEF08A] text-[#141413] border border-[#141413] font-black shadow-[1px_1px_0px_0px_#141413]'
                    : 'text-slate-400'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
                  stepA === 4 ? 'bg-[#141413] text-white' : 'bg-slate-300 text-slate-600'
                }`}>
                  4
                </span>
                <span>4. Model Reveal</span>
              </div>
            </div>

            {/* Case Card */}
            <div className="bg-white rounded-2xl border-[3px] border-[#141413] p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-6">
              {/* Case Prompt Accordion Header */}
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

              {/* ── STEP A-1: CLARIFYING QUESTIONS ─────────────────────── */}
              {stepA === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight leading-tight">
                      {currentCase.clarifyingPrompt}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2">
                      Interrogating the right parameters early prevents solving the wrong problem. What missing information or dimensions do you need from the interviewer before calculating?
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!userQuestionsA.trim()) return;
                      setStepA(2);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="space-y-4 pt-2"
                  >
                    <div>
                      <label className="block text-xs font-black uppercase text-[#141413] mb-2">
                        Your Clarifying Questions:
                      </label>
                      <textarea
                        rows={6}
                        value={userQuestionsA}
                        onChange={(e) => setUserQuestionsA(e.target.value)}
                        placeholder="Type the clarifying questions or parameters you would ask the interviewer before beginning your calculation..."
                        className="w-full p-4 rounded-xl border-2 border-[#141413] font-medium text-sm sm:text-base bg-[#FDFCF7] shadow-[2px_2px_0px_0px_#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2] transition-all"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-7 py-3 rounded-xl border-[2.5px] border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Next: State Your Assumptions</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ── STEP A-2: YOUR ASSUMPTIONS ─────────────────────────── */}
              {stepA === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="font-mono text-[11px] font-black uppercase text-amber-700 tracking-wider block mb-1">
                        STEP 2 OF 4 • HYPOTHESIS & BOUNDARIES
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight leading-tight">
                        What Are Your Assumptions?
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStepA(1)}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-black underline cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Questions</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-[#FFFBEB] p-4 rounded-xl border border-amber-200">
                    💡 <strong>Interviewer's Challenge:</strong> In a real case interview, if the interviewer asks you to <em>"make reasonable assumptions first"</em> before handing over facts, what numbers would you estimate for length, width, depth, and stone size?
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!userAssumptionsA.trim()) return;
                      setStepA(3);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="space-y-4 pt-1"
                  >
                    <div>
                      <label className="block text-xs font-black uppercase text-[#141413] mb-2">
                        State Your Initial Assumptions:
                      </label>
                      <textarea
                        rows={6}
                        value={userAssumptionsA}
                        onChange={(e) => setUserAssumptionsA(e.target.value)}
                        placeholder="e.g.&#10;1. Span across ocean: I assume roughly 30-50 km across the strait.&#10;2. Bridge Width: I assume 20-30m so an army with siege equipment can pass.&#10;3. Water Depth: Shallow coastal shoal ~3-4m deep.&#10;4. Boulder Size: Hand-carved or natural boulders ~1 m³ each."
                        className="w-full p-4 rounded-xl border-2 border-[#141413] font-medium text-sm sm:text-base bg-[#FDFCF7] shadow-[2px_2px_0px_0px_#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2] transition-all"
                        required
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStepA(1)}
                        className="px-4 py-2.5 rounded-xl border-2 border-[#141413] bg-white hover:bg-slate-50 font-bold text-xs uppercase tracking-wide cursor-pointer transition-all text-center"
                      >
                        ← Back to Questions
                      </button>

                      <button
                        type="submit"
                        className="px-7 py-3 rounded-xl border-[2.5px] border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Reveal Interviewer Guide & Data</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ── STEP A-3: INTERVIEWER GUIDE & FINAL ANSWER CANVAS ──── */}
              {stepA === 3 && (
                <div className="space-y-6">
                  {/* The Interviewer Guide is now revealed! */}
                  <div className="bg-[#FAF9F5] rounded-xl border-2 border-[#141413] p-5 sm:p-6 shadow-[2px_2px_0px_0px_#141413] space-y-4">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-[#141413]">
                        <div className="w-6 h-6 rounded bg-[#141413] text-white flex items-center justify-center">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </div>
                        INTERVIEWER'S GUIDE & VERIFIED DATA
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setStepA(2)}
                          className="font-bold text-slate-600 hover:text-black underline"
                        >
                          Revise Assumptions
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      Here are the verified case parameters provided by the royal architects:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-800">
                      {currentCase.interviewerData.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
                          <span className="font-black text-[#188ab2] shrink-0">•</span>
                          <div>
                            <strong className="text-[#141413] block mb-0.5">{item.label}</strong>
                            <span className="text-slate-700">{item.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200 text-xs text-slate-700 font-medium flex items-start gap-2">
                      <span className="font-bold text-amber-700 shrink-0">•</span>
                      <div>
                        <strong className="text-amber-900">Other requested parameters:</strong>{' '}
                        {currentCase.otherRequestedInfo}
                      </div>
                    </div>
                  </div>

                  {/* Tab / Box for Final Answer to Fill In */}
                  <div className="bg-[#FFFDF0] rounded-2xl border-[2.5px] border-[#141413] p-6 shadow-[3px_3px_0px_0px_#141413] space-y-5">
                    <div>
                      <span className="font-mono text-[11px] font-black uppercase text-[#188ab2] tracking-wider block mb-1">
                        STEP 3 OF 4 • FINAL ANSWER CANVAS
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[#141413]">
                        Calculate & Fill In Your Final Answer
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                        Plug the interviewer data into your volume formula and state your final stone count.
                      </p>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!userFinalEstimateA.trim()) return;
                        setStepA(4);
                        setIsFeedbackOpenA(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-black uppercase text-[#141413] mb-1.5">
                          Your Calculation Steps & Math:
                        </label>
                        <textarea
                          rows={4}
                          value={userCalculationA}
                          onChange={(e) => setUserCalculationA(e.target.value)}
                          placeholder="Show your intermediate formula (e.g. 48,000m × 30m × 3.5m = 5,040,000 m³ ÷ 1.0 m³ per stone)..."
                          className="w-full p-3.5 rounded-xl border-2 border-[#141413] font-mono text-xs sm:text-sm bg-white shadow-[1.5px_1.5px_0px_0px_#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase text-[#141413] mb-1.5">
                          Your Final Estimated Stone Count:
                        </label>
                        <input
                          type="text"
                          value={userFinalEstimateA}
                          onChange={(e) => setUserFinalEstimateA(e.target.value)}
                          placeholder="e.g. 5,040,000 or 5.04 Million stones"
                          className="w-full sm:w-80 p-3 rounded-lg border-2 border-[#141413] font-mono text-sm bg-white shadow-[1.5px_1.5px_0px_0px_#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
                          required
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setStepA(2)}
                          className="px-4 py-2.5 rounded-xl border-2 border-[#141413] bg-white hover:bg-slate-50 font-bold text-xs uppercase tracking-wide cursor-pointer transition-all text-center"
                        >
                          ← Back to Assumptions
                        </button>

                        <button
                          type="submit"
                          className="px-7 py-3 rounded-xl border-[2.5px] border-[#141413] bg-[#059669] hover:bg-[#047857] text-white font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>Submit Final Answer & See Evaluation</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* ── STEP A-4: MODEL REVEAL & DYNAMIC HINTS ─────────────── */}
              {stepA === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight leading-tight">
                      {currentCase.clarifyingPrompt}
                    </h2>
                  </div>

                  {/* Interviewer Answer Box (Matches Reference Style) */}
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
                        onClick={() => setStepA(3)}
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

                    {/* Candidate's submitted work recap toggle */}
                    <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setShowSubmittedRecapA(!showSubmittedRecapA)}
                        className="text-[#188ab2] font-black hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showSubmittedRecapA ? 'Hide your submitted work' : 'View your submitted questions, assumptions & answer'}</span>
                        {showSubmittedRecapA ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setStepA(3)}
                        className="text-slate-600 font-bold hover:text-black underline"
                      >
                        Edit inputs
                      </button>
                    </div>

                    {showSubmittedRecapA && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                        <div>
                          <strong className="text-slate-900 block">Clarifying Questions Asked:</strong>
                          <p className="text-slate-700 whitespace-pre-wrap mt-0.5">{userQuestionsA}</p>
                        </div>
                        {userAssumptionsA && (
                          <div className="pt-2 border-t border-slate-100">
                            <strong className="text-slate-900 block">Your Assumptions Stated:</strong>
                            <p className="text-slate-700 whitespace-pre-wrap mt-0.5">{userAssumptionsA}</p>
                          </div>
                        )}
                        {userFinalEstimateA && (
                          <div className="pt-2 border-t border-slate-100">
                            <strong className="text-slate-900 block">Your Final Estimate:</strong>
                            <p className="font-mono font-black text-[#188ab2]">{userFinalEstimateA}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dynamic Hints Card ("First answer in ^") */}
                  <div className="bg-white rounded-xl border-2 border-[#141413] overflow-hidden shadow-[3px_3px_0px_0px_#141413]">
                    <button
                      type="button"
                      onClick={() => setIsFeedbackOpenA(!isFeedbackOpenA)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b-2 border-[#141413] text-left cursor-pointer"
                    >
                      <span className="font-serif italic font-bold text-base sm:text-lg text-[#141413]">
                        First answer in
                      </span>
                      <div>
                        {isFeedbackOpenA ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isFeedbackOpenA && (
                      <div className="p-5 sm:p-6 space-y-5">
                        {/* WHAT WORKED */}
                        <div>
                          <div className="font-mono text-xs font-black uppercase text-[#059669] tracking-wider mb-1.5 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            WHAT WORKED
                          </div>
                          <p className="text-sm font-medium text-slate-800 leading-relaxed bg-[#F0FDF4] p-3.5 rounded-xl border border-emerald-200">
                            {evaluationResultA.whatWorked}
                          </p>
                        </div>

                        {/* DO THIS NEXT */}
                        <div>
                          <div className="font-mono text-xs font-black uppercase text-[#D97706] tracking-wider mb-1.5 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            DO THIS NEXT
                          </div>
                          <p className="text-sm font-medium text-slate-800 leading-relaxed bg-[#FFFBEB] p-3.5 rounded-xl border border-amber-200">
                            {evaluationResultA.doThisNext}
                          </p>
                        </div>

                        {/* Collapsible reference answer */}
                        <div className="pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setShowReferenceAnswerA(!showReferenceAnswerA)}
                            className="text-xs sm:text-sm font-bold text-slate-600 hover:text-black flex items-center gap-1 cursor-pointer"
                          >
                            <span>{showReferenceAnswerA ? 'Hide reference answer' : 'Show reference answer'}</span>
                            {showReferenceAnswerA ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {showReferenceAnswerA && (
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

                  {/* Bottom Navigation */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStepA(2)}
                      className="px-5 py-2.5 rounded-xl border-2 border-[#141413] bg-white hover:bg-slate-50 font-bold text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Revise Assumptions or Answer</span>
                    </button>

                    <Link
                      to="/chronicle"
                      className="px-5 py-2.5 rounded-xl border-2 border-[#141413] bg-[#FEF08A] hover:bg-[#FDE047] font-black text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#141413]"
                    >
                      <span>Return to Ramayana Chronicle</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* VARIANT B: Fill-in-the-Boxes Breakdown                        */}
        {/* ============================================================= */}
        {variant === 'B' && (
          <div className="space-y-6">
            {/* Header Card for Variant B */}
            <div className="bg-white rounded-2xl border-[3px] border-[#141413] p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-6">
              {/* Case Prompt Accordion Header */}
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
                      VARIANT B • STRUCTURED DECOMPOSITION
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

              <div>
                <span className="font-mono text-xs font-black uppercase text-[#188ab2] tracking-wider block mb-1">
                  STRUCTURED GUESSTIMATE BREAKDOWN
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight leading-tight">
                  Fill in the Values for Each Dimensional Part
                </h2>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2">
                  Decompose the Ram Setu problem into 3D geometric components. Fill in each box below using the case facts, then verify your final stone requirement.
                </p>
              </div>

              {/* Progress counter badge */}
              <div className="flex items-center gap-2 bg-[#FAF9F5] p-3 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700">Inputs Completed:</span>
                <span className="font-mono font-black px-2 py-0.5 bg-[#FEF08A] rounded border border-[#141413]">
                  {validationB.filledCount} / 6 Parts
                </span>
                {isSubmittedB && (
                  <span className="font-mono font-black text-emerald-700 ml-auto">
                    ✓ {validationB.correctCount} / 6 Match Model
                  </span>
                )}
              </div>

              {/* ── The 6 Fill-in-the-Boxes Form ────────────────────────── */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSubmittedB(true);
                  setShowReferenceAnswerB(true);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="space-y-5"
              >
                {/* Part 1: Length */}
                <div className="bg-[#FAF9F5] p-4 rounded-xl border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-xs sm:text-sm text-[#141413] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#141413] text-white flex items-center justify-center font-mono text-[11px]">
                        1
                      </span>
                      <span>Part 1: Causeway Span / Length (in meters)</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">Fact: 48 km across Palk Strait</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={boxInputsB.lengthMeters}
                      onChange={(e) =>
                        setBoxInputsB({ ...boxInputsB, lengthMeters: e.target.value })
                      }
                      placeholder="e.g. 48000"
                      className="p-2.5 rounded-lg border-2 border-[#141413] font-mono text-sm bg-white w-full sm:w-64"
                      required
                    />
                    <span className="font-mono text-xs font-bold text-slate-500">meters</span>
                    {isSubmittedB && (
                      <span className="text-xs font-bold">
                        {validationB.isLengthCorrect ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> 48,000 m
                          </span>
                        ) : (
                          <span className="text-amber-700">Model: 48,000 m (48 km × 1,000)</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Part 2: Width */}
                <div className="bg-[#FAF9F5] p-4 rounded-xl border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-xs sm:text-sm text-[#141413] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#141413] text-white flex items-center justify-center font-mono text-[11px]">
                        2
                      </span>
                      <span>Part 2: Causeway Width (in meters)</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">Fact: 10 ranks abreast + carts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={boxInputsB.widthMeters}
                      onChange={(e) =>
                        setBoxInputsB({ ...boxInputsB, widthMeters: e.target.value })
                      }
                      placeholder="e.g. 30"
                      className="p-2.5 rounded-lg border-2 border-[#141413] font-mono text-sm bg-white w-full sm:w-64"
                      required
                    />
                    <span className="font-mono text-xs font-bold text-slate-500">meters</span>
                    {isSubmittedB && (
                      <span className="text-xs font-bold">
                        {validationB.isWidthCorrect ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> 30 m
                          </span>
                        ) : (
                          <span className="text-amber-700">Model: 30 meters</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Part 3: Total Height (Depth + Clearance) */}
                <div className="bg-[#FAF9F5] p-4 rounded-xl border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-xs sm:text-sm text-[#141413] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#141413] text-white flex items-center justify-center font-mono text-[11px]">
                        3
                      </span>
                      <span>Part 3: Total Height from Seabed (in meters)</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">Fact: 3.0m water depth + 0.5m clearance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={boxInputsB.heightMeters}
                      onChange={(e) =>
                        setBoxInputsB({ ...boxInputsB, heightMeters: e.target.value })
                      }
                      placeholder="e.g. 3.5"
                      className="p-2.5 rounded-lg border-2 border-[#141413] font-mono text-sm bg-white w-full sm:w-64"
                      required
                    />
                    <span className="font-mono text-xs font-bold text-slate-500">meters</span>
                    {isSubmittedB && (
                      <span className="text-xs font-bold">
                        {validationB.isHeightCorrect ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> 3.5 m
                          </span>
                        ) : (
                          <span className="text-amber-700">Model: 3.5 m (3.0m seabed + 0.5m tide)</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Part 4: Total Volume (L x W x H) */}
                <div className="bg-[#FAF9F5] p-4 rounded-xl border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-xs sm:text-sm text-[#141413] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#188ab2] text-white flex items-center justify-center font-mono text-[11px]">
                        4
                      </span>
                      <span>Part 4: Calculated Causeway Volume (Length × Width × Height)</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">Formula: 48,000 × 30 × 3.5</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={boxInputsB.totalVolumeM3}
                      onChange={(e) =>
                        setBoxInputsB({ ...boxInputsB, totalVolumeM3: e.target.value })
                      }
                      placeholder="e.g. 5040000"
                      className="p-2.5 rounded-lg border-2 border-[#141413] font-mono text-sm bg-white w-full sm:w-64"
                      required
                    />
                    <span className="font-mono text-xs font-bold text-slate-500">m³</span>
                    {isSubmittedB && (
                      <span className="text-xs font-bold">
                        {validationB.isVolumeCorrect ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> 5,040,000 m³
                          </span>
                        ) : (
                          <span className="text-amber-700">Model: 5,040,000 m³</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Part 5: Unit Stone Volume */}
                <div className="bg-[#FAF9F5] p-4 rounded-xl border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-xs sm:text-sm text-[#141413] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#141413] text-white flex items-center justify-center font-mono text-[11px]">
                        5
                      </span>
                      <span>Part 5: Unit Boulder Volume (1.0m × 1.0m × 1.0m)</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">Fact: Cut Gandhamadana boulders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={boxInputsB.unitStoneM3}
                      onChange={(e) =>
                        setBoxInputsB({ ...boxInputsB, unitStoneM3: e.target.value })
                      }
                      placeholder="e.g. 1.0"
                      className="p-2.5 rounded-lg border-2 border-[#141413] font-mono text-sm bg-white w-full sm:w-64"
                      required
                    />
                    <span className="font-mono text-xs font-bold text-slate-500">m³ per stone</span>
                    {isSubmittedB && (
                      <span className="text-xs font-bold">
                        {validationB.isUnitCorrect ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> 1.0 m³
                          </span>
                        ) : (
                          <span className="text-amber-700">Model: 1.0 m³ per stone</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Part 6: Total Stones Required */}
                <div className="bg-[#FFFDF0] p-4 sm:p-5 rounded-xl border-2 border-[#141413] shadow-[2px_2px_0px_0px_#141413] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-xs sm:text-sm text-[#141413] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center font-mono text-[11px]">
                        ★
                      </span>
                      <span>Part 6: Total Stones Required (Volume ÷ Unit Stone Volume)</span>
                    </label>
                    <span className="text-[11px] font-black text-[#059669] uppercase">Final Solution</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      type="text"
                      value={boxInputsB.totalStones}
                      onChange={(e) =>
                        setBoxInputsB({ ...boxInputsB, totalStones: e.target.value })
                      }
                      placeholder="e.g. 5040000"
                      className="p-3 rounded-lg border-2 border-[#141413] font-mono text-base font-black bg-white w-full sm:w-72"
                      required
                    />
                    <span className="font-mono text-xs font-bold text-slate-600">stones (~5.04M)</span>
                    {isSubmittedB && (
                      <span className="text-xs font-bold">
                        {validationB.isStonesCorrect ? (
                          <span className="text-emerald-700 flex items-center gap-1 font-black">
                            <Check className="w-4 h-4" /> Perfect Match: 5,040,000 Stones!
                          </span>
                        ) : (
                          <span className="text-amber-700">Model: 5,040,000 stones (5.04 Million)</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end pt-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl border-[2.5px] border-[#141413] bg-[#059669] hover:bg-[#047857] text-white font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Check All Breakdown Parts & Reveal Model</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Reveal Reference Solution for Variant B */}
              {isSubmittedB && (
                <div className="mt-6 pt-6 border-t-2 border-slate-200 space-y-4">
                  <div className="bg-[#FEF08A]/40 rounded-xl border-2 border-[#141413] p-5 shadow-[2px_2px_0px_0px_#141413] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-[#141413]">
                        <Calculator className="w-4 h-4 text-[#188ab2]" />
                        <span>{currentCase.referenceCalculation.frameworkTitle}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        {validationB.correctCount} / 6 Parts Verified
                      </span>
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

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmittedB(false);
                      }}
                      className="px-4 py-2.5 rounded-xl border-2 border-[#141413] bg-white hover:bg-slate-50 font-bold text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Boxes & Try Again</span>
                    </button>

                    <Link
                      to="/chronicle"
                      className="px-5 py-2.5 rounded-xl border-2 border-[#141413] bg-[#FEF08A] hover:bg-[#FDE047] font-black text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#141413]"
                    >
                      <span>Return to Ramayana Chronicle</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CaseSimulatorPage;
