import React, { useState } from 'react';
import './AuthComponent.css';

const AuthComponent = ({ type }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        // Simple mock validation for demonstration
        if (!email || !password) {
            setError('All fields are required.');
            return;
        }
        // Mock authentication logic (you can replace it with your API call)
        if (type === 'login') {
            console.log('Logging in with:', { email, password });
        } else {
            console.log('Signing up with:', { email, password });
        }
    };

    return (
        <div className="auth-component">
            <h2>{type === 'login' ? 'Login' : 'Sign Up'}</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">{type === 'login' ? 'Login' : 'Sign Up'}</button>
            </form>
        </div>
    );
};

export default AuthComponent;
