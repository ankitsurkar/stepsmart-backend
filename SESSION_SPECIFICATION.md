# The AI PM, Part 1 — “The Making”: Complete System & Stage-by-Stage Specification

> **Document Type**: Comprehensive System & Content Master Specification  
> **Target Audience**: Large Language Models (LLMs), AI Evaluators, Course Creators, and Engineering Reviewers  
> **Live URLs**:  
> - Host Projection Screen: `https://stepsmart.net/live/host`  
> - Candidate Interactive Phone Screen: `https://stepsmart.net/live/phone`  
> - Self-Paced Replay Edition: `https://stepsmart.net/live/replay`  
> - GitHub Repository: `https://github.com/ankitsurkar/stepsmart-backend.git`  
> - Total Stages: 62 (Opening -> 6 Core Game Rounds -> Ending Modules -> Cohort Pitch -> Q&A)  

---

## 1. System Architecture & Technical Specifications

### 1.1 Dual-Screen Realtime Synchronization
The system delivers a synchronous, two-screen live experience for cohort workshops:
1. **Host Screen (`/live/host`)** (Main Projection / Screen-share):
   - Driven by the session host via keyboard shortcuts (`ArrowRight` / `ArrowLeft`) or an on-screen Jump modal.
   - Renders large-format visual typography (>= 28px headings) visible from the back of an auditorium or on low-res video calls.
   - Renders high-DPI HTML5 canvas wheels, live aggregated spin tally counters, candidate proof counters, interactive concept deep-dives, and full curriculum roadmaps.
   - Acts as the single source of truth for current stage state across all 62 stages.

2. **Candidate Phone Screen (`/live/phone`)** (Personal Device Companion):
   - Participants scan a room QR code or click `stepsmart.net/live/phone` without downloading an app or authenticating.
   - Listens to host stage updates over Server-Sent Events (SSE: `GET /api/events`) or Firestore realtime snapshot listeners (`onSnapshot`).
   - **Strictly Host-Driven UX**: Participants cannot skip forward, backtrack, or self-pace during the live session. Their device strictly follows the host.
   - **Calm Spinner Focus Guard (`.calm-spinner`)**: Whenever the host is delivering context cards, stories, or takeaways, the candidate’s phone displays an animated pulsing spinner alongside the directive **"Watch the host."** to prevent candidates from looking down at their phones.

3. **Replay Edition (`/live/replay`)** (Self-Paced Async Mode):
   - A 100% static, standalone edition designed for candidates reviewing the session afterwards or asynchronous learners.
   - Runs entirely in the client browser with zero backend dependency.

### 1.2 Local Storage Privacy Invariant
- **100% Client-Side Privacy**: Setup answers (background, experience, everyday work tasks in `aipm_part1_phone_profile_v1`) and custom typed resume proof lines (`aipm_part1_phone_extras_v1`) stay strictly in the candidate's browser `localStorage`.
- **Anonymous Rollup Only**: The only telemetry transmitted over the network is anonymous bucket counts of Round 1 spin results (`Stay`, `Technical PM`, `Data PM`, `Product Manager`, `Growth PM`, `AI PM`) sent to the host tally endpoint (`POST /api/phone/tally`).

### 1.3 Design System Tokens
- **StepSmart Neobrutalism**: Hard borders (`2px solid #141413` or `#353945`), rounded pills, high-contrast badges, brand teal-blue (`#188ab2`), warm dream terracotta (`#d95f2b`), emerald good (`#10b981`), and deep AI PM purple (`#6d28d9`).
- **Adaptive Light & Dark Modes**: Responsive CSS tokens supporting both high-glare projectors and dim auditorium environments.

---

## 2. Global Data Pools & Narrative Setup

### 2.1 Sanket's Real Transition Resume (Verbatim Lines)
The core pedagogical narrative follows Sanket's actual transition from a Data Engineer at Mastercard to a Product Manager (and AI PM):

#### The 5 "Before" Lines (Data Engineer Baseline):
1. *"Built and automated ETL pipelines for airline and financial clients."*
2. *"Designed and maintained batch data workflows across source systems."*
3. *"Wrote SQL transformations and queries to prepare reporting tables."*
4. *"Monitored daily pipeline runs and resolved data quality issues."*
5. *"Documented database schemas and data mappings for downstream teams."*

#### The 4 "After" Lines (Added in Round 2 Rewrite):
1. *"Raised project capacity 20% and sped up delivery 10% by optimizing data workflows."*
2. *"Found a 10% gap between estimated and actual hours and built an interactive KPI dashboard."*
3. *"Acted as backup lead and mentored two interns, both considered for PPOs."*
4. *"Raised team efficiency 15% and JIRA adoption with dashboards and best-practice blogs."*

### 2.2 Baseline Wheel Probability Shifts (Sanket's Wheel)
- **Before Resume (Round 1)**: Stay as Data Eng: **54%** | Technical PM: **20%** | Data PM: **9%** | Product Manager: **6%** | Growth PM: **6%** | AI PM: **5%**
- **After Resume (Round 2)**: Stay as Data Eng: **35%** | Technical PM: **23%** | Data PM: **11%** | Product Manager: **11%** | Growth PM: **11%** | AI PM: **9%**

---

## 3. Exhaustive Stage-by-Stage Catalog (All 62 Stages)

### Stage 1 of 62: Last time
- **Stage ID**: `opening_1`
- **Type**: `opening_scene`
- **Section**: Opening
- **Round**: 0
- **Allocated Time**: 0–4m

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "In the last session you learned to think about your resume like a PM. Today is the other half: how AI products behave, and which of your skills already count."

