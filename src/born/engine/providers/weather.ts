import type { WeatherSnapshot } from "@/born/types";

const WMO: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

/**
 * Historical weather for the exact birthplace via Open-Meteo Archive API.
 * Falls back gracefully with labeled scope.
 */
export async function fetchBirthWeather(opts: {
  latitude: number;
  longitude: number;
  date: string; // YYYY-MM-DD
  hour?: number;
}): Promise<WeatherSnapshot> {
  const { latitude, longitude, date, hour } = opts;
  const year = parseInt(date.slice(0, 4), 10);

  // Open-Meteo archive starts ~1940 for many regions
  if (year < 1940) {
    return {
      temperatureC: null,
      precipitationMm: null,
      humidity: null,
      windKmh: null,
      weatherCode: null,
      condition: "Historical station data unavailable for this era",
      scope: "unavailable",
      stationNote: "Weather archives typically begin around 1940 for most regions.",
    };
  }

  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      start_date: date,
      end_date: date,
      daily: "weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset",
      hourly: "temperature_2m,relativehumidity_2m,precipitation,windspeed_10m,weathercode",
      timezone: "auto",
    });
    const url = `https://archive-api.open-meteo.com/v1/archive?${params}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`weather ${res.status}`);
    const data = await res.json();

    const daily = data.daily;
    const hourly = data.hourly;
    let temp: number | null = daily?.temperature_2m_max?.[0] ?? null;
    let humidity: number | null = null;
    let precip: number | null = daily?.precipitation_sum?.[0] ?? null;
    let wind: number | null = null;
    let code: number | null = daily?.weathercode?.[0] ?? null;

    if (typeof hour === "number" && hourly?.time?.length) {
      const idx = hourly.time.findIndex((t: string) => t.endsWith(`T${String(hour).padStart(2, "0")}:00`));
      if (idx >= 0) {
        temp = hourly.temperature_2m?.[idx] ?? temp;
        humidity = hourly.relativehumidity_2m?.[idx] ?? null;
        precip = hourly.precipitation?.[idx] ?? precip;
        wind = hourly.windspeed_10m?.[idx] ?? null;
        code = hourly.weathercode?.[idx] ?? code;
      }
    } else if (hourly?.relativehumidity_2m?.length) {
      const vals = hourly.relativehumidity_2m.filter((v: number | null) => v != null) as number[];
      humidity = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
      const winds = (hourly.windspeed_10m ?? []).filter((v: number | null) => v != null) as number[];
      wind = winds.length ? Math.round(winds.reduce((a, b) => a + b, 0) / winds.length) : null;
    }

    return {
      temperatureC: temp != null ? Math.round(temp * 10) / 10 : null,
      precipitationMm: precip != null ? Math.round(precip * 10) / 10 : null,
      humidity,
      windKmh: wind != null ? Math.round(wind * 10) / 10 : null,
      weatherCode: code,
      condition: code != null ? WMO[code] ?? "Unknown conditions" : "Conditions recorded",
      sunrise: daily?.sunrise?.[0],
      sunset: daily?.sunset?.[0],
      scope: "exact",
      stationNote: "From the nearest Open-Meteo historical grid cell for your birthplace coordinates.",
    };
  } catch {
    return {
      temperatureC: null,
      precipitationMm: null,
      humidity: null,
      windKmh: null,
      weatherCode: null,
      condition: "Could not reach historical weather archive",
      scope: "unavailable",
      stationNote: "Weather data temporarily unavailable. Your capsule will update when the archive responds.",
    };
  }
}
