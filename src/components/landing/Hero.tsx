import { useState } from "react";
import { motion } from "framer-motion";
import { KineticPhrase } from "./primitives/KineticPhrase";
import HeroImage from "../../Images/Hero_Image.jpg";

export function Hero() {
  const [email, setEmail] = useState("");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState(88);

  const getStatus = (val: number) => {
    if (val < 40) return { label: "Low", color: "text-red-400" };
    if (val < 75) return { label: "Medium", color: "text-yellow-400" };
    if (val < 95) return { label: "High", color: "text-lime-450 text-[#a3e635]" };
    return { label: "Optimal", color: "text-emerald-400" };
  };

  const status = getStatus(value);

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 bg-slate-50"
    >
      {/* Light-grey technical grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.05] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                className="text-slate-900"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Background Image Container - positioned on the right side, fading to blend with the background */}
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 lg:w-[46%] z-0 pointer-events-none overflow-hidden">
        {/* Smooth gradient blend - faded more to the right to keep the drone clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9ff] via-[#f8f9ff]/30 to-transparent z-10" />
        <img
          src={HeroImage}
          alt="Agricultural drone spraying rice paddy field"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12 relative z-10 text-left">
        {/* Left text column */}
        <div className="lg:col-span-8 flex flex-col items-start">
          <h1 className="font-display text-3xl font-extrabold leading-[1.15] tracking-tight text-[#062419] md:text-5xl lg:text-6xl">
            Stop blanketing your fields.
            <br />
            <KineticPhrase
              phrases={["Spray by the square.", "Fertilize by the foot.", "Seed by the zone."]}
            />
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg font-sans">
            Every acre varies. Spatio Agri fuses drone and satellite telemetry to compute
            variable-rate prescription grids — optimizing every input, automatically. You request
            the flight, our localized pilots deploy the drones.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (valid) setSubmitted(true);
            }}
            className="mt-8 flex max-w-md items-center gap-1 rounded-xl bg-white border border-slate-200 p-1.5 shadow-sm focus-within:border-emerald-500 transition-colors"
          >
            <label htmlFor="hero-email" className="sr-only">
              Email
            </label>
            <input
              id="hero-email"
              type="email"
              placeholder="you@farm.co"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSubmitted(false);
              }}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {submitted ? (
              <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600 border border-emerald-200">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                  <motion.path
                    d="M3 8.5l3 3 7-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.35 }}
                  />
                </svg>{" "}
                On the list
              </span>
            ) : (
              <button
                type="submit"
                disabled={!valid}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2 transition duration-150 disabled:opacity-50 cursor-pointer"
              >
                Request Access
              </button>
            )}
          </form>
        </div>

        {/* Right spacing */}
        <div className="hidden lg:block lg:col-span-4" />
      </div>
      {/*
      <div className="absolute bottom-12 right-12 z-20 w-full max-w-[280px] hidden lg:block">
        <div className="bg-zinc-950/95 border border-zinc-800 rounded-3xl p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <div className="mb-2 text-[11px] font-medium text-zinc-400">
            Ready to maximize productivity
          </div>
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-5xl font-extrabold tracking-tight text-white font-mono">
              {value}%
            </span>
            <span className={`text-sm font-bold uppercase tracking-wider ${status.color}`}>
              {status.label}
            </span>
          </div>
          
          <div className="relative flex items-center mb-3">
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="modern-range-slider"
              style={{
                background: `linear-gradient(to right, #a3e635 0%, #a3e635 ${value}%, #27272a ${value}%, #27272a 100%)`
              }}
            />
          </div>
          
          <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            Operational Reliability
          </div>
        </div>
      </div>
      */}
    </section>
  );
}
