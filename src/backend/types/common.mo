module {
  // Timestamp in nanoseconds (from Time.now())
  public type Timestamp = Int;

  // Unique player identifier
  public type PlayerId = Principal;

  // Monetary amount in game dollars
  public type Money = Int;

  // Board position index (0–39 for standard Monopoly board)
  public type BoardPosition = Nat;

  // Property/board space index
  public type SpaceId = Nat;

  // Unique game identifier
  public type GameId = Text;

  // Unique lobby code (6-character alphanumeric)
  public type LobbyCode = Text;

  // Result type for operations
  public type Result<T, E> = { #ok : T; #err : E };
};
