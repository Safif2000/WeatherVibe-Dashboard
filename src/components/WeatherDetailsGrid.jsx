import React from "react";
import { Droplets, Wind, CloudRain, Sun, Thermometer, Eye, Gauge } from "lucide-react";

const GlassCard = ({ children, className = "", style = {}, theme }) => {
  const isNight = theme?.id?.includes("Night") || theme?.id?.includes("rain") || theme?.id?.includes("thunder");
  return (
    <div
      className={`glass-card card-hover p-5 ${className}`}
      style={{
        background: theme?.cardBg || (isNight ? "rgba(20,40,80,0.55)" : "rgba(255,255,255,0.72)"),
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${theme?.cardBorder || (isNight ? "rgba(100,160,255,0.15)" : "rgba(255,255,255,0.50)")}`,
        boxShadow: theme?.cardGlow || "0 20px 50px rgba(100,150,255,0.1)",
        borderRadius: "2.5rem",
        ...style,
      }}>
      {children}
    </div>
  );
};

const IconBadge = ({ children, bg }) => (
  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
    style={{ background: bg || "rgba(15,23,42,0.06)" }}>
    {children}
  </div>
);

const Bar = ({ pct, gradient }) => (
  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(15,23,42,0.08)" }}>
    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: gradient, transition: "width 0.7s ease" }} />
  </div>
);

const HumidityCard = ({ value = 70, theme }) => {
  const v = Math.min(Math.max(value, 0), 100);
  const label = v < 40 ? "Low" : v < 70 ? "Normal" : "High";
  const textPrim = theme?.textPrimary || "#1a2a4a";
  const textSec = theme?.textSecondary || "#4a6080";
  return (
    <GlassCard theme={theme}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-sm" style={{ color: textSec }}>Humidity</span>
        <IconBadge bg="rgba(56,189,248,0.16)">
          <Droplets className="w-5 h-5 text-sky-500" />
        </IconBadge>
      </div>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-extrabold text-3xl font-mono-num" style={{ color: textPrim }}>{v}%</span>
        <span className="text-sm font-semibold" style={{ color: textSec }}>{label}</span>
      </div>
      <Bar pct={v} gradient="linear-gradient(90deg,#22C55E 0%,#F59E0B 55%,#EF4444 100%)" />
      <div className="flex justify-between mt-3 text-[10px] font-semibold" style={{ color: textSec }}>
        <span>Low</span>
        <span>Normal</span>
        <span>High</span>
      </div>
    </GlassCard>
  );
};

function WindCard({ speed = 8, dir = "NW", theme }) {
  const s   = Math.min(Math.max(speed, 0), 120);
  const pct = (s / 120) * 100;
  const textPrim = theme?.textPrimary || "#1a2a4a";
  const textSec  = theme?.textSecondary || "#4a6080";
  const accent   = theme?.accent || "#0984e3";
  const category = s < 20 ? "Calm" : s < 50 ? "Breezy" : s < 80 ? "Windy" : "Strong";
  return (
    <GlassCard theme={theme}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm" style={{ color: textSec }}>Wind</span>
        <IconBadge bg={`${accent}18`}>
          <Wind className="w-5 h-5" style={{ color: accent }} />
        </IconBadge>
      </div>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="font-extrabold text-3xl font-mono-num" style={{ color: textPrim }}>{s}</span>
        <span className="text-sm font-semibold" style={{ color: textSec }}>km/h</span>
        {dir && <span className="text-xs font-bold px-1.5 py-0.5 rounded-lg" style={{ background:`${accent}18`, color: accent }}>{dir}</span>}
      </div>
      <span className="text-xs font-semibold" style={{ color: textSec }}>{category}</span>
      <Bar pct={pct} gradient={`linear-gradient(90deg, ${accent} 0%, ${accent}88 100%)`} />
      <div className="flex justify-between mt-1.5">
        {["0","30","60","90","120"].map(t=>(
          <span key={t} className="text-[10px] font-semibold" style={{ color: textSec }}>{t}</span>
        ))}
      </div>
    </GlassCard>
  );
}

function PrecipitationCard({ value = 1.4, chance = 42, theme }) {
  const max = 50;
  const pct = Math.min((value / max) * 100, 100);
  const textPrim = theme?.textPrimary || "#1a2a4a";
  const textSec  = theme?.textSecondary || "#4a6080";
  const accent   = theme?.accent || "#0984e3";
  return (
    <GlassCard theme={theme}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm" style={{ color: textSec }}>Precipitation</span>
        <IconBadge bg={`${accent}18`}>
          <CloudRain className="w-5 h-5" style={{ color: accent }} />
        </IconBadge>
      </div>
      <div className="mb-1 flex items-baseline gap-2">
        <span className="font-extrabold text-3xl font-mono-num" style={{ color: textPrim }}>{Number(value).toFixed(1)}</span>
        <span className="text-sm font-semibold" style={{ color: textSec }}>mm</span>
      </div>
      <div className="text-xs font-semibold mb-2.5" style={{ color: accent }}>{chance}% chance of rain</div>
      <Bar pct={pct} gradient={`linear-gradient(90deg,${accent}55,${accent})`} />
    </GlassCard>
  );
}

function UVIndexCard({ value = 4, theme }) {
  const segs = [
    { label:"1-2",  color:"#22C55E", max:2  },
    { label:"3-5",  color:"#84CC16", max:5  },
    { label:"6-7",  color:"#F59E0B", max:7  },
    { label:"8-10", color:"#F97316", max:10 },
    { label:"11+",  color:"#EF4444", max:20 },
  ];
  const activeIdx  = segs.findIndex(s => value <= s.max);
  const levelNames = ["Low","Moderate","High","Very High","Extreme"];
  const active     = activeIdx === -1 ? 4 : activeIdx;
  const textPrim   = theme?.textPrimary || "#1a2a4a";
  const textSec    = theme?.textSecondary || "#4a6080";
  const isNight    = theme?.id?.includes("Night") || theme?.id?.includes("rain") || theme?.id?.includes("thunder");
  const trackColor = isNight ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)";
  return (
    <GlassCard theme={theme}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm" style={{ color: textSec }}>UV Index</span>
        <IconBadge bg="#F59E0B18">
          <Sun className="w-5 h-5 text-amber-500" />
        </IconBadge>
      </div>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="font-extrabold text-3xl font-mono-num" style={{ color: textPrim }}>{value}</span>
        <span className="text-sm font-semibold" style={{ color: segs[active]?.color || textSec }}>{levelNames[active]}</span>
      </div>
      <div className="flex gap-1">
        {segs.map((s, i) => (
          <div key={i} className="flex-1 h-2 rounded-full"
            style={{ background: i <= active ? s.color : trackColor, transition:"background 0.5s ease" }}/>
        ))}
      </div>
    </GlassCard>
  );
}

function FeelsLikeCard({ value = 30, unit = "C", theme }) {
  const min = unit === "C" ? -10 : 14;
  const max = unit === "C" ? 50 : 122;
  const pct = ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100;
  const textPrim = theme?.textPrimary || "#1a2a4a";
  const textSec  = theme?.textSecondary || "#4a6080";
  const isNight  = theme?.id?.includes("Night") || theme?.id?.includes("rain") || theme?.id?.includes("thunder");
  const trackColor = isNight ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)";
  return (
    <GlassCard theme={theme}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm" style={{ color: textSec }}>Feels like</span>
        <IconBadge bg="#EF444418">
          <Thermometer className="w-5 h-5 text-red-500" />
        </IconBadge>
      </div>
      <div className="mb-3">
        <span className="font-extrabold text-3xl font-mono-num" style={{ color: textPrim }}>{value}°{unit}</span>
      </div>
      <div className="relative h-2 rounded-full overflow-visible" style={{ background: trackColor }}>
        <div className="h-full rounded-full" style={{ width:`${pct}%`, background:"linear-gradient(90deg,#60A5FA,#FBBF24,#EF4444)", transition:"width 0.7s ease" }}/>
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-red-400 shadow"
          style={{ left:`calc(${pct}% - 6px)`, transition:"left 0.7s ease" }}/>
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] font-semibold" style={{ color: textSec }}>{min}°</span>
        <span className="text-[10px] font-semibold" style={{ color: textSec }}>{max}°</span>
      </div>
    </GlassCard>
  );
}

function VisibilityCard({ value = 10, theme }) {
  const max = 20;
  const pct = Math.min((value / max) * 100, 100);
  const label = value < 1 ? "Dense fog" : value < 4 ? "Foggy" : value < 8 ? "Hazy" : value < 15 ? "Clear" : "Excellent";
  const textPrim = theme?.textPrimary || "#1a2a4a";
  const textSec  = theme?.textSecondary || "#4a6080";
  return (
    <GlassCard theme={theme}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm" style={{ color: textSec }}>Visibility</span>
        <IconBadge bg="#8B5CF618">
          <Eye className="w-5 h-5 text-violet-500" />
        </IconBadge>
      </div>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="font-extrabold text-3xl font-mono-num" style={{ color: textPrim }}>{value}</span>
        <span className="text-sm font-semibold" style={{ color: textSec }}>km</span>
      </div>
      <span className="text-xs font-semibold mb-2.5 block" style={{ color: "#8B5CF6" }}>{label}</span>
      <Bar pct={pct} gradient="linear-gradient(90deg,#8B5CF688,#8B5CF6)" />
    </GlassCard>
  );
}

function PressureCard({ value = 1013, theme }) {
  const min = 950, max = 1060;
  const pct = Math.min(((value - min) / (max - min)) * 100, 100);
  const label = value < 1000 ? "Low" : value < 1020 ? "Normal" : "High";
  const textPrim = theme?.textPrimary || "#1a2a4a";
  const textSec  = theme?.textSecondary || "#4a6080";
  return (
    <GlassCard theme={theme}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm" style={{ color: textSec }}>Pressure</span>
        <IconBadge bg="#0891B218">
          <Gauge className="w-5 h-5 text-sky-600" />
        </IconBadge>
      </div>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="font-extrabold text-3xl font-mono-num" style={{ color: textPrim }}>{value}</span>
        <span className="text-sm font-semibold" style={{ color: textSec }}>hPa</span>
      </div>
      <span className="text-xs font-semibold mb-2.5 block" style={{ color: "#0891B2" }}>{label} pressure</span>
      <Bar pct={pct} gradient="linear-gradient(90deg,#0891B288,#0891B2)" />
    </GlassCard>
  );
}

export default function WeatherDetailsGrid({ weatherData, loading, theme, unit }) {
  const cur     = weatherData?.current;
  const foreDay = weatherData?.forecast?.[0]?.day;
  const textPrim = theme?.textPrimary || "#1a2a4a";
  const textSec  = theme?.textSecondary || "#4a6080";
  const isNight  = theme?.id?.includes("Night") || theme?.id?.includes("rain") || theme?.id?.includes("thunder");

  if (loading) {
    return (
      <div>
        <h2 className="font-bold text-base mb-4" style={{ color: textPrim }}>Today's Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array(6).fill(0).map((_,i) => (
            <div key={i} className="rounded-[20px] p-5 h-36" style={{background: theme?.cardBg || "rgba(255,255,255,0.75)", border:`1px solid ${theme?.cardBorder||"rgba(255,255,255,0.90)"}`}}>
              <div className={`w-24 h-3 rounded mb-3 ${isNight?"skeleton":"skeleton-light"}`}/>
              <div className={`w-16 h-8 rounded mb-4 ${isNight?"skeleton":"skeleton-light"}`}/>
              <div className={`w-full h-2 rounded-full ${isNight?"skeleton":"skeleton-light"}`}/>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const feelsVal = unit === "F" ? cur?.feelslike_f : cur?.feelslike_c;

  return (
    <div className="fade-up fade-up-3">
      <h2 className="font-bold text-base mb-4" style={{ color: textPrim }}>Today's Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <HumidityCard      value={cur?.humidity               ?? 70}  theme={theme}/>
        <WindCard          speed={Math.round(cur?.wind_kph     ?? 8)}  dir={cur?.wind_dir} theme={theme}/>
        <PrecipitationCard value={foreDay?.totalprecip_cm      ?? 1.4} chance={foreDay?.daily_chance_of_rain ?? 42} theme={theme}/>
        <UVIndexCard       value={Math.round(cur?.uv           ?? 4)}  theme={theme}/>
        <FeelsLikeCard     value={Math.round(feelsVal          ?? 30)} unit={unit || "C"} theme={theme}/>
        <VisibilityCard    value={cur?.vis_km                  ?? 10}  theme={theme}/>
        <PressureCard      value={cur?.pressure_mb             ?? 1013} theme={theme}/>
      </div>
    </div>
  );
}
