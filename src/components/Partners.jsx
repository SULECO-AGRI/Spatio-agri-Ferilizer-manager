import Icon from "./Icon.jsx";

const partners = [
  { name: "AgriTech Global", icon: "eco" },
  { name: "TerraDrone Labs", icon: "flight_takeoff" },
  { name: "Ceres AI Analytics", icon: "memory" },
  { name: "GreenField Systems", icon: "psychology" },
  { name: "BioSeed Genetics", icon: "fingerprint" },
  { name: "GeoCrop Precision", icon: "public" },
  { name: "Apex Harvest Co.", icon: "bolt" },
  { name: "HydroAgri Systems", icon: "opacity" },
];

export default function Partners() {
  const marqueeItems = [...partners, ...partners];

  return (
    <section className="relative w-full py-20 md:py-24 bg-slate-50/30 border-b border-slate-100 overflow-hidden">
      {/* CSS Encapsulated Marquee Styles */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Decorative background grid subtle overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] grid-bg" />

      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Subtitle */}
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-10">
          Trusted by Industry Leaders & Innovators
        </p>

        {/* Marquee Wrapper with fading masks at edges */}
        <div className="relative w-full overflow-hidden py-6 select-none">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Marquee Container */}
          <div className="marquee-track flex gap-16 md:gap-24 items-center">
            {marqueeItems.map((partner, index) => {
              return (
                <div
                  key={`${partner.name}-${index}`}
                  className="flex items-center gap-4 px-8 py-4 md:px-10 md:py-5 rounded-2xl bg-white/40 border border-slate-200/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-50/[0.05] hover:shadow-emerald-500/5 group cursor-pointer"
                >
                  <Icon
                    name={partner.icon}
                    className="text-slate-400 group-hover:text-emerald-500 transition-colors duration-300 text-2xl"
                  />
                  <span className="text-base md:text-lg font-semibold tracking-tight text-slate-500 group-hover:text-slate-800 transition-colors duration-300">
                    {partner.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
