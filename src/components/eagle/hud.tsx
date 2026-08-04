import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
  ticks = true,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
  ticks?: boolean;
}) {
  return (
    <section className={cn("panel relative", ticks && "corner-ticks", className)}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5">
          <h3 className="label-tech text-foreground/80">{title}</h3>
          {action}
        </header>
      )}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function TechLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("label-tech", className)}>{children}</span>;
}

export function StatusDot({
  tone = "signal",
  pulse = true,
}: {
  tone?: "signal" | "gold" | "critical" | "cyan" | "muted";
  pulse?: boolean;
}) {
  const map = {
    signal: "bg-signal",
    gold: "bg-gold",
    critical: "bg-critical",
    cyan: "bg-cyan",
    muted: "bg-muted-foreground",
  } as const;
  return (
    <span className="relative inline-flex h-1.5 w-1.5">
      {pulse && (
        <span className={cn("absolute inset-0 animate-ping rounded-full opacity-70", map[tone])} />
      )}
      <span className={cn("relative h-1.5 w-1.5 rounded-full", map[tone])} />
    </span>
  );
}

export function Counter({
  value,
  decimals = 0,
  suffix = "",
  className,
  duration = 1200,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const [shown, setShown] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(from + (value - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, duration]);
  return (
    <span className={cn("font-display tabular-nums", className)}>
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Metric({
  label,
  value,
  suffix,
  decimals = 0,
  tone = "default",
  hint,
}: {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  tone?: "default" | "gold" | "critical" | "signal" | "cyan";
  hint?: string;
}) {
  const toneClass = {
    default: "text-foreground",
    gold: "text-gold",
    critical: "text-critical",
    signal: "text-signal",
    cyan: "text-cyan",
  }[tone];
  return (
    <div className="corner-ticks border border-border/60 bg-surface/40 px-3 py-3">
      <TechLabel>{label}</TechLabel>
      <div className={cn("mt-2 text-2xl font-semibold tracking-tight", toneClass)}>
        <Counter value={value} decimals={decimals} suffix={suffix ?? ""} />
      </div>
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Meter({
  value,
  tone = "gold",
  className,
}: {
  value: number;
  tone?: "gold" | "signal" | "critical" | "cyan";
  className?: string;
}) {
  const bar = {
    gold: "bg-gold",
    signal: "bg-signal",
    critical: "bg-critical",
    cyan: "bg-cyan",
  }[tone];
  return (
    <div className={cn("h-1 w-full overflow-hidden rounded-full bg-surface-2", className)}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-1000 ease-out", bar)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function SeverityTag({ level }: { level: string }) {
  const tone =
    level === "CRITICAL"
      ? "border-critical/50 text-critical bg-critical/10"
      : level === "HIGH"
        ? "border-warn/50 text-warn bg-warn/10"
        : level === "MEDIUM"
          ? "border-gold/40 text-gold bg-gold/10"
          : "border-signal/40 text-signal bg-signal/10";
  return (
    <span className={cn("label-tech rounded-sm border px-1.5 py-1", tone)}>{level}</span>
  );
}

export function SimBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "label-tech inline-flex items-center gap-2 rounded-sm border border-gold/30 bg-gold/5 px-2.5 py-1.5 text-gold/90",
        className,
      )}
    >
      <StatusDot tone="gold" />
      SIMULATION / DEMONSTRATION ENVIRONMENT
    </span>
  );
}

export function ScanBar() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="animate-scan h-8 w-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="animate-rise flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-5">
      <div>
        <TechLabel className="text-gold/80">{eyebrow}</TechLabel>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
