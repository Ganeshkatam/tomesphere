"use client";

import { useState, useEffect, useCallback } from "react";
import { Target, TrendingUp, Edit2, Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface ReadingGoalDto {
  id: string;
  userId: string;
  year: number;
  targetBooks: number;
  booksRead: number;
}

interface ReadingGoalProgressProps {
  userId?: string;
}

function calculateProgress(read: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((read / target) * 100), 100);
}

function getProjectedFinish(read: number, target: number): string {
  if (read === 0) return "Not enough data";
  if (read >= target) return "Goal completed!";

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const daysPassed = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysPassed === 0) return "Too early to project";

  const booksPerDay = read / daysPassed;
  const remainingBooks = target - read;
  const daysNeeded = remainingBooks / booksPerDay;

  const finishDate = new Date(now.getTime() + daysNeeded * 24 * 60 * 60 * 1000);

  if (finishDate.getFullYear() > now.getFullYear()) {
    return "Projected to miss goal";
  }

  return `On track for ${finishDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export default function ReadingGoalProgress({
  userId,
}: ReadingGoalProgressProps) {
  const [goal, setGoal] = useState<ReadingGoalDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [targetInput, setTargetInput] = useState("50");
  const [loading, setLoading] = useState(true);

  const loadGoal = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/v1/progress/goals");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json) {
          setGoal(json);
          setTargetInput(json.targetBooks.toString());
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadGoal();
    } else {
      setLoading(false);
    }
  }, [userId, loadGoal]);

  const handleCreateGoal = async () => {
    if (!userId) return;
    const target = parseInt(targetInput) || 50;
    try {
      const res = await fetch("/api/v1/progress/goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetBooks: target }),
      });
      if (res.ok) {
        setIsEditing(false);
        loadGoal(); // Reload to get fresh state
      }
    } catch (e) {
      console.error(e);
    }
  };

  const progress = goal
    ? calculateProgress(goal.booksRead, goal.targetBooks)
    : 0;
  const projected = goal
    ? getProjectedFinish(goal.booksRead, goal.targetBooks)
    : "";

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 mb-8 animate-pulse h-48" />
    );
  }

  if (!goal && !isEditing) {
    return (
      <div className="glass-card rounded-2xl p-6 mb-8">
        <div className="text-center py-8">
          <Target className="mx-auto mb-4 text-primary" size={48} />
          <h3 className="text-xl font-display font-bold mb-2">
            Set Your Reading Goal
          </h3>
          <p className="text-slate-400 mb-6">
            Challenge yourself! How many books will you read this year?
          </p>
          <button onClick={() => setIsEditing(true)} className="btn-primary">
            Set Goal
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="glass-card rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-display font-bold mb-4">
          Set Your {new Date().getFullYear()} Reading Goal
        </h3>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-[var(--border-default)] focus:border-primary focus:outline-none"
            placeholder="50"
            min="1"
          />
          <button
            onClick={handleCreateGoal}
            className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-light transition-colors flex items-center gap-2"
          >
            <Check size={20} />
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (!goal) return null;

  return (
    <div className="glass-card rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="text-primary" size={28} />
          <h2 className="text-2xl font-display font-bold">
            {new Date().getFullYear()} Reading Goal
          </h2>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Edit2 size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold">
            {goal.booksRead} / {goal.targetBooks}
          </span>
          <span className="text-lg font-medium text-primary">{progress}%</span>
        </div>

        <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-400" size={20} />
            <span className="text-sm text-slate-400">Remaining</span>
          </div>
          <div className="text-2xl font-bold">
            {Math.max(0, goal.targetBooks - goal.booksRead)}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-blue-400" size={20} />
            <span className="text-sm text-slate-400">Status</span>
          </div>
          <div className="text-sm font-medium">{projected}</div>
        </div>
      </div>

      {/* Motivational Message */}
      {progress >= 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-center"
        >
          <p className="text-green-400 font-medium">
            🎉 Goal Achieved! Congratulations!
          </p>
        </motion.div>
      )}
    </div>
  );
}
