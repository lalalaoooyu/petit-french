"use client";

/* browser TTS for now; step 5 swaps this for pre-generated neural audio */
let voice: SpeechSynthesisVoice | null = null;

function score(v: SpeechSynthesisVoice) {
  const n = v.name;
  let s = 0;
  if (/Natural|Neural|Online/i.test(n)) s += 50;
  if (/Premium/i.test(n)) s += 45;
  if (/Enhanced|Amélioré/i.test(n)) s += 35;
  if (/Google/i.test(n)) s += 25;
  if (/fr-FR/i.test(v.lang)) s += 3;
  if (/Jacques|Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley/i.test(n)) s -= 30;
  return s;
}

function pickVoice() {
  try {
    const list = speechSynthesis.getVoices().filter((v) => v.lang.startsWith("fr"));
    voice = list.sort((a, b) => score(b) - score(a))[0] ?? null;
  } catch {}
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

export function speak(text: string, opts: { slow?: boolean; rate?: number } = {}) {
  try {
    const u = new SpeechSynthesisUtterance(text.replace(/…/g, ""));
    u.lang = "fr-FR";
    if (voice) u.voice = voice;
    u.rate = opts.slow ? 0.7 : (opts.rate ?? 0.95);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch {}
}
