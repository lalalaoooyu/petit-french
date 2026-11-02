"use client";

import Link from "next/link";
import { useState } from "react";
import { COURSES, deckNames } from "@/lib/courses";
import type { PracticeMode } from "@/lib/lesson";
import { useProgress } from "@/lib/progress";
import PixelIcon from "../components/PixelIcon";

const MODES: { mode: PracticeMode; label: string; icon: string; desc: string }[] = [
  { mode: "card", label: "卡片", icon: "cardI", desc: "逐个看单词和例句" },
  { mode: "fr2zh", label: "看法语选中文", icon: "quill", desc: "10 题" },
  { mode: "zh2fr", label: "看中文选法语", icon: "book", desc: "10 题" },
  { mode: "ear", label: "听音选词", icon: "speaker", desc: "10 题" },
  { mode: "spell", label: "拼写", icon: "keys", desc: "10 题，带重音字母键" },
  { mode: "match", label: "配对", icon: "pair", desc: "2 轮，每轮 5 对" },
];

export default function Practice() {
  const [p] = useProgress();
  const [deck, setDeck] = useState<string | null>(null);
  if (!p) return <div className="h-96" />;

  const course = p.course;
  const names = deckNames(course);
  const current = deck && names.includes(deck) ? deck : names[0];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold">自由练习</h1>
        <p className="text-sm text-muted">{COURSES[course].name}课程 · 在「课程」页可以切换课程</p>
      </header>

      <section>
        <p className="mb-2 text-sm font-bold">选择单元</p>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
          {names.map((n) => (
            <button
              key={n}
              onClick={() => setDeck(n)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl border-2 px-3 py-2 text-sm font-bold ${
                n === current ? "border-grass bg-grass-soft text-grass-ink" : "border-line bg-surface"
              }`}
            >
              <PixelIcon name={COURSES[course].decks[n].i} size={2} />
              {n}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {MODES.map((m) => (
          <Link
            key={m.mode}
            href={`/lesson?course=${course}&deck=${encodeURIComponent(current)}&mode=${m.mode}`}
            className="flex flex-col gap-2 rounded-3xl border border-line bg-surface p-4 transition hover:border-grass"
          >
            <PixelIcon name={m.icon} size={3} />
            <span className="font-bold">{m.label}</span>
            <span className="text-xs text-muted">{m.desc}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
