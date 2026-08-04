import { createFileRoute } from "@tanstack/react-router";
import { CommandLayout } from "@/components/eagle/command-layout";
import { Panel, PageHeader, Metric } from "@/components/eagle/hud";
import { ANALYTICS_SERIES } from "@/lib/eagle-data";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — EAGLE EYE" },
      {
        name: "description",
        content: "Operational analytics for simulated response time, resource efficiency, infrastructure health and AI detection accuracy.",
      },
      { property: "og:title", content: "Analytics — EAGLE EYE" },
      { property: "og:description", content: "Premium analytics over simulated command-center performance." },
    ],
  }),
  component: AnalyticsPage,
});

const axis = { stroke: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" };

function AnalyticsPage() {
  return (
    <CommandLayout>
      <div className="space-y-5 p-4 md:p-6">
        <PageHeader
          eyebrow="MODULE 08 — PERFORMANCE"
          title="ANALYTICS & REPORTS"
          description="Derived from the current simulated operating cycle."
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="OPERATIONAL READINESS" value={92} suffix="%" tone="gold" />
          <Metric label="SIMULATION PERFORMANCE" value={94} suffix="%" tone="signal" />
          <Metric label="AI CONFIDENCE" value={96} suffix="%" tone="cyan" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="RESPONSE TIME (MIN)" bodyClassName="h-64 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_SERIES}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis dataKey="t" {...axis} tickLine={false} />
                <YAxis {...axis} tickLine={false} width={28} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 12 }} />
                <Area dataKey="response" stroke="var(--gold)" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="RESOURCE EFFICIENCY & INFRASTRUCTURE HEALTH" bodyClassName="h-64 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ANALYTICS_SERIES}>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis dataKey="t" {...axis} tickLine={false} />
                <YAxis {...axis} tickLine={false} width={28} domain={[70, 100]} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 12 }} />
                <Line dataKey="efficiency" stroke="var(--cyan)" dot={false} strokeWidth={2} />
                <Line dataKey="health" stroke="var(--signal)" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="INCIDENT FREQUENCY" bodyClassName="h-64 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_SERIES}>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis dataKey="t" {...axis} tickLine={false} />
                <YAxis {...axis} tickLine={false} width={28} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 12 }} />
                <Bar dataKey="incidents" fill="var(--critical)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="AI DETECTION ACCURACY" bodyClassName="h-64 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_SERIES}>
                <defs>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis dataKey="t" {...axis} tickLine={false} />
                <YAxis {...axis} tickLine={false} width={28} domain={[85, 100]} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 12 }} />
                <Area dataKey="accuracy" stroke="var(--cyan)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      </div>
    </CommandLayout>
  );
}
