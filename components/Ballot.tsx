"use client";

import { useEffect, useMemo, useState } from "react";
import { POLL_OPTIONS, OFFICIAL_WINNER } from "@/lib/content";
import { HELICOPTER_DAY, bnNum, store, toBn } from "@/lib/bn";

type Tally = Record<string, number>;

const VOTE_KEY = "apa-vote";
const MY_VOTES_KEY = "apa-my-votes";

function publicTally(myVotes: Tally): Tally {
  const hours = (Date.now() - HELICOPTER_DAY) / 36e5;
  const t: Tally = {};
  for (const o of POLL_OPTIONS) t[o.id] = o.base + hours * o.rate + (myVotes[o.id] ?? 0);
  return t;
}

export default function Ballot() {
  const [selected, setSelected] = useState<string | null>(null);
  const [voted, setVoted] = useState<string | null>(null);
  const [myVotes, setMyVotes] = useState<Tally>({});
  const [tally, setTally] = useState<Tally | null>(null);
  const [stamping, setStamping] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  // Load the visitor's previous vote after mount (avoids hydration mismatch).
  useEffect(() => {
    const mv = store.get<Tally>(MY_VOTES_KEY, {});
    setMyVotes(mv);
    setVoted(store.get<string | null>(VOTE_KEY, null));
    setTally(publicTally(mv));
    const id = setInterval(() => setTally(publicTally(store.get<Tally>(MY_VOTES_KEY, {}))), 4000);
    return () => clearInterval(id);
  }, []);

  const total = useMemo(
    () => (tally ? Object.values(tally).reduce((a, b) => a + b, 0) : 0),
    [tally],
  );

  const submit = () => {
    if (!selected) {
      setNudge(true);
      setTimeout(() => setNudge(false), 600);
      return;
    }
    setStamping(true);
    setTimeout(() => {
      const mv = { ...myVotes, [selected]: (myVotes[selected] ?? 0) + 1 };
      setMyVotes(mv);
      store.set(MY_VOTES_KEY, mv);
      store.set(VOTE_KEY, selected);
      setTally(publicTally(mv));
      setVoted(selected);
      setStamping(false);
    }, 750);
  };

  const revote = () => {
    setVoted(null);
    setSelected(null);
    setShareMsg("");
    store.set(VOTE_KEY, null);
  };

  const share = async () => {
    const opt = POLL_OPTIONS.find((o) => o.id === voted);
    const text = `আমি "আপা আসবে?" জরিপে ভোট দিলাম: ${opt?.symbol} ${opt?.label}। অফিসিয়াল ফলাফল অবশ্য আগেই ঠিক করা আছে 😂`;
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: "আপা আসবে?", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setShareMsg("লিংক কপি হয়েছে! বন্ধুদের পাঠান, জাল ভোট ঐতিহ্য বজায় রাখুন।");
    } catch {
      setShareMsg("শেয়ার করা গেল না। এটাও হয়তো একটা ষড়যন্ত্র।");
    }
  };

  return (
    <section className="block ballot" id="vote" aria-labelledby="ballot-title">
      <div className="sticker sticker-right">ভোট দিন!</div>
      <p className="kicker">জনমত জরিপ · ব্যালট নং {toBn(420)}</p>
      <h2 id="ballot-title" className="h-xl">আপনার কী মনে হয়?</h2>

      {!voted ? (
        <>
          <ol className="steps">
            <li><b>১</b> পছন্দের ঘরে ক্লিক করুন</li>
            <li><b>২</b> &ldquo;সিল মারুন&rdquo; চাপুন</li>
            <li><b>৩</b> ফলাফল দেখুন (যেটা আগেই ঠিক করা)</li>
          </ol>

          <div className={`ballot-paper${nudge ? " shake" : ""}`} role="radiogroup" aria-label="ভোটের অপশন">
            {POLL_OPTIONS.map((o, i) => {
              const isSel = selected === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={isSel}
                  className={`ballot-row${isSel ? " selected" : ""}`}
                  onClick={() => setSelected(o.id)}
                >
                  <span className="ballot-num">{toBn(i + 1)}</span>
                  <span className="ballot-label">{o.label}</span>
                  <span className="ballot-symbol" title={`প্রতীক: ${o.symbolName}`}>
                    <span aria-hidden>{o.symbol}</span>
                    <small>{o.symbolName}</small>
                  </span>
                  <span className="ballot-seal" aria-hidden>
                    {isSel && <span className={`seal${stamping ? " seal-hit" : ""}`}>সিল</span>}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ballot-actions">
            <button type="button" className="btn btn-xl btn-red" onClick={submit} disabled={stamping}>
              {stamping ? "সিল মারা হচ্ছে… 🔨" : "🗳️ সিল মারুন"}
            </button>
            <p className="hint">
              {nudge
                ? "👆 আগে একটা ঘর বাছাই করুন! খালি ব্যালট রাতে আমরাই পূরণ করি।"
                : selected
                  ? "চমৎকার! এবার সিল মারুন।"
                  : "কোনো ঘর বাছাই করা হয়নি।"}
            </p>
          </div>
        </>
      ) : (
        <div className="results">
          <div className="night-note">
            🌙 দারুণ! আপনার ভোট গৃহীত হয়েছে। মজার ব্যাপার, আপনার ভোট গতকাল রাতেই দেওয়া হয়ে গিয়েছিল।
          </div>

          <div className="results-grid">
            <div className="result-card">
              <h3>জনগণের রায়</h3>
              <p className="muted">মোট ভোট: {bnNum(total)} (প্রতি কয়েক সেকেন্ডে বাড়ছে)</p>
              {tally &&
                [...POLL_OPTIONS]
                  .sort((a, b) => tally[b.id] - tally[a.id])
                  .map((o) => {
                    const pct = total ? (tally[o.id] / total) * 100 : 0;
                    const mine = voted === o.id;
                    return (
                      <div key={o.id} className={`bar-row${mine ? " mine" : ""}`}>
                        <div className="bar-label">
                          <span>
                            {o.symbol} {o.label}
                            {mine && <em className="you">আপনার ভোট</em>}
                          </span>
                          <b>{toBn(pct.toFixed(1))}%</b>
                        </div>
                        <div className="bar"><i style={{ width: `${pct}%` }} /></div>
                      </div>
                    );
                  })}
            </div>

            <div className="result-card official">
              <div className="sticker sticker-left">অফিসিয়াল</div>
              <h3>নির্বাচন কমিশনের ঘোষিত ফলাফল</h3>
              <p className="muted">ভোটগ্রহণ শুরুর আগেই ঘোষিত</p>
              {POLL_OPTIONS.map((o) => {
                const win = o.id === OFFICIAL_WINNER;
                const pct = win ? 153.8 : 0;
                return (
                  <div key={o.id} className={`bar-row${win ? " win" : ""}`}>
                    <div className="bar-label">
                      <span>{o.symbol} {o.label}</span>
                      <b>{toBn(pct)}%</b>
                    </div>
                    <div className="bar"><i style={{ width: `${Math.min(100, pct)}%` }} /></div>
                  </div>
                );
              })}
              <p className="fine">
                বিজয়ী: <b>⛵ নৌকা — ডিসেম্বরে আসবেন</b> (১৫৩.৮%)। ভোটার উপস্থিতি: ৫%।
                বাকি ১৪৮.৮% ভোট রাতের শিফটে দেওয়া। আপনার ভোট সফলভাবে উপেক্ষা করা হয়েছে, ধন্যবাদ।
              </p>
            </div>
          </div>

          <div className="ballot-actions">
            <button type="button" className="btn btn-xl" onClick={share}>📣 বন্ধুদের ভোট দিতে বলুন</button>
            <button type="button" className="btn btn-xl btn-white" onClick={revote}>🔁 আবার ভোট দিন (জাল ভোট ঐতিহ্য)</button>
          </div>
          {shareMsg && <p className="hint">{shareMsg}</p>}
        </div>
      )}
    </section>
  );
}
