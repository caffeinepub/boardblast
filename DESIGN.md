# Design Brief

## Direction

**Playful Pop Board Game** — A vibrant, cartoony Monopoly-style multiplayer experience with smooth animations, whimsical charm, and game-centric UI inspired by Candyland and Mario Party.

## Tone

Friendly, approachable, and toy-like — bright, rounded corners everywhere, no realistic elements; focuses on fun and engagement over sophistication.

## Differentiation

Animated property group color-coding on the board, smooth token movement with anticipation arcs, vibrant magenta CTAs for game actions, and rounded card-based UI that feels like physical game components.

## Color Palette

| Token              | OKLCH            | Role                          |
| ------------------ | ---------------- | ----------------------------- |
| background         | 0.98 0.005 280   | Light cream, soft, approachable |
| foreground         | 0.18 0.02 280    | Dark text for contrast        |
| card               | 1.0 0.0 0        | Pure white for property cards |
| primary            | 0.55 0.24 305    | Vivid magenta for CTAs        |
| accent             | 0.7 0.18 195     | Teal highlights, game accents |
| muted              | 0.94 0.02 280    | Light grey for secondary text |
| destructive        | 0.55 0.22 25     | Red for bankruptcy/warnings   |
| chart-1            | 0.65 0.22 10     | Red property group            |
| chart-2            | 0.68 0.22 40     | Orange/Yellow property group  |
| chart-3            | 0.62 0.22 65     | Green property group          |
| chart-4            | 0.65 0.22 120    | Blue property group           |
| chart-5            | 0.68 0.22 180    | Purple property group         |

## Typography

- **Display**: Bricolage Grotesque — playful, rounded, friendly; used for game titles, property names, player names
- **Body**: Plus Jakarta Sans — clean, readable sans-serif for UI labels, balances, and gameplay text
- **Scale**: Hero `text-5xl font-bold tracking-tight`, section `text-2xl font-bold`, labels `text-sm font-semibold uppercase`, body `text-base`

## Elevation & Depth

Cards use subtle shadows (0 2px 8px rgba) for soft depth; no harsh shadows. Primary surfaces (background) are flat; secondary surfaces (cards, popover) have minimal lift. Game elements (tokens, dice) use smooth 3D transforms with perspective.

## Structural Zones

| Zone       | Background              | Border                  | Notes                                          |
| ---------- | ----------------------- | ----------------------- | ---------------------------------------------- |
| Header     | background              | border-b (subtle)       | Lobby title, player count, start game button   |
| Game Board | background              | —                       | Central game canvas, 40 spaces, animated board |
| Sidebar    | secondary / muted       | border-l (subtle)       | Player status cards, dice roll control         |
| Overlay    | card / popover + shadow | border (rounded)        | Property sheets, Chance cards, trade dialogs   |
| Footer     | background              | border-t (subtle)       | Game phase indicator, next player UI           |

## Spacing & Rhythm

Generous spacing (1.5rem–2rem) between major sections for breathing room; tight micro-spacing (0.5rem–0.75rem) within cards for grouped content. Board spaces use 60px–80px tiles. Player avatars are 48–64px with 0.75rem rounded-lg.

## Component Patterns

- **Buttons**: Rounded-lg (12px), primary = magenta with white text, secondary = muted with dark text, hover = scale(1.05) + opacity(0.9)
- **Cards**: Rounded-lg, white background, subtle shadow, border = light grey on edges for property cards
- **Badges**: Rounded-full (pill), used for player status (active, bankrupt, in-jail), colors = accent or destructive
- **Tokens**: Circular (rounded-full), 56px default, distinct colors per player, drop-shadow for depth

## Motion

- **Entrance**: Cards fade-in 0.3s ease-out on overlay appearance; smooth stagger for player rows
- **Token movement**: Smooth slide along board path 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) with anticipation
- **Dice roll**: Fast spin 0.6s with rotateX/Y/Z 3D effect, lands with subtle bounce
- **Card reveal**: Flip 0.4s ease-in-out on Chance/Community Chest draw
- **Hover**: All interactive elements scale(1.02) + transition-smooth 0.3s

## Constraints

- No gradients (solid colors only, colors come from OKLCH palette)
- No drop-cap effects or decorative typography
- All rounded corners = 12px, 16px, or full; no arbitrary radii
- Game board and tokens use CSS custom properties for property colors (chart tokens)
- Dark mode must maintain 4.5:1 contrast for accessibility
- Token movement paths must be pre-calculated (no real-time physics — smooth interpolation only)

## Signature Detail

Animated property group color bars (thin stripes) rotate gently behind board space labels, reinforcing ownership and color-coding without visual clutter — subtle, playful, unforgettable.
