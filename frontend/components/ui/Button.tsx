import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const variants = {
  primary: "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20 hover:bg-sky-400",
  secondary:
    "border border-slate-300 bg-white text-slate-900 shadow-sm hover:border-sky-300 hover:bg-sky-50",
  ghost:
    "border border-white/15 bg-white/8 text-slate-100 backdrop-blur hover:border-cyan-300/40 hover:bg-white/12",
};

export function Button({
  children,
  href,
  variant = "secondary",
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const className = `inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold no-underline transition ${variants[variant]} ${
    disabled ? "cursor-not-allowed opacity-60" : ""
  }`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={className} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