- **Headline**: "Last time"
- **Visual Elements**: Kicker badge, large high-contrast title, session subtitle (“The Making”), StepSmart branding logo, and speaker intro card.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Opening.

---

### Stage 2 of 62: The question
- **Stage ID**: `opening_2`
- **Type**: `opening_scene`
- **Section**: Opening
- **Round**: 0
- **Allocated Time**: 0–4m

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "One question will follow us for the next hour: can you spot when AI is wrong?"

- **Headline**: "The question"
- **Visual Elements**: Kicker badge, large high-contrast title, session subtitle (“The Making”), StepSmart branding logo, and speaker intro card.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Opening.

---

### Stage 3 of 62: Set up your wheel
- **Stage ID**: `opening_3`
- **Type**: `opening_setup`
- **Section**: Opening
- **Round**: 0
- **Allocated Time**: 0–4m

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "Three taps on your phone. About 60 seconds. Nothing you choose leaves your phone."

- **Visual Elements**:
  - Room QR Code linked directly to `/live/phone`.
  - Clear onscreen participant instructions: *"Open your phone, scan the code or go to stepsmart.net/live/phone, configure your 4 background inputs."*
  - Dynamic counter displaying live count of participants whose wheels are generated.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Interactive Wheel Configuration**:
  1. Select Background (6 options).
  2. Select Experience Band (4 bands).
  3. Select 3 Everyday Work Activities (12 interactive chips).
  4. Select Target Dream Role.
  - Submits form -> 3-second animated wheel construction screen -> Renders initial personal Product Manager percentage -> Prompts user to watch the host for Round 1.

---

### Stage 4 of 62: Before the PM job
- **Stage ID**: `r1_story_1`
- **Type**: `story`
- **Section**: Round 1
- **Round**: 1
- **Allocated Time**: 4–11m
- **Scene Progress**: Scene 1 of 3

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "Sanket was a data engineer. He built data pipelines for airlines and banks. He was good at it, and his resume said so in five lines."

- **Headline**: "Before the PM job"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 1: Same resume, different answers.

---

### Stage 5 of 62: The wish
- **Stage ID**: `r1_story_2`
- **Type**: `story`
- **Section**: Round 1
- **Round**: 1
- **Allocated Time**: 4–11m
- **Scene Progress**: Scene 2 of 3

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "He wanted to become a product manager. So he tried something odd: he put his resume on a wheel and asked what he could become."

- **Headline**: "The wish"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 1: Same resume, different answers.

---

### Stage 6 of 62: Today
- **Stage ID**: `r1_story_3`
- **Type**: `story`
- **Section**: Round 1
- **Round**: 1
- **Allocated Time**: 4–11m
- **Scene Progress**: Scene 3 of 3

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "Now you spin yours. Same idea, your resume. Watch how rarely it lands on the slice you actually want."

- **Headline**: "Today"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 1: Same resume, different answers.

---

### Stage 7 of 62: Round 1: Same resume, different answers
- **Stage ID**: `r1_context`
- **Type**: `context`
- **Section**: Round 1
- **Round**: 1
- **Allocated Time**: 4–11m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - High-DPI HTML5 Canvas Wheel showing exact baseline slice distribution.
  - Side card breaking down the role percentages (Stay, Tech PM, Data PM, Product Manager, Growth PM, AI PM).
  - Explanation of why applicant tracking systems and recruiters weight adjacent roles far heavier than target dream roles.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 1: Same resume, different answers.

---

### Stage 8 of 62: Round 1: Same resume, different answers
- **Stage ID**: `r1_play`
- **Type**: `play`
- **Section**: Round 1
- **Round**: 1
- **Allocated Time**: 4–11m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - Real-time live session sync monitor showing candidate spin activity.
  - Host interactive wheel demonstrating the random spin outcome.
  - Live room tally bar chart showing what percentage of participants landed on their target slice versus incumbent roles.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Interactive Round 1 Play Engine**:
  - User taps the prominent **"Spin your wheel"** button.
  - Canvas wheel spins with realistic rotational physics and lands on a slice based on their calculated distribution.
  - Displays landing feedback comparing the outcome to their target dream role.
  - Silently posts anonymous tally increment to host server.

---

### Stage 9 of 62: What just happened?
- **Stage ID**: `r1_reveal_1`
- **Type**: `reveal`
- **Section**: Round 1
- **Round**: 1
- **Allocated Time**: 4–11m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "What just happened"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 1: Same resume, different answers.

---

### Stage 10 of 62: Two kinds of wheels
- **Stage ID**: `r1_reveal_2`
- **Type**: `reveal`
- **Section**: Round 1
- **Round**: 1
- **Allocated Time**: 4–11m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "Two kinds of wheels"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 1: Same resume, different answers.

---

### Stage 11 of 62: Under the hood
- **Stage ID**: `r1_reveal_3`
- **Type**: `reveal`
- **Section**: Round 1
- **Round**: 1
- **Allocated Time**: 4–11m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "Under the hood"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 1: Same resume, different answers.

---

### Stage 12 of 62: Why this matters?
- **Stage ID**: `r1_reveal_4`
- **Type**: `reveal`
- **Section**: Round 1
- **Round**: 1
- **Allocated Time**: 4–11m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "Why this matters"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 1: Same resume, different answers.

---

