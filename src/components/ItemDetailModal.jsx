import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { formatPrice } from '../utils/currencyHelper';
import { getAllergenDetails } from '../utils/allergenHelper';
import AnimatedPrice from './AnimatedPrice';

const ItemDetailModal = ({ item, isOpen, onClose, language = 'en' }) => {
    const { addToCart } = useOrder();
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({}); // { optionId: boolean/qty }

    // Lock Body Scroll when modal is open to prevent pull-to-refresh interference
    const dragControls = useDragControls();
    const currency = language === 'mk' ? 'MKD' : 'EUR';

    // Toggle options (purely visual)
    const toggleOption = (optId) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optId]: !prev[optId]
        }));
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Also try to prevent default touch behavior for better swipe control
            document.body.style.touchAction = 'none';
            setQuantity(1); // Reset quantity on open
            setSelectedOptions({}); // Reset options
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [isOpen]);

    const handleAddToCart = () => {
        // Build option list with full objects (including prices)
        const optionsToAdd = item.options
            ? item.options.filter(o => selectedOptions[o.id])
            : [];

        // Add to cart with options
        for (let i = 0; i < quantity; i++) {
            addToCart({
                ...item,
                selectedOptions: optionsToAdd
            });
        }

        onClose();
    };


    if (!item || !item.name) return null;

    // Calculate Dynamic Total Price for display
    const optionsCost = (item.options || []).reduce((acc, opt) => selectedOptions[opt.id] ? acc + opt.price : acc, 0);
    const totalPrice = (item.price + optionsCost) * quantity;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.85)', // Increased opacity
                            zIndex: 200
                        }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        drag="y"
                        dragControls={dragControls}
                        dragListener={false} // Only drag via handle
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.2 }}
                        onDragEnd={(e, { offset, velocity }) => {
                            if (offset.y > 100 || velocity.y > 500) onClose();
                        }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            top: 'auto', // Bottom sheet style
                            height: item.image ? '92vh' : 'auto',
                            maxHeight: '92vh',
                            backgroundColor: 'var(--bg-modal-card, var(--bg-app))',
                            color: 'var(--color-ink)',
                            borderTopLeftRadius: '32px',
                            borderTopRightRadius: '32px',
                            zIndex: 201,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: '480px',
                            margin: '0 auto',
                            right: 0,
                            left: 0,
                            border: '1px solid var(--border-color)', // Added border for separation
                            boxShadow: '0 -8px 40px rgba(0,0,0,0.3)' // Strengthened shadow
                        }}
                    >
                        {/* Drag Handle */}
                        <div
                            onPointerDown={(e) => dragControls.start(e)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                paddingTop: '12px',
                                paddingBottom: '8px',
                                cursor: 'grab',
                                touchAction: 'none',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                zIndex: 10
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '5px',
                                borderRadius: '100px',
                                backgroundColor: item.image ? 'rgba(255,255,255,0.4)' : 'var(--color-text-subtle)',
                                opacity: 0.5
                            }}></div>
                        </div>

                        {/* Content (Scroll disabled to prevent gesture conflict) */}
                        <div style={{ flex: 1, overflowY: 'hidden', paddingBottom: '100px' }}> {/* Padding for footer */}

                            {/* Hero Image or Simple Header */}
                            {item.image ? (
                                <div style={{
                                    position: 'relative',
                                    height: '280px',
                                    width: '100%',
                                    backgroundColor: 'var(--bg-surface-secondary)'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundImage: `url(${item.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }} />

                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent, rgba(0,0,0,0.6))'
                                    }} />

                                    {/* Close / Back Button */}
                                    <button
                                        onClick={onClose}
                                        style={{
                                            position: 'absolute',
                                            top: '20px',
                                            left: '20px',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(0,0,0,0.5)', // Fallback for button
                                            border: '1px solid var(--border-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div style={{
                                    padding: '44px 24px 0 24px',
                                    display: 'flex',
                                    justifyContent: 'flex-start'
                                }}>
                                    {/* Close / Back Button for No Image */}
                                    <button
                                        onClick={onClose}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--bg-surface-secondary)',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--color-ink)',
                                            cursor: 'pointer',
                                            marginBottom: '16px',
                                            border: '1px solid var(--border-color)'
                                        }}
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                </div>
                            )}

                            <div style={{ padding: '24px', paddingBottom: '32px' }}>
                                {/* Title & Price */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, lineHeight: 1.2, flex: 1, color: 'var(--color-ink)' }}>
                                        {item.name?.[language] || item.name?.['en'] || 'Unnamed Item'}
                                    </h1>
                                    <div style={{
                                        fontSize: '20px',
                                        fontWeight: 700,
                                        color: 'var(--color-item-price)', // Changed to price color
                                        whiteSpace: 'nowrap',
                                        marginLeft: '16px'
                                    }}>
                                        <AnimatedPrice value={item.price} currency={currency} />
                                    </div>
                                </div>

                                <p style={{
                                    margin: '0 0 12px 0', // Reduced from 16px for a more compact look
                                    fontSize: '15px',
                                    lineHeight: 1.6,
                                    color: 'var(--color-item-desc)'
                                }}>
                                    {item.desc?.[language] || item.desc?.['en'] || item.description?.[language] || item.description?.['en']}
                                </p>

                                {/* Ingredients */}
                                {item.ingredients && (
                                    <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--bg-surface-secondary)', borderRadius: '16px' }}>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>Ingredients</h3>
                                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>
                                            {item.ingredients && typeof item.ingredients === 'object'
                                                ? (item.ingredients[language] || item.ingredients.en)
                                                : item.ingredients
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* Allergens */}
                                {Array.isArray(item.allergens) && item.allergens.length > 0 && (
                                    <div style={{ marginBottom: '32px' }}>
                                        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Allergens</h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {item.allergens.map((alg, i) => {
                                                const { icon: Icon, color, label } = getAllergenDetails(alg, language);
                                                return (
                                                    <div key={i} style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '6px 12px',
                                                        borderRadius: '8px',
                                                        backgroundColor: `var(--bg-surface-secondary)`,
                                                        border: '1px solid var(--border-color)'
                                                    }}>
                                                        <Icon size={14} color={color} />
                                                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-ink)' }}>{label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Options */}
                                {Array.isArray(item.options) && item.options.length > 0 && (
                                    <div style={{ marginBottom: '32px' }}>
                                        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Customize</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {item.options.map(opt => (
                                                <div
                                                    key={opt.id}
                                                    onClick={() => toggleOption(opt.id)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '12px 16px',
                                                        borderRadius: '12px',
                                                        border: selectedOptions[opt.id] ? '1px solid var(--color-item-price)' : '1px solid var(--border-color)',
                                                        backgroundColor: selectedOptions[opt.id] ? 'var(--bg-surface-secondary)' : 'var(--bg-surface)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '4px',
                                                            border: selectedOptions[opt.id] ? 'none' : '2px solid var(--border-color)',
                                                            backgroundColor: selectedOptions[opt.id] ? 'var(--color-item-price)' : 'transparent',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            {selectedOptions[opt.id] && <div style={{ width: '8px', height: '4px', borderLeft: '2px solid white', borderBottom: '2px solid white', transform: 'rotate(-45deg) translate(1px, -1px)' }} />}
                                                        </div>
                                                        <span style={{ fontWeight: 500 }}>{opt.label[language] || opt.label['en']}</span>
                                                    </div>
                                                    <span style={{ fontSize: '14px', color: 'var(--color-text-subtle)' }}>+{formatPrice(opt.price, currency)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add To Order Footer */}
                        <div style={{
                            padding: '16px 24px 32px 24px',
                            backgroundColor: 'var(--bg-modal-card, var(--bg-app))',
                            borderTop: '1px solid var(--border-color)',
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'center'
                        }}>
                            {/* Quantity Control */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                backgroundColor: 'var(--bg-control-secondary)',
                                padding: '4px',
                                borderRadius: '26px', // Matches Search Bar
                                height: '52px', // Comfortable for 44px buttons
                                border: '1px solid var(--border-color)' // Matches Search Bar
                            }}>
                                <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        color: 'var(--color-item-price)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <Minus size={20} />
                                </motion.button>
                                <span style={{ fontSize: '18px', fontWeight: 800, minWidth: '20px', textAlign: 'center', color: 'var(--color-ink)' }}>{quantity}</span>
                                <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => setQuantity(quantity + 1)}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        color: 'var(--color-item-price)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <Plus size={20} />
                                </motion.button>
                            </div>

                            {/* Add Button */}
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                style={{
                                    flex: 1,
                                    height: '48px', // Scaled down from 56px
                                    borderRadius: '24px', // Matches Search Bar logic/pill
                                    backgroundColor: 'var(--color-item-price)',
                                    color: '#fff',
                                    border: 'none',
                                    fontSize: '16px', // Slightly smaller
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                <span>Add</span>
                                <span style={{ opacity: 0.8 }}>|</span>
                                <span><AnimatedPrice value={totalPrice} currency={currency} /></span>
                            </motion.button>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ItemDetailModal;
