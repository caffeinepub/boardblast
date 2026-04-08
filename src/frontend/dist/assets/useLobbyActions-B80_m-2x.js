import { b as useNavigate, c as useQueryClient, a as ue } from "./index-YS-crX1h.js";
import { u as useMutation, a as useActor, c as createActor } from "./backend-B9dksDXo.js";
import { u as useGameStore } from "./gameStore-BkgthZgj.js";
function useActorInstance() {
  return useActor(createActor);
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
      ue.error(`Failed to create lobby: ${err.message}`);
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
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (lobby) => {
      setLobbyState(lobby);
      navigate({ to: "/lobby/$code", params: { code: lobby.code } });
      ue.success("🎮 Joined lobby!");
    },
    onError: (err) => {
      ue.error(`Failed to join lobby: ${err.message}`);
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
      ue.error(`Failed to leave lobby: ${err.message}`);
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
      ue.error(`Failed to start game: ${err.message}`);
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
