# Epic MyChart Teardown | Inside the Top Patient Portal



- **Source:** https://nextsprints.com/guide/epicsystems-mychart-patient-portal-product-teardown

- **Type:** `product-teardown`

- **Updated:** October 31, 2026



---



## Executive Summary

MyChart is Epic Systems' patient portal and mobile app, and one of the most widely used consumer healthcare products in the US. Patients use it to message clinicians, view test results, schedule appointments, pay bills, check in for visits and, increasingly, talk to Epic's AI assistant Emmie. Three factors make it distinctive:

1. Built into the EHR: MyChart reads and writes directly to the same system clinicians use, so data is real time and actions (booking, messaging, check-in) flow straight into clinical workflows.
2. Distributed through health systems: Each Epic customer brands and configures its own MyChart, making it ubiquitous without Epic marketing directly to consumers.
3. Network effects: Patients can link accounts across organisations, and MyChart Central, live at 346 organisations, gives patients one login across many health systems.

The challenge for MyChart is balancing patient convenience with clinician workload, as easy messaging and immediate results can flood clinicians' In Baskets. AI features like Emmie and AI result explanations are Epic's answer.

## Introduction

US patients interact with dozens of healthcare organisations over their lives. Before patient portals, getting test results or booking appointments meant phone calls. MyChart changed this for patients of Epic customers, and the Cures Act's information access rules made portals even more central.

This teardown looks at MyChart's product, user journey, UX, features, business model and competition, using public information including Epic's 2026 user group meeting statistics. For interview preparation, combine it with the [Epic Systems Product Manager Interview Guide](/guide/epic-systems-product-manager-interview-guide).

> Expert Insight
> Health IT analysts often note that MyChart's biggest advantage isn't its design but its position: it sits on top of the clinical record, so features like Fast Pass or e-check-in can actually change schedules and charts rather than just display information.

## Product Overview

Value proposition: "Manage your health and your care in one place, connected directly to your care team."

Target users:

- Patients of Epic customer organisations.
- Caregivers with proxy access, such as parents and adult children.
- Indirect users: clinicians, schedulers and billing staff who receive MyChart activity.

Core use cases:

| Use case | Example features |
| --- | --- |
| Communication | Secure messaging, video visits |
| Results and records | Lab and imaging results, visit summaries, medications, immunisations |
| Access | Self-scheduling, Fast Pass waitlist offers, e-check-in |
| Billing | Statements, payments, payment plans, price estimates |
| AI help | Emmie answers questions; AI explanations of results (previewed in 2026) |
| Caregiving | Proxy access for children and adults |

Evolution:

- Early 2000s: MyChart launches as a web portal for Epic customers.
- 2010s: Mobile apps, linking across organisations, self-scheduling and video visits.
- 2020s: Cures Act-driven immediate results release, Fast Pass, Hello World onboarding, MyChart Central.
- 2025–2026: Emmie AI assistant live at organisations such as Sutter Health, AI result explanations previewed.

## User Journey Deep-Dive

**1. Activation**: Patients get an activation code or text link after a visit, or sign up online. Activation rates vary by organisation and patient type.

**2. First use**: Typically checking a test result or upcoming appointment.

**3. Regular use**: Messaging the care team, refilling prescriptions, paying bills, scheduling.

**4. Visit day**: E-check-in, questionnaires, insurance updates and co-payments before arrival.

**5. After visit**: After-visit summary, results, follow-up scheduling, bills.

**6. Long-term**: Managing chronic conditions, caregiving for family members, linking multiple organisations.

Friction points:

- Activation steps and password resets.
- Separate MyChart accounts at organisations not yet on MyChart Central.
- Confusing results released before a clinician explains them.
- Messaging delays when clinicians are overloaded.

## UX & Design Analysis

Strengths:

- **Consistency**: Patients moving between Epic organisations see familiar layouts.
- **Actionable**: Tasks like booking or paying complete in the app.
- **Accessibility**: Multiple languages and accessibility features in many organisations.

Weaknesses:

- **Configuration variability**: Features differ by organisation, which confuses patients.
- **Dense information**: Medical results and records can overwhelm.
- **Notification overload**: Many alerts from multiple organisations.

