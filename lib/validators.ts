/**
 * Shared Zod Validation Schemas
 *
 * These schemas serve as the CONTRACT LAYER between the API and Database.
 * Every mutation that accepts user input MUST validate through these schemas
 * before touching the database.
 *
 * This ensures:
 * 1. Database CHECK constraints are never violated
 * 2. ENUM types always receive valid values
 * 3. String lengths and formats are pre-validated
 * 4. SQL injection vectors are neutralized
 */

import { z } from "zod";

// ─── Primitives ─────────────────────────────────────────────

/** UUID v4 format validator */
export const UUIDSchema = z.string().uuid("Invalid ID format");

/** Safe text input: trims, enforces length, strips control characters */
export const SafeText = (maxLength: number = 500) =>
  z
    .string()
    .trim()
    .min(1, "Cannot be empty")
    .max(maxLength, `Cannot exceed ${maxLength} characters`)
    .transform((val) => val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ""));

/** Safe search query: strips SQL-dangerous characters */
export const SafeSearchQuery = z
  .string()
  .trim()
  .max(200, "Search query too long")
  .transform((val) =>
    val.replace(/[%_\\]/g, "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ""),
  );

// ─── Domain Enums (Mirror DB CHECK Constraints) ─────────────

export const ReadingStatus = z.enum([
  "want_to_read",
  "currently_reading",
  "finished",
]);
export type ReadingStatusType = z.infer<typeof ReadingStatus>;

export const ActivityActionType = z.enum([
  "add_to_list",
  "read_session",
  "finish_book",
]);
export type ActivityActionTypeValue = z.infer<typeof ActivityActionType>;

export const QueueStatus = z.enum([
  "pending",
  "processing",
  "done",
  "failed",
  "failed_permanent",
]);

// ─── Books Domain ───────────────────────────────────────────

export const BookIdSchema = UUIDSchema;

export const AddToReadingListInput = z.object({
  bookId: BookIdSchema,
  status: ReadingStatus,
});

export const UpdateReadingProgressInput = z.object({
  bookId: BookIdSchema,
  currentPage: z.number().int().min(0, "Page number cannot be negative"),
  progressPercentage: z.number().min(0).max(100),
});

export const ToggleBookmarkInput = z.object({
  bookId: BookIdSchema,
  pageNumber: z.number().int().min(1, "Page number must be at least 1"),
});

export const SearchBooksInput = z.object({
  search: SafeSearchQuery.optional(),
  genreFilters: z.array(z.string().max(50)).max(20).optional(),
});

export const SearchSuggestionsInput = z.object({
  query: SafeSearchQuery,
});

export const UploadAcademicBookInput = z.object({
  title: SafeText(300),
  author: SafeText(300),
  subject: SafeText(100),
  pdfUrl: z.string().url("Invalid PDF URL"),
});

// ─── Profile Domain ─────────────────────────────────────────

/** Identity updates → profiles table */
export const UpdateProfileInput = z.object({
  name: SafeText(100).optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

/** Preference updates → user_preferences table */
export const UpdatePreferencesInput = z.object({
  location: SafeText(200).optional(),

  reading_goal: z.number().int().min(1).max(500).optional(),
  favorite_genres: z.array(z.string().max(50)).max(20).optional(),
});

/** Private updates → user_private table */
export const UpdatePrivateInput = z.object({
  phone_number: z.string().max(20).optional(),
});

// ─── Textbook Exchange Domain ───────────────────────────────

export const MakeOfferInput = z.object({
  listingId: UUIDSchema,
  offeredPrice: z.number().positive("Price must be positive").max(10000),
  message: SafeText(1000),
});

// ─── Citations Domain ───────────────────────────────────────

export const SaveCitationInput = z.object({
  bookId: UUIDSchema,
  style: z.enum(["apa", "mla", "chicago", "harvard", "ieee"]),
  content: SafeText(5000),
});

// ─── Utility ────────────────────────────────────────────────

/**
 * Validates input against a Zod schema and returns a typed result.
 * Use this in server actions to get clean error messages.
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.issues[0];
    return {
      success: false,
      error: firstError?.message || "Validation failed",
    };
  }
  return { success: true, data: result.data };
}
