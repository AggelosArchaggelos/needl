import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  reviewCount,
  size = "md",
  className,
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const starSize = size === "sm" ? 12 : 14;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5 text-brass">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.min(Math.max(rating - i, 0), 1);
          return (
            <span key={i} className="relative inline-block" style={{ width: starSize, height: starSize }}>
              <Star size={starSize} strokeWidth={1.5} className="absolute inset-0 text-brass/30" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star size={starSize} strokeWidth={1.5} className="text-brass fill-brass" />
              </span>
            </span>
          );
        })}
      </div>
      <span className="font-mono text-xs text-paper-dim">
        {rating.toFixed(1)}
        {typeof reviewCount === "number" && (
          <span className="text-paper-faint"> ({reviewCount})</span>
        )}
      </span>
    </div>
  );
}
