import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Sunrise, Sunset, Plus, X } from "lucide-react";
import WeatherIcon from "./WeatherIcon";
import { formatTimeInTimezone, formatDateInTimezone, getTimeInTimezone } from "../utils/timeUtils";
import WeatherBackground from "./WeatherBackground";

function CitySkyline({ theme }) {
  const dark = theme?.id?.includes("Night") || theme?.id?.includes("rain") || theme?.id?.includes("thunder");
  const bldgFill = dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.14)";
  const winFill  = dark ? "rgba(200,230,255,0.18)" : "rgba(160,210,255,0.28)";
  const sunColor = dark ? "transparent" : "#F4B94280";
  return (
    <svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="xMidYMax meet">
      {!dark && <circle cx="340" cy="90" r="42" fill="#F4B942" opacity="0.80"/>}
      {!dark && <circle cx="340" cy="90" r="58" fill="#F4B942" opacity="0.10"/>}
      <rect x="0"   y="120" width="28" height="60" fill={bldgFill} rx="2"/>
      <rect x="24"  y="105" width="22" height="75" fill={bldgFill} rx="2"/>
      <rect x="42"  y="115" width="30" height="65" fill={bldgFill} rx="2"/>
      <rect x="72"  y="30"  width="64" height="150" fill={dark?"rgba(180,200,230,0.35)":"rgba(210,220,235,0.70)"} rx="3"/>
      <rect x="84"  y="10"  width="40" height="26"  fill={dark?"rgba(180,200,230,0.35)":"rgba(210,220,235,0.70)"} rx="2"/>
      <rect x="96"  y="0"   width="16" height="14"  fill={dark?"rgba(180,200,230,0.30)":"rgba(210,220,235,0.65)"}/>
      {[40,56,72,88,104,120,136].map((y,i)=>(
        <g key={i}>
          {[80,92,104,116,124].map((x,j)=>(
            <rect key={j} x={x} y={y} width="7" height="7" fill={winFill} rx="1"/>
          ))}
        </g>
      ))}
      <rect x="144" y="64"  width="52" height="116" fill={dark?"rgba(170,190,215,0.32)":"rgba(195,210,228,0.65)"} rx="3"/>
      {[78,93,108,123,138,153].map((y,i)=>(
        <g key={i}>
          {[150,162,174,184].map((x,j)=>(
            <rect key={j} x={x} y={y} width="7" height="7" fill={winFill} rx="1"/>
          ))}
        </g>
      ))}
      <rect x="200" y="84"  width="38" height="96" fill={dark?"rgba(165,185,210,0.30)":"rgba(190,205,225,0.60)"} rx="3"/>
      <rect x="242" y="98" width="32" height="82"  fill={dark?"rgba(160,180,205,0.28)":"rgba(185,200,220,0.58)"} rx="3"/>
      <rect x="278" y="110" width="44" height="70"  fill={dark?"rgba(155,175,200,0.26)":"rgba(180,195,215,0.56)"} rx="3"/>
      <rect x="325" y="120" width="36" height="60"  fill={dark?"rgba(160,180,205,0.28)":"rgba(185,200,220,0.58)"} rx="3"/>
      <rect x="364" y="108" width="56" height="72"  fill={dark?"rgba(165,185,210,0.30)":"rgba(190,205,225,0.60)"} rx="3"/>
      <rect x="0" y="176" width="420" height="6" fill="rgba(255,255,255,0.08)" rx="2"/>
    </svg>
  );
}