### Stage 13 of 62: Round 1: Same resume, different answers
- **Stage ID**: `r1_hold`
- **Type**: `hold`
- **Section**: Round 1
- **Round**: 1
- **Allocated Time**: 4–11m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - Large focal takeaway card: *"{'phoneOneLiner': 'Same resume, different answers. The wheel doesn’t look up an answer. It draws one, and slice size means how likely.', 'roleLine': 'If you’re a QA or tester, you know a test can pass at 10:00 and fail at 10:05 (timing, shared data), so you never trust one green run. AI needs the same habit: run it many times and look at the pass rate.', 'extraRoleLine': 'If you’re a product owner or scrum lead, you write acceptance criteria: ‘done means these pass.’ With AI, the criterion becomes ‘right 9 times in 10’, and you decide what happens the other time.', 'pmMove': 'you set the quality bar for an AI feature, such as ‘right 9 times in 10’, and decide what happens the other time.'}"*
  - Host prompt facilitating a 30-second silent room reflection or discussion.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 1: Same resume, different answers.

---

### Stage 14 of 62: After the first spin
- **Stage ID**: `r2_story_1`
- **Type**: `story`
- **Section**: Round 2
- **Round**: 2
- **Allocated Time**: 11–18m
- **Scene Progress**: Scene 1 of 2

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "The wheel mostly said Data Engineer, and Product Manager was a sliver. Sanket couldn’t change what he had done, but he could change what his resume said."

- **Headline**: "After the first spin"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 2: Change the context.

---

### Stage 15 of 62: The experiment
- **Stage ID**: `r2_story_2`
- **Type**: `story`
- **Section**: Round 2
- **Round**: 2
- **Allocated Time**: 11–18m
- **Scene Progress**: Scene 2 of 2

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "One line at a time, he added what he had really done: results, numbers, people."

- **Headline**: "The experiment"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 2: Change the context.

---

### Stage 16 of 62: Round 2: Change the context
- **Stage ID**: `r2_context`
- **Type**: `context`
- **Section**: Round 2
- **Round**: 2
- **Allocated Time**: 11–18m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - High-DPI HTML5 Canvas Wheel showing exact baseline slice distribution.
  - Side card breaking down the role percentages (Stay, Tech PM, Data PM, Product Manager, Growth PM, AI PM).
  - Explanation of why applicant tracking systems and recruiters weight adjacent roles far heavier than target dream roles.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 2: Change the context.

---

### Stage 17 of 62: Round 2: Change the context
- **Stage ID**: `r2_play`
- **Type**: `play`
- **Section**: Round 2
- **Round**: 2
- **Allocated Time**: 11–18m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - Real-time live session sync monitor showing candidate spin activity.
  - Host interactive wheel demonstrating the random spin outcome.
  - Live room tally bar chart showing what percentage of participants landed on their target slice versus incumbent roles.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Interactive Round 2 Play Engine**:
  - **The Resume Rewrite**: Candidate selects 3-5 proof chips or enters custom impact lines.
  - Wheel instantly recalculates: PM slice expands while incumbent slice shrinks.
  - Candidate spins updated wheel to experience the adjusted odds.

---

### Stage 18 of 62: What moved
- **Stage ID**: `r2_reveal_1`
- **Type**: `reveal`
- **Section**: Round 2
- **Round**: 2
- **Allocated Time**: 11–18m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "What moved"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 2: Change the context.

---

### Stage 19 of 62: Why the slices moved?
- **Stage ID**: `r2_reveal_2`
- **Type**: `reveal`
- **Section**: Round 2
- **Round**: 2
- **Allocated Time**: 11–18m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "Why the slices moved"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 2: Change the context.

---

### Stage 20 of 62: Why this matters?
- **Stage ID**: `r2_reveal_3`
- **Type**: `reveal`
- **Section**: Round 2
- **Round**: 2
- **Allocated Time**: 11–18m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "Why this matters"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 2: Change the context.

---

### Stage 21 of 62: Round 2: Change the context
- **Stage ID**: `r2_hold`
- **Type**: `hold`
- **Section**: Round 2
- **Round**: 2
- **Allocated Time**: 11–18m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - Large focal takeaway card: *"{'phoneOneLiner': 'What you hand the AI is its context. Change the context and the answer changes.', 'roleLine': 'If you’re a BA or technical writer, you turn ‘make it better’ into a precise brief: who, what, limits, an example. Writing context for AI is the same job.', 'pmMove': 'you write the spec for how the AI should behave: its role, its limits, and an example answer.'}"*
  - Host prompt facilitating a 30-second silent room reflection or discussion.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 2: Change the context.

---

### Stage 22 of 62: The first spin
- **Stage ID**: `r3_story_1`
- **Type**: `story`
- **Section**: Round 3
- **Round**: 3
- **Allocated Time**: 18–25m
- **Scene Progress**: Scene 1 of 2

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "Sanket asks the wheel which roles to apply to. On Careful it says Data Engineer nearly every time. Safe, repeatable, and exactly what his resume already says."

- **Headline**: "The first spin"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 3: The dial.

---

### Stage 23 of 62: The dial
- **Stage ID**: `r3_story_2`
- **Type**: `story`
- **Section**: Round 3
- **Round**: 3
- **Allocated Time**: 18–25m
- **Scene Progress**: Scene 2 of 2

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "He wants to see what else is out there. He turns the dial toward Bold. Try both ends."

- **Headline**: "The dial"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 3: The dial.

---

### Stage 24 of 62: Round 3: The dial
- **Stage ID**: `r3_context`
- **Type**: `context`
- **Section**: Round 3
- **Round**: 3
- **Allocated Time**: 18–25m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - High-DPI HTML5 Canvas Wheel showing exact baseline slice distribution.
  - Side card breaking down the role percentages (Stay, Tech PM, Data PM, Product Manager, Growth PM, AI PM).
  - Explanation of why applicant tracking systems and recruiters weight adjacent roles far heavier than target dream roles.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 3: The dial.

