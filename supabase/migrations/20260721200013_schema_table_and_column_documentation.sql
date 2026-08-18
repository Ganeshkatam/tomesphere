-- Migration: 20260721200013_schema_table_and_column_documentation.sql
-- Description: Comprehensive table and column comments / documentation across all public database objects

-- 1. annotations
COMMENT ON TABLE public.annotations IS 'User personal text annotations and notes linked to reading highlights or book page anchors.';
COMMENT ON COLUMN public.annotations.id IS 'Primary key identifier for the annotation.';
COMMENT ON COLUMN public.annotations.user_id IS 'Foreign key referencing the user who authored this annotation.';
COMMENT ON COLUMN public.annotations.book_id IS 'Foreign key referencing the book where this annotation is anchored.';
COMMENT ON COLUMN public.annotations.highlight_id IS 'Optional foreign key referencing a specific text highlight.';
COMMENT ON COLUMN public.annotations.location_anchor IS 'Structured JSON anchor (page, CFI, coordinates) for precise position in the reader.';
COMMENT ON COLUMN public.annotations.body_markdown IS 'Markdown-formatted user note content.';
COMMENT ON COLUMN public.annotations.created_at IS 'Timestamp when the annotation was created.';
COMMENT ON COLUMN public.annotations.updated_at IS 'Timestamp when the annotation was last updated.';

-- 2. announcements
COMMENT ON TABLE public.announcements IS 'Platform announcements, system alerts, and notification banners for users.';
COMMENT ON COLUMN public.announcements.id IS 'Primary key identifier for the announcement.';
COMMENT ON COLUMN public.announcements.title IS 'Headline title of the announcement.';
COMMENT ON COLUMN public.announcements.content IS 'Body copy or markdown content of the announcement.';
COMMENT ON COLUMN public.announcements.type IS 'Category or urgency type (info, warning, feature, maintenance).';
COMMENT ON COLUMN public.announcements.link_url IS 'Optional call-to-action destination URL.';
COMMENT ON COLUMN public.announcements.link_text IS 'Optional label for the call-to-action button.';
COMMENT ON COLUMN public.announcements.is_dismissible IS 'Whether users can dismiss this announcement banner.';
COMMENT ON COLUMN public.announcements.is_active IS 'Whether this announcement is currently live and displayed.';
COMMENT ON COLUMN public.announcements.starts_at IS 'Scheduled start timestamp for displaying the announcement.';
COMMENT ON COLUMN public.announcements.ends_at IS 'Scheduled expiration timestamp after which the announcement hides.';
COMMENT ON COLUMN public.announcements.created_at IS 'Timestamp when the announcement was created.';
COMMENT ON COLUMN public.announcements.updated_at IS 'Timestamp when the announcement was last modified.';
COMMENT ON COLUMN public.announcements.language IS 'Target language code for localized announcements.';

-- 3. authors
COMMENT ON TABLE public.authors IS 'Canonical catalog author entities and biographies.';
COMMENT ON COLUMN public.authors.id IS 'Primary key identifier for the author.';
COMMENT ON COLUMN public.authors.name IS 'Full normalized display name of the author.';
COMMENT ON COLUMN public.authors.slug IS 'URL-safe unique slug identifier for author profile routes.';
COMMENT ON COLUMN public.authors.bio IS 'Biographical description of the author.';
COMMENT ON COLUMN public.authors.avatar_url IS 'URL to the author portrait photo or avatar image.';
COMMENT ON COLUMN public.authors.created_at IS 'Timestamp when the author entity was registered.';
COMMENT ON COLUMN public.authors.updated_at IS 'Timestamp when the author entity was last updated.';

-- 4. book_authors
COMMENT ON TABLE public.book_authors IS 'Junction table linking books to their contributing authors with sequence ordering.';
COMMENT ON COLUMN public.book_authors.book_id IS 'Foreign key referencing the book.';
COMMENT ON COLUMN public.book_authors.author_id IS 'Foreign key referencing the author.';
COMMENT ON COLUMN public.book_authors.position IS 'Zero-based ordering position for primary and co-authors.';

-- 5. book_files
COMMENT ON TABLE public.book_files IS 'Canonical digital format binaries (PDF, EPUB, MOBI) and storage bucket references.';
COMMENT ON COLUMN public.book_files.id IS 'Primary key identifier for the file record.';
COMMENT ON COLUMN public.book_files.book_id IS 'Foreign key referencing the book this file belongs to.';
COMMENT ON COLUMN public.book_files.format IS 'File extension format (pdf, epub, mobi, txt).';
COMMENT ON COLUMN public.book_files.size IS 'Exact binary file size in bytes.';
COMMENT ON COLUMN public.book_files.created_at IS 'Timestamp when the file record was created.';
COMMENT ON COLUMN public.book_files.storage_path IS 'Path or URL of the file inside Supabase Storage.';
COMMENT ON COLUMN public.book_files.checksum IS 'Cryptographic hash (SHA256) for payload integrity verification.';
COMMENT ON COLUMN public.book_files.mime_type IS 'Standard MIME content type (e.g. application/pdf, application/epub+zip).';
COMMENT ON COLUMN public.book_files.version IS 'Sequential edition/ingestion version number.';
COMMENT ON COLUMN public.book_files.is_primary IS 'Flag indicating whether this is the default reader format.';
COMMENT ON COLUMN public.book_files.language IS 'Language code of this specific file edition.';

