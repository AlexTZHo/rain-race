// Default coordinates for local development or when API response is cached or failed
export const ATLANTA = [33.749, -84.388];

/**
 * GEO IP INTERFACE
 */
export interface IPLocationData {
  status: string;
  continent: string;
  country: string;
  countryCode: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  currency: string;
  isp: string;
  org: string;
  as: string;
  reverse: string;
  mobile: boolean;
  proxy: boolean;
  ip: string;
  cached: boolean;
  cacheTimestamp: number;
}

/**
 * ADDRESS TYPE FOR OPEN STREET
 */
export interface Address {
  city: string;
  county: string;
  state: string;
  "ISO3166-2-lvl4": string;
  country: string;
  country_code: string;
}

/**
 * OPEN STREET MAP INTERFACE
 */
export interface OpenStreetLocationData {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: Address;
  boundingbox: [string, string, string, string];
}

/**
 * USER ENTRY FOR IN MEMORY DB
 */
export interface User {
  name: string;
  location: string;
  rainfall: number;
  weather: string;
  isOnline: boolean;
  lat: number;
  lon: number;
  lastActive: Date;
}

/**
 * WEATHER CODES FOR OPENMETEO: use number key to access
 */
export const wmoCodes: { [key: number]: string } = {
  0: "Clear Sky ☀️",
  1: "Mainly clear 🌤️",
  2: "Partly cloudy ⛅",
  3: "Overcast ☁️",
  45: "Fog 🌫️",
  48: "Rime Fog ❄️🌫️",
  51: "Light Drizzle 💧",
  53: "Moderate Drizzle 💧💧",
  55: "Heavy Drizzle 💧💧💧",
  56: "Light Freezing Drizzle ❄️💧",
  57: "Heavy Freezing Drizzle ❄️💧💧💧",
  61: "Light Rain 🌧️",
  63: "Moderate Rain 🌧️🌧️",
  65: "Heavy Rain 🌧️🌧️🌧️",
  66: "Light Freezing Rain ❄️🌧️",
  67: "Heavy Freezing Rain ❄️🌧️🌧️🌧️",
  71: "Light Snow Fall ☃️",
  73: "Moderate Snow Fall ☃️☃️",
  75: "Heavy Snow Fall ☃️☃️☃️",
  77: "Snow Grains 🌨️",
  80: "Light Rain Showers 🌦️",
  81: "Moderate Rain Showers 🌦️🌦️",
  82: "Violent Rain Showers 🌦️🌦️🌦️",
  85: "Light Snow Showers 🌨️",
  86: "Heavy Snow Showers 🌨️🌨️🌨️",
  95: "Slight or Moderate Thunderstorm 🌩️",
};