function AddCityModal({ onAdd, onClose, cities, onDelete }) {
  const [input, setInput] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const val = input.trim();
    if (val) { onAdd(val); setInput(""); }
  };
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center" style={{background:"rgba(0,0,0,0.50)",borderRadius:"inherit"}}>
      <div className="bg-white rounded-2xl p-5 shadow-2xl" style={{width:"75%",maxWidth:260,maxHeight:"82%",overflowY:"auto"}}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-700 font-bold text-sm">Add a City</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus type="text" value={input} onChange={e=>setInput(e.target.value)}
            placeholder="e.g. Karachi, Tokyo…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 mb-3"
          />
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-sm py-2 rounded-xl transition-all">Add City</button>
        </form>

        {/* ── Saved cities list ── */}
        {cities.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Your Cities</p>
            <div className="flex flex-col gap-1.5">
              {cities.map((c, i) => (
                <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-gray-50 border border-gray-100 group">
                  <span className="text-xs font-semibold text-gray-700 truncate mr-2">{c}</span>
                  <button
                    onClick={() => onDelete(i)}
                    className="flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors"
                    title="Remove city"
                  >
                    <X size={13}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({ weatherData, loading, onCityChange, theme, timezone }) {
  const [now, setNow]         = useState(() => getTimeInTimezone(timezone));
  const [unit, setUnit]       = useState("C");
  const [cities, setCities]   = useState([]);
  const [cityIdx, setCityIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const tick = () => setNow(getTimeInTimezone(timezone));
    tick();
    const timer = setInterval(tick, 10000);
    return () => clearInterval(timer);
  }, [timezone]);

  useEffect(() => {
    if (weatherData?.location?.name && cities.length === 0) {
      setCities([weatherData.location.name]);
      setCityIdx(0);
    }
  }, [weatherData]); // eslint-disable-line

  const loc   = weatherData?.location;
  const cur   = weatherData?.current;
  const astro = weatherData?.astro;

  const cityName = loc ? `${loc.name}${loc.region ? `, ${loc.region}` : ""}${loc.country ? `, ${loc.country}` : ""}` : "—";
  const timeStr   = formatTimeInTimezone(timezone, { hour:"2-digit", minute:"2-digit" });
  const dateStr   = formatDateInTimezone(timezone, { weekday:"long", month:"short", day:"numeric" });
  const condCode  = cur?.condition?.code;
  const isDay     = cur?.is_day ?? 1;
  const condition = cur?.condition?.text || "—";
  const sunrise   = astro?.sunrise || "—";
  const sunset    = astro?.sunset  || "—";

  const tempC = cur ? Math.round(cur.temp_c) : null;
  const displayTemp = tempC === null ? "—"
    : unit === "C" ? `${tempC}°` : `${Math.round(tempC * 9/5 + 32)}°`;

  const feelsC = cur ? Math.round(cur.feelslike_c) : null;
  const feelsDisplay = feelsC === null ? "—"
    : unit === "C" ? `${feelsC}°C` : `${Math.round(feelsC*9/5+32)}°F`;

  const goLeft = () => {
    if (cities.length === 0) return;
    const i = (cityIdx - 1 + cities.length) % cities.length;
    setCityIdx(i); onCityChange && onCityChange(cities[i]);
  };
  const goRight = () => {
    if (cities.length === 0) return;
    const i = (cityIdx + 1) % cities.length;
    setCityIdx(i); onCityChange && onCityChange(cities[i]);
  };
  const handleAddCity = (name) => {
    if (!cities.includes(name)) {
      const updated = [...cities, name];
      setCities(updated);
      setCityIdx(updated.length - 1);
      onCityChange && onCityChange(name);
    }
  };

  const handleDeleteCity = (idx) => {
    const updated = cities.filter((_, i) => i !== idx);
    setCities(updated);
    if (updated.length === 0) {
      setCityIdx(0);
    } else {
      const newIdx = Math.min(cityIdx, updated.length - 1);
      setCityIdx(newIdx);
      onCityChange && onCityChange(updated[newIdx]);
    }
  };

  const isNight = theme?.id?.includes("Night") || theme?.id?.includes("rain") || theme?.id?.includes("thunder");
  const textMain  = "rgba(255,255,255,0.95)";
  const textSub   = "rgba(255,255,255,0.60)";
  const glassBg   = "rgba(255,255,255,0.12)";
  const glassBord = "rgba(255,255,255,0.20)";

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden"
      style={{
        background: theme?.sidebarBg || "linear-gradient(165deg,#5aaee8 0%,#2176c7 45%,#1558a8 100%)",
        minHeight: 280,
        borderRadius: "1.5rem 0 0 1.5rem",
      }}
    >
      {/* Background animation */}
      <WeatherBackground animation={theme?.animation} />

      {showModal && <AddCityModal onAdd={handleAddCity} onClose={() => setShowModal(false)} cities={cities} onDelete={handleDeleteCity}/>}

      {/* ── Top bar ── */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all active:scale-90"
            style={{ background: glassBg, border: `1px solid ${glassBord}` }}
            title="Add city"
          >
            <Plus size={17} strokeWidth={2.5}/>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {(cities.length > 0 ? cities : [""]).map((_,i) => (
              <button key={i} onClick={() => { setCityIdx(i); onCityChange && onCityChange(cities[i]); }}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i===cityIdx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.30)" }}
              />
            ))}
          </div>
          {/* °C / °F toggle */}
          <div className="flex items-center rounded-full px-1 py-0.5 gap-0.5" style={{ background: glassBg, border:`1px solid ${glassBord}` }}>
            {["C","F"].map(u => (
              <button key={u} onClick={() => setUnit(u)}
                className="text-xs font-bold px-2 py-0.5 rounded-full transition-all"
                style={{
                  background: unit===u ? "rgba(255,255,255,0.28)" : "transparent",
                  color: unit===u ? "white" : "rgba(255,255,255,0.45)",
                }}
              >°{u}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Location ── */}
      <div className="relative z-10 px-5 mt-4">
        <div className="flex items-center gap-1.5 mb-0.5">
          <MapPin size={13} className="text-white" strokeWidth={2.5}/>
          <span className="text-white font-bold text-[15px] leading-tight truncate">{cityName}</span>
        </div>
        <p style={{ color: textSub }} className="text-xs font-medium ml-5">{dateStr}</p>

        {/* Live clock */}
        <div className="ml-5 mt-1.5 font-mono-num text-white font-bold text-lg tracking-wider opacity-80">{timeStr}</div>

        {/* Sunrise / Sunset */}
        <div className="flex gap-4 mt-2 ml-5">
          <div className="flex items-center gap-1.5">
            <Sunrise size={12} style={{color:textSub}}/>
            <span style={{color:textSub}} className="text-xs font-semibold">{sunrise}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sunset size={12} style={{color:textSub}}/>
            <span style={{color:textSub}} className="text-xs font-semibold">{sunset}</span>
          </div>
        </div>
      </div>

      {/* ── Temp + Condition ── */}
      <div className="relative z-10 flex items-center justify-between px-3 mt-4 mb-1">
        <button onClick={goLeft} disabled={cities.length <= 1}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ color: cities.length>1 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.20)", background: cities.length>1 ? glassBg : "transparent" }}
        >
          <ChevronLeft size={20}/>
        </button>

        <div className="text-center flex-1">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-10 h-10 border-[3px] border-white/25 border-t-white rounded-full animate-spin"/>
              <div className="skeleton w-32 h-8 rounded-xl"/>
            </div>
          ) : (
            <div className="temp-pop">
              <div className="text-white leading-none font-extrabold font-mono-num"
                style={{ fontSize:"clamp(3.6rem,8.5vw,5.2rem)", letterSpacing:"-2px", textShadow:"0 2px 20px rgba(0,0,0,0.20)" }}>
                {displayTemp}
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <WeatherIcon code={condCode} isDay={isDay} size={28} />
                <span className="text-white font-bold text-lg" style={{textShadow:"0 1px 8px rgba(0,0,0,0.18)"}}>{condition}</span>
              </div>
              <p style={{color:textSub}} className="text-sm font-medium mt-1">Feels like {feelsDisplay}</p>
            </div>
          )}
        </div>

        <button onClick={goRight} disabled={cities.length <= 1}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ color: cities.length>1 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.20)", background: cities.length>1 ? glassBg : "transparent" }}
        >
          <ChevronRight size={20}/>
        </button>
      </div>

      {/* Extra stats row */}
      {cur && !loading && (
        <div className="relative z-10 flex justify-around px-5 mt-3 mb-2">
          {[
            { label: "Humidity", value: `${cur.humidity}%` },
            { label: "Wind",     value: unit==="C" ? `${cur.wind_kph} km/h` : `${cur.wind_mph} mph` },
            { label: "UV",       value: cur.uv },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-white font-bold text-sm">{stat.value}</span>
              <span style={{color:textSub}} className="text-[10px] font-medium mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Skyline ── */}
      <div className="relative z-10 mt-auto px-0 pb-0 flex items-end">
        <CitySkyline theme={theme}/>
      </div>
    </div>
  );
}
