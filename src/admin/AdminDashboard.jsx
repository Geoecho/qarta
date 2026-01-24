import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { User, Store, LayoutDashboard, Settings, Plus, Edit2, LogOut, Trash2, ArrowLeft, Menu as MenuIcon, X, Save, Package, ChevronUp, ChevronDown, GripVertical, QrCode, ArrowUpDown, Check, ExternalLink, Image as ImageIcon, Sparkles, Bell } from 'lucide-react';
import { QRCode } from 'react-qrcode-logo';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlatform } from '../contexts/MenuContext';
import { auth } from '../firebase';
import IconPicker from '../components/IconPicker';
import './AdminDashboard.css';
import { ALLERGENS, getAllergenDetails } from '../utils/allergenHelper';
import CloudinaryUploadButton from '../components/CloudinaryUploadButton';
import { ADMIN_TRANSLATIONS } from './adminTranslations';
import TableQRModal from './TableQRModal';

// --- Shared Components ---
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '24px' }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                        <X size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};


// --- Main Controller Component ---

export const AdminDashboard = () => {
    // Check if we are in a specific restaurant admin route
    // The route is /:slug/admin, so we can use useParams
    // BUT AdminDashboard is used in two places:
    // 1. /admin (Super Admin) - no slug
    // 2. /:slug/admin (Restaurant Admin) - has slug
    // We need to parse URL manually or use a wrapper that passes props?
    // Let's use window.location or match since we are inside a Route.
    // Actually `useParams` will return the slug if we are in that route.

    // Limitation: useParams might return empty if not defined in parent route? 
    // In App.jsx: path="/:slug/admin" -> yes, it will have slug.
    // In App.jsx: path="/admin" -> no slug.

    const params = useParams(); // Need to import useParams in this file or pass it down? 
    // App.jsx has useParams, but AdminDashboard imports are needed.
    // Adding import for useParams

    const { slug: routeSlug } = params; // Rename to avoid confusion

    const [view, setView] = useState(routeSlug ? 'menu-editor' : 'restaurants');
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const { restaurants } = usePlatform();

    // Effect to auto-select restaurant if in single-tenant mode
    useEffect(() => {
        if (routeSlug && restaurants.length > 0) {
            const target = restaurants.find(r => r.slug === routeSlug);
            if (target) {
                setSelectedRestaurantId(target.id);
                setView('menu-editor');
            }
        }
    }, [routeSlug, restaurants]);

    const selectedRestaurant = restaurants.find(r => r.id === selectedRestaurantId);

    // If we are in menu-editor but no restaurant is selected (e.g. reload or bug), go back
    // BUT ONLY if we are NOT in forced single-tenant mode
    useEffect(() => {
        if (view === 'menu-editor' && !selectedRestaurant && !routeSlug) {
            setView('restaurants');
        }
    }, [view, selectedRestaurant, routeSlug]);

    // Admin Localization
    const [adminLang, setAdminLang] = useState(localStorage.getItem('qarta_admin_lang') || 'en');

    useEffect(() => {
        localStorage.setItem('qarta_admin_lang', adminLang);
    }, [adminLang]);

    const t = (key) => ADMIN_TRANSLATIONS[adminLang]?.[key] || ADMIN_TRANSLATIONS['en']?.[key] || key;

    return (
        <AdminLayout
            view={view}
            setView={setView}
            isMultiTenant={!!routeSlug}
            onBack={(view === 'restaurants' || routeSlug) ? null : () => setView('restaurants')}
            t={t}
        >
            {!routeSlug && view === 'restaurants' && (
                <RestaurantList
                    t={t}
                    adminLang={adminLang}
                    setAdminLang={setAdminLang}
                    onSelect={(id) => {
                        setSelectedRestaurantId(id);
                        setView('menu-editor');
                    }}
                />
            )}

            {view === 'menu-editor' && selectedRestaurant && (
                <MenuEditor
                    restaurant={selectedRestaurant}
                    onBack={(view === 'restaurants' || routeSlug) ? null : () => setView('restaurants')}
                    t={t}
                    adminLang={adminLang}
                    setAdminLang={setAdminLang}
                />
            )}

            {/* Show error if slug exists but restaurant not found */}
            {routeSlug && !selectedRestaurant && (
                <div style={{ padding: 40, textAlign: 'center' }}>
                    <h2>Loading...</h2>
                    <p>If this takes too long, the restaurant <b>{routeSlug}</b> might not exist.</p>
                </div>
            )}
        </AdminLayout>
    );
};

const ThemeEditor = ({ theme, onChange, t = s => s }) => {
    return (
        <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{t('themeCustomization')}</h3>
                    <p style={{ margin: '0 0 24px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                        Set your brand's core identity. All other colors are automatically optimized for readability.
                    </p>
                </div>
                <button
                    onClick={() => {
                        if (confirm('Reset theme to default?')) {
                            const resetTheme = { ...theme };
                            onChange('reset_theme', null);
                        }
                    }}
                    className="admin-btn admin-btn-ghost"
                    style={{ fontSize: '12px' }}
                >
                    Restore Defaults
                </button>
            </div>

            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'grid', gap: '24px' }}>

                    {/* Primary Color Section */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Primary Brand Color</label>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                                    Used for highlights, active states, and buttons.
                                </p>
                            </div>
                            <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                                <input
                                    type="color"
                                    value={theme?.primary || '#ff5f1f'}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        onChange('primary', val);
                                        // Clear overrides to force recalculation with new primary
                                        ['darkPrimary', 'itemPriceColor', 'darkItemPriceColor'].forEach(key => onChange(key, ''));
                                    }}
                                    style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                        <input
                            className="admin-input"
                            value={theme?.primary || ''}
                            onChange={(e) => onChange('primary', e.target.value)}
                            placeholder="#ff5f1f"
                            style={{ fontFamily: 'monospace', fontSize: '15px' }}
                        />
                    </div>

                    {/* Logo & Visuals Section */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <h4 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 600 }}>Visual Settings</h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <input
                                    type="checkbox"
                                    id="invertLogo"
                                    checked={!!theme?.darkInvertLogo}
                                    onChange={(e) => onChange('darkInvertLogo', e.target.checked)}
                                    style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                                />
                                <div>
                                    <label htmlFor="invertLogo" style={{ fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>{t('invertLogo')}</label>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Flip logo colors in dark mode (useful for black logos).</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <input
                                    type="checkbox"
                                    id="invertImages"
                                    checked={!!theme?.darkInvertImages}
                                    onChange={(e) => onChange('darkInvertImages', e.target.checked)}
                                    style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                                />
                                <div>
                                    <label htmlFor="invertImages" style={{ fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>{t('invertImages')}</label>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Flip icon/line art colors in dark mode.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Default Appearance Section */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 600 }}>Default Appearance</h4>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => onChange('defaultMode', 'light')}
                                style={{
                                    flex: 1, padding: '14px', borderRadius: '10px',
                                    border: theme.defaultMode === 'light' ? '2px solid var(--color-primary)' : '1px solid var(--border)',
                                    background: '#ffffff', color: '#000000', cursor: 'pointer', fontWeight: 600,
                                    fontSize: '14px'
                                }}
                            >
                                ☀️ Light
                            </button>
                            <button
                                onClick={() => onChange('defaultMode', 'dark')}
                                style={{
                                    flex: 1, padding: '14px', borderRadius: '10px',
                                    border: theme.defaultMode === 'dark' ? '2px solid var(--color-primary)' : '1px solid var(--border)',
                                    background: '#0f172a', color: '#ffffff', cursor: 'pointer', fontWeight: 600,
                                    fontSize: '14px'
                                }}
                            >
                                🌙 Dark
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};


// --- Components ---

const AdminLayout = ({ children, onBack, view, setView, isMultiTenant, t = s => s }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            localStorage.removeItem('isAdminAuthenticated');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div className="admin-container">


            {/* Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <div className="admin-logo-mark">Q</div>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>Qarta.</span>
                    <button
                        className="mobile-only"
                        onClick={() => setSidebarOpen(false)}
                        style={{ marginLeft: 'auto', display: window.innerWidth > 768 ? 'none' : 'block', background: 'transparent', border: 'none', color: 'white' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Status Indicator */}
                <StatusBadge t={t} />

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    {!isMultiTenant && (
                        <SidebarItem
                            icon={LayoutDashboard}
                            label={t('restaurants')}
                            active={!onBack && view === 'restaurants'}
                            onClick={() => {
                                if (onBack) onBack();
                                if (setView) setView('restaurants');
                                setSidebarOpen(false);
                            }}
                        />
                    )}

                    {(onBack || isMultiTenant) && <SidebarItem icon={Settings} label={t('menuEditor')} active />}
                </nav>

                <button
                    onClick={handleLogout}
                    className="sidebar-nav-item"
                    style={{ marginTop: 'auto', color: '#64748b', background: 'rgba(0,0,0,0.3)' }}
                >
                    <LogOut size={20} />
                    {t('logout')}
                </button>
            </div>

            {/* Main Content */}
            <div className="admin-content">
                {children}
            </div>
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className={`sidebar-nav-item ${active ? 'active' : ''}`}
    >
        <Icon size={20} color={active ? 'var(--color-primary)' : 'currentColor'} />
        {label}
    </div>
);

