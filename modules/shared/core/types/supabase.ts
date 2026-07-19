import { Database } from "./database";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

// You can add more complex joined types here if needed
export type Profile = Tables<"profiles">;
export type Book = Tables<"books">;
export type Bookmark = Tables<"bookmarks">;
export type Note = Tables<"notes">;
export type ActivityLog = Tables<"activity_log">;
