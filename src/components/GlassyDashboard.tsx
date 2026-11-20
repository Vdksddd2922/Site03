import React, { useState, useEffect, useRef } from "react";

export const GlassyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("drape");
  const [tensionValue, setTensionValue] = useState(78);
  const [luxIndex] = useState(94.2);
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frameId: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#b62b1a";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const midY = canvas.height / 2;
      for (let x = 0; x < canvas.width; x += 3) {
        const y = midY + Math.sin(x * 0.05 + t) * 16 * Math.cos(x * 0.02 + t * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 3) {
        const y = midY + Math.cos(x * 0.04 - t * 0.8) * 10;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      t += 0.04;
      frameId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section id="dashboard" className="py-28 px-6 lg:px-12 max-w-[1800px] mx-auto relative z-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 border-b border-white/10 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span className="text-xs uppercase tracking-[0.25em] text-white/50">
              SECTION 02 / REAL-TIME SUITE
            </span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-light font-editorial text-white uppercase">
            THE SPHERE LAB
          </h2>
        </div>
        <p className="max-w-md text-sm text-white/70 font-light leading-relaxed">
          Live generative telemetry: garment tensile stress, chromatic refraction index (#B62B1A), and acoustic resonance monitoring across our Paris and Milan ateliers.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-white/15 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-crimson-heat/30 border border-crimson-bright flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-crimson-bright animate-ping"></span>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-white">
                TELEMETRY HUB — STATION PARIS 07
              </h3>
              <p className="text-xs text-white/50 tracking-wider">
                ATELIER SYNC: LATENCY 12MS • 4K RENDER STREAM
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-black/40 p-1.5 rounded-full border border-white/10">
            {[
              { id: "drape", label: "DRAPE DYNAMICS" },
              { id: "chroma", label: "CHROMATIC SPECTRUM" },
              { id: "matrix", label: "MATERIAL MATRIX" },
              { id: "archive", label: "RUNWAY TELEMETRY" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-caption transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-black font-semibold shadow-lg"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {/* Card 1 */}
          <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] uppercase tracking-caption text-white/50">
                  FABRIC TENSILE STRESS
                </span>
                <span className="text-xs font-mono text-crimson-bright">ACTIVE</span>
              </div>
              <div className="text-4xl font-light tracking-tight font-editorial text-white mb-2">
                {tensionValue}<span className="text-lg text-white/40 font-sans ml-1">N/m²</span>
              </div>
              <p className="text-xs text-white/60 font-light leading-relaxed mb-6">
                Dynamic elasticity calculation for raw Mulberry silk chiffon under runway movement velocity.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs text-white/70">
                <span>Modulus Load</span>
                <span>{tensionValue}%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-crimson-heat h-full rounded-full transition-all duration-500"
                  style={{ width: `${tensionValue}%` }}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setTensionValue(Math.max(40, tensionValue - 5))}
                  className="ghost-pill !py-1 !px-3 text-[10px]"
                >
                  - CALIBRATE
                </button>
                <button
                  onClick={() => setTensionValue(Math.min(95, tensionValue + 5))}
                  className="ghost-pill !py-1 !px-3 text-[10px]"
                >
                  + STRAIN
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] uppercase tracking-caption text-white/50">
                  CHROMATIC RESONANCE
                </span>
                <span className="text-xs font-mono text-white/80">#B62B1A</span>
              </div>
              <div className="text-4xl font-light tracking-tight font-editorial text-white mb-2">
                {luxIndex}<span className="text-lg text-white/40 font-sans ml-1">nm</span>
              </div>
              <p className="text-xs text-white/60 font-light leading-relaxed mb-4">
                Single-source directional crimson spectrum. Deep crushed blacks without digital noise clipping.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-4 gap-1.5 h-6">
                <div className="bg-black-void rounded border border-white/20"></div>
                <div className="bg-[#4a0b05] rounded"></div>
                <div className="bg-crimson-heat rounded shadow-[0_0_12px_rgba(182,43,26,0.5)]"></div>
                <div className="bg-[#ff4d36] rounded"></div>
              </div>
              <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest pt-1">
                <span>VOID (0K)</span>
                <span>CRIMSON (680NM)</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] uppercase tracking-caption text-white/50">
                  ACOUSTIC WAVEFORM
                </span>
                <span className="text-xs font-mono text-crimson-bright">55.0 HZ</span>
              </div>
              <div className="text-4xl font-light tracking-tight font-editorial text-white mb-1">
                42.8<span className="text-lg text-white/40 font-sans ml-1">dB</span>
              </div>
              <p className="text-xs text-white/60 font-light mb-3">
                Sub-bass harmonic resonance from runway sound installation.
              </p>
            </div>

            <div className="w-full h-20 bg-black/60 rounded-lg p-1 border border-white/10 flex items-center justify-center overflow-hidden">
              <canvas
                ref={waveformCanvasRef}
                width={260}
                height={70}
                className="w-full h-full block"
              />
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] uppercase tracking-caption text-white/50">
                  ARCHIVE SPECIFICATION
                </span>
                <span className="text-xs font-mono text-white/80">EDITION 04</span>
              </div>
              <div className="text-2xl font-light tracking-tight font-editorial text-white mb-2 uppercase">
                OBSIDIAN & LIQUID CHROME
              </div>
              <p className="text-xs text-white/60 font-light leading-relaxed mb-4">
                Tailored silhouettes with laser-cut edges and 100% bio-regenerative cashmere.
              </p>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-white/70">
                <span className="text-white/40">WEIGHT:</span>
                <span>420 GSM CREPE</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span className="text-white/40">PRODUCTION:</span>
                <span>12 NUMBERED PIECES</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span className="text-white/40">STATUS:</span>
                <span className="text-crimson-bright font-medium">PRIVATE CLIENT ONLY</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-white/50 gap-4">
          <div className="flex items-center gap-6">
            <span>SYSTEM STATUS: OPTIMAL</span>
            <span>COMPOSITE ENGINE: GPU ACCELERATED</span>
            <span>ZERO DRIFT COMPLIANCE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-white/80 font-mono">PARIS • GMT+1 19:42:10</span>
          </div>
        </div>
      </div>
    </section>
  );
};
