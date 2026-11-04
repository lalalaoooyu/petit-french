import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { recordAnswer, recordLearned } from "./lesson";
import { loadLocal, masteredCount, type Progress } from "./progress";

const NOW = new Date(2026, 10, 4, 10, 0, 0);
const day = (offset: number) => new Date(NOW.getTime() + offset * 864e5).toDateString();

const base: Progress = {
  xp: 0, known: {}, streak: 0, last: "", today: 0, wrong: {}, box: {}, goal: 50, rate: 0.95, best: {}, course: "daily",
};

let store: Record<string, string>;
const stored = (p: Partial<Progress>) => {
  store.petitfr = JSON.stringify({ ...base, ...p });
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
  store = {};
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => (store[k] = v),
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("streak", () => {
  it("does not grow just because the app was opened", () => {
    stored({ last: day(-1), streak: 3 });
    expect(loadLocal().streak).toBe(3);
  });

  it("drops to 0 on load after a missed day", () => {
    stored({ last: day(-3), streak: 5 });
    expect(loadLocal().streak).toBe(0);
  });

  it("a new user who has not studied has no streak", () => {
    expect(loadLocal().streak).toBe(0);
  });

  it("resets today's xp on a new day", () => {
    stored({ last: day(-1), streak: 3, today: 40 });
    expect(loadLocal().today).toBe(0);
  });

  it("grows on the first answer of the day, continuing from yesterday", () => {
    const p = recordAnswer({ ...base, last: day(-1), streak: 3 }, "Bonjour", true, 10);
    expect(p.streak).toBe(4);
    expect(p.last).toBe(day(0));
    expect(p.today).toBe(10);
  });

  it("counts only once per day", () => {
    let p = recordAnswer({ ...base, last: day(-1), streak: 3 }, "Bonjour", true, 10);
    p = recordAnswer(p, "Salut", true, 10);
    p = recordLearned(p, "Bonsoir");
    expect(p.streak).toBe(4);
    expect(p.today).toBe(25);
  });

  it("starts at 1 after a gap or on the first ever study", () => {
    expect(recordLearned({ ...base }, "Bonjour").streak).toBe(1);
    expect(recordLearned({ ...base, last: day(-3), streak: 5 }, "Bonjour").streak).toBe(1);
  });

  it("a wrong answer still counts as studying", () => {
    const p = recordAnswer({ ...base, last: day(-1), streak: 3 }, "Bonjour", false, 10);
    expect(p.streak).toBe(4);
    expect(p.today).toBe(0);
  });

  it("loading on a study day keeps the streak and today's xp", () => {
    stored({ last: day(0), streak: 4, today: 25 });
    const p = loadLocal();
    expect(p.streak).toBe(4);
    expect(p.today).toBe(25);
  });
});

describe("mastered", () => {
  const at = (offset: number) => vi.setSystemTime(new Date(NOW.getTime() + offset * 864e5));
  const learnedToday = () => recordLearned({ ...base }, "Bonjour");

  it("tapping 记住了 on a new word does not master it", () => {
    expect(masteredCount(learnedToday())).toBe(0);
  });

  it("answering right in the same lesson does not master it", () => {
    let p = learnedToday();
    p = recordAnswer(p, "Bonjour", true, 10);
    p = recordAnswer(p, "Bonjour", true, 3);
    expect(masteredCount(p)).toBe(0);
  });

  it("drilling in practice on the same day does not master it", () => {
    let p = learnedToday();
    for (let k = 0; k < 6; k++) p = recordAnswer(p, "Bonjour", true, 10);
    expect(masteredCount(p)).toBe(0);
  });

  it("an early right answer keeps the next review where it was", () => {
    const p = learnedToday();
    const due = p.box.Bonjour.due;
    expect(recordAnswer(p, "Bonjour", true, 10).box.Bonjour.due).toBe(due);
  });

  it("is mastered after right answers in reviews on later days", () => {
    let p = learnedToday();
    at(1);
    p = recordAnswer(p, "Bonjour", true, 10);
    expect(masteredCount(p)).toBe(0);
    at(3);
    p = recordAnswer(p, "Bonjour", true, 10);
    expect(masteredCount(p)).toBe(1);
  });

  it("a review due later today still counts when done in the morning", () => {
    let p = learnedToday();
    vi.setSystemTime(new Date(2026, 10, 5, 7, 0, 0));
    p = recordAnswer(p, "Bonjour", true, 10);
    expect(p.box.Bonjour.b).toBe(2);
  });

  it("a wrong answer takes mastery away", () => {
    let p = learnedToday();
    at(1);
    p = recordAnswer(p, "Bonjour", true, 10);
    at(3);
    p = recordAnswer(p, "Bonjour", true, 10);
    p = recordAnswer(p, "Bonjour", false, 10);
    expect(masteredCount(p)).toBe(0);
  });
});
