import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import AuthComponent from './components/AuthComponent';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/auth" element={<AuthComponent />} />
            </Routes>
        </Router>
    );
};

export default App;
