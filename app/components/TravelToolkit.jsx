"use client";

import { useEffect, useMemo, useState } from "react";
import { currencies, priceGuide, weatherCities } from "../data/tourism";
import Icon from "./Icon";

function describeWeather(code) {
  if (code === 0) return { label: "Clear sky", icon: "sun" };
  if (code <= 3) return { label: "Partly cloudy", icon: "cloud" };
  if (code <= 48) return { label: "Foggy", icon: "fog" };
  if (code <= 67 || (code >= 80 && code <= 82)) return { label: "Rain", icon: "rain" };
  if (code >= 95) return { label: "Thunderstorm", icon: "storm" };
  return { label: "Cloudy", icon: "cloud" };
}

function formatBdt(value) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

function CurrencyConverter() {
  const [code, setCode] = useState("USD");
  const [amount, setAmount] = useState("100");
  const [toBdt, setToBdt] = useState(true);
  const [rates, setRates] = useState(() =>
    Object.fromEntries(currencies.map((item) => [item.code, item.rate])),
  );

  const rate = rates[code] || 0;
  const numeric = Number(amount) || 0;
  const result = toBdt ? numeric * rate : rate ? numeric / rate : 0;

  return (
    <article className="tool-card converter">
      <header>
        <span className="tool-icon"><Icon name="wallet" /></span>
        <div>
          <h3>Currency converter</h3>
          <p>Bangladeshi Taka (BDT ৳)</p>
        </div>
      </header>

      <div className="converter-row">
        <label>
          <span className="sr-only">Amount</span>
          <input
            type="number"
            min="0"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        {toBdt ? (
          <select value={code} onChange={(event) => setCode(event.target.value)} aria-label="Currency">
            {currencies.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} · {item.name}
              </option>
            ))}
          </select>
        ) : (
          <span className="fixed-currency">BDT ৳</span>
        )}
      </div>

      <button
        type="button"
        className="swap-button"
        aria-label="Swap conversion direction"
        onClick={() => setToBdt((value) => !value)}
      >
        <Icon name="swap" size={18} />
      </button>

      <div className="converter-result">
        <strong>
          {toBdt ? `৳ ${formatBdt(result)}` : `${result.toFixed(2)} ${code}`}
        </strong>
        {!toBdt ? (
          <select value={code} onChange={(event) => setCode(event.target.value)} aria-label="Currency">
            {currencies.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <label className="rate-field">
        Rate: 1 {code} =
        <input
          type="number"
          min="0"
          step="0.01"
          value={rate}
          onChange={(event) =>
            setRates((current) => ({ ...current, [code]: Number(event.target.value) }))
          }
        />
        BDT
      </label>
      <p className="tool-note">
        Indicative rate only — edit it to match your bank or exchange booth.
      </p>

      <ul className="price-guide">
        {priceGuide.map((item) => (
          <li key={item.item}>
            <span>{item.item}</span>
            <b>
              ৳{formatBdt(item.bdt)}
              {rate ? <small> ≈ {(item.bdt / rate).toFixed(item.bdt / rate < 10 ? 2 : 0)} {code}</small> : null}
            </b>
          </li>
        ))}
      </ul>
    </article>
  );
}

function LocalClock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const view = useMemo(() => {
    if (!now) {
      return null;
    }

    const time = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Dhaka",
    }).format(now);
    const date = new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "Asia/Dhaka",
    }).format(now);
    const diffHours = 6 + now.getTimezoneOffset() / 60;
    const diff =
      diffHours === 0
        ? "Same time as you"
        : `${Math.abs(diffHours)} ${Math.abs(diffHours) === 1 ? "hour" : "hours"} ${diffHours > 0 ? "ahead of" : "behind"} you`;
    const hour = Number(time.slice(0, 2));

    return { time, date, diff, isDay: hour >= 6 && hour < 18 };
  }, [now]);

  return (
    <article className="tool-card clock-card">
      <header>
        <span className="tool-icon"><Icon name="clock" /></span>
        <div>
          <h3>Time in Bangladesh</h3>
          <p>Bangladesh Standard Time · GMT+6</p>
        </div>
      </header>
      <strong className="clock-time">{view ? view.time : "--:--:--"}</strong>
      <p className="clock-date">{view ? view.date : " "}</p>
      <p className="clock-diff">
        <Icon name={view?.isDay ? "sun" : "star"} size={16} />
        {view ? view.diff : "Calculating..."}
      </p>
      <ul className="clock-facts">
        <li><span>Weekend</span><b>Friday & Saturday</b></li>
        <li><span>Shops open</span><b>10:00 – 20:00</b></li>
        <li><span>Power</span><b>220V · C / D / G</b></li>
        <li><span>Dialing code</span><b>+880</b></li>
      </ul>
    </article>
  );
}

function LiveWeather() {
  const [state, setState] = useState({ status: "loading", data: [] });

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      latitude: weatherCities.map((city) => city.lat).join(","),
      longitude: weatherCities.map((city) => city.lon).join(","),
      current: "temperature_2m,relative_humidity_2m,weather_code",
      timezone: "Asia/Dhaka",
    });

    fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Weather unavailable");
        }
        return response.json();
      })
      .then((json) => {
        const list = Array.isArray(json) ? json : [json];
        setState({
          status: "ready",
          data: list.map((entry, index) => ({
            city: weatherCities[index].name,
            temp: Math.round(entry.current.temperature_2m),
            humidity: entry.current.relative_humidity_2m,
            ...describeWeather(entry.current.weather_code),
          })),
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({ status: "error", data: [] });
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <article className="tool-card weather-card">
      <header>
        <span className="tool-icon"><Icon name="sun" /></span>
        <div>
          <h3>Live weather</h3>
          <p>Current conditions across Bangladesh</p>
        </div>
      </header>

      {state.status === "loading" ? (
        <ul className="weather-list" aria-busy="true">
          {weatherCities.map((city) => (
            <li key={city.name} className="is-loading">
              <span>{city.name}</span>
              <span className="skeleton" />
            </li>
          ))}
        </ul>
      ) : null}

      {state.status === "error" ? (
        <p className="tool-note">
          Live weather couldn't load right now. Winter (Nov–Feb) averages 12–26 °C;
          the monsoon (Jun–Oct) brings daily rain.
        </p>
      ) : null}

      {state.status === "ready" ? (
        <ul className="weather-list">
          {state.data.map((item) => (
            <li key={item.city}>
              <span className="weather-city">
                <Icon name={item.icon} size={20} />
                {item.city}
              </span>
              <span className="weather-desc">{item.label} · {item.humidity}% humidity</span>
              <strong>{item.temp}°C</strong>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="tool-note">Data from Open-Meteo.</p>
    </article>
  );
}

export default function TravelToolkit() {
  return (
    <div className="toolkit-grid">
      <CurrencyConverter />
      <LiveWeather />
      <LocalClock />
    </div>
  );
}
