import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useState, useEffect, type ReactNode } from "react";
import astronaut from "@/assets/astronaut.png";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";

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
  { to: "/reflect", label: "Reflect" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 lg:flex">
        <Link to="/" className="min-w-0 font-display text-2xl text-foreground">☾ LUNORA</Link>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="main-links" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
        <div id="main-links" className={`${open ? "grid" : "hidden"} col-span-2 grid-cols-2 gap-1 lg:ml-auto lg:flex`}>
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="shrink-0 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
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
    <aside aria-label="Astronaut companion" className="mt-12 flex items-center justify-end gap-3 border-t border-border pt-5">
      {open && (
        <div className="max-w-[240px] text-sm text-muted-foreground">
          <p>{message}</p>
          <Button variant="link" onClick={() => setOpen(false)} className="mt-1 h-auto p-0 text-xs text-muted-foreground hover:text-foreground">
            hide
          </Button>
        </div>
      )}
      <Button variant="ghost" onClick={() => setOpen((o) => !o)} aria-label="Astronaut companion" aria-expanded={open} className="h-16 w-16 shrink-0 p-0 hover:bg-transparent">
        <img src={astronaut} alt="" className="h-16 w-16 animate-float object-contain" />
      </Button>
    </aside>
  );
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mb-8 text-center"><Sparkles aria-hidden className="mx-auto mb-4 h-6 w-6 text-accent" />
      <p className="text-xs uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
      <h1 className="mt-2 text-4xl md:text-5xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function Page({ children, companion }: { children: ReactNode; companion: string }) {
  return (
    <main id="main-content" className="mx-auto min-w-0 max-w-5xl px-5 pb-8 pt-8 md:pt-12">
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
