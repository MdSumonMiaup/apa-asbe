"use client";

import { useState } from "react";
import { CREDIBILITY, RUMOR_EVENTS, RUMOR_SOURCES, RUMOR_SUBJECTS } from "@/lib/content";
import { pick } from "@/lib/bn";

type Rumor = { text: string; source: string; cred: string };

export default function RumorGenerator() {
  const [rumor, setRumor] = useState<Rumor | null>(null);
  const [msg, setMsg] = useState("");
  const [spin, setSpin] = useState(0);

  const generate = () => {
    setRumor({
      text: `${pick(RUMOR_SUBJECTS)} ${pick(RUMOR_EVENTS)}!`,
      source: pick(RUMOR_SOURCES),
      cred: pick(CREDIBILITY),
    });
    setSpin((s) => s + 1);
    setMsg("");
  };

  const copy = async () => {
    if (!rumor) { setMsg("আগে একটা গুজব বানান, তারপর ফরোয়ার্ড করবেন।"); return; }
    try {
      await navigator.clipboard.writeText(`ব্রেকিং: ${rumor.text}\n— সূত্র: ${rumor.source} (স্যাটায়ার)`);
      setMsg("কপি হয়েছে! ফরোয়ার্ড করার আগে মনে রাখবেন: এটা ফেইক 😄");
    } catch {
      setMsg("কপি করা যায়নি। এটাও হয়তো একটা ষড়যন্ত্র।");
    }
  };

  return (
    <section className="block yellow">
      <p className="kicker">কারখানা</p>
      <h2 className="h-lg">গুজব জেনারেটর</h2>
      <p className="muted">নিজের ইউটিউব চ্যানেলের জন্য ফ্রেশ গুজব বানান। শতভাগ ভিত্তিহীন, শতভাগ ভাইরাল।</p>
      <div className="rumor" key={spin}>
        <span className="breaking">ব্রেকিং</span>
        <p>{rumor ? rumor.text : "বাটনে চাপ দিন, গুজব তৈরি হোক।"}</p>
        {rumor && <small>সূত্র: {rumor.source} · বিশ্বাসযোগ্যতা: {rumor.cred}</small>}
      </div>
      <div className="row">
        <button type="button" className="btn btn-xl" onClick={generate}>🎲 নতুন গুজব</button>
        <button type="button" className="btn btn-xl btn-white" onClick={copy}>📋 কপি করুন</button>
      </div>
      {msg && <p className="fine">{msg}</p>}
    </section>
  );
}
