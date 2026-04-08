import { cn } from "@/lib/utils";
import type { Money } from "../../types/game";

interface MoneyDisplayProps {
  amount: Money | number;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "gain" | "loss" | "muted";
  showSign?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "text-sm font-semibold",
  md: "text-base font-bold",
  lg: "text-xl font-bold font-display",
  xl: "text-3xl font-extrabold font-display",
};

const variantMap = {
  default: "text-foreground",
  gain: "text-accent",
  loss: "text-destructive",
  muted: "text-muted-foreground",
};

export function MoneyDisplay({
  amount,
  size = "md",
  variant = "default",
  showSign = false,
  animated = false,
  className,
}: MoneyDisplayProps) {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const sign = showSign ? (isNegative ? "-" : "+") : isNegative ? "-" : "";
  const formatted = `${sign}$${absNum.toLocaleString()}`;

  return (
    <span
      className={cn(
        "tabular-nums tracking-tight transition-smooth",
        sizeMap[size],
        variantMap[variant],
        animated && "animate-pulse-gentle",
        className,
      )}
      data-ocid="money-display"
    >
      {formatted}
    </span>
  );
}

interface MoneyTransactionProps {
  label: string;
  amount: Money | number;
  type: "income" | "expense" | "neutral";
  className?: string;
}

export function MoneyTransaction({
  label,
  amount,
  type,
  className,
}: MoneyTransactionProps) {
  const sign = type === "income" ? "+" : type === "expense" ? "-" : "";
  const num = typeof amount === "bigint" ? Number(amount) : Math.abs(amount);

  return (
    <div
      className={cn("flex items-center justify-between gap-4 py-1", className)}
    >
      <span className="text-sm text-muted-foreground truncate">{label}</span>
      <span
        className={cn(
          "text-sm font-bold tabular-nums flex-shrink-0",
          type === "income"
            ? "text-accent"
            : type === "expense"
              ? "text-destructive"
              : "text-foreground",
        )}
      >
        {sign}${num.toLocaleString()}
      </span>
    </div>
  );
}
