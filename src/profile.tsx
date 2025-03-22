import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Post } from './Post';
import './profile.css';
import { useNavigate } from 'react-router-dom';

interface User {
    userId: number;
    name: string;
    email: string;
    address: string;
    department: string;
}

interface ProfileProps {
    user: User;
    posts: Post[];
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
        axios.get('http://localhost:8080/profile', {
            headers: {
            Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
            const data = response.data as { user: User; posts: Post[] };
            setUser(data.user);
            setPosts(data.posts);
            // Store the userId in localStorage for later use
            localStorage.setItem('userId', data.user.userId.toString());
            })
            .catch(error => console.error('Error fetching profile data:', error));
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="user-info">
                <h2>{user.name}</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Department:</strong> {user.department}</p>
                <div className="profile-actions">
                    <button className="update-profile-btn" onClick={() => navigate('/updateProfile')}>
                        <EditIcon />
                        Update Profile
                    </button>
                    <button className="message-btn" onClick={() => navigate('/inbox')}>
                        <MessageIcon />
                        View Messages
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