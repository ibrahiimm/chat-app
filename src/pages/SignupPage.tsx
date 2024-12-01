import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import axios from 'axios';

const SignupPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    if (isLogin) {
      // Navigate to login page when switching from signup to login
      navigate('/login');
    } else {
      // Navigate to sign-up page when switching from login to signup
      navigate('/signup');
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
      // Optionally navigate to login page after successful signup
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