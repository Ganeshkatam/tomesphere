'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import type { ActionResult } from '@/modules/shared/core/types/ActionResult';

// ─── Session Helpers ─────────────────────────────────────────

export async function getAuthStatus(): Promise<ActionResult<{ isLoggedIn: boolean }>> {
    const supabase = await createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    return { success: true, data: { isLoggedIn: !!session } };
}

import { User } from '@supabase/supabase-js';

export async function getCurrentUser(): Promise<ActionResult<User | null>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return { success: true, data: user };
}

export async function logOut(): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    return { success: true, data: undefined };
}

// ─── Verification ────────────────────────────────────────────

export async function loginWithPassword(emailOrPhone: string, password: string, isPhone: boolean): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    
    const signInResult = isPhone
        ? await supabase.auth.signInWithPassword({ phone: emailOrPhone, password })
        : await supabase.auth.signInWithPassword({ email: emailOrPhone, password });

    if (signInResult.error) return { success: false, error: 'Invalid credentials. Please check your email and password.' };
    return { success: true, data: undefined };
}

export async function sendMagicLinkServer(emailOrPhone: string, isPhone: boolean): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    
    const result = isPhone
        ? await supabase.auth.signInWithOtp({ phone: emailOrPhone })
        : await supabase.auth.signInWithOtp({ email: emailOrPhone, options: { shouldCreateUser: false } });

    if (result.error) return { success: false, error: 'Failed to send verification code. Please try again.' };
    return { success: true, data: undefined };
}

export async function verifyMagicLinkServer(emailOrPhone: string, token: string, isPhone: boolean): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    
    const result = isPhone
        ? await supabase.auth.verifyOtp({ phone: emailOrPhone, token, type: 'sms' })
        : await supabase.auth.verifyOtp({ email: emailOrPhone, token, type: 'email' });

    if (result.error) return { success: false, error: 'Invalid or expired verification code.' };
    return { success: true, data: undefined };
}

// ─── MFA & OTP ────────────────────────────────────────────

export async function getUserVerificationStatus(): Promise<ActionResult<{ emailVerified: boolean; phoneVerified: boolean }>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    return {
        success: true,
        data: {
            emailVerified: !!user.email_confirmed_at,
            phoneVerified: !!user.phone_confirmed_at
        }
    };
}

export async function resendVerificationEmail(): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        return { success: false, error: 'User email not found' };
    }

    const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
    });

    if (error) {
        return { success: false, error: 'Failed to send email' };
    }

    return { success: true, data: undefined };
}

export async function getMFAStatus(): Promise<ActionResult<{ isEnabled: boolean }>> {
    const supabase = await createSupabaseServerClient();
    
    try {
        const { data: levelData, error: levelError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (levelError) return { success: false, error: levelError.message };

        if (levelData.currentLevel === 'aal2' || levelData.nextLevel === 'aal2') {
            const { data: factors } = await supabase.auth.mfa.listFactors();
            if (factors?.all?.length && factors.all.some(f => f.status === 'verified')) {
                return { success: true, data: { isEnabled: true } };
            }
        }
        return { success: true, data: { isEnabled: false } };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Operation failed' };
    }
}

export async function enrollMFA(): Promise<ActionResult<{ factorId: string, secret: string, uri: string }>> {
    const supabase = await createSupabaseServerClient();
    
    try {
        const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
        if (error) return { success: false, error: error.message };

        return { 
            success: true, 
            data: { 
                factorId: data.id, 
                secret: data.totp.secret, 
                uri: data.totp.uri 
            } 
        };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Failed to enroll MFA' };
    }
}

export async function verifyMFA(factorId: string, code: string): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    
    try {
        const { data, error } = await supabase.auth.mfa.challengeAndVerify({
            factorId,
            code,
        });
        if (error) return { success: false, error: error.message };
        
        return { success: true, data: undefined };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Failed to verify MFA code' };
    }
}

export async function disableMFA(): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    
    try {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const totpFactor = factors?.all?.find(f => f.factor_type === 'totp' && f.status === 'verified');

        if (totpFactor) {
            const { error } = await supabase.auth.mfa.unenroll({ factorId: totpFactor.id });
            if (error) return { success: false, error: error.message };
            return { success: true, data: undefined };
        }
        
        return { success: false, error: 'No active MFA factor found to disable' };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Failed to disable MFA' };
    }
}
export async function sendPhoneOTP(phone: string): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    
    try {
        const { error } = await supabase.auth.signInWithOtp({
            phone,
        });

        if (error) return { success: false, error: error.message };
        return { success: true, data: undefined };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Failed to send OTP' };
    }
}

export async function verifyPhoneOTP(phone: string, token: string): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    
    try {
        const { error } = await supabase.auth.verifyOtp({
            phone,
            token,
            type: 'sms',
        });

        if (error) return { success: false, error: error.message };
        return { success: true, data: undefined };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Invalid OTP' };
    }
}
