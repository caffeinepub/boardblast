import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useBuyProperty, usePassOnProperty } from "../../hooks/useGameActions";
import type {
  GameSessionView,
  OwnedPropertyView,
  PropertyDeed,
} from "../../types/game";
import { formatMoney } from "../../types/game";

const COLOR_GROUP_MAP: Record<string, { bg: string; label: string }> = {
  brown: { bg: "bg-[#8B4513]", label: "Brown" },
  lightBlue: { bg: "bg-[#87CEEB]", label: "Light Blue" },
  pink: { bg: "bg-[#FF69B4]", label: "Pink" },
  orange: { bg: "bg-[#FFA500]", label: "Orange" },
  red: { bg: "bg-[#E53E3E]", label: "Red" },
  yellow: { bg: "bg-[#ECC94B]", label: "Yellow" },
  green: { bg: "bg-[#38A169]", label: "Green" },
  darkBlue: { bg: "bg-[#2B6CB0]", label: "Dark Blue" },
  railroad: { bg: "bg-foreground", label: "Railroad" },
  utility: { bg: "bg-[#805AD5]", label: "Utility" },
};

interface PropertyModalProps {
  gameId: string;
  spaceId: bigint;
  deed: PropertyDeed;
  session: GameSessionView;
  onClose: () => void;
}

function RentRow({
  label,
  amount,
  highlight,
}: {
  label: string;
  amount: bigint;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex justify-between items-center py-1.5 px-2 rounded-lg text-sm",
        highlight ? "bg-primary/10 font-bold text-primary" : "text-foreground",
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{formatMoney(amount)}</span>
    </div>
  );
}

export function PropertyModal({
  gameId,
  spaceId,
  deed,
  session,
  onClose,
}: PropertyModalProps) {
  const buyProperty = useBuyProperty();
  const passOnProperty = usePassOnProperty();

  const colorInfo = COLOR_GROUP_MAP[deed.colorGroup] ?? {
    bg: "bg-muted",
    label: deed.colorGroup,
  };

  const isAlreadyOwned = session.ownedProperties.some(
    (p: OwnedPropertyView) => p.spaceId === spaceId,
  );

  const handleBuy = () => {
    buyProperty.mutate({ gameId, spaceId });
    onClose();
  };

  const handlePass = () => {
    passOnProperty.mutate({ gameId, spaceId });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="property-modal"
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="presentation"
      />
      <dialog
        open
        className="relative bg-card rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-0 border-0 m-0"
        aria-label={`Property: ${deed.name}`}
      >
        {/* Color Header */}
        <div
          className={cn(
            "h-20 flex flex-col items-center justify-center gap-1 relative",
            colorInfo.bg,
          )}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-foreground/20 flex items-center justify-center text-card hover:bg-foreground/40 transition-smooth"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-card/80">
            {colorInfo.label}
          </span>
          <h2 className="text-xl font-display font-extrabold text-card text-center px-8">
            {deed.name}
          </h2>
        </div>

        <div className="p-5 space-y-4">
          {/* Price */}
          <div className="text-center">
            <span className="text-3xl font-display font-extrabold text-primary">
              {formatMoney(deed.purchasePrice)}
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Purchase Price
            </p>
          </div>

          {/* Rent structure */}
          <div className="space-y-1 bg-muted/40 rounded-xl p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Rent Schedule
            </p>
            <RentRow label="Base Rent" amount={deed.rentBase} />
            <RentRow label="1 House" amount={deed.rentHouse1} />
            <RentRow label="2 Houses" amount={deed.rentHouse2} />
            <RentRow label="3 Houses" amount={deed.rentHouse3} />
            <RentRow label="4 Houses" amount={deed.rentHouse4} />
            <RentRow label="🏨 Hotel" amount={deed.rentHotel} highlight />
          </div>

          {/* Build cost + Mortgage */}
          <div className="flex gap-3 text-sm">
            <div className="flex-1 bg-muted/40 rounded-xl p-3 text-center">
              <div className="font-bold text-foreground">
                {formatMoney(deed.housePrice)}
              </div>
              <div className="text-xs text-muted-foreground">Per House</div>
            </div>
            <div className="flex-1 bg-muted/40 rounded-xl p-3 text-center">
              <div className="font-bold text-foreground">
                {formatMoney(deed.mortgageValue)}
              </div>
              <div className="text-xs text-muted-foreground">
                Mortgage Value
              </div>
            </div>
          </div>

          {/* Actions */}
          {!isAlreadyOwned && (
            <div className="flex gap-3 pt-1" data-ocid="property-modal-actions">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handlePass}
                disabled={passOnProperty.isPending}
                data-ocid="property-pass-btn"
              >
                Pass (Auction)
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                onClick={handleBuy}
                disabled={buyProperty.isPending}
                data-ocid="property-buy-btn"
              >
                Buy {formatMoney(deed.purchasePrice)}
              </Button>
            </div>
          )}
          {isAlreadyOwned && (
            <p className="text-center text-sm text-muted-foreground font-medium py-1">
              Already owned
            </p>
          )}
        </div>
      </dialog>
    </div>
  );
}
