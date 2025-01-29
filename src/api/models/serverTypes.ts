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

export interface WeatherData {

}
  
export interface User {
  name: string;
  location: string;
  rainfall: number;
  isOnline: boolean;
  lat: number;
  lon: number;
}