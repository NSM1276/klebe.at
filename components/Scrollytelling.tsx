"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { useMediaQuery } from "@/lib/useMediaQuery";

// Scroll progress values where each scene is fully settled (no crossfade in
// progress). After a swipe/scroll gesture ends, we ease the page to the
// nearest of these so a fast flick can't leave the user stranded mid-fade
// or skip straight over a scene.
const SCENE_REST_POINTS = [0, 0.47, 0.82];

/**
 * Media manifest — drop real files at these exact paths under /public/media/
 * and set the matching constant below from `undefined` to the path string.
 * Nothing else needs to change; placeholders disappear automatically once a
 * path is set. See docs/media-brief.md for generation prompts + encoding spec.
 */
const HERO_VIDEO_DESKTOP: string | undefined = "/media/hero-desktop.mp4"; // 16:9, 1920x1080
const HERO_VIDEO_MOBILE: string | undefined = "/media/hero-mobile.mp4"; // 9:16, 1080x1920
const PROCESS_VIDEO_DESKTOP: string | undefined = "/media/process-desktop.mp4"; // 16:9, 1920x1080
const PROCESS_VIDEO_MOBILE: string | undefined = "/media/process-mobile.mp4"; // 9:16, 1080x1920
const HERO_POSTER = "/media/hero-poster.jpg";
const PROCESS_POSTER = "/media/process-poster.jpg";
const GALLERY_PHOTOS: (string | undefined)[] = [
  "/media/gallery-1.jpg",
  "/media/gallery-2.jpg",
  "/media/gallery-3.jpg",
  "/media/gallery-4.jpg",
];

// Scroll progress breakpoints for the three scenes (0..1 across the pinned container)
const SCENE_1_END = 0.3;
const SCENE_2_START = 0.32;
const SCENE_2_END = 0.62;
const SCENE_3_START = 0.64;

function MediaLayer({
  opacity,
  videoSrc,
  poster,
  imgSrc,
  label,
}: {
  opacity: import("framer-motion").MotionValue<number>;
  videoSrc?: string;
  poster?: string;
  imgSrc?: string;
  label: string;
}) {
  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      {!videoSrc && !imgSrc && (
        <div className="absolute inset-0 bg-gradient-to-br from-panel via-ink to-black flex items-center justify-center">
          <span className="text-white/25 text-xs tracking-[0.2em] uppercase text-center px-8">
            {label}
          </span>
        </div>
      )}
      {videoSrc && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoSrc}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      )}
      {imgSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="absolute inset-0 w-full h-full object-cover" src={imgSrc} alt="" />
      )}
    </motion.div>
  );
}

function Kicker({ label, index }: { label: string; index: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <span className="h-px w-8 bg-accent" />
      <span className="text-accent text-xs font-semibold tracking-[0.25em] uppercase">
        {label} {String(index).padStart(2, "0")}
      </span>
    </div>
  );
}

