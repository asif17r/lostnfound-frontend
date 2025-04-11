import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post as PostType } from './types';
import './Post.css';
import { fetchImageUrl } from './utils';
import { useAuth } from './AuthContext';

interface PostProps {
    post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        const loadImage = async () => {
            if (post.imageId && token) {
                const url = await fetchImageUrl(post.imageId, token);
                setImageUrl(url);
            }
        };
        loadImage();
    }, [post.imageId, token]);

    // Format the date and time together
    const formatDateTime = () => {
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

    return (
        <article className="post-card">
            <div className="post-sidebar">
                <div className="author-avatar">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                </div>
                <div className="post-category">
                    <span className="category-tag">{post.category}</span>
                    <span className="status-tag">{post.status}</span>
                </div>
            </div>

            <div className="post-main">
                <header className="post-header">
                    <div className="post-author">
                        <Link to={`/profile/${post.userId}`} className="author-name">{post.userName}</Link>
                        <span className="post-time">{formatDateTime()}</span>
                    </div>
                </header>

                <div className="post-content">
                    <h2 className="post-title">{post.title}</h2>
                    {imageUrl && (
                        <div className="post-thumbnail">
                            <img src={imageUrl} alt={post.title} />
                        </div>
                    )}
                    <p className="post-description">{post.description}</p>
                    <div className="post-details">
                        <span className="location">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            {post.location}
                        </span>
                        <span className="range">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                            </svg>
                            Within {post.range}km
                        </span>
                    </div>
                </div>

                <footer className="post-footer">
                    <Link to={`/post/${post.id}`} className="view-details">
                        View Details
                    </Link>
                </footer>
            </div>
        </article>
    );
};

export default Post;