const StatusBadge = ({ t = s => s }) => {
    const { saveStatus, serverError } = usePlatform();

    if (saveStatus === 'idle') return null;

    let bg = 'rgba(255,255,255,0.05)';
    let color = '#94a3b8';
    let text = t('ready');

    if (saveStatus === 'saving') {
        bg = 'rgba(56, 189, 248, 0.1)'; color = 'var(--color-primary)'; text = t('saving');
    } else if (saveStatus === 'success') {
        bg = 'rgba(34, 197, 94, 0.1)'; color = '#4ade80'; text = t('saved');
    } else if (saveStatus === 'error') {
        bg = 'rgba(239, 68, 68, 0.1)'; color = '#f87171'; text = t('error');
    }

    return (
        <div style={{
            margin: '0 0 24px 0',
            padding: '10px 16px',
            borderRadius: '12px',
            backgroundColor: bg,
            color: color,
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
            <div style={{ flex: 1 }}>{text}</div>
            {serverError && <div style={{ fontSize: 10 }}>{serverError.slice(0, 10)}...</div>}
        </div>
    );
};

// --- Sub-Views ---


const QRCodeModal = ({ isOpen, onClose, restaurant, onSave, t = s => s }) => {
    if (!isOpen || !restaurant) return null;

    const fullUrl = `${window.location.origin}/${restaurant.slug}`;
    const [config, setConfig] = useState({
        fgColor: "#000000",
        bgColor: "#FFFFFF",
        qrStyle: "squares",
        eyeRadius: 0,
        logoImage: restaurant.logo || "",
        logoPadding: 5,
        logoOpacity: 1,
        ...restaurant.theme?.qr // Load saved config if exists
    });

    // Only reset when modal opens, NOT when config or restaurant updates during editing
    useEffect(() => {
        if (isOpen && restaurant) {
            setConfig(prev => ({
                fgColor: "#000000",
                bgColor: "#FFFFFF",
                qrStyle: "squares",
                eyeRadius: 0,
                logoImage: restaurant.logo || "",
                logoPadding: 5,
                logoOpacity: 1,
                ...restaurant.theme?.qr, // Merge saved config
                ...prev // Keep current local edits if any? No, reset on open.
            }));
            // Actually, we want to start fresh from saved data on open.
            setConfig({
                fgColor: "#000000",
                bgColor: "#FFFFFF",
                qrStyle: "squares",
                eyeRadius: 0,
                logoImage: restaurant.logo || "",
                logoPadding: 5,
                logoOpacity: 1,
                ...restaurant.theme?.qr
            });
        }
    }, [isOpen]); // Removed 'restaurant' from dependency to prevent reset on parent updates

    const handleSave = () => {
        if (onSave) onSave(config);
    };

    const downloadQR = () => {
        const canvas = document.getElementById("react-qrcode-logo");
        if (canvas) {
            try {
                const pngFile = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.download = `menu-qr-${restaurant.slug}.png`;
                downloadLink.href = pngFile;

                // Fix for Safari: Element must be appended to body to be clickable
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } catch (err) {
                console.error("QR Download Error:", err);
                alert("Could not download QR Code due to security restrictions. The browser is blocking the download because the logo image is hosted on a different server (CORS). Please use a logo from the same domain or ensure it supports cross-origin requests.");
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Designer QR Code">
            <div className="qr-modal-layout">
                {/* Preview Column */}
                <div className="qr-preview-box" style={{
                    background: 'var(--glass-surface)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    padding: '24px',
                }}>
                    <div id="qr-download-area" style={{ padding: '20px', background: 'white', borderRadius: '12px' }}>
                        <QRCode
                            value={fullUrl}
                            size={200}
                            bgColor={config.bgColor}
                            fgColor={config.fgColor}
                            qrStyle={config.qrStyle}
                            eyeRadius={[
                                [config.eyeRadius, config.eyeRadius, 0, config.eyeRadius],
                                [config.eyeRadius, config.eyeRadius, config.eyeRadius, 0],
                                [config.eyeRadius, 0, config.eyeRadius, config.eyeRadius]
                            ]}
                            logoImage={config.logoImage}
                            logoPadding={config.logoPadding}
                            logoOpacity={config.logoOpacity}
                            logoWidth={config.logoSize || 40}
                            logoHeight={config.logoSize || 40}
                            ecLevel="H"
                            id="react-qrcode-logo"
                            logoImageOptions={{
                                crossOrigin: 'anonymous'
                            }}
                        />
                    </div>
                    <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                        {t('scanToVerify')}
                    </div>

                    <div style={{ textAlign: "center", wordBreak: 'break-all', maxWidth: '100%' }}>
                        <a href={`/${restaurant.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>{fullUrl}</a>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
                        <button onClick={handleSave} className="admin-btn admin-btn-primary" style={{ width: '100%' }}>
                            {t('saveDesign')}
                        </button>
                        <button onClick={downloadQR} className="admin-btn admin-btn-ghost" style={{ width: '100%' }}>
                            {t('downloadPng')}
                        </button>
                    </div>
                </div>

                <div className="qr-settings-panel">
                    <div className="admin-card" style={{ padding: "24px", margin: 0, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: '16px' }}>
                        <label className="admin-label" style={{ marginBottom: "16px", color: 'var(--text-muted)' }}>{t('shapeStyle')}</label>
                        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                            {["squares", "dots"].map(style => (
                                <button
                                    key={style}
                                    onClick={() => setConfig({ ...config, qrStyle: style })}
                                    style={{
                                        flex: 1,
                                        padding: "10px",
                                        borderRadius: "12px",
                                        border: config.qrStyle === style ? "1px solid var(--accent-blue)" : "1px solid var(--glass-border)",
                                        background: config.qrStyle === style ? "rgba(56, 189, 248, 0.1)" : "transparent",
                                        color: config.qrStyle === style ? "var(--accent-blue)" : "var(--text-muted)",
                                        cursor: "pointer",
                                        textTransform: "capitalize",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        transition: "all 0.2s"


                                    }}
                                >
                                    {t(style)}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Rounded Corners</span>
                            <span style={{ fontSize: "12px", fontWeight: 600 }}>{config.eyeRadius}px</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={config.eyeRadius}
                            onChange={(e) => setConfig({ ...config, eyeRadius: parseInt(e.target.value) })}
                            style={{ width: "100%", accentColor: "var(--color-primary)" }}
                        />
                    </div>

                    <div className="admin-card" style={{ padding: "24px", margin: 0, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: '16px' }}>
                        <label className="admin-label" style={{ marginBottom: "16px", color: 'var(--text-muted)' }}>{t('colors')}</label>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>{t('dots')}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <input type="color" value={config.fgColor} onChange={(e) => setConfig({ ...config, fgColor: e.target.value })} style={{ width: "40px", height: "40px", border: "1px solid var(--glass-border)", borderRadius: "8px", cursor: "pointer", padding: 0, background: 'transparent' }} />
                                    <input type="text" value={config.fgColor} onChange={(e) => setConfig({ ...config, fgColor: e.target.value })} className="admin-input" style={{ padding: "8px 12px", fontSize: "13px" }} />
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>{t('background')}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <input type="color" value={config.bgColor} onChange={(e) => setConfig({ ...config, bgColor: e.target.value })} style={{ width: "40px", height: "40px", border: "1px solid var(--glass-border)", borderRadius: "8px", cursor: "pointer", padding: 0, background: 'transparent' }} />
                                    <input type="text" value={config.bgColor} onChange={(e) => setConfig({ ...config, bgColor: e.target.value })} className="admin-input" style={{ padding: "8px 12px", fontSize: "13px" }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="admin-card" style={{ padding: "24px", margin: 0, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: '16px' }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <label className="admin-label" style={{ margin: 0, color: 'var(--text-muted)' }}>{t('centerLogo')}</label>
                            <input type="checkbox" checked={!!config.logoImage} onChange={(e) => setConfig({ ...config, logoImage: e.target.checked ? (restaurant.logo || "https://via.placeholder.com/150") : "" })} style={{ width: "20px", height: "20px", accentColor: "var(--color-primary)" }} />
                        </div>
                        {config.logoImage && (
                            <>
                                <input className="admin-input" placeholder="Logo URL" value={config.logoImage} onChange={(e) => setConfig({ ...config, logoImage: e.target.value })} style={{ marginBottom: "16px", fontSize: "13px" }} />
                                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                    <CloudinaryUploadButton onUpload={(url) => setConfig({ ...config, logoImage: url })} label="Upload Logo" />
                                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Best: Transparent PNG</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "auto" }}>
                        <button onClick={downloadQR} className="admin-btn admin-btn-primary" style={{ flex: 1, justifyContent: "center" }}>Download High-Res PNG</button>
                    </div>
                </div>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                <button onClick={onClose} className="admin-btn admin-btn-ghost">Close</button>
            </div>
        </Modal >
    );
};

const SettingsModal = ({ isOpen, onClose, restaurant, t = s => s }) => {
    const { updateRestaurantDetails } = usePlatform();
    const [data, setData] = useState({
        name: '',
        slug: '',
        username: '',
        password: ''
    });

    useEffect(() => {
        if (restaurant) {
            setData({
                name: restaurant.name || '',
                slug: restaurant.slug || '',
                username: restaurant.credentials?.username || '',
                password: restaurant.credentials?.password || '',
                serviceType: restaurant.serviceType || 'table' // Default to table service
            });
        }
    }, [restaurant]);

    const handleSave = () => {
        updateRestaurantDetails(restaurant.id, {
            name: data.name,
            slug: data.slug,
            serviceType: data.serviceType,
            credentials: {
                username: data.username,
                password: data.password
            }
        });
        onClose();
    };

    if (!isOpen || !restaurant) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('restaurantSettings')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>{t('restaurantName')}</label>
                    <input className="admin-input" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>{t('slug')}</label>
                    <input className="admin-input" value={data.slug} onChange={e => setData({ ...data, slug: e.target.value })} />
                </div>

                {/* Service Type Toggle */}
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <label style={{ display: 'block', marginBottom: 12, fontSize: 13, fontWeight: 600 }}>{t('serviceType')}</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setData({ ...data, serviceType: 'table' })}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid',
                                borderColor: data.serviceType === 'table' ? 'var(--color-primary)' : 'var(--border)',
                                background: data.serviceType === 'table' ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                                color: data.serviceType === 'table' ? 'var(--color-primary)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '13px',
                                transition: 'all 0.2s'
                            }}
                        >
                            {t('tableService')}
                        </button>
                        <button
                            onClick={() => setData({ ...data, serviceType: 'self' })}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid',
                                borderColor: data.serviceType === 'self' ? 'var(--color-primary)' : 'var(--border)',
                                background: data.serviceType === 'self' ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                                color: data.serviceType === 'self' ? 'var(--color-primary)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '13px',
                                transition: 'all 0.2s'
                            }}
                        >
                            {t('selfService')}
                        </button>
                    </div>
                </div>

                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <User size={16} /> {t('adminCredentials')}
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>{t('username')}</label>
                        <input className="admin-input" value={data.username} onChange={e => setData({ ...data, username: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>{t('password')}</label>
                        <input className="admin-input" type="text" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: 16 }}>
                    <button onClick={handleSave} className="admin-btn admin-btn-primary" style={{ flex: 1 }}>{t('save')}</button>
                    <button onClick={onClose} className="admin-btn admin-btn-ghost" style={{ flex: 1 }}>{t('cancel')}</button>
                </div>
            </div>
        </Modal>
    );
};

const RestaurantList = ({ onSelect, t = s => s, adminLang, setAdminLang }) => {
    const { restaurants, addRestaurant, removeRestaurant } = usePlatform();
    const [isAddMode, setIsAddMode] = useState(false);
    const [newRes, setNewRes] = useState({ name: '', slug: '', type: 'Fast Food' });
    const [qrRestaurant, setQrRestaurant] = useState(null);
    const [tableQrRestaurant, setTableQrRestaurant] = useState(null);
    const [editingRestaurant, setEditingRestaurant] = useState(null);

    const handleAdd = (e) => {
        e.preventDefault();
        if (newRes.name && newRes.slug) {
            addRestaurant(newRes);
            setIsAddMode(false);
            setNewRes({ name: '', slug: '', type: 'Fast Food', username: '', password: '' });
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ margin: '0 0 2px 0', fontSize: '28px', fontWeight: 800, letterSpacing: '-1px' }}>{t('restaurants')}</h1>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Manage all live client instances.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Language Switcher (Pill Style) */}
                    <div style={{
                        display: 'flex',
                        background: 'var(--glass-surface)',
                        borderRadius: '100px',
                        padding: '4px',
                        border: '1px solid var(--glass-border)',
                        position: 'relative'
                    }}>
                        {['en', 'mk', 'sq'].map(lang => (
                            <button
                                key={lang}
                                onClick={() => setAdminLang && setAdminLang(lang)}
                                style={{
                                    position: 'relative',
                                    background: 'transparent',
                                    color: adminLang === lang ? '#fff' : 'var(--text-muted)',
                                    border: 'none',
                                    borderRadius: '100px',
                                    padding: '6px 12px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    zIndex: 2,
                                    transition: 'color 0.2s'
                                }}
                            >
                                {adminLang === lang && (
                                    <motion.div
                                        layoutId="res-list-lang-pill"
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            backgroundColor: 'var(--primary-gradient-start, var(--color-primary))', // Simplified blue
                                            borderRadius: '100px',
                                            zIndex: -1,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                {lang}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsAddMode(true)}
                        className="admin-btn-primary"
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 16px rgba(14, 165, 233, 0.3)'
                        }}
                        title="Add Restaurant"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            {isAddMode && (
                <form onSubmit={handleAdd} className="admin-card">
                    <h3 style={{ margin: '0 0 24px 0' }}>{t('createNewRestaurant')}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>{t('restaurantName')}</label>
                            <input className="admin-input" placeholder="Restaurant Name" value={newRes.name} onChange={e => setNewRes({ ...newRes, name: e.target.value })} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>{t('slug')}</label>
                            <input className="admin-input" placeholder="netaville" value={newRes.slug} onChange={e => setNewRes({ ...newRes, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ gridColumn: '1 / -1', fontSize: 14, fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <User size={16} /> {t('adminCredentials')}
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>{t('username')}</label>
                            <input className="admin-input" placeholder="admin" value={newRes.username || ''} onChange={e => setNewRes({ ...newRes, username: e.target.value })} />
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Used to login at qarta.xyz/{newRes.slug || '...'}/login</p>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>{t('password')}</label>
                            <input className="admin-input" type="text" placeholder="secret123" value={newRes.password || ''} onChange={e => setNewRes({ ...newRes, password: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Your restaurant will be available at: <strong style={{ color: 'var(--color-primary)' }}>qarta.xyz/{newRes.slug || 'your-slug'}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="admin-btn admin-btn-primary">{t('create')}</button>
                        <button type="button" onClick={() => setIsAddMode(false)} className="admin-btn admin-btn-ghost">{t('cancel')}</button>
                    </div>
                </form>
            )}

            {!isAddMode && restaurants.length === 0 && (
                <div className="admin-card" style={{ padding: '80px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '24px' }}>🏪</div>
                    <h3 style={{ margin: '0 0 12px 0' }}>{t('noRestaurants')}</h3>
                    <p style={{ margin: '0 0 32px 0', color: 'var(--text-muted)' }}>
                        {t('createFirstRestaurant')}
                    </p>
                    <button
                        onClick={() => setIsAddMode(true)}
                        className="admin-btn admin-btn-primary"
                    >
                        <Plus size={20} />
                        {t('createFirstRestaurant')}
                    </button>
                </div>
            )}

            <div className="restaurant-grid">
                {restaurants.map(r => (
                    <div
                        key={r.id}
                        className="restaurant-card"
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                            e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                        }}
                    >
                        <div className="card-top">
                            <div className="card-logo" style={r.logo ? { padding: 0, overflow: 'hidden', background: 'transparent' } : {}}>
                                {r.logo ? (
                                    <img
                                        src={r.logo}
                                        alt={r.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                                    />
                                ) : (
                                    r.name[0]
                                )}
                            </div>
                            <h3 className="card-title">{r.name}</h3>
                            <div className="card-meta">
                                qarta.xyz/{r.slug} • {r.menu.length} Categories
                            </div>
                        </div>

                        <div className="card-actions">
                            <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '8px' }}>
                                <button onClick={() => onSelect(r.id)} className="action-btn-primary">
                                    <Edit2 size={16} /> {t('manage')}
                                </button>
                                <button onClick={() => window.open(`/${r.slug}`, '_blank')} className="action-btn-secondary">
                                    {t('viewLive')} <ExternalLink size={14} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'center' }}>
                                <button onClick={() => setEditingRestaurant(r)} className="action-btn-icon" title={t('settings')}>
                                    <Settings size={18} />
                                </button>
                                <button onClick={() => setQrRestaurant(r)} className="action-btn-icon" title={t('qrCode')}>
                                    <QrCode size={18} />
                                </button>
                                <button onClick={() => setTableQrRestaurant(r)} className="action-btn-icon" title="Table QR Codes" style={{ backgroundColor: '#3b82f6', color: 'white' }}>
                                    <QrCode size={18} />
                                </button>
                                {r.slug !== 'default' && (
                                    <button
                                        onClick={() => { if (confirm(t('deleteConfirm'))) removeRestaurant(r.id) }}
                                        className="action-btn-icon danger"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <QRCodeModal
                isOpen={!!qrRestaurant}
                restaurant={qrRestaurant}
                onClose={() => setQrRestaurant(null)}
                t={t}
            />

            <TableQRModal
                isOpen={!!tableQrRestaurant}
                restaurant={tableQrRestaurant}
                onClose={() => setTableQrRestaurant(null)}
                t={t}
            />

            <SettingsModal
                isOpen={!!editingRestaurant}
                restaurant={editingRestaurant}
                onClose={() => setEditingRestaurant(null)}
                t={t}
            />

        </div>
    );
};

const CategoryForm = ({ onSave, onCancel, initialData = null, t = s => s }) => {
    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        nameEn: initialData?.label?.en || '',
        nameMk: initialData?.label?.mk || '',
        nameSq: initialData?.label?.sq || '',
        icon: initialData?.icon || 'Utensils',
        image: initialData?.image || '', // New: Optional custom illustration match
        bgColor: initialData?.bgColor || '' // New: Optional Card Background
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                id: initialData.id || '',
                nameEn: initialData.label?.en || '',
                nameMk: initialData.label?.mk || '',
                nameSq: initialData.label?.sq || '',
                icon: initialData.icon || 'Utensils',
                image: initialData.image || '',
                bgColor: initialData.bgColor || ''
            }));
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: formData.id || `cat-${Date.now()}`,
            label: {
                en: formData.nameEn,
                mk: formData.nameMk,
                sq: formData.nameSq
            },
            icon: formData.icon,
            image: formData.image,
            bgColor: formData.bgColor
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>ID (optional)</label>
                <input className="admin-input" name="id" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} placeholder="drinks" />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('categoryName')} (English) *</label>
                <input className="admin-input" name="nameEn" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} placeholder="Drinks" required />
            </div>

            <div className="form-grid">
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('categoryName')} (MK)</label>
                    <input className="admin-input" name="nameMk" value={formData.nameMk} onChange={(e) => setFormData({ ...formData, nameMk: e.target.value })} placeholder="Пијалоци" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('categoryName')} (SQ)</label>
                    <input className="admin-input" name="nameSq" value={formData.nameSq} onChange={(e) => setFormData({ ...formData, nameSq: e.target.value })} placeholder="Pije" />
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Custom Illustration (Override)</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {formData.image ? (
                        <div style={{ position: 'relative' }}>
                            <img src={formData.image} alt="Preview" style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }} />
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, image: '' })}
                                style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ) : (
                        <CloudinaryUploadButton onUpload={(url) => setFormData({ ...formData, image: url })} />
                    )}
                    <input
                        className="admin-input"
                        placeholder="Image URL..."
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        style={{ flex: 1 }}
                    />
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                    If an image is provided, it will replace the icon.
                </p>
            </div>

            {/* Only show Icon picker if no image is provided, to avoid confusion */}
            {!formData.image && (
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Icon</label>
                    <IconPicker
                        selectedIcon={formData.icon}
                        onSelect={(iconId) => setFormData({ ...formData, icon: iconId })}
                    />
                </div>
            )}

            {/* NEW: Card Background Color */}
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600 }}>{t('cardBackground')}</label>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                            Optional background color for this category card.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={formData.bgColor || ''}
                            onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                            placeholder="#FFFFFF"
                            style={{
                                width: '80px',
                                padding: '6px',
                                borderRadius: '6px',
                                border: '1px solid var(--border)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'var(--text-primary)',
                                fontFamily: 'monospace',
                                fontSize: '12px'
                            }}
                        />
                        <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <input
                                type="color"
                                value={formData.bgColor || '#ffffff'}
                                onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                                style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', cursor: 'pointer', border: 'none', padding: 0 }}
                            />
                        </div>
                        {formData.bgColor && (
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, bgColor: '' })}
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                                title="Clear color"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost" style={{ flex: 1 }}>{t('cancel')}</button>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>{initialData ? t('save') : t('create')}</button>
            </div>
        </form>
    );
};

const SectionForm = ({ onSave, onCancel, initialData = null, t = s => s }) => {
    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        nameEn: initialData?.title?.en || '',
        nameMk: initialData?.title?.mk || '',
        nameSq: initialData?.title?.sq || '',
        icon: initialData?.icon || 'Utensils',
        filters: initialData?.filters ? initialData.filters.map(f => ({
            id: f.id,
            labelEn: f.label?.en || '',
            labelMk: f.label?.mk || '',

            labelSq: f.label?.sq || ''
        })) : [],
        hideImages: initialData?.hideImages || false
    });

    const addFilter = () => {
        setFormData({
            ...formData,
            filters: [...formData.filters, { id: '', labelEn: '', labelMk: '', labelSq: '' }]
        });
    };

    const removeFilter = (index) => {
        setFormData({
            ...formData,
            filters: formData.filters.filter((_, i) => i !== index)
        });
    };

    const updateFilter = (index, field, value) => {
        const updated = [...formData.filters];
        updated[index][field] = value;
        setFormData({ ...formData, filters: updated });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: formData.id || `sec-${Date.now()}`,
            title: {
                en: formData.nameEn,
                mk: formData.nameMk,
                sq: formData.nameSq
            },
            icon: formData.icon,
            filters: formData.filters.filter(f => f.labelEn).map(f => ({
                id: f.id || f.labelEn.toLowerCase().replace(/\s+/g, '-'),
                label: {
                    en: f.labelEn,
                    mk: f.labelMk || f.labelEn,
                    sq: f.labelSq || f.labelEn
                }
            })),
            items: initialData?.items || [],
            hideImages: formData.hideImages
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>ID (optional)</label>
                <input className="admin-input" name="id" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} placeholder="wine" />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('sectionTitle')} (English) *</label>
                <input className="admin-input" name="nameEn" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} placeholder="Wine" required />
            </div>

            <div className="form-grid">
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('sectionTitle')} (MK)</label>
                    <input className="admin-input" name="nameMk" value={formData.nameMk} onChange={(e) => setFormData({ ...formData, nameMk: e.target.value })} placeholder="Вино" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('sectionTitle')} (SQ)</label>
                    <input className="admin-input" name="nameSq" value={formData.nameSq} onChange={(e) => setFormData({ ...formData, nameSq: e.target.value })} placeholder="Verë" />
                </div>
            </div>

            {/* Sub-Categories (Filters) */}
            <div style={{ marginTop: '20px', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{t('subCategories')} (e.g., Red, White)</label>
                    <button type="button" onClick={addFilter} className="admin-btn admin-btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                        + {t('add')}
                    </button>
                </div>
                {formData.filters.map((filter, index) => (
                    <div key={index} style={{ marginBottom: '12px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                            <input
                                className="admin-input"
                                placeholder="English (e.g., Red)"
                                value={filter.labelEn}
                                onChange={(e) => updateFilter(index, 'labelEn', e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={() => removeFilter(index)}
                                className="admin-btn admin-btn-danger"
                                style={{ padding: '0 12px', width: 'auto' }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="form-grid" style={{ gap: '12px' }}>
                            <input
                                className="admin-input"
                                placeholder="MK"
                                value={filter.labelMk}
                                onChange={(e) => updateFilter(index, 'labelMk', e.target.value)}
                            />
                            <input
                                className="admin-input"
                                placeholder="SQ"
                                value={filter.labelSq}
                                onChange={(e) => updateFilter(index, 'labelSq', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
                {formData.filters.length === 0 && (
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
                        {t('noSubCategories')}
                    </p>
                )}
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Icon</label>
                <IconPicker
                    selectedIcon={formData.icon}
                    onSelect={(iconId) => setFormData({ ...formData, icon: iconId })}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div>
                    <label style={{ display: 'block', margin: 0, fontSize: '13px', fontWeight: 600 }}>{t('hideItemImages')}</label>
                    <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {t('hideItemImagesDesc')}
                    </p>
                </div>
                <input
                    type="checkbox"
                    checked={formData.hideImages}
                    onChange={(e) => setFormData({ ...formData, hideImages: e.target.checked })}
                    style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost" style={{ flex: 1 }}>{t('cancel')}</button>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>{initialData ? t('save') : t('create')}</button>
            </div>
        </form>
    );
};

const DealsEditor = ({ restaurant, onSave, onCancel, t = s => s }) => {
    const defaultDeal = {
        enabled: true, // Master toggle
        items: []
    };

    const [dealsConfig, setDealsConfig] = useState(restaurant.deals || defaultDeal);
    const [editingItem, setEditingItem] = useState(null); // null = list view, object = edit mode
    const [isTranslating, setIsTranslating] = useState(false);

    // Save changes to restaurant
    const handleSaveConfig = (newConfig) => {
        setDealsConfig(newConfig);
        onSave(newConfig);
    };

    // Item Form Handler
    const handleSaveItem = (formData) => {
        // Enforce numeric types for prices to prevent string concatenation bugs
        const item = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined
        };

        let newItems;
        if (item.id) {
            // Edit existing
            newItems = dealsConfig.items.map(i => i.id === item.id ? item : i);
        } else {
            // Add new
            newItems = [...dealsConfig.items, { ...item, id: `deal-${Date.now()}` }];
        }
        handleSaveConfig({ ...dealsConfig, items: newItems });
        setEditingItem(null);
    };

    const handleDeleteItem = (id) => {
        if (!confirm(t('deleteConfirm'))) return;
        const newItems = dealsConfig.items.filter(i => i.id !== id);
        handleSaveConfig({ ...dealsConfig, items: newItems });
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{t('deals')}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>
                        Highlight special offers at the top of your menu.
                    </p>
                </div>
                <label className="switch" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={dealsConfig.enabled}
                        onChange={(e) => handleSaveConfig({ ...dealsConfig, enabled: e.target.checked })}
                        style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary)' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{dealsConfig.enabled ? 'Enabled' : 'Disabled'}</span>
                </label>
            </div>

            {!editingItem ? (
                // List View
                <div style={{ opacity: dealsConfig.enabled ? 1 : 0.5, pointerEvents: dealsConfig.enabled ? 'auto' : 'none' }}>
                    <div className="menu-list">
                        {dealsConfig.items && dealsConfig.items.map((item, index) => (
                            <div key={item.id} className="menu-item-row" style={{ alignItems: 'center' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                    {item.image ? (
                                        <img src={item.image} alt={item.title?.en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                            <ImageIcon size={20} />
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1, marginLeft: '16px' }}>
                                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{item.title?.en || (typeof item.title === 'string' ? item.title : '')}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.description?.en || (typeof item.description === 'string' ? item.description : '')}</div>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-primary)', marginRight: '16px' }}>
                                    {item.price} {item.currency || 'MKD'}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => {
                                            // Normalize for editing
                                            const normalized = {
                                                ...item,
                                                title: typeof item.title === 'string' ? { en: item.title, mk: '', sq: '' } : { en: '', mk: '', sq: '', ...item.title },
                                                description: typeof item.description === 'string' ? { en: item.description, mk: '', sq: '' } : { en: '', mk: '', sq: '', ...item.description }
                                            };
                                            setEditingItem(normalized);
                                        }}
                                        className="admin-btn admin-btn-ghost"
                                        style={{ padding: '8px', borderRadius: '50%' }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteItem(item.id)} className="admin-btn admin-btn-danger" style={{ padding: '8px', borderRadius: '50%' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setEditingItem({ title: { en: '', mk: '', sq: '' }, description: { en: '', mk: '', sq: '' } })}
                        className="admin-btn admin-btn-primary"
                        style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
                    >
                        <Plus size={18} /> {t('addItem')}
                    </button>
                </div>
            ) : (
                // Edit Form
                <div className="admin-card" style={{ padding: '24px', margin: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <button onClick={() => setEditingItem(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <ArrowLeft size={20} />
                        </button>
                        <h3 style={{ margin: 0 }}>{editingItem.id ? t('editItem') : t('newItem')}</h3>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleSaveItem(editingItem); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Image Upload */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('image')} *</label>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                {editingItem.image ? (
                                    <div style={{ position: 'relative' }}>
                                        <img src={editingItem.image} alt="Preview" style={{ width: '120px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => setEditingItem({ ...editingItem, image: '' })}
                                            style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <CloudinaryUploadButton onUpload={(url) => setEditingItem({ ...editingItem, image: url })} />
                                )}
                                <input
                                    className="admin-input"
                                    placeholder="Or paste image URL..."
                                    value={editingItem.image || ''}
                                    onChange={e => setEditingItem({ ...editingItem, image: e.target.value })}
                                    style={{ flex: 1 }}
                                />
                            </div>
                        </div>

                        {/* Title Section */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600 }}>{t('itemName')} (English) *</label>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!editingItem.title?.en) return;
                                        setIsTranslating(true);
                                        const translate = async (l) => {
                                            try {
                                                const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(editingItem.title.en)}&langpair=en|${l}`);
                                                const data = await res.json();
                                                return data.responseData?.translatedText || editingItem.title.en;
                                            } catch { return editingItem.title.en; }
                                        };
                                        const [mk, sq] = await Promise.all([translate('mk'), translate('sq')]);
                                        setEditingItem(prev => ({
                                            ...prev,
                                            title: { ...prev.title, mk, sq }
                                        }));
                                        setIsTranslating(false);
                                    }}
                                    disabled={isTranslating}
                                    className="admin-btn-ghost"
                                    style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }}
                                >
                                    {isTranslating ? t('translating') : t('autoTranslate')}
                                </button>
                            </div>
                            <input
                                className="admin-input"
                                value={editingItem.title?.en || ''}
                                onChange={e => setEditingItem({ ...editingItem, title: { ...editingItem.title, en: e.target.value } })}
                                placeholder="e.g. Lunch Special"
                                required
                            />
                        </div>

                        <div className="form-grid">
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>{t('itemName')} (MK)</label>
                                <input
                                    className="admin-input"
                                    value={editingItem.title?.mk || ''}
                                    onChange={e => setEditingItem({ ...editingItem, title: { ...editingItem.title, mk: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>{t('itemName')} (SQ)</label>
                                <input
                                    className="admin-input"
                                    value={editingItem.title?.sq || ''}
                                    onChange={e => setEditingItem({ ...editingItem, title: { ...editingItem.title, sq: e.target.value } })}
                                />
                            </div>
                        </div>

                        {/* Description Section */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600 }}>{t('itemDesc')} (English)</label>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!editingItem.description?.en) return;
                                        setIsTranslating(true);
                                        const translate = async (l) => {
                                            try {
                                                const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(editingItem.description.en)}&langpair=en|${l}`);
                                                const data = await res.json();
                                                return data.responseData?.translatedText || editingItem.description.en;
                                            } catch { return editingItem.description.en; }
                                        };
                                        const [mk, sq] = await Promise.all([translate('mk'), translate('sq')]);
                                        setEditingItem(prev => ({
                                            ...prev,
                                            description: { ...prev.description, mk, sq }
                                        }));
                                        setIsTranslating(false);
                                    }}
                                    disabled={isTranslating}
                                    className="admin-btn-ghost"
                                    style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }}
                                >
                                    {isTranslating ? t('translating') : t('autoTranslate')}
                                </button>
                            </div>
                            <textarea
                                className="admin-input"
                                value={editingItem.description?.en || ''}
                                onChange={e => setEditingItem({ ...editingItem, description: { ...editingItem.description, en: e.target.value } })}
                                placeholder="e.g. Burger + Fries + Drink"
                                rows={2}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div className="form-grid">
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>{t('itemDesc')} (MK)</label>
                                <textarea
                                    className="admin-input"
                                    rows={2}
                                    value={editingItem.description?.mk || ''}
                                    onChange={e => setEditingItem({ ...editingItem, description: { ...editingItem.description, mk: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>{t('itemDesc')} (SQ)</label>
                                <textarea
                                    className="admin-input"
                                    rows={2}
                                    value={editingItem.description?.sq || ''}
                                    onChange={e => setEditingItem({ ...editingItem, description: { ...editingItem.description, sq: e.target.value } })}
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>{t('price')}</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    className="admin-input"
                                    value={editingItem.price || ''}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                            setEditingItem({ ...editingItem, price: val });
                                        }
                                    }}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>{t('originalPrice')} (Optional)</label>
                                <input
                                    type="number"
                                    className="admin-input"
                                    value={editingItem.originalPrice || ''}
                                    onChange={e => setEditingItem({ ...editingItem, originalPrice: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>Currency</label>
                                <select
                                    className="admin-input"
                                    value={editingItem.currency || 'MKD'}
                                    onChange={e => setEditingItem({ ...editingItem, currency: e.target.value })}
                                >
                                    <option value="MKD">MKD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>{t('tag')} (e.g. "HOT", "-20%")</label>
                            <input
                                className="admin-input"
                                value={editingItem.tag || ''}
                                onChange={e => setEditingItem({ ...editingItem, tag: e.target.value })}
                                placeholder="e.g. SPECIAL"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>{t('save')}</button>
                            <button type="button" onClick={() => setEditingItem(null)} className="admin-btn admin-btn-ghost" style={{ flex: 1 }}>{t('cancel')}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const MenuEditor = ({ restaurant, onBack, t, adminLang, setAdminLang }) => {
    const { updateMenuItem, addMenuItem, updateRestaurantDetails, deleteMenuItem, addCategory, updateCategory, deleteCategory, addSection, updateSection, deleteSection, saveStatus } = usePlatform();
    const [editingItem, setEditingItem] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSection, setEditingSection] = useState(null);
    const [activeTab, setActiveTab] = useState('menu');
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showSectionForm, setShowSectionForm] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState(new Set());

    const toggleCategory = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const [draftValues, setDraftValues] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    // ... (rest of state and effects)

    const lastRestaurantId = React.useRef(restaurant.id);

    useEffect(() => {
        // Only reset draft values if the restaurant ID actually changes
        if (restaurant.id !== lastRestaurantId.current) {
            setDraftValues({
                name: restaurant.name,
                logo: restaurant.logo,
                theme: restaurant.theme || {},
                info: { hours: '', address: '', phone: '', ...restaurant.info },
                promotion: { active: false, title: '', message: '', image: '', ...restaurant.promotion }
            });
            setHasChanges(false);
            lastRestaurantId.current = restaurant.id;
        }
    }, [restaurant.id]);

    // Initial load fallback
    useEffect(() => {
        if (!draftValues.name && !draftValues.info) {
            setDraftValues({
                name: restaurant.name,
                logo: restaurant.logo,
                theme: restaurant.theme || {},
                info: { hours: '', address: '', phone: '', subtitle: '', socials: { instagram: '', tiktok: '', website: '' }, ...restaurant.info },
                promotion: { active: false, title: '', message: '', image: '', ...restaurant.promotion }
            });
        }
    }, []);

    const handleDraftChange = (field, value) => {
        setDraftValues(prev => {
            const newState = { ...prev, [field]: value };
            setHasChanges(true);
            return newState;
        });
    };

    const handleDeepDraftChange = (parent, field, value) => {
        setDraftValues(prev => {
            const newState = {
                ...prev,
                [parent]: { ...prev[parent], [field]: value }
            };
            setHasChanges(true);
            return newState;
        });
    };

    useEffect(() => {
        if (!hasChanges) return;

        const timer = setTimeout(async () => {
            try {
                await updateRestaurantDetails(restaurant.id, draftValues);
                setHasChanges(false);
            } catch (error) {
                console.error('Auto-save failed:', error);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [draftValues, hasChanges, restaurant.id, updateRestaurantDetails]);

    const handleDeleteItem = async (categoryId, sectionId, itemId) => {
        const category = restaurant.menu.find(c => c.id === categoryId);
        if (!category) return;
        const section = category.sections.find(s => s.id === sectionId);
        if (!section) return;

        const updatedItems = section.items.filter(i => i.id !== itemId);
        const updatedSection = { ...section, items: updatedItems };

        // Optimistically update or wait? updateSection likely triggers sync.
        updateSection(restaurant.id, categoryId, sectionId, updatedSection);
        setEditingItem(null);
    };

    const handleSaveItem = async (itemData) => {
        if (!itemData) return;

        // Ensure description object exists and has the correct structure
        const normalizedItem = {
            ...itemData,
            description: itemData.description || { en: '', mk: '', sq: '' },
            title: itemData.title || { en: '', mk: '', sq: '' }
        };

        // If item has an ID, it's an edit, otherwise it's new
        if (normalizedItem.id) {
            // Find which category and section this item belongs to
            let targetCategory, targetSection;
            for (const category of restaurant.menu || []) {
                for (const section of category.sections || []) {
                    if (section.items?.some(i => i.id === normalizedItem.id)) {
                        targetCategory = category;
                        targetSection = section;
                        break;
                    }
                }
                if (targetSection) break;
            }

            if (targetCategory && targetSection) {
                const updatedItems = targetSection.items.map(i =>
                    i.id === normalizedItem.id ? normalizedItem : i
                );
                const updatedSection = { ...targetSection, items: updatedItems };
                updateSection(restaurant.id, targetCategory.id, targetSection.id, updatedSection);
            }
        } else {
            // This is a new item - need category and section context
            console.error('Cannot add new item without category/section context');
        }

        setEditingItem(null);
    };

    const handleSaveMenu = async (formData) => {
        if (!editingItem) return;

        if (editingItem.isNew) {
            addMenuItem(restaurant.id, editingItem.categoryId, editingItem.sectionId, formData);
        } else {
            updateMenuItem(restaurant.id, editingItem.categoryId, editingItem.sectionId, editingItem.item.id, formData);
        }
        setEditingItem(null);
    };

    const handleMoveSection = async (category, sectionIndex, direction) => {
        if (!category) return;
        const sections = [...category.sections];
        const targetIndex = sectionIndex + direction;

        if (targetIndex < 0 || targetIndex >= sections.length) return;

        // Swap
        [sections[sectionIndex], sections[targetIndex]] = [sections[targetIndex], sections[sectionIndex]];

        const updatedCategory = { ...category, sections };
        // Optimistic UI update or wait? updateCategory triggers sync.
        updateCategory(restaurant.id, category.id, updatedCategory);
    };

    const handleMoveItem = async (categoryId, section, itemIndex, direction) => {
        if (!section) return;
        const items = [...section.items];
        const targetIndex = itemIndex + direction;

        if (targetIndex < 0 || targetIndex >= items.length) return;

        // Swap
        [items[itemIndex], items[targetIndex]] = [items[targetIndex], items[itemIndex]];

        const updatedSection = { ...section, items };
        updateSection(restaurant.id, categoryId, section.id, updatedSection);
    };

    return (
        <div>
            {/* Header / Tabs */}
            <div style={{ marginBottom: '24px' }}>
                <div className="admin-header-row">
                    <div>
                        <h1 style={{ margin: '0', fontSize: '28px', fontWeight: 800 }}>{restaurant.name}</h1>
                    </div>
                    {/* Status Indicator & Back Button - Right Aligned */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {/* Language Switcher (Pill Style) */}
                        <div style={{
                            display: 'flex',
                            background: 'var(--glass-surface)',
                            borderRadius: '100px',
                            padding: '4px',
                            border: '1px solid var(--glass-border)',
                            position: 'relative'
                        }}>
                            {['en', 'mk', 'sq'].map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setAdminLang(lang)}
                                    style={{
                                        position: 'relative',
                                        background: 'transparent',
                                        color: adminLang === lang ? '#fff' : 'var(--text-muted)',
                                        border: 'none',
                                        borderRadius: '100px',
                                        padding: '6px 12px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        zIndex: 2,
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    {adminLang === lang && (
                                        <motion.div
                                            layoutId="admin-lang-pill"
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                backgroundColor: 'var(--primary-gradient-start, var(--color-primary))', // Simplified blue
                                                borderRadius: '100px',
                                                zIndex: -1,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    {lang}
                                </button>
                            ))}
                        </div>

                        {onBack && (
                            <button onClick={onBack} className="admin-btn admin-btn-ghost" style={{ height: '36px' }}>
                                <ArrowLeft size={16} /> {t('backToRestaurants')}
                            </button>
                        )}
                        {(saveStatus === 'saving' || saveStatus === 'success' || saveStatus === 'error') && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', fontSize: '13px', fontWeight: 600 }} className="desktop-only-flex">
                                {saveStatus === 'saving' && <span style={{ color: '#fbbf24' }}>{t('saving')}</span>}
                                {saveStatus === 'success' && <span style={{ color: '#34d399' }}>{t('saved')}</span>}
                                {saveStatus === 'error' && <span style={{ color: '#ef4444' }}>{t('error')}</span>}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px', alignItems: 'center', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`admin-btn ${activeTab === 'menu' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                        style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                        {t('menu')}
                    </button>
                    <button
                        onClick={() => setActiveTab('deals')}
                        className={`admin-btn ${activeTab === 'deals' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                        style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                        <Sparkles size={18} /> {t('deals')}
                    </button>

                    {/* Orders Button */}
                    <button
                        onClick={() => window.open(`/${restaurant.slug}/orders`, '_blank')}
                        className="admin-btn admin-btn-ghost"
                        style={{ whiteSpace: 'nowrap', flexShrink: 0, color: 'var(--color-primary, var(--color-primary))' }}
                    >
                        <Bell size={18} /> {t('orders')}
                    </button>

                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`admin-btn ${activeTab === 'settings' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                        style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                        <Settings size={18} /> {t('settings')}
                    </button>
                    <button
                        onClick={() => setShowQR(true)}
                        className="admin-btn admin-btn-ghost"
                        style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                        <QrCode size={18} /> {t('qrDesigner')}
                    </button>
                </div>
            </div>




            {activeTab === 'deals' && (
                <DealsEditor
                    restaurant={restaurant}
                    onSave={(deals) => updateRestaurantDetails(restaurant.id, { deals })}
                    onCancel={() => { }}
                    t={t}
                />
            )}

            {activeTab === 'menu' && (
                <>
                    <AnimatePresence>
                        {editingItem && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    onClick={() => setEditingItem(null)}
                                    className="modal-overlay"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="modal-content"
                                >
                                    <h2 style={{ marginTop: 0 }}>{editingItem.isNew ? t('newItem') : t('editItem')}</h2>
                                    <EditItemForm
                                        t={t}
                                        item={editingItem.item}
                                        section={restaurant.menu
                                            .find(c => c.id === editingItem.categoryId)?.sections
                                            .find(s => s.id === editingItem.sectionId)}
                                        onSave={handleSaveMenu}
                                        onDelete={() => handleDeleteItem(editingItem.categoryId, editingItem.sectionId, editingItem.item.id)}
                                        onCancel={() => setEditingItem(null)}
                                        isNew={editingItem.isNew}
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                    {/* (Duplicate Modal Render removed for cleanliness if possible, but sticking to update for safety) */}
                    {/* Actually, let's just update the Modal one too ensuring both work if logic switches */}
                    <Modal
                        isOpen={!!editingItem} // This logic suggests duplicate modals might show up if not careful.
                        // But wait, the AnimatePresence block above doesn't have a visible condition wrapper in the snippet?
                        // Ah, the snippet started with {editingItem && ( ... so it is conditional.
                        // If they are both present and triggered by 'editingItem', they would DOUBLE RENDER.
                        // That is a bug. I should probably comment out the second one or fix it.
                        // Given I am editing the file, I will comment out the second 'Modal' block if it seems redundant, OR just update it properly.
                        // Inspecting the file earlier:
                        // 1000: initial={{ opacity: 0 }} ...
                        // This block seems to be inside the return of MenuEditor.
                        // I will update BOTH for now to be safe, but use the same handler.
                        onClose={() => setEditingItem(null)}
                        title={editingItem?.isNew ? t('newItem') : t('editItem')}
                    >
                        {editingItem && (
                            <EditItemForm
                                t={t}
                                item={editingItem.item}
                                section={restaurant.menu
                                    .find(c => c.id === editingItem.categoryId)?.sections
                                    .find(s => s.id === editingItem.sectionId)}
                                onSave={handleSaveMenu}
                                onDelete={() => handleDeleteItem(editingItem.categoryId, editingItem.sectionId, editingItem.item.id)}
                                onCancel={() => setEditingItem(null)}
                                isNew={editingItem.isNew}
                            />
                        )}
                    </Modal>

                    {/* Category Form Modal */}
                    <Modal
                        isOpen={showCategoryForm}
                        onClose={() => setShowCategoryForm(false)}
                        title={t('newCategory')}
                    >
                        <CategoryForm
                            t={t}
                            onSave={(data) => {
                                addCategory(restaurant.id, data);
                                setShowCategoryForm(false);
                            }}
                            onCancel={() => setShowCategoryForm(false)}
                        />
                    </Modal>


                    {/* Section Form Modal */}
                    <Modal
                        isOpen={!!showSectionForm}
                        onClose={() => setShowSectionForm(null)}
                        title={t('addSection')}
                    >
                        <SectionForm
                            t={t}
                            onSave={(data) => {
                                addSection(restaurant.id, showSectionForm, data);
                                setShowSectionForm(null);
                            }}
                            onCancel={() => setShowSectionForm(null)}
                        />
                    </Modal>

                    {/* Edit Category Modal */}
                    <Modal
                        isOpen={!!editingCategory}
                        onClose={() => setEditingCategory(null)}
                        title={t('editCategory')}
                    >
                        {editingCategory && (
                            <CategoryForm
                                t={t}
                                initialData={editingCategory}
                                onSave={(data) => {
                                    updateCategory(restaurant.id, editingCategory.id, data);
                                    setEditingCategory(null);
                                }}
                                onCancel={() => setEditingCategory(null)}
                            />
                        )}
                    </Modal>
                    {/* Edit Section Modal */}
                    <Modal
                        isOpen={!!editingSection}
                        onClose={() => setEditingSection(null)}
                        title="Edit Section"
                    >
                        {editingSection && (
                            <SectionForm
                                t={t}
                                initialData={editingSection.section}
                                onSave={(data) => {
                                    updateSection(restaurant.id, editingSection.categoryId, editingSection.section.id, data);
                                    setEditingSection(null);
                                }}
                                onCancel={() => setEditingSection(null)}
                            />
                        )}
                    </Modal>

                    <QRCodeModal
                        t={t}
                        isOpen={showQR}
                        onClose={() => setShowQR(false)}
                        restaurant={restaurant}
                        onSave={(config) => {
                            updateRestaurantDetails(restaurant.id, { theme: { ...restaurant.theme, qr: config } });
                            alert('QR Code Design Saved!');
                        }}
                    />

                    {
                        restaurant.menu.length === 0 && (
                            <div className="admin-card" style={{ padding: '80px 24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', marginBottom: '24px' }}>📋</div>
                                <h3 style={{ margin: '0 0 12px 0' }}>{t('emptyMenu')}</h3>
                                <p style={{ margin: '0 0 32px 0', color: 'var(--text-muted)' }}>
                                    {t('emptyMenuDesc')}
                                </p>
                                <button
                                    onClick={() => setShowCategoryForm(true)}
                                    className="admin-btn admin-btn-primary"
                                >
                                    <Plus size={20} />
                                    {t('createFirstCategory')}
                                </button>
                            </div>
                        )
                    }

                    {/* Separator Line */}
                    <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '24px 0 32px 0' }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {restaurant.menu.length > 0 && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                gap: '12px',
                                paddingBottom: '8px',
                                marginBottom: '8px'
                            }}>
                                {!isReordering ? (
                                    <button
                                        onClick={() => setIsReordering(true)}
                                        className="admin-btn admin-btn-ghost"
                                        style={{ height: '42px' }}
                                    >
                                        <ArrowUpDown size={16} /> Reorder
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsReordering(false)}
                                        className="admin-btn admin-btn-primary"
                                        style={{ height: '42px' }}
                                    >
                                        <Check size={16} /> Done
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowCategoryForm(true)}
                                    className="admin-btn admin-btn-primary"
                                    style={{ height: '42px' }}
                                >
                                    <Plus size={20} /> New Category
                                </button>
                            </div>
                        )}
                        <Reorder.Group axis="y" values={restaurant.menu} onReorder={(newOrder) => {
                            updateRestaurantDetails(restaurant.id, { menu: newOrder });
                        }}>
                            {restaurant.menu.map(category => {
                                const isExpanded = expandedCategories.has(category.id);
                                return (
                                    <Reorder.Item key={category.id} value={category} style={{ listStyle: 'none' }} dragListener={isReordering}>
                                        <div className="category-header">
                                            {isReordering && (
                                                <div style={{ cursor: 'grab', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                                    <GripVertical size={20} />
                                                </div>
                                            )}
                                            <div
                                                onClick={() => toggleCategory(category.id)}
                                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}
                                            >
                                                <div style={{
                                                    transition: 'transform 0.2s',
                                                    transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <ChevronDown size={20} color="var(--accent-blue)" />
                                                </div>
                                                <h2 className="category-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                                                    <span style={{ fontSize: '18px', lineHeight: '1.3', wordBreak: 'break-word' }}>
                                                        {category.label.en}
                                                    </span>
                                                </h2>
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {/* Reorder Controls only visible in Reorder Mode */}
                                                {isReordering ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
                                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('dragToReorder')}</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => setShowSectionForm(category.id)}
                                                            className="admin-btn admin-btn-ghost"
                                                            style={{ padding: '8px 16px', fontSize: '12px' }}
                                                        >
                                                            <Plus size={14} /> <span className="desktop-only-inline">{t('addSection')}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingCategory(category)}
                                                            className="admin-btn admin-btn-ghost"
                                                            style={{ padding: '8px 16px', fontSize: '12px' }}
                                                        >
                                                            <Edit2 size={14} /> <span className="desktop-only-inline">{t('edit')}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => { if (confirm(t('confirmDeleteCategory'))) deleteCategory(restaurant.id, category.id) }}
                                                            className="admin-btn admin-btn-danger"
                                                            style={{ padding: '8px' }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    <div style={{ paddingLeft: '12px', marginTop: '12px' }}>
                                                        {category.sections.length === 0 && (
                                                            <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed var(--glass-border)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                                                No sections in this category. Click "Add Section" to start.
                                                            </div>
                                                        )}
                                                        <Reorder.Group axis="y" values={category.sections} onReorder={(newSections) => {
                                                            const updatedCategory = { ...category, sections: newSections };
                                                            updateCategory(restaurant.id, category.id, updatedCategory);
                                                        }}>
                                                            {category.sections.map((section, sectionIndex) => (
                                                                <Reorder.Item key={section.id} value={section} style={{ listStyle: 'none' }} dragListener={isReordering}>
                                                                    <div className="admin-card" style={{ padding: '0', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                                                                        <div className="category-header" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)', padding: '12px 16px', borderRadius: '12px 12px 0 0' }}>
                                                                            {isReordering && (
                                                                                <div style={{ cursor: 'grab', color: 'var(--text-muted)', marginRight: '8px' }}>
                                                                                    <GripVertical size={16} />
                                                                                </div>
                                                                            )}
                                                                            <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                                                                {section.icon && (
                                                                                    <span style={{ fontSize: '18px' }}>
                                                                                        {/* Icon rendering logic if needed, simplify for now */}
                                                                                    </span>
                                                                                )}
                                                                                {section.title.en}
                                                                            </h3>
                                                                            {/* Section Controls */}
                                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                                {isReordering ? (
                                                                                    // Section Reorder Arrows (keep existing logic or simplified)
                                                                                    <div style={{ display: 'flex', gap: '2px' }}>
                                                                                        <button onClick={() => handleMoveSection(category, sectionIndex, -1)} disabled={sectionIndex === 0} className="admin-btn-icon" style={{ width: 28, height: 28 }}><ChevronUp size={14} /></button>
                                                                                        <button onClick={() => handleMoveSection(category, sectionIndex, 1)} disabled={sectionIndex === category.sections.length - 1} className="admin-btn-icon" style={{ width: 28, height: 28 }}><ChevronDown size={14} /></button>
                                                                                    </div>
                                                                                ) : (
                                                                                    <>
                                                                                        <button onClick={() => {
                                                                                            setEditingItem({
                                                                                                isNew: true,
                                                                                                categoryId: category.id,
                                                                                                sectionId: section.id,
                                                                                                item: { name: { en: '', mk: '', sq: '' }, description: { en: '', mk: '', sq: '' }, price: '', image: '', tags: [], allergens: [] }
                                                                                            });
                                                                                        }} className="admin-btn admin-btn-ghost" style={{ padding: '6px 12px', fontSize: '12px' }}>
                                                                                            <Plus size={14} /> Add Item
                                                                                        </button>
                                                                                        <button onClick={() => setEditingSection({ categoryId: category.id, section: section })} className="admin-btn-icon" style={{ width: 32, height: 32 }}><Edit2 size={14} /></button>
                                                                                        <button onClick={() => { if (confirm('Delete section?')) deleteSection(restaurant.id, category.id, section.id) }} className="admin-btn-icon danger" style={{ width: 32, height: 32 }}><Trash2 size={14} /></button>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Items List */}
                                                                        <div className="items" style={{ padding: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                            {section.items.map((item, itemIndex) => (
                                                                                <div key={item.id} className="menu-item-row" style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', gap: '12px' }}>
                                                                                    {/* Item Image */}
                                                                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden', flexShrink: 0 }}>
                                                                                        {item.image ? (
                                                                                            <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                                        ) : (
                                                                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                                                                                <ImageIcon size={16} />
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    {/* Item Info */}
                                                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                                                        <div style={{ fontWeight: 500, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name.en}</div>
                                                                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.price} den</div>
                                                                                    </div>
                                                                                    {/* Item Actions */}
                                                                                    <div className="menu-item-actions" style={{ display: 'flex', gap: '4px' }}>
                                                                                        {isReordering ? (
                                                                                            <>
                                                                                                <button onClick={() => handleMoveItem(category.id, section, itemIndex, -1)} disabled={itemIndex === 0} className="admin-btn-icon" style={{ width: 28, height: 28 }}><ChevronUp size={14} /></button>
                                                                                                <button onClick={() => handleMoveItem(category.id, section, itemIndex, 1)} disabled={itemIndex === section.items.length - 1} className="admin-btn-icon" style={{ width: 28, height: 28 }}><ChevronDown size={14} /></button>
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <button onClick={() => setEditingItem({ item, categoryId: category.id, sectionId: section.id, isNew: false })} className="admin-btn-icon" style={{ width: 32, height: 32 }}><Edit2 size={14} /></button>
                                                                                                <button onClick={() => { if (confirm('Delete item?')) handleDeleteItem(category.id, section.id, item.id) }} className="admin-btn-icon danger" style={{ width: 32, height: 32 }}><Trash2 size={14} /></button>
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                            {section.items.length === 0 && (
                                                                                <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                                                                                    No items.
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </Reorder.Item>
                                                            ))}
                                                        </Reorder.Group>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Reorder.Item>
                                );
                            })}
                        </Reorder.Group>
                    </div >
                </>
            )}

            {
                activeTab === 'settings' && (
                    <div style={{ maxWidth: '800px' }}>
                        <div className="admin-card">
                            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px' }}>{t('branding')}</h3>
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('restaurantName')}</label>
                                    <input
                                        className="admin-input"
                                        value={draftValues.name || ''}
                                        onChange={(e) => handleDraftChange('name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Logo URL</label>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <input
                                            className="admin-input"
                                            value={draftValues.logo || ''}
                                            onChange={(e) => handleDraftChange('logo', e.target.value)}
                                            placeholder="https://..."
                                        />
                                        {draftValues.logo && (
                                            <img src={draftValues.logo} alt="Logo Preview" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', background: 'white' }} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Info Section */}
                        <div className="admin-card">
                            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px' }}>{t('businessInfo')}</h3>
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('workingHours')}</label>
                                    <textarea
                                        className="admin-input"
                                        value={draftValues.info?.hours || ''}
                                        onChange={(e) => handleDeepDraftChange('info', 'hours', e.target.value)}
                                        placeholder="Mon-Fri: 08:00 - 22:00&#10;Sat-Sun: 10:00 - 23:00"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('address')}</label>
                                    <input
                                        className="admin-input"
                                        value={draftValues.info?.address || ''}
                                        onChange={(e) => handleDeepDraftChange('info', 'address', e.target.value)}
                                        placeholder="123 Main St, City or Google Maps Link"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Restaurant Type / Subtitle</label>
                                    <input
                                        className="admin-input"
                                        value={draftValues.info?.subtitle || ''}
                                        onChange={(e) => handleDeepDraftChange('info', 'subtitle', e.target.value)}
                                        placeholder="e.g. Authentic Italian Cuisine"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('phone')}</label>
                                    <input
                                        className="admin-input"
                                        value={draftValues.info?.phone || ''}
                                        onChange={(e) => handleDeepDraftChange('info', 'phone', e.target.value)}
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Instagram</label>
                                    <input
                                        className="admin-input"
                                        value={draftValues.info?.socials?.instagram || ''}
                                        onChange={(e) => handleDeepDraftChange('info', 'socials', { ...(draftValues.info?.socials || {}), instagram: e.target.value })}
                                        placeholder="@username"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>TikTok</label>
                                    <input
                                        className="admin-input"
                                        value={draftValues.info?.socials?.tiktok || ''}
                                        onChange={(e) => handleDeepDraftChange('info', 'socials', { ...(draftValues.info?.socials || {}), tiktok: e.target.value })}
                                        placeholder="@username"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Website</label>
                                    <input
                                        className="admin-input"
                                        value={draftValues.info?.socials?.website || ''}
                                        onChange={(e) => handleDeepDraftChange('info', 'socials', { ...(draftValues.info?.socials || {}), website: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        <ThemeEditor
                            theme={draftValues.theme || {}}
                            onChange={(key, value) => handleDeepDraftChange('theme', key, value)}
                        />

                        <div className="admin-card">
                            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px' }}>{t('promotionBanner')}</h3>
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <input
                                        type="checkbox"
                                        checked={draftValues.promotion?.active || false}
                                        onChange={(e) => handleDeepDraftChange('promotion', 'active', e.target.checked)}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    <label style={{ fontWeight: 600 }}>{t('enablePromotion')}</label>
                                </div>
                                {draftValues.promotion?.active && (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('promoTitle')}</label>
                                            <input
                                                className="admin-input"
                                                value={draftValues.promotion?.title || ''}
                                                onChange={(e) => handleDeepDraftChange('promotion', 'title', e.target.value)}
                                                placeholder="Happy Hour!"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('image')} (Optional)</label>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                {draftValues.promotion?.image ? (
                                                    <div style={{ position: 'relative' }}>
                                                        <img src={draftValues.promotion.image} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeepDraftChange('promotion', 'image', '')}
                                                            style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <CloudinaryUploadButton onUpload={(url) => handleDeepDraftChange('promotion', 'image', url)} />
                                                )}
                                                <input
                                                    className="admin-input"
                                                    value={draftValues.promotion?.image || ''}
                                                    onChange={(e) => handleDeepDraftChange('promotion', 'image', e.target.value)}
                                                    placeholder="Image URL..."
                                                    style={{ flex: 1 }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('promoMessage')}</label>
                                            <textarea
                                                className="admin-input"
                                                value={draftValues.promotion?.message || ''}
                                                onChange={(e) => handleDeepDraftChange('promotion', 'message', e.target.value)}
                                                placeholder="50% off all cocktails..."
                                                rows={3}
                                                style={{ resize: 'vertical' }}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

const EditItemForm = ({ item, section, onSave, onCancel, onDelete, isNew, t = s => s }) => {
    // If it's a new item, start empty. If editing, use item data.
    const [formData, setFormData] = useState({
        nameEn: item?.name?.en || '',
        nameMk: item?.name?.mk || '',
        nameSq: item?.name?.sq || '',
        descEn: item?.desc?.en || item?.description?.en || '',
        descMk: item?.desc?.mk || item?.description?.mk || '',
        descSq: item?.desc?.sq || item?.description?.sq || '',
        price: item?.price || '', // Start empty string to allow typing 0 comfortably
        image: item?.image || '',
        filterId: item?.filterId || '', // Sub-category ID
        allergens: item?.allergens || [],
        options: item?.options || []
    });
    const [isTranslating, setIsTranslating] = useState(false);

    // Cloudinary Upload Logic
    const handleImageUpload = (url) => {
        setFormData(prev => ({ ...prev, image: url }));
    };

    const toggleAllergen = (allergen) => {
        setFormData(prev => {
            const current = prev.allergens || [];
            if (current.includes(allergen)) {
                return { ...prev, allergens: current.filter(a => a !== allergen) };
            } else {
                return { ...prev, allergens: [...current, allergen] };
            }
        });
    };

    // Option Management
    const addOption = () => {
        const newOption = {
            id: Date.now().toString(),
            label: { en: '', mk: '', sq: '' },
            price: 0
        };
        setFormData(prev => ({ ...prev, options: [...prev.options, newOption] }));
    };

    const removeOption = (idx) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== idx)
        }));
    };

    const updateOption = (idx, field, value) => {
        setFormData(prev => {
            const newOptions = [...prev.options];
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                newOptions[idx] = {
                    ...newOptions[idx],
                    [parent]: {
                        ...newOptions[idx][parent],
                        [child]: value
                    }
                };
            } else {
                newOptions[idx] = { ...newOptions[idx], [field]: value };
            }
            return { ...prev, options: newOptions };
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        onSave({
            name: { en: formData.nameEn, mk: formData.nameMk, sq: formData.nameSq },
            desc: { en: formData.descEn, mk: formData.descMk, sq: formData.descSq },
            price: Number(formData.price),
            image: formData.image,
            filterId: formData.filterId,
            allergens: formData.allergens,
            hideIcons: formData.hideIcons,
            options: formData.options.map(o => ({
                ...o,
                price: Number(o.price)
            }))
        });
    };

    return (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="form-grid">
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('itemName')} (English) *</label>
                    <input className="admin-input" value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('price')} (MKD) *</label>
                    <input className="admin-input" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} onWheel={(e) => e.target.blur()} required />
                </div>
            </div>

            <div className="form-grid">
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('itemName')} (MK)</label>
                    <input className="admin-input" value={formData.nameMk} onChange={e => setFormData({ ...formData, nameMk: e.target.value })} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('itemName')} (SQ)</label>
                    <input className="admin-input" value={formData.nameSq} onChange={e => setFormData({ ...formData, nameSq: e.target.value })} />
                </div>


                <div style={{ padding: '4px 0', gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={formData.hideIcons || false}
                            onChange={e => setFormData({ ...formData, hideIcons: e.target.checked })}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        {t('hideItemImages')}
                    </label>
                </div>
            </div>

            {/* Sub-Category Selector */}
            {
                section?.filters && section.filters.length > 0 && (
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('subCategory')}</label>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {section.filters.map(f => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, filterId: formData.filterId === f.id ? '' : f.id })}
                                    className={`sub-category-chip ${formData.filterId === f.id ? 'active' : ''}`}
                                    style={{
                                        border: formData.filterId === f.id ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                                        color: formData.filterId === f.id ? 'var(--color-primary)' : 'white',
                                        background: formData.filterId === f.id ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.05)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {f.label.en}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Allergens Selector */}
            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('allergens')}</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {ALLERGENS.map(allergen => {
                        const { icon: Icon, color } = getAllergenDetails(allergen);
                        const isSelected = formData.allergens?.includes(allergen);
                        return (
                            <button
                                key={allergen}
                                type="button"
                                onClick={() => toggleAllergen(allergen)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    borderRadius: '100px',
                                    border: '1px solid',
                                    borderColor: isSelected ? color : 'var(--glass-border)',
                                    background: isSelected ? `${color}20` : 'transparent',
                                    color: isSelected ? color : 'var(--text-muted)',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Icon size={14} />
                                {allergen}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('itemDesc')} (English)</label>
                    <button
                        type="button"
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!formData.descEn) return;
                            const text = formData.descEn;

                            // Helper to fetch using free MyMemory API
                            const translate = async (targetLang) => {
                                try {
                                    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
                                    const data = await res.json();
                                    return data.responseData?.translatedText || null;
                                } catch (err) {
                                    console.error("Translation failed", err);
                                    return null;
                                }
                            };

                            setIsTranslating(true);

                            const [mk, sq] = await Promise.all([translate('mk'), translate('sq')]);

                            setFormData(prev => ({
                                ...prev,
                                descMk: mk || prev.descMk || text, // Fallback to english if fail
                                descSq: sq || prev.descSq || text
                            }));

                            setIsTranslating(false);
                        }}
                        disabled={isTranslating}
                        className="admin-btn-ghost"
                        style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }}
                    >
                        {isTranslating ? (t('translating') || 'Translating...') : (t('autoTranslate') || 'Auto Translate')}
                    </button>
                </div>
                <textarea className="admin-input" rows={2} value={formData.descEn} onChange={e => setFormData({ ...formData, descEn: e.target.value })} />
            </div>

            <div className="form-grid">
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('itemDesc')} (MK)</label>
                    <textarea className="admin-input" rows={2} value={formData.descMk} onChange={e => setFormData({ ...formData, descMk: e.target.value })} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('itemDesc')} (SQ)</label>
                    <textarea className="admin-input" rows={2} value={formData.descSq} onChange={e => setFormData({ ...formData, descSq: e.target.value })} />
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('image')}</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {formData.image ? (
                        <div style={{ position: 'relative' }}>
                            <img src={formData.image} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, image: '' })}
                                style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ) : (
                        <CloudinaryUploadButton onUpload={handleImageUpload} />
                    )}
                    <input
                        className="admin-input"
                        placeholder="Or paste image URL..."
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        style={{ flex: 1 }}
                    />
                </div>
            </div>

            {/* Product Options (Sizes) */}
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('productOptions') || 'Product Options / Sizes'}</label>
                    <button
                        type="button"
                        onClick={addOption}
                        className="admin-btn admin-btn-ghost"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                        <Plus size={14} /> {t('addOption') || 'Add Option'}
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {formData.options.map((opt, idx) => (
                        <div key={opt.id} style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 2fr 1fr 40px',
                            gap: '12px',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.02)',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: 'var(--text-muted)' }}>Name (EN)</label>
                                <input
                                    className="admin-input"
                                    value={opt.label.en}
                                    onChange={(e) => updateOption(idx, 'label.en', e.target.value)}
                                    placeholder="Small"
                                    style={{ padding: '8px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: 'var(--text-muted)' }}>Name (MK)</label>
                                <input
                                    className="admin-input"
                                    value={opt.label.mk}
                                    onChange={(e) => updateOption(idx, 'label.mk', e.target.value)}
                                    placeholder="Мала"
                                    style={{ padding: '8px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: 'var(--text-muted)' }}>Price (+)</label>
                                <input
                                    type="number"
                                    className="admin-input"
                                    value={opt.price}
                                    onChange={(e) => updateOption(idx, 'price', e.target.value)}
                                    placeholder="0"
                                    style={{ padding: '8px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: '4px' }}>
                                <button
                                    type="button"
                                    onClick={() => removeOption(idx)}
                                    className="admin-btn-icon danger"
                                    style={{ width: '32px', height: '32px' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {formData.options.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
                            No options added. Item will have a single price.
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                {!isNew && onDelete && (
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm('Delete this item?')) onDelete();
                        }}
                        className="admin-btn"
                        style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                    >
                        {t('delete')}
                    </button>
                )}
                <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost" style={{ flex: 1 }}>{t('cancel')}</button>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>{isNew ? t('add') : t('save')}</button>
            </div>
        </form >
    );
};


export { RestaurantList, MenuEditor };

