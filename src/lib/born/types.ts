/** Core BORN types — location-first birth capsules */

export type DataScope = "local" | "regional" | "national" | "global";
export type DataConfidence = "exact" | "regional" | "national" | "global" | "estimated" | "unavailable";

export interface GeoHierarchy {
  latitude: number;
  longitude: number;
  timezone: string;
  city: string;
  district?: string;
  state?: string;
  country: string;
  countryCode: string;
  continent: string;
  displayName: string;
  historicalContext?: string;
}

export interface BirthInput {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  city: string;
  region?: string;
  country: string;
  showCoordinates?: boolean;
  showBirthTime?: boolean;
  preferredLanguage?: string;
  certificateTheme?: CertificateTheme;
}

export type CertificateTheme = "archive" | "cosmos" | "origin" | "earth" | "time";

export type CapsuleMode = "my-world" | "the-world";

export interface SourcedFact<T> {
  value: T;
  scope: DataScope;
  confidence: DataConfidence;
  source?: string;
  label?: string;
  note?: string;
}

export interface WeatherSnapshot {
  temperatureC: number | null;
  precipitationMm: number | null;
  humidity: number | null;
  windKmh: number | null;
  weatherCode: number | null;
  condition: string;
  sunrise?: string;
  sunset?: string;
  comparison?: string;
  scope: DataScope;
  confidence: DataConfidence;
  stationNote?: string;
}

export interface SkySnapshot {
  moonPhase: string;
  moonIllumination: number;
  moonAltitude: number | null;
  sunAltitude: number | null;
  sunrise?: string;
  sunset?: string;
  moonrise?: string;
  moonset?: string;
  twilight?: string;
  visiblePlanets: string[];
  constellations: string[];
  exactTime: boolean;
  label: string;
}

export interface MusicTrack {
  title: string;
  artist: string;
  year: number;
  regionLabel: string;
  scope: DataScope;
  spotifyUrl: string;
  youtubeUrl: string;
  chartNote?: string;
}

export interface MovieRelease {
  title: string;
  year: number;
  regionLabel: string;
  scope: DataScope;
  overview?: string;
  posterUrl?: string;
  tmdbUrl?: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  date?: string;
  title: string;
  description: string;
  layer: "global" | "national" | "regional" | "local" | "personal";
  isBirth?: boolean;
}

export interface CultureSnapshot {
  languages: string[];
  music: MusicTrack[];
  films: MovieRelease[];
  sports: string[];
  festivals: string[];
  foods: string[];
  fashion?: string;
  movements?: string[];
  television?: string[];
  limitations?: string;
}

export interface CostItem {
  category: string;
  thenLabel: string;
  thenValue: string;
  todayLabel: string;
  todayValue: string;
  globalBenchmark?: string;
  confidence: DataConfidence;
  note?: string;
}

export interface TechSnapshot {
  region: {
    phones: string[];
    internetPenetration?: string;
    networkGen?: string;
    computers?: string;
    localCompanies?: string[];
    websites?: string[];
  };
  global: {
    phones: string[];
    launches: string[];
    os?: string[];
    gaming?: string[];
  };
  confidence: DataConfidence;
  note?: string;
}

export interface SportsSnapshot {
  popularSports: string[];
  localTeams: string[];
  athletes: string[];
  events: string[];
  confidence: DataConfidence;
  note?: string;
}

export interface PopulationSnapshot {
  city?: SourcedFact<string>;
  region?: SourcedFact<string>;
  country?: SourcedFact<string>;
  world?: SourcedFact<string>;
}

export interface CapsuleData {
  id: string;
  publicToken: string;
  certificateNumber: string;
  createdAt: string;
  input: BirthInput;
  geo: GeoHierarchy;
  weather: WeatherSnapshot;
  sky: SkySnapshot;
  culture: CultureSnapshot;
  timeline: TimelineEvent[];
  costs: CostItem[];
  tech: TechSnapshot;
  sports: SportsSnapshot;
  population: PopulationSnapshot;
  landmarks: string[];
  regionalNews: TimelineEvent[];
  narrative: string;
  certificateQuote: string;
  dayOfWeek: string;
  season: string;
  privacy: "public" | "private";
}

export interface CertificatePayload {
  certificateNumber: string;
  publicToken: string;
  name: string;
  birthDate: string;
  birthTime?: string;
  city: string;
  region?: string;
  country: string;
  timezone: string;
  weatherSummary: string;
  sunrise?: string;
  sunset?: string;
  moonPhase: string;
  worldPopulation?: string;
  majorEvent?: string;
  majorTech?: string;
  popularMusic?: string;
  majorMovie?: string;
  quote: string;
  dayOfWeek: string;
  season: string;
  showCoordinates: boolean;
  coordinates?: { lat: number; lon: number };
  theme: CertificateTheme;
  createdAt: string;
  exactSky: boolean;
}
