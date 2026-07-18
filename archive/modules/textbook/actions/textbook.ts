'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import type { ActionResult } from '@/modules/learning/citations/types';
import { UUIDSchema, MakeOfferInput, validateInput } from '@/lib/validators';

// ── Browse Listings (public, no auth needed) ──
import { Tables } from '@/modules/shared/core/types/supabase';
export interface TextbookListingWithRelations extends Tables<'textbook_listings'> {
    profiles?: { name: string; avatar_url: string };
    books?: { title: string; cover_url: string };
}
export async function getTextbookListings(): Promise<ActionResult<TextbookListingWithRelations[]>> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('textbook_listings')
            .select('*')
            .eq('status', 'available')
            .order('created_at', { ascending: false });

        if (error) return { success: false, error: error.message };
        return { success: true, data: data || [] };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Operation failed' };
    }
}

// ── Single Listing Detail ──
export async function getTextbookListing(id: string): Promise<ActionResult<TextbookListingWithRelations>> {
    const idCheck = validateInput(UUIDSchema, id);
    if (!idCheck.success) return { success: false, error: idCheck.error };

    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('textbook_listings')
            .select('*')
            .eq('id', idCheck.data)
            .single();

        if (error) return { success: false, error: error.message };
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch listing' };
    }
}

// ── User's Own Listings ──
export async function getMyListings(): Promise<ActionResult<TextbookListingWithRelations[]>> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const { data, error } = await supabase
            .from('textbook_listings')
            .select('*')
            .eq('seller_id', user.id)
            .order('created_at', { ascending: false });

        if (error) return { success: false, error: error.message };
        return { success: true, data: data || [] };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Operation failed' };
    }
}

// ── Saved Listings ──
export async function getSavedListings(): Promise<ActionResult<TextbookListingWithRelations[]>> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const { data, error } = await supabase
            .from('saved_listings')
            .select('*, textbook_listings(*)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) return { success: false, error: error.message };
        return { success: true, data: data || [] };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch saved listings' };
    }
}

// ── Save a Listing ──
export async function saveListing(listingId: string): Promise<ActionResult<null>> {
    const idCheck = validateInput(UUIDSchema, listingId);
    if (!idCheck.success) return { success: false, error: idCheck.error };

    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const { error } = await supabase
            .from('saved_listings')
            .insert({ user_id: user.id, listing_id: idCheck.data });

        if (error) return { success: false, error: error.message };
        return { success: true, data: null };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to save listing' };
    }
}

// ── Unsave a Listing ──
export async function unsaveListing(savedId: string): Promise<ActionResult<null>> {
    const idCheck = validateInput(UUIDSchema, savedId);
    if (!idCheck.success) return { success: false, error: idCheck.error };

    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const { error } = await supabase
            .from('saved_listings')
            .delete()
            .eq('id', idCheck.data);

        if (error) return { success: false, error: error.message };
        return { success: true, data: null };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to remove listing' };
    }
}

// ── Make an Offer ──
export async function makeOffer(listingId: string, offeredPrice: number, message: string): Promise<ActionResult<null>> {
    const validated = validateInput(MakeOfferInput, { listingId, offeredPrice, message });
    if (!validated.success) return { success: false, error: validated.error };

    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const { error } = await supabase
            .from('textbook_offers')
            .insert({
                listing_id: validated.data.listingId,
                buyer_id: user.id,
                offered_price: validated.data.offeredPrice,
                message: validated.data.message,
                status: 'pending'
            });

        if (error) return { success: false, error: error.message };
        return { success: true, data: null };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to send offer' };
    }
}

// ── Delete Listing ──
export async function deleteTextbookListing(listingId: string): Promise<ActionResult<null>> {
    const idCheck = validateInput(UUIDSchema, listingId);
    if (!idCheck.success) return { success: false, error: idCheck.error };

    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const { error } = await supabase
            .from('textbook_listings')
            .delete()
            .eq('id', idCheck.data)
            .eq('seller_id', user.id); // ownership check

        if (error) return { success: false, error: error.message };
        return { success: true, data: null };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to delete listing' };
    }
}

// ── Mark as Sold ──
export async function markListingSold(listingId: string): Promise<ActionResult<null>> {
    const idCheck = validateInput(UUIDSchema, listingId);
    if (!idCheck.success) return { success: false, error: idCheck.error };

    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const { error } = await supabase
            .from('textbook_listings')
            .update({ status: 'sold' })
            .eq('id', idCheck.data)
            .eq('seller_id', user.id); // ownership check

        if (error) return { success: false, error: error.message };
        return { success: true, data: null };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to update listing' };
    }
}
