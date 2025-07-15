
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				terminal: {
					bg: 'hsl(var(--terminal-bg))',
					glass: 'hsl(var(--terminal-glass) / 0.7)',
					border: 'hsl(var(--terminal-border) / 0.3)',
					text: 'hsl(var(--terminal-text))',
					cursor: 'hsl(var(--terminal-cursor))',
					command: 'hsl(var(--terminal-command))',
				},
				glass: {
					bg: 'hsl(var(--glass-bg) / 0.6)',
					border: 'hsl(var(--glass-border) / 0.2)',
					shadow: 'hsl(var(--glass-shadow) / 0.5)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'cursor-blink': {
					'0%, 50%': { opacity: '1' },
					'51%, 100%': { opacity: '0' }
				},
				'bg-transition': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'typewriter': {
					'0%': { width: '0' },
					'100%': { width: '100%' }
				},
				'gentle-pulse': {
					'0%, 100%': { opacity: '0.4' },
					'50%': { opacity: '0.8' }
				},
				'slow-fade': {
					'0%': { opacity: '0.6' },
					'100%': { opacity: '0.9' }
				}
			},
			animation: {
				'fade-in': 'fade-in 0.6s ease-out',
				'cursor-blink': 'cursor-blink 1s infinite',
				'bg-transition': 'bg-transition 2s ease-in-out',
				'typewriter': 'typewriter 2s steps(40, end)',
				'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
				'slow-fade': 'slow-fade 8s ease-in-out infinite alternate'
			},
			backdropBlur: {
				'xs': '2px',
			},
			gridTemplateColumns: {
				'20': 'repeat(20, minmax(0, 1fr))'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
