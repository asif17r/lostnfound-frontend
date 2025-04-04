import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerificationPage.css';

interface LocationState {
    email: string;
}

const ResetPasswordConfirmation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email } = (location.state as LocationState) || { email: '' };

    return (
        <div className="verification-container">
            <div className="verification-card">
                <h2>Check Your Email</h2>
                <div className="verification-content">
                    <p>We've sent password reset instructions to:</p>
                    <p className="email-address">{email}</p>
                    <p>Please check your email and follow the link to reset your password.</p>
                    <p className="note">If you don't see the email, please check your spam folder.</p>
                    <button 
                        className="login-button"
                        onClick={() => navigate('/login')}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordConfirmation; 