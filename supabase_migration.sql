-- Create the pastes table
CREATE TABLE IF NOT EXISTS public.pastes (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT NOT NULL,
    language TEXT DEFAULT 'text',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_private BOOLEAN DEFAULT false,
    password TEXT,
    view_count INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS pastes_created_at_idx ON public.pastes(created_at DESC);
CREATE INDEX IF NOT EXISTS pastes_is_private_idx ON public.pastes(is_private);
CREATE INDEX IF NOT EXISTS pastes_expires_at_idx ON public.pastes(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.pastes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public pastes are viewable by everyone" ON public.pastes
    FOR SELECT USING (is_private = false OR is_private IS NULL);

CREATE POLICY "All pastes are viewable with direct ID access" ON public.pastes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create pastes" ON public.pastes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update view count" ON public.pastes
    FOR UPDATE USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.pastes TO anon;
GRANT ALL ON public.pastes TO authenticated;