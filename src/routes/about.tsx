import { createFileRoute } from "@tanstack/react-router";
import { CommandLayout } from "@/components/eagle/command-layout";
import { Panel, PageHeader, TechLabel } from "@/components/eagle/hud";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Technology — EAGLE EYE" },
      {
        name: "description",
        content:
          "EAGLE EYE is a student technology prototype for ITC 2026: a defensive simulation platform combining digital twin, AI analysis and emergency response planning.",
      },
      { property: "og:title", content: "About & Technology — EAGLE EYE" },
      { property: "og:description", content: "How the EAGLE EYE simulation platform is built and what it deliberately excludes." },
    ],
  }),
  component: AboutPage,
});

const STACK = [
  ["INTERFACE", "React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide"],
  ["SPATIAL ENGINE", "Custom SVG geospatial renderer with isometric digital-twin projection"],
  ["ANALYTICS", "Recharts time-series over simulated telemetry"],
  ["STATE", "Session-scoped simulation store driving map, logistics, analytics and reports"],
  ["DATA", "100% synthetic demonstration data — no live feeds, no real imagery"],
  ["EDITION", "Egypt edition — authored specifically for the ITC 2026 brief"],
];

function AboutPage() {
  return (
    <CommandLayout>
      <div className="space-y-5 p-4 md:p-6">
        <PageHeader
          eyebrow="ABOUT"
          title="THE TECHNOLOGY BEHIND EAGLE EYE"
          description="Designed exclusively for ITC 2026 — Egypt edition."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="MISSION" bodyClassName="p-5">
            <p className="text-sm leading-relaxed text-foreground/85">
              EAGLE EYE explores how a single environment can fuse infrastructure monitoring, a
              synchronised digital twin, satellite change detection and AI reasoning into one
              operating picture for civil protection and emergency response teams. Egyptian
              geography — Cairo, the New Administrative Capital, Alexandria, the Suez Canal
              corridor and Aswan — anchors the simulated zones.
            </p>
          </Panel>
          <Panel title="SCOPE & ETHICS" bodyClassName="p-5">
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-signal" />
              <p className="text-sm leading-relaxed text-foreground/85">
                Strictly defensive. No weapons, targeting, attack planning or offensive tactics
                are modelled. No official insignia, seals or affiliation with any armed force or
                government body is claimed or implied.
              </p>
            </div>
          </Panel>
        </div>
        <Panel title="TECHNICAL STACK" bodyClassName="p-5 space-y-3">
          {STACK.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1 border-b border-border/40 pb-3 last:border-0 sm:flex-row sm:gap-6">
              <TechLabel className="sm:w-44 sm:shrink-0">{k}</TechLabel>
              <span className="text-sm text-foreground/85">{v}</span>
            </div>
          ))}
        </Panel>
        <TechLabel className="text-gold/80">DESIGNED EXCLUSIVELY FOR ITC 2026 — EGYPT EDITION · STUDENT TECHNOLOGY PROTOTYPE</TechLabel>
      </div>
    </CommandLayout>
  );
}
