import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LiquidMetalButton } from "./LiquidMetalButton";

gsap.registerPlugin(ScrollTrigger);

interface ResponsiveHeroBannerProps {
  onExplore?: () => void;
  onReserve?: () => void;
}

export const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
  onExplore,
  onReserve,
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(bgImgRef.current, {
        scale: 1.18,
        duration: 2.4,
        ease: "expo.out",
      }, 0)
      .from(".hero-badge", {
        y: -20,
        opacity: 0,
        duration: 1.2,
      }, 0.4)
      .from(".hero-split-char", {
        y: 80,
        opacity: 0,
        filter: "blur(12px)",
        stagger: 0.02,
        duration: 1.4,
        ease: "power3.out",
      }, 0.6)
      .from(".hero-desc", {
        y: 25,
        opacity: 0,
        duration: 1.2,
      }, 1.2)
      .from(".hero-actions", {
        y: 20,
        opacity: 0,
        duration: 1.0,
      }, 1.4)
      .from(".hero-partners", {
        opacity: 0,
        y: 20,
        duration: 1.2,
      }, 1.6);

      gsap.to(bgImgRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const splitLetters = (text: string) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="hero-split-char inline-block"
        style={{ whiteSpace: char === " " ? "pre" : "normal" }}
      >
        {char}
      </span>
    ));
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden pt-28 pb-12 isolate bg-black"
    >
      {/* Full-bleed Editorial Photographic Canvas */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
        <img
          ref={bgImgRef}
          src="assets/hero-silhouette.svg"
          alt="21 TSI Editorial Crimson Silhouette"
          className="w-full h-full object-cover object-center scale-105 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70 pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full flex-1 flex flex-col justify-center text-center items-center z-10 pt-12">
        <div className="hero-badge mb-8 inline-flex items-center gap-3 rounded-full bg-white/5 border border-white/15 px-4 py-1.5 backdrop-blur-xl">
          <span className="inline-flex items-center text-[11px] font-semibold tracking-wider text-black bg-white rounded-full py-0.5 px-2.5 font-sans">
            CAPSULE 04
          </span>
          <span className="text-xs font-light tracking-caption text-white/90 uppercase font-sans">
            Autumn-Winter 2026 / Paris Haute Couture Week
          </span>
        </div>

        <h1 className="text-white font-editorial font-light tracking-tighter text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.98] max-w-6xl mx-auto uppercase">
          <div className="overflow-hidden pb-1">
            {splitLetters("SILHOUETTES IN CRIMSON")}
          </div>
          <div className="overflow-hidden text-white/90">
            {splitLetters("THE ARCHITECTURE OF SILENCE")}
          </div>
        </h1>

        <p className="hero-desc text-white/80 font-light text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-8 leading-relaxed tracking-body">
          Where high-fashion editorial dissolves into atmosphere. 
          Austere monochrome silhouettes carved against single-source crimson heat. 
          Pure geometric restraint engineered for the runway of tomorrow.
        </p>

        <div className="hero-actions flex flex-col sm:flex-row gap-5 mt-10 items-center justify-center">
          <LiquidMetalButton
            label="EXPLORE CAPSULE"
            onClick={onReserve}
          />
          <button
            onClick={onExplore}
            className="ghost-pill hover:scale-105"
          >
            <span>VIEW ATELIER ARCHIVE</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Press Bar */}
      <div className="hero-partners max-w-6xl mx-auto w-full px-6 pt-12 z-10 border-t border-white/10 mt-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 text-center mb-6">
          RECOGNIZED BY INTERNATIONAL EDITORIAL INSTITUTIONS
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 items-center justify-center text-center opacity-70">
          <span className="text-xs tracking-[0.25em] text-white/80 hover:text-white font-editorial uppercase">
            VOGUE PARIS
          </span>
          <span className="text-xs tracking-[0.25em] text-white/80 hover:text-white font-editorial uppercase">
            BUSINESS OF FASHION
          </span>
          <span className="text-xs tracking-[0.25em] text-white/80 hover:text-white font-editorial uppercase">
            DAZED DIGITAL
          </span>
          <span className="text-xs tracking-[0.25em] text-white/80 hover:text-white font-editorial uppercase">
            NUMÉRO HOMME
          </span>
          <span className="text-xs tracking-[0.25em] text-white/80 hover:text-white font-editorial uppercase">
            AWWWARDS SOTD
          </span>
        </div>
      </div>
    </section>
  );
};
