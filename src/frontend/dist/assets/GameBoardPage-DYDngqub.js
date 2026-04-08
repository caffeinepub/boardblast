import { r as reactExports, j as jsxRuntimeExports, c as useQueryClient, a as ue, u as useParams, b as useNavigate, d as useInternetIdentity } from "./index-YS-crX1h.js";
import { B as Badge, a as useGamePolling } from "./useGamePolling-DtXOk8Aq.js";
import { u as useGameStore, f as formatMoney, P as PlayerAvatar, B as Button, a as PLAYER_COLORS, g as getAvatarEmoji } from "./gameStore-BkgthZgj.js";
import { I as Input } from "./input-ClUe0sss.js";
import { a as createLucideIcon, c as cn } from "./createLucideIcon-CXBxgcWC.js";
import { u as useMutation, a as useActor, c as createActor, C as ColorGroup } from "./backend-B9dksDXo.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion } from "./proxy-V89rk1xU.js";
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8", key: "15492f" }],
  ["path", { d: "m16 16 6-6", key: "vzrcl6" }],
  ["path", { d: "m8 8 6-6", key: "18bi4p" }],
  ["path", { d: "m9 7 8 8", key: "5jnvq1" }],
  ["path", { d: "m21 11-8-8", key: "z4y7zo" }]
];
const Gavel = createLucideIcon("gavel", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", key: "17hqa7" }],
  ["path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", key: "lmptdp" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", key: "1nw9bq" }],
  ["path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", key: "1np0yb" }],
  ["path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z", key: "u46fv3" }]
];
const Trophy = createLucideIcon("trophy", __iconNode);
function useActorInstance() {
  return useActor(createActor);
}
function useRollAndMove() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setDiceAnimating, setTokenMoving, setGameSession, setErrorMessage } = useGameStore();
  return useMutation({
    mutationFn: async (gameId) => {
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
    onError: (err) => {
      setDiceAnimating(false);
      setErrorMessage(err.message);
      ue.error(`Roll failed: ${err.message}`);
    }
  });
}
function useBuyProperty() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession, setErrorMessage } = useGameStore();
  return useMutation({
    mutationFn: async ({
      gameId,
      spaceId
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.buyProperty(gameId, spaceId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
      ue.success("🏠 Property purchased!");
    },
    onError: (err) => {
      setErrorMessage(err.message);
      ue.error(`Purchase failed: ${err.message}`);
    }
  });
}
function usePassOnProperty() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();
  return useMutation({
    mutationFn: async ({
      gameId,
      spaceId
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.passOnProperty(gameId, spaceId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
    }
  });
}
function useEndTurn() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession, setErrorMessage } = useGameStore();
  return useMutation({
    mutationFn: async (gameId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.endTurn(gameId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
    },
    onError: (err) => {
      setErrorMessage(err.message);
      ue.error(`End turn failed: ${err.message}`);
    }
  });
}
function useUpgradeProperty() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();
  return useMutation({
    mutationFn: async ({
      gameId,
      spaceId
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.upgradeProperty(gameId, spaceId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
      ue.success("🏨 Property upgraded!");
    },
    onError: (err) => {
      ue.error(`Upgrade failed: ${err.message}`);
    }
  });
}
function useMortgageProperty() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();
  return useMutation({
    mutationFn: async ({
      gameId,
      spaceId
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.mortgageProperty(gameId, spaceId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
    },
    onError: (err) => {
      ue.error(`Mortgage failed: ${err.message}`);
    }
  });
}
function usePayJailFine() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();
  return useMutation({
    mutationFn: async (gameId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.payJailFine(gameId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
      ue.success("💰 Jail fine paid!");
    },
    onError: (err) => {
      ue.error(`Pay fine failed: ${err.message}`);
    }
  });
}
function useUseGetOutOfJailCard() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();
  const jailCardMethod = actor == null ? void 0 : actor.useGetOutOfJailCard.bind(actor);
  return useMutation({
    mutationFn: async (gameId) => {
      if (!actor || !jailCardMethod) throw new Error("Not connected");
      const result = await jailCardMethod(gameId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
      ue.success("🃏 Get Out of Jail card used!");
    }
  });
}
function usePlaceBid() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();
  return useMutation({
    mutationFn: async ({
      gameId,
      amount
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.placeBid(gameId, amount);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
      ue.success("🔨 Bid placed!");
    },
    onError: (err) => {
      ue.error(`Bid failed: ${err.message}`);
    }
  });
}
function useResolveAuction() {
  const { actor } = useActorInstance();
  const queryClient = useQueryClient();
  const { setGameSession } = useGameStore();
  return useMutation({
    mutationFn: async (gameId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.resolveAuction(gameId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (session) => {
      setGameSession(session);
      queryClient.invalidateQueries({ queryKey: ["game", session.id] });
    }
  });
}
function AuctionModal({
  gameId,
  auction,
  session,
  onClose
}) {
  var _a, _b;
  const [bidAmount, setBidAmount] = reactExports.useState("");
  const placeBid = usePlaceBid();
  const resolveAuction = useResolveAuction();
  const { myPlayerId } = useGameStore();
  const deed = (_a = session.ownedProperties.find(
    (p) => p.spaceId === auction.spaceId
  )) == null ? void 0 : _a.deed;
  const spaceInfo = deed ? deed.name : `Space #${auction.spaceId.toString()}`;
  const highestBid = auction.bids.length > 0 ? auction.bids.reduce(
    (max, b) => b.amount > max.amount ? b : max
  ) : null;
  const myBid = myPlayerId ? auction.bids.find((b) => b.bidderId.toString() === myPlayerId) : null;
  const allPlayersHaveBid = session.players.filter((p) => !p.isBankrupt).length <= auction.bids.length;
  const handleBid = () => {
    const amount = BigInt(Math.floor(Number(bidAmount)));
    if (amount <= 0n) return;
    placeBid.mutate({ gameId, amount });
    setBidAmount("");
  };
  const handleResolve = () => {
    resolveAuction.mutate(gameId);
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      "data-ocid": "auction-modal",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-foreground/40 backdrop-blur-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "dialog",
          {
            open: true,
            className: "relative bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-0 border-0 m-0",
            "aria-label": "Property Auction",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-primary to-accent p-5 text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-card/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-extrabold text-lg", children: "Auction!" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/80 text-sm", children: spaceInfo })
                ] }),
                auction.isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1.5 bg-card/20 rounded-full px-3 py-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-green-400 animate-pulse" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "LIVE" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-xl p-4 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-1", children: "Current Highest Bid" }),
                  highestBid ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-display font-extrabold text-primary", children: formatMoney(highestBid.amount) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: [
                      "by",
                      " ",
                      ((_b = session.players.find(
                        (p) => p.id.toString() === highestBid.bidderId.toString()
                      )) == null ? void 0 : _b.username) ?? "Unknown"
                    ] })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-display font-bold text-muted-foreground", children: "No bids yet" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "All Bids" }),
                  auction.bids.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "Waiting for bids…" }),
                  auction.bids.slice().sort(
                    (a, b) => a.amount > b.amount ? -1 : 1
                  ).map((bid, i) => {
                    const player = session.players.find(
                      (p) => p.id.toString() === bid.bidderId.toString()
                    );
                    const isHighest = i === 0;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl",
                          isHighest ? "bg-primary/10 border border-primary/30" : "bg-muted/30"
                        ),
                        children: [
                          isHighest && /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4 text-primary flex-shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            PlayerAvatar,
                            {
                              avatarId: (player == null ? void 0 : player.avatarId) ?? 0n,
                              playerIndex: session.players.indexOf(player),
                              size: "xs"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium truncate", children: (player == null ? void 0 : player.username) ?? "Player" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: cn(
                                "font-bold tabular-nums text-sm",
                                isHighest ? "text-primary" : "text-foreground"
                              ),
                              children: formatMoney(bid.amount)
                            }
                          )
                        ]
                      },
                      bid.bidderId.toString()
                    );
                  })
                ] }),
                auction.isOpen && !myBid && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "auction-bid-form", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Your Bid" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold", children: "$" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          type: "number",
                          min: 1,
                          placeholder: "Enter amount",
                          className: "pl-7",
                          value: bidAmount,
                          onChange: (e) => setBidAmount(e.target.value),
                          "data-ocid": "auction-bid-input",
                          onKeyDown: (e) => e.key === "Enter" && handleBid()
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        onClick: handleBid,
                        disabled: !bidAmount || Number(bidAmount) <= 0 || placeBid.isPending,
                        className: "bg-primary text-primary-foreground hover:bg-primary/90 font-bold",
                        "data-ocid": "place-bid-btn",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "w-4 h-4 mr-1" }),
                          "Bid"
                        ]
                      }
                    )
                  ] })
                ] }),
                myBid && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-accent/10 border border-accent/30 rounded-xl p-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-accent", children: [
                  "Your bid: ",
                  formatMoney(myBid.amount),
                  " ✓"
                ] }) }),
                allPlayersHaveBid && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: handleResolve,
                    disabled: resolveAuction.isPending,
                    className: "w-full bg-primary text-primary-foreground font-bold",
                    "data-ocid": "resolve-auction-btn",
                    children: "🔨 Resolve Auction"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
