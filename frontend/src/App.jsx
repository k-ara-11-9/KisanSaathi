import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes.jsx';

import Landing from './pages/Landing/Landing.jsx';
import About from './pages/About/About.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';

import Dashboard from './pages/Dashboard/Dashboard.jsx';
import DiseaseDetection from './pages/Disease/DiseaseDetection.jsx';
import SmartRecommendation from './pages/Recommendation/SmartRecommendation.jsx';
import MandiPrices from './pages/Mandi/MandiPrices.jsx';
import History from './pages/History/History.jsx';
import Profile from './pages/Profile/Profile.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';

import ProtectedRoute from './components/common/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      {/* Marketing */}
      <Route path={ROUTES.HOME} element={<Landing />} />
      <Route path="/landing" element={<Navigate to={ROUTES.HOME} replace />} />
      <Route path={ROUTES.ABOUT} element={<About />} />

      {/* Auth */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

      {/* App shell — behind ProtectedRoute */}
      <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path={ROUTES.DISEASE} element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
      <Route path={ROUTES.RECOMMEND} element={<ProtectedRoute><SmartRecommendation /></ProtectedRoute>} />
      <Route path={ROUTES.MANDI} element={<ProtectedRoute><MandiPrices /></ProtectedRoute>} />
      <Route path={ROUTES.HISTORY} element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path={ROUTES.PROFILE} element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
