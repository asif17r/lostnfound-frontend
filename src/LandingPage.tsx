import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { useAuth } from './AuthContext';
import logo from './assets/logo.png';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { token, isTokenValid } = useAuth();

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const valid = await isTokenValid();
                    if (valid) {
                        navigate('/home');
                    }
                } catch (error) {
                    // If token is invalid, let user stay on landing page
                    localStorage.removeItem('token');
                }
            }
        };
        
        checkAuth();
    }, [token, navigate, isTokenValid]);

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-content">
                    <div className="nav-logo">
                        <img src={logo} alt="Lost & Found Logo" className="logo-image" />
                    </div>
                    <div className="nav-links">
                        <button className="nav-btn login" onClick={() => navigate('/login')}>Log in</button>
                        <button className="nav-btn signup" onClick={() => navigate('/signup')}>Sign up</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Find What You've Lost, Return What You've Found</h1>
                    <p className="hero-subtitle">The smartest way to connect lost items with their owners using AI-powered search</p>
                    <div className="hero-cta">
                        <button className="cta-btn primary" onClick={() => navigate('/signup')}>
                            Get Started
                        </button>
                        <button className="cta-btn secondary" onClick={() => navigate('/search')}>
                            Search Items
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2>Why Choose Us?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" className="icon">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                            </svg>
                        </div>
                        <h3>AI-Powered Search</h3>
                        <p>Find items instantly with our advanced AI search technology that understands natural language descriptions</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" className="icon">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                            </svg>
                        </div>
                        <h3>Easy Posting</h3>
                        <p>Quickly post lost or found items with photos and descriptions to reach the right audience</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" className="icon">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                            </svg>
                        </div>
                        <h3>Smart Matching</h3>
                        <p>Our system automatically matches lost and found items based on location and descriptions</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" className="icon">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                            </svg>
                        </div>
                        <h3>Secure Communication</h3>
                        <p>Safe and private messaging system to connect with item owners</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Post Your Item</h3>
                        <p>Create a post with photos and details about your lost or found item</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>AI Matching</h3>
                        <p>Our AI system analyzes your post and matches it with potential matches</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Connect & Reunite</h3>
                        <p>Connect with the owner through our secure messaging system</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Get Started?</h2>
                    <p>Join thousands of users who have successfully reunited lost items with their owners</p>
                    <button className="cta-btn primary" onClick={() => navigate('/signup')}>
                        Create Your Account
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>Lost & Found</h4>
                        <p>Making the world a better place, one lost item at a time.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                            <li><a href="/terms">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Connect With Us</h4>
                        <div className="social-links">
                            <a href="#" className="social-link">Twitter</a>
                            <a href="#" className="social-link">Facebook</a>
                            <a href="#" className="social-link">Instagram</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 Lost & Found. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;