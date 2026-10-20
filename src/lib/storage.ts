import { useEffect, useState } from "react";

export function useLocalStore<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, ready]);
  return [value, setValue, ready] as const;
}

export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/** Cryptographically random index in [0, n). */
export function randomIndex(n: number): number {
  if (n <= 0) throw new Error("n must be > 0");
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / n) * n;
  do crypto.getRandomValues(buf);
  while (buf[0]! >= limit);
  return buf[0]! % n;
}

export const FEELINGS = [
  { id: "happy", label: "Happy", emoji: "🌕" },
  { id: "calm", label: "Calm", emoji: "🌙" },
  { id: "sad", label: "Sad", emoji: "🌧️" },
  { id: "confused", label: "Confused", emoji: "🌀" },
  { id: "excited", label: "Excited", emoji: "✨" },
  { id: "anxious", label: "Anxious", emoji: "🌘" },
  { id: "hopeful", label: "Hopeful", emoji: "🌠" },
] as const;

export const feelingLabel = (id: string) => FEELINGS.find((f) => f.id === id);
