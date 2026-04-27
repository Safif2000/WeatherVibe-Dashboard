import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronDown, ChevronUp, Droplets, Wind } from "lucide-react";
import WeatherIcon from "./WeatherIcon";

const DEFAULT = [
  { label:"Now",  temp_c:27, temp_f:81, humidity:52, chance_of_rain:20, wind_kph:12, conditionCode:1000, isDay:1 },
  { label:"1 PM", temp_c:28, temp_f:82, humidity:55, chance_of_rain:15, wind_kph:14, conditionCode:1003, isDay:1 },
  { label:"2 PM", temp_c:29, temp_f:84, humidity:58, chance_of_rain:30, wind_kph:10, conditionCode:1006, isDay:1 },
  { label:"3 PM", temp_c:30, temp_f:86, humidity:65, chance_of_rain:50, wind_kph:16, conditionCode:1063, isDay:1 },
  { label:"4 PM", temp_c:29, temp_f:84, humidity:70, chance_of_rain:40, wind_kph:13, conditionCode:1003, isDay:1 },
  { label:"5 PM", temp_c:28, temp_f:82, humidity:62, chance_of_rain:20, wind_kph:11, conditionCode:1000, isDay:1 },
  { label:"6 PM", temp_c:27, temp_f:81, humidity:58, chance_of_rain:10, wind_kph: 9, conditionCode:1000, isDay:0 },
  { label:"7 PM", temp_c:26, temp_f:79, humidity:55, chance_of_rain: 5, wind_kph: 8, conditionCode:1000, isDay:0 },
];

const CustomTooltip = ({ active, payload, label, metric, theme }) => {
  if (!active || !payload?.length) return null;
  const accent = theme?.accent || "#0984e3";
  const isNight = theme?.id?.includes("Night") || theme?.id?.includes("rain") || theme?.id?.includes("thunder");
  const unit = metric === "chance_of_rain" ? "%" : metric === "wind_kph" ? " km/h" : "%";
  return (
    <div className="rounded-xl px-3 py-2 shadow-xl text-xs font-bold"
      style={{ background: isNight ? "rgba(15,25,45,0.95)" : "rgba(255,255,255,0.97)", color: accent, border: `1px solid ${accent}30`, backdropFilter:"blur(8px)" }}>
      {label}: {payload[0].value}{unit}
    </div>
  );
};

