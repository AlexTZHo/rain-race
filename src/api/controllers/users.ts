import { Request, Response } from 'express';
import axios from 'axios';
import { LocationData, User } from '../models/serverTypes';

const users: User[] = [];

export const joinRace = async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        const geoResponse = await axios.get<LocationData>(`https://api.techniknews.net/ipgeo/${ip}`);
        const locationData = geoResponse.data;
        const location = `${locationData.city}, ${locationData.regionName}, ${locationData.country}`;
        const latitude = locationData.lat;
        const longitude = locationData.lon;

        let user = users.find((u) => u.name === name);
        if (user) {
            user.isOnline = true;
        } else {
            user = { name, location, rainfall: 0, isOnline: true, lat: latitude, lon: longitude };
            users.push(user);
        }
        res.json({ message: 'Joined successfully', user });
        return;
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ error: 'Failed to join race' });
        return;
    }
}

export const getLeaderboard = (req: Request, res: Response) => {
    users.sort((a, b) => b.rainfall - a.rainfall);
    res.json(users);
}

export const leaveRace = (req: Request, res: Response) => {
    const { name } = req.body;
    const user = users.find((u) => u.name === name);
    if (user) user.isOnline = false;
    res.json({ message: 'User left' });
}

export default { joinRace, getLeaderboard, leaveRace };