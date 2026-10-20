import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/cosmos";
import { Button } from "@/components/ui/button";
import { ArrowRight, Orbit, Moon, Star, BookOpen, AudioLines } from "lucide-react";
import astronaut from "@/assets/astronaut.png";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "LUNORA — Your Space. Your Universe." },
    { name: "description", content: "A space for your thoughts, feelings, memories, and everyday choices." },
    { property: "og:title", content: "LUNORA — Your Little Universe, Your Little Moments." },
    { property: "og:description", content: "A space for your thoughts, feelings, memories, and everyday choices." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Index,
});
const CARDS = [
  { to: "/choices", title: "Cosmic Choices", text: "A little nudge for everyday decisions.", icon: Orbit, color: "text-accent" },
  { to: "/feelings", title: "My Feelings", text: "A moonlit moment to check in.", icon: Moon, color: "text-nebula-pink" },
  { to: "/stars", title: "My Stars", text: "Thoughts and wishes worth keeping.", icon: Star, color: "text-star" },
  { to: "/journal", title: "Cosmic Journal", text: "Little moments, lasting memories.", icon: BookOpen, color: "text-lavender" },
  { to: "/atmosphere", title: "Cosmic Atmosphere", text: "A softer soundtrack for your space.", icon: AudioLines, color: "text-accent" },
] as const;
function Index() {
  return <Page companion="Ready for a little adventure?">
    <section className="home-intro relative pb-7 pt-3 text-center md:pb-10">
      <img src={astronaut} alt="LUNORA's floating astronaut" width={816} height={816} className="mx-auto mb-3 h-28 w-28 animate-float object-contain md:h-32 md:w-32" />
      <p className="text-xs uppercase tracking-[0.18em] text-accent">Your Space. Your Universe.</p>
      <h1 className="mx-auto mt-4 max-w-3xl text-4xl leading-tight md:text-5xl">Your Little Universe,<br /><span className="text-aurora">Your Little Moments.</span></h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">A space for your thoughts, feelings, memories, and everyday choices.</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="h-auto min-h-11 bg-aurora px-5"><Link to="/choices"><Orbit />Make a Quick Choice<ArrowRight /></Link></Button>
        <Button asChild variant="secondary" size="lg" className="h-auto min-h-11 px-5"><a href="#universe">Explore My Universe<ArrowRight /></a></Button>
      </div>
    </section>
    <section id="universe" className="scroll-mt-28 border-t border-border pt-6">
      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h2 className="text-2xl">A universe of your own</h2><span className="text-xs text-muted-foreground">✦ LUNORA</span></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{CARDS.map((c) => <Link key={c.to} to={c.to} className="glass group min-w-0 p-5 transition hover:-translate-y-1 hover:border-primary">
        <div className="flex items-center justify-between"><c.icon aria-hidden className={`h-7 w-7 ${c.color}`} /><ArrowRight aria-hidden className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" /></div>
        <h3 className="mt-4 text-xl">{c.title}</h3><p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
      </Link>)}</div>
    </section>
  </Page>;
}
