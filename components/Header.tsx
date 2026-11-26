"use client";

import { useEffect, useState } from "react";
import { HEADLINES, LIVE_STATUSES } from "@/lib/content";
import { MONTHS_BN, toBn } from "@/lib/bn";

export default function Header() {
  const [statusIdx, setStatusIdx] = useState(0);
  const [today, setToday] = useState("আজ");

  useEffect(() => {
    const d = new Date();
    setToday(`${toBn(d.getDate())} ${MONTHS_BN[d.getMonth()]} ${toBn(d.getFullYear())}`);
    const id = setInterval(() => setStatusIdx((i) => (i + 1) % LIVE_STATUSES.length), 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="topstrip">⚠️ এটি সম্পূর্ণ ব্যঙ্গাত্মক (স্যাটায়ার) ওয়েবসাইট। এখানের কোনো &ldquo;খবর&rdquo; সত্য নয় — ঠিক যেমন ফেসবুকের অর্ধেক খবর।</div>

      <header className="masthead">
        <div className="meta">
          <span>{today}</span>
          <span>সংস্করণ: অনির্দিষ্ট</span>
          <span>দাম: একটা লাইক</span>
        </div>

        <h1 className="title">
          আপা<br />আসবে<span className="q">?</span>
        </h1>
        <div className="sticker sticker-title">১০০% গুজব-মুক্ত*<small>*মিথ্যা</small></div>

        <div className="masthead-row">
          <div className="live">
            <span className="dot" />
            লাইভ অবস্থা:
            <strong key={statusIdx} className="flip">{LIVE_STATUSES[statusIdx]}</strong>
          </div>
          <a className="btn btn-xl btn-red" href="#vote">🗳️ ভোট দিন</a>
        </div>
      </header>

      <div className="ticker" aria-label="ব্রেকিং গুজব">
        <span className="ticker-label">ব্রেকিং গুজব</span>
        <div className="ticker-track">
          <div className="ticker-inner">
            {[...HEADLINES, ...HEADLINES].map((h, i) => (
              <span key={i} aria-hidden={i >= HEADLINES.length}>{h}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
