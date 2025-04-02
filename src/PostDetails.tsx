import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Comments from './Comments';
import { useAuth } from './AuthContext';
import './PostDetails.css';
import { API_BASE_URL } from './config';

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
    userId: number;
    userName: string;
}

const PostDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [myId, setMyId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { token } = useAuth();

    // Fetch post details
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setPost(data);
            } catch (error) {
                console.error('Error fetching post details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [id, token]);

    // Handle post deletion
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        
        try {
            await fetch(`${API_BASE_URL}/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/home');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Fetch my ID
    useEffect(() => {
        const fetchMyId = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/myId`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setMyId(data);
            } catch (error) {
                console.error('Error fetching my ID:', error);
            }
        };

        fetchMyId();
    }, [token]);

    // Format date and time
    const formatDateTime = () => {
        if (!post) return '';
        const date = new Date(post.date);
        date.setHours(parseInt(post.time.split(':')[0]));
        date.setMinutes(parseInt(post.time.split(':')[1]));
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading post details...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="error-container">
                <h2>Post not found</h2>
                <button onClick={() => navigate('/home')} className="back-button">
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="post-details-container">
            <div className="post-details-header">
                <button onClick={() => navigate('/home')} className="back-button">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                    Back to Posts
                </button>
                {myId === post.userId && (
                    <div className="post-actions">
                        <button onClick={() => navigate(`/update-post/${post.id}`)} className="edit-button">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.05c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                            Edit
                        </button>
                        <button onClick={handleDelete} className="delete-button">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <article className="post-details-content">
                <div className="post-details-sidebar">
                    <div className="author-avatar">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                    </div>
                    <div className="post-meta">
                        <div className="post-category">
                            <span className="post-category-title">Post Details</span>
                            <span className="category-tag">{post.category}</span>
                            <span className="status-tag">{post.status}</span>
                        </div>
                        <div className="post-author">
                            <Link to={`/profile/${post.userId}`} className="author-name">
                                {post.userName}
                            </Link>
                            <span className="post-time">{formatDateTime()}</span>
                        </div>
                    </div>
                </div>

                <div className="post-details-main">
                    <h1 className="post-title">{post.title}</h1>
                    <p className="post-description">{post.description}</p>

                    <div className="post-info-grid">
                        <div className="info-item">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            <span>{post.location}</span>
                        </div>
                        <div className="info-item">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                            </svg>
                            <span>{formatDateTime()}</span>
                        </div>
                        <div className="info-item">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                            </svg>
                            <span>Within {post.range}km</span>
                        </div>
                    </div>

                    <div className="comments-section">
                        <h2>Comments</h2>
                        <Comments postId={post.id} />
                    </div>
                </div>
            </article>
        </div>
    );
};

export default PostDetails;
