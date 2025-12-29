import React, { useState, useEffect } from 'react';

const RemainingTime = ({ activeOrder, t, language, showLabel = true }) => {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!activeOrder?.acceptedAt || !activeOrder?.estimatedMinutes) {
            setTimeLeft(activeOrder?.estimatedMinutes || 0);
            return;
        }

        const calculateTime = () => {
            const acceptedTime = new Date(activeOrder.acceptedAt).getTime();
            const durationMs = activeOrder.estimatedMinutes * 60 * 1000;
            const targetTime = acceptedTime + durationMs;
            const now = new Date().getTime();
            const diff = targetTime - now;

            // Convert to minutes, rounding up
            const minutesLeft = Math.ceil(diff / 60000);

            // If time is up but not marked complete, show 0 or "soon"
            setTimeLeft(minutesLeft > 0 ? minutesLeft : 0);
        };

        calculateTime();
        const interval = setInterval(calculateTime, 10000); // Update every 10s

        return () => clearInterval(interval);
    }, [activeOrder]);

    if (activeOrder.status !== 'accepted') return null;

    if (timeLeft === null) return <span>...</span>;

    if (timeLeft <= 0) return <span>{t.ready[language]}</span>;

    if (!showLabel) return <span>{timeLeft}</span>;

    return <span>{timeLeft} min {t.remaining[language]}</span>;
};

export default RemainingTime;
