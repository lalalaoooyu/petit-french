"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { COURSES, type CourseId } from "@/lib/courses";
import { buildLesson, buildPractice, recordAnswer, recordLearned, XP, type PracticeMode, type Step } from "@/lib/lesson";
import { useProgress } from "@/lib/progress";
import GenderTag from "../components/GenderTag";
import PixelIcon from "../components/PixelIcon";
import { Choice, Learn, Match, Spell } from "./Questions";

type Feedback = { ok: boolean; step: Step; cheer: string };
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

  const deck = params.get("deck");
  const mode = params.get("mode") as PracticeMode | null;
  const courseParam = params.get("course") as CourseId | null;

  // build once, after progress has loaded
  useEffect(() => {
    if (!p || queue) return;
    const course = courseParam && COURSES[courseParam] ? courseParam : p.course;
    setQueue(deck && mode && COURSES[course].decks[deck] ? buildPractice(course, deck, mode) : buildLesson(p, course));
  }, [p, queue, deck, mode, courseParam]);

  if (!p || !queue) return <div className="h-96" />;
  if (queue.length === 0) return <Empty />;
  if (i >= queue.length) return <Results stats={stats} again={() => location.reload()} />;

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

  const learned = () => {
    const w = stepWord(step)!;
    update((cur) => recordLearned(cur, w.fr));
    setStats((s) => ({ ...s, xp: s.xp + (p.known[w.fr] ? 0 : XP.learn), learned: s.learned.includes(w.fr) ? s.learned : [...s.learned, w.fr] }));
    next();
  };

  const matched = (miss: number) => {
    if (step.kind !== "match") return;
    update((cur) => step.words.reduce((acc, w) => recordAnswer(acc, w.fr, true, XP.match), cur));
    setStats((s) => ({ ...s, asked: s.asked + 1, correct: s.correct + (miss === 0 ? 1 : 0), xp: s.xp + XP.match * step.words.length }));
    setFb({ ok: miss === 0, step, cheer: pick(CHEERS) });
  };

  const quit = () => {
    if (i === 0 || confirm("确定退出吗？已经答过的题会保留记录。")) router.push(deck ? "/practice" : "/");
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
          {!fb.ok && !w && <p className="mt-1 text-ink">有几次配错了，不过全部配完啦</p>}
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

function Results({ stats, again }: { stats: Stats; again: () => void }) {
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
      {stats.learned.length > 0 && <WordList title="今天学会的词" words={stats.learned} />}
      {stats.wrong.length > 0 && <WordList title="答错的词（已加入复习）" words={stats.wrong} />}
      <div className="flex gap-3 pt-2">
        <Link href="/" className="flex-1 rounded-2xl border border-line bg-surface py-4 font-bold">
          回首页
        </Link>
        <button onClick={again} className="btn-3d flex-1 rounded-2xl bg-grass py-4 font-extrabold text-white">
          再来一节
        </button>
      </div>
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

const CHEERS = ["Très bien !", "Bravo !", "Parfait !", "Super !"];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
