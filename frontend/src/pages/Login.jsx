import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, formData);
            localStorage.setItem('token', res.data.token);

            // Decode token to get role (simple base64 decode)
            const payload = JSON.parse(atob(res.data.token.split('.')[1]));
            localStorage.setItem('role', payload.user.role);

            if (payload.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 className="title" style={{ textAlign: 'center' }}>QRLinkHub</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="input"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        className="input"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
