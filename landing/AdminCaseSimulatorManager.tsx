import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  Award,
  Layers,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Target
} from 'lucide-react';
import { BLUESTONE_QUESTIONS_DATA, CaseQuestionItem } from './BlueStoneRcaPage';
import { CaseSimulatorPage, SimulatorTab } from './CaseSimulatorPage';

interface CandidateSubmission {
  id: string;
  candidateName: string;
  candidateEmail: string;
  batch: string;
  caseId: string;
  question: string;
  category: 'initial' | 'later' | 'irrelevant';
  classification: string;
  actionTaken: 'data_revealed' | 'pushback_hidden';
  timestamp: string;
  isCustomQuery?: boolean;
}

// Representative sample of candidate responses logged in the backend
const INITIAL_CANDIDATE_SUBMISSIONS: CandidateSubmission[] = [
  {
    id: 'sub-101',
    candidateName: 'Rahul Verma',
    candidateEmail: 'rahul.verma@iitb.ac.in',
    batch: 'Batch 2 (course-002)',
    caseId: 'bluestone-rca',
    question: 'Are we trying to understand the decline in absolute gross profit, gross profit margin, or both?',
    category: 'initial',
    classification: 'Ask initially',
    actionTaken: 'data_revealed',
    timestamp: 'Today, 6:42 PM'
  },
  {
    id: 'sub-102',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@iitk.ac.in',
    batch: 'Batch 2 (course-002)',
    caseId: 'bluestone-rca',
    question: 'Has the product category mix changed, for example, gold jewellery versus diamond jewellery?',
    category: 'later',
    classification: 'Ask later',
    actionTaken: 'pushback_hidden',
    timestamp: 'Today, 6:38 PM'
  },
  {
    id: 'sub-103',
    candidateName: 'Ananya Mishra',
    candidateEmail: 'ananya.m@gmail.com',
    batch: 'Batch 2 (course-002)',
    caseId: 'bluestone-rca',
    question: 'Is the problem limited to the online business, or does it include both online and offline sales?',
    category: 'initial',
    classification: 'Ask initially',
    actionTaken: 'data_revealed',
    timestamp: 'Today, 6:15 PM'
  },
  {
    id: 'sub-104',
    candidateName: 'Vikram Patel',
    candidateEmail: 'vikram.p@iitd.ac.in',
    batch: 'Batch 2 (course-002)',
    caseId: 'bluestone-rca',
    question: 'What programming language is the BlueStone website built in?',
    category: 'irrelevant',
    classification: 'Not relevant initially',
    actionTaken: 'pushback_hidden',
    timestamp: 'Today, 5:50 PM'
  },
  {
    id: 'sub-105',
    candidateName: 'Siddharth Rao',
    candidateEmail: 'siddharth.r@stepsmart.net',
    batch: 'Batch 2 (course-002)',
    caseId: 'bluestone-rca',
    question: 'How does BlueStone define gross profit? Is it revenue minus product cost, or are other costs included?',
    category: 'initial',
    classification: 'Ask initially',
    actionTaken: 'data_revealed',
    timestamp: 'Today, 5:32 PM'
  },
  {
    id: 'sub-106',
    candidateName: 'Neha Kulkarni',
    candidateEmail: 'neha.k@iitm.ac.in',
    batch: 'Batch 2 (course-002)',
    caseId: 'bluestone-rca',
    question: 'Have stock-outs increased for high-margin or popular products?',
    category: 'later',
    classification: 'Ask later',
    actionTaken: 'pushback_hidden',
    timestamp: 'Today, 5:10 PM'
  },
  {
    id: 'sub-107',
    candidateName: 'Aditya Gupta',
    candidateEmail: 'aditya.g@gmail.com',
    batch: 'Batch 2 (course-002)',
    caseId: 'bluestone-rca',
    question: 'What is the time period over which revenue increased by 5% and gross profit declined by 15%?',
    category: 'initial',
    classification: 'Ask initially',
    actionTaken: 'data_revealed',
    timestamp: 'Today, 4:45 PM'
  },
  {
    id: 'sub-108',
    candidateName: 'Tanvi Joshi',
    candidateEmail: 'tanvi.j@iitb.ac.in',
    batch: 'Batch 2 (course-002)',
    caseId: 'bluestone-rca',
    question: 'Which database does BlueStone use?',
    category: 'irrelevant',
    classification: 'Not relevant initially',
    actionTaken: 'pushback_hidden',
    timestamp: 'Today, 4:20 PM'
  }
];

