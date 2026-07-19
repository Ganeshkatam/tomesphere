"use client";

import { Target, Star, Globe } from "lucide-react";
import Image from "next/image";

import { CurrentlyReadingOutput } from "@/modules/shared/core/types/LibraryReadModels";

interface ProfileOverviewProps {
  stats: any;
  formData: any;
  profile: any;
  user?: any;
  recentBooks?: CurrentlyReadingOutput[];
}

export default function ProfileOverview({
  stats,
  formData,
  profile,
  user,
  recentBooks = [],
}: ProfileOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Reading Progress */}
        <div className="glass-strong rounded-2xl p-6 border border-[var(--border-default)]">
          <h3 className="text-xl font-bold text-slate-50 mb-4 flex items-center gap-2">
            <Target className="text-indigo-400" />
            Reading Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[var(--text-secondary)]">
                  Annual Goal
                </span>
                <span className="text-slate-50 font-bold">
                  {stats.booksRead} / {formData.reading_goal} books
                </span>
              </div>
              <div className="h-3 bg-[var(--border-default)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                  style={{
                    width: `${Math.min((stats.booksRead / formData.reading_goal) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recently Read */}
        <div className="glass-strong rounded-2xl p-6 border border-[var(--border-default)]">
          <h3 className="text-xl font-bold text-slate-50 mb-4">
            Recently Read
          </h3>
          <div className="space-y-3">
            {recentBooks.length > 0 ? (
              recentBooks.map((item, i) => {
                const book = item.book;
                if (!book) return null;
                return (
                  <div
                    key={i}
                    className="flex gap-4 p-3 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg hover:bg-[var(--surface-overlay)] transition-colors"
                  >
                    {book.coverUrl ? (
                      <div className="relative w-12 h-16 shrink-0">
                        <Image
                          src={book.coverUrl}
                          alt={book.title}
                          fill
                          sizes="(max-width: 768px) 33vw, 20vw"
                          unoptimized={true}
                          className="object-cover rounded shadow"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded flex items-center justify-center text-xs text-white/50 text-center p-1">
                        No Cover
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-50 font-medium truncate">
                        {book.title}
                      </h4>
                      <p className="text-sm text-slate-400 truncate">
                        {book.author}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star
                          size={14}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-xs text-slate-400">Finished</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400 text-sm italic">
                No books read yet. Start exploring the library!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Profile Details */}
        <div className="glass-strong rounded-2xl p-6 border border-[var(--border-default)]">
          <h3 className="text-lg font-bold text-slate-50 mb-4">
            Profile Details
          </h3>
          <div className="space-y-3 text-sm">
            {formData.location && (
              <div className="flex justify-between">
                <span className="text-slate-400">Location</span>
                <span className="text-slate-50">{formData.location}</span>
              </div>
            )}
            {formData.date_of_birth && (
              <div className="flex justify-between">
                <span className="text-slate-400">Birthday</span>
                <span className="text-slate-50">
                  {new Date(formData.date_of_birth).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Member Since</span>
              <span className="text-slate-50">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="glass-strong rounded-2xl p-6 border border-[var(--border-default)]">
          <h3 className="text-lg font-bold text-slate-50 mb-4">Badges</h3>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-3">
              {stats.badges && stats.badges.length > 0 ? (
                stats.badges.map((badge: any) => (
                  <div
                    key={badge.id}
                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex flex-col items-center justify-center hover:scale-110 transition-transform cursor-help"
                    title={`${badge.name}: ${badge.description}`}
                  >
                    <span className="text-2xl drop-shadow-md">{badge.icon}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-sm text-[var(--text-tertiary)]">
                  No badges earned yet. Keep reading!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
