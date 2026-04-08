// Re-export backend types + add frontend-specific extensions
export type {
  AuctionBid,
  AuctionStateView,
  AvatarId,
  BoardPosition,
  DiceRoll,
  GameId,
  GameSessionView,
  GameStatus,
  JailStatus,
  LobbyCode,
  LobbyPlayer,
  LobbyStatus,
  LobbyView,
  Money,
  OwnedPropertyView,
  PlayerId,
  PlayerStateView,
  PropertyDeed,
  SpaceId,
  Timestamp,
  TradeOfferView,
  TradeStatus,
  TurnPhaseView,
  UpgradeLevel,
} from "../backend";

export { ColorGroup, GameError, LobbyError } from "../backend";

// ─── Frontend-only types ─────────────────────────────────────────────────────

export interface BoardSpaceDefinition {
  id: number;
  name: string;
  type: BoardSpaceType;
  colorGroup?: string;
  purchasePrice?: number;
  /** Grid position [col, row] in the 11×11 board grid */
  gridPos: [number, number];
}

export type BoardSpaceType =
  | "go"
  | "property"
  | "railroad"
  | "utility"
  | "tax"
  | "chance"
  | "community_chest"
  | "jail"
  | "free_parking"
  | "go_to_jail"
  | "corner";

export interface UIState {
  isDiceAnimating: boolean;
  isTokenMoving: boolean;
  currentCard: CardDisplay | null;
  isAuctionModalOpen: boolean;
  isTradeModalOpen: boolean;
  isPropertyModalOpen: boolean;
  selectedSpaceId: bigint | null;
  errorMessage: string | null;
}

export interface CardDisplay {
  type: "chance" | "community_chest";
  title: string;
  description: string;
  effect: string;
}

export interface PlayerColor {
  bg: string;
  border: string;
  text: string;
  token: string;
}

export const PLAYER_COLORS: PlayerColor[] = [
  {
    bg: "bg-primary",
    border: "border-primary",
    text: "text-primary",
    token: "#d946ef",
  },
  {
    bg: "bg-accent",
    border: "border-accent",
    text: "text-accent",
    token: "#0d9488",
  },
  {
    bg: "bg-chart-1",
    border: "border-chart-1",
    text: "text-chart-1",
    token: "#ef4444",
  },
  {
    bg: "bg-chart-2",
    border: "border-chart-2",
    text: "text-chart-2",
    token: "#f97316",
  },
  {
    bg: "bg-chart-3",
    border: "border-chart-3",
    text: "text-chart-3",
    token: "#eab308",
  },
  {
    bg: "bg-chart-4",
    border: "border-chart-4",
    text: "text-chart-4",
    token: "#22c55e",
  },
  {
    bg: "bg-chart-5",
    border: "border-chart-5",
    text: "text-chart-5",
    token: "#3b82f6",
  },
  {
    bg: "bg-secondary",
    border: "border-secondary",
    text: "text-secondary",
    token: "#8b5cf6",
  },
];

export const AVATAR_EMOJIS = ["🚗", "🎩", "👢", "🦖", "🐕", "🚂", "🏖️", "🎃"];

export function formatMoney(amount: bigint | number): string {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  return `$${num.toLocaleString()}`;
}

export function getAvatarEmoji(avatarId: bigint | number): string {
  const idx = Number(avatarId) % AVATAR_EMOJIS.length;
  return AVATAR_EMOJIS[idx];
}

export function getPlayerColor(index: number): PlayerColor {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}
