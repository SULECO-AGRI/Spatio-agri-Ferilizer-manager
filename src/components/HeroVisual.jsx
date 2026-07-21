import Icon from "./Icon.jsx";

function TelemetryCard() {
  return (
    <div className="absolute bottom-4 left-4 rounded-xl border border-white/20 bg-on-background/85 p-3 text-left text-white shadow-soft backdrop-blur-md">
      <div className="mb-1 flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-secondary-container" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
          Live telemetry analysis
        </span>
      </div>
      <p className="text-xs text-white/75">Field 084 · Central Pivot North</p>
    </div>
  );
}

function DataPanel() {
  const cells = [73, 68, 81, 64, 55, 47, 59, 71, 76, 88, 41, 52, 63, 79, 84, 69];

  return (
    <div className="absolute right-4 top-4 hidden w-44 rounded-xl border border-white/25 bg-primary/70 p-3 backdrop-blur-md sm:block">
      <div className="mb-2 flex items-center justify-between text-white">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">NDVI grid</span>
        <Icon name="analytics" className="text-sm" />
      </div>
      <div className="grid grid-cols-4 gap-1">
        {cells.map((cell, index) => (
          <span
            key={`${cell}-${index}`}
            className="rounded bg-white/15 px-1.5 py-1 text-center font-mono text-[10px] text-white"
          >
            {cell}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HeroVisual() {
  return (
    <div className="relative mx-auto mt-14 w-full max-w-6xl overflow-hidden rounded-3xl border border-outline-variant/50 bg-white shadow-glow transition duration-500 hover:scale-[1.01]">
      <div className="grid min-h-[360px] grid-cols-1 md:grid-cols-2">
        <div className="field-lines relative flex items-center justify-center overflow-hidden p-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-white/10" />
          <div className="relative grid place-items-center rounded-full border border-white/25 bg-white/10 p-8 backdrop-blur-[2px]">
            <div className="relative h-28 w-28">
              <div className="absolute left-1/2 top-1/2 h-2 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90" />
              <div className="absolute left-1/2 top-1/2 h-28 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90" />
              <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-primary text-white shadow-soft">
                <Icon name="flight" className="grid h-full w-full place-items-center text-3xl" />
              </div>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="absolute h-5 w-5 rounded-full border-2 border-white bg-secondary-container shadow-soft"
                  style={{
                    top: i < 2 ? "-6px" : "calc(100% - 14px)",
                    left: i % 2 === 0 ? "-6px" : "calc(100% - 14px)",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="absolute left-8 top-8 max-w-xs text-white">
            <p className="mb-2 font-heading text-3xl font-extrabold uppercase leading-tight tracking-tight md:text-4xl">
              Precision Agriculture
            </p>
            <p className="text-sm font-medium text-white/85">Data driven farming for tomorrow</p>
          </div>
        </div>

        <div className="ndvi-grid relative min-h-[360px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
          <DataPanel />
          <div className="absolute bottom-5 right-5 rounded-xl border border-white/30 bg-white/85 p-3 shadow-soft backdrop-blur">
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Legend
            </p>
            <div className="space-y-1 text-xs font-semibold text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-emerald-700" /> Healthy
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-yellow-400" /> Stressed
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-red-600" /> Problem
              </div>
            </div>
          </div>
        </div>
      </div>
      <TelemetryCard />
    </div>
  );
}
