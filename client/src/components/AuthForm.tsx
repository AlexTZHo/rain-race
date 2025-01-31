import React, { useState } from 'react';
import { JoinFormProps } from './JoinForm';

//STOPSHIP: Double check to make sure this auth form can work on api routes

const AuthForm: React.FC<JoinFormProps> = ({onJoin}) => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (username) {
            onJoin(username)
        }

        //TODO: Handle duplicate usernames for registering. 
        // Can move back to email for something more unique if necessary. 
        try {
            const endpoint = isLogin ? '/api/login' : '/api/register';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            const data = await response.json();
            console.log('Success:', data);
        // STOPSHIP: Add name so it sends to parent component through JoinFormProps
        } catch {
            setError('Something went wrong');
        }
    };

    return (
        <div className="auth-form">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="toggle-button"
            >
            {isLogin ? 'Register' : 'Login'}
            </button>
        </p>
        </div>
    );
};

export default AuthForm;