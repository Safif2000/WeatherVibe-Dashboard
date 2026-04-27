// ─── Weather → UI Theme mapper ────────────────────────────────────────────────

export function getWeatherTheme(conditionCode, isDay) {
  const night = !isDay;

  if (!conditionCode) {
    return night ? themes.clearNight : themes.clearDay;
  }

  // Thunder
  if (conditionCode >= 1273) return night ? themes.thunderNight : themes.thunder;
  // Snow / Blizzard
  if (conditionCode >= 1210 && conditionCode <= 1264) return themes.snow;
  // Heavy Rain / Freezing Rain
  if (conditionCode >= 1192 && conditionCode <= 1207) return night ? themes.rainNight : themes.rain;
  // Rain / Drizzle
  if (conditionCode >= 1063 && conditionCode <= 1171) return night ? themes.rainNight : themes.rain;
  // Fog / Mist
  if (conditionCode >= 1030 && conditionCode <= 1147) return themes.fog;
  // Cloudy
  if (conditionCode >= 1006 && conditionCode <= 1009) return night ? themes.cloudyNight : themes.cloudy;
  // Partly cloudy
  if (conditionCode === 1003) return night ? themes.partlyCloudyNight : themes.partlyCloudy;
  // Clear / Sunny
  if (conditionCode === 1000) return night ? themes.clearNight : themes.clearDay;

  return night ? themes.clearNight : themes.clearDay;
}

export function getWeatherEmoji(code, isDay = 1) {
  if (!code) return isDay ? "☀️" : "🌙";
  if (code === 1000) return isDay ? "☀️" : "🌙";
  if (code === 1003) return isDay ? "⛅" : "🌛";
  if (code <= 1009) return "☁️";
  if (code <= 1030) return "🌫️";
  if (code <= 1063) return "🌦️";
  if (code <= 1117) return "🌨️";
  if (code <= 1147) return "🌁";
  if (code <= 1201) return "🌧️";
  if (code <= 1225) return "❄️";
  if (code <= 1237) return "🌨️";
  if (code <= 1282) return "⛈️";
  return "⛅";
}

