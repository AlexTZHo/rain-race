import express, { Request, Response } from 'express';
import path from 'path';
import axios from 'axios';

import { LocationData } from './types';

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle root requests
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Fetch user location based on IP
app.get('/api/location', async (req: Request, res: Response) => {
    try {
        // Grab client's IP address (Use localhost fallback)
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        const apiUrl = `https://api.techniknews.net/ipgeo/${clientIp}`;

        //Fetch location data
        const response = await axios.get<LocationData>(apiUrl);
        const locationData = response.data;
        console.log(locationData);

        // Send back the location
        res.json({
            city: locationData.city || "Unknown",
            region: locationData.regionName || "Unknown",
            country: locationData.country || "Unknown"
        });
        
    } catch(error) {
        console.error('Error fetching location: ', error);
        res.status(500).json({ error: 'Failed to fetch location' });
    }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
