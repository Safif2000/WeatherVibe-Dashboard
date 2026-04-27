import { getTimeInTimezone } from "../utils/timeUtils";

export const API_KEY = "41e924b706264534ab3171908262702";

const BASE = "https://api.weatherapi.com/v1";

const cache = {};
const CACHE_TTL = 10 * 60 * 1000;

function getCached(key) {
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { delete cache[key]; return null; }
  return entry.data;
}
function setCache(key, data) {
  cache[key] = { ts: Date.now(), data };
}

function normalizeWeather(raw) {
  const loc = raw.location;
  const cur = raw.current;
  const forecast = raw.forecast?.forecastday || [];

  return {
    location: {
      name: loc.name,
      country: loc.country,
      region: loc.region,
      lat: loc.lat,
      lon: loc.lon,
      localtime: loc.localtime,
      localtime_epoch: loc.localtime_epoch,
      tz: loc.tz_id,
    },
    current: {
      temp_c: Math.round(cur.temp_c),
      temp_f: Math.round(cur.temp_f),
      feelslike_c: Math.round(cur.feelslike_c),
      feelslike_f: Math.round(cur.feelslike_f),
      humidity: cur.humidity,
      wind_kph: Math.round(cur.wind_kph),
      wind_mph: Math.round(cur.wind_mph),
      wind_dir: cur.wind_dir,
      uv: Math.round(cur.uv),
      vis_km: cur.vis_km,
      pressure_mb: cur.pressure_mb,
      is_day: cur.is_day,
      condition: {
        text: cur.condition.text,
        code: cur.condition.code,
        icon: cur.condition.icon,
      },
    },
    astro: forecast[0]?.astro || {},
    forecast: forecast.map((day) => ({
      date: day.date,
      astro: day.astro,
      day: {
        maxtemp_c: Math.round(day.day.maxtemp_c),
        mintemp_c: Math.round(day.day.mintemp_c),
        maxtemp_f: Math.round(day.day.maxtemp_f),
        mintemp_f: Math.round(day.day.mintemp_f),
        avghumidity: day.day.avghumidity,
        totalprecip_cm: day.day.totalprecip_in * 2.54,
        daily_chance_of_rain: day.day.daily_chance_of_rain,
        daily_chance_of_snow: day.day.daily_chance_of_snow,
        uv: day.day.uv,
        condition: day.day.condition,
      },
      hours: (day.hour || []).map((h) => ({
        time: h.time,
        time_epoch: h.time_epoch,
        temp_c: Math.round(h.temp_c),
        temp_f: Math.round(h.temp_f),
        humidity: h.humidity,
        is_day: h.is_day,
        chance_of_rain: h.chance_of_rain,
        wind_kph: Math.round(h.wind_kph),
        condition: h.condition,
      })),
    })),
    raw,
  };
}

export function getHourlySlots(normalized, count = 8) {
  if (!normalized?.forecast?.length) return [];
  const timezone = normalized.location?.tz;
  const now = getTimeInTimezone(timezone);
  const currentHour = parseInt(
    new Intl.DateTimeFormat("en-US", { hour: "2-digit", hour12: false, timeZone: timezone }).format(now),
    10
  );
  const todayHours = normalized.forecast[0]?.hours || [];
  const tomorrowHours = normalized.forecast[1]?.hours || [];
  const allHours = [...todayHours, ...tomorrowHours];

  const start = allHours.findIndex((h) => {
    const hDate = new Date(h.time_epoch * 1000);
    const hour = parseInt(
      new Intl.DateTimeFormat("en-US", { hour: "2-digit", hour12: false, timeZone: timezone }).format(hDate),
      10
    );
    return hour >= currentHour;
  });

  const slice = allHours.slice(Math.max(start, 0), Math.max(start, 0) + count);
  return slice.map((h, i) => ({
    label:
      i === 0
        ? "Now"
        : new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            hour12: true,
            timeZone: timezone,
          }).format(new Date(h.time_epoch * 1000)),
    temp_c: h.temp_c,
    temp_f: h.temp_f,
    humidity: h.humidity,
    chance_of_rain: h.chance_of_rain,
    wind_kph: h.wind_kph,
    conditionCode: h.condition?.code,
    conditionText: h.condition?.text,
    isDay: h.is_day,
  }));
}

export async function fetchWeather(query) {
  if (!query?.trim()) throw new Error("Please enter a city name.");
  if (!API_KEY || API_KEY === "YOUR_KEY")
    throw new Error("Add your WeatherAPI key in src/services/weatherService.js");

  const cacheKey = query.trim().toLowerCase();
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `${BASE}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
    query.trim()
  )}&days=7&aqi=no&alerts=no`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body?.error?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  const raw = await res.json();
  const normalized = normalizeWeather(raw);
  setCache(cacheKey, normalized);
  return normalized;
}
