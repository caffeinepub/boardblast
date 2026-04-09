import { b as useNavigate, c as useQueryClient, a as ue } from "./index-xRF9tkV2.js";
import { u as useMutation, a as useActor, c as createActor } from "./backend-BxTSFiBD.js";
import { u as useGameStore } from "./gameStore-EujuzfF-.js";
function useActorInstance() {
  return useActor(createActor);
}
function friendlyLobbyError(raw) {
  const map = {
    alreadyInLobby: "You're already in a lobby. Reconnecting you now…",
    lobbyNotFound: "Lobby not found. Double-check the code and try again.",
    lobbyFull: "This lobby is full — try another game or create your own.",
    lobbyAlreadyStarted: "This game has already started and can't accept new players.",
    notInLobby: "You're not in this lobby.",
    notEnoughPlayers: "Not enough players to start. Need at least 2.",
    alreadyReady: "You're already marked as ready.",
    notHost: "Only the host can start the game.",
    gameAlreadyExists: "A game session already exists for this lobby."
  };
  return map[raw] ?? `Something went wrong (${raw}). Please try again.`;
}
function useCreateLobby() {
  const { actor } = useActorInstance();
  const navigate = useNavigate();
  const { setLobbyState } = useGameStore();
  return useMutation({
    mutationFn: async ({
      username,
      avatarId,
      maxPlayers
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createLobby(username, avatarId, maxPlayers);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (lobby) => {
      setLobbyState(lobby);
      navigate({ to: "/lobby/$code", params: { code: lobby.code } });
      ue.success(`🎉 Lobby created! Code: ${lobby.code}`);
    },
    onError: (err) => {
      ue.error(friendlyLobbyError(err.message));
    }
  });
}
function useJoinLobby() {
  const { actor } = useActorInstance();
  const navigate = useNavigate();
  const { setLobbyState } = useGameStore();
  return useMutation({
    mutationFn: async ({
      code,
      username,
      avatarId
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.joinLobby(code, username, avatarId);
      if (result.__kind__ === "err" && result.err === "alreadyInLobby") {
        ue.info("🔄 Reconnecting to lobby…");
        try {
          await actor.leaveLobby(code);
        } catch {
        }
        const retry = await actor.joinLobby(code, username, avatarId);
        if (retry.__kind__ === "err") throw new Error(retry.err);
        return retry.ok;
      }
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (lobby) => {
      setLobbyState(lobby);
      navigate({ to: "/lobby/$code", params: { code: lobby.code } });
      ue.success("🎮 Joined lobby!");
    },
    onError: (err) => {
      ue.error(friendlyLobbyError(err.message));
    }
  });
}
function useLeaveLobby() {
  const { actor } = useActorInstance();
  const navigate = useNavigate();
  const { setLobbyState } = useGameStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.leaveLobby(code);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      setLobbyState(null);
      queryClient.removeQueries({ queryKey: ["lobby"] });
      navigate({ to: "/" });
    },
    onError: (err) => {
      ue.error(friendlyLobbyError(err.message));
    }
  });
}
function useSetReady() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setLobbyState } = useGameStore();
  return useMutation({
    mutationFn: async ({
      code,
      ready
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.setReady(code, ready);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (lobby) => {
      setLobbyState(lobby);
      queryClient.invalidateQueries({ queryKey: ["lobby", lobby.code] });
    },
    onError: (err) => {
      ue.error(friendlyLobbyError(err.message));
    }
  });
}
function useStartGame() {
  const { actor } = useActorInstance();
  const navigate = useNavigate();
  const { setGameSession, setLobbyState } = useGameStore();
  return useMutation({
    mutationFn: async (code) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.startGame(code);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      setLobbyState(null);
      navigate({ to: "/game/$gameId", params: { gameId: session.id } });
      ue.success("🎲 Game started! Good luck!");
    },
    onError: (err) => {
      ue.error(friendlyLobbyError(err.message));
    }
  });
}
export {
  useJoinLobby as a,
  useSetReady as b,
  useStartGame as c,
  useLeaveLobby as d,
  useCreateLobby as u
};
