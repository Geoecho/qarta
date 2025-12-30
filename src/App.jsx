import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { OrderProvider, useOrder } from './contexts/OrderContext';
import { MenuProvider, usePlatform } from './contexts/MenuContext';
import BrandHeader from './components/BrandHeader';
import CategoryNav from './components/CategoryNav';
import MenuAccordion from './components/MenuAccordion';
import OrderModal from './components/OrderModal';
import PromoPopup from './components/PromoPopup';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import { ShoppingBag } from 'lucide-react';
import { AdminDashboard } from './admin/AdminDashboard';
import Login from './admin/Login';
import CafeOrdersDashboard from './admin/CafeOrdersDashboard';
import LandingPage from './landing/LandingPage';
import RemainingTime from './components/RemainingTime';

import InfoPage from './components/InfoPage';
import MenuItem from './components/MenuItem';

/* 
   Protected Route Component 
*/
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

/* 
   Main Client App (Home)
*/
const ClientApp = () => {
  const { slug } = useParams(); // Get restaurant slug from URL
  const { getRestaurantBySlug, loading } = usePlatform();
  const restaurant = getRestaurantBySlug(slug);
  const menuData = restaurant ? restaurant.menu : [];

  const [activeTab, setActiveTab] = useState(null); // Top Level
  const [openSectionId, setOpenSectionId] = useState(null); // Accordion state
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  // Theme Default Mode Logic
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('qarta_theme');
    return saved ? JSON.parse(saved) : true;
  });

  // Track if we've initialized the default mode from the restaurant settings
  const hasInitializedTheme = React.useRef(false);

  // Update theme when restaurant data loads - BUT only if user hasn't set a preference
  useEffect(() => {
    if (restaurant?.theme?.defaultMode && !hasInitializedTheme.current) {
      const saved = localStorage.getItem('qarta_theme');
      if (saved === null) {
        // Only apply default if no user preference exists
        setIsDark(restaurant.theme.defaultMode === 'dark');
      }
      hasInitializedTheme.current = true;
    }
  }, [restaurant]);

  // Persist theme changes
  useEffect(() => {
    localStorage.setItem('qarta_theme', JSON.stringify(isDark));
  }, [isDark]);

  const [language, setLanguage] = useState('en'); // 'en' | 'mk' | 'sq'
  const [searchQuery, setSearchQuery] = useState('');

  const { addToCart, totalCount, orderStatus, activeOrder, loadOrderForRestaurant } = useOrder();

  // Load active order for this restaurant
  useEffect(() => {
    loadOrderForRestaurant(slug);
  }, [slug, loadOrderForRestaurant]);

  // Set activeTab when menu loads
  React.useEffect(() => {
    if (menuData.length > 0 && !activeTab) {
      setActiveTab(menuData[0].id);
    }
  }, [menuData, activeTab]);

  // Auto-close search results when a section is opened
  useEffect(() => {
    if (openSectionId) {
      setSearchQuery('');
    }
  }, [openSectionId]);

  const currentData = menuData.find(d => d.id === activeTab) || menuData[0] || null;

  // Global Search Logic (Flat list of all matching items)
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();

    const results = [];

    menuData.forEach(category => {
      const categoryNameMatch = Object.values(category.label || {}).some(name =>
        name && typeof name === 'string' && name.toLowerCase().includes(query)
      );

      (category.sections || []).forEach(section => {
        const sectionNameMatch = Object.values(section.title || {}).some(title =>
          title && typeof title === 'string' && title.toLowerCase().includes(query)
        );

        (section.items || []).forEach(item => {
          if (!item) return;

          const nameMatch = Object.values(item.name || {}).some(name =>
            name && typeof name === 'string' && name.toLowerCase().includes(query)
          );
          const descMatch = Object.values(item.desc || item.description || {}).some(desc =>
            desc && typeof desc === 'string' && desc.toLowerCase().includes(query)
          );

          // Include item if it matches directly OR if its category/section matches
          if (nameMatch || descMatch || categoryNameMatch || sectionNameMatch) {
            results.push(item);
          }
        });
      });
    });

    return results;
  }, [searchQuery, menuData]);

  // Determine if FAB is visible to offset search bar
  const showTrackFab = orderStatus === 'confirmed';
  const showCartFab = orderStatus === 'idle' && totalCount > 0;
  const isFabVisible = showTrackFab || showCartFab;
  const searchBottomOffset = isFabVisible ? 100 : 24;

  // Translations for floating buttons
  const t = {
    viewOrder: { en: 'View Order', mk: 'Види Нарачка', sq: 'Shiko Porosinë' },
    remaining: { en: 'remaining', mk: 'преостанато', sq: 'të mbetura' },
    waiting: { en: 'Waiting for confirmation...', mk: 'Чекаме потврда...', sq: 'Duke pritur...' },
    ready: { en: 'Ready for pickup!', mk: 'Готово за подигање!', sq: 'Gati për t\'u marrë!' },
    declined: { en: 'Order declined', mk: 'Нарачката е одбиена', sq: 'Porosia u refuzua' }
  };

  // Handle Dark Mode Class on Body/HTML and Meta Theme Color
  useEffect(() => {
    const root = document.documentElement;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const theme = restaurant?.theme || {};

    if (isDark) {
      root.classList.add('dark');

      // Apply Dark Mode Custom Theme
      const darkVars = {
        // Premium Dark Mode Defaults (Matches index.css)
        '--bg-app': theme.darkBackground || '#050505',
        '--bg-surface': theme.darkSurface || '#121212',
        '--color-ink': theme.darkText || '#E0E6ED',
        '--color-text-subtle': theme.darkTextMuted || '#9DA5B4',
        '--border-color': theme.darkBorder || 'rgba(255, 255, 255, 0.1)',
        '--overlay-bg': theme.darkOverlay || 'rgba(0,0,0,0.8)',

        // New Buttons & Icons (Default to Surface Secondary #1E1E1E)
        '--bg-header-control': theme.darkHeaderControlBg || '#1E1E1E',
        '--color-header-icon': theme.darkHeaderControlIcon || '#E0E6ED',
        '--bg-menu-icon': theme.darkMenuIconBg || 'transparent',
        '--color-menu-icon': theme.darkMenuIconColor || '#E0E6ED',

        // Menu Item Styling
        '--color-item-title': theme.darkItemTitleColor || '#E0E6ED',
        '--color-item-price': theme.darkItemPriceColor || (theme.darkPrimary || theme.primary || '#38bdf8'),
        '--color-item-desc': theme.darkItemDescColor || '#9DA5B4',
        '--bg-item-btn': theme.darkItemBtnBg || (theme.darkPrimary || theme.primary || '#38bdf8'),
        '--color-item-btn-icon': theme.darkItemBtnIcon || '#050505' // Dark text on bright button
      };

      Object.entries(darkVars).forEach(([key, val]) => {
        root.style.setProperty(key, val);
      });
      if (themeMeta) themeMeta.content = darkVars['--bg-app'];
      document.body.style.backgroundColor = darkVars['--bg-app'];

    } else {
      root.classList.remove('dark');

      // Apply Light Mode Custom Theme
      const lightVars = {
        '--bg-app': theme.background || '#F5F5F7',
        '--bg-surface': theme.surface || '#FFFFFF',
        '--color-ink': theme.text || '#1D1D1F',
        '--color-text-subtle': theme.textMuted || '#86868B',
        '--border-color': theme.border || 'rgba(0, 0, 0, 0.08)',
        '--overlay-bg': theme.overlay || 'rgba(0,0,0,0.5)',

        // New Buttons & Icons
        '--bg-header-control': theme.headerControlBg || '#F0F0F2', // Default to surface-secondary
        '--color-header-icon': theme.headerControlIcon || '#1D1D1F', // Default to ink
        '--bg-menu-icon': theme.menuIconBg || 'transparent',
        '--color-menu-icon': theme.menuIconColor || '#1D1D1F',

        // Menu Item Styling
        '--color-item-title': theme.itemTitleColor || '#1D1D1F',
        '--color-item-price': theme.itemPriceColor || (theme.primary || '#0ea5e9'),
        '--color-item-desc': theme.itemDescColor || '#86868B',
        '--bg-item-btn': theme.itemBtnBg || (theme.primary || '#0ea5e9'),
        '--color-item-btn-icon': theme.itemBtnIcon || '#FFFFFF'
      };

      Object.entries(lightVars).forEach(([key, val]) => {
        root.style.setProperty(key, val);
      });
      if (themeMeta) themeMeta.content = lightVars['--bg-app'];
      document.body.style.backgroundColor = lightVars['--bg-app'];
    }

    // Always apply Brand Primary Color
    // Priority: Dark Primary (if dark mode) > Global Primary > Default
    const effectivePrimary = (isDark && theme.darkPrimary) ? theme.darkPrimary : theme.primary;

    if (effectivePrimary) {
      root.style.setProperty('--color-primary', effectivePrimary);
    } else {
      root.style.removeProperty('--color-primary');
    }

    // Cleanup function
    return () => {
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--bg-app');
      root.style.removeProperty('--bg-surface');
      document.body.style.removeProperty('background-color');
    };
  }, [isDark, restaurant]);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>Loading...</div>
    </div>
  );

  if (!restaurant) return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '24px',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '64px' }}>🍽️</div>
      <div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Restaurant Not Found</h1>
        <p style={{ margin: 0, color: '#666' }}>
          The handle <strong>/{slug || 'default'}</strong> doesn't exist yet.
        </p>
      </div>
      <a
        href="/admin"
        style={{
          padding: '12px 24px',
          background: '#0ea5e9',
          color: 'white',
          borderRadius: '100px',
          textDecoration: 'none',
          fontWeight: 600
        }}
      >
        Create in Admin Panel
      </a>
    </div>
  );

  return (
    <div className={isDark ? 'dark' : ''}>
      {/* Promotion Popup */}
      <PromoPopup promotion={restaurant.promotion} />

      <div style={{
        width: '100%',
        minHeight: '100vh',
        maxWidth: '480px',
        margin: '0 auto',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--color-ink)',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '200px', // Increased heavily to avoid fab/search overlap
        boxShadow: '0 0 50px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.3s'
      }}>
        <BrandHeader
          isDark={isDark}
          toggleTheme={() => setIsDark(!isDark)}
          language={language}
          setLanguage={setLanguage}
          logoUrl={restaurant.logo}
        />

        {/* Restaurant Name Header (Optional) */}
        {restaurant.slug !== 'default' && (
          <div style={{ padding: '0 24px', marginBottom: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{restaurant.name}</h2>
          </div>
        )}

        {/* Top Level Visual Navigation */}
        <CategoryNav
          categories={menuData}
          activeCategory={activeTab}
          onSelect={setActiveTab}
          language={language}
        />

        {/* Detailed Accordion Sections */}
        <div style={{ padding: '0 var(--space-3)', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
          {menuData.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '64px 24px',
              color: 'var(--color-text-subtle)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 style={{ margin: '0 0 8px 0' }}>Menu Coming Soon</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>
                This restaurant is still setting up their menu.
              </p>
            </div>
          ) : currentData && currentData.sections.map((section) => (
            <MenuAccordion
              key={section.id}
              section={section}
              isOpen={openSectionId === section.id}
              onToggle={() => setOpenSectionId(prev => prev === section.id ? null : section.id)}
              onAddToCart={addToCart}
              language={language}
            />
          ))}
        </div>



        {/* Floating Action Button (Cart OR Track) */}
        <AnimatePresence>
          {/* Case 1: Active Order (Tracking) */}
          {orderStatus === 'confirmed' && (
            <motion.div
              key="track-fab"
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
              onClick={() => setIsOrderOpen(true)}
              style={{
                position: 'fixed',
                bottom: '32px',
                left: '50%',
                x: '-50%',
                zIndex: 100,
                cursor: 'pointer',
                width: 'calc(100% - 48px)', // Full width minus margin
                maxWidth: '432px'
              }}
            >
              <div style={{
                backgroundColor: 'var(--color-ink)', // Dark for tracking
                color: 'var(--bg-app)',
                padding: '16px 24px',
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                width: '100%',
                whiteSpace: 'nowrap'
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: activeOrder?.status === 'rejected' ? '#ef4444' : '#22c55e',
                  boxShadow: activeOrder?.status === 'rejected' ? '0 0 10px #ef4444' : '0 0 10px #22c55e'
                }} />
                <span style={{ fontWeight: 600, fontSize: '14px' }}>
                  {activeOrder?.status === 'placed' && t.waiting[language]}
                  {activeOrder?.status === 'accepted' && (
                    <RemainingTime
                      activeOrder={activeOrder}
                      t={t}
                      language={language}
                    />
                  )}
                  {activeOrder?.status === 'completed' && t.ready[language]}
                  {activeOrder?.status === 'rejected' && t.declined[language]}
                </span>
              </div>
            </motion.div>
          )}

          {/* Case 2: No Order, but items in cart */}
          {orderStatus === 'idle' && totalCount > 0 && (
            <motion.div
              key="cart-fab"
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOrderOpen(true)}
              style={{
                position: 'fixed',
                bottom: '32px',
                left: '50%',
                x: '-50%',
                zIndex: 100,
                width: 'calc(100% - 48px)',
                maxWidth: '432px'
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                key={totalCount}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  padding: '16px 24px',
                  borderRadius: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  cursor: 'pointer',
                  width: '100%',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    key={`bag-${totalCount}`}
                  >
                    <ShoppingBag size={20} />
                  </motion.div>
                  <span style={{ fontWeight: 600 }}>{t["viewOrder"][language]}</span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.3 }}
                  key={`count-${totalCount}`}
                  style={{
                    background: 'var(--bg-surface)',
                    color: 'var(--color-ink)',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}
                >
                  {totalCount}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Backdrop (Click outside to close) */}
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchQuery('')}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.3)',
                zIndex: 93, // Above CategoryNav (90), below SearchBar/Results (96+)
                backdropFilter: 'blur(4px)' // Increased blur
              }}
            />
          )}
        </AnimatePresence>

        {/* Search Results Overlay */}
        <AnimatePresence>
          {searchQuery && (
            <SearchResults
              results={searchResults}
              onAdd={addToCart}
              language={language}
              bottomOffset={searchBottomOffset}
            />
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          language={language}
          bottomOffset={searchBottomOffset}
        />

        <OrderModal
          isOpen={isOrderOpen}
          onClose={() => setIsOrderOpen(false)}
          language={language}
          restaurantSlug={slug || 'default'}
        />
      </div>
    </div>
  );
};

/* 
   App Routing 
*/
const App = () => {
  return (
    <Router>
      <MenuProvider>
        <OrderProvider>
          <Routes>
            {/* Landing Page at Root */}
            <Route path="/" element={<LandingPage />} />

            {/* Admin Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } />

            {/* Client Routes */}
            <Route path="/:slug" element={<ClientApp />} />
            <Route path="/:slug/info" element={<InfoPage />} />
            <Route path="/:slug/orders" element={<CafeOrdersDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </OrderProvider>
      </MenuProvider>
    </Router>
  );
};

export default App;