-- 6. book_genres
COMMENT ON TABLE public.book_genres IS 'Junction table linking books to their assigned literary genres.';
COMMENT ON COLUMN public.book_genres.book_id IS 'Foreign key referencing the book.';
COMMENT ON COLUMN public.book_genres.genre_id IS 'Foreign key referencing the genre category.';

-- 7. book_subjects
COMMENT ON TABLE public.book_subjects IS 'Junction table linking books to their academic or topical subjects.';
COMMENT ON COLUMN public.book_subjects.book_id IS 'Foreign key referencing the book.';
COMMENT ON COLUMN public.book_subjects.subject_id IS 'Foreign key referencing the subject topic.';

-- 8. bookmarks
COMMENT ON TABLE public.bookmarks IS 'User saved reading bookmarks on specific book pages.';
COMMENT ON COLUMN public.bookmarks.id IS 'Primary key identifier for the bookmark.';
COMMENT ON COLUMN public.bookmarks.user_id IS 'Foreign key referencing the user who created the bookmark.';
COMMENT ON COLUMN public.bookmarks.book_id IS 'Foreign key referencing the book.';
COMMENT ON COLUMN public.bookmarks.page_number IS 'Page number where the bookmark is saved.';
COMMENT ON COLUMN public.bookmarks.label IS 'Optional user custom label or note for the bookmark.';
COMMENT ON COLUMN public.bookmarks.created_at IS 'Timestamp when the bookmark was created.';

-- 9. books
COMMENT ON TABLE public.books IS 'Core catalog table storing published literature, textbooks, and metadata.';
COMMENT ON COLUMN public.books.id IS 'Primary key UUID identifier for the book.';
COMMENT ON COLUMN public.books.title IS 'Full canonical title of the book.';
COMMENT ON COLUMN public.books.description IS 'Detailed book synopsis or summary description.';
COMMENT ON COLUMN public.books.release_date IS 'Original publication or digital release date.';
COMMENT ON COLUMN public.books.cover_url IS 'URL of the high-resolution book cover image.';
COMMENT ON COLUMN public.books.isbn IS 'Standard International Standard Book Number (ISBN-10 or ISBN-13).';
COMMENT ON COLUMN public.books.pages IS 'Estimated or documented page count.';
COMMENT ON COLUMN public.books.publisher IS 'Name of the publishing house or digital distributor.';
COMMENT ON COLUMN public.books.language IS 'Primary language of the book content.';
COMMENT ON COLUMN public.books.is_featured IS 'Flag determining whether the book is highlighted in editorial showcases.';
COMMENT ON COLUMN public.books.created_at IS 'Timestamp when the book was added to the catalog.';
COMMENT ON COLUMN public.books.updated_at IS 'Timestamp when book metadata was last modified.';
COMMENT ON COLUMN public.books.pdf_url IS 'Direct URL to the public PDF binary resource.';
COMMENT ON COLUMN public.books.epub_url IS 'Direct URL to the EPUB binary resource.';
COMMENT ON COLUMN public.books.format IS 'Primary digital format indicator (e.g. pdf, epub).';
COMMENT ON COLUMN public.books.file_size_mb IS 'Human-readable file size in megabytes.';
COMMENT ON COLUMN public.books.download_count IS 'Total aggregate download count.';
COMMENT ON COLUMN public.books.view_count IS 'Total aggregate reading session views.';
COMMENT ON COLUMN public.books.file_size IS 'Exact primary file size in bytes.';
COMMENT ON COLUMN public.books.series IS 'Book series title if part of a multi-volume collection.';
COMMENT ON COLUMN public.books.series_order IS 'Numerical sequence position within the series.';
COMMENT ON COLUMN public.books.is_textbook IS 'Flag indicating whether this is an academic textbook.';
COMMENT ON COLUMN public.books.edition IS 'Edition label (e.g. 1st Edition, Revised 2026).';
COMMENT ON COLUMN public.books.total_pages IS 'Total verified page count.';
COMMENT ON COLUMN public.books.fts IS 'PostgreSQL full-text search vector generated from title and description.';
COMMENT ON COLUMN public.books.embedding IS 'Vector embedding representation for semantic similarity search.';
COMMENT ON COLUMN public.books.hash IS 'Content hash for deduplication and integrity.';
COMMENT ON COLUMN public.books.is_published IS 'Flag indicating whether the book is live and visible to readers.';
COMMENT ON COLUMN public.books.is_archived IS 'Flag indicating whether the book has been retired or archived.';
COMMENT ON COLUMN public.books.version IS 'Optimistic concurrency control version integer.';
COMMENT ON COLUMN public.books.language_id IS 'Foreign key referencing the languages table.';

