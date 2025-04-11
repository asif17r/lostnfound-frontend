import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { fetchImageUrl } from './utils';
import { Post } from './types';
import './createPost.css';
import { API_BASE_URL } from './config';

const UpdatePost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [status, setStatus] = useState('LOST');
    const [category, setCategory] = useState('DOCUMENTS');
    const [location, setLocation] = useState('');
    const [range, setRange] = useState(5);
    const [image, setImage] = useState<File | null>(null);
    const [currentImageId, setCurrentImageId] = useState<number | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.status === 401) {
                    navigate('/login');
                    return;
                }

                if (response.ok) {
                    const data = (await response.json()) as Post;
                    setTitle(data.title);
                    setDescription(data.description);
                    setDate(data.date);
                    setTime(data.time);
                    setStatus(data.status);
                    setCategory(data.category);
                    setLocation(data.location);
                    setRange(data.range || 5);
                    setCurrentImageId(data.imageId);
                    
                    // Fetch current image if it exists
                    if (token) {
                        const url = await fetchImageUrl(data.imageId, token);
                        setCurrentImageUrl(url);
                    }
                } else {
                    throw new Error('Failed to fetch post details');
                }
            } catch (error) {
                setError('Failed to load post details');
                console.error('Error fetching post details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [id, token, navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            let imageId = currentImageId;
            if (image) {
                // Upload the new image
                const imageFormData = new FormData();
                imageFormData.append('file', image);
                const imageResponse = await fetch(`${API_BASE_URL}/images`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: imageFormData
                });

                if (!imageResponse.ok) {
                    throw new Error('Failed to upload image');
                }

                const imageData = await imageResponse.json();
                imageId = imageData.id;

                // Delete the old image if it exists
                if (currentImageId) {
                    try {
                        await fetch(`${API_BASE_URL}/images/${currentImageId}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                    } catch (error) {
                        console.error('Failed to delete old image:', error);
                    }
                }
            }

            const postData = {
                title,
                description,
                date,
                time,
                status,
                category,
                location,
                range,
                imageId
            };

            const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                navigate(`/post/${id}`);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update post');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred while updating the post');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(`/post/${id}`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading post details...</p>
            </div>
        );
    }

    return (
        <div className="create-post-container">
            <div className="create-post-header">
                <button onClick={handleCancel} className="back-button">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                    Back to Post
                </button>
                <h1>Update Post</h1>
            </div>

            <form onSubmit={handleSubmit} className="create-post-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a descriptive title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide detailed information about your lost or found item"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="time">Time</label>
                        <input
                            id="time"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Where did you lose/find the item?"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <option value="LOST">Lost</option>
                            <option value="FOUND">Found</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="DOCUMENTS">Documents</option>
                            <option value="ELECTRONICS">Electronics</option>
                            <option value="JEWELLERIES">Jewelleries</option>
                            <option value="ACCESSORIES">Accessories</option>
                            <option value="CLOTHES">Clothes</option>
                            <option value="MOBILE">Mobile</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="range">Search Radius (km)</label>
                    <div className="range-input-container">
                        <input
                            id="range"
                            type="range"
                            min="1"
                            max="50"
                            value={range}
                            onChange={(e) => setRange(Number(e.target.value))}
                            className="range-input"
                        />
                        <span className="range-value">{range} km</span>
                    </div>
                    <p className="range-description">Set the radius within which the item might be found</p>
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    {currentImageUrl && !imagePreview && (
                        <div className="current-image">
                            <img src={currentImageUrl} alt="Current" />
                            <p>Current image</p>
                        </div>
                    )}
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input"
                    />
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                            <p>New image</p>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="cancel-button"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin" viewBox="0 0 24 24" width="18" height="18">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.05c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                </svg>
                                Update Post
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdatePost;