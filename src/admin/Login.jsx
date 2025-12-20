import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Hardcoded credentials as requested
        if (username === 'admin123' && password === '123admin123admin123') {
            localStorage.setItem('isAdminAuthenticated', 'true');
            navigate('/admin');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-app)',
            color: 'var(--color-ink)',
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                background: 'var(--bg-surface)',
                borderRadius: '24px',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: 'var(--color-primary)',
                        color: 'var(--color-on-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto'
                    }}>
                        <Lock size={32} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Admin Login</h1>
                    <p style={{ color: 'var(--color-text-subtle)', marginTop: '8px' }}>Secure access to platform manager</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-subtle)' }} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 44px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-app)',
                                    color: 'var(--color-ink)',
                                    fontSize: '16px'
                                }}
                                placeholder="Enter username"
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-subtle)' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 44px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-app)',
                                    color: 'var(--color-ink)',
                                    fontSize: '16px'
                                }}
                                placeholder="Enter password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            padding: '16px',
                            borderRadius: '100px',
                            border: 'none',
                            background: 'var(--color-primary)',
                            color: 'var(--color-on-primary)',
                            fontSize: '16px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            marginTop: '12px'
                        }}
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
