import { Sprout, Dna, Leaf, Brain, Plane, Globe, Zap, Droplets } from "lucide-react";

const partners = [
  { name: "AgriTech Global", icon: Sprout },
  { name: "TerraDrone Labs", icon: Plane },
  { name: "Ceres AI Analytics", icon: Brain },
  { name: "GreenField Systems", icon: Leaf },
  { name: "BioSeed Genetics", icon: Dna },
  { name: "GeoCrop Precision", icon: Globe },
  { name: "Apex Harvest Co.", icon: Zap },
  { name: "HydroAgri Systems", icon: Droplets },
];

export function Partners() {
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
        <p className="text-sm font-mono font-bold uppercase tracking-widest text-slate-400 mb-12">
          Meet Our Industry leaders
        </p>

        {/* Marquee Wrapper with fading masks at edges */}
        <div className="relative w-full overflow-hidden py-8 select-none">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Marquee Container */}
          <div className="marquee-track flex gap-20 md:gap-28 items-center">
            {marqueeItems.map((partner, index) => {
              const IconComponent = partner.icon;
              return (
                <div
                  key={`${partner.name}-${index}`}
                  className="glass flex items-center gap-5 px-10 py-5.5 md:px-12 md:py-6.5 rounded-[22px] shadow-[0_12px_32px_rgba(0,0,0,0.02)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-500/35 hover:bg-emerald-50/[0.04] hover:shadow-[0_20px_40px_rgba(16,185,129,0.06)] group cursor-pointer transform-gpu"
                >
                  <IconComponent className="w-7 h-7 text-slate-400 group-hover:text-emerald-500 transition-colors duration-300" />
                  <span className="text-lg md:text-xl font-bold tracking-tight text-slate-500 group-hover:text-slate-850 transition-colors duration-300">
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
