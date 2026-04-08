import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { Home, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PlayerAvatar } from "../components/ui/PlayerAvatar";
import { useGameStore } from "../store/gameStore";
import type { OwnedPropertyView, PlayerStateView } from "../types/game";
import { formatMoney, getPlayerColor } from "../types/game";

// ─── Confetti particle ───────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
}

// Colors derived from PLAYER_COLORS token values
const CONFETTI_COLORS = [
  "oklch(var(--primary))",
  "oklch(var(--accent))",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#3b82f6",
  "#22c55e",
];

function useConfetti(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = window.innerWidth;
    canvas.width = W;
    canvas.height = window.innerHeight;

    particlesRef.current = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * W,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 10 + 5,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
    }));

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particlesRef.current) {
        if (p.vy < 20) {
          p.x += p.vx;
          p.vy += 0.35;
          p.rotation += p.rotSpeed;
          const y = p.vy < 0 ? p.vy * 2 : p.vy * 2 + (p.vy * p.vy) / 2;
          ctx.save();
          ctx.translate(p.x, y + 100);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
          alive = true;
        }
      }
      for (const p of particlesRef.current) {
        p.vy += 0.3;
      }
      if (alive) {
        rafRef.current = requestAnimationFrame(draw);
      }
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return canvasRef;
}

// ─── Net worth calculation ────────────────────────────────────────────────────

function calcNetWorth(
  player: PlayerStateView,
  ownedProperties: OwnedPropertyView[],
): number {
  const props = ownedProperties.filter(
    (p) => p.ownerId.toString() === player.id.toString(),
  );
  const propValue = props.reduce((sum, p) => {
    const upgrades = Number(p.upgradeLevel);
    const houseValue =
      upgrades > 0 && upgrades < 5
        ? Number(p.deed.housePrice) * upgrades
        : upgrades === 5
          ? Number(p.deed.housePrice) * 5
          : 0;
    return (
      sum +
      Number(p.isMortgaged ? p.deed.mortgageValue : p.deed.purchasePrice) +
      houseValue
    );
  }, 0);
  return Number(player.balance) + propValue;
}

// ─── Rank styles ─────────────────────────────────────────────────────────────

const RANK_STYLES = [
  { bg: "bg-yellow-400", text: "text-foreground" },
  { bg: "bg-gray-300", text: "text-foreground" },
  { bg: "bg-amber-700", text: "text-card" },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function GameResultPage() {
  const { gameSession, resetGame } = useGameStore();
  const router = useRouter();
  const [confettiReady, setConfettiReady] = useState(false);
  const canvasRef = useConfetti(confettiReady);

  useEffect(() => {
    const t = setTimeout(() => setConfettiReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  const players = gameSession?.players ?? [];
  const ownedProperties = gameSession?.ownedProperties ?? [];
  const winner =
    gameSession?.status.__kind__ === "finished"
      ? players.find(
          (p) =>
            p.id.toString() ===
            (
              gameSession.status as {
                __kind__: "finished";
                finished: { winnerId: { toString(): string } };
              }
            ).finished.winnerId.toString(),
        )
      : null;

  const ranked = [...players].sort(
    (a, b) =>
      calcNetWorth(b, ownedProperties) - calcNetWorth(a, ownedProperties),
  );

  const handlePlayAgain = () => {
    resetGame();
    router.navigate({ to: "/lobby/create" });
  };

  const handleMainMenu = () => {
    resetGame();
    router.navigate({ to: "/" });
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col overflow-hidden"
      data-ocid="game-result-page"
    >
      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
        aria-hidden
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-20">
        {/* Winner announcement */}
        <div className="text-center mb-10">
          <div className="text-7xl mb-4 animate-bounce">🏆</div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground mb-2">
            {winner ? `${winner.username} Wins!` : "Game Over!"}
          </h1>
          {winner && (
            <p className="text-muted-foreground text-lg">
              Final net worth:{" "}
              <span className="font-bold text-primary text-xl">
                {formatMoney(calcNetWorth(winner, ownedProperties))}
              </span>
            </p>
          )}
        </div>

        {/* Rankings */}
        <div className="w-full max-w-lg space-y-3 mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground text-center mb-4">
            Final Standings
          </h2>
          {ranked.map((player, i) => {
            const netWorth = calcNetWorth(player, ownedProperties);
            const isWinner = i === 0;
            const rankStyle = RANK_STYLES[i] ?? {
              bg: "bg-muted/40",
              text: "text-foreground",
            };

            return (
              <div
                key={player.id.toString()}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl border-2 transition-smooth",
                  isWinner
                    ? "border-yellow-400 shadow-lg scale-[1.02]"
                    : "border-border",
                  player.isBankrupt ? "opacity-50" : "",
                )}
                data-ocid="result-player-row"
              >
                {/* Rank badge */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-display font-extrabold text-xs flex-shrink-0",
                    rankStyle.bg,
                    rankStyle.text,
                  )}
                >
                  {i + 1}
                </div>

                <PlayerAvatar
                  avatarId={player.avatarId}
                  playerIndex={players.indexOf(player)}
                  size="sm"
                  isBankrupt={player.isBankrupt}
                />

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-display font-bold text-base truncate",
                      player.isBankrupt
                        ? "line-through text-muted-foreground"
                        : "text-foreground",
                    )}
                  >
                    {player.username}
                    {isWinner && (
                      <span className="ml-2 text-yellow-400">👑</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cash:{" "}
                    <span className="font-semibold">
                      {formatMoney(player.balance)}
                    </span>
                    {" · "}
                    Properties:{" "}
                    <span className="font-semibold">
                      {
                        ownedProperties.filter(
                          (p) => p.ownerId.toString() === player.id.toString(),
                        ).length
                      }
                    </span>
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-display font-extrabold text-lg text-primary tabular-nums">
                    {formatMoney(netWorth)}
                  </p>
                  <p className="text-xs text-muted-foreground">Net worth</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA buttons */}
        <div
          className="flex gap-4 flex-wrap justify-center"
          data-ocid="result-actions"
        >
          <Button
            variant="outline"
            size="lg"
            className="gap-2 font-bold rounded-xl"
            onClick={handleMainMenu}
            data-ocid="main-menu-btn"
          >
            <Home className="w-5 h-5" />
            Main Menu
          </Button>
          <Button
            size="lg"
            className="gap-2 bg-primary text-primary-foreground font-display font-bold text-lg rounded-xl hover:bg-primary/90 shadow-lg px-8"
            onClick={handlePlayAgain}
            data-ocid="play-again-btn"
          >
            <RefreshCw className="w-5 h-5" />
            Play Again
          </Button>
        </div>
      </div>

      {/* Branding footer */}
      <footer className="py-4 text-center z-20">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-smooth"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
