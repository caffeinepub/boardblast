import { j as jsxRuntimeExports, r as reactExports } from "./index-xRF9tkV2.js";
import { S as Slot, b as cva, u as useGameStore } from "./gameStore-EujuzfF-.js";
import { c as cn } from "./createLucideIcon-DznkbKl0.js";
import { b as useQuery, a as useActor, c as createActor } from "./backend-BxTSFiBD.js";
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
const POLL_INTERVAL = 2e3;
const LOBBY_POLL_INTERVAL = 3e3;
function useActorInstance() {
  return useActor(createActor);
}
function useGamePolling(gameId) {
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
    staleTime: 1e3
  });
  reactExports.useEffect(() => {
    if (query.data && query.data !== null) {
      const incoming = query.data;
      if (!gameSession || incoming.updatedAt !== gameSession.updatedAt) {
        setGameSession(incoming);
      }
    }
  }, [query.data, gameSession, setGameSession]);
  reactExports.useEffect(() => {
    if (!actor || !gameId) return;
    const interval = setInterval(() => {
      actor.heartbeat(gameId).catch(() => {
      });
    }, 1e4);
    return () => clearInterval(interval);
  }, [actor, gameId]);
  return query;
}
function useLobbyPolling(code) {
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
    staleTime: 1500
  });
  reactExports.useEffect(() => {
    if (query.data !== void 0 && query.data !== null) {
      setLobbyState(query.data);
    }
  }, [query.data, setLobbyState]);
  return query;
}
export {
  Badge as B,
  useGamePolling as a,
  useLobbyPolling as u
};
