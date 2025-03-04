import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import './home.css';

interface Post {
    id: number;
    title: string;
    description: string;
    location: string;
    date: string;
    time: string;
    category: string;
    status: string;
    range: number;
    uploadTime: string;
    lastUpdatedTime: string;
}

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/posts', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [token]);

    return (
        <div className="home-container">
            <header className="home-header">
                <button 
                    onClick={() => {
                        authContext?.logout();
                        window.location.href = '/';
                    }} 
                    className="logout-button"
                >
                    Logout
                </button>
                <a href="/profile" className="profile-link">My Profile</a>
            </header>
            <h1>Lost and Found</h1>
            <ul className="post-list">
                {posts.map(post => (
                    <li key={post.id} className="post-item">
                        <h2 className="post-title">{post.title}</h2>
                        <p className="post-text">{post.description}</p>
                        <p className="post-text"><strong>Location:</strong> {post.location}</p>
                        <p className="post-text"><strong>Date:</strong> {post.date}</p>
                        <p className="post-text"><strong>Time:</strong> {post.time}</p>
                        <p className="post-text"><strong>Category:</strong> {post.category}</p>
                        <p className="post-text"><strong>Status:</strong> {post.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
