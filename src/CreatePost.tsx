import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './createPost.css';
import { API_BASE_URL } from './config';

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('LOST');
    const [category, setCategory] = useState('DOCUMENTS');
    const [range, setRange] = useState(5); // Default range of 5km
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            const postData = { 
                title, 
                description, 
                location, 
                date, 
                time, 
                status, 
                category, 
                range
            };

            // Append the JSON string directly
            formData.append('postDto', JSON.stringify(postData));

            if (image) {
                formData.append('image', image);
            }

            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
                credentials: 'omit'
            });

            // Clone the response before reading it
            const responseClone = response.clone();

            if (!response.ok) {
                let errorMessage = 'Failed to create post';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // If JSON parsing fails, try to get the text
                    try {
                        const textError = await responseClone.text();
                        if (textError) {
                            errorMessage = textError;
                        }
                    } catch {
                        // If both attempts fail, use the default error message
                    }
                }
                throw new Error(errorMessage);
            }

            // If there's an image, wait for it to be processed
            if (image) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            // Use window.location.href instead of navigate for a full page reload
            window.location.href = '/home';
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred while creating the post');
            console.error('Error creating post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/home');
    };

    return (
        <div className="create-post-container">
            <div className="create-post-header">
                <button onClick={handleCancel} className="back-button">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                    Back to Home
                </button>
                <h1>Create New Post</h1>
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
                    <label htmlFor="image">Image (Optional)</label>
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
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin" viewBox="0 0 24 24" width="18" height="18">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                                Create Post
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;