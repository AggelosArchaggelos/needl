import { cn } from "@/lib/utils";

export function PromotedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-brass-bright",
        className,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-brass-bright" />
      Featured
    </span>
  );
}
