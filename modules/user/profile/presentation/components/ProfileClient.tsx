'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile, getNetworkData, toggleFollow } from '@/modules/user/profile/actions/profile';
import Navbar from '@/modules/shared/navigation/components/Navbar';

import MFASetup from '@/modules/platform/authentication/components/MFASetup';
import { showError, showSuccess } from '@/lib/toast';

// Modular Profile Components
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileOverview from './ProfileOverview';
import ProfileEditForm from './ProfileEditForm';
import ProfileNetwork from './ProfileNetwork';

interface ProfileClientProps {
    user: any;
    initialProfile: any;
    initialStats: any;
    initialFollowersCount: number;
    initialFollowingCount: number;
    initialRecentBooks?: any[];
}

export default function ProfileClient({ 
    user, 
    initialProfile, 
    initialStats, 
    initialFollowersCount, 
    initialFollowingCount,
    initialRecentBooks = []
}: ProfileClientProps) {
    const router = useRouter();

    const [profile, setProfile] = useState<any>(initialProfile);
    const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'activity' | 'security' | 'network'>('overview');
    const [saving, setSaving] = useState(false);

    // Social State
    const [followersCount, setFollowersCount] = useState(initialFollowersCount);
    const [followingCount, setFollowingCount] = useState(initialFollowingCount);
    const [followers, setFollowers] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);
    const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
    const [networkLoading, setNetworkLoading] = useState(false);
    const [networkLoaded, setNetworkLoaded] = useState(false);

    // Editable fields
    const [formData, setFormData] = useState({
        name: initialProfile?.name || '',

        avatar_url: initialProfile?.avatar_url || '',
        phone_number: initialProfile?.phone_number || '',
        location: initialProfile?.location || '',

        reading_goal: initialProfile?.reading_goal || 50,
    });

    // Track original values for verification
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

            // Only update phone_number if it was originally empty (one-time update)
            if (!originalPhone && formData.phone_number) {
                updateData.phone_number = formData.phone_number;
            }

            const res = await updateProfile(updateData);
            if (!res.success) throw new Error(res.error);
            
            showSuccess('Profile updated successfully!');
            setProfile({ ...profile, ...updateData });
            setActiveTab('overview');
        } catch (error) {
            console.error('Error:', error);
            showError('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const loadNetworkData = async () => {
        if (!user || networkLoaded) return;
        setNetworkLoading(true);
        try {
            const res = await getNetworkData();
            if (res.success) {
                setFollowers(res.data.followers);
                setFollowing(res.data.following);
                setSuggestedUsers(res.data.suggestedUsers);
                setNetworkLoaded(true);
            }
        } catch (error) {
            console.error('Error loading network:', error);
            showError('Failed to load network');
        } finally {
            setNetworkLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'network') {
            loadNetworkData();
        }
    }, [activeTab]);

    const handleFollow = async (targetId: string) => {
        try {
            const res = await toggleFollow(targetId);
            if (!res.success) {
                showError(res.error);
                return;
            }
            
            if (res.data.isFollowing) {
                showSuccess('Followed user!');
                setFollowingCount(prev => prev + 1);
            } else {
                showSuccess('Unfollowed user');
                setFollowingCount(prev => Math.max(0, prev - 1));
            }
            
            // Reload network data to reflect changes if we are on the network tab
            if (activeTab === 'network') {
                const networkRes = await getNetworkData();
                if (networkRes.success) {
                    setFollowers(networkRes.data.followers);
                    setFollowing(networkRes.data.following);
                    setSuggestedUsers(networkRes.data.suggestedUsers);
                }
            }
        } catch (error) {
            showError('Failed to toggle follow');
        }
    };

    const handleUnfollow = async (targetId: string) => {
        await handleFollow(targetId);
    };

    return (
        <div className="min-h-screen bg-transparent">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Card */}
                <ProfileHeader 
                    formData={formData}
                    profile={profile}
                    user={user}
                    stats={initialStats}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <div className="mb-6">
                    <ProfileStats stats={initialStats} />
                </div>

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-300 glass-strong p-8 rounded-3xl">
                        <h2 className="text-2xl font-bold text-slate-50 mb-6">Security Settings</h2>
                        <MFASetup />
                    </div>
                )}

                {/* Edit Form */}
                {activeTab === 'edit' && (
                    <ProfileEditForm 
                        formData={formData}
                        setFormData={setFormData}
                        user={user}
                        originalPhone={originalPhone}
                        saving={saving}
                        handleSave={handleSave}
                        onCancel={() => setActiveTab('overview')}
                    />
                )}

                {/* Overview Content */}
                {activeTab === 'overview' && (
                    <ProfileOverview 
                        stats={initialStats}
                        formData={formData}
                        profile={profile}
                        recentBooks={initialRecentBooks}
                    />
                )}

                {/* Network Tab */}
                {activeTab === 'network' && (
                    <ProfileNetwork 
                        following={following}
                        followers={followers}
                        suggestedUsers={suggestedUsers}
                        router={router}
                        handleUnfollow={handleUnfollow}
                        handleFollow={handleFollow}
                    />
                )}
            </div>
        </div>
    );
}

