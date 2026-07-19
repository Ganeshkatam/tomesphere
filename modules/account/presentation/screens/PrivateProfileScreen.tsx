"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileEditForm from "@/modules/user/profile/presentation/components/ProfileEditForm";
import ProfileOverview from "@/modules/user/profile/presentation/components/ProfileOverview";
import { showSuccess, showError } from "@/lib/toast";
import type { ProfileDto } from "@/modules/user/profile/application/queries/GetProfile/read-model";

interface PrivateProfileScreenProps {
  user: any;
  initialProfile: ProfileDto | null;
  stats?: any;
}

export default function PrivateProfileScreen({
  user,
  initialProfile,
  stats = { booksRead: 0, achievements: 0 },
}: PrivateProfileScreenProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState<"overview" | "edit">("overview");

  const [formData, setFormData] = useState({
    name: initialProfile?.displayName || "",
    avatar_url: initialProfile?.avatarUrl || "",
    phone_number: "", // Phone number is managed in security/auth, but keeping the state if the form uses it
    location: initialProfile?.location || "",
    reading_goal: 12, // Move reading goal management to the dashboard/progress screen
  });

  const [originalPhone] = useState("");

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        avatarUrl: formData.avatar_url,
        location: formData.location,
      };

      const res = await fetch("/api/v1/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message || "Failed to update profile");
      }

      showSuccess("Profile updated successfully!");
      router.refresh();
      setActiveTab("overview");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      showError(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-50">
          {activeTab === "edit" ? "Edit Profile" : "Profile Settings"}
        </h2>
        <button
          onClick={() => setActiveTab(activeTab === "edit" ? "overview" : "edit")}
          className="px-6 py-2 bg-[var(--surface-raised)] border border-[var(--border-default)] text-slate-300 rounded-lg hover:bg-[var(--surface-overlay)] hover:text-slate-50 transition-all font-medium text-sm flex items-center gap-2 shadow-sm"
        >
          {activeTab === "edit" ? (
            "Cancel"
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Tab Container */}
      <div>
        {activeTab === "overview" && (
          <ProfileOverview
            stats={stats}
            formData={formData}
            profile={initialProfile}
            user={user}
            recentBooks={[]}
          />
        )}

        {activeTab === "edit" && (
          <ProfileEditForm
            formData={formData}
            setFormData={setFormData}
            user={user}
            originalPhone={originalPhone}
            saving={saving}
            handleSave={handleSave}
            onCancel={() => setActiveTab("overview")}
          />
        )}
      </div>
    </div>
  );
}
