// STOPSHIP: Reorganize shared types into a common folder for both
// client and server to access for easier maintenance

/**
 * GEO IP DATA
 */
export interface LocationData {
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
}