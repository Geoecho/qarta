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
            onBack={view !== 'restaurants' ? () => setView('restaurants') : null}
        >
            {view === 'restaurants' && (
                <RestaurantList onSelect={(id) => {
                    setSelectedRestaurantId(id);
                    setView('menu-editor');
                }} />
            )}

            {view === 'menu-editor' && selectedRestaurant && (
                <MenuEditor restaurant={selectedRestaurant} />
            )}
        </AdminLayout>
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
    const { updateMenuItem, addMenuItem, updateRestaurantDetails, deleteMenuItem, addCategory, updateCategory, deleteCategory, addSection, updateSection, deleteSection } = usePlatform();
    const [editingItem, setEditingItem] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSection, setEditingSection] = useState(null);
    const [activeTab, setActiveTab] = useState('menu');
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showSectionForm, setShowSectionForm] = useState(null);

    const [draftValues, setDraftValues] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

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

    useEffect(() => {
        if (!hasChanges) return;

        const timer = setTimeout(async () => {
            try {
                await updateRestaurantDetails(restaurant.id, draftValues);
                setHasChanges(false);
            } catch (error) {
                console.error('Auto-save failed:', error);
            }
        }, 1000);

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
                <h1 style={{ margin: '0 0 8px 0', fontSize: '36px', fontWeight: 800 }}>{restaurant.name}</h1>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                    Editing /{restaurant.slug}
                </p>

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
                                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
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

                    {/* Category Form Modal */}
                    <AnimatePresence>
                        {showCategoryForm && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    onClick={() => setShowCategoryForm(false)}
                                    className="modal-overlay"
                                />
                                <motion.div
                                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                    className="modal-content"
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
                                    className="modal-overlay"
                                />
                                <motion.div
                                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                    className="modal-content"
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

                    {/* Edit Category Modal */}
                    <AnimatePresence>
                        {editingCategory && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    onClick={() => setEditingCategory(null)}
                                    className="modal-overlay"
                                />
                                <motion.div
                                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                    className="modal-content"
                                >
                                    <h2 style={{ marginTop: 0 }}>Edit Category</h2>
                                    <CategoryForm
                                        initialData={editingCategory}
                                        onSave={(data) => {
                                            updateCategory(restaurant.id, editingCategory.id, data);
                                            setEditingCategory(null);
                                        }}
                                        onCancel={() => setEditingCategory(null)}
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Edit Section Modal */}
                    <AnimatePresence>
                        {editingSection && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    onClick={() => setEditingSection(null)}
                                    className="modal-overlay"
                                />
                                <motion.div
                                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                    className="modal-content"
                                >
                                    <h2 style={{ marginTop: 0 }}>Edit Section</h2>
                                    <SectionForm
                                        initialData={editingSection.section}
                                        onSave={(data) => {
                                            updateSection(restaurant.id, editingSection.categoryId, editingSection.section.id, data);
                                            setEditingSection(null);
                                        }}
                                        onCancel={() => setEditingSection(null)}
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {restaurant.menu.length === 0 && (
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
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
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

            {activeTab === 'settings' && (
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
            )}
        </div>
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
        filterId: item?.filterId || '' // Sub-category ID
    });

    // Cloudinary Upload Logic
    const handleImageUpload = (url) => {
        setFormData(prev => ({ ...prev, image: url }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        onSave({
            name: { en: formData.nameEn, mk: formData.nameMk, sq: formData.nameSq },
            desc: { en: formData.descEn, mk: formData.descMk, sq: formData.descSq },
            price: Number(formData.price),
            image: formData.image,
            filterId: formData.filterId
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
