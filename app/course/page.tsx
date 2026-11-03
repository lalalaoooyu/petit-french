"use client";

import Link from "next/link";
import { useState } from "react";
import { COURSES, deckWords, type CourseId } from "@/lib/courses";
import { units, useProgress, type UnitState } from "@/lib/progress";
import GenderTag from "../components/GenderTag";
import PixelIcon from "../components/PixelIcon";

export default function CoursePage() {
  const [p, update] = useProgress();
  const [open, setOpen] = useState<string | null>(null);
  if (!p) return <div className="h-96" />;

  const course = p.course;
  const list = units(p, course);
  const setCourse = (c: CourseId) => {
    setOpen(null);
    update((cur) => ({ ...cur, course: c }));
  };

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-grass-soft p-1.5">
        {(Object.keys(COURSES) as CourseId[]).map((c) => (
          <button
            key={c}
            onClick={() => setCourse(c)}
            className={`rounded-xl py-2.5 font-bold transition ${c === course ? "bg-surface text-grass-ink shadow-sm" : "text-muted"}`}
          >
            {COURSES[c].name}
            <span className="block text-xs font-normal">{COURSES[c].sub}</span>
          </button>
        ))}
      </div>

      <ol className="relative">
        {list.map((u, i) => (
          <li key={u.name} className="relative pb-4 pl-16">
            {i < list.length - 1 && (
              <span className={`absolute left-[27px] top-14 h-[calc(100%-40px)] w-1 rounded ${u.stars >= 1 ? "bg-grass" : "bg-line"}`} />
            )}
            <Node unit={u} icon={COURSES[course].decks[u.name].i} />
            <button
              disabled={!u.unlocked}
              onClick={() => setOpen(open === u.name ? null : u.name)}
              className={`w-full rounded-3xl border p-4 text-left transition ${
                u.unlocked ? "border-line bg-surface hover:border-grass" : "border-dashed border-line opacity-60"
              } ${open === u.name ? "border-grass" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{u.name}</span>
                <Status unit={u} />
              </div>
              <div className="mt-1 text-xs text-muted">
                {u.known} / {u.total} 个词
              </div>
            </button>
            {open === u.name && <UnitDetail course={course} unit={u} known={p.known} />}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Node({ unit, icon }: { unit: UnitState; icon: string }) {
  const ring = unit.stars === 3 ? "border-sun bg-sun-soft" : unit.unlocked ? "border-grass bg-surface" : "border-line bg-bg grayscale";
  return (
    <span className={`absolute left-0 top-1 grid h-14 w-14 place-items-center rounded-full border-4 ${ring}`}>
      <PixelIcon name={unit.unlocked ? icon : "lock"} size={3} className={unit.unlocked ? "" : "opacity-40"} />
    </span>
  );
}

function Status({ unit }: { unit: UnitState }) {
  if (!unit.unlocked) return <span className="text-xs text-muted">已锁定</span>;
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3].map((s) => (
        <PixelIcon key={s} name="star" size={2} className={s <= unit.stars ? "" : "opacity-25 grayscale"} />
      ))}
    </span>
  );
}

function UnitDetail({ course, unit, known }: { course: CourseId; unit: UnitState; known: Record<string, 1> }) {
  const name = unit.name;
  const deck = COURSES[course].decks[name];
  return (
    <div className="mt-3 rounded-3xl bg-surface p-4 ring-1 ring-line">
      <Link
        href={`/lesson?course=${course}&unit=${encodeURIComponent(name)}`}
        className="btn-3d mb-3 block rounded-2xl bg-grass py-3.5 text-center text-lg font-extrabold text-white"
      >
        {unit.known === unit.total ? "再练一遍" : unit.known > 0 ? "继续学习" : "开始学习"}
      </Link>
      <p className="mb-3 rounded-2xl bg-sun-soft p-3 text-sm leading-relaxed">
        <b>小贴士：</b>
        {deck.tip}
      </p>
      <ul className="divide-y divide-line">
        {deckWords(course, name).map((w) => (
          <li key={w.fr} className="flex items-start gap-3 py-2.5">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${known[w.fr] ? "bg-grass" : "bg-line"}`} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">{w.fr}</span>
                <GenderTag fr={w.fr} />
              </div>
              <div className="text-sm text-muted">{w.zh}</div>
              {w.example && (
                <div className="mt-1 text-xs text-muted">
                  <i>{w.example.fr}</i> · {w.example.zh}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
