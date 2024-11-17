import React from 'react';
import './App.css';

import { Button, Alert } from 'react-bootstrap';

const App: React.FC = () => {
  return (
    <div className="container mt-5">
      <Alert variant="primary">This is a Bootstrap alert!</Alert>
      <Button variant="primary">Click Me</Button>
    </div>
  );
};

export default App;