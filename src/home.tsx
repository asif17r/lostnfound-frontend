import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './home.css';
import { Post } from './Post';

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const token = localStorage.getItem('token');
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

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
            <div className="header-content">
                <h1>Lost and Found</h1>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="search-box"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const query = (e.target as HTMLInputElement).value;
                            window.location.href = `/search?q=${query}`;
                        }
                    }}
                />
                <button onClick={() => navigate('/create-post')} className="create-post-button">Create Post</button>
            </div>
            <ul className="post-list">
                {posts.map(post => (
                    <li key={post.id} className="post-item">
                        <h2 className="post-title">{post.title}</h2>
                        <p className="post-text"><strong>Category:</strong> {post.category}</p>
                        <p className="post-text"><strong>Status:</strong> {post.status}</p>
                        <button 
                            onClick={() => navigate(`/posts/${post.id}`)}
                            className="details-button"
                        >
                            See Details
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;