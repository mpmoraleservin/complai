import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DevModeBanner } from '@/components/ui/dev-mode-banner'
import { AuthProvider } from '@/lib/context/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'COMPLai - AI-powered Employment Contract Compliance',
  description: 'Generate and audit employment contracts with AI-powered compliance checking for U.S. labor laws.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DevModeBanner />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 