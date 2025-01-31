import React, { useState, useEffect } from "react";
import JoinForm from "./components/JoinForm";
import Location from "./components/Location";
import Leaderboard from "./components/Leaderboard";
import { User } from "./models/types";
import { useHeartbeat } from "./components/HeartbeatHook";

const App: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [location, setLocation] = useState("Fetching your location...");
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    };

    // Fetch leaderboard on initial load
    fetchLeaderboard();

    // Subscribe to server-sent events
    const eventSource = new EventSource("/api/updates");

    eventSource.onmessage = (event) => {
      try {
        //STOPSHIP: Seems to be somewhat unreliable at times.
        const updatedUsers = JSON.parse(event.data);
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = () => {
      console.error("SSE connection lost, attempting reconnect...");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleJoin = async (name: string) => {
    setUserName(name);

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setLocation(data.user.location); // Update location after joining
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Failed to Join:", error);
    }
  };

  const handleChangeLocation = async (
    name: string,
    lat: number,
    lon: number,
  ) => {
    try {
      await fetch("/api/update-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, lat, lon }),
      })
        .then((result) => result.json())
        .then((data) => setLocation(data.user.location));
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  // Check if user is still online
  useHeartbeat(user);

  return (
    <div>
      <h1>Welcome to Rain Race!</h1>
      {!userName ? (
        <JoinForm onJoin={handleJoin} />
      ) : (
        <Location
          userName={userName}
          location={location}
          onChangeLocation={handleChangeLocation}
        />
      )}

      <Leaderboard users={users} />
    </div>
  );
};

export default App;