-- 10. collection_books
COMMENT ON TABLE public.collection_books IS 'Junction table linking editorial collections to books with sequence positions.';
COMMENT ON COLUMN public.collection_books.collection_id IS 'Foreign key referencing the parent collection.';
COMMENT ON COLUMN public.collection_books.book_id IS 'Foreign key referencing the book included in the collection.';
COMMENT ON COLUMN public.collection_books.position IS 'Zero-based display order within the collection.';
COMMENT ON COLUMN public.collection_books.created_at IS 'Timestamp when the book was added to the collection.';

-- 11. collections
COMMENT ON TABLE public.collections IS 'Curated editorial book collections and thematic showcases on Discover.';
COMMENT ON COLUMN public.collections.id IS 'Primary key identifier for the collection.';
COMMENT ON COLUMN public.collections.title IS 'Display title of the collection (e.g. Essential Philosophy).';
COMMENT ON COLUMN public.collections.slug IS 'URL-safe unique slug for collection routes.';
COMMENT ON COLUMN public.collections.description IS 'Editorial description and overview of the collection.';
COMMENT ON COLUMN public.collections.cover_url IS 'Banner image URL for the collection card.';
COMMENT ON COLUMN public.collections.is_active IS 'Flag indicating whether the collection is active and displayed.';
COMMENT ON COLUMN public.collections.created_at IS 'Timestamp when the collection was created.';
COMMENT ON COLUMN public.collections.updated_at IS 'Timestamp when the collection was last updated.';

-- 12. discovery_autocomplete_documents
COMMENT ON TABLE public.discovery_autocomplete_documents IS 'Precomputed search suggestion dictionary and autocomplete index.';
COMMENT ON COLUMN public.discovery_autocomplete_documents.id IS 'Primary key identifier for the autocomplete term.';
COMMENT ON COLUMN public.discovery_autocomplete_documents.query IS 'Autocomplete query term or title substring.';
COMMENT ON COLUMN public.discovery_autocomplete_documents.score IS 'Popularity or frequency score for ranking autocomplete results.';
COMMENT ON COLUMN public.discovery_autocomplete_documents.updated_at IS 'Timestamp when the term score was updated.';
COMMENT ON COLUMN public.discovery_autocomplete_documents.source_updated_at IS 'Timestamp of the underlying entity that generated this token.';
COMMENT ON COLUMN public.discovery_autocomplete_documents.indexed_by IS 'Worker or system process that indexed this token.';

-- 13. discovery_search_documents
COMMENT ON TABLE public.discovery_search_documents IS 'Materialized denormalized projection document for high-performance full-text search.';
COMMENT ON COLUMN public.discovery_search_documents.book_id IS 'Primary key referencing the book in the catalog.';
COMMENT ON COLUMN public.discovery_search_documents.title IS 'Indexed book title.';
COMMENT ON COLUMN public.discovery_search_documents.subtitle IS 'Indexed book subtitle or series info.';
COMMENT ON COLUMN public.discovery_search_documents.authors IS 'Array of contributing author names.';
COMMENT ON COLUMN public.discovery_search_documents.language IS 'Indexed language code.';
COMMENT ON COLUMN public.discovery_search_documents.description IS 'Indexed search synopsis.';
COMMENT ON COLUMN public.discovery_search_documents.publication_year IS 'Extracted publication year for facet filtering.';
COMMENT ON COLUMN public.discovery_search_documents.popularity_score IS 'Computed composite ranking score combining views and downloads.';
COMMENT ON COLUMN public.discovery_search_documents.fts_tokens IS 'Full-text search weighted tsvector index.';
COMMENT ON COLUMN public.discovery_search_documents.download_count IS 'Cached aggregate download count.';
COMMENT ON COLUMN public.discovery_search_documents.projection_version IS 'Projection schema version integer.';
COMMENT ON COLUMN public.discovery_search_documents.indexed_at IS 'Timestamp when this document was materialized.';
COMMENT ON COLUMN public.discovery_search_documents.source_updated_at IS 'Source entity timestamp when last synchronized.';
COMMENT ON COLUMN public.discovery_search_documents.indexed_by IS 'Identifier of the worker process that generated the document.';
COMMENT ON COLUMN public.discovery_search_documents.slug IS 'URL slug for quick navigation without extra lookup.';
COMMENT ON COLUMN public.discovery_search_documents.genres IS 'Array of assigned genre names for facet filtering.';
COMMENT ON COLUMN public.discovery_search_documents.subjects IS 'Array of assigned subject names for facet filtering.';
COMMENT ON COLUMN public.discovery_search_documents.is_public IS 'Flag indicating public search visibility.';
COMMENT ON COLUMN public.discovery_search_documents.view_count IS 'Cached aggregate reading session view count.';
COMMENT ON COLUMN public.discovery_search_documents.average_rating IS 'Cached composite user review rating.';
COMMENT ON COLUMN public.discovery_search_documents.rating_count IS 'Total count of user review ratings.';
COMMENT ON COLUMN public.discovery_search_documents.last_index_reason IS 'Reason trigger for last indexing event.';
COMMENT ON COLUMN public.discovery_search_documents.last_index_duration_ms IS 'Execution time in milliseconds to build the document.';
COMMENT ON COLUMN public.discovery_search_documents.last_projection_version IS 'Previous projection version integer.';

