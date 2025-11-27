import React, { useState } from 'react';
import { Instagram, Facebook, Linkedin, Youtube, Github, MessageCircle, Send, Music2, X } from 'lucide-react';
import axios from 'axios';

const SocialQuickSetup = ({ onComplete }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const platforms = [
        { 
            id: 'instagram', 
            name: 'Instagram', 
            icon: Instagram, 
            color: '#E4405F', 
            placeholder: 'your_username',
            urlPattern: 'https://instagram.com/'
        },
        { 
            id: 'tiktok', 
            name: 'TikTok', 
            icon: Music2, 
            color: '#000000', 
            placeholder: '@your_username',
            urlPattern: 'https://tiktok.com/@'
        },
        { 
            id: 'facebook', 
            name: 'Facebook', 
            icon: Facebook, 
            color: '#1877F2', 
            placeholder: 'your.page',
            urlPattern: 'https://facebook.com/'
        },
        { 
            id: 'x', 
            name: 'X (Twitter)', 
            icon: X, 
            color: '#000000', 
            placeholder: 'your_handle',
            urlPattern: 'https://x.com/'
        },
        { 
            id: 'linkedin', 
            name: 'LinkedIn', 
            icon: Linkedin, 
            color: '#0A66C2', 
            placeholder: 'your-name',
            urlPattern: 'https://linkedin.com/in/'
        },
        { 
            id: 'youtube', 
            name: 'YouTube', 
            icon: Youtube, 
            color: '#FF0000', 
            placeholder: '@your_channel',
            urlPattern: 'https://youtube.com/'
        },
        { 
            id: 'github', 
            name: 'GitHub', 
            icon: Github, 
            color: '#181717', 
            placeholder: 'your_username',
            urlPattern: 'https://github.com/'
        },
        { 
            id: 'whatsapp', 
            name: 'WhatsApp', 
            icon: MessageCircle, 
            color: '#25D366', 
            placeholder: '1234567890',
            urlPattern: 'https://wa.me/'
        },
        { 
            id: 'telegram', 
            name: 'Telegram', 
            icon: Send, 
            color: '#26A5E4', 
            placeholder: 'your_username',
            urlPattern: 'https://t.me/'
        }
    ];

    const handlePlatformSelect = (platform) => {
        setSelectedPlatform(platform);
        setUsername('');
    };

    const handleQuickSetup = async () => {
        if (!username.trim()) return;

        setIsLoading(true);
        try {
            // Force correct API URL
            const API_URL = 'https://qr-enwn.onrender.com';
            // const API_URL = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem('token');
            
            // Get template from backend
            const response = await axios.post(
                `${API_URL}/api/links/social-template`,
                { platform: selectedPlatform.id, username: username.trim() },
                { headers: { 'x-auth-token': token } }
            );

            const template = response.data;

            // Pass the complete link data back
            onComplete({
                label: template.label,
                url: template.url,
                qrCustomization: {
                    color: template.qrCustomization.color,
                    bgColor: template.qrCustomization.bgColor,
                    icon: template.qrCustomization.icon,
                    platform: selectedPlatform.id
                }
            });

            // Reset and close
            setShowModal(false);
            setSelectedPlatform(null);
            setUsername('');
        } catch (err) {
            console.error('Error getting social template:', err);
            alert('Error setting up social link');
        }
        setIsLoading(false);
    };

    if (!showModal) {
        return (
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="btn"
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, rgba(228, 64, 95, 0.15), rgba(249, 115, 22, 0.15))',
                    border: '2px solid rgba(228, 64, 95, 0.4)',
                    color: '#E4405F',
                    padding: '14px 20px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(228, 64, 95, 0.25), rgba(249, 115, 22, 0.25))';
                    e.currentTarget.style.borderColor = '#E4405F';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(228, 64, 95, 0.15), rgba(249, 115, 22, 0.15))';
                    e.currentTarget.style.borderColor = 'rgba(228, 64, 95, 0.4)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
            >
                <Instagram size={20} />
                Social Media Quick Setup
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div className="card" style={{
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h2 style={{ margin: 0 }}>Quick Social Media Setup</h2>
                    <button
                        onClick={() => {
                            setShowModal(false);
                            setSelectedPlatform(null);
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {!selectedPlatform ? (
                    <>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                            Select a platform to create a branded QR link:
                        </p>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: '15px' 
                        }}>
                            {platforms.map(platform => {
                                const Icon = platform.icon;
                                return (
                                    <button
                                        key={platform.id}
                                        onClick={() => handlePlatformSelect(platform)}
                                        style={{
                                            padding: '20px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '10px',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = `${platform.color}15`;
                                            e.currentTarget.style.borderColor = platform.color;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                            e.currentTarget.style.borderColor = 'var(--border-color)';
                                        }}
                                    >
                                        <Icon size={32} style={{ color: platform.color }} />
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                            {platform.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ 
                            padding: '20px',
                            background: `${selectedPlatform.color}15`,
                            borderRadius: '12px',
                            marginBottom: '25px',
                            textAlign: 'center'
                        }}>
                            {React.createElement(selectedPlatform.icon, { 
                                size: 48, 
                                style: { color: selectedPlatform.color, marginBottom: '10px' } 
                            })}
                            <h3 style={{ margin: '10px 0 5px 0' }}>{selectedPlatform.name}</h3>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {selectedPlatform.urlPattern}
                            </p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Enter your {selectedPlatform.name} username:
                            </label>
                            <input
                                type="text"
                                className="input"
                                placeholder={selectedPlatform.placeholder}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleQuickSetup()}
                                autoFocus
                                style={{ marginBottom: 0 }}
                            />
                            {username && (
                                <p style={{ 
                                    marginTop: '8px', 
                                    fontSize: '0.85rem', 
                                    color: 'var(--text-secondary)' 
                                }}>
                                    URL: {selectedPlatform.urlPattern}{username}
                                </p>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setSelectedPlatform(null)}
                                className="btn"
                                style={{
                                    flex: 1,
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleQuickSetup}
                                disabled={!username.trim() || isLoading}
                                className="btn btn-primary"
                                style={{
                                    flex: 2,
                                    background: selectedPlatform.color,
                                    border: 'none',
                                    opacity: (!username.trim() || isLoading) ? 0.5 : 1
                                }}
                            >
                                {isLoading ? 'Creating...' : 'Create Link'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SocialQuickSetup;
