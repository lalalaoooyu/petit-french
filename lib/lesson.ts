import { COURSES, deckWords, findWord, type CourseId, type Word } from "./courses";
import { endOfToday, markStudied, newWords, type Progress } from "./progress";

export type ChoiceDir = "fr2zh" | "zh2fr" | "ear";
export type Step =
  | { kind: "learn"; word: Word }
  | { kind: "choice"; word: Word; dir: ChoiceDir; options: Word[] }
  | { kind: "spell"; word: Word }
  | { kind: "match"; words: Word[] };

export type PracticeMode = "card" | ChoiceDir | "spell" | "match";

const DAY = 864e5;
const MAX_REVIEW = 8;
export const XP = { choice: 10, spell: 15, match: 3, learn: 5 };

export const shuffle = <T,>(a: T[]) => a.map((x) => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map((p) => p[1]);

/** three distractors from the same deck, topped up from the whole course; no repeated text on either side */
export function options(word: Word, course: CourseId, pool?: Word[]): Word[] {
  const deckPool = pool ?? deckWords(word.course, word.deck);
  const picked = [word];
  const seen = (w: Word) => picked.some((x) => x.fr === w.fr || x.zh === w.zh);
  for (const w of shuffle(deckPool)) {
    if (picked.length === 4) break;
    if (!seen(w)) picked.push(w);
  }
  if (picked.length < 4) {
    const all = Object.keys(courseDecks(course)).flatMap((d) => deckWords(course, d));
    for (const w of shuffle(all)) {
      if (picked.length === 4) break;
      if (!seen(w)) picked.push(w);
    }
  }
  return shuffle(picked);
}

const courseDecks = (c: CourseId) => COURSES[c].decks;

function dueWords(p: Progress): Word[] {
  const end = endOfToday();
  return Object.entries(p.box)
    .filter(([, b]) => b.due <= end)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([fr]) => findWord(fr))
    .filter((w): w is Word => !!w)
    .slice(0, MAX_REVIEW);
}

// no spelling in lessons: it is too hard this early; it stays available in practice
const ROTATION: ChoiceDir[] = ["fr2zh", "ear", "zh2fr"];

/** due reviews, then up to 6 new words from `unit` (default: the current unit) */
export function buildLesson(p: Progress, course: CourseId, unit?: string): Step[] {
  const steps: Step[] = [];
  for (const w of dueWords(p)) steps.push({ kind: "choice", word: w, dir: "fr2zh", options: options(w, course) });
  const fresh = newWords(p, course, 6, unit);
  for (const w of fresh) steps.push({ kind: "learn", word: w });
  shuffle(fresh).forEach((w, i) => {
    steps.push({ kind: "choice", word: w, dir: ROTATION[i % ROTATION.length], options: options(w, course) });
  });
  if (fresh.length >= 3) steps.push({ kind: "match", words: fresh.slice(0, 5) });
  return steps;
}

export function buildPractice(course: CourseId, deck: string, mode: PracticeMode, n = 10): Step[] {
  const words = deckWords(course, deck);
  if (mode === "card") return words.map((w) => ({ kind: "learn", word: w }));
  if (mode === "match") return [0, 1].map(() => ({ kind: "match", words: shuffle(words).slice(0, 5) }));
  return shuffle(words)
    .slice(0, n)
    .map((w) => (mode === "spell" ? { kind: "spell", word: w } : { kind: "choice", word: w, dir: mode, options: options(w, course, words) }));
}

/* ---------- progress updates ---------- */

function srs(box: Progress["box"], fr: string, ok: boolean) {
  const b = { ...(box[fr] ?? { b: 0, due: 0 }) };
  // a right answer before the word is due (same lesson, free practice) leaves its schedule alone
  if (ok && b.due > endOfToday()) return box;
  b.b = ok ? Math.min(5, b.b + 1) : 1;
  b.due = Date.now() + (ok ? 2 ** (b.b - 1) : 0) * DAY - 36e5;
  return { ...box, [fr]: b };
}

export function recordAnswer(prev: Progress, fr: string, ok: boolean, xp: number): Progress {
  const p = markStudied(prev);
  const wrong = { ...p.wrong };
  if (ok) {
    if (wrong[fr]) wrong[fr]--;
    if (wrong[fr] <= 0) delete wrong[fr];
  } else wrong[fr] = (wrong[fr] ?? 0) + 1;
  return { ...p, wrong, box: srs(p.box, fr, ok), xp: p.xp + (ok ? xp : 0), today: p.today + (ok ? xp : 0) };
}

export function recordLearned(prev: Progress, fr: string): Progress {
  const p = markStudied(prev);
  if (p.known[fr]) return p;
  return { ...p, known: { ...p.known, [fr]: 1 }, box: p.box[fr] ? p.box : srs(p.box, fr, true), xp: p.xp + XP.learn, today: p.today + XP.learn };
}

/* ---------- spelling ---------- */

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[.!?…,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** accepts curly apostrophes, missing punctuation, either side of "a / b", and both forms of "(e)" */
export function spellingOk(input: string, target: string): boolean {
  const got = norm(input);
  if (!got) return false;
  const variants = new Set<string>();
  for (const part of [target, ...target.split("/")]) {
    const t = part.trim();
    variants.add(norm(t));
    variants.add(norm(t.replace(/\(e\)/g, "")));
    variants.add(norm(t.replace(/\(e\)/g, "e")));
  }
  return variants.has(got);
}
