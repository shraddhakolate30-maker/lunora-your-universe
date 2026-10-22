import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Page, PageHeader, btn, btnGhost, input } from "@/components/cosmos";
import { Button } from "@/components/ui/button";
import { randomIndex } from "@/lib/storage";
import { choiceOptions, validOptions, assignChits } from "@/lib/choices";
import { Plus, X, Orbit, RotateCcw, Check, Sparkles, ArrowLeft } from "lucide-react";
export const Route = createFileRoute("/choices")({
  head: () => ({ meta: [
    { title: "Cosmic Choices — LUNORA" }, { name: "description", content: "A quick random choice between your own options, with no AI." },
    { property: "og:title", content: "Cosmic Choices — LUNORA" }, { property: "og:description", content: "Let the cosmic portals pick one of your actual options." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Choices,
});

type Mode = "yesno" | "custom" | "secret";
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Choices() {
  const [mode, setMode] = useState<Mode>("yesno");
  const [question, setQuestion] = useState("");
  const [custom, setCustom] = useState(["", ""]);
  const [phase, setPhase] = useState<"idle" | "spinning" | "done">("idle");
  const [active, setActive] = useState<number | null>(null);
  const [accepted, setAccepted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const options = choiceOptions(mode === "custom" ? "custom" : "yesno", custom);
  const valid = validOptions(options);
  const clearTimer = () => { if (timer.current) clearTimeout(timer.current); };
  useEffect(() => () => clearTimer(), []);
  const reset = () => { clearTimer(); setPhase("idle"); setActive(null); setAccepted(false); };
  function start() {
    if (!valid || phase === "spinning") return;
    clearTimer();
    const winner = randomIndex(options.length);
    setPhase("spinning"); setAccepted(false);
    if (reducedMotion()) { setActive(winner); setPhase("done"); return; }
    let step = 0;
    const total = options.length * 2 + winner;
    const tick = () => { setActive(step % options.length); if (step >= total) { setPhase("done"); return; } step++; timer.current = setTimeout(tick, 55 + step * 9); };
    tick();
  }
  return <Page companion={phase === "done" ? "Whatever you choose, it's your journey." : "Let's open a few portals."}>
    <PageHeader eyebrow="Cosmic Choices" title="Ask the Portals" subtitle="A little chance. A little clarity. The choice is always yours." />
    <div className="mx-auto max-w-xl">
      <label className="block text-sm text-muted-foreground">Your question (optional)<input className={`${input} mt-2`} value={question} maxLength={150} disabled={phase !== "idle"} onChange={(e) => setQuestion(e.target.value)} placeholder="What should I choose today?" /></label>
      <div role="group" aria-label="Decision type" className="my-5 flex flex-wrap justify-center gap-2">{(["yesno", "custom", "secret"] as const).map((m) => <Button key={m} disabled={phase === "spinning"} aria-pressed={mode === m} className={mode === m ? btn : btnGhost} onClick={() => { setMode(m); reset(); }}>{m === "yesno" ? "Yes / No" : m === "custom" ? "My own options" : "Secret Chit"}</Button>)}</div>
      {mode === "custom" && phase === "idle" && <div className="mb-7 space-y-3">{custom.map((v, i) => <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2"><input aria-label={`Option ${i + 1}`} className={input} maxLength={60} placeholder={`Option ${i + 1}`} value={v} onChange={(e) => setCustom(custom.map((c, j) => j === i ? e.target.value : c))} />{custom.length > 2 && <Button variant="secondary" size="icon" className="h-11" aria-label={`Remove option ${i + 1}`} onClick={() => setCustom(custom.filter((_, j) => j !== i))}><X /></Button>}</div>)}
        {custom.length < 8 && <Button className={btnGhost} onClick={() => setCustom([...custom, ""])}><Plus />Add option</Button>}
        {!valid && <p className="text-sm text-muted-foreground">{options.length < 2 ? "Add at least two options." : "Each option should be different."}</p>}
      </div>}
    </div>
    {mode === "secret" ? <SecretChit question={question} onBack={() => { setMode("yesno"); reset(); }} /> : <>
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
    </>}
    <p className="mx-auto mt-8 max-w-md text-center text-xs text-muted-foreground">Pure chance, not advice. For important decisions, trust your judgment.</p>
  </Page>;
}

function SecretChit({ question, onBack }: { question: string; onBack: () => void }) {
  const [source, setSource] = useState<"yesno" | "custom">("yesno");
  const [pair, setPair] = useState(["", ""]);
  const [chits, setChits] = useState<[string, string] | null>(null);
  const [opened, setOpened] = useState<number | null>(null);
  const [opening, setOpening] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const options = source === "yesno" ? ["Yes", "No"] : pair.map((s) => s.trim());
  const valid = validOptions(options) && options.length === 2;
  function pick(i: number) {
    if (opened !== null || opening || !valid) return;
    const assignment = assignChits(options[0] ?? "", options[1] ?? "", randomIndex);
    setChits(assignment);
    if (reducedMotion()) { setOpened(i); return; }
    setOpening(true);
    timer.current = setTimeout(() => { setOpening(false); setOpened(i); }, 650);
  }
  function pickAgain() { if (timer.current) clearTimeout(timer.current); setChits(null); setOpened(null); setOpening(false); }
  return <div className="mx-auto max-w-xl text-center">
    <div role="group" aria-label="Secret chit options" className="mb-6 flex flex-wrap justify-center gap-2">
      {(["yesno", "custom"] as const).map((s) => <Button key={s} aria-pressed={source === s} disabled={opened !== null || opening} className={source === s ? btn : btnGhost} onClick={() => { setSource(s); pickAgain(); }}>{s === "yesno" ? "Yes / No" : "Two of my own"}</Button>)}
    </div>
    {source === "custom" && <div className="mb-6 space-y-3">
      {pair.map((v, i) => <input key={i} aria-label={`Secret option ${i + 1}`} className={input} maxLength={60} placeholder={`Secret option ${i + 1}`} value={v} disabled={opened !== null || opening} onChange={(e) => setPair(pair.map((p, j) => j === i ? e.target.value : p))} />)}
      {!valid && <p className="text-sm text-muted-foreground">{options.filter(Boolean).length < 2 ? "Add two options for the chits." : "Each option should be different."}</p>}
    </div>}
    {question && <p className="mb-4 text-muted-foreground">{question}</p>}
    <p className="mb-6 text-sm text-muted-foreground">{opened === null ? "Two sealed chits drift before you. One holds your answer — pick one." : "The chit unfolds…"}</p>
    <div className="flex flex-wrap justify-center gap-6" aria-live="polite" aria-atomic="true">
      {[0, 1].map((i) => {
        const isOpened = opened === i;
        const isFaded = opened !== null && opened !== i;
        return <Button key={i} variant="ghost" disabled={!valid || opened !== null || opening} aria-label={isOpened ? `Opened chit: ${chits?.[i] ?? ""}` : `Sealed cosmic chit ${i + 1}`} onClick={() => pick(i)}
          className={`glass relative h-44 w-36 flex-col items-center justify-center gap-2 overflow-hidden p-4 transition hover:bg-transparent md:h-52 md:w-40 ${isFaded ? "opacity-40" : ""} ${!isOpened && !isFaded ? "shadow-glow hover:-translate-y-1" : ""} ${isOpened ? "ring-2 ring-ring shadow-glow" : ""}`}>
          {isOpened && chits ? <>
            <Sparkles aria-hidden className="h-6 w-6 text-accent" />
            <span className="animate-chit-reveal break-all font-display text-2xl text-aurora">{chits[i]}</span>
            <span className="text-xs text-muted-foreground">Your chit reveals</span>
          </> : <>
            <span aria-hidden className={`absolute inset-3 rounded-xl border border-dashed border-border ${opening ? "animate-portal" : ""}`} />
            <Sparkles aria-hidden className="h-7 w-7 text-accent" />
            <span className="font-display text-lg text-muted-foreground">Sealed Chit</span>
            <span className="text-xs text-muted-foreground">Tap to unfold</span>
          </>}
        </Button>;
      })}
    </div>
    <div className="mt-7 flex flex-wrap justify-center gap-3">
      {opened !== null && <Button className={btn} onClick={pickAgain}><RotateCcw />Pick Again</Button>}
      <Button className={btnGhost} onClick={onBack}><ArrowLeft />Back to Choices</Button>
    </div>
  </div>;
}
