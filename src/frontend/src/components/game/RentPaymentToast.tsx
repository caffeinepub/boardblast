import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import type { PlayerStateView } from "../../types/game";
import { formatMoney } from "../../types/game";
import { PlayerAvatar } from "../ui/PlayerAvatar";

interface RentPaymentToastProps {
  payer: PlayerStateView;
  owner: PlayerStateView;
  amount: bigint;
  payerIndex: number;
  ownerIndex: number;
  onDone?: () => void;
}

export function RentPaymentToast({
  payer,
  owner,
  amount,
  payerIndex,
  ownerIndex,
  onDone,
}: RentPaymentToastProps) {
  const [phase, setPhase] = useState<"enter" | "fly" | "exit">("enter");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setPhase("fly"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 1800);
    const t3 = setTimeout(() => onDone?.(), 2400);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <output
      className={cn(
        "fixed top-20 left-1/2 -translate-x-1/2 z-[60] pointer-events-none",
        "transition-all duration-500",
        phase === "enter" && "opacity-0 scale-75 translate-y-4",
        phase === "fly" && "opacity-100 scale-100 translate-y-0",
        phase === "exit" && "opacity-0 scale-90 -translate-y-4",
      )}
      data-ocid="rent-payment-toast"
      aria-live="polite"
      aria-label={`${payer.username} paid ${formatMoney(amount)} rent to ${owner.username}`}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-4 min-w-[280px]">
        {/* Payer */}
        <div className="flex flex-col items-center gap-1">
          <PlayerAvatar
            avatarId={payer.avatarId}
            playerIndex={payerIndex}
            size="sm"
          />
          <span className="text-xs text-muted-foreground truncate max-w-[4rem]">
            {payer.username}
          </span>
        </div>

        {/* Flying money */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div
            className={cn(
              "text-2xl transition-transform duration-700",
              phase === "fly" && "translate-x-6",
            )}
          >
            💸
          </div>
          <div className="text-center">
            <span className="font-display font-extrabold text-destructive text-lg leading-none">
              {formatMoney(amount)}
            </span>
            <p className="text-xs text-muted-foreground">Rent paid</p>
          </div>
        </div>

        {/* Owner */}
        <div className="flex flex-col items-center gap-1">
          <PlayerAvatar
            avatarId={owner.avatarId}
            playerIndex={ownerIndex}
            size="sm"
          />
          <span className="text-xs text-muted-foreground truncate max-w-[4rem]">
            {owner.username}
          </span>
        </div>
      </div>
    </output>
  );
}
