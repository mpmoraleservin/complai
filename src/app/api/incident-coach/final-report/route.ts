import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OpenAI, calculateOpenAICost } from '@/lib/ai/openai';
import { DemoAI } from '@/lib/ai/demo';
import { getSystemPromptForReport } from '@/lib/ai/prompts';
import { readFileSync } from 'fs';
import { join } from 'path';

// Input validation schema
const FinalReportInputSchema = z.object({
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
  qa: z.array(z.object({
    question: z.string(),
    answer: z.string()
  }))
});

// Response validation schema
const PolicyViolationSchema = z.object({
  policy_id_or_title: z.string(),
  policy_text: z.string(),
  violation_reason: z.string(),
  supporting_facts: z.array(z.string()),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
  recommended_remediation: z.array(z.string()),
  confidence: z.number().min(0).max(1)
});

const IncidentScoringFactorSchema = z.object({
  factor: z.string(),
  weight: z.number(),
  score: z.number().min(1).max(5),
  weightedScore: z.number(),
  criteria: z.string()
});

const IncidentScoreSchema = z.object({
  totalScore: z.number(),
  riskLevel: z.enum(['Low Risk', 'Moderate Risk', 'High Risk']),
  factors: z.array(IncidentScoringFactorSchema),
  explanation: z.string()
});

const PartyInfoSchema = z.object({
  name: z.string(),
  role: z.enum(['Complainant', 'Accused/Subject', 'Witness', 'Other']),
  relationship: z.string().optional()
});

const GeneralInformationSchema = z.object({
  incidentId: z.string(),
  reportDateTime: z.string(),
  reporterName: z.string(),
  reporterRole: z.string(),
  reporterContact: z.string(),
  relationshipToIncident: z.string()
});

const IncidentDetailsSchema = z.object({
  incidentDateTime: z.string(),
  location: z.string(),
  description: z.string(),
  howReporterBecameAware: z.string(),
  contextBackground: z.string().optional()
});

const ImpactConsequencesSchema = z.object({
  immediateImpact: z.array(z.string()),
  medicalTreatmentRequired: z.boolean(),
  medicalTreatmentDetails: z.string().optional(),
  lawEnforcementContacted: z.boolean(),
  lawEnforcementDetails: z.string().optional()
});

const PolicyCrossCheckSchema = z.object({
  relevantPolicySections: z.array(z.string()),
  policiesViolated: z.boolean(),
  violatedPolicies: z.array(z.string()).optional(),
  lastAcknowledgmentDates: z.record(z.string()),
  priorRelatedIncidents: z.boolean(),
  priorIncidentDates: z.array(z.string()).optional()
});

const IncidentReportSchema = z.object({
  // New structured sections
  incident_score: IncidentScoreSchema,
  general_information: GeneralInformationSchema,
  parties_involved: z.object({
    complainants: z.array(PartyInfoSchema),
    accused_subjects: z.array(PartyInfoSchema),
    witnesses: z.array(PartyInfoSchema)
  }),
  incident_details: IncidentDetailsSchema,
  impact_consequences: ImpactConsequencesSchema,
  policy_cross_check: PolicyCrossCheckSchema,
  
  // Legacy fields for backward compatibility
  incident_summary: z.string(),
  detailed_account: z.string(),
  involved_parties: z.array(z.string()),
  risk_level: z.enum(['Low', 'Medium', 'High', 'Critical']),
  risk_type: z.array(z.enum(['Operational', 'Legal', 'Reputational', 'Safety', 'Security'])),
  recommended_next_steps: z.array(z.string()),
  company_message: z.object({
    subject: z.string(),
    body: z.string()
  }),
  personalized_messages: z.record(z.object({
    subject: z.string(),
    body: z.string()
  })),
  policy_refs: z.array(z.string()).optional(),
  policy_violations: z.array(PolicyViolationSchema).optional(),
  defense_notes: z.string().optional(),
  evidence_summary: z.array(z.string()).optional(),
  notification_requirements: z.array(z.string()).optional()
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate input
    const body = await request.json();
    const validatedInput = FinalReportInputSchema.parse(body);
    
    // Read handbook content (GPT-4o-mini can handle the full handbook)
    const handbookPath = join(process.cwd(), 'src', 'data', 'handbook.md');
    let handbookContent = '';
    
    try {
      handbookContent = readFileSync(handbookPath, 'utf-8');
    } catch (error) {
      // Fallback to concise version if original not found
      try {
        const conciseHandbookPath = join(process.cwd(), 'src', 'data', 'handbook-concise.md');
        handbookContent = readFileSync(conciseHandbookPath, 'utf-8');
      } catch (fallbackError) {
        console.warn('Could not read any handbook, using default content');
        handbookContent = 'Company policies and procedures for incident management.';
      }
    }

    // Build user prompt
    const userPrompt = `CONTEXT:
---
Incident basics:
- What happened: ${validatedInput.basics.whatHappened}
- Parties involved: ${validatedInput.basics.involvedParties.join(', ')}
- Location: ${validatedInput.basics.location}
- Datetime: ${validatedInput.basics.datetime}

Follow-up Q/A:
${validatedInput.qa.map(qa => `- Q: ${qa.question}\n  A: ${qa.answer}`).join('\n')}
---

Please generate a comprehensive incident report based on this information and company policies.`;

    // Check if we have OpenAI API key from user or environment
    const userAPIKey = request.headers.get('x-openai-api-key');
    const hasOpenAIKey = userAPIKey || (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'tu_api_key_aqui' && process.env.OPENAI_API_KEY !== '');
    

    if (hasOpenAIKey && userAPIKey) {
      // Use real OpenAI
      const systemPrompt = getSystemPromptForReport(handbookContent);
      const openai = new OpenAI(userAPIKey || undefined);
      const response = await openai.chatCompletion({
        systemPrompt,
        userPrompt,
        responseFormat: 'json_object',
        temperature: 0.1
      });

      // Parse and validate response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response.content);
      } catch (error) {
        throw new Error('Invalid JSON response from OpenAI');
      }

      // Log token usage and cost for final report
      if (response.usage) {
        const cost = calculateOpenAICost(response.usage);
        console.log('📊 FINAL REPORT - Token Usage & Cost:');
        console.log(`   Tokens: ${response.usage.total_tokens} (Input: ${response.usage.prompt_tokens}, Output: ${response.usage.completion_tokens})`);
        console.log(`   Cost: $${cost.totalCost.toFixed(6)} (${cost.costBreakdown})`);
        console.log(`   ${cost.pricingReference}`);
        console.log(`   Report Sections Generated: 5 (Score, General Info, Incident Details, Impact, Policy Cross-Check)`);
      }

      // Validate response structure
      const validatedReport = IncidentReportSchema.parse(parsedResponse);
      
      // Add usage information to response
      return NextResponse.json({
        ...validatedReport,
        _usage: response.usage
      });
    } else {
      // Use demo mode
      try {
        const demoAI = new DemoAI();
        const response = await demoAI.generateFinalReport(validatedInput.basics, validatedInput.qa);
        
        // Validate demo response
        const validatedReport = IncidentReportSchema.parse(response);
        return NextResponse.json(validatedReport);
      } catch (demoError) {
        console.error('Demo mode error:', demoError);
        return NextResponse.json(
          { error: 'Demo mode error', message: demoError instanceof Error ? demoError.message : 'Unknown demo error' },
          { status: 500 }
        );
      }
    }

  } catch (error) {
    console.error('Error in final-report API:', error);
    
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
