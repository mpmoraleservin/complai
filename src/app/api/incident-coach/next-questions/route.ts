import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OpenAI } from '@/lib/ai/openai';
import { DemoAI } from '@/lib/ai/demo';
import { getSystemPromptForQuestions } from '@/lib/ai/prompts';
import { readFileSync } from 'fs';
import { join } from 'path';

// Input validation schema
const NextQuestionsInputSchema = z.object({
  basics: z.object({
    whatHappened: z.string().min(1),
    involvedParties: z.array(z.string()).min(1),
    location: z.string().min(1),
    datetime: z.string().min(1),
    attachments: z.array(z.object({
      name: z.string(),
      url: z.string().optional()
    })).optional()
  }),
  history: z.array(z.object({
    question: z.string(),
    answer: z.string()
  }))
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate input
    const body = await request.json();
    const validatedInput = NextQuestionsInputSchema.parse(body);
    
    // Read handbook content (GPT-4o-mini can handle the full handbook)
    const handbookPath = join(process.cwd(), 'src', 'data', 'handbook.md');
    let handbookContent = '';
    
    try {
      handbookContent = readFileSync(handbookPath, 'utf-8');
      console.log('Using full handbook with GPT-4o-mini (128K context)');
    } catch (error) {
      // Fallback to concise version if original not found
      try {
        const conciseHandbookPath = join(process.cwd(), 'src', 'data', 'handbook-concise.md');
        handbookContent = readFileSync(conciseHandbookPath, 'utf-8');
        console.warn('Using concise handbook as fallback');
      } catch (fallbackError) {
        console.warn('Could not read any handbook, using default content');
        handbookContent = 'Company policies and procedures for incident management.';
      }
    }

    // Build user prompt
    const userPrompt = `CONTEXT:
---
Incident basics provided so far:
- What happened: ${validatedInput.basics.whatHappened}
- Parties involved: ${validatedInput.basics.involvedParties.join(', ')}
- Location: ${validatedInput.basics.location}
- Datetime: ${validatedInput.basics.datetime}

Previous Q/A exchanges:
${validatedInput.history.map(qa => `- Q: ${qa.question}\n  A: ${qa.answer}`).join('\n')}
---

Please provide follow-up questions to gather missing information for risk assessment and policy compliance.`;

    // Check if we have OpenAI API key from user or environment
    const userAPIKey = request.headers.get('x-openai-api-key');
    const hasOpenAIKey = userAPIKey || (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'tu_api_key_aqui');
    
    if (hasOpenAIKey) {
      // Use real OpenAI
      const systemPrompt = getSystemPromptForQuestions(handbookContent);
      const openai = new OpenAI(userAPIKey || undefined);
      const response = await openai.chatCompletion({
        systemPrompt,
        userPrompt,
        responseFormat: 'json_object',
        temperature: 0.1
      });

      // Parse response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response.content);
      } catch (error) {
        throw new Error('Invalid JSON response from OpenAI');
      }

      // Validate response structure
      if (!Array.isArray(parsedResponse.questions)) {
        throw new Error('Invalid response structure from OpenAI');
      }

      return NextResponse.json({
        questions: parsedResponse.questions,
        rationale: parsedResponse.rationale
      });
    } else {
      // Use demo mode
      const demoAI = new DemoAI();
      const response = await demoAI.getNextQuestions(validatedInput.basics, validatedInput.history);
      
      return NextResponse.json(response);
    }

  } catch (error) {
    console.error('Error in next-questions API:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
