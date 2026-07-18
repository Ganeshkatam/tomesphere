import { InMemorySearchRepository } from './InMemorySearchRepository';
import { SearchQuery } from '../../../domain/value-objects/SearchQuery';
import { BookSearchDocument } from '../../models/BookSearchDocument';
import { DefaultRankingPolicy } from '../../../domain/policies/RankingPolicy';
import { SearchBooksHandler } from '../../../application/queries/SearchBooks/handler';

describe('Search Behavior & Semantics', () => {
    let repository: InMemorySearchRepository;
    let rankingPolicy: DefaultRankingPolicy;
    let handler: SearchBooksHandler;

    beforeEach(() => {
        repository = new InMemorySearchRepository();
        rankingPolicy = new DefaultRankingPolicy();
        handler = new SearchBooksHandler(repository, rankingPolicy);
    });

    const createDoc = (id: string, title: string, desc: string, authors: string[] = ['Author'], cats: string[] = ['Fiction'], lang: string = 'en'): BookSearchDocument => ({
        bookId: id,
        title,
        description: desc,
        authors,
        categories: cats,
        language: lang,
        keywords: [title.toLowerCase(), desc.toLowerCase(), ...authors.map(a => a.toLowerCase())],
        availabilityStatus: 'available',
        popularityScore: 0,
        rating: 0,
    });

    it('rejects empty query', () => {
        expect(() => SearchQuery.create({ text: '' })).toThrow('Search query must have either text or filters');
    });

    it('pagination is deterministic', async () => {
        for (let i = 0; i < 15; i++) {
            await repository.index(createDoc(`id-${i.toString().padStart(2, '0')}`, 'Test Book', 'Desc'));
        }

        const q1 = await handler.execute({ request: { text: 'Test', pagination: { limit: 5, offset: 0 } } });
        const q2 = await handler.execute({ request: { text: 'Test', pagination: { limit: 5, offset: 5 } } });
        
        expect(q1.success).toBe(true);
        expect(q2.success).toBe(true);
        if (q1.success && q2.success) {
            expect(q1.data.results).toHaveLength(5);
            expect(q2.data.results).toHaveLength(5);
            // Ensure no overlap
            const ids1 = new Set(q1.data.results.map(r => r.bookId));
            const overlap = q2.data.results.some(r => ids1.has(r.bookId));
            expect(overlap).toBe(false);
            // Ensure stable ordering (00-04, then 05-09)
            expect(q1.data.results[0].bookId).toBe('id-00');
            expect(q2.data.results[0].bookId).toBe('id-05');
        }
    });

    it('ranking honors title matches over description matches', async () => {
        await repository.index(createDoc('1', 'The Magic Ring', 'A book about something else.'));
        await repository.index(createDoc('2', 'Some Other Book', 'A story containing a magic ring.'));

        const result = await handler.execute({ request: { text: 'Magic Ring' } });
        
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.results).toHaveLength(2);
            // The one with "Magic Ring" in title should score higher (be first)
            expect(result.data.results[0].bookId).toBe('1');
            expect(result.data.results[1].bookId).toBe('2');
        }
    });

    it('filters combine correctly (author + category + language)', async () => {
        await repository.index(createDoc('1', 'Book 1', 'Desc', ['Alice'], ['Sci-Fi'], 'en'));
        await repository.index(createDoc('2', 'Book 2', 'Desc', ['Bob'], ['Sci-Fi'], 'en'));
        await repository.index(createDoc('3', 'Book 3', 'Desc', ['Alice'], ['Fantasy'], 'en'));
        await repository.index(createDoc('4', 'Book 4', 'Desc', ['Alice'], ['Sci-Fi'], 'fr'));

        const result = await handler.execute({ 
            request: { 
                text: 'Book',
                filters: {
                    authors: ['Alice'],
                    categories: ['Sci-Fi'],
                    language: 'en'
                }
            } 
        });
        
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.results).toHaveLength(1);
            expect(result.data.results[0].bookId).toBe('1');
        }
    });

    it('index lifecycle works', async () => {
        await repository.index(createDoc('1', 'Original Title', 'Original Desc'));
        let res = await handler.execute({ request: { text: 'Original' } });
        expect((res as any).data.results).toHaveLength(1);

        await repository.updateIndex('1', { title: 'Updated Title' });
        // Since InMemorySearchRepository doesn't automatically recompute keywords on update, 
        // we'll manually test if title changed. In reality, UpdateIndexedBook command recalculates keywords.
        const doc = await repository['documents'].get('1');
        expect(doc?.title).toBe('Updated Title');

        await repository.removeIndex('1');
        res = await handler.execute({ request: { text: 'Updated Title' } }); // using filters to bypass empty check
        expect((res as any).data.results).toHaveLength(0);
    });
});
