export interface CanonicalBookProgressDto {
  status: "want_to_read" | "currently_reading" | "finished" | "none";
  inLibrary: boolean;
  progressPercentage: number;
  currentPage?: number;
  totalPages?: number;
  lastReadAt?: string;
  format?: string;
}

export interface RawBookProgressInput {
  libraryStatus?: string | null;
  locationAnchor?: { type?: string; value?: string | number; percentage?: number } | null;
  totalPages?: number | null;
  sessionPercentage?: number | null;
  sessionCurrentPage?: number | null;
  lastReadAt?: string | null;
  format?: string | null;
}

/**
 * Pure application-level calculation and projection mapper.
 * Safely computes clamped progress (0-100%) and reading position across formats (PDF/EPUB)
 * without assuming fixed physical pages exist for all documents.
 */
export class CanonicalBookProgressProjection {
  public static project(input: RawBookProgressInput): CanonicalBookProgressDto {
    const rawStatus = input.libraryStatus;
    const inLibrary = Boolean(rawStatus && rawStatus !== "none");

    let status: "want_to_read" | "currently_reading" | "finished" | "none" = "none";
    if (rawStatus === "finished" || rawStatus === "completed") {
      status = "finished";
    } else if (rawStatus === "currently_reading" || rawStatus === "reading") {
      status = "currently_reading";
    } else if (rawStatus === "want_to_read") {
      status = "want_to_read";
    }

    const totalPages =
      typeof input.totalPages === "number" && input.totalPages > 0
        ? input.totalPages
        : undefined;

    let currentPage: number | undefined = undefined;
    let progressPercentage = 0;

    // 1. Extract current page from anchor or session
    if (input.locationAnchor) {
      if (input.locationAnchor.type === "pdf") {
        const parsed = parseInt(String(input.locationAnchor.value), 10);
        if (!isNaN(parsed) && parsed > 0) {
          currentPage = parsed;
        }
      } else if (typeof input.locationAnchor.percentage === "number") {
        progressPercentage = Math.min(100, Math.max(0, Math.round(input.locationAnchor.percentage)));
      }
    }

    if (currentPage === undefined && typeof input.sessionCurrentPage === "number" && input.sessionCurrentPage > 0) {
      currentPage = input.sessionCurrentPage;
    }

    // 2. Compute percentage from currentPage vs totalPages if available
    if (currentPage !== undefined && totalPages !== undefined && totalPages > 0) {
      const clampedPage = Math.min(totalPages, Math.max(1, currentPage));
      progressPercentage = Math.min(100, Math.max(0, Math.round((clampedPage / totalPages) * 100)));
    } else if (typeof input.sessionPercentage === "number" && input.sessionPercentage > 0) {
      progressPercentage = Math.min(100, Math.max(0, Math.round(input.sessionPercentage)));
    }

    // 3. Reconcile finished status with verified reading progress
    if (status === "finished") {
      progressPercentage = 100;
      currentPage = totalPages || currentPage;
    } else if (progressPercentage >= 100) {
      status = "finished";
      progressPercentage = 100;
      currentPage = totalPages || currentPage;
    } else if (status === "none" && (currentPage !== undefined || progressPercentage > 0)) {
      status = "currently_reading";
    }

    return {
      status,
      inLibrary,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      currentPage,
      totalPages,
      lastReadAt: input.lastReadAt || undefined,
      format: input.format || "pdf",
    };
  }
}
