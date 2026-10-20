import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Page, PageHeader, btn, btnGhost } from "@/components/cosmos";

export const Route = createFileRoute("/atmosphere")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Cosmic Atmosphere — LUNORA" },
      { name: "description", content: "Optional ambient soundscapes generated live in your browser." },
      { property: "og:title", content: "Cosmic Atmosphere — LUNORA" },
      { property: "og:description", content: "Cosmic Calm, Rainy Orbit and Silent Space." },
    ],
  }),
  component: Atmosphere,
});

type Mode = "calm" | "rain" | "silent";
const MODES: { id: Mode; label: string; desc: string; icon: string }[] = [
  { id: "calm", label: "Cosmic Calm", desc: "A soft, slowly breathing drone.", icon: "🌌" },
  { id: "rain", label: "Rainy Orbit", desc: "Gentle filtered rain-like noise.", icon: "🌧️" },
  { id: "silent", label: "Silent Space", desc: "Pure quiet. Just you and the stars.", icon: "🌑" },
];

function Atmosphere() {
  const [mode, setMode] = useState<Mode>("calm");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioScheduledSourceNode[]>([]);

  const stop = () => { nodesRef.current.forEach((n) => { try { n.stop(); } catch {} }); nodesRef.current = []; };

  function play(m: Mode) {
    stop();
    if (m === "silent") return;
    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;
    if (!gainRef.current) { gainRef.current = ctx.createGain(); gainRef.current.connect(ctx.destination); }
    gainRef.current.gain.value = volume;
    const out = gainRef.current;
    if (m === "calm") {
      [110, 164.8, 220, 277.2].forEach((f, i) => {
        const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f;
        const g = ctx.createGain(); g.gain.value = 0.08;
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05 + i * 0.03;
        const lg = ctx.createGain(); lg.gain.value = 0.05; lfo.connect(lg).connect(g.gain);
        o.connect(g).connect(out); o.start(); lfo.start();
        nodesRef.current.push(o, lfo);
      });
    } else {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1200; f.Q.value = 0.6;
      const g = ctx.createGain(); g.gain.value = 0.5;
      src.connect(f).connect(g).connect(out); src.start();
      nodesRef.current.push(src);
    }
    ctx.resume();
  }

  useEffect(() => { if (gainRef.current) gainRef.current.gain.value = volume; }, [volume]);
  useEffect(() => () => { stop(); ctxRef.current?.close(); }, []);

  const toggle = () => { if (mode === "silent") return; if (playing) { stop(); setPlaying(false); } else { play(mode); setPlaying(true); } };
  const choose = (m: Mode) => { setMode(m); if (m === "silent") { stop(); setPlaying(false); } else if (playing) play(m); };

  return (
    <Page companion="Take a slow breath. You're right where you need to be.">
      <PageHeader eyebrow="Cosmic Atmosphere" title="Tune your universe" subtitle="Optional ambient sound, created live in your browser. Nothing plays until you press play." />
      <div className="grid gap-4 sm:grid-cols-3">
        {MODES.map((m) => (
          <Button key={m.id} onClick={() => choose(m.id)} aria-pressed={mode === m.id} variant="ghost" className={`glass block h-auto p-6 text-left transition ${mode === m.id ? "shadow-glow ring-2 ring-ring" : "hover:-translate-y-1"}`}>
            <div className="text-3xl">{m.icon}</div>
            <h2 className="mt-2 text-xl">{m.label}</h2>
            <p className="text-sm text-muted-foreground">{m.desc}</p>
          </Button>
        ))}
      </div>
      <div className="glass mx-auto mt-8 flex max-w-md flex-col items-center gap-4 p-6">
        <Button className={btn} disabled={mode === "silent"} onClick={toggle}>{playing ? "❚❚ Pause" : "▶ Play"}</Button>
        <label className="flex w-full items-center gap-3 text-sm text-muted-foreground">
          Volume
          <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(+e.target.value)} aria-label="Volume" className="min-w-0 flex-1 accent-primary" />
        </label>
        {mode === "silent" && <p className="text-sm text-muted-foreground">Silent Space is on — enjoy the quiet.</p>}
        <Button className={btnGhost} onClick={() => setVolume(0.4)}>Reset volume</Button>
      </div>
    </Page>
  );
}
