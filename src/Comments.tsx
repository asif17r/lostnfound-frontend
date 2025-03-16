import React, { useState, useEffect } from 'react';

interface Comment {
    id: number;
    content: string;
    userId: number;
    createdAt: string;
    postId: number;
}

interface CommentsProps {
    postId: number;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState('');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:8080/comments`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                const filteredComments = data.filter((comment: Comment) => comment.postId === postId);
                setComments(filteredComments);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [postId, token]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/comments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: content, postId, userId })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const addedComment = await response.json();
            setComments([...comments, addedComment]);
            setContent('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="comments-section">
            <h2>Comments</h2>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id}>
                        <p><strong>{comment.userId}:</strong> {comment.content}</p>
                        <p><small>{new Date(comment.createdAt).toLocaleString()}</small></p>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddComment}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add a comment"
                    required
                />
                <button type="submit">Add Comment</button>
            </form>
        </div>
    );
};

export default Comments;