import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Page, PageHeader, btn, btnGhost, input } from "@/components/cosmos";
import { Button } from "@/components/ui/button";
import { validReflectionInput } from "@/lib/reflect";
import { Telescope, Download, Sparkles, RotateCcw, X, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/reflect")({
  head: () => ({
    meta: [
      { title: "Reflection Companion — LUNORA" },
      { name: "description", content: "A gentle on-device AI that asks one reflection question about your two options. It never chooses for you." },
      { property: "og:title", content: "Reflection Companion — LUNORA" },
      { property: "og:description", content: "A gentle on-device AI that asks one reflection question about your two options. It never chooses for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reflect,
});

type Phase = "consent" | "loading" | "ready" | "reflecting" | "done" | "error";

function Reflect() {
  const [phase, setPhase] = useState<Phase>("consent");
  const [progress, setProgress] = useState(0);
  const [device, setDevice] = useState("");
  const [error, setError] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [matters, setMatters] = useState("");
  const [reflection, setReflection] = useState("");
  const workerRef = useRef<Worker | null>(null);

  const stopWorker = () => {
    workerRef.current?.terminate();
    workerRef.current = null;
  };
  useEffect(() => stopWorker, []);

  function startWorker() {
    stopWorker();
    const worker = new Worker(new URL("../lib/reflect.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent) => {
      const d = e.data as { type: string; progress?: number; device?: string; text?: string; detail?: string };
      if (d.type === "progress") setProgress(Math.round((d.progress ?? 0) * 100));
      if (d.type === "ready") {
        setDevice(d.device === "webgpu" ? "your graphics chip" : "your processor");
        setPhase("ready");
      }
      if (d.type === "token") setReflection(d.text ?? "");
      if (d.type === "done") {
        setReflection(d.text ?? "");
        setPhase("done");
      }
      if (d.type === "error") {
        console.error("Reflection companion error:", d.detail);
        setError("The companion could not respond. Your device may not have enough memory, or the model download was interrupted. Nothing you typed was sent anywhere.");
        setPhase("error");
      }
    };
    worker.onerror = () => {
      setError("The companion could not start on this device. Nothing you typed was sent anywhere.");
      setPhase("error");
    };
    workerRef.current = worker;
    return worker;
  }

  function download() {
    setPhase("loading");
    setProgress(0);
    setError("");
    startWorker().postMessage({ type: "load" });
  }

  function reflect() {
    if (!validReflectionInput(a, b) || !workerRef.current) return;
    setReflection("");
    setPhase("reflecting");
    workerRef.current.postMessage({ type: "generate", a, b, matters });
  }

  function cancel() {
    // Terminating the worker stops generation; the downloaded model stays cached.
    stopWorker();
    setPhase("ready");
    setReflection("");
  }

  function retry() {
    setError("");
    setPhase("consent");
  }

  const valid = validReflectionInput(a, b);
  const editing = phase === "ready" || phase === "done";

  return (
    <Page companion="I only ask questions. The answer is always yours.">
      <PageHeader
        eyebrow="Reflection Companion"
        title="A Gentle Question, Just for You"
        subtitle="Share two options you're weighing, and a small open AI — Qwen3-0.6B, running entirely on your device — asks one question to help you reflect. It never chooses for you."
      />
      <div className="mx-auto max-w-xl">
        <div className="glass mb-6 flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <ShieldCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <p>
            Completely private: the AI model downloads once to this browser (about 400&nbsp;MB from Hugging Face, the model's
            host) and then runs on your device. What you type here is never sent to any server, and nothing is saved unless
            you copy it yourself. Your journal, feelings and stars are never shared with it.
          </p>
        </div>

        {phase === "consent" && (
          <div className="text-center">
            <Button className={btn} onClick={download}>
              <Download />Download the companion
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              One-time download, then it works offline in this browser. You can delete it anytime by clearing this site's data.
            </p>
          </div>
        )}

        {phase === "loading" && (
          <div className="text-center" aria-live="polite">
            <p className="text-muted-foreground">Warming up the companion… {progress > 0 ? `${progress}%` : ""}</p>
            <div className="mx-auto mt-4 h-2 max-w-xs overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Model download progress">
              <div className="h-full bg-aurora transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">This can take a few minutes on first download.</p>
          </div>
        )}

        {phase === "error" && (
          <div className="glass p-5 text-center" role="alert">
            <p className="text-foreground">{error}</p>
            <Button className={`${btnGhost} mt-4`} onClick={retry}>
              <RotateCcw />Try again
            </Button>
          </div>
        )}

        {(editing || phase === "reflecting") && (
          <>
            <div className="space-y-3">
              <label className="block text-sm text-muted-foreground">
                First option
                <input className={`${input} mt-2`} maxLength={80} placeholder="e.g. Take the new job" value={a} disabled={phase === "reflecting"} onChange={(e) => setA(e.target.value)} />
              </label>
              <label className="block text-sm text-muted-foreground">
                Second option
                <input className={`${input} mt-2`} maxLength={80} placeholder="e.g. Stay where I am" value={b} disabled={phase === "reflecting"} onChange={(e) => setB(e.target.value)} />
              </label>
              <label className="block text-sm text-muted-foreground">
                What matters most to you? (optional)
                <textarea className={`${input} mt-2 min-h-20`} maxLength={300} placeholder="e.g. Time with family, steady income, learning new things" value={matters} disabled={phase === "reflecting"} onChange={(e) => setMatters(e.target.value)} />
              </label>
              {!valid && <p className="text-sm text-muted-foreground">Add two different options to reflect on.</p>}
            </div>
            <div className="mt-6 text-center" aria-live="polite" aria-atomic="true">
              {editing && (
                <Button className={btn} disabled={!valid} onClick={reflect}>
                  <Sparkles />Ask for a reflection
                </Button>
              )}
              {phase === "reflecting" && (
                <div>
                  <p className="text-muted-foreground">{reflection ? "The companion is writing…" : "The companion is thinking…"}</p>
                  <Button className={`${btnGhost} mt-3`} onClick={cancel}>
                    <X />Cancel
                  </Button>
                </div>
              )}
            </div>
            {(phase === "reflecting" || phase === "done") && reflection && (
              <div className="glass mt-6 p-5 text-center">
                <Sparkles aria-hidden className="mx-auto mb-3 h-5 w-5 text-accent" />
                <p className="font-display text-xl leading-relaxed text-foreground">{reflection}</p>
                {phase === "done" && <p className="mt-3 text-xs text-muted-foreground">A question, not an answer — the choice stays with you.</p>}
              </div>
            )}
            {phase === "done" && (
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button className={btnGhost} onClick={reflect}>
                  <RotateCcw />Reflect again
                </Button>
              </div>
            )}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Running on {device || "your device"} · Qwen3-0.6B (open weights, Apache-2.0) · nothing leaves this browser
            </p>
          </>
        )}
      </div>
    </Page>
  );
}
