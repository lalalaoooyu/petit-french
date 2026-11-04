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
  // `last` is the last day studied; opening the app alone never extends the streak
  if (p.last !== new Date().toDateString()) {
    p.today = 0;
    if (p.last !== new Date(Date.now() - DAY).toDateString()) p.streak = 0;
  }
  return p;
}

/** the first answer or new word of a day extends the streak */
export function markStudied(p: Progress): Progress {
  const today = new Date().toDateString();
  if (p.last === today) return p;
  const yesterday = new Date(Date.now() - DAY).toDateString();
  return { ...p, last: today, today: 0, streak: p.last === yesterday ? p.streak + 1 : 1 };
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

export const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

/** box 3 can only be reached by right answers in reviews on two different days */
const MASTERED_BOX = 3;
export const masteredWords = (p: Progress) => Object.keys(p.box).filter((fr) => p.box[fr].b >= MASTERED_BOX);
export const masteredCount = (p: Progress) => masteredWords(p).length;

export function dueCount(p: Progress) {
  const end = endOfToday();
  return Object.values(p.box).filter((b) => b.due <= end).length;
}

export type UnitState = { name: string; total: number; known: number; stars: 0 | 1 | 2 | 3; unlocked: boolean };

/** key in `best` for a unit's best lesson accuracy (unit names repeat across courses) */
export const unitKey = (course: CourseId, unit: string) => `${course}/${unit}`;

/** 60% one star, 80% two, 100% three */
export const starsFor = (pct: number): UnitState["stars"] => (pct >= 100 ? 3 : pct >= 80 ? 2 : pct >= 60 ? 1 : 0);

/**
 * stars come from the unit's best lesson accuracy, once all its words are learned;
 * a unit learned before scores were kept counts as one star.
 * a unit unlocks once the previous one has at least one star.
 */
export function units(p: Progress, course: CourseId): UnitState[] {
  let prevStars = 3;
  return deckNames(course).map((name, i) => {
    const words = COURSES[course].decks[name].w;
    const known = words.filter(([fr]) => p.known[fr]).length;
    const best = p.best[unitKey(course, name)];
    const stars = known < words.length ? 0 : best === undefined ? 1 : starsFor(best);
    const unlocked = i === 0 || prevStars >= 1;
    prevStars = stars;
    return { name, total: words.length, known, stars, unlocked };
  });
}

/** first unlocked unit that still has new words, or that needs a star to unlock the next one */
export function currentUnit(p: Progress, course: CourseId) {
  const list = units(p, course);
  return list.find((u) => u.unlocked && (u.known < u.total || u.stars === 0)) ?? list[list.length - 1];
}

export function newWords(p: Progress, course: CourseId, n = 6, unit?: string): Word[] {
  const name = unit ?? currentUnit(p, course).name;
  return deckWords(course, name).filter((w) => !p.known[w.fr]).slice(0, n);
}
