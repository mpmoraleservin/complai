import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DevModeBanner } from '@/components/ui/dev-mode-banner'
import { AuthProvider } from '@/lib/context/auth-context'
import { ThemeProvider } from '@/lib/context/theme-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'COMPLai - AI-powered Employment Contract Compliance',
  description: 'Generate and audit employment documents with AI-powered compliance checking for U.S. labor laws.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <DevModeBanner />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 