import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CornerDownLeft, Check, Cloud, Folder } from 'lucide-react';
import Block from './Block';

const Creator = ({ onCreate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [previewProps, setPreviewProps] = useState(null);

    // Heuristic Logic - Shared for preview and submission
    const calculateProps = (inputText) => {
        const lower = inputText.toLowerCase();
        let type = 'square';
        let color = 'var(--color-primary-red)';
        let size = 'md';
        let widthVariant = 'half';

        if (lower.includes('mood') || lower.includes('feel') || lower.includes('joy') || lower.includes('sad') || lower.includes('happy')) {
            type = 'circle';
            color = 'var(--color-primary-blue)';
            size = 'md';
            widthVariant = 'half';
        } else if (lower.includes('project') || lower.includes('plan') || lower.includes('build') || lower.includes('focus')) {
            type = 'rectangle';
            size = 'md'; // Height
            color = 'var(--color-primary-yellow)';
            widthVariant = 'full';
        } else if (lower === 'line' || lower === '---') {
            type = 'line';
            color = 'var(--color-text-black)';
            widthVariant = 'full';
        } else if (lower.includes('design') || lower.includes('art')) {
            type = 'square';
            color = 'var(--color-primary-red)';
            widthVariant = 'half';
        }

        if (inputText.toUpperCase() === inputText && inputText.length > 3) {
            widthVariant = 'full';
            size = 'lg';
        }

        return { type, color, size, widthVariant };
    };

    useEffect(() => {
        if (text) {
            setPreviewProps(calculateProps(text));
        } else {
            setPreviewProps(null);
        }
    }, [text]);

    const handleSubmit = (e) => {
        e && e.preventDefault();
        if (!text.trim()) return;

        const props = calculateProps(text);

        onCreate({
            id: Date.now(),
            ...props,
            text
        });

        setText('');
        setIsOpen(false);
    };

    // Quick Helper Actions
    const insertHelper = (keyword) => {
        setText(keyword + ' ');
        // Focus input logic would go here ideally
    }

    return (
        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'auto',
            gap: '16px'
        }}>
            {/* Magical Preview */}
            <AnimatePresence>
                {isOpen && text && previewProps && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        style={{
                            marginBottom: '8px',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                            width: previewProps.widthVariant === 'full' ? '90%' : '140px'
                        }}
                    >
                        <Block
                            {...previewProps}
                            text={text}
                            style={{ boxShadow: 'none' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode='wait'>
                {!isOpen ? (
                    <motion.button
                        key="add-btn"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-text-black)',
                            color: 'var(--color-bg-white)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                    >
                        <Plus size={24} />
                    </motion.button>
                ) : (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>

                        {/* Helper Chips */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', gap: '8px' }}
                        >
                            <Chip icon={<Check size={14} />} label="Task" onClick={() => insertHelper('Task')} />
                            <Chip icon={<Cloud size={14} />} label="Mood" onClick={() => insertHelper('Happy mood')} />
                            <Chip icon={<Folder size={14} />} label="Project" onClick={() => insertHelper('New Project')} />
                        </motion.div>

                        <motion.form
                            key="input-form"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            onSubmit={handleSubmit}
                            style={{
                                width: '90%',
                                maxWidth: '360px',
                                backgroundColor: 'var(--color-text-black)',
                                padding: '12px 20px',
                                borderRadius: '32px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                display: 'flex',
                                gap: '12px',
                                alignItems: 'center',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <input
                                autoFocus
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Type..."
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    background: 'transparent',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    outline: 'none',
                                    color: 'var(--color-bg-white)',
                                    padding: '4px 0',
                                    letterSpacing: '-0.01em'
                                }}
                            />
                            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-yellow)' }}>
                                <CornerDownLeft size={20} />
                            </button>
                            <button type="button" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-grey)' }}>
                                <X size={20} />
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Chip = ({ icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        style={{
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: '16px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            color: 'var(--color-text-black)'
        }}
    >
        {icon} {label}
    </button>
)

export default Creator;
