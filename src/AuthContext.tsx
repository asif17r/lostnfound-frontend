import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    login: (newToken: string) => void;
    logout: () => void;
    isTokenValid: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        console.log('new Token:', newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const isTokenValid = async (): Promise<boolean> => {
        console.log('Checking if token is valid inside isTokenValid');
        console.log('Token:', token);
        if (!token) return false;

        try {
            const response = await fetch('http://localhost:8080/validate', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                logout();
                return false;
            }
            return true;
        } catch (error) {
            logout();
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isTokenValid }}>
            {children}
        </AuthContext.Provider>
    );
};