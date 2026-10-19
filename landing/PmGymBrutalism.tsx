import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Calendar,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  ChevronRight,
  Clock,
  Send,
  RotateCcw,
  Eye,
  Check,
  AlertCircle,
  Award,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export type GymQuestion = {
  date: string;
  type: 'quiz' | 'text';
  text: string;
  options?: string[] | null;
  correctIndex?: number | null;
  correctAnswer?: string | null;
  explanation?: string | null;
  category?: string;
};

// Built-in initial/fallback questions matching LMS DynamoDB course questions
export const FALLBACK_GYM_QUESTIONS: GymQuestion[] = [
  {
    date: "2026-10-19",
    type: "text",
    text: "Recall the cheat code (Problem → Users → Needs → Solutions → Prioritize → Test → Measure → Risks). For a payments app feature aimed at elderly users, say one thing you would do at each step.",
    options: null,
    correctIndex: null,
    correctAnswer: "Problem: fear of fraud and complex flows. Users: elderly, family caregivers, merchants; focus on elderly plus caregivers. Needs: simple, familiar, accessible, trustworthy. Solutions: large-text mode, one-tap repeat payments, caregiver alerts. Prioritize by impact, feasibility, viability, usability. Test with an A/B or pilot. Measure conversion, retention, drop-off reduction. Risks: value, usability, feasibility, business.",
    explanation: "Problem: fear of fraud and complex flows. Users: elderly, family caregivers, merchants; focus on elderly plus caregivers. Needs: simple, familiar, accessible, trustworthy. Solutions: large-text mode, one-tap repeat payments, caregiver alerts. Prioritize by impact, feasibility, viability, usability. Test with an A/B or pilot. Measure conversion, retention, drop-off reduction. Risks: value, usability, feasibility, business.",
    category: "Product Design & Frameworks"
  },
  {
    date: "2026-10-18",
    type: "quiz",
    text: "\"Users would love it, but engineering cannot build it in the timeline.\" Which risk is this?",
    options: [
      "Value risk",
      "Usability risk",
      "Feasibility risk",
      "Business risk"
    ],
    correctIndex: 2,
    correctAnswer: null,
    explanation: "Feasibility risk is whether engineering can build the solution with the available time, skills, and technology. Value = will they buy/use it; Usability = can they figure out how to use it; Business viability = does it work for our business model.",
    category: "Product Discovery & Risks"
  },
  {
    date: "2026-10-17",
    type: "quiz",
    text: "Which prioritization framework calculates priority as (Reach * Impact * Confidence) / Effort?",
    options: [
      "MoSCoW Method",
      "Kano Model",
      "RICE Framework",
      "Value vs Complexity Matrix"
    ],
    correctIndex: 2,
    correctAnswer: null,
    explanation: "RICE stands for Reach, Impact, Confidence, and Effort. It produces an objective numerical score to stack-rank competing feature requests.",
    category: "Backlog Prioritization"
  },
  {
    date: "2026-10-16",
    type: "text",
    text: "Swiggy notices cart abandonment increased by 12% in the past week among repeat customers. What 3 immediate data points would you look at first?",
    options: null,
    correctIndex: null,
    correctAnswer: "1. Delivery fee / surge pricing changes or newly introduced platform fees. 2. Payment gateway failure rates (UPI/cards). 3. Specific restaurant / geo-cluster drop-offs or app update bugs on checkout screen.",
    explanation: "In an RCA (Root Cause Analysis), always check for internal release changes (fees, UI tweaks), system anomalies (payment gateway uptime), and segmentation (device OS, city, order value).",
    category: "Root Cause Analysis (RCA)"
  },
  {
    date: "2026-10-15",
    type: "quiz",
    text: "In the Hook Model by Nir Eyal, what is the correct cycle order to build habitual products?",
    options: [
      "Trigger → Action → Variable Reward → Investment",
      "Action → Trigger → Variable Reward → Investment",
      "Trigger → Action → Investment → Variable Reward",
      "Investment → Trigger → Action → Variable Reward"
    ],
    correctIndex: 0,
    correctAnswer: null,
    explanation: "The Hook Model consists of four consecutive phases: 1. Trigger (external or internal), 2. Action (minimal effort behavior), 3. Variable Reward (dopamine/satisfaction), and 4. Investment (bit of work that improves future experience).",
    category: "Product Psychology & Retention"
  }
];

