// EAGLE EYE — simulated dataset. All values are fictional demonstration data.

export type MarkerKind =
  | "infrastructure"
  | "sensor"
  | "emergency"
  | "medical"
  | "logistics"
  | "incident";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface MapNode {
  id: string;
  name: string;
  kind: MarkerKind;
  lon: number;
  lat: number;
  zone: string;
  status: string;
  detail?: string;
}

export interface Incident {
  id: string;
  title: string;
  type: "Infrastructure" | "Natural" | "Medical" | "Logistics" | "Communications";
  severity: Severity;
  location: string;
  zone: string;
  detected: string;
  status: "ACTIVE" | "MONITORING" | "RESOLVED";
  lon: number;
  lat: number;
  summary: string;
  timeline: { t: string; label: string }[];
}

/* Egypt outline in lon/lat — simplified silhouette for the tactical map. */
export const EGYPT_OUTLINE: [number, number][] = [
  [24.7, 31.4],
  [25.15, 31.65],
  [26.5, 31.5],
  [27.8, 31.15],
  [28.9, 30.85],
  [29.7, 31.0],
  [30.4, 31.5],
  [31.1, 31.6],
  [31.6, 31.45],
  [32.3, 31.25],
  [33.2, 31.2],
  [34.25, 31.22],
  [34.9, 29.5],
  [34.4, 27.9],
  [33.6, 27.7],
  [33.95, 26.6],
  [34.7, 25.6],
  [35.7, 23.9],
  [35.65, 22.0],
  [36.9, 22.0],
  [36.9, 21.75],
  [24.7, 21.75],
];

export const NILE_PATH: [number, number][] = [
  [31.2, 31.4],
  [31.25, 30.6],
  [31.1, 29.6],
  [31.0, 28.5],
  [30.9, 27.4],
  [32.0, 26.2],
  [32.7, 25.4],
  [32.9, 24.4],
  [32.9, 23.2],
  [32.5, 22.2],
];

export const SUEZ_PATH: [number, number][] = [
  [32.35, 31.25],
  [32.32, 30.6],
  [32.55, 30.0],
  [32.55, 29.4],
];

export const ZONES = [
  { id: "Z-A", name: "SIMULATION ZONE A", city: "New Administrative Capital", lon: 31.75, lat: 30.0 },
  { id: "Z-B", name: "SIMULATION ZONE B", city: "Greater Cairo", lon: 31.24, lat: 30.05 },
  { id: "Z-C", name: "SIMULATION ZONE C", city: "Alexandria Coastal", lon: 29.92, lat: 31.2 },
  { id: "Z-D", name: "SIMULATION ZONE D", city: "Suez Canal Corridor", lon: 32.4, lat: 30.4 },
  { id: "Z-E", name: "SIMULATION ZONE E", city: "Aswan High Dam Sector", lon: 32.88, lat: 24.09 },
];

export const NODES: MapNode[] = [
  { id: "INF-01", name: "Capital Power Grid Node", kind: "infrastructure", lon: 31.79, lat: 30.02, zone: "Z-A", status: "Operational", detail: "Load 71% · Redundancy nominal" },
  { id: "INF-02", name: "Ring Road Interchange", kind: "infrastructure", lon: 31.4, lat: 30.09, zone: "Z-B", status: "Operational", detail: "Traffic flow stable" },
  { id: "INF-03", name: "Alexandria Water Plant", kind: "infrastructure", lon: 29.88, lat: 31.18, zone: "Z-C", status: "Degraded", detail: "Pump line 3 offline (simulated)" },
  { id: "INF-04", name: "Canal Bridge Structure", kind: "infrastructure", lon: 32.36, lat: 30.58, zone: "Z-D", status: "Operational", detail: "Structural sensors nominal" },
  { id: "INF-05", name: "Aswan Transmission Hub", kind: "infrastructure", lon: 32.87, lat: 24.02, zone: "Z-E", status: "Operational", detail: "Output 96%" },
  { id: "SEN-01", name: "Seismic Array 01", kind: "sensor", lon: 31.68, lat: 29.92, zone: "Z-A", status: "Streaming", detail: "12 channels · 4ms latency" },
  { id: "SEN-02", name: "Air Quality Mesh", kind: "sensor", lon: 31.31, lat: 30.12, zone: "Z-B", status: "Streaming", detail: "AQI 84 · rising" },
  { id: "SEN-03", name: "Coastal Tide Sensor", kind: "sensor", lon: 30.02, lat: 31.26, zone: "Z-C", status: "Streaming", detail: "Tide +0.4m" },
  { id: "SEN-04", name: "Structural Strain Node", kind: "sensor", lon: 32.42, lat: 30.31, zone: "Z-D", status: "Alert", detail: "Vibration above baseline" },
  { id: "SEN-05", name: "Thermal Grid Sensor", kind: "sensor", lon: 32.8, lat: 24.15, zone: "Z-E", status: "Streaming", detail: "Nominal" },
  { id: "EMR-01", name: "Response Team ALPHA", kind: "emergency", lon: 31.72, lat: 30.06, zone: "Z-A", status: "Standby", detail: "8 personnel · ETA 6 min" },
  { id: "EMR-02", name: "Response Team BRAVO", kind: "emergency", lon: 31.19, lat: 30.02, zone: "Z-B", status: "Deployed", detail: "12 personnel · on site" },
  { id: "EMR-03", name: "Coastal Rescue Unit", kind: "emergency", lon: 29.96, lat: 31.22, zone: "Z-C", status: "Standby", detail: "6 personnel" },
  { id: "EMR-04", name: "Canal Response Team", kind: "emergency", lon: 32.31, lat: 30.45, zone: "Z-D", status: "Standby", detail: "10 personnel" },
  { id: "MED-01", name: "Capital Medical Center", kind: "medical", lon: 31.83, lat: 29.96, zone: "Z-A", status: "Ready", detail: "Capacity 78% · Trauma ready" },
  { id: "MED-02", name: "Cairo Field Clinic", kind: "medical", lon: 31.27, lat: 30.09, zone: "Z-B", status: "Ready", detail: "Capacity 64%" },
  { id: "MED-03", name: "Alexandria Hospital", kind: "medical", lon: 29.9, lat: 31.23, zone: "Z-C", status: "Ready", detail: "Capacity 81%" },
  { id: "LOG-01", name: "Central Logistics Hub", kind: "logistics", lon: 31.62, lat: 30.15, zone: "Z-A", status: "Operational", detail: "Warehouse 74% utilised" },
  { id: "LOG-02", name: "Port Supply Depot", kind: "logistics", lon: 29.86, lat: 31.19, zone: "Z-C", status: "Operational", detail: "Medical stock 87%" },
  { id: "LOG-03", name: "Canal Fuel Reserve", kind: "logistics", lon: 32.5, lat: 30.02, zone: "Z-D", status: "Operational", detail: "Fuel 62%" },
];

