import type { GeoHierarchy, WeatherSnapshot } from "./types";

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

export async function fetchLocalWeather(
  geo: GeoHierarchy,
  birthDate: string,
  birthTime?: string,
): Promise<WeatherSnapshot> {
  const empty: WeatherSnapshot = {
    temperatureC: null,
    precipitationMm: null,
    humidity: null,
    windKmh: null,
    weatherCode: null,
    condition: "Weather data unavailable for this date",
    scope: "local",
    confidence: "unavailable",
    stationNote: "Historical weather could not be retrieved for these coordinates.",
  };

  try {
    const year = parseInt(birthDate.slice(0, 4), 10);
    const archiveStart = 1940;
    if (year < archiveStart) {
      return {
        ...empty,
        confidence: "unavailable",
        stationNote: `Open-Meteo archive begins around ${archiveStart}. Exact local weather for ${year} is unavailable.`,
      };
    }

    const url =
      `https://archive-api.open-meteo.com/v1/archive?latitude=${geo.latitude}&longitude=${geo.longitude}` +
      `&start_date=${birthDate}&end_date=${birthDate}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,weathercode` +
      `&hourly=temperature_2m,relative_humidity_2m,precipitation,windspeed_10m,weathercode` +
      `&timezone=${encodeURIComponent(geo.timezone)}`;

    const res = await fetch(url);
    if (!res.ok) return empty;
    const data = await res.json();

    const daily = data.daily;
    const hourly = data.hourly;
    if (!daily?.time?.length) return empty;

    let temperatureC: number | null = null;
    let humidity: number | null = null;
    let precipitationMm: number | null = daily.precipitation_sum?.[0] ?? null;
    let windKmh: number | null = null;
    let weatherCode: number | null = daily.weathercode?.[0] ?? null;
    let stationNote =
      `Calculated for coordinates nearest ${geo.city} (${geo.latitude.toFixed(2)}°, ${geo.longitude.toFixed(2)}°) via Open-Meteo archive — not a generic country average.`;

    if (birthTime && hourly?.time?.length) {
      const target = `${birthDate}T${birthTime}`;
      let bestIdx = 0;
      let bestDiff = Infinity;
      hourly.time.forEach((t: string, i: number) => {
        const diff = Math.abs(new Date(t).getTime() - new Date(target).getTime());
        if (diff < bestDiff) {
          bestDiff = diff;
          bestIdx = i;
        }
      });
      temperatureC = hourly.temperature_2m?.[bestIdx] ?? null;
      humidity = hourly.relative_humidity_2m?.[bestIdx] ?? null;
      precipitationMm = hourly.precipitation?.[bestIdx] ?? precipitationMm;
      windKmh = hourly.windspeed_10m?.[bestIdx] ?? null;
      weatherCode = hourly.weathercode?.[bestIdx] ?? weatherCode;
      stationNote += ` Hourly reading nearest ${birthTime} local time.`;
    } else {
      const max = daily.temperature_2m_max?.[0];
      const min = daily.temperature_2m_min?.[0];
      if (typeof max === "number" && typeof min === "number") {
        temperatureC = Math.round(((max + min) / 2) * 10) / 10;
      }
      stationNote += " Daily average (exact birth hour not provided).";
    }

    // Climate normals comparison (same day across nearby years) if available
    let comparison: string | undefined;
    try {
      const y = year;
      const mmdd = birthDate.slice(5);
      const start = `${Math.max(archiveStart, y - 10)}-${mmdd}`;
      const end = `${y - 1}-${mmdd}`;
      // skip complex multi-year for now; use daily range as context
      if (daily.temperature_2m_max?.[0] != null && daily.temperature_2m_min?.[0] != null) {
        comparison = `Day range ${daily.temperature_2m_min[0]}°C – ${daily.temperature_2m_max[0]}°C at this location.`;
      }
      void start;
      void end;
    } catch {
      // ignore
    }

    return {
      temperatureC,
      precipitationMm,
      humidity,
      windKmh,
      weatherCode,
      condition: WMO[weatherCode ?? -1] ?? "Conditions recorded",
      sunrise: daily.sunrise?.[0],
      sunset: daily.sunset?.[0],
      comparison,
      scope: "local",
      confidence: "exact",
      stationNote,
    };
  } catch {
    return empty;
  }
}
