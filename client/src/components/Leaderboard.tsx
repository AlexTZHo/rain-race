import React from 'react';
import { User } from '../models/types';

interface LeaderboardProps {
    users: User[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => (
    <div>
        <h2>Leaderboard</h2>
        <ul>
            {users.length === 0 ? (
                <li>Waiting for players...</li>
            ) : (
                users.map((user, index) => (
                <li key={index}>
                    {user.rainfall} inches -- {user.name} - {user.weather} ({user.isOnline ? 'online' : 'offline'})
                </li>
                ))
            )}
        </ul>
    </div>
);

export default Leaderboard;
