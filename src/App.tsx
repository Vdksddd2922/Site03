import React, { useState } from "react";
import { ResponsiveHeroBanner } from "./components/ResponsiveHeroBanner";
import { GlassyDashboard } from "./components/GlassyDashboard";

export const App: React.FC = () => {
  const [soundActive, setSoundActive] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-[#b62b1a] selection:text-white">
      {/* Top Hairline Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md">
        <div className="h-[1px] bg-white/20 w-full" />
        <div className="max-w-[1840px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="font-semibold text-sm tracking-wider">21</span>
            <span className="w-[1px] h-3.5 bg-white/60"></span>
            <span className="font-light text-sm tracking-[0.2em] text-white/90">TSI</span>
          </div>

          <nav className="hidden lg:flex items-center gap-10 text-xs uppercase tracking-[0.6px] text-white/80">
            <a href="#hero" className="hover:text-white transition-colors">01 The Sphere Lab</a>
            <a href="#dashboard" className="hover:text-white transition-colors">02 Telemetry Suite</a>
            <a href="#manifesto" className="hover:text-white transition-colors">03 The Manifesto</a>
            <a href="#lookbook" className="hover:text-white transition-colors">04 Capsule 04</a>
            <a href="#atelier" className="hover:text-white transition-colors">05 Paris Atelier</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundActive(!soundActive)}
              className="rounded-full border border-white/80 px-4 py-1.5 text-[11px] uppercase tracking-wider text-white hover:bg-white/10"
            >
              SOUND {soundActive ? "ON" : "OFF"}
            </button>
            <a
              href="#atelier"
              className="hidden sm:inline-flex rounded-full border border-white/80 px-4 py-1.5 text-[11px] uppercase tracking-wider text-white hover:bg-white/10 items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              CONTACT
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <ResponsiveHeroBanner
        onExplore={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })}
        onReserve={() => document.getElementById("lookbook")?.scrollIntoView({ behavior: "smooth" })}
      />

      {/* Glassy Dashboard Section */}
      <GlassyDashboard />
    </div>
  );
};

export default App;
