import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';
import Home from './home';
import Signup from './Signup';
import LandingPage from './LandingPage';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';
import { ErrorProvider } from './contexts/ErrorContext';
import SearchResults from './SearchResults';
import Profile from './profile';
import UserProfile from './UserProfile';
import PostDetails from './PostDetails';
import CreatePost from './CreatePost';
import UpdatePost from './UpdatePost';
import UpdateProfile from './UpdateProfile';
import UpdateComment from './UpdateComment';
import Inbox from './Inbox';
import PasswordChange from './PasswordChange';
import VerificationPage from './VerificationPage';
import ForgotPassword from './ForgotPassword';
import ResetPasswordConfirmation from './ResetPasswordConfirmation';
import ImageSearch from './ImageSearch';

const App: React.FC = () => {
    return (
        <ErrorProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/verify-email" element={<VerificationPage />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password-confirmation" element={<ResetPasswordConfirmation />} />
                        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/profile/:id" element={<UserProfile />} />
                        <Route path="/post/:id" element={<ProtectedRoute><PostDetails /></ProtectedRoute>} />
                        <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                        <Route path="/update-post/:id" element={<ProtectedRoute><UpdatePost /></ProtectedRoute>} />
                        <Route path="/update-comment/:id" element={<ProtectedRoute><UpdateComment /></ProtectedRoute>} />
                        <Route path="/UpdateProfile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
                        <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
                        <Route path="/passwordchange" element={<ProtectedRoute><PasswordChange /></ProtectedRoute>} />
                        <Route path="/image-search" element={<ProtectedRoute><ImageSearch /></ProtectedRoute>} />
                        {/* Add other routes here */}
                    </Routes>
                </Router>
            </AuthProvider>
        </ErrorProvider>
    );
}

export default App;