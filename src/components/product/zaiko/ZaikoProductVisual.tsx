import React from 'react';
import { FEATURED_PRODUCT } from '@/lib/products';

interface ZaikoProductVisualProps {
  type: 'hero' | 'inventory' | 'purchases' | 'activity' | 'costs' | 'workflow';
  className?: string;
  labels?: {
    inventory: string;
    purchases: string;
    activity: string;
    costs: string;
    onHand: string;
    incoming: string;
    history: string;
    trend: string;
  };
}

export function ZaikoProductVisual({ type, className = '', labels }: ZaikoProductVisualProps) {
  const defaultLabels = {
    inventory: 'Inventory',
    purchases: 'Purchases',
    activity: 'Activity',
    costs: 'Costs',
    onHand: 'On Hand',
    incoming: 'Incoming',
    history: 'History',
    trend: 'Trend'
  };

  const l = labels || defaultLabels;

  if (type === 'hero') {
    return (
      <div className={`rounded-3xl border border-border bg-surface p-6 shadow-card space-y-6 ${className}`} aria-hidden="true">
        {/* Workspace Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-orange/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-border-strong inline-block" />
              <span className="h-3 w-3 rounded-full bg-border inline-block" />
            </div>
            <div className="flex items-center px-2 py-0.5 rounded border border-border bg-surface-muted text-[10px] font-bold text-ink uppercase tracking-wider">
              {FEATURED_PRODUCT.name.toUpperCase()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-16 rounded-full bg-orange/30 inline-block" />
            <span className="h-6 w-20 rounded-md bg-orange-subtle border border-orange/20 inline-block" />
          </div>
        </div>

        {/* Workspace Hero Grid */}
        <div className="grid gap-4 sm:grid-cols-12">
          {/* Main Stock Summary Panel */}
          <div className="sm:col-span-8 rounded-2xl border border-border bg-background p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-ink/80 uppercase tracking-wide">{l.inventory}</div>
                <div className="h-2 w-48 rounded-full bg-foreground-muted/40" />
              </div>
              <span className="h-2 w-2 rounded-full bg-orange" />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-border bg-surface p-3 space-y-2">
                <div className="text-[9px] font-bold text-orange/80 uppercase">{l.onHand}</div>
                <div className="h-4 w-full rounded-md bg-surface-muted" />
              </div>
              <div className="rounded-xl border border-border bg-surface p-3 space-y-2">
                <div className="text-[9px] font-bold text-border-strong uppercase">{l.incoming}</div>
                <div className="h-4 w-full rounded-md bg-surface-muted" />
              </div>
              <div className="rounded-xl border border-border bg-surface p-3 space-y-2">
                <div className="text-[9px] font-bold text-orange/40 uppercase">{l.trend}</div>
                <div className="h-4 w-full rounded-md bg-surface-muted" />
              </div>
            </div>

            {/* List Rows */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between rounded-lg bg-surface p-3 border border-border/80">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-sm bg-orange" />
                  <div className="h-2.5 w-24 rounded-full bg-ink/70" />
                </div>
                <div className="h-2 w-12 rounded-full bg-foreground-muted/40" />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface p-3 border border-border/80">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-sm bg-border-strong" />
                  <div className="h-2.5 w-32 rounded-full bg-ink/70" />
                </div>
                <div className="h-2 w-16 rounded-full bg-foreground-muted/40" />
              </div>
            </div>
          </div>

          {/* Side Activity Panel */}
          <div className="sm:col-span-4 rounded-2xl border border-border bg-surface-muted p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold text-ink uppercase tracking-wide">{l.activity}</div>
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full rounded-full bg-orange/30" />
                <div className="h-2 w-4/5 rounded-full bg-border-strong" />
                <div className="h-2 w-3/5 rounded-full bg-border" />
              </div>
            </div>

            <div className="rounded-xl border border-orange/30 bg-orange-subtle/40 p-3 space-y-2">
              <div className="text-[10px] font-bold text-orange uppercase">{l.costs}</div>
              <div className="h-1.5 w-full rounded-full bg-orange/40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'inventory') {
    return (
      <div className={`rounded-3xl border border-border bg-surface p-6 shadow-card space-y-4 ${className}`} aria-hidden="true">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange" />
            <div className="text-[11px] font-bold text-ink uppercase tracking-wide">{l.inventory}</div>
          </div>
          <div className="text-[10px] font-medium text-foreground-muted/60 uppercase">{l.onHand}</div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-36 rounded-full bg-ink/80" />
              <div className="h-2 w-14 rounded-full bg-orange/50" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="h-1.5 rounded-full bg-orange" />
              <div className="h-1.5 rounded-full bg-border-strong" />
              <div className="h-1.5 rounded-full bg-border" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-surface-muted p-3.5 space-y-2">
              <div className="h-2 w-20 rounded-full bg-ink/70" />
              <div className="h-2 w-12 rounded-full bg-foreground-muted/40" />
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-3.5 space-y-2">
              <div className="h-2 w-24 rounded-full bg-ink/70" />
              <div className="h-2 w-16 rounded-full bg-foreground-muted/40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'purchases') {
    return (
      <div className={`rounded-3xl border border-border bg-surface p-6 shadow-card space-y-4 ${className}`} aria-hidden="true">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-ink" />
            <div className="text-[11px] font-bold text-ink uppercase tracking-wide">{l.purchases}</div>
          </div>
          <div className="text-[10px] font-medium text-orange uppercase tracking-wide">{l.incoming}</div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-background p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-24 rounded-full bg-ink/80" />
              <div className="h-2 w-12 rounded-full bg-orange" />
            </div>
            <div className="h-2 w-full rounded-full bg-surface-muted" />
          </div>

          <div className="rounded-xl border border-border bg-background p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-32 rounded-full bg-ink/80" />
              <div className="h-2 w-10 rounded-full bg-border-strong" />
            </div>
            <div className="h-2 w-3/4 rounded-full bg-surface-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'activity') {
    return (
      <div className={`rounded-3xl border border-border bg-surface p-6 shadow-card space-y-4 ${className}`} aria-hidden="true">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange" />
            <div className="text-[11px] font-bold text-ink uppercase tracking-wide">{l.activity}</div>
          </div>
          <div className="text-[10px] font-medium text-orange/60 uppercase">{l.history}</div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-orange" />
              <div className="space-y-1">
                <div className="h-2.5 w-28 rounded-full bg-ink/80" />
                <div className="h-2 w-40 rounded-full bg-foreground-muted/40" />
              </div>
            </div>
            <div className="h-2 w-10 rounded-full bg-border-strong" />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-border-strong" />
              <div className="space-y-1">
                <div className="h-2.5 w-32 rounded-full bg-ink/80" />
                <div className="h-2 w-36 rounded-full bg-foreground-muted/40" />
              </div>
            </div>
            <div className="h-2 w-12 rounded-full bg-orange/50" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'costs') {
    return (
      <div className={`rounded-3xl border border-border bg-surface p-6 shadow-card space-y-4 ${className}`} aria-hidden="true">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange" />
            <div className="text-[11px] font-bold text-ink uppercase tracking-wide">{l.costs}</div>
          </div>
          <div className="text-[10px] font-medium text-orange/60 uppercase tracking-wide">{l.trend}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-orange/30 bg-orange-subtle/30 p-4 space-y-2">
            <div className="h-2 w-16 rounded-full bg-orange" />
            <div className="h-3 w-full rounded-md bg-orange/20" />
          </div>
          <div className="rounded-2xl border border-border bg-surface-muted p-4 space-y-2">
            <div className="h-2 w-20 rounded-full bg-ink/70" />
            <div className="h-3 w-full rounded-md bg-border" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 space-y-2">
          <div className="h-2.5 w-32 rounded-full bg-ink/80" />
          <div className="h-2 w-full rounded-full bg-surface-muted" />
        </div>
      </div>
    );
  }

  // Workflow visual (Connected Story)
  return (
    <div className={`rounded-3xl border border-border bg-ink p-8 text-white shadow-card space-y-10 ${className}`} aria-hidden="true">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-orange" />
          <div className="text-[11px] font-bold text-white/70 uppercase tracking-widest">
            {FEATURED_PRODUCT.name.toUpperCase()} WORKFLOW
          </div>
        </div>
        <div className="text-[10px] font-bold text-orange uppercase tracking-wider">CONNECTED</div>
      </div>

      <div className="grid gap-6 sm:grid-cols-4 relative">
        {/* Connection Arrows (Conceptual) */}
        <div className="hidden sm:block absolute top-1/2 left-1/4 -translate-y-1/2 w-8 text-white/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
        </div>
        <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-y-1/2 w-8 text-white/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
        </div>
        <div className="hidden sm:block absolute top-1/2 left-3/4 -translate-y-1/2 w-8 text-white/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
          <span className="text-[10px] font-bold text-orange uppercase tracking-wider">{l.purchases}</span>
          <div className="h-2 w-full rounded-full bg-white/30" />
          <div className="h-1.5 w-2/3 rounded-full bg-white/20" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
          <span className="text-[10px] font-bold text-orange uppercase tracking-wider">{l.inventory}</span>
          <div className="h-2 w-full rounded-full bg-white/30" />
          <div className="h-1.5 w-4/5 rounded-full bg-white/20" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
          <span className="text-[10px] font-bold text-orange uppercase tracking-wider">{l.activity}</span>
          <div className="h-2 w-full rounded-full bg-white/30" />
          <div className="h-1.5 w-1/2 rounded-full bg-white/20" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
          <span className="text-[10px] font-bold text-orange uppercase tracking-wider">{l.costs}</span>
          <div className="h-2 w-full rounded-full bg-white/30" />
          <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}
