import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Gavel, Trophy } from "lucide-react";
import { useState } from "react";
import { usePlaceBid, useResolveAuction } from "../../hooks/useGameActions";
import { useGameStore } from "../../store/gameStore";
import type {
  AuctionBid,
  AuctionStateView,
  GameSessionView,
  OwnedPropertyView,
} from "../../types/game";
import { formatMoney, getPlayerColor } from "../../types/game";
import { PlayerAvatar } from "../ui/PlayerAvatar";

interface AuctionModalProps {
  gameId: string;
  auction: AuctionStateView;
  session: GameSessionView;
  onClose: () => void;
}

export function AuctionModal({
  gameId,
  auction,
  session,
  onClose,
}: AuctionModalProps) {
  const [bidAmount, setBidAmount] = useState("");
  const placeBid = usePlaceBid();
  const resolveAuction = useResolveAuction();
  const { myPlayerId } = useGameStore();

  const deed = session.ownedProperties.find(
    (p: OwnedPropertyView) => p.spaceId === auction.spaceId,
  )?.deed;

  const spaceInfo = deed ? deed.name : `Space #${auction.spaceId.toString()}`;

  const highestBid =
    auction.bids.length > 0
      ? auction.bids.reduce((max: AuctionBid, b: AuctionBid) =>
          b.amount > max.amount ? b : max,
        )
      : null;

  const myBid = myPlayerId
    ? auction.bids.find((b: AuctionBid) => b.bidderId.toString() === myPlayerId)
    : null;

  const allPlayersHaveBid =
    session.players.filter((p) => !p.isBankrupt).length <= auction.bids.length;

  const handleBid = () => {
    const amount = BigInt(Math.floor(Number(bidAmount)));
    if (amount <= 0n) return;
    placeBid.mutate({ gameId, amount });
    setBidAmount("");
  };

  const handleResolve = () => {
    resolveAuction.mutate(gameId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="auction-modal"
    >
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <dialog
        open
        className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-0 border-0 m-0"
        aria-label="Property Auction"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-5 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-card/20 flex items-center justify-center">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg">Auction!</h2>
              <p className="text-primary-foreground/80 text-sm">{spaceInfo}</p>
            </div>
            {auction.isOpen && (
              <div className="ml-auto flex items-center gap-1.5 bg-card/20 rounded-full px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold">LIVE</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Current highest bid */}
          <div className="bg-muted/40 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Current Highest Bid
            </p>
            {highestBid ? (
              <>
                <div className="text-3xl font-display font-extrabold text-primary">
                  {formatMoney(highestBid.amount)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  by{" "}
                  {session.players.find(
                    (p) => p.id.toString() === highestBid.bidderId.toString(),
                  )?.username ?? "Unknown"}
                </div>
              </>
            ) : (
              <div className="text-2xl font-display font-bold text-muted-foreground">
                No bids yet
              </div>
            )}
          </div>

          {/* Bidders list */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              All Bids
            </p>
            {auction.bids.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                Waiting for bids…
              </p>
            )}
            {auction.bids
              .slice()
              .sort((a: AuctionBid, b: AuctionBid) =>
                a.amount > b.amount ? -1 : 1,
              )
              .map((bid: AuctionBid, i: number) => {
                const player = session.players.find(
                  (p) => p.id.toString() === bid.bidderId.toString(),
                );
                const isHighest = i === 0;
                return (
                  <div
                    key={bid.bidderId.toString()}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl",
                      isHighest
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-muted/30",
                    )}
                  >
                    {isHighest && (
                      <Trophy className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                    <PlayerAvatar
                      avatarId={player?.avatarId ?? 0n}
                      playerIndex={session.players.indexOf(player!)}
                      size="xs"
                    />
                    <span className="flex-1 text-sm font-medium truncate">
                      {player?.username ?? "Player"}
                    </span>
                    <span
                      className={cn(
                        "font-bold tabular-nums text-sm",
                        isHighest ? "text-primary" : "text-foreground",
                      )}
                    >
                      {formatMoney(bid.amount)}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* My bid input */}
          {auction.isOpen && !myBid && (
            <div className="space-y-2" data-ocid="auction-bid-form">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Your Bid
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                    $
                  </span>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Enter amount"
                    className="pl-7"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    data-ocid="auction-bid-input"
                    onKeyDown={(e) => e.key === "Enter" && handleBid()}
                  />
                </div>
                <Button
                  onClick={handleBid}
                  disabled={
                    !bidAmount || Number(bidAmount) <= 0 || placeBid.isPending
                  }
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                  data-ocid="place-bid-btn"
                >
                  <Gavel className="w-4 h-4 mr-1" />
                  Bid
                </Button>
              </div>
            </div>
          )}

          {myBid && (
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 text-center">
              <p className="text-sm font-medium text-accent">
                Your bid: {formatMoney(myBid.amount)} ✓
              </p>
            </div>
          )}

          {/* Resolve button */}
          {allPlayersHaveBid && (
            <Button
              onClick={handleResolve}
              disabled={resolveAuction.isPending}
              className="w-full bg-primary text-primary-foreground font-bold"
              data-ocid="resolve-auction-btn"
            >
              🔨 Resolve Auction
            </Button>
          )}
        </div>
      </dialog>
    </div>
  );
}
