export const INTERVIEW_CATEGORIES = [
  "All Categories",
  "Behavioral & HR",
  "Case Study",
  "Guesstimate",
  "Metrics & Analytics",
  "Product Design",
  "Product Improvement",
  "Product Strategy",
  "Technical Architecture",
  "Root Cause Analysis (RCA)",
  "Puzzles & Quantitative Logic"
];

export const INTERVIEW_COMPANIES = [
  "All Companies",
  "Flipkart",
  "Zomato",
  "Swiggy",
  "Uber",
  "Sprinklr",
  "Groww",
  "Razorpay",
  "Meesho",
  "CRED",
  "MakeMyTrip",
  "Google",
  "Meta",
  "Netflix",
  "HiLabs",
  "MX Player",
  "Ola",
  "Innovaccer",
  "Z1 Tech",
  "Airbnb",
  "General / IIT Casebooks"
];

export const ALL_INTERVIEW_QUESTIONS = [
  // --- BEHAVIORAL & HR ---
  {
    id: "q-beh-1",
    category: "Behavioral & HR",
    company: "Innovaccer",
    question: "Questions about background and other behavioural questions.",
    description: "Behavioral background evaluation focusing on past engineering projects, team dynamics, and problem solving."
  },
  {
    id: "q-beh-2",
    category: "Behavioral & HR",
    company: "BCG, Meesho, Alvarez & Marsal, HiLabs",
    question: "A few basic HR questions (1-2 questions).",
    description: "Standard motivation, strengths/weaknesses, career transition story, and culture-fit assessment."
  },
  {
    id: "q-beh-3",
    category: "Behavioral & HR",
    company: "Publicis Sapient, Meesho, Schlumberger",
    question: "Conversation about college festival leadership role as a head, difficulties faced, how to convince higher authority. Discussion on current LLMs.",
    description: "Managing stakeholders, resolving conflict, leadership trade-offs, and opinions on how generative AI / LLMs shape tech products."
  },
  {
    id: "q-beh-4",
    category: "Behavioral & HR",
    company: "Meesho, Finmechanics, Indus Insights",
    question: "Introduce yourself. Explain your work at the internship. Why join this company? Why switch from engineering discipline?",
    description: "Personal motivation narrative: connecting technical background and internship experience to product management."
  },
  {
    id: "q-beh-5",
    category: "Behavioral & HR",
    company: "General / Flipkart",
    question: "Tell me about yourself.",
    description: "Standard opener. Walk through CV highlighting key product management, engineering, and leadership milestones."
  },
  {
    id: "q-beh-6",
    category: "Behavioral & HR",
    company: "MakeMyTrip / Groww / Flipkart",
    question: "Why do you want to work in Product Management? / Why PM? Why you?",
    description: "Explain personal PM journey: tie past tech development, business skills, leadership roles, and user empathy to the PM role."
  },
  {
    id: "q-beh-7",
    category: "Behavioral & HR",
    company: "MakeMyTrip / Groww / Flipkart",
    question: "Why switch from Agri/Mechanical Engineering to PM? Why MMT / Groww / Flipkart?",
    description: "Explain transitions or specific motivations: highlight why the target company's business model and culture interest you."
  },
  {
    id: "q-beh-8",
    category: "Behavioral & HR",
    company: "Z1 Tech",
    question: "Tell me about your work/skills. Your favorite product – why you like it and improvements?",
    description: "Describe how your skill set applies to PM. Identify a favorite product, analyze its UX, suggest features, and explain metrics."
  },
  {
    id: "q-beh-9",
    category: "Behavioral & HR",
    company: "General / Z1 Tech",
    question: "Describe a project where you used data to make a decision.",
    description: "STAR method. Explain the business problem, metrics tracked, data analysis findings, and the resulting change in product direction."
  },
  {
    id: "q-beh-10",
    category: "Behavioral & HR",
    company: "Ola / General",
    question: "Describe a time you handled conflict in a team.",
    description: "STAR method. Detail a team disagreement, the listening and communication strategies used, and the positive resolution."
  },
  {
    id: "q-beh-11",
    category: "Behavioral & HR",
    company: "General",
    question: "Was there a time when you and your teammate had a clash of opinion during a project? How did you handle it?",
    description: "Behavioral conflict resolution and peer alignment."
  },
  {
    id: "q-beh-12",
    category: "Behavioral & HR",
    company: "General",
    question: "How would you plan a project in a team? If you are an expert in Domain A, but your team member wants to lead, how would you handle it?",
    description: "Leadership vs delegation and collaborative team alignment."
  },
  {
    id: "q-beh-13",
    category: "Behavioral & HR",
    company: "MX Player",
    question: "Why product management? Why MX Player?",
    description: "Fit evaluation for media streaming and ad-supported OTT platforms."
  },
  {
    id: "q-beh-14",
    category: "Behavioral & HR",
    company: "CRED",
    question: "Why CRED?",
    description: "High-trust credit ecosystem product understanding and brand motivation."
  },
  {
    id: "q-beh-15",
    category: "Behavioral & HR",
    company: "Meesho",
    question: "Walk me through your work experience and how it maps to Meesho's business model.",
    description: "Map engineering or design projects to social commerce and seller enablement."
  },
  {
    id: "q-beh-16",
    category: "Behavioral & HR",
    company: "Meesho",
    question: "Why Meesho, and general product-sense questions on Meesho's seller model.",
    description: "E-commerce platform mechanics and tier-2/3 consumer insights."
  },
  {
    id: "q-beh-17",
    category: "Behavioral & HR",
    company: "Ola / Ola Electric",
    question: "Deep-dive into your most impactful past project: what were your exact individual trade-offs and metrics?",
    description: "Technical trade-offs, resource constraints, and outcome metrics."
  },
  {
    id: "q-beh-18",
    category: "Behavioral & HR",
    company: "Razorpay",
    question: "What does your current company's forward-looking business strategy look like, and how does it differ from competitors?",
    description: "Strategic awareness, competitive differentiation, and business moat."
  },

  // --- CASE STUDY ---
  {
    id: "q-cs-1",
    category: "Case Study",
    company: "General / IIT Casebooks",
    question: "Market sizing case study: Estimate the total number of operational Air Conditioners currently running in the city of Kanpur.",
    description: "Segment by residential vs commercial (offices, labs, hospitals, retail). Calculate total households, penetration rate per income tier, and commercial floor area."
  },
  {
    id: "q-cs-2",
    category: "Case Study",
    company: "Swiggy",
    question: "Dark-Store Demand Case Study: Predict product demands for a specific dark-store in a particular area of a city.",
    description: "Develop a database schema of order history, local demographic density, weather patterns, and select ML algorithms (XGBoost/LightGBM) to forecast stock."
  },
  {
    id: "q-cs-3",
    category: "Case Study",
    company: "General / IIT Casebooks",
    question: "Product Launch Case Study: A company is launching a new car insurance product. Determine primary and secondary data factors for policy pricing.",
    description: "Define risk parameters: vehicle age, driver safety score, telematics data, geographic risk zones, and competitor benchmark pricing."
  },
  {
    id: "q-cs-4",
    category: "Case Study",
    company: "General / IIT Casebooks",
    question: "Customer Churn Case Study: Identify features to train an ML model to predict customer churning for SIM card services.",
    description: "Track drop in call volume, data usage spikes/drops, customer support ticket frequency, network complaints, and competitor SIM ports."
  },
  {
    id: "q-cs-5",
    category: "Case Study",
    company: "Innovaccer",
    question: "Destination Hackathon: Operational bottleneck resolution & presentation for supply chain logistics.",
    description: "Identify supply chain bottlenecks, inventory turnover ratios, and operational workflow optimizations."
  },

  // --- GUESSTIMATE ---
  {
    id: "q-gues-1",
    category: "Guesstimate",
    company: "General / IIT Casebooks",
    question: "Estimate the weekly total revenue of a PVR cinema complex & total active laptops in India.",
    description: "Screen occupancy rate, ticket price tiers, F&B multiplier, and laptop replacement cycle."
  },
  {
    id: "q-gues-2",
    category: "Guesstimate",
    company: "General / IIT Casebooks",
    question: "Logistics Guesstimate: Estimate how many standard-sized Coke bottles can physically fit inside a standard state roadways bus.",
    description: "Calculate volume of interior bus space minus seats/aisles divided by bottle volume with packing fraction."
  },
  {
    id: "q-gues-3",
    category: "Guesstimate",
    company: "General / IIT Casebooks",
    question: "Live Trading Guesstimate: Estimate the average price of flying first class from Lucknow to Sydney with live trade simulation.",
    description: "Airline yield management, flight leg connections, class premium ratio, and confidence intervals."
  },
  {
    id: "q-gues-4",
    category: "Guesstimate",
    company: "General / IIT Casebooks",
    question: "Market Sizing: Estimate the total number of vehicles getting repaired on a daily basis in a busy automotive service outlet in Delhi.",
    description: "Bay count, average service time per vehicle, operating hours, and mechanic shift capacity."
  },
  {
    id: "q-gues-5",
    category: "Guesstimate",
    company: "General / IIT Casebooks",
    question: "Volume Guesstimate: Estimate the total number of windows present across the entire IIT Kanpur campus.",
    description: "Building types: hostel blocks, department labs, faculty quarters, library, and window density per sq ft."
  },
  {
    id: "q-gues-6",
    category: "Guesstimate",
    company: "Ola",
    question: "Estimate the number of people watching Anime on a Friday evening in India.",
    description: "Gen Z / Millennial youth demographics, high-speed internet penetration, OTT platform catalog access."
  },
  {
    id: "q-gues-7",
    category: "Guesstimate",
    company: "Innovaccer",
    question: "What is the famous dish from Kanpur and guess the total number of that item sold in a day in Kanpur?",
    description: "Local street food consumption sizing, stall density, peak time sales volume."
  },
  {
    id: "q-gues-8",
    category: "Guesstimate",
    company: "Meesho",
    question: "Revenue of a small car service center in Delhi.",
    description: "Daily car throughput, average repair bill size, spare part margins, labor revenue."
  },
  {
    id: "q-gues-9",
    category: "Guesstimate",
    company: "Flipkart",
    question: "Estimate the number of pairs of shoes sold online in Delhi via Flipkart in one day.",
    description: "Estimate online shoe sales for Flipkart in Delhi. Base calculation on population (~20M), internet users, online shoppers, shoe purchase frequency, and Flipkart market share."
  },
  {
    id: "q-gues-10",
    category: "Guesstimate",
    company: "Sprinklr",
    question: "Estimate the number of WhatsApp messages sent in your city per day.",
    description: "Base calculation on metropolitan population, active smartphone users, WhatsApp penetration (~85%), and average messages per user per day."
  },
  {
    id: "q-gues-11",
    category: "Guesstimate",
    company: "Sprinklr",
    question: "Total number of traffic lights in a metropolitan city like Delhi/Mumbai.",
    description: "Estimate city traffic lights using city grid size (intersections per sq km), major road arteries vs residential lanes."
  },
  {
    id: "q-gues-12",
    category: "Guesstimate",
    company: "Media.net",
    question: "Estimate the total number of babies born in India in a single day.",
    description: "Base on India's population (~1.4B), crude birth rate (~16-17 per 1,000 people per year), and divide by 365 days."
  },
  {
    id: "q-gues-13",
    category: "Guesstimate",
    company: "HiLabs",
    question: "Estimate the number of iPhone users in India.",
    description: "Estimate premium smartphone ownership. Base on population, smartphone penetration (~50%), income tier distribution (top 3%), and Apple's market share."
  },
  {
    id: "q-gues-14",
    category: "Guesstimate",
    company: "HiLabs",
    question: "Number of tea cups sold per day on the IIT campus.",
    description: "Campus sizing: students, professors, staff, daily tea consumption frequency, canteen/stall count."
  },
  {
    id: "q-gues-15",
    category: "Guesstimate",
    company: "Flipkart",
    question: "How many cars are there in Delhi?",
    description: "Calculate car count in Delhi. Analyze household count, household income segments, car ownership rates per income tier, and commercial car numbers."
  },
  {
    id: "q-gues-16",
    category: "Guesstimate",
    company: "Groww",
    question: "Estimate the number of swimming pools in India.",
    description: "Hotel chains, luxury residential societies, sports complexes, schools/universities count."
  },
  {
    id: "q-gues-17",
    category: "Guesstimate",
    company: "Groww",
    question: "Estimate total emails sent on Gmail every day worldwide.",
    description: "Active Gmail accounts (1.8B+), consumer vs corporate usage split, transactional/automated email volume."
  },
  {
    id: "q-gues-18",
    category: "Guesstimate",
    company: "Groww",
    question: "Estimate the alcohol consumption of a specific city like Bangalore.",
    description: "Adult population, drinking demographic percentage, bar/pub throughput, retail liquor store sales volume."
  },
  {
    id: "q-gues-19",
    category: "Guesstimate",
    company: "Swiggy",
    question: "Estimate AC (air conditioner) sales in India per year.",
    description: "Urban household growth, middle-class expansion, replacement market, commercial installation."
  },
  {
    id: "q-gues-20",
    category: "Guesstimate",
    company: "Zomato",
    question: "Estimate popcorn sales at movie theatres across India in a weekend.",
    description: "Multiplex screens, weekend footfall, concession conversion rate (~40%), average tub price."
  },
  {
    id: "q-gues-21",
    category: "Guesstimate",
    company: "Groww",
    question: "Estimate the daily UPI transaction value in India.",
    description: "Active UPI users (~350M), average daily transactions per user (2-3), and average transaction value (₹800-₹1,200)."
  },
  {
    id: "q-gues-22",
    category: "Guesstimate",
    company: "MakeMyTrip",
    question: "How many Air India flights fly on a Delhi-Mumbai route daily?",
    description: "Route capacity, airline market share, aircraft turn-around times, daily slot allocations."
  },
  {
    id: "q-gues-23",
    category: "Guesstimate",
    company: "MX Player",
    question: "Determine the market size for iPhone users in India.",
    description: "Market sizing framework for premium device users and app monetization potential."
  },

  // --- METRICS & ANALYTICS ---
  {
    id: "q-met-1",
    category: "Metrics & Analytics",
    company: "Flipkart",
    question: "What are the relevant seller-side metrics for Flipkart PMs to track?",
    description: "Identify seller-side KPIs: onboarding time, product listing rejection rate, out-of-stock rate, fulfillment delay, seller rating, and merchant churn."
  },
  {
    id: "q-met-2",
    category: "Metrics & Analytics",
    company: "Airbnb",
    question: "Prepare an executive dashboard of 5 crucial metrics for Airbnb's CEO.",
    description: "Select 5 executive KPIs: Gross Booking Value (GBV), Nights Booked, Guest Net Promoter Score (NPS), Host Retention Rate, and Customer Acquisition Cost (CAC)."
  },
  {
    id: "q-met-3",
    category: "Metrics & Analytics",
    company: "MX Player",
    question: "Identify the metrics/KPIs you'd use to measure the success of an app.",
    description: "Define framework for app metrics: Acquisition (downloads), Activation (signups), Engagement (DAU/MAU, session duration), Retention, and Revenue."
  },
  {
    id: "q-met-4",
    category: "Metrics & Analytics",
    company: "Zomato",
    question: "What metrics would you track for Instagram's share feature?",
    description: "Analyze share button KPIs: Shares per Active User, share conversion rate (recipient opening link), share type distribution (DM vs external), and virality coefficient."
  },
  {
    id: "q-met-5",
    category: "Metrics & Analytics",
    company: "Zomato",
    question: "Which of four Zomato cloud kitchens in Bangalore would you shut down?",
    description: "Operational analysis: assess kitchen metrics including rent costs, order volumes, average prep delay, food wastage rate, and customer feedback to choose."
  },
  {
    id: "q-met-6",
    category: "Metrics & Analytics",
    company: "Zomato",
    question: "What metrics define a successful cloud kitchen?",
    description: "Formulate kitchen success parameters: Order volumes, food cost percentage, average ticket size, prep time, runner pickup delay, and repeat customer rate."
  },
  {
    id: "q-met-7",
    category: "Metrics & Analytics",
    company: "Zomato",
    question: "Given a table Orders(order_id, user_id, amount, order_date) and Users(user_id, city), write an SQL query to find the top 5 cities by total order amount last year.",
    description: "SQL query task: join tables, filter order_date, group by city, order by total revenue descending, and limit results to top 5."
  },
  {
    id: "q-met-8",
    category: "Metrics & Analytics",
    company: "Zomato",
    question: "Write an SQL query to compute the average session duration per user given a Sessions(session_id, user_id, duration_sec) table.",
    description: "SQL query task: group sessions by user_id and average the duration field."
  },
  {
    id: "q-met-9",
    category: "Metrics & Analytics",
    company: "CRED",
    question: "Build a dashboard: what KPIs would you track, on the spot?",
    description: "Member credit score distribution, bill payment success rate, reward redemption frequency, drop-off rate."
  },
  {
    id: "q-met-10",
    category: "Metrics & Analytics",
    company: "CRED",
    question: "How would you analyze the health of a cab company? List 5 metrics.",
    description: "Ride fulfillment rate, driver utilization, average wait time, customer rating, trip cancellation rate."
  },
  {
    id: "q-met-11",
    category: "Metrics & Analytics",
    company: "CRED",
    question: "Write a SQL query using self-joins and window functions to extract user retention cohorts.",
    description: "Cohort retention analysis using LAG(), LEAD(), and date difference functions."
  },
  {
    id: "q-met-12",
    category: "Metrics & Analytics",
    company: "Sprinklr",
    question: "You are a PM at Airbnb. Your CEO has ordered you to prepare a dashboard of 5 crucial metrics that they need to see every morning.",
    description: "Devise 5 crucial metrics: GBV, cancellation rate, active host listings, guest NPS, customer support escalation rate."
  },
  {
    id: "q-met-13",
    category: "Metrics & Analytics",
    company: "Google",
    question: "What should be the North Star Metric for Google Maps?",
    description: "Focus on user utility: 'Successful Navigation Trips Completed' or 'Useful Local Discoveries'."
  },
  {
    id: "q-met-14",
    category: "Metrics & Analytics",
    company: "Google",
    question: "You are the PM for Google Cloud Storage – How would you measure success?",
    description: "Storage volume consumed (Petabytes), SLA uptime compliance (99.99%), data transfer egress bandwidth, customer churn."
  },

  // --- PRODUCT DESIGN ---
  {
    id: "q-pd-1",
    category: "Product Design",
    company: "Swiggy",
    question: "How would you design a table reservation feature for Swiggy?",
    description: "Design a feature enabling users to reserve dining tables. Focus on user needs, reservation booking flow, partner merchant interface, real-time availability, and success metrics."
  },
  {
    id: "q-pd-2",
    category: "Product Design",
    company: "Zomato",
    question: "How would you improve the large order feature with respect to dining on Zomato?",
    description: "Propose features to enhance group or large-scale food ordering for diners. Focus on shared cart mechanics, group discounts, delivery coordination, and UI updates."
  },
  {
    id: "q-pd-3",
    category: "Product Design",
    company: "Uber",
    question: "Design a lost-item retrieval system for Uber.",
    description: "Create a seamless workflow for passengers to report and retrieve lost items from Uber rides. Address driver coordination, security/verification, communication channels, and tracking."
  },
  {
    id: "q-pd-4",
    category: "Product Design",
    company: "Uber",
    question: "Design a rewards program for Uber. What would it look like and how would you roll it out?",
    description: "Propose a loyalty/rewards system. Define tiers, reward types (rides, eats, partner benefits), qualification criteria, roll-out strategy (regional pilot), and success metrics."
  },
  {
    id: "q-pd-5",
    category: "Product Design",
    company: "Sprinklr",
    question: "Improve Twitter. Propose features to increase user engagement, content quality, creator monetization, or reduce spam.",
    description: "Engagement mechanisms, algorithmic feed improvements, creator monetization tools."
  },
  {
    id: "q-pd-6",
    category: "Product Design",
    company: "Sprinklr",
    question: "Optimize Google Drive storage. Propose feature updates to help users manage and clean up Drive storage.",
    description: "Suggest intelligent file cleanup, duplicate checkers, large attachment alerts, and prompt UI UX."
  },
  {
    id: "q-pd-7",
    category: "Product Design",
    company: "Sprinklr",
    question: "Turn WhatsApp into a super-app where users can complete end-to-end actions.",
    description: "Design an expansion roadmap to integrate ride-hailing, shopping, payments, and utilities directly into WhatsApp interface."
  },
  {
    id: "q-pd-8",
    category: "Product Design",
    company: "Sprinklr",
    question: "Design a digital product for legal awareness (booking PILs/finding lawyers) in India.",
    description: "Design a platform to help citizens learn their rights, find legal aid, hire lawyers, and initiate PILs. Address accessibility and trust."
  },
  {
    id: "q-pd-9",
    category: "Product Design",
    company: "HiLabs",
    question: "Design a food delivery service for Amazon.",
    description: "Design Amazon's entry into food delivery. Propose how it leverages Prime, integration with Amazon app, logistics network, and vendor onboarding."
  },
  {
    id: "q-pd-10",
    category: "Product Design",
    company: "Flipkart",
    question: "Design a group-buy feature for Flipkart.",
    description: "Design a collective buying model. Detail user journey, viral loops (sharing with friends for discounts), group formation limits, order fulfillment, and metrics."
  },
  {
    id: "q-pd-11",
    category: "Product Design",
    company: "Groww",
    question: "Design a subscription model for Groww's users.",
    description: "Outline a subscription model for Groww. Detail target demographics, premium features (advisory, portfolio health, advanced charts), pricing strategy, and launch plan."
  },
  {
    id: "q-pd-12",
    category: "Product Design",
    company: "Z1 Tech",
    question: "Product design: How would you design product X for use case Y?",
    description: "Framework-driven product design. Clarify goals, segment users, prioritize user pain points, brainstorm features, evaluate trade-offs, and define MVP."
  },
  {
    id: "q-pd-13",
    category: "Product Design",
    company: "Flipkart",
    question: "Find a problem in the post-pandemic world that can be solved with a product.",
    description: "Specify target users, core problem statement, solution design, success metrics, and potential pitfalls."
  },
  {
    id: "q-pd-14",
    category: "Product Design",
    company: "Flipkart",
    question: "Your client is Facebook (India). They're facing a fake news problem. Should they solve it? If yes, how?",
    description: "Third-party fact-checking API, user reporting flags, reach down-ranking algorithms, and viral forward friction."
  },
  {
    id: "q-pd-15",
    category: "Product Design",
    company: "Flipkart",
    question: "Design a 30-minute meal solution app for urban professionals.",
    description: "Curated ready-to-cook meal kits, hyper-local dark kitchen dispatch, low prep time UI UX."
  },
  {
    id: "q-pd-16",
    category: "Product Design",
    company: "Zomato",
    question: "Design a data and insights-related product for restaurants leveraging Zomato's existing data.",
    description: "Merchant analytics portal: demand forecasting, dish pricing benchmark, competitor radius analysis, and peak hour staffing insights."
  },
  {
    id: "q-pd-17",
    category: "Product Design",
    company: "MakeMyTrip",
    question: "Pitch a product that solves any real-life problem.",
    description: "Pitch from scratch: user pain point, MVP feature set, value proposition, monetization model, and key metrics."
  },
  {
    id: "q-pd-18",
    category: "Product Design",
    company: "Meta",
    question: "Design an application like LinkedIn for Gig workers.",
    description: "Rating system, skill verification, instant daily payout wallet, and hyper-local shift booking."
  },
  {
    id: "q-pd-19",
    category: "Product Design",
    company: "Netflix",
    question: "Design a gamification engine for users on Netflix to increase engagement.",
    description: "Interactive trivia, badges, watch-party streaks, and unlockable avatar rewards."
  },
  {
    id: "q-pd-20",
    category: "Product Design",
    company: "Razorpay",
    question: "Design a mobile app for Swiggy's delivery executives.",
    description: "Driver ergonomics, single-tap order acceptance, heatmaps of high demand areas, clear payout breakdowns, and safety SOS."
  },
  {
    id: "q-pd-21",
    category: "Product Design",
    company: "Razorpay",
    question: "Build a product solution for Flipkart to win over senior citizens as an online shopping destination.",
    description: "Simplified UI with large fonts, voice search in regional languages, assisted checkout via family members, and COD preference."
  },
  {
    id: "q-pd-22",
    category: "Product Design",
    company: "Ather Energy",
    question: "Design an electric vehicle accessory or product variant from scratch for Tier-2 commuter markets.",
    description: "Target tier-2 EV buyers: battery range optimization, rugged suspension accessories, regional language dashboard UI, and fast-charging adapter."
  },

  // --- PRODUCT IMPROVEMENT ---
  {
    id: "q-pi-1",
    category: "Product Improvement",
    company: "MakeMyTrip",
    question: "How would you reduce the steps a user takes to filter a flight in the Flights funnel?",
    description: "Analyze search funnel friction: smart default filters based on user history, one-tap price slider, and instant matrix sorting."
  },
  {
    id: "q-pi-2",
    category: "Product Improvement",
    company: "Razorpay",
    question: "How would you improve Amazon's signup process to increase conversion?",
    description: "One-click passkey authentication, OTP-first signup, social sign-in integrations, and deferred profile completion."
  },

  // --- ROOT CAUSE ANALYSIS (RCA) ---
  {
    id: "q-rca-1",
    category: "Root Cause Analysis (RCA)",
    company: "Flipkart",
    question: "Flipkart's app conversion dropped 10% yesterday. Diagnose the root cause.",
    description: "Investigate a sudden drop in conversion. Analyze external factors (holidays, competitor promotions), technical factors (server downtime, checkout bugs), and user cohorts."
  },
  {
    id: "q-rca-2",
    category: "Root Cause Analysis (RCA)",
    company: "Zomato",
    question: "Assume the conversion rate for Zomato dropped by 20% suddenly. How do you investigate?",
    description: "Diagnose the drop systematically. Look at checkout failure rates, payment gateway downtime, app version bugs, change in delivery fee, or regional weather events."
  },
  {
    id: "q-rca-3",
    category: "Root Cause Analysis (RCA)",
    company: "Swiggy",
    question: "Swiggy's order cancellations went up 30% last week. What do you do?",
    description: "Analyze why cancellations rose. Check customer-initiated cancellations (delays, incorrect orders), merchant cancellations (stockouts), or driver-side rejections."
  },
  {
    id: "q-rca-4",
    category: "Root Cause Analysis (RCA)",
    company: "Uber",
    question: "Uber's ride cancellation rate increased 8% in Delhi. Why?",
    description: "Investigate the cancellation rise. Segment by driver vs rider cancellations, time of day, weather, traffic, transit zones, gas price spikes, or payout changes."
  },
  {
    id: "q-rca-5",
    category: "Root Cause Analysis (RCA)",
    company: "Meta",
    question: "Why are engagements/shares on WhatsApp declining?",
    description: "Investigate lower social shares/engagements on WhatsApp. Address competition, changing user behaviors, feature fatigue, privacy concerns, or platform policy changes."
  },
  {
    id: "q-rca-6",
    category: "Root Cause Analysis (RCA)",
    company: "Groww",
    question: "Root-cause analyze why Uber's customer satisfaction is falling (or falling behind competitors).",
    description: "Analyze decline in CSAT score. Address ride reliability, cleanliness, pricing surge fairness, app UX friction, and competitor driver incentives."
  },
  {
    id: "q-rca-7",
    category: "Root Cause Analysis (RCA)",
    company: "Groww",
    question: "Uber is seeing increased driver cancellations – what's happening?",
    description: "Deconstruct driver cancellations: inspect incentive payout rules, destination visibility, passenger ratings, and competitor driver bonuses."
  },
  {
    id: "q-rca-8",
    category: "Root Cause Analysis (RCA)",
    company: "Groww",
    question: "Users download Swiggy but then switch to Zomato – why?",
    description: "Evaluate onboarding experience, coupon availability, restaurant exclusivity, Gold subscription value, or UI friction."
  },
  {
    id: "q-rca-9",
    category: "Root Cause Analysis (RCA)",
    company: "Flipkart",
    question: "Flipkart implemented a 'no questions asked' return policy, which impacted several metrics. Analyze reasons and solutions.",
    description: "Return fraud spikes, logistics reverse cost increase, merchant margin squeeze, and solution via mandatory photo verification."
  },
  {
    id: "q-rca-10",
    category: "Root Cause Analysis (RCA)",
    company: "Swiggy",
    question: "Swiggy is seeing a drop in Average Revenue Per User (ARPU). Diagnose the root cause.",
    description: "Average order value (AOV) decline, discount usage increases, free delivery threshold changes, or shift towards single-item snacks."
  },
  {
    id: "q-rca-11",
    category: "Root Cause Analysis (RCA)",
    company: "Meta",
    question: "Comments on Instagram have gone down by 40% in the last one month. Diagnose.",
    description: "Reels algorithm change showing more passive video content, spam filter blocking legitimate comments, or comment UI redesign issues."
  },
  {
    id: "q-rca-12",
    category: "Root Cause Analysis (RCA)",
    company: "Meesho",
    question: "Meesho's premium seller retention is dropping. Do a root cause analysis.",
    description: "Seller commission policy changes, competitor onboarding bonuses, payout delay issues, or high return rates hurting seller margins."
  },
  {
    id: "q-rca-13",
    category: "Root Cause Analysis (RCA)",
    company: "Meesho",
    question: "There's a problem of duplicate listings on Meesho — multiple sellers listing the same product. How would you solve it?",
    description: "Image similarity matching algorithm, product barcode indexing, buy-box algorithm prioritizing verified original manufacturers."
  },
  {
    id: "q-rca-14",
    category: "Root Cause Analysis (RCA)",
    company: "MX Player",
    question: "There's been a 10% decrease in daily watch time on YouTube — identify the problem and suggest solutions.",
    description: "Short-form video competition (Instagram Reels), ad load fatigue, video recommendation degradation, or seasonal outdoor activities."
  },

  // --- PRODUCT STRATEGY ---
  {
    id: "q-strat-1",
    category: "Product Strategy",
    company: "Flipkart",
    question: "Should Flipkart launch hyperlocal grocery delivery to compete with Blinkit & Instamart?",
    description: "Assess opportunity, financial viability, logistics, competitor strength (Blinkit, Instamart), Flipkart's current assets, and make a strategic recommendation."
  },
  {
    id: "q-strat-2",
    category: "Product Strategy",
    company: "Flipkart",
    question: "Flipkart wants to add floral commerce. Tell us about GTM, Product Design, and value chain.",
    description: "Formulate a launch strategy for flower delivery. Design product features, cold supply chain partners, GTM plan, and pricing."
  },
  {
    id: "q-strat-3",
    category: "Product Strategy",
    company: "Zomato",
    question: "Suggest three product portfolios Zomato could adopt to increase revenue by 70%.",
    description: "Formulate three high-impact portfolios or product verticals (e.g. Hyperpure B2B supply, dining events, premium memberships) to achieve aggressive targets."
  },
  {
    id: "q-strat-4",
    category: "Product Strategy",
    company: "Zomato",
    question: "How would you launch 1,100 Blinkit dark stores across India? Give a full market-entry and operational strategy.",
    description: "Supply chain node setup, hyper-local inventory sourcing, rider allocation density, and customer acquisition CAC."
  },
  {
    id: "q-strat-5",
    category: "Product Strategy",
    company: "Swiggy",
    question: "Which market should Swiggy enter next—grocery or travel?",
    description: "Compare grocery (high frequency, low margin, operational complexity) vs travel (low frequency, high margin, booking-based) to advise next step."
  },
  {
    id: "q-strat-6",
    category: "Product Strategy",
    company: "Swiggy",
    question: "How should Swiggy think about tier-3 city expansion?",
    description: "Develop expansion framework. Analyze internet penetration, purchasing power, restaurant density, delivery mode options (bicycles vs bikes), and marketing cost."
  },
  {
    id: "q-strat-7",
    category: "Product Strategy",
    company: "Razorpay",
    question: "Should Razorpay expand into consumer lending (Buy Now Pay Later)?",
    description: "Evaluate expansion from B2B payment gateway to consumer lending. Analyze credit risks, merchant synergy, regulation, and market size."
  },
  {
    id: "q-strat-8",
    category: "Product Strategy",
    company: "Netflix",
    question: "How to grow Netflix 3x in 5 years?",
    description: "Formulate massive growth strategy. Explore options like mobile-only plans, regional original content production, gaming integration, or pricing bundles."
  },
  {
    id: "q-strat-9",
    category: "Product Strategy",
    company: "MakeMyTrip",
    question: "Pitch a product that solves any real-world problem.",
    description: "Pitch a product from scratch. Highlight target user segment, precise pain point, MVP features, value proposition, monetization, and success metrics."
  },
  {
    id: "q-strat-10",
    category: "Product Strategy",
    company: "Flipkart",
    question: "Should Flipkart enter the cattle trading market?",
    description: "Evaluate a rural go-to-market case. Discuss livestock logistics, local agent trust, payment terms, regulations, and alignment with Flipkart's core model."
  },

  // --- TECHNICAL ARCHITECTURE ---
  {
    id: "q-tech-1",
    category: "Technical Architecture",
    company: "Uber",
    question: "Walk us through what the Uber Eats API architecture might look like for major partner restaurants.",
    description: "Explain API architecture for restaurant integrations. Detail endpoints like /menu, /orders, /status, methods (POST/GET), JSON payloads, and webhooks."
  },
  {
    id: "q-tech-2",
    category: "Technical Architecture",
    company: "Uber",
    question: "What happens technically when a consumer opens the Uber app on their phone?",
    description: "Explain full system flow: client request, DNS lookup, API gateway routing, location updates, server matchmaking algorithm, caching, and database queries."
  },
  {
    id: "q-tech-3",
    category: "Technical Architecture",
    company: "Z1 Tech",
    question: "What is an API and how does it work conceptually for non-tech stakeholders?",
    description: "Define Application Programming Interface. Explain requests, response status codes, formats (JSON/XML), and server communication conceptually."
  },
  {
    id: "q-tech-4",
    category: "Technical Architecture",
    company: "Z1 Tech",
    question: "How does Google Search work under the hood?",
    description: "Explain technical lifecycle of search: web crawlers (Googlebot), indexing (PageRank database index), and query processing/ranking pipelines."
  },
  {
    id: "q-tech-5",
    category: "Technical Architecture",
    company: "Swiggy",
    question: "How would you enable orders from multiple restaurants in Swiggy in a single cart?",
    description: "Multi-merchant order dispatch backend, dual-runner routing algorithms, split payment gateway payouts, and cart state lock."
  },
  {
    id: "q-tech-6",
    category: "Technical Architecture",
    company: "Uber",
    question: "Identify all microservices in Uber's marketplace.",
    description: "Geofencing service, rider location stream, driver matching service, dynamic surge pricing engine, trip billing & payment gateway service."
  },

  // --- PUZZLES & QUANTITATIVE LOGIC ---
  {
    id: "q-puz-1",
    category: "Puzzles & Quantitative Logic",
    company: "Groww",
    question: "A cycle has two tyres plus a spare tyre, each tyre good for 5 km before wearing out — how many total km can the cycle travel?",
    description: "Optimize tyre rotation strategy: after 2.5 km, swap front tyre with spare to equalize wear across all three tyres to achieve maximum distance (7.5 km)."
  }
];
