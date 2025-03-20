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

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
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
                <button onClick={() => navigate('/updateProfile')}>Update Profile</button>

            </div>
            <div className="user-posts">
                <h3>User Posts</h3>
                {posts.map(post => (
                    <div key={post.id} className="post">
                        <h4>{post.title}</h4>
                        <p><strong>Category:</strong> {post.category}</p>
                        <p><strong>Status:</strong> {post.status}</p>
                        <button onClick={() => window.location.href = `/posts/${post.id}`}>See Details</button>
                    </div>
    
                ))}
            </div>
        </div>
    );
};

export default Profile;