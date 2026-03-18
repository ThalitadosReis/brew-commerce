const promises = [
  {
    number: "01",
    title: "Verified origin",
    description:
      "Every bag is labelled with the farm, country, and harvest season. We visit our partners in person — no anonymous lots, ever.",
  },
  {
    number: "02",
    title: "Roasted to order",
    description:
      "Nothing sits on a warehouse shelf. Your beans are roasted after you place your order so they arrive at peak freshness.",
  },
  {
    number: "03",
    title: "Ships within 48h",
    description:
      "Orders leave our roastery within two days, packed with the roast date printed on every bag so you always know what you're brewing.",
  },
] as const;

export function ProductPromisesSection() {
  return (
    <section className="bg-neutral-50 px-4 md:px-6 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 lg:mb-14">
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-3">
            Our promise
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-black max-w-lg">
            Quality you can trace from farm to cup
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-black/10">
          {promises.map((p) => (
            <div key={p.number} className="bg-neutral-50 p-8 lg:p-10 space-y-4">
              <span className="text-[11px] uppercase tracking-[0.3em] text-black/20">
                {p.number}
              </span>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-black">
                {p.title}
              </h3>
              <p className="text-sm leading-7 text-neutral-500">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
