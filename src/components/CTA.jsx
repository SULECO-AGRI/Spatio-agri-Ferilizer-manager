import Icon from "./Icon.jsx";

export default function CTA() {
  return (
    <section id="contact" className="grid-pattern px-5 py-20 md:px-gutter md:py-24">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/20 bg-primary p-8 text-center text-white shadow-glow md:p-14">
        <div className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-tertiary-fixed ring-1 ring-white/20">
          <Icon name="eco" className="text-4xl" />
        </div>
        <h2 className="font-heading text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">
          Ready to Transform Your Yield?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
          Enter your contact information below. Our ag-tech specialists will provide a custom field
          assessment within 24 hours.
        </p>

        <form
          className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="text"
            placeholder="Email or Phone Number"
            className="min-h-14 flex-1 rounded-lg border border-white/20 bg-white px-5 text-on-surface outline-none transition placeholder:text-on-surface-variant/60 focus:border-secondary-container focus:ring-4 focus:ring-secondary-container/20"
            aria-label="Email or phone number"
          />
          <button className="min-h-14 rounded-lg bg-tertiary-fixed px-8 font-bold text-on-tertiary-fixed transition hover:-translate-y-0.5 hover:bg-tertiary-fixed-dim">
            Get Started
          </button>
        </form>

        <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
          No credit card required · Pilot slots fill fast during planting windows
        </p>
      </div>
    </section>
  );
}
