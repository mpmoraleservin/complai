/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				50: 'hsl(var(--primary-50))',
  				100: 'hsl(var(--primary-100))',
  				200: 'hsl(var(--primary-200))',
  				300: 'hsl(var(--primary-300))',
  				400: 'hsl(var(--primary-400))',
  				500: 'hsl(var(--primary-500))',
  				600: 'hsl(var(--primary-600))',
  				700: 'hsl(var(--primary-700))',
  				800: 'hsl(var(--primary-800))',
  				900: 'hsl(var(--primary-900))',
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))',
  				50: 'hsl(var(--destructive-50))',
  				100: 'hsl(var(--destructive-100))',
  				200: 'hsl(var(--destructive-200))',
  				300: 'hsl(var(--destructive-300))',
  				400: 'hsl(var(--destructive-400))',
  				500: 'hsl(var(--destructive-500))',
  				600: 'hsl(var(--destructive-600))',
  				700: 'hsl(var(--destructive-700))',
  				800: 'hsl(var(--destructive-800))',
  				900: 'hsl(var(--destructive-900))',
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
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))',
  				50: 'hsl(var(--success-50))',
  				100: 'hsl(var(--success-100))',
  				200: 'hsl(var(--success-200))',
  				300: 'hsl(var(--success-300))',
  				400: 'hsl(var(--success-400))',
  				500: 'hsl(var(--success-500))',
  				600: 'hsl(var(--success-600))',
  				700: 'hsl(var(--success-700))',
  				800: 'hsl(var(--success-800))',
  				900: 'hsl(var(--success-900))',
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))',
  				50: 'hsl(var(--warning-50))',
  				100: 'hsl(var(--warning-100))',
  				200: 'hsl(var(--warning-200))',
  				300: 'hsl(var(--warning-300))',
  				400: 'hsl(var(--warning-400))',
  				500: 'hsl(var(--warning-500))',
  				600: 'hsl(var(--warning-600))',
  				700: 'hsl(var(--warning-700))',
  				800: 'hsl(var(--warning-800))',
  				900: 'hsl(var(--warning-900))',
  			},
  			info: {
  				DEFAULT: 'hsl(var(--info))',
  				foreground: 'hsl(var(--info-foreground))',
  				50: 'hsl(var(--info-50))',
  				100: 'hsl(var(--info-100))',
  				200: 'hsl(var(--info-200))',
  				300: 'hsl(var(--info-300))',
  				400: 'hsl(var(--info-400))',
  				500: 'hsl(var(--info-500))',
  				600: 'hsl(var(--info-600))',
  				700: 'hsl(var(--info-700))',
  				800: 'hsl(var(--info-800))',
  				900: 'hsl(var(--info-900))',
  			},
  			gray: {
  				50: 'hsl(var(--gray-50))',
  				100: 'hsl(var(--gray-100))',
  				200: 'hsl(var(--gray-200))',
  				300: 'hsl(var(--gray-300))',
  				400: 'hsl(var(--gray-400))',
  				500: 'hsl(var(--gray-500))',
  				600: 'hsl(var(--gray-600))',
  				700: 'hsl(var(--gray-700))',
  				800: 'hsl(var(--gray-800))',
  				900: 'hsl(var(--gray-900))',
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			google: {
  				blue: 'hsl(var(--google-blue))',
  				green: 'hsl(var(--google-green))',
  				yellow: 'hsl(var(--google-yellow))',
  				red: 'hsl(var(--google-red))',
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} 