// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUpComponent from "./components/SignUp";
import HomeScreen from "./components/HomeScreen";
import LoginComponent from "./components/Login";
import Fyp from "./components/fyp";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Fyp />} />
          <Route path="/signup" element={<SignUpComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/fyp" element={<HomeScreen />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
