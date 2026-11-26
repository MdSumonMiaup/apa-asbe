const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Convert Latin digits in a number/string to Bangla digits. */
export const toBn = (n: number | string) =>
  String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

/** Round, group with Indian-style commas, and convert to Bangla digits. */
export const bnNum = (n: number) => toBn(Math.round(n).toLocaleString("en-IN"));

export const pad2 = (n: number) => toBn(String(n).padStart(2, "0"));

export const pick = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

/** Pick a random index different from `prev`. */
export const pickIndexExcept = (len: number, prev: number) => {
  let i: number;
  do i = Math.floor(Math.random() * len);
  while (len > 1 && i === prev);
  return i;
};

/** localStorage wrapper that never throws (private mode, blocked storage…). */
export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : (JSON.parse(v) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
};

export const MONTHS_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

/** 5 August 2024 — the day of the famous helicopter ride. */
export const HELICOPTER_DAY = Date.UTC(2024, 7, 5);
