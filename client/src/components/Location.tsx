import React, { useState } from 'react';

interface LocationProps {
    location: string;
    userName: string; // Pass the username
    onChangeLocation: (name: string, lat: number, lon: number) => void;
}

const Location: React.FC<LocationProps> = ({ location, userName, onChangeLocation }) => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleSubmit = () => {
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        // TODO: Add more checks for valid lat and lon coordinates
        if (!isNaN(lat) && !isNaN(lon)) {
            onChangeLocation(userName, lat, lon); // Send data to parent
        } else {
            alert("Please enter valid coordinates.");
        }
    };

    return (
        <div>
            <h2>Current Location</h2>
            <p>{location}</p>
            
            <input
                type="text"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
            />
            <input
                type="text"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
            />
            
            <button onClick={handleSubmit}>Change Location</button>
        </div>
    );
};

export default Location;