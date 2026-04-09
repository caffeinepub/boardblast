import { j as jsxRuntimeExports, L as Link } from "./index-xRF9tkV2.js";
import { a as createLucideIcon, c as cn } from "./createLucideIcon-DznkbKl0.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["path", { d: "M16 8h.01", key: "cr5u4v" }],
  ["path", { d: "M8 8h.01", key: "1e4136" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }],
  ["path", { d: "M16 16h.01", key: "1f9h7w" }],
  ["path", { d: "M12 12h.01", key: "1mp3jc" }]
];
const Dice5 = createLucideIcon("dice-5", __iconNode);
function Layout({
  children,
  showNav = true,
  fullscreen = false,
  className
}) {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const brandingUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;
  if (fullscreen) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "min-h-screen bg-background flex flex-col overflow-hidden",
          className
        ),
        children
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    showNav && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "header",
      {
        className: "sticky top-0 z-40 bg-card border-b border-border shadow-xs",
        "data-ocid": "nav",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-6xl mx-auto px-4 h-14 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-smooth group-hover:scale-110", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dice5, { className: "w-5 h-5 text-primary-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg text-foreground tracking-tight", children: "BoardBlast" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/",
                className: "px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-smooth",
                children: "Home"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/lobby/create",
                className: "px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-smooth",
                children: "New Game"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: cn("flex-1 bg-background", className), children }),
    showNav && /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-card border-t border-border py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container max-w-6xl mx-auto px-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "© ",
      year,
      ".",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: brandingUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "hover:text-foreground transition-smooth",
          children: "Built with love using caffeine.ai"
        }
      )
    ] }) }) })
  ] });
}
export {
  Layout as L
};
