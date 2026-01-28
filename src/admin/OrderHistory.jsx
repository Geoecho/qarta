import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Filter, Archive } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import './OrderHistory.css';
import { usePlatform } from '../contexts/MenuContext';

const TRANSLATIONS = {
    en: {
        title: 'Order History',
        searchPlaceholder: 'Search by ID or Table...',
        all: 'All',
        completed: 'Completed',
        rejected: 'Declined',
        cancelled: 'Canceled',
        noOrders: 'No past orders found',
        total: 'Total',
        items: 'items'
    },
    mk: {
        title: 'Историја на нарачки',
        searchPlaceholder: 'Пребарај по Бр. или Маса...',
        all: 'Сите',
        completed: 'Завршени',
        rejected: 'Одбиени',
        cancelled: 'Откажани',
        noOrders: 'Нема пронајдено нарачки',
        total: 'Вкупно',
        items: 'артикли'
    },
    sq: {
        title: 'Historiku i Porosive',
        searchPlaceholder: 'Kërko sipas Nr. ose Tavolinës...',
        all: 'Të gjitha',
        completed: 'Të përfunduara',
        rejected: 'Të refuzuara',
        cancelled: 'Të anuluara',
        noOrders: 'Nuk u gjetën porosi',
        total: 'Totali',
        items: 'artikuj'
    }
};

const OrderHistory = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const [lang, setLang] = useState(() => localStorage.getItem('qarta_lang') || 'en');
    const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

    useEffect(() => {
        fetchHistory();
    }, [slug]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Fetch last 100 orders that are 'done'
            // We consider done as: completed, rejected, cancelled OR archived=true
            // To keep query simple for now, we'll fetch based on status and then sort/filter locally if needed
            // Ideally should be a compound query but let's try to get all relevant statuses

            const q = query(
                collection(db, 'orders'),
                where('restaurantSlug', '==', slug),
                where('status', 'in', ['completed', 'rejected', 'cancelled']),
                orderBy('updatedAt', 'desc'),
                limit(100)
            );

            const snapshot = await getDocs(q);
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(fetched);
        } catch (err) {
            console.error("Error fetching history:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(o => {
        // Status Filter
        if (filter !== 'all' && o.status !== filter) return false;

        // Search Filter
        if (search) {
            const s = search.toLowerCase();
            const idMatch = o.id.toLowerCase().includes(s);
            const tableMatch = o.tableId && o.tableId.toString().toLowerCase().includes(s);
            return idMatch || tableMatch;
        }
        return true;
    });

    const formatDate = (iso) => {
        if (!iso) return '';
        return new Date(iso).toLocaleString(lang === 'mk' ? 'mk-MK' : (lang === 'sq' ? 'sq-AL' : 'en-US'), {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getName = (nameObj) => {
        if (!nameObj) return 'Unknown';
        if (typeof nameObj === 'string') return nameObj;
        return nameObj[lang] || nameObj.en || Object.values(nameObj)[0] || 'Unknown';
    };

    return (
        <div className="oh-container">
            <header className="oh-header">
                <div className="oh-brand">
                    <button onClick={() => navigate(-1)} className="oh-back-btn">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="oh-title">
                        <h1>{t.title}</h1>
                    </div>
                </div>

                <div className="oh-controls">
                    <div className="oh-search-wrap">
                        <Search className="oh-search-icon" size={16} />
                        <input
                            type="text"
                            className="oh-search-input"
                            placeholder={t.searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="oh-content">
                <div className="oh-filters">
                    {[
                        { id: 'all', label: t.all },
                        { id: 'completed', label: t.completed },
                        { id: 'rejected', label: t.rejected },
                        { id: 'cancelled', label: t.cancelled }
                    ].map(f => (
                        <button
                            key={f.id}
                            className={`oh-filter-btn ${filter === f.id ? 'active' : ''}`}
                            onClick={() => setFilter(f.id)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="oh-list">
                    {loading ? (
                        <div className="oh-empty">Loading...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="oh-empty">
                            <Archive size={48} opacity={0.2} style={{ margin: '0 auto 16px' }} />
                            <p>{t.noOrders}</p>
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <div key={order.id} className={`oh-card ${order.status}`}>
                                <div className="oh-card-main">
                                    <div className="oh-card-header">
                                        <span className="oh-id">#{order.id.slice(-4)}</span>
                                        <div className="oh-date">
                                            <Calendar size={12} />
                                            {formatDate(order.updatedAt || order.createdAt)}
                                        </div>
                                        {order.tableId && (
                                            <span style={{
                                                fontSize: '12px',
                                                background: 'var(--bg-subtle)',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontWeight: 600
                                            }}>
                                                T{order.tableId}
                                            </span>
                                        )}
                                    </div>
                                    <div className="oh-items">
                                        {order.items.map(i => `${i.quantity}x ${getName(i.name)}`).join(', ')}
                                    </div>
                                    {(order.rejectionReason) && (
                                        <div style={{ fontSize: '12px', color: '#ef4444', fontStyle: 'italic' }}>
                                            "{order.rejectionReason}"
                                        </div>
                                    )}
                                </div>

                                <div className="oh-card-meta">
                                    <div className="oh-total">
                                        €{(order.total || 0).toFixed(2)}
                                    </div>
                                    <div className={`oh-status ${order.status}`}>
                                        {t[order.status] || order.status}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