export const toDateKey = (d: Date): string => {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${dy}`;
};

export const formatDisplayDate = (dateStr: string): string => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
};

const getYesterdayDateKey = (todayKey: string): string => {
  try {
    const [y, m, d] = todayKey.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() - 1);
    return toDateKey(dateObj);
  } catch (e) {
    return '';
  }
};

export const calculateLandingGymStreak = (): number => {
  try {
    let streak = 0;
    let checkDate = new Date();
    const todayStr = toDateKey(checkDate);
    const completedToday = localStorage.getItem(`pm_gym_landing_completed_${todayStr}`) === 'true';

    if (!completedToday) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = toDateKey(yesterday);
      const completedYesterday = localStorage.getItem(`pm_gym_landing_completed_${yesterdayStr}`) === 'true';
      if (completedYesterday) {
        checkDate = yesterday;
      } else {
        return 0;
      }
    }

    for (let i = 0; i < 365; i++) {
      const dStr = toDateKey(checkDate);
      if (localStorage.getItem(`pm_gym_landing_completed_${dStr}`) === 'true') {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  } catch (e) {
    return 0;
  }
};

export function PmGymBrutalism() {
  const [questions, setQuestions] = useState<GymQuestion[]>(FALLBACK_GYM_QUESTIONS);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(() => toDateKey(new Date()));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [streak, setStreak] = useState<number>(0);
  const [hasSolvedSelectedDay, setHasSolvedSelectedDay] = useState(false);
  const [showYesterdaySolution, setShowYesterdaySolution] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  const todayKey = toDateKey(new Date());
  const yesterdayKey = getYesterdayDateKey(todayKey);

  // Fetch real gym questions from public endpoint
  useEffect(() => {
    let isMounted = true;
    const fetchGymData = async () => {
      try {
        const res = await fetch('https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: 'get_pm_gym',
            clientDate: todayKey
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.gymQuestions && Array.isArray(data.gymQuestions) && data.gymQuestions.length > 0) {
            if (isMounted) {
              // Combine and de-duplicate with fallback questions
              const apiQuestions: GymQuestion[] = data.gymQuestions;
              const mergedMap = new Map<string, GymQuestion>();
              // Put fallbacks first
              FALLBACK_GYM_QUESTIONS.forEach(q => mergedMap.set(q.date, q));
              // Overlay API questions
              apiQuestions.forEach(q => mergedMap.set(q.date, { ...mergedMap.get(q.date), ...q }));
              const sorted = Array.from(mergedMap.values()).sort((a, b) => b.date.localeCompare(a.date));
              setQuestions(sorted);
            }
          }
        }
      } catch (err) {
        console.warn('Using local PM Gym questions backup:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGymData();
    setStreak(calculateLandingGymStreak());

    return () => {
      isMounted = false;
    };
  }, [todayKey]);

  // Check solve status whenever selectedDate changes
  useEffect(() => {
    const isSolved = localStorage.getItem(`pm_gym_landing_completed_${selectedDate}`) === 'true';
    setHasSolvedSelectedDay(isSolved);
    setSubmitFeedback(null);

    // If solved, attempt to load saved answer from localStorage
    try {
      const savedAnswers = JSON.parse(localStorage.getItem('pm_gym_landing_submissions') || '{}');
      if (savedAnswers[selectedDate]) {
        const submission = savedAnswers[selectedDate];
        if (typeof submission.answer === 'number') {
          setSelectedOption(submission.answer);
        } else {
          setTextAnswer(String(submission.answer || ''));
        }
      } else {
        setSelectedOption(null);
        setTextAnswer('');
      }
    } catch (e) {
      setSelectedOption(null);
      setTextAnswer('');
    }
  }, [selectedDate]);

  // Find question for selected date or fallback to closest
  const activeQuestion = questions.find(q => q.date === selectedDate) || questions.find(q => q.date <= selectedDate) || questions[0];
  const yesterdayQuestion = questions.find(q => q.date === yesterdayKey) || FALLBACK_GYM_QUESTIONS.find(q => q.date === "2026-10-18");

  // Weekly Goal Days (Monday to Sunday around today)
  const getWeeklyDays = () => {
    const d = new Date();
    // Monday as start of week (1)
    const currentDayOfWeek = d.getDay();
    const distanceToMonday = (currentDayOfWeek + 6) % 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - distanceToMonday);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      const key = toDateKey(dayDate);
      const isCompleted = localStorage.getItem(`pm_gym_landing_completed_${key}`) === 'true';
      const isToday = key === todayKey;
      const isSelected = key === selectedDate;
      const dayLabel = dayDate.toLocaleDateString('en-US', { weekday: 'narrow' });
      const dayNum = dayDate.getDate();

      week.push({
        key,
        dayLabel,
        dayNum,
        isCompleted,
        isToday,
        isSelected
      });
    }
    return week;
  };

  const weeklyDays = getWeeklyDays();

  // Handle Answer Submission
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuestion) return;

    const answer = activeQuestion.type === 'quiz' ? selectedOption : textAnswer.trim();
    if (answer === null || answer === undefined || answer === '') return;

    setSubmitting(true);

    try {
      // 1. Optimistic local persistence
      localStorage.setItem(`pm_gym_landing_completed_${activeQuestion.date}`, 'true');
      
      const currentSubmissions = JSON.parse(localStorage.getItem('pm_gym_landing_submissions') || '{}');
      currentSubmissions[activeQuestion.date] = {
        date: activeQuestion.date,
        type: activeQuestion.type,
        answer,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem('pm_gym_landing_submissions', JSON.stringify(currentSubmissions));

      const updatedStreak = calculateLandingGymStreak();
      setStreak(updatedStreak);
      setHasSolvedSelectedDay(true);
      setSubmitFeedback('Challenge submitted successfully! Streak updated.');

      // 2. Dispatch event for other tabs/components
      window.dispatchEvent(new Event('pm_gym_updated'));

      // 3. Background server recording
      fetch('https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'submit_pm_gym',
          date: activeQuestion.date,
          answer: String(answer)
        })
      }).catch(err => console.warn('Background gym sync:', err));
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8 text-left font-sans">
      {/* ─── Hero Header Sticker ─── */}
      <div className="bg-[#FFFFFF] border-[3px] border-[#111111] p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="inline-block bg-[#FFF3A7] text-[#111111] border-[3px] border-[#111111] px-4 py-1.5 font-black text-xs md:text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] -rotate-1">
                🧠 PM Gym Daily Challenge
              </span>
              <span className="bg-[#D1FAE5] text-[#065F46] border-2 border-[#111111] px-3 py-1 font-extrabold text-[11px] uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                Free Daily Practice
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-[#111111] tracking-tight leading-tight">
              Build Real <span className="bg-[#FFF3A7] px-2 py-0.5 border-[2px] border-[#111111]">Product Muscle</span> Every Single Day.
            </h2>
            <p className="text-sm md:text-base font-bold text-slate-600 max-w-2xl leading-relaxed">
              1 real-world question daily. Test your execution, prioritization, and product logic.
              Consistency compounds faster than pedigree.
            </p>
          </div>

          {/* Streak Stat Display */}
          <div className="flex md:flex-col items-center justify-between md:justify-center p-4 md:p-5 bg-[#F8FAFC] border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] min-w-[170px] shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <Flame className={`h-6 w-6 ${streak > 0 ? 'text-[#EA580C] animate-bounce' : 'text-slate-400'}`} />
              <span className="text-2xl md:text-3xl font-black text-[#111111]">{streak}</span>
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
              {streak === 1 ? 'Day Streak' : 'Days Streak'}
            </span>
            <div className="mt-2 hidden md:block text-[10px] font-extrabold text-[#0f6f8f] bg-[#0f6f8f]/10 border border-[#0f6f8f] px-2 py-0.5">
              {hasSolvedSelectedDay ? 'Solved Today ✓' : 'Solve to maintain'}
            </div>
          </div>
        </div>

        {/* Weekly Day Tracker Strip */}
        <div className="mt-6 pt-6 border-t-[3px] border-[#111111]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#0f6f8f]" /> Weekly Streak Tracker
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              {weeklyDays.filter(d => d.isCompleted).length} / 7 Days Active
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weeklyDays.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setSelectedDate(d.key)}
                className={`flex flex-col items-center justify-center py-2.5 px-1 border-[2px] border-[#111111] transition-all cursor-pointer ${
                  d.isSelected
                    ? 'bg-[#0f6f8f] text-white shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] -translate-y-0.5'
                    : d.isCompleted
                    ? 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#A7F3D0]'
                    : d.isToday
                    ? 'bg-[#FFF3A7] text-[#111111] hover:bg-[#FDE047]'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-[10px] font-black uppercase">{d.dayLabel}</span>
                <span className="text-xs md:text-sm font-black">{d.dayNum}</span>
                <div className="mt-1 h-3 flex items-center justify-center">
                  {d.isCompleted ? (
                    <Check className="h-3 w-3 stroke-[3]" />
                  ) : d.isToday ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Challenge Area ─── */}
      <div className="bg-[#FFFFFF] border-[3px] border-[#111111] p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-10 h-10 border-[4px] border-[#111111] border-t-[#0f6f8f] rounded-full animate-spin mx-auto shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]" />
            <p className="font-extrabold text-sm uppercase text-[#111111]">Loading Today's PM Gym Challenge...</p>
          </div>
        ) : !activeQuestion ? (
          <div className="py-12 text-center space-y-4">
            <HelpCircle className="h-12 w-12 text-slate-400 mx-auto" />
            <h3 className="text-xl font-black text-[#111111]">No challenge scheduled for this date</h3>
            <p className="text-sm font-bold text-slate-500">Pick another day on the streak tracker above or check today's date.</p>
            <button
              type="button"
              onClick={() => setSelectedDate(todayKey)}
              className="px-5 py-2.5 bg-[#FFF3A7] border-[3px] border-[#111111] font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] hover:bg-[#FDE047] cursor-pointer"
            >
              Return to Today's Challenge
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Challenge Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-[2px] border-slate-200">
              <div className="flex items-center gap-2">
                <span className="bg-[#E0F2FE] text-[#0369A1] border-[2px] border-[#111111] px-2.5 py-1 text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                  {activeQuestion.type === 'quiz' ? 'Multiple Choice (MCQ)' : 'Case Framework (Open Response)'}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> 3 min drill
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-[#111111] bg-slate-100 border border-[#111111] px-2.5 py-1">
                  📅 {formatDisplayDate(activeQuestion.date)} {activeQuestion.date === todayKey ? '(Today)' : ''}
                </span>
              </div>
            </div>

            {/* Question Text Prompt */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#0f6f8f]">
                {activeQuestion.category || "Product Thinking Exercise"}
              </span>
              <h3 className="text-lg md:text-2xl font-black text-[#111111] leading-snug">
                {activeQuestion.text}
              </h3>
            </div>

            {/* Interactive Form: Quiz MCQ or Open Text */}
            <form onSubmit={handleSubmitAnswer} className="space-y-6 pt-2">
              {activeQuestion.type === 'quiz' && activeQuestion.options ? (
                <div className="space-y-3">
                  {activeQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const letter = String.fromCharCode(65 + idx);

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={hasSolvedSelectedDay}
                        onClick={() => setSelectedOption(idx)}
                        className={`w-full text-left p-4 md:p-5 border-[3px] border-[#111111] transition-all flex items-start gap-3.5 cursor-pointer select-none ${
                          isSelected
                            ? 'bg-[#0f6f8f]/10 border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] translate-x-[2px] translate-y-[2px]'
                            : 'bg-white hover:bg-[#FFF3A7]/40 hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]'
                        } ${hasSolvedSelectedDay ? 'cursor-default' : ''}`}
                      >
                        <span
                          className={`w-7 h-7 shrink-0 border-[2px] border-[#111111] flex items-center justify-center font-black text-xs ${
                            isSelected ? 'bg-[#0f6f8f] text-white' : 'bg-[#F8FAFC] text-[#111111]'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className={`text-sm md:text-base font-bold leading-snug ${isSelected ? 'text-[#0f6f8f] font-black' : 'text-[#111111]'}`}>
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#111111]">
                    Your Response Breakdown
                  </label>
                  <textarea
                    rows={6}
                    value={textAnswer}
                    disabled={hasSolvedSelectedDay}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Break down your answer step by step. Example:&#10;1. Problem definition & assumptions...&#10;2. User segments & key pain points...&#10;3. Proposed solution & edge cases...&#10;4. North Star & Guardrail metrics..."
                    className="w-full p-4 border-[3px] border-[#111111] bg-white font-bold text-sm text-[#111111] focus:outline-none focus:bg-[#FFF3A7]/10 focus:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all resize-y"
                    required
                  />
                  <span className="text-[11px] font-bold text-slate-500 block">
                    Tip: Interviewers look for structured logical progression rather than just a quick guess.
                  </span>
                </div>
              )}

              {/* Status / Submit Action */}
              {hasSolvedSelectedDay ? (
                <div className="bg-[#D1FAE5] border-[3px] border-[#111111] p-5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] space-y-3">
                  <div className="flex items-center gap-2.5 text-[#065F46]">
                    <CheckCircle2 className="h-6 w-6 stroke-[3] shrink-0" />
                    <div>
                      <h4 className="font-black text-base md:text-lg">Response Recorded for this Challenge!</h4>
                      <p className="text-xs font-bold text-[#065F46]/90 mt-0.5">
                        Awesome job showing up and building your PM muscle memory today.
                      </p>
                    </div>
                  </div>
                  <div className="bg-white border-2 border-[#111111] p-3 text-xs font-bold text-slate-700">
                    🔒 <strong className="text-[#111111]">Official Answer & Mentor Solution:</strong> Just like in the LMS, correct solutions unlock on the next day so everyone submits independently first. Check yesterday's solution below!
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      (activeQuestion.type === 'quiz' ? selectedOption === null : !textAnswer.trim())
                    }
                    className={`w-full py-4 px-6 font-black text-base uppercase tracking-wider text-white border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all flex items-center justify-center gap-2 select-none ${
                      (activeQuestion.type === 'quiz' ? selectedOption === null : !textAnswer.trim())
                        ? 'bg-slate-400 cursor-not-allowed opacity-60'
                        : 'bg-[#0f6f8f] hover:bg-[#188ab2] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] cursor-pointer'
                    }`}
                  >
                    {submitting ? (
                      <>Recording Challenge...</>
                    ) : (
                      <>
                        <Send className="h-5 w-5" /> Submit Challenge & Boost Streak
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center font-bold text-slate-500">
                    Free visitor access • No credit card required • Builds toward your public PM profile
                  </p>
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      {/* ─── Yesterday's Solution & Explanation Drawer ─── */}
      {yesterdayQuestion && (
        <div className="bg-[#FFF3A7] border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white border border-[#111111] px-2 py-0.5 inline-block mb-1">
                Unlocked Solution & Teardown
              </span>
              <h3 className="text-lg font-black text-[#111111]">
                💡 Review Yesterday's Challenge Solution ({formatDisplayDate(yesterdayQuestion.date)})
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowYesterdaySolution(!showYesterdaySolution)}
              className="px-4 py-2 bg-white text-[#111111] border-[2px] border-[#111111] font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] hover:bg-slate-100 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              {showYesterdaySolution ? (
                <>Hide Solution <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>Reveal Solution & Rationale <ChevronDown className="h-4 w-4" /></>
              )}
            </button>
          </div>

          {showYesterdaySolution && (
            <div className="bg-white border-[3px] border-[#111111] p-5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Yesterday's Question</span>
                <p className="text-base font-extrabold text-[#111111]">{yesterdayQuestion.text}</p>
              </div>

              {yesterdayQuestion.type === 'quiz' && yesterdayQuestion.options && typeof yesterdayQuestion.correctIndex === 'number' && (
                <div className="p-3 bg-[#D1FAE5] border-[2px] border-[#111111]">
                  <span className="text-[11px] font-black uppercase tracking-wide text-[#065F46] block mb-1">
                    Correct Option:
                  </span>
                  <div className="font-black text-sm text-[#111111] flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#065F46] stroke-[3]" />
                    Option {String.fromCharCode(65 + yesterdayQuestion.correctIndex)}: {yesterdayQuestion.options[yesterdayQuestion.correctIndex]}
                  </div>
                </div>
              )}

              {yesterdayQuestion.explanation && (
                <div className="space-y-1 border-t-2 border-slate-200 pt-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0f6f8f] flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> PM Mentor Explanation & Interview Takeaway:
                  </span>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed whitespace-pre-line">
                    {yesterdayQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── LMS Cohort Teaser Banner ─── */}
      <div className="bg-[#F8FAFC] border-[3px] border-[#111111] p-6 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#EDE9FE] text-[#5B21B6] border border-[#111111] px-2.5 py-0.5 text-[10px] font-black uppercase">
              StepSmart PM-X Accelerator Feature
            </span>
          </div>
          <h4 className="text-lg md:text-xl font-black text-[#111111]">
            Want 1:1 Live Teardowns on your PM Gym answers?
          </h4>
          <p className="text-xs md:text-sm font-bold text-slate-600 max-w-xl">
            In the StepSmart LMS, enrolled students get cohort leaderboards, live PRD reviews, peer-to-peer mock interviews, and direct referrals to top tech companies.
          </p>
        </div>

        <a
          href="/#enroll"
          className="shrink-0 px-6 py-3 bg-[#0f6f8f] hover:bg-[#188ab2] text-white border-[3px] border-[#111111] font-black text-xs md:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
        >
          Explore PM-X Cohort →
        </a>
      </div>
    </div>
  );
}
