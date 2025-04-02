import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useError } from './contexts/ErrorContext';
import './login.css';

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState('');
    const [department, setDepartment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { signup } = useAuth();
    const { showError } = useError();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const userEmail = await signup({
                name,
                email,
                password,
                address,
                department
            });
            navigate('/verify-email', { state: { email: userEmail } });
        } catch (err) {
            // Error is already handled by AuthContext
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join Lost & Found to start helping others</p>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., John Doe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., john.doe@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="e.g., MySecurePass123!"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="e.g., MySecurePass123!"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g., 123 Main St, City, Country"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <input
                            type="text"
                            id="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="e.g., Computer Science"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;