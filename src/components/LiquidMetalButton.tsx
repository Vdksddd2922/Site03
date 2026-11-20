import React, { useState, useMemo, useRef } from "react";
import { LiquidMetalCanvas } from "./LiquidMetalCanvas";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
  className?: string;
}

export const LiquidMetalButton: React.FC<LiquidMetalButtonProps> = ({
  label = "EXPLORE CAPSULE",
  onClick,
  viewMode = "text",
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const dimensions = useMemo(() => {
    if (viewMode === "icon") {
      return { width: 50, height: 50, innerWidth: 46, innerHeight: 46 };
    }
    return { width: 172, height: 48, innerWidth: 168, innerHeight: 44 };
  }, [viewMode]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = { x, y, id: rippleId.current++ };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }
    onClick?.();
  };

  return (
    <div className={`relative inline-block select-none ${className}`} style={{ perspective: "1000px" }}>
      <div
        style={{
          position: "relative",
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          transformStyle: "preserve-3d",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: isPressed ? "scale(0.97)" : isHovered ? "scale(1.03)" : "none",
        }}
      >
        {/* Label Surface */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transformStyle: "preserve-3d",
            transform: "translateZ(25px)",
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
          <span
            style={{
              fontSize: "12px",
              color: "#ffffff",
              fontWeight: 500,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              textShadow: "0px 1px 3px rgba(0, 0, 0, 0.8)",
            }}
          >
            {label}
          </span>
        </div>

        {/* Cushion Rim */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "translateZ(12px)",
            zIndex: 20,
            borderRadius: "70px",
            padding: "2px",
            background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.8) 100%)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "70px",
              background: "#080808",
              boxShadow: isPressed
                ? "inset 0px 2px 4px rgba(0,0,0,0.8)"
                : "inset 0px 1px 2px rgba(255,255,255,0.15)",
            }}
          />
        </div>

        {/* Liquid Metal WebGL Shader */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "70px",
            overflow: "hidden",
            transform: "translateZ(0px)",
            zIndex: 10,
            boxShadow: isHovered
              ? "0px 0px 0px 1px rgba(255, 255, 255, 0.4), 0px 16px 32px rgba(182, 43, 26, 0.35)"
              : "0px 0px 0px 1px rgba(255, 255, 255, 0.2), 0px 10px 24px rgba(0, 0, 0, 0.6)",
            transition: "box-shadow 0.4s ease",
          }}
        >
          <LiquidMetalCanvas isHovered={isHovered} isPressed={isPressed} />
        </div>

        {/* Click Target */}
        <button
          ref={buttonRef}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsPressed(false);
          }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          className="absolute inset-0 w-full h-full bg-transparent border-none outline-none cursor-pointer rounded-full overflow-hidden"
          style={{ zIndex: 40, transform: "translateZ(30px)" }}
          aria-label={label}
        >
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              style={{
                position: "absolute",
                left: `${ripple.x}px`,
                top: `${ripple.y}px`,
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(182, 43, 26, 0) 70%)",
                pointerEvents: "none",
                animation: "ripple-pulse 0.6s ease-out forwards",
              }}
            />
          ))}
        </button>
      </div>
    </div>
  );
};