export const INCIDENTS: Incident[] = [
  {
    id: "EYE-024",
    title: "Water Distribution Anomaly",
    type: "Infrastructure",
    severity: "HIGH",
    location: "Alexandria Coastal — Zone C",
    zone: "Z-C",
    detected: "02:14:32",
    status: "ACTIVE",
    lon: 29.88,
    lat: 31.18,
    summary:
      "Simulated pressure loss detected across three distribution lines. AI correlates the drop with a pump failure signature. Recommend isolation of line 3 and mobilisation of the coastal maintenance unit.",
    timeline: [
      { t: "02:14:32", label: "Sensor anomaly detected" },
      { t: "02:15:10", label: "AI correlation completed" },
      { t: "02:17:44", label: "Incident escalated to HIGH" },
      { t: "02:21:02", label: "Maintenance unit notified" },
    ],
  },
  {
    id: "EYE-025",
    title: "Structural Vibration Alert",
    type: "Infrastructure",
    severity: "MEDIUM",
    location: "Suez Canal Corridor — Zone D",
    zone: "Z-D",
    detected: "02:41:07",
    status: "ACTIVE",
    lon: 32.42,
    lat: 30.31,
    summary:
      "Strain sensors report vibration above the simulated baseline on the canal bridge structure. No structural risk indicated. Continuous monitoring recommended.",
    timeline: [
      { t: "02:41:07", label: "Strain threshold exceeded" },
      { t: "02:42:33", label: "AI assessment: low structural risk" },
      { t: "02:45:00", label: "Monitoring interval increased" },
    ],
  },
  {
    id: "EYE-026",
    title: "Urban Emergency Event",
    type: "Medical",
    severity: "CRITICAL",
    location: "Greater Cairo — Zone B",
    zone: "Z-B",
    detected: "03:02:55",
    status: "ACTIVE",
    lon: 31.24,
    lat: 30.05,
    summary:
      "Simulated multi-casualty emergency event. Response Team BRAVO deployed. Nearest medical facility reports capacity availability. Traffic corridor rerouting advised for ambulance transit.",
    timeline: [
      { t: "03:02:55", label: "Emergency event registered" },
      { t: "03:03:40", label: "AI triage estimate generated" },
      { t: "03:05:12", label: "Team BRAVO dispatched" },
      { t: "03:09:31", label: "Medical corridor reserved" },
    ],
  },
  {
    id: "EYE-021",
    title: "Comms Relay Degradation",
    type: "Communications",
    severity: "LOW",
    location: "Aswan High Dam Sector — Zone E",
    zone: "Z-E",
    detected: "01:12:08",
    status: "MONITORING",
    lon: 32.87,
    lat: 24.02,
    summary: "Intermittent packet loss on the simulated relay backbone. Failover path active.",
    timeline: [
      { t: "01:12:08", label: "Packet loss detected" },
      { t: "01:14:00", label: "Failover engaged" },
    ],
  },
  {
    id: "EYE-019",
    title: "Grid Load Spike",
    type: "Infrastructure",
    severity: "MEDIUM",
    location: "New Administrative Capital — Zone A",
    zone: "Z-A",
    detected: "00:48:19",
    status: "RESOLVED",
    lon: 31.79,
    lat: 30.02,
    summary: "Load balancing restored automatically after simulated demand surge.",
    timeline: [
      { t: "00:48:19", label: "Load spike detected" },
      { t: "00:52:40", label: "Auto balancing engaged" },
      { t: "00:59:03", label: "Incident closed" },
    ],
  },
];

