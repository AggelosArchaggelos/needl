import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-red-bright">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-medium leading-[1.1] text-paper sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-xl text-base leading-relaxed text-paper-dim",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
