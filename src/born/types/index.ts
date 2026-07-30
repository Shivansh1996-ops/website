/** Core types for the BORN regional intelligence system */

export type CapsuleMode = "local" | "global";

export type CertificateTheme = "archive" | "cosmos" | "origin" | "earth" | "time";

export type DataScope = "exact" | "regional" | "national" | "global" | "unavailable";

export interface GeoLocation {
  query: string;
  latitude: number;
  longitude: number;
  city: string;
  district?: string;
  state?: string;
  country: string;
  countryCode: string;
  continent: string;
  timezone: string;
  displayName: string;
  population?: number;
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
}

export interface Fact<T = string> {
  value: T;
  label: string;
  scope: DataScope;
  source?: string;
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
  scope: DataScope;
  stationNote?: string;
}

export interface SkySnapshot {
  moonPhase: number;
  moonPhaseName: string;
  moonIllumination: number;
  sunAltitude: number;
  moonAltitude: number;
  sunrise: Date;
  sunset: Date;
  moonrise: Date | null;
  moonset: Date | null;
  approximate: boolean;
  label: string;
}

export interface MediaItem {
  title: string;
  artistOrCreator?: string;
  year: number;
  region: string;
  scope: DataScope;
  spotifyUrl?: string;
  youtubeUrl?: string;
  genre?: string;
  note?: string;
}

export interface TimelineEvent {
  year: number;
  date?: string;
  title: string;
  description: string;
  layer: "global" | "national" | "regional" | "local" | "personal";
  isBirth?: boolean;
}

export interface CultureSnapshot {
  languages: string[];
  foods: string[];
  festivals: string[];
  sports: string[];
  fashion?: string;
  movements?: string[];
  music: MediaItem[];
  films: MediaItem[];
  note?: string;
}

export interface TechSnapshot {
  region: {
    phones: string[];
    internetPenetration?: string;
    networkGeneration?: string;
    popularSites: string[];
    localCompanies: string[];
  };
  global: {
    phones: string[];
    launches: string[];
    operatingSystems: string[];
  };
  scope: DataScope;
}

export interface PriceItem {
  category: string;
  thenLabel: string;
  thenValue?: string;
  todayLabel?: string;
  todayValue?: string;
  globalBenchmark?: string;
  available: boolean;
  note?: string;
}

export interface SportsSnapshot {
  popularSports: string[];
  localTeams: string[];
  athletes: string[];
  events: string[];
  scope: DataScope;
}

export interface PopulationContext {
  city?: Fact<string>;
  country?: Fact<string>;
  world?: Fact<string>;
}

export interface CapsuleData {
  id: string;
  publicToken: string;
  certificateNumber: string;
  createdAt: string;
  privacy: "public" | "private";
  input: BirthInput;
  location: GeoLocation;
  weather: WeatherSnapshot;
  sky: SkySnapshot;
  culture: CultureSnapshot;
  globalCulture: CultureSnapshot;
  tech: TechSnapshot;
  sports: SportsSnapshot;
  prices: PriceItem[];
  timeline: TimelineEvent[];
  population: PopulationContext;
  narrative: string;
  quote: string;
  dayOfWeek: string;
  season: string;
  theme: CertificateTheme;
}

export interface CertificatePayload {
  capsule: CapsuleData;
  theme: CertificateTheme;
  includeCoordinates: boolean;
  includeBirthTime: boolean;
}
