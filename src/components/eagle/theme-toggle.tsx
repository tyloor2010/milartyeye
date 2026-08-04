import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { mode, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 items-center gap-2 border border-border/60 px-2.5 text-muted-foreground transition-colors hover:border-gold/60 hover:text-foreground"
    >
      {mode === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      <span className="label-tech hidden text-[10px] sm:inline">
        {mode === "dark" ? "LIGHT" : "DARK"}
      </span>
    </button>
  );
}
