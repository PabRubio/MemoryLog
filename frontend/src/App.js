import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MemoryLog from './components/MemoryLog';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import NotFound from './components/NotFound';
import ServerError from './components/ServerError';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/snippets" element={<MemoryLog />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;