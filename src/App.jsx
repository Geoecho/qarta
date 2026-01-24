import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { Search, X, LayoutGrid, Bell } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { MenuProvider, usePlatform } from './contexts/MenuContext';
import { CLIENT_TRANSLATIONS } from './utils/clientTranslations';
import { OrderProvider, useOrder } from './contexts/OrderContext';
import { formatPrice } from './utils/currencyHelper';
import BrandHeader from './components/BrandHeader';
import CategoryNav from './components/CategoryNav';
import MenuAccordion from './components/MenuAccordion';
import PromoPopup from './components/PromoPopup';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import { AdminDashboard } from './admin/AdminDashboard';
import Login from './admin/Login';
import OrderReceiver from './admin/OrderReceiver';
import LandingPage from './landing/LandingPage';

import InfoPage from './components/InfoPage';
import DealsCarousel from './components/DealsCarousel';

import OrderSummaryModal from './components/OrderSummaryModal';
import { useTheme } from './hooks/useTheme';


/* 
   Protected Route Component 
*/
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const ProtectedRestaurantRoute = ({ children }) => {
  const { slug } = useParams();
  const isAdminAndAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
  const isOwnerAndAuth = localStorage.getItem(`isAuth_${slug}`) === 'true';

  if (!isAdminAndAuth && !isOwnerAndAuth) {
    // Redirect to the specific login page for this restaurant if possible, or main login
    return <Navigate to={`/${slug}/login`} replace />;
  }
  return children;
};


// ... imports
import ItemDetailModal from './components/ItemDetailModal';

// ... (ProtectedAdminRoute)

