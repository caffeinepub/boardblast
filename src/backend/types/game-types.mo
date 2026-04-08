import Common "common";

module {
  public type PlayerId = Common.PlayerId;
  public type Timestamp = Common.Timestamp;
  public type Money = Common.Money;
  public type BoardPosition = Common.BoardPosition;
  public type SpaceId = Common.SpaceId;
  public type GameId = Common.GameId;
  public type LobbyCode = Common.LobbyCode;

  // ─── Avatar ───────────────────────────────────────────────────────────────
  // Avatar index (references frontend avatar sprite list)
  public type AvatarId = Nat;

  // ─── Lobby ────────────────────────────────────────────────────────────────
  public type LobbyStatus = {
    #waiting;
    #starting;
    #inProgress;
    #finished;
  };

  public type LobbyPlayer = {
    id : PlayerId;
    username : Text;
    avatarId : AvatarId;
    isReady : Bool;
    isHost : Bool;
    joinedAt : Timestamp;
  };

  public type Lobby = {
    code : LobbyCode;
    hostId : PlayerId;
    var players : [LobbyPlayer];
    var status : LobbyStatus;
    var maxPlayers : Nat;
    createdAt : Timestamp;
    var gameId : ?GameId;
  };

  // ─── Property ─────────────────────────────────────────────────────────────
  public type ColorGroup = {
    #brown;
    #lightBlue;
    #pink;
    #orange;
    #red;
    #yellow;
    #green;
    #darkBlue;
    #railroad;
    #utility;
  };

  public type UpgradeLevel = Nat; // 0 = unimproved, 1–4 = houses, 5 = hotel

  public type PropertyDeed = {
    spaceId : SpaceId;
    name : Text;
    colorGroup : ColorGroup;
    purchasePrice : Money;
    mortgageValue : Money;
    housePrice : Money;
    rentBase : Money;
    rentHouse1 : Money;
    rentHouse2 : Money;
    rentHouse3 : Money;
    rentHouse4 : Money;
    rentHotel : Money;
  };

  public type OwnedProperty = {
    deed : PropertyDeed;
    ownerId : PlayerId;
    var upgradeLevel : UpgradeLevel;
    var isMortgaged : Bool;
  };

  // ─── Board Spaces ─────────────────────────────────────────────────────────
  public type SpaceType = {
    #go;
    #property : PropertyDeed;
    #railroad : PropertyDeed;
    #utility : PropertyDeed;
    #communityChest;
    #chance;
    #incomeTax;        // -$200
    #luxuryTax;        // -$75
    #jail;             // Just Visiting / Go To Jail trigger
    #freeParking;
    #goToJail;
  };

  public type BoardSpace = {
    id : SpaceId;
    name : Text;
    spaceType : SpaceType;
  };

  // ─── Cards ────────────────────────────────────────────────────────────────
  public type CardEffect = {
    #collectMoney : Money;
    #payMoney : Money;
    #moveToSpace : SpaceId;
    #moveSpaces : Int;       // positive = forward, negative = backward
    #getOutOfJailFree;
    #goToJail;
    #payPerHouse : Money;    // maintenance per house/hotel
    #collectFromPlayers : Money;
  };

  public type Card = {
    id : Nat;
    description : Text;
    effect : CardEffect;
  };

  public type CardDeckType = { #chance; #communityChest };

  // ─── Auction ──────────────────────────────────────────────────────────────
  public type AuctionBid = {
    bidderId : PlayerId;
    amount : Money;
    placedAt : Timestamp;
  };

  public type AuctionState = {
    spaceId : SpaceId;
    var bids : [AuctionBid];
    var isOpen : Bool;
    startedAt : Timestamp;
  };

  // ─── Trade ────────────────────────────────────────────────────────────────
  public type TradeOffer = {
    id : Nat;
    proposerId : PlayerId;
    recipientId : PlayerId;
    proposerSpaces : [SpaceId];
    proposerMoney : Money;
    recipientSpaces : [SpaceId];
    recipientMoney : Money;
    var status : TradeStatus;
    createdAt : Timestamp;
  };

  public type TradeStatus = { #pending; #accepted; #declined; #cancelled };

  // ─── Player Game State ────────────────────────────────────────────────────
  public type JailStatus = {
    #notInJail;
    #inJail : { turnsRemaining : Nat; hasGetOutCard : Bool };
  };

  public type PlayerState = {
    id : PlayerId;
    username : Text;
    avatarId : AvatarId;
    var position : BoardPosition;
    var balance : Money;
    var ownedSpaces : [SpaceId];
    var jailStatus : JailStatus;
    var isBankrupt : Bool;
    var getOutOfJailCards : Nat;
    var lastSeenAt : Timestamp;
  };

  // ─── Turn / Phase ─────────────────────────────────────────────────────────
  public type TurnPhase = {
    #roll;
    #move;
    #landAndAct;
    #auction : AuctionState;
    #endTurn;
  };

  public type DiceRoll = { die1 : Nat; die2 : Nat };

  // ─── Game Session ─────────────────────────────────────────────────────────
  public type GameStatus = {
    #active;
    #finished : { winnerId : PlayerId };
  };

  public type GameSession = {
    id : GameId;
    lobbyCode : LobbyCode;
    var players : [PlayerState];
    var ownedProperties : [OwnedProperty];
    var currentPlayerIndex : Nat;
    var turnPhase : TurnPhase;
    var status : GameStatus;
    var lastDiceRoll : ?DiceRoll;
    var pendingTrade : ?TradeOffer;
    var chanceCards : [Card];
    var communityChestCards : [Card];
    var nextTradeId : Nat;
    startedAt : Timestamp;
    var updatedAt : Timestamp;
  };

  // ─── Public (shared) view types ───────────────────────────────────────────
  // These are returned to the frontend; all mutable fields projected to immutable.

  public type LobbyView = {
    code : LobbyCode;
    hostId : PlayerId;
    players : [LobbyPlayer];
    status : LobbyStatus;
    maxPlayers : Nat;
    createdAt : Timestamp;
    gameId : ?GameId;
  };

  public type PlayerStateView = {
    id : PlayerId;
    username : Text;
    avatarId : AvatarId;
    position : BoardPosition;
    balance : Money;
    ownedSpaces : [SpaceId];
    jailStatus : JailStatus;
    isBankrupt : Bool;
    getOutOfJailCards : Nat;
    lastSeenAt : Timestamp;
  };

  public type OwnedPropertyView = {
    spaceId : SpaceId;
    ownerId : PlayerId;
    upgradeLevel : UpgradeLevel;
    isMortgaged : Bool;
    deed : PropertyDeed;
  };

  public type AuctionStateView = {
    spaceId : SpaceId;
    bids : [AuctionBid];
    isOpen : Bool;
    startedAt : Timestamp;
  };

  public type TurnPhaseView = {
    #roll;
    #move;
    #landAndAct;
    #auction : AuctionStateView;
    #endTurn;
  };

  public type GameSessionView = {
    id : GameId;
    lobbyCode : LobbyCode;
    players : [PlayerStateView];
    ownedProperties : [OwnedPropertyView];
    currentPlayerIndex : Nat;
    turnPhase : TurnPhaseView;
    status : GameStatus;
    lastDiceRoll : ?DiceRoll;
    pendingTrade : ?TradeOfferView;
    startedAt : Timestamp;
    updatedAt : Timestamp;
  };

  public type TradeOfferView = {
    id : Nat;
    proposerId : PlayerId;
    recipientId : PlayerId;
    proposerSpaces : [SpaceId];
    proposerMoney : Money;
    recipientSpaces : [SpaceId];
    recipientMoney : Money;
    status : TradeStatus;
    createdAt : Timestamp;
  };

  // ─── API Errors ───────────────────────────────────────────────────────────
  public type LobbyError = {
    #lobbyNotFound;
    #lobbyFull;
    #lobbyAlreadyStarted;
    #notInLobby;
    #notHost;
    #tooFewPlayers;
    #alreadyInLobby;
  };

  public type GameError = {
    #gameNotFound;
    #notYourTurn;
    #invalidPhase;
    #insufficientFunds;
    #propertyNotOwned;
    #propertyAlreadyOwned;
    #alreadyMortgaged;
    #notMortgaged;
    #maxUpgradeReached;
    #notInJail;
    #invalidBid;
    #tradeNotFound;
    #notTradeParticipant;
    #alreadyBankrupt;
    #playerNotFound;
  };
};
