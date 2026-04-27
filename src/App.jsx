import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { fetchWeather, getHourlySlots } from "./services/weatherService";
import { getWeatherTheme } from "./utils/weatherTheme";

export default function App() {
  const [city, setCity]             = useState("Karachi");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData]   = useState([]);
  const [forecastDays, setForecastDays] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [unit, setUnit]               = useState("C");

  // derive theme from current weather
  const condCode = weatherData?.current?.condition?.code;
  const isDay    = weatherData?.current?.is_day ?? 1;
  const theme    = getWeatherTheme(condCode, isDay);

  const doFetch = useCallback(async (query) => {
    if (!query?.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchWeather(query);
      setWeatherData(data);
      setHourlyData(getHourlySlots(data, 8));
      setForecastDays(data.forecast || []);
      setCity(data.location.name);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { doFetch("Karachi"); }, []); // eslint-disable-line

  const handleSearch = (q) => {
    doFetch(q);
  };

  // dynamic page background
  const pageBg = theme?.bg || "#cde4f5";

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-3 md:p-5 transition-all duration-700"
      style={{ background: pageBg }}>

      {/* Error Toast */}
      {error && (
        <div
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
          style={{ background: "rgba(239,68,68,0.95)", maxWidth: "90vw", backdropFilter:"blur(8px)" }}
          onClick={() => setError("")}
        >
          <span>⚠️ {error}</span>
          <span className="ml-2 opacity-60 text-xs">✕ dismiss</span>
        </div>
      )}

      {/* Dashboard Card */}
      <div
        className="w-full flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl transition-all duration-700"
        style={{ maxWidth: 1120, minHeight: 680, background: "transparent" }}
      >
        {/* SIDEBAR */}
        <div className="w-full md:w-[32%] flex-shrink-0" style={{ minHeight: 300 }}>
          <Sidebar
            weatherData={weatherData}
            loading={loading}
            onCityChange={handleSearch}
            theme={theme}
            timezone={weatherData?.location?.tz}
          />
        </div>

        {/* MAIN */}
        <div className="w-full md:w-[68%] flex-1 overflow-hidden rounded-b-3xl md:rounded-b-none md:rounded-r-3xl">
          <MainContent
            weatherData={weatherData}
            hourlyData={hourlyData}
            forecastDays={forecastDays}
            onSearch={handleSearch}
            loading={loading}
            searchValue={city}
            theme={theme}
            unit={unit}
          />
        </div>
      </div>
    </div>
  );
}
