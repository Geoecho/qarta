import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Store, LayoutDashboard, Settings, Plus, Edit2, LogOut, Trash2, ArrowLeft, Menu as MenuIcon, X, Save, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '../contexts/MenuContext';
import { auth } from '../firebase';
import './AdminDashboard.css';
import { OrdersDashboard } from './OrdersDashboard';

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
                <div style={{ fontWeight: 700, fontSize: '18px' }}>Admin Panel</div>
                <button onClick={() => setSidebarOpen(true)} style={{ background: 'transparent', border: 'none', color: 'var(--color-ink)' }}>
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
                <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '8px',
                            backgroundColor: 'var(--color-primary)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: 'var(--color-on-primary)', fontWeight: 700
                        }}>A</div>
                        <span style={{ fontSize: '18px', fontWeight: 700 }}>Admin Panel</span>
                    </div>
                    <button
                        className="mobile-only"
                        onClick={() => setSidebarOpen(false)}
                        style={{ display: window.innerWidth > 768 ? 'none' : 'block', background: 'transparent', border: 'none', color: 'var(--color-ink)' }}
                    >
                        <X size={24} />
                    </button>
                </div>

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
                    <SidebarItem
                        icon={ShoppingBag}
                        label="Orders"
                        active={!onBack && view === 'orders'}
                        onClick={() => {
                            if (onBack) onBack();
                            if (setView) setView('orders');
                            setSidebarOpen(false);
                        }}
                    />
                    {onBack && <SidebarItem icon={Settings} label="Menu Editor" active />}
                </nav>

                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                        border: 'none', background: 'transparent', color: 'var(--color-text-subtle)',
                        cursor: 'pointer', fontSize: '14px', fontWeight: 600, marginTop: 'auto'
                    }}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="admin-content">
                {onBack && (
                    <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'transparent', cursor: 'pointer', marginBottom: '24px', fontWeight: 600, color: 'var(--color-text-subtle)' }}>
                        <ArrowLeft size={16} /> Back to Restaurants
                    </button>
                )}
                {children}
            </div>
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <div onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 16px', borderRadius: '12px',
        backgroundColor: active ? 'var(--bg-surface-secondary)' : 'transparent',
        color: active ? 'var(--color-ink)' : 'var(--color-text-subtle)',
        cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s'
    }}>
        <Icon size={20} />
        {label}
    </div>
);

