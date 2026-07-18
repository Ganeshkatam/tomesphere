import { SupabaseClient } from '@supabase/supabase-js';
import { AuthenticationProvider } from '../domain/AuthenticationProvider';

export class SupabaseAuthenticationProvider implements AuthenticationProvider {
    constructor(private readonly supabase: SupabaseClient) {}

    async verifyAAL2(): Promise<boolean> {
        const { data, error } = await this.supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        
        if (error) {
            console.error('Error verifying AAL2:', error);
            return false;
        }

        return data.currentLevel === 'aal2';
    }
}
