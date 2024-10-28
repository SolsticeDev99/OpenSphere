import React from 'react';
import './HomeScreen.css';
import SearchComponent from './SearchComponent';

const HomeScreen = () => {
    const featuredSpecies = [
        "Elephant", "Flamingo", "Gorilla", "Hippopotamus", "Koala", "Leopard", "Lion", 
        "Octopus", "Orangutan", "Panda", "Penguin", "Rhinoceros", "Shark", "Tiger", 
        "Whale", "Turtle", "Dolphin"
    ];

    return (
        <div className="home-screen">
            <header className="home-header">
                <h1>OpenSphere</h1>
                <nav className="nav-bar">
                    <a href="#about">About</a>
                    <a href="#features">Features</a>
                    <a href="#contact">Contact</a>
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
                    {featuredSpecies.map((animal, index) => (
                        <div className="species-card" key={index}>
                            <h4>{animal}</h4>
                            <p>Learn more about the {animal.toLowerCase()} and its world.</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="about-section" id="about">
                <h3>About OpenSphere</h3>
                <p>OpenSphere is a community-driven wildlife platform providing up-to-date information about various species.</p>
            </section>

            <footer className="home-footer">
                <p>© 2024 OpenSphere | <a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a></p>
            </footer>
        </div>
    );
};

export default HomeScreen;
