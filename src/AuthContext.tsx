import React, { createContext, useState, ReactNode, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

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
    signup: (data: SignupData) => Promise<void>;
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

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post<string>(`${API_BASE_URL}/login`, {
                email,
                password
            });
            const newToken = response.data;
            localStorage.setItem('token', newToken);
            setToken(newToken);
        } catch (error) {
            throw new Error('Invalid email or password');
        }
    };

    const signup = async (data: SignupData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, {
                ...data,
                role: 'USER'
            });
            if (response.status === 201) {
                // After successful signup, automatically log in
                await login(data.email, data.password);
            } else {
                throw new Error('Failed to create account');
            }
        } catch (error) {
            throw new Error('Failed to create account');
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
        <AuthContext.Provider value={{ token, login, signup, logout, isTokenValid }}>
            {children}
        </AuthContext.Provider>
    );
};