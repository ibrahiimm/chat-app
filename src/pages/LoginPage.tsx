import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');

  const toggleForm = () => {
    if (isLogin) {
      navigate('/signup');
      setIsLogin(false);
    } else {
      navigate('/login');
      setIsLogin(true);
    }
  };

  const handleSubmit = async (data: { email?: string; password: string }) => {
    if (!data.email || !data.password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/sign_in', {
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("access_token", response.data.access_token);
      alert(`Login Successful`);
      navigate('/chat');
    } 
    catch (error: any) {
      alert(`Login Failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <AuthForm isLogin={isLogin} onSubmit={handleSubmit} toggleForm={toggleForm} />
  );
};

export default LoginPage;