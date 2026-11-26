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

export const metadata: Metadata = {
  title: "আপা আসবে?",
  description:
    "আপা বেঁচে আছেন নাকি নাই, আসবেন নাকি আসবেন না — জাতির সবচেয়ে বড় কনফিউশনের একমাত্র স্যাটায়ার পোর্টাল।",
  openGraph: {
    title: "আপা আসবে?",
    description: "শ্রোডিঙ্গারের আপা: একই সাথে জীবিত, মৃত, দিল্লিতে এবং ডিসেম্বরে আসছেন। ভোট দিন!",
    type: "website",
    locale: "bn_BD",
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
