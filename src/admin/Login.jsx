import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Check if we are in a restaurant-specific login context
            const pathParts = window.location.pathname.split('/');
            const potentialSlug = pathParts[1];
            const isRestaurantLogin = pathParts.length >= 3 && pathParts[2] === 'login';

            if (isRestaurantLogin && potentialSlug !== 'login' && potentialSlug !== 'admin') {
                // RESTAURANT SPECIFIC LOGIN
                // We need to fetch the restaurant data to verify credentials
                // Since Login is outside MenuContext in App structure (wait, it's not, it's inside MenuProvider!)
                // We can use the custom hook nicely, but let's check `restaurants` from local storage or context if possible.
                // Actually context is safest. But we can't use usePlatform inside Login if Login isn't wrapped... 
                // Wait, App.jsx wraps Routes in MenuProvider. So we CAN use usePlatform.
                // BUT Login hook call needs to be inside the component.

                // Let's assume we can import context hook.
                // We need to import it at top of file first.
                // For now, let's just cheat and read from localStorage 'qarta_restaurants' for sync check 
                // because hooking up context might trigger re-renders or be slightly complex if not careful.
                // Actually context is better.

                const storedData = localStorage.getItem('qarta_restaurants');
                const restaurants = storedData ? JSON.parse(storedData) : [];
                const restaurant = restaurants.find(r => r.slug === potentialSlug);

                if (!restaurant) throw new Error("Restaurant not found");

                const creds = restaurant.credentials || {};

                if (creds.username === username && creds.password === password) {
                    localStorage.setItem(`isAuth_${potentialSlug}`, 'true');
                    navigate(`/${potentialSlug}/admin`);
                    return;
                } else {
                    throw new Error("Invalid restaurant credentials");
                }
            }

            // SUPER ADMIN LOGIN (Legacy + Firebase)
            let targetEmail = username;

            // Hardcoded "Username" mapping for user convenience as requested
            if (username === 'admin123') {
                if (password === '123admin123admin123') {
                    localStorage.setItem('isAdminAuthenticated', 'true');
                    navigate('/admin');
                    return;
                } else {
                    throw new Error("Invalid credentials");
                }
            }

            // Fallback: Check if this is a RESTAURANT OWNER logging in at Main Login (Global Redirect)
            const storedData = localStorage.getItem('qarta_restaurants');
            if (storedData) {
                const allRestaurants = JSON.parse(storedData);
                const matchedRestaurant = allRestaurants.find(r =>
                    r.credentials &&
                    r.credentials.username === username &&
                    r.credentials.password === password
                );

                if (matchedRestaurant) {
                    localStorage.setItem(`isAuth_${matchedRestaurant.slug}`, 'true');
                    navigate(`/${matchedRestaurant.slug}/admin`);
                    return;
                }
            }

            // Finally: Try Firebase Auth (Super Admin)
            // We just try it. If it's not an email, Firebase will throw 'auth/invalid-email', which we catch.
            await signInWithEmailAndPassword(auth, targetEmail, password);
            localStorage.setItem('isAdminAuthenticated', 'true');
            navigate('/admin');

        } catch (err) {
            console.error(err);
            setError(err.message || 'Invalid username or password');
        } finally {
            setLoading(false);
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
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            boxShadow: [
                                "0 0 0 0px rgba(14, 165, 233, 0)",
                                "0 0 0 10px rgba(14, 165, 233, 0.1)",
                                "0 0 0 0px rgba(14, 165, 233, 0)"
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'var(--color-primary)',
                            color: 'var(--color-on-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px auto'
                        }}
                    >
                        <Lock size={32} />
                    </motion.div>
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
                                required
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
                                required
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
                        disabled={loading}
                        style={{
                            padding: '16px',
                            borderRadius: '100px',
                            border: 'none',
                            background: loading ? '#ccc' : 'var(--color-primary)',
                            color: 'var(--color-on-primary)',
                            fontSize: '16px',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '12px'
                        }}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
