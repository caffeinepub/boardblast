import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { CardDisplay } from "../../types/game";

interface CardDrawModalProps {
  card: CardDisplay;
  onClose: () => void;
}

const CARD_STYLES: Record<
  CardDisplay["type"],
  { bg: string; stripe: string; label: string; emoji: string }
> = {
  chance: {
    bg: "bg-[#FFF8E1]",
    stripe: "bg-[#ECC94B]",
    label: "Chance",
    emoji: "❓",
  },
  community_chest: {
    bg: "bg-[#E8F5E9]",
    stripe: "bg-[#38A169]",
    label: "Community Chest",
    emoji: "🏛️",
  },
};

export function CardDrawModal({ card, onClose }: CardDrawModalProps) {
  const [flipped, setFlipped] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string; angle: number }[]
  >([]);

  const style = CARD_STYLES[card.type];

  useEffect(() => {
    const t = setTimeout(() => {
      setFlipped(true);
      const colors = ["#d946ef", "#0d9488", "#ef4444", "#f97316", "#eab308"];
      setParticles(
        Array.from({ length: 20 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 40 + 10,
          color: colors[i % colors.length],
          angle: Math.random() * 360,
        })),
      );
    }, 150);
    return () => clearTimeout(t);
  }, []);

  const borderColor =
    card.type === "chance" ? "border-[#ECC94B]" : "border-[#38A169]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="card-draw-modal"
    >
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="presentation"
      />

      {/* Particle effects */}
      {flipped &&
        particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-3 h-3 rounded-sm pointer-events-none animate-bounce"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.color,
              transform: `rotate(${p.angle}deg)`,
            }}
          />
        ))}

      {/* Card with flip animation */}
      <dialog
        open
        className={cn(
          "relative w-64 bg-transparent border-0 p-0 m-0 transition-all duration-500",
          flipped ? "opacity-100" : "opacity-0",
        )}
        style={{
          transform: flipped ? "rotateY(0deg)" : "rotateY(180deg)",
          transition: "transform 0.5s ease-in-out, opacity 0.3s ease",
        }}
        aria-label={`${style.label} Card`}
      >
        <div
          className={cn(
            "rounded-2xl shadow-2xl overflow-hidden border-4",
            style.bg,
            borderColor,
          )}
        >
          {/* Card header stripe */}
          <div
            className={cn(
              "py-3 px-4 flex items-center justify-between",
              style.stripe,
            )}
          >
            <span className="font-display font-extrabold text-card text-lg">
              {style.label}
            </span>
            <span className="text-2xl">{style.emoji}</span>
          </div>

          {/* Card bottom stripe */}
          <div className={cn("py-2", style.stripe)} />

          {/* Card body */}
          <div className="px-5 py-6 text-center space-y-4">
            <div className="text-5xl mb-2 animate-bounce">{style.emoji}</div>
            <h3 className="font-display font-extrabold text-lg text-foreground leading-tight">
              {card.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {card.description}
            </p>
            {card.effect && (
              <div className="bg-card border border-border rounded-xl px-4 py-2 text-sm font-bold text-foreground">
                {card.effect}
              </div>
            )}
          </div>

          {/* OK button */}
          <div className="px-5 pb-5">
            <Button
              onClick={onClose}
              className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90"
              data-ocid="card-draw-ok-btn"
            >
              OK!
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
