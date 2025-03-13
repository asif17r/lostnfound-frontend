import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import './home.css';
import { Post } from './Post';



const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const token = localStorage.getItem('token');
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
        <div className="home-container">
            <header className="home-header">
                <button 
                    onClick={() => {
                        authContext?.logout();
                        window.location.href = '/';
                    }} 
                    className="logout-button"
                >
                    Logout
                </button>
                <a href="/profile" className="profile-link">My Profile</a>
            </header>
            <div className="header-content">
                <h1>Lost and Found</h1>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="search-box"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const query = (e.target as HTMLInputElement).value;
                            window.location.href = `/search?q=${query}`;
                        }
                    }}
                />
            </div>
            <ul className="post-list">
                {posts.map(post => (
                    <li key={post.id} className="post-item">
                        <h2 className="post-title">{post.title}</h2>
                        <p className="post-text"><strong>Category:</strong> {post.category}</p>
                        <p className="post-text"><strong>Status:</strong> {post.status}</p>
                        <button 
                            onClick={async () => {
                                try {
                                    const response = await fetch(`http://localhost:8080/posts/${post.id}`, {
                                        method: 'GET',
                                        headers: {
                                            'Authorization': `Bearer ${token}`
                                        }
                                    });
                                    const data = await response.json();
                                    const postDetails = `
                                        Title: ${data.title}
                                        Description: ${data.description}
                                        Location: ${data.location}
                                        Date: ${data.date}
                                        Time: ${data.time}
                                        Category: ${data.category}
                                        Status: ${data.status}
                                        User: ${data.user.name} (${data.user.email})
                                    `;
                                    const dialog = document.createElement('dialog');
                                    dialog.innerHTML = `
                                        ${postDetails.split('\n').map(line => `<p>${line}</p>`).join('')}
                                        <button id="close-dialog">Close</button>
                                    `;
                                    document.body.appendChild(dialog);
                                    dialog.showModal();
                                    dialog.querySelector('#close-dialog')?.addEventListener('click', () => {
                                        dialog.close();
                                    });
                                    dialog.addEventListener('close', () => {
                                        document.body.removeChild(dialog);
                                    });
                                } catch (error) {
                                    console.error('Error fetching post details:', error);
                                }
                            }}
                            className="details-button"
                        >
                            See Details
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
