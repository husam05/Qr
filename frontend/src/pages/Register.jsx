import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, formData);
            localStorage.setItem('token', res.data.token);

            const payload = JSON.parse(atob(res.data.token.split('.')[1]));
            localStorage.setItem('role', payload.user.role);

            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error creating account. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="container" style={{ maxWidth: '500px' }}>
                <Link to="/" style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    color: 'var(--text-secondary)',
                    marginBottom: '30px',
                    transition: 'var(--transition)'
                }}>
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </Link>

                <div className="card animate-fade-in" style={{ boxShadow: 'var(--shadow-lg)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                            Create Account
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            Start managing your QR codes today
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            padding: '14px 16px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--border-radius-sm)',
                            color: 'var(--danger)',
                            marginBottom: '20px',
                            fontSize: '0.95rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px',
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>
                                Username
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={20} style={{ 
                                    position: 'absolute', 
                                    left: '14px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)'
                                }} />
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    style={{ paddingLeft: '44px' }}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px',
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ 
                                    position: 'absolute', 
                                    left: '14px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)'
                                }} />
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{ paddingLeft: '44px' }}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px',
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ 
                                    position: 'absolute', 
                                    left: '14px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)'
                                }} />
                                <input
                                    type="password"
                                    className="input"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={{ paddingLeft: '44px' }}
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>
                            <p style={{ 
                                fontSize: '0.85rem', 
                                color: 'var(--text-muted)',
                                marginTop: '6px'
                            }}>
                                Must be at least 6 characters
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            style={{ 
                                width: '100%',
                                padding: '14px',
                                fontSize: '1.05rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ 
                                        width: '20px', 
                                        height: '20px',
                                        borderWidth: '2px',
                                        margin: 0
                                    }}></div>
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div style={{ 
                        marginTop: '30px', 
                        paddingTop: '25px',
                        borderTop: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ 
                                color: 'var(--accent-primary)',
                                fontWeight: '600',
                                textDecoration: 'underline'
                            }}>
                                Sign in instead
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
