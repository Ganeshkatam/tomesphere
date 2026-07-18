import { SupabaseClient } from '@supabase/supabase-js';
import { Permission } from '@/modules/shared/kernel/security/Permission';
import { AuthorizationRepository } from '../domain/AuthorizationRepository';

export class SupabaseAuthorizationRepository implements AuthorizationRepository {
    constructor(private readonly supabase: SupabaseClient) {}

    async hasPermission(userId: string, permission: Permission): Promise<boolean> {
        // We call an RPC function created in our database migration to centralize
        // permission evaluation on the database side, rather than exposing the 
        // user_roles tables directly.
        const { data, error } = await this.supabase.rpc('has_permission', {
            p_user_id: userId,
            p_permission: permission
        });

        if (error) {
            console.error('Error checking permission:', error);
            return false;
        }

        return !!data;
    }

    async getUserPermissions(userId: string): Promise<Permission[]> {
        const { data, error } = await this.supabase.rpc('get_user_permissions', {
            p_user_id: userId
        });

        if (error) {
            console.error('Error getting user permissions:', error);
            return [];
        }

        return data || [];
    }
}
