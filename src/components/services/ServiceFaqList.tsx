export interface FaqItem { question: string; answer: string }
export function ServiceFaqList({ items }: { items: FaqItem[] }) {
  return <div className="space-y-4">{items.map((item) => (
    <details key={item.question} className="group overflow-hidden rounded-2xl border border-border bg-background">
      <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-base font-bold text-ink outline-none transition-colors hover:text-orange-text focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange">
        <span className="pr-4">{item.question}</span><span aria-hidden="true" className="text-xl text-foreground-muted transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="px-6 pb-6 text-sm leading-relaxed text-foreground-muted"><p>{item.answer}</p></div>
    </details>
  ))}</div>;
}
