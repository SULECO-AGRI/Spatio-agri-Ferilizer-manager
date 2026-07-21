import Icon from "./Icon.jsx";

const plans = [
  {
    title: "Field Scan",
    price: "$8",
    unit: "/acre",
    description: "Best for one-off NDVI scouting and quick fertilizer planning.",
    features: ["Drone flight scheduling", "NDVI orthomosaic", "PDF field report"],
  },
  {
    title: "Precision Pro",
    price: "$19",
    unit: "/acre",
    description: "For growers who need VRA files and season-level decisions.",
    featured: true,
    features: [
      "Everything in Field Scan",
      "VRA prescription export",
      "Yield and cost analytics",
      "Priority pilot dispatch",
    ],
  },
  {
    title: "Enterprise Farm",
    price: "Custom",
    unit: "",
    description: "For agribusiness teams managing large distributed operations.",
    features: ["Multi-farm dashboard", "API and GIS integration", "Dedicated agronomy support"],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-surface px-5 py-20 md:px-gutter md:py-24">
      <div className="mx-auto max-w-container-max">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-secondary">
            Pricing
          </p>
          <h2 className="font-heading text-3xl font-extrabold tracking-[-0.03em] text-primary md:text-4xl">
            Start with a field. Scale to the whole operation.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.title}
              className={`rounded-2xl border p-8 shadow-soft ${
                plan.featured
                  ? "border-primary bg-primary text-white"
                  : "border-outline-variant bg-white text-on-surface"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-heading text-2xl font-bold">{plan.title}</h3>
                {plan.featured && (
                  <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-on-tertiary-fixed">
                    Popular
                  </span>
                )}
              </div>

              <div className="mb-4 flex items-end gap-1">
                <span className="font-heading text-4xl font-extrabold">{plan.price}</span>
                <span className={plan.featured ? "text-white/70" : "text-on-surface-variant"}>
                  {plan.unit}
                </span>
              </div>
              <p
                className={`mb-7 text-sm leading-6 ${plan.featured ? "text-white/75" : "text-on-surface-variant"}`}
              >
                {plan.description}
              </p>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                    <Icon
                      name="check_circle"
                      fill
                      className={plan.featured ? "text-tertiary-fixed" : "text-success"}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`inline-flex w-full justify-center rounded-lg px-5 py-3 font-bold transition hover:-translate-y-0.5 ${
                  plan.featured ? "bg-white text-primary" : "bg-primary text-white"
                }`}
              >
                Get Started
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
