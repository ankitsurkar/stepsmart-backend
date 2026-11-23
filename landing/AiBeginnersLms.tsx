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
  RefreshCw
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
  challenge: string;
  newExperience: string;
  category: string;
  promptSuggestion: string;
  completed: boolean;
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

// ─── 7-DAY AI GYM CHALLENGES (Exact table provided by user) ───
const INITIAL_GYM_CHALLENGES: GymChallengeDay[] = [
  {
    day: 1,
    challenge: "Ask AI to explain something you don't understand",
    newExperience: "Learning",
    category: "Concept Breakdown",
    promptSuggestion: "Mujhe [Topic] bilkul basic level se school teacher ki tarah step-by-step samjhao.",
    completed: true
  },
  {
    day: 2,
    challenge: "Use AI to improve an existing piece of writing",
    newExperience: "Communication",
    category: "Tone Polish",
    promptSuggestion: "Mera ye draft message padho aur ise zyada polite, professional aur clear banao.",
    completed: true
  },
  {
    day: 3,
    challenge: "Give AI a real planning problem",
    newExperience: "Organization",
    category: "Schedule & Buffers",
    promptSuggestion: "Mera agla hafta kaafi busy hai. Mere in 5 tasks ke liye realistic buffer time ke saath schedule banao.",
    completed: true
  },
  {
    day: 4,
    challenge: "Ask AI to analyze a sample document",
    newExperience: "Information extraction",
    category: "Document Parsing",
    promptSuggestion: "Is sample document ya bill ka 3 clear bullet points mein summary do aur key dates highlight karo.",
    completed: false
  },
  {
    day: 5,
    challenge: "Compare two alternatives using AI",
    newExperience: "Decision-making",
    category: "Tradeoff Analysis",
    promptSuggestion: "Option A aur Option B ke pros, cons aur long-term tradeoffs compare karke recommendation do.",
    completed: false
  },
  {
    day: 6,
    challenge: "Challenge an AI answer and verify it",
    newExperience: "Critical thinking",
    category: "Fact Checking",
    promptSuggestion: "Kya ye fact bilkul accurate hai? Iska source ya reasoning verify karke batao.",
    completed: false
  },
  {
    day: 7,
    challenge: "Improve one solution you created in class",
    newExperience: "Iteration",
    category: "Reusable Template",
    promptSuggestion: "Maine class mein jo task solve kiya tha, use ek 1-click reusable template mein convert karo.",
    completed: false
  }
];

