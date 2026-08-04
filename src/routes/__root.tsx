import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SimProvider } from "../lib/sim-context";
import { ThemeProvider } from "../lib/theme";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="grid-bg flex min-h-screen items-center justify-center bg-background px-4">
      <div className="panel corner-ticks max-w-md px-8 py-10 text-center">
        <p className="label-tech text-gold/80">SIGNAL LOST</p>
        <h1 className="mt-4 font-display text-6xl font-bold text-foreground">404</h1>
        <h2 className="mt-3 text-lg font-semibold text-foreground">Sector not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This coordinate is not part of the simulated environment.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="label-tech inline-flex items-center justify-center rounded-sm border border-gold/40 bg-gold/10 px-4 py-2.5 text-gold transition-colors hover:bg-gold/20"
          >
            RETURN TO BASE
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="panel corner-ticks max-w-md px-8 py-10 text-center">
        <p className="label-tech text-critical">SYSTEM FAULT</p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
          This module didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Re-initialise the module or return to base.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="label-tech rounded-sm border border-gold/40 bg-gold/10 px-4 py-2.5 text-gold transition-colors hover:bg-gold/20"
          >
            RE-INITIALISE
          </button>
          <a
            href="/"
            className="label-tech rounded-sm border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            RETURN TO BASE
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EAGLE EYE — AI Defense Command & Digital Twin" },
      {
        name: "description",
        content:
          "EAGLE EYE is a simulated AI defense command and digital twin environment for situational awareness, emergency response and infrastructure monitoring.",
      },
      { name: "author", content: "ITC 2026 Student Technology Prototype" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Hind:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SimProvider>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <Toaster position="bottom-right" />
        </SimProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
