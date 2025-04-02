import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
    message: string;
    onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
    return (
        <div className="error-message-container">
            <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{message}</span>
                {onClose && (
                    <button className="error-close" onClick={onClose}>
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage; 