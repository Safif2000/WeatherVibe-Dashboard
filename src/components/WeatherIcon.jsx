import React from "react";
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Wind,
  CloudFog,
} from "lucide-react";

/**
 * Maps WeatherAPI condition codes to lucide-react icons.
 * Returns a styled React element — no emojis.
 *
 * @param {number} code  - WeatherAPI condition code
 * @param {number} isDay - 1 = day, 0 = night
 * @param {number} size  - icon size in px (default 22)
 * @param {string} color - override color (optional)
 */
export default function WeatherIcon({ code, isDay = 1, size = 22, color, className = "" }) {
  const props = {
    size,
    className,
    strokeWidth: 1.8,
    style: color ? { color } : undefined,
  };

  if (!code) {
    return isDay
      ? <Sun {...props} style={{ color: color || "#F59E0B" }} />
      : <Moon {...props} style={{ color: color || "#94A3B8" }} />;
  }

  // ── Clear ──────────────────────────────────────────────────────────────────
  if (code === 1000) {
    return isDay
      ? <Sun      {...props} style={{ color: color || "#F59E0B" }} />
      : <Moon     {...props} style={{ color: color || "#94A3B8" }} />;
  }

  // ── Partly cloudy ─────────────────────────────────────────────────────────
  if (code === 1003) {
    return isDay
      ? <CloudSun  {...props} style={{ color: color || "#FBBF24" }} />
      : <CloudMoon {...props} style={{ color: color || "#7EA8C4" }} />;
  }

  // ── Cloudy / Overcast ─────────────────────────────────────────────────────
  if (code <= 1009) {
    return <Cloud {...props} style={{ color: color || "#94A3B8" }} />;
  }

  // ── Mist / Fog / Freezing fog ─────────────────────────────────────────────
  if (code <= 1030 || (code >= 1135 && code <= 1147)) {
    return <CloudFog {...props} style={{ color: color || "#9EAAB8" }} />;
  }

  // ── Drizzle / Light rain ──────────────────────────────────────────────────
  if (code >= 1063 && code <= 1072) {
    return <CloudDrizzle {...props} style={{ color: color || "#60A5FA" }} />;
  }

  // ── Snow / Sleet / Ice ────────────────────────────────────────────────────
  if ((code >= 1114 && code <= 1117) || (code >= 1204 && code <= 1237) || (code >= 1255 && code <= 1264)) {
    return <CloudSnow {...props} style={{ color: color || "#BAE6FD" }} />;
  }

  // ── Rain / Heavy rain / Freezing rain ─────────────────────────────────────
  if ((code >= 1150 && code <= 1201) || (code >= 1240 && code <= 1252)) {
    return <CloudRain {...props} style={{ color: color || "#3B82F6" }} />;
  }

  // ── Thunder ───────────────────────────────────────────────────────────────
  if (code >= 1273) {
    return <CloudLightning {...props} style={{ color: color || "#A78BFA" }} />;
  }

  // ── Blizzard / Heavy snow ─────────────────────────────────────────────────
  if (code >= 1210 && code <= 1264) {
    return <CloudSnow {...props} style={{ color: color || "#BAE6FD" }} />;
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return isDay
    ? <CloudSun {...props} style={{ color: color || "#FBBF24" }} />
    : <CloudMoon {...props} style={{ color: color || "#7EA8C4" }} />;
}
