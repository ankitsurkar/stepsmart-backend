export interface BatchConfig {
  enabled: boolean;
  batchNumber: string;
  batchName: string;
  programTrack: string;
  startDate: string;
  duration: string;
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
  batchNumber: "BATCH #04",
  batchName: "PM-X First Step — Student Placement Edition",
  programTrack: "Final-Year Students & Pre-Finals",
  startDate: "15th November 2026",
  duration: "6 Weeks Live",
  seatsTotal: 25,
  seatsFilled: 18,
  urgencyTag: "Only 7 Seats Remaining",
  badgeText: "APPLICATIONS OPEN 🟢",
  earlyBirdNote: "⚡ Rolling Vetting • Direct 1:1 Mentor Matching",
  ctaText: "Claim Your Cohort Pass ➜",
  ctaTarget: "/students#enroll-student",
  bannerMode: "auto"
};

export const getStoredBatchConfig = (): BatchConfig => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BATCH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
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
