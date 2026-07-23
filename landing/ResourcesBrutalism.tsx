import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  Download, 
  Search, 
  Plus, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  X, 
  Menu, 
  Users, 
  Share2, 
  ExternalLink, 
  Clock, 
  Tag, 
  FolderArchive, 
  Wrench, 
  GraduationCap, 
  Laptop,
  Check,
  Upload,
  Info,
  Bookmark,
  Eye,
  Heart,
  Loader2,
  Lock,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';
import { Logo, Button, NavLink, AnnouncementBanner, saveLeadToDemoDB } from './AppBrutalism';

export const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/BwmKS1htgjW8Tkt9v4fMwD";

export type ResourceItem = {
  id: string;
  title: string;
  company?: string;
  companyColor?: string;
  category: string; 
  type?: string;
  format: string;
  description: string;
  aboutText: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  downloadUrl?: string;
  fileSize?: string;
  pageCount?: string;
  readTime?: string;
  tags?: string[];
  bannerBg?: string;
  featured?: boolean;
  downloadCount?: number;
  createdAt?: string;
  whatIsInside?: string[];
  viewsCount?: number;
  likesCount?: number;
  dateString?: string;
};

export type QuestionItem = {
  id: string;
  category: string;
  company: string;
  question: string;
  description?: string;
  yearTag?: string;
};

const LOCAL_STORAGE_KEY = 'pmx_custom_resources';

export const CATEGORIES = [
  "All Categories",
  "Product Design & GTM",
  "Product Strategy",
  "Product Root Cause Analysis (RCA)",
  "Product Success Metrics",
  "Guesstimates & Analytics",
  "Technical & System Design"
];

export const QUESTION_TYPES = [
  "All Question Types",
  "Product Design",
  "Guesstimate",
  "Metrics & Analytics",
  "Root Cause Analysis (RCA)",
  "Product Strategy",
  "Technical Architecture",
  "Behavioral & HR",
  "Case Study"
];

export const COMPANIES = [
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
  "Z1 Tech"
];

