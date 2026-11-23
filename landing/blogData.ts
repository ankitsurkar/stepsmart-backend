export interface BlogPost {
  id: string;
  title: string;
  date: string;
  description: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  author?: string;
}

export const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: 'pm-interview-prep-toolkit',
    title: 'PM Interview Prep Toolkit: Strict AI Coach, 5 Mock Flows & Scoring Anchors',
    date: '23 Nov 2026 · @Sanket',
    author: '@Sanket',
    description: 'This kit gives you a strict AI interview coach, five free-tool mock flows, a scorecard and starter files, so every practice round ends with a score and one thing to fix.',
    imageUrl: '/blog-interview-prep-toolkit.png',
    createdAt: '2026-11-23T18:00:00.000Z',
    content: `This kit gives you a strict AI interview coach, five free-tool mock flows, a scorecard and starter files, so every practice round ends with a score and one thing to fix.

## Set up in 5 minutes

You build one Claude Project that remembers your resume, the job description and the scoring rules, then reuse it for every mock.

1. **Open Claude**, go to Projects and create a new project named **"PM Interview Coach"**.
2. **Paste the coach prompt** from the next section into the project's instructions.
3. **Upload your files** (table below). Keep each one short.
4. **Open a chat inside the project and type "Start".** The coach asks for your target role, case type and interviewer style.
5. **After each round, copy the weakness log** it gives you and paste it into the next session.

| File | What goes in it | Needed? |
| :--- | :--- | :--- |
| **Resume** | Plain text, with phone, address and employer names removed | Yes |
| **Job description** | The text of the role you are targeting, or the sample JD at the end | Yes |
| **rubrics_and_anchors** | The file in the Rubrics section below | Yes |
| **Company notes** | 3 to 5 bullets from the company's own blog or product pages | Optional |
| **Reported process and questions** | What students say about the loop, labelled "reported, may be outdated" | Optional |
| **Weakness log** | The top 3 gaps from your last session | From session 2 |

• **More files do not mean better answers.** Loosely relevant material dilutes the coach, so cut anything you would not hand to a human interviewer.
• **Free-plan limits on Projects, file uploads and message counts change often.** If Projects is not available on your account, paste the prompt and your files at the start of a normal chat and run the same flow. Check your tool's data settings before you paste anything personal.

## The coach prompt

Copy everything in the box into your project's instructions. It runs the round in two modes: the AI only interviews first, then scores and gives feedback after the round ends.

\`\`\`text
ROLE
You are a strict but fair PM interview coach and mock interviewer for students preparing for product management interviews. You are not a cheerleader. Your job is to find what would make a candidate fail and help them fix it, one thing at a time.

KNOWLEDGE FILES
The project may contain: the candidate's resume, a job description (JD), company notes, a reported interview process, reported past questions, and a file called rubrics_and_anchors. Rules:
- Ground questions and feedback in the JD, resume and company notes when they exist. If a file is missing, say so once and carry on. Never invent company facts.
- Treat the company interview process and past questions as "reported, may be outdated or inaccurate". Use them as examples of style and difficulty, never as guaranteed content.
- Never credit the candidate for experience that is not in their resume or stated in this session.
- If an interviewer style is given (data-heavy, product-sense-heavy, skeptical), adopt it. Never build a persona from a named individual's personal profile.

START OF SESSION
When the candidate types "Start", ask in one message:
1. Target role and company
2. Case type: product design, RCA / metrics drop, metrics and goal-setting, or behavioural
3. Interviewer style (optional)
4. Last session's weakness log, if they have one
If they share a weakness log, target those gaps first.

MODE 1: INTERVIEW (no feedback)
- Play a realistic interviewer. Ask one question at a time.
- Ask at least two follow-up probes on every answer. Push back on vague answers ("Why that metric?", "What would you cut first and why?", "What is the trade-off?"). Do not accept buzzwords.
- Give NO hints, praise, scores or coaching in this mode. Stay in character and keep replies short.
- Run 3 to 5 questions, then say "Round complete" and switch to Mode 2. The candidate can also type "end round".

MODE 2: FEEDBACK (only after the round)
Follow this order every time:
1. SCORE FIRST. Score each criterion of the chosen rubric from 1 to 5. For each, quote the exact line from the candidate's answer as evidence. If there is no evidence, the score is 1 or 2 and you write "no evidence in the answer".
2. CALIBRATE. Compare the answer with the weak, average and strong anchors for that case type in rubrics_and_anchors. If the file is missing, use the default criteria below and say so once.
3. DEFAULT TO AVERAGE. Assume the answer is average unless the evidence shows otherwise. List what is missing before what is good. Praise is allowed only when tied to a specific criterion and quote. If you cannot find a real weakness, say what a stronger answer would have added. Never inflate scores to be kind.
4. CLAIM CHECK. Quote any claim the candidate made that their resume or answer does not back up (invented numbers, outcomes, ownership).
5. ONE THING TO FIX FIRST. Name a single top priority, explain why it matters most, and give a concrete re-attempt instruction. Then ask the candidate to retry that answer. Do not list eight tweaks.
6. VERDICT. End with "Would I advance this candidate? Yes / Borderline / No" and a one-sentence reason tied to the rubric.
7. WEAKNESS LOG. Output the top 3 recurring gaps in a short block under the heading "Paste this into your project next session".

DEFAULT RUBRICS (used only if rubrics_and_anchors is missing)
- Product design: user and problem clarity, segment prioritisation, solution tied to the problem, trade-offs, success metrics.
- RCA / metrics drop: clarifying questions, structured breakdown, hypothesis prioritisation, how to verify with data, recommended action.
- Metrics and goal-setting: link to business outcome, primary metric choice, guardrail metrics, counter-metrics, measurement caveats.
- Behavioural: specific situation, personal ownership (I vs we), decision reasoning, measurable result, reflection.
Rubrics are not interchangeable. Never use one generic "give feedback" approach.

STYLE
- Direct, concise, respectful. No filler praise, no emojis.
- If the candidate asks for the "right answer", show a stronger structure, not a script to memorise.
- Once per session, remind the candidate to remove employer names and personal details from anything they paste.
- If asked about something outside interview prep, redirect politely.
\`\`\`

**Three things this prompt does on purpose:**
1. **It scores before it comments**, so praise has to be earned.
2. **It forces one fix and a retry**, so each round changes your next answer.
3. **It checks your claims against your resume**, so you stop rehearsing things you cannot defend.

## Rubrics and anchors file

Save the box below as a file named \`rubrics_and_anchors\` and upload it to the project. Anchors show the coach what a 2, a 3 and a 5 look like, which is what stops it handing out generous scores. The sample answers are illustrative, so edit them to match the role you are targeting.

\`\`\`text
SCORING SCALE (per criterion)
1 = absent. 2 = weak, vague or generic. 3 = adequate, correct but unremarkable. 4 = good, specific and reasoned. 5 = strong, a hiring manager would remember it.
Anchors below are examples of QUALITY LEVEL, not content to copy.

=== CASE TYPE 1: PRODUCT DESIGN ===
Criteria: user and problem clarity, segment prioritisation, solution tied to the problem, trade-offs, success metrics.
Example question: Design a product to help families in tier-2 cities find a reliable home tutor.
WEAK (1-2): "I'd build an app with tutor profiles, ratings, chat, payments and video calls. We'd earn from ads." Why: a feature list, no user, no problem, no metric.
AVERAGE (3): "Users are parents and students. The pain is trust, so I'd verify tutors and offer a trial class. I'd track bookings." Why: names a pain and a solution, but never explains why this segment, no trade-off, one metric.
STRONG (5): "Three segments: parents of class 9-10 students, college students who want tutors, and tutors. I pick parents of class 9-10 because exam stakes make willingness to pay highest. Core problem: they cannot judge tutor quality before paying. I considered verified profiles, a free trial and outcome tracking. I choose a paid trial class because it tests quality directly; the trade-off is friction for tutor supply. Success: trial-to-paid conversion, with 4-week retention as a guardrail and tutor no-show rate as a counter-metric."

=== CASE TYPE 2: RCA / METRICS DROP ===
Criteria: clarifying questions, structured breakdown, hypothesis prioritisation, how to verify with data, recommended action.
Example question: Daily orders on a food delivery app dropped 15% week over week. What do you do?
WEAK (1-2): "Maybe marketing spend went down or a competitor ran offers. There might be a bug. I'd talk to the team." Why: guesses with no structure or verification.
AVERAGE (3): "I'd ask if it's all cities and platforms, then split demand and supply, check releases, and fix the cause." Why: some structure, but no ranking of hypotheses and no named data cuts.
STRONG (5): "First I clarify: sudden or gradual, metric definition, any outage or release. Then I segment by platform, city, new vs repeat users and funnel step. I rank hypotheses by likelihood and speed to verify: a release bug on one platform, payment failure, supply drop in a city, festival or weather, competitor. I check the funnel by platform for this week vs last first, because it takes minutes and rules out the costliest cause. If one platform's payment step broke, I roll back and watch for 24 hours; otherwise I move to supply data."

=== CASE TYPE 3: METRICS AND GOAL-SETTING ===
Criteria: link to business outcome, primary metric choice, guardrail metrics, counter-metrics, measurement caveats.
Example question: You launch a "save for later" feature on a shopping app. What do you measure?
WEAK (1-2): "Downloads, daily active users and revenue." Why: generic metrics unrelated to the feature.
AVERAGE (3): "Primary metric is items saved, plus purchases from saved items." Why: relevant, but saves are a vanity metric and there are no guardrails.
STRONG (5): "The goal is more eventual purchases from hesitant shoppers, not more saves. Primary: percent of saved items bought within 14 days. Supporting: save rate per product view and return visits to the saved list. Guardrail: direct add-to-cart conversion must not fall, since saving can cannibalise it. Counter-metric: saves never revisited, a sign of clutter. Caveat: people who save are already high-intent, so I'd compare against a holdout group, not before vs after."

=== CASE TYPE 4: BEHAVIOURAL ===
Criteria: specific situation, personal ownership (I vs we), decision reasoning, measurable result, reflection.
Example question: Tell me about a time you disagreed with a stakeholder.
WEAK (1-2): "In a college project we disagreed and I convinced everyone with my communication skills. It went well." Why: no specifics, no stakes, no result.
AVERAGE (3): "In my internship I disagreed with my manager on priorities, showed data, and we agreed on my approach." Why: a real situation, but no detail on the data, the options or the outcome, and no reflection.
STRONG (5): "My manager wanted a referral banner shipped; I believed checkout drop-off mattered more. I pulled two weeks of funnel data showing a 38% drop at the address step and proposed a one-week test of address autofill, agreeing to ship the banner after. Autofill cut drop-off from 38% to 31% and the banner shipped a week later. I learned to bring a small, reversible test instead of arguing priorities."
\`\`\`

The rubric is where product judgment lives. The AI applies whatever bar you set, but it cannot tell you whether the bar is right, so if you have a mentor, ask them to review your anchors once.

## Five mock flows

Pick one flow per session. Each is built around a single moment where you see something about your own answers that you could not see before. Free-tier limits change often, so test your route once before you rely on it.

| Flow | Free tools | Time | The aha moment |
| :--- | :--- | :--- | :--- |
| **1. The scored mock** | Claude Project, the coach prompt | 25 min | It quotes my exact sentence and shows why it earned a 2 |
| **2. Two judges, one answer** | Any two free chat AIs | 15 min | AI scores are not truth, the rubric and my judgment matter |
| **3. Hear yourself** | Phone recorder or voice typing, a chat AI | 20 min | My transcript shows I rambled for 90 seconds before the point |
| **4. Questions from your resume** | NotebookLM | 20 min | It found the weak spot I hoped nobody would ask about |
| **5. Flip the roles** | Any chat AI, the rubric | 20 min | Spotting the weak answer showed me what I do in my own |

### Flow 1: The scored mock
1. **Open your PM Interview Coach project** and type \`"Start"\`.
2. **Choose one case type** and answer 3 to 5 questions. The coach only asks and probes.
3. **After "Round complete"**, read the scores and the quoted evidence.
4. **Redo the one thing it told you to fix**, and get re-scored.
5. **Log the result** on your scorecard.

### Flow 2: Two judges, one answer
1. **Write or dictate one answer** to a product design question.
2. **Paste the same answer and the same prompt** into two different AIs.
3. **Compare the scores.** Where they disagree, read both reasons and decide who is right.

\`\`\`text
Score the answer below against this rubric, 1 to 5 per criterion: [paste the criteria for your case type]. For each score, quote the exact line from the answer as evidence. If there is no evidence, say so and score 1 or 2. Then give one thing to fix first.

Answer: [paste your answer]
\`\`\`

### Flow 3: Hear yourself
1. **Record yourself answering one question out loud** for 2 minutes. Use your phone's recorder, or voice typing in Google Docs (Tools, then Voice typing) to get text directly.
2. **Paste the transcript into a chat AI** with the prompt below.
3. **Re-record your answer** using the 5-line outline it gives you.

\`\`\`text
Below is a transcript of me answering this interview question out loud: [question]. Do three things. 1) Count and list my filler words (um, like, basically, you know). 2) Quote the sentence where my structure broke down. 3) Rewrite my answer as a 5-line outline using only my own points. Do not add new ideas.

Transcript: [paste transcript]
\`\`\`

### Flow 4: Questions from your resume (NotebookLM)
1. **Create a new notebook in NotebookLM** and add your JD, your resume and 2 to 3 articles from the company's own blog or product pages as separate sources.
2. **Ask the two prompts below.**
3. **Practise answering each question out loud**, then check your answer against the cited source.
4. *(Optional)* Generate an Audio Overview and listen to the briefing on your commute.

\`\`\`text
Which claims on my resume would an interviewer challenge? For each one, give the likely question and the source it comes from.
\`\`\`

\`\`\`text
Give me 10 likely interview questions for this role. For each, say which source it is based on and what a strong answer must include.
\`\`\`

### Flow 5: Flip the roles
1. **Ask any chat AI to write a flawed candidate answer**, using the prompt below.
2. **Score it yourself with the rubric** before you ask the AI for its own score.
3. **Ask the AI to reveal the planted flaws** and compare them with what you found.
4. **Write what you would change**, then answer the same question yourself.

\`\`\`text
Answer this product management interview question as a candidate: [question]. Write four short paragraphs with two genuinely strong parts and two planted flaws, for example a missing trade-off or a vague metric. Do not tell me which parts are which until I ask you to reveal them.
\`\`\`

*Judging builds the same skill as answering, and it works well if you freeze up in live practice.*

## Scorecard and weakness log

Log every session, whichever flow you used. Copy this table into Google Sheets or Notion. A score trend across a week is what shows you whether practice is working.

| Date | Flow | Case type | Overall (1-5) | Weakest criterion | Top gap | Fix I will try | Re-attempt score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Example: 24 Nov** | 1 | RCA | 2.8 | Hypothesis prioritisation | Listed causes without ranking | Rank by likelihood and speed to verify | 3.6 |

After five sessions, look for the criterion that was your weakest three or more times. That is your study priority, ahead of learning any new framework.

Paste the block below into your project at the start of each session, filled in from the coach's last output.

\`\`\`text
WEAKNESS LOG
Date:
Case type:
Top 3 recurring gaps:
1.
2.
3.
Last session's fix and whether it worked:
\`\`\`

## Tips and tricks

### Before a mock
• **Practise one case type per session** and rotate the type across the week.
• **Use a real job description**, not "a PM role". Specific input gives specific questions.
• **For every resume bullet**, be ready with the number, your own role and one trade-off you faced.
• **Strip employer names, phone numbers and addresses** from anything you paste.

### During a mock
• **Answer out loud at least half the time.** Typed answers hide rambling.
• **Ask two or three clarifying questions** and state your assumptions before you structure.
• **Name your structure in the first 20 seconds**, for example "I'll cover users, problem, solution, then metrics".
• **When the interviewer pushes back**, defend your answer with a reason or change it with a reason. Do not just agree.
• **Do not ask the AI for hints mid-round.** The point is to find out where you get stuck.

### After a mock
• **Redo the one thing the coach told you to fix**, straight away, while it is fresh.
• **Log the score before you close the tab.**
• **Study the strong anchors for their structure**, not their wording. Interviewers can hear a memorised script.

### Watch-outs when using AI
• **If every score is 4 or above**, the coach is going easy. Tell it "assume the answer is average unless the evidence shows otherwise" and rerun.
• **AI can invent company facts.** Check them against the company's own site or product pages.
• **Reported interview questions and processes are often out of date.** Use them for style, not as a guarantee.
• **A good score from AI means your answer matched the rubric**, not that you will pass. Get a human to review your rubric and one recorded answer if you can.

## Starter files

Not applying anywhere yet? Upload these two fictional files to your project and run your first mock today. Swap in your real JD and resume when you have them.

### Sample job description (fictional company)

\`\`\`text
Associate Product Manager, Merchant Payments
LedgerLoop (fictional) builds payment and invoicing tools for small shops in India.

What you will do:
- Own the roadmap for the merchant checkout and settlement experience with one engineering squad.
- Run discovery with merchants, turn insights into a prioritised backlog and write clear specs.
- Define success metrics for each release and report results every two weeks.
- Investigate drops in payment success rate with data and engineering.

What we look for:
- 0 to 2 years in product, analytics, engineering, design or operations.
- Comfort with SQL or spreadsheets to size problems and read funnels.
- Clear written and spoken communication with non-technical users.
- Evidence that you took something from idea to shipped outcome.
\`\`\`

### Sample resume (fictional candidate)

\`\`\`text
Riya Menon (sample candidate)
Education: B.Tech Computer Science, 2025

Experience:
Product Intern, EdTech start-up (6 months)
- Analysed the sign-up funnel and found a 38% drop at the phone verification step.
- Proposed and ran a one-week test of auto-read OTP with 2 engineers; verification drop-off fell from 38% to 31%.
- Wrote 6 user stories and an acceptance checklist for the next sprint.

Projects:
- Campus canteen pre-order app: interviewed 15 students, built a Figma prototype, tested with 40 users.
- Expense tracker in Python and SQL used by 12 friends for 2 months.

Skills: SQL, Excel, Figma, Python basics, user interviews
\`\`\`

*These files are made up, so do not treat them as real company or candidate data. They exist so you can practise before you have your own.*`
  },
  {
    id: 'how-to-showcase-a-product-decision-in-one-page',
    title: 'How to Showcase a Product Decision in One Page',
    date: '14 Nov 2026 · @Sanket',
    author: '@Sanket',
    description: 'A hiring manager gives your document about 60 seconds. One decision, explained clearly, shows more product judgment than ten hypothetical redesigns. Here is the structure I recommend, with a full worked example.',
    imageUrl: '/blog-product-decision.png',
    createdAt: '2026-11-14T12:00:00.000Z',
    content: `A hiring manager gives your document about 60 seconds. One decision, explained clearly, shows more product judgment than ten hypothetical redesigns. Here is the structure I recommend, with a full worked example.

## Why one decision beats ten projects

Without a Product Manager title, recruiters can't verify your judgment from your resume. A 20-page redesign of a famous app shows you can list features. It doesn't show you can choose between them.

PM work is choosing under uncertainty, with incomplete data and no clean answer. A page that forces you to state one choice, what you gave up, and how it could fail is a work sample of exactly that skill.

The one-page limit is part of the test. If you can't explain the decision in 300 words, you don't understand the problem yet.

## The five parts of the page

1. **The decision, in one sentence.** State a choice, not a feature. Weak: *"Add delivery tracking."* Strong: *"Show a delivery time range instead of a single exact time."*
2. **The trade-off.** Name the option you rejected and what the chosen one costs, with a number. If both options sound free, you haven't found the trade-off.
3. **The success metric and a guardrail.** One metric that should move, with a baseline, a target and a timeframe. One metric that must not get worse.
4. **The failure mode.** Say how the decision could fail, which metric would show it, and the threshold that makes you change course.
5. **The first test.** Name your biggest assumption and the cheapest way to test it within two weeks.

## Worked example: delivery time estimates in a food delivery app

*The numbers below are illustrative. Replace them with figures from a product you know.*

| Part | Example |
| :--- | :--- |
| **Decision** | Show a 35–45 minute range instead of a single "40 min" estimate. |
| **Trade-off** | Chose the range over an exact time. The range may cost about 3% of orders from users in a hurry who see the upper bound and leave. It buys fewer "late" complaints, because arriving inside the range counts as on time. The exact time converts better, but about 1 in 4 orders arrives after the promised minute. |
| **Success metric** | Late-order complaints fall from 18 to 10 per 1,000 orders within 6 weeks. Guardrail: checkout conversion drops by no more than 2%. |
| **Failure mode** | Fails if users read the upper bound as the real estimate and abandon carts. If conversion falls more than 2% for two weeks in a row, narrow the range to 3 minutes either side, or show it only after checkout. |
| **First test** | Assumption: users forgive a range more readily than a missed exact time. Run an A/B test in one city for two weeks on 10% of traffic, and compare complaints and conversion. |

Notice what this page does. It names a real alternative, puts a cost on the choice, and says in advance what would make you wrong.

## How to make it readable in 60 seconds

• **Pick a product from your own job or daily use**, so the trade-offs are real and not guessed.
• **Put a number in every trade-off line:** cost, time, percentage or risk.
• **Lead with the decision.** Context comes second and stays short.
• **Cut adjectives** such as "seamless" and "intuitive". Keep nouns and numbers.
• **Use one small table at most**, and export the page as a PDF.

## Common mistakes

• **Writing a feature list** instead of a choice.
• **Comparing your pick against an option** nobody would choose.
• **Giving a metric** with no baseline or timeframe.
• **Naming a failure mode** like "users might not like it", with no metric or threshold.
• **Running past one page.**

## How to send it

Send the page directly to a named hiring manager, not into a generic application portal. Add a two-line note: which decision you made, and why it relates to their product. End with an offer of a 15-minute conversation about the trade-off.

One thoughtful page that reaches the right person beats 50 blind applications.

## Try it this week

Pick one product you know, write 300 words, and stop at one page. If you get stuck, it will most likely be at the failure mode. That's the part to spend the most time on, because it is the part hiring managers remember.`
  }
];

export function mergeWithDefaultBlogs(apiBlogs: any[]): BlogPost[] {
  const merged: BlogPost[] = [...DEFAULT_BLOGS];
  (apiBlogs || []).forEach((apiBlog: any) => {
    if (!apiBlog || !apiBlog.id) return;
    const idx = merged.findIndex((b) => b.id === apiBlog.id);
    if (idx >= 0) {
      merged[idx] = { ...merged[idx], ...apiBlog };
    } else {
      merged.push(apiBlog);
    }
  });

  // Sort newest first by createdAt or fallback
  return merged.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}
