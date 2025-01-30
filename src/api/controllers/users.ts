import { Request, Response } from 'express';
import axios from 'axios';
import { LocationData, User } from '../models/types';
import { fetchWeatherApi } from 'openmeteo';
import { wmoCodes } from '../models/wmoCodes';

// STOPSHIP: Replace with DB to add authentication and persisting scores
export const users: User[] = [];

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
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '136.55.183.28';
        // REPLACE with ip
        const response = await axios.get<LocationData>(`https://api.techniknews.net/ipgeo/136.55.183.28`);
        const locationData = response.data;
        const location = `${locationData.city}, ${locationData.regionName}, ${locationData.country}`;
        const latitude = locationData.lat;
        const longitude = locationData.lon;

        let user = users.find((u) => u.name === name);
        if (user) {
            user.isOnline = true;
        } else {
            user = { name, location: location, rainfall: 0, weather: "Temp and Weather Not Found", isOnline: true, lat: latitude, lon: longitude };
            users.push(user);
            updateWeather(user);
        }
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
    if (user) user.isOnline = false;
    res.json({ message: 'User left' });
}

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
            "latitude": user.lat,
            "longitude": user.lon,
            "current": ["temperature_2m", "rain", "weather_code"],
            "temperature_unit": "fahrenheit",
            "precipitation_unit": "inch"
        }
        
        const responses = await fetchWeatherApi(url, params);
        const current = responses[0].current();        
        // Check the variable indices for weather data
        const temperature = current?.variables(0)!.value();
        const rainfall = current?.variables(1)!.value();
        const weatherCode = current?.variables(2)!.value();

        // Set weather string
        user.weather = temperature?.toFixed(0) + "F " + wmoCodes[weatherCode!];
        
        // Add rain then round to 2 decimals
        user.rainfall += (rainfall ?  rainfall : 0);
        user.rainfall = parseFloat(user.rainfall.toFixed(2));

        console.log(`Updated rainfall for ${user.name}: ${user.rainfall.toFixed(2)} inches`);
    } catch (error) {
        console.error('Failed to fetch rainfall', error)
    }
}

/**
 * User controller for joining race, fetching leaderboard, and leaving race.
 */
export default { joinRace, getLeaderboard, leaveRace };