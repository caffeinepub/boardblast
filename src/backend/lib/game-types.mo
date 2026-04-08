import Types "../types/game-types";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";

module {

  // ─── Helpers ──────────────────────────────────────────────────────────────

  func prng(seed : Nat, mod : Nat) : Nat {
    let a : Nat = 1664525;
    let c : Nat = 1013904223;
    let m : Nat = 4294967296;
    ((a * seed + c) % m) % mod;
  };

  // ─── View Helpers ─────────────────────────────────────────────────────────

  public func toLobbyView(lobby : Types.Lobby) : Types.LobbyView {
    {
      code = lobby.code;
      hostId = lobby.hostId;
      players = lobby.players;
      status = lobby.status;
      maxPlayers = lobby.maxPlayers;
      createdAt = lobby.createdAt;
      gameId = lobby.gameId;
    };
  };

  func toPlayerStateView(p : Types.PlayerState) : Types.PlayerStateView {
    {
      id = p.id;
      username = p.username;
      avatarId = p.avatarId;
      position = p.position;
      balance = p.balance;
      ownedSpaces = p.ownedSpaces;
      jailStatus = p.jailStatus;
      isBankrupt = p.isBankrupt;
      getOutOfJailCards = p.getOutOfJailCards;
      lastSeenAt = p.lastSeenAt;
    };
  };

  func toOwnedPropertyView(op : Types.OwnedProperty) : Types.OwnedPropertyView {
    {
      spaceId = op.deed.spaceId;
      ownerId = op.ownerId;
      upgradeLevel = op.upgradeLevel;
      isMortgaged = op.isMortgaged;
      deed = op.deed;
    };
  };

  func toTurnPhaseView(phase : Types.TurnPhase) : Types.TurnPhaseView {
    switch (phase) {
      case (#roll) { #roll };
      case (#move) { #move };
      case (#landAndAct) { #landAndAct };
      case (#endTurn) { #endTurn };
      case (#auction(a)) {
        #auction({
          spaceId = a.spaceId;
          bids = a.bids;
          isOpen = a.isOpen;
          startedAt = a.startedAt;
        });
      };
    };
  };

  func toTradeOfferView(t : Types.TradeOffer) : Types.TradeOfferView {
    {
      id = t.id;
      proposerId = t.proposerId;
      recipientId = t.recipientId;
      proposerSpaces = t.proposerSpaces;
      proposerMoney = t.proposerMoney;
      recipientSpaces = t.recipientSpaces;
      recipientMoney = t.recipientMoney;
      status = t.status;
      createdAt = t.createdAt;
    };
  };

  public func toGameView(game : Types.GameSession) : Types.GameSessionView {
    {
      id = game.id;
      lobbyCode = game.lobbyCode;
      players = game.players.map<Types.PlayerState, Types.PlayerStateView>(toPlayerStateView);
      ownedProperties = game.ownedProperties.map<Types.OwnedProperty, Types.OwnedPropertyView>(toOwnedPropertyView);
      currentPlayerIndex = game.currentPlayerIndex;
      turnPhase = toTurnPhaseView(game.turnPhase);
      status = game.status;
      lastDiceRoll = game.lastDiceRoll;
      pendingTrade = switch (game.pendingTrade) {
        case (?t) { ?toTradeOfferView(t) };
        case null { null };
      };
      startedAt = game.startedAt;
      updatedAt = game.updatedAt;
    };
  };

  // ─── Board Builder ────────────────────────────────────────────────────────

  func makeProp(
    spaceId : Nat,
    name : Text,
    cg : Types.ColorGroup,
    price : Types.Money,
    mortgage : Types.Money,
    houseP : Types.Money,
    r0 : Types.Money,
    r1 : Types.Money,
    r2 : Types.Money,
    r3 : Types.Money,
    r4 : Types.Money,
    rH : Types.Money,
  ) : Types.PropertyDeed {
    {
      spaceId;
      name;
      colorGroup = cg;
      purchasePrice = price;
      mortgageValue = mortgage;
      housePrice = houseP;
      rentBase = r0;
      rentHouse1 = r1;
      rentHouse2 = r2;
      rentHouse3 = r3;
      rentHouse4 = r4;
      rentHotel = rH;
    };
  };

  public func buildBoard() : [Types.BoardSpace] {
    [
      { id = 0;  name = "GO";                spaceType = #go },
      { id = 1;  name = "Mediterranean Ave"; spaceType = #property(makeProp(1,"Mediterranean Ave",#brown,60,30,50,2,10,30,90,160,250)) },
      { id = 2;  name = "Community Chest";   spaceType = #communityChest },
      { id = 3;  name = "Baltic Ave";        spaceType = #property(makeProp(3,"Baltic Ave",#brown,60,30,50,4,20,60,180,320,450)) },
      { id = 4;  name = "Income Tax";        spaceType = #incomeTax },
      { id = 5;  name = "Reading Railroad";  spaceType = #railroad(makeProp(5,"Reading Railroad",#railroad,200,100,0,25,50,100,200,200,200)) },
      { id = 6;  name = "Oriental Ave";      spaceType = #property(makeProp(6,"Oriental Ave",#lightBlue,100,50,50,6,30,90,270,400,550)) },
      { id = 7;  name = "Chance";            spaceType = #chance },
      { id = 8;  name = "Vermont Ave";       spaceType = #property(makeProp(8,"Vermont Ave",#lightBlue,100,50,50,6,30,90,270,400,550)) },
      { id = 9;  name = "Connecticut Ave";   spaceType = #property(makeProp(9,"Connecticut Ave",#lightBlue,120,60,50,8,40,100,300,450,600)) },
      { id = 10; name = "Jail";              spaceType = #jail },
      { id = 11; name = "St. Charles Place"; spaceType = #property(makeProp(11,"St. Charles Place",#pink,140,70,100,10,50,150,450,625,750)) },
      { id = 12; name = "Electric Company";  spaceType = #utility(makeProp(12,"Electric Company",#utility,150,75,0,4,4,4,4,4,4)) },
      { id = 13; name = "States Ave";        spaceType = #property(makeProp(13,"States Ave",#pink,140,70,100,10,50,150,450,625,750)) },
      { id = 14; name = "Virginia Ave";      spaceType = #property(makeProp(14,"Virginia Ave",#pink,160,80,100,12,60,180,500,700,900)) },
      { id = 15; name = "Pennsylvania RR";   spaceType = #railroad(makeProp(15,"Pennsylvania RR",#railroad,200,100,0,25,50,100,200,200,200)) },
      { id = 16; name = "St. James Place";   spaceType = #property(makeProp(16,"St. James Place",#orange,180,90,100,14,70,200,550,750,950)) },
      { id = 17; name = "Community Chest";   spaceType = #communityChest },
      { id = 18; name = "Tennessee Ave";     spaceType = #property(makeProp(18,"Tennessee Ave",#orange,180,90,100,14,70,200,550,750,950)) },
      { id = 19; name = "New York Ave";      spaceType = #property(makeProp(19,"New York Ave",#orange,200,100,100,16,80,220,600,800,1000)) },
      { id = 20; name = "Free Parking";      spaceType = #freeParking },
      { id = 21; name = "Kentucky Ave";      spaceType = #property(makeProp(21,"Kentucky Ave",#red,220,110,150,18,90,250,700,875,1050)) },
      { id = 22; name = "Chance";            spaceType = #chance },
      { id = 23; name = "Indiana Ave";       spaceType = #property(makeProp(23,"Indiana Ave",#red,220,110,150,18,90,250,700,875,1050)) },
      { id = 24; name = "Illinois Ave";      spaceType = #property(makeProp(24,"Illinois Ave",#red,240,120,150,20,100,300,750,925,1100)) },
      { id = 25; name = "B&O Railroad";      spaceType = #railroad(makeProp(25,"B&O Railroad",#railroad,200,100,0,25,50,100,200,200,200)) },
      { id = 26; name = "Atlantic Ave";      spaceType = #property(makeProp(26,"Atlantic Ave",#yellow,260,130,150,22,110,330,800,975,1150)) },
      { id = 27; name = "Ventnor Ave";       spaceType = #property(makeProp(27,"Ventnor Ave",#yellow,260,130,150,22,110,330,800,975,1150)) },
      { id = 28; name = "Water Works";       spaceType = #utility(makeProp(28,"Water Works",#utility,150,75,0,4,4,4,4,4,4)) },
      { id = 29; name = "Marvin Gardens";    spaceType = #property(makeProp(29,"Marvin Gardens",#yellow,280,140,150,24,120,360,850,1025,1200)) },
      { id = 30; name = "Go To Jail";        spaceType = #goToJail },
      { id = 31; name = "Pacific Ave";       spaceType = #property(makeProp(31,"Pacific Ave",#green,300,150,200,26,130,390,900,1100,1275)) },
      { id = 32; name = "North Carolina Ave";spaceType = #property(makeProp(32,"North Carolina Ave",#green,300,150,200,26,130,390,900,1100,1275)) },
      { id = 33; name = "Community Chest";   spaceType = #communityChest },
      { id = 34; name = "Pennsylvania Ave";  spaceType = #property(makeProp(34,"Pennsylvania Ave",#green,320,160,200,28,150,450,1000,1200,1400)) },
      { id = 35; name = "Short Line RR";     spaceType = #railroad(makeProp(35,"Short Line RR",#railroad,200,100,0,25,50,100,200,200,200)) },
      { id = 36; name = "Chance";            spaceType = #chance },
      { id = 37; name = "Park Place";        spaceType = #property(makeProp(37,"Park Place",#darkBlue,350,175,200,35,175,500,1100,1300,1500)) },
      { id = 38; name = "Luxury Tax";        spaceType = #luxuryTax },
      { id = 39; name = "Boardwalk";         spaceType = #property(makeProp(39,"Boardwalk",#darkBlue,400,200,200,50,200,600,1400,1700,2000)) },
    ];
  };

  // ─── Card Decks ───────────────────────────────────────────────────────────

  public func buildChanceDeck() : [Types.Card] {
    [
      { id = 0;  description = "Advance to Boardwalk";             effect = #moveToSpace(39) },
      { id = 1;  description = "Advance to GO";                    effect = #moveToSpace(0) },
      { id = 2;  description = "Advance to Illinois Ave";          effect = #moveToSpace(24) },
      { id = 3;  description = "Advance to St. Charles Place";     effect = #moveToSpace(11) },
      { id = 4;  description = "Advance to nearest Railroad";      effect = #moveToSpace(5) },
      { id = 5;  description = "Advance to nearest Railroad (2)";  effect = #moveToSpace(15) },
      { id = 6;  description = "Bank pays dividend of $50";        effect = #collectMoney(50) },
      { id = 7;  description = "Get Out of Jail Free";             effect = #getOutOfJailFree },
      { id = 8;  description = "Go Back 3 Spaces";                 effect = #moveSpaces(-3) },
      { id = 9;  description = "Go to Jail";                       effect = #goToJail },
      { id = 10; description = "Make general repairs: $25/house";  effect = #payPerHouse(25) },
      { id = 11; description = "Pay poor tax of $15";              effect = #payMoney(15) },
      { id = 12; description = "Advance to Reading Railroad";      effect = #moveToSpace(5) },
      { id = 13; description = "Advance to Boardwalk (2)";         effect = #moveToSpace(39) },
      { id = 14; description = "Pay each player $50";              effect = #collectFromPlayers(-50) },
      { id = 15; description = "Collect $150";                     effect = #collectMoney(150) },
    ];
  };

  public func buildCommunityChestDeck() : [Types.Card] {
    [
      { id = 100; description = "Advance to GO";                          effect = #moveToSpace(0) },
      { id = 101; description = "Bank error in your favor – $200";        effect = #collectMoney(200) },
      { id = 102; description = "Doctor fee – pay $50";                   effect = #payMoney(50) },
      { id = 103; description = "From sale of stock – $50";               effect = #collectMoney(50) },
      { id = 104; description = "Get Out of Jail Free";                   effect = #getOutOfJailFree },
      { id = 105; description = "Go to Jail";                             effect = #goToJail },
      { id = 106; description = "Holiday fund matures – $100";            effect = #collectMoney(100) },
      { id = 107; description = "Income tax refund – $20";                effect = #collectMoney(20) },
      { id = 108; description = "It's your birthday – collect $10";       effect = #collectFromPlayers(10) },
      { id = 109; description = "Life insurance matures – $100";          effect = #collectMoney(100) },
      { id = 110; description = "Pay hospital fees – $50";                effect = #payMoney(50) },
      { id = 111; description = "Pay school fees – $50";                  effect = #payMoney(50) },
      { id = 112; description = "Receive consultancy fee – $25";          effect = #collectMoney(25) },
      { id = 113; description = "Assessed for street repairs: $40/house"; effect = #payPerHouse(40) },
      { id = 114; description = "Won second prize in beauty contest – $10"; effect = #collectMoney(10) },
      { id = 115; description = "You inherit $100";                       effect = #collectMoney(100) },
    ];
  };

  // ─── Lobby Code Generator ─────────────────────────────────────────────────

  public func generateLobbyCode(seed : Nat) : Types.LobbyCode {
    let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let charArray = chars.toArray();
    let len = charArray.size();
    var s = seed;
    var code = "";
    var i = 0;
    while (i < 6) {
      s := prng(s + i, len);
      code := code # Text.fromChar(charArray[s % len]);
      i := i + 1;
    };
    code;
  };

  // ─── Lobby Management ─────────────────────────────────────────────────────

  public func createLobby(
    lobbies : Map.Map<Types.LobbyCode, Types.Lobby>,
    hostId : Types.PlayerId,
    username : Text,
    avatarId : Types.AvatarId,
    maxPlayers : Nat,
    now : Types.Timestamp,
    seed : Nat,
  ) : Types.LobbyView {
    let code = generateLobbyCode(seed);
    let host : Types.LobbyPlayer = {
      id = hostId;
      username;
      avatarId;
      isReady = false;
      isHost = true;
      joinedAt = now;
    };
    let lobby : Types.Lobby = {
      code;
      hostId;
      var players = [host];
      var status = #waiting;
      var maxPlayers = maxPlayers;
      createdAt = now;
      var gameId = null;
    };
    lobbies.add(code, lobby);
    toLobbyView(lobby);
  };

  public func joinLobby(
    lobbies : Map.Map<Types.LobbyCode, Types.Lobby>,
    code : Types.LobbyCode,
    playerId : Types.PlayerId,
    username : Text,
    avatarId : Types.AvatarId,
    now : Types.Timestamp,
  ) : { #ok : Types.LobbyView; #err : Types.LobbyError } {
    switch (lobbies.get(code)) {
      case null { #err(#lobbyNotFound) };
      case (?lobby) {
        if (lobby.status != #waiting) { return #err(#lobbyAlreadyStarted) };
        if (lobby.players.size() >= lobby.maxPlayers) { return #err(#lobbyFull) };
        let alreadyIn = lobby.players.find(func p = p.id == playerId);
        switch (alreadyIn) {
          case (?_) { return #err(#alreadyInLobby) };
          case null {};
        };
        let newPlayer : Types.LobbyPlayer = {
          id = playerId;
          username;
          avatarId;
          isReady = false;
          isHost = false;
          joinedAt = now;
        };
        lobby.players := lobby.players.concat([newPlayer]);
        #ok(toLobbyView(lobby));
      };
    };
  };

  public func setReady(
    lobbies : Map.Map<Types.LobbyCode, Types.Lobby>,
    code : Types.LobbyCode,
    playerId : Types.PlayerId,
    ready : Bool,
  ) : { #ok : Types.LobbyView; #err : Types.LobbyError } {
    switch (lobbies.get(code)) {
      case null { #err(#lobbyNotFound) };
      case (?lobby) {
        let found = lobby.players.find(func p = p.id == playerId);
        switch (found) {
          case null { #err(#notInLobby) };
          case (?_) {
            lobby.players := lobby.players.map<Types.LobbyPlayer, Types.LobbyPlayer>(
              func(p) {
                if (p.id == playerId) { { p with isReady = ready } } else { p };
              }
            );
            #ok(toLobbyView(lobby));
          };
        };
      };
    };
  };

  public func getLobby(
    lobbies : Map.Map<Types.LobbyCode, Types.Lobby>,
    code : Types.LobbyCode,
  ) : ?Types.LobbyView {
    switch (lobbies.get(code)) {
      case null { null };
      case (?lobby) { ?toLobbyView(lobby) };
    };
  };

  public func leaveLobby(
    lobbies : Map.Map<Types.LobbyCode, Types.Lobby>,
    code : Types.LobbyCode,
    playerId : Types.PlayerId,
  ) : { #ok; #err : Types.LobbyError } {
    switch (lobbies.get(code)) {
      case null { #err(#lobbyNotFound) };
      case (?lobby) {
        let found = lobby.players.find(func p = p.id == playerId);
        switch (found) {
          case null { #err(#notInLobby) };
          case (?_) {
            lobby.players := lobby.players.filter(func p = not (p.id == playerId));
            if (lobby.players.size() == 0) {
              lobbies.remove(code);
            } else if (lobby.hostId == playerId) {
              let newHost = lobby.players[0];
              lobby.players := lobby.players.map<Types.LobbyPlayer, Types.LobbyPlayer>(
                func(p) {
                  if (p.id == newHost.id) { { p with isHost = true } } else { p };
                }
              );
            };
            #ok;
          };
        };
      };
    };
  };

  // ─── Game Initialisation ──────────────────────────────────────────────────

  public func initGame(
    games : Map.Map<Types.GameId, Types.GameSession>,
    lobby : Types.Lobby,
    gameId : Types.GameId,
    now : Types.Timestamp,
  ) : Types.GameSessionView {
    let startingBalance : Types.Money = 1500;
    let players = lobby.players.map<Types.LobbyPlayer, Types.PlayerState>(
      func(lp) {
        {
          id = lp.id;
          username = lp.username;
          avatarId = lp.avatarId;
          var position = 0;
          var balance = startingBalance;
          var ownedSpaces = [];
          var jailStatus = #notInJail;
          var isBankrupt = false;
          var getOutOfJailCards = 0;
          var lastSeenAt = now;
        };
      }
    );
    let game : Types.GameSession = {
      id = gameId;
      lobbyCode = lobby.code;
      var players;
      var ownedProperties = [];
      var currentPlayerIndex = 0;
      var turnPhase = #roll;
      var status = #active;
      var lastDiceRoll = null;
      var pendingTrade = null;
      var chanceCards = buildChanceDeck();
      var communityChestCards = buildCommunityChestDeck();
      var nextTradeId = 0;
      startedAt = now;
      var updatedAt = now;
    };
    games.add(gameId, game);
    toGameView(game);
  };

  // ─── Dice ─────────────────────────────────────────────────────────────────

  public func rollDice(seed : Nat) : Types.DiceRoll {
    let s1 = prng(seed, 6) + 1;
    let s2 = prng(seed + 7, 6) + 1;
    { die1 = s1; die2 = s2 };
  };

  // ─── Move Player ──────────────────────────────────────────────────────────

  public func movePlayer(
    game : Types.GameSession,
    _board : [Types.BoardSpace],
    playerId : Types.PlayerId,
    roll : Types.DiceRoll,
  ) : { newPosition : Types.BoardPosition; passedGo : Bool } {
    let total = roll.die1 + roll.die2;
    let playerOpt = game.players.find(func p = p.id == playerId);
    let player = switch (playerOpt) {
      case (?p) { p };
      case null { Runtime.trap("player not found") };
    };
    let oldPos = player.position;
    let newPos = (oldPos + total) % 40;
    let passedGo = (oldPos + total) >= 40;
    player.position := newPos;
    if (passedGo) {
      player.balance := player.balance + 200;
    };
    { newPosition = newPos; passedGo };
  };

  // ─── Resolve Landing ──────────────────────────────────────────────────────

  public func resolveLanding(
    game : Types.GameSession,
    board : [Types.BoardSpace],
    playerId : Types.PlayerId,
  ) : Types.TurnPhaseView {
    let playerOpt = game.players.find(func p = p.id == playerId);
    let player = switch (playerOpt) {
      case (?p) { p };
      case null { Runtime.trap("player not found") };
    };
    let space = board[player.position];
    switch (space.spaceType) {
      case (#go) { #endTurn };
      case (#freeParking) { #endTurn };
      case (#jail) { #endTurn };
      case (#goToJail) {
        player.position := 10;
        player.jailStatus := #inJail({ turnsRemaining = 3; hasGetOutCard = player.getOutOfJailCards > 0 });
        #endTurn;
      };
      case (#incomeTax) {
        player.balance := player.balance - 200;
        checkBankruptcyInline(game, playerId, null);
        #endTurn;
      };
      case (#luxuryTax) {
        player.balance := player.balance - 75;
        checkBankruptcyInline(game, playerId, null);
        #endTurn;
      };
      case (#chance) { #landAndAct };
      case (#communityChest) { #landAndAct };
      case (#property(deed)) {
        resolvePropertyLanding(game, board, playerId, player, deed);
      };
      case (#railroad(deed)) {
        resolvePropertyLanding(game, board, playerId, player, deed);
      };
      case (#utility(deed)) {
        resolvePropertyLanding(game, board, playerId, player, deed);
      };
    };
  };

  func resolvePropertyLanding(
    game : Types.GameSession,
    _board : [Types.BoardSpace],
    playerId : Types.PlayerId,
    player : Types.PlayerState,
    deed : Types.PropertyDeed,
  ) : Types.TurnPhaseView {
    let ownedOpt = game.ownedProperties.find(func op = op.deed.spaceId == deed.spaceId);
    switch (ownedOpt) {
      case null { #landAndAct };
      case (?owned) {
        if (owned.ownerId == playerId) { return #endTurn };
        if (owned.isMortgaged) { return #endTurn };
        let lastRoll = switch (game.lastDiceRoll) {
          case (?r) { r };
          case null { { die1 = 1; die2 = 1 } };
        };
        let rent = calculateRent(game, deed.spaceId, lastRoll);
        player.balance := player.balance - rent;
        let creditorOpt = game.players.find(func p = p.id == owned.ownerId);
        switch (creditorOpt) {
          case (?creditor) { creditor.balance := creditor.balance + rent };
          case null {};
        };
        checkBankruptcyInline(game, playerId, ?owned.ownerId);
        #endTurn;
      };
    };
  };

  // ─── Rent Calculation ─────────────────────────────────────────────────────

  func countRailroads(game : Types.GameSession, ownerId : Types.PlayerId) : Nat {
    game.ownedProperties.filter(
      func op = op.ownerId == ownerId and
        op.deed.colorGroup == #railroad and
        not op.isMortgaged
    ).size();
  };

  func countUtilities(game : Types.GameSession, ownerId : Types.PlayerId) : Nat {
    game.ownedProperties.filter(
      func op = op.ownerId == ownerId and
        op.deed.colorGroup == #utility and
        not op.isMortgaged
    ).size();
  };

  func ownsColorGroup(game : Types.GameSession, ownerId : Types.PlayerId, colorGroup : Types.ColorGroup) : Bool {
    let groupSize : Nat = switch (colorGroup) {
      case (#brown) { 2 };
      case (#darkBlue) { 2 };
      case (#lightBlue) { 3 };
      case (#pink) { 3 };
      case (#orange) { 3 };
      case (#red) { 3 };
      case (#yellow) { 3 };
      case (#green) { 3 };
      case (#railroad) { 4 };
      case (#utility) { 2 };
    };
    let owned = game.ownedProperties.filter(
      func op = op.ownerId == ownerId and op.deed.colorGroup == colorGroup
    ).size();
    owned >= groupSize;
  };

  public func calculateRent(
    game : Types.GameSession,
    spaceId : Types.SpaceId,
    roll : Types.DiceRoll,
  ) : Types.Money {
    let ownedOpt = game.ownedProperties.find(func op = op.deed.spaceId == spaceId);
    switch (ownedOpt) {
      case null { 0 };
      case (?owned) {
        if (owned.isMortgaged) { return 0 };
        let deed = owned.deed;
        switch (deed.colorGroup) {
          case (#railroad) {
            let count = countRailroads(game, owned.ownerId);
            switch (count) {
              case 1 { 25 };
              case 2 { 50 };
              case 3 { 100 };
              case _ { 200 };
            };
          };
          case (#utility) {
            let count = countUtilities(game, owned.ownerId);
            let diceTotal = roll.die1 + roll.die2;
            if (count == 2) { diceTotal * 10 } else { diceTotal * 4 };
          };
          case (_) {
            let level = owned.upgradeLevel;
            if (level == 0) {
              if (ownsColorGroup(game, owned.ownerId, deed.colorGroup)) {
                deed.rentBase * 2;
              } else {
                deed.rentBase;
              };
            } else if (level == 1) { deed.rentHouse1 }
            else if (level == 2) { deed.rentHouse2 }
            else if (level == 3) { deed.rentHouse3 }
            else if (level == 4) { deed.rentHouse4 }
            else { deed.rentHotel };
          };
        };
      };
    };
  };

  // ─── Property Purchase ────────────────────────────────────────────────────

  public func buyProperty(
    game : Types.GameSession,
    playerId : Types.PlayerId,
    spaceId : Types.SpaceId,
  ) : { #ok : Types.GameSessionView; #err : Types.GameError } {
    let playerOpt = game.players.find(func p = p.id == playerId);
    let player = switch (playerOpt) {
      case (?p) { p };
      case null { return #err(#playerNotFound) };
    };
    let alreadyOwned = game.ownedProperties.find(func op = op.deed.spaceId == spaceId);
    switch (alreadyOwned) {
      case (?_) { return #err(#propertyAlreadyOwned) };
      case null {};
    };
    let boardOpt = buildBoard().find(func bs = bs.id == spaceId);
    let deed = switch (boardOpt) {
      case (?bs) {
        switch (bs.spaceType) {
          case (#property(d)) { d };
          case (#railroad(d)) { d };
          case (#utility(d)) { d };
          case (_) { return #err(#propertyNotOwned) };
        };
      };
      case null { return #err(#propertyNotOwned) };
    };
    if (player.balance < deed.purchasePrice) {
      return #err(#insufficientFunds);
    };
    player.balance := player.balance - deed.purchasePrice;
    player.ownedSpaces := player.ownedSpaces.concat([spaceId]);
    let newOwned : Types.OwnedProperty = {
      deed;
      ownerId = playerId;
      var upgradeLevel = 0;
      var isMortgaged = false;
    };
    game.ownedProperties := game.ownedProperties.concat([newOwned]);
    game.updatedAt := Time.now();
    #ok(toGameView(game));
  };

  // ─── Upgrade ──────────────────────────────────────────────────────────────

  public func upgradeProperty(
    game : Types.GameSession,
    playerId : Types.PlayerId,
    spaceId : Types.SpaceId,
  ) : { #ok : Types.GameSessionView; #err : Types.GameError } {
    let playerOpt = game.players.find(func p = p.id == playerId);
    let player = switch (playerOpt) {
      case (?p) { p };
      case null { return #err(#playerNotFound) };
    };
    let ownedOpt = game.ownedProperties.find(func op = op.deed.spaceId == spaceId and op.ownerId == playerId);
    let owned = switch (ownedOpt) {
      case (?o) { o };
      case null { return #err(#propertyNotOwned) };
    };
    if (owned.isMortgaged) { return #err(#alreadyMortgaged) };
    if (owned.upgradeLevel >= 5) { return #err(#maxUpgradeReached) };
    if (not ownsColorGroup(game, playerId, owned.deed.colorGroup)) {
      return #err(#propertyNotOwned);
    };
    let cost = owned.deed.housePrice;
    if (player.balance < cost) { return #err(#insufficientFunds) };
    player.balance := player.balance - cost;
    owned.upgradeLevel := owned.upgradeLevel + 1;
    game.updatedAt := Time.now();
    #ok(toGameView(game));
  };

  // ─── Mortgage ─────────────────────────────────────────────────────────────

  public func mortgageProperty(
    game : Types.GameSession,
    playerId : Types.PlayerId,
    spaceId : Types.SpaceId,
  ) : { #ok : Types.GameSessionView; #err : Types.GameError } {
    let playerOpt = game.players.find(func p = p.id == playerId);
    let player = switch (playerOpt) {
      case (?p) { p };
      case null { return #err(#playerNotFound) };
    };
    let ownedOpt = game.ownedProperties.find(func op = op.deed.spaceId == spaceId and op.ownerId == playerId);
    let owned = switch (ownedOpt) {
      case (?o) { o };
      case null { return #err(#propertyNotOwned) };
    };
    if (owned.isMortgaged) { return #err(#alreadyMortgaged) };
    owned.isMortgaged := true;
    player.balance := player.balance + owned.deed.mortgageValue;
    game.updatedAt := Time.now();
    #ok(toGameView(game));
  };

  public func unmortgageProperty(
    game : Types.GameSession,
    playerId : Types.PlayerId,
    spaceId : Types.SpaceId,
  ) : { #ok : Types.GameSessionView; #err : Types.GameError } {
    let playerOpt = game.players.find(func p = p.id == playerId);
    let player = switch (playerOpt) {
      case (?p) { p };
      case null { return #err(#playerNotFound) };
    };
    let ownedOpt = game.ownedProperties.find(func op = op.deed.spaceId == spaceId and op.ownerId == playerId);
    let owned = switch (ownedOpt) {
      case (?o) { o };
      case null { return #err(#propertyNotOwned) };
    };
    if (not owned.isMortgaged) { return #err(#notMortgaged) };
    let unmortgageCost = owned.deed.mortgageValue + owned.deed.mortgageValue / 10;
    if (player.balance < unmortgageCost) { return #err(#insufficientFunds) };
    player.balance := player.balance - unmortgageCost;
    owned.isMortgaged := false;
    game.updatedAt := Time.now();
    #ok(toGameView(game));
  };

  // ─── Auction ──────────────────────────────────────────────────────────────

  public func startAuction(
    game : Types.GameSession,
    spaceId : Types.SpaceId,
    now : Types.Timestamp,
  ) : Types.GameSessionView {
    let auctionState : Types.AuctionState = {
      spaceId;
      var bids = [];
      var isOpen = true;
      startedAt = now;
    };
    game.turnPhase := #auction(auctionState);
    game.updatedAt := now;
    toGameView(game);
  };

  public func placeBid(
    game : Types.GameSession,
    bidderId : Types.PlayerId,
    amount : Types.Money,
    now : Types.Timestamp,
  ) : { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (game.turnPhase) {
      case (#auction(auction)) {
        if (not auction.isOpen) { return #err(#invalidPhase) };
        let maxBid = auction.bids.foldLeft<Types.AuctionBid, Types.Money>(
          0,
          func(acc, bid : Types.AuctionBid) { if (bid.amount > acc) bid.amount else acc }
        );
        if (amount <= maxBid) { return #err(#invalidBid) };
        let bidderOpt = game.players.find(func p = p.id == bidderId);
        let bidder = switch (bidderOpt) {
          case (?p) { p };
          case null { return #err(#playerNotFound) };
        };
        if (bidder.balance < amount) { return #err(#insufficientFunds) };
        let newBid : Types.AuctionBid = { bidderId; amount; placedAt = now };
        auction.bids := auction.bids.concat([newBid]);
        game.updatedAt := now;
        #ok(toGameView(game));
      };
      case (_) { #err(#invalidPhase) };
    };
  };

  public func resolveAuction(
    game : Types.GameSession,
    now : Types.Timestamp,
  ) : { #ok : Types.GameSessionView; #err : Types.GameError } {
    switch (game.turnPhase) {
      case (#auction(auction)) {
        auction.isOpen := false;
        if (auction.bids.size() == 0) {
          game.turnPhase := #endTurn;
          game.updatedAt := now;
          return #ok(toGameView(game));
        };
        var winner : ?Types.AuctionBid = null;
        for (bid in auction.bids.values()) {
          switch (winner) {
            case null { winner := ?bid };
            case (?w) { if (bid.amount > w.amount) { winner := ?bid } };
          };
        };
        switch (winner) {
          case null {
            game.turnPhase := #endTurn;
            game.updatedAt := now;
            #ok(toGameView(game));
          };
          case (?w) {
            let boardOpt = buildBoard().find(func bs = bs.id == auction.spaceId);
            let deed = switch (boardOpt) {
              case (?bs) {
                switch (bs.spaceType) {
                  case (#property(d)) { d };
                  case (#railroad(d)) { d };
                  case (#utility(d)) { d };
                  case (_) {
                    game.turnPhase := #endTurn;
                    game.updatedAt := now;
                    return #ok(toGameView(game));
                  };
                };
              };
              case null {
                game.turnPhase := #endTurn;
                game.updatedAt := now;
                return #ok(toGameView(game));
              };
            };
            let winnerPlayerOpt = game.players.find(func p = p.id == w.bidderId);
            switch (winnerPlayerOpt) {
              case null {
                game.turnPhase := #endTurn;
                game.updatedAt := now;
                return #ok(toGameView(game));
              };
              case (?wp) {
                wp.balance := wp.balance - w.amount;
                wp.ownedSpaces := wp.ownedSpaces.concat([auction.spaceId]);
                let newOwned : Types.OwnedProperty = {
                  deed;
                  ownerId = w.bidderId;
                  var upgradeLevel = 0;
                  var isMortgaged = false;
                };
                game.ownedProperties := game.ownedProperties.concat([newOwned]);
                game.turnPhase := #endTurn;
                game.updatedAt := now;
                #ok(toGameView(game));
              };
            };
          };
        };
      };
      case (_) { #err(#invalidPhase) };
    };
  };

  // ─── Cards ────────────────────────────────────────────────────────────────

  public func drawCard(
    game : Types.GameSession,
    board : [Types.BoardSpace],
    playerId : Types.PlayerId,
    deckType : Types.CardDeckType,
    now : Types.Timestamp,
  ) : { card : Types.Card; updatedGame : Types.GameSessionView } {
    let playerOpt = game.players.find(func p = p.id == playerId);
    let player = switch (playerOpt) {
      case (?p) { p };
      case null { Runtime.trap("player not found") };
    };
    // Refill deck if needed, then rotate: draw from front, append to back
    let (card, newDeck) = switch (deckType) {
      case (#chance) {
        if (game.chanceCards.size() == 0) {
          game.chanceCards := buildChanceDeck();
        };
        let c = game.chanceCards[0];
        let rest = game.chanceCards.sliceToArray(1, game.chanceCards.size());
        (c, rest);
      };
      case (#communityChest) {
        if (game.communityChestCards.size() == 0) {
          game.communityChestCards := buildCommunityChestDeck();
        };
        let c = game.communityChestCards[0];
        let rest = game.communityChestCards.sliceToArray(1, game.communityChestCards.size());
        (c, rest);
      };
    };
    switch (deckType) {
      case (#chance) { game.chanceCards := newDeck.concat([card]) };
      case (#communityChest) { game.communityChestCards := newDeck.concat([card]) };
    };
    applyCardEffect(game, board, player, card, now);
    game.updatedAt := now;
    { card; updatedGame = toGameView(game) };
  };

  func applyCardEffect(
    game : Types.GameSession,
    board : [Types.BoardSpace],
    player : Types.PlayerState,
    card : Types.Card,
    _now : Types.Timestamp,
  ) {
    switch (card.effect) {
      case (#collectMoney(amount)) {
        player.balance := player.balance + amount;
      };
      case (#payMoney(amount)) {
        player.balance := player.balance - amount;
        checkBankruptcyInline(game, player.id, null);
      };
      case (#moveToSpace(target)) {
        let oldPos = player.position;
        player.position := target;
        // Collect $200 if passing or landing on GO
        if (target == 0 or (target < oldPos)) {
          player.balance := player.balance + 200;
        };
        ignore resolveLanding(game, board, player.id);
      };
      case (#moveSpaces(steps)) {
        let oldPos = player.position;
        let newPos : Nat = if (steps >= 0) {
          (oldPos + Int.abs(steps)) % 40;
        } else {
          let back = Int.abs(steps);
          if (oldPos >= back) { oldPos - back } else { 40 + oldPos - back };
        };
        if (newPos < oldPos and steps > 0) {
          player.balance := player.balance + 200;
        };
        player.position := newPos;
        ignore resolveLanding(game, board, player.id);
      };
      case (#getOutOfJailFree) {
        player.getOutOfJailCards := player.getOutOfJailCards + 1;
      };
      case (#goToJail) {
        player.position := 10;
        player.jailStatus := #inJail({ turnsRemaining = 3; hasGetOutCard = player.getOutOfJailCards > 0 });
      };
      case (#payPerHouse(costPerHouse)) {
        var totalCost : Types.Money = 0;
        for (op in game.ownedProperties.values()) {
          if (op.ownerId == player.id) {
            totalCost := totalCost + op.upgradeLevel * costPerHouse;
          };
        };
        player.balance := player.balance - totalCost;
        checkBankruptcyInline(game, player.id, null);
      };
      case (#collectFromPlayers(amount)) {
        if (amount > 0) {
          // Collect from each other player
          for (p in game.players.values()) {
            if (not (p.id == player.id) and not p.isBankrupt) {
              p.balance := p.balance - amount;
              player.balance := player.balance + amount;
            };
          };
        } else {
          // Pay each other player
          let pay = Int.abs(amount);
          for (p in game.players.values()) {
            if (not (p.id == player.id) and not p.isBankrupt) {
              player.balance := player.balance - pay;
              p.balance := p.balance + pay;
            };
          };
          checkBankruptcyInline(game, player.id, null);
        };
      };
    };
  };

  // ─── Jail ─────────────────────────────────────────────────────────────────

  public func sendToJail(
    game : Types.GameSession,
    playerId : Types.PlayerId,
  ) : Types.GameSessionView {
    let playerOpt = game.players.find(func p = p.id == playerId);
    switch (playerOpt) {
      case null { Runtime.trap("player not found") };
      case (?player) {
        player.position := 10;
        player.jailStatus := #inJail({ turnsRemaining = 3; hasGetOutCard = player.getOutOfJailCards > 0 });
        game.turnPhase := #endTurn;
        game.updatedAt := Time.now();
        toGameView(game);
      };
    };
  };

  public func payJailFine(
    game : Types.GameSession,
    playerId : Types.PlayerId,
  ) : { #ok : Types.GameSessionView; #err : Types.GameError } {
    let playerOpt = game.players.find(func p = p.id == playerId);
    let player = switch (playerOpt) {
      case (?p) { p };
      case null { return #err(#playerNotFound) };
    };
    switch (player.jailStatus) {
      case (#notInJail) { return #err(#notInJail) };
      case (#inJail(_)) {
        if (player.balance < 50) { return #err(#insufficientFunds) };
        player.balance := player.balance - 50;
        player.jailStatus := #notInJail;
        game.updatedAt := Time.now();
        #ok(toGameView(game));
      };
    };
  };

  public func useGetOutOfJailCard(
    game : Types.GameSession,
    playerId : Types.PlayerId,
  ) : { #ok : Types.GameSessionView; #err : Types.GameError } {
    let playerOpt = game.players.find(func p = p.id == playerId);
    let player = switch (playerOpt) {
      case (?p) { p };
      case null { return #err(#playerNotFound) };
    };
    switch (player.jailStatus) {
      case (#notInJail) { return #err(#notInJail) };
      case (#inJail(_)) {
        if (player.getOutOfJailCards == 0) { return #err(#notInJail) };
        player.getOutOfJailCards := player.getOutOfJailCards - 1;
        player.jailStatus := #notInJail;
        game.updatedAt := Time.now();
        #ok(toGameView(game));
      };
    };
  };

  // ─── Trading ──────────────────────────────────────────────────────────────

  public func proposeTrade(
    game : Types.GameSession,
    proposerId : Types.PlayerId,
    recipientId : Types.PlayerId,
    proposerSpaces : [Types.SpaceId],
    proposerMoney : Types.Money,
    recipientSpaces : [Types.SpaceId],
    recipientMoney : Types.Money,
    now : Types.Timestamp,
  ) : { #ok : Types.GameSessionView; #err : Types.GameError } {
    let proposerOpt = game.players.find(func p = p.id == proposerId);
    let proposer = switch (proposerOpt) {
      case (?p) { p };
      case null { return #err(#playerNotFound) };
    };
    if (proposer.balance < proposerMoney) { return #err(#insufficientFunds) };
    let tradeId = game.nextTradeId;
    game.nextTradeId := tradeId + 1;
    let trade : Types.TradeOffer = {
      id = tradeId;
      proposerId;
      recipientId;
      proposerSpaces;
      proposerMoney;
      recipientSpaces;
      recipientMoney;
      var status = #pending;
      createdAt = now;
    };
    game.pendingTrade := ?trade;
    game.updatedAt := now;
    #ok(toGameView(game));
  };

  public func acceptTrade(
    game : Types.GameSession,
    recipientId : Types.PlayerId,
    tradeId : Nat,
  ) : { #ok : Types.GameSessionView; #err : Types.GameError } {
    let trade = switch (game.pendingTrade) {
      case null { return #err(#tradeNotFound) };
      case (?t) { t };
    };
    if (trade.id != tradeId) { return #err(#tradeNotFound) };
    if (not (trade.recipientId == recipientId)) { return #err(#notTradeParticipant) };
    if (trade.status != #pending) { return #err(#tradeNotFound) };

    let proposerOpt = game.players.find(func p = p.id == trade.proposerId);
    let proposer = switch (proposerOpt) {
      case (?p) { p };
      case null { return #err(#playerNotFound) };
    };
    let recipientOpt = game.players.find(func p = p.id == recipientId);
    let recipient = switch (recipientOpt) {
      case (?p) { p };
      case null { return #err(#playerNotFound) };
    };
    if (proposer.balance < trade.proposerMoney) { return #err(#insufficientFunds) };
    if (recipient.balance < trade.recipientMoney) { return #err(#insufficientFunds) };

    // Transfer money atomically
    proposer.balance := proposer.balance - trade.proposerMoney + trade.recipientMoney;
    recipient.balance := recipient.balance - trade.recipientMoney + trade.proposerMoney;

    // Transfer proposer's properties to recipient
    for (sid in trade.proposerSpaces.values()) {
      game.ownedProperties := game.ownedProperties.map<Types.OwnedProperty, Types.OwnedProperty>(
        func(op) {
          if (op.deed.spaceId == sid and op.ownerId == trade.proposerId) {
            { deed = op.deed; ownerId = recipientId; var upgradeLevel = op.upgradeLevel; var isMortgaged = op.isMortgaged }
          } else { op };
        }
      );
      proposer.ownedSpaces := proposer.ownedSpaces.filter(func s = s != sid);
      recipient.ownedSpaces := recipient.ownedSpaces.concat([sid]);
    };

    // Transfer recipient's properties to proposer
    for (sid in trade.recipientSpaces.values()) {
      game.ownedProperties := game.ownedProperties.map<Types.OwnedProperty, Types.OwnedProperty>(
        func(op) {
          if (op.deed.spaceId == sid and op.ownerId == recipientId) {
            { deed = op.deed; ownerId = trade.proposerId; var upgradeLevel = op.upgradeLevel; var isMortgaged = op.isMortgaged }
          } else { op };
        }
      );
      recipient.ownedSpaces := recipient.ownedSpaces.filter(func s = s != sid);
      proposer.ownedSpaces := proposer.ownedSpaces.concat([sid]);
    };

    trade.status := #accepted;
    game.pendingTrade := null;
    game.updatedAt := Time.now();
    #ok(toGameView(game));
  };

  public func declineTrade(
    game : Types.GameSession,
    recipientId : Types.PlayerId,
    tradeId : Nat,
  ) : { #ok : Types.GameSessionView; #err : Types.GameError } {
    let trade = switch (game.pendingTrade) {
      case null { return #err(#tradeNotFound) };
      case (?t) { t };
    };
    if (trade.id != tradeId) { return #err(#tradeNotFound) };
    if (not (trade.recipientId == recipientId)) { return #err(#notTradeParticipant) };
    trade.status := #declined;
    game.pendingTrade := null;
    game.updatedAt := Time.now();
    #ok(toGameView(game));
  };

  // ─── Bankruptcy ───────────────────────────────────────────────────────────

  func checkBankruptcyInline(
    game : Types.GameSession,
    playerId : Types.PlayerId,
    creditorId : ?Types.PlayerId,
  ) {
    let playerOpt = game.players.find(func p = p.id == playerId);
    switch (playerOpt) {
      case null {};
      case (?player) {
        if (player.isBankrupt or player.balance >= 0) { return };
        // Try to cover by mortgaging unmortgaged properties
        for (op in game.ownedProperties.values()) {
          if (op.ownerId == playerId and not op.isMortgaged and player.balance < 0) {
            op.isMortgaged := true;
            player.balance := player.balance + op.deed.mortgageValue;
          };
        };
        if (player.balance >= 0) { return };
        // Still bankrupt — liquidate all properties
        switch (creditorId) {
          case (?cid) {
            let creditorOpt = game.players.find(func p = p.id == cid);
            switch (creditorOpt) {
              case (?creditor) {
                // Transfer all properties to creditor
                game.ownedProperties := game.ownedProperties.map<Types.OwnedProperty, Types.OwnedProperty>(
                  func(op) {
                    if (op.ownerId == playerId) {
                      creditor.ownedSpaces := creditor.ownedSpaces.concat([op.deed.spaceId]);
                      { deed = op.deed; ownerId = cid; var upgradeLevel = op.upgradeLevel; var isMortgaged = op.isMortgaged }
                    } else { op };
                  }
                );
                if (player.balance > 0) {
                  creditor.balance := creditor.balance + player.balance;
                };
              };
              case null {
                // Creditor not found — return to bank
                game.ownedProperties := game.ownedProperties.filter(
                  func op = not (op.ownerId == playerId)
                );
              };
            };
          };
          case null {
            // Return to bank
            game.ownedProperties := game.ownedProperties.filter(
              func op = not (op.ownerId == playerId)
            );
          };
        };
        player.balance := 0;
        player.ownedSpaces := [];
        player.isBankrupt := true;
        ignore checkWinCondition(game);
      };
    };
  };

  public func checkBankruptcy(
    game : Types.GameSession,
    playerId : Types.PlayerId,
    creditorId : ?Types.PlayerId,
  ) : Types.GameSessionView {
    checkBankruptcyInline(game, playerId, creditorId);
    toGameView(game);
  };

  public func checkWinCondition(game : Types.GameSession) : ?Types.PlayerId {
    let activePlayers = game.players.filter(func p = not p.isBankrupt);
    if (activePlayers.size() == 1) {
      let winner = activePlayers[0];
      game.status := #finished({ winnerId = winner.id });
      ?winner.id;
    } else {
      null;
    };
  };

  // ─── Turn Management ──────────────────────────────────────────────────────

  public func nextTurn(
    game : Types.GameSession,
    now : Types.Timestamp,
  ) : Types.GameSessionView {
    let total = game.players.size();
    var next = (game.currentPlayerIndex + 1) % total;
    var count = 0;
    while (game.players[next].isBankrupt and count < total) {
      next := (next + 1) % total;
      count := count + 1;
    };
    game.currentPlayerIndex := next;
    game.turnPhase := #roll;
    game.updatedAt := now;
    toGameView(game);
  };

  // ─── Heartbeat ────────────────────────────────────────────────────────────

  public func heartbeat(
    game : Types.GameSession,
    playerId : Types.PlayerId,
    now : Types.Timestamp,
  ) : () {
    let playerOpt = game.players.find(func p = p.id == playerId);
    switch (playerOpt) {
      case null {};
      case (?player) { player.lastSeenAt := now };
    };
  };
};
