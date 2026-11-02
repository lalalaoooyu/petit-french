"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Word } from "@/lib/courses";
import { shuffle, spellingOk, type ChoiceDir } from "@/lib/lesson";
import { speak } from "@/lib/speech";
import GenderTag from "../components/GenderTag";
import PixelIcon from "../components/PixelIcon";

type Answer = (ok: boolean) => void;

export function SpeakButton({ text, big = false }: { text: string; big?: boolean }) {
  return (
    <button
      onClick={() => speak(text)}
      aria-label="播放发音"
      className={`grid place-items-center rounded-2xl bg-grass-soft transition active:scale-95 ${big ? "h-24 w-24" : "h-11 w-11"}`}
    >
      <PixelIcon name="speaker" size={big ? 5 : 2.5} />
    </button>
  );
}

export function Learn({ word, onNext }: { word: Word; onNext: () => void }) {
  useEffect(() => speak(word.fr), [word.fr]);
  return (
    <div className="flex flex-1 flex-col">
      <p className="mb-4 text-sm font-bold text-grass-ink">新词</p>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-3xl border border-line bg-surface p-6 text-center">
        <Visual word={word} />
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-extrabold">{word.fr}</h2>
          <SpeakButton text={word.fr} />
        </div>
        <GenderTag fr={word.fr} />
        <p className="text-xl text-muted">{word.zh}</p>
        {word.example && (
          <button onClick={() => speak(word.example!.fr)} className="mt-3 rounded-2xl bg-bg px-4 py-3 text-sm">
            <i>{word.example.fr}</i>
            <span className="block text-muted">{word.example.zh}</span>
          </button>
        )}
      </div>
      <button onClick={onNext} className="btn-3d mt-5 rounded-2xl bg-grass py-4 text-lg font-extrabold text-white">
        记住了，继续
      </button>
    </div>
  );
}

export function Choice({
  word, dir, options, locked, onAnswer,
}: { word: Word; dir: ChoiceDir; options: Word[]; locked: boolean; onAnswer: Answer }) {
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => {
    setPicked(null);
    if (dir !== "zh2fr") speak(word.fr);
  }, [word.fr, dir]);
  const showFr = dir !== "fr2zh";
  const title = dir === "fr2zh" ? "这是什么意思？" : dir === "zh2fr" ? "用法语怎么说？" : "听一听，选出你听到的词";

  return (
    <div className="flex flex-1 flex-col">
      <p className="mb-4 text-lg font-extrabold">{title}</p>
      <div className="mb-6 flex min-h-36 flex-col items-center justify-center gap-3 rounded-3xl border border-line bg-surface p-6 text-center">
        {dir === "ear" ? (
          <SpeakButton text={word.fr} big />
        ) : (
          <>
            <Visual word={word} small />
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold">{dir === "fr2zh" ? word.fr : word.zh}</h2>
              {dir === "fr2zh" && <SpeakButton text={word.fr} />}
            </div>
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const right = o.fr === word.fr;
          const state = picked == null ? "" : right ? "ok" : picked === o.fr ? "bad" : "dim";
          return (
            <button
              key={o.fr}
              disabled={locked}
              onClick={() => {
                setPicked(o.fr);
                if (showFr) speak(o.fr);
                onAnswer(right);
              }}
              className={`rounded-2xl border-2 px-4 py-4 text-left text-lg font-bold transition ${
                state === "ok" ? "border-grass bg-grass-soft text-grass-ink"
                  : state === "bad" ? "border-bad bg-bad/10 text-bad"
                  : state === "dim" ? "border-line opacity-50"
                  : "border-line bg-surface hover:border-grass"
              }`}
            >
              {showFr ? o.fr : o.zh}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const ACCENTS = "é è ê à â ç ô û ù î ï ë œ".split(" ");

export function Spell({ word, locked, onAnswer }: { word: Word; locked: boolean; onAnswer: Answer }) {
  const [v, setV] = useState("");
  const [hint, setHint] = useState(0);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setV("");
    setHint(0);
    ref.current?.focus();
  }, [word.fr]);
  const insert = (c: string) => {
    const el = ref.current;
    const at = el?.selectionStart ?? v.length;
    setV(v.slice(0, at) + c + v.slice(at));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(at + 1, at + 1);
    });
  };
  const check = () => !locked && v.trim() && onAnswer(spellingOk(v, word.fr));

  return (
    <div className="flex flex-1 flex-col">
      <p className="mb-4 text-lg font-extrabold">用法语写出来</p>
      <div className="mb-5 flex flex-col items-center gap-2 rounded-3xl border border-line bg-surface p-6 text-center">
        <Visual word={word} small />
        <h2 className="text-2xl font-extrabold">{word.zh}</h2>
        <GenderTag fr={word.fr} />
        {hint > 0 && <p className="font-mono text-muted">{word.fr.slice(0, hint * 2)}…</p>}
      </div>
      <input
        ref={ref}
        value={v}
        disabled={locked}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && check()}
        autoCapitalize="off"
        autoComplete="off"
        spellCheck={false}
        placeholder="tapez ici…"
        className="w-full rounded-2xl border-2 border-line bg-surface px-4 py-4 text-center text-xl outline-none focus:border-grass"
      />
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {ACCENTS.map((c) => (
          <button key={c} disabled={locked} onClick={() => insert(c)} className="h-10 w-10 rounded-xl border border-line bg-surface text-lg">
            {c}
          </button>
        ))}
      </div>
      <div className="mt-5 flex gap-3">
        <button disabled={locked} onClick={() => setHint((h) => h + 1)} className="rounded-2xl border border-line bg-surface px-5 py-4 font-bold">
          提示
        </button>
        <button disabled={locked || !v.trim()} onClick={check} className="btn-3d flex-1 rounded-2xl bg-grass py-4 text-lg font-extrabold text-white disabled:opacity-50">
          检查
        </button>
      </div>
    </div>
  );
}