---

### Stage 25 of 62: Round 3: The dial
- **Stage ID**: `r3_play`
- **Type**: `play`
- **Section**: Round 3
- **Round**: 3
- **Allocated Time**: 18–25m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - Real-time live session sync monitor showing candidate spin activity.
  - Host interactive wheel demonstrating the random spin outcome.
  - Live room tally bar chart showing what percentage of participants landed on their target slice versus incumbent roles.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Interactive Round 3 Play Engine**:
  - **Domain Alignment Test**: Candidate tests the impact of applying within their existing domain versus switching cold.

---

### Stage 26 of 62: What you saw
- **Stage ID**: `r3_reveal_1`
- **Type**: `reveal`
- **Section**: Round 3
- **Round**: 3
- **Allocated Time**: 18–25m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "What you saw"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 3: The dial.

---

### Stage 27 of 62: What the dial does?
- **Stage ID**: `r3_reveal_2`
- **Type**: `reveal`
- **Section**: Round 3
- **Round**: 3
- **Allocated Time**: 18–25m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "What the dial does"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 3: The dial.

---

### Stage 28 of 62: Which setting is right?
- **Stage ID**: `r3_reveal_3`
- **Type**: `reveal`
- **Section**: Round 3
- **Round**: 3
- **Allocated Time**: 18–25m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "Which setting is right?"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 3: The dial.

---

### Stage 29 of 62: Round 3: The dial
- **Stage ID**: `r3_hold`
- **Type**: `hold`
- **Section**: Round 3
- **Round**: 3
- **Allocated Time**: 18–25m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - Large focal takeaway card: *"{'phoneOneLiner': 'The dial reshapes the slices. Careful is repeatable. Bold explores.', 'roleLine': 'If you’re a product owner, program or scrum lead, you trade scope, time and risk every sprint. The dial is the same trade: repeatable and safe, or fresh and riskier.', 'pmMove': 'you choose the setting for each feature, and that is a prioritisation call.'}"*
  - Host prompt facilitating a 30-second silent room reflection or discussion.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 3: The dial.

---

### Stage 30 of 62: The interview prep
- **Stage ID**: `r4_story_1`
- **Type**: `story`
- **Section**: Round 4
- **Round**: 4
- **Allocated Time**: 25–32m
- **Scene Progress**: Scene 1 of 2

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "Before sending anything, Sanket asks a different wheel to describe him in one line. It answers instantly, and sounds sure."

- **Headline**: "The interview prep"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 4: Real or fake?.

---

### Stage 31 of 62: The catch
- **Stage ID**: `r4_story_2`
- **Type**: `story`
- **Section**: Round 4
- **Round**: 4
- **Allocated Time**: 25–32m
- **Scene Progress**: Scene 2 of 2

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "Some of what it says is on his resume. Some isn’t. Spin, then call it: real or fake."

- **Headline**: "The catch"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 4: Real or fake?.

---

### Stage 32 of 62: Round 4: Real or fake?
- **Stage ID**: `r4_context`
- **Type**: `context`
- **Section**: Round 4
- **Round**: 4
- **Allocated Time**: 25–32m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - High-DPI HTML5 Canvas Wheel showing exact baseline slice distribution.
  - Side card breaking down the role percentages (Stay, Tech PM, Data PM, Product Manager, Growth PM, AI PM).
  - Explanation of why applicant tracking systems and recruiters weight adjacent roles far heavier than target dream roles.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 4: Real or fake?.

---

### Stage 33 of 62: Round 4: Real or fake?
- **Stage ID**: `r4_play`
- **Type**: `play`
- **Section**: Round 4
- **Round**: 4
- **Allocated Time**: 25–32m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - Real-time live session sync monitor showing candidate spin activity.
  - Host interactive wheel demonstrating the random spin outcome.
  - Live room tally bar chart showing what percentage of participants landed on their target slice versus incumbent roles.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Interactive Round 4 Play Engine**:
  - **Proof vs Claim Verification**: Candidate evaluates verified evidence versus generic resume buzzwords.

---

### Stage 34 of 62: What happened?
- **Stage ID**: `r4_reveal_1`
- **Type**: `reveal`
- **Section**: Round 4
- **Round**: 4
- **Allocated Time**: 25–32m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "What happened"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 4: Real or fake?.

---

### Stage 35 of 62: Why it lies so smoothly?
- **Stage ID**: `r4_reveal_2`
- **Type**: `reveal`
- **Section**: Round 4
- **Round**: 4
- **Allocated Time**: 25–32m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "Why it lies so smoothly"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 4: Real or fake?.

---

### Stage 36 of 62: Confidence is not correctness
- **Stage ID**: `r4_reveal_3`
- **Type**: `reveal`
- **Section**: Round 4
- **Round**: 4
- **Allocated Time**: 25–32m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "Confidence is not correctness"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 4: Real or fake?.

---

### Stage 37 of 62: Round 4: Real or fake?
- **Stage ID**: `r4_hold`
- **Type**: `hold`
- **Section**: Round 4
- **Round**: 4
- **Allocated Time**: 25–32m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - Large focal takeaway card: *"{'phoneOneLiner': 'Sounding sure is not being right. The wheel has no ‘I don’t know’ slice.', 'roleLine': 'If you’re in risk or audit, you check claims against evidence and sample for errors. That is exactly how you test whether an AI is telling the truth.', 'pmMove': 'you define what a wrong answer costs and who checks it before a user sees it.'}"*
  - Host prompt facilitating a 30-second silent room reflection or discussion.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 4: Real or fake?.

---

