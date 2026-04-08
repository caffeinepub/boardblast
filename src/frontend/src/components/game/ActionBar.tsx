import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftRight, Building2, Dice6, SkipForward } from "lucide-react";
import { useRollAndMove } from "../../hooks/useGameActions";
import { useGameStore } from "../../store/gameStore";
import type { GameSessionView, PlayerStateView } from "../../types/game";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { PlayerAvatar } from "../ui/PlayerAvatar";

interface ActionBarProps {
  gameId: string;
  session: GameSessionView;
  currentPlayer: PlayerStateView;
  isMyTurn: boolean;
  onEndTurn: () => void;
  onOpenManage: () => void;
  onOpenTrade: () => void;
}

function DiceFace({ value }: { value: number }) {
  const dots: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [
      [25, 25],
      [75, 75],
    ],
    3: [
      [25, 25],
      [50, 50],
      [75, 75],
    ],
    4: [
      [25, 25],
      [75, 25],
      [25, 75],
      [75, 75],
    ],
    5: [
      [25, 25],
      [75, 25],
      [50, 50],
      [25, 75],
      [75, 75],
    ],
    6: [
      [25, 20],
      [75, 20],
      [25, 50],
      [75, 50],
      [25, 80],
      [75, 80],
    ],
  };
  const positions = dots[value] ?? [];
  return (
    <div className="relative w-8 h-8 bg-card rounded-md shadow-sm border border-border flex-shrink-0">
      {positions.map(([x, y]) => (
        <div
          key={`${x}-${y}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-foreground"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%,-50%)",
          }}
        />
      ))}
    </div>
  );
}

const PHASES = ["roll", "move", "landAndAct", "endTurn"] as const;
type Phase = (typeof PHASES)[number];

export function ActionBar({
  gameId,
  session,
  currentPlayer,
  isMyTurn,
  onEndTurn,
  onOpenManage,
  onOpenTrade,
}: ActionBarProps) {
  const rollAndMove = useRollAndMove();
  const { uiState } = useGameStore();

  const phase = session.turnPhase.__kind__;
  const lastDice = session.lastDiceRoll;

  const canRoll = isMyTurn && (phase === "roll" || phase === "move");
  const canEndTurn = isMyTurn && phase === "endTurn";

  const playerIdx = session.players.indexOf(currentPlayer);
  const currentPhaseIdx = PHASES.indexOf(phase as Phase);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur border-t border-border shadow-2xl"
      data-ocid="action-bar"
    >
      <div className="container max-w-4xl mx-auto px-3 py-3">
        <div className="flex items-center gap-3">
          {/* Current player info */}
          <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <PlayerAvatar
              avatarId={currentPlayer.avatarId}
              playerIndex={playerIdx}
              size="sm"
              isActive={isMyTurn}
            />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground leading-none">
                {isMyTurn ? "Your turn" : `${currentPlayer.username}'s turn`}
              </p>
              <MoneyDisplay
                amount={currentPlayer.balance}
                size="sm"
                variant={currentPlayer.balance < 200n ? "loss" : "default"}
              />
            </div>
          </div>

          {/* Last dice roll */}
          {lastDice && (
            <div className="flex items-center gap-1.5 bg-muted/40 rounded-xl px-2.5 py-1.5 flex-shrink-0">
              <DiceFace value={Number(lastDice.die1)} />
              <DiceFace value={Number(lastDice.die2)} />
              <span className="text-xs font-bold tabular-nums ml-0.5">
                ={Number(lastDice.die1) + Number(lastDice.die2)}
              </span>
            </div>
          )}

          <div className="flex-1" />

          {/* Secondary actions */}
          <div className="flex items-center gap-2">
            {isMyTurn && (
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex gap-1.5 text-xs font-medium"
                onClick={onOpenManage}
                data-ocid="manage-properties-btn"
              >
                <Building2 className="w-3.5 h-3.5" />
                Manage
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-1.5 text-xs font-medium"
              onClick={onOpenTrade}
              data-ocid="trade-btn"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Trade
            </Button>

            {canRoll && (
              <Button
                onClick={() => rollAndMove.mutate(gameId)}
                disabled={rollAndMove.isPending || uiState.isDiceAnimating}
                className={cn(
                  "bg-primary text-primary-foreground font-display font-extrabold text-base px-5 h-11 rounded-xl shadow-lg hover:bg-primary/90 transition-smooth",
                  (rollAndMove.isPending || uiState.isDiceAnimating) &&
                    "animate-pulse-gentle",
                )}
                data-ocid="roll-dice-btn"
              >
                <Dice6 className="w-5 h-5 mr-1.5" />
                {uiState.isDiceAnimating ? "Rolling…" : "Roll Dice"}
              </Button>
            )}

            {canEndTurn && (
              <Button
                onClick={onEndTurn}
                className="bg-accent text-accent-foreground font-display font-bold text-base px-5 h-11 rounded-xl shadow-lg hover:bg-accent/90 transition-smooth"
                data-ocid="end-turn-btn"
              >
                <SkipForward className="w-5 h-5 mr-1.5" />
                End Turn
              </Button>
            )}

            {!canRoll && !canEndTurn && isMyTurn && (
              <div className="px-4 py-2 rounded-xl bg-muted/60 text-sm text-muted-foreground font-medium">
                {phase === "landAndAct" ? "Choose action…" : "Waiting…"}
              </div>
            )}

            {!isMyTurn && (
              <div className="px-4 py-2 rounded-xl bg-muted/40 text-sm text-muted-foreground font-medium">
                Waiting for {currentPlayer.username}…
              </div>
            )}
          </div>
        </div>

        {/* Phase indicator strip */}
        <div className="flex gap-1 mt-2 px-1">
          {PHASES.map((p, i) => (
            <div
              key={p}
              className={cn(
                "flex-1 h-1 rounded-full transition-smooth",
                p === phase
                  ? "bg-primary"
                  : i < currentPhaseIdx
                    ? "bg-primary/30"
                    : "bg-muted",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
