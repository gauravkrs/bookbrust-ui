import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import ExplorePage from './pages/explorePage';
import ProtectedRoute from '../src/utlis/ProtectedRoute';

// Lazy load heavy pages for code splitting
const BookshelfPage = lazy(() => import('./pages/BookshelfPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/bookshelf" element={<BookshelfPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
        </Route>

        {/* 404 fallback can be added here */}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
