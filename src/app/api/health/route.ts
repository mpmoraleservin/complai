import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    services: {
      supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      openai: !!process.env.OPENAI_API_KEY,
      pinecone: !!process.env.PINECONE_API_KEY,
      pandadoc: !!process.env.PANDADOC_API_KEY,
    }
  })
} 