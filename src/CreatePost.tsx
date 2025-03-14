import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('LOST');
    const [category, setCategory] = useState('DOCUMENTS');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description,location, date, time, status, category })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonResponse = await response.json();
            console.log('Response JSON:', jsonResponse);
            navigate('/home'); // Redirect to home after creation
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="create-post-container">
            <h1>Create Post</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div>
                    <label>Date:</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                    <label>Time:</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
                <div>
                    <label>Location:</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div>
                    <label>Status:</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="LOST">LOST</option>
                        <option value="FOUND">FOUND</option>
                    </select>
                </div>
                <div>
                    <label>Category:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="DOCUMENTS">DOCUMENTS</option>
                        <option value="ELECTRONICS">ELECTRONICS</option>
                        <option value="JEWELLERIES">JEWELLERIES</option>
                        <option value="ACCESSORIES">ACCESSORIES</option>
                        <option value="CLOTHES">CLOTHES</option>
                        <option value="MOBILE">MOBILE</option>
                    </select>
                </div>
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;