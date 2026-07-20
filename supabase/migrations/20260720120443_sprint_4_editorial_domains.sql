-- Sprint 4: Editorial Domains

-- 1. Languages
CREATE TABLE public.languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    native_name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Migrate existing books.language to use language_id
ALTER TABLE public.books ADD COLUMN language_id UUID REFERENCES public.languages(id) ON DELETE SET NULL;

-- Backfill languages if any exist (a bit tricky if we just have string names like "English" vs code)
-- For now we'll just insert a default English and link it to any books that have language 'English' or 'en'
INSERT INTO public.languages (code, name, native_name) VALUES 
('en', 'English', 'English'),
('es', 'Spanish', 'Español'),
('fr', 'French', 'Français'),
('de', 'German', 'Deutsch'),
('pt', 'Portuguese', 'Português');

UPDATE public.books b
SET language_id = l.id
FROM public.languages l
WHERE LOWER(b.language) = LOWER(l.name) OR LOWER(b.language) = LOWER(l.code);

-- 2. Collections (Editorial)
CREATE TABLE public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.collection_books (
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (collection_id, book_id)
);

-- 3. Featured Books (Source of Truth)
CREATE TABLE public.featured_books (
    book_id UUID PRIMARY KEY REFERENCES public.books(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Security
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read languages" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Public read collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Public read collection_books" ON public.collection_books FOR SELECT USING (true);
CREATE POLICY "Public read featured_books" ON public.featured_books FOR SELECT USING (true);

-- Admin write policies (Service Role only access usually, but for consistency if we want Admin users we can add it, or we rely on the Server Actions using service_role)
-- The Server Actions use the service_role key, so they bypass RLS anyway.
