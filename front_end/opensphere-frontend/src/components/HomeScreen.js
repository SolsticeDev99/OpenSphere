import React from "react";
import "./HomeScreen.css";
import SearchComponent from "./SearchComponent";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const HomeScreen = () => {
  const navigate = useNavigate(); // Get the navigate function

  // Function to handle navigation to the data page
  const handleGoToDataPage = () => {
    navigate("/view"); // Navigate to the data page
  };

  return (
    <div className="home-screen">
      <header className="home-header">
        <h1>OpenSphere</h1>
        <nav className="nav-bar">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
          {/* Button placed near the About, Features, and Contact links */}
          <button onClick={handleGoToDataPage} className="explore-data-button">
            Explore Wildlife Data
          </button>
        </nav>
      </header>

      <section className="hero-section">
        <h2>Welcome to OpenSphere</h2>
        <p>Your portal to explore the world of wildlife</p>
      </section>

      <section className="search-section">
        <SearchComponent />
      </section>

      <section className="featured-section">
        <h3>Featured Species</h3>
        <div className="featured-species">
          <div className="species-card">
            <h4>Elephant</h4>
            <p>Discover the world of these gentle giants.</p>
          </div>
          <div className="species-card">
            <h4>Flamingo</h4>
            <p>Learn about their vibrant habitats.</p>
          </div>
          <div className="species-card">
            <h4>Gorilla</h4>
            <p>Explore the lives of these intelligent primates.</p>
          </div>
          <div className="species-card">
            <h4>Hippopotamus</h4>
            <p>Learn about these massive river dwellers.</p>
          </div>
          <div className="species-card">
            <h4>Koala</h4>
            <p>Discover the cuddly marsupials of Australia.</p>
          </div>
          <div className="species-card">
            <h4>Leopard</h4>
            <p>Study the agility and beauty of these big cats.</p>
          </div>
          <div className="species-card">
            <h4>Lion</h4>
            <p>The king of the jungle!</p>
          </div>
          <div className="species-card">
            <h4>Octopus</h4>
            <p>Marvel at these intelligent ocean dwellers.</p>
          </div>
          <div className="species-card">
            <h4>Orangutan</h4>
            <p>Discover the tree-dwelling great apes.</p>
          </div>
          <div className="species-card">
            <h4>Panda</h4>
            <p>Learn about these beloved black-and-white bears.</p>
          </div>
          <div className="species-card">
            <h4>Penguin</h4>
            <p>Explore the fascinating lives of these flightless birds.</p>
          </div>
          <div className="species-card">
            <h4>Rhinoceros</h4>
            <p>Discover these massive and endangered animals.</p>
          </div>
          <div className="species-card">
            <h4>Shark</h4>
            <p>Study these powerful ocean predators.</p>
          </div>
          <div className="species-card">
            <h4>Tiger</h4>
            <p>Learn about the world's largest wild cat.</p>
          </div>
          <div className="species-card">
            <h4>Whale</h4>
            <p>Explore the majestic giants of the sea.</p>
          </div>
          <div className="species-card">
            <h4>Turtle</h4>
            <p>Discover the slow-moving reptiles of the ocean.</p>
          </div>
          <div className="species-card">
            <h4>Dolphin</h4>
            <p>Learn about these intelligent marine mammals.</p>
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <h3>About OpenSphere</h3>
        <p>
          OpenSphere is a community-driven wildlife platform providing
          up-to-date information about various species.
        </p>
      </section>

      <footer className="home-footer">
        <p>
          © 2024 OpenSphere | <a href="#privacy">Privacy Policy</a> |{" "}
          <a href="#terms">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
};

export default HomeScreen;
