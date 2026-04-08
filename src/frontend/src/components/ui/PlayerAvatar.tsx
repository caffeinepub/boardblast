import { cn } from "@/lib/utils";
import { getAvatarEmoji, getPlayerColor } from "../../types/game";
import type { AvatarId } from "../../types/game";

interface PlayerAvatarProps {
  avatarId: AvatarId | number;
  username?: string;
  playerIndex: number;
  size?: "xs" | "sm" | "md" | "lg";
  showName?: boolean;
  isActive?: boolean;
  isBankrupt?: boolean;
  className?: string;
}

const sizeMap = {
  xs: { outer: "w-7 h-7", emoji: "text-base", ring: "ring-1" },
  sm: { outer: "w-9 h-9", emoji: "text-xl", ring: "ring-2" },
  md: { outer: "w-12 h-12", emoji: "text-2xl", ring: "ring-2" },
  lg: { outer: "w-16 h-16", emoji: "text-4xl", ring: "ring-[3px]" },
};

export function PlayerAvatar({
  avatarId,
  username,
  playerIndex,
  size = "md",
  showName = false,
  isActive = false,
  isBankrupt = false,
  className,
}: PlayerAvatarProps) {
  const emoji = getAvatarEmoji(
    typeof avatarId === "bigint" ? avatarId : BigInt(avatarId),
  );
  const color = getPlayerColor(playerIndex);
  const dims = sizeMap[size];

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full bg-card border-2 transition-smooth",
          dims.outer,
          isActive &&
            `${dims.ring} ring-primary ring-offset-2 animate-pulse-gentle`,
          isBankrupt && "opacity-40 grayscale",
          color.border,
        )}
        aria-label={username ? `${username}'s avatar` : "Player avatar"}
      >
        <span
          className={cn("select-none leading-none", dims.emoji)}
          role="img"
          aria-hidden
        >
          {emoji}
        </span>
        {isBankrupt && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/20">
            <span className="text-xs font-bold text-foreground">💀</span>
          </div>
        )}
        {isActive && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-card" />
        )}
      </div>
      {showName && username && (
        <span
          className={cn(
            "text-xs font-display font-semibold truncate max-w-[5rem]",
            isBankrupt
              ? "text-muted-foreground line-through"
              : "text-foreground",
          )}
        >
          {username}
        </span>
      )}
    </div>
  );
}