// --- Sub-Views ---

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-sans)', fontSize: '32px' }}>Restaurants</h1>
                    <p style={{ margin: 0, color: 'var(--color-text-subtle)' }}>Manage all live client instances.</p>
                </div>
                <button
                    onClick={() => setIsAddMode(true)}
                    style={{
                        backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
                        border: 'none', padding: '12px 24px', borderRadius: '100px',
                        fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                    <Plus size={20} />
                    New Client
                </button>
            </div>

            {isAddMode && (
                <form onSubmit={handleAdd} className="admin-card">
                    <h3 style={{ margin: '0 0 16px 0' }}>Add New Restaurant</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <input className="admin-input" placeholder="Restaurant Name" value={newRes.name} onChange={e => setNewRes({ ...newRes, name: e.target.value })} required />
                        <input className="admin-input" placeholder="Slug (URL path)" value={newRes.slug} onChange={e => setNewRes({ ...newRes, slug: e.target.value })} required />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Create</button>
                        <button type="button" onClick={() => setIsAddMode(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', color: 'var(--color-ink)' }}>Cancel</button>
                    </div>
                </form>
            )}

            <div style={{ display: 'grid', gap: '16px' }}>
                {restaurants.map(r => (
                    <div key={r.id} className="admin-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '12px',
                                background: 'var(--bg-surface-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: '20px'
                            }}>
                                {r.name[0]}
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{r.name}</h3>
                                <div style={{ fontSize: '14px', color: 'var(--color-text-subtle)' }}>
                                    /{r.slug} • {r.menu.length} Categories
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <button onClick={() => window.open(`/${r.slug}`, '_blank')} style={{ padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', fontSize: '13px' }}>
                                View Live
                            </button>
                            <button onClick={() => onSelect(r.id)} style={{ padding: '8px 16px', borderRadius: '100px', background: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Edit2 size={14} /> Manage
                            </button>
                            {r.slug !== 'default' && (
                                <button onClick={() => { if (confirm('Delete ' + r.name + '?')) removeRestaurant(r.id) }} style={{ padding: '8px', borderRadius: '50%', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MenuEditor = ({ restaurant }) => {
    const { updateMenuItem, addMenuItem, updateRestaurantDetails } = usePlatform();
    const [editingItem, setEditingItem] = useState(null); // { categoryId, sectionId, item, isNew: boolean }
    const [activeTab, setActiveTab] = useState('menu');

    // Draft State for Settings
    const [draftValues, setDraftValues] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    // Initialize Draft Settings
    useEffect(() => {
        setDraftValues({
            name: restaurant.name,
            logo: restaurant.logo,
            theme: restaurant.theme || {},
            promotion: { active: false, title: '', message: '', image: '', ...restaurant.promotion }
        });
        setHasChanges(false);
    }, [restaurant]);

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

    const saveSettings = () => {
        updateRestaurantDetails(restaurant.id, draftValues);
        setHasChanges(false);
    };

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
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-sans)', fontSize: '32px' }}>{restaurant.name}</h1>
                <p style={{ margin: 0, color: 'var(--color-text-subtle)' }}>
                    Editing /{restaurant.slug}
                </p>

                <div style={{ display: 'flex', gap: '8px', marginTop: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
                    <button
                        onClick={() => setActiveTab('menu')}
                        style={{
                            padding: '8px 16px', borderRadius: '100px',
                            background: activeTab === 'menu' ? 'var(--color-ink)' : 'transparent',
                            color: activeTab === 'menu' ? 'var(--bg-app)' : 'var(--color-ink)',
                            border: '1px solid var(--color-ink)',
                            cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap'
                        }}>
                        Menu
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        style={{
                            padding: '8px 16px', borderRadius: '100px',
                            background: activeTab === 'settings' ? 'var(--color-ink)' : 'transparent',
                            color: activeTab === 'settings' ? 'var(--bg-app)' : 'var(--color-ink)',
                            border: '1px solid var(--color-ink)',
                            cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap'
                        }}>
                        Settings & Branding
                    </button>
                </div>
            </div>

            {/* CONTENT: MENU EDITOR */}
            {activeTab === 'menu' && (
                <>
                    <AnimatePresence>
                        {editingItem && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    onClick={() => setEditingItem(null)}
                                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                    style={{
                                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                        width: '90%', maxWidth: '500px',
                                        background: 'var(--bg-surface)',
                                        padding: '32px', borderRadius: '24px', zIndex: 1001,
                                        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', color: 'var(--color-ink)'
                                    }}
                                >
                                    <h2 style={{ marginTop: 0 }}>{editingItem.isNew ? 'New Item' : 'Edit Item'}</h2>
                                    <EditItemForm
                                        item={editingItem.item}
                                        onSave={handleSaveMenu}
                                        onCancel={() => setEditingItem(null)}
                                        isNew={editingItem.isNew}
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {restaurant.menu.map(category => (
                            <div key={category.id}>
                                <h2 style={{ fontSize: '20px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>{category.label.en}</h2>
                                <div style={{ display: 'grid', gap: '24px' }}>
                                    {category.sections.map(section => (
                                        <div key={section.id} className="admin-card" style={{ marginBottom: 0, padding: 0, overflow: 'hidden' }}>
                                            <div style={{ padding: '16px 20px', background: 'var(--bg-surface-secondary)', borderBottom: '1px solid var(--border-color)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span>{section.title.en}</span>
                                                <button
                                                    onClick={() => setEditingItem({ categoryId: category.id, sectionId: section.id, item: { name: {}, price: 0 }, isNew: true })}
                                                    style={{ border: 'none', background: 'var(--color-primary)', color: 'white', borderRadius: '100px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <Plus size={14} /> Add Item
                                                </button>
                                            </div>
                                            <div style={{ padding: '0 20px' }}>
                                                {section.items.map(item => (
                                                    <div key={item.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#eee' }} />
                                                            <div>
                                                                <div style={{ fontWeight: 600 }}>{item.name.en}</div>
                                                                <div style={{ fontSize: '13px', color: 'var(--color-text-subtle)' }}>${item.price.toFixed(2)}</div>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => setEditingItem({ categoryId: category.id, sectionId: section.id, item, isNew: false })} style={{ padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-ink)' }}>
                                                            <Edit2 size={14} /> Edit
                                                        </button>
                                                    </div>
                                                ))}
                                                {section.items.length === 0 && (
                                                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-subtle)', fontSize: '14px' }}>
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

            {/* CONTENT: SETTINGS (With Save Logic) */}
            {activeTab === 'settings' && (
                <div style={{ display: 'grid', gap: '32px', maxWidth: '600px' }}>

                    {/* General Settings */}
                    <div className="admin-card">
                        <h3 style={{ marginTop: 0 }}>General Branding</h3>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Restaurant Name</label>
                            <input
                                className="admin-input"
                                value={draftValues.name || ''}
                                onChange={(e) => handleDraftChange('name', e.target.value)}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Logo URL</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <input
                                    className="admin-input"
                                    value={draftValues.logo || ''}
                                    onChange={(e) => handleDraftChange('logo', e.target.value)}
                                    placeholder="https://"
                                />
                                <div style={{ width: '42px', height: '42px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#eee', flexShrink: 0 }}>
                                    {draftValues.logo ? <img src={draftValues.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Store size={20} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Theme Colors */}
                    <div className="admin-card">
                        <h3 style={{ marginTop: 0 }}>Theme & Colors</h3>

                        {/* Light Mode */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Primary Color</label>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={draftValues.theme?.primary || '#000000'}
                                        onChange={(e) => handleDeepDraftChange('theme', 'primary', e.target.value)}
                                        style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', padding: 0, cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '13px', color: 'var(--color-text-subtle)' }}>{draftValues.theme?.primary}</span>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Background (Light)</label>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={draftValues.theme?.background || '#ffffff'}
                                        onChange={(e) => handleDeepDraftChange('theme', 'background', e.target.value)}
                                        style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', padding: 0, cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '13px', color: 'var(--color-text-subtle)' }}>{draftValues.theme?.background}</span>
                                </div>
                            </div>
                        </div>

                        {/* Dark Mode Overrides */}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, fontSize: '14px', color: 'var(--color-text-subtle)' }}>Dark Mode Overrides (Optional)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Dark Background</label>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={draftValues.theme?.darkBackground || '#09090b'}
                                            onChange={(e) => handleDeepDraftChange('theme', 'darkBackground', e.target.value)}
                                            style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', padding: 0, cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '13px', color: 'var(--color-text-subtle)' }}>{draftValues.theme?.darkBackground}</span>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Dark Surface</label>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={draftValues.theme?.darkSurface || '#18181b'}
                                            onChange={(e) => handleDeepDraftChange('theme', 'darkSurface', e.target.value)}
                                            style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', padding: 0, cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '13px', color: 'var(--color-text-subtle)' }}>{draftValues.theme?.darkSurface}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Promotion Popup */}
                    <div className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0 }}>Popup Promotion</h3>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={draftValues.promotion?.active || false}
                                    onChange={(e) => handleDeepDraftChange('promotion', 'active', e.target.checked)}
                                />
                                <span style={{ fontWeight: 600 }}>Active</span>
                            </label>
                        </div>

                        <div style={{ opacity: draftValues.promotion?.active ? 1 : 0.5, pointerEvents: draftValues.promotion?.active ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Title</label>
                                <input
                                    className="admin-input"
                                    value={draftValues.promotion?.title || ''}
                                    onChange={(e) => handleDeepDraftChange('promotion', 'title', e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Message</label>
                                <textarea
                                    className="admin-input"
                                    value={draftValues.promotion?.message || ''}
                                    onChange={(e) => handleDeepDraftChange('promotion', 'message', e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Banner Image URL</label>
                                <input
                                    className="admin-input"
                                    value={draftValues.promotion?.image || ''}
                                    onChange={(e) => handleDeepDraftChange('promotion', 'image', e.target.value)}
                                    placeholder="https://"
                                />
                                <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
                                    Recommended Size: 800x600 (4:3 aspect ratio) or larger.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Action Bar */}
                    <AnimatePresence>
                        {hasChanges && (
                            <motion.div
                                className="save-bar"
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                onClick={saveSettings}
                                style={{ cursor: 'pointer' }}
                            >
                                <Save size={20} />
                                <span style={{ fontWeight: 600 }}>Save Changes</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <div style={{ height: '100px' }} />
        </div>
    );
};

const EditItemForm = ({ item, onSave, onCancel, isNew }) => {
    // Should initialize with default values if new, or item values if editing.
    const [formData, setFormData] = useState({
        price: item.price || 0,
        nameEn: item.name?.en || '',
        nameMk: item.name?.mk || '',
        nameSq: item.name?.sq || '',
        image: item.image || ''
    });

    useEffect(() => {
        setFormData({
            price: item.price || 0,
            nameEn: item.name?.en || '',
            nameMk: item.name?.mk || '',
            nameSq: item.name?.sq || '',
            image: item.image || ''
        });
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            price: parseFloat(formData.price),
            name: {
                en: formData.nameEn,
                mk: formData.nameMk,
                sq: formData.nameSq
            },
            image: formData.image
        });
    };
    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Price</label>
                <input className="admin-input" type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Name (English)</label>
                <input className="admin-input" name="nameEn" value={formData.nameEn} onChange={handleChange} placeholder="Burger..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Name (MK)</label>
                    <input className="admin-input" name="nameMk" value={formData.nameMk} onChange={handleChange} placeholder="..." />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Name (SQ)</label>
                    <input className="admin-input" name="nameSq" value={formData.nameSq} onChange={handleChange} placeholder="..." />
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Image URL</label>
                <input className="admin-input" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', color: 'var(--color-ink)' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'var(--color-on-primary)', cursor: 'pointer', fontWeight: 600 }}>{isNew ? 'Create Item' : 'Save Changes'}</button>
            </div>
        </form>
    );
};

export const AdminDashboard = () => {
    const { restaurants } = usePlatform();
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const [view, setView] = useState('restaurants');

    // Derive object from ID so it updates when Context updates
    const selectedRestaurant = restaurants.find(r => r.id === selectedRestaurantId);

    const handleBack = selectedRestaurantId ? () => setSelectedRestaurantId(null) : null;

    return (
        <AdminLayout
            onBack={handleBack}
            view={view}
            setView={setView}
        >
            {selectedRestaurant ? (
                <MenuEditor restaurant={selectedRestaurant} />
            ) : view === 'orders' ? (
                <OrdersDashboard />
            ) : (
                <RestaurantList onSelect={setSelectedRestaurantId} />
            )}
        </AdminLayout>
    );
};
