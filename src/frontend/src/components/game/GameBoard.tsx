import { useMemo, useRef } from "react";
import type {
  BoardSpaceDefinition,
  GameSessionView,
  OwnedPropertyView,
  PlayerStateView,
} from "../../types/game";
import { ColorGroup } from "../../types/game";
import { BoardSpace } from "./BoardSpace";
import { PlayerToken } from "./PlayerToken";

// ─── Board layout: 40 spaces, 0 = GO at bottom-right, clockwise ──────────────
// Positions on an 11×11 grid. Corners are 2×2 visually but occupy 1 cell.
// Row/col 0-10, corners at (10,10),(10,0),(0,0),(0,10)

export const BOARD_SPACES: BoardSpaceDefinition[] = [
  // Bottom row (right → left), indices 0–10
  { id: 0, name: "GO", type: "go", gridPos: [10, 10] },
  {
    id: 1,
    name: "Mediterranean",
    type: "property",
    colorGroup: ColorGroup.brown,
    purchasePrice: 60,
    gridPos: [9, 10],
  },
  { id: 2, name: "Community Chest", type: "community_chest", gridPos: [8, 10] },
  {
    id: 3,
    name: "Baltic Ave",
    type: "property",
    colorGroup: ColorGroup.brown,
    purchasePrice: 60,
    gridPos: [7, 10],
  },
  { id: 4, name: "Income Tax", type: "tax", gridPos: [6, 10] },
  {
    id: 5,
    name: "Reading RR",
    type: "railroad",
    colorGroup: ColorGroup.railroad,
    purchasePrice: 200,
    gridPos: [5, 10],
  },
  {
    id: 6,
    name: "Oriental Ave",
    type: "property",
    colorGroup: ColorGroup.lightBlue,
    purchasePrice: 100,
    gridPos: [4, 10],
  },
  { id: 7, name: "Chance", type: "chance", gridPos: [3, 10] },
  {
    id: 8,
    name: "Vermont Ave",
    type: "property",
    colorGroup: ColorGroup.lightBlue,
    purchasePrice: 100,
    gridPos: [2, 10],
  },
  {
    id: 9,
    name: "Connecticut Ave",
    type: "property",
    colorGroup: ColorGroup.lightBlue,
    purchasePrice: 120,
    gridPos: [1, 10],
  },
  { id: 10, name: "Jail", type: "jail", gridPos: [0, 10] },
  // Left column (bottom → top), indices 11–19
  {
    id: 11,
    name: "St. Charles",
    type: "property",
    colorGroup: ColorGroup.pink,
    purchasePrice: 140,
    gridPos: [0, 9],
  },
  {
    id: 12,
    name: "Electric Co",
    type: "utility",
    colorGroup: ColorGroup.utility,
    purchasePrice: 150,
    gridPos: [0, 8],
  },
  {
    id: 13,
    name: "States Ave",
    type: "property",
    colorGroup: ColorGroup.pink,
    purchasePrice: 140,
    gridPos: [0, 7],
  },
  {
    id: 14,
    name: "Virginia Ave",
    type: "property",
    colorGroup: ColorGroup.pink,
    purchasePrice: 160,
    gridPos: [0, 6],
  },
  {
    id: 15,
    name: "Pennsylvania RR",
    type: "railroad",
    colorGroup: ColorGroup.railroad,
    purchasePrice: 200,
    gridPos: [0, 5],
  },
  {
    id: 16,
    name: "St. James Pl",
    type: "property",
    colorGroup: ColorGroup.orange,
    purchasePrice: 180,
    gridPos: [0, 4],
  },
  { id: 17, name: "Community Chest", type: "community_chest", gridPos: [0, 3] },
  {
    id: 18,
    name: "Tennessee Ave",
    type: "property",
    colorGroup: ColorGroup.orange,
    purchasePrice: 180,
    gridPos: [0, 2],
  },
  {
    id: 19,
    name: "New York Ave",
    type: "property",
    colorGroup: ColorGroup.orange,
    purchasePrice: 200,
    gridPos: [0, 1],
  },
  { id: 20, name: "Free Parking", type: "free_parking", gridPos: [0, 0] },
  // Top row (left → right), indices 21–29
  {
    id: 21,
    name: "Kentucky Ave",
    type: "property",
    colorGroup: ColorGroup.red,
    purchasePrice: 220,
    gridPos: [1, 0],
  },
  { id: 22, name: "Chance", type: "chance", gridPos: [2, 0] },
  {
    id: 23,
    name: "Indiana Ave",
    type: "property",
    colorGroup: ColorGroup.red,
    purchasePrice: 220,
    gridPos: [3, 0],
  },
  {
    id: 24,
    name: "Illinois Ave",
    type: "property",
    colorGroup: ColorGroup.red,
    purchasePrice: 240,
    gridPos: [4, 0],
  },
  {
    id: 25,
    name: "B&O Railroad",
    type: "railroad",
    colorGroup: ColorGroup.railroad,
    purchasePrice: 200,
    gridPos: [5, 0],
  },
  {
    id: 26,
    name: "Atlantic Ave",
    type: "property",
    colorGroup: ColorGroup.yellow,
    purchasePrice: 260,
    gridPos: [6, 0],
  },
  {
    id: 27,
    name: "Ventnor Ave",
    type: "property",
    colorGroup: ColorGroup.yellow,
    purchasePrice: 260,
    gridPos: [7, 0],
  },
  {
    id: 28,
    name: "Water Works",
    type: "utility",
    colorGroup: ColorGroup.utility,
    purchasePrice: 150,
    gridPos: [8, 0],
  },
  {
    id: 29,
    name: "Marvin Gardens",
    type: "property",
    colorGroup: ColorGroup.yellow,
    purchasePrice: 280,
    gridPos: [9, 0],
  },
  { id: 30, name: "Go To Jail", type: "go_to_jail", gridPos: [10, 0] },
  // Right column (top → bottom), indices 31–39
  {
    id: 31,
    name: "Pacific Ave",
    type: "property",
    colorGroup: ColorGroup.green,
    purchasePrice: 300,
    gridPos: [10, 1],
  },
  {
    id: 32,
    name: "N Carolina Ave",
    type: "property",
    colorGroup: ColorGroup.green,
    purchasePrice: 300,
    gridPos: [10, 2],
  },
  {
    id: 33,
    name: "Community Chest",
    type: "community_chest",
    gridPos: [10, 3],
  },
  {
    id: 34,
    name: "Pennsylvania Ave",
    type: "property",
    colorGroup: ColorGroup.green,
    purchasePrice: 320,
    gridPos: [10, 4],
  },
  {
    id: 35,
    name: "Short Line RR",
    type: "railroad",
    colorGroup: ColorGroup.railroad,
    purchasePrice: 200,
    gridPos: [10, 5],
  },
  { id: 36, name: "Chance", type: "chance", gridPos: [10, 6] },
  {
    id: 37,
    name: "Park Place",
    type: "property",
    colorGroup: ColorGroup.darkBlue,
    purchasePrice: 350,
    gridPos: [10, 7],
  },
  { id: 38, name: "Luxury Tax", type: "tax", gridPos: [10, 8] },
  {
    id: 39,
    name: "Boardwalk",
    type: "property",
    colorGroup: ColorGroup.darkBlue,
    purchasePrice: 400,
    gridPos: [10, 9],
  },
];

