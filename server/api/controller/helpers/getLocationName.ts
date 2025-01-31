import axios from 'axios';
import { Address, OpenStreetLocationData } from '../../models/constants';

export async function getLocationName(lat: number, lon: number): Promise<string> {
    try {
        const response = await axios.get<OpenStreetLocationData>(
        `https://nominatim.openstreetmap.org/reverse`,
        {
            params: {
            lat,
            lon,
            format: 'json',
            addressdetails: 1,
            'accept-language': 'en'
            },
            headers: {
            'User-Agent': 'RainRace/1.0'
            }
        },
        );

        const address: Address = response.data.address;
        if (!address) {
            return "Error in fetching new location"
        } 
        
        return [address.city, address.state, address.country].join(", ");
    } catch (error) {
        console.error('Reverse geocoding failed:', error);
        return `(${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    }
}