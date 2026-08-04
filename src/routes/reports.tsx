import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Loader2, Download } from "lucide-react";
import { CommandLayout } from "@/components/eagle/command-layout";
import { Panel, PageHeader, TechLabel } from "@/components/eagle/hud";
import { useSim } from "@/lib/sim-context";
import { INCIDENTS } from "@/lib/eagle-data";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "AI Report Generator — EAGLE EYE" },
      {
        name: "description",
        content: "Generate a full simulated situation report: executive summary, incidents, infrastructure, resources, timeline and recommendations.",
      },
      { property: "og:title", content: "AI Report Generator — EAGLE EYE" },
      { property: "og:description", content: "Structured situation reporting from the current simulation state." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { simConfig, lastResult } = useSim();
  const [state, setState] = useState<"idle" | "loading" | "ready">("idle");

  const sections = [
    {
      h: "EXECUTIVE SUMMARY",
      b: `The monitored environment is at ELEVATED status. Three simulated incidents are active across two zones. Response capacity is sufficient and no escalation beyond the standing emergency posture is required.`,
    },
    {
      h: "INCIDENT OVERVIEW",
      b: INCIDENTS.filter((i) => i.status !== "RESOLVED")
        .map((i) => `${i.id} — ${i.title} (${i.severity}) at ${i.location}.`)
        .join(" "),
    },
    { h: "AFFECTED AREAS", b: "Zone B (Greater Cairo) and Zone C (Alexandria Coastal). Combined simulated footprint of approximately 38 km²." },
    { h: "INFRASTRUCTURE STATUS", b: "Power 98%, water distribution 61% in Zone C, transport corridors 97%, communications 99%. One utility node is degraded." },
    { h: "RESOURCE STATUS", b: "Aggregate readiness 94%. Fuel 72%, medical 87%, food and water 68%, vehicles 91%, equipment 79%, warehouse capacity 54%." },
    { h: "RESPONSE TIMELINE", b: "Detection at 02:14:32, AI correlation at 02:15:10, escalation at 02:17:44, dispatch at 03:05:12, medical corridor reserved at 03:09:31." },
    {
      h: "SIMULATION RESULTS",
      b: lastResult
        ? `Scenario "${lastResult.name}" (${lastResult.type}, ${lastResult.severity}) scored ${lastResult.score}/100 — response ${lastResult.response}%, resource ${lastResult.resource}%, recovery ${lastResult.recovery}%.`
        : `No scenario has been executed in this session. Configured scenario: "${simConfig.name}" (${simConfig.type}, ${simConfig.severity}).`,
    },
    { h: "AI ANALYSIS", b: "Correlation confidence 94.2%. Detected patterns are consistent with a localised utility failure plus an unrelated urban emergency event. No systemic risk indicators identified." },
    { h: "RECOMMENDATIONS", b: "Isolate water line 3 in Zone C, maintain Team BRAVO on site, increase strain-sensor sampling on the canal bridge, replenish water and food reserves, and keep the relay failover path active." },
  ];

  return (
    <CommandLayout>
      <div className="space-y-5 p-4 md:p-6">
        <PageHeader
          eyebrow="MODULE 09 — REPORTING"
          title="AI REPORT GENERATOR"
          description="Every generated report is marked as simulation data."
          action={
            <button
              onClick={() => {
                setState("loading");
                setTimeout(() => setState("ready"), 1600);
              }}
              className="label-tech flex items-center gap-2 rounded-sm bg-gold px-5 py-3 text-gold-foreground transition-transform hover:-translate-y-0.5"
            >
              {state === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
              GENERATE SITUATION REPORT
            </button>
          }
        />

        {state === "idle" && (
          <Panel bodyClassName="p-10 text-center">
            <TechLabel>NO REPORT IN BUFFER — GENERATE TO CONTINUE</TechLabel>
          </Panel>
        )}

        {state === "loading" && (
          <Panel title="COMPILING" bodyClassName="p-6 space-y-3">
            {[92, 78, 64, 84, 48].map((w, i) => (
              <div key={i} className="h-3 animate-pulse rounded-sm bg-surface-2" style={{ width: `${w}%` }} />
            ))}
          </Panel>
        )}

        {state === "ready" && (
          <Panel
            title="SITUATION REPORT — EYE/SITREP/2026-014"
            action={
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="label-tech flex items-center gap-2 rounded-sm border border-border/60 px-3 py-1.5 text-foreground/80 hover:border-gold/50 hover:text-gold"
                >
                  <Download className="h-3 w-3" /> EXPORT PDF
                </button>
                <button
                  onClick={() => toast.success("Report archived to simulation history")}
                  className="label-tech rounded-sm border border-border/60 px-3 py-1.5 text-foreground/80 hover:border-gold/50 hover:text-gold"
                >
                  ARCHIVE
                </button>
              </div>
            }
            bodyClassName="p-6 space-y-6"
          >
            <TechLabel className="text-gold/80">SIMULATION DATA — ITC DEMONSTRATION</TechLabel>
            {sections.map((s) => (
              <section key={s.h}>
                <h3 className="label-tech text-foreground">{s.h}</h3>
                <p className="mt-2 max-w-4xl text-sm leading-relaxed text-foreground/85">{s.b}</p>
              </section>
            ))}
            <p className="label-tech border-t border-border/60 pt-4">
              STUDENT TECHNOLOGY PROTOTYPE — ITC 2026 · NOT AN OPERATIONAL DOCUMENT
            </p>
          </Panel>
        )}
      </div>
    </CommandLayout>
  );
}
