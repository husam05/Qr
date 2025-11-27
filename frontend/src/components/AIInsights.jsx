import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Info, Sparkles, Zap } from 'lucide-react';

const AIInsights = ({ links }) => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Force correct API URL
    const API_URL = 'https://qr-enwn.onrender.com';
    // const API_URL = import.meta.env.VITE_API_URL;

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchInsights();
    }, [links]);

    const fetchInsights = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/links/analytics/insights`, {
                headers: { 'x-auth-token': token }
            });
            setInsights(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching insights:', err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ color: 'var(--text-secondary)', marginTop: '15px' }}>
                    AI is analyzing your data...
                </p>
            </div>
        );
    }

    if (!insights) return null;

    const getRecommendationIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={20} style={{ color: 'var(--success)' }} />;
            case 'warning': return <AlertCircle size={20} style={{ color: 'var(--warning)' }} />;
            case 'info': return <Info size={20} style={{ color: 'var(--accent-primary)' }} />;
            default: return <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />;
        }
    };

    return (
        <div className="card animate-fade-in" style={{ 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            marginBottom: '30px'
        }}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginBottom: '20px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Brain size={24} style={{ color: 'white' }} />
                </div>
                <div>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        AI Insights
                        <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Smart recommendations powered by AI
                    </p>
                </div>
            </div>

            {insights.message ? (
                <div style={{ 
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                }}>
                    <p style={{ margin: '0 0 15px 0', color: 'var(--text-primary)' }}>
                        {insights.message}
                    </p>
                    {insights.tips && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {insights.tips.map((tip, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Zap size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{tip}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Performance Stats */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                        gap: '15px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ 
                            padding: '15px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '10px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                                {insights.totalClicks}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Total Clicks
                            </div>
                        </div>
                        <div style={{ 
                            padding: '15px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '10px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-secondary)' }}>
                                {insights.avgClicksPerLink}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Avg per Link
                            </div>
                        </div>
                        {insights.topPerformer && (
                            <div style={{ 
                                padding: '15px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '10px',
                                textAlign: 'center'
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    gap: '5px',
                                    marginBottom: '5px'
                                }}>
                                    <TrendingUp size={20} style={{ color: 'var(--success)' }} />
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>
                                        {insights.topPerformer.clicks}
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    Top Link
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI Recommendations */}
                    {insights.recommendations && insights.recommendations.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h4 style={{ 
                                fontSize: '1rem', 
                                margin: '0 0 10px 0',
                                color: 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Sparkles size={16} /> Smart Recommendations
                            </h4>
                            {insights.recommendations.map((rec, index) => (
                                <div 
                                    key={index}
                                    style={{ 
                                        padding: '15px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'start',
                                        gap: '12px'
                                    }}
                                >
                                    {getRecommendationIcon(rec.type)}
                                    <p style={{ 
                                        margin: 0, 
                                        fontSize: '0.95rem',
                                        lineHeight: '1.5',
                                        color: 'var(--text-primary)'
                                    }}>
                                        {rec.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AIInsights;
