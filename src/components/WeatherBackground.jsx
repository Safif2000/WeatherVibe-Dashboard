import React, { useMemo } from "react";

function RainAnimation() {
  const drops = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      height: `${12 + Math.random() * 20}px`,
      delay: `${Math.random() * 3}s`,
      duration: `${0.6 + Math.random() * 0.6}s`,
      opacity: 0.3 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <>
      {drops.map((d) => (
        <div
          key={d.id}
          className="rain-drop"
          style={{
            left: d.left,
            top: 0,
            height: d.height,
            animationDuration: d.duration,
            animationDelay: d.delay,
            opacity: d.opacity,
          }}
        />
      ))}
    </>
  );
}

function SnowAnimation() {
  const flakes = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${3 + Math.random() * 5}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
      opacity: 0.4 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <>
      {flakes.map((f) => (
        <div
          key={f.id}
          className="snow-flake"
          style={{
            left: f.left,
            top: 0,
            width: f.size,
            height: f.size,
            animationDuration: f.duration,
            animationDelay: f.delay,
            opacity: f.opacity,
          }}
        />
      ))}
    </>
  );
}

function StarsAnimation() {
  const stars = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 70}%`,
      size: `${1 + Math.random() * 2.5}px`,
      delay: `${Math.random() * 4}s`,
      duration: `${1.5 + Math.random() * 2.5}s`,
    }));
  }, []);

  return (
    <>
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDuration: s.duration,
            animationDelay: s.delay,
          }}
        />
      ))}
    </>
  );
}

function SunAnimation() {
  return (
    <>
      <div
        className="sun-glow absolute"
        style={{
          right: "8%",
          top: "6%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,220,80,0.28) 0%, rgba(255,180,30,0.08) 60%, transparent 100%)",
          filter: "blur(8px)",
        }}
      />
      <div
        className="sun-glow absolute"
        style={{
          right: "10%",
          top: "8%",
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,240,160,0.22) 0%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />
    </>
  );
}

export default function WeatherBackground({ animation }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {animation === "rain" && <RainAnimation />}
      {animation === "snow" && <SnowAnimation />}
      {animation === "stars" && <StarsAnimation />}
      {animation === "sun" && <SunAnimation />}
    </div>
  );
}
