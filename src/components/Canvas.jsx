import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Block from './Block';
import { Sparkles, ArrowDown } from 'lucide-react';

const Canvas = ({ blocks = [], activeId, onFocus, onDelete }) => {
    return (
        <div style={{
            width: '100%',
            minHeight: '100%',
            paddingLeft: 'var(--space-3)',
            paddingRight: 'var(--space-3)',
            paddingTop: 'var(--space-3)',
            paddingBottom: 'var(--space-12)',

            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridAutoFlow: 'dense',
            gap: 'var(--space-3)',
            alignContent: 'start',
        }}>
            <AnimatePresence initial={false} mode='popLayout'>
                {blocks.map((block) => {
                    const isFullWidth = block.type === 'line' || block.type === 'rectangle' || block.widthVariant === 'full';
                    const gridColumn = isFullWidth ? 'span 2' : 'span 1';
                    const justifySelf = block.type === 'circle' ? 'center' : 'stretch';

                    return (
                        <motion.div
                            key={block.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                gridColumn: gridColumn,
                                justifySelf: justifySelf,
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                position: 'relative'
                            }}
                        >
                            <Block
                                {...block}
                                widthVariant={isFullWidth ? 'full' : 'half'}
                                isActive={activeId === block.id}
                                isDimmed={activeId && activeId !== block.id}
                                onClick={() => onFocus(block.id)}
                                onDelete={() => onDelete(block.id)}
                                style={{ width: '100%' }}
                            />
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Instructional Empty State */}
            {blocks.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        gridColumn: 'span 2',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 'var(--space-8)',
                        color: 'var(--color-text-grey)',
                        textAlign: 'center',
                        gap: '16px'
                    }}
                >
                    <Sparkles size={32} color="var(--color-primary-yellow)" />
                    <div>
                        <h3 style={{ margin: 0, color: 'var(--color-text-black)' }}>Your canvas is empty</h3>
                        <p style={{ margin: '8px 0', fontSize: '14px', maxWidth: '240px' }}>
                            Start your daily mosaic. <br />
                            Try typing <b>"Coffee"</b> or <b>"Happy"</b> below.
                        </p>
                    </div>
                    <ArrowDown size={20} className="animate-bounce" style={{ marginTop: '24px', opacity: 0.5 }} />
                </motion.div>
            )}
        </div>
    );
};

export default Canvas;
