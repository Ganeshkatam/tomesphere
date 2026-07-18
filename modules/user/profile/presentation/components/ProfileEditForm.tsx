'use client';

import VoiceInput from '@/modules/reading/search/components/VoiceInput';
import { Save, X, Globe, AtSign, Briefcase, Link2, Target } from 'lucide-react';

interface ProfileEditFormProps {
    formData: any;
    setFormData: (data: any) => void;
    user: any;
    originalPhone: string;
    saving: boolean;
    handleSave: () => void;
    onCancel: () => void;
}

export default function ProfileEditForm({
    formData,
    setFormData,
    user,
    originalPhone,
    saving,
    handleSave,
    onCancel
}: ProfileEditFormProps) {
    return (
        <div className="glass-strong rounded-2xl p-8 border border-[var(--border-default)] mb-6">
            <h2 className="text-2xl font-bold text-slate-50 mb-6">Edit Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-50 mb-4">Basic Information</h3>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Full Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-lg px-4 py-2 text-slate-50 focus:outline-none focus:border-indigo-500"
                        />
                    </div>



                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email (Read-only)</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full bg-[var(--surface-default)] border border-[var(--border-default)] rounded-lg px-4 py-2 text-slate-400 opacity-60 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Phone Number {originalPhone && '(Read-only)'}
                        </label>
                        <input
                            type="tel"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                            disabled={!!originalPhone}
                            className={`w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-lg px-4 py-2 ${originalPhone ? 'text-slate-400 opacity-60 cursor-not-allowed' : 'text-slate-50'}`}
                            placeholder={originalPhone ? '' : '+918317527188'}
                        />
                        {originalPhone && (
                            <p className="text-xs text-slate-400 mt-1">
                                🔒 To change your phone number, please contact support
                            </p>
                        )}
                    </div>



                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="City, Country"
                            className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-lg px-4 py-2 text-slate-50 focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Social & Preferences */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-50 mb-4">Social Links & Settings</h3>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Avatar URL</label>
                        <input
                            type="url"
                            value={formData.avatar_url}
                            onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                            placeholder="https://example.com/avatar.jpg"
                            className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-lg px-4 py-2 text-slate-50 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                            <Target size={16} />
                            Annual Reading Goal
                        </label>
                        <input
                            type="number"
                            value={formData.reading_goal}
                            onChange={(e) => setFormData({ ...formData, reading_goal: parseInt(e.target.value) })}
                            min="1"
                            max="1000"
                            className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-lg px-4 py-2 text-slate-50 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Notification Preferences</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.notification_preferences?.email}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        notification_preferences: {
                                            ...formData.notification_preferences,
                                            email: e.target.checked
                                        }
                                    })}
                                    className="w-5 h-5 rounded border-2 border-[var(--border-default)] bg-[var(--surface-raised)] checked:bg-indigo-600 checked:border-indigo-600"
                                />
                                <span className="text-[var(--text-secondary)]">Email Notifications</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.notification_preferences?.push}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        notification_preferences: {
                                            ...formData.notification_preferences,
                                            push: e.target.checked
                                        }
                                    })}
                                    className="w-5 h-5 rounded border-2 border-[var(--border-default)] bg-[var(--surface-raised)] checked:bg-indigo-600 checked:border-indigo-600"
                                />
                                <span className="text-[var(--text-secondary)]">Push Notifications</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.notification_preferences?.weekly_digest}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        notification_preferences: {
                                            ...formData.notification_preferences,
                                            weekly_digest: e.target.checked
                                        }
                                    })}
                                    className="w-5 h-5 rounded border-2 border-[var(--border-default)] bg-[var(--surface-raised)] checked:bg-indigo-600 checked:border-indigo-600"
                                />
                                <span className="text-[var(--text-secondary)]">Weekly Digest</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[var(--border-default)]">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                    onClick={onCancel}
                    className="px-8 py-3 bg-[var(--surface-default)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)] transition-colors flex items-center gap-2"
                >
                    <X size={20} />
                    Cancel
                </button>
            </div>
        </div>
    );
}
