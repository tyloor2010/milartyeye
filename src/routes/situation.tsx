import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Brain, Send, Loader2 } from "lucide-react";
import { CommandLayout } from "@/components/eagle/command-layout";
import { Panel, PageHeader, TechLabel, Meter, SeverityTag } from "@/components/eagle/hud";
import { useSim } from "@/lib/sim-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/situation")({
  head: () => ({
    meta: [
      { title: "AI Situation Room — EAGLE EYE" },
      {
        name: "description",
        content:
          "Conversational AI situational analysis for simulated incidents, with emergency response, rescue and logistics recommendations only.",
      },
      { property: "og:title", content: "AI Situation Room — EAGLE EYE" },
      { property: "og:description", content: "Natural-language reasoning over the simulated operating picture." },
    ],
  }),
  component: SituationPage,
});

interface Msg {
  role: "user" | "ai";
  text: string;
}

const QUICK = [
  "ANALYZE INCIDENTS",
  "GENERATE REPORT",
  "CHECK RESOURCES",
  "RUN SIMULATION",
  "SHOW CRITICAL ZONES",
] as const;

const ANSWERS: Record<string, string> = {
  "ANALYZE INCIDENTS":
    "Three simulated incidents are active. Two are infrastructure anomalies (Zone C water distribution, Zone D structural strain) and one is an emergency medical event in Zone B. The Zone B event carries the highest response priority; the Zone C anomaly carries the highest infrastructure impact.",
  "GENERATE REPORT":
    "A situation report has been prepared from the current simulated state. It contains an executive summary, incident overview, affected areas, infrastructure status, resource status and a response timeline. Open the Reports module to view or export it.",
  "CHECK RESOURCES":
    "Aggregate readiness is 94%. Medical supplies 87%, vehicles 91%, emergency equipment 79%, fuel 72%, food and water 68%. Food and water reserves in Zone C are trending downward and should be replenished before the next simulated cycle.",
  "RUN SIMULATION":
    "A scenario can be configured in the Simulation Lab. Based on the current picture I recommend a Zone C natural-disaster scenario at HIGH severity with eight response teams and a three-hour horizon.",
  "SHOW CRITICAL ZONES":
    "Zone B (Greater Cairo) is CRITICAL due to the active emergency event. Zone C (Alexandria Coastal) is ELEVATED due to degraded water distribution. Zones A, D and E remain nominal with routine monitoring.",
};

function SituationPage() {
  const { startSim } = useSim();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "user", text: "What is happening in the monitored zone?" },
    {
      role: "ai",
      text: "Three simulated incidents have been detected. Two infrastructure anomalies and one emergency event require attention. Response Team BRAVO is deployed to the emergency event and medical capacity is sufficient.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const answer =
        ANSWERS[text.toUpperCase()] ??
        "Based on the current simulated operating picture, the situation is ELEVATED. I recommend maintaining monitoring on the Suez corridor strain sensors, keeping Response Team ALPHA on standby, and pre-positioning water reserves for Zone C. All recommendations are limited to emergency response, rescue, infrastructure protection, logistics and communication.";
      setMsgs((m) => [...m, { role: "ai", text: answer }]);
      setThinking(false);
      if (text.toUpperCase() === "RUN SIMULATION") startSim();
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1100);
  };

  return (
    <CommandLayout>
      <div className="space-y-5 p-4 md:p-6">
        <PageHeader
          eyebrow="MODULE 04 — DECISION SUPPORT"
          title="AI SITUATION ROOM"
          description="Simulated reasoning assistant. Recommendations are limited to emergency response, rescue, infrastructure protection, logistics, monitoring and communication."
        />

        <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
          <Panel title="CONVERSATION" bodyClassName="flex h-[62vh] flex-col p-0">
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {msgs.map((m, i) => (
                <div key={i} className={cn("animate-rise max-w-[85%]", m.role === "user" && "ml-auto")}>
                  <TechLabel className={m.role === "ai" ? "text-gold/80" : ""}>
                    {m.role === "ai" ? "EAGLE EYE AI" : "OPERATOR"}
                  </TechLabel>
                  <div
                    className={cn(
                      "corner-ticks mt-2 border px-4 py-3 text-sm leading-relaxed",
                      m.role === "ai"
                        ? "border-gold/25 bg-gold/5 text-foreground/90"
                        : "border-border/60 bg-surface/60 text-foreground/85",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-gold" />
                  <TechLabel>PROCESSING SIMULATED CONTEXT…</TechLabel>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className="border-t border-border/60 p-3">
              <div className="flex flex-wrap gap-1.5 pb-3">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="label-tech rounded-sm border border-border/60 px-2.5 py-1.5 text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about the simulated situation…"
                  className="flex-1 rounded-sm border border-border/60 bg-background px-3 py-2.5 text-sm outline-none focus:border-gold/50"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-sm bg-gold px-4 text-gold-foreground"
                  aria-label="Send"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel
              title={
                <span className="flex items-center gap-2">
                  <Brain className="h-3 w-3 text-gold" /> LIVE AI ANALYSIS
                </span>
              }
              bodyClassName="p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <TechLabel>RISK LEVEL</TechLabel>
                <SeverityTag level="HIGH" />
              </div>
              {[
                { k: "CONFIDENCE", v: 94 },
                { k: "AFFECTED AREA", v: 38 },
                { k: "RESOURCE COVERAGE", v: 86 },
              ].map((r) => (
                <div key={r.k}>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="label-tech">{r.k}</span>
                    <span className="text-gold">{r.v}%</span>
                  </div>
                  <Meter value={r.v} className="mt-1.5" />
                </div>
              ))}
              <div className="corner-ticks border border-border/60 p-3">
                <TechLabel className="text-signal">RECOMMENDED RESPONSE</TechLabel>
                <ul className="mt-2 space-y-1.5 text-[12px] text-foreground/85">
                  <li>· Maintain Team BRAVO on the Zone B emergency event.</li>
                  <li>· Isolate water distribution line 3 in Zone C.</li>
                  <li>· Increase strain-sensor sampling on the canal bridge.</li>
                  <li>· Pre-position water and medical reserves toward Zone C.</li>
                  <li>· Keep the communication relay failover path active.</li>
                </ul>
              </div>
            </Panel>
            <Panel title="GUARDRAILS" bodyClassName="p-4">
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                This assistant does not produce targeting, tactical or offensive guidance. All
                outputs are simulated and intended for demonstration at ITC 2026.
              </p>
            </Panel>
          </div>
        </div>
      </div>
    </CommandLayout>
  );
}
