import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Layers, RotateCw, ZoomIn, ZoomOut, Crosshair } from "lucide-react";
import { CommandLayout } from "@/components/eagle/command-layout";
import { Meter, Panel, PageHeader, TechLabel } from "@/components/eagle/hud";
import { useSim, type LayerKey } from "@/lib/sim-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/twin")({
  head: () => ({
    meta: [
      { title: "Digital Twin — EAGLE EYE" },
      {
        name: "description",
        content:
          "Interactive 3D digital twin of a fictional Egyptian strategic infrastructure zone with layered telemetry for buildings, roads, sensors and emergency facilities.",
      },
      { property: "og:title", content: "Digital Twin — EAGLE EYE" },
      {
        property: "og:description",
        content: "Rotate, zoom and inspect a simulated infrastructure zone with per-object status, power and risk data.",
      },
    ],
  }),
  component: TwinPage,
});

type ObjKind = "infrastructure" | "sensors" | "emergency" | "logistics" | "incidents";

interface TwinObject {
  id: string;
  name: string;
  kind: ObjKind;
  gx: number;
  gy: number;
  h: number;
  w?: number;
  d?: number;
  status: string;
  power: number;
  network: string;
  risk: "Low" | "Moderate" | "Elevated";
}

const OBJECTS: TwinObject[] = [
  { id: "FACILITY 01", name: "Administrative Block", kind: "infrastructure", gx: 1, gy: 1, h: 62, w: 1.6, d: 1.2, status: "Operational", power: 98, network: "Connected", risk: "Low" },
  { id: "FACILITY 02", name: "Data & Control Tower", kind: "infrastructure", gx: 3.2, gy: 0.6, h: 108, w: 0.9, d: 0.9, status: "Operational", power: 99, network: "Connected", risk: "Low" },
  { id: "FACILITY 03", name: "Utility Substation", kind: "infrastructure", gx: 0.4, gy: 3.1, h: 34, w: 1.3, d: 1.3, status: "Operational", power: 94, network: "Connected", risk: "Moderate" },
  { id: "FACILITY 04", name: "Residential Cluster", kind: "infrastructure", gx: 2.2, gy: 2.6, h: 48, w: 1.4, d: 1.4, status: "Operational", power: 98, network: "Connected", risk: "Low" },
  { id: "FACILITY 05", name: "Water Treatment Unit", kind: "infrastructure", gx: 4.4, gy: 2.2, h: 40, w: 1.5, d: 1.1, status: "Degraded", power: 71, network: "Connected", risk: "Elevated" },
  { id: "BRIDGE 01", name: "North Access Bridge", kind: "infrastructure", gx: 1.6, gy: 4.4, h: 18, w: 3.2, d: 0.5, status: "Operational", power: 100, network: "Connected", risk: "Low" },
  { id: "MED 01", name: "Emergency Medical Facility", kind: "emergency", gx: 4.0, gy: 4.2, h: 52, w: 1.4, d: 1.2, status: "Ready", power: 100, network: "Connected", risk: "Low" },
  { id: "EMR 01", name: "Response Station ALPHA", kind: "emergency", gx: 0.6, gy: 5.0, h: 30, w: 1.2, d: 1.0, status: "Standby", power: 97, network: "Connected", risk: "Low" },
  { id: "LOG 01", name: "Logistics Warehouse", kind: "logistics", gx: 5.4, gy: 3.6, h: 28, w: 1.9, d: 1.5, status: "Operational", power: 92, network: "Connected", risk: "Low" },
  { id: "LOG 02", name: "Fuel Reserve Depot", kind: "logistics", gx: 5.6, gy: 1.2, h: 22, w: 1.2, d: 1.2, status: "Operational", power: 89, network: "Connected", risk: "Moderate" },
  { id: "SEN 01", name: "Seismic Node", kind: "sensors", gx: 2.9, gy: 4.9, h: 10, w: 0.35, d: 0.35, status: "Streaming", power: 88, network: "Mesh", risk: "Low" },
  { id: "SEN 02", name: "Structural Strain Node", kind: "sensors", gx: 3.9, gy: 1.4, h: 10, w: 0.35, d: 0.35, status: "Alert", power: 84, network: "Mesh", risk: "Elevated" },
  { id: "SEN 03", name: "Environmental Node", kind: "sensors", gx: 1.1, gy: 2.2, h: 10, w: 0.35, d: 0.35, status: "Streaming", power: 91, network: "Mesh", risk: "Low" },
  { id: "INC 01", name: "Utility Anomaly", kind: "incidents", gx: 4.4, gy: 2.2, h: 6, w: 0.6, d: 0.6, status: "Active", power: 0, network: "—", risk: "Elevated" },
];

const KIND_FILL: Record<ObjKind, { top: string; left: string; right: string }> = {
  infrastructure: { top: "var(--olive)", left: "var(--surface-2)", right: "var(--surface)" },
  emergency: { top: "var(--signal)", left: "var(--surface-2)", right: "var(--surface)" },
  logistics: { top: "var(--gold)", left: "var(--surface-2)", right: "var(--surface)" },
  sensors: { top: "var(--cyan)", left: "var(--surface-2)", right: "var(--surface)" },
  incidents: { top: "var(--critical)", left: "var(--critical)", right: "var(--critical)" },
};

