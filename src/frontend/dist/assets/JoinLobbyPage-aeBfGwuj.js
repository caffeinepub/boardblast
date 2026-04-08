import { r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-YS-crX1h.js";
import { A as AVATAR_EMOJIS, P as PlayerAvatar, B as Button } from "./gameStore-BkgthZgj.js";
import { I as Input } from "./input-ClUe0sss.js";
import { L as Label } from "./label-Bl17ze4e.js";
import { L as Layout } from "./Layout-DTWa_cXq.js";
import { a as useJoinLobby } from "./useLobbyActions-B80_m-2x.js";
import { m as motion } from "./proxy-V89rk1xU.js";
import "./createLucideIcon-CXBxgcWC.js";
import "./backend-B9dksDXo.js";
function JoinLobbyPage() {
  const [code, setCode] = reactExports.useState("");
  const [username, setUsername] = reactExports.useState("");
  const [avatarId, setAvatarId] = reactExports.useState(0);
  const joinLobby = useJoinLobby();
  const isLoading = joinLobby.isPending;
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get("code");
    if (urlCode) setCode(urlCode.toUpperCase());
  }, []);
  function handleCodeChange(val) {
    setCode(
      val.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)
    );
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || code.length < 6) return;
    joinLobby.mutate({
      code,
      username: username.trim(),
      avatarId: BigInt(avatarId)
    });
  }
  const canSubmit = username.trim().length > 0 && code.length === 6 && !isLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      className: "w-full max-w-lg",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-3xl shadow-lg p-8 md:p-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-3", children: "🎯" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-extrabold text-foreground", children: "Join a Game" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1.5 text-sm", children: "Enter the 6-character lobby code from your host." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "lobbyCode",
                className: "font-display font-semibold text-foreground",
                children: "Lobby Code"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "lobbyCode",
                placeholder: "e.g. AB12XY",
                value: code,
                onChange: (e) => handleCodeChange(e.target.value),
                maxLength: 6,
                required: true,
                disabled: isLoading,
                className: "rounded-xl h-14 text-2xl text-center tracking-[0.4em] font-display font-bold border-input focus:ring-accent uppercase",
                "data-ocid": "input-lobby-code",
                autoComplete: "off",
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 justify-center", children: [0, 1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-1.5 flex-1 rounded-full transition-smooth ${i < code.length ? "bg-accent" : "bg-border"}`
              },
              i
            )) })
          ] }),
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
                placeholder: "e.g. Lucky Roller",
                value: username,
                onChange: (e) => setUsername(e.target.value),
                maxLength: 20,
                required: true,
                disabled: isLoading,
                className: "rounded-xl h-12 text-base border-input focus:ring-accent",
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
                className: `relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-smooth cursor-pointer ${avatarId === i ? "border-accent bg-accent/10 shadow-sm" : "border-border bg-background hover:border-accent/40 hover:bg-accent/5"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: emoji }),
                  avatarId === i && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold", children: "✓" })
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
                    playerIndex: 1,
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: !canSubmit,
              className: "w-full h-13 rounded-2xl font-display font-bold text-lg bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg hover:scale-[1.02] transition-smooth",
              "data-ocid": "btn-join-lobby",
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-accent-foreground border-t-transparent animate-spin" }),
                "Joining…"
              ] }) : "🎮 Join Lobby"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground mt-6", children: [
          "No code yet?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/lobby/create",
              className: "text-primary font-semibold hover:underline transition-smooth",
              "data-ocid": "link-create",
              children: "Create a new game →"
            }
          )
        ] })
      ] })
    }
  ) }) });
}
export {
  JoinLobbyPage as default
};
