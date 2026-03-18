export function TeamIntroSection() {
  return (
    <section className="bg-neutral-50 px-4 md:px-6 py-14 lg:py-24">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-10 lg:gap-24 items-end">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-3">
            The people
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-black leading-tight">
            Small team, strong opinions about coffee
          </h2>
        </div>
        <div className="space-y-5">
          <p className="text-sm leading-7 text-neutral-500">
            We are a small, intentional team — roasters, sourcers, and
            people obsessed with getting the details right. Each person here
            was brought on because they cared about coffee before they cared
            about the job title.
          </p>
          <p className="text-sm leading-7 text-neutral-500">
            We stay small on purpose. It keeps us close to the work, honest
            about what we know, and fast enough to change direction when
            something better comes along.
          </p>
        </div>
      </div>
    </section>
  );
}
