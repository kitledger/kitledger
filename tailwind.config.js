import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['IBM Plex Mono', ...defaultTheme.fontFamily.sans],
            },
        },
    },

	daisyui: {
		themes: [
			{
				light: {
					"primary": "#22C55E",          // Bright green from logo
					"primary-focus": "#16A34A",    // Darker shade of primary
					"primary-content": "#ffffff",   // White text on primary
					
					"secondary": "#042F2E",        // Dark green from logo
					"secondary-focus": "#0A4B49",  // Slightly lighter dark green
					"secondary-content": "#ffffff", // White text on secondary
					
					"accent": "#15803D",           // Medium green for accents
					"accent-focus": "#166534",     // Darker accent
					"accent-content": "#ffffff",    // White text on accent
					
					"neutral": "#2A3433",          // Neutral dark
					"neutral-focus": "#374746",    // Slightly lighter neutral
					"neutral-content": "#ffffff",   // White text on neutral
					
					"base-100": "#F5F3EE",         // Warm beige background
					"base-200": "#EAE7E0",         // Slightly darker beige
					"base-300": "#DFD9D0",         // Even darker beige
					"base-content": "#1C2826",     // Dark text on base
					
					"info": "#3ABFF8",             // Info blue
					"success": "#22C55E",          // Success (using primary)
					"warning": "#FBBD23",          // Warning yellow
					"error": "#DC2626",            // Error red
					
					"--rounded-box": "0.3rem",
					"--rounded-btn": "0.2rem",
					"--rounded-badge": "0.25rem",
					"--animation-btn": "0.25s",
					"--animation-input": "0.2s",
				},
				dark: {
					"primary": "#22C55E",          // Bright green from logo
					"primary-focus": "#16A34A",    // Darker shade of primary
					"primary-content": "#ffffff",   // White text on primary
					
					"secondary": "#15803D",        // Medium green
					"secondary-focus": "#166534",   // Darker medium green
					"secondary-content": "#ffffff", // White text on secondary
					
					"accent": "#4ADE80",           // Light green accent
					"accent-focus": "#22C55E",     // Darker accent
					"accent-content": "#042F2E",    // Dark text on accent
					
					"neutral": "#1C2826",          // Neutral dark
					"neutral-focus": "#253431",    // Slightly lighter neutral
					"neutral-content": "#ffffff",   // White text on neutral
					
					"base-100": "#042F2E",         // Dark green from logo
					"base-200": "#032524",         // Slightly darker
					"base-300": "#021B1A",         // Even darker
					"base-content": "#E5E7EB",     // Light gray text on base
					
					"info": "#3ABFF8",             // Info blue
					"success": "#22C55E",          // Success (using primary)
					"warning": "#FBBD23",          // Warning yellow
					"error": "#DC2626",            // Error red
					
					"--rounded-box": "0.3rem",
					"--rounded-btn": "0.2rem",
					"--rounded-badge": "0.25rem",
					"--animation-btn": "0.25s",
					"--animation-input": "0.2s",
				},
			},
		],
	},

    plugins: [forms, daisyui],
};
