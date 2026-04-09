import { r as reactExports, j as jsxRuntimeExports, a1 as React, a2 as Variant, a3 as Record, a4 as Vec, a5 as Opt, a6 as Service, a7 as Func, a8 as Text, a9 as Nat, aa as Bool, ab as Principal, ac as Int, ad as Null, ae as React$1 } from "./index-xRF9tkV2.js";
import { b as clsx, c as cn } from "./createLucideIcon-DznkbKl0.js";
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
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var use = React[" use ".trim().toString()];
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
  return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
var Slot = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  var _a, _b;
  let getter = (_a = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
const falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = clsx;
const cva = (base, config) => (props) => {
  var _config_compoundVariants;
  if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  const { variants, defaultVariants } = config;
  const getVariantClassNames = Object.keys(variants).map((variant) => {
    const variantProp = props === null || props === void 0 ? void 0 : props[variant];
    const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
    if (variantProp === null) return null;
    const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
    return variants[variant][variantKey];
  });
  const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
    let [key, value] = param;
    if (value === void 0) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
  const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
    let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
    return Object.entries(compoundVariantOptions).every((param2) => {
      let [key, value] = param2;
      return Array.isArray(value) ? value.includes({
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key]) : {
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key] === value;
    }) ? [
      ...acc,
      cvClass,
      cvClassName
    ] : acc;
  }, []);
  return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
