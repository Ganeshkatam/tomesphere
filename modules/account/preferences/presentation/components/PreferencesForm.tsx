"use client";

import {
  Save,
  Loader2,
  Monitor,
  Moon,
  Sun,
  Bell,
  Mail,
  Smartphone,
  BookOpen,
  Settings,
  Type,
  AlignLeft,
  Expand,
} from "lucide-react";
import { useState, useTransition } from "react";
import { showError, showSuccess } from "@/lib/toast";
import { updatePreferencesAction } from "@/app/(workspace)/account/preferences/actions";
import { PreferencesDto } from "../../application/dto/PreferencesPageDto";

export function PreferencesForm({
  preferences,
}: {
  preferences: PreferencesDto;
}) {
  const [formData, setFormData] = useState<PreferencesDto>(preferences);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const res = await updatePreferencesAction(formData);
      if (res.success) {
        showSuccess("Preferences updated successfully");
      } else {
        showError(res.error || "Failed to update preferences");
      }
    });
  };

  return (
    <div className="space-y-10">
      {/* APPEARANCE SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--border-default)]">
          <Monitor size={18} className="text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-50 uppercase tracking-wider">
            Appearance
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "light", icon: Sun, label: "Light" },
                { id: "dark", icon: Moon, label: "Dark" },
                { id: "system", icon: Monitor, label: "System" },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      appearance: {
                        ...formData.appearance,
                        themeMode: theme.id as any,
                      },
                    })
                  }
                  className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${
                    formData.appearance.themeMode === theme.id
                      ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-400"
                      : "bg-[var(--surface-raised)] border-[var(--border-default)] text-slate-400 hover:bg-[var(--surface-overlay)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <theme.icon size={20} />
                  <span className="text-xs font-bold">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
              App Language
            </label>
            <select
              value={formData.appearance.language}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  appearance: {
                    ...formData.appearance,
                    language: e.target.value,
                  },
                })
              }
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl px-4 py-3 text-sm font-medium text-slate-50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none"
            >
              <option value="en">English (US)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </section>

      {/* READER DEFAULTS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--border-default)]">
          <BookOpen size={18} className="text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-50 uppercase tracking-wider">
            Reader Defaults
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Type size={14} /> Font Family
              </label>
              <select
                value={formData.reader.fontFamily}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reader: { ...formData.reader, fontFamily: e.target.value },
                  })
                }
                className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 text-sm font-medium text-slate-50 focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="Inter">Inter (Sans-serif)</option>
                <option value="Merriweather">Merriweather (Serif)</option>
                <option value="Fira Code">Fira Code (Monospace)</option>
                <option value="OpenDyslexic">OpenDyslexic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Settings size={14} /> Reader Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: "light",
                    label: "Light",
                    color: "bg-white text-slate-900 border-slate-200",
                  },
                  {
                    id: "sepia",
                    label: "Sepia",
                    color: "bg-[#f4ecd8] text-[#5b4636] border-[#e2d5b8]",
                  },
                  {
                    id: "dark",
                    label: "Dark",
                    color: "bg-slate-900 text-slate-100 border-slate-700",
                  },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        reader: { ...formData.reader, theme: theme.id as any },
                      })
                    }
                    className={`py-2 rounded-lg border text-xs font-bold transition-all ${theme.color} ${
                      formData.reader.theme === theme.id
                        ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-[var(--surface-default)]"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                Font Size
              </label>
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={parseInt(formData.reader.fontSize)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reader: {
                      ...formData.reader,
                      fontSize: `${e.target.value}px`,
                    },
                  })
                }
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs font-medium text-slate-500 mt-1">
                <span>Small</span>
                <span>{formData.reader.fontSize}</span>
                <span>Large</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <AlignLeft size={14} /> Text Alignment
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      reader: { ...formData.reader, textAlignment: "left" },
                    })
                  }
                  className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                    formData.reader.textAlignment === "left"
                      ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-400"
                      : "bg-[var(--surface-raised)] border-[var(--border-default)] text-slate-400"
                  }`}
                >
                  Left Align
                </button>
                <button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      reader: { ...formData.reader, textAlignment: "justify" },
                    })
                  }
                  className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                    formData.reader.textAlignment === "justify"
                      ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-400"
                      : "bg-[var(--surface-raised)] border-[var(--border-default)] text-slate-400"
                  }`}
                >
                  Justify
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Expand size={14} /> Line Height
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={formData.reader.lineHeight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reader: {
                      ...formData.reader,
                      lineHeight: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full accent-indigo-500"
              />
              <div className="text-xs font-medium text-slate-500 text-center mt-1">
                {formData.reader.lineHeight}x
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl">
              <div>
                <p className="text-sm font-bold text-slate-50">Hyphenation</p>
                <p className="text-xs text-slate-400">
                  Break words across lines
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.reader.hyphenation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reader: {
                        ...formData.reader,
                        hyphenation: e.target.checked,
                      },
                    })
                  }
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* NOTIFICATIONS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--border-default)]">
          <Bell size={18} className="text-amber-400" />
          <h3 className="text-sm font-bold text-slate-50 uppercase tracking-wider">
            Notifications
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: "emailAlerts",
              label: "Email Alerts",
              desc: "Important updates via email",
              icon: Mail,
            },
            {
              id: "pushNotifications",
              label: "Push Notifications",
              desc: "Browser and app notifications",
              icon: Smartphone,
            },
            {
              id: "weeklyDigest",
              label: "Weekly Digest",
              desc: "Summary of your reading progress",
              icon: BookOpen,
            },
          ].map((item) => {
            const isChecked =
              formData.notifications[
                item.id as keyof typeof formData.notifications
              ];
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl transition-colors hover:border-[var(--border-strong)]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${isChecked ? "bg-indigo-600/10 text-indigo-400" : "bg-[var(--surface-overlay)] text-slate-500"}`}
                  >
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-50">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isChecked}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: {
                          ...formData.notifications,
                          [item.id]: e.target.checked,
                        },
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            );
          })}
        </div>
      </section>

      {/* SAVE ACTIONS */}
      <div className="flex items-center gap-3 pt-6 border-t border-[var(--border-default)]">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-6 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isPending ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
