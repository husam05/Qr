import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Link as LinkIcon } from 'lucide-react';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/api/admin/users`, {
                    headers: { 'x-auth-token': token }
                });
                setUsers(res.data);
            } catch (err) {
                if (err.response?.status === 403 || err.response?.status === 401) {
                    navigate('/dashboard');
                }
            }
        };
        fetchUsers();
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="container" style={{ paddingTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 className="title" style={{ margin: 0 }}>Admin Panel</h1>
                <button onClick={logout} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div className="card animate-fade-in">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={24} /> Users Overview
                </h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                <th style={{ padding: '15px' }}>Username</th>
                                <th style={{ padding: '15px' }}>Email</th>
                                <th style={{ padding: '15px' }}>Role</th>
                                <th style={{ padding: '15px' }}>Links Created</th>
                                <th style={{ padding: '15px' }}>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>@{user.username}</td>
                                    <td style={{ padding: '15px' }}>{user.email}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            background: user.role === 'admin' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                            fontSize: '0.8rem'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <LinkIcon size={14} /> {user.linkCount}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;
