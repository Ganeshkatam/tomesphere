export interface LogHighlightInput {
    sessionId: string;
    highlightId: string;
    text: string;
    location: string;
    chapter?: string;
    color?: string;
}