-- 14. export_requests
COMMENT ON TABLE public.export_requests IS 'Asynchronous user GDPR data package export requests and status tracking.';
COMMENT ON COLUMN public.export_requests.id IS 'Primary key identifier for the export request.';
COMMENT ON COLUMN public.export_requests.user_id IS 'Foreign key referencing the user requesting their data.';
COMMENT ON COLUMN public.export_requests.status IS 'Current status (pending, processing, completed, failed).';
COMMENT ON COLUMN public.export_requests.download_url IS 'Temporary signed URL to download the compiled ZIP archive.';
COMMENT ON COLUMN public.export_requests.requested_at IS 'Timestamp when the user initiated the request.';
COMMENT ON COLUMN public.export_requests.queued_at IS 'Timestamp when the worker picked up the job.';
COMMENT ON COLUMN public.export_requests.completed_at IS 'Timestamp when the export archive was generated.';
COMMENT ON COLUMN public.export_requests.expires_at IS 'Timestamp when the download link and archive expire.';
COMMENT ON COLUMN public.export_requests.error_message IS 'Error details if the export worker failed.';

-- 15. faqs
COMMENT ON TABLE public.faqs IS 'Frequently asked questions and support knowledge base articles.';
COMMENT ON COLUMN public.faqs.id IS 'Primary key identifier for the FAQ.';
COMMENT ON COLUMN public.faqs.question IS 'Question prompt headline.';
COMMENT ON COLUMN public.faqs.answer IS 'Detailed answer text or markdown.';
COMMENT ON COLUMN public.faqs.category IS 'Category grouping (e.g. Account, Reading, Books, Billing).';
COMMENT ON COLUMN public.faqs.display_order IS 'Numerical display sequence within the category.';
COMMENT ON COLUMN public.faqs.created_at IS 'Timestamp when the FAQ was created.';
COMMENT ON COLUMN public.faqs.language IS 'Language code of the localized FAQ entry.';

-- 16. featured_books
COMMENT ON TABLE public.featured_books IS 'Time-bounded curated featured books promoted on the Discover home page.';
COMMENT ON COLUMN public.featured_books.book_id IS 'Primary key referencing the promoted book.';
COMMENT ON COLUMN public.featured_books.position IS 'Numerical order of the featured book in the hero carousel.';
COMMENT ON COLUMN public.featured_books.starts_at IS 'Promotion start timestamp.';
COMMENT ON COLUMN public.featured_books.ends_at IS 'Promotion expiration timestamp.';
COMMENT ON COLUMN public.featured_books.created_at IS 'Timestamp when added to featured promotions.';
COMMENT ON COLUMN public.featured_books.updated_at IS 'Timestamp when promotion settings were last modified.';

-- 17. genres
COMMENT ON TABLE public.genres IS 'Canonical literary and non-fiction genre taxonomy categories.';
COMMENT ON COLUMN public.genres.id IS 'Primary key identifier for the genre.';
COMMENT ON COLUMN public.genres.name IS 'Display name of the genre (e.g. Science Fiction, Biography).';
COMMENT ON COLUMN public.genres.slug IS 'URL-safe unique slug for genre browsing routes.';
COMMENT ON COLUMN public.genres.description IS 'Description of the genre scope and themes.';
COMMENT ON COLUMN public.genres.icon IS 'Icon identifier or token for UI rendering.';
COMMENT ON COLUMN public.genres.created_at IS 'Timestamp when the genre was created.';
COMMENT ON COLUMN public.genres.updated_at IS 'Timestamp when the genre was last updated.';

-- 18. highlights
COMMENT ON TABLE public.highlights IS 'User saved text passages and reading highlights in books.';
COMMENT ON COLUMN public.highlights.id IS 'Primary key identifier for the highlight.';
COMMENT ON COLUMN public.highlights.user_id IS 'Foreign key referencing the user who highlighted the text.';
COMMENT ON COLUMN public.highlights.book_id IS 'Foreign key referencing the book containing the highlight.';
COMMENT ON COLUMN public.highlights.location_anchor IS 'Structured JSON anchor containing page, CFI, or character offset.';
COMMENT ON COLUMN public.highlights.selected_text IS 'Exact verbatim text highlighted by the user.';
COMMENT ON COLUMN public.highlights.color IS 'Color token code (e.g. yellow, blue, green, pink, purple).';
COMMENT ON COLUMN public.highlights.created_at IS 'Timestamp when the highlight was created.';

