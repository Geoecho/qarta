import React from 'react';
import { motion } from 'framer-motion';

const Header = ({ taskCount = 0, moodCount = 0 }) => {
    // Current Date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
    const dayStr = today.toLocaleDateString('en-US', { weekday: 'long' });

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
                width: '100%',
                padding: 'var(--space-8) var(--space-4) var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
            }}
        >
            <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-text-grey)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {dayStr}
            </div>

            <h1 style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: 800,
                color: 'var(--color-primary-red)', // Use primary as accent
                letterSpacing: '-0.03em',
                lineHeight: 1
            }}>
                {dateStr}
            </h1>

            {/* Micro-visualization of balance */}
            <div style={{
                display: 'flex',
                gap: '4px',
                marginTop: '12px',
                alignItems: 'center'
            }}>
                {/* Visual dots representing items */}
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-black)' }}>
                    {taskCount} Tasks
                </div>
                <div style={{ width: '1px', height: '12px', background: '#ddd', margin: '0 8px' }} />
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-black)' }}>
                    {moodCount} Moods
                </div>
            </div>
        </motion.div>
    );
};

export default Header;
