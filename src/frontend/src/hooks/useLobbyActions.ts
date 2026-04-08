import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { createActor } from "../backend";
import { useGameStore } from "../store/gameStore";
import type { AvatarId, LobbyCode } from "../types/game";

function useActorInstance() {
  return useActor(createActor);
}

export function useCreateLobby() {
  const { actor } = useActorInstance();
  const navigate = useNavigate();
  const { setLobbyState } = useGameStore();

  return useMutation({
    mutationFn: async ({
      username,
      avatarId,
      maxPlayers,
    }: {
      username: string;
      avatarId: AvatarId;
      maxPlayers: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createLobby(username, avatarId, maxPlayers);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (lobby) => {
      setLobbyState(lobby);
      navigate({ to: "/lobby/$code", params: { code: lobby.code } });
      toast.success(`🎉 Lobby created! Code: ${lobby.code}`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to create lobby: ${err.message}`);
    },
  });
}

export function useJoinLobby() {
  const { actor } = useActorInstance();
  const navigate = useNavigate();
  const { setLobbyState } = useGameStore();

  return useMutation({
    mutationFn: async ({
      code,
      username,
      avatarId,
    }: {
      code: LobbyCode;
      username: string;
      avatarId: AvatarId;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.joinLobby(code, username, avatarId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (lobby) => {
      setLobbyState(lobby);
      navigate({ to: "/lobby/$code", params: { code: lobby.code } });
      toast.success("🎮 Joined lobby!");
    },
    onError: (err: Error) => {
      toast.error(`Failed to join lobby: ${err.message}`);
    },
  });
}

export function useLeaveLobby() {
  const { actor } = useActorInstance();
  const navigate = useNavigate();
  const { setLobbyState } = useGameStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: LobbyCode) => {
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
    onError: (err: Error) => {
      toast.error(`Failed to leave lobby: ${err.message}`);
    },
  });
}

export function useSetReady() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setLobbyState } = useGameStore();

  return useMutation({
    mutationFn: async ({
      code,
      ready,
    }: { code: LobbyCode; ready: boolean }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.setReady(code, ready);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (lobby) => {
      setLobbyState(lobby);
      queryClient.invalidateQueries({ queryKey: ["lobby", lobby.code] });
    },
  });
}

export function useStartGame() {
  const { actor } = useActorInstance();
  const navigate = useNavigate();
  const { setGameSession, setLobbyState } = useGameStore();

  return useMutation({
    mutationFn: async (code: LobbyCode) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.startGame(code);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      setLobbyState(null);
      navigate({ to: "/game/$gameId", params: { gameId: session.id } });
      toast.success("🎲 Game started! Good luck!");
    },
    onError: (err: Error) => {
      toast.error(`Failed to start game: ${err.message}`);
    },
  });
}
