import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdatePost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [status, setStatus] = useState('LOST');
    const [category, setCategory] = useState('DOCUMENTS');
    const [location, setLocation] = useState('');
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
                setTitle(data.title);
                setDescription(data.description);
                setDate(data.date);
                setTime(data.time);
                setStatus(data.status);
                setCategory(data.category);
                setLocation(data.location);
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };

        fetchPostDetails();
    }, [id, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, date, time, status, category, location })
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                navigate('/');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    return (
        <div className="update-post-container">
            <h1>Update Post</h1>
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
                <button type="submit">Update Post</button>
            </form>
        </div>
    );
};

export default UpdatePost;