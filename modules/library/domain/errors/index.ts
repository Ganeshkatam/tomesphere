import { BusinessRuleViolation } from "@/shared/kernel/DomainError";

export class InvalidReadingStateTransition extends BusinessRuleViolation {
  constructor(fromState: string, toState: string) {
    super(`Cannot transition from ${fromState} to ${toState}`);
  }
}

export class BookAlreadyInLibrary extends BusinessRuleViolation {
  constructor(bookId: string) {
    super(`Book ${bookId} is already in the library.`);
  }
}

export class BookNotFoundInLibrary extends BusinessRuleViolation {
  constructor(bookId: string) {
    super(`Book ${bookId} not found in the library.`);
  }
}
