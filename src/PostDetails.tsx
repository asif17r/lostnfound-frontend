import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<any>(null);
    const token = localStorage.getItem('token');
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

    const handleUpdate = async () => {
        try {
            await fetch(`http://localhost:8080/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post) // Assuming `post` contains the updated data
            });
            // Optionally, you can refresh the post details or show a success message
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

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
            <button onClick={handleDelete} className="delete-button">Delete</button>
            <button onClick={handleUpdate} className="update-button">Update</button>
        </div>
    );
};

export default PostDetails;