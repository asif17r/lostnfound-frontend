import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post } from './types';
import { useAuth } from './AuthContext';
import './UserProfile.css';
import { API_BASE_URL } from './config';

const UserProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/profile/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                const data = await response.json();
                setUser(data.user);
                setPosts(data.posts);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id && token) {
            fetchUserProfile();
        }
    }, [id, token]);

    const handleMessageUser = () => {
        // Navigate to inbox and pass the recipient data
        console.log("Sending message to " + JSON.stringify(user));
        navigate('/inbox', { 
            state: { 
                recipient: {
                    userId: user.id,
                    name: user.name,
                    email: user.email
                } 
            } 
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="error-container">
                <p>User not found</p>
                <button onClick={() => navigate('/home')}>Return to Home</button>
            </div>
        );
    }

    // Check if this is the current user's profile
    const isOwnProfile = user.userId === Number(localStorage.getItem('userId'));

    return (
        <div className="profile-container">
            <div className="user-info">
                <h2>{user.name}</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Department:</strong> {user.department}</p>
                {!isOwnProfile && (
                    <button className="message-btn" onClick={handleMessageUser}>
                        Message User
                    </button>
                )}
            </div>  
            <div className="user-posts">
                <h3>User Posts</h3>
                {posts.length === 0 ? (
                    <p>No posts found</p>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="post">
                            <h4>{post.title}</h4>
                            <p><strong>Category:</strong> {post.category}</p>
                            <p><strong>Status:</strong> {post.status}</p>
                            <button onClick={() => navigate(`/post/${post.id}`)}>See Details</button>
                        </div>
                    ))
                )}
            </div>  
        </div>
    );
};

export default UserProfile;