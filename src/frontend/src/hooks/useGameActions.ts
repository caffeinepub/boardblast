import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createActor } from "../backend";
import { useGameStore } from "../store/gameStore";
import type { GameId, Money, PlayerId, SpaceId } from "../types/game";

function useActorInstance() {
  return useActor(createActor);
}

export function useRollAndMove() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setDiceAnimating, setTokenMoving, setGameSession, setErrorMessage } =
    useGameStore();

  return useMutation({
    mutationFn: async (gameId: GameId) => {
      if (!actor) throw new Error("Not connected");
      setDiceAnimating(true);
      const result = await actor.rollAndMove(gameId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setTimeout(() => setDiceAnimating(false), 700);
      setTokenMoving(true);
      setTimeout(() => setTokenMoving(false), 600);
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
    },
    onError: (err: Error) => {
      setDiceAnimating(false);
      setErrorMessage(err.message);
      toast.error(`Roll failed: ${err.message}`);
    },
  });
}

export function useBuyProperty() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession, setErrorMessage } = useGameStore();

  return useMutation({
    mutationFn: async ({
      gameId,
      spaceId,
    }: { gameId: GameId; spaceId: SpaceId }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.buyProperty(gameId, spaceId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
      toast.success("🏠 Property purchased!");
    },
    onError: (err: Error) => {
      setErrorMessage(err.message);
      toast.error(`Purchase failed: ${err.message}`);
    },
  });
}

export function usePassOnProperty() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();

  return useMutation({
    mutationFn: async ({
      gameId,
      spaceId,
    }: { gameId: GameId; spaceId: SpaceId }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.passOnProperty(gameId, spaceId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
    },
  });
}

export function useEndTurn() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession, setErrorMessage } = useGameStore();

  return useMutation({
    mutationFn: async (gameId: GameId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.endTurn(gameId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
    },
    onError: (err: Error) => {
      setErrorMessage(err.message);
      toast.error(`End turn failed: ${err.message}`);
    },
  });
}

export function useUpgradeProperty() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();

  return useMutation({
    mutationFn: async ({
      gameId,
      spaceId,
    }: { gameId: GameId; spaceId: SpaceId }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.upgradeProperty(gameId, spaceId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
      toast.success("🏨 Property upgraded!");
    },
    onError: (err: Error) => {
      toast.error(`Upgrade failed: ${err.message}`);
    },
  });
}

export function useMortgageProperty() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();

  return useMutation({
    mutationFn: async ({
      gameId,
      spaceId,
    }: { gameId: GameId; spaceId: SpaceId }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.mortgageProperty(gameId, spaceId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
    },
    onError: (err: Error) => {
      toast.error(`Mortgage failed: ${err.message}`);
    },
  });
}

export function useUnmortgageProperty() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();

  return useMutation({
    mutationFn: async ({
      gameId,
      spaceId,
    }: { gameId: GameId; spaceId: SpaceId }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.unmortgageProperty(gameId, spaceId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
    },
  });
}

export function usePayJailFine() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();

  return useMutation({
    mutationFn: async (gameId: GameId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.payJailFine(gameId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
      toast.success("💰 Jail fine paid!");
    },
    onError: (err: Error) => {
      toast.error(`Pay fine failed: ${err.message}`);
    },
  });
}

export function useUseGetOutOfJailCard() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();

  // Capture method reference to avoid linter false-positive on `use` prefix
  const jailCardMethod = actor?.useGetOutOfJailCard.bind(actor);

  return useMutation({
    mutationFn: async (gameId: GameId) => {
      if (!actor || !jailCardMethod) throw new Error("Not connected");
      const result = await jailCardMethod(gameId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
      toast.success("🃏 Get Out of Jail card used!");
    },
  });
}

export function usePlaceBid() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();

  return useMutation({
    mutationFn: async ({
      gameId,
      amount,
    }: { gameId: GameId; amount: Money }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.placeBid(gameId, amount);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
      toast.success("🔨 Bid placed!");
    },
    onError: (err: Error) => {
      toast.error(`Bid failed: ${err.message}`);
    },
  });
}

export function useResolveAuction() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();

  return useMutation({
    mutationFn: async (gameId: GameId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.resolveAuction(gameId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
    },
  });
}

export function useProposeTrade() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();

  return useMutation({
    mutationFn: async ({
      gameId,
      recipientId,
      proposerSpaces,
      proposerMoney,
      recipientSpaces,
      recipientMoney,
    }: {
      gameId: GameId;
      recipientId: PlayerId;
      proposerSpaces: SpaceId[];
      proposerMoney: Money;
      recipientSpaces: SpaceId[];
      recipientMoney: Money;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.proposeTrade(
        gameId,
        recipientId,
        proposerSpaces,
        proposerMoney,
        recipientSpaces,
        recipientMoney,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
      toast.success("🤝 Trade proposed!");
    },
    onError: (err: Error) => {
      toast.error(`Trade failed: ${err.message}`);
    },
  });
}

export function useAcceptTrade() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();

  return useMutation({
    mutationFn: async ({
      gameId,
      tradeId,
    }: { gameId: GameId; tradeId: bigint }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.acceptTrade(gameId, tradeId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
      toast.success("✅ Trade accepted!");
    },
  });
}

export function useDeclineTrade() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();

  return useMutation({
    mutationFn: async ({
      gameId,
      tradeId,
    }: { gameId: GameId; tradeId: bigint }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.declineTrade(gameId, tradeId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
    },
  });
}

export function useReconnect() {
  const { actor } = useActorInstance();
  const { setGameSession } = useGameStore();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.reconnect();
    },
    onSuccess: (session) => {
      if (session) setGameSession(session);
    },
  });
}
