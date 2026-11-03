"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { COURSES, deckWords, type CourseId } from "@/lib/courses";
import { buildLesson, buildPractice, recordAnswer, recordLearned, XP, type PracticeMode, type Step } from "@/lib/lesson";
import { currentUnit, starsFor, unitKey, useProgress, type Progress } from "@/lib/progress";
import GenderTag from "../components/GenderTag";
import PixelIcon from "../components/PixelIcon";
import { Choice, Learn, Match, Spell } from "./Questions";

type Feedback = { ok: boolean; step: Step; cheer: string; misses?: [string, string][] };
type Stats = { asked: number; correct: number; xp: number; learned: string[]; wrong: string[] };

const stepWord = (s: Step) => (s.kind === "match" ? null : s.word);

export default function LessonPage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <Lesson />
    </Suspense>
  );
}

function Lesson() {
  const router = useRouter();
  const params = useSearchParams();
  const [p, update] = useProgress();
  const [queue, setQueue] = useState<Step[] | null>(null);
  const [i, setI] = useState(0);
  const [retried, setRetried] = useState<string[]>([]);
  const [fb, setFb] = useState<Feedback | null>(null);
  const [stats, setStats] = useState<Stats>({ asked: 0, correct: 0, xp: 0, learned: [], wrong: [] });
  const [scored, setScored] = useState(false);

  const deck = params.get("deck");
  const mode = params.get("mode") as PracticeMode | null;
  const courseParam = params.get("course") as CourseId | null;
  const unitParam = params.get("unit");
  const course = p && courseParam && COURSES[courseParam] ? courseParam : p?.course;
  const practice = !!(deck && mode);
  // the unit this lesson counts towards; free practice counts towards none
  const unit = !p || !course || practice ? undefined : unitParam && COURSES[course].decks[unitParam] ? unitParam : currentUnit(p, course).name;

  // build once, after progress has loaded
  useEffect(() => {
    if (!p || !course || queue) return;
    if (practice && COURSES[course].decks[deck!]) setQueue(buildPractice(course, deck!, mode!));
    // a finished unit gets a round of choice questions instead of an empty lesson
    else if (unit && unitDone(p, course, unit)) setQueue(buildPractice(course, unit, "fr2zh"));
    else setQueue(buildLesson(p, course, unit));
  }, [p, queue, deck, mode, course, unit, practice]);

  // keep the unit's best accuracy once the lesson is over
  const finished = !!queue && queue.length > 0 && i >= queue.length;
  useEffect(() => {
    if (!finished || scored || !unit || !course) return;
    setScored(true);
    const pct = stats.asked ? Math.round((stats.correct / stats.asked) * 100) : 100;
    const key = unitKey(course, unit);
    update((cur) => ({ ...cur, best: { ...cur.best, [key]: Math.max(pct, cur.best[key] ?? 0) } }));
  }, [finished, scored, unit, course, stats, update]);

  if (!p || !course || !queue) return <div className="h-96" />;
  if (queue.length === 0) return <Empty />;
  if (i >= queue.length) {
    if (practice || !unit) return <Results stats={stats} again={() => location.reload()} label="再来一节" back={practice ? "/practice" : "/"} />;
    // next lesson: rest of this unit, or the next unit once this one has a star
    const target = currentUnit(p, course).name;
    const href = `/lesson?course=${course}&unit=${encodeURIComponent(target)}`;
    const done = unitDone(p, course, unit);
    const best = p.best[unitKey(course, unit)];
    const label = target === unit && done ? "再练一遍" : "下一节";
    return <Results stats={stats} again={() => location.assign(href)} label={label} back="/course" unit={done ? { name: unit, best } : undefined} />;
  }

  const step = queue[i];
  const next = () => {
    setFb(null);
    setI((n) => n + 1);
  };

  const answer = (ok: boolean) => {
    const w = stepWord(step)!;
    const xp = step.kind === "spell" ? XP.spell : XP.choice;
    update((cur) => recordAnswer(cur, w.fr, ok, xp));
    setStats((s) => ({
      ...s,
      asked: s.asked + 1,
      correct: s.correct + (ok ? 1 : 0),
      xp: s.xp + (ok ? xp : 0),
      wrong: ok || s.wrong.includes(w.fr) ? s.wrong : [...s.wrong, w.fr],
    }));
    // a missed item comes back once at the end of the lesson
    if (!ok && !retried.includes(w.fr)) {
      setRetried((r) => [...r, w.fr]);
      setQueue((q) => [...q!, step]);
    }
    setFb({ ok, step, cheer: pick(CHEERS) });
  };

  const learned = (remembered: boolean) => {
    const w = stepWord(step)!;
    // not remembered: the card comes back once at the end, and the word is not counted as learned yet
    if (!remembered) {
      if (!retried.includes(w.fr)) {
        setRetried((r) => [...r, w.fr]);
        setQueue((q) => [...q!, step]);
      }
      return next();
    }
    update((cur) => recordLearned(cur, w.fr));
    setStats((s) => ({ ...s, xp: s.xp + (p.known[w.fr] ? 0 : XP.learn), learned: s.learned.includes(w.fr) ? s.learned : [...s.learned, w.fr] }));
    next();
  };

  const matched = (misses: [string, string][]) => {
    if (step.kind !== "match") return;
    const missed = new Set(misses.map(([fr]) => fr));
    update((cur) => step.words.reduce((acc, w) => recordAnswer(acc, w.fr, !missed.has(w.fr), XP.match), cur));
    setStats((s) => ({
      ...s,
      asked: s.asked + 1,
      correct: s.correct + (missed.size === 0 ? 1 : 0),
      xp: s.xp + XP.match * (step.words.length - missed.size),
      wrong: [...s.wrong, ...[...missed].filter((fr) => !s.wrong.includes(fr))],
    }));
    setFb({ ok: missed.size === 0, step, cheer: pick(CHEERS), misses });
  };

  const quit = () => {
    if (i === 0 || confirm("确定退出吗？已经答过的题会保留记录。")) router.push(deck ? "/practice" : unit ? "/course" : "/");
  };

  return (
    <div className="flex min-h-[calc(100dvh-3rem)] flex-col pb-40">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={quit} aria-label="退出" className="grid h-10 w-10 place-items-center rounded-xl text-2xl text-muted hover:bg-line">
          ×
        </button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-grass-soft">
          <div className="h-full rounded-full bg-grass transition-all duration-300" style={{ width: `${(i / queue.length) * 100}%` }} />
        </div>
      </div>

      {step.kind === "learn" && <Learn key={i} word={step.word} onNext={learned} />}
      {step.kind === "choice" && <Choice key={i} word={step.word} dir={step.dir} options={step.options} locked={!!fb} onAnswer={answer} />}
      {step.kind === "spell" && <Spell key={i} word={step.word} locked={!!fb} onAnswer={answer} />}
      {step.kind === "match" && <Match key={i} words={step.words} onDone={matched} />}

      {fb && <FeedbackBar fb={fb} onNext={next} />}
    </div>
  );
}

