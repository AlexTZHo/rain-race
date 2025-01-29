import { Request, Response } from 'express';
import { LocationData } from '../models/types';
import axios from 'axios';

// Fetch user's location based on IP
const fetchLocation = async (req: Request, res: Response) => {
    try {
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '136.55.183.28';
        const geoUrl = `https://api.techniknews.net/ipgeo/136.55.183.28`;
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