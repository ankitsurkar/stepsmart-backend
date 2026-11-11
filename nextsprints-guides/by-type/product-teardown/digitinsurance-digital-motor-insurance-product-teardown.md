# Digit Insurance Teardown | Digital Motor Insurance



- **Source:** https://nextsprints.com/guide/digitinsurance-digital-motor-insurance-product-teardown

- **Type:** `product-teardown`

- **Updated:** October 31, 2026



---



## Executive Summary

Digit Insurance (Go Digit General Insurance) is a technology-led general insurer whose flagship consumer product is digital motor insurance: buy or renew a car or two-wheeler policy in minutes, and claim with a smartphone self-inspection instead of waiting for a surveyor. Around this sit health, travel and property products, a partner platform used by dealers, aggregators and POSP agents, and AI-assisted claims operations.

Key takeaways:

- **Strength:** Simple policies, fast digital issuance and smartphone-based claims.
- **Business engine:** Motor insurance sold mainly through partners; motor market share of 6.3% in FY26.
- **Challenge:** Most customers first meet Digit through a partner, so Digit must work harder to build a direct relationship.
- **Opportunity:** Turning claims and renewals into brand-building moments and cross-selling health and travel.

## Introduction

Insurance in India has long been seen as complicated: dense policy wordings, slow claims and pushy selling. Digit launched in 2017 with a promise to simplify insurance, using cloud-native systems, plain-language documents and phone-based claims.

By FY26, Digit reported gross written premium of about ₹11,294 crore, profit after tax of about ₹544 crore and an overall market share of 3.4%. It listed on NSE and BSE in May 2024.

This teardown focuses on Digit's digital motor insurance experience, with notes on health and travel, and on how the partner platform shapes the product.

## Product Overview

| Component | What it does | Users |
| --- | --- | --- |
| Motor insurance purchase | Quotes, add-ons, policy issuance online | Car and two-wheeler owners |
| Renewal journeys | Reminders, renewal quotes, NCB transfer | Existing customers |
| Self-inspection | Phone-based vehicle inspection for claims and lapsed policies | Customers, partners |
| Claims | Intimation, inspection, garage network, settlement | Customers, garages |
| Health insurance | Floaters, top-ups, group health; cashless claims | Families, employers |
| Travel insurance | Domestic and international cover | Travellers, students |
| Partner platform | Quote, issue, renew and track commissions | Dealers, aggregators, POSPs, brokers |

Target users: Indian vehicle owners across metros and smaller towns, families buying health cover, and the partners who sell to them.

## User Journey Deep-Dive

**1. Discovery.** Most customers encounter Digit through a partner: a car dealer at purchase, an aggregator comparison, a bank, or a POSP agent. Others find Digit through search, advertising or word of mouth.

**2. Purchase.** On Digit's website or app, a customer enters a vehicle registration number; details are fetched and a quote with IDV and add-ons appears. Payment and policy issuance follow in minutes. Partner purchases follow a similar flow inside partner tools.

**3. Onboarding.** Policy documents arrive by email and WhatsApp. Many partner-sourced customers never install the Digit app, a key gap.

**4. Claim.** The customer reports an accident by app, website or phone, receives a self-inspection link, captures photos or video, and chooses a network garage for cashless repair or opts for reimbursement.

**5. Renewal.** Reminders by SMS, email and WhatsApp; partners may also contact the customer. Price comparison on aggregators is common.

Friction points:

- Partner-sourced customers may not know they are Digit customers until a claim.
- Self-inspection can be hard for less tech-savvy users or in low-network areas.
- Deductions for depreciation and non-payable items can surprise customers.
- Renewal premiums can change significantly with pricing updates.

## UX & Design Analysis

**Strengths:**

- **Plain-language policy documents:** Digit has made simple wording a brand pillar.
- **Fast quote flow:** Registration-number lookup and pre-filled details.
- **Self-inspection:** Removes waiting for surveyors in many claims.
- **Consistent brand tone:** Friendly, straightforward communication.

**Weaknesses:**

- **Fragmented relationships:** Customers bought through partners see partner branding first.
- **Claims status visibility:** Status updates between steps can be thin.
- **Health claim complexity:** Hospital processes and deductions are harder to simplify than motor.

Design score (illustrative):

