import { ReactNode } from "react";

interface BadgeProps {
  className?: string;
  children: ReactNode;
  variant?: "default" | "outline";
}

export function Badge({ className = "", children, variant = "default" }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full text-xs font-medium";
  const variantStyles =
    variant === "outline"
      ? "border bg-transparent"
      : "bg-zinc-800 text-zinc-100";

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
}

