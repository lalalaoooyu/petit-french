import type { Progress } from "./progress";

/**
 * Combine two copies of progress (local and cloud) without losing anything:
 * learned words and mistakes are unioned, counters take the larger value,
 * and each review keeps whichever copy is due sooner.
 */
export function mergeProgress(local: Progress, remote: Partial<Progress>): Progress {
  const r = { ...local, ...remote } as Progress;
  const box: Progress["box"] = { ...r.box };
  for (const [fr, b] of Object.entries(local.box ?? {})) {
    const other = box[fr];
    if (!other || b.due < other.due) box[fr] = b;
  }
  const wrong: Progress["wrong"] = { ...(remote.wrong ?? {}) };
  for (const [fr, n] of Object.entries(local.wrong ?? {})) wrong[fr] = Math.max(n, wrong[fr] ?? 0);
  const best: Progress["best"] = { ...(remote.best ?? {}) };
  for (const [k, n] of Object.entries(local.best ?? {})) best[k] = Math.max(n, best[k] ?? 0);

  const sameDay = local.last === remote.last;
  const newer = !remote.last || new Date(local.last) >= new Date(remote.last) ? local : (remote as Progress);
  return {
    ...local,
    known: { ...(remote.known ?? {}), ...local.known },
    wrong,
    box,
    best,
    xp: Math.max(local.xp, remote.xp ?? 0),
    streak: Math.max(local.streak, remote.streak ?? 0),
    last: newer.last,
    today: sameDay ? Math.max(local.today, remote.today ?? 0) : newer.today,
  };
}
