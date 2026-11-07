import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Users,
  Star,
  RotateCcw,
  Menu,
  X,
  Phone,
  UserCheck,
  Edit3,
  ShieldCheck,
  Layers,
  HelpCircle,
  Award,
  Video
} from 'lucide-react';

export function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch && shortMatch[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return `https://www.youtube.com/embed/${trimmed}`;
  return trimmed;
}

export function getRealCalendarDateStr(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date());
  } catch {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

export function isDayVideoEnabled(drop?: DropData | null): boolean {
  if (!drop) return false;
  if (drop.video?.enabled !== undefined) return Boolean(drop.video.enabled);
  if ((drop as any).videoEnabled !== undefined) return Boolean((drop as any).videoEnabled);
  return drop.dayNumber === 1; // Default: Day 1 enabled, others disabled unless enabled
}

interface DropData {
  dayNumber: number;
  title: string;
  subtitle: string;
  theme: string;
  unlockDate: string; // YYYY-MM-DD
  introLines: string[];
  imageUrl: string;
  imageCaption: string;
  questionType?: 'mcq' | 'text' | 'both';
  videoEnabled?: boolean;
  video?: {
    enabled?: boolean;
    youtubeUrl?: string;
    headline?: string;
    caption?: string;
    description?: string;
  };
  youtubeUrl?: string;
  poll?: {
    question: string;
    options: Array<{
      key: string;
      text: string;
      archetype?: string;
      role?: string;
      explanation?: string;
    }>;
    baselineNote?: string;
  };
  openQuestion?: {
    prompt: string;
    helper?: string;
    placeholder?: string;
    sampleAnswer?: string;
    fields?: string[];
  };
  cliffhanger?: string;
  interviews?: Record<string, {
    speaker: string;
    title: string;
    role: string;
    messages: string[];
  }>;
  conflictTwist?: {
    headline: string;
    question: string;
    insight: string;
  };
  synthesis?: {
    question: string;
    sampleAnswer: string;
    commonPatterns: Array<{ title: string; desc: string }>;
  };
  recommendationPoll?: {
    question: string;
    options: Array<{
      key: string;
      text: string;
      archetype?: string;
      role?: string;
      explanation?: string;
    }>;
  };
  framework?: {
    headline: string;
    lines: Array<{ step: string; text: string }>;
  };
  postTest?: {
    prompt: string;
    compareWithDay1: boolean;
  };
  feedback?: {
    ratingPrompt: string;
    sharePrompt: string;
  };
}

const DEFAULT_DROPS: DropData[] = [
  {
    dayNumber: 1,
    title: 'Drop 1: Hook and decision (Day 1)',
    subtitle: 'The Royal Dilemma at Dawn',
    theme: 'Problem Definition & Baseline Instincts',
    unlockDate: '2026-11-05', // Today!
    introLines: [
      'The sun rises over the Sarayu river, casting long amber shadows across Ayodhya’s stone courtyards.',
      'Incense hangs heavy in the palace halls where priests and ministers whisper in restless circles.',
      'The kingdom is prosperous, the treasury full, the borders secure—yet the royal line stands empty.',
      'You’ve been transported here as a Product Manager. The King summons you.'
    ],
    imageUrl: '/ayodhya_dawn.jpg',
    imageCaption: 'Ayodhya at dawn: The sacred palace courtyards before the King’s summons.',
    video: {
      enabled: true,
      youtubeUrl: 'https://youtu.be/UDIcRkHsqOs',
      headline: '“I have no heir. Fix this.”',
      caption: 'King Dasharatha summons you to the royal court of Ayodhya.'
    },
    videoEnabled: true,
    youtubeUrl: 'https://youtu.be/UDIcRkHsqOs',
    poll: {
      question: 'Your first instinct?',
      baselineNote: 'No wrong answer yet. This is your baseline.',
      options: [
        {
          key: 'A',
          text: 'Find a solution fast',
          archetype: 'The Velocity PM',
          explanation: 'You immediately look for the quickest tactical path: adopt a prince, arrange a royal yajna, or designate a successor. Speed feels like control, but risks solving the wrong root problem.'
        },
        {
          key: 'B',
          text: 'Understand the problem first',
          archetype: 'The Discovery PM',
          explanation: 'You resist jumping to premature solutions. Why is this an emergency now? Who is feeling the pain? What happens if nothing changes tomorrow?'
        },
        {
          key: 'C',
          text: 'Ask who’s affected',
          archetype: 'The Stakeholder PM',
          explanation: 'You recognize that a succession dilemma ripples through ministers, neighboring warlords, queens, and common citizens before touching a single royal cradle.'
        }
      ]
    },
    openQuestion: {
      prompt: 'In one line, what do YOU think the real problem is?',
      helper: '(pre-test, saved for later comparison on Day 3)',
      placeholder: 'E.g., Dasharatha is confusing the emotional fear of legacy with an immediate kingdom crisis...'
    },
    cliffhanger: 'Tomorrow you can interview 3 people. Choose wisely.'
  },
  {
    dayNumber: 2,
    title: 'Drop 2: Discovery (Day 2)',
    subtitle: 'Conflicting Stakeholder Voices',
    theme: 'Stakeholder Interviews & Fact vs. Assumption',
    unlockDate: '2026-11-06', // Tomorrow!
    introLines: [
      'Day 2 arrives in Ayodhya. The council chambers are already buzzing with quiet suspicion.',
      'Three individuals hold distinct pieces of the puzzle: King Dasharatha, Sumantra the Chief Minister, and an Ayodhya Citizen.',
      'Their accounts do not align.',
      'Time to conduct stakeholder discovery interviews.'
    ],
    imageUrl: '/ayodhya_dawn.jpg',
    imageCaption: 'The Inner Court: Dasharatha, Sumantra, and citizens gather under the palace archway.',
    video: {
      enabled: false,
      youtubeUrl: '',
      headline: '“Three voices. One throne. Who do you trust?”',
      caption: 'Stakeholder discovery briefing with King, Minister, and Citizen.'
    },
    videoEnabled: false,
    youtubeUrl: '',
    poll: {
      question: 'Who do you interview first?',
      options: [
        { key: 'King', text: 'The King (Dasharatha)', role: 'The Sponsor / Executive' },
        { key: 'Minister', text: 'The Chief Minister (Sumantra)', role: 'The Operator / Politician' },
        { key: 'Citizen', text: 'The Citizen of Ayodhya', role: 'The End User' }
      ]
    },
    interviews: {
      King: {
        speaker: 'King Dasharatha',
        title: 'The Emotion',
        role: 'The Sponsor / Executive',
        messages: [
          '“Everyone looks at my crown, but inside I am terrified.”',
          '“Without an heir, the sacred fire of the Ikshvaku dynasty extinguishes with my breath.”',
          '“The priests want another yajna, but can a ritual silence the dread that haunts my sleepless nights?”',
          '“This is not merely statecraft. It is the raw weight of mortal legacy.”'
        ]
      },
      Minister: {
        speaker: 'Chief Minister Sumantra',
        title: 'The Political Risk',
        role: 'The Operator / Politician',
        messages: [
          '“Look beyond the King’s sorrow, PM. The northern border chieftains are whispering.”',
          '“A throne without clear succession invites rival kings and ambitious vassals to circle like hawks.”',
          '“The crisis is urgent because power abhors a vacuum. If stability fractures, Ayodhya fractures.”',
          '“We must project strength and permanence immediately, whatever the ritual costs.”'
        ]
      },
      Citizen: {
        speaker: 'Ayodhya Citizen',
        title: 'The Unspoken Anxiety',
        role: 'The End User',
        messages: [
          '“The royal palace worries about golden lineages and great crowns.”',
          '“Out here in the marketplace, we just wonder if tomorrow’s taxes will double to fund another grand ceremony.”',
          '“We love the King, but nobody in the streets is losing sleep over succession right now.”',
          '“Our anxiety is silent: when rulers drown in their private worries, who manages the granaries and floods?”'
        ]
      }
    },
    openQuestion: {
      prompt: 'Sort what you learned into: Fact / Assumption / Unknown.',
      helper: 'Reply as 3 short lines',
      fields: ['Fact', 'Assumption', 'Unknown']
    },
    conflictTwist: {
      headline: 'The Conflicting-Input Moment',
      question: 'The minister says the succession crisis is urgent. The citizen says nobody cares. Who’s right?',
      insight: 'This is the conflicting-input moment, and it teaches the most. In product discovery, executive sponsors bring emotional weight, business leads identify macro risk, and users reflect ground reality. Neither is lying. Great PMs synthesize conflicting inputs into a coherent problem space rather than blindly trusting the loudest voice.'
    },
    cliffhanger: 'Tomorrow: Synthesis and the final reveal framework.'
  },
  {
    dayNumber: 3,
    title: 'Drop 3: Synthesis and reveal (Day 3)',
    subtitle: 'From Chaos to Strategic Clarity',
    theme: 'Problem Synthesis & Discovery Framework',
    unlockDate: '2026-11-07', // Day 3!
    introLines: [
      'Day 3: The sun peaks over the golden temple domes of Ayodhya.',
      'You have listened to the monarch, the statesman, and the citizen.',
      'Now, the King stands waiting before the royal court for your definitive problem statement.',
      'It is time to synthesize.'
    ],
    imageUrl: '/ayodhya_dawn.jpg',
    imageCaption: 'The Grand Durbar: Time for the PM recommendation to the throne.',
    video: {
      enabled: false,
      youtubeUrl: '',
      headline: '“The Grand Durbar: Deliver your strategic diagnosis.”',
      caption: 'Synthesis and the Problem Discovery Framework reveal.'
    },
    videoEnabled: false,
    youtubeUrl: '',
    questionType: 'both',
    poll: {
      question: 'Your recommendation: Which strategic bet should King Dasharatha make?',
      options: [
        {
          key: 'A',
          text: 'Option A: Authorize the Putrakameshti Yajna to satisfy Dasharatha’s emotion and buy time.',
          archetype: 'The Emotional Pacifier'
        },
        {
          key: 'B',
          text: 'Option B: Establish a provisional ministerial council to govern borders and relieve political panic.',
          archetype: 'The Bureaucratic Stabilizer'
        },
        {
          key: 'C',
          text: 'Option C: Execute a hybrid strategy: conduct the ritual publicly for morale, while codifying constitutional succession protocols.',
          archetype: 'The Strategic PM'
        }
      ]
    },
    openQuestion: {
      prompt: 'Write your problem statement in ONE sentence.',
      helper: 'Reduce the fog of Ayodhya into ONE definitive problem statement.',
      placeholder: 'Ayodhya’s core problem is...',
      sampleAnswer: '“Ayodhya’s leadership is paralyzed by the emotional burden of childlessness, mistaking dynastic succession anxiety for an immediate administrative emergency while neglecting the citizen confidence that truly protects the realm.”'
    },
    synthesis: {
      question: 'Write your problem statement in ONE sentence.',
      sampleAnswer: '“Ayodhya’s leadership is paralyzed by the emotional burden of childlessness, mistaking dynastic succession anxiety for an immediate administrative emergency while neglecting the citizen confidence that truly protects the realm.”',
      commonPatterns: [
        {
          title: 'Pattern 1: The Solution Jump',
          desc: 'Focusing immediately on hiring priests or adopting an heir without diagnosing why the court feels unstable.'
        },
        {
          title: 'Pattern 2: The Single Stakeholder Trap',
          desc: 'Accepting only the Minister’s urgency or only the King’s emotion, ignoring the end-user citizen impact.'
        },
        {
          title: 'Pattern 3: The Systemic PM Frame',
          desc: 'Separating the emotional pain point from the governance risk and the operational reality.'
        }
      ]
    },
    recommendationPoll: {
      question: 'Your recommendation: A / B / C',
      options: [
        {
          key: 'A',
          text: 'Option A: Authorize the Putrakameshti Yajna to satisfy Dasharatha’s emotion and buy time.'
        },
        {
          key: 'B',
          text: 'Option B: Establish a provisional ministerial council to govern borders and relieve political panic.'
        },
        {
          key: 'C',
          text: 'Option C: Execute a hybrid strategy: conduct the ritual publicly for morale, while codifying constitutional succession protocols.'
        }
      ]
    },
    framework: {
      headline: 'The 3-Line Problem Discovery Framework',
      lines: [
        {
          step: '1. Separate Emotion from Operational Emergency',
          text: 'The King’s grief is intense, but emotion is a signal, not a specification. Do not build features just to soothe executive panic without checking structural reality.'
        },
        {
          step: '2. Triangulate Conflicting Stakeholders (Sponsor vs. Operator vs. User)',
          text: 'Sumantra saw geopolitical risk; the citizen cared about taxation and daily bread. When inputs clash, discover the underlying shared incentive rather than taking a side.'
        },
        {
          step: '3. Frame the Real Problem Before Picking the Remedy',
          text: 'Dasharatha asked for an heir. What he actually needed was regime continuity and citizen trust. When you solve the true problem, multiple viable solutions emerge.'
        }
      ]
    },
    postTest: {
      prompt: 'In one line, what do YOU think the real problem is NOW?',
      compareWithDay1: true
    },
    feedback: {
      ratingPrompt: 'How would you rate this 3-Day Problem Discovery Chronicle?',
      sharePrompt: 'Which moment in the Ayodhya Chronicle would you tell a friend about?'
    }
  }
];

export function RamayanaChroniclePage() {
  const [drops, setDrops] = useState<DropData[]>(DEFAULT_DROPS);
  const [currentDateStr, setCurrentDateStr] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const dateParam = params.get('date');
      if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) return dateParam;
      return getRealCalendarDateStr();
    } catch {
      return getRealCalendarDateStr();
    }
  });

  const [activeDay, setActiveDay] = useState<number>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const d = parseInt(params.get('day') || '', 10);
      if ([1, 2, 3].includes(d)) return d;
      const realToday = getRealCalendarDateStr();
      if (realToday >= '2026-11-07') return 3;
      if (realToday >= '2026-11-06') return 2;
      return 1;
    } catch {
      return 1;
    }
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Time simulation state for previewing drops (synced to real calendar by default)
  const simulatedDate = currentDateStr;
  const setSimulatedDate = setCurrentDateStr;

  // User Identification & Contact (Name + WhatsApp Number)
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('pmx_chronicle_user_name') || '');
  const [userPhone, setUserPhone] = useState<string>(() => localStorage.getItem('pmx_chronicle_user_phone') || '');
  const [isUserRegistered, setIsUserRegistered] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('pmx_chronicle_user_name') && localStorage.getItem('pmx_chronicle_user_phone'));
  });
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false);
  const [userFormError, setUserFormError] = useState<string>('');
  const [isSavingUser, setIsSavingUser] = useState<boolean>(false);
  const userCardRef = useRef<HTMLDivElement | null>(null);

  // User responses state saved to localStorage
  const [selectedInstinct, setSelectedInstinct] = useState<string>(() => {
    return localStorage.getItem('pmx_chronicle_day1_poll') || '';
  });
  const [day1OpenAnswer, setDay1OpenAnswer] = useState<string>(() => {
    return localStorage.getItem('pmx_chronicle_day1_open') || '';
  });
  const [day1AnswerSubmitted, setDay1AnswerSubmitted] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('pmx_chronicle_day1_open_saved'));
  });

  // Day 2 states
  const [selectedInterviewee, setSelectedInterviewee] = useState<string>('King');
  const [interviewHistory, setInterviewHistory] = useState<string[]>(['King']);
  const [day2Fact, setDay2Fact] = useState(() => localStorage.getItem('pmx_chronicle_day2_fact') || '');
  const [day2Assumption, setDay2Assumption] = useState(() => localStorage.getItem('pmx_chronicle_day2_assumption') || '');
  const [day2Unknown, setDay2Unknown] = useState(() => localStorage.getItem('pmx_chronicle_day2_unknown') || '');
  const [day2Submitted, setDay2Submitted] = useState(() => Boolean(localStorage.getItem('pmx_chronicle_day2_saved')));

  // Day 3 states
  const [day3ProblemStatement, setDay3ProblemStatement] = useState(() => localStorage.getItem('pmx_chronicle_day3_statement') || '');
  const [day3StatementSubmitted, setDay3StatementSubmitted] = useState(() => Boolean(localStorage.getItem('pmx_chronicle_day3_statement_saved')));
  const [day3Recommendation, setDay3Recommendation] = useState(() => localStorage.getItem('pmx_chronicle_day3_rec') || '');
  const [day3PostAnswer, setDay3PostAnswer] = useState(() => localStorage.getItem('pmx_chronicle_day3_post') || '');
  const [day3PostSubmitted, setDay3PostSubmitted] = useState(() => Boolean(localStorage.getItem('pmx_chronicle_day3_post_saved')));
  const [rating, setRating] = useState<number>(() => Number(localStorage.getItem('pmx_chronicle_feedback_rating')) || 0);
  const [feedbackMoment, setFeedbackMoment] = useState(() => localStorage.getItem('pmx_chronicle_feedback_moment') || '');
  const [feedbackSaved, setFeedbackSaved] = useState(() => Boolean(localStorage.getItem('pmx_chronicle_feedback_saved')));

  // Fetch dynamic chronicle drops from backend if updated via Admin panel
  useEffect(() => {
    let isMounted = true;

    // 1. Immediately apply any locally cached admin updates if present
    try {
      const rawAdmin = localStorage.getItem('pmx_chronicle_admin_drops');
      if (rawAdmin) {
        const cached = JSON.parse(rawAdmin);
        if (Array.isArray(cached) && cached.length > 0) {
          setDrops(prev => prev.map(def => {
            const found = cached.find((c: any) => Number(c.dayNumber) === def.dayNumber);
            if (found) {
              const rawYt = found.video?.youtubeUrl || found.youtubeUrl || def.video?.youtubeUrl;
              const yt = (def.dayNumber === 1 && (!rawYt || rawYt.includes('dQw4w9WgXcQ'))) ? 'https://youtu.be/UDIcRkHsqOs' : rawYt;
              const isEnabled = found.video?.enabled !== undefined ? Boolean(found.video.enabled) : (found.videoEnabled !== undefined ? Boolean(found.videoEnabled) : Boolean(def.video?.enabled));
              const pollData = found.poll || (def.dayNumber === 3 && found.recommendationPoll ? {
                question: found.recommendationPoll.question || def.poll?.question || 'Your Strategic Recommendation',
                options: (found.recommendationPoll.options || def.poll?.options || []).map((o: any, idx: number) => ({
                  key: o.key || String.fromCharCode(65 + idx),
                  text: o.text || '',
                  archetype: o.archetype || o.role || ''
                }))
              } : def.poll);
              const openData = found.openQuestion || (def.dayNumber === 3 && found.synthesis ? {
                prompt: found.synthesis.question || def.openQuestion?.prompt || 'Write your problem statement in ONE sentence.',
                helper: def.openQuestion?.helper || 'Reduce the fog of Ayodhya into ONE definitive statement.',
                placeholder: def.openQuestion?.placeholder || "Ayodhya's core problem is...",
                sampleAnswer: found.synthesis.sampleAnswer || def.openQuestion?.sampleAnswer
              } : def.openQuestion);
              const qType = found.questionType || def.questionType || 'both';

              return {
                ...def,
                ...found,
                videoEnabled: isEnabled,
                youtubeUrl: yt,
                questionType: qType,
                poll: pollData,
                openQuestion: openData,
                recommendationPoll: def.dayNumber === 3 ? (found.recommendationPoll || (pollData ? {
                  question: pollData.question,
                  options: pollData.options
                } : def.recommendationPoll)) : found.recommendationPoll,
                synthesis: def.dayNumber === 3 ? (found.synthesis || (openData ? {
                  question: openData.prompt,
                  sampleAnswer: openData.sampleAnswer || '',
                  commonPatterns: def.synthesis?.commonPatterns || []
                } : def.synthesis)) : found.synthesis,
                video: {
                  ...def.video,
                  ...(found.video || {}),
                  enabled: isEnabled,
                  youtubeUrl: yt,
                  headline: found.video?.headline || def.video?.headline,
                  caption: found.video?.caption || def.video?.caption,
                }
              };
            }
            return def;
          }));
        }
      }
    } catch (e) {}

    // 2. Fetch live drops from backend
    const fetchRemoteDrops = async () => {
      try {
        const res = await fetch('https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: 'get_chronicle' })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.drops) && data.drops.length > 0) {
            if (isMounted) {
              setDrops(prev => {
                return prev.map(defaultDrop => {
                  const remote = data.drops.find((d: any) => Number(d.dayNumber) === defaultDrop.dayNumber);
                  if (remote) {
                    const rawYt = remote.video?.youtubeUrl || remote.youtubeUrl || defaultDrop.video?.youtubeUrl;
                    const yt = (defaultDrop.dayNumber === 1 && (!rawYt || rawYt.includes('dQw4w9WgXcQ'))) ? 'https://youtu.be/UDIcRkHsqOs' : rawYt;
                    const isEnabled = remote.video?.enabled !== undefined ? Boolean(remote.video.enabled) : (remote.videoEnabled !== undefined ? Boolean(remote.videoEnabled) : Boolean(defaultDrop.video?.enabled));
                    const pollData = remote.poll || (defaultDrop.dayNumber === 3 && remote.recommendationPoll ? {
                      question: remote.recommendationPoll.question || defaultDrop.poll?.question || 'Your Strategic Recommendation',
                      options: (remote.recommendationPoll.options || defaultDrop.poll?.options || []).map((o: any, idx: number) => ({
                        key: o.key || String.fromCharCode(65 + idx),
                        text: o.text || '',
                        archetype: o.archetype || o.role || ''
                      }))
                    } : defaultDrop.poll);
                    const openData = remote.openQuestion || (defaultDrop.dayNumber === 3 && remote.synthesis ? {
                      prompt: remote.synthesis.question || defaultDrop.openQuestion?.prompt || 'Write your problem statement in ONE sentence.',
                      helper: defaultDrop.openQuestion?.helper || 'Reduce the fog of Ayodhya into ONE definitive statement.',
                      placeholder: defaultDrop.openQuestion?.placeholder || "Ayodhya's core problem is...",
                      sampleAnswer: remote.synthesis.sampleAnswer || defaultDrop.openQuestion?.sampleAnswer
                    } : defaultDrop.openQuestion);
                    const qType = remote.questionType || defaultDrop.questionType || 'both';

                    return {
                      ...defaultDrop,
                      ...remote,
                      videoEnabled: isEnabled,
                      youtubeUrl: yt,
                      questionType: qType,
                      poll: pollData,
                      openQuestion: openData,
                      recommendationPoll: defaultDrop.dayNumber === 3 ? (remote.recommendationPoll || (pollData ? {
                        question: pollData.question,
                        options: pollData.options
                      } : defaultDrop.recommendationPoll)) : remote.recommendationPoll,
                      synthesis: defaultDrop.dayNumber === 3 ? (remote.synthesis || (openData ? {
                        question: openData.prompt,
                        sampleAnswer: openData.sampleAnswer || '',
                        commonPatterns: defaultDrop.synthesis?.commonPatterns || []
                      } : defaultDrop.synthesis)) : remote.synthesis,
                      video: {
                        ...defaultDrop.video,
                        ...(remote.video || {}),
                        enabled: isEnabled,
                        youtubeUrl: yt,
                        headline: remote.video?.headline || defaultDrop.video?.headline,
                        caption: remote.video?.caption || defaultDrop.video?.caption
                      }
                    };
                  }
                  return defaultDrop;
                });
              });
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch latest drops from backend, using default drops:', err);
      }
    };

    fetchRemoteDrops();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to send answers to backend
  const dispatchResponseToBackend = async (dayNumber: number, responseType: string, responseData: any) => {
    try {
      const cleanPhone = userPhone.replace(/[^0-9]/g, '');

      // Also cache to local storage so admin running in same environment sees immediately
      try {
        const rawLocal = localStorage.getItem('pmx_chronicle_all_submissions');
        const list = rawLocal ? JSON.parse(rawLocal) : [];
        list.unshift({
          pageId: `CHRONICLE_RESP#${cleanPhone || 'anon'}#DAY${dayNumber}#${Date.now()}`,
          visitorId: cleanPhone || 'anon_visitor',
          name: userName || 'Anonymous PM',
          phone: userPhone,
          whatsappNumber: userPhone,
          dayNumber,
          responseType,
          responseData,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('pmx_chronicle_all_submissions', JSON.stringify(list.slice(0, 200)));
      } catch (e) {}

      await fetch('https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'save_chronicle_response',
          visitorId: cleanPhone || 'anon_visitor',
          name: userName || 'Anonymous PM',
          email: `${cleanPhone || 'anon'}@chronicle.stepsmart.net`,
          phone: userPhone,
          masterclassId: 'ramayana-chronicle',
          source: `ramayana_chronicle_day${dayNumber}`,
          dayNumber,
          responseType,
          responseData,
          lastAnswer: typeof responseData === 'string' ? responseData : JSON.stringify(responseData),
        })
      });
    } catch (err) {
      console.warn('Chronicle response backend dispatch failed:', err);
    }
  };

  // Require user details before answering
  const ensureUserIdentified = (): boolean => {
    if (!userName.trim() || !userPhone.trim() || userPhone.replace(/[^0-9]/g, '').length < 10) {
      setUserFormError('Please enter your Name and a valid 10-digit WhatsApp number above to record your product decision.');
      setIsEditingUser(true);
      userCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const handleSaveUserProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError('');
    const cleanPhone = userPhone.replace(/[^0-9]/g, '');
    if (!userName.trim()) {
      setUserFormError('Please enter your full name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setUserFormError('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    setIsSavingUser(true);
    localStorage.setItem('pmx_chronicle_user_name', userName.trim());
    localStorage.setItem('pmx_chronicle_user_phone', cleanPhone);
    setIsUserRegistered(true);
    setIsEditingUser(false);
    setIsSavingUser(false);

    // Record registration
    dispatchResponseToBackend(activeDay, 'user_registration', { registeredAt: new Date().toISOString() });
  };


  // Check if drop is unlocked on simulated date (Day 1 is always unlocked; Day 2 unlocks Nov 6 IST; Day 3 unlocks Nov 7 IST)
  const isDropUnlocked = (drop: DropData) => {
    if (drop.dayNumber === 1) return true;
    const effective = currentDateStr || getRealCalendarDateStr();
    return drop.unlockDate <= effective;
  };

  // Day 1 submission handlers
  const handleSelectInstinct = (key: string) => {
    if (!ensureUserIdentified()) return;
    setSelectedInstinct(key);
    localStorage.setItem('pmx_chronicle_day1_poll', key);
    dispatchResponseToBackend(1, 'day1_poll_instinct', { selectedInstinct: key });
  };

  const handleSaveDay1Open = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureUserIdentified()) return;
    if (!day1OpenAnswer.trim()) return;
    localStorage.setItem('pmx_chronicle_day1_open', day1OpenAnswer.trim());
    localStorage.setItem('pmx_chronicle_day1_open_saved', 'true');
    setDay1AnswerSubmitted(true);
    dispatchResponseToBackend(1, 'day1_open_problem', { problemAnswer: day1OpenAnswer.trim() });
  };

  // Day 2 submission handlers
  const handleSelectInterview = (speakerKey: string) => {
    setSelectedInterviewee(speakerKey);
    if (!interviewHistory.includes(speakerKey)) {
      setInterviewHistory(prev => [...prev, speakerKey]);
    }
    if (isUserRegistered) {
      dispatchResponseToBackend(2, 'day2_interview_click', { speaker: speakerKey });
    }
  };

  const handleSaveDay2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureUserIdentified()) return;
    localStorage.setItem('pmx_chronicle_day2_fact', day2Fact.trim());
    localStorage.setItem('pmx_chronicle_day2_assumption', day2Assumption.trim());
    localStorage.setItem('pmx_chronicle_day2_unknown', day2Unknown.trim());
    localStorage.setItem('pmx_chronicle_day2_saved', 'true');
    setDay2Submitted(true);
    dispatchResponseToBackend(2, 'day2_discovery_matrix', {
      fact: day2Fact.trim(),
      assumption: day2Assumption.trim(),
      unknown: day2Unknown.trim()
    });
  };

  // Day 3 submission handlers
  const handleSaveDay3Statement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureUserIdentified()) return;
    if (!day3ProblemStatement.trim()) return;
    localStorage.setItem('pmx_chronicle_day3_statement', day3ProblemStatement.trim());
    localStorage.setItem('pmx_chronicle_day3_statement_saved', 'true');
    setDay3StatementSubmitted(true);
    dispatchResponseToBackend(3, 'day3_problem_statement', { statement: day3ProblemStatement.trim() });
  };

  const handleSelectRecommendation = (key: string) => {
    if (!ensureUserIdentified()) return;
    setDay3Recommendation(key);
    localStorage.setItem('pmx_chronicle_day3_rec', key);
    dispatchResponseToBackend(3, 'day3_recommendation_poll', { recommendation: key });
  };

  const handleSaveDay3Post = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureUserIdentified()) return;
    if (!day3PostAnswer.trim()) return;
    localStorage.setItem('pmx_chronicle_day3_post', day3PostAnswer.trim());
    localStorage.setItem('pmx_chronicle_day3_post_saved', 'true');
    setDay3PostSubmitted(true);
    dispatchResponseToBackend(3, 'day3_post_comparison', {
      day1InitialAnswer: day1OpenAnswer,
      day3SynthesizedAnswer: day3PostAnswer.trim()
    });
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureUserIdentified()) return;
    localStorage.setItem('pmx_chronicle_feedback_rating', String(rating));
    localStorage.setItem('pmx_chronicle_feedback_moment', feedbackMoment.trim());
    localStorage.setItem('pmx_chronicle_feedback_saved', 'true');
    setFeedbackSaved(true);
    dispatchResponseToBackend(3, 'chronicle_feedback', {
      rating,
      favoriteMoment: feedbackMoment.trim()
    });
  };

  const currentDrop = drops.find(d => d.dayNumber === activeDay) || drops[0];
  const unlocked = isDropUnlocked(currentDrop);

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#141413] font-sans selection:bg-[#FEF08A] selection:text-[#141413] font-medium">
      

      {/* 1. TOP ANNOUNCEMENT TICKER (Soft Neo-Brutalist Banner) */}
      <aside aria-label="Ramayana Chronicle Announcement" className="sticky top-0 z-50 w-full bg-[#FEF08A] border-b-2 border-[#141413] text-xs py-2 px-4 font-black">
        <div className="container mx-auto max-w-7xl flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#188ab2] text-white rounded-full border-2 border-[#141413] px-2.5 py-0.5 text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_#141413] inline-flex items-center gap-1.5 font-black shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              🏹 INTERACTIVE CASE STUDY
            </span>
            <span className="text-[#141413] font-black text-xs sm:text-sm">
              The Ramayana Chronicle · Ayodhya at Dawn · Day 1 Unlocked Today · Free 3-Day PM Masterclass
            </span>
          </div>

          <Link
            to="/"
            className="bg-[#188ab2] hover:bg-[#0f6f8f] text-white rounded-full border-2 border-[#141413] px-3.5 py-1 text-xs uppercase font-black shadow-[2px_2px_0px_0px_#141413] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#141413] transition-all inline-flex items-center gap-1 shrink-0"
          >
            <span>← Back to StepSmart</span>
          </Link>
        </div>
      </aside>

      {/* 2. SOFT ARCHITECTURAL NEO-BRUTALIST NAVBAR */}
      <header className="w-full bg-[#FDFCF7] border-b-2 border-[#141413] relative z-40">
        <div className="container mx-auto px-6 h-20 max-w-7xl flex items-center justify-between">
          
          {/* Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3 select-none">
            <img
              src="/stepsmart-logo.webp"
              alt="StepSmart Logo"
              className="w-8 h-8 object-contain"
              loading="eager"
              width="32"
              height="32"
            />
            <span className="font-black text-2xl tracking-tight text-[#141413]">
              StepSmart
            </span>
            <span className="hidden sm:inline-block text-xs font-mono font-bold bg-[#FEF08A] px-2 py-0.5 rounded-full border border-[#141413]">
              Chronicle
            </span>
          </Link>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isUserRegistered && (
              <div className="flex items-center gap-2 bg-[#ECFDF5] border-2 border-[#141413] px-3.5 py-1.5 rounded-full shadow-[2px_2px_0px_0px_#141413] text-xs font-bold text-[#065F46]">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>{userName} ({userPhone.slice(-4) ? `••••${userPhone.slice(-4)}` : userPhone})</span>
                <button
                  type="button"
                  onClick={() => setIsEditingUser(true)}
                  className="text-[#188ab2] hover:underline ml-1 font-black cursor-pointer"
                >
                  Edit
                </button>
              </div>
            )}

            <Link
              to="/"
              className="px-4 py-2 rounded-full border-2 border-[#141413] bg-white text-[#141413] hover:bg-[#FEF08A] shadow-[2px_2px_0px_0px_#141413] font-extrabold text-xs uppercase"
            >
              Full Cohort
            </Link>

            <a
              href="/learn"
              className="px-5 py-2 rounded-full font-black border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[2px_2px_0px_0px_#141413] text-xs uppercase inline-flex items-center gap-1.5"
            >
              <span>Login</span>
              <span>➜</span>
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl border-2 border-[#141413] bg-white shadow-[2px_2px_0px_0px_#141413]"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-[#141413]" /> : <Menu className="w-6 h-6 text-[#141413]" />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <div className="md:hidden w-full bg-[#FDFCF7] border-b-2 border-[#141413] p-6 flex flex-col gap-3 shadow-[0px_4px_0px_0px_#141413]">
            {isUserRegistered && (
              <div className="p-3 rounded-xl border-2 border-[#141413] bg-[#ECFDF5] text-xs font-bold text-[#065F46] flex items-center justify-between">
                <span>Logged in: {userName}</span>
                <button onClick={() => { setIsEditingUser(true); setIsMenuOpen(false); }} className="text-[#188ab2] font-black underline">
                  Change
                </button>
              </div>
            )}
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-left font-black text-base py-2 border-b border-[#141413]/10">
              Home
            </Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="text-left font-black text-base py-2 border-b border-[#141413]/10">
              PM Playbooks & Blogs
            </Link>
            <a href="/learn" onClick={() => setIsMenuOpen(false)} className="text-left font-black text-base py-2 text-[#188ab2]">
              Student Login ➜
            </a>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="py-10 md:py-14 px-4 sm:px-6 container mx-auto max-w-4xl">
        
        {/* Top Header Badge & Date Simulator Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 bg-[#FEF08A] rounded-full border-2 border-[#141413] px-4 py-1.5 shadow-[2px_2px_0px_0px_#141413]">
            <span className="text-base">🏹</span>
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-[#141413]">
              ANCIENT WISDOM × MODERN PRODUCT DISCOVERY
            </span>
          </div>

          {/* Calendar Sync / Testing Preview Pill */}
          <div className="flex items-center gap-1.5 bg-white rounded-full border-2 border-[#141413] p-1 shadow-[2px_2px_0px_0px_#141413] text-xs font-bold flex-wrap">
            <span className="text-slate-500 uppercase px-2 text-[11px] font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Calendar Sync:
            </span>
            <button
              type="button"
              onClick={() => {
                const today = getRealCalendarDateStr();
                setCurrentDateStr(today);
                setActiveDay(today >= '2026-11-07' ? 3 : today >= '2026-11-06' ? 2 : 1);
              }}
              className={`px-3 py-1 rounded-full border-2 transition-all text-xs font-black cursor-pointer ${
                currentDateStr === getRealCalendarDateStr()
                  ? 'bg-[#188ab2] text-white border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413]'
                  : 'bg-transparent text-slate-700 hover:bg-slate-100 border-transparent'
              }`}
            >
              Today ({getRealCalendarDateStr() === '2026-11-06' ? 'Nov 6 · Day 2 Unlocked' : getRealCalendarDateStr()})
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentDateStr('2026-11-05');
                setActiveDay(1);
              }}
              className={`px-2.5 py-1 rounded-full border-2 transition-all text-[11px] font-bold cursor-pointer ${
                currentDateStr === '2026-11-05'
                  ? 'bg-[#188ab2] text-white border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413]'
                  : 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent'
              }`}
            >
              Nov 5 (Day 1)
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentDateStr('2026-11-06');
                setActiveDay(2);
              }}
              className={`px-2.5 py-1 rounded-full border-2 transition-all text-[11px] font-bold cursor-pointer ${
                currentDateStr === '2026-11-06' && currentDateStr !== getRealCalendarDateStr()
                  ? 'bg-[#188ab2] text-white border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413]'
                  : 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent'
              }`}
            >
              Nov 6 (Day 2)
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentDateStr('2026-11-07');
                setActiveDay(3);
              }}
              className={`px-2.5 py-1 rounded-full border-2 transition-all text-[11px] font-bold cursor-pointer ${
                currentDateStr === '2026-11-07'
                  ? 'bg-[#188ab2] text-white border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413]'
                  : 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent'
              }`}
            >
              Nov 7 (Day 3)
            </button>
          </div>
        </div>

        {/* Hero Title Block (Soft Architectural Neo-Brutalism) */}
        <div className="bg-[#FFFDF5] rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-10 mb-8 shadow-[0px_6px_0px_0px_#141413] relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#FEF08A] text-[#141413] font-mono text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413] shadow-[1px_1px_0px_0px_#141413]">
              3-PART PM MINI-SERIES
            </span>
            <span className="text-xs font-bold text-[#141413]/70">
              Interactive Case Study · By StepSmart
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#141413] mb-4 leading-tight">
            The Ramayana Chronicle
          </h1>
          <p className="text-base sm:text-xl font-medium text-[#141413]/85 leading-relaxed">
            You’ve been transported to Ayodhya at dawn as a Product Manager. The King summons you: <span className="bg-[#FEF08A] px-1.5 py-0.5 rounded border border-[#141413] font-black">“I have no heir. Fix this.”</span>
          </p>
        </div>

        {/* 👤 PARTICIPANT PROFILE CARD (Name + WhatsApp Number Tab at Beginning) */}
        <div ref={userCardRef} className="mb-8">
          {(!isUserRegistered || isEditingUser) ? (
            <div className="bg-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_5px_0px_0px_#141413]">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full bg-[#188ab2] text-white flex items-center justify-center text-xs font-black">
                      1
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-[#141413]">
                      Enter Your Details to Begin the Chronicle
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#141413]/75">
                    We gauge your answers, record your discovery matrix, and show your Before vs. After diagnostic comparison on Day 3.
                  </p>
                </div>
                {isEditingUser && (
                  <button
                    type="button"
                    onClick={() => setIsEditingUser(false)}
                    className="text-xs font-bold text-slate-500 hover:text-[#141413] underline"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {userFormError && (
                <div className="bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs sm:text-sm font-bold p-3 rounded-xl mb-4">
                  {userFormError}
                </div>
              )}

              <form onSubmit={handleSaveUserProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#141413] mb-1.5">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Sanket Agarwal"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#141413] bg-[#FDFCF7] text-[#141413] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#188ab2] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#141413] mb-1.5">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-mono font-bold text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border-2 border-[#141413] bg-[#FDFCF7] text-[#141413] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#188ab2] text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-center justify-between pt-2">
                  <div className="text-[11px] text-[#141413]/65 font-medium">
                    🔒 Kept private. Used to record your PM responses in the Admin panel.
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingUser}
                    className="px-6 py-2.5 rounded-full font-black border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[2px_2px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#141413] transition-all text-xs sm:text-sm uppercase cursor-pointer"
                  >
                    {isSavingUser ? 'Saving...' : 'Save & Start Case Study ➜'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-[#ECFDF5] rounded-2xl border-2 border-[#141413] p-4 sm:p-5 shadow-[0px_4px_0px_0px_#141413] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-[#141413] text-white flex items-center justify-center font-black">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-[#141413]">
                      Participant Profile: {userName}
                    </span>
                    <span className="text-[10px] font-mono font-black uppercase bg-[#FEF08A] px-2 py-0.5 rounded-full border border-[#141413]">
                      Active PM Advisor
                    </span>
                  </div>
                  <div className="text-xs text-[#065F46] font-semibold flex items-center gap-2 mt-0.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp: +91 {userPhone}</span>
                    <span>• All answers automatically saved to your profile</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingUser(true)}
                className="px-4 py-1.5 rounded-full border-2 border-[#141413] bg-white text-[#141413] hover:bg-slate-50 text-xs font-black shadow-[1.5px_1.5px_0px_0px_#141413] cursor-pointer inline-flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Change Details</span>
              </button>
            </div>
          )}
        </div>

        {/* Drop Navigation Tabs (Soft Neo-Brutalist 3-Day Switcher) */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          {drops.map((d) => {
            const isUnlocked = isDropUnlocked(d);
            const isActive = activeDay === d.dayNumber;
            return (
              <button
                key={d.dayNumber}
                type="button"
                onClick={() => setActiveDay(d.dayNumber)}
                className={`p-4 sm:p-5 rounded-2xl border-2 border-[#141413] text-left transition-all relative cursor-pointer ${
                  isActive
                    ? 'bg-[#FEF08A] shadow-[0px_5px_0px_0px_#141413] translate-y-[-2px]'
                    : 'bg-white hover:bg-slate-50 shadow-[0px_3px_0px_0px_#141413] active:translate-y-[1px]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] sm:text-xs font-mono font-black uppercase px-2 py-0.5 rounded-full border border-[#141413] ${
                    isUnlocked ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEE2E2] text-[#991B1B]'
                  }`}>
                    {isUnlocked ? 'LIVE NOW' : 'LOCKED'}
                  </span>
                  {!isUnlocked && <Lock className="w-4 h-4 text-slate-500" />}
                </div>
                <div className="font-black text-base sm:text-lg text-[#141413] truncate">
                  DROP {d.dayNumber}
                </div>
                <div className="text-xs font-bold text-[#141413]/70 line-clamp-1 mt-0.5">
                  {d.theme}
                </div>
                <div className="text-[10px] text-slate-500 mt-2 font-mono font-semibold">
                  {(() => {
                    const realToday = getRealCalendarDateStr();
                    if (d.unlockDate === realToday) return `Nov ${d.dayNumber + 4} (Today · Live)`;
                    if (d.unlockDate < realToday) return `Nov ${d.dayNumber + 4} (Day ${d.dayNumber})`;
                    return `Nov ${d.dayNumber + 4} (${d.dayNumber === 3 ? 'Unlocks Tomorrow' : 'Scheduled'})`;
                  })()}
                </div>
              </button>
            );
          })}
        </div>

        {/* --- IF DROP IS LOCKED --- */}
        {!unlocked && (
          <div className="bg-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-8 sm:p-12 text-center shadow-[0px_6px_0px_0px_#141413]">
            <div className="w-16 h-16 bg-[#FEF08A] border-2 border-[#141413] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_0px_#141413]">
              <Lock className="w-8 h-8 text-[#141413]" />
            </div>
            <span className="inline-block bg-[#FEE2E2] text-[#991B1B] border border-[#141413] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Unlocks on {currentDrop.unlockDate === '2026-11-06' ? 'November 6th' : 'November 7th'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#141413] mb-3">
              {currentDrop.title}
            </h2>
            <p className="text-sm sm:text-base font-semibold text-[#141413]/75 max-w-lg mx-auto mb-6">
              {currentDrop.dayNumber === 2
                ? 'Tomorrow you step into the council chambers to conduct 3 stakeholder interviews. King Dasharatha, Sumantra, and an Ayodhya citizen await.'
                : 'On Day 3, you synthesize all discovery signals and present your definitive problem statement and 3-line framework to the royal court.'}
            </p>

            <div className="bg-[#FFFDF5] rounded-xl border-2 border-dashed border-[#141413] p-5 max-w-md mx-auto mb-8 text-left">
              <div className="font-mono font-bold text-xs uppercase text-slate-500 mb-1">Cliffhanger from Day {currentDrop.dayNumber - 1}:</div>
              <div className="font-serif italic text-base sm:text-lg text-[#141413] font-bold">
                “{currentDrop.dayNumber === 2 ? 'Tomorrow you can interview 3 people. Choose wisely.' : 'Tomorrow: Synthesis and the final reveal framework.'}”
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveDay(1)}
                className="px-5 py-2.5 rounded-full font-black border-2 border-[#141413] bg-white text-[#141413] hover:bg-slate-50 shadow-[2px_2px_0px_0px_#141413] transition-all flex items-center gap-2 text-xs sm:text-sm uppercase cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Day 1
              </button>
              <button
                type="button"
                onClick={() => setSimulatedDate(currentDrop.unlockDate)}
                className="px-5 py-2.5 rounded-full font-black border-2 border-[#141413] bg-[#FEF08A] hover:bg-[#fde047] text-[#141413] shadow-[2px_2px_0px_0px_#141413] transition-all text-xs sm:text-sm uppercase cursor-pointer"
              >
                ⚡ Fast-Forward Date to Preview Day {currentDrop.dayNumber}
              </button>
            </div>
          </div>
        )}

        {/* --- UNLOCKED: DROP 1 (HOOK & DECISION) --- */}
        {unlocked && activeDay === 1 && (
          <div className="space-y-8">
            
            {/* 🎬 1. Ayodhya at dawn: 4 lines + image */}
            <div className="bg-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎬</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
                  Scene 1: Ayodhya at Dawn
                </h3>
              </div>

              {/* 4 Lines of Narrative */}
              <div className="bg-[#FFFDF5] rounded-xl border-2 border-[#141413] p-6 mb-6 shadow-[2px_2px_0px_0px_#141413]">
                {currentDrop.introLines.map((line, idx) => (
                  <p key={idx} className="text-base sm:text-lg font-medium leading-relaxed text-[#141413] mb-3 last:mb-0">
                    {idx === currentDrop.introLines.length - 1 ? (
                      <span className="bg-[#FEF08A] text-[#141413] px-2 py-0.5 rounded border border-[#141413] font-black inline-block mt-1">
                        {line}
                      </span>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>

              {/* Ayodhya Dawn Image */}
              <div className="rounded-xl border-2 border-[#141413] shadow-[3px_3px_0px_0px_#141413] overflow-hidden bg-black">
                <img
                  src={currentDrop.imageUrl || '/ayodhya_dawn.jpg'}
                  alt="Ayodhya at dawn"
                  className="w-full h-72 sm:h-96 object-cover hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="bg-[#FEF08A] p-3 border-t-2 border-[#141413] text-xs font-bold text-[#141413] flex items-center justify-between">
                  <span>🏛️ {currentDrop.imageCaption}</span>
                  <span className="font-mono text-slate-600">6:12 AM IST</span>
                </div>
              </div>
            </div>

            {/* 🎬 2. Dasharatha, Video Summons (when enabled) */}
            {isDayVideoEnabled(currentDrop) && (currentDrop.video?.youtubeUrl || currentDrop.youtubeUrl) && (
              <div className="bg-[#F0F9FF] rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#188ab2] border-2 border-[#141413] flex items-center justify-center text-white shadow-[1.5px_1.5px_0px_0px_#141413]">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
                        The King’s Royal Summons
                      </h3>
                      <p className="text-xs font-bold text-[#0369A1]">
                        King Dasharatha addresses you • Watch the royal briefing
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#188ab2] text-white font-mono text-[11px] font-black uppercase px-3 py-1 rounded-full border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    VIDEO SUMMONS
                  </div>
                </div>

                {/* Big Quote */}
                <div className="bg-white rounded-xl border-2 border-[#141413] p-5 mb-5 shadow-[2px_2px_0px_0px_#141413] text-center">
                  <p className="text-2xl sm:text-3xl font-black text-[#188ab2] tracking-tight">
                    {currentDrop.video?.headline || '“I have no heir. Fix this.”'}
                  </p>
                  {currentDrop.video?.caption && (
                    <p className="text-xs font-bold text-slate-500 mt-1.5">
                      {currentDrop.video.caption}
                    </p>
                  )}
                </div>

                {/* Responsive 16:9 YouTube Video Embed Card */}
                <div className="bg-white rounded-xl border-2 border-[#141413] p-3 sm:p-4 shadow-[3px_3px_0px_0px_#141413]">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-[#141413] bg-black shadow-[2px_2px_0px_0px_#141413]">
                    {(() => {
                      const rawYt = currentDrop.video?.youtubeUrl || currentDrop.youtubeUrl;
                      const finalYt = (currentDrop.dayNumber === 1 && (!rawYt || rawYt.includes('dQw4w9WgXcQ')))
                        ? 'https://youtu.be/UDIcRkHsqOs'
                        : (rawYt || (currentDrop.dayNumber === 1 ? 'https://youtu.be/UDIcRkHsqOs' : ''));
                      const embedUrl = getYouTubeEmbedUrl(finalYt);
                      return embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title="King Dasharatha Summons - Video Briefing"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
                          <Video className="w-10 h-10 mb-2 text-[#FEF08A]" />
                          <p className="font-bold text-sm">Video briefing is being configured by the admin.</p>
                          <p className="text-xs text-slate-400 mt-1">Check back shortly or update the link in the Admin Panel.</p>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      HD Video Briefing • Royal Court of Ayodhya
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      StepSmart PM Chronicle
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 📊 3. Poll: “Your first instinct?” */}
            <div className="bg-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📊</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
                  Poll: Your First Instinct?
                </h3>
              </div>
              <p className="text-xs font-mono font-black text-[#188ab2] uppercase tracking-wider mb-6">
                {currentDrop.poll?.baselineNote || 'No wrong answer yet. This is your baseline.'}
              </p>

              <div className="space-y-3 mb-6">
                {currentDrop.poll?.options.map((opt) => {
                  const isSelected = selectedInstinct === opt.key;
                  const pct = opt.key === 'A' ? 22 : opt.key === 'B' ? 51 : 27;

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSelectInstinct(opt.key)}
                      className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 border-[#141413] transition-all relative cursor-pointer ${
                        isSelected
                          ? 'bg-[#FEF08A] shadow-[0px_4px_0px_0px_#141413] translate-y-[-2px]'
                          : 'bg-[#FFFDF5] hover:bg-slate-50 shadow-[0px_2px_0px_0px_#141413] active:translate-y-[1px]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full border-2 border-[#141413] font-black text-sm flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#188ab2] text-white' : 'bg-white text-[#141413]'
                          }`}>
                            {opt.key}
                          </span>
                          <span className="text-base sm:text-lg font-bold text-[#141413]">
                            {opt.text}
                          </span>
                        </div>
                        {selectedInstinct && (
                          <span className="font-mono text-xs font-black text-[#141413] bg-white border border-[#141413] px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_0px_#141413]">
                            {pct}%
                          </span>
                        )}
                      </div>

                      {/* Archetype Reveal upon selection */}
                      {isSelected && opt.explanation && (
                        <div className="mt-3 pt-3 border-t-2 border-dashed border-[#141413]/30 text-xs sm:text-sm text-[#141413]/85">
                          <span className="font-mono font-black text-[#188ab2] uppercase text-xs tracking-wider block mb-1">
                            Archetype: {opt.archetype}
                          </span>
                          <p className="leading-relaxed">{opt.explanation}</p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedInstinct && (
                <div className="bg-[#ECFDF5] border-2 border-[#141413] p-3 rounded-xl text-xs font-bold text-[#065F46] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your baseline instinct has been recorded under your profile. Compare this on Day 3!</span>
                </div>
              )}
            </div>

            {/* ✍️ 4. Open Q: “In one line, what do YOU think the real problem is?” */}
            <div className="bg-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">✍️</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
                  Open Question: The Pre-Test
                </h3>
              </div>
              <p className="text-xs font-bold text-slate-500 mb-4">
                {currentDrop.openQuestion?.helper || '(pre-test, saved for later comparison on Day 3)'}
              </p>

              <form onSubmit={handleSaveDay1Open}>
                <label className="block text-base sm:text-lg font-bold text-[#141413] mb-2">
                  {currentDrop.openQuestion?.prompt || 'In one line, what do YOU think the real problem is?'}
                </label>
                <textarea
                  value={day1OpenAnswer}
                  onChange={(e) => setDay1OpenAnswer(e.target.value)}
                  placeholder={currentDrop.openQuestion?.placeholder || 'In one crisp sentence, describe the underlying problem...'}
                  rows={3}
                  className="w-full p-4 rounded-xl border-2 border-[#141413] text-sm sm:text-base font-medium bg-[#FDFCF7] text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2] shadow-[2px_2px_0px_0px_#141413] mb-4"
                  required
                />

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full font-black border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[2.5px_2.5px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-xs sm:text-sm uppercase inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Submit Pre-Test Answer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {day1AnswerSubmitted && (
                    <span className="text-xs font-bold text-[#065F46] bg-[#ECFDF5] border border-[#141413] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-[1px_1px_0px_0px_#141413]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Saved to your profile for Day 3!
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* 🔮 5. Cliffhanger */}
            <div className="bg-[#141413] text-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
              <div className="flex items-center gap-2 text-[#FEF08A] font-mono font-bold text-xs uppercase mb-2">
                <span>🔮</span>
                <span>Cliffhanger: Tomorrow’s Discovery Phase</span>
              </div>
              <p className="text-xl sm:text-2xl font-serif italic text-white mb-4 font-bold">
                “{currentDrop.cliffhanger || 'Tomorrow you can interview 3 people. Choose wisely.'}”
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Day 2 unlocks on <span className="text-[#FEF08A] font-bold">November 6th</span>. You will cross-examine King Dasharatha, Chief Minister Sumantra, and an Ayodhya citizen to separate Fact from Assumption.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Clock className="w-4 h-4 text-[#FEF08A]" />
                  Day 2 unlocks automatically at 00:00 IST on Nov 6th
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedDate('2026-11-06');
                    setActiveDay(2);
                  }}
                  className="px-5 py-2 rounded-full font-black border-2 border-white bg-[#FEF08A] hover:bg-[#fde047] text-[#141413] shadow-[2px_2px_0px_0px_#ffffff] transition-all text-xs uppercase cursor-pointer"
                >
                  ⚡ Preview Day 2 Discovery Now →
                </button>
              </div>
            </div>

          </div>
        )}

        {/* --- UNLOCKED: DROP 2 (DISCOVERY - DAY 2) --- */}
        {unlocked && activeDay === 2 && (
          <div className="space-y-8">
            
            {/* 🎬 1. Ayodhya council chambers: intro lines + image */}
            <div className="bg-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎬</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
                  Scene 2: Council Chambers of Ayodhya
                </h3>
              </div>

              {/* 4 Lines of Narrative */}
              <div className="bg-[#FFFDF5] rounded-xl border-2 border-[#141413] p-6 mb-6 shadow-[2px_2px_0px_0px_#141413]">
                {(currentDrop.introLines || []).map((line, idx) => (
                  <p key={idx} className="text-base sm:text-lg font-medium leading-relaxed text-[#141413] mb-3 last:mb-0">
                    {idx === (currentDrop.introLines?.length || 1) - 1 ? (
                      <span className="bg-[#FEF08A] text-[#141413] px-2 py-0.5 rounded border border-[#141413] font-black inline-block mt-1">
                        {line}
                      </span>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>

              {/* Scene Image */}
              {currentDrop.imageUrl && (
                <div className="rounded-xl border-2 border-[#141413] shadow-[3px_3px_0px_0px_#141413] overflow-hidden bg-black">
                  <img
                    src={currentDrop.imageUrl || '/ayodhya_dawn.jpg'}
                    alt={currentDrop.imageCaption || "Ayodhya council chambers"}
                    className="w-full h-72 sm:h-96 object-cover hover:scale-[1.01] transition-transform duration-500"
                  />
                  <div className="bg-[#FEF08A] p-3 border-t-2 border-[#141413] text-xs font-bold text-[#141413] flex items-center justify-between">
                    <span>🏛️ {currentDrop.imageCaption || 'The Inner Court of Ayodhya'}</span>
                    <span className="font-mono text-slate-600">8:45 AM IST</span>
                  </div>
                </div>
              )}
            </div>

            {/* Header intro */}
            <div className="bg-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
              <div className="inline-block bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-3 py-1 rounded-full border border-[#141413] shadow-[1px_1px_0px_0px_#141413] mb-3">
                DAY 2: PROBLEM DISCOVERY
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#141413] mb-3 tracking-tight">
                Who Do You Interview First?
              </h2>
              <p className="text-sm sm:text-base text-[#141413]/80 leading-relaxed mb-6 font-medium">
                In classic Product Management, every stakeholder brings a different lens. WhatsApp can’t branch natively, so we give you direct access to separate message channels with all three.
              </p>

              {/* 6. Poll: Who do you interview first? */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {[
                  { key: 'King', label: 'The King (Dasharatha)', role: 'The Sponsor / Executive', icon: '👑' },
                  { key: 'Minister', label: 'Chief Minister (Sumantra)', role: 'The Operator / Politician', icon: '📜' },
                  { key: 'Citizen', label: 'Ayodhya Citizen', role: 'The End User', icon: '🌾' }
                ].map((item) => {
                  const isSelected = selectedInterviewee === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleSelectInterview(item.key)}
                      className={`p-4 sm:p-5 rounded-xl border-2 border-[#141413] text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FEF08A] shadow-[0px_4px_0px_0px_#141413] translate-y-[-2px]'
                          : 'bg-[#FFFDF5] hover:bg-slate-50 shadow-[0px_2px_0px_0px_#141413] active:translate-y-[1px]'
                      }`}
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className="font-black text-base text-[#141413]">{item.label}</div>
                      <div className="text-xs font-bold text-slate-600 mt-0.5">{item.role}</div>
                      {interviewHistory.includes(item.key) && (
                        <span className="mt-2.5 inline-block text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          ✓ Interviewed
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 7. Interactive Interview Messages */}
              <div className="bg-[#FFFDF5] rounded-xl border-2 border-[#141413] p-5 sm:p-6 shadow-[3px_3px_0px_0px_#141413]">
                <div className="flex items-center justify-between border-b-2 border-[#141413]/20 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {selectedInterviewee === 'King' ? '👑' : selectedInterviewee === 'Minister' ? '📜' : '🌾'}
                    </span>
                    <div>
                      <h4 className="font-black text-lg text-[#141413]">
                        {selectedInterviewee === 'King'
                          ? 'Dasharatha: The Emotional Layer'
                          : selectedInterviewee === 'Minister'
                          ? 'Sumantra: The Political Risk Layer'
                          : 'Citizen: The Unspoken Anxiety Layer'}
                      </h4>
                      <p className="text-xs font-bold text-slate-500">
                        {currentDrop.interviews?.[selectedInterviewee]?.title} • {currentDrop.interviews?.[selectedInterviewee]?.role}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-white border border-[#141413] px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_0px_#141413]">
                    4 Messages
                  </span>
                </div>

                {/* Message bubbles */}
                <div className="space-y-3">
                  {currentDrop.interviews?.[selectedInterviewee]?.messages.map((msg, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#141413] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        {selectedInterviewee[0]}
                      </div>
                      <div className="bg-white rounded-xl border-2 border-[#141413] p-3.5 shadow-[2px_2px_0px_0px_#141413] max-w-xl">
                        <p className="text-sm sm:text-base font-medium text-[#141413] leading-relaxed">
                          {msg}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t-2 border-dashed border-[#141413]/20 flex items-center justify-between text-xs font-bold text-slate-600 flex-wrap gap-2">
                  <span>💡 Tip: Click all 3 stakeholders above to compare their conflicting perspectives.</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#141413]">
                    {interviewHistory.length}/3 Stakeholders Heard
                  </span>
                </div>
              </div>
            </div>

            {/* 💡 Note & Video: Only rendered when video section is enabled for Day 2 */}
            {isDayVideoEnabled(currentDrop) && (
              <>
                {/* 💡 Note: Video contains the recorded interviews by each stakeholder */}
                <div className="p-4 sm:p-5 bg-[#FEF08A] rounded-2xl border-2 sm:border-[2.5px] border-[#141413] shadow-[3px_3px_0px_0px_#141413] flex items-start sm:items-center gap-3.5">
                  <span className="text-3xl flex-shrink-0">🎥</span>
                  <div className="text-xs sm:text-sm font-bold text-[#141413] leading-relaxed">
                    <span className="font-black uppercase tracking-wider block text-[11px] text-[#854d0e] mb-1">
                      Stakeholder Discovery Video Briefing
                    </span>
                    The video below contains the recorded interviews conducted with each stakeholder — King Dasharatha (the emotional layer), Chief Minister Sumantra (the political risk layer), and the Citizen of Ayodhya (the unspoken anxiety layer). Watch the video below to hear all three perspectives before completing your discovery worksheet!
                  </div>
                </div>

                {/* 🎬 Day 2 Video Briefing (Recorded Stakeholder Interviews) */}
                <div className="bg-[#F0F9FF] rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
                  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#188ab2] border-2 border-[#141413] flex items-center justify-center text-white shadow-[1.5px_1.5px_0px_0px_#141413]">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
                          Stakeholder Discovery Briefing
                        </h3>
                        <p className="text-xs font-bold text-[#0369A1]">
                          Recorded interviews of King Dasharatha, Chief Minister Sumantra & Ayodhya Citizen
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#188ab2] text-white font-mono text-[11px] font-black uppercase px-3 py-1 rounded-full border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      DAY 2 VIDEO
                    </div>
                  </div>

                  {/* Big Quote */}
                  <div className="bg-white rounded-xl border-2 border-[#141413] p-5 mb-5 shadow-[2px_2px_0px_0px_#141413] text-center">
                    <p className="text-2xl sm:text-3xl font-black text-[#188ab2] tracking-tight">
                      {currentDrop.video?.headline || '“Three voices. One throne. Who do you trust?”'}
                    </p>
                    <p className="text-xs font-bold text-slate-500 mt-1.5">
                      {currentDrop.video?.caption || 'This video contains the individual interviews of King Dasharatha, Chief Minister Sumantra, and the Citizen of Ayodhya.'}
                    </p>
                  </div>

                  {/* Responsive 16:9 YouTube Video Embed Card */}
                  <div className="bg-white rounded-xl border-2 border-[#141413] p-3 sm:p-4 shadow-[3px_3px_0px_0px_#141413]">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-[#141413] bg-black shadow-[2px_2px_0px_0px_#141413]">
                      {(() => {
                        const ytUrl = currentDrop.video?.youtubeUrl || currentDrop.youtubeUrl || 'https://youtu.be/UDIcRkHsqOs';
                        const embedUrl = getYouTubeEmbedUrl(ytUrl);
                        return embedUrl ? (
                          <iframe
                            src={embedUrl}
                            title="Day 2 Stakeholder Discovery Video"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
                            <Video className="w-10 h-10 mb-2 text-[#FEF08A]" />
                            <p className="font-bold text-sm">Video briefing is being configured by the admin.</p>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        HD Video Briefing • Ayodhya Council Chambers
                      </span>
                      <span className="font-mono text-slate-500 text-[11px]">DAY 2</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 8. Open Q: “Sort what you learned into: Fact / Assumption / Unknown.” */}
            <div className="bg-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📋</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
                  PM Discovery Worksheet
                </h3>
              </div>
              <p className="text-sm font-semibold text-[#141413]/80 mb-6">
                Sort what you learned from Dasharatha, Sumantra, and the Citizen into 3 short lines:
              </p>

              <form onSubmit={handleSaveDay2} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#065F46] mb-1">
                    🟢 Fact (What is objectively true?)
                  </label>
                  <input
                    type="text"
                    value={day2Fact}
                    onChange={(e) => setDay2Fact(e.target.value)}
                    placeholder="E.g., Dasharatha currently has no biological heir; borders have rivals."
                    className="w-full p-3 rounded-xl border-2 border-[#141413] font-medium text-sm sm:text-base bg-[#FDFCF7] text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#92400E] mb-1">
                    🟡 Assumption (What are people taking for granted?)
                  </label>
                  <input
                    type="text"
                    value={day2Assumption}
                    onChange={(e) => setDay2Assumption(e.target.value)}
                    placeholder="E.g., Only an immediate biological son can prevent political chaos."
                    className="w-full p-3 rounded-xl border-2 border-[#141413] font-medium text-sm sm:text-base bg-[#FDFCF7] text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#991B1B] mb-1">
                    🔴 Unknown (What crucial information is missing?)
                  </label>
                  <input
                    type="text"
                    value={day2Unknown}
                    onChange={(e) => setDay2Unknown(e.target.value)}
                    placeholder="E.g., Whether the council has considered a designated regent or constitutional heir."
                    className="w-full p-3 rounded-xl border-2 border-[#141413] font-medium text-sm sm:text-base bg-[#FDFCF7] text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full font-black border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[2px_2px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#141413] transition-all text-xs sm:text-sm uppercase cursor-pointer"
                  >
                    Save Discovery Matrix
                  </button>

                  {day2Submitted && (
                    <span className="text-xs font-bold text-[#065F46] bg-[#ECFDF5] border border-[#141413] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-[1px_1px_0px_0px_#141413]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Discovery Matrix Saved!
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* 9. Gentle twist: The conflicting-input moment */}
            <div className="bg-[#FEF08A] rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#188ab2]" />
                <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
                  The Conflicting-Input Moment (Core PM Lesson)
                </h3>
              </div>

              <blockquote className="bg-white rounded-xl border-2 border-[#141413] p-5 text-base sm:text-xl font-bold text-[#141413] shadow-[2px_2px_0px_0px_#141413] mb-4 leading-snug">
                “The minister says the succession crisis is urgent. The citizen says nobody cares. Who’s right?”
              </blockquote>

              <div className="bg-[#141413] text-white p-5 sm:p-6 rounded-xl border-2 border-[#141413] shadow-[3px_3px_0px_0px_#141413]">
                <p className="font-mono text-xs font-bold text-[#FEF08A] mb-2 uppercase tracking-wider">
                  Why This Teaches the Most:
                </p>
                <p className="text-sm sm:text-base leading-relaxed text-slate-200 font-medium">
                  {currentDrop.conflictTwist?.insight}
                </p>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedDate('2026-11-07');
                    setActiveDay(3);
                  }}
                  className="px-6 py-2.5 rounded-full font-black border-2 border-[#141413] bg-[#141413] hover:bg-slate-800 text-white shadow-[2.5px_2.5px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all text-xs sm:text-sm uppercase flex items-center gap-2 cursor-pointer"
                >
                  Continue to Day 3 Reveal →
                </button>
              </div>
            </div>

          </div>
        )}

        {/* --- UNLOCKED: DROP 3 (SYNTHESIS & REVEAL - DAY 3) --- */}
        {unlocked && activeDay === 3 && (
          <div className="space-y-8">
            
            {/* 🎬 1. Ayodhya Grand Durbar: intro lines + image */}
            <div className="bg-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎬</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
                  Scene 3: The Grand Durbar
                </h3>
              </div>

              {/* 4 Lines of Narrative */}
              <div className="bg-[#FFFDF5] rounded-xl border-2 border-[#141413] p-6 mb-6 shadow-[2px_2px_0px_0px_#141413]">
                {(currentDrop.introLines || []).map((line, idx) => (
                  <p key={idx} className="text-base sm:text-lg font-medium leading-relaxed text-[#141413] mb-3 last:mb-0">
                    {idx === (currentDrop.introLines?.length || 1) - 1 ? (
                      <span className="bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded border border-[#141413] font-black inline-block mt-1">
                        {line}
                      </span>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>

              {/* Scene Image */}
              {currentDrop.imageUrl && (
                <div className="rounded-xl border-2 border-[#141413] shadow-[3px_3px_0px_0px_#141413] overflow-hidden bg-black">
                  <img
                    src={currentDrop.imageUrl || '/ayodhya_dawn.jpg'}
                    alt={currentDrop.imageCaption || "Ayodhya grand durbar"}
                    className="w-full h-72 sm:h-96 object-cover hover:scale-[1.01] transition-transform duration-500"
                  />
                  <div className="bg-[#D1FAE5] p-3 border-t-2 border-[#141413] text-xs font-bold text-[#065F46] flex items-center justify-between">
                    <span>🏛️ {currentDrop.imageCaption || 'The Grand Durbar of Ayodhya'}</span>
                    <span className="font-mono text-slate-600">10:30 AM IST</span>
                  </div>
                </div>
              )}
            </div>

            {/* 🎬 2. Day 3 Video Briefing (when enabled & configured) */}
            {isDayVideoEnabled(currentDrop) && (currentDrop.video?.youtubeUrl || currentDrop.youtubeUrl) && (
              <div className="bg-[#F0FDF4] rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#059669] border-2 border-[#141413] flex items-center justify-center text-white shadow-[1.5px_1.5px_0px_0px_#141413]">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
                        The Grand Durbar Address
                      </h3>
                      <p className="text-xs font-bold text-[#047857]">
                        Final diagnosis before the throne • Deliver your synthesis
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#059669] text-white font-mono text-[11px] font-black uppercase px-3 py-1 rounded-full border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    DAY 3 VIDEO
                  </div>
                </div>

                {/* Big Quote */}
                <div className="bg-white rounded-xl border-2 border-[#141413] p-5 mb-5 shadow-[2px_2px_0px_0px_#141413] text-center">
                  <p className="text-2xl sm:text-3xl font-black text-[#047857] tracking-tight">
                    {currentDrop.video?.headline || '“The Grand Durbar: Deliver your strategic diagnosis.”'}
                  </p>
                  {currentDrop.video?.caption && (
                    <p className="text-xs font-bold text-slate-500 mt-1.5">
                      {currentDrop.video.caption}
                    </p>
                  )}
                </div>

                {/* Responsive 16:9 YouTube Video Embed Card */}
                <div className="bg-white rounded-xl border-2 border-[#141413] p-3 sm:p-4 shadow-[3px_3px_0px_0px_#141413]">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-[#141413] bg-black shadow-[2px_2px_0px_0px_#141413]">
                    {(() => {
                      const ytUrl = currentDrop.video?.youtubeUrl || currentDrop.youtubeUrl;
                      const embedUrl = getYouTubeEmbedUrl(ytUrl);
                      return embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title="Day 3 Grand Durbar Video"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
                          <Video className="w-10 h-10 mb-2 text-[#FEF08A]" />
                          <p className="font-bold text-sm">Video briefing is being configured by the admin.</p>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      HD Video Briefing • The Grand Durbar
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">DAY 3</span>
                  </div>
                </div>
              </div>
            )}

            {/* Day 3 Dynamic Question Component (MCQ, Text-based, or Both) */}
            {(() => {
              const qType = currentDrop.questionType || 'both';
              const showText = qType === 'text' || qType === 'both';
              const showMcq = qType === 'mcq' || qType === 'both';
              const pollOptions = currentDrop.poll?.options || currentDrop.recommendationPoll?.options || [];
              const pollTitle = currentDrop.poll?.question || currentDrop.recommendationPoll?.question || 'Your Strategic Recommendation';
              const textPrompt = currentDrop.openQuestion?.prompt || currentDrop.synthesis?.question || 'Write your problem statement in ONE sentence:';
              const textHelper = currentDrop.openQuestion?.helper || 'You have heard the King’s emotion, the Minister’s political calculations, and the Citizen’s quiet anxiety. Now, reduce the fog of Ayodhya into ONE definitive problem statement.';
              const textPlaceholder = currentDrop.openQuestion?.placeholder || "Ayodhya's core problem is...";
              const sampleAnswer = currentDrop.openQuestion?.sampleAnswer || currentDrop.synthesis?.sampleAnswer;

              return (
                <>
                  {/* 10. Text-Based Question (When 'text' or 'both') */}
                  {showText && (
                    <div className="bg-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
                      <div className="inline-block bg-[#D1FAE5] text-[#065F46] font-mono text-xs font-black uppercase px-3 py-1 rounded-full border border-[#141413] shadow-[1px_1px_0px_0px_#141413] mb-3">
                        DAY 3: {qType === 'text' ? 'STRATEGIC CHALLENGE' : 'SYNTHESIS & REVEAL'}
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-black text-[#141413] mb-3 tracking-tight">
                        {textPrompt}
                      </h2>
                      <p className="text-sm sm:text-base text-[#141413]/80 leading-relaxed mb-6 font-medium">
                        {textHelper}
                      </p>

                      <form onSubmit={handleSaveDay3Statement} className="mb-6">
                        <label className="block text-xs font-black uppercase text-[#141413] mb-2">
                          {textPrompt}
                        </label>
                        <textarea
                          value={day3ProblemStatement}
                          onChange={(e) => setDay3ProblemStatement(e.target.value)}
                          placeholder={textPlaceholder}
                          rows={3}
                          className="w-full p-4 rounded-xl border-2 border-[#141413] font-medium text-sm sm:text-base bg-[#FDFCF7] shadow-[2px_2px_0px_0px_#141413] mb-4 focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
                          required
                        />
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-full font-black border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[2px_2px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#141413] transition-all text-xs sm:text-sm uppercase cursor-pointer"
                        >
                          Submit Response & Reveal Analysis
                        </button>
                      </form>

                      {/* Reveal after submit */}
                      {day3StatementSubmitted && (
                        <div className="bg-[#FEF08A] rounded-xl border-2 border-[#141413] p-5 sm:p-6 shadow-[3px_3px_0px_0px_#141413] space-y-5">
                          {sampleAnswer && (
                            <div>
                              <div className="font-mono text-xs font-black uppercase text-[#141413] mb-1.5">
                                ★ Gold-Standard Sample Answer:
                              </div>
                              <blockquote className="bg-white rounded-xl border-2 border-[#141413] p-4 text-sm sm:text-base font-bold italic text-[#141413] shadow-[2px_2px_0px_0px_#141413] leading-relaxed">
                                {sampleAnswer}
                              </blockquote>
                            </div>
                          )}

                          {currentDrop.synthesis?.commonPatterns && currentDrop.synthesis.commonPatterns.length > 0 && (
                            <div>
                              <div className="font-mono text-xs font-black uppercase text-[#141413] mb-2.5">
                                The 3 Most Common Patterns We Observed:
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {currentDrop.synthesis.commonPatterns.map((pat, i) => (
                                  <div key={i} className="bg-white rounded-xl border-2 border-[#141413] p-4 shadow-[1.5px_1.5px_0px_0px_#141413]">
                                    <div className="font-black text-sm text-[#188ab2] mb-1">{pat.title}</div>
                                    <p className="text-xs text-[#141413]/80 leading-relaxed font-medium">{pat.desc}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 11. MCQ Recommendation Poll (When 'mcq' or 'both') */}
                  {showMcq && (
                    <div className="bg-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">⚖️</span>
                        <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
                          {pollTitle}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#141413]/70 font-semibold mb-6">
                        Given everything you’ve discovered, what is your official PM recommendation to Dasharatha?
                      </p>

                      <div className="space-y-3 mb-6">
                        {pollOptions.map((opt) => {
                          const isSelected = day3Recommendation === opt.key;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => handleSelectRecommendation(opt.key)}
                              className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 border-[#141413] transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#FEF08A] shadow-[0px_4px_0px_0px_#141413] translate-y-[-2px]'
                                  : 'bg-[#FFFDF5] hover:bg-slate-50 shadow-[0px_2px_0px_0px_#141413] active:translate-y-[1px]'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                <span className="font-bold text-sm sm:text-base text-[#141413]">
                                  {opt.key ? `(${opt.key}) ` : ''}{opt.text}
                                </span>
                                {(opt.archetype || opt.role) && (
                                  <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 w-fit shrink-0">
                                    {opt.archetype || opt.role}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {day3Recommendation && (
                        <div className="bg-[#ECFDF5] border-2 border-[#141413] p-3 rounded-xl text-xs font-bold text-[#065F46] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Recommendation saved to your profile!</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              );
            })()}

            {/* 12. Reveal: Problem Discovery 3-line framework */}
            <div className="bg-[#141413] text-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
              <div className="inline-block bg-[#FEF08A] text-[#141413] font-mono font-bold text-xs px-3 py-1 rounded-full border border-white mb-3">
                THE CORE PLAYBOOK
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white mb-2 leading-tight">
                You Just Did Problem Discovery.
              </h3>
              <p className="font-mono text-xs sm:text-sm text-[#FEF08A] mb-6 font-bold uppercase tracking-wider">
                Here’s the 3-Line Framework:
              </p>

              <div className="space-y-4">
                {currentDrop.framework?.lines.map((ln, idx) => (
                  <div key={idx} className="bg-white/10 border-2 border-white/20 p-4 sm:p-5 rounded-xl">
                    <div className="font-black text-sm sm:text-base text-[#FEF08A] mb-1">
                      {ln.step}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {ln.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 13. Post-test: Re-ask Message 4 and compare side-by-side */}
            <div className="bg-white rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔄</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
                  Post-Test: Compare Before & After
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-semibold mb-6">
                Now that you have discovered the hidden facts, assumptions, and stakeholder conflicts...
              </p>

              <form onSubmit={handleSaveDay3Post} className="mb-6">
                <label className="block text-base sm:text-lg font-bold text-[#141413] mb-2">
                  In one line, what do YOU think the real problem is NOW?
                </label>
                <textarea
                  value={day3PostAnswer}
                  onChange={(e) => setDay3PostAnswer(e.target.value)}
                  placeholder="Your synthesized post-test diagnosis..."
                  rows={3}
                  className="w-full p-4 rounded-xl border-2 border-[#141413] font-medium text-sm sm:text-base bg-[#FDFCF7] shadow-[2px_2px_0px_0px_#141413] mb-4 focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full font-black border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[2px_2px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#141413] transition-all text-xs sm:text-sm uppercase cursor-pointer"
                >
                  Compare Before & After Diagnostic
                </button>
              </form>

              {/* Side-by-Side Comparison */}
              {day3PostSubmitted && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FFFDF5] rounded-xl border-2 border-[#141413] p-5 sm:p-6 shadow-[3px_3px_0px_0px_#141413]">
                  <div className="bg-white rounded-xl border-2 border-[#141413] p-4 shadow-[1.5px_1.5px_0px_0px_#141413]">
                    <div className="text-xs font-mono font-black text-amber-800 mb-2 flex items-center justify-between">
                      <span>DAY 1 PRE-TEST ANSWER</span>
                      <span className="bg-[#FEF3C7] px-2 py-0.5 rounded border border-amber-300">Baseline Instinct</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[#141413]/85 italic leading-relaxed">
                      “{day1OpenAnswer || 'The King needs an heir to prevent kingdom instability.'}”
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border-2 border-[#141413] p-4 shadow-[1.5px_1.5px_0px_0px_#141413]">
                    <div className="text-xs font-mono font-black text-emerald-800 mb-2 flex items-center justify-between">
                      <span>DAY 3 POST-TEST ANSWER</span>
                      <span className="bg-[#DCFCE7] px-2 py-0.5 rounded border border-emerald-300">Synthesized PM Frame</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#141413] italic leading-relaxed">
                      “{day3PostAnswer}”
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 14. Feedback: 1-5 rating & which moment */}
            <div className="bg-[#FFFDF5] rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⭐</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#141413] tracking-tight">
                  Feedback & Completion
                </h3>
              </div>

              <form onSubmit={handleSaveFeedback} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase text-[#141413] mb-2">
                    How would you rate this 3-Day Problem Discovery Chronicle?
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`w-11 h-11 rounded-xl border-2 border-[#141413] font-black text-sm flex items-center justify-center transition-all cursor-pointer ${
                          rating >= star
                            ? 'bg-[#FEF08A] shadow-[2px_2px_0px_0px_#141413]'
                            : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${rating >= star ? 'fill-[#141413] text-[#141413]' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#141413] mb-2">
                    Which moment would you tell a friend about?
                  </label>
                  <input
                    type="text"
                    value={feedbackMoment}
                    onChange={(e) => setFeedbackMoment(e.target.value)}
                    placeholder="E.g., Dasharatha’s royal video summons vs. the citizen saying nobody cares..."
                    className="w-full p-3.5 rounded-xl border-2 border-[#141413] font-medium text-sm sm:text-base bg-[#FDFCF7] text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2]"
                  />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full font-black border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[2px_2px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#141413] transition-all text-xs sm:text-sm uppercase cursor-pointer"
                  >
                    Submit Feedback
                  </button>

                  {feedbackSaved && (
                    <span className="text-xs font-bold text-[#065F46] bg-[#ECFDF5] border border-[#141413] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-[1px_1px_0px_0px_#141413]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Thank you! Your feedback has been recorded.
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Next Step / Cohort CTA */}
            <div className="bg-[#FEF08A] rounded-2xl border-2 sm:border-[2.5px] border-[#141413] p-6 sm:p-8 shadow-[0px_6px_0px_0px_#141413] text-center">
              <h3 className="text-2xl sm:text-3xl font-black text-[#141413] mb-2 tracking-tight">
                Want to Master Product Discovery & Case Interviews?
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#141413]/80 max-w-lg mx-auto mb-6">
                Join the PM-X Accelerator cohort. 8 weeks of live, rigorous, case-driven problem decomposition, stakeholder handling, and portfolio building with Sanket.
              </p>
              <Link
                to="/"
                className="px-6 py-3 rounded-full font-black border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[2.5px_2.5px_0px_0px_#141413] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#141413] transition-all text-xs sm:text-sm uppercase inline-flex items-center gap-2"
              >
                <span>Explore Full PM-X Cohort</span>
                <span>➜</span>
              </Link>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#141413] bg-[#FFFDF5] py-8 px-6 text-center text-xs font-bold text-[#141413]/70">
        <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#141413]">StepSmart</span>
            <span>·</span>
            <span>Ramayana Chronicle Case Study</span>
          </div>
          <div>
            Built with modern Soft Architectural Neo-Brutalism for StepSmart Product Management.
          </div>
        </div>
      </footer>

    </div>
  );
}
export default RamayanaChroniclePage;
