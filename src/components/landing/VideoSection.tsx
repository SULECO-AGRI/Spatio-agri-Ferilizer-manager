import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Eye, Activity } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Reveal } from "./primitives/Reveal";

export function VideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { margin: "-100px 0px -100px 0px" });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto play/pause based on screen visibility to ensure 0 background lag
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isInView && isPlaying) {
      video.play().catch((err) => {
        // Handle autoplay blockages gracefully
        console.log("Autoplay was prevented: ", err);
      });
    } else {
      video.pause();
    }
  }, [isInView, isPlaying]);

  const handlePlayToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Failed to play: ", err));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section
      ref={containerRef}
      id="demo"
      className="relative w-full py-24 md:py-32 bg-[#08090b] border-y border-zinc-900 overflow-hidden"
    >
      {/* Decorative cybernetic glow shapes */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[150px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="grid-pattern opacity-[0.03] absolute inset-0 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Content Side */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white md:text-5xl leading-[1.1]">
                Observe the Smart Telemetry
              </h2>
            </Reveal>

            <Reveal>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
                Watch how Spatio Agri processes multispectral imagery in real time. We map
                individual crop health coordinates and compile high-definition variable-rate maps
                with zero rendering lag.
              </p>
            </Reveal>

            {/* Glowing Tech Badges */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Reveal>
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm hover:border-emerald-500/30 transition-colors duration-300">
                  <div className="flex items-center gap-2 text-emerald-400 mb-1.5">
                    <Activity className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                      Feed Status
                    </span>
                  </div>
                  <div className="text-white text-lg font-bold font-display">60 FPS Native</div>
                  <div className="text-[10px] text-zinc-500">Hardware accelerated</div>
                </div>
              </Reveal>

              <Reveal>
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm hover:border-primary/30 transition-colors duration-300">
                  <div className="flex items-center gap-2 text-primary mb-1.5">
                    <Eye className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                      Spectrum
                    </span>
                  </div>
                  <div className="text-white text-lg font-bold font-display">NDVI Sensor</div>
                  <div className="text-[10px] text-zinc-500">Near-infrared band</div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right Video Player Side */}
          <div className="lg:col-span-7 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[640px] aspect-[16/9] rounded-3xl overflow-hidden border border-zinc-800/60 shadow-[0_20px_50px_rgba(0,0,0,0.7)] group bg-black"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Telemetry border glow (Emerald/Primary blend) */}
              <div className="absolute inset-0 border border-emerald-500/10 rounded-3xl pointer-events-none group-hover:border-emerald-500/25 transition-colors duration-500 z-30" />

              {/* Native Video Element */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover z-0 select-none pointer-events-auto transform-gpu"
                src="/Video/video.mp4"
                poster="/Video/poster.webp"
                preload="auto"
                playsInline
                muted={isMuted}
                loop
                onClick={handlePlayToggle}
                style={{ transform: "translateZ(0)", willChange: "transform" }}
              />

              {/* HUD telemetric layout overlay */}
              <div className="absolute inset-0 pointer-events-none select-none z-10 p-4 font-mono text-[7px] sm:text-[9px] text-emerald-400/90 flex flex-col justify-between">
                {/* HUD Header */}
                <div className="flex justify-between items-start">
                  <div className="bg-black/60 px-2 py-0.5 rounded border border-white/5 backdrop-blur-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white uppercase tracking-wider text-[6px] sm:text-[8px]">
                      SURVEYOR_D42
                    </span>
                  </div>
                  <div className="bg-black/60 px-2 py-0.5 rounded border border-white/5 backdrop-blur-md text-white font-semibold">
                    100% SIGNAL
                  </div>
                </div>

                {/* Crosshair target in the center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="w-8 h-8 border border-emerald-500/30 rounded-full flex items-center justify-center">
                    <div className="w-0.5 h-0.5 bg-emerald-400 rounded-full" />
                  </div>
                </div>

                {/* HUD Footer */}
                <div className="flex justify-between items-end">
                  <div className="bg-black/60 px-2 py-0.5 rounded border border-white/5 backdrop-blur-md text-zinc-300">
                    GPS: 06°55'42"N · 79°51'54"E
                  </div>
                  <div className="bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-emerald-300 font-bold uppercase tracking-wider text-[6px] sm:text-[8px] animate-pulse">
                    MAPPING COMPLETED
                  </div>
                </div>
              </div>

              {/* Playback controls overlay (reveal on hover/pause) */}
              <div
                className={`absolute inset-0 bg-black/15 transition-opacity duration-300 flex items-center justify-center z-20 cursor-pointer ${
                  !isPlaying || isHovered ? "opacity-100" : "opacity-0"
                }`}
                onClick={handlePlayToggle}
              >
                {/* Central Button */}
                {!isPlaying && (
                  <div className="w-16 h-16 rounded-full border border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-md flex items-center justify-center transform scale-100 transition-transform duration-300 hover:scale-105">
                    <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
                  </div>
                )}

                {/* Bottom status bar */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white font-mono text-[9px] sm:text-xs z-30 pointer-events-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayToggle();
                    }}
                    className="hover:text-emerald-400 transition"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white" />
                    )}
                  </button>

                  <button onClick={handleMuteToggle} className="hover:text-emerald-400 transition">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
