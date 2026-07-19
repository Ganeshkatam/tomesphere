"use client";

import VoiceInput from "@/modules/reading/search/components/VoiceInput";
import { Save, X, Globe, AtSign, Briefcase, Link2, Target, Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import { uploadFileToStorage } from "@/modules/storage/actions/storage";
import { showError } from "@/lib/toast";

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
  onCancel,
}: ProfileEditFormProps) {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showError("Image must be smaller than 5MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      // Upload to 'avatars' bucket
      const res = await uploadFileToStorage("avatars", formDataUpload);
      if (res.success && res.data?.url) {
        setFormData({ ...formData, avatar_url: res.data.url });
      } else if (!res.success) {
        showError(res.error.message || "Failed to upload avatar");
      }
    } catch (err: any) {
      showError(err.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="glass-strong rounded-2xl p-6 border border-[var(--border-default)] mb-4">
      <h2 className="text-xl font-bold text-slate-50 mb-4">Edit Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Basic Info */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-50 mb-3">
            Basic Information
          </h3>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-md px-3 py-1.5 text-sm text-slate-50 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              Email (Read-only)
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full bg-[var(--surface-default)] border border-[var(--border-default)] rounded-md px-3 py-1.5 text-sm text-slate-400 opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              Phone Number {originalPhone && "(Read-only)"}
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              disabled={!!originalPhone}
              className={`w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-md px-3 py-1.5 text-sm ${originalPhone ? "text-slate-400 opacity-60 cursor-not-allowed" : "text-slate-50"}`}
              placeholder={originalPhone ? "" : "Enter your phone number"}
            />
            {originalPhone && (
              <p className="text-[10px] text-slate-400 mt-1">
                🔒 To change your phone number, please contact support
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="City, Country"
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-md px-3 py-1.5 text-sm text-slate-50 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Social & Preferences */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-50 mb-3">
            Social Links & Settings
          </h3>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              Profile Avatar
            </label>
            <div className="flex gap-3">
              {/* <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) =>
                  setFormData({ ...formData, avatar_url: e.target.value })
                }
                placeholder="https://example.com/avatar.jpg"
                className="flex-1 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-md px-3 py-1.5 text-sm text-slate-50 focus:outline-none focus:border-indigo-500"
              /> */}
              <label className={`shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer ${uploadingAvatar ? "bg-indigo-600/50 text-indigo-200" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
                {uploadingAvatar ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploadingAvatar ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
              <Target size={14} />
              Annual Reading Goal
            </label>
            <input
              type="number"
              value={formData.reading_goal}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reading_goal: parseInt(e.target.value),
                })
              }
              min="1"
              max="1000"
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-md px-3 py-1.5 text-sm text-slate-50 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
              Notification Preferences
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notification_preferences?.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notification_preferences: {
                        ...formData.notification_preferences,
                        email: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded border border-[var(--border-default)] bg-[var(--surface-raised)] checked:bg-indigo-600 checked:border-indigo-600"
                />
                <span className="text-xs text-[var(--text-secondary)]">
                  Email Notifications
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notification_preferences?.push}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notification_preferences: {
                        ...formData.notification_preferences,
                        push: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded border border-[var(--border-default)] bg-[var(--surface-raised)] checked:bg-indigo-600 checked:border-indigo-600"
                />
                <span className="text-xs text-[var(--text-secondary)]">
                  Push Notifications
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notification_preferences?.weekly_digest}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notification_preferences: {
                        ...formData.notification_preferences,
                        weekly_digest: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded border border-[var(--border-default)] bg-[var(--surface-raised)] checked:bg-indigo-600 checked:border-indigo-600"
                />
                <span className="text-xs text-[var(--text-secondary)]">
                  Weekly Digest
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[var(--border-default)]">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 flex items-center gap-1.5"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 text-sm bg-[var(--surface-default)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)] transition-colors flex items-center gap-1.5 rounded-md"
        >
          <X size={16} />
          Cancel
        </button>
      </div>
    </div>
  );
}