const GameId = Text;
const PlayerId = Principal;
const GameStatus = Variant({
  "active": Null,
  "finished": Record({ "winnerId": PlayerId })
});
const Timestamp = Int;
const Money = Int;
const SpaceId = Nat;
const AvatarId = Nat;
const JailStatus = Variant({
  "inJail": Record({
    "hasGetOutCard": Bool,
    "turnsRemaining": Nat
  }),
  "notInJail": Null
});
const BoardPosition = Nat;
const PlayerStateView = Record({
  "id": PlayerId,
  "isBankrupt": Bool,
  "username": Text,
  "balance": Money,
  "lastSeenAt": Timestamp,
  "getOutOfJailCards": Nat,
  "ownedSpaces": Vec(SpaceId),
  "avatarId": AvatarId,
  "jailStatus": JailStatus,
  "position": BoardPosition
});
const AuctionBid = Record({
  "placedAt": Timestamp,
  "bidderId": PlayerId,
  "amount": Money
});
const AuctionStateView = Record({
  "startedAt": Timestamp,
  "bids": Vec(AuctionBid),
  "isOpen": Bool,
  "spaceId": SpaceId
});
const TurnPhaseView = Variant({
  "endTurn": Null,
  "move": Null,
  "roll": Null,
  "landAndAct": Null,
  "auction": AuctionStateView
});
const UpgradeLevel = Nat;
const ColorGroup = Variant({
  "red": Null,
  "utility": Null,
  "orange": Null,
  "pink": Null,
  "darkBlue": Null,
  "green": Null,
  "railroad": Null,
  "brown": Null,
  "lightBlue": Null,
  "yellow": Null
});
const PropertyDeed = Record({
  "purchasePrice": Money,
  "housePrice": Money,
  "mortgageValue": Money,
  "rentHouse1": Money,
  "rentHouse2": Money,
  "rentHouse3": Money,
  "rentHouse4": Money,
  "name": Text,
  "rentHotel": Money,
  "spaceId": SpaceId,
  "colorGroup": ColorGroup,
  "rentBase": Money
});
const OwnedPropertyView = Record({
  "upgradeLevel": UpgradeLevel,
  "ownerId": PlayerId,
  "deed": PropertyDeed,
  "spaceId": SpaceId,
  "isMortgaged": Bool
});
const DiceRoll = Record({ "die1": Nat, "die2": Nat });
const LobbyCode = Text;
const TradeStatus = Variant({
  "cancelled": Null,
  "pending": Null,
  "accepted": Null,
  "declined": Null
});
const TradeOfferView = Record({
  "id": Nat,
  "status": TradeStatus,
  "proposerSpaces": Vec(SpaceId),
  "createdAt": Timestamp,
  "proposerMoney": Money,
  "recipientMoney": Money,
  "recipientId": PlayerId,
  "recipientSpaces": Vec(SpaceId),
  "proposerId": PlayerId
});
const GameSessionView = Record({
  "id": GameId,
  "status": GameStatus,
  "startedAt": Timestamp,
  "currentPlayerIndex": Nat,
  "updatedAt": Timestamp,
  "players": Vec(PlayerStateView),
  "turnPhase": TurnPhaseView,
  "ownedProperties": Vec(OwnedPropertyView),
  "lastDiceRoll": Opt(DiceRoll),
  "lobbyCode": LobbyCode,
  "pendingTrade": Opt(TradeOfferView)
});
const GameError = Variant({
  "propertyNotOwned": Null,
  "insufficientFunds": Null,
  "alreadyMortgaged": Null,
  "invalidPhase": Null,
  "propertyAlreadyOwned": Null,
  "tradeNotFound": Null,
  "notTradeParticipant": Null,
  "invalidBid": Null,
  "alreadyBankrupt": Null,
  "playerNotFound": Null,
  "maxUpgradeReached": Null,
  "gameNotFound": Null,
  "notYourTurn": Null,
  "notMortgaged": Null,
  "notInJail": Null
});
const LobbyStatus = Variant({
  "starting": Null,
  "finished": Null,
  "waiting": Null,
  "inProgress": Null
});
const LobbyPlayer = Record({
  "id": PlayerId,
  "username": Text,
  "joinedAt": Timestamp,
  "isHost": Bool,
  "isReady": Bool,
  "avatarId": AvatarId
});
const LobbyView = Record({
  "status": LobbyStatus,
  "code": LobbyCode,
  "createdAt": Timestamp,
  "gameId": Opt(GameId),
  "players": Vec(LobbyPlayer),
  "hostId": PlayerId,
  "maxPlayers": Nat
});
const LobbyError = Variant({
  "lobbyNotFound": Null,
  "lobbyAlreadyStarted": Null,
  "notHost": Null,
  "alreadyInLobby": Null,
  "tooFewPlayers": Null,
  "lobbyFull": Null,
  "notInLobby": Null
});
Service({
  "acceptTrade": Func(
    [GameId, Nat],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  ),
  "buyProperty": Func(
    [GameId, SpaceId],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  ),
  "createLobby": Func(
    [Text, AvatarId, Nat],
    [Variant({ "ok": LobbyView, "err": LobbyError })],
    []
  ),
  "declineTrade": Func(
    [GameId, Nat],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  ),
  "endTurn": Func(
    [GameId],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  ),
  "getGame": Func([GameId], [Opt(GameSessionView)], ["query"]),
  "getLobby": Func([LobbyCode], [Opt(LobbyView)], ["query"]),
  "heartbeat": Func([GameId], [], []),
  "joinLobby": Func(
    [LobbyCode, Text, AvatarId],
    [Variant({ "ok": LobbyView, "err": LobbyError })],
    []
  ),
  "leaveLobby": Func(
    [LobbyCode],
    [Variant({ "ok": Null, "err": LobbyError })],
    []
  ),
  "mortgageProperty": Func(
    [GameId, SpaceId],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  ),
  "passOnProperty": Func(
    [GameId, SpaceId],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  ),
  "payJailFine": Func(
    [GameId],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  ),
  "placeBid": Func(
    [GameId, Money],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  ),
  "proposeTrade": Func(
    [GameId, PlayerId, Vec(SpaceId), Money, Vec(SpaceId), Money],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  ),
  "reconnect": Func([], [Opt(GameSessionView)], ["query"]),
  "resolveAuction": Func(
    [GameId],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  ),
  "rollAndMove": Func(
    [GameId],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  ),
  "setReady": Func(
    [LobbyCode, Bool],
    [Variant({ "ok": LobbyView, "err": LobbyError })],
    []
  ),
  "startGame": Func(
    [LobbyCode],
    [Variant({ "ok": GameSessionView, "err": LobbyError })],
    []
  ),
  "unmortgageProperty": Func(
    [GameId, SpaceId],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  ),
  "upgradeProperty": Func(
    [GameId, SpaceId],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  ),
  "useGetOutOfJailCard": Func(
    [GameId],
    [Variant({ "ok": GameSessionView, "err": GameError })],
    []
  )
});
const idlFactory = ({ IDL }) => {
  const GameId2 = IDL.Text;
  const PlayerId2 = IDL.Principal;
  const GameStatus2 = IDL.Variant({
    "active": IDL.Null,
    "finished": IDL.Record({ "winnerId": PlayerId2 })
  });
  const Timestamp2 = IDL.Int;
  const Money2 = IDL.Int;
  const SpaceId2 = IDL.Nat;
  const AvatarId2 = IDL.Nat;
  const JailStatus2 = IDL.Variant({
    "inJail": IDL.Record({
      "hasGetOutCard": IDL.Bool,
      "turnsRemaining": IDL.Nat
    }),
    "notInJail": IDL.Null
  });
  const BoardPosition2 = IDL.Nat;
  const PlayerStateView2 = IDL.Record({
    "id": PlayerId2,
    "isBankrupt": IDL.Bool,
    "username": IDL.Text,
    "balance": Money2,
    "lastSeenAt": Timestamp2,
    "getOutOfJailCards": IDL.Nat,
    "ownedSpaces": IDL.Vec(SpaceId2),
    "avatarId": AvatarId2,
    "jailStatus": JailStatus2,
    "position": BoardPosition2
  });
  const AuctionBid2 = IDL.Record({
    "placedAt": Timestamp2,
    "bidderId": PlayerId2,
    "amount": Money2
  });
  const AuctionStateView2 = IDL.Record({
    "startedAt": Timestamp2,
    "bids": IDL.Vec(AuctionBid2),
    "isOpen": IDL.Bool,
    "spaceId": SpaceId2
  });
  const TurnPhaseView2 = IDL.Variant({
    "endTurn": IDL.Null,
    "move": IDL.Null,
    "roll": IDL.Null,
    "landAndAct": IDL.Null,
    "auction": AuctionStateView2
  });
  const UpgradeLevel2 = IDL.Nat;
  const ColorGroup2 = IDL.Variant({
    "red": IDL.Null,
    "utility": IDL.Null,
    "orange": IDL.Null,
    "pink": IDL.Null,
    "darkBlue": IDL.Null,
    "green": IDL.Null,
    "railroad": IDL.Null,
    "brown": IDL.Null,
    "lightBlue": IDL.Null,
    "yellow": IDL.Null
  });
  const PropertyDeed2 = IDL.Record({
    "purchasePrice": Money2,
    "housePrice": Money2,
    "mortgageValue": Money2,
    "rentHouse1": Money2,
    "rentHouse2": Money2,
    "rentHouse3": Money2,
    "rentHouse4": Money2,
    "name": IDL.Text,
    "rentHotel": Money2,
    "spaceId": SpaceId2,
    "colorGroup": ColorGroup2,
    "rentBase": Money2
  });
  const OwnedPropertyView2 = IDL.Record({
    "upgradeLevel": UpgradeLevel2,
    "ownerId": PlayerId2,
    "deed": PropertyDeed2,
    "spaceId": SpaceId2,
    "isMortgaged": IDL.Bool
  });
  const DiceRoll2 = IDL.Record({ "die1": IDL.Nat, "die2": IDL.Nat });
  const LobbyCode2 = IDL.Text;
  const TradeStatus2 = IDL.Variant({
    "cancelled": IDL.Null,
    "pending": IDL.Null,
    "accepted": IDL.Null,
    "declined": IDL.Null
  });
  const TradeOfferView2 = IDL.Record({
    "id": IDL.Nat,
    "status": TradeStatus2,
    "proposerSpaces": IDL.Vec(SpaceId2),
    "createdAt": Timestamp2,
    "proposerMoney": Money2,
    "recipientMoney": Money2,
    "recipientId": PlayerId2,
    "recipientSpaces": IDL.Vec(SpaceId2),
    "proposerId": PlayerId2
  });
  const GameSessionView2 = IDL.Record({
    "id": GameId2,
    "status": GameStatus2,
    "startedAt": Timestamp2,
    "currentPlayerIndex": IDL.Nat,
    "updatedAt": Timestamp2,
    "players": IDL.Vec(PlayerStateView2),
    "turnPhase": TurnPhaseView2,
    "ownedProperties": IDL.Vec(OwnedPropertyView2),
    "lastDiceRoll": IDL.Opt(DiceRoll2),
    "lobbyCode": LobbyCode2,
    "pendingTrade": IDL.Opt(TradeOfferView2)
  });
  const GameError2 = IDL.Variant({
    "propertyNotOwned": IDL.Null,
    "insufficientFunds": IDL.Null,
    "alreadyMortgaged": IDL.Null,
    "invalidPhase": IDL.Null,
    "propertyAlreadyOwned": IDL.Null,
    "tradeNotFound": IDL.Null,
    "notTradeParticipant": IDL.Null,
    "invalidBid": IDL.Null,
    "alreadyBankrupt": IDL.Null,
    "playerNotFound": IDL.Null,
    "maxUpgradeReached": IDL.Null,
    "gameNotFound": IDL.Null,
    "notYourTurn": IDL.Null,
    "notMortgaged": IDL.Null,
    "notInJail": IDL.Null
  });
  const LobbyStatus2 = IDL.Variant({
    "starting": IDL.Null,
    "finished": IDL.Null,
    "waiting": IDL.Null,
    "inProgress": IDL.Null
  });
  const LobbyPlayer2 = IDL.Record({
    "id": PlayerId2,
    "username": IDL.Text,
    "joinedAt": Timestamp2,
    "isHost": IDL.Bool,
    "isReady": IDL.Bool,
    "avatarId": AvatarId2
  });
  const LobbyView2 = IDL.Record({
    "status": LobbyStatus2,
    "code": LobbyCode2,
    "createdAt": Timestamp2,
    "gameId": IDL.Opt(GameId2),
    "players": IDL.Vec(LobbyPlayer2),
    "hostId": PlayerId2,
    "maxPlayers": IDL.Nat
  });
  const LobbyError2 = IDL.Variant({
    "lobbyNotFound": IDL.Null,
    "lobbyAlreadyStarted": IDL.Null,
    "notHost": IDL.Null,
    "alreadyInLobby": IDL.Null,
    "tooFewPlayers": IDL.Null,
    "lobbyFull": IDL.Null,
    "notInLobby": IDL.Null
  });
  return IDL.Service({
    "acceptTrade": IDL.Func(
      [GameId2, IDL.Nat],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    ),
    "buyProperty": IDL.Func(
      [GameId2, SpaceId2],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    ),
    "createLobby": IDL.Func(
      [IDL.Text, AvatarId2, IDL.Nat],
      [IDL.Variant({ "ok": LobbyView2, "err": LobbyError2 })],
      []
    ),
    "declineTrade": IDL.Func(
      [GameId2, IDL.Nat],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    ),
    "endTurn": IDL.Func(
      [GameId2],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    ),
    "getGame": IDL.Func([GameId2], [IDL.Opt(GameSessionView2)], ["query"]),
    "getLobby": IDL.Func([LobbyCode2], [IDL.Opt(LobbyView2)], ["query"]),
    "heartbeat": IDL.Func([GameId2], [], []),
    "joinLobby": IDL.Func(
      [LobbyCode2, IDL.Text, AvatarId2],
      [IDL.Variant({ "ok": LobbyView2, "err": LobbyError2 })],
      []
    ),
    "leaveLobby": IDL.Func(
      [LobbyCode2],
      [IDL.Variant({ "ok": IDL.Null, "err": LobbyError2 })],
      []
    ),
    "mortgageProperty": IDL.Func(
      [GameId2, SpaceId2],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    ),
    "passOnProperty": IDL.Func(
      [GameId2, SpaceId2],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    ),
    "payJailFine": IDL.Func(
      [GameId2],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    ),
    "placeBid": IDL.Func(
      [GameId2, Money2],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    ),
    "proposeTrade": IDL.Func(
      [GameId2, PlayerId2, IDL.Vec(SpaceId2), Money2, IDL.Vec(SpaceId2), Money2],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    ),
    "reconnect": IDL.Func([], [IDL.Opt(GameSessionView2)], ["query"]),
    "resolveAuction": IDL.Func(
      [GameId2],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    ),
    "rollAndMove": IDL.Func(
      [GameId2],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    ),
    "setReady": IDL.Func(
      [LobbyCode2, IDL.Bool],
      [IDL.Variant({ "ok": LobbyView2, "err": LobbyError2 })],
      []
    ),
    "startGame": IDL.Func(
      [LobbyCode2],
      [IDL.Variant({ "ok": GameSessionView2, "err": LobbyError2 })],
      []
    ),
    "unmortgageProperty": IDL.Func(
      [GameId2, SpaceId2],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    ),
    "upgradeProperty": IDL.Func(
      [GameId2, SpaceId2],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    ),
    "useGetOutOfJailCard": IDL.Func(
      [GameId2],
      [IDL.Variant({ "ok": GameSessionView2, "err": GameError2 })],
      []
    )
  });
};
const PLAYER_COLORS = [
  {
    bg: "bg-primary",
    border: "border-primary",
    text: "text-primary",
    token: "#d946ef"
  },
  {
    bg: "bg-accent",
    border: "border-accent",
    text: "text-accent",
    token: "#0d9488"
  },
  {
    bg: "bg-chart-1",
    border: "border-chart-1",
    text: "text-chart-1",
    token: "#ef4444"
  },
  {
    bg: "bg-chart-2",
    border: "border-chart-2",
    text: "text-chart-2",
    token: "#f97316"
  },
  {
    bg: "bg-chart-3",
    border: "border-chart-3",
    text: "text-chart-3",
    token: "#eab308"
  },
  {
    bg: "bg-chart-4",
    border: "border-chart-4",
    text: "text-chart-4",
    token: "#22c55e"
  },
  {
    bg: "bg-chart-5",
    border: "border-chart-5",
    text: "text-chart-5",
    token: "#3b82f6"
  },
  {
    bg: "bg-secondary",
    border: "border-secondary",
    text: "text-secondary",
    token: "#8b5cf6"
  }
];
const AVATAR_EMOJIS = ["🚗", "🎩", "👢", "🦖", "🐕", "🚂", "🏖️", "🎃"];
function formatMoney(amount) {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  return `$${num.toLocaleString()}`;
}
function getAvatarEmoji(avatarId) {
  const idx = Number(avatarId) % AVATAR_EMOJIS.length;
  return AVATAR_EMOJIS[idx];
}
function getPlayerColor(index) {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}
const sizeMap = {
  xs: { outer: "w-7 h-7", emoji: "text-base", ring: "ring-1" },
  sm: { outer: "w-9 h-9", emoji: "text-xl", ring: "ring-2" },
  md: { outer: "w-12 h-12", emoji: "text-2xl", ring: "ring-2" },
  lg: { outer: "w-16 h-16", emoji: "text-4xl", ring: "ring-[3px]" }
};
function PlayerAvatar({
  avatarId,
  username,
  playerIndex,
  size = "md",
  showName = false,
  isActive = false,
  isBankrupt = false,
  className
}) {
  const emoji = getAvatarEmoji(
    typeof avatarId === "bigint" ? avatarId : BigInt(avatarId)
  );
  const color = getPlayerColor(playerIndex);
  const dims = sizeMap[size];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-col items-center gap-1", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "relative flex items-center justify-center rounded-full bg-card border-2 transition-smooth",
          dims.outer,
          isActive && `${dims.ring} ring-primary ring-offset-2 animate-pulse-gentle`,
          isBankrupt && "opacity-40 grayscale",
          color.border
        ),
        "aria-label": username ? `${username}'s avatar` : "Player avatar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn("select-none leading-none", dims.emoji),
              role: "img",
              "aria-hidden": true,
              children: emoji
            }
          ),
          isBankrupt && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center rounded-full bg-foreground/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground", children: "💀" }) }),
          isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-card" })
        ]
      }
    ),
    showName && username && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "text-xs font-display font-semibold truncate max-w-[5rem]",
          isBankrupt ? "text-muted-foreground line-through" : "text-foreground"
        ),
        children: username
      }
    )
  ] });
}
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
const identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = React$1.useSyncExternalStore(
    api.subscribe,
    React$1.useCallback(() => selector(api.getState()), [api, selector]),
    React$1.useCallback(() => selector(api.getInitialState()), [api, selector])
  );
  React$1.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
