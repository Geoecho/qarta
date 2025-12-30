import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Store, LayoutDashboard, Settings, Plus, Edit2, LogOut, Trash2, ArrowLeft, Menu as MenuIcon, X, Save, ShoppingBag, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '../contexts/MenuContext';
import { auth } from '../firebase';
import IconPicker from '../components/IconPicker';
import './AdminDashboard.css';
import { OrdersDashboard } from './OrdersDashboard';
import { ALLERGENS, getAllergenDetails } from '../utils/allergenHelper';
import CloudinaryUploadButton from '../components/CloudinaryUploadButton';

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
    const [view, setView] = useState('restaurants');
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const { restaurants } = usePlatform();

    const selectedRestaurant = restaurants.find(r => r.id === selectedRestaurantId);

    // If we are in menu-editor but no restaurant is selected (e.g. reload or bug), go back
    useEffect(() => {
        if (view === 'menu-editor' && !selectedRestaurant) {
            setView('restaurants');
        }
    }, [view, selectedRestaurant]);

    return (
        <AdminLayout
            view={view}
            setView={setView}
            onBack={view === 'restaurants' ? null : () => setView('restaurants')}
        >
            {view === 'restaurants' && (
                <RestaurantList
                    onSelect={(id) => {
                        setSelectedRestaurantId(id);
                        setView('menu-editor');
                    }}
                />
            )}

            {view === 'menu-editor' && selectedRestaurant && (
                <MenuEditor restaurant={selectedRestaurant} />
            )}
        </AdminLayout>
    );
};

