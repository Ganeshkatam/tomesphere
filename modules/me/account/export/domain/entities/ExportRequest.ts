import { Entity } from "@/shared/kernel/Entity";

/**
 * Export Request Lifecycle States:
 *
 *   requested → queued → processing → completed
 *                                   → failed
 *                                   → expired (TTL cleanup)
 */
export type ExportRequestStatus =
  "requested" | "queued" | "processing" | "completed" | "failed" | "expired";

export interface ExportRequestProps {
  readonly userId: string;
  status: ExportRequestStatus;
  downloadUrl: string | null;
  requestedAt: Date;
  queuedAt: Date | null;
  completedAt: Date | null;
  expiresAt: Date | null;
  errorMessage: string | null;
}

/**
 * ExportRequest Aggregate
 *
 * Encapsulates the lifecycle of a data export request.
 * All state transitions are guarded by behavior methods
 * to enforce valid transitions.
 */
export class ExportRequest extends Entity<ExportRequestProps> {
  get userId(): string {
    return this.props.userId;
  }

  get status(): ExportRequestStatus {
    return this.props.status;
  }

  get downloadUrl(): string | null {
    return this.props.downloadUrl;
  }

  get requestedAt(): Date {
    return this.props.requestedAt;
  }

  get queuedAt(): Date | null {
    return this.props.queuedAt;
  }

  get completedAt(): Date | null {
    return this.props.completedAt;
  }

  get expiresAt(): Date | null {
    return this.props.expiresAt;
  }

  get errorMessage(): string | null {
    return this.props.errorMessage;
  }

  get isActive(): boolean {
    return ["requested", "queued", "processing"].includes(this.props.status);
  }

  private constructor(id: string, props: ExportRequestProps) {
    super(id, props);
  }

  /**
   * Factory: creates a new export request in the "requested" state.
   */
  static create(userId: string): ExportRequest {
    return new ExportRequest(crypto.randomUUID(), {
      userId,
      status: "requested",
      downloadUrl: null,
      requestedAt: new Date(),
      queuedAt: null,
      completedAt: null,
      expiresAt: null,
      errorMessage: null,
    });
  }

  /**
   * Reconstitution from persistence.
   */
  static fromPersistence(id: string, props: ExportRequestProps): ExportRequest {
    return new ExportRequest(id, props);
  }

  /**
   * Transition: requested → queued
   */
  queue(): void {
    this.assertStatus("requested", "queue");
    this.props.status = "queued";
    this.props.queuedAt = new Date();
  }

  /**
   * Transition: queued → processing
   */
  start(): void {
    this.assertStatus("queued", "start");
    this.props.status = "processing";
  }

  /**
   * Transition: processing → completed
   */
  complete(downloadUrl: string, expiresAt: Date): void {
    this.assertStatus("processing", "complete");
    this.props.status = "completed";
    this.props.downloadUrl = downloadUrl;
    this.props.completedAt = new Date();
    this.props.expiresAt = expiresAt;
  }

  /**
   * Transition: any active state → failed
   */
  fail(errorMessage: string): void {
    if (!this.isActive) {
      throw new Error(
        `Cannot fail an export request in "${this.props.status}" state.`,
      );
    }
    this.props.status = "failed";
    this.props.errorMessage = errorMessage;
  }

  /**
   * Transition: completed → expired (TTL cleanup)
   */
  expire(): void {
    this.assertStatus("completed", "expire");
    this.props.status = "expired";
    this.props.downloadUrl = null;
  }

  private assertStatus(expected: ExportRequestStatus, action: string): void {
    if (this.props.status !== expected) {
      throw new Error(
        `Cannot ${action} an export request in "${this.props.status}" state. Expected "${expected}".`,
      );
    }
  }
}
