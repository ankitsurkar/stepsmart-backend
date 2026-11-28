import React, { useState, useRef } from 'react';
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
  Split
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
export interface BlueStoneStageMeta {
  key: 'clarify' | 'tree' | 'funnel' | 'category' | 'control' | 'prioritize' | 'pitch';
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
    key: 'funnel',
    dayNumber: 3,
    unlockDate: '2026-11-29',
    unlockDateLabel: 'Nov 29th',
    label: '3. Customer Funnel',
    shortLabel: 'Funnel',
    icon: BarChart3,
    cliffhanger: 'Analyze full-funnel drop-offs across sessions, PDP views, add-to-cart, and checkout.'
  },
  {
    key: 'category',
    dayNumber: 4,
    unlockDate: '2026-11-30',
    unlockDateLabel: 'Nov 30th',
    label: '4. Category Margins',
    shortLabel: 'Category Mix',
    icon: Target,
    cliffhanger: 'Investigate Gold vs. Diamond revenue and margins to find where the profit leaked.'
  },
  {
    key: 'control',
    dayNumber: 5,
    unlockDate: '2026-12-01',
    unlockDateLabel: 'Dec 1st',
    label: '5. Controllability',
    shortLabel: 'Controllability',
    icon: ShieldAlert,
    cliffhanger: 'Separate product-controlled factors from external market commodity price spikes.'
  },
  {
    key: 'prioritize',
    dayNumber: 6,
    unlockDate: '2026-12-02',
    unlockDateLabel: 'Dec 2nd',
    label: '6. Prioritization',
    shortLabel: 'Prioritization',
    icon: Sparkles,
    cliffhanger: 'Map candidate interventions on a 2x2 Impact vs Effort matrix.'
  },
  {
    key: 'pitch',
    dayNumber: 7,
    unlockDate: '2026-12-03',
    unlockDateLabel: 'Dec 3rd',
    label: '7. Leadership Pitch & Quiz',
    shortLabel: 'Leadership Pitch',
    icon: Award,
    cliffhanger: 'Deliver the 5-minute pitch to BlueStone leadership and test your PM mastery.'
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
  const [activeStageTab, setActiveStageTab] = useState<'clarify' | 'tree' | 'funnel' | 'category' | 'control' | 'prioritize' | 'pitch'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const stageParam = params.get('stage');
      if (stageParam && BLUESTONE_STAGES_SCHEDULE.some(s => s.key === stageParam)) {
        return stageParam as any;
      }
    } catch (_) {}
    return highestUnlockedStage.key;
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

        {/* Core Stat Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-md">
          <div className="bg-[#FFFDF5] border-2 border-[#141413] p-3.5 rounded-xl shadow-[2px_2px_0px_0px_#141413]">
            <div className="text-[11px] font-mono uppercase font-black text-[#141413]/70">Revenue</div>
            <div className="text-xl sm:text-2xl font-black text-[#059669] flex items-center gap-1.5 mt-0.5">
              <span>₹105 Cr</span>
              <span className="text-xs font-bold text-[#059669] bg-[#D1FAE5] px-1.5 py-0.2 rounded border border-[#059669]">+5%</span>
            </div>
            <div className="text-[10px] text-[#141413]/60 font-medium mt-1">Previous: ₹100 Cr</div>
          </div>

          <div className="bg-[#FFFDF5] border-2 border-[#141413] p-3.5 rounded-xl shadow-[2px_2px_0px_0px_#141413]">
            <div className="text-[11px] font-mono uppercase font-black text-[#141413]/70">Gross Profit</div>
            <div className="text-xl sm:text-2xl font-black text-[#DC2626] flex items-center gap-1.5 mt-0.5">
              <span>₹17.1 Cr</span>
              <span className="text-xs font-bold text-[#DC2626] bg-[#FEE2E2] px-1.5 py-0.2 rounded border border-[#DC2626]">-15%</span>
            </div>
            <div className="text-[10px] text-[#141413]/60 font-medium mt-1">Previous: ₹20.0 Cr</div>
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
                onClick={() => setActiveStageTab('funnel')}
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

      {/* ── STAGE 3: CUSTOMER JOURNEY & FUNNEL ───────────────────────────── */}
      {isCurrentStageUnlocked && activeStageTab === 'funnel' && (
        <div className="bg-white border-2 sm:border-[3px] border-[#141413] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-6">
          <div>
            <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413]">
              STAGE 3 & 5 • FUNNEL & BEHAVIORAL ANALYTICS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#141413] mt-2">
              Full Funnel Comparison: Previous Year vs Current Year
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse border-2 border-[#141413]">
              <thead>
                <tr className="bg-[#141413] text-white font-mono uppercase text-[11px]">
                  <th className="p-3 border border-[#141413]">Funnel Stage / Metric</th>
                  <th className="p-3 border border-[#141413]">Previous Year</th>
                  <th className="p-3 border border-[#141413]">Current Year</th>
                  <th className="p-3 border border-[#141413]">Delta</th>
                  <th className="p-3 border border-[#141413]">PM Inference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141413]">
                <tr className="bg-white">
                  <td className="p-3 font-bold">1. Website/App Sessions</td>
                  <td className="p-3">10 Lakh</td>
                  <td className="p-3 font-black text-[#059669]">11 Lakh</td>
                  <td className="p-3 font-mono font-bold text-[#059669]">+10.0%</td>
                  <td className="p-3 text-[#141413]/70">Acquisition healthy; top-of-funnel traffic expanded.</td>
                </tr>
                <tr className="bg-[#FFFDF5]">
                  <td className="p-3 font-bold">2. Product Page (PDP) Views</td>
                  <td className="p-3">5.0 Lakh</td>
                  <td className="p-3 font-black text-[#059669]">5.5 Lakh</td>
                  <td className="p-3 font-mono font-bold text-[#059669]">+10.0%</td>
                  <td className="p-3 text-[#141413]/70">Discovery is strong; users are finding product listings.</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 font-bold">3. Add-to-Cart Rate</td>
                  <td className="p-3 font-bold">12.0%</td>
                  <td className="p-3 font-black text-[#DC2626]">11.0%</td>
                  <td className="p-3 font-mono font-bold text-[#DC2626]">-1.0% (pts)</td>
                  <td className="p-3 text-[#DC2626] font-semibold">Drop-off: Price hesitation & missing transparency.</td>
                </tr>
                <tr className="bg-[#FFFDF5]">
                  <td className="p-3 font-bold">4. Checkout Conversion</td>
                  <td className="p-3 font-bold">70.0%</td>
                  <td className="p-3 font-black text-[#DC2626]">68.0%</td>
                  <td className="p-3 font-mono font-bold text-[#DC2626]">-2.0% (pts)</td>
                  <td className="p-3 text-[#DC2626] font-semibold">Friction at final payment & delivery charges.</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 font-bold">5. Purchase Conversion</td>
                  <td className="p-3 font-bold">2.0%</td>
                  <td className="p-3 font-black text-[#D97706]">1.9%</td>
                  <td className="p-3 font-mono font-bold text-[#D97706]">-0.1% (pts)</td>
                  <td className="p-3 text-[#141413]/70">Slight dip, but orders still rose because traffic rose 10%.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── STAGE 4: CATEGORY PROFITABILITY DEEP-DIVE ─────────────────────── */}
      {isCurrentStageUnlocked && activeStageTab === 'category' && (
        <div className="bg-white border-2 sm:border-[3px] border-[#141413] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-6">
          <div>
            <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413]">
              STAGE 7 • THE REVEAL & CORE ROOT CAUSE
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#141413] mt-2">
              Category Profitability: Gold vs Diamond Breakdown
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse border-2 border-[#141413]">
              <thead>
                <tr className="bg-[#141413] text-white font-mono uppercase text-[11px]">
                  <th className="p-3 border border-[#141413]">Category</th>
                  <th className="p-3 border border-[#141413]">Prev Revenue</th>
                  <th className="p-3 border border-[#141413]">Curr Revenue</th>
                  <th className="p-3 border border-[#141413]">Prev Margin</th>
                  <th className="p-3 border border-[#141413]">Curr Margin</th>
                  <th className="p-3 border border-[#141413]">GP Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141413]">
                <tr className="bg-[#FEE2E2]/30">
                  <td className="p-3 font-black text-[#DC2626]">Gold Jewellery</td>
                  <td className="p-3">₹60 Cr</td>
                  <td className="p-3 font-bold text-[#059669]">₹75 Cr (+25%)</td>
                  <td className="p-3">22.0%</td>
                  <td className="p-3 font-black text-[#DC2626]">14.0% (-8%)</td>
                  <td className="p-3 font-black text-[#DC2626]">-₹2.70 Cr (93% of loss)</td>
                </tr>
                <tr className="bg-[#D1FAE5]/30">
                  <td className="p-3 font-black text-[#065F46]">Diamond Jewellery</td>
                  <td className="p-3">₹40 Cr</td>
                  <td className="p-3 font-bold text-[#DC2626]">₹30 Cr (-25%)</td>
                  <td className="p-3">17.0%</td>
                  <td className="p-3 font-black text-[#059669]">22.0% (+5%)</td>
                  <td className="p-3 font-black text-[#D97706]">-₹0.20 Cr</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── STAGE 5: CONTROLLABILITY MATRIX ─────────────────────────────── */}
      {isCurrentStageUnlocked && activeStageTab === 'control' && (
        <div className="bg-white border-2 sm:border-[3px] border-[#141413] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-6">
          <div>
            <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413]">
              STAGE 4 • CONTROLLABILITY & ACCOUNTABILITY
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#141413] mt-2">
              Separating Product-Controlled from External Factors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#D1FAE5]/40 border-2 border-[#065F46] rounded-xl p-4 shadow-[2px_2px_0px_0px_#065F46]">
              <div className="font-mono text-xs font-black uppercase text-[#065F46] mb-2">
                1. Controllable (Product & Tech)
              </div>
              <ul className="text-xs font-medium space-y-2 text-[#141413]">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#065F46]" /> Poor search relevance & PDP filters</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#065F46]" /> Checkout friction & payment failure drops</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#065F46]" /> Inaccurate product specs & gold weight clarity</li>
              </ul>
            </div>

            <div className="bg-[#FEF3C7]/40 border-2 border-[#D97706] rounded-xl p-4 shadow-[2px_2px_0px_0px_#D97706]">
              <div className="font-mono text-xs font-black uppercase text-[#D97706] mb-2">
                2. Influenceable (Partnership with Ops)
              </div>
              <ul className="text-xs font-medium space-y-2 text-[#141413]">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#D97706]" /> Low stock availability</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#D97706]" /> Supplier delivery reliability</li>
              </ul>
            </div>

            <div className="bg-[#FEE2E2]/40 border-2 border-[#991B1B] rounded-xl p-4 shadow-[2px_2px_0px_0px_#991B1B]">
              <div className="font-mono text-xs font-black uppercase text-[#991B1B] mb-2">
                3. Uncontrollable (Macro Market)
              </div>
              <ul className="text-xs font-medium space-y-2 text-[#141413]">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#991B1B]" /> Higher global gold commodity prices</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#991B1B]" /> Competitor promotions</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── STAGE 6: PRIORITIZATION ─────────────────────────────────────── */}
      {isCurrentStageUnlocked && activeStageTab === 'prioritize' && (
        <div className="bg-white border-2 sm:border-[3px] border-[#141413] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-6">
          <div>
            <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413]">
              STAGE 8 • 2x2 PRIORITIZATION MATRIX
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#141413] mt-2">
              Actionable Product Opportunities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border-2 border-[#141413] bg-[#D1FAE5]/30">
              <div className="font-mono text-xs font-black uppercase text-[#065F46] mb-1">
                ⚡ Quick Wins (High Impact / Low Effort)
              </div>
              <ul className="text-xs font-semibold space-y-2 mt-3 text-[#141413]">
                <li>• <strong>Transparent Pricing:</strong> Show gold weight, purity & making charges transparently on PDP.</li>
                <li>• <strong>Payment Recovery:</strong> Auto-switch to UPI/Netbanking when card transactions stall.</li>
                <li>• <strong>Lightweight Tagging:</strong> Filter products by weight budget (&lt;5g, 5-10g).</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl border-2 border-[#141413] bg-[#E0F2FE]/40">
              <div className="font-mono text-xs font-black uppercase text-[#0369A1] mb-1">
                🎯 Strategic Bets (High Impact / High Effort)
              </div>
              <ul className="text-xs font-semibold space-y-2 mt-3 text-[#141413]">
                <li>• <strong>Margin-Aware Discovery:</strong> Dynamic recommendation ranker balancing user preference & margin.</li>
                <li>• <strong>Assortment Optimization:</strong> Partner with Merchandising to introduce higher-margin everyday wear designs.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── STAGE 7: LEADERSHIP PITCH & QUIZ ────────────────────────────── */}
      {isCurrentStageUnlocked && activeStageTab === 'pitch' && (
        <div className="bg-white border-2 sm:border-[3px] border-[#141413] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#141413] space-y-6">
          <div>
            <span className="bg-[#FEF08A] text-[#141413] font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-[#141413]">
              STAGE 11 • LEADERSHIP PITCH & SELF-TEST
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#141413] mt-2">
              The 5-Minute Leadership Pitch & PM Quiz
            </h2>
          </div>

          <div className="bg-[#FFFDF5] border-2 border-[#141413] rounded-xl p-5 shadow-[2px_2px_0px_0px_#141413]">
            <button
              onClick={() => setShowPitchSummary(!showPitchSummary)}
              className="w-full flex items-center justify-between font-black text-sm uppercase text-[#141413] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>🎙️</span>
                <span>Read the 5-Minute Pitch to BlueStone Leadership</span>
              </span>
              {showPitchSummary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {showPitchSummary && (
              <div className="mt-4 pt-4 border-t border-[#141413]/20 text-xs sm:text-sm font-medium leading-relaxed space-y-3 text-[#141413]">
                <p>
                  <strong>“Gross profit is down 15% while revenue is up 5%.</strong> I diagnosed this as both a profitability challenge and a product experience mismatch.
                </p>
                <p>
                  <strong>What I found:</strong> Sessions rose 10%, but purchase conversion fell from 2.0% to 1.9%, with drop-offs in add-to-cart and checkout. However, the macro driver sits in product economics: Gold sales rose from ₹60 Cr to ₹75 Cr, but Gold margin collapsed from 22% to 14%—losing ₹2.7 Cr of profit alone.
                </p>
                <p>
                  <strong>Recommendations:</strong> Improve digital transparency on PDP, prioritize lightweight gold discovery, and shift mindset from conversion in isolation to profitable transactions.”
                </p>
              </div>
            )}
          </div>

          {/* Test Questions */}
          <div className="space-y-4 pt-4">
            <h3 className="font-mono text-xs font-black uppercase text-[#141413]">
              Test Your PM Mastery (From Handout):
            </h3>

            {[
              {
                id: 1,
                question: 'Traffic rises 20%, but revenue only rises 5%. What do you investigate first?',
                options: [
                  'Immediately launch a full redesign of the homepage',
                  'Decompose into conversion and AOV, then segment by marketing channel',
                  'Double marketing ad spend on Google and Instagram'
                ],
                correct: 1,
                reason: 'Find where the conversion or order value leaks before spending more marketing capital.'
              },
              {
                id: 2,
                question: 'Conversion improves 10%, but gross profit declines. What is your next step?',
                options: [
                  'Celebrate conversion gains with the product team',
                  'Investigate gross margin, product mix, discounts, and COGS',
                  'Fire the analytics lead'
                ],
                correct: 1,
                reason: 'Conversion is not profit! You could be selling low-margin loss-leaders.'
              }
            ].map((q) => {
              const selected = selectedAnswers[q.id];
              const hasAnswered = selected !== undefined;
              const isCorrect = selected === q.correct;
              return (
                <div key={q.id} className="p-4 rounded-xl border-2 border-[#141413] bg-white space-y-3">
                  <div className="font-bold text-xs sm:text-sm text-[#141413]">
                    {q.id}. {q.question}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                          selected === optIdx
                            ? optIdx === q.correct
                              ? 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]'
                              : 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B]'
                            : 'bg-[#F8FAFC] hover:bg-slate-100 border-[#141413]/30 text-[#141413]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {hasAnswered && (
                    <div className={`text-xs font-medium p-2.5 rounded-lg border ${
                      isCorrect ? 'bg-[#D1FAE5]/60 text-[#065F46] border-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E] border-[#D97706]'
                    }`}>
                      <strong>{isCorrect ? 'Correct!' : 'Interviewer Insight:'}</strong> {q.reason}
                    </div>
                  )}
                </div>
              );
            })}
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
