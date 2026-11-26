(() => {
  "use strict";

  // ---------- helpers ----------
  const $ = (id) => document.getElementById(id);
  const bnDigits = "০১২৩৪৫৬৭৮৯";
  const bn = (n) => String(n).replace(/\d/g, (d) => bnDigits[d]);
  const bnNum = (n) => bn(Math.round(n).toLocaleString("en-IN"));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  };
  let toastTimer;
  const toast = (msg) => {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  };

  // ---------- date ----------
  const months = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
  const now0 = new Date();
  $("today").textContent = `${bn(now0.getDate())} ${months[now0.getMonth()]} ${bn(now0.getFullYear())}`;

  // ---------- live status ----------
  const statuses = [
    "জীবিত", "মৃত", "দিল্লিতে", "জুম মিটিংয়ে", "আসছেন", "আসছেন না",
    "ঘুমাচ্ছেন", "অডিও রেকর্ড করছেন", "ভারতের ভিসা নবায়ন করছেন",
    "অজানা", "গোপন", "লোড হচ্ছে…", "ডিসেম্বরের অপেক্ষায়", "সিগন্যাল নাই",
  ];
  let si = 0;
  setInterval(() => { si = (si + 1) % statuses.length; $("live-status").textContent = statuses[si]; }, 1800);
  $("live-status").textContent = statuses[0];

  // ---------- ticker ----------
  const headlines = [
    "দিল্লির এক বারান্দায় একটা শাড়ি শুকাতে দেখা গেছে — বিশেষজ্ঞরা বলছেন 'প্রমাণ মিলেছে'",
    "এক ইউটিউবার দাবি করেছেন আপা মারা গেছেন; ভিডিওর শেষে লাইক-সাবস্ক্রাইব করতে বলেছেন",
    "আরেক ইউটিউবার দাবি করেছেন আপা বেঁচে আছেন; একই থাম্বনেইল ব্যবহার করেছেন",
    "আওয়ামী লীগ নেতা: 'ডিসেম্বরে আপা আসবেন।' সাংবাদিক: 'কোন সালের?' নেতা: 'নেক্সট কোয়েশ্চেন'",
    "ফাঁস হওয়া নতুন অডিও: 'আমি আসব… আমি আসব…' — পরে জানা গেল এটা ডেলিভারি ম্যানের কল",
    "জ্যোতিষী: আপার আসার সম্ভাবনা ৫০%, না আসার সম্ভাবনাও ৫০%, বাকি ১০% ভারতের হাতে",
    "হোয়াটসঅ্যাপ ফরোয়ার্ড: 'এই মেসেজ ১০ জনকে না পাঠালে আপা আসবেন না'",
    "গবেষণা: দেশের ৯৮% মানুষ এখন নিশ্চিত যে তারা কিছুই নিশ্চিত না",
    "হেলিকপ্টার এখনও মুখ খোলেনি — আইনজীবীর সাথে কথা বলে মন্তব্য করবে",
    "আজকের আবহাওয়া: ঢাকায় গুজবের সম্ভাবনা ১০০%, বিকেলে হালকা থেকে মাঝারি কনফিউশন",
    "নেতাকর্মীরা প্রতিদিন বিমানবন্দরে ফুল নিয়ে যাচ্ছেন, ফুল শুকিয়ে যাচ্ছে, নেতাকর্মীরাও",
    "শ্রোডিঙ্গার পরিবার দাবি করেছে, তাদের বিড়ালের তত্ত্ব চুরি করা হয়েছে",
  ];
  const tickerHTML = headlines.map((h) => `<span>${h}</span>`).join("");
  $("ticker").innerHTML = tickerHTML + tickerHTML; // duplicated for seamless loop

  // ---------- Schrödinger's box ----------
  const boxStates = [
    ["🟢", "জীবিত!", "অন্তত আজ সকাল পর্যন্ত। বিকেলে আবার চেক করুন।"],
    ["⚫", "মারা গেছেন!", "সূত্র: ফেসবুক। পরের পোস্টেই আবার জীবিত হয়ে যাবেন।"],
    ["🇮🇳", "দিল্লিতে ব্যস্ত", "পাসপোর্ট নবায়নের লাইনে দাঁড়িয়ে আছেন।"],
    ["📅", "ডিসেম্বরে আসছেন", "কোন ডিসেম্বর? সেটা গোপনীয়।"],
    ["💻", "জুম মিটিংয়ে", "মাইক মিউট, কিন্তু ভাষণ চলছে।"],
    ["🎙️", "নতুন অডিও রেকর্ড করছেন", "রিলিজ হবে রাত ২টায়, যথারীতি।"],
    ["📦", "বাক্স খালি!", "শুধু একটা চিরকুট: 'শেখ হাসিনা পালায় না।'"],
    ["🚁", "হেলিকপ্টার রেডি", "কিন্তু এবার উল্টো দিকে যাবে কিনা নিশ্চিত না।"],
    ["🌀", "একই সাথে জীবিত ও মৃত", "কোয়ান্টাম রাজনীতিতে এটা স্বাভাবিক।"],
    ["😴", "ঘুমাচ্ছেন", "জাগানোর চেষ্টা করবেন না, গুম হয়ে যেতে পারেন।"],
    ["📺", "টিভি দেখছেন", "নিজের মৃত্যুর খবর দেখে হাসছেন (বলে দাবি)।"],
    ["❓", "তথ্য পাওয়া যায়নি", "আরও তথ্যের জন্য ৫০ টাকা বিকাশ করুন (মজা করলাম, করবেন না)।"],
  ];
  let opened = store.get("boxOpened", 0);
  const renderBoxCount = () => {
    $("box-count").textContent = opened ? `আপনি এই পর্যন্ত ${bn(opened)} বার বাক্স খুলেছেন। উত্তর এখনও পাননি।` : "";
  };
  renderBoxCount();
  let lastBox = -1;
  $("open-box").addEventListener("click", () => {
    const box = $("box");
    const res = $("box-result");
    box.classList.remove("open");
    box.classList.add("shake");
    res.innerHTML = "<span class='emoji'>🫨</span>পর্যবেক্ষণ করা হচ্ছে…";
    setTimeout(() => {
      box.classList.remove("shake");
      box.classList.add("open");
      let i;
      do { i = Math.floor(Math.random() * boxStates.length); } while (i === lastBox);
      lastBox = i;
      const [e, title, sub] = boxStates[i];
      res.innerHTML = `<span class="emoji">${e}</span>${title}<br/><span class="small">${sub}</span>`;
      opened += 1;
      store.set("boxOpened", opened);
      renderBoxCount();
    }, 650);
  });

  // ---------- rumor meter ----------
  const meterLines = [
    [0, 15, "৯২% নিশ্চিত মারা গেছেন — একটা ইউটিউব থাম্বনেইলের ভিত্তিতে"],
    [15, 35, "সম্ভবত নাই, তবে একটা নতুন অডিও আসার গুজব আছে"],
    [35, 65, "পুরোপুরি ৫০-৫০। বিজ্ঞানীরাও দ্বিধায়।"],
    [65, 85, "সম্ভবত আছেন — কারণ গতকাল একটা ফেসবুক লাইভ হয়েছে (নাকি পুরনো ছিল?)"],
    [85, 101, "নিশ্চিত বেঁচে আছেন, এবং ডিসেম্বরে আসছেন! (দাবি: স্থানীয় যুবলীগ নেতা)"],
  ];
  const swing = () => {
    const v = Math.random() * 100;
    $("needle").style.transform = `rotate(${(v / 100) * 180 - 90}deg)`;
    const line = meterLines.find(([a, b]) => v >= a && v < b);
    $("meter-reading").textContent = `${bn(Math.round(v))}% — ${line[2]}`;
  };
  setTimeout(swing, 400);
  setInterval(swing, 3500);

  // ---------- countdown ----------
  const FLED_YEAR = 2024;
  const computeTarget = (d) => {
    const y = d.getFullYear();
    if (d.getMonth() < 11) {
      return { target: new Date(y, 11, 1, 0, 0, 0), mode: "before", year: y };
    }
    return { target: new Date(y, 11, 31, 23, 59, 59), mode: "during", year: y };
  };
  const tick = () => {
    const now = new Date();
    const { target, mode, year } = computeTarget(now);
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    $("cd-d").textContent = bn(d);
    $("cd-h").textContent = bn(String(h).padStart(2, "0"));
    $("cd-m").textContent = bn(String(m).padStart(2, "0"));
    $("cd-s").textContent = bn(String(s).padStart(2, "0"));

    $("cd-sub").textContent = mode === "before"
      ? `${bn(year)} সালের ডিসেম্বর শুরু হতে বাকি। এবার নিশ্চিত আসবেন (গতবারও নিশ্চিত ছিল)।`
      : `ডিসেম্বর এসে গেছে! আপা কই? ডিসেম্বর শেষ হতে বাকি:`;

    const missed = Math.max(0, year - FLED_YEAR); // Decembers already passed since 2024 (incl. 2024)
    const list = [];
    for (let yy = FLED_YEAR; yy < year; yy++) list.push(bn(yy));
    $("postponed").textContent = missed > 0
      ? `ইতিমধ্যে মিস হওয়া ডিসেম্বর: ${list.join(", ")} — মোট ${bn(missed)} বার স্থগিত। কাউন্টডাউন শেষ হলে স্বয়ংক্রিয়ভাবে পরের বছরে চলে যাবে।`
      : "";
  };
  tick();
  setInterval(tick, 1000);

  // ---------- waiting room ----------
  const waitLines = [
    "আপা আসছেন…", "আপা প্রায় চলে এসেছেন…", "বিমানবন্দরে ফুল রেডি…",
    "সিগন্যালের জন্য অপেক্ষা…", "দিল্লির জ্যামে আটকে আছেন…", "আর একটু…",
    "এই তো এসে গেলেন…", "আপনার অপেক্ষা আমাদের কাছে গুরুত্বপূর্ণ…",
  ];
  let prog = 0;
  let stuck = 0;
  const progTick = () => {
    if (prog < 99) {
      prog = Math.min(99, prog + Math.random() * 7);
    } else {
      stuck += 1;
      if (stuck > 6) {
        $("progress-text").textContent = "সংযোগ বিচ্ছিন্ন। আগামী ডিসেম্বরে আবার চেষ্টা করা হবে।";
        if (stuck > 9) { prog = 0; stuck = 0; }
        $("progress").style.width = `${prog}%`;
        return;
      }
    }
    $("progress").style.width = `${prog}%`;
    $("progress-text").textContent = `${pick(waitLines)} ${bn(Math.floor(prog))}%`;
  };
  setInterval(progTick, 900);

  // Fake but deterministic-ish counters that grow with time
  const base = Date.UTC(2024, 7, 5); // 5 Aug 2024
  const hoursSince = () => (Date.now() - base) / 36e5;
  let myWait = store.get("joinedWait", 0);
  let myFled = store.get("gaveUp", 0);
  const renderStats = () => {
    const hrs = hoursSince();
    $("waiting-count").textContent = bnNum(4200000 - hrs * 61 + myWait + Math.random() * 30);
    $("fled-count").textContent = bnNum(hrs * 37 + myFled);
    $("tea-count").textContent = bnNum(hrs * 1800 + (Date.now() / 1000) % 1000);
  };
  renderStats();
  setInterval(renderStats, 1500);

  const joinMsgs = [
    "অভিনন্দন! আপনি অপেক্ষার লাইনে ৪২,০০,০০১ নম্বরে আছেন।",
    "আপনার নাম তালিকায় তোলা হয়েছে। ডিসেম্বরে মিছিলের জন্য রেডি থাকুন।",
    "অপেক্ষা করা ঈমানের অংশ — এক আওয়ামী লীগ দার্শনিক।",
    "আপনাকে একটা ফুলের মালা দেওয়া হলো। শুকিয়ে গেলে নতুন কিনবেন।",
  ];
  const fleeMsgs = [
    "বুদ্ধিমানের কাজ। নেত্রীও তাই করেছিলেন।",
    "হেলিকপ্টার বুক করা হচ্ছে… দুঃখিত, সেটা আগেই ব্যবহৃত।",
    "আপনি এখন অফিসিয়ালি 'প্রবাসী নেতা'।",
    "সীমান্তের দিকে দৌড়াবেন না, সেটা পুরনো ট্রেন্ড।",
  ];
  $("join-wait").addEventListener("click", () => {
    myWait += 1; store.set("joinedWait", myWait);
    $("wait-msg").textContent = pick(joinMsgs);
    renderStats();
  });
  $("give-up").addEventListener("click", () => {
    myFled += 1; store.set("gaveUp", myFled);
    $("wait-msg").textContent = pick(fleeMsgs);
    renderStats();
  });

  // ---------- rumor generator ----------
  const subjects = [
    "আপা", "নেত্রী", "দিল্লির এক বাড়ির জানালায় দেখা যাওয়া একটা ছায়া",
    "আপার এক চাচাতো ভাইয়ের পাশের বাসার কাজের লোক", "সজীব ওয়াজেদ জয়ের একটা পুরনো টুইট",
  ];
  const events = [
    "আজ সকালে পরোটা আর ডাল খেয়েছেন",
    "আবারও মারা গেছেন বলে দাবি — এই মাসে তৃতীয়বারের মতো",
    "আবারও বেঁচে উঠেছেন বলে দাবি — সেটাও তৃতীয়বারের মতো",
    "ডিসেম্বরে হেলিকপ্টারে করে ফিরছেন, এবার সামনের দিকে",
    "নতুন অডিওতে বলেছেন 'আমি আসছি', পটভূমিতে প্রেশার কুকারের সিটি",
    "জুমে দলের সভা করেছেন, উপস্থিত ছিলেন ৩ জন ও ১টা বিড়াল",
    "পদ্মা সেতুর একটা ছবি দেখে আবেগাপ্লুত হয়েছেন",
    "নিজের মৃত্যুর খবর শুনে চা খেতে খেতে হেসেছেন",
    "ভারতীয় সিরিয়াল দেখে সময় কাটাচ্ছেন, প্রিয় চরিত্র: ভিলেন শাশুড়ি",
    "নতুন একটা 'উন্নয়নের মহাপরিকল্পনা' লিখছেন, যেটা কেউ চায়নি",
    "জানালা দিয়ে বাংলাদেশের দিকে তাকিয়ে ছিলেন — যদিও জানালাটা পশ্চিমমুখী",
  ];
  const sources = [
    "মামাতো ভাইয়ের ফেসবুক স্ট্যাটাস", "টং দোকানের রফিক ভাই",
    "এক ইউটিউবার, যার থাম্বনেইলে ১২টা লাল তীর", "হোয়াটসঅ্যাপ (Forwarded many times)",
    "রিকশাওয়ালা মামা, যিনি সব জানেন", "এক স্বপ্নে-পাওয়া পীর সাহেব",
    "'নাম প্রকাশে অনিচ্ছুক' এক সূত্র, যিনি আসলে নিজেই", "একটা এআই-জেনারেটেড ছবি",
    "ফুফুর গ্রুপ চ্যাট", "একটা ১৪ সেকেন্ডের টিকটক",
  ];
  const credibility = ["০.০১%", "শূন্য", "ঋণাত্মক", "আবহাওয়ার পূর্বাভাসের চেয়েও কম", "আপনার এক্স-এর প্রতিশ্রুতির সমান"];
  let currentRumor = "";
  $("gen-rumor").addEventListener("click", () => {
    const r = `ব্রেকিং: ${pick(subjects)} ${pick(events)}!`;
    const src = pick(sources);
    currentRumor = `${r}\n— সূত্র: ${src} (স্যাটায়ার)`;
    $("rumor").textContent = r;
    $("rumor-source").textContent = `সূত্র: ${src} · বিশ্বাসযোগ্যতা: ${pick(credibility)}`;
  });
  $("copy-rumor").addEventListener("click", async () => {
    if (!currentRumor) { toast("আগে একটা গুজব বানান, তারপর ফরোয়ার্ড করবেন।"); return; }
    try {
      await navigator.clipboard.writeText(currentRumor);
      toast("কপি হয়েছে! ফরোয়ার্ড করার আগে মনে রাখবেন: এটা ফেইক 😄");
    } catch {
      toast("কপি করা যায়নি। এটাও হয়তো একটা ষড়যন্ত্র।");
    }
  });

  // ---------- fact check ----------
  const verdicts = [
    ["আংশিক সত্য", "কিছু অংশ সত্য, কিছু অংশ মিথ্যা, বাকিটা ভারতের কাছে।"],
    ["সত্য (বুধবার পর্যন্ত)", "বৃহস্পতিবার নতুন গুজব আসবে, তখন আবার যাচাই করুন।"],
    ["মিথ্যা", "তবে ডিসেম্বরে সত্য হয়ে যেতে পারে। কোন ডিসেম্বর, জানা নেই।"],
    ["অযাচাইযোগ্য", "আমাদের ফ্যাক্ট-চেকার যাচাই করতে দিল্লি গিয়েছিলেন, এখনও ফেরেননি।"],
    ["সত্য ও মিথ্যা একসাথে", "শ্রোডিঙ্গারের নিয়মে এটা সম্পূর্ণ বৈধ।"],
    ["পুরোপুরি ভুয়া", "সূত্রটা ছিল একটা ইউটিউব থাম্বনেইল, ভিডিওতে এই নিয়ে কিছুই নেই।"],
    ["গোপনীয়", "এই তথ্য জানলে আপনাকে আয়নাঘরে নেওয়া হতো (পুরনো আমলে)।"],
    ["অসম্ভব রকম সম্ভব", "আমাদের আন্দাজ ইঞ্জিন অতিরিক্ত গরম হয়ে গেছে।"],
  ];
  $("fact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = $("fact-input").value.trim();
    const out = $("verdict");
    if (!q) { out.innerHTML = "<p>কিছু না লিখলে যাচাই করব কী? যদিও আমরা না লিখলেও খবর বানাতে পারি।</p>"; return; }
    out.innerHTML = "<p>🔍 আন্দাজ ইঞ্জিন চালু হচ্ছে… চা খাওয়া হচ্ছে… ফেসবুক স্ক্রল হচ্ছে…</p>";
    setTimeout(() => {
      const [v, why] = pick(verdicts);
      const conf = 3 + Math.floor(Math.random() * 40);
      out.innerHTML = "";
      const stamp = document.createElement("span");
      stamp.className = "stamp";
      stamp.textContent = v;
      const p1 = document.createElement("p");
      p1.textContent = `"${q}" — ${why}`;
      const p2 = document.createElement("p");
      p2.className = "small";
      p2.textContent = `নিশ্চয়তা: ${bn(conf)}% · ব্যবহৃত প্রমাণ: শূন্য · খরচ হওয়া চা: ${bn(1 + Math.floor(Math.random() * 6))} কাপ`;
      out.append(stamp, p1, p2);
    }, 1200);
  });

  // ---------- poll ----------
  const pollLabels = ["আপা বেঁচে আছেন", "আপা নাই", "ডিসেম্বরে আসবেন", "আমি আর নিউজ দেখি না"];
  $("poll").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const chosen = Number(btn.dataset.v);
    // Rigged, as per tradition: whatever you pick, the "official" winner is decided already.
    const results = [12, 11, 0.4, 76.6];
    const winner = 2; // ডিসেম্বরে আসবেন
    results[winner] = 153.8; // more than 100%, naturally
    const html = pollLabels.map((l, i) => `
      <div class="bar-row ${i === winner ? "win" : ""}">
        <div class="lbl"><span>${l}${i === chosen ? " (আপনার ভোট)" : ""}</span><span>${bn(results[i])}%</span></div>
        <div class="bar"><i data-w="${Math.min(100, results[i])}"></i></div>
      </div>`).join("");
    $("poll-result").innerHTML = html +
      `<p class="small">বিজয়ী: <strong>ডিসেম্বরে আসবেন</strong> — ১৫৩.৮% ভোটে। ভোটার উপস্থিতি: ভোট দেওয়ার আগেই গণনা শেষ। আপনার ভোট সফলভাবে উপেক্ষা করা হয়েছে, ধন্যবাদ।</p>`;
    requestAnimationFrame(() => {
      document.querySelectorAll("#poll-result .bar i").forEach((el) => { el.style.width = `${el.dataset.w}%`; });
    });
  });
})();
