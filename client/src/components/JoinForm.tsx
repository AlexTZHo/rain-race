import React, { useState } from 'react';

interface JoinFormProps {
    onJoin: (name: string) => void;
}

const JoinForm: React.FC<JoinFormProps> = ({ onJoin }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name) {
        onJoin(name); // Pass the name back to the parent component
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name:</label>
        <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
        />
        <button type="submit">Start</button>
        </form>
    );
};

export default JoinForm;
