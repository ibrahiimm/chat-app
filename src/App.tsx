import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import ChatPage from './pages/ChatPage';

const App: React.FC = () => {
  const HARDCODED_TOKEN = "hardcoded_access_token";

  // Redirect logic to add the token to the URL if missing
  const RedirectWithToken: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const token = params.get('access_token');

      if (!token) {
        // Redirect to the same page with the hardcoded token in the query
        navigate(`?access_token=${HARDCODED_TOKEN}`, { replace: true });
      }
    }, [location, navigate]);

    return null; // This component is only for redirection
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<><RedirectWithToken /><ChatPage /></>} />
        <Route path="/chat" element={<><RedirectWithToken /><ChatPage /></>} />
      </Routes>
    </Router>
  );
};

export default App;