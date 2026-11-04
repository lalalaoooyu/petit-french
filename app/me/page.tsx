"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COURSES, type CourseId } from "@/lib/courses";
import { dueCount, masteredWords, units, useProgress } from "@/lib/progress";
import { currentEmail, signOut, SYNC_EVENT, syncState, type SyncState } from "@/lib/sync";
import PixelIcon from "../components/PixelIcon";

const SYNC_LABEL: Record<SyncState, string> = {
  "signed-out": "未登录 · 进度只存在这台设备",
  syncing: "正在同步…",
  synced: "已同步到云端",
  offline: "同步失败，联网后会自动重试",
};

export default function Me() {
  const [p, update] = useProgress();
  const [sync, setSync] = useState<SyncState>("signed-out");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      setSync(syncState());
      setEmail(currentEmail());
    };
    refresh();
    window.addEventListener(SYNC_EVENT, refresh);
    return () => window.removeEventListener(SYNC_EVENT, refresh);
  }, []);

  if (!p) return <div className="h-96" />;

  const mastered = new Set(masteredWords(p));
  const learning = Object.keys(p.known).filter((fr) => !mastered.has(fr)).length;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold">我的</h1>

      <section className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5">
        <PixelIcon name="bunny" size={4} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{email ?? "游客"}</p>
          <p className={`text-xs ${sync === "offline" ? "text-bad" : sync === "synced" ? "text-grass-ink" : "text-muted"}`}>
            {SYNC_LABEL[sync]}
          </p>
        </div>
        {email ? (
          <button onClick={() => signOut()} className="rounded-xl border border-line px-3 py-2 text-sm font-bold">
            退出
          </button>
        ) : (
          <Link href="/login" className="btn-3d rounded-xl bg-grass px-4 py-2 text-sm font-extrabold text-white">
            登录
          </Link>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Stat label="经验值" value={p.xp} />
        <Stat label="连续天数" value={p.streak} />
        <Stat label="已掌握" value={mastered.size} />
        <Stat label="今日待复习" value={dueCount(p)} />
        <Stat label="学习中" value={learning} />
        <Stat label="易错词" value={Object.keys(p.wrong).length} />
      </section>

      <section className="rounded-3xl border border-line bg-surface p-5">
        <p className="mb-3 font-bold">课程进度</p>
        {(Object.keys(COURSES) as CourseId[]).map((c) => {
          const list = units(p, c);
          const done = list.filter((u) => u.stars === 3).length;
          const known = list.reduce((n, u) => n + u.known, 0);
          const total = list.reduce((n, u) => n + u.total, 0);
          return (
            <div key={c} className="mb-3 last:mb-0">
              <div className="mb-1 flex justify-between text-sm">
                <span>{COURSES[c].name}</span>
                <span className="text-muted">
                  {done}/{list.length} 单元 · {known}/{total} 词
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-grass-soft">
                <div className="h-full bg-grass" style={{ width: `${(known / total) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </section>

      <section className="space-y-4 rounded-3xl border border-line bg-surface p-5">
        <p className="font-bold">设置</p>
        <Setting label="每日目标">
          {[30, 50, 100].map((g) => (
            <Chip key={g} on={p.goal === g} onClick={() => update((cur) => ({ ...cur, goal: g }))}>
              {g} 经验
            </Chip>
          ))}
        </Setting>
        <Setting label="发音语速">
          {[
            [0.75, "慢"],
            [0.95, "自然"],
            [1.05, "快"],
          ].map(([r, l]) => (
            <Chip key={r} on={p.rate === r} onClick={() => update((cur) => ({ ...cur, rate: r as number }))}>
              {l}
            </Chip>
          ))}
        </Setting>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-4">
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function Setting({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-sm">{label}</span>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border-2 px-3 py-1 text-sm font-bold ${on ? "border-grass bg-grass-soft text-grass-ink" : "border-line"}`}
    >
      {children}
    </button>
  );
}
