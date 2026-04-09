import { create } from "zustand";
import type { GameSessionView, LobbyView, UIState } from "../types/game";

interface GameStore {
  // Game state from backend
  gameSession: GameSessionView | null;
  lobbyState: LobbyView | null;

  // Local player identity
  myPlayerId: string | null;

  // UI state (ephemeral, not from backend)
  uiState: UIState;

  // Setters
  setGameSession: (session: GameSessionView | null) => void;
  setLobbyState: (lobby: LobbyView | null) => void;
  setMyPlayerId: (id: string | null) => void;

  // UI actions
  setDiceAnimating: (animating: boolean) => void;
  setTokenMoving: (moving: boolean) => void;
  showCard: (card: UIState["currentCard"]) => void;
  dismissCard: () => void;
  openAuctionModal: () => void;
  closeAuctionModal: () => void;
  openTradeModal: () => void;
  closeTradeModal: () => void;
  openPropertyModal: (spaceId: bigint) => void;
  closePropertyModal: () => void;
  setErrorMessage: (msg: string | null) => void;

  // Reset
  resetGame: () => void;
}

const defaultUIState: UIState = {
  isDiceAnimating: false,
  isTokenMoving: false,
  currentCard: null,
  isAuctionModalOpen: false,
  isTradeModalOpen: false,
  isPropertyModalOpen: false,
  selectedSpaceId: null,
  errorMessage: null,
};

export const useGameStore = create<GameStore>((set) => ({
  gameSession: null,
  lobbyState: null,
  myPlayerId: null,
  uiState: defaultUIState,

  setGameSession: (session) =>
    set({ gameSession: session, ...(session ? { lobbyState: null } : {}) }),
  setLobbyState: (lobby) => set({ lobbyState: lobby }),
  setMyPlayerId: (id) => set({ myPlayerId: id }),

  setDiceAnimating: (animating) =>
    set((s) => ({ uiState: { ...s.uiState, isDiceAnimating: animating } })),

  setTokenMoving: (moving) =>
    set((s) => ({ uiState: { ...s.uiState, isTokenMoving: moving } })),

  showCard: (card) =>
    set((s) => ({ uiState: { ...s.uiState, currentCard: card } })),

  dismissCard: () =>
    set((s) => ({ uiState: { ...s.uiState, currentCard: null } })),

  openAuctionModal: () =>
    set((s) => ({ uiState: { ...s.uiState, isAuctionModalOpen: true } })),

  closeAuctionModal: () =>
    set((s) => ({ uiState: { ...s.uiState, isAuctionModalOpen: false } })),

  openTradeModal: () =>
    set((s) => ({ uiState: { ...s.uiState, isTradeModalOpen: true } })),

  closeTradeModal: () =>
    set((s) => ({ uiState: { ...s.uiState, isTradeModalOpen: false } })),

  openPropertyModal: (spaceId) =>
    set((s) => ({
      uiState: {
        ...s.uiState,
        isPropertyModalOpen: true,
        selectedSpaceId: spaceId,
      },
    })),

  closePropertyModal: () =>
    set((s) => ({
      uiState: {
        ...s.uiState,
        isPropertyModalOpen: false,
        selectedSpaceId: null,
      },
    })),

  setErrorMessage: (msg) =>
    set((s) => ({ uiState: { ...s.uiState, errorMessage: msg } })),

  resetGame: () =>
    set({ gameSession: null, lobbyState: null, uiState: defaultUIState }),
}));
