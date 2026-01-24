import { useLayoutEffect } from 'react';

export const useTheme = (restaurant, isDark) => {
    useLayoutEffect(() => {
        if (!restaurant) return;

        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        const themeMeta = document.querySelector('meta[name="theme-color"]');
        const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        const theme = restaurant?.theme || {};

        // OPINIONATED AAA PALETTE
        // We use hardcoded high-contrast values to ensure accessibility (AAA)
        // while allowing the brand's primary color to be the highlight.
        const modeVars = isDark ? {
            '--bg-app': '#050505',
            '--bg-surface': '#121212',
            '--bg-card': '#1a1a1a',
            '--bg-input': '#1E1E1E',
            '--bg-control-secondary': '#2A2A2A',
            '--bg-header-active': '#1e1e1e',
            '--color-ink': '#FFFFFF',
            '--color-text-primary': '#FFFFFF',
            '--color-text-subtle': '#9DA5B4',
            '--border-color': 'rgba(255, 255, 255, 0.08)',
            '--overlay-bg': 'rgba(0,0,0,0.85)',
            '--bg-header-control': '#121212',
            '--color-header-icon': '#FFFFFF',
            '--logo-filter': theme.darkInvertLogo ? 'invert(1)' : 'none',
            '--item-image-filter': theme.darkInvertImages ? 'invert(1)' : 'none',
            'color-scheme': 'dark',
            'statusBar': 'black-translucent'
        } : {
            '--bg-app': '#F8F9FA',
            '--bg-surface': '#FFFFFF',
            '--bg-card': '#FFFFFF',
            '--bg-input': '#F3F4F6',
            '--bg-control-secondary': '#F3F4F6',
            '--bg-header-active': '#F3F4F6',
            '--color-ink': '#1A1A1A',
            '--color-text-primary': '#1A1A1A',
            '--color-text-subtle': '#6B7280',
            '--border-color': 'rgba(0, 0, 0, 0.08)',
            '--overlay-bg': 'rgba(0,0,0,0.5)',
            '--bg-header-control': '#FFFFFF',
            '--color-header-icon': '#1A1A1A',
            '--logo-filter': 'none',
            '--item-image-filter': 'none',
            'color-scheme': 'light',
            'statusBar': 'default'
        };

        // Apply CSS Variables
        Object.entries(modeVars).forEach(([key, val]) => {
            if (key.startsWith('--')) {
                root.style.setProperty(key, val);
            }
        });

        // Apply Primary Color
        const effectivePrimary = theme.primary || (isDark ? '#f43f5e' : '#f43f5e');
        root.style.setProperty('--color-primary', effectivePrimary);
        root.style.setProperty('--color-primary-rgb', hexToRgb(effectivePrimary));

        // Item specific overrides for backward compatibility / fine-tuning
        root.style.setProperty('--color-item-price', effectivePrimary);
        root.style.setProperty('--bg-item-btn', effectivePrimary);

        // Apply built-ins
        root.style.setProperty('color-scheme', modeVars['color-scheme']);

        // Update Meta Tags SAFELY
        if (themeMeta) themeMeta.setAttribute('content', modeVars['--bg-app']);
        if (statusBarMeta) statusBarMeta.setAttribute('content', modeVars['statusBar']);

        // Safari Background Fix
        const bg = modeVars['--bg-app'];
        const styleEl = document.getElementById('theme-bg-styles');
        if (styleEl) {
            styleEl.textContent = `html, body, #root { background-color: ${bg} !important; }`;
        }
        document.documentElement.style.backgroundColor = bg;
        document.body.style.backgroundColor = bg;

    }, [isDark, restaurant]);
};

// Helper for RGB values (used for alpha-ready CSS vars)
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
        '0, 0, 0';
}

