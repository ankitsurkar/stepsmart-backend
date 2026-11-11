# Cleartrip App Teardown | Flipkart's Travel Platform



- **Source:** https://nextsprints.com/guide/cleartrip-travel-app-product-teardown

- **Type:** `product-teardown`

- **Updated:** October 31, 2026



---



## Executive Summary

Cleartrip built its reputation in the late 2000s as the cleanest, fastest way to book a flight in India. Today, as part of Flipkart, it is a multi-category travel app covering flights, hotels, trains, buses and packages, with a second front door inside the Flipkart app. Three factors define the product: 1) a simple, flight-first booking experience that experienced travellers trust; 2) distribution and loyalty through Flipkart, including SuperCoins; and 3) a growing set of trust and flexibility features such as CT Flexmax, Live Flight Status and Book@0.

Cleartrip's value proposition is "travel booking without the clutter": fewer steps, clear fares and flexible options, backed by Flipkart's ecosystem.

This teardown examines Cleartrip's product, user journeys, design, features, business model and competitive position, with a focus on what PM candidates should notice.

## Introduction

Cleartrip was founded in 2006 and acquired by Flipkart in 2021. Company leaders describe it as India's second-largest player in online air bookings and roughly fourth in hotels. Flights bring about 80% of its revenue. Reported FY26 results show revenue up about 21% and a net loss of around ₹805 crore, with heavy spending on discounts. The company has set a target of operational breakeven by the end of FY27.

The teardown uses public information, app usage and industry reports. It looks at Cleartrip as both a consumer product and a business that must balance growth with profitability.

> Expert Insight
> Cleartrip's product story is a tension between two strengths. Its clean flight experience wins experienced travellers, while Flipkart distribution brings price-sensitive first-time users. Designing for both at once is the central product challenge.

## Product Overview

Core value proposition: book any trip quickly, see clear prices, change plans without fear, and earn rewards across Flipkart.

Target users:

