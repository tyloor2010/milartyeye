import { Github, Linkedin, Phone } from "lucide-react";
import { TechLabel } from "./hud";

export function Credits() {
  return (
    <footer className="border-t border-border/60 bg-surface/40 px-5 py-8 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="leading-tight">
          <TechLabel>DEVELOPED BY · تم تطويرها بواسطة</TechLabel>
          <p className="mt-1.5 font-display text-lg font-bold tracking-[0.12em] text-foreground">
            MOHAMED NASSER · محمد ناصر
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            EAGLE EYE — designed exclusively for ITC 2026 · Egypt Edition
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="https://github.com/nohamednasser"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-2 border border-border/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-gold/60 hover:text-foreground"
          >
            <Github className="h-3.5 w-3.5" /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/mohamed-nasser-377b6b404"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-2 border border-border/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-gold/60 hover:text-foreground"
          >
            <Linkedin className="h-3.5 w-3.5" /> LinkedIn
          </a>
          <a
            href="tel:+201010769288"
            className="flex items-center gap-2 border border-border/60 px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-gold/60 hover:text-foreground"
          >
            <Phone className="h-3.5 w-3.5" /> 01010769288
          </a>
        </div>
      </div>
    </footer>
  );
}
