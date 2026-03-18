export function PhilosophySection() {
  return (
    <section className="bg-white px-4 md:px-6 py-14 lg:py-24">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-10 lg:gap-24 items-end">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-3">
            Our philosophy
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-black leading-tight">
            Good coffee starts long before the roaster
          </h2>
        </div>
        <div className="space-y-5">
          <p className="text-sm leading-7 text-neutral-500">
            Most roasters start with green beans on a shelf. We start with a
            farm visit, a handshake, and a conversation about what the soil
            looked like this season. By the time a bean reaches our roastery,
            we know its story — and we think you should too.
          </p>
          <p className="text-sm leading-7 text-neutral-500">
            That conviction shapes everything we do: how we source, how we
            roast, how we package, and how we talk about coffee. No shortcuts,
            no marketing fluff — just beans we genuinely believe in, handled
            with care at every step.
          </p>
        </div>
      </div>
    </section>
  );
}
