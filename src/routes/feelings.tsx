import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page, PageHeader, btn, btnGhost, input } from "@/components/cosmos";
import { FEELINGS, feelingLabel, uid, useLocalStore } from "@/lib/storage";

export const Route = createFileRoute("/feelings")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  const [list, setList, ready, storageError] = useLocalStore<Feeling[]>("lunora.feelings", []);
  const [sel, setSel] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function save() {
    if (!sel) return;
    if (editing) setList(list.map((f) => f.id === editing ? { ...f, feeling: sel, note: note.trim() } : f));
    else setList([{ id: uid(), feeling: sel, note: note.trim(), at: new Date().toISOString() }, ...list]);
    setEditing(null);
    setSel(null); setNote(""); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <Page companion="Every feeling is welcome here.">
      <PageHeader eyebrow="My Feelings" title="How is your moon tonight?" subtitle="There are no right or wrong answers — just notice, gently." />
      <div aria-hidden className="mb-6 text-center text-6xl animate-float">🌙</div>
      {storageError && <p role="alert" className="mb-4 text-destructive">{storageError}</p>}
      <div className="glass mx-auto max-w-2xl p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FEELINGS.map((f) => (
            <Button key={f.id} onClick={() => setSel(f.id)}
              aria-pressed={sel === f.id} className={`h-auto flex-col rounded-lg border p-3 transition ${sel === f.id ? "border-primary bg-aurora text-primary-foreground shadow-glow" : "border-border bg-muted hover:bg-secondary"}`}>
              <div className="text-2xl">{f.emoji}</div>
              <div className="text-sm">{f.label}</div>
            </Button>
          ))}
        </div>
        <textarea aria-label="Feeling note" className={`${input} mt-4 min-h-24`} maxLength={500} placeholder="Anything you'd like to add? (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button className={btn} disabled={!sel || !ready || !!storageError} onClick={save}>{editing ? "Update feeling" : "Save to the moon"}</Button>
          {editing && <Button className={btnGhost} onClick={() => { setEditing(null); setSel(null); setNote(""); }}>Cancel</Button>}
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
              <li key={f.id} className="glass grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 p-4">
                <span className="text-3xl">{fl?.emoji}</span>
                <div className="min-w-0">
                  <p className="font-medium">{fl?.label} <span className="ml-2 text-xs text-muted-foreground">{new Date(f.at).toLocaleString()}</span></p>
                  {f.note && <p className="mt-1 text-muted-foreground">{f.note}</p>}
                </div>
                <div className="col-start-2 flex flex-wrap gap-2"><Button className={btnGhost} onClick={() => { setEditing(f.id); setSel(f.feeling); setNote(f.note); setSaved(false); window.scrollTo({top: 0, behavior: "smooth"}); }}>Edit</Button><Button className={btnGhost} onClick={() => { if (confirm("Delete this feeling?")) { setList(list.filter((x) => x.id !== f.id)); if (editing === f.id) { setEditing(null); setSel(null); setNote(""); } } }}>Delete</Button></div>
              </li>
            );
          })}
        </ul>
      )}
    </Page>
  );
}
