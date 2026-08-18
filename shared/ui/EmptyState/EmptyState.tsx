import React from "react";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-outline-variant bg-surface-container-low rounded-2xl w-full">
      {icon && (
        <div className="w-16 h-16 bg-surface dark:bg-surface-dim rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-headline-md font-bold text-on-surface mb-2">{title}</h3>
      <p className="text-body-md text-on-surface-variant max-w-md mb-8">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
