import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from './Post';

const UserProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8080/profile/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setUser(data.user);
                setPosts(data.posts);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [id, token]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="user-info">
                <h2>{user.name}</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Department:</strong> {user.department}</p>
            </div>  
            <div className="user-posts">
                <h3>User Posts</h3>
                {posts.map(post => (
                    <div key={post.id} className="post">
                        <h4>{post.title}</h4>
                        <p><strong>Category:</strong> {post.category}</p>
                        <p><strong>Status:</strong> {post.status}</p>
                        <button onClick={() => window.location.href = `/posts/${post.id}`}>See Details</button>
                    </div>
    
                ))}
            </div>  
         </div>
         

    );
};
export default UserProfile;