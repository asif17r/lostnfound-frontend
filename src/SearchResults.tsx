import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Post from './Post';
import { Post as PostType } from './types';
import './SearchResults.css';
import { API_BASE_URL } from './config';

interface SearchQuery {
    query: string;
    limit: number;
}

const SearchResults: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { token, logout, isTokenValid } = useAuth();

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                navigate('/login');
                return;
            }

            const isValid = await isTokenValid();
            if (!isValid) {
                navigate('/login');
                return;
            }

            const query = searchParams.get('q') || '';
            const type = searchParams.get('type');
            
            setSearchQuery(query);
            
            if (type === 'image') {
                // Get image search results from sessionStorage
                const imageResults = sessionStorage.getItem('imageSearchResults');
                if (imageResults) {
                    setPosts(JSON.parse(imageResults));
                }
                setLoading(false);
            } else {
                // Clear image search results when navigating to regular search
                sessionStorage.removeItem('imageSearchResults');
                if (query) {
                    fetchSearchResults(query);
                } else {
                    setLoading(false);
                }
            }
        };

        checkAuth();
    }, [searchParams, token, navigate, isTokenValid]);

    const fetchSearchResults = async (query: string) => {
        setSearching(true);
        try {
            const searchBody: SearchQuery = {
                query: query,
                limit: 20 // You can adjust this number based on your needs
            };

            const response = await fetch(`${API_BASE_URL}/enhancedSearch`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchBody)
            });
            
            if (response.status === 401) {
                logout();
                navigate('/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            } else {
                throw new Error('Failed to fetch search results');
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchParams({ q: searchQuery.trim() });
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="search-results-container">
            <header className="search-header">
                <div className="header-left">
                    <button onClick={() => navigate('/home')} className="home-button">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        Home
                    </button>
                    <h1>Search Results</h1>
                </div>
                <div className="header-right">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-input-wrapper">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="search-icon">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search lost & found items..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/image-search')}
                            className="image-search-button"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                            Search with Image
                        </button>
                    </form>
                </div>
            </header>

            <main className="search-content">
                {searching ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Searching...</p>
                    </div>
                ) : (
                    <>
                        <div className="search-info">
                            <h2>
                                {searchParams.get('type') === 'image' 
                                    ? 'Image Search Results' 
                                    : `Results for "${searchQuery}"`}
                            </h2>
                            <p>{posts.length} {posts.length === 1 ? 'result' : 'results'} found</p>
                        </div>

                        <div className="search-results">
                            {posts.length === 0 ? (
                                <div className="no-results">
                                    <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                    </svg>
                                    <h3>No results found</h3>
                                    <p>Try adjusting your search terms or browse all items</p>
                                    <button onClick={() => navigate('/home')} className="browse-all-btn">
                                        Browse All Items
                                    </button>
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <Post key={post.id} post={post} />
                                ))
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default SearchResults;