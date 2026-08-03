import { useRef, useState } from "react";
import { KineticPhrase } from "./primitives/KineticPhrase";
import HeroImage from "../../Images/Hero_Image.jpg";
import { Check } from "lucide-react";

export function Hero() {
  const [email, setEmail] = useState("");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [submitted, setSubmitted] = useState(false);


  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-36 pb-24 md:pt-40 md:pb-32 bg-[#11161d] text-white border-b border-zinc-800/20"
      style={{ perspective: 1200 }}
    >
      {/* Background Video Player */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-85 filter brightness-[1.0] contrast-[1.0]"
          src="/Video/Hero_background.mp4"
          poster={HeroImage}
        />
        {/* Left-to-right dark gradient mask to give the left text high readability while keeping the right side clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#11161d] via-[#11161d]/65 via-[45%] to-transparent" />
        {/* Bottom smooth fade to combine with the next section */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#11161d] to-transparent" />
        {/* Top smooth fade for header navigation */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#11161d]/75 to-transparent" />
        {/* Fine grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-bg opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="mx-auto grid max-w-6xl w-full grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12 relative z-10 text-left">
        {/* Left Text Block */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6">


          <h1 className="hero-title font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-white">
            Stop blanketing your fields.
            <br />
            <KineticPhrase
              phrases={["Spray by the square.", "Fertilize by the foot.", "Seed by the zone."]}
            />
          </h1>

          <p className="hero-desc text-zinc-400 text-base leading-relaxed max-w-xl font-sans">
            Every acre varies. Spatio Agri fuses drone and satellite telemetry to compute
            variable-rate prescription grids — optimizing every input, automatically. You request
            the flight, our localized pilots deploy the drones.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (valid) setSubmitted(true);
            }}
            className="hero-form flex w-full max-w-md items-center gap-1 rounded-xl bg-zinc-950/45 border border-zinc-800/80 p-1.5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md focus-within:border-emerald-500/50 transition-all duration-300"
          >
            <label htmlFor="hero-email" className="sr-only">
              Email
            </label>
            <input
              id="hero-email"
              type="email"
              placeholder="Enter your email to request access..."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSubmitted(false);
              }}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
            {submitted ? (
              <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400 border border-emerald-500/25">
                <Check className="w-4 h-4" />
                Access Requested
              </span>
            ) : (
              <button
                type="submit"
                disabled={!valid}
                className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm px-5 py-2.5 transition duration-150 disabled:opacity-50 disabled:hover:bg-emerald-500 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.45)]"
              >
                Request Access
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

