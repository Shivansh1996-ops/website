import { fetchJson } from "../engine/http";
import type { GeographicPlace, TimelineEvent } from "../types";

interface WikiOnThisDay {
  text: string;
  year: number;
  pages?: { title: string; extract?: string }[];
}

async function fetchOnThisDay(month: number, day: number): Promise<WikiOnThisDay[]> {
  try {
    const data = await fetchJson<{ events?: WikiOnThisDay[] }>([
      `/api/wikimedia/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`,
      `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`,
    ]);
    return data.events ?? [];
  } catch {
    return [];
  }
}

function scoreLocalRelevance(text: string, place: GeographicPlace): number {
  const t = text.toLowerCase();
  let score = 0;
  if (place.city && t.includes(place.city.toLowerCase())) score += 5;
  if (place.state && t.includes(place.state.toLowerCase())) score += 4;
  if (place.country && t.includes(place.country.toLowerCase())) score += 3;
  if (place.continent && t.includes(place.continent.toLowerCase())) score += 1;
  return score;
}

export async function buildRegionalNews(
  place: GeographicPlace,
  birthDate: string,
): Promise<TimelineEvent[]> {
  const [y, m, d] = birthDate.split("-").map(Number);
  const events = await fetchOnThisDay(m, d);

  const aroundYear = events
    .filter((e) => Math.abs(e.year - y) <= 15)
    .map((e) => {
      const score = scoreLocalRelevance(e.text, place);
      let layer: TimelineEvent["layer"] = "global";
      let scope: TimelineEvent["scope"] = "global";
      if (score >= 5) {
        layer = "local";
        scope = "local";
      } else if (score >= 4) {
        layer = "regional";
        scope = "regional";
      } else if (score >= 3) {
        layer = "national";
        scope = "national";
      }
      return {
        year: e.year,
        date: birthDate.slice(5),
        title: e.pages?.[0]?.title ?? e.text.slice(0, 80),
        summary: e.text,
        scope,
        layer,
        source: "Wikimedia On This Day",
        _score: score,
      };
    })
    .sort((a, b) => b._score - a._score || Math.abs(a.year - y) - Math.abs(b.year - y));

  const layered: TimelineEvent[] = [];

  const pick = (layer: TimelineEvent["layer"], n: number) => {
    aroundYear
      .filter((e) => e.layer === layer)
      .slice(0, n)
      .forEach(({ _score, ...rest }) => layered.push(rest));
  };

  pick("local", 2);
  pick("regional", 2);
  pick("national", 3);
  pick("global", 4);

  // Always inject personal birth marker
  layered.push({
    year: y,
    date: birthDate,
    title: "YOU WERE BORN",
    summary: `Your story began in ${place.city}, ${place.country}.`,
    scope: "local",
    layer: "personal",
    source: "BORN",
  });

  // If local/regional empty, add transparent limitation events
  if (!layered.some((e) => e.layer === "local" && e.source !== "BORN")) {
    layered.unshift({
      year: y,
      title: `City timeline for ${place.city}`,
      summary: `Digitized city-level news for ${place.city} on this date is limited in public archives. Showing state/national/global layers with clear labels.`,
      scope: "local",
      layer: "local",
      source: "BORN data limitation note",
    });
  }

  return layered.sort((a, b) => a.year - b.year);
}

export function buildLifeTimeline(
  place: GeographicPlace,
  birthYear: number,
  news: TimelineEvent[],
): TimelineEvent[] {
  const before = news
    .filter((e) => e.year < birthYear && e.layer !== "personal")
    .slice(-6);
  const personal: TimelineEvent = {
    year: birthYear,
    title: "YOU WERE BORN ⭐",
    summary: `This is where your story began — ${place.city}, ${place.state ?? place.country}.`,
    scope: "local",
    layer: "personal",
    source: "BORN",
  };
  const after = news
    .filter((e) => e.year > birthYear)
    .slice(0, 4);

  return [...before, personal, ...after];
}
