import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Wifi, Disc } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./primitives/Reveal";

export function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const timeTextRef = useRef<HTMLSpanElement>(null);
  const gpsTextRef = useRef<HTMLDivElement>(null);

  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default muted for standard premium video behaviors

  // IntersectionObserver to lazy-load video bytes when section is close (400px before viewport)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "400px",
        threshold: 0,
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Jitter GPS coordinates directly in the DOM to avoid React re-renders
  useEffect(() => {
    let lat = 6.928514;
    let lng = 79.865218;
    const interval = setInterval(() => {
      lat += (Math.random() - 0.5) * 0.00001;
      lng += (Math.random() - 0.5) * 0.00001;
      if (gpsTextRef.current) {
        gpsTextRef.current.textContent = `GPS: ${lat.toFixed(6)}°N ${lng.toFixed(6)}°E`;
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Sync mute state to the DOM video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, shouldLoadVideo]);

  // Play / Pause Toggle
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      // Force video source load if it hasn't loaded yet
      if (!videoRef.current.src && shouldLoadVideo) {
        videoRef.current.src = "/Video/video.mp4";
      }
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Failed to play video: ", err));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Mute / Unmute Toggle
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // Progress Bar Seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !progressRef.current || !video.duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * video.duration;
    video.currentTime = newTime;

    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${(clickX / width) * 100}%`;
    }
    if (timeTextRef.current) {
      timeTextRef.current.textContent = `${formatTime(newTime)} / ${formatTime(video.duration)}`;
    }
  };

  // Format seconds to mm:ss
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Video event handlers that modify the DOM directly (zero React state updates for 60fps)
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    if (progressFillRef.current && video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      progressFillRef.current.style.width = `${pct}%`;
    }
    if (timeTextRef.current && video.duration) {
      timeTextRef.current.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }
  };

  const handleDurationChange = () => {
    const video = videoRef.current;
    if (!video) return;
    if (timeTextRef.current && video.duration) {
      timeTextRef.current.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    if (timeTextRef.current) {
      timeTextRef.current.textContent = `00:00 / ${formatTime(video.duration)}`;
    }
  };

  const floatingParticles = [
    { left: "8%", top: "22%", delay: "0s", duration: "13s", size: "3px" },
    { left: "87%", top: "18%", delay: "2s", duration: "16s", size: "4px" },
    { left: "22%", top: "78%", delay: "1s", duration: "11s", size: "2px" },
    { left: "72%", top: "82%", delay: "3s", duration: "15s", size: "5px" },
    { left: "4%", top: "62%", delay: "4s", duration: "19s", size: "3px" },
    { left: "91%", top: "68%", delay: "0.5s", duration: "12s", size: "2px" },
    { left: "38%", top: "88%", delay: "2.5s", duration: "14s", size: "4px" },
    { left: "58%", top: "12%", delay: "1.5s", duration: "17s", size: "3px" },
  ];

  return (
    <section
      ref={sectionRef}
      id="video-showcase"
      className="relative w-full bg-[#090a0c] py-24 md:py-32 border-y border-zinc-900 overflow-hidden scroll-mt-24"
    >
      {/* CSS Keyframes for GPU acceleration and smooth effects */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes custom-particle-drift {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 0.25; }
          100% { transform: translateY(-70px) translateX(12px); opacity: 0; }
        }
        @keyframes custom-pulse-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.07; }
          50% { transform: translate(-50%, -50%) scale(1.06); opacity: 0.13; }
        }
        @keyframes play-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4), 0 10px 40px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 0 14px rgba(16, 185, 129, 0), 0 10px 40px rgba(0,0,0,0.5); }
        }
      `,
        }}
      />

      {/* Dynamic Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] bg-emerald-500 rounded-full blur-[120px] opacity-[0.07] pointer-events-none mix-blend-screen"
        style={{ animation: "custom-pulse-glow 8s ease-in-out infinite" }}
      />

      {/* Floating dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingParticles.map((particle, index) => (
          <div
            key={index}
            className="absolute bg-emerald-400/20 rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animation: `custom-particle-drift ${particle.duration} linear infinite`,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <Reveal className="mb-16 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold tracking-widest uppercase border border-emerald-500/20 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Real-Time Analysis
          </span>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-400">
            Watch AI Analyze Your Field in Real Time
          </h2>
          <p className="mt-4 text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            See how our drone captures your field, analyzes crop health, and generates an
            intelligent fertilizer prescription map in just minutes.
          </p>
        </Reveal>

        {/* DRONE REMOTE CONTROLLER MOCKUP */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full md:w-[75%] lg:w-[70%] max-w-[1000px] min-w-[320px] mx-auto flex flex-col items-center"
        >
          {/* Controller Floating Wrapper */}
          <motion.div
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full z-10 flex flex-col items-center"
          >
            {/* Folding Antennas behind the controller */}
            <div className="absolute -top-[34px] left-[24%] w-4 h-12 bg-gradient-to-b from-[#282a2d] to-[#141517] border border-[#3e4045] rounded-t-[4px] origin-bottom -rotate-12 shadow-lg flex justify-center z-0">
              <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full border border-zinc-700/50 absolute bottom-1" />
            </div>
            <div className="absolute -top-[34px] right-[24%] w-4 h-12 bg-gradient-to-b from-[#282a2d] to-[#141517] border border-[#3e4045] rounded-t-[4px] origin-bottom rotate-12 shadow-lg flex justify-center z-0">
              <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full border border-zinc-700/50 absolute bottom-1" />
            </div>

            {/* Main Controller Body - Matte dark gray premium finish */}
            <div className="w-full bg-gradient-to-b from-[#222427] via-[#191a1c] to-[#101112] border border-[#35373c] rounded-[28px] p-2.5 sm:p-3.5 md:p-5 shadow-[inset_0_2px_3px_rgba(255,255,255,0.06),0_25px_60px_rgba(0,0,0,0.85)] flex flex-row items-center justify-between gap-3 sm:gap-4 md:gap-6 relative overflow-hidden z-10">
              {/* Left Grip column - slim & minimal */}
              <div className="flex flex-col items-center justify-between h-[160px] sm:h-[220px] md:h-[290px] w-12 sm:w-16 md:w-20 shrink-0 select-none">
                {/* Small scroll dial edge accent */}
                <div className="w-4 h-8 bg-zinc-950 border border-zinc-800/80 rounded-md shadow-inner flex flex-col justify-between p-0.5 opacity-30">
                  <div className="w-full h-px bg-zinc-700" />
                  <div className="w-full h-px bg-zinc-700" />
                  <div className="w-full h-px bg-zinc-700" />
                </div>

                {/* Left Joystick - realistic knurled aluminum design */}
                <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-[#111214] to-[#222427] border border-[#2f3135] shadow-[inset_0_4px_10px_rgba(0,0,0,0.85),0_1px_2px_rgba(255,255,255,0.05)] relative flex items-center justify-center">
                  <div className="absolute inset-1.5 border border-[#1b1c1e] rounded-full bg-[#18191b]/50 shadow-inner pointer-events-none" />
                  <div className="absolute h-full w-px bg-[#2b2d30]/20 pointer-events-none" />
                  <div className="absolute w-full h-px bg-[#2b2d30]/20 pointer-events-none" />

                  {/* Stem & Knurled Aluminum Joystick Cap */}
                  <motion.div
                    animate={{ x: [-1, 1, 0, -1.5, 1.5, 0], y: [1.5, -1, 0, 1, -1.5, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-b from-zinc-200 via-zinc-400 to-zinc-600 border border-zinc-100/30 shadow-[0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-grab active:cursor-grabbing relative z-10"
                  >
                    <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-500 border border-zinc-600 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-zinc-300 shadow-inner" />
                    </div>
                  </motion.div>
                </div>

                {/* Recessed Return-to-Home button */}
                <div className="text-center">
                  <button className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-b from-[#18191b] to-[#0c0d0e] border border-[#2b2d30] hover:border-zinc-700 transition flex items-center justify-center cursor-pointer shadow-md active:scale-95 text-zinc-500 hover:text-zinc-300">
                    <span className="text-[7.5px] font-sans font-extrabold">H</span>
                  </button>
                  <span className="text-[6px] md:text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-1 block">
                    RTH
                  </span>
                </div>
              </div>

              {/* Center 16:9 Display Area - Screen occupies almost entire controller */}
              <div className="grow relative aspect-[16/9] overflow-hidden rounded-[16px] sm:rounded-[20px] bg-[#020202] border border-[#2c2d30] shadow-[inset_0_4px_20px_rgba(0,0,0,0.95)] group z-10">
                <div
                  className="relative w-full h-full overflow-hidden cursor-pointer"
                  onClick={() => togglePlay()}
                >
                  {/* HTML5 video element - Always mounted */}
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-auto"
                    src={shouldLoadVideo ? "/Video/video.mp4" : undefined}
                    preload={shouldLoadVideo ? "auto" : "none"}
                    poster="/Video/poster.webp"
                    playsInline
                    muted={isMuted}
                    loop
                    disablePictureInPicture
                    onVolumeChange={() => {
                      if (videoRef.current) {
                        setIsMuted(videoRef.current.muted);
                      }
                    }}
                    onTimeUpdate={handleTimeUpdate}
                    onDurationChange={handleDurationChange}
                    onLoadedMetadata={handleLoadedMetadata}
                    style={{ transform: "translateZ(0)", willChange: "transform" }}
                  />

                  {/* Poster Image Overlay - disappears smoothly when playing */}
                  <img
                    src="/Video/poster.webp"
                    className={`absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-none transition-opacity duration-500 ${isPlaying ? "opacity-0" : "opacity-100"}`}
                    alt="Video Poster"
                  />

                  {/* Mapping HUD Telemetry Overlay */}
                  <div className="absolute inset-0 pointer-events-none select-none z-10 font-mono text-emerald-400/90 text-[6px] sm:text-[8px] md:text-[9.5px] p-2.5 sm:p-3.5 md:p-5 flex flex-col justify-between">
                    {/* HUD Top Bar */}
                    <div className="flex justify-between items-start">
                      <div className="bg-black/55 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded border border-white/5 backdrop-blur-xs space-y-0.5">
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span className="font-bold text-white uppercase tracking-wider text-[5.5px] sm:text-[7.5px] md:text-[8.5px]">
                            AUTO-SURVEY
                          </span>
                        </div>
                        <div
                          ref={gpsTextRef}
                          className="text-emerald-400 font-mono text-[5px] sm:text-[7px] md:text-[8px]"
                        >
                          GPS: 6.928514°N 79.865218°E
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-black/55 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded border border-white/5 backdrop-blur-xs text-white font-semibold text-[5.5px] sm:text-[7.5px] md:text-[8.5px]">
                        <div className="flex items-center gap-1 text-emerald-400">
                          <Wifi className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                          <span>RTK ACTIVE</span>
                        </div>
                      </div>
                    </div>

                    {/* HUD Center Target crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/10 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-emerald-400/70 rounded-full" />
                        <div className="absolute -top-4 -left-4 w-2 h-2 border-t border-l border-emerald-400/40" />
                        <div className="absolute -top-4 -right-4 w-2 h-2 border-t border-r border-emerald-400/40" />
                        <div className="absolute -bottom-4 -left-4 w-2 h-2 border-b border-l border-emerald-400/40" />
                        <div className="absolute -bottom-4 -right-4 w-2 h-2 border-b border-r border-emerald-400/40" />
                      </div>
                    </div>

                    {/* HUD Bottom Bar */}
                    <div className="flex justify-between items-end">
                      <div className="bg-black/55 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded border border-white/5 backdrop-blur-xs text-left text-zinc-300">
                        <div>
                          ALT: <span className="text-white font-bold">42.8 m</span>
                        </div>
                        <div>
                          SPD: <span className="text-white font-bold">5.6 m/s</span>
                        </div>
                      </div>

                      <div className="bg-emerald-950/70 border border-emerald-500/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-center text-emerald-300 font-bold uppercase tracking-wider text-[5.5px] sm:text-[7.5px] md:text-[8.5px] animate-pulse">
                        Prescription Mapping: 42%
                      </div>

                      <div className="bg-black/55 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded border border-white/5 backdrop-blur-xs text-right text-zinc-300">
                        <div className="flex items-center justify-end gap-1 text-red-500">
                          <Disc className="w-2.5 h-2.5 animate-pulse" />
                          <span className="font-bold text-red-400">REC</span>
                        </div>
                        <div>SAT: 18 · SIG: 98%</div>
                      </div>
                    </div>
                  </div>

                  {/* PLAY / PAUSE DYNAMIC OVERLAY BUTTON */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-all duration-300 pointer-events-none z-20">
                    <AnimatePresence>
                      {!isPlaying && (
                        <motion.button
                          key="play-btn"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ scale: 1.06 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                          }}
                          className="relative flex items-center justify-center w-14 h-14 sm:w-18 sm:h-18 rounded-full border border-white/20 bg-white/10 text-white shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-md cursor-pointer pointer-events-auto transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] play-glow-btn"
                          style={{ animation: "play-pulse 2s infinite" }}
                        >
                          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white translate-x-0.5" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* CUSTOM SLEEK MEDIA CONTROLS (Hover reveal) */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-auto">
                    {/* Progress Bar */}
                    <div
                      ref={progressRef}
                      onClick={handleSeek}
                      className="w-full h-1 bg-white/20 rounded-full cursor-pointer relative overflow-hidden hover:h-1.5 transition-all duration-150"
                    >
                      <div
                        ref={progressFillRef}
                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_4px_rgba(16,185,129,0.8)] transition-all duration-100"
                        style={{ width: "0%" }}
                      />
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-[9px] sm:text-xs text-white/95 font-mono">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                          }}
                          className="text-white hover:text-emerald-400 transition"
                        >
                          {isPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current" />
                          )}
                        </button>

                        <span ref={timeTextRef} className="text-[8.5px] sm:text-xs">
                          00:00 / 00:00
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-emerald-400 transition"
                        >
                          {isMuted ? (
                            <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          ) : (
                            <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Grip column - slim & minimal */}
              <div className="flex flex-col items-center justify-between h-[160px] sm:h-[220px] md:h-[290px] w-12 sm:w-16 md:w-20 shrink-0 select-none">
                {/* Recessed Power Button with Green LED Ring */}
                <div className="text-center">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-b from-[#18191b] to-[#0c0d0e] border border-[#2b2d30] flex items-center justify-center shadow-md relative cursor-pointer active:scale-95 group">
                    {/* LED Ring */}
                    <div className="absolute inset-0 rounded-full border border-emerald-500/50 animate-pulse shadow-[0_0_6px_#10b981]" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]" />
                  </div>
                  <span className="text-[6px] md:text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-1 block">
                    Power
                  </span>
                </div>

                {/* Right Joystick - realistic knurled aluminum design */}
                <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-[#111214] to-[#222427] border border-[#2f3135] shadow-[inset_0_4px_10px_rgba(0,0,0,0.85),0_1px_2px_rgba(255,255,255,0.05)] relative flex items-center justify-center">
                  <div className="absolute inset-1.5 border border-[#1b1c1e] rounded-full bg-[#18191b]/50 shadow-inner pointer-events-none" />
                  <div className="absolute h-full w-px bg-[#2b2d30]/20 pointer-events-none" />
                  <div className="absolute w-full h-px bg-[#2b2d30]/20 pointer-events-none" />

                  {/* Stem & Knurled Aluminum Joystick Cap */}
                  <motion.div
                    animate={{ x: [1, -1, 0, 1.5, -1.5, 0], y: [-1.5, 1.5, 0, -1, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 7.2, ease: "easeInOut" }}
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-b from-zinc-200 via-zinc-400 to-zinc-600 border border-zinc-100/30 shadow-[0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-grab active:cursor-grabbing relative z-10"
                  >
                    <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-500 border border-[#444] flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-zinc-300 shadow-inner" />
                    </div>
                  </motion.div>
                </div>

                {/* Fn / Extra Button */}
                <div className="text-center">
                  <button className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-b from-[#18191b] to-[#0c0d0e] border border-[#2b2d30] flex items-center justify-center cursor-pointer shadow-md active:scale-95 text-zinc-500 hover:text-white transition">
                    <span className="text-[7.5px] font-sans font-bold">Fn</span>
                  </button>
                  <span className="text-[6px] md:text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-1 block">
                    Mode
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Breathing shadow beneath the controller */}
          <motion.div
            animate={{
              scaleX: [1, 0.88, 1],
              opacity: [0.35, 0.18, 0.35],
              filter: ["blur(14px)", "blur(20px)", "blur(14px)"],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-[85%] h-5 bg-black/60 rounded-full pointer-events-none z-0"
          />
        </motion.div>
      </div>
    </section>
  );
}
