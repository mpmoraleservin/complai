// Server-side config
export const config = {
  isDemoMode: !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'tu_api_key_aqui' || process.env.OPENAI_API_KEY === '',
  hasOpenAIKey: !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'tu_api_key_aqui' && process.env.OPENAI_API_KEY !== ''),
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  environment: process.env.NODE_ENV || 'development',
  aiModel: 'gpt-4o-mini' // Using GPT-4o-mini (GPT-5 nano not yet available)
}

// Client-side config (for browser)
export const clientConfig = {
  isDemoMode: typeof window !== 'undefined' ? true : false, // We'll detect this via API call
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  environment: process.env.NODE_ENV || 'development'
}
