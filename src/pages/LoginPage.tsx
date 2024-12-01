import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    if (isLogin) {
      // Navigate to sign-up page when switching from login to signup
      navigate('/signup');
    } else {
      // Navigate back to login page when switching from signup to login
      navigate('/login');
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

      // Store the access token in localStorage after successful login
      localStorage.setItem("access_token", response.data.access_token);
      alert(`Login Successful`);

      // Redirect to the chat page
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
