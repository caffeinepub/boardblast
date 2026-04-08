import { X } from "lucide-react";
import {
  usePayJailFine,
  useUseGetOutOfJailCard,
} from "../../hooks/useGameActions";
import type { GameSessionView, PlayerStateView } from "../../types/game";
import { formatMoney } from "../../types/game";

interface JailModalProps {
  gameId: string;
  player: PlayerStateView;
  session: GameSessionView;
  onRollForDoubles: () => void;
  onClose: () => void;
}

const JAIL_FINE = 50n;

export function JailModal({
  gameId,
  player,
  onRollForDoubles,
  onClose,
}: JailModalProps) {
  const payFine = usePayJailFine();
  const useCard = useUseGetOutOfJailCard();

  const jailInfo =
    player.jailStatus.__kind__ === "inJail" ? player.jailStatus.inJail : null;

  const hasCard = jailInfo?.hasGetOutCard ?? false;
  const turnsRemaining = jailInfo ? Number(jailInfo.turnsRemaining) : 0;

  const handlePayFine = () => {
    payFine.mutate(gameId);
    onClose();
  };

  const handleUseCard = () => {
    useCard.mutate(gameId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="jail-modal"
    >
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="presentation"
      />
      <dialog
        open
        className="relative bg-card rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-0 border-0 m-0"
        aria-label="Jail Options"
      >
        {/* Header */}
        <div className="bg-foreground p-5 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-card/20 flex items-center justify-center text-card hover:bg-card/40 transition-smooth"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex flex-col items-center gap-2">
            <div className="text-5xl">🔒</div>
            <h2 className="font-display font-extrabold text-2xl text-card">
              In Jail!
            </h2>
            <p className="text-card/70 text-sm">
              {turnsRemaining} turn{turnsRemaining !== 1 ? "s" : ""} remaining
            </p>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-sm text-muted-foreground text-center mb-4">
            Choose how to escape,{" "}
            <span className="font-bold text-foreground">{player.username}</span>
            !
          </p>

          {/* Pay fine */}
          <button
            type="button"
            onClick={handlePayFine}
            disabled={payFine.isPending || player.balance < JAIL_FINE}
            className="w-full flex items-center justify-between px-4 py-3 bg-destructive/10 border-2 border-destructive/30 rounded-xl hover:bg-destructive/20 hover:border-destructive/60 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            data-ocid="jail-pay-fine-btn"
          >
            <div className="text-left">
              <p className="font-bold text-foreground">💰 Pay Fine</p>
              <p className="text-xs text-muted-foreground">Immediate release</p>
            </div>
            <span className="font-display font-extrabold text-destructive text-lg">
              {formatMoney(JAIL_FINE)}
            </span>
          </button>

          {/* Use get out of jail card */}
          <button
            type="button"
            onClick={handleUseCard}
            disabled={!hasCard || useCard.isPending}
            className="w-full flex items-center justify-between px-4 py-3 bg-accent/10 border-2 border-accent/30 rounded-xl hover:bg-accent/20 hover:border-accent/60 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
            data-ocid="jail-use-card-btn"
          >
            <div className="text-left">
              <p className="font-bold text-foreground">🃏 Use Card</p>
              <p className="text-xs text-muted-foreground">
                {hasCard ? "Get Out of Jail Free" : "None in hand"}
              </p>
            </div>
            <span className="text-xl">{hasCard ? "✓" : "✗"}</span>
          </button>

          {/* Roll for doubles */}
          <button
            type="button"
            onClick={() => {
              onRollForDoubles();
              onClose();
            }}
            className="w-full flex items-center justify-between px-4 py-3 bg-primary/10 border-2 border-primary/30 rounded-xl hover:bg-primary/20 hover:border-primary/60 transition-smooth"
            data-ocid="jail-roll-doubles-btn"
          >
            <div className="text-left">
              <p className="font-bold text-foreground">🎲 Roll for Doubles</p>
              <p className="text-xs text-muted-foreground">
                Free if you roll doubles!
              </p>
            </div>
            <span className="text-xl">🎲</span>
          </button>
        </div>
      </dialog>
    </div>
  );
}
