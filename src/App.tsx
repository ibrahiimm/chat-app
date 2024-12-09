import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatPage from './pages/ChatPage';

const App: React.FC = () => {
  // Hardcoded token (ensure this matches the token used in your backend)
  const HARDCODED_TOKEN = "hardcoded_access_token";

  // Save the token in memory when the app starts (optional for testing localStorage behavior)
  localStorage.setItem("access_token", HARDCODED_TOKEN);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default App;