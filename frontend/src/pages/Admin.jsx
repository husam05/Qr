import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
    LogOut, Users, Link as LinkIcon, Activity, TrendingUp, UserCheck, Home, Trash2, 
    Shield, ShieldOff, Edit2, X, Check, Brain, Zap, BarChart3, Eye, EyeOff,
    MousePointerClick, Calendar, ExternalLink, RefreshCw, AlertCircle, Download
} from 'lucide-react';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ username: '', email: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [userLinks, setUserLinks] = useState({});
    const [loadingLinks, setLoadingLinks] = useState({});
    const navigate = useNavigate();
    
    // Force correct API URL
    const API_URL = 'https://qr-enwn.onrender.com';
    // const API_URL = import.meta.env.VITE_API_URL;

    const token = localStorage.getItem('token');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, statsRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/users`, {
                    headers: { 'x-auth-token': token }
                }),
                axios.get(`${API_URL}/api/admin/stats`, {
                    headers: { 'x-auth-token': token }
                })
            ]);
            setUsers(usersRes.data);
            setStats(statsRes.data);
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 401) {
                navigate('/dashboard');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const fetchUserLinks = async (userId) => {
        if (userLinks[userId]) {
            setExpandedUserId(expandedUserId === userId ? null : userId);
            return;
        }

        setLoadingLinks({ ...loadingLinks, [userId]: true });
        try {
            const res = await axios.get(`${API_URL}/api/admin/users/${userId}/links`, {
                headers: { 'x-auth-token': token }
            });
            setUserLinks({ ...userLinks, [userId]: res.data });
            setExpandedUserId(userId);
        } catch (err) {
            showMessage('error', 'Failed to load links');
        }
        setLoadingLinks({ ...loadingLinks, [userId]: false });
    };

    const handleDeleteLink = async (linkId, userId) => {
        if (!window.confirm('Delete this link?')) return;
        
        try {
            await axios.delete(`${API_URL}/api/admin/links/${linkId}`, {
                headers: { 'x-auth-token': token }
            });
            showMessage('success', 'Link deleted');
            // Refresh user links
            const res = await axios.get(`${API_URL}/api/admin/users/${userId}/links`, {
                headers: { 'x-auth-token': token }
            });
            setUserLinks({ ...userLinks, [userId]: res.data });
            fetchData(); // Refresh stats
        } catch (err) {
            showMessage('error', 'Failed to delete link');
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`Delete user @${username}? All their links will be deleted too.`)) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
                headers: { 'x-auth-token': token }
            });
            showMessage('success', `User @${username} deleted`);
            fetchData();
        } catch (err) {
            showMessage('error', err.response?.data?.msg || 'Failed to delete user');
        }
    };

    const handleToggleRole = async (userId, currentRole, username) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const action = newRole === 'admin' ? 'promote to admin' : 'demote to user';
        
        if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} @${username}?`)) {
            return;
        }

        try {
            await axios.put(
                `${API_URL}/api/admin/users/${userId}/role`,
                { role: newRole },
                { headers: { 'x-auth-token': token } }
            );
            showMessage('success', `User @${username} ${newRole === 'admin' ? 'promoted' : 'demoted'}`);
            fetchData();
        } catch (err) {
            showMessage('error', err.response?.data?.msg || 'Failed to update role');
        }
    };

    const startEdit = (user) => {
        setEditingUser(user._id);
        setEditForm({ username: user.username, email: user.email });
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setEditForm({ username: '', email: '' });
    };

    const handleUpdateUser = async (userId) => {
        try {
            await axios.put(
                `${API_URL}/api/admin/users/${userId}`,
                editForm,
                { headers: { 'x-auth-token': token } }
            );
            showMessage('success', 'User updated');
            setEditingUser(null);
            fetchData();
        } catch (err) {
            showMessage('error', err.response?.data?.msg || 'Failed to update user');
        }
    };

    // Stats from backend API
    const totalUsers = stats?.totalUsers || 0;
    const totalLinks = stats?.totalLinks || 0;
    const totalClicks = stats?.totalClicks || 0;
    const adminCount = stats?.adminCount || 0;
    const avgLinksPerUser = stats?.avgLinksPerUser || 0;
    const weeklyGrowth = stats?.newUsersThisWeek || 0;
    const mostActiveUser = stats?.topUser;

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    border: '4px solid rgba(99, 102, 241, 0.2)',
                    borderTop: '4px solid var(--accent-primary)',
                    borderRadius: '50%',
                    margin: '0 auto',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ color: 'var(--text-secondary)', marginTop: '20px', fontSize: '1.1rem' }}>
                    Loading admin control panel...
                </p>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
            {/* Message Toast */}
            {message.text && (
                <div className={`toast toast-${message.type}`} style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000,
                    padding: '16px 24px',
                    borderRadius: '12px',
                    background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: message.type === 'success' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    color: message.type === 'success' ? '#22c55e' : '#ef4444',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    {message.text}
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 className="title" style={{ margin: 0, marginBottom: '10px' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Manage users and monitor platform activity
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                        onClick={fetchData}
                        className="btn" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            color: '#22c55e'
                        }}
                    >
                        <RefreshCw size={18} /> Refresh
                    </button>
                    <Link to="/dashboard">
                        <button className="btn" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-color)'
                        }}>
                            <Home size={18} /> My Dashboard
                        </button>
                    </Link>
                    <button onClick={logout} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* AI Insights Banner */}
            {mostActiveUser && (
                <div className="animate-fade-in" style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: 'var(--border-radius)',
                    padding: '20px',
                    marginBottom: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <Brain size={28} style={{ color: 'white' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                            <Zap size={16} style={{ color: 'var(--accent-primary)' }} />
                            <strong style={{ color: 'var(--accent-primary)' }}>AI Insights</strong>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                            Most active: <strong style={{ color: '#22c55e' }}>@{mostActiveUser.username}</strong> with <strong style={{ color: '#22c55e' }}>{mostActiveUser.linkCount} links</strong> and <strong style={{ color: '#22c55e' }}>{mostActiveUser.totalClicks} clicks</strong>.
                            {stats?.topLink && <> Top link: <strong style={{ color: '#fbbf24' }}>"{stats.topLink.label}"</strong> ({stats.topLink.clicks} clicks)</>}
                            {weeklyGrowth > 0 && `. ${weeklyGrowth} new ${weeklyGrowth === 1 ? 'user' : 'users'} this week!`}
                        </p>
                    </div>
                </div>
            )}

            {/* Statistics Cards */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '24px',
                marginBottom: '40px'
            }}>
                <div className="stat-card animate-fade-in" style={{ animationDelay: '0s' }}>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px'
                    }}>
                        <Users size={28} style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div className="stat-value">{totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                </div>

                <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px'
                    }}>
                        <LinkIcon size={28} style={{ color: 'var(--accent-secondary)' }} />
                    </div>
                    <div className="stat-value">{totalLinks}</div>
                    <div className="stat-label">Total Links</div>
                </div>

                <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px'
                    }}>
                        <MousePointerClick size={28} style={{ color: 'var(--warning)' }} />
                    </div>
                    <div className="stat-value">{totalClicks}</div>
                    <div className="stat-label">Total Clicks</div>
                </div>

                <div className="stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px'
                    }}>
                        <UserCheck size={28} style={{ color: 'var(--success)' }} />
                    </div>
                    <div className="stat-value">{adminCount}</div>
                    <div className="stat-label">Admins</div>
                </div>

                <div className="stat-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        background: 'rgba(236, 72, 153, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px'
                    }}>
                        <TrendingUp size={28} style={{ color: '#ec4899' }} />
                    </div>
                    <div className="stat-value">{avgLinksPerUser}</div>
                    <div className="stat-label">Avg Links/User</div>
                </div>

                {weeklyGrowth > 0 && (
                    <div className="stat-card animate-fade-in" style={{ 
                        animationDelay: '0.4s',
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                        border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}>
                        <div style={{ 
                            width: '50px', 
                            height: '50px', 
                            background: 'rgba(34, 197, 94, 0.2)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 15px'
                        }}>
                            <Zap size={28} style={{ color: 'var(--success)' }} />
                        </div>
                        <div className="stat-value" style={{ color: 'var(--success)' }}>+{weeklyGrowth}</div>
                        <div className="stat-label">New This Week</div>
                    </div>
                )}
            </div>

            {/* Users Table */}
            <div className="card animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '15px'
                }}>
                    <h2 style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        fontSize: '1.6rem',
                        margin: 0
                    }}>
                        <Activity size={28} style={{ color: 'var(--accent-primary)' }} /> 
                        Users Overview
                    </h2>
                    <div style={{ 
                        padding: '8px 16px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '8px',
                        color: 'var(--accent-primary)',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}>
                        {totalUsers} users registered
                    </div>
                </div>

                {users.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <Users size={48} style={{ opacity: 0.3, marginBottom: '15px' }} />
                        <p>No users found</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', marginTop: '20px' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Username</th>
                                    <th style={{ textAlign: 'left' }}>Email</th>
                                    <th style={{ textAlign: 'center' }}>Role</th>
                                    <th style={{ textAlign: 'center' }}>Links</th>
                                    <th style={{ textAlign: 'left' }}>Joined</th>
                                    <th style={{ textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <React.Fragment key={user._id}>
                                    <tr style={{ 
                                        animation: `fadeIn 0.5s ease-out ${0.5 + index * 0.05}s forwards`,
                                        opacity: 0
                                    }}>
                                        <td>
                                            {editingUser === user._id ? (
                                                <input 
                                                    type="text" 
                                                    value={editForm.username}
                                                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                                    style={{
                                                        padding: '8px 12px',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '8px',
                                                        color: 'var(--text-primary)',
                                                        fontSize: '0.95rem',
                                                        width: '100%'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%',
                                                        background: 'var(--accent-gradient)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '700'
                                                    }}>
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: '600' }}>@{user.username}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {editingUser === user._id ? (
                                                <input 
                                                    type="email" 
                                                    value={editForm.email}
                                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                                    style={{
                                                        padding: '8px 12px',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '8px',
                                                        color: 'var(--text-primary)',
                                                        fontSize: '0.95rem',
                                                        width: '100%'
                                                    }}
                                                />
                                            ) : (
                                                <span style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ 
                                                display: 'inline-flex', 
                                                alignItems: 'center', 
                                                gap: '6px',
                                                padding: '4px 12px',
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                color: 'var(--accent-primary)'
                                            }}>
                                                <LinkIcon size={14} /> {user.linkCount}
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>
                                            {new Date(user.createdAt).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </td>
                                        <td>
                                            <div style={{ 
                                                display: 'flex', 
                                                gap: '8px', 
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                {editingUser === user._id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateUser(user._id)}
                                                            style={{
                                                                padding: '6px 10px',
                                                                background: 'rgba(34, 197, 94, 0.1)',
                                                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                                                borderRadius: '6px',
                                                                color: '#22c55e',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                fontSize: '0.85rem'
                                                            }}
                                                            title="Save"
                                                        >
                                                            <Check size={16} /> Save
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            style={{
                                                                padding: '6px 10px',
                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                                                borderRadius: '6px',
                                                                color: '#ef4444',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                fontSize: '0.85rem'
                                                            }}
                                                            title="Cancel"
                                                        >
                                                            <X size={16} /> Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => fetchUserLinks(user._id)}
                                                            style={{
                                                                padding: '6px',
                                                                background: 'rgba(99, 102, 241, 0.1)',
                                                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                                                borderRadius: '6px',
                                                                color: 'var(--accent-primary)',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                            title="View links"
                                                        >
                                                            {expandedUserId === user._id ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                        <button
                                                            onClick={() => startEdit(user)}
                                                            style={{
                                                                padding: '6px',
                                                                background: 'rgba(99, 102, 241, 0.1)',
                                                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                                                borderRadius: '6px',
                                                                color: 'var(--accent-primary)',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                            title="Edit user"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleRole(user._id, user.role, user.username)}
                                                            style={{
                                                                padding: '6px',
                                                                background: user.role === 'admin' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                                                border: user.role === 'admin' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
                                                                borderRadius: '6px',
                                                                color: user.role === 'admin' ? 'var(--warning)' : '#22c55e',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                            title={user.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                                                        >
                                                            {user.role === 'admin' ? <ShieldOff size={16} /> : <Shield size={16} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id, user.username)}
                                                            style={{
                                                                padding: '6px',
                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                                                borderRadius: '6px',
                                                                color: '#ef4444',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                            title="Delete user"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedUserId === user._id && (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '0', background: 'rgba(99, 102, 241, 0.03)' }}>
                                                <div style={{ padding: '20px' }}>
                                                    <h4 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                                                        <LinkIcon size={16} /> User Links ({userLinks[user._id]?.length || 0})
                                                    </h4>
                                                    {userLinks[user._id]?.length === 0 ? (
                                                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                                                            No links created yet
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                            {userLinks[user._id]?.map(link => (
                                                                <div key={link._id} style={{
                                                                    background: 'rgba(255, 255, 255, 0.03)',
                                                                    border: '1px solid var(--border-color)',
                                                                    borderRadius: '8px',
                                                                    padding: '12px',
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                    gap: '12px'
                                                                }}>
                                                                    <div style={{ flex: 1 }}>
                                                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{link.label}</div>
                                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>{link.url}</div>
                                                                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem' }}>
                                                                            <span style={{ color: 'var(--text-secondary)' }}>
                                                                                <MousePointerClick size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                                                                {link.clicks} clicks
                                                                            </span>
                                                                            <span style={{ color: 'var(--text-secondary)' }}>
                                                                                {new Date(link.createdAt).toLocaleDateString()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                                        <a 
                                                                            href={`${window.location.origin}/l/${link.shortCode}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{
                                                                                padding: '6px',
                                                                                background: 'rgba(99, 102, 241, 0.1)',
                                                                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                                                                borderRadius: '6px',
                                                                                color: 'var(--accent-primary)',
                                                                                display: 'flex',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                        >
                                                                            <ExternalLink size={14} />
                                                                        </a>
                                                                        <button
                                                                            onClick={() => handleDeleteLink(link._id, user._id)}
                                                                            style={{
                                                                                padding: '6px',
                                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                                                                borderRadius: '6px',
                                                                                color: '#ef4444',
                                                                                cursor: 'pointer',
                                                                                display: 'flex'
                                                                            }}
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Activity Summary */}
            <div style={{ 
                marginTop: '40px',
                padding: '24px',
                background: 'rgba(99, 102, 241, 0.05)',
                borderRadius: 'var(--border-radius)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                textAlign: 'center'
            }}>
                <p style={{ 
                    fontSize: '1.1rem',
                    color: 'var(--text-secondary)',
                    margin: 0
                }}>
                    Platform has <strong style={{ color: 'var(--accent-primary)' }}>{totalUsers} users</strong> who created <strong style={{ color: 'var(--accent-primary)' }}>{totalLinks} links</strong> in total
                </p>
            </div>
        </div>
    );
};

export default Admin;
