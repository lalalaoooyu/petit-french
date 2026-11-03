"use client";

import { useEffect, useState } from "react";
import { COURSES, deckNames, deckWords, type CourseId, type Word } from "./courses";

/* same storage key and shape as the legacy single-file site, so old progress carries over */
const KEY = "petitfr";
const DAY = 864e5;

export type Progress = {
  xp: number;
  known: Record<string, 1>;
  streak: number;
  last: string;
  today: number;
  wrong: Record<string, number>;
  box: Record<string, { b: number; due: number }>;
  goal: number;
  rate: number;
  best: Record<string, number>;
  course: CourseId;
};

const EMPTY: Progress = {
  xp: 0, known: {}, streak: 0, last: "", today: 0, wrong: {}, box: {}, goal: 50, rate: 0.95, best: {}, course: "daily",
};

/** fired after every local save (cloud sync listens) and after a cloud merge (pages reload) */
export const SAVED_EVENT = "petitfr-saved";
export const UPDATED_EVENT = "petitfr-updated";

export function loadLocal(): Progress {
  let p: Progress = { ...EMPTY };
  try {
    p = { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
    const c = localStorage.getItem("petitfr-course");
    if (c === "daily" || c === "exam") p.course = c;
  } catch {}
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - DAY).toDateString();
  if (p.last !== today) {
    p.streak = p.last === yesterday ? p.streak + 1 : 1;
    p.last = today;
    p.today = 0;
  }
  return p;
}

export function saveLocal(p: Progress, { silent = false } = {}) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
    localStorage.setItem("petitfr-course", p.course);
  } catch {}
  if (!silent) window.dispatchEvent(new Event(SAVED_EVENT));
}

/** null until mounted, so server and first client render match */
export function useProgress() {
  const [p, setP] = useState<Progress | null>(null);
  useEffect(() => {
    const v = loadLocal();
    saveLocal(v, { silent: true });
    setP(v);
    const reload = () => setP(loadLocal());
    window.addEventListener(UPDATED_EVENT, reload);
    return () => window.removeEventListener(UPDATED_EVENT, reload);
  }, []);
  const update = (fn: (p: Progress) => Progress) =>
    setP((cur) => {
      if (!cur) return cur;
      const next = fn(cur);
      saveLocal(next);
      return next;
    });
  return [p, update] as const;
}

const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

export function dueCount(p: Progress) {
  const end = endOfToday();
  return Object.values(p.box).filter((b) => b.due <= end).length;
}

export type UnitState = { name: string; total: number; known: number; stars: 0 | 1 | 2 | 3; unlocked: boolean };

/** a unit unlocks once the previous one has at least one star (a third of its words known) */
export function units(p: Progress, course: CourseId): UnitState[] {
  let prevStars = 3;
  return deckNames(course).map((name, i) => {
    const words = COURSES[course].decks[name].w;
    const known = words.filter(([fr]) => p.known[fr]).length;
    const stars = Math.floor((known / words.length) * 3) as UnitState["stars"];
    const unlocked = i === 0 || prevStars >= 1;
    prevStars = stars;
    return { name, total: words.length, known, stars, unlocked };
  });
}

/** first unlocked unit that is not fully learned */
export function currentUnit(p: Progress, course: CourseId) {
  const list = units(p, course);
  return list.find((u) => u.unlocked && u.stars < 3) ?? list[list.length - 1];
}

export function newWords(p: Progress, course: CourseId, n = 6, unit?: string): Word[] {
  const name = unit ?? currentUnit(p, course).name;
  return deckWords(course, name).filter((w) => !p.known[w.fr]).slice(0, n);
}
