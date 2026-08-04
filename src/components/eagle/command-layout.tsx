import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Radar,
  Boxes,
  Satellite,
  Brain,
  FlaskConical,
  Truck,
  Siren,
  BarChart3,
  FileText,
  Settings,
  History,
  Info,
  Menu,
  Search,
  Play,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSim } from "@/lib/sim-context";
import { StatusDot, TechLabel } from "./hud";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export const NAV = [
  { to: "/command", label: "COMMAND CENTER", icon: Radar },
  { to: "/twin", label: "DIGITAL TWIN", icon: Boxes },
  { to: "/satellite", label: "SATELLITE INTELLIGENCE", icon: Satellite },
  { to: "/situation", label: "AI SITUATION ROOM", icon: Brain },
  { to: "/simulation", label: "SIMULATIONS", icon: FlaskConical },
  { to: "/logistics", label: "LOGISTICS", icon: Truck },
  { to: "/incidents", label: "INCIDENTS", icon: Siren },
  { to: "/analytics", label: "ANALYTICS", icon: BarChart3 },
  { to: "/reports", label: "REPORTS", icon: FileText },
] as const;

const SECONDARY = [
  { to: "/history", label: "SIMULATION HISTORY", icon: History },
  { to: "/about", label: "ABOUT / TECHNOLOGY", icon: Info },
  { to: "/settings", label: "SETTINGS", icon: Settings },
] as const;

function Clock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const tick = () =>
      setT(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="font-mono text-xs tabular-nums text-foreground/90">{t}</span>;
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-sm border border-gold/40 bg-gold/10">
        <Radar className="h-4 w-4 text-gold" />
        <span className="absolute inset-0 rounded-sm border border-gold/20 transition-all group-hover:scale-110" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-sm font-bold tracking-[0.22em] text-foreground">
            EAGLE EYE
          </span>
          <span className="label-tech mt-1 block text-[9px]">AI DEFENSE COMMAND</span>
        </span>
      )}
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const render = (items: readonly { to: string; label: string; icon: typeof Radar }[]) =>
    items.map((item) => {
      const active = pathname === item.to;
      return (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={cn(
            "group relative flex items-center gap-3 rounded-sm px-3 py-2.5 transition-colors",
            active
              ? "bg-gold/10 text-foreground"
              : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
          )}
        >
          <span
            className={cn(
              "absolute left-0 top-1/2 h-0 w-px -translate-y-1/2 bg-gold transition-all duration-300",
              active ? "h-6" : "group-hover:h-3",
            )}
          />
          <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-gold" : "text-current")} />
          <span className="label-tech text-[10px] text-current">{item.label}</span>
        </Link>
      );
    });

  return (
    <nav className="flex flex-col gap-0.5">
      {render(NAV)}
      <div className="my-3 h-px bg-border/60" />
      {render(SECONDARY)}
    </nav>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  const { simRunning, setPaletteOpen, demoMode } = useSim();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/85 px-3 backdrop-blur-xl md:px-5">
      <button
        onClick={onMenu}
        className="flex h-9 w-9 items-center justify-center rounded-sm border border-border/60 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-4 w-4" />
      </button>
      <div className="hidden items-center gap-5 md:flex">
        <Stat label="SYSTEM" value="ONLINE" tone="signal" />
        <Stat label="AI" value="ACTIVE" tone="cyan" />
        <Stat label="SIMULATION" value={simRunning ? "RUNNING" : "STANDBY"} tone={simRunning ? "critical" : "gold"} />
        <Stat label="DATA" value="SIMULATED" tone="gold" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        {demoMode && (
          <span className="label-tech hidden rounded-sm border border-gold/40 bg-gold/10 px-2 py-1.5 text-gold sm:inline-flex">
            ITC DEMO MODE
          </span>
        )}
        <button
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-2 rounded-sm border border-border/60 bg-surface/50 px-3 py-2 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="label-tech hidden sm:inline">COMMAND SEARCH</span>
          <kbd className="rounded-xs border border-border/60 px-1 font-mono text-[10px]">/</kbd>
        </button>
        <div className="hidden items-center gap-2 border-l border-border/60 pl-3 lg:flex">
          <TechLabel>TIME</TechLabel>
          <Clock />
        </div>
      </div>
    </header>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "signal" | "gold" | "critical" | "cyan";
}) {
  const text = {
    signal: "text-signal",
    gold: "text-gold",
    critical: "text-critical",
    cyan: "text-cyan",
  }[tone];
  return (
    <div className="flex items-center gap-2">
      <TechLabel>{label}</TechLabel>
      <span className={cn("flex items-center gap-1.5 font-mono text-[11px] tracking-wider", text)}>
        <StatusDot tone={tone} />
        {value}
      </span>
    </div>
  );
}

function Palette() {
  const { paletteOpen, setPaletteOpen, startSim, setDemoMode } = useSim();
  const navigate = useNavigate();
  const go = (to: string) => {
    setPaletteOpen(false);
    void navigate({ to });
  };
  return (
    <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
      <CommandInput placeholder="Search commands, incidents, modules…" />
      <CommandList>
        <CommandEmpty>No matching command.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {[...NAV, ...SECONDARY].map((n) => (
            <CommandItem key={n.to} onSelect={() => go(n.to)}>
              <n.icon className="mr-2 h-4 w-4" />
              Open {n.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              startSim();
              go("/simulation");
            }}
          >
            <Play className="mr-2 h-4 w-4" /> Start simulation
          </CommandItem>
          <CommandItem onSelect={() => go("/reports")}>
            <FileText className="mr-2 h-4 w-4" /> Generate situation report
          </CommandItem>
          <CommandItem onSelect={() => go("/incidents")}>
            <Siren className="mr-2 h-4 w-4" /> Search incidents
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setDemoMode(true);
              go("/command");
            }}
          >
            <Radar className="mr-2 h-4 w-4" /> Enable ITC demo mode
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function CommandLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { systemStatus } = useSim();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur-xl lg:flex">
        <div className="flex h-14 items-center border-b border-border/60 px-4">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <NavList />
        </div>
        <div className="border-t border-border/60 p-3">
          <div className="corner-ticks flex items-center justify-between border border-border/60 px-2.5 py-2">
            <TechLabel>SYSTEM STATUS</TechLabel>
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-gold">
              <StatusDot tone="gold" />
              {systemStatus}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2.5 px-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-mono text-[10px] text-gold">
              OP
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] text-foreground">Operator 01</span>
              <TechLabel>ITC 2026 · EGYPT EDITION</TechLabel>
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-72 border-r border-border/60 bg-sidebar transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-14 items-center justify-between border-b border-border/60 px-4">
            <Brand />
            <button onClick={() => setOpen(false)} aria-label="Close navigation">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="overflow-y-auto px-2 py-4">
            <NavList onNavigate={() => setOpen(false)} />
          </div>
        </div>
      </div>

      <div className="flex min-h-screen w-full flex-col lg:pl-60">
        <TopBar onMenu={() => setOpen(true)} />
        <main className="animate-fade flex-1 pb-20 lg:pb-0">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border/60 bg-background/95 backdrop-blur-xl lg:hidden">
        {NAV.slice(0, 5).map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className="flex flex-col items-center gap-1 py-2.5 text-muted-foreground [&.active]:text-gold"
            activeProps={{ className: "text-gold" }}
          >
            <n.icon className="h-4 w-4" />
            <span className="label-tech text-[8px]">{n.label.split(" ")[0]}</span>
          </Link>
        ))}
      </nav>

      <Palette />
    </div>
  );
}
