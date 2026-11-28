import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  Lock,
  Unlock,
  Send,
  Layers,
  Award,
  Check,
  BarChart3,
  Target,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BrainCircuit,
  GitFork,
  Crosshair,
  Scale,
  Zap,
  Split,
  Activity,
  PackageCheck,
  Truck,
  Repeat,
  Sliders,
  DollarSign,
  HelpCircle,
  Info,
  FileText,
  TrendingDown,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';

export interface QnAPair {
  id: string;
  question: string;
  answer: string;
  isMatch: boolean;
  rowId?: number;
  category?: 'initial' | 'later' | 'irrelevant';
  classification?: string;
  why?: string;
  isPreliminary?: boolean;
}

// ── 43 CLASSIFIED CASE QUESTIONS FOR BLUESTONE PRODUCT RCA ───────────────────
export interface CaseQuestionItem {
  id: number;
  question: string;
  category: 'initial' | 'later' | 'irrelevant';
  categoryLabel: string;
  classification: string;
  why: string;
  answer: string;
  keywords: string[];
}

export const BLUESTONE_QUESTIONS_DATA: CaseQuestionItem[] = [
  // ── 1. PRELIMINARY CLARIFYING QUESTIONS (ASK INITIALLY · #1-9) ──────────────
  {
    id: 1,
    question: 'Are we trying to understand the decline in absolute gross profit, gross profit margin, or both?',
    category: 'initial',
    categoryLabel: 'Preliminary Clarifying (Ask Initially)',
    classification: 'Ask initially',
    why: 'Absolute GP and GP margin are different metrics. I need to know exactly what has declined.',
    answer: 'Both. Absolute gross profit fell from ₹20.0 Cr to ₹17.1 Cr (-14.5% / -15%), and gross profit margin dropped from 20.0% to 16.3% (-370 bps).',
    keywords: [
      'absolute gross profit',
      'gross profit margin',
      'both',
      'absolute gp',
      'gp margin',
      'absolute vs margin',
      'absolute or margin',
      'gross profit percentage',
      'gp percent'
    ]
  },
  {
    id: 2,
    question: 'What is the time period over which revenue increased by 5% and gross profit declined by 15%?',
    category: 'initial',
    categoryLabel: 'Preliminary Clarifying (Ask Initially)',
    classification: 'Ask initially',
    why: 'Establishes the comparison period and helps identify seasonality or unusual events.',
    answer: 'This was observed over the last quarter (past 3 months / Q3) compared to the preceding quarter.',
    keywords: [
      'time period',
      'period',
      'over what time',
      'timeframe',
      'how long',
      'timeline',
      'duration',
      'what months',
      'over which period'
    ]
  },
  {
    id: 3,
    question: 'Are we comparing performance against the previous month, previous year, or a target?',
    category: 'initial',
    categoryLabel: 'Preliminary Clarifying (Ask Initially)',
    classification: 'Ask initially',
    why: 'The comparison baseline changes how I interpret the performance.',
    answer: 'We are comparing performance against the previous quarter (Q-o-Q) as well as our budgeted annual plan baseline.',
    keywords: [
      'comparing performance against',
      'previous month',
      'previous year',
      'target',
      'baseline',
      'comparison period',
      'benchmark',
      'yoy or qoq',
      'compared to what'
    ]
  },
  {
    id: 4,
    question: 'Is the problem limited to the online business, or does it include both online and offline sales?',
    category: 'initial',
    categoryLabel: 'Preliminary Clarifying (Ask Initially)',
    classification: 'Ask initially',
    why: 'Defines the scope of the investigation.',
    answer: 'While BlueStone operates omnichannel retail stores, as Digital Commerce PM your mandate covers the website and mobile app channels.',
    keywords: [
      'online business',
      'online and offline',
      'both online and offline',
      'limited to the online',
      'stores or online',
      'channels in scope',
      'digital products in scope',
      'scope',
      'which digital products',
      'what is in scope',
      'platforms in scope'
    ]
  },
  {
    id: 5,
    question: 'Are we investigating the entire BlueStone business or a particular product category or geography?',
    category: 'initial',
    categoryLabel: 'Preliminary Clarifying (Ask Initially)',
    classification: 'Ask initially',
    why: 'Helps establish the business scope before analysing segments.',
    answer: 'Start with the pan-India digital commerce business. You can segment by product category (Gold vs Diamond) and geography once you lay out your issue tree.',
    keywords: [
      'entire bluestone business',
      'particular product category',
      'geography',
      'regions',
      'pan-india',
      'business scope',
      'specific geography',
      'entire business or specific'
    ]
  },
  {
    id: 6,
    question: 'How does BlueStone define gross profit? Is it revenue minus product cost, or are other costs included?',
    category: 'initial',
    categoryLabel: 'Preliminary Clarifying (Ask Initially)',
    classification: 'Ask initially',
    why: 'Ensures I use the correct metric definition and don\'t confuse gross profit with contribution or net profit.',
    answer: 'Gross profit is strictly Net Revenue minus Cost of Goods Sold (precious metal cost + diamond/gem cost + vendor making cost). Logistics, marketing, and corporate overheads are treated below gross margin.',
    keywords: [
      'how does bluestone define gross profit',
      'define gross profit',
      'revenue minus product cost',
      'definition of gross profit',
      'cogs',
      'formula for gross profit',
      'gross margin calculation',
      'other costs included'
    ]
  },
  {
    id: 7,
    question: 'Is there a specific business objective beyond identifying the reason for the decline—for example, recovering gross profit while maintaining revenue growth?',
    category: 'initial',
    categoryLabel: 'Preliminary Clarifying (Ask Initially)',
    classification: 'Ask initially',
    why: 'Clarifies the desired outcome and helps frame recommendations later.',
    answer: 'Yes. The executive objective is to identify the root cause, halt the margin erosion, and restore gross profit margin back above 19% without sacrificing our +5% top-line revenue momentum.',
    keywords: [
      'specific business objective',
      'business objective',
      'recovering gross profit',
      'goal',
      'target outcome',
      'mandate',
      'desired outcome',
      'what is the goal'
    ]
  },
  {
    id: 8,
    question: 'Has the problem been observed consistently throughout the period, or is it concentrated in a particular month or event?',
    category: 'initial',
    categoryLabel: 'Preliminary Clarifying (Ask Initially)',
    classification: 'Ask initially',
    why: 'Helps determine whether the issue is persistent or caused by a specific event.',
    answer: 'The gross margin compression developed steadily over the 3-month quarter, accelerating during promotional weekend events.',
    keywords: [
      'observed consistently',
      'consistently throughout the period',
      'concentrated in a particular month',
      'one-off event',
      'sudden or gradual',
      'steady decline',
      'particular event'
    ]
  },
  {
    id: 9,
    question: 'Are there any known major changes during this period, such as pricing changes, promotions, product launches, or business changes?',
    category: 'initial',
    categoryLabel: 'Preliminary Clarifying (Ask Initially)',
    classification: 'Ask initially',
    why: 'Identifies important context without assuming the cause.',
    answer: 'No major app redesigns or feature removals. However, the marketing team ran aggressive festive discount campaigns on gold jewellery, and daily making-charge discounts were heavily promoted on the homepage.',
    keywords: [
      'known major changes',
      'major changes during this period',
      'pricing changes',
      'promotions',
      'product launches',
      'redesign',
      'major redesign',
      'features launched',
      'features removed',
      'major product redesign',
      'new features launched'
    ]
  },

  // ── 2. QUESTIONS RELEVANT TO LATER INVESTIGATION STAGES (ASK LATER · #10-30) ─
  {
    id: 10,
    question: 'Has revenue growth come from an increase in the number of orders or an increase in average order value?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Helps decompose revenue and identify the source of growth.',
    answer: 'Order volume grew by +10% (driven by promotional traffic), while Average Order Value (AOV) declined by ~4.5%.',
    keywords: [
      'number of orders or an increase in average order value',
      'orders or aov',
      'revenue growth come from',
      'order count',
      'volume vs value',
      'orders increased or aov',
      'source of revenue growth'
    ]
  },
  {
    id: 11,
    question: 'Has the average selling price changed during this period?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Helps identify the impact of pricing on revenue and margin.',
    answer: 'The average selling price (ASP) declined by 6% because customers disproportionately purchased smaller-ticket, lightweight gold items.',
    keywords: [
      'average selling price changed',
      'average selling price',
      'asp changed',
      'asp',
      'selling price'
    ]
  },
  {
    id: 12,
    question: 'Has the product category mix changed, for example, gold jewellery versus diamond jewellery?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'A shift towards lower-margin categories could explain declining gross profit despite revenue growth.',
    answer: 'Yes! High-margin diamond jewellery sales dropped from 35% to 22% of GMV, while lower-margin plain gold surged from 50% to 68% of total sales.',
    keywords: [
      'product category mix changed',
      'category mix',
      'gold jewellery versus diamond',
      'gold vs diamond',
      'product mix',
      'category share',
      'category contribution'
    ]
  },
  {
    id: 13,
    question: 'Has the cost of raw materials, especially gold and diamonds, increased?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Investigates possible increases in product cost.',
    answer: 'Open-market spot gold prices rose 8%, compressing margins because BlueStone\'s digital catalogue prices were not updated dynamically in real-time.',
    keywords: [
      'cost of raw materials',
      'raw materials',
      'gold and diamonds increased',
      'gold price increased',
      'raw material cost',
      'metal prices',
      'commodity prices'
    ]
  },
  {
    id: 14,
    question: 'Have procurement or supplier costs changed?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Helps identify whether input costs or supplier terms are affecting margins.',
    answer: 'Vendor making charges rose modestly by 2%, but the primary margin squeeze was unhedged spot gold procurement costs.',
    keywords: [
      'procurement or supplier costs',
      'supplier costs',
      'procurement costs',
      'vendor costs',
      'supplier terms',
      'vendor making charges'
    ]
  },
  {
    id: 15,
    question: 'Have manufacturing costs, wastage or production efficiency changed?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Helps investigate internal cost drivers.',
    answer: 'Manufacturing wastage remained within normal 1.2% benchmark tolerances. Factory production efficiency was not the primary driver.',
    keywords: [
      'manufacturing costs',
      'wastage or production efficiency',
      'production efficiency',
      'factory costs',
      'making costs',
      'production wastage'
    ]
  },
  {
    id: 16,
    question: 'Have discounts or promotional offers increased?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Discounts can increase sales while reducing realised selling price and margin.',
    answer: 'Yes. Promotional discounts and coupon redemptions increased from an average of 4% to 9% of total order value during festive pushes.',
    keywords: [
      'discounts or promotional offers',
      'discounts increased',
      'promotional offers increased',
      'coupons',
      'promotions increased',
      'discount percentage'
    ]
  },
  {
    id: 17,
    question: 'Has website or app traffic changed during this period?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Helps investigate the acquisition part of the product funnel.',
    answer: 'Total digital traffic grew 10% (from 10 Lakh to 11 Lakh sessions), driven by paid festive acquisition campaigns.',
    keywords: [
      'website or app traffic changed',
      'traffic changed',
      'sessions changed',
      'app traffic',
      'web traffic',
      'visitor volume',
      'number of sessions'
    ]
  },
  {
    id: 18,
    question: 'Has the conversion rate changed?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Helps understand whether a product experience or customer behaviour issue is affecting orders.',
    answer: 'The overall conversion rate softened slightly from 2.0% to 1.9% (-0.1%), remaining relatively healthy overall.',
    keywords: [
      'conversion rate changed',
      'conversion rate',
      'cr changed',
      'overall conversion',
      'cvr changed'
    ]
  },
  {
    id: 19,
    question: 'At which stage of the customer journey are we seeing the biggest drop-off?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Helps locate friction in discovery, product consideration, cart or checkout.',
    answer: 'Product Page views increased, but Add-to-Cart for diamond jewellery declined by 28%, while Add-to-Cart for plain gold spiked +35%.',
    keywords: [
      'biggest drop-off',
      'customer journey',
      'funnel drop-off',
      'drop-off stage',
      'where are users dropping off',
      'add-to-cart conversion declined',
      'cart drop-off'
    ]
  },
  {
    id: 20,
    question: 'Has the average order value changed?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Helps identify changes in basket value and customer purchasing behaviour.',
    answer: 'Average Order Value (AOV) declined from ₹42,000 to ₹39,500 due to down-trading towards plain gold chains and lightweight rings.',
    keywords: [
      'average order value changed',
      'average order value',
      'aov changed',
      'basket size',
      'average basket value'
    ]
  },
  {
    id: 21,
    question: 'Have customers shifted towards lower-priced or lower-margin products?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Helps connect customer preferences and product mix to gross profit.',
    answer: 'Exactly. Customers shifted heavily from 32% margin studded/diamond items to 10-12% margin plain gold coins and lightweight chains.',
    keywords: [
      'customers shifted towards lower-priced',
      'shifted towards lower-priced',
      'lower-margin products',
      'down-trading',
      'lower priced items',
      'low margin items'
    ]
  },
  {
    id: 22,
    question: 'Have stock-outs increased for high-margin or popular products?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Could explain lost sales or an unfavourable product mix.',
    answer: 'Stock availability for high-margin diamond rings and earrings dropped by 18% due to vendor gemstone supply delays, while gold inventory was abundant.',
    keywords: [
      'stock-outs increased',
      'stock-outs',
      'product availability',
      'out of stock',
      'high-margin stockouts',
      'inventory availability',
      'has product availability changed',
      'sku availability'
    ]
  },
  {
    id: 23,
    question: 'Have return and cancellation rates changed?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'May affect realised revenue, costs and customer experience, depending on accounting treatment.',
    answer: 'Returns remained steady at 3.2%; cancellations did not show statistically meaningful variance.',
    keywords: [
      'return and cancellation rates',
      'returns changed',
      'cancellations changed',
      'cancellation rates',
      'return rate',
      'order returns'
    ]
  },
  {
    id: 24,
    question: 'Have customer acquisition costs or marketing channel performance changed?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Useful for understanding acquisition efficiency, although CAC is not itself a direct gross-profit component.',
    answer: 'Blended CAC rose 12% as spend targeted deal-seeking cohorts; note that CAC is accounted for in operating expenses below Gross Profit.',
    keywords: [
      'customer acquisition costs',
      'cac changed',
      'marketing channel performance',
      'acquisition costs',
      'ad spend',
      'channel performance'
    ]
  },
  {
    id: 25,
    question: 'Have competitors changed their prices, promotions or product offerings?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Helps investigate external market factors if customer demand or conversion appears affected.',
    answer: 'Competitors (Tanishq, CaratLane) ran festive campaigns, but BlueStone\'s promotional discounts on plain gold making charges were deeper than competitors.',
    keywords: [
      'competitors changed their prices',
      'competitor promotions',
      'competitors',
      'tanishq',
      'caratlane',
      'external market',
      'market competition'
    ]
  },
  {
    id: 26,
    question: 'Have repeat purchase rates or customer retention changed?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Helps investigate whether changes in returning-customer behaviour contribute to performance.',
    answer: 'Repeat buyer share fell 3%; first-time discount buyers made up the bulk of the +10% order growth.',
    keywords: [
      'repeat purchase rates',
      'customer retention changed',
      'repeat buyers',
      'retention rate',
      'returning customers',
      'repeat purchases'
    ]
  },
  {
    id: 27,
    question: 'Is gross profit declining across all product categories or only specific categories?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Helps isolate the segment responsible for the decline.',
    answer: 'The decline is heavily concentrated in Plain Gold (margins fell from 14% to 9%) and the loss of volume in Solitaires/Diamonds.',
    keywords: [
      'declining across all product categories',
      'all product categories or only specific',
      'category level gross profit',
      'specific categories',
      'which category is declining'
    ]
  },
  {
    id: 28,
    question: 'Can we see gross profit and unit economics at SKU level?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Helps isolate price, cost, volume and product-mix effects accurately.',
    answer: 'The top 50 promotional plain gold SKUs generated negative contribution margin once gateway and logistics fees were accounted for.',
    keywords: [
      'sku level',
      'unit economics at sku level',
      'gross profit at sku level',
      'sku unit economics',
      'individual skus',
      'sku level data'
    ]
  },
  {
    id: 29,
    question: 'Have there been changes in payment failures, checkout errors or website performance?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Relevant if funnel analysis suggests a digital experience issue.',
    answer: 'Checkout error rates and payment gateway success rates remained healthy (89–91% success). Website performance and crashes have not deteriorated significantly.',
    keywords: [
      'payment failures',
      'checkout errors',
      'website performance deteriorated',
      'gateway failures',
      'payment success rate',
      'app crashes',
      'have payment failures increased',
      'has website performance deteriorated',
      'have app crashes increased',
      'checkout experience changed'
    ]
  },
  {
    id: 30,
    question: 'Do we have customer feedback or research explaining why customers are not purchasing?',
    category: 'later',
    categoryLabel: 'Diagnostic Investigation (Ask Later)',
    classification: 'Ask later',
    why: 'Useful for validating a suspected customer-experience problem.',
    answer: 'Customer feedback indicated diamond price inflation turned casual buyers off, while homepage merchandising prominently led with \'Zero Making Charge\' gold banners.',
    keywords: [
      'customer feedback or research',
      'customers complained',
      'why customers are not purchasing',
      'user research',
      'nps',
      'feedback',
      'have customers complained about the experience',
      'complaints'
    ]
  },

  // ── 3. QUESTIONS THAT ARE NOT RELEVANT INITIALLY OR PREMATURE (#31-43) ───────
  {
    id: 31,
    question: 'What programming language is the BlueStone website built in?',
    category: 'irrelevant',
    categoryLabel: 'Premature / Not Relevant Initially',
    classification: 'Not relevant initially',
    why: 'The technology stack does not explain the gross profit decline unless a technical issue is identified.',
    answer: 'The website tech stack (Next.js / Node.js) does not explain gross profit decline and is not relevant to our business RCA at this stage.',
    keywords: [
      'programming language',
      'tech stack',
      'what language is the website built in',
      'framework',
      'frontend framework'
    ]
  },
  {
    id: 32,
    question: 'Which database does BlueStone use?',
    category: 'irrelevant',
    categoryLabel: 'Premature / Not Relevant Initially',
    classification: 'Not relevant initially',
    why: 'Database selection is not a business or product performance driver by itself.',
    answer: 'Database choice (PostgreSQL / Redis) has no impact on business performance or gross margin decomposition.',
    keywords: [
      'which database',
      'database does bluestone use',
      'database',
      'sql or nosql',
      'mongodb',
      'postgres'
    ]
  },
  {
    id: 33,
    question: 'How many developers are currently working on the website?',
    category: 'irrelevant',
    categoryLabel: 'Premature / Not Relevant Initially',
    classification: 'Not relevant initially',
    why: 'Team size is an implementation consideration, not an initial RCA question.',
    answer: 'Engineering team size is an internal resource metric and does not explain why product gross profit dropped 15%.',
    keywords: [
      'how many developers',
      'developers working on the website',
      'engineering team size',
      'headcount of devs',
      'dev team size'
    ]
  },
  {
    id: 34,
    question: 'What is the exact colour scheme of the mobile application?',
    category: 'irrelevant',
    categoryLabel: 'Premature / Not Relevant Initially',
    classification: 'Not relevant initially',
    why: 'Visual design details are premature without evidence of a design-related problem.',
    answer: 'Visual UI color schemes are premature details without any evidence of design-driven conversion drops.',
    keywords: [
      'colour scheme',
      'color scheme',
      'colors of the app',
      'hex color',
      'ui colors',
      'brand colors'
    ]
  },
  {
    id: 35,
    question: 'Which project management tool does the product team use?',
    category: 'irrelevant',
    categoryLabel: 'Premature / Not Relevant Initially',
    classification: 'Not relevant initially',
    why: 'The project management tool does not help explain the business outcome.',
    answer: 'Whether the product team tracks sprints in Jira, Linear, or Asana has no bearing on gross profit.',
    keywords: [
      'project management tool',
      'jira',
      'linear',
      'asana',
      'notion',
      'pm tool'
    ]
  },
  {
    id: 36,
    question: 'What is the educational background of the product manager?',
    category: 'irrelevant',
    categoryLabel: 'Premature / Not Relevant Initially',
    classification: 'Not relevant',
    why: 'It has no meaningful connection to the root cause.',
    answer: 'Individual educational credentials have no connection to diagnosing product economics or gross margins.',
    keywords: [
      'educational background',
      'background of the product manager',
      'college',
      'degree',
      'pm education'
    ]
  },
  {
    id: 37,
    question: 'What is the exact number of employees in the finance department?',
    category: 'irrelevant',
    categoryLabel: 'Premature / Not Relevant Initially',
    classification: 'Not relevant initially',
    why: 'It does not help establish the cause of the GP decline.',
    answer: 'Department headcounts do not establish the economic cause of the gross profit decline.',
    keywords: [
      'number of employees in the finance department',
      'finance team size',
      'finance employees',
      'finance headcount'
    ]
  },
  {
    id: 38,
    question: 'Can you share the complete list of all BlueStone jewellery designs?',
    category: 'irrelevant',
    categoryLabel: 'Premature / Not Relevant Initially',
    classification: 'Too broad / premature',
    why: 'A complete catalogue is unnecessary. Start with category and SKU-level performance where relevant.',
    answer: 'BlueStone has over 8,000 catalogue designs. Requesting an uncurated full catalogue is too broad; start by isolating categories on your issue tree.',
    keywords: [
      'complete list of all bluestone jewellery designs',
      'complete list of designs',
      'all jewellery designs',
      'full catalogue',
      'entire design list',
      'all skus'
    ]
  },
  {
    id: 39,
    question: 'What is the exact number of social media followers?',
    category: 'irrelevant',
    categoryLabel: 'Premature / Not Relevant Initially',
    classification: 'Not relevant initially',
    why: 'Followers are not a direct measure of profitable sales. Traffic quality and conversion would be more useful later.',
    answer: 'Social follower counts are a vanity metric with no direct link to unit economics or transaction margins.',
    keywords: [
      'number of social media followers',
      'social media followers',
      'instagram followers',
      'follower count'
    ]
  },
  {
    id: 40,
    question: 'Can you tell me the names of all the suppliers?',
    category: 'irrelevant',
    categoryLabel: 'Premature / Not Relevant Initially',
    classification: 'Too detailed initially',
    why: 'Supplier-level investigation may be useful after identifying procurement costs as a driver.',
    answer: 'Specific supplier vendor names are too granular upfront. Start by examining aggregate category procurement trends.',
    keywords: [
      'names of all the suppliers',
      'all suppliers',
      'supplier names',
      'vendor list',
      'supplier list'
    ]
  },
  {
    id: 41,
    question: 'What is the personal preference of the CEO regarding jewellery designs?',
    category: 'irrelevant',
    categoryLabel: 'Premature / Not Relevant Initially',
    classification: 'Not relevant',
    why: 'Personal preference is not reliable evidence of customer demand or product performance.',
    answer: 'Executive personal taste is not reliable data for measuring customer purchasing behavior or gross margin trends.',
    keywords: [
      'personal preference of the ceo',
      'ceo preference',
      'ceo favorite designs',
      'ceo opinion'
    ]
  },
  {
    id: 42,
    question: 'What is the complete source code of the website?',
    category: 'irrelevant',
    categoryLabel: 'Premature / Not Relevant Initially',
    classification: 'Not relevant initially',
    why: 'Source code is not needed to diagnose a high-level business performance problem.',
    answer: 'Source code repository inspection is unnecessary for business performance and product economics diagnosis.',
    keywords: [
      'complete source code',
      'source code of the website',
      'github repo',
      'codebase',
      'repository access'
    ]
  },
  {
    id: 43,
    question: 'What is the office location of the product team?',
    category: 'irrelevant',
    categoryLabel: 'Premature / Not Relevant Initially',
    classification: 'Not relevant',
    why: 'It has no direct bearing on the problem.',
    answer: 'Physical office locations have zero bearing on digital revenue or gross profit performance.',
    keywords: [
      'office location',
      'location of the product team',
      'office address',
      'where is the office'
    ]
  }
];

