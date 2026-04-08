import { a0 as useRouter, r as reactExports, j as jsxRuntimeExports } from "./index-YS-crX1h.js";
import { u as useGameStore, f as formatMoney, P as PlayerAvatar, B as Button } from "./gameStore-BkgthZgj.js";
import { a as createLucideIcon, c as cn } from "./createLucideIcon-CXBxgcWC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
const CONFETTI_COLORS = [
  "oklch(var(--primary))",
  "oklch(var(--accent))",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#3b82f6",
  "#22c55e"
];
function useConfetti(active) {
  const canvasRef = reactExports.useRef(null);
  const particlesRef = reactExports.useRef([]);
  const rafRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
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
      rotSpeed: (Math.random() - 0.5) * 8
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
          const y = p.vy < 0 ? p.vy * 2 : p.vy * 2 + p.vy * p.vy / 2;
          ctx.save();
          ctx.translate(p.x, y + 100);
          ctx.rotate(p.rotation * Math.PI / 180);
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
function calcNetWorth(player, ownedProperties) {
  const props = ownedProperties.filter(
    (p) => p.ownerId.toString() === player.id.toString()
  );
  const propValue = props.reduce((sum, p) => {
    const upgrades = Number(p.upgradeLevel);
    const houseValue = upgrades > 0 && upgrades < 5 ? Number(p.deed.housePrice) * upgrades : upgrades === 5 ? Number(p.deed.housePrice) * 5 : 0;
    return sum + Number(p.isMortgaged ? p.deed.mortgageValue : p.deed.purchasePrice) + houseValue;
  }, 0);
  return Number(player.balance) + propValue;
}
const RANK_STYLES = [
  { bg: "bg-yellow-400", text: "text-foreground" },
  { bg: "bg-gray-300", text: "text-foreground" },
  { bg: "bg-amber-700", text: "text-card" }
];
function GameResultPage() {
  const { gameSession, resetGame } = useGameStore();
  const router = useRouter();
  const [confettiReady, setConfettiReady] = reactExports.useState(false);
  const canvasRef = useConfetti(confettiReady);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setConfettiReady(true), 300);
    return () => clearTimeout(t);
  }, []);
  const players = (gameSession == null ? void 0 : gameSession.players) ?? [];
  const ownedProperties = (gameSession == null ? void 0 : gameSession.ownedProperties) ?? [];
  const winner = (gameSession == null ? void 0 : gameSession.status.__kind__) === "finished" ? players.find(
    (p) => p.id.toString() === gameSession.status.finished.winnerId.toString()
  ) : null;
  const ranked = [...players].sort(
    (a, b) => calcNetWorth(b, ownedProperties) - calcNetWorth(a, ownedProperties)
  );
  const handlePlayAgain = () => {
    resetGame();
    router.navigate({ to: "/lobby/create" });
  };
  const handleMainMenu = () => {
    resetGame();
    router.navigate({ to: "/" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col overflow-hidden",
      "data-ocid": "game-result-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            className: "fixed inset-0 pointer-events-none z-10",
            "aria-hidden": true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-7xl mb-4 animate-bounce", children: "🏆" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-extrabold text-4xl sm:text-5xl text-foreground mb-2", children: winner ? `${winner.username} Wins!` : "Game Over!" }),
            winner && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-lg", children: [
              "Final net worth:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-primary text-xl", children: formatMoney(calcNetWorth(winner, ownedProperties)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg space-y-3 mb-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold uppercase tracking-wider text-muted-foreground text-center mb-4", children: "Final Standings" }),
            ranked.map((player, i) => {
              const netWorth = calcNetWorth(player, ownedProperties);
              const isWinner = i === 0;
              const rankStyle = RANK_STYLES[i] ?? {
                bg: "bg-muted/40",
                text: "text-foreground"
              };
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl border-2 transition-smooth",
                    isWinner ? "border-yellow-400 shadow-lg scale-[1.02]" : "border-border",
                    player.isBankrupt ? "opacity-50" : ""
                  ),
                  "data-ocid": "result-player-row",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-display font-extrabold text-xs flex-shrink-0",
                          rankStyle.bg,
                          rankStyle.text
                        ),
                        children: i + 1
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      PlayerAvatar,
                      {
                        avatarId: player.avatarId,
                        playerIndex: players.indexOf(player),
                        size: "sm",
                        isBankrupt: player.isBankrupt
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: cn(
                            "font-display font-bold text-base truncate",
                            player.isBankrupt ? "line-through text-muted-foreground" : "text-foreground"
                          ),
                          children: [
                            player.username,
                            isWinner && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-yellow-400", children: "👑" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        "Cash:",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: formatMoney(player.balance) }),
                        " · ",
                        "Properties:",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: ownedProperties.filter(
                          (p) => p.ownerId.toString() === player.id.toString()
                        ).length })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-extrabold text-lg text-primary tabular-nums", children: formatMoney(netWorth) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Net worth" })
                    ] })
                  ]
                },
                player.id.toString()
              );
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex gap-4 flex-wrap justify-center",
              "data-ocid": "result-actions",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "lg",
                    className: "gap-2 font-bold rounded-xl",
                    onClick: handleMainMenu,
                    "data-ocid": "main-menu-btn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-5 h-5" }),
                      "Main Menu"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "lg",
                    className: "gap-2 bg-primary text-primary-foreground font-display font-bold text-lg rounded-xl hover:bg-primary/90 shadow-lg px-8",
                    onClick: handlePlayAgain,
                    "data-ocid": "play-again-btn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-5 h-5" }),
                      "Play Again"
                    ]
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "py-4 text-center z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          ".",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hover:text-foreground transition-smooth",
              children: "Built with love using caffeine.ai"
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  GameResultPage as default
};
