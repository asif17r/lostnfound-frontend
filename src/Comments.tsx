import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Comments.css';

interface Comment {
    id: number;
    content: string;
    userId: number;
    createdAt: string;
    postId: number;
}

interface CommentsProps {
    postId: number;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [usernames, setUsernames] = useState<Map<number, string>>(new Map());
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    // Fetch user ID
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch('http://localhost:8080/myId', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setUserId(data);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserId();
    }, [token]);

    // Fetch comments
    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:8080/comments`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            const filteredComments = data.filter((comment: Comment) => comment.postId === postId);
            setComments(filteredComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Fetch username by userId
    const fetchUsername = async (userId: number) => {
        if (usernames.has(userId)) return;

        try {
            const response = await fetch(`http://localhost:8080/profile/${userId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`Failed to fetch user ${userId}`);

            const userData = await response.json();
            setUsernames(prev => new Map(prev.set(userId, userData.user.name)));
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };

    // Fetch comments on component mount
    useEffect(() => {
        fetchComments();
    }, [postId, token]);

    // Fetch usernames when comments change
    useEffect(() => {
        comments.forEach(comment => fetchUsername(comment.userId));
    }, [comments]);

    // Handle adding a new comment
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userId === null) return;

        try {
            const response = await fetch('http://localhost:8080/comments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content, postId, userId })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            setContent('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Handle deleting a comment
    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        
        try {
            await fetch(`http://localhost:8080/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="comments-loading">
                <div className="loading-spinner"></div>
                <p>Loading comments...</p>
            </div>
        );
    }

    return (
        <div className="comments-container">
            <div className="comments-list">
                {comments.map(comment => (
                    <div key={comment.id} className="comment-card">
                        <div className="comment-header">
                            <div className="comment-author">
                                <div className="author-avatar">
                                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                    </svg>
                                </div>
                                <div className="author-info">
                                    <Link to={`/profile/${comment.userId}`} className="author-name">
                                        {usernames.get(comment.userId) || 'Loading...'}
                                    </Link>
                                    <span className="comment-time">{formatDate(comment.createdAt)}</span>
                                </div>
                            </div>
                            {userId === comment.userId && (
                                <div className="comment-actions">
                                    <button 
                                        onClick={() => navigate(`/update-comment/${comment.id}`)}
                                        className="edit-button"
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.05c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="delete-button"
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="comment-content">{comment.content}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddComment} className="comment-form">
                <div className="comment-input-wrapper">
                    <div className="comment-avatar">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                    </div>
                    <div className="comment-input-container">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write a comment..."
                            required
                            className="comment-input"
                        />
                        <button type="submit" className="submit-button">
                            Post
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Comments;