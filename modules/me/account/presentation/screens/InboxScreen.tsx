"use client";

import { useState } from "react";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationAction,
} from "@/modules/user/profile/presentation/actions/notifications";
import { Bell, Check, Trash2, MailOpen } from "lucide-react";
import { showSuccess, showError } from "@/lib/toast";

interface Notification {
  id: string;
  title: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface InboxScreenProps {
  initialNotifications: Notification[];
  user: any;
}

export default function InboxScreen({
  initialNotifications,
  user,
}: InboxScreenProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const markAsRead = async (id: string) => {
    try {
      const res = await markNotificationAsRead(id);
      if (!res.success) {
        showError(res.error.message || "Failed to mark notification as read");
        return;
      }
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      showSuccess("Notification marked as read");
    } catch (err) {
      showError("Failed to mark notification as read");
    }
  };

  const markAllRead = async () => {
    try {
      const res = await markAllNotificationsAsRead();
      if (!res.success) {
        showError(res.error.message || "Failed to mark all as read");
        return;
      }
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      showSuccess("All notifications marked as read");
    } catch (err) {
      showError("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await deleteNotificationAction(id);
      if (!res.success) {
        showError(res.error.message || "Failed to delete notification");
        return;
      }
      setNotifications(notifications.filter((n) => n.id !== id));
      showSuccess("Notification deleted");
    } catch (err) {
      showError("Failed to delete notification");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inbox Updates</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Milestones, alerts, and system notifications.
          </p>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="px-4 py-2 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <MailOpen size={14} />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* List of items */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-all shadow-xs ${
                n.read
                  ? "bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800"
                  : "bg-white dark:bg-slate-950 border-indigo-200 dark:border-indigo-500/30 ring-1 ring-indigo-500/10"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  n.read
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                    : "bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400"
                }`}
              >
                <Bell size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3">
                  <h4
                    className={`text-sm font-bold truncate ${n.read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white"}`}
                  >
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                  {n.content}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer"
                    title="Mark as read"
                  >
                    <Check size={14} />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  title="Delete notification"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              No notifications yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
