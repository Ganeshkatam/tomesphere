"use client";

import { ArrowRight } from "lucide-react";
import BookCard from "@/modules/reading/books/components/BookCard";
import { DiscoveryOverviewDto } from "@/modules/discovery/application/queries/GetDiscoveryOverview/read-model";
import { AnnouncementDto } from "@/modules/announcements/application/dto/AnnouncementDto";
import { PlatformStatisticsDto } from "@/modules/statistics/application/queries/GetPlatformStatistics/read-model";

interface LandingCuratedSectionsProps {
  overview: DiscoveryOverviewDto;
  announcements: AnnouncementDto[];
  statistics: PlatformStatisticsDto;
}

export default function LandingCuratedSections({
  overview,
  announcements,
  statistics,
}: LandingCuratedSectionsProps) {
  const { featuredBooks, trendingBooks, newBooks, featuredCollections, genres, authors, subjects, languages } = overview;

  return (
    <div className="w-full relative z-20 flex flex-col gap-24 py-16">
      
      {/* 1. Featured Books */}
      {featuredBooks && featuredBooks.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Featured Books</h2>
              <p className="text-[var(--text-secondary)] mt-2">Editor-picked selections for you.</p>
            </div>
            <a href="/discover/featured" className="text-sm font-semibold text-primary hover:text-primary-light transition-colors flex items-center gap-1">
              View all <ArrowRight size={16} />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {featuredBooks.slice(0, 6).map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Trending Now */}
      {trendingBooks && trendingBooks.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Trending Now</h2>
              <p className="text-[var(--text-secondary)] mt-2">The most popular books right now.</p>
            </div>
            <a href="/discover/trending" className="text-sm font-semibold text-primary hover:text-primary-light transition-colors flex items-center gap-1">
              View all <ArrowRight size={16} />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {trendingBooks.slice(0, 6).map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Featured Collections */}
      {featuredCollections && featuredCollections.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Featured Collections</h2>
              <p className="text-[var(--text-secondary)] mt-2">Curated reading lists to explore.</p>
            </div>
            <a href="/discover/collections" className="text-sm font-semibold text-primary hover:text-primary-light transition-colors flex items-center gap-1">
              View all <ArrowRight size={16} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCollections.slice(0, 3).map((collection, i) => (
              <div key={i} className="h-40 bg-[var(--surface-raised)] rounded-2xl border border-[var(--border-default)] flex items-center justify-center">
                <span className="text-[var(--text-secondary)]">Collection Preview</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Recently Added */}
      {newBooks && newBooks.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Recently Added</h2>
              <p className="text-[var(--text-secondary)] mt-2">The newest additions to our library.</p>
            </div>
            <a href="/discover/new" className="text-sm font-semibold text-primary hover:text-primary-light transition-colors flex items-center gap-1">
              View all <ArrowRight size={16} />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {newBooks.slice(0, 6).map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Browse by Genre */}
      {genres && genres.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Browse by Genre</h2>
              <p className="text-[var(--text-secondary)] mt-2">Explore specific subjects.</p>
            </div>
            <a href="/discover/genres" className="text-sm font-semibold text-primary hover:text-primary-light transition-colors flex items-center gap-1">
              View all <ArrowRight size={16} />
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            {genres.map(genre => (
              <a key={genre} href={`/discover/genres/${genre.toLowerCase().replace(/\s+/g, '-')}`} className="px-6 py-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] hover:border-primary transition-colors text-[var(--text-primary)] font-medium">
                {genre}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 6. Popular Authors */}
      {authors && authors.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Popular Authors</h2>
              <p className="text-[var(--text-secondary)] mt-2">Discover prolific writers in our catalog.</p>
            </div>
            <a href="/discover/authors" className="text-sm font-semibold text-primary hover:text-primary-light transition-colors flex items-center gap-1">
              View all <ArrowRight size={16} />
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            {authors.map(author => (
              <a key={author} href={`/discover/authors/${author.toLowerCase().replace(/\s+/g, '-')}`} className="px-6 py-3 rounded-full bg-[var(--surface-raised)] border border-[var(--border-default)] hover:border-primary transition-colors text-[var(--text-primary)] font-medium">
                {author}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 6.5. Browse by Subject */}
      {subjects && subjects.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Browse by Subject</h2>
              <p className="text-[var(--text-secondary)] mt-2">Explore academic and technical subjects.</p>
            </div>
            <a href="/discover/subjects" className="text-sm font-semibold text-primary hover:text-primary-light transition-colors flex items-center gap-1">
              View all <ArrowRight size={16} />
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            {subjects.map(subject => (
              <a key={subject} href={`/discover/subjects/${subject.toLowerCase().replace(/\s+/g, '-')}`} className="px-6 py-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] hover:border-primary transition-colors text-[var(--text-primary)] font-medium">
                {subject}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 6.6. Browse by Language */}
      {languages && languages.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Languages</h2>
              <p className="text-[var(--text-secondary)] mt-2">Find books in your preferred language.</p>
            </div>
            <a href="/discover/languages" className="text-sm font-semibold text-primary hover:text-primary-light transition-colors flex items-center gap-1">
              View all <ArrowRight size={16} />
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            {languages.map(language => (
              <a key={language} href={`/discover/languages/${language.toLowerCase().replace(/\s+/g, '-')}`} className="px-6 py-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] hover:border-primary transition-colors text-[var(--text-primary)] font-medium">
                {language.toUpperCase()}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 7. Announcements */}
      {announcements && announcements.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
          <h2 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-8">Announcements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.slice(0, 2).map((announcement) => (
              <div key={announcement.id} className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-default)]">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${announcement.type === 'info' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                    {announcement.type.toUpperCase()}
                  </span>
                  <span className="text-sm text-[var(--text-tertiary)]">
                    {new Date(announcement.startsAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{announcement.title}</h3>
                <p className="text-[var(--text-secondary)]">{announcement.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Platform Statistics */}
      {statistics && (
        <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full mb-12">
          <div className="p-10 rounded-3xl bg-gradient-to-r from-[var(--surface-raised)] to-[var(--surface-default)] border border-[var(--border-default)] grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl sm:text-5xl font-display font-bold text-primary mb-3">{(statistics.booksCount || 0).toLocaleString()}+</p>
              <p className="text-[var(--text-secondary)] font-medium">Books Available</p>
            </div>
            <div className="md:border-l md:border-r border-[var(--border-default)]">
              <p className="text-4xl sm:text-5xl font-display font-bold text-accent mb-3">{(statistics.authorsCount || 0).toLocaleString()}+</p>
              <p className="text-[var(--text-secondary)] font-medium">Authors</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-display font-bold text-secondary mb-3">{(statistics.genresCount || 0).toLocaleString()}+</p>
              <p className="text-[var(--text-secondary)] font-medium">Genres</p>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
