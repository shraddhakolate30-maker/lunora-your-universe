import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page, PageHeader, btn, btnGhost, input } from "@/components/cosmos";
import { FEELINGS, feelingLabel, uid, useLocalStore } from "@/lib/storage";

export const Route = createFileRoute("/feelings")({
  head: () => ({
    meta: [
      { title: "My Feelings — LUNORA" },
      { name: "description", content: "Record how you feel under a gentle moon." },
      { property: "og:title", content: "My Feelings — LUNORA" },
      { property: "og:description", content: "A moonlit space for your feelings." },
    ],
  }),
  component: Feelings,
});

type Feeling = { id: string; feeling: string; note: string; at: string };

function Feelings() {
  const [list, setList] = useLocalStore<Feeling[]>("lunora.feelings", []);
  const [sel, setSel] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  function save() {
    if (!sel) return;
    setList([{ id: uid(), feeling: sel, note: note.trim(), at: new Date().toISOString() }, ...list]);
    setSel(null); setNote(""); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <Page companion="Every feeling is welcome here.">
      <PageHeader eyebrow="My Feelings" title="How is your moon tonight?" subtitle="There are no right or wrong answers — just notice, gently." />
      <div className="mx-auto mb-8 h-32 w-32 rounded-full bg-star opacity-90 shadow-glow animate-float" />
      <div className="glass mx-auto max-w-2xl p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FEELINGS.map((f) => (
            <button key={f.id} onClick={() => setSel(f.id)}
              className={`rounded-2xl border p-3 transition ${sel === f.id ? "border-primary bg-aurora text-primary-foreground shadow-glow" : "border-border bg-muted hover:bg-secondary"}`}>
              <div className="text-2xl">{f.emoji}</div>
              <div className="text-sm">{f.label}</div>
            </button>
          ))}
        </div>
        <textarea className={`${input} mt-4 min-h-24`} maxLength={500} placeholder="Anything you'd like to add? (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="mt-4 flex items-center gap-3">
          <button className={btn} disabled={!sel} onClick={save}>Save to the moon</button>
          {!sel && <span className="text-sm text-muted-foreground">Pick a feeling first.</span>}
          {saved && <span className="text-sm text-accent">Saved. Thank you for sharing. 🌙</span>}
        </div>
      </div>

      <h2 className="mb-4 mt-12 text-2xl">Moon log</h2>
      {list.length === 0 ? (
        <p className="glass p-6 text-center text-muted-foreground">No moon phases yet. Your first feeling will glow here.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((f) => {
            const fl = feelingLabel(f.feeling);
            return (
              <li key={f.id} className="glass flex items-start gap-4 p-4">
                <span className="text-3xl">{fl?.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium">{fl?.label} <span className="ml-2 text-xs text-muted-foreground">{new Date(f.at).toLocaleString()}</span></p>
                  {f.note && <p className="mt-1 text-muted-foreground">{f.note}</p>}
                </div>
                <button className={btnGhost} onClick={() => setList(list.filter((x) => x.id !== f.id))}>Delete</button>
              </li>
            );
          })}
        </ul>
      )}
    </Page>
  );
}
