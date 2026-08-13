import { FEATURED_PRODUCT } from '@/lib/products';
import type { ZaikoVisualLabels } from '@/lib/zaiko-visual-labels';

export type { ZaikoVisualLabels } from '@/lib/zaiko-visual-labels';

interface Props {
  type: 'hero' | 'inventory' | 'purchases' | 'activity' | 'costs' | 'counts' | 'workflow';
  className?: string;
  labels: ZaikoVisualLabels;
}

const inventoryRows = (l: ZaikoVisualLabels) => [
  [l.tomatoes, '24 lb', l.walkIn, l.available],
  [l.chickenBreast, '18 lb', l.walkIn, l.available],
  [l.oliveOil, '6 gal', l.dryStorage, l.available]
];

type PreviewTone = 'light' | 'dark';

function Frame({ l, children, className = '', tone = 'light' }: { l: ZaikoVisualLabels; children: React.ReactNode; className?: string; tone?: PreviewTone }) {
  const dark = tone === 'dark';
  return (
    <figure className={`min-w-0 rounded-3xl border p-4 shadow-card sm:p-6 ${dark ? 'border-white/15 bg-ink text-white' : 'border-border bg-surface text-ink'} ${className}`}>
      <div className={`mb-5 flex items-center justify-between gap-3 border-b pb-4 ${dark ? 'border-white/15' : 'border-border'}`}>
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2.5 w-2.5 flex-none rounded-full bg-orange" />
          <span className={`truncate text-xs font-bold uppercase tracking-wider ${dark ? 'text-white' : 'text-ink'}`}>{FEATURED_PRODUCT.name}</span>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${dark ? 'bg-white/10 text-white' : 'bg-orange-subtle text-orange-text'}`}>
          {l.preview}
        </span>
      </div>
      {children}
      <figcaption className={`mt-4 text-[11px] leading-relaxed ${dark ? 'text-white/70' : 'text-foreground-muted'}`}>{l.sampleData}</figcaption>
    </figure>
  );
}

function Heading({ title, meta, tone = 'light' }: { title: string; meta: string; tone?: PreviewTone }) {
  const dark = tone === 'dark';
  return <div className="mb-3 flex items-end justify-between gap-3"><h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-ink'}`}>{title}</h3><span className={`text-[10px] font-semibold uppercase tracking-wide ${dark ? 'text-white/70' : 'text-foreground-muted'}`}>{meta}</span></div>;
}

function Inventory({ l }: { l: ZaikoVisualLabels }) {
  return <div><Heading title={l.inventory} meta={l.onHand} />
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="grid grid-cols-[minmax(0,1.5fr)_auto] gap-3 bg-surface-muted px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-foreground-muted sm:grid-cols-[1.5fr_.7fr_1fr_.7fr]">
        <span>{l.item}</span><span>{l.quantity}</span><span className="hidden sm:block">{l.location}</span><span className="hidden sm:block">{l.status}</span>
      </div>
      {inventoryRows(l).map(([item, quantity, location, status]) => <div key={item} className="grid grid-cols-[minmax(0,1.5fr)_auto] gap-3 border-t border-border px-3 py-3 text-xs sm:grid-cols-[1.5fr_.7fr_1fr_.7fr]">
        <span className="truncate font-semibold text-ink">{item}</span><span className="tabular-nums text-ink">{quantity}</span><span className="hidden text-foreground-muted sm:block">{location}</span><span className="hidden font-medium text-orange-text sm:block">{status}</span>
      </div>)}
    </div>
  </div>;
}

function Purchases({ l }: { l: ZaikoVisualLabels }) {
  const rows = [['PO-1048', l.produceVendor, l.receivedStatus, '$286.40'], ['PO-1049', l.foodDistributor, l.orderedStatus, '$412.75']];
  return <div><Heading title={l.purchases} meta={l.incoming} /><div className="space-y-2">
    {rows.map(([id, vendor, status, total]) => <div key={id} className="grid grid-cols-[1fr_auto] gap-2 rounded-xl border border-border bg-background p-3 text-xs sm:grid-cols-[.65fr_1.4fr_.8fr_.65fr]">
      <span className="font-bold text-ink">{id}</span><span className="hidden text-foreground-muted sm:block">{vendor}</span><span className="font-semibold text-orange-text">{status}</span><span className="hidden text-right tabular-nums text-ink sm:block">{total}</span>
      <span className="col-span-2 text-foreground-muted sm:hidden">{vendor} · {total}</span>
    </div>)}
  </div></div>;
}

function Activity({ l }: { l: ZaikoVisualLabels }) {
  const rows = [[l.today, l.receiving, l.tomatoes, '+24 lb', 'PO-1048'], [l.today, l.adjustment, l.avocado, '-3 ea', l.inventory], [l.yesterday, l.receiving, l.chickenBreast, '+18 lb', 'PO-1047']];
  return <div><Heading title={l.activity} meta={l.history} /><ol className="space-y-2">
    {rows.map(([time, action, item, change, source], index) => <li key={`${item}-${index}`} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-background p-3 text-xs">
      <span className="h-2 w-2 rounded-full bg-orange" /><span><strong className="block text-ink">{action} · {item}</strong><span className="text-foreground-muted">{time} · {source}</span></span><strong className="tabular-nums text-ink">{change}</strong>
    </li>)}
  </ol></div>;
}

