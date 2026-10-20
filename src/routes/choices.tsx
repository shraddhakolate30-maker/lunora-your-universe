import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page, PageHeader, btn, btnGhost, input } from "@/components/cosmos";
import { randomIndex } from "@/lib/storage";

export const Route = createFileRoute("/choices")({
  head: () => ({
    meta: [
      { title: "Cosmic Choices — LUNORA" },
      { name: "description", content: "A playful, truly random picker between your own options." },
      { property: "og:title", content: "Cosmic Choices — LUNORA" },
      { property: "og:description", content: "Let the cosmic portals choose between your options." },
    ],
  }),
  component: Choices,
});

function Choices() {
  const [mode, setMode] = useState<"yesno" | "custom">("yesno");
  const [custom, setCustom] = useState<string[]>(["", ""]);
  const [phase, setPhase] = useState<"idle" | "spinning" | "done">("idle");
  const [active, setActive] = useState<number | null>(null);
  const [accepted, setAccepted] = useState(false);

  const options = mode === "yesno" ? ["Yes", "No"] : custom.map((s) => s.trim()).filter(Boolean);
  const unique = new Set(options.map((o) => o.toLowerCase())).size === options.length;
  const valid = options.length >= 2 && unique;

  function start() {
    if (!valid) return;
    const winner = randomIndex(options.length);
    setPhase("spinning");
    setAccepted(false);
    let step = 0;
    const total = options.length * 4 + winner;
    const tick = () => {
      setActive(step % options.length);
      if (step >= total) {
        setPhase("done");
        return;
      }
      step++;
      setTimeout(tick, 80 + step * 12);
    };
    tick();
  }

  const reset = () => { setPhase("idle"); setActive(null); setAccepted(false); };

  return (
    <Page companion={phase === "done" ? "Whatever you choose, it's your journey." : "Let's open a few portals."}>
      <PageHeader eyebrow="Cosmic Choices" title="Ask the Portals" subtitle="Enter your options and let the universe pick one at random." />

      <div className="mb-6 flex justify-center gap-2">
        {(["yesno", "custom"] as const).map((m) => (
          <button key={m} onClick={() => { setMode(m); reset(); }} className={mode === m ? btn : btnGhost}>
            {m === "yesno" ? "Yes / No" : "My own options"}
          </button>
        ))}
      </div>

      {mode === "custom" && phase === "idle" && (
        <div className="glass mx-auto mb-8 max-w-lg space-y-3 p-5">
          {custom.map((v, i) => (
            <div key={i} className="flex gap-2">
              <input className={input} maxLength={60} placeholder={`Option ${i + 1}`} value={v}
                onChange={(e) => setCustom(custom.map((c, j) => (j === i ? e.target.value : c)))} />
              {custom.length > 2 && (
                <button className={btnGhost} aria-label="Remove option" onClick={() => setCustom(custom.filter((_, j) => j !== i))}>✕</button>
              )}
            </div>
          ))}
          {custom.length < 8 && <button className={btnGhost} onClick={() => setCustom([...custom, ""])}>+ Add option</button>}
          {!valid && <p className="text-sm text-muted-foreground">{!unique ? "Each option should be different." : "Add at least two options."}</p>}
        </div>
      )}

      {options.length > 0 && (
        <div className="flex flex-wrap justify-center gap-5">
          {options.map((o, i) => {
            const on = active === i;
            const win = phase === "done" && on;
            return (
              <div key={i}
                className={`flex h-36 w-36 items-center justify-center rounded-full border-2 p-4 text-center transition-all duration-150 md:h-44 md:w-44 ${
                  on ? "border-primary bg-aurora text-primary-foreground shadow-glow" : "glass"
                } ${win ? "scale-110 animate-portal" : ""} ${phase === "done" && !on ? "opacity-30" : ""}`}>
                <span className="break-words font-display text-lg">{o}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {phase === "idle" && <button className={btn} disabled={!valid} onClick={start}>✦ Open the portals</button>}
        {phase === "spinning" && <p className="text-muted-foreground">The stars are aligning…</p>}
        {phase === "done" && active !== null && (
          <div className="glass w-full max-w-md p-6 text-center">
            <p className="text-sm text-muted-foreground">The universe whispers:</p>
            <p className="mt-1 font-display text-3xl text-aurora">{options[active]}</p>
            {accepted ? (
              <p className="mt-4">Accepted. Trust yourself along the way. 🌠</p>
            ) : (
              <div className="mt-4 flex justify-center gap-2">
                <button className={btn} onClick={() => setAccepted(true)}>Accept</button>
                <button className={btnGhost} onClick={start}>Try again</button>
              </div>
            )}
            <button className="mt-3 text-sm text-muted-foreground hover:text-foreground" onClick={reset}>Change options</button>
          </div>
        )}
      </div>

      <p className="mx-auto mt-10 max-w-md text-center text-xs text-muted-foreground">
        This is a playful tool using pure chance, not a substitute for your own judgment. Your feelings about the result matter more than the result itself.
      </p>
    </Page>
  );
}