const defaultUIState = {
  isDiceAnimating: false,
  isTokenMoving: false,
  currentCard: null,
  isAuctionModalOpen: false,
  isTradeModalOpen: false,
  isPropertyModalOpen: false,
  selectedSpaceId: null,
  errorMessage: null
};
const useGameStore = create((set) => ({
  gameSession: null,
  lobbyState: null,
  myPlayerId: null,
  uiState: defaultUIState,
  setGameSession: (session) => set({ gameSession: session, ...session ? { lobbyState: null } : {} }),
  setLobbyState: (lobby) => set({ lobbyState: lobby }),
  setMyPlayerId: (id) => set({ myPlayerId: id }),
  setDiceAnimating: (animating) => set((s) => ({ uiState: { ...s.uiState, isDiceAnimating: animating } })),
  setTokenMoving: (moving) => set((s) => ({ uiState: { ...s.uiState, isTokenMoving: moving } })),
  showCard: (card) => set((s) => ({ uiState: { ...s.uiState, currentCard: card } })),
  dismissCard: () => set((s) => ({ uiState: { ...s.uiState, currentCard: null } })),
  openAuctionModal: () => set((s) => ({ uiState: { ...s.uiState, isAuctionModalOpen: true } })),
  closeAuctionModal: () => set((s) => ({ uiState: { ...s.uiState, isAuctionModalOpen: false } })),
  openTradeModal: () => set((s) => ({ uiState: { ...s.uiState, isTradeModalOpen: true } })),
  closeTradeModal: () => set((s) => ({ uiState: { ...s.uiState, isTradeModalOpen: false } })),
  openPropertyModal: (spaceId) => set((s) => ({
    uiState: {
      ...s.uiState,
      isPropertyModalOpen: true,
      selectedSpaceId: spaceId
    }
  })),
  closePropertyModal: () => set((s) => ({
    uiState: {
      ...s.uiState,
      isPropertyModalOpen: false,
      selectedSpaceId: null
    }
  })),
  setErrorMessage: (msg) => set((s) => ({ uiState: { ...s.uiState, errorMessage: msg } })),
  resetGame: () => set({ gameSession: null, lobbyState: null, uiState: defaultUIState })
}));
export {
  AVATAR_EMOJIS as A,
  Button as B,
  PlayerAvatar as P,
  Slot as S,
  PLAYER_COLORS as a,
  cva as b,
  createSlot as c,
  formatMoney as f,
  getAvatarEmoji as g,
  idlFactory as i,
  useGameStore as u
};
