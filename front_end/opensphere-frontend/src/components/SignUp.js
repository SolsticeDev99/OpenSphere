// src/SignUpComponent.js
import React, { useState } from 'react';
import { auth } from './firebaseConfig'; // Import your Firebase configuration
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './SignUpComponent.css'; // Import your CSS file for styling
import { getDatabase,set,ref } from 'firebase/database';

const SignUpComponent = () => {
    const [username, setUsername] = useState(''); // State for username
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(''); // Clear previous errors
        setSuccess(''); // Clear previous success messages

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user
            
            const db = getDatabase();
            await set(ref(db,`users/${user.uid}`),{
                username:username,
                email:email,
                createdAt: new Date().toISOString(),
            });
            
            setSuccess('User registered successfully!'); // Show success message
        } catch (err) {
            setError(err.message); // Show error message
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp} className="signup-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
};

export default SignUpComponent;
