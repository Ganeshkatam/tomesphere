import React from "react";

import { DiscoveryConfiguration } from "@/modules/discovery/presentation/types/DiscoveryConfiguration";

export function DiscoveryPage({ config }: { config: DiscoveryConfiguration }) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">
          {config.title}
        </h1>
        <p className="text-[var(--text-secondary)]">
          {config.description}
        </p>
      </div>
      
      {config.gridContent}
    </div>
  );
}