export const RESOURCES = [
  { id: "fuel", label: "FUEL RESERVES", value: 72, unit: "%", status: "READY", trend: -4, icon: "fuel" },
  { id: "medical", label: "MEDICAL SUPPLIES", value: 87, unit: "%", status: "READY", trend: +2, icon: "medical" },
  { id: "food", label: "FOOD & WATER", value: 68, unit: "%", status: "MONITOR", trend: -6, icon: "food" },
  { id: "vehicles", label: "VEHICLE FLEET", value: 91, unit: "%", status: "READY", trend: +1, icon: "vehicle" },
  { id: "equipment", label: "EMERGENCY EQUIPMENT", value: 79, unit: "%", status: "READY", trend: 0, icon: "equipment" },
  { id: "warehouse", label: "WAREHOUSE CAPACITY", value: 54, unit: "%", status: "AVAILABLE", trend: +8, icon: "warehouse" },
];

export const KIND_META: Record<MarkerKind, { label: string; token: string }> = {
  infrastructure: { label: "INFRASTRUCTURE", token: "gold" },
  sensor: { label: "SENSOR", token: "cyan" },
  emergency: { label: "EMERGENCY TEAM", token: "signal" },
  medical: { label: "MEDICAL FACILITY", token: "foreground" },
  logistics: { label: "LOGISTICS HUB", token: "olive" },
  incident: { label: "INCIDENT", token: "critical" },
};

export const SIM_TIMELINE = [
  { t: "00:00", label: "NORMAL STATUS", detail: "All monitored systems nominal." },
  { t: "00:15", label: "INCIDENT DETECTED", detail: "Sensor mesh reports anomaly signature." },
  { t: "00:30", label: "AI ANALYSIS", detail: "Correlation engine classifies event and scope." },
  { t: "01:00", label: "EMERGENCY ALERT", detail: "Zone alert raised, stakeholders notified." },
  { t: "01:30", label: "RESPONSE TEAMS DISPATCHED", detail: "Nearest units routed via optimal corridor." },
  { t: "02:00", label: "INFRASTRUCTURE IMPACT UPDATED", detail: "Digital twin recalculates structural state." },
  { t: "03:00", label: "SITUATION STABILIZED", detail: "Recovery sequence complete." },
];

export const ANALYTICS_SERIES = [
  { t: "00:00", response: 9.2, efficiency: 82, health: 96, incidents: 1, accuracy: 91 },
  { t: "00:30", response: 8.4, efficiency: 84, health: 95, incidents: 2, accuracy: 92 },
  { t: "01:00", response: 7.9, efficiency: 87, health: 93, incidents: 3, accuracy: 93 },
  { t: "01:30", response: 6.8, efficiency: 89, health: 91, incidents: 4, accuracy: 94 },
  { t: "02:00", response: 6.1, efficiency: 90, health: 89, incidents: 3, accuracy: 95 },
  { t: "02:30", response: 5.4, efficiency: 92, health: 92, incidents: 2, accuracy: 96 },
  { t: "03:00", response: 4.9, efficiency: 94, health: 95, incidents: 1, accuracy: 96 },
];

export const SIM_HISTORY = [
  { id: "SIM-2026-014", name: "Coastal Flood Response", type: "NATURAL DISASTER", zone: "Z-C", severity: "HIGH" as Severity, score: 91, date: "2026-03-14", duration: "03:00" },
  { id: "SIM-2026-013", name: "Grid Failure Cascade", type: "INFRASTRUCTURE FAILURE", zone: "Z-A", severity: "CRITICAL" as Severity, score: 87, date: "2026-03-11", duration: "04:00" },
  { id: "SIM-2026-012", name: "Urban Search & Rescue", type: "SEARCH & RESCUE", zone: "Z-B", severity: "HIGH" as Severity, score: 94, date: "2026-03-07", duration: "02:30" },
  { id: "SIM-2026-011", name: "Canal Transit Accident", type: "MAJOR ACCIDENT", zone: "Z-D", severity: "MEDIUM" as Severity, score: 89, date: "2026-03-02", duration: "02:00" },
  { id: "SIM-2026-010", name: "Remote Sector Support", type: "BORDER EMERGENCY SIMULATION", zone: "Z-E", severity: "LOW" as Severity, score: 96, date: "2026-02-24", duration: "01:30" },
];

export const SAT_DETECTIONS = [
  { id: "D1", label: "Infrastructure", conf: 96.4, x: 22, y: 30, w: 20, h: 16 },
  { id: "D2", label: "Road", conf: 92.8, x: 55, y: 58, w: 26, h: 10 },
  { id: "D3", label: "Vehicle", conf: 88.1, x: 66, y: 26, w: 9, h: 8 },
  { id: "D4", label: "Terrain", conf: 94.5, x: 30, y: 66, w: 18, h: 18 },
];
