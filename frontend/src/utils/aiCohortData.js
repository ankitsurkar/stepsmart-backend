// AI Cohort Shared Data & Utilities for StepSmart LMS
export const MODULE_0_SLIDES = [
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
export const TODAY_GYM_DAY = 2; // Nov 24, 2026 - Day 2 active today

export const INITIAL_GYM_CHALLENGES = [
  {
    day: 1,
    caseStudyTitle: "Micro-Experiment 1: AI as Personal Learning Companion",
    challenge: "Ask AI to explain something you don't understand",
    questionPrompt: "Pick a complex or confusing concept you encounter in work, studies, or daily life. Ask AI to explain it step-by-step using a real-world analogy. Evaluate whether the explanation clarified the concept or oversimplified it.",
    newExperience: "Learning",
    category: "Concept Breakdown",
    promptSuggestion: "Explain [Topic/Concept] to me like I am 12 years old using a simple real-life analogy. Break it into 3 clear bullet points.",
    promptSuggestionHi: "Mujhe [Topic] bilkul aasan bhasha mein ek daily life ke udaharan ke saath 3 bullet points mein samjhao.",
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
    promptSuggestionHi: "Mera ye rough message padho: '[Draft yahan paste karein]'. Ise 2 alag tones mein rewrite karo: 1) Short & direct, 2) Professional aur clear.",
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
    promptSuggestionHi: "Mere paas ye 5 zaroori tasks hain: [Tasks list]. Meri priority aur limited time ko dhyan mein rakhte hue ek practical time-table plan banao.",
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
    promptSuggestionHi: "Is text se mukhya decisions, action points aur risks ko aasan bhasha mein 100 shabdon mein summarize karo: [Text paste karein].",
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
    promptSuggestionHi: "Mujhe Option A: [Option 1] aur Option B: [Option 2] ke beech chunav karna hai. Dono ke pros, cons aur risks ka comparison table banao.",
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
    promptSuggestionHi: "Aapne jo point bataya uske peeche kya solid proof ya logic hai? Is logic ke khilaaf sabse bada counter-argument kya ho sakta hai?",
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
    promptSuggestionHi: "Mera pichhla AI solution ye tha: [Paste]. Ise 2x better banana hai—edge cases handle karo aur structured format do.",
    completed: false
  }
];

// ─── MODULE 0 DRAWER ITEMS (Exact 1:1 match to media_1795517348125_8cc6c6b5.jpg) ───
export const MODULE_0_DRAWER_ITEMS = [
  { id: 'item-0', index: 0, label: "1. AI", title: "1. AI", duration: "2 min" },
  { id: 'item-1', index: 1, label: "2. Imagine having an assista...", title: "2. Imagine having an assista...", duration: "5 min" },
  { id: 'item-2', index: 2, label: "3. AI as your personal assist...", title: "3. AI as your personal assist...", duration: "3 min" },
  { id: 'item-3', index: 3, label: "4. AI as your personal teach...", title: "4. AI as your personal teach...", duration: "3 min" },
  { id: 'item-4', index: 4, label: "5. AI as your communication...", title: "5. AI as your communication...", duration: "3 min" },
  { id: 'item-5', index: 5, label: "6. What did we just discover...", title: "6. What did we just discover...", duration: "4 min" },
  { id: 'item-6', index: 6, label: "7. Now it's your turn! Don't j...", title: "7. Now it's your turn! Don't j...", duration: "10 min" },
  { id: 'item-7', index: 7, label: "8. AI is not just a chatbot", title: "8. AI is not just a chatbot", duration: "5 min" },
  { id: 'item-8', index: 8, label: "9. Feed AI diverse modalitie...", title: "9. Feed AI diverse modalitie...", duration: "5 min" },
  { id: 'item-9', index: 9, label: "10. Where can AI help in you...", title: "10. Where can AI help in you...", duration: "5 min" },
  { id: 'item-10', index: 10, label: "11. Let's brainstorm together", title: "11. Let's brainstorm together", duration: "5 min" },
  { id: 'item-11', index: 11, label: "12. The Big Question", title: "12. The Big Question", duration: "5 min" },
  { id: 'item-12', index: 12, label: "13. Your First AI Commitment", title: "13. Your First AI Commitment", duration: "5 min" },
  { id: 'item-13', index: 13, label: "14. Before we finish", title: "14. Before we finish", duration: "5 min" }
];

// ─── TOP PEERS LEADERBOARD DATA (Exact match to media_1795517501723_eecef4ad.jpg) ───
export const LEADERBOARD_PEERS = [
  { rank: 1, initials: 'AN', name: 'Ankitha G Nayaka', pts: 36, bg: '#fce7f3', color: '#be185d' },
  { rank: 2, initials: 'JM', name: 'Jiya Maikhuri', pts: 34, bg: '#e0f2fe', color: '#0284c7' },
  { rank: 3, initials: 'AS', name: 'Aditya Partap Singh', pts: 34, bg: '#dcfce7', color: '#16a34a' },
  { rank: 4, initials: 'SP', name: 'Sai Bharadwaj Pisipati', pts: 17, bg: '#ffedd5', color: '#ea580c' },
  { rank: 5, initials: 'ES', name: 'Errollu Srinivas', pts: 10, bg: '#f3e8ff', color: '#9333ea' },
  { rank: 6, initials: 'AA', name: 'Ananya Awasthi', pts: 4, bg: '#ccfbf1', color: '#0f766e' }
];

// ─── WEEKLY REMINDERS (Exact match to media_1795517501723_eecef4ad.jpg) ───
export const WEEKLY_REMINDERS = [
  { title: 'Assignment Discussions', time: 'Wednesday 9:30-10:30 Pm' },
  { title: 'Root Cause Analysis', time: 'Saturday 3:30-5:00 Pm' },
  { title: 'User Interviews and Survey Creation', time: 'Sunday 12:30-2:00 PM' },
  { title: 'Spotify Segmentation and Hypothesis', time: 'Sunday 12:30 PM' },
  { title: 'PM Positioining - Recreation', time: '22 July' }
];

// ─── HELPER: EXTRACT HIGH-CLARITY PRESENTATION BULLETS (Matches media_1795506493984_2c4c823d.png) ───
export const getSlideBullets = (slide, lang) => {
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


export const AI_PROMPT_LIBRARY = [
  {
    id: 'p1',
    category: 'Daily Life & Planning',
    title: 'Weekly Busy Schedule Planner',
    hindi: 'Mera agla hafta kaafi busy hai. Mere paas ye tasks hain: gym 4 baar, Wednesday tak work presentation, groceries, 2 hours learning, 3 meetings, family time aur electricity bill. Mere liye ek realistic weekly schedule banao. Important tasks ko priority do, breaks aur buffer time bhi rakho. Agar schedule unrealistic hai toh mujhe suggest karo ki kya change karna chahiye.',
    english: 'My upcoming week is going to be very busy. I need to complete these tasks: go to gym 4 times, finish an office presentation by Wednesday, grocery shopping, 2 hours learning, attend 3 meetings, spend family time, and pay electricity bills. Create a realistic weekly schedule for me. Prioritize important tasks, keep breaks and buffer time. If the schedule is unrealistic, suggest what to adjust.'
  },
  {
    id: 'p2',
    category: 'Learning & Skills',
    title: 'Personal Teacher: 20% Discount Demonstration',
    hindi: 'Mujhe percentage samajhne mein difficulty hoti hai. Maan lo ek shirt ki price ₹1,000 hai aur uspe 20% discount mil raha hai. Mujhe bilkul basic level se samjhao ki discount kaise calculate karte hain. School teacher ki tarah step-by-step samjhana, ek simple real-life example dena aur end mein mujhe ek similar question solve karne ke liye dena.',
    english: 'I have trouble understanding percentages. Suppose a shirt costs ₹1,000 with a 20% discount. Explain step-by-step like a patient school teacher how to calculate the discount. Give a simple real-life analogy and test my understanding with a practice question at the end.'
  },
  {
    id: 'p3',
    category: 'Workplace Communication',
    title: 'Delicate Delay Email to Manager',
    hindi: 'Mujhe apne manager ko inform karna hai ki project Wednesday tak complete nahi ho payega kyunki kuch dependencies delay ho gayi hain. Ek short professional email draft karo jo responsibility accept kare, delay clearly explain kare, aur Friday ki revised deadline suggest kare.',
    english: 'Draft a short, professional email to my manager informing them that our project will not be ready by Wednesday due to upstream dependency delays. Take ownership, explain the roadblock without making excuses, and propose Friday as the revised delivery date.'
  },
  {
    id: 'p4',
    category: 'Multimodal AI & Document Analysis',
    title: 'Document & Bill Information Extractor',
    hindi: 'Maine ek document/photo attach kiya hai. Iska main summary 3 bullet points mein do, important deadline ya amount highlight karo, aur immediate next step suggest karo.',
    english: 'I have attached a document/photo. Provide a 3-bullet summary, highlight the key action deadline and amount due, and recommend the immediate next step.'
  }
];