export default function AiBeginnersLms() {
  // Navigation & Mode States
  const [activeNav, setActiveNav] = useState<MainNavTab>('courses');
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

  // Complete Gym Day Challenge
  const handleCompleteGymDay = () => {
    if (!activeGymModalDay) return;
    const updated = gymChallenges.map(c =>
      c.day === activeGymModalDay.day ? { ...c, completed: true } : c
    );
    setGymChallenges(updated);
    setXp(prev => prev + 20);
    setStreakDays(prev => Math.min(7, prev + 1));
    showToast(`🔥 Day ${activeGymModalDay.day} Gym Challenge complete! +20 XP`);
    setActiveGymModalDay(null);
    setGymResponseInput('');
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentContent = slideLang === 'hindi' ? currentSlide.hindi : currentSlide.english;

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

              {/* Week 1 Accordion */}
              <div style={styles.drawerWeekAccordion}>
                <div
                  onClick={() => setDrawerWeek1Open(!drawerWeek1Open)}
                  style={styles.drawerWeekHeader}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Folder size={16} color="#027A9B" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Week 1</span>
                  </div>
                  {drawerWeek1Open ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                </div>

                {drawerWeek1Open && (
                  <div style={styles.drawerSlidesList}>
                    {/* Active Module Banner */}
                    <div style={styles.drawerActiveModuleBanner}>
                      <Play size={12} fill="#027A9B" color="#027A9B" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Module 0: AI - Ab kaam karne ka tareeka...
                      </span>
                    </div>

                    {/* All 14 Slides Navigation */}
                    {MODULE_0_SLIDES.map((slide, sIdx) => (
                      <div
                        key={slide.id}
                        onClick={() => setActiveSlideIndex(sIdx)}
                        style={{
                          ...styles.drawerSlideRow,
                          ...(activeSlideIndex === sIdx ? styles.drawerSlideRowActive : {})
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                          <span style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: activeSlideIndex === sIdx ? '#027A9B' : '#94a3b8',
                            flexShrink: 0
                          }} />
                          <span style={{
                            fontSize: '0.78rem',
                            color: activeSlideIndex === sIdx ? '#027A9B' : '#334155',
                            fontWeight: activeSlideIndex === sIdx ? 800 : 500,
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden'
                          }}>
                            {slide.slideNumber}. {slide.english.heading.split(':')[0]}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8', flexShrink: 0 }}>
                          {slide.instructorGuide.time}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Week 2 Preview (Collapsed) */}
              <div style={styles.drawerWeekAccordion}>
                <div style={{ ...styles.drawerWeekHeader, opacity: 0.65 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Folder size={16} color="#94a3b8" />
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Week 2: Prompt Mastery</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Soon</span>
                </div>
              </div>

              {/* Week 3 Preview (Collapsed) */}
              <div style={styles.drawerWeekAccordion}>
                <div style={{ ...styles.drawerWeekHeader, opacity: 0.65 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Folder size={16} color="#94a3b8" />
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Week 3: AI Automation</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Soon</span>
                </div>
              </div>
            </div>

            {/* ─── RIGHT MAIN CANVAS: SLIDE PRESENTATION & ACTIVITY JOURNAL ─── */}
            <div style={styles.playerMainCanvas}>
              
              {/* Heading of the slide (Exact match to Screenshot 2 heading style) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
                  {currentContent.heading}
                </h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                    Module 0 · Slide {currentSlide.slideNumber} of 14 · {currentSlide.timeRange}
                  </span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  
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
                      🇮🇳 Hindi (Hinglish)
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
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    background: currentMode === 'instructor' ? '#fee2e2' : '#e0f2fe',
                    color: currentMode === 'instructor' ? '#dc2626' : '#027a9b',
                    border: currentMode === 'instructor' ? '1px solid #fecaca' : '1px solid #bae6fd'
                  }}>
                    {currentMode === 'instructor' ? '👨‍🏫 INSTRUCTOR MODE' : '🎓 LEARNER MODE'}
                  </span>
                </div>
              </div>

              {/* ─── THE BIG SLIDE PRESENTATION BOX (Matches attached deck) ─── */}
              <div style={styles.presentationSlideBox}>
                
                {/* Top Slide Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#027A9B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    PM-X · Module 0 · Discover the power of AI
                  </span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {MODULE_0_SLIDES.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setActiveSlideIndex(dotIdx)}
                        style={{
                          width: activeSlideIndex === dotIdx ? '18px' : '7px',
                          height: '7px',
                          borderRadius: '999px',
                          background: activeSlideIndex === dotIdx ? '#027A9B' : '#cbd5e1',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Main Slide Title & Subtitle */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
                    {currentContent.heading}
                  </h3>
                  <p style={{ fontSize: '1.05rem', color: '#027A9B', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
                    {currentContent.subheading}
                  </p>
                  {currentContent.description && (
                    <p style={{ fontSize: '0.925rem', color: '#475569', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                      {currentContent.description}
                    </p>
                  )}
                </div>

                {/* Slide Cards Grid */}
                {currentContent.cards && currentContent.cards.length > 0 && (
                  <div style={styles.slideCardsGrid}>
                    {currentContent.cards.map((c, cIdx) => (
                      <div key={cIdx} style={styles.slideCardItem}>
                        <div style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>{c.icon}</div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.45 }}>
                          {c.desc}
                        </div>
                      </div>
                    ))}
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

                {/* Discussion Callout */}
                {currentContent.discussion && (
                  <div style={styles.slideDiscussionBox}>
                    <HelpCircle size={18} color="#027A9B" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, whiteSpace: 'pre-line' }}>
                      {currentContent.discussion}
                    </div>
                  </div>
                )}

                {/* Slide Bottom Controls */}
                <div style={styles.slideBottomNav}>
                  <button
                    type="button"
                    disabled={activeSlideIndex === 0}
                    onClick={() => setActiveSlideIndex(prev => Math.max(0, prev - 1))}
                    style={{
                      ...styles.navBtn,
                      opacity: activeSlideIndex === 0 ? 0.35 : 1
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous Slide</span>
                  </button>

                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}>
                    Slide {activeSlideIndex + 1} of 14
                  </div>

                  <button
                    type="button"
                    disabled={activeSlideIndex === MODULE_0_SLIDES.length - 1}
                    onClick={() => setActiveSlideIndex(prev => Math.min(MODULE_0_SLIDES.length - 1, prev + 1))}
                    style={{
                      ...styles.navBtn,
                      opacity: activeSlideIndex === MODULE_0_SLIDES.length - 1 ? 0.35 : 1
                    }}
                  >
                    <span>Next Slide</span>
                    <ChevronRight size={16} />
                  </button>
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
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem 0' }}>
                    Your 7-Day Micro-Challenge Roadmap
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    One practical exercise each day with a distinct learning goal
                  </div>
                </div>
                <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                  {gymChallenges.filter(c => c.completed).length} / 7 Completed
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={styles.slideTable}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={styles.thCell}>Day</th>
                      <th style={styles.thCell}>Challenge</th>
                      <th style={styles.thCell}>New Experience</th>
                      <th style={styles.thCell}>Status</th>
                      <th style={styles.thCell}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gymChallenges.map((ch) => (
                      <tr key={ch.day} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ ...styles.tdCell, fontWeight: 800, color: '#027A9B' }}>
                          Day {ch.day}
                        </td>
                        <td style={{ ...styles.tdCell, fontWeight: 700, color: '#0f172a' }}>
                          {ch.challenge}
                        </td>
                        <td style={styles.tdCell}>
                          <span style={{ background: '#e0f2fe', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            {ch.newExperience}
                          </span>
                        </td>
                        <td style={styles.tdCell}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            background: ch.completed ? '#f0fdf4' : '#f1f5f9',
                            color: ch.completed ? '#166534' : '#64748b'
                          }}>
                            {ch.completed ? 'Completed ✓' : 'Pending'}
                          </span>
                        </td>
                        <td style={styles.tdCell}>
                          <button
                            type="button"
                            onClick={() => setActiveGymModalDay(ch)}
                            style={{
                              border: '1px solid #cbd5e1',
                              background: ch.completed ? '#f8fafc' : '#ffffff',
                              color: ch.completed ? '#64748b' : '#027A9B',
                              borderRadius: '6px',
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {ch.completed ? 'Review Drill' : 'Start Drill ➜'}
                          </button>
                        </td>
                      </tr>
                    ))}
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
        {/* VIEW 4: HOME DASHBOARD                                        */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeNav === 'home' && (
          <div style={styles.syllabusPageContainer}>
            <div style={styles.aiGymBanner}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                <img src="/pm_gym_brain.png" alt="Brain" style={{ width: '84px', height: '84px', objectFit: 'contain' }} />
                <div>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#ffffff' }}>AI Gym</h2>
                  <p style={{ fontSize: '0.925rem', color: '#e0f2fe', margin: 0 }}>
                    Active 7-Day Streak Challenge: Day {streakDays} of 7. Keep your learning momentum alive!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveNav('gym')}
                style={styles.gymSolveBtn}
              >
                <span>Open 7-Day Gym ➜</span>
              </button>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div style={styles.statCard}>
                <div style={styles.statCardLabel}>Active Module</div>
                <div style={styles.statCardValue}>Module 0</div>
                <div style={styles.statCardMeta}>AI: Ab kaam karne ka tareeka badalne wala hai!</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statCardLabel}>Day Streak</div>
                <div style={{ ...styles.statCardValue, color: '#f59e0b' }}>🔥 {streakDays} Days</div>
                <div style={styles.statCardMeta}>Active in offline cohort</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statCardLabel}>Total XP</div>
                <div style={{ ...styles.statCardValue, color: '#10b981' }}>⚡ {xp} XP</div>
                <div style={styles.statCardMeta}>Level 2: AI Explorer</div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ─── GYM DRILL MODAL ─── */}
      {activeGymModalDay && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#027a9b', textTransform: 'uppercase' }}>
                  DAY {activeGymModalDay.day} DRILL · {activeGymModalDay.newExperience}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0 0 0' }}>
                  {activeGymModalDay.challenge}
                </h3>
              </div>
              <button type="button" onClick={() => setActiveGymModalDay(null)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.2rem' }}>
                Suggested Starting Prompt:
              </div>
              <p style={{ fontSize: '0.85rem', color: '#027A9B', margin: 0, fontStyle: 'italic' }}>
                "{activeGymModalDay.promptSuggestion}"
              </p>
            </div>

            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Your Response / Discovery:
            </label>
            <textarea
              rows={3}
              placeholder="Maine AI par ye prompt run kiya aur mujhe ye output mila..."
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
                <span>Mark Day {activeGymModalDay.day} Complete (+20 XP)</span>
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
  }
};
