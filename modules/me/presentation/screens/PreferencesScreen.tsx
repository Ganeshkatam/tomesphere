"use client";

import React, { useState } from "react";
import ThemeToggle from "@/modules/shared/ui/ThemeToggle";
import { Settings, Bell, BookOpen, Volume2 } from "lucide-react";
import { showSuccess } from "@/lib/toast";

interface PreferencesScreenProps {
  initialProfile: any;
}

export default function PreferencesScreen({
  initialProfile,
}: PreferencesScreenProps) {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyDigest: false,
    pushNotifications: true,
  });

  const [readerSettings, setReaderSettings] = useState({
    fontFamily: "Inter",
    fontSize: "16px",
    scrollMode: "scroll",
  });

  const handleSaveNotifications = () => {
    showSuccess("Notification settings updated");
  };

  const handleSaveReader = () => {
    showSuccess("Reader appearance preferences updated");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-50">Preferences</h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure layout themes, notifications, and reader settings.
        </p>
      </div>

      {/* Visual themes Preferences */}
      <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-slate-50">
              Theme Appearance
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              Change display color scheme
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
          <span className="text-sm text-slate-300 font-bold">Theme Mode</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Notification settings */}
      <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-pink-400" />
          <div>
            <h3 className="text-base font-bold text-slate-50">Notifications</h3>
            <p className="text-xs text-slate-400 font-semibold">
              Manage alerts and newsletters
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-50">
                Email Alerts
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                Receive emails when you earn badges or progress goals
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailAlerts}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  emailAlerts: e.target.checked,
                })
              }
              className="w-5 h-5 accent-indigo-650 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-50">
                Weekly Digest
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                Weekly summaries of read books and study progress statistics
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications.weeklyDigest}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  weeklyDigest: e.target.checked,
                })
              }
              className="w-5 h-5 accent-indigo-650 rounded"
            />
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={handleSaveNotifications}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Save Notification settings
          </button>
        </div>
      </div>

      {/* Reader Preferences */}
      <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-slate-50">
              Reader Settings
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              Customize default layout margins and fonts in reader
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Default Font Family
            </label>
            <select
              value={readerSettings.fontFamily}
              onChange={(e) =>
                setReaderSettings({
                  ...readerSettings,
                  fontFamily: e.target.value,
                })
              }
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl px-4 py-2 text-slate-50 text-sm focus:outline-none"
            >
              <option value="Inter">Sans Serif (Inter)</option>
              <option value="Outfit">Outfit (Display)</option>
              <option value="Serif">Serif</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Default Text Size
            </label>
            <select
              value={readerSettings.fontSize}
              onChange={(e) =>
                setReaderSettings({
                  ...readerSettings,
                  fontSize: e.target.value,
                })
              }
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl px-4 py-2 text-slate-50 text-sm focus:outline-none"
            >
              <option value="14px">Small (14px)</option>
              <option value="16px">Normal (16px)</option>
              <option value="18px">Medium (18px)</option>
              <option value="20px">Large (20px)</option>
            </select>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={handleSaveReader}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Save Reader settings
          </button>
        </div>
      </div>
    </div>
  );
}
