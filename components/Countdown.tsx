"use client";

import { useEffect, useState } from "react";
import { pad2, toBn } from "@/lib/bn";

const FIRST_MISSED = 2024;

function compute(now: Date) {
  const y = now.getFullYear();
  const during = now.getMonth() === 11;
  const target = during ? new Date(y, 11, 31, 23, 59, 59) : new Date(y, 11, 1);
  let diff = Math.max(0, target.getTime() - now.getTime());
  const d = Math.floor(diff / 864e5); diff -= d * 864e5;
  const h = Math.floor(diff / 36e5); diff -= h * 36e5;
  const m = Math.floor(diff / 6e4); diff -= m * 6e4;
  const s = Math.floor(diff / 1e3);
  const missed: number[] = [];
  for (let yy = FIRST_MISSED; yy < y; yy++) missed.push(yy);
  return { y, during, d, h, m, s, missed };
}

export default function Countdown() {
  const [t, setT] = useState<ReturnType<typeof compute> | null>(null);

  useEffect(() => {
    setT(compute(new Date()));
    const id = setInterval(() => setT(compute(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="block black countdown-block">
      <div className="sticker sticker-right yellow">জরুরি!</div>
      <p className="kicker">জরুরি ঘোষণা</p>
      <h2 className="h-xl">আপা আসার কাউন্টডাউন</h2>
      <p>
        {!t
          ? "ডিসেম্বরে আসছেন। কোন ডিসেম্বর সেটা পরে জানানো হবে।"
          : t.during
            ? "ডিসেম্বর এসে গেছে! আপা কই? ডিসেম্বর শেষ হতে বাকি:"
            : `${toBn(t.y)} সালের ডিসেম্বর শুরু হতে বাকি। এবার নিশ্চিত আসবেন (গতবারও নিশ্চিত ছিল)।`}
      </p>
      <div className="cd">
        {[
          [t ? toBn(t.d) : "–", "দিন"],
          [t ? pad2(t.h) : "–", "ঘণ্টা"],
          [t ? pad2(t.m) : "–", "মিনিট"],
          [t ? pad2(t.s) : "–", "সেকেন্ড"],
        ].map(([n, l]) => (
          <div key={l}><b>{n}</b><span>{l}</span></div>
        ))}
      </div>
      {t && t.missed.length > 0 && (
        <p className="missed">
          ইতিমধ্যে মিস হওয়া ডিসেম্বর:{" "}
          {t.missed.map((yy) => <s key={yy}>{toBn(yy)}</s>)}{" "}
          — মোট {toBn(t.missed.length)} বার স্থগিত। কাউন্টডাউন শেষ হলে স্বয়ংক্রিয়ভাবে পরের বছরে চলে যাবে।
        </p>
      )}
    </section>
  );
}