1. Urban, frequent flyers who value speed and simplicity
2. Flipkart shoppers in metros and smaller cities discovering travel
3. Small companies booking work travel through Cleartrip for Business
4. Travellers in the Middle East (through Cleartrip's Gulf business)

Key use cases:

1. Domestic and international flight booking
2. Hotel booking, including mood-based discovery and pay-later holds
3. Train and bus tickets
4. Managing trips: cancellations, reschedules, flight status

Evolution timeline:

- 2006: Launched as a flight booking site with a minimalist interface
- 2010s: Added hotels, mobile apps and international expansion in the Gulf
- 2021: Acquired by Flipkart; travel tab launched in the Flipkart app
- 2022: Acquired Saudi-based Flyin to strengthen its Middle East presence
- 2025: Explore Hotels by Vibe; Visa Denial Cover offered around Big Billion Days
- 2026: Price Trends, Live Flight Status, train booking with IRCTC, Book@0

> Key Takeaway
> Cleartrip has moved from a flight specialist to a full travel platform, but its brand and revenue still lean heavily on flights.

## User Journey Deep-Dive

First-time user experience:

- On the Cleartrip app, users land on a search-first home screen with tabs for flights, hotels, trains and buses.
- On Flipkart, users reach Cleartrip through the travel entry point and use Flipkart login and payments.

Key user flows:

1. **Flight booking:** Search, results with filters and Price Trends, fare selection, add-ons (seats, meals, CT Flexmax), payment, confirmation.
2. **Hotel booking:** Search or browse by vibe, hotel page with photos and reviews, choose to pay now or hold with Book@0, confirmation.
3. **Train booking:** Search, availability by class, passenger details, IRCTC login step, payment.
4. **Post-booking:** Trip page with Live Flight Status, web check-in links, cancellation and reschedule.

Critical moments:

- Fare selection, where users decide between fare types and add-ons.
- The IRCTC login step for trains, a known source of drop-off.
- Disruptions, when Live Flight Status and fast refunds build or break trust.

Pain points and solutions:

- **Booking anxiety about fares:** Addressed by Price Trends, which shows how fares have moved for a route.
- **Fear of losing money on changes:** Addressed by CT Flexmax for flights and Book@0 for hotels.
- **Uncertainty on travel day:** Addressed by Live Flight Status with delays, gate changes and baggage belts.

Retention mechanisms:

- SuperCoins earned on bookings (2 SuperCoins per ₹100, per Cleartrip's offer page)
- Fare alerts and Price Trends
- Saved travellers and payment methods

> Pain Point Solution
> Indian travellers are often unsure whether to book now or wait. Price Trends tackles this, but the feature must be accurate on peak dates, or it risks pushing users to wait and pay more.

## UX & Design Analysis

Information architecture: Cleartrip uses a search-first layout with category tabs and a trips section. The design stays close to its original minimalist approach, with fewer banners than some competitors.

Visual design principles:

- Clean white layouts with strong typography and limited colour
- Clear price display with fees shown during checkout
- Consistent card patterns across flights and hotels

Mobile vs web: Mobile is the primary channel. The web experience remains popular with frequent flyers and business users who compare many options.

Standout UI elements:

1. Flight results with clear fare summaries and quick filters
2. Explore Hotels by Vibe, which turns hotel search into mood-based discovery
3. Trip pages with live status updates

Design trade-offs:

- Minimalism helps experienced users but can leave first-time flyers without enough guidance.
- Inside the Flipkart app, Cleartrip must follow Flipkart's design system, so the experience differs slightly between the two front doors.

For PM candidates, our [Cleartrip PM Interview Guide](/guide/cleartrip-product-manager-interview-guide) includes case questions based on these flows.

> Comparison Insight
> Compared with MakeMyTrip's content-rich home screen, Cleartrip feels faster and calmer. The trade-off is less space for cross-selling hotels and holidays.

## Feature Analysis

1. **CT Flexmax** Differentiation: ⭐⭐⭐⭐ User Impact: ⭐⭐⭐⭐⭐ A paid add-on that allows free cancellation or rescheduling of domestic flights up to 24 hours before departure. It addresses one of the biggest fears in Indian travel and is a meaningful ancillary revenue stream. Competitors offer similar products, so execution (refund speed, clarity) is the real differentiator.
2. **Book@0** Differentiation: ⭐⭐⭐⭐⭐ User Impact: ⭐⭐⭐⭐ Lets users hold hotel rooms without paying or entering card details, across a large hotel inventory. It wins the hotel decision earlier in trip planning, but needs careful management of lapsed holds for hotel partners.
3. **Price Trends and Live Flight Status** Differentiation: ⭐⭐⭐ User Impact: ⭐⭐⭐⭐ Price Trends reduces booking anxiety; Live Flight Status helps during disruptions. Both build trust, but similar tools exist on Google Flights and competitor apps.
4. **Cleartrip on Flipkart and SuperCoins** Differentiation: ⭐⭐⭐⭐⭐ User Impact: ⭐⭐⭐⭐ No other Indian OTA has a front door inside a major shopping app. SuperCoins let users earn and spend across shopping and travel.

Underperforming or early features:

- Train booking is new and competes with IRCTC's own app and ixigo, which have stronger waitlist tools.
- Cleartrip for Business has less market visibility than MakeMyTrip's business product.

> Expert Insight
> Cleartrip's best features reduce fear: fear of fare changes, of losing money, of disruption. That is a strong product theme to build on across hotels and trains.

## Business Model Analysis

Revenue streams:

1. Airline commissions and incentives on flight bookings
2. Convenience fees charged to customers
3. Hotel commissions (higher margin than flights)
4. Ancillaries: CT Flexmax, seats, meals, insurance, visa services
5. Train and bus booking fees
6. Business travel bookings

Costs and pressures:

- Discounts and cashbacks are the biggest cost. Reports put them at roughly ₹900 crore in FY26, larger than operating revenue.
- Marketing, technology and customer support.

Growth engine:

- Flipkart distribution and Big Billion Days campaigns
- Bank partnerships and offers
- Repeat bookings from frequent flyers

Path to profitability:

- Reduce blanket discounts in favour of targeted offers and SuperCoins
- Grow hotels and ancillaries to raise revenue per trip
- Use trains and buses for engagement at low acquisition cost

For a full strategic view, see our [Cleartrip Product Strategy Guide](/guide/cleartrip-product-strategy-guide).

> Business Model Insight
> Cleartrip's challenge is not demand but margin. Every product decision, from hotel ranking to ancillary design, now has to show how it improves contribution per trip.

## Competitive Analysis

Main competitors: MakeMyTrip (with Goibibo), ixigo, EaseMyTrip, Yatra, airline direct channels, and Google Flights for search.

| Feature | Cleartrip | MakeMyTrip | ixigo | EaseMyTrip |
| --- | --- | --- | --- | --- |
| Flights | ✅ | ✅ | ✅ | ✅ |
| Hotels depth | Medium | High | Growing | Medium |
| Trains | ✅ (2026) | ✅ | ✅ (strong) | ✅ |
| E-commerce ecosystem | ✅ Flipkart | ❌ | ❌ | ❌ |
| AI trip assistant | Limited | ✅ | ✅ (TARA) | Limited |
| Free cancellation add-on | ✅ CT Flexmax | ✅ | ✅ ixigo Assured | ✅ |

Competitive advantages:

- Flipkart reach and loyalty integration
- Clean, trusted flight experience
- Strong flexibility and pay-later features

Market gaps:

- Hotel supply and content depth compared with MakeMyTrip
- Weaker position in trains and buses compared with ixigo
- Less visible AI-led planning than some competitors

> Strategic Position
> Cleartrip is a strong number two in flights with a unique ecosystem partner. Its next stage depends on turning that position into hotel and ancillary revenue.

## FAQs

### What makes Cleartrip unique in the market?

Cleartrip is the only major Indian OTA owned by an e-commerce platform. Its travel tab inside the Flipkart app and SuperCoins integration give it reach and loyalty tools that competitors lack, alongside a clean flight booking experience.

### How does Cleartrip's pricing compare to competitors?

Base fares come from airlines and are similar across apps. Differences come from convenience fees, discounts, bank offers and SuperCoins. Cleartrip has used heavy discounts to grow, though it is now working to make them more targeted.

### What are Cleartrip's standout features?

1. CT Flexmax for free cancellation and rescheduling
2. Book@0 for card-free hotel holds
3. Price Trends and Live Flight Status
4. Explore Hotels by Vibe
5. SuperCoins earning and redemption through Flipkart

### How has Cleartrip evolved since launch?

- 2006: Minimalist flight booking site
- 2010s: Hotels, mobile apps, Middle East growth
- 2021: Acquired by Flipkart
- 2022: Acquired Flyin in Saudi Arabia
- 2026: Trains with IRCTC, Book@0, Price Trends and Live Flight Status

## Related Guides Section

📖 [Cleartrip Product Strategy Guide](/guide/cleartrip-product-strategy-guide) → How Cleartrip plans to move beyond flights and reach breakeven.

📖 [Cleartrip PM Interview Guide](/guide/cleartrip-product-manager-interview-guide) → Hiring process and case questions for Cleartrip PM roles.

📖 [Cleartrip Product Manager Salary Guide](/guide/cleartrip-product-manager-salary-guide) → PM compensation by level in INR.

Disclaimer: This product teardown is based on publicly available information and independent analysis. It is an external view of Cleartrip and should not be considered official documentation or insider information. Features change as the product evolves. This analysis is intended for educational purposes and product management interview preparation.
