import React from "react";
import { DiscoveryShell } from "../../../exp/layouts/DiscoveryShell";

export default function DiscoveryPreview() {
  return (
    <DiscoveryShell>
      <div className="h-[800px] border-2 border-dashed border-[#e4e2e2] rounded-[8px] flex flex-col items-center justify-center text-[#75777e] gap-4">
        <span className="text-xl font-serif">Discovery Main Content Area</span>
        <span>(Grids of books will go here)</span>
      </div>
    </DiscoveryShell>
  );
}
