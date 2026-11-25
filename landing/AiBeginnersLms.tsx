import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Folder,
  Users,
  Presentation,
  Flame,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Lightbulb,
  QrCode,
  Eye,
  EyeOff,
  Clock,
  Send,
  X,
  FileText,
  Search,
  Video,
  Upload,
  Download,
  HelpCircle,
  MessageSquare,
  GraduationCap,
  PlayCircle,
  Share2,
  Compass,
  Award,
  CircleDot,
  Briefcase,
  ClipboardList,
  User,
  Settings,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ArrowLeft,
  Tv,
  Calendar,
  Mail,
  Brain,
  Puzzle,
  FileSpreadsheet,
  Mic,
  PenTool,
  Shield,
  FlaskConical,
  Target,
  RefreshCw,
  ExternalLink,
  Maximize2,
  Minimize2
} from 'lucide-react';

// ─── TYPES & INTERFACES ───
type ModeType = 'learner' | 'instructor';
type MainNavTab = 'home' | 'courses' | 'gym' | 'prompts' | 'assignments' | 'resources' | 'sessions' | 'cohort' | 'profile';
type CourseSubTab = 'slides' | 'videos';
type SlideLang = 'hindi' | 'english';

interface Module0Slide {
  id: string;
  slideNumber: number;
  categoryTag: string;
  hindi: {
    heading: string;
    subheading: string;
    description?: string;
    bullets?: string[];
    cards?: { title: string; desc: string; icon: string; tag?: string }[];
    promptBox?: { label: string; text: string };
    discussion?: string;
    checklist?: string[];
    table?: { problem: string; solution: string }[];
  };
  english: {
    heading: string;
    subheading: string;
    description?: string;
    bullets?: string[];
    cards?: { title: string; desc: string; icon: string; tag?: string }[];
    promptBox?: { label: string; text: string };
    discussion?: string;
    checklist?: string[];
    table?: { problem: string; solution: string }[];
  };
  durationMin: number;
  timeRange: string;
  xpReward: number;
  instructorGuide: {
    purpose: string;
    time: string;
    sayScript: string;
    teachingTip: string;
    questionsToAsk: string[];
    expectedResponses: string[];
  };
}

interface GymChallengeDay {
  day: number;
  caseStudyTitle: string;
  challenge: string;
  questionPrompt: string;
  newExperience: string;
  category: string;
  promptSuggestion: string;
  completed: boolean;
  scoreAwarded?: number;
}

