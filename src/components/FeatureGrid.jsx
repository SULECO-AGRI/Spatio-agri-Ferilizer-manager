import Icon from "./Icon.jsx";

const miniFeatures = [
  {
    title: "Satellite Tracking",
    icon: "satellite_alt",
    body: "Global Sentinel-2 imagery updated every 5 days for field-wide trends.",
    footer: "Live updates active",
  },
  {
    title: "Cost Analytics",
    icon: "monitoring",
    body: "Real-time ROI calculations based on input savings and projected yields.",
    footer: "Savings target · 75% met",
  },
];

const prescriptionTags = ["SHP", "ISO-XML", "Trimble", "Raven"];

export default function FeatureGrid() {
  return (
    <section id="features" className="bg-surface-container-high px-5 py-20 md:px-gutter md:py-24">
      <div className="mx-auto max-w-container-max">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-secondary">
              The data core
            </p>
            <h2 className="font-heading text-3xl font-extrabold tracking-[-0.03em] text-primary md:text-4xl">
              High-density intelligence for decisive management.
            </h2>
          </div>
          <button className="w-fit rounded-lg border border-outline-variant bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:shadow-soft">
            Explore All Features
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <article className="field-lines relative min-h-[430px] overflow-hidden rounded-2xl border border-primary/15 p-8 text-white shadow-soft lg:col-span-6">
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-end">
              <div className="mb-4 inline-flex w-fit rounded-full bg-secondary-container px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                10mm resolution
              </div>
              <h3 className="font-heading text-3xl font-extrabold">Drone Imagery</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/85">
                Sub-centimeter detail for detecting pests, nutrient deficiencies, irrigation leaks,
                and crop stress before they spread.
              </p>
            </div>
            <div className="absolute right-8 top-8 grid h-28 w-28 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
              <Icon name="agriculture" className="text-5xl" />
            </div>
          </article>

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-6">
            {miniFeatures.map((feature) => (
              <article
                key={feature.title}
                className="bento-card flex min-h-[230px] flex-col justify-between rounded-2xl p-7"
              >
                <div>
                  <div className="mb-8 grid h-11 w-11 place-items-center rounded-lg bg-secondary-fixed text-secondary">
                    <Icon name={feature.icon} />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-on-surface-variant">{feature.body}</p>
                </div>
                <p className="mt-7 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                  {feature.footer}
                </p>
              </article>
            ))}

            <article className="bento-card rounded-2xl p-7 sm:col-span-2">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="grid h-28 w-28 shrink-0 place-items-center rounded-xl bg-surface-container-high text-primary">
                  <Icon name="layers" className="text-5xl" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-primary">
                    Smart Prescription Maps
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant">
                    Seamlessly export SHP or ISO-XML files compatible with John Deere, Case IH, AGCO
                    controllers, and common GIS workflows.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {prescriptionTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary-fixed px-3 py-1 text-xs font-bold text-on-secondary-fixed-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
