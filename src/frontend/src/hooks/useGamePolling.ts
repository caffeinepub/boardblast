import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { createActor } from "../backend";
import { useGameStore } from "../store/gameStore";
import type { GameId, LobbyCode } from "../types/game";

const POLL_INTERVAL = 2000;
const LOBBY_POLL_INTERVAL = 3000;

function useActorInstance() {
  return useActor(createActor);
}

export function useGamePolling(gameId: GameId | null) {
  const { actor, isFetching } = useActorInstance();
  const { setGameSession, gameSession } = useGameStore();

  const query = useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => {
      if (!actor || !gameId) return null;
      return actor.getGame(gameId);
    },
    enabled: !!actor && !isFetching && !!gameId,
    refetchInterval: POLL_INTERVAL,
    staleTime: 1000,
  });

  // Sync polled data into Zustand store
  useEffect(() => {
    if (query.data && query.data !== null) {
      const incoming = query.data;
      // Only update if backend says something changed
      if (!gameSession || incoming.updatedAt !== gameSession.updatedAt) {
        setGameSession(incoming);
      }
    }
  }, [query.data, gameSession, setGameSession]);

  // Heartbeat to keep player "alive" in the game
  useEffect(() => {
    if (!actor || !gameId) return;
    const interval = setInterval(() => {
      actor.heartbeat(gameId).catch(() => {
        // Silently ignore heartbeat failures
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [actor, gameId]);

  return query;
}

export function useLobbyPolling(code: LobbyCode | null) {
  const { actor, isFetching } = useActorInstance();
  const { setLobbyState } = useGameStore();

  const query = useQuery({
    queryKey: ["lobby", code],
    queryFn: async () => {
      if (!actor || !code) return null;
      return actor.getLobby(code);
    },
    enabled: !!actor && !isFetching && !!code,
    refetchInterval: LOBBY_POLL_INTERVAL,
    staleTime: 1500,
  });

  useEffect(() => {
    if (query.data !== undefined && query.data !== null) {
      setLobbyState(query.data);
    }
  }, [query.data, setLobbyState]);

  return query;
}
