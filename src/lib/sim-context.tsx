import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { INCIDENTS, SIM_TIMELINE, type Incident, type Severity } from "./eagle-data";

export type LayerKey =
  | "infrastructure"
  | "sensors"
  | "emergency"
  | "logistics"
  | "incidents"
  | "environment";

export interface SimResult {
  id: string;
  name: string;
  type: string;
  severity: Severity;
  zone: string;
  score: number;
  response: number;
  resource: number;
  recovery: number;
  finishedAt: string;
}

interface SimState {
  layers: Record<LayerKey, boolean>;
  toggleLayer: (k: LayerKey) => void;
  selectedIncident: string | null;
  selectIncident: (id: string | null) => void;
  incidents: Incident[];
  simRunning: boolean;
  simStep: number;
  simConfig: SimConfig;
  setSimConfig: (c: Partial<SimConfig>) => void;
  startSim: () => void;
  stopSim: () => void;
  lastResult: SimResult | null;
  results: SimResult[];
  demoMode: boolean;
  setDemoMode: (v: boolean) => void;
  systemStatus: "NOMINAL" | "ELEVATED" | "CRITICAL";
  logisticsDraw: number;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
}

export interface SimConfig {
  name: string;
  type: string;
  severity: Severity;
  zone: string;
  teams: number;
  resources: number;
  duration: number;
}

const Ctx = createContext<SimState | null>(null);

export function SimProvider({ children }: { children: ReactNode }) {
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    infrastructure: true,
    sensors: true,
    emergency: true,
    logistics: true,
    incidents: true,
    environment: false,
  });
  const [selectedIncident, selectIncident] = useState<string | null>(null);
  const [simRunning, setSimRunning] = useState(false);
  const [simStep, setSimStep] = useState(-1);
  const [results, setResults] = useState<SimResult[]>([]);
  const [lastResult, setLastResult] = useState<SimResult | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [logisticsDraw, setLogisticsDraw] = useState(0);
  const [simConfig, setConfig] = useState<SimConfig>({
    name: "Coastal Response Drill",
    type: "NATURAL DISASTER",
    severity: "HIGH",
    zone: "Z-C",
    teams: 8,
    resources: 72,
    duration: 3,
  });
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleLayer = useCallback((k: LayerKey) => {
    setLayers((p) => ({ ...p, [k]: !p[k] }));
  }, []);

  const setSimConfig = useCallback((c: Partial<SimConfig>) => {
    setConfig((p) => ({ ...p, ...c }));
  }, []);

  const stopSim = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setSimRunning(false);
    setSimStep(-1);
  }, []);

  const startSim = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    setSimRunning(true);
    setSimStep(0);
    setLogisticsDraw(0);
    let step = 0;
    timer.current = setInterval(() => {
      step += 1;
      if (step >= SIM_TIMELINE.length) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setSimRunning(false);
        setConfig((cfg) => {
          const sevWeight = { LOW: 4, MEDIUM: 2, HIGH: 0, CRITICAL: -3 }[cfg.severity];
          const response = Math.min(99, 86 + sevWeight + Math.round(cfg.teams / 2));
          const resource = Math.min(99, 82 + Math.round(cfg.resources / 12));
          const recovery = Math.min(99, 90 + sevWeight + 3);
          const result: SimResult = {
            id: `SIM-2026-${String(15 + Math.floor(Math.random() * 80)).padStart(3, "0")}`,
            name: cfg.name,
            type: cfg.type,
            severity: cfg.severity,
            zone: cfg.zone,
            response,
            resource,
            recovery,
            score: Math.round((response + resource + recovery) / 3),
            finishedAt: new Date().toISOString(),
          };
          setLastResult(result);
          setResults((r) => [result, ...r]);
          return cfg;
        });
        setSimStep(SIM_TIMELINE.length - 1);
        return;
      }
      setSimStep(step);
      setLogisticsDraw((d) => Math.min(38, d + 5 + Math.round(Math.random() * 4)));
    }, 1800);
  }, []);

  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing) return;
      if (e.key === "/" || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const systemStatus = simRunning ? "CRITICAL" : "ELEVATED";

  const value = useMemo<SimState>(
    () => ({
      layers,
      toggleLayer,
      selectedIncident,
      selectIncident,
      incidents: INCIDENTS,
      simRunning,
      simStep,
      simConfig,
      setSimConfig,
      startSim,
      stopSim,
      lastResult,
      results,
      demoMode,
      setDemoMode,
      systemStatus,
      logisticsDraw,
      paletteOpen,
      setPaletteOpen,
    }),
    [
      layers,
      toggleLayer,
      selectedIncident,
      simRunning,
      simStep,
      simConfig,
      setSimConfig,
      startSim,
      stopSim,
      lastResult,
      results,
      demoMode,
      systemStatus,
      logisticsDraw,
      paletteOpen,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSim() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSim must be used inside SimProvider");
  return v;
}