-- 19. job_failures
COMMENT ON TABLE public.job_failures IS 'Dead-letter queue capturing failed asynchronous jobs and stack traces for diagnostics.';
COMMENT ON COLUMN public.job_failures.id IS 'Primary key identifier for the failure log entry.';
COMMENT ON COLUMN public.job_failures.job_type IS 'Type identifier of the failed job.';
COMMENT ON COLUMN public.job_failures.payload IS 'Full JSON payload arguments passed to the job.';
COMMENT ON COLUMN public.job_failures.error IS 'Error message produced by the failed execution.';
COMMENT ON COLUMN public.job_failures.failed_at IS 'Timestamp when the job encountered a terminal failure.';
COMMENT ON COLUMN public.job_failures.retry_count IS 'Number of retry attempts before abandonment.';
COMMENT ON COLUMN public.job_failures.worker IS 'Worker process ID or machine hostname.';
COMMENT ON COLUMN public.job_failures.stack_trace IS 'Full stack trace string for developer diagnostics.';

-- 20. job_queue
COMMENT ON TABLE public.job_queue IS 'Persistent asynchronous job queue for background worker processing.';
COMMENT ON COLUMN public.job_queue.id IS 'Primary key identifier for the queued job.';
COMMENT ON COLUMN public.job_queue.job_type IS 'Categorical identifier of the job task to execute.';
COMMENT ON COLUMN public.job_queue.payload IS 'JSON parameters and arguments for job execution.';
COMMENT ON COLUMN public.job_queue.status IS 'Current queue status (pending, processing, completed, failed).';
COMMENT ON COLUMN public.job_queue.attempts IS 'Current execution attempt counter.';
COMMENT ON COLUMN public.job_queue.scheduled_at IS 'Timestamp when the job is scheduled to become eligible for processing.';
COMMENT ON COLUMN public.job_queue.started_at IS 'Timestamp when the active worker claimed and started the job.';
COMMENT ON COLUMN public.job_queue.completed_at IS 'Timestamp when the job successfully finished.';
COMMENT ON COLUMN public.job_queue.last_error IS 'Error message from the most recent failed execution attempt.';
COMMENT ON COLUMN public.job_queue.created_at IS 'Timestamp when the job was enqueued.';
COMMENT ON COLUMN public.job_queue.updated_at IS 'Timestamp when the job status was last updated.';

-- 21. languages
COMMENT ON TABLE public.languages IS 'Supported natural languages for books, UI localization, and search.';
COMMENT ON COLUMN public.languages.id IS 'Primary key identifier for the language record.';
COMMENT ON COLUMN public.languages.code IS 'ISO 639-1 two-letter or three-letter language code (e.g. en, fr, de, hi).';
COMMENT ON COLUMN public.languages.name IS 'English display name of the language.';
COMMENT ON COLUMN public.languages.native_name IS 'Endonym / native name of the language (e.g. English, Francais, Deutsch).';
COMMENT ON COLUMN public.languages.is_active IS 'Flag indicating whether this language is active on the platform.';
COMMENT ON COLUMN public.languages.created_at IS 'Timestamp when the language was registered.';
COMMENT ON COLUMN public.languages.updated_at IS 'Timestamp when the language was last updated.';

-- 22. library_books
COMMENT ON TABLE public.library_books IS 'User personal library items tracking reading shelf status (want to read, reading, finished).';
COMMENT ON COLUMN public.library_books.id IS 'Primary key identifier for the library entry.';
COMMENT ON COLUMN public.library_books.user_id IS 'Foreign key referencing the user.';
COMMENT ON COLUMN public.library_books.book_id IS 'Foreign key referencing the book added to the personal library.';
COMMENT ON COLUMN public.library_books.status IS 'Reading status enum (want_to_read, currently_reading, completed, dropped).';
COMMENT ON COLUMN public.library_books.queue_order IS 'Optional sequence order for custom user reading priority queue.';
COMMENT ON COLUMN public.library_books.added_at IS 'Timestamp when the user added the book to their library.';
COMMENT ON COLUMN public.library_books.updated_at IS 'Timestamp when reading status was last updated.';

-- 23. notes
COMMENT ON TABLE public.notes IS 'Standalone or book-attached personal study notes authored by the user.';
COMMENT ON COLUMN public.notes.id IS 'Primary key identifier for the note.';
COMMENT ON COLUMN public.notes.user_id IS 'Foreign key referencing the author user.';
COMMENT ON COLUMN public.notes.book_id IS 'Optional foreign key linking the note to a specific book.';
COMMENT ON COLUMN public.notes.title IS 'User-provided title for the note.';
COMMENT ON COLUMN public.notes.content IS 'Full text or markdown content of the note.';
COMMENT ON COLUMN public.notes.tags IS 'Array of user custom tag labels attached to the note.';
COMMENT ON COLUMN public.notes.created_at IS 'Timestamp when the note was created.';
COMMENT ON COLUMN public.notes.updated_at IS 'Timestamp when the note was last modified.';

