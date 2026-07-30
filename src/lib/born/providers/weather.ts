import { fetchJson } from "../engine/http";
import type { GeographicPlace, WeatherSnapshot } from "../types";

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

function parseHour(birthTime?: string): number | null {
  if (!birthTime) return null;
  const [h] = birthTime.split(":").map(Number);
  return Number.isFinite(h) ? h : null;
}

export async function fetchBirthWeather(
  place: GeographicPlace,
  birthDate: string,
  birthTime?: string,
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(place.lat),
    longitude: String(place.lon),
    start_date: birthDate,
    end_date: birthDate,
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,weathercode",
    hourly: "temperature_2m,relative_humidity_2m,precipitation,windspeed_10m,weathercode",
    timezone: place.timezone.startsWith("UTC") ? "auto" : place.timezone,
  });

  try {
    const data = await fetchJson<{
      daily?: Record<string, (number | string | null)[]>;
      hourly?: Record<string, (number | string | null)[]>;
    }>([
      `/api/openmeteo/v1/archive?${params}`,
      `https://archive-api.open-meteo.com/v1/archive?${params}`,
    ]);

    const daily = data.daily;
    const hourly = data.hourly;
    const hour = parseHour(birthTime);

    let temperatureC: number | null = null;
    let humidity: number | null = null;
    let windKmh: number | null = null;
    let precipitationMm: number | null = (daily?.precipitation_sum?.[0] as number | null) ?? null;
    let weatherCode: number | null = (daily?.weathercode?.[0] as number | null) ?? null;
    let hourlyTemperatureC: number | null = null;

    const times = (hourly?.time as string[] | undefined) ?? [];
    if (times.length && hour != null) {
      const idx = times.findIndex((t) => t.endsWith(`T${String(hour).padStart(2, "0")}:00`));
      if (idx >= 0) {
        hourlyTemperatureC = (hourly?.temperature_2m?.[idx] as number | null) ?? null;
        temperatureC = hourlyTemperatureC;
        humidity = (hourly?.relative_humidity_2m?.[idx] as number | null) ?? null;
        windKmh = (hourly?.windspeed_10m?.[idx] as number | null) ?? null;
        if (hourly?.precipitation?.[idx] != null) precipitationMm = hourly.precipitation[idx] as number;
        if (hourly?.weathercode?.[idx] != null) weatherCode = hourly.weathercode[idx] as number;
      }
    }

    if (temperatureC == null && daily) {
      const max = daily.temperature_2m_max?.[0] as number | null;
      const min = daily.temperature_2m_min?.[0] as number | null;
      if (max != null && min != null) temperatureC = Math.round(((max + min) / 2) * 10) / 10;
    }

    const tMin = daily?.temperature_2m_min?.[0] as number | null;
    const tMax = daily?.temperature_2m_max?.[0] as number | null;
    const normalComparison =
      tMin != null && tMax != null
        ? `Day range at this location: ${tMin}°C – ${tMax}°C`
        : undefined;

    return {
      temperatureC,
      precipitationMm,
      humidity,
      windKmh,
      weatherCode,
      condition: weatherCode != null ? WMO[weatherCode] ?? `Code ${weatherCode}` : "Unavailable",
      sunrise: daily?.sunrise?.[0] as string | undefined,
      sunset: daily?.sunset?.[0] as string | undefined,
      hourlyTemperatureC,
      normalComparison,
      scope: "local",
      confidence: temperatureC != null ? "exact" : "unavailable",
      source: "Open-Meteo Historical Archive",
      stationNote: `Nearest reanalysis grid to ${place.city} (${place.lat.toFixed(2)}°, ${place.lon.toFixed(2)}°)`,
    };
  } catch {
    return {
      temperatureC: null,
      precipitationMm: null,
      humidity: null,
      windKmh: null,
      weatherCode: null,
      condition: "Historical weather unavailable for this location/date",
      scope: "local",
      confidence: "unavailable",
      source: "Open-Meteo Historical Archive",
      stationNote: "Exact city weather could not be retrieved. No fallback invented.",
    };
  }
}
