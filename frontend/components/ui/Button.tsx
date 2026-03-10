import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
};

const variants = {
  primary: "bg-sky-500 text-slate-950 hover:bg-sky-400",
  secondary: "border border-slate-300 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50",
};

export function Button({ children, href, variant = "secondary" }: ButtonProps) {
  const className = `inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${variants[variant]}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <button className={className}>{children}</button>;
}