export function Scrollytelling() {
  const { t } = useLanguage();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const heroVideoSrc = isDesktop ? HERO_VIDEO_DESKTOP : HERO_VIDEO_MOBILE;
  const processVideoSrc = isDesktop ? PROCESS_VIDEO_DESKTOP : PROCESS_VIDEO_MOBILE;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, SCENE_1_END, SCENE_2_START], [1, 1, 0]);
  const processOpacity = useTransform(
    scrollYProgress,
    [SCENE_1_END, SCENE_2_START, SCENE_2_END, SCENE_3_START],
    [0, 1, 1, 0],
  );
  const galleryOpacity = useTransform(scrollYProgress, [SCENE_2_END, SCENE_3_START, 1], [0, 1, 1]);

  const galleryItem1 = useTransform(scrollYProgress, [SCENE_3_START, SCENE_3_START + 0.08], [0, 1]);
  const galleryItem2 = useTransform(scrollYProgress, [SCENE_3_START + 0.03, SCENE_3_START + 0.11], [0, 1]);
  const galleryItem3 = useTransform(scrollYProgress, [SCENE_3_START + 0.06, SCENE_3_START + 0.14], [0, 1]);
  const galleryItem4 = useTransform(scrollYProgress, [SCENE_3_START + 0.09, SCENE_3_START + 0.17], [0, 1]);
  const galleryItems = [galleryItem1, galleryItem2, galleryItem3, galleryItem4];

  const [activeScene, setActiveScene] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const index = value < SCENE_2_START ? 0 : value < SCENE_3_START ? 1 : 2;
    setActiveScene((prev) => (prev === index ? prev : index));
  });

  const handleExploreClick = () => {
    window.scrollBy({ top: window.innerHeight * 1.4, behavior: "smooth" });
  };

  // After a scroll/swipe gesture settles, ease to the nearest fully-visible
  // scene instead of leaving the page stuck mid-crossfade or letting a fast
  // flick skip a whole scene.
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;

    const settle = () => {
      const container = containerRef.current;
      if (!container) return;
      const scrollRange = container.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) return;
      const containerTop = window.scrollY + container.getBoundingClientRect().top;
      const progress = (window.scrollY - containerTop) / scrollRange;
      if (progress < -0.05 || progress > 1.05) return; // outside the scrollytelling zone

      const nearest = SCENE_REST_POINTS.reduce((best, point) =>
        Math.abs(point - progress) < Math.abs(best - progress) ? point : best,
      );
      if (Math.abs(nearest - progress) < 0.02) return; // already settled

      window.scrollTo({ top: containerTop + nearest * scrollRange, behavior: "smooth" });
    };

    const onScroll = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(settle, 150);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      {SCENE_REST_POINTS.map((point) => (
        <div
          key={point}
          aria-hidden
          className="scene-snap-point absolute w-full h-screen pointer-events-none"
          style={{ top: `${(point * 200) / 3}%` }}
        />
      ))}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        <MediaLayer
          opacity={heroOpacity}
          videoSrc={heroVideoSrc}
          poster={HERO_POSTER}
          label="Hero video · 16:9 1920x1080 (desktop) / 9:16 1080x1920 (mobile)"
        />
        <MediaLayer
          opacity={processOpacity}
          videoSrc={processVideoSrc}
          poster={PROCESS_POSTER}
          label="Process video · 16:9 1920x1080 (desktop) / 9:16 1080x1920 (mobile)"
        />
        <motion.div style={{ opacity: galleryOpacity }} className="absolute inset-0 bg-ink" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 pointer-events-none" />

        {/* Scene 1: Hero text */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <Kicker label={t.scrollytelling.chapterLabel} index={1} />
          <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl tracking-tight">
            {t.hero.title}
          </h1>
          <div className="mt-6 max-w-xl rounded-xl border border-white/10 bg-black/40 backdrop-blur-md px-6 py-4">
            <p className="text-lg text-white/80">{t.hero.subtitle}</p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-6">
            <a
              href="#order"
              className="inline-block bg-accent text-black font-semibold px-6 py-3 rounded-md"
            >
              {t.hero.cta}
            </a>
            <button
              type="button"
              onClick={handleExploreClick}
              className="group flex items-center gap-3 text-white/80 text-sm font-semibold tracking-wide uppercase"
            >
              <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center transition-colors group-hover:border-accent group-hover:text-accent">
                ↓
              </span>
              {t.scrollytelling.secondaryCta}
            </button>
          </div>
        </motion.div>

        {/* Scene 2: Process text */}
        <motion.div
          style={{ opacity: processOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
        >
          <Kicker label={t.scrollytelling.chapterLabel} index={2} />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 tracking-tight">
            {t.howItWorks.title}
          </h2>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl">
            {t.howItWorks.steps.map((step, index) => (
              <div
                key={step.title}
                className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6"
              >
                <span className="text-accent text-sm font-semibold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-white font-semibold mt-2">{step.title}</h3>
                <p className="text-white/70 text-sm mt-1">{step.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scene 3: Gallery text + photos */}
        <motion.div
          style={{ opacity: galleryOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
        >
          <Kicker label={t.scrollytelling.chapterLabel} index={3} />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 tracking-tight">
            {t.gallery.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
            {GALLERY_PHOTOS.map((src, index) => (
              <motion.div
                key={index}
                style={{ opacity: galleryItems[index] }}
                className="aspect-[4/5] rounded-lg overflow-hidden border border-white/10 bg-panel flex items-center justify-center"
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="w-full h-full object-cover" src={src} alt="" />
                ) : (
                  <span className="text-white/25 text-[10px] tracking-widest uppercase text-center px-2">
                    Photo {index + 1} · 4:5
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Persistent scene indicator */}
        <div className="absolute bottom-6 right-4 md:bottom-8 md:right-8 z-10 flex items-center gap-3 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md px-4 py-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === activeScene ? "bg-accent" : "bg-white/25"
                }`}
              />
            ))}
          </div>
          <div className="leading-tight">
            <div className="text-white/50 text-[10px] tracking-[0.2em] uppercase">
              {t.scrollytelling.chapterLabel} {String(activeScene + 1).padStart(2, "0")} / 03
            </div>
            <div className="text-white text-xs font-semibold">
              {t.scrollytelling.scenes[activeScene]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
