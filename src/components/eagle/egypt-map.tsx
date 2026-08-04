import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  EGYPT_OUTLINE,
  NILE_PATH,
  SUEZ_PATH,
  NODES,
  ZONES,
  KIND_META,
  type MapNode,
  type Incident,
} from "@/lib/eagle-data";
import type { LayerKey } from "@/lib/sim-context";

const W = 1000;
const H = 760;
const LON0 = 23.9;
const LON1 = 37.7;
const LAT0 = 21.3;
const LAT1 = 32.1;

export function project(lon: number, lat: number): [number, number] {
  const x = ((lon - LON0) / (LON1 - LON0)) * W;
  const y = H - ((lat - LAT0) / (LAT1 - LAT0)) * H;
  return [x, y];
}

const toPath = (pts: [number, number][], close = false) =>
  pts
    .map((p, i) => {
      const [x, y] = project(p[0], p[1]);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ") + (close ? " Z" : "");

const kindLayer: Record<string, LayerKey> = {
  infrastructure: "infrastructure",
  sensor: "sensors",
  emergency: "emergency",
  medical: "emergency",
  logistics: "logistics",
  incident: "incidents",
};

const tokenColor: Record<string, string> = {
  gold: "var(--gold)",
  cyan: "var(--cyan)",
  signal: "var(--signal)",
  foreground: "var(--foreground)",
  olive: "var(--olive)",
  critical: "var(--critical)",
};

export type MapView = "2D" | "3D" | "SATELLITE" | "TERRAIN";

interface Props {
  layers: Record<LayerKey, boolean>;
  incidents: Incident[];
  selectedId?: string | null;
  onSelectNode?: (n: MapNode) => void;
  onSelectIncident?: (id: string) => void;
  view?: MapView;
  activeZone?: string | null;
  className?: string;
  compact?: boolean;
}

export function EgyptMap({
  layers,
  incidents,
  selectedId,
  onSelectNode,
  onSelectIncident,
  view = "2D",
  activeZone = null,
  className,
  compact = false,
}: Props) {
  const [hover, setHover] = useState<string | null>(null);

  const outline = useMemo(() => toPath(EGYPT_OUTLINE, true), []);
  const nile = useMemo(() => toPath(NILE_PATH), []);
  const suez = useMemo(() => toPath(SUEZ_PATH), []);

  const links = useMemo(() => {
    const hubs = NODES.filter((n) => n.kind === "infrastructure");
    const out: { a: MapNode; b: MapNode }[] = [];
    hubs.forEach((h, i) => {
      const next = hubs[(i + 1) % hubs.length];
      if (next) out.push({ a: h, b: next });
      const near = NODES.filter((n) => n.zone === h.zone && n.id !== h.id).slice(0, 3);
      near.forEach((n) => out.push({ a: h, b: n }));
    });
    return out;
  }, []);

  const visibleNodes = NODES.filter((n) => layers[kindLayer[n.kind] ?? "infrastructure"]);
  const visibleIncidents = layers.incidents ? incidents.filter((i) => i.status !== "RESOLVED") : [];

  return (
    <div className={cn("scanlines relative overflow-hidden bg-background", className)}>
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_60%_at_50%_45%,transparent,var(--background))]" />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={cn(
          "relative h-full w-full transition-transform duration-700 ease-out",
          view === "3D" && "[transform:perspective(1400px)_rotateX(38deg)_scale(0.92)]",
        )}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="landFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--olive)" stopOpacity={view === "SATELLITE" ? 0.3 : 0.16} />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity={view === "TERRAIN" ? 0.16 : 0.05} />
          </linearGradient>
          <radialGradient id="zoneGlow">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
          <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {view === "TERRAIN" &&
          Array.from({ length: 9 }).map((_, i) => (
            <path
              key={i}
              d={outline}
              fill="none"
              stroke="var(--olive)"
              strokeOpacity={0.12}
              strokeWidth={0.6}
              transform={`translate(${i * 2.2} ${i * 2.2}) scale(${1 - i * 0.006})`}
            />
          ))}

        <path d={outline} fill="url(#landFill)" stroke="var(--gold)" strokeOpacity="0.5" strokeWidth="1.2" />
        <path d={outline} fill="none" stroke="var(--gold)" strokeOpacity="0.18" strokeWidth="5" filter="url(#soft)" />

        <path d={nile} fill="none" stroke="var(--cyan)" strokeOpacity="0.45" strokeWidth="1.6" />
        <path d={suez} fill="none" stroke="var(--cyan)" strokeOpacity="0.7" strokeWidth="1.8" strokeDasharray="6 5">
          <animate attributeName="stroke-dashoffset" from="0" to="-44" dur="2.4s" repeatCount="indefinite" />
        </path>

        {/* Zones */}
        {ZONES.map((z) => {
          const [x, y] = project(z.lon, z.lat);
          const active = activeZone === z.id;
          return (
            <g key={z.id}>
              <circle cx={x} cy={y} r={active ? 60 : 42} fill="url(#zoneGlow)" opacity={active ? 1 : 0.5} />
              <circle
                cx={x}
                cy={y}
                r={active ? 34 : 26}
                fill="none"
                stroke="var(--gold)"
                strokeOpacity={active ? 0.7 : 0.28}
                strokeWidth="0.8"
                strokeDasharray="3 4"
              />
              {!compact && (
                <text
                  x={x + 38}
                  y={y - 30}
                  fill="var(--muted-foreground)"
                  fontSize="10"
                  letterSpacing="2"
                  fontFamily="var(--font-mono)"
                >
                  {z.id} · {z.city.toUpperCase()}
                </text>
              )}
            </g>
          );
        })}

        {/* Network links */}
        <g>
          {links.map((l, i) => {
            const [x1, y1] = project(l.a.lon, l.a.lat);
            const [x2, y2] = project(l.b.lon, l.b.lat);
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.14;
            return (
              <path
                key={i}
                d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
                fill="none"
                stroke="var(--gold)"
                strokeOpacity="0.22"
                strokeWidth="0.7"
                strokeDasharray="4 8"
                className="animate-dash"
              />
            );
          })}
        </g>

        {/* Nodes */}
        {visibleNodes.map((n) => {
          const [x, y] = project(n.lon, n.lat);
          const color = tokenColor[KIND_META[n.kind].token] ?? "var(--gold)";
          const isHover = hover === n.id;
          return (
            <g
              key={n.id}
              className="cursor-pointer"
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelectNode?.(n)}
            >
              <circle cx={x} cy={y} r={isHover ? 12 : 8} fill={color} opacity="0.14" />
              <circle cx={x} cy={y} r="3" fill={color} />
              <circle cx={x} cy={y} r="6.5" fill="none" stroke={color} strokeOpacity="0.55" strokeWidth="0.8" />
              {isHover && (
                <text x={x + 12} y={y - 8} fill="var(--foreground)" fontSize="11" fontFamily="var(--font-mono)">
                  {n.id} · {n.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Incidents */}
        {visibleIncidents.map((inc) => {
          const [x, y] = project(inc.lon, inc.lat);
          const sel = selectedId === inc.id;
          const color = inc.severity === "CRITICAL" ? "var(--critical)" : "var(--warn)";
          return (
            <g key={inc.id} className="cursor-pointer" onClick={() => onSelectIncident?.(inc.id)}>
              <circle cx={x} cy={y} r="14" fill={color} opacity="0.16">
                <animate attributeName="r" values="10;30;10" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.28;0;0.28" dur="2.8s" repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r={sel ? 7 : 4.5} fill={color} />
              <circle cx={x} cy={y} r="11" fill="none" stroke={color} strokeOpacity="0.8" strokeWidth={sel ? 1.4 : 0.8} />
              {sel && (
                <>
                  <line x1={x - 22} y1={y} x2={x - 13} y2={y} stroke={color} strokeWidth="1" />
                  <line x1={x + 13} y1={y} x2={x + 22} y2={y} stroke={color} strokeWidth="1" />
                  <text x={x + 16} y={y - 14} fill={color} fontSize="11" fontFamily="var(--font-mono)">
                    {inc.id}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {layers.environment && (
          <g opacity="0.5">
            {Array.from({ length: 26 }).map((_, i) => (
              <circle
                key={i}
                cx={(i * 137) % W}
                cy={(i * 211) % H}
                r={1.2}
                fill="var(--cyan)"
                opacity="0.5"
              >
                <animate
                  attributeName="opacity"
                  values="0.1;0.6;0.1"
                  dur={`${3 + (i % 5)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}
      </svg>

      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
        <span className="label-tech rounded-sm border border-critical/40 bg-critical/10 px-2 py-1 text-critical">
          ● LIVE SIMULATION
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3">
        <span className="label-tech">DATA — SIMULATED · GEO REF EPSG:4326</span>
      </div>
    </div>
  );
}
