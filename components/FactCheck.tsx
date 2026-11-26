"use client";

import { useState, type FormEvent } from "react";
import { VERDICTS } from "@/lib/content";
import { pick, toBn } from "@/lib/bn";

type Result = { q: string; stamp: string; why: string; conf: number; tea: number };

export default function FactCheck() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [res, setRes] = useState<Result | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) { setEmpty(true); setRes(null); return; }
    setEmpty(false);
    setBusy(true);
    setRes(null);
    setTimeout(() => {
      const [stamp, why] = pick(VERDICTS);
      setRes({ q: query, stamp, why, conf: 3 + Math.floor(Math.random() * 40), tea: 1 + Math.floor(Math.random() * 6) });
      setBusy(false);
    }, 1100);
  };

  return (
    <section className="block white">
      <p className="kicker">যাচাই বিভাগ</p>
      <h2 className="h-lg">গুজব যাচাই কেন্দ্র</h2>
      <p className="muted">যেকোনো খবর লিখুন। আমাদের অত্যাধুনিক &ldquo;আন্দাজ ইঞ্জিন&rdquo; সেটা যাচাই করবে।</p>
      <form onSubmit={submit} className="fact-form">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="যেমন: আপা নাকি কাল রাতে…"
          aria-label="যে খবরটা যাচাই করতে চান"
        />
        <button className="btn btn-xl" type="submit" disabled={busy}>যাচাই করুন</button>
      </form>
      <div className="verdict" aria-live="polite">
        {empty && <p>কিছু না লিখলে যাচাই করব কী? যদিও আমরা না লিখলেও খবর বানাতে পারি।</p>}
        {busy && <p>🔍 আন্দাজ ইঞ্জিন চালু হচ্ছে… চা খাওয়া হচ্ছে… ফেসবুক স্ক্রল হচ্ছে…</p>}
        {res && (
          <>
            <span className="stamp">{res.stamp}</span>
            <p>&ldquo;{res.q}&rdquo; — {res.why}</p>
            <p className="fine">
              নিশ্চয়তা: {toBn(res.conf)}% · ব্যবহৃত প্রমাণ: শূন্য · খরচ হওয়া চা: {toBn(res.tea)} কাপ
            </p>
          </>
        )}
      </div>
    </section>
  );
}
