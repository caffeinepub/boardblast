import { motion } from "motion/react";
import { PLAYER_COLORS, getAvatarEmoji } from "../../types/game";
import type { AvatarId } from "../../types/game";

interface PlayerTokenProps {
  avatarId: AvatarId;
  playerIndex: number;
  /** pixel position on the board */
  x: number;
  y: number;
  isActive?: boolean;
  isBankrupt?: boolean;
  username?: string;
  /** stacking offset when multiple tokens share a space */
  stackOffset?: number;
}

export function PlayerToken({
  avatarId,
  playerIndex,
  x,
  y,
  isActive = false,
  isBankrupt = false,
  username,
  stackOffset = 0,
}: PlayerTokenProps) {
  const emoji = getAvatarEmoji(avatarId);
  const color = PLAYER_COLORS[playerIndex % PLAYER_COLORS.length];

  return (
    <motion.div
      key={`token-${String(avatarId)}-${playerIndex}`}
      animate={{
        left: x + stackOffset * 10,
        top: y + stackOffset * 8,
        scale: isActive ? 1.25 : 1,
        filter: isBankrupt
          ? "grayscale(1) opacity(0.5)"
          : "grayscale(0) opacity(1)",
      }}
      transition={{
        left: { type: "spring", stiffness: 200, damping: 22 },
        top: { type: "spring", stiffness: 200, damping: 22 },
        scale: { type: "spring", stiffness: 300, damping: 20 },
      }}
      style={{ position: "absolute", zIndex: isActive ? 30 : 20 + playerIndex }}
      aria-label={`${username ?? "Player"} token`}
      data-ocid={`player-token-${playerIndex}`}
    >
      {/* Shadow */}
      <div
        className="absolute inset-0 rounded-full blur-[3px] opacity-30"
        style={{
          backgroundColor: color.token,
          transform: "translateY(3px) scaleX(0.9)",
        }}
      />

      {/* Token body */}
      <div
        className="relative flex items-center justify-center rounded-full border-2 border-card"
        style={{
          width: 28,
          height: 28,
          backgroundColor: color.token,
          boxShadow: isActive
            ? `0 0 0 3px ${color.token}55, 0 0 12px ${color.token}99`
            : undefined,
        }}
      >
        <span
          className="text-sm leading-none select-none"
          role="img"
          aria-hidden
        >
          {emoji}
        </span>
      </div>

      {/* Active pulse ring */}
      {isActive && (
        <motion.div
          className="absolute inset-[-4px] rounded-full border-2"
          style={{ borderColor: color.token }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
}
