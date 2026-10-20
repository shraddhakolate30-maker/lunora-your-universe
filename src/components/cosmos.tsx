import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useState, useEffect, type ReactNode } from "react";
import astronaut from "@/assets/astronaut.png";

export function Starfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        left: (i * 37.7) % 100,
        top: (i * 53.3) % 100,
        size: (i % 3) + 1,
        delay: (i % 10) * 0.3,
      })),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-star animate-twinkle"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
        />
      ))}
      <div className="absolute -right-24 top-24 h-64 w-64 rounded-full bg-aurora opacity-30 blur-3xl" />
      <div className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-nebula-pink opacity-20 blur-3xl" />
    </div>
  );
}

const NAV = [
  { to: "/", label: "Universe" },
  { to: "/choices", label: "Choices" },
  { to: "/feelings", label: "Feelings" },
  { to: "/stars", label: "Stars" },
  { to: "/journal", label: "Journal" },
  { to: "/atmosphere", label: "Atmosphere" },
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-30 px-3 pt-3">
      <nav className="glass mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2">
        <Link to="/" className="mr-2 shrink-0 font-display text-xl tracking-wide text-aurora">
          ☾ LUNORA
        </Link>
        <div className="ml-auto flex gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="shrink-0 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function Companion({ message }: { message: string }) {
  const [open, setOpen] = useState(true);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(true), [path]);
  return (
    <div className="fixed bottom-4 right-4 z-20 flex items-end gap-2">
      {open && (
        <div className="glass max-w-[220px] px-4 py-3 text-sm">
          <p>{message}</p>
          <button onClick={() => setOpen(false)} className="mt-1 text-xs text-muted-foreground hover:text-foreground">
            hide
          </button>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} aria-label="Astronaut companion" className="animate-float">
        <img src={astronaut} alt="Astronaut companion" className="h-20 w-20 drop-shadow-[0_0_20px_var(--lavender)] md:h-24 md:w-24" />
      </button>
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mb-8 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
      <h1 className="mt-2 text-4xl md:text-5xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function Page({ children, companion }: { children: ReactNode; companion: string }) {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-36 pt-10">
      {children}
      <Companion message={companion} />
    </main>
  );
}

export const btn =
  "inline-flex items-center justify-center gap-2 rounded-full bg-aurora px-5 py-2.5 font-medium text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-40";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-secondary-foreground transition hover:bg-muted";
export const input =
  "w-full rounded-xl border border-input bg-muted px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
