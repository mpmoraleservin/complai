-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contracts table
CREATE TABLE public.contracts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    state TEXT NOT NULL,
    job_type TEXT NOT NULL,
    schedule_type TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'signed', 'expired')),
    pandadoc_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contract_audits table
CREATE TABLE public.contract_audits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
    audit_type TEXT NOT NULL CHECK (audit_type IN ('compliance', 'legal_update')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_findings table
CREATE TABLE public.audit_findings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    audit_id UUID REFERENCES public.contract_audits(id) ON DELETE CASCADE NOT NULL,
    clause TEXT NOT NULL,
    issue_type TEXT NOT NULL CHECK (issue_type IN ('compliance', 'recommendation', 'warning')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    legal_citation TEXT,
    suggested_fix TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create legal_updates table
CREATE TABLE public.legal_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    state TEXT NOT NULL,
    law_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    effective_date DATE NOT NULL,
    impact_level TEXT NOT NULL CHECK (impact_level IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_notifications table
CREATE TABLE public.user_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('legal_update', 'contract_expiry', 'audit_complete')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_contracts_user_id ON public.contracts(user_id);
CREATE INDEX idx_contracts_state ON public.contracts(state);
CREATE INDEX idx_contracts_status ON public.contracts(status);
CREATE INDEX idx_contract_audits_contract_id ON public.contract_audits(contract_id);
CREATE INDEX idx_audit_findings_audit_id ON public.audit_findings(audit_id);
CREATE INDEX idx_legal_updates_state ON public.legal_updates(state);
CREATE INDEX idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX idx_user_notifications_read ON public.user_notifications(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own contracts
CREATE POLICY "Users can view own contracts" ON public.contracts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contracts" ON public.contracts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contracts" ON public.contracts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contracts" ON public.contracts FOR DELETE USING (auth.uid() = user_id);

-- Users can only see audits for their own contracts
CREATE POLICY "Users can view own contract audits" ON public.contract_audits FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.contracts 
        WHERE contracts.id = contract_audits.contract_id 
        AND contracts.user_id = auth.uid()
    )
);
CREATE POLICY "Users can insert own contract audits" ON public.contract_audits FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.contracts 
        WHERE contracts.id = contract_audits.contract_id 
        AND contracts.user_id = auth.uid()
    )
);

-- Users can only see findings for their own contract audits
CREATE POLICY "Users can view own audit findings" ON public.audit_findings FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.contract_audits 
        JOIN public.contracts ON contracts.id = contract_audits.contract_id
        WHERE contract_audits.id = audit_findings.audit_id 
        AND contracts.user_id = auth.uid()
    )
);
CREATE POLICY "Users can insert own audit findings" ON public.audit_findings FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.contract_audits 
        JOIN public.contracts ON contracts.id = contract_audits.contract_id
        WHERE contract_audits.id = audit_findings.audit_id 
        AND contracts.user_id = auth.uid()
    )
);

-- Legal updates are public (read-only)
CREATE POLICY "Anyone can view legal updates" ON public.legal_updates FOR SELECT USING (true);

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON public.user_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.user_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON public.user_notifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 