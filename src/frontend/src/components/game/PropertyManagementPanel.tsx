import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowDownUp, TrendingDown, TrendingUp, X } from "lucide-react";
import {
  useMortgageProperty,
  useUnmortgageProperty,
  useUpgradeProperty,
} from "../../hooks/useGameActions";
import type {
  GameSessionView,
  OwnedPropertyView,
  PlayerStateView,
} from "../../types/game";
import { formatMoney } from "../../types/game";

const COLOR_DOTS: Record<string, string> = {
  brown: "bg-[#8B4513]",
  lightBlue: "bg-[#87CEEB]",
  pink: "bg-[#FF69B4]",
  orange: "bg-[#FFA500]",
  red: "bg-[#E53E3E]",
  yellow: "bg-[#ECC94B]",
  green: "bg-[#38A169]",
  darkBlue: "bg-[#2B6CB0]",
  railroad: "bg-foreground",
  utility: "bg-[#805AD5]",
};

const MAX_UPGRADE = 5n;

interface PropertyManagementPanelProps {
  gameId: string;
  session: GameSessionView;
  player: PlayerStateView;
  isOpen: boolean;
  onClose: () => void;
}

function UpgradePips({ level }: { level: bigint }) {
  const n = Number(level);
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn(
            "w-2 h-2 rounded-sm transition-smooth",
            i < n ? (n === 5 ? "bg-red-500" : "bg-accent") : "bg-muted",
          )}
          title={i === 4 ? "Hotel" : `${i + 1} House${i > 0 ? "s" : ""}`}
        />
      ))}
    </div>
  );
}

function PropertyCard({
  prop,
  gameId,
}: {
  prop: OwnedPropertyView;
  gameId: string;
}) {
  const upgrade = useUpgradeProperty();
  const mortgage = useMortgageProperty();
  const unmortgage = useUnmortgageProperty();

  const colorDot = COLOR_DOTS[prop.deed.colorGroup] ?? "bg-muted";
  const canUpgrade = !prop.isMortgaged && prop.upgradeLevel < MAX_UPGRADE;
  const isRailroadOrUtility =
    prop.deed.colorGroup === "railroad" || prop.deed.colorGroup === "utility";

  return (
    <div
      className={cn(
        "bg-card border rounded-xl p-3 space-y-2 transition-smooth",
        prop.isMortgaged
          ? "opacity-60 border-dashed border-muted-foreground/40"
          : "border-border hover:border-primary/30",
      )}
      data-ocid="property-card"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={cn("w-3 h-3 rounded-full flex-shrink-0", colorDot)} />
          <span className="font-semibold text-sm leading-tight truncate">
            {prop.deed.name}
          </span>
        </div>
        {prop.isMortgaged && (
          <Badge
            variant="outline"
            className="text-xs flex-shrink-0 border-muted-foreground text-muted-foreground"
          >
            Mortgaged
          </Badge>
        )}
      </div>

      {!isRailroadOrUtility && <UpgradePips level={prop.upgradeLevel} />}

      <div className="text-xs text-muted-foreground">
        Rent:{" "}
        <span className="font-medium text-foreground">
          {formatMoney(prop.deed.rentBase)}
        </span>
        {" · "}
        Mortgage:{" "}
        <span className="font-medium text-foreground">
          {formatMoney(prop.deed.mortgageValue)}
        </span>
      </div>

      <div className="flex gap-1.5">
        {!isRailroadOrUtility && canUpgrade && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-xs border-accent/40 text-accent hover:bg-accent/10"
            onClick={() => upgrade.mutate({ gameId, spaceId: prop.spaceId })}
            disabled={upgrade.isPending}
            data-ocid="upgrade-property-btn"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Build {prop.upgradeLevel < 4n ? "House" : "Hotel"}
          </Button>
        )}

        {!prop.isMortgaged ? (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
            onClick={() => mortgage.mutate({ gameId, spaceId: prop.spaceId })}
            disabled={mortgage.isPending}
            data-ocid="mortgage-property-btn"
          >
            <TrendingDown className="w-3 h-3 mr-1" />
            Mortgage
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-xs border-accent/40 text-accent hover:bg-accent/10"
            onClick={() => unmortgage.mutate({ gameId, spaceId: prop.spaceId })}
            disabled={unmortgage.isPending}
            data-ocid="unmortgage-property-btn"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Unmortgage
          </Button>
        )}
      </div>
    </div>
  );
}

export function PropertyManagementPanel({
  gameId,
  session,
  player,
  isOpen,
  onClose,
}: PropertyManagementPanelProps) {
  const myProps = session.ownedProperties.filter(
    (p: OwnedPropertyView) => p.ownerId.toString() === player.id.toString(),
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="presentation"
          data-ocid="manage-panel-backdrop"
        />
      )}

      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-80 bg-card border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        data-ocid="property-management-panel"
        role="complementary"
        aria-label="Property Management"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <ArrowDownUp className="w-4 h-4 text-muted-foreground" />
            <span className="font-display font-bold text-base">
              My Properties
            </span>
            <Badge className="bg-primary text-primary-foreground text-xs">
              {myProps.length}
            </Badge>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-smooth"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ScrollArea className="flex-1 p-4">
          {myProps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <div className="text-5xl">🏚️</div>
              <p className="text-sm text-muted-foreground">
                No properties yet!
                <br />
                <span className="text-xs">Buy some to get started.</span>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myProps.map((prop: OwnedPropertyView) => (
                <PropertyCard
                  key={prop.spaceId.toString()}
                  prop={prop}
                  gameId={gameId}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}