// ─── 14 MODULE 0 SLIDES (Exact match to uploaded presentation deck) ───
const MODULE_0_SLIDES: Module0Slide[] = [
  {
    id: 'm0-slide-1',
    slideNumber: 1,
    categoryTag: 'MODULE 0',
    hindi: {
      heading: 'AI: Ab kaam karne ka tareeka badalne wala hai!',
      subheading: 'Discover how AI can help you learn, work and solve everyday problems.',
      description: 'Aaj hum AI ko use karke dekhenge!',
      cards: [
        { title: '1. Learn, Work & Solve', desc: 'Roz ke mushkil kaam aur padhai ko AI ki madad se aasan banayein.', icon: '💡' },
        { title: '2. Zero Technical Background', desc: 'No coding, no technical jargon. Sirf seekhne ki ichha chahiye.', icon: '✨' },
        { title: '3. Let\'s Experiment!', desc: 'Pehle experience karo, phir samjho ki peeche kya ho raha hai.', icon: '🚀' }
      ]
    },
    english: {
      heading: 'AI: How We Work is About to Change Forever!',
      subheading: 'Discover how AI can help you learn, work, and solve everyday problems.',
      description: 'Today we start by actually using AI hands-on!',
      cards: [
        { title: '1. Learn, Work & Solve', desc: 'Tackle daily workplace friction, study challenges, and decisions with AI.', icon: '💡' },
        { title: '2. Zero Technical Background Required', desc: 'No programming or math background required. If you can chat, you can prompt.', icon: '✨' },
        { title: '3. Let\'s Experiment!', desc: 'Experience the capability first, understand the mechanics second.', icon: '🚀' }
      ]
    },
    durationMin: 2,
    timeRange: '00–02 min',
    xpReward: 10,
    instructorGuide: {
      purpose: 'Set expectations, create curiosity, and establish psychological safety for complete beginners.',
      time: '2 min',
      sayScript: `"Welcome everyone! Aaj hum AI ki technical definitions se start nahi karenge. Hum pehle AI ko use karke dekhenge. Main chahta hoon ki session ke end tak aapke paas kam se kam ek aisa practical use case ho jahan aap kal subah se AI use karna shuru kar sakein."`,
      teachingTip: 'Do not ask who is good at tech. Ask who has casually tested ChatGPT just to break the ice.',
      questionsToAsk: ['Kis kis ne ChatGPT casually use kiya hai?', 'Pehli baar AI se answer milne par kaisa feel hua?'],
      expectedResponses: ['Magic jaisa laga', 'Google se zyada fast laga']
    }
  },
  {
    id: 'm0-slide-2',
    slideNumber: 2,
    categoryTag: 'Imagine',
    hindi: {
      heading: 'Imagine karo, aapke paas ek assistant ho...',
      subheading: 'Jo kabhi busy nahi hota aur aapki help kar sakta hai:',
      cards: [
        { title: '1. Difficult Topics Samjhane Mein', desc: 'Mushkil concepts ko simple Hindi aur school teacher ki tarah explain karta hai.', icon: '💡' },
        { title: '2. Emails & Presentations Likhne Mein', desc: 'Professional emails, slide outlines aur WhatsApp drafts likhta hai.', icon: '✉️' },
        { title: '3. Daily Schedule Organize Karne Mein', desc: 'Aapka poora timetable buffer time ke saath plan karta hai.', icon: '📅' },
        { title: '4. Naye Ideas Sochne Mein', desc: 'Brainstorming aur creative angles generate karne mein madad karta hai.', icon: '🧠' },
        { title: '5. Problems Solve Karne Mein', desc: 'Calculations, decisions aur complex tradeoffs mein guide karta hai.', icon: '🧩' }
      ],
      discussion: 'Aap sabse pehle is assistant se kya karwana chahoge?'
    },
    english: {
      heading: 'Imagine having an assistant available 24/7...',
      subheading: 'Someone who is never busy and always ready to help with:',
      cards: [
        { title: '1. Explaining Difficult Concepts', desc: 'Breaks down tough topics with plain language and intuitive real-life examples.', icon: '💡' },
        { title: '2. Writing Emails & Presentations', desc: 'Drafts polished messages, reports, proposals, and slide decks effortlessly.', icon: '✉️' },
        { title: '3. Organizing Daily Schedules', desc: 'Structures your busy week with realistic priorities and sensible buffers.', icon: '📅' },
        { title: '4. Brainstorming Fresh Ideas', desc: 'Generates creative angles, project roadmaps, and content hooks.', icon: '🧠' },
        { title: '5. Solving Complex Problems', desc: 'Tackles numerical calculations, everyday planning, and logical decisions.', icon: '🧩' }
      ],
      discussion: 'What is the very first task you would ask this assistant to handle for you?'
    },
    durationMin: 5,
    timeRange: '02–07 min',
    xpReward: 10,
    instructorGuide: {
      purpose: 'Trigger curiosity and open learners\' imaginations to everyday possibilities.',
      time: '5 min',
      sayScript: `"Imagine karo aapke paas ek aisa assistant hai jo kabhi busy nahi hota. Aap usse kisi bhi waqt sawaal pooch sakte ho. Difficult topic ho, email likhna ho, ya poore hafte ki planning — woh 5 second mein organize kar dega."`,
      teachingTip: 'Ask learners from different backgrounds (students, working pros, homemakers) to speak up.',
      questionsToAsk: ['Sabse pehla kaam kya karwaoge is assistant se?', 'Aapka sabse tedious daily task kaunsa hai?'],
      expectedResponses: ['Office emails draft karna', 'College assignments', 'Weekly diet & budget planning']
    }
  },
  {
    id: 'm0-slide-3',
    slideNumber: 3,
    categoryTag: 'Demo 01 · AI as your personal assistant',
    hindi: {
      heading: 'AI as your personal assistant (Live demo · 3 min)',
      subheading: 'Sunday evening hai... Agla hafta kaafi busy hai.',
      description: 'Tasks: Gym 4 baar, Wednesday tak presentation, groceries, 2 hours learning, 3 meetings, family time, electricity bill.',
      cards: [
        { title: 'Chaotic Commitments', desc: 'Itne saare tasks aur deadlines ko ek saath realistic timetable mein kaise manage karoge?', icon: '📅' }
      ],
      promptBox: {
        label: 'COPY THIS PROMPT (Live Classroom Demo)',
        text: `Mera agla hafta kaafi busy hai. Mere paas ye tasks hain: gym 4 baar, Wednesday tak work presentation, groceries, 2 hours learning, 3 meetings, family time aur electricity bill. Mere liye ek realistic weekly schedule banao. Important tasks ko priority do, breaks aur buffer time bhi rakho. Agar schedule unrealistic hai toh mujhe suggest karo ki kya change karna chahiye.`
      },
      discussion: 'Aap apna week plan karne mein kitna time spend karte ho? Kya AI ye kaam easier bana sakta hai?'
    },
    english: {
      heading: 'AI as your personal assistant (Live demo · 3 min)',
      subheading: 'It\'s Sunday evening... Your upcoming week is jammed with conflicting commitments.',
      description: 'Tasks: 4 workouts, Wednesday presentation, groceries, 2 hrs study, 3 meetings, family time, electricity bill.',
      cards: [
        { title: 'The Planning Crisis', desc: 'How do you juggle tight deadlines, chores, and fitness without burning out?', icon: '📅' }
      ],
      promptBox: {
        label: 'COPY THIS PROMPT (Live Classroom Demo)',
        text: `My upcoming week is going to be very busy. I need to complete these tasks: go to gym 4 times, finish an office presentation by Wednesday, grocery shopping, 2 hours learning, attend 3 meetings, spend family time, and pay electricity bills. Create a realistic weekly schedule for me. Prioritize important tasks, keep breaks and buffer time. If the schedule is unrealistic, suggest what to adjust.`
      },
      discussion: 'How much time do you currently waste planning your week? Can AI eliminate this friction?'
    },
    durationMin: 3,
    timeRange: '07–10 min',
    xpReward: 15,
    instructorGuide: {
      purpose: 'Demonstrate live assistant capabilities on projector screen.',
      time: '3 min',
      sayScript: `"Sunday evening ko har insaan stress mein hota hai ki agle hafte sab kaam kaise honge. Main AI ko apni commitments aur constraints bata raha hoon live screen par — dekhte hain ye timetable kaise banata hai."`,
      teachingTip: 'Highlight how conversational phrasing leads to realistic buffer times in ChatGPT/Claude.',
      questionsToAsk: ['AI ne buffer time kyu rakha?', 'Kya AI ne bina pooche assumptions liye?'],
      expectedResponses: ['Wednesday morning presentation lock ki', 'Buffer time burnout se bachata hai']
    }
  },
  {
    id: 'm0-slide-4',
    slideNumber: 4,
    categoryTag: 'Demo 02 · AI as your personal teacher',
    hindi: {
      heading: 'AI as your personal teacher (Live demo · 3 min)',
      subheading: 'Shopping karte waqt discount samajhna hai!',
      description: 'Ek shirt ki original price ₹1,000 hai. Uspar 20% discount mil raha hai. Discount kitna hoga? Aapko kitne paise pay karne honge? Calculation kaise karoge? AI se sirf answer nahi, concept samjho!',
      promptBox: {
        label: 'COPY THIS PROMPT (Percentages Demonstration)',
        text: `Mujhe percentage samajhne mein difficulty hoti hai. Maan lo ek shirt ki price ₹1,000 hai aur uspe 20% discount mil raha hai. Mujhe bilkul basic level se samjhao ki discount kaise calculate karte hain. School teacher ki tarah step-by-step samjhana, ek simple real-life example dena aur end mein mujhe ek similar question solve karne ke liye dena. Jab tak main answer na doon, solution mat batana.`
      },
      discussion: 'Koi bhi difficult topic samajhna ho, toh kya AI aapka personal teacher ban sakta hai?'
    },
    english: {
      heading: 'AI as your personal teacher (Live demo · 3 min)',
      subheading: 'Understanding discounts while shopping!',
      description: 'A shirt costs ₹1,000 with a 20% discount. What is the discount amount? What do you pay? How do you calculate it? Don\'t just ask AI for the answer—make it teach you the concept!',
      promptBox: {
        label: 'COPY THIS PROMPT (Percentages Demonstration)',
        text: `I find percentages difficult to understand. Imagine a shirt costs ₹1,000 and has a 20% discount. Explain from the very basics how to calculate the discount. Teach me step by step like a school teacher, give me a simple real-life example and then give me a similar question to solve. Don't reveal the solution until I answer.`
      },
      discussion: 'When you struggle with an unfamiliar topic, can AI become your infinitely patient private tutor?'
    },
    durationMin: 3,
    timeRange: '10–13 min',
    xpReward: 15,
    instructorGuide: {
      purpose: 'Showcase Socratic teaching over mere robotic answer generation.',
      time: '3 min',
      sayScript: `"Notice karo: humne AI ko sirf calculator ki tarah 20% calculate karne nahi bola. Humne bola 'school teacher ki tarah samjhao' aur 'end mein mera test lo bina answer bataye'. Ye prompting ki power hai."`,
      teachingTip: 'Show how AI holds back the answer and waits for the student\'s input.',
      questionsToAsk: ['Kya school textbook se zyada friendly laga?', 'Doosri analogy maang sakte hain?'],
      expectedResponses: ['Pizza analogy se turant samajh aaya', 'Test lene se dimaag chalta hai']
    }
  },
  {
    id: 'm0-slide-5',
    slideNumber: 5,
    categoryTag: 'Demo 03 · AI as your communication assistant',
    hindi: {
      heading: 'AI as your communication assistant (Live demo · 3 min)',
      subheading: 'Manager ko difficult email bhejna hai!',
      description: 'Project Wednesday tak complete hona tha, lekin dependencies delay ho gayi hain. Manager ko batana hai: time par nahi hoga, delay ka reason explain karna hai, Friday ki deadline suggest karni hai, aur bina excuses ke professional sound karna hai.',
      promptBox: {
        label: 'COPY THIS PROMPT (Communication Polish)',
        text: `Mujhe apne manager ko inform karna hai ki project Wednesday tak complete nahi ho payega kyunki kuch dependencies delay ho gayi hain. Ek short professional email draft karo jo: Responsibility accept kare, situation clearly explain kare, Friday ki revised deadline suggest kare, aur professional but friendly tone maintain kare. Email aisa lage ki main khud likh raha hoon, overly formal nahi.`
      },
      discussion: 'Agar AI first draft bana de, toh kya aap apna time writing se hatakar reviewing aur improving mein laga sakte ho?'
    },
    english: {
      heading: 'AI as your communication assistant (Live demo · 3 min)',
      subheading: 'Writing a high-stakes, delicate email to your manager!',
      description: 'The project was due Wednesday, but third-party dependencies are blocked. You need to inform leadership: own the delay gracefully, explain the bottleneck, propose a realistic Friday deadline, and maintain trust.',
      promptBox: {
        label: 'COPY THIS PROMPT (Communication Polish)',
        text: `I need to inform my manager that our project won't be completed by Wednesday because dependencies got delayed. Draft a short, professional email that: takes ownership, clearly explains the delay, proposes a revised Friday deadline, and maintains a friendly yet professional tone. It should sound genuine, not robotic.`
      },
      discussion: 'If AI handles the zero-to-one first draft, can you spend your energy reviewing and refining instead?'
    },
    durationMin: 3,
    timeRange: '13–16 min',
    xpReward: 15,
    instructorGuide: {
      purpose: 'Demonstrate communication nuance and tone calibration.',
      time: '3 min',
      sayScript: `"Email draft karte waqt sabse zyada time 'kahan se shuru karein' mein lagta hai. AI aapko 3 second mein first draft deta hai jise aap edit kar sakte ho."`,
      teachingTip: 'Highlight how specifying tone constraints ("not overly formal") prevents robotic jargon.',
      questionsToAsk: ['Kya aapko draft mein kuch modify karne ka mann kiya?', 'Writing vs Reviewing mein kitna time bachta hai?'],
      expectedResponses: ['70% time bach gaya', 'Tone bohot respectful aur confident hai']
    }
  },
  {
    id: 'm0-slide-6',
    slideNumber: 6,
    categoryTag: 'Debrief',
    hindi: {
      heading: 'What did we just discover? Teen situations, ek common pattern!',
      subheading: 'Organize · Understand · Communicate',
      cards: [
        { title: '1. Organize', desc: 'Apna chaotic week buffer time ke saath plan karo.', icon: '📋' },
        { title: '2. Understand', desc: 'Naye concepts aur calculations step-by-step seekho.', icon: '🎓' },
        { title: '3. Communicate', desc: 'Better communication aur respectful drafts banao.', icon: '💬' }
      ],
      discussion: 'In teeno examples mein AI ne aapki kis tarah help ki?\nA. Time bachaya?\nB. Difficult kaam easier banaya?\nC. Better ideas aur suggestions diye?'
    },
    english: {
      heading: 'What did we just discover? Three situations, one common pattern!',
      subheading: 'Organize · Understand · Communicate',
      cards: [
        { title: '1. Organize', desc: 'Structure your calendar and task load with sensible buffers.', icon: '📋' },
        { title: '2. Understand', desc: 'Grasp complex math, concepts, and procedures step-by-step.', icon: '🎓' },
        { title: '3. Communicate', desc: 'Express difficult updates with poise, empathy, and clarity.', icon: '💬' }
      ],
      discussion: 'Across these 3 demonstrations, how did AI add the most value for you?\nA. Saved precious time?\nB. Made difficult work approachable?\nC. Provided better ideas and angles?'
    },
    durationMin: 4,
    timeRange: '16–20 min',
    xpReward: 10,
    instructorGuide: {
      purpose: 'Consolidate the mental model of AI assistance before students start their hands-on drill.',
      time: '4 min',
      sayScript: `"Dekha aapne? Chahe schedule banana ho, discount samajhna ho, ya email likhna ho — pattern ek hi hai: Clear context do, desired format batao, aur AI se collaborate karo."`,
      teachingTip: 'Ask the room to raise hands for Option A, B, or C.',
      questionsToAsk: ['Kiske liye time saving sabse zaroori hai?', 'Kisko better ideas chahiye the?'],
      expectedResponses: ['Time saving sabse bada factor hai', 'Difficult emails likhna easy ho gaya']
    }
  },
  {
    id: 'm0-slide-7',
    slideNumber: 7,
    categoryTag: 'Activity · 10 min · Individual',
    hindi: {
      heading: 'Now it\'s your turn! Don\'t just watch. Khud try karo!',
      subheading: 'Apni life se ek real problem identify karo aur solve karo!',
      description: 'Student (subject samajhna) · Professional (meeting prepare karna) · Job seeker (resume improve) · Homemaker (meal plan) · Business owner (customer retention) · Engineer (technical concept).',
      cards: [
        { title: '1. Problem Chuno', desc: 'Apni life se ek real problem identify karo.', icon: '🎯' },
        { title: '2. ChatGPT Open Karo', desc: 'Apni normal bhasha mein apni situation explain karo.', icon: '📱' },
        { title: '3. Follow-up Poocho', desc: 'Response ko improve karne ke liye follow-up sawaal poochho.', icon: '🔄' }
      ],
      discussion: 'Perfect prompt ki zarurat nahi. Apni problem se start karo.\nActivity ke baad: 1. Kaunsi problem solve ki? 2. Kya AI solution ke closer laya? 3. Response mein kya improve karoge?'
    },
    english: {
      heading: 'Now it\'s your turn! Don\'t just watch. Try it yourself!',
      subheading: 'Identify one genuine friction point from your everyday life and prompt AI!',
      description: 'Student (study topic) · Working Pro (meeting prep) · Job Seeker (resume polish) · Homemaker (weekly menu) · Business Owner (client retention) · Engineer (code/tech concept).',
      cards: [
        { title: '1. Pick a Problem', desc: 'Select one genuine friction point you experienced this week.', icon: '🎯' },
        { title: '2. Open ChatGPT/Claude', desc: 'Explain your context naturally in plain words.', icon: '📱' },
        { title: '3. Ask Follow-ups', desc: 'Direct the AI to refine, shorten, or format the answer.', icon: '🔄' }
      ],
      discussion: 'You don\'t need a perfect prompt. Start with your real problem.\nAfter the activity: 1. Which problem did you tackle? 2. Did AI bring you closer to a solution? 3. What would you refine?'
    },
    durationMin: 10,
    timeRange: '20–30 min',
    xpReward: 20,
    instructorGuide: {
      purpose: 'Get 100% of the room to experiment hands-on on their personal devices.',
      time: '10 min',
      sayScript: `"Ab aapki baari hai. Phone ya laptop kholiye, ChatGPT par jaiye aur apni life ka ek real problem likhiye. Perfect prompt ki tension mat lijiye."`,
      teachingTip: 'Walk the floor. Help students who are staring at blank input boxes. Encourage Hindi typing.',
      questionsToAsk: ['Kisko first answer se satisfaction mili?', 'Kisko follow-up dekar customize karna pada?'],
      expectedResponses: ['Resume bullet points bache', 'Meeting talking points 2 min mein mil gaye']
    }
  },
  {
    id: 'm0-slide-8',
    slideNumber: 8,
    categoryTag: 'Beyond the chatbot',
    hindi: {
      heading: 'AI is not just a chatbot: Aap sirf type hi nahi, aur bhi bahut kuch kar sakte ho!',
      subheading: 'Images · Documents · Data · Voice',
      cards: [
        { title: '1. Images (Tasveerein)', desc: 'Photo upload karke information extract karo (bills, handwriting).', icon: '🖼️' },
        { title: '2. Documents (PDFs)', desc: 'Long PDF ya notes ko simple language mein samjho.', icon: '📄' },
        { title: '3. Data (Numbers)', desc: 'Numbers mein patterns aur hidden insights dhoondo.', icon: '📊' },
        { title: '4. Voice (Awaaz)', desc: 'Bolkar natural conversational flow mein interact karo.', icon: '🎙️' }
      ],
      discussion: 'Aapke paas kis type ka information hota hai jise AI process kar sakta hai?'
    },
    english: {
      heading: 'AI is not just a chatbot: Move beyond text-only interactions!',
      subheading: 'Images · Documents · Data · Voice',
      cards: [
        { title: '1. Images & Photos', desc: 'Upload pictures of receipts, whiteboard diagrams, or documents to extract data.', icon: '🖼️' },
        { title: '2. Documents & PDFs', desc: 'Upload lengthy reports and ask for concise executive summaries.', icon: '📄' },
        { title: '3. Numerical Data', desc: 'Paste raw tables to detect anomalies, revenue drivers, and trends.', icon: '📊' },
        { title: '4. Voice & Audio', desc: 'Speak naturally without looking down to type on small keyboards.', icon: '🎙️' }
      ],
      discussion: 'What format of information (paperwork, voice notes, spreadsheets) drains your time most?'
    },
    durationMin: 5,
    timeRange: '30–35 min',
    xpReward: 10,
    instructorGuide: {
      purpose: 'Demonstrate multimodal AI features (voice, vision, PDFs).',
      time: '5 min',
      sayScript: `"Log sochte hain AI sirf text chat karta hai. Lekin camera icon dabao aur bill ka photo upload karo, ya microphone dabao aur bol kar baat karo."`,
      teachingTip: 'Show camera and microphone icons on the phone app interface.',
      questionsToAsk: ['Kiske paas office mein lengthy PDFs padhne ka time nahi hota?'],
      expectedResponses: ['Legal agreements', 'Research papers', 'Expense slips']
    }
  },
  {
    id: 'm0-slide-9',
    slideNumber: 9,
    categoryTag: 'Live demo prompts',
    hindi: {
      heading: 'AI ko different types of information do!',
      subheading: '4 Multimodal Demos: Image, Document, Data, Voice',
      cards: [
        { title: 'Demo 1 — Image', desc: 'Upload handwritten notes: "Is image ke notes ko simple language mein summarize karo aur checklist banao."', icon: '🖼️' },
        { title: 'Demo 2 — Document', desc: 'Upload sample PDF: "Is document ko simple Hinglish mein summarize karo. 5 most important points batao."', icon: '📄' },
        { title: 'Demo 3 — Data', desc: 'Upload sales spreadsheet: "Kaunse products sabse zyada revenue generate kar rahe hain? 3 patterns batao."', icon: '📊' },
        { title: 'Demo 4 — Voice', desc: 'Use voice interaction: "Main apne thoughts bolunga. Unhe organize karke ek clear action plan banao."', icon: '🎙️' }
      ],
      discussion: 'Text, images, documents, data, voice — aapko kaunsa interaction sabse useful laga?'
    },
    english: {
      heading: 'Feed AI diverse modalities of information!',
      subheading: '4 Multimodal Demos: Image, Document, Data, Voice',
      cards: [
        { title: 'Demo 1 — Image', desc: 'Upload handwritten notes: "Summarize the notes in this photo into clean, actionable bullet points."', icon: '🖼️' },
        { title: 'Demo 2 — Document', desc: 'Upload sample PDF: "Extract the 5 most critical insights and explain why they matter."', icon: '📄' },
        { title: 'Demo 3 — Data', desc: 'Upload sales spreadsheet: "Identify top revenue drivers and 3 interesting patterns."', icon: '📊' },
        { title: 'Demo 4 — Voice', desc: 'Voice input: "I will talk out loud. Transcribe and turn my brainstorm into a plan."', icon: '🎙️' }
      ],
      discussion: 'Between text, photos, PDFs, spreadsheets, and voice, which modality would speed up your workflow most?'
    },
    durationMin: 5,
    timeRange: '35–40 min',
    xpReward: 15,
    instructorGuide: {
      purpose: 'Run fast-paced live demos of image parsing and voice interaction.',
      time: '5 min',
      sayScript: `"Dekhiye main ek messy handwritten note ka photo upload kar raha hoon. AI ne 3 second mein text extract kar diya."`,
      teachingTip: 'Use a clear sample image on the projector.',
      questionsToAsk: ['Kisko voice typing try karna pasand aaya?'],
      expectedResponses: ['Voice mode se walk karte waqt notes ban sakte hain']
    }
  },
  {
    id: 'm0-slide-10',
    slideNumber: 10,
    categoryTag: 'Individual reflection',
    hindi: {
      heading: 'Where can AI help in your world? Ab apni daily life ke baare mein socho!',
      subheading: 'Har category mein kam se kam ek example identify karein:',
      cards: [
        { title: 'Tasks I Repeat', desc: 'Main kaunsa kaam baar-baar karta/karti hoon jo mera time leta hai? (Emails, reports, scheduling, meeting notes)', icon: '🔄' },
        { title: 'Things I Want to Understand', desc: 'Kaunsi cheez mujhe samajhne mein difficulty hoti hai? (Financial concepts, technology, English, professional skills)', icon: '❓' },
        { title: 'Things I Want to Accomplish', desc: 'Aisa kya hai jo main karna chahta/chahti hoon, lekin start nahi kar paaya? (Business start, career change, content creation, new skill)', icon: '🎯' }
      ],
      discussion: 'Your task: Har category mein kam se kam ek example likho aur partner se discuss karo.'
    },
    english: {
      heading: 'Where can AI help in your world? Reflect on your daily routine!',
      subheading: 'Identify at least one friction point in each category:',
      cards: [
        { title: 'Tasks I Repeat', desc: 'What routine work drains your time repeatedly? (Status updates, email drafts, formatting, scheduling)', icon: '🔄' },
        { title: 'Things I Want to Understand', desc: 'What concepts confuse you? (Financial statements, software tools, technical jargon, frameworks)', icon: '❓' },
        { title: 'Things I Want to Accomplish', desc: 'What ambition have you delayed starting? (Side business, portfolio overhaul, learning AI, public writing)', icon: '🎯' }
      ],
      discussion: 'Write down one example for each bucket and share with your classmate.'
    },
    durationMin: 5,
    timeRange: '40–45 min',
    xpReward: 10,
    instructorGuide: {
      purpose: 'Ground the session in personal relevance and prepare for the Activity Journal.',
      time: '5 min',
      sayScript: `"Har insaan ki daily life alag hoti hai. Socho: kaunsa kaam aap baar-baar karte ho? Kaunsi cheez samajh nahi aati? Aur kya naya start karna chahte ho?"`,
      teachingTip: 'Give 3 minutes of quiet reflection time.',
      questionsToAsk: ['Kisi ne repetitive task likha? Share karein.'],
      expectedResponses: ['Client invoices banana', 'Study material summarize karna']
    }
  },
  {
    id: 'm0-slide-11',
    slideNumber: 11,
    categoryTag: 'Group discussion · 5 min',
    hindi: {
      heading: 'Let\'s brainstorm together: Ek problem. Multiple AI possibilities!',
      subheading: 'Groups of 3–4 learners banao aur discuss karo:',
      table: [
        { problem: 'Interview ka preparation', solution: 'AI se mock interview conduct karwao' },
        { problem: 'English improve karni hai', solution: 'Daily conversation practice & tone feedback' },
        { problem: 'Presentation banani hai', solution: 'Slide outline aur bullet points generate karo' },
        { problem: 'Bank statement samajhna', solution: 'Expense categorization & spending analysis' },
        { problem: 'Business start karna hai', solution: 'Business plan & competitor analysis' }
      ],
      discussion: 'Aapke group mein sabse interesting AI use case kaunsa nikal kar aaya?'
    },
    english: {
      heading: 'Let\'s brainstorm together: One problem, multiple AI angles!',
      subheading: 'Form groups of 3–4 learners and evaluate use cases:',
      table: [
        { problem: 'Interview Preparation', solution: 'Conduct realistic mock interviews & receive feedback' },
        { problem: 'English Communication', solution: 'Daily interactive conversation drills & grammar polish' },
        { problem: 'Presentation Deck', solution: 'Structure compelling narrative outlines and slide copy' },
        { problem: 'Bank Statement Analysis', solution: 'Categorize transactions & spot subscription leakages' },
        { problem: 'Launching a Business', solution: 'Draft initial pitch briefs & customer persona discovery' }
      ],
      discussion: 'What was the most creative or unexpected use case shared in your small group?'
    },
    durationMin: 5,
    timeRange: '45–50 min',
    xpReward: 15,
    instructorGuide: {
      purpose: 'Spark peer learning and diverse application discovery.',
      time: '5 min',
      sayScript: `"Apne paas baithe 3 logo se discuss karo. Ek person problem bataye, doosre suggest karein ki AI isme kaise help karega."`,
      teachingTip: 'Keep energy high and encourage cross-pollination between different professions.',
      questionsToAsk: ['Group mein sabse unique use case kya tha?'],
      expectedResponses: ['Customer feedback analysis', 'Recipe planning from leftover groceries']
    }
  },
  {
    id: 'm0-slide-12',
    slideNumber: 12,
    categoryTag: 'Curiosity experiment',
    hindi: {
      heading: 'The Big Question: How does a machine generate an intelligent response?',
      subheading: 'The sun rises in the ______ -> East! Aapko kaise pata chala?',
      description: 'Agar ek machine bhi agla word predict kar sakti hai, toh:\n• Machine ko kaise pata chalta hai ki agla word kya ho?\n• Kya woh har sentence memorize karti hai?\n• Kya woh Google par answer search karti hai?\n• Kya woh human ki tarah language samajhti hai?',
      cards: [
        { title: 'Next-Token Prediction', desc: 'AI pichhle context ke basis par agle word ki probability calculate karta hai. Just like autocomplete!', icon: '🎲' }
      ],
      discussion: 'Kya machine sach mein sochti hai ya sirf probability calculate karti hai?'
    },
    english: {
      heading: 'The Big Question: How does a machine generate an intelligent response?',
      subheading: 'The sun rises in the ______ -> East! How did you know that instinctively?',
      description: 'If a machine also predicts the next word accurately:\n• How does the model know which word comes next?\n• Does it memorize every sentence in human history?\n• Does it search Google behind the scenes?\n• Does it understand language like a human mind?',
      cards: [
        { title: 'Next-Token Prediction', desc: 'AI calculates the probability distribution of the next token based on given context.', icon: '🎲' }
      ],
      discussion: 'Does the machine genuinely "think", or does it perform hyper-advanced probabilistic completion?'
    },
    durationMin: 5,
    timeRange: '50–55 min',
    xpReward: 10,
    instructorGuide: {
      purpose: 'Demystify LLM mechanics without intimidating math.',
      time: '5 min',
      sayScript: `"The sun rises in the ______? East! Machine ko kaise pata chala? Kya machine sochti hai? Nahi! AI agla token predict karta hai based on the CONTEXT you provide."`,
      teachingTip: 'Stick to the autocomplete metaphor; avoid transformer deep-dive for now.',
      questionsToAsk: ['Context badalne se agla word kaise badal sakta hai?'],
      expectedResponses: ['Context incomplete hoga toh galat andaza lagayega']
    }
  },
  {
    id: 'm0-slide-13',
    slideNumber: 13,
    categoryTag: 'Commitment',
    hindi: {
      heading: 'Your First AI Commitment: Kal se AI ka use kis kaam ke liye karoge?',
      subheading: 'Complete this sentence:',
      description: '"Ek cheez jiske liye main kal se AI use karna start karunga/karungi..."',
      cards: [
        { title: 'Write It Down', desc: 'Apni commitment ko notebook ya phone par note karein.', icon: '✍️' },
        { title: 'Share With Partner', desc: 'Apne paas baithe person ko batayein taaki accountability bane.', icon: '🤝' },
        { title: 'First Step to Autonomy', desc: 'AI consumer se AI power-user banne ka pehla step!', icon: '🚀' }
      ],
      discussion: 'Ek specific task batayein jo kal subah 9 baje aap AI ke saath execute karoge.'
    },
    english: {
      heading: 'Your First AI Commitment: What will you use AI for tomorrow?',
      subheading: 'Complete this commitment sentence:',
      description: '"One specific thing I will start using AI for starting tomorrow is..."',
      cards: [
        { title: 'Write It Down', desc: 'Record your commitment on your device or workbook.', icon: '✍️' },
        { title: 'Share With a Peer', desc: 'Tell your neighbor to create social accountability.', icon: '🤝' },
        { title: 'First Step to Mastery', desc: 'The transition from passive observer to active AI user.', icon: '🚀' }
      ],
      discussion: 'Name one exact task you will execute tomorrow at 9 AM using AI.'
    },
    durationMin: 5,
    timeRange: '55–60 min',
    xpReward: 15,
    instructorGuide: {
      purpose: 'Lock in behavioral commitment before class disperses.',
      time: '5 min',
      sayScript: `"Course dekhna aasan hai. Asli change tab aayega jab aap kal subah ek kaam AI ke saath karoge. Sabhi log apni commitment share karein."`,
      teachingTip: 'Ask 3-4 attendees to share their commitment out loud.',
      questionsToAsk: ['Kal subah sabse pehla prompt kya hoga?'],
      expectedResponses: ['Morning task list organize karna', 'Client message draft karna']
    }
  },
  {
    id: 'm0-slide-14',
    slideNumber: 14,
    categoryTag: 'Before we finish',
    hindi: {
      heading: 'Remember these three things!',
      subheading: 'Experiment karo · Verify karo · Think better',
      cards: [
        { title: '1. Experiment Karo', desc: 'Perfect prompt ka wait mat karo. Natural bhasha mein shuru karo.', icon: '🧪' },
        { title: '2. Verify Karo', desc: 'AI ke answers ko blindly trust mat karo. Final decision hamesha aapka hai.', icon: '🛡️' },
        { title: '3. Think Better', desc: 'AI ko apni thinking improve karne ke liye use karo, replace karne ke liye nahi.', icon: '🧠' }
      ],
      discussion: 'Next → Let\'s discover how AI actually works in Week 2!'
    },
    english: {
      heading: 'Before we finish: Remember these three rules!',
      subheading: 'Experiment · Verify · Think Better',
      cards: [
        { title: '1. Experiment Boldly', desc: 'Never wait for a perfect prompt. Start messy and iterate.', icon: '🧪' },
        { title: '2. Verify Critical Facts', desc: 'Do not trust AI blindly. You remain the decision-maker.', icon: '🛡️' },
        { title: '3. Think Better', desc: 'Use AI to elevate your thinking, not to outsource your judgment.', icon: '🧠' }
      ],
      discussion: 'Next → Let\'s dive into advanced workflows and automation in Week 2!'
    },
    durationMin: 5,
    timeRange: '60–65 min',
    xpReward: 20,
    instructorGuide: {
      purpose: 'Wrap up the workshop with clear ethical and critical thinking guardrails.',
      time: '5 min',
      sayScript: `"Ye 3 golden rules yaad rakhiye: Experiment, Verify aur Think Better. Congratulations on completing Module 0!"`,
      teachingTip: 'Instruct learners to fill out the Activity Journal below and check the 7-day AI Gym challenge.',
      questionsToAsk: ['Kisko session se confidence mila?'],
      expectedResponses: ['Dar khatam ho gaya', 'Kal se regular use karunga']
    }
  }
];

