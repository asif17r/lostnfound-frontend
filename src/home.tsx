import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Post, { Post as PostType } from './Post';
import './home.css';
import { API_BASE_URL } from './config';

interface PostData extends PostType {}

// Add icons
const CreatePostIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Home: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { token, logout } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchPosts();
    }, [token, navigate]);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.status === 401) {
                // Token expired or invalid
                logout();
                navigate('/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            } else {
                throw new Error('Failed to fetch posts');
            }
        } catch (error) {
            setError('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading posts...</p>
            </div>
        );
    }

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="header-left">
                    <h1 onClick={() => window.location.reload()} style={{ cursor: 'pointer', color: '#4A90E2', fontSize: '2rem', fontWeight: 'bold' }}>Lost & Found</h1>
                </div>
                <div className="header-right">
                    <button className="create-post-btn" onClick={() => navigate('/create-post')}>
                        <CreatePostIcon />
                        Create Post
                    </button>
                    
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch(e);
                                }
                            }}
                        />
                    </div>

                    <div className="profile-menu">
                        <button 
                            className="profile-button"
                            onClick={() => navigate('/profile')}
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"/>
                            </svg>
                        </button>
                        <button 
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path d="M16 13v-2H7V8l-5 4 5 4v-3z"/>
                                <path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <main className="posts-container">
                {loading ? (
                    <div className="loading">Loading posts...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    posts.map((post) => (
                        <Post key={post.id} post={post} />
                    ))
                )}
            </main>
        </div>
    );
};

export default Home;