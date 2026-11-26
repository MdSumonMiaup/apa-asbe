"use client";

import { useEffect, useRef, useState } from "react";
import { FLEE_MSGS, JOIN_MSGS, WAIT_LINES } from "@/lib/content";
import { HELICOPTER_DAY, bnNum, pick, store, toBn } from "@/lib/bn";

export default function WaitingRoom() {
  const [prog, setProg] = useState(0);
  const [label, setLabel] = useState(WAIT_LINES[0]);
  const [stats, setStats] = useState<[number, number, number] | null>(null);
  const [msg, setMsg] = useState("");
  const mine = useRef({ wait: 0, fled: 0 });
  const stuck = useRef(0);

  useEffect(() => {
    mine.current = { wait: store.get("apa-wait", 0), fled: store.get("apa-fled", 0) };

    const renderStats = () => {
      const hrs = (Date.now() - HELICOPTER_DAY) / 36e5;
      setStats([
        4_200_000 - hrs * 61 + mine.current.wait + Math.random() * 30,
        hrs * 37 + mine.current.fled,
        hrs * 1800 + ((Date.now() / 1000) % 1000),
      ]);
    };
    renderStats();
    const s = setInterval(renderStats, 1500);

    const p = setInterval(() => {
      setProg((cur) => {
        if (cur < 99) {
          const next = Math.min(99, cur + Math.random() * 7);
          setLabel(pick(WAIT_LINES));
          return next;
        }
        stuck.current += 1;
        if (stuck.current > 9) { stuck.current = 0; setLabel(WAIT_LINES[0]); return 0; }
        if (stuck.current > 5) setLabel("সংযোগ বিচ্ছিন্ন। আগামী ডিসেম্বরে আবার চেষ্টা করা হবে।");
        return cur;
      });
    }, 900);

    return () => { clearInterval(s); clearInterval(p); };
  }, []);

  const join = () => {
    mine.current.wait += 1;
    store.set("apa-wait", mine.current.wait);
    setMsg(pick(JOIN_MSGS));
  };
  const flee = () => {
    mine.current.fled += 1;
    store.set("apa-fled", mine.current.fled);
    setMsg(pick(FLEE_MSGS));
  };

  return (
    <section className="block green">
      <p className="kicker">দলীয় কার্যালয়</p>
      <h2 className="h-xl">ওয়েটিং রুম</h2>
      <p>দয়া করে অপেক্ষা করুন। আপনার নেত্রী বর্তমানে অন্য একটি দেশে ব্যস্ত আছেন। আপনার অপেক্ষা আমাদের কাছে গুরুত্বপূর্ণ।</p>

      <div className="progress" role="progressbar" aria-valuenow={Math.floor(prog)} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${prog}%` }} />
        <span className="progress-pct">{toBn(Math.floor(prog))}%</span>
      </div>
      <p className="progress-text">{label}</p>

      <div className="stats">
        <div><b>{stats ? bnNum(stats[0]) : "—"}</b><span>অপেক্ষারত নেতাকর্মী</span></div>
        <div><b>{stats ? bnNum(stats[1]) : "—"}</b><span>অপেক্ষা করতে করতে বিদেশে চলে গেছেন</span></div>
        <div><b>{stats ? bnNum(stats[2]) : "—"}</b><span>কাপ চা শেষ</span></div>
      </div>

      <div className="row">
        <button type="button" className="btn btn-xl btn-white" onClick={join}>🙋 আমিও অপেক্ষা করব</button>
        <button type="button" className="btn btn-xl btn-red" onClick={flee}>🏃 থাক, আমি পালাই</button>
      </div>
      {msg && <p className="speech">{msg}</p>}
    </section>
  );
}
