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
  ArrowLeft,
  Check,
  Zap,
  Edit3,
  Layers
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
  // Current active step in the guided flow:
  // step 1 = Clarifying Questions
  // step 2 = Answer Canvas (formulate estimate and math)
  // step 3 = Interviewer Reveal & Dynamic Feedback
  const [step, setStep] = useState<1 | 2 | 3>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const s = parseInt(params.get('step') || '1', 10);
      if (s === 2 || s === 3) return s;
      return 1;
    } catch {
      return 1;
    }
  });

  const [userQuestions, setUserQuestions] = useState<string>('');
  const [userAnswerCanvas, setUserAnswerCanvas] = useState<string>('');
  const [userFinalEstimate, setUserFinalEstimate] = useState<string>('');

  const [isCasePromptOpen, setIsCasePromptOpen] = useState<boolean>(true);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(true);
  const [showReferenceAnswer, setShowReferenceAnswer] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('ref') === 'true';
    } catch {
      return false;
    }
  });
  const [showSubmittedRecap, setShowSubmittedRecap] = useState<boolean>(false);

  // Evaluator Mode: Built-in instant rubric vs Live Gemini
  const [evaluatorMode, setEvaluatorMode] = useState<'local' | 'ai'>('local');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('pmx_gemini_api_key') || '');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<{ whatWorked: string; doThisNext: string } | null>(null);

  const currentCase = RAM_SETU_CASE;

  // Local evaluation engine analyzing candidate questions and estimate
  const evaluationResult = useMemo(() => {
    if (!userQuestions.trim()) {
      return {
        whatWorked: 'You entered your clarifying questions phase.',
        doThisNext: 'Make sure to probe the 3D dimensions (Length, Width, Depth) and individual stone unit size.',
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
        'You asked setup questions, demonstrating the correct PM instinct to clarify boundaries before calculating.';
    } else {
      const snippets = matchedDimensions.map((m) => m.whatWorkedSnippet);
      whatWorked = snippets.slice(0, 2).join(' Furthermore, ');
    }

    // Check if the final estimate matches the ~5M ballpark
    const estClean = (userFinalEstimate + ' ' + userAnswerCanvas).toLowerCase();
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
        ' In addition, your final calculated estimate on the Answer Canvas hit the ~5.04 Million stone benchmark with strong arithmetic precision!';
    } else if (userFinalEstimate.trim()) {
      whatWorked += ` You clearly committed your final estimate of "${userFinalEstimate}" on the canvas before viewing the model answer.`;
    }

    // Dynamic "DO THIS NEXT"
    let doThisNext = '';
    if (missedCritical.length > 0) {
      const missedLabels = missedCritical.map((m) => `"${m.label}"`).join(' and ');
      const snippets = missedCritical.map((m) => m.blindspotSnippet).join(' ');
      doThisNext = `Your setup missed critical dimensions like ${missedLabels}. ${snippets} In future estimation rounds, systematically break physical problems into 3D volume (Length × Width × Height) divided by unit volume.`;
    } else if (matchedDimensions.length === currentCase.rubric.dimensions.length) {
      doThisNext =
        'Flawless geometric setup! You accounted for all 4 physical variables: Length, Width, Depth, and Stone Unit Size. In an executive interview, follow up by sanity checking the daily placement rate against army headcount.';
    } else {
      doThisNext =
        'Solid approach. To make your estimation airtight, always check whether the foundation is submerged (adding depth to the volume equation) before presenting to leadership.';
    }

    const scorePct = Math.round((matchedDimensions.length / currentCase.rubric.dimensions.length) * 100);

    return { whatWorked, doThisNext, scorePct };
  }, [userQuestions, userAnswerCanvas, userFinalEstimate, currentCase]);

  // Step 1: Submit Questions and proceed to Answer Canvas
  const handleProceedToCanvas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestions.trim()) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: Submit Answer Canvas and reveal Interviewer Evaluation & Hints
  const handleSubmitCanvas = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    setIsFeedbackOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If AI mode is enabled and user has key, run live Gemini evaluation
    if (evaluatorMode === 'ai' && apiKey.trim()) {
      setIsAiLoading(true);
      try {
        const prompt = `You are a strict, top-tier Product Management & Strategy case interviewer evaluating a candidate's guesstimate on the Ram Setu stone requirement.
Case Prompt: "${currentCase.casePrompt}"
Case Ground Facts: ${JSON.stringify(currentCase.interviewerData)}
Candidate Clarifying Questions:
"${userQuestions}"
Candidate Answer Canvas Solution & Estimate:
"${userAnswerCanvas}"
Final Estimate: "${userFinalEstimate}"

Evaluate the candidate's performance. Ground truth calculation is 48,000m × 30m × 3.5m = 5,040,000 m³ = 5.04 Million stones (1m³ each).
Output ONLY a valid JSON object in this exact format:
{
  "whatWorked": "1-2 sentences highlighting the smartest questions or math logic the candidate executed.",
  "doThisNext": "1-2 sentences highlighting the biggest blindspot they missed or how to structure the presentation for executive leadership."
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
    // Allows returning to Step 2 to revise estimate or Step 1 to revise questions
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('pmx_gemini_api_key', key);
  };

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
              <h1 className="font-black text-base sm:text-lg tracking-tight text-[#141413]">
                Ram Setu Guesstimate Simulator
              </h1>
            </div>
          </div>

          {/* Engine Mode Toggle (Local Heuristic vs Live Gemini) */}
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
                ⚡ Smart Rubric
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
                Live AI
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Container ────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Step Progression Stepper */}
        <div className="bg-white rounded-xl border-2 border-[#141413] p-3 shadow-[2px_2px_0px_0px_#141413] flex items-center justify-between text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              step === 1
                ? 'bg-[#FEF08A] text-[#141413] border border-[#141413] font-black shadow-[1px_1px_0px_0px_#141413]'
                : step > 1
                ? 'text-emerald-700 hover:bg-slate-100'
                : 'text-slate-400'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-black ${
              step > 1 ? 'bg-emerald-600 text-white' : 'bg-[#141413] text-white'
            }`}>
              {step > 1 ? <Check className="w-3 h-3" /> : '1'}
            </span>
            <span>1. Clarifying Questions</span>
          </button>

          <span className="text-slate-300 font-black">➔</span>

          <button
            type="button"
            onClick={() => userQuestions.trim() && setStep(2)}
            disabled={!userQuestions.trim()}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              step === 2
                ? 'bg-[#FEF08A] text-[#141413] border border-[#141413] font-black shadow-[1px_1px_0px_0px_#141413]'
                : step > 2
                ? 'text-emerald-700 hover:bg-slate-100'
                : 'text-slate-400 cursor-not-allowed'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-black ${
              step > 2 ? 'bg-emerald-600 text-white' : step === 2 ? 'bg-[#141413] text-white' : 'bg-slate-300 text-slate-600'
            }`}>
              {step > 2 ? <Check className="w-3 h-3" /> : '2'}
            </span>
            <span>2. Answer Canvas</span>
          </button>

          <span className="text-slate-300 font-black">➔</span>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              step === 3
                ? 'bg-[#FEF08A] text-[#141413] border border-[#141413] font-black shadow-[1px_1px_0px_0px_#141413]'
                : 'text-slate-400'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-black ${
              step === 3 ? 'bg-[#141413] text-white' : 'bg-slate-300 text-slate-600'
            }`}>
              3
            </span>
            <span>3. Model Reveal & Hints</span>
          </div>
        </div>

        {/* AI Key input banner if in AI mode */}
        {evaluatorMode === 'ai' && (
          <div className="bg-[#FFFDF0] rounded-xl border-2 border-[#141413] p-4 shadow-[2px_2px_0px_0px_#141413] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
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

        {/* ── Main Case Card (Neobrutalism Container) ───────────────── */}
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

          {/* ── STEP 1: CLARIFYING QUESTIONS ───────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#141413] tracking-tight leading-tight">
                  {currentCase.clarifyingPrompt}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2">
                  Interrogating the right parameters early prevents solving the wrong problem. What missing information or dimensions do you need from the interviewer before calculating?
                </p>
              </div>

              <form onSubmit={handleProceedToCanvas} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-black uppercase text-[#141413] mb-2">
                    Your Clarifying Questions:
                  </label>
                  <textarea
                    rows={6}
                    value={userQuestions}
                    onChange={(e) => setUserQuestions(e.target.value)}
                    placeholder="Type the clarifying questions or parameters you would ask the interviewer before beginning your calculation..."
                    className="w-full p-4 rounded-xl border-2 border-[#141413] font-medium text-sm sm:text-base bg-[#FDFCF7] shadow-[2px_2px_0px_0px_#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2] transition-all"
                    required
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 rounded-xl border-[2.5px] border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#141413] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Answer Canvas</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── STEP 2: ANSWER CANVAS (CALCULATE & ESTIMATE) ──────────── */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Interviewer parameter reveal banner */}
              <div className="bg-[#FAF9F5] rounded-xl border-2 border-[#141413] p-5 sm:p-6 shadow-[2px_2px_0px_0px_#141413] space-y-4">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-[#141413]">
                    <div className="w-6 h-6 rounded bg-[#141413] text-white flex items-center justify-center">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    INTERVIEWER'S BRIEFING & DATA
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#141413] bg-white text-xs font-bold text-slate-700 hover:bg-[#FFF3A7] transition-all shadow-[1px_1px_0px_0px_#141413] cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Questions</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Based on your clarifying setup, here are the physical constraints and parameters provided:
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

              {/* The Answer Canvas Workspace */}
              <div className="bg-[#FFFDF0] rounded-2xl border-[2.5px] border-[#141413] p-6 shadow-[3px_3px_0px_0px_#141413] space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[11px] font-black uppercase text-[#188ab2] tracking-wider block mb-1">
                      STEP 2 • ANSWER CANVAS
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#141413]">
                      Formulate Your Stone Estimate
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#FEF08A] border-2 border-[#141413] flex items-center justify-center font-black text-sm">
                    🪨
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  Use the parameters above to formulate your solution. Show your math formula (e.g. Length × Width × Height ÷ Stone Volume), state intermediate assumptions, and calculate your final stone count.
                </p>

                <form onSubmit={handleSubmitCanvas} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-[#141413] mb-1.5">
                      Your Calculation & Logic Steps:
                    </label>
                    <textarea
                      rows={5}
                      value={userAnswerCanvas}
                      onChange={(e) => setUserAnswerCanvas(e.target.value)}
                      placeholder="e.g.&#10;1. Total volume formula = Length × Width × Height&#10;2. Convert units: 48 km = 48,000 m...&#10;3. Total stones required = Total volume ÷ unit volume of stone..."
                      className="w-full p-3.5 rounded-xl border-2 border-[#141413] font-mono text-xs sm:text-sm bg-white shadow-[1.5px_1.5px_0px_0px_#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-[#141413] mb-1.5">
                      Your Final Stone Count Estimate:
                    </label>
                    <input
                      type="text"
                      value={userFinalEstimate}
                      onChange={(e) => setUserFinalEstimate(e.target.value)}
                      placeholder="e.g. 5,040,000 or 5.04 Million stones"
                      className="w-full sm:w-80 p-3 rounded-lg border-2 border-[#141413] font-mono text-sm bg-white shadow-[1.5px_1.5px_0px_0px_#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 rounded-xl border-2 border-[#141413] bg-white hover:bg-slate-50 font-bold text-xs uppercase tracking-wide cursor-pointer transition-all text-center"
                    >
                      ← Back to Questions
                    </button>

                    <button
                      type="submit"
                      className="px-7 py-3 rounded-xl border-[2.5px] border-[#141413] bg-[#059669] hover:bg-[#047857] text-white font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#141413] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Submit Estimate & Reveal Evaluation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── STEP 3: INTERVIEWER REVEAL & DYNAMIC HINTS ───────────── */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Question Headline Recap */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight leading-tight">
                  {currentCase.clarifyingPrompt}
                </h2>
              </div>

              {/* INTERVIEWER ANSWER BOX (Matches Reference Screenshot) */}
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

                {/* Candidate's submitted text preview toggle */}
                <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowSubmittedRecap(!showSubmittedRecap)}
                    className="text-[#188ab2] font-black hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showSubmittedRecap ? 'Hide your submitted work' : 'View your submitted questions & answer'}</span>
                    {showSubmittedRecap ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleRevise}
                    className="text-slate-600 font-bold hover:text-black underline"
                  >
                    Edit your inputs
                  </button>
                </div>

                {showSubmittedRecap && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                    <div>
                      <strong className="text-slate-900 block">Clarifying Questions Asked:</strong>
                      <p className="text-slate-700 whitespace-pre-wrap mt-0.5">{userQuestions}</p>
                    </div>
                    {userAnswerCanvas && (
                      <div className="pt-2 border-t border-slate-100">
                        <strong className="text-slate-900 block">Answer Canvas Steps:</strong>
                        <p className="text-slate-700 font-mono whitespace-pre-wrap mt-0.5">{userAnswerCanvas}</p>
                      </div>
                    )}
                    {userFinalEstimate && (
                      <div className="pt-2 border-t border-slate-100">
                        <strong className="text-slate-900 block">Your Final Estimate:</strong>
                        <p className="font-mono font-black text-[#188ab2]">{userFinalEstimate}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* DYNAMIC HINTS CARD ("First answer in ^") */}
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

              {/* Action buttons at the bottom of reveal */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRevise}
                  className="px-5 py-2.5 rounded-xl border-2 border-[#141413] bg-white hover:bg-slate-50 font-bold text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Revise Estimate or Questions</span>
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
    </div>
  );
}

export default CaseSimulatorPage;
