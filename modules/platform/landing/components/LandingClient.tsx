'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { Menu, X, Compass, GraduationCap, LayoutDashboard, Library, UserCircle, Zap } from 'lucide-react';
import ALL_GENRES from '@/modules/reading/books/types/genres';
import VoiceInput from '@/modules/reading/search/components/VoiceInput';
import SearchSuggestions from '@/modules/reading/search/components/SearchSuggestions';
import { getCurrentUser } from '@/modules/platform/authentication/actions/auth';

// Modular Components
import LandingHero from './LandingHero';
import LandingTrending from './LandingTrending';
import LandingGenreFilter from './LandingGenreFilter';
import LandingBookGrid from './LandingBookGrid';
import LandingFeatures from './LandingFeatures';
import LandingCuratedSections from './LandingCuratedSections';

// Lazy load heavy components
const StudentSection = dynamic(() => import('@/modules/planner/planner/components/StudentSection'), {
  loading: () => <div className="h-96 bg-white/5 animate-pulse rounded-xl" />
});

interface LandingClientProps {
  initialPopularBooks: any[];
  initialAllBooks: any[];
}

export default function LandingClient({ initialPopularBooks, initialAllBooks }: LandingClientProps) {
  const router = useRouter();

  // Data States
  const [popularBooks] = useState<any[]>(initialPopularBooks);
  const [allBooks] = useState<any[]>(initialAllBooks);
  const [filteredBooks, setFilteredBooks] = useState<any[]>(initialAllBooks);
  const [booksToShow, setBooksToShow] = useState(16);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genres] = useState<string[]>(ALL_GENRES && ALL_GENRES.length > 0 ? ALL_GENRES : ['Fiction', 'Non-Fiction', 'Mystery', 'Sci-Fi', 'Fantasy']);

  // UI States
  const [isSearchSticky, setIsSearchSticky] = useState(false);
  const [searchOrigin, setSearchOrigin] = useState<'book' | 'genre' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getCurrentUser();
      if (res.success && res.data) {
        setCurrentUser(res.data);
      }
    };
    fetchUser();
  }, []);

  // Build Fuse index once — amortized O(1) per search
  const fuseIndex = useMemo(() => {
    return new Fuse(allBooks, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'author', weight: 0.3 },
        { name: 'genre', weight: 0.1 },
        { name: 'description', weight: 0.1 },
      ],
      threshold: 0.35,
      distance: 200,
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }, [allBooks]);

  // Client-side Fuse.js search — runs <5ms for 1000 books
  const filterBooks = (search: string, genreFilters: string[]) => {
    let results = [...allBooks];

    if (search.trim()) {
      const fuseResults = fuseIndex.search(search);
      results = fuseResults.map(r => r.item);
    }

    if (genreFilters.length > 0) {
      results = results.filter(book => {
        if (!book.genre) return false;
        const bookGenre = book.genre.toLowerCase();
        return genreFilters.some(filter => bookGenre.includes(filter.toLowerCase()));
      });
    }

    if (!search.trim() && genreFilters.length === 0) {
      results = results.sort(() => Math.random() - 0.5);
    }

    setFilteredBooks(results);
  };

  const fetchBooks = (search: string, genreFilters: string[]) => {
    filterBooks(search, genreFilters);
  };

  const handleSearch = () => {
    // Real search → redirect to authoritative /search page
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      if (selectedGenres.length > 0) params.set('genre', selectedGenres.join(','));
      router.push(`/search?${params.toString()}`);
      return;
    }
    // No query → just filter locally with genres
    if (selectedGenres.length > 0) {
      fetchBooks('', selectedGenres);
      setSearchOrigin('genre');
      setTimeout(() => {
        document.getElementById('all-books-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      fetchBooks('', []);
    }
  };

  const handleBackToSearch = () => {
    const targetId = searchOrigin === 'genre' ? 'genre-section' : 'hero-search';
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    setSearchOrigin(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const genreSection = document.getElementById('genre-section');
      if (genreSection) {
        const rect = genreSection.getBoundingClientRect();
        setIsSearchSticky(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-page relative w-full max-w-full mx-auto overflow-x-hidden">

      {/* Sticky Search Bar */}
      {isSearchSticky && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-slate-900/90 glass-ultra border-b border-indigo-500/30 py-3 px-4 shadow-2xl shadow-indigo-500/20 animate-slideDown backdrop-blur-xl transition-[top] duration-300">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-3 items-start">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    fetchBooks(val, selectedGenres);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                  placeholder="Search title, author, or genre..."
                  className="w-full px-4 py-2 pl-10 pr-20 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all text-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        fetchBooks('', selectedGenres);
                      }}
                      className="text-slate-400 hover:text-white text-sm p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                      ✕
                    </button>
                  )}
                  <VoiceInput
                    onTranscript={(text) => setSearchQuery(text)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                  />
                </div>
                <SearchSuggestions
                  query={searchQuery}
                  localBooks={allBooks}
                  onSelect={(text, type, id) => {
                    if (type === 'book' && id) {
                      router.push(`/books/${id}`);
                    } else {
                      setSearchQuery(text);
                      router.push(`/search?q=${text}`);
                    }
                  }}
                  className="mt-1"
                />
              </div>

              <div className="relative">
                <select
                  value=""
                  onChange={(e) => {
                    const genre = e.target.value;
                    if (genre && !selectedGenres.includes(genre)) {
                      const newGenres = [...selectedGenres, genre];
                      setSelectedGenres(newGenres);
                      fetchBooks(searchQuery, newGenres);
                    }
                  }}
                  className="px-4 py-2 pr-8 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer min-w-[160px]"
                >
                  <option value="" className="bg-slate-900">Select Genre</option>
                  <optgroup label="📚 Popular Genres" className="bg-slate-900">
                    <option value="Fiction" className="bg-slate-900">Fiction</option>
                    <option value="Non-Fiction" className="bg-slate-900">Non-Fiction</option>
                    <option value="Romance" className="bg-slate-900">Romance</option>
                    <option value="Mystery" className="bg-slate-900">Mystery</option>
                    <option value="Thriller" className="bg-slate-900">Thriller</option>
                    <option value="Fantasy" className="bg-slate-900">Fantasy</option>
                    <option value="Science Fiction" className="bg-slate-900">Science Fiction</option>
                  </optgroup>
                  <optgroup label="🎓 Academic" className="bg-slate-900">
                    <option value="Computer Science" className="bg-slate-900">Computer Science</option>
                    <option value="Programming" className="bg-slate-900">Programming</option>
                    <option value="Mathematics" className="bg-slate-900">Mathematics</option>
                    <option value="Science" className="bg-slate-900">Science</option>
                  </optgroup>
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-300 hover:shadow-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>

            {selectedGenres.length > 0 && (
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-slate-400">Selected:</span>
                <div className="flex gap-1 flex-wrap">
                  {selectedGenres.map(g => (
                    <button
                      key={g}
                      onClick={() => {
                        const newGenres = selectedGenres.filter(genre => genre !== g);
                        setSelectedGenres(newGenres);
                        fetchBooks(searchQuery, newGenres);
                      }}
                      className="px-2 py-1 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/40 transition-colors flex items-center gap-1"
                    >
                      {g}
                      <span className="text-xs">✕</span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedGenres([]);
                      fetchBooks(searchQuery, []);
                    }}
                    className="px-2 py-1 text-slate-400 hover:text-white transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50 w-full">
        <div className="w-full max-w-[2000px] mx-auto px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-3xl sm:text-4xl lg:text-5xl transition-transform group-hover:scale-110">📚</span>
              <span className="text-xl sm:text-2xl lg:text-3xl font-display font-bold gradient-text">TomeSphere</span>
            </a>

            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              <a href="/discover" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-default)] hover:bg-[var(--surface-overlay)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                <Compass size={16} className="text-indigo-400" />
                <span>Explore</span>
              </a>
              <a
                href="#study-tools-section"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('study-tools-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-default)] hover:bg-[var(--surface-overlay)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
              >
                <GraduationCap size={16} className="text-purple-400" />
                <span>Study Tools</span>
              </a>
              {currentUser ? (
                <>
                  <a href="/home" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-default)] hover:bg-[var(--surface-overlay)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                    <LayoutDashboard size={16} className="text-emerald-400" />
                    <span>My Hub</span>
                  </a>
                  <a href="/library" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-default)] hover:bg-[var(--surface-overlay)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                    <Library size={16} className="text-sky-400" />
                    <span>My Library</span>
                  </a>
                  <div className="w-px h-6 bg-[var(--border-default)] mx-1" />
                  <a href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-default)] hover:bg-[var(--surface-overlay)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                    <UserCircle size={16} className="text-indigo-400" />
                    <span>Profile</span>
                  </a>
                </>
              ) : (
                <>
                  <div className="w-px h-6 bg-[var(--border-default)] mx-1" />
                  <a href="/login" className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    Sign In
                  </a>
                  <a href="/signup" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 transition-all">
                    Get Started Free
                  </a>
                </>
              )}
            </div>
 
            <div className="lg:hidden flex items-center gap-2">
              {currentUser ? (
                <a href="/profile" className="px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface-default)] rounded-lg border border-[var(--border-default)]">
                  Profile
                </a>
              ) : (
                <a href="/login" className="px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface-default)] rounded-lg border border-[var(--border-default)]">
                  Sign In
                </a>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl hover:bg-[var(--surface-overlay)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all border border-transparent hover:border-[var(--border-default)]"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-4/5 sm:w-80 bg-slate-900/95 backdrop-blur-2xl border-l border-white/10 z-[70] lg:hidden shadow-2xl animate-slideInRight">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-default)] bg-[var(--surface-default)]/5">
                <span className="text-xl font-display font-bold text-slate-50">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-[var(--surface-overlay)] text-slate-400 hover:text-slate-50 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                <a href="/discover" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-200 hover:bg-[var(--surface-overlay)] hover:text-slate-50 transition-all">
                  <Compass size={24} className="text-indigo-400" /><span className="font-medium text-lg">Explore</span>
                </a>
                <a href="#study-tools-section" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); document.getElementById('study-tools-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-200 hover:bg-[var(--surface-overlay)] hover:text-slate-50 transition-all">
                  <GraduationCap size={24} className="text-purple-400" /><span className="font-medium text-lg">Study Tools</span>
                </a>
                {currentUser ? (
                  <>
                    <a href="/home" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-200 hover:bg-[var(--surface-overlay)] hover:text-slate-50 transition-all">
                      <LayoutDashboard size={24} className="text-emerald-400" /><span className="font-medium text-lg">My Hub</span>
                    </a>
                    <a href="/library" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-200 hover:bg-[var(--surface-overlay)] hover:text-slate-50 transition-all">
                      <Library size={24} className="text-sky-400" /><span className="font-medium text-lg">My Library</span>
                    </a>
                    <a href="/profile" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-200 hover:bg-[var(--surface-overlay)] hover:text-slate-50 transition-all">
                      <UserCircle size={24} className="text-indigo-400" /><span className="font-medium text-lg">Profile</span>
                    </a>
                  </>
                ) : (
                  <>
                    <div className="my-4 border-t border-[var(--border-default)]" />
                    <a href="/login" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-200 hover:bg-[var(--surface-overlay)] hover:text-slate-50 transition-all">
                      <UserCircle size={24} className="text-slate-400" /><span className="font-medium text-lg">Sign In</span>
                    </a>
                  </>
                )}
              </div>
              <div className="p-6 border-t border-[var(--border-default)] bg-[var(--surface-default)]/5">
                {!currentUser && (
                  <a href="/signup" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all">
                    Get Started Free
                  </a>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
      `}</style>

      {/* Hero Section */}
      <LandingHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        fetchBooks={fetchBooks}
        selectedGenres={selectedGenres}
        allBooks={allBooks}
      />

      {searchQuery.trim() !== '' || selectedGenres.length > 0 || searchOrigin !== null ? (
        <>
          {/* Genre Filters */}
          <LandingGenreFilter
            genres={genres}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
            searchQuery={searchQuery}
            fetchBooks={fetchBooks}
            setSearchOrigin={setSearchOrigin}
          />

          {/* Search/Filtered Results Grid */}
          <LandingBookGrid
            filteredBooks={filteredBooks}
            allBooks={allBooks}
            loading={loading}
            selectedGenres={selectedGenres}
            searchOrigin={searchOrigin}
            handleBackToSearch={handleBackToSearch}
            booksToShow={booksToShow}
            setBooksToShow={setBooksToShow}
          />
        </>
      ) : (
        <>
          {/* Trending Books */}
          <LandingTrending popularBooks={popularBooks} />

          {/* Curated Guided Layout: Paths, Subjects & Collections */}
          <LandingCuratedSections allBooks={allBooks} />

          {/* Live Guest Workspace Dashboard Widgets */}
          <LandingFeatures />

          {/* Study Tools Workflow */}
          <StudentSection />
        </>
      )}

      {/* Premium CTA Section */}
      <section className="relative py-24 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-[#020617]" />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/40 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/30 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white drop-shadow-lg">
            Start Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Your Digital Library</span>
          </h2>
          <p className="text-xl mb-10 text-slate-200 max-w-2xl mx-auto font-medium">
            Join thousands of readers discovering, annotating, and learning from amazing books every single day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/signup" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] text-lg" style={{ color: '#0f172a' }}>
              Start Reading Free
            </a>
            <a href="/search" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 hover:border-white/40 backdrop-blur-md transition-all text-lg">
              Browse Library
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}