/* 
   Main Client App (Home)
*/
const ClientApp = () => {
  const { slug } = useParams(); // Get restaurant slug from URL
  const { getRestaurantBySlug, loading } = usePlatform();
  const restaurant = getRestaurantBySlug(slug);
  const menuData = restaurant ? restaurant.menu : [];

  // Extract table number from URL query parameters
  const [tableNumber, setTableNumber] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    if (table) {
      sessionStorage.setItem('qarta_table', table);
      return table;
    }
    return sessionStorage.getItem('qarta_table') || null;
  });

  const [activeTab, setActiveTab] = useState(null); // Top Level
  const [openSectionId, setOpenSectionId] = useState(null); // Accordion state
  const [selectedItem, setSelectedItem] = useState(null); // Item Detail Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cart, totalCount, totalPrice, loadOrderForRestaurant, orderStatus, activeOrder, resetOrder, setTableId } = useOrder();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isStatusHidden, setIsStatusHidden] = useState(() => {
    try {
      return sessionStorage.getItem('qarta_hide_pill') === 'true';
    } catch (e) { return false; }
  });

  useEffect(() => {
    sessionStorage.setItem('qarta_hide_pill', isStatusHidden);
  }, [isStatusHidden]);

  // Reset hidden state when NEW order is placed
  useEffect(() => {
    if (orderStatus === 'waiting') {
      setIsStatusHidden(false);
      sessionStorage.setItem('qarta_hide_pill', 'false');
    }
  }, [orderStatus]);

  // Load Order Context for this specific restaurant and set table
  useEffect(() => {
    if (slug) {
      loadOrderForRestaurant(slug);
      if (tableNumber && setTableId) {
        setTableId(tableNumber);
      }
    }
  }, [slug, tableNumber]);

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
      hasInitializedTheme.current = true; // Mark as initialized to prevent resets on reload
    }
  }, [restaurant]);

  // Persist theme changes
  useEffect(() => {
    localStorage.setItem('qarta_theme', JSON.stringify(isDark));
  }, [isDark]);

  // APPLY THEME (Standardized Hook)
  useTheme(restaurant, isDark);

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('qarta_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('qarta_lang', language);
  }, [language]);

  const t = CLIENT_TRANSLATIONS[language] || CLIENT_TRANSLATIONS['en'];

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- NOTIFICATION LOGIC ---
  const prevStatusRef = useRef(activeOrder?.status);

  // Request Permission (Desktop/PWA only)
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (!isIOS && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Watch for Status Changes
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) return; // STRICT GUARD: Never touch Notification API on iOS Safari (unstable in non-PWA)

    const currentStatus = activeOrder?.status;
    const prevStatus = prevStatusRef.current;

    if (currentStatus && prevStatus && currentStatus !== prevStatus) {
      if (Notification.permission === "granted" && document.hidden) {
        let title = "";
        let body = "";

        // Customize message based on new status
        if (currentStatus === 'accepted') {
          title = t.orderAccepted || "Order Accepted";
          body = t.preparingDesc || "Your order is being prepared.";
        } else if (currentStatus === 'ready') {
          title = t.orderReady || "Order Ready!";
          body = restaurant?.serviceType === 'self' ? (t.readyDescSelf || "Come pick it up!") : (t.readyDesc || "It will be served shortly.");
        } else if (currentStatus === 'completed') {
          title = t.orderCompleted || "Order Completed";
          body = t.completedDesc || "Enjoy your meal!";
        } else if (currentStatus === 'rejected') {
          title = "Order Update";
          body = "Your order could not be accepted.";
        }

        if (title) {
          try {
            // Check if Notification constructor is available and valid
            if (typeof Notification === 'function' && Notification.permission === "granted") {
              new Notification(title, {
                body: body,
                icon: '/vite.svg',
                tag: 'order-update'
              });
            }
          } catch (e) {
            console.log("Notify error", e);
            // On some mobile browsers, Notification exists but isn't a constructor
          }
        }
      }
    }

    prevStatusRef.current = currentStatus;
  }, [activeOrder?.status, t, restaurant]);
  // --------------------------

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
    const seenIds = new Set(); // Track unique items

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
          // Deduplicate based on ID
          if (seenIds.has(item.id)) return;

          const nameMatch = Object.values(item.name || {}).some(name =>
            name && typeof name === 'string' && name.toLowerCase().includes(query)
          );
          // Include item if it matches directly OR if its category/section matches
          if (nameMatch || categoryNameMatch || sectionNameMatch) {
            results.push(item);
            seenIds.add(item.id);
          }
        });
      });
    });

    return results;
  }, [searchQuery, menuData]);

  // Cache Logo and Theme Colors for Loading Screen
  useEffect(() => {
    if (restaurant?.theme && slug) {
      localStorage.setItem(`qarta_logo_${slug}`, restaurant.logo || '');
      // Cache critical colors for loading screen
      const priceColor = restaurant.theme.itemPriceColor || restaurant.theme.primary || '#0ea5e9';
      localStorage.setItem(`qarta_color_${slug}`, priceColor);
    }
  }, [restaurant, slug]);

  const cachedLogo = slug ? localStorage.getItem(`qarta_logo_${slug}`) : null;
  const cachedColor = slug ? localStorage.getItem(`qarta_color_${slug}`) : '#0ea5e9';

  if (loading) return (
    <div style={{
      height: '100vh',
      width: '100%',
      // Use !important inline style via ref or direct prop to override anything else
      // But for React element, style prop is usually sufficient unless overridden by global CSS
      backgroundColor: 'var(--bg-app)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px'
    }}>
      {/* Logo Container */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.9, 1, 0.9]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {cachedLogo ? (
          <img
            src={cachedLogo}
            alt="Loading..."
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'var(--logo-filter, none)',
              transition: 'filter 0.3s ease'
            }}
          />
        ) : (
          <div style={{
            fontSize: '40px',
            fontWeight: 800,
            color: 'var(--color-primary)',
            filter: 'var(--logo-filter, none)' // Also invert text if needed (rare but safe)
          }}>Q</div>
        )}
      </motion.div>

      {/* Modern Dots Loader */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut"
            }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: cachedColor // Use cached color directly 
            }}
          />
        ))}
      </div>
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
        paddingBottom: '140px',
        boxShadow: 'none',
        position: 'relative',
        transition: 'background-color 0.3s'
      }}>
        <BrandHeader
          isDark={isDark}
          toggleTheme={() => setIsDark(!isDark)}
          language={language}
          setLanguage={setLanguage}
          logoUrl={restaurant.logo}
        />

        {/* Search Bar - Top Layout */}
        <div
          ref={searchContainerRef}
          style={{
            padding: '8px 24px 32px 24px',
            zIndex: 90,
            position: 'relative' // Anchor for Absolute Results
          }}
        >
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setIsSearchFocused(true);
            }}
            onClear={() => setSearchQuery('')}
            onFocus={() => setIsSearchFocused(true)}
            language={language}
            bottomOffset={0} // Not used in top layout
          />
          {/* Global Search Results Overlay */}
          <AnimatePresence>
            {searchQuery && (
              <SearchResults
                results={searchResults}
                language={language}
                onAdd={(item) => {
                  setSelectedItem(item);
                  setIsSearchFocused(false);
                  setSearchQuery('');
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Today's Deals Carousel */}
        <DealsCarousel
          deals={restaurant.deals}
          language={language}
          isDark={isDark} // Pass theme state
          onDealClick={(deal) => setSelectedItem(deal)}
        />

        {/* Top Navigation - Categories */}
        <div style={{
          paddingTop: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ padding: '0 24px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutGrid size={18} style={{ color: 'var(--color-item-price)' }} fill="currentColor" fillOpacity={0.2} />
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.5px' }}>
              {language === 'mk' ? 'Категории' : (language === 'sq' ? 'Kategoritë' : 'Categories')}
            </h2>
          </div>
          <CategoryNav
            categories={menuData}
            activeCategory={activeTab}
            onSelect={setActiveTab}
            language={language}
          />
        </div>

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
              language={language}
              onItemClick={setSelectedItem} // Pass handler
            />
          ))}
        </div>

        {/* Item Detail Modal */}
        <ItemDetailModal
          isOpen={!!selectedItem}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          language={language}
        />

        <OrderSummaryModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          language={language}
        />



        <AnimatePresence>
          {!isOrderModalOpen && orderStatus !== 'idle' && !isStatusHidden && (
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              onClick={() => setIsOrderModalOpen(true)}
              style={{
                position: 'fixed',
                bottom: '24px',
                left: '24px',
                right: '24px',
                maxWidth: '500px',
                height: (activeOrder?.status === 'completed' || activeOrder?.status === 'rejected' || activeOrder?.status === 'cancelled') ? 'auto' : '56px',
                margin: '0 auto',
                backgroundColor: 'var(--color-item-price)', // Always brand color now, as requested ("not like other pills")
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: (activeOrder?.status === 'completed' || activeOrder?.status === 'rejected' || activeOrder?.status === 'cancelled') ? '24px' : '100px',
                padding: (activeOrder?.status === 'completed' || activeOrder?.status === 'rejected' || activeOrder?.status === 'cancelled') ? '16px' : '0 8px 0 16px',
                display: 'flex',
                flexDirection: (activeOrder?.status === 'completed' || activeOrder?.status === 'rejected' || activeOrder?.status === 'cancelled') ? 'column' : 'row',
                alignItems: (activeOrder?.status === 'completed' || activeOrder?.status === 'rejected' || activeOrder?.status === 'cancelled') ? 'stretch' : 'center',
                justifyContent: (activeOrder?.status === 'completed' || activeOrder?.status === 'rejected' || activeOrder?.status === 'cancelled') ? 'center' : 'space-between',
                gap: (activeOrder?.status === 'completed' || activeOrder?.status === 'rejected' || activeOrder?.status === 'cancelled') ? '16px' : '0',
                boxShadow: 'none',
                cursor: 'pointer',
                zIndex: 99
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1, // Ensure it takes available space
                gap: '12px',
                justifyContent: (activeOrder?.status === 'completed' || activeOrder?.status === 'rejected' || activeOrder?.status === 'cancelled') ? 'center' : 'flex-start',
                width: (activeOrder?.status === 'completed' || activeOrder?.status === 'rejected' || activeOrder?.status === 'cancelled') ? '100%' : 'auto'
              }}>
                {/* Status Icon */}
                {(activeOrder?.status === 'placed' || orderStatus === 'waiting') ? (
                  <div className="spinner-simple" style={{ width: 24, height: 24, border: '3px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                ) : (
                  ['ready', 'completed'].includes(activeOrder?.status) ? (
                    <Bell size={24} fill="#fff" strokeWidth={0} className="tilt-shaking" />
                  ) : (activeOrder?.status === 'rejected' || activeOrder?.status === 'cancelled') ? (
                    <X size={24} color="#fff" strokeWidth={3} />
                  ) : (
                    <div style={{ position: 'relative', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="pulse-ring" style={{ width: '100%', height: '100%', inset: 0 }}></div>
                      <div style={{ width: 10, height: 10, background: '#fff', borderRadius: '50%', zIndex: 2 }}></div>
                    </div>
                  )
                )}

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: (activeOrder?.status === 'completed' || activeOrder?.status === 'rejected' || activeOrder?.status === 'cancelled') ? 'center' : 'flex-start' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px', lineHeight: 1.2 }}>
                    {(() => {
                      const s = activeOrder?.status || 'placed';
                      if (s === 'completed') return t.orderCompleted || "Order Finished";
                      if (s === 'rejected' || s === 'cancelled') return t.orderDeclined || "Order Declined"; // Add trans key if needed or fallback
                      if (s === 'ready') return t.orderReady || "Ready!";
                      if (s === 'accepted' || s === 'cooking') return t.preparing || "Preparing";
                      return t.orderSent || "Sent";
                    })()}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 500 }}>
                    {(() => {
                      const s = activeOrder?.status || 'placed';
                      if (s === 'completed') return t.completedDesc || "Tap to start new";
                      if (s === 'rejected' || s === 'cancelled') return t.tryAgain || "Please try again.";
                      if (s === 'ready') return restaurant?.serviceType === 'self' ? (t.readyDescSelf || "Come pick it up!") : (t.readyDesc || "It's ready!");
                      if (s === 'accepted' || s === 'cooking') return t.preparingDesc || "Preparing...";
                      return t.orderSentDesc || "Waiting...";
                    })()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: (activeOrder?.status === 'completed' || activeOrder?.status === 'rejected' || activeOrder?.status === 'cancelled') ? '100%' : 'auto' }}>
                {/* Contextual Action Button */}
                {activeOrder?.status === 'completed' ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      resetOrder();
                      setIsStatusHidden(true); // Hide pill after reset
                    }}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      padding: '12px 16px',
                      borderRadius: '50px',
                      fontWeight: 700,
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      width: '100%',
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    {t.newOrder || "Start New Order"}
                  </div>
                ) : (activeOrder?.status === 'rejected' || activeOrder?.status === 'cancelled') ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      // Maybe open modal? or reset? Opening modal shows reason.
                      setIsOrderModalOpen(true);
                    }}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      padding: '12px 16px',
                      borderRadius: '50px',
                      fontWeight: 700,
                      fontSize: '15px', // Match Completed
                      whiteSpace: 'nowrap',
                      width: '100%',
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    {t.viewOrder || "View Details"}
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    padding: '10px 16px',
                    borderRadius: '50px',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}>
                    View
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Gradient Mask for readabilty */}
        <AnimatePresence>
          {((cart.length > 0 && !isOrderModalOpen && (orderStatus === 'idle' || isStatusHidden)) || (!isOrderModalOpen && orderStatus !== 'idle' && !isStatusHidden)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '140px',
                background: 'linear-gradient(to top, var(--bg-app) 10%, rgba(0,0,0,0) 100%)',
                pointerEvents: 'none',
                zIndex: 90
              }}
            />
          )}
        </AnimatePresence>

        {/* Floating Cart Bar - Premium Style (Only if NO active order OR if Status Pill is hidden) */}
        <AnimatePresence>
          {cart.length > 0 && !isOrderModalOpen && (orderStatus === 'idle' || isStatusHidden) && (
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              onClick={() => setIsOrderModalOpen(true)}
              style={{
                position: 'fixed',
                bottom: '24px',
                left: '24px',
                right: '24px',
                maxWidth: '500px',
                margin: '0 auto',
                backgroundColor: 'var(--color-item-price)', // Keep brand color base
                border: '1px solid rgba(255,255,255,0.2)', // Increased visibility stroke
                borderRadius: '100px', // Match Order Pill
                height: '52px', // Match SearchBar
                padding: '0 16px', // Equal spacing symmetrically
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 99
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: '#fff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-item-price)',
                  fontWeight: 800,
                  fontSize: '13px'
                }}>
                  {totalCount}
                </div>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {CLIENT_TRANSLATIONS[language]?.viewOrder || CLIENT_TRANSLATIONS['en'].viewOrder}
                </span>
              </div>

              {/* Total Price Pill */}
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.2)', // Darker translucent pill
                color: '#fff',
                padding: '0 16px', // Reduced vertical padding + flex center
                borderRadius: '100px', // Fully Round
                fontWeight: 700,
                fontSize: '15px',
                border: '1px solid rgba(255,255,255,0.1)',
                height: '36px', // Explicit reduced height
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {restaurant ? formatPrice(Number(totalPrice || 0), language === 'mk' ? 'MKD' : 'EUR') : ''}
              </div>
            </motion.div>
          )}

        </AnimatePresence>


      </div>
    </div >
  );
};



/* 
   App Routing 
*/
const App = () => {
  return (
    <Router>
      <Analytics />
      <MenuProvider>
        <OrderProvider>
          <Routes>
            {/* Landing Page at Root */}
            <Route path="/" element={<LandingPage />} />

            {/* Super Admin Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } />
            <Route
              path="/:slug/orders"
              element={
                <ProtectedRestaurantRoute>
                  <OrderReceiver />
                </ProtectedRestaurantRoute>
              }
            />    {/* Restaurant Admin Routes - MUST come before generic slug route */}
            <Route path="/:slug/login" element={<Login />} />
            <Route path="/:slug/admin" element={
              <ProtectedRestaurantRoute>
                <AdminDashboard />
              </ProtectedRestaurantRoute>
            } />

            {/* Client Routes */}
            <Route path="/:slug" element={<ClientApp />} />
            <Route path="/:slug/info" element={<InfoPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </OrderProvider>
      </MenuProvider>
    </Router>
  );
};

export default App;