function FeedbackBar({ fb, onNext }: { fb: Feedback; onNext: () => void }) {
  const w = stepWord(fb.step);
  return (
    <div className={`fixed inset-x-0 bottom-0 z-30 border-t-2 ${fb.ok ? "border-grass bg-grass-soft" : "border-bad bg-[#fde6e2] dark:bg-[#3d2320]"}`}>
      <div className="mx-auto flex max-w-xl flex-col gap-3 px-4 pb-[max(env(safe-area-inset-bottom),20px)] pt-4">
        <div className={fb.ok ? "text-grass-ink" : "text-bad"}>
          <p className="text-xl font-extrabold">{fb.ok ? fb.cheer : "差一点点"}</p>
          {!fb.ok && w && (
            <p className="mt-1 text-ink">
              正确答案：<b>{w.fr}</b> = {w.zh} <GenderTag fr={w.fr} />
            </p>
          )}
          {!fb.ok && fb.step.kind === "match" && (
            <div className="mt-1 space-y-1 text-ink">
              <p>全部配完啦，中间配错的是：</p>
              {fb.misses?.map(([fr, zh], k) => (
                <p key={k} className="text-sm">
                  <b>{fr}</b> ≠ <s className="text-muted">{zh}</s>，应该是 {fb.step.kind === "match" && fb.step.words.find((x) => x.fr === fr)?.zh}
                </p>
              ))}
            </div>
          )}
        </div>
        <button
          autoFocus
          onClick={onNext}
          className={`rounded-2xl py-4 text-lg font-extrabold text-white ${fb.ok ? "btn-3d bg-grass" : "bg-bad shadow-[0_4px_0_#9c3122]"}`}
        >
          继续
        </button>
      </div>
    </div>
  );
}

