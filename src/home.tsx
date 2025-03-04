import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

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
    uploadTime: string;
    lastUpdatedTime: string;
}

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    const authContext = useContext(AuthContext);

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
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                    onClick={() => {
                        authContext?.logout();
                        window.location.href = '/';
                    }} 
                    style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
                >
                    Logout
                </button>
                <a href="/profile" style={{ color: 'blue', textDecoration: 'none' }}>My Profile</a>
            </header>
            <h1>Lost and Found</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {posts.map(post => (
                    <li key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <h2 style={{ margin: '0 0 10px 0' }}>{post.title}</h2>
                        <p style={{ margin: 0 }}>{post.description}</p>
                        <p style={{ margin: 0 }}><strong>Location:</strong> {post.location}</p>
                        <p style={{ margin: 0 }}><strong>Date:</strong> {post.date}</p>
                        <p style={{ margin: 0 }}><strong>Time:</strong> {post.time}</p>
                        <p style={{ margin: 0 }}><strong>Category:</strong> {post.category}</p>
                        <p style={{ margin: 0 }}><strong>Status:</strong> {post.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;