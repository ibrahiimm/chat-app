import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import axios from 'axios';

const SignupPage: React.FC = () => {
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

  const handleSubmit = async (data: { email?: string; username?: string; password: string }) => {
    if (!data.email || !data.username || !data.password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/register', {
        email: data.email,
        username: data.username,
        password: data.password,
      });

      alert(`Signup Successful: ${response.data.message}`);
      navigate('/login');
    } 
    catch (error: any) {
      alert(`Signup Failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <AuthForm isLogin={isLogin} onSubmit={handleSubmit} toggleForm={toggleForm} />
  );
};

export default SignupPage;