function Results({ stats, again, label, back, unit }: { stats: Stats; again: () => void; label: string; back: string; unit?: { name: string; best?: number } }) {
  const pct = stats.asked ? Math.round((stats.correct / stats.asked) * 100) : 100;
  return (
    <div className="space-y-5 pt-6 text-center">
      <div className="flex justify-center">
        <PixelIcon name={pct >= 80 ? "medal" : "star"} size={8} />
      </div>
      <h1 className="font-pixel text-3xl">Leçon terminée !</h1>
      <p className="text-muted">这节课完成啦</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-sun-soft p-5">
          <p className="text-3xl font-extrabold">+{stats.xp}</p>
          <p className="text-sm text-muted">经验</p>
        </div>
        <div className="rounded-3xl bg-grass-soft p-5">
          <p className="text-3xl font-extrabold text-grass-ink">{pct}%</p>
          <p className="text-sm text-muted">答对率</p>
        </div>
      </div>
      {unit && <UnitStars name={unit.name} best={unit.best} />}
      {stats.learned.length > 0 && <WordList title="今天学会的词" words={stats.learned} />}
      {stats.wrong.length > 0 && <WordList title="答错的词（已加入复习）" words={stats.wrong} />}
      <div className="flex gap-3 pt-2">
        <Link href={back} className="flex-1 rounded-2xl border border-line bg-surface py-4 font-bold">
          {BACK_LABEL[back]}
        </Link>
        <button onClick={again} className="btn-3d flex-1 rounded-2xl bg-grass py-4 font-extrabold text-white">
          {label}
        </button>
      </div>
    </div>
  );
}

function UnitStars({ name, best }: { name: string; best?: number }) {
  const stars = starsFor(best ?? 0);
  return (
    <div className="rounded-3xl border border-line bg-surface p-4">
      <p className="text-sm font-bold">「{name}」单元学完了 · 最好成绩 {best ?? 0}%</p>
      <div className="mt-2 flex justify-center gap-1">
        {[1, 2, 3].map((s) => (
          <PixelIcon key={s} name="star" size={4} className={s <= stars ? "" : "opacity-25 grayscale"} />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">
        {stars === 0 ? "正确率到 60% 就能拿到第一颗星，解锁下一个单元" : stars < 3 ? "80% 两颗星，100% 三颗星，可以再练一遍刷新成绩" : "满星！"}
      </p>
    </div>
  );
}

function WordList({ title, words }: { title: string; words: string[] }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-4 text-left">
      <p className="mb-2 text-sm font-bold">{title}</p>
      <div className="flex flex-wrap gap-2">
        {words.map((w) => (
          <span key={w} className="rounded-full bg-bg px-3 py-1 text-sm">
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="space-y-4 py-20 text-center">
      <div className="flex justify-center">
        <PixelIcon name="flower" size={8} />
      </div>
      <p className="font-bold">今天没有要学的内容了</p>
      <p className="text-sm text-muted">这个课程已经全部学完，可以去「练习」里自由复习，或者切换到另一个课程。</p>
      <Link href="/practice" className="btn-3d inline-block rounded-2xl bg-grass px-8 py-3 font-extrabold text-white">
        去练习
      </Link>
    </div>
  );
}

const BACK_LABEL: Record<string, string> = { "/": "回首页", "/course": "回课程", "/practice": "回练习" };

const unitDone = (p: Progress, course: CourseId, unit: string) => deckWords(course, unit).every((w) => p.known[w.fr]);

const CHEERS = ["Très bien !", "Bravo !", "Parfait !", "Super !"];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
