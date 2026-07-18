export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_icon: string | null
          condition_type: string | null
          condition_value: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          points: number | null
        }
        Insert: {
          badge_icon?: string | null
          condition_type?: string | null
          condition_value?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          points?: number | null
        }
        Update: {
          badge_icon?: string | null
          condition_type?: string | null
          condition_value?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          points?: number | null
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          action_type: string
          book_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action_type: string
          book_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action_type?: string
          book_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_book_statistics: {
        Row: {
          abandonment_count: number | null
          active_readers: number | null
          average_rating: number | null
          book_id: string
          completion_rate: number | null
          completions: number | null
          pages_read_total: number | null
          rating_count: number | null
          total_reads: number | null
          updated_at: string | null
        }
        Insert: {
          abandonment_count?: number | null
          active_readers?: number | null
          average_rating?: number | null
          book_id: string
          completion_rate?: number | null
          completions?: number | null
          pages_read_total?: number | null
          rating_count?: number | null
          total_reads?: number | null
          updated_at?: string | null
        }
        Update: {
          abandonment_count?: number | null
          active_readers?: number | null
          average_rating?: number | null
          book_id?: string
          completion_rate?: number | null
          completions?: number | null
          pages_read_total?: number | null
          rating_count?: number | null
          total_reads?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_book_statistics_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: true
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_user_daily: {
        Row: {
          books_completed: number | null
          date: string
          id: string
          pages_read: number | null
          reading_time_minutes: number | null
          streak_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          books_completed?: number | null
          date: string
          id?: string
          pages_read?: number | null
          reading_time_minutes?: number | null
          streak_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          books_completed?: number | null
          date?: string
          id?: string
          pages_read?: number | null
          reading_time_minutes?: number | null
          streak_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_user_genres: {
        Row: {
          books_completed: number | null
          books_started: number | null
          genre: string
          id: string
          likes_count: number | null
          pages_read: number | null
          ratings_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          books_completed?: number | null
          books_started?: number | null
          genre: string
          id?: string
          likes_count?: number | null
          pages_read?: number | null
          ratings_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          books_completed?: number | null
          books_started?: number | null
          genre?: string
          id?: string
          likes_count?: number | null
          pages_read?: number | null
          ratings_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_user_monthly: {
        Row: {
          books_completed: number | null
          id: string
          month: string
          pages_read: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          books_completed?: number | null
          id?: string
          month: string
          pages_read?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          books_completed?: number | null
          id?: string
          month?: string
          pages_read?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          correlation_id: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          correlation_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          correlation_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string | null
          criteria: Json | null
          description: string | null
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      book_comments: {
        Row: {
          book_id: string
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_comments_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "book_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      book_likes: {
        Row: {
          book_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_likes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          book_id: string
          created_at: string | null
          id: string
          label: string | null
          page_number: number
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string | null
          id?: string
          label?: string | null
          page_number: number
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string | null
          id?: string
          label?: string | null
          page_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          academic_subject: string | null
          author: string
          cover_url: string | null
          created_at: string | null
          description: string | null
          download_count: number | null
          edition: string | null
          embedding: string | null
          epub_url: string | null
          file_size: number | null
          file_size_mb: number | null
          format: string | null
          fts: unknown
          genre: string
          hash: string | null
          id: string
          is_featured: boolean | null
          is_textbook: boolean | null
          isbn: string | null
          language: string | null
          pages: number | null
          pdf_url: string | null
          publisher: string | null
          release_date: string | null
          series: string | null
          series_order: number | null
          title: string
          total_pages: number | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          academic_subject?: string | null
          author: string
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          edition?: string | null
          embedding?: string | null
          epub_url?: string | null
          file_size?: number | null
          file_size_mb?: number | null
          format?: string | null
          fts?: unknown
          genre: string
          hash?: string | null
          id?: string
          is_featured?: boolean | null
          is_textbook?: boolean | null
          isbn?: string | null
          language?: string | null
          pages?: number | null
          pdf_url?: string | null
          publisher?: string | null
          release_date?: string | null
          series?: string | null
          series_order?: number | null
          title: string
          total_pages?: number | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          academic_subject?: string | null
          author?: string
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          edition?: string | null
          embedding?: string | null
          epub_url?: string | null
          file_size?: number | null
          file_size_mb?: number | null
          format?: string | null
          fts?: unknown
          genre?: string
          hash?: string | null
          id?: string
          is_featured?: boolean | null
          is_textbook?: boolean | null
          isbn?: string | null
          language?: string | null
          pages?: number | null
          pdf_url?: string | null
          publisher?: string | null
          release_date?: string | null
          series?: string | null
          series_order?: number | null
          title?: string
          total_pages?: number | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      citations: {
        Row: {
          book_ids: string[]
          books: Json
          created_at: string
          format: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          book_ids?: string[]
          books?: Json
          created_at?: string
          format?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          book_ids?: string[]
          books?: Json
          created_at?: string
          format?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "discussion_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_book_features: {
        Row: {
          book_id: string
          embedding_score: number | null
          popularity_score: number | null
          trending_score: number | null
          updated_at: string | null
        }
        Insert: {
          book_id: string
          embedding_score?: number | null
          popularity_score?: number | null
          trending_score?: number | null
          updated_at?: string | null
        }
        Update: {
          book_id?: string
          embedding_score?: number | null
          popularity_score?: number | null
          trending_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discovery_book_features_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: true
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_category_documents: {
        Row: {
          book_count: number | null
          category: string
          new_release_book_ids: string[] | null
          trending_book_ids: string[] | null
          updated_at: string | null
        }
        Insert: {
          book_count?: number | null
          category: string
          new_release_book_ids?: string[] | null
          trending_book_ids?: string[] | null
          updated_at?: string | null
        }
        Update: {
          book_count?: number | null
          category?: string
          new_release_book_ids?: string[] | null
          trending_book_ids?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      discovery_recommendation_signals: {
        Row: {
          book_id: string
          completion_percent: number | null
          interaction_count: number | null
          last_activity_at: string | null
          liked: boolean | null
          rating: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          completion_percent?: number | null
          interaction_count?: number | null
          last_activity_at?: string | null
          liked?: boolean | null
          rating?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          completion_percent?: number | null
          interaction_count?: number | null
          last_activity_at?: string | null
          liked?: boolean | null
          rating?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_recommendation_signals_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_search_documents: {
        Row: {
          authors: string[]
          availability_status: string
          book_id: string
          categories: string[]
          description: string | null
          fts_tokens: unknown
          keywords: string[]
          language: string
          popularity_score: number | null
          publication_year: number | null
          rating: number | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          authors?: string[]
          availability_status?: string
          book_id: string
          categories?: string[]
          description?: string | null
          fts_tokens?: unknown
          keywords?: string[]
          language?: string
          popularity_score?: number | null
          publication_year?: number | null
          rating?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          authors?: string[]
          availability_status?: string
          book_id?: string
          categories?: string[]
          description?: string | null
          fts_tokens?: unknown
          keywords?: string[]
          language?: string
          popularity_score?: number | null
          publication_year?: number | null
          rating?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discovery_search_documents_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: true
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_comments: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string
          id: string
          parent_comment_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id: string
          id?: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string
          id?: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_comments_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "discussion_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_likes: {
        Row: {
          created_at: string | null
          discussion_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          discussion_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          discussion_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_likes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string
          id: string
          parent_reply_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id: string
          id?: string
          parent_reply_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string
          id?: string
          parent_reply_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          book_id: string
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          title: string
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          book_id: string
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          book_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          display_order: number | null
          id: string
          question: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          question: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          question?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          back_text: string
          book_id: string | null
          created_at: string | null
          ease_factor: number | null
          front_text: string
          id: string
          interval: number | null
          next_review: string | null
          repetitions: number | null
          subject: string | null
          user_id: string | null
        }
        Insert: {
          back_text: string
          book_id?: string | null
          created_at?: string | null
          ease_factor?: number | null
          front_text: string
          id?: string
          interval?: number | null
          next_review?: string | null
          repetitions?: number | null
          subject?: string | null
          user_id?: string | null
        }
        Update: {
          back_text?: string
          book_id?: string | null
          created_at?: string | null
          ease_factor?: number | null
          front_text?: string
          id?: string
          interval?: number | null
          next_review?: string | null
          repetitions?: number | null
          subject?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      highlights: {
        Row: {
          book_id: string | null
          chapter: string | null
          color: string | null
          created_at: string | null
          id: string
          is_public: boolean | null
          note: string | null
          note_id: string | null
          page: number | null
          text: string
          user_id: string
        }
        Insert: {
          book_id?: string | null
          chapter?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          note?: string | null
          note_id?: string | null
          page?: number | null
          text: string
          user_id: string
        }
        Update: {
          book_id?: string | null
          chapter?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          note?: string | null
          note_id?: string | null
          page?: number | null
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "highlights_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      library_books: {
        Row: {
          added_at: string | null
          book_id: string
          id: string
          queue_order: number | null
          status: Database["public"]["Enums"]["reading_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          book_id: string
          id?: string
          queue_order?: number | null
          status?: Database["public"]["Enums"]["reading_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          book_id?: string
          id?: string
          queue_order?: number | null
          status?: Database["public"]["Enums"]["reading_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          book_id: string | null
          content: string | null
          created_at: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          book_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          book_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      outbox_messages: {
        Row: {
          aggregate_id: string
          aggregate_type: string
          created_at: string | null
          event_type: string
          event_version: number
          id: string
          last_error: string | null
          occurred_at: string
          payload: Json
          processed_at: string | null
          retry_count: number
          status: string
        }
        Insert: {
          aggregate_id: string
          aggregate_type: string
          created_at?: string | null
          event_type: string
          event_version?: number
          id?: string
          last_error?: string | null
          occurred_at?: string
          payload: Json
          processed_at?: string | null
          retry_count?: number
          status?: string
        }
        Update: {
          aggregate_id?: string
          aggregate_type?: string
          created_at?: string | null
          event_type?: string
          event_version?: number
          id?: string
          last_error?: string | null
          occurred_at?: string
          payload?: Json
          processed_at?: string | null
          retry_count?: number
          status?: string
        }
        Relationships: []
      }
      practice_tests: {
        Row: {
          created_at: string | null
          created_by: string | null
          difficulty: string | null
          id: string
          subject: string
          time_limit_minutes: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          difficulty?: string | null
          id?: string
          subject: string
          time_limit_minutes?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          difficulty?: string | null
          id?: string
          subject?: string
          time_limit_minutes?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_tests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          biography: string | null
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          biography?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          location?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          biography?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      progress_daily: {
        Row: {
          books_completed: number | null
          created_at: string | null
          date: string
          id: string
          pages_read: number | null
          reading_time_minutes: number | null
          user_id: string
        }
        Insert: {
          books_completed?: number | null
          created_at?: string | null
          date: string
          id?: string
          pages_read?: number | null
          reading_time_minutes?: number | null
          user_id: string
        }
        Update: {
          books_completed?: number | null
          created_at?: string | null
          date?: string
          id?: string
          pages_read?: number | null
          reading_time_minutes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          book_id: string
          created_at: string | null
          id: string
          rating: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string | null
          id?: string
          rating: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string | null
          id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reader_highlights: {
        Row: {
          book_id: string
          color: string | null
          created_at: string | null
          id: string
          location_anchor: Json
          selected_text: string
          user_id: string
        }
        Insert: {
          book_id: string
          color?: string | null
          created_at?: string | null
          id?: string
          location_anchor: Json
          selected_text: string
          user_id: string
        }
        Update: {
          book_id?: string
          color?: string | null
          created_at?: string | null
          id?: string
          location_anchor?: Json
          selected_text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reader_highlights_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      reader_notes: {
        Row: {
          body_markdown: string
          book_id: string
          created_at: string | null
          highlight_id: string | null
          id: string
          location_anchor: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body_markdown: string
          book_id: string
          created_at?: string | null
          highlight_id?: string | null
          id?: string
          location_anchor: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body_markdown?: string
          book_id?: string
          created_at?: string | null
          highlight_id?: string | null
          id?: string
          location_anchor?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reader_notes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reader_notes_highlight_id_fkey"
            columns: ["highlight_id"]
            isOneToOne: false
            referencedRelation: "reader_highlights"
            referencedColumns: ["id"]
          },
        ]
      }
      reader_positions: {
        Row: {
          book_id: string
          last_read_at: string
          location_anchor: Json
          user_id: string
        }
        Insert: {
          book_id: string
          last_read_at?: string
          location_anchor: Json
          user_id: string
        }
        Update: {
          book_id?: string
          last_read_at?: string
          location_anchor?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reader_positions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      reader_sessions: {
        Row: {
          book_id: string
          current_page: number | null
          finished_at: string | null
          id: string
          last_read_at: string | null
          percentage: number | null
          reading_time_minutes: number | null
          started_at: string | null
          total_pages: number | null
          user_id: string
        }
        Insert: {
          book_id: string
          current_page?: number | null
          finished_at?: string | null
          id?: string
          last_read_at?: string | null
          percentage?: number | null
          reading_time_minutes?: number | null
          started_at?: string | null
          total_pages?: number | null
          user_id: string
        }
        Update: {
          book_id?: string
          current_page?: number | null
          finished_at?: string | null
          id?: string
          last_read_at?: string | null
          percentage?: number | null
          reading_time_minutes?: number | null
          started_at?: string | null
          total_pages?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reader_sessions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_goals: {
        Row: {
          created_at: string | null
          current_value: number | null
          end_date: string | null
          goal_type: string
          id: string
          is_active: boolean | null
          start_date: string | null
          target_value: number
          updated_at: string | null
          user_id: string
          year: number | null
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          end_date?: string | null
          goal_type: string
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          target_value: number
          updated_at?: string | null
          user_id: string
          year?: number | null
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          end_date?: string | null
          goal_type?: string
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          target_value?: number
          updated_at?: string | null
          user_id?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_items: {
        Row: {
          answer: string | null
          book_id: string | null
          content: string
          created_at: string | null
          due_date: string
          ease_factor: number | null
          id: string
          interval_days: number | null
          last_reviewed_at: string | null
          repetitions: number | null
          user_id: string
        }
        Insert: {
          answer?: string | null
          book_id?: string | null
          content: string
          created_at?: string | null
          due_date: string
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_reviewed_at?: string | null
          repetitions?: number | null
          user_id: string
        }
        Update: {
          answer?: string | null
          book_id?: string | null
          content?: string
          created_at?: string | null
          due_date?: string
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_reviewed_at?: string | null
          repetitions?: number | null
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          book_id: string
          content: string
          created_at: string | null
          flagged: boolean | null
          flagged_reason: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          content: string
          created_at?: string | null
          flagged?: boolean | null
          flagged_reason?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          content?: string
          created_at?: string | null
          flagged?: boolean | null
          flagged_reason?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          permission: string
          role: string
        }
        Insert: {
          created_at?: string | null
          permission: string
          role: string
        }
        Update: {
          created_at?: string | null
          permission?: string
          role?: string
        }
        Relationships: []
      }
      shelf_items: {
        Row: {
          added_at: string | null
          book_id: string
          id: string
          position: number | null
          shelf_id: string
        }
        Insert: {
          added_at?: string | null
          book_id: string
          id?: string
          position?: number | null
          shelf_id: string
        }
        Update: {
          added_at?: string | null
          book_id?: string
          id?: string
          position?: number | null
          shelf_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shelf_items_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shelf_items_shelf_id_fkey"
            columns: ["shelf_id"]
            isOneToOne: false
            referencedRelation: "shelves"
            referencedColumns: ["id"]
          },
        ]
      }
      shelves: {
        Row: {
          cover_image: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          content: string
          created_at: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_logs: {
        Row: {
          context: string
          created_at: string | null
          id: string
          ip_address: string | null
          level: string
          message: string
          metadata: Json | null
          path: string | null
          user_id: string | null
        }
        Insert: {
          context: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          level: string
          message: string
          metadata?: Json | null
          path?: string | null
          user_id?: string | null
        }
        Update: {
          context?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          level?: string
          message?: string
          metadata?: Json | null
          path?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      test_questions: {
        Row: {
          correct_answer: string | null
          explanation: string | null
          id: string
          options: Json | null
          order_index: number | null
          points: number | null
          question_text: string
          question_type: string | null
          test_id: string | null
        }
        Insert: {
          correct_answer?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          order_index?: number | null
          points?: number | null
          question_text: string
          question_type?: string | null
          test_id?: string | null
        }
        Update: {
          correct_answer?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          order_index?: number | null
          points?: number | null
          question_text?: string
          question_type?: string | null
          test_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "practice_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          favorite_genre: string | null
          favorite_genres: string[] | null
          language: string | null
          location: string | null
          notifications: Json | null
          privacy_settings: Json | null
          push_notifications: boolean | null
          reading_mode: string | null
          settings: Json | null
          theme: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          favorite_genre?: string | null
          favorite_genres?: string[] | null
          language?: string | null
          location?: string | null
          notifications?: Json | null
          privacy_settings?: Json | null
          push_notifications?: boolean | null
          reading_mode?: string | null
          settings?: Json | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          favorite_genre?: string | null
          favorite_genres?: string[] | null
          language?: string | null
          location?: string | null
          notifications?: Json | null
          privacy_settings?: Json | null
          push_notifications?: boolean | null
          reading_mode?: string | null
          settings?: Json | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_private: {
        Row: {
          banned: boolean | null
          deleted_at: string | null
          phone_number: string | null
          user_id: string
        }
        Insert: {
          banned?: boolean | null
          deleted_at?: string | null
          phone_number?: string | null
          user_id: string
        }
        Update: {
          banned?: boolean | null
          deleted_at?: string | null
          phone_number?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          engagement_score: number | null
          last_activity_at: string | null
          profile_completed: boolean | null
          reading_streak_days: number | null
          total_points: number | null
          total_reading_time_seconds: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          engagement_score?: number | null
          last_activity_at?: string | null
          profile_completed?: boolean | null
          reading_streak_days?: number | null
          total_points?: number | null
          total_reading_time_seconds?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          engagement_score?: number | null
          last_activity_at?: string | null
          profile_completed?: boolean | null
          reading_streak_days?: number | null
          total_points?: number | null
          total_reading_time_seconds?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_recommendations: {
        Row: {
          recommendations: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          recommendations?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          recommendations?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_study_plan: {
        Row: {
          book_id: string | null
          completed: boolean | null
          created_at: string | null
          date: string
          duration_minutes: number | null
          genre: string | null
          id: string
          priority: number | null
          reason: string | null
          task_type: string | null
          user_id: string
        }
        Insert: {
          book_id?: string | null
          completed?: boolean | null
          created_at?: string | null
          date: string
          duration_minutes?: number | null
          genre?: string | null
          id?: string
          priority?: number | null
          reason?: string | null
          task_type?: string | null
          user_id: string
        }
        Update: {
          book_id?: string | null
          completed?: boolean | null
          created_at?: string | null
          date?: string
          duration_minutes?: number | null
          genre?: string | null
          id?: string
          priority?: number | null
          reason?: string | null
          task_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_test_attempts: {
        Row: {
          answers: Json | null
          completed_at: string | null
          id: string
          score: number | null
          test_id: string | null
          user_id: string | null
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          id?: string
          score?: number | null
          test_id?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          id?: string
          score?: number | null
          test_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "practice_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_test_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary: {
        Row: {
          book_id: string | null
          book_title: string | null
          context: string | null
          created_at: string | null
          definition: string | null
          id: string
          mastered: boolean | null
          user_id: string
          word: string
        }
        Insert: {
          book_id?: string | null
          book_title?: string | null
          context?: string | null
          created_at?: string | null
          definition?: string | null
          id?: string
          mastered?: boolean | null
          user_id: string
          word: string
        }
        Update: {
          book_id?: string | null
          book_title?: string | null
          context?: string | null
          created_at?: string | null
          definition?: string | null
          id?: string
          mastered?: boolean | null
          user_id?: string
          word?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_outbox_messages: {
        Args: { limit_count?: number }
        Returns: {
          aggregate_id: string
          aggregate_type: string
          created_at: string | null
          event_type: string
          event_version: number
          id: string
          last_error: string | null
          occurred_at: string
          payload: Json
          processed_at: string | null
          retry_count: number
          status: string
        }[]
        SetofOptions: {
          from: "*"
          to: "outbox_messages"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      format_file_size: { Args: { size_bytes: number }; Returns: string }
      get_active_announcements: {
        Args: { p_user_role?: string }
        Returns: {
          content: string
          ends_at: string
          id: string
          starts_at: string
          title: string
          type: string
        }[]
      }
      get_user_genre_distribution: {
        Args: { matches_user_id: string }
        Returns: {
          count: number
          genre: string
        }[]
      }
      get_user_permissions: {
        Args: { p_user_id: string }
        Returns: {
          permission: string
        }[]
      }
      has_permission: {
        Args: { p_permission: string; p_user_id: string }
        Returns: boolean
      }
      increment_analytics_book_completed: {
        Args: { p_book_id: string }
        Returns: undefined
      }
      increment_analytics_book_pages: {
        Args: { p_book_id: string; p_pages: number }
        Returns: undefined
      }
      increment_analytics_book_reads: {
        Args: { p_book_id: string }
        Returns: undefined
      }
      increment_analytics_daily_completed: {
        Args: { p_date: string; p_user_id: string }
        Returns: undefined
      }
      increment_analytics_daily_pages: {
        Args: { p_date: string; p_pages: number; p_user_id: string }
        Returns: undefined
      }
      increment_analytics_genre_completed: {
        Args: { p_genre: string; p_user_id: string }
        Returns: undefined
      }
      increment_analytics_genre_likes: {
        Args: { p_genre: string; p_user_id: string }
        Returns: undefined
      }
      increment_analytics_genre_pages: {
        Args: { p_genre: string; p_pages: number; p_user_id: string }
        Returns: undefined
      }
      increment_analytics_genre_rating: {
        Args: { p_genre: string; p_user_id: string }
        Returns: undefined
      }
      increment_analytics_genre_started: {
        Args: { p_genre: string; p_user_id: string }
        Returns: undefined
      }
      increment_analytics_monthly_completed: {
        Args: { p_month: string; p_user_id: string }
        Returns: undefined
      }
      increment_analytics_monthly_pages: {
        Args: { p_month: string; p_pages: number; p_user_id: string }
        Returns: undefined
      }
      match_books: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          author: string
          cover_url: string
          id: string
          similarity: number
          title: string
        }[]
      }
      prune_system_logs: { Args: never; Returns: undefined }
      recalculate_analytics_book_rating: {
        Args: { p_book_id: string }
        Returns: undefined
      }
      refresh_category_document: {
        Args: { target_category: string }
        Returns: undefined
      }
      refresh_recommendation_signals: {
        Args: { target_user_id?: string }
        Returns: undefined
      }
      refresh_search_document: {
        Args: { target_book_id: string }
        Returns: undefined
      }
      save_book_action_with_events: {
        Args: {
          p_action_data: Json
          p_action_type: string
          p_book_id: string
          p_events: Json
          p_user_id: string
        }
        Returns: undefined
      }
      save_reader_session_with_events: {
        Args: {
          p_book_id: string
          p_current_page: number
          p_events: Json
          p_library_status: string
          p_percentage: number
          p_user_id: string
        }
        Returns: undefined
      }
      search_books_fts: {
        Args: {
          genre_filter?: string
          page_number?: number
          page_size?: number
          search_query: string
        }
        Returns: {
          author: string
          cover_url: string
          genre: string
          id: string
          similarity: number
          title: string
        }[]
      }
      toggle_maintenance_mode: {
        Args: { p_enabled: boolean; p_message?: string }
        Returns: Json
      }
      update_reading_queue_order: {
        Args: { updates: Json }
        Returns: undefined
      }
    }
    Enums: {
      academic_subject_type:
        | "Computer Science"
        | "Mathematics"
        | "Physics"
        | "Chemistry"
        | "Biology"
        | "Engineering"
        | "Business"
        | "Economics"
        | "Psychology"
        | "History"
        | "Literature"
        | "Philosophy"
        | "Medicine"
        | "Law"
        | "Education"
      reading_status: "want_to_read" | "currently_reading" | "finished"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      academic_subject_type: [
        "Computer Science",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Engineering",
        "Business",
        "Economics",
        "Psychology",
        "History",
        "Literature",
        "Philosophy",
        "Medicine",
        "Law",
        "Education",
      ],
      reading_status: ["want_to_read", "currently_reading", "finished"],
    },
  },
} as const
