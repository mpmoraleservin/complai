# Handbooks API Integration

## Overview

This document describes the integration of the Handbooks API into the COMPLai platform, allowing users to create and manage employee handbooks through a guided form process.

## Features

### 1. Handbook Creation Flow

- **Template Selection**: Choose between "Comprehensive Multi-State Company" and "Small Single State Company" templates
- **Step-by-step Form**: 6-step guided process for collecting company information
- **Real-time Validation**: Form validation with error handling
- **API Integration**: Direct integration with Handbooks API for handbook generation

### 2. Handbook Management

- **Current Handbook Display**: View active handbook with key metrics
- **Handbook Viewer**: Interactive viewer with section navigation
- **Download Functionality**: PDF download capability
- **Version History**: Track previous handbook versions

### 3. Compliance Monitoring

- **Compliance Scoring**: Real-time compliance percentage
- **Status Tracking**: Active, Draft, and Archived statuses
- **Metrics Dashboard**: Visual representation of compliance data

## API Endpoints

### Create Handbook

- **Comprehensive Multi-State**: `POST /handbooks/comprehensive-multi-state`
- **Small Single State**: `POST /handbooks/small-single-state`

### Retrieve Handbook

- **Get Handbook**: `GET /handbooks/{handbook_id}`
- **Download PDF**: `GET /handbooks/{handbook_id}/pdf`

## Data Models

### Comprehensive Multi-State Company

```typescript
{
  companyName: string
  myState: string
  numberOfEmployees: string
  industry: string
  hrManager: string
  payrollManager: string
  fullTimeHours: number
  payPeriodFrequency: string
  performanceReviewPeriod: string
  trialPeriod: boolean
  trialPeriodDays: number
  paidHolidays: boolean
  paidHolidayNames: string
  vacationBenefits: boolean
  vacationBenefitEligibleMonths: number
  vacationBenefitCarryover: boolean
  sickLeave: boolean
  workersComp: boolean
  healthInsurance: boolean
  directDeposit: boolean
  multiState: boolean
  multiStateSelectedStates: string[]
  companyVehiclesPolicy: boolean
  socialMediaPolicy: boolean
  missionStatement: boolean
  missionStatementText: string
}
```

### Small Single State Company

```typescript
{
  companyName: string
  myState: string
  numberOfEmployees: string
  industry: string
  hrManager: string
  payrollManager: string
  fullTimeHours: number
  payPeriodFrequency: string
  performanceReviewPeriod: string
  trialPeriod: boolean
  trialPeriodDays: number
  paidHolidays: boolean
  paidHolidayNames: string
  vacationBenefits: boolean
  vacationBenefitType: string
  vacationBenefitEligibleMonths: number
  vacationBenefitCarryover: boolean
  sickLeave: boolean
  workersComp: boolean
  healthInsurance: boolean
  directDeposit: boolean
  multiState: boolean
  companyVehiclesPolicy: boolean
  socialMediaPolicy: boolean
  missionStatement: boolean
  missionStatementText: string
  industryPolicies: any[]
  healthInsurancePlans: any[]
  appendixConditions: Record<string, any>
}
```

## Form Steps

### Step 1: Template Selection

- Choose between comprehensive multi-state and small single state templates
- Template-specific logic and default values

### Step 2: Company Information

- Company name, state, employee count, industry
- HR and payroll manager titles

### Step 3: Employment Policies

- Full-time hours, pay period frequency
- Performance review period, trial period settings
- Basic benefits configuration

### Step 4: Benefits & Leave

- Paid holidays configuration
- Vacation benefits and accrual settings
- Sick leave policies

### Step 5: Additional Policies

- Company vehicles and social media policies
- Mission statement configuration
- Multi-state operations (for comprehensive template)

### Step 6: Review & Create

- Summary of all selections
- Final validation before API submission

## Environment Configuration

Create a `.env.local` file with the following variables:

```bash
# Handbooks API Configuration
NEXT_PUBLIC_HANDBOOKS_API_URL=https://api.handbooks.com
NEXT_PUBLIC_HANDBOOKS_API_KEY=your_api_key_here
```

## Usage

### Creating a New Handbook

1. Navigate to `/handbook/create`
2. Select your template type
3. Fill out the 6-step form
4. Review your selections
5. Submit to generate the handbook
6. Download the generated PDF

### Viewing Handbooks

1. Navigate to `/handbook`
2. View current active handbook
3. Access handbook viewer for detailed reading
4. Download PDF versions
5. Manage version history

## Error Handling

- **Form Validation**: Real-time validation with user-friendly error messages
- **API Errors**: Graceful handling of API failures with fallback options
- **Network Issues**: Retry logic and offline support considerations

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live compliance updates
- **Advanced Templates**: Additional handbook templates for specific industries
- **Collaboration**: Multi-user editing and approval workflows
- **Integration**: PandaDoc e-signature integration
- **Analytics**: Detailed compliance analytics and reporting

## Technical Implementation

### Files Structure

```
src/
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   └── handbooks-api.ts      # API service layer
├── hooks/
│   └── use-handbook-form.ts  # Form state management
└── app/handbook/
    ├── page.tsx              # Main handbook page
    └── create/
        └── page.tsx          # Creation flow
```

### Key Components

- **useHandbookForm**: Custom hook for form state management
- **HandbooksApiService**: Service class for API communication
- **MockHandbooksApiService**: Development/testing service
- **Form Steps**: Modular step components for the creation flow

### State Management

- React hooks for local state
- Form validation with error handling
- API integration with loading states
- Success/error feedback

## Testing

### Development Mode

- Uses `MockHandbooksApiService` for testing
- Simulated API delays and responses
- Mock PDF generation

### Production Mode

- Uses `HandbooksApiService` for real API calls
- Error handling and retry logic
- Real PDF downloads

## Security Considerations

- API key management through environment variables
- Input validation and sanitization
- Secure API communication (HTTPS)
- User authentication and authorization (future)

## Performance

- Lazy loading of form steps
- Optimized form validation
- Efficient state management
- Responsive design for mobile devices
