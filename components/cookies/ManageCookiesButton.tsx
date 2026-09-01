"use client";

import React from "react";
import { Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManageCookiesButton() {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-cookie-preferences"));
    }
  };

  return (
    <Button
      type="button"
      variant="default"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/20 cursor-pointer transition-all"
    >
      <Sliders className="w-4 h-4" />
      <span>Manage Cookie Preferences</span>
    </Button>
  );
}
