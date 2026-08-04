import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Radar, Boxes, Satellite, Brain, ShieldCheck } from "lucide-react";
import { EgyptMap } from "@/components/eagle/egypt-map";
import { SimBadge, StatusDot, TechLabel, Counter } from "@/components/eagle/hud";
import { INCIDENTS } from "@/lib/eagle-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EAGLE EYE — AI Defense Command & Digital Twin" },
      {
        name: "description",
        content:
          "A unified simulated intelligence environment for situational awareness, emergency response, infrastructure monitoring and disaster simulation. ITC 2026 student prototype.",
      },
      { property: "og:title", content: "EAGLE EYE — AI Defense Command & Digital Twin" },
      {
        property: "og:description",
        content:
          "See the situation. Understand the risk. Respond smarter. A cinematic command-and-control simulation environment focused on Egypt.",
      },
    ],
  }),
  component: Landing,
});

const INDICATORS = [
  { label: "SYSTEM STATUS", value: "ONLINE", tone: "signal" as const },
  { label: "AI ENGINE", value: "ACTIVE", tone: "cyan" as const },
  { label: "DIGITAL TWIN", value: "SYNCHRONIZED", tone: "gold" as const },
  { label: "SATELLITE FEED", value: "SIMULATED", tone: "gold" as const },
];

const MODULES = [
  {
    icon: Radar,
    title: "COMMAND CENTER",
    body: "A live tactical picture of monitored zones, sensor mesh, response teams and active simulated incidents.",
    to: "/command",
  },
  {
    icon: Boxes,
    title: "DIGITAL TWIN",
    body: "An interactive 3D replica of a fictional strategic infrastructure zone with per-object telemetry.",
    to: "/twin",
  },
  {
    icon: Satellite,
    title: "SATELLITE INTELLIGENCE",
    body: "Before / after change detection with AI-classified regions and confidence scoring.",
    to: "/satellite",
  },
  {
    icon: Brain,
    title: "AI SITUATION ROOM",
    body: "Natural-language situational reasoning with response, rescue and logistics recommendations.",
    to: "/situation",
  },
];

