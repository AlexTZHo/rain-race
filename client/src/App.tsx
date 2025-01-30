import React, { useState, useEffect } from 'react';
import JoinForm from './components/JoinForm';
import Location from './components/Location';
import Leaderboard from './components/Leaderboard';
import { User } from './models/types';

const App: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [location, setLocation] = useState('Fetching your location...');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch leaderboard on initial load
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleJoin = async (name: string) => {
    setUserName(name);

    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      if (response.ok) {
        setLocation(data.user.location); // Update location after joining
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to Join:', error);
    }
  };

  const handleChangeLocation = () => {
    // Handle location change logic here (e.g., integrate Google Maps or a dropdown)
    console.log('Change Location clicked');
  };

  return (
    <div>
      <h1>Welcome to Rain Race!</h1>
      {!userName ? (
        <JoinForm onJoin={handleJoin} />
      ) : (
        <Location location={location} onChangeLocation={handleChangeLocation} />
      )}

      <Leaderboard users={users} />
    </div>
  );
};

export default App;
