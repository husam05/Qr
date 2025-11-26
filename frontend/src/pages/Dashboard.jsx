import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Trash2, Edit2, ExternalLink, Plus, LogOut } from 'lucide-react';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [links, setLinks] = useState([]);
    const [newLink, setNewLink] = useState({ label: '', url: '' });
    const [profileQr, setProfileQr] = useState('');
    const [isEditing, setIsEditing] = useState(null);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userRes = await axios.get(`${API_URL}/api/auth/me`, config);
            setUser(userRes.data);

            // Generate Profile QR
            const profileUrl = `${window.location.origin}/u/${userRes.data.slug}`; // Frontend URL
            const qr = await QRCode.toDataURL(profileUrl);
            setProfileQr(qr);

            const linksRes = await axios.get(`${API_URL}/api/links`, config);
            setLinks(linksRes.data);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/links`, newLink, config);
            setNewLink({ label: '', url: '' });
            fetchData();
        } catch (err) {
            alert('Error creating link');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await axios.delete(`${API_URL}/api/links/${id}`, config);
            fetchData();
        } catch (err) {
            alert('Error deleting link');
        }
    };

    const handleUpdate = async (id) => {
        const link = links.find(l => l._id === id);
        const newLabel = prompt('New Label:', link.label);
        const newUrl = prompt('New URL:', link.url);
        if (newLabel && newUrl) {
            try {
                await axios.put(`${API_URL}/api/links/${id}`, { label: newLabel, url: newUrl }, config);
                fetchData();
            } catch (err) {
                alert('Error updating link');
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    if (!user) return <div className="container" style={{ paddingTop: '50px' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 className="title" style={{ margin: 0 }}>Dashboard</h1>
                <button onClick={logout} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                {/* Profile Section */}
                <div className="card animate-fade-in">
                    <h2 style={{ marginTop: 0 }}>My Profile</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>@{user.username}</p>
                    <div style={{ background: 'white', padding: '10px', borderRadius: '8px', width: 'fit-content', margin: '20px auto' }}>
                        <img src={profileQr} alt="Profile QR" style={{ width: '150px', height: '150px', display: 'block' }} />
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Scan to view your public page
                    </p>
                    <a
                        href={`/u/${user.slug}`}
                        target="_blank"
                        className="btn btn-primary"
                        style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}
                    >
                        View Public Page
                    </a>
                </div>

                {/* Links Section */}
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="card" style={{ marginBottom: '30px' }}>
                        <h3 style={{ marginTop: 0 }}>Create New Link</h3>
                        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                className="input"
                                placeholder="Label (e.g. My Portfolio)"
                                value={newLink.label}
                                onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                                style={{ marginBottom: 0 }}
                                required
                            />
                            <input
                                type="url"
                                className="input"
                                placeholder="Target URL"
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                style={{ marginBottom: 0 }}
                                required
                            />
                            <button type="submit" className="btn btn-primary">
                                <Plus size={20} />
                            </button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {links.map(link => (
                            <div key={link._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
                                <div style={{ background: 'white', padding: '5px', borderRadius: '4px' }}>
                                    <img src={link.qrCode} alt="QR" style={{ width: '60px', height: '60px', display: 'block' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{link.label}</h3>
                                    <a href={link.url} target="_blank" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {link.url} <ExternalLink size={12} />
                                    </a>
                                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <span>Clicks: <strong style={{ color: 'white' }}>{link.clicks}</strong></span>
                                        <span>Short: {link.shortCode}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleUpdate(link._id)} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px' }}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(link._id)} className="btn btn-danger" style={{ padding: '8px' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {links.length === 0 && (
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No links created yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
