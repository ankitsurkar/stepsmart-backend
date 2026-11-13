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
  Trophy,
  Mail,
  User,
  Award,
  AlertCircle,
  ShieldCheck,
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

// Seed leaderboard entries so students immediately see a real cohort standings table
interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  variant: 'A' | 'B';
  estimate: string;
  accuracyScore: number;
  rankBadge: string;
  submittedAt: string;
  isFirstSubmission: boolean;
}

const DEFAULT_COHORT_SEEDS: LeaderboardEntry[] = [
  {
    id: 'SEED-1',
    name: 'Rohan Sharma',
    email: 'rohan.pmx@gmail.com',
    variant: 'A',
    estimate: '5.04 Million stones',
    accuracyScore: 100,
    rankBadge: '★ Master PM',
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    isFirstSubmission: true
  },
  {
    id: 'SEED-2',
    name: 'Priya Verma',
    email: 'priya.v@gmail.com',
    variant: 'B',
    estimate: '5,040,000',
    accuracyScore: 100,
    rankBadge: '★ Master PM',
    submittedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    isFirstSubmission: true
  },
  {
    id: 'SEED-3',
    name: 'Vikram Patel',
    email: 'vikram.p@gmail.com',
    variant: 'A',
    estimate: '5.2 Million stones',
    accuracyScore: 94,
    rankBadge: 'Senior Estimator',
    submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    isFirstSubmission: true
  },
  {
    id: 'SEED-4',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@gmail.com',
    variant: 'B',
    estimate: '4.8 Million',
    accuracyScore: 92,
    rankBadge: 'Senior Estimator',
    submittedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    isFirstSubmission: true
  },
  {
    id: 'SEED-5',
    name: 'Aman Deshmukh',
    email: 'aman.d@gmail.com',
    variant: 'A',
    estimate: '4.5 Million stones',
    accuracyScore: 88,
    rankBadge: 'PM Estimator',
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isFirstSubmission: true
  }
];

// Helper to calculate accuracy score against 5,040,000
function computeAccuracyScore(rawEstimate: string, variant: 'A' | 'B', correctBoxesCount?: number): number {
  if (variant === 'B' && typeof correctBoxesCount === 'number') {
    return Math.round((correctBoxesCount / 6) * 100);
  }

  const clean = rawEstimate.toLowerCase().replace(/,/g, '').trim();
  if (clean.includes('5.04') || clean.includes('5040000')) return 100;
  if (clean.includes('5m') || clean.includes('5 million') || clean.includes('5000000') || clean.includes('50 lakh')) return 98;

  // Extract numeric digits
  const numMatch = clean.match(/([\d.]+)/);
  if (numMatch) {
    let val = parseFloat(numMatch[1]);
    if (val < 100 && (clean.includes('m') || clean.includes('million'))) {
      val = val * 1000000;
    } else if (val < 1000 && clean.includes('lakh')) {
      val = val * 100000;
    }

    if (val > 0) {
      const benchmark = 5040000;
      const errorRatio = Math.abs(val - benchmark) / benchmark;
      if (errorRatio < 0.05) return 98;
      if (errorRatio < 0.15) return 92;
      if (errorRatio < 0.30) return 86;
      if (errorRatio < 0.50) return 78;
      return Math.max(50, Math.round(100 - errorRatio * 50));
    }
  }

  return 75; // Baseline for completed attempt
}

// ── LEADERBOARD COMPONENT ──────────────────────────────────────────────
interface LeaderboardSectionProps {
  variant: 'A' | 'B';
  finalEstimate: string;
  userCalculation?: string;
  correctCount?: number;
}

