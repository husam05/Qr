import React, { useState } from 'react';
import { Palette, Image, Sparkles, X, Check } from 'lucide-react';

const QRCustomizer = ({ onCustomize, initialLabel = '', initialUrl = '' }) => {
    const [showCustomizer, setShowCustomizer] = useState(false);
    const [customization, setCustomization] = useState({
        color: '#000000',
        bgColor: '#ffffff',
        icon: '',
        platform: 'default',
        logo: null
    });
    const [logoPreview, setLogoPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const socialPlatforms = [
        { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F', emoji: '📷' },
        { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000', emoji: '🎵' },
        { id: 'facebook', name: 'Facebook', icon: '👥', color: '#1877F2', emoji: '👥' },
        { id: 'x', name: 'X (Twitter)', icon: '✖️', color: '#000000', emoji: '✖️' },
        { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2', emoji: '💼' },
        { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#FF0000', emoji: '▶️' },
        { id: 'github', name: 'GitHub', icon: '💻', color: '#181717', emoji: '💻' },
        { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#25D366', emoji: '💬' },
        { id: 'telegram', name: 'Telegram', icon: '✈️', color: '#26A5E4', emoji: '✈️' },
        { id: 'snapchat', name: 'Snapchat', icon: '👻', color: '#FFFC00', emoji: '👻' }
    ];

    const businessTypes = [
        { id: 'store', name: 'Store/Shop', icon: '🏪', color: '#10B981' },
        { id: 'restaurant', name: 'Restaurant', icon: '🍽️', color: '#F59E0B' },
        { id: 'website', name: 'Website', icon: '🌐', color: '#6366F1' },
        { id: 'portfolio', name: 'Portfolio', icon: '💼', color: '#8B5CF6' },
        { id: 'contact', name: 'Contact', icon: '📞', color: '#EC4899' },
        { id: 'event', name: 'Event', icon: '🎉', color: '#F43F5E' }
    ];

    const predefinedColors = [
        '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
        '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000',
        '#E4405F', '#1877F2', '#25D366', '#FF0000', '#0A66C2'
    ];

    const applyPlatform = (platform) => {
        setCustomization({
            color: platform.color,
            bgColor: '#ffffff',
            icon: platform.emoji || platform.icon,
            platform: platform.id
        });
    };

    const handleSave = () => {
        onCustomize(customization);
        setShowCustomizer(false);
    };

    const handleReset = () => {
        setCustomization({
            color: '#000000',
            bgColor: '#ffffff',
            icon: '',
            platform: 'default',
            logo: null
        });
        setLogoPreview(null);
    };

    const handleFileUpload = (file) => {
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (PNG, JPG, SVG)');
            return;
        }
        
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Image size should be less than 2MB');
            return;
        }
        
        // Read file as base64
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            setLogoPreview(base64);
            setCustomization({...customization, logo: base64});
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeLogo = () => {
        setLogoPreview(null);
        setCustomization({...customization, logo: null});
    };

    if (!showCustomizer) {
        return (
            <button
                type="button"
                onClick={() => setShowCustomizer(true)}
                className="btn"
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
                    border: '2px solid rgba(99, 102, 241, 0.4)',
                    color: 'var(--accent-primary)',
                    padding: '14px 20px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25))';
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
            >
                <Palette size={20} />
                Custom Colors & Logo
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
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px'
                }}>
                    <div>
                        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Sparkles size={24} style={{ color: 'var(--accent-primary)' }} />
                            Customize Your QR Code
                        </h2>
                        <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Make your QR code stand out with colors and platform themes
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCustomizer(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            padding: '5px'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Preview */}
                <div style={{
                    background: customization.bgColor,
                    padding: '30px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    marginBottom: '25px',
                    border: '2px dashed var(--border-color)',
                    position: 'relative'
                }}>
                    <div style={{
                        width: '150px',
                        height: '150px',
                        background: customization.color,
                        margin: '0 auto',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '4rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(8, 1fr)',
                            gap: '2px',
                            padding: '10px',
                            opacity: 0.3
                        }}>
                            {[...Array(64)].map((_, i) => (
                                <div key={i} style={{
                                    background: i % 3 === 0 ? customization.color : 'transparent',
                                    borderRadius: '2px'
                                }} />
                            ))}
                        </div>
                        {logoPreview ? (
                            <img 
                                src={logoPreview} 
                                alt="Logo" 
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'contain',
                                    background: 'white',
                                    borderRadius: '8px',
                                    padding: '5px',
                                    position: 'relative',
                                    zIndex: 1
                                }} 
                            />
                        ) : (
                            <span style={{ position: 'relative', zIndex: 1 }}>
                                {customization.icon || '📱'}
                            </span>
                        )}
                    </div>
                    <p style={{ marginTop: '15px', color: customization.color, fontWeight: '600' }}>
                        {logoPreview ? 'QR with Logo' : 'QR Preview'}
                    </p>
                </div>

                {/* Social Media Quick Select */}
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={16} /> Social Media Platforms
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                        {socialPlatforms.map(platform => (
                            <button
                                key={platform.id}
                                type="button"
                                onClick={() => applyPlatform(platform)}
                                style={{
                                    padding: '12px',
                                    background: customization.platform === platform.id ? 
                                        `${platform.color}15` : 'rgba(255, 255, 255, 0.05)',
                                    border: customization.platform === platform.id ? 
                                        `2px solid ${platform.color}` : '1px solid var(--border-color)',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '5px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <span style={{ fontSize: '1.8rem' }}>{platform.icon}</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                    {platform.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logo Upload */}
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Image size={16} /> Add Logo to QR (Optional)
                    </h3>
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        style={{
                            border: isDragging ? '2px dashed var(--accent-primary)' : '2px dashed var(--border-color)',
                            borderRadius: '12px',
                            padding: '30px',
                            textAlign: 'center',
                            background: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative'
                        }}
                        onClick={() => document.getElementById('logo-upload').click()}
                    >
                        {logoPreview ? (
                            <div>
                                <img src={logoPreview} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '10px' }} />
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Logo uploaded successfully!</p>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeLogo(); }}
                                    style={{
                                        padding: '8px 16px',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '6px',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    Remove Logo
                                </button>
                            </div>
                        ) : (
                            <div>
                                <Image size={48} style={{ color: 'var(--accent-primary)', marginBottom: '10px' }} />
                                <p style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '5px' }}>Drop your logo here</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>or click to browse</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PNG, JPG, SVG • Max 2MB</p>
                            </div>
                        )}
                        <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e.target.files[0])}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                {/* Business Types */}
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>
                        Business & Other
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                        {businessTypes.map(type => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => applyPlatform(type)}
                                style={{
                                    padding: '12px',
                                    background: customization.platform === type.id ? 
                                        `${type.color}15` : 'rgba(255, 255, 255, 0.05)',
                                    border: customization.platform === type.id ? 
                                        `2px solid ${type.color}` : '1px solid var(--border-color)',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                            >
                                <span style={{ fontSize: '1.8rem' }}>{type.icon}</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                    {type.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Colors */}
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>
                        Custom Colors
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                QR Code Color
                            </label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    value={customization.color}
                                    onChange={(e) => setCustomization({...customization, color: e.target.value})}
                                    style={{
                                        width: '50px',
                                        height: '40px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                />
                                <input
                                    type="text"
                                    value={customization.color}
                                    onChange={(e) => setCustomization({...customization, color: e.target.value})}
                                    className="input"
                                    style={{ flex: 1, marginBottom: 0 }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '5px', marginTop: '8px', flexWrap: 'wrap' }}>
                                {predefinedColors.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setCustomization({...customization, color})}
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            background: color,
                                            border: customization.color === color ? '3px solid white' : '1px solid var(--border-color)',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            boxShadow: customization.color === color ? '0 0 0 2px var(--accent-primary)' : 'none'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                Background Color
                            </label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    value={customization.bgColor}
                                    onChange={(e) => setCustomization({...customization, bgColor: e.target.value})}
                                    style={{
                                        width: '50px',
                                        height: '40px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                />
                                <input
                                    type="text"
                                    value={customization.bgColor}
                                    onChange={(e) => setCustomization({...customization, bgColor: e.target.value})}
                                    className="input"
                                    style={{ flex: 1, marginBottom: 0 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-color)'
                        }}
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="btn btn-primary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Check size={18} />
                        Apply Customization
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRCustomizer;
