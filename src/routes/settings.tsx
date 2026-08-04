import { createFileRoute } from "@tanstack/react-router";
import { CommandLayout } from "@/components/eagle/command-layout";
import { Panel, PageHeader, TechLabel } from "@/components/eagle/hud";
import { useSim, type LayerKey } from "@/lib/sim-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — EAGLE EYE" },
      { name: "description", content: "Configure demonstration mode, default map layers and simulation preferences for the EAGLE EYE prototype." },
      { property: "og:title", content: "Settings — EAGLE EYE" },
      { property: "og:description", content: "Operator preferences for the simulated command environment." },
    ],
  }),
  component: SettingsPage,
});

const LAYERS: { key: LayerKey; label: string }[] = [
  { key: "infrastructure", label: "INFRASTRUCTURE" },
  { key: "sensors", label: "SENSORS" },
  { key: "emergency", label: "EMERGENCY" },
  { key: "logistics", label: "LOGISTICS" },
  { key: "incidents", label: "INCIDENTS" },
  { key: "environment", label: "ENVIRONMENT" },
];

function SettingsPage() {
  const { layers, toggleLayer, demoMode, setDemoMode } = useSim();

  return (
    <CommandLayout>
      <div className="space-y-5 p-4 md:p-6">
        <PageHeader eyebrow="SYSTEM" title="SETTINGS" description="Operator preferences for this demonstration session." />
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="DEMONSTRATION" bodyClassName="p-5 space-y-4">
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={cn(
                "label-tech w-full rounded-sm border px-4 py-3 transition-colors",
                demoMode ? "border-gold/60 bg-gold/10 text-gold" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              ITC DEMO MODE — {demoMode ? "ENABLED" : "DISABLED"}
            </button>
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Demo mode arms the cinematic presentation sequence: Egypt map, digital twin,
              simulated incident, AI detection, satellite change analysis, situation room,
              emergency simulation, logistics update and final report.
            </p>
          </Panel>
          <Panel title="DEFAULT MAP LAYERS" bodyClassName="p-4 space-y-1">
            {LAYERS.map((l) => (
              <button
                key={l.key}
                onClick={() => toggleLayer(l.key)}
                className="flex w-full items-center justify-between rounded-sm px-2 py-2.5 hover:bg-surface-2/60"
              >
                <span className="label-tech text-foreground/85">{l.label}</span>
                <span className={cn("h-2.5 w-5 rounded-full border", layers[l.key] ? "border-gold bg-gold/70" : "border-border")} />
              </button>
            ))}
          </Panel>
        </div>
        <TechLabel>DATA — SIMULATED · NO PERSISTENT STORAGE</TechLabel>
      </div>
    </CommandLayout>
  );
}
