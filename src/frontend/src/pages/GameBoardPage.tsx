import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate, useParams } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuctionModal } from "../components/game/AuctionModal";
import { DiceComponent } from "../components/game/DiceComponent";
import { BOARD_SPACES, GameBoard } from "../components/game/GameBoard";
import { PlayerSidebar } from "../components/game/PlayerSidebar";
import {
  useBuyProperty,
  useEndTurn,
  useMortgageProperty,
  usePassOnProperty,
  usePayJailFine,
  useRollAndMove,
  useUpgradeProperty,
  useUseGetOutOfJailCard,
} from "../hooks/useGameActions";
import { useGamePolling } from "../hooks/useGamePolling";
import { useGameStore } from "../store/gameStore";
import type {
  AuctionStateView,
  GameId,
  GameSessionView,
  JailStatus,
} from "../types/game";

// ─── Action panel ─────────────────────────────────────────────────────────────

interface ActionPanelProps {
  gameId: GameId;
  session: NonNullable<GameSessionView>;
  isMyTurn: boolean;
  myPlayerId: string | null;
}

function ActionPanel({
  gameId,
  session,
  isMyTurn,
  myPlayerId,
}: ActionPanelProps) {
  const phase = session.turnPhase.__kind__;
  const myPlayer = session.players.find((p) => String(p.id) === myPlayerId);
  const jailStatus = myPlayer?.jailStatus as JailStatus | undefined;
  const inJail = jailStatus?.__kind__ === "inJail";
  const hasJailCard =
    inJail && jailStatus.__kind__ === "inJail"
      ? (jailStatus as Extract<JailStatus, { __kind__: "inJail" }>).inJail
          .hasGetOutCard
      : false;

  const rollMut = useRollAndMove();
  const buyMut = useBuyProperty();
  const passMut = usePassOnProperty();
  const endTurnMut = useEndTurn();
  const payJailMut = usePayJailFine();
  const jailCardMut = useUseGetOutOfJailCard();
  const upgradeMut = useUpgradeProperty();
  const mortgageMut = useMortgageProperty();

  const isDiceRolling = useGameStore((s) => s.uiState.isDiceAnimating);
  const die1 = session.lastDiceRoll ? Number(session.lastDiceRoll.die1) : 0;
  const die2 = session.lastDiceRoll ? Number(session.lastDiceRoll.die2) : 0;

  const currentPlayer = session.players[Number(session.currentPlayerIndex)];
  const currentSpaceId = currentPlayer
    ? BigInt(Number(currentPlayer.position))
    : 0n;

  const handleRoll = useCallback(() => {
    rollMut.mutate(gameId);
  }, [rollMut, gameId]);

  const handleBuy = useCallback(() => {
    buyMut.mutate({ gameId, spaceId: currentSpaceId });
  }, [buyMut, gameId, currentSpaceId]);

  const handlePass = useCallback(() => {
    passMut.mutate({ gameId, spaceId: currentSpaceId });
  }, [passMut, gameId, currentSpaceId]);

  const handleEndTurn = useCallback(() => {
    endTurnMut.mutate(gameId);
  }, [endTurnMut, gameId]);

  if (!isMyTurn) {
    return (
      <div className="flex flex-col items-center gap-3 p-4">
        <DiceComponent
          die1={die1}
          die2={die2}
          isRolling={isDiceRolling}
          isMyTurn={false}
        />
        <p className="text-sm text-muted-foreground font-body text-center">
          Waiting for {currentPlayer?.username ?? "other player"}…
        </p>
      </div>
    );
  }

  // Determine if current space is already owned by another player
  const landedOwned =
    phase === "landAndAct"
      ? session.ownedProperties.find((p) => p.spaceId === currentSpaceId)
      : null;
  const landedOwner = landedOwned
    ? session.players.find(
        (pl) => pl.id.toString() === landedOwned.ownerId.toString(),
      )
    : null;
  const rentEstimate = landedOwned
    ? Number(landedOwned.deed.rentBase) *
      Math.max(1, Number(landedOwned.upgradeLevel))
    : 0;

  return (
    <div className="flex flex-col gap-3 p-3" data-ocid="action-panel">
      {/* Dice section */}
      <div className="bg-card rounded-2xl p-3 border-2 border-border shadow-sm">
        <DiceComponent
          die1={die1}
          die2={die2}
          isRolling={isDiceRolling}
          onRoll={phase === "roll" ? handleRoll : undefined}
          isMyTurn={phase === "roll"}
          disabled={rollMut.isPending}
        />
      </div>

      {/* Jail options */}
      {inJail && phase === "roll" && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-display font-bold text-center text-destructive">
            🔒 You are in Jail!
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="flex-1 rounded-xl text-xs font-bold"
              onClick={() => payJailMut.mutate(gameId)}
              disabled={payJailMut.isPending}
              data-ocid="pay-jail-btn"
            >
              💰 Pay $50
            </Button>
            {hasJailCard && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="flex-1 rounded-xl text-xs font-bold"
                onClick={() => jailCardMut.mutate(gameId)}
                disabled={jailCardMut.isPending}
                data-ocid="jail-card-btn"
              >
                🃏 Use Card
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Buy / Pass — only if space is unowned */}
      {phase === "landAndAct" && !landedOwned && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-display font-bold text-center text-foreground">
            Buy this property?
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              className="flex-1 rounded-xl font-bold"
              onClick={handleBuy}
              disabled={buyMut.isPending}
              data-ocid="buy-property-btn"
            >
              🏠 Buy!
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl font-bold"
              onClick={handlePass}
              disabled={passMut.isPending}
              data-ocid="pass-property-btn"
            >
              Pass
            </Button>
          </div>
        </div>
      )}

      {/* Owned space info — pay rent */}
      {phase === "landAndAct" && landedOwned && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-display font-bold text-center text-destructive">
            Owned by {landedOwner?.username ?? "another player"}
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Rent: ${rentEstimate.toLocaleString()}
          </p>
          <Button
            type="button"
            className="w-full rounded-xl font-bold"
            onClick={handleEndTurn}
            disabled={endTurnMut.isPending}
            data-ocid="pay-rent-end-turn-btn"
          >
            Pay Rent & End Turn
          </Button>
        </div>
      )}

      {/* End turn */}
      {phase === "endTurn" && (
        <Button
          type="button"
          className="w-full rounded-xl font-bold"
          onClick={handleEndTurn}
          disabled={endTurnMut.isPending}
          data-ocid="end-turn-btn"
        >
          End Turn ✅
        </Button>
      )}

      {/* Quick management: upgrade / mortgage first owned property */}
      {phase === "endTurn" && myPlayer && myPlayer.ownedSpaces.length > 0 && (
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="flex-1 rounded-xl text-xs"
            onClick={() => {
              const sp = myPlayer.ownedSpaces[0];
              if (sp !== undefined) upgradeMut.mutate({ gameId, spaceId: sp });
            }}
            disabled={upgradeMut.isPending}
            data-ocid="upgrade-property-btn"
          >
            🏗️ Upgrade
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="flex-1 rounded-xl text-xs"
            onClick={() => {
              const sp = myPlayer.ownedSpaces[0];
              if (sp !== undefined) mortgageMut.mutate({ gameId, spaceId: sp });
            }}
            disabled={mortgageMut.isPending}
            data-ocid="mortgage-property-btn"
          >
            📑 Mortgage
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GameBoardPage() {
  const { gameId } = useParams({ from: "/game/$gameId" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const myPlayerId = identity ? String(identity.getPrincipal()) : null;

  const { gameSession: session, setMyPlayerId } = useGameStore();
  const [selectedSpaceId, setSelectedSpaceId] = useState<bigint | null>(null);

  // Populate store with local player id so modals can read it
  useEffect(() => {
    setMyPlayerId(myPlayerId);
  }, [myPlayerId, setMyPlayerId]);

  useGamePolling(gameId ?? null);

  const isMyTurn =
    !!session &&
    (() => {
      const curPlayer = session.players[Number(session.currentPlayerIndex)];
      return curPlayer ? String(curPlayer.id) === myPlayerId : false;
    })();

  // Navigate to result when game is finished
  if (session?.status.__kind__ === "finished") {
    void navigate({ to: `/game/${gameId}/result` });
    return null;
  }

  if (!session) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="board-loading"
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="text-5xl"
          >
            🎲
          </motion.div>
          <p className="font-display font-bold text-foreground">
            Loading game…
          </p>
        </div>
      </div>
    );
  }

  const currentPlayer = session.players[Number(session.currentPlayerIndex)];
  const phaseLabel: Record<string, string> = {
    roll: "Roll Dice",
    move: "Moving…",
    landAndAct: "Buy or Pass?",
    auction: "Auction!",
    endTurn: "End Turn",
  };

  const selectedSpace =
    selectedSpaceId !== null
      ? BOARD_SPACES.find((s) => s.id === Number(selectedSpaceId))
      : null;
  const ownedProp =
    selectedSpaceId !== null
      ? session.ownedProperties.find((p) => p.spaceId === selectedSpaceId)
      : null;
  const ownerPlayer = ownedProp
    ? session.players.find((p) => String(p.id) === String(ownedProp.ownerId))
    : null;

  const auctionState =
    session.turnPhase.__kind__ === "auction"
      ? (
          session.turnPhase as {
            __kind__: "auction";
            auction: AuctionStateView;
          }
        ).auction
      : null;

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="game-board-page"
    >
      {/* Top bar */}
      <header className="bg-card border-b-2 border-border px-4 py-2 flex items-center gap-3 shadow-sm flex-shrink-0">
        <span className="text-xl select-none">🎲</span>
        <span className="font-display font-black text-lg text-foreground flex-1">
          BoardBlast
        </span>
        <Badge
          variant="outline"
          className="font-bold text-xs border-primary text-primary"
        >
          {currentPlayer?.username ?? "—"} —{" "}
          {phaseLabel[session.turnPhase.__kind__] ?? session.turnPhase.__kind__}
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground text-xs rounded-xl"
          onClick={() => {
            toast.info("Returning to home…");
            void navigate({ to: "/" });
          }}
          data-ocid="leave-game-btn"
        >
          Leave
        </Button>
      </header>

      {/* Main 3-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Actions */}
        <aside
          className="w-52 flex-shrink-0 bg-card border-r-2 border-border overflow-y-auto"
          data-ocid="action-sidebar"
        >
          <ActionPanel
            gameId={gameId}
            session={session}
            isMyTurn={isMyTurn}
            myPlayerId={myPlayerId}
          />
        </aside>

        {/* Center: Board */}
        <main className="flex-1 flex items-center justify-center p-4 bg-background overflow-hidden min-w-0">
          <div className="w-full max-w-[min(100%,70vh)] aspect-square">
            <GameBoard
              session={session}
              myPlayerId={myPlayerId}
              onSpaceClick={(id) =>
                setSelectedSpaceId(id === selectedSpaceId ? null : id)
              }
            />
          </div>
        </main>

        {/* Right: Players */}
        <aside
          className="w-52 flex-shrink-0 bg-card border-l-2 border-border overflow-y-auto p-3"
          data-ocid="player-sidebar-container"
        >
          <PlayerSidebar session={session} myPlayerId={myPlayerId} />
        </aside>
      </div>

      {/* Selected space info bar */}
      <AnimatePresence>
        {selectedSpace && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border-2 border-border rounded-2xl shadow-xl px-5 py-3 flex items-center gap-4 z-50"
            data-ocid="space-info-banner"
          >
            <div>
              <p className="font-display font-black text-base text-foreground">
                {selectedSpace.name}
              </p>
              {selectedSpace.purchasePrice != null && (
                <p className="text-sm text-muted-foreground">
                  {ownedProp
                    ? `Owned by ${ownerPlayer?.username ?? "unknown"} · Level ${Number(ownedProp.upgradeLevel)}`
                    : `$${selectedSpace.purchasePrice}`}
                </p>
              )}
            </div>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground text-xl leading-none"
              onClick={() => setSelectedSpaceId(null)}
              aria-label="Close space info"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auction Modal — shown whenever the turn phase is 'auction' */}
      {auctionState && (
        <AuctionModal
          gameId={gameId}
          auction={auctionState}
          session={session}
          onClose={() => {
            /* auction resolves automatically via backend */
          }}
        />
      )}
    </div>
  );
}
