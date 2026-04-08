import { cn } from "@/lib/utils";
import type React from "react";
import type {
  BoardSpaceDefinition,
  OwnedPropertyView,
  PlayerStateView,
} from "../../types/game";
import { ColorGroup, PLAYER_COLORS } from "../../types/game";

const COLOR_GROUP_STYLES: Record<string, string> = {
  [ColorGroup.brown]: "bg-amber-800",
  [ColorGroup.lightBlue]: "bg-sky-300",
  [ColorGroup.pink]: "bg-pink-400",
  [ColorGroup.orange]: "bg-orange-400",
  [ColorGroup.red]: "bg-red-400",
  [ColorGroup.yellow]: "bg-yellow-300",
  [ColorGroup.green]: "bg-emerald-400",
  [ColorGroup.darkBlue]: "bg-blue-400",
  [ColorGroup.railroad]: "bg-neutral-600",
  [ColorGroup.utility]: "bg-violet-400",
};

const SPACE_TYPE_CONFIG: Record<
  string,
  { bg: string; icon: string; label?: string }
> = {
  go: { bg: "bg-emerald-100 border-emerald-400", icon: "⭐", label: "GO" },
  jail: { bg: "bg-slate-200 border-slate-400", icon: "🔒", label: "JAIL" },
  free_parking: {
    bg: "bg-yellow-100 border-yellow-400",
    icon: "🚗",
    label: "FREE PARKING",
  },
  go_to_jail: {
    bg: "bg-red-100 border-red-400",
    icon: "👮",
    label: "GO TO JAIL",
  },
  chance: { bg: "bg-sky-100 border-sky-400", icon: "❓" },
  community_chest: { bg: "bg-orange-100 border-orange-400", icon: "📦" },
  tax: { bg: "bg-slate-100 border-slate-300", icon: "💸" },
  corner: { bg: "bg-muted border-border", icon: "" },
};

interface BoardSpaceProps {
  space: BoardSpaceDefinition;
  ownedBy?: OwnedPropertyView;
  playersHere: PlayerStateView[];
  isSelected?: boolean;
  onClick?: () => void;
  /** orientation determines where the color band appears */
  orientation?: "top" | "bottom" | "left" | "right" | "corner";
  style?: React.CSSProperties;
}

function UpgradePips({ level }: { level: bigint }) {
  const n = Number(level);
  if (n === 0) return null;
  if (n >= 5) return <span className="text-[8px] leading-none">🏨</span>;
  return (
    <span className="flex gap-[1px] flex-wrap justify-center">
      {Array.from({ length: n }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length array from level number
        <span key={i} className="text-[7px] leading-none">
          🏠
        </span>
      ))}
    </span>
  );
}

export function BoardSpace({
  space,
  ownedBy,
  playersHere,
  isSelected = false,
  onClick,
  orientation = "bottom",
  style,
}: BoardSpaceProps) {
  const isCorner = [
    "go",
    "jail",
    "free_parking",
    "go_to_jail",
    "corner",
  ].includes(space.type);
  const typeConfig = SPACE_TYPE_CONFIG[space.type];
  const colorBandClass = space.colorGroup
    ? COLOR_GROUP_STYLES[space.colorGroup]
    : null;

  const baseBg = typeConfig?.bg ?? "bg-emerald-50 border-emerald-200";
  const bandPos: Record<string, string> = {
    top: "h-2.5 w-full top-0 left-0 rounded-t-sm",
    bottom: "h-2.5 w-full bottom-0 left-0 rounded-b-sm",
    left: "w-2.5 h-full left-0 top-0 rounded-l-sm",
    right: "w-2.5 h-full right-0 top-0 rounded-r-sm",
    corner: "hidden",
  };

  return (
    <button
      type="button"
      aria-label={space.name}
      data-ocid={`board-space-${space.id}`}
      onClick={onClick}
      style={style}
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none",
        "border transition-colors duration-150",
        isCorner ? "rounded-xl" : "rounded-sm",
        baseBg,
        isSelected && "ring-2 ring-primary ring-offset-1 z-10",
        onClick && "hover:brightness-95 active:brightness-90",
        isCorner ? "p-0.5" : "p-px",
      )}
    >
      {/* Color band for properties */}
      {colorBandClass && !isCorner && (
        <div className={cn("absolute", bandPos[orientation], colorBandClass)} />
      )}

      {/* Mortgage overlay */}
      {ownedBy?.isMortgaged && (
        <div className="absolute inset-0 bg-foreground/20 z-10 flex items-center justify-center rounded-sm">
          <span className="text-[8px] font-bold text-foreground rotate-[-25deg]">
            MORT
          </span>
        </div>
      )}

      {/* Corner spaces: just icon + label */}
      {isCorner ? (
        <div className="flex flex-col items-center justify-center w-full h-full gap-0.5">
          <span className="text-xl leading-none">{typeConfig?.icon}</span>
          <span className="text-[7px] font-display font-black text-foreground leading-tight text-center">
            {typeConfig?.label ?? space.name}
          </span>
        </div>
      ) : (
        /* Regular space */
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-[1px] w-full h-full",
            orientation === "top" || orientation === "bottom"
              ? "pt-3 pb-0.5"
              : "pl-3 pr-0.5",
          )}
        >
          {/* Type icon */}
          {typeConfig?.icon && (
            <span className="text-[10px] leading-none">{typeConfig.icon}</span>
          )}

          {/* Property name */}
          <span
            className={cn(
              "font-display font-bold text-foreground leading-tight text-center break-words hyphens-auto",
              "text-[6px]",
            )}
          >
            {space.name}
          </span>

          {/* Price */}
          {space.purchasePrice != null && !ownedBy && (
            <span className="text-[5px] text-muted-foreground font-mono leading-none">
              ${space.purchasePrice}
            </span>
          )}

          {/* Upgrade pips */}
          {ownedBy && <UpgradePips level={ownedBy.upgradeLevel} />}
        </div>
      )}

      {/* Player tokens on this space (tiny dots) */}
      {playersHere.length > 0 && (
        <div className="absolute bottom-0.5 right-0.5 flex flex-wrap gap-[1px] max-w-[10px]">
          {playersHere.slice(0, 4).map((p, i) => (
            <div
              key={String(p.id)}
              className="w-1.5 h-1.5 rounded-full border border-card"
              style={{
                backgroundColor: PLAYER_COLORS[i % PLAYER_COLORS.length].token,
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
}
