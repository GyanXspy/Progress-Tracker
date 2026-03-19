import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import Goals from './pages/Goals';
import Concepts from './pages/Concepts';
import Jobs from './pages/Jobs';
import SignIn from './pages/SignIn';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="questions" element={<Questions />} />
          <Route path="goals" element={<Goals />} />
          <Route path="concepts" element={<Concepts />} />
          <Route path="jobs" element={<Jobs />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
