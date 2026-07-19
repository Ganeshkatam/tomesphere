"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      containerStyle={{
        top: 24,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1e293b",
          color: "#f1f5f9",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          padding: "14px 18px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
        },
        success: {
          iconTheme: { primary: "#22c55e", secondary: "#dcfce7" },
          style: { borderColor: "rgba(34, 197, 94, 0.3)" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#fee2e2" },
          style: { borderColor: "rgba(239, 68, 68, 0.3)" },
          duration: 5000,
        },
      }}
    />
  );
}
