/**
 * Base Domain Error for all errors within the Domain model.
 */
export abstract class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * Thrown when an input validation fails within a domain model 
 * (e.g. string too long, negative number).
 */
export class ValidationError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Thrown when a business rule is violated 
 * (e.g. Cannot transition from state A to state B).
 */
export class BusinessRuleViolation extends DomainError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Thrown when an aggregate's invariants are fundamentally broken 
 * (e.g. attempting to create a timeline that ends before it starts).
 */
export class InvariantViolation extends DomainError {
    constructor(message: string) {
        super(message);
    }
}
