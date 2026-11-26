import Header from "@/components/Header";
import Ballot from "@/components/Ballot";
import SchrodingerBox from "@/components/SchrodingerBox";
import RumorMeter from "@/components/RumorMeter";
import Countdown from "@/components/Countdown";
import WaitingRoom from "@/components/WaitingRoom";
import RumorGenerator from "@/components/RumorGenerator";
import FactCheck from "@/components/FactCheck";
import { QUOTES } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Ballot />

        <div className="grid-2">
          <SchrodingerBox />
          <RumorMeter />
        </div>

        <Countdown />
        <WaitingRoom />

        <div className="grid-2">
          <RumorGenerator />
          <FactCheck />
        </div>

        <section className="block white">
          <p className="kicker">আর্কাইভ</p>
          <h2 className="h-lg">বিখ্যাত উক্তি ও তার পরবর্তী ঘটনা</h2>
          <div className="quotes">
            {QUOTES.map(([q, after]) => (
              <figure key={q}>
                <blockquote>&ldquo;{q}&rdquo;</blockquote>
                <figcaption>→ {after}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p className="footer-big">আপা আসবে?</p>
        <p>
          একটি নির্ভেজাল স্যাটায়ার প্রজেক্ট। কোনো ব্যক্তি, দল বা সংবাদমাধ্যমের সাথে এর কোনো সম্পর্ক নেই।
          সব &ldquo;খবর&rdquo;, &ldquo;সূত্র&rdquo; ও &ldquo;জরিপ&rdquo; কাল্পনিক।
        </p>
        <p className="fine">কোনো গুজব শেয়ার করার আগে যাচাই করুন। (আমাদের এখানে না, আসল জায়গায়।)</p>
      </footer>
    </>
  );
}
