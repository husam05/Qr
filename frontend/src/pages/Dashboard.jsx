import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Trash2, Edit2, ExternalLink, Plus, LogOut, Shield, Download, Copy, CheckCircle, Sparkles, Wand2 } from 'lucide-react';
import AIInsights from '../components/AIInsights';
import QRCustomizer from '../components/QRCustomizer';
import SocialQuickSetup from '../components/SocialQuickSetup';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [links, setLinks] = useState([]);
    const [newLink, setNewLink] = useState({ label: '', url: '' });
    const [qrCustomization, setQrCustomization] = useState(null);
    const [profileQr, setProfileQr] = useState('');
    const [isEditing, setIsEditing] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [suggestedLabel, setSuggestedLabel] = useState('');
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
    const navigate = useNavigate();
    
    // Force correct API URL
    const API_URL = 'https://qr-enwn.onrender.com';
    // const API_URL = import.meta.env.VITE_API_URL;

    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userRes = await axios.get(`${API_URL}/api/auth/me`, config);
            setUser(userRes.data);

            // If user is admin, redirect to admin page
            if (userRes.data.role === 'admin') {
                navigate('/admin');
                return;
            }

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
            const linkData = {
                ...newLink,
                qrCustomization: qrCustomization || undefined
            };
            await axios.post(`${API_URL}/api/links`, linkData, config);
            setNewLink({ label: '', url: '' });
            setQrCustomization(null);
            fetchData();
        } catch (err) {
            console.error('Error creating link:', err);
            const errorMsg = err.response?.data?.error || err.response?.data?.msg || err.message || 'Error creating link';
            alert(`Error creating link: ${errorMsg}`);
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

    const downloadQR = (qrDataUrl, label) => {
        const link = document.createElement('a');
        link.download = `QR-${label.replace(/\s+/g, '-')}.png`;
        link.href = qrDataUrl;
        link.click();
    };

    const copyShortLink = (shortCode) => {
        const shortUrl = `${window.location.origin}/l/${shortCode}`;
        navigator.clipboard.writeText(shortUrl);
        setCopiedId(shortCode);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getSuggestedLabel = async (url) => {
        if (!url || url.length < 8) {
            setSuggestedLabel('');
            return;
        }

        setIsLoadingSuggestion(true);
        try {
            const res = await axios.post(
                `${API_URL}/api/links/suggest-label`,
                { url },
                config
            );
            setSuggestedLabel(res.data.suggestion);
        } catch (err) {
            console.error('Error getting label suggestion:', err);
        }
        setIsLoadingSuggestion(false);
    };

    const applySuggestedLabel = () => {
        if (suggestedLabel) {
            setNewLink({ ...newLink, label: suggestedLabel });
            setSuggestedLabel('');
        }
    };

    if (!user) return <div className="container" style={{ paddingTop: '50px' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 className="title" style={{ margin: 0 }}>Dashboard</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {user.role === 'admin' && (
                        <Link to="/admin">
                            <button className="btn" style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                background: 'rgba(99, 102, 241, 0.1)',
                                border: '1px solid var(--accent-primary)',
                                color: 'var(--accent-primary)'
                            }}>
                                <Shield size={18} /> Admin Panel
                            </button>
                        </Link>
                    )}
                    <button onClick={logout} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px',
                marginBottom: '30px'
            }}>
                <div className="stat-card">
                    <div className="stat-value">{links.length}</div>
                    <div className="stat-label">Total Links</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{links.reduce((sum, link) => sum + link.clicks, 0)}</div>
                    <div className="stat-label">Total Clicks</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{user.role === 'admin' ? 'Admin' : 'User'}</div>
                    <div className="stat-label">Account Type</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                {/* Profile Section */}
                <div className="card animate-fade-in">
                    <h2 style={{ marginTop: 0 }}>My Profile</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>@{user.username}</p>
                    <div 
                        style={{ background: 'white', padding: '10px', borderRadius: '8px', width: 'fit-content', margin: '20px auto', cursor: 'pointer' }}
                        onClick={() => downloadQR(profileQr, `profile-${user.username}`)}
                        title="Click to download"
                    >
                        <img src={profileQr} alt="Profile QR" style={{ width: '150px', height: '150px', display: 'block' }} />
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Scan to view your public page
                    </p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button
                            onClick={() => downloadQR(profileQr, `profile-${user.username}`)}
                            className="btn"
                            style={{ 
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: 'rgba(99, 102, 241, 0.1)',
                                border: '1px solid var(--accent-primary)',
                                color: 'var(--accent-primary)'
                            }}
                        >
                            <Download size={16} /> Download QR
                        </button>
                        <a
                            href={`/u/${user.slug}`}
                            target="_blank"
                            className="btn btn-primary"
                            style={{ 
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                textDecoration: 'none'
                            }}
                        >
                            <ExternalLink size={16} /> View Page
                        </a>
                    </div>
                </div>

                {/* Links Section */}
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    {/* AI Insights */}
                    <AIInsights links={links} />

                    <div className="card" style={{ marginBottom: '30px' }}>
                        <h3 style={{ 
                            marginTop: 0, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px' 
                        }}>
                            Create New Link
                            <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
                        </h3>
                        <form onSubmit={handleCreate}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    type="url"
                                    className="input"
                                    placeholder="Target URL"
                                    value={newLink.url}
                                    onChange={(e) => {
                                        setNewLink({ ...newLink, url: e.target.value });
                                        getSuggestedLabel(e.target.value);
                                    }}
                                    style={{ marginBottom: 0, flex: 2 }}
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={applySuggestedLabel}
                                    disabled={!suggestedLabel || isLoadingSuggestion}
                                    className="btn"
                                    style={{ 
                                        background: suggestedLabel ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                        border: suggestedLabel ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                                        color: suggestedLabel ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        padding: '0 15px',
                                        cursor: suggestedLabel ? 'pointer' : 'not-allowed'
                                    }}
                                    title={suggestedLabel ? `AI suggests: ${suggestedLabel}` : 'Enter URL to get AI suggestion'}
                                >
                                    <Wand2 size={16} />
                                    {isLoadingSuggestion ? '...' : 'AI'}
                                </button>
                            </div>
                            {suggestedLabel && (
                                <div style={{ 
                                    fontSize: '0.85rem', 
                                    color: 'var(--accent-primary)',
                                    marginBottom: '10px',
                                    padding: '8px 12px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <Sparkles size={14} />
                                    AI suggests: <strong>"{suggestedLabel}"</strong>
                                </div>
                            )}
                            <input
                                type="text"
                                className="input"
                                placeholder="Label (e.g. My Portfolio)"
                                value={newLink.label}
                                onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                                style={{ marginBottom: 0 }}
                                required
                            />

                            {/* ENHANCED QR Customization Section - Ultra Visual */}
                            <div style={{ 
                                marginTop: '25px', 
                                marginBottom: '25px',
                                padding: '0',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08))',
                                borderRadius: '16px',
                                border: '2px solid rgba(99, 102, 241, 0.3)',
                                overflow: 'hidden',
                                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
                                animation: 'fadeInUp 0.5s ease-out'
                            }}>
                                {/* Header with animated background */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
                                    padding: '20px 24px',
                                    borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
                                }}>
                                    <h4 style={{ 
                                        margin: '0 0 8px 0', 
                                        fontSize: '1.2rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: 'var(--text-primary)',
                                        fontWeight: '700'
                                    }}>
                                        <Sparkles size={22} style={{ color: 'var(--accent-primary)' }} />
                                        🎨 Design Your QR Code
                                    </h4>
                                    <p style={{ 
                                        margin: '0', 
                                        fontSize: '0.95rem', 
                                        color: 'var(--text-secondary)',
                                        lineHeight: '1.5'
                                    }}>
                                        Choose from social media templates or create custom designs with your logo & colors
                                    </p>
                                </div>

                                {/* Main Content Area */}
                                <div style={{ padding: '24px' }}>
                                    {/* Quick Preview Cards */}
                                    {!qrCustomization && (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                            gap: '12px',
                                            marginBottom: '20px'
                                        }}>
                                            {/* Preview Card 1 */}
                                            <div style={{
                                                padding: '16px',
                                                background: 'rgba(228, 64, 95, 0.08)',
                                                borderRadius: '12px',
                                                border: '2px solid rgba(228, 64, 95, 0.2)',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📱</div>
                                                <div style={{ fontSize: '0.85rem', color: '#E4405F', fontWeight: '600' }}>Social Media</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Instagram, TikTok...</div>
                                            </div>

                                            {/* Preview Card 2 */}
                                            <div style={{
                                                padding: '16px',
                                                background: 'rgba(99, 102, 241, 0.08)',
                                                borderRadius: '12px',
                                                border: '2px solid rgba(99, 102, 241, 0.2)',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎨</div>
                                                <div style={{ fontSize: '0.85rem', color: '#6366F1', fontWeight: '600' }}>Custom Design</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Colors & Logo</div>
                                            </div>

                                            {/* Preview Card 3 */}
                                            <div style={{
                                                padding: '16px',
                                                background: 'rgba(16, 185, 129, 0.08)',
                                                borderRadius: '12px',
                                                border: '2px solid rgba(16, 185, 129, 0.2)',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏪</div>
                                                <div style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: '600' }}>Business</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Store, Restaurant</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                        gap: '14px',
                                        marginBottom: '16px'
                                    }}>
                                        <SocialQuickSetup 
                                            onComplete={(data) => {
                                                setNewLink({ label: data.label, url: data.url });
                                                setQrCustomization(data.qrCustomization);
                                            }}
                                        />
                                        <QRCustomizer 
                                            onCustomize={setQrCustomization}
                                            initialLabel={newLink.label}
                                            initialUrl={newLink.url}
                                        />
                                    </div>

                                    {/* Success State with Animation */}
                                    {qrCustomization && (
                                        <div style={{ 
                                            marginTop: '16px',
                                            padding: '16px 20px',
                                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.12))',
                                            borderRadius: '12px',
                                            fontSize: '0.95rem',
                                            color: '#059669',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            border: '2px solid rgba(16, 185, 129, 0.3)',
                                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                                            animation: 'slideInUp 0.4s ease-out'
                                        }}>
                                            <CheckCircle size={24} style={{ flexShrink: 0 }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>
                                                    ✨ QR Design Applied!
                                                </div>
                                                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                                                    {qrCustomization.icon && <span style={{ fontSize: '1.2rem', marginRight: '6px' }}>{qrCustomization.icon}</span>}
                                                    {qrCustomization.platform && <span style={{ textTransform: 'capitalize' }}>{qrCustomization.platform} style</span>}
                                                    {qrCustomization.color && (
                                                        <span style={{ marginLeft: '8px' }}>
                                                            • Color: 
                                                            <span style={{
                                                                display: 'inline-block',
                                                                width: '16px',
                                                                height: '16px',
                                                                background: qrCustomization.color,
                                                                borderRadius: '4px',
                                                                marginLeft: '6px',
                                                                verticalAlign: 'middle',
                                                                border: '1px solid rgba(0,0,0,0.2)'
                                                            }} />
                                                        </span>
                                                    )}
                                                    {qrCustomization.logo && <span style={{ marginLeft: '8px' }}>• Logo included</span>}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setQrCustomization(null)}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.3)',
                                                    border: '1px solid rgba(255, 255, 255, 0.4)',
                                                    borderRadius: '6px',
                                                    padding: '6px 12px',
                                                    color: '#059669',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                                                }}
                                            >
                                                Change
                                            </button>
                                        </div>
                                    )}

                                    {/* Tips Section */}
                                    {!qrCustomization && (
                                        <div style={{
                                            marginTop: '16px',
                                            padding: '14px 16px',
                                            background: 'rgba(251, 191, 36, 0.08)',
                                            borderRadius: '10px',
                                            border: '1px solid rgba(251, 191, 36, 0.2)',
                                            fontSize: '0.85rem',
                                            color: 'var(--text-secondary)',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '10px'
                                        }}>
                                            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>💡</span>
                                            <div>
                                                <strong style={{ color: '#F59E0B' }}>Pro Tip:</strong> Colored QR codes get 30% more scans! Try social media templates for instant brand recognition.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Create Button */}
                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                style={{ 
                                    width: '100%',
                                    display: 'flex', 
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '14px',
                                    fontSize: '1rem',
                                    fontWeight: '600'
                                }}
                            >
                                <Plus size={20} /> Create QR Link
                            </button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {links.map(link => (
                            <div key={link._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
                                <div style={{ background: 'white', padding: '5px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => downloadQR(link.qrCode, link.label)} title="Click to download">
                                    <img src={link.qrCode} alt="QR" style={{ width: '60px', height: '60px', display: 'block' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{link.label}</h3>
                                    <a href={link.url} target="_blank" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {link.url.length > 50 ? link.url.substring(0, 50) + '...' : link.url} <ExternalLink size={12} />
                                    </a>
                                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', alignItems: 'center' }}>
                                        <span>Clicks: <strong style={{ color: 'white' }}>{link.clicks}</strong></span>
                                        <button 
                                            onClick={() => copyShortLink(link.shortCode)}
                                            style={{
                                                background: copiedId === link.shortCode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                                border: copiedId === link.shortCode ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                                                borderRadius: '6px',
                                                padding: '4px 10px',
                                                color: copiedId === link.shortCode ? '#22c55e' : 'var(--accent-primary)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {copiedId === link.shortCode ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> Copy Link</>}
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        onClick={() => downloadQR(link.qrCode, link.label)} 
                                        className="btn" 
                                        style={{ 
                                            background: 'rgba(99, 102, 241, 0.1)', 
                                            border: '1px solid rgba(99, 102, 241, 0.3)',
                                            color: 'var(--accent-primary)', 
                                            padding: '8px' 
                                        }}
                                        title="Download QR Code"
                                    >
                                        <Download size={16} />
                                    </button>
                                    <button onClick={() => handleUpdate(link._id)} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px' }} title="Edit">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(link._id)} className="btn btn-danger" style={{ padding: '8px' }} title="Delete">
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
