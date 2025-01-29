import { Request, Response } from 'express';
import { LocationData } from '../models/serverTypes';
import axios from 'axios';

// Fetch user's location based on IP
export const fetchLocation = async (req: Request, res: Response) => {
    try {
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        const geoUrl = `https://api.techniknews.net/ipgeo/${clientIp}`;
        const response = await axios.get<LocationData>(geoUrl);
        const locationData = response.data;

        res.json({
            city: locationData.city || 'Unkown',
            region: locationData.regionName || 'Unknown',
            country: locationData.country || 'Unknown',
        });
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ error: 'Failed to fetch location' });
    }
}

export default { fetchLocation };