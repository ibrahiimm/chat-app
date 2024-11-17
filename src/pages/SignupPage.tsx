// src/pages/SignupPage.tsx
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { signupAPI } from '../api/auth';

const SignupPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = async (data: { email?: string; username?: string; password: string }) => {
    if (!data.email || !data.username || !data.password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await signupAPI(data.username, data.password);
      alert(`Signup Successful: ${response.data.message}`);
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
