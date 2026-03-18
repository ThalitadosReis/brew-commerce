const steps = [
  {
    number: "01",
    title: "We source directly",
    description:
      "Every coffee we carry comes from farms we know by name. We visit in person, pay above fair-trade rates, and only select what we'd genuinely drink ourselves.",
  },
  {
    number: "02",
    title: "We roast to order",
    description:
      "Nothing sits on a shelf waiting. Each batch is roasted after your order is placed, so what arrives at your door is as fresh as it can possibly be.",
  },
  {
    number: "03",
    title: "We ship within 48h",
    description:
      "Orders leave our roastery within two days. Every bag is labelled with its origin, roast date, and the farm it came from — no guesswork, just transparency.",
  },
] as const;

export function ProcessSection() {
  return (
    <section className="bg-neutral-50 px-4 md:px-6 py-14 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 lg:mb-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-black max-w-xl">
            From the farm to your cup
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-black/10">
          {steps.map((step) => (
            <div key={step.number} className="bg-neutral-50 p-8 lg:p-10 space-y-4">
              <span className="text-[11px] uppercase tracking-[0.3em] text-black/20">
                {step.number}
              </span>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-black">
                {step.title}
              </h3>
              <p className="text-sm leading-7 text-neutral-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
