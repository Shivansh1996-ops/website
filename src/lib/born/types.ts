export type DataScope = "local" | "regional" | "national" | "global";
export type DataConfidence = "exact" | "regional" | "national" | "estimated" | "unavailable";
export type CapsuleMode = "my_world" | "the_world";
export type CertificateTheme = "archive" | "cosmos" | "origin" | "earth" | "time";
export type CapsulePrivacy = "public" | "unlisted" | "private";

export interface BirthInput {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  city: string;
  region?: string;
  country: string;
  preferLanguage?: string;
  showCoordinates?: boolean;
  showBirthTime?: boolean;
  privacy?: CapsulePrivacy;
}

export interface GeographicPlace {
  lat: number;
  lon: number;
  displayName: string;
  city: string;
  district?: string;
  state?: string;
  country: string;
  countryCode: string;
  continent: string;
  timezone: string;
  currency?: string;
  languages: string[];
  historicalContext?: string;
}

export interface ScopedFact<T> {
  value: T;
  scope: DataScope;
  confidence: DataConfidence;
  source: string;
  label?: string;
  asOf?: string;
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
  hourlyTemperatureC?: number | null;
  normalComparison?: string;
  scope: DataScope;
  confidence: DataConfidence;
  source: string;
  stationNote?: string;
}

export interface AstronomySnapshot {
  moonPhase: string;
  moonIllumination: number;
  moonAltitude: number;
  sunAltitude: number;
  sunrise: string;
  sunset: string;
  moonrise?: string;
  moonset?: string;
  twilight?: string;
  visiblePlanets: string[];
  constellations: string[];
  zodiacConstellation?: string;
  exactTimeUsed: boolean;
  label: string;
}

export interface MusicTrack {
  title: string;
  artist: string;
  year: number;
  regionLabel: string;
  scope: DataScope;
  genre?: string;
  spotifySearchUrl: string;
  youtubeSearchUrl: string;
  note?: string;
}

export interface MediaItem {
  title: string;
  year: number;
  type: "film" | "tv";
  regionLabel: string;
  scope: DataScope;
  note?: string;
}

export interface TimelineEvent {
  year: number;
  date?: string;
  title: string;
  summary: string;
  scope: DataScope;
  layer: "global" | "national" | "regional" | "local" | "personal";
  source: string;
}

export interface PriceItem {
  category: string;
  thenLabel: string;
  thenValue: string | null;
  todayLabel: string;
  todayValue: string | null;
  globalBenchmark?: string;
  confidence: DataConfidence;
  note?: string;
}

export interface TechSnapshot {
  region: {
    mobileEra: string;
    internetPenetration?: string;
    networkGeneration?: string;
    popularDevices: string[];
    localCompanies: string[];
    note?: string;
  };
  global: {
    majorLaunch: string;
    popularOs: string[];
    websites: string[];
    note?: string;
  };
}

export interface SportsSnapshot {
  popularSports: string[];
  localTeams: string[];
  nationalContext: string[];
  eventsAroundBirth: string[];
  athletes: string[];
  confidence: DataConfidence;
  note?: string;
}

export interface CultureSnapshot {
  languages: string[];
  festivals: string[];
  foods: string[];
  fashionTrends: string[];
  culturalMovements: string[];
  television: string[];
  note?: string;
  confidence: DataConfidence;
}

export interface PopulationSnapshot {
  city?: ScopedFact<string>;
  region?: ScopedFact<string>;
  country?: ScopedFact<string>;
  world?: ScopedFact<string>;
}

export interface CertificateData {
  certificateNumber: string;
  publicToken: string;
  theme: CertificateTheme;
  quote: string;
  createdAt: string;
  showCoordinates: boolean;
  showBirthTime: boolean;
}

export interface CapsuleData {
  id: string;
  publicId: string;
  input: BirthInput;
  place: GeographicPlace;
  weather: WeatherSnapshot;
  astronomy: AstronomySnapshot;
  music: {
    regional: MusicTrack[];
    national: MusicTrack[];
    global: MusicTrack[];
  };
  cinema: {
    regional: MediaItem[];
    national: MediaItem[];
    global: MediaItem[];
  };
  culture: CultureSnapshot;
  news: TimelineEvent[];
  timeline: TimelineEvent[];
  prices: PriceItem[];
  technology: TechSnapshot;
  sports: SportsSnapshot;
  population: PopulationSnapshot;
  certificate: CertificateData;
  createdAt: string;
  privacy: CapsulePrivacy;
}