export const IIT_QUESTIONS_DATA: QuestionItem[] = [
  // --- BEHAVIORAL & HR ---
  {
    id: "q-beh-1",
    category: "Behavioral & HR",
    company: "Innovaccer",
    question: "Questions about background and other behavioural questions.",
    description: "Behavioral background evaluation focusing on past projects and team dynamics."
  },
  {
    id: "q-beh-2",
    category: "Behavioral & HR",
    company: "BCG, Meesho, Alvarez & Marsal, HiLabs",
    question: "A few basic HR questions (1-2 questions).",
    description: "Standard motivation, strengths/weaknesses, and culture-fit assessment."
  },
  {
    id: "q-beh-3",
    category: "Behavioral & HR",
    company: "Publicis Sapient, Meesho, Schlumberger",
    question: "Conversation about college festival leadership role as a head, difficulties faced, how to convince higher authority. Discussion on current LLMs.",
    description: "Discussion on managing stakeholders, resolving conflicts, and opinion on current LLMs shaping tech products."
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
    company: "IIT Kanpur Campus",
    question: "Market sizing case study: Estimate the total number of operational Air Conditioners currently running in the city of Kanpur.",
    description: "Segment by residential vs commercial (offices, labs, hospitals, retail). Calculate total households, penetration rate per income tier, and commercial floor area."
  },
  {
    id: "q-cs-2",
    category: "Case Study",
    company: "Blinkit / Zepto",
    question: "Dark-Store Demand Case Study: Predict product demands for a specific dark-store in a particular area of a city.",
    description: "Develop a database schema of order history, local demographic density, weather patterns, and select ML algorithms (XGBoost/LightGBM) to forecast stock."
  },
  {
    id: "q-cs-3",
    category: "Case Study",
    company: "InsuranceTech",
    question: "Product Launch Case Study: A company is launching a new car insurance product. Determine primary and secondary data factors for policy pricing.",
    description: "Define risk parameters: vehicle age, driver safety score, telematics data, geographic risk zones, and competitor benchmark pricing."
  },
  {
    id: "q-cs-4",
    category: "Case Study",
    company: "Telco / SaaS",
    question: "Customer Churn Case Study: Identify features to train an ML model to predict customer churning for SIM card services.",
    description: "Track drop in call volume, data usage spikes/drops, customer support ticket frequency, network complaints, and competitor SIM ports."
  },
  {
    id: "q-cs-5",
    category: "Case Study",
    company: "Dr. Reddy's",
    question: "Destination Dr. Reddy's 2.0 Hackathon: Operational bottleneck resolution & presentation.",
    description: "Identify chemical supply chain bottlenecks, inventory turnover ratios, and regulatory compliance workflows."
  },

  // --- GUESSTIMATES ---
  {
    id: "q-gues-1",
    category: "Guesstimate",
    company: "General",
    question: "Guesstimate 1: Estimate the weekly total revenue of a PVR cinema complex. Guesstimate 2: Estimate the total number of laptops active in India.",
    description: "Screen occupancy rate, ticket price tiers, F&B multiplier, and laptop replacement cycle."
  },
  {
    id: "q-gues-2",
    category: "Guesstimate",
    company: "General",
    question: "Logistics Guesstimate: Estimate how many standard-sized Coke bottles can physically fit inside a standard state roadways bus.",
    description: "Calculate volume of interior bus space minus seats/aisles divided by bottle volume with packing fraction."
  },
  {
    id: "q-gues-3",
    category: "Guesstimate",
    company: "General",
    question: "Live Trading Guesstimate: Estimate the average price of flying first class from Lucknow to Sydney with live trade simulation.",
    description: "Airline yield management, flight leg connections, class premium ratio, and confidence intervals."
  },
  {
    id: "q-gues-4",
    category: "Guesstimate",
    company: "General",
    question: "Market Sizing: Estimate the total number of vehicles getting repaired on a daily basis in a busy automotive service outlet in Delhi.",
    description: "Bay count, average service time per vehicle, operating hours, and mechanic shift capacity."
  },
  {
    id: "q-gues-5",
    category: "Guesstimate",
    company: "IIT Kanpur",
    question: "Volume Guesstimate: Estimate the total number of windows present across the entire IIT Kanpur campus.",
    description: "Building types: hostel blocks, department labs, faculty quarters, library, and window density per sq ft."
  },
  {
    id: "q-gues-6",
    category: "Guesstimate",
    company: "American Express, Barclays, OLA",
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
    company: "Meesho, Finmechanics",
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
    description: "Cohort retention analysis using `LAG()`, `LEAD()`, and date difference functions."
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
  {
    id: "q-strat-11",
    category: "Product Strategy",
    company: "Razorpay",
    question: "Why is Amazon Prime so successful? If you were the PM for Amazon Prime, what would the next year's roadmap look like?",
    description: "Ecosystem flywheel analysis: free shipping driving e-commerce spend, video retention, music integration, and new healthcare/gaming perks."
  },
  {
    id: "q-strat-12",
    category: "Product Strategy",
    company: "Meta",
    question: "How can Meta increase the adoption and long-term retention of Threads?",
    description: "Instagram cross-posting mechanics, real-time news curation, topic web feeds, and creator incentives."
  },

  // --- TECHNICAL ARCHITECTURE ---
  {
    id: "q-tech-1",
    category: "Technical Architecture",
    company: "Uber",
    question: "Walk us through what the Uber Eats API architecture might look like for major restaurant partners.",
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
  {
    id: "q-tech-7",
    category: "Technical Architecture",
    company: "Zomato",
    question: "Explain statistical terms and their product use cases: p-value test, Gaussian distribution, and random sampling in A/B testing.",
    description: "A/B testing sample size calculation, confidence intervals, statistically significant conversion uplift."
  },
  {
    id: "q-tech-8",
    category: "Technical Architecture",
    company: "Razorpay",
    question: "Explain technical basics: how web servers communicate, database indexing, and encryption protocols (TLS/SSL).",
    description: "HTTP/HTTPS request-response lifecycle, B-tree database indexing for fast lookup, public-private key encryption."
  }
];

export const DEMO_RESOURCES: ResourceItem[] = [
  {
    id: "flipkart-apm-guide",
    title: "1. Flipkart APM Interview Guide",
    company: "Flipkart",
    companyColor: "#2874F0",
    category: "Product Design & GTM",
    type: "APM Guide",
    format: "PDF Guide",
    description: "Flipkart runs one of the most coveted APM programs on IIT campuses, prioritizing product intuition and structured thinking over academic grades. Typical CTC: ₹20–28 LPA.",
    aboutText: `## Flipkart APM Interview Guide

Flipkart runs one of the most coveted APM programs on IIT campuses, prioritizing product intuition and structured thinking over academic grades.

### Overview & Shortlisting
- **Typical CTC**: ₹20–28 LPA.
- **Eligibility**: No GPA cut-offs.
- **The Screen**: Flipkart famously bypasses traditional resume screening in favor of a "Product Deck" assignment. You will receive an ambiguous prompt (e.g., *"Find a problem in the post-pandemic world that can be solved with a product"*) and have 7–9 days to submit a presentation capped at ~10 slides. Evaluators look for pristine deck hygiene, clear user personas, prioritization frameworks (like RICE), and success metrics.

### The Interview Loop
Flipkart typically conducts 4 to 5 rounds:
1. **Deck Evaluation**: Shortlisting based entirely on your submitted slide deck.
2. **Product Design & Solutioning**: Focuses on Go-To-Market (GTM) strategies and designing new features.
3. **Root Cause Analysis (RCA) / Metrics**: Testing your ability to diagnose funnel drops using frameworks like AARM.
4. **Hiring Manager / Director Round**: Deep-dive into product strategy, leadership, and behavioral fit.

### Top Previous Year Questions (PYQs)
- **Case Study**: *"Should Flipkart enter the cattle trading market?"*
- **RCA**: *"Flipkart's app conversion dropped 10% yesterday. Diagnose the root cause."*
- **Design & GTM**: *"Flipkart wants to add floral commerce on its platform. Tell us about the GTM, Product Design, and set up a value chain for the delivery of the product."*
- **Metrics**: *"On the seller side, what are the relevant metrics for Product Managers at Flipkart to track?"*
- **Guesstimate**: *"Estimate the number of pairs of shoes sold online in Delhi through Flipkart in one day."*`,
    fileSize: "2.8 MB",
    pageCount: "14 Pages",
    readTime: "15 min read",
    tags: ["FLIPKART", "APM", "PRODUCT DECK", "GTM", "RCA"],
    bannerBg: "linear-gradient(135deg, #188ab2 0%, #0e4e66 100%)",
    featured: true,
    downloadCount: 1420,
    viewsCount: 3890,
    likesCount: 1051,
    dateString: "January 19",
    createdAt: "2026-07-20",
    whatIsInside: [
      "Product Deck Submission Blueprint & ~10 Slide Rules",
      "4-5 Round Interview Loop Breakdown (R1 to Executive)",
      "Top Previous Year Questions (Cattle Trading & Floral Commerce GTM)",
      "Flipkart Seller Metrics & Delhi Shoes Guesstimate"
    ]
  },
  {
    id: "zomato-blinkit-apm-guide",
    title: "2. Zomato & Blinkit APM / Product Analyst Guide",
    company: "Zomato & Blinkit",
    companyColor: "#CB202D",
    category: "Product Root Cause Analysis (RCA)",
    type: "APM / PA Guide",
    format: "PDF Guide",
    description: "Zomato and Blinkit focus heavily on operational efficiency, real-time marketplace dynamics, and high-pressure analytical skills. Typical CTC: ₹18–26 LPA.",
    aboutText: `## Zomato & Blinkit APM / Product Analyst Guide

Zomato and Blinkit focus heavily on operational efficiency, real-time marketplace dynamics, and high-pressure analytical skills.

### Overview & Shortlisting
- **Typical CTC**: ₹18–26 LPA.
- **Eligibility**: Generally prefers a CGPA of 8.0 or above.
- **The Screen**: A rigorous online assessment (OA). Historically, this has included 25 complex aptitude questions and 9 medium-to-difficult SQL questions requiring knowledge of window functions and datetime manipulations.

### The Interview Loop
Zomato interviews are known to be intense stress tests evaluating structural logic and marketplace economics. The standard 4-round loop includes:
1. **Online Assessment (OA)**: Heavy focus on SQL and aptitude.
2. **Case Interview**: Live case solving covering operational bottlenecks and marketplace inefficiencies.
3. **Guesstimate & Analytics**: Rapid-fire geometric puzzles and metric breakdowns.
4. **Final / Founder Round**: High-level strategy and cultural fit.

### Top Previous Year Questions (PYQs)
- **Product Design**: *"How would you design a table reservation feature for Swiggy/Zomato?"*
- **Strategy**: *"How would you launch 1,100 Blinkit dark stores across India?"*
- **RCA**: *"Assume the conversion rate for Zomato has dropped by 20% all of a sudden. How will you figure out what went wrong?"*
- **Technical / System Design**: *"Explain rider allocation and routing optimization suggestions for peak hours."*`,
    fileSize: "3.1 MB",
    pageCount: "16 Pages",
    readTime: "18 min read",
    tags: ["ZOMATO", "BLINKIT", "SQL", "DARK STORES", "RCA"],
    bannerBg: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
    featured: true,
    downloadCount: 1180,
    viewsCount: 8620,
    likesCount: 1741,
    dateString: "January 19",
    createdAt: "2026-07-20",
    whatIsInside: [
      "Online Assessment Breakdown (25 Aptitude + 9 Advanced SQL Queries)",
      "Launch Strategy for 1,100 Blinkit Dark Stores across India",
      "Zomato 20% Conversion Drop RCA Framework",
      "Table Reservation Feature Design & Peak Hour Rider Allocation"
    ]
  },
  {
    id: "uber-apm-guide",
    title: "3. Uber APM Interview Guide",
    company: "Uber",
    companyColor: "#111111",
    category: "Technical & System Design",
    type: "APM Guide",
    format: "PDF Guide",
    description: "Uber looks for PMs who can navigate a three-sided marketplace (riders, drivers, platform) while seamlessly earning the trust of deep technical and engineering teams.",
    aboutText: `## Uber APM Interview Guide

Uber looks for PMs who can navigate a three-sided marketplace (riders, drivers, platform) while seamlessly earning the trust of deep technical and engineering teams.

### Overview & Shortlisting
- **Eligibility**: Typically expects strong technical literacy and system design knowledge.
- **The Screen**: Often relies on a take-home product assignment (e.g., devising strategies to reduce driver cancellations).

### The Interview Loop
Uber heavily emphasizes collaborative problem-solving and architectural understanding:
1. **Take-home Assignment**: Testing structured thought and hypothesis generation.
2. **The "Jam Session"**: A collaborative group case study solved alongside 2-3 current Uber PMs.
3. **Analytical & RCA**: Deep-dives into ride metrics, surge pricing failures, and operational friction.
4. **Technical Fluency**: API design and mobile system architecture.

### Top Previous Year Questions (PYQs)
- **Product Design**: *"Design a lost-item retrieval system for Uber."*
- **Technical Fluency**: *"Walk us through what the Uber Eats API might look like for major partners."*
- **System Architecture**: *"What happens, from a technical perspective, when a consumer opens the Uber app on the phone?"*
- **Analytical / RCA**: *"Uber's ride cancellation rate increased 8% in Delhi. Why?"*`,
    fileSize: "2.9 MB",
    pageCount: "15 Pages",
    readTime: "16 min read",
    tags: ["UBER", "THREE-SIDED MARKETPLACE", "JAM SESSION", "APIS", "SYSTEM DESIGN"],
    bannerBg: "linear-gradient(135deg, #111111 0%, #333333 100%)",
    featured: true,
    downloadCount: 950,
    viewsCount: 5210,
    likesCount: 1280,
    dateString: "January 18",
    createdAt: "2026-07-20",
    whatIsInside: [
      "Take-Home Assignment Strategy & 'Jam Session' Round Format",
      "Three-Sided Marketplace Dynamics (Riders, Drivers, Platform)",
      "Uber Eats Partner API & App Startup System Architecture",
      "Delhi 8% Ride Cancellation Rate Spike RCA"
    ]
  },
  {
    id: "sprinklr-apm-guide",
    title: "4. Sprinklr APM / PA Interview Guide",
    company: "Sprinklr",
    companyColor: "#00A3E0",
    category: "Product Strategy",
    type: "B2B PM Guide",
    format: "PDF Guide",
    description: "As a major B2B SaaS player, Sprinklr's interviews are heavily indexed on enterprise logic, cross-functional integrations, and complex software ecosystems. Typical CTC: ₹15–20 LPA.",
    aboutText: `## Sprinklr APM / PA Interview Guide

As a major B2B SaaS player, Sprinklr's interviews are heavily indexed on enterprise logic, cross-functional integrations, and complex software ecosystems.

### Overview & Shortlisting
- **Typical CTC**: Estimated ₹15–20 LPA.
- **The Screen**: An advanced online aptitude test evaluating logical reasoning, quantitative skills, data visualization, and sometimes basic coding.

### The Interview Loop
Candidates undergo about 4 rounds:
1. **Aptitude Test + Resume Screen**.
2. **Product Case (R1 & R2)**: Multiple product improvement and design questions (often testing mobile-first constraints).
3. **Product Strategy (R3)**: Enterprise customer care platforms and B2B growth metrics.
4. **HR & Culture Fit (R4)**: Resume-based behavioral questions and stakeholder scenarios.

### Top Previous Year Questions (PYQs)
- **Product Improvement**: *"You are a PM at WhatsApp. There are plans to make WhatsApp a super-app. How will you approach ideating the features?"*
- **Design & Empathy**: *"Design a feature for children to deposit/withdraw cash securely."*
- **B2B Strategy**: *"Name three product ideas for Zomato to increase revenue by 70%."*
- **Dashboarding**: *"You are a PM at Airbnb. Your CEO has ordered you to prepare a dashboard of 5 absolutely crucial metrics that they need to see every morning. Devise these 5 metrics and supply reasoning."*`,
    fileSize: "2.5 MB",
    pageCount: "13 Pages",
    readTime: "14 min read",
    tags: ["SPRINKLR", "B2B SAAS", "SUPER APP", "EXECUTIVE DASHBOARD", "ENTERPRISE"],
    bannerBg: "linear-gradient(135deg, #059669 0%, #064e3b 100%)",
    featured: false,
    downloadCount: 820,
    viewsCount: 4120,
    likesCount: 940,
    dateString: "January 17",
    createdAt: "2026-07-20",
    whatIsInside: [
      "Online Aptitude Test & Data Visualization Preparation",
      "WhatsApp Super-App Expansion Feature Ideation",
      "Zomato 70% Revenue Increase Strategy (3 Key Products)",
      "Airbnb CEO 5 Crucial Daily Metrics Executive Dashboard"
    ]
  },
  {
    id: "groww-apm-guide",
    title: "5. Groww APM Interview Guide",
    company: "Groww",
    companyColor: "#00D670",
    category: "Guesstimates & Analytics",
    type: "APM Guide",
    format: "PDF Guide",
    description: "Groww is a leading FinTech recruiter that tests candidates heavily on user navigation, financial inclusion, and quantitative agility. Typical CTC: ₹18–24 LPA.",
    aboutText: `## Groww APM Interview Guide

Groww is a leading FinTech recruiter that tests candidates heavily on user navigation, financial inclusion, and quantitative agility.

### Overview & Shortlisting
- **Typical CTC**: ₹18–24 LPA.
- **The Screen**: A pre-placement product-case deck submission acting as the primary filter.

### The Interview Loop
Groww uses a 4-round structure:
1. **Online Assessment / Deck Submission**.
2. **Guesstimate & Puzzle Round**: 3-4 puzzles testing on-the-spot numerical problem-solving.
3. **Case Interview**: Live product strategy, user personas, and feature design.
4. **HR / Founder Round**.

### Top Previous Year Questions (PYQs)
- **Case Study**: *"Tell me your favorite tech product. If it wants to launch in India, what strategies will you use and what new features would you introduce?"*
- **Pre-placement Prompt**: *"As we're graduating and approaching financial independence, design a digital product that solves pain points for a new graduate."*
- **Strategy**: *"You're at Groww, tasked with building a subscription model for users. Design the end-to-end plan."*
- **Guesstimate**: *"Estimate the daily UPI transaction value in India."*`,
    fileSize: "2.7 MB",
    pageCount: "14 Pages",
    readTime: "15 min read",
    tags: ["GROWW", "FINTECH", "UPI GUESSTIMATE", "SUBSCRIPTION MODEL", "PUZZLES"],
    bannerBg: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
    featured: false,
    downloadCount: 910,
    viewsCount: 3450,
    likesCount: 880,
    dateString: "January 15",
    createdAt: "2026-07-20",
    whatIsInside: [
      "Pre-Placement Product Case Deck Submission Filter",
      "3-4 On-the-Spot Numerical Puzzles & Guesstimates",
      "Groww User Subscription Model End-to-End Design",
      "Daily India UPI Transaction Value Guesstimate"
    ]
  },
  {
    id: "meesho-apm-guide",
    title: "6. Meesho APM Interview Guide",
    company: "Meesho",
    companyColor: "#F43397",
    category: "Product Design & GTM",
    type: "APM Guide",
    format: "PDF Guide",
    description: "Meesho looks for PMs who understand tier-2 and tier-3 market dynamics, supply chain logistics, and social commerce economics. Typical CTC: ₹18–25 LPA.",
    aboutText: `## Meesho APM Interview Guide

Meesho looks for PMs who understand tier-2 and tier-3 market dynamics, supply chain logistics, and social commerce economics.

### Overview & Shortlisting
- **Typical CTC**: ₹18–25 LPA.
- **Eligibility**: Generally expects a CGPA of 8.0 or above (Day 0/1 company status).
- **The Screen**: Resume screening followed by an online assessment evaluating analytical ability.

### The Interview Loop
The process spans 4 to 5 rounds:
1. **Online Assessment (OA)**.
2. **SQL & Guesstimate Round**: Often a dedicated round strictly testing data extraction and Fermi problems.
3. **Case Interview**: Live business case covering supply chain or marketplace dynamics.
4. **Behavioral Round**.
5. **Final Executive Round**.

### Top Previous Year Questions (PYQs)
- **Product Design**: *"Design a transport service for the blind using an autonomous fleet."*
- **Operational RCA**: *"There's a problem of duplicate listings on Meesho — multiple sellers listing the same product. How would you solve it?"*
- **Metric Analysis**: *"Meesho's premium seller retention is dropping. Do a root cause analysis."*
- **Growth**: *"Grow Meesho's equivalent of Spotify Premium — what's the right feature suite?"*`,
    fileSize: "3.0 MB",
    pageCount: "15 Pages",
    readTime: "16 min read",
    tags: ["MEESHO", "SOCIAL COMMERCE", "TIER 2/3", "DUPLICATE LISTINGS", "RCA"],
    bannerBg: "linear-gradient(135deg, #d97706 0%, #92400e 100%)",
    featured: false,
    downloadCount: 760,
    viewsCount: 6190,
    likesCount: 1410,
    dateString: "January 14",
    createdAt: "2026-07-20",
    whatIsInside: [
      "SQL & Guesstimate Fermi Problems Round Strategy",
      "Duplicate Seller Listing Algorithmic Solutioning",
      "Meesho Premium Seller Retention Drop RCA Case",
      "Autonomous Fleet Transport for the Blind Product Design"
    ]
  },
  {
    id: "razorpay-pm-guide",
    title: "7. Razorpay PM Interview Guide",
    company: "Razorpay",
    companyColor: "#0C2340",
    category: "Technical & System Design",
    type: "PM Guide",
    format: "PDF Guide",
    description: "Razorpay hires PMs with sharp business acumen, a deep understanding of B2B product thinking, and a firm grasp of API integrations.",
    aboutText: `## Razorpay PM Interview Guide

Razorpay hires PMs with sharp business acumen, a deep understanding of B2B product thinking, and a firm grasp of API integrations.

### Overview & Shortlisting
- **The Screen**: Resume screening favoring FinTech projects or prior startup experience, often followed by a take-home Product Solutioning task (Mini-PRD).

### The Interview Loop
The process typically involves 4 structured rounds:
1. **Product Solutioning**: Crafting features and writing mini-PRDs.
2. **Technical Understanding**: System architecture, API documentation, and non-functional requirements (NFRs).
3. **Strategy & Business Acumen**: Market sizing, B2B metrics (like TPV), and monetization.
4. **Culture Fit & Leadership**: Cross-functional alignment and behavioral STAR methodologies.

### Top Previous Year Questions (PYQs)
- **Product Thinking**: *"How would you design an app for Swiggy's delivery executives?"*
- **Technology Grounding**: *"Describe the technology architecture of your current product in as much detail as possible."*
- **Strategy & Expansion**: *"Should Razorpay expand into consumer lending?"*
- **Business Acumen**: *"How would you approach pricing for a new offering like 'Swiggy Super'? Is Swiggy potentially underpricing it right now?"*`,
    fileSize: "2.6 MB",
    pageCount: "14 Pages",
    readTime: "15 min read",
    tags: ["RAZORPAY", "FINTECH", "MINI-PRD", "B2B APIS", "PRICING STRATEGY"],
    bannerBg: "linear-gradient(135deg, #188ab2 0%, #1e40af 100%)",
    featured: false,
    downloadCount: 880,
    viewsCount: 4820,
    likesCount: 1190,
    dateString: "January 12",
    createdAt: "2026-07-20",
    whatIsInside: [
      "Take-Home Mini-PRD Solutioning Blueprint & NFR Requirements",
      "B2B Payment Architecture & API Integration Deep-Dive",
      "App Design Case Study for Swiggy Delivery Partners",
      "Razorpay Consumer Lending Expansion & Swiggy Super Pricing Strategy"
    ]
  }
];

export function ResourcesBrutalism() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeResourceId = searchParams.get('id');

  const [resources, setResources] = useState<ResourceItem[]>(DEMO_RESOURCES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedQuestionCategory, setSelectedQuestionCategory] = useState<string>('All Question Types');
  const [activeResourceTab, setActiveResourceTab] = useState<'guides' | 'questions'>('guides');
  const [selectedCompany, setSelectedCompany] = useState<string>('All Companies');

  // Collapsible Left Sidebar Dropdowns State
  const [openDropdowns, setOpenDropdowns] = useState({
    category: true,
    questionType: true,
    company: true
  });

  const toggleDropdown = (section: 'category' | 'questionType' | 'company') => {
    setOpenDropdowns(prev => ({ ...prev, [section]: !prev[section] }));
  };
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Apply Now Modal & Lead State
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [applyStatus, setApplyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [applyValidationError, setApplyValidationError] = useState<string>('');
  const [applyFormData, setApplyFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyValidationError('');

    if (!applyFormData.fullName.trim()) {
      setApplyValidationError('Please enter your full name.');
      return;
    }
    if (!applyFormData.email.trim() || !applyFormData.email.includes('@')) {
      setApplyValidationError('Please enter a valid email address.');
      return;
    }
    if (!applyFormData.phone.trim() || applyFormData.phone.length < 8) {
      setApplyValidationError('Please enter a valid phone/WhatsApp number.');
      return;
    }

    setApplyStatus('loading');

    const leadData = {
      fullName: applyFormData.fullName,
      email: applyFormData.email,
      phone: applyFormData.phone,
      intent: 'resource',
      source: 'resource-page',
      resourceId: activeResource?.id || 'resource-detail',
      resourceTitle: activeResource?.title || 'APM Interview Guide'
    };

    // Save lead to local demo DB
    saveLeadToDemoDB(leadData);

    try {
      const res = await fetch(
        'https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: applyFormData.fullName,
            email: applyFormData.email,
            phone: applyFormData.phone,
            masterclassId: `resource:${activeResource?.id || 'resource-detail'}`,
            source: 'resource-page',
            resourceTitle: activeResource?.title || 'APM Interview Guide'
          }),
        }
      );

      if (!res.ok) {
        console.warn('Backend API submission warning:', res.status);
      }
      setApplyStatus('success');
    } catch (err) {
      console.error('Error submitting application lead:', err);
      // Saved locally, mark success for clean UX
      setApplyStatus('success');
    }
  };

  // New Resource Form state
  const [newResource, setNewResource] = useState({
    title: '',
    category: 'Product Design & GTM',
    company: 'Flipkart',
    type: 'APM Guide',
    format: 'PDF',
    description: '',
    aboutText: '',
    downloadUrl: '',
    whatIsInsideText: ''
  });

  useEffect(() => {
    const loadResources = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const customItems: ResourceItem[] = stored ? JSON.parse(stored) : [];
        const combined = [...customItems, ...DEMO_RESOURCES.filter(d => !customItems.some(c => c.id === d.id))];
        setResources(combined);
      } catch (e) {
        setResources(DEMO_RESOURCES);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, []);

  // Filter resources
  const filteredResources = resources.filter(item => {
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesCompany = selectedCompany === 'All Companies' || item.company === selectedCompany;
    const matchesSearch = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesCompany && matchesSearch;
  });

  // Find active resource details
  const activeResource = resources.find(r => r.id === activeResourceId);

  const handleOpenResource = (id: string) => {
    setSearchParams({ id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseResource = () => {
    searchParams.delete('id');
    setSearchParams(searchParams);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title || !newResource.description) return;

    const insideList = newResource.whatIsInsideText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const createdItem: ResourceItem = {
      id: `resource-${Date.now()}`,
      title: newResource.title,
      company: newResource.company,
      companyColor: '#188ab2',
      category: newResource.category,
      type: newResource.type,
      format: `${newResource.format} Guide`,
      description: newResource.description,
      aboutText: newResource.aboutText || `## ${newResource.title}\n\n${newResource.description}`,
      downloadUrl: newResource.downloadUrl || "/PM-X-FirstStep-Brochure.pdf",
      fileSize: "2.5 MB",
      pageCount: "10 Pages",
      readTime: "10 min read",
      tags: [newResource.company.toUpperCase(), newResource.category.toUpperCase(), "COMMUNITY"],
      bannerBg: "linear-gradient(135deg, #188ab2 0%, #0e4e66 100%)",
      featured: false,
      downloadCount: 1,
      viewsCount: 150,
      likesCount: 42,
      dateString: "Recent",
      createdAt: new Date().toISOString().split('T')[0],
      whatIsInside: insideList
    };

    const updated = [createdItem, ...resources];
    setResources(updated);

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const customItems: ResourceItem[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([createdItem, ...customItems]));
    } catch (err) {
      console.error("Failed to store custom resource", err);
    }

    setShowUploadModal(false);
    setNewResource({
      title: '',
      category: 'Product Design & GTM',
      company: 'Flipkart',
      type: 'APM Guide',
      format: 'PDF',
      description: '',
      aboutText: '',
      downloadUrl: '',
      whatIsInsideText: ''
    });

    handleOpenResource(createdItem.id);
  };

  const parseMarkdown = (text: string) => {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-extrabold mt-6 mb-2 text-[#111111]">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl md:text-2xl font-black mt-8 mb-4 border-b-[3px] border-[#111111] pb-2 text-[#111111] uppercase tracking-wide">$1</h2>');

    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-[#111111]">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');

    // Numbered List Items
    html = html.replace(/^(\d+)\.\s+(.*?)$/gm, '<li class="my-1.5 leading-relaxed">$2</li>');

    // Bullet List Items
    html = html.replace(/^- (.*?)$/gm, '<li class="my-1.5 leading-relaxed">$1</li>');

    // Wrap consecutive <li> tags in proper <ol> or <ul> lists
    html = html.replace(/((?:<li class="my-1.5 leading-relaxed">.*?<\/li>\s*)+)/g, '<ol class="list-decimal pl-6 my-4 space-y-1 text-sm font-bold text-[#111111]">$1</ol>');

    // Paragraph wrapping
    html = html.replace(/\n\n/g, '</p><p class="mb-4 text-[#111111] leading-relaxed text-sm font-bold">');
    html = '<p class="mb-4 text-[#111111] leading-relaxed text-sm font-bold">' + html + '</p>';

    // Clean up empty paragraph tags or double wraps
    html = html.replace(/<p class=".*?"><ol/g, '<ol');
    html = html.replace(/<\/ol><\/p>/g, '</ol>');
    html = html.replace(/<p class=".*?"><\/p>/g, '');

    return html;
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#111111] selection:bg-[#188ab2]/30">
      {/* Navbar Wrapper */}
      <div className="fixed top-0 z-50 w-full flex flex-col">
        <AnnouncementBanner />
        <nav className="w-full bg-[#FFFFFF] border-b-[3px] border-[#111111]">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Logo toHome={true} />
            <div className="hidden md:flex items-center gap-8 text-sm font-extrabold text-[#111111]">
              <NavLink to="/events">Events</NavLink>
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/resources">Resources</NavLink>
              <a 
                href="/learn" 
                className="ml-2 px-6 py-2.5 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] font-extrabold text-sm shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all select-none"
              >
                Login
              </a>
              <Button variant="primary" onClick={() => navigate('/#enroll')}>
                Apply Now
              </Button>
            </div>
            <button className="md:hidden p-2 border-[3px] border-[#111111] bg-[#FFFFFF]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6 text-[#111111]" /> : <Menu className="h-6 w-6 text-[#111111]" />}
            </button>
          </div>
        </nav>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden w-full bg-[#FFFFFF] border-b-[3px] border-[#111111] p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
            <Link to="/events" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Events</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200">Blog</Link>
            <Link to="/resources" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-lg py-2 border-b-2 border-slate-200 text-[#188ab2]">Resources</Link>
            <a href="/learn" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-6 py-2.5 border-[3px] border-[#111111] text-[#111111] hover:bg-[#FFF3A7] font-extrabold transition-all">Login</a>
            <Button variant="primary" className="w-full" onClick={() => { setIsMenuOpen(false); navigate('/#enroll'); }}>Apply Now</Button>
          </div>
        )}
      </div>

      {/* Resource Detail View */}
      {activeResource ? (
        <div className="pt-36 pb-20 bg-[#FFFFFF]">
          <div className="container mx-auto px-6 max-w-5xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6 select-none">
              <Link to="/" className="hover:text-[#111111]">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/resources" onClick={handleCloseResource} className="hover:text-[#111111]">Resources</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#111111] truncate max-w-xs">{activeResource.title}</span>
            </div>

            {/* Back Button */}
            <button 
              onClick={handleCloseResource}
              className="inline-flex items-center gap-2 text-[#188ab2] font-extrabold hover:underline underline-offset-4 decoration-2 mb-8 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all resources
            </button>

            {/* Title Header */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-3 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] select-none">
                {activeResource.category}
              </span>
              <span className="bg-[#188ab2] text-white border-2 border-[#111111] px-3 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] select-none">
                {activeResource.format}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-[#111111] leading-tight mb-8">
              {activeResource.title}
            </h1>

            {/* Main 2-Column Detail Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left Column: Cover preview, Highlights, Content */}
              <div className="lg:col-span-2 space-y-8 text-left">
                {/* Visual Cover Box */}
                <div 
                  className="w-full aspect-video border-[3px] border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] flex flex-col justify-center items-center p-8 text-white text-center"
                  style={{ background: activeResource.bannerBg || 'linear-gradient(135deg, #188ab2 0%, #111111 100%)' }}
                >
                  <div className="w-16 h-16 bg-[#FFF3A7] border-[3px] border-[#111111] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] mb-4 rotate-[-2deg]">
                    <FileText className="h-8 w-8 text-[#111111]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black leading-tight uppercase max-w-lg mb-2">
                    {activeResource.title}
                  </h2>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    IIT Placement Interview Guide • {activeResource.format}
                  </p>
                </div>

                {/* Detailed Overview Markdown/HTML */}
                <div className="border-t-2 border-[#111111]/10 pt-6">
                  <h3 className="text-xl font-black mb-4">Detailed Overview</h3>
                  <div 
                    className="prose prose-slate max-w-none text-sm text-[#111111] leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(activeResource.aboutText) }}
                  />
                </div>

              </div>

              {/* Right Column: Sticky Table of Contents / What's Inside Card */}
              <div className="space-y-6 text-left">
                <div className="bg-white border-[3px] border-[#111111] p-6 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] sticky top-36 z-10 space-y-6">
                  
                  {/* Sticky What's Inside / Table of Contents Header & List */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#FFF3A7] border-2 border-[#111111] flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                        <BookOpen className="h-4 w-4 text-[#111111]" />
                      </div>
                      <h4 className="font-black text-sm uppercase tracking-wider text-[#111111]">
                        What's Inside This Resource
                      </h4>
                    </div>

                    {activeResource.whatIsInside && activeResource.whatIsInside.length > 0 ? (
                      <ul className="space-y-3">
                        {activeResource.whatIsInside.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs font-extrabold text-[#111111] leading-snug">
                            <span className="w-4 h-4 bg-[#188ab2] text-white border border-[#111111] rounded-full flex items-center justify-center text-[9px] shrink-0 font-black mt-0.5">
                              ✓
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2.5 text-xs font-extrabold text-[#111111]">
                          <span className="w-4 h-4 bg-[#188ab2] text-white border border-[#111111] rounded-full flex items-center justify-center text-[9px] shrink-0 font-black mt-0.5">✓</span>
                          <span>Complete Framework & Specification</span>
                        </li>
                        <li className="flex items-start gap-2.5 text-xs font-extrabold text-[#111111]">
                          <span className="w-4 h-4 bg-[#188ab2] text-white border border-[#111111] rounded-full flex items-center justify-center text-[9px] shrink-0 font-black mt-0.5">✓</span>
                          <span>PM Case Bank & Mentored Examples</span>
                        </li>
                      </ul>
                    )}
                  </div>

                  {/* Primary CTA Button */}
                  <div className="pt-2 border-t-2 border-[#111111]/10">
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        setApplyStatus('idle');
                        setApplyValidationError('');
                        setShowApplyModal(true);
                      }}
                      className="w-full py-3.5 font-black text-sm uppercase shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px]"
                    >
                      Apply Now ➜
                    </Button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* Regular Resource Listing Page */
        <>
          {/* Hero Section */}
          <section className="pt-40 pb-12 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
            <div className="container mx-auto px-6 max-w-5xl text-center">
              <div className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-6 py-2 font-extrabold text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] select-none mb-6 rotate-[-1deg]">
                IIT Placement Special
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-[#111111] leading-tight">
                APM{' '}
                <span className="inline-block bg-[#FFF3A7] border-[3px] border-[#111111] px-4 py-0.5 rotate-[1.5deg] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                  Interview Guide
                </span>
              </h1>
              <p className="text-lg md:text-xl text-[#111111] max-w-3xl mx-auto leading-relaxed font-bold mb-8">
                Company-by-company Product Manager (PM) and Associate Product Manager (APM) interview guides for IIT campus placements — covering shortlisting criteria, deck assignments, interview loops, and Previous Year Questions (PYQs).
              </p>

              {/* View Course CTA */}
              <div className="flex justify-center items-center">
                <a 
                  href="/#who-is-it-for"
                  className="px-8 py-4 bg-[#188ab2] text-white border-[3px] border-[#111111] font-extrabold text-base uppercase shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:bg-[#188ab2] hover:text-white transition-all select-none cursor-pointer inline-block"
                >
                  View Course ➜
                </a>
              </div>
            </div>
          </section>

          {/* Main Content Area with Left Sidebar Filter + Card Grid */}
          <main className="py-12 bg-[#F8FAFC]">
            <div className="container mx-auto px-6 max-w-7xl">
              
              <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left Sidebar Filter */}
                <aside className="w-full lg:w-64 xl:w-72 shrink-0 bg-white border-[3px] border-[#111111] p-5 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] select-none sticky top-36 z-10 space-y-5 text-left">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b-2 border-[#111111]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-[#188ab2]" /> Filter Resources
                    </h3>
                    {(selectedCategory !== 'All Categories' || selectedCompany !== 'All Companies' || selectedQuestionCategory !== 'All Question Types') && (
                      <button
                        onClick={() => { 
                          setSelectedCategory('All Categories'); 
                          setSelectedCompany('All Companies'); 
                          setSelectedQuestionCategory('All Question Types');
                          setActiveResourceTab('guides');
                        }}
                        className="text-[10px] font-black uppercase text-[#188ab2] hover:underline"
                      >
                        Reset ↺
                      </button>
                    )}
                  </div>

                  {/* 1. Guide Category Dropdown */}
                  <div className="border-2 border-[#111111] p-3 bg-white shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                    <button 
                      type="button"
                      onClick={() => toggleDropdown('category')}
                      className="w-full flex items-center justify-between font-black text-xs uppercase tracking-wider text-[#111111] cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <FolderArchive className="h-3.5 w-3.5 text-[#188ab2] shrink-0" />
                        <span className="truncate">Category</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[9px] bg-[#E0F2FE] text-[#0369A1] border border-[#0284C7] px-1.5 py-0.5 font-extrabold rounded truncate max-w-[80px]">
                          {selectedCategory === 'All Categories' ? 'All' : selectedCategory}
                        </span>
                        {openDropdowns.category ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </div>
                    </button>

                    {openDropdowns.category && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-200">
                        {/* List Options */}
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {CATEGORIES.map((cat) => (
                            <label 
                              key={cat} 
                              onClick={() => setSelectedCategory(cat)}
                              className="flex items-center gap-2 cursor-pointer group text-left"
                            >
                              <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                selectedCategory === cat 
                                  ? 'border-[#188ab2] bg-[#188ab2]' 
                                  : 'border-slate-300 group-hover:border-[#111111] bg-white'
                              }`}>
                                {selectedCategory === cat && (
                                  <div className="w-1 h-1 rounded-full bg-white" />
                                )}
                              </div>
                              <span className={`text-xs font-bold leading-snug transition-colors ${
                                selectedCategory === cat 
                                  ? 'text-[#188ab2] font-black' 
                                  : 'text-slate-700 group-hover:text-[#111111]'
                              }`}>
                                {cat}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Question Type Dropdown */}
                  <div className="border-2 border-[#111111] p-3 bg-white shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                    <button 
                      type="button"
                      onClick={() => toggleDropdown('questionType')}
                      className="w-full flex items-center justify-between font-black text-xs uppercase tracking-wider text-[#111111] cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <HelpCircle className="h-3.5 w-3.5 text-[#188ab2] shrink-0" />
                        <span className="truncate">Question Type</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[9px] bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B] px-1.5 py-0.5 font-extrabold rounded truncate max-w-[80px]">
                          {selectedQuestionCategory === 'All Question Types' ? '100+ PYQs' : selectedQuestionCategory}
                        </span>
                        {openDropdowns.questionType ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </div>
                    </button>

                    {openDropdowns.questionType && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-200">
                        {/* List Options */}
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {QUESTION_TYPES.map((qType) => (
                            <label 
                              key={qType} 
                              onClick={() => {
                                setSelectedQuestionCategory(qType);
                                if (qType !== 'All Question Types') {
                                  setActiveResourceTab('questions');
                                }
                              }}
                              className="flex items-center gap-2 cursor-pointer group text-left"
                            >
                              <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                selectedQuestionCategory === qType 
                                  ? 'border-[#188ab2] bg-[#188ab2]' 
                                  : 'border-slate-300 group-hover:border-[#111111] bg-white'
                              }`}>
                                {selectedQuestionCategory === qType && (
                                  <div className="w-1 h-1 rounded-full bg-white" />
                                )}
                              </div>
                              <span className={`text-xs font-bold leading-snug transition-colors ${
                                selectedQuestionCategory === qType 
                                  ? 'text-[#188ab2] font-black' 
                                  : 'text-slate-700 group-hover:text-[#111111]'
                              }`}>
                                {qType}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Company Dropdown */}
                  <div className="border-2 border-[#111111] p-3 bg-white shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                    <button 
                      type="button"
                      onClick={() => toggleDropdown('company')}
                      className="w-full flex items-center justify-between font-black text-xs uppercase tracking-wider text-[#111111] cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Tag className="h-3.5 w-3.5 text-[#188ab2] shrink-0" />
                        <span className="truncate">Company</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[9px] bg-[#E0F2FE] text-[#0369A1] border border-[#0284C7] px-1.5 py-0.5 font-extrabold rounded truncate max-w-[80px]">
                          {selectedCompany === 'All Companies' ? 'All' : selectedCompany}
                        </span>
                        {openDropdowns.company ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </div>
                    </button>

                    {openDropdowns.company && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-200">
                        {/* List Options */}
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {COMPANIES.map((comp) => (
                            <label 
                              key={comp} 
                              onClick={() => setSelectedCompany(comp)}
                              className="flex items-center gap-2 cursor-pointer group text-left"
                            >
                              <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                selectedCompany === comp 
                                  ? 'border-[#188ab2] bg-[#188ab2]' 
                                  : 'border-slate-300 group-hover:border-[#111111] bg-white'
                              }`}>
                                {selectedCompany === comp && (
                                  <div className="w-1 h-1 rounded-full bg-white" />
                                )}
                              </div>
                              <span className={`text-xs font-bold leading-snug transition-colors ${
                                selectedCompany === comp 
                                  ? 'text-[#188ab2] font-black' 
                                  : 'text-slate-700 group-hover:text-[#111111]'
                              }`}>
                                {comp}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reset Filters Button */}
                  {(selectedCategory !== 'All Categories' || selectedCompany !== 'All Companies' || selectedQuestionCategory !== 'All Question Types') && (
                    <button
                      onClick={() => { 
                        setSelectedCategory('All Categories'); 
                        setSelectedCompany('All Companies'); 
                        setSelectedQuestionCategory('All Question Types');
                        setActiveResourceTab('guides');
                      }}
                      className="w-full py-2 bg-[#FFF3A7] border-2 border-[#111111] text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-[#188ab2] hover:text-white transition-all cursor-pointer"
                    >
                      Reset Filters ↺
                    </button>
                  )}

                </aside>

                {/* Right Side: Main Resource Feed / Question Cards */}
                <div className="flex-1 w-full space-y-6 text-left">

                  {/* View Switcher Tabs */}
                  <div className="flex flex-wrap items-center gap-3 border-b-2 border-[#111111]/10 pb-4">
                    <button
                      onClick={() => {
                        setActiveResourceTab('guides');
                        setSelectedQuestionCategory('All Question Types');
                      }}
                      className={`px-5 py-2.5 font-black text-xs md:text-sm uppercase border-[3px] border-[#111111] transition-all flex items-center gap-2 select-none cursor-pointer ${
                        activeResourceTab === 'guides' 
                          ? 'bg-[#188ab2] text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]' 
                          : 'bg-white text-[#111111] hover:bg-[#FFF3A7]'
                      }`}
                    >
                      <BookOpen className="h-4 w-4" /> APM Interview Guides
                    </button>

                    <button
                      onClick={() => setActiveResourceTab('questions')}
                      className={`px-5 py-2.5 font-black text-xs md:text-sm uppercase border-[3px] border-[#111111] transition-all flex items-center gap-2 select-none cursor-pointer ${
                        activeResourceTab === 'questions' 
                          ? 'bg-[#188ab2] text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]' 
                          : 'bg-white text-[#111111] hover:bg-[#FFF3A7]'
                      }`}
                    >
                      <HelpCircle className="h-4 w-4" /> IIT Question Bank (PYQs)
                    </button>
                  </div>

                  {activeResourceTab === 'questions' || selectedQuestionCategory !== 'All Question Types' ? (
                    /* QUESTION BANK VIEW */
                    <div className="space-y-6">
                      <div className="bg-[#FFF3A7] border-[3px] border-[#111111] p-4 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <h3 className="font-black text-sm uppercase text-[#111111]">
                            IIT Placement Question Bank — {selectedQuestionCategory}
                          </h3>
                          <p className="text-xs font-bold text-slate-600 mt-0.5">
                            Showing questions asked in Flipkart, Zomato, Uber, Sprinklr & top startups.
                          </p>
                        </div>
                        <span className="bg-white border border-[#111111] px-3 py-1 text-xs font-extrabold">
                          First 3 per category free • Lock applies to rest 🔒
                        </span>
                      </div>

                      {(() => {
                        const filteredQuestions = IIT_QUESTIONS_DATA.filter(q => {
                          const matchesQCat = selectedQuestionCategory === 'All Question Types' || q.category === selectedQuestionCategory;
                          
                          let matchesCompany = selectedCompany === 'All Companies';
                          if (!matchesCompany) {
                            const compLower = selectedCompany.toLowerCase();
                            const qCompLower = q.company.toLowerCase();

                            if (qCompLower.includes(compLower)) {
                              matchesCompany = true;
                            } else if (compLower === 'zomato' && qCompLower.includes('blinkit')) {
                              matchesCompany = true;
                            } else if (compLower === 'meta' && (qCompLower.includes('facebook') || qCompLower.includes('instagram') || qCompLower.includes('whatsapp') || qCompLower.includes('threads'))) {
                              matchesCompany = true;
                            } else if (compLower === 'google' && (qCompLower.includes('youtube') || qCompLower.includes('maps') || qCompLower.includes('cloud'))) {
                              matchesCompany = true;
                            } else if (compLower === 'ola' && qCompLower.includes('ola electric')) {
                              matchesCompany = true;
                            }
                          }

                          return matchesQCat && matchesCompany;
                        });

                        if (filteredQuestions.length === 0) {
                          return (
                            <div className="border-[3px] border-[#111111] p-12 text-center bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] max-w-xl mx-auto">
                              <Info className="h-10 w-10 mx-auto mb-4 text-slate-400" />
                              <h3 className="text-xl font-extrabold text-[#111111] mb-2">No matching questions found</h3>
                              <p className="text-sm font-bold text-slate-500 mb-6">Try selecting a different company or question type.</p>
                              <Button variant="outline" onClick={() => { setSelectedQuestionCategory('All Question Types'); setSelectedCompany('All Companies'); }}>
                                Reset Question Filters
                              </Button>
                            </div>
                          );
                        }

                        // Per-category counter map to lock 4th+ question in each category
                        const categoryCounters: Record<string, number> = {};

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredQuestions.map((q) => {
                              const currentCount = (categoryCounters[q.category] || 0);
                              categoryCounters[q.category] = currentCount + 1;

                              // First 3 questions per category are UNLOCKED. Question 4+ is LOCKED.
                              const isLocked = currentCount >= 3;

                              if (isLocked) {
                                return (
                                  <div 
                                    key={q.id}
                                    onClick={() => {
                                      setApplyStatus('idle');
                                      setApplyValidationError('');
                                      setShowApplyModal(true);
                                    }}
                                    className="relative bg-white border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden cursor-pointer select-none group min-h-[220px] flex flex-col justify-between"
                                  >
                                    {/* Blurred Content Background */}
                                    <div className="filter blur-[4px] opacity-30 pointer-events-none select-none">
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="bg-slate-200 text-slate-700 px-2 py-0.5 text-xs font-bold">{q.category}</span>
                                        <span className="text-xs font-bold text-slate-400">{q.company}</span>
                                      </div>
                                      <h4 className="font-extrabold text-base text-slate-800 mb-2">{q.question}</h4>
                                      <p className="text-xs text-slate-500">{q.description}</p>
                                    </div>

                                    {/* Lock Overlay */}
                                    <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center z-10 group-hover:bg-white/75 transition-all">
                                      <div className="w-10 h-10 bg-[#FFF3A7] border-[2.5px] border-[#111111] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] mb-2 rotate-[-3deg]">
                                        <Lock className="h-5 w-5 text-[#111111]" />
                                      </div>
                                      <span className="bg-[#FFF3A7] text-[#111111] border border-[#111111] px-2.5 py-0.5 text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] mb-2">
                                        🔒 LOCKED • IIT PLACEMENT PYQ
                                      </span>
                                      <p className="font-black text-xs text-[#111111] mb-3 max-w-xs line-clamp-2">
                                        {q.question}
                                      </p>
                                      <button className="bg-[#188ab2] text-white border-2 border-[#111111] px-4 py-1.5 text-xs font-black uppercase shadow-[2.5px_2.5px_0px_0px_rgba(17,17,17,1)] hover:bg-[#0f6786] transition-all">
                                        Unlock Question & Answer 🔒
                                      </button>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div 
                                  key={q.id}
                                  className="bg-white border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all flex flex-col justify-between text-left"
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-3 mb-3">
                                      <span className="bg-[#FFF3A7] text-[#111111] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[11px] rounded-md shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)]">
                                        {q.category}
                                      </span>
                                      <span className="bg-[#E0F2FE] text-[#0369A1] border border-[#0284C7] px-2.5 py-0.5 font-extrabold text-[11px] rounded-md">
                                        {q.company}
                                      </span>
                                    </div>

                                    <h4 className="text-base font-black text-[#111111] leading-snug mb-3">
                                      {q.question}
                                    </h4>

                                    {q.description && (
                                      <div className="text-xs font-semibold text-slate-600 leading-relaxed mb-4 border-l-3 border-[#188ab2] pl-3 py-1 bg-slate-50">
                                        <strong className="text-[#188ab2] font-black block mb-0.5">Approach Hint:</strong>
                                        {q.description}
                                      </div>
                                    )}
                                  </div>

                                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-500">
                                    <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                                      ✓ Unlocked IIT Question
                                    </span>
                                    <button 
                                      onClick={() => {
                                        setApplyStatus('idle');
                                        setApplyValidationError('');
                                        setShowApplyModal(true);
                                      }}
                                      className="bg-[#188ab2] text-white border-2 border-[#111111] px-3.5 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-[#0f6786] transition-all"
                                    >
                                      Practice Case ➜
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    /* APM GUIDES FEED VIEW */
                    loading ? (
                      <div className="flex justify-center py-16">
                        <span className="text-lg font-bold">Loading guides...</span>
                      </div>
                    ) : filteredResources.length === 0 ? (
                      <div className="border-[3px] border-[#111111] p-12 text-center bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] max-w-xl mx-auto">
                        <Info className="h-10 w-10 mx-auto mb-4 text-slate-400" />
                        <h3 className="text-xl font-extrabold text-[#111111] mb-2">No matching resources found</h3>
                        <p className="text-sm font-bold text-slate-500 mb-6">Try clearing your filters.</p>
                        <Button variant="outline" onClick={() => { setSelectedCategory('All Categories'); setSelectedCompany('All Companies'); }}>
                          Clear Filters
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredResources.map((resource) => (
                          <div 
                            key={resource.id}
                            onClick={() => handleOpenResource(resource.id)}
                            className="bg-white border-[3px] border-[#111111] p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all flex flex-col justify-between cursor-pointer select-none group"
                          >
                            {/* Title */}
                            <h3 className="text-lg md:text-xl font-black text-[#111111] mb-2 leading-snug group-hover:text-[#188ab2] transition-colors">
                              {resource.title}
                            </h3>

                            {/* Short Description */}
                            <p className="text-xs md:text-sm font-semibold text-slate-600 leading-relaxed mb-5">
                              {resource.description}
                            </p>

                            {/* Footer Row: Tags + View Guide CTA */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-[#E0F2FE] text-[#0369A1] border border-[#0284C7] px-2.5 py-0.5 font-extrabold text-[11px] rounded-md">
                                  {resource.category}
                                </span>
                                <span className="bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B] px-2.5 py-0.5 font-extrabold text-[11px] rounded-md">
                                  IIT Placement PYQ
                                </span>
                              </div>

                              <button 
                                onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleOpenResource(resource.id); }}
                                className="bg-[#188ab2] text-white border-2 border-[#111111] px-5 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-[#0f6786] transition-all"
                              >
                                View Guide ➜
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>

              </div>

            </div>
          </main>
        </>
      )}

      {/* Modal Popup Enrollment Form (Apply Now popup) */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-[#111111]/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md border-[4px] border-[#111111] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] text-left">
            <button 
              onClick={() => { setShowApplyModal(false); setApplyStatus('idle'); }}
              className="absolute top-4 right-4 bg-[#FFF3A7] border-2 border-[#111111] p-1.5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-[#188ab2] hover:text-white transition-colors"
            >
              <X className="h-4 w-4 text-[#111111]" />
            </button>

            {applyStatus === 'success' ? (
              <div className="text-center py-6">
                <div className="bg-[#FFFFFF] border-[3px] border-[#111111] text-green-600 w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                  <CheckCircle2 className="h-8 w-8 text-[#188ab2]" />
                </div>
                <h3 className="text-2xl font-black mb-2 text-[#111111]">Application Received!</h3>
                <p className="text-sm font-bold text-slate-600 mb-6 leading-relaxed">
                  Your application for <span className="text-[#188ab2] font-black">{activeResource?.title || 'the guide'}</span> has been submitted. Our team will contact you shortly on WhatsApp.
                </p>
                <Button
                  variant="primary"
                  className="w-full py-2.5 font-extrabold uppercase shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]"
                  onClick={() => { setShowApplyModal(false); setApplyStatus('idle'); }}
                >
                  Close Window
                </Button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-5">
                <div>
                  <div className="inline-block bg-[#FFF3A7] border-2 border-[#111111] px-2.5 py-0.5 font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(17,17,17,1)] mb-2">
                    PM-X Accelerator
                  </div>
                  <h3 className="text-xl font-black text-[#111111]">Apply Now</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 line-clamp-1">
                    Resource: {activeResource?.title || 'APM Interview Guide'}
                  </p>
                </div>

                {applyValidationError && (
                  <p className="text-red-600 text-xs font-extrabold bg-red-50 border-2 border-red-500/30 p-2.5">
                    {applyValidationError}
                  </p>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={applyFormData.fullName}
                      onChange={(e) => setApplyFormData({ ...applyFormData, fullName: e.target.value })}
                      placeholder="Your Name" 
                      className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold text-sm outline-none focus:bg-[#FFF3A7]/20 transition-all placeholder-slate-400" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={applyFormData.email}
                      onChange={(e) => setApplyFormData({ ...applyFormData, email: e.target.value })}
                      placeholder="name@example.com" 
                      className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold text-sm outline-none focus:bg-[#FFF3A7]/20 transition-all placeholder-slate-400" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">WhatsApp / Phone Number *</label>
                    <input 
                      type="text" 
                      required
                      value={applyFormData.phone}
                      onChange={(e) => setApplyFormData({ ...applyFormData, phone: e.target.value })}
                      placeholder="+91 99000 00000" 
                      className="w-full px-4 py-3 border-[3px] border-[#111111] bg-[#FFFFFF] font-bold text-sm outline-none focus:bg-[#FFF3A7]/20 transition-all placeholder-slate-400" 
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3.5 text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
                  isLoading={applyStatus === 'loading'}
                >
                  {applyStatus === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </span>
                  ) : (
                    'Submit Application ➜'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-[#111111]/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl border-[4px] border-[#111111] bg-white p-8 shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] text-left my-8">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 bg-[#FFF3A7] border-2 border-[#111111] p-1.5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-[#188ab2] hover:text-white transition-colors"
            >
              <X className="h-5 w-5 text-[#111111]" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFF3A7] border-2 border-[#111111] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                <Upload className="h-5 w-5 text-[#111111]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#111111]">Upload New Resource</h3>
                <p className="text-xs font-bold text-slate-500">Share your PRD template, case study, or cheatsheet with the PM community.</p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#111111] mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  placeholder="e.g. B2B SaaS Launch Checklist & PRD"
                  className="w-full p-3 border-2 border-[#111111] font-bold text-sm focus:bg-[#FFF3A7]/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#111111] mb-1">Company</label>
                  <select
                    value={newResource.company}
                    onChange={(e) => setNewResource({ ...newResource, company: e.target.value })}
                    className="w-full p-3 border-2 border-[#111111] font-bold text-sm bg-white outline-none"
                  >
                    {COMPANIES.filter(c => c !== 'All Companies').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#111111] mb-1">Category</label>
                  <select
                    value={newResource.category}
                    onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                    className="w-full p-3 border-2 border-[#111111] font-bold text-sm bg-white outline-none"
                  >
                    {CATEGORIES.filter(c => c !== 'All Categories').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#111111] mb-1">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  placeholder="Brief 1-2 sentence overview of what this resource contains..."
                  className="w-full p-3 border-2 border-[#111111] font-bold text-sm focus:bg-[#FFF3A7]/20 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#111111] mb-1">Full Details / Markdown Content</label>
                <textarea
                  rows={4}
                  value={newResource.aboutText}
                  onChange={(e) => setNewResource({ ...newResource, aboutText: e.target.value })}
                  placeholder="Detailed breakdown, section headers, frameworks..."
                  className="w-full p-3 border-2 border-[#111111] font-bold text-sm focus:bg-[#FFF3A7]/20 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#111111] mb-1">What's Inside (1 item per line)</label>
                <textarea
                  rows={3}
                  value={newResource.whatIsInsideText}
                  onChange={(e) => setNewResource({ ...newResource, whatIsInsideText: e.target.value })}
                  placeholder="Notion PRD link&#10;PDF Printable guide&#10;RICE Calculator"
                  className="w-full p-3 border-2 border-[#111111] font-bold text-sm focus:bg-[#FFF3A7]/20 outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Publish Resource ➜
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#FFFFFF] py-12 border-t-[3px] border-[#111111]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-16 mb-16 text-left">
            <div className="col-span-1">
              <Logo />
              <p className="text-[#111111] text-sm leading-relaxed max-w-xs mt-8 font-bold">
                Helping engineers and college grads launch PM careers. Experienced mentorship and real-world outcomes.
              </p>
            </div>
            <div>
              <h4 className="font-extrabold text-[#111111] mb-6">Quick Links</h4>
              <ul className="space-y-4 text-[#111111] text-sm font-bold">
                <li><Link to="/students" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">For Students 🎓</Link></li>
                <li><a href="/#who-is-it-for" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Who is it for?</a></li>
                <li><Link to="/events" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Events</Link></li>
                <li><Link to="/blog" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4">Blog</Link></li>
                <li><Link to="/resources" className="hover:underline decoration-2 decoration-[#188ab2] underline-offset-4 text-[#188ab2]">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold text-[#111111] mb-6">Join Our Community</h4>
              <p className="text-[#111111] text-sm mb-6 leading-relaxed font-bold">
                Stay updated with free resources, case study deep-dives, and networking opportunities.
              </p>
            </div>
          </div>
          <hr className="border-t-[3px] border-[#111111] mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#111111] text-[10px] font-bold uppercase tracking-widest">© 2026 StepSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { ResourcesBrutalism as ResourcesPage };