function Costs({ l }: { l: ZaikoVisualLabels }) {
  const rows = [[l.oliveOil, '$31.20', '$29.80', '↑ 4.7%'], [l.flour, '$18.40', '$18.40', '—'], [l.chickenBreast, '$3.42/lb', '$3.58/lb', '↓ 4.5%']];
  return <div><Heading title={l.costs} meta={l.trend} /><div className="overflow-hidden rounded-xl border border-border bg-background">
    <div className="grid grid-cols-[1.3fr_.8fr_.6fr] gap-2 bg-surface-muted px-3 py-2 text-[10px] font-bold uppercase text-foreground-muted sm:grid-cols-[1.4fr_1fr_1fr_.7fr]"><span>{l.item}</span><span>{l.currentCost}</span><span className="hidden sm:block">{l.previousCost}</span><span>{l.change}</span></div>
    {rows.map(([item, current, previous, change]) => <div key={item} className="grid grid-cols-[1.3fr_.8fr_.6fr] gap-2 border-t border-border px-3 py-3 text-xs sm:grid-cols-[1.4fr_1fr_1fr_.7fr]"><strong className="truncate text-ink">{item}</strong><span>{current}</span><span className="hidden text-foreground-muted sm:block">{previous}</span><span className="font-semibold text-orange-text">{change}</span></div>)}
  </div></div>;
}

function Counts({ l }: { l: ZaikoVisualLabels }) {
  const rows = [
    [l.tomatoes, '20 lb', '18 lb', '-2 lb'],
    [l.chickenBreast, '12 lb', '0 lb', '-12 lb'],
    [l.oliveOil, '6 gal', l.uncounted, '—']
  ];
  return <div><Heading title={l.countReview} meta={l.variance} /><div className="overflow-hidden rounded-xl border border-border bg-background">
    <div className="grid grid-cols-[1.3fr_.8fr_.8fr] gap-2 bg-surface-muted px-3 py-2 text-[10px] font-bold uppercase text-foreground-muted sm:grid-cols-[1.4fr_.8fr_.8fr_.7fr]"><span>{l.item}</span><span>{l.expected}</span><span>{l.counted}</span><span className="hidden sm:block">{l.variance}</span></div>
    {rows.map(([item, expected, counted, variance]) => <div key={item} className="grid grid-cols-[1.3fr_.8fr_.8fr] gap-2 border-t border-border px-3 py-3 text-xs sm:grid-cols-[1.4fr_.8fr_.8fr_.7fr]"><strong className="truncate text-ink">{item}</strong><span>{expected}</span><span className={counted === l.uncounted ? 'font-semibold text-foreground-muted' : 'font-semibold text-ink'}>{counted}</span><span className="hidden font-semibold text-orange-text sm:block">{variance}</span></div>)}
  </div><div className="mt-3 rounded-xl border border-border bg-background p-3"><strong className="block text-xs text-ink">{l.tomatoes}</strong><div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">{[
    [l.target, '24 lb'], [l.counted, '18 lb'], [l.neededToTarget, '6 lb'], [l.suggestedPurchase, '1 × 10 lb']
  ].map(([label, value], index) => <div key={label} className={index === 3 ? 'rounded-lg bg-orange-subtle/40 p-2' : 'p-2'}><span className={`block text-[10px] font-bold uppercase ${index === 3 ? 'text-orange-text' : 'text-foreground-muted'}`}>{label}</span><strong className="mt-1 block text-sm text-ink">{value}</strong></div>)}</div></div></div>;
}

export function ZaikoProductVisual({ type, className = '', labels: l }: Props) {
  if (type === 'workflow') return <Frame l={l} tone="dark" className={className}><Heading title={`${FEATURED_PRODUCT.name} ${l.workflow}`} meta={l.connected} tone="dark" /><div className="grid gap-2 sm:grid-cols-4">{[
    [l.purchases, 'PO-1048'], [l.inventory, `${l.tomatoes} · 24 lb`], [l.activity, '+24 lb'], [l.costs, '$2.10/lb']
  ].map(([label, value], i) => <div key={label} className="relative rounded-xl border border-white/15 bg-white/5 p-3"><span className="block text-[10px] font-bold uppercase tracking-wide text-orange">{label}</span><strong className="mt-2 block text-xs text-white">{value}</strong>{i < 3 ? <span className="absolute -bottom-2 left-1/2 text-orange sm:-right-3 sm:bottom-auto sm:left-auto sm:top-1/2" aria-hidden="true">→</span> : null}</div>)}</div></Frame>;
  if (type === 'hero') return <Frame l={l} className={className}><div className="grid gap-4 sm:grid-cols-[1.35fr_.65fr]"><Inventory l={l} /><div className="grid gap-3"><div className="rounded-xl border border-orange/30 bg-orange-subtle/40 p-3"><span className="text-[10px] font-bold uppercase text-orange-text">{l.incoming}</span><strong className="mt-1 block text-sm text-ink">PO-1048</strong><span className="text-xs text-foreground-muted">{l.produceVendor}</span></div><div className="rounded-xl border border-border bg-background p-3"><span className="text-[10px] font-bold uppercase text-foreground-muted">{l.activity}</span><strong className="mt-1 block text-sm text-ink">{l.tomatoes} +24 lb</strong><span className="text-xs text-foreground-muted">{l.today}</span></div><div className="rounded-xl border border-border bg-background p-3"><span className="text-[10px] font-bold uppercase text-foreground-muted">{l.costs}</span><strong className="mt-1 block text-sm text-ink">$2.10 / lb</strong></div></div></div></Frame>;
  return <Frame l={l} className={className}>{type === 'inventory' ? <Inventory l={l} /> : type === 'purchases' ? <Purchases l={l} /> : type === 'activity' ? <Activity l={l} /> : type === 'counts' ? <Counts l={l} /> : <Costs l={l} />}</Frame>;
}
