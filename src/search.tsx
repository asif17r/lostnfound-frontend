import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Post } from './Post';
import './home.css';  //for now

interface searchQuery {
    query: string;
    limit: number;
}

const SearchPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const location = useLocation();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const query = new URLSearchParams(location.search).get('q');
        console.log('Search query:', query);
        if (query) {
            const searchQuery: searchQuery = {
            query: query,
            limit: 20 // or any other limit you want to set
            };
            console.log('Search query object:', searchQuery);

            axios.post('http://localhost:8080/enhancedSearch', searchQuery, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                console.log('Search results:', response.data);
                setPosts(response.data as Post[]);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [location.search]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Search Results</h1>
            {Array.isArray(posts) && posts.length > 0 ? (
            <ul className="post-list">
                {posts.map(post => (
                <li key={post.id} className="post-item">
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-text">{post.description}</p>
                    <p className="post-text"><strong>Location:</strong> {post.location}</p>
                    <p className="post-text"><strong>Date:</strong> {post.date}</p>
                    <p className="post-text"><strong>Time:</strong> {post.time}</p>
                    <p className="post-text"><strong>Category:</strong> {post.category}</p>
                    <p className="post-text"><strong>Status:</strong> {post.status}</p>
                </li>
                ))}
            </ul>
            ) : (
            <p>No results found</p>
            )}
        </div>
    );
};

export default SearchPage;