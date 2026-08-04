import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Layers, Play, Sparkles, ArrowUpRight } from "lucide-react";
import { CommandLayout } from "@/components/eagle/command-layout";
import { EgyptMap, type MapView } from "@/components/eagle/egypt-map";
import { Counter, Meter, Panel, SeverityTag, StatusDot, TechLabel } from "@/components/eagle/hud";
import { useSim, type LayerKey } from "@/lib/sim-context";
import { KIND_META, ZONES, type MapNode } from "@/lib/eagle-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/command")({
  head: () => ({
    meta: [
      { title: "Command Center — EAGLE EYE" },
      {
        name: "description",
        content:
          "Live tactical picture of simulated Egyptian monitoring zones: infrastructure, sensors, response teams, logistics and active incidents.",
      },
      { property: "og:title", content: "Command Center — EAGLE EYE" },
      {
        property: "og:description",
        content: "Interactive Egypt-focused command map with AI situation summary and live simulated telemetry.",
      },
    ],
  }),
  component: CommandCenter,
});

const LAYER_LIST: { key: LayerKey; label: string }[] = [
  { key: "infrastructure", label: "INFRASTRUCTURE" },
  { key: "sensors", label: "SENSORS" },
  { key: "emergency", label: "EMERGENCY" },
  { key: "logistics", label: "LOGISTICS" },
  { key: "incidents", label: "INCIDENTS" },
  { key: "environment", label: "ENVIRONMENT" },
];

const VIEWS: MapView[] = ["2D", "3D", "SATELLITE", "TERRAIN"];

