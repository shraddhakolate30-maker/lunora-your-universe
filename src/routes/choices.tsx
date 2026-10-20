import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Page, PageHeader, btn, btnGhost, input } from "@/components/cosmos";
import { Button } from "@/components/ui/button";
import { randomIndex } from "@/lib/storage";
import { choiceOptions, validOptions } from "@/lib/choices";
import { Plus, X, Orbit, RotateCcw, Check } from "lucide-react";
export const Route = createFileRoute("/choices")({
  head: () => ({ meta: [
    { title: "Cosmic Choices — LUNORA" }, { name: "description", content: "A quick random choice between your own options, with no AI." },
    { property: "og:title", content: "Cosmic Choices — LUNORA" }, { property: "og:description", content: "Let the cosmic portals pick one of your actual options." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Choices,
});
function Choices() {
  const [mode, setMode] = useState<"yesno" | "custom">("yesno");
  const [question, setQuestion] = useState("");
  const [custom, setCustom] = useState(["", ""]);
  const [phase, setPhase] = useState<"idle" | "spinning" | "done">("idle");
  const [active, setActive] = useState<number | null>(null);
  const [accepted, setAccepted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const options = choiceOptions(mode, custom);
  const valid = validOptions(options);
  const clearTimer = () => { if (timer.current) clearTimeout(timer.current); };
  useEffect(() => () => clearTimer(), []);
  const reset = () => { clearTimer(); setPhase("idle"); setActive(null); setAccepted(false); };
  function start() {
    if (!valid || phase === "spinning") return;
    clearTimer();
    const winner = randomIndex(options.length);
    setPhase("spinning"); setAccepted(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setActive(winner); setPhase("done"); return; }
    let step = 0;
    const total = options.length * 2 + winner;
    const tick = () => { setActive(step % options.length); if (step >= total) { setPhase("done"); return; } step++; timer.current = setTimeout(tick, 55 + step * 9); };
    tick();
  }
  return <Page companion={phase === "done" ? "Whatever you choose, it's your journey." : "Let's open a few portals."}>
    <PageHeader eyebrow="Cosmic Choices" title="Ask the Portals" subtitle="A little chance. A little clarity. The choice is always yours." />
    <div className="mx-auto max-w-xl">
      <label className="block text-sm text-muted-foreground">Your question (optional)<input className={`${input} mt-2`} value={question} maxLength={150} disabled={phase !== "idle"} onChange={(e) => setQuestion(e.target.value)} placeholder="What should I choose today?" /></label>
      <div role="group" aria-label="Decision type" className="my-5 flex justify-center gap-2">{(["yesno", "custom"] as const).map((m) => <Button key={m} disabled={phase === "spinning"} aria-pressed={mode === m} className={mode === m ? btn : btnGhost} onClick={() => { setMode(m); reset(); }}>{m === "yesno" ? "Yes / No" : "My own options"}</Button>)}</div>
      {mode === "custom" && phase === "idle" && <div className="mb-7 space-y-3">{custom.map((v, i) => <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2"><input aria-label={`Option ${i + 1}`} className={input} maxLength={60} placeholder={`Option ${i + 1}`} value={v} onChange={(e) => setCustom(custom.map((c, j) => j === i ? e.target.value : c))} />{custom.length > 2 && <Button variant="secondary" size="icon" className="h-11" aria-label={`Remove option ${i + 1}`} onClick={() => setCustom(custom.filter((_, j) => j !== i))}><X /></Button>}</div>)}
        {custom.length < 8 && <Button className={btnGhost} onClick={() => setCustom([...custom, ""])}><Plus />Add option</Button>}
        {!valid && <p className="text-sm text-muted-foreground">{options.length < 2 ? "Add at least two options." : "Each option should be different."}</p>}
      </div>}
    </div>
    <div className="flex flex-wrap justify-center gap-4">{options.map((o, i) => <div key={i} className={`flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-2 p-4 text-center transition md:h-40 md:w-40 ${active === i ? "border-primary bg-aurora text-primary-foreground shadow-glow" : "border-border bg-muted"} ${phase === "done" && active !== i ? "opacity-40" : ""}`}><span className="break-all font-display text-lg">{o}</span></div>)}</div>
    <div className="mt-7 text-center" aria-live="polite" aria-atomic="true">
      {phase === "idle" && <Button className={btn} disabled={!valid} onClick={start}><Orbit />Open the portals</Button>}
      {phase === "spinning" && <p className="text-muted-foreground">The stars are aligning…</p>}
      {phase === "done" && active !== null && <div className="mx-auto max-w-xl border-t border-border pt-6">
        {question && <p className="mb-2 text-muted-foreground">{question}</p>}<p className="text-sm text-muted-foreground">The universe whispers:</p><p className="mt-2 font-display text-3xl text-aurora">{options[active]}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3"><Button className={btn} disabled={accepted} onClick={() => setAccepted(true)}><Check />{accepted ? "Choice accepted" : "Accept My Choice"}</Button><Button className={btnGhost} onClick={start}><RotateCcw />Try Again</Button></div>
        {accepted && <p className="mt-3 text-sm text-accent">Trust yourself along the way.</p>}<Button variant="link" className="mt-3 text-muted-foreground" onClick={reset}>Change options</Button>
      </div>}
    </div>
    <p className="mx-auto mt-8 max-w-md text-center text-xs text-muted-foreground">Pure chance, not advice. For important decisions, trust your judgment.</p>
  </Page>;
}
