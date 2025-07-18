import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  showLogo?: boolean
}

export function AuthLayout({ children, title, subtitle, showLogo = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {showLogo && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-purple-500 rounded-lg p-2">
                <span className="text-white font-bold text-xl">COMPLai</span>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
} 