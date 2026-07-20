import React from "react";
import { WorkspaceShell } from "../../../exp/layouts/WorkspaceShell";

export default function WorkspacePreview() {
  return (
    <WorkspaceShell>
      <div className="h-[800px] border-2 border-dashed border-[#e4e2e2] rounded-[8px] flex flex-col items-center justify-center text-[#75777e] gap-4">
        <span className="text-xl font-serif">Workspace Main Content Area</span>
        <span>(Personal library and dashboard widgets will go here)</span>
      </div>
    </WorkspaceShell>
  );
}
