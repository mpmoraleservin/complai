import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!,
})

export const index = pinecone.index(process.env.PINECONE_INDEX_NAME!)

export const pineconeClient = pinecone 