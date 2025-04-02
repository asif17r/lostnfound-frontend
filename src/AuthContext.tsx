import React, { createContext, useState, ReactNode, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { useError } from './contexts/ErrorContext';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true // Enable credentials for CORS
});

// Add response interceptor for global error handling
api.interceptors.response.use(
    response => response,
    error => {
        // Handle the ResponseEntity format
        const errorMessage = error.response?.data || 'An error occurred. Please try again.';
        throw new Error(errorMessage);
    }
);

interface SignupData {
    name: string;
    email: string;
    password: string;
    address: string;
    department: string;
}

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: SignupData) => Promise<string>;
    logout: () => void;
    isTokenValid: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const { showError } = useError();

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post<string>('/login', {
                email,
                password
            });
            const newToken = response.data;
            localStorage.setItem('token', newToken);
            setToken(newToken);
        } catch (error) {
            showError(error instanceof Error ? error.message : 'Invalid email or password');
            throw error;
        }
    };

    const signup = async (data: SignupData): Promise<string> => {
        try {
            const response = await api.post('/register', {
                ...data,
                role: 'USER'
            });
            if (response.status === 201) {
                return data.email;
            } else {
                throw new Error('Failed to create account');
            }
        } catch (error) {
            showError(error instanceof Error ? error.message : 'Failed to create account');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const isTokenValid = async (): Promise<boolean> => {
        if (!token) return false;

        try {
            const response = await fetch(`${API_BASE_URL}/validate`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
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
        <AuthContext.Provider value={{ token, login, signup, logout, isTokenValid }}>
            {children}
        </AuthContext.Provider>
    );
};