import Types "../types/game-types";
import GameLib "../lib/game-types";
import Map "mo:core/Map";
import Time "mo:core/Time";

mixin (
  lobbies : Map.Map<Types.LobbyCode, Types.Lobby>,
  games : Map.Map<Types.GameId, Types.GameSession>,
  board : [Types.BoardSpace],
) {
  // ─── Internal state ───────────────────────────────────────────────────────

  var _seedCounter : Nat = 0;
  var _gameCounter : Nat = 0;

  func freshSeed() : Nat {
    _seedCounter := _seedCounter + 1;
    let t = Time.now();
    let te = if (t >= 0) { t.toNat() } else { 0 };
    te + _seedCounter * 999983;
  };

  func freshGameId() : Types.GameId {
    _gameCounter := _gameCounter + 1;
    "game-" # _gameCounter.toText() # "-" # freshSeed().toText();
  };

  // ─── Internal helpers ─────────────────────────────────────────────────────

  func requireCurrentPlayer(game : Types.GameSession, caller : Principal) : { #ok : Types.PlayerState; #err : Types.GameError } {
    let currentPlayer = game.players[game.currentPlayerIndex];
    if (not (currentPlayer.id == caller)) {
      return #err(#notYourTurn);
    };
    #ok(currentPlayer);
  };

  func isPhaseRoll(phase : Types.TurnPhase) : Bool {
    switch (phase) { case (#roll) true; case (_) false };
  };

  func isPhaseEndTurn(phase : Types.TurnPhase) : Bool {
    switch (phase) { case (#endTurn) true; case (_) false };
  };

  func isLandAndAct(phase : Types.TurnPhase) : Bool {
    switch (phase) { case (#landAndAct) true; case (_) false };
  };

  func findActiveGameForPlayer(playerId : Principal) : ?Types.GameSession {
    switch (games.entries().find(func((_, g)) {
      switch (g.status) {
        case (#finished(_)) { false };
        case (#active) {
          switch (g.players.find(func p = p.id == playerId)) {
            case (?_) { true };
            case null { false };
          };
        };
      };
    })) {
      case (?(_, g)) { ?g };
      case null { null };
    };
  };

  // ─── Lobby ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func createLobby(
    username : Text,
    avatarId : Types.AvatarId,
    maxPlayers : Nat,
  ) : async { #ok : Types.LobbyView; #err : Types.LobbyError } {
    let now = Time.now();
    let seed = freshSeed();
    let view = GameLib.createLobby(lobbies, caller, username, avatarId, maxPlayers, now, seed);
    #ok(view);
  };

  public shared ({ caller }) func joinLobby(
    code : Types.LobbyCode,
    username : Text,
    avatarId : Types.AvatarId,
  ) : async { #ok : Types.LobbyView; #err : Types.LobbyError } {
    let now = Time.now();
    GameLib.joinLobby(lobbies, code, caller, username, avatarId, now);
  };

  public shared ({ caller }) func setReady(
    code : Types.LobbyCode,
    ready : Bool,
  ) : async { #ok : Types.LobbyView; #err : Types.LobbyError } {
    GameLib.setReady(lobbies, code, caller, ready);
  };

  public shared ({ caller }) func leaveLobby(
    code : Types.LobbyCode,
  ) : async { #ok; #err : Types.LobbyError } {
    GameLib.leaveLobby(lobbies, code, caller);
  };

  public query func getLobby(code : Types.LobbyCode) : async ?Types.LobbyView {
    GameLib.getLobby(lobbies, code);
  };

  public shared ({ caller }) func startGame(
    code : Types.LobbyCode,
  ) : async { #ok : Types.GameSessionView; #err : Types.LobbyError } {
    switch (lobbies.get(code)) {
      case null { #err(#lobbyNotFound) };
      case (?lobby) {
        if (not (lobby.hostId == caller)) { return #err(#notHost) };
        if (lobby.status != #waiting) { return #err(#lobbyAlreadyStarted) };
        let readyCount = lobby.players.filter(func p = p.isReady).size();
        if (readyCount < 2) { return #err(#tooFewPlayers) };
        lobby.status := #inProgress;
        let gameId = freshGameId();
        lobby.gameId := ?gameId;
        let now = Time.now();
        let view = GameLib.initGame(games, lobby, gameId, now);
        #ok(view);
      };
    };
  };

  // ─── Game State ───────────────────────────────────────────────────────────

  public query func getGame(gameId : Types.GameId) : async ?Types.GameSessionView {
    switch (games.get(gameId)) {
      case null { null };
      case (?game) { ?GameLib.toGameView(game) };
    };
  };

  public query ({ caller }) func reconnect() : async ?Types.GameSessionView {
    let fiveMinutes : Int = 5 * 60 * 1_000_000_000;
    let now = Time.now();
    switch (findActiveGameForPlayer(caller)) {
      case null { null };
      case (?game) {
        let playerOpt = game.players.find(func p = p.id == caller);
        switch (playerOpt) {
          case null { null };
          case (?player) {
            if (now - player.lastSeenAt <= fiveMinutes) {
              ?GameLib.toGameView(game);
            } else {
              null;
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func heartbeat(gameId : Types.GameId) : async () {
    switch (games.get(gameId)) {
      case null {};
      case (?game) {
        let now = Time.now();
        GameLib.heartbeat(game, caller, now);
      };
    };
  };

  // ─── Turn Flow ────────────────────────────────────────────────────────────

  public shared ({ caller }) func rollAndMove(
    gameId : Types.GameId,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        switch (game.status) {
          case (#finished(_)) { return #err(#invalidPhase) };
          case (#active) {};
        };
        switch (requireCurrentPlayer(game, caller)) {
          case (#err(e)) { return #err(e) };
          case (#ok(_)) {};
        };
        if (not isPhaseRoll(game.turnPhase)) { return #err(#invalidPhase) };
        let player = game.players[game.currentPlayerIndex];
        // Handle jail turn logic
        switch (player.jailStatus) {
          case (#inJail({ turnsRemaining; hasGetOutCard = _ })) {
            if (turnsRemaining <= 1) {
              // Force pay fine on last jail turn
              if (player.balance >= 50) {
                player.balance := player.balance - 50;
              };
              player.jailStatus := #notInJail;
            } else {
              let remaining : Nat = if (turnsRemaining > 0) { turnsRemaining - 1 } else { 0 };
              player.jailStatus := #inJail({ turnsRemaining = remaining; hasGetOutCard = player.getOutOfJailCards > 0 });
              let roll = GameLib.rollDice(freshSeed());
              game.lastDiceRoll := ?roll;
              game.turnPhase := #endTurn;
              game.updatedAt := Time.now();
              return #ok(GameLib.toGameView(game));
            };
          };
          case (#notInJail) {};
        };
        let roll = GameLib.rollDice(freshSeed());
        game.lastDiceRoll := ?roll;
        ignore GameLib.movePlayer(game, board, caller, roll);
        // Resolve landing (handles rent, taxes, jail, chance/community chest flags)
        let phaseView = GameLib.resolveLanding(game, board, caller);
        // Set internal phase from view
        switch (phaseView) {
          case (#roll) { game.turnPhase := #roll };
          case (#move) { game.turnPhase := #move };
          case (#endTurn) { game.turnPhase := #endTurn };
          case (#landAndAct) { game.turnPhase := #landAndAct };
          case (#auction(av)) {
            let astate : Types.AuctionState = {
              spaceId = av.spaceId;
              var bids = av.bids;
              var isOpen = av.isOpen;
              startedAt = av.startedAt;
            };
            game.turnPhase := #auction(astate);
          };
        };
        // Auto-draw cards for chance/community chest
        if (isLandAndAct(game.turnPhase)) {
          let landedSpace = board[player.position];
          switch (landedSpace.spaceType) {
            case (#chance) {
              ignore GameLib.drawCard(game, board, caller, #chance, Time.now());
              game.turnPhase := #endTurn;
            };
            case (#communityChest) {
              ignore GameLib.drawCard(game, board, caller, #communityChest, Time.now());
              game.turnPhase := #endTurn;
            };
            case (_) {};
          };
        };
        game.updatedAt := Time.now();
        #ok(GameLib.toGameView(game));
      };
    };
  };

  public shared ({ caller }) func buyProperty(
    gameId : Types.GameId,
    spaceId : Types.SpaceId,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        switch (requireCurrentPlayer(game, caller)) {
          case (#err(e)) { return #err(e) };
          case (#ok(_)) {};
        };
        if (not isLandAndAct(game.turnPhase)) { return #err(#invalidPhase) };
        let result = GameLib.buyProperty(game, caller, spaceId);
        switch (result) {
          case (#ok(_)) { game.turnPhase := #endTurn };
          case (#err(_)) {};
        };
        result;
      };
    };
  };

  public shared ({ caller }) func passOnProperty(
    gameId : Types.GameId,
    spaceId : Types.SpaceId,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        switch (requireCurrentPlayer(game, caller)) {
          case (#err(e)) { return #err(e) };
          case (#ok(_)) {};
        };
        if (not isLandAndAct(game.turnPhase)) { return #err(#invalidPhase) };
        let now = Time.now();
        let view = GameLib.startAuction(game, spaceId, now);
        #ok(view);
      };
    };
  };

  public shared ({ caller }) func placeBid(
    gameId : Types.GameId,
    amount : Types.Money,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        let now = Time.now();
        GameLib.placeBid(game, caller, amount, now);
      };
    };
  };

  public shared ({ caller }) func resolveAuction(
    gameId : Types.GameId,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        switch (requireCurrentPlayer(game, caller)) {
          case (#err(e)) { return #err(e) };
          case (#ok(_)) {};
        };
        let now = Time.now();
        GameLib.resolveAuction(game, now);
      };
    };
  };

  public shared ({ caller }) func endTurn(
    gameId : Types.GameId,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        switch (requireCurrentPlayer(game, caller)) {
          case (#err(e)) { return #err(e) };
          case (#ok(_)) {};
        };
        if (not isPhaseEndTurn(game.turnPhase)) { return #err(#invalidPhase) };
        let now = Time.now();
        let view = GameLib.nextTurn(game, now);
        #ok(view);
      };
    };
  };

  // ─── Jail Actions ─────────────────────────────────────────────────────────

  public shared ({ caller }) func payJailFine(
    gameId : Types.GameId,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        switch (requireCurrentPlayer(game, caller)) {
          case (#err(e)) { return #err(e) };
          case (#ok(_)) {};
        };
        GameLib.payJailFine(game, caller);
      };
    };
  };

  public shared ({ caller }) func useGetOutOfJailCard(
    gameId : Types.GameId,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        switch (requireCurrentPlayer(game, caller)) {
          case (#err(e)) { return #err(e) };
          case (#ok(_)) {};
        };
        GameLib.useGetOutOfJailCard(game, caller);
      };
    };
  };

  // ─── Property Management ──────────────────────────────────────────────────

  public shared ({ caller }) func upgradeProperty(
    gameId : Types.GameId,
    spaceId : Types.SpaceId,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        switch (requireCurrentPlayer(game, caller)) {
          case (#err(e)) { return #err(e) };
          case (#ok(_)) {};
        };
        GameLib.upgradeProperty(game, caller, spaceId);
      };
    };
  };

  public shared ({ caller }) func mortgageProperty(
    gameId : Types.GameId,
    spaceId : Types.SpaceId,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        GameLib.mortgageProperty(game, caller, spaceId);
      };
    };
  };

  public shared ({ caller }) func unmortgageProperty(
    gameId : Types.GameId,
    spaceId : Types.SpaceId,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        GameLib.unmortgageProperty(game, caller, spaceId);
      };
    };
  };

  // ─── Trading ──────────────────────────────────────────────────────────────

  public shared ({ caller }) func proposeTrade(
    gameId : Types.GameId,
    recipientId : Types.PlayerId,
    proposerSpaces : [Types.SpaceId],
    proposerMoney : Types.Money,
    recipientSpaces : [Types.SpaceId],
    recipientMoney : Types.Money,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        let now = Time.now();
        GameLib.proposeTrade(game, caller, recipientId, proposerSpaces, proposerMoney, recipientSpaces, recipientMoney, now);
      };
    };
  };

  public shared ({ caller }) func acceptTrade(
    gameId : Types.GameId,
    tradeId : Nat,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        GameLib.acceptTrade(game, caller, tradeId);
      };
    };
  };

  public shared ({ caller }) func declineTrade(
    gameId : Types.GameId,
    tradeId : Nat,
  ) : async { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (games.get(gameId)) {
      case null { #err(#gameNotFound) };
      case (?game) {
        GameLib.declineTrade(game, caller, tradeId);
      };
    };
  };
};
