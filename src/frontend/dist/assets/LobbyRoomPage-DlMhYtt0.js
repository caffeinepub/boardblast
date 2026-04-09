import { j as jsxRuntimeExports, u as useParams, r as reactExports, a as ue } from "./index-xRF9tkV2.js";
import { u as useLobbyPolling, B as Badge } from "./useGamePolling-V7QDJwSx.js";
import { u as useGameStore, g as getAvatarEmoji, P as PlayerAvatar, B as Button } from "./gameStore-EujuzfF-.js";
import { a as createLucideIcon, c as cn } from "./createLucideIcon-DznkbKl0.js";
import { L as Layout } from "./Layout-nvSnPD7h.js";
import { b as useSetReady, c as useStartGame, d as useLeaveLobby } from "./useLobbyActions-xa19psm_.js";
import { m as motion } from "./proxy-B4UgcTtO.js";
import "./backend-BxTSFiBD.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
function LobbyRoomPage() {
  const { code } = useParams({ from: "/lobby/$code" });
  const { lobbyState, myPlayerId } = useGameStore();
  const [copied, setCopied] = reactExports.useState(false);
  useLobbyPolling(code);
  const setReady = useSetReady();
  const startGame = useStartGame();
  const leaveLobby = useLeaveLobby();
  const lobby = lobbyState;
  const players = (lobby == null ? void 0 : lobby.players) ?? [];
  const me = players.find((p) => p.id.toText() === myPlayerId) ?? players[0] ?? null;
  const isHost = me != null && (lobby == null ? void 0 : lobby.hostId.toText()) === me.id.toText();
  const amReady = (me == null ? void 0 : me.isReady) ?? false;
  const readyCount = players.filter((p) => p.isReady).length;
  const canStart = isHost && readyCount >= 2;
  const maxPlayers = lobby ? Number(lobby.maxPlayers) : 8;
  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      ue.success("Lobby code copied!");
      setTimeout(() => setCopied(false), 2e3);
    });
  }
  function toggleReady() {
    if (!lobby) return;
    setReady.mutate({ code: lobby.code, ready: !amReady });
  }
  function handleStart() {
    if (!lobby) return;
    startGame.mutate(lobby.code);
  }
  function handleLeave() {
    if (!lobby) return;
    leaveLobby.mutate(lobby.code);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      className: "w-full max-w-2xl",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-3xl shadow-lg overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-8 py-6 flex flex-col items-center gap-3 text-center",
              style: {
                background: "linear-gradient(135deg, oklch(var(--primary) / 0.12) 0%, oklch(var(--accent) / 0.12) 100%)",
                borderBottom: "1px solid oklch(var(--border))"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "🎲" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-extrabold text-foreground", children: "Game Lobby" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 px-5 py-2.5 bg-card rounded-2xl border-2 border-primary shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-2xl tracking-[0.25em] text-primary", children: code }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: copyCode,
                      "aria-label": "Copy lobby code",
                      "data-ocid": "btn-copy-code",
                      className: "w-11 h-11 flex items-center justify-center rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-smooth",
                      children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4 text-muted-foreground" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Share this code with friends to invite them" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-8 py-4 border-b border-border bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                players.length,
                "/",
                maxPlayers,
                " players"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-accent animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                readyCount,
                " ready"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 space-y-3", "data-ocid": "players-list", children: [
            !lobby ? (
              // Loading skeletons
              [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-4 p-4 rounded-2xl border border-border",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-full" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32 rounded" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20 rounded" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-20 rounded-full" })
                  ]
                },
                i
              ))
            ) : players.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-8 text-muted-foreground",
                "data-ocid": "empty-players",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl mb-2", children: "👀" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Waiting for players to join…" })
                ]
              }
            ) : players.map((player, idx) => {
              const isMe = (me == null ? void 0 : me.id.toText()) === player.id.toText();
              const isPlayerHost = lobby.hostId.toText() === player.id.toText();
              const avatarEmoji = getAvatarEmoji(player.avatarId);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, x: -16 },
                  animate: { opacity: 1, x: 0 },
                  transition: { duration: 0.3, delay: idx * 0.06 },
                  "data-ocid": `player-row-${idx}`,
                  className: `flex items-center gap-4 p-4 rounded-2xl border-2 transition-smooth ${isMe ? "border-primary/40 bg-primary/5" : "border-border bg-background"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      PlayerAvatar,
                      {
                        avatarId: player.avatarId,
                        username: player.username,
                        playerIndex: idx,
                        size: "md",
                        isActive: player.isReady
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground truncate", children: player.username }),
                        isMe && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "outline",
                            className: "text-xs border-primary text-primary shrink-0",
                            children: "You"
                          }
                        ),
                        isPlayerHost && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            title: "Host",
                            className: "shrink-0",
                            "aria-label": "Host",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-4 h-4 text-chart-3 fill-chart-3" })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                        "Token: ",
                        avatarEmoji
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-semibold transition-smooth ${player.isReady ? "bg-accent/15 text-accent border border-accent/30" : "bg-muted text-muted-foreground border border-border"}`,
                        "data-ocid": `player-ready-${idx}`,
                        children: player.isReady ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }),
                          "Ready"
                        ] }) : "Waiting…"
                      }
                    )
                  ]
                },
                player.id.toText()
              );
            }),
            lobby && Array.from({
              length: Math.max(0, maxPlayers - players.length)
            }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-border/50 opacity-50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl", children: "👤" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body italic", children: "Waiting for player…" })
                ]
              },
              `slot-${players.length + i}`
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-6 pt-2 space-y-3", children: [
            !isHost && me && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: toggleReady,
                disabled: setReady.isPending,
                variant: amReady ? "outline" : "default",
                className: `w-full h-12 rounded-2xl font-display font-bold text-base transition-smooth ${amReady ? "border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground" : "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"}`,
                "data-ocid": "btn-ready",
                children: setReady.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
                  "Updating…"
                ] }) : amReady ? "✋ Cancel Ready" : "✅ Ready Up!"
              }
            ),
            isHost && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: toggleReady,
                  disabled: setReady.isPending,
                  variant: amReady ? "outline" : "default",
                  className: `w-full h-12 rounded-2xl font-display font-bold text-base transition-smooth ${amReady ? "border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground" : "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"}`,
                  "data-ocid": "btn-ready-host",
                  children: amReady ? "✋ Cancel Ready" : "✅ Ready Up!"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: handleStart,
                  disabled: !canStart || startGame.isPending,
                  className: "w-full h-13 rounded-2xl font-display font-bold text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                  "data-ocid": "btn-start-game",
                  children: startGame.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" }),
                    "Starting…"
                  ] }) : !canStart ? `🕐 Need ${Math.max(0, 2 - readyCount)} more ready (${readyCount}/2)` : "🎲 Start Game!"
                }
              ),
              !canStart && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "At least 2 players must be ready to start" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleLeave,
                disabled: leaveLobby.isPending,
                className: "w-full text-sm text-muted-foreground hover:text-destructive transition-smooth text-center py-1",
                "data-ocid": "btn-leave-lobby",
                children: leaveLobby.isPending ? "Leaving…" : "← Leave lobby"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.p,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.5 },
            className: "text-center text-xs text-muted-foreground mt-4",
            children: [
              "Share code",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-foreground", children: code }),
              " ",
              "with friends to join this game"
            ]
          }
        )
      ]
    }
  ) }) });
}
export {
  LobbyRoomPage as default
};