const LAYER_LIST: { key: LayerKey; label: string }[] = [
  { key: "infrastructure", label: "INFRASTRUCTURE" },
  { key: "sensors", label: "SENSORS" },
  { key: "emergency", label: "EMERGENCY" },
  { key: "logistics", label: "LOGISTICS" },
  { key: "incidents", label: "INCIDENTS" },
  { key: "environment", label: "ENVIRONMENT" },
];

const TILE = 78;

function iso(gx: number, gy: number, rot: number) {
  const a = (rot * Math.PI) / 180;
  const rx = gx * Math.cos(a) - gy * Math.sin(a);
  const ry = gx * Math.sin(a) + gy * Math.cos(a);
  return { x: (rx - ry) * TILE * 0.86, y: (rx + ry) * TILE * 0.46 };
}

function TwinPage() {
  const { layers, toggleLayer } = useSim();
  const [rot, setRot] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 40 });
  const [sel, setSel] = useState<TwinObject | null>(OBJECTS[0] ?? null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const visible = useMemo(
    () =>
      OBJECTS.filter((o) => layers[o.kind]).sort((a, b) => a.gx + a.gy - (b.gx + b.gy)),
    [layers],
  );

  const grid = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = -1; i <= 7; i++) {
      const a = iso(i, -1, rot);
      const b = iso(i, 7, rot);
      const c = iso(-1, i, rot);
      const d = iso(7, i, rot);
      lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
      lines.push({ x1: c.x, y1: c.y, x2: d.x, y2: d.y });
    }
    return lines;
  }, [rot]);

  return (
    <CommandLayout>
      <div className="space-y-5 p-4 md:p-6">
        <PageHeader
          eyebrow="MODULE 02 — SPATIAL SIMULATION"
          title="DIGITAL TWIN"
          description="Fictional Egyptian strategic infrastructure zone. All geometry, telemetry and object states are simulated demonstration data."
        />

        <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
          <div className="panel corner-ticks scanlines relative h-[58vh] overflow-hidden xl:h-[68vh]">
            <div className="grid-bg absolute inset-0 opacity-40" />
            <svg
              viewBox="-560 -320 1120 700"
              className="relative h-full w-full cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => (drag.current = { x: e.clientX - pan.x, y: e.clientY - pan.y })}
              onMouseUp={() => (drag.current = null)}
              onMouseLeave={() => (drag.current = null)}
              onMouseMove={(e) => {
                if (!drag.current) return;
                setPan({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y });
              }}
            >
              <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
                <g opacity="0.5">
                  {grid.map((l, i) => (
                    <line
                      key={i}
                      x1={l.x1}
                      y1={l.y1}
                      x2={l.x2}
                      y2={l.y2}
                      stroke="var(--grid)"
                      strokeWidth="1"
                    />
                  ))}
                </g>

                {/* Roads */}
                {[1.9, 4.1].map((g, i) => {
                  const a = iso(-1, g, rot);
                  const b = iso(7, g, rot);
                  return (
                    <line
                      key={`r${i}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke="var(--gold)"
                      strokeOpacity="0.28"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                  );
                })}
                {[2.6].map((g, i) => {
                  const a = iso(g, -1, rot);
                  const b = iso(g, 7, rot);
                  return (
                    <line
                      key={`c${i}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke="var(--gold)"
                      strokeOpacity="0.2"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="18 12"
                      className="animate-dash"
                    />
                  );
                })}

                {layers.environment && (
                  <g opacity="0.55">
                    {Array.from({ length: 40 }).map((_, i) => {
                      const p = iso((i * 0.37) % 6, (i * 0.71) % 6, rot);
                      return <circle key={i} cx={p.x} cy={p.y - 40 - (i % 7) * 9} r="1.6" fill="var(--cyan)" opacity="0.6" />;
                    })}
                  </g>
                )}

                {visible.map((o) => {
                  const w = o.w ?? 1;
                  const d = o.d ?? 1;
                  const c0 = iso(o.gx, o.gy, rot);
                  const c1 = iso(o.gx + w, o.gy, rot);
                  const c2 = iso(o.gx + w, o.gy + d, rot);
                  const c3 = iso(o.gx, o.gy + d, rot);
                  const h = o.h * zoom * 0 + o.h;
                  const f = KIND_FILL[o.kind];
                  const active = sel?.id === o.id;
                  return (
                    <g
                      key={o.id}
                      className="cursor-pointer transition-opacity"
                      opacity={sel && !active ? 0.82 : 1}
                      onClick={() => setSel(o)}
                    >
                      {/* base shadow */}
                      <polygon
                        points={`${c0.x},${c0.y} ${c1.x},${c1.y} ${c2.x},${c2.y} ${c3.x},${c3.y}`}
                        fill="var(--background)"
                        opacity="0.55"
                      />
                      {/* left face */}
                      <polygon
                        points={`${c0.x},${c0.y} ${c3.x},${c3.y} ${c3.x},${c3.y - h} ${c0.x},${c0.y - h}`}
                        fill={f.left}
                        fillOpacity={o.kind === "incidents" ? 0.35 : 0.9}
                        stroke="var(--border)"
                      />
                      {/* right face */}
                      <polygon
                        points={`${c3.x},${c3.y} ${c2.x},${c2.y} ${c2.x},${c2.y - h} ${c3.x},${c3.y - h}`}
                        fill={f.right}
                        fillOpacity={o.kind === "incidents" ? 0.25 : 0.95}
                        stroke="var(--border)"
                      />
                      {/* top */}
                      <polygon
                        points={`${c0.x},${c0.y - h} ${c1.x},${c1.y - h} ${c2.x},${c2.y - h} ${c3.x},${c3.y - h}`}
                        fill={f.top}
                        fillOpacity={active ? 0.95 : 0.5}
                        stroke={active ? "var(--gold)" : "var(--border)"}
                        strokeWidth={active ? 1.6 : 1}
                      />
                      {o.kind === "incidents" && (
                        <circle cx={c0.x} cy={c0.y - h} r="10" fill="var(--critical)" opacity="0.5">
                          <animate attributeName="r" values="8;26;8" dur="2.4s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {o.kind === "sensors" && (
                        <circle cx={c0.x} cy={c0.y - h - 6} r="3" fill="var(--cyan)">
                          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {active && (
                        <text
                          x={c1.x + 8}
                          y={c1.y - h - 8}
                          fill="var(--gold)"
                          fontSize="12"
                          fontFamily="var(--font-mono)"
                        >
                          {o.id}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              <CtrlBtn onClick={() => setZoom((z) => Math.min(2, z + 0.15))} icon={ZoomIn} label="Zoom in" />
              <CtrlBtn onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))} icon={ZoomOut} label="Zoom out" />
              <CtrlBtn onClick={() => setRot((r) => (r + 15) % 360)} icon={RotateCw} label="Rotate" />
              <CtrlBtn
                onClick={() => {
                  setRot(0);
                  setZoom(1);
                  setPan({ x: 0, y: 40 });
                }}
                icon={Crosshair}
                label="Reset view"
              />
            </div>
            <div className="pointer-events-none absolute bottom-3 left-3">
              <TechLabel>DRAG TO PAN · ROTATION {rot}° · ZOOM {zoom.toFixed(2)}x</TechLabel>
            </div>
          </div>

          <div className="space-y-4">
            <Panel
              title={
                <span className="flex items-center gap-2">
                  <Layers className="h-3 w-3 text-gold" /> LAYER CONTROL
                </span>
              }
              bodyClassName="p-3 space-y-1"
            >
              {LAYER_LIST.map((l) => (
                <button
                  key={l.key}
                  onClick={() => toggleLayer(l.key)}
                  className="flex w-full items-center justify-between rounded-sm px-2 py-2 hover:bg-surface-2/60"
                >
                  <span className="label-tech text-foreground/85">{l.label}</span>
                  <span
                    className={cn(
                      "relative h-3 w-6 rounded-full border transition-colors",
                      layers[l.key] ? "border-gold bg-gold/25" : "border-border",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all",
                        layers[l.key] ? "left-3.5 bg-gold" : "left-0.5 bg-muted-foreground",
                      )}
                    />
                  </span>
                </button>
              ))}
            </Panel>

            {sel && (
              <Panel title="OBJECT INSPECTOR" bodyClassName="p-4 space-y-3">
                <div>
                  <TechLabel className="text-gold/80">{sel.id}</TechLabel>
                  <h4 className="mt-1.5 text-sm font-semibold">{sel.name}</h4>
                </div>
                <dl className="space-y-2 font-mono text-[11px]">
                  <Line k="STATUS" v={sel.status} />
                  <Line k="NETWORK" v={sel.network} />
                  <Line k="RISK" v={sel.risk} />
                </dl>
                <div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="label-tech">POWER</span>
                    <span className="text-gold">{sel.power}%</span>
                  </div>
                  <Meter value={sel.power} className="mt-1.5" tone={sel.power < 80 ? "critical" : "gold"} />
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Telemetry is synthesised for demonstration. The twin recalculates object state
                  whenever a simulation scenario is executed.
                </p>
              </Panel>
            )}

            <Panel title="TWIN SYNC" bodyClassName="p-4 space-y-2">
              <Line k="GEOMETRY OBJECTS" v={String(OBJECTS.length)} />
              <Line k="VISIBLE" v={String(visible.length)} />
              <Line k="SYNC STATE" v="SYNCHRONIZED" />
              <Line k="UPDATE RATE" v="4 Hz (simulated)" />
            </Panel>
          </div>
        </div>
      </div>
    </CommandLayout>
  );
}

function CtrlBtn({
  onClick,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  icon: typeof ZoomIn;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-sm border border-border/60 bg-background/70 text-muted-foreground backdrop-blur transition-colors hover:border-gold/50 hover:text-gold"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3 font-mono text-[11px]">
      <span className="label-tech">{k}</span>
      <span className="text-foreground/85">{v}</span>
    </div>
  );
}
