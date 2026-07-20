-- Migration: 20260719070000_v1_architecture_simplification
-- Description: Consolidates the database around the public-first product philosophy.

-- 1. DROP V2 TABLES & VIEWS
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS practice_tests CASCADE;
DROP TABLE IF EXISTS test_questions CASCADE;
DROP TABLE IF EXISTS user_test_attempts CASCADE;
DROP TABLE IF EXISTS user_study_plan CASCADE;
DROP TABLE IF EXISTS flashcards CASCADE;
DROP TABLE IF EXISTS review_items CASCADE;
DROP TABLE IF EXISTS vocabulary CASCADE;

DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS analytics_user_daily CASCADE;
DROP TABLE IF EXISTS analytics_user_monthly CASCADE;
DROP TABLE IF EXISTS analytics_user_genres CASCADE;
DROP TABLE IF EXISTS progress_daily CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS system_logs CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS auth_rate_limits CASCADE;
DROP TABLE IF EXISTS user_private CASCADE;

DROP TABLE IF EXISTS citations CASCADE;
DROP TABLE IF EXISTS discovery_category_documents CASCADE;
DROP TABLE IF EXISTS discovery_book_features CASCADE;
DROP TABLE IF EXISTS discovery_recommendation_signals CASCADE;
DROP TABLE IF EXISTS analytics_book_statistics CASCADE;

-- 2. SIMPLIFY ACCOUNT
-- Profiles
ALTER TABLE IF EXISTS profiles RENAME COLUMN name TO display_name;
ALTER TABLE IF EXISTS profiles RENAME COLUMN biography TO bio;
ALTER TABLE IF EXISTS profiles DROP COLUMN IF EXISTS email;
ALTER TABLE IF EXISTS profiles DROP COLUMN IF EXISTS username;
ALTER TABLE IF EXISTS profiles DROP COLUMN IF EXISTS social_links;

-- User Preferences
ALTER TABLE IF EXISTS user_preferences DROP COLUMN IF EXISTS reading_mode;
ALTER TABLE IF EXISTS user_preferences DROP COLUMN IF EXISTS email_notifications;
ALTER TABLE IF EXISTS user_preferences DROP COLUMN IF EXISTS push_notifications;
ALTER TABLE IF EXISTS user_preferences DROP COLUMN IF EXISTS language;
ALTER TABLE IF EXISTS user_preferences DROP COLUMN IF EXISTS timezone;
ALTER TABLE IF EXISTS user_preferences DROP COLUMN IF EXISTS privacy_settings;
ALTER TABLE IF EXISTS user_preferences DROP COLUMN IF EXISTS notifications;
ALTER TABLE IF EXISTS user_preferences DROP COLUMN IF EXISTS settings;
ALTER TABLE IF EXISTS user_preferences DROP COLUMN IF EXISTS favorite_genre;
ALTER TABLE IF EXISTS user_preferences DROP COLUMN IF EXISTS favorite_genres;
ALTER TABLE IF EXISTS user_preferences DROP COLUMN IF EXISTS location;

ALTER TABLE IF EXISTS user_preferences ADD COLUMN IF NOT EXISTS reader_theme text DEFAULT 'light';
ALTER TABLE IF EXISTS user_preferences ADD COLUMN IF NOT EXISTS font_family text DEFAULT 'inter';
ALTER TABLE IF EXISTS user_preferences ADD COLUMN IF NOT EXISTS font_size integer DEFAULT 16;
ALTER TABLE IF EXISTS user_preferences ADD COLUMN IF NOT EXISTS line_height numeric DEFAULT 1.5;
ALTER TABLE IF EXISTS user_preferences ADD COLUMN IF NOT EXISTS dictionary_language text DEFAULT 'en';

-- Notifications (Recreate)
DROP TABLE IF EXISTS notifications CASCADE;
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  metadata jsonb DEFAULT '{}',
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 3. RENAME READING TABLES
ALTER TABLE IF EXISTS reader_positions RENAME TO reading_progress;
ALTER TABLE IF EXISTS reader_sessions RENAME TO reading_sessions;
ALTER TABLE IF EXISTS reader_notes RENAME TO annotations;

-- Handle highlights duplication
DROP TABLE IF EXISTS highlights CASCADE;
ALTER TABLE IF EXISTS reader_highlights RENAME TO highlights;

-- 4. CREATE USER STATISTICS PROJECTION
CREATE TABLE IF NOT EXISTS user_statistics (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  books_completed integer DEFAULT 0,
  books_started integer DEFAULT 0,
  pages_read integer DEFAULT 0,
  minutes_read integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- 5. CATALOG ADDITIONS
CREATE TABLE IF NOT EXISTS book_formats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  format text NOT NULL,
  file_size_bytes bigint,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS book_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  asset_type text NOT NULL,
  asset_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 6. DISCOVERY
CREATE TABLE IF NOT EXISTS discovery_autocomplete_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL UNIQUE,
  score numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Search history alterations
ALTER TABLE search_history ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE search_history ADD COLUMN IF NOT EXISTS clicked_document_id uuid REFERENCES discovery_search_documents(book_id);
ALTER TABLE search_history ADD COLUMN IF NOT EXISTS result_count integer DEFAULT 0;
ALTER TABLE search_history RENAME COLUMN created_at TO searched_at;

-- Missing projections
CREATE TABLE IF NOT EXISTS featured_books_projection (
  book_id uuid PRIMARY KEY REFERENCES books(id) ON DELETE CASCADE,
  featured_order integer NOT NULL,
  updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS popular_books_projection (
  book_id uuid PRIMARY KEY REFERENCES books(id) ON DELETE CASCADE,
  popularity_score numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS new_arrivals_projection (
  book_id uuid PRIMARY KEY REFERENCES books(id) ON DELETE CASCADE,
  arrival_date timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Handle trending table rename
DROP TABLE IF EXISTS trending_books_projection CASCADE;
ALTER TABLE IF EXISTS trending_books RENAME TO trending_books_projection;

-- 7. PUBLIC CONTENT
CREATE TABLE IF NOT EXISTS pages (
  slug text PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  published_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. INFRASTRUCTURE
CREATE TABLE IF NOT EXISTS projection_checkpoints (
  projection_name text PRIMARY KEY,
  last_processed_event_id uuid,
  updated_at timestamptz DEFAULT now()
);

-- Rename outbox
ALTER TABLE IF EXISTS outbox_messages RENAME TO outbox_events;