// Derive orientation for color band based on position on the board
function getOrientation(
  space: BoardSpaceDefinition,
): "top" | "bottom" | "left" | "right" | "corner" {
  const [col, row] = space.gridPos;
  if (row === 10) return "top"; // bottom row, band at top
  if (row === 0) return "bottom"; // top row, band at bottom
  if (col === 0) return "right"; // left column, band at right
  if (col === 10) return "left"; // right column, band at left
  return "corner";
}

interface GameBoardProps {
  session: GameSessionView;
  myPlayerId: string | null;
  onSpaceClick?: (spaceId: bigint) => void;
}

export function GameBoard({ session, onSpaceClick }: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  // Build lookup maps
  const ownedMap = useMemo(() => {
    const m = new Map<number, OwnedPropertyView>();
    for (const p of session.ownedProperties) {
      m.set(Number(p.spaceId), p);
    }
    return m;
  }, [session.ownedProperties]);

  const playersBySpace = useMemo(() => {
    const m = new Map<number, PlayerStateView[]>();
    for (const p of session.players) {
      const pos = Number(p.position);
      if (!m.has(pos)) m.set(pos, []);
      m.get(pos)!.push(p);
    }
    return m;
  }, [session.players]);

  // Grid cell size in percent (11 columns/rows total)
  // Corners are 2 cells wide/tall
  const GRID = 11;
  const CELL = 100 / GRID; // ~9.09%
  const CORNER = CELL * 2;
  const SIDE = CELL;

  // Compute pixel-approximate center of each space for token placement
  // We'll use percentage-based positioning within the board container
  function getSpaceCenter(spaceId: number): { xPct: number; yPct: number } {
    const space = BOARD_SPACES[spaceId];
    if (!space) return { xPct: 50, yPct: 50 };
    const [col, row] = space.gridPos;
    // col/row correspond to top-left of the cell in 11x11 grid
    // Center of cell = (col + 0.5) / 11 * 100
    return {
      xPct: ((col + 0.5) / GRID) * 100,
      yPct: ((row + 0.5) / GRID) * 100,
    };
  }

  return (
    <div
      ref={boardRef}
      className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-emerald-400 bg-emerald-100 shadow-2xl"
      data-ocid="game-board"
      style={{
        display: "grid",
        gridTemplateColumns: `${CORNER}% repeat(9, ${SIDE}%) ${CORNER}%`,
        gridTemplateRows: `${CORNER}% repeat(9, ${SIDE}%) ${CORNER}%`,
      }}
    >
      {/* Board spaces */}
      {BOARD_SPACES.map((space) => {
        const [col, row] = space.gridPos;
        const owned = ownedMap.get(space.id);
        const here = playersBySpace.get(space.id) ?? [];
        const orientation = getOrientation(space);

        return (
          <BoardSpace
            key={space.id}
            space={space}
            ownedBy={owned}
            playersHere={here}
            orientation={orientation}
            onClick={
              space.type === "property" ||
              space.type === "railroad" ||
              space.type === "utility"
                ? () => onSpaceClick?.(BigInt(space.id))
                : undefined
            }
            style={
              {
                gridColumn: `${col + 1}`,
                gridRow: `${row + 1}`,
              } as React.CSSProperties
            }
          />
        );
      })}

      {/* Center area */}
      <div
        className="flex items-center justify-center"
        style={{
          gridColumn: "2 / 11",
          gridRow: "2 / 11",
          background:
            "radial-gradient(ellipse at center, #d1fae5 0%, #ecfdf5 60%, #bbf7d0 100%)",
          borderRadius: 8,
        }}
      >
        <div className="flex flex-col items-center gap-1 select-none opacity-30">
          <span className="text-4xl">🎲</span>
          <span className="font-display font-black text-emerald-700 text-xs tracking-widest uppercase">
            Monopoly
          </span>
        </div>
      </div>

      {/* Player tokens — absolutely positioned over the board */}
      {session.players.map((player, idx) => {
        const pos = Number(player.position);
        const { xPct, yPct } = getSpaceCenter(pos);
        // Stack offset for players sharing the same space
        const spacemates = playersBySpace.get(pos) ?? [];
        const stackIdx = spacemates.findIndex(
          (p) => String(p.id) === String(player.id),
        );

        return (
          <PlayerToken
            key={String(player.id)}
            avatarId={player.avatarId}
            playerIndex={idx}
            x={xPct}
            y={yPct}
            isActive={idx === Number(session.currentPlayerIndex)}
            isBankrupt={player.isBankrupt}
            username={player.username}
            stackOffset={stackIdx}
          />
        );
      })}
    </div>
  );
}
