export class OpenAIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'OpenAIError';
  }
}

export interface OpenAIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// OpenAI pricing for GPT-4o mini (as of 2024)
// https://openai.com/api/pricing/
const GPT_4O_MINI_PRICING = {
  input: 0.60 / 1000000,    // $0.60 per 1M input tokens
  cachedInput: 0.30 / 1000000, // $0.30 per 1M cached input tokens
  output: 2.40 / 1000000,   // $2.40 per 1M output tokens
};

export function calculateOpenAICost(usage: {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cached_tokens?: number; // Optional cached tokens
}): {
  inputCost: number;
  outputCost: number;
  cachedCost: number;
  totalCost: number;
  costBreakdown: string;
  pricingReference: string;
} {
  const cachedTokens = usage.cached_tokens || 0;
  const regularInputTokens = usage.prompt_tokens - cachedTokens;
  
  const inputCost = regularInputTokens * GPT_4O_MINI_PRICING.input;
  const cachedCost = cachedTokens * GPT_4O_MINI_PRICING.cachedInput;
  const outputCost = usage.completion_tokens * GPT_4O_MINI_PRICING.output;
  const totalCost = inputCost + cachedCost + outputCost;
  
  let costBreakdown = `Input: ${regularInputTokens} tokens ($${inputCost.toFixed(6)})`;
  if (cachedTokens > 0) {
    costBreakdown += ` + Cached: ${cachedTokens} tokens ($${cachedCost.toFixed(6)})`;
  }
  costBreakdown += ` + Output: ${usage.completion_tokens} tokens ($${outputCost.toFixed(6)}) = Total: $${totalCost.toFixed(6)}`;
  
  const pricingReference = `Pricing: Input $0.60/1M tokens, Cached $0.30/1M tokens, Output $2.40/1M tokens`;
  
  return {
    inputCost,
    outputCost,
    cachedCost,
    totalCost,
    costBreakdown,
    pricingReference
  };
}

export class OpenAI {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.baseURL = 'https://api.openai.com/v1';
  }

  async chatCompletion(params: {
    systemPrompt: string;
    userPrompt: string;
    responseFormat?: 'text' | 'json_object';
    temperature?: number;
  }): Promise<OpenAIResponse> {
    const { systemPrompt, userPrompt, responseFormat = 'text', temperature = 0.1 } = params;

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature,
          response_format: responseFormat === 'json_object' ? { type: 'json_object' } : undefined,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new OpenAIError(
          errorData.error?.message || `OpenAI API error: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new OpenAIError('No content received from OpenAI');
      }

      return {
        content,
        usage: data.usage,
      };
    } catch (error) {
      if (error instanceof OpenAIError) {
        throw error;
      }
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new OpenAIError('Request timeout - OpenAI API took too long to respond');
        }
        if (error.message.includes('fetch')) {
          throw new OpenAIError('Network error - Unable to connect to OpenAI API');
        }
      }
      
      throw new OpenAIError(`OpenAI API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
