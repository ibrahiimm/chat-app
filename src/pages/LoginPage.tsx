// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { loginAPI } from '../api/auth';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = async (data: { username?: string; password: string }) => {
    if (!data.username || !data.password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await loginAPI(data.username, data.password);
      alert(`Login Successful: ${response.data.message}`);
    } catch (error: any) {
      alert(`Login Failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <AuthForm isLogin={isLogin} onSubmit={handleSubmit} toggleForm={toggleForm} />
  );
};

export default LoginPage;
