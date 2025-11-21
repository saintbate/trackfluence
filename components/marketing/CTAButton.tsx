import type { ReactNode } from "react";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 focus-visible:ring-offset-black/5 whitespace-nowrap";

  const primary =
    "bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 text-black shadow-[0_0_30px_rgba(56,189,248,0.45)] hover:from-sky-400 hover:via-cyan-300 hover:to-blue-400";

  const secondary =
    "bg-white/5 text-slate-100 border border-white/10 hover:bg-white/10";

  const styles = `${base} ${
    variant === "primary" ? primary : secondary
  } ${className}`;

  return (
    <a href={href} className={styles}>
      {children}
    </a>
  );
}


