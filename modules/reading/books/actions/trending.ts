import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { SupabaseBookRepository } from '../infrastructure/SupabaseBookRepository';
import { getTrendingBooks as getTrendingBooksUseCase } from '../application/queries/GetTrendingBooks/handler';
import { GetTrendingBooksOutput } from '../application/queries/GetTrendingBooks/read-model';

export async function getTrendingBooks(limit: number = 10): Promise<GetTrendingBooksOutput> {
    const supabase = await createSupabaseServerClient();
    
    // TEMPORARY: Manual Composition Root for Phase 4
    // In Phase 5/6, this will be injected via a centralized factory.
    const bookRepository = new SupabaseBookRepository(supabase);

    // Orchestrate use case
    return getTrendingBooksUseCase(bookRepository, limit);
}
