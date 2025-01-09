import React from "react";
import "./fypComponent.css";
import { useNavigate } from "react-router-dom";

const Fyp = () => {
  const navigate = useNavigate(); // Get the navigate function

  const handleSignUp = () => {
    navigate("/signup"); // Navigate to the Sign Up page when clicked
  };
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="instagram-home">
      <div className="left-section">
        <h1 className="app-title">OpenSphere</h1>
        <p className="tagline">
          Discover, Connect, and Share Your Wildlife Adventures
        </p>
      </div>

      <div className="right-section">
        <h2>Welcome to OpenSphere!</h2>
        <p>
          Dive into the world of wildlife exploration. Connect with others who
          share your passion for nature and discover new adventures.
        </p>
        <button className="btn" onClick={handleLogin}>
          Login
        </button>
        <button className="btn" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Fyp;