export function matchClarifyingQuestion(query: string): {
  isMatch: boolean;
  question: string;
  answer: string;
  rowId?: number;
  category?: 'initial' | 'later' | 'irrelevant';
  classification?: string;
  why?: string;
  isPreliminary?: boolean;
} {
  const clean = query.toLowerCase().trim();
  if (!clean) {
    return {
      isMatch: false,
      question: query,
      answer: 'That is outside the scope of this case.',
      classification: 'Outside Scope',
      why: 'No question was entered.',
      isPreliminary: false
    };
  }

  // 1. Direct punctuation-stripped matching
  const cleanNoPunct = clean.replace(/[^\w\s]/g, '').trim();
  let matchedItem: CaseQuestionItem | null = null;

  for (const item of BLUESTONE_QUESTIONS_DATA) {
    const itemQ = item.question.toLowerCase().replace(/[^\w\s]/g, '').trim();
    if (cleanNoPunct === itemQ || cleanNoPunct.includes(itemQ) || itemQ.includes(cleanNoPunct)) {
      if (cleanNoPunct.length > 8) {
        matchedItem = item;
        break;
      }
    }
  }

  // 2. Keyword & phrase scoring
  if (!matchedItem) {
    let maxScore = 0;
    for (const item of BLUESTONE_QUESTIONS_DATA) {
      let score = 0;
      for (const kw of item.keywords) {
        if (clean.includes(kw)) {
          score += kw.split(' ').length >= 2 ? 6 : 2;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        matchedItem = item;
      }
    }
    if (maxScore < 2) {
      matchedItem = null;
    }
  }

  if (matchedItem) {
    if (matchedItem.category === 'initial') {
      return {
        isMatch: true,
        question: matchedItem.question,
        answer: matchedItem.answer,
        rowId: matchedItem.id,
        category: matchedItem.category,
        classification: 'Ask initially',
        why: matchedItem.why,
        isPreliminary: true
      };
    } else if (matchedItem.category === 'later') {
      return {
        isMatch: true,
        question: matchedItem.question,
        answer: `This is a useful diagnostic question, but it is not right to ask at this preliminary moment. In a Product RCA interview, you should save this question for your later investigation after you have structured the issue tree and isolated the branch to investigate.\n\nWhy it is not right to ask now: ${matchedItem.why}`,
        rowId: matchedItem.id,
        category: matchedItem.category,
        classification: 'Not right to ask now (Ask later)',
        why: matchedItem.why,
        isPreliminary: false
      };
    } else {
      return {
        isMatch: true,
        question: matchedItem.question,
        answer: `This question is irrelevant or premature for this RCA. It does not help define the problem, is too detailed too early, or does not contribute meaningfully to diagnosing the gross profit decline.\n\nWhy it is not relevant: ${matchedItem.why}`,
        rowId: matchedItem.id,
        category: matchedItem.category,
        classification: matchedItem.classification || 'Not relevant / Premature',
        why: matchedItem.why,
        isPreliminary: false
      };
    }
  }

  // Fallback required by user
  return {
    isMatch: false,
    question: query,
    answer: 'That is outside the scope of this case.',
    classification: 'Outside Scope',
    why: 'This question does not match any preliminary, diagnostic, or case parameters for BlueStone.',
    isPreliminary: false
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// 7-Stage Daily Unlocking Schedule (Automatic Day-by-Day Unlocking)
// ────────────────────────────────────────────────────────────────────────────────
export type BlueStoneStageKey =
  | 'clarify'
  | 'tree'
  | 'journey'
  | 'control'
  | 'data_read'
  | 'leak'
  | 'bridge'
  | 'funnel'
  | 'category'
  | 'prioritize'
  | 'pitch';

export interface BlueStoneStageMeta {
  key: BlueStoneStageKey;
  dayNumber: number;
  label: string;
  shortLabel: string;
  icon: any;
  unlockDate: string; // YYYY-MM-DD
  unlockDateLabel: string;
  cliffhanger: string;
}

export function getBlueStoneTodayDateString(): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(now);
  } catch (_) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// Central Reconciled Case Data (Single Source of Truth)
// ────────────────────────────────────────────────────────────────────────────────
export const BLUESTONE_CASE_DATA = {
  // Stage 5 table
  stage5: {
    sessions: { prev: 1000000, curr: 1100000 },
    conversion: { prev: 0.02, curr: 0.019 }, // 2.0% to 1.9%
    orders: { prev: 20000, curr: 20900 },
    aov: { prev: 50000, curr: 50240 },
    revenueCr: { prev: 100, curr: 105 },
    gpCr: { prev: 20.0, curr: 17.1 }
  },
  // Stage 6 full funnel (reconciled; use exactly this)
  stage6: {
    pdpViews: { prev: 500000, curr: 550000, pdpPerSession: 0.50 },
    addToCartRate: { prev: 0.12, curr: 0.11 }, // carts / PDP views
    carts: { prev: 60000, curr: 60500 },
    checkoutInitiationRate: { prev: 0.70, curr: 0.68 }, // checkouts / carts
    checkoutsStarted: { prev: 42000, curr: 41140 },
    paymentCompletionRate: { prev: 47.6, curr: 50.8 }, // orders / checkouts %
    orders: { prev: 20000, curr: 20900 },
    relativeDeltas: {
      pdpViews: '+10.0%',
      addToCart: '-8.3%',
      checkoutInitiation: '-2.9%',
      paymentCompletion: '+6.7% (improved)'
    }
  },
  // Stage 7 categories
  stage7: {
    gold: {
      revPrevCr: 60, revCurrCr: 75,
      gmPrev: 0.22, gmCurr: 0.14,
      gpPrevCr: 13.20, gpCurrCr: 10.50
    },
    diamond: {
      revPrevCr: 40, revCurrCr: 30,
      gmPrev: 0.17, gmCurr: 0.22,
      gpPrevCr: 6.80, gpCurrCr: 6.60
    },
    totals: {
      revPrevCr: 100, revCurrCr: 105,
      gpPrevCr: 20.00, gpCurrCr: 17.10, // -14.5%, shown as about -15%
      overallGmPrev: 0.20, overallGmCurr: 0.162857 // 20.0% to 16.3%
    },
    goldShareOfSales: 75 / 105, // 71%
    profitBridge: {
      goldVolume: 3.30,   // (75 - 60) * 0.22 = +3.30
      goldMargin: -6.00,  // 75 * (0.14 - 0.22) = -6.00
      diamondVolume: -1.70, // (30 - 40) * 0.17 = -1.70
      diamondMargin: 1.50, // 30 * (0.22 - 0.17) = +1.50
      net: -2.90          // +3.30 - 6.00 - 1.70 + 1.50 = -2.90
    }
  }
};


export const BLUESTONE_STAGES_SCHEDULE: BlueStoneStageMeta[] = [
  {
    key: 'clarify',
    dayNumber: 1,
    unlockDate: '2026-11-27',
    unlockDateLabel: 'Nov 27th',
    label: '1. Clarifying Questions',
    shortLabel: 'Clarifying',
    icon: MessageSquare,
    cliffhanger: 'Step into the interview room and ask your clarifying questions to diagnose digital commerce scope and product status.'
  },
  {
    key: 'tree',
    dayNumber: 2,
    unlockDate: '2026-11-28',
    unlockDateLabel: 'Nov 28th',
    label: '2. Metric Tree',
    shortLabel: 'Metric Tree',
    icon: Layers,
    cliffhanger: 'Decompose the 15% gross profit drop into customer-facing experience vs. product economics.'
  },
  {
    key: 'journey',
    dayNumber: 3,
    unlockDate: '2026-11-29',
    unlockDateLabel: 'Nov 29th',
    label: '3. Customer Journey',
    shortLabel: 'Journey',
    icon: BarChart3,
    cliffhanger: 'Reconstruct the 8-stage jewellery buyer journey, match primary metrics, and identify critical PDP trust factors.'
  },
  {
    key: 'control',
    dayNumber: 4,
    unlockDate: '2026-11-30',
    unlockDateLabel: 'Nov 30th',
    label: '4. Controllable vs External',
    shortLabel: 'Controllability',
    icon: ShieldAlert,
    cliffhanger: 'Separate product-controlled factors from macro commodity price spikes and assign functional owners.'
  },
  {
    key: 'data_read',
    dayNumber: 5,
    unlockDate: '2026-12-01',
    unlockDateLabel: 'Dec 1st',
    label: '5. Data & First Read',
    shortLabel: 'First Read',
    icon: FileText,
    cliffhanger: 'Build the 5-part data request, audit baseline metrics, and avoid false conversion conclusions.'
  },
  {
    key: 'leak',
    dayNumber: 6,
    unlockDate: '2026-12-02',
    unlockDateLabel: 'Dec 2nd',
    label: '6. Find the Leak',
    shortLabel: 'Funnel Leak',
    icon: Target,
    cliffhanger: 'Isolate the drop-off in the reconciled funnel and simulate conversion vs. margin intervention trade-offs.'
  },
  {
    key: 'bridge',
    dayNumber: 7,
    unlockDate: '2026-12-03',
    unlockDateLabel: 'Dec 3rd',
    label: '7. Profit Bridge & Synthesis',
    shortLabel: 'Profit Bridge',
    icon: Award,
    cliffhanger: 'Build the category waterfall bridge (Gold vs Diamond) and synthesize the executive recommendations.'
  }
];

// ────────────────────────────────────────────────────────────────────────────────
// Stage 2: Metric Trees Data & Interactive Challenge
// ────────────────────────────────────────────────────────────────────────────────
export interface CandidateTree {
  id: 'tree-revenue' | 'tree-org' | 'tree-solution' | 'tree-mixed' | 'tree-correct';
  letter: string;
  name: string;
  badge: string;
  title: string;
  isCorrect: boolean;
  branches: {
    name: string;
    subBranches: string[];
  }[];
  whyFailsOrSucceeds: string;
  interviewerVerdict: string;
}

export const CANDIDATE_TREES: CandidateTree[] = [
  {
    id: 'tree-revenue',
    letter: 'A',
    name: 'Tree A: Revenue-Only Tree',
    badge: 'Common Interview Mistake',
    title: 'Gross Profit → Traffic, Conversion, AOV',
    isCorrect: false,
    branches: [
      {
        name: 'Traffic (Sessions)',
        subBranches: ['Organic Search', 'Paid Ads & CAC', 'Direct / App Installs']
      },
      {
        name: 'Conversion Rate',
        subBranches: ['Add-to-Cart %', 'Checkout Success %']
      },
      {
        name: 'Average Order Value (AOV)',
        subBranches: ['Items per Order', 'Average Selling Price (ASP)']
      }
    ],
    whyFailsOrSucceeds: "It ignores COGS. Revenue grew 5%, so a tree that only decomposes revenue can't explain a 15% profit drop. It sends you to fix conversion when the problem is margin. This is the most common mistake.",
    interviewerVerdict: "Candidate conflates top-line growth with bottom-line profitability and overlooks unit economics."
  },
  {
    id: 'tree-correct',
    letter: 'Formula / MECE',
    name: 'The Correct Tree: Formula-Based MECE Tree',
    badge: 'Executive Interview Standard',
    title: 'Gross Profit = Revenue - COGS',
    isCorrect: true,
    branches: [
      {
        name: '1. Revenue (Customer & Product Performance)',
        subBranches: ['Acquisition (Traffic/CAC)', 'Discovery (Search/PDP)', 'Conversion (Cart/Checkout)', 'Basket Value (AOV)', 'Retention']
      },
      {
        name: '2. COGS (Product Economics & Operations)',
        subBranches: ['Product Mix (Gold vs Diamond)', 'Procurement (Raw Gold Costs)', 'Manufacturing (Making Charges)', 'Inventory & Stock Availability']
      }
    ],
    whyFailsOrSucceeds: "Starts directly from the mathematical formula: Gross Profit = Revenue - COGS. Both sides appear, every branch is a measurable metric (not a team or solution), branches are mutually exclusive and collectively exhaustive (MECE), and every leaf has an operational owner.",
    interviewerVerdict: "Demonstrates strong structured PM thinking; establishes MECE boundaries before zeroing in on root causes."
  },
  {
    id: 'tree-org',
    letter: 'B',
    name: 'Tree B: Org-Chart Tree',
    badge: 'Structural Error',
    title: 'Gross Profit → Marketing, Product, Operations, Finance',
    isCorrect: false,
    branches: [
      {
        name: 'Marketing Team',
        subBranches: ['Ad Campaigns', 'Influencer Spend']
      },
      {
        name: 'Product Team',
        subBranches: ['App Experience', 'Feature Releases']
      },
      {
        name: 'Operations Team',
        subBranches: ['Fulfillment', 'Delivery Logistics']
      },
      {
        name: 'Finance Team',
        subBranches: ['Accounting', 'Margin Reporting']
      }
    ],
    whyFailsOrSucceeds: "It splits by team, not by metric. You can't measure or add up the branches, and nothing links them to the GP formula. It also overlaps: is a checkout payment failure Product or Finance?",
    interviewerVerdict: "Doesn't know how to break a metric down mathematically or MECE-style."
  },
  {
    id: 'tree-solution',
    letter: 'C',
    name: 'Tree C: Solution-First Tree',
    badge: 'Premature Fixes',
    title: 'Gross Profit → Fix checkout, Add discounts, Improve search, Redesign app',
    isCorrect: false,
    branches: [
      {
        name: 'Fix Checkout Drop-offs',
        subBranches: ['Reduce checkout steps', 'Auto-switch gateway']
      },
      {
        name: 'Add Discounts & Promo Offers',
        subBranches: ['Festive flash deals', 'First-order coupons']
      },
      {
        name: 'Improve Search Experience',
        subBranches: ['Relevance tuning', 'Filter presets']
      },
      {
        name: 'Redesign Mobile App',
        subBranches: ['Modern UI revamp', 'New design system']
      }
    ],
    whyFailsOrSucceeds: "It jumps to fixes before finding causes. Discounts would likely lower margin further. It also ignores the interviewer's note that there were no redesigns.",
    interviewerVerdict: "Lacks structured diagnostic discipline; jumps to preconceived solutions without diagnostic data."
  },
  {
    id: 'tree-mixed',
    letter: 'D',
    name: 'Tree D: Mixed-Level Tree (Advanced)',
    badge: 'Double-Counting Error',
    title: 'Gross Profit → Traffic, Orders, Conversion, Gold prices, Revenue',
    isCorrect: false,
    branches: [
      {
        name: 'Traffic & Sessions',
        subBranches: ['Top-of-funnel users']
      },
      {
        name: 'Orders & Conversions',
        subBranches: ['Orders count', 'Checkout conversion']
      },
      {
        name: 'Gold Prices (Commodity)',
        subBranches: ['Global spot prices']
      },
      {
        name: 'Top-Line Revenue',
        subBranches: ['Gross merchandise value']
      }
    ],
    whyFailsOrSucceeds: "It puts metrics, causes and outcomes at the same level. Orders already equals Traffic × Conversion, so branches double-count. Gold prices is an external cause sitting next to a metric.",
    interviewerVerdict: "Lacks MECE rigor; mixes causes with outcomes and double-counts metrics."
  }
];

export const FOUR_MECE_TESTS = [
  {
    num: '1',
    title: 'Starts from the Formula',
    rule: 'Gross Profit = Revenue - COGS',
    description: 'Both sides must appear. If you omit COGS or Revenue, you cannot mathematically explain divergent movements like revenue growing 5% while gross profit falls 15%.'
  },
  {
    num: '2',
    title: 'Branches Don\'t Overlap & Cover Everything (MECE)',
    rule: 'Mutually Exclusive & Collectively Exhaustive',
    description: 'Each root cause has exactly one logical home. No double-counting (such as listing Orders alongside Traffic and Conversion).'
  },
  {
    num: '3',
    title: 'Every Branch is a Measurable Metric',
    rule: 'Not a team and not a premature solution',
    description: 'Never split by teams (Marketing/Product/Finance) or premature solutions (Fix checkout, Add discounts). Split by measurable mathematical drivers.'
  },
  {
    num: '4',
    title: 'Every Leaf Has an Operational Owner',
    rule: 'Direct accountability at the lowest branch',
    description: 'Product, merchandising, procurement, or operations can each take direct action on specific leaf branches once the issue tree pinpoints the drop.'
  }
];

export const EIGHT_LEAF_BRANCHES = [
  {
    id: '1.1',
    branch: 'Revenue Branch',
    name: '1.1 Acquisition (Traffic & CAC)',
    description: 'Marketing ad spend, top-of-funnel visitor sessions, and CAC efficiency.',
    isPrimaryCause: false
  },
  {
    id: '1.2',
    branch: 'Revenue Branch',
    name: '1.2 Discovery (Search & PDP Views)',
    description: 'Catalogue exploration, search filter usability, and product detail page views.',
    isPrimaryCause: false
  },
  {
    id: '1.3',
    branch: 'Revenue Branch',
    name: '1.3 Conversion (Cart & Checkout Drop)',
    description: 'Friction between add-to-cart (12%→11%) and checkout completion (70%→68%).',
    isPrimaryCause: false
  },
  {
    id: '1.4',
    branch: 'Revenue Branch',
    name: '1.4 Basket Value (AOV & Items/Order)',
    description: 'Average order value (₹50,000 → ₹50,240) and units purchased per cart.',
    isPrimaryCause: false
  },
  {
    id: '2.1',
    branch: 'COGS Branch',
    name: '2.1 Product Mix (Gold vs Diamond Contribution)',
    description: 'Shift in category sales volume toward lower-margin gold jewellery.',
    isPrimaryCause: true // PRIMARY ROOT CAUSE!
  },
  {
    id: '2.2',
    branch: 'COGS Branch',
    name: '2.2 Procurement (Raw Gold Inflation)',
    description: 'Global gold commodity price spikes absorbed by the business without price pass-through.',
    isPrimaryCause: false
  },
  {
    id: '2.3',
    branch: 'COGS Branch',
    name: '2.3 Manufacturing & Making Charges',
    description: 'Making charges failing to calibrate dynamically for lightweight designs.',
    isPrimaryCause: false
  },
  {
    id: '2.4',
    branch: 'COGS Branch',
    name: '2.4 Inventory & Stock Availability',
    description: 'Out-of-stock SKUs on high-margin diamond rings forcing customers to gold.',
    isPrimaryCause: false
  }
];

export const STAGE2_PREDICTION_OPTIONS = [
  {
    id: 'formula',
    label: 'Gross Profit = Revenue - COGS (Cost of Goods Sold)',
    hint: 'Decompose accounting equation into top-line revenue vs product cost'
  },
  {
    id: 'funnel',
    label: 'Gross Profit = Traffic × Conversion Rate × Average Order Value (AOV)',
    hint: 'Decompose by digital customer acquisition & checkout funnel'
  },
  {
    id: 'teams',
    label: 'Gross Profit = Marketing + Product + Operations + Finance Teams',
    hint: 'Decompose by organizational departments and teams'
  },
  {
    id: 'solutions',
    label: 'Gross Profit = Fix Checkout + Add Discounts + Improve Search + App Redesign',
    hint: 'Decompose by candidate product feature fixes and solutions'
  }
];

// ────────────────────────────────────────────────────────────────────────────────
// Stage 3: Customer Journey Interactive Data
// ────────────────────────────────────────────────────────────────────────────────
export const STAGE3_JOURNEY_STEPS = [
  { id: 'visit', order: 1, label: '1. Visit (Landing & App Open)', hint: 'Top-of-funnel traffic arriving on web/app' },
  { id: 'discover', order: 2, label: '2. Discover (Search & Category Browse)', hint: 'Navigating collections and searching for styles' },
  { id: 'view_pdp', order: 3, label: '3. View Product (PDP Engagement)', hint: 'Evaluating product specs, designs, and gold weight' },
  { id: 'add_to_cart', order: 4, label: '4. Add to Cart', hint: 'Committing to purchasing a specific piece' },
  { id: 'checkout', order: 5, label: '5. Checkout Initiation', hint: 'Entering address and delivery details' },
  { id: 'pay', order: 6, label: '6. Pay (Payment Transaction)', hint: 'Selecting payment mode and completing payment' },
  { id: 'receive', order: 7, label: '7. Receive (Delivery & Unboxing)', hint: 'Insured courier fulfillment and unboxing experience' },
  { id: 'return_repeat', order: 8, label: '8. Return / Repeat Purchase', hint: 'Exchanges, returns policy, and lifetime customer value' }
];

export const STAGE3_STAGE_MATCHING = [
  {
    id: 'acq',
    stage: 'Acquisition',
    primaryMetric: 'Sessions, Traffic Source',
    likelyIssue: 'Low-quality or non-intent traffic'
  },
  {
    id: 'disc',
    stage: 'Discovery',
    primaryMetric: 'Search Success, CTR',
    likelyIssue: 'Cannot find relevant products or styles'
  },
  {
    id: 'cons',
    stage: 'Consideration',
    primaryMetric: 'PDP Engagement, Time on Page',
    likelyIssue: 'Insufficient product information or missing trust details'
  },
  {
    id: 'intent',
    stage: 'Purchase Intent',
    primaryMetric: 'Add-to-Cart Rate',
    likelyIssue: 'Price sticker shock or product mismatch'
  },
  {
    id: 'check',
    stage: 'Checkout',
    primaryMetric: 'Checkout Conversion',
    likelyIssue: 'Payment gateway failures or unexpected shipping fees'
  },
  {
    id: 'post',
    stage: 'Post-Purchase',
    primaryMetric: 'Returns Rate, Repeat Rate',
    likelyIssue: 'Poor unboxing experience, sizing issues, or delayed transit'
  }
];

export const STAGE3_PDP_FACTORS = [
  { id: 'purity', label: 'Gold purity and certification (BIS Hallmarking)', isCorrect: true },
  { id: 'price_breakup', label: 'Price breakup (Gold weight + Making charges + GST)', isCorrect: true },
  { id: 'weight', label: 'Exact gold weight and physical dimensions', isCorrect: true },
  { id: 'reviews', label: 'Customer reviews & real unboxing photos', isCorrect: true },
  { id: 'returns_policy', label: 'Transparent returns & exchange policy', isCorrect: true },
  { id: 'delivery', label: 'Delivery timelines & insured shipping details', isCorrect: true },
  { id: 'bigger_btn', label: 'Bigger, pulsing Buy Now button', isCorrect: false, feedback: 'Urgency tricks do not fix missing buyer confidence in high-AOV jewellery.' },
  { id: 'countdown', label: 'Countdown timer with artificial scarcity ("Deal ends in 04:59")', isCorrect: false, feedback: 'Countdown timers erode brand trust in fine jewellery purchases.' },
  { id: 'animated_banners', label: 'Flashing animated promotional discount banners', isCorrect: false, feedback: 'Animated banners distract high-intent buyers seeking certified product specifications.' }
];

export const STAGE3_SEGMENT_CUTS = [
  { id: 'new_returning', label: 'New vs Returning customers', isCorrect: true },
  { id: 'gold_diamond', label: 'Gold jewellery vs Diamond jewellery', isCorrect: true },
  { id: 'app_web', label: 'Mobile App vs Website platforms', isCorrect: true },
  { id: 'paid_organic', label: 'Paid acquisition vs Organic / Direct traffic', isCorrect: true },
  { id: 'aov_tiers', label: 'High vs Low order value tiers (<₹20k vs >₹50k)', isCorrect: true },
  { id: 'time_of_day', label: 'Time of day (Purchases at 11 AM vs 9 PM)', isCorrect: false, feedback: 'Time of day adds noise without behavioral segmentation.' }
];

// ────────────────────────────────────────────────────────────────────────────────
// Stage 4: Controllability & Ownership Data
// ────────────────────────────────────────────────────────────────────────────────
export const STAGE4_BUCKET_CARDS = [
  {
    id: 'search_relevance',
    label: 'Search relevance and catalog filtering',
    bucket: 'controllable',
    owner: 'Product and Engineering',
    explanation: 'Product algorithms and search ranking directly determine relevance.'
  },
  {
    id: 'checkout_friction',
    label: 'Checkout UI friction and payment gateway drops',
    bucket: 'controllable',
    owner: 'Product and Engineering',
    explanation: 'Directly owned by product funnel and UX teams.'
  },
  {
    id: 'gold_prices',
    label: 'Higher global gold commodity prices',
    bucket: 'uncontrollable',
    owner: 'Procurement and Finance',
    explanation: 'Macro commodity spot price set by international markets.'
  },
  {
    id: 'competitor_promos',
    label: 'Competitor promotions and heavy discount campaigns',
    bucket: 'uncontrollable',
    owner: 'Strategy and Commercial',
    explanation: 'External competitor pricing actions cannot be prevented directly.'
  },
  {
    id: 'customer_preference',
    label: 'Customer macroeconomic preference shift towards daily wear',
    bucket: 'uncontrollable',
    owner: 'Strategy and Commercial',
    explanation: 'Macro consumer spending climate and lifestyle trends.'
  },
  {
    id: 'low_stock',
    label: 'Low stock availability on popular high-margin designs',
    bucket: 'influenceable',
    acceptAlso: 'controllable',
    owner: 'Merchandising',
    explanation: 'Operations/merchandising manage reorders, while product manages out-of-stock visibility and alternatives.'
  },
  {
    id: 'supplier_delivery',
    label: 'Supplier delivery reliability and transit lead times',
    bucket: 'influenceable',
    owner: 'Operations',
    explanation: 'SLA enforcement and supply chain partnerships influence delivery speed.'
  },
  {
    id: 'supplier_pricing',
    label: 'Supplier price negotiation and contract vendor terms',
    bucket: 'influenceable',
    owner: 'Procurement and Finance',
    explanation: 'Internal negotiations directly influence supplier margins and bulk discounts.'
  }
];

export const STAGE4_SCENARIO_ACTIONS = [
  {
    id: 'price_alert',
    label: 'Build a price-alert notification feature',
    isCorrect: false,
    healthDelta: -10,
    feedback: 'A feature cannot fix a commodity price. Gold prices will keep rising, and alerts just delay purchases.'
  },
  {
    id: 'ignore',
    label: 'Ignore it—commodity prices are completely external to product',
    isCorrect: false,
    healthDelta: -10,
    feedback: 'Giving up is not product leadership. You can still influence dynamic pricing, assortment curation, and lightweight product exposure.'
  },
  {
    id: 'partner',
    label: 'Partner with merchandising and finance on pricing, assortment and exposure',
    isCorrect: true,
    healthDelta: 15,
    feedback: 'Spot on. Product collaborates across functions to adjust discoverability, lightweight assortments, and price pass-through.'
  }
];

// ────────────────────────────────────────────────────────────────────────────────
// Stage 5: Data Request & First Read Audit
// ────────────────────────────────────────────────────────────────────────────────
export const STAGE5_DATA_REQUEST_CARDS = [
  { id: 'acq', label: '1. Acquisition Data (Sessions, traffic source, campaign CAC)', isCorrect: true },
  { id: 'disc', label: '2. Discovery Data (Search queries, zero-result rates, CTR)', isCorrect: true },
  { id: 'conv', label: '3. Conversion Data (PDP views, add-to-cart, checkout, orders)', isCorrect: true },
  { id: 'behav', label: '4. Behaviour Data (New vs repeat buyers, returns, cancellations)', isCorrect: true },
  { id: 'econ', label: '5. Product Economics (ASP, units sold, category gross margin %, unit COGS)', isCorrect: true },
  { id: 'totals_only', label: '6. Last month\'s total revenue number only', isCorrect: false, feedback: 'You need two comparative periods, segment cuts, and margin data, not just an aggregated total.' },
  { id: 'pii', label: '7. Customer phone numbers and personal email addresses', isCorrect: false, feedback: 'Diagnostic RCA requires aggregated cohort behavior, not raw PII.' },
  { id: 'web_only', label: '8. Website data only (excluding mobile app)', isCorrect: false, feedback: 'BlueStone is omnichannel. Excluding the mobile app ignores a huge chunk of your customer journey.' }
];

export const STAGE5_TRUE_FALSE_QUESTIONS = [
  {
    id: 'tf1',
    statement: 'Conversion fell (2.0% → 1.9%), so revenue must have fallen.',
    expected: false,
    explanation: 'False. Traffic growth (+10%) outran the conversion drop (-5% relative); orders rose 4.5% (20,000 to 20,900) and revenue grew +5%.'
  },
  {
    id: 'tf2',
    statement: 'AOV rose (₹50,000 → ₹50,240), so unit margin must have improved.',
    expected: false,
    explanation: 'False. AOV says nothing about margin! Higher ticket price was driven by gold commodity inflation, while gross margin plummeted from 20% to 16.3%.'
  },
  {
    id: 'tf3',
    statement: 'Revenue growth (+5%) is traffic-driven, not efficiency-driven.',
    expected: true,
    explanation: 'True. More visitors were acquired via marketing (+10% sessions), but they converted at a lower rate (1.9% vs 2.0%).'
  },
  {
    id: 'tf4',
    statement: 'The conversion dip is clearly the primary root cause of the -15% GP drop.',
    expected: false,
    explanation: 'Not proven / False. Total revenue increased by ₹5 Cr. If unit economics were healthy, gross profit would have risen. A 15% profit collapse cannot be explained by conversion alone.'
  }
];

export const STAGE5_NEXT_CUT_OPTIONS = [
  { id: 'funnel', label: 'Decompose full funnel stages to locate where conversion leaked', isCorrect: true },
  { id: 'category', label: 'Segment gross margin and revenue by product categories (Gold vs Diamond)', isCorrect: true },
  { id: 'platform', label: 'Compare App vs Website funnel drop-offs and platform metrics', isCorrect: true },
  { id: 'marketing_spend', label: 'Immediately increase marketing ad spend to bring in more sessions', isCorrect: false, isMarginTrap: true, feedback: 'Margin trap! You would buy more of the traffic that is already converting worse, inflating CAC and accelerating the profit bleed.' }
];

// ────────────────────────────────────────────────────────────────────────────────
// Stage 6: Find the Leak & Scenario Simulator
// ────────────────────────────────────────────────────────────────────────────────
export const STAGE6_FUNNEL_STAGES = [
  {
    id: 'pdp',
    name: '1. PDP Views',
    prev: '500,000',
    curr: '550,000',
    delta: '+10.0%',
    status: 'Healthy (+10%)',
    isBiggestLeak: false,
    feedback: 'Discovery is healthy (+10%). PDP views per session is flat at 0.50 in both years. Customers are finding products, then stalling at cart.'
  },
  {
    id: 'add_to_cart',
    name: '2. Add-to-Cart Rate',
    prev: '12.0%',
    curr: '11.0%',
    delta: '-8.3% (rel)',
    status: 'CRITICAL LEAK (-8.3% rel)',
    isBiggestLeak: true,
    feedback: 'Correct! -8.3% relative drop is the largest single drop in the entire customer funnel. Customers view products but hesitate to add to cart due to price shock.'
  },
  {
    id: 'checkout',
    name: '3. Checkout Initiation',
    prev: '70.0%',
    curr: '68.0%',
    delta: '-2.9% (rel)',
    status: 'Secondary Leak (-2.9% rel)',
    isBiggestLeak: false,
    feedback: 'A real leak, but smaller (-2.9% relative). Absolute-point drops mislead: 2 percentage points of 70 is less than 1 percentage point of 12.'
  },
  {
    id: 'payment',
    name: '4. Payment Completion Rate',
    prev: '47.6%',
    curr: '50.8%',
    delta: '+6.7% (rel)',
    status: 'Improved (+6.7% rel)',
    isBiggestLeak: false,
    feedback: 'Payment completion actually improved (+6.7% relative, from 47.6% to 50.8%). Do not assume payment failures are the problem because they are the usual suspect.'
  }
];

export const STAGE6_INTERVENTION_SCENARIOS = [
  {
    id: 'discount',
    title: 'A. Launch a sitewide 10% discount on gold jewellery',
    convMeter: +3,
    marginMeter: -3,
    isMarginTrap: true,
    isCorrect: false,
    healthDelta: -20,
    feedback: 'MARGIN TRAP! Wins the conversion metric, loses the company profit. Gold margin is already collapsing; discounting accelerates the bleed.'
  },
  {
    id: 'checkout_ui',
    title: 'B. Redesign the checkout page to remove address fields',
    convMeter: 0,
    marginMeter: 0,
    isMarginTrap: false,
    isCorrect: false,
    healthDelta: -5,
    feedback: 'Misdirected effort. The biggest drop is before checkout initiation; buyers are stalling at product evaluation, not address entry.'
  },
  {
    id: 'urgency',
    title: 'C. Add countdown urgency timers on PDPs ("Only 2 left at this price!")',
    convMeter: +1,
    marginMeter: 0,
    isMarginTrap: false,
    isCorrect: false,
    healthDelta: -5,
    feedback: 'Short-term cosmetic lift that erodes customer trust. High-ticket jewellery buyers need transparency, not artificial panic.'
  },
  {
    id: 'transparency',
    title: 'D. Show gold weight transparency, lightweight alternative filters, transparent making charges, and EMI options',
    convMeter: +2,
    marginMeter: +1,
    isMarginTrap: false,
    isCorrect: true,
    healthDelta: 15,
    feedback: 'CORRECT! Solves customer hesitation cleanly: provides price transparency, lightweight discovery for budget shoppers, and protects product margins without discounting.'
  }
];

export const STAGE6_GATE_CAUSES = [
  { id: 'pricing', label: 'Pricing changes & making charge transparency', isTopPriority: true },
  { id: 'product_info', label: 'Product information quality & certification clarity', isTopPriority: true },
  { id: 'delivery', label: 'Delivery charges, shipping timelines & insurance', isTopPriority: true },
  { id: 'availability', label: 'SKU stock availability', isTopPriority: false, isPartial: true },
  { id: 'reviews', label: 'Customer reviews & social proof', isTopPriority: false, isPartial: true },
  { id: 'payment_failures', label: 'Payment gateway failures', isTopPriority: false, isFlagged: true, feedback: 'Worth monitoring, but payment completion actually improved (+6.7%). It is not where the loss is.' }
];

// ────────────────────────────────────────────────────────────────────────────────
// Stage 7: Product Mix, Profit Bridge & Leadership Synthesis
// ────────────────────────────────────────────────────────────────────────────────
export const STAGE7_CATEGORY_TABLE = [
  {
    category: 'Gold Jewellery',
    revPrevCr: 60,
    revCurrCr: 75,
    gmPrev: '22.0%',
    gmCurr: '14.0%',
    expectedGpPrev: 13.20,
    expectedGpCurr: 10.50,
    gpDeltaCr: -2.70
  },
  {
    category: 'Diamond Jewellery',
    revPrevCr: 40,
    revCurrCr: 30,
    gmPrev: '17.0%',
    gmCurr: '22.0%',
    expectedGpPrev: 6.80,
    expectedGpCurr: 6.60,
    gpDeltaCr: -0.20
  }
];

export const STAGE7_PROFIT_BRIDGE = [
  {
    component: 'Gold Volume Effect',
    formula: 'Δ Revenue × Prev Margin = (75 - 60) × 22%',
    impactCr: +3.30,
    isPositive: true,
    note: 'Higher gold sales volume generated ₹3.30 Cr of gross profit'
  },
  {
    component: 'Gold Margin Effect',
    formula: 'Curr Revenue × Δ Margin = 75 × (14% - 22%)',
    impactCr: -6.00,
    isPositive: false,
    isCriticalRootCause: true,
    note: 'Gold gross margin drop from 22% to 14% wiped out ₹6.00 Cr of profit!'
  },
  {
    component: 'Diamond Volume Effect',
    formula: 'Δ Revenue × Prev Margin = (30 - 40) × 17%',
    impactCr: -1.70,
    isPositive: false,
    note: 'Diamond sales fell ₹10 Cr, costing ₹1.70 Cr of gross profit'
  },
  {
    component: 'Diamond Margin Effect',
    formula: 'Curr Revenue × Δ Margin = 30 × (22% - 17%)',
    impactCr: +1.50,
    isPositive: true,
    note: 'Diamond margin improved to 22%, saving ₹1.50 Cr of gross profit'
  }
];

export const STAGE7_TRAP_SOLUTIONS = [
  {
    id: 'push_diamond_promo',
    label: 'A. Run heavy diamond discount promotions to pump up diamond sales',
    isCorrect: false,
    healthDelta: -15,
    feedback: 'If customers shifted away from diamond for macroeconomic affordability reasons, promotions will not bring them back and will degrade diamond\'s healthy 22% margin.'
  },
  {
    id: 'push_gold_volume',
    label: 'B. Push gold sales even harder since gold volume is growing fast',
    isCorrect: false,
    healthDelta: -15,
    feedback: 'Gold is now a lower-margin category (14%). Pushing more low-margin gold without fixing the unit economics deepens the profit hole.'
  },
  {
    id: 'root_cause_discovery',
    label: 'C. Diagnose why diamond dropped (preferences, price tiers, search filters), optimize lightweight discovery, and dynamically calibrate gold making charges',
    isCorrect: true,
    healthDelta: 20,
    feedback: 'CORRECT! The objective of an executive PM is sustainable gross profit, not isolated diamond revenue or vanity volume.'
  }
];

export function BlueStoneRcaComponent({ isEmbedded = false }: { isEmbedded?: boolean }) {
  // Calendar-based automatic day unlocking state
  const todayDateStr = getBlueStoneTodayDateString();
  const [isUnlockAllStages, setIsUnlockAllStages] = useState(false);

  // Automatic day unlock calculation: each day unlocks automatically on its calendar date
  const isStageUnlocked = (stage: BlueStoneStageMeta) => {
    if (isUnlockAllStages) return true;
    return todayDateStr >= stage.unlockDate;
  };

  const isStageLiveToday = (stage: BlueStoneStageMeta) => {
    return todayDateStr === stage.unlockDate;
  };

  // Find the highest stage currently unlocked for today
  const highestUnlockedStage = [...BLUESTONE_STAGES_SCHEDULE].reverse().find(s => isStageUnlocked(s)) || BLUESTONE_STAGES_SCHEDULE[0];

  // Default active tab to highest unlocked stage (or URL search param if present)
  const [activeStageTab, setActiveStageTab] = useState<BlueStoneStageKey>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const stageParam = params.get('stage');
      if (stageParam) {
        if (stageParam === 'funnel') return 'journey';
        if (stageParam === 'category') return 'control';
        if (stageParam === 'prioritize') return 'leak';
        if (stageParam === 'pitch') return 'bridge';
        if (BLUESTONE_STAGES_SCHEDULE.some(s => s.key === stageParam)) {
          return stageParam as BlueStoneStageKey;
        }
      }
    } catch (_) {}
    return highestUnlockedStage.key as BlueStoneStageKey;
  });

  // Clarifying Questions State
  const [questionInput, setQuestionInput] = useState('');
  const [selectedDropdownQId, setSelectedDropdownQId] = useState('');
  const [showFrameworkGuide, setShowFrameworkGuide] = useState(false);
  const [qaHistory, setQaHistory] = useState<QnAPair[]>(() => {
    return [
      {
        id: 'init-1',
        question: 'Hi, I am ready to clarify the problem before diving in.',
        answer: 'Welcome to your PM RCA interview. BlueStone\'s revenue grew 5% (₹100 Cr to ₹105 Cr), but gross profit fell 15% (₹20 Cr to ₹17.1 Cr). You own the website and mobile app. What clarifying questions do you have?',
        isMatch: true,
        category: 'initial',
        classification: 'Ask initially',
        why: 'Always open with scoping questions on definitions, periods, and channels before building an issue tree.',
        isPreliminary: true
      }
    ];
  });

  const chatScrollRef = useRef<HTMLDivElement>(null);

  const handleAskFromDropdown = () => {
    if (!selectedDropdownQId) return;
    const qItem = BLUESTONE_QUESTIONS_DATA.find(q => q.id === Number(selectedDropdownQId));
    if (!qItem) return;

    let responseAnswer = '';
    let isPreliminary = false;

    if (qItem.category === 'initial') {
      responseAnswer = qItem.answer;
      isPreliminary = true;
    } else if (qItem.category === 'later') {
      responseAnswer = `This is a useful diagnostic question, but it is not right to ask at this preliminary moment. In a Product RCA interview, you should save this question for your later investigation after you have structured the issue tree and isolated the branch to investigate.\n\nWhy it is not right to ask now: ${qItem.why}`;
      isPreliminary = false;
    } else {
      responseAnswer = `This question is irrelevant or premature for this RCA. It does not help define the problem, is too detailed too early, or does not contribute meaningfully to diagnosing the gross profit decline.\n\nWhy it is not relevant: ${qItem.why}`;
      isPreliminary = false;
    }

    const newPair: QnAPair = {
      id: `qa-${Date.now()}`,
      question: qItem.question,
      answer: responseAnswer,
      isMatch: true,
      rowId: qItem.id,
      category: qItem.category,
      classification: isPreliminary ? 'Ask initially' : (qItem.category === 'later' ? 'Not right to ask now (Ask later)' : (qItem.classification || 'Not relevant / Premature')),
      why: qItem.why,
      isPreliminary
    };

    setQaHistory(prev => [...prev, newPair]);
    setSelectedDropdownQId('');

    try {
      const existing = JSON.parse(localStorage.getItem('pmx_bluestone_rca_submissions') || '[]');
      existing.unshift({
        ...newPair,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('pmx_bluestone_rca_submissions', JSON.stringify(existing.slice(0, 50)));
    } catch (_) {}

    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleAskQuestion = (textToAsk?: string) => {
    const rawQuestion = (textToAsk || questionInput).trim();
    if (!rawQuestion) return;

    const matched = matchClarifyingQuestion(rawQuestion);

    const newPair: QnAPair = {
      id: `qa-${Date.now()}`,
      question: rawQuestion,
      answer: matched.answer,
      isMatch: matched.isMatch,
      rowId: matched.rowId,
      category: matched.category,
      classification: matched.classification,
      why: matched.why,
      isPreliminary: matched.isPreliminary
    };

    setQaHistory(prev => [...prev, newPair]);
    setQuestionInput('');

    try {
      const existing = JSON.parse(localStorage.getItem('pmx_bluestone_rca_submissions') || '[]');
      existing.unshift({
        ...newPair,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('pmx_bluestone_rca_submissions', JSON.stringify(existing.slice(0, 50)));
    } catch (_) {}

    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 100);
  };

  // Self-assessment quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showPitchSummary, setShowPitchSummary] = useState(false);

  // Stage 2 Interactive Tree Challenge State
  type Stage2Step = 'predict' | 'compare' | 'feedback' | 'gut_check' | 'revealed';
  const [stage2Step, setStage2Step] = useState<Stage2Step>('predict');
  const [predictedBranchChoice, setPredictedBranchChoice] = useState<string>('');
  const [customPredictionInput, setCustomPredictionInput] = useState<string>('');
  const [selectedTreeId, setSelectedTreeId] = useState<string>('tree-revenue');
  const [hasSubmittedTree, setHasSubmittedTree] = useState<boolean>(false);
  const [gutCheckLeaf, setGutCheckLeaf] = useState<string>('');
  const [isDataRevealed, setIsDataRevealed] = useState<boolean>(false);
  const [showAdvancedTrees, setShowAdvancedTrees] = useState<boolean>(false);

  // ── Global Case & Scoring Tracker State ───────────────────────────────
  const [learnerScore, setLearnerScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pmx_bluestone_progress_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.learnerScore === 'number') return parsed.learnerScore;
      }
    } catch (_) {}
    return 0;
  });
  const [caseHealth, setCaseHealth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pmx_bluestone_progress_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.caseHealth === 'number') return parsed.caseHealth;
      }
    } catch (_) {}
    return 50; // Starts at 50, bounds 0 to 100
  });
  const [latestInterviewerReaction, setLatestInterviewerReaction] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('pmx_bluestone_progress_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.latestInterviewerReaction) return parsed.latestInterviewerReaction;
      }
    } catch (_) {}
    return 'BlueStone revenue grew +5% while Gross Profit fell -15%. A disciplined PM explores before jumping to conclusions.';
  });
  const [attemptsByStep, setAttemptsByStep] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('pmx_bluestone_progress_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.attemptsByStep) return parsed.attemptsByStep;
      }
    } catch (_) {}
    return {};
  });
  const [hintsUsed, setHintsUsed] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('pmx_bluestone_progress_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.hintsUsed) return parsed.hintsUsed;
      }
    } catch (_) {}
    return {};
  });
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('pmx_bluestone_progress_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completedSteps) return parsed.completedSteps;
      }
    } catch (_) {}
    return {};
  });

  // Persist progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pmx_bluestone_progress_v3', JSON.stringify({
        learnerScore,
        caseHealth,
        latestInterviewerReaction,
        attemptsByStep,
        hintsUsed,
        completedSteps
      }));
    } catch (_) {}
  }, [learnerScore, caseHealth, latestInterviewerReaction, attemptsByStep, hintsUsed, completedSteps]);

  // Scoring helper: First try = +10, Second try = +5, Hint penalty = -3
  const applyStepResult = (stepId: string, isCorrect: boolean, feedback: string, interviewerQuote: string, healthDelta = 0) => {
    const attempts = (attemptsByStep[stepId] || 0) + 1;
    setAttemptsByStep(prev => ({ ...prev, [stepId]: attempts }));

    if (isCorrect && !completedSteps[stepId]) {
      const hintDeduction = hintsUsed[stepId] ? 3 : 0;
      const basePoints = attempts === 1 ? 10 : 5;
      const pointsAwarded = Math.max(0, basePoints - hintDeduction);
      setLearnerScore(prev => prev + pointsAwarded);
      setCompletedSteps(prev => ({ ...prev, [stepId]: true }));
    }

    setCaseHealth(prev => Math.min(100, Math.max(0, prev + healthDelta)));
    setLatestInterviewerReaction(interviewerQuote);
  };

  const useHintForStep = (stepId: string) => {
    if (!hintsUsed[stepId]) {
      setHintsUsed(prev => ({ ...prev, [stepId]: true }));
      setLearnerScore(prev => Math.max(0, prev - 3));
    }
  };

  // ── Stage 3 State (Customer Journey) ──────────────────────────────────
  const [stage3JourneyOrder, setStage3JourneyOrder] = useState<string[]>([
    'discover', 'visit', 'add_to_cart', 'view_pdp', 'pay', 'checkout', 'return_repeat', 'receive'
  ]);
  const [stage3OrderSubmitted, setStage3OrderSubmitted] = useState<boolean>(false);
  const [stage3OrderFeedback, setStage3OrderFeedback] = useState<string>('');
  const [stage3OrderIsCorrect, setStage3OrderIsCorrect] = useState<boolean>(false);
  const [stage3Matches, setStage3Matches] = useState<Record<string, { metric: string; issue: string }>>({});
  const [stage3MatchesSubmitted, setStage3MatchesSubmitted] = useState<boolean>(false);
  const [stage3PdpSelected, setStage3PdpSelected] = useState<string[]>([]);
  const [stage3PdpSubmitted, setStage3PdpSubmitted] = useState<boolean>(false);
  const [stage3PdpFeedback, setStage3PdpFeedback] = useState<string>('');
  const [stage3SegmentsSelected, setStage3SegmentsSelected] = useState<string[]>([]);
  const [stage3SegmentsSubmitted, setStage3SegmentsSubmitted] = useState<boolean>(false);
  const [stage3SegmentsFeedback, setStage3SegmentsFeedback] = useState<string>('');

  // ── Stage 4 State (Controllability) ───────────────────────────────────
  const [stage4Buckets, setStage4Buckets] = useState<Record<string, 'controllable' | 'influenceable' | 'uncontrollable'>>({});
  const [stage4BucketsSubmitted, setStage4BucketsSubmitted] = useState<boolean>(false);
  const [stage4Owners, setStage4Owners] = useState<Record<string, string>>({});
  const [stage4OwnersSubmitted, setStage4OwnersSubmitted] = useState<boolean>(false);
  const [stage4ScenarioChoice, setStage4ScenarioChoice] = useState<string>('');
  const [stage4ScenarioSubmitted, setStage4ScenarioSubmitted] = useState<boolean>(false);
  const [stage4ScenarioFeedback, setStage4ScenarioFeedback] = useState<string>('');

  // ── Stage 5 State (Data Request & First Read) ─────────────────────────
  const [stage5DataPicks, setStage5DataPicks] = useState<string[]>([]);
  const [stage5DataSubmitted, setStage5DataSubmitted] = useState<boolean>(false);
  const [stage5DataFeedback, setStage5DataFeedback] = useState<string>('');
  const [stage5TfAnswers, setStage5TfAnswers] = useState<Record<string, boolean>>({});
  const [stage5TfSubmitted, setStage5TfSubmitted] = useState<boolean>(false);
  const [stage5NextCutChoice, setStage5NextCutChoice] = useState<string>('');
  const [stage5NextCutSubmitted, setStage5NextCutSubmitted] = useState<boolean>(false);
  const [stage5NextCutFeedback, setStage5NextCutFeedback] = useState<string>('');

  // ── Stage 6 State (Find the Leak & Simulator) ─────────────────────────
  const [stage6ClickedStageId, setStage6ClickedStageId] = useState<string | null>(null);
  const [stage6LeakSubmitted, setStage6LeakSubmitted] = useState<boolean>(false);
  const [stage6LeakFeedback, setStage6LeakFeedback] = useState<string>('');
  const [stage6LeakIsCorrect, setStage6LeakIsCorrect] = useState<boolean>(false);
  const [stage6ScenarioChoice, setStage6ScenarioChoice] = useState<string>('');
  const [stage6ScenarioSubmitted, setStage6ScenarioSubmitted] = useState<boolean>(false);
  const [stage6ScenarioFeedback, setStage6ScenarioFeedback] = useState<string>('');
  const [stage6GateChoices, setStage6GateChoices] = useState<string[]>([]);
  const [stage6GateSubmitted, setStage6GateSubmitted] = useState<boolean>(false);
  const [stage6GateFeedback, setStage6GateFeedback] = useState<string>('');

  // ── Stage 7 State (Profit Bridge & Synthesis) ──────────────────────────
  const [stage7CategoryPrediction, setStage7CategoryPrediction] = useState<'gold' | 'diamond' | null>(null);
  const [stage7PredictionSubmitted, setStage7PredictionSubmitted] = useState<boolean>(false);
  const [stage7PredictionFeedback, setStage7PredictionFeedback] = useState<string>('');
  const [stage7CalcRevealed, setStage7CalcRevealed] = useState<boolean>(false);
  const [stage7TrapChoice, setStage7TrapChoice] = useState<string>('');
  const [stage7TrapSubmitted, setStage7TrapSubmitted] = useState<boolean>(false);
  const [stage7TrapFeedback, setStage7TrapFeedback] = useState<string>('');

  // Current stage meta and unlock state
  const currentStageMeta = BLUESTONE_STAGES_SCHEDULE.find(s => s.key === activeStageTab) || BLUESTONE_STAGES_SCHEDULE[0];
  const isCurrentStageUnlocked = isStageUnlocked(currentStageMeta);

  return (
    <div className={`w-full ${isEmbedded ? '' : 'min-h-screen bg-[#FDFCF7] text-[#141413] pb-20'}`}>
      {/* Top Banner / Case Overview */}
      <div className="bg-white border-2 sm:border-[3px] border-[#141413] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-3 py-1 rounded-full border-2 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413]">
              💎 SOLVED PM CASE • PRODUCT RCA
            </span>
            <span className="text-xs font-bold text-[#141413]/70">
              Interactive Interview Simulator · Handout-Verified Responses
            </span>
          </div>

          {/* Reviewer / Admin Unlock Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsUnlockAllStages(!isUnlockAllStages)}
              className="text-[11px] font-mono font-black uppercase px-2.5 py-1 rounded-lg border border-[#141413] bg-[#F8FAFC] hover:bg-[#FEF08A] transition-all flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_#141413]"
              title="Toggle reviewer mode to preview all stages"
            >
              {isUnlockAllStages ? <Unlock className="w-3 h-3 text-[#059669]" /> : <Lock className="w-3 h-3 text-slate-500" />}
              <span>{isUnlockAllStages ? 'Reviewer Mode: All 7 Stages Unlocked' : `Day ${highestUnlockedStage.dayNumber} Live: Stages ${highestUnlockedStage.dayNumber + 1}-7 Gated`}</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#141413] tracking-tight mb-3">
          BlueStone: Revenue Up 5%, Gross Profit Down 15%
        </h1>
        <p className="text-sm sm:text-base text-[#141413]/85 font-medium leading-relaxed max-w-4xl mb-6">
          BlueStone is an omnichannel jewellery retailer. Nobody has uncovered the root cause yet, and there have been no major redesigns.
          As <strong>Product Manager for Digital Commerce</strong> (Web & Mobile App), your mandate is to diagnose product-side root causes, prioritize actionable interventions, and restore profitability without hurting customer trust.
        </p>

        {/* Core Stat Badges (4-Box Responsive Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div className="bg-[#FFFDF5] border-2 border-[#141413] p-3.5 rounded-xl shadow-[2px_2px_0px_0px_#141413]">
            <div className="text-[10px] sm:text-[11px] font-mono uppercase font-black text-[#141413]/70">Revenue</div>
            <div className="text-lg sm:text-2xl font-black text-[#059669] flex items-center gap-1.5 mt-0.5">
              <span>₹{BLUESTONE_CASE_DATA.stage5.revenueCr.curr} Cr</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#059669] bg-[#D1FAE5] px-1.5 py-0.2 rounded border border-[#059669]">+5%</span>
            </div>
            <div className="text-[10px] text-[#141413]/60 font-medium mt-1">Previous: ₹{BLUESTONE_CASE_DATA.stage5.revenueCr.prev} Cr</div>
          </div>

          <div className="bg-[#FFFDF5] border-2 border-[#141413] p-3.5 rounded-xl shadow-[2px_2px_0px_0px_#141413]">
            <div className="text-[10px] sm:text-[11px] font-mono uppercase font-black text-[#141413]/70">Gross Profit</div>
            <div className="text-lg sm:text-2xl font-black text-[#DC2626] flex items-center gap-1.5 mt-0.5">
              <span>₹{BLUESTONE_CASE_DATA.stage5.gpCr.curr} Cr</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#DC2626] bg-[#FEE2E2] px-1.5 py-0.2 rounded border border-[#DC2626]">-15%</span>
            </div>
            <div className="text-[10px] text-[#141413]/60 font-medium mt-1">Previous: ₹{BLUESTONE_CASE_DATA.stage5.gpCr.prev.toFixed(1)} Cr</div>
          </div>

          <div className="bg-[#FFFDF5] border-2 border-[#141413] p-3.5 rounded-xl shadow-[2px_2px_0px_0px_#141413]">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase font-black text-[#141413]/70">
              <span>Case Health</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                caseHealth >= 65 ? 'bg-[#D1FAE5] text-[#065F46]' : caseHealth >= 40 ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-[#FEE2E2] text-[#991B1B]'
              }`}>{caseHealth}/100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 border border-[#141413] mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  caseHealth >= 65 ? 'bg-[#059669]' : caseHealth >= 40 ? 'bg-[#F59E0B]' : 'bg-[#DC2626]'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, caseHealth))}%` }}
              />
            </div>
            <div className="text-[10px] text-[#141413]/70 font-semibold mt-1 truncate">
              {caseHealth >= 70 ? '🟢 Profit-First Execution' : caseHealth >= 45 ? '🟡 Commercial Balance' : '🔴 Margin Bleed Risk'}
            </div>
          </div>

          <div className="bg-[#FFFDF5] border-2 border-[#141413] p-3.5 rounded-xl shadow-[2px_2px_0px_0px_#141413]">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase font-black text-[#141413]/70">
              <span>Learner Score</span>
              <span className="text-[9px] font-mono text-[#188ab2] font-black">1st Try: +10</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-[#188ab2] mt-0.5">
              {learnerScore} <span className="text-xs font-mono text-[#141413]/70 font-bold">PTS</span>
            </div>
            <div className="text-[10px] text-[#141413]/60 font-medium mt-1">
              Hint: -3 pts | Retry: +5 pts
            </div>
          </div>
        </div>

        {/* Case Model Verification Note */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono text-slate-500 border-t border-[#141413]/10 pt-3">
          <span className="italic">
            * Illustrative figures for case practice · Reconciled unit economics model
          </span>
          <span className="font-bold text-[#141413]/80">
            Role: Digital PM (Web & Mobile App)
          </span>
        </div>

        {/* Latest Interviewer Observation Speech Bubble */}
        <div className="bg-[#FFFDF5] border-2 border-[#141413] rounded-xl p-3.5 sm:p-4 shadow-[2px_2px_0px_0px_#141413] flex items-start gap-3 mt-4">
          <div className="w-8 h-8 rounded-full bg-[#141413] text-[#FEF08A] font-black text-xs flex items-center justify-center shrink-0 border border-[#141413]">
            🎙️
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono uppercase font-black text-[#141413]/60 flex items-center gap-1.5">
              <span>Interviewer Reaction & Diagnostic Feedback</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#141413] mt-0.5 leading-snug">
              "{latestInterviewerReaction}"
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-tabs with Day Gating */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {BLUESTONE_STAGES_SCHEDULE.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeStageTab === tab.key;
          const isUnlocked = isStageUnlocked(tab);
          const isLiveToday = isStageLiveToday(tab);

          return (
            <button
              key={tab.key}
              onClick={() => setActiveStageTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl border-2 border-[#141413] font-bold text-xs uppercase whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#188ab2] text-white shadow-[3px_3px_0px_0px_#141413] translate-y-[-1px]'
                  : isUnlocked
                  ? 'bg-white hover:bg-slate-50 text-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413]'
                  : 'bg-[#F1F5F9] text-slate-500 border-dashed hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isLiveToday ? (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black border ${
                  isActive ? 'bg-white text-[#188ab2] border-white' : 'bg-[#D1FAE5] text-[#065F46] border-[#065F46]'
                }`}>
                  LIVE TODAY
                </span>
              ) : isUnlocked ? (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black border ${
                  isActive ? 'bg-white/20 text-white border-white/40' : 'bg-[#DCFCE7] text-[#166534] border-[#166534]'
                }`}>
                  UNLOCKED
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-slate-200 text-slate-600 border border-slate-300 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Day {tab.dayNumber} · {tab.unlockDateLabel}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── IF STAGE IS LOCKED (GATED FOR FUTURE DAYS) ───────────────────── */}
      {!isCurrentStageUnlocked && (
        <div className="bg-white rounded-2xl border-2 sm:border-[3px] border-[#141413] p-8 sm:p-12 text-center shadow-[4px_4px_0px_0px_#141413] space-y-4">
          <div className="w-16 h-16 bg-[#FEF08A] border-2 border-[#141413] rounded-full flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#141413]">
            <Lock className="w-8 h-8 text-[#141413]" />
          </div>
          <span className="inline-block bg-[#FEE2E2] text-[#991B1B] border border-[#141413] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            Stage Locked · Unlocks on Day {currentStageMeta.dayNumber} ({currentStageMeta.unlockDateLabel})
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#141413]">
            {currentStageMeta.label}
          </h2>
          <p className="text-sm sm:text-base font-semibold text-[#141413]/75 max-w-lg mx-auto">
            {currentStageMeta.cliffhanger}
          </p>

          <div className="bg-[#FFFDF5] rounded-xl border-2 border-dashed border-[#141413] p-5 max-w-md mx-auto text-left">
            <div className="font-mono font-bold text-xs uppercase text-slate-500 mb-1">
              Currently Live (Day {highestUnlockedStage.dayNumber}):
            </div>
            <div className="text-xs sm:text-sm text-[#141413] font-medium leading-relaxed">
              Stage {highestUnlockedStage.dayNumber} ({highestUnlockedStage.label}) is live today! Master this stage before moving forward.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveStageTab(highestUnlockedStage.key)}
              className="px-6 py-2.5 rounded-full font-black border-2 border-[#141413] bg-[#188ab2] hover:bg-[#0f6f8f] text-white shadow-[2px_2px_0px_0px_#141413] text-xs sm:text-sm uppercase cursor-pointer"
            >
              ← Go to Day {highestUnlockedStage.dayNumber} ({highestUnlockedStage.label})
            </button>
            <button
              type="button"
              onClick={() => setIsUnlockAllStages(true)}
              className="px-4 py-2.5 rounded-full font-bold border-2 border-[#141413] bg-white hover:bg-slate-50 text-[#141413] text-xs uppercase cursor-pointer"
            >
              Preview Stage Now (Reviewer Mode)
            </button>
          </div>
        </div>
      )}

            {/* ── STAGE 1: ASK CLARIFYING QUESTIONS (WITH QUESTION DROPDOWN & 3-TIER EVALUATION) ── */}
      {isCurrentStageUnlocked && activeStageTab === 'clarify' && (
        <div className="space-y-6">
          <div className="bg-white border-2 sm:border-[3px] border-[#141413] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413]">
            {/* Header & Status */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413]">
                    STAGE 1 • INTERVIEWER CLARIFYING DESK
                  </span>
                  {isStageLiveToday(BLUESTONE_STAGES_SCHEDULE[0]) ? (
                    <span className="bg-[#D1FAE5] text-[#065F46] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#065F46]">
                      LIVE TODAY
                    </span>
                  ) : (
                    <span className="bg-[#DCFCE7] text-[#166534] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#166534]">
                      UNLOCKED · DAY 1
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#141413] mt-2">
                  Ask Clarifying Questions
                </h2>
                <p className="text-xs sm:text-sm text-[#141413]/70 font-semibold mt-1">
                  Demonstrate to the interviewer that you know which questions to ask upfront, which to save for later investigation, and which are premature.
                </p>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-mono font-bold text-[#141413]/60">Interviewer Status</div>
                <div className="text-xs font-black text-[#059669] flex items-center gap-1 justify-end">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live & Evaluating</span>
                </div>
              </div>
            </div>

            {/* ── QUESTION SELECTOR DROPDOWN ──────────────── */}
            <div className="bg-[#FFFDF5] border-2 border-[#141413] rounded-xl p-4 sm:p-5 mb-5 shadow-[2.5px_2.5px_0px_0px_#141413] w-full max-w-full overflow-hidden">
              <div className="mb-2.5">
                <label htmlFor="clarifying-question-dropdown" className="text-xs font-mono font-black uppercase text-[#141413] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#188ab2]" />
                  <span>Select Question to Ask:</span>
                </label>
              </div>

              {/* The Flat Dropdown Form (No optgroups, no category labels) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full min-w-0 max-w-full">
                <select
                  id="clarifying-question-dropdown"
                  value={selectedDropdownQId}
                  onChange={(e) => setSelectedDropdownQId(e.target.value)}
                  className="flex-1 min-w-0 w-full max-w-full truncate bg-white border-2 border-[#141413] px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#188ab2] shadow-[2px_2px_0px_0px_#141413] cursor-pointer"
                  style={{ maxWidth: '100%', minWidth: 0 }}
                >
                  <option value="">-- Choose question to ask --</option>
                  {BLUESTONE_QUESTIONS_DATA.map((q) => (
                    <option key={q.id} value={q.id} title={q.question}>
                      {q.question}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAskFromDropdown}
                  disabled={!selectedDropdownQId}
                  className="bg-[#188ab2] hover:bg-[#0f6f8f] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <span>Ask Interviewer</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Q&A Chat Window */}
            <div className="border-2 border-[#141413] rounded-xl bg-[#FAF9F6] p-4 mb-4 shadow-[inset_1.5px_1.5px_0px_0px_rgba(0,0,0,0.06)]">
              <div ref={chatScrollRef} className="max-h-[420px] overflow-y-auto space-y-4 pr-2">
                {qaHistory.map((item) => {
                  const isInitial = item.category === 'initial' || item.classification === 'Ask initially';
                  const isLater = item.category === 'later' || item.classification === 'Ask later';
                  const isIrrelevant = item.category === 'irrelevant' || item.classification?.includes('relevant') || item.classification?.includes('premature') || item.classification?.includes('broad') || item.classification?.includes('detailed');

                  return (
                    <div key={item.id} className="space-y-2">
                      {/* Candidate Question */}
                      <div className="flex items-start justify-end gap-2.5">
                        <div className="max-w-[85%] sm:max-w-[75%] bg-[#141413] text-white p-3.5 rounded-2xl rounded-tr-none border-2 border-[#141413] shadow-[2px_2px_0px_0px_#141413]">
                          <div className="text-[10px] font-mono text-[#FEF08A] font-black uppercase mb-1">
                            You (Candidate PM)
                          </div>
                          <div className="text-xs sm:text-sm font-semibold leading-relaxed">
                            {item.question}
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#141413] text-white flex items-center justify-center font-black text-xs shrink-0 border border-[#141413]">
                          PM
                        </div>
                      </div>

                      {/* Interviewer Answer & Coaching */}
                      <div className="flex items-start justify-start gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#FEF08A] text-[#141413] flex items-center justify-center font-black text-xs shrink-0 border-2 border-[#141413] shadow-[1px_1px_0px_0px_#141413]">
                          INT
                        </div>
                        <div className={`max-w-[85%] sm:max-w-[80%] p-3.5 rounded-2xl rounded-tl-none border-2 border-[#141413] shadow-[2px_2px_0px_0px_#141413] ${
                          item.isMatch ? 'bg-white text-[#141413]' : 'bg-[#FEF2F2] text-[#991B1B]'
                        }`}>
                          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                            <span className="text-[10px] font-mono font-black uppercase text-slate-600">
                              Interviewer Response {item.rowId ? `· Question #${item.rowId}` : ''}
                            </span>
                            
                            {/* Classification Badge */}
                            {item.isPreliminary && (
                              <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border bg-[#DCFCE7] text-[#166534] border-[#166534]">
                                🟢 Relevant – Ask Initially
                              </span>
                            )}
                            {item.category === 'later' && (
                              <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border bg-[#FEF9C3] text-[#854D0E] border-[#854D0E]">
                                🟡 Not Right to Ask Now (Ask Later)
                              </span>
                            )}
                            {item.category === 'irrelevant' && (
                              <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border bg-[#FEE2E2] text-[#991B1B] border-[#991B1B]">
                                🔴 Not Relevant / Premature
                              </span>
                            )}
                            {!item.isMatch && (
                              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border bg-[#F1F5F9] text-slate-600 border-slate-400">
                                Outside Scope
                              </span>
                            )}
                          </div>

                          {/* Fact Response */}
                          <div className="text-xs sm:text-sm font-medium leading-relaxed mb-2">
                            {item.answer}
                          </div>

                          {/* PM Interview Evaluation Callout ("Why?") - shown for preliminary questions */}
                          {item.isPreliminary && item.why && (
                            <div className="mt-2.5 pt-2 border-t border-[#141413]/10 text-[11px] font-semibold text-[#141413]/85 bg-[#FFFDF5] p-2.5 rounded-lg border border-[#141413]/20">
                              <div className="font-mono text-[9px] uppercase font-black text-[#188ab2] mb-0.5 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-[#188ab2]" />
                                <span>PM Interview Evaluation:</span>
                              </div>
                              <div className="italic text-slate-700">{item.why}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Or Custom Question Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskQuestion();
              }}
              className="flex items-center gap-2 mb-4 w-full min-w-0 max-w-full"
            >
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Or type any custom clarifying question (e.g. 'Are we looking at absolute gross profit or margin?')"
                className="flex-1 min-w-0 w-full bg-white border-2 border-[#141413] px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-[#141413] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#188ab2] shadow-[2px_2px_0px_0px_#141413]"
              />
              <button
                type="submit"
                disabled={!questionInput.trim()}
                className="bg-[#141413] hover:bg-slate-800 disabled:opacity-40 text-white px-5 py-3 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* ── EDUCATIONAL COACHING SECTION: HOW TO PRESENT & DISTINCTION ── */}
            <div className="border-2 border-[#141413] rounded-xl bg-[#F8FAFC] p-4 sm:p-5 shadow-[2px_2px_0px_0px_#141413]">
              <div
                onClick={() => setShowFrameworkGuide(!showFrameworkGuide)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FEF08A] border border-[#141413] flex items-center justify-center font-bold text-xs">
                    💡
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-[#141413] uppercase font-mono">
                    Interviewer Coaching: How to Present & The Key Distinction
                  </h3>
                </div>
                <div className="text-xs font-mono font-bold text-[#188ab2] flex items-center gap-1">
                  <span>{showFrameworkGuide ? 'Collapse Guide' : 'Expand Guide'}</span>
                  {showFrameworkGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {showFrameworkGuide && (
                <div className="mt-4 pt-4 border-t border-[#141413]/20 space-y-4 animate-in fade-in duration-200">
                  {/* How to present script */}
                  <div>
                    <h4 className="text-xs font-mono font-black uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
                      <span>🎙️</span>
                      <span>How to present this to the interviewer before starting RCA:</span>
                    </h4>
                    <div className="bg-white border-2 border-[#141413] p-3.5 rounded-lg text-xs text-[#141413] leading-relaxed font-medium shadow-[1px_1px_0px_0px_#141413]">
                      <p className="italic">
                        "Before I start analysing the problem, I'd like to clarify a few things to make sure I understand the scope correctly. I'll first confirm the metric definition, comparison period, business scope and objective.<br /><br />
                        I also have some questions around revenue drivers, product categories, costs and the customer funnel. I believe those will be more useful once I structure the problem and identify which areas need deeper investigation, rather than asking all of them upfront.<br /><br />
                        I would avoid questions about implementation details or unrelated company information unless the analysis gives me a reason to explore them."
                      </p>
                    </div>
                  </div>

                  {/* 3 Categories comparison */}
                  <div>
                    <h4 className="text-xs font-mono font-black uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>The Key Distinction to Remember:</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      <div className="bg-[#DCFCE7] border-2 border-[#166534] p-3 rounded-lg shadow-[1px_1px_0px_0px_#166534]">
                        <div className="text-[10px] font-mono uppercase font-black text-[#166534] mb-1">
                          1. Preliminary Clarification
                        </div>
                        <div className="text-xs font-bold text-[#141413] mb-1">
                          What problem are we solving, and what is its scope?
                        </div>
                        <div className="text-[11px] text-[#141413]/75 italic">
                          Example: “Are we looking at absolute gross profit or gross profit margin?”
                        </div>
                      </div>

                      <div className="bg-[#FEF9C3] border-2 border-[#854D0E] p-3 rounded-lg shadow-[1px_1px_0px_0px_#854D0E]">
                        <div className="text-[10px] font-mono uppercase font-black text-[#854D0E] mb-1">
                          2. Later-Stage Investigation
                        </div>
                        <div className="text-xs font-bold text-[#141413] mb-1">
                          What is causing the problem?
                        </div>
                        <div className="text-[11px] text-[#141413]/75 italic">
                          Example: “Has the product mix shifted towards lower-margin categories?”
                        </div>
                      </div>

                      <div className="bg-[#FEE2E2] border-2 border-[#991B1B] p-3 rounded-lg shadow-[1px_1px_0px_0px_#991B1B]">
                        <div className="text-[10px] font-mono uppercase font-black text-[#991B1B] mb-1">
                          3. Irrelevant / Premature
                        </div>
                        <div className="text-xs font-bold text-[#141413] mb-1">
                          Does this information help explain the problem?
                        </div>
                        <div className="text-[11px] text-[#141413]/75 italic">
                          Example: “Which programming language is the website built in?”
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Golden Interview Rule */}
                  <div className="bg-[#FEF08A] border-2 border-[#141413] p-3 rounded-lg shadow-[1.5px_1.5px_0px_0px_#141413]">
                    <div className="text-[10px] font-mono uppercase font-black text-[#141413] mb-0.5 flex items-center gap-1">
                      <span>👑</span>
                      <span>Golden Interview Tip:</span>
                    </div>
                    <p className="text-xs font-bold text-[#141413] leading-relaxed">
                      A question can be relevant to the case but still wrong to ask at the preliminary stage. For example, asking about gold procurement costs is relevant to the GP decline, but it is better asked after you have established that COGS is a potential driver. This distinction is exactly what you want the interviewer to see: not just that you can ask questions, but that you know when and why to ask them.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-mono flex-wrap gap-2">
              <span>Clarifying Inquiries Completed: {qaHistory.length - 1}</span>
              <span className="flex items-center gap-1 text-[#DC2626]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Unmatched queries are marked outside the scope</span>
              </span>
            </div>

            {/* Advance to Stage 2 Button if Unlocked */}
            {isStageUnlocked(BLUESTONE_STAGES_SCHEDULE[1]) && (
              <div className="mt-6 pt-4 border-t-2 border-[#141413] flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs font-semibold text-[#141413]/80">
                  Finished scoping the problem? Advance to <strong>Stage 2: Metric Decomposition Tree</strong>.
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStageTab('tree')}
                  className="bg-[#188ab2] hover:bg-[#0f6f8f] text-white px-5 py-2.5 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Advance to Stage 2: Metric Tree</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

{/* ── STAGE 2: METRIC DECOMPOSITION TREE (PREDICT → COMPARE → TESTS → GUT CHECK → REVEAL) ── */}
      {isCurrentStageUnlocked && activeStageTab === 'tree' && (
        <div className="bg-white border-2 sm:border-[3px] border-[#141413] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413]">
                  STAGE 2 • METRIC DECOMPOSITION CHALLENGE
                </span>
                {isStageLiveToday(BLUESTONE_STAGES_SCHEDULE[1]) ? (
                  <span className="bg-[#D1FAE5] text-[#065F46] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#065F46]">
                    LIVE TODAY
                  </span>
                ) : (
                  <span className="bg-[#DCFCE7] text-[#166534] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#166534]">
                    UNLOCKED · DAY 2
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#141413] mt-2">
                Product RCA Issue Tree: Gross Profit (-15%)
              </h2>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-semibold mt-1">
                Predict first-level branches, compare candidate trees, test with the 4 MECE rules, and reveal the primary profit leakage.
              </p>
            </div>

            {/* Re-test button */}
            {(hasSubmittedTree || isDataRevealed) && (
              <button
                type="button"
                onClick={() => {
                  setStage2Step('predict');
                  setPredictedBranchChoice('');
                  setCustomPredictionInput('');
                  setSelectedTreeId('tree-revenue');
                  setHasSubmittedTree(false);
                  setGutCheckLeaf('');
                  setIsDataRevealed(false);
                }}
                className="px-3 py-1.5 rounded-xl border-2 border-[#141413] bg-[#FFFDF5] hover:bg-[#FEF08A] text-xs font-mono font-black uppercase flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#141413] transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Tree Challenge</span>
              </button>
            )}
          </div>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b-2 border-[#141413]/10 text-xs font-mono font-bold no-scrollbar">
            {[
              { key: 'predict', stepNum: '1', title: 'Predict First', unlocked: true },
              { key: 'compare', stepNum: '2', title: 'Compare Trees', unlocked: !!predictedBranchChoice || hasSubmittedTree },
              { key: 'feedback', stepNum: '3', title: 'Feedback & 4 Tests', unlocked: hasSubmittedTree },
              { key: 'gut_check', stepNum: '4', title: 'Gut Check', unlocked: hasSubmittedTree },
              { key: 'revealed', stepNum: '5', title: 'Data Reveal', unlocked: isDataRevealed }
            ].map(s => {
              const isActive = stage2Step === s.key;
              return (
                <button
                  key={s.key}
                  disabled={!s.unlocked}
                  onClick={() => setStage2Step(s.key as any)}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#188ab2] text-white border-[#141413] shadow-[2px_2px_0px_0px_#141413]'
                      : s.unlocked
                      ? 'bg-white hover:bg-slate-50 text-[#141413] border-[#141413]/40 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 border-dashed border-slate-300 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                    {s.stepNum}
                  </span>
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>

          {/* ── STEP 1: PREDICT FIRST ────────────────────────────────────────── */}
          {stage2Step === 'predict' && (
            <div className="bg-[#FFFDF5] border-2 border-[#141413] rounded-xl p-5 sm:p-6 shadow-[3px_3px_0px_0px_#141413] space-y-5 animate-in fade-in duration-200">
              <div className="border-b-2 border-[#141413] pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#FEF08A] text-[#141413] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#141413]">
                    STEP 1 OF 5 • COMMIT TO A GUESS
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#141413]">
                  What are the first-level branches of your tree?
                </h3>
                <p className="text-xs sm:text-sm text-[#141413]/80 font-medium mt-1">
                  In an executive interview, never look for pre-packaged templates. Commit to your own hypothesis first:
                  Revenue is <strong>+5% (₹100 Cr → ₹105 Cr)</strong>, but Gross Profit is <strong>-15% (₹20 Cr → ₹17.1 Cr)</strong>.
                  How must the top-level metric split?
                </p>
              </div>

              {/* Prediction Options */}
              <div className="space-y-2.5">
                {STAGE2_PREDICTION_OPTIONS.map((opt) => {
                  const isSelected = predictedBranchChoice === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setPredictedBranchChoice(opt.id)}
                      className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#FEF08A] border-[#141413] shadow-[3px_3px_0px_0px_#141413] translate-x-[2px]'
                          : 'bg-white hover:bg-slate-50 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 border-[#141413] flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#188ab2] text-white' : 'bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-mono text-xs sm:text-sm font-black text-[#141413]">
                          {opt.label}
                        </div>
                        <div className="text-[11px] sm:text-xs text-[#141413]/70 font-medium mt-0.5">
                          {opt.hint}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Or custom guess input */}
              <div>
                <label className="block text-xs font-mono font-black uppercase text-[#141413] mb-1.5">
                  Or type your own custom hypothesis:
                </label>
                <input
                  type="text"
                  value={customPredictionInput}
                  onChange={(e) => {
                    setCustomPredictionInput(e.target.value);
                    if (e.target.value.trim()) {
                      setPredictedBranchChoice('custom');
                    }
                  }}
                  placeholder="e.g., Gross Profit splits into Unit Selling Price, Unit Cost, and Volume..."
                  className="w-full bg-white border-2 border-[#141413] px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-[#141413] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#188ab2] shadow-[2px_2px_0px_0px_#141413]"
                />
              </div>

              {/* Submit Prediction */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={!predictedBranchChoice && !customPredictionInput.trim()}
                  onClick={() => setStage2Step('compare')}
                  className="bg-[#188ab2] hover:bg-[#0f6f8f] disabled:opacity-40 text-white px-6 py-3 rounded-xl border-2 border-[#141413] font-black text-xs sm:text-sm uppercase shadow-[3px_3px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Commit Guess & Compare Three Trees</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: COMPARE THREE TREES ──────────────────────────────────── */}
          {stage2Step === 'compare' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-[#FFFDF5] border-2 border-[#141413] rounded-xl p-4 sm:p-5 shadow-[2.5px_2.5px_0px_0px_#141413]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#FEF08A] text-[#141413] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#141413]">
                    STEP 2 OF 5 • COMPARE THREE TREES
                  </span>
                  <span className="text-xs font-mono text-[#141413]/70 font-semibold">
                    Two are wrong. One is right. Which one would you defend in an interview?
                  </span>
                </div>
                <p className="text-xs text-[#141413]/80 font-medium">
                  Inspect the candidate structures below. Notice how each handles the mathematical relationship between revenue, volume, costs, and teams.
                </p>
              </div>

              {/* 3 Trees in Shuffled Order */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  CANDIDATE_TREES[0], // Tree A: Revenue-Only
                  CANDIDATE_TREES[1], // The Correct Tree (Formula-Based)
                  CANDIDATE_TREES[2]  // Tree B: Org-Chart Tree
                ].map((tree) => {
                  const isSelected = selectedTreeId === tree.id;
                  return (
                    <div
                      key={tree.id}
                      onClick={() => setSelectedTreeId(tree.id)}
                      className={`rounded-xl border-2 border-[#141413] p-4 flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FEF08A] shadow-[4px_4px_0px_0px_#141413] translate-y-[-2px]'
                          : 'bg-white hover:bg-slate-50 shadow-[2px_2px_0px_0px_#141413]'
                      }`}
                    >
                      <div>
                        {/* Tree Header */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="font-mono text-[10px] font-black uppercase bg-white border border-[#141413] px-2 py-0.5 rounded-full">
                            {tree.name}
                          </span>
                          <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded border ${
                            tree.isCorrect ? 'bg-[#D1FAE5] text-[#065F46] border-[#065F46]' : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}>
                            {tree.badge}
                          </span>
                        </div>

                        <div className="font-mono text-xs font-black text-[#141413] mb-3">
                          {tree.title}
                        </div>

                        {/* Visual Breakdown Diagram */}
                        <div className="bg-[#FFFDF5] border border-[#141413] rounded-lg p-2.5 space-y-2 text-xs font-mono mb-3">
                          {tree.branches.map((b, bIdx) => (
                            <div key={bIdx} className="bg-white border border-[#141413]/30 p-2 rounded">
                              <div className="font-bold text-[#141413] text-[11px] flex items-center gap-1">
                                <GitFork className="w-3 h-3 text-[#188ab2]" />
                                <span>{b.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-600 pl-4 mt-0.5 leading-tight">
                                {b.subBranches.join(' · ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Select Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTreeId(tree.id);
                        }}
                        className={`w-full py-2 rounded-lg border-2 border-[#141413] font-mono text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#188ab2] text-white shadow-[2px_2px_0px_0px_#141413]'
                            : 'bg-white hover:bg-slate-100 text-[#141413]'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                        <span>{isSelected ? 'Selected Tree' : 'Select This Tree'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Advanced / Optional Trees Accordion */}
              <div className="border-2 border-[#141413] rounded-xl bg-[#F8FAFC] p-3.5 shadow-[2px_2px_0px_0px_#141413]">
                <button
                  type="button"
                  onClick={() => setShowAdvancedTrees(!showAdvancedTrees)}
                  className="w-full flex items-center justify-between text-xs font-mono font-black uppercase text-[#141413] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-[#188ab2]" />
                    <span>View More Structural Errors (Tree C: Solution-First & Tree D: Mixed-Level)</span>
                  </span>
                  {showAdvancedTrees ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvancedTrees && (
                  <div className="mt-3 pt-3 border-t border-[#141413]/20 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[CANDIDATE_TREES[3], CANDIDATE_TREES[4]].map(advTree => {
                      const isSelected = selectedTreeId === advTree.id;
                      return (
                        <div
                          key={advTree.id}
                          onClick={() => setSelectedTreeId(advTree.id)}
                          className={`p-3 rounded-lg border-2 border-[#141413] cursor-pointer ${
                            isSelected ? 'bg-[#FEF08A]' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-black">{advTree.name}</span>
                            <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-mono font-bold">
                              {advTree.badge}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-[#141413]/80 mb-2">{advTree.title}</div>
                          <p className="text-[11px] text-[#141413]/70 italic mb-2">{advTree.whyFailsOrSucceeds}</p>
                          <button
                            type="button"
                            className={`w-full py-1 text-xs font-mono font-bold rounded border border-[#141413] ${
                              isSelected ? 'bg-[#188ab2] text-white' : 'bg-slate-100 text-[#141413]'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Pick to Defend'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Submit Selection Button */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStage2Step('predict')}
                  className="px-4 py-2.5 rounded-xl border-2 border-[#141413] bg-white hover:bg-slate-50 text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  ← Back to Prediction
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHasSubmittedTree(true);
                    setStage2Step('feedback');
                  }}
                  className="bg-[#188ab2] hover:bg-[#0f6f8f] text-white px-6 py-3 rounded-xl border-2 border-[#141413] font-black text-xs sm:text-sm uppercase shadow-[3px_3px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Lock in Choice & See Interviewer Feedback</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: FEEDBACK PER TREE & THE 4 GOLDEN TESTS ───────────────── */}
          {stage2Step === 'feedback' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Feedback on Selected Tree */}
              {(() => {
                const currentTree = CANDIDATE_TREES.find(t => t.id === selectedTreeId) || CANDIDATE_TREES[0];
                return (
                  <div className={`p-5 sm:p-6 rounded-xl border-2 sm:border-[3px] border-[#141413] shadow-[4px_4px_0px_0px_#141413] ${
                    currentTree.isCorrect ? 'bg-[#D1FAE5]' : 'bg-[#FEE2E2]'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {currentTree.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-[#065F46]" />
                      ) : (
                        <XCircle className="w-6 h-6 text-[#991B1B]" />
                      )}
                      <span className="font-mono text-xs font-black uppercase tracking-wider">
                        {currentTree.isCorrect
                          ? '✅ Defensible Choice: Executive PM Interview Standard!'
                          : `❌ Interviewer Rejection: Why ${currentTree.name} Fails`}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-[#141413] mt-1 mb-2">
                      {currentTree.title}
                    </h3>

                    <div className="bg-white border-2 border-[#141413] p-4 rounded-lg space-y-2 text-xs sm:text-sm">
                      <div>
                        <strong className="text-[#141413] font-mono uppercase text-[11px] block">
                          Why it {currentTree.isCorrect ? 'succeeds' : 'fails'}:
                        </strong>
                        <p className="text-[#141413]/85 font-medium mt-0.5 leading-relaxed">
                          {currentTree.whyFailsOrSucceeds}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#141413]/20">
                        <strong className="text-[#141413] font-mono uppercase text-[11px] block">
                          What interviewers conclude about the candidate:
                        </strong>
                        <p className="italic text-[#141413]/90 font-semibold mt-0.5">
                          "{currentTree.interviewerVerdict}"
                        </p>
                      </div>
                    </div>

                    {!currentTree.isCorrect && (
                      <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-semibold text-[#991B1B]">
                          Switch to the formula-based tree to pass the interview:
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedTreeId('tree-correct')}
                          className="px-4 py-2 bg-[#141413] text-white rounded-lg text-xs font-mono font-black uppercase hover:bg-slate-800 transition-all cursor-pointer"
                        >
                          Adopt The Formula-Based Tree →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ── THE 4 TESTS OF A CORRECT TREE ─────────────────────────────── */}
              <div className="bg-[#FFFDF5] border-2 border-[#141413] rounded-xl p-5 sm:p-6 shadow-[3px_3px_0px_0px_#141413]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#FEF08A] text-[#141413] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#141413]">
                    THE 4 GOLDEN TESTS
                  </span>
                  <span className="text-xs font-mono font-black uppercase text-[#141413]">
                    How to verify any issue tree yourself
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#141413] mb-4">
                  What makes the formula-based tree universally correct:
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {FOUR_MECE_TESTS.map((test) => (
                    <div key={test.num} className="bg-white border-2 border-[#141413] p-4 rounded-xl shadow-[2px_2px_0px_0px_#141413]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#FEF08A] border border-[#141413] flex items-center justify-center font-mono text-xs font-black">
                          {test.num}
                        </span>
                        <span className="font-mono text-xs font-black text-[#141413] uppercase">
                          {test.title}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-[#188ab2] mb-1">
                        {test.rule}
                      </div>
                      <p className="text-[11px] text-[#141413]/75 font-medium leading-relaxed">
                        {test.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Advance to Gut Check Button */}
                <div className="mt-5 pt-4 border-t-2 border-[#141413] flex items-center justify-between flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setStage2Step('compare')}
                    className="px-4 py-2.5 rounded-xl border-2 border-[#141413] bg-white hover:bg-slate-50 text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    ← Revisit Tree Comparison
                  </button>

                  <button
                    type="button"
                    onClick={() => setStage2Step('gut_check')}
                    className="bg-[#188ab2] hover:bg-[#0f6f8f] text-white px-6 py-3 rounded-xl border-2 border-[#141413] font-black text-xs sm:text-sm uppercase shadow-[3px_3px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Advance to Gut Check: Which Leaf Matters Most?</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: GUT CHECK: WHICH BRANCH MATTERS MOST? ─────────────────── */}
          {stage2Step === 'gut_check' && (
            <div className="bg-[#FFFDF5] border-2 border-[#141413] rounded-xl p-5 sm:p-6 shadow-[3px_3px_0px_0px_#141413] space-y-5 animate-in fade-in duration-200">
              <div className="border-b-2 border-[#141413] pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#FEF08A] text-[#141413] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#141413]">
                    STEP 4 OF 5 • GUT CHECK PREDICTION
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#141413]">
                  Which leaf branch matters most to this gross profit collapse?
                </h3>
                <p className="text-xs sm:text-sm text-[#141413]/80 font-medium mt-1">
                  You now have the full 8-leaf tree. Before the data is revealed, rank your gut instinct: Which specific leaf branch caused the 15% profit drop?
                </p>
              </div>

              {/* 8 Leaf Cards in 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Revenue Leaves */}
                <div className="space-y-2.5">
                  <div className="font-mono text-xs font-black uppercase text-[#188ab2] px-1">
                    Revenue Leaves (Customer Experience)
                  </div>
                  {EIGHT_LEAF_BRANCHES.slice(0, 4).map(leaf => {
                    const isSelected = gutCheckLeaf === leaf.id;
                    return (
                      <div
                        key={leaf.id}
                        onClick={() => setGutCheckLeaf(leaf.id)}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FEF08A] border-[#141413] shadow-[3px_3px_0px_0px_#141413] translate-x-[2px]'
                            : 'bg-white hover:bg-slate-50 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-black text-[#141413]">
                            {leaf.name}
                          </span>
                          {isSelected && <span className="text-[10px] bg-[#141413] text-white px-2 py-0.2 rounded font-mono font-bold">YOUR PICK</span>}
                        </div>
                        <p className="text-[11px] text-[#141413]/70 font-medium mt-0.5">
                          {leaf.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* COGS Leaves */}
                <div className="space-y-2.5">
                  <div className="font-mono text-xs font-black uppercase text-[#DC2626] px-1">
                    COGS Leaves (Product Economics)
                  </div>
                  {EIGHT_LEAF_BRANCHES.slice(4).map(leaf => {
                    const isSelected = gutCheckLeaf === leaf.id;
                    return (
                      <div
                        key={leaf.id}
                        onClick={() => setGutCheckLeaf(leaf.id)}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FEF08A] border-[#141413] shadow-[3px_3px_0px_0px_#141413] translate-x-[2px]'
                            : 'bg-white hover:bg-slate-50 border-[#141413] shadow-[1.5px_1.5px_0px_0px_#141413]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-black text-[#141413]">
                            {leaf.name}
                          </span>
                          {isSelected && <span className="text-[10px] bg-[#141413] text-white px-2 py-0.2 rounded font-mono font-bold">YOUR PICK</span>}
                        </div>
                        <p className="text-[11px] text-[#141413]/70 font-medium mt-0.5">
                          {leaf.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reveal Button */}
              <div className="pt-3 border-t-2 border-[#141413] flex items-center justify-between flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setStage2Step('feedback')}
                  className="px-4 py-2.5 rounded-xl border-2 border-[#141413] bg-white hover:bg-slate-50 text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  ← Back to The 4 Tests
                </button>

                <button
                  type="button"
                  disabled={!gutCheckLeaf}
                  onClick={() => {
                    setIsDataRevealed(true);
                    setStage2Step('revealed');
                  }}
                  className="bg-[#141413] hover:bg-slate-800 disabled:opacity-40 text-white px-6 py-3 rounded-xl border-2 border-[#141413] font-black text-xs sm:text-sm uppercase shadow-[3px_3px_0px_0px_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Crosshair className="w-4 h-4 text-[#FEF08A]" />
                  <span>Reveal Case Diagnostic Data & Check My Gut</span>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 5: REVEAL CORRECT TREE WITH RED 2.1 HIGHLIGHT ───────────── */}
          {stage2Step === 'revealed' && isDataRevealed && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Gut Check Evaluation Banner */}
              {(() => {
                const pickedLeafObj = EIGHT_LEAF_BRANCHES.find(l => l.id === gutCheckLeaf);
                const isGutCorrect = gutCheckLeaf === '2.1';
                return (
                  <div className={`p-4 sm:p-5 rounded-xl border-2 sm:border-[3px] border-[#141413] shadow-[3px_3px_0px_0px_#141413] ${
                    isGutCorrect ? 'bg-[#D1FAE5]' : 'bg-[#FEF3C7]'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {isGutCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-[#065F46]" />
                      ) : (
                        <Scale className="w-5 h-5 text-[#B45309]" />
                      )}
                      <span className="font-mono text-xs font-black uppercase text-[#141413]">
                        {isGutCorrect ? '🎯 Bullseye! Your Gut Instinct Was 100% Correct' : '💡 Diagnostic Reality Check: Data vs Gut'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#141413] leading-relaxed">
                      {isGutCorrect ? (
                        <span>
                          You hypothesized <strong>{pickedLeafObj?.name}</strong>. The empirical data below proves that Product Mix was the single largest profit drain, responsible for <strong>93% of the gross profit collapse (-₹2.7 Cr)</strong>!
                        </span>
                      ) : (
                        <span>
                          You hypothesized <strong>{pickedLeafObj?.name}</strong>. While that branch saw minor friction, the empirical numbers reveal that <strong>2.1 Product Mix</strong> was the primary killer, wiping out <strong>₹2.7 Cr of profit</strong> alone! Notice the red highlight below.
                        </span>
                      )}
                    </p>
                  </div>
                );
              })()}

              {/* The Correct Tree (with Red 2.1 Highlight appearing now) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Revenue */}
                <div className="bg-[#F8FAFC] border-2 border-[#141413] rounded-xl p-5 shadow-[3px_3px_0px_0px_#141413]">
                  <div className="flex items-center justify-between border-b-2 border-[#141413] pb-3 mb-4">
                    <span className="font-mono text-xs font-black uppercase text-[#141413]">
                      1. REVENUE (Customer & Product Experience)
                    </span>
                    <span className="text-xs font-black bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded border border-[#065F46]">
                      +5% (₹105 Cr)
                    </span>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm">
                    <li className="p-3 bg-white border border-[#141413] rounded-lg">
                      <div className="font-black text-[#141413]">1.1 Acquisition: Traffic & CAC</div>
                      <div className="text-[#141413]/75 mt-0.5">Sessions grew from 10L to 11L (+10%). Marketing drove more top-of-funnel users.</div>
                    </li>
                    <li className="p-3 bg-white border border-[#141413] rounded-lg">
                      <div className="font-black text-[#141413]">1.2 Discovery: Search & PDP Views</div>
                      <div className="text-[#141413]/75 mt-0.5">Product page views rose from 5.0L to 5.5L (+10%). Users are discovering products.</div>
                    </li>
                    <li className="p-3 bg-white border border-[#141413] rounded-lg">
                      <div className="font-black text-[#141413]">1.3 Conversion: Cart & Checkout</div>
                      <div className="text-[#DC2626] font-semibold mt-0.5">Add-to-cart dropped from 12% to 11%. Checkout conversion dropped from 70% to 68%.</div>
                    </li>
                    <li className="p-3 bg-white border border-[#141413] rounded-lg">
                      <div className="font-black text-[#141413]">1.4 Basket Value: AOV & Items/Order</div>
                      <div className="text-[#141413]/75 mt-0.5">AOV grew slightly from ₹50,000 to ₹50,240 (driven by higher gold prices, not more items).</div>
                    </li>
                  </ul>
                </div>

                {/* 2. COGS with RED HIGHLIGHT ON 2.1 */}
                <div className="bg-[#FFFDF5] border-2 border-[#141413] rounded-xl p-5 shadow-[3px_3px_0px_0px_#141413]">
                  <div className="flex items-center justify-between border-b-2 border-[#141413] pb-3 mb-4">
                    <span className="font-mono text-xs font-black uppercase text-[#141413]">
                      2. COGS (Product Economics & Mix)
                    </span>
                    <span className="text-xs font-black bg-[#FEE2E2] text-[#991B1B] px-2 py-0.5 rounded border border-[#991B1B]">
                      CRITICAL SQUEEZE
                    </span>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm">
                    {/* RED HIGHLIGHT ONLY AFTER USER ANSWERS */}
                    <li className="p-3.5 bg-[#FEF2F2] border-[2.5px] border-[#DC2626] rounded-xl shadow-[2px_2px_0px_0px_#DC2626] relative">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-[10px] font-black uppercase bg-[#DC2626] text-white px-2 py-0.5 rounded">
                          CRITICAL ROOT CAUSE (93% OF LOSS)
                        </span>
                        <span className="text-xs font-mono font-black text-[#DC2626]">-₹2.7 Cr</span>
                      </div>
                      <div className="font-black text-[#DC2626] text-sm">
                        2.1 Product Mix: Gold vs Diamond Contribution
                      </div>
                      <div className="text-[#141413] font-semibold text-xs mt-1 leading-relaxed">
                        Gold grew to 71% of total sales, but its margin dropped from 22% to 14%. Squeezed ₹2.7 Cr of profit out of the total ₹2.9 Cr decline!
                      </div>
                    </li>

                    <li className="p-3 bg-white border border-[#141413] rounded-lg">
                      <div className="font-black text-[#141413]">2.2 Procurement: Raw Gold Inflation</div>
                      <div className="text-[#141413]/75 mt-0.5">Global gold prices spiked. The business absorbed part of this without full pass-through.</div>
                    </li>
                    <li className="p-3 bg-white border border-[#141413] rounded-lg">
                      <div className="font-black text-[#141413]">2.3 Manufacturing & Making Charges</div>
                      <div className="text-[#141413]/75 mt-0.5">Making charges were not dynamically calibrated for lightweight gold designs.</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-6 pt-4 border-t-2 border-[#141413] flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveStageTab('clarify')}
              className="bg-white hover:bg-slate-50 text-[#141413] px-4 py-2.5 rounded-xl border-2 border-[#141413] font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#141413] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Back to Clarifying Questions</span>
            </button>
            {isStageUnlocked(BLUESTONE_STAGES_SCHEDULE[2]) ? (
              <button
                type="button"
                onClick={() => setActiveStageTab('journey')}
                className="bg-[#188ab2] hover:bg-[#0f6f8f] text-white px-5 py-2.5 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Advance to Stage 3: Funnel & Analytics</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs font-mono font-bold text-slate-500 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Stage 3 (Customer Funnel) unlocks automatically on {BLUESTONE_STAGES_SCHEDULE[2].unlockDateLabel}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STAGE 3: CUSTOMER JOURNEY (ORDER, METRICS, PDP TRUST, SEGMENTS) ── */}
      {isCurrentStageUnlocked && (activeStageTab === 'journey' || activeStageTab === 'funnel') && (
        <div className="bg-white border-2 sm:border-[3px] border-[#141413] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413]">
                  STAGE 3 • CUSTOMER JOURNEY & FUNNEL
                </span>
                <span className="bg-[#DCFCE7] text-[#166534] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#166534]">
                  UNLOCKED · DAY 3
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#141413] mt-2">
                Reconstruct the 8-Stage Jewellery Customer Journey
              </h2>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-semibold mt-1">
                Jewellery is a high-ticket trust purchase. Structure the journey from first arrival to lifetime repeat purchase.
              </p>
            </div>
          </div>

          {/* ── STEP 1: JOURNEY SEQUENCER ────────────────────────────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 1 of 4: Chronological Sequence</span>
                <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                  Order the 8 Journey Steps
                </h3>
              </div>
              <button
                type="button"
                onClick={() => useHintForStep('stage3_order')}
                disabled={hintsUsed['stage3_order']}
                className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span>💡 Need a hint? (-3 pts)</span>
              </button>
            </div>

            {hintsUsed['stage3_order'] && (
              <div className="bg-[#FEF3C7] border border-[#D97706] p-3 rounded-lg text-xs font-medium text-[#92400E]">
                <strong>Hint:</strong> The customer journey doesn't end when payment succeeds. High-AOV jewellery profitability is heavily impacted by insured delivery, unboxing trust, and post-purchase returns/exchanges.
              </div>
            )}

            <p className="text-xs font-semibold text-[#141413]/80">
              Use the <span className="font-mono font-bold">↑</span> and <span className="font-mono font-bold">↓</span> buttons to arrange the cards into chronological order:
            </p>

            <div className="space-y-2">
              {stage3JourneyOrder.map((stepId, idx) => {
                const card = STAGE3_JOURNEY_STEPS.find(s => s.id === stepId)!;
                return (
                  <div
                    key={stepId}
                    className="flex items-center justify-between bg-white border-2 border-[#141413] p-3 rounded-xl shadow-[1.5px_1.5px_0px_0px_#141413]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-[#FEF08A] border border-[#141413] font-mono font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-[#141413] truncate">{card.label}</div>
                        <div className="text-[11px] text-[#141413]/60 font-medium truncate">{card.hint}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (idx === 0) return;
                          const copy = [...stage3JourneyOrder];
                          [copy[idx], copy[idx - 1]] = [copy[idx - 1], copy[idx]];
                          setStage3JourneyOrder(copy);
                        }}
                        disabled={idx === 0 || (stage3OrderSubmitted && stage3OrderIsCorrect)}
                        className="w-7 h-7 rounded border border-[#141413] bg-[#F8FAFC] hover:bg-slate-200 disabled:opacity-30 font-bold text-xs flex items-center justify-center cursor-pointer"
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (idx === stage3JourneyOrder.length - 1) return;
                          const copy = [...stage3JourneyOrder];
                          [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
                          setStage3JourneyOrder(copy);
                        }}
                        disabled={idx === stage3JourneyOrder.length - 1 || (stage3OrderSubmitted && stage3OrderIsCorrect)}
                        className="w-7 h-7 rounded border border-[#141413] bg-[#F8FAFC] hover:bg-slate-200 disabled:opacity-30 font-bold text-xs flex items-center justify-center cursor-pointer"
                        title="Move Down"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const correctSequence = ['visit', 'discover', 'view_pdp', 'add_to_cart', 'checkout', 'pay', 'receive', 'return_repeat'];
                  const isEndingAtPayment = stage3JourneyOrder[stage3JourneyOrder.length - 1] === 'pay' || stage3JourneyOrder.indexOf('pay') > stage3JourneyOrder.indexOf('receive');
                  const isCorrect = JSON.stringify(stage3JourneyOrder) === JSON.stringify(correctSequence);

                  setStage3OrderSubmitted(true);
                  if (isCorrect) {
                    setStage3OrderIsCorrect(true);
                    setStage3OrderFeedback('CORRECT! High-ticket jewellery value and unit margins are preserved post-sale through insured transit, size exchanges, and lifetime repeat purchases.');
                    applyStepResult('stage3_order', true, 'Correct sequence', 'Good. You understand that customer value and returns extend well beyond the payment gateway.', 5);
                  } else if (isEndingAtPayment) {
                    setStage3OrderIsCorrect(false);
                    setStage3OrderFeedback('Profit is also decided after the sale, through returns and repeat purchase. Do not truncate the journey at the payment gateway.');
                    applyStepResult('stage3_order', false, 'Truncated at payment', 'Profit is also decided after the sale, through returns and repeat purchase.', -5);
                  } else {
                    setStage3OrderIsCorrect(false);
                    setStage3OrderFeedback('Sequence order mismatch. Remember: Visit → Discovery → PDP View → Add to Cart → Checkout → Pay → Delivery & Unboxing → Returns & Repeat.');
                    applyStepResult('stage3_order', false, 'Incorrect sequence', 'Review the logical progression of high-intent digital shopping.', 0);
                  }
                }}
                className="bg-[#188ab2] hover:bg-[#0f6f8f] text-white px-5 py-2.5 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] cursor-pointer"
              >
                Validate Journey Sequence
              </button>

              {stage3OrderSubmitted && !stage3OrderIsCorrect && (
                <button
                  type="button"
                  onClick={() => {
                    setStage3OrderSubmitted(false);
                  }}
                  className="bg-white hover:bg-slate-50 text-[#141413] px-3.5 py-2 rounded-xl border border-[#141413] font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again (+5 pts retry)</span>
                </button>
              )}
            </div>

            {stage3OrderSubmitted && (
              <div className={`p-3.5 rounded-xl border-2 text-xs font-semibold leading-relaxed ${
                stage3OrderIsCorrect ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]' : 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B]'
              }`}>
                <strong>{stage3OrderIsCorrect ? '✓ Verified Sequence:' : '⚠ Diagnostic Review:'}</strong> {stage3OrderFeedback}
              </div>
            )}
          </div>

          {/* ── STEP 2: STAGE-TO-METRIC & LIKELY ISSUE MATCHING ──────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 2 of 4: Metric & Issue Matching</span>
              <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                Stage Diagnostic Indicators
              </h3>
              <p className="text-xs text-[#141413]/70 font-semibold mt-1">
                Each journey stage has a specific health metric and signature symptom of failure:
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border-2 border-[#141413] bg-white">
                <thead>
                  <tr className="bg-[#141413] text-white font-mono uppercase text-[10px]">
                    <th className="p-3 border border-[#141413]">Journey Stage</th>
                    <th className="p-3 border border-[#141413]">Primary Health Metric</th>
                    <th className="p-3 border border-[#141413]">Signature Diagnostic Issue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]">
                  {STAGE3_STAGE_MATCHING.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3 font-black text-[#141413]">{m.stage}</td>
                      <td className="p-3 font-mono font-bold text-[#188ab2]">{m.primaryMetric}</td>
                      <td className="p-3 text-[#141413]/80 font-medium">{m.likelyIssue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── STEP 3: PDP TRUST FACTORS (MULTI-SELECT WITH TRAPS) ── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 3 of 4: Product Experience</span>
                <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                  Scenario: Add-to-Cart Conversion Fell. What does a jewellery buyer need on the PDP?
                </h3>
                <p className="text-xs text-[#141413]/70 font-semibold mt-1">
                  Select all elements that genuinely build buyer confidence for ₹50,000+ jewellery:
                </p>
              </div>
              <button
                type="button"
                onClick={() => useHintForStep('stage3_pdp')}
                disabled={hintsUsed['stage3_pdp']}
                className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span>💡 Need a hint? (-3 pts)</span>
              </button>
            </div>

            {hintsUsed['stage3_pdp'] && (
              <div className="bg-[#FEF3C7] border border-[#D97706] p-3 rounded-lg text-xs font-medium text-[#92400E]">
                <strong>Hint:</strong> Fine jewellery is not an impulse purchase. Fake urgency mechanisms degrade credibility for premium brand perception.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STAGE3_PDP_FACTORS.map((item) => {
                const isSelected = stage3PdpSelected.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (stage3PdpSubmitted) return;
                      setStage3PdpSelected(prev =>
                        prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id]
                      );
                    }}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#E0F2FE] border-[#0284C7] shadow-[2px_2px_0px_0px_#0284C7]'
                        : 'bg-white border-[#141413] hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#141413]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#0284C7] border-[#0284C7] text-white' : 'border-[#141413] bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold text-[#141413]">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const selectedItems = STAGE3_PDP_FACTORS.filter(f => stage3PdpSelected.includes(f.id));
                  const pickedTrap = selectedItems.find(f => !f.isCorrect);

                  setStage3PdpSubmitted(true);
                  if (pickedTrap) {
                    setStage3PdpFeedback(pickedTrap.feedback || 'Jewellery is a trust purchase. Urgency tricks do not fix missing confidence.');
                    applyStepResult('stage3_pdp', false, 'Urgency trap chosen', 'Jewellery is a trust purchase. Urgency tricks do not fix missing confidence.', -5);
                  } else if (stage3PdpSelected.length >= 4) {
                    setStage3PdpFeedback('Spot on! High-AOV jewellery purchases demand purity certification, detailed weight/making-charge breakups, and insured delivery guarantees.');
                    applyStepResult('stage3_pdp', true, 'Trust factors selected', 'Accurate product UX intuition. Certified hallmarking and price transparency convert high-intent buyers.', 10);
                  } else {
                    setStage3PdpFeedback('Please select all essential confidence-building trust specifications before submitting.');
                  }
                }}
                disabled={stage3PdpSelected.length === 0}
                className="bg-[#188ab2] hover:bg-[#0f6f8f] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] cursor-pointer"
              >
                Submit PDP Factors
              </button>

              {stage3PdpSubmitted && (
                <button
                  type="button"
                  onClick={() => {
                    setStage3PdpSubmitted(false);
                  }}
                  className="bg-white hover:bg-slate-50 text-[#141413] px-3.5 py-2 rounded-xl border border-[#141413] font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again (+5 pts retry)</span>
                </button>
              )}
            </div>

            {stage3PdpSubmitted && (
              <div className={`p-3.5 rounded-xl border-2 text-xs font-semibold leading-relaxed ${
                stage3PdpFeedback.includes('Spot on') ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]' : 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B]'
              }`}>
                {stage3PdpFeedback}
              </div>
            )}
          </div>

          {/* ── STEP 4: SEGMENT CUTS ──────────────────────────────────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 4 of 4: Analytical Segmentation</span>
              <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                Which Segment Cuts Will Isolate the Profit Leak?
              </h3>
              <p className="text-xs text-[#141413]/70 font-semibold mt-1">
                Averages hide the truth; segments reveal it. Select the most actionable cuts:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STAGE3_SEGMENT_CUTS.map((item) => {
                const isSelected = stage3SegmentsSelected.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (stage3SegmentsSubmitted) return;
                      setStage3SegmentsSelected(prev =>
                        prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id]
                      );
                    }}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#E0F2FE] border-[#0284C7] shadow-[2px_2px_0px_0px_#0284C7]'
                        : 'bg-white border-[#141413] hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#141413]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#0284C7] border-[#0284C7] text-white' : 'border-[#141413] bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold text-[#141413]">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const hasTimeOfDay = stage3SegmentsSelected.includes('time_of_day');
                  setStage3SegmentsSubmitted(true);
                  if (hasTimeOfDay) {
                    setStage3SegmentsFeedback('Time of day adds noise without behavioral segmentation. In retail jewellery, gold vs diamond and app vs web are far more revealing.');
                    applyStepResult('stage3_segments', false, 'Noise cut selected', 'Time of day adds noise without behavioral segmentation.', -5);
                  } else {
                    setStage3SegmentsFeedback('CORRECT! Top-tier cuts: New vs returning, Gold vs diamond, App vs web, and AOV tiers isolate whether the bleed is behavioral or product economics.');
                    applyStepResult('stage3_segments', true, 'Valid cuts', 'Superb analytical rigor. Segments tell the truth while macro averages hide it.', 10);
                  }
                }}
                disabled={stage3SegmentsSelected.length === 0}
                className="bg-[#188ab2] hover:bg-[#0f6f8f] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] cursor-pointer"
              >
                Validate Segment Cuts
              </button>
            </div>

            {stage3SegmentsSubmitted && (
              <div className={`p-3.5 rounded-xl border-2 text-xs font-semibold leading-relaxed ${
                stage3SegmentsFeedback.includes('CORRECT') ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]' : 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B]'
              }`}>
                {stage3SegmentsFeedback}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t-2 border-[#141413] flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveStageTab('tree')}
              className="bg-white hover:bg-slate-50 text-[#141413] px-4 py-2.5 rounded-xl border-2 border-[#141413] font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#141413] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Back to Stage 2: Metric Tree</span>
            </button>
            {isStageUnlocked(BLUESTONE_STAGES_SCHEDULE[3]) ? (
              <button
                type="button"
                onClick={() => setActiveStageTab('control')}
                className="bg-[#188ab2] hover:bg-[#0f6f8f] text-white px-5 py-2.5 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Advance to Stage 4: Controllability</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs font-mono font-bold text-slate-500 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Stage 4 unlocks on {BLUESTONE_STAGES_SCHEDULE[3].unlockDateLabel}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STAGE 4: CONTROLLABLE VS EXTERNAL (SORT 8 CARDS & SCENARIOS) ── */}
      {isCurrentStageUnlocked && (activeStageTab === 'control' || activeStageTab === 'category') && (
        <div className="bg-white border-2 sm:border-[3px] border-[#141413] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413]">
                STAGE 4 • CONTROLLABILITY & ACCOUNTABILITY
              </span>
              <span className="bg-[#DCFCE7] text-[#166534] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#166534]">
                UNLOCKED · DAY 4
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#141413] mt-2">
              Controllable, Influenceable & External Factors
            </h2>
            <p className="text-xs sm:text-sm text-[#141413]/70 font-semibold mt-1">
              Separate internal product levers from macro commodity price swings, assign cross-functional owners, and handle macro shocks.
            </p>
          </div>

          {/* ── STEP 1: 3-BUCKET CARD SORTER ────────────────────────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 1 of 2: 3-Bucket Sorter</span>
                <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                  Sort Each Factor by Level of Control
                </h3>
              </div>
              <button
                type="button"
                onClick={() => useHintForStep('stage4_sort')}
                disabled={hintsUsed['stage4_sort']}
                className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span>💡 Need a hint? (-3 pts)</span>
              </button>
            </div>

            {hintsUsed['stage4_sort'] && (
              <div className="bg-[#FEF3C7] border border-[#D97706] p-3 rounded-lg text-xs font-medium text-[#92400E]">
                <strong>Hint:</strong> Global gold spot prices and competitor sales are external market realities. Product teams control UX and discovery, and influence stock/supplier SLA through cross-functional partnerships.
              </div>
            )}

            <div className="space-y-3">
              {STAGE4_BUCKET_CARDS.map((card) => {
                const currentPick = stage4Buckets[card.id];
                return (
                  <div
                    key={card.id}
                    className="p-3.5 rounded-xl border-2 border-[#141413] bg-white shadow-[1.5px_1.5px_0px_0px_#141413] space-y-2.5"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-xs sm:text-sm text-[#141413]">{card.label}</span>
                      <span className="text-[10px] font-mono font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        Owner: {card.owner}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setStage4Buckets(prev => ({ ...prev, [card.id]: 'controllable' }))}
                        className={`p-2 rounded-lg border text-xs font-black uppercase transition-all cursor-pointer ${
                          currentPick === 'controllable'
                            ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46] shadow-[2px_2px_0px_0px_#065F46]'
                            : 'bg-[#F8FAFC] hover:bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        Controllable
                      </button>
                      <button
                        type="button"
                        onClick={() => setStage4Buckets(prev => ({ ...prev, [card.id]: 'influenceable' }))}
                        className={`p-2 rounded-lg border text-xs font-black uppercase transition-all cursor-pointer ${
                          currentPick === 'influenceable'
                            ? 'bg-[#FEF3C7] border-[#D97706] text-[#92400E] shadow-[2px_2px_0px_0px_#D97706]'
                            : 'bg-[#F8FAFC] hover:bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        Influenceable
                      </button>
                      <button
                        type="button"
                        onClick={() => setStage4Buckets(prev => ({ ...prev, [card.id]: 'uncontrollable' }))}
                        className={`p-2 rounded-lg border text-xs font-black uppercase transition-all cursor-pointer ${
                          currentPick === 'uncontrollable'
                            ? 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B] shadow-[2px_2px_0px_0px_#991B1B]'
                            : 'bg-[#F8FAFC] hover:bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        Uncontrollable
                      </button>
                    </div>

                    {stage4BucketsSubmitted && (
                      <div className="text-[11px] font-medium text-[#141413]/70 pt-1 border-t border-slate-100">
                        <strong>Insight:</strong> {card.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setStage4BucketsSubmitted(true);
                  let correctCount = 0;
                  STAGE4_BUCKET_CARDS.forEach(c => {
                    const pick = stage4Buckets[c.id];
                    if (pick === c.bucket || (c.acceptAlso && pick === c.acceptAlso)) {
                      correctCount++;
                    }
                  });
                  if (correctCount >= 7) {
                    applyStepResult('stage4_sort', true, 'Matrix verified', 'Strong structural awareness. A great PM never wastes engineering cycles fighting commodity prices.', 10);
                  } else {
                    applyStepResult('stage4_sort', false, 'Some misplaced buckets', 'Review the boundary between direct product levers and commercial/macro factors.', 0);
                  }
                }}
                disabled={Object.keys(stage4Buckets).length < STAGE4_BUCKET_CARDS.length}
                className="bg-[#188ab2] hover:bg-[#0f6f8f] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] cursor-pointer"
              >
                Validate Controllability Matrix
              </button>
            </div>
          </div>

          {/* ── STEP 2: SCENARIO: GOLD PRICES SPIKED ────────────────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 2 of 2: Executive Scenario</span>
              <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                Macro Shock: "Gold commodity prices spiked 20% in the quarter. Choose your action as Digital PM."
              </h3>
            </div>

            <div className="space-y-2.5">
              {STAGE4_SCENARIO_ACTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setStage4ScenarioChoice(opt.id);
                    setStage4ScenarioSubmitted(true);
                    setStage4ScenarioFeedback(opt.feedback);
                    if (opt.isCorrect) {
                      applyStepResult('stage4_scenario', true, opt.feedback, 'Spot on. Product collaborates across functions to adjust discoverability, lightweight assortments, and price pass-through.', opt.healthDelta);
                    } else {
                      applyStepResult('stage4_scenario', false, opt.feedback, 'A feature cannot fix a commodity price. Partner with commercial and merchandising.', opt.healthDelta);
                    }
                  }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    stage4ScenarioChoice === opt.id
                      ? opt.isCorrect
                        ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46] shadow-[2px_2px_0px_0px_#065F46]'
                        : 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B] shadow-[2px_2px_0px_0px_#991B1B]'
                      : 'bg-white border-[#141413] hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#141413] text-[#141413]'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm">{opt.label}</div>
                </button>
              ))}
            </div>

            {stage4ScenarioSubmitted && (
              <div className={`p-3.5 rounded-xl border-2 text-xs font-semibold leading-relaxed ${
                stage4ScenarioChoice === 'partner' ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]' : 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B]'
              }`}>
                <strong>{stage4ScenarioChoice === 'partner' ? '✓ Strategic Execution:' : '⚠ Misguided PM Reaction:'}</strong> {stage4ScenarioFeedback}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t-2 border-[#141413] flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveStageTab('journey')}
              className="bg-white hover:bg-slate-50 text-[#141413] px-4 py-2.5 rounded-xl border-2 border-[#141413] font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#141413] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Back to Stage 3: Customer Journey</span>
            </button>
            {isStageUnlocked(BLUESTONE_STAGES_SCHEDULE[4]) ? (
              <button
                type="button"
                onClick={() => setActiveStageTab('data_read')}
                className="bg-[#188ab2] hover:bg-[#0f6f8f] text-white px-5 py-2.5 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Advance to Stage 5: Data & First Read</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs font-mono font-bold text-slate-500 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Stage 5 unlocks on {BLUESTONE_STAGES_SCHEDULE[4].unlockDateLabel}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STAGE 5: DATA AND FIRST READ (REQUEST, AUDIT, NEXT CUT) ───────── */}
      {isCurrentStageUnlocked && activeStageTab === 'data_read' && (
        <div className="bg-white border-2 sm:border-[3px] border-[#141413] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413]">
                STAGE 5 • DATA REQUEST & AUDIT
              </span>
              <span className="bg-[#DCFCE7] text-[#166534] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#166534]">
                UNLOCKED · DAY 5
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#141413] mt-2">
              Build the Data Request & First Read Audit
            </h2>
            <p className="text-xs sm:text-sm text-[#141413]/70 font-semibold mt-1">
              Select the 5 essential diagnostic data packages, audit top-line metrics against deceptive assumptions, and pick the next analytical cut.
            </p>
          </div>

          {/* ── STEP 1: PICK 5 OF 8 DATA REQUESTS ────────────────────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 1 of 3: Formulate Data Request</span>
                <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                  Pick the 5 Essential Data Packages (Selected: {stage5DataPicks.length}/5)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => useHintForStep('stage5_req')}
                disabled={hintsUsed['stage5_req']}
                className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span>💡 Need a hint? (-3 pts)</span>
              </button>
            </div>

            {hintsUsed['stage5_req'] && (
              <div className="bg-[#FEF3C7] border border-[#D97706] p-3 rounded-lg text-xs font-medium text-[#92400E]">
                <strong>Hint:</strong> Diagnostic RCA requires comparative metrics across the entire funnel and product economics (COGS, margins). Avoid single totals, PII, or single-channel subsets.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STAGE5_DATA_REQUEST_CARDS.map((card) => {
                const isSelected = stage5DataPicks.includes(card.id);
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      if (stage5DataSubmitted) return;
                      setStage5DataPicks(prev =>
                        prev.includes(card.id) ? prev.filter(x => x !== card.id) : prev.length < 5 ? [...prev, card.id] : prev
                      );
                    }}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#E0F2FE] border-[#0284C7] shadow-[2px_2px_0px_0px_#0284C7]'
                        : 'bg-white border-[#141413] hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#141413]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#0284C7] border-[#0284C7] text-white' : 'border-[#141413] bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold text-[#141413]">{card.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const selectedCards = STAGE5_DATA_REQUEST_CARDS.filter(c => stage5DataPicks.includes(c.id));
                  const pickedTrap = selectedCards.find(c => !c.isCorrect);

                  setStage5DataSubmitted(true);
                  if (pickedTrap) {
                    setStage5DataFeedback(pickedTrap.feedback || 'You need two comparative periods, segment cuts, and margin data, not just aggregated totals or PII.');
                    applyStepResult('stage5_req', false, 'Trap selected', 'You need two comparative periods, segment cuts, and margin data, not just totals.', -10);
                  } else if (stage5DataPicks.length === 5) {
                    setStage5DataFeedback('CORRECT! All 5 essential data cuts requested: Acquisition, Discovery, Conversion, Behaviour, and Product Economics.');
                    applyStepResult('stage5_req', true, 'Valid 5 packages', 'Disciplined data request. You demanded both operational funnel metrics and product unit economics.', 10);
                  } else {
                    setStage5DataFeedback('Please select exactly 5 data packages.');
                  }
                }}
                disabled={stage5DataPicks.length !== 5}
                className="bg-[#188ab2] hover:bg-[#0f6f8f] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] cursor-pointer"
              >
                Submit Data Request (5 Selected)
              </button>
            </div>

            {stage5DataSubmitted && (
              <div className={`p-3.5 rounded-xl border-2 text-xs font-semibold leading-relaxed ${
                stage5DataFeedback.includes('CORRECT') ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]' : 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B]'
              }`}>
                {stage5DataFeedback}
              </div>
            )}
          </div>

          {/* ── STEP 2: STAGE 5 TABLE & TRUE/FALSE AUDIT ─────────────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 2 of 3: First Read Data Audit</span>
              <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                Baseline Performance Metrics (Previous vs Current Year)
              </h3>
            </div>

            {/* Stage 5 Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border-2 border-[#141413] bg-white">
                <thead>
                  <tr className="bg-[#141413] text-white font-mono uppercase text-[10px]">
                    <th className="p-3 border border-[#141413]">Metric</th>
                    <th className="p-3 border border-[#141413]">Previous Year</th>
                    <th className="p-3 border border-[#141413]">Current Year</th>
                    <th className="p-3 border border-[#141413]">Change</th>
                    <th className="p-3 border border-[#141413]">First Read PM Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]">
                  <tr>
                    <td className="p-3 font-bold">1. Sessions (Traffic)</td>
                    <td className="p-3 font-mono">{BLUESTONE_CASE_DATA.stage5.sessions.prev.toLocaleString()}</td>
                    <td className="p-3 font-mono font-black text-[#059669]">{BLUESTONE_CASE_DATA.stage5.sessions.curr.toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-[#059669]">+10.0%</td>
                    <td className="p-3 text-slate-600">Acquisition expanded top-of-funnel traffic</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">2. Conversion Rate (Orders / Sessions)</td>
                    <td className="p-3 font-mono">{(BLUESTONE_CASE_DATA.stage5.conversion.prev * 100).toFixed(1)}%</td>
                    <td className="p-3 font-mono font-black text-[#DC2626]">{(BLUESTONE_CASE_DATA.stage5.conversion.curr * 100).toFixed(1)}%</td>
                    <td className="p-3 font-mono font-bold text-[#DC2626]">-5.0% (rel)</td>
                    <td className="p-3 text-slate-600">Slight dip, but orders still grew because sessions grew +10%</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">3. Total Orders</td>
                    <td className="p-3 font-mono">{BLUESTONE_CASE_DATA.stage5.orders.prev.toLocaleString()}</td>
                    <td className="p-3 font-mono font-black text-[#059669]">{BLUESTONE_CASE_DATA.stage5.orders.curr.toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-[#059669]">+4.5%</td>
                    <td className="p-3 text-slate-600">Orders increased from 20,000 to 20,900</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">4. Average Order Value (AOV)</td>
                    <td className="p-3 font-mono">₹{BLUESTONE_CASE_DATA.stage5.aov.prev.toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-[#059669]">₹{BLUESTONE_CASE_DATA.stage5.aov.curr.toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-[#059669]">+0.48%</td>
                    <td className="p-3 text-slate-600">AOV stable/slight increase; says nothing about margin</td>
                  </tr>
                  <tr className="bg-[#FFFDF5]">
                    <td className="p-3 font-bold">5. Total Revenue</td>
                    <td className="p-3 font-mono">₹{BLUESTONE_CASE_DATA.stage5.revenueCr.prev} Cr</td>
                    <td className="p-3 font-mono font-black text-[#059669]">₹{BLUESTONE_CASE_DATA.stage5.revenueCr.curr} Cr</td>
                    <td className="p-3 font-mono font-bold text-[#059669]">+5.0%</td>
                    <td className="p-3 text-[#059669] font-bold">Top line expanded by ₹5 Cr</td>
                  </tr>
                  <tr className="bg-[#FEE2E2]/30">
                    <td className="p-3 font-black text-[#991B1B]">6. Gross Profit</td>
                    <td className="p-3 font-mono">₹{BLUESTONE_CASE_DATA.stage5.gpCr.prev.toFixed(1)} Cr</td>
                    <td className="p-3 font-mono font-black text-[#DC2626]">₹{BLUESTONE_CASE_DATA.stage5.gpCr.curr.toFixed(1)} Cr</td>
                    <td className="p-3 font-mono font-bold text-[#DC2626]">-14.5% (~ -15%)</td>
                    <td className="p-3 text-[#DC2626] font-bold">Critical bleed: ₹2.9 Cr gross profit disappeared</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* True/False Audit Questions */}
            <div className="space-y-3 pt-3">
              <h4 className="font-mono text-xs font-black uppercase text-[#141413]">
                Audit the Metrics: True or False?
              </h4>

              {STAGE5_TRUE_FALSE_QUESTIONS.map((q) => {
                const answer = stage5TfAnswers[q.id];
                const hasAnswered = answer !== undefined;
                const isCorrect = hasAnswered && answer === q.expected;

                return (
                  <div key={q.id} className="p-3.5 rounded-xl border border-[#141413] bg-white space-y-2">
                    <div className="font-bold text-xs sm:text-sm text-[#141413]">"{q.statement}"</div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setStage5TfAnswers(prev => ({ ...prev, [q.id]: true }))}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-black uppercase transition-all cursor-pointer ${
                          answer === true
                            ? 'bg-[#188ab2] border-[#188ab2] text-white'
                            : 'bg-[#F8FAFC] hover:bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        True
                      </button>
                      <button
                        type="button"
                        onClick={() => setStage5TfAnswers(prev => ({ ...prev, [q.id]: false }))}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-black uppercase transition-all cursor-pointer ${
                          answer === false
                            ? 'bg-[#188ab2] border-[#188ab2] text-white'
                            : 'bg-[#F8FAFC] hover:bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        False
                      </button>
                    </div>

                    {hasAnswered && (
                      <div className={`p-2.5 rounded-lg border text-xs font-medium leading-relaxed ${
                        isCorrect ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]' : 'bg-[#FEF3C7] border-[#D97706] text-[#92400E]'
                      }`}>
                        <strong>{isCorrect ? '✓ Correct:' : '⚠ Diagnostic Review:'}</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── STEP 3: PICK THE NEXT ANALYTICAL CUT ────────────────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 3 of 3: Next Analytical Cut</span>
              <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                Where should you cut the data next?
              </h3>
            </div>

            <div className="space-y-2.5">
              {STAGE5_NEXT_CUT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setStage5NextCutChoice(opt.id);
                    setStage5NextCutSubmitted(true);
                    setStage5NextCutFeedback(opt.feedback || '');
                    if (opt.isMarginTrap) {
                      applyStepResult('stage5_next_cut', false, opt.feedback || '', 'Never pump marketing spend into a leaking, margin-depressed funnel.', -15);
                    } else {
                      applyStepResult('stage5_next_cut', true, 'Valid diagnostic cut', 'Spot on. Let us pinpoint the exact drop-off in the funnel and decompose category margins.', 10);
                    }
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    stage5NextCutChoice === opt.id
                      ? opt.isMarginTrap
                        ? 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B] shadow-[2px_2px_0px_0px_#991B1B]'
                        : 'bg-[#D1FAE5] border-[#065F46] text-[#065F46] shadow-[2px_2px_0px_0px_#065F46]'
                      : 'bg-white border-[#141413] hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#141413] text-[#141413]'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm">{opt.label}</div>
                </button>
              ))}
            </div>

            {stage5NextCutSubmitted && (
              <div className={`p-3.5 rounded-xl border-2 text-xs font-semibold leading-relaxed ${
                stage5NextCutChoice === 'marketing_spend' ? 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B]' : 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]'
              }`}>
                {stage5NextCutChoice === 'marketing_spend' ? (
                  <span><strong>⚠ MARGIN TRAP!</strong> {stage5NextCutFeedback}</span>
                ) : (
                  <span><strong>✓ Correct Diagnostic Step:</strong> Excellent choice. We will decompose the full funnel in Stage 6 and category margins in Stage 7.</span>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t-2 border-[#141413] flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveStageTab('control')}
              className="bg-white hover:bg-slate-50 text-[#141413] px-4 py-2.5 rounded-xl border-2 border-[#141413] font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#141413] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Back to Stage 4: Controllability</span>
            </button>
            {isStageUnlocked(BLUESTONE_STAGES_SCHEDULE[5]) ? (
              <button
                type="button"
                onClick={() => setActiveStageTab('leak')}
                className="bg-[#188ab2] hover:bg-[#0f6f8f] text-white px-5 py-2.5 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Advance to Stage 6: Find the Leak</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs font-mono font-bold text-slate-500 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Stage 6 unlocks on {BLUESTONE_STAGES_SCHEDULE[5].unlockDateLabel}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STAGE 6: FIND THE LEAK (FUNNEL TABLE, INTERVENTION METERS, GATE) ── */}
      {isCurrentStageUnlocked && (activeStageTab === 'leak' || activeStageTab === 'prioritize') && (
        <div className="bg-white border-2 sm:border-[3px] border-[#141413] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413]">
                STAGE 6 • FUNNEL DIAGNOSTICS & SIMULATOR
              </span>
              <span className="bg-[#DCFCE7] text-[#166534] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#166534]">
                UNLOCKED · DAY 6
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#141413] mt-2">
              Find the Leak & Simulate Product Interventions
            </h2>
            <p className="text-xs sm:text-sm text-[#141413]/70 font-semibold mt-1">
              Click the exact drop-off stage in the reconciled funnel, simulate dual Conversion & Margin trade-offs, and check pre-redesign root causes.
            </p>
          </div>

          {/* ── STEP 1: INTERACTIVE FUNNEL TABLE: CLICK THE LEAK ────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 1 of 3: Locate the Leak</span>
                <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                  Click the stage with the biggest relative leak:
                </h3>
              </div>
              <button
                type="button"
                onClick={() => useHintForStep('stage6_leak')}
                disabled={hintsUsed['stage6_leak']}
                className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span>💡 Need a hint? (-3 pts)</span>
              </button>
            </div>

            {hintsUsed['stage6_leak'] && (
              <div className="bg-[#FEF3C7] border border-[#D97706] p-3 rounded-lg text-xs font-medium text-[#92400E]">
                <strong>Hint:</strong> Calculate relative drop ((Curr - Prev) / Prev), not just absolute percentage points. Also verify whether payment completion actually dropped or improved!
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border-2 border-[#141413] bg-white">
                <thead>
                  <tr className="bg-[#141413] text-white font-mono uppercase text-[10px]">
                    <th className="p-3 border border-[#141413]">Funnel Stage</th>
                    <th className="p-3 border border-[#141413]">Previous Year</th>
                    <th className="p-3 border border-[#141413]">Current Year</th>
                    <th className="p-3 border border-[#141413]">Relative Delta</th>
                    <th className="p-3 border border-[#141413]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]">
                  {STAGE6_FUNNEL_STAGES.map((row) => {
                    const isSelected = stage6ClickedStageId === row.id;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => {
                          setStage6ClickedStageId(row.id);
                          setStage6LeakSubmitted(true);
                          setStage6LeakFeedback(row.feedback);
                          if (row.isBiggestLeak) {
                            setStage6LeakIsCorrect(true);
                            applyStepResult('stage6_leak', true, row.feedback, 'Accurate diagnosis. The biggest relative leak is at Add-to-Cart (-8.3%), not checkout.', 10);
                          } else if (row.id === 'payment') {
                            setStage6LeakIsCorrect(false);
                            applyStepResult('stage6_leak', false, row.feedback, 'Never assume payment failure is the culprit without checking the conversion delta. It actually rose 6.7%!', -10);
                          } else {
                            setStage6LeakIsCorrect(false);
                            applyStepResult('stage6_leak', false, row.feedback, 'Check the relative drop percentage carefully.', 0);
                          }
                        }}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? row.isBiggestLeak
                              ? 'bg-[#D1FAE5]/60 font-bold'
                              : 'bg-[#FEE2E2]/60 font-bold'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3 font-bold flex items-center gap-2">
                          <span>{row.name}</span>
                          {isSelected && (
                            row.isBiggestLeak
                              ? <span className="text-[10px] bg-[#059669] text-white px-1.5 py-0.2 rounded font-black">LARGEST LEAK</span>
                              : <span className="text-[10px] bg-[#DC2626] text-white px-1.5 py-0.2 rounded font-black">INCORRECT PICK</span>
                          )}
                        </td>
                        <td className="p-3 font-mono">{row.prev}</td>
                        <td className="p-3 font-mono font-bold">{row.curr}</td>
                        <td className={`p-3 font-mono font-bold ${
                          row.delta.startsWith('+') ? 'text-[#059669]' : 'text-[#DC2626]'
                        }`}>{row.delta}</td>
                        <td className="p-3">
                          <button
                            type="button"
                            className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border ${
                              isSelected ? 'bg-[#141413] text-white border-[#141413]' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Click to Diagnose'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {stage6LeakSubmitted && (
              <div className={`p-3.5 rounded-xl border-2 text-xs font-semibold leading-relaxed ${
                stage6LeakIsCorrect ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]' : 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B]'
              }`}>
                <strong>{stage6LeakIsCorrect ? '✓ Verified Finding:' : '⚠ Diagnostic Review:'}</strong> {stage6LeakFeedback}
              </div>
            )}
          </div>

          {/* ── STEP 2: INTERVENTION SIMULATOR WITH METERS ──────────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 2 of 3: Intervention Trade-offs</span>
              <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                Scenario: Gold prices rose. Users view products but do not add to cart.
              </h3>
              <p className="text-xs text-[#141413]/70 font-semibold mt-1">
                Choose an intervention. Watch the visual meters for Conversion vs Gross Margin:
              </p>
            </div>

            <div className="space-y-3">
              {STAGE6_INTERVENTION_SCENARIOS.map((scenario) => {
                const isSelected = stage6ScenarioChoice === scenario.id;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => {
                      setStage6ScenarioChoice(scenario.id);
                      setStage6ScenarioSubmitted(true);
                      setStage6ScenarioFeedback(scenario.feedback);
                      if (scenario.isCorrect) {
                        applyStepResult('stage6_scenario', true, scenario.feedback, 'Superb. You solved buyer price hesitation without destroying gross margin.', scenario.healthDelta);
                      } else {
                        applyStepResult('stage6_scenario', false, scenario.feedback, 'Beware of margin traps that win conversion metrics but lose the company profit.', scenario.healthDelta);
                      }
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? scenario.isCorrect
                          ? 'bg-[#D1FAE5] border-[#065F46] shadow-[2px_2px_0px_0px_#065F46]'
                          : 'bg-[#FEE2E2] border-[#991B1B] shadow-[2px_2px_0px_0px_#991B1B]'
                        : 'bg-white border-[#141413] hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#141413]'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm text-[#141413]">{scenario.title}</div>

                    {/* Dual Meters: Conversion and Margin */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-[#FFFDF5] border border-[#141413]/30 p-2 rounded-lg">
                        <div className="text-[10px] font-mono font-black uppercase text-[#141413]/70 flex items-center justify-between">
                          <span>Conversion Meter</span>
                          <span className={scenario.convMeter > 0 ? 'text-[#059669]' : scenario.convMeter < 0 ? 'text-[#DC2626]' : 'text-slate-600'}>
                            {scenario.convMeter > 0 ? `+${scenario.convMeter}` : scenario.convMeter}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          {[-3, -2, -1, 1, 2, 3].map((val) => (
                            <div
                              key={val}
                              className={`h-2 flex-1 rounded-sm ${
                                (scenario.convMeter > 0 && val > 0 && val <= scenario.convMeter)
                                  ? 'bg-[#059669]'
                                  : (scenario.convMeter < 0 && val < 0 && val >= scenario.convMeter)
                                  ? 'bg-[#DC2626]'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#FFFDF5] border border-[#141413]/30 p-2 rounded-lg">
                        <div className="text-[10px] font-mono font-black uppercase text-[#141413]/70 flex items-center justify-between">
                          <span>Gross Margin Meter</span>
                          <span className={scenario.marginMeter > 0 ? 'text-[#059669]' : scenario.marginMeter < 0 ? 'text-[#DC2626]' : 'text-slate-600'}>
                            {scenario.marginMeter > 0 ? `+${scenario.marginMeter}` : scenario.marginMeter}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          {[-3, -2, -1, 1, 2, 3].map((val) => (
                            <div
                              key={val}
                              className={`h-2 flex-1 rounded-sm ${
                                (scenario.marginMeter > 0 && val > 0 && val <= scenario.marginMeter)
                                  ? 'bg-[#059669]'
                                  : (scenario.marginMeter < 0 && val < 0 && val >= scenario.marginMeter)
                                  ? 'bg-[#DC2626]'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {stage6ScenarioSubmitted && (
              <div className={`p-3.5 rounded-xl border-2 text-xs font-semibold leading-relaxed ${
                stage6ScenarioChoice === 'transparency' ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]' : 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B]'
              }`}>
                {stage6ScenarioFeedback}
              </div>
            )}
          </div>

          {/* ── STEP 3: PRE-REDESIGN GATE (PICK 3 CAUSES) ──────────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 3 of 3: Diagnostic Pre-requisite Gate</span>
              <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                Pick 3 Root Causes to Audit Before Redesigning Anything:
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STAGE6_GATE_CAUSES.map((cause) => {
                const isSelected = stage6GateChoices.includes(cause.id);
                return (
                  <button
                    key={cause.id}
                    type="button"
                    onClick={() => {
                      if (stage6GateSubmitted) return;
                      setStage6GateChoices(prev =>
                        prev.includes(cause.id) ? prev.filter(x => x !== cause.id) : prev.length < 3 ? [...prev, cause.id] : prev
                      );
                    }}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#E0F2FE] border-[#0284C7] shadow-[2px_2px_0px_0px_#0284C7]'
                        : 'bg-white border-[#141413] hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#141413]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#0284C7] border-[#0284C7] text-white' : 'border-[#141413] bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold text-[#141413]">{cause.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setStage6GateSubmitted(true);
                  if (stage6GateChoices.includes('payment_failures')) {
                    setStage6GateFeedback('Worth monitoring, but payment completion actually improved (+6.7%, from 47.6% to 50.8%). It is not where the loss is.');
                    applyStepResult('stage6_gate', false, 'Payment trap chosen', 'Payment completion actually rose +6.7%. Do not blame the usual suspect without data.', -5);
                  } else {
                    setStage6GateFeedback('CORRECT! Pricing transparency, product specs, and delivery charges explain buyer hesitation at Add-to-Cart without wasting engineering cycles on unnecessary redesigns.');
                    applyStepResult('stage6_gate', true, 'Valid causes', 'P0 focus locked: Fix add-to-cart price friction and transparency before considering redesigns.', 10);
                  }
                }}
                disabled={stage6GateChoices.length !== 3}
                className="bg-[#188ab2] hover:bg-[#0f6f8f] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] cursor-pointer"
              >
                Validate Root Causes (3 Selected)
              </button>
            </div>

            {stage6GateSubmitted && (
              <div className={`p-3.5 rounded-xl border-2 text-xs font-semibold leading-relaxed ${
                stage6GateChoices.includes('payment_failures') ? 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B]' : 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]'
              }`}>
                {stage6GateFeedback}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t-2 border-[#141413] flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveStageTab('data_read')}
              className="bg-white hover:bg-slate-50 text-[#141413] px-4 py-2.5 rounded-xl border-2 border-[#141413] font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#141413] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Back to Stage 5: Data & First Read</span>
            </button>
            {isStageUnlocked(BLUESTONE_STAGES_SCHEDULE[6]) ? (
              <button
                type="button"
                onClick={() => setActiveStageTab('bridge')}
                className="bg-[#188ab2] hover:bg-[#0f6f8f] text-white px-5 py-2.5 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#141413] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Advance to Stage 7: Profit Bridge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs font-mono font-bold text-slate-500 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Stage 7 unlocks on {BLUESTONE_STAGES_SCHEDULE[6].unlockDateLabel}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STAGE 7: PROFIT BRIDGE & EXECUTIVE SYNTHESIS ────────────────── */}
      {isCurrentStageUnlocked && (activeStageTab === 'bridge' || activeStageTab === 'pitch') && (
        <div className="bg-white border-2 sm:border-[3px] border-[#141413] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413]">
                STAGE 7 • PROFIT BRIDGE & EXECUTIVE SYNTHESIS
              </span>
              <span className="bg-[#DCFCE7] text-[#166534] font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#166534]">
                FINAL STAGE · DAY 7
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#141413] mt-2">
              The Category Profit Bridge & Executive Pitch
            </h2>
            <p className="text-xs sm:text-sm text-[#141413]/70 font-semibold mt-1">
              Decompose category unit economics into Volume and Margin effects, avoid false commercial solutions, and review the final PM scorecard.
            </p>
          </div>

          {/* ── STEP 1: PREDICT BEFORE REVEAL ───────────────────────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 1 of 4: Predict First</span>
              <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                Total Revenue grew +5% (₹100 Cr → ₹105 Cr). Which category's gross profit fell the most?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setStage7CategoryPrediction('gold');
                  setStage7PredictionSubmitted(true);
                  setStage7PredictionFeedback('CORRECT! Gold revenue rose from ₹60 Cr to ₹75 Cr, but Gold margin collapsed from 22% to 14%, losing ₹2.70 Cr of gross profit (93% of the total company loss).');
                  applyStepResult('stage7_predict', true, 'Correct prediction', 'Spot on. Revenue growth in Gold masked a catastrophic unit margin collapse.', 10);
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  stage7CategoryPrediction === 'gold'
                    ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46] shadow-[2px_2px_0px_0px_#065F46]'
                    : 'bg-white border-[#141413] hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#141413]'
                }`}
              >
                <div className="font-black text-sm text-[#141413]">Gold Jewellery Category</div>
                <div className="text-xs text-[#141413]/70 mt-1 font-medium">Revenue rose +25% (₹60 Cr → ₹75 Cr)</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStage7CategoryPrediction('diamond');
                  setStage7PredictionSubmitted(true);
                  setStage7PredictionFeedback('Diamond revenue fell from ₹40 Cr to ₹30 Cr (-25%), but Diamond gross margin expanded from 17% to 22%. Diamond gross profit only fell by ₹0.20 Cr.');
                  applyStepResult('stage7_predict', false, 'Diamond chosen', 'Diamond volume fell, but margin expansion cushioned the profit impact. Gold took the hit.', -5);
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  stage7CategoryPrediction === 'diamond'
                    ? 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B] shadow-[2px_2px_0px_0px_#991B1B]'
                    : 'bg-white border-[#141413] hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#141413]'
                }`}
              >
                <div className="font-black text-sm text-[#141413]">Diamond Jewellery Category</div>
                <div className="text-xs text-[#141413]/70 mt-1 font-medium">Revenue dropped -25% (₹40 Cr → ₹30 Cr)</div>
              </button>
            </div>

            {stage7PredictionSubmitted && (
              <div className={`p-3.5 rounded-xl border-2 text-xs font-semibold leading-relaxed ${
                stage7CategoryPrediction === 'gold' ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]' : 'bg-[#FEF3C7] border-[#D97706] text-[#92400E]'
              }`}>
                {stage7PredictionFeedback}
              </div>
            )}
          </div>

          {/* ── STEP 2: CATEGORY ECONOMICS CALCULATION TABLE ─────────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 2 of 4: Unit Economics Breakdown</span>
              <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                Category Economics: Revenue, Gross Margin & Profit
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border-2 border-[#141413] bg-white">
                <thead>
                  <tr className="bg-[#141413] text-white font-mono uppercase text-[10px]">
                    <th className="p-3 border border-[#141413]">Category</th>
                    <th className="p-3 border border-[#141413]">Prev Revenue</th>
                    <th className="p-3 border border-[#141413]">Curr Revenue</th>
                    <th className="p-3 border border-[#141413]">Prev Margin</th>
                    <th className="p-3 border border-[#141413]">Curr Margin</th>
                    <th className="p-3 border border-[#141413]">Prev GP</th>
                    <th className="p-3 border border-[#141413]">Curr GP</th>
                    <th className="p-3 border border-[#141413]">GP Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]">
                  <tr className="bg-[#FEE2E2]/20">
                    <td className="p-3 font-black text-[#991B1B]">Gold Jewellery</td>
                    <td className="p-3 font-mono">₹60.0 Cr</td>
                    <td className="p-3 font-mono font-bold text-[#059669]">₹75.0 Cr (+25%)</td>
                    <td className="p-3 font-mono">22.0%</td>
                    <td className="p-3 font-mono font-black text-[#DC2626]">14.0% (-8.0% pts)</td>
                    <td className="p-3 font-mono">₹13.20 Cr</td>
                    <td className="p-3 font-mono font-black text-[#DC2626]">₹10.50 Cr</td>
                    <td className="p-3 font-mono font-black text-[#DC2626]">-₹2.70 Cr (93% of loss)</td>
                  </tr>
                  <tr className="bg-[#D1FAE5]/20">
                    <td className="p-3 font-black text-[#065F46]">Diamond Jewellery</td>
                    <td className="p-3 font-mono">₹40.0 Cr</td>
                    <td className="p-3 font-mono font-bold text-[#DC2626]">₹30.0 Cr (-25%)</td>
                    <td className="p-3 font-mono">17.0%</td>
                    <td className="p-3 font-mono font-black text-[#059669]">22.0% (+5.0% pts)</td>
                    <td className="p-3 font-mono">₹6.80 Cr</td>
                    <td className="p-3 font-mono font-bold">₹6.60 Cr</td>
                    <td className="p-3 font-mono font-bold text-amber-700">-₹0.20 Cr (cushioned)</td>
                  </tr>
                  <tr className="bg-[#141413] text-white font-bold">
                    <td className="p-3 uppercase font-mono">Total Company</td>
                    <td className="p-3 font-mono">₹100.0 Cr</td>
                    <td className="p-3 font-mono text-[#FEF08A]">₹105.0 Cr (+5.0%)</td>
                    <td className="p-3 font-mono">20.0%</td>
                    <td className="p-3 font-mono text-[#F87171]">16.3% (-3.7% pts)</td>
                    <td className="p-3 font-mono">₹20.00 Cr</td>
                    <td className="p-3 font-mono text-[#F87171]">₹17.10 Cr</td>
                    <td className="p-3 font-mono text-[#F87171]">-₹2.90 Cr (-14.5%)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#FFFDF5] border border-[#141413] p-3 rounded-lg text-xs font-semibold text-[#141413]">
              <strong>Critical Share Shift:</strong> Gold's share of company revenue surged from <strong>60%</strong> to <strong>71.4%</strong> (₹75 Cr / ₹105 Cr). The company sold significantly more volume of a product category whose gross margin cratered.
            </div>
          </div>

          {/* ── STEP 3: PROFIT BRIDGE WATERFALL ─────────────────────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 3 of 4: Waterfall Decomposition</span>
              <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                The BlueStone Gross Profit Bridge (₹20.00 Cr → ₹17.10 Cr)
              </h3>
            </div>

            <div className="space-y-3">
              {STAGE7_PROFIT_BRIDGE.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border-2 flex items-center justify-between flex-wrap gap-2 ${
                    item.isCriticalRootCause
                      ? 'bg-[#FEE2E2] border-[#991B1B] shadow-[2px_2px_0px_0px_#991B1B]'
                      : item.isPositive
                      ? 'bg-[#D1FAE5]/60 border-[#065F46]'
                      : 'bg-[#FFFDF5] border-[#141413]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs sm:text-sm text-[#141413]">{item.component}</span>
                      {item.isCriticalRootCause && (
                        <span className="bg-[#991B1B] text-white font-mono text-[9px] font-black uppercase px-2 py-0.2 rounded">
                          CRITICAL ROOT CAUSE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-[#141413]/70 font-semibold mt-0.5">{item.formula}</div>
                    <div className="text-[11px] text-[#141413]/80 font-medium mt-0.5">{item.note}</div>
                  </div>
                  <div className={`text-base sm:text-lg font-black font-mono shrink-0 ${
                    item.impactCr > 0 ? 'text-[#065F46]' : 'text-[#991B1B]'
                  }`}>
                    {item.impactCr > 0 ? `+₹${item.impactCr.toFixed(2)} Cr` : `-₹${Math.abs(item.impactCr).toFixed(2)} Cr`}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#FEF08A] border-2 border-[#141413] p-4 rounded-xl shadow-[2px_2px_0px_0px_#141413]">
              <div className="font-mono text-xs font-black uppercase text-[#141413] flex items-center gap-1.5 mb-1">
                <span>🎯</span>
                <span>Executive Bridge Takeaway:</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#141413] leading-relaxed">
                "Gold's margin drop (-₹6.00 Cr), not weak sales, is the main cause. Volume grew profitably (+₹3.30 Cr), but commodity inflation and inadequate making charge pass-through destroyed ₹6.00 Cr."
              </p>
            </div>
          </div>

          {/* ── STEP 4: TRAP QUESTION ON DIAMOND PROMOTIONS ─────────── */}
          <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#141413] space-y-4">
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#188ab2]">Step 4 of 4: Strategic Direction</span>
              <h3 className="font-black text-sm sm:text-base text-[#141413] mt-0.5">
                Trap Question: "Would you simply run heavy diamond promotions to fix Gross Profit?"
              </h3>
            </div>

            <div className="space-y-2.5">
              {STAGE7_TRAP_SOLUTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setStage7TrapChoice(opt.id);
                    setStage7TrapSubmitted(true);
                    setStage7TrapFeedback(opt.feedback);
                    if (opt.isCorrect) {
                      applyStepResult('stage7_trap', true, opt.feedback, 'Executive level synthesis. You connected product UX with unit economics and gross profit.', opt.healthDelta);
                    } else {
                      applyStepResult('stage7_trap', false, opt.feedback, 'Promotions degrade unit margins and fail to address the underlying macro problem.', opt.healthDelta);
                    }
                  }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    stage7TrapChoice === opt.id
                      ? opt.isCorrect
                        ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46] shadow-[2px_2px_0px_0px_#065F46]'
                        : 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B] shadow-[2px_2px_0px_0px_#991B1B]'
                      : 'bg-white border-[#141413] hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#141413] text-[#141413]'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm">{opt.label}</div>
                </button>
              ))}
            </div>

            {stage7TrapSubmitted && (
              <div className={`p-3.5 rounded-xl border-2 text-xs font-semibold leading-relaxed ${
                stage7TrapChoice === 'root_cause_discovery' ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]' : 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B]'
              }`}>
                {stage7TrapFeedback}
              </div>
            )}
          </div>

          {/* ── STEP 5 / END SCREEN: FINAL EVALUATION & PM ROADMAP ───── */}
          <div className="border-[3px] border-[#141413] rounded-2xl p-6 bg-gradient-to-b from-[#FFFDF5] to-white shadow-[4px_4px_0px_0px_#141413] space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-3 py-1 rounded-full border border-[#141413]">
                  🎓 CASE COMPLETION & EVALUATION
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#141413] mt-2">
                  Candidate Final Scorecard & PM Roadmap
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase font-black text-slate-500">Total Score</div>
                  <div className="text-2xl font-black text-[#188ab2]">{learnerScore} PTS</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase font-black text-slate-500">Case Health</div>
                  <div className={`text-2xl font-black ${
                    caseHealth >= 65 ? 'text-[#059669]' : caseHealth >= 40 ? 'text-[#F59E0B]' : 'text-[#DC2626]'
                  }`}>{caseHealth}/100</div>
                </div>
              </div>
            </div>

            {/* Performance Tier Rating */}
            <div className="p-4 rounded-xl border-2 border-[#141413] bg-[#FEF08A]/40 flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="text-[10px] font-mono font-black uppercase text-[#141413]/70">Performance Benchmark</div>
                <div className="text-sm sm:text-base font-black text-[#141413]">
                  {learnerScore >= 70 && caseHealth >= 65
                    ? '🏆 Executive PM / Director Standard (Flawless Commercial Acumen)'
                    : learnerScore >= 45
                    ? '🎖️ Senior PM Standard (Solid Diagnosis, Watch Margin Traps)'
                    : '💡 Associate PM Track (Revisit Unit Economics & MECE Trees)'}
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-white border border-[#141413] px-3 py-1 rounded-full shadow-[1px_1px_0px_0px_#141413]">
                PM-X Handout Certified
              </span>
            </div>

            {/* The 4 Executive Rules of Product RCA */}
            <div className="border-2 border-[#141413] rounded-xl p-5 bg-white space-y-3">
              <h4 className="font-mono text-xs font-black uppercase text-[#141413]">
                The 4 Golden Rules of Product RCA:
              </h4>
              <ul className="text-xs sm:text-sm font-semibold space-y-2 text-[#141413]">
                <li className="flex items-start gap-2">
                  <span className="text-[#059669] font-black">1.</span>
                  <span><strong>Do not assume a conversion problem because profit fell.</strong> Revenue grew +5% and orders grew +4.5%; the profit collapse was driven by unit margin erosion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#059669] font-black">2.</span>
                  <span><strong>Segments tell the truth, averages hide it.</strong> The total company looked like a mild dip (-14.5%), but Gold alone lost ₹2.70 Cr while Diamond held its profit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#059669] font-black">3.</span>
                  <span><strong>Do not assume the usual suspect; read the data.</strong> Payment completion actually improved from 47.6% to 50.8%. Checkout was not the leak.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#059669] font-black">4.</span>
                  <span><strong>Optimise profitable transactions, not isolated vanity metrics.</strong> Slashing prices or pumping marketing ad spend accelerates gross profit bleed.</span>
                </li>
              </ul>
            </div>

            {/* Actionable Roadmap */}
            <div className="border-2 border-[#141413] rounded-xl p-5 bg-[#FFFDF5] space-y-3">
              <h4 className="font-mono text-xs font-black uppercase text-[#141413]">
                Prioritised Action Plan for BlueStone Leadership:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg border-2 border-[#141413] bg-[#D1FAE5]/50">
                  <div className="font-mono text-[10px] font-black uppercase text-[#065F46] mb-1">P0 • Immediate Sprint</div>
                  <div className="text-xs font-bold text-[#141413]">Fix Add-to-Cart Friction</div>
                  <p className="text-[11px] text-[#141413]/75 font-medium mt-1">
                    Display BIS hallmarking, exact gold weight, making charge breakup, and insured shipping details directly on PDP.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border-2 border-[#141413] bg-[#E0F2FE]/50">
                  <div className="font-mono text-[10px] font-black uppercase text-[#0369A1] mb-1">P1 • Strategic Assortment</div>
                  <div className="text-xs font-bold text-[#141413]">Lightweight Gold Discovery</div>
                  <p className="text-[11px] text-[#141413]/75 font-medium mt-1">
                    Introduce &lt;5g lightweight everyday wear filters, clear EMI options, and partner with merchandising to adjust making charges.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border-2 border-[#141413] bg-slate-100">
                  <div className="font-mono text-[10px] font-black uppercase text-slate-600 mb-1">P2 • Monitor Only</div>
                  <div className="text-xs font-bold text-[#141413]">Payment Gateway SLA</div>
                  <p className="text-[11px] text-[#141413]/75 font-medium mt-1">
                    Payment completion is healthy at 50.8% (+6.7% rel). Maintain automated gateway failover without diverting core engineering.
                  </p>
                </div>
              </div>
            </div>

            {/* Restart Button */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem('pmx_bluestone_progress_v3');
                  } catch (_) {}
                  setLearnerScore(0);
                  setCaseHealth(50);
                  setAttemptsByStep({});
                  setHintsUsed({});
                  setCompletedSteps({});
                  setActiveStageTab('clarify');
                }}
                className="bg-white hover:bg-slate-50 text-[#141413] px-4 py-2 rounded-xl border-2 border-[#141413] font-bold text-xs uppercase shadow-[1.5px_1.5px_0px_0px_#141413] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Simulator from Day 1</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStageTab('clarify')}
                className="bg-[#188ab2] hover:bg-[#0f6f8f] text-white px-5 py-2 rounded-xl border-2 border-[#141413] font-black text-xs uppercase shadow-[2px_2px_0px_0px_#141413] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Back to Day 1: Clarifying Questions</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function BlueStoneRcaPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#141413] font-sans pb-24 selection:bg-[#FFF3A7]">
      {/* Top Header / Navbar */}
      <header className="w-full bg-white border-b-[3px] border-[#141413] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 font-black text-lg tracking-tight text-[#141413] hover:text-[#188ab2] transition-colors"
            >
              <img src="/stepsmart-logo.webp" alt="StepSmart Logo" className="w-7 h-7 object-contain" />
              <span>StepSmart</span>
            </Link>
            <span className="text-[#141413]/30 font-bold hidden sm:inline">|</span>
            <span className="font-mono text-xs font-black uppercase text-[#141413]/80 hidden sm:inline">
              BlueStone Product RCA Solver
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/case-simulator?tab=bluestone-rca"
              className="px-3.5 py-1.5 rounded-full border-2 border-[#141413] bg-[#FEF08A] hover:bg-[#FACC15] text-[#141413] font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_#141413] transition-all flex items-center gap-1.5"
            >
              <span>All Cases</span>
              <span>➔</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <BlueStoneRcaComponent />
      </main>
    </div>
  );
}

export default BlueStoneRcaPage;
