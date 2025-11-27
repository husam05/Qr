import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Link as LinkIcon, BarChart3, Shield, ArrowRight, CheckCircle, Zap, Globe, Bot, Layers, Smartphone } from 'lucide-react';

const Landing = () => {
    const [lang, setLang] = useState('en');

    const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

    const t = {
        en: {
            heroTitle: "Next-Gen QR Codes Powered by AI",
            heroSubtitle: "Experience the future of connectivity. Create stunning, AI-enhanced QR codes that do more than just link. All your digital identity in one scan.",
            getStarted: "Get Started",
            signIn: "Sign In",
            features: {
                generate: "AI Generation",
                generateDesc: "Smart, adaptive codes",
                manage: "Central Hub",
                manageDesc: "All links in one place",
                analytics: "AI Analytics",
                analyticsDesc: "Predictive insights",
                secure: "Enterprise Security",
                secureDesc: "Bank-grade protection"
            },
            whyChoose: "Why Choose QRLinkHub?",
            aiSection: {
                title: "AI-Powered Customization",
                desc: "Transform boring black-and-white codes into artistic masterpieces using our AI engine. Your brand, your style, generated instantly.",
                badge: "New Feature"
            },
            allInOne: {
                title: "All-in-One Solution",
                desc: "Connect your social media, payments, WiFi, and contact info in a single smart QR code."
            },
            cta: {
                title: "Start Creating Today",
                subtitle: "Professional QR code management at your fingertips",
                button: "Create Free Account"
            },
            footer: "© 2025 QRLinkHub. Professional QR Management Platform"
        },
        ar: {
            heroTitle: "الجيل القادم من رموز QR مدعوم بالذكاء الاصطناعي",
            heroSubtitle: "اختبر مستقبل الاتصال. أنشئ رموز QR مذهلة ومحسنة بالذكاء الاصطناعي تفعل أكثر من مجرد الربط. هويتك الرقمية كاملة في مسحة واحدة.",
            getStarted: "ابدأ الآن",
            signIn: "تسجيل الدخول",
            features: {
                generate: "توليد بالذكاء الاصطناعي",
                generateDesc: "رموز ذكية ومتكيفة",
                manage: "التحكم المركزي",
                manageDesc: "كل روابطك في مكان واحد",
                analytics: "تحليلات ذكية",
                analyticsDesc: "رؤى وتوقعات",
                secure: "أمان المؤسسات",
                secureDesc: "حماية بمستوى بنكي"
            },
            whyChoose: "لماذا تختار QRLinkHub؟",
            aiSection: {
                title: "تخصيص مدعوم بالذكاء الاصطناعي",
                desc: "حول الرموز التقليدية المملة إلى تحف فنية باستخدام محرك الذكاء الاصطناعي لدينا. علامتك التجارية، أسلوبك، يتم توليدها فوراً.",
                badge: "ميزة جديدة"
            },
            allInOne: {
                title: "حل شامل في مكان واحد",
                desc: "اربط وسائل التواصل الاجتماعي، المدفوعات، الواي فاي، ومعلومات الاتصال في رمز QR ذكي واحد."
            },
            cta: {
                title: "ابدأ الإنشاء اليوم",
                subtitle: "إدارة احترافية لرموز QR بين يديك",
                button: "أنشئ حساب مجاني"
            },
            footer: "© 2025 QRLinkHub. منصة إدارة QR الاحترافية"
        }
    };

    const content = t[lang];
    const isRTL = lang === 'ar';

    return (
        <div style={{ minHeight: '100vh', direction: isRTL ? 'rtl' : 'ltr', fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
            {/* Language Toggle */}
            <div style={{ position: 'absolute', top: '20px', [isRTL ? 'left' : 'right']: '20px', zIndex: 100 }}>
                <button 
                    onClick={toggleLang}
                    className="btn"
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                    }}
                >
                    <Globe size={18} />
                    {lang === 'en' ? 'العربية' : 'English'}
                </button>
            </div>

            {/* Hero Section */}
            <div className="container" style={{ paddingTop: '80px', paddingBottom: '60px', textAlign: 'center' }}>
                <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ 
                        display: 'inline-block', 
                        padding: '6px 16px', 
                        background: 'rgba(99, 102, 241, 0.1)', 
                        borderRadius: '20px', 
                        color: '#818cf8',
                        marginBottom: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}>
                        ✨ {content.aiSection.badge}
                    </div>
                    
                    <h1 style={{ 
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                        fontWeight: '900',
                        marginBottom: '25px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: '1.2'
                    }}>
                        {content.heroTitle}
                    </h1>
                    
                    <p style={{ 
                        fontSize: '1.25rem', 
                        color: 'var(--text-secondary)', 
                        marginBottom: '40px',
                        lineHeight: '1.6',
                        maxWidth: '700px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        {content.heroSubtitle}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
                        <Link to="/register">
                            <button className="btn btn-primary" style={{ 
                                padding: '16px 40px', 
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                borderRadius: '12px'
                            }}>
                                {content.getStarted} {isRTL ? <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} /> : <ArrowRight size={20} />}
                            </button>
                        </Link>
                        <Link to="/login">
                            <button className="btn" style={{ 
                                padding: '16px 40px', 
                                fontSize: '1.1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                borderRadius: '12px'
                            }}>
                                {content.signIn}
                            </button>
                        </Link>
                    </div>

                    {/* AI Visual Showcase */}
                    <div style={{ 
                        position: 'relative',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'linear-gradient(180deg, rgba(30,30,40,0.8) 0%, rgba(20,20,30,1) 100%)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        padding: '40px 20px'
                    }}>
                        <div style={{ 
                            position: 'absolute', 
                            top: '-50%', 
                            left: '50%', 
                            transform: 'translate(-50%, 0)', 
                            width: '600px', 
                            height: '600px', 
                            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)',
                            pointerEvents: 'none'
                        }} />
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', alignItems: 'center' }}>
                            <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'white' }}>
                                    <Bot size={24} style={{ color: '#818cf8', verticalAlign: 'middle', [isRTL ? 'marginLeft' : 'marginRight']: '10px' }} />
                                    {content.aiSection.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                                    {content.aiSection.desc}
                                </p>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {['Stable Diffusion', 'DALL-E 3', 'Midjourney Style'].map(tag => (
                                        <span key={tag} style={{ 
                                            fontSize: '0.8rem', 
                                            padding: '4px 12px', 
                                            borderRadius: '20px', 
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div style={{ position: 'relative' }}>
                                {/* Placeholder for AI QR Image */}
                                <div style={{ 
                                    width: '100%', 
                                    maxWidth: '300px', 
                                    aspectRatio: '1', 
                                    margin: '0 auto',
                                    background: 'linear-gradient(45deg, #1a1a2e, #16213e)',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid rgba(99,102,241,0.3)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                    <QrCode size={120} color="#818cf8" style={{ opacity: 0.8 }} />
                                    <div style={{ 
                                        position: 'absolute', 
                                        bottom: '20px', 
                                        left: '50%', 
                                        transform: 'translateX(-50%)',
                                        background: 'rgba(0,0,0,0.6)',
                                        backdropFilter: 'blur(4px)',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        whiteSpace: 'nowrap',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        AI Generated Style
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Features */}
                <div className="animate-fade-in" style={{ 
                    marginTop: '80px', 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '25px',
                    maxWidth: '1000px',
                    margin: '80px auto 0'
                }}>
                    {[
                        { icon: <Bot size={32} />, title: content.features.generate, desc: content.features.generateDesc },
                        { icon: <Layers size={32} />, title: content.features.manage, desc: content.features.manageDesc },
                        { icon: <BarChart3 size={32} />, title: content.features.analytics, desc: content.features.analyticsDesc },
                        { icon: <Shield size={32} />, title: content.features.secure, desc: content.features.secureDesc }
                    ].map((item, i) => (
                        <div key={i} className="card" style={{ 
                            padding: '30px', 
                            textAlign: 'center',
                            background: 'var(--bg-secondary)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'transform 0.3s ease'
                        }}>
                            <div style={{ 
                                color: 'var(--accent-primary)', 
                                marginBottom: '15px', 
                                display: 'flex', 
                                justifyContent: 'center',
                                background: 'rgba(99,102,241,0.1)',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                alignItems: 'center',
                                margin: '0 auto 15px'
                            }}>
                                {item.icon}
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* All In One Section */}
            <div style={{ background: 'var(--bg-secondary)', padding: '80px 20px' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                        gap: '50px',
                        alignItems: 'center'
                    }}>
                        <div style={{ order: isRTL ? 2 : 1 }}>
                            <div style={{ 
                                width: '100%', 
                                height: '400px', 
                                background: 'linear-gradient(135deg, #2d1b69 0%, #1a1a2e 100%)',
                                borderRadius: '24px',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <Smartphone size={200} color="rgba(255,255,255,0.1)" />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
                                    <div className="card" style={{ padding: '15px', width: '200px', display: 'flex', alignItems: 'center', gap: '10px', transform: 'translateX(-30px)' }}>
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#E1306C' }}></div>
                                        <span>Instagram</span>
                                    </div>
                                    <div className="card" style={{ padding: '15px', width: '200px', display: 'flex', alignItems: 'center', gap: '10px', transform: 'translateX(30px)' }}>
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#1877F2' }}></div>
                                        <span>Facebook</span>
                                    </div>
                                    <div className="card" style={{ padding: '15px', width: '200px', display: 'flex', alignItems: 'center', gap: '10px', transform: 'translateX(-20px)' }}>
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#25D366' }}></div>
                                        <span>WhatsApp</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ order: isRTL ? 1 : 2, textAlign: isRTL ? 'right' : 'left' }}>
                            <h2 className="title" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
                                {content.allInOne.title}
                            </h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '30px' }}>
                                {content.allInOne.desc}
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {[
                                    isRTL ? 'ملف تعريف اجتماعي موحد' : 'Unified Social Profile',
                                    isRTL ? 'اتصال واي فاي مباشر' : 'Direct WiFi Connect',
                                    isRTL ? 'بطاقات عمل رقمية (vCard)' : 'Digital Business Cards (vCard)',
                                    isRTL ? 'روابط دفع وتبرع' : 'Payment & Donation Links'
                                ].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.05rem' }}>
                                        <CheckCircle size={20} color="var(--accent-primary)" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                padding: '60px 20px',
                textAlign: 'center'
            }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <h2 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: '800', 
                        marginBottom: '15px',
                        color: 'white'
                    }}>
                        {content.cta.title}
                    </h2>
                    <p style={{ 
                        fontSize: '1.1rem', 
                        marginBottom: '30px',
                        color: 'rgba(255, 255, 255, 0.95)'
                    }}>
                        {content.cta.subtitle}
                    </p>
                    <Link to="/register">
                        <button className="btn" style={{ 
                            padding: '15px 40px', 
                            fontSize: '1.1rem',
                            background: 'white',
                            color: 'var(--accent-primary)',
                            fontWeight: '700',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}>
                            {content.cta.button}
                        </button>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div style={{ 
                background: 'var(--bg-secondary)', 
                padding: '30px 20px',
                textAlign: 'center',
                borderTop: '1px solid var(--border-color)'
            }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {content.footer}
                </p>
            </div>
        </div>
    );
};

export default Landing;
