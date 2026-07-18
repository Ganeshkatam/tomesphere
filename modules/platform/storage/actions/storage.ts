'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import type { ActionResult } from '@/modules/shared/core/types/ActionResult';

export async function uploadFileToStorage(
    bucket: string,
    formData: FormData
): Promise<ActionResult<{ url: string }>> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const file = formData.get('file') as File;
        if (!file || file.size === 0) {
            return { success: false, error: 'No file provided' };
        }

        // Sanitize filename
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
        const baseName = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[^a-zA-Z0-9 _-]/g, '')
            .replace(/\s+/g, '_')
            .toLowerCase()
            .substring(0, 50);

        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const fileName = `${baseName}_${timestamp}_${randomStr}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            return { success: false, error: `Upload failed: ${uploadError.message}` };
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return { success: true, data: { url: publicUrl } };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Upload failed' };
    }
}
