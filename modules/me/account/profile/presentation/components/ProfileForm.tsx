"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { showError, showSuccess } from "@/lib/toast";
import {
  updateProfileAction,
  uploadAvatarAction,
  removeAvatarAction,
  ProfileUpdateData,
} from "../actions/profile";
import {
  Loader2,
  User,
  FileText,
  MapPin,
  CheckCircle2,
  Camera,
  Trash2,
  ImagePlus,
  CloudOff,
  Pencil,
} from "lucide-react";
import { PhotoUploadConsentModal } from "@/shared/ui/PhotoUploadConsentModal";
import { usePhotoUploadPermission } from "@/shared/hooks/usePhotoUploadPermission";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface ProfileFormDto {
  displayName: string;
  bio: string | null;
  location: string | null;
  avatarUrl: string | null;
  email: string;
}

interface ProfileFormProps {
  initialValues: ProfileFormDto;
}

type FieldKey = "displayName" | "bio" | "location";
type SaveStatus = "idle" | "saving" | "saved" | "error";

/* ------------------------------------------------------------------ */
/*  Field metadata                                                     */
/* ------------------------------------------------------------------ */

const FIELD_META: Record<
  FieldKey,
  {
    label: string;
    placeholder: string;
    icon: typeof User;
    color: string;
    bgColor: string;
    maxLength: number;
    multiline?: boolean;
  }
> = {
  displayName: {
    label: "Display Name",
    placeholder: "Enter your display name",
    icon: User,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    maxLength: 50,
  },
  bio: {
    label: "Bio",
    placeholder: "Tell us a little about yourself...",
    icon: FileText,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    maxLength: 160,
    multiline: true,
  },
  location: {
    label: "Location",
    placeholder: "e.g. San Francisco, CA",
    icon: MapPin,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    maxLength: 100,
  },
};

