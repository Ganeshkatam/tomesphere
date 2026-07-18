// Comprehensive list of all book genres curated for TomeSphere
export const ALL_GENRES = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'Technology',
    'History',
    'Business',
    'Philosophy',
    'Psychology',
    'Education',
    'Mystery & Thriller',
    'Science Fiction',
    'Fantasy',
    'Romance',
    'Biography',
    'Poetry & Art'
];

// Genre icons mapping
const GENRE_ICONS: Record<string, string> = {
    'Fiction': '📚',
    'Non-Fiction': '📖',
    'Science': '🔬',
    'Technology': '💻',
    'History': '🏛️',
    'Business': '💼',
    'Philosophy': '🤔',
    'Psychology': '🧠',
    'Education': '🎓',
    'Mystery & Thriller': '🔍',
    'Science Fiction': '🚀',
    'Fantasy': '🐉',
    'Romance': '💕',
    'Biography': '👤',
    'Poetry & Art': '🎨'
};

// Get genre config with icon and label
export function getGenreConfig(genre: string): { icon: string; label: string } {
    return {
        icon: GENRE_ICONS[genre] || '📕',
        label: genre
    };
}

// Get all genres
export function getAllGenres(): string[] {
    return ALL_GENRES;
}

// Export deduplicated array to prevent React duplicate key warnings
export default [...new Set(ALL_GENRES)] as string[];
