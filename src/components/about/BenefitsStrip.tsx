const stats = [
  { value: "Est. 2017", label: "Founded" },
  { value: "6+", label: "Origins sourced" },
  { value: "100%", label: "Direct trade" },
  { value: "48h", label: "Roasted to order" },
] as const;

export function BenefitsStrip() {
  return (
    <section className="bg-white border-y border-black/10">
      <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-black/10">
        {stats.map((stat) => (
          <div key={stat.value} className="flex flex-col items-center text-center gap-1 px-8 py-10">
            <span className="text-4xl font-semibold tracking-[-0.04em] text-black">
              {stat.value}
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-black/40">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
