export interface BatchConfig {
  enabled: boolean;
  batchNumber: string;
  batchName: string;
  programTrack: string;
  startDate: string;
  duration: string;
  originalPrice?: string;
  discountedPrice?: string;
  seatsTotal: number;
  seatsFilled: number;
  urgencyTag: string;
  badgeText: string;
  earlyBirdNote: string;
  ctaText: string;
  ctaTarget: string;
  bannerMode: 'auto' | 'batch_first' | 'event_first';
}

export const LOCAL_STORAGE_BATCH_KEY = 'pmx_custom_batch_config';

export const DEFAULT_BATCH_CONFIG: BatchConfig = {
  enabled: true,
  batchNumber: "BATCH #03",
  batchName: "PM-X ACCELERATOR",
  programTrack: "Working Professionals & Career Switchers",
  startDate: "23rd November 2026",
  duration: "10 Weeks Live",
  originalPrice: "₹21,000",
  discountedPrice: "₹15,000",
  seatsTotal: 20,
  seatsFilled: 6,
  urgencyTag: "Groups capped at 10-20 seats",
  badgeText: "APPLICATIONS OPEN 🟢",
  earlyBirdNote: "⚡ Rolling Vetting • Direct 1:1 Mentor Matching",
  ctaText: "Connect 1:1 ➜",
  ctaTarget: "https://wa.me/message/GH5C7YLAYIEHN1",
  bannerMode: "auto"
};

export const getStoredBatchConfig = (): BatchConfig => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BATCH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate legacy default student batch values to PM-X ACCELERATOR
      if (parsed.batchName === "PM-X First Step — Student Placement Edition") {
        parsed.batchName = DEFAULT_BATCH_CONFIG.batchName;
      }
      if (parsed.ctaTarget === "/students#enroll-student" || parsed.ctaTarget === "/professionals#enroll" || !parsed.ctaTarget) {
        parsed.ctaTarget = DEFAULT_BATCH_CONFIG.ctaTarget;
      }
      if (parsed.ctaText === "Claim Your Cohort Pass ➜" || parsed.ctaText === "Claim Your Cohort Spot" || !parsed.ctaText) {
        parsed.ctaText = DEFAULT_BATCH_CONFIG.ctaText;
      }
      if (!parsed.originalPrice) {
        parsed.originalPrice = DEFAULT_BATCH_CONFIG.originalPrice;
      }
      if (!parsed.discountedPrice) {
        parsed.discountedPrice = DEFAULT_BATCH_CONFIG.discountedPrice;
      }
      if (parsed.batchNumber === "BATCH #04") {
        parsed.batchNumber = DEFAULT_BATCH_CONFIG.batchNumber;
      }
      if (parsed.urgencyTag === "Only 7 Seats Remaining") {
        parsed.urgencyTag = DEFAULT_BATCH_CONFIG.urgencyTag;
      }
      if (parsed.seatsFilled === 18 && parsed.seatsTotal === 25) {
        parsed.seatsFilled = DEFAULT_BATCH_CONFIG.seatsFilled;
      }
      if (parsed.duration === "6 Weeks Live") {
        parsed.duration = DEFAULT_BATCH_CONFIG.duration;
      }
      return { ...DEFAULT_BATCH_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed to read stored batch config', e);
  }
  return DEFAULT_BATCH_CONFIG;
};

export const saveStoredBatchConfig = (config: BatchConfig): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_BATCH_KEY, JSON.stringify(config));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('pmx_batch_updated'));
    }
  } catch (e) {
    console.error('Failed to save stored batch config', e);
  }
};
