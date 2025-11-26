import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, formData);
            localStorage.setItem('token', res.data.token);

            const payload = JSON.parse(atob(res.data.token.split('.')[1]));
            localStorage.setItem('role', payload.user.role);

            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || 'Error registering');
        }
    };

    return (
        <div className="container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 className="title" style={{ textAlign: 'center' }}>Join QRLinkHub</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
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
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
