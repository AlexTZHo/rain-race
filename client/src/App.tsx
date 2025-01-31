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
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      }
    };

    // Fetch leaderboard on initial load
    fetchLeaderboard();

    // Subscribe to server-sent events
    const eventSource = new EventSource('/api/updates');

    eventSource.onmessage = (event) => {
      try {
        const updatedUsers = JSON.parse(event.data);
        setUsers(updatedUsers);
        const userObj = updatedUsers.find((user: User) => user.name === userName);
        if (location !== userObj.location) setLocation(userObj.location)
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    }

    eventSource.onerror = () => {
      console.error('SSE connection lost, attempting reconnect...')
      eventSource.close();
    };

    return () => {
      eventSource.close();
    }
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
        setupLeaveRace(name) // Set Leave Race callback
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to Join:', error);
    }
  };

  const handleChangeLocation = async (name: string, lat: number, lon: number) => {
    try {
        const response = await fetch('/api/update-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, lat, lon }),
        });

        if (response.ok) {
            console.log("Location updated successfully.");
        } else {
            console.error("Failed to update location.");
        }
    } catch (error) {
        console.error("Error updating location:", error);
    }
};

  const setupLeaveRace = (name: string) => {
    const leaveRace = () => {
      const data = JSON.stringify({ name });
      navigator.sendBeacon('/api/leave', data);
      console.log(`${name} left the race.`);
    };
  
    window.addEventListener('beforeunload', leaveRace);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) leaveRace();
    });
  
    return () => {
      window.removeEventListener('beforeunload', leaveRace);
      document.removeEventListener('visibilitychange', leaveRace);
    };
  };

  return (
    <div>
      <h1>Welcome to Rain Race!</h1>
      {!userName ? (
        <JoinForm onJoin={handleJoin} />
      ) : (
        <Location userName={userName} location={location} onChangeLocation={handleChangeLocation} />
      )}

      <Leaderboard users={users} />
    </div>
  );
};

export default App;
