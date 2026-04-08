import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Dice5 } from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  /** Show the top nav bar (default: true) */
  showNav?: boolean;
  /** Fill the full viewport (for game board) */
  fullscreen?: boolean;
  className?: string;
}

export function Layout({
  children,
  showNav = true,
  fullscreen = false,
  className,
}: LayoutProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const brandingUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  if (fullscreen) {
    return (
      <div
        className={cn(
          "min-h-screen bg-background flex flex-col overflow-hidden",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showNav && (
        <header
          className="sticky top-0 z-40 bg-card border-b border-border shadow-xs"
          data-ocid="nav"
        >
          <div className="container max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-smooth group-hover:scale-110">
                <Dice5 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-foreground tracking-tight">
                BoardBlast
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                to="/"
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-smooth"
              >
                Home
              </Link>
              <Link
                to="/lobby/create"
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-smooth"
              >
                New Game
              </Link>
            </nav>
          </div>
        </header>
      )}

      <main className={cn("flex-1 bg-background", className)}>{children}</main>

      {showNav && (
        <footer className="bg-card border-t border-border py-4">
          <div className="container max-w-6xl mx-auto px-4 text-center">
            <p className="text-xs text-muted-foreground">
              © {year}.{" "}
              <a
                href={brandingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-smooth"
              >
                Built with love using caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
