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
  description: string;
  gridContent: React.ReactNode;
}
