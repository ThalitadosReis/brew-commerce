const values = [
  {
    number: "01",
    title: "Honesty over hype",
    description:
      "We label every bag with exactly where the coffee came from, who grew it, and why we chose it. No vague origin stories.",
  },
  {
    number: "02",
    title: "Farmers first",
    description:
      "We pay above fair-trade rates and visit our partners in person. Good coffee starts with people who are treated well.",
  },
  {
    number: "03",
    title: "Less, but better",
    description:
      "We keep a small, rotating selection of coffees we genuinely love rather than a catalogue designed to impress.",
  },
] as const;

export function ValuesSection() {
  return (
    <section className="bg-neutral-900 px-4 py-14 md:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 lg:mb-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-500 mb-3">
            What we stand for
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-white max-w-xl">
            Principles we don&apos;t compromise on
          </h2>
        </div>

        <div className="grid gap-px bg-white/10 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.number} className="bg-neutral-900 p-8 lg:p-10 space-y-4">
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/20">
                {v.number}
              </span>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
                {v.title}
              </h3>
              <p className="text-sm leading-7 text-white/50">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