function LeaderboardSection({ variant, finalEstimate, userCalculation, correctCount }: LeaderboardSectionProps) {
  const [name, setName] = useState<string>(() => localStorage.getItem('pmx_leaderboard_user_name') || '');
  const [email, setEmail] = useState<string>(() => localStorage.getItem('pmx_leaderboard_user_email') || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null);
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load existing entries from localStorage or seeds
  const [allEntries, setAllEntries] = useState<LeaderboardEntry[]>(() => {
    try {
      const raw = localStorage.getItem('pmx_guesstimate_leaderboard_all');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_COHORT_SEEDS;
    } catch {
      return DEFAULT_COHORT_SEEDS;
    }
  });

  // Check if current user has already submitted previously on this browser
  useEffect(() => {
    const storedEmail = localStorage.getItem('pmx_leaderboard_user_email');
    if (storedEmail) {
      const match = allEntries.find((e) => e.email.toLowerCase() === storedEmail.toLowerCase());
      if (match) {
        setUserEntry(match);
        setShowLeaderboard(true);
      }
    }
  }, [allEntries]);

  // Handle Leaderboard Submission with FIRST-SUBMISSION rule
  const handleSubmitLeaderboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDuplicateMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Both fields are mandatory if participating in the leaderboard
    if (!cleanName || !cleanEmail) {
      setErrorMessage('Both Full Name and Gmail ID are required to join the leaderboard.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address (e.g. name@gmail.com).');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Check if an entry with this email already exists
      const existing = allEntries.find((item) => item.email.toLowerCase() === cleanEmail);

      if (existing) {
        // ENFORCE FIRST-SUBMISSION RULE:
        // Do NOT overwrite their first submission, because answers are already revealed!
        setUserEntry(existing);
        setShowLeaderboard(true);
        setDuplicateMessage(
          `Welcome back, ${existing.name}! Your official score of ${existing.accuracyScore}% (from your initial attempt on ${new Date(existing.submittedAt).toLocaleDateString()}) is preserved on the leaderboard. As stated in our rules, only your first submission is considered.`
        );
        localStorage.setItem('pmx_leaderboard_user_email', cleanEmail);
        localStorage.setItem('pmx_leaderboard_user_name', existing.name);
      } else {
        // FIRST TIME SUBMISSION:
        const score = computeAccuracyScore(finalEstimate, variant, correctCount);
        const rankBadge = score >= 98 ? '★ Master PM' : score >= 88 ? 'Senior Estimator' : 'PM Estimator';

        const newEntry: LeaderboardEntry = {
          id: `RAMSETU#${cleanEmail.replace(/[^a-z0-9]/g, '_')}#${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          variant,
          estimate: finalEstimate || '5,040,000 stones',
          accuracyScore: score,
          rankBadge,
          submittedAt: new Date().toISOString(),
          isFirstSubmission: true
        };

        const updatedList = [newEntry, ...allEntries];
        setAllEntries(updatedList);
        setUserEntry(newEntry);
        setShowLeaderboard(true);

        // Save locally
        localStorage.setItem('pmx_guesstimate_leaderboard_all', JSON.stringify(updatedList));
        localStorage.setItem('pmx_leaderboard_user_email', cleanEmail);
        localStorage.setItem('pmx_leaderboard_user_name', cleanName);

        // Dispatch to backend API
        try {
          await fetch('https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page: 'save_chronicle_response',
              visitorId: cleanEmail,
              name: cleanName,
              email: cleanEmail,
              source: 'ram_setu_guesstimate_leaderboard',
              responseType: 'guesstimate_leaderboard',
              variant,
              estimate: finalEstimate,
              accuracyScore: score,
              firstSubmissionOnly: true,
              timestamp: new Date().toISOString()
            })
          });
        } catch (apiErr) {
          console.warn('Backend leaderboard sync failed silently:', apiErr);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sorted leaderboard ranking: highest score first, then earliest timestamp
  const sortedLeaderboard = useMemo(() => {
    return [...allEntries].sort((a, b) => {
      if (b.accuracyScore !== a.accuracyScore) {
        return b.accuracyScore - a.accuracyScore;
      }
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    });
  }, [allEntries]);

  // Determine current user's rank
  const userRank = useMemo(() => {
    if (!userEntry) return null;
    const idx = sortedLeaderboard.findIndex(
      (e) => e.email.toLowerCase() === userEntry.email.toLowerCase()
    );
    return idx >= 0 ? idx + 1 : null;
  }, [userEntry, sortedLeaderboard]);

  return (
    <div className="bg-white rounded-2xl border-[3px] border-[#141413] p-5 sm:p-7 shadow-[4px_4px_0px_0px_#141413] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FEF08A] border-2 border-[#141413] flex items-center justify-center text-lg shadow-[1.5px_1.5px_0px_0px_#141413]">
            <Trophy className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                Optional Showcase
              </span>
              <span className="font-mono text-xs font-black uppercase text-slate-500">
                Cohort Standings
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
              Join the Ram Setu PM Leaderboard
            </h3>
          </div>
        </div>

        {userEntry && (
          <button
            type="button"
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg border-2 border-[#141413] bg-[#FEF08A] text-xs font-black text-[#141413] hover:bg-[#FDE047] transition-all shadow-[1.5px_1.5px_0px_0px_#141413] cursor-pointer"
          >
            {showLeaderboard ? 'Hide Leaderboard' : 'View Leaderboard 🏆'}
          </button>
        )}
      </div>

      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
        Want to showcase your guesstimate on the public cohort leaderboard? Enter your name and Gmail ID below. If you prefer to practice privately, you can simply skip this section.
      </p>

      {/* Duplicate Notice Banner (Enforces First Submission Rule) */}
      {duplicateMessage && (
        <div className="bg-sky-50 rounded-xl border-2 border-[#188ab2] p-4 text-xs text-sky-950 flex items-start gap-3 shadow-[2px_2px_0px_0px_#188ab2]">
          <ShieldCheck className="w-5 h-5 text-[#188ab2] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block text-sm font-black text-[#0f6f8f] mb-1">
              First Submission Preserved:
            </strong>
            {duplicateMessage}
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-50 rounded-xl border-2 border-red-500 p-3 text-xs text-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── Submission Form ────────────────────────────────────────────── */}
      {!userEntry ? (
        <form onSubmit={handleSubmitLeaderboard} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>Full Name:</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sanket Surkar"
                className="w-full p-3 rounded-xl border-2 border-[#141413] text-xs sm:text-sm font-bold bg-[#FAF9F5] shadow-[1.5px_1.5px_0px_0px_#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-600" />
                <span>Gmail ID:</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yourname@gmail.com"
                className="w-full p-3 rounded-xl border-2 border-[#141413] text-xs sm:text-sm font-bold bg-[#FAF9F5] shadow-[1.5px_1.5px_0px_0px_#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
                required
              />
            </div>
          </div>

          {/* ⚠️ Explicit Leaderboard Rule Note */}
          <div className="bg-amber-50/90 rounded-xl border-2 border-amber-300 p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Official Leaderboard Policy:</strong> Both fields are required to participate. <u>Only your very first submission will be counted and ranked on the official leaderboard</u>. Since the model answer is revealed on your initial attempt, subsequent attempts will not overwrite your original score.
            </div>
          </div>

          <div className="flex items-center justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 rounded-xl border-[2.5px] border-[#141413] bg-[#141413] hover:bg-[#282726] text-[#FEF08A] font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-[#FEF08A]" />
              <span>{isSubmitting ? 'Saving...' : 'Submit to Leaderboard & Reveal Standings'}</span>
              <ArrowRight className="w-4 h-4 text-[#FEF08A]" />
            </button>
          </div>
        </form>
      ) : (
        /* Confirmed submission badge */
        <div className="bg-[#FAF9F5] p-4 rounded-xl border-2 border-[#141413] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <span className="font-bold text-slate-700">Official Leaderboard Profile:</span>
              <div className="font-black text-sm text-[#141413]">
                {userEntry.name}{' '}
                <span className="font-normal text-xs text-slate-500">({userEntry.email})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userRank && (
              <span className="px-3 py-1 rounded-lg bg-[#FEF08A] border border-[#141413] font-mono font-black text-xs">
                Your Rank: #{userRank}
              </span>
            )}
            <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-black text-xs">
              Score: {userEntry.accuracyScore}%
            </span>
          </div>
        </div>
      )}

      {/* ── THE LIVE LEADERBOARD SHOWCASE ─────────────────────────────── */}
      {showLeaderboard && (
        <div className="pt-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-[#141413]">
              <Award className="w-4 h-4 text-[#188ab2]" />
              <span>Top PM Estimators Cohort Rankings</span>
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              {sortedLeaderboard.length} Estimators Ranked
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border-2 border-[#141413] shadow-[2px_2px_0px_0px_#141413]">
            <table className="w-full text-left text-xs bg-white">
              <thead className="bg-[#FAF9F5] border-b-2 border-[#141413] font-mono text-[11px] uppercase text-slate-700">
                <tr>
                  <th className="p-3 w-16 text-center">Rank</th>
                  <th className="p-3">PM Estimator</th>
                  <th className="p-3">Stone Estimate</th>
                  <th className="p-3">Accuracy</th>
                  <th className="p-3 text-right">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {sortedLeaderboard.map((entry, index) => {
                  const isCurrentUser =
                    userEntry && entry.email.toLowerCase() === userEntry.email.toLowerCase();

                  return (
                    <tr
                      key={entry.id || index}
                      className={`transition-colors ${
                        isCurrentUser
                          ? 'bg-[#FEF08A]/50 font-bold border-l-4 border-l-[#141413]'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-3 text-center font-mono font-black">
                        {index === 0 && <span className="text-amber-500">🥇 #1</span>}
                        {index === 1 && <span className="text-slate-400">🥈 #2</span>}
                        {index === 2 && <span className="text-amber-700">🥉 #3</span>}
                        {index > 2 && <span className="text-slate-600">#{index + 1}</span>}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-[#141413]">{entry.name}</span>
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.2 rounded bg-[#141413] text-white text-[9px] font-black uppercase">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {entry.email.replace(/(.{2})(.*)(?=@)/, '$1***')}
                        </span>
                      </td>

                      <td className="p-3 font-mono font-bold text-slate-800">
                        {entry.estimate}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-black text-[11px] border ${
                            entry.accuracyScore >= 98
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : entry.accuracyScore >= 88
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          {entry.accuracyScore}%
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                          {entry.variant === 'A' ? 'Canvas' : 'Boxes'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────
export function CaseSimulatorPage() {
  const [searchParams] = useSearchParams();

  // User requested: keep only Version B for now
  const variant: 'B' = 'B';
  const currentCase = RAM_SETU_CASE;
  const [isCasePromptOpen, setIsCasePromptOpen] = useState<boolean>(true);

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
        {/* VARIANT B ONLY: Fill-in-the-Boxes (Assume vs Ask Mechanism)   */}
        {/* ============================================================= */}
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
                  <div className="mt-4 space-y-3">
                    {/* Epic Vanaras Building Causeway Image */}
                    <div className="relative rounded-xl border-2 border-[#141413] overflow-hidden shadow-[3px_3px_0px_0px_#141413]">
                      <img
                        src="/ram_setu_vanaras.jpg"
                        alt="Vanaras building Ram Setu causeway across the ocean"
                        className="w-full h-56 sm:h-80 object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-[#141413]/90 text-white font-mono text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md border border-white/30 backdrop-blur-sm shadow-md">
                        🐒 The Vanara Army carrying and placing floating stones inscribed with श्री राम
                      </div>
                    </div>
                    <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
                      {currentCase.casePrompt}
                    </p>
                  </div>
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
                <div className="mt-6 pt-6 border-t-2 border-slate-200 space-y-6">
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

                  {/* ── OPTIONAL LEADERBOARD SECTION FOR VARIANT B ───────── */}
                  <LeaderboardSection
                    variant="B"
                    finalEstimate={partsB.totalStones.value}
                    correctCount={validationB.correctCount}
                  />

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
      </div>
    </div>
  );
}

export default CaseSimulatorPage;
