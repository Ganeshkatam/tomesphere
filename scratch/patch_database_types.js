const fs = require('fs');
let content = fs.readFileSync('shared/core/types/database.ts', 'utf8');

const tablesToAdd = `
      languages: {
        Row: {
          id: string
          code: string
          name: string
          native_name: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          native_name: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          native_name?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          cover_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          cover_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          cover_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      collection_books: {
        Row: {
          collection_id: string
          book_id: string
          position: number
          created_at: string
        }
        Insert: {
          collection_id: string
          book_id: string
          position?: number
          created_at?: string
        }
        Update: {
          collection_id?: string
          book_id?: string
          position?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_books_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          }
        ]
      }
      featured_books: {
        Row: {
          book_id: string
          position: number
          starts_at: string | null
          ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          book_id: string
          position?: number
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          book_id?: string
          position?: number
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: true
            referencedRelation: "books"
            referencedColumns: ["id"]
          }
        ]
      }
`;

content = content.replace('Tables: {', 'Tables: {\n' + tablesToAdd);

// Replace books.language to language_id
content = content.replace('language: string | null', 'language_id: string | null');

fs.writeFileSync('shared/core/types/database.ts', content);