const ThemeEditor = ({ theme, onChange }) => {
    const [activeTab, setActiveTab] = useState('brand'); // 'brand' | 'light' | 'dark'

    // Simplified structure: 3 Main Tabs
    const tabs = [
        { id: 'brand', label: 'Brand Identity', icon: '🎨' },
        { id: 'light', label: 'Light Mode', icon: '☀️' },
        { id: 'dark', label: 'Dark Mode', icon: '🌙' }
    ];

    // Groups for Light/Dark tabs
    const colorGroups = {
        light: [
            {
                title: 'Core Colors',
                colors: [
                    { key: 'background', label: 'Background', desc: 'Main Page Background' },
                    { key: 'surface', label: 'Surface', desc: 'Cards & Containers' },
                    { key: 'text', label: 'Heading Text', desc: 'Primary Text Color' },
                    { key: 'textMuted', label: 'Body Text', desc: 'Secondary Details' },
                ]
            },
            {
                title: 'Interface Elements',
                colors: [
                    { key: 'border', label: 'Borders', desc: 'Dividers & Outlines' },
                    { key: 'headerControlBg', label: 'Buttons Bg', desc: 'Top Bar Buttons' },
                    { key: 'headerControlIcon', label: 'Buttons Icon', desc: 'Top Bar Icons' },
                    { key: 'menuIconColor', label: 'Category Icons', desc: 'Menu Section Icons' },
                ]
            },
            {
                title: 'Menu Items',
                colors: [
                    { key: 'itemPriceColor', label: 'Price', desc: 'Price Tag Color' },
                    { key: 'itemBtnBg', label: 'Action Button', desc: 'Add to Cart Background' },
                    { key: 'itemBtnIcon', label: 'Action Icon', desc: 'Add to Cart Icon' },
                ]
            }
        ],
        dark: [
            {
                title: 'Core Colors',
                colors: [
                    { key: 'darkBackground', label: 'Background', desc: 'Main Page Background' },
                    { key: 'darkSurface', label: 'Surface', desc: 'Cards & Containers' },
                    { key: 'darkText', label: 'Heading Text', desc: 'Primary Text Color' },
                    { key: 'darkTextMuted', label: 'Body Text', desc: 'Secondary Details' },
                ]
            },
            {
                title: 'Interface Elements',
                colors: [
                    { key: 'darkBorder', label: 'Borders', desc: 'Dividers & Outlines' },
                    { key: 'darkHeaderControlBg', label: 'Buttons Bg', desc: 'Top Bar Buttons' },
                    { key: 'darkHeaderControlIcon', label: 'Buttons Icon', desc: 'Top Bar Icons' },
                    { key: 'darkMenuIconColor', label: 'Category Icons', desc: 'Menu Section Icons' },
                ]
            },
            {
                title: 'Menu Items',
                colors: [
                    { key: 'darkItemPriceColor', label: 'Price', desc: 'Price Tag Color' },
                    { key: 'darkItemBtnBg', label: 'Action Button', desc: 'Add to Cart Background' },
                    { key: 'darkItemBtnIcon', label: 'Action Icon', desc: 'Add to Cart Icon' },
                ]
            }
        ]
    };

    // Defaults matching App.jsx and index.css
    const defaults = {
        light: {
            background: '#F5F5F7', surface: '#FFFFFF', overlay: '#00000080',
            text: '#1D1D1F', textMuted: '#86868B', border: '#e5e7eb',
            headerControlBg: '#F0F0F2', headerControlIcon: '#1D1D1F',
            menuIconBg: '#ffffff00', menuIconColor: '#1D1D1F',
            itemTitleColor: '#1D1D1F', itemDescColor: '#86868B',
            itemPriceColor: theme?.primary || '#0ea5e9',
            itemBtnBg: theme?.primary || '#0ea5e9', itemBtnIcon: '#FFFFFF'
        },
        dark: {
            darkBackground: '#050505', darkSurface: '#121212', darkOverlay: '#000000CC',
            darkText: '#E0E6ED', darkTextMuted: '#9DA5B4', darkBorder: '#ffffff1a',
            darkHeaderControlBg: '#1E1E1E', darkHeaderControlIcon: '#E0E6ED',
            darkMenuIconBg: '#ffffff00', darkMenuIconColor: '#E0E6ED',
            darkItemTitleColor: '#E0E6ED', darkItemDescColor: '#9DA5B4',
            darkItemPriceColor: theme?.darkPrimary || theme?.primary || '#38bdf8',
            darkItemBtnBg: theme?.darkPrimary || theme?.primary || '#38bdf8', darkItemBtnIcon: '#050505'
        }
    };

    return (
        <div className="admin-card">
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>Theme Customization</h3>
            <p style={{ margin: '0 0 24px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                Control the look and feel of your digital menu.
            </p>

            {/* Top Level Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '1px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '12px 20px',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '2px solid #38bdf8' : '2px solid transparent',
                            color: activeTab === tab.id ? '#38bdf8' : 'var(--text-muted)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            fontSize: '14px'
                        }}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* BRAND TAB CONTENT */}
            {activeTab === 'brand' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Core Identity</h4>

                        <div style={{ display: 'grid', gap: '24px' }}>
                            {/* Global Primary */}
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Primary Brand Color</label>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                                            The main color used for buttons, links, and highlights.
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                                            <input
                                                type="color"
                                                value={theme?.primary || '#0ea5e9'}
                                                onChange={(e) => onChange('primary', e.target.value)}
                                                style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', cursor: 'pointer' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <input
                                    className="admin-input"
                                    value={theme?.primary || ''}
                                    onChange={(e) => onChange('primary', e.target.value)}
                                    placeholder="#0ea5e9"
                                    style={{ fontFamily: 'monospace', width: '100%' }}
                                />
                            </div>

                            {/* Dark Mode Override */}
                            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: theme?.darkPrimary ? '16px' : '0' }}>
                                    <input
                                        type="checkbox"
                                        id="darkModeOverride"
                                        checked={!!theme?.darkPrimary}
                                        onChange={(e) => {
                                            if (e.target.checked) onChange('darkPrimary', theme?.primary || '#38bdf8');
                                            else onChange('darkPrimary', '');
                                        }}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#38bdf8' }}
                                    />
                                    <div>
                                        <label htmlFor="darkModeOverride" style={{ fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'block' }}>
                                            Dark Mode Specific Color
                                        </label>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                                            Use a different primary color when in dark mode (optional).
                                        </p>
                                    </div>
                                </div>

                                {theme?.darkPrimary && (
                                    <div style={{ paddingLeft: '30px', animation: 'slideDown 0.2s ease' }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                                <input
                                                    type="color"
                                                    value={theme?.darkPrimary || '#38bdf8'}
                                                    onChange={(e) => onChange('darkPrimary', e.target.value)}
                                                    style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', cursor: 'pointer' }}
                                                />
                                            </div>
                                            <input
                                                className="admin-input"
                                                value={theme?.darkPrimary || ''}
                                                onChange={(e) => onChange('darkPrimary', e.target.value)}
                                                placeholder="#38bdf8"
                                                style={{ width: '120px', fontFamily: 'monospace' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Default Appearance */}
                            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '12px' }}>Default Appearance for New Users</div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => onChange('defaultMode', 'light')}
                                        style={{
                                            flex: 1, padding: '12px', borderRadius: '8px',
                                            border: theme.defaultMode === 'light' ? '2px solid #38bdf8' : '1px solid var(--border)',
                                            background: '#ffffff', color: '#000000', cursor: 'pointer', fontWeight: 600,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        ☀️ Light Mode
                                    </button>
                                    <button
                                        onClick={() => onChange('defaultMode', 'dark')}
                                        style={{
                                            flex: 1, padding: '12px', borderRadius: '8px',
                                            border: theme.defaultMode === 'dark' ? '2px solid #38bdf8' : '1px solid var(--border)',
                                            background: '#0f172a', color: '#ffffff', cursor: 'pointer', fontWeight: 600,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        🌙 Dark Mode
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}





            {/* LIGHT / DARK TAB CONTENT */}
            {(activeTab === 'light' || activeTab === 'dark') && (
                <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {colorGroups[activeTab].map(group => (
                        <div key={group.title}>
                            <h4 style={{
                                margin: '0 0 20px 0',
                                fontSize: '13px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                color: '#38bdf8', // Accent color for headers
                                fontWeight: 700
                            }}>
                                {group.title}
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                                {group.colors.map(color => (
                                    <div key={color.key} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid transparent', transition: 'border 0.2s', ':hover': { borderColor: 'var(--border)' } }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600 }}>{color.label}</label>
                                            <div style={{ position: 'relative', width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                                <input
                                                    type="color"
                                                    value={theme?.[color.key] || defaults[activeTab][color.key] || '#000000'}
                                                    onChange={(e) => onChange(color.key, e.target.value)}
                                                    style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', padding: 0, margin: 0, border: 'none', cursor: 'pointer' }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', minHeight: '16px' }}>
                                            {color.desc}
                                        </div>
                                        <input
                                            className="admin-input"
                                            value={theme?.[color.key] || ''}
                                            onChange={(e) => onChange(color.key, e.target.value)}
                                            placeholder={defaults[activeTab][color.key]} // Use correct default
                                            style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px', padding: '6px 8px' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div >
    );
};


// --- Components ---

const AdminLayout = ({ children, onBack, view, setView }) => {
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
            {/* Mobile Header */}
            <div className="admin-mobile-header">
                <div style={{ fontWeight: 700, fontSize: '18px', color: 'white' }}>Admin Panel</div>
                <button onClick={() => setSidebarOpen(true)} style={{ background: 'transparent', border: 'none', color: 'white' }}>
                    <MenuIcon size={24} />
                </button>
            </div>

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
                <StatusBadge />

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Restaurants"
                        active={!onBack && view === 'restaurants'}
                        onClick={() => {
                            if (onBack) onBack();
                            if (setView) setView('restaurants');
                            setSidebarOpen(false);
                        }}
                    />

                    {onBack && <SidebarItem icon={Settings} label="Menu Editor" active />}
                </nav>

                <button
                    onClick={handleLogout}
                    className="sidebar-nav-item"
                    style={{ marginTop: 'auto', color: '#64748b', background: 'rgba(0,0,0,0.3)' }}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="admin-content">
                {onBack && (
                    <button onClick={onBack} className="admin-btn admin-btn-ghost" style={{ marginBottom: '24px' }}>
                        <ArrowLeft size={16} /> Back to Restaurants
                    </button>
                )}
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
        <Icon size={20} color={active ? '#38bdf8' : 'currentColor'} />
        {label}
    </div>
);

const StatusBadge = () => {
    const { saveStatus, serverError } = usePlatform();

    if (saveStatus === 'idle') return null;

    let bg = 'rgba(255,255,255,0.05)';
    let color = '#94a3b8';
    let text = 'Ready';

    if (saveStatus === 'saving') {
        bg = 'rgba(56, 189, 248, 0.1)'; color = '#38bdf8'; text = 'Saving...';
    } else if (saveStatus === 'success') {
        bg = 'rgba(34, 197, 94, 0.1)'; color = '#4ade80'; text = 'Saved!';
    } else if (saveStatus === 'error') {
        bg = 'rgba(239, 68, 68, 0.1)'; color = '#f87171'; text = 'Error!';
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

const RestaurantList = ({ onSelect }) => {
    const { restaurants, addRestaurant, removeRestaurant } = usePlatform();
    const [isAddMode, setIsAddMode] = useState(false);
    const [newRes, setNewRes] = useState({ name: '', slug: '', type: 'Fast Food' });

    const handleAdd = (e) => {
        e.preventDefault();
        if (newRes.name && newRes.slug) {
            addRestaurant(newRes);
            setIsAddMode(false);
            setNewRes({ name: '', slug: '', type: 'Fast Food' });
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '36px', fontWeight: 800, letterSpacing: '-1px' }}>Restaurants</h1>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Manage all live client instances.</p>
                </div>
                <button
                    onClick={() => setIsAddMode(true)}
                    className="admin-btn admin-btn-primary">
                    <Plus size={20} />
                    New Client
                </button>
            </div>

            {isAddMode && (
                <form onSubmit={handleAdd} className="admin-card">
                    <h3 style={{ margin: '0 0 24px 0' }}>Add New Restaurant</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        <input className="admin-input" placeholder="Restaurant Name" value={newRes.name} onChange={e => setNewRes({ ...newRes, name: e.target.value })} required />
                        <input className="admin-input" placeholder="Slug (URL path, e.g. 'netaville')" value={newRes.slug} onChange={e => setNewRes({ ...newRes, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} required />
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Your restaurant will be available at: <strong style={{ color: '#38bdf8' }}>qarta.xyz/{newRes.slug || 'your-slug'}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="admin-btn admin-btn-primary">Create</button>
                        <button type="button" onClick={() => setIsAddMode(false)} className="admin-btn admin-btn-ghost">Cancel</button>
                    </div>
                </form>
            )}

            {!isAddMode && restaurants.length === 0 && (
                <div className="admin-card" style={{ padding: '80px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '24px' }}>🏪</div>
                    <h3 style={{ margin: '0 0 12px 0' }}>No Restaurants Yet</h3>
                    <p style={{ margin: '0 0 32px 0', color: 'var(--text-muted)' }}>
                        Create your first restaurant to get started.
                    </p>
                    <button
                        onClick={() => setIsAddMode(true)}
                        className="admin-btn admin-btn-primary"
                    >
                        <Plus size={20} />
                        Create First Restaurant
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gap: '20px' }}>
                {restaurants.map(r => (
                    <div key={r.id} className="admin-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '16px',
                                background: 'rgba(255,255,255,0.05)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: '24px', color: '#38bdf8'
                            }}>
                                {r.name[0]}
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 6px 0', fontSize: '20px' }}>{r.name}</h3>
                                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                    /{r.slug} • {r.menu.length} Categories
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <button onClick={() => window.open(`/${r.slug}`, '_blank')} className="admin-btn admin-btn-ghost" style={{ padding: '10px 20px' }}>
                                View Live
                            </button>
                            <button onClick={() => onSelect(r.id)} className="admin-btn admin-btn-primary">
                                <Edit2 size={16} /> Manage
                            </button>
                            {r.slug !== 'default' && (
                                <button onClick={() => { if (confirm('Delete ' + r.name + '?')) removeRestaurant(r.id) }} className="admin-btn admin-btn-danger" style={{ padding: '10px' }}>
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CategoryForm = ({ onSave, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        nameEn: initialData?.label?.en || '',
        nameMk: initialData?.label?.mk || '',
        nameSq: initialData?.label?.sq || '',
        icon: initialData?.icon || 'Utensils'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: formData.id || `cat-${Date.now()}`,
            label: {
                en: formData.nameEn,
                mk: formData.nameMk,
                sq: formData.nameSq
            },
            icon: formData.icon
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>ID (optional)</label>
                <input className="admin-input" name="id" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} placeholder="drinks" />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Name (English) *</label>
                <input className="admin-input" name="nameEn" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} placeholder="Drinks" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Name (MK)</label>
                    <input className="admin-input" name="nameMk" value={formData.nameMk} onChange={(e) => setFormData({ ...formData, nameMk: e.target.value })} placeholder="Пијалоци" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Name (SQ)</label>
                    <input className="admin-input" name="nameSq" value={formData.nameSq} onChange={(e) => setFormData({ ...formData, nameSq: e.target.value })} placeholder="Pije" />
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Icon</label>
                <IconPicker
                    selectedIcon={formData.icon}
                    onSelect={(iconId) => setFormData({ ...formData, icon: iconId })}
                />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>{initialData ? 'Save Changes' : 'Create Category'}</button>
            </div>
        </form>
    );
};

const SectionForm = ({ onSave, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        nameEn: initialData?.title?.en || '',
        nameMk: initialData?.title?.mk || '',
        nameSq: initialData?.title?.sq || '',
        icon: initialData?.icon || 'Utensils',
        filters: initialData?.filters || []
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
            items: initialData?.items || []
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>ID (optional)</label>
                <input className="admin-input" name="id" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} placeholder="wine" />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Name (English) *</label>
                <input className="admin-input" name="nameEn" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} placeholder="Wine" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Name (MK)</label>
                    <input className="admin-input" name="nameMk" value={formData.nameMk} onChange={(e) => setFormData({ ...formData, nameMk: e.target.value })} placeholder="Вино" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Name (SQ)</label>
                    <input className="admin-input" name="nameSq" value={formData.nameSq} onChange={(e) => setFormData({ ...formData, nameSq: e.target.value })} placeholder="Verë" />
                </div>
            </div>

            {/* Sub-Categories (Filters) */}
            <div style={{ marginTop: '20px', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>Sub-Categories (e.g., Red, White)</label>
                    <button type="button" onClick={addFilter} className="admin-btn admin-btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                        + Add
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                        No sub-categories yet. Click "+ Add" to create filters.
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

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>{initialData ? 'Save Changes' : 'Create Section'}</button>
            </div>
        </form>
    );
};

const MenuEditor = ({ restaurant }) => {
    const { updateMenuItem, addMenuItem, updateRestaurantDetails, deleteMenuItem, addCategory, updateCategory, deleteCategory, addSection, updateSection, deleteSection, saveStatus } = usePlatform();
    const [editingItem, setEditingItem] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSection, setEditingSection] = useState(null);
    const [activeTab, setActiveTab] = useState('menu');
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showSectionForm, setShowSectionForm] = useState(null);

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
                info: { hours: '', address: '', phone: '', ...restaurant.info },
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
        }, 500); // Faster bounce (500ms)

        return () => clearTimeout(timer);
    }, [draftValues, hasChanges, restaurant.id, updateRestaurantDetails]);


    const handleSaveMenu = (data) => {
        if (!editingItem) return;

        if (editingItem.isNew) {
            addMenuItem(restaurant.id, editingItem.categoryId, editingItem.sectionId, data);
        } else {
            updateMenuItem(restaurant.id, editingItem.categoryId, editingItem.sectionId, editingItem.item.id, data);
        }
        setEditingItem(null);
    };

    return (
        <div>
            {/* Header / Tabs */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ margin: '0 0 8px 0', fontSize: '36px', fontWeight: 800 }}>{restaurant.name}</h1>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                            Editing /{restaurant.slug}
                        </p>
                    </div>
                    {/* Status Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', fontSize: '13px', fontWeight: 600 }}>
                        {saveStatus === 'saving' && <span style={{ color: '#fbbf24' }}>Saving...</span>}
                        {saveStatus === 'success' && <span style={{ color: '#34d399' }}>Synced</span>}
                        {saveStatus === 'idle' && <span style={{ color: 'var(--text-muted)' }}>Ready</span>}
                        {saveStatus === 'error' && <span style={{ color: '#ef4444' }}>Sync Error</span>}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`admin-btn ${activeTab === 'menu' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                    >
                        Menu
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`admin-btn ${activeTab === 'settings' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                    >
                        Settings & Branding
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`admin-btn ${activeTab === 'orders' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                    >
                        Orders
                    </button>
                </div>
            </div>

            {/* CONTENT: MENU EDITOR */}
            {activeTab === 'orders' && (
                <OrdersDashboard />
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
                                    <h2 style={{ marginTop: 0 }}>{editingItem.isNew ? 'New Item' : 'Edit Item'}</h2>
                                    <EditItemForm
                                        item={editingItem.item}
                                        section={restaurant.menu
                                            .find(c => c.id === editingItem.categoryId)?.sections
                                            .find(s => s.id === editingItem.sectionId)}
                                        onSave={handleSaveMenu}
                                        onCancel={() => setEditingItem(null)}
                                        isNew={editingItem.isNew}
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                    {/* Edit Item Modal */}
                    <Modal
                        isOpen={!!editingItem}
                        onClose={() => setEditingItem(null)}
                        title={editingItem?.isNew ? 'New Item' : 'Edit Item'}
                    >
                        {editingItem && (
                            <EditItemForm
                                item={editingItem.item}
                                section={restaurant.menu
                                    .find(c => c.id === editingItem.categoryId)?.sections
                                    .find(s => s.id === editingItem.sectionId)}
                                onSave={handleSaveMenu}
                                onCancel={() => setEditingItem(null)}
                                isNew={editingItem.isNew}
                            />
                        )}
                    </Modal>

                    {/* Category Form Modal */}
                    <Modal
                        isOpen={showCategoryForm}
                        onClose={() => setShowCategoryForm(false)}
                        title="New Category"
                    >
                        <CategoryForm
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
                        title="New Section"
                    >
                        <SectionForm
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
                        title="Edit Category"
                    >
                        {editingCategory && (
                            <CategoryForm
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
                                initialData={editingSection.section}
                                onSave={(data) => {
                                    updateSection(restaurant.id, editingSection.categoryId, editingSection.section.id, data);
                                    setEditingSection(null);
                                }}
                                onCancel={() => setEditingSection(null)}
                            />
                        )}
                    </Modal>

                    {
                        restaurant.menu.length === 0 && (
                            <div className="admin-card" style={{ padding: '80px 24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', marginBottom: '24px' }}>📋</div>
                                <h3 style={{ margin: '0 0 12px 0' }}>Empty Menu</h3>
                                <p style={{ margin: '0 0 32px 0', color: 'var(--text-muted)' }}>
                                    Start building your menu by creating a category (e.g., "Drinks", "Food").
                                </p>
                                <button
                                    onClick={() => setShowCategoryForm(true)}
                                    className="admin-btn admin-btn-primary"
                                >
                                    <Plus size={20} />
                                    Create First Category
                                </button>
                            </div>
                        )
                    }

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {restaurant.menu.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-20px' }}>
                                <button
                                    onClick={() => setShowCategoryForm(true)}
                                    className="admin-btn admin-btn-primary"
                                >
                                    <Plus size={20} /> New Category
                                </button>
                            </div>
                        )}
                        {restaurant.menu.map(category => (
                            <div key={category.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h2 style={{ fontSize: '24px', margin: 0, flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {category.label.en}
                                        <div style={{ width: '20px', height: '2px', background: 'var(--glass-border)' }} />
                                    </h2>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => setShowSectionForm(category.id)}
                                            className="admin-btn admin-btn-ghost"
                                            style={{ padding: '8px 16px', fontSize: '12px' }}
                                        >
                                            <Plus size={14} /> Add Section
                                        </button>
                                        <button
                                            onClick={() => setEditingCategory(category)}
                                            className="admin-btn admin-btn-ghost"
                                            style={{ padding: '8px 16px', fontSize: '12px' }}
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => { if (confirm('Delete category?')) deleteCategory(restaurant.id, category.id) }}
                                            className="admin-btn admin-btn-danger"
                                            style={{ padding: '8px' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gap: '24px' }}>
                                    {category.sections.map(section => (
                                        <div key={section.id} className="admin-card" style={{ marginBottom: 0, padding: 0, overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                                            <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '18px' }}>{section.title.en}</span>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => setEditingItem({ categoryId: category.id, sectionId: section.id, item: { name: {}, price: 0 }, isNew: true })}
                                                        className="admin-btn admin-btn-primary"
                                                        style={{ padding: '6px 12px', fontSize: '12px' }}
                                                    >
                                                        <Plus size={14} /> Add Item
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingSection({ categoryId: category.id, section: section })}
                                                        className="admin-btn admin-btn-ghost"
                                                        style={{ padding: '6px 12px', fontSize: '12px' }}
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => { if (confirm('Delete section?')) deleteSection(restaurant.id, category.id, section.id) }}
                                                        className="admin-btn admin-btn-danger"
                                                        style={{ padding: '6px' }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div style={{ padding: '8px' }}>
                                                {section.items.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setEditingItem({ categoryId: category.id, sectionId: section.id, item, isNew: false })}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            padding: '16px',
                                                            borderRadius: '12px',
                                                            cursor: 'pointer',
                                                            transition: 'background 0.2s',
                                                            borderBottom: idx < section.items.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none'
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                            {item.image ? (
                                                                <img src={item.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                                                            ) : (
                                                                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div style={{ fontWeight: 600, fontSize: '15px' }}>{item.name.en}</div>
                                                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.desc?.en?.slice(0, 40) || ''}...</div>
                                                            </div>
                                                        </div>
                                                        <div style={{ fontWeight: 600, color: '#38bdf8' }}>{item.price} mkd</div>
                                                    </div>
                                                ))}
                                                {section.items.length === 0 && (
                                                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                                                        No items in this section.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {
                activeTab === 'settings' && (
                    <div style={{ maxWidth: '800px' }}>
                        <div className="admin-card">
                            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px' }}>Branding & Basic Info</h3>
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Restaurant Name</label>
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
                            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px' }}>Business Info</h3>
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Working Hours</label>
                                    <textarea
                                        className="admin-input"
                                        value={draftValues.info?.hours || ''}
                                        onChange={(e) => handleDeepDraftChange('info', 'hours', e.target.value)}
                                        placeholder="Mon-Fri: 08:00 - 22:00&#10;Sat-Sun: 10:00 - 23:00"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Address / Map Link</label>
                                    <input
                                        className="admin-input"
                                        value={draftValues.info?.address || ''}
                                        onChange={(e) => handleDeepDraftChange('info', 'address', e.target.value)}
                                        placeholder="123 Main St, City or Google Maps Link"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Phone Number</label>
                                    <input
                                        className="admin-input"
                                        value={draftValues.info?.phone || ''}
                                        onChange={(e) => handleDeepDraftChange('info', 'phone', e.target.value)}
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>
                        </div>

                        <ThemeEditor
                            theme={draftValues.theme || {}}
                            onChange={(key, value) => handleDeepDraftChange('theme', key, value)}
                        />

                        <div className="admin-card">
                            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px' }}>Promotion Banner</h3>
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <input
                                        type="checkbox"
                                        checked={draftValues.promotion?.active || false}
                                        onChange={(e) => handleDeepDraftChange('promotion', 'active', e.target.checked)}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    <label style={{ fontWeight: 600 }}>Enable Promotion Banner</label>
                                </div>
                                {draftValues.promotion?.active && (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Title</label>
                                            <input
                                                className="admin-input"
                                                value={draftValues.promotion?.title || ''}
                                                onChange={(e) => handleDeepDraftChange('promotion', 'title', e.target.value)}
                                                placeholder="Happy Hour!"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Banner Image (Optional)</label>
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
                                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Message</label>
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

const EditItemForm = ({ item, section, onSave, onCancel, isNew }) => {
    // If it's a new item, start empty. If editing, use item data.
    const [formData, setFormData] = useState({
        nameEn: item?.name?.en || '',
        nameMk: item?.name?.mk || '',
        nameSq: item?.name?.sq || '',
        descEn: item?.desc?.en || '',
        descMk: item?.desc?.mk || '',
        descSq: item?.desc?.sq || '',
        price: item?.price || '', // Start empty string to allow typing 0 comfortably
        image: item?.image || '',
        filterId: item?.filterId || '', // Sub-category ID
        allergens: item?.allergens || []
    });

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

    const handleSave = (e) => {
        e.preventDefault();
        onSave({
            name: { en: formData.nameEn, mk: formData.nameMk, sq: formData.nameSq },
            desc: { en: formData.descEn, mk: formData.descMk, sq: formData.descSq },
            price: Number(formData.price),
            image: formData.image,
            filterId: formData.filterId,
            allergens: formData.allergens
        });
    };

    return (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Name (English) *</label>
                    <input className="admin-input" value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Price (MKD) *</label>
                    <input className="admin-input" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Name (MK)</label>
                    <input className="admin-input" value={formData.nameMk} onChange={e => setFormData({ ...formData, nameMk: e.target.value })} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Name (SQ)</label>
                    <input className="admin-input" value={formData.nameSq} onChange={e => setFormData({ ...formData, nameSq: e.target.value })} />
                </div>
            </div>

            {/* Sub-Category Selector */}
            {section?.filters && section.filters.length > 0 && (
                <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Sub-Category</label>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {section.filters.map(f => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, filterId: formData.filterId === f.id ? '' : f.id })}
                                className={`sub-category-chip ${formData.filterId === f.id ? 'active' : ''}`}
                                style={{
                                    border: formData.filterId === f.id ? '1px solid #38bdf8' : '1px solid var(--glass-border)',
                                    color: formData.filterId === f.id ? '#38bdf8' : 'white',
                                    background: formData.filterId === f.id ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.05)',
                                    cursor: 'pointer'
                                }}
                            >
                                {f.label.en}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Allergens Selector */}
            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Allergens & Badges</label>
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
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Description (English)</label>
                <textarea className="admin-input" rows={2} value={formData.descEn} onChange={e => setFormData({ ...formData, descEn: e.target.value })} />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Image</label>
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

            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>{isNew ? 'Add Item' : 'Save Changes'}</button>
            </div>
        </form>
    );
};

export { RestaurantList, MenuEditor };
