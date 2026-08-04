import { createFileRoute } from "@tanstack/react-router";
import { CommandLayout } from "@/components/eagle/command-layout";
import { Panel, PageHeader, SeverityTag, TechLabel } from "@/components/eagle/hud";
import { SIM_HISTORY } from "@/lib/eagle-data";
import { useSim } from "@/lib/sim-context";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Simulation History — EAGLE EYE" },
      { name: "description", content: "Archive of executed simulated emergency scenarios with mission scores and zones." },
      { property: "og:title", content: "Simulation History — EAGLE EYE" },
      { property: "og:description", content: "Past simulated scenarios and their performance results." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { results } = useSim();
  const rows = [
    ...results.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      zone: r.zone,
      severity: r.severity,
      score: r.score,
      date: r.finishedAt.slice(0, 10),
      duration: "—",
    })),
    ...SIM_HISTORY,
  ];

  return (
    <CommandLayout>
      <div className="space-y-5 p-4 md:p-6">
        <PageHeader
          eyebrow="ARCHIVE"
          title="SIMULATION HISTORY"
          description="Executed scenarios from this session and the demonstration archive."
        />
        <Panel bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-border/60">
                  {["ID", "SCENARIO", "TYPE", "ZONE", "SEVERITY", "SCORE", "DATE"].map((h) => (
                    <th key={h} className="label-tech px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-border/40 transition-colors hover:bg-surface-2/40">
                    <td className="px-4 py-3 font-mono text-[11px] text-gold">{r.id}</td>
                    <td className="px-4 py-3 text-sm">{r.name}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{r.type}</td>
                    <td className="px-4 py-3 font-mono text-[11px]">{r.zone}</td>
                    <td className="px-4 py-3">
                      <SeverityTag level={r.severity} />
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-foreground">{r.score}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <TechLabel>SIMULATION DATA — ITC DEMONSTRATION</TechLabel>
      </div>
    </CommandLayout>
  );
}
