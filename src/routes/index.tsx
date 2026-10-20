import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/cosmos";
import astronaut from "@/assets/astronaut.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LUNORA — Welcome to Your Universe" },
      { name: "description", content: "A little space for everything inside you: choices, feelings, stars and memories." },
      { property: "og:title", content: "LUNORA — Welcome to Your Universe" },
      { property: "og:description", content: "A little space for everything inside you." },
    ],
  }),
  component: Index,
});

const CARDS = [
  { to: "/choices", title: "Cosmic Choices", text: "Let the portals pick between your options.", icon: "🪐" },
  { to: "/feelings", title: "My Feelings", text: "Tell the moon how you feel today.", icon: "🌙" },
  { to: "/stars", title: "My Stars", text: "Turn thoughts and wishes into stars.", icon: "⭐" },
  { to: "/journal", title: "Cosmic Journal", text: "Your decisions, kept as memories.", icon: "🌌" },
] as const;

function Index() {
  return (
    <Page companion="Ready for a little adventure?">
      <section className="relative grid items-center gap-8 py-6 md:grid-cols-2">
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">Your Space. Your Universe.</p>
          <h1 className="mt-4 text-5xl leading-tight md:text-6xl">
            Welcome to <span className="text-aurora">Your Universe</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">A little space for everything inside you.</p>
        </div>
        <div className="relative mx-auto h-72 w-72 md:h-96 md:w-96">
          <div className="absolute inset-6 rounded-full bg-aurora opacity-80 shadow-glow" />
          <div className="absolute inset-0 rounded-full border border-border animate-spin-slow">
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 rounded-full bg-star shadow-glow" />
          </div>
          <img src={astronaut} alt="Floating astronaut" width={816} height={816} className="absolute inset-10 animate-float" />
        </div>
      </section>
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className="glass group p-6 transition hover:-translate-y-1 hover:shadow-glow">
            <div className="text-4xl transition group-hover:scale-110">{c.icon}</div>
            <h2 className="mt-3 text-2xl">{c.title}</h2>
            <p className="mt-1 text-muted-foreground">{c.text}</p>
          </Link>
        ))}
      </section>
    </Page>
  );
}
