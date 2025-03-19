import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateComment: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Change commentId to id
    const [content, setContent] = useState('');
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            console.error("Error: commentId is undefined");
            return;
        }

        const fetchComment = async () => {
            try {
                const response = await fetch(`http://localhost:8080/comments/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch comment");

                const data = await response.json();
                setContent(data.content);
            } catch (error) {
                console.error("Error fetching comment:", error);
            }
        };

        fetchComment();
    }, [id, token]);

    const handleUpdateComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) {
            console.error("Error: commentId is undefined");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/comments/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            navigate(-1); // Navigate back to the previous page
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    return (
        <div className="update-comment-container">
            <h1>Update Comment</h1>
            <form onSubmit={handleUpdateComment}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit">Update Comment</button>
                <button type="button" onClick={() => navigate(-1)}>Cancel</button>
            </form>
        </div>
    );
};

export default UpdateComment;
