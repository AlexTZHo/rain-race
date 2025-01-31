import { Request, Response } from "express";
import axios from "axios";
import { fetchWeatherApi } from "openmeteo";
import { IPLocationData, User, wmoCodes, ATLANTA } from "../models/constants";
import { getLocationName } from "./helpers/getLocationName";
import { broadcastUpdates, subscribeUpdates } from "./helpers/updates";

// STOPSHIP: Replace with DB to add authentication and persisting scores.
// In memory storage clears on restart.
export const users: User[] = [];
export const clients: any[] = [];

/**
 * Checks for a name and requests location and weather data.
 * Adds the user to the in memory array.
 * @param req body - user's name
 * @param res
 * @returns
 */
const joinRace = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  try {
    let latitude: number;
    let longitude: number;
    let location: string;
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "120.0.0.1";
    const response = await axios.get<IPLocationData>(
      `https://api.techniknews.net/ipgeo/${ip}`,
    );

    const locationData = response.data;
    if (locationData.cached === true || locationData.status === "fail") {
      latitude = ATLANTA[0];
      longitude = ATLANTA[1];
      location = "Atlanta, Georgia, United States";
    } else {
      location = `${locationData.city}, ${locationData.regionName}, ${locationData.country}`;
      latitude = locationData.lat;
      longitude = locationData.lon;
    }

    let user = users.find((u) => u.name === name);
    if (user) {
      user.isOnline = true;
    } else {
      user = {
        name,
        location: location,
        rainfall: 0,
        weather: "Finding weather data...",
        isOnline: true,
        lat: latitude,
        lon: longitude,
        lastActive: new Date(),
      };
      users.push(user);
      updateWeather(user);
      clients.forEach((client) => {
        client.write(`data: ${JSON.stringify(users)}\n\n`);
      });
    }
    res.json({ message: "Joined successfully", user });
    return;
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ error: "Failed to join race" });
    return;
  }
};

/**
 * Sorts the current users by rainfall total
 * @param req
 * @param res json of sorted users
 */
const getLeaderboard = (req: Request, res: Response) => {
  users.sort((a, b) => b.rainfall - a.rainfall);
  res.json(users);
};

/**
 * Sets user to offline when tab is closed
 * @param req
 * @param res message: User left
 */
const leaveRace = (req: Request, res: Response) => {
  const { name } = req.body;
  const user = users.find((u) => u.name === name);
  console.log(name + " is leaving");
  if (user) {
    user.isOnline = false;
    broadcastUpdates();
  }
  res.json({ message: "User left" });
};

/**
 * Makes request openmeteo for temperature in F, rain, and weather code.
 * Creates an updated weather string for user and adds current rainfall (inches) to user's total.
 * @param user
 */
export const updateWeather = async (user: User) => {
  try {
    // Fetch weather data from open-meteo API using lat and lon
    const url = "https://api.open-meteo.com/v1/forecast";
    const params = {
      latitude: user.lat,
      longitude: user.lon,
      current: ["temperature_2m", "rain", "weather_code"],
      temperature_unit: "fahrenheit",
      precipitation_unit: "inch",
    };

    const responses = await fetchWeatherApi(url, params);
    const current = responses[0].current();
    // Check the variable indices for weather data
    if (current) {
      const temperature = current.variables(0)!.value();
      const rainfall = current.variables(1)!.value();
      const weatherCode = current.variables(2)!.value();
      if (rainfall !== undefined && !isNaN(rainfall)) {
        // Add rain then round to 2 decimals
        // TODO: Rainfall sometimes returns longer than 2 decimal places
        user.rainfall += parseFloat(rainfall.toFixed(2));
        console.log(
          `Updated rainfall for ${user.name}: ${user.rainfall.toFixed(2)} inches`,
        );
      } else {
        console.warn("Rainfall data is invalid or undefined.");
      }

      if (temperature && weatherCode !== undefined) {
        user.weather = `${temperature.toFixed(0)}F ${wmoCodes[weatherCode]}`;
      }
      broadcastUpdates();
    } else {
      console.error("No response from openmeteo");
    }
  } catch (error) {
    console.error("Failed to fetch rainfall", error);
  }
};

/**
 * Takes the user's name to find specific user and add new coordinates for rainfall catching
 * @param req user's name, new latitude, new longitude
 * @param res
 * @returns void
 */
const updateLocation = async (req: Request, res: Response): Promise<void> => {
  const { name, lat, lon } = req.body;
  if (!name || lat === undefined || lon === undefined) {
    res
      .status(400)
      .json({ error: "Name, latitude, and longitude are required" });
    return;
  }

  const user = users.find((u) => u.name === name);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  user.lat = lat;
  user.lon = lon;
  const newLocation = await getLocationName(lat, lon);
  user.location = newLocation; // Update location string

  console.log(`${name} updated location to ${lat}, ${lon}`);

  broadcastUpdates();

  res.json({ message: "Location updated successfully", user });
  return;
};

const heartbeat = async (req: Request, res: Response) => {
  const { name } = req.body;
  const user = users.find((u) => u.name === name);

  if (user) {
    user.lastActive = new Date();
    user.isOnline = true;
    broadcastUpdates();
  }

  res.status(204).end();
};

// Offline endpoint
const markOffline = async (req: Request, res: Response) => {
  const { name } = req.body;
  const user = users.find((u) => u.name === name);

  if (user) {
    user.isOnline = false;
    broadcastUpdates();
  }

  res.status(204).end();
};

/**
 * User controller for joining race, fetching leaderboard, and leaving race.
 */
export default {
  subscribeUpdates,
  joinRace,
  getLeaderboard,
  leaveRace,
  updateLocation,
  heartbeat,
  markOffline,
};