// ─── 7-DAY AI GYM CHALLENGES (1 per day; missed days can be attempted later for 8 XP instead of 20 XP) ───
const TODAY_GYM_DAY = 2; // Nov 24, 2026 - Day 2 active today

const INITIAL_GYM_CHALLENGES: GymChallengeDay[] = [
  {
    day: 1,
    caseStudyTitle: "Micro-Experiment 1: AI as Personal Learning Companion",
    challenge: "Ask AI to explain something you don't understand",
    questionPrompt: "Pick a complex or confusing concept you encounter in work, studies, or daily life. Ask AI to explain it step-by-step using a real-world analogy. Evaluate whether the explanation clarified the concept or oversimplified it.",
    newExperience: "Learning",
    category: "Concept Breakdown",
    promptSuggestion: "Explain [Topic/Concept] to me like I am 12 years old using a simple real-life analogy. Break it into 3 clear bullet points.",
    completed: true,
    scoreAwarded: 20
  },
  {
    day: 2,
    caseStudyTitle: "Micro-Experiment 2: AI as Communication & Tone Editor",
    challenge: "Use AI to improve an existing piece of writing",
    questionPrompt: "Take an email, a message, or a proposal draft you recently wrote. Ask AI to polish it for clarity, brevity, and tone (e.g. concise, professional, or persuasive). Note the improvements.",
    newExperience: "Communication",
    category: "Writing Refinement",
    promptSuggestion: "Here is a rough message draft: '[Paste your draft here]'. Rewrite it in 2 distinct tones: 1) Short & direct for Slack/WhatsApp, 2) Polished & respectful for an official email.",
    completed: false
  },
  {
    day: 3,
    caseStudyTitle: "Micro-Experiment 3: AI as Planning & Scheduling Assistant",
    challenge: "Give AI a real planning problem",
    questionPrompt: "Give AI a realistic scheduling or organizational dilemma (e.g. 5 competing tasks across 2 days with limited time). Ask it to generate a time-blocked priority plan with buffer blocks.",
    newExperience: "Organization",
    category: "Time Blocking",
    promptSuggestion: "I have these 5 tasks to finish by Friday with limited hours: [List tasks]. Create a prioritized, time-blocked action plan considering high-impact vs low-effort.",
    completed: false
  },
  {
    day: 4,
    caseStudyTitle: "Micro-Experiment 4: Document Intelligence & Extraction",
    challenge: "Ask AI to analyze a sample document",
    questionPrompt: "Paste an article excerpt, policy document, or meeting notes into AI. Prompt AI to extract key takeaways, potential risks, and action items in under 150 words.",
    newExperience: "Information extraction",
    category: "Document Parsing",
    promptSuggestion: "Summarize the key decisions, actionable next steps, and potential blindspots from this text in under 150 words: [Paste text].",
    completed: false
  },
  {
    day: 5,
    caseStudyTitle: "Micro-Experiment 5: Structured Decision Matrix & Trade-offs",
    challenge: "Compare two alternatives using AI",
    questionPrompt: "Frame a real decision between two options (e.g. two tools, two career paths, or two product approaches). Ask AI to build a structured comparison matrix of pros, cons, and hidden trade-offs.",
    newExperience: "Decision-making",
    category: "Tradeoff Analysis",
    promptSuggestion: "Help me decide between Option A: [Option 1] and Option B: [Option 2]. Compare them on cost, effort, risk, and long-term value in a table format.",
    completed: false
  },
  {
    day: 6,
    caseStudyTitle: "Micro-Experiment 6: Verification & Hallucination Spotting",
    challenge: "Challenge an AI answer and verify it",
    questionPrompt: "Ask AI a question on a topic where you already know the facts or nuances. Probe its answer, push back with a counter-argument, and check whether it hallucinates or adjusts its logic.",
    newExperience: "Critical thinking",
    category: "Fact Checking",
    promptSuggestion: "You claimed [Statement]. Can you cite the verified source or rationale behind this? What are the strongest counter-arguments against your point?",
    completed: false
  },
  {
    day: 7,
    caseStudyTitle: "Micro-Experiment 7: Iteration & Solution Refinement",
    challenge: "Improve one solution you created in class",
    questionPrompt: "Take an artifact or prompt you created during Module 0 (or in earlier gym days) and run a 2nd iteration with deeper constraints, edge cases, and persona context to make it 2x better.",
    newExperience: "Iteration",
    category: "Continuous Refinement",
    promptSuggestion: "Here is my previous prompt and output: [Paste]. Help me elevate this to level 2: add edge case handling, role constraints, and output formatting.",
    completed: false
  }
];

// ─── MODULE 0 DRAWER ITEMS (Exact 1:1 match to media_1795517348125_8cc6c6b5.jpg) ───
const MODULE_0_DRAWER_ITEMS = [
  { index: 0, label: "1. AI", duration: "2 min" },
  { index: 1, label: "2. Imagine having an assista...", duration: "5 min" },
  { index: 2, label: "3. AI as your personal assist...", duration: "3 min" },
  { index: 3, label: "4. AI as your personal teach...", duration: "3 min" },
  { index: 4, label: "5. AI as your communication...", duration: "3 min" },
  { index: 5, label: "6. What did we just discover...", duration: "4 min" },
  { index: 6, label: "7. Now it's your turn! Don't j...", duration: "10 min" },
  { index: 7, label: "8. AI is not just a chatbot", duration: "5 min" },
  { index: 8, label: "9. Feed AI diverse modalitie...", duration: "5 min" },
  { index: 9, label: "10. Where can AI help in you...", duration: "5 min" },
  { index: 10, label: "11. Let's brainstorm together", duration: "5 min" },
  { index: 11, label: "12. The Big Question", duration: "5 min" },
  { index: 12, label: "13. Your First AI Commitment", duration: "5 min" },
  { index: 13, label: "14. Before we finish", duration: "5 min" }
];

// ─── TOP PEERS LEADERBOARD DATA (Exact match to media_1795517501723_eecef4ad.jpg) ───
const LEADERBOARD_PEERS = [
  { rank: 1, initials: 'AN', name: 'Ankitha G Nayaka', pts: 36, bg: '#fce7f3', color: '#be185d' },
  { rank: 2, initials: 'JM', name: 'Jiya Maikhuri', pts: 34, bg: '#e0f2fe', color: '#0284c7' },
  { rank: 3, initials: 'AS', name: 'Aditya Partap Singh', pts: 34, bg: '#dcfce7', color: '#16a34a' },
  { rank: 4, initials: 'SP', name: 'Sai Bharadwaj Pisipati', pts: 17, bg: '#ffedd5', color: '#ea580c' },
  { rank: 5, initials: 'ES', name: 'Errollu Srinivas', pts: 10, bg: '#f3e8ff', color: '#9333ea' },
  { rank: 6, initials: 'AA', name: 'Ananya Awasthi', pts: 4, bg: '#ccfbf1', color: '#0f766e' }
];

