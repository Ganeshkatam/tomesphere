/**
 * 🚨 PLATFORM CONTRACT: AnnotationAnchor
 * 
 * This defines how an annotation is anchored to the document regardless of:
 * - Engine (PDF, EPUB)
 * - Zoom Level
 * - Viewport Size
 * - Device Screen
 * 
 * An anchor must be resolution-independent.
 */

export interface BoundingBox {
    x: number; // Percentage (0-100) or normalized (0.0-1.0)
    y: number; // Percentage (0-100) or normalized (0.0-1.0)
    width: number; // Percentage or normalized
    height: number; // Percentage or normalized
}

export interface TextRangeAnchor {
    type: 'text';
    pageNumber: number;
    startNodeIndex?: number;
    startOffset: number;
    endNodeIndex?: number;
    endOffset: number;
    // Bounding boxes are cached for fast rendering without DOM recalculation
    rects: BoundingBox[]; 
    textQuote: string; // The actual string highlighted, for robustness if text reflows
}

export interface AreaAnchor {
    type: 'area';
    pageNumber: number;
    rect: BoundingBox;
}

export type AnnotationAnchor = TextRangeAnchor | AreaAnchor;
