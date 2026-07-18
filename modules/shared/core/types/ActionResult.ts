/** Result wrapper for server actions */
export type ActionResult<T = void> =
    | { success: true; data: T }
    | { success: false; error: string };
