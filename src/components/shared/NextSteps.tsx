type NextStepsProps = {
  heading: string;
  steps: string[];
  note?: string;
};

export function NextSteps({ heading, steps, note }: NextStepsProps) {
  return (
    <section className="rounded-3xl bg-ink px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
      <div className="space-y-7">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{heading}</h2>
        <ol className="grid gap-6 border-t border-white/15 pt-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/15">
          {steps.map((step, index) => (
            <li key={step} className="grid grid-cols-[2rem_1fr] gap-3 md:px-6 md:first:pl-0 md:last:pr-0">
              <span className="font-mono text-xs font-bold text-orange">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-sm leading-relaxed text-white/75">{step}</p>
            </li>
          ))}
        </ol>
        {note ? (
          <p className="border-l-2 border-orange py-1 pl-4 text-sm font-medium text-white/85">
            {note}
          </p>
        ) : null}
      </div>
    </section>
  );
}
