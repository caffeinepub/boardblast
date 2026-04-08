import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const CreateLobbyPage = lazy(() => import("./pages/CreateLobbyPage"));
const JoinLobbyPage = lazy(() => import("./pages/JoinLobbyPage"));
const LobbyRoomPage = lazy(() => import("./pages/LobbyRoomPage"));
const GameBoardPage = lazy(() => import("./pages/GameBoardPage"));
const GameResultPage = lazy(() => import("./pages/GameResultPage"));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground font-body text-sm animate-pulse-gentle">
          Loading…
        </p>
      </div>
    </div>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-center" />
    </>
  ),
});

// Page routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  ),
});

const createLobbyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lobby/create",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <CreateLobbyPage />
    </Suspense>
  ),
});

const joinLobbyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lobby/join",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <JoinLobbyPage />
    </Suspense>
  ),
});

const lobbyRoomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lobby/$code",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <LobbyRoomPage />
    </Suspense>
  ),
});

const gameBoardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game/$gameId",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <GameBoardPage />
    </Suspense>
  ),
});

const gameResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game/$gameId/result",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <GameResultPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  createLobbyRoute,
  joinLobbyRoute,
  lobbyRoomRoute,
  gameBoardRoute,
  gameResultRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
