import React, { useState, useMemo } from 'react';
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
  HelpCircle,
  Sparkles
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
  const [searchParams] = useSearchParams();

  // ── Unified 50/50 Split for Single Link ────────────────────────────
  // Visitors to /case-simulator are automatically split 50/50 and persisted in localStorage.
  // Optional URL override (?v=a or ?v=b) remains available for instructor inspection.
  const [variant] = useState<'A' | 'B'>(() => {
    try {
      const vParam = searchParams.get('variant') || searchParams.get('v');
      if (vParam) {
        const normalized = vParam.toLowerCase();
        if (normalized === 'b' || normalized === 'breakdown' || normalized === 'boxes') return 'B';
        if (normalized === 'a' || normalized === 'open' || normalized === 'canvas') return 'A';
      }
      const stored = localStorage.getItem('pmx_ram_setu_ab_variant');
      if (stored === 'A' || stored === 'B') return stored;
      const assigned = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem('pmx_ram_setu_ab_variant', assigned);
      return assigned;
    } catch {
      return 'A';
    }
  });

  const currentCase = RAM_SETU_CASE;
  const [isCasePromptOpen, setIsCasePromptOpen] = useState<boolean>(true);

  // ── VARIANT A STATE (Assumptions & Open Canvas) ─────────────────────
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

  // ── VARIANT B STATE (Step-by-Step Breakdown with Assume vs Ask) ─────
  const [partsB, setPartsB] = useState<{
    length: { strategy: 'ask' | 'assume'; value: string; reasoning: string };
    width: { strategy: 'ask' | 'assume'; value: string; reasoning: string };
    height: { strategy: 'ask' | 'assume'; value: string; reasoning: string };
    volume: { value: string };
    stoneSize: { strategy: 'ask' | 'assume'; value: string; reasoning: string };
    totalStones: { value: string };
  }>({
    length: { strategy: 'ask', value: '', reasoning: '' },
    width: { strategy: 'ask', value: '', reasoning: '' },
    height: { strategy: 'ask', value: '', reasoning: '' },
    volume: { value: '' },
    stoneSize: { strategy: 'ask', value: '', reasoning: '' },
    totalStones: { value: '' }
  });

  const [isSubmittedB, setIsSubmittedB] = useState<boolean>(() => {
    try {
      return searchParams.get('submitted') === 'true';
    } catch {
      return false;
    }
  });

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
      whatWorked += ` You committed a final estimate of "${userFinalEstimateA}" before reviewing the model answer.`;
    }

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
    const l = parseFloat(partsB.length.value.replace(/,/g, '').trim());
    const w = parseFloat(partsB.width.value.replace(/,/g, '').trim());
    const h = parseFloat(partsB.height.value.replace(/,/g, '').trim());
    const v = parseFloat(partsB.volume.value.replace(/,/g, '').trim());
    const u = parseFloat(partsB.stoneSize.value.replace(/,/g, '').trim());
    const s = parseFloat(partsB.totalStones.value.replace(/,/g, '').trim());

    const isLengthCorrect = l === 48000;
    const isWidthCorrect = w === 30;
    const isHeightCorrect = h === 3.5 || (h >= 3.0 && h <= 3.5);
    const isVolumeCorrect = v === 5040000 || (l && w && h && Math.abs(v - l * w * h) < 100);
    const isUnitCorrect = u === 1 || u === 1.0;
    const isStonesCorrect = s === 5040000 || (v && u && Math.abs(s - v / u) < 100);

    const filledCount = [
      partsB.length.value,
      partsB.width.value,
      partsB.height.value,
      partsB.volume.value,
      partsB.stoneSize.value,
      partsB.totalStones.value
    ].filter((val) => val.trim() !== '').length;

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
  }, [partsB]);

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
              <h1 className="font-black text-base sm:text-lg tracking-tight text-[#141413] truncate">
                Ram Setu Guesstimate Simulator
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Container ────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* ============================================================= */}
        {/* VARIANT A: Clarify -> Assumptions -> Guide -> Final Canvas   */}
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
                        placeholder="State the boundary conditions or dimensions you would assume before receiving data from the interviewer (e.g. your estimated distance across the ocean, causeway width, water depth, and individual stone size)..."
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
                  {/* Interviewer Guide Revealed */}
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
                          className="font-bold text-slate-600 hover:text-black underline cursor-pointer"
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
                      {/* Intermediate Calculation: Clean placeholder with Optional tab */}
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <label className="block text-xs font-black uppercase text-[#141413]">
                            Show Your Intermediate Calculation:
                          </label>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 border border-slate-300">
                            Optional
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          value={userCalculationA}
                          onChange={(e) => setUserCalculationA(e.target.value)}
                          placeholder="Write down your formula, conversion of units, or intermediate volume math here if you wish (optional)..."
                          className="w-full p-3.5 rounded-xl border-2 border-[#141413] font-mono text-xs sm:text-sm bg-white shadow-[1.5px_1.5px_0px_0px_#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
                        />
                      </div>

                      {/* Final Stone Count Input: Clean placeholder */}
                      <div>
                        <label className="block text-xs font-black uppercase text-[#141413] mb-1.5">
                          Your Final Estimated Stone Count:
                        </label>
                        <input
                          type="text"
                          value={userFinalEstimateA}
                          onChange={(e) => setUserFinalEstimateA(e.target.value)}
                          placeholder="Enter your final estimated stone count..."
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

                  {/* Interviewer Answer Box */}
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
                        className="text-slate-600 font-bold hover:text-black underline cursor-pointer"
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

                  {/* Dynamic Hints Card */}
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
        {/* VARIANT B: Fill-in-the-Boxes (Assume vs Ask Mechanism)        */}
        {/* ============================================================= */}
        {variant === 'B' && (
          <div className="space-y-6">
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
                      STRUCTURED PM BREAKDOWN
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
                  For each physical dimension, choose whether you want to <strong>Ask the Interviewer</strong> for verified data or <strong>Make an Assumption</strong> first.
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
                    ✓ {validationB.correctCount} / 6 Verified with Model
                  </span>
                )}
              </div>

              {/* ── The 6 Fill-in-the-Boxes Form with Assume/Ask Tabs ── */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSubmittedB(true);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="space-y-6"
              >
                {/* ── PART 1: LENGTH ────────────────────────────────────── */}
                <div className="bg-[#FAF9F5] p-4 sm:p-5 rounded-xl border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="font-black text-xs sm:text-sm text-[#141413] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#141413] text-white flex items-center justify-center font-mono text-[11px]">
                        1
                      </span>
                      <span>Part 1: Causeway Span / Length (in meters)</span>
                    </label>

                    {/* Assume vs Ask toggle tabs */}
                    <div className="inline-flex items-center bg-white p-1 rounded-lg border border-[#141413] self-start sm:self-auto text-xs font-bold">
                      <button
                        type="button"
                        onClick={() =>
                          setPartsB({
                            ...partsB,
                            length: { ...partsB.length, strategy: 'ask' }
                          })
                        }
                        className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                          partsB.length.strategy === 'ask'
                            ? 'bg-[#FEF08A] text-[#141413] font-black border border-[#141413]'
                            : 'text-slate-500 hover:text-black'
                        }`}
                      >
                        Ask Interviewer
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPartsB({
                            ...partsB,
                            length: { ...partsB.length, strategy: 'assume' }
                          })
                        }
                        className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                          partsB.length.strategy === 'assume'
                            ? 'bg-[#FEF08A] text-[#141413] font-black border border-[#141413]'
                            : 'text-slate-500 hover:text-black'
                        }`}
                      >
                        Make Assumption
                      </button>
                    </div>
                  </div>

                  {/* Content conditional on Ask vs Assume */}
                  {partsB.length.strategy === 'ask' ? (
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-800 flex items-start gap-2">
                      <span className="font-black text-[#188ab2] shrink-0">•</span>
                      <div>
                        <strong className="text-[#141413]">Interviewer Response:</strong> The causeway spans approximately 48 kilometers across the Palk Strait from Dhanushkodi to Talaimannar.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={partsB.length.reasoning}
                        onChange={(e) =>
                          setPartsB({
                            ...partsB,
                            length: { ...partsB.length, reasoning: e.target.value }
                          })
                        }
                        placeholder="Why this number? / Your assumption reasoning (Optional)..."
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#188ab2]"
                      />
                    </div>
                  )}

                  {/* Input value */}
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="text"
                      value={partsB.length.value}
                      onChange={(e) =>
                        setPartsB({
                          ...partsB,
                          length: { ...partsB.length, value: e.target.value }
                        })
                      }
                      placeholder="Enter length in meters..."
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
                          <span className="text-amber-700">Model: 48,000 m</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── PART 2: WIDTH ─────────────────────────────────────── */}
                <div className="bg-[#FAF9F5] p-4 sm:p-5 rounded-xl border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="font-black text-xs sm:text-sm text-[#141413] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#141413] text-white flex items-center justify-center font-mono text-[11px]">
                        2
                      </span>
                      <span>Part 2: Causeway Width (in meters)</span>
                    </label>

                    <div className="inline-flex items-center bg-white p-1 rounded-lg border border-[#141413] self-start sm:self-auto text-xs font-bold">
                      <button
                        type="button"
                        onClick={() =>
                          setPartsB({
                            ...partsB,
                            width: { ...partsB.width, strategy: 'ask' }
                          })
                        }
                        className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                          partsB.width.strategy === 'ask'
                            ? 'bg-[#FEF08A] text-[#141413] font-black border border-[#141413]'
                            : 'text-slate-500 hover:text-black'
                        }`}
                      >
                        Ask Interviewer
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPartsB({
                            ...partsB,
                            width: { ...partsB.width, strategy: 'assume' }
                          })
                        }
                        className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                          partsB.width.strategy === 'assume'
                            ? 'bg-[#FEF08A] text-[#141413] font-black border border-[#141413]'
                            : 'text-slate-500 hover:text-black'
                        }`}
                      >
                        Make Assumption
                      </button>
                    </div>
                  </div>

                  {partsB.width.strategy === 'ask' ? (
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-800 flex items-start gap-2">
                      <span className="font-black text-[#188ab2] shrink-0">•</span>
                      <div>
                        <strong className="text-[#141413]">Interviewer Response:</strong> The bridge is designed 30 meters wide to safely accommodate 10 vanara infantry ranks + siege chariots marching abreast.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={partsB.width.reasoning}
                        onChange={(e) =>
                          setPartsB({
                            ...partsB,
                            width: { ...partsB.width, reasoning: e.target.value }
                          })
                        }
                        placeholder="Why this number? / Your assumption reasoning (Optional)..."
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#188ab2]"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="text"
                      value={partsB.width.value}
                      onChange={(e) =>
                        setPartsB({
                          ...partsB,
                          width: { ...partsB.width, value: e.target.value }
                        })
                      }
                      placeholder="Enter width in meters..."
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
                          <span className="text-amber-700">Model: 30 m</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── PART 3: DEPTH & HEIGHT ────────────────────────────── */}
                <div className="bg-[#FAF9F5] p-4 sm:p-5 rounded-xl border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="font-black text-xs sm:text-sm text-[#141413] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#141413] text-white flex items-center justify-center font-mono text-[11px]">
                        3
                      </span>
                      <span>Part 3: Total Height from Seabed (in meters)</span>
                    </label>

                    <div className="inline-flex items-center bg-white p-1 rounded-lg border border-[#141413] self-start sm:self-auto text-xs font-bold">
                      <button
                        type="button"
                        onClick={() =>
                          setPartsB({
                            ...partsB,
                            height: { ...partsB.height, strategy: 'ask' }
                          })
                        }
                        className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                          partsB.height.strategy === 'ask'
                            ? 'bg-[#FEF08A] text-[#141413] font-black border border-[#141413]'
                            : 'text-slate-500 hover:text-black'
                        }`}
                      >
                        Ask Interviewer
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPartsB({
                            ...partsB,
                            height: { ...partsB.height, strategy: 'assume' }
                          })
                        }
                        className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                          partsB.height.strategy === 'assume'
                            ? 'bg-[#FEF08A] text-[#141413] font-black border border-[#141413]'
                            : 'text-slate-500 hover:text-black'
                        }`}
                      >
                        Make Assumption
                      </button>
                    </div>
                  </div>

                  {partsB.height.strategy === 'ask' ? (
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-800 flex items-start gap-2">
                      <span className="font-black text-[#188ab2] shrink-0">•</span>
                      <div>
                        <strong className="text-[#141413]">Interviewer Response:</strong> Average water depth along the shoal is 3.0 meters, plus 0.5 meters bridge clearance above high tide (total height from seabed = 3.5 meters).
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={partsB.height.reasoning}
                        onChange={(e) =>
                          setPartsB({
                            ...partsB,
                            height: { ...partsB.height, reasoning: e.target.value }
                          })
                        }
                        placeholder="Why this number? / Your assumption reasoning (Optional)..."
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#188ab2]"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="text"
                      value={partsB.height.value}
                      onChange={(e) =>
                        setPartsB({
                          ...partsB,
                          height: { ...partsB.height, value: e.target.value }
                        })
                      }
                      placeholder="Enter height in meters..."
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
                          <span className="text-amber-700">Model: 3.5 m</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── PART 4: VOLUME ────────────────────────────────────── */}
                <div className="bg-[#FAF9F5] p-4 sm:p-5 rounded-xl border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-xs sm:text-sm text-[#141413] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#188ab2] text-white flex items-center justify-center font-mono text-[11px]">
                        4
                      </span>
                      <span>Part 4: Calculated Causeway Volume (Length × Width × Height)</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={partsB.volume.value}
                      onChange={(e) =>
                        setPartsB({
                          ...partsB,
                          volume: { value: e.target.value }
                        })
                      }
                      placeholder="Enter total volume in m³..."
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

                {/* ── PART 5: UNIT STONE DIMENSIONS ─────────────────────── */}
                <div className="bg-[#FAF9F5] p-4 sm:p-5 rounded-xl border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="font-black text-xs sm:text-sm text-[#141413] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#141413] text-white flex items-center justify-center font-mono text-[11px]">
                        5
                      </span>
                      <span>Part 5: Unit Boulder Volume (in m³)</span>
                    </label>

                    <div className="inline-flex items-center bg-white p-1 rounded-lg border border-[#141413] self-start sm:self-auto text-xs font-bold">
                      <button
                        type="button"
                        onClick={() =>
                          setPartsB({
                            ...partsB,
                            stoneSize: { ...partsB.stoneSize, strategy: 'ask' }
                          })
                        }
                        className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                          partsB.stoneSize.strategy === 'ask'
                            ? 'bg-[#FEF08A] text-[#141413] font-black border border-[#141413]'
                            : 'text-slate-500 hover:text-black'
                        }`}
                      >
                        Ask Interviewer
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPartsB({
                            ...partsB,
                            stoneSize: { ...partsB.stoneSize, strategy: 'assume' }
                          })
                        }
                        className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                          partsB.stoneSize.strategy === 'assume'
                            ? 'bg-[#FEF08A] text-[#141413] font-black border border-[#141413]'
                            : 'text-slate-500 hover:text-black'
                        }`}
                      >
                        Make Assumption
                      </button>
                    </div>
                  </div>

                  {partsB.stoneSize.strategy === 'ask' ? (
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-800 flex items-start gap-2">
                      <span className="font-black text-[#188ab2] shrink-0">•</span>
                      <div>
                        <strong className="text-[#141413]">Interviewer Response:</strong> Natural boulders cut from the Gandhamadana mountain range average roughly 1.0 m × 1.0 m × 1.0 m (unit volume = 1.0 m³ each).
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={partsB.stoneSize.reasoning}
                        onChange={(e) =>
                          setPartsB({
                            ...partsB,
                            stoneSize: { ...partsB.stoneSize, reasoning: e.target.value }
                          })
                        }
                        placeholder="Why this number? / Your assumption reasoning (Optional)..."
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#188ab2]"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="text"
                      value={partsB.stoneSize.value}
                      onChange={(e) =>
                        setPartsB({
                          ...partsB,
                          stoneSize: { ...partsB.stoneSize, value: e.target.value }
                        })
                      }
                      placeholder="Enter unit stone volume..."
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
                          <span className="text-amber-700">Model: 1.0 m³</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── PART 6: FINAL STONE COUNT ─────────────────────────── */}
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
                      value={partsB.totalStones.value}
                      onChange={(e) =>
                        setPartsB({
                          ...partsB,
                          totalStones: { value: e.target.value }
                        })
                      }
                      placeholder="Enter total estimated stone count..."
                      className="p-3 rounded-lg border-2 border-[#141413] font-mono text-base font-black bg-white w-full sm:w-72"
                      required
                    />
                    <span className="font-mono text-xs font-bold text-slate-600">stones</span>
                    {isSubmittedB && (
                      <span className="text-xs font-bold">
                        {validationB.isStonesCorrect ? (
                          <span className="text-emerald-700 flex items-center gap-1 font-black">
                            <Check className="w-4 h-4" /> Perfect Match: 5,040,000 Stones!
                          </span>
                        ) : (
                          <span className="text-amber-700">Model: 5,040,000 stones (~5.04M)</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end pt-2">
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
