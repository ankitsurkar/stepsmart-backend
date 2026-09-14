// Centralized SEO helper for the StepSmart landing SPA.
// Because the site is a client-rendered Vite SPA where every route is served the
// same static index.html, we must update the document head per route on the client
// so each page has a unique <title>, meta description and self-referencing canonical.

export const SITE_ORIGIN = 'https://www.stepsmart.net';
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/hero_image.webp`;

export interface SeoData {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
}

const DEFAULT_DESCRIPTION =
  "Break into product management without an MBA or IIT tag. PM-X by StepSmart: live cohort-based PM mentorship, real-world projects, and mock interviews from PMs at Microsoft, Mastercard and more.";

// SEO metadata for the hardcoded APM/PM interview guides on /resources.
// Keyed by the guide id used in the ?id= query param (and /resources/:id path).
export const GUIDE_SEO: Record<string, { title: string; description: string }> = {
  'flipkart-apm-guide': {
    title: 'Flipkart APM Interview Guide 2026 — Rounds, PYQs & Prep | StepSmart',
    description:
      'Complete Flipkart APM interview guide: shortlisting criteria, product design & GTM rounds, previous year questions (PYQs) and prep tips. Typical CTC ₹20–28 LPA.',
  },
  'zomato-blinkit-apm-guide': {
    title: 'Zomato & Blinkit APM / Product Analyst Interview Guide 2026 | StepSmart',
    description:
      'Zomato and Blinkit APM & Product Analyst interview guide: RCA questions, marketplace dynamics, interview rounds and PYQs. Typical CTC ₹18–26 LPA.',
  },
  'uber-apm-guide': {
    title: 'Uber APM Interview Guide 2026 — System Design, PYQs & Prep | StepSmart',
    description:
      'Uber APM interview guide covering three-sided marketplace strategy, technical & system design rounds, previous year questions and preparation tips.',
  },
  'sprinklr-apm-guide': {
    title: 'Sprinklr APM / PA Interview Guide 2026 — Rounds & PYQs | StepSmart',
    description:
      'Sprinklr APM & Product Analyst interview guide: B2B SaaS product strategy, enterprise logic, interview rounds and previous year questions. Typical CTC ₹15–20 LPA.',
  },
  'groww-apm-guide': {
    title: 'Groww APM Interview Guide 2026 — Guesstimates, PYQs & Prep | StepSmart',
    description:
      'Groww APM interview guide: fintech product sense, guesstimates & analytics rounds, previous year questions and prep tips. Typical CTC ₹18–24 LPA.',
  },
  'meesho-apm-guide': {
    title: 'Meesho APM Interview Guide 2026 — Product Design, PYQs & Prep | StepSmart',
    description:
      'Meesho APM interview guide: tier-2/3 market dynamics, social commerce, product design & GTM rounds and previous year questions. Typical CTC ₹18–25 LPA.',
  },
  'razorpay-pm-guide': {
    title: 'Razorpay PM Interview Guide 2026 — API & System Design, PYQs | StepSmart',
    description:
      'Razorpay PM interview guide: B2B product thinking, API integrations, technical & system design rounds and previous year questions for fintech PM roles.',
  },
};

// Static per-route SEO for known top-level pages.
const STATIC_SEO: Record<string, Omit<SeoData, 'canonical'>> = {
  '/': {
    title: 'Product Management Course in India | PM-X by StepSmart',
    description: DEFAULT_DESCRIPTION,
    ogType: 'website',
  },
  '/professionals': {
    title: 'PM-X Accelerator — Product Management Course for Working Professionals | StepSmart',
    description:
      'Switch into Product Management from any background. PM-X Accelerator is a 12-week live cohort built by PMs who made the switch — resume repositioning, mock interviews and mentor guidance.',
    ogType: 'website',
  },
  '/students': {
    title: 'PM-X First Step — Product Management Course for Students & Placements | StepSmart',
    description:
      'A structured 6-week PM placement program for final-year students. Get placement-ready with real interview processes, case study frameworks and expert mentors.',
    ogType: 'website',
  },
  '/events': {
    title: 'Live PM Masterclasses & Workshops for Aspiring Product Managers | StepSmart',
    description:
      'Join free live Product Management masterclasses and workshops led by industry PMs. Learn interview strategies, product sense and how to break into PM roles.',
    ogType: 'website',
  },
  '/blog': {
    title: 'Product Management Blog — Guides & Frameworks for Aspiring PMs | StepSmart',
    description:
      'Actionable Product Management guides, case study deep-dives and interview frameworks to build your PM career without an MBA. Learn from working PMs.',
    ogType: 'website',
  },
  '/resources': {
    title: 'APM Interview Guides & IIT Placement PYQs for Product Managers | StepSmart',
    description:
      'Company-by-company APM and PM interview guides for IIT campus placements — shortlisting criteria, deck assignments, interview loops and previous year questions (PYQs).',
    ogType: 'website',
  },
};

function toTitleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

// Resolve SEO data for the current location (pathname + search).
export function getSeoForLocation(pathname: string, search: string): SeoData {
  const params = new URLSearchParams(search);

  // Resource guide detail — supports both /resources?id=<id> and /resources/<id>.
  if (pathname === '/resources' || pathname.startsWith('/resources/')) {
    const idFromPath = pathname.startsWith('/resources/')
      ? decodeURIComponent(pathname.replace('/resources/', '').replace(/\/$/, ''))
      : '';
    const guideId = params.get('id') || idFromPath;
    if (guideId && GUIDE_SEO[guideId]) {
      const g = GUIDE_SEO[guideId];
      return {
        title: g.title,
        description: g.description,
        canonical: `${SITE_ORIGIN}/resources/${guideId}`,
        ogImage: DEFAULT_OG_IMAGE,
        ogType: 'article',
      };
    }
    // Resources index
    const base = STATIC_SEO['/resources'];
    return { ...base, canonical: `${SITE_ORIGIN}/resources`, ogImage: DEFAULT_OG_IMAGE };
  }

  // Blog detail — title/description are refined by BlogPage once the post loads.
  if (pathname.startsWith('/blog/')) {
    const slug = decodeURIComponent(pathname.replace('/blog/', '').replace(/\/$/, ''));
    return {
      title: `${toTitleCase(slug)} | StepSmart PM Blog`,
      description: DEFAULT_DESCRIPTION,
      canonical: `${SITE_ORIGIN}/blog/${slug}`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'article',
    };
  }

  const normalized = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const staticSeo = STATIC_SEO[normalized];
  if (staticSeo) {
    return {
      ...staticSeo,
      canonical: `${SITE_ORIGIN}${normalized === '/' ? '/' : normalized}`,
      ogImage: DEFAULT_OG_IMAGE,
    };
  }

  // App / gated routes (auth, dashboard, admin) and unknown paths: keep out of the index.
  return {
    title: 'StepSmart — Product Management Career Accelerator',
    description: DEFAULT_DESCRIPTION,
    canonical: `${SITE_ORIGIN}/`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: 'website',
    noindex: /^\/(auth|dashboard|admin)/.test(normalized),
  };
}

function setMetaByName(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaByProperty(property: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// Apply SEO data to the document head. Safe to call repeatedly (last write wins).
export function applySeo(data: SeoData) {
  if (typeof document === 'undefined') return;

  document.title = data.title;
  setMetaByName('description', data.description);
  setMetaByName('robots', data.noindex ? 'noindex, nofollow' : 'index, follow');

  // Canonical
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', data.canonical);

  // Open Graph
  setMetaByProperty('og:title', data.title);
  setMetaByProperty('og:description', data.description);
  setMetaByProperty('og:url', data.canonical);
  setMetaByProperty('og:type', data.ogType || 'website');
  if (data.ogImage) setMetaByProperty('og:image', data.ogImage);

  // Twitter
  setMetaByName('twitter:title', data.title);
  setMetaByName('twitter:description', data.description);
  setMetaByName('twitter:url', data.canonical);
  if (data.ogImage) setMetaByName('twitter:image', data.ogImage);
}
