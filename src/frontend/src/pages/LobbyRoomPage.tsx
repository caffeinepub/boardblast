import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { Check, Copy, Crown, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { PlayerAvatar } from "../components/ui/PlayerAvatar";
import { useLobbyPolling } from "../hooks/useGamePolling";
import {
  useLeaveLobby,
  useSetReady,
  useStartGame,
} from "../hooks/useLobbyActions";
import { useGameStore } from "../store/gameStore";
import { getAvatarEmoji } from "../types/game";

export default function LobbyRoomPage() {
  const { code } = useParams({ from: "/lobby/$code" });
  const { lobbyState, myPlayerId } = useGameStore();
  const [copied, setCopied] = useState(false);

  // Poll lobby every 2–3s
  useLobbyPolling(code);

  const setReady = useSetReady();
  const startGame = useStartGame();
  const leaveLobby = useLeaveLobby();

  const lobby = lobbyState;
  const players = lobby?.players ?? [];

  // Determine my player entry
  const me =
    players.find((p) => p.id.toText() === myPlayerId) ?? players[0] ?? null;
  const isHost = me != null && lobby?.hostId.toText() === me.id.toText();
  const amReady = me?.isReady ?? false;
  const readyCount = players.filter((p) => p.isReady).length;
  const canStart = isHost && readyCount >= 2;
  const maxPlayers = lobby ? Number(lobby.maxPlayers) : 8;

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      toast.success("Lobby code copied!");
      setTimeout(() => setCopied(false), 2000);
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

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl"
        >
          {/* Header card */}
          <div className="bg-card border border-border rounded-3xl shadow-lg overflow-hidden">
            {/* Top banner */}
            <div
              className="px-8 py-6 flex flex-col items-center gap-3 text-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--primary) / 0.12) 0%, oklch(var(--accent) / 0.12) 100%)",
                borderBottom: "1px solid oklch(var(--border))",
              }}
            >
              <div className="text-4xl">🎲</div>
              <h1 className="text-2xl font-display font-extrabold text-foreground">
                Game Lobby
              </h1>

              {/* Lobby code */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-card rounded-2xl border-2 border-primary shadow-sm">
                  <span className="font-mono font-bold text-2xl tracking-[0.25em] text-primary">
                    {code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyCode}
                  aria-label="Copy lobby code"
                  data-ocid="btn-copy-code"
                  className="w-11 h-11 flex items-center justify-center rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-smooth"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this code with friends to invite them
              </p>
            </div>

            {/* Player count */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>
                  {players.length}/{maxPlayers} players
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  {readyCount} ready
                </span>
              </div>
            </div>

            {/* Players list */}
            <div className="px-6 py-4 space-y-3" data-ocid="players-list">
              {!lobby ? (
                // Loading skeletons
                [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-border"
                  >
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </div>
                ))
              ) : players.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="empty-players"
                >
                  <div className="text-3xl mb-2">👀</div>
                  <p className="text-sm">Waiting for players to join…</p>
                </div>
              ) : (
                players.map((player, idx) => {
                  const isMe = me?.id.toText() === player.id.toText();
                  const isPlayerHost =
                    lobby.hostId.toText() === player.id.toText();
                  const avatarEmoji = getAvatarEmoji(player.avatarId);

                  return (
                    <motion.div
                      key={player.id.toText()}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.06 }}
                      data-ocid={`player-row-${idx}`}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-smooth ${
                        isMe
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-background"
                      }`}
                    >
                      {/* Avatar */}
                      <PlayerAvatar
                        avatarId={player.avatarId}
                        username={player.username}
                        playerIndex={idx}
                        size="md"
                        isActive={player.isReady}
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-display font-bold text-foreground truncate">
                            {player.username}
                          </p>
                          {isMe && (
                            <Badge
                              variant="outline"
                              className="text-xs border-primary text-primary shrink-0"
                            >
                              You
                            </Badge>
                          )}
                          {isPlayerHost && (
                            <span
                              title="Host"
                              className="shrink-0"
                              aria-label="Host"
                            >
                              <Crown className="w-4 h-4 text-chart-3 fill-chart-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Token: {avatarEmoji}
                        </p>
                      </div>

                      {/* Ready status */}
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-semibold transition-smooth ${
                          player.isReady
                            ? "bg-accent/15 text-accent border border-accent/30"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                        data-ocid={`player-ready-${idx}`}
                      >
                        {player.isReady ? (
                          <>
                            <Check className="w-3 h-3" />
                            Ready
                          </>
                        ) : (
                          "Waiting…"
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* Empty slots */}
              {lobby &&
                Array.from({
                  length: Math.max(0, maxPlayers - players.length),
                }).map((_, i) => (
                  <div
                    key={`slot-${players.length + i}`}
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-border/50 opacity-50"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">
                      👤
                    </div>
                    <p className="text-sm text-muted-foreground font-body italic">
                      Waiting for player…
                    </p>
                  </div>
                ))}
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 pt-2 space-y-3">
              {/* Ready Up toggle for non-host */}
              {!isHost && me && (
                <Button
                  onClick={toggleReady}
                  disabled={setReady.isPending}
                  variant={amReady ? "outline" : "default"}
                  className={`w-full h-12 rounded-2xl font-display font-bold text-base transition-smooth ${
                    amReady
                      ? "border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                      : "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"
                  }`}
                  data-ocid="btn-ready"
                >
                  {setReady.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      Updating…
                    </span>
                  ) : amReady ? (
                    "✋ Cancel Ready"
                  ) : (
                    "✅ Ready Up!"
                  )}
                </Button>
              )}

              {/* Host ready + start */}
              {isHost && (
                <>
                  <Button
                    onClick={toggleReady}
                    disabled={setReady.isPending}
                    variant={amReady ? "outline" : "default"}
                    className={`w-full h-12 rounded-2xl font-display font-bold text-base transition-smooth ${
                      amReady
                        ? "border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                        : "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"
                    }`}
                    data-ocid="btn-ready-host"
                  >
                    {amReady ? "✋ Cancel Ready" : "✅ Ready Up!"}
                  </Button>
                  <Button
                    onClick={handleStart}
                    disabled={!canStart || startGame.isPending}
                    className="w-full h-13 rounded-2xl font-display font-bold text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    data-ocid="btn-start-game"
                  >
                    {startGame.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                        Starting…
                      </span>
                    ) : !canStart ? (
                      `🕐 Need ${Math.max(0, 2 - readyCount)} more ready (${readyCount}/2)`
                    ) : (
                      "🎲 Start Game!"
                    )}
                  </Button>
                  {!canStart && (
                    <p className="text-center text-xs text-muted-foreground">
                      At least 2 players must be ready to start
                    </p>
                  )}
                </>
              )}

              {/* Leave lobby */}
              <button
                type="button"
                onClick={handleLeave}
                disabled={leaveLobby.isPending}
                className="w-full text-sm text-muted-foreground hover:text-destructive transition-smooth text-center py-1"
                data-ocid="btn-leave-lobby"
              >
                {leaveLobby.isPending ? "Leaving…" : "← Leave lobby"}
              </button>
            </div>
          </div>

          {/* Share tip */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-muted-foreground mt-4"
          >
            Share code{" "}
            <span className="font-mono font-bold text-foreground">{code}</span>{" "}
            with friends to join this game
          </motion.p>
        </motion.div>
      </div>
    </Layout>
  );
}
