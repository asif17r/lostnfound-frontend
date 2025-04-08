import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateProfile.css';
import { API_BASE_URL } from './config';

interface User {
    userId: number;
    name: string;
    email: string;
    address: string;
    department: string;
}

const UpdateProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [department, setDepartment] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = response.data as { user: User };
                setUser(data.user);
                setName(data.user.name);
                setEmail(data.user.email);
                setAddress(data.user.address);
                setDepartment(data.user.department);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfile();
    }, [token]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/updateProfile`, {
                name,
                email,
                address,
                department
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/profile'); // Redirect to profile page after update
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="update-profile-container">
            <h1>Update Profile</h1>
            <form onSubmit={handleUpdateProfile}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Address:</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div>
                    <label>Department:</label>
                    <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                </div>
                <div className="button-group">
                    <button type="submit" style={{ float: 'left' }}>Update Profile</button>
                    <button type="button" style={{ float: 'right' }} onClick={() => navigate('/profile')}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProfile;