import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { formatPrice } from '../utils/currencyHelper';

/**
 * A component that animates price changes with a count-up/down effect.
 */
const AnimatedPrice = ({ value, currency, style, className }) => {
    const springValue = useSpring(value, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.01
    });

    const displayValue = useTransform(springValue, (latest) => {
        return formatPrice(latest, currency);
    });

    useEffect(() => {
        springValue.set(value);
    }, [value, springValue]);

    return (
        <motion.span
            style={style}
            className={className}
        >
            {displayValue}
        </motion.span>
    );
};

export default AnimatedPrice;
