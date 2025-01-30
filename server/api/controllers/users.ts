import { Request, Response } from 'express';
import axios from 'axios';
import { fetchWeatherApi } from 'openmeteo';
import { LocationData, User } from '../models/types';
import { wmoCodes } from '../models/wmoCodes';
import { ATLANTA } from '../models/constants';

// STOPSHIP: Replace with DB to add authentication and persisting scores
export const users: User[] = [];
export const clients: any[] = [];

const subscribeUpdates = (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    clients.push(res);

    if (users.length > 0) {
        res.write(`data: ${JSON.stringify(users)}\n\n`);
    }

    req.on("close", () => {
        // Remove on disconnect
        clients.splice(clients.indexOf(res), 1);
    })
}

const broadcastUpdates = () => {
    clients.forEach((client) => {
        client.write(`data: ${JSON.stringify(users)}\n\n`);
    })
}

/**
 * Checks for a name and requests location and weather data. 
 * Adds the user to the in memory array.
 * @param req body - user's name
 * @param res 
 * @returns 
 */
const joinRace = async (req: Request, res: Response) => {
    console.log("Entering race");
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        let latitude: number;
        let longitude: number;
        let location: string;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '120.0.0.1';
        const response = await axios.get<LocationData>(`https://api.techniknews.net/ipgeo/${ip}`);
        
        const locationData = response.data;
        if (locationData.cached === true || locationData.status === 'fail') {
            latitude = ATLANTA[0]
            longitude = ATLANTA[1]
            location = "Atlanta, Georgia, United States"
        } else {
            location = `${locationData.city}, ${locationData.regionName}, ${locationData.country}`;
            latitude = locationData.lat;
            longitude = locationData.lon;
        }


        let user = users.find((u) => u.name === name);
        if (user) {
            user.isOnline = true;
        } else {
            console.log("adding user");
            user = { name, location: location, rainfall: 0, weather: "Temp and Weather Not Found", isOnline: true, lat: latitude, lon: longitude };
            users.push(user);
            clients.forEach((client) => {
                client.write(`data: ${JSON.stringify(users)}\n\n`);
            })
            updateWeather(user);
        }

        broadcastUpdates();
        res.json({ message: 'Joined successfully', user });
        return;
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ error: 'Failed to join race' });
        return;
    }
}

/**
 * Sorts the current users by rainfall total
 * @param req 
 * @param res json of sorted users 
 */
const getLeaderboard = (req: Request, res: Response) => {
    users.sort((a, b) => b.rainfall - a.rainfall);
    res.json(users);
}

/**
 * Sets user to offline when tab is closed
 * @param req 
 * @param res message: User left
 */
const leaveRace = (req: Request, res: Response) => {
    const { name } = req.body;
    const user = users.find((u) => u.name === name);
    console.log(name + " is leaving");
    if (user)  {
        user.isOnline = false;
        broadcastUpdates();
    }
    res.json({ message: 'User left' });
}

/**
 * Makes request openmeteo for temperature in F, rain, and weather code.
 * Creates an updated weather string for user and adds current rainfall (inches) to user's total.
 * @param user 
 */
export const updateWeather = async (user: User) => {
    console.log("Updating weather");
    try {
        // Fetch weather data from open-meteo API using lat and lon
        const url = "https://api.open-meteo.com/v1/forecast";
        const params = {
            "latitude": user.lat,
            "longitude": user.lon,
            "current": ["temperature_2m", "rain", "weather_code"],
            "temperature_unit": "fahrenheit",
            "precipitation_unit": "inch"
        }
        
        const responses = await fetchWeatherApi(url, params);
        const current = responses[0].current();        
        // Check the variable indices for weather data
        if (current) {
            const temperature = current.variables(0)!.value();
            const rainfall = current.variables(1)!.value();
            const weatherCode = current.variables(2)!.value();          
            if (rainfall !== undefined && !isNaN(rainfall)) {
                // Add rain then round to 2 decimals
                user.rainfall += parseFloat(rainfall.toFixed(2));
                console.log(`Updated rainfall for ${user.name}: ${user.rainfall.toFixed(2)} inches`);
            } else {
                console.warn("Rainfall data is invalid or undefined.");
            }
        
            if (temperature && weatherCode !== undefined) {
                user.weather = `${temperature.toFixed(0)}F ${wmoCodes[weatherCode]}`;
            }
        } else {
            console.error("No response from openmeteo");
        }
    } catch (error) {
        console.error('Failed to fetch rainfall', error)
    }
}

/**
 * User controller for joining race, fetching leaderboard, and leaving race.
 */
export default { subscribeUpdates, joinRace, getLeaderboard, leaveRace };