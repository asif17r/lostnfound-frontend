import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';
import Home from './home';
import Signup from './Signup';
import LandingPage from './LandingPage';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    {/* Add other routes here */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;