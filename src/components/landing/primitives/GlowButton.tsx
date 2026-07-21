import type { ButtonHTMLAttributes, ReactNode } from "react";

export function GlowButton({
  children,
  variant = "primary",
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  children: ReactNode;
}) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const styles =
    variant === "primary"
      ? "glow-edge bg-primary text-primary-foreground hover:brightness-110 hover:-translate-y-0.5"
      : "border border-border bg-card text-foreground hover:bg-muted";
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}
