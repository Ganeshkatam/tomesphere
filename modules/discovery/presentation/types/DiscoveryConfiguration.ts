import React from "react";

export type DiscoveryMode =
  | "overview"
  | "authors"
  | "collections"
  | "featured"
  | "new"
  | "trending";

export type DiscoveryCategory = Exclude<DiscoveryMode, "overview">;

export interface DiscoveryConfiguration {
  mode: DiscoveryMode;
  title: string;
  subtitle?: string;
  description: string;
  totalCount?: number;
  gridContent: React.ReactNode;
}
