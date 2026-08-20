"use client";

import toast from "react-hot-toast";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from "lucide-react";
import React from "react";

// Base styling for modern glassmorphism toast cards
const BASE_CARD_CLASS =
  "flex items-center gap-3.5 px-5 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.55)] border backdrop-blur-2xl transition-all duration-300 min-w-[320px] max-w-md pointer-events-auto";

const CARD_STYLE: React.CSSProperties = {
  marginRight: "28px",
  marginTop: "16px",
  marginBottom: "8px",
};

export const showError = (message: string, options?: { duration?: number; title?: string }) => {
  return toast.custom(
    (t) => (
      <div
        style={CARD_STYLE}
        className={`${
          t.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"
        } ${BASE_CARD_CLASS} bg-slate-950/90 border-rose-500/30 text-white`}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-bold text-rose-300 tracking-wide uppercase">
            {options?.title || "Error"}
          </p>
          <p className="text-xs font-medium text-slate-200 mt-0.5 leading-relaxed break-words">
            {message}
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    ),
    { position: "top-right", duration: options?.duration ?? 4000 },
  );
};

export const showSuccess = (
  message: string,
  options?: { duration?: number; title?: string },
) => {
  return toast.custom(
    (t) => (
      <div
        style={CARD_STYLE}
        className={`${
          t.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"
        } ${BASE_CARD_CLASS} bg-slate-950/90 border-emerald-500/30 text-white`}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-bold text-emerald-300 tracking-wide uppercase">
            {options?.title || "Success"}
          </p>
          <p className="text-xs font-medium text-slate-200 mt-0.5 leading-relaxed break-words">
            {message}
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    ),
    { position: "top-right", duration: options?.duration ?? 3500 },
  );
};

export const showWarning = (
  message: string,
  options?: { duration?: number; title?: string },
) => {
  return toast.custom(
    (t) => (
      <div
        style={CARD_STYLE}
        className={`${
          t.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"
        } ${BASE_CARD_CLASS} bg-slate-950/90 border-amber-500/30 text-white`}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-bold text-amber-300 tracking-wide uppercase">
            {options?.title || "Warning"}
          </p>
          <p className="text-xs font-medium text-slate-200 mt-0.5 leading-relaxed break-words">
            {message}
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    ),
    { position: "top-right", duration: options?.duration ?? 4000 },
  );
};

export const showInfo = (
  message: string,
  options?: { duration?: number; title?: string },
) => {
  return toast.custom(
    (t) => (
      <div
        style={CARD_STYLE}
        className={`${
          t.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"
        } ${BASE_CARD_CLASS} bg-slate-950/90 border-indigo-500/30 text-white`}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Info className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-bold text-indigo-300 tracking-wide uppercase">
            {options?.title || "Note"}
          </p>
          <p className="text-xs font-medium text-slate-200 mt-0.5 leading-relaxed break-words">
            {message}
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    ),
    { position: "top-right", duration: options?.duration ?? 3500 },
  );
};

export const showLoading = (message: string) => {
  return toast.custom(
    (t) => (
      <div
        style={CARD_STYLE}
        className={`${
          t.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"
        } ${BASE_CARD_CLASS} bg-slate-950/90 border-indigo-500/30 text-white`}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-bold text-indigo-300 tracking-wide uppercase">
            Please wait
          </p>
          <p className="text-xs font-medium text-slate-200 mt-0.5 leading-relaxed break-words">
            {message}
          </p>
        </div>
      </div>
    ),
    { position: "top-right", duration: Infinity },
  );
};

export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((err: Error) => string);
  },
) => {
  const toastId = showLoading(messages.loading);

  return promise
    .then((data) => {
      toast.dismiss(toastId);
      const msg = typeof messages.success === "function" ? messages.success(data) : messages.success;
      showSuccess(msg);
      return data;
    })
    .catch((err) => {
      toast.dismiss(toastId);
      const msg = typeof messages.error === "function" ? messages.error(err) : messages.error;
      showError(msg);
      throw err;
    });
};

export { toast };