const DOT_POSITIONS = {
  1: [["50%", "50%"]],
  2: [
    ["25%", "25%"],
    ["75%", "75%"]
  ],
  3: [
    ["25%", "25%"],
    ["50%", "50%"],
    ["75%", "75%"]
  ],
  4: [
    ["25%", "25%"],
    ["75%", "25%"],
    ["25%", "75%"],
    ["75%", "75%"]
  ],
  5: [
    ["25%", "25%"],
    ["75%", "25%"],
    ["50%", "50%"],
    ["25%", "75%"],
    ["75%", "75%"]
  ],
  6: [
    ["25%", "20%"],
    ["75%", "20%"],
    ["25%", "50%"],
    ["75%", "50%"],
    ["25%", "80%"],
    ["75%", "80%"]
  ]
};
function DiceFace({ value, className }) {
  const dots = DOT_POSITIONS[value] ?? DOT_POSITIONS[1];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn(
        "relative rounded-xl bg-card border-2 border-border",
        "shadow-[inset_0_1px_3px_rgba(0,0,0,0.12),0_3px_8px_rgba(0,0,0,0.18)]",
        className
      ),
      "aria-label": `Die showing ${value}`,
      children: dots.map(([left, top]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute w-[18%] h-[18%] rounded-full bg-foreground",
          style: {
            left,
            top,
            transform: "translate(-50%, -50%)"
          }
        },
        `${left}-${top}`
      ))
    }
  );
}
function DiceComponent({
  die1,
  die2,
  isRolling,
  onRoll,
  isMyTurn = false,
  disabled = false
}) {
  const canRoll = isMyTurn && !disabled && !isRolling && !!onRoll;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 items-center justify-center", children: [die1, die2].map((val, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        animate: isRolling ? {
          rotate: [0, 180, 360, 540, 720],
          scale: [1, 1.1, 0.95, 1.1, 1]
        } : { rotate: 0, scale: 1 },
        transition: isRolling ? {
          duration: 0.65,
          ease: [0.4, 0, 0.2, 1]
        } : { duration: 0.3, type: "spring", stiffness: 300 },
        style: { perspective: 300 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(DiceFace, { value: val, className: "w-10 h-10" })
      },
      `die-${idx}`
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: !isRolling && (die1 > 0 || die2 > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { scale: 0.5, opacity: 0, y: 4 },
        animate: { scale: 1, opacity: 1, y: 0 },
        exit: { scale: 0.5, opacity: 0 },
        className: "text-sm font-display font-black text-foreground",
        children: [
          "= ",
          die1 + die2,
          die1 === die2 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-primary", children: "doubles!" })
        ]
      },
      `${die1}-${die2}`
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.button,
      {
        type: "button",
        disabled: !canRoll,
        onClick: onRoll,
        "data-ocid": "roll-dice-btn",
        whileHover: canRoll ? { scale: 1.06, y: -2 } : {},
        whileTap: canRoll ? { scale: 0.94 } : {},
        className: cn(
          "relative px-6 py-3 rounded-2xl font-display font-black text-base tracking-wide",
          "transition-all duration-200 overflow-hidden",
          canRoll ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40 cursor-pointer" : "bg-muted text-muted-foreground cursor-not-allowed"
        ),
        children: [
          isRolling ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.span,
              {
                animate: { rotate: 360 },
                transition: {
                  duration: 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear"
                },
                className: "text-lg",
                children: "🎲"
              }
            ),
            "Rolling…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "🎲" }),
            "ROLL"
          ] }),
          canRoll && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-card/20 to-transparent pointer-events-none rounded-2xl" })
        ]
      }
    )
  ] });
}
const COLOR_GROUP_STYLES = {
  [ColorGroup.brown]: "bg-amber-800",
  [ColorGroup.lightBlue]: "bg-sky-300",
  [ColorGroup.pink]: "bg-pink-400",
  [ColorGroup.orange]: "bg-orange-400",
  [ColorGroup.red]: "bg-red-400",
  [ColorGroup.yellow]: "bg-yellow-300",
  [ColorGroup.green]: "bg-emerald-400",
  [ColorGroup.darkBlue]: "bg-blue-400",
  [ColorGroup.railroad]: "bg-neutral-600",
  [ColorGroup.utility]: "bg-violet-400"
};
const SPACE_TYPE_CONFIG = {
  go: { bg: "bg-emerald-100 border-emerald-400", icon: "⭐", label: "GO" },
  jail: { bg: "bg-slate-200 border-slate-400", icon: "🔒", label: "JAIL" },
  free_parking: {
    bg: "bg-yellow-100 border-yellow-400",
    icon: "🚗",
    label: "FREE PARKING"
  },
  go_to_jail: {
    bg: "bg-red-100 border-red-400",
    icon: "👮",
    label: "GO TO JAIL"
  },
  chance: { bg: "bg-sky-100 border-sky-400", icon: "❓" },
  community_chest: { bg: "bg-orange-100 border-orange-400", icon: "📦" },
  tax: { bg: "bg-slate-100 border-slate-300", icon: "💸" },
  corner: { bg: "bg-muted border-border", icon: "" }
};
function UpgradePips({ level }) {
  const n = Number(level);
  if (n === 0) return null;
  if (n >= 5) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] leading-none", children: "🏨" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex gap-[1px] flex-wrap justify-center", children: Array.from({ length: n }).map((_, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length array from level number
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7px] leading-none", children: "🏠" }, i)
  )) });
}
function BoardSpace({
  space,
  ownedBy,
  playersHere,
  isSelected = false,
  onClick,
  orientation = "bottom",
  style
}) {
  const isCorner = [
    "go",
    "jail",
    "free_parking",
    "go_to_jail",
    "corner"
  ].includes(space.type);
  const typeConfig = SPACE_TYPE_CONFIG[space.type];
  const colorBandClass = space.colorGroup ? COLOR_GROUP_STYLES[space.colorGroup] : null;
  const baseBg = (typeConfig == null ? void 0 : typeConfig.bg) ?? "bg-emerald-50 border-emerald-200";
  const bandPos = {
    top: "h-2.5 w-full top-0 left-0 rounded-t-sm",
    bottom: "h-2.5 w-full bottom-0 left-0 rounded-b-sm",
    left: "w-2.5 h-full left-0 top-0 rounded-l-sm",
    right: "w-2.5 h-full right-0 top-0 rounded-r-sm",
    corner: "hidden"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "aria-label": space.name,
      "data-ocid": `board-space-${space.id}`,
      onClick,
      style,
      className: cn(
        "relative flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none",
        "border transition-colors duration-150",
        isCorner ? "rounded-xl" : "rounded-sm",
        baseBg,
        isSelected && "ring-2 ring-primary ring-offset-1 z-10",
        onClick && "hover:brightness-95 active:brightness-90",
        isCorner ? "p-0.5" : "p-px"
      ),
      children: [
        colorBandClass && !isCorner && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("absolute", bandPos[orientation], colorBandClass) }),
        (ownedBy == null ? void 0 : ownedBy.isMortgaged) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-foreground/20 z-10 flex items-center justify-center rounded-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-bold text-foreground rotate-[-25deg]", children: "MORT" }) }),
        isCorner ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center w-full h-full gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl leading-none", children: typeConfig == null ? void 0 : typeConfig.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7px] font-display font-black text-foreground leading-tight text-center", children: (typeConfig == null ? void 0 : typeConfig.label) ?? space.name })
        ] }) : (
          /* Regular space */
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "flex flex-col items-center justify-center gap-[1px] w-full h-full",
                orientation === "top" || orientation === "bottom" ? "pt-3 pb-0.5" : "pl-3 pr-0.5"
              ),
              children: [
                (typeConfig == null ? void 0 : typeConfig.icon) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] leading-none", children: typeConfig.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "font-display font-bold text-foreground leading-tight text-center break-words hyphens-auto",
                      "text-[6px]"
                    ),
                    children: space.name
                  }
                ),
                space.purchasePrice != null && !ownedBy && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[5px] text-muted-foreground font-mono leading-none", children: [
                  "$",
                  space.purchasePrice
                ] }),
                ownedBy && /* @__PURE__ */ jsxRuntimeExports.jsx(UpgradePips, { level: ownedBy.upgradeLevel })
              ]
            }
          )
        ),
        playersHere.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0.5 right-0.5 flex flex-wrap gap-[1px] max-w-[10px]", children: playersHere.slice(0, 4).map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-1.5 h-1.5 rounded-full border border-card",
            style: {
              backgroundColor: PLAYER_COLORS[i % PLAYER_COLORS.length].token
            }
          },
          String(p.id)
        )) })
      ]
    }
  );
}
function PlayerToken({
  avatarId,
  playerIndex,
  x,
  y,
  isActive = false,
  isBankrupt = false,
  username,
  stackOffset = 0
}) {
  const emoji = getAvatarEmoji(avatarId);
  const color = PLAYER_COLORS[playerIndex % PLAYER_COLORS.length];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      animate: {
        left: x + stackOffset * 10,
        top: y + stackOffset * 8,
        scale: isActive ? 1.25 : 1,
        filter: isBankrupt ? "grayscale(1) opacity(0.5)" : "grayscale(0) opacity(1)"
      },
      transition: {
        left: { type: "spring", stiffness: 200, damping: 22 },
        top: { type: "spring", stiffness: 200, damping: 22 },
        scale: { type: "spring", stiffness: 300, damping: 20 }
      },
      style: { position: "absolute", zIndex: isActive ? 30 : 20 + playerIndex },
      "aria-label": `${username ?? "Player"} token`,
      "data-ocid": `player-token-${playerIndex}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 rounded-full blur-[3px] opacity-30",
            style: {
              backgroundColor: color.token,
              transform: "translateY(3px) scaleX(0.9)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "relative flex items-center justify-center rounded-full border-2 border-card",
            style: {
              width: 28,
              height: 28,
              backgroundColor: color.token,
              boxShadow: isActive ? `0 0 0 3px ${color.token}55, 0 0 12px ${color.token}99` : void 0
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-sm leading-none select-none",
                role: "img",
                "aria-hidden": true,
                children: emoji
              }
            )
          }
        ),
        isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "absolute inset-[-4px] rounded-full border-2",
            style: { borderColor: color.token },
            animate: { scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] },
            transition: {
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut"
            }
          }
        )
      ]
    },
    `token-${String(avatarId)}-${playerIndex}`
  );
}
const BOARD_SPACES = [
  // Bottom row (right → left), indices 0–10
  { id: 0, name: "GO", type: "go", gridPos: [10, 10] },
  {
    id: 1,
    name: "Mediterranean",
    type: "property",
    colorGroup: ColorGroup.brown,
    purchasePrice: 60,
    gridPos: [9, 10]
  },
  { id: 2, name: "Community Chest", type: "community_chest", gridPos: [8, 10] },
  {
    id: 3,
    name: "Baltic Ave",
    type: "property",
    colorGroup: ColorGroup.brown,
    purchasePrice: 60,
    gridPos: [7, 10]
  },
  { id: 4, name: "Income Tax", type: "tax", gridPos: [6, 10] },
  {
    id: 5,
    name: "Reading RR",
    type: "railroad",
    colorGroup: ColorGroup.railroad,
    purchasePrice: 200,
    gridPos: [5, 10]
  },
  {
    id: 6,
    name: "Oriental Ave",
    type: "property",
    colorGroup: ColorGroup.lightBlue,
    purchasePrice: 100,
    gridPos: [4, 10]
  },
  { id: 7, name: "Chance", type: "chance", gridPos: [3, 10] },
  {
    id: 8,
    name: "Vermont Ave",
    type: "property",
    colorGroup: ColorGroup.lightBlue,
    purchasePrice: 100,
    gridPos: [2, 10]
  },
  {
    id: 9,
    name: "Connecticut Ave",
    type: "property",
    colorGroup: ColorGroup.lightBlue,
    purchasePrice: 120,
    gridPos: [1, 10]
  },
  { id: 10, name: "Jail", type: "jail", gridPos: [0, 10] },
  // Left column (bottom → top), indices 11–19
  {
    id: 11,
    name: "St. Charles",
    type: "property",
    colorGroup: ColorGroup.pink,
    purchasePrice: 140,
    gridPos: [0, 9]
  },
  {
    id: 12,
    name: "Electric Co",
    type: "utility",
    colorGroup: ColorGroup.utility,
    purchasePrice: 150,
    gridPos: [0, 8]
  },
  {
    id: 13,
    name: "States Ave",
    type: "property",
    colorGroup: ColorGroup.pink,
    purchasePrice: 140,
    gridPos: [0, 7]
  },
  {
    id: 14,
    name: "Virginia Ave",
    type: "property",
    colorGroup: ColorGroup.pink,
    purchasePrice: 160,
    gridPos: [0, 6]
  },
  {
    id: 15,
    name: "Pennsylvania RR",
    type: "railroad",
    colorGroup: ColorGroup.railroad,
    purchasePrice: 200,
    gridPos: [0, 5]
  },
  {
    id: 16,
    name: "St. James Pl",
    type: "property",
    colorGroup: ColorGroup.orange,
    purchasePrice: 180,
    gridPos: [0, 4]
  },
  { id: 17, name: "Community Chest", type: "community_chest", gridPos: [0, 3] },
  {
    id: 18,
    name: "Tennessee Ave",
    type: "property",
    colorGroup: ColorGroup.orange,
    purchasePrice: 180,
    gridPos: [0, 2]
  },
  {
    id: 19,
    name: "New York Ave",
    type: "property",
    colorGroup: ColorGroup.orange,
    purchasePrice: 200,
    gridPos: [0, 1]
  },
  { id: 20, name: "Free Parking", type: "free_parking", gridPos: [0, 0] },
  // Top row (left → right), indices 21–29
  {
    id: 21,
    name: "Kentucky Ave",
    type: "property",
    colorGroup: ColorGroup.red,
    purchasePrice: 220,
    gridPos: [1, 0]
  },
  { id: 22, name: "Chance", type: "chance", gridPos: [2, 0] },
  {
    id: 23,
    name: "Indiana Ave",
    type: "property",
    colorGroup: ColorGroup.red,
    purchasePrice: 220,
    gridPos: [3, 0]
  },
  {
    id: 24,
    name: "Illinois Ave",
    type: "property",
    colorGroup: ColorGroup.red,
    purchasePrice: 240,
    gridPos: [4, 0]
  },
  {
    id: 25,
    name: "B&O Railroad",
    type: "railroad",
    colorGroup: ColorGroup.railroad,
    purchasePrice: 200,
    gridPos: [5, 0]
  },
  {
    id: 26,
    name: "Atlantic Ave",
    type: "property",
    colorGroup: ColorGroup.yellow,
    purchasePrice: 260,
    gridPos: [6, 0]
  },
  {
    id: 27,
    name: "Ventnor Ave",
    type: "property",
    colorGroup: ColorGroup.yellow,
    purchasePrice: 260,
    gridPos: [7, 0]
  },
  {
    id: 28,
    name: "Water Works",
    type: "utility",
    colorGroup: ColorGroup.utility,
    purchasePrice: 150,
    gridPos: [8, 0]
  },
  {
    id: 29,
    name: "Marvin Gardens",
    type: "property",
    colorGroup: ColorGroup.yellow,
    purchasePrice: 280,
    gridPos: [9, 0]
  },
  { id: 30, name: "Go To Jail", type: "go_to_jail", gridPos: [10, 0] },
  // Right column (top → bottom), indices 31–39
  {
    id: 31,
    name: "Pacific Ave",
    type: "property",
    colorGroup: ColorGroup.green,
    purchasePrice: 300,
    gridPos: [10, 1]
  },
  {
    id: 32,
    name: "N Carolina Ave",
    type: "property",
    colorGroup: ColorGroup.green,
    purchasePrice: 300,
    gridPos: [10, 2]
  },
  {
    id: 33,
    name: "Community Chest",
    type: "community_chest",
    gridPos: [10, 3]
  },
  {
    id: 34,
    name: "Pennsylvania Ave",
    type: "property",
    colorGroup: ColorGroup.green,
    purchasePrice: 320,
    gridPos: [10, 4]
  },
  {
    id: 35,
    name: "Short Line RR",
    type: "railroad",
    colorGroup: ColorGroup.railroad,
    purchasePrice: 200,
    gridPos: [10, 5]
  },
  { id: 36, name: "Chance", type: "chance", gridPos: [10, 6] },
  {
    id: 37,
    name: "Park Place",
    type: "property",
    colorGroup: ColorGroup.darkBlue,
    purchasePrice: 350,
    gridPos: [10, 7]
  },
  { id: 38, name: "Luxury Tax", type: "tax", gridPos: [10, 8] },
  {
    id: 39,
    name: "Boardwalk",
    type: "property",
    colorGroup: ColorGroup.darkBlue,
    purchasePrice: 400,
    gridPos: [10, 9]
  }
];
function getOrientation(space) {
  const [col, row] = space.gridPos;
  if (row === 10) return "top";
  if (row === 0) return "bottom";
  if (col === 0) return "right";
  if (col === 10) return "left";
  return "corner";
}
function GameBoard({ session, onSpaceClick }) {
  const boardRef = reactExports.useRef(null);
  const ownedMap = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const p of session.ownedProperties) {
      m.set(Number(p.spaceId), p);
    }
    return m;
  }, [session.ownedProperties]);
  const playersBySpace = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const p of session.players) {
      const pos = Number(p.position);
      if (!m.has(pos)) m.set(pos, []);
      m.get(pos).push(p);
    }
    return m;
  }, [session.players]);
  const GRID = 11;
  const CELL = 100 / GRID;
  const CORNER = CELL * 2;
  const SIDE = CELL;
  function getSpaceCenter(spaceId) {
    const space = BOARD_SPACES[spaceId];
    if (!space) return { xPct: 50, yPct: 50 };
    const [col, row] = space.gridPos;
    return {
      xPct: (col + 0.5) / GRID * 100,
      yPct: (row + 0.5) / GRID * 100
    };
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: boardRef,
      className: "relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-emerald-400 bg-emerald-100 shadow-2xl",
      "data-ocid": "game-board",
      style: {
        display: "grid",
        gridTemplateColumns: `${CORNER}% repeat(9, ${SIDE}%) ${CORNER}%`,
        gridTemplateRows: `${CORNER}% repeat(9, ${SIDE}%) ${CORNER}%`
      },
      children: [
        BOARD_SPACES.map((space) => {
          const [col, row] = space.gridPos;
          const owned = ownedMap.get(space.id);
          const here = playersBySpace.get(space.id) ?? [];
          const orientation = getOrientation(space);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            BoardSpace,
            {
              space,
              ownedBy: owned,
              playersHere: here,
              orientation,
              onClick: space.type === "property" || space.type === "railroad" || space.type === "utility" ? () => onSpaceClick == null ? void 0 : onSpaceClick(BigInt(space.id)) : void 0,
              style: {
                gridColumn: `${col + 1}`,
                gridRow: `${row + 1}`
              }
            },
            space.id
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center justify-center",
            style: {
              gridColumn: "2 / 11",
              gridRow: "2 / 11",
              background: "radial-gradient(ellipse at center, #d1fae5 0%, #ecfdf5 60%, #bbf7d0 100%)",
              borderRadius: 8
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 select-none opacity-30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: "🎲" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-emerald-700 text-xs tracking-widest uppercase", children: "Monopoly" })
            ] })
          }
        ),
        session.players.map((player, idx) => {
          const pos = Number(player.position);
          const { xPct, yPct } = getSpaceCenter(pos);
          const spacemates = playersBySpace.get(pos) ?? [];
          const stackIdx = spacemates.findIndex(
            (p) => String(p.id) === String(player.id)
          );
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            PlayerToken,
            {
              avatarId: player.avatarId,
              playerIndex: idx,
              x: xPct,
              y: yPct,
              isActive: idx === Number(session.currentPlayerIndex),
              isBankrupt: player.isBankrupt,
              username: player.username,
              stackOffset: stackIdx
            },
            String(player.id)
          );
        })
      ]
    }
  );
}
const sizeMap = {
  sm: "text-sm font-semibold",
  md: "text-base font-bold",
  lg: "text-xl font-bold font-display",
  xl: "text-3xl font-extrabold font-display"
};
const variantMap = {
  default: "text-foreground",
  gain: "text-accent",
  loss: "text-destructive",
  muted: "text-muted-foreground"
};
function MoneyDisplay({
  amount,
  size = "md",
  variant = "default",
  showSign = false,
  animated = false,
  className
}) {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const sign = showSign ? isNegative ? "-" : "+" : isNegative ? "-" : "";
  const formatted = `${sign}$${absNum.toLocaleString()}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: cn(
        "tabular-nums tracking-tight transition-smooth",
        sizeMap[size],
        variantMap[variant],
        animated && "animate-pulse-gentle",
        className
      ),
      "data-ocid": "money-display",
      children: formatted
    }
  );
}
function PlayerCard({ player, index, isCurrentTurn, isMe }) {
  const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
  const inJail = player.jailStatus.__kind__ === "inJail";
  const balance = Number(player.balance);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      animate: { opacity: player.isBankrupt ? 0.5 : 1 },
      className: cn(
        "flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200",
        isCurrentTurn ? "border-primary bg-primary/5 shadow-md shadow-primary/20" : "border-border bg-card",
        isMe && "ring-2 ring-offset-1 ring-accent"
      ),
      "data-ocid": `player-card-${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PlayerAvatar,
            {
              avatarId: player.avatarId,
              playerIndex: index,
              size: "sm",
              isActive: isCurrentTurn,
              isBankrupt: player.isBankrupt
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
              style: { backgroundColor: color.token }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "font-display font-bold text-sm truncate",
                  isMe ? "text-accent-foreground" : "text-foreground"
                ),
                children: player.username
              }
            ),
            isMe && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-[9px] px-1 py-0 h-4 flex-shrink-0 font-bold",
                children: "YOU"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MoneyDisplay,
            {
              amount: balance,
              size: "sm",
              variant: balance < 200 ? "loss" : "default"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-mono", children: [
            player.ownedSpaces.length,
            "🏠"
          ] }),
          inJail && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "destructive",
              className: "text-[9px] px-1 py-0 h-4 font-bold",
              children: "JAIL"
            }
          ),
          player.isBankrupt && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "text-[9px] px-1 py-0 h-4 font-bold text-muted-foreground",
              children: "💀"
            }
          ),
          isCurrentTurn && !player.isBankrupt && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: { scale: [1, 1.2, 1] },
              transition: { duration: 1, repeat: Number.POSITIVE_INFINITY },
              className: "w-2 h-2 rounded-full bg-primary"
            }
          )
        ] })
      ]
    }
  );
}
function PlayerSidebar({ session, myPlayerId }) {
  const currentPlayerIdx = Number(session.currentPlayerIndex);
  const currentPlayer = session.players[currentPlayerIdx];
  const phaseLabel = {
    roll: "🎲 Roll Dice",
    move: "🚶 Moving…",
    landAndAct: "🤔 Buy or Pass?",
    auction: "🔨 Auction!",
    endTurn: "✅ End Turn"
  };
  const phaseText = phaseLabel[session.turnPhase.__kind__] ?? session.turnPhase.__kind__;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 w-full", "data-ocid": "player-sidebar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-2 border-border rounded-2xl p-3 text-center shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-body text-muted-foreground uppercase tracking-widest mb-1", children: "Current Turn" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-base text-foreground truncate", children: (currentPlayer == null ? void 0 : currentPlayer.username) ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs font-bold bg-primary/10 text-primary border-primary/30 px-2", children: phaseText }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: session.players.map((player, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlayerCard,
      {
        player,
        index: idx,
        isCurrentTurn: idx === currentPlayerIdx,
        isMe: String(player.id) === myPlayerId
      },
      String(player.id)
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/40 rounded-xl p-2.5 text-[10px] text-muted-foreground text-center font-body", children: "🏠 = owned properties" })
  ] });
}
function ActionPanel({
  gameId,
  session,
  isMyTurn,
  myPlayerId
}) {
  const phase = session.turnPhase.__kind__;
  const myPlayer = session.players.find((p) => String(p.id) === myPlayerId);
  const jailStatus = myPlayer == null ? void 0 : myPlayer.jailStatus;
  const inJail = (jailStatus == null ? void 0 : jailStatus.__kind__) === "inJail";
  const hasJailCard = inJail && jailStatus.__kind__ === "inJail" ? jailStatus.inJail.hasGetOutCard : false;
  const rollMut = useRollAndMove();
  const buyMut = useBuyProperty();
  const passMut = usePassOnProperty();
  const endTurnMut = useEndTurn();
  const payJailMut = usePayJailFine();
  const jailCardMut = useUseGetOutOfJailCard();
  const upgradeMut = useUpgradeProperty();
  const mortgageMut = useMortgageProperty();
  const isDiceRolling = useGameStore((s) => s.uiState.isDiceAnimating);
  const die1 = session.lastDiceRoll ? Number(session.lastDiceRoll.die1) : 0;
  const die2 = session.lastDiceRoll ? Number(session.lastDiceRoll.die2) : 0;
  const currentPlayer = session.players[Number(session.currentPlayerIndex)];
  const currentSpaceId = currentPlayer ? BigInt(Number(currentPlayer.position)) : 0n;
  const handleRoll = reactExports.useCallback(() => {
    rollMut.mutate(gameId);
  }, [rollMut, gameId]);
  const handleBuy = reactExports.useCallback(() => {
    buyMut.mutate({ gameId, spaceId: currentSpaceId });
  }, [buyMut, gameId, currentSpaceId]);
  const handlePass = reactExports.useCallback(() => {
    passMut.mutate({ gameId, spaceId: currentSpaceId });
  }, [passMut, gameId, currentSpaceId]);
  const handleEndTurn = reactExports.useCallback(() => {
    endTurnMut.mutate(gameId);
  }, [endTurnMut, gameId]);
  if (!isMyTurn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DiceComponent,
        {
          die1,
          die2,
          isRolling: isDiceRolling,
          isMyTurn: false
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground font-body text-center", children: [
        "Waiting for ",
        (currentPlayer == null ? void 0 : currentPlayer.username) ?? "other player",
        "…"
      ] })
    ] });
  }
  const landedOwned = phase === "landAndAct" ? session.ownedProperties.find((p) => p.spaceId === currentSpaceId) : null;
  const landedOwner = landedOwned ? session.players.find(
    (pl) => pl.id.toString() === landedOwned.ownerId.toString()
  ) : null;
  const rentEstimate = landedOwned ? Number(landedOwned.deed.rentBase) * Math.max(1, Number(landedOwned.upgradeLevel)) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 p-3", "data-ocid": "action-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl p-3 border-2 border-border shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      DiceComponent,
      {
        die1,
        die2,
        isRolling: isDiceRolling,
        onRoll: phase === "roll" ? handleRoll : void 0,
        isMyTurn: phase === "roll",
        disabled: rollMut.isPending
      }
    ) }),
    inJail && phase === "roll" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-display font-bold text-center text-destructive", children: "🔒 You are in Jail!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            variant: "outline",
            className: "flex-1 rounded-xl text-xs font-bold",
            onClick: () => payJailMut.mutate(gameId),
            disabled: payJailMut.isPending,
            "data-ocid": "pay-jail-btn",
            children: "💰 Pay $50"
          }
        ),
        hasJailCard && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            variant: "outline",
            className: "flex-1 rounded-xl text-xs font-bold",
            onClick: () => jailCardMut.mutate(gameId),
            disabled: jailCardMut.isPending,
            "data-ocid": "jail-card-btn",
            children: "🃏 Use Card"
          }
        )
      ] })
    ] }),
    phase === "landAndAct" && !landedOwned && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-display font-bold text-center text-foreground", children: "Buy this property?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            className: "flex-1 rounded-xl font-bold",
            onClick: handleBuy,
            disabled: buyMut.isPending,
            "data-ocid": "buy-property-btn",
            children: "🏠 Buy!"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            className: "flex-1 rounded-xl font-bold",
            onClick: handlePass,
            disabled: passMut.isPending,
            "data-ocid": "pass-property-btn",
            children: "Pass"
          }
        )
      ] })
    ] }),
    phase === "landAndAct" && landedOwned && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-display font-bold text-center text-destructive", children: [
        "Owned by ",
        (landedOwner == null ? void 0 : landedOwner.username) ?? "another player"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
        "Rent: $",
        rentEstimate.toLocaleString()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          className: "w-full rounded-xl font-bold",
          onClick: handleEndTurn,
          disabled: endTurnMut.isPending,
          "data-ocid": "pay-rent-end-turn-btn",
          children: "Pay Rent & End Turn"
        }
      )
    ] }),
    phase === "endTurn" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        className: "w-full rounded-xl font-bold",
        onClick: handleEndTurn,
        disabled: endTurnMut.isPending,
        "data-ocid": "end-turn-btn",
        children: "End Turn ✅"
      }
    ),
    phase === "endTurn" && myPlayer && myPlayer.ownedSpaces.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          variant: "outline",
          className: "flex-1 rounded-xl text-xs",
          onClick: () => {
            const sp = myPlayer.ownedSpaces[0];
            if (sp !== void 0) upgradeMut.mutate({ gameId, spaceId: sp });
          },
          disabled: upgradeMut.isPending,
          "data-ocid": "upgrade-property-btn",
          children: "🏗️ Upgrade"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          variant: "outline",
          className: "flex-1 rounded-xl text-xs",
          onClick: () => {
            const sp = myPlayer.ownedSpaces[0];
            if (sp !== void 0) mortgageMut.mutate({ gameId, spaceId: sp });
          },
          disabled: mortgageMut.isPending,
          "data-ocid": "mortgage-property-btn",
          children: "📑 Mortgage"
        }
      )
    ] })
  ] });
}
function GameBoardPage() {
  const { gameId } = useParams({ from: "/game/$gameId" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const myPlayerId = identity ? String(identity.getPrincipal()) : null;
  const { gameSession: session, setMyPlayerId } = useGameStore();
  const [selectedSpaceId, setSelectedSpaceId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setMyPlayerId(myPlayerId);
  }, [myPlayerId, setMyPlayerId]);
  useGamePolling(gameId ?? null);
  const isMyTurn = !!session && (() => {
    const curPlayer = session.players[Number(session.currentPlayerIndex)];
    return curPlayer ? String(curPlayer.id) === myPlayerId : false;
  })();
  if ((session == null ? void 0 : session.status.__kind__) === "finished") {
    void navigate({ to: `/game/${gameId}/result` });
    return null;
  }
  if (!session) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen bg-background flex items-center justify-center",
        "data-ocid": "board-loading",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: { rotate: 360 },
              transition: {
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear"
              },
              className: "text-5xl",
              children: "🎲"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: "Loading game…" })
        ] })
      }
    );
  }
  const currentPlayer = session.players[Number(session.currentPlayerIndex)];
  const phaseLabel = {
    roll: "Roll Dice",
    move: "Moving…",
    landAndAct: "Buy or Pass?",
    auction: "Auction!",
    endTurn: "End Turn"
  };
  const selectedSpace = selectedSpaceId !== null ? BOARD_SPACES.find((s) => s.id === Number(selectedSpaceId)) : null;
  const ownedProp = selectedSpaceId !== null ? session.ownedProperties.find((p) => p.spaceId === selectedSpaceId) : null;
  const ownerPlayer = ownedProp ? session.players.find((p) => String(p.id) === String(ownedProp.ownerId)) : null;
  const auctionState = session.turnPhase.__kind__ === "auction" ? session.turnPhase.auction : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col",
      "data-ocid": "game-board-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-card border-b-2 border-border px-4 py-2 flex items-center gap-3 shadow-sm flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl select-none", children: "🎲" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-lg text-foreground flex-1", children: "BoardBlast" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "font-bold text-xs border-primary text-primary",
              children: [
                (currentPlayer == null ? void 0 : currentPlayer.username) ?? "—",
                " —",
                " ",
                phaseLabel[session.turnPhase.__kind__] ?? session.turnPhase.__kind__
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "text-muted-foreground text-xs rounded-xl",
              onClick: () => {
                ue.info("Returning to home…");
                void navigate({ to: "/" });
              },
              "data-ocid": "leave-game-btn",
              children: "Leave"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "aside",
            {
              className: "w-52 flex-shrink-0 bg-card border-r-2 border-border overflow-y-auto",
              "data-ocid": "action-sidebar",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ActionPanel,
                {
                  gameId,
                  session,
                  isMyTurn,
                  myPlayerId
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex items-center justify-center p-4 bg-background overflow-hidden min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-[min(100%,70vh)] aspect-square", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            GameBoard,
            {
              session,
              myPlayerId,
              onSpaceClick: (id) => setSelectedSpaceId(id === selectedSpaceId ? null : id)
            }
          ) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "aside",
            {
              className: "w-52 flex-shrink-0 bg-card border-l-2 border-border overflow-y-auto p-3",
              "data-ocid": "player-sidebar-container",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlayerSidebar, { session, myPlayerId })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedSpace && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { y: 80, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            exit: { y: 80, opacity: 0 },
            className: "fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border-2 border-border rounded-2xl shadow-xl px-5 py-3 flex items-center gap-4 z-50",
            "data-ocid": "space-info-banner",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-base text-foreground", children: selectedSpace.name }),
                selectedSpace.purchasePrice != null && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: ownedProp ? `Owned by ${(ownerPlayer == null ? void 0 : ownerPlayer.username) ?? "unknown"} · Level ${Number(ownedProp.upgradeLevel)}` : `$${selectedSpace.purchasePrice}` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "text-muted-foreground hover:text-foreground text-xl leading-none",
                  onClick: () => setSelectedSpaceId(null),
                  "aria-label": "Close space info",
                  children: "×"
                }
              )
            ]
          }
        ) }),
        auctionState && /* @__PURE__ */ jsxRuntimeExports.jsx(
          AuctionModal,
          {
            gameId,
            auction: auctionState,
            session,
            onClose: () => {
            }
          }
        )
      ]
    }
  );
}
export {
  GameBoardPage as default
};
