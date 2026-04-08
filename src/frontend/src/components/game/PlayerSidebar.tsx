import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { GameSessionView, PlayerStateView } from "../../types/game";
import { PLAYER_COLORS } from "../../types/game";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { PlayerAvatar } from "../ui/PlayerAvatar";

interface PlayerCardProps {
  player: PlayerStateView;
  index: number;
  isCurrentTurn: boolean;
  isMe: boolean;
}

function PlayerCard({ player, index, isCurrentTurn, isMe }: PlayerCardProps) {
  const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
  const inJail = player.jailStatus.__kind__ === "inJail";
  const balance = Number(player.balance);

  return (
    <motion.div
      layout
      animate={{ opacity: player.isBankrupt ? 0.5 : 1 }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200",
        isCurrentTurn
          ? "border-primary bg-primary/5 shadow-md shadow-primary/20"
          : "border-border bg-card",
        isMe && "ring-2 ring-offset-1 ring-accent",
      )}
      data-ocid={`player-card-${index}`}
    >
      <div className="relative flex-shrink-0">
        <PlayerAvatar
          avatarId={player.avatarId}
          playerIndex={index}
          size="sm"
          isActive={isCurrentTurn}
          isBankrupt={player.isBankrupt}
        />
        {/* Colored dot */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card"
          style={{ backgroundColor: color.token }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={cn(
              "font-display font-bold text-sm truncate",
              isMe ? "text-accent-foreground" : "text-foreground",
            )}
          >
            {player.username}
          </span>
          {isMe && (
            <Badge
              variant="secondary"
              className="text-[9px] px-1 py-0 h-4 flex-shrink-0 font-bold"
            >
              YOU
            </Badge>
          )}
        </div>
        <MoneyDisplay
          amount={balance}
          size="sm"
          variant={balance < 200 ? "loss" : "default"}
        />
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-[10px] text-muted-foreground font-mono">
          {player.ownedSpaces.length}🏠
        </span>
        {inJail && (
          <Badge
            variant="destructive"
            className="text-[9px] px-1 py-0 h-4 font-bold"
          >
            JAIL
          </Badge>
        )}
        {player.isBankrupt && (
          <Badge
            variant="outline"
            className="text-[9px] px-1 py-0 h-4 font-bold text-muted-foreground"
          >
            💀
          </Badge>
        )}
        {isCurrentTurn && !player.isBankrupt && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        )}
      </div>
    </motion.div>
  );
}

interface PlayerSidebarProps {
  session: GameSessionView;
  myPlayerId: string | null;
}

export function PlayerSidebar({ session, myPlayerId }: PlayerSidebarProps) {
  const currentPlayerIdx = Number(session.currentPlayerIndex);
  const currentPlayer = session.players[currentPlayerIdx];

  const phaseLabel: Record<string, string> = {
    roll: "🎲 Roll Dice",
    move: "🚶 Moving…",
    landAndAct: "🤔 Buy or Pass?",
    auction: "🔨 Auction!",
    endTurn: "✅ End Turn",
  };

  const phaseText =
    phaseLabel[session.turnPhase.__kind__] ?? session.turnPhase.__kind__;

  return (
    <div className="flex flex-col gap-3 w-full" data-ocid="player-sidebar">
      {/* Turn indicator */}
      <div className="bg-card border-2 border-border rounded-2xl p-3 text-center shadow-sm">
        <p className="text-[10px] font-body text-muted-foreground uppercase tracking-widest mb-1">
          Current Turn
        </p>
        <p className="font-display font-black text-base text-foreground truncate">
          {currentPlayer?.username ?? "—"}
        </p>
        <div className="mt-1">
          <Badge className="text-xs font-bold bg-primary/10 text-primary border-primary/30 px-2">
            {phaseText}
          </Badge>
        </div>
      </div>

      {/* Players list */}
      <div className="flex flex-col gap-2">
        {session.players.map((player, idx) => (
          <PlayerCard
            key={String(player.id)}
            player={player}
            index={idx}
            isCurrentTurn={idx === currentPlayerIdx}
            isMe={String(player.id) === myPlayerId}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="bg-muted/40 rounded-xl p-2.5 text-[10px] text-muted-foreground text-center font-body">
        🏠 = owned properties
      </div>
    </div>
  );
}
