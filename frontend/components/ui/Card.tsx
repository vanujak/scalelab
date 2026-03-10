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
      ? "border-white/10 bg-slate-950/40 text-slate-100 shadow-2xl shadow-black/20 backdrop-blur-sm"
      : "border-slate-200 bg-white text-slate-950 shadow-sm";
  const eyebrowClass = tone === "dark" ? "text-cyan-300" : "text-sky-500";

  return (
    <article className={`rounded-3xl border p-6 ${toneClass}`}>
      {eyebrow ? (
        <p className={`mb-3 text-xs font-medium uppercase tracking-[0.25em] ${eyebrowClass}`}>
          {eyebrow}
        </p>
      ) : null}
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </article>
  );
}