function CommandCenter() {
  const { layers, toggleLayer, incidents, selectedIncident, selectIncident, simRunning, startSim, demoMode, setDemoMode } =
    useSim();
  const [view, setView] = useState<MapView>("2D");
  const [node, setNode] = useState<MapNode | null>(null);

  const active = incidents.filter((i) => i.status === "ACTIVE");
  const zones = useMemo(() => new Set(active.map((i) => i.zone)).size, [active]);
  const selected = incidents.find((i) => i.id === selectedIncident) ?? null;
  const activeZone = selected?.zone ?? null;

  return (
    <CommandLayout>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px]">
        {/* MAP */}
        <div className="relative border-b border-border/60 xl:border-b-0 xl:border-r">
          <div className="absolute left-3 top-14 z-20 flex flex-col gap-2 md:top-3 md:left-auto md:right-3">
            <div className="panel flex overflow-hidden">
              {VIEWS.map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "label-tech px-3 py-2 transition-colors",
                    view === v ? "bg-gold/15 text-gold" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute bottom-3 left-3 z-20">
            <div className="panel w-48 p-3">
              <div className="mb-2 flex items-center gap-2">
                <Layers className="h-3 w-3 text-gold" />
                <TechLabel>MAP LAYERS</TechLabel>
              </div>
              <div className="space-y-1">
                {LAYER_LIST.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => toggleLayer(l.key)}
                    className="flex w-full items-center justify-between rounded-xs px-1 py-1 hover:bg-surface-2/60"
                  >
                    <span className="label-tech text-foreground/80">{l.label}</span>
                    <span
                      className={cn(
                        "h-2.5 w-4 rounded-full border transition-colors",
                        layers[l.key] ? "border-gold bg-gold/70" : "border-border bg-transparent",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <EgyptMap
            layers={layers}
            incidents={incidents}
            selectedId={selectedIncident}
            activeZone={activeZone}
            view={view}
            onSelectNode={setNode}
            onSelectIncident={(id) => selectIncident(id === selectedIncident ? null : id)}
            className="h-[62vh] w-full xl:h-[calc(100vh-3.5rem)]"
          />

          {node && (
            <div className="panel corner-ticks absolute bottom-3 right-3 z-20 w-64 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <TechLabel className="text-gold/80">{KIND_META[node.kind].label}</TechLabel>
                  <h4 className="mt-1.5 text-sm font-semibold">{node.name}</h4>
                </div>
                <button className="label-tech text-muted-foreground" onClick={() => setNode(null)}>
                  ✕
                </button>
              </div>
              <dl className="mt-3 space-y-1.5 font-mono text-[11px]">
                <Row k="ID" v={node.id} />
                <Row k="ZONE" v={node.zone} />
                <Row k="STATUS" v={node.status} />
                <Row k="COORD" v={`${node.lat.toFixed(2)}N ${node.lon.toFixed(2)}E`} />
              </dl>
              {node.detail && <p className="mt-3 text-[11px] text-muted-foreground">{node.detail}</p>}
            </div>
          )}
        </div>

        {/* RIGHT RAIL */}
        <aside className="flex flex-col gap-4 overflow-y-auto p-4 xl:h-[calc(100vh-3.5rem)]">
          <Panel title="AI SITUATION SUMMARY" bodyClassName="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <TechLabel>STATUS</TechLabel>
              <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-warn">
                <StatusDot tone="critical" />
                {simRunning ? "CRITICAL" : "ELEVATED"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border/40">
              <Cell k="ACTIVE INCIDENTS" v={active.length} pad />
              <Cell k="AFFECTED ZONES" v={zones} pad />
              <Cell k="RESPONSE TEAMS" v={8} pad />
              <Cell k="RESOURCE READINESS" v={94} suffix="%" pad />
            </div>
            <div className="corner-ticks border border-gold/25 bg-gold/5 p-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-gold" />
                <TechLabel className="text-gold/90">AI ASSESSMENT</TechLabel>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-foreground/85">
                {active.length} simulated incidents are active across {zones} monitored zones. The
                critical event in Greater Cairo drives current risk. Response Team BRAVO is on
                site; medical capacity is sufficient. Recommend maintaining elevated monitoring on
                the Suez corridor strain sensors and pre-positioning water supply reserves for
                Zone C.
              </p>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                CONFIDENCE 94.2% · SIMULATED ANALYSIS
              </p>
            </div>
            <Link
              to="/situation"
              className="label-tech flex items-center justify-between border border-border/60 px-3 py-2.5 text-foreground/80 transition-colors hover:border-gold/40 hover:text-gold"
            >
              OPEN AI SITUATION ROOM <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Panel>

          <Panel title="ACTIVE INCIDENTS" bodyClassName="p-2 space-y-1">
            {active.map((i) => (
              <button
                key={i.id}
                onClick={() => selectIncident(i.id === selectedIncident ? null : i.id)}
                className={cn(
                  "w-full rounded-sm border px-3 py-2.5 text-left transition-colors",
                  selectedIncident === i.id
                    ? "border-gold/50 bg-gold/10"
                    : "border-transparent hover:border-border hover:bg-surface-2/50",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-foreground">{i.id}</span>
                  <SeverityTag level={i.severity} />
                </div>
                <p className="mt-1.5 text-[12px] text-foreground/85">{i.title}</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">{i.location}</p>
              </button>
            ))}
          </Panel>

          <Panel title="ZONE READINESS" bodyClassName="p-4 space-y-3">
            {ZONES.map((z, idx) => {
              const v = [92, 78, 66, 88, 95][idx] ?? 80;
              return (
                <div key={z.id}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-foreground/80">{z.city}</span>
                    <span className="font-mono text-[11px] text-gold">{v}%</span>
                  </div>
                  <Meter value={v} className="mt-1.5" tone={v < 70 ? "critical" : "gold"} />
                </div>
              );
            })}
          </Panel>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                startSim();
                toast.success("Simulation sequence initiated", { description: "Cinematic timeline running." });
              }}
              className="label-tech flex items-center justify-center gap-2 rounded-sm bg-gold px-3 py-3 text-gold-foreground transition-transform hover:-translate-y-0.5"
            >
              <Play className="h-3 w-3" /> RUN SIM
            </button>
            <button
              onClick={() => {
                setDemoMode(!demoMode);
                toast(demoMode ? "ITC demo mode disabled" : "ITC DEMO MODE ARMED", {
                  description: demoMode ? undefined : "Cinematic demonstration sequence is ready.",
                });
              }}
              className={cn(
                "label-tech rounded-sm border px-3 py-3 transition-colors",
                demoMode ? "border-gold/60 bg-gold/10 text-gold" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              ITC DEMO MODE
            </button>
          </div>
        </aside>
      </div>
    </CommandLayout>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="label-tech">{k}</dt>
      <dd className="text-foreground/85">{v}</dd>
    </div>
  );
}

function Cell({ k, v, suffix, pad }: { k: string; v: number; suffix?: string; pad?: boolean }) {
  return (
    <div className="bg-background px-3 py-3">
      <TechLabel>{k}</TechLabel>
      <div className="mt-1.5 text-xl font-semibold text-foreground">
        <Counter value={v} suffix={suffix ?? ""} />
        {pad && !suffix && v < 10 ? "" : ""}
      </div>
    </div>
  );
}
