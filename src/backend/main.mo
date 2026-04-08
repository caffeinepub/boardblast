import Types "types/game-types";
import GameMixin "mixins/game-types-api";
import GameLib "lib/game-types";
import Map "mo:core/Map";

actor {
  let lobbies = Map.empty<Types.LobbyCode, Types.Lobby>();
  let games   = Map.empty<Types.GameId,    Types.GameSession>();
  let board   = GameLib.buildBoard();

  include GameMixin(lobbies, games, board);
};
