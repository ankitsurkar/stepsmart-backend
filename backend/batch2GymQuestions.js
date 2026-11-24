/**
 * PM-X Accelerator Batch 2 — 7-Day Product Design Case Study
 * CommonJS export for AWS Lambda functions
 */

const BATCH_2_PRODUCT_DESIGN_CASE_STUDY = [
  {
    id: 'pm-gym-b2-d1',
    date: '2026-11-23',
    type: 'quiz',
    category: 'Product Design · Clarifying Questions & Scope',
    text: '[Case Study: Design a Group Food Ordering Experience for Swiggy · Day 1 of 7]\nSwiggy leadership wants to capture group dining and larger cart sizes by introducing a collaborative "Group Ordering" product. Before formulating solutions, which of the following is the MOST critical clarifying question to establish scope and goal alignment?',
    options: [
      'Should we build this as a standalone mobile application or as an embedded feature within the existing Swiggy consumer app?',
      'What is the primary business objective—are we optimizing for Average Order Value (AOV), new user acquisition via viral invites, or weekday office lunch order frequency?',
      'Can we mandate that all users in the group must have an active Swiggy One membership to place a joint order?',
      'Should we restrict restaurant partners exclusively to fast-food chains with low kitchen preparation times?'
    ],
    correctIndex: 1,
    correctAnswer: null,
    explanation: 'In PM product design interviews, diving into tactical implementation or edge constraints before clarifying the primary business objective is a major pitfall. Clarifying whether the strategic goal is AOV expansion, viral user acquisition, or weekday lunch frequency dictates the target persona, north star metric, and feature architecture. Standalone vs embedded (Option A) is an engineering/packaging detail, while membership gating (Option C) and partner restrictions (Option D) are premature constraints.'
  },
  {
    id: 'pm-gym-b2-d2',
    date: '2026-11-24',
    type: 'text',
    category: 'Product Design · User Segmentation & Target Persona',
    text: '[Case Study: Design a Group Food Ordering Experience for Swiggy · Day 2 of 7]\nAssume the primary goal is driving weekday lunch frequency and AOV in metro tech parks. Segment the potential group ordering market into 3 distinct user groups, and state in ONE sentence which group Swiggy should target for the MVP and why.',
    options: null,
    correctIndex: null,
    correctAnswer: 'Target Corporate/Tech Park Lunch Teams (colleagues ordering daily 12-2 PM) because they have predictable daily cadence, high purchasing power, clustered single-point deliveries, and acute coordination friction.',
    explanation: 'A top-quartile PM response segments by behavioral motivation, frequency, and delivery density: 1) Corporate/Tech Park Lunch Teams (high daily frequency, high coordination friction, single delivery point), 2) College Roommates/Hostelites (budget-sensitive, late-night high-frequency, complex bill splits), and 3) Weekend Family/Social Gatherings (infrequent, high AOV, high emotional stakes). Corporate lunch teams offer the highest frequency, fastest payback period, and highest order density per delivery partner drop.'
  },
  {
    id: 'pm-gym-b2-d3',
    date: '2026-11-25',
    type: 'quiz',
    category: 'Product Design · User Journey & Core Pain Points',
    text: '[Case Study: Design a Group Food Ordering Experience for Swiggy · Day 3 of 7]\nYou map the end-to-end journey of an office lunch host ("Rahul") ordering for 6 colleagues. Where is the GREATEST friction and drop-off in the current unassisted manual workflow?',
    options: [
      'Deciding which delivery partner picks up the order at the restaurant.',
      'The delivery partner calling the host when arriving at the office lobby gate.',
      'Cart curation deadlock and post-order payment collection: passing one phone around, delayed item selections, cart timeouts, and chasing colleagues for UPI refunds.',
      'Browsing the restaurant menu photos and reading customer reviews.'
    ],
    correctIndex: 2,
    correctAnswer: null,
    explanation: 'The greatest friction in group dining is the "social coordinator tax": the host bears 100% of the cognitive and financial burden (waiting for people to pick dishes, items selling out during deliberation, fronting the full bill, and awkward follow-ups for ₹180 payments). Delivery mechanics (Options A, B) and browsing (Option D) are standard food delivery flows that Swiggy has already solved.'
  },
  {
    id: 'pm-gym-b2-d4',
    date: '2026-11-26',
    type: 'text',
    category: 'Product Design · Solution Brainstorming & Features',
    text: '[Case Study: Design a Group Food Ordering Experience for Swiggy · Day 4 of 7]\nBrainstorm product solutions for Swiggy Group Order: Describe 3 distinct, high-impact features that eliminate the "social coordinator tax" for the group host.',
    options: null,
    correctIndex: null,
    correctAnswer: '1) Shareable Web Cart Link (join via WhatsApp/Slack without app install) with individual 10-minute lock timers; 2) Dietary & Allergy Conflict Aggregator; 3) Host-Locks, Auto-Splits with automated post-order UPI collect requests.',
    explanation: 'Strong PM feature generation tackles the 3 core friction vectors: 1. Asynchronous Cart Assembly (shareable web link, no app download required for participants, countdown timer to prevent stale carts); 2. Order Transparency (dietary filters, visual tags per person so food packaging is labelled per person upon delivery); 3. Frictionless Settlement (auto-split UPI collect requests or company expense-tagging integrations).'
  },
  {
    id: 'pm-gym-b2-d5',
    date: '2026-11-27',
    type: 'quiz',
    category: 'Product Design · Prioritization & Trade-Off Analysis',
    text: '[Case Study: Design a Group Food Ordering Experience for Swiggy · Day 5 of 7]\nFor the MVP checkout flow, engineering presents two options for bill settlement. Which trade-off decision best protects merchant prep SLAs and order completion rate?',
    options: [
      'Option 1: "Strict Synchronous Split" — Every single participant must pay their individual share before the order is transmitted to the restaurant kitchen.',
      'Option 2: "Host-Pays-First with Automated Post-Order UPI Collect" — The host pays the total upfront to immediately fire the order to the kitchen, while Swiggy triggers 1-tap UPI deep-links to each participant.',
      'Option 3: "Cash on Delivery Only" — Disable online payments entirely for group orders to avoid digital transaction drop-offs.',
      'Option 4: "Post-Dated Credit" — Swiggy fronts the money for all orders and sends monthly invoices to users\' personal email addresses.'
    ],
    correctIndex: 1,
    correctAnswer: null,
    explanation: 'Option 1 creates a severe dependency bottleneck: if 1 of 6 participants walks into a meeting or experiences a payment gateway timeout, the entire order stalls, cart items expire, and the group abandons. Option 2 decouples kitchen order execution from social debt recovery—ensuring the restaurant receives the ticket immediately and delivery SLAs are maintained, while automating the host\'s collection via pre-filled UPI links.'
  },
  {
    id: 'pm-gym-b2-d6',
    date: '2026-11-28',
    type: 'text',
    category: 'Product Design · Success Metrics & Guardrails',
    text: '[Case Study: Design a Group Food Ordering Experience for Swiggy · Day 6 of 7]\nDefine the North Star Metric for Swiggy Group Orders, along with ONE vital guardrail (counter-metric) to ensure the feature doesn\'t harm platform delivery operations.',
    options: null,
    correctIndex: null,
    correctAnswer: 'North Star Metric: Weekly Group Orders Completed (with >=2 active contributors); Guardrail Counter-Metric: Average Kitchen Prep & Delivery SLA Breach Rate for group orders vs single-cart orders.',
    explanation: 'A great North Star balances volume and collaboration: "Weekly Group Orders Completed with >= 2 contributors" reflects actual adoption and repeat utility. The guardrail metric is critical: large group orders can overload small restaurant kitchens and exceed standard 2-wheeler delivery bag capacities. Monitoring Delivery SLA Breach Rate and Order Cancellation Rate ensures group orders do not degrade rider turnaround or customer trust.'
  },
  {
    id: 'pm-gym-b2-d7',
    date: '2026-11-29',
    type: 'quiz',
    category: 'Product Design · Edge Cases & Risk Mitigation',
    text: '[Case Study: Design a Group Food Ordering Experience for Swiggy · Day 7 of 7]\nFive colleagues have added items to the shared cart. Just as the host taps "Proceed to Pay", the restaurant runs out of the paneer biryani selected by one colleague. How should the product gracefully handle this edge case without derailing the entire group order?',
    options: [
      'Wipe the entire group cart and redirect the group to the Swiggy home screen to pick a different restaurant.',
      'Automatically substitute the out-of-stock item with the most expensive alternative on the menu and bill the participant.',
      'Lock the rest of the cart, instantly alert both the host and the affected user with a 2-minute quick-swap window, offering similar in-stock recommendations or 1-tap removal.',
      'Proceed with the order without notifying the user, and deliver an empty container with a refund coupon.'
    ],
    correctIndex: 2,
    correctAnswer: null,
    explanation: 'In edge case handling, PMs must preserve high intent while respecting user consent. Cancelling the entire cart (Option A) causes massive frustration for 5 other people who already spent time selecting food. Arbitrary substitution (Option B) violates trust and dietary restrictions. Option C creates a graceful degraded experience: it protects the ready items, highlights the specific conflict, provides intelligent 1-tap alternatives, and has a clear timeout mechanism to prevent holding up the group.'
  }
];

module.exports = {
  BATCH_2_PRODUCT_DESIGN_CASE_STUDY
};
