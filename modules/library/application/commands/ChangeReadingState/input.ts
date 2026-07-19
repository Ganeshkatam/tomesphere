export interface ChangeReadingStateInput {
  readonly userId: string;
  readonly bookId: string;
  readonly newState:
    "want_to_read" | "currently_reading" | "finished" | "abandoned";
}
