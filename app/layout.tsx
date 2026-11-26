import type { Metadata, Viewport } from "next";
import { Anek_Bangla, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const display = Anek_Bangla({
  subsets: ["bengali", "latin"],
  weight: ["500", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// Absolute base for og:image / twitter:image URLs.
// SITE_URL can be set on Vercel for a custom domain; otherwise Vercel's production domain is used.
const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const shareTitle = "আপা আসবে? 🚁 জীবিত, মৃত, নাকি দিল্লিতে?";
const shareDescription =
  "কেউ বলে আপা নাই, কেউ বলে আছেন, কেউ বলে ডিসেম্বরে আসবেন। আপনি কী মনে করেন? সিল মারুন — অফিসিয়াল ফলাফল অবশ্য আগেই ঘোষিত (নৌকা ১৫৩.৮%)।";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "আপা আসবে?",
  description:
    "আপা বেঁচে আছেন নাকি নাই, আসবেন নাকি আসবেন না — জাতির সবচেয়ে বড় কনফিউশনের একমাত্র স্যাটায়ার পোর্টাল।",
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    siteName: "আপা আসবে?",
    url: "/",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚁</text></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffe14d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
