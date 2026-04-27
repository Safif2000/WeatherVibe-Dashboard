import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, Sun, Moon } from "lucide-react";
import { getTimeBasedGreeting } from "../utils/timeUtils";

const HISTORY_KEY = "weathervibe_history";
const MAX_HISTORY = 6;

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); }
  catch { return []; }
}
function saveHistory(list) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_HISTORY))); } catch {}
}

export default function Header({ onSearch, loading, searchValue, theme, timezone }) {
  const [query, setQuery]     = useState("");
  const [focused, setFocused] = useState(false);
  const [history, setHistory] = useState(loadHistory);
  const inputRef = useRef(null);

  const isNight = theme?.id?.includes("Night") || theme?.id?.includes("rain") || theme?.id?.includes("thunder");

  const textPrim  = theme?.textPrimary   || "#1a2a4a";
  const textSec   = theme?.textSecondary || "#4a6080";
  const accent    = theme?.accent || "#2563EB";

  const inputBg     = isNight ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.92)";
  const inputBorder = isNight ? "rgba(255,255,255,0.18)" : "rgba(200,220,255,0.80)";
  const inputColor  = isNight ? "rgba(255,255,255,0.96)" : textPrim;
  const dropdownBg  = isNight ? "rgba(15,25,50,0.98)"   : "rgba(255,255,255,0.99)";
  const dropItemClr = isNight ? "#c0d8f0"                : "#334155";
  const dropHoverBg = isNight ? "rgba(255,255,255,0.06)" : "#f1f5f9";
  const dropBorder  = isNight ? "rgba(80,120,200,0.25)"  : "rgba(200,220,255,0.6)";
  const subTextClr  = isNight ? "rgba(160,200,240,0.7)"  : "#94a3b8";
  const hTagClr     = isNight ? "#e0eeff"                : textPrim;
  const subTagClr   = isNight ? "rgba(160,200,240,0.75)" : textSec;

  const doSearch = useCallback((q) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...history.filter(h => h.toLowerCase() !== trimmed.toLowerCase())];
    setHistory(updated);
    saveHistory(updated);
    onSearch(trimmed);
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
  }, [history, onSearch]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); doSearch(query); }
    if (e.key === "Escape") { setFocused(false); inputRef.current?.blur(); }
  };

  const filteredHistory = query.trim()
    ? history.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()))
    : history;

  const showDropdown = focused && filteredHistory.length > 0;

  const [greeting, setGreeting] = useState(getTimeBasedGreeting(timezone));
  const greetingIcon = greeting.toLowerCase().includes("night") ? <Moon size={20} />
    : greeting.toLowerCase().includes("evening") ? <Moon size={20} />
    : greeting.toLowerCase().includes("afternoon") ? <Sun size={20} />
    : <Sun size={20} />;

  useEffect(() => {
    setGreeting(getTimeBasedGreeting(timezone));
    if (!timezone) return;
    const timer = setInterval(() => setGreeting(getTimeBasedGreeting(timezone)), 30000);
    return () => clearInterval(timer);
  }, [timezone]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start justify-between sm:gap-4 mb-4 sm:mb-5 fade-up">
      <div className="flex-1 min-w-0">
        <h1 className="font-extrabold text-xl sm:text-2xl leading-tight truncate flex items-center gap-2" style={{ color: hTagClr }}>
          {greeting} {greetingIcon}
        </h1>
        <p className="font-medium text-xs sm:text-sm mt-1 sm:mt-0.5" style={{ color: subTagClr }}>
          Check out today's weather information
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto" style={{ position: "relative", zIndex: 1000 }}>
        <div style={{ position: "relative", flex: "1 1 auto" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search
              size={14}
              style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                pointerEvents: "none", color: subTextClr,
              }}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder="Search city…"
              style={{
                paddingLeft: 32, paddingRight: 36, paddingTop: 9, paddingBottom: 9,
                borderRadius: 999, fontSize: 12, fontWeight: 500,
                background: inputBg, border: "1px solid " + inputBorder, color: inputColor,
                boxShadow: focused ? "0 0 0 3px " + accent + "28" : "none",
                outline: "none", width: "100%", minWidth: 0,
                transition: "box-shadow 0.2s ease",
                fontFamily: "inherit",
              }}
            />
            {query && !loading && (
              <button
                type="button"
                onClick={() => setQuery("")}
                style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 26, height: 26, borderRadius: "50%", border: "none", cursor: "pointer",
                  background: isNight ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.06)",
                  color: subTextClr,
                }}
              >
                <X size={13}/>
              </button>
            )}
            {loading && (
              <div style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                width: 14, height: 14, borderRadius: "50%",
                border: "2px solid " + accent + "40", borderTopColor: accent,
                animation: "spin 0.8s linear infinite",
              }}/>
            )}
          </div>

          {showDropdown && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              zIndex: 99999,
              background: dropdownBg,
              border: "1px solid " + dropBorder,
              borderRadius: 18,
              boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.10)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              overflow: "hidden",
            }}>
              <div style={{ padding: "10px 16px 8px", borderBottom: "1px solid " + dropBorder }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: subTextClr }}>
                  Recent searches
                </span>
              </div>
              <div style={{ maxHeight: 240, overflowY: "auto" }}>
                {filteredHistory.map((city, i) => (
                  <button
                    key={i}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 16px", textAlign: "left", fontSize: 13, fontWeight: 500,
                      color: dropItemClr, background: "transparent", border: "none", cursor: "pointer",
                      transition: "background 0.15s", fontFamily: "inherit",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = dropHoverBg}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    onMouseDown={(e) => { e.preventDefault(); setQuery(city); doSearch(city); }}
                    onTouchStart={() => { setQuery(city); doSearch(city); }}
                  >
                    <Clock size={13} style={{ color: subTextClr, flexShrink: 0 }}/>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{city}</span>
                  </button>
                ))}
              </div>
              {history.length > 0 && (
                <button
                  style={{
                    width: "100%", padding: "10px 16px", textAlign: "left",
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em",
                    color: subTextClr, background: "transparent", border: "none",
                    borderTop: "1px solid " + dropBorder, cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = dropHoverBg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  onMouseDown={(e) => { e.preventDefault(); setHistory([]); saveHistory([]); }}
                >
                  Clear history
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