### Stage 38 of 62: The question
- **Stage ID**: `r5_story_1`
- **Type**: `story`
- **Section**: Round 5
- **Round**: 5
- **Allocated Time**: 32–39m
- **Scene Progress**: Scene 1 of 3

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "Round 4 left a question: where does the wheel get its ideas about people like Sanket?"

- **Headline**: "The question"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 5: Who painted the wheel?.

---

### Stage 39 of 62: The memory
- **Stage ID**: `r5_story_2`
- **Type**: `story`
- **Section**: Round 5
- **Round**: 5
- **Allocated Time**: 32–39m
- **Scene Progress**: Scene 2 of 3

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "Imagine 100 people who, like Sanket, spent a few years as data engineers or analysts. Each dot is one person, coloured by what they became next. (An illustrative sample, not real data. The real wheel learned from millions.)"

- **Headline**: "The memory"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 5: Who painted the wheel?.

---

### Stage 40 of 62: The pattern
- **Stage ID**: `r5_story_3`
- **Type**: `story`
- **Section**: Round 5
- **Round**: 5
- **Allocated Time**: 32–39m
- **Scene Progress**: Scene 3 of 3

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "Most stayed data people. Only 4 became product managers. The wheel copies that history, so his Product Manager slice is thin."

- **Headline**: "The pattern"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 5: Who painted the wheel?.

---

### Stage 41 of 62: Round 5: Who painted the wheel?
- **Stage ID**: `r5_context`
- **Type**: `context`
- **Section**: Round 5
- **Round**: 5
- **Allocated Time**: 32–39m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - High-DPI HTML5 Canvas Wheel showing exact baseline slice distribution.
  - Side card breaking down the role percentages (Stay, Tech PM, Data PM, Product Manager, Growth PM, AI PM).
  - Explanation of why applicant tracking systems and recruiters weight adjacent roles far heavier than target dream roles.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 5: Who painted the wheel?.

---

### Stage 42 of 62: Round 5: Who painted the wheel?
- **Stage ID**: `r5_play`
- **Type**: `play`
- **Section**: Round 5
- **Round**: 5
- **Allocated Time**: 32–39m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - Real-time live session sync monitor showing candidate spin activity.
  - Host interactive wheel demonstrating the random spin outcome.
  - Live room tally bar chart showing what percentage of participants landed on their target slice versus incumbent roles.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Interactive Round 5 Play Engine**:
  - **The AI PM Expansion**: Candidate selects AI-native product skills (evals, latency tradeoffs, data loops).
  - A dedicated purple `AI PM` slice appears on their personal wheel.

---

### Stage 43 of 62: What the wheel learned from?
- **Stage ID**: `r5_reveal_1`
- **Type**: `reveal`
- **Section**: Round 5
- **Round**: 5
- **Allocated Time**: 32–39m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "What the wheel learned from"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 5: Who painted the wheel?.

---

### Stage 44 of 62: Who is in the data?
- **Stage ID**: `r5_reveal_2`
- **Type**: `reveal`
- **Section**: Round 5
- **Round**: 5
- **Allocated Time**: 32–39m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "Who is in the data"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 5: Who painted the wheel?.

---

### Stage 45 of 62: One more question?
- **Stage ID**: `r5_reveal_3`
- **Type**: `reveal`
- **Section**: Round 5
- **Round**: 5
- **Allocated Time**: 32–39m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "One more question"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 5: Who painted the wheel?.

---

### Stage 46 of 62: Round 5: Who painted the wheel?
- **Stage ID**: `r5_hold`
- **Type**: `hold`
- **Section**: Round 5
- **Round**: 5
- **Allocated Time**: 32–39m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - Large focal takeaway card: *"{'phoneOneLiner': 'The wheel repeats its past. Whoever is thin in its data is thin on the wheel.', 'roleLine': 'If you’re a data engineer or analyst, you already ask where data came from, who is missing, and whether it is clean. Bad data in, bad wheel out.', 'pmMove': 'you set the data requirements: where it comes from, who is missing, and whether people agreed.'}"*
  - Host prompt facilitating a 30-second silent room reflection or discussion.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 5: Who painted the wheel?.

---

### Stage 47 of 62: The fix
- **Stage ID**: `r6_story_1`
- **Type**: `story`
- **Section**: Round 6
- **Round**: 6
- **Allocated Time**: 39–46m
- **Scene Progress**: Scene 1 of 2

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "Sanket stops letting the wheel guess about him. He hands it his actual resume to read."

- **Headline**: "The fix"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 6: Show your sources.

---

### Stage 48 of 62: The test
- **Stage ID**: `r6_story_2`
- **Type**: `story`
- **Section**: Round 6
- **Round**: 6
- **Allocated Time**: 39–46m
- **Scene Progress**: Scene 2 of 2

#### A. Host Screen Presentation (`/live/host`)
**Host Verbatim Guidance / Narrative:**
> "Same question as Round 4: tell me one thing Sanket did. Spin without the resume first, then hand it over and spin again."

- **Headline**: "The test"
- **Visual Elements**: High-contrast story card displaying the real-life struggle of career transition, resume rejection statistics, and interview bottlenecks.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 6: Show your sources.

---

### Stage 49 of 62: Round 6: Show your sources
- **Stage ID**: `r6_context`
- **Type**: `context`
- **Section**: Round 6
- **Round**: 6
- **Allocated Time**: 39–46m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - High-DPI HTML5 Canvas Wheel showing exact baseline slice distribution.
  - Side card breaking down the role percentages (Stay, Tech PM, Data PM, Product Manager, Growth PM, AI PM).
  - Explanation of why applicant tracking systems and recruiters weight adjacent roles far heavier than target dream roles.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 6: Show your sources.

