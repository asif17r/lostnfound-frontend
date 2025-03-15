import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<any>(null);
    const token = localStorage.getItem('token');
    const [myId, setMyId] = useState<number | null>(null);
    const navigate = useNavigate();

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

    const handleDelete = async () => {
        try {
            await fetch(`http://localhost:8080/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/home'); // Redirect to home after deletion
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    useEffect(() => {
        const fetchMyId = async () => {
            try {
                const response = await fetch('http://localhost:8080/myId', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setMyId(data); // Set myId to the fetched data
                console.log('My ID:', data.id);
            } catch (error) {
                console.error('Error fetching my ID:', error);
            }
        };

        fetchMyId();
    }, [token]);

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
            <p><strong>User ID:</strong> {post.userId}</p>
            {myId === post.userId && (
                <>
                    <button onClick={handleDelete} className="delete-button">Delete</button>        
                    <button onClick={() => navigate(`/update-post/${post.id}`)} className="update-button">Update</button>
                </>
            )}
        </div>
    );
};

export default PostDetails;