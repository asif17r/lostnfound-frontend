import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdatePassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match');
            return;
        }

        if (!token) {
            alert('No token found. Please log in again.');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.put('http://localhost:8080/profile/password', {
                currentPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                alert('Password updated successfully');
                navigate('/profile'); // Redirect to profile page after update
            } else {
                alert('Error updating password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Error updating password');
        }
    };

    return (
        <div className="update-password-container">
            <h1>Update Password</h1>
            <form onSubmit={handleUpdatePassword}>
                <div>
                    <label>Current Password:</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>
                <div>
                    <label>New Password:</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit">Update Password</button>
                <button type="button" onClick={() => navigate('/profile')}>Cancel</button>
            </form>
        </div>
    );
};

export default UpdatePassword;