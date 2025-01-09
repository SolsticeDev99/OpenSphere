// src/SignUpComponent.js
import React, { useState } from "react";
import { auth, provider } from "./firebaseConfig"; // Import your Firebase configuration
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./SignUpComponent.css"; // Import your CSS file for styling
import { getDatabase, set, ref, get } from "firebase/database";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUpComponent = () => {
  const [username, setUsername] = useState(""); // State for username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages
    const sanitized_email = email.replace(/[.#$[\]]/g, "_");

    try {
      const usersnapshot = await get(
        ref(getDatabase(), `users/${sanitized_email}`)
      );
      if (usersnapshot.exists()) {
        setError("User already exists!"); // Show error message
        return;
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const db = getDatabase();
      await set(ref(db, `users/${sanitized_email}`), {
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
      });

      setSuccess("User registered successfully!"); // Show success message
      navigate("/fyp");
    } catch (err) {
      setError(err.message); // Show error message
    }
  };

  const handle_google_signup = async (e) => {
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        setSuccess(
          "Account already exists with this email. Please log in or use a different email."
        ); // Show success message
      } else {
        await set(ref(db, `users/${user.uid}`), {
          username: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString(),
        });
        setSuccess("User registered successfully!"); // Show success message
        navigate("/fyp");
      }
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
        <button type="submit" className="signup-button">
          Sign Up
        </button>
        <button
          id="signup_google_bt"
          type="button"
          className="signup_google"
          onClick={handle_google_signup}
        >
          Sign Up With Google
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default SignUpComponent;
