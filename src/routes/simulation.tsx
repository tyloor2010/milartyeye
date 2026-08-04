import { createFileRoute } from "@tanstack/react-router";
import { Play, Square } from "lucide-react";
import { CommandLayout } from "@/components/eagle/command-layout";
import { Panel, PageHeader, TechLabel, Metric, Meter } from "@/components/eagle/hud";
import { useSim } from "@/lib/sim-context";
import { SIM_TIMELINE, ZONES, type Severity } from "@/lib/eagle-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/simulation")({
  head: () => ({
    meta: [
      { title: "Simulation Lab — EAGLE EYE" },
      {
        name: "description",
        content:
          "Configure and run cinematic emergency-response simulations: natural disaster, infrastructure failure, search and rescue and major accident scenarios.",
      },
      { property: "og:title", content: "Simulation Lab — EAGLE EYE" },
      { property: "og:description", content: "Scenario builder with animated response timeline and mission scoring." },
    ],
  }),
  component: SimulationPage,
});

const TYPES = [
  "NATURAL DISASTER",
  "INFRASTRUCTURE FAILURE",
  "SEARCH & RESCUE",
  "MAJOR ACCIDENT",
  "BORDER EMERGENCY SIMULATION",
];
const SEVERITIES: Severity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function SimulationPage() {
  const { simConfig, setSimConfig, startSim, stopSim, simRunning, simStep, lastResult } = useSim();

  return (
    <CommandLayout>
      <div className="space-y-5 p-4 md:p-6">
        <PageHeader
          eyebrow="MODULE 05 — SCENARIO ENGINE"
          title="SIMULATION LAB"
          description="Create and execute simulated emergency scenarios. No real-world operational effect."
          action={
            <button
              onClick={simRunning ? stopSim : startSim}
              className={cn(
                "label-tech flex items-center gap-2 rounded-sm px-5 py-3 transition-transform hover:-translate-y-0.5",
                simRunning ? "bg-critical text-destructive-foreground" : "bg-gold text-gold-foreground",
              )}
            >
              {simRunning ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {simRunning ? "ABORT SIMULATION" : "START SIMULATION"}
            </button>
          }
        />

        <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
          <Panel title="CREATE NEW SCENARIO" bodyClassName="p-4 space-y-4">
            <Field label="SCENARIO NAME">
              <input
                value={simConfig.name}
                onChange={(e) => setSimConfig({ name: e.target.value })}
                className="w-full rounded-sm border border-border/60 bg-background px-3 py-2.5 text-sm outline-none focus:border-gold/50"
              />
            </Field>
            <Field label="SCENARIO TYPE">
              <div className="grid gap-1">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSimConfig({ type: t })}
                    className={cn(
                      "label-tech rounded-sm border px-2.5 py-2 text-left transition-colors",
                      simConfig.type === t
                        ? "border-gold/50 bg-gold/10 text-gold"
                        : "border-border/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="SEVERITY">
              <div className="grid grid-cols-4 gap-1">
                {SEVERITIES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSimConfig({ severity: s })}
                    className={cn(
                      "label-tech rounded-sm border px-1 py-2 transition-colors",
                      simConfig.severity === s
                        ? "border-gold/50 bg-gold/10 text-gold"
                        : "border-border/60 text-muted-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="LOCATION">
              <select
                value={simConfig.zone}
                onChange={(e) => setSimConfig({ zone: e.target.value })}
                className="w-full rounded-sm border border-border/60 bg-background px-3 py-2.5 text-sm"
              >
                {ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.id} — {z.city}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={`RESPONSE TEAMS — ${simConfig.teams}`}>
              <input
                type="range"
                min={2}
                max={16}
                value={simConfig.teams}
                onChange={(e) => setSimConfig({ teams: Number(e.target.value) })}
                className="w-full accent-[var(--gold)]"
              />
            </Field>
            <Field label={`AVAILABLE RESOURCES — ${simConfig.resources}%`}>
              <input
                type="range"
                min={20}
                max={100}
                value={simConfig.resources}
                onChange={(e) => setSimConfig({ resources: Number(e.target.value) })}
                className="w-full accent-[var(--gold)]"
              />
            </Field>
            <Field label={`DURATION — ${simConfig.duration} H`}>
              <input
                type="range"
                min={1}
                max={6}
                value={simConfig.duration}
                onChange={(e) => setSimConfig({ duration: Number(e.target.value) })}
                className="w-full accent-[var(--gold)]"
              />
            </Field>
          </Panel>

          <div className="space-y-4">
            <Panel title="RESPONSE TIMELINE" bodyClassName="p-5">
              <ol className="relative space-y-5 border-l border-border/60 pl-6">
                {SIM_TIMELINE.map((s, i) => {
                  const done = simStep >= i;
                  const current = simStep === i && simRunning;
                  return (
                    <li key={s.t} className="relative">
                      <span
                        className={cn(
                          "absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border transition-colors",
                          done ? "border-gold bg-gold" : "border-border bg-background",
                          current && "animate-ping",
                        )}
                      />
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="font-mono text-xs text-gold">{s.t}</span>
                        <span
                          className={cn(
                            "label-tech",
                            done ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {s.label}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] text-muted-foreground">{s.detail}</p>
                    </li>
                  );
                })}
              </ol>
            </Panel>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="AFFECTED AREA" value={simRunning ? 38 : 12} suffix=" km²" />
              <Metric label="RESPONSE TIME" value={6.4} decimals={1} suffix=" min" tone="cyan" />
              <Metric label="RESOURCE USAGE" value={simRunning ? 47 : 12} suffix="%" tone="gold" />
              <Metric label="RECOVERY PROGRESS" value={simStep >= 6 ? 96 : simStep * 14} suffix="%" tone="signal" />
            </div>

            <Panel title="INFRASTRUCTURE IMPACT" bodyClassName="p-4 space-y-3">
              {[
                ["POWER NETWORK", simRunning ? 74 : 98],
                ["WATER DISTRIBUTION", simRunning ? 61 : 93],
                ["TRANSPORT CORRIDORS", simRunning ? 82 : 97],
                ["COMMUNICATIONS", simRunning ? 88 : 99],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="label-tech">{k}</span>
                    <span className="text-gold">{v}%</span>
                  </div>
                  <Meter value={v as number} className="mt-1.5" tone={(v as number) < 70 ? "critical" : "gold"} />
                </div>
              ))}
            </Panel>

            {lastResult && !simRunning && (
              <Panel title="SIMULATION COMPLETE" bodyClassName="p-5">
                <div className="flex flex-wrap items-end gap-8">
                  <div>
                    <TechLabel className="text-gold/80">MISSION SCORE</TechLabel>
                    <div className="font-display text-5xl font-bold text-gold">
                      {lastResult.score}
                      <span className="text-xl text-muted-foreground">/100</span>
                    </div>
                  </div>
                  <div className="grid flex-1 gap-3 sm:grid-cols-3">
                    <Metric label="RESPONSE EFFICIENCY" value={lastResult.response} suffix="%" tone="signal" />
                    <Metric label="RESOURCE EFFICIENCY" value={lastResult.resource} suffix="%" tone="cyan" />
                    <Metric label="RECOVERY" value={lastResult.recovery} suffix="%" tone="gold" />
                  </div>
                </div>
                <p className="label-tech mt-5">SIMULATION DATA — ITC DEMONSTRATION</p>
              </Panel>
            )}
          </div>
        </div>
      </div>
    </CommandLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <TechLabel>{label}</TechLabel>
      <div className="mt-2">{children}</div>
    </div>
  );
}
