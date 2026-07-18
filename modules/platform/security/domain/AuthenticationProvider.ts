export interface AuthenticationProvider {
    /**
     * Verifies if the current user session has Achieved Assurance Level 2 (AAL2),
     * meaning they have successfully authenticated with a second factor (MFA).
     */
    verifyAAL2(): Promise<boolean>;
}
