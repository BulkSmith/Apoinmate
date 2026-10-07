import { cn } from "@/lib/utils";

const PALETTES = [
  "from-primary/25 to-primary/5",
  "from-success/25 to-success/5",
  "from-navy/25 to-navy/5",
  "from-accent to-accent/20",
];

export function DoctorAvatar({
  name,
  className,
  seed = 0,
}: {
  name: string;
  className?: string;
  seed?: number;
}) {
  const initials = name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-semibold text-navy ring-1 ring-border",
        PALETTES[seed % PALETTES.length],
        className,
      )}
    >
      {initials}
    </div>
  );
}
