import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const generateEmbedding = async (text: string) => {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  
  return response.data[0].embedding
}

export const generateContractAnalysis = async (prompt: string, context: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a legal compliance expert specializing in U.S. employment law. Analyze the provided contract against relevant legal requirements and provide detailed feedback on compliance issues.',
      },
      {
        role: 'user',
        content: `Context: ${context}\n\nContract to analyze: ${prompt}`,
      },
    ],
    temperature: 0.1,
    max_tokens: 2000,
  })
  
  return response.choices[0].message.content
} 