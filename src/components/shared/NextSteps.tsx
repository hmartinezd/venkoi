type NextStepsProps = {
  heading: string;
  steps: string[];
  note?: string;
};

export function NextSteps({ heading, steps, note }: NextStepsProps) {
  return (
    <section className="border-t border-border pt-8">
      <div className="space-y-5">
        <h2 className="text-2xl font-bold text-ink">{heading}</h2>
        <ol className="grid gap-5 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <li key={step} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="font-mono text-xs font-bold text-orange-text">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-sm leading-relaxed text-foreground-muted">{step}</p>
            </li>
          ))}
        </ol>
        {note ? (
          <p className="border-l-2 border-orange/30 py-1 pl-4 text-sm font-medium italic text-ink">
            {note}
          </p>
        ) : null}
      </div>
    </section>
  );
}
