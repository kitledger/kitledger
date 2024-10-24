import { useState, useEffect } from 'react';

const allowedThemes = ['light', 'dark'];

export function useSystemTheme() {
	// Initialize with the current system preference
	const [systemTheme, setSystemTheme] = useState(() => {
		// Only access window.matchMedia on client side
		if (typeof window !== 'undefined') {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		// Default to light on server side
		return 'light';
	});

	useEffect(() => {
		// Skip if running on server side
		if (typeof window === 'undefined') return;

		// Create the media query list
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		// Define the change handler
		const handleChange = (event: any) => {
			setSystemTheme(event.matches ? 'dark' : 'light');
		};

		// Add the listener
		mediaQuery.addEventListener('change', handleChange);

		// Cleanup on unmount
		return () => {
		mediaQuery.removeEventListener('change', handleChange);
		};
	}, []);

  	return systemTheme;
}

export function useTheme() {
	const activeTheme = document.documentElement.getAttribute('data-theme') || 'none';

	const systemTheme = useSystemTheme();

	const theme = allowedThemes.includes(activeTheme) ? activeTheme : systemTheme;

	return theme;
}

