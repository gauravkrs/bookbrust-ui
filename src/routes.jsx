import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import ExplorePage from './pages/explorePage';
import BookshelfPage from './pages/BookshelfPage';
import TimelinePage from './pages/TimelinePage';
import ProtectedRoute from  './utlis/ProtectedRoute'

const AppRoutes = () => {
  return (

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

      {/* 404 fallback can go here */}
    </Routes>
  );
};

export default AppRoutes;
