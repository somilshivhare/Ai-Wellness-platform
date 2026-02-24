import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VideoCall from './Pages/VideoCall';
import Landing from './Pages/Landing';
import FindTherapist from './Pages/FindTherapist';
import Contact from './Pages/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/video-chat" element={<VideoCall />} />
        {/* keep booking route for backwards compatibility, redirect to find page */}
        <Route path="/booking" element={<FindTherapist />} />
        <Route path="/find" element={<FindTherapist />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;