"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Target,
  Library,
  BookMarked,
  FolderTree
} from "lucide-react";
import type { DashboardOverviewDto } from "@/modules/account/application/queries/GetDashboardOverview/read-model";
import type { ProfileDto } from "@/modules/user/profile/application/queries/GetProfile/read-model";

interface TodayScreenProps {
  user: any;
  profileData: ProfileDto | null;
  dashboardData: DashboardOverviewDto;
}

export default function TodayScreen({
  user,
  profileData,
  dashboardData,
}: TodayScreenProps) {
  const name = profileData?.displayName || user.email?.split("@")[0] || "Reader";
  const streak = dashboardData.streak.current;
  const readingGoal = dashboardData.progress.totalBooksGoal || 12;
  const booksReadCount = dashboardData.progress.booksRead;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const currentReading = dashboardData.currentReading[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Greeting */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-50 tracking-tight">
          {getGreeting()}, {name}
        </h2>
        <p className="text-slate-400 mt-1 text-sm font-medium">
          Here is your reading and learning state for today.
        </p>
      </div>

      {/* Split Grid: Primary Tasks & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Currently Reading Card */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-indigo-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
                Continue Reading
              </span>
            </div>

            {currentReading ? (
              <div className="flex gap-4">
                <div className="relative w-20 h-28 shrink-0 rounded-xl shadow-md border border-[var(--border-subtle)] overflow-hidden">
                  <Image
                    src={
                      currentReading.cover_url ||
                      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=120"
                    }
                    alt={currentReading.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-50 truncate">
                    {currentReading.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold truncate mt-0.5">
                    {currentReading.author}
                  </p>
                  <span className="inline-block mt-3 px-2 py-0.5 bg-indigo-600/20 text-indigo-300 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {currentReading.progress}% Completed
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm text-slate-400">
                  No books currently in progress.
                </p>
                <Link
                  href="/discover"
                  className="inline-block mt-3 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Browse Library →
                </Link>
              </div>
            )}
          </div>

          {currentReading && (
            <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                Active progress tracked
              </span>
              <Link
                href={`/read/${currentReading.id}`}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shrink-0"
              >
                Open Reader
              </Link>
            </div>
          )}
        </div>

        {/* Goals Progress Widget */}
        <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-pink-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-400">
                Goals & Targets
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-50">
                  <span>Reading Goal</span>
                  <span>
                    {booksReadCount} / {readingGoal} Books
                  </span>
                </div>
                <div className="w-full bg-[var(--surface-raised)] rounded-full h-2 mt-2 overflow-hidden border border-[var(--border-subtle)]">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (booksReadCount / readingGoal) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-500/20" />
                <div>
                  <div className="text-sm font-bold text-slate-50">
                    {streak} Days
                  </div>
                  <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                    Active Reading Streak
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/me/progress"
            className="mt-6 flex items-center justify-between text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors group"
          >
            <span>View Progress Goals</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="p-6 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
            Quick Stats
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-center">
            <Library className="w-5 h-5 mx-auto text-indigo-400 fill-indigo-400/10 mb-1" />
            <div className="text-xl font-bold text-slate-50">
              {dashboardData.librarySummary.totalBooks}
            </div>
            <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Total Books
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-center">
            <BookOpen className="w-5 h-5 mx-auto text-blue-400 fill-blue-400/10 mb-1" />
            <div className="text-xl font-bold text-slate-50">
              {dashboardData.librarySummary.currentlyReadingCount}
            </div>
            <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Reading
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-center">
            <BookMarked className="w-5 h-5 mx-auto text-purple-400 fill-purple-400/10 mb-1" />
            <div className="text-xl font-bold text-slate-50">
              {dashboardData.librarySummary.wantToReadCount}
            </div>
            <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Want To Read
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-center">
            <FolderTree className="w-5 h-5 mx-auto text-emerald-400 fill-emerald-400/10 mb-1" />
            <div className="text-xl font-bold text-slate-50">
              {dashboardData.collectionsSummary.totalCollections}
            </div>
            <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Collections
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
