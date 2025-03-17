import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comments from './Comments';

const PostDetails: React.FC = () => {
    const [usernames, setUsernames] = useState<Map<number, string>>(new Map());
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<any>(null);
    const token = localStorage.getItem('token');
    const [myId, setMyId] = useState<number | null>(null);
    const navigate = useNavigate();

    // Fetch post details
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

                // Fetch the username for the post author (userId)
                if (data && data.userId) {
                    fetchUsername(data.userId);
                }
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };

        fetchPostDetails();
    }, [id, token]);

    // Fetch username for the userId
    const fetchUsername = async (userId: number) => {
        if (usernames.has(userId)) return; // Avoid duplicate API calls
    
        try {
            const response = await fetch(`http://localhost:8080/profile/${userId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`Failed to fetch user ${userId}`);
    
            const userData = await response.json();
            setUsernames(prev => new Map(prev.set(userId, userData.name)));
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };

    // Handle post deletion
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

    // Fetch my ID
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
                console.log('My ID:', data);
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
            <p><strong>User Name:</strong> 
                <a href={`/profile/${post.userId}`}>
                    {usernames.get(post.userId) || 'Loading...'}
                </a>
            </p>
            <p><strong>postuserid:</strong> {post.userId}</p>
            <p><strong>myId:</strong> {myId}</p>
            {myId === post.userId && (
                <>
                    <button onClick={handleDelete} className="delete-button">Delete</button>
                    <button onClick={() => navigate(`/update-post/${post.id}`)} className="update-button">Update</button>
                </>
            )}

            <Comments postId={post.id} />
        </div>
    );
};

export default PostDetails;
