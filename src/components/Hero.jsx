import { useState } from "react";
import Icon from "./Icon.jsx";
import HeroImage from "../Images/Hero_Image.jpg";

export default function Hero() {
  const [value, setValue] = useState(88);

  const getStatus = (val) => {
    if (val < 40) return { label: "Low", color: "text-red-400" };
    if (val < 75) return { label: "Medium", color: "text-yellow-400" };
    if (val < 95) return { label: "High", color: "text-lime-450 text-[#a3e635]" };
    return { label: "Optimal", color: "text-emerald-400" };
  };

  const status = getStatus(value);

  return (
    <section
      id="home"
      className="relative grid-pattern overflow-hidden px-5 pb-20 pt-28 md:px-gutter md:pb-28 md:pt-36"
    >
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

      <div className="relative mx-auto max-w-container-max z-10 text-left grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left text column */}
        <div className="lg:col-span-8 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-fixed px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-on-primary-fixed">
            <Icon name="precision_manufacturing" className="text-base" />
            Variable rate optimization
          </div>

          <h1 className="mt-7 max-w-4xl font-heading text-4xl font-extrabold leading-tight tracking-[-0.04em] text-primary md:text-4xl">
            Stop Blanketing Your Fields.{" "}
            <span className="text-secondary">Fertilize by the Foot.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-on-surface-variant md:text-lg">
            Unleash pinpoint intelligence on every acre. Specialized drone pilots capture
            hyper-local NDVI data and turn it into the exact prescription your equipment needs.
          </p>

          <div className="mt-8 flex flex-col items-center justify-start gap-4 sm:flex-row w-full sm:w-auto">
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-8 py-4 font-heading text-base font-bold text-white shadow-soft transition hover:-translate-y-1 hover:bg-primary-container sm:w-auto"
            >
              Schedule a Consultation
            </a>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-outline-variant bg-white px-8 py-4 font-semibold text-primary shadow-sm transition hover:-translate-y-1 hover:bg-surface-container-low sm:w-auto">
              <Icon name="play_circle" fill />
              Watch 1-Min Demo
            </button>
          </div>
        </div>

        {/* Right spacing */}
        <div className="hidden lg:block lg:col-span-4" />
      </div>
    </section>
  );
}
