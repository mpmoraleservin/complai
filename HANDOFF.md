# Incident Coach Implementation - Handoff Guide

## Overview

This implementation adds an AI-assisted incident reporting flow to the COMPLai platform. Users complete a basic incident form, receive follow-up questions generated from handbook policies, and get an auto-generated final report.

## Files Created/Modified

### New Files

- `src/lib/types/incident.ts` - TypeScript schemas for incident data
- `src/lib/ai/prompts.ts` - AI prompt templates for questions and report generation
- `src/lib/ai/openai.ts` - OpenAI API wrapper
- `src/app/api/incident-coach/next-questions/route.ts` - API endpoint for follow-up questions
- `src/app/api/incident-coach/final-report/route.ts` - API endpoint for final report generation
- `src/data/handbook.md` - Company handbook content for AI reference
- `src/components/incident/IncidentStepper.tsx` - Main stepper component
- `src/components/incident/FollowUpQA.tsx` - Q&A component for AI follow-ups
- `HANDOFF.md` - This documentation file

### Modified Files

- `src/app/incident-coach/new/page.tsx` - Updated to use new IncidentStepper

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Install Dependencies

The implementation uses existing dependencies from the project:

- `zod` for validation
- `lucide-react` for icons
- `@radix-ui/react-*` components
- `tailwindcss` for styling

### 3. Run the Application

```bash
npm run dev
```

Navigate to `/incident-coach/new` to test the new stepper.

## Implementation Details

### Flow Overview

1. **Step 1**: Basic incident information (what happened, who was involved)
2. **Step 2**: Additional details (location, date/time, attachments)
3. **Step 3**: AI-generated follow-up questions based on handbook policies
4. **Step 4**: Final report with risk assessment, recommendations, and export options

### API Endpoints

#### POST `/api/incident-coach/next-questions`

- **Input**: `{ basics: IncidentBasics, history: QA[] }`
- **Output**: `{ questions: string[], rationale?: string }`
- **Purpose**: Generate contextual follow-up questions based on incident details and handbook policies

#### POST `/api/incident-coach/final-report`

- **Input**: `{ basics: IncidentBasics, qa: QA[] }`
- **Output**: `IncidentReport` object
- **Purpose**: Generate comprehensive incident report with risk assessment and recommendations

### Key Components

#### IncidentStepper

- Manages the 4-step flow
- Handles state transitions and validation
- Integrates with AI endpoints
- Provides export functionality (JSON and Markdown)

#### FollowUpQA

- Displays AI-generated questions one at a time
- Tracks answer history
- Supports question skipping
- Shows progress and navigation

### AI Integration

#### Prompts

- **Questions Prompt**: Guides AI to ask only necessary follow-up questions
- **Report Prompt**: Instructs AI to generate structured incident reports
- Both prompts include handbook content for policy compliance

#### OpenAI Wrapper

- Handles API calls with proper error handling
- Supports JSON response format for structured outputs
- Includes usage tracking and retry logic

### Data Models

#### IncidentBasics

```typescript
{
  whatHappened: string;
  involvedParties: string[];
  location: string;
  datetime: string;
  attachments?: { name: string; url?: string }[];
}
```

#### IncidentReport

```typescript
{
  incident_summary: string;
  detailed_account: string;
  involved_parties: string[];
  risk_level: "Low" | "Medium" | "High" | "Critical";
  risk_type: ("Operational" | "Legal" | "Reputational" | "Safety" | "Security")[];
  recommended_next_steps: string[];
  company_message: string;
  personalized_messages: Record<string, string>;
  policy_refs?: string[];
}
```

## Testing

### Manual Testing

1. Navigate to `/incident-coach/new`
2. Complete Step 1 with incident details
3. Complete Step 2 with location and time
4. Answer AI follow-up questions in Step 3
5. Review and export the final report in Step 4

### API Testing

Test the endpoints with curl:

```bash
# Test next-questions endpoint
curl -X POST http://localhost:3000/api/incident-coach/next-questions \
  -H "Content-Type: application/json" \
  -d '{
    "basics": {
      "whatHappened": "Employee reported harassment by coworker",
      "involvedParties": ["John Doe", "Jane Smith"],
      "location": "Office",
      "datetime": "2024-01-15T10:00:00"
    },
    "history": []
  }'

# Test final-report endpoint
curl -X POST http://localhost:3000/api/incident-coach/final-report \
  -H "Content-Type: application/json" \
  -d '{
    "basics": {
      "whatHappened": "Employee reported harassment by coworker",
      "involvedParties": ["John Doe", "Jane Smith"],
      "location": "Office",
      "datetime": "2024-01-15T10:00:00"
    },
    "qa": [
      {
        "question": "What type of harassment occurred?",
        "answer": "Verbal harassment and inappropriate comments"
      }
    ]
  }'
```

## Error Handling

### API Errors

- Input validation using Zod schemas
- OpenAI API error handling with custom error classes
- Graceful fallbacks for missing handbook content
- Proper HTTP status codes and error messages

### UI Errors

- Loading states for all async operations
- Error display with user-friendly messages
- Retry mechanisms for failed API calls
- Form validation with clear feedback

## Future Enhancements

### Potential Improvements

1. **Real-time streaming**: Implement streaming responses for better UX
2. **File uploads**: Add actual file upload functionality for attachments
3. **Database integration**: Store incident reports in Supabase
4. **User authentication**: Add user-specific incident tracking
5. **Advanced analytics**: Track incident patterns and trends
6. **Email notifications**: Send reports to relevant stakeholders
7. **Workflow automation**: Integrate with HR systems

### Technical Debt

1. **Rate limiting**: Add rate limiting for OpenAI API calls
2. **Caching**: Cache handbook content and common responses
3. **Testing**: Add comprehensive unit and integration tests
4. **Monitoring**: Add logging and monitoring for AI endpoints
5. **Security**: Add input sanitization and output validation

## Troubleshooting

### Common Issues

#### OpenAI API Errors

- Check that `OPENAI_API_KEY` is set correctly
- Verify API key has sufficient credits
- Check network connectivity

#### Handbook Not Found

- Ensure `src/data/handbook.md` exists
- Check file permissions
- Verify file encoding (UTF-8)

#### Component Import Errors

- Verify all imports are correct
- Check that all UI components are available
- Ensure TypeScript types are properly exported

### Debug Mode

Enable debug logging by adding to `.env.local`:

```bash
DEBUG=incident-coach:*
```

## Support

For questions or issues:

1. Check the console for error messages
2. Verify environment variables are set
3. Test API endpoints directly
4. Review the handbook content format
5. Check OpenAI API status and credits

## Architecture Notes

### Design Decisions

- **POC Approach**: Uses in-memory state management for simplicity
- **Modular Components**: Separated concerns for easy testing and maintenance
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **AI Integration**: Structured prompts for consistent outputs

### Performance Considerations

- **Lazy Loading**: Components load only when needed
- **Debounced Input**: Prevents excessive API calls
- **Optimistic Updates**: Immediate UI feedback
- **Error Boundaries**: Graceful error handling

### Security Considerations

- **Input Validation**: All inputs validated with Zod
- **API Key Protection**: Environment variable usage
- **XSS Prevention**: Sanitized outputs
- **Rate Limiting**: Consider implementing for production
