type AgendaItem = {
  title: string;
  description: string;
};

export function ProductDemoAgenda({
  eyebrow,
  heading,
  items
}: {
  eyebrow: string;
  heading: string;
  items: AgendaItem[];
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">{eyebrow}</p>
        <h2 className="text-xl font-bold leading-tight text-ink">{heading}</h2>
      </div>

      <ol className="divide-y divide-border border-y border-border">
        {items.map((item, index) => (
          <li key={item.title} className="grid grid-cols-[2rem_1fr] gap-3 py-4">
            <span className="font-mono text-xs font-bold text-orange">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-foreground-muted">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