function Landing() {
  const layers = {
    infrastructure: true,
    sensors: true,
    emergency: true,
    logistics: true,
    incidents: true,
    environment: true,
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* HERO */}
      <section className="hero-glow relative flex min-h-screen flex-col">
        <div className="absolute inset-0 opacity-70">
          <EgyptMap layers={layers} incidents={INCIDENTS} className="h-full w-full" compact />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />

        <header className="relative z-10 flex items-center justify-between px-5 py-5 md:px-10">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-gold/40 bg-gold/10">
              <Radar className="h-4.5 w-4.5 text-gold" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-sm font-bold tracking-[0.25em]">EAGLE EYE</span>
              <TechLabel className="mt-1 block text-[9px]">AI DEFENSE COMMAND</TechLabel>
            </span>
          </div>
          <Link
            to="/command"
            className="label-tech hidden items-center gap-2 rounded-sm border border-border/60 px-4 py-2.5 text-foreground/80 transition-colors hover:border-gold/50 hover:text-gold sm:inline-flex"
          >
            ENTER COMMAND CENTER <ArrowRight className="h-3 w-3" />
          </Link>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-16 md:px-10">
          <div className="flex flex-wrap items-center gap-2">
            <SimBadge className="w-fit" />
            <span className="label-tech border border-foreground/70 px-3 py-2 text-foreground">
              EGYPT EDITION · النسخة المصرية
            </span>
          </div>
          <h1 className="animate-rise mt-7 font-display text-5xl font-bold leading-[0.95] tracking-[-0.03em] md:text-7xl lg:text-8xl">
            <span className="text-gradient-gold">EAGLE EYE</span>
          </h1>
          <p className="animate-rise mt-4 font-mono text-xs uppercase tracking-[0.4em] text-gold/80 md:text-sm">
            AI Defense Command &amp; Digital Twin — Egypt
          </p>
          <p className="animate-rise mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Designed exclusively for ITC 2026, and modelled end to end on Egypt: the New
            Administrative Capital, Greater Cairo, Alexandria, the Suez Canal corridor and the
            Aswan High Dam sector.
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/60">
            See the situation. Understand the risk. Respond smarter.
          </p>


          <div className="animate-rise mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/command"
              className="group glow-edge inline-flex items-center gap-3 rounded-sm bg-gold px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-gold-foreground transition-transform hover:-translate-y-0.5"
            >
              Enter Command Center
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/simulation"
              className="inline-flex items-center gap-3 rounded-sm border border-border bg-surface/40 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-foreground/85 backdrop-blur transition-colors hover:border-gold/50 hover:text-gold"
            >
              Explore the Simulation
            </Link>
          </div>

          <div className="mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden border border-border/60 bg-border/40 md:grid-cols-4">
            {INDICATORS.map((i) => (
              <div key={i.label} className="bg-background/70 px-4 py-3.5 backdrop-blur">
                <TechLabel>{i.label}</TechLabel>
                <div className="mt-2 flex items-center gap-2 font-mono text-[11px] tracking-wider">
                  <StatusDot tone={i.tone} />
                  <span
                    className={
                      i.tone === "signal"
                        ? "text-signal"
                        : i.tone === "cyan"
                          ? "text-cyan"
                          : "text-gold"
                    }
                  >
                    {i.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-4 md:px-10">
          <TechLabel className="text-gold/80">
            DESIGNED EXCLUSIVELY FOR ITC 2026 — EGYPT EDITION
          </TechLabel>
          <TechLabel>STUDENT TECHNOLOGY PROTOTYPE — NON-OPERATIONAL SIMULATION</TechLabel>
        </div>
      </section>

      {/* BUILT FOR ITC — EGYPT EDITION */}
      <section className="rule-heavy border-b border-border/60 bg-surface/20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_1fr] md:px-10">
          <div className="offset-1">
            <TechLabel className="text-gold/80">PURPOSE-BUILT</TechLabel>
            <h2 className="mt-4 text-3xl leading-[0.95] md:text-5xl">
              Designed exclusively
              <br />
              for ITC 2026
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              EAGLE EYE was not adapted from a generic dashboard. Every module, dataset and
              screen in this environment was authored specifically for the ITC 2026 competition
              brief, then tuned as an Egypt edition: Egyptian geography, Egyptian monitoring
              zones and Egyptian civil-protection response scenarios.
            </p>
          </div>
          <div className="offset-2 grid gap-px bg-border/40">
            {[
              ["ITC 2026", "Purpose-built competition prototype"],
              ["EGYPT EDITION", "5 national zones — Cairo, New Capital, Alexandria, Suez, Aswan"],
              ["ARABIC CONTEXT", "Egyptian place names and civil-response framing"],
              ["DEFENSIVE ONLY", "Emergency response and infrastructure monitoring"],
            ].map(([k, v]) => (
              <div key={k} className="bg-background px-5 py-5">
                <TechLabel className="text-foreground">{k}</TechLabel>
                <p className="mt-2 text-sm text-muted-foreground">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITY STRIP */}
      <section className="border-t border-border/60 bg-surface/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border/40 md:grid-cols-4">
          {[
            { k: "EGYPTIAN ZONES MONITORED", v: 5, s: "" },
            { k: "SIMULATED NODES", v: 20, s: "" },
            { k: "AI DETECTION ACCURACY", v: 96, s: "%" },
            { k: "RESOURCE READINESS", v: 94, s: "%" },
          ].map((s) => (
            <div key={s.k} className="bg-background px-6 py-8">
              <TechLabel>{s.k}</TechLabel>
              <div className="mt-3 text-3xl font-semibold text-gold">
                <Counter value={s.v} suffix={s.s} />
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* MODULES */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
        <TechLabel className="text-gold/80">PLATFORM MODULES</TechLabel>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
          One environment. Every layer of the situation.
        </h2>
        <div className="mt-12 grid gap-px bg-border/40 md:grid-cols-2">
          {MODULES.map((m) => (
            <Link
              key={m.title}
              to={m.to}
              className="group relative bg-background p-8 transition-colors hover:bg-surface/60"
            >
              <m.icon className="h-5 w-5 text-gold" />
              <h3 className="mt-5 font-mono text-xs uppercase tracking-[0.22em] text-foreground">
                {m.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{m.body}</p>
              <ArrowRight className="mt-6 h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-gold" />
            </Link>
          ))}
        </div>
      </section>

      {/* ETHICS */}
      <section className="border-y border-border/60 bg-surface/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:px-10">
          <ShieldCheck className="h-8 w-8 shrink-0 text-signal" />
          <div>
            <TechLabel className="text-signal">DEFENSIVE SCOPE ONLY</TechLabel>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              EAGLE EYE is a defensive, emergency-response and infrastructure-monitoring
              simulation. It contains no weapons, targeting, attack planning or operational
              military capability. All imagery, telemetry, incidents and analysis shown are
              generated demonstration data. This project is not affiliated with any armed forces
              or government body.
            </p>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-10 md:px-10">
        <span className="font-display text-sm font-bold tracking-[0.25em] text-foreground/80">
          EAGLE EYE
        </span>
        <TechLabel>DESIGNED EXCLUSIVELY FOR ITC 2026 · EGYPT EDITION</TechLabel>
        <Link to="/about" className="label-tech text-gold/80 hover:text-gold">
          ABOUT THE TECHNOLOGY →
        </Link>
      </footer>
    </div>
  );
}