| UX dimension | MyChart | Typical standalone health app |
| --- | --- | --- |
| Data freshness | Real time from EHR | Often delayed or partial |
| Task completion | High (direct actions) | Limited |
| Consistency across providers | High among Epic sites | Varies |
| Simplicity | Medium | Often high |
| Personalisation | Growing with AI | Varies |

## Feature Analysis

| Feature | Patient value | Health system value | Assessment |
| --- | --- | --- | --- |
| Test results | Immediate access | Compliance, engagement | Core, but can cause anxiety |
| Messaging | Direct contact with clinicians | Relationship, but workload | Double-edged |
| Self-scheduling | Convenience | Lower call volume | Strong |
| Fast Pass | Earlier appointments (about 30 days sooner on average, per Epic) | Fills cancelled slots | Standout |
| E-check-in | Less waiting | Faster registration, collections | Strong |
| Billing and estimates | Transparency | Faster payment | Improving |
| Emmie | 24/7 answers, over a third of conversations after hours | Fewer calls and messages | High potential |
| MyChart Central | One login across organisations | Better patient experience | Growing network |

> Interview Angle
> When asked to improve MyChart, consider both sides: patient convenience and clinician workload. The best answers reduce patient effort without adding In Basket burden.

## Business Model Analysis

MyChart isn't sold to patients. Epic earns from licences and maintenance paid by health systems for its software, including MyChart and its features. Value for health systems comes from:

1. **Lower service costs**: Fewer phone calls for scheduling, billing and results.
2. **Revenue**: Faster payments, fewer no-shows, filled appointment slots.
3. **Patient loyalty**: A good digital experience keeps patients in the system.
4. **Compliance**: Meeting patient access requirements.

Costs and risks:

- Clinician workload from messages, which some organisations address by billing for certain message-based care.
- Support costs for activation and access problems.
- Privacy and security responsibilities.

## Competitive Analysis

| Competitor | Positioning | Strengths vs. MyChart | Weaknesses vs. MyChart |
| --- | --- | --- | --- |
| Oracle Health patient portal | Portal for Oracle Health customers | Oracle cloud capabilities | Smaller footprint, fragmented experience |
| athenahealth patient portal | Ambulatory practices | Simple for small practices | Less depth for hospitals |
| MEDITECH patient portal | Community hospitals | Cost | Fewer features |
| Apple Health Records | Aggregation on iPhone | Consumer design | Read-only, no actions |
| Zocdoc | Appointment marketplace | Cross-provider booking | No clinical record |
| Health system custom apps | Branded front door | Brand control | Depend on EHR integration |

MyChart's unique position: the largest patient engagement network tied directly to clinical systems, with growing AI support.

Future outlook: MyChart's direction is towards a lifelong, AI-assisted health companion across organisations: unified logins through MyChart Central, Emmie handling routine questions, and smarter scheduling and caregiving tools.

## FAQs

### What makes MyChart unique among patient portals?

It is directly connected to the Epic EHR used by clinicians, so patients see real-time data and can take actions like booking, checking in and messaging that flow into clinical workflows. Its reach across many Epic organisations also creates network effects.

### How does Epic make money from MyChart?

Patients don't pay. Health systems license MyChart as part of their Epic software and benefit from lower service costs, faster payments and better patient retention.

### What are MyChart's main weaknesses?

Experiences vary by organisation, results can be released before patients understand them, and easy messaging adds to clinicians' workloads.

### How has MyChart evolved since launch?

From a basic web portal to a mobile app with scheduling, video visits, Fast Pass, billing, cross-organisation linking, MyChart Central and AI support through Emmie.

## Related Guides Section

📖 [Epic Systems Product Strategy Guide](/guide/epic-systems-product-strategy-guide) → Epic's AI, Cosmos and international strategy.

📖 [Epic Systems Product Manager Interview Guide](/guide/epic-systems-product-manager-interview-guide) → Roles and interview process at Epic.

📖 [Epic Systems Product Manager Salary Guide](/guide/epic-systems-product-manager-salary-guide) → Pay for developer, QM and project manager roles.

Disclaimer: This product teardown is based on publicly available information and independent analysis. It is not official Epic documentation or insider information. Features vary by organisation and change over time. This analysis is for educational purposes and product management interview preparation only.
