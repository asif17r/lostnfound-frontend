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
    const [usernames, setUsernames] = useState<Map<number, string>>(new Map());
    const [content, setContent] = useState('');
    const token = localStorage.getItem('token');

    // Fetch comments
    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:8080/comments`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            const filteredComments = data.filter((comment: Comment) => comment.postId === postId);
            setComments(filteredComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Fetch username by userId
    const fetchUsername = async (userId: number) => {
        if (usernames.has(userId)) return; // Avoid duplicate API calls

        try {
            const response = await fetch(`http://localhost:8080/profile/${userId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`Failed to fetch user ${userId}`);

            const userData = await response.json();
            setUsernames(prev => new Map(prev.set(userId, userData.user.name)));
        } catch (error) {
            console.error('Error fetching username:', error);

        }
    };

    // Fetch comments on component mount
    useEffect(() => {
        fetchComments();
    }, [postId, token]);

    // Fetch usernames when comments change
    useEffect(() => {
        comments.forEach(comment => fetchUsername(comment.userId));
    }, [comments]);

    // Handle adding a new comment
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/comments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content, postId, userId: localStorage.getItem('userId') })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            setContent('');
            fetchComments(); // Refresh comments
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
                        <p>
                            <strong>
                                <a href={`/profile/${comment.userId}`}>
                                    {usernames.get(comment.userId) || 'Loading...'}
                                </a>
                            </strong>: {comment.content}
                        </p>
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
