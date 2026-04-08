import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowLeftRight, Check, X } from "lucide-react";
import { useState } from "react";
import { TradeStatus } from "../../backend";
import {
  useAcceptTrade,
  useDeclineTrade,
  useProposeTrade,
} from "../../hooks/useGameActions";
import { useGameStore } from "../../store/gameStore";
import type {
  GameSessionView,
  OwnedPropertyView,
  PlayerStateView,
  SpaceId,
} from "../../types/game";
import { formatMoney } from "../../types/game";
import { PlayerAvatar } from "../ui/PlayerAvatar";

interface TradeModalProps {
  gameId: string;
  session: GameSessionView;
  onClose: () => void;
}

export function TradeModal({ gameId, session, onClose }: TradeModalProps) {
  const { myPlayerId } = useGameStore();
  const proposeTrade = useProposeTrade();
  const acceptTrade = useAcceptTrade();
  const declineTrade = useDeclineTrade();

  const me = session.players.find((p) => p.id.toString() === myPlayerId);
  const others = session.players.filter(
    (p) => p.id.toString() !== myPlayerId && !p.isBankrupt,
  );

  const [targetId, setTargetId] = useState<string>(
    others[0]?.id.toString() ?? "",
  );
  const [myOffer, setMyOffer] = useState<SpaceId[]>([]);
  const [myMoney, setMyMoney] = useState("");
  const [theirOffer, setTheirOffer] = useState<SpaceId[]>([]);
  const [theirMoney, setTheirMoney] = useState("");

  const target = session.players.find((p) => p.id.toString() === targetId);
  const incomingTrade = session.pendingTrade;
  const pendingIsForMe =
    incomingTrade &&
    incomingTrade.recipientId.toString() === myPlayerId &&
    incomingTrade.status === TradeStatus.pending;

  const myProps = session.ownedProperties.filter(
    (p: OwnedPropertyView) => p.ownerId.toString() === myPlayerId,
  );
  const theirProps = session.ownedProperties.filter(
    (p: OwnedPropertyView) => p.ownerId.toString() === targetId,
  );

  function toggleId(list: SpaceId[], id: SpaceId): SpaceId[] {
    return list.includes(id) ? list.filter((s) => s !== id) : [...list, id];
  }

  const handleSend = () => {
    if (!target) return;
    proposeTrade.mutate({
      gameId,
      recipientId: target.id,
      proposerSpaces: myOffer,
      proposerMoney: BigInt(myMoney || "0"),
      recipientSpaces: theirOffer,
      recipientMoney: BigInt(theirMoney || "0"),
    });
    onClose();
  };

  const handleAccept = () => {
    if (!incomingTrade) return;
    acceptTrade.mutate({ gameId, tradeId: incomingTrade.id });
    onClose();
  };

  const handleDecline = () => {
    if (!incomingTrade) return;
    declineTrade.mutate({ gameId, tradeId: incomingTrade.id });
    onClose();
  };

  const playerIdx = (p: PlayerStateView) => session.players.indexOf(p);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="trade-modal"
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="presentation"
      />
      <dialog
        open
        className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto p-0 border-0 m-0"
        aria-label="Trade"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-5 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-5 h-5 text-primary-foreground" />
            <span className="font-display font-extrabold text-lg text-primary-foreground">
              Trade
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-card/20 flex items-center justify-center text-primary-foreground hover:bg-card/40 transition-smooth"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Incoming trade notification */}
          {pendingIsForMe && incomingTrade && (
            <div
              className="bg-primary/10 border border-primary/30 rounded-xl p-4 space-y-3"
              data-ocid="incoming-trade"
            >
              <p className="font-bold text-sm text-primary">
                📬 Incoming Trade Offer
              </p>
              <div className="text-sm space-y-1">
                {incomingTrade.proposerMoney > 0n && (
                  <p className="text-muted-foreground">
                    They offer:{" "}
                    <span className="font-bold text-accent">
                      {formatMoney(incomingTrade.proposerMoney)}
                    </span>
                  </p>
                )}
                {incomingTrade.proposerSpaces.length > 0 && (
                  <p className="text-muted-foreground">
                    + {incomingTrade.proposerSpaces.length} propert
                    {incomingTrade.proposerSpaces.length === 1 ? "y" : "ies"}
                  </p>
                )}
                {incomingTrade.recipientMoney > 0n && (
                  <p className="text-muted-foreground">
                    They want:{" "}
                    <span className="font-bold text-destructive">
                      {formatMoney(incomingTrade.recipientMoney)}
                    </span>
                  </p>
                )}
                {incomingTrade.recipientSpaces.length > 0 && (
                  <p className="text-muted-foreground">
                    + {incomingTrade.recipientSpaces.length} of your propert
                    {incomingTrade.recipientSpaces.length === 1 ? "y" : "ies"}
                  </p>
                )}
              </div>
              <div className="flex gap-3" data-ocid="trade-response-btns">
                <Button
                  variant="outline"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  onClick={handleDecline}
                  data-ocid="trade-decline-btn"
                >
                  <X className="w-4 h-4 mr-1" /> Decline
                </Button>
                <Button
                  className="flex-1 bg-accent text-accent-foreground font-bold"
                  onClick={handleAccept}
                  data-ocid="trade-accept-btn"
                >
                  <Check className="w-4 h-4 mr-1" /> Accept
                </Button>
              </div>
            </div>
          )}

          {/* Propose new trade */}
          {me && (
            <div className="space-y-4">
              {/* Target player selector */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Trade with
                </p>
                <div className="flex gap-2 flex-wrap">
                  {others.map((p) => (
                    <button
                      type="button"
                      key={p.id.toString()}
                      onClick={() => setTargetId(p.id.toString())}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-smooth text-sm font-medium",
                        targetId === p.id.toString()
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted/30 text-foreground hover:border-primary/40",
                      )}
                      data-ocid="trade-target-player"
                    >
                      <PlayerAvatar
                        avatarId={p.avatarId}
                        playerIndex={playerIdx(p)}
                        size="xs"
                      />
                      {p.username}
                    </button>
                  ))}
                </div>
              </div>

              {/* Two-column trade builder */}
              <div className="grid grid-cols-2 gap-3">
                {/* My offer */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    You Offer
                  </p>
                  <div className="flex flex-wrap gap-1 min-h-[2rem]">
                    {myProps.map((p: OwnedPropertyView) => (
                      <button
                        type="button"
                        key={p.spaceId.toString()}
                        onClick={() => setMyOffer(toggleId(myOffer, p.spaceId))}
                        className={cn(
                          "px-2 py-1 rounded-lg text-xs font-medium border transition-smooth",
                          myOffer.includes(p.spaceId)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/40 text-foreground border-border hover:border-primary/40",
                        )}
                        data-ocid="my-offer-property"
                      >
                        {p.deed.name}
                      </button>
                    ))}
                    {myProps.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">
                        No properties
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Cash offer"
                      className="pl-6 text-sm h-8"
                      value={myMoney}
                      onChange={(e) => setMyMoney(e.target.value)}
                      data-ocid="my-offer-cash"
                    />
                  </div>
                </div>

                {/* Their offer */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    You Want
                  </p>
                  <div className="flex flex-wrap gap-1 min-h-[2rem]">
                    {theirProps.map((p: OwnedPropertyView) => (
                      <button
                        type="button"
                        key={p.spaceId.toString()}
                        onClick={() =>
                          setTheirOffer(toggleId(theirOffer, p.spaceId))
                        }
                        className={cn(
                          "px-2 py-1 rounded-lg text-xs font-medium border transition-smooth",
                          theirOffer.includes(p.spaceId)
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-muted/40 text-foreground border-border hover:border-accent/40",
                        )}
                        data-ocid="their-offer-property"
                      >
                        {p.deed.name}
                      </button>
                    ))}
                    {theirProps.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">
                        No properties
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Cash request"
                      className="pl-6 text-sm h-8"
                      value={theirMoney}
                      onChange={(e) => setTheirMoney(e.target.value)}
                      data-ocid="their-offer-cash"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSend}
                disabled={
                  proposeTrade.isPending ||
                  (!myOffer.length &&
                    !theirOffer.length &&
                    !myMoney &&
                    !theirMoney)
                }
                className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90"
                data-ocid="send-trade-btn"
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Send Offer to {target?.username ?? "Player"}
              </Button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
