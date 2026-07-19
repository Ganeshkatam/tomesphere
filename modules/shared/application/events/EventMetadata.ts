export interface EventMetadata {
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly actorId?: string;
  readonly source?: string;
}
