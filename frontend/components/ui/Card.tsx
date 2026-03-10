type CardProps = {
  title: string;
  children: React.ReactNode;
  eyebrow?: string;
  footer?: React.ReactNode;
  tone?: "light" | "dark";
};

export function Card({ title, children, eyebrow, footer, tone = "light" }: CardProps) {
  const toneClass =
    tone === "dark"
      ? "border-white/10 bg-white/5 text-slate-100 backdrop-blur"
      : "border-slate-200 bg-white text-slate-950 shadow-sm";

  return (
    <article className={`rounded-3xl border p-6 ${toneClass}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-sky-500">{eyebrow}</p>
      ) : null}
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </article>
  );
}