export function Match({ words, onDone }: { words: Word[]; onDone: (miss: number) => void }) {
  const left = useMemo(() => shuffle(words), [words]);
  const right = useMemo(() => shuffle(words), [words]);
  const [sel, setSel] = useState<{ side: "l" | "r"; fr: string } | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [bad, setBad] = useState<string[]>([]);
  const [miss, setMiss] = useState(0);

  const tap = (side: "l" | "r", fr: string) => {
    if (done.includes(fr)) return;
    if (side === "l") speak(fr);
    if (!sel || sel.side === side) return setSel({ side, fr });
    if (sel.fr === fr) {
      const next = [...done, fr];
      setDone(next);
      setSel(null);
      if (next.length === words.length) setTimeout(() => onDone(miss), 400);
    } else {
      setMiss((m) => m + 1);
      setBad([`${sel.side}${sel.fr}`, `${side}${fr}`]);
      setSel(null);
      setTimeout(() => setBad([]), 500);
    }
  };
  const cls = (side: "l" | "r", fr: string) =>
    done.includes(fr) ? "border-grass bg-grass-soft text-grass-ink opacity-40"
      : bad.includes(`${side}${fr}`) ? "border-bad bg-bad/10"
      : sel?.side === side && sel.fr === fr ? "border-sun bg-sun-soft"
      : "border-line bg-surface";

  return (
    <div className="flex flex-1 flex-col">
      <p className="mb-4 text-lg font-extrabold">把法语和中文配成一对</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          {left.map((w) => (
            <button key={w.fr} onClick={() => tap("l", w.fr)} className={`min-h-16 w-full rounded-2xl border-2 p-3 font-bold transition ${cls("l", w.fr)}`}>
              {w.fr}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {right.map((w) => (
            <button key={w.fr} onClick={() => tap("r", w.fr)} className={`min-h-16 w-full rounded-2xl border-2 p-3 font-bold transition ${cls("r", w.fr)}`}>
              {w.zh}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** colour swatch, big digit, or nothing — decorative only */
function Visual({ word, small = false }: { word: Word; small?: boolean }) {
  if (!word.extra) return null;
  if (word.extra.startsWith("#"))
    return <span className={`rounded-2xl ring-4 ring-line ${small ? "h-10 w-10" : "h-16 w-16"}`} style={{ background: word.extra }} />;
  return <span className={`font-pixel text-grass-ink ${small ? "text-3xl" : "text-5xl"}`}>{word.extra}</span>;
}
