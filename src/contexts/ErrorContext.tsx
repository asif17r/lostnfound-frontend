import React, { createContext, useContext, useState, ReactNode } from 'react';
import ErrorMessage from '../components/ErrorMessage';

interface ErrorContextType {
    showError: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
};

interface ErrorProviderProps {
    children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
    const [error, setError] = useState<string | null>(null);

    const showError = (message: string) => {
        setError(message);
        // Auto-hide after 5 seconds
        setTimeout(() => {
            setError(null);
        }, 5000);
    };

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}
            {error && (
                <ErrorMessage 
                    message={error} 
                    onClose={() => setError(null)}
                />
            )}
        </ErrorContext.Provider>
    );
}; 