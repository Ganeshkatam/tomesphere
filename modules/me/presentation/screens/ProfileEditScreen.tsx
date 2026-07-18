'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileEditForm from '@/modules/user/profile/presentation/components/ProfileEditForm';
import { updateProfile } from '@/modules/user/profile/actions/profile';
import { showSuccess, showError } from '@/lib/toast';

interface ProfileEditScreenProps {
    user: any;
    initialProfile: any;
}

export default function ProfileEditScreen({ user, initialProfile }: ProfileEditScreenProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: initialProfile?.name || '',
        avatar_url: initialProfile?.avatar_url || '',
        phone_number: initialProfile?.phone_number || '',
        location: initialProfile?.location || '',
        reading_goal: initialProfile?.reading_goal || 12,
    });

    const [originalPhone] = useState(initialProfile?.phone_number || '');

    const handleSave = async () => {
        setSaving(true);
        try {
            const updateData: any = {
                name: formData.name,
                avatar_url: formData.avatar_url,
                location: formData.location,
                reading_goal: formData.reading_goal,
            };

            if (!originalPhone && formData.phone_number) {
                updateData.phone_number = formData.phone_number;
            }

            const res = await updateProfile(updateData);
            if (!res.success) throw new Error(res.error);
            
            showSuccess('Profile updated successfully!');
            router.refresh();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            showError('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-300">
            <ProfileEditForm 
                formData={formData}
                setFormData={setFormData}
                user={user}
                originalPhone={originalPhone}
                saving={saving}
                handleSave={handleSave}
                onCancel={() => router.push('/me')}
            />
        </div>
    );
}
