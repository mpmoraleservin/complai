COMPLai – Cursor Rules for Development

Primary Mission

Your role as an AI assistant is to ensure that all code you generate for this project meets the highest standards of quality, legal safety, and technical consistency. Your goal is to build UI and business logic for a labor compliance platform using a modern stack tailored to our needs.

Main Tech Stack (Your Context)

Framework: Next.js 15.3+ (App Router) / React 19

Language: TypeScript 5

Styling: Tailwind CSS 4

UI Components: shadcn/ui

Iconography: lucide-react

Class management: clsx + tailwind-merge via the cn utility

Variants: class-variance-authority (CVA)

Backend/API: Next.js API Routes (or edge functions)

Database: Supabase (PostgreSQL)

Auth: Supabase Auth

Vector DB: Pinecone (for labor law embeddings per state)

AI: OpenAI (GPT-4 + embeddings)

E-signature: PandaDoc API

Directive 1 – UI with shadcn/ui

1.1. Component Composition

Always use shadcn/ui components as the visual foundation.

If the required component is missing, instruct the user to run npx shadcn-ui@latest add [component].

Store custom components in @/components/custom/.

1.2. Iconography

Always use icons from lucide-react. Never use inline SVGs or emojis as functional icons.

Directive 2 – Styling

2.1. cn Utility

Use cn to combine Tailwind classes with clsx and tailwind-merge. This utility lives in @/lib/utils.

import { cn } from "@/lib/utils";

<div className={cn("p-4", isActive && "bg-blue-100", className)}>
  {...}
</div>

2.2. Variants with cva

Define variants inline in the same component file using cva.

Directive 3 – AI Legal Logic and Compliance

3.1. Contract Workflows

The generator must produce contracts based on state, role, and shift type.

The AI auditor must use RAG with Pinecone + OpenAI to assess legality.

The system must notify users if a contract becomes invalid due to legal changes.

3.2. Legal Operation

Legal fragments must be vectorized and stored by state.

AI responses must include relevant citations from legal sources.

Directive 4 – Strictly Typed and Robust Code

All components must be strictly typed (no any).

Props must have explicit interfaces.

Use Server Components when possible. Only use 'use client' when necessary (e.g., hooks).

Directive 5 – External Integrations

5.1. PandaDoc

Documents are sent and tracked via the PandaDoc API.

Contract status must reflect in the UI (Pending, Signed, Expired).

5.2. Supabase

Use Supabase Auth for session and role management.

Store contracts, users, and audits in PostgreSQL.

Directive 6 – Format and Code Quality

Your code must pass ESLint without errors (eslint-config-next).

Follow mobile-first design principles.

Avoid duplicated components or unnecessary code. Prioritize reuse.

Executive Summary of Your Mission

All UI is built using shadcn/ui, Tailwind, and Radix.

Icons: always use lucide-react.

Use cn for all class composition.

Use strict TypeScript and follow App Router rules.

Do not generate code unless all dependencies are installed.

Legal compliance is non-negotiable: AI + Pinecone must back every audit.

Every contract must be signable with PandaDoc.

This is a legal-grade tool. Precision and robustness are your baseline.
