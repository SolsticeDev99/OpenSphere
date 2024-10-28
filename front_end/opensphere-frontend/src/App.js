// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpComponent from './components/SignUp';
import HomeScreen from './components/HomeScreen';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/signup" element={<SignUpComponent />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
