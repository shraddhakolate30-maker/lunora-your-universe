import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page, PageHeader, btn, btnGhost, input } from "@/components/cosmos";
import { uid, useLocalStore } from "@/lib/storage";

export const Route = createFileRoute("/stars")({
  head: () => ({
    meta: [
      { title: "My Stars — LUNORA" },
      { name: "description", content: "Save thoughts, wishes and ideas as glowing stars." },
      { property: "og:title", content: "My Stars — LUNORA" },
      { property: "og:description", content: "Your thoughts deserve space." },
    ],
  }),
  component: Stars,
});

const KINDS = ["Thought", "Wish", "Idea", "Remember"] as const;
type Star = { id: string; text: string; kind: string; x: number; y: number };

function Stars() {
  const [stars, setStars] = useLocalStore<Star[]>("lunora.stars", []);
  const [text, setText] = useState("");
  const [kind, setKind] = useState<string>("Thought");
  const [editing, setEditing] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  function submit() {
    const t = text.trim();
    if (!t) return;
    if (editing) {
      setStars(stars.map((s) => (s.id === editing ? { ...s, text: t, kind } : s)));
      setEditing(null);
    } else {
      setStars([...stars, { id: uid(), text: t, kind, x: 8 + Math.random() * 84, y: 10 + Math.random() * 78 }]);
    }
    setText("");
  }
  const sel = stars.find((s) => s.id === selected);

  return (
    <Page companion="Your thoughts deserve space.">
      <PageHeader eyebrow="My Stars" title="Light up your sky" subtitle="Every thought, wish or idea becomes a star you can return to." />
      <div className="glass mx-auto mb-8 max-w-2xl p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <button key={k} className={kind === k ? btn : btnGhost} onClick={() => setKind(k)}>{k}</button>
          ))}
        </div>
        <textarea className={`${input} min-h-20`} maxLength={280} placeholder="What's shining in your mind?" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="mt-3 flex gap-2">
          <button className={btn} disabled={!text.trim()} onClick={submit}>{editing ? "Update star" : "✦ Place star"}</button>
          {editing && <button className={btnGhost} onClick={() => { setEditing(null); setText(""); }}>Cancel</button>}
        </div>
      </div>

      <div className="glass relative h-[420px] overflow-hidden">
        {stars.length === 0 && <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-muted-foreground">Your sky is quiet. Place your first star above.</p>}
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {stars.slice(1).map((s, i) => (
            <line key={s.id} x1={`${stars[i].x}%`} y1={`${stars[i].y}%`} x2={`${s.x}%`} y2={`${s.y}%`} stroke="var(--lavender)" strokeOpacity="0.25" />
          ))}
        </svg>
        {stars.map((s, i) => (
          <button key={s.id} onClick={() => setSelected(s.id)} aria-label={s.text}
            className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
            <span className={`block rounded-full bg-star shadow-glow animate-twinkle ${selected === s.id ? "h-5 w-5" : "h-3 w-3"}`} style={{ animationDelay: `${i * 0.4}s` }} />
          </button>
        ))}
        {sel && (
          <div className="glass absolute bottom-4 left-4 right-4 p-4 md:left-auto md:w-80">
            <p className="text-xs uppercase tracking-widest text-accent">{sel.kind}</p>
            <p className="mt-1 whitespace-pre-wrap">{sel.text}</p>
            <div className="mt-3 flex gap-2">
              <button className={btnGhost} onClick={() => { setEditing(sel.id); setText(sel.text); setKind(sel.kind); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
              <button className={btnGhost} onClick={() => { setStars(stars.filter((x) => x.id !== sel.id)); setSelected(null); }}>Delete</button>
              <button className={btnGhost} onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
      {stars.length > 0 && <p className="mt-3 text-center text-sm text-muted-foreground">Tap a star to read, edit or let it go.</p>}
    </Page>
  );
}
