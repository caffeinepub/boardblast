import { j as jsxRuntimeExports, L as Link } from "./index-xRF9tkV2.js";
import { L as Layout } from "./Layout-nvSnPD7h.js";
import { m as motion } from "./proxy-B4UgcTtO.js";
import "./createLucideIcon-DznkbKl0.js";
const FEATURES = [
  {
    emoji: "🎲",
    title: "Roll & Move",
    desc: "Animated dice rolls and smooth token gliding around the board"
  },
  {
    emoji: "🏠",
    title: "Build & Buy",
    desc: "Snap up properties, stack houses and hotels, collect massive rent"
  },
  {
    emoji: "🤝",
    title: "Trade & Deal",
    desc: "Wheel and deal with other players for the ultimate advantage"
  },
  {
    emoji: "👥",
    title: "2–8 Players",
    desc: "Play with friends online — invite up to 8 players per game"
  }
];
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { showNav: false, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative min-h-screen flex flex-col overflow-hidden bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-20 pointer-events-none",
          style: { background: "oklch(var(--primary))" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute -bottom-24 -right-24 w-[380px] h-[380px] rounded-full opacity-15 pointer-events-none",
          style: { background: "oklch(var(--accent))" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 flex items-center justify-between px-6 pt-6 md:px-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🎲" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-extrabold text-xl text-foreground tracking-tight", children: "BoardBlast" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/lobby/join",
            className: "text-sm font-semibold text-muted-foreground hover:text-foreground transition-smooth",
            "data-ocid": "nav-join",
            children: "Join a game →"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 text-center gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 32 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            className: "flex flex-col items-center gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold font-body", children: "🎉 Now open for all players" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-6xl md:text-8xl font-display font-extrabold text-foreground leading-none tracking-tight", children: [
                "Board",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-transparent bg-clip-text",
                    style: {
                      backgroundImage: "linear-gradient(135deg, oklch(var(--primary)) 0%, oklch(var(--accent)) 100%)"
                    },
                    children: "Blast"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-lg md:text-xl text-muted-foreground font-body leading-relaxed", children: "The fast, colorful, wildly fun multiplayer board game. Roll the dice. Buy everything. Bankrupt your friends. 🎩" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
            className: "flex flex-col sm:flex-row gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/lobby/create",
                  className: "group relative px-10 py-4 bg-primary text-primary-foreground font-display font-bold rounded-2xl text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-smooth overflow-hidden",
                  "data-ocid": "cta-create",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10 flex items-center gap-2", children: "🚀 Create Game" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-smooth" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/lobby/join",
                  className: "group px-10 py-4 bg-card border-2 border-accent text-accent font-display font-bold rounded-2xl text-lg shadow hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:scale-105 transition-smooth",
                  "data-ocid": "cta-join",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-2", children: "🎮 Join Game" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.92 },
            animate: { opacity: 1, scale: 1 },
            transition: {
              duration: 0.7,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1]
            },
            className: "w-full max-w-3xl",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-3xl overflow-hidden shadow-2xl border-4 border-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: "/assets/generated/boardblast-hero.dim_900x600.png",
                  alt: "BoardBlast board game illustration",
                  className: "w-full object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-sm font-display font-bold text-foreground shadow-md border border-border", children: "2–8 Players 🎯" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 bg-primary/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-sm font-display font-bold text-primary-foreground shadow-md", children: "Play Online 🌐" })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/30 py-20 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.h2,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5 },
          className: "text-3xl md:text-4xl font-display font-extrabold text-center text-foreground mb-12",
          children: "Everything you love about board games 🎊"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: FEATURES.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.45, delay: i * 0.1 },
          className: "bg-card rounded-2xl p-6 text-center border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-smooth",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-3", children: f.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground text-base mb-1", children: f.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: f.desc })
          ]
        },
        f.title
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-20 px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
        className: "max-w-xl mx-auto flex flex-col items-center gap-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl", children: "🎲" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-display font-extrabold text-foreground", children: "Ready to play?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body", children: "Gather your friends and start a game in under a minute." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/lobby/create",
              className: "px-10 py-4 bg-primary text-primary-foreground font-display font-bold rounded-2xl text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-smooth",
              "data-ocid": "cta-create-bottom",
              children: "Start a Game 🚀"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-card border-t border-border py-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ".",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "hover:text-foreground transition-smooth",
          children: "Built with love using caffeine.ai"
        }
      )
    ] }) })
  ] });
}
export {
  HomePage as default
};