---

### Stage 50 of 62: Round 6: Show your sources
- **Stage ID**: `r6_play`
- **Type**: `play`
- **Section**: Round 6
- **Round**: 6
- **Allocated Time**: 39–46m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - Real-time live session sync monitor showing candidate spin activity.
  - Host interactive wheel demonstrating the random spin outcome.
  - Live room tally bar chart showing what percentage of participants landed on their target slice versus incumbent roles.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Interactive Round 6 Play Engine**:
  - **The Final Cohort Spin**: Candidate executes their final spin with all compound improvements active.

---

### Stage 51 of 62: What changed
- **Stage ID**: `r6_reveal_1`
- **Type**: `reveal`
- **Section**: Round 6
- **Round**: 6
- **Allocated Time**: 39–46m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "What changed"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 6: Show your sources.

---

### Stage 52 of 62: Look it up, then answer
- **Stage ID**: `r6_reveal_2`
- **Type**: `reveal`
- **Section**: Round 6
- **Round**: 6
- **Allocated Time**: 39–46m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "Look it up, then answer"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 6: Show your sources.

---

### Stage 53 of 62: How it works, in one line
- **Stage ID**: `r6_reveal_3`
- **Type**: `reveal`
- **Section**: Round 6
- **Round**: 6
- **Allocated Time**: 39–46m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "How it works, in one line"
- **Visual Elements**:
  - Side-by-side comparison cards illustrating the cognitive or structural shift.
  - Quantitative data showing why brute-force volume fails and how positioning shifts the distribution.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 6: Show your sources.

---

### Stage 54 of 62: Round 6: Show your sources
- **Stage ID**: `r6_hold`
- **Type**: `hold`
- **Section**: Round 6
- **Round**: 6
- **Allocated Time**: 39–46m

#### A. Host Screen Presentation (`/live/host`)
- **Headline**: "None"
- **Visual Elements**:
  - Large focal takeaway card: *"{'phoneOneLiner': 'Look it up, then answer. Sources let you check.', 'roleLine': 'If you’re a tech lead, you’ve built search: index the documents, find the right ones, rank them. RAG is that search feeding an answer.', 'pmMove': 'you decide how the product finds its sources and shows them to the user.'}"*
  - Host prompt facilitating a 30-second silent room reflection or discussion.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Round 6: Show your sources.

---

### Stage 55 of 62: Spot it · 1 of 3
- **Stage ID**: `e1_spot_1`
- **Type**: `e1_spot`
- **Section**: Ending
- **Round**: 7
- **Allocated Time**: 46–49m

#### A. Host Screen Presentation (`/live/host`)
- **Spot It Challenge 1 of 3**:
  - **Ground Truth Source Line**: *"Returns are accepted within 14 days. A 10% restocking fee applies."*
  - **AI Model Claim**: *"Returns are accepted within 30 days with no restocking fee."*
  - **Matches Truth?**: **NO (Hallucination / Error)**
  - **Verbatim Explanation**: *"Doesn’t match. The source says 14 days and a 10% restocking fee."*

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Interactive Spot It Quiz**:
  - Candidate reviews the AI output against the ground truth line on their mobile screen.
  - Two large tap targets: **"Matches (Grounded)"** vs **"Doesn’t Match (Hallucination)"**.
  - Instant feedback with colored badge and reasoning.

---

### Stage 56 of 62: Spot it · 2 of 3
- **Stage ID**: `e1_spot_2`
- **Type**: `e1_spot`
- **Section**: Ending
- **Round**: 7
- **Allocated Time**: 46–49m

#### A. Host Screen Presentation (`/live/host`)
- **Spot It Challenge 2 of 3**:
  - **Ground Truth Source Line**: *"Managed and mentored two interns… both being considered for Pre-Placement Offers."*
  - **AI Model Claim**: *"Sanket mentored two interns, both considered for pre-placement offers."*
  - **Matches Truth?**: **YES (Grounded)**
  - **Verbatim Explanation**: *"Matches. Every claim is grounded in the source line."*

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Interactive Spot It Quiz**:
  - Candidate reviews the AI output against the ground truth line on their mobile screen.
  - Two large tap targets: **"Matches (Grounded)"** vs **"Doesn’t Match (Hallucination)"**.
  - Instant feedback with colored badge and reasoning.

---

### Stage 57 of 62: Spot it · 3 of 3
- **Stage ID**: `e1_spot_3`
- **Type**: `e1_spot`
- **Section**: Ending
- **Round**: 7
- **Allocated Time**: 46–49m

#### A. Host Screen Presentation (`/live/host`)
- **Spot It Challenge 3 of 3**:
  - **Ground Truth Source Line**: *"Improved team efficiency by 15%…"*
  - **AI Model Claim**: *"Sanket raised team efficiency by 50%."*
  - **Matches Truth?**: **NO (Hallucination / Error)**
  - **Verbatim Explanation**: *"Doesn’t match. The source says 15%, not 50%."*

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Interactive Spot It Quiz**:
  - Candidate reviews the AI output against the ground truth line on their mobile screen.
  - Two large tap targets: **"Matches (Grounded)"** vs **"Doesn’t Match (Hallucination)"**.
  - Instant feedback with colored badge and reasoning.

---

### Stage 58 of 62: The AI PM Analogy
- **Stage ID**: `e2_story`
- **Type**: `e2_story`
- **Section**: Ending
- **Round**: 8
- **Allocated Time**: 49–52m

