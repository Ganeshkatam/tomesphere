"use client";

import {
  Save,
  Loader2,
  Monitor,
  Moon,
  Sun,
  BookOpen,
  Type,
  AlignLeft,
  AlignJustify,
  Expand,
  Minus,
  Plus,
  Palette,
  Globe,
  SplitSquareHorizontal,
} from "lucide-react";
import { useState, useTransition } from "react";
import { showError, showSuccess } from "@/lib/toast";
import { updatePreferencesAction } from "../actions/preferences";
import { PreferencesDto } from "../../application/dto/PreferencesPageDto";

// ─── Reusable Primitives ────────────────────────────────────────

function SectionCard({
  icon: Icon,
  iconColor,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-default)] overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}
          >
            <Icon size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              {title}
            </h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-5 space-y-6">{children}</div>
    </section>
  );
}

function FieldLabel({
  icon: Icon,
  children,
}: {
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2.5">
      {Icon && <Icon size={13} className="opacity-60" />}
      {children}
    </label>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-default)] ${
        checked ? "bg-indigo-600" : "bg-slate-600"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function StepperControl({
  value,
  min,
  max,
  step,
  label,
  onDecrement,
  onIncrement,
}: {
  value: string;
  min: number;
  max: number;
  step: number;
  label: string;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  const numVal = parseFloat(value);
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onDecrement}
        disabled={numVal <= min}
        className="w-8 h-8 rounded-lg bg-[var(--surface-overlay)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-default)] hover:border-[var(--border-strong)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-[48px] text-center text-sm font-bold font-mono text-[var(--text-primary)]">
        {label}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={numVal >= max}
        className="w-8 h-8 rounded-lg bg-[var(--surface-overlay)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-default)] hover:border-[var(--border-strong)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────

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
        showError(res.error?.message || "Failed to update preferences");
      }
    });
  };

  const fontSizeNum = parseInt(formData.reader.fontSize) || 16;

  return (
    <div className="space-y-6">
      {/* ── APPEARANCE ─────────────────────────────────────── */}
      <SectionCard
        icon={Palette}
        iconColor="bg-indigo-500/15 text-indigo-400"
        title="Appearance"
        description="Control the visual theme and language of the application."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Selector */}
          <div>
            <FieldLabel>Theme</FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "light", icon: Sun, label: "Light" },
                { id: "dark", icon: Moon, label: "Dark" },
                { id: "system", icon: Monitor, label: "System" },
              ].map((theme) => {
                const isSelected = formData.appearance.themeMode === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        appearance: {
                          ...formData.appearance,
                          themeMode: theme.id as any,
                        },
                      })
                    }
                    className={`flex flex-col items-center gap-2.5 py-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-500/10 border-indigo-500/60 text-indigo-400 shadow-sm shadow-indigo-500/10"
                        : "bg-[var(--surface-overlay)] border-transparent text-[var(--text-tertiary)] hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)]"
                    }`}
                  >
                    <theme.icon size={22} strokeWidth={isSelected ? 2.2 : 1.8} />
                    <span className="text-xs font-bold">{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language */}
          <div>
            <FieldLabel icon={Globe}>App Language</FieldLabel>
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
              className="w-full bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all appearance-none cursor-pointer hover:border-[var(--border-strong)]"
            >
              <option value="en">English (US)</option>
              <option value="es">Espanol</option>
              <option value="fr">Francais</option>
              <option value="de">Deutsch</option>
              <option value="ja">Japanese</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>
      </SectionCard>

      {/* ── READER DEFAULTS ────────────────────────────────── */}
      <SectionCard
        icon={BookOpen}
        iconColor="bg-emerald-500/15 text-emerald-400"
        title="Reader Defaults"
        description="Configure how books and documents appear in the reader."
      >
        {/* Reader Theme */}
        <div>
          <FieldLabel icon={Palette}>Reader Theme</FieldLabel>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                id: "light",
                label: "Light",
                preview: "bg-white border-slate-200",
                dot: "bg-slate-800",
                lines: "bg-slate-200",
              },
              {
                id: "sepia",
                label: "Sepia",
                preview: "bg-[#f4ecd8] border-[#e2d5b8]",
                dot: "bg-[#5b4636]",
                lines: "bg-[#dfd3b9]",
              },
              {
                id: "dark",
                label: "Dark",
                preview: "bg-[#1e1e20] border-[#3a3a3f]",
                dot: "bg-slate-300",
                lines: "bg-[#333338]",
              },
            ].map((theme) => {
              const isSelected = formData.reader.theme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      reader: { ...formData.reader, theme: theme.id as any },
                    })
                  }
                  className={`group relative rounded-xl border-2 p-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? "border-indigo-500/60 shadow-sm shadow-indigo-500/10"
                      : "border-transparent hover:border-[var(--border-strong)]"
                  }`}
                >
                  {/* Mini page preview */}
                  <div
                    className={`w-full h-20 rounded-lg border ${theme.preview} px-3 py-2.5 flex flex-col gap-1 mb-2`}
                  >
                    <div className={`h-1 w-3/4 rounded-full ${theme.lines}`} />
                    <div className={`h-0.5 w-full rounded-full ${theme.lines}`} />
                    <div className={`h-0.5 w-full rounded-full ${theme.lines}`} />
                    <div className={`h-0.5 w-5/6 rounded-full ${theme.lines}`} />
                    <div className={`h-0.5 w-full rounded-full ${theme.lines}`} />
                    <div className={`h-0.5 w-2/3 rounded-full ${theme.lines}`} />
                  </div>
                  <span
                    className={`text-xs font-bold block text-center ${
                      isSelected
                        ? "text-indigo-400"
                        : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                    }`}
                  >
                    {theme.label}
                  </span>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-md">
                      <svg
                        viewBox="0 0 12 12"
                        className="w-3 h-3 text-white fill-current"
                      >
                        <path d="M10 3L4.5 8.5 2 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Font Family */}
          <div>
            <FieldLabel icon={Type}>Font Family</FieldLabel>
            <select
              value={formData.reader.fontFamily}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reader: { ...formData.reader, fontFamily: e.target.value },
                })
              }
              className="w-full bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all appearance-none cursor-pointer hover:border-[var(--border-strong)]"
            >
              <option value="Inter">Inter (Sans-serif)</option>
              <option value="Merriweather">Merriweather (Serif)</option>
              <option value="Fira Code">Fira Code (Monospace)</option>
              <option value="OpenDyslexic">OpenDyslexic</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <FieldLabel>Font Size</FieldLabel>
            <StepperControl
              value={String(fontSizeNum)}
              min={12}
              max={24}
              step={1}
              label={`${fontSizeNum}px`}
              onDecrement={() =>
                setFormData({
                  ...formData,
                  reader: {
                    ...formData.reader,
                    fontSize: `${Math.max(12, fontSizeNum - 1)}px`,
                  },
                })
              }
              onIncrement={() =>
                setFormData({
                  ...formData,
                  reader: {
                    ...formData.reader,
                    fontSize: `${Math.min(24, fontSizeNum + 1)}px`,
                  },
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Alignment */}
          <div>
            <FieldLabel icon={AlignLeft}>Text Alignment</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "left", icon: AlignLeft, label: "Left Align" },
                { id: "justify", icon: AlignJustify, label: "Justify" },
              ].map((opt) => {
                const isSelected = formData.reader.textAlignment === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        reader: {
                          ...formData.reader,
                          textAlignment: opt.id as any,
                        },
                      })
                    }
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-500/10 border-indigo-500/60 text-indigo-400"
                        : "bg-[var(--surface-overlay)] border-transparent text-[var(--text-tertiary)] hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)]"
                    }`}
                  >
                    <opt.icon size={14} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Line Height */}
          <div>
            <FieldLabel icon={Expand}>Line Height</FieldLabel>
            <StepperControl
              value={String(formData.reader.lineHeight)}
              min={1}
              max={3}
              step={0.1}
              label={`${formData.reader.lineHeight}x`}
              onDecrement={() =>
                setFormData({
                  ...formData,
                  reader: {
                    ...formData.reader,
                    lineHeight: Math.max(
                      1,
                      Math.round((formData.reader.lineHeight - 0.1) * 10) / 10
                    ),
                  },
                })
              }
              onIncrement={() =>
                setFormData({
                  ...formData,
                  reader: {
                    ...formData.reader,
                    lineHeight: Math.min(
                      3,
                      Math.round((formData.reader.lineHeight + 0.1) * 10) / 10
                    ),
                  },
                })
              }
            />
          </div>
        </div>

        {/* Hyphenation Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-overlay)] border border-[var(--border-default)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--surface-default)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)]">
              <SplitSquareHorizontal size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                Hyphenation
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                Automatically break words across lines for cleaner paragraph edges
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={formData.reader.hyphenation}
            onChange={(val) =>
              setFormData({
                ...formData,
                reader: { ...formData.reader, hyphenation: val },
              })
            }
          />
        </div>
      </SectionCard>

      {/* ── SAVE ACTION ────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-[var(--text-tertiary)]">
          Changes are applied after saving.
        </p>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="px-7 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 active:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none flex items-center gap-2 cursor-pointer"
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
