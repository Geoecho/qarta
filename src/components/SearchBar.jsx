import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, onClear, language, bottomOffset = 24 }) => {
    const t = {
        placeholder: {
            en: 'Search...',
            mk: 'Пребарај...',
            sq: 'Kërko...'
        }
    };

    const [isListening, setIsListening] = React.useState(false);
    const recognitionRef = React.useRef(null);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) return;

        // Abort previous instance if any to prevent conflict
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }

        const recognition = new window.webkitSpeechRecognition();
        recognitionRef.current = recognition;

        // Improve language mapping
        const langMap = {
            'mk': 'mk-MK',
            'sq': 'sq-AL',
            'en': 'en-US'
        };
        recognition.lang = langMap[language] || 'en-US';

        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onChange(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
                width: '100%',
                maxWidth: '480px',
                padding: '0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60px' // Fix outer height to prevent jumps
            }}
        >
            <div style={{
                backgroundColor: 'var(--bg-header-control)',
                borderRadius: '20px',
                padding: '0 20px', // Remove vertical padding, use flex align with fixed height
                height: '52px', // Fixed height for input area
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px', // Reduced spacing
                border: '1px solid var(--border-color)',
                position: 'relative'
            }}>
                <Search
                    size={20}
                    style={{
                        color: 'var(--color-text-subtle)',
                        flexShrink: 0
                    }}
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={t.placeholder[language] || t.placeholder.en}
                    style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: '15px',
                        color: 'var(--color-ink)',
                        fontFamily: 'var(--font-sans)',
                        minWidth: 0 // Allow shrinking
                    }}
                />


                {/* Voice Search Logic & UI */}
                {'webkitSpeechRecognition' in window && (
                    <>
                        {!isListening ? (
                            (!value && (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={startListening}
                                    type="button"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        padding: '4px',
                                        cursor: 'pointer',
                                        color: 'var(--color-item-price)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                        <line x1="12" y1="19" x2="12" y2="23" />
                                        <line x1="8" y1="23" x2="16" y2="23" />
                                    </svg>
                                </motion.button>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    position: 'absolute',
                                    right: '6px',
                                    top: '6px',
                                    bottom: '6px',
                                    padding: '0 16px',
                                    background: 'var(--bg-item-btn)',
                                    borderRadius: '100px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: 'white',
                                    zIndex: 10
                                }}
                            >
                                {/* Animated Waveform */}
                                <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '16px' }}>
                                    {[1, 2, 3, 4].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [4, 12, 4] }}
                                            transition={{
                                                duration: 0.6,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: i * 0.1
                                            }}
                                            style={{
                                                width: '3px',
                                                background: 'white',
                                                borderRadius: '2px'
                                            }}
                                        />
                                    ))}
                                </div>



                                <button
                                    onClick={stopListening}
                                    type="button"
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                        marginLeft: '4px'
                                    }}
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        )}
                    </>
                )}

                {value && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClear}
                        style={{
                            background: 'var(--bg-surface-secondary)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--color-text-subtle)',
                            flexShrink: 0
                        }}
                    >
                        <X size={16} />
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default SearchBar;
