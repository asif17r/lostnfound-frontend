import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Post } from './Post';
import './profile.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';

interface User {
    userId: number;
    name: string;
    email: string;
    address: string;
    department: string;
}

// Add icons
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/profile`, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
            const data = response.data as { user: User; posts: Post[] };
            setUser(data.user);
            setPosts(data.posts);
            setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="loading">Loading profile data...</div>;
    }

    if (!user) {
        return <div>No user data available</div>;
    }

    return (
        <div className="profile-container">
            <div className="user-info">
                <div className="user-header">
                    <h2>{user.name}</h2>
                    <button className="" onClick={() => navigate('/inbox')}>
                        <MessageIcon />
                        Inbox
                    </button>
                </div>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Department:</strong> {user.department}</p>
                <div className="profile-actions">
                    <button className="update-profile-btn" onClick={() => navigate('/updateProfile')}>
                        <EditIcon />
                        Update Profile
                    </button>
                    <button className="settings-btn" onClick={() => navigate('/passwordchange')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        Change your password
                    </button>
                </div>
            </div>
            <div className="user-posts">
                <h3>User Posts</h3>
                {posts.map(post => (
                    <div key={post.id} className="post">
                        <h4>{post.title}</h4>
                        <p><strong>Category:</strong> {post.category}</p>
                        <p><strong>Status:</strong> {post.status}</p>
                        <button onClick={() => window.location.href = `/post/${post.id}`}>See Details</button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Profile;