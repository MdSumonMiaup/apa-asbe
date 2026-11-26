"use client";

import { useEffect, useRef, useState } from "react";
import { BOX_STATES } from "@/lib/content";
import { pickIndexExcept, store, toBn } from "@/lib/bn";

export default function SchrodingerBox() {
  const [phase, setPhase] = useState<"closed" | "shaking" | "open">("closed");
  const [idx, setIdx] = useState(-1);
  const [count, setCount] = useState(0);
  const last = useRef(-1);

  useEffect(() => setCount(store.get("apa-box", 0)), []);

  const open = () => {
    setPhase("shaking");
    setTimeout(() => {
      const i = pickIndexExcept(BOX_STATES.length, last.current);
      last.current = i;
      setIdx(i);
      setPhase("open");
      setCount((c) => {
        store.set("apa-box", c + 1);
        return c + 1;
      });
    }, 650);
  };

  const state = idx >= 0 ? BOX_STATES[idx] : null;

  return (
    <section className="block pink">
      <p className="kicker">বিজ্ঞান বিভাগ</p>
      <h2 className="h-lg">শ্রোডিঙ্গারের আপা</h2>
      <p>
        কোয়ান্টাম পদার্থবিদ্যা অনুযায়ী, যতক্ষণ না কেউ দিল্লির বাক্সটা খুলে দেখছে, ততক্ষণ আপা একই সাথে
        জীবিত, মৃত, অসুস্থ, সুস্থ এবং ডিসেম্বরে আসছেন।
      </p>

      <div className="box-stage">
        <div className={`box ${phase === "shaking" ? "shake" : ""} ${phase === "open" ? "open" : ""}`}>
          <div className="box-lid" />
          <div className="box-body"><span>দিল্লি<br />ফ্র্যাজাইল</span></div>
        </div>
        <div className="box-result" aria-live="polite">
          {phase === "shaking" && <><span className="emoji">🫨</span>পর্যবেক্ষণ করা হচ্ছে…</>}
          {phase === "open" && state && (
            <>
              <span className="emoji">{state[0]}</span>
              <b>{state[1]}</b>
              <small>{state[2]}</small>
            </>
          )}
        </div>
      </div>

      <button type="button" className="btn btn-xl" onClick={open} disabled={phase === "shaking"}>
        📦 {phase === "open" ? "আবার খুলুন" : "বাক্স খুলুন"}
      </button>
      {count > 0 && <p className="fine">আপনি {toBn(count)} বার বাক্স খুলেছেন। উত্তর এখনও পাননি।</p>}
    </section>
  );
}
