import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LobbyPlayer {
    id: PlayerId;
    username: string;
    joinedAt: Timestamp;
    isHost: boolean;
    isReady: boolean;
    avatarId: AvatarId;
}
export type Money = bigint;
export type Timestamp = bigint;
export interface PlayerStateView {
    id: PlayerId;
    isBankrupt: boolean;
    username: string;
    balance: Money;
    lastSeenAt: Timestamp;
    getOutOfJailCards: bigint;
    ownedSpaces: Array<SpaceId>;
    avatarId: AvatarId;
    jailStatus: JailStatus;
    position: BoardPosition;
}
export interface GameSessionView {
    id: GameId;
    status: GameStatus;
    startedAt: Timestamp;
    currentPlayerIndex: bigint;
    updatedAt: Timestamp;
    players: Array<PlayerStateView>;
    turnPhase: TurnPhaseView;
    ownedProperties: Array<OwnedPropertyView>;
    lastDiceRoll?: DiceRoll;
    lobbyCode: LobbyCode;
    pendingTrade?: TradeOfferView;
}
export type LobbyCode = string;
export type AvatarId = bigint;
export interface OwnedPropertyView {
    upgradeLevel: UpgradeLevel;
    ownerId: PlayerId;
    deed: PropertyDeed;
    spaceId: SpaceId;
    isMortgaged: boolean;
}
export type PlayerId = Principal;
export type TurnPhaseView = {
    __kind__: "endTurn";
    endTurn: null;
} | {
    __kind__: "move";
    move: null;
} | {
    __kind__: "roll";
    roll: null;
} | {
    __kind__: "landAndAct";
    landAndAct: null;
} | {
    __kind__: "auction";
    auction: AuctionStateView;
};
export interface LobbyView {
    status: LobbyStatus;
    code: LobbyCode;
    createdAt: Timestamp;
    gameId?: GameId;
    players: Array<LobbyPlayer>;
    hostId: PlayerId;
    maxPlayers: bigint;
}
export interface TradeOfferView {
    id: bigint;
    status: TradeStatus;
    proposerSpaces: Array<SpaceId>;
    createdAt: Timestamp;
    proposerMoney: Money;
    recipientMoney: Money;
    recipientId: PlayerId;
    recipientSpaces: Array<SpaceId>;
    proposerId: PlayerId;
}
export type SpaceId = bigint;
export type JailStatus = {
    __kind__: "inJail";
    inJail: {
        hasGetOutCard: boolean;
        turnsRemaining: bigint;
    };
} | {
    __kind__: "notInJail";
    notInJail: null;
};
export type UpgradeLevel = bigint;
export type GameStatus = {
    __kind__: "active";
    active: null;
} | {
    __kind__: "finished";
    finished: {
        winnerId: PlayerId;
    };
};
export type GameId = string;
export interface DiceRoll {
    die1: bigint;
    die2: bigint;
}
export type BoardPosition = bigint;
export interface AuctionStateView {
    startedAt: Timestamp;
    bids: Array<AuctionBid>;
    isOpen: boolean;
    spaceId: SpaceId;
}
export interface AuctionBid {
    placedAt: Timestamp;
    bidderId: PlayerId;
    amount: Money;
}
export interface PropertyDeed {
    purchasePrice: Money;
    housePrice: Money;
    mortgageValue: Money;
    rentHouse1: Money;
    rentHouse2: Money;
    rentHouse3: Money;
    rentHouse4: Money;
    name: string;
    rentHotel: Money;
    spaceId: SpaceId;
    colorGroup: ColorGroup;
    rentBase: Money;
}
export enum ColorGroup {
    red = "red",
    utility = "utility",
    orange = "orange",
    pink = "pink",
    darkBlue = "darkBlue",
    green = "green",
    railroad = "railroad",
    brown = "brown",
    lightBlue = "lightBlue",
    yellow = "yellow"
}
export enum GameError {
    propertyNotOwned = "propertyNotOwned",
    insufficientFunds = "insufficientFunds",
    alreadyMortgaged = "alreadyMortgaged",
    invalidPhase = "invalidPhase",
    propertyAlreadyOwned = "propertyAlreadyOwned",
    tradeNotFound = "tradeNotFound",
    notTradeParticipant = "notTradeParticipant",
    invalidBid = "invalidBid",
    alreadyBankrupt = "alreadyBankrupt",
    playerNotFound = "playerNotFound",
    maxUpgradeReached = "maxUpgradeReached",
    gameNotFound = "gameNotFound",
    notYourTurn = "notYourTurn",
    notMortgaged = "notMortgaged",
    notInJail = "notInJail"
}
export enum LobbyError {
    lobbyNotFound = "lobbyNotFound",
    lobbyAlreadyStarted = "lobbyAlreadyStarted",
    notHost = "notHost",
    alreadyInLobby = "alreadyInLobby",
    tooFewPlayers = "tooFewPlayers",
    lobbyFull = "lobbyFull",
    notInLobby = "notInLobby"
}
export enum LobbyStatus {
    starting = "starting",
    finished = "finished",
    waiting = "waiting",
    inProgress = "inProgress"
}
export enum TradeStatus {
    cancelled = "cancelled",
    pending = "pending",
    accepted = "accepted",
    declined = "declined"
}
export interface backendInterface {
    acceptTrade(gameId: GameId, tradeId: bigint): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
    buyProperty(gameId: GameId, spaceId: SpaceId): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
    createLobby(username: string, avatarId: AvatarId, maxPlayers: bigint): Promise<{
        __kind__: "ok";
        ok: LobbyView;
    } | {
        __kind__: "err";
        err: LobbyError;
    }>;
    declineTrade(gameId: GameId, tradeId: bigint): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
    endTurn(gameId: GameId): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
    getGame(gameId: GameId): Promise<GameSessionView | null>;
    getLobby(code: LobbyCode): Promise<LobbyView | null>;
    heartbeat(gameId: GameId): Promise<void>;
    joinLobby(code: LobbyCode, username: string, avatarId: AvatarId): Promise<{
        __kind__: "ok";
        ok: LobbyView;
    } | {
        __kind__: "err";
        err: LobbyError;
    }>;
    leaveLobby(code: LobbyCode): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: LobbyError;
    }>;
    mortgageProperty(gameId: GameId, spaceId: SpaceId): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
    passOnProperty(gameId: GameId, spaceId: SpaceId): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
    payJailFine(gameId: GameId): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
    placeBid(gameId: GameId, amount: Money): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
    proposeTrade(gameId: GameId, recipientId: PlayerId, proposerSpaces: Array<SpaceId>, proposerMoney: Money, recipientSpaces: Array<SpaceId>, recipientMoney: Money): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
    reconnect(): Promise<GameSessionView | null>;
    resolveAuction(gameId: GameId): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
    rollAndMove(gameId: GameId): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
    setReady(code: LobbyCode, ready: boolean): Promise<{
        __kind__: "ok";
        ok: LobbyView;
    } | {
        __kind__: "err";
        err: LobbyError;
    }>;
    startGame(code: LobbyCode): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: LobbyError;
    }>;
    unmortgageProperty(gameId: GameId, spaceId: SpaceId): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
    upgradeProperty(gameId: GameId, spaceId: SpaceId): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
    useGetOutOfJailCard(gameId: GameId): Promise<{
        __kind__: "ok";
        ok: GameSessionView;
    } | {
        __kind__: "err";
        err: GameError;
    }>;
}
