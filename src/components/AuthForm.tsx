import React, { useState } from 'react';
import { Button, Form, Card, Container } from 'react-bootstrap';

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (data: { username?: string; email?: string; password: string }) => void;
  toggleForm: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onSubmit, toggleForm }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showForm, setShowForm] = useState(true); // For animation

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onSubmit({ email, password }); // For login, only send email and password
    } else {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      onSubmit({ email, username, password }); // For signup, send email, username, and password
    }
  };
  

  const handleToggleForm = () => {
    setShowForm(false); // Start fade-out
    setTimeout(() => {
      toggleForm();
      setShowForm(true); // Start fade-in
    }, 300); // Match the animation duration
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{
        height: '100vh',
        background: 'linear-gradient(to right, #6a11cb, #2575fc)',
        padding: 0,
        margin: 0,
        maxWidth: '100vw',
      }}
    >
      <Card
        style={{
          maxWidth: '90%',
          width: '30rem',
          padding: '2rem',
          transition: 'opacity 0.3s ease-in-out',
          opacity: showForm ? 1 : 0, // Animation
        }}
      >
        <Card.Body>
          <Card.Title
            style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>
              </>
            )}
            {isLogin && (
              <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>{isLogin ? 'Username' : 'Email address'}</Form.Label>
              <Form.Control
                type={isLogin ? 'text' : 'email'}
                placeholder={isLogin ? 'Enter username' : 'Enter email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>            
            )}
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            {!isLogin && (
              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
            )}
            <Button
              variant="primary"
              type="submit"
              style={{
                width: '100%',
                fontSize: '1.2rem',
                padding: '0.6rem',
              }}
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </Form>
          <Button
            variant="link"
            onClick={handleToggleForm}
            style={{
              marginTop: '1rem',
              fontSize: '1rem',
              display: 'block',
              textAlign: 'center',
              color: '#007bff',
              textDecoration: 'none',
            }}
          >
            {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuthForm;