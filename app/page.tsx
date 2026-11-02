"use client";

import Link from "next/link";
import { COURSES } from "@/lib/courses";
import { currentUnit, dueCount, newWords, useProgress } from "@/lib/progress";
import PixelIcon from "./components/PixelIcon";

const GREETINGS = ["Bonjour", "Coucou", "Salut"];

export default function Today() {
  const [p] = useProgress();
  if (!p) return <div className="h-96" />;

  const unit = currentUnit(p, p.course);
  const deck = COURSES[p.course].decks[unit.name];
  const due = dueCount(p);
  const fresh = newWords(p, p.course).length;
  const goalPct = Math.min(100, (p.today / p.goal) * 100);
  const greet = GREETINGS[new Date().getDate() % GREETINGS.length];

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-4">
        <PixelIcon name="bunny" size={5} />
        <div className="flex-1">
          <h1 className="font-pixel text-2xl">{greet} !</h1>
          <p className="text-sm text-muted">今天也来学一点法语吧</p>
        </div>
      </header>

      <section className="grid grid-cols-3 gap-3">
        <Stat icon="flame" value={p.streak} label="连续天数" />
        <Stat icon="star" value={p.xp} label="经验值" />
        <Stat icon="heart" value={Object.keys(p.known).length} label="已掌握" />
      </section>

      <section className="rounded-3xl border border-line bg-surface p-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-bold">今日目标</span>
          <span className="text-muted">
            {Math.min(p.today, p.goal)} / {p.goal} 经验
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-grass-soft">
          <div className="h-full rounded-full bg-grass transition-all" style={{ width: `${goalPct}%` }} />
        </div>
      </section>

      <section className="rounded-3xl bg-grass p-6 text-white">
        <p className="text-sm font-bold opacity-90">今天的学习 · {COURSES[p.course].name}课程</p>
        <p className="mt-1 text-2xl font-extrabold">
          复习 {due} 个 · 新词 {fresh} 个
        </p>
        <p className="mt-1 text-sm opacity-90">大约 5 分钟</p>
        <Link
          href="/lesson"
          className="btn-3d mt-5 block w-full rounded-2xl bg-white py-4 text-center text-lg font-extrabold text-grass-ink"
        >
          {due + fresh > 0 ? "开始学习" : "今天都学完啦，去练习"}
        </Link>
      </section>

      <Link href="/course" className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 transition hover:border-grass">
        <PixelIcon name={deck.i} size={4} />
        <div className="flex-1">
          <p className="text-xs text-muted">继续学习</p>
          <p className="font-bold">
            {COURSES[p.course].name} › {unit.name}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-grass-soft">
            <div className="h-full bg-grass" style={{ width: `${(unit.known / unit.total) * 100}%` }} />
          </div>
        </div>
        <span className="text-sm text-muted">
          {unit.known}/{unit.total}
        </span>
      </Link>

      <section className="rounded-3xl bg-sun-soft p-5">
        <p className="mb-1 flex items-center gap-2 text-sm font-bold">
          <PixelIcon name="quill" size={2} /> 今日小贴士
        </p>
        <p className="text-sm leading-relaxed">{deck.tip}</p>
      </section>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-3xl border border-line bg-surface py-4">
      <PixelIcon name={icon} size={3} />
      <span className="text-xl font-extrabold">{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}
