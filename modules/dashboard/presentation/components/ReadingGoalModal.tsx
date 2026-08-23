"use client";

import { useState } from "react";
import { Target, X, Plus, BookOpen, Clock, FileText, Check, Loader2, Trash2 } from "lucide-react";
import { saveReadingGoalAction, deleteReadingGoalAction } from "../actions/goals";
import { showSuccess, showError } from "@/lib/toast";

export interface ReadingGoalEditData {
  id?: string;
  goalType: "books_per_year" | "books_per_month" | "pages_per_day" | "pages_per_week" | "custom";
  targetValue: number;
}

interface ReadingGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoal?: ReadingGoalEditData | null;
  onSaved?: () => void;
}

const GOAL_TYPES = [
  {
    type: "books_per_year" as const,
    label: "Books per Year",
    description: "Annual volume challenge",
    unit: "books",
    presets: [12, 24, 36, 50, 100],
    defaultTarget: 24,
    icon: Target,
  },
  {
    type: "books_per_month" as const,
    label: "Books per Month",
    description: "Monthly pace target",
    unit: "books",
    presets: [1, 2, 4, 6, 8],
    defaultTarget: 2,
    icon: BookOpen,
  },
  {
    type: "pages_per_day" as const,
    label: "Pages per Day",
    description: "Daily reading consistency",
    unit: "pages",
    presets: [10, 20, 30, 50, 100],
    defaultTarget: 30,
    icon: FileText,
  },
  {
    type: "pages_per_week" as const,
    label: "Pages per Week",
    description: "Weekly page quota",
    unit: "pages",
    presets: [50, 100, 200, 350, 500],
    defaultTarget: 150,
    icon: Clock,
  },
];

export default function ReadingGoalModal({
  isOpen,
  onClose,
  initialGoal,
  onSaved,
}: ReadingGoalModalProps) {
  const isEditing = !!initialGoal?.id;
  const [selectedType, setSelectedType] = useState<
    "books_per_year" | "books_per_month" | "pages_per_day" | "pages_per_week" | "custom"
  >(initialGoal?.goalType || "books_per_year");
  const [targetValue, setTargetValue] = useState<number>(
    initialGoal?.targetValue || 24,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const currentTypeConfig =
    GOAL_TYPES.find((g) => g.type === selectedType) || GOAL_TYPES[0];

  const handleTypeChange = (
    newType: "books_per_year" | "books_per_month" | "pages_per_day" | "pages_per_week" | "custom",
  ) => {
    setSelectedType(newType);
    const config = GOAL_TYPES.find((g) => g.type === newType);
    if (config) {
      setTargetValue(config.defaultTarget);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetValue || targetValue <= 0) {
      showError("Please enter a valid target number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveReadingGoalAction({
        goalId: initialGoal?.id,
        goalType: selectedType,
        targetValue,
      });

      if (res.success) {
        showSuccess(isEditing ? "Reading goal updated!" : "Reading goal created!");
        onSaved?.();
        onClose();
      } else {
        showError(res.error.message || "Failed to save reading goal.");
      }
    } catch (err: any) {
      showError(err.message || "Failed to save reading goal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialGoal?.id) return;
    setIsDeleting(true);
    try {
      const res = await deleteReadingGoalAction(initialGoal.id);
      if (res.success) {
        showSuccess("Reading goal removed.");
        onSaved?.();
        onClose();
      } else {
        showError(res.error.message || "Failed to remove reading goal.");
      }
    } catch (err: any) {
      showError(err.message || "Failed to remove reading goal.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/60 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <Target size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEditing ? "Modify Reading Goal" : "Set Reading Goal"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track and build your consistent reading habit
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Goal Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Goal Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GOAL_TYPES.map((typeConfig) => {
                const Icon = typeConfig.icon;
                const isSelected = selectedType === typeConfig.type;
                return (
                  <button
                    key={typeConfig.type}
                    type="button"
                    onClick={() => handleTypeChange(typeConfig.type)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">
                        {typeConfig.label}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {typeConfig.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Value Input & Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Target ({currentTypeConfig.unit})
            </label>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              {currentTypeConfig.presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTargetValue(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    targetValue === preset
                      ? "bg-pink-600 border-pink-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {preset} {currentTypeConfig.unit}
                </button>
              ))}
            </div>

            {/* Custom Input Field */}
            <div className="relative">
              <input
                type="number"
                min={1}
                max={10000}
                value={targetValue || ""}
                onChange={(e) => setTargetValue(parseInt(e.target.value, 10) || 0)}
                placeholder="Enter target number"
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 uppercase">
                {currentTypeConfig.unit}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
                className="px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || isDeleting}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isDeleting || targetValue <= 0}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} strokeWidth={2.5} />
                )}
                <span>{isEditing ? "Save Changes" : "Set Goal"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