#### A. Host Screen Presentation (`/live/host`)
- **The AI PM Analogy Flowchart**:
  - Full 3-column architectural comparison: `[ Classic PM ]` -> `[ What shifts ]` -> `[ AI PM ]`.
  - 8 Interactive rows connecting foundational PM skills with their AI extensions.
  - Dynamic curved SVG arrow linking Row 8 (*"Replace: feature moat with data + trust moat"*) directly into Row 6 (*"Data flywheel"*).
  - Interactive click listener on every card that opens a deep-dive concept explainer popup.
  - Verbatim closing quote: *“Nothing is thrown away — every classic PM skill has an AI-native extension. The shift is in how you think, not how much you know.”*

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: *"Look at the main screen for the Classic PM vs AI PM breakdown".*

---

### Stage 59 of 62: Your map
- **Stage ID**: `e3_map`
- **Type**: `e3_map`
- **Section**: Ending
- **Round**: 9
- **Allocated Time**: 52–55m

#### A. Host Screen Presentation (`/live/host`)
- **Your Map (Transition Architecture)**:
  - 4 AI PM Archetypes: Workflow Automator, Copilot Builder, Autonomous Agent Designer, Model Fine-Tuner.
  - 5 Foundational Transition Skills linking candidate existing capabilities into high-leverage AI PM roles.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Visual Layout**: Fullscreen centered card.
- **Pill Indicator**: Section / Round Tag.
- **Animated Status Element**: Continuous calm spinner (`.calm-spinner`).
- **Primary Directive**: **`Watch the host.`**
- **Subtext**: Contextual message instructing the user to observe the host screen for Your map.

---

### Stage 60 of 62: The AI interview game
- **Stage ID**: `e4_next`
- **Type**: `e4_next`
- **Section**: What’s next
- **Round**: 10
- **Allocated Time**: 55–58m

#### A. Host Screen Presentation (`/live/host`)
- **The AI Interview Game & 12-Week Cohort Overview**:
  - 3 Core Pillars: 1. The Application Process, 2. The Interview Practice, 3. The Toolkit.
  - Renders the complete **12-Week Cohort Breakdown**, **Is This For You**, and **What You Walk Away With**.
  - Prominent WhatsApp 1:1 consultation button linking directly to mentors.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Mobile Cohort Curriculum Guide**:
  - Header banner with badge, cohort title, and core mandate.
  - Scrollable week-by-week cards for all 12 weeks with deliverables.
  - Interactive checklist cards: *"This is for you if"* vs *"This is NOT for you if"*.
  - Walk-away deliverables card highlighting the 5 core portfolio assets.
  - Direct 1:1 WhatsApp Consultation button (`https://wa.me/message/GH5C7YLAYIEHN1`).

---

### Stage 61 of 62: AI PM Course Curriculum
- **Stage ID**: `e5_brochure`
- **Type**: `e5_brochure`
- **Section**: Curriculum
- **Round**: 11
- **Allocated Time**: 58–62m

#### A. Host Screen Presentation (`/live/host`)
- **Comprehensive AI PM Cohort Curriculum (Deep Dive)**:
  - Verbatim presentation of all 12 weekly deliverables, qualification criteria, walk-away proof assets, fee (₹30,000), 15-seat limit, and mentor bios.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Mobile Cohort Curriculum Guide**:
  - Header banner with badge, cohort title, and core mandate.
  - Scrollable week-by-week cards for all 12 weeks with deliverables.
  - Interactive checklist cards: *"This is for you if"* vs *"This is NOT for you if"*.
  - Walk-away deliverables card highlighting the 5 core portfolio assets.
  - Direct 1:1 WhatsApp Consultation button (`https://wa.me/message/GH5C7YLAYIEHN1`).

---

### Stage 62 of 62: Questions
- **Stage ID**: `qa`
- **Type**: `qa`
- **Section**: Q&A
- **Round**: 11
- **Allocated Time**: 60–70m

#### A. Host Screen Presentation (`/live/host`)
- **Interactive Q&A Session**:
  - Open-floor host screen with prompt cards, contact links, and WhatsApp 1:1 reservation link.

#### B. Candidate Phone Screen Experience (`/live/phone`)
- **Q&A Companion Screen**:
  - Prompt fields and direct WhatsApp link for 1:1 cohort booking.

---

## 4. Deep Dive: Stage 58 — The AI PM Analogy Table (Verbatim)

