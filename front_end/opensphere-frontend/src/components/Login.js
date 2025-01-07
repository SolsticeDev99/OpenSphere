import React, { useState } from 'react';
import { auth,provider } from './firebaseConfig'; // Import your Firebase configuration
import { signInWithEmailAndPassword,signInWithPopup } from 'firebase/auth';
import './LoginComponent.css'; // Import the CSS file for styling
import { getDatabase,ref,get } from 'firebase/database';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(''); // Clear previous errors
        setSuccess(''); // Clear previous success messages

        try {
            // Log in user with email and password
            await signInWithEmailAndPassword(auth, email, password);
            setSuccess('Logged in successfully!'); // Show success message
        } catch (err) {
            setError(err.message); // Show error message
        }
    };

    const handle_google_login = async (e) => {
        setError(''); // Clear previous errors
        setSuccess(''); // Clear previous success messages  
    
        try{   
            const result = await signInWithPopup(auth,provider);
            const user = result.user;
            const db = getDatabase();
            const userRef = ref(db,`users/${user.uid}`);
            const snapshot = await get(userRef);
        
            if(snapshot.exists()){
                setSuccess('User logedin successfully!'); // Show success message
            } else {    
                setError('User not found for this google user.Please signup first!'); // Show error message
            }
        } catch (err) {
            setError(err.message); // Show error message
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="login-form">
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
                <button type="submit" className="login-button">Login</button>
                <button id='google_login_bt' type="button" className="login_google" onClick={handle_google_login}>Login With Google</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
};

export default LoginComponent;
