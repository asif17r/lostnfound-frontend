import React, { useState } from 'react';
import axios from 'axios';
import './PasswordChange.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';

const PasswordChange: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/profile/password`, {
                currentPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccess('Password changed successfully');
            setError('');
            setTimeout(() => navigate('/profile'), 2000); // Redirect to profile after 2 seconds
        } catch (error) {
            setError('Error changing password');
            setSuccess('');
        }
    };

    return (
        <div className="password-change-container">
            <h2>Change Password</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="change-password-btn">Change Password</button>
            </form>
        </div>
    );
};

export default PasswordChange;