import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode';

const PublicProfile = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/u/${slug}`);
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    if (!data) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>User not found</div>;

    const { user, links } = data;

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0f0f13, #1a1a20)', padding: '40px 20px' }}>
            <div className="animate-fade-in" style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'var(--accent-gradient)',
                    borderRadius: '50%',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: 'white'
                }}>
                    {user.username[0].toUpperCase()}
                </div>

                <h1 style={{ marginBottom: '10px', fontSize: '2rem' }}>@{user.username}</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Welcome to my links</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {links.map(link => (
                        <a
                            key={link._id}
                            href={`${API_URL}/l/${link.shortCode}`} // Go through backend redirect to count clicks
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card"
                            style={{
                                padding: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'transform 0.2s',
                                textDecoration: 'none',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{link.label}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>&rarr;</span>
                        </a>
                    ))}
                    {links.length === 0 && (
                        <p style={{ color: 'var(--text-secondary)' }}>No links available.</p>
                    )}
                </div>

                <div style={{ marginTop: '50px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    Powered by <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>QRLinkHub</span>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
