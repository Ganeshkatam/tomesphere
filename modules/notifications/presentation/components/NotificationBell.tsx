"use client";

import { useState, useEffect } from "react";
import { Bell, Check, CheckCircle2, Info, AlertCircle, AlertTriangle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { getUnreadNotifications, markAsRead, markAllAsRead } from "../actions/notifications";
import { Notification } from "../../domain/Notification";
import { showError } from "@/lib/toast";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Fetch unread notifications on mount and whenever the pathname changes
  useEffect(() => {
    let mounted = true;
    const fetchNotifications = async () => {
      setLoading(true);
      const result = await getUnreadNotifications();
      if (mounted) {
        if (result.success && result.data) {
          setNotifications(result.data);
        }
        setLoading(false);
      }
    };
    fetchNotifications();
    return () => { mounted = false; };
  }, [pathname]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await markAsRead(id);
    if (result.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } else {
      showError("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) return;
    const result = await markAllAsRead();
    if (result.success) {
      setNotifications([]);
      setIsOpen(false);
    } else {
      showError("Failed to mark all as read");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS": return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "WARNING": return <AlertTriangle size={16} className="text-amber-500" />;
      case "ERROR": return <AlertCircle size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-indigo-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)] transition-all"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[var(--surface-floating)] border border-[var(--border-default)] rounded-2xl shadow-[var(--shadow-dropdown)] z-50 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--surface-default)] shrink-0">
              <h3 className="font-semibold text-[var(--text-primary)] text-sm">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-indigo-500 hover:text-indigo-400 font-medium flex items-center gap-1"
                >
                  <Check size={14} />
                  Mark all read
                </button>
              )}
            </div>

            <div className="overflow-y-auto p-2 space-y-1 bg-[var(--surface-default)] min-h-[100px]">
              {loading ? (
                <div className="text-center text-xs text-[var(--text-tertiary)] py-8">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center text-xs text-[var(--text-tertiary)] py-8">
                  No new notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex gap-3 p-3 rounded-xl hover:bg-[var(--surface-overlay)] transition-colors group relative"
                  >
                    <div className="shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)] mb-0.5">
                        {notification.title}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                        {notification.body}
                      </p>
                      <p className="text-[10px] text-[var(--text-tertiary)] mt-1.5">
                        {new Date(notification.createdAt).toLocaleDateString(undefined, { 
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      className="absolute right-3 top-3 p-1 rounded-md opacity-0 group-hover:opacity-100 bg-[var(--surface-default)] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)] transition-all text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                      title="Mark as read"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-default)] p-2 shrink-0">
              <button 
                className="w-full py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] rounded-lg transition-colors"
                onClick={() => { setIsOpen(false); /* Router push to full notifications page if it existed */ }}
              >
                View full history
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
