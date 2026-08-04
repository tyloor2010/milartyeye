import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Sparkles, ScanSearch, Loader2 } from "lucide-react";
import { CommandLayout } from "@/components/eagle/command-layout";
import { Panel, PageHeader, TechLabel, Counter, Meter } from "@/components/eagle/hud";
import { SAT_DETECTIONS, ZONES } from "@/lib/eagle-data";
import { cn } from "@/lib/utils";
import before from "@/assets/sat-before.jpg";
import after from "@/assets/sat-after.jpg";

export const Route = createFileRoute("/satellite")({
  head: () => ({
    meta: [
      { title: "Satellite Intelligence — EAGLE EYE" },
      {
        name: "description",
        content:
          "Simulated before/after satellite change detection with AI-classified regions, confidence scoring and generated analysis reports.",
      },
      { property: "og:title", content: "Satellite Intelligence — EAGLE EYE" },
      {
        property: "og:description",
        content: "Draggable comparison slider with glowing detection boxes over simulated imagery.",
      },
    ],
  }),
  component: SatellitePage,
});

function SatellitePage() {
  const [pos, setPos] = useState(52);
  const [zone, setZone] = useState(ZONES[0]!.id);
  const [showBoxes, setShowBoxes] = useState(true);
  const [analysing, setAnalysing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100)));
  };

  const runAnalysis = () => {
    setAnalysing(true);
    setReport(null);
    setTimeout(() => {
      const z = ZONES.find((x) => x.id === zone)!;
      setAnalysing(false);
      setReport(
        `AI change-detection pass completed over ${z.name} (${z.city}). Four significant differences were identified between the two simulated acquisitions. A new structure footprint of approximately 4,100 m² appears in the north-west quadrant, consistent with construction activity. A secondary access road extends 620 m eastward and shows fresh surface signature. Three stationary vehicles are detected near the new structure. Terrain disturbance in the southern quadrant is consistent with earthworks rather than natural erosion. No indicators requiring emergency escalation were found. Recommended action: schedule a follow-up acquisition in 72 simulated hours and update the digital twin geometry for the affected quadrant.`,
      );
    }, 1900);
  };

  return (
    <CommandLayout>
      <div className="space-y-5 p-4 md:p-6">
        <PageHeader
          eyebrow="MODULE 03 — REMOTE SENSING"
          title="SATELLITE INTELLIGENCE"
          description="All imagery and detections shown are SIMULATED / DEMONSTRATION DATA generated for the ITC 2026 prototype."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="label-tech rounded-sm border border-border/60 bg-surface/60 px-3 py-2.5 text-foreground"
              >
                {ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.id} — {z.city}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowBoxes((s) => !s)}
                className={cn(
                  "label-tech rounded-sm border px-3 py-2.5 transition-colors",
                  showBoxes ? "border-gold/50 bg-gold/10 text-gold" : "border-border text-muted-foreground",
                )}
              >
                DETECTIONS
              </button>
            </div>
          }
        />

        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <Panel title="BEFORE / AFTER COMPARISON" bodyClassName="p-0">
            <div
              ref={wrap}
              className="scanlines relative aspect-square w-full max-h-[62vh] select-none overflow-hidden"
              onMouseDown={(e) => {
                dragging.current = true;
                move(e.clientX);
              }}
              onMouseMove={(e) => dragging.current && move(e.clientX)}
              onMouseUp={() => (dragging.current = false)}
              onMouseLeave={() => (dragging.current = false)}
              onTouchMove={(e) => e.touches[0] && move(e.touches[0].clientX)}
            >
              <img
                src={after}
                alt="Simulated satellite acquisition after the observed change window"
                width={1024}
                height={1024}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
                <img
                  src={before}
                  alt="Simulated satellite acquisition before the observed change window"
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ width: wrap.current?.clientWidth ?? "100%", maxWidth: "none" }}
                />
                <span className="label-tech absolute left-3 top-3 rounded-sm border border-border/60 bg-background/80 px-2 py-1">
                  BEFORE — T-0
                </span>
              </div>
              <span className="label-tech absolute right-3 top-3 rounded-sm border border-border/60 bg-background/80 px-2 py-1">
                AFTER — T+72H
              </span>

              {showBoxes &&
                SAT_DETECTIONS.map((d) => (
                  <div
                    key={d.id}
                    className="absolute border border-gold/80"
                    style={{
                      left: `${d.x}%`,
                      top: `${d.y}%`,
                      width: `${d.w}%`,
                      height: `${d.h}%`,
                      boxShadow: "0 0 18px -2px color-mix(in oklab, var(--gold) 65%, transparent)",
                    }}
                  >
                    <span className="label-tech absolute -top-5 left-0 whitespace-nowrap bg-background/85 px-1 py-0.5 text-gold">
                      {d.label} {d.conf}%
                    </span>
                  </div>
                ))}

              <div
                className="absolute inset-y-0 w-px cursor-ew-resize bg-gold"
                style={{ left: `${pos}%` }}
              >
                <span className="absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-background text-gold">
                  ⇄
                </span>
              </div>
              <span className="label-tech absolute bottom-3 left-3 text-gold/90">
                SIMULATED IMAGERY — NOT REAL SATELLITE DATA
              </span>
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel title="CHANGE DETECTION" bodyClassName="p-4 space-y-4">
              <div className="corner-ticks border border-critical/30 bg-critical/5 px-3 py-3">
                <TechLabel className="text-critical">CHANGE DETECTED</TechLabel>
                <div className="mt-2 text-2xl font-semibold text-foreground">
                  <Counter value={94.2} decimals={1} suffix="%" />
                </div>
                <p className="label-tech mt-1">CONFIDENCE</p>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <TechLabel>DETECTED CHANGES</TechLabel>
                  <span className="font-mono text-sm text-gold">04</span>
                </div>
                <div className="mt-3 space-y-2.5">
                  {SAT_DETECTIONS.map((d) => (
                    <div key={d.id}>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-foreground/85">{d.label}</span>
                        <span className="text-gold">{d.conf}%</span>
                      </div>
                      <Meter value={d.conf} className="mt-1" />
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={runAnalysis}
                disabled={analysing}
                className="label-tech flex w-full items-center justify-center gap-2 rounded-sm bg-gold px-4 py-3 text-gold-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                {analysing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ScanSearch className="h-3.5 w-3.5" />}
                {analysing ? "ANALYSING…" : "GENERATE AI ANALYSIS"}
              </button>
            </Panel>

            <Panel title="ACQUISITION METADATA" bodyClassName="p-4 space-y-2">
              {[
                ["SOURCE", "SIMULATED ORBITAL FEED"],
                ["RESOLUTION", "0.5 m / px (synthetic)"],
                ["BANDS", "RGB + NIR (synthetic)"],
                ["ZONE", ZONES.find((z) => z.id === zone)?.city ?? "—"],
                ["PASS DELTA", "72 H"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 font-mono text-[11px]">
                  <span className="label-tech">{k}</span>
                  <span className="text-foreground/85">{v}</span>
                </div>
              ))}
            </Panel>
          </div>
        </div>

        {(analysing || report) && (
          <Panel
            title={
              <span className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-gold" /> AI ANALYSIS REPORT
              </span>
            }
            bodyClassName="p-5"
          >
            {analysing ? (
              <div className="space-y-3">
                {[90, 70, 82, 55].map((w, i) => (
                  <div key={i} className="h-3 animate-pulse rounded-sm bg-surface-2" style={{ width: `${w}%` }} />
                ))}
                <p className="label-tech mt-3 text-gold/80">RUNNING MULTI-PASS DIFFERENTIAL ANALYSIS…</p>
              </div>
            ) : (
              <>
                <p className="max-w-4xl text-sm leading-relaxed text-foreground/85">{report}</p>
                <p className="label-tech mt-4 text-gold/80">SIMULATION DATA — ITC DEMONSTRATION</p>
              </>
            )}
          </Panel>
        )}
      </div>
    </CommandLayout>
  );
}
