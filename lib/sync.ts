"use client";

import type { Session } from "@supabase/supabase-js";
import { mergeProgress } from "./merge";
import { loadLocal, saveLocal, SAVED_EVENT, UPDATED_EVENT, type Progress } from "./progress";
import { supabase } from "./supabase";

export type SyncState = "signed-out" | "syncing" | "synced" | "offline";
export const SYNC_EVENT = "petitfr-sync";

let session: Session | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let state: SyncState = "signed-out";
let started = false;

function setState(s: SyncState) {
  state = s;
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: s }));
}
export const syncState = () => state;
export const currentEmail = () => session?.user.email ?? null;

async function push(p: Progress) {
  if (!session) return;
  setState("syncing");
  const { error } = await supabase
    .from("progress")
    .upsert({ user_id: session.user.id, data: p, updated_at: new Date().toISOString() });
  setState(error ? "offline" : "synced");
}

/** on sign-in: fetch the cloud copy, merge it into local, then write the result back */
async function pullAndMerge() {
  if (!session) return;
  setState("syncing");
  const { data, error } = await supabase.from("progress").select("data").eq("user_id", session.user.id).maybeSingle();
  if (error) return setState("offline");
  const merged = data?.data ? mergeProgress(loadLocal(), data.data as Partial<Progress>) : loadLocal();
  saveLocal(merged, { silent: true });
  window.dispatchEvent(new Event(UPDATED_EVENT));
  await push(merged);
}

export function startSync() {
  if (started) return;
  started = true;

  // answers are saved locally first; the cloud copy follows two seconds after the last change
  window.addEventListener(SAVED_EVENT, () => {
    if (!session) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => push(loadLocal()), 2000);
  });
  window.addEventListener("online", () => session && push(loadLocal()));

  supabase.auth.getSession().then(({ data }) => {
    session = data.session;
    if (session) pullAndMerge();
    else setState("signed-out");
  });
  supabase.auth.onAuthStateChange((event, s) => {
    session = s;
    if (event === "SIGNED_IN") pullAndMerge();
    if (event === "SIGNED_OUT") setState("signed-out");
  });
}

export async function sendMagicLink(email: string) {
  return supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
}

/** local progress is kept so learning continues without an account */
export async function signOut() {
  await supabase.auth.signOut();
}
