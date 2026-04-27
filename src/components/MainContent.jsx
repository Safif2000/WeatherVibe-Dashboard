import React from "react";
import Header from "./Header";
import HourlyForecast from "./HourlyForecast";
import WeatherDetailsGrid from "./WeatherDetailsGrid";
import WeatherBackground from "./WeatherBackground";

export default function MainContent({ weatherData, hourlyData, forecastDays, onSearch, loading, searchValue, theme, unit }) {
  const mainBg = theme?.mainBg || "linear-gradient(180deg, #dff0ff 0%, #eaf5ff 100%)";
  const timezone = weatherData?.location?.tz;

  return (
    // overflow-y-auto but NOT overflow-x-hidden — let the dropdown escape
    <div className="relative h-full overflow-y-auto overflow-x-visible" style={{ background: mainBg }}>
      <WeatherBackground animation={theme?.animation === "sun" ? "sun" : "none"}/>

      {/* z-index set to ensure header dropdown appears above hourly card */}
      <div className="relative p-3 sm:p-4 md:p-6 main-content-inner" style={{ zIndex: 10 }}>
        {/* Header has its own zIndex: 1000 context for dropdown */}
        <div style={{ position: "relative", zIndex: 100 }}>
          <Header onSearch={onSearch} loading={loading} searchValue={searchValue} theme={theme} timezone={timezone}/>
        </div>
        <HourlyForecast hourlyData={hourlyData} forecastDays={forecastDays} loading={loading} theme={theme} unit={unit}/>
        <WeatherDetailsGrid weatherData={weatherData} loading={loading} theme={theme} unit={unit}/>
      </div>
    </div>
  );
}