const FIELDS: FieldKey[] = ["displayName", "bio", "location"];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ProfileForm({ initialValues }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [editingField, setEditingField] = useState<FieldKey | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(initialValues.avatarUrl);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const {
    pendingFile: pendingAvatarFile,
    requestPhotoUpload,
    handleAllow: handleConfirmAvatarUpload,
    handleDeny: handleCancelAvatarUpload,
  } = usePhotoUploadPermission();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastSavedRef = useRef<string>("");

  const [formData, setFormData] = useState<ProfileUpdateData>({
    displayName: initialValues.displayName,
    bio: initialValues.bio || "",
    location: initialValues.location || "",
  });

  const [draftValue, setDraftValue] = useState("");

  useEffect(() => {
    lastSavedRef.current = JSON.stringify({
      displayName: initialValues.displayName,
      bio: initialValues.bio || "",
      location: initialValues.location || "",
    });
  }, [initialValues]);

  /* --- Autosave on blur --- */

  const doSave = useCallback(
    (data: ProfileUpdateData) => {
      const snapshot = JSON.stringify(data);
      if (snapshot === lastSavedRef.current) return; // nothing changed

      setSaveStatus("saving");

      startTransition(async () => {
        try {
          const result = await updateProfileAction(data);
          if (result.success) {
            lastSavedRef.current = snapshot;
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 2500);
            router.refresh();
          } else {
            setSaveStatus("error");
            showError(result.error?.message || "Failed to save profile");
          }
        } catch {
          setSaveStatus("error");
          showError("An unexpected error occurred while saving");
        }
      });
    },
    [router],
  );

  /* --- Inline field editing --- */

  const startEditing = (field: FieldKey) => {
    setEditingField(field);
    setDraftValue(formData[field] || "");
  };

  const commitField = (field: FieldKey) => {
    const trimmed = draftValue.trim();
    const updated = { ...formData, [field]: trimmed };
    setFormData(updated);
    setEditingField(null);
    setDraftValue("");
    doSave(updated);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: FieldKey,
  ) => {
    if (e.key === "Enter" && !FIELD_META[field].multiline) {
      e.preventDefault();
      commitField(field);
    }
    if (e.key === "Escape") {
      setEditingField(null);
      setDraftValue("");
    }
  };

  /* --- Avatar handlers --- */

  const performAvatarUpload = async (file: File) => {
    setAvatarUploading(true);

    const fd = new FormData();
    fd.append("avatar", file);

    const result = await uploadAvatarAction(fd);
    if (result.success) {
      setAvatarUrl(result.data.avatarUrl);
      showSuccess("Profile photo updated successfully");
      router.refresh();
    } else {
      showError(result.error?.message || "Failed to upload avatar.");
    }
    setAvatarUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showError("Image must be smaller than 5MB");
      return;
    }

    requestPhotoUpload(file, performAvatarUpload);
  };

  const handleAvatarRemove = async () => {
    setAvatarUploading(true);

    const result = await removeAvatarAction();
    if (result.success) {
      setAvatarUrl(null);
      showSuccess("Profile photo removed");
      router.refresh();
    } else {
      showError(result.error?.message || "Failed to remove avatar.");
    }
    setAvatarUploading(false);
  };

  /* --- Status indicator --- */

  const renderStatus = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <Loader2 size={12} className="animate-spin" />
            Saving
          </span>
        );
      case "saved":
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 size={12} />
            All changes saved
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 uppercase tracking-wider">
            <CloudOff size={12} />
            Save failed
          </span>
        );
      default:
        return null;
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-8">
      {/* ============================================================ */}
      {/*  AVATAR HERO                                                  */}
      {/* ============================================================ */}
      <div className="flex flex-col items-center text-center">
        <div className="relative group mb-5">
          <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="w-full h-full relative rounded-full overflow-hidden bg-[var(--surface-raised)] flex items-center justify-center">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" className="object-cover" fill sizes="112px" />
              ) : (
                <span className="text-3xl font-bold bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {getInitials(formData.displayName)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-wait"
            aria-label="Change avatar"
          >
            {avatarUploading ? (
              <Loader2 size={24} className="text-white animate-spin" />
            ) : (
              <Camera size={24} className="text-white" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarSelect}
            className="hidden"
          />
        </div>

        <h3 className="text-lg font-bold text-slate-50">
          {formData.displayName || "Your Name"}
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">{initialValues.email}</p>

        <div className="flex items-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-400 border border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-500/5 rounded-xl transition-all disabled:opacity-50 uppercase tracking-wider"
          >
            <ImagePlus size={13} />
            {avatarUrl ? "Change Photo" : "Upload Photo"}
          </button>
          {avatarUrl && (
            <button
              type="button"
              onClick={handleAvatarRemove}
              disabled={avatarUploading}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-400 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5 rounded-xl transition-all disabled:opacity-50 uppercase tracking-wider"
            >
              <Trash2 size={13} />
              Remove
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  PROFILE FIELDS CARD                                         */}
      {/* ============================================================ */}
      <div className="p-6 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-2xl">
        {/* Card header */}
        <div className="flex items-center justify-between pb-4 mb-1 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-2">
            <User size={18} className="text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-50 uppercase tracking-wider">
              Profile Information
            </h3>
          </div>
          {renderStatus()}
        </div>

        {/* Fields */}
        <div className="divide-y divide-[var(--border-default)]">
          {FIELDS.map((key) => {
            const meta = FIELD_META[key];
            const Icon = meta.icon;
            const isEditing = editingField === key;
            const value = formData[key];

            return (
              <div key={key} className="group py-5 first:pt-4 last:pb-0">
                {/* Label */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${meta.bgColor}`}>
                      <Icon size={13} className={meta.color} />
                    </div>
                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      {meta.label}
                    </span>
                  </div>

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => startEditing(key)}
                      disabled={editingField !== null && editingField !== key}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0 uppercase tracking-wider"
                    >
                      <Pencil size={11} />
                      Edit
                    </button>
                  )}
                </div>

                {/* Value or Input */}
                {isEditing ? (
                  meta.multiline ? (
                    <textarea
                      value={draftValue}
                      onChange={(e) => setDraftValue(e.target.value)}
                      onBlur={() => commitField(key)}
                      onKeyDown={(e) => handleKeyDown(e, key)}
                      maxLength={meta.maxLength}
                      rows={3}
                      autoFocus
                      placeholder={meta.placeholder}
                      className="w-full bg-[var(--surface-default)] border border-indigo-500/50 rounded-xl px-4 py-3 text-sm font-medium text-slate-50 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={draftValue}
                      onChange={(e) => setDraftValue(e.target.value)}
                      onBlur={() => commitField(key)}
                      onKeyDown={(e) => handleKeyDown(e, key)}
                      maxLength={meta.maxLength}
                      autoFocus
                      placeholder={meta.placeholder}
                      className="w-full bg-[var(--surface-default)] border border-indigo-500/50 rounded-xl px-4 py-3 text-sm font-medium text-slate-50 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => startEditing(key)}
                    disabled={editingField !== null}
                    className="w-full text-left pl-9 disabled:cursor-default"
                  >
                    <p
                      className={`text-sm font-medium leading-relaxed ${value ? "text-slate-100" : "text-slate-600 italic"
                        }`}
                    >
                      {value || "Not set"}
                    </p>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <PhotoUploadConsentModal
        isOpen={!!pendingAvatarFile}
        file={pendingAvatarFile}
        onConfirm={handleConfirmAvatarUpload}
        onCancel={handleCancelAvatarUpload}
        isUploading={avatarUploading}
        title="Profile Photo Permission"
      />
    </div>
  );
}
