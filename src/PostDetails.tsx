import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<any>(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/posts/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setPost(data);
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };

        fetchPostDetails();
    }, [id, token]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post-details">
            <h1>{post.title}</h1>
            <p><strong>Description:</strong> {post.description}</p>
            <p><strong>Location:</strong> {post.location}</p>
            <p><strong>Date:</strong> {post.date}</p>
            <p><strong>Time:</strong> {post.time}</p>
            <p><strong>Category:</strong> {post.category}</p>
            <p><strong>Status:</strong> {post.status}</p>
            <p><strong>User:</strong> {post.user.name} ({post.user.email})</p>
        </div>
    );
};

export default PostDetails;
