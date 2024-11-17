import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import AuthForm from '../components/AuthForm';
import { loginAPI } from '../api/auth';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = async (data: { username?: string; password: string }) => {
    if (!data.username || !data.password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await loginAPI(data.username, data.password);
      alert(`Login Successful: ${response.data.message}`);
      navigate('/chat'); // Navigate to the Chat page
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