// ─── WEEKLY REMINDERS (Exact match to media_1795517501723_eecef4ad.jpg) ───
const WEEKLY_REMINDERS = [
  { title: 'Assignment Discussions', time: 'Wednesday 9:30-10:30 Pm' },
  { title: 'Root Cause Analysis', time: 'Saturday 3:30-5:00 Pm' },
  { title: 'User Interviews and Survey Creation', time: 'Sunday 12:30-2:00 PM' },
  { title: 'Spotify Segmentation and Hypothesis', time: 'Sunday 12:30 PM' },
  { title: 'PM Positioining - Recreation', time: '22 July' }
];

// ─── HELPER: EXTRACT HIGH-CLARITY PRESENTATION BULLETS (Matches media_1795506493984_2c4c823d.png) ───
const getSlideBullets = (slide: Module0Slide, lang: 'hindi' | 'english'): string[] => {
  const content = lang === 'hindi' ? slide.hindi : slide.english;
  if (content.bullets && content.bullets.length > 0) return content.bullets;
  
  if (lang === 'hindi') {
    switch (slide.slideNumber) {
      case 1:
        return [
          'Roz ke mushkil kaam aur padhai ko AI ki madad se aasan banayein',
          'Zero technical background required — curiosity is the only prerequisite',
          "Let's experiment! Pehle experience karo, phir mechanics samjho",
          'Aaj hum AI ko real tasks ke saath hands-on use karke dekhenge'
        ];
      case 2:
        return [
          'Difficult topics samjhane mein (school teacher ki tarah step-by-step)',
          'Emails aur presentations likhne mein (drafts ready in 10 seconds)',
          'Daily schedule organize karne mein (realistic priorities & buffer time)',
          'Naye ideas sochne mein (brainstorming & creative angles)',
          'Problems solve karne mein (tradeoffs, calculations & decisions)'
        ];
      case 3:
        return [
          'Sunday evening hai... Agla hafta kaafi busy hone wala hai',
          'Tasks: 4 din gym, Wednesday work presentation, groceries, 2 hours learning, 3 meetings, family time, electricity bill',
          'Challenge: Itne saare tasks ko burnout ke bina realistic schedule mein kaise organize karein?',
          'AI Solution: Instant priority-driven timetable with buffer times'
        ];
      case 4:
        return [
          'Shopping karte waqt discount samajhna hai: Shirt price ₹1,000, discount 20%',
          'Discount kitna hoga? Aapko kitne paise pay karne honge? Calculation kaise karoge?',
          'AI se sirf direct answer nahi, underlying concept step-by-step samjho',
          'Socratic method: AI school teacher ki tarah sikhata hai bina solution reveal kiye'
        ];
      case 5:
        return [
          'Situation: Project Wednesday tak complete nahi ho payega due to dependencies delay',
          'Goal: Manager ko inform karna — responsibility accept karna, delay explain karna, Friday deadline suggest karna',
          'Challenge: Professional sound karna hai, excuses nahi dene, aur trust maintain karna hai',
          'AI Advantage: 10 seconds mein polished first draft create ho jata hai'
        ];
      case 6:
        return [
          'Organize: Apna schedule aur weekly commitments efficiently plan karo',
          'Understand: Mushkil concepts aur naye subjects ko personalized bhasha mein seekho',
          'Communicate: High-stakes emails, reports aur presentation outlines structure karo',
          'Core Takeaway: AI aapka cognitive load reduce karta hai aur execution speed 5x badhata hai'
        ];
      case 7:
        return [
          '1. Apni real life se ek pressing problem identify karo (Student / Working Pro / Job Seeker)',
          '2. ChatGPT ya Claude open karo aur apni problem plain Hinglish/English mein explain karo',
          '3. AI ke response ko improve karne ke liye follow-up questions poochho',
          'Golden Rule: Perfect prompt ka wait mat karo. Problem se start karo!'
        ];
      case 8:
        return [
          '1. Images: Handwritten notes, whiteboards aur diagrams se text & checklist extract karo',
          '2. Documents: Long PDFs aur reports ko 2 minute mein bulleted summary mein convert karo',
          '3. Data: Excel spreadsheets se key revenue trends aur patterns automatically calculate karo',
          '4. Voice: Bolkar interact karo — rough thoughts ko prioritized action items banao'
        ];
      case 9:
        return [
          'Demo 1 (Image): Handwritten notes upload karke clear bullet summary aur action points banana',
          'Demo 2 (Document): Sample PDF upload karke top 5 key takeaways Hinglish mein nikalna',
          'Demo 3 (Data): Sales spreadsheet analyze karke top revenue drivers aur patterns dhoondna',
          'Demo 4 (Voice): Spoken raw thoughts ko structured execution plan mein convert karna'
        ];
      case 10:
        return [
          'Tasks I repeat: Main kaunsa kaam baar-baar karta/karti hoon? (Emails, reports, scheduling, meeting notes)',
          'Things I want to understand: Kaunsi cheez samajhne mein mushkil lagti hai? (Finance, tech jargon, English)',
          'Things I want to accomplish: Aisa kya hai jo start karna chahte ho? (Side project, portfolio, new skill)',
          'Your task: Har category mein kam se kam ek real example socho aur Activity Journal mein likho'
        ];
      case 11:
        return [
          'Problem vs AI Solution Matrix (Live Class Brainstorm):',
          'Interview preparation → AI mock interviews with instant rubrics and feedback',
          'English improve karni hai → Conversational roleplay and targeted grammar suggestions',
          'Presentation banani hai → Narrative storyline, slide outlines and talking cues',
          'Bank statement samajhna → Expense categorization and hidden subscription audits',
          'Business start karna hai → Validate value proposition & customer discovery questions'
        ];
      case 12:
        return [
          'The big question: How does a machine generate an intelligent response?',
          'Curiosity experiment: "The sun rises in the ______" → East!',
          'Aapko kaise pata chala ki agla word "East" hoga? Pattern & Context memory!',
          'Machine memory: Na Google search, na human conscious mind — mathematical probability prediction!',
          'Next-token prediction is the foundation of modern Large Language Models (LLMs)'
        ];
      case 13:
        return [
          'Your first AI commitment: Kal se AI ka use kis kaam ke liye karoge?',
          'Complete this sentence: “Ek cheez jiske liye main kal se AI use karna start karunga/karungi...”',
          'Write it down in your Activity Journal directly below this slide pane',
          'Share with your peer or mentor for accountability',
          'Start your 7-Day AI Gym streak tomorrow morning!'
        ];
      case 14:
        return [
          '1. Experiment karo: Perfect prompt ka wait mat karo. First draft se iterate karo',
          '2. Verify karo: AI ke answers ko blindly trust mat karo. Sanity-check and fact-check',
          '3. Think better: AI ko apni thinking replace karne nahi, thinking improve karne ke liye use karo',
          'Next Session Preview → The Anatomy of AI: Tokens, Context Windows & System Directives!'
        ];
      default:
        return [];
    }
  } else {
    switch (slide.slideNumber) {
      case 1:
        return [
          'Discover how AI can help you learn, work, and solve everyday problems',
          'Zero technical background required — curiosity is the only prerequisite',
          "Let's experiment! Experience the power first, understand the mechanics second",
          'Today we start by actually using AI on real-world situations hands-on'
        ];
      case 2:
        return [
          'Explaining difficult concepts (breaks down complex ideas with simple analogies)',
          'Writing emails and presentations (drafts polished text in seconds)',
          'Organizing daily schedules (allocates buffer time and realistic priorities)',
          'Brainstorming creative ideas (angles, hooks, and frameworks)',
          'Solving daily problems (tradeoffs, calculations, and decisions)'
        ];
      case 3:
        return [
          'Sunday evening... Upcoming week is jammed with conflicting commitments',
          'Tasks: 4 gym sessions, Wednesday presentation, groceries, 2 hrs study, 3 meetings, family time, bills',
          'Challenge: How do you fit all priorities without missing deadlines or burning out?',
          'AI Solution: Instant structured schedule with realistic buffer times'
        ];
      case 4:
        return [
          'Shopping problem: A shirt costs ₹1,000 with a 20% discount',
          'What is the discount amount? What do you pay? How do you calculate it?',
          'Key Insight: Use AI as a personalized tutor who explains the underlying concept step-by-step',
          'Socratic method: The model guides you to think through the solution rather than spoonfeeding answers'
        ];
      case 5:
        return [
          'Situation: Project will miss Wednesday deadline due to third-party dependencies',
          'Goal: Own responsibility, explain cause with clarity, propose Friday revised deadline',
          'Tone: Professional and constructive without sounding defensive or robotic',
          'AI Advantage: Transforms rough thoughts into an executive-ready message in 10 seconds'
        ];
      case 6:
        return [
          'Organize: Streamline your chaotic week with structured agendas',
          'Understand: Master complex ideas through personalized explanations',
          'Communicate: Produce clearer, higher-impact emails and presentations',
          'Core Takeaway: AI eliminates blank-page syndrome and accelerates execution speed by 5x'
        ];
      case 7:
        return [
          '1. Identify one real, pressing problem from your daily work or studies',
          '2. Open ChatGPT or Claude and describe your problem in natural plain language',
          '3. Ask iterative follow-up questions to refine and improve the response',
          'Golden Rule: Never wait for a perfect prompt. Start from the friction point and iterate!'
        ];
      case 8:
        return [
          '1. Images: Upload handwritten whiteboards, receipts or diagrams for instant extraction',
          '2. Documents: Upload lengthy PDFs and contracts for bulleted summaries and risk points',
          '3. Data: Upload spreadsheets to detect outliers, trends, and revenue drivers instantly',
          '4. Voice: Speak your rough, chaotic thoughts and get a structured execution plan'
        ];
      case 9:
        return [
          'Demo 1 (Image): Upload handwritten notes -> Generate simple summary and action checklist',
          'Demo 2 (Document): Upload sample PDF -> Extract top 5 takeaways and why they matter',
          'Demo 3 (Data): Upload spreadsheet -> Identify top performers and hidden growth patterns',
          'Demo 4 (Voice): Voice dictation -> Convert rambling voice thoughts into prioritized steps'
        ];
      case 10:
        return [
          'Tasks I repeat: What repetitive tasks consume your energy? (Emails, status reports, note-taking)',
          'Things I want to understand: What topics feel intimidating? (Financial metrics, tech stacks, concepts)',
          'Things I want to accomplish: What high-value goals have you delayed? (Side venture, portfolio, new skill)',
          'Action: Fill out at least one concrete example under each category in your Activity Journal below'
        ];
      case 11:
        return [
          'Problem vs AI Solution Matrix (Classroom Brainstorm):',
          'Interview preparation → Simulated mock interviews with immediate critique',
          'Improving English fluency → Conversational practice and real-time sentence polish',
          'Creating slide decks → Structural narrative outlines and executive summary points',
          'Understanding bank statements → Automated expense categorization and spending patterns',
          'Launching a new business → Value proposition stress-testing and customer research scripts'
        ];
      case 12:
        return [
          'The big question: How does an AI model actually generate intelligent text?',
          'Curiosity experiment: "The sun rises in the ______" → East!',
          'How did you know the next word is East? Probability based on language patterns and context!',
          'AI mechanics: It is neither a Google crawler nor conscious thought — it predicts the most probable next token',
          'Next-token prediction underpins modern generative AI and Large Language Models (LLMs)'
        ];
      case 13:
        return [
          'Your first AI commitment: What concrete task will you use AI for starting tomorrow?',
          'Complete this sentence: "One repetitive task I commit to executing with AI starting tomorrow is..."',
          'Record your commitment in the Activity Journal form below',
          'Share your pledge with the person next to you for peer accountability',
          'Kick off Day 1 of your 7-Day AI Gym Challenge tomorrow morning!'
        ];
      case 14:
        return [
          '1. Experiment boldly: Never wait for a perfect prompt. Iterate with follow-ups',
          '2. Verify rigorously: Never trust outputs blindly. Sanity-check facts, numbers, and logic',
          '3. Think better: Use AI to augment and elevate your own thinking, never to outsource it entirely',
          'Next Session Preview → The Anatomy of AI: Tokens, Context Windows, and Persona Directives!'
        ];
      default:
        return [];
    }
  }
};

interface AiBeginnersLmsProps {
  standaloneDeck?: boolean;
}

export default function AiBeginnersLms({ standaloneDeck = false }: AiBeginnersLmsProps) {
  // Navigation & Mode States
  const [activeNav, setActiveNav] = useState<MainNavTab>('home');
  const [courseSubTab, setCourseSubTab] = useState<CourseSubTab>('slides');
  const [currentMode, setCurrentMode] = useState<ModeType>('learner');
  const [slideLang, setSlideLang] = useState<SlideLang>('hindi');

  // Course view state: 'syllabus' (Course overview deck matching Screenshot 1) vs 'player' (Module slide player with Course Contents drawer matching Screenshot 2)
  const [courseViewMode, setCourseViewMode] = useState<'syllabus' | 'player'>('syllabus');
  const [week1Expanded, setWeek1Expanded] = useState<boolean>(true);
  const [drawerWeek1Open, setDrawerWeek1Open] = useState<boolean>(true);

  // Slide state: 0 to 13 (all 14 slides of Module 0)
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const currentSlide = MODULE_0_SLIDES[activeSlideIndex];

  // Activity Journal State (stored in localStorage)
  const [journalTask, setJournalTask] = useState(() => localStorage.getItem('ai_lms_j_task') || '');
  const [journalHelp, setJournalHelp] = useState(() => localStorage.getItem('ai_lms_j_help') || '');
  const [journalTimeBefore, setJournalTimeBefore] = useState(() => localStorage.getItem('ai_lms_j_before') || '');
  const [journalTimeWith, setJournalTimeWith] = useState(() => localStorage.getItem('ai_lms_j_with') || '');
  const [journalReusable, setJournalReusable] = useState<'yes' | 'no' | 'improve' | ''>(
    () => (localStorage.getItem('ai_lms_j_reuse') as any) || ''
  );
  const [journalSubmitted, setJournalSubmitted] = useState(() => localStorage.getItem('ai_lms_j_submitted') === 'true');

  // 7-Day Gym Challenges state
  const [gymChallenges, setGymChallenges] = useState<GymChallengeDay[]>(() => {
    const saved = localStorage.getItem('ai_lms_gym_challenges_v1');
    return saved ? JSON.parse(saved) : INITIAL_GYM_CHALLENGES;
  });

  // Gamification state
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('ai_lms_xp');
    return saved ? parseInt(saved, 10) : 145;
  });
  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('ai_lms_streak');
    return saved ? parseInt(saved, 10) : 3;
  });

  // UI Modals & Timer
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(currentSlide.durationMin * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showInstructorNotes, setShowInstructorNotes] = useState<boolean>(true);
  const [activeGymModalDay, setActiveGymModalDay] = useState<GymChallengeDay | null>(null);
  const [gymResponseInput, setGymResponseInput] = useState<string>('');

  // Fullscreen and Slide Pane Ref (Matches media_1795506493984_2c4c823d.png)
  const slidePaneRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullScreen = () => {
    if (!slidePaneRef.current) return;
    if (!document.fullscreenElement) {
      slidePaneRef.current.requestFullscreen().catch((err) => {
        console.log('Error enabling fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation for presentation slides (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setActiveSlideIndex(prev => Math.min(MODULE_0_SLIDES.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setActiveSlideIndex(prev => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Persist Gamification
  useEffect(() => {
    localStorage.setItem('ai_lms_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('ai_lms_streak', streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem('ai_lms_gym_challenges_v1', JSON.stringify(gymChallenges));
  }, [gymChallenges]);

  // Sync Timer when slide changes
  useEffect(() => {
    setTimerSeconds(currentSlide.durationMin * 60);
    setIsTimerRunning(false);
  }, [activeSlideIndex]);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      showToast('⏰ Time for this slide is up! Transition to next discussion.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('✓ Prompt copied! Paste into ChatGPT or Claude.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit Activity Journal
  const handleSubmitJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalTask.trim() || !journalHelp.trim() || !journalReusable) {
      alert('Please fill out all questions in the Activity Journal.');
      return;
    }
    localStorage.setItem('ai_lms_j_task', journalTask);
    localStorage.setItem('ai_lms_j_help', journalHelp);
    localStorage.setItem('ai_lms_j_before', journalTimeBefore);
    localStorage.setItem('ai_lms_j_with', journalTimeWith);
    localStorage.setItem('ai_lms_j_reuse', journalReusable);
    localStorage.setItem('ai_lms_j_submitted', 'true');
    setJournalSubmitted(true);
    setXp(prev => prev + 25);
    showToast('🎉 Activity Journal saved! Earned +25 XP');
  };

  // Complete Gym Day Challenge (20 XP if today's challenge; 8 XP if catch-up attempt for missed day)
  const handleCompleteGymDay = () => {
    if (!activeGymModalDay) return;
    const isToday = activeGymModalDay.day === TODAY_GYM_DAY;
    const pointsAwarded = isToday ? 20 : 8;

    const updated = gymChallenges.map(c =>
      c.day === activeGymModalDay.day ? { ...c, completed: true, scoreAwarded: pointsAwarded } : c
    );
    setGymChallenges(updated);
    setXp(prev => prev + pointsAwarded);
    if (isToday) {
      setStreakDays(prev => Math.min(7, prev + 1));
      showToast(`🔥 Day ${activeGymModalDay.day} Completed! +${pointsAwarded} XP awarded for today's challenge!`);
    } else {
      showToast(`⚡ Day ${activeGymModalDay.day} Completed (Catch-up)! +${pointsAwarded} XP awarded (missed day penalty applied).`);
    }
    setActiveGymModalDay(null);
    setGymResponseInput('');
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentContent = slideLang === 'hindi' ? currentSlide.hindi : currentSlide.english;
  const bulletsToRender = getSlideBullets(currentSlide, slideLang);

  // ─── STANDALONE DECK VIEW (For "Open in new tab" window) ───
  if (standaloneDeck) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', color: '#fff', maxWidth: '1100px', width: '100%', margin: '0 auto 1rem auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={styles.railBrandMark}>S</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>StepSmart Slide Deck</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Module 0: AI - Ab kaam karne ka tareeka badalne wala hai!</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={styles.langToggleBox}>
              <button
                type="button"
                onClick={() => setSlideLang('hindi')}
                style={{
                  ...styles.langToggleBtn,
                  ...(slideLang === 'hindi' ? styles.langToggleBtnActive : {})
                }}
              >
                🇮🇳 Hindi
              </button>
              <button
                type="button"
                onClick={() => setSlideLang('english')}
                style={{
                  ...styles.langToggleBtn,
                  ...(slideLang === 'english' ? styles.langToggleBtnActive : {})
                }}
              >
                🇬🇧 English
              </button>
            </div>

            <Link to="/ai-lms" style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ArrowLeft size={16} />
              <span>Back to LMS</span>
            </Link>
          </div>
        </div>

        {/* Center Slide Pane */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
          <div ref={slidePaneRef} style={styles.slideViewerOuterBezel}>
            {/* 16:9 Canvas */}
            <div style={styles.slideCanvas169}>
              <div style={styles.slideCanvasTopHeader}>
                <h2 style={styles.slideCanvasTitle}>{currentContent.heading}</h2>
                <span style={styles.slideBrandWatermark}>stepsmart</span>
              </div>

              {currentContent.subheading && (
                <div style={styles.slideCanvasSubheading}>{currentContent.subheading}</div>
              )}

              {bulletsToRender && bulletsToRender.length > 0 && (
                <ul style={styles.slideCanvasBulletList}>
                  {bulletsToRender.map((bullet, bIdx) => (
                    <li key={bIdx} style={styles.slideCanvasBulletItem}>
                      <span style={styles.slideCanvasBulletDot} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {currentContent.promptBox && (
                <div style={styles.slidePromptBox}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#027A9B', textTransform: 'uppercase' }}>
                      {currentContent.promptBox.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(currentContent.promptBox!.text, currentSlide.id)}
                      style={styles.copySmallBtn}
                    >
                      {copiedId === currentSlide.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedId === currentSlide.id ? 'Copied' : 'Copy Prompt'}</span>
                    </button>
                  </div>
                  <pre style={styles.promptPre}>{currentContent.promptBox.text}</pre>
                </div>
              )}

              {currentContent.table && (
                <div style={styles.slideTableContainer}>
                  <table style={styles.slideTable}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={styles.thCell}>Real-World Problem</th>
                        <th style={styles.thCell}>AI Ka Possible Solution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentContent.table.map((row, rIdx) => (
                        <tr key={rIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ ...styles.tdCell, fontWeight: 700, color: '#0f172a' }}>{row.problem}</td>
                          <td style={{ ...styles.tdCell, color: '#027A9B' }}>{row.solution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={styles.slideCanvasFooter}>
                <span style={styles.slideFooterCourseText}>Product Manager Fellowship · Systems Thinking & AI · Module 0</span>
                <span style={styles.slideFooterPageNum}>{activeSlideIndex + 1}</span>
              </div>
            </div>

            {/* Dark Bottom Bar */}
            <div style={styles.slidePlayerBottomBar}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button
                  type="button"
                  disabled={activeSlideIndex === 0}
                  onClick={() => setActiveSlideIndex(prev => Math.max(0, prev - 1))}
                  style={{ ...styles.slidePlayerArrowBtn, opacity: activeSlideIndex === 0 ? 0.35 : 1 }}
                  title="Previous Slide (←)"
                >
                  <ChevronLeft size={22} color="#ffffff" />
                </button>
                <span style={styles.slidePlayerCounterText}>{activeSlideIndex + 1} of {MODULE_0_SLIDES.length}</span>
                <button
                  type="button"
                  disabled={activeSlideIndex === MODULE_0_SLIDES.length - 1}
                  onClick={() => setActiveSlideIndex(prev => Math.min(MODULE_0_SLIDES.length - 1, prev + 1))}
                  style={{ ...styles.slidePlayerArrowBtn, opacity: activeSlideIndex === MODULE_0_SLIDES.length - 1 ? 0.35 : 1 }}
                  title="Next Slide (→)"
                >
                  <ChevronRight size={22} color="#ffffff" />
                </button>
              </div>

              <div style={{ position: 'absolute', right: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <button type="button" onClick={toggleFullScreen} style={styles.fullscreenIconBtn}>
                  {isFullscreen ? <Minimize2 size={16} color="#cbd5e1" /> : <Maximize2 size={16} color="#cbd5e1" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageRoot}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={styles.toast}>
          <Sparkles size={16} color="#f59e0b" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── PRIMARY LEFT SIDEBAR (Native StepSmart Blue Rail) ─── */}
      <aside style={styles.primaryLeftRail}>
        {/* Brand Logo Mark */}
        <Link to="/" style={styles.railBrandBox}>
          <div style={styles.railBrandMark}>S</div>
          <span style={styles.railBrandName}>StepSmart</span>
        </Link>

        {/* Nav Items Stack */}
        <div style={styles.railNavStack}>
          <button
            type="button"
            onClick={() => setActiveNav('home')}
            style={{
              ...styles.railNavBtn,
              ...(activeNav === 'home' ? styles.railNavBtnActive : {})
            }}
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('courses')}
            style={{
              ...styles.railNavBtn,
              ...(activeNav === 'courses' ? styles.railNavBtnActive : {})
            }}
          >
            <BookOpen size={18} />
            <span>Courses</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('gym')}
            style={{
              ...styles.railNavBtn,
              ...(activeNav === 'gym' ? styles.railNavBtnActive : {})
            }}
          >
            <Flame size={18} />
            <span>AI Gym (7 Days)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('prompts')}
            style={{
              ...styles.railNavBtn,
              ...(activeNav === 'prompts' ? styles.railNavBtnActive : {})
            }}
          >
            <Folder size={18} />
            <span>Prompt Library</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('assignments')}
            style={{
              ...styles.railNavBtn,
              ...(activeNav === 'assignments' ? styles.railNavBtnActive : {})
            }}
          >
            <ClipboardList size={18} />
            <span>Assignments</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('resources')}
            style={{
              ...styles.railNavBtn,
              ...(activeNav === 'resources' ? styles.railNavBtnActive : {})
            }}
          >
            <FileText size={18} />
            <span>Resources</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('sessions')}
            style={{
              ...styles.railNavBtn,
              ...(activeNav === 'sessions' ? styles.railNavBtnActive : {})
            }}
          >
            <Clock size={18} />
            <span>Sessions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('cohort')}
            style={{
              ...styles.railNavBtn,
              ...(activeNav === 'cohort' ? styles.railNavBtnActive : {})
            }}
          >
            <Users size={18} />
            <span>Cohort</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('profile')}
            style={{
              ...styles.railNavBtn,
              ...(activeNav === 'profile' ? styles.railNavBtnActive : {})
            }}
          >
            <Settings size={18} />
            <span>Profile</span>
          </button>
        </div>

        {/* Bottom Rail Actions */}
        <div style={styles.railBottomBox}>
          <button
            type="button"
            onClick={() => {
              setCurrentMode(currentMode === 'instructor' ? 'learner' : 'instructor');
              showToast(`Switched to ${currentMode === 'instructor' ? 'Learner' : 'Instructor'} Mode`);
            }}
            style={styles.openAdminBtn}
          >
            {currentMode === 'instructor' ? 'Learner Mode' : 'Open Instructor Mode'}
          </button>
          <div style={styles.signOutText}>Sign Out</div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT VIEW CONTAINER ─── */}
      <div style={styles.mainShell}>

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* VIEW 1: COURSES (SYLLABUS VIEW - SCREENSHOT 1)                */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeNav === 'courses' && courseViewMode === 'syllabus' && (
          <div style={styles.syllabusPageContainer}>
            
            {/* Top Eyebrow & Course Selector (Exact match to Screenshot 1) */}
            <div style={styles.syllabusTopRow}>
              <div>
                <div style={styles.myCoursesEyebrow}>MY COURSES</div>
                <h1 style={styles.courseMainTitle}>
                  AI Seekho, AI Apnao (Cohort 1)
                </h1>
                <p style={styles.courseSubTitle}>
                  Product Management & Everyday AI Foundations First Step Cohort 1
                </p>
              </div>

              {/* Course Switcher Pills */}
              <div style={styles.coursePillsRight}>
                <span style={styles.coursePillInactive}>PM -X Accelerator Batch 2</span>
                <span style={styles.coursePillActive}>PM -X First Step (Cohort 1)</span>
                <span style={styles.coursePillInactive}>Product Management</span>
              </div>
            </div>

            {/* Sub-tabs: Course Slides vs Live Sessions (Exact match to Screenshot 1) */}
            <div style={styles.syllabusSubTabsRow}>
              <button
                type="button"
                onClick={() => setCourseSubTab('slides')}
                style={{
                  ...styles.tabPillBtn,
                  ...(courseSubTab === 'slides' ? styles.tabPillBtnActive : {})
                }}
              >
                Course Slides
              </button>
              <button
                type="button"
                onClick={() => setCourseSubTab('videos')}
                style={{
                  ...styles.tabPillBtn,
                  ...(courseSubTab === 'videos' ? styles.tabPillBtnActive : {})
                }}
              >
                Live Sessions
              </button>
            </div>

            {/* Sub-tab 1: Course Slides Syllabus */}
            {courseSubTab === 'slides' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* ─── WEEK 1 ACCORDION CARD (Exact match to Screenshot 1) ─── */}
                <div style={styles.weekCardContainer}>
                  {/* Card Accordion Header */}
                  <div style={styles.weekCardHeader}>
                    <div>
                      <h2 style={styles.weekCardTitle}>
                        Week 1 – Product Foundations & Everyday AI
                      </h2>
                      <p style={styles.weekCardMeta}>
                        1 module • 14 slides • Activity Journal • {journalSubmitted ? '100% complete' : activeSlideIndex > 0 ? `${Math.round(((activeSlideIndex + 1) / 14) * 100)}% complete` : '0% complete'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={styles.completionPill}>
                        {journalSubmitted ? '100% complete' : activeSlideIndex > 0 ? `${Math.round(((activeSlideIndex + 1) / 14) * 100)}% complete` : '0% complete'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setWeek1Expanded(!week1Expanded)}
                        style={styles.collapseBtn}
                        title={week1Expanded ? 'Collapse' : 'Expand'}
                      >
                        {week1Expanded ? <Minus size={16} /> : <Plus size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Modules List inside Week 1 */}
                  {week1Expanded && (
                    <div style={styles.weekModulesList}>
                      {/* Single Module 0 (No 1.1, 1.2 individual fragmentation as instructed) */}
                      <div
                        onClick={() => setCourseViewMode('player')}
                        style={styles.moduleRowItem}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                          <div style={styles.modulePlayIconCircle}>
                            <Play size={16} fill="#027A9B" color="#027A9B" style={{ marginLeft: '2px' }} />
                          </div>
                          <div>
                            <div style={styles.moduleRowTitle}>
                              Module 0: AI - Ab kaam karne ka tareeka badalne wala hai!
                            </div>
                            <div style={styles.moduleRowDesc}>
                              14 Interactive Slides • Activity Journal • 75 Min Live Classroom Deck
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={styles.notStartedPill}>
                            {journalSubmitted ? 'Completed ✓' : activeSlideIndex > 0 ? `${activeSlideIndex + 1}/14 Viewed` : 'Not Started'}
                          </span>
                          <div style={styles.launchModuleBtn}>
                            <span>Open Slides</span>
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Week 2 Card (Locked preview) */}
                <div style={{ ...styles.weekCardContainer, opacity: 0.85 }}>
                  <div style={styles.weekCardHeader}>
                    <div>
                      <h2 style={{ ...styles.weekCardTitle, color: '#475569' }}>
                        Week 2 – Prompt Engineering & Thinking with AI
                      </h2>
                      <p style={styles.weekCardMeta}>
                        Releasing in Week 2 • Few-shot prompting, system personas & prompt formulas
                      </p>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.65rem', background: '#f1f5f9', borderRadius: '999px', color: '#64748b' }}>
                      Coming Soon 🔒
                    </span>
                  </div>
                </div>

                {/* Week 3 Card (Locked preview) */}
                <div style={{ ...styles.weekCardContainer, opacity: 0.85 }}>
                  <div style={styles.weekCardHeader}>
                    <div>
                      <h2 style={{ ...styles.weekCardTitle, color: '#475569' }}>
                        Week 3 – Everyday AI Automation & Document Workflows
                      </h2>
                      <p style={styles.weekCardMeta}>
                        Releasing in Week 3 • Excel formula generator, meeting notes & document analysis
                      </p>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.65rem', background: '#f1f5f9', borderRadius: '999px', color: '#64748b' }}>
                      Coming Soon 🔒
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* Sub-tab 2: Live Sessions */}
            {courseSubTab === 'videos' && (
              <div style={styles.videoTabContainer}>
                <div style={{ background: '#0f172a', borderRadius: '16px', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
                  <div style={styles.playCenterButton}>
                    <Play size={36} fill="#fff" color="#fff" style={{ marginLeft: '4px' }} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '1rem 0 0.35rem 0' }}>
                    Module 0 Classroom Live Session Recording
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                    Recorded masterclass stream will be uploaded here once the live offline session concludes.
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* VIEW 1B: MODULE PLAYER & ACTIVITY JOURNAL (SCREENSHOT 2)      */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeNav === 'courses' && courseViewMode === 'player' && (
          <div style={styles.playerLayoutRoot}>
            
            {/* ─── LEFT SUB-DRAWER: COURSE CONTENTS (Exact match to Screenshot 2) ─── */}
            <div style={styles.courseContentsDrawer}>
              <button
                type="button"
                onClick={() => setCourseViewMode('syllabus')}
                style={styles.backToCourseBtn}
              >
                <ChevronLeft size={16} />
                <span>← Back to course</span>
              </button>

              <h3 style={styles.courseContentsTitle}>Course Contents</h3>

              {/* Direct Module 0 slide items matching media_1795517348125_8cc6c6b5.jpg */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.75rem' }}>
                {MODULE_0_DRAWER_ITEMS.map((item) => {
                  const isActive = activeSlideIndex === item.index;
                  return (
                    <div
                      key={item.index}
                      onClick={() => setActiveSlideIndex(item.index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        background: isActive ? '#f0f9ff' : 'transparent',
                        borderLeft: isActive ? '4px solid #027A9B' : '4px solid transparent',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
                        <span style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: isActive ? '#027A9B' : '#94a3b8',
                          flexShrink: 0
                        }} />
                        <span style={{
                          fontSize: '0.82rem',
                          color: isActive ? '#027A9B' : '#334155',
                          fontWeight: isActive ? 700 : 500,
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}>
                          {item.label}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        color: isActive ? '#027A9B' : '#94a3b8',
                        fontWeight: isActive ? 600 : 400,
                        flexShrink: 0,
                        marginLeft: '0.5rem'
                      }}>
                        {item.duration}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── RIGHT MAIN CANVAS: SLIDE PRESENTATION & ACTIVITY JOURNAL ─── */}
            <div style={styles.playerMainCanvas}>
              
              {/* ─── SLIDE DECK TOP BAR (Matching media_1795506493984_2c4c823d.png) ─── */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
                    Slide Deck
                  </h1>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: 600 }}>
                    Module 0: AI - Ab kaam karne ka tareeka badalne wala hai!
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {/* Language Toggle: Hindi vs English */}
                  <div style={styles.langToggleBox}>
                    <button
                      type="button"
                      onClick={() => setSlideLang('hindi')}
                      style={{
                        ...styles.langToggleBtn,
                        ...(slideLang === 'hindi' ? styles.langToggleBtnActive : {})
                      }}
                    >
                      🇮🇳 Hindi
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlideLang('english')}
                      style={{
                        ...styles.langToggleBtn,
                        ...(slideLang === 'english' ? styles.langToggleBtnActive : {})
                      }}
                    >
                      🇬🇧 English
                    </button>
                  </div>

                  {/* Mode Indicator */}
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    background: currentMode === 'instructor' ? '#fee2e2' : '#e0f2fe',
                    color: currentMode === 'instructor' ? '#dc2626' : '#027a9b',
                    border: currentMode === 'instructor' ? '1px solid #fecaca' : '1px solid #bae6fd'
                  }}>
                    {currentMode === 'instructor' ? '👨‍🏫 INSTRUCTOR MODE' : '🎓 LEARNER MODE'}
                  </span>

                  {/* Open in new tab button matching Screenshot */}
                  <a
                    href="/ai-deck"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.openInNewTabBtn}
                  >
                    <span>Open in new tab</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* ─── THE SLIDE DECK PANE (Exact match to media_1795506493984_2c4c823d.png) ─── */}
              <div ref={slidePaneRef} style={styles.slideViewerOuterBezel}>
                {/* 16:9 Slide Canvas */}
                <div style={styles.slideCanvas169}>
                  {/* Top Header Row inside slide */}
                  <div style={styles.slideCanvasTopHeader}>
                    <h2 style={styles.slideCanvasTitle}>
                      {currentContent.heading}
                    </h2>
                    <span style={styles.slideBrandWatermark}>
                      stepsmart
                    </span>
                  </div>

                  {/* Subheading / Description if present */}
                  {currentContent.subheading && (
                    <div style={styles.slideCanvasSubheading}>
                      {currentContent.subheading}
                    </div>
                  )}

                  {/* Bullets List (Matching the clean bold bullets in media_1795506493984_2c4c823d.png) */}
                  {bulletsToRender && bulletsToRender.length > 0 && (
                    <ul style={styles.slideCanvasBulletList}>
                      {bulletsToRender.map((bullet, bIdx) => (
                        <li key={bIdx} style={styles.slideCanvasBulletItem}>
                          <span style={styles.slideCanvasBulletDot} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Prompt Box with 1-Click Copy */}
                  {currentContent.promptBox && (
                    <div style={styles.slidePromptBox}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#027A9B', textTransform: 'uppercase' }}>
                          {currentContent.promptBox.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(currentContent.promptBox!.text, currentSlide.id)}
                          style={styles.copySmallBtn}
                        >
                          {copiedId === currentSlide.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                          <span>{copiedId === currentSlide.id ? 'Copied' : 'Copy Prompt'}</span>
                        </button>
                      </div>
                      <pre style={styles.promptPre}>
                        {currentContent.promptBox.text}
                      </pre>
                    </div>
                  )}

                  {/* Table for Slide 11 */}
                  {currentContent.table && (
                    <div style={styles.slideTableContainer}>
                      <table style={styles.slideTable}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={styles.thCell}>Real-World Problem</th>
                            <th style={styles.thCell}>AI Ka Possible Solution</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentContent.table.map((row, rIdx) => (
                            <tr key={rIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ ...styles.tdCell, fontWeight: 700, color: '#0f172a' }}>{row.problem}</td>
                              <td style={{ ...styles.tdCell, color: '#027A9B' }}>{row.solution}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Discussion Callout */}
                  {currentContent.discussion && (
                    <div style={styles.slideDiscussionBox}>
                      <HelpCircle size={18} color="#027A9B" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, whiteSpace: 'pre-line' }}>
                        {currentContent.discussion}
                      </div>
                    </div>
                  )}

                  {/* Bottom Footer Row inside slide */}
                  <div style={styles.slideCanvasFooter}>
                    <span style={styles.slideFooterCourseText}>
                      Product Manager Fellowship · Systems Thinking & AI · Module 0
                    </span>
                    <span style={styles.slideFooterPageNum}>
                      {activeSlideIndex + 1}
                    </span>
                  </div>
                </div>

                {/* Dark Bottom Control Bar (< 5 of 45 > style matching media_1795506493984_2c4c823d.png) */}
                <div style={styles.slidePlayerBottomBar}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button
                      type="button"
                      disabled={activeSlideIndex === 0}
                      onClick={() => setActiveSlideIndex(prev => Math.max(0, prev - 1))}
                      style={{
                        ...styles.slidePlayerArrowBtn,
                        opacity: activeSlideIndex === 0 ? 0.35 : 1
                      }}
                      title="Previous Slide (←)"
                    >
                      <ChevronLeft size={22} color="#ffffff" />
                    </button>

                    <span style={styles.slidePlayerCounterText}>
                      {activeSlideIndex + 1} of {MODULE_0_SLIDES.length}
                    </span>

                    <button
                      type="button"
                      disabled={activeSlideIndex === MODULE_0_SLIDES.length - 1}
                      onClick={() => setActiveSlideIndex(prev => Math.min(MODULE_0_SLIDES.length - 1, prev + 1))}
                      style={{
                        ...styles.slidePlayerArrowBtn,
                        opacity: activeSlideIndex === MODULE_0_SLIDES.length - 1 ? 0.35 : 1
                      }}
                      title="Next Slide (→)"
                    >
                      <ChevronRight size={22} color="#ffffff" />
                    </button>
                  </div>

                  {/* Right controls inside dark bar */}
                  <div style={{ position: 'absolute', right: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={12} />
                      {currentSlide.instructorGuide.time}
                    </span>
                    <button
                      type="button"
                      onClick={toggleFullScreen}
                      style={styles.fullscreenIconBtn}
                      title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
                    >
                      {isFullscreen ? <Minimize2 size={16} color="#cbd5e1" /> : <Maximize2 size={16} color="#cbd5e1" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* ─── INSTRUCTOR PRIVATE PLAYBOOK (When Instructor Mode is Active) ─── */}
              {currentMode === 'instructor' && (
                <div style={styles.instructorPlaybookBox}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #fed7aa', paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ background: '#ea580c', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        INSTRUCTOR PLAYBOOK · PRIVATE
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#9a3412', fontWeight: 700 }}>
                        Slide {currentSlide.slideNumber} Guide ({currentSlide.instructorGuide.time})
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ background: '#fff', border: '1px solid #ea580c', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.78rem', fontWeight: 800, color: '#ea580c', fontFamily: 'monospace' }}>
                        ⏱️ {formatTimer(timerSeconds)}
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        style={{ ...styles.playTimerBtn, background: isTimerRunning ? '#dc2626' : '#16a34a' }}
                      >
                        {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
                        <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        🗣️ What to Say (Verbatim Teacher Cue):
                      </div>
                      <div style={styles.speechQuoteBox}>
                        {currentSlide.instructorGuide.sayScript}
                      </div>
                    </div>

                    <div style={{ background: '#fff7ed', padding: '0.65rem', borderRadius: '8px', border: '1px solid #ffedd5' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9a3412' }}>💡 Teaching Tip: </span>
                      <span style={{ fontSize: '0.825rem', color: '#7c2d12' }}>{currentSlide.instructorGuide.teachingTip}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                      <div style={{ background: '#ffffff', padding: '0.65rem', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#027a9b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          ❓ Questions to Ask Learners:
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#334155' }}>
                          {currentSlide.instructorGuide.questionsToAsk.map((q, idx) => (
                            <li key={idx} style={{ marginBottom: '0.15rem' }}>{q}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ background: '#ffffff', padding: '0.65rem', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          🎯 Expected Responses:
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#334155' }}>
                          {currentSlide.instructorGuide.expectedResponses.map((r, idx) => (
                            <li key={idx} style={{ marginBottom: '0.15rem' }}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── INTERACTIVE ACTIVITY JOURNAL (Placed directly below slides as requested) ─── */}
              <div style={styles.activityJournalContainer}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#027A9B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      CLASSROOM REFLECTION
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Complete this activity journal.
                    </h3>
                  </div>
                  {journalSubmitted && (
                    <span style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>
                      Submitted ✓ +25 XP Recorded
                    </span>
                  )}
                </div>

                <form onSubmit={handleSubmitJournal} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  {/* Q1 */}
                  <div>
                    <label style={styles.journalLabel}>
                      1. Which repetitive task did you select?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Drafting weekly client status email ya grocery list banana..."
                      value={journalTask}
                      onChange={(e) => setJournalTask(e.target.value)}
                      style={styles.journalInput}
                    />
                  </div>

                  {/* Q2 */}
                  <div>
                    <label style={styles.journalLabel}>
                      2. How did AI help you?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. 5 minutes mein structured template bana diya aur buffer time include kiya..."
                      value={journalHelp}
                      onChange={(e) => setJournalHelp(e.target.value)}
                      style={styles.journalTextarea}
                    />
                  </div>

                  {/* Q3 & Q4 in two columns */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={styles.journalLabel}>
                        3. How long did it take before using AI?
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 45 minutes"
                        value={journalTimeBefore}
                        onChange={(e) => setJournalTimeBefore(e.target.value)}
                        style={styles.journalInput}
                      />
                    </div>
                    <div>
                      <label style={styles.journalLabel}>
                        4. How long did it take with AI?
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 minutes"
                        value={journalTimeWith}
                        onChange={(e) => setJournalTimeWith(e.target.value)}
                        style={styles.journalInput}
                      />
                    </div>
                  </div>

                  {/* Q5: Radio buttons (Yes / No / Need to improve) */}
                  <div>
                    <label style={styles.journalLabel}>
                      5. Can you reuse this solution?
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      {[
                        { id: 'yes', label: 'Yes' },
                        { id: 'no', label: 'No' },
                        { id: 'improve', label: 'Need to improve' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setJournalReusable(opt.id as any)}
                          style={{
                            ...styles.radioOptionBtn,
                            ...(journalReusable === opt.id ? styles.radioOptionBtnActive : {})
                          }}
                        >
                          <span style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            border: journalReusable === opt.id ? '4px solid #027A9B' : '2px solid #cbd5e1',
                            background: '#fff'
                          }} />
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button type="submit" style={styles.primaryBtn}>
                      <Zap size={15} fill="#fff" />
                      <span>{journalSubmitted ? 'Update Activity Journal' : 'Save Journal & Earn +25 XP'}</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* VIEW 2: AI GYM (7-DAY CHALLENGE & STREAK TRACKER)             */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeNav === 'gym' && (
          <div style={styles.syllabusPageContainer}>
            
            {/* Header Banner */}
            <div style={styles.aiGymBanner}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                <img src="/pm_gym_brain.png" alt="Brain Mascot" style={{ width: '84px', height: '84px', objectFit: 'contain' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>StepSmart AI Gym</h2>
                    <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.6rem', borderRadius: '999px' }}>
                      7-DAY STREAK CHALLENGE
                    </span>
                  </div>
                  <p style={{ fontSize: '0.925rem', color: '#e0f2fe', margin: 0, maxWidth: '640px' }}>
                    Build your everyday AI intuition. Complete one micro-experiment daily to maintain your streak and earn +20 XP per drill.
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'center', color: '#fff', minWidth: '140px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Current Streak</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>🔥 {streakDays} / 7 Days</div>
              </div>
            </div>

            {/* 7-Day Table (Strictly from user brief) */}
            <div style={styles.gymTableCard}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem 0' }}>
                    Your 7-Day Micro-Challenge Roadmap
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    One practical exercise daily (20 XP on the active day · 8 XP catch-up if attempted later)
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                    Today: Day {TODAY_GYM_DAY} (20 XP)
                  </span>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                    {gymChallenges.filter(c => c.completed).length} / 7 Completed
                  </span>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={styles.slideTable}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={styles.thCell}>Day</th>
                      <th style={styles.thCell}>Case Study & Challenge</th>
                      <th style={styles.thCell}>New Experience</th>
                      <th style={styles.thCell}>Points</th>
                      <th style={styles.thCell}>Status</th>
                      <th style={styles.thCell}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gymChallenges.map((ch) => {
                      const isToday = ch.day === TODAY_GYM_DAY;
                      const isMissed = ch.day < TODAY_GYM_DAY && !ch.completed;
                      const rewardPoints = isToday ? 20 : 8;

                      return (
                        <tr key={ch.day} style={{ borderBottom: '1px solid #f1f5f9', background: isToday ? '#f0fdfa' : '#ffffff' }}>
                          <td style={{ ...styles.tdCell, fontWeight: 800, color: '#027A9B', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span>Day {ch.day}</span>
                              {isToday && (
                                <span style={{ background: '#027A9B', color: '#fff', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                                  TODAY
                                </span>
                              )}
                              {isMissed && (
                                <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                                  MISSED
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ ...styles.tdCell, maxWidth: '380px' }}>
                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                              {ch.caseStudyTitle}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                              {ch.challenge}
                            </div>
                          </td>
                          <td style={styles.tdCell}>
                            <span style={{ background: '#e0f2fe', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                              {ch.newExperience}
                            </span>
                          </td>
                          <td style={styles.tdCell}>
                            <span style={{
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              color: isToday ? '#027A9B' : '#64748b',
                              whiteSpace: 'nowrap'
                            }}>
                              {ch.completed ? `+${ch.scoreAwarded || rewardPoints} XP` : `${rewardPoints} XP`}
                            </span>
                          </td>
                          <td style={styles.tdCell}>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.6rem',
                              borderRadius: '999px',
                              background: ch.completed ? '#f0fdf4' : isToday ? '#e0f2fe' : '#f1f5f9',
                              color: ch.completed ? '#166534' : isToday ? '#0369a1' : '#64748b',
                              whiteSpace: 'nowrap'
                            }}>
                              {ch.completed ? `Completed (+${ch.scoreAwarded || rewardPoints} XP) ✓` : isToday ? 'Active Today' : 'Pending'}
                            </span>
                          </td>
                          <td style={styles.tdCell}>
                            <button
                              type="button"
                              onClick={() => setActiveGymModalDay(ch)}
                              style={{
                                border: isToday ? '1px solid #027A9B' : '1px solid #cbd5e1',
                                background: ch.completed ? '#f8fafc' : isToday ? '#027A9B' : '#ffffff',
                                color: ch.completed ? '#64748b' : isToday ? '#ffffff' : '#027A9B',
                                borderRadius: '6px',
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {ch.completed ? 'Review Drill' : isToday ? 'Solve Today (20 XP) ➜' : 'Solve Catch-up (8 XP) ➜'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* VIEW 3: PROMPT LIBRARY (Retaining the old flow of prompts)    */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeNav === 'prompts' && (
          <div style={styles.syllabusPageContainer}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={styles.myCoursesEyebrow}>STEP SMART REUSABLE REPO</div>
              <h1 style={styles.courseMainTitle}>Prompt Library</h1>
              <p style={styles.courseSubTitle}>Curated, tested bilingual prompts ready for 1-click copying.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {[
                {
                  id: 'p1',
                  category: 'Daily Life & Planning',
                  title: 'Weekly Busy Schedule Planner',
                  text: `Mera agla hafta kaafi busy hai. Mere paas ye tasks hain: gym 4 baar, Wednesday tak work presentation, groceries, 2 hours learning, 3 meetings, family time aur electricity bill. Mere liye ek realistic weekly schedule banao. Important tasks ko priority do, breaks aur buffer time bhi rakho.`
                },
                {
                  id: 'p2',
                  category: 'Learning & Skills',
                  title: 'Personal Teacher: 20% Discount Demonstration',
                  text: `Mujhe percentage samajhne mein difficulty hoti hai. Maan lo ek shirt ki price ₹1,000 hai aur uspe 20% discount mil raha hai. Mujhe bilkul basic level se samjhao ki discount kaise calculate karte hain. School teacher ki tarah step-by-step samjhana, ek simple real-life example dena aur end mein mujhe ek similar question solve karne ke liye dena.`
                },
                {
                  id: 'p3',
                  category: 'Workplace Communication',
                  title: 'Delicate Delay Email to Manager',
                  text: `Mujhe apne manager ko inform karna hai ki project Wednesday tak complete nahi ho payega kyunki kuch dependencies delay ho gayi hain. Ek short professional email draft karo jo responsibility accept kare, delay clearly explain kare, aur Friday ki revised deadline suggest kare.`
                },
                {
                  id: 'p4',
                  category: 'Multimodal AI',
                  title: 'Document & Bill Information Extractor',
                  text: `Maine ek document/photo attach kiya hai. Iska main summary 3 bullet points mein do, important deadline ya amount highlight karo, aur immediate next step suggest karo.`
                }
              ].map((p) => (
                <div key={p.id} style={styles.promptCardItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#027a9b', background: '#e0f2fe', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {p.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(p.text, p.id)}
                      style={styles.copySmallBtn}
                    >
                      {copiedId === p.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>{p.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic', margin: 0, lineHeight: 1.45 }}>"{p.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* VIEW 4: HOME DASHBOARD (Exact match to media_1795517501723_eecef4ad.jpg) */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeNav === 'home' && (
          <div style={styles.syllabusPageContainer}>
            
            {/* ─── PM GYM / AI GYM TOP BANNER ─── */}
            <div style={styles.dashboardGymBanner}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '320px' }}>
                <img
                  src="/pm_gym_brain.png"
                  alt="Brain Mascot"
                  style={{ width: '74px', height: '74px', objectFit: 'contain', flexShrink: 0 }}
                />
                <div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: '#ffffff', letterSpacing: '-0.01em' }}>
                    AI Gym
                  </h2>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e0f2fe', marginBottom: '0.35rem' }}>
                    [AI Micro-Experiment · Day 2 of 7: Communication]
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#f0fdfa', margin: 0, lineHeight: 1.45, opacity: 0.95, maxWidth: '640px' }}>
                    Use AI to improve an existing piece of writing. Paste an email, message, or draft into AI and prompt it to polish clarity, brevity, and tone. (+20 XP Today)
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    const todayChallenge = gymChallenges.find(c => c.day === TODAY_GYM_DAY) || gymChallenges[1];
                    setActiveGymModalDay(todayChallenge);
                  }}
                  style={styles.dashboardSolveBtn}
                >
                  Solve Challenge
                </button>

                {/* WEEKLY GOAL Days Indicator */}
                <div style={{ textAlign: 'center', color: '#ffffff' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem', color: '#e0f2fe' }}>
                    WEEKLY GOAL
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {[
                      { day: 'M', completed: true, active: false },
                      { day: 'T', completed: false, active: true },
                      { day: 'W', completed: false, active: false },
                      { day: 'Th', completed: false, active: false },
                      { day: 'F', completed: false, active: false },
                      { day: 'Sa', completed: false, active: false },
                      { day: 'Su', completed: false, active: false },
                    ].map((d, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: d.active ? 'rgba(255,255,255,0.3)' : d.completed ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                          border: d.active ? '1.5px solid #ffffff' : 'none',
                          color: '#ffffff',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}
                      >
                        {d.day}
                        {d.active && (
                          <span style={{
                            position: 'absolute',
                            bottom: '-6px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '14px',
                            height: '2px',
                            background: '#ffffff',
                            borderRadius: '2px'
                          }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── 4 METRIC CARDS (Exact match to media_1795517501723_eecef4ad.jpg) ─── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
              
              {/* Card 1: Lessons */}
              <div style={styles.metricCard}>
                <div style={styles.metricCardLabel}>Lessons</div>
                <div style={styles.metricCardValue}>2<span style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: 600 }}>/32</span></div>
                <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', margin: '0.65rem 0' }}>
                  <div style={{ width: '6.25%', height: '100%', background: '#027A9B', borderRadius: '2px' }} />
                </div>
                <div style={styles.metricCardFooter}>
                  <Clock size={12} color="#64748b" />
                  <span>1 lesson from 1.1</span>
                </div>
              </div>

              {/* Card 2: Assignments */}
              <div style={styles.metricCard}>
                <div style={styles.metricCardLabel}>Assignments</div>
                <div style={styles.metricCardValue}>0<span style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: 600 }}>/9</span></div>
                <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', margin: '0.65rem 0' }}>
                  <div style={{ width: '0%', height: '100%', background: '#64748b', borderRadius: '2px' }} />
                </div>
                <div style={styles.metricCardFooter}>
                  <Clock size={12} color="#64748b" />
                  <span>Submit soon</span>
                </div>
              </div>

              {/* Card 3: Streak */}
              <div style={styles.metricCard}>
                <div style={styles.metricCardLabel}>Streak</div>
                <div style={{ ...styles.metricCardValue, color: '#0f172a' }}>0 days</div>
                <div style={{ marginTop: '0.9rem', fontSize: '0.8rem', color: '#64748b' }}>
                  Total Streaks: <strong style={{ color: '#0f172a' }}>5 days</strong>
                </div>
              </div>

              {/* Card 4: Nov 2026 Daily Calendar */}
              <div style={{ ...styles.metricCard, padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#027A9B' }}>Nov 2026</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#027A9B' }}>Daily Calendar</span>
                </div>
                {/* Mini Calendar Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.65rem', color: '#64748b', fontWeight: 700, rowGap: '4px', columnGap: '2px' }}>
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
                  <span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span><span>14</span>
                  <span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span><span>21</span>
                  <span>22</span><span>23</span>
                  <span style={{
                    background: '#027A9B',
                    color: '#ffffff',
                    borderRadius: '50%',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    lineHeight: '18px',
                    margin: '0 auto',
                    display: 'inline-block'
                  }}>
                    24
                  </span>
                  <span>25</span><span>26</span><span>27</span><span>28</span>
                  <span>29</span><span>30</span>
                </div>
              </div>

            </div>

            {/* ─── LOWER SECTION: ACTIVE COURSE & REMINDERS (LEFT) vs TOP PEERS (RIGHT) ─── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(280px, 1fr)', gap: '1.25rem', marginTop: '1.25rem' }}>
              
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Active Course Card */}
                <div style={styles.dashboardWhiteCard}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                    ACTIVE COURSE: PM -X Accelerator Batch 2 (Week 1)
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#027A9B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
                    CONTINUE LEARNING
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.85rem 0' }}>
                    1.1 • Introduction to Production Management
                  </h3>

                  {/* Segmented Progress Bar (6 dashes) */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '1.15rem' }}>
                    {[1, 2, 3, 4, 5, 6].map((seg, idx) => (
                      <div
                        key={seg}
                        style={{
                          flex: 1,
                          height: '6px',
                          borderRadius: '3px',
                          background: idx < 2 ? '#027A9B' : '#e2e8f0'
                        }}
                      />
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('courses');
                        setCourseViewMode('player');
                      }}
                      style={styles.resumeLessonBtn}
                    >
                      <Play size={14} fill="#ffffff" color="#ffffff" />
                      <span>Resume Lesson</span>
                    </button>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Up next: 1.5 • Understanding Business Growth
                    </span>
                  </div>
                </div>

                {/* Weekly Reminder Card */}
                <div style={styles.dashboardWhiteCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Weekly Reminder
                    </h4>
                    <span style={{ fontSize: '1.1rem' }}>⏰</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {WEEKLY_REMINDERS.map((rem, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                        <span style={{ color: '#0f172a', fontWeight: 600 }}>• {rem.title}</span>
                        <span style={{ color: '#027A9B', fontWeight: 700, fontSize: '0.78rem' }}>{rem.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Top Peers Leaderboard */}
              <div style={styles.dashboardWhiteCard}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.15rem 0' }}>
                  Top Peers
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1.25rem 0' }}>
                  Track your performance against the cohort.
                </p>

                <div style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.86rem',
                  lineHeight: 1.5,
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px dashed #cbd5e1'
                }}>
                  Leaderboard points will appear after lessons and assignments are completed.
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ─── GYM DRILL MODAL (Shows 20 XP for today vs 8 XP for catch-up) ─── */}
      {activeGymModalDay && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: activeGymModalDay.day === TODAY_GYM_DAY ? '#027a9b' : '#b45309',
                  textTransform: 'uppercase',
                  background: activeGymModalDay.day === TODAY_GYM_DAY ? '#e0f2fe' : '#fef3c7',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px'
                }}>
                  {activeGymModalDay.day === TODAY_GYM_DAY
                    ? `DAY ${activeGymModalDay.day} DRILL · TODAY'S CHALLENGE (+20 XP)`
                    : `DAY ${activeGymModalDay.day} DRILL · CATCH-UP DRILL (+8 XP)`}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0 0' }}>
                  {activeGymModalDay.caseStudyTitle}
                </h3>
              </div>
              <button type="button" onClick={() => setActiveGymModalDay(null)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            {/* Question prompt */}
            <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.35rem' }}>
                Case Study Prompt:
              </div>
              <p style={{ fontSize: '0.88rem', color: '#0f172a', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>
                {activeGymModalDay.questionPrompt}
              </p>
            </div>

            {/* Suggested starting prompt */}
            <div style={{ background: '#f0f9ff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#027A9B', marginBottom: '0.2rem' }}>
                Suggested Starting Prompt:
              </div>
              <p style={{ fontSize: '0.85rem', color: '#0369a1', margin: 0, fontStyle: 'italic' }}>
                "{activeGymModalDay.promptSuggestion}"
              </p>
            </div>

            {/* Catch-up info callout if not today */}
            {activeGymModalDay.day !== TODAY_GYM_DAY && (
              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '0.55rem 0.75rem', borderRadius: '6px', marginBottom: '0.85rem', fontSize: '0.75rem', color: '#92400e' }}>
                ℹ️ <strong>Catch-up Mode:</strong> You are attempting this challenge after its active date. Solving it will award <strong>8 XP</strong> (reduced points) instead of 20 XP.
              </div>
            )}

            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Your Response / Solution:
            </label>
            <textarea
              rows={3}
              placeholder="Enter your market segmentation, target persona justification, or AI output analysis here..."
              value={gymResponseInput}
              onChange={(e) => setGymResponseInput(e.target.value)}
              style={styles.journalTextarea}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setActiveGymModalDay(null)} style={styles.secondaryBtn}>
                Cancel
              </button>
              <button type="button" onClick={handleCompleteGymDay} style={styles.primaryBtn}>
                <Zap size={14} fill="#fff" />
                <span>
                  {activeGymModalDay.day === TODAY_GYM_DAY
                    ? `Submit & Complete Day ${activeGymModalDay.day} (+20 XP)`
                    : `Submit Catch-up Day ${activeGymModalDay.day} (+8 XP)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── STYLES (Strict StepSmart Design System) ───
const styles: { [key: string]: React.CSSProperties } = {
  pageRoot: {
    minHeight: '100vh',
    background: '#f4f7fb',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: '#0f172a',
    display: 'flex'
  },
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: '#0f172a',
    color: '#ffffff',
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    zIndex: 9999
  },
  primaryLeftRail: {
    width: '210px',
    background: 'linear-gradient(180deg, #027A9B 0%, #015D77 100%)',
    color: '#ffffff',
    padding: '1.25rem 0.85rem',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    boxShadow: '2px 0 10px rgba(0,0,0,0.06)',
    minHeight: '100vh'
  },
  railBrandBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    textDecoration: 'none',
    color: '#fff',
    marginBottom: '2rem',
    paddingLeft: '0.4rem'
  },
  railBrandMark: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '1.05rem'
  },
  railBrandName: {
    fontSize: '1.15rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#ffffff'
  },
  railNavStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    marginBottom: 'auto'
  },
  railNavBtn: {
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.85)',
    padding: '0.65rem 0.85rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease'
  },
  railNavBtnActive: {
    background: 'rgba(255,255,255,0.22)',
    color: '#ffffff',
    fontWeight: 800,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)'
  },
  railBottomBox: {
    marginTop: 'auto',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255,255,255,0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  openAdminBtn: {
    background: 'rgba(255,255,255,0.16)',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '8px',
    padding: '0.55rem 0.75rem',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'center'
  },
  signOutText: {
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    cursor: 'pointer'
  },
  mainShell: {
    flex: 1,
    display: 'flex',
    overflowY: 'auto'
  },
  syllabusPageContainer: {
    flex: 1,
    padding: '2.5rem 3rem',
    maxWidth: '1200px',
    margin: '0 auto',
    boxSizing: 'border-box'
  },
  syllabusTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  myCoursesEyebrow: {
    fontSize: '0.72rem',
    fontWeight: 800,
    color: '#027a9b',
    letterSpacing: '0.06em',
    marginBottom: '0.35rem'
  },
  courseMainTitle: {
    fontSize: '1.85rem',
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 0.35rem 0',
    letterSpacing: '-0.02em'
  },
  courseSubTitle: {
    fontSize: '0.95rem',
    color: '#64748b',
    margin: 0
  },
  coursePillsRight: {
    display: 'flex',
    gap: '0.6rem',
    flexWrap: 'wrap'
  },
  coursePillInactive: {
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    color: '#475569',
    padding: '0.45rem 1rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer'
  },
  coursePillActive: {
    background: '#027a9b',
    color: '#ffffff',
    padding: '0.45rem 1.15rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 800,
    boxShadow: '0 2px 8px rgba(2, 122, 155, 0.25)'
  },
  syllabusSubTabsRow: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  tabPillBtn: {
    border: 'none',
    background: '#ffffff',
    color: '#64748b',
    padding: '0.55rem 1.25rem',
    borderRadius: '999px',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#cbd5e1'
  },
  tabPillBtnActive: {
    background: '#027a9b',
    color: '#ffffff',
    borderColor: '#027a9b'
  },
  slideHeaderAboveBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  moduleTagBadge: {
    background: '#027A9B',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 800,
    padding: '0.2rem 0.6rem',
    borderRadius: '6px'
  },
  slideHeaderTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0
  },
  langToggleBox: {
    background: '#e2e8f0',
    padding: '0.2rem',
    borderRadius: '8px',
    display: 'flex',
    gap: '0.2rem'
  },
  langToggleBtn: {
    border: 'none',
    background: 'transparent',
    padding: '0.35rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#475569',
    cursor: 'pointer'
  },
  langToggleBtnActive: {
    background: '#ffffff',
    color: '#027a9b',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  presentationSlideBox: {
    background: '#ffffff',
    border: '1.5px solid #cbd5e1',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 8px 30px rgba(15, 40, 80, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '520px'
  },
  slideCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1rem',
    marginBottom: '1.25rem'
  },
  slideCardItem: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column'
  },
  slideTableContainer: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '1.25rem'
  },
  slideTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem'
  },
  thCell: {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#475569',
    textTransform: 'uppercase'
  },
  tdCell: {
    padding: '0.85rem 1rem',
    color: '#1e293b',
    verticalAlign: 'top',
    lineHeight: 1.45
  },
  slidePromptBox: {
    background: '#f8fafc',
    border: '1.5px solid #e2e8f0',
    borderRadius: '14px',
    padding: '1.25rem',
    marginBottom: '1.25rem'
  },
  copySmallBtn: {
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '0.25rem 0.6rem',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#027a9b',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  promptPre: {
    margin: 0,
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    color: '#1e293b',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.55,
    background: '#ffffff',
    padding: '0.85rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  slideDiscussionBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    background: '#f0f9ff',
    borderLeft: '4px solid #027A9B',
    padding: '1rem',
    borderRadius: '0 10px 10px 0',
    marginBottom: '1.25rem'
  },
  slideBottomNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '1.25rem',
    borderTop: '1px solid #f1f5f9'
  },
  navBtn: {
    border: '1.5px solid #cbd5e1',
    background: '#ffffff',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontSize: '0.825rem',
    fontWeight: 700,
    color: '#0f172a',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  instructorPlaybookBox: {
    background: '#fff7ed',
    border: '2px solid #fdba74',
    borderRadius: '16px',
    padding: '1.25rem',
    marginTop: '1.25rem'
  },
  playTimerBtn: {
    border: 'none',
    color: '#fff',
    borderRadius: '6px',
    padding: '0.25rem 0.6rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  speechQuoteBox: {
    background: '#ffffff',
    borderLeft: '4px solid #ea580c',
    padding: '0.85rem 1rem',
    borderRadius: '0 8px 8px 0',
    fontSize: '0.875rem',
    color: '#7c2d12',
    lineHeight: 1.5,
    fontStyle: 'italic'
  },
  activityJournalContainer: {
    background: '#ffffff',
    border: '1.5px solid #bae6fd',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(2, 122, 155, 0.06)'
  },
  journalLabel: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 800,
    color: '#0f172a',
    marginBottom: '0.35rem'
  },
  journalInput: {
    width: '100%',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  journalTextarea: {
    width: '100%',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  radioOptionBtn: {
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#334155',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  radioOptionBtnActive: {
    borderColor: '#027A9B',
    background: '#f0f9ff',
    color: '#027A9B'
  },
  primaryBtn: {
    border: 'none',
    background: '#027a9b',
    color: '#ffffff',
    borderRadius: '999px',
    padding: '0.6rem 1.4rem',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    boxShadow: '0 4px 12px rgba(2, 122, 155, 0.25)'
  },
  videoTabContainer: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    padding: '2rem'
  },
  playCenterButton: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(2, 122, 155, 0.9)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
    cursor: 'pointer'
  },
  dashboardGymBanner: {
    background: 'linear-gradient(90deg, #015D77 0%, #027A9B 100%)',
    borderRadius: '12px',
    padding: '1.35rem 1.75rem',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
    boxShadow: '0 4px 15px rgba(2, 122, 155, 0.15)'
  },
  dashboardSolveBtn: {
    background: '#ffffff',
    color: '#027A9B',
    border: 'none',
    borderRadius: '999px',
    padding: '0.65rem 1.5rem',
    fontSize: '0.875rem',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.15s ease'
  },
  metricCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '1.15rem 1.25rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  metricCardLabel: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#64748b',
    marginBottom: '0.35rem'
  },
  metricCardValue: {
    fontSize: '1.65rem',
    fontWeight: 800,
    color: '#0f172a'
  },
  metricCardFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    color: '#64748b',
    marginTop: 'auto'
  },
  dashboardWhiteCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '1.35rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
  },
  resumeLessonBtn: {
    background: '#027A9B',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.6rem 1.25rem',
    fontSize: '0.85rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(2, 122, 155, 0.2)'
  },
  aiGymBanner: {
    background: 'linear-gradient(135deg, #027A9B 0%, #015D77 100%)',
    borderRadius: '20px',
    padding: '1.5rem 2rem',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 8px 24px rgba(2, 122, 155, 0.18)',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  gymSolveBtn: {
    background: '#ffffff',
    color: '#027A9B',
    border: 'none',
    borderRadius: '999px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.875rem',
    fontWeight: 800,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem'
  },
  gymTableCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    marginTop: '1.5rem',
    boxShadow: '0 2px 12px rgba(15, 40, 80, 0.04)',
    overflow: 'hidden'
  },
  promptCardItem: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '1.25rem',
    boxShadow: '0 4px 16px rgba(15, 40, 80, 0.03)'
  },
  statCard: {
    background: '#ffffff',
    border: '1px solid rgba(20, 49, 86, 0.08)',
    borderRadius: '18px',
    padding: '1.25rem 1.5rem',
    boxShadow: '0 4px 16px rgba(15, 40, 80, 0.03)'
  },
  statCardLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#64748b',
    letterSpacing: '0.04em',
    marginBottom: '0.35rem'
  },
  statCardValue: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.02em',
    marginBottom: '0.2rem'
  },
  statCardMeta: {
    fontSize: '0.775rem',
    color: '#94a3b8'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    zIndex: 1000
  },
  modalCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '1.75rem',
    maxWidth: '520px',
    width: '100%',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    boxSizing: 'border-box'
  },
  closeBtn: {
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    cursor: 'pointer'
  },
  secondaryBtn: {
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    borderRadius: '999px',
    padding: '0.55rem 1.25rem',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#475569',
    cursor: 'pointer'
  },
  // Week Accordion Card (Screenshot 1)
  weekCardContainer: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(15, 40, 80, 0.04)',
    overflow: 'hidden',
    marginBottom: '1rem'
  },
  weekCardHeader: {
    padding: '1.25rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff',
    borderBottom: '1px solid #f1f5f9'
  },
  weekCardTitle: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 0.25rem 0'
  },
  weekCardMeta: {
    fontSize: '0.825rem',
    color: '#64748b',
    margin: 0
  },
  completionPill: {
    fontSize: '0.75rem',
    fontWeight: 800,
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    background: '#e0f2fe',
    color: '#027a9b',
    border: '1px solid #bae6fd'
  },
  collapseBtn: {
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    borderRadius: '8px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b'
  },
  weekModulesList: {
    padding: '0.25rem 0'
  },
  moduleRowItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.15rem 1.5rem',
    borderBottom: '1px solid #f8fafc',
    cursor: 'pointer',
    transition: 'background 0.15s ease'
  },
  modulePlayIconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#e0f2fe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  moduleRowTitle: {
    fontSize: '0.975rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '0.2rem'
  },
  moduleRowDesc: {
    fontSize: '0.825rem',
    color: '#64748b'
  },
  notStartedPill: {
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '0.25rem 0.65rem',
    borderRadius: '999px',
    background: '#f1f5f9',
    color: '#475569'
  },
  launchModuleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.825rem',
    fontWeight: 800,
    color: '#027a9b'
  },
  // Player View Layout (Screenshot 2)
  playerLayoutRoot: {
    display: 'flex',
    flex: 1,
    minHeight: '100vh',
    background: '#f4f7fb'
  },
  courseContentsDrawer: {
    width: '300px',
    background: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    padding: '1.25rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    overflowY: 'auto',
    maxHeight: '100vh'
  },
  backToCourseBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    border: 'none',
    background: 'transparent',
    color: '#027a9b',
    fontSize: '0.825rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: '1rem',
    padding: 0
  },
  courseContentsTitle: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 1rem 0'
  },
  drawerWeekAccordion: {
    marginBottom: '0.75rem'
  },
  drawerWeekHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0.65rem',
    borderRadius: '8px',
    cursor: 'pointer',
    background: '#f8fafc',
    marginBottom: '0.35rem'
  },
  drawerSlidesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    paddingLeft: '0.35rem'
  },
  drawerActiveModuleBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    fontSize: '0.78rem',
    fontWeight: 800,
    color: '#027a9b',
    padding: '0.4rem 0.6rem',
    borderRadius: '6px',
    background: '#e0f2fe',
    marginBottom: '0.35rem'
  },
  drawerSlideRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.45rem 0.65rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  drawerSlideRowActive: {
    background: '#f0f9ff',
    borderLeft: '3px solid #027a9b',
    paddingLeft: '0.55rem'
  },
  playerMainCanvas: {
    flex: 1,
    padding: '2rem 2.5rem',
    maxWidth: '1100px',
    overflowY: 'auto'
  },
  // Slide Viewer Bezel (Exact match to uploaded media_1795506493984_2c4c823d.png)
  slideViewerOuterBezel: {
    background: '#23272e',
    border: '2px solid #1a1d23',
    borderRadius: '16px',
    boxShadow: '0 12px 36px rgba(0,0,0,0.22)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1.5rem',
    position: 'relative'
  },
  slideCanvas169: {
    background: '#ffffff',
    margin: '12px 12px 0 12px',
    borderRadius: '8px',
    padding: '2.5rem 3.25rem',
    minHeight: '450px',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
  },
  slideCanvasTopHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.25rem',
    gap: '1rem'
  },
  slideCanvasTitle: {
    fontSize: '1.85rem',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.025em',
    lineHeight: 1.25
  },
  slideBrandWatermark: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '-0.01em',
    flexShrink: 0,
    marginTop: '4px'
  },
  slideCanvasSubheading: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#027a9b',
    marginBottom: '1.25rem',
    lineHeight: 1.45
  },
  slideCanvasBulletList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 1.25rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.95rem'
  },
  slideCanvasBulletItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.85rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#1e293b',
    lineHeight: 1.55
  },
  slideCanvasBulletDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#0f172a',
    marginTop: '0.55rem',
    flexShrink: 0
  },
  slideCanvasFooter: {
    marginTop: 'auto',
    paddingTop: '1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.78rem',
    color: '#94a3b8',
    fontWeight: 600
  },
  slideFooterCourseText: {
    color: '#64748b',
    letterSpacing: '0.02em'
  },
  slideFooterPageNum: {
    fontWeight: 800,
    color: '#0f172a'
  },
  slidePlayerBottomBar: {
    background: '#111827',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '0 1.25rem'
  },
  slidePlayerArrowBtn: {
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    padding: '0.35rem 0.65rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'background 0.15s ease'
  },
  slidePlayerCounterText: {
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: 700,
    minWidth: '70px',
    textAlign: 'center',
    userSelect: 'none'
  },
  fullscreenIconBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  openInNewTabBtn: {
    background: '#0f172a',
    color: '#ffffff',
    padding: '0.55rem 1.15rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 700,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    transition: 'all 0.15s ease',
    cursor: 'pointer',
    border: 'none'
  }
};
