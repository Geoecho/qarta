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

const StatusBadge = () => {
    const { saveStatus, serverError } = usePlatform();

    if (saveStatus === 'idle') return null;

    let bg = '#f3f4f6';
    let color = '#374151';
    let text = 'Ready';

    if (saveStatus === 'saving') {
        bg = '#bfdbfe'; color = '#1e3a8a'; text = 'Saving...';
    } else if (saveStatus === 'success') {
        bg = '#bbf7d0'; color = '#14532d'; text = 'Saved!';
    } else if (saveStatus === 'error') {
        bg = '#fecaca'; color = '#7f1d1d'; text = 'Error!';
    }

    return (
        <div style={{
            margin: '0 0 16px 0',
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: bg,
            color: color,
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
            <div style={{ flex: 1 }}>{text}</div>
            {serverError && <div style={{ fontSize: 10 }}>{serverError.slice(0, 10)}...</div>}
        </div>
    );
};

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
                        <input className="admin-input" placeholder="Slug (URL path, e.g. 'netaville')" value={newRes.slug} onChange={e => setNewRes({ ...newRes, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} required />
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-subtle)', marginBottom: '16px' }}>
                        Your restaurant will be available at: <strong>qarta.xyz/{newRes.slug || 'your-slug'}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Create</button>
                        <button type="button" onClick={() => setIsAddMode(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', color: 'var(--color-ink)' }}>Cancel</button>
                    </div>
                </form>
            )}

            {!isAddMode && restaurants.length === 0 && (
                <div className="admin-card" style={{ padding: '64px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏪</div>
                    <h3 style={{ margin: '0 0 8px 0' }}>No Restaurants Yet</h3>
                    <p style={{ margin: '0 0 24px 0', color: 'var(--color-text-subtle)' }}>
                        Create your first restaurant to get started.
                    </p>
                    <button
                        onClick={() => setIsAddMode(true)}
                        style={{
                            backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
                            border: 'none', padding: '12px 24px', borderRadius: '100px',
                            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <Plus size={20} />
                        Create First Restaurant
                    </button>
                </div>
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

const CategoryForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        id: '',
        nameEn: '',
        nameMk: '',
        nameSq: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: formData.id || `cat-${Date.now()}`,
            label: {
                en: formData.nameEn,
                mk: formData.nameMk,
                sq: formData.nameSq
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>ID (optional, auto-generated)</label>
                <input className="admin-input" name="id" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} placeholder="drinks" />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Name (English) *</label>
                <input className="admin-input" name="nameEn" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} placeholder="Drinks" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Name (MK)</label>
                    <input className="admin-input" name="nameMk" value={formData.nameMk} onChange={(e) => setFormData({ ...formData, nameMk: e.target.value })} placeholder="Пијалоци" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Name (SQ)</label>
                    <input className="admin-input" name="nameSq" value={formData.nameSq} onChange={(e) => setFormData({ ...formData, nameSq: e.target.value })} placeholder="Pije" />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', color: 'var(--color-ink)' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'var(--color-on-primary)', cursor: 'pointer', fontWeight: 600 }}>Create Category</button>
            </div>
        </form>
    );
};

const SectionForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        id: '',
        nameEn: '',
        nameMk: '',
        nameSq: '',
        filters: [] // Sub-categories like Red/White for Wine
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
            filters: formData.filters.filter(f => f.labelEn).map(f => ({
                id: f.id || f.labelEn.toLowerCase().replace(/\s+/g, '-'),
                label: {
                    en: f.labelEn,
                    mk: f.labelMk || f.labelEn,
                    sq: f.labelSq || f.labelEn
                }
            })),
            items: []
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>ID (optional, auto-generated)</label>
                <input className="admin-input" name="id" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} placeholder="wine" />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Name (English) *</label>
                <input className="admin-input" name="nameEn" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} placeholder="Wine" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Name (MK)</label>
                    <input className="admin-input" name="nameMk" value={formData.nameMk} onChange={(e) => setFormData({ ...formData, nameMk: e.target.value })} placeholder="Вино" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Name (SQ)</label>
                    <input className="admin-input" name="nameSq" value={formData.nameSq} onChange={(e) => setFormData({ ...formData, nameSq: e.target.value })} placeholder="Verë" />
                </div>
            </div>

            {/* Sub-Categories (Filters) */}
            <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-surface-secondary)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600 }}>Sub-Categories (e.g., Red, White)</label>
                    <button type="button" onClick={addFilter} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        + Add
                    </button>
                </div>
                {formData.filters.map((filter, index) => (
                    <div key={index} style={{ marginBottom: '12px', padding: '12px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
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
                                style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <input
                                className="admin-input"
                                placeholder="MK"
                                value={filter.labelMk}
                                onChange={(e) => updateFilter(index, 'labelMk', e.target.value)}
                                style={{ fontSize: '12px' }}
                            />
                            <input
                                className="admin-input"
                                placeholder="SQ"
                                value={filter.labelSq}
                                onChange={(e) => updateFilter(index, 'labelSq', e.target.value)}
                                style={{ fontSize: '12px' }}
                            />
                        </div>
                    </div>
                ))}
                {formData.filters.length === 0 && (
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-subtle)', textAlign: 'center' }}>
                        No sub-categories yet. Click "+ Add" to create filters.
                    </p>
                )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', color: 'var(--color-ink)' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'var(--color-on-primary)', cursor: 'pointer', fontWeight: 600 }}>Create Section</button>
            </div>
        </form>
    );
};

const MenuEditor = ({ restaurant }) => {
    const { updateMenuItem, addMenuItem, updateRestaurantDetails, deleteMenuItem, addCategory, deleteCategory, addSection, deleteSection } = usePlatform();
    const [editingItem, setEditingItem] = useState(null); // { categoryId, sectionId, item, isNew: boolean }
    const [activeTab, setActiveTab] = useState('menu');
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showSectionForm, setShowSectionForm] = useState(null); // categoryId when showing form

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
                                        width: '90%', maxWidth: '600px', maxHeight: '85vh',
                                        background: 'var(--bg-surface)',
                                        padding: '24px', borderRadius: '24px', zIndex: 1001,
                                        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', color: 'var(--color-ink)',
                                        overflowY: 'auto'
                                    }}
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

                    {/* Category Form Modal */}
                    <AnimatePresence>
                        {showCategoryForm && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    onClick={() => setShowCategoryForm(false)}
                                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                    style={{
                                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                        width: '90%', maxWidth: '500px', maxHeight: '85vh',
                                        background: 'var(--bg-surface)',
                                        padding: '24px', borderRadius: '24px', zIndex: 1001,
                                        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', color: 'var(--color-ink)',
                                        overflowY: 'auto'
                                    }}
                                >
                                    <h2 style={{ marginTop: 0 }}>New Category</h2>
                                    <CategoryForm
                                        onSave={(data) => {
                                            addCategory(restaurant.id, data);
                                            setShowCategoryForm(false);
                                        }}
                                        onCancel={() => setShowCategoryForm(false)}
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Section Form Modal */}
                    <AnimatePresence>
                        {showSectionForm && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    onClick={() => setShowSectionForm(null)}
                                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                    style={{
                                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                        width: '90%', maxWidth: '500px', maxHeight: '85vh',
                                        background: 'var(--bg-surface)',
                                        padding: '24px', borderRadius: '24px', zIndex: 1001,
                                        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', color: 'var(--color-ink)',
                                        overflowY: 'auto'
                                    }}
                                >
                                    <h2 style={{ marginTop: 0 }}>New Section</h2>
                                    <SectionForm
                                        onSave={(data) => {
                                            addSection(restaurant.id, showSectionForm, data);
                                            setShowSectionForm(null);
                                        }}
                                        onCancel={() => setShowSectionForm(null)}
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {restaurant.menu.length === 0 && (
                        <div className="admin-card" style={{ padding: '64px 24px', textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                            <h3 style={{ margin: '0 0 8px 0' }}>Empty Menu</h3>
                            <p style={{ margin: '0 0 24px 0', color: 'var(--color-text-subtle)' }}>
                                Start building your menu by creating a category (e.g., "Drinks", "Food").
                            </p>
                            <button
                                onClick={() => setShowCategoryForm(true)}
                                style={{
                                    backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
                                    border: 'none', padding: '12px 24px', borderRadius: '100px',
                                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                    display: 'inline-flex', alignItems: 'center', gap: '8px'
                                }}
                            >
                                <Plus size={20} />
                                Create First Category
                            </button>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {restaurant.menu.map(category => (
                            <div key={category.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h2 style={{ fontSize: '20px', margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', flex: 1 }}>{category.label.en}</h2>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => setShowSectionForm(category.id)}
                                            style={{ padding: '6px 12px', borderRadius: '100px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            <Plus size={14} /> Add Section
                                        </button>
                                        <button
                                            onClick={() => { if (confirm('Delete category?')) deleteCategory(restaurant.id, category.id) }}
                                            style={{ padding: '6px', borderRadius: '50%', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gap: '24px' }}>
                                    {category.sections.map(section => (
                                        <div key={section.id} className="admin-card" style={{ marginBottom: 0, padding: 0, overflow: 'hidden' }}>
                                            <div style={{ padding: '16px 20px', background: 'var(--bg-surface-secondary)', borderBottom: '1px solid var(--border-color)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span>{section.title.en}</span>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => setEditingItem({ categoryId: category.id, sectionId: section.id, item: { name: {}, price: 0 }, isNew: true })}
                                                        style={{ border: 'none', background: 'var(--color-primary)', color: 'white', borderRadius: '100px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                    >
                                                        <Plus size={14} /> Add Item
                                                    </button>
                                                    <button
                                                        onClick={() => { if (confirm('Delete section "' + section.title.en + '"?')) deleteSection(restaurant.id, category.id, section.id) }}
                                                        style={{ padding: '6px', borderRadius: '50%', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
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
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button onClick={() => setEditingItem({ categoryId: category.id, sectionId: section.id, item, isNew: false })} style={{ padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-ink)' }}>
                                                                <Edit2 size={14} /> Edit
                                                            </button>
                                                            <button
                                                                onClick={() => { if (confirm("Delete item?")) deleteMenuItem(restaurant.id, category.id, section.id, item.id) }}
                                                                style={{ padding: '8px', borderRadius: '50%', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
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

                        {/* Add Category Button (shows when categories exist) */}
                        {restaurant.menu.length > 0 && (
                            <button
                                onClick={() => setShowCategoryForm(true)}
                                style={{
                                    padding: '12px 24px', borderRadius: '100px',
                                    border: '2px dashed var(--border-color)', background: 'transparent',
                                    cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    justifyContent: 'center', color: 'var(--color-text-subtle)',
                                    transition: 'all 0.2s', width: '100%'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                    e.currentTarget.style.color = 'var(--color-primary)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                    e.currentTarget.style.color = 'var(--color-text-subtle)';
                                }}
                            >
                                <Plus size={20} />
                                Add Another Category
                            </button>
                        )}
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

const EditItemForm = ({ item, section, onSave, onCancel, isNew }) => {
    // Should initialize with default values if new, or item values if editing.
    const [formData, setFormData] = useState({
        price: item.price || 0,
        nameEn: item.name?.en || '',
        nameMk: item.name?.mk || '',
        nameSq: item.name?.sq || '',
        descEn: item.desc?.en || item.description?.en || '',
        descMk: item.desc?.mk || item.description?.mk || '',
        descSq: item.desc?.sq || item.description?.sq || '',
        image: item.image || '',
        tag: item.tag || '' // Sub-category tag
    });

    useEffect(() => {
        setFormData({
            price: item.price || 0,
            nameEn: item.name?.en || '',
            nameMk: item.name?.mk || '',
            nameSq: item.name?.sq || '',
            descEn: item.desc?.en || item.description?.en || '',
            descMk: item.desc?.mk || item.description?.mk || '',
            descSq: item.desc?.sq || item.description?.sq || '',
            image: item.image || '',
            tag: item.tag || ''
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
            desc: {
                en: formData.descEn,
                mk: formData.descMk,
                sq: formData.descSq
            },
            image: formData.image,
            tag: formData.tag || undefined // Only include if set
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
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Description (English)</label>
                <textarea className="admin-input" name="descEn" value={formData.descEn || ''} onChange={handleChange} placeholder="Describe what's in this item..." rows="2" style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Description (MK)</label>
                    <textarea className="admin-input" name="descMk" value={formData.descMk || ''} onChange={handleChange} placeholder="..." rows="2" style={{ resize: 'vertical' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Description (SQ)</label>
                    <textarea className="admin-input" name="descSq" value={formData.descSq || ''} onChange={handleChange} placeholder="..." rows="2" style={{ resize: 'vertical' }} />
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Image URL</label>
                <input className="admin-input" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
            </div>

            {/* Sub-Category Tag Selector */}
            {section?.filters && section.filters.length > 0 && (
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Sub-Category</label>
                    <select
                        className="admin-input"
                        name="tag"
                        value={formData.tag}
                        onChange={handleChange}
                        style={{ cursor: 'pointer' }}
                    >
                        <option value="">All (No filter)</option>
                        {section.filters.map(filter => (
                            <option key={filter.id} value={filter.id}>
                                {filter.label.en}
                            </option>
                        ))}
                    </select>
                    <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                        Assign this item to a sub-category (e.g., Red wine, White wine)
                    </p>
                </div>
            )}

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