export default function HourlyForecast({ hourlyData, forecastDays, loading, theme, unit }) {
  const data = hourlyData?.length ? hourlyData : DEFAULT;
  const [showForecast, setShowForecast] = useState(false);
  const [metric, setMetric] = useState("chance_of_rain");

  const isNight    = theme?.id?.includes("Night") || theme?.id?.includes("rain") || theme?.id?.includes("thunder");
  const cardBg     = theme?.cardBg     || "rgba(255,255,255,0.75)";
  const cardBorder = theme?.cardBorder || "rgba(255,255,255,0.90)";
  const cardGlow   = theme?.cardGlow   || "0 4px 24px rgba(14,114,196,0.10)";
  const textPrim   = theme?.textPrimary   || "#1a2a4a";
  const textSec    = theme?.textSecondary || "#4a6080";
  const accent     = theme?.accent || "#0984e3";
  const gradStop1  = theme?.gradStop1 || "rgba(9,132,227,0.4)";
  const gradStop2  = theme?.gradStop2 || "rgba(9,132,227,0.02)";
  const forecastBg = theme?.forecastBg || "rgba(255,255,255,0.50)";

  const metricLabel = { chance_of_rain: "Rain %", humidity: "Humidity", wind_kph: "Wind" };
  const metricUnit  = { chance_of_rain: "%", humidity: "%", wind_kph: " km/h" };

  const tempKey = unit === "F" ? "temp_f" : "temp_c";
  const tempUnit = unit === "F" ? "°F" : "°C";

  const SkeletonRow = () => (
    <div className="flex justify-around px-2">
      {Array(8).fill(0).map((_,i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div className={`w-6 h-6 rounded-full ${isNight?"skeleton":"skeleton-light"}`}/>
          <div className={`w-8 h-3 rounded ${isNight?"skeleton":"skeleton-light"}`}/>
        </div>
      ))}
    </div>
  );

  return (
    <div className="glass-card mb-4 p-3 xs:p-4 sm:p-5 fade-up fade-up-2"
      style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardGlow }}>

      {/* Header — stacks on very small screens */}
      <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:justify-between sm:mb-4">
        <h2 className="font-bold text-sm sm:text-base" style={{ color: textPrim }}>Upcoming hours</h2>
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Metric toggle */}
          <div className="flex items-center rounded-xl overflow-hidden" style={{ border:`1px solid ${accent}30`, background:`${accent}10` }}>
            {Object.entries(metricLabel).map(([key, label]) => (
              <button key={key} onClick={() => setMetric(key)}
                className="font-semibold transition-all"
                style={{
                  fontSize: 10,
                  padding: "5px 8px",
                  background: metric === key ? accent : "transparent",
                  color: metric === key ? "white" : textSec,
                }}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForecast(v => !v)}
            className="flex items-center gap-1 font-semibold rounded-xl transition-all"
            style={{ fontSize: 10, padding: "5px 10px", background:`${accent}15`, color: accent, border:`1px solid ${accent}25` }}>
            {showForecast ? "Hide" : "7 days"} {showForecast ? <ChevronUp size={10}/> : <ChevronDown size={10}/>}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <SkeletonRow/>
          <div className={`w-full h-20 rounded-xl ${isNight?"skeleton":"skeleton-light"}`}/>
          <SkeletonRow/>
        </div>
      ) : (
        <>
          {/* Icon + temp row — scrollable on tiny screens */}
          <div className="overflow-x-auto pb-1 -mx-1">
            <div className="flex justify-around mb-2 px-1" style={{ minWidth: 300 }}>
              {data.map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5 min-w-0 flex-shrink-0">
                  <WeatherIcon code={h.conditionCode} isDay={h.isDay} size={22} />
                  <span className="font-bold" style={{ fontSize: 11, color: textPrim }}>{h[tempKey]}{tempUnit.replace("°","°")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Area Chart */}
          <div style={{ height: 80 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 6, left: -34, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={accent} stopOpacity={0.35}/>
                    <stop offset="95%" stopColor={accent} stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="label"
                  tick={{ fontSize: 9, fill: textSec, fontWeight: 600, fontFamily:"Plus Jakarta Sans" }}
                  axisLine={false} tickLine={false} interval={0}/>
                <YAxis hide domain={[0, metric==="wind_kph" ? 60 : 100]}/>
                <Tooltip content={<CustomTooltip metric={metric} theme={theme}/>}/>
                <Area type="monotone" dataKey={metric}
                  stroke={accent} strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={{ r: 3, fill: accent, stroke: "white", strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: accent, stroke: "white", strokeWidth: 2 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Metric value row */}
          <div className="overflow-x-auto -mx-1">
            <div className="flex justify-around mt-1 px-1" style={{ minWidth: 300 }}>
              {data.map((h, i) => (
                <span key={i} className="font-semibold flex-shrink-0" style={{ fontSize: 9, color: textSec }}>
                  {h[metric]}{metricUnit[metric]}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 7-day forecast (toggled) */}
      {showForecast && forecastDays?.length > 0 && (
        <div className="mt-4 pt-4" style={{ borderTop:`1px solid ${accent}20` }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: textSec }}>7-Day Forecast</p>
          <div className="grid grid-cols-7 gap-1">
            {forecastDays.map((day, i) => {
              const date = new Date(day.date);
              const dayName = i === 0 ? "Today" : date.toLocaleDateString("en-US",{weekday:"short"});
              const hi = unit === "F" ? day.day.maxtemp_f : day.day.maxtemp_c;
              const lo = unit === "F" ? day.day.mintemp_f : day.day.mintemp_c;
              return (
                <div key={i} className="flex flex-col items-center gap-1 rounded-2xl py-2.5 px-1 transition-all card-hover"
                  style={{ background: forecastBg, border:`1px solid ${accent}15` }}>
                  <span className="text-[10px] font-bold text-center truncate w-full px-0.5" style={{ color: accent }}>{dayName}</span>
                  <WeatherIcon code={day.day.condition.code} isDay={1} size={17} />
                  <span className="text-[11px] font-bold" style={{ color: textPrim }}>{hi}°</span>
                  <span className="text-[10px] font-medium" style={{ color: textSec }}>{lo}°</span>
                  {day.day.daily_chance_of_rain > 20 && (
                    <div className="flex items-center gap-0.5">
                      <Droplets size={8} style={{ color: accent }}/>
                      <span className="text-[9px] font-semibold" style={{ color: accent }}>{day.day.daily_chance_of_rain}%</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
