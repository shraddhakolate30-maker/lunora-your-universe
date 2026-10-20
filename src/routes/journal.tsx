import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page, PageHeader, btn, btnGhost, input } from "@/components/cosmos";
import { FEELINGS, feelingLabel, uid, useLocalStore } from "@/lib/storage";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Cosmic Journal — LUNORA" },
      { name: "description", content: "A private diary of decisions and what happened next, kept only in your browser." },
      { property: "og:title", content: "Cosmic Journal — LUNORA" },
      { property: "og:description", content: "Every little moment becomes a memory." },
    ],
  }),
  component: Journal,
});

type Entry = { id: string; decision: string; at: string; feeling: string; action: string; outcome: string };
const nowLocal = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };
const blank = (): Omit<Entry, "id"> => ({ decision: "", at: nowLocal(), feeling: "calm", action: "", outcome: "" });

function Journal() {
  const [entries, setEntries, ready, storageError] = useLocalStore<Entry[]>("lunora.journal", []);
  const [form, setForm] = useState(blank());
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [err, setErr] = useState("");

  function save() {
    if (!form.decision.trim()) return setErr("Please describe your moment.");
    if (!form.at) return setErr("Please choose a date and time.");
    setErr("");
    if (editing) setEntries(entries.map((e) => (e.id === editing ? { ...form, id: editing } : e)));
    else setEntries([{ ...form, id: uid() }, ...entries]);
    setForm(blank()); setEditing(null); setShowForm(false);
  }
  const set = (k: keyof Entry) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });
  const sorted = [...entries].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <Page companion="Every little moment becomes a memory.">
      <PageHeader eyebrow="Cosmic Journal" title="Your galaxy of memories" subtitle="Private to you — saved only in this browser, never sent anywhere." />
      {storageError && <p role="alert" className="mb-4 text-destructive">{storageError}</p>}
      {!showForm && <div className="mb-8 text-center"><Button className={btn} onClick={() => { setForm(blank()); setEditing(null); setErr(""); setShowForm(true); }}>✦ New memory</Button></div>}

      {showForm && (
        <div className="mx-auto mb-10 grid max-w-2xl gap-4">
          <label className="text-sm text-muted-foreground">Decision or memory<input className={input} maxLength={150} value={form.decision} onChange={set("decision")} placeholder="What happened, or what did you decide?" /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-muted-foreground">Date & time<input type="datetime-local" className={input} value={form.at} onChange={set("at")} /></label>
            <label className="text-sm text-muted-foreground">Feeling
              <select className={input} value={form.feeling} onChange={set("feeling")}>
                {FEELINGS.map((f) => <option key={f.id} value={f.id}>{f.emoji} {f.label}</option>)}
              </select>
            </label>
          </div>
          <label className="text-sm text-muted-foreground">What I actually did<textarea className={`${input} min-h-20`} maxLength={1000} value={form.action} onChange={set("action")} /></label>
          <label className="text-sm text-muted-foreground">What happened afterward<textarea className={`${input} min-h-20`} maxLength={1000} value={form.outcome} onChange={set("outcome")} placeholder="You can fill this in later." /></label>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <div className="flex gap-2">
            <Button className={btn} disabled={!ready || !!storageError} onClick={save}>{editing ? "Update memory" : "Save memory"}</Button>
            <Button className={btnGhost} onClick={() => { setShowForm(false); setEditing(null); setErr(""); }}>Cancel</Button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="glass p-8 text-center text-muted-foreground">Your galaxy is waiting for its first memory.</p>
      ) : (
        <div className="relative">
          <div className="absolute bottom-0 left-5 top-0 w-px bg-aurora opacity-40 md:left-1/2" />
          <ul className="space-y-6">
            {sorted.map((e, i) => {
              const fl = feelingLabel(e.feeling);
              const isOpen = open === e.id;
              return (
                <li key={e.id} className={`relative pl-12 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-10" : "md:pr-10"}`}>
                  <span className={`absolute top-5 h-4 w-4 rounded-full bg-star shadow-glow left-3 ${i % 2 ? "md:-left-2" : "md:left-auto md:-right-2"}`} />
                  <div className="glass p-5">
                    <Button variant="ghost" aria-expanded={isOpen} className="block h-auto w-full p-0 text-left hover:bg-transparent" onClick={() => setOpen(isOpen ? null : e.id)}>
                      <p className="text-xs text-muted-foreground">{new Date(e.at).toLocaleString()} · {fl?.emoji} {fl?.label}</p>
                      <h3 className="mt-1 text-xl">{e.decision}</h3>
                    </Button>
                    {isOpen && (
                      <div className="mt-3 space-y-2 text-sm">
                        <p><span className="text-accent">What I did:</span> {e.action || "—"}</p>
                        <p><span className="text-accent">Afterward:</span> {e.outcome || "—"}</p>
                        <div className="flex gap-2 pt-2">
                          <Button className={btnGhost} onClick={() => { const { id, ...rest } = e; setForm(rest); setEditing(id); setShowForm(true); setErr(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</Button>
                          <Button className={btnGhost} onClick={() => { if (confirm("Let this memory drift away?")) setEntries(entries.filter((x) => x.id !== e.id)); }}>Delete</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Page>
  );
}
