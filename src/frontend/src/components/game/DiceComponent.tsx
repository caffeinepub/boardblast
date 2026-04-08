import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface DiceFaceProps {
  value: number;
  className?: string;
}

const DOT_POSITIONS: Record<number, [string, string][]> = {
  1: [["50%", "50%"]],
  2: [
    ["25%", "25%"],
    ["75%", "75%"],
  ],
  3: [
    ["25%", "25%"],
    ["50%", "50%"],
    ["75%", "75%"],
  ],
  4: [
    ["25%", "25%"],
    ["75%", "25%"],
    ["25%", "75%"],
    ["75%", "75%"],
  ],
  5: [
    ["25%", "25%"],
    ["75%", "25%"],
    ["50%", "50%"],
    ["25%", "75%"],
    ["75%", "75%"],
  ],
  6: [
    ["25%", "20%"],
    ["75%", "20%"],
    ["25%", "50%"],
    ["75%", "50%"],
    ["25%", "80%"],
    ["75%", "80%"],
  ],
};

function DiceFace({ value, className }: DiceFaceProps) {
  const dots = DOT_POSITIONS[value] ?? DOT_POSITIONS[1];
  return (
    <div
      className={cn(
        "relative rounded-xl bg-card border-2 border-border",
        "shadow-[inset_0_1px_3px_rgba(0,0,0,0.12),0_3px_8px_rgba(0,0,0,0.18)]",
        className,
      )}
      aria-label={`Die showing ${value}`}
    >
      {dots.map(([left, top]) => (
        <div
          key={`${left}-${top}`}
          className="absolute w-[18%] h-[18%] rounded-full bg-foreground"
          style={{
            left,
            top,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}

interface DiceComponentProps {
  die1: number;
  die2: number;
  isRolling: boolean;
  onRoll?: () => void;
  isMyTurn?: boolean;
  disabled?: boolean;
}

export function DiceComponent({
  die1,
  die2,
  isRolling,
  onRoll,
  isMyTurn = false,
  disabled = false,
}: DiceComponentProps) {
  const canRoll = isMyTurn && !disabled && !isRolling && !!onRoll;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Dice display */}
      <div className="flex gap-2 items-center justify-center">
        {[die1, die2].map((val, idx) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: only two dice, stable index
            key={`die-${idx}`}
            animate={
              isRolling
                ? {
                    rotate: [0, 180, 360, 540, 720],
                    scale: [1, 1.1, 0.95, 1.1, 1],
                  }
                : { rotate: 0, scale: 1 }
            }
            transition={
              isRolling
                ? {
                    duration: 0.65,
                    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
                  }
                : { duration: 0.3, type: "spring", stiffness: 300 }
            }
            style={{ perspective: 300 }}
          >
            <DiceFace value={val} className="w-10 h-10" />
          </motion.div>
        ))}
      </div>

      {/* Total */}
      <AnimatePresence mode="wait">
        {!isRolling && (die1 > 0 || die2 > 0) && (
          <motion.div
            key={`${die1}-${die2}`}
            initial={{ scale: 0.5, opacity: 0, y: 4 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="text-sm font-display font-black text-foreground"
          >
            = {die1 + die2}
            {die1 === die2 && (
              <span className="ml-1 text-primary">doubles!</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roll button */}
      <motion.button
        type="button"
        disabled={!canRoll}
        onClick={onRoll}
        data-ocid="roll-dice-btn"
        whileHover={canRoll ? { scale: 1.06, y: -2 } : {}}
        whileTap={canRoll ? { scale: 0.94 } : {}}
        className={cn(
          "relative px-6 py-3 rounded-2xl font-display font-black text-base tracking-wide",
          "transition-all duration-200 overflow-hidden",
          canRoll
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40 cursor-pointer"
            : "bg-muted text-muted-foreground cursor-not-allowed",
        )}
      >
        {isRolling ? (
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="text-lg"
            >
              🎲
            </motion.span>
            Rolling…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span className="text-lg">🎲</span>
            ROLL
          </span>
        )}
        {/* Shine effect */}
        {canRoll && (
          <div className="absolute inset-0 bg-gradient-to-b from-card/20 to-transparent pointer-events-none rounded-2xl" />
        )}
      </motion.button>
    </div>
  );
}
