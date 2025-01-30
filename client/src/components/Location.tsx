import React from 'react';

interface LocationProps {
    location: string;
    onChangeLocation: () => void;
}

const Location: React.FC<LocationProps> = ({ location, onChangeLocation }) => (
    <div>
        <h2>Current Location</h2>
        <p>{location}</p>
        <button onClick={onChangeLocation}>Change Location</button>
    </div>
);

export default Location;
