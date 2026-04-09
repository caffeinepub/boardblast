import { r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-xRF9tkV2.js";
import { A as AVATAR_EMOJIS, P as PlayerAvatar, B as Button } from "./gameStore-EujuzfF-.js";
import { I as Input } from "./input-D4FZM7eS.js";
import { L as Label } from "./label-DqWW3TJz.js";
import { L as Layout } from "./Layout-nvSnPD7h.js";
import { u as useCreateLobby } from "./useLobbyActions-xa19psm_.js";
import { m as motion } from "./proxy-B4UgcTtO.js";
import "./createLucideIcon-DznkbKl0.js";
import "./backend-BxTSFiBD.js";
const MAX_PLAYERS_OPTIONS = [2, 3, 4, 5, 6, 7, 8];
function CreateLobbyPage() {
  const [username, setUsername] = reactExports.useState("");
  const [avatarId, setAvatarId] = reactExports.useState(0);
  const [maxPlayers, setMaxPlayers] = reactExports.useState(4);
  const createLobby = useCreateLobby();
  const isLoading = createLobby.isPending;
  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) return;
    createLobby.mutate({
      username: username.trim(),
      avatarId: BigInt(avatarId),
      maxPlayers: BigInt(maxPlayers)
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      className: "w-full max-w-lg",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-3xl shadow-lg p-8 md:p-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-3", children: "🎮" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-extrabold text-foreground", children: "Create a Game" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1.5 text-sm", children: "Set up your lobby and invite friends to join." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "username",
                className: "font-display font-semibold text-foreground",
                children: "Your Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "username",
                placeholder: "e.g. BoardBlast Champion",
                value: username,
                onChange: (e) => setUsername(e.target.value),
                maxLength: 20,
                required: true,
                disabled: isLoading,
                className: "rounded-xl h-12 text-base border-input focus:ring-primary",
                "data-ocid": "input-username"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-display font-semibold text-foreground", children: "Pick Your Token" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-3", children: AVATAR_EMOJIS.map((emoji, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.button,
              {
                type: "button",
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.95 },
                onClick: () => setAvatarId(i),
                disabled: isLoading,
                "aria-label": `Select avatar ${emoji}`,
                "data-ocid": `avatar-option-${i}`,
                className: `relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-smooth cursor-pointer ${avatarId === i ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: emoji }),
                  avatarId === i && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold", children: "✓" })
                ]
              },
              emoji
            )) })
          ] }),
          username && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.25 },
              className: "flex items-center gap-3 p-4 rounded-2xl bg-muted/40 border border-border",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PlayerAvatar,
                  {
                    avatarId: BigInt(avatarId),
                    username,
                    playerIndex: 0,
                    size: "md"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: username }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Token: ",
                    AVATAR_EMOJIS[avatarId]
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-display font-semibold text-foreground", children: "Max Players" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: MAX_PLAYERS_OPTIONS.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setMaxPlayers(n),
                disabled: isLoading,
                "data-ocid": `max-players-${n}`,
                className: `w-11 h-11 rounded-xl font-display font-bold text-base border-2 transition-smooth ${maxPlayers === n ? "border-accent bg-accent/10 text-accent shadow-sm" : "border-border bg-background text-muted-foreground hover:border-accent/40 hover:text-accent"}`,
                children: n
              },
              n
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              maxPlayers,
              " players max · at least 2 needed to start"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: !username.trim() || isLoading,
              className: "w-full h-13 rounded-2xl font-display font-bold text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-[1.02] transition-smooth",
              "data-ocid": "btn-create-lobby",
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" }),
                "Creating…"
              ] }) : "🚀 Create Lobby"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground mt-6", children: [
          "Have a code?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/lobby/join",
              className: "text-accent font-semibold hover:underline transition-smooth",
              "data-ocid": "link-join",
              children: "Join a game instead →"
            }
          )
        ] })
      ] })
    }
  ) }) });
}
export {
  CreateLobbyPage as default
};
