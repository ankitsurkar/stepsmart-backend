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