const themes = {
  clearDay: {
    id: "clearDay",
    bg: "linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #0652DD 100%)",
    sidebarBg: "linear-gradient(165deg, #5bc8f5 0%, #1a8cd8 40%, #0e72c4 100%)",
    mainBg: "linear-gradient(180deg, #dff0ff 0%, #eaf5ff 100%)",
    cardBg: "rgba(255,255,255,0.75)",
    cardBorder: "rgba(255,255,255,0.9)",
    cardGlow: "0 4px 24px rgba(14,114,196,0.10)",
    accent: "#0984e3",
    textPrimary: "#1a2a4a",
    textSecondary: "#4a6080",
    animation: "sun",
    chartColor: "#0984e3",
    gradStop1: "rgba(9,132,227,0.4)",
    gradStop2: "rgba(9,132,227,0.02)",
    forecastBg: "rgba(255,255,255,0.5)",
  },
  clearNight: {
    id: "clearNight",
    bg: "linear-gradient(135deg, #0f3460 0%, #16213e 55%, #0a0a1a 100%)",
    sidebarBg: "linear-gradient(165deg, #1a3a6a 0%, #102040 50%, #080818 100%)",
    mainBg: "linear-gradient(180deg, #101830 0%, #0d1520 100%)",
    cardBg: "rgba(20,40,80,0.55)",
    cardBorder: "rgba(100,160,255,0.15)",
    cardGlow: "0 4px 24px rgba(0,0,0,0.4)",
    accent: "#4ecdc4",
    textPrimary: "#e0eeff",
    textSecondary: "#8aaccc",
    animation: "stars",
    chartColor: "#4ecdc4",
    gradStop1: "rgba(78,205,196,0.3)",
    gradStop2: "rgba(78,205,196,0.02)",
    forecastBg: "rgba(30,60,110,0.45)",
  },
  partlyCloudy: {
    id: "partlyCloudy",
    bg: "linear-gradient(135deg, #b8d4f0 0%, #7eb8e8 50%, #4a9fd4 100%)",
    sidebarBg: "linear-gradient(165deg, #82b8d8 0%, #5090c0 45%, #3878ae 100%)",
    mainBg: "linear-gradient(180deg, #e8f2fc 0%, #f0f6ff 100%)",
    cardBg: "rgba(255,255,255,0.72)",
    cardBorder: "rgba(255,255,255,0.85)",
    cardGlow: "0 4px 20px rgba(74,159,212,0.12)",
    accent: "#4a9fd4",
    textPrimary: "#1e3350",
    textSecondary: "#4e7090",
    animation: "clouds",
    chartColor: "#4a9fd4",
    gradStop1: "rgba(74,159,212,0.35)",
    gradStop2: "rgba(74,159,212,0.02)",
    forecastBg: "rgba(255,255,255,0.45)",
  },
  partlyCloudyNight: {
    id: "partlyCloudyNight",
    bg: "linear-gradient(135deg, #1c2c4c 0%, #141e34 55%, #0a1020 100%)",
    sidebarBg: "linear-gradient(165deg, #243050 0%, #16202e 50%, #0a0e18 100%)",
    mainBg: "linear-gradient(180deg, #131c2c 0%, #0e1520 100%)",
    cardBg: "rgba(20,36,68,0.55)",
    cardBorder: "rgba(80,120,200,0.15)",
    cardGlow: "0 4px 24px rgba(0,0,0,0.35)",
    accent: "#7ecce8",
    textPrimary: "#c8dcf4",
    textSecondary: "#7898b8",
    animation: "stars",
    chartColor: "#7ecce8",
    gradStop1: "rgba(126,204,232,0.3)",
    gradStop2: "rgba(126,204,232,0.02)",
    forecastBg: "rgba(28,50,90,0.40)",
  },
  cloudy: {
    id: "cloudy",
    bg: "linear-gradient(135deg, #b0bec5 0%, #78909c 50%, #546e7a 100%)",
    sidebarBg: "linear-gradient(165deg, #8faab8 0%, #60828e 45%, #4a6870 100%)",
    mainBg: "linear-gradient(180deg, #e8ecf0 0%, #f0f2f5 100%)",
    cardBg: "rgba(255,255,255,0.68)",
    cardBorder: "rgba(255,255,255,0.80)",
    cardGlow: "0 4px 20px rgba(84,110,122,0.10)",
    accent: "#546e7a",
    textPrimary: "#263238",
    textSecondary: "#546e7a",
    animation: "clouds",
    chartColor: "#546e7a",
    gradStop1: "rgba(84,110,122,0.35)",
    gradStop2: "rgba(84,110,122,0.02)",
    forecastBg: "rgba(255,255,255,0.45)",
  },
  cloudyNight: {
    id: "cloudyNight",
    bg: "linear-gradient(135deg, #263238 0%, #1c2b30 55%, #101820 100%)",
    sidebarBg: "linear-gradient(165deg, #2e3e44 0%, #1a2830 50%, #0e181e 100%)",
    mainBg: "linear-gradient(180deg, #182028 0%, #121820 100%)",
    cardBg: "rgba(25,40,50,0.55)",
    cardBorder: "rgba(80,120,140,0.18)",
    cardGlow: "0 4px 24px rgba(0,0,0,0.4)",
    accent: "#80cbc4",
    textPrimary: "#ccdce0",
    textSecondary: "#7898a0",
    animation: "none",
    chartColor: "#80cbc4",
    gradStop1: "rgba(128,203,196,0.3)",
    gradStop2: "rgba(128,203,196,0.02)",
    forecastBg: "rgba(30,50,60,0.45)",
  },
  rain: {
    id: "rain",
    bg: "linear-gradient(135deg, #2c3e6e 0%, #1a2c5c 50%, #0f1e44 100%)",
    sidebarBg: "linear-gradient(165deg, #2e4470 0%, #1c3260 45%, #0e2050 100%)",
    mainBg: "linear-gradient(180deg, #1a2840 0%, #1e2e48 100%)",
    cardBg: "rgba(18,30,60,0.60)",
    cardBorder: "rgba(80,120,200,0.20)",
    cardGlow: "0 4px 24px rgba(0,0,0,0.40)",
    accent: "#64b5f6",
    textPrimary: "#c8deff",
    textSecondary: "#7898c0",
    animation: "rain",
    chartColor: "#64b5f6",
    gradStop1: "rgba(100,181,246,0.35)",
    gradStop2: "rgba(100,181,246,0.02)",
    forecastBg: "rgba(25,45,80,0.50)",
  },
  rainNight: {
    id: "rainNight",
    bg: "linear-gradient(135deg, #0d1b2a 0%, #091520 55%, #040d15 100%)",
    sidebarBg: "linear-gradient(165deg, #102030 0%, #081820 50%, #040c14 100%)",
    mainBg: "linear-gradient(180deg, #0c1820 0%, #081018 100%)",
    cardBg: "rgba(10,22,35,0.65)",
    cardBorder: "rgba(60,100,160,0.20)",
    cardGlow: "0 4px 24px rgba(0,0,0,0.50)",
    accent: "#4fc3f7",
    textPrimary: "#b0ccee",
    textSecondary: "#607888",
    animation: "rain",
    chartColor: "#4fc3f7",
    gradStop1: "rgba(79,195,247,0.30)",
    gradStop2: "rgba(79,195,247,0.02)",
    forecastBg: "rgba(15,28,44,0.55)",
  },
  snow: {
    id: "snow",
    bg: "linear-gradient(135deg, #c5d8f0 0%, #a0c0e0 50%, #80a8d8 100%)",
    sidebarBg: "linear-gradient(165deg, #b8d4ee 0%, #90b8de 45%, #70a0cc 100%)",
    mainBg: "linear-gradient(180deg, #eaf2fa 0%, #f4f8fc 100%)",
    cardBg: "rgba(255,255,255,0.72)",
    cardBorder: "rgba(255,255,255,0.90)",
    cardGlow: "0 4px 20px rgba(128,168,216,0.15)",
    accent: "#90b8de",
    textPrimary: "#1c2e44",
    textSecondary: "#4e7090",
    animation: "snow",
    chartColor: "#90b8de",
    gradStop1: "rgba(144,184,222,0.40)",
    gradStop2: "rgba(144,184,222,0.02)",
    forecastBg: "rgba(255,255,255,0.55)",
  },
  thunder: {
    id: "thunder",
    bg: "linear-gradient(135deg, #2d1b4e 0%, #1a0e30 55%, #0d0820 100%)",
    sidebarBg: "linear-gradient(165deg, #321c54 0%, #1e1038 50%, #0e0820 100%)",
    mainBg: "linear-gradient(180deg, #1a1030 0%, #140c24 100%)",
    cardBg: "rgba(30,16,56,0.60)",
    cardBorder: "rgba(160,80,255,0.18)",
    cardGlow: "0 4px 24px rgba(0,0,0,0.45)",
    accent: "#ce93d8",
    textPrimary: "#e8d0f8",
    textSecondary: "#9878b8",
    animation: "rain",
    chartColor: "#ce93d8",
    gradStop1: "rgba(206,147,216,0.35)",
    gradStop2: "rgba(206,147,216,0.02)",
    forecastBg: "rgba(38,18,68,0.50)",
  },
  thunderNight: {
    id: "thunderNight",
    bg: "linear-gradient(135deg, #0f0a1e 0%, #08061a 55%, #030210 100%)",
    sidebarBg: "linear-gradient(165deg, #140e26 0%, #0c081e 50%, #060410 100%)",
    mainBg: "linear-gradient(180deg, #0a0816 0%, #06040e 100%)",
    cardBg: "rgba(14,10,30,0.65)",
    cardBorder: "rgba(120,60,200,0.20)",
    cardGlow: "0 4px 24px rgba(0,0,0,0.55)",
    accent: "#ba68c8",
    textPrimary: "#d8b8f0",
    textSecondary: "#8058a8",
    animation: "rain",
    chartColor: "#ba68c8",
    gradStop1: "rgba(186,104,200,0.30)",
    gradStop2: "rgba(186,104,200,0.02)",
    forecastBg: "rgba(20,12,40,0.55)",
  },
  fog: {
    id: "fog",
    bg: "linear-gradient(135deg, #c8ccd8 0%, #a0a8b8 50%, #808898 100%)",
    sidebarBg: "linear-gradient(165deg, #b8c0cc 0%, #9098a8 45%, #707888 100%)",
    mainBg: "linear-gradient(180deg, #e0e4ec 0%, #e8ecf4 100%)",
    cardBg: "rgba(255,255,255,0.65)",
    cardBorder: "rgba(255,255,255,0.80)",
    cardGlow: "0 4px 20px rgba(128,136,152,0.12)",
    accent: "#808898",
    textPrimary: "#2c3040",
    textSecondary: "#6070808",
    animation: "none",
    chartColor: "#808898",
    gradStop1: "rgba(128,136,152,0.35)",
    gradStop2: "rgba(128,136,152,0.02)",
    forecastBg: "rgba(255,255,255,0.45)",
  },
};

export default themes;