-- 24. notifications
COMMENT ON TABLE public.notifications IS 'User inbox notifications triggered by reading goals, book updates, or system events.';
COMMENT ON COLUMN public.notifications.id IS 'Primary key identifier for the notification.';
COMMENT ON COLUMN public.notifications.user_id IS 'Foreign key referencing the recipient user.';
COMMENT ON COLUMN public.notifications.event_name IS 'Internal event identifier that triggered this notification.';
COMMENT ON COLUMN public.notifications.aggregate_id IS 'Identifier of the target entity.';
COMMENT ON COLUMN public.notifications.aggregate_type IS 'Type of the target entity (book, goal, system).';
COMMENT ON COLUMN public.notifications.type IS 'Notification category type (info, success, warning, alert).';
COMMENT ON COLUMN public.notifications.title IS 'Notification headline title.';
COMMENT ON COLUMN public.notifications.body IS 'Notification body text.';
COMMENT ON COLUMN public.notifications.metadata IS 'JSON metadata payload for deep linking and client routing.';
COMMENT ON COLUMN public.notifications.read_at IS 'Timestamp when the user opened/read the notification.';
COMMENT ON COLUMN public.notifications.created_at IS 'Timestamp when the notification was delivered.';

-- 25. outbox_events
COMMENT ON TABLE public.outbox_events IS 'Transactional outbox table ensuring reliable event publishing and worker dispatch.';
COMMENT ON COLUMN public.outbox_events.id IS 'Primary key identifier for the domain event.';
COMMENT ON COLUMN public.outbox_events.aggregate_type IS 'Bounded context aggregate type (Book, User, ReadingSession).';
COMMENT ON COLUMN public.outbox_events.aggregate_id IS 'Identifier of the specific aggregate root.';
COMMENT ON COLUMN public.outbox_events.event_type IS 'Domain event name (e.g. BookViewed, ReadingProgressUpdated).';
COMMENT ON COLUMN public.outbox_events.event_version IS 'Event schema version integer.';
COMMENT ON COLUMN public.outbox_events.payload IS 'Full serialized JSON payload of the event data.';
COMMENT ON COLUMN public.outbox_events.occurred_at IS 'Timestamp when the event occurred in the domain.';
COMMENT ON COLUMN public.outbox_events.status IS 'Dispatch status (pending, processing, processed, failed).';
COMMENT ON COLUMN public.outbox_events.retry_count IS 'Number of delivery retry attempts.';
COMMENT ON COLUMN public.outbox_events.last_error IS 'Error details if event handling failed.';
COMMENT ON COLUMN public.outbox_events.created_at IS 'Timestamp when the event was inserted into the outbox.';
COMMENT ON COLUMN public.outbox_events.processed_at IS 'Timestamp when the event was successfully dispatched.';
COMMENT ON COLUMN public.outbox_events.claimed_at IS 'Timestamp when an active worker claimed the event.';

-- 26. processed_events
COMMENT ON TABLE public.processed_events IS 'Idempotency ledger recording processed event IDs to prevent duplicate handler execution.';
COMMENT ON COLUMN public.processed_events.event_id IS 'Foreign key referencing the processed outbox event.';
COMMENT ON COLUMN public.processed_events.handler IS 'Unique identifier of the event subscriber or handler.';
COMMENT ON COLUMN public.processed_events.processed_at IS 'Timestamp when handler completed processing.';
COMMENT ON COLUMN public.processed_events.duration_ms IS 'Execution time in milliseconds taken by the handler.';

-- 27. profiles
COMMENT ON TABLE public.profiles IS 'User public profiles, display identities, and avatar metadata.';
COMMENT ON COLUMN public.profiles.id IS 'Primary key UUID linking 1-to-1 with auth.users.id.';
COMMENT ON COLUMN public.profiles.display_name IS 'Public display name or handle chosen by the user.';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to the user avatar image in Supabase Storage.';
COMMENT ON COLUMN public.profiles.created_at IS 'Timestamp when the user account was created.';
COMMENT ON COLUMN public.profiles.updated_at IS 'Timestamp when profile details were last updated.';
COMMENT ON COLUMN public.profiles.bio IS 'Short biography or reading intro.';
COMMENT ON COLUMN public.profiles.location IS 'Optional city/region location string.';

-- 28. reading_goals
COMMENT ON TABLE public.reading_goals IS 'User annual and monthly reading targets (books count or minutes).';
COMMENT ON COLUMN public.reading_goals.id IS 'Primary key identifier for the reading goal.';
COMMENT ON COLUMN public.reading_goals.user_id IS 'Foreign key referencing the goal owner.';
COMMENT ON COLUMN public.reading_goals.goal_type IS 'Type of goal (e.g. books_count, pages_count, minutes_read).';
COMMENT ON COLUMN public.reading_goals.target_value IS 'Target quantity to achieve.';
COMMENT ON COLUMN public.reading_goals.current_value IS 'Current verified progress toward the target.';
COMMENT ON COLUMN public.reading_goals.year IS 'Calendar year this goal applies to.';
COMMENT ON COLUMN public.reading_goals.start_date IS 'Effective start date of the goal.';
COMMENT ON COLUMN public.reading_goals.end_date IS 'Target completion date of the goal.';
COMMENT ON COLUMN public.reading_goals.is_active IS 'Flag indicating whether this goal is actively tracked.';
COMMENT ON COLUMN public.reading_goals.created_at IS 'Timestamp when the goal was established.';
COMMENT ON COLUMN public.reading_goals.updated_at IS 'Timestamp when goal progress was last modified.';