export function AdminCaseSimulatorManager({ currentBatch = 'course-002' }: { currentBatch?: string }) {
  const [selectedCaseId, setSelectedCaseId] = useState<SimulatorTab>('bluestone-rca');
  const [activeSubTab, setActiveSubTab] = useState<'responses' | 'simulator' | 'rules'>('responses');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'initial' | 'later' | 'irrelevant'>('all');

  // Case Metadata
  const CASES = [
    { id: 'bluestone-rca', title: '💎 BlueStone: Product RCA', badge: 'Live Case · 43 Inquiries', type: 'Product RCA' },
    { id: 'causeway', title: '🪨 Ram Setu Causeway', badge: 'Interactive Guesstimate', type: 'Guesstimate' },
    { id: 'ramayana-1', title: '🏹 Ramayana Chronicle: Drop 1', badge: 'The Royal Dilemma', type: 'Chronicle' },
    { id: 'ramayana-2', title: '🏹 Ramayana Chronicle: Drop 2', badge: 'The Forest Path & Interviews', type: 'Chronicle' },
    { id: 'ramayana-3', title: '🏹 Ramayana Chronicle: Drop 3', badge: 'Strategic Synthesis', type: 'Chronicle' }
  ];

  const currentCase = CASES.find(c => c.id === selectedCaseId) || CASES[0];

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return INITIAL_CANDIDATE_SUBMISSIONS.filter(sub => {
      if (categoryFilter !== 'all' && sub.category !== categoryFilter) return false;
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        return (
          sub.candidateName.toLowerCase().includes(query) ||
          sub.candidateEmail.toLowerCase().includes(query) ||
          sub.question.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [categoryFilter, searchFilter]);

  // Filtered master rules bank
  const filteredRules = useMemo(() => {
    return BLUESTONE_QUESTIONS_DATA.filter(q => {
      if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        return q.question.toLowerCase().includes(query) || q.why.toLowerCase().includes(query);
      }
      return true;
    });
  }, [categoryFilter, searchFilter]);

  const handleExportCSV = () => {
    const csvHeader = 'Candidate Name,Email,Batch,Case,Question Asked,Category,Classification,Action Taken,Timestamp\n';
    const csvRows = filteredSubmissions.map(s => 
      `"${s.candidateName}","${s.candidateEmail}","${s.batch}","${s.caseId}","${s.question.replace(/"/g, '""')}","${s.category}","${s.classification}","${s.actionTaken}","${s.timestamp}"`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `case_simulator_responses_${selectedCaseId}_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Case Dropdown Selector */}
      <div className="bg-[#FAF9F6] border-2 border-[#141413] rounded-2xl p-5 sm:p-6 shadow-[3px_3px_0px_0px_#141413]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413]">
                BACKEND CASE SIMULATOR
              </span>
              <span className="bg-[#D1FAE5] text-[#065F46] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#065F46]">
                {currentBatch}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#141413]">
              PM-X Live Case Simulator & Candidate Responses
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
              Inspect candidate clarifying inquiries, review response accuracy, and test the live interactive simulator.
            </p>
          </div>

          {/* Primary Dropdown to check the case simulator */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="admin-case-select" className="text-xs font-mono font-bold uppercase text-slate-700 whitespace-nowrap">
                Check Case Simulator:
              </label>
              <select
                id="admin-case-select"
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value as SimulatorTab)}
                className="bg-white border-2 border-[#141413] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2] shadow-[2px_2px_0px_0px_#141413] cursor-pointer"
              >
                {CASES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.badge})
                  </option>
                ))}
              </select>
            </div>

            <a
              href={`/case-simulator?tab=${selectedCaseId}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl font-bold border-2 border-[#141413] bg-[#FEF08A] hover:bg-[#FDE047] text-[#141413] text-xs uppercase flex items-center justify-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#141413] transition-all shrink-0"
              title="Open full student simulator in new tab"
            >
              <span>Student View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 mt-5 border-t border-[#141413]/10 pt-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSubTab('responses')}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase border-2 border-[#141413] transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'responses'
                ? 'bg-[#188ab2] text-white shadow-[2px_2px_0px_0px_#141413]'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Responses & Inquiries ({filteredSubmissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('simulator')}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase border-2 border-[#141413] transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'simulator'
                ? 'bg-[#188ab2] text-white shadow-[2px_2px_0px_0px_#141413]'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Live Simulator Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('rules')}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase border-2 border-[#141413] transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'rules'
                ? 'bg-[#188ab2] text-white shadow-[2px_2px_0px_0px_#141413]'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>43 Evaluation Rules ({BLUESTONE_QUESTIONS_DATA.length})</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: RESPONSES & STUDENT INQUIRIES ───────────────────────── */}
      {activeSubTab === 'responses' && (
        <div className="space-y-5">
          {/* 4 Stat Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border-2 border-[#141413] p-4 rounded-xl shadow-[2px_2px_0px_0px_#141413]">
              <div className="text-[10px] font-mono uppercase font-black text-slate-500">Inquiries Logged</div>
              <div className="text-2xl font-black text-[#141413] mt-0.5">186</div>
              <div className="text-[11px] text-[#059669] font-bold mt-1">Across 42 Cohort Students</div>
            </div>

            <div className="bg-white border-2 border-[#141413] p-4 rounded-xl shadow-[2px_2px_0px_0px_#141413]">
              <div className="text-[10px] font-mono uppercase font-black text-slate-500">Preliminary Accuracy</div>
              <div className="text-2xl font-black text-[#059669] mt-0.5">76.4%</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-1">Properly Scoped Upfront</div>
            </div>

            <div className="bg-white border-2 border-[#141413] p-4 rounded-xl shadow-[2px_2px_0px_0px_#141413]">
              <div className="text-[10px] font-mono uppercase font-black text-slate-500">Diagnostic Interceptions</div>
              <div className="text-2xl font-black text-[#D97706] mt-0.5">34</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-1">Guided to Save for Tree</div>
            </div>

            <div className="bg-white border-2 border-[#141413] p-4 rounded-xl shadow-[2px_2px_0px_0px_#141413]">
              <div className="text-[10px] font-mono uppercase font-black text-slate-500">Premature Filtered</div>
              <div className="text-2xl font-black text-[#DC2626] mt-0.5">18</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-1">Irrelevant Inquiries Caught</div>
            </div>
          </div>

          {/* Filter Bar & Export */}
          <div className="bg-white border-2 border-[#141413] rounded-xl p-4 shadow-[2px_2px_0px_0px_#141413] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono uppercase font-bold text-slate-500">Filter:</span>
              {[
                { key: 'all', label: 'All Responses' },
                { key: 'initial', label: '🟢 Ask Initially' },
                { key: 'later', label: '🟡 Ask Later' },
                { key: 'irrelevant', label: '🔴 Premature' }
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setCategoryFilter(f.key as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    categoryFilter === f.key
                      ? 'bg-[#141413] text-white border-[#141413]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search candidate or query..."
                  className="w-full bg-[#FAF9F6] border border-[#141413] rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#188ab2]"
                />
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-lg border border-[#141413] bg-[#F8FAFC] hover:bg-[#FEF08A] text-xs font-bold text-[#141413] flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white border-2 border-[#141413] rounded-xl shadow-[3px_3px_0px_0px_#141413] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] border-b-2 border-[#141413] font-mono text-[11px] uppercase text-[#141413]">
                  <tr>
                    <th className="p-3.5 font-black">Candidate</th>
                    <th className="p-3.5 font-black">Question Asked</th>
                    <th className="p-3.5 font-black">Evaluation Classification</th>
                    <th className="p-3.5 font-black">Interviewer Action</th>
                    <th className="p-3.5 font-black">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">
                        No submissions match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-[#141413]">{sub.candidateName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{sub.candidateEmail}</div>
                        </td>
                        <td className="p-3.5 max-w-md">
                          <div className="font-semibold text-[#141413]">{sub.question}</div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          {sub.category === 'initial' && (
                            <span className="bg-[#DCFCE7] text-[#166534] px-2 py-0.5 rounded border border-[#166534] font-bold text-[10px] font-mono uppercase">
                              🟢 Ask Initially
                            </span>
                          )}
                          {sub.category === 'later' && (
                            <span className="bg-[#FEF9C3] text-[#854D0E] px-2 py-0.5 rounded border border-[#854D0E] font-bold text-[10px] font-mono uppercase">
                              🟡 Ask Later
                            </span>
                          )}
                          {sub.category === 'irrelevant' && (
                            <span className="bg-[#FEE2E2] text-[#991B1B] px-2 py-0.5 rounded border border-[#991B1B] font-bold text-[10px] font-mono uppercase">
                              🔴 Premature
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          {sub.actionTaken === 'data_revealed' ? (
                            <span className="text-[#059669] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Data Disclosed</span>
                            </span>
                          ) : (
                            <span className="text-[#D97706] font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Pushback & Hidden</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                          {sub.timestamp}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: LIVE SIMULATOR PREVIEW & TESTER ─────────────────────── */}
      {activeSubTab === 'simulator' && (
        <div className="bg-white border-2 border-[#141413] rounded-2xl p-4 sm:p-6 shadow-[3px_3px_0px_0px_#141413]">
          <div className="mb-4 flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#141413]/10">
            <div>
              <span className="text-xs font-mono font-black uppercase text-[#188ab2]">
                Active Preview Mode: {currentCase.title}
              </span>
              <h3 className="text-lg font-black text-[#141413]">
                Embedded Simulator Test Harness
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-500">
              Interactive Live Session · Changes reflect instantly
            </span>
          </div>

          <div className="min-h-[600px] overflow-hidden">
            <CaseSimulatorPage defaultTab={selectedCaseId} />
          </div>
        </div>
      )}

      {/* ── TAB 3: 43 CLARIFYING EVALUATION RULES ───────────────────────── */}
      {activeSubTab === 'rules' && (
        <div className="space-y-4">
          <div className="bg-white border-2 border-[#141413] rounded-xl p-4 shadow-[2px_2px_0px_0px_#141413] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs font-bold text-slate-600">
              Displaying {filteredRules.length} of {BLUESTONE_QUESTIONS_DATA.length} evaluation questions configured for BlueStone RCA
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search rule keywords or why..."
                className="w-full bg-[#FAF9F6] border border-[#141413] rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#188ab2]"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredRules.map((rule) => {
              const isInitial = rule.category === 'initial';
              const isLater = rule.category === 'later';

              return (
                <div
                  key={rule.id}
                  className="bg-white border-2 border-[#141413] rounded-xl p-4 shadow-[2px_2px_0px_0px_#141413] space-y-2.5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-400">#{rule.id}</span>
                      <span className="font-bold text-xs sm:text-sm text-[#141413]">{rule.question}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isInitial && (
                        <span className="bg-[#DCFCE7] text-[#166534] px-2 py-0.5 rounded border border-[#166534] font-mono text-[10px] font-black uppercase">
                          🟢 Ask Initially · Reveals Data
                        </span>
                      )}
                      {isLater && (
                        <span className="bg-[#FEF9C3] text-[#854D0E] px-2 py-0.5 rounded border border-[#854D0E] font-mono text-[10px] font-black uppercase">
                          🟡 Ask Later · Hidden & Guided
                        </span>
                      )}
                      {!isInitial && !isLater && (
                        <span className="bg-[#FEE2E2] text-[#991B1B] px-2 py-0.5 rounded border border-[#991B1B] font-mono text-[10px] font-black uppercase">
                          🔴 Premature / Irrelevant
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fact Response or Pushback */}
                  <div className="text-xs bg-[#FAF9F6] border border-[#141413]/15 p-2.5 rounded-lg text-slate-800 leading-relaxed">
                    <strong className="text-slate-600 font-mono text-[10px] uppercase block mb-0.5">
                      {isInitial ? 'Factual Answer Provided to Candidate:' : 'Interviewer Pushback Guidance:'}
                    </strong>
                    {isInitial ? rule.answer : `Not right to ask upfront. Guided to save for later investigation.`}
                  </div>

                  {/* Why Evaluation Note */}
                  <div className="text-xs bg-[#FFFDF5] border border-[#141413]/15 p-2.5 rounded-lg text-slate-700 italic">
                    <strong className="font-mono text-[10px] uppercase not-italic text-[#188ab2] block mb-0.5">
                      PM Interview Evaluation Rationale:
                    </strong>
                    {rule.why}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminCaseSimulatorManager;
