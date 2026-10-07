import { Link } from "@tanstack/react-router";
import logo from "../../../.lovable/logo/download.png";
import { cn } from "@/lib/utils";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const h = size === "sm" ? "h-7" : size === "lg" ? "h-12" : "h-9";
  return (
    <Link to="/" className={cn("inline-flex items-center", className)} aria-label="Apoinmate home">
      <img
        src={logo}
        alt="Apoinmate logo"
        className={cn(h, "w-auto logo-shadow transition-transform hover:scale-[1.03]")}
      />
    </Link>
  );
}
