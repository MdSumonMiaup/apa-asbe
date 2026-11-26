"use client";

import { useEffect, useState } from "react";
import { METER_LINES } from "@/lib/content";
import { toBn } from "@/lib/bn";

export default function RumorMeter() {
  const [v, setV] = useState<number | null>(null);

  useEffect(() => {
    const swing = () => setV(Math.random() * 100);
    const t = setTimeout(swing, 300);
    const id = setInterval(swing, 3200);
    return () => { clearTimeout(t); clearInterval(id); };
  }, []);

  const angle = v === null ? 0 : (v / 100) * 180 - 90;
  const line = v === null ? null : METER_LINES.find(([a, b]) => v >= a && v < b);

  return (
    <section className="block white">
      <p className="kicker">জরিপ বিভাগ</p>
      <h2 className="h-lg">গুজব-ও-মিটার</h2>
      <p className="muted">ফেসবুক, ইউটিউব থাম্বনেইল আর চায়ের দোকানের রিয়েল-টাইম ডেটা থেকে হিসাব করা।</p>
      <div className="gauge">
        <svg viewBox="0 0 200 116" role="img" aria-label="গুজব মিটার">
          <path d="M20 100 A80 80 0 0 1 100 20" className="g-red" />
          <path d="M100 20 A80 80 0 0 1 180 100" className="g-green" />
          <line
            x1="100" y1="100" x2="100" y2="30"
            className="needle"
            style={{ transform: `rotate(${angle}deg)` }}
          />
          <circle cx="100" cy="100" r="9" className="hub" />
        </svg>
        <div className="gauge-labels"><span>☠️ নাই</span><span>আছেন 💚</span></div>
      </div>
      <p className="meter-reading">
        {v === null ? "হিসাব চলছে…" : <><b>{toBn(Math.round(v))}%</b> — {line?.[2]}</>}
      </p>
    </section>
  );
}
