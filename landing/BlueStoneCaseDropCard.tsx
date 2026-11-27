import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowRight, MessageSquare } from 'lucide-react';
import { matchClarifyingQuestion, BLUESTONE_QUESTIONS_DATA } from './BlueStoneRcaPage';

export function BlueStoneCaseDropCard() {
  const [questionInput, setQuestionInput] = useState('');
  const [selectedDropdownId, setSelectedDropdownId] = useState('');
  const [revealedAnswer, setRevealedAnswer] = useState<{
    question: string;
    answer: string;
    label: string;
    classification?: string;
    why?: string;
    isMatch: boolean;
    isPreliminary?: boolean;
    category?: string;
  } | null>(null);

  const handleAskQuestionText = (questionText: string) => {
    const matched = matchClarifyingQuestion(questionText);
    setRevealedAnswer({
      question: questionText,
      answer: matched.answer,
      label: matched.isPreliminary
        ? '🟢 Relevant – Ask Initially'
        : (matched.category === 'later'
            ? '🟡 Not Right to Ask Now (Ask Later)'
            : (matched.category === 'irrelevant' ? '🔴 Not Relevant / Premature' : 'Outside Scope')),
      classification: matched.classification,
      why: matched.why,
      isMatch: matched.isMatch,
      isPreliminary: matched.isPreliminary,
      category: matched.category
    });
  };

  const handleSelectDropdown = (qIdStr: string) => {
    setSelectedDropdownId(qIdStr);
    if (!qIdStr) return;
    const item = BLUESTONE_QUESTIONS_DATA.find(q => q.id === Number(qIdStr));
    if (item) {
      handleAskQuestionText(item.question);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    handleAskQuestionText(questionInput.trim());
    setQuestionInput('');
  };

  return (
    <div className="max-w-4xl mx-auto mb-14 text-left">
      <div className="bg-[#FFFDF5] rounded-2xl border-2 sm:border-[2.5px] border-[#141413] shadow-[0px_6px_0px_0px_#141413] p-6 sm:p-8 relative overflow-hidden">
        {/* Top Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#FEF08A] text-[#141413] font-mono text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413] shadow-[1px_1px_0px_0px_#141413]">
              ✨ NEW CASE DROP • PM RCA
            </span>
            <span className="text-xs font-bold text-[#141413]/70">
              Interactive 7-Stage Solver · 43 Interview Inquiries
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] border border-[#065F46]">
            Stage 1 Live Today
          </span>
        </div>

        {/* Title & Premise */}
        <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight mb-2">
          BlueStone: Revenue up 5%, Gross profit down 15%. Find the root cause.
        </h3>
        <p className="text-xs sm:text-sm text-[#141413]/85 leading-relaxed mb-4">
          BlueStone is an omnichannel jewellery retailer. Nobody has found the cause yet, and there have been no major redesigns.
          Step into the role of <strong>Digital Commerce PM</strong> (Web & Mobile App). Before jumping into solutions, select your clarifying questions to diagnose digital commerce scope and pinpoint the profit leak.
        </p>

        {/* Core Stat Highlights */}
        <div className="grid grid-cols-2 max-w-md gap-3 mb-5">
          <div className="bg-white border-2 border-[#141413] p-3 rounded-xl shadow-[1.5px_1.5px_0px_0px_#141413]">
            <div className="text-[10px] font-mono uppercase font-black text-slate-500">Revenue</div>
            <div className="text-base sm:text-lg font-black text-[#059669]">₹105 Cr <span className="text-[10px]">(+5%)</span></div>
          </div>
          <div className="bg-white border-2 border-[#141413] p-3 rounded-xl shadow-[1.5px_1.5px_0px_0px_#141413]">
            <div className="text-[10px] font-mono uppercase font-black text-slate-500">Gross Profit</div>
            <div className="text-base sm:text-lg font-black text-[#DC2626]">₹17.1 Cr <span className="text-[10px]">(-15%)</span></div>
          </div>
        </div>

        {/* Interactive Clarifying Question Dropdown Pane */}
        <div className="bg-white rounded-xl border-2 border-[#141413] p-4 sm:p-5 mb-5 shadow-[2px_2px_0px_0px_#141413]">
          <div className="mb-2">
            <span className="font-mono text-[11px] font-black uppercase text-[#141413] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#188ab2]" />
              <span>Select Question to Ask:</span>
            </span>
          </div>

          {/* Question Selector Dropdown (Clean Flat List) */}
          <div className="mb-3">
            <select
              value={selectedDropdownId}
              onChange={(e) => handleSelectDropdown(e.target.value)}
              className="w-full bg-[#FDFCF7] border-2 border-[#141413] px-3.5 py-2.5 rounded-lg text-xs font-bold text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2] shadow-[1.5px_1.5px_0px_0px_#141413] cursor-pointer"
            >
              <option value="">-- Choose question to ask --</option>
              {BLUESTONE_QUESTIONS_DATA.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.question}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Input Field */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="Or type a custom question (e.g. 'Are we looking at absolute gross profit or margin?')"
              className="flex-1 bg-[#FDFCF7] border-2 border-[#141413] px-3 py-2 rounded-lg text-xs font-semibold text-[#141413] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
            />
            <button
              type="submit"
              disabled={!questionInput.trim()}
              className="bg-[#141413] hover:bg-slate-800 disabled:opacity-40 text-white px-3.5 py-2 rounded-lg font-black text-xs uppercase flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3 h-3" />
            </button>
          </form>

          {/* Answer Preview Box */}
          {revealedAnswer && (
            <div className={`mt-3 p-3.5 rounded-lg border-2 ${
              revealedAnswer.isPreliminary ? 'border-[#059669] bg-[#F0FDF4]' : (revealedAnswer.isMatch ? 'border-amber-400 bg-amber-50' : 'border-slate-300 bg-slate-50')
            } space-y-2 animate-in fade-in duration-200 shadow-[2px_2px_0px_0px_#141413]`}>
              <div className="flex items-center justify-between text-[10px] font-mono font-bold flex-wrap gap-1">
                <span className="text-slate-700 font-semibold">Q: “{revealedAnswer.question}”</span>
                
                {revealedAnswer.isPreliminary && (
                  <span className="bg-[#DCFCE7] text-[#166534] px-2 py-0.5 rounded border border-[#166534] uppercase">
                    🟢 Ask Initially
                  </span>
                )}
                {revealedAnswer.category === 'later' && (
                  <span className="bg-[#FEF9C3] text-[#854D0E] px-2 py-0.5 rounded border border-[#854D0E] uppercase">
                    🟡 Not Right to Ask Now (Ask Later)
                  </span>
                )}
                {revealedAnswer.category === 'irrelevant' && (
                  <span className="bg-[#FEE2E2] text-[#991B1B] px-2 py-0.5 rounded border border-[#991B1B] uppercase">
                    🔴 Not Relevant / Premature
                  </span>
                )}
                {!revealedAnswer.isMatch && (
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-300 uppercase">
                    Outside Scope
                  </span>
                )}
              </div>

              <div className="text-xs font-medium text-[#141413] leading-relaxed whitespace-pre-line">
                <strong className={revealedAnswer.isPreliminary ? 'text-[#059669]' : (revealedAnswer.isMatch ? 'text-amber-800' : 'text-slate-600')}>
                  Interviewer:
                </strong>{' '}
                {revealedAnswer.answer}
              </div>

              {/* Show PM Evaluation only if preliminary */}
              {revealedAnswer.isPreliminary && revealedAnswer.why && (
                <div className="text-[11px] bg-white border border-[#141413]/20 p-2 rounded text-slate-700 italic">
                  <span className="font-mono font-bold not-italic text-[#188ab2] uppercase text-[9px] block">
                    PM Interview Evaluation:
                  </span>
                  {revealedAnswer.why}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/case-simulator?tab=bluestone-rca"
              className="px-6 py-2.5 rounded-full font-black border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[2.5px_2.5px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-xs sm:text-sm uppercase inline-flex items-center gap-2"
            >
              <span>Solve BlueStone Case</span>
              <span>➔</span>
            </Link>
            <span className="text-xs text-[#141413]/60 font-semibold hidden md:inline">
              43 Classified Questions · Stage 1 Live
            </span>
          </div>

          <Link
            to="/case-simulator"
            className="text-xs font-bold text-[#188ab2] hover:underline font-mono inline-flex items-center gap-1"
          >
            <span>Explore all 5 tabs in Live Case Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
export default BlueStoneCaseDropCard;