-- 29. reading_progress
COMMENT ON TABLE public.reading_progress IS 'Current reading position and completion percentage per user per book.';
COMMENT ON COLUMN public.reading_progress.user_id IS 'Foreign key referencing the reader.';
COMMENT ON COLUMN public.reading_progress.book_id IS 'Foreign key referencing the book.';
COMMENT ON COLUMN public.reading_progress.location_anchor IS 'Structured JSON position anchor (page, CFI, scroll offset).';
COMMENT ON COLUMN public.reading_progress.last_read_at IS 'Timestamp of the most recent reading interaction.';

-- 30. reading_sessions
COMMENT ON TABLE public.reading_sessions IS 'Discrete reading sessions tracking start/end times, pages turned, and duration.';
COMMENT ON COLUMN public.reading_sessions.id IS 'Primary key identifier for the reading session.';
COMMENT ON COLUMN public.reading_sessions.user_id IS 'Foreign key referencing the user.';
COMMENT ON COLUMN public.reading_sessions.book_id IS 'Foreign key referencing the book read.';
COMMENT ON COLUMN public.reading_sessions.current_page IS 'Highest page reached during this session.';
COMMENT ON COLUMN public.reading_sessions.total_pages IS 'Total page count of the book being read.';
COMMENT ON COLUMN public.reading_sessions.percentage IS 'Calculated percentage completion (0.0 to 100.0).';
COMMENT ON COLUMN public.reading_sessions.started_at IS 'Timestamp when the reading session started.';
COMMENT ON COLUMN public.reading_sessions.last_read_at IS 'Timestamp of the latest interaction in this session.';
COMMENT ON COLUMN public.reading_sessions.finished_at IS 'Timestamp when the session was closed or marked completed.';
COMMENT ON COLUMN public.reading_sessions.reading_time_minutes IS 'Total accumulated active reading duration in minutes.';

-- 31. search_history
COMMENT ON TABLE public.search_history IS 'Logged user search queries for recent search suggestions and analytics.';
COMMENT ON COLUMN public.search_history.id IS 'Primary key identifier for the search log entry.';
COMMENT ON COLUMN public.search_history.user_id IS 'Optional foreign key referencing the authenticated user.';
COMMENT ON COLUMN public.search_history.query IS 'Raw query string entered by the user.';
COMMENT ON COLUMN public.search_history.normalized_query IS 'Cleaned, lowercased, and trimmed query string.';
COMMENT ON COLUMN public.search_history.searched_at IS 'Timestamp when the search was executed.';
COMMENT ON COLUMN public.search_history.clicked_document_id IS 'Optional book ID clicked from the search results.';
COMMENT ON COLUMN public.search_history.result_count IS 'Number of results returned by the search engine.';
COMMENT ON COLUMN public.search_history.execution_time_ms IS 'Server search RPC execution time in milliseconds.';
COMMENT ON COLUMN public.search_history.is_zero_result IS 'Flag indicating whether no books matched the query.';
COMMENT ON COLUMN public.search_history.is_slow_query IS 'Flag indicating whether execution exceeded threshold.';
COMMENT ON COLUMN public.search_history.filters IS 'JSON snapshot of active search facet filters applied.';
COMMENT ON COLUMN public.search_history.sort_strategy IS 'Sorting criterion applied (relevance, newest, popularity).';

-- 32. search_synonyms
COMMENT ON TABLE public.search_synonyms IS 'Synonym dictionary used to expand search queries during text processing.';
COMMENT ON COLUMN public.search_synonyms.id IS 'Primary key identifier for the synonym mapping.';
COMMENT ON COLUMN public.search_synonyms.canonical IS 'Canonical standard root term (e.g. math, computer science).';
COMMENT ON COLUMN public.search_synonyms.synonym IS 'Alternative synonym phrase (e.g. mathematics, coding).';
COMMENT ON COLUMN public.search_synonyms.created_at IS 'Timestamp when the synonym was added.';

-- 33. shelf_items
COMMENT ON TABLE public.shelf_items IS 'Junction table mapping books to custom user shelves with position ordering.';
COMMENT ON COLUMN public.shelf_items.id IS 'Primary key identifier for the shelf item record.';
COMMENT ON COLUMN public.shelf_items.shelf_id IS 'Foreign key referencing the parent user shelf.';
COMMENT ON COLUMN public.shelf_items.book_id IS 'Foreign key referencing the book on the shelf.';
COMMENT ON COLUMN public.shelf_items.position IS 'Zero-based display order within the shelf.';
COMMENT ON COLUMN public.shelf_items.added_at IS 'Timestamp when the book was added to the shelf.';

