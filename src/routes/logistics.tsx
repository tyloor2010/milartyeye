import { createFileRoute } from "@tanstack/react-router";
import { CommandLayout } from "@/components/eagle/command-layout";
import { Panel, PageHeader, TechLabel, Meter, Counter } from "@/components/eagle/hud";
import { RESOURCES } from "@/lib/eagle-data";
import { useSim } from "@/lib/sim-context";
import { ArrowDown, Sparkles } from "lucide-react";

export const Route = createFileRoute("/logistics")({
  head: () => ({
    meta: [
      { title: "Logistics Command — EAGLE EYE" },
      {
        name: "description",
        content:
          "Humanitarian and emergency logistics monitoring: fuel, medical supplies, food, vehicles, equipment and warehouse capacity with AI optimisation.",
      },
      { property: "og:title", content: "Logistics Command — EAGLE EYE" },
      { property: "og:description", content: "Simulated resource readiness and AI distribution optimisation." },
    ],
  }),
  component: LogisticsPage,
});

function LogisticsPage() {
  const { logisticsDraw } = useSim();

  return (
    <CommandLayout>
      <div className="space-y-5 p-4 md:p-6">
        <PageHeader
          eyebrow="MODULE 06 — SUSTAINMENT"
          title="LOGISTICS COMMAND"
          description="Humanitarian and emergency support resources only. All stock levels are simulated."
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => {
            const v = Math.max(8, r.value - Math.round(logisticsDraw / 3));
            return (
              <Panel key={r.id} title={r.label} bodyClassName="p-4">
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-semibold text-foreground">
                    <Counter value={v} suffix="%" />
                  </span>
                  <span className="label-tech text-signal">{r.status}</span>
                </div>
                <Meter value={v} className="mt-3" tone={v < 60 ? "critical" : "gold"} />
                <p className="label-tech mt-3">
                  TREND {r.trend > 0 ? "+" : ""}
                  {r.trend}% · 24H SIMULATED
                </p>
              </Panel>
            );
          })}
        </div>

        <Panel
          title={
            <span className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-gold" /> AI FORECAST
            </span>
          }
          bodyClassName="p-5"
        >
          <p className="max-w-3xl text-sm leading-relaxed text-foreground/85">
            Supply demand is expected to increase in the selected simulation zone. Water and food
            reserves are projected to fall below the 60% readiness threshold within the next
            simulated cycle if the Zone C infrastructure anomaly remains unresolved. Medical
            supplies remain sufficient for the modelled casualty profile.
          </p>
          <p className="label-tech mt-4 text-gold/80">CONFIDENCE 91.6% · SIMULATED FORECAST</p>
        </Panel>

        <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr]">
          <Panel title="CURRENT DISTRIBUTION" bodyClassName="p-4 space-y-3">
            {[
              ["ZONE A", 34],
              ["ZONE B", 26],
              ["ZONE C", 14],
              ["ZONE D", 18],
              ["ZONE E", 8],
            ].map(([k, v]) => (
              <Row key={k as string} k={k as string} v={v as number} />
            ))}
          </Panel>
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 px-4 py-6">
              <ArrowDown className="h-5 w-5 rotate-0 text-gold lg:-rotate-90" />
              <TechLabel className="text-gold/80">AI OPTIMIZATION</TechLabel>
            </div>
          </div>
          <Panel title="OPTIMIZED DISTRIBUTION" bodyClassName="p-4 space-y-3">
            {[
              ["ZONE A", 24],
              ["ZONE B", 28],
              ["ZONE C", 30],
              ["ZONE D", 12],
              ["ZONE E", 6],
            ].map(([k, v]) => (
              <Row key={k as string} k={k as string} v={v as number} tone="signal" />
            ))}
          </Panel>
        </div>
      </div>
    </CommandLayout>
  );
}

function Row({ k, v, tone = "gold" }: { k: string; v: number; tone?: "gold" | "signal" }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[11px]">
        <span className="label-tech">{k}</span>
        <span className={tone === "signal" ? "text-signal" : "text-gold"}>{v}%</span>
      </div>
      <Meter value={v * 2.2} className="mt-1.5" tone={tone} />
    </div>
  );
}
