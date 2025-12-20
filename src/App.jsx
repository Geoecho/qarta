import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { OrderProvider, useOrder } from './contexts/OrderContext';
import { MenuProvider, usePlatform } from './contexts/MenuContext';
import BrandHeader from './components/BrandHeader';
import CategoryNav from './components/CategoryNav';
import MenuAccordion from './components/MenuAccordion';
import OrderModal from './components/OrderModal';
import PromoPopup from './components/PromoPopup';
import { ShoppingBag } from 'lucide-react';
import { AdminDashboard } from './admin/AdminDashboard';
import Login from './admin/Login';

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

  const [activeTab, setActiveTab] = useState('drinks'); // Top Level
  const [openSectionId, setOpenSectionId] = useState(null); // Accordion state
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'mk' | 'sq'

  const { addToCart, totalCount, orderStatus, activeOrder } = useOrder();

  const currentData = menuData.find(d => d.id === activeTab) || menuData[0];

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

      // Apply Dark Mode Custom Theme if exists
      if (theme.darkBackground) {
        root.style.setProperty('--bg-app', theme.darkBackground);
        if (themeMeta) themeMeta.content = theme.darkBackground;
      } else {
        root.style.removeProperty('--bg-app');
        if (themeMeta) themeMeta.content = '#09090b';
      }

      if (theme.darkSurface) {
        root.style.setProperty('--bg-surface', theme.darkSurface);
      } else {
        root.style.removeProperty('--bg-surface');
      }

    } else {
      root.classList.remove('dark');

      // Apply Light Mode Custom Theme
      if (theme.background) {
        root.style.setProperty('--bg-app', theme.background);
        if (themeMeta) themeMeta.content = theme.background;
      } else {
        // Default Light Background
        root.style.removeProperty('--bg-app');
        if (themeMeta) themeMeta.content = '#FAFAFA';
      }

      // We generally don't override surface in light mode dynamically unless requested
      root.style.removeProperty('--bg-surface');
    }

    // Always apply Brand Primary Color
    if (theme.primary) {
      root.style.setProperty('--color-primary', theme.primary);
    } else {
      root.style.removeProperty('--color-primary');
    }

    // Cleanup function
    return () => {
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--bg-app');
      root.style.removeProperty('--bg-surface');
    };
  }, [isDark, restaurant]);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>Loading...</div>
    </div>
  );

  if (!restaurant) return <div>Restaurant not found</div>;

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
        paddingBottom: '120px',
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
        <div style={{ padding: '0 var(--space-3)', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
          {currentData && currentData.sections.map((section) => (
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
                  {activeOrder?.status === 'accepted' && `${activeOrder.estimatedMinutes} min ${t.remaining[language]}`}
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
              onClick={() => setIsOrderOpen(true)}
              style={{
                position: 'fixed',
                bottom: '32px',
                left: '50%',
                x: '-50%',
                zIndex: 100,
                width: 'calc(100% - 48px)', // Full width minus margin
                maxWidth: '432px'
              }}
            >
              <div style={{
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
                justifyContent: 'space-between',
                whiteSpace: 'nowrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={20} />
                  <span style={{ fontWeight: 600 }}>{t["viewOrder"][language]}</span>
                </div>
                <div style={{
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
                }}>
                  {totalCount}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <OrderModal
          isOpen={isOrderOpen}
          onClose={() => setIsOrderOpen(false)}
          language={language}
        />
      </div>
    </div>
  );
};

/* 
   App Routing 
*/
function App() {
  return (
    <BrowserRouter>
      <MenuProvider>
        <OrderProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } />

            {/* Client Routes */}
            {/* Default Route (no slug) -> Load default restaurant */}
            <Route path="/" element={<ClientApp />} />
            {/* Dynamic Route (slug) -> Load specific restaurant */}
            <Route path="/:slug" element={<ClientApp />} />
          </Routes>
        </OrderProvider>
      </MenuProvider>
    </BrowserRouter>
  );
}

export default App;