-- 34. shelves
COMMENT ON TABLE public.shelves IS 'User-created custom bookshelves and reading collections.';
COMMENT ON COLUMN public.shelves.id IS 'Primary key identifier for the bookshelf.';
COMMENT ON COLUMN public.shelves.user_id IS 'Foreign key referencing the user who owns this shelf.';
COMMENT ON COLUMN public.shelves.name IS 'Display title of the shelf (e.g. Favorites, Weekend Reads).';
COMMENT ON COLUMN public.shelves.description IS 'Optional user description of the shelf purpose.';
COMMENT ON COLUMN public.shelves.is_public IS 'Flag determining whether the shelf is public or private.';
COMMENT ON COLUMN public.shelves.cover_image IS 'Optional custom cover or backdrop image URL for the shelf.';
COMMENT ON COLUMN public.shelves.created_at IS 'Timestamp when the shelf was created.';
COMMENT ON COLUMN public.shelves.updated_at IS 'Timestamp when shelf settings were last modified.';

-- 35. subjects
COMMENT ON TABLE public.subjects IS 'Academic, technical, and non-fiction subject taxonomy categories.';
COMMENT ON COLUMN public.subjects.id IS 'Primary key identifier for the subject.';
COMMENT ON COLUMN public.subjects.name IS 'Normalized display name of the subject (e.g. Physics, History).';
COMMENT ON COLUMN public.subjects.slug IS 'URL-safe unique slug for subject exploration routes.';
COMMENT ON COLUMN public.subjects.description IS 'Overview and scope description of the subject area.';
COMMENT ON COLUMN public.subjects.created_at IS 'Timestamp when the subject was registered.';
COMMENT ON COLUMN public.subjects.updated_at IS 'Timestamp when the subject was last modified.';

-- 36. trending_books_projection
COMMENT ON TABLE public.trending_books_projection IS 'Materialized aggregate ranking table for trending and popular books across time windows.';
COMMENT ON COLUMN public.trending_books_projection.book_id IS 'Primary key referencing the ranked book.';
COMMENT ON COLUMN public.trending_books_projection.daily_score IS 'Computed popularity score over the last 24 hours.';
COMMENT ON COLUMN public.trending_books_projection.weekly_score IS 'Computed popularity score over the last 7 days.';
COMMENT ON COLUMN public.trending_books_projection.monthly_score IS 'Computed popularity score over the last 30 days.';
COMMENT ON COLUMN public.trending_books_projection.all_time_score IS 'Cumulative all-time popularity score.';
COMMENT ON COLUMN public.trending_books_projection.daily_rank IS 'Rank position in daily trending charts.';
COMMENT ON COLUMN public.trending_books_projection.weekly_rank IS 'Rank position in weekly trending charts.';
COMMENT ON COLUMN public.trending_books_projection.monthly_rank IS 'Rank position in monthly trending charts.';
COMMENT ON COLUMN public.trending_books_projection.all_time_rank IS 'Rank position in all-time popularity charts.';
COMMENT ON COLUMN public.trending_books_projection.updated_at IS 'Timestamp when ranking scores were last calculated.';

-- 37. user_preferences
COMMENT ON TABLE public.user_preferences IS 'User personalized reader styling, typography, theme, and language preferences.';
COMMENT ON COLUMN public.user_preferences.user_id IS 'Primary key linking 1-to-1 with auth.users.id.';
COMMENT ON COLUMN public.user_preferences.theme IS 'App-wide color theme preference (light, dark, system).';
COMMENT ON COLUMN public.user_preferences.created_at IS 'Timestamp when preferences were created.';
COMMENT ON COLUMN public.user_preferences.updated_at IS 'Timestamp when preferences were last modified.';
COMMENT ON COLUMN public.user_preferences.reader_theme IS 'Reader background theme (light, dark, sepia).';
COMMENT ON COLUMN public.user_preferences.font_family IS 'Preferred reading font family (Inter, Merriweather, OpenDyslexic).';
COMMENT ON COLUMN public.user_preferences.font_size IS 'Reader text font size in pixels.';
COMMENT ON COLUMN public.user_preferences.line_height IS 'Reader paragraph line height multiplier.';
COMMENT ON COLUMN public.user_preferences.dictionary_language IS 'Preferred language for built-in reader dictionary lookup.';
COMMENT ON COLUMN public.user_preferences.ui_language IS 'Interface localization language code.';
COMMENT ON COLUMN public.user_preferences.content_languages IS 'Array of preferred content language codes for book recommendations.';

-- 38. user_statistics
COMMENT ON TABLE public.user_statistics IS 'Aggregate reading statistics, streaks, pages turned, and time spent.';
COMMENT ON COLUMN public.user_statistics.user_id IS 'Primary key linking 1-to-1 with auth.users.id.';
COMMENT ON COLUMN public.user_statistics.books_completed IS 'Total count of finished books.';
COMMENT ON COLUMN public.user_statistics.books_started IS 'Total count of books ever opened and started.';
COMMENT ON COLUMN public.user_statistics.pages_read IS 'Cumulative count of pages read.';
COMMENT ON COLUMN public.user_statistics.minutes_read IS 'Cumulative reading duration in minutes.';
COMMENT ON COLUMN public.user_statistics.current_streak IS 'Current consecutive days reading streak.';
COMMENT ON COLUMN public.user_statistics.longest_streak IS 'All-time longest consecutive days reading streak.';
COMMENT ON COLUMN public.user_statistics.updated_at IS 'Timestamp when stats were last recalculated.';