| Area | Score (out of 10) |
| --- | --- |
| Purchase flow | 8 |
| Policy clarity | 8 |
| Claims experience (motor) | 7 |
| Claims experience (health) | 6 |
| Renewal experience | 6 |

## Feature Analysis

| Feature | User value | Business value | Notes |
| --- | --- | --- | --- |
| Smartphone self-inspection | High | High (lower handling cost) | Core differentiator |
| AI damage assessment | Medium-High | High | Faster, more consistent estimates |
| Registration-based quotes | High | High (conversion) | Standard in the market now |
| Add-ons (zero dep, engine protect) | High | High (premium) | Pricing affects renewals |
| Partner platform | Indirect | Very high | Drives most volume |
| OEM direct premium fetching | Medium | High | Lower cost, better data |
| Health top-ups | High | Medium-High | Entry point to health |
| WhatsApp communication | High | Medium | Reaches users without the app |

Standout features:

- **Self-inspection:** Puts the customer in control of claim timing.
- **Partner platform:** Lets Digit scale distribution without a large agency force.
- **Simple policy wording:** Builds trust in a low-trust category.

## Business Model Analysis

Digit earns money from:

1. **Underwriting:** Premiums minus claims, commissions and operating costs. A combined ratio below 100% means underwriting profit; Digit's FY26 combined ratio was reported at around 105–106%.
2. **Investment income:** Returns on the float, which currently supports overall profitability.

Cost drivers:

- **Claims:** The largest cost, especially in motor own-damage and health.
- **Commissions:** Paid to partners, a significant cost for a partner-led insurer.
- **Operations and technology:** Lower per policy than traditional insurers due to automation.

Strategy levers:

- Partner-level pricing and commissions to improve portfolio quality.
- Direct and OEM channels to reduce acquisition costs.
- Claims automation to lower handling costs and leakage.
- Diversification into health and commercial lines.

## Competitive Analysis

| Competitor | Strength | How Digit compares |
| --- | --- | --- |
| ICICI Lombard | Scale, brand, multi-channel | Digit is faster-growing and more digital; smaller scale |
| Bajaj General | Broad distribution, strong brand | Digit stronger in partner technology |
| HDFC ERGO | Bank channel, health strength | Digit lacks a captive bank channel |
| Acko | Direct digital, embedded insurance | Digit has broader partner distribution |
| Tata AIG | Motor and travel strength | Similar product range; different distribution |
| Star Health, Niva Bupa | Retail health specialists | Digit weaker in health |

SWOT summary:

- **Strengths:** Technology, simple products, partner network, motor scale.
- **Weaknesses:** Health decline, partner dependence, combined ratio above 100%.
- **Opportunities:** OEM integrations, usage-based insurance, health top-ups, Bima Sugam.
- **Threats:** Pricing competition, regulatory changes, larger rivals' tech catch-up.

## FAQs

### What makes Digit Insurance unique?

Its technology-first approach: simple policy documents, smartphone self-inspection, AI-assisted claims and a strong partner platform that lets it scale distribution efficiently.

### How does Digit sell most of its policies?

Mainly through partners, including dealers, aggregators, banks, brokers and POSP agents. A Digit executive has cited around 85% of volume from partners, alongside direct online sales.

### What are Digit's standout features?

- Smartphone self-inspection for claims and lapsed policy renewals.
- Registration-number-based instant motor quotes.
- Plain-language policies.
- Direct premium fetching with vehicle manufacturers.

### How has Digit evolved since launch?

- 2017: Launch with motor and travel insurance.
- 2018–2020: Rapid growth in motor through partners; health products expand.
- 2022: Jasleen Kohli becomes MD and CEO.
- 2024: IPO and listing in May.
- 2026: FY26 profit after tax of about ₹544 crore; shift to partner-based underwriting; focus on rebuilding health.

## Related Guides Section

📖 [Digit Insurance Product Strategy Guide](/guide/digit-insurance-product-strategy-guide) → Digit's strategic direction and growth plans.

📖 [Digit Insurance PM Interview Guide](/guide/digit-insurance-product-manager-interview-guide) → How Digit hires product managers.

📖 [Digit Insurance Product Manager Salary Guide](/guide/digit-insurance-product-manager-salary-guide) → PM pay at Digit by level in INR.

Disclaimer: This product teardown is based on publicly available information and independent analysis. It is not official documentation or insider information, and features may change. It is intended for product management interview preparation only.