| # | Classic PM | What shifts | AI PM | Concept Deep Dive |
|---|------------|-------------|-------|-------------------|
| 1 | **Problem framing**<br>*Is this worth building?* | **Add: is AI the right fit?** | **AI opportunity brief**<br>*Data fit · error cost · archetype* | Classic PM asks if the problem is painful and worth solving. AI PM must first evaluate if AI is actually the right tool, what errors cost, and if training data or prompt architectures can realistically support it. |
| 2 | **Requirements**<br>*Deterministic spec* | **Shift: specify constraints, not exact behaviour** | **Probabilistic PRD**<br>*Hallucination rate · pass criteria* | Classic PRDs dictate deterministic if-then logic. Probabilistic PRDs define acceptable error margins, hallucination thresholds, guardrails, and statistical acceptance criteria. |
| 3 | **Success metrics**<br>*DAU · NPS · conversion* | **Add: model quality layer beneath product metrics** | **AI metric stack**<br>*Task rate · override rate · cost* | Beyond high-level business KPIs, AI PMs measure task completion rate, human override frequency, latency, token spend, and factual accuracy. |
| 4 | **QA and done**<br>*Test cases pass / fail* | **Replace: binary pass/fail becomes statistical gate** | **Eval set design**<br>*50+ cases · rubric · regression* | QA is no longer a checklist of passes and fails. AI PMs curate golden benchmark datasets (50+ challenging edge cases) with rubric scoring and automated regression evals. |
| 5 | **Launch**<br>*Feature flag · rollout · GA* | **Add: eval gate before any rollout begins** | **Gated AI rollout**<br>*Eval gate · guardrails · UX trust* | Rollouts require statistical verification at each step, safety filters, fallback UI states, and trust-building UX that clearly frames AI assistance. |
| 6 | **Post-launch**<br>*Monitor KPIs · bug triage* | **Add: model drift · feedback loop as product design** | **Data flywheel**<br>*Drift watch · override logging* | Models drift over time as user inputs shift. Continuous logging of user corrections and overrides feeds back into fine-tuning and retrieval context. |
| 7 | **Stakeholder comms**<br>*Roadmap · status · risk* | **Add: explain probabilistic outcomes in plain language** | **Tradeoff memo**<br>*Latency · cost · quality in plain terms* | Stakeholders need clear framing around latency vs cost vs accuracy tradeoffs, communicating probabilistic risks in simple business terms. |
| 8 | **Strategy**<br>*Differentiation · roadmap* | **Replace: feature moat with data + trust moat** | **AI moat strategy**<br>*Data · trust · fine-tune lock-in* | Features are easily cloned by foundation models. The real sustainable advantage lies in proprietary data loops, user trust, workflow lock-in, and domain fine-tuning. |

> **Loop Rule**: An SVG connector links Row 8 (*AI moat strategy / data + trust moat*) to Row 6 (*Data flywheel*), demonstrating how product data loops compound advantages over generic foundation models.

---

## 5. Deep Dive: Stage 61 — The AI PM 12-Week Cohort Curriculum (Verbatim)

### Cohort Header: **The AI PM Cohort**
- **Tagline**: 12 weeks. One real AI product. Built from your own domain.
- **Mandate**: *"You are an experienced professional who works around AI and wants to build with it. Your mandate for 12 weeks: pick one real problem from your own work and ship an AI product that solves it."*

### The 12 Weeks Breakdown (One Deliverable Every Week):
| Week | Phase | Topic / Deliverable | Detail |
|------|-------|---------------------|--------|
| Week 01 | `Problem space` | **Problem Brief** | Pick one real problem from your own work. Write who has it, how often, and the evidence. |
| Week 02 | `Problem space` | **AI Brief** | Decide if AI is even the answer. Set one success number and write a one-page brief. |
| Week 03 | `How AI behaves` | **Behaviour Log** | Test your problem across prompts and models. Record where answers vary, drift or go confidently wrong. |
| Week 04 | `How AI behaves` | **Prototype v1** | Give the AI your own documents. Build a first version that answers them. |
| Week 05 | `Make it trustworthy` | **Test Set** | Write 20 known cases with right answers. Score your prototype against them. |
| Week 06 | `Make it trustworthy` | **Agent Sketch** | Design an agent on one page: its goal, its tools, and what it must never do. |
| Week 07 | `Make it trustworthy` | **Safety Plan** | Add guardrails and approval points. List three ways it fails and how you will catch each. |
| Week 08 | `Design and ship` | **AI PRD** | Turn your brief and test results into a PRD an engineering team could build from. |
| Week 09 | `Design and ship` | **Build Sprint** | Ship a working version of your product and put it in front of three real users. |
| Week 10 | `Design and ship` | **Launch Plan** | Work out the cost per use, what you will monitor, and how the product improves after launch. |
| Week 11 | `Proof & positioning` | **Proof Pack** | Turn the build into a portfolio case study and a LinkedIn story. |
| Week 12 | `Proof & positioning` | **Demo Day** | Demo your product, then run a full mock interview loop on it. |

### Fit Criteria:
#### This is for you if:
- [x] You are an analyst, QA, BA, product owner, program, data, risk or tech role
- [x] You use AI at work and want to explain it with confidence
- [x] You want to move toward product or AI product work
- [x] You can give about 6 hours a week and build every week

#### This is NOT for you if:
- [ ] You are a student or fresher
- [ ] You want to learn to code AI systems from scratch
- [ ] You want a job guarantee
- [ ] You would rather watch than build

### What You Walk Away With (5 Core Assets):
- **A working AI product, built on a problem from your own domain**
- **An AI PRD and a 20-case test set that show how you think, not just what you built**
- **A portfolio case study and a LinkedIn story you can use in interviews**
- **A plain way to explain how AI products behave, to engineers, bosses and interviewers**
- **A full mock interview loop, run on your own product**
> **Promise**: *"We don’t promise a job. We promise proof you can defend."*

### How It Runs:
- One live build session a week
- Every session opens with something you play on your phone, then you build
- Feedback on every deliverable
- 1:1 checkpoints at weeks 4, 8 and 12
- Session recordings to catch up
- Tool list shared before week 1

### Joining Logistics & Investment:
- **Rule**: **You don’t join by paying. You join by talking.**
- **Admissions Process**: We choose who joins. After this session, apply for a 15-minute call. We look at where you are, what you want to build, and whether this cohort is right for you right now.
- **Tuition**: **INR ₹30,000 for all 12 weeks**
- **Start Date**: **December 1st Week**
- **Cohort Capacity**: **Capped at 15**
- **Direct 1:1 WhatsApp Link**: [https://wa.me/message/GH5C7YLAYIEHN1](https://wa.me/message/GH5C7YLAYIEHN1)

### Mentors:
- **Sanket**: Data engineer turned product manager · IIT Kanpur alum · Mastercard
- **Ankit**: Senior Product Manager · IIM Bangalore alum · Microsoft