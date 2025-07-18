# COMPLai - AI-powered Employment Contract Compliance Platform

COMPLai is a SaaS platform that helps businesses generate and audit employment contracts with AI-powered compliance checking for U.S. labor laws.

## 🚀 Features

- **Contract Generator**: Create legally compliant employment contracts tailored to each state and role
- **AI Legal Auditor**: Upload existing contracts for AI-powered compliance analysis
- **E-signature Integration**: Send contracts for digital signing via PandaDoc
- **Legal Update Alerts**: Get notified when laws change and contracts become non-compliant
- **Vector Search**: Semantic search of labor laws using Pinecone and OpenAI embeddings

## 🛠 Tech Stack

- **Frontend**: Next.js 15.3+ (App Router) / React 19 / TypeScript 5
- **Styling**: Tailwind CSS 4 / shadcn/ui / lucide-react
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Vector DB**: Pinecone
- **AI**: OpenAI (GPT-4 + embeddings)
- **E-signature**: PandaDoc API
- **Hosting**: Vercel

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Pinecone account
- OpenAI API key
- PandaDoc account

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd complai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key

   # Pinecone Configuration
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_pinecone_environment
   PINECONE_INDEX_NAME=complai-legal-embeddings

   # PandaDoc Configuration
   PANDADOC_API_KEY=your_pandadoc_api_key
   PANDADOC_WORKSPACE_ID=your_pandadoc_workspace_id
   ```

4. **Set up Supabase Database**

   - Create a new Supabase project
   - Run the database migrations (see `supabase/migrations/`)
   - Set up Row Level Security (RLS) policies

5. **Set up Pinecone**

   - Create a new Pinecone index named `complai-legal-embeddings`
   - Use dimension 1536 for OpenAI embeddings
   - Set metric to `cosine`

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── custom/            # Custom components
│   └── forms/             # Form components
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   ├── pinecone.ts        # Pinecone client
│   ├── openai.ts          # OpenAI client
│   └── utils.ts           # Utility functions
├── types/                 # TypeScript type definitions
│   └── database.ts        # Database schema types
└── utils/                 # Additional utilities
```

## 🔧 Development

### Code Style

- Use TypeScript for all files
- Follow ESLint configuration
- Use shadcn/ui components as the foundation
- Use `cn` utility for class composition
- Use `cva` for component variants

### Component Guidelines

- Use Server Components when possible
- Only use `'use client'` when necessary (e.g., hooks)
- All components must be strictly typed
- Use lucide-react for icons

### Database Schema

The application uses the following main tables:

- `users` - User accounts and profiles
- `contracts` - Employment contracts
- `contract_audits` - Audit results
- `audit_findings` - Individual compliance findings
- `legal_updates` - Legal regulation changes
- `user_notifications` - User notifications

## 🚀 Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

Make sure all environment variables are set in your deployment platform:

- Supabase configuration
- OpenAI API key
- Pinecone configuration
- PandaDoc API credentials

## 📚 API Documentation

### Contract Generation

- `POST /api/contracts/generate` - Generate new contract
- `GET /api/contracts` - List user contracts
- `GET /api/contracts/[id]` - Get contract details

### Contract Auditing

- `POST /api/contracts/[id]/audit` - Audit contract compliance
- `GET /api/contracts/[id]/audit` - Get audit results

### Legal Updates

- `GET /api/legal-updates` - Get legal updates
- `POST /api/legal-updates/check` - Check for new updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@complai.com or create an issue in the repository